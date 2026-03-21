import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FolderSearch, Loader2, RotateCcw, FileText, Copy, Check, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/pdf-utils';
import { PDFDocument } from 'pdf-lib';
import { extractPdfText } from '@/lib/pdf-text-extract';
import { streamAI } from '@/lib/stream-ai';
import { useI18n } from '@/hooks/useI18n';

interface DocFile {
  file: File;
  name: string;
  size: number;
  pageCount: number;
  text: string;
}

const AIClassifier = () => {
  const { t } = useI18n();
  const [files, setFiles] = useState<DocFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected?.length) return;
    setExtracting(true);
    const newFiles: DocFile[] = [];
    for (const f of Array.from(selected)) {
      if (f.type !== 'application/pdf') { toast.error(`${f.name} is not a PDF`); continue; }
      try {
        const buffer = await f.arrayBuffer();
        const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const pageCount = pdf.getPageCount();
        const text = await extractPdfText(f, 4000);
        newFiles.push({ file: f, name: f.name, size: f.size, pageCount, text });
      } catch { toast.error(`Could not read ${f.name}`); }
    }
    setFiles(prev => [...prev, ...newFiles]);
    setResult('');
    setExtracting(false);
    if (newFiles.length) toast.success(`Loaded ${newFiles.length} document(s)`);
    e.target.value = '';
  }, []);

  const handleClassify = async () => {
    if (!files.length) return;
    setProcessing(true);
    setResult('');
    try {
      let accumulated = '';
      await streamAI({
        functionName: 'ai-classify',
        body: {
          documents: files.map(f => ({
            filename: f.name,
            pageCount: f.pageCount,
            textContent: f.text,
          })),
        },
        onDelta: (chunk) => { accumulated += chunk; setResult(accumulated); },
        onDone: () => { toast.success('Classification complete!'); },
      });
    } catch (err: any) {
      if (err?.status === 429) toast.error('Rate limited — please wait.');
      else if (err?.status === 402) toast.error('AI credits depleted.');
      else toast.error('Failed to classify documents.');
    } finally { setProcessing(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => { setFiles([]); setResult(''); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {files.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => !extracting && inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all"
        >
          <input ref={inputRef} type="file" accept=".pdf" multiple onChange={handleFiles} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4">
              {extracting ? <Loader2 className="h-8 w-8 text-primary animate-spin" /> : <FolderSearch className="h-8 w-8 text-primary" />}
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">
                {extracting ? 'Reading documents...' : 'Upload PDFs to classify'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">AI will categorize your documents by type (invoice, contract, report, etc.)</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-medium text-muted-foreground">{files.length} document(s)</p>
            <div className="flex items-center gap-3">
              <button onClick={() => inputRef.current?.click()} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors">
                <Plus className="h-3.5 w-3.5" /> Add more
              </button>
              <input ref={inputRef} type="file" accept=".pdf" multiple onChange={handleFiles} className="hidden" />
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Clear all
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-card p-3 pr-4 border border-border">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(f.size)} · {f.pageCount} pages</p>
                </div>
              </div>
            ))}
          </div>

          {!result && !processing && (
            <Button onClick={handleClassify} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
              <FolderSearch className="h-5 w-5" /> Classify Documents
            </Button>
          )}

          {(result || processing) && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-foreground">Classification Results</h3>
                  {result && !processing && (
                    <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
                {processing && !result && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" /> Analyzing documents...
                  </div>
                )}
                {result && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{result}</p>
                )}
                {processing && result && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary mt-2" />
                )}
              </div>
              {!processing && (
                <Button onClick={handleClassify} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
                  <FolderSearch className="h-5 w-5" /> Re-classify
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AIClassifier;
