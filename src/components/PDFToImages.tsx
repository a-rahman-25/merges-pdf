import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Loader2, RotateCcw, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { getPageCount, formatFileSize, SUPPORT_EMAIL } from '@/lib/pdf-utils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

type ImageFormat = 'png' | 'jpg';

const PDFToImages = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number | null } | null>(null);
  const [converting, setConverting] = useState(false);
  const [format, setFormat] = useState<ImageFormat>('png');
  const [scale, setScale] = useState(2);
  const [images, setImages] = useState<{ data: string; name: string }[]>([]);

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    let pageCount: number | null = null;
    try { pageCount = await getPageCount(f); } catch {}
    setFile({ file: f, name: f.name, size: f.size, pageCount });
    setImages([]);
    toast.success(`Selected: ${f.name}`);
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setConverting(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      
      const buffer = await file.file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const results: { data: string; name: string }[] = [];
      const baseName = file.name.replace(/\.pdf$/i, '');

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        
        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const dataUrl = canvas.toDataURL(mimeType, 0.92);
        results.push({ data: dataUrl, name: `${baseName}_page_${i}.${format}` });
      }

      setImages(results);
      toast.success(`Converted ${results.length} pages to ${format.toUpperCase()}!`);
    } catch (err) {
      toast.error(`Failed to convert. Contact ${SUPPORT_EMAIL} for help.`);
      console.error(err);
    } finally {
      setConverting(false);
    }
  };

  const downloadAll = async () => {
    if (images.length === 1) {
      const link = document.createElement('a');
      link.href = images[0].data;
      link.download = images[0].name;
      link.click();
      return;
    }
    const zip = new JSZip();
    for (const img of images) {
      const resp = await fetch(img.data);
      const blob = await resp.blob();
      zip.file(img.name, blob);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${file!.name.replace(/\.pdf$/i, '')}_images.zip`);
    toast.success('Downloaded ZIP!');
  };

  const downloadSingle = (img: { data: string; name: string }) => {
    const link = document.createElement('a');
    link.href = img.data;
    link.download = img.name;
    link.click();
  };

  const reset = () => { setFile(null); setImages([]); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file && <DropZone onFiles={addFile} disabled={converting} />}

      <AnimatePresence>
        {file && images.length === 0 && (
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

            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Format:</span>
                <div className="inline-flex rounded-lg border border-border bg-card p-0.5 gap-0.5">
                  {(['png', 'jpg'] as const).map((f) => (
                    <button key={f} onClick={() => setFormat(f)}
                      className={`rounded-md px-4 py-2 text-sm font-semibold transition-all ${format === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Quality:</span>
                <div className="inline-flex rounded-lg border border-border bg-card p-0.5 gap-0.5">
                  {[1, 2, 3].map((s) => (
                    <button key={s} onClick={() => setScale(s)}
                      className={`rounded-md px-4 py-2 text-sm font-semibold transition-all ${scale === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <motion.div layout className="pt-2">
              <Button onClick={handleConvert} disabled={converting} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
                {converting ? (<><Loader2 className="h-5 w-5 animate-spin" />Converting…</>) : (<><ImageIcon className="h-5 w-5" />Convert to Images</>)}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {images.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{images.length} image{images.length !== 1 ? 's' : ''} generated</p>
              <Button onClick={downloadAll} size="sm" className="rounded-xl gap-1.5">
                <Download className="h-4 w-4" /> Download {images.length > 1 ? 'All (ZIP)' : ''}
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={i} className="group relative rounded-xl border border-border bg-card overflow-hidden cursor-pointer" onClick={() => downloadSingle(img)}>
                  <img src={img.data} alt={img.name} className="w-full aspect-[3/4] object-contain bg-muted/30 p-1" />
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <p className="px-2 py-1.5 text-xs text-muted-foreground truncate">{img.name}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button onClick={reset} variant="outline" className="rounded-xl"><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PDFToImages;
