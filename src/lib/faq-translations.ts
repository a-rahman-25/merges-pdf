import { languages, type Lang } from './translations';
import enFaqTranslations from './i18n/faq-translations/en.json';
import arFaqTranslations from './i18n/faq-translations/ar.json';

export interface FaqItem {
  q: string;
  a: string;
}

export type FaqTranslationMap = Record<string, FaqItem[]>;

const en = enFaqTranslations as FaqTranslationMap;
const ar = arFaqTranslations as FaqTranslationMap;

// English and Arabic are eager; other locales are registered on demand.
export const faqTranslations = Object.fromEntries(
  languages.map(({ code }) => [code, code === 'ar' ? ar : en]),
) as Record<Lang, FaqTranslationMap>;

export function registerFaqTranslations(values: Partial<Record<Lang, FaqTranslationMap>>) {
  for (const { code } of languages) {
    if (values[code]) faqTranslations[code] = values[code];
  }
}

export function getTranslatedFaqs(toolId: string, lang: string): FaqItem[] {
  return faqTranslations[lang as Lang]?.[toolId] || faqTranslations.en[toolId] || [];
}
