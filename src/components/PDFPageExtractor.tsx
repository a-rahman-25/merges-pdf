import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileOutput, Loader2, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getPageCount, extractPages, downloadBlob, formatFileSize, SUPPORT_EMAIL } from '@/lib/pdf-utils';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';

const PDFPageExtractor = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number | null } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ data: Uint8Array; extractedCount: number } | null>(null);
  const [rangeInput, setRangeInput] = useState('');

  const doDownload = useCallback(() => {
    if (!result || !file) return;
    downloadBlob(result.data, `${file.name.replace(/\.pdf$/i, '')}_extracted.pdf`);
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'Page Extractor');

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    let pageCount: number | null = null;
    try { pageCount = await getPageCount(f); } catch {}
    setFile({ file: f, name: f.name, size: f.size, pageCount });
    setResult(null);
    toast.success(`Selected: ${f.name}`);
  }, []);

  const parseRange = (input: string, max: number): number[] => {
    const indices = new Set<number>();
    const parts = input.split(',').map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      const rangeParts = part.split('-').map(s => parseInt(s.trim(), 10));
      if (rangeParts.length === 1 && !isNaN(rangeParts[0])) indices.add(rangeParts[0] - 1);
      else if (rangeParts.length === 2 && !isNaN(rangeParts[0]) && !isNaN(rangeParts[1])) {
        for (let i = rangeParts[0]; i <= rangeParts[1]; i++) indices.add(i - 1);
      }
    }
    return Array.from(indices).filter(i => i >= 0 && i < max).sort((a, b) => a - b);
  };

  const handleExtract = async () => {
    if (!file) return;
    const max = file.pageCount ?? 9999;
    const indices = parseRange(rangeInput, max);
    if (indices.length === 0) { toast.error('Enter valid page numbers, e.g. "1-3, 5"'); return; }
    setProcessing(true);
    try {
      const data = await extractPages(file.file, indices);
      setResult({ data, extractedCount: indices.length });
      toast.success(`Extracted ${indices.length} page${indices.length > 1 ? 's' : ''}!`);
    } catch (err) {
      toast.error(`Failed to extract pages. Contact ${SUPPORT_EMAIL} for help.`);
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setRangeInput(''); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file && <DropZone onFiles={addFile} disabled={processing} />}
      <AnimatePresence>
        {file && !result && (
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
            <div className="space-y-3">
              <Input placeholder={`Pages to extract, e.g. 1-3, 5, 8 (max ${file.pageCount ?? '?'})`} value={rangeInput} onChange={e => setRangeInput(e.target.value)} className="text-center font-mono" />
              <p className="text-xs text-muted-foreground text-center">Selected pages will be extracted into a new PDF</p>
            </div>
            <Button onClick={handleExtract} disabled={processing || !rangeInput.trim()} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
              {processing ? (<><Loader2 className="h-5 w-5 animate-spin" />Extracting…</>) : (<><FileOutput className="h-5 w-5" />Extract Pages</>)}
            </Button>
          </motion.div>
        )}

        {file && result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <PDFPreviewDownload
              pdfData={result.data}
              defaultFilename={file.name.replace(/\.pdf$/i, '_extracted.pdf')}
              onDownload={(filename) => { downloadBlob(result.data, filename); toast.success('Downloaded!'); }}
              summaryItems={[
                { label: 'Pages Extracted', value: `${result.extractedCount}` },
                { label: 'Output Size', value: formatFileSize(result.data.length) },
              ]}
            />
            <div className="flex justify-center">
              <Button onClick={reset} variant="outline" className="rounded-xl"><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewDialog open={showReview} toolName="Page Extractor" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFPageExtractor;
