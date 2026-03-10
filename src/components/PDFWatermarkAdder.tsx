import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Loader2, Download, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { getPageCount, addTextWatermark, downloadBlob, formatFileSize, SUPPORT_EMAIL } from '@/lib/pdf-utils';

const PDFWatermarkAdder = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number | null } | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(50);
  const [opacity, setOpacity] = useState(30);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Please select a PDF file.'); return; }
    let pageCount: number | null = null;
    try { pageCount = await getPageCount(f); } catch {}
    setFile({ file: f, name: f.name, size: f.size, pageCount });
    setDone(false);
    toast.success(`Selected: ${f.name}`);
    e.target.value = '';
  }, []);

  const handleWatermark = async () => {
    if (!file || !watermarkText.trim()) return;
    setProcessing(true);
    try {
      const data = await addTextWatermark(file.file, watermarkText, {
        fontSize,
        opacity: opacity / 100,
        rotation: -45,
      });
      const baseName = file.name.replace(/\.pdf$/i, '');
      downloadBlob(data, `${baseName}_watermarked.pdf`);
      setDone(true);
      toast.success('Watermark added and downloaded!');
    } catch (err) {
      toast.error(`Failed to add watermark. Contact ${SUPPORT_EMAIL} for help.`);
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setDone(false); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all"
        >
          <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4">
              <Droplets className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">Click to select a PDF</p>
              <p className="mt-1 text-sm text-muted-foreground">Add a text watermark to every page</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-medium text-muted-foreground">{file.name}</p>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> Clear
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

          {!done && (
            <div className="space-y-4 rounded-xl border border-border bg-card p-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Watermark Text</label>
                <Input value={watermarkText} onChange={e => setWatermarkText(e.target.value)} placeholder="Enter watermark text" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Font Size: {fontSize}px</label>
                <Slider value={[fontSize]} onValueChange={v => setFontSize(v[0])} min={12} max={120} step={2} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Opacity: {opacity}%</label>
                <Slider value={[opacity]} onValueChange={v => setOpacity(v[0])} min={5} max={100} step={5} />
              </div>
            </div>
          )}

          <Button onClick={handleWatermark} disabled={processing || !watermarkText.trim() || done} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
            {processing ? (<><Loader2 className="h-5 w-5 animate-spin" />Adding Watermark…</>) : done ? (<><Download className="h-5 w-5" />Done!</>) : (<><Droplets className="h-5 w-5" />Add Watermark & Download</>)}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default PDFWatermarkAdder;
