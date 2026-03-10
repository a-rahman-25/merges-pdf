import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Loader2, RotateCcw, FileText, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatFileSize } from '@/lib/pdf-utils';
import { PDFDocument } from 'pdf-lib';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIQandA = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Please select a PDF file.'); return; }
    try {
      const buffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setFile({ file: f, name: f.name, size: f.size, pageCount: pdf.getPageCount() });
      setMessages([]);
      toast.success(`Selected: ${f.name}`);
    } catch { toast.error('Could not read PDF file.'); }
    e.target.value = '';
  }, []);

  const handleAsk = async () => {
    if (!file || !question.trim()) return;
    const userMsg: Message = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-qa', {
        body: {
          filename: file.name,
          pageCount: file.pageCount,
          question: userMsg.content,
          history: messages.slice(-6),
        },
      });
      if (error) throw error;
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer || 'No answer generated.' }]);
    } catch (err: any) {
      console.error(err);
      if (err?.message?.includes('429')) toast.error('Rate limited — please wait.');
      else if (err?.message?.includes('402')) toast.error('AI credits depleted.');
      else toast.error('Failed to get answer.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setMessages([]); setQuestion(''); };

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
            <div className="rounded-xl bg-primary/10 p-4"><MessageSquare className="h-8 w-8 text-primary" /></div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">Upload a PDF to ask questions</p>
              <p className="mt-1 text-sm text-muted-foreground">AI will answer questions about your document</p>
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

          {/* Chat messages */}
          {messages.length > 0 && (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {messages.map((msg, i) => (
                <div key={i} className={`rounded-xl p-4 ${msg.role === 'user' ? 'bg-primary/10 ml-8' : 'bg-card border border-border mr-8'}`}>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{msg.role === 'user' ? 'You' : 'AI'}</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
              {loading && (
                <div className="bg-card border border-border rounded-xl p-4 mr-8">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">AI</p>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              )}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && handleAsk()}
              placeholder="Ask a question about this PDF..."
              disabled={loading}
              className="flex-1"
            />
            <Button onClick={handleAsk} disabled={loading || !question.trim()} size="icon" className="shrink-0 h-10 w-10">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIQandA;
