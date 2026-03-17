import { Link, useLocation } from 'react-router-dom';
import { Combine, Menu, ChevronDown, FileText, ArrowRightLeft, Brain, Code } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';

const toolGroups = [
  {
    labelKey: 'cat.pdftools',
    icon: FileText,
    items: [
      { to: '/merge', label: 'Merge PDFs' },
      { to: '/split', label: 'Split PDFs' },
      { to: '/compress', label: 'Compress PDF' },
      { to: '/rotate', label: 'Rotate Pages' },
      { to: '/delete-pages', label: 'Delete Pages' },
      { to: '/reorder-pages', label: 'Reorder Pages' },
      { to: '/add-watermark', label: 'Add Watermark' },
      { to: '/encrypt', label: 'Encrypt PDF' },
      { to: '/pdf-signature', label: 'Sign PDF' },
    ],
  },
  {
    labelKey: 'cat.converters',
    icon: ArrowRightLeft,
    items: [
      { to: '/convert', label: 'Convert Files' },
      { to: '/pdf-to-word', label: 'PDF to Word' },
      { to: '/word-to-pdf', label: 'Word to PDF' },
      { to: '/image-to-pdf', label: 'Image to PDF' },
      { to: '/merge-images', label: 'Merge Images' },
      { to: '/bg-remover', label: 'Remove Background' },
      { to: '/svg-to-image', label: 'SVG to Image' },
    ],
  },
];

const Header = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/blog', label: t('nav.blog') },
  ];

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg">
            <Combine className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">MergesPDF</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.slice(0, 1).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                isActive(link.to)
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                {t('nav.tools')} <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto p-4" align="start">
              <div className="flex gap-6">
                {toolGroups.map((group) => (
                  <div key={group.labelKey} className="min-w-[160px]">
                    <DropdownMenuLabel className="flex items-center gap-2 px-0 mb-1">
                      <group.icon className="h-3.5 w-3.5" />
                      {t(group.labelKey)}
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                      {group.items.map((item) => (
                        <DropdownMenuItem key={item.to} asChild>
                          <Link to={item.to} className="cursor-pointer">{item.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.slice(1).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                isActive(link.to)
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-2 flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button asChild size="sm" className="rounded-xl gradient-bg border-0 font-semibold">
              <Link to="/ai-document-tools" className="flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5" /> ✨ AI Tools
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Open menu">
                <Menu className="h-5 w-5 text-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.to)
                        ? 'bg-accent text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-2 border-t border-border pt-2">
                  {toolGroups.map((group) => (
                    <div key={group.labelKey} className="mt-3">
                      <p className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t(group.labelKey)}</p>
                      {group.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
