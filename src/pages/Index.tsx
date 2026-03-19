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

          {/* Search + Category Tabs */}
          <div className="mt-8 space-y-4">
            <div className="mx-auto max-w-md relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                placeholder={t('tools.search') || 'Search tools... (⌘K)'}
                className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-xl border border-border bg-card p-1 gap-1">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
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

          {/* Favorites & Recent */}
          {showPersonalized && (
            <div className="mt-10 space-y-8">
              {favTools.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Star className="h-4 w-4 fill-tool-amber text-tool-amber" /> {t('tools.favorites') || 'Your Favorites'}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {favTools.map(tool => (
                      <ToolCard key={tool.path} tool={tool} isFav={true} onToggleFav={handleToggleFav} t={t} />
                    ))}
                  </div>
                </div>
              )}
              {recentTools.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" /> {t('tools.recent') || 'Recently Used'}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {recentTools.map(tool => (
                      <ToolCard key={tool.path} tool={tool} isFav={favorites.includes(tool.path)} onToggleFav={handleToggleFav} t={t} />
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t border-border" />
            </div>
          )}

          {/* All tools */}
          <div className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((tool, i) => (
                <motion.div
                  key={tool.path + tool.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                >
                  <ToolCard tool={tool} isFav={favorites.includes(tool.path)} onToggleFav={handleToggleFav} t={t} />
                </motion.div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="mx-auto h-8 w-8 mb-3 text-muted-foreground/50" />
                <p>{t('tools.noResults') || 'No tools found. Try a different search.'}</p>
              </div>
            )}
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
    className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
  >
    <button
      onClick={(e) => onToggleFav(tool.path, e)}
      className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-accent transition-all"
      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`h-4 w-4 ${isFav ? 'fill-tool-rose text-tool-rose' : 'text-muted-foreground'}`} />
    </button>
    <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${tool.color}`}>
      <tool.icon className="h-5 w-5" />
    </div>
    <h3 className="font-semibold text-foreground">{t(tool.titleKey)}</h3>
    <p className="mt-1 flex-1 text-sm text-muted-foreground">{t(tool.descKey)}</p>
    <span className="mt-3 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
      {t('tools.trynow')} <ChevronRight className="ml-1 h-4 w-4" />
    </span>
  </Link>
);

export default Index;
