import { useEffect } from 'react';
import { allTools } from '@/lib/tools-data';
import { translations } from '@/lib/translations';

// Routes with real Arabic content — mirrors scripts/prerender.mjs
const AR_CAPABLE_STATIC = ['/', '/about', '/contact', '/privacy', '/terms', '/blog', '/ai-document-tools', '/batch'];

interface FAQItem {
  q: string;
  a: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  faqs?: FAQItem[];
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = 'https://mergespdf.com';

const OG_IMAGE_MAP: Record<string, string> = {
  '/': '/og/og-default.png',
  '/merge': '/og/og-merge.png',
  '/split': '/og/og-pdf-tools.png',
  '/compress': '/og/og-pdf-tools.png',
  '/rotate': '/og/og-pdf-tools.png',
  '/delete-pages': '/og/og-pdf-tools.png',
  '/extract-pages': '/og/og-pdf-tools.png',
  '/add-watermark': '/og/og-pdf-tools.png',
  '/encrypt': '/og/og-pdf-tools.png',
  '/convert': '/og/og-convert.png',
  '/pdf-to-word': '/og/og-convert.png',
  '/word-to-pdf': '/og/og-convert.png',
  '/bg-remover': '/og/og-convert.png',
  '/watermark-remover': '/og/og-convert.png',
  '/ai-summarize': '/og/og-ai.png',
  '/ai-translate': '/og/og-ai.png',
  '/ai-qa': '/og/og-ai.png',
  '/batch': '/og/og-default.png',
};

const SEOHead = ({ title, description, path, faqs, jsonLd }: SEOHeadProps) => {
  useEffect(() => {
    document.title = title;
    
    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const ogImage = `${BASE_URL}${OG_IMAGE_MAP[path] || '/og/og-default.png'}`;

    setMeta('description', description);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', `${BASE_URL}${path}`, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:image', ogImage, 'property');
    setMeta('og:image:width', '1920', 'property');
    setMeta('og:image:height', '1080', 'property');
    setMeta('twitter:card', 'summary_large_image', 'name');
    setMeta('twitter:title', title, 'name');
    setMeta('twitter:description', description, 'name');
    setMeta('twitter:image', ogImage, 'name');

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${BASE_URL}${path}`;

    // hreflang alternates (en / ar / x-default) for the two indexable locales
    const tool = allTools.find(t => t.path === path);
    const arCapable =
      AR_CAPABLE_STATIC.includes(path) ||
      Boolean(tool && (translations.ar as Record<string, string>)?.[tool.titleKey]);
    const setAlternate = (hreflang: string, href: string) => {
      let el = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`) as HTMLLinkElement;
      if (!el) {
        el = document.createElement('link');
        el.rel = 'alternate';
        el.setAttribute('hreflang', hreflang);
        el.dataset.seoAlternate = 'true';
        document.head.appendChild(el);
      }
      el.href = href;
    };
    setAlternate('en', `${BASE_URL}${path}`);
    setAlternate('x-default', `${BASE_URL}${path}`);
    if (arCapable) setAlternate('ar', `${BASE_URL}/ar${path === '/' ? '' : path}`);
    else document.querySelector('link[rel="alternate"][hreflang="ar"]')?.remove();

    // WebApplication JSON-LD
    const appLdId = 'seo-jsonld-app';
    let appScript = document.getElementById(appLdId) as HTMLScriptElement;
    const appLd = jsonLd || {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: title.split('|')[0]?.trim() || title,
      url: `${BASE_URL}${path}`,
      description,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      provider: { '@type': 'Organization', name: 'MergePDF', url: BASE_URL },
    };
    if (!appScript) {
      appScript = document.createElement('script');
      appScript.id = appLdId;
      appScript.type = 'application/ld+json';
      document.head.appendChild(appScript);
    }
    appScript.textContent = JSON.stringify(appLd);

    // FAQPage JSON-LD
    const faqLdId = 'seo-jsonld-faq';
    let faqScript = document.getElementById(faqLdId) as HTMLScriptElement;
    if (faqs && faqs.length > 0) {
      const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      };
      if (!faqScript) {
        faqScript = document.createElement('script');
        faqScript.id = faqLdId;
        faqScript.type = 'application/ld+json';
        document.head.appendChild(faqScript);
      }
      faqScript.textContent = JSON.stringify(faqLd);
    } else if (faqScript) {
      faqScript.remove();
    }

    return () => {
      document.getElementById(appLdId)?.remove();
      document.getElementById(faqLdId)?.remove();
      document.querySelectorAll('link[data-seo-alternate]').forEach(el => el.remove());
    };
  }, [title, description, path, faqs, jsonLd]);

  return null;
};

export default SEOHead;