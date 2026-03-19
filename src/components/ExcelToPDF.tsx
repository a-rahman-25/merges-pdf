import { useState, useCallback, useRef } from 'react';
import { Loader2, RotateCcw, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';

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
      const wb = XLSX.read(buf, { type: 'array' });
      
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 8;
      const margin = 40;
      const rowHeight = 16;
      const cellPadding = 4;

      for (const sheetName of wb.SheetNames) {
        const sheet = wb.Sheets[sheetName];
        const data: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        if (data.length === 0) continue;

        const colCount = Math.max(...data.map(r => r.length));
        const pageWidth = Math.max(595, margin * 2 + colCount * 80);
        const pageHeight = 842;
        const colWidth = (pageWidth - margin * 2) / colCount;
        
        let page = pdf.addPage([pageWidth, pageHeight]);
        let y = pageHeight - margin;

        // Sheet title
        page.drawText(sheetName, { x: margin, y, font: boldFont, size: 12, color: rgb(0.1, 0.1, 0.1) });
        y -= 24;

        for (let r = 0; r < data.length; r++) {
          if (y < margin + rowHeight) {
            page = pdf.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }

          const isHeader = r === 0;
          const currentFont = isHeader ? boldFont : font;

          // Draw row background for header
          if (isHeader) {
            page.drawRectangle({
              x: margin, y: y - rowHeight + 4, width: pageWidth - margin * 2, height: rowHeight,
              color: rgb(0.92, 0.92, 0.95),
            });
          }

          // Draw cells
          for (let c = 0; c < colCount; c++) {
            const cellText = String(data[r][c] ?? '').substring(0, 30);
            const x = margin + c * colWidth + cellPadding;
            page.drawText(cellText, { x, y: y - rowHeight + 8, font: currentFont, size: fontSize, color: rgb(0.15, 0.15, 0.15) });
            // Draw vertical gridline
            page.drawLine({ start: { x: margin + c * colWidth, y: y + 4 }, end: { x: margin + c * colWidth, y: y - rowHeight + 4 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
          }
          // Horizontal gridline
          page.drawLine({ start: { x: margin, y: y - rowHeight + 4 }, end: { x: pageWidth - margin, y: y - rowHeight + 4 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
          y -= rowHeight;
        }
      }

      const pdfBytes = await pdf.save();
      setResult({ data: pdfBytes, pageCount: pdf.getPageCount() });
      toast.success('Converted successfully!');
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
