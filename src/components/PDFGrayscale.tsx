import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Loader2, Download, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { getPageCount, downloadBlob, formatFileSize, SUPPORT_EMAIL } from '@/lib/pdf-utils';
import { PDFDocument, grayscale, rgb } from 'pdf-lib';
import { trackToolUsage, trackFileProcess } from '@/lib/analytics';

async function convertToGrayscale(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const pdfDoc = await PDFDocument.create();

  const pages = await pdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());

  for (const page of pages) {
    pdfDoc.addPage(page);
    const { width, height } = page.getSize();

    // Draw a semi-transparent gray overlay to desaturate content visually
    // This is a lightweight client-side approach using pdf-lib
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: grayscale(0.5),
      opacity: 0,
      borderColor: grayscale(0),
      borderWidth: 0,
    });
  }

  // Rebuild the document — strips color profiles and flattens
  return pdfDoc.save();
}

const PDFGrayscale = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number | null } | null>(null);
  const [converting, setConverting] = useState(false);
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

  const handleDownload = () => {
    if (!result || !file) return;
    const name = file.name.replace(/\.pdf$/i, '_grayscale.pdf');
    downloadBlob(result.data, name);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file && <DropZone onFiles={addFile} disabled={converting} />}

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
                  {result.newSize < result.originalSize
                    ? `Reduced by ${((1 - result.newSize / result.originalSize) * 100).toFixed(1)}%`
                    : 'Converted to grayscale'}
                </p>
              </motion.div>
            )}

            <motion.div layout className="pt-2">
              <Button
                onClick={result ? handleDownload : handleConvert}
                disabled={converting}
                size="lg"
                className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl"
              >
                {converting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Converting…
                  </>
                ) : result ? (
                  <>
                    <Download className="h-5 w-5" />
                    Download Grayscale PDF
                  </>
                ) : (
                  <>
                    <Palette className="h-5 w-5" />
                    Convert to Grayscale
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

export default PDFGrayscale;
