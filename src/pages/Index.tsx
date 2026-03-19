import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Combine, Scissors, Minimize2, ArrowRightLeft, RotateCw, Eraser,
  Upload, Cpu, Download, Shield, Zap, Globe, Lock, Layers, FileText,
  ChevronRight, Star, Brain, Languages, Droplets, Trash2, FileOutput,
  Hash, Unlock, Palette, MessageSquare, ChevronLeft, Eye, Recycle,
  Code, Sparkles, PenTool, ScanLine, Type, ImageIcon, FormInput, EyeOff,
  FileSpreadsheet, Presentation, Image, Wrench, BookOpen, Maximize2,
  BookMarked, Camera, GitCompare, FileCode, Search
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';

/* ──────────────────────── data ──────────────────────── */

const toolCategories = [
  {
    labelKey: 'cat.pdftools',
    tools: [
      { icon: Combine, titleKey: 'tool.merge', descKey: 'tool.merge.desc', path: '/merge', color: 'bg-tool-blue/15 text-tool-blue' },
      { icon: Scissors, titleKey: 'tool.split', descKey: 'tool.split.desc', path: '/split', color: 'bg-tool-rose/15 text-tool-rose' },
      { icon: Minimize2, titleKey: 'tool.compress', descKey: 'tool.compress.desc', path: '/compress', color: 'bg-tool-emerald/15 text-tool-emerald' },
      { icon: Palette, titleKey: 'tool.grayscale', descKey: 'tool.grayscale.desc', path: '/grayscale', color: 'bg-tool-cyan/15 text-tool-cyan' },
      { icon: RotateCw, titleKey: 'tool.rotate', descKey: 'tool.rotate.desc', path: '/rotate', color: 'bg-tool-amber/15 text-tool-amber' },
      { icon: Trash2, titleKey: 'tool.deletePages', descKey: 'tool.deletePages.desc', path: '/delete-pages', color: 'bg-tool-rose/15 text-tool-rose' },
      { icon: FileOutput, titleKey: 'tool.extractPages', descKey: 'tool.extractPages.desc', path: '/extract-pages', color: 'bg-tool-pink/15 text-tool-pink' },
      { icon: Droplets, titleKey: 'tool.watermark', descKey: 'tool.watermark.desc', path: '/add-watermark', color: 'bg-tool-teal/15 text-tool-teal' },
      { icon: Lock, titleKey: 'tool.encrypt', descKey: 'tool.encrypt.desc', path: '/encrypt', color: 'bg-tool-indigo/15 text-tool-indigo' },
      { icon: Unlock, titleKey: 'tool.unlock', descKey: 'tool.unlock.desc', path: '/unlock-pdf', color: 'bg-tool-rose/15 text-tool-rose' },
      { icon: Hash, titleKey: 'tool.pageNumbers', descKey: 'tool.pageNumbers.desc', path: '/page-numbers', color: 'bg-tool-amber/15 text-tool-amber' },
      { icon: Layers, titleKey: 'tool.flatten', descKey: 'tool.flatten.desc', path: '/flatten', color: 'bg-tool-teal/15 text-tool-teal' },
      { icon: Layers, titleKey: 'tool.reorder', descKey: 'tool.reorder.desc', path: '/reorder-pages', color: 'bg-tool-violet/15 text-tool-violet' },
      { icon: PenTool, titleKey: 'tool.sign', descKey: 'tool.sign.desc', path: '/pdf-signature', color: 'bg-tool-indigo/15 text-tool-indigo' },
      { icon: Layers, titleKey: 'tool.crop', descKey: 'tool.crop.desc', path: '/crop-pages', color: 'bg-tool-cyan/15 text-tool-cyan' },
      { icon: FileText, titleKey: 'tool.metadata', descKey: 'tool.metadata.desc', path: '/pdf-metadata', color: 'bg-tool-emerald/15 text-tool-emerald' },
      { icon: ImageIcon, titleKey: 'tool.pdfToImages', descKey: 'tool.pdfToImages.desc', path: '/pdf-to-images', color: 'bg-tool-cyan/15 text-tool-cyan' },
      { icon: FormInput, titleKey: 'tool.formFiller', descKey: 'tool.formFiller.desc', path: '/pdf-form-filler', color: 'bg-tool-violet/15 text-tool-violet' },
      { icon: EyeOff, titleKey: 'tool.redact', descKey: 'tool.redact.desc', path: '/pdf-redact', color: 'bg-tool-rose/15 text-tool-rose' },
      { icon: Wrench, titleKey: 'tool.repair', descKey: 'tool.repair.desc', path: '/repair-pdf', color: 'bg-tool-amber/15 text-tool-amber' },
      { icon: BookOpen, titleKey: 'tool.bookmarks', descKey: 'tool.bookmarks.desc', path: '/pdf-bookmarks', color: 'bg-tool-violet/15 text-tool-violet' },
      { icon: Maximize2, titleKey: 'tool.pageSize', descKey: 'tool.pageSize.desc', path: '/page-size', color: 'bg-tool-cyan/15 text-tool-cyan' },
    ],
  },
  {
    labelKey: 'cat.converters',
    tools: [
      { icon: ArrowRightLeft, titleKey: 'tool.convert', descKey: 'tool.convert.desc', path: '/convert', color: 'bg-tool-violet/15 text-tool-violet' },
      { icon: ArrowRightLeft, titleKey: 'tool.pdfToWord', descKey: 'tool.pdfToWord.desc', path: '/pdf-to-word', color: 'bg-tool-blue/15 text-tool-blue' },
      { icon: ArrowRightLeft, titleKey: 'tool.wordToPdf', descKey: 'tool.wordToPdf.desc', path: '/word-to-pdf', color: 'bg-tool-indigo/15 text-tool-indigo' },
      { icon: Code, titleKey: 'tool.xmlToPdf', descKey: 'tool.xmlToPdf.desc', path: '/convert', color: 'bg-tool-lime/15 text-tool-lime' },
      { icon: Eraser, titleKey: 'tool.bgRemove', descKey: 'tool.bgRemove.desc', path: '/bg-remover', color: 'bg-tool-cyan/15 text-tool-cyan' },
      { icon: Droplets, titleKey: 'tool.wmRemove', descKey: 'tool.wmRemove.desc', path: '/watermark-remover', color: 'bg-tool-teal/15 text-tool-teal' },
      { icon: ArrowRightLeft, titleKey: 'tool.imageToPdf', descKey: 'tool.imageToPdf.desc', path: '/image-to-pdf', color: 'bg-tool-pink/15 text-tool-pink' },
      
      { icon: ArrowRightLeft, titleKey: 'tool.svgToImage', descKey: 'tool.svgToImage.desc', path: '/svg-to-image', color: 'bg-tool-lime/15 text-tool-lime' },
      { icon: FileSpreadsheet, titleKey: 'tool.excelToPdf', descKey: 'tool.excelToPdf.desc', path: '/excel-to-pdf', color: 'bg-tool-emerald/15 text-tool-emerald' },
      { icon: FileSpreadsheet, titleKey: 'tool.pdfToExcel', descKey: 'tool.pdfToExcel.desc', path: '/pdf-to-excel', color: 'bg-tool-teal/15 text-tool-teal' },
      { icon: Presentation, titleKey: 'tool.pptxToPdf', descKey: 'tool.pptxToPdf.desc', path: '/pptx-to-pdf', color: 'bg-tool-blue/15 text-tool-blue' },
      { icon: Globe, titleKey: 'tool.webpageToPdf', descKey: 'tool.webpageToPdf.desc', path: '/webpage-to-pdf', color: 'bg-tool-indigo/15 text-tool-indigo' },
      { icon: Image, titleKey: 'tool.heicToPdf', descKey: 'tool.heicToPdf.desc', path: '/heic-to-pdf', color: 'bg-tool-rose/15 text-tool-rose' },
      { icon: BookMarked, titleKey: 'tool.epubToPdf', descKey: 'tool.epubToPdf.desc', path: '/epub-to-pdf', color: 'bg-tool-violet/15 text-tool-violet' },
      { icon: Code, titleKey: 'tool.htmlToPdf', descKey: 'tool.htmlToPdf.desc', path: '/html-to-pdf', color: 'bg-tool-lime/15 text-tool-lime' },
      { icon: Shield, titleKey: 'tool.pdfA', descKey: 'tool.pdfA.desc', path: '/pdf-a', color: 'bg-tool-blue/15 text-tool-blue' },
      { icon: Camera, titleKey: 'tool.scanToPdf', descKey: 'tool.scanToPdf.desc', path: '/scan-to-pdf', color: 'bg-tool-amber/15 text-tool-amber' },
      { icon: Layers, titleKey: 'tool.pdfOverlay', descKey: 'tool.pdfOverlay.desc', path: '/pdf-overlay', color: 'bg-tool-indigo/15 text-tool-indigo' },
      { icon: GitCompare, titleKey: 'tool.comparePdf', descKey: 'tool.comparePdf.desc', path: '/compare-pdf', color: 'bg-tool-violet/15 text-tool-violet' },
      { icon: Presentation, titleKey: 'tool.pdfToPpt', descKey: 'tool.pdfToPpt.desc', path: '/pdf-to-powerpoint', color: 'bg-tool-blue/15 text-tool-blue' },
      { icon: FileCode, titleKey: 'tool.markdownToPdf', descKey: 'tool.markdownToPdf.desc', path: '/markdown-to-pdf', color: 'bg-tool-emerald/15 text-tool-emerald' },
    ],
  },
  {
    labelKey: 'cat.aitools',
    tools: [
      { icon: Brain, titleKey: 'tool.aiSummarize', descKey: 'tool.aiSummarize.desc', path: '/ai-summarize', color: 'bg-tool-violet/15 text-tool-violet' },
      { icon: Languages, titleKey: 'tool.aiTranslate', descKey: 'tool.aiTranslate.desc', path: '/ai-translate', color: 'bg-tool-emerald/15 text-tool-emerald' },
      { icon: MessageSquare, titleKey: 'tool.aiQa', descKey: 'tool.aiQa.desc', path: '/ai-qa', color: 'bg-tool-blue/15 text-tool-blue' },
      { icon: Brain, titleKey: 'tool.aiTools', descKey: 'tool.aiTools.desc', path: '/ai-document-tools', color: 'bg-tool-pink/15 text-tool-pink' },
      { icon: Layers, titleKey: 'tool.batch', descKey: 'tool.batch.desc', path: '/batch', color: 'bg-tool-amber/15 text-tool-amber' },
      { icon: ScanLine, titleKey: 'tool.ocr', descKey: 'tool.ocr.desc', path: '/ocr-pdf', color: 'bg-tool-teal/15 text-tool-teal' },
      { icon: Type, titleKey: 'tool.editor', descKey: 'tool.editor.desc', path: '/pdf-editor', color: 'bg-tool-rose/15 text-tool-rose' },
    ],
  },
];

