import { useState, useCallback } from 'react';
import { Loader2, Link2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { downloadBlob } from '@/lib/pdf-utils';
import { logToolUsage } from '@/lib/analytics';
import { supabase } from '@/integrations/supabase/client';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';

const sanitize = (text: string) =>
  text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2022/g, '-')
    .replace(/\u00a0/g, ' ')
    .replace(/[^\x20-\x7E]/g, '');

function wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    try {
      if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    } catch {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

const UrlToPDF = () => {
  const [url, setUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('');

  const buildPdf = async (html: string, sourceUrl: string, outputName: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    doc.querySelectorAll('script, style, noscript, svg, iframe, nav, footer, header').forEach((el) => el.remove());

    const title = doc.title?.trim() || doc.querySelector('h1')?.textContent?.trim() || sourceUrl;

    const blocks: { text: string; isHeading: boolean }[] = [];
    const root = doc.querySelector('main, article') || doc.body;
    if (root) {
      root.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,blockquote,pre,td,th').forEach((el) => {
        const text = el.textContent?.replace(/\s+/g, ' ').trim();
        if (!text) return;
        blocks.push({ text, isHeading: /^H[1-6]$/.test(el.tagName) });
      });
    }
    const deduped = blocks.filter((b, i) => i === 0 || b.text !== blocks[i - 1].text);
    if (!deduped.length) throw new Error('No readable text found on that page.');

    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const pageWidth = 595, pageHeight = 842, margin = 50;
    const maxWidth = pageWidth - margin * 2;

    let page = pdf.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    for (const line of wrapText(sanitize(title), bold, 18, maxWidth)) {
      page.drawText(line, { x: margin, y, font: bold, size: 18, color: rgb(0.1, 0.1, 0.1) });
      y -= 26;
    }
    page.drawText(sanitize(sourceUrl).slice(0, 110), { x: margin, y, font, size: 9, color: rgb(0.45, 0.45, 0.5) });
    y -= 16;
    page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1, color: rgb(0.85, 0.85, 0.9) });
    y -= 20;

    for (const block of deduped) {
      const f = block.isHeading ? bold : font;
      const size = block.isHeading ? 13 : 11;
      const lh = block.isHeading ? 20 : 16;
      if (block.isHeading) y -= 8;
      for (const line of wrapText(sanitize(block.text), f, size, maxWidth)) {
        if (y < margin + lh) {
          page = pdf.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(line, { x: margin, y, font: f, size, color: rgb(0.15, 0.15, 0.15) });
        y -= lh;
      }
      y -= 4;
    }

    const bytes = await pdf.save();
    downloadBlob(bytes, outputName);
  };

  const convert = useCallback(async (filename?: string) => {
    if (!url.trim()) return;
    setProcessing(true);
    setStatus('Fetching page…');
    try {
      const { data, error } = await supabase.functions.invoke('fetch-webpage', {
        body: { url: url.trim() },
      });
      if (error) throw new Error(error.message || 'Could not fetch that page.');
      if (!data?.html) throw new Error(data?.error || 'Could not fetch that page.');

      setStatus('Building PDF…');
      const host = (() => {
        try { return new URL(data.finalUrl).hostname.replace(/^www\./, ''); } catch { return 'webpage'; }
      })();
      await buildPdf(data.html, data.finalUrl, filename || `${host}.pdf`);
      logToolUsage('URL to PDF', '/url-to-pdf');
      toast.success('Downloaded!');
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Conversion failed.');
    } finally {
      setProcessing(false);
      setStatus('');
    }
  }, [url]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(convert, 'URL to PDF');

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Link2 className="h-4 w-4 text-primary" /> Website URL
        </label>
        <Input
          type="url"
          inputMode="url"
          placeholder="https://example.com/article"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !processing && url.trim() && triggerDownload()}
          className="rounded-xl"
        />
        <p className="text-xs text-muted-foreground">
          We fetch the page text and build a clean, readable PDF. Pages behind a login or paywall can't be captured.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => triggerDownload()} disabled={!url.trim() || processing}>
            {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {status || 'Converting…'}</> : 'Convert to PDF'}
          </Button>
          {url && !processing && (
            <Button variant="outline" onClick={() => setUrl('')}>
              <RotateCcw className="mr-2 h-4 w-4" /> Clear
            </Button>
          )}
        </div>
      </div>
      <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} toolName="URL to PDF" />
    </div>
  );
};

export default UrlToPDF;
