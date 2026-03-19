import { Link, useLocation } from 'react-router-dom';
import { Combine, Menu, ChevronDown, FileText, ArrowRightLeft, Brain, Scissors, Minimize2, RotateCw, Droplets, Lock, PenTool, ArrowLeftRight, Image, Eraser, Code, ImageIcon, FormInput, EyeOff, Layers, BookOpen, Camera, Shield, Wrench, Bookmark, Ruler, FileSpreadsheet, FileOutput, Table2 } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';

const toolGroups = [
  {
    labelKey: 'cat.pdftools',
    icon: FileText,
    description: 'Edit, organize & secure your PDFs',
    items: [
      { to: '/merge', label: 'Merge PDFs', icon: Combine },
      { to: '/split', label: 'Split PDFs', icon: Scissors },
      { to: '/compress', label: 'Compress PDF', icon: Minimize2 },
      { to: '/rotate', label: 'Rotate Pages', icon: RotateCw },
      { to: '/delete-pages', label: 'Delete Pages', icon: FileText },
      { to: '/reorder-pages', label: 'Reorder Pages', icon: ArrowLeftRight },
      { to: '/add-watermark', label: 'Add Watermark', icon: Droplets },
      { to: '/encrypt', label: 'Encrypt PDF', icon: Lock },
      { to: '/pdf-signature', label: 'Sign PDF', icon: PenTool },
      { to: '/pdf-to-images', label: 'PDF to Images', icon: ImageIcon },
      { to: '/pdf-form-filler', label: 'Fill Forms', icon: FormInput },
      { to: '/pdf-redact', label: 'Redact PDF', icon: EyeOff },
      { to: '/pdf-overlay', label: 'PDF Overlay', icon: Layers },
      { to: '/pdf-bookmarks', label: 'Bookmarks', icon: Bookmark },
      { to: '/repair-pdf', label: 'Repair PDF', icon: Wrench },
      { to: '/page-size', label: 'Page Size', icon: Ruler },
    ],
  },
  {
    labelKey: 'cat.converters',
    icon: ArrowRightLeft,
    description: 'Convert between file formats',
    items: [
      { to: '/convert', label: 'Convert Files', icon: ArrowRightLeft },
      { to: '/pdf-to-word', label: 'PDF to Word', icon: FileText },
      { to: '/word-to-pdf', label: 'Word to PDF', icon: FileText },
      { to: '/pdf-to-excel', label: 'PDF to Excel', icon: Table2 },
      { to: '/excel-to-pdf', label: 'Excel to PDF', icon: FileSpreadsheet },
      { to: '/powerpoint-to-pdf', label: 'PowerPoint to PDF', icon: FileOutput },
      { to: '/image-to-pdf', label: 'Image to PDF', icon: Image },
      { to: '/epub-to-pdf', label: 'EPUB to PDF', icon: BookOpen },
      { to: '/scan-to-pdf', label: 'Scan to PDF', icon: Camera },
      { to: '/pdf-a', label: 'PDF/A Converter', icon: Shield },
      { to: '/heic-to-pdf', label: 'HEIC to PDF', icon: ImageIcon },
      { to: '/merge-images', label: 'Merge Images', icon: Combine },
      { to: '/bg-remover', label: 'Remove Background', icon: Eraser },
      { to: '/svg-to-image', label: 'SVG to Image', icon: Code },
      { to: '/html-to-pdf', label: 'HTML to PDF', icon: Code },
      { to: '/compare-pdf', label: 'Compare PDFs', icon: ArrowLeftRight },
      { to: '/pdf-to-powerpoint', label: 'PDF to PowerPoint', icon: FileOutput },
      { to: '/markdown-to-pdf', label: 'Markdown to PDF', icon: Code },
    ],
  },
];

const Header = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/blog', label: t('nav.blog') },
  ];

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  // Close on click outside
  useEffect(() => {
    if (!toolsOpen) return;
    const handler = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [toolsOpen]);

  // Close on route change
  useEffect(() => { setToolsOpen(false); }, [pathname]);

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

          {/* Custom mega menu */}
          <div ref={toolsRef} className="relative">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className={`flex items-center gap-1 text-sm px-3 py-2 rounded-lg transition-colors ${
                toolsOpen
                  ? 'text-primary bg-secondary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {t('nav.tools')} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[640px] max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-xl shadow-black/10 p-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="flex">
                  {toolGroups.map((group) => (
                    <div key={group.labelKey} className="flex-1 p-3">
                      {/* Group header */}
                      <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                          <group.icon className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground tracking-wide">{t(group.labelKey)}</p>
                          <p className="text-[10px] text-muted-foreground leading-tight">{group.description}</p>
                        </div>
                      </div>
                      {/* Items */}
                      <div className="space-y-0.5">
                        {group.items.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setToolsOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                              isActive(item.to)
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                            }`}
                          >
                            <item.icon className="h-3.5 w-3.5 shrink-0" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Footer: AI Tools promo */}
                <div className="mx-3 mb-2 mt-1 rounded-xl bg-gradient-to-r from-primary/10 to-accent/50 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                      <Brain className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">AI-Powered Tools</p>
                      <p className="text-[10px] text-muted-foreground">Summarize, translate, Q&A with AI</p>
                    </div>
                  </div>
                  <Link
                    to="/ai-document-tools"
                    onClick={() => setToolsOpen(false)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            )}
          </div>

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
            <SheetContent side="right" className="w-72 pt-12 overflow-y-auto">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-1 pb-6">
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
                          className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <item.icon className="h-3.5 w-3.5" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
                {/* AI Tools mobile */}
                <Link
                  to="/ai-document-tools"
                  onClick={() => setOpen(false)}
                  className="mx-4 mt-4 flex items-center justify-center gap-2 rounded-xl gradient-bg px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  <Brain className="h-4 w-4" /> ✨ AI Tools
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
