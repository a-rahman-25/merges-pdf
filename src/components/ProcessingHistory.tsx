import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Trash2, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHistory, clearHistory, formatTimeAgo, type HistoryItem } from '@/lib/processing-history';

const ProcessingHistory = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (open) setItems(getHistory());
  }, [open]);

  const handleClear = () => {
    clearHistory();
    setItems([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-lg hover:bg-accent transition-colors"
        aria-label="Processing history"
      >
        <History className="h-4 w-4 text-foreground" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed left-0 top-0 z-[101] h-full w-full max-w-sm border-r border-border bg-card shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h2 className="font-display font-bold text-foreground">Processing History</h2>
                </div>
                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button onClick={handleClear} className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
                      <Trash2 className="h-3 w-3" /> Clear
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <History className="h-10 w-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">No history yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Process some files to see them here.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {items.map(item => (
                      <Link
                        key={item.id}
                        to={item.toolPath}
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 rounded-xl border border-border bg-background p-3 hover:border-primary/30 hover:bg-accent/50 transition-all"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{item.fileName}</p>
                          <p className="text-xs text-muted-foreground truncate">→ {item.outputName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground">{item.toolName}</span>
                            <span className="text-[10px] text-muted-foreground">•</span>
                            <span className="text-[10px] text-muted-foreground">{formatSize(item.fileSize)}</span>
                            <span className="text-[10px] text-muted-foreground">•</span>
                            <span className="text-[10px] text-muted-foreground">{formatTimeAgo(item.timestamp)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProcessingHistory;
