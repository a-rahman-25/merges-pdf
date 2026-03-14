import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Loader2, Download, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { trackToolUsage } from '@/lib/analytics';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getPageCount, splitPDF, extractPages, downloadBlob, formatFileSize, SUPPORT_EMAIL } from '@/lib/pdf-utils';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';

type SplitMode = 'all' | 'range';

const PDFSplitter = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number | null } | null>(null);
  const [splitting, setSplitting] = useState(false);
  const [splitDone, setSplitDone] = useState(false);
  const [results, setResults] = useState<{ data: Uint8Array; name: string }[]>([]);
  const [rangeResult, setRangeResult] = useState<{ data: Uint8Array; count: number } | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>('all');
  const [rangeInput, setRangeInput] = useState('');

  const doRangeDownload = useCallback(() => {
    if (!rangeResult || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBlob(rangeResult.data, `${baseName}_pages_${rangeInput.replace(/\s/g, '')}.pdf`);
  }, [rangeResult, file, rangeInput]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doRangeDownload);

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    let pageCount: number | null = null;
    try { pageCount = await getPageCount(f); } catch {}
    setFile({ file: f, name: f.name, size: f.size, pageCount });
    setSplitDone(false);
    setResults([]);
    setRangeResult(null);
    toast.success(`Selected: ${f.name}`);
  }, []);

  const parseRange = (input: string, max: number): number[] => {
    const indices = new Set<number>();
    const parts = input.split(',').map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      const rangeParts = part.split('-').map((s) => parseInt(s.trim(), 10));
      if (rangeParts.length === 1 && !isNaN(rangeParts[0])) indices.add(rangeParts[0] - 1);
      else if (rangeParts.length === 2 && !isNaN(rangeParts[0]) && !isNaN(rangeParts[1])) {
        for (let i = rangeParts[0]; i <= rangeParts[1]; i++) indices.add(i - 1);
      }
    }
    return Array.from(indices).filter((i) => i >= 0 && i < max).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file) return;

    if (splitMode === 'all') {
      if (file.pageCount !== null && file.pageCount < 2) { toast.error('This PDF has only one page — nothing to split.'); return; }
      setSplitting(true);
      try {
        const pages = await splitPDF(file.file);
        setResults(pages);
        setSplitDone(true);
        trackToolUsage('pdf_splitter', 'split_all', { page_count: pages.length });
        toast.success(`Split into ${pages.length} pages!`);
      } catch (err) {
        toast.error(`Failed to split PDF. Contact ${SUPPORT_EMAIL} for help.`);
        console.error(err);
      } finally {
        setSplitting(false);
      }
    } else {
      const max = file.pageCount ?? 9999;
      const indices = parseRange(rangeInput, max);
      if (indices.length === 0) { toast.error('Enter valid page numbers, e.g. "1-3, 5"'); return; }
      setSplitting(true);
      try {
        const data = await extractPages(file.file, indices);
        setRangeResult({ data, count: indices.length });
        setSplitDone(true);
        trackToolUsage('pdf_splitter', 'extract_range', { page_count: indices.length });
        toast.success(`Extracted ${indices.length} page${indices.length > 1 ? 's' : ''}!`);
      } catch (err) {
        toast.error(`Failed to extract pages. Contact ${SUPPORT_EMAIL} for help.`);
        console.error(err);
      } finally {
        setSplitting(false);
      }
    }
  };

  const downloadPage = (page: { data: Uint8Array; name: string }) => downloadBlob(page.data, page.name);
  const downloadAll = () => results.forEach((page) => downloadBlob(page.data, page.name));
  const reset = () => { setFile(null); setSplitDone(false); setResults([]); setRangeResult(null); setRangeInput(''); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file && <DropZone onFiles={addFile} disabled={splitting} />}

      <AnimatePresence>
        {file && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-muted-foreground">Selected file</p>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Change file
              </button>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-card p-3 pr-4 border border-border">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                  {file.pageCount !== null && ` · ${file.pageCount} page${file.pageCount !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>

            {!splitDone && (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="inline-flex rounded-lg border border-border bg-card p-0.5 gap-0.5">
                    <button onClick={() => setSplitMode('all')} className={`rounded-md px-4 py-2 text-sm font-semibold transition-all ${splitMode === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>All Pages</button>
                    <button onClick={() => setSplitMode('range')} className={`rounded-md px-4 py-2 text-sm font-semibold transition-all ${splitMode === 'range' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Page Range</button>
                  </div>
                </div>
                {splitMode === 'range' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5">
                    <Input placeholder={`e.g. 1-3, 5, 8-10 (max ${file.pageCount ?? '?'})`} value={rangeInput} onChange={(e) => setRangeInput(e.target.value)} className="text-center font-mono" />
                    <p className="text-xs text-muted-foreground text-center">Pages will be extracted into a single PDF</p>
                  </motion.div>
                )}
              </div>
            )}

            {!splitDone && (
              <motion.div layout className="pt-2">
                <Button onClick={handleSplit} disabled={splitting} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
                  {splitting ? (<><Loader2 className="h-5 w-5 animate-spin" />{splitMode === 'range' ? 'Extracting…' : 'Splitting…'}</>) : (<><Scissors className="h-5 w-5" />{splitMode === 'range' ? 'Extract Pages' : 'Split into Pages'}</>)}
                </Button>
              </motion.div>
            )}

            {/* Split All — show individual page downloads */}
            {splitDone && splitMode === 'all' && results.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {results.map((page, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-card p-3 pr-4 border border-border">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
                        <span className="text-xs font-semibold text-accent-foreground">{i + 1}</span>
                      </div>
                      <p className="min-w-0 flex-1 truncate text-sm text-foreground">{page.name}</p>
                      <button onClick={() => downloadPage(page)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button onClick={downloadAll} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
                  <Download className="h-5 w-5" /> Download All Pages
                </Button>
              </motion.div>
            )}

            {/* Range extract — show review summary */}
            {splitDone && splitMode === 'range' && rangeResult && (
              <PreDownloadSummary
                title="Pages Extracted"
                items={[
                  { label: 'Source', value: file.name },
                  { label: 'Pages Extracted', value: `${rangeResult.count}` },
                  { label: 'Output Size', value: formatFileSize(rangeResult.data.length) },
                ]}
                onDownload={triggerDownload}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewDialog open={showReview} toolName="PDF Splitter" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFSplitter;
