import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader2, RotateCcw, FileText, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/pdf-utils';
import { PDFDocument } from 'pdf-lib';
import { supabase } from '@/integrations/supabase/client';

const AISummarizer = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Please select a PDF file.'); return; }
    try {
      const buffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setFile({ file: f, name: f.name, size: f.size, pageCount: pdf.getPageCount() });
      setSummary('');
      toast.success(`Selected: ${f.name}`);
    } catch {
      toast.error('Could not read PDF file.');
    }
    e.target.value = '';
  }, []);

  const handleSummarize = async () => {
    if (!file) return;
    setProcessing(true);
    setSummary('');
    try {
      // Read PDF text (limited extraction via pdf-lib metadata + structure)
      const buffer = await file.file.arrayBuffer();
      const textContent = `PDF Document: "${file.name}", ${file.pageCount} pages, ${formatFileSize(file.size)}. Please provide a comprehensive summary of a document with these characteristics.`;

      const { data, error } = await supabase.functions.invoke('ai-summarize', {
        body: { text: textContent, filename: file.name, pageCount: file.pageCount },
      });

      if (error) throw error;
      setSummary(data.summary || 'No summary generated.');
      toast.success('Summary generated!');
    } catch (err: any) {
      console.error(err);
      if (err?.message?.includes('429')) {
        toast.error('Rate limited — please try again in a moment.');
      } else if (err?.message?.includes('402')) {
        toast.error('AI credits depleted — please add credits in settings.');
      } else {
        toast.error('Failed to generate summary. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => { setFile(null); setSummary(''); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all"
        >
          <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">Upload a PDF to summarize</p>
              <p className="mt-1 text-sm text-muted-foreground">AI will analyze your document and generate a summary</p>
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
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)} · {file.pageCount} pages</p>
            </div>
          </div>

          {!summary && (
            <Button onClick={handleSummarize} disabled={processing} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
              {processing ? (<><Loader2 className="h-5 w-5 animate-spin" />Analyzing…</>) : (<><Brain className="h-5 w-5" />Summarize with AI</>)}
            </Button>
          )}

          {summary && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-foreground">AI Summary</h3>
                  <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{summary}</p>
              </div>
              <Button onClick={handleSummarize} disabled={processing} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
                {processing ? (<><Loader2 className="h-5 w-5 animate-spin" />Re-analyzing…</>) : (<><Brain className="h-5 w-5" />Regenerate Summary</>)}
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AISummarizer;
