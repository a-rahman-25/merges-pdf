import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Combine, Loader2, Download, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { trackToolUsage, trackFileProcess } from '@/lib/analytics';
import DropZone from '@/components/DropZone';
import FileListItem from '@/components/FileListItem';
import { Button } from '@/components/ui/button';
import { PDFFileItem, getPageCount, mergePDFs, downloadBlob } from '@/lib/pdf-utils';

const PDFMerger = () => {
  const [files, setFiles] = useState<PDFFileItem[]>([]);
  const [merging, setMerging] = useState(false);
  const [merged, setMerged] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addFiles = useCallback(async (newFiles: File[]) => {
    const items: PDFFileItem[] = [];
    for (const file of newFiles) {
      let pageCount: number | null = null;
      try {
        pageCount = await getPageCount(file);
      } catch {
        // ignore
      }
      items.push({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        pageCount,
      });
    }
    setFiles((prev) => [...prev, ...items]);
    setMerged(false);
    toast.success(`Added ${items.length} file${items.length > 1 ? 's' : ''}`);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMerged(false);
  }, []);

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    setFiles((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(dragIndex, 1);
      copy.splice(index, 0, item);
      return copy;
    });
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('Add at least 2 PDFs to merge');
      return;
    }
    setMerging(true);
    try {
      const result = await mergePDFs(files.map((f) => f.file));
      downloadBlob(result, 'merged.pdf');
      setMerged(true);
      const totalSizeMB = files.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024);
      trackToolUsage('pdf_merger', 'merge_complete', { file_count: files.length });
      trackFileProcess('pdf_merger', files.length, Math.round(totalSizeMB * 100) / 100);
      toast.success('PDFs merged & downloaded!');
    } catch (err) {
      toast.error('Failed to merge PDFs. Contact merge.pdf.st@gmail.com for help.');
      console.error(err);
    } finally {
      setMerging(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setMerged(false);
  };

  const totalPages = files.reduce((sum, f) => sum + (f.pageCount ?? 0), 0);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <DropZone onFiles={addFiles} disabled={merging} />

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-muted-foreground">
                {files.length} file{files.length !== 1 ? 's' : ''}
                {totalPages > 0 && ` · ${totalPages} pages total`}
              </p>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear all
              </button>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {files.map((item, i) => (
                  <FileListItem
                    key={item.id}
                    item={item}
                    index={i}
                    onRemove={removeFile}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </AnimatePresence>
            </div>

            <motion.div layout className="pt-2">
              <Button
                onClick={handleMerge}
                disabled={merging || files.length < 2}
                size="lg"
                className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl"
              >
                {merging ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Merging…
                  </>
                ) : merged ? (
                  <>
                    <Download className="h-5 w-5" />
                    Download Again
                  </>
                ) : (
                  <>
                    <Combine className="h-5 w-5" />
                    Merge & Download
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PDFMerger;
