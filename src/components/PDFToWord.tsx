import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, RotateCcw, ScanText, X, FileDown, Languages, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { formatFileSize } from '@/lib/pdf-utils';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { createWorker } from 'tesseract.js';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import PreDownloadSummary from '@/components/PreDownloadSummary';
import { logToolUsage } from '@/lib/analytics';

// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;

// Tesseract language packs (most common — covers ~95% of users)
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

type LineItem = { x: number; y: number; w: number; text: string };

/** Group items into visual lines by Y; then split each line into columns by detecting large X-gaps. */
function clusterColumns(items: any[], pageWidth: number): string[] {
  // 1. Build atoms (each pdf.js item)
  const atoms = items
    .filter((it) => (it.str ?? '').trim().length > 0)
    .map((it) => ({
      x: it.transform?.[4] ?? 0,
      y: Math.round((it.transform?.[5] ?? 0) * 10) / 10,
      w: it.width ?? (it.str?.length ?? 0) * 4,
      text: it.str as string,
      hasEOL: !!it.hasEOL,
    }));
  if (!atoms.length) return [];

  // 2. Group atoms into Y-lines (tolerance 2pt)
  atoms.sort((a, b) => b.y - a.y || a.x - b.x);
  const yLines: LineItem[][] = [];
  for (const a of atoms) {
    const last = yLines[yLines.length - 1];
    if (last && Math.abs(last[0].y - a.y) < 2.5) last.push(a);
    else yLines.push([a]);
  }

  // 3. For each Y-line, split into column-groups by large X gaps (>15% of page width)
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
      // Determine column index by start X (left third / middle third / right third)
      const startX = g[0].x;
      const col = startX < pageWidth / 3 ? 0 : startX < (pageWidth * 2) / 3 ? 1 : 2;
      segments.push({ col, y: g[0].y, text: g.map((a) => a.text).join(' ').trim() });
    }
  }

  // 4. Detect column count: if any line has >=2 segments in different cols, treat as multi-column
  const usedCols = new Set(segments.map((s) => s.col));
  const isMultiCol = usedCols.size >= 2 &&
    yLines.filter((ln) => {
      const cols = new Set(
        ln.map((a) => (a.x < pageWidth / 3 ? 0 : a.x < (pageWidth * 2) / 3 ? 1 : 2))
      );
      return cols.size >= 2;
    }).length >= 3;

  if (!isMultiCol) {
    // Single-column: read top-to-bottom
    return segments.map((s) => s.text).filter(Boolean);
  }

  // Multi-column: read each column top-to-bottom in order (col 0 → 1 → 2)
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

