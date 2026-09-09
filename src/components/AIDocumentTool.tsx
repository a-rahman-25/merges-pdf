import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RotateCcw, FileText, Copy, Check, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/pdf-utils';
import { PDFDocument } from 'pdf-lib';
import { extractPdfText } from '@/lib/pdf-text-extract';
import { streamAI } from '@/lib/stream-ai';
import { useI18n } from '@/hooks/useI18n';
import type { AIToolConfig } from '@/lib/ai-tools-config';

interface FileInfo {
  file: File;
  name: string;
  size: number;
  pageCount: number;
  text: string;
}

// Below this, the PDF is almost certainly scanned images: the model would have
// nothing to work from and would answer from the filename alone.
const MIN_USABLE_TEXT = 50;

const AIDocumentTool = ({ tool }: { tool: AIToolConfig }) => {
  const { t } = useI18n();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxFiles = tool.acceptMultiple ? 2 : 1;

  const handleFiles = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const parsed: FileInfo[] = [];
    setExtracting(true);
    try {
      for (const f of selected.slice(0, maxFiles)) {
        if (f.type !== 'application/pdf') { toast.error('Please select PDF files.'); return; }
        try {
          const buffer = await f.arrayBuffer();
          const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
          const text = await extractPdfText(f);
          parsed.push({ file: f, name: f.name, size: f.size, pageCount: pdf.getPageCount(), text });
        } catch {
          toast.error(`Could not read: ${f.name}`);
          return;
        }
      }
    } finally {
      setExtracting(false);
      e.target.value = '';
    }

    const unreadable = parsed.filter((f) => f.text.trim().length < MIN_USABLE_TEXT);
    if (unreadable.length) {
      toast.error(
        `No text could be extracted from ${unreadable.map((f) => f.name).join(', ')}. ` +
        'Run it through the OCR tool first, then try again.'
      );
      return;
    }

    setFiles(parsed);
    setResult('');
    toast.success(`Selected: ${parsed.map(f => f.name).join(', ')} — text extracted`);
  }, [maxFiles]);

  const handleProcess = async () => {
    if (!files.length) return;
    setProcessing(true);
    setResult('');
    try {
      const f = files[0];
      const body: Record<string, unknown> = {
        toolSlug: tool.slug,
        text: f.text,
        filename: f.name,
        pageCount: f.pageCount,
      };
      if (files.length > 1) {
        body.filename2 = files[1].name;
        body.text2 = files[1].text;
      }

      let accumulated = '';
      await streamAI({
        functionName: 'ai-document-tool',
        body,
        onDelta: (chunk) => { accumulated += chunk; setResult(accumulated); },
        onDone: () => toast.success('Processing complete!'),
      });
    } catch (err: any) {
      if (err?.status === 429) toast.error('Rate limited — please try again shortly.');
      else if (err?.status === 402) toast.error('AI credits depleted.');
      else toast.error('Processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success(t('ai.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool.slug}-result.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => { setFiles([]); setResult(''); };

  const Icon = tool.icon;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!files.length ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => !extracting && inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            multiple={tool.acceptMultiple}
            onChange={handleFiles}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className={`rounded-xl p-4 ${tool.color}`}>
              {extracting ? <Loader2 className="h-8 w-8 animate-spin" /> : <Icon className="h-8 w-8" />}
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">
                {extracting
                  ? 'Extracting text...'
                  : tool.acceptMultiple ? t('ai.upload.pdfs') : t('ai.upload.pdf')}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Upload className="h-3.5 w-3.5" /> {t('ai.click.drag')}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-medium text-muted-foreground">
              {files.map(f => f.name).join(' & ')}
            </p>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> {t('ai.clear')}
            </button>
          </div>

          {files.map((f) => (
            <div key={f.name} className="flex items-center gap-3 rounded-xl bg-card p-3 pr-4 border border-border">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{f.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(f.size)} · {f.pageCount} {t('ai.pages')} · Text extracted ✓</p>
              </div>
            </div>
          ))}

          {!result && !processing && (
            <Button onClick={handleProcess} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
              <Icon className="h-5 w-5" /> {tool.shortTitle} {t('ai.withAI')}
            </Button>
          )}

          {(result || processing) && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-foreground">{t('ai.result')}</h3>
                  {result && !processing && (
                    <div className="flex items-center gap-2">
                      <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? t('ai.copied') : t('ai.copy')}
                      </button>
                      <button onClick={handleDownload} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <Download className="h-3.5 w-3.5" /> {t('ai.download')}
                      </button>
                    </div>
                  )}
                </div>
                {processing && !result && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" /> {t('ai.analyzing')}
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
                <Button onClick={handleProcess} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
                  <Icon className="h-5 w-5" /> {t('ai.regenerate')}
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        {t('ai.privacy')}
      </p>
    </div>
  );
};

export default AIDocumentTool;
