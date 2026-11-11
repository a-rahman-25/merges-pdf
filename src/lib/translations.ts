import enTranslations from './i18n/translations/en.json';
import arTranslations from './i18n/translations/ar.json';

export type Lang =
  | 'en' | 'ar' | 'pt-BR' | 'es' | 'ur' | 'hi' | 'fr' | 'de' | 'zh'
  | 'ja' | 'ko' | 'tr' | 'ru' | 'it' | 'nl' | 'id' | 'th' | 'vi' | 'bn' | 'sw';

export interface LangMeta {
  code: Lang;
  label: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const languages: LangMeta[] = [
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'ur', label: 'اردو', flag: '🇵🇰', dir: 'rtl' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
  { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'zh', label: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', label: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', label: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
  { code: 'th', label: 'ไทย', flag: '🇹🇭', dir: 'ltr' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr' },
  { code: 'sw', label: 'Kiswahili', flag: '🇰🇪', dir: 'ltr' },
];

export type TranslationMap = Record<string, string>;

const en = enTranslations as TranslationMap;
const ar = arTranslations as TranslationMap;

// English and Arabic are the indexable locales, so they stay in the initial
// bundle. Other entries start as English fallbacks until their locale chunk loads.
export const translations = Object.fromEntries(
  languages.map(({ code }) => [code, code === 'ar' ? ar : en]),
) as Record<Lang, TranslationMap>;

export const isCoreLanguage = (lang: Lang) => lang === 'en' || lang === 'ar';

export function registerTranslations(values: Partial<Record<Lang, TranslationMap>>) {
  for (const { code } of languages) {
    if (values[code]) translations[code] = values[code];
  }
}
