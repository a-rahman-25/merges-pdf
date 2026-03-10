import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Combine, Loader2, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { trackToolUsage, trackFileProcess } from '@/lib/analytics';
import DropZone from '@/components/DropZone';
import FileListItem from '@/components/FileListItem';
import PreDownloadSummary from '@/components/PreDownloadSummary';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import { Button } from '@/components/ui/button';
import { PDFFileItem, getPageCount, mergePDFs, downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import { supabase } from '@/integrations/supabase/client';

const PDFMerger = () => {
  const [files, setFiles] = useState<PDFFileItem[]>([]);
  const [merging, setMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Uint8Array | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const doDownload = useCallback(() => {
    if (mergedBlob) {
      downloadBlob(mergedBlob, 'merged.pdf');
      toast.success('Downloaded!');
    }
  }, [mergedBlob]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload);

  const addFiles = useCallback(async (newFiles: File[]) => {
    const items: PDFFileItem[] = [];
    for (const file of newFiles) {
      let pageCount: number | null = null;
      try { pageCount = await getPageCount(file); } catch { /* ignore */ }
      items.push({ id: crypto.randomUUID(), file, name: file.name, size: file.size, pageCount });
    }
    setFiles((prev) => [...prev, ...items]);
    setMergedBlob(null);
    setAiSummary('');
    toast.success(`Added ${items.length} file${items.length > 1 ? 's' : ''}`);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedBlob(null);
    setAiSummary('');
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

  const fetchAiSummary = async (fileList: PDFFileItem[], totalPages: number, totalSize: number) => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-summarize', {
        body: {
          text: `Merged PDF from ${fileList.length} files: ${fileList.map(f => `"${f.name}" (${f.pageCount ?? '?'} pages)`).join(', ')}. Total: ${totalPages} pages, ${formatFileSize(totalSize)}.`,
          filename: 'merged.pdf',
          pageCount: totalPages,
        },
      });
      if (error) throw error;
      setAiSummary(data.summary || 'Merge completed successfully.');
    } catch {
      setAiSummary('✅ Your PDFs have been merged successfully in the order shown above. The output file contains all pages from the selected documents.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) { toast.error('Add at least 2 PDFs to merge'); return; }
    setMerging(true);
    setAiSummary('');
    try {
      const result = await mergePDFs(files.map((f) => f.file));
      setMergedBlob(result);
      const totalSizeMB = files.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024);
      const totalPages = files.reduce((sum, f) => sum + (f.pageCount ?? 0), 0);
      trackToolUsage('pdf_merger', 'merge_complete', { file_count: files.length });
      trackFileProcess('pdf_merger', files.length, Math.round(totalSizeMB * 100) / 100);
      toast.success('PDFs merged! Review below before downloading.');
      fetchAiSummary(files, totalPages, result.size);
    } catch (err) {
      toast.error('Failed to merge PDFs. Contact merge.pdf.st@gmail.com for help.');
      console.error(err);
    } finally {
      setMerging(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setMergedBlob(null);
    setAiSummary('');
  };

  const totalPages = files.reduce((sum, f) => sum + (f.pageCount ?? 0), 0);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <DropZone onFiles={addFiles} disabled={merging} />

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-muted-foreground">
                {files.length} file{files.length !== 1 ? 's' : ''}
                {totalPages > 0 && ` · ${totalPages} pages total`}
              </p>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Clear all
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

            {!mergedBlob && (
              <motion.div layout className="pt-2">
                <Button
                  onClick={handleMerge}
                  disabled={merging || files.length < 2}
                  size="lg"
                  className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl"
                >
                  {merging ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Merging…</>
                  ) : (
                    <><Combine className="h-5 w-5" /> Merge PDFs</>
                  )}
                </Button>
              </motion.div>
            )}

            {mergedBlob && (
              <PreDownloadSummary
                title="Merge Complete"
                items={[
                  { label: 'Files merged', value: `${files.length}` },
                  { label: 'Total pages', value: `${totalPages}` },
                  { label: 'Output size', value: formatFileSize(mergedBlob.size) },
                  { label: 'File order', value: files.map(f => f.name.replace('.pdf', '')).join(' → ') },
                ]}
                aiSummary={aiSummary}
                aiLoading={aiLoading}
                onDownload={triggerDownload}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewDialog
        open={showReview}
        toolName="PDF Merger"
        onSubmit={handleSubmit}
        onSkip={handleSkip}
      />
    </div>
  );
};

export default PDFMerger;
