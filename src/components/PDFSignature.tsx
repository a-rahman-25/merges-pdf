import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Loader2, RotateCcw, Type, Upload, Pen, ChevronLeft, ChevronRight, Move, X, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument, rgb } from 'pdf-lib';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { getPageCount, downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import PreDownloadSummary from '@/components/PreDownloadSummary';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';

const FONTS = [
  { name: 'Dancing Script', style: "'Dancing Script', cursive" },
  { name: 'Great Vibes', style: "'Great Vibes', cursive" },
  { name: 'Pacifico', style: "'Pacifico', cursive" },
  { name: 'Sacramento', style: "'Sacramento', cursive" },
];

const COLORS = [
  { name: 'Black', hex: '#1a1a1a', rgb: [0.1, 0.1, 0.1] as [number, number, number] },
  { name: 'Blue', hex: '#1a1a80', rgb: [0.1, 0.1, 0.5] as [number, number, number] },
  { name: 'Red', hex: '#8b0000', rgb: [0.55, 0, 0] as [number, number, number] },
];

interface Placement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  type: 'signature' | 'date' | 'name';
}

const PDFSignature = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signatureText, setSignatureText] = useState('');
  const [selectedFont, setSelectedFont] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [penThickness, setPenThickness] = useState(2);
  const [currentPage, setCurrentPage] = useState(0);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [resizing, setResizing] = useState<string | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback((filename?: string) => {
    if (result && file) {
      downloadBlob(result, filename || file.name.replace(/\.pdf$/i, '_signed.pdf'));
      toast.success('Downloaded!');
    }
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'PDF Signature');

  // Load Google Fonts for typed signatures
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Pacifico&family=Sacramento&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    try {
      const count = await getPageCount(f);
      setFile({ file: f, name: f.name, size: f.size, pageCount: count });
      setResult(null);
      setPlacements([]);
      setCurrentPage(0);
      setStep(2);

      // Render pages as images using pdf.js-like approach via canvas
      const arrayBuf = await f.arrayBuffer();
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const pdf = await pdfjsLib.getDocument({ data: arrayBuf }).promise;
      const images: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
        images.push(canvas.toDataURL('image/png'));
      }
      setPageImages(images);
    } catch {
      toast.error('Failed to read PDF.');
    }
  }, []);

  const clearSigCanvas = () => sigCanvasRef.current?.clear();

  const saveSigFromDraw = () => {
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      toast.error('Please draw your signature first');
      return;
    }
    setSignatureDataUrl(sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png'));
    setStep(3);
  };

  const saveSigFromType = () => {
    if (!signatureText.trim()) { toast.error('Type your signature'); return; }
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 120;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = COLORS[selectedColor].hex;
    ctx.font = `bold 48px ${FONTS[selectedFont].style}`;
    ctx.textBaseline = 'middle';
    ctx.fillText(signatureText, 10, 60);
    setSignatureDataUrl(canvas.toDataURL('image/png'));
    setStep(3);
  };

  const handleUploadSig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSignatureDataUrl(reader.result as string);
      setStep(3);
    };
    reader.readAsDataURL(f);
    e.target.value = '';
  };

  const addPlacement = (type: 'signature' | 'date' | 'name') => {
    setPlacements(prev => [...prev, {
      id: crypto.randomUUID(),
      x: 50, y: 50,
      width: type === 'signature' ? 200 : 150,
      height: type === 'signature' ? 60 : 30,
      page: currentPage,
      type,
    }]);
  };

  const removePlacement = (id: string) => setPlacements(prev => prev.filter(p => p.id !== id));

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(id);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPlacements(prev => prev.map(p => p.id === dragging ? { ...p, x: Math.max(0, x - p.width / 2), y: Math.max(0, y - p.height / 2) } : p));
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
    setResizing(null);
  }, []);

  const applySignatures = async () => {
    if (!file || !signatureDataUrl || placements.length === 0) {
      toast.error('Place at least one signature on the document');
      return;
    }
    setProcessing(true);
    try {
      const bytes = new Uint8Array(await file.file.arrayBuffer());
      const pdf = await PDFDocument.load(bytes);

      // Convert signature data URL to image bytes
      const sigBytes = await fetch(signatureDataUrl).then(r => r.arrayBuffer());
      const sigImage = await pdf.embedPng(new Uint8Array(sigBytes));

      const pages = pdf.getPages();
      const containerEl = canvasContainerRef.current;
      const displayWidth = containerEl?.clientWidth || 600;

      for (const placement of placements) {
        if (placement.page >= pages.length) continue;
        const page = pages[placement.page];
        const { width: pdfW, height: pdfH } = page.getSize();
        const displayHeight = pageImages[placement.page] ? (displayWidth * pdfH / pdfW) : 800;

        const scaleX = pdfW / displayWidth;
        const scaleY = pdfH / displayHeight;

        if (placement.type === 'signature') {
          page.drawImage(sigImage, {
            x: placement.x * scaleX,
            y: pdfH - (placement.y + placement.height) * scaleY,
            width: placement.width * scaleX,
            height: placement.height * scaleY,
          });
        } else {
          const text = placement.type === 'date'
            ? new Date().toLocaleDateString()
            : signatureText || 'Name';
          const font = await pdf.embedFont('Helvetica' as any);
          page.drawText(text, {
            x: placement.x * scaleX,
            y: pdfH - (placement.y + placement.height) * scaleY,
            size: 12 * scaleX,
            font,
            color: rgb(...COLORS[selectedColor].rgb),
          });
        }
      }

      const pdfBytes = await pdf.save();
      setResult(pdfBytes);
      setStep(4);
      toast.success('Signatures applied!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to apply signatures');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setSignatureDataUrl(null);
    setSignatureText('');
    setPlacements([]);
    setPageImages([]);
    setCurrentPage(0);
    setStep(1);
  };

  const pagePlacements = placements.filter(p => p.page === currentPage);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Progress steps */}
      <div className="flex items-center justify-center gap-2">
        {['Upload', 'Create Signature', 'Place & Sign', 'Download'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              step > i + 1 ? 'gradient-bg text-primary-foreground' :
              step === i + 1 ? 'bg-primary text-primary-foreground' :
              'bg-secondary text-muted-foreground'
            }`}>
              {i + 1}
            </div>
            <span className="hidden sm:inline text-xs text-muted-foreground">{label}</span>
            {i < 3 && <div className="w-6 h-px bg-border" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Upload */}
        {step === 1 && (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
                if (files.length) addFile(files);
              }}
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-16 text-center transition-all hover:border-primary/50 hover:bg-accent/30"
            >
              <PenTool className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-semibold text-foreground">Drop a PDF to sign</p>
              <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
            </div>
            <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { if (e.target.files) addFile(Array.from(e.target.files)); e.target.value = ''; }} />
          </motion.div>
        )}

        {/* Step 2: Create Signature */}
        {step === 2 && (
          <motion.div key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground">{file?.name}</p>
              <p className="text-xs text-muted-foreground">{file?.pageCount} pages · {file ? formatFileSize(file.size) : ''}</p>
            </div>

            <Tabs defaultValue="draw" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="draw" className="gap-1.5"><Pen className="h-4 w-4" /> Draw</TabsTrigger>
                <TabsTrigger value="type" className="gap-1.5"><Type className="h-4 w-4" /> Type</TabsTrigger>
                <TabsTrigger value="upload" className="gap-1.5"><Upload className="h-4 w-4" /> Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="draw" className="space-y-4 pt-4">
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-muted-foreground">Color:</span>
                  {COLORS.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(i)}
                      className={`h-7 w-7 rounded-full border-2 transition-all ${selectedColor === i ? 'border-primary scale-110' : 'border-border'}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                  <span className="ml-4 text-sm text-muted-foreground">Thickness: {penThickness}</span>
                  <Slider value={[penThickness]} onValueChange={(v) => setPenThickness(v[0])} min={1} max={5} step={0.5} className="w-24" />
                </div>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <SignatureCanvas
                    ref={sigCanvasRef}
                    penColor={COLORS[selectedColor].hex}
                    minWidth={penThickness}
                    maxWidth={penThickness + 1}
                    canvasProps={{ width: 600, height: 200, className: 'w-full h-48 cursor-crosshair' }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearSigCanvas} className="rounded-xl">Clear</Button>
                  <Button onClick={saveSigFromDraw} className="flex-1 rounded-xl gradient-bg border-0">Use This Signature</Button>
                </div>
              </TabsContent>

              <TabsContent value="type" className="space-y-4 pt-4">
                <Input value={signatureText} onChange={(e) => setSignatureText(e.target.value)} placeholder="Type your name" className="rounded-xl text-lg" />
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-muted-foreground">Color:</span>
                  {COLORS.map((c, i) => (
                    <button key={c.name} onClick={() => setSelectedColor(i)}
                      className={`h-7 w-7 rounded-full border-2 transition-all ${selectedColor === i ? 'border-primary scale-110' : 'border-border'}`}
                      style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {FONTS.map((font, i) => (
                    <button
                      key={font.name}
                      onClick={() => setSelectedFont(i)}
                      className={`rounded-xl border p-4 text-center text-xl transition-all ${
                        selectedFont === i ? 'border-primary bg-accent' : 'border-border bg-card hover:border-primary/30'
                      }`}
                      style={{ fontFamily: font.style, color: COLORS[selectedColor].hex }}
                    >
                      {signatureText || 'Your Name'}
                    </button>
                  ))}
                </div>
                <Button onClick={saveSigFromType} disabled={!signatureText.trim()} className="w-full rounded-xl gradient-bg border-0">
                  Use This Signature
                </Button>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4 pt-4">
                <div
                  onClick={() => uploadInputRef.current?.click()}
                  className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-10 text-center hover:border-primary/50 transition-all"
                >
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-foreground font-medium">Upload signature image</p>
                  <p className="text-xs text-muted-foreground">PNG with transparent background works best</p>
                </div>
                <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadSig} />
              </TabsContent>
            </Tabs>

            <Button variant="outline" onClick={reset} className="rounded-xl">Cancel</Button>
          </motion.div>
        )}

        {/* Step 3: Place Signature */}
        {step === 3 && (
          <motion.div key="place" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => addPlacement('signature')} className="rounded-xl gap-1.5">
                <PenTool className="h-4 w-4" /> Add Signature
              </Button>
              <Button size="sm" variant="outline" onClick={() => addPlacement('date')} className="rounded-xl gap-1.5">
                <Calendar className="h-4 w-4" /> Add Date
              </Button>
              <Button size="sm" variant="outline" onClick={() => addPlacement('name')} className="rounded-xl gap-1.5">
                <User className="h-4 w-4" /> Add Name
              </Button>
            </div>

            {/* Page navigation */}
            <div className="flex items-center justify-between">
              <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="rounded-xl">
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {currentPage + 1} of {file?.pageCount || 0}</span>
              <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.min((file?.pageCount || 1) - 1, p + 1))} disabled={currentPage >= (file?.pageCount || 1) - 1} className="rounded-xl">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* PDF Page with placements */}
            <div
              ref={canvasContainerRef}
              className="relative rounded-xl border border-border bg-card overflow-hidden select-none"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {pageImages[currentPage] && (
                <img src={pageImages[currentPage]} alt={`Page ${currentPage + 1}`} className="w-full" draggable={false} />
              )}
              {pagePlacements.map((p) => (
                <div
                  key={p.id}
                  className="absolute border-2 border-primary bg-primary/10 cursor-move rounded-lg flex items-center justify-center"
                  style={{ left: p.x, top: p.y, width: p.width, height: p.height }}
                  onMouseDown={(e) => handleMouseDown(p.id, e)}
                >
                  {p.type === 'signature' && signatureDataUrl && (
                    <img src={signatureDataUrl} alt="sig" className="max-w-full max-h-full object-contain pointer-events-none" />
                  )}
                  {p.type === 'date' && <span className="text-xs font-medium text-foreground pointer-events-none">{new Date().toLocaleDateString()}</span>}
                  {p.type === 'name' && <span className="text-xs font-medium text-foreground pointer-events-none">{signatureText || 'Name'}</span>}
                  <button
                    onClick={(e) => { e.stopPropagation(); removePlacement(p.id); }}
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <Move className="absolute bottom-1 right-1 h-3 w-3 text-primary/50" />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl">Back</Button>
              <Button onClick={applySignatures} disabled={processing || placements.length === 0} className="flex-1 rounded-xl gradient-bg border-0">
                {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying…</> : 'Apply & Download'}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Click & drag to position signatures. Each placement is page-specific.
            </p>
          </motion.div>
        )}

        {/* Step 4: Result */}
        {step === 4 && result && file && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PreDownloadSummary
              title="PDF Signed Successfully"
              items={[
                { label: 'File', value: file.name },
                { label: 'Signatures placed', value: `${placements.length}` },
                { label: 'Pages affected', value: `${new Set(placements.map(p => p.page)).size}` },
                { label: 'Output size', value: formatFileSize(result.byteLength) },
              ]}
              onDownload={triggerDownload}
            />
            <div className="mt-4 flex justify-center">
              <Button onClick={reset} variant="outline" className="rounded-xl"><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
            </div>

            {/* Trust notice */}
            <div className="mt-6 rounded-2xl border border-border bg-accent/30 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                This tool creates visual e-signatures. For legally binding certified signatures requiring audit trails,
                consider services like DocuSign or Adobe Sign.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewDialog open={showReview} toolName="PDF Signature" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFSignature;
