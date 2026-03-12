import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { getPageCount, downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import PreDownloadSummary from '@/components/PreDownloadSummary';

interface PageItem {
  index: number; // original 0-based index
  label: number; // display number (1-based)
}

const PDFPageReorder = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ data: Uint8Array } | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const doDownload = useCallback(() => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBlob(result.data, `${baseName}_reordered.pdf`);
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload);

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    try {
      const count = await getPageCount(f);
      if (!count || count === 0) { toast.error('Could not read PDF pages.'); return; }
      setFile({ file: f, name: f.name, size: f.size, pageCount: count });
      setPages(Array.from({ length: count }, (_, i) => ({ index: i, label: i + 1 })));
      setResult(null);
    } catch { toast.error('Failed to read PDF.'); }
  }, []);

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setPages(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIdx, 1);
      arr.splice(idx, 0, moved);
      return arr;
    });
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  const reorder = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const srcBytes = new Uint8Array(await file.file.arrayBuffer());
      const srcDoc = await PDFDocument.load(srcBytes);
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(srcDoc, pages.map(p => p.index));
      copiedPages.forEach(p => newDoc.addPage(p));
      const pdfBytes = await newDoc.save();
      setResult({ data: pdfBytes });
      toast.success('Pages reordered successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reorder pages');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setPages([]); setResult(null); };

  return (
    <>
      <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} />
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <PreDownloadSummary originalSize={file!.size} newSize={result.data.length} label={`${pages.length} pages reordered`} />
            <div className="flex justify-center gap-3">
              <Button onClick={triggerDownload} size="lg" className="rounded-xl px-8">Download PDF</Button>
              <Button onClick={reset} variant="outline" size="lg" className="rounded-xl px-8"><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
            </div>
          </motion.div>
        ) : !file ? (
          <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DropZone onFiles={addFile} accept=".pdf" label="Drop a PDF to reorder its pages" />
          </motion.div>
        ) : (
          <motion.div key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <p className="text-center text-sm text-muted-foreground">
              Drag pages to reorder them. Original: <span className="font-medium text-foreground">{file.name}</span> ({file.pageCount} pages)
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {pages.map((page, i) => (
                <div
                  key={`${page.index}-${i}`}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragEnd={handleDragEnd}
                  className={`flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-3 cursor-grab transition-all hover:border-primary/40 ${dragIdx === i ? 'opacity-50 scale-95' : ''}`}
                >
                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                  <span className="text-lg font-bold text-foreground">{page.label}</span>
                  <span className="text-[10px] text-muted-foreground">Page</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              <Button onClick={reset} variant="outline" className="rounded-xl">Cancel</Button>
              <Button onClick={reorder} disabled={processing} className="rounded-xl px-8">
                {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reordering…</> : 'Save Reordered PDF'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PDFPageReorder;
