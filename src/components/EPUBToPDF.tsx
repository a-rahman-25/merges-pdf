import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Loader2, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import { downloadBlob, formatFileSize } from '@/lib/pdf-utils';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';

function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    const w = font.widthOfTextAtSize(test, fontSize);
    if (w > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const EPUBToPDF = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  const doDownload = useCallback((filename?: string) => {
    if (!result || !file) return;
    const name = filename || file.name.replace(/\.epub$/i, '.pdf');
    downloadBlob(result, name);
    toast.success('Downloaded!');
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload, 'EPUB to PDF');

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.epub')) { toast.error('Please select an EPUB file.'); return; }
    setFile({ file: f, name: f.name, size: f.size });
    setResult(null);
    toast.success(`Selected: ${f.name}`);
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const buffer = await file.file.arrayBuffer();
      const zip = await JSZip.loadAsync(buffer);

      // Find XHTML/HTML content files
      const htmlFiles: string[] = [];
      zip.forEach((path, entry) => {
        if (!entry.dir && /\.(xhtml|html|htm)$/i.test(path)) {
          htmlFiles.push(path);
        }
      });

      if (htmlFiles.length === 0) { toast.error('No readable content found in EPUB.'); setProcessing(false); return; }

      // Try to find reading order from content.opf
      let orderedFiles = htmlFiles;
      const opfFile = Object.keys(zip.files).find(f => f.endsWith('.opf'));
      if (opfFile) {
        try {
          const opfXml = await zip.file(opfFile)!.async('string');
          const parser = new DOMParser();
          const doc = parser.parseFromString(opfXml, 'application/xml');
          const spine = doc.querySelector('spine');
          const manifest = doc.querySelector('manifest');
          if (spine && manifest) {
            const itemRefs = spine.querySelectorAll('itemref');
            const ordered: string[] = [];
            itemRefs.forEach(ref => {
              const idref = ref.getAttribute('idref');
              if (idref) {
                const item = manifest.querySelector(`item[id="${idref}"]`);
                const href = item?.getAttribute('href');
                if (href) {
                  const match = htmlFiles.find(f => f.endsWith(href) || f.includes(href));
                  if (match) ordered.push(match);
                }
              }
            });
            if (ordered.length > 0) orderedFiles = ordered;
          }
        } catch { /* use default order */ }
      }

      // Extract text from each content file
      const chapters: string[] = [];
      for (const path of orderedFiles) {
        const entry = zip.file(path);
        if (!entry) continue;
        const html = await entry.async('string');
        const text = stripHtml(html).trim();
        if (text) chapters.push(text);
      }

      if (chapters.length === 0) { toast.error('No text content found in EPUB.'); setProcessing(false); return; }

      // Build PDF
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.TimesRoman);
      const boldFont = await pdf.embedFont(StandardFonts.TimesRomanBold);
      const fontSize = 11;
      const margin = 50;
      const pageW = 595.28;
      const pageH = 841.89;
      const maxW = pageW - margin * 2;
      const lineHeight = fontSize * 1.5;

      let page = pdf.addPage([pageW, pageH]);
      let y = pageH - margin;

      for (let ci = 0; ci < chapters.length; ci++) {
        const paragraphs = chapters[ci].split(/\n+/).filter(p => p.trim());
        
        // Chapter heading
        if (ci > 0) {
          if (y < margin + lineHeight * 4) { page = pdf.addPage([pageW, pageH]); y = pageH - margin; }
          y -= lineHeight * 2;
        }

        for (const para of paragraphs) {
          const lines = wrapText(para, font, fontSize, maxW);
          for (const line of lines) {
            if (y < margin) { page = pdf.addPage([pageW, pageH]); y = pageH - margin; }
            page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
            y -= lineHeight;
          }
          y -= lineHeight * 0.5; // paragraph spacing
        }
      }

      const saved = await pdf.save();
      setResult(saved);
      toast.success(`Converted ${chapters.length} chapter(s) to PDF!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to convert EPUB to PDF.');
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
            <DropZone onFiles={addFile} accept=".epub" label="Drag & drop EPUB files here" sublabel="or click to browse · .epub files supported" />
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
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <Button onClick={handleConvert} disabled={processing} size="lg" className="w-full gap-2 text-base font-semibold h-14 rounded-xl">
              {processing ? <><Loader2 className="h-5 w-5 animate-spin" /> Converting…</> : <><BookOpen className="h-5 w-5" /> Convert to PDF</>}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <PDFPreviewDownload pdfData={result} defaultFilename={file.name.replace(/\.epub$/i, '.pdf')} onDownload={triggerDownload} />
            <Button onClick={reset} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
              <RotateCcw className="h-4 w-4" /> Convert Another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} toolName="EPUB to PDF" />
    </div>
  );
};

export default EPUBToPDF;
