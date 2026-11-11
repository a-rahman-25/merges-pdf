/**
 * Build-time prerender for MergesPDF (runs after `vite build`).
 *
 * Generates a static HTML shell per route (English + Arabic) so crawlers and
 * no-JS visitors receive real content: per-route <title>, meta description,
 * canonical, Open Graph/Twitter tags, hreflang alternates, JSON-LD and a
 * static body (H1, intro, how-to steps, FAQs) that matches what the React
 * app renders. The React app replaces the static body on load (no hydration).
 *
 * No headless browser is used — route metadata is harvested from the source
 * (App.tsx routes, each page's <SEOHead> props, translation files), so this
 * runs anywhere `vite build` runs.
 *
 * Also writes dist/sitemap.xml (and keeps public/sitemap.xml in sync).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const BASE_URL = 'https://mergespdf.com';
const MAX_PRERENDER_PAGES = 400; // hard cap — publish output limits

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const escJson = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

const read = (p) => fs.readFileSync(p, 'utf8');

/** Static routes that have real Arabic UI translations. */
const STATIC_AR = new Set(['/', '/about', '/contact', '/privacy', '/terms', '/blog', '/ai-document-tools', '/batch']);

const AR_SITE_DESC =
  'أدوات PDF مجانية تعمل بالكامل في متصفحك — دمج وتقسيم وضغط وتحويل وتوقيع واستخراج النص. خصوصية كاملة: ملفاتك لا تغادر جهازك أبداً.';

const HOWTO = {
  en: {
    heading: 'How to use this tool',
    steps: [
      ['Add your files', 'Drag & drop your files into the upload area, or click to browse your device.'],
      ['Process in your browser', 'Adjust the settings and start — everything runs locally on your device.'],
      ['Download instantly', 'Review the result and download it. Your files are never uploaded or stored.'],
    ],
    faqHeading: 'Frequently asked questions',
    privacy:
      'MergesPDF processes your files locally in your browser. Your documents never leave your device — no uploads, no accounts, no sign-up required.',
    nav: { tools: 'Tools', blog: 'Blog', about: 'About', contact: 'Contact' },
    langSwitch: 'العربية',
  },
  ar: {
    heading: 'كيفية استخدام هذه الأداة',
    steps: [
      ['أضف ملفاتك', 'اسحب ملفاتك وأفلتها في منطقة التحميل، أو انقر للاختيار من جهازك.'],
      ['عالجها في متصفحك', 'اضبط الإعدادات وابدأ — كل شيء يعمل محلياً على جهازك.'],
      ['نزّل فوراً', 'راجع النتيجة ونزّلها. لا يتم رفع أو تخزين ملفاتك أبداً.'],
    ],
    faqHeading: 'الأسئلة الشائعة',
    privacy:
      'يعالج MergesPDF ملفاتك محلياً في متصفحك. مستنداتك لا تغادر جهازك أبداً — بدون رفع، بدون حسابات، بدون تسجيل.',
    nav: { tools: 'الأدوات', blog: 'المدونة', about: 'من نحن', contact: 'اتصل بنا' },
    langSwitch: 'English',
  },
};

