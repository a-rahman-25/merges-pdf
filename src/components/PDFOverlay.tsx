import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Loader2, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PDFDocument } from 'pdf-lib';
import { downloadBlob, formatFileSize, getPageCount } from '@/lib/pdf-utils';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';

const PDFOverlay = () => {
  const [baseFile, setBaseFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [overlayFile, setOverlayFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [position, setPosition] = useState<'foreground' | 'background'>('foreground');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [step, setStep] = useState<'base' | 'overlay' | 'options'>('base');

  const doDownload = useCallback((filename?: string) => {
    if (!result || !baseFile) return;
    downloadBlob(result, filename || baseFile.name.replace(/\.pdf$/i, '_overlay.pdf'));
    toast.success('Downloaded!');
  }, [result, baseFile]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'PDF Overlay');

  const addBase = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    let pc = 1;
    try { pc = await getPageCount(f); } catch {}
    setBaseFile({ file: f, name: f.name, size: f.size, pageCount: pc });
    setStep('overlay');
    toast.success(`Base: ${f.name}`);
  }, []);

  const addOverlay = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    let pc = 1;
    try { pc = await getPageCount(f); } catch {}
    setOverlayFile({ file: f, name: f.name, size: f.size, pageCount: pc });
    setStep('options');
    toast.success(`Overlay: ${f.name}`);
  }, []);

  const handleOverlay = async () => {
    if (!baseFile || !overlayFile) return;
    setProcessing(true);
    try {
      const baseBuffer = await baseFile.file.arrayBuffer();
      const overlayBuffer = await overlayFile.file.arrayBuffer();

      const basePdf = await PDFDocument.load(baseBuffer, { ignoreEncryption: true });
      const overlayPdf = await PDFDocument.load(overlayBuffer, { ignoreEncryption: true });
      const resultPdf = await PDFDocument.create();

      const basePages = basePdf.getPages();
      const overlayPages = overlayPdf.getPages();

      for (let i = 0; i < basePages.length; i++) {
        const [copiedBase] = await resultPdf.copyPages(basePdf, [i]);
        const overlayIdx = Math.min(i, overlayPages.length - 1);
        
        // Embed the overlay page as a form XObject
        const [copiedOverlay] = await resultPdf.embedPages([overlayPages[overlayIdx]]);
        
        if (position === 'background') {
          // Create new page, draw overlay first, then base content on top
          const { width, height } = copiedBase.getSize();
          const page = resultPdf.addPage([width, height]);
          page.drawPage(copiedOverlay, { x: 0, y: 0, width, height });
          // Copy base on top by embedding it
          const [baseEmbed] = await resultPdf.embedPages([basePages[i]]);
          page.drawPage(baseEmbed, { x: 0, y: 0, width, height });
        } else {
          // Foreground: draw overlay on top of base
          resultPdf.addPage(copiedBase);
          const page = resultPdf.getPages()[resultPdf.getPageCount() - 1];
          const { width, height } = page.getSize();
          page.drawPage(copiedOverlay, { x: 0, y: 0, width, height });
        }
      }

      const saved = await resultPdf.save();
      setResult(saved);
      toast.success('Overlay applied successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to overlay PDFs.');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setBaseFile(null); setOverlayFile(null); setResult(null); setStep('base'); };

  const FileCard = ({ label, f }: { label: string; f: { name: string; size: number; pageCount: number } }) => (
    <div className="flex items-center gap-3 rounded-xl bg-card p-3 border border-border">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <FileText className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-primary font-medium">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{f.name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(f.size)} · {f.pageCount} pages</p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <AnimatePresence mode="wait">
        {step === 'base' && !result ? (
          <motion.div key="base" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
            <p className="text-sm font-medium text-foreground text-center">Step 1: Select the base PDF</p>
            <DropZone onFiles={addBase} />
          </motion.div>
        ) : step === 'overlay' && !result ? (
          <motion.div key="overlay" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <FileCard label="Base PDF" f={baseFile!} />
            <p className="text-sm font-medium text-foreground text-center">Step 2: Select the overlay PDF</p>
            <DropZone onFiles={addOverlay} />
          </motion.div>
        ) : step === 'options' && !result ? (
          <motion.div key="options" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-muted-foreground">Ready to overlay</p>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Start over
              </button>
            </div>
            <FileCard label="Base PDF" f={baseFile!} />
            <FileCard label="Overlay PDF" f={overlayFile!} />
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Overlay Position</label>
              <Select value={position} onValueChange={(v) => setPosition(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="foreground">Foreground (on top of base)</SelectItem>
                  <SelectItem value="background">Background (behind base)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleOverlay} disabled={processing} size="lg" className="w-full gap-2 text-base font-semibold h-14 rounded-xl">
              {processing ? <><Loader2 className="h-5 w-5 animate-spin" /> Processing…</> : <><Layers className="h-5 w-5" /> Apply Overlay</>}
            </Button>
          </motion.div>
        ) : result ? (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <PDFPreviewDownload pdfData={result} defaultFilename={baseFile!.name.replace(/\.pdf$/i, '_overlay.pdf')} onDownload={triggerDownload} />
            <Button onClick={reset} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
              <RotateCcw className="h-4 w-4" /> Overlay Another
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} toolName="PDF Overlay" />
    </div>
  );
};

export default PDFOverlay;
