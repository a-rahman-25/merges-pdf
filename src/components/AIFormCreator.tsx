import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FileInput, Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { streamAI } from '@/lib/stream-ai';

const formTypes = [
  'Registration Form', 'Application Form', 'Survey / Questionnaire',
  'Feedback Form', 'Order Form', 'Contact Form',
  'Medical / Health Form', 'Employment Form', 'Consent Form',
  'Invoice / Receipt', 'Inspection Checklist', 'Custom',
];

const AIFormCreator = () => {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [formType, setFormType] = useState('Registration Form');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    if (!description.trim()) { toast.error('Please describe your form'); return; }
    setProcessing(true);
    setResult('');
    try {
      let accumulated = '';
      await streamAI({
        functionName: 'ai-form-creator',
        body: { description: description.trim(), formType },
        onDelta: (chunk) => { accumulated += chunk; setResult(accumulated); },
        onDone: () => toast.success('Form design complete!'),
      });
    } catch (err: any) {
      if (err?.status === 429) toast.error('Rate limited — please wait.');
      else if (err?.status === 402) toast.error('AI credits depleted.');
      else toast.error(err?.message || 'Failed to create form.');
    } finally { setProcessing(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => { setResult(''); setDescription(''); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!result && !processing ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Form Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {formTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFormType(type)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    formType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Describe your form</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., A conference registration form with name, email, company, dietary preferences, session selection (morning/afternoon), and t-shirt size..."
              className="w-full rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-32"
            />
          </div>

          <Button onClick={handleCreate} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl" disabled={!description.trim()}>
            <FileInput className="h-5 w-5" /> Design Form with AI
          </Button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-foreground">Form Design: {formType}</h3>
              <div className="flex items-center gap-2">
                {result && !processing && (
                  <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
            {processing && !result && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> Designing form...
              </div>
            )}
            {result && (
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            )}
            {processing && result && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary mt-2" />}
          </div>
          {!processing && (
            <div className="flex gap-2">
              <Button onClick={reset} variant="outline" size="lg" className="flex-1 gap-2 rounded-xl">
                <FileInput className="h-5 w-5" /> Create Another
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AIFormCreator;
