import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { downloadBlob } from '@/lib/pdf-utils';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    const w = font.widthOfTextAtSize(test, fontSize);
    if (w > maxWidth && current) { lines.push(current); current = word; }
    else current = test;
  }
  if (current) lines.push(current);
  return lines;
}

const MarkdownToPDF = () => {
  const [markdown, setMarkdown] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback((filename?: string) => {
    if (!result) return;
    downloadBlob(result, filename || 'document.pdf');
    toast.success('Downloaded!');
  }, [result]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'Markdown to PDF');

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { setMarkdown(reader.result as string); setResult(null); toast.success(`Loaded: ${f.name}`); };
    reader.readAsText(f);
    e.target.value = '';
  }, []);

  const handleConvert = async () => {
    if (!markdown.trim()) { toast.error('Please enter some Markdown text.'); return; }
    setProcessing(true);
    try {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.TimesRoman);
      const boldFont = await pdf.embedFont(StandardFonts.TimesRomanBold);
      const monoFont = await pdf.embedFont(StandardFonts.Courier);

      const margin = 50;
      const pageW = 595.28;
      const pageH = 841.89;
      const maxW = pageW - margin * 2;

      let page = pdf.addPage([pageW, pageH]);
      let y = pageH - margin;

      const lines = markdown.split('\n');


      for (const line of lines) {
        const trimmed = line.trimEnd();

        // Heading detection
        let fontSize = 11;
        let currentFont = font;
        let color = rgb(0.1, 0.1, 0.1);
        let lineHeight = 16.5;
        let text = trimmed;

        if (trimmed.startsWith('### ')) {
          fontSize = 14; currentFont = boldFont; text = trimmed.slice(4); lineHeight = 21;
        } else if (trimmed.startsWith('## ')) {
          fontSize = 17; currentFont = boldFont; text = trimmed.slice(3); lineHeight = 25;
        } else if (trimmed.startsWith('# ')) {
          fontSize = 22; currentFont = boldFont; text = trimmed.slice(2); lineHeight = 33;
        } else if (trimmed.startsWith('```') || trimmed.startsWith('    ')) {
          currentFont = monoFont; fontSize = 9; color = rgb(0.3, 0.3, 0.3);
          text = trimmed.startsWith('```') ? trimmed.slice(3) : trimmed;
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          text = `  •  ${trimmed.slice(2)}`;
        } else if (/^\d+\.\s/.test(trimmed)) {
          // numbered list - keep as is
        } else if (trimmed.startsWith('> ')) {
          color = rgb(0.4, 0.4, 0.4);
          text = `  │  ${trimmed.slice(2)}`;
        } else if (trimmed === '---' || trimmed === '***') {
          if (y < margin + 20) { page = pdf.addPage([pageW, pageH]); y = pageH - margin; }
          y -= 10;
          page.drawLine({ start: { x: margin, y }, end: { x: pageW - margin, y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
          y -= 10;
          continue;
        }

        // Clean markdown formatting (bold, italic, code)
        text = text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/`(.+?)`/g, '$1').replace(/\[(.+?)\]\((.+?)\)/g, '$1');

        if (!text.trim()) { y -= lineHeight * 0.5; continue; }

        const wrapped = wrapText(text, currentFont, fontSize, maxW);
        for (const wl of wrapped) {
          if (y < margin) { page = pdf.addPage([pageW, pageH]); y = pageH - margin; }
          page.drawText(wl, { x: margin, y, size: fontSize, font: currentFont, color });
          y -= lineHeight;
        }
        y -= lineHeight * 0.3;
      }

      const saved = await pdf.save();
      setResult(saved);
      toast.success('Markdown converted to PDF!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to convert Markdown.');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setMarkdown(''); setResult(null); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <input ref={fileRef} type="file" accept=".md,.markdown,.txt" onChange={handleFile} className="hidden" />
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="input" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder={`# My Document

Write or paste **Markdown** here...

- Bullet points
- Are supported

> Blockquotes too!

\`\`\`
Code blocks render in monospace
\`\`\``}
              className="min-h-[300px] font-mono text-sm rounded-xl"
            />
            <div className="flex gap-3">
              <Button onClick={() => fileRef.current?.click()} variant="outline" size="lg" className="gap-2 rounded-xl">
                <FileCode className="h-4 w-4" /> Load .md File
              </Button>
              <Button onClick={handleConvert} disabled={processing || !markdown.trim()} size="lg" className="flex-1 gap-2 text-base font-semibold h-14 rounded-xl">
                {processing ? <><Loader2 className="h-5 w-5 animate-spin" /> Converting…</> : <><FileCode className="h-5 w-5" /> Convert to PDF</>}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <PDFPreviewDownload pdfData={result} defaultFilename="markdown_document.pdf" onDownload={triggerDownload} />
            <Button onClick={reset} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
              <RotateCcw className="h-4 w-4" /> Convert Another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} toolName="Markdown to PDF" />
    </div>
  );
};

export default MarkdownToPDF;
