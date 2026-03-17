import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeOff, Loader2, RotateCcw, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { getPageCount, formatFileSize, downloadBlob, SUPPORT_EMAIL } from '@/lib/pdf-utils';
import { PDFDocument, rgb } from 'pdf-lib';

interface RedactRect {
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

const PDFRedactor = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [redactions, setRedactions] = useState<RedactRect[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    setLoading(true);
    let pageCount = 0;
    try { pageCount = await getPageCount(f); } catch {}

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const buffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const imgs: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
        imgs.push(canvas.toDataURL('image/png'));
      }

      setPageImages(imgs);
      setFile({ file: f, name: f.name, size: f.size, pageCount: pdf.numPages });
      setRedactions([]);
      setCurrentPage(0);
      toast.success(`Loaded ${pdf.numPages} pages — draw rectangles to redact`);
    } catch (err) {
      toast.error('Failed to load PDF.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Draw current page + redaction rects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pageImages[currentPage]) return;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      // Draw existing redactions for this page
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      for (const r of redactions.filter(r => r.page === currentPage)) {
        ctx.fillRect(r.x, r.y, r.w, r.h);
      }
    };
    img.src = pageImages[currentPage];
  }, [currentPage, pageImages, redactions]);

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    setDrawStart(getCanvasPos(e));
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !drawStart) return;
    const end = getCanvasPos(e);
    const w = end.x - drawStart.x;
    const h = end.y - drawStart.y;
    if (Math.abs(w) > 5 && Math.abs(h) > 5) {
      setRedactions(prev => [...prev, {
        page: currentPage,
        x: Math.min(drawStart.x, end.x),
        y: Math.min(drawStart.y, end.y),
        w: Math.abs(w),
        h: Math.abs(h),
      }]);
    }
    setDrawing(false);
    setDrawStart(null);
  };

  const handleSave = async () => {
    if (!file || redactions.length === 0) {
      toast.error('Draw at least one redaction rectangle first.');
      return;
    }
    setSaving(true);
    try {
      const buffer = await file.file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = pdf.getPages();

      for (const r of redactions) {
        if (r.page >= pages.length) continue;
        const page = pages[r.page];
        const { width, height } = page.getSize();
        const canvas = canvasRef.current!;
        const scaleX = width / (pageImages[r.page] ? canvas.width : width);
        const scaleY = height / (pageImages[r.page] ? canvas.height : height);

        // pdf-lib has origin at bottom-left, canvas at top-left
        page.drawRectangle({
          x: r.x * scaleX,
          y: height - (r.y + r.h) * scaleY,
          width: r.w * scaleX,
          height: r.h * scaleY,
          color: rgb(0, 0, 0),
        });
      }

      const data = await pdf.save();
      downloadBlob(data, file.name.replace(/\.pdf$/i, '_redacted.pdf'));
      toast.success('Redacted PDF downloaded!');
    } catch (err) {
      toast.error(`Failed to save. Contact ${SUPPORT_EMAIL} for help.`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const undoLast = () => {
    setRedactions(prev => {
      const last = [...prev].reverse().findIndex(r => r.page === currentPage);
      if (last === -1) return prev;
      const idx = prev.length - 1 - last;
      return prev.filter((_, i) => i !== idx);
    });
  };

  const reset = () => { setFile(null); setPageImages([]); setRedactions([]); setCurrentPage(0); };

  const pageRedactions = redactions.filter(r => r.page === currentPage).length;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file && !loading && <DropZone onFiles={addFile} disabled={loading} />}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading PDF pages…
        </div>
      )}

      <AnimatePresence>
        {file && pageImages.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Change file
              </button>
            </div>

            {/* Page navigation */}
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-foreground">
                Page {currentPage + 1} of {file.pageCount}
              </span>
              <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setCurrentPage(p => Math.min(file.pageCount - 1, p + 1))} disabled={currentPage >= file.pageCount - 1}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Draw rectangles on the page to redact areas · {pageRedactions} redaction{pageRedactions !== 1 ? 's' : ''} on this page · {redactions.length} total
            </p>

            {/* Canvas */}
            <div ref={containerRef} className="rounded-xl border border-border bg-muted/30 overflow-hidden cursor-crosshair">
              <canvas
                ref={canvasRef}
                className="w-full h-auto"
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={() => { setDrawing(false); setDrawStart(null); }}
              />
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
              <Button onClick={undoLast} variant="outline" size="sm" className="rounded-xl" disabled={pageRedactions === 0}>
                Undo Last
              </Button>
              <Button onClick={handleSave} disabled={saving || redactions.length === 0} size="lg" className="gap-2 font-display font-semibold rounded-xl">
                {saving ? (<><Loader2 className="h-5 w-5 animate-spin" />Saving…</>) : (<><EyeOff className="h-5 w-5" />Download Redacted PDF</>)}
              </Button>
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

export default PDFRedactor;
