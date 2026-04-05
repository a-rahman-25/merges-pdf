import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, Loader2, RotateCcw, FileText, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/pdf-utils';
import { PDFDocument } from 'pdf-lib';
import { extractPdfText } from '@/lib/pdf-text-extract';
import { streamAI } from '@/lib/stream-ai';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const AIPDFChat = () => {
  const [file, setFile] = useState<{ file: File; name: string; size: number; pageCount: number; text: string } | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Please upload a PDF'); return; }
    setExtracting(true);
    try {
      const buffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = pdf.getPageCount();
      const text = await extractPdfText(f, 15000);
      setFile({ file: f, name: f.name, size: f.size, pageCount, text });
      setMessages([]);
      toast.success('Document loaded — start chatting!');
    } catch { toast.error('Could not read this PDF'); }
    setExtracting(false);
    e.target.value = '';
  }, []);

  const sendMessage = async () => {
    if (!file || !input.trim() || streaming) return;
    const userMsg = input.trim();
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMsg }];
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setStreaming(true);

    try {
      let accumulated = '';
      await streamAI({
        functionName: 'ai-pdf-chat',
        body: {
          filename: file.name,
          pageCount: file.pageCount,
          textContent: file.text,
          question: userMsg,
          history: newMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
        },
        onDelta: (chunk) => {
          accumulated += chunk;
          setMessages([...newMessages, { role: 'assistant', content: accumulated }]);
        },
        onDone: () => {},
      });
      setMessages([...newMessages, { role: 'assistant', content: accumulated }]);
    } catch (err: any) {
      if (err?.status === 429) toast.error('Rate limited — please wait.');
      else if (err?.status === 402) toast.error('AI credits depleted.');
      else toast.error(err?.message || 'Failed to get response.');
      setMessages(newMessages);
    } finally { setStreaming(false); }
  };

  const reset = () => { setFile(null); setMessages([]); setInput(''); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {!file ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => !extracting && fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all"
        >
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4">
              {extracting ? <Loader2 className="h-8 w-8 text-primary animate-spin" /> : <MessageCircle className="h-8 w-8 text-primary" />}
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">
                {extracting ? 'Reading document...' : 'Upload a PDF to chat with'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Ask questions, get insights, have a conversation about your document</p>
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
              <RotateCcw className="h-3.5 w-3.5" /> New chat
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Ask anything about "{file.name}"
                </p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    )}
                    {streaming && i === messages.length - 1 && msg.role === 'assistant' && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin mt-1 inline-block" />
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-border p-3 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask a question..."
                disabled={streaming}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || streaming}
                size="sm"
                className="rounded-lg gap-1.5"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIPDFChat;
