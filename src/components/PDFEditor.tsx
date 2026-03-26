import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type, Highlighter, Pen, Minus, ArrowRight, Square, Circle,
  StickyNote, Image, Undo2, Redo2, Loader2, RotateCcw, Trash2,
  Copy, RotateCw, ChevronLeft, ChevronRight, Download, Move, X,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import { logToolUsage } from '@/lib/analytics';

type AnnotationType = 'text' | 'highlight' | 'draw' | 'line' | 'arrow' | 'rect' | 'circle' | 'note' | 'image';

interface Annotation {
  id: string;
  type: AnnotationType;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  points?: { x: number; y: number }[];
  imageDataUrl?: string;
}

const TOOLS: { type: AnnotationType; icon: any; label: string }[] = [
  { type: 'text', icon: Type, label: 'Add Text' },
  { type: 'highlight', icon: Highlighter, label: 'Highlight' },
  { type: 'draw', icon: Pen, label: 'Draw' },
  { type: 'line', icon: Minus, label: 'Line' },
  { type: 'arrow', icon: ArrowRight, label: 'Arrow' },
  { type: 'rect', icon: Square, label: 'Rectangle' },
  { type: 'circle', icon: Circle, label: 'Circle' },
  { type: 'note', icon: StickyNote, label: 'Sticky Note' },
  { type: 'image', icon: Image, label: 'Insert Image' },
];

const FONTS = ['Helvetica', 'Times-Roman', 'Courier', 'Helvetica-Bold', 'Times-Bold'];
const COLORS = ['#1a1a1a', '#2563eb', '#dc2626', '#16a34a', '#f59e0b', '#7c3aed'];

