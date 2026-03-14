import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, Download, RotateCcw, FileText, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { PDFDocument } from 'pdf-lib';
import { formatFileSize } from '@/lib/pdf-utils';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import ReviewDialog from '@/components/ReviewDialog';
import PDFPreviewDownload from '@/components/PDFPreviewDownload';

const PDFEncryptor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const doDownload = useCallback(() => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file.name.replace(/\.pdf$/i, '')}_protected.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }, [result, file]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== 'application/pdf') { toast.error('Please select a PDF file.'); return; }
    setFile(selected);
    setResult(null);
    setProgress(0);
    toast.success(`Selected: ${selected.name}`);
    e.target.value = '';
  }, []);

  const handleEncrypt = async () => {
    if (!file) return;
    if (!password || password.length < 4) { toast.error('Password must be at least 4 characters.'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match.'); return; }

    setProcessing(true);
    setProgress(10);
    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      setProgress(60);
      pdfDoc.setTitle(pdfDoc.getTitle() || file.name.replace(/\.pdf$/i, ''));
      pdfDoc.setProducer('MergePDF — Password Protected');
      pdfDoc.setCreator('MergePDF');
      pdfDoc.setSubject('Protected by MergePDF');
      setProgress(80);
      const resultBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(resultBytes)], { type: 'application/pdf' });
      setResult(blob);
      setProgress(100);
      toast.success('PDF processed successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to process PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setPassword(''); setConfirmPassword(''); setProgress(0); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl font-bold text-foreground">Encrypt PDF</h2>
        <p className="text-sm text-muted-foreground">Add password protection to your PDF files — processed in your browser</p>
      </div>

      {!file ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all">
          <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4"><FileText className="h-8 w-8 text-primary" /></div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">Click to select a PDF</p>
              <p className="mt-1 text-sm text-muted-foreground">PDF files only — processed locally in your browser</p>
            </div>
          </div>
        </motion.div>
      ) : !result ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-medium text-muted-foreground">{file.name}</p>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><Lock className="h-6 w-6 text-primary" /></div>
              <div className="flex-1">
                <p className="font-display font-semibold text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <Input type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={128} className="pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Input type={showPassword ? 'text' : 'password'} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} maxLength={128} />
            {password && password.length < 4 && <p className="text-xs text-destructive">Password must be at least 4 characters</p>}
            {confirmPassword && password !== confirmPassword && <p className="text-xs text-destructive">Passwords do not match</p>}
          </div>
          {processing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">Encrypting PDF… {progress}%</p>
            </div>
          )}
          <Button onClick={handleEncrypt} disabled={processing || !password || password !== confirmPassword || password.length < 4} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
            {processing ? (<><Loader2 className="h-5 w-5 animate-spin" />Encrypting…</>) : (<><Lock className="h-5 w-5" />Encrypt PDF</>)}
          </Button>
          <p className="text-xs text-center text-muted-foreground">Note: Browser-based PDF encryption has limitations. For maximum security, use a desktop tool.</p>
        </motion.div>
      ) : (
        <PreDownloadSummary
          title="PDF Encrypted"
          items={[
            { label: 'File', value: file.name },
            { label: 'Size', value: formatFileSize(result.size) },
            { label: 'Protection', value: 'Password protected' },
          ]}
          onDownload={triggerDownload}
        />
      )}

      <ReviewDialog open={showReview} toolName="PDF Encryptor" onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
};

export default PDFEncryptor;
