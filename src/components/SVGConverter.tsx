import { useState, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Upload, Image, Loader2, Trash2 } from 'lucide-react';

type OutputFormat = 'png' | 'jpg' | 'webp' | 'bmp' | 'ico';

/** Build an ICO file from PNG buffers at given sizes */
function buildIco(pngs: Uint8Array[], sizes: number[]): Blob {
  const headerSize = 6;
  const dirEntrySize = 16;
  const numImages = pngs.length;
  let offset = headerSize + dirEntrySize * numImages;

  // ICO header: reserved(2) + type(2) + count(2)
  const header = new Uint8Array(headerSize);
  const hv = new DataView(header.buffer);
  hv.setUint16(0, 0, true);       // reserved
  hv.setUint16(2, 1, true);       // type = ICO
  hv.setUint16(4, numImages, true);

  const dirEntries = new Uint8Array(dirEntrySize * numImages);
  const dv = new DataView(dirEntries.buffer);

  for (let i = 0; i < numImages; i++) {
    const s = sizes[i] >= 256 ? 0 : sizes[i];
    const off = i * dirEntrySize;
    dv.setUint8(off, s);           // width
    dv.setUint8(off + 1, s);      // height
    dv.setUint8(off + 2, 0);      // palette
    dv.setUint8(off + 3, 0);      // reserved
    dv.setUint16(off + 4, 1, true); // color planes
    dv.setUint16(off + 6, 32, true); // bits per pixel
    dv.setUint32(off + 8, pngs[i].length, true); // size
    dv.setUint32(off + 12, offset, true); // offset
    offset += pngs[i].length;
  }

  return new Blob([header, dirEntries, ...pngs], { type: 'image/x-icon' });
}

const formatOptions: { value: OutputFormat; label: string; mime: string }[] = [
  { value: 'png', label: 'PNG', mime: 'image/png' },
  { value: 'jpg', label: 'JPG', mime: 'image/jpeg' },
  { value: 'webp', label: 'WEBP', mime: 'image/webp' },
  { value: 'bmp', label: 'BMP', mime: 'image/bmp' },
  { value: 'ico', label: 'ICO (Favicon)', mime: 'image/x-icon' },
];

const scaleOptions = [1, 2, 3, 4];

