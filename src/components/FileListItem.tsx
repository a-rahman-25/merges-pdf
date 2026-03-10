import { motion } from 'framer-motion';
import { GripVertical, X, FileText } from 'lucide-react';
import { PDFFileItem, formatFileSize } from '@/lib/pdf-utils';

interface FileListItemProps {
  item: PDFFileItem;
  index: number;
  onRemove: (id: string) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
}

const FileListItem = ({
  item,
  index,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
}: FileListItemProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25 }}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(index);
      }}
      onDragEnd={onDragEnd}
      className="group flex items-center gap-3 rounded-xl bg-card p-3 pr-4 border border-border hover:border-primary/30 transition-colors cursor-grab active:cursor-grabbing"
    >
      <div className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <FileText className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(item.size)}
          {item.pageCount !== null && ` · ${item.pageCount} page${item.pageCount !== 1 ? 's' : ''}`}
        </p>
      </div>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
        {index + 1}
      </span>
      <button
        onClick={() => onRemove(item.id)}
        className="ml-1 rounded-lg p-1.5 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

export default FileListItem;
