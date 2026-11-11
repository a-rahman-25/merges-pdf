import { languages, type Lang } from './translations';
import enToolTranslations from './i18n/tool-translations/en.json';
import arToolTranslations from './i18n/tool-translations/ar.json';

export type ToolTranslationMap = Record<string, string>;

const en = enToolTranslations as ToolTranslationMap;
const ar = arToolTranslations as ToolTranslationMap;

// English and Arabic are eager; every other language is registered by its lazy
// locale chunk and falls back to English until then.
export const toolTranslations = Object.fromEntries(
  languages.map(({ code }) => [code, code === 'ar' ? ar : en]),
) as Record<Lang, ToolTranslationMap>;

export function registerToolTranslations(values: Partial<Record<Lang, ToolTranslationMap>>) {
  for (const { code } of languages) {
    if (values[code]) toolTranslations[code] = values[code];
  }
}

// Helper to get tool translation with fallback to English
export function tt(key: string, lang: string): string {
  return toolTranslations[lang as Lang]?.[key] || toolTranslations.en[key] || key;
}
