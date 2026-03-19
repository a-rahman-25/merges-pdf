import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Combine, Loader2, RotateCcw, GripVertical, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import DropZone from '@/components/DropZone';

type Layout = 'horizontal' | 'vertical' | 'grid';
type OutputFormat = 'png' | 'jpeg' | 'webp';

interface ImageItem {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
}

function loadImage(file: File): Promise<{ url: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ url, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
}

const MergeImagesComponent = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [layout, setLayout] = useState<Layout>('horizontal');
  const [gap, setGap] = useState(0);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [quality, setQuality] = useState(92);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  const handleFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) { toast.error('Please select image files.'); return; }

    const newItems: ImageItem[] = [];
    for (const f of imageFiles) {
      try {
        const { url, width, height } = await loadImage(f);
        newItems.push({ id: crypto.randomUUID(), file: f, url, width, height });
      } catch { toast.error(`Failed to load: ${f.name}`); }
    }
    setImages(prev => [...prev, ...newItems]);
    setResultUrl(null);
    toast.success(`Added ${newItems.length} image(s)`);
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => {
      const item = prev.find(i => i.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter(i => i.id !== id);
    });
    setResultUrl(null);
  };

  const handleDragStart = (idx: number) => { dragItem.current = idx; };
  const handleDragEnter = (idx: number) => { dragOver.current = idx; };
  const handleDragEnd = () => {
    if (dragItem.current === null || dragOver.current === null) return;
    const copy = [...images];
    const [removed] = copy.splice(dragItem.current, 1);
    copy.splice(dragOver.current, 0, removed);
    setImages(copy);
    dragItem.current = null;
    dragOver.current = null;
    setResultUrl(null);
  };

  const handleMerge = async () => {
    if (images.length < 2) { toast.error('Add at least 2 images.'); return; }
    setProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      const cols = layout === 'grid' ? Math.ceil(Math.sqrt(images.length)) : (layout === 'horizontal' ? images.length : 1);
      const rows = layout === 'grid' ? Math.ceil(images.length / cols) : (layout === 'vertical' ? images.length : 1);

      // Normalize all images to uniform cell size based on max dimensions
      const maxW = Math.max(...images.map(i => i.width));
      const maxH = Math.max(...images.map(i => i.height));

      canvas.width = cols * maxW + (cols - 1) * gap;
      canvas.height = rows * maxH + (rows - 1) * gap;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const loadedImgs = await Promise.all(images.map(item => {
        return new Promise<HTMLImageElement>((res, rej) => {
          const img = new Image();
          img.onload = () => res(img);
          img.onerror = rej;
          img.src = item.url;
        });
      }));

      loadedImgs.forEach((img, i) => {
        let col: number, row: number;
        if (layout === 'horizontal') { col = i; row = 0; }
        else if (layout === 'vertical') { col = 0; row = i; }
        else { col = i % cols; row = Math.floor(i / cols); }

        const x = col * (maxW + gap);
        const y = row * (maxH + gap);

        // Center the image within its cell
        const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        const dx = x + (maxW - dw) / 2;
        const dy = y + (maxH - dh) / 2;

        ctx.drawImage(img, dx, dy, dw, dh);
      });

      const mimeType = `image/${outputFormat}`;
      const q = outputFormat === 'png' ? undefined : quality / 100;
      const blob = await new Promise<Blob>((res, rej) => canvas.toBlob(b => b ? res(b) : rej('Failed'), mimeType, q));
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      toast.success('Images merged!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to merge images.');
    } finally {
      setProcessing(false);
    }
  };

  const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `merged-image.${ext}`;
    a.click();
    toast.success('Downloaded!');
  };

  const reset = () => {
    images.forEach(i => URL.revokeObjectURL(i.url));
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setImages([]);
    setResultUrl(null);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <AnimatePresence mode="wait">
        {!resultUrl ? (
          <motion.div key="input" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <DropZone onFiles={handleFiles} accept=".jpg,.jpeg,.png,.webp,.bmp" label="Drag & drop images here" sublabel="JPG, PNG, WEBP · multiple files supported" />

            {images.length > 0 && (
              <>
                <div className="space-y-2">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragEnter={() => handleDragEnter(idx)}
                      onDragEnd={handleDragEnd}
                      onDragOver={e => e.preventDefault()}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 transition-colors hover:bg-accent/50"
                    >
                      <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                      <img src={img.url} alt={img.file.name} className="h-12 w-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{img.file.name}</p>
                        <p className="text-xs text-muted-foreground">{img.width} × {img.height}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeImage(img.id)} className="shrink-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Layout</label>
                    <Select value={layout} onValueChange={(v) => setLayout(v as Layout)}>
                      <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="horizontal">Horizontal</SelectItem>
                        <SelectItem value="vertical">Vertical</SelectItem>
                        <SelectItem value="grid">Grid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Gap (px)</label>
                    <Input type="number" min={0} max={100} value={gap} onChange={e => setGap(Number(e.target.value))} className="w-[100px]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Background</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-10 w-10 cursor-pointer rounded-lg border border-input" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Format</label>
                    <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as OutputFormat)}>
                      <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpeg">JPG</SelectItem>
                        <SelectItem value="webp">WEBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {outputFormat !== 'png' && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Quality ({quality}%)</label>
                      <Input type="range" min={10} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-[120px] h-10" />
                    </div>
                  )}

                <Button onClick={handleMerge} disabled={processing || images.length < 2} size="lg" className="w-full gap-2 text-base font-semibold h-14 rounded-xl">
                  {processing ? <><Loader2 className="h-5 w-5 animate-spin" /> Merging…</> : <><Combine className="h-5 w-5" /> Merge {images.length} Images</>}
                </Button>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-medium text-foreground">Merged Image</span>
                <span className="text-xs text-muted-foreground">{images.length} images</span>
              </div>
              <div className="p-4 flex justify-center" style={{ background: `repeating-conic-gradient(hsl(var(--muted)) 0% 25%, transparent 0% 50%) 50% / 16px 16px` }}>
                <img src={resultUrl} alt="Merged result" className="max-w-full max-h-[500px] rounded-lg" />
              </div>
            </div>
            <Button onClick={downloadResult} size="lg" className="w-full gap-2 text-base font-semibold h-14 rounded-xl">
              <Download className="h-5 w-5" /> Download {ext.toUpperCase()}
            </Button>
            <Button onClick={reset} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
              <RotateCcw className="h-4 w-4" /> Merge More Images
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MergeImagesComponent;
