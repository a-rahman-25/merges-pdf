import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Loader2, RotateCcw, X, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import PreDownloadSummary from '@/components/PreDownloadSummary';

interface ImageFile {
  file: File;
  name: string;
  size: number;
  preview: string;
}

const ImageToPDF = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ data: Uint8Array; pageCount: number } | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const doDownload = useCallback(() => {
    if (!result) return;
    downloadBlob(result.data, 'images-combined.pdf');
  }, [result]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload);

  const addFiles = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter(f => /\.(jpe?g|png|webp)$/i.test(f.name));
    if (imageFiles.length === 0) {
      toast.error('Please select JPG, PNG, or WEBP images.');
      return;
    }
    const mapped = imageFiles.map(f => ({
      file: f,
      name: f.name,
      size: f.size,
      preview: URL.createObjectURL(f),
    }));
    setImages(prev => [...prev, ...mapped]);
    setResult(null);
  }, []);

  const removeImage = (idx: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
    setResult(null);
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setImages(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIdx, 1);
      arr.splice(idx, 0, moved);
      return arr;
    });
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  const convert = async () => {
    if (images.length === 0) return;
    setProcessing(true);
    try {
      const pdf = await PDFDocument.create();
      for (const img of images) {
        const bytes = new Uint8Array(await img.file.arrayBuffer());
        let embedded;
        if (/\.png$/i.test(img.name)) {
          embedded = await pdf.embedPng(bytes);
        } else {
          embedded = await pdf.embedJpg(bytes);
        }
        const page = pdf.addPage([embedded.width, embedded.height]);
        page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
      }
      const pdfBytes = await pdf.save();
      setResult({ data: pdfBytes, pageCount: images.length });
      toast.success(`Created PDF with ${images.length} page(s)`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create PDF');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    setResult(null);
  };

  return (
    <>
      <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} />
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <PreDownloadSummary
              originalSize={images.reduce((s, i) => s + i.size, 0)}
              newSize={result.data.length}
              label={`${result.pageCount} image(s) → PDF`}
            />
            <div className="flex justify-center gap-3">
              <Button onClick={triggerDownload} size="lg" className="rounded-xl px-8">Download PDF</Button>
              <Button onClick={reset} variant="outline" size="lg" className="rounded-xl px-8">
                <RotateCcw className="mr-2 h-4 w-4" /> Start Over
              </Button>
            </div>
          </motion.div>
        ) : images.length === 0 ? (
          <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DropZone onFiles={addFiles} accept="image/jpeg,image/png,image/webp" multiple label="Drop JPG, PNG, or WEBP images here" />
          </motion.div>
        ) : (
          <motion.div key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div
                  key={img.preview}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragEnd={handleDragEnd}
                  className={`relative group rounded-xl border border-border bg-card overflow-hidden cursor-grab ${dragIdx === i ? 'opacity-50' : ''}`}
                >
                  <img src={img.preview} alt={img.name} className="w-full h-32 object-cover" />
                  <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3 text-foreground" />
                  </button>
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground truncate">{img.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(img.size)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              <Button onClick={() => document.getElementById('add-more-images')?.click()} variant="outline" className="rounded-xl">
                Add More Images
              </Button>
              <Button onClick={convert} disabled={processing} className="rounded-xl px-8">
                {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting…</> : `Convert ${images.length} Image(s) to PDF`}
              </Button>
            </div>
            <input
              id="add-more-images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => { if (e.target.files) addFiles(Array.from(e.target.files)); e.target.value = ''; }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageToPDF;
