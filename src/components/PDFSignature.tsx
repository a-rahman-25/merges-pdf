import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Loader2, RotateCcw, FileUp, Type, X } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { getPageCount, downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import PreDownloadSummary from '@/components/PreDownloadSummary';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';

const PDFSignature = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [signatureText, setSignatureText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(10);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback(() => {
    if (result && file) {
      const name = file.name.replace(/\.pdf$/i, '_signed.pdf');
      downloadBlob(result, name);
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

  const applySignature = async () => {
    if (!file || !signatureText.trim()) { toast.error('Enter a signature text'); return; }
    setProcessing(true);
    try {
      const bytes = new Uint8Array(await file.file.arrayBuffer());
      const pdf = await PDFDocument.load(bytes);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText(signatureText, {
          x: (posX / 100) * width,
          y: (posY / 100) * height,
          size: fontSize,
          font,
          color: rgb(0.1, 0.1, 0.3),
        });
      }

      const pdfBytes = await pdf.save();
      setResult(pdfBytes);
      toast.success('Signature added!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add signature');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setSignatureText(''); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <AnimatePresence mode="wait">
        {result && file ? (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PreDownloadSummary
              title="Signature Added"
              items={[
                { label: 'File', value: file.name },
                { label: 'Pages signed', value: `${file.pageCount}` },
                { label: 'Signature', value: signatureText },
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
              <PenTool className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium text-foreground">Drop a PDF to sign</p>
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
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Signature Text</label>
                <Input value={signatureText} onChange={(e) => setSignatureText(e.target.value)} placeholder="e.g. John Doe" className="rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Font Size: {fontSize}px</label>
                <Slider value={[fontSize]} onValueChange={(v) => setFontSize(v[0])} min={10} max={72} step={1} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">X Position: {posX}%</label>
                  <Slider value={[posX]} onValueChange={(v) => setPosX(v[0])} min={0} max={100} step={1} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Y Position: {posY}%</label>
                  <Slider value={[posY]} onValueChange={(v) => setPosY(v[0])} min={0} max={100} step={1} />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={reset} variant="outline" className="rounded-xl">Cancel</Button>
              <Button onClick={applySignature} disabled={processing || !signatureText.trim()} className="flex-1 rounded-xl">
                {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing…</> : <><PenTool className="mr-2 h-4 w-4" /> Add Signature</>}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ReviewDialog open={showReview} toolName="PDF Signature" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFSignature;