const PDFEditor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTool, setActiveTool] = useState<AnnotationType | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [undoStack, setUndoStack] = useState<Annotation[][]>([]);
  const [redoStack, setRedoStack] = useState<Annotation[][]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [drawingPoints, setDrawingPoints] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [color, setColor] = useState('#1a1a1a');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Helvetica');
  const [textInput, setTextInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [pageCount, setPageCount] = useState(0);

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback((filename?: string) => {
    if (result && file) {
      downloadBlob(result, filename || file.name.replace(/\.pdf$/i, '_edited.pdf'));
      toast.success('Downloaded!');
    }
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'PDF Editor');

  const pushUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-19), [...annotations]]);
    setRedoStack([]);
  }, [annotations]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    setRedoStack(prev => [...prev, [...annotations]]);
    const last = undoStack[undoStack.length - 1];
    setAnnotations(last);
    setUndoStack(prev => prev.slice(0, -1));
  }, [undoStack, annotations]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    setUndoStack(prev => [...prev, [...annotations]]);
    const last = redoStack[redoStack.length - 1];
    setAnnotations(last);
    setRedoStack(prev => prev.slice(0, -1));
  }, [redoStack, annotations]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
      if (e.key === 'Escape') { setActiveTool(null); setSelectedAnnotation(null); }
      if (e.key === 'Delete' && selectedAnnotation) {
        pushUndo();
        setAnnotations(prev => prev.filter(a => a.id !== selectedAnnotation));
        setSelectedAnnotation(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, selectedAnnotation, pushUndo]);

  const loadFile = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setAnnotations([]);
    setUndoStack([]);
    setRedoStack([]);
    setCurrentPage(0);

    try {
      const arrayBuf = await f.arrayBuffer();
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const pdf = await pdfjsLib.getDocument({ data: arrayBuf }).promise;
      setPageCount(pdf.numPages);
      const images: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport: vp, canvas } as any).promise;
        images.push(canvas.toDataURL('image/png'));
      }
      setPageImages(images);
    } catch {
      toast.error('Failed to load PDF');
    }
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!activeTool || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'draw' || activeTool === 'line' || activeTool === 'arrow') return;

    pushUndo();
    const ann: Annotation = {
      id: crypto.randomUUID(),
      type: activeTool,
      page: currentPage,
      x, y,
      width: activeTool === 'text' ? 200 : activeTool === 'note' ? 180 : activeTool === 'highlight' ? 150 : 100,
      height: activeTool === 'text' ? 30 : activeTool === 'note' ? 100 : activeTool === 'highlight' ? 24 : 80,
      color,
      fontSize,
      fontFamily,
      content: activeTool === 'text' ? 'Edit text...' : activeTool === 'note' ? 'Add note...' : '',
    };

    if (activeTool === 'image') {
      imgInputRef.current?.click();
      return;
    }

    setAnnotations(prev => [...prev, ann]);
    setSelectedAnnotation(ann.id);
  };

  const handleDrawStart = (e: React.MouseEvent) => {
    if (!activeTool || !['draw', 'line', 'arrow'].includes(activeTool) || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setIsDrawing(true);
    setDrawingPoints([{ x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  const handleDrawMove = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (activeTool === 'draw') {
      setDrawingPoints(prev => [...prev, point]);
    } else {
      setDrawingPoints(prev => [prev[0], point]);
    }
  };

  const handleDrawEnd = () => {
    if (!isDrawing || drawingPoints.length < 2) { setIsDrawing(false); setDrawingPoints([]); return; }
    pushUndo();
    const minX = Math.min(...drawingPoints.map(p => p.x));
    const minY = Math.min(...drawingPoints.map(p => p.y));
    const maxX = Math.max(...drawingPoints.map(p => p.x));
    const maxY = Math.max(...drawingPoints.map(p => p.y));

    setAnnotations(prev => [...prev, {
      id: crypto.randomUUID(),
      type: activeTool!,
      page: currentPage,
      x: minX, y: minY,
      width: maxX - minX || 1,
      height: maxY - minY || 1,
      color,
      points: drawingPoints,
    }]);
    setIsDrawing(false);
    setDrawingPoints([]);
  };

  const handleDragStart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(id);
    setSelectedAnnotation(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing) { handleDrawMove(e); return; }
    if (!dragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setAnnotations(prev => prev.map(a => a.id === dragging ? { ...a, x: x - a.width / 2, y: y - a.height / 2 } : a));
  };

  const handleMouseUp = () => {
    if (isDrawing) { handleDrawEnd(); return; }
    setDragging(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !canvasRef.current) return;
    const reader = new FileReader();
    reader.onload = () => {
      pushUndo();
      setAnnotations(prev => [...prev, {
        id: crypto.randomUUID(),
        type: 'image',
        page: currentPage,
        x: 50, y: 50,
        width: 200, height: 150,
        imageDataUrl: reader.result as string,
      }]);
    };
    reader.readAsDataURL(f);
    e.target.value = '';
  };

  const deleteAnnotation = (id: string) => {
    pushUndo();
    setAnnotations(prev => prev.filter(a => a.id !== id));
    if (selectedAnnotation === id) setSelectedAnnotation(null);
  };

  const duplicateAnnotation = (id: string) => {
    const ann = annotations.find(a => a.id === id);
    if (!ann) return;
    pushUndo();
    setAnnotations(prev => [...prev, { ...ann, id: crypto.randomUUID(), x: ann.x + 20, y: ann.y + 20 }]);
  };

  const saveAsPDF = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await PDFDocument.load(bytes);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const containerW = canvasRef.current?.clientWidth || 600;

      for (const ann of annotations) {
        if (ann.page >= pages.length) continue;
        const page = pages[ann.page];
        const { width: pdfW, height: pdfH } = page.getSize();
        const displayH = pageImages[ann.page] ? containerW * pdfH / pdfW : 800;
        const sx = pdfW / containerW;
        const sy = pdfH / displayH;

        const hexToRgb = (hex: string) => {
          const r = parseInt(hex.slice(1, 3), 16) / 255;
          const g = parseInt(hex.slice(3, 5), 16) / 255;
          const b = parseInt(hex.slice(5, 7), 16) / 255;
          return rgb(r, g, b);
        };

        const c = hexToRgb(ann.color || '#1a1a1a');
        const pdfX = ann.x * sx;
        const pdfY = pdfH - (ann.y + ann.height) * sy;

        switch (ann.type) {
          case 'text':
            page.drawText(ann.content || '', {
              x: pdfX, y: pdfY,
              size: (ann.fontSize || 16) * sx * 0.7,
              font, color: c,
            });
            break;
          case 'highlight':
            page.drawRectangle({
              x: pdfX, y: pdfY,
              width: ann.width * sx, height: ann.height * sy,
              color: rgb(1, 1, 0), opacity: 0.35,
            });
            break;
          case 'rect':
            page.drawRectangle({
              x: pdfX, y: pdfY,
              width: ann.width * sx, height: ann.height * sy,
              borderColor: c, borderWidth: 2, opacity: 0,
            });
            break;
          case 'circle':
            page.drawEllipse({
              x: pdfX + ann.width * sx / 2, y: pdfY + ann.height * sy / 2,
              xScale: ann.width * sx / 2, yScale: ann.height * sy / 2,
              borderColor: c, borderWidth: 2, opacity: 0,
            });
            break;
          case 'note':
            page.drawRectangle({
              x: pdfX, y: pdfY,
              width: ann.width * sx, height: ann.height * sy,
              color: rgb(1, 0.96, 0.68), opacity: 0.9,
            });
            page.drawText(ann.content || '', {
              x: pdfX + 5 * sx, y: pdfY + ann.height * sy - 15 * sy,
              size: 10 * sx, font, color: rgb(0.2, 0.2, 0.2),
            });
            break;
          case 'draw':
          case 'line':
          case 'arrow':
            if (ann.points && ann.points.length >= 2) {
              for (let i = 0; i < ann.points.length - 1; i++) {
                const p1 = ann.points[i];
                const p2 = ann.points[i + 1];
                page.drawLine({
                  start: { x: p1.x * sx, y: pdfH - p1.y * sy },
                  end: { x: p2.x * sx, y: pdfH - p2.y * sy },
                  thickness: 2 * sx, color: c,
                });
              }
            }
            break;
          case 'image':
            if (ann.imageDataUrl) {
              try {
                const imgBytes = await fetch(ann.imageDataUrl).then(r => r.arrayBuffer());
                const uint8 = new Uint8Array(imgBytes);
                const isPng = uint8[0] === 0x89 && uint8[1] === 0x50;
                const img = isPng ? await pdf.embedPng(uint8) : await pdf.embedJpg(uint8);
                page.drawImage(img, {
                  x: pdfX, y: pdfY,
                  width: ann.width * sx, height: ann.height * sy,
                });
              } catch { /* skip image */ }
            }
            break;
        }
      }

      const pdfBytes = await pdf.save();
      setResult(pdfBytes);
      toast.success('PDF saved!');
      logToolUsage('PDF Editor', '/pdf-editor');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save PDF');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPageImages([]);
    setAnnotations([]);
    setUndoStack([]);
    setRedoStack([]);
    setResult(null);
    setCurrentPage(0);
    setActiveTool(null);
  };

  const pageAnnotations = annotations.filter(a => a.page === currentPage);

  if (result && file) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3">
            <h3 className="text-lg font-bold text-foreground">PDF Edited Successfully</h3>
            <p className="text-sm text-muted-foreground">{annotations.length} annotations · {formatFileSize(result.byteLength)}</p>
            <Button onClick={() => triggerDownload()} className="rounded-xl gradient-bg border-0 gap-1.5">
              <Download className="h-4 w-4" /> Download Edited PDF
            </Button>
          </div>
          <div className="flex justify-center">
            <Button onClick={reset} variant="outline" className="rounded-xl"><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
          </div>
        </motion.div>
        <ReviewDialog open={showReview} toolName="PDF Editor" onSubmit={handleSubmit} onSkip={handleSkip} />
      </div>
    );
  }

  if (!file) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = Array.from(e.dataTransfer.files).find(f => f.type === 'application/pdf'); if (f) loadFile(f); }}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-16 text-center transition-all hover:border-primary/50 hover:bg-accent/30"
        >
          <Type className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold text-foreground">Drop a PDF to edit</p>
          <p className="mt-1 text-sm text-muted-foreground">Add text, highlights, drawings, shapes & more</p>
        </div>
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ''; }} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3">
        {TOOLS.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setActiveTool(activeTool === tool.type ? null : tool.type)}
            title={tool.label}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
              activeTool === tool.type ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <tool.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tool.label}</span>
          </button>
        ))}

        <div className="mx-2 h-6 w-px bg-border" />

        <button onClick={undo} disabled={undoStack.length === 0} title="Undo (Ctrl+Z)" className="p-2 rounded-xl text-muted-foreground hover:bg-secondary disabled:opacity-30">
          <Undo2 className="h-4 w-4" />
        </button>
        <button onClick={redo} disabled={redoStack.length === 0} title="Redo (Ctrl+Y)" className="p-2 rounded-xl text-muted-foreground hover:bg-secondary disabled:opacity-30">
          <Redo2 className="h-4 w-4" />
        </button>
      </div>

      {/* Options bar */}
      {activeTool && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
          <div className="flex gap-1.5">
            {COLORS.map((c) => (
              <button key={c} onClick={() => setColor(c)}
                className={`h-6 w-6 rounded-full border-2 transition-all ${color === c ? 'border-primary scale-110' : 'border-border'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
          {(activeTool === 'text' || activeTool === 'note') && (
            <>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="w-32 h-8 text-xs rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>{FONTS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{fontSize}px</span>
                <Slider value={[fontSize]} onValueChange={v => setFontSize(v[0])} min={8} max={48} step={1} className="w-20" />
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex gap-4">
        {/* Page thumbnails sidebar */}
        <div className="hidden lg:block w-24 space-y-2 max-h-[600px] overflow-y-auto scrollbar-hide">
          {pageImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-full rounded-lg border-2 overflow-hidden transition-all ${
                currentPage === i ? 'border-primary shadow-md' : 'border-border hover:border-primary/30'
              }`}
            >
              <img src={img} alt={`Page ${i + 1}`} className="w-full" />
              <p className="text-[10px] text-muted-foreground py-0.5">{i + 1}</p>
            </button>
          ))}
        </div>

        {/* Main canvas */}
        <div className="flex-1">
          <div
            ref={canvasRef}
            className="relative rounded-xl border border-border bg-card overflow-hidden select-none cursor-crosshair"
            onClick={handleCanvasClick}
            onMouseDown={handleDrawStart}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {pageImages[currentPage] && (
              <img src={pageImages[currentPage]} alt={`Page ${currentPage + 1}`} className="w-full pointer-events-none" draggable={false} />
            )}

            {/* SVG overlay for drawing */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
              {/* Active drawing path */}
              {isDrawing && drawingPoints.length > 1 && (
                <polyline
                  points={drawingPoints.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
              )}
              {/* Saved line/draw annotations */}
              {pageAnnotations.filter(a => ['draw', 'line', 'arrow'].includes(a.type) && a.points).map(a => (
                <polyline
                  key={a.id}
                  points={a.points!.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none" stroke={a.color || '#1a1a1a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); setSelectedAnnotation(a.id); }}
                />
              ))}
            </svg>

            {/* Annotations */}
            {pageAnnotations.filter(a => !['draw', 'line', 'arrow'].includes(a.type)).map((ann) => (
              <div
                key={ann.id}
                className={`absolute cursor-move rounded ${selectedAnnotation === ann.id ? 'ring-2 ring-primary' : ''}`}
                style={{
                  left: ann.x, top: ann.y, width: ann.width, height: ann.height, zIndex: 20,
                  backgroundColor: ann.type === 'highlight' ? 'rgba(255,255,0,0.35)' :
                    ann.type === 'note' ? 'rgba(255,245,157,0.95)' :
                    ann.type === 'rect' ? 'transparent' :
                    ann.type === 'circle' ? 'transparent' : undefined,
                  border: ann.type === 'rect' ? `2px solid ${ann.color}` :
                    ann.type === 'circle' ? `2px solid ${ann.color}` : undefined,
                  borderRadius: ann.type === 'circle' ? '50%' : undefined,
                }}
                onMouseDown={(e) => handleDragStart(ann.id, e)}
              >
                {ann.type === 'text' && (
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    className="w-full h-full outline-none text-foreground"
                    style={{ fontSize: ann.fontSize, fontFamily: ann.fontFamily, color: ann.color }}
                    onBlur={(e) => {
                      const newContent = e.currentTarget.textContent || '';
                      setAnnotations(prev => prev.map(a => a.id === ann.id ? { ...a, content: newContent } : a));
                    }}
                  >
                    {ann.content}
                  </div>
                )}
                {ann.type === 'note' && (
                  <div className="p-2 text-xs" style={{ color: '#333' }}>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="outline-none w-full h-full"
                      onBlur={(e) => {
                        setAnnotations(prev => prev.map(a => a.id === ann.id ? { ...a, content: e.currentTarget.textContent || '' } : a));
                      }}
                    >
                      {ann.content}
                    </div>
                  </div>
                )}
                {ann.type === 'image' && ann.imageDataUrl && (
                  <img src={ann.imageDataUrl} alt="annotation" className="w-full h-full object-contain pointer-events-none" />
                )}
                {selectedAnnotation === ann.id && (
                  <div className="absolute -top-8 left-0 flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); duplicateAnnotation(ann.id); }} className="h-6 w-6 rounded bg-card border border-border flex items-center justify-center" title="Duplicate">
                      <Copy className="h-3 w-3" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteAnnotation(ann.id); }} className="h-6 w-6 rounded bg-destructive text-destructive-foreground flex items-center justify-center" title="Delete">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Page navigation */}
          <div className="flex items-center justify-between mt-3">
            <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="rounded-xl">
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <span className="text-sm text-muted-foreground">Page {currentPage + 1} of {pageCount}</span>
            <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.min(pageCount - 1, p + 1))} disabled={currentPage >= pageCount - 1} className="rounded-xl">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset} className="rounded-xl"><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
        <Button onClick={saveAsPDF} disabled={processing || annotations.length === 0} className="flex-1 rounded-xl gradient-bg border-0">
          {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : <><Download className="mr-2 h-4 w-4" /> Save PDF ({annotations.length} annotations)</>}
        </Button>
      </div>

      <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      <ReviewDialog open={showReview} toolName="PDF Editor" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFEditor;
