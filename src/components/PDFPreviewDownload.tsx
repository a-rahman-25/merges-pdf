import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, Pencil, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatFileSize } from '@/lib/pdf-utils';

interface PDFPreviewDownloadProps {
  pdfData: Uint8Array;
  defaultFilename: string;
  onDownload: (filename: string) => void;
  downloading?: boolean;
  summaryItems?: { label: string; value: string }[];
}

const PDFPreviewDownload = ({ pdfData, defaultFilename, onDownload, downloading, summaryItems }: PDFPreviewDownloadProps) => {
  const [filename, setFilename] = useState(defaultFilename);
  const [editing, setEditing] = useState(false);

  useEffect(() => { setFilename(defaultFilename); }, [defaultFilename]);

  const blobUrl = useMemo(() => {
    const blob = new Blob([pdfData.buffer as ArrayBuffer], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }, [pdfData]);

  useEffect(() => {
    return () => URL.revokeObjectURL(blobUrl);
  }, [blobUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* PDF Preview */}
      <div className="relative bg-muted/30">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
          <Eye className="h-4 w-4 text-primary" />
          <span className="text-sm font-display font-semibold text-foreground">Preview</span>
          <span className="text-xs text-muted-foreground ml-auto">{formatFileSize(pdfData.byteLength)}</span>
        </div>
        <iframe
          src={`${blobUrl}#toolbar=0&navpanes=0`}
          className="w-full h-[400px] md:h-[500px] border-0"
          title="PDF Preview"
        />
      </div>

      {/* Summary + Rename + Download */}
      <div className="p-5 space-y-4">
        {summaryItems && summaryItems.length > 0 && (
          <div className="space-y-1.5">
            {summaryItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-accent/50 px-3 py-2">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-xs font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Rename */}
        <div className="flex items-center gap-2">
          {editing ? (
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
              autoFocus
              className="rounded-xl text-sm"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors group"
            >
              <Pencil className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
              <span className="truncate max-w-[300px]">{filename}</span>
            </button>
          )}
        </div>

        <Button
          onClick={() => onDownload(filename.endsWith('.pdf') ? filename : filename + '.pdf')}
          disabled={downloading}
          size="lg"
          className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl"
        >
          {downloading ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Preparing…</>
          ) : (
            <><Download className="h-5 w-5" /> Download</>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default PDFPreviewDownload;