const testimonialKeys = [
  { nameKey: 'testimonial.1.name', roleKey: 'testimonial.1.role', quoteKey: 'testimonial.1.quote', rating: 5 },
  { nameKey: 'testimonial.2.name', roleKey: 'testimonial.2.role', quoteKey: 'testimonial.2.quote', rating: 5 },
  { nameKey: 'testimonial.3.name', roleKey: 'testimonial.3.role', quoteKey: 'testimonial.3.quote', rating: 5 },
  { nameKey: 'testimonial.4.name', roleKey: 'testimonial.4.role', quoteKey: 'testimonial.4.quote', rating: 5 },
  { nameKey: 'testimonial.5.name', roleKey: 'testimonial.5.role', quoteKey: 'testimonial.5.quote', rating: 5 },
  { nameKey: 'testimonial.6.name', roleKey: 'testimonial.6.role', quoteKey: 'testimonial.6.quote', rating: 5 },
  { nameKey: 'testimonial.7.name', roleKey: 'testimonial.7.role', quoteKey: 'testimonial.7.quote', rating: 5 },
  { nameKey: 'testimonial.8.name', roleKey: 'testimonial.8.role', quoteKey: 'testimonial.8.quote', rating: 5 },
];

const faqKeys = [
  { qKey: 'home.faq.q1', aKey: 'home.faq.a1' },
  { qKey: 'home.faq.q2', aKey: 'home.faq.a2' },
  { qKey: 'home.faq.q3', aKey: 'home.faq.a3' },
  { qKey: 'home.faq.q4', aKey: 'home.faq.a4' },
  { qKey: 'home.faq.q5', aKey: 'home.faq.a5' },
  { qKey: 'home.faq.q6', aKey: 'home.faq.a6' },
  { qKey: 'home.faq.q7', aKey: 'home.faq.a7' },
  { qKey: 'home.faq.q8', aKey: 'home.faq.a8' },
];

