import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, Loader2, RotateCcw, Copy, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { createWorker } from 'tesseract.js';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import { downloadBlob, formatFileSize } from '@/lib/pdf-utils';

const LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fra', name: 'French' },
  { code: 'deu', name: 'German' },
  { code: 'por', name: 'Portuguese' },
  { code: 'ara', name: 'Arabic' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
  { code: 'hin', name: 'Hindi' },
  { code: 'jpn', name: 'Japanese' },
];

const OUTPUT_FORMATS = [
  { value: 'text', label: 'Plain Text (.txt)' },
  { value: 'pdf', label: 'Searchable PDF' },
];

const OCRTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('eng');
  const [outputFormat, setOutputFormat] = useState('text');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [resultBlob, setResultBlob] = useState<Uint8Array | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPageText, setCurrentPageText] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback((filename?: string) => {
    if (outputFormat === 'text' && extractedText) {
      const blob = new Blob([extractedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'ocr-result.txt';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Downloaded!');
    } else if (resultBlob) {
      downloadBlob(resultBlob, filename || 'ocr-searchable.pdf');
      toast.success('Downloaded!');
    }
  }, [extractedText, resultBlob, outputFormat]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'OCR Tool');

  const handleFile = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setExtractedText('');
    setResultBlob(null);
    setCurrentPageText([]);
    setPageImages([]);
  }, []);

  const startOCR = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);
    setCurrentPageText([]);

    try {
      let images: string[] = [];

      if (file.type === 'application/pdf') {
        setProgressMsg('Rendering PDF pages...');
        const arrayBuf = await file.arrayBuffer();
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuf }).promise;

        if (pdf.numPages > 20) {
          toast.info('This PDF has many pages — OCR may take a few minutes.');
        }

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const vp = page.getViewport({ scale: 2 }); // ~300 DPI
          const canvas = document.createElement('canvas');
          canvas.width = vp.width;
          canvas.height = vp.height;
          const ctx = canvas.getContext('2d')!;
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          images.push(canvas.toDataURL('image/png'));
        }
      } else {
        // Image file
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        images = [dataUrl];
      }

      setPageImages(images);

      // OCR each page
      const worker = await createWorker(language);
      const allTexts: string[] = [];

      for (let i = 0; i < images.length; i++) {
        setProgressMsg(`Processing page ${i + 1} of ${images.length}...`);
        setProgress(((i) / images.length) * 100);

        const { data } = await worker.recognize(images[i]);
        allTexts.push(data.text);
        setCurrentPageText(prev => [...prev, data.text]);
      }

      await worker.terminate();

      const fullText = allTexts.join('\n\n--- Page Break ---\n\n');
      setExtractedText(fullText);

      if (outputFormat === 'pdf') {
        // Create searchable PDF using pdf-lib
        const { PDFDocument, StandardFonts } = await import('pdf-lib');
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        for (let i = 0; i < images.length; i++) {
          const imgBytes = await fetch(images[i]).then(r => r.arrayBuffer());
          const img = await pdfDoc.embedPng(new Uint8Array(imgBytes));
          const page = pdfDoc.addPage([img.width / 2, img.height / 2]);
          page.drawImage(img, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });

          // Add invisible text layer
          const text = allTexts[i] || '';
          const lines = text.split('\n');
          const fontSize = 8;
          let y = page.getHeight() - 20;
          for (const line of lines) {
            if (y < 20) break;
            page.drawText(line.substring(0, 100), {
              x: 10, y, size: fontSize, font,
              opacity: 0.01, // Nearly invisible
            });
            y -= fontSize + 2;
          }
        }

        const pdfBytes = await pdfDoc.save();
        setResultBlob(pdfBytes);
      }

      setProgress(100);
      setProgressMsg('Complete!');
      toast.success('OCR complete!');
    } catch (err: any) {
      toast.error(err?.message || 'OCR failed');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    toast.success('Copied to clipboard!');
  };

  const reset = () => {
    setFile(null);
    setExtractedText('');
    setResultBlob(null);
    setPageImages([]);
    setCurrentPageText([]);
    setProgress(0);
    setProgressMsg('');
  };

  const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
  const charCount = extractedText.length;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFile(Array.from(e.dataTransfer.files)); }}
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-16 text-center transition-all hover:border-primary/50 hover:bg-accent/30"
            >
              <ScanLine className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-semibold text-foreground">Drop a PDF or image for OCR</p>
              <p className="mt-1 text-sm text-muted-foreground">PDF, JPG, PNG, WEBP supported</p>
            </div>
            <input ref={inputRef} type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => { if (e.target.files) handleFile(Array.from(e.target.files)); e.target.value = ''; }} />
          </motion.div>
        ) : !extractedText ? (
          <motion.div key="config" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(l => (
                      <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Output Format</label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {OUTPUT_FORMATS.map(f => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {processing && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">{progressMsg}</p>
              </div>
            )}

            {/* Live preview during processing */}
            {processing && currentPageText.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-4 max-h-48 overflow-y-auto">
                <p className="text-xs font-medium text-muted-foreground mb-2">Live Preview:</p>
                <p className="text-sm text-foreground whitespace-pre-wrap">{currentPageText[currentPageText.length - 1]?.substring(0, 500)}...</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={reset} className="rounded-xl">Cancel</Button>
              <Button onClick={startOCR} disabled={processing} className="flex-1 rounded-xl gradient-bg border-0">
                {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</> : <><ScanLine className="mr-2 h-4 w-4" /> Start OCR</>}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-card p-3 text-center">
                <p className="text-xl font-bold text-foreground">{wordCount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Words</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3 text-center">
                <p className="text-xl font-bold text-foreground">{charCount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Characters</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3 text-center">
                <p className="text-xl font-bold text-foreground">{pageImages.length}</p>
                <p className="text-xs text-muted-foreground">Pages</p>
              </div>
            </div>

            {/* Extracted text */}
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between p-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">Extracted Text</p>
                <Button size="sm" variant="ghost" onClick={copyToClipboard} className="gap-1.5">
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
              </div>
              <div className="p-4 max-h-80 overflow-y-auto">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{extractedText}</pre>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={reset} className="rounded-xl gap-1.5">
                <RotateCcw className="h-4 w-4" /> Start Over
              </Button>
              <Button onClick={() => triggerDownload()} className="flex-1 rounded-xl gradient-bg border-0 gap-1.5">
                <Download className="h-4 w-4" /> Download {outputFormat === 'pdf' ? 'Searchable PDF' : 'Text File'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewDialog open={showReview} toolName="OCR Tool" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default OCRTool;
