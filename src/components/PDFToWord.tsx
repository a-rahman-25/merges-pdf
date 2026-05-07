import { useState, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, RotateCcw, ScanText, X, FileDown, Languages, Wand2, AlertTriangle, Image as ImageIcon, ChevronDown, ChevronUp, Gauge } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatFileSize } from '@/lib/pdf-utils';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { createWorker } from 'tesseract.js';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import PreDownloadSummary from '@/components/PreDownloadSummary';
import { logToolUsage } from '@/lib/analytics';

// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;

const OCR_LANGUAGES = [
  { code: 'eng', label: 'English' },
  { code: 'ara', label: 'Arabic' },
  { code: 'fra', label: 'French' },
  { code: 'deu', label: 'German' },
  { code: 'spa', label: 'Spanish' },
  { code: 'ita', label: 'Italian' },
  { code: 'por', label: 'Portuguese' },
  { code: 'rus', label: 'Russian' },
  { code: 'chi_sim', label: 'Chinese (Simplified)' },
  { code: 'chi_tra', label: 'Chinese (Traditional)' },
  { code: 'jpn', label: 'Japanese' },
  { code: 'kor', label: 'Korean' },
  { code: 'hin', label: 'Hindi' },
  { code: 'tur', label: 'Turkish' },
  { code: 'nld', label: 'Dutch' },
  { code: 'pol', label: 'Polish' },
  { code: 'ukr', label: 'Ukrainian' },
  { code: 'vie', label: 'Vietnamese' },
];

const DEFAULT_LOW_CONF = 70;

type LineItem = { x: number; y: number; w: number; text: string };

type ImageAlign = 'left' | 'center' | 'right';

type Block =
  | { type: 'pageHeader'; page: number }
  | { type: 'colHeader'; text: string }
  | { type: 'text'; text: string; confidence?: number; page: number }
  | {
      type: 'image';
      bytes: Uint8Array;
      w: number;
      h: number;
      page: number;
      caption?: string;
      align?: ImageAlign;
      widthPct?: number; // % of page width the image occupies in the PDF
    }
  | { type: 'empty' };

function clusterColumns(items: any[], pageWidth: number): string[] {
  const atoms = items
    .filter((it) => (it.str ?? '').trim().length > 0)
    .map((it) => ({
      x: it.transform?.[4] ?? 0,
      y: Math.round((it.transform?.[5] ?? 0) * 10) / 10,
      w: it.width ?? (it.str?.length ?? 0) * 4,
      text: it.str as string,
    }));
  if (!atoms.length) return [];

  atoms.sort((a, b) => b.y - a.y || a.x - b.x);
  const yLines: LineItem[][] = [];
  for (const a of atoms) {
    const last = yLines[yLines.length - 1];
    if (last && Math.abs(last[0].y - a.y) < 2.5) last.push(a);
    else yLines.push([a]);
  }

  const colGapThreshold = pageWidth * 0.08;
  const segments: { col: number; y: number; text: string }[] = [];
  for (const line of yLines) {
    line.sort((a, b) => a.x - b.x);
    let currentCol: typeof line = [line[0]];
    const groups: (typeof line)[] = [currentCol];
    for (let i = 1; i < line.length; i++) {
      const prev = line[i - 1];
      const cur = line[i];
      const gap = cur.x - (prev.x + prev.w);
      if (gap > colGapThreshold) {
        currentCol = [cur];
        groups.push(currentCol);
      } else {
        currentCol.push(cur);
      }
    }
    for (const g of groups) {
      const startX = g[0].x;
      const col = startX < pageWidth / 3 ? 0 : startX < (pageWidth * 2) / 3 ? 1 : 2;
      segments.push({ col, y: g[0].y, text: g.map((a) => a.text).join(' ').trim() });
    }
  }

  const usedCols = new Set(segments.map((s) => s.col));
  const isMultiCol = usedCols.size >= 2 &&
    yLines.filter((ln) => {
      const cols = new Set(
        ln.map((a) => (a.x < pageWidth / 3 ? 0 : a.x < (pageWidth * 2) / 3 ? 1 : 2))
      );
      return cols.size >= 2;
    }).length >= 3;

  if (!isMultiCol) return segments.map((s) => s.text).filter(Boolean);

  const out: string[] = [];
  for (const c of [0, 1, 2]) {
    const colLines = segments.filter((s) => s.col === c).sort((a, b) => b.y - a.y);
    if (colLines.length) {
      out.push(`[Column ${c + 1}]`);
      for (const l of colLines) out.push(l.text);
      out.push('');
    }
  }
  return out.filter((_, i, arr) => !(arr[i] === '' && arr[i + 1] === ''));
}

