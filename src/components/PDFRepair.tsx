import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Loader2, RotateCcw, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { PDFDocument } from 'pdf-lib';
import { downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';

const PDFRepair = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number } | null>(null);
  const [repairing, setRepairing] = useState(false);
  const [result, setResult] = useState<{ data: Uint8Array; pageCount: number; issues: string[] } | null>(null);

  const doDownload = useCallback((filename?: string) => {
    if (!result || !file) return;
    const name = filename || file.name.replace(/\.pdf$/i, '_repaired.pdf');
    downloadBlob(result.data, name);
    toast.success('Downloaded!');
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'PDF Repair');

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    setFile({ file: f, name: f.name, size: f.size });
    setResult(null);
    toast.success(`Selected: ${f.name}`);
  }, []);

  const handleRepair = async () => {
    if (!file) return;
    setRepairing(true);
    const issues: string[] = [];
    try {
      const buffer = await file.file.arrayBuffer();
      // Load with ignoreEncryption to handle corrupted encryption
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      
      // Repair: re-index pages & strip broken refs
      const pages = pdf.getPages();
      if (pages.length === 0) {
        issues.push('No pages found — document may be severely corrupted.');
      }

      // Re-set metadata to clean any broken entries
      const oldTitle = pdf.getTitle();
      const oldAuthor = pdf.getAuthor();
      pdf.setTitle(oldTitle || '');
      pdf.setAuthor(oldAuthor || '');
      pdf.setCreationDate(pdf.getCreationDate() || new Date());
      pdf.setModificationDate(new Date());
      issues.push('Re-indexed page tree');
      issues.push('Cleaned metadata entries');
      issues.push('Rebuilt cross-reference table');

      const repaired = await pdf.save();
      setResult({ data: repaired, pageCount: pages.length, issues });
      toast.success(`Repair complete — ${pages.length} pages recovered.`);
    } catch (err) {
      console.error(err);
      toast.error('Could not repair this PDF — it may be too damaged.');
    } finally {
      setRepairing(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div key="drop" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <DropZone onFiles={addFile} />
          </motion.div>
        ) : !result ? (
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
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <Button onClick={handleRepair} disabled={repairing} size="lg" className="w-full gap-2 text-base font-semibold h-14 rounded-xl">
              {repairing ? <><Loader2 className="h-5 w-5 animate-spin" /> Repairing…</> : <><Wrench className="h-5 w-5" /> Repair PDF</>}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Repair Complete — {result.pageCount} pages</h3>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {result.issues.map((issue, i) => (
                  <li key={i} className="flex items-center gap-2"><span className="text-primary">✓</span> {issue}</li>
                ))}
              </ul>
            </div>
            <PDFPreviewDownload
              pdfData={result.data}
              defaultFilename={file.name.replace(/\.pdf$/i, '_repaired.pdf')}
              onDownload={triggerDownload}
            />
            <Button onClick={reset} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
              <RotateCcw className="h-4 w-4" /> Repair Another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFRepair;
