import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatFileSize, downloadBlob } from '@/lib/pdf-utils';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import mammoth from 'mammoth';

const WordToPDF = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!['doc', 'docx'].includes(ext || '')) { toast.error('Please select a Word document (.doc, .docx).'); return; }
    setFile({ file: f, name: f.name, size: f.size });
    setDone(false);
    toast.success(`Selected: ${f.name}`);
    e.target.value = '';
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const buffer = await file.file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      const text = result.value;

      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const margin = 50;
      const lineHeight = fontSize * 1.5;

      const lines = text.split('\n');
      let page = pdf.addPage();
      let { height } = page.getSize();
      let y = height - margin;
      const pageWidth = page.getWidth() - margin * 2;

      for (const line of lines) {
        // Word wrap
        const words = line.split(' ');
        let currentLine = '';
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testWidth = font.widthOfTextAtSize(testLine, fontSize);
          if (testWidth > pageWidth && currentLine) {
            if (y < margin + lineHeight) {
              page = pdf.addPage();
              height = page.getHeight();
              y = height - margin;
            }
            page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
            y -= lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          if (y < margin + lineHeight) {
            page = pdf.addPage();
            height = page.getHeight();
            y = height - margin;
          }
          page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
          y -= lineHeight;
        } else {
          y -= lineHeight; // empty line
        }
      }

      const data = await pdf.save();
      const baseName = file.name.replace(/\.(doc|docx)$/i, '');
      downloadBlob(data, `${baseName}.pdf`);
      setDone(true);
      toast.success('Converted to PDF and downloaded!');
    } catch (err) {
      toast.error('Failed to convert Word to PDF.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setDone(false); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all"
        >
          <input ref={inputRef} type="file" accept=".doc,.docx" onChange={handleFile} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">Select a Word document</p>
              <p className="mt-1 text-sm text-muted-foreground">Convert .doc or .docx to PDF format</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-medium text-muted-foreground">{file.name}</p>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-card p-3 pr-4 border border-border">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <Button onClick={handleConvert} disabled={processing || done} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
            {processing ? (<><Loader2 className="h-5 w-5 animate-spin" />Converting…</>) : done ? (<><Download className="h-5 w-5" />Done!</>) : (<><FileText className="h-5 w-5" />Convert to PDF</>)}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default WordToPDF;
