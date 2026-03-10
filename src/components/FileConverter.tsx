import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Loader2, Download, RotateCcw, FileText, Image as ImageIcon, Code } from 'lucide-react';
import { toast } from 'sonner';
import { trackToolUsage, trackFileProcess } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { downloadBlob, SUPPORT_EMAIL } from '@/lib/pdf-utils';
import { imagesToPDF, pdfToImages, convertImage } from '@/lib/converter-utils';
import { xmlToPDF, xmlToWord } from '@/lib/xml-utils';

type ConvertMode = 'images-to-pdf' | 'pdf-to-images' | 'image-convert' | 'xml-convert';

const modes: { id: ConvertMode; label: string; accept: string; desc: string; icon: typeof FileText }[] = [
  { id: 'images-to-pdf', label: 'Images → PDF', accept: 'image/*', desc: 'Convert images to a PDF document', icon: ImageIcon },
  { id: 'pdf-to-images', label: 'PDF → Images', accept: '.pdf', desc: 'Extract PDF pages as PNG images', icon: FileText },
  { id: 'image-convert', label: 'Image Convert', accept: 'image/*', desc: 'Convert between PNG, JPG, WEBP', icon: ImageIcon },
  { id: 'xml-convert', label: 'XML → PDF/Word', accept: '.xml', desc: 'Convert XML files to PDF or Word document', icon: Code },
];

const outputFormats = ['png', 'jpeg', 'webp'] as const;
const xmlOutputFormats = ['pdf', 'word'] as const;

const FileConverter = () => {
  const [mode, setMode] = useState<ConvertMode>('images-to-pdf');
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [xmlFormat, setXmlFormat] = useState<'pdf' | 'word'>('pdf');
  const [outputName, setOutputName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const currentMode = modes.find((m) => m.id === mode)!;

  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length) {
      setFiles(selected);
      // Set default output name from first file
      const baseName = selected[0].name.replace(/\.[^.]+$/, '');
      setOutputName(baseName);
      toast.success(`Selected ${selected.length} file${selected.length > 1 ? 's' : ''}`);
    }
    e.target.value = '';
  }, []);

  const handleConvert = async () => {
    if (!files.length) return;
    setConverting(true);
    const name = outputName.trim() || 'converted';
    try {
      if (mode === 'images-to-pdf') {
        const data = await imagesToPDF(files);
        downloadBlob(data, `${name}.pdf`);
        trackToolUsage('file_converter', 'images_to_pdf', { file_count: files.length });
        trackFileProcess('file_converter', files.length);
        toast.success('Images converted to PDF!');
      } else if (mode === 'pdf-to-images') {
        const images = await pdfToImages(files[0]);
        images.forEach((img, i) => {
          const link = document.createElement('a');
          link.href = img;
          link.download = `${name}_page_${i + 1}.png`;
          link.click();
        });
        trackToolUsage('file_converter', 'pdf_to_images', { page_count: images.length });
        toast.success(`Extracted ${images.length} pages as images!`);
      } else if (mode === 'image-convert') {
        for (const file of files) {
          const blob = await convertImage(file, outputFormat);
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
          link.download = files.length === 1 ? `${name}.${ext}` : `${file.name.replace(/\.[^.]+$/, '')}.${ext}`;
          link.click();
          URL.revokeObjectURL(url);
        }
        trackToolUsage('file_converter', 'image_convert', { file_count: files.length, format: outputFormat });
        toast.success(`Converted ${files.length} image${files.length > 1 ? 's' : ''}!`);
      } else if (mode === 'xml-convert') {
        if (xmlFormat === 'pdf') {
          const data = await xmlToPDF(files[0]);
          downloadBlob(data, `${name}.pdf`);
          trackToolUsage('file_converter', 'xml_to_pdf');
          toast.success('XML converted to PDF!');
        } else {
          const blob = await xmlToWord(files[0]);
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${name}.doc`;
          link.click();
          URL.revokeObjectURL(url);
          trackToolUsage('file_converter', 'xml_to_word');
          toast.success('XML converted to Word!');
        }
      }
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
              className={`
                rounded-lg px-4 py-2 text-sm font-display font-semibold transition-all whitespace-nowrap
                ${mode === m.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }
              `}
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
          <input
            ref={inputRef}
            type="file"
            accept={currentMode.accept}
            multiple={mode !== 'pdf-to-images' && mode !== 'xml-convert'}
            onChange={handleFiles}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4">
              <currentMode.icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">
                Click to select files
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === 'pdf-to-images' ? 'Select a PDF file' : mode === 'xml-convert' ? 'Select an XML file' : 'Select one or more images'}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-medium text-muted-foreground">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </p>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
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
          {mode === 'image-convert' && (
            <div className="flex items-center gap-3 px-1">
              <span className="text-sm text-muted-foreground">Output:</span>
              <div className="inline-flex rounded-lg border border-border bg-card p-0.5 gap-0.5">
                {outputFormats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`
                      rounded-md px-3 py-1.5 text-xs font-semibold transition-all
                      ${outputFormat === fmt
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    {fmt === 'jpeg' ? 'JPG' : fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'xml-convert' && (
            <div className="flex items-center gap-3 px-1">
              <span className="text-sm text-muted-foreground">Convert to:</span>
              <div className="inline-flex rounded-lg border border-border bg-card p-0.5 gap-0.5">
                {xmlOutputFormats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setXmlFormat(fmt)}
                    className={`
                      rounded-md px-3 py-1.5 text-xs font-semibold transition-all
                      ${xmlFormat === fmt
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    {fmt === 'word' ? 'WORD' : 'PDF'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rename output file */}
          <div className="flex items-center gap-3 px-1">
            <span className="text-sm text-muted-foreground whitespace-nowrap">File name:</span>
            <Input
              value={outputName}
              onChange={(e) => setOutputName(e.target.value)}
              placeholder="Output file name"
              className="text-sm"
            />
          </div>

          <motion.div layout className="pt-2">
            <Button
              onClick={handleConvert}
              disabled={converting}
              size="lg"
              className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl"
            >
              {converting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Converting…
                </>
              ) : (
                <>
                  <ArrowRightLeft className="h-5 w-5" />
                  Convert
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FileConverter;
