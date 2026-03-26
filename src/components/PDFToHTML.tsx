import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Code, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/pdf-utils';
import { extractPdfText } from '@/lib/pdf-text-extract';
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import PreDownloadSummary from '@/components/PreDownloadSummary';
import { logToolUsage } from '@/lib/analytics';

const PDFToHTML = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; pageCount: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback((filename?: string) => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    saveAs(result.blob, filename || `${baseName}.html`);
    toast.success('Downloaded!');
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Please select a PDF file.'); return; }
    setFile({ file: f, name: f.name, size: f.size });
    setResult(null);
    e.target.value = '';
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const buffer = await file.file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = pdf.getPageCount();
      const text = await extractPdfText(file.file, 50000);

      const pages = text.split(/\n--- Page \d+ ---\n/).filter(Boolean);
      const htmlPages = pages.map((pageText, i) => {
        const paragraphs = pageText.split(/\n{2,}/).filter(Boolean).map(p =>
          `    <p>${p.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim()}</p>`
        ).join('\n');
        return `  <section class="page" data-page="${i + 1}">\n    <h2>Page ${i + 1}</h2>\n${paragraphs}\n  </section>`;
      }).join('\n\n');

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${file.name.replace(/\.pdf$/i, '')}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; color: #1a1a1a; }
    .page { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid #e5e5e5; }
    h2 { color: #666; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
    p { margin: 0.5rem 0; }
  </style>
</head>
<body>
  <h1>${file.name.replace(/\.pdf$/i, '')}</h1>
${htmlPages}
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html' });
      setResult({ blob, pageCount });
      toast.success('Converted to HTML!');
      logToolUsage('PDF to HTML', '/pdf-to-html');
    } catch (err) {
      toast.error('Failed to convert PDF to HTML.');
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
            <div className="rounded-xl bg-primary/10 p-4"><Code className="h-8 w-8 text-primary" /></div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">Select a PDF to convert</p>
              <p className="mt-1 text-sm text-muted-foreground">Convert PDF to clean, semantic HTML</p>
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
              <Code className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <Button onClick={handleConvert} disabled={processing} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
            {processing ? (<><Loader2 className="h-5 w-5 animate-spin" />Converting…</>) : (<><Code className="h-5 w-5" />Convert to HTML</>)}
          </Button>
        </motion.div>
      ) : (
        <PreDownloadSummary
          title="Converted to HTML"
          items={[
            { label: 'Source', value: file.name },
            { label: 'Pages', value: `${result.pageCount}` },
            { label: 'Output', value: file.name.replace(/\.pdf$/i, '.html') },
            { label: 'Size', value: formatFileSize(result.blob.size) },
          ]}
          onDownload={triggerDownload}
        />
      )}
      <ReviewDialog open={showReview} toolName="PDF to HTML" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFToHTML;
