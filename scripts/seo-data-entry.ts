// Build-time data entry for scripts/prerender.mjs.
// Bundled with esbuild at build time so the prerender script can reuse the
// exact same translations, FAQs and tool metadata the app renders with.
import { languages, registerTranslations, translations } from '../src/lib/translations';
import { registerToolTranslations, tt } from '../src/lib/tool-translations';
import { getTranslatedFaqs, registerFaqTranslations } from '../src/lib/faq-translations';
import { allFaqTranslations, allToolTranslations, allTranslations } from '../src/lib/i18n/all-locales';

// Prerendering needs every locale synchronously, unlike the browser app.
registerTranslations(allTranslations);
registerToolTranslations(allToolTranslations);
registerFaqTranslations(allFaqTranslations);

export { translations, languages, tt, getTranslatedFaqs };
export { allTools } from '../src/lib/tools-data';
export { aiTools } from '../src/lib/ai-tools-config';
export { landingPages } from '../src/pages/SEOLanding';
export { blogArticles } from '../src/pages/Blog';
