import { useState, useCallback, useRef } from 'react';
import { Loader2, RotateCcw, Presentation } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';

interface SlideContent {
  title: string;
  body: string[];
}

const PowerPointToPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ data: Uint8Array; pageCount: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback((filename?: string) => {
    if (result) {
      downloadBlob(result.data, filename || 'presentation.pdf');
      toast.success('Downloaded!');
    }
  }, [result]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'PowerPoint to PDF');

  const handleFile = useCallback((f: File) => {
    if (!/\.pptx$/i.test(f.name)) {
      toast.error('Please select a PowerPoint (.pptx) file.');
      return;
    }
    setFile(f);
    setResult(null);
  }, []);

  const extractText = (xml: string): string[] => {
    const texts: string[] = [];
    const regex = /<a:t[^>]*>([\s\S]*?)<\/a:t>/g;
    let match;
    while ((match = regex.exec(xml)) !== null) {
      const text = match[1].trim();
      if (text) texts.push(text);
    }
    return texts;
  };

  const convert = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const buf = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(buf);
      
      // Find slide files
      const slideFiles: string[] = [];
      zip.forEach((path) => {
        if (/^ppt\/slides\/slide\d+\.xml$/.test(path)) slideFiles.push(path);
      });
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0');
        const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0');
        return numA - numB;
      });

      if (slideFiles.length === 0) throw new Error('No slides found');

      const slides: SlideContent[] = [];
      for (const sf of slideFiles) {
        const xml = await zip.file(sf)!.async('string');
        const texts = extractText(xml);
        slides.push({
          title: texts[0] || `Slide ${slides.length + 1}`,
          body: texts.slice(1),
        });
      }

      // Create PDF with slide-like layout
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pageW = 792; // landscape
      const pageH = 612;
      const margin = 50;

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const page = pdf.addPage([pageW, pageH]);

        // Slide background
        page.drawRectangle({ x: 0, y: 0, width: pageW, height: pageH, color: rgb(1, 1, 1) });
        
        // Slide number
        page.drawText(`${i + 1} / ${slides.length}`, {
          x: pageW - margin - 40, y: 20, font, size: 10, color: rgb(0.6, 0.6, 0.6),
        });

        // Title
        let y = pageH - margin - 10;
        const titleLines = wrapText(slide.title, boldFont, 22, pageW - margin * 2);
        for (const line of titleLines) {
          page.drawText(line, { x: margin, y, font: boldFont, size: 22, color: rgb(0.1, 0.1, 0.2) });
          y -= 30;
        }

        // Divider
        y -= 10;
        page.drawLine({ start: { x: margin, y }, end: { x: pageW - margin, y }, thickness: 1, color: rgb(0.85, 0.85, 0.9) });
        y -= 25;

        // Body text
        for (const text of slide.body) {
          if (y < margin + 20) break;
          const lines = wrapText(`• ${text}`, font, 14, pageW - margin * 2 - 20);
          for (const line of lines) {
            if (y < margin + 20) break;
            page.drawText(line, { x: margin + 20, y, font, size: 14, color: rgb(0.2, 0.2, 0.25) });
            y -= 22;
          }
          y -= 6;
        }
      }

      const pdfBytes = await pdf.save();
      setResult({ data: pdfBytes, pageCount: pdf.getPageCount() });
      toast.success('Converted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Conversion failed. Ensure this is a valid .pptx file.');
    } finally {
      setProcessing(false);
    }
  }, [file]);

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {!file ? (
        <div
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center transition hover:border-primary"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        >
          <Presentation className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-display text-lg font-semibold text-foreground">Drop PowerPoint file here</p>
          <p className="mt-1 text-sm text-muted-foreground">Supports .pptx files</p>
          <input ref={inputRef} type="file" accept=".pptx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      ) : !result ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-4">
          <p className="font-semibold text-foreground">{file.name} <span className="text-muted-foreground">({formatFileSize(file.size)})</span></p>
          <div className="flex justify-center gap-3">
            <Button onClick={convert} disabled={processing}>
              {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting…</> : 'Convert to PDF'}
            </Button>
            <Button variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
          </div>
        </div>
      ) : (
        <>
          <PDFPreviewDownload pdfData={result.data} defaultFilename="presentation.pdf" onDownload={triggerDownload} />
          <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} toolName="PowerPoint to PDF" />
        </>
      )}
    </div>
  );
};

function wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(test, size);
    if (width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export default PowerPointToPDF;
