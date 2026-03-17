import { Globe } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { languages } from '@/lib/translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

const LanguageSwitcher = () => {
  const { lang, setLang } = useI18n();
  const current = languages.find(l => l.code === lang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{current?.flag}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <ScrollArea className="h-80">
          {languages.map((l) => (
            <DropdownMenuItem
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`cursor-pointer gap-2 ${lang === l.code ? 'bg-accent font-semibold' : ''}`}
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.label}</span>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
