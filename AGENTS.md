# AGENTS.md

## Build & Architecture
- `npm run build` runs `vite build && node scripts/prerender.mjs`. The prerender script ships static HTML shells per route (English + `/ar/` Arabic) with per-route meta, hreflang, JSON-LD and a generated `sitemap.xml`, harvested from source (App.tsx routes, each page's `<SEOHead>` props, translation files). It must stay browser-free (no puppeteer — it has to run in any CI) and fail-safe (never break the build), with page count capped by `MAX_PRERENDER_PAGES`.
- Arabic is an indexed locale, not just a UI state: `/ar/...` URLs are stripped to the base route in `AnimatedRoutes` and force `lang='ar'`. Keep prerender AR shells, `SEOHead` hreflang rules and the sitemap in sync when adding routes.
- Heavy libraries (pdf-lib, pdfjs-dist, tesseract.js, exceljs, heic2any) must be lazy-loaded: pages via `React.lazy`, and pdf-lib via cached dynamic `import()` inside `src/lib/pdf-utils.ts`. New tools must not add heavy deps to the initial bundle.
- Ads are consent-gated: `AdUnit` only injects the AdSense script after `getConsent() === 'accepted'` (`src/lib/consent.ts` + `CookieConsent` banner). Never load ad or tracking scripts before consent.