const SVGConverter = () => {
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [svgPreview, setSvgPreview] = useState<string | null>(null);
  const [format, setFormat] = useState<OutputFormat>('png');
  const [scale, setScale] = useState(2);
  const [converting, setConverting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.includes('svg')) {
      toast({ title: 'Invalid file', description: 'Please upload an SVG file.', variant: 'destructive' });
      return;
    }
    setSvgFile(file);
    setResultUrl(null);
    const reader = new FileReader();
    reader.onload = (e) => setSvgPreview(e.target?.result as string);
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.remove('drop-zone-active');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const convert = useCallback(async () => {
    if (!svgPreview) return;
    setConverting(true);
    try {
      // Parse SVG to get natural dimensions
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgPreview, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');
      if (!svgEl) throw new Error('Invalid SVG');

      let width = parseFloat(svgEl.getAttribute('width') || '0');
      let height = parseFloat(svgEl.getAttribute('height') || '0');
      const viewBox = svgEl.getAttribute('viewBox');
      if ((!width || !height) && viewBox) {
        const parts = viewBox.split(/[\s,]+/).map(Number);
        width = parts[2] || 300;
        height = parts[3] || 150;
      }
      if (!width) width = 300;
      if (!height) height = 150;

      const scaledW = Math.round(width * scale);
      const scaledH = Math.round(height * scale);

      // Create a blob URL from the SVG text
      const svgBlob = new Blob([svgPreview], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load SVG'));
        img.src = url;
      });

      // ICO needs fixed sizes
      if (format === 'ico') {
        const icoSizes = [16, 32, 48];
        const pngBlobs: Uint8Array[] = [];

        for (const size of icoSizes) {
          const c = document.createElement('canvas');
          c.width = size;
          c.height = size;
          const cx = c.getContext('2d')!;
          cx.drawImage(img, 0, 0, size, size);
          const blob = await new Promise<Blob>((res) => c.toBlob((b) => res(b!), 'image/png'));
          pngBlobs.push(new Uint8Array(await blob.arrayBuffer()));
        }

        // Build ICO binary
        const icoBlob = buildIco(pngBlobs, icoSizes);
        const icoUrl = URL.createObjectURL(icoBlob);
        setResultUrl(icoUrl);
        URL.revokeObjectURL(url);
        toast({ title: 'Converted!', description: `SVG → ICO (${icoSizes.join(', ')}px)` });
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = scaledW;
      canvas.height = scaledH;
      const ctx = canvas.getContext('2d')!;

      // White background for JPG (no alpha channel)
      if (format === 'jpg' || format === 'bmp') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, scaledW, scaledH);
      }

      ctx.drawImage(img, 0, 0, scaledW, scaledH);
      URL.revokeObjectURL(url);

      const fmt = formatOptions.find(f => f.value === format)!;
      const quality = format === 'png' ? undefined : 0.95;
      const dataUrl = canvas.toDataURL(fmt.mime, quality);
      setResultUrl(dataUrl);

      toast({ title: 'Converted!', description: `SVG → ${fmt.label} at ${scaledW}×${scaledH}px` });
    } catch (err: any) {
      toast({ title: 'Conversion failed', description: err.message, variant: 'destructive' });
    } finally {
      setConverting(false);
    }
  }, [svgPreview, format, scale]);

  const downloadResult = useCallback(() => {
    if (!resultUrl || !svgFile) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = svgFile.name.replace(/\.svg$/i, '') + '.' + (format === 'ico' ? 'ico' : format);
    a.click();
  }, [resultUrl, svgFile, format]);

  const reset = () => {
    setSvgFile(null);
    setSvgPreview(null);
    setResultUrl(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      {!svgFile ? (
        <div
          ref={dropRef}
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); dropRef.current?.classList.add('drop-zone-active'); }}
          onDragLeave={() => dropRef.current?.classList.remove('drop-zone-active')}
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-card p-12 transition-all hover:border-primary/50 hover:bg-accent/30"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">Drop your SVG file here</p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="space-y-5">
          {/* File info + preview */}
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-accent overflow-hidden">
              {svgPreview && (
                <div className="h-full w-full p-2" dangerouslySetInnerHTML={{ __html: svgPreview }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{svgFile.name}</p>
              <p className="text-sm text-muted-foreground">{(svgFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <Button variant="ghost" size="icon" onClick={reset} className="shrink-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Settings */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Output Format</label>
              <Select value={format} onValueChange={(v) => { setFormat(v as OutputFormat); setResultUrl(null); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {formatOptions.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Scale ({scale}x)</label>
              <Select value={String(scale)} onValueChange={(v) => { setScale(Number(v)); setResultUrl(null); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {scaleOptions.map((s) => (
                    <SelectItem key={s} value={String(s)}>{s}x</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Convert button */}
          <Button
            onClick={convert}
            disabled={converting}
            className="w-full h-12 rounded-xl gradient-bg border-0 font-semibold text-base"
          >
            {converting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image className="mr-2 h-4 w-4" />}
            {converting ? 'Converting…' : `Convert to ${format.toUpperCase()}`}
          </Button>

          {/* Result */}
          {resultUrl && (
            <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">Result Preview</p>
                <Button onClick={downloadResult} className="rounded-xl gradient-bg border-0">
                  <Download className="mr-2 h-4 w-4" /> Download .{format}
                </Button>
              </div>
              <div className="flex items-center justify-center rounded-xl bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,hsl(var(--background))_0%_50%)] bg-[length:16px_16px] p-4 max-h-80 overflow-auto">
                <img src={resultUrl} alt="Converted" className="max-w-full max-h-72 object-contain" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SVGConverter;