async function renderPageCanvas(page: any, scale: number, preprocess = false): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

  if (preprocess) {
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = img.data;
    const hist = new Uint32Array(256);
    for (let i = 0; i < d.length; i += 4) {
      const g = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) | 0;
      d[i] = d[i + 1] = d[i + 2] = g;
      hist[g]++;
    }
    const total = (d.length / 4) | 0;
    let sum = 0;
    for (let t = 0; t < 256; t++) sum += t * hist[t];
    let sumB = 0, wB = 0, varMax = 0, threshold = 128;
    for (let t = 0; t < 256; t++) {
      wB += hist[t];
      if (!wB) continue;
      const wF = total - wB;
      if (!wF) break;
      sumB += t * hist[t];
      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;
      const v = wB * wF * (mB - mF) * (mB - mF);
      if (v > varMax) { varMax = v; threshold = t; }
    }
    for (let i = 0; i < d.length; i += 4) {
      const v = d[i] > threshold ? 255 : 0;
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    ctx.putImageData(img, 0, 0);
  }
  return canvas;
}

async function canvasToPng(canvas: HTMLCanvasElement): Promise<{ bytes: Uint8Array; w: number; h: number }> {
  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/png', 0.92)!);
  const buf = await blob.arrayBuffer();
  return { bytes: new Uint8Array(buf), w: canvas.width, h: canvas.height };
}

