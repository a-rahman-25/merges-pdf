import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Copy, Check, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { streamAI } from '@/lib/stream-ai';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const DOC_TYPES = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'contract', label: 'Contract / Agreement' },
  { value: 'letter', label: 'Business Letter' },
  { value: 'report', label: 'Report' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'memo', label: 'Memo' },
  { value: 'policy', label: 'Policy Document' },
  { value: 'resume', label: 'Resume / CV' },
  { value: 'nda', label: 'NDA' },
];

const AIPDFGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [docType, setDocType] = useState('auto');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (prompt.trim().length < 10) { toast.error('Please provide a more detailed description'); return; }
    setProcessing(true);
    setResult('');
    try {
      let accumulated = '';
      await streamAI({
        functionName: 'ai-pdf-generator',
        body: { prompt, documentType: docType === 'auto' ? undefined : docType },
        onDelta: (chunk) => { accumulated += chunk; setResult(accumulated); },
        onDone: () => toast.success('Document generated!'),
      });
    } catch (err: any) {
      if (err?.status === 429) toast.error('Rate limited — please wait.');
      else if (err?.status === 402) toast.error('AI credits depleted.');
      else toast.error(err?.message || 'Failed to generate document.');
    } finally { setProcessing(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    try {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 11;
      const titleSize = 16;
      const headingSize = 13;
      const margin = 50;
      const lineHeight = fontSize * 1.4;

      const lines = result.split('\n');
      let page = pdf.addPage([595, 842]); // A4
      let y = 842 - margin;

      for (const line of lines) {
        if (y < margin + 30) {
          page = pdf.addPage([595, 842]);
          y = 842 - margin;
        }

        const cleanLine = line.replace(/\*\*/g, '').replace(/^#+\s*/, '');

        if (line.startsWith('# ')) {
          y -= 10;
          page.drawText(cleanLine, { x: margin, y, size: titleSize, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
          y -= titleSize * 1.6;
        } else if (line.startsWith('## ') || line.startsWith('### ')) {
          y -= 6;
          page.drawText(cleanLine, { x: margin, y, size: headingSize, font: boldFont, color: rgb(0.15, 0.15, 0.15) });
          y -= headingSize * 1.5;
        } else if (line.trim() === '') {
          y -= lineHeight * 0.5;
        } else {
          // Word wrap
          const maxWidth = 595 - margin * 2;
          const words = cleanLine.split(' ');
          let currentLine = '';
          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const width = font.widthOfTextAtSize(testLine, fontSize);
            if (width > maxWidth && currentLine) {
              if (y < margin) { page = pdf.addPage([595, 842]); y = 842 - margin; }
              page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) });
              y -= lineHeight;
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
          if (currentLine) {
            if (y < margin) { page = pdf.addPage([595, 842]); y = 842 - margin; }
            page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) });
            y -= lineHeight;
          }
        }
      }

      const bytes = await pdf.save();
      const blob = new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-document.pdf';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded!');
    } catch { toast.error('Failed to create PDF'); }
  };

  const reset = () => { setPrompt(''); setResult(''); setDocType('auto'); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!result && !processing ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Document Type</label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOC_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Describe your document</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Create a non-disclosure agreement between Acme Corp and John Doe for a software development project, valid for 2 years..."
              className="min-h-[140px] rounded-xl"
            />
            <p className="text-xs text-muted-foreground">Be as specific as possible for better results</p>
          </div>

          <Button onClick={handleGenerate} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
            <FileText className="h-5 w-5" /> Generate Document
          </Button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display font-semibold text-foreground">Generated Document</h3>
            <div className="flex items-center gap-3">
              {result && !processing && (
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> New
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            {processing && !result && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> Generating document...
              </div>
            )}
            {result && <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{result}</p>}
            {processing && result && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary mt-2" />}
          </div>

          {!processing && result && (
            <div className="flex gap-3">
              <Button onClick={handleDownloadPDF} size="lg" className="flex-1 gap-2 text-base font-display font-semibold h-14 rounded-xl">
                <Download className="h-5 w-5" /> Download as PDF
              </Button>
              <Button onClick={handleGenerate} variant="outline" size="lg" className="gap-2 rounded-xl">
                <RotateCcw className="h-5 w-5" /> Regenerate
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AIPDFGenerator;
