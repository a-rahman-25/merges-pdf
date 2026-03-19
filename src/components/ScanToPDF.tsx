import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2, RotateCcw, Plus, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PDFDocument } from 'pdf-lib';
import { downloadBlob } from '@/lib/pdf-utils';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';

const ScanToPDF = () => {
  const [images, setImages] = useState<{ data: string; name: string }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback((filename?: string) => {
    if (!result) return;
    downloadBlob(result, filename || 'scanned_document.pdf');
    toast.success('Downloaded!');
  }, [result]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'Scan to PDF');

  const handleImages = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const promises = Array.from(files).map(f => {
      return new Promise<{ data: string; name: string }>((resolve, reject) => {
        if (!f.type.startsWith('image/')) { reject('Not an image'); return; }
        const reader = new FileReader();
        reader.onload = () => resolve({ data: reader.result as string, name: f.name });
        reader.onerror = reject;
        reader.readAsDataURL(f);
      });
    });
    Promise.all(promises).then(results => {
      setImages(prev => [...prev, ...results]);
      setResult(null);
      toast.success(`Added ${results.length} image(s)`);
    }).catch(() => toast.error('Failed to load images.'));
    e.target.value = '';
  }, []);

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleConvert = async () => {
    if (images.length === 0) return;
    setProcessing(true);
    try {
      const pdf = await PDFDocument.create();

      for (const img of images) {
        const response = await fetch(img.data);
        const bytes = await response.arrayBuffer();
        const uint8 = new Uint8Array(bytes);

        let embedded;
        if (img.data.includes('image/png')) {
          embedded = await pdf.embedPng(uint8);
        } else {
          embedded = await pdf.embedJpg(uint8);
        }

        const { width, height } = embedded;
        // Scale to fit A4 while preserving aspect ratio
        const pageW = 595.28;
        const pageH = 841.89;
        const scale = Math.min(pageW / width, pageH / height, 1);
        const scaledW = width * scale;
        const scaledH = height * scale;

        const page = pdf.addPage([pageW, pageH]);
        page.drawImage(embedded, {
          x: (pageW - scaledW) / 2,
          y: (pageH - scaledH) / 2,
          width: scaledW,
          height: scaledH,
        });
      }

      const saved = await pdf.save();
      setResult(saved);
      toast.success(`Created PDF with ${images.length} page(s)!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create PDF from scans.');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setImages([]); setResult(null); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleImages} className="hidden" />

      <AnimatePresence mode="wait">
        {images.length === 0 && !result ? (
          <motion.div key="upload" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <div
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-xl bg-primary/10 p-4"><Camera className="h-8 w-8 text-primary" /></div>
                <div>
                  <p className="text-lg font-semibold text-foreground">Upload scanned images</p>
                  <p className="mt-1 text-sm text-muted-foreground">JPG, PNG — select multiple files</p>
                </div>
              </div>
            </div>
            <Button onClick={() => cameraRef.current?.click()} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
              <Camera className="h-5 w-5" /> Take Photo with Camera
            </Button>
          </motion.div>
        ) : !result ? (
          <motion.div key="preview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-muted-foreground">{images.length} image(s) selected</p>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Clear all
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group rounded-xl border border-border overflow-hidden aspect-[3/4] bg-muted">
                  <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 p-1 rounded-lg bg-background/80 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-background/80 text-[10px] text-muted-foreground">
                    Page {i + 1}
                  </span>
                </div>
              ))}
              <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center justify-center rounded-xl border-2 border-dashed border-border aspect-[3/4] hover:border-primary/50 hover:bg-accent/30 transition-all"
              >
                <Plus className="h-6 w-6 text-muted-foreground" />
              </button>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => cameraRef.current?.click()} variant="outline" size="lg" className="flex-1 gap-2 rounded-xl">
                <Camera className="h-4 w-4" /> Camera
              </Button>
              <Button onClick={handleConvert} disabled={processing} size="lg" className="flex-1 gap-2 rounded-xl">
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                Create PDF
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <PDFPreviewDownload pdfData={result} defaultFilename="scanned_document.pdf" onDownload={triggerDownload} />
            <Button onClick={reset} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
              <RotateCcw className="h-4 w-4" /> Scan More
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} toolName="Scan to PDF" />
    </div>
  );
};

export default ScanToPDF;
