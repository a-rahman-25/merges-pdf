import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileOutput, Loader2, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getPageCount, extractPages, downloadBlob, formatFileSize, SUPPORT_EMAIL } from '@/lib/pdf-utils';

const PDFPageExtractor = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number | null } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [rangeInput, setRangeInput] = useState('');

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    let pageCount: number | null = null;
    try { pageCount = await getPageCount(f); } catch {}
    setFile({ file: f, name: f.name, size: f.size, pageCount });
    setDone(false);
    toast.success(`Selected: ${f.name}`);
  }, []);

  const parseRange = (input: string, max: number): number[] => {
    const indices = new Set<number>();
    const parts = input.split(',').map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      const rangeParts = part.split('-').map(s => parseInt(s.trim(), 10));
      if (rangeParts.length === 1 && !isNaN(rangeParts[0])) {
        indices.add(rangeParts[0] - 1);
      } else if (rangeParts.length === 2 && !isNaN(rangeParts[0]) && !isNaN(rangeParts[1])) {
        for (let i = rangeParts[0]; i <= rangeParts[1]; i++) indices.add(i - 1);
      }
    }
    return Array.from(indices).filter(i => i >= 0 && i < max).sort((a, b) => a - b);
  };

  const handleExtract = async () => {
    if (!file) return;
    const max = file.pageCount ?? 9999;
    const indices = parseRange(rangeInput, max);
    if (indices.length === 0) {
      toast.error('Enter valid page numbers, e.g. "1-3, 5"');
      return;
    }
    setProcessing(true);
    try {
      const data = await extractPages(file.file, indices);
      const baseName = file.name.replace(/\.pdf$/i, '');
      downloadBlob(data, `${baseName}_extracted.pdf`);
      setDone(true);
      toast.success(`Extracted ${indices.length} page${indices.length > 1 ? 's' : ''}!`);
    } catch (err) {
      toast.error(`Failed to extract pages. Contact ${SUPPORT_EMAIL} for help.`);
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setDone(false); setRangeInput(''); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file && <DropZone onFiles={addFile} disabled={processing} />}
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
            {!done && (
              <div className="space-y-3">
                <Input
                  placeholder={`Pages to extract, e.g. 1-3, 5, 8 (max ${file.pageCount ?? '?'})`}
                  value={rangeInput}
                  onChange={e => setRangeInput(e.target.value)}
                  className="text-center font-mono"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Selected pages will be extracted into a new PDF
                </p>
              </div>
            )}
            {!done && (
              <Button onClick={handleExtract} disabled={processing || !rangeInput.trim()} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
                {processing ? (<><Loader2 className="h-5 w-5 animate-spin" />Extracting…</>) : (<><FileOutput className="h-5 w-5" />Extract Pages</>)}
              </Button>
            )}
            {done && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-accent/50 p-4 border border-border text-center">
                <p className="text-sm font-medium text-foreground">✓ Pages extracted and downloaded</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PDFPageExtractor;
