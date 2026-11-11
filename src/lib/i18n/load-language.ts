import { isCoreLanguage, registerTranslations, type Lang, type TranslationMap } from '../translations';
import { registerToolTranslations, type ToolTranslationMap } from '../tool-translations';
import { registerFaqTranslations, type FaqTranslationMap } from '../faq-translations';

interface LocaleChunk {
  translations: TranslationMap;
  toolTranslations: ToolTranslationMap;
  faqTranslations: FaqTranslationMap;
}

type LocaleLoader = () => Promise<{ default: LocaleChunk }>;

const localeLoaders: Record<Exclude<Lang, 'en' | 'ar'>, LocaleLoader> = {
  ur: () => import('./locales/ur'),
  hi: () => import('./locales/hi'),
  bn: () => import('./locales/bn'),
  es: () => import('./locales/es'),
  'pt-BR': () => import('./locales/pt-BR'),
  fr: () => import('./locales/fr'),
  de: () => import('./locales/de'),
  it: () => import('./locales/it'),
  nl: () => import('./locales/nl'),
  ru: () => import('./locales/ru'),
  tr: () => import('./locales/tr'),
  zh: () => import('./locales/zh'),
  ja: () => import('./locales/ja'),
  ko: () => import('./locales/ko'),
  id: () => import('./locales/id'),
  th: () => import('./locales/th'),
  vi: () => import('./locales/vi'),
  sw: () => import('./locales/sw'),
};

const pendingLoads = new Map<Lang, Promise<void>>();

export function loadLanguageResources(lang: Lang): Promise<void> {
  if (isCoreLanguage(lang)) return Promise.resolve();

  const cached = pendingLoads.get(lang);
  if (cached) return cached;

  const load = localeLoaders[lang]()
    .then(({ default: locale }) => {
      registerTranslations({ [lang]: locale.translations });
      registerToolTranslations({ [lang]: locale.toolTranslations });
      registerFaqTranslations({ [lang]: locale.faqTranslations });
    })
    .catch((error) => {
      // Allow a later retry if the network hiccups while fetching a locale chunk.
      pendingLoads.delete(lang);
      throw error;
    });

  pendingLoads.set(lang, load);
  return load;
}
