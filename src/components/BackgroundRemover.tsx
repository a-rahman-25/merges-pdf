import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eraser, Loader2, Download, RotateCcw, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { logToolUsage } from '@/lib/analytics';
// Dynamically imported to avoid blocking initial load

const BackgroundRemover = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setProgress(0);
      toast.success(`Selected: ${selected.name}`);
    }
    e.target.value = '';
  }, []);

  const handleRemove = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(10);

    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            setProgress(Math.round((current / total) * 100));
          }
        },
      });

      const url = URL.createObjectURL(blob);
      setResult(url);
      setProgress(100);
      toast.success('Background removed successfully!');
      logToolUsage('Background Remover', '/bg-remover');
    } catch (err) {
      console.error(err);
      toast.error('Background removal failed. Try a different image.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = `${file.name.replace(/\.[^.]+$/, '')}_no_bg.png`;
    link.click();
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl font-bold text-foreground">Remove Background</h2>
        <p className="text-sm text-muted-foreground">
          Remove image backgrounds instantly — 100% in your browser, no uploads
        </p>
      </div>

      {!file ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4">
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">
                Click to select an image
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                PNG, JPG, or WEBP — processed locally
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-medium text-muted-foreground">{file.name}</p>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>

          {/* Image previews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground text-center">Original</p>
              <div className="rounded-xl border border-border bg-card p-2 flex items-center justify-center min-h-[200px]">
                {preview && (
                  <img src={preview} alt="Original" className="max-h-64 rounded-lg object-contain" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground text-center">Result</p>
              <div className="rounded-xl border border-border p-2 flex items-center justify-center min-h-[200px]"
                   style={{ background: 'repeating-conic-gradient(hsl(var(--muted)) 0% 25%, hsl(var(--card)) 0% 50%) 50% / 20px 20px' }}>
                {result ? (
                  <img src={result} alt="Result" className="max-h-64 rounded-lg object-contain" />
                ) : (
                  <p className="text-xs text-muted-foreground">Will appear here</p>
                )}
              </div>
            </div>
          </div>

          {processing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                {progress < 50 ? 'Loading AI model…' : 'Processing image…'} {progress}%
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {!result ? (
              <Button
                onClick={handleRemove}
                disabled={processing}
                size="lg"
                className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Removing…
                  </>
                ) : (
                  <>
                    <Eraser className="h-5 w-5" />
                    Remove Background
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleDownload}
                size="lg"
                className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl"
              >
                <Download className="h-5 w-5" />
                Download PNG
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BackgroundRemover;
