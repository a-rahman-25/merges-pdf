import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Clock, Command } from 'lucide-react';
import { allTools, getFavorites, getRecent, addRecent } from '@/lib/tools-data';
import { useI18n } from '@/hooks/useI18n';

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const navigate = useNavigate();
  const { t } = useI18n();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
        setQuery('');
        setSelectedIdx(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const favorites = getFavorites();
  const recent = getRecent();

  const filtered = query.trim()
    ? allTools.filter(tool => {
        const q = query.toLowerCase();
        return t(tool.titleKey).toLowerCase().includes(q) || t(tool.descKey).toLowerCase().includes(q);
      })
    : [];

  // Show favorites + recent when no query
  const favTools = allTools.filter(t => favorites.includes(t.path));
  const recentTools = allTools.filter(t => recent.includes(t.path) && !favorites.includes(t.path));

  const displayItems = query.trim() ? filtered : [...favTools, ...recentTools];
  const showSections = !query.trim() && (favTools.length > 0 || recentTools.length > 0);

  const goTo = useCallback((path: string) => {
    addRecent(path);
    navigate(path);
    setOpen(false);
    setQuery('');
  }, [navigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, displayItems.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && displayItems[selectedIdx]) { goTo(displayItems[selectedIdx].path); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, displayItems, selectedIdx, goTo]);

  useEffect(() => { setSelectedIdx(0); }, [query]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Dialog */}
      <div className="fixed left-1/2 top-[15%] z-[101] w-full max-w-lg -translate-x-1/2 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {displayItems.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {query.trim() ? 'No tools found.' : (
                <div className="space-y-2">
                  <Command className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p>Type to search tools, or press ⌘K anytime.</p>
                </div>
              )}
            </div>
          )}

          {showSections && favTools.length > 0 && (
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Star className="h-3 w-3" /> Favorites
            </div>
          )}

          {displayItems.map((tool, i) => {
            const isFavSection = !query.trim() && i === favTools.length && recentTools.length > 0;
            return (
              <div key={tool.path + i}>
                {isFavSection && (
                  <div className="px-2 py-1.5 mt-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Recent
                  </div>
                )}
                <button
                  onClick={() => goTo(tool.path)}
                  onMouseEnter={() => setSelectedIdx(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    i === selectedIdx ? 'bg-accent text-foreground' : 'text-foreground hover:bg-accent/50'
                  }`}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tool.color}`}>
                    <tool.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t(tool.titleKey)}</p>
                    <p className="truncate text-xs text-muted-foreground">{t(tool.descKey)}</p>
                  </div>
                  {favorites.includes(tool.path) && <Star className="h-3.5 w-3.5 shrink-0 fill-tool-amber text-tool-amber" />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><kbd className="rounded border border-border px-1">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="rounded border border-border px-1">↵</kbd> open</span>
          <span className="flex items-center gap-1"><kbd className="rounded border border-border px-1">esc</kbd> close</span>
        </div>
      </div>
    </>
  );
};

export default CommandPalette;
