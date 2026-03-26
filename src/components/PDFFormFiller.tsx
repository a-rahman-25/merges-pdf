import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Loader2, RotateCcw, Download, FormInput } from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getPageCount, formatFileSize, downloadBlob, SUPPORT_EMAIL } from '@/lib/pdf-utils';
import { PDFDocument } from 'pdf-lib';
import { logToolUsage } from '@/lib/analytics';

interface FormField {
  name: string;
  type: string;
  value: string;
  options?: string[];
}

const PDFFormFiller = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number | null } | null>(null);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<FormField[]>([]);
  const [saving, setSaving] = useState(false);
  const [noFields, setNoFields] = useState(false);

  const addFile = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    setLoading(true);
    setNoFields(false);
    let pageCount: number | null = null;
    try { pageCount = await getPageCount(f); } catch {}

    try {
      const buffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const form = pdf.getForm();
      const pdfFields = form.getFields();

      if (pdfFields.length === 0) {
        setNoFields(true);
        setFile({ file: f, name: f.name, size: f.size, pageCount });
        setFields([]);
        toast.info('No fillable form fields found in this PDF.');
      } else {
        const extracted: FormField[] = pdfFields.map((field) => {
          const name = field.getName();
          const type = field.constructor.name;
          let value = '';
          try {
            if ('getText' in field && typeof (field as any).getText === 'function') {
              value = (field as any).getText() || '';
            }
          } catch {}
          return { name, type, value };
        });
        setFields(extracted);
        setFile({ file: f, name: f.name, size: f.size, pageCount });
        toast.success(`Found ${extracted.length} form field${extracted.length !== 1 ? 's' : ''}!`);
      }
    } catch (err) {
      toast.error('Could not read form fields from this PDF.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateField = (index: number, value: string) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, value } : f));
  };

  const handleSave = async () => {
    if (!file) return;
    setSaving(true);
    try {
      const buffer = await file.file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const form = pdf.getForm();

      for (const field of fields) {
        try {
          const pdfField = form.getField(field.name);
          if ('setText' in pdfField && typeof (pdfField as any).setText === 'function') {
            (pdfField as any).setText(field.value);
          }
        } catch {}
      }

      try { form.flatten(); } catch {}
      const data = await pdf.save();
      downloadBlob(data, file.name.replace(/\.pdf$/i, '_filled.pdf'));
      toast.success('Filled PDF downloaded!');
      logToolUsage('Form Filler', '/pdf-form-filler');
    } catch (err) {
      toast.error(`Failed to save. Contact ${SUPPORT_EMAIL} for help.`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const reset = () => { setFile(null); setFields([]); setNoFields(false); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file && <DropZone onFiles={addFile} disabled={loading} />}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Scanning form fields…
        </div>
      )}

      <AnimatePresence>
        {file && !loading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-muted-foreground">{file.name}</p>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Change file
              </button>
            </div>

            {noFields ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium text-foreground">No fillable fields detected</p>
                <p className="text-xs text-muted-foreground mt-1">This PDF doesn't contain interactive form fields. Try a PDF with form fields (text inputs, checkboxes, etc.).</p>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-border bg-card divide-y divide-border">
                  {fields.map((field, i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{field.name}</p>
                        <p className="text-xs text-muted-foreground">{field.type.replace('PDF', '').replace('Field', ' Field')}</p>
                      </div>
                      <Input
                        value={field.value}
                        onChange={(e) => updateField(i, e.target.value)}
                        placeholder="Enter value…"
                        className="max-w-[200px] h-9 rounded-lg text-sm"
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={handleSave} disabled={saving} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
                  {saving ? (<><Loader2 className="h-5 w-5 animate-spin" />Saving…</>) : (<><Download className="h-5 w-5" />Download Filled PDF</>)}
                </Button>
              </>
            )}

            <div className="flex justify-center">
              <Button onClick={reset} variant="outline" className="rounded-xl"><RotateCcw className="mr-2 h-4 w-4" /> Start Over</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PDFFormFiller;
