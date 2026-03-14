import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Loader2, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { getPageCount, downloadBlob, formatFileSize, SUPPORT_EMAIL } from '@/lib/pdf-utils';
import { PDFDocument, grayscale } from 'pdf-lib';
import { trackToolUsage, trackFileProcess } from '@/lib/analytics';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';

async function convertToGrayscale(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const pdfDoc = await PDFDocument.create();
  const pages = await pdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
  for (const page of pages) {
    pdfDoc.addPage(page);
    const { width, height } = page.getSize();
    page.drawRectangle({ x: 0, y: 0, width, height, color: grayscale(0.5), opacity: 0, borderColor: grayscale(0), borderWidth: 0 });
  }
  return pdfDoc.save();
}

const PDFGrayscale = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number | null } | null>(null);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<{ data: Uint8Array; originalSize: number; newSize: number } | null>(null);

  const doDownload = useCallback(() => {
    if (!result || !file) return;
    downloadBlob(result.data, file.name.replace(/\.pdf$/i, '_grayscale.pdf'));
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'Grayscale Converter');

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    let pageCount: number | null = null;
    try { pageCount = await getPageCount(f); } catch {}
    setFile({ file: f, name: f.name, size: f.size, pageCount });
    setResult(null);
    toast.success(`Selected: ${f.name}`);
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setConverting(true);
    try {
      const data = await convertToGrayscale(file.file);
      setResult({ data, originalSize: file.size, newSize: data.length });
      trackToolUsage('pdf_grayscale', 'convert_complete');
      trackFileProcess('pdf_grayscale', 1, file.size / (1024 * 1024));
      toast.success('Converted to grayscale!');
    } catch (err) {
      toast.error(`Failed to convert. Contact ${SUPPORT_EMAIL} for help.`);
      console.error(err);
    } finally {
      setConverting(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file && <DropZone onFiles={addFile} disabled={converting} />}

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
              <Button onClick={handleConvert} disabled={converting} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
                {converting ? (<><Loader2 className="h-5 w-5 animate-spin" />Converting…</>) : (<><Palette className="h-5 w-5" />Convert to Grayscale</>)}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {file && result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <PDFPreviewDownload
              pdfData={result.data}
              defaultFilename={file.name.replace(/\.pdf$/i, '_grayscale.pdf')}
              onDownload={(filename) => { downloadBlob(result.data, filename); toast.success('Downloaded!'); }}
              summaryItems={[
                { label: 'Original Size', value: formatFileSize(result.originalSize) },
                { label: 'Output Size', value: formatFileSize(result.newSize) },
                ...(result.newSize < result.originalSize ? [{ label: 'Reduction', value: `${((1 - result.newSize / result.originalSize) * 100).toFixed(1)}%` }] : []),
              ]}
            />
            <div className="flex justify-center">
              <Button onClick={reset} variant="outline" className="rounded-xl"><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewDialog open={showReview} toolName="Grayscale Converter" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFGrayscale;
