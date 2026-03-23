import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Upload, Cpu, Download, Shield, Zap, Globe, Lock, FileText,
  ChevronRight, Star, ChevronLeft, Eye, Recycle,
  Sparkles, Search, Heart,
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';
import { allTools, categories, getFavorites, toggleFavorite, getRecent, addRecent } from '@/lib/tools-data';
import UserSurvey from '@/components/UserSurvey';

/* ──────────────────────── scroll reveal ──────────────────────── */

const revealVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const RevealSection = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={revealVariants}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ──────────────────────── data ──────────────────────── */

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
      <stat.icon className="mx-auto h-6 w-6 text-primary-foreground/70 mb-2" aria-hidden="true" />
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground tabular-nums">
        {stat.value === 0 ? 'Zero' : count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-xs sm:text-sm text-primary-foreground/70 mt-1">{t(stat.labelKey)}</div>
    </div>
  );
}

/* ──────────────────────── page ──────────────────────── */

const Index = () => {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [toolSearch, setToolSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'pdftools' | 'converters' | 'aitools'>('all');
  const [favorites, setFavorites] = useState<string[]>(getFavorites());
  const recent = getRecent();
  const visibleCount = 3;
  const maxIdx = testimonialKeys.length - visibleCount;
  const next = useCallback(() => setTestimonialIdx(i => Math.min(i + 1, maxIdx)), [maxIdx]);
  const prev = useCallback(() => setTestimonialIdx(i => Math.max(i - 1, 0)), []);
  const { t } = useI18n();

  const handleToggleFav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(toggleFavorite(path));
  };

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

  // Filter tools
  const filtered = allTools.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    if (!toolSearch.trim()) return matchesCategory;
    const q = toolSearch.toLowerCase();
    return matchesCategory && (t(tool.titleKey).toLowerCase().includes(q) || t(tool.descKey).toLowerCase().includes(q));
  });

  // Favorite and recent tools for top section
  const favTools = allTools.filter(t => favorites.includes(t.path));
  const recentTools = allTools.filter(t => recent.includes(t.path) && !favorites.includes(t.path)).slice(0, 6);
  const showPersonalized = (favTools.length > 0 || recentTools.length > 0) && !toolSearch.trim() && activeCategory === 'all';

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="MergesPDF — The Privacy-First PDF Suite — Free Forever"
        description="Every tool runs in your browser. Merge, split, compress, convert, sign & OCR PDFs — 100% private, no uploads, no sign-up."
        path="/"
      />

      <a href="#tools" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg">
        Skip to tools
      </a>

      <Header />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-background" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              {t('hero.badge')}
            </motion.div>
            <h1 id="hero-title" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl leading-[1.1]" style={{ textWrap: 'balance' } as React.CSSProperties}>
              {t('hero.title1')}<br />
              <span className="gradient-text">{t('hero.title2')}</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mx-auto mt-5 sm:mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground md:text-xl leading-relaxed"
              style={{ textWrap: 'pretty' } as React.CSSProperties}
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-8 sm:mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <Button asChild size="lg" className="w-full sm:w-auto rounded-2xl px-8 text-base font-bold h-14 gradient-bg border-0 shadow-lg hover:shadow-xl transition-shadow active:scale-[0.97]">
                <Link to="/merge">
                  {t('hero.cta1')} <ChevronRight className="ml-1 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl px-8 text-base h-14 border-border active:scale-[0.97]">
                <a href="#tools">{t('hero.cta2')}</a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground"
            >
              {[t('trust.private'), t('trust.instant'), t('trust.free'), t('trust.nosignup')].map((txt) => (
                <span key={txt} className="flex items-center gap-1">{txt}</span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Inline Survey (top announcement) ─── */}
      <section className="py-6 sm:py-8 bg-accent/30 border-b border-border/60" aria-label="User survey">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <UserSurvey inline />
        </div>
      </section>

      {/* ─── Animated Stats ─── */}
      <section className="gradient-bg py-10 sm:py-14" aria-label="Statistics">
        <RevealSection>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {statsConfig.map((stat) => (
              <StatItem key={stat.labelKey} stat={stat} />
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ─── Tools Grid ─── */}
      <section id="tools" className="py-16 sm:py-20" aria-labelledby="tools-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <RevealSection>
            <h2 id="tools-title" className="text-center text-2xl sm:text-3xl font-bold text-foreground md:text-4xl" style={{ textWrap: 'balance' } as React.CSSProperties}>
              {t('tools.title')}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm sm:text-base text-muted-foreground">
              {t('tools.subtitle')}
            </p>
          </RevealSection>

          {/* Search + Category Tabs */}
          <RevealSection delay={0.1}>
            <div className="mt-8 space-y-4">
              <div className="mx-auto max-w-md relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <input
                  type="search"
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  placeholder={t('tools.search') || 'Search tools... (⌘K)'}
                  aria-label="Search tools"
                  className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Category Tabs */}
              <div className="flex justify-center overflow-x-auto scrollbar-hide">
                <div className="inline-flex rounded-xl border border-border bg-card p-1 gap-1" role="tablist" aria-label="Tool categories">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      role="tab"
                      aria-selected={activeCategory === cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap active:scale-[0.96] ${
                        activeCategory === cat.id
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      {t(cat.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Favorites & Recent */}
          {showPersonalized && (
            <RevealSection delay={0.15} className="mt-10 space-y-8">
              {favTools.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Star className="h-4 w-4 fill-tool-amber text-tool-amber" aria-hidden="true" /> {t('tools.favorites') || 'Your Favorites'}
                  </h3>
                  <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                    {favTools.map(tool => (
                      <ToolCard key={tool.path} tool={tool} isFav={true} onToggleFav={handleToggleFav} t={t} />
                    ))}
                  </div>
                </div>
              )}
              {recentTools.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" aria-hidden="true" /> {t('tools.recent') || 'Recently Used'}
                  </h3>
                  <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                    {recentTools.map(tool => (
                      <ToolCard key={tool.path} tool={tool} isFav={favorites.includes(tool.path)} onToggleFav={handleToggleFav} t={t} />
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t border-border" />
            </RevealSection>
          )}

          {/* All tools */}
          <div className="mt-10" role="tabpanel">
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              {filtered.map((tool, i) => (
                <RevealSection key={tool.path + tool.titleKey} delay={Math.min(i * 0.025, 0.25)}>
                  <ToolCard tool={tool} isFav={favorites.includes(tool.path)} onToggleFav={handleToggleFav} t={t} />
                </RevealSection>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground" role="status">
                <Search className="mx-auto h-8 w-8 mb-3 text-muted-foreground/50" aria-hidden="true" />
                <p>{t('tools.noResults') || 'No tools found. Try a different search.'}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="border-t border-border/60 bg-card/50 py-16 sm:py-20" aria-labelledby="howit-title">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <RevealSection>
            <h2 id="howit-title" className="text-center text-2xl sm:text-3xl font-bold text-foreground md:text-4xl">{t('howit.title')}</h2>
            <p className="mx-auto mt-3 max-w-md text-center text-sm sm:text-base text-muted-foreground">
              {t('howit.subtitle')}
            </p>
          </RevealSection>
          <div className="mt-10 sm:mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <RevealSection key={step.title} delay={i * 0.1}>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-accent">
                    <step.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" aria-hidden="true" />
                  </div>
                  <div className="mb-2 text-sm font-bold text-primary">{t('howit.step')} {i + 1}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-16 sm:py-20" aria-labelledby="testimonials-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <RevealSection>
            <h2 id="testimonials-title" className="text-center text-2xl sm:text-3xl font-bold text-foreground md:text-4xl">
              {t('testimonials.title')}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-sm sm:text-base text-muted-foreground">
              {t('testimonials.subtitle')}
            </p>
          </RevealSection>

          <RevealSection delay={0.15}>
            <div className="relative mt-10 sm:mt-12">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: `translateX(-${testimonialIdx * (100 / visibleCount)}%)` }}
                >
                  {testimonialKeys.map((tk, i) => (
                    <div key={i} className="w-full sm:w-1/3 flex-shrink-0 px-2 sm:px-3">
                      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 h-full">
                        <div className="flex gap-0.5 mb-3" aria-label={`${tk.rating} out of 5 stars`}>
                          {Array.from({ length: tk.rating }).map((_, s) => (
                            <Star key={s} className="h-4 w-4 fill-tool-amber text-tool-amber" aria-hidden="true" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">"{t(tk.quoteKey)}"</p>
                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-bg text-sm font-bold text-primary-foreground" aria-hidden="true">
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
                <button
                  onClick={prev}
                  disabled={testimonialIdx === 0}
                  aria-label="Previous testimonials"
                  className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary disabled:opacity-30 transition-colors active:scale-[0.95]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  disabled={testimonialIdx >= maxIdx}
                  aria-label="Next testimonials"
                  className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary disabled:opacity-30 transition-colors active:scale-[0.95]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>


      {/* ─── Trust Badges ─── */}
      <section className="border-t border-border/60 bg-card/50 py-16 sm:py-20" aria-labelledby="security-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <RevealSection>
            <h2 id="security-title" className="text-center text-2xl sm:text-3xl font-bold text-foreground md:text-4xl">
              {t('security.title')}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-sm sm:text-base text-muted-foreground">
              {t('security.subtitle')}
            </p>
          </RevealSection>
          <div className="mt-10 sm:mt-12 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trustBadges.map((badge, i) => (
              <RevealSection key={badge.titleKey} delay={i * 0.06}>
                <div className="flex gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5 transition-shadow hover:shadow-md hover:shadow-primary/5">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-accent">
                    <badge.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">{t(badge.titleKey)}</h3>
                    <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">{t(badge.descKey)}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 sm:py-20" aria-labelledby="faq-title">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <RevealSection>
            <h2 id="faq-title" className="text-center text-2xl sm:text-3xl font-bold text-foreground md:text-4xl">
              {t('faq.title')}
            </h2>
          </RevealSection>
          <div className="mt-10 sm:mt-12 space-y-3">
            {faqKeys.map((faq, i) => (
              <RevealSection key={faq.qKey} delay={i * 0.04}>
                <details className="group rounded-2xl border border-border bg-card">
                  <summary className="flex cursor-pointer items-center justify-between p-4 sm:p-5 font-semibold text-sm sm:text-base text-foreground select-none">
                    {t(faq.qKey)}
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-90" aria-hidden="true" />
                  </summary>
                  <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">{t(faq.aKey)}</p>
                </details>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <RevealSection>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-90" />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground md:text-4xl" style={{ textWrap: 'balance' } as React.CSSProperties}>
              {t('cta.title')}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-primary-foreground/80">
              {t('cta.subtitle')}
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8 rounded-2xl px-8 text-base font-bold h-14 active:scale-[0.97]">
              <Link to="/merge">
                {t('cta.button')} <ChevronRight className="ml-1 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </RevealSection>

      <Footer />
    </div>
  );
};

/* ──────────────────── Tool Card ──────────────────── */

interface ToolCardProps {
  tool: typeof allTools[0];
  isFav: boolean;
  onToggleFav: (path: string, e: React.MouseEvent) => void;
  t: (key: string) => string;
}

const ToolCard = ({ tool, isFav, onToggleFav, t }: ToolCardProps) => (
  <Link
    to={tool.path}
    onClick={() => addRecent(tool.path)}
    className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-4 sm:p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.97]"
    aria-label={`${t(tool.titleKey)} — ${t(tool.descKey)}`}
  >
    <button
      onClick={(e) => onToggleFav(tool.path, e)}
      className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-1.5 rounded-lg opacity-100 sm:opacity-0 group-hover:opacity-100 hover:bg-accent transition-all active:scale-[0.9]"
      aria-label={isFav ? `Remove ${t(tool.titleKey)} from favorites` : `Add ${t(tool.titleKey)} to favorites`}
    >
      <Heart className={`h-4 w-4 ${isFav ? 'fill-tool-rose text-tool-rose' : 'text-muted-foreground'}`} />
    </button>
    <div className={`mb-3 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl ${tool.color}`}>
      <tool.icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
    </div>
    <h3 className="font-semibold text-foreground text-sm sm:text-base">{t(tool.titleKey)}</h3>
    <p className="mt-1 flex-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">{t(tool.descKey)}</p>
    <span className="mt-2 sm:mt-3 inline-flex items-center text-xs sm:text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
      {t('tools.trynow')} <ChevronRight className="ml-1 h-4 w-4" />
    </span>
  </Link>
);

export default Index;
