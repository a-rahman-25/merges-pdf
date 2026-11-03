import { useState, useCallback, useRef } from 'react';
import { Loader2, RotateCcw, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import ExcelJS from 'exceljs';
import { Button } from '@/components/ui/button';
import { downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import { logToolUsage } from '@/lib/analytics';

const ExcelToPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ data: Uint8Array; pageCount: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback((filename?: string) => {
    if (result) {
      downloadBlob(result.data, filename || 'spreadsheet.pdf');
      toast.success('Downloaded!');
    }
  }, [result]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'Excel to PDF');

  const handleFile = useCallback((f: File) => {
    if (!/\.(xlsx?|csv)$/i.test(f.name)) {
      toast.error('Please select an Excel (.xlsx, .xls) or CSV file.');
      return;
    }
    setFile(f);
    setResult(null);
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const buf = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();

      if (/\.csv$/i.test(file.name)) {
        // For CSV, read as text and parse manually
        const text = new TextDecoder().decode(buf);
        const csvRows = text.split('\n').map(line =>
          line.split(',').map(cell => cell.replace(/^"|"$/g, '').trim())
        );
        const sheet = workbook.addWorksheet('Sheet1');
        csvRows.forEach(row => sheet.addRow(row));
      } else {
        await workbook.xlsx.load(buf);
      }

      const pdf = await PDFDocument.create();
      const ARABIC = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
      const cellText = (v: unknown): string => {
        if (v == null) return '';
        if (v instanceof Date) return v.toLocaleDateString();
        if (typeof v === 'number') return Number.isInteger(v) ? v.toLocaleString('en-US') : v.toLocaleString('en-US', { maximumFractionDigits: 2 });
        if (typeof v === 'object') {
          const o = v as Record<string, unknown>;
          if ('result' in o) return cellText(o.result);
          if ('richText' in o && Array.isArray(o.richText)) return (o.richText as { text: string }[]).map(t => t.text).join('');
          if ('text' in o) return String(o.text);
          if ('error' in o) return String(o.error);
        }
        return String(v);
      };

      const S = 2; // render scale
      const margin = 30, rowH = 18, headerH = 22, titleH = 30, footerH = 20, fontPx = 9;
      const fontFamily = "'Segoe UI', Tahoma, Arial, 'Noto Naskh Arabic', sans-serif";
      const sheets: { name: string; data: string[][] }[] = [];
      workbook.eachSheet((sheet) => {
        const data: string[][] = [];
        const colCount = sheet.actualColumnCount || sheet.columnCount;
        sheet.eachRow({ includeEmpty: false }, (row) => {
          const vals: string[] = [];
          for (let c = 1; c <= colCount; c++) vals.push(cellText(row.getCell(c).value));
          if (vals.some(v => v.trim())) data.push(vals);
        });
        if (data.length) sheets.push({ name: sheet.name, data });
      });
      if (!sheets.length) throw new Error('Empty workbook');

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      for (const { name, data } of sheets) {
        const colCount = Math.max(...data.map(r => r.length), 1);
        const rtl = ARABIC.test(name) || data.slice(0, 5).some(r => r.some(c => ARABIC.test(c)));
        const landscape = colCount > 4;
        const pw = landscape ? 842 : 595, ph = landscape ? 595 : 842;
        const usable = pw - margin * 2;

        // measure column widths
        ctx.font = `bold ${fontPx}px ${fontFamily}`;
        const widths = Array.from({ length: colCount }, (_, c) =>
          Math.min(220, Math.max(30, ...data.map(r => ctx.measureText(r[c] ?? '').width + 10))));
        const total = widths.reduce((a, b) => a + b, 0);
        const colW = widths.map(w => (w / total) * usable);
        const fitScale = Math.min(1, total > usable ? usable / total : 1);
        const fs = Math.max(6, fontPx * Math.max(fitScale, 0.75));

        const header = data[0];
        const body = data.slice(1);
        const perPage = Math.floor((ph - margin * 2 - titleH - headerH - footerH) / rowH);
        const pageTotal = Math.max(1, Math.ceil(body.length / perPage));

        for (let p = 0; p < pageTotal; p++) {
          canvas.width = pw * S; canvas.height = ph * S;
          ctx.setTransform(S, 0, 0, S, 0, 0);
          ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, pw, ph);
          ctx.direction = rtl ? 'rtl' : 'ltr';
          ctx.textBaseline = 'middle';

          ctx.fillStyle = '#1a1a1a';
          ctx.font = `bold 14px ${fontFamily}`;
          ctx.textAlign = rtl ? 'right' : 'left';
          ctx.fillText(name, rtl ? pw - margin : margin, margin + 12);

          const colX = (c: number) => {
            const before = colW.slice(0, c).reduce((a, b) => a + b, 0);
            return rtl ? pw - margin - before - colW[c] : margin + before;
          };
          const drawRow = (row: string[], y: number, h: number, isHead: boolean, zebra: boolean) => {
            if (isHead) { ctx.fillStyle = '#1F4E79'; ctx.fillRect(margin, y, usable, h); }
            else if (zebra) { ctx.fillStyle = '#F3F6FA'; ctx.fillRect(margin, y, usable, h); }
            ctx.font = `${isHead ? 'bold ' : ''}${fs}px ${fontFamily}`;
            for (let c = 0; c < colCount; c++) {
              const x = colX(c), w = colW[c];
              let t = row[c] ?? '';
              while (t.length > 1 && ctx.measureText(t).width > w - 6) t = t.slice(0, -2) + '…';
              const isNum = /^-?[\d,.]+$/.test(t);
              ctx.fillStyle = isHead ? '#ffffff' : '#222222';
              ctx.direction = ARABIC.test(t) || (rtl && !isNum) ? 'rtl' : 'ltr';
              ctx.textAlign = 'center';
              if (!isHead) {
                if (isNum) { ctx.textAlign = 'right'; ctx.direction = 'ltr'; ctx.fillText(t, x + w - 4, y + h / 2); continue; }
                ctx.textAlign = rtl ? 'right' : 'left';
                ctx.fillText(t, rtl ? x + w - 4 : x + 4, y + h / 2); continue;
              }
              ctx.fillText(t, x + w / 2, y + h / 2);
            }
            ctx.strokeStyle = '#cfd6df'; ctx.lineWidth = 0.5;
            for (let c = 0; c < colCount; c++) ctx.strokeRect(colX(c), y, colW[c], h);
          };

          let y = margin + titleH;
          drawRow(header, y, headerH, true, false);
          y += headerH;
          body.slice(p * perPage, (p + 1) * perPage).forEach((r, i) => { drawRow(r, y, rowH, false, i % 2 === 1); y += rowH; });

          ctx.fillStyle = '#777777'; ctx.font = `9px ${fontFamily}`;
          ctx.textAlign = 'center'; ctx.direction = rtl ? 'rtl' : 'ltr';
          ctx.fillText(rtl ? `${name} - صفحة ${p + 1} من ${pageTotal}` : `${name} - Page ${p + 1} of ${pageTotal}`, pw / 2, ph - margin / 2 - 4);

          const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b!), 'image/png'));
          const img = await pdf.embedPng(await blob.arrayBuffer());
          const page = pdf.addPage([pw, ph]);
          page.drawImage(img, { x: 0, y: 0, width: pw, height: ph });
        }
      }

      const pdfBytes = await pdf.save();
      setResult({ data: pdfBytes, pageCount: pdf.getPageCount() });
      toast.success('Converted successfully!');
      logToolUsage('Excel to PDF', '/excel-to-pdf');
    } catch (err) {
      console.error(err);
      toast.error('Conversion failed. Please try a different file.');
    } finally {
      setProcessing(false);
    }
  }, [file]);

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {!file ? (
        <div
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center transition hover:border-primary"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        >
          <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-display text-lg font-semibold text-foreground">Drop Excel or CSV file here</p>
          <p className="mt-1 text-sm text-muted-foreground">Supports .xlsx, .xls, .csv</p>
          <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      ) : !result ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-4">
          <p className="font-semibold text-foreground">{file.name} <span className="text-muted-foreground">({formatFileSize(file.size)})</span></p>
          <div className="flex justify-center gap-3">
            <Button onClick={convert} disabled={processing}>
              {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting…</> : 'Convert to PDF'}
            </Button>
            <Button variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
          </div>
        </div>
      ) : (
        <>
          <PDFPreviewDownload pdfData={result.data} defaultFilename="spreadsheet.pdf" onDownload={triggerDownload} />
          <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} toolName="Excel to PDF" />
        </>
      )}
    </div>
  );
};

export default ExcelToPDF;