// Extract embedded images from a PDF page WITH positional info derived from
// the page's content stream (transform matrix → x, y, width on page).
async function extractPageImages(
  page: any
): Promise<{ bytes: Uint8Array; w: number; h: number; pageX: number; pageY: number; drawW: number; drawH: number }[]> {
  const out: { bytes: Uint8Array; w: number; h: number; pageX: number; pageY: number; drawW: number; drawH: number }[] = [];
  try {
    const ops = await page.getOperatorList();
    const OPS = (pdfjsLib as any).OPS;
    // Walk the operator stream tracking the current transform matrix (ctm).
    // PDF transform: [a b c d e f]; image is drawn in unit square then transformed.
    const stack: number[][] = [];
    let ctm: number[] = [1, 0, 0, 1, 0, 0];
    const mul = (m1: number[], m2: number[]) => [
      m1[0] * m2[0] + m1[2] * m2[1],
      m1[1] * m2[0] + m1[3] * m2[1],
      m1[0] * m2[2] + m1[2] * m2[3],
      m1[1] * m2[2] + m1[3] * m2[3],
      m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
      m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
    ];

    const seen = new Set<string>();
    for (let i = 0; i < ops.fnArray.length; i++) {
      const fn = ops.fnArray[i];
      const args = ops.argsArray[i];
      if (fn === OPS.save) stack.push(ctm.slice());
      else if (fn === OPS.restore) ctm = stack.pop() || [1, 0, 0, 1, 0, 0];
      else if (fn === OPS.transform) ctm = mul(ctm, args);
      else if (
        fn === OPS.paintImageXObject ||
        fn === OPS.paintJpegXObject ||
        fn === OPS.paintInlineImageXObject
      ) {
        const name = args?.[0];
        const key = `${name}@${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        // ctm maps unit square to page space: width≈|a|, height≈|d|, origin = (e, f)
        const drawW = Math.abs(ctm[0]) || Math.abs(ctm[2]) || 1;
        const drawH = Math.abs(ctm[3]) || Math.abs(ctm[1]) || 1;
        const pageX = ctm[4];
        const pageY = ctm[5];
        try {
          const imgObj: any = await new Promise((resolve) => {
            try { page.objs.get(name, (o: any) => resolve(o)); } catch { resolve(null); }
          });
          if (!imgObj) continue;
          const bm: ImageBitmap | HTMLImageElement | undefined = imgObj.bitmap;
          let w = imgObj.width, h = imgObj.height;
          const c = document.createElement('canvas');
          if (bm && (bm as any).width) {
            w = (bm as any).width; h = (bm as any).height;
            c.width = w; c.height = h;
            c.getContext('2d')!.drawImage(bm as any, 0, 0);
          } else if (imgObj.data) {
            c.width = w; c.height = h;
            const cx = c.getContext('2d')!;
            const id = cx.createImageData(w, h);
            const src = imgObj.data;
            if (src.length === w * h * 4) id.data.set(src);
            else if (src.length === w * h * 3) {
              for (let p = 0, q = 0; p < src.length; p += 3, q += 4) {
                id.data[q] = src[p]; id.data[q + 1] = src[p + 1]; id.data[q + 2] = src[p + 2]; id.data[q + 3] = 255;
              }
            } else continue;
            cx.putImageData(id, 0, 0);
          } else continue;
          const png = await canvasToPng(c);
          if (png.w < 40 || png.h < 40) continue;
          out.push({ ...png, pageX, pageY, drawW, drawH });
        } catch { /* skip image errors */ }
      }
    }
  } catch { /* ignore */ }
  return out;
}

function fitImageToWidth(naturalW: number, naturalH: number, targetW: number, maxH = 720) {
  const ratio = naturalH / naturalW;
  let width = Math.min(targetW, naturalW * 1.5);
  let height = width * ratio;
  if (height > maxH) { height = maxH; width = height / ratio; }
  return { width: Math.round(width), height: Math.round(height) };
}

async function buildDocxFromBlocks(blocks: Block[], sourceName: string): Promise<Blob> {
  const children: Paragraph[] = [
    new Paragraph({ children: [new TextRun({ text: `Converted from: ${sourceName}`, bold: true, size: 28 })], spacing: { after: 300 } }),
  ];
  for (const b of blocks) {
    if (b.type === 'pageHeader') {
      children.push(new Paragraph({ children: [new TextRun({ text: `— Page ${b.page} —`, bold: true, size: 24 })], spacing: { before: 400, after: 200 } }));
    } else if (b.type === 'colHeader') {
      children.push(new Paragraph({ children: [new TextRun({ text: b.text, size: 20, bold: true, italics: true, color: '6B7280' })], spacing: { after: 120 } }));
    } else if (b.type === 'text') {
      const lowConf = b.confidence !== undefined && b.confidence < LOW_CONF_THRESHOLD;
      children.push(new Paragraph({
        children: [new TextRun({ text: b.text, size: 22, color: lowConf ? 'B45309' : undefined, highlight: lowConf ? 'yellow' : undefined })],
        spacing: { after: 80 },
      }));
    } else if (b.type === 'image') {
      const dim = fitImageToPage(b.w, b.h);
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 120 },
        children: [new ImageRun({
          // @ts-ignore - type required at runtime
          type: 'png',
          data: b.bytes,
          transformation: { width: dim.width, height: dim.height },
        } as any)],
      }));
      if (b.caption) {
        children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: b.caption, size: 18, italics: true, color: '6B7280' })], spacing: { after: 160 } }));
      }
    } else if (b.type === 'empty') {
      children.push(new Paragraph({ children: [new TextRun({ text: '[No text could be extracted from this page]', italics: true, size: 20, color: '888888' })], spacing: { after: 200 } }));
    }
  }
  const doc = new Document({ sections: [{ children }] });
  return await Packer.toBlob(doc);
}

const PDFToWord = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [ocrLang, setOcrLang] = useState<string>('eng');
  const [preprocess, setPreprocess] = useState<boolean>(true);
  const [embedImages, setEmbedImages] = useState<boolean>(true);
  const [showReviewPanel, setShowReviewPanel] = useState<boolean>(true);

  const [result, setResult] = useState<{
    blocks: Block[];
    pageCount: number;
    ocrPages: number;
    multiColPages: number;
    imageCount: number;
    rawText: string;
    blob: Blob;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef<boolean>(false);
  const workerRef = useRef<Awaited<ReturnType<typeof createWorker>> | null>(null);

  const lowConfIndices = useMemo(
    () => result ? result.blocks.map((b, i) => ({ b, i })).filter(({ b }) => b.type === 'text' && b.confidence !== undefined && b.confidence < LOW_CONF_THRESHOLD).map(({ i }) => i) : [],
    [result]
  );

  const updateLowConfLine = (idx: number, newText: string) => {
    if (!result) return;
    const blocks = [...result.blocks];
    const b = blocks[idx];
    if (b.type === 'text') {
      // Mark as edited: bump confidence above threshold so warning clears
      blocks[idx] = { ...b, text: newText, confidence: 100 };
      setResult({ ...result, blocks });
    }
  };

  const doDownload = useCallback(async (filename?: string) => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    // Rebuild docx with any user edits applied
    const blob = await buildDocxFromBlocks(result.blocks, file.name);
    saveAs(blob, filename || `${baseName}.docx`);
    toast.success('Word file downloaded!');
  }, [result, file]);

  const downloadTxt = useCallback(() => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    const txt = result.blocks
      .map((b) =>
        b.type === 'pageHeader' ? `\n=== Page ${b.page} ===` :
        b.type === 'colHeader' ? b.text :
        b.type === 'text' ? b.text :
        b.type === 'image' ? `[Image: ${b.w}×${b.h} on page ${b.page}]` :
        b.type === 'empty' ? '[No text]' : ''
      ).join('\n');
    const blob = new Blob([`Converted from: ${file.name}\n${txt}`], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${baseName}.txt`);
    toast.success('Text file downloaded!');
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Please select a PDF file.'); return; }
    setFile({ file: f, name: f.name, size: f.size });
    setResult(null);
    toast.success(`Selected: ${f.name}`);
    e.target.value = '';
  }, []);

  const handleCancel = async () => {
    cancelRef.current = true;
    setProgress('Cancelling…');
    if (workerRef.current) {
      try { await workerRef.current.terminate(); } catch {}
      workerRef.current = null;
    }
    toast.info('Conversion cancelled.');
  };

  const handleConvert = async () => {
    if (!file) return;
    cancelRef.current = false;
    setProcessing(true);
    setProgress('Reading PDF…');
    const checkCancel = () => { if (cancelRef.current) throw new Error('__cancelled__'); };

    try {
      const buffer = await file.file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const pageCount = pdf.numPages;

      const blocks: Block[] = [];
      let ocrPages = 0;
      let multiColPages = 0;
      let imageCount = 0;
      const txtParts: string[] = [];

      for (let i = 1; i <= pageCount; i++) {
        checkCancel();
        setProgress(`Extracting page ${i} of ${pageCount}…`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const content = await page.getTextContent();

        let pageLines = clusterColumns(content.items as any[], viewport.width);
        const nativeChars = pageLines.join(' ').replace(/\s/g, '').length;
        const wasMultiCol = pageLines.some((l) => l.startsWith('[Column '));
        if (wasMultiCol) multiColPages++;

        blocks.push({ type: 'pageHeader', page: i });
        txtParts.push(`\n=== Page ${i} ===`);

        let usedOCR = false;
        let ocrLineConfidences: { text: string; confidence: number }[] = [];

        if (nativeChars < 20) {
          checkCancel();
          setProgress(`Page ${i}: scanned content — preparing OCR (${ocrLang})…`);
          if (!workerRef.current) {
            workerRef.current = await createWorker(ocrLang, 1, {
              logger: (m: any) => {
                if (cancelRef.current) return;
                if (m.status === 'recognizing text') {
                  setProgress(`Page ${i}/${pageCount} OCR: ${Math.round((m.progress || 0) * 100)}%`);
                } else if (m.status) {
                  setProgress(`Page ${i}/${pageCount}: ${m.status}…`);
                }
              },
            });
          }
          checkCancel();
          const canvas = await renderPageCanvas(page, 2.5, preprocess);
          checkCancel();
          const { data } = await workerRef.current.recognize(canvas);
          const lines: any[] = (data as any).lines || [];
          if (lines.length) {
            ocrLineConfidences = lines
              .map((l) => ({ text: (l.text || '').trim(), confidence: Math.round(l.confidence || 0) }))
              .filter((l) => l.text.length > 0);
          } else {
            const text = (data.text || '').trim();
            ocrLineConfidences = text.split('\n').map((s) => s.trim()).filter(Boolean)
              .map((t) => ({ text: t, confidence: Math.round((data as any).confidence || 0) }));
          }
          if (ocrLineConfidences.length) {
            usedOCR = true;
            ocrPages++;
            pageLines = []; // replaced by ocr blocks
          }
          canvas.width = 0; canvas.height = 0;
        }

        if (usedOCR) {
          for (const l of ocrLineConfidences) {
            blocks.push({ type: 'text', text: l.text, confidence: l.confidence, page: i });
            txtParts.push(l.text);
          }
        } else if (pageLines.length === 0) {
          blocks.push({ type: 'empty' });
          txtParts.push('[No text]');
        } else {
          for (const line of pageLines) {
            if (line.startsWith('[Column ')) {
              blocks.push({ type: 'colHeader', text: line });
            } else {
              blocks.push({ type: 'text', text: line, page: i });
            }
            txtParts.push(line);
          }
        }

        // Image extraction (native pages only — OCR pages are already images)
        if (embedImages && !usedOCR) {
          checkCancel();
          setProgress(`Page ${i}: extracting images…`);
          const imgs = await extractPageImages(page);
          for (const im of imgs) {
            blocks.push({ type: 'image', bytes: im.bytes, w: im.w, h: im.h, page: i, caption: `Image from page ${i}` });
            imageCount++;
          }
        }
      }

      checkCancel();
      setProgress('Building Word document…');
      const blob = await buildDocxFromBlocks(blocks, file.name);
      const rawText = `Converted from: ${file.name}\n` + txtParts.join('\n');

      setResult({ blocks, pageCount, ocrPages, multiColPages, imageCount, rawText, blob });
      const bits: string[] = [];
      if (ocrPages > 0) bits.push(`${ocrPages} OCR page${ocrPages > 1 ? 's' : ''}`);
      if (multiColPages > 0) bits.push(`${multiColPages} multi-column`);
      if (imageCount > 0) bits.push(`${imageCount} image${imageCount > 1 ? 's' : ''}`);
      toast.success(bits.length ? `Converted! ${bits.join(', ')}.` : 'Converted to Word!');
      logToolUsage('PDF to Word', '/pdf-to-word');
    } catch (err: any) {
      if (err?.message !== '__cancelled__') {
        toast.error('Failed to convert PDF to Word.');
        console.error(err);
      }
    } finally {
      if (workerRef.current) {
        try { await workerRef.current.terminate(); } catch {}
        workerRef.current = null;
      }
      cancelRef.current = false;
      setProgress('');
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all">
          <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4"><FileText className="h-8 w-8 text-primary" /></div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">Select a PDF to convert</p>
              <p className="mt-1 text-sm text-muted-foreground">Convert PDF to Microsoft Word (.docx) format</p>
            </div>
          </div>
        </motion.div>
      ) : !result ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-medium text-muted-foreground">{file.name}</p>
            <button onClick={reset} disabled={processing} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-card p-3 pr-4 border border-border">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-display font-semibold text-foreground">
              <ScanText className="h-4 w-4 text-primary" /> Conversion settings
            </div>

            <div className="space-y-2">
              <Label htmlFor="ocr-lang" className="text-xs flex items-center gap-1.5 text-muted-foreground">
                <Languages className="h-3.5 w-3.5" /> OCR language (used for scanned pages)
              </Label>
              <Select value={ocrLang} onValueChange={setOcrLang} disabled={processing}>
                <SelectTrigger id="ocr-lang" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {OCR_LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <Label htmlFor="preprocess" className="text-xs flex items-center gap-1.5 text-foreground">
                  <Wand2 className="h-3.5 w-3.5" /> Image preprocessing
                </Label>
                <p className="text-[11px] text-muted-foreground">Grayscale + auto-threshold for cleaner scans</p>
              </div>
              <Switch id="preprocess" checked={preprocess} onCheckedChange={setPreprocess} disabled={processing} />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <Label htmlFor="embed-images" className="text-xs flex items-center gap-1.5 text-foreground">
                  <ImageIcon className="h-3.5 w-3.5" /> Extract embedded images
                </Label>
                <p className="text-[11px] text-muted-foreground">Embeds every image from the PDF inside the Word file</p>
              </div>
              <Switch id="embed-images" checked={embedImages} onCheckedChange={setEmbedImages} disabled={processing} />
            </div>
          </div>

          {processing ? (
            <div className="space-y-2">
              <Button disabled size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
                <Loader2 className="h-5 w-5 animate-spin" />{progress || 'Converting…'}
              </Button>
              <Button onClick={handleCancel} variant="outline" size="lg" className="w-full gap-2 h-12 rounded-xl">
                <X className="h-4 w-4" /> Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={handleConvert} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
              <FileText className="h-5 w-5" /> Convert to Word
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-3">
          <PreDownloadSummary
            title="Converted to Word"
            items={[
              { label: 'Source', value: file.name },
              { label: 'Pages', value: `${result.pageCount}` },
              { label: 'OCR pages', value: result.ocrPages > 0 ? `${result.ocrPages} (${OCR_LANGUAGES.find(l => l.code === ocrLang)?.label})` : 'None — native text' },
              { label: 'Multi-column pages', value: result.multiColPages > 0 ? `${result.multiColPages}` : 'None' },
              { label: 'Embedded images', value: result.imageCount > 0 ? `${result.imageCount}` : 'None' },
              { label: 'Low-confidence OCR lines', value: lowConfIndices.length > 0 ? `${lowConfIndices.length} — review below` : 'None' },
              { label: 'Output', value: `${file.name.replace(/\.pdf$/i, '.docx')}` },
            ]}
            onDownload={triggerDownload}
          />

          {lowConfIndices.length > 0 && (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4 space-y-3">
              <button
                onClick={() => setShowReviewPanel((v) => !v)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-display font-semibold text-foreground">
                    OCR confidence report — {lowConfIndices.length} line{lowConfIndices.length > 1 ? 's' : ''} below {LOW_CONF_THRESHOLD}%
                  </span>
                </div>
                {showReviewPanel ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>
              {showReviewPanel && (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  <p className="text-xs text-muted-foreground">
                    Edit any line to correct it before downloading. Changes apply to the Word file.
                  </p>
                  {lowConfIndices.map((idx) => {
                    const b = result.blocks[idx];
                    if (b.type !== 'text') return null;
                    return (
                      <div key={idx} className="rounded-lg border border-border bg-background p-3 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">Page {b.page}</span>
                          <span className={`font-medium ${b.confidence! < 50 ? 'text-red-600' : 'text-amber-600'}`}>
                            {b.confidence}% confidence
                          </span>
                        </div>
                        <Textarea
                          value={b.text}
                          onChange={(e) => updateLowConfLine(idx, e.target.value)}
                          rows={2}
                          className="text-sm resize-none"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <Button onClick={downloadTxt} variant="outline" size="lg" className="w-full gap-2 h-12 rounded-xl">
            <FileDown className="h-4 w-4" /> Download extracted text (.txt)
          </Button>
          <Button onClick={reset} variant="ghost" size="sm" className="w-full">
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Convert another PDF
          </Button>
        </div>
      )}

      <ReviewDialog open={showReview} toolName="PDF to Word" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFToWord;