/* ──────────────────────── hooks ──────────────────────── */

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Number.isInteger(target) ? Math.floor(eased * target) : parseFloat((eased * target).toFixed(1)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return { count, ref };
}

const statsConfig = [
  { labelKey: 'stats.pdfs', value: 2847391, suffix: '+', icon: FileText },
  { labelKey: 'stats.countries', value: 150, suffix: '+', icon: Globe },
  { labelKey: 'stats.rating', value: 4.9, suffix: '★', icon: Star },
  { labelKey: 'stats.uploads', value: 0, suffix: '', icon: Shield },
];

function StatItem({ stat }: { stat: typeof statsConfig[0] }) {
  const { count, ref } = useCountUp(stat.value);
  const { t } = useI18n();
  return (
    <div ref={ref} className="text-center">
      <stat.icon className="mx-auto h-6 w-6 text-primary-foreground/70 mb-2" />
      <div className="text-3xl md:text-4xl font-bold text-primary-foreground">
        {stat.value === 0 ? 'Zero' : count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-sm text-primary-foreground/70 mt-1">{t(stat.labelKey)}</div>
    </div>
  );
}

/* ──────────────────────── page ──────────────────────── */

const Index = () => {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [toolSearch, setToolSearch] = useState('');
  const visibleCount = 3;
  const maxIdx = testimonialKeys.length - visibleCount;
  const next = useCallback(() => setTestimonialIdx(i => Math.min(i + 1, maxIdx)), [maxIdx]);
  const prev = useCallback(() => setTestimonialIdx(i => Math.max(i - 1, 0)), []);
  const { t } = useI18n();

  const trustBadges = [
    { icon: Lock, titleKey: 'badge.noUploads', descKey: 'badge.noUploads.desc' },
    { icon: Shield, titleKey: 'badge.gdpr', descKey: 'badge.gdpr.desc' },
    { icon: Lock, titleKey: 'badge.ssl', descKey: 'badge.ssl.desc' },
    { icon: Eye, titleKey: 'badge.noTracking', descKey: 'badge.noTracking.desc' },
    { icon: Recycle, titleKey: 'badge.autoCleared', descKey: 'badge.autoCleared.desc' },
    { icon: Globe, titleKey: 'badge.openSource', descKey: 'badge.openSource.desc' },
  ];

  const steps = [
    { icon: Upload, title: t('step.upload'), desc: t('step.upload.desc') },
    { icon: Cpu, title: t('step.process'), desc: t('step.process.desc') },
    { icon: Download, title: t('step.download'), desc: t('step.download.desc') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="MergesPDF — The Privacy-First PDF Suite — Free Forever"
        description="Every tool runs in your browser. Merge, split, compress, convert, sign & OCR PDFs — 100% private, no uploads, no sign-up."
        path="/"
      />

      <Header />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-background" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              {t('hero.badge')}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
              {t('hero.title1')}<br />
              <span className="gradient-text">{t('hero.title2')}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="rounded-2xl px-8 text-base font-bold h-14 gradient-bg border-0 shadow-lg hover:shadow-xl transition-shadow">
                <Link to="/merge">
                  {t('hero.cta1')} <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl px-8 text-base h-14 border-border">
                <a href="#tools">{t('hero.cta2')}</a>
              </Button>
            </div>

            {/* Mini trust bar */}
            <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              {[t('trust.private'), t('trust.instant'), t('trust.free'), t('trust.nosignup')].map((txt) => (
                <span key={txt} className="flex items-center gap-1">{txt}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Animated Stats ─── */}
      <section className="gradient-bg py-14">
        <div className="mx-auto max-w-5xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsConfig.map((stat) => (
            <StatItem key={stat.labelKey} stat={stat} />
          ))}
        </div>
      </section>

      {/* ─── Tools Grid ─── */}
      <section id="tools" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">
              {t('tools.title')}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
              {t('tools.subtitle')}
            </p>
          </motion.div>
          {/* Search bar */}
          <div className="mx-auto mt-8 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={toolSearch}
              onChange={(e) => setToolSearch(e.target.value)}
              placeholder={t('tools.search') || 'Search tools...'}
              className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="mt-14 space-y-14">
            {toolCategories.map((category) => {
              const filtered = category.tools.filter(tool => {
                if (!toolSearch.trim()) return true;
                const q = toolSearch.toLowerCase();
                return t(tool.titleKey).toLowerCase().includes(q) || t(tool.descKey).toLowerCase().includes(q);
              });
              if (filtered.length === 0) return null;
              return (
                <div key={category.labelKey}>
                  <h3 className="text-xl font-bold text-foreground mb-6">{t(category.labelKey)}</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {filtered.map((tool, i) => (
                      <motion.div
                        key={tool.titleKey}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: i * 0.04 }}
                      >
                        <Link
                          to={tool.path}
                          className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                        >
                          <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${tool.color}`}>
                            <tool.icon className="h-5 w-5" />
                          </div>
                          <h3 className="font-semibold text-foreground">{t(tool.titleKey)}</h3>
                          <p className="mt-1 flex-1 text-sm text-muted-foreground">{t(tool.descKey)}</p>
                          <span className="mt-3 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            {t('tools.trynow')} <ChevronRight className="ml-1 h-4 w-4" />
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="border-t border-border/60 bg-card/50 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">{t('howit.title')}</h2>
          <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
            {t('howit.subtitle')}
          </p>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="mb-2 text-sm font-bold text-primary">{t('howit.step')} {i + 1}</div>
                <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">
            {t('testimonials.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
            {t('testimonials.subtitle')}
          </p>

          <div className="relative mt-12">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300"
                style={{ transform: `translateX(-${testimonialIdx * (100 / visibleCount)}%)` }}
              >
                {testimonialKeys.map((tk, i) => (
                  <div key={i} className="w-full sm:w-1/3 flex-shrink-0 px-3">
                    <div className="rounded-2xl border border-border bg-card p-6 h-full">
                      <div className="flex gap-0.5 mb-3">
                        {Array.from({ length: tk.rating }).map((_, s) => (
                          <Star key={s} className="h-4 w-4 fill-tool-amber text-tool-amber" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">"{t(tk.quoteKey)}"</p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-bg text-sm font-bold text-primary-foreground">
                          {t(tk.nameKey).charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{t(tk.nameKey)}</p>
                          <p className="text-xs text-muted-foreground">{t(tk.roleKey)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              <button onClick={prev} disabled={testimonialIdx === 0} className="p-2 rounded-xl border border-border bg-card hover:bg-secondary disabled:opacity-30 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={next} disabled={testimonialIdx >= maxIdx} className="p-2 rounded-xl border border-border bg-card hover:bg-secondary disabled:opacity-30 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Badges ─── */}
      <section className="border-t border-border/60 bg-card/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">
            {t('security.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
            {t('security.subtitle')}
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trustBadges.map((badge) => (
              <div key={badge.titleKey} className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent">
                  <badge.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t(badge.titleKey)}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{t(badge.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">
            {t('faq.title')}
          </h2>
          <div className="mt-12 space-y-3">
            {faqKeys.map((faq) => (
              <details key={faq.qKey} className="group rounded-2xl border border-border bg-card">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-foreground">
                  {t(faq.qKey)}
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{t(faq.aKey)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-90" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
            {t('cta.title')}
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            {t('cta.subtitle')}
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 rounded-2xl px-8 text-base font-bold h-14">
            <Link to="/merge">
              {t('cta.button')} <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