async function main() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.warn('[prerender] dist/index.html not found — skipping.');
    return;
  }

  // ---- 1. Harvest routes from App.tsx -------------------------------------
  const appSrc = read(path.join(ROOT, 'src/App.tsx'));
  const imports = {};
  for (const m of appSrc.matchAll(/const (\w+) = lazy\(\(\) => import\("\.\/pages\/([\w-]+)"\)\)/g)) {
    imports[m[1]] = m[2];
  }
  const routes = [];
  for (const m of appSrc.matchAll(/<Route path="([^"]+)" element=\{<(\w+)/g)) {
    const [, routePath, component] = m;
    if (routePath === '*' || routePath.includes(':')) continue;
    if (routePath === '/admin' || routePath === '/admin-login') continue;
    routes.push({ path: routePath, file: imports[component] });
  }
  console.log(`[prerender] harvested ${routes.length} routes`);

  // ---- 2. Harvest per-page SEOHead props ----------------------------------
  const pageCache = new Map();
  const harvestPage = (file) => {
    if (!file) return {};
    if (pageCache.has(file)) return pageCache.get(file);
    const fp = path.join(ROOT, 'src/pages', `${file}.tsx`);
    if (!fs.existsSync(fp)) return {};
    const src = read(fp);
    const seoBlock = src.match(/<SEOHead([\s\S]*?)\/>/);
    const attr = (name) => seoBlock?.[1].match(new RegExp(`${name}="([^"]+)"`))?.[1];
    const faqId = src.match(/getTranslatedFaqs\('([^']+)'/)?.[1];
    const h1Keys = [...new Set([...src.matchAll(/tt\('(page\.[\w.-]+)', lang\)/g)].map((m) => m[1]))];
    const out = { title: attr('title'), description: attr('description'), faqId, h1Keys };
    pageCache.set(file, out);
    return out;
  };

  // ---- 3. Bundle + import the shared app data ------------------------------
  const outfile = path.join(ROOT, 'node_modules/.cache/seo-data.mjs');
  await esbuild.build({
    entryPoints: [path.join(ROOT, 'scripts/seo-data-entry.ts')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile,
    jsx: 'automatic',
    logLevel: 'warning',
  });
  const { translations, tt, getTranslatedFaqs, allTools, aiTools, landingPages, blogArticles } =
    await import(outfile);

  const t8 = (lang, key) => translations[lang]?.[key] || translations.en[key] || '';
  const hasTr = (lang, key) => Boolean(translations[lang]?.[key]);
  const ttSafe = (key, lang) => {
    const v = tt(key, lang);
    return v && v !== key ? v : '';
  };

  // og:image map — harvested from SEOHead.tsx so there is one source of truth
  const ogMapSrc = read(path.join(ROOT, 'src/components/SEOHead.tsx'));
  const ogMapBlock = ogMapSrc.match(/OG_IMAGE_MAP[^=]*= \{([\s\S]*?)\};/);
  const ogMap = {};
  for (const m of (ogMapBlock?.[1] || '').matchAll(/'([^']+)': '([^']+)'/g)) ogMap[m[1]] = m[2];
  const ogFor = (p) => `${BASE_URL}${ogMap[p] || '/og/og-default.png'}`;

  // ---- 4. Compose per-route, per-language page records ---------------------
  const pages = [];

  for (const route of routes) {
    const harvested = harvestPage(route.file);
    const tool = allTools.find((t) => t.path === route.path);
    const ai = aiTools.find((a) => `/${a.slug}` === route.path);

    const h1aK = harvested.h1Keys?.find((k) => k.endsWith('.h1a'));
    const h1bK = harvested.h1Keys?.find((k) => k.endsWith('.h1b'));
    const subK = harvested.h1Keys?.find((k) => k.endsWith('.sub'));

    const buildLang = (lang) => {
      const h1FromKeys = h1aK ? [ttSafe(h1aK, lang), h1bK ? ttSafe(h1bK, lang) : ''].join(' ').trim() : '';
      const h1 = h1FromKeys || (tool ? t8(lang, tool.titleKey) : ai?.title) || harvested.title || 'MergesPDF';
      const sub =
        (subK && ttSafe(subK, lang)) ||
        (tool ? t8(lang, tool.descKey) : ai?.description) ||
        harvested.description ||
        '';
      const faqs = harvested.faqId ? getTranslatedFaqs(harvested.faqId, lang) : ai?.faqs || [];
      return { h1, sub, faqs };
    };

    // English
    const en = buildLang('en');
    const enTitle =
      harvested.title ||
      (tool && `${t8('en', tool.titleKey)} — Free Online | MergesPDF`) ||
      (ai && `${ai.title} | MergesPDF`) ||
      'MergesPDF — The Privacy-First PDF Suite';
    const enDesc =
      harvested.description ||
      (tool && t8('en', tool.descKey)) ||
      ai?.metaDescription ||
      'Free online PDF tools — merge, split, compress, convert, sign & OCR PDFs. 100% private, no uploads.';
    pages.push({
      urlPath: route.path,
      lang: 'en',
      dir: 'ltr',
      title: enTitle,
      description: enDesc,
      h1: en.h1,
      sub: en.sub,
      faqs: en.faqs,
      arAlternate: STATIC_AR.has(route.path) || (tool && hasTr('ar', tool.titleKey)),
    });

    // Arabic — only when real Arabic content exists for the route
    const arCapable = STATIC_AR.has(route.path) || (tool && hasTr('ar', tool.titleKey) && hasTr('ar', tool.descKey));
    if (arCapable) {
      const ar = buildLang('ar');
      const arTitle = tool
        ? `${t8('ar', tool.titleKey)} | MergesPDF`
        : route.path === '/'
          ? 'MergesPDF — أدوات PDF تحترم خصوصيتك'
          : `${t8('ar', `nav.${route.path.slice(1)}`) || t8('ar', 'nav.tools')} | MergesPDF`;
      pages.push({
        urlPath: route.path === '/' ? '/ar' : `/ar${route.path}`,
        lang: 'ar',
        dir: 'rtl',
        title: arTitle,
        description: tool ? t8('ar', tool.descKey) : AR_SITE_DESC,
        h1: ar.h1,
        sub: ar.sub,
        faqs: ar.faqs,
        arAlternate: true,
      });
    }
  }

  // SEO landing pages (/tools/:slug) — English only, rich content
  for (const lp of landingPages) {
    pages.push({
      urlPath: `/tools/${lp.slug}`,
      lang: 'en',
      dir: 'ltr',
      title: lp.seoTitle,
      description: lp.description,
      h1: `${lp.h1} ${lp.h1Highlight}`,
      sub: lp.subtitle,
      features: lp.features,
      howTo: lp.howTo,
      faqs: lp.faqs,
      arAlternate: false,
    });
  }

  // Blog index + articles — English only
  for (const post of blogArticles) {
    pages.push({
      urlPath: `/blog/${post.slug}`,
      lang: 'en',
      dir: 'ltr',
      title: post.seoTitle,
      description: post.description,
      h1: post.title,
      sub: post.description,
      article: post.content,
      date: post.date,
      arAlternate: false,
    });
  }

  if (pages.length > MAX_PRERENDER_PAGES) {
    console.warn(`[prerender] ${pages.length} pages requested, capped at ${MAX_PRERENDER_PAGES}`);
    pages.length = MAX_PRERENDER_PAGES;
  }

  // ---- 5. Generate shells ---------------------------------------------------
  const template = read(path.join(DIST, 'index.html'));

  const popularTools = allTools.slice(0, 14);
  const staticLinks = [
    ['/blog', 'Blog'],
    ['/about', 'About'],
    ['/contact', 'Contact'],
    ['/privacy', 'Privacy'],
    ['/terms', 'Terms'],
  ];

  const buildBody = (pg) => {
    const L = HOWTO[pg.lang] || HOWTO.en;
    const prefix = pg.lang === 'ar' ? '/ar' : '';
    const altHref = pg.lang === 'ar' ? pg.urlPath.replace(/^\/ar/, '') || '/' : `/ar${pg.urlPath === '/' ? '' : pg.urlPath}`;

    const howToRows = (pg.howTo || L.steps)
      .map((s, i) => {
        const step = Array.isArray(s) ? s[0] : s.step;
        const desc = Array.isArray(s) ? s[1] : s.desc;
        return `<li class="rounded-xl border border-border p-4"><strong>${i + 1}. ${esc(step)}</strong><p class="mt-1 text-sm text-muted-foreground">${esc(desc)}</p></li>`;
      })
      .join('');

    const featuresHtml = pg.features
      ? `<section class="mt-8"><h2 class="text-2xl font-semibold">${pg.lang === 'ar' ? 'المميزات' : 'Features'}</h2><ul class="mt-3 grid gap-2 sm:grid-cols-2">${pg.features
          .map((f) => `<li class="rounded-lg bg-secondary px-3 py-2 text-sm">${esc(f)}</li>`)
          .join('')}</ul></section>`
      : '';

    const articleHtml = pg.article
      ? pg.article
          .map(
            (s) =>
              `<section class="mt-8"><h2 class="text-2xl font-semibold">${esc(s.heading)}</h2>${s.body
                .split('\n\n')
                .map((p) => `<p class="mt-3 leading-7 text-muted-foreground">${esc(p)}</p>`)
                .join('')}</section>`,
          )
          .join('')
      : '';

    const faqHtml =
      pg.faqs && pg.faqs.length
        ? `<section class="mt-10"><h2 class="text-2xl font-semibold">${esc(L.faqHeading)}</h2><div class="mt-4 space-y-4">${pg.faqs
            .map(
              (f) =>
                `<details class="rounded-xl border border-border p-4"><summary class="font-medium">${esc(f.q)}</summary><p class="mt-2 text-sm text-muted-foreground">${esc(f.a)}</p></details>`,
            )
            .join('')}</div></section>`
        : '';

    const toolLinks = popularTools
      .map((t) => `<a class="text-sm text-muted-foreground hover:text-foreground" href="${prefix}${t.path}">${esc(t8(pg.lang, t.titleKey))}</a>`)
      .join('');
    const legalLinks = staticLinks
      .map(([href, label]) => `<a class="text-sm text-muted-foreground hover:text-foreground" href="${prefix}${href}">${esc(label)}</a>`)
      .join('');

    return `<div class="min-h-screen bg-background text-foreground"${pg.dir === 'rtl' ? ' dir="rtl"' : ''}>
<header class="border-b border-border"><div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
<a href="${prefix || '/'}" class="text-xl font-bold text-primary">MergesPDF</a>
<nav class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
<a href="${prefix || '/'}">${esc(L.nav.tools)}</a><a href="${prefix}/blog">${esc(L.nav.blog)}</a><a href="${prefix}/about">${esc(L.nav.about)}</a><a href="${prefix}/contact">${esc(L.nav.contact)}</a>
${pg.arAlternate ? `<a href="${altHref}" class="font-medium text-foreground">${esc(L.langSwitch)}</a>` : ''}
</nav></div></header>
<main class="mx-auto max-w-3xl px-4 py-12">
<h1 class="text-4xl font-bold tracking-tight">${esc(pg.h1)}</h1>
<p class="mt-4 text-lg text-muted-foreground">${esc(pg.sub)}</p>
${articleHtml}
${featuresHtml}
${pg.article ? '' : `<section class="mt-10"><h2 class="text-2xl font-semibold">${esc(L.heading)}</h2><ol class="mt-4 space-y-3">${howToRows}</ol></section>`}
${faqHtml}
<p class="mt-10 rounded-xl bg-secondary p-4 text-sm text-muted-foreground">${esc(L.privacy)}</p>
</main>
<footer class="border-t border-border"><div class="mx-auto max-w-6xl px-4 py-8">
<div class="flex flex-wrap gap-x-5 gap-y-2">${toolLinks}</div>
<div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">${legalLinks}</div>
<p class="mt-4 text-xs text-muted-foreground">© ${new Date().getFullYear()} MergesPDF</p>
</div></footer>
</div>`;
  };

  const buildHead = (pg) => {
    const canonical = `${BASE_URL}${pg.urlPath}`;
    const enUrl = pg.lang === 'ar' ? pg.urlPath.replace(/^\/ar/, '') || '/' : pg.urlPath;
    const arUrl = `/ar${enUrl === '/' ? '' : enUrl}`;
    const tags = [
      `<title>${esc(pg.title)}</title>`,
      `<meta name="description" content="${esc(pg.description)}" />`,
      `<link rel="canonical" href="${canonical}" />`,
      `<meta property="og:title" content="${esc(pg.title)}" />`,
      `<meta property="og:description" content="${esc(pg.description)}" />`,
      `<meta property="og:url" content="${canonical}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:image" content="${ogFor(enUrl)}" />`,
      `<meta property="og:image:width" content="1920" />`,
      `<meta property="og:image:height" content="1080" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${esc(pg.title)}" />`,
      `<meta name="twitter:description" content="${esc(pg.description)}" />`,
      `<meta name="twitter:image" content="${ogFor(enUrl)}" />`,
      `<link rel="alternate" hreflang="en" href="${BASE_URL}${enUrl}" />`,
    ];
    if (pg.arAlternate) tags.push(`<link rel="alternate" hreflang="ar" href="${BASE_URL}${arUrl}" />`);
    tags.push(`<link rel="alternate" hreflang="x-default" href="${BASE_URL}${enUrl}" />`);

    const jsonLd = [];
    if (pg.article) {
      jsonLd.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: pg.h1,
        description: pg.description,
        author: { '@type': 'Organization', name: 'MergesPDF', url: BASE_URL },
        mainEntityOfPage: canonical,
      });
    } else {
      jsonLd.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: pg.h1,
        url: canonical,
        description: pg.description,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        inLanguage: pg.lang,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        provider: { '@type': 'Organization', name: 'MergesPDF', url: BASE_URL },
      });
    }
    if (pg.faqs && pg.faqs.length) {
      jsonLd.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: pg.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      });
    }
    for (const ld of jsonLd) tags.push(`<script type="application/ld+json">${escJson(ld)}</script>`);
    return tags.join('\n    ');
  };

  let written = 0;
  for (const pg of pages) {
    let html = template;
    html = html.replace(/<title>[\s\S]*?<\/title>/, '');
    html = html.replace(/<meta name="description"[^>]*\/>/, '');
    html = html.replace(/<meta property="og:[^"]*"[^>]*\/>/g, '');
    html = html.replace(/<meta name="twitter:[^"]*"[^>]*\/>/g, '');
    html = html.replace(
      '<html lang="en">',
      pg.dir === 'rtl' ? `<html lang="${pg.lang}" dir="rtl">` : `<html lang="${pg.lang}">`,
    );
    html = html.replace('</head>', `    ${buildHead(pg)}\n  </head>`);
    html = html.replace('<div id="root"></div>', `<div id="root">${buildBody(pg)}</div>`);

    const outDir = pg.urlPath === '/' ? DIST : path.join(DIST, pg.urlPath.slice(1));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
    written++;
  }
  console.log(`[prerender] wrote ${written} HTML shells (${pages.filter((p) => p.lang === 'ar').length} Arabic)`);

  // ---- 6. Sitemap ------------------------------------------------------------
  const urls = [];
  const addUrl = (loc, changefreq, priority) =>
    urls.push(`  <url><loc>${BASE_URL}${loc}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`);

  for (const pg of pages) {
    if (pg.urlPath === '/') addUrl('/', 'weekly', '1.0');
    else if (pg.urlPath === '/ar') addUrl('/ar', 'weekly', '0.9');
    else if (pg.urlPath.startsWith('/blog/')) addUrl(pg.urlPath, 'monthly', '0.7');
    else if (pg.urlPath.startsWith('/tools/')) addUrl(pg.urlPath, 'monthly', '0.8');
    else if (['/about', '/contact', '/ar/about', '/ar/contact'].includes(pg.urlPath)) addUrl(pg.urlPath, 'monthly', '0.5');
    else if (['/privacy', '/terms', '/ar/privacy', '/ar/terms'].includes(pg.urlPath)) addUrl(pg.urlPath, 'yearly', '0.4');
    else if (pg.lang === 'ar') addUrl(pg.urlPath, 'monthly', '0.7');
    else addUrl(pg.urlPath, 'monthly', '0.8');
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
  fs.writeFileSync(path.join(ROOT, 'public/sitemap.xml'), sitemap);
  console.log(`[prerender] sitemap.xml: ${urls.length} URLs`);
}

main().catch((err) => {
  // Never break the publish build because of prerendering.
  console.error('[prerender] FAILED (build continues without static shells):', err);
});
