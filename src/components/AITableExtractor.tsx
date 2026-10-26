import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { TableProperties, Loader2, RotateCcw, FileText, Copy, Check, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/pdf-utils';
import { PDFDocument } from 'pdf-lib';
import { extractPdfText } from '@/lib/pdf-text-extract';
import { aiTablesToCsv } from '@/lib/ai-table-csv';
import { streamAI } from '@/lib/stream-ai';
import { useI18n } from '@/hooks/useI18n';

const AITableExtractor = () => {
  const { t } = useI18n();
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number; text: string } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Please select a PDF file.'); return; }
    try {
      setExtracting(true);
      const buffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = pdf.getPageCount();
      const text = await extractPdfText(f);
      setFile({ file: f, name: f.name, size: f.size, pageCount, text });
      setResult('');
      toast.success(`Loaded ${f.name} — text extracted`);
    } catch { toast.error('Could not read PDF file.'); }
    finally { setExtracting(false); }
    e.target.value = '';
  }, []);

  const handleExtract = async () => {
    if (!file) return;
    setProcessing(true);
    setResult('');
    try {
      let accumulated = '';
      await streamAI({
        functionName: 'ai-table-extract',
        body: { textContent: file.text, filename: file.name, pageCount: file.pageCount },
        onDelta: (chunk) => { accumulated += chunk; setResult(accumulated); },
        onDone: () => { toast.success('Tables extracted!'); },
      });
    } catch (err: any) {
      if (err?.status === 429) toast.error('Rate limited — please wait.');
      else if (err?.status === 402) toast.error('AI credits depleted.');
      else toast.error('Failed to extract tables.');
    } finally { setProcessing(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const blob = new Blob([aiTablesToCsv(result)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.replace(/\.pdf$/i, '')}_tables.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => { setFile(null); setResult(''); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => !extracting && inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all"
        >
          <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4">
              {extracting ? <Loader2 className="h-8 w-8 text-primary animate-spin" /> : <TableProperties className="h-8 w-8 text-primary" />}
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">
                {extracting ? 'Extracting text...' : 'Upload a PDF to extract tables'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">AI will find and extract all tabular data as CSV</p>
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
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)} · {file.pageCount} pages · Text extracted ✓</p>
            </div>
          </div>

          {!result && !processing && (
            <Button onClick={handleExtract} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
              <TableProperties className="h-5 w-5" /> Extract Tables
            </Button>
          )}

          {(result || processing) && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-foreground">Extracted Tables</h3>
                  {result && !processing && (
                    <div className="flex items-center gap-2">
                      <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button onClick={handleDownloadCSV} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <Download className="h-3.5 w-3.5" /> CSV
                      </button>
                    </div>
                  )}
                </div>
                {processing && !result && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" /> Analyzing document for tables...
                  </div>
                )}
                {result && (
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono text-xs overflow-x-auto">{result}</pre>
                )}
                {processing && result && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary mt-2" />
                )}
              </div>
              {!processing && (
                <Button onClick={handleExtract} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
                  <TableProperties className="h-5 w-5" /> Re-extract
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AITableExtractor;
