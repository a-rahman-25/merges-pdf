import { useState, useMemo } from 'react';
import { Globe, Check, Search } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { languages } from '@/lib/translations';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const regionGroups = [
  { label: 'Popular', codes: ['en', 'es', 'fr', 'de', 'pt-BR', 'zh', 'ar'] },
  { label: 'Asia', codes: ['hi', 'bn', 'ur', 'zh', 'ja', 'ko', 'id', 'th', 'vi'] },
  { label: 'Europe', codes: ['en', 'fr', 'de', 'es', 'it', 'nl', 'ru', 'tr', 'pt-BR'] },
  { label: 'Africa & Middle East', codes: ['ar', 'sw', 'ur'] },
];

const LanguageSwitcher = () => {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const current = languages.find(l => l.code === lang);

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return languages.filter(l =>
      l.label.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  }, [search]);

  const handleSelect = (code: string) => {
    setLang(code as any);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearch(''); }}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all border border-transparent hover:border-border"
          aria-label="Change language"
        >
          <span className="text-base leading-none">{current?.flag}</span>
          <span className="hidden sm:inline text-xs font-medium">{current?.code.toUpperCase()}</span>
          <Globe className="h-3.5 w-3.5 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0 rounded-xl border-border shadow-xl" sideOffset={8}>
        {/* Search */}
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search languages…"
              className="h-8 pl-8 text-xs rounded-lg border-border bg-secondary/50"
              autoFocus={false}
            />
          </div>
        </div>

        <ScrollArea className="max-h-80">
          <div className="p-1.5">
            {filtered ? (
              /* Search results */
              filtered.length === 0 ? (
                <p className="px-3 py-4 text-center text-xs text-muted-foreground">No languages found</p>
              ) : (
                <div className="space-y-0.5">
                  {filtered.map((l) => (
                    <LangItem key={l.code} lang={l} isActive={lang === l.code} onSelect={handleSelect} />
                  ))}
                </div>
              )
            ) : (
              /* Grouped view */
              regionGroups.map((group) => {
                const groupLangs = group.codes
                  .map(c => languages.find(l => l.code === c))
                  .filter(Boolean)
                  // Deduplicate
                  .filter((l, i, arr) => arr.findIndex(x => x!.code === l!.code) === i) as typeof languages;

                return (
                  <div key={group.label} className="mb-1">
                    <p className="px-2 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                      {group.label}
                    </p>
                    <div className="space-y-0.5">
                      {groupLangs.map((l) => (
                        <LangItem key={`${group.label}-${l.code}`} lang={l} isActive={lang === l.code} onSelect={handleSelect} />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Current selection footer */}
        <div className="border-t border-border px-3 py-2 flex items-center gap-2 bg-secondary/30">
          <span className="text-base">{current?.flag}</span>
          <span className="text-xs font-medium text-foreground">{current?.label}</span>
          <span className="text-[10px] text-muted-foreground ml-auto">{current?.dir === 'rtl' ? 'RTL' : 'LTR'}</span>
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface LangItemProps {
  lang: typeof languages[0];
  isActive: boolean;
  onSelect: (code: string) => void;
}

const LangItem = ({ lang: l, isActive, onSelect }: LangItemProps) => (
  <button
    onClick={() => onSelect(l.code)}
    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all ${
      isActive
        ? 'bg-primary/10 text-primary font-medium'
        : 'text-foreground hover:bg-accent'
    }`}
  >
    <span className="text-lg leading-none w-6 text-center">{l.flag}</span>
    <span className="flex-1 text-left text-xs font-medium">{l.label}</span>
    <span className="text-[10px] text-muted-foreground uppercase">{l.code}</span>
    {isActive && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
  </button>
);

export default LanguageSwitcher;