/** Render a PDF page to canvas, then preprocess: grayscale + adaptive threshold for OCR. */
async function renderPageForOCR(
  page: any,
  preprocess: boolean,
  scale = 2.5
): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  // White background (some PDFs render transparent)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

  if (!preprocess) return canvas;

  // Grayscale + Otsu-like threshold
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data;
  // Step 1: grayscale + histogram
  const hist = new Uint32Array(256);
  for (let i = 0; i < d.length; i += 4) {
    const g = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) | 0;
    d[i] = d[i + 1] = d[i + 2] = g;
    hist[g]++;
  }
  // Step 2: Otsu threshold
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
  // Step 3: binarize
  for (let i = 0; i < d.length; i += 4) {
    const v = d[i] > threshold ? 255 : 0;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

const PDFToWord = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [ocrLang, setOcrLang] = useState<string>('eng');
  const [preprocess, setPreprocess] = useState<boolean>(true);
  const [result, setResult] = useState<{
    blob: Blob;
    txtBlob: Blob;
    pageCount: number;
    ocrPages: number;
    multiColPages: number;
    rawText: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef<boolean>(false);
  const workerRef = useRef<Awaited<ReturnType<typeof createWorker>> | null>(null);

  const doDownload = useCallback((filename?: string) => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    saveAs(result.blob, filename || `${baseName}.docx`);
    toast.success('Word file downloaded!');
  }, [result, file]);

  const downloadTxt = useCallback(() => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    saveAs(result.txtBlob, `${baseName}.txt`);
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

      const paragraphs: Paragraph[] = [
        new Paragraph({ children: [new TextRun({ text: `Converted from: ${file.name}`, bold: true, size: 28 })], spacing: { after: 300 } }),
      ];

      const txtParts: string[] = [`Converted from: ${file.name}`, ''];
      let ocrPages = 0;
      let multiColPages = 0;

      for (let i = 1; i <= pageCount; i++) {
        checkCancel();
        setProgress(`Extracting page ${i} of ${pageCount}…`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const content = await page.getTextContent();

        // Layout-aware extraction (single OR multi-column)
        let pageLines = clusterColumns(content.items as any[], viewport.width);
        const nativeChars = pageLines.join(' ').replace(/\s/g, '').length;
        const wasMultiCol = pageLines.some((l) => l.startsWith('[Column '));
        if (wasMultiCol) multiColPages++;

        // OCR fallback (with preprocessing + selected language)
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
          const canvas = await renderPageForOCR(page, preprocess);
          checkCancel();
          const { data } = await workerRef.current.recognize(canvas);
          const ocrText = (data.text || '').trim();
          if (ocrText) {
            pageLines = ocrText.split('\n').map((s) => s.trim()).filter(Boolean);
            ocrPages++;
          }
          canvas.width = 0; canvas.height = 0;
        }

        paragraphs.push(
          new Paragraph({ children: [new TextRun({ text: `— Page ${i} —`, bold: true, size: 24 })], spacing: { before: 400, after: 200 } })
        );
        txtParts.push(`\n=== Page ${i} ===`);

        if (pageLines.length === 0) {
          paragraphs.push(new Paragraph({ children: [new TextRun({ text: '[No text could be extracted from this page]', italics: true, size: 20, color: '888888' })], spacing: { after: 200 } }));
          txtParts.push('[No text]');
        } else {
          for (const line of pageLines) {
            const isColHeader = line.startsWith('[Column ');
            paragraphs.push(new Paragraph({
              children: [new TextRun({
                text: line,
                size: isColHeader ? 20 : 22,
                bold: isColHeader,
                italics: isColHeader,
                color: isColHeader ? '6B7280' : undefined,
              })],
              spacing: { after: isColHeader ? 120 : 80 },
            }));
            txtParts.push(line);
          }
        }
      }

      checkCancel();
      setProgress('Building Word document…');
      const doc = new Document({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      const rawText = txtParts.join('\n');
      const txtBlob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });

      setResult({ blob, txtBlob, pageCount, ocrPages, multiColPages, rawText });
      const bits: string[] = [];
      if (ocrPages > 0) bits.push(`${ocrPages} OCR page${ocrPages > 1 ? 's' : ''}`);
      if (multiColPages > 0) bits.push(`${multiColPages} multi-column page${multiColPages > 1 ? 's' : ''}`);
      toast.success(bits.length ? `Converted! ${bits.join(', ')}.` : 'Converted to Word!');
      logToolUsage('PDF to Word', '/pdf-to-word');
    } catch (err: any) {
      if (err?.message === '__cancelled__') {
        // already toasted
      } else {
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

          {/* OCR settings */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-display font-semibold text-foreground">
              <ScanText className="h-4 w-4 text-primary" /> OCR settings
            </div>

            <div className="space-y-2">
              <Label htmlFor="ocr-lang" className="text-xs flex items-center gap-1.5 text-muted-foreground">
                <Languages className="h-3.5 w-3.5" /> OCR language (used for scanned pages)
              </Label>
              <Select value={ocrLang} onValueChange={setOcrLang} disabled={processing}>
                <SelectTrigger id="ocr-lang" className="w-full">
                  <SelectValue />
                </SelectTrigger>
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
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Native text extraction with column-aware layout and automatic OCR fallback for scanned PDFs.
          </p>

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
              { label: 'Output', value: `${file.name.replace(/\.pdf$/i, '.docx')}` },
              { label: 'Size', value: formatFileSize(result.blob.size) },
            ]}
            onDownload={triggerDownload}
          />
          <Button onClick={downloadTxt} variant="outline" size="lg" className="w-full gap-2 h-12 rounded-xl">
            <FileDown className="h-4 w-4" /> Download extracted text (.txt)
            <span className="ml-auto text-xs text-muted-foreground">{formatFileSize(result.txtBlob.size)}</span>
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
