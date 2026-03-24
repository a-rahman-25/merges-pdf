import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Loader2, Download, RotateCcw, FileText, Combine, Minimize2, GripVertical, Archive } from 'lucide-react';
import { toast } from 'sonner';
import JSZip from 'jszip';
import DropZone from '@/components/DropZone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PDFFileItem, getPageCount, mergePDFs, compressPDF, downloadBlob, formatFileSize } from '@/lib/pdf-utils';

type BatchMode = 'merge' | 'compress';

const BatchProcessor = () => {
  const [files, setFiles] = useState<PDFFileItem[]>([]);
  const [mode, setMode] = useState<BatchMode>('merge');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [done, setDone] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const addFiles = useCallback(async (newFiles: File[]) => {
    const items: PDFFileItem[] = [];
    for (const file of newFiles) {
      let pageCount: number | null = null;
      try { pageCount = await getPageCount(file); } catch {}
      items.push({ id: crypto.randomUUID(), file, name: file.name, size: file.size, pageCount });
    }
    setFiles(prev => [...prev, ...items]);
    setDone(false);
    toast.success(`Added ${items.length} file${items.length > 1 ? 's' : ''}`);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setDone(false);
  }, []);

  // Drag-to-reorder handlers
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
    setFiles(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    setDragIdx(null);
    setDragOverIdx(null);
  };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

  const handleProcess = async () => {
    if (files.length < 1) return;
    setProcessing(true);
    setProgress(0);
    try {
      if (mode === 'merge') {
        if (files.length < 2) { toast.error('Need at least 2 files to merge'); setProcessing(false); return; }
        setCurrentFile('Merging all files...');
        const result = await mergePDFs(files.map(f => f.file));
        downloadBlob(result, 'batch_merged.pdf');
        setProgress(100);
        toast.success('Batch merge complete!');
      } else {
        // Compress all and bundle into ZIP
        const zip = new JSZip();
        for (let i = 0; i < files.length; i++) {
          setCurrentFile(`Compressing: ${files[i].name}`);
          setProgress(Math.round(((i) / files.length) * 100));
          const result = await compressPDF(files[i].file);
          const baseName = files[i].name.replace(/\.pdf$/i, '');
          zip.file(`${baseName}_compressed.pdf`, result);
        }
        setCurrentFile('Creating ZIP archive...');
        setProgress(95);
        const zipBlob = await zip.generateAsync({ type: 'uint8array' });
        downloadBlob(zipBlob, 'batch_compressed.zip');
        setProgress(100);
        toast.success(`Compressed ${files.length} files into ZIP!`);
      }
      setDone(true);
    } catch (err) {
      toast.error('Batch processing failed. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
      setCurrentFile('');
    }
  };

  const reset = () => { setFiles([]); setDone(false); setProgress(0); };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Mode selector */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-border bg-card p-0.5 gap-0.5">
          <button
            onClick={() => { setMode('merge'); setDone(false); }}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all ${mode === 'merge' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Combine className="h-4 w-4" /> Batch Merge
          </button>
          <button
            onClick={() => { setMode('compress'); setDone(false); }}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all ${mode === 'compress' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Minimize2 className="h-4 w-4" /> Batch Compress
          </button>
        </div>
      </div>

      <DropZone onFiles={addFiles} disabled={processing} />

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-muted-foreground">
                {files.length} file{files.length !== 1 ? 's' : ''} · {formatFileSize(files.reduce((s, f) => s + f.size, 0))} total
              </p>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Clear all
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {files.map((item, idx) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={() => handleDrop(idx)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 rounded-xl bg-card p-3 pr-4 border transition-all cursor-grab active:cursor-grabbing ${
                    dragOverIdx === idx ? 'border-primary bg-primary/5' : 'border-border'
                  } ${dragIdx === idx ? 'opacity-50' : ''}`}
                >
                  <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(item.size)}
                      {item.pageCount ? ` · ${item.pageCount} pages` : ''}
                    </p>
                  </div>
                  <button onClick={() => removeFile(item.id)} className="text-xs text-muted-foreground hover:text-destructive">✕</button>
                </div>
              ))}
            </div>

            {processing && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">{currentFile} ({progress}%)</p>
              </div>
            )}

            {!done && (
              <Button onClick={handleProcess} disabled={processing || (mode === 'merge' && files.length < 2)} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
                {processing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" />Processing…</>
                ) : (
                  <>
                    {mode === 'merge' ? <Layers className="h-5 w-5" /> : <Archive className="h-5 w-5" />}
                    {mode === 'merge' ? 'Merge All' : 'Compress All → ZIP'}
                  </>
                )}
              </Button>
            )}

            {done && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-accent/50 p-4 border border-border text-center">
                <p className="text-sm font-medium text-foreground">
                  ✓ Batch processing complete — {mode === 'compress' ? 'ZIP archive' : 'file'} downloaded
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BatchProcessor;
