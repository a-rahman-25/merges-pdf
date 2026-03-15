import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Loader2, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { getPageCount, rotatePDFPages, downloadBlob, formatFileSize, SUPPORT_EMAIL } from '@/lib/pdf-utils';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';

const rotations = [
  { value: 90 as const, label: '90°' },
  { value: 180 as const, label: '180°' },
  { value: 270 as const, label: '270°' },
];

const PDFRotator = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number | null } | null>(null);
  const [rotating, setRotating] = useState(false);
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);
  const [result, setResult] = useState<Uint8Array | null>(null);

  const doDownload = useCallback((filename?: string) => {
    if (!result || !file) return;
    downloadBlob(result, filename || file.name.replace(/\.pdf$/i, `_rotated_${rotation}.pdf`));
    toast.success('Downloaded!');
  }, [result, file, rotation]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'PDF Rotator');

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    let pageCount: number | null = null;
    try { pageCount = await getPageCount(f); } catch {}
    setFile({ file: f, name: f.name, size: f.size, pageCount });
    setResult(null);
    toast.success(`Selected: ${f.name}`);
  }, []);

  const handleRotate = async () => {
    if (!file) return;
    setRotating(true);
    try {
      const data = await rotatePDFPages(file.file, rotation);
      setResult(data);
      toast.success(`Rotated all pages by ${rotation}°!`);
    } catch (err) {
      toast.error(`Failed to rotate PDF. Contact ${SUPPORT_EMAIL} for help.`);
      console.error(err);
    } finally {
      setRotating(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file && <DropZone onFiles={addFile} disabled={rotating} />}

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
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground">Rotate by:</span>
              <div className="inline-flex rounded-lg border border-border bg-card p-0.5 gap-0.5">
                {rotations.map((r) => (
                  <button key={r.value} onClick={() => setRotation(r.value)}
                    className={`rounded-md px-4 py-2 text-sm font-semibold transition-all ${rotation === r.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <motion.div layout className="pt-2">
              <Button onClick={handleRotate} disabled={rotating} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
                {rotating ? (<><Loader2 className="h-5 w-5 animate-spin" />Rotating…</>) : (<><RotateCw className="h-5 w-5" />Rotate PDF</>)}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {file && result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <PDFPreviewDownload
              pdfData={result}
              defaultFilename={file.name.replace(/\.pdf$/i, `_rotated_${rotation}.pdf`)}
              onDownload={(filename) => triggerDownload(filename)}
              summaryItems={[
                { label: 'Rotation', value: `${rotation}°` },
                { label: 'Pages', value: file.pageCount !== null ? `${file.pageCount}` : 'Unknown' },
                { label: 'Output Size', value: formatFileSize(result.length) },
              ]}
            />
            <div className="flex justify-center">
              <Button onClick={reset} variant="outline" className="rounded-xl"><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewDialog open={showReview} toolName="PDF Rotator" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFRotator;
