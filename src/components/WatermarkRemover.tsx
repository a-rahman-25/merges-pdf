import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Loader2, Download, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PDFDocument } from 'pdf-lib';

const WatermarkRemover = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<{ before: number; after: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== 'application/pdf') {
      toast.error('Please select a PDF file.');
      return;
    }
    setFile(selected);
    setResult(null);
    setStats(null);
    setProgress(0);
    toast.success(`Selected: ${selected.name}`);
    e.target.value = '';
  }, []);

  const handleRemove = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(10);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);

      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      setProgress(50);

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        // Remove annotations (watermarks are often added as annotations)
        try {
          page.node.delete('Annots' as any);
        } catch {}

        // Remove optional content groups (common watermark method)
        try {
          const resources = page.node.get('Resources' as any);
          if (resources && typeof (resources as any).delete === 'function') {
            (resources as any).delete('Properties');
          }
        } catch {}

        setProgress(50 + Math.round((i / pages.length) * 40));
      }

      // Strategy 3: Strip document-level metadata that may reference watermarks
      pdfDoc.setTitle(pdfDoc.getTitle() || '');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('MergePDF');
      pdfDoc.setCreator('MergePDF');

      const resultBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(resultBytes)], { type: 'application/pdf' });

      setResult(blob);
      setStats({ before: file.size, after: blob.size });
      setProgress(100);
      toast.success('Watermark removal attempted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to process PDF. The file may be corrupted or encrypted.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file.name.replace(/\.pdf$/i, '')}_no_watermark.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setStats(null);
    setProgress(0);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl font-bold text-foreground">Remove Watermark</h2>
        <p className="text-sm text-muted-foreground">
          Attempt to remove watermarks from PDF files — 100% in your browser
        </p>
      </div>

      {!file ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleFile}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">
                Click to select a PDF
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                PDF files only — processed locally in your browser
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-medium text-muted-foreground">{file.name}</p>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>

          {/* File info */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">Size: {formatSize(file.size)}</p>
              </div>
            </div>

            {stats && (
              <div className="mt-4 flex items-center gap-4 rounded-lg bg-accent/50 p-3 text-sm">
                <span className="text-muted-foreground">Before: {formatSize(stats.before)}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-semibold text-foreground">After: {formatSize(stats.after)}</span>
              </div>
            )}
          </div>

          {processing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                {progress < 50 ? 'Reading PDF…' : 'Removing watermarks…'} {progress}%
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {!result ? (
              <Button
                onClick={handleRemove}
                disabled={processing}
                size="lg"
                className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Droplets className="h-5 w-5" />
                    Remove Watermark
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleDownload}
                size="lg"
                className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl"
              >
                <Download className="h-5 w-5" />
                Download PDF
              </Button>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Note: This tool works best with text-based watermarks added as overlays. 
            Watermarks baked into images may not be fully removable.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default WatermarkRemover;
