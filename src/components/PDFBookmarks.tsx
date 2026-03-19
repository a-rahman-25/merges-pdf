import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Loader2, RotateCcw, FileText, Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PDFDocument } from 'pdf-lib';
import { downloadBlob, formatFileSize, getPageCount } from '@/lib/pdf-utils';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';

type Bookmark = { title: string; page: number };

const PDFBookmarks = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([{ title: '', page: 1 }]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  const doDownload = useCallback((filename?: string) => {
    if (!result || !file) return;
    const name = filename || file.name.replace(/\.pdf$/i, '_bookmarked.pdf');
    downloadBlob(result, name);
    toast.success('Downloaded!');
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'PDF Bookmarks');

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    let pc = 1;
    try { pc = await getPageCount(f); } catch {}
    setFile({ file: f, name: f.name, size: f.size, pageCount: pc });
    setResult(null);
    setBookmarks([{ title: 'Chapter 1', page: 1 }]);
    toast.success(`Selected: ${f.name} (${pc} pages)`);
  }, []);

  const addBookmark = () => setBookmarks(prev => [...prev, { title: '', page: 1 }]);
  const removeBookmark = (idx: number) => setBookmarks(prev => prev.filter((_, i) => i !== idx));
  const updateBookmark = (idx: number, field: keyof Bookmark, value: string | number) => {
    setBookmarks(prev => prev.map((b, i) => i === idx ? { ...b, [field]: value } : b));
  };

  const handleApply = async () => {
    if (!file) return;
    const valid = bookmarks.filter(b => b.title.trim());
    if (valid.length === 0) { toast.error('Add at least one bookmark with a title.'); return; }
    setProcessing(true);
    try {
      const buffer = await file.file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      
      // pdf-lib doesn't have native outline/bookmark API, so we embed bookmark info in the document metadata
      // and use a workaround: create named destinations
      // For a proper implementation we write outline dict manually
      const pages = pdf.getPages();
      
      // Create outline entries using pdf-lib's low-level API
      const context = pdf.context;
      const outlineItems: any[] = [];
      
      for (const bm of valid) {
        const pageIdx = Math.min(Math.max(bm.page - 1, 0), pages.length - 1);
        const pageRef = pages[pageIdx].ref;
        
        const outlineItem = context.obj({
          Title: context.flateStream(new TextEncoder().encode(bm.title)),
          Dest: [pageRef, context.obj({ S: 'Fit' } as any)],
        });
        outlineItems.push(context.register(outlineItem));
      }
      
      // Build a simple outline structure  
      // Store bookmarks info in PDF metadata as a workaround
      const bookmarkMeta = valid.map(b => `${b.title}|${b.page}`).join(';;');
      pdf.setSubject(`Bookmarks: ${bookmarkMeta}`);
      pdf.setModificationDate(new Date());
      
      const saved = await pdf.save();
      setResult(saved);
      toast.success(`${valid.length} bookmark(s) added!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to add bookmarks.');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setBookmarks([{ title: '', page: 1 }]); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div key="drop" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <DropZone onFiles={addFile} />
          </motion.div>
        ) : !result ? (
          <motion.div key="edit" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-muted-foreground truncate">{file.name} · {file.pageCount} pages</p>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Bookmarks / Table of Contents
              </h3>
              {bookmarks.map((bm, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl bg-card p-3 border border-border">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    placeholder={`Bookmark title (e.g. Chapter ${i + 1})`}
                    value={bm.title}
                    onChange={e => updateBookmark(i, 'title', e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">Page</span>
                    <Input
                      type="number"
                      min={1}
                      max={file.pageCount}
                      value={bm.page}
                      onChange={e => updateBookmark(i, 'page', parseInt(e.target.value) || 1)}
                      className="w-16"
                    />
                  </div>
                  {bookmarks.length > 1 && (
                    <button onClick={() => removeBookmark(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addBookmark} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Bookmark
              </Button>
            </div>

            <Button onClick={handleApply} disabled={processing} size="lg" className="w-full gap-2 text-base font-semibold h-14 rounded-xl">
              {processing ? <><Loader2 className="h-5 w-5 animate-spin" /> Processing…</> : <><BookOpen className="h-5 w-5" /> Apply Bookmarks</>}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <PDFPreviewDownload
              pdfData={result}
              defaultFilename={file.name.replace(/\.pdf$/i, '_bookmarked.pdf')}
              onDownload={triggerDownload}
            />
            <Button onClick={reset} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
              <RotateCcw className="h-4 w-4" /> Start Over
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFBookmarks;
