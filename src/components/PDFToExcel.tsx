import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSpreadsheet, Loader2, RotateCcw, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { formatFileSize, getPageCount } from '@/lib/pdf-utils';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';

// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;

type TableRow = string[];

const PDFToExcel = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [rows, setRows] = useState<TableRow[]>([]);

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    let pc = 1;
    try { pc = await getPageCount(f); } catch {}
    setFile({ file: f, name: f.name, size: f.size, pageCount: pc });
    setRows([]);
    toast.success(`Selected: ${f.name}`);
  }, []);

  const handleExtract = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const buffer = await file.file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const allRows: TableRow[] = [];

      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const content = await page.getTextContent();
        
        // Group text items by Y position to detect rows
        const yMap = new Map<number, { x: number; str: string }[]>();
        for (const item of content.items as any[]) {
          if (!item.str?.trim()) continue;
          // Round Y to cluster nearby items into same row (tolerance ~3pt)
          const y = Math.round(item.transform[5] / 3) * 3;
          if (!yMap.has(y)) yMap.set(y, []);
          yMap.get(y)!.push({ x: item.transform[4], str: item.str.trim() });
        }

        // Sort rows top-to-bottom, cells left-to-right
        const sortedYs = [...yMap.keys()].sort((a, b) => b - a);
        for (const y of sortedYs) {
          const cells = yMap.get(y)!.sort((a, b) => a.x - b.x);
          allRows.push(cells.map(c => c.str));
        }
      }

      if (allRows.length === 0) {
        toast.error('No text content found in the PDF.');
      } else {
        setRows(allRows);
        toast.success(`Extracted ${allRows.length} rows from ${pdf.numPages} pages.`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to extract data from PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = (format: 'xlsx' | 'csv') => {
    if (rows.length === 0) return;
    // Normalize column count
    const maxCols = Math.max(...rows.map(r => r.length));
    const normalized = rows.map(r => {
      const padded = [...r];
      while (padded.length < maxCols) padded.push('');
      return padded;
    });

    const ws = XLSX.utils.aoa_to_sheet(normalized);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Extracted Data');

    const baseName = file?.name.replace(/\.pdf$/i, '') || 'extracted';
    if (format === 'xlsx') {
      XLSX.writeFile(wb, `${baseName}.xlsx`);
    } else {
      XLSX.writeFile(wb, `${baseName}.csv`, { bookType: 'csv' });
    }
    toast.success(`Downloaded as ${format.toUpperCase()}!`);
  };

  const reset = () => { setFile(null); setRows([]); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div key="drop" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <DropZone onFiles={addFile} />
          </motion.div>
        ) : rows.length === 0 ? (
          <motion.div key="process" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-muted-foreground truncate">{file.name}</p>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-card p-3 border border-border">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)} · {file.pageCount} pages</p>
              </div>
            </div>
            <Button onClick={handleExtract} disabled={processing} size="lg" className="w-full gap-2 text-base font-semibold h-14 rounded-xl">
              {processing ? <><Loader2 className="h-5 w-5 animate-spin" /> Extracting…</> : <><FileSpreadsheet className="h-5 w-5" /> Extract Table Data</>}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-semibold text-foreground mb-3">Preview — {rows.length} rows extracted</h3>
              <div className="overflow-auto max-h-80 rounded-lg border border-border">
                <table className="w-full text-xs">
                  <tbody>
                    {rows.slice(0, 50).map((row, i) => (
                      <tr key={i} className={i === 0 ? 'bg-muted font-medium' : i % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-2 py-1.5 border-r border-border text-foreground whitespace-nowrap">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 50 && (
                  <p className="text-xs text-muted-foreground text-center py-2">Showing 50 of {rows.length} rows</p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => handleDownload('xlsx')} size="lg" className="flex-1 gap-2 rounded-xl">
                <Download className="h-4 w-4" /> Download .xlsx
              </Button>
              <Button onClick={() => handleDownload('csv')} variant="outline" size="lg" className="flex-1 gap-2 rounded-xl">
                <Download className="h-4 w-4" /> Download .csv
              </Button>
            </div>
            <Button onClick={reset} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
              <RotateCcw className="h-4 w-4" /> Convert Another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PDFToExcel;
