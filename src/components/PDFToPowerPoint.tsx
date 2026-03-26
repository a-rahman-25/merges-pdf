import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Presentation, Loader2, RotateCcw, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { formatFileSize, getPageCount } from '@/lib/pdf-utils';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import { logToolUsage } from '@/lib/analytics';

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();

const PDFToPowerPoint = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ slides: { page: number; text: string; width: number; height: number }[] } | null>(null);

  const doDownload = useCallback((_filename?: string) => {
    if (!result || !file) return;
    // Generate a simple HTML-based presentation (PPTX generation would need a large library)
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${file.name.replace(/\.pdf$/i, '')} - Presentation</title>
<style>
  body { margin: 0; font-family: Arial, sans-serif; }
  .slide { width: 960px; min-height: 720px; margin: 40px auto; padding: 60px; box-sizing: border-box; background: white; border: 1px solid #ddd; box-shadow: 0 4px 20px rgba(0,0,0,0.1); page-break-after: always; position: relative; }
  .slide-number { position: absolute; bottom: 20px; right: 30px; color: #999; font-size: 14px; }
  .slide h2 { color: #333; margin-bottom: 30px; font-size: 28px; }
  .slide p { color: #555; font-size: 16px; line-height: 1.8; white-space: pre-wrap; }
  @media print { .slide { box-shadow: none; border: none; margin: 0; } }
</style>
</head>
<body>
${result.slides.map((s) => `
<div class="slide">
  <h2>Slide ${s.page}</h2>
  <p>${s.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
  <div class="slide-number">${s.page} / ${result.slides.length}</div>
</div>`).join('\n')}
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = _filename || file.name.replace(/\.pdf$/i, '_presentation.html');
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'PDF to PowerPoint');

  const addFile = useCallback(async (files: File[]) => {
    const f = files[0]; if (!f) return;
    let pc = 1; try { pc = await getPageCount(f); } catch {}
    setFile({ file: f, name: f.name, size: f.size, pageCount: pc });
    setResult(null);
    toast.success(`Selected: ${f.name}`);
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const buffer = await file.file.arrayBuffer();
      const pdf = await getDocument({ data: buffer }).promise;
      const slides: { page: number; text: string; width: number; height: number }[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const viewport = page.getViewport({ scale: 1 });
        const text = content.items.map((item: any) => item.str).join(' ');
        slides.push({ page: i, text, width: viewport.width, height: viewport.height });
      }

      setResult({ slides });
      toast.success(`Extracted ${slides.length} slide(s)!`);
      logToolUsage('PDF to PowerPoint', '/pdf-to-powerpoint');
    } catch (err) {
      console.error(err);
      toast.error('Failed to convert PDF to presentation.');
    } finally {
      setProcessing(false);
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
              <p className="text-sm font-medium text-muted-foreground truncate">{file.name} · {file.pageCount} pages</p>
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
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)} · {file.pageCount} pages</p>
              </div>
            </div>
            <Button onClick={handleConvert} disabled={processing} size="lg" className="w-full gap-2 text-base font-semibold h-14 rounded-xl">
              {processing ? <><Loader2 className="h-5 w-5 animate-spin" /> Converting…</> : <><Presentation className="h-5 w-5" /> Convert to Presentation</>}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Presentation className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Presentation Ready</h3>
              </div>
              <p className="text-sm text-muted-foreground">{result.slides.length} slide(s) extracted from your PDF. Each page becomes a slide.</p>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {result.slides.slice(0, 8).map((s) => (
                  <div key={s.page} className="aspect-[4/3] rounded-lg border border-border bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
                    Slide {s.page}
                  </div>
                ))}
                {result.slides.length > 8 && (
                  <div className="aspect-[4/3] rounded-lg border border-border bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
                    +{result.slides.length - 8} more
                  </div>
                )}
              </div>
            </div>
            <Button onClick={() => triggerDownload()} size="lg" className="w-full gap-2 text-base font-semibold h-14 rounded-xl">
              <Download className="h-5 w-5" /> Download Presentation
            </Button>
            <Button onClick={reset} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
              <RotateCcw className="h-4 w-4" /> Convert Another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} toolName="PDF to PowerPoint" />
    </div>
  );
};

export default PDFToPowerPoint;
