import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Download, Loader2, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/pdf-utils';

interface SummaryItem {
  label: string;
  value: string;
}

interface PreDownloadSummaryProps {
  title: string;
  items: SummaryItem[];
  aiSummary?: string;
  aiLoading?: boolean;
  onDownload: () => void;
  downloading?: boolean;
}

const PreDownloadSummary = ({ title, items, aiSummary, aiLoading, onDownload, downloading }: PreDownloadSummaryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6 space-y-5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">Review before downloading</p>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-accent/50 px-4 py-2.5">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>

      {/* AI Summary */}
      {(aiLoading || aiSummary) && (
        <div className="rounded-xl border border-border bg-background p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-display font-semibold text-foreground">AI Review</span>
          </div>
          {aiLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Analyzing your output…
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
          )}
        </div>
      )}

      <Button
        onClick={onDownload}
        disabled={downloading}
        size="lg"
        className="w-full gap-2 text-base font-display font-semibold h-14 rounded-xl"
      >
        {downloading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Preparing…
          </>
        ) : (
          <>
            <Download className="h-5 w-5" />
            Confirm & Download
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default PreDownloadSummary;
