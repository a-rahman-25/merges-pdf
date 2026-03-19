import { useState, useCallback, useRef } from 'react';
import { Loader2, RotateCcw, ImageIcon, Download } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import heic2any from 'heic2any';
import { Button } from '@/components/ui/button';
import { downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';

type OutputFormat = 'pdf' | 'jpg' | 'png';

const HeicConverter = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('pdf');
  const [result, setResult] = useState<{ data: Uint8Array; pageCount: number } | null>(null);
  const [jpgResults, setJpgResults] = useState<{ blob: Blob; name: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback((filename?: string) => {
    if (result) {
      downloadBlob(result.data, filename || 'heic-converted.pdf');
      toast.success('Downloaded!');
    }
  }, [result]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'HEIC Converter');

  const addFiles = useCallback((newFiles: File[]) => {
    const heicFiles = newFiles.filter(f => /\.(heic|heif)$/i.test(f.name));
    if (heicFiles.length === 0) {
      toast.error('Please select HEIC/HEIF images.');
      return;
    }
    setFiles(prev => [...prev, ...heicFiles]);
    setResult(null);
    setJpgResults([]);
  }, []);

  const convert = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const convertedImages: { blob: Blob; name: string }[] = [];
      
      for (const file of files) {
        const buf = await file.arrayBuffer();
        const blob = new Blob([buf], { type: 'image/heic' });
        const converted = await heic2any({
          blob,
          toType: outputFormat === 'png' ? 'image/png' : 'image/jpeg',
          quality: 0.92,
        });
        const resultBlob = Array.isArray(converted) ? converted[0] : converted;
        const ext = outputFormat === 'png' ? 'png' : 'jpg';
        convertedImages.push({
          blob: resultBlob,
          name: file.name.replace(/\.(heic|heif)$/i, `.${ext}`),
        });
      }

      if (outputFormat === 'pdf') {
        // Combine into PDF
        const pdf = await PDFDocument.create();
        for (const img of convertedImages) {
          const imgBuf = await img.blob.arrayBuffer();
          const embedded = await pdf.embedJpg(new Uint8Array(imgBuf));
          const page = pdf.addPage([embedded.width, embedded.height]);
          page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
        }
        const pdfBytes = await pdf.save();
        setResult({ data: pdfBytes, pageCount: pdf.getPageCount() });
        toast.success('Converted to PDF!');
      } else {
        setJpgResults(convertedImages);
        toast.success(`Converted ${convertedImages.length} image(s)!`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Conversion failed. Ensure valid HEIC/HEIF files.');
    } finally {
      setProcessing(false);
    }
  }, [files, outputFormat]);

  const downloadImage = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => { setFiles([]); setResult(null); setJpgResults([]); };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {files.length === 0 ? (
        <div
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center transition hover:border-primary"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); addFiles(Array.from(e.dataTransfer.files)); }}
        >
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-display text-lg font-semibold text-foreground">Drop HEIC/HEIF images here</p>
          <p className="mt-1 text-sm text-muted-foreground">Convert Apple photos to JPG, PNG, or PDF</p>
          <input ref={inputRef} type="file" accept=".heic,.heif" multiple className="hidden" onChange={(e) => { if (e.target.files) addFiles(Array.from(e.target.files)); }} />
        </div>
      ) : !result && jpgResults.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 space-y-4">
          <p className="text-center font-semibold text-foreground">{files.length} file(s) selected</p>
          <div className="flex justify-center gap-2">
            {(['pdf', 'jpg', 'png'] as OutputFormat[]).map(fmt => (
              <Button key={fmt} variant={outputFormat === fmt ? 'default' : 'outline'} size="sm" onClick={() => setOutputFormat(fmt)}>
                {fmt.toUpperCase()}
              </Button>
            ))}
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={convert} disabled={processing}>
              {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting…</> : `Convert to ${outputFormat.toUpperCase()}`}
            </Button>
            <Button variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
          </div>
        </div>
      ) : result ? (
        <>
          <PDFPreviewDownload pdfData={result.data} defaultFilename="heic-converted.pdf" onDownload={triggerDownload} />
          <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} toolName="HEIC Converter" />
        </>
      ) : (
        <div className="space-y-3">
          {jpgResults.map((img, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <span className="text-sm font-medium text-foreground">{img.name}</span>
              <Button size="sm" onClick={() => downloadImage(img.blob, img.name)}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          ))}
          <div className="flex justify-center">
            <Button variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeicConverter;
