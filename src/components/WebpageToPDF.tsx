import { useState, useCallback } from 'react';
import { Loader2, RotateCcw, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { logToolUsage } from '@/lib/analytics';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { downloadBlob } from '@/lib/pdf-utils';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';

const WebpageToPDF = () => {
  const [html, setHtml] = useState('');
  const [processing, setProcessing] = useState(false);
  const [mode, setMode] = useState<'paste' | 'file'>('paste');
  const [fileName, setFileName] = useState('');

  const doDownload = useCallback((filename?: string) => {
    if (!html) return;
    convertAndDownload(html, filename || 'webpage.pdf');
  }, [html]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'Webpage to PDF');

  const convertAndDownload = async (content: string, outputName: string) => {
    setProcessing(true);
    try {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 11;
      const margin = 50;
      const pageWidth = 595;
      const pageHeight = 842;
      const lineHeight = 16;
      const maxWidth = pageWidth - margin * 2;

      // Parse HTML to extract text content
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      
      // Get title
      const title = doc.title || doc.querySelector('h1')?.textContent || 'Webpage';
      
      // Extract structured text
      const blocks: { text: string; isHeading: boolean }[] = [];
      const walk = (el: Element) => {
        const tag = el.tagName?.toLowerCase();
        if (['script', 'style', 'noscript', 'svg'].includes(tag)) return;
        if (['h1','h2','h3','h4','h5','h6'].includes(tag)) {
          const t = el.textContent?.trim();
          if (t) blocks.push({ text: t, isHeading: true });
        } else if (['p','li','td','th','div','span','a','blockquote','pre','code'].includes(tag)) {
          const t = el.textContent?.trim();
          if (t && t.length > 0) blocks.push({ text: t, isHeading: false });
        }
        for (const child of Array.from(el.children)) walk(child);
      };
      // Only walk body children to avoid duplicates
      if (doc.body) {
        for (const child of Array.from(doc.body.children)) walk(child);
      }

      // Deduplicate consecutive identical blocks
      const deduped = blocks.filter((b, i) => i === 0 || b.text !== blocks[i - 1].text);

      let page = pdf.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      // Title
      const titleLines = wrapText(title, boldFont, 18, maxWidth);
      for (const line of titleLines) {
        page.drawText(line, { x: margin, y, font: boldFont, size: 18, color: rgb(0.1, 0.1, 0.1) });
        y -= 26;
      }
      y -= 10;
      page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1, color: rgb(0.85, 0.85, 0.9) });
      y -= 20;

      for (const block of deduped) {
        const f = block.isHeading ? boldFont : font;
        const s = block.isHeading ? 13 : fontSize;
        const lh = block.isHeading ? 20 : lineHeight;
        const lines = wrapText(block.text, f, s, maxWidth);

        if (block.isHeading) y -= 8;

        for (const line of lines) {
          if (y < margin + lh) {
            page = pdf.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
          page.drawText(line, { x: margin, y, font: f, size: s, color: rgb(0.15, 0.15, 0.15) });
          y -= lh;
        }
        y -= 4;
      }

      const pdfBytes = await pdf.save();
      downloadBlob(pdfBytes, outputName);
      toast.success('Downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Conversion failed.');
    } finally {
      setProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/\.(html?|htm)$/i.test(f.name)) {
      toast.error('Please select an HTML file.');
      return;
    }
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => setHtml(reader.result as string);
    reader.readAsText(f);
  };

  const reset = () => { setHtml(''); setFileName(''); };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex justify-center gap-2">
        <Button variant={mode === 'paste' ? 'default' : 'outline'} size="sm" onClick={() => { setMode('paste'); reset(); }}>
          Paste HTML
        </Button>
        <Button variant={mode === 'file' ? 'default' : 'outline'} size="sm" onClick={() => { setMode('file'); reset(); }}>
          Upload HTML File
        </Button>
      </div>

      {mode === 'paste' ? (
        <div className="space-y-4">
          <textarea
            className="w-full rounded-xl border border-border bg-card p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            rows={12}
            placeholder="Paste your HTML code here..."
            value={html}
            onChange={(e) => setHtml(e.target.value)}
          />
          <div className="flex justify-center gap-3">
            <Button onClick={() => triggerDownload()} disabled={!html || processing}>
              {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting…</> : 'Convert to PDF'}
            </Button>
            {html && <Button variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" /> Clear</Button>}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {!html ? (
            <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center transition hover:border-primary">
              <Globe className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-display text-lg font-semibold text-foreground">Drop HTML file here</p>
              <p className="mt-1 text-sm text-muted-foreground">Supports .html, .htm files</p>
              <input type="file" accept=".html,.htm" className="hidden" onChange={handleFileUpload} />
            </label>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-4">
              <p className="font-semibold text-foreground">{fileName}</p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => triggerDownload()} disabled={processing}>
                  {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting…</> : 'Convert to PDF'}
                </Button>
                <Button variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} toolName="Webpage to PDF" />
    </div>
  );
};

function wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    try {
      const width = font.widthOfTextAtSize(test, size);
      if (width > maxWidth && current) {
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

export default WebpageToPDF;
