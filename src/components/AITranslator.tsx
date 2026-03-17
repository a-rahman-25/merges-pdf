import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Languages, Loader2, RotateCcw, FileText, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatFileSize } from '@/lib/pdf-utils';
import { PDFDocument } from 'pdf-lib';
import { streamAI } from '@/lib/stream-ai';
import { useI18n } from '@/hooks/useI18n';

const languages = [
  { value: 'es', label: 'Spanish' }, { value: 'fr', label: 'French' }, { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' }, { value: 'pt', label: 'Portuguese' }, { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' }, { value: 'ko', label: 'Korean' }, { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' }, { value: 'ru', label: 'Russian' }, { value: 'tr', label: 'Turkish' },
  { value: 'nl', label: 'Dutch' }, { value: 'sv', label: 'Swedish' }, { value: 'pl', label: 'Polish' },
];

const AITranslator = () => {
  const { t } = useI18n();
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [targetLang, setTargetLang] = useState('es');
  const [processing, setProcessing] = useState(false);
  const [translation, setTranslation] = useState('');
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
      setTranslation('');
      toast.success(`Selected: ${f.name}`);
    } catch { toast.error('Could not read PDF file.'); }
    e.target.value = '';
  }, []);

  const handleTranslate = async () => {
    if (!file) return;
    setProcessing(true);
    setTranslation('');
    try {
      const langLabel = languages.find(l => l.value === targetLang)?.label || targetLang;
      let accumulated = '';
      await streamAI({
        functionName: 'ai-translate',
        body: { filename: file.name, pageCount: file.pageCount, targetLanguage: langLabel },
        onDelta: (chunk) => { accumulated += chunk; setTranslation(accumulated); },
        onDone: () => { toast.success('Translation complete!'); },
      });
    } catch (err: any) {
      console.error(err);
      if (err?.status === 429) toast.error('Rate limited — please try again shortly.');
      else if (err?.status === 402) toast.error('AI credits depleted.');
      else toast.error('Failed to translate. Please try again.');
    } finally { setProcessing(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translation);
    setCopied(true);
    toast.success(t('ai.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => { setFile(null); setTranslation(''); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all"
        >
          <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4"><Languages className="h-8 w-8 text-primary" /></div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">{t('ai.upload.translate')}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t('ai.upload.translate.desc')}</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-medium text-muted-foreground">{file.name}</p>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> {t('ai.clear')}
            </button>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-card p-3 pr-4 border border-border">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)} · {file.pageCount} {t('ai.pages')}</p>
            </div>
          </div>

          {!translation && !processing && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">{t('ai.translate.to')}</label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {languages.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {!translation && !processing && (
            <Button onClick={handleTranslate} disabled={processing} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
              <Languages className="h-5 w-5" /> {t('ai.translate.btn')}
            </Button>
          )}

          {(translation || processing) && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-foreground">{t('ai.translate.title')}</h3>
                  {translation && !processing && (
                    <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? t('ai.copied') : t('ai.copy')}
                    </button>
                  )}
                </div>
                {processing && !translation && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" /> {t('ai.translating')}
                  </div>
                )}
                {translation && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{translation}</p>
                )}
                {processing && translation && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary mt-2" />
                )}
              </div>
              {!processing && (
                <Button onClick={handleTranslate} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
                  <Languages className="h-5 w-5" /> {t('ai.translate.regen')}
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AITranslator;
