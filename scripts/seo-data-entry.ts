// Build-time data entry for scripts/prerender.mjs.
// Bundled with esbuild at build time so the prerender script can reuse the
// exact same translations, FAQs and tool metadata the app renders with.
export { translations, languages } from '../src/lib/translations';
export { tt } from '../src/lib/tool-translations';
export { getTranslatedFaqs } from '../src/lib/faq-translations';
export { allTools } from '../src/lib/tools-data';
export { aiTools } from '../src/lib/ai-tools-config';
export { landingPages } from '../src/pages/SEOLanding';
export { blogArticles } from '../src/pages/Blog';
