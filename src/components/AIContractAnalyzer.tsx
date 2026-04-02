import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Loader2, RotateCcw, FileText, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/pdf-utils';
import { PDFDocument } from 'pdf-lib';
import { extractPdfText } from '@/lib/pdf-text-extract';
import { streamAI } from '@/lib/stream-ai';

const AIContractAnalyzer = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number; text: string } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Please upload a PDF'); return; }
    setExtracting(true);
    try {
      const buffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = pdf.getPageCount();
      const text = await extractPdfText(f, 12000);
      setFile({ file: f, name: f.name, size: f.size, pageCount, text });
      setResult('');
      toast.success('Document loaded');
    } catch { toast.error('Could not read this PDF'); }
    setExtracting(false);
    e.target.value = '';
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;
    setProcessing(true);
    setResult('');
    try {
      let accumulated = '';
      await streamAI({
        functionName: 'ai-contract-analyzer',
        body: { textContent: file.text, filename: file.name, pageCount: file.pageCount },
        onDelta: (chunk) => { accumulated += chunk; setResult(accumulated); },
        onDone: () => toast.success('Analysis complete!'),
      });
    } catch (err: any) {
      if (err?.status === 429) toast.error('Rate limited — please wait.');
      else if (err?.status === 402) toast.error('AI credits depleted.');
      else toast.error(err?.message || 'Failed to analyze document.');
    } finally { setProcessing(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
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
              {extracting ? <Loader2 className="h-8 w-8 text-primary animate-spin" /> : <Shield className="h-8 w-8 text-primary" />}
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">
                {extracting ? 'Reading document...' : 'Upload a contract or legal document'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">AI will identify key clauses, risks, and obligations</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)} · {file.pageCount} pages</p>
              </div>
            </div>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          {!result && !processing && (
            <Button onClick={handleAnalyze} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
              <Shield className="h-5 w-5" /> Analyze Contract
            </Button>
          )}

          {(result || processing) && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-foreground">Contract Analysis</h3>
                  {result && !processing && (
                    <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
                {processing && !result && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" /> Analyzing contract...
                  </div>
                )}
                {result && <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{result}</p>}
                {processing && result && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary mt-2" />}
              </div>
              {!processing && (
                <Button onClick={handleAnalyze} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
                  <Shield className="h-5 w-5" /> Re-analyze
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AIContractAnalyzer;
