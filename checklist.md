# Optimization Checklist

## Implemented

- Canonical link tag added to index.html to prevent duplicate-content issues.
- Organization JSON-LD added for better rich results.
- Service worker registration (safe) for caching and performance.
- Image performance hints: decoding="async", lazy loading, fetchpriority on hero.
- Footer: fixed column layout and spacing; centered social icons.
- 404 page created with consistent styles and noindex meta; wired minimal utilities.
- Security headers and caching in .htaccess (Report-Only CSP first).

## Deferred (with rationale)

- Full image pipeline (WebP/AVIF with picture element): needs asset generation; risk of missing fallbacks. Next: generate WebP/AVIF, add picture with type/source and img fallback.
- CSS/JS minification/treeshaking: requires build step; risk of breaking selectors. Next: introduce a minify step using esbuild/LightningCSS, verify output.
- Detailed copy edits for keyword targeting: require stakeholder approval. Next: propose microcopy updates in a draft doc.
- Comprehensive a11y audit (contrast/focus): needs visual QA pass. Next: run axe or Lighthouse and fix flagged items.

## Expected Impact

- SEO: Improved crawlability and potential sitelinks via structured data.
- Performance: Faster media display and potential PWA caching benefits.
- Accessibility: Better nav context and keyboard flow.

## Quick Test Steps

- Hard refresh the site; check header, hero, services, events, donation, contact, and footer.
- Verify service worker registered (Application tab > Service Workers).
- Visit /404.html directly to confirm it loads and is styled; confirm robots noindex.
