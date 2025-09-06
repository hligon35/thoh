# CHANGELOG

## 2025-09-06

- Added PLAN.md with phased non-breaking optimization plan.
- SEO: Added canonical link, favicon, and Organization JSON-LD to index.html; improved image decoding/lazy attributes.
- Performance: Registered service worker (safe, on load) in script.js; added decoding/lazy on images; lazy-loaded hidden iframe.
- Accessibility: aria-current on active nav links.
- Footer: Fixed spacing regressions and restored 3-column layout; centered social icons under brand text.
- 404: Created 404.html consistent with site; added noindex; wired minimal styles; linked main CSS and JS.
- Security/Caching: Updated .htaccess to include recommended security headers and caching (see below).

### .htaccess updates

- Added ErrorDocument 404 /404.html
- Security headers: HSTS, CSP (Report-Only), X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP/CORP.
- Caching: Cache-Control for static assets, ETag enabled (server default), gzip/brotli notes.

### Testing notes

- Verified no visual regressions on desktop/mobile for header, hero, services, events, donation, and footer.
- Footer columns render correctly; social icons centered.
- Service worker registers without errors; no console errors.
- 404 page loads quickly, shows correct links and footer.
