import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Loader2, RotateCcw, Info } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getPageCount, downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import PreDownloadSummary from '@/components/PreDownloadSummary';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';

interface Metadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
}

const PDFMetadataEditor = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [meta, setMeta] = useState<Metadata>({ title: '', author: '', subject: '', keywords: '', creator: '', producer: '' });
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback((filename?: string) => {
    if (result && file) {
      downloadBlob(result, filename || file.name.replace(/\.pdf$/i, '_metadata.pdf'));
      toast.success('Downloaded!');
    }
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload);

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    try {
      const count = await getPageCount(f);
      const bytes = new Uint8Array(await f.arrayBuffer());
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setMeta({
        title: pdf.getTitle() || '',
        author: pdf.getAuthor() || '',
        subject: pdf.getSubject() || '',
        keywords: (pdf.getKeywords() || ''),
        creator: pdf.getCreator() || '',
        producer: pdf.getProducer() || '',
      });
      setFile({ file: f, name: f.name, size: f.size, pageCount: count });
      setResult(null);
    } catch { toast.error('Failed to read PDF.'); }
  }, []);

  const saveMetadata = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = new Uint8Array(await file.file.arrayBuffer());
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      pdf.setTitle(meta.title);
      pdf.setAuthor(meta.author);
      pdf.setSubject(meta.subject);
      pdf.setKeywords(meta.keywords.split(',').map(k => k.trim()).filter(Boolean));
      pdf.setCreator(meta.creator);
      pdf.setProducer(meta.producer);
      const pdfBytes = await pdf.save();
      setResult(pdfBytes);
      toast.success('Metadata updated!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update metadata');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setMeta({ title: '', author: '', subject: '', keywords: '', creator: '', producer: '' }); };

  const fields: { key: keyof Metadata; label: string; placeholder: string }[] = [
    { key: 'title', label: 'Title', placeholder: 'Document title' },
    { key: 'author', label: 'Author', placeholder: 'Author name' },
    { key: 'subject', label: 'Subject', placeholder: 'Document subject' },
    { key: 'keywords', label: 'Keywords', placeholder: 'keyword1, keyword2, keyword3' },
    { key: 'creator', label: 'Creator', placeholder: 'Application used to create' },
    { key: 'producer', label: 'Producer', placeholder: 'PDF producer' },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <AnimatePresence mode="wait">
        {result && file ? (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PreDownloadSummary
              title="Metadata Updated"
              items={[
                { label: 'File', value: file.name },
                { label: 'Title', value: meta.title || '(empty)' },
                { label: 'Author', value: meta.author || '(empty)' },
                { label: 'Output size', value: formatFileSize(result.byteLength) },
              ]}
              onDownload={triggerDownload}
            />
            <div className="mt-4 flex justify-center">
              <Button onClick={reset} variant="outline" className="rounded-xl"><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
            </div>
          </motion.div>
        ) : !file ? (
          <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf'); if (files.length) addFile(files); }}
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center transition-all hover:border-primary/50"
            >
              <Info className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium text-foreground">Drop a PDF to edit metadata</p>
              <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
            </div>
            <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { if (e.target.files) addFile(Array.from(e.target.files)); e.target.value = ''; }} />
          </motion.div>
        ) : (
          <motion.div key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{file.pageCount} pages · {formatFileSize(file.size)}</p>
            </div>

            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="text-sm font-medium text-foreground mb-1 block">{f.label}</label>
                  <Input
                    value={meta[f.key]}
                    onChange={(e) => setMeta(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="rounded-xl"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={reset} variant="outline" className="rounded-xl">Cancel</Button>
              <Button onClick={saveMetadata} disabled={processing} className="flex-1 rounded-xl">
                {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : <><FileText className="mr-2 h-4 w-4" /> Save Metadata</>}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ReviewDialog open={showReview} toolName="PDF Metadata Editor" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFMetadataEditor;
