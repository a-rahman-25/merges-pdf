import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Loader2, RotateCcw, FileText, Image as ImageIcon, Code } from 'lucide-react';
import { toast } from 'sonner';
import { trackToolUsage, trackFileProcess } from '@/lib/analytics';
import { addHistory } from '@/lib/processing-history';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PreDownloadSummary from '@/components/PreDownloadSummary';
import ReviewDialog from '@/components/ReviewDialog';
import { useReviewBeforeDownload } from '@/hooks/useReviewBeforeDownload';
import { downloadBlob, SUPPORT_EMAIL, formatFileSize } from '@/lib/pdf-utils';
import { imagesToPDF, pdfToImages, convertImage } from '@/lib/converter-utils';
import { xmlToPDF, xmlToWord } from '@/lib/xml-utils';
import { supabase } from '@/integrations/supabase/client';

type ConvertMode = 'images-to-pdf' | 'pdf-to-images' | 'image-convert' | 'xml-convert';

const modes: { id: ConvertMode; label: string; accept: string; desc: string; icon: typeof FileText }[] = [
  { id: 'images-to-pdf', label: 'Images → PDF', accept: 'image/*', desc: 'Convert images to a PDF document', icon: ImageIcon },
  { id: 'pdf-to-images', label: 'PDF → Images', accept: '.pdf', desc: 'Extract PDF pages as PNG images', icon: FileText },
  { id: 'image-convert', label: 'Image Convert', accept: 'image/*', desc: 'Convert between PNG, JPG, WEBP', icon: ImageIcon },
  { id: 'xml-convert', label: 'XML → PDF/Word', accept: '.xml', desc: 'Convert XML files to PDF or Word document', icon: Code },
];

const outputFormats = ['png', 'jpeg', 'webp'] as const;
const xmlOutputFormats = ['pdf', 'word'] as const;

interface ConvertResult {
  blobs: { blob: Blob; filename: string }[];
  summaryItems: { label: string; value: string }[];
}

