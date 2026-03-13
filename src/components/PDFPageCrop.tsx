import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crop, Loader2, RotateCcw, FileUp } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { getPageCount, downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import PreDownloadSummary from '@/components/PreDownloadSummary';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';

const PDFPageCrop = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [margins, setMargins] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback(() => {
    if (result && file) {
      downloadBlob(result, file.name.replace(/\.pdf$/i, '_cropped.pdf'));
    }
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload);

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    try {
      const count = await getPageCount(f);
      setFile({ file: f, name: f.name, size: f.size, pageCount: count });
      setResult(null);
    } catch { toast.error('Failed to read PDF.'); }
  }, []);

  const cropPages = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = new Uint8Array(await file.file.arrayBuffer());
      const pdf = await PDFDocument.load(bytes);
      const pages = pdf.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const cropBox = {
          x: margins.left,
          y: margins.bottom,
          width: width - margins.left - margins.right,
          height: height - margins.top - margins.bottom,
        };
        if (cropBox.width <= 0 || cropBox.height <= 0) {
          toast.error('Crop margins are too large');
          setProcessing(false);
          return;
        }
        page.setCropBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
      }

      const pdfBytes = await pdf.save();
      setResult(pdfBytes);
      toast.success('Pages cropped!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to crop pages');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setMargins({ top: 0, right: 0, bottom: 0, left: 0 }); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <AnimatePresence mode="wait">
        {result && file ? (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PreDownloadSummary
              title="Pages Cropped"
              items={[
                { label: 'File', value: file.name },
                { label: 'Pages', value: `${file.pageCount}` },
                { label: 'Margins', value: `T:${margins.top} R:${margins.right} B:${margins.bottom} L:${margins.left}pt` },
                { label: 'Output size', value: formatFileSize(result.byteLength) },
              ]}
              onDownload={triggerDownload}
            />
            <div className="mt-4 flex justify-center">
              <Button onClick={reset} variant="outline" className="rounded-xl"><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
            </div>
          </motion.div>
        ) : !file ? (
          <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf'); if (files.length) addFile(files); }}
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center transition-all hover:border-primary/50"
            >
              <Crop className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium text-foreground">Drop a PDF to crop pages</p>
              <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
            </div>
            <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { if (e.target.files) addFile(Array.from(e.target.files)); e.target.value = ''; }} />
          </motion.div>
        ) : (
          <motion.div key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{file.pageCount} pages · {formatFileSize(file.size)}</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Set crop margins (in points, 72pt = 1 inch)</p>
              <div className="grid grid-cols-2 gap-4">
                {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                  <div key={side}>
                    <label className="text-sm font-medium text-foreground mb-1.5 block capitalize">{side}: {margins[side]}pt</label>
                    <Slider
                      value={[margins[side]]}
                      onValueChange={(v) => setMargins(prev => ({ ...prev, [side]: v[0] }))}
                      min={0} max={200} step={1}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={reset} variant="outline" className="rounded-xl">Cancel</Button>
              <Button onClick={cropPages} disabled={processing} className="flex-1 rounded-xl">
                {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cropping…</> : <><Crop className="mr-2 h-4 w-4" /> Crop Pages</>}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ReviewDialog open={showReview} toolName="PDF Crop" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFPageCrop;
