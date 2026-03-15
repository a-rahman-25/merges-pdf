import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RotateCcw, X, GripVertical, FileUp } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';

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
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback((filename?: string) => {
    if (result) {
      downloadBlob(result.data, filename || 'images-combined.pdf');
      toast.success('Downloaded!');
    }
  }, [result]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'Image to PDF');

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
    <div className="mx-auto w-full max-w-2xl">
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <PDFPreviewDownload
              pdfData={result.data}
              defaultFilename="images-combined.pdf"
              onDownload={(filename) => { downloadBlob(result.data, filename); toast.success('Downloaded!'); }}
              summaryItems={[
                { label: 'Pages', value: `${result.pageCount}` },
                { label: 'Output Size', value: formatFileSize(result.data.length) },
              ]}
            />
            <div className="flex justify-center">
              <Button onClick={reset} variant="outline" size="lg" className="rounded-xl px-8">
                <RotateCcw className="mr-2 h-4 w-4" /> Start Over
              </Button>
            </div>
          </motion.div>
        ) : images.length === 0 ? (
          <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(Array.from(e.dataTransfer.files)); }}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
            >
              <FileUp className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium text-foreground">Drop JPG, PNG, or WEBP images here</p>
              <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
            </div>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => { if (e.target.files) addFiles(Array.from(e.target.files)); e.target.value = ''; }} />
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
              <Button onClick={() => inputRef.current?.click()} variant="outline" className="rounded-xl">
                Add More Images
              </Button>
              <Button onClick={convert} disabled={processing} className="rounded-xl px-8">
                {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting…</> : `Convert ${images.length} Image(s) to PDF`}
              </Button>
            </div>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => { if (e.target.files) addFiles(Array.from(e.target.files)); e.target.value = ''; }} />
          </motion.div>
        )}
      </AnimatePresence>
      <ReviewDialog open={showReview} toolName="Image to PDF" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default ImageToPDF;
