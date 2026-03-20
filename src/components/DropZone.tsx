import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp } from 'lucide-react';

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  accept?: string;
  label?: string;
  sublabel?: string;
}

const DropZone = ({ onFiles, disabled, accept = '.pdf', label, sublabel }: DropZoneProps) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const extensions = accept.split(',').map(a => a.trim().toLowerCase());
      const files = Array.from(e.dataTransfer.files).filter(
        (f) => extensions.some(ext => f.name.toLowerCase().endsWith(ext) || ext === '*')
      );
      if (files.length) onFiles(files);
    },
    [onFiles, disabled, accept]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length) onFiles(files);
      e.target.value = '';
    },
    [onFiles]
  );

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={label || 'Drop files here or click to browse'}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed
        p-8 sm:p-12 text-center
        transition-all duration-300 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${dragOver ? 'border-primary bg-accent scale-[1.01]' : 'border-border hover:border-primary/50 hover:bg-accent/50'}
        ${disabled ? 'pointer-events-none opacity-50' : ''}
      `}
      whileHover={{ scale: disabled ? 1 : 1.005 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={dragOver ? 'active' : 'idle'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="flex flex-col items-center gap-3 sm:gap-4"
        >
          <div className="rounded-xl bg-primary/10 p-3 sm:p-4">
            <FileUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <div>
            <p className="text-base sm:text-lg font-display font-semibold text-foreground">
              {dragOver ? (label ? `Drop your files here` : 'Drop your PDFs here') : (label || 'Drag & drop PDFs here')}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              {sublabel || 'or click to browse · multiple files supported'}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default DropZone;