const FileConverter = () => {
  const [mode, setMode] = useState<ConvertMode>('images-to-pdf');
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [xmlFormat, setXmlFormat] = useState<'pdf' | 'word'>('pdf');
  const [outputName, setOutputName] = useState('');
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentMode = modes.find((m) => m.id === mode)!;

  const doDownload = useCallback(() => {
    if (!result) return;
    for (const { blob, filename } of result.blobs) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }
    toast.success('Downloaded!');
  }, [result]);

  const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(doDownload);

  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length) {
      setFiles(selected);
      const baseName = selected[0].name.replace(/\.[^.]+$/, '');
      setOutputName(baseName);
      setResult(null);
      setAiSummary('');
      toast.success(`Selected ${selected.length} file${selected.length > 1 ? 's' : ''}`);
    }
    e.target.value = '';
  }, []);

  const fetchAiSummary = async (description: string) => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-summarize', {
        body: { text: description, filename: 'conversion', pageCount: 1 },
      });
      if (error) throw error;
      setAiSummary(data.summary || 'Conversion completed successfully.');
    } catch {
      setAiSummary('✅ Conversion completed successfully. Your files are ready to download.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!files.length) return;
    setConverting(true);
    setResult(null);
    setAiSummary('');
    const name = outputName.trim() || 'converted';
    try {
      const blobs: { blob: Blob; filename: string }[] = [];
      const summaryItems: { label: string; value: string }[] = [];

      if (mode === 'images-to-pdf') {
        const data = await imagesToPDF(files);
        const pdfBlob = new Blob([new Uint8Array(data)], { type: 'application/pdf' });
        blobs.push({ blob: pdfBlob, filename: `${name}.pdf` });
        summaryItems.push(
          { label: 'Input files', value: `${files.length} images` },
          { label: 'Output', value: `${name}.pdf` },
          { label: 'Output size', value: formatFileSize(pdfBlob.size) },
        );
        trackToolUsage('file_converter', 'images_to_pdf', { file_count: files.length });
        trackFileProcess('file_converter', files.length);
        fetchAiSummary(`Converted ${files.length} images (${files.map(f => f.name).join(', ')}) into a single PDF document "${name}.pdf" (${formatFileSize(pdfBlob.size)}).`);
      } else if (mode === 'pdf-to-images') {
        const images = await pdfToImages(files[0]);
        for (let i = 0; i < images.length; i++) {
          const resp = await fetch(images[i]);
          const blob = await resp.blob();
          blobs.push({ blob, filename: `${name}_page_${i + 1}.png` });
        }
        summaryItems.push(
          { label: 'Input', value: files[0].name },
          { label: 'Pages extracted', value: `${images.length}` },
          { label: 'Output format', value: 'PNG' },
        );
        trackToolUsage('file_converter', 'pdf_to_images', { page_count: images.length });
        fetchAiSummary(`Extracted ${images.length} pages from "${files[0].name}" as PNG images.`);
      } else if (mode === 'image-convert') {
        for (const file of files) {
          const blob = await convertImage(file, outputFormat);
          const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
          const fn = files.length === 1 ? `${name}.${ext}` : `${file.name.replace(/\.[^.]+$/, '')}.${ext}`;
          blobs.push({ blob, filename: fn });
        }
        summaryItems.push(
          { label: 'Files converted', value: `${files.length}` },
          { label: 'Output format', value: outputFormat.toUpperCase() },
        );
        trackToolUsage('file_converter', 'image_convert', { file_count: files.length, format: outputFormat });
        fetchAiSummary(`Converted ${files.length} image(s) to ${outputFormat.toUpperCase()} format.`);
      } else if (mode === 'xml-convert') {
        if (xmlFormat === 'pdf') {
          const data = await xmlToPDF(files[0]);
          const xmlPdfBlob = new Blob([new Uint8Array(data)], { type: 'application/pdf' });
          blobs.push({ blob: xmlPdfBlob, filename: `${name}.pdf` });
          summaryItems.push(
            { label: 'Input', value: files[0].name },
            { label: 'Output', value: `${name}.pdf` },
            { label: 'Output size', value: formatFileSize(xmlPdfBlob.size) },
          );
          trackToolUsage('file_converter', 'xml_to_pdf');
        } else {
          const blob = await xmlToWord(files[0]);
          blobs.push({ blob, filename: `${name}.doc` });
          summaryItems.push(
            { label: 'Input', value: files[0].name },
            { label: 'Output', value: `${name}.doc` },
            { label: 'Output size', value: formatFileSize(blob.size) },
          );
          trackToolUsage('file_converter', 'xml_to_word');
        }
        fetchAiSummary(`Converted XML file "${files[0].name}" to ${xmlFormat === 'pdf' ? 'PDF' : 'Word'} format.`);
      }

      setResult({ blobs, summaryItems });
      const totalSize = blobs.reduce((s, b) => s + b.blob.size, 0);
      addHistory({ toolName: 'File Converter', toolPath: '/convert', fileName: files.map(f => f.name).join(', '), outputName: blobs[0]?.filename || 'converted', fileSize: totalSize });
      (await import('@/lib/analytics')).logToolUsage('File Converter', '/convert', files.length);
      toast.success('Conversion complete! Review below before downloading.');
    } catch (err) {
      toast.error(`Conversion failed. Contact ${SUPPORT_EMAIL} for help.`);
      console.error(err);
    } finally {
      setConverting(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setOutputName('');
    setResult(null);
    setAiSummary('');
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Mode selector */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl border border-border bg-card p-1 gap-1 overflow-x-auto max-w-full scrollbar-hide">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); reset(); }}
              className={`rounded-lg px-4 py-2 text-sm font-display font-semibold transition-all whitespace-nowrap ${
                mode === m.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">{currentMode.desc}</p>

      {/* File picker */}
      {files.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-all"
        >
          <input ref={inputRef} type="file" accept={currentMode.accept} multiple={mode !== 'pdf-to-images' && mode !== 'xml-convert'} onChange={handleFiles} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4">
              <currentMode.icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">Click to select files</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === 'pdf-to-images' ? 'Select a PDF file' : mode === 'xml-convert' ? 'Select an XML file' : 'Select one or more images'}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-medium text-muted-foreground">{files.length} file{files.length !== 1 ? 's' : ''} selected</p>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-card p-3 border border-border">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <FileText className="h-4 w-4 text-accent-foreground" />
                </div>
                <p className="min-w-0 flex-1 truncate text-sm text-foreground">{f.name}</p>
              </div>
            ))}
          </div>

          {/* Output format selectors */}
          {mode === 'image-convert' && !result && (
            <div className="flex items-center gap-3 px-1">
              <span className="text-sm text-muted-foreground">Output:</span>
              <div className="inline-flex rounded-lg border border-border bg-card p-0.5 gap-0.5">
                {outputFormats.map((fmt) => (
                  <button key={fmt} onClick={() => setOutputFormat(fmt)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${outputFormat === fmt ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    {fmt === 'jpeg' ? 'JPG' : fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'xml-convert' && !result && (
            <div className="flex items-center gap-3 px-1">
              <span className="text-sm text-muted-foreground">Convert to:</span>
              <div className="inline-flex rounded-lg border border-border bg-card p-0.5 gap-0.5">
                {xmlOutputFormats.map((fmt) => (
                  <button key={fmt} onClick={() => setXmlFormat(fmt)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${xmlFormat === fmt ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    {fmt === 'word' ? 'WORD' : 'PDF'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rename output file */}
          {!result && (
            <div className="flex items-center gap-3 px-1">
              <span className="text-sm text-muted-foreground whitespace-nowrap">File name:</span>
              <Input value={outputName} onChange={(e) => setOutputName(e.target.value)} placeholder="Output file name" className="text-sm" />
            </div>
          )}

          {!result && (
            <motion.div layout className="pt-2">
              <Button onClick={handleConvert} disabled={converting} size="lg" className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl">
                {converting ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Converting…</>
                ) : (
                  <><ArrowRightLeft className="h-5 w-5" /> Convert</>
                )}
              </Button>
            </motion.div>
          )}

          {result && (
            <PreDownloadSummary
              title="Conversion Complete"
              items={result.summaryItems}
              aiSummary={aiSummary}
              aiLoading={aiLoading}
              onDownload={triggerDownload}
            />
          )}
        </motion.div>
      )}

      <ReviewDialog
        open={showReview}
        toolName="File Converter"
        onSubmit={handleSubmit}
        onSkip={handleSkip}
      />
    </div>
  );
};

export default FileConverter;
