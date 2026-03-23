import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';

const shortcuts = [
  { keys: ['⌘', 'K'], desc: 'Open command palette' },
  { keys: ['⌘', 'Shift', 'K'], desc: 'Keyboard shortcuts' },
  { keys: ['⌘', 'D'], desc: 'Toggle dark mode' },
  { keys: ['Esc'], desc: 'Close dialogs & overlays' },
  { keys: ['↑', '↓'], desc: 'Navigate lists' },
  { keys: ['Enter'], desc: 'Confirm selection' },
];

const KeyboardShortcuts = () => {
  const [open, setOpen] = useState(false);

  const handler = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setOpen(o => !o);
    }
    if (e.key === 'Escape') setOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed left-1/2 top-[20%] z-[101] w-full max-w-sm -translate-x-1/2 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            <h2 className="font-display font-bold text-foreground">Keyboard Shortcuts</h2>
          </div>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          {shortcuts.map((s) => (
            <div key={s.desc} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{s.desc}</span>
              <div className="flex items-center gap-1">
                {s.keys.map(k => (
                  <kbd key={k} className="inline-flex min-w-[24px] items-center justify-center rounded-md border border-border bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground text-center">
          Press <kbd className="rounded border border-border px-1 mx-0.5">⌘</kbd><kbd className="rounded border border-border px-1 mx-0.5">⇧</kbd><kbd className="rounded border border-border px-1 mx-0.5">K</kbd> to toggle
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default KeyboardShortcuts;
