# Navigation Overlay/Menu Troubleshooting

Date: 2025-09-06

## Root Cause

- The header `.navbar` used `contain: layout style paint` and applied a `transform` during scroll-hide. Both create a new containing/stacking context that clipped the fixed-position `.nav-menu` off-canvas panel. As a result, when opening the menu, only the backdrop (attached to `<body>`) appeared while the menu itself seemed hidden.
- At tablet widths, the off-canvas rules were scoped only to mobile media queries, so the menu didn’t adopt slide-in behavior.

## Changes Made

- CSS
  - Added `.navbar.menu-open { transform: none !important; contain: none !important; }` to disable clipping while the menu is open.
  - Defined global overlay rules with `.navbar.menu-open .nav-menu { position: fixed; top: var(--header-h) ... }` so tablets inherit the same off‑canvas menu behavior as phones.
  - Moved `.nav-backdrop` styles out of mobile-only scope—backdrop now works on tablets too.
  - Minor mobile spacing: reduced menu link font-size/padding; tightened logo/title spacing.
- JS (`script.js`)
  - On open: toggle `.active` on menu/backdrop, add `.menu-open` to `.navbar`, clear inline transforms.
  - On all closes (link click, outside click, backdrop tap, Escape): remove `.menu-open`, close menu/backdrop, and restore body scroll.
  - Set dynamic `--header-h` CSS var from measured header height; responds to resize/orientation.

## Why This Works Without Changing Design

- Disabling containment/transform is limited to the menu-open state, preserving original performance optimizations and scroll-hide behavior otherwise.
- Overlay and slide-in visual design remains unchanged; only scope and stacking/positioning were corrected to match intent across breakpoints.

## Validation

- Tested at common widths: 360–768px (phones) and 820–1024px (tablets).
- Menu opens with backdrop, scroll locks, and content is scrollable within the menu. Close actions restore state.

## Notes

- If you still see stale behavior, hard refresh to bypass cached CSS/JS.
