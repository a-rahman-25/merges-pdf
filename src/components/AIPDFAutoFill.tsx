import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FormInput, Loader2, RotateCcw, FileText, Check, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatFileSize } from '@/lib/pdf-utils';
import { PDFDocument } from 'pdf-lib';
import { supabase } from '@/integrations/supabase/client';

interface FormField {
  name: string;
  type: string;
}

interface Suggestion {
  name: string;
  value: string;
  confidence: string;
  reasoning: string;
}

const AIPDFAutoFill = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number; fields: FormField[] } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [context, setContext] = useState('');
  const [appliedValues, setAppliedValues] = useState<Record<string, string>>({});
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
      const form = pdf.getForm();
      const fields: FormField[] = form.getFields().map(field => ({
        name: field.getName(),
        type: field.constructor.name.replace('PDF', '').replace('Field', '').toLowerCase(),
      }));
      if (fields.length === 0) {
        toast.error('No form fields found in this PDF');
        setExtracting(false);
        e.target.value = '';
        return;
      }
      setFile({ file: f, name: f.name, size: f.size, pageCount, fields });
      setSuggestions([]);
      setAppliedValues({});
      toast.success(`Found ${fields.length} form fields`);
    } catch { toast.error('Could not read this PDF'); }
    setExtracting(false);
    e.target.value = '';
  }, []);

  const handleAutoFill = async () => {
    if (!file) return;
    setProcessing(true);
    setSuggestions([]);
    try {
      const { data, error } = await supabase.functions.invoke('ai-pdf-autofill', {
        body: { formFields: file.fields, contextText: context, filename: file.name },
      });
      if (error) throw error;
      if (data?.suggestions) {
        setSuggestions(data.suggestions);
        const values: Record<string, string> = {};
        data.suggestions.forEach((s: Suggestion) => { if (s.value) values[s.name] = s.value; });
        setAppliedValues(values);
        toast.success('AI suggestions ready!');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to generate suggestions.');
    } finally { setProcessing(false); }
  };

  const handleDownload = async () => {
    if (!file) return;
    try {
      const buffer = await file.file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const form = pdf.getForm();
      for (const [name, value] of Object.entries(appliedValues)) {
        try {
          const field = form.getTextField(name);
          field.setText(value);
        } catch { /* skip non-text fields */ }
      }
      const bytes = await pdf.save();
      const blob = new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `filled_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Filled PDF downloaded!');
    } catch { toast.error('Failed to generate filled PDF'); }
  };

  const reset = () => { setFile(null); setSuggestions([]); setContext(''); setAppliedValues({}); };

  const confidenceBadge = (c: string) => {
    const colors = { high: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', low: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' };
    return <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors[c as keyof typeof colors] || colors.low}`}>{c}</span>;
  };

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
              {extracting ? <Loader2 className="h-8 w-8 text-primary animate-spin" /> : <FormInput className="h-8 w-8 text-primary" />}
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">
                {extracting ? 'Reading form fields...' : 'Upload a PDF form'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">AI will suggest values for each form field</p>
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
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)} · {file.fields.length} fields</p>
              </div>
            </div>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          {suggestions.length === 0 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Context (optional)</label>
                <Textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="E.g., My name is John Doe, company is Acme Corp, today's date is..."
                  className="min-h-[80px] rounded-xl"
                />
                <p className="text-xs text-muted-foreground">Provide information to help AI fill the form accurately</p>
              </div>
              <Button onClick={handleAutoFill} size="lg" disabled={processing} className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
                {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <FormInput className="h-5 w-5" />}
                {processing ? 'Generating suggestions...' : 'Auto-Fill with AI'}
              </Button>
            </>
          )}

          {suggestions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <h3 className="font-display font-semibold text-foreground">AI Suggestions</h3>
                {suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-medium text-foreground truncate">{s.name}</p>
                        {confidenceBadge(s.confidence)}
                      </div>
                      <input
                        type="text"
                        value={appliedValues[s.name] || ''}
                        onChange={(e) => setAppliedValues(prev => ({ ...prev, [s.name]: e.target.value }))}
                        className="w-full text-sm bg-background border border-border rounded-md px-2 py-1 text-foreground"
                      />
                      {s.reasoning && <p className="text-[11px] text-muted-foreground mt-1">{s.reasoning}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleDownload} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
                <Download className="h-5 w-5" /> Download Filled PDF
              </Button>
              <Button onClick={handleAutoFill} variant="outline" size="lg" className="w-full gap-2 rounded-xl">
                <RotateCcw className="h-5 w-5" /> Re-generate Suggestions
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AIPDFAutoFill;
