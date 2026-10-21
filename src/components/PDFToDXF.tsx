import { useState, useRef, useCallback } from 'react';
import { DraftingCompass, Loader2, RotateCcw, Download } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { formatFileSize } from '@/lib/pdf-utils';
import { pdfToDxf, type DxfResult } from '@/lib/pdf-to-dxf';

const PDFToDXF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [includeText, setIncludeText] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<DxfResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) { toast.error('Please select a PDF file.'); return; }
    setFile(f); setResult(null);
  }, []);

  const convert = async () => {
    if (!file) return;
    setProcessing(true); setProgress(0);
    try {
      const r = await pdfToDxf(file, { includeText }, setProgress);
      if (r.lines === 0 && r.texts === 0) toast.warning('No drawing lines found. This PDF may be a scanned image.');
      setResult(r);
    } catch (e) {
      console.error(e); toast.error('Conversion failed. The PDF may be damaged or protected.');
    } finally { setProcessing(false); }
  };

  const download = () => {
    if (!result || !file) return;
    saveAs(new Blob([result.dxf], { type: 'application/dxf' }), file.name.replace(/\.pdf$/i, '') + '.dxf');
    toast.success('Downloaded!');
  };

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={onFile} />
      {!file ? (
        <button onClick={() => inputRef.current?.click()} className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card p-12 transition-colors hover:border-primary">
          <DraftingCompass className="h-10 w-10 text-primary" />
          <span className="font-medium text-foreground">Select a PDF drawing</span>
          <span className="text-sm text-muted-foreground">Works best with drawings exported from CAD programs</span>
        </button>
      ) : (
        <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={reset} aria-label="Start over"><RotateCcw className="h-4 w-4" /></Button>
          </div>
          <label className="flex items-center justify-between gap-3 text-sm text-foreground">
            Include text labels
            <Switch checked={includeText} onCheckedChange={setIncludeText} />
          </label>
          {!result ? (
            <Button className="w-full" onClick={convert} disabled={processing}>
              {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Converting… {Math.round(progress * 100)}%</> : 'Convert to DXF'}
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {result.pages} page(s) · {result.lines.toLocaleString()} lines · {result.texts.toLocaleString()} text labels
              </p>
              <Button className="w-full" onClick={download}><Download className="mr-2 h-4 w-4" />Download DXF</Button>
            </div>
          )}
        </div>
      )}
      <p className="text-center text-xs text-muted-foreground">Processed in your browser. Your file is never uploaded. Opens in AutoCAD, LibreCAD, DraftSight and more.</p>
    </div>
  );
};

export default PDFToDXF;
