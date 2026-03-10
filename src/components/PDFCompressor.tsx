import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minimize2, Loader2, Download, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { getPageCount, compressPDF, downloadBlob, formatFileSize, SUPPORT_EMAIL } from '@/lib/pdf-utils';

const PDFCompressor = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number | null } | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [result, setResult] = useState<{ data: Uint8Array; originalSize: number; newSize: number } | null>(null);

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    let pageCount: number | null = null;
    try {
      pageCount = await getPageCount(f);
    } catch { /* ignore */ }
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
    } catch (err) {
      toast.error(`Failed to compress PDF. Contact ${SUPPORT_EMAIL} for help.`);
      console.error(err);
    } finally {
      setCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const name = file.name.replace(/\.pdf$/i, '_compressed.pdf');
    downloadBlob(result.data, name);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file && <DropZone onFiles={addFile} disabled={compressing} />}

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

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-accent/50 p-4 border border-border text-center space-y-1"
              >
                <p className="text-sm font-medium text-foreground">
                  {formatFileSize(result.originalSize)} → {formatFileSize(result.newSize)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Reduced by {((1 - result.newSize / result.originalSize) * 100).toFixed(1)}%
                </p>
              </motion.div>
            )}

            <motion.div layout className="pt-2">
              <Button
                onClick={result ? handleDownload : handleCompress}
                disabled={compressing}
                size="lg"
                className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl"
              >
                {compressing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Compressing…
                  </>
                ) : result ? (
                  <>
                    <Download className="h-5 w-5" />
                    Download Compressed PDF
                  </>
                ) : (
                  <>
                    <Minimize2 className="h-5 w-5" />
                    Compress PDF
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

export default PDFCompressor;
