# Optimization & Polishing Plan (Non-visual, Non-breaking)

Scope and constraints

- Preserve current visual design, layout, and functionality.
- Only incremental, reversible edits. All changes commented inline.
- Static site (Apache via .htaccess present). No framework changes.

Phases

1) SEO (safe, no layout change)

   - Confirm landmarks (header, nav, main, footer) and semantic tags ✔︎
   - Canonical URL in head ✔︎
   - JSON-LD Organization schema ✔︎ (extend later for LocalBusiness)
   - Tighten titles/descriptions (copy only; no layout) ◻︎
   - Alt text pass (descriptive, concise) ◻︎

2) Performance (non-breaking)

   - Defer SW registration done; keep minimal JS in main bundle ✔︎
   - Add decoding/lazy where safe ✔︎
   - Static caching headers for assets (Cache-Control/ETag) ✔︎
   - Keep minification optional to avoid regressions; document path ◻︎

3) Accessibility

   - aria-current for nav ✔︎; skip-link already exists ✔︎
   - Form labels, error messaging retained ✔︎
   - Contrast/focus audit (document issues if any) ◻︎

4) Mobile/Tablet

   - Confirm breakpoints; avoid layout changes; spot-fix overflows ◻︎

5) 404 Page

   - Add /404.html with noindex; consistent header/footer ✔︎
   - Wire via .htaccess ErrorDocument 404 ✔︎

6) Security headers

   - Add CSP (Report-Only by default), HSTS, X-*, Referrer-Policy, Permissions-Policy ✔︎

Notes

- Any risky changes (minifying CSS/JS, converting image tags to picture) will be staged as deferred with clear steps.
- All edits include inline comments with purpose and rollback hints.
