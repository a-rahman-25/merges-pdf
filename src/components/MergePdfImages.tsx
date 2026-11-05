import { useCallback, useState } from 'react';
import { Loader2, RotateCw, X, Download, RotateCcw, ArrowLeft, ArrowRight, FileText, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { buildMergedPdf, moveItem, MergeItem, MergeSource, ImagePageSize } from '@/lib/merge-pdf-images';
import { downloadBlob } from '@/lib/pdf-utils';
import { logToolUsage } from '@/lib/analytics';

// Polyfill for newer Map methods used by pdfjs 5.x
for (const C of [Map, WeakMap] as any[]) {
  if (!C.prototype.getOrInsertComputed) {
    C.prototype.getOrInsertComputed = function (k: any, fn: (k: any) => any) {
      if (!this.has(k)) this.set(k, fn(k));
      return this.get(k);
    };
  }
  if (!C.prototype.getOrInsert) {
    C.prototype.getOrInsert = function (k: any, v: any) {
      if (!this.has(k)) this.set(k, v);
      return this.get(k);
    };
  }
}
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

type Card = MergeItem & { id: string; thumb: string; label: string };

const ACCEPT = '.pdf,.png,.jpg,.jpeg,.webp,.gif,.bmp';

async function imageToPng(file: File): Promise<Uint8Array> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    c.getContext('2d')!.drawImage(img, 0, 0);
    const blob: Blob = await new Promise((r) => c.toBlob((b) => r(b!), 'image/png'));
    return new Uint8Array(await blob.arrayBuffer());
  } finally { URL.revokeObjectURL(url); }
}

const MergePdfImages = () => {
  const [sources, setSources] = useState<Record<string, MergeSource>>({});
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [merging, setMerging] = useState(false);
  const [imageSize, setImageSize] = useState<ImagePageSize>('a4');
  const [fileName, setFileName] = useState('merged');
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addFiles = useCallback(async (files: File[]) => {
    setLoading(true);
    const newSources: Record<string, MergeSource> = {};
    const newCards: Card[] = [];
    for (const file of files) {
      const sourceId = crypto.randomUUID();
      const name = file.name.toLowerCase();
      try {
        if (name.endsWith('.pdf')) {
          const bytes = new Uint8Array(await file.arrayBuffer());
          newSources[sourceId] = { bytes, type: 'pdf' };
          const doc = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
          for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const vp0 = page.getViewport({ scale: 1 });
            const vp = page.getViewport({ scale: 160 / vp0.width });
            const canvas = document.createElement('canvas');
            canvas.width = vp.width; canvas.height = vp.height;
            await page.render({ canvas, canvasContext: canvas.getContext('2d')!, viewport: vp } as any).promise;
            newCards.push({ id: crypto.randomUUID(), kind: 'pdf', sourceId, pageIndex: i - 1, rotation: 0,
              thumb: canvas.toDataURL('image/jpeg', 0.7), label: `${file.name} · p${i}` });
          }
          doc.destroy();
        } else {
          const isJpg = /\.jpe?g$/.test(name);
          const isPng = name.endsWith('.png');
          const bytes = isJpg || isPng ? new Uint8Array(await file.arrayBuffer()) : await imageToPng(file);
          newSources[sourceId] = { bytes, type: isJpg ? 'jpg' : 'png' };
          newCards.push({ id: crypto.randomUUID(), kind: 'image', sourceId, rotation: 0,
            thumb: URL.createObjectURL(file), label: file.name });
        }
      } catch {
        toast.error(`Could not read ${file.name}`);
      }
    }
    setSources((s) => ({ ...s, ...newSources }));
    setCards((c) => [...c, ...newCards]);
    setLoading(false);
    if (newCards.length) toast.success(`Added ${newCards.length} page${newCards.length > 1 ? 's' : ''}`);
  }, []);

  const move = (from: number, to: number) => setCards((c) => moveItem(c, from, to));
  const rotate = (id: string) => setCards((c) => c.map((x) => x.id === id ? { ...x, rotation: (x.rotation + 90) % 360 } : x));
  const remove = (id: string) => setCards((c) => c.filter((x) => x.id !== id));

  const merge = async () => {
    setMerging(true);
    try {
      const bytes = await buildMergedPdf(cards, sources, imageSize);
      downloadBlob(bytes, 'merged.pdf');
      toast.success('Your PDF is ready!');
      logToolUsage('Merge PDF & Images', '/merge-pdf-images', cards.length);
    } catch (e) {
      toast.error('Merge failed. Please check your files.');
    } finally { setMerging(false); }
  };

  const reset = () => { setCards([]); setSources({}); };

  return (
    <div className="space-y-6">
      <DropZone onFiles={addFiles} disabled={loading} accept={ACCEPT}
        label="Drop PDFs and images here" sublabel="PDF, PNG, JPG, WEBP — mix them in any order" />

      {loading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Reading pages…
        </div>
      )}

      {cards.length > 0 && (
        <>
          <p className="text-center text-sm text-muted-foreground">
            Drag the pages to rearrange them. {cards.length} page{cards.length > 1 ? 's' : ''} in total.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {cards.map((card, i) => (
              <div key={card.id} draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { if (dragIndex !== null) move(dragIndex, i); setDragIndex(null); }}
                className={`group relative flex cursor-grab flex-col rounded-xl border bg-card p-2 shadow-sm transition ${dragIndex === i ? 'opacity-50' : ''}`}>
                <span className="absolute left-2 top-2 z-10 rounded-md bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">{i + 1}</span>
                <button onClick={() => remove(card.id)} aria-label="Remove page"
                  className="absolute right-2 top-2 z-10 rounded-full bg-background/90 p-1 text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg bg-muted">
                  <img src={card.thumb} alt={card.label} draggable={false}
                    style={{ transform: `rotate(${card.rotation}deg)` }}
                    className="max-h-full max-w-full object-contain transition-transform" />
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  {card.kind === 'pdf' ? <FileText className="h-3 w-3 shrink-0" /> : <ImageIcon className="h-3 w-3 shrink-0" />}
                  <span className="truncate">{card.label}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <Button size="icon" variant="ghost" className="h-7 w-7" disabled={i === 0} onClick={() => move(i, i - 1)} aria-label="Move left"><ArrowLeft className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => rotate(card.id)} aria-label="Rotate"><RotateCw className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" disabled={i === cards.length - 1} onClick={() => move(i, i + 1)} aria-label="Move right"><ArrowRight className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Image pages:</span>
              <Select value={imageSize} onValueChange={(v) => setImageSize(v as ImagePageSize)}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4 with margins</SelectItem>
                  <SelectItem value="fit">Same size as image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={merge} disabled={merging} size="lg">
              {merging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Merge & Download PDF
            </Button>
            <Button variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />Start over</Button>
          </div>
        </>
      )}
      <p className="text-center text-xs text-muted-foreground">Processed in your browser — your files are never uploaded.</p>
    </div>
  );
};

export default MergePdfImages;
