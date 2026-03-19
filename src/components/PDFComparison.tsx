import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, Loader2, RotateCcw, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { formatFileSize, getPageCount } from '@/lib/pdf-utils';

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();

interface ComparisonResult {
  file1Pages: number;
  file2Pages: number;
  file1Text: string;
  file2Text: string;
  differences: { page: number; type: 'added' | 'removed' | 'changed'; preview: string }[];
  similarity: number;
}

const PDFComparison = () => {
  const [file1, setFile1] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [file2, setFile2] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const addFile1 = useCallback(async (files: File[]) => {
    const f = files[0]; if (!f) return;
    let pc = 1; try { pc = await getPageCount(f); } catch {}
    setFile1({ file: f, name: f.name, size: f.size, pageCount: pc });
    setResult(null);
    toast.success(`File 1: ${f.name}`);
  }, []);

  const addFile2 = useCallback(async (files: File[]) => {
    const f = files[0]; if (!f) return;
    let pc = 1; try { pc = await getPageCount(f); } catch {}
    setFile2({ file: f, name: f.name, size: f.size, pageCount: pc });
    setResult(null);
    toast.success(`File 2: ${f.name}`);
  }, []);

  const extractText = async (file: File): Promise<string[]> => {
    const buffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: buffer }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      pages.push(content.items.map((item: any) => item.str).join(' '));
    }
    return pages;
  };

  const handleCompare = async () => {
    if (!file1 || !file2) return;
    setProcessing(true);
    try {
      const [pages1, pages2] = await Promise.all([extractText(file1.file), extractText(file2.file)]);
      const text1 = pages1.join('\n');
      const text2 = pages2.join('\n');

      // Simple word-level comparison
      const words1 = text1.split(/\s+/).filter(Boolean);
      const words2 = text2.split(/\s+/).filter(Boolean);
      const set1 = new Set(words1);
      const set2 = new Set(words2);

      const common = words1.filter(w => set2.has(w)).length;
      const total = Math.max(words1.length, words2.length, 1);
      const similarity = Math.round((common / total) * 100);

      // Page-by-page differences
      const maxPages = Math.max(pages1.length, pages2.length);
      const differences: ComparisonResult['differences'] = [];
      for (let i = 0; i < maxPages; i++) {
        const p1 = pages1[i] || '';
        const p2 = pages2[i] || '';
        if (!pages1[i] && pages2[i]) {
          differences.push({ page: i + 1, type: 'added', preview: p2.slice(0, 100) + '...' });
        } else if (pages1[i] && !pages2[i]) {
          differences.push({ page: i + 1, type: 'removed', preview: p1.slice(0, 100) + '...' });
        } else if (p1.trim() !== p2.trim()) {
          differences.push({ page: i + 1, type: 'changed', preview: `Original: "${p1.slice(0, 50)}..." → New: "${p2.slice(0, 50)}..."` });
        }
      }

      setResult({
        file1Pages: pages1.length,
        file2Pages: pages2.length,
        file1Text: text1,
        file2Text: text2,
        differences,
        similarity,
      });
      toast.success('Comparison complete!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to compare PDFs.');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile1(null); setFile2(null); setResult(null); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="input" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">File 1 (Original)</p>
                {file1 ? (
                  <div className="flex items-center gap-3 rounded-xl bg-card p-3 border border-border">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{file1.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file1.size)} · {file1.pageCount} pages</p>
                    </div>
                  </div>
                ) : (
                  <DropZone onFiles={addFile1} label="Drop original PDF" sublabel="or click to browse" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">File 2 (Modified)</p>
                {file2 ? (
                  <div className="flex items-center gap-3 rounded-xl bg-card p-3 border border-border">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{file2.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file2.size)} · {file2.pageCount} pages</p>
                    </div>
                  </div>
                ) : (
                  <DropZone onFiles={addFile2} label="Drop modified PDF" sublabel="or click to browse" />
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCompare} disabled={!file1 || !file2 || processing} size="lg" className="flex-1 gap-2 text-base font-semibold h-14 rounded-xl">
                {processing ? <><Loader2 className="h-5 w-5 animate-spin" /> Comparing…</> : <><GitCompare className="h-5 w-5" /> Compare PDFs</>}
              </Button>
              {(file1 || file2) && (
                <Button onClick={reset} variant="outline" size="lg" className="gap-2 rounded-xl">
                  <RotateCcw className="h-4 w-4" /> Clear
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Similarity score */}
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <div className={`text-5xl font-bold ${result.similarity > 80 ? 'text-emerald-500' : result.similarity > 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                {result.similarity}%
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Text Similarity</p>
              <p className="mt-2 text-xs text-muted-foreground">
                File 1: {result.file1Pages} pages · File 2: {result.file2Pages} pages
              </p>
            </div>

            {/* Differences */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                {result.differences.length === 0 ? (
                  <><CheckCircle className="h-5 w-5 text-emerald-500" /> No page-level differences found</>
                ) : (
                  <><AlertTriangle className="h-5 w-5 text-amber-500" /> {result.differences.length} page(s) differ</>
                )}
              </h3>
              {result.differences.length > 0 && (
                <ul className="space-y-2 text-sm max-h-60 overflow-y-auto">
                  {result.differences.map((d, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        d.type === 'added' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                          : d.type === 'removed' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                      }`}>
                        {d.type} p.{d.page}
                      </span>
                      <span className="text-muted-foreground truncate">{d.preview}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Button onClick={reset} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
              <RotateCcw className="h-4 w-4" /> Compare Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PDFComparison;
