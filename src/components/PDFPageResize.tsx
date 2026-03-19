import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Loader2, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PDFDocument } from 'pdf-lib';
import { downloadBlob, formatFileSize, getPageCount } from '@/lib/pdf-utils';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';

const PAGE_SIZES: Record<string, [number, number]> = {
  'A4': [595.28, 841.89],
  'A3': [841.89, 1190.55],
  'A5': [419.53, 595.28],
  'Letter': [612, 792],
  'Legal': [612, 1008],
  'Tabloid': [792, 1224],
  'B5': [498.90, 708.66],
  'Executive': [522, 756],
};

const PDFPageResize = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [targetSize, setTargetSize] = useState('A4');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  const doDownload = useCallback((filename?: string) => {
    if (!result || !file) return;
    const name = filename || file.name.replace(/\.pdf$/i, `_${targetSize}.pdf`);
    downloadBlob(result, name);
    toast.success('Downloaded!');
  }, [result, file, targetSize]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'PDF Page Resize');

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    let pc = 1;
    try { pc = await getPageCount(f); } catch {}
    setFile({ file: f, name: f.name, size: f.size, pageCount: pc });
    setResult(null);
    toast.success(`Selected: ${f.name}`);
  }, []);

  const handleResize = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const buffer = await file.file.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();
      
      const [targetW, targetH] = PAGE_SIZES[targetSize];
      const srcPages = srcPdf.getPages();

      for (let i = 0; i < srcPages.length; i++) {
        const [copied] = await newPdf.copyPages(srcPdf, [i]);
        const { width: srcW, height: srcH } = srcPages[i].getSize();
        
        // Scale content to fit new page size while maintaining aspect ratio
        const scaleX = targetW / srcW;
        const scaleY = targetH / srcH;
        const scale = Math.min(scaleX, scaleY);
        
        copied.setSize(targetW, targetH);
        copied.scaleContent(scale, scale);
        
        // Center the content
        const offsetX = (targetW - srcW * scale) / 2;
        const offsetY = (targetH - srcH * scale) / 2;
        copied.translateContent(offsetX, offsetY);
        
        newPdf.addPage(copied);
      }

      const saved = await newPdf.save();
      setResult(saved);
      toast.success(`Resized ${srcPages.length} pages to ${targetSize}!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to resize PDF pages.');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div key="drop" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <DropZone onFiles={addFile} />
          </motion.div>
        ) : !result ? (
          <motion.div key="options" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-muted-foreground truncate">{file.name} · {file.pageCount} pages</p>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-card p-3 border border-border">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)} · {file.pageCount} pages</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target Page Size</label>
              <Select value={targetSize} onValueChange={setTargetSize}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(PAGE_SIZES).map(([name, [w, h]]) => (
                    <SelectItem key={name} value={name}>
                      {name} ({Math.round(w / 72 * 25.4)} × {Math.round(h / 72 * 25.4)} mm)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleResize} disabled={processing} size="lg" className="w-full gap-2 text-base font-semibold h-14 rounded-xl">
              {processing ? <><Loader2 className="h-5 w-5 animate-spin" /> Resizing…</> : <><Maximize2 className="h-5 w-5" /> Resize to {targetSize}</>}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <PDFPreviewDownload
              pdfData={result}
              filename={file.name.replace(/\.pdf$/i, `_${targetSize}.pdf`)}
              onDownload={triggerDownload}
            />
            <Button onClick={reset} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
              <RotateCcw className="h-4 w-4" /> Resize Another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFPageResize;
