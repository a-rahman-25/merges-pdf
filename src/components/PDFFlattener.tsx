import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Loader2, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { getPageCount, flattenPDF, downloadBlob, formatFileSize, SUPPORT_EMAIL } from '@/lib/pdf-utils';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';
import { logToolUsage } from '@/lib/analytics';

const PDFFlattener = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number | null } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ data: Uint8Array; originalSize: number } | null>(null);

  const doDownload = useCallback((filename?: string) => {
    if (!result || !file) return;
    downloadBlob(result.data, filename || file.name.replace(/\.pdf$/i, '_flattened.pdf'));
    toast.success('Downloaded!');
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'PDF Flattener');

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    let pageCount: number | null = null;
    try { pageCount = await getPageCount(f); } catch {}
    setFile({ file: f, name: f.name, size: f.size, pageCount });
    setResult(null);
    toast.success(`Selected: ${f.name}`);
  }, []);

  const handleFlatten = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const data = await flattenPDF(file.file);
      setResult({ data, originalSize: file.size });
      toast.success('PDF flattened!');
      logToolUsage('PDF Flattener', '/flatten');
    } catch (err) {
      toast.error(`Failed to flatten PDF. Contact ${SUPPORT_EMAIL} for help.`);
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file && <DropZone onFiles={addFile} disabled={processing} />}
      <AnimatePresence>
        {file && !result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-muted-foreground">Selected file</p>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Change file
              </button>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-card p-3 pr-4 border border-border">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                  {file.pageCount !== null && ` · ${file.pageCount} page${file.pageCount !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">Flattening removes form fields, annotations, and layers, making the PDF non-editable.</p>
            <Button onClick={handleFlatten} disabled={processing} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
              {processing ? (<><Loader2 className="h-5 w-5 animate-spin" />Flattening…</>) : (<><Layers className="h-5 w-5" />Flatten PDF</>)}
            </Button>
          </motion.div>
        )}
        {file && result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <PDFPreviewDownload
              pdfData={result.data}
              defaultFilename={file.name.replace(/\.pdf$/i, '_flattened.pdf')}
              onDownload={(filename) => triggerDownload(filename)}
              summaryItems={[
                { label: 'Original Size', value: formatFileSize(result.originalSize) },
                { label: 'Output Size', value: formatFileSize(result.data.length) },
              ]}
            />
            <div className="flex justify-center">
              <Button onClick={reset} variant="outline" className="rounded-xl"><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ReviewDialog open={showReview} toolName="PDF Flattener" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFFlattener;
