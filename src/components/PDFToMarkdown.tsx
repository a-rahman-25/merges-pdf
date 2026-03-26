import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileCode, Loader2, RotateCcw, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/pdf-utils';
import { extractPdfText } from '@/lib/pdf-text-extract';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import PreDownloadSummary from '@/components/PreDownloadSummary';
import { logToolUsage } from '@/lib/analytics';

const PDFToMarkdown = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; pageCount: number; preview: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback((filename?: string) => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    saveAs(result.blob, filename || `${baseName}.md`);
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
      const md = `# ${file.name.replace(/\.pdf$/i, '')}\n\n` +
        pages.map((pageText, i) => {
          const cleaned = pageText.trim().split(/\n{2,}/).filter(Boolean).join('\n\n');
          return `## Page ${i + 1}\n\n${cleaned}`;
        }).join('\n\n---\n\n');

      const blob = new Blob([md], { type: 'text/markdown' });
      setResult({ blob, pageCount, preview: md.slice(0, 1000) });
      toast.success('Converted to Markdown!');
      logToolUsage('PDF to Markdown', '/pdf-to-markdown');
    } catch (err) {
      toast.error('Failed to convert PDF to Markdown.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const reader = new FileReader();
    reader.onload = () => {
      navigator.clipboard.writeText(reader.result as string);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    };
    reader.readAsText(result.blob);
  };

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all">
          <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4"><FileCode className="h-8 w-8 text-primary" /></div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">Select a PDF to convert</p>
              <p className="mt-1 text-sm text-muted-foreground">Convert PDF to clean Markdown format</p>
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
              <FileCode className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <Button onClick={handleConvert} disabled={processing} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
            {processing ? (<><Loader2 className="h-5 w-5 animate-spin" />Converting…</>) : (<><FileCode className="h-5 w-5" />Convert to Markdown</>)}
          </Button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <PreDownloadSummary
            title="Converted to Markdown"
            items={[
              { label: 'Source', value: file.name },
              { label: 'Pages', value: `${result.pageCount}` },
              { label: 'Output', value: file.name.replace(/\.pdf$/i, '.md') },
              { label: 'Size', value: formatFileSize(result.blob.size) },
            ]}
            onDownload={triggerDownload}
          />
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">Preview</h3>
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy all'}
              </button>
            </div>
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto font-mono">{result.preview}{result.preview.length >= 1000 ? '\n...' : ''}</pre>
          </div>
        </motion.div>
      )}
      <ReviewDialog open={showReview} toolName="PDF to Markdown" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFToMarkdown;
