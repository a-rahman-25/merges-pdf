import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Lang, languages, translations } from '@/lib/translations';
import { loadLanguageResources } from '@/lib/i18n/load-language';

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be inside I18nProvider');
  return ctx;
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    // /ar/... URLs always start in Arabic (they are the indexable Arabic pages)
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p === '/ar' || p.startsWith('/ar/')) return 'ar';
    }
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved && languages.some(({ code }) => code === saved)) return saved;
    const browserLang = navigator.language;
    // Match browser language to supported languages
    for (const l of languages) {
      if (browserLang.startsWith(l.code)) return l.code;
    }
    return 'en';
  });
  const [resourceVersion, setResourceVersion] = useState(0);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  }, []);

  const dir = languages.find(l => l.code === lang)?.dir || 'ltr';

  useEffect(() => {
    let active = true;
    loadLanguageResources(lang)
      .then(() => {
        if (active) setResourceVersion(version => version + 1);
      })
      .catch(() => {
        // English fallback stays visible; a later language selection retries the chunk.
      });
    return () => {
      active = false;
    };
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }, [lang, dir]);

  const t = useCallback((key: string): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
  }, [lang, resourceVersion]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
};
