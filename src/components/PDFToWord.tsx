import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/pdf-utils';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import PreDownloadSummary from '@/components/PreDownloadSummary';
import { logToolUsage } from '@/lib/analytics';

const PDFToWord = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; pageCount: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback((filename?: string) => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    saveAs(result.blob, filename || `${baseName}.docx`);
    toast.success('Downloaded!');
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Please select a PDF file.'); return; }
    setFile({ file: f, name: f.name, size: f.size });
    setResult(null);
    toast.success(`Selected: ${f.name}`);
    e.target.value = '';
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const buffer = await file.file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const pageCount = pdf.numPages;

      const paragraphs: Paragraph[] = [
        new Paragraph({ children: [new TextRun({ text: `Converted from: ${file.name}`, bold: true, size: 28 })], spacing: { after: 300 } }),
      ];

      let totalChars = 0;
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        // Group items by line using Y coordinate from transform matrix
        const lines: { y: number; text: string }[] = [];
        for (const item of content.items as any[]) {
          const str = item.str ?? '';
          const y = Math.round((item.transform?.[5] ?? 0) * 10) / 10;
          const last = lines[lines.length - 1];
          if (last && Math.abs(last.y - y) < 2) {
            last.text += (item.hasEOL ? '\n' : '') + str;
          } else {
            lines.push({ y, text: str });
          }
        }

        paragraphs.push(
          new Paragraph({ children: [new TextRun({ text: `— Page ${i} —`, bold: true, size: 24 })], spacing: { before: 400, after: 200 } })
        );

        const pageLines = lines.flatMap(l => l.text.split('\n')).map(s => s.trim()).filter(Boolean);
        totalChars += pageLines.join(' ').length;

        if (pageLines.length === 0) {
          paragraphs.push(new Paragraph({ children: [new TextRun({ text: '[No extractable text on this page — it may be a scanned image]', italics: true, size: 20, color: '888888' })], spacing: { after: 200 } }));
        } else {
          for (const line of pageLines) {
            paragraphs.push(new Paragraph({ children: [new TextRun({ text: line, size: 22 })], spacing: { after: 80 } }));
          }
        }
      }

      if (totalChars < 50) {
        toast.warning('Very little text extracted — your PDF may be a scanned image (needs OCR).');
      }

      const doc = new Document({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      setResult({ blob, pageCount });
      toast.success('Converted to Word!');
      logToolUsage('PDF to Word', '/pdf-to-word');
    } catch (err) {
      toast.error('Failed to convert PDF to Word.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all">
          <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4"><FileText className="h-8 w-8 text-primary" /></div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">Select a PDF to convert</p>
              <p className="mt-1 text-sm text-muted-foreground">Convert PDF to Microsoft Word (.docx) format</p>
            </div>
          </div>
        </motion.div>
      ) : !result ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-medium text-muted-foreground">{file.name}</p>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-card p-3 pr-4 border border-border">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground">Note: Text is extracted directly from the PDF. Scanned/image-only PDFs require OCR (try the OCR tool first).</p>
          <Button onClick={handleConvert} disabled={processing} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
            {processing ? (<><Loader2 className="h-5 w-5 animate-spin" />Converting…</>) : (<><FileText className="h-5 w-5" />Convert to Word</>)}
          </Button>
        </motion.div>
      ) : (
        <PreDownloadSummary
          title="Converted to Word"
          items={[
            { label: 'Source', value: file.name },
            { label: 'Pages', value: `${result.pageCount}` },
            { label: 'Output', value: `${file.name.replace(/\.pdf$/i, '.docx')}` },
            { label: 'Size', value: formatFileSize(result.blob.size) },
          ]}
          onDownload={triggerDownload}
        />
      )}

      <ReviewDialog open={showReview} toolName="PDF to Word" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFToWord;
