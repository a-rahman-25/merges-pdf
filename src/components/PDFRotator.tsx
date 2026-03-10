import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Loader2, Download, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { getPageCount, rotatePDFPages, downloadBlob, formatFileSize, SUPPORT_EMAIL } from '@/lib/pdf-utils';

const rotations = [
  { value: 90 as const, label: '90°' },
  { value: 180 as const, label: '180°' },
  { value: 270 as const, label: '270°' },
];

const PDFRotator = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number | null } | null>(null);
  const [rotating, setRotating] = useState(false);
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);
  const [done, setDone] = useState(false);

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    let pageCount: number | null = null;
    try {
      pageCount = await getPageCount(f);
    } catch { /* ignore */ }
    setFile({ file: f, name: f.name, size: f.size, pageCount });
    setDone(false);
    toast.success(`Selected: ${f.name}`);
  }, []);

  const handleRotate = async () => {
    if (!file) return;
    setRotating(true);
    try {
      const data = await rotatePDFPages(file.file, rotation);
      const name = file.name.replace(/\.pdf$/i, `_rotated_${rotation}.pdf`);
      downloadBlob(data, name);
      setDone(true);
      toast.success(`Rotated all pages by ${rotation}° and downloaded!`);
    } catch (err) {
      toast.error(`Failed to rotate PDF. Contact ${SUPPORT_EMAIL} for help.`);
      console.error(err);
    } finally {
      setRotating(false);
    }
  };

  const reset = () => {
    setFile(null);
    setDone(false);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file && <DropZone onFiles={addFile} disabled={rotating} />}

      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-muted-foreground">Selected file</p>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Change file
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

            {/* Rotation selector */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground">Rotate by:</span>
              <div className="inline-flex rounded-lg border border-border bg-card p-0.5 gap-0.5">
                {rotations.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRotation(r.value)}
                    className={`
                      rounded-md px-4 py-2 text-sm font-semibold transition-all
                      ${rotation === r.value
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {done && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-accent/50 p-4 border border-border text-center"
              >
                <p className="text-sm font-medium text-foreground">✓ PDF rotated and downloaded</p>
              </motion.div>
            )}

            <motion.div layout className="pt-2">
              <Button
                onClick={handleRotate}
                disabled={rotating}
                size="lg"
                className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl"
              >
                {rotating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Rotating…
                  </>
                ) : done ? (
                  <>
                    <Download className="h-5 w-5" />
                    Download Again
                  </>
                ) : (
                  <>
                    <RotateCw className="h-5 w-5" />
                    Rotate & Download
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PDFRotator;
