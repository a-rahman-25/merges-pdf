import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minimize2, Loader2, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { getPageCount, compressPDF, downloadBlob, formatFileSize, SUPPORT_EMAIL } from '@/lib/pdf-utils';
import { addHistory } from '@/lib/processing-history';
import { logToolUsage } from '@/lib/analytics';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';

const PDFCompressor = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number | null } | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [result, setResult] = useState<{ data: Uint8Array; originalSize: number; newSize: number } | null>(null);

  const doDownload = useCallback((filename?: string) => {
    if (!result || !file) return;
    const name = filename || file.name.replace(/\.pdf$/i, '_compressed.pdf');
    downloadBlob(result.data, name);
    toast.success('Downloaded!');
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'PDF Compressor');

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    let pageCount: number | null = null;
    try { pageCount = await getPageCount(f); } catch {}
    setFile({ file: f, name: f.name, size: f.size, pageCount });
    setResult(null);
    toast.success(`Selected: ${f.name}`);
  }, []);

  const handleCompress = async () => {
    if (!file) return;
    setCompressing(true);
    try {
      const data = await compressPDF(file.file);
      setResult({ data, originalSize: file.size, newSize: data.length });
      const savings = ((1 - data.length / file.size) * 100).toFixed(1);
      toast.success(`Compressed! Reduced by ${savings}%`);
      addHistory({ toolName: 'PDF Compressor', toolPath: '/compress', fileName: file.name, outputName: file.name.replace(/\.pdf$/i, '_compressed.pdf'), fileSize: data.length });
    } catch (err) {
      toast.error(`Failed to compress PDF. Contact ${SUPPORT_EMAIL} for help.`);
      console.error(err);
    } finally {
      setCompressing(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file && <DropZone onFiles={addFile} disabled={compressing} />}

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
            <motion.div layout className="pt-2">
              <Button onClick={handleCompress} disabled={compressing} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
                {compressing ? (<><Loader2 className="h-5 w-5 animate-spin" />Compressing…</>) : (<><Minimize2 className="h-5 w-5" />Compress PDF</>)}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {file && result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <PDFPreviewDownload
              pdfData={result.data}
              defaultFilename={file.name.replace(/\.pdf$/i, '_compressed.pdf')}
              onDownload={(filename) => triggerDownload(filename)}
              summaryItems={[
                { label: 'Original Size', value: formatFileSize(result.originalSize) },
                { label: 'Compressed Size', value: formatFileSize(result.newSize) },
                { label: 'Reduction', value: `${((1 - result.newSize / result.originalSize) * 100).toFixed(1)}%` },
              ]}
            />
            <div className="flex justify-center">
              <Button onClick={reset} variant="outline" className="rounded-xl"><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewDialog open={showReview} toolName="PDF Compressor" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFCompressor;
