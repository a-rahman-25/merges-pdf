import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Loader2, RotateCcw, FileUp } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { getPageCount, downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';

interface PageItem {
  index: number;
  label: number;
}

const PDFPageReorder = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback(() => {
    if (result && file) {
      downloadBlob(result, file.name.replace(/\.pdf$/i, '_reordered.pdf'));
    }
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'PDF Reorder');

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
      setResult(pdfBytes);
      toast.success('Pages reordered successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reorder pages');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setPages([]); setResult(null); };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <AnimatePresence mode="wait">
        {result && file ? (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <PDFPreviewDownload
              pdfData={result}
              defaultFilename={file.name.replace(/\.pdf$/i, '_reordered.pdf')}
              onDownload={(filename) => { downloadBlob(result, filename); toast.success('Downloaded!'); }}
              summaryItems={[
                { label: 'Pages', value: `${pages.length}` },
                { label: 'Output Size', value: formatFileSize(result.byteLength) },
              ]}
            />
            <div className="flex justify-center">
              <Button onClick={reset} variant="outline" className="rounded-xl"><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
            </div>
          </motion.div>
        ) : !file ? (
          <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf'); if (files.length) addFile(files); }}
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center transition-all hover:border-primary/50"
            >
              <FileUp className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium text-foreground">Drop a PDF to reorder its pages</p>
              <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
            </div>
            <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { if (e.target.files) addFile(Array.from(e.target.files)); e.target.value = ''; }} />
          </motion.div>
        ) : (
          <motion.div key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <p className="text-center text-sm text-muted-foreground">
              Drag pages to reorder. <span className="font-medium text-foreground">{file.name}</span> ({file.pageCount} pages)
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
      <ReviewDialog open={showReview} toolName="PDF Reorder" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFPageReorder;
