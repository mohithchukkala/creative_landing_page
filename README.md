# Nexus AI — Autonomous Data Automation Control Center

A premium, high-converting landing page for an AI-driven data-automation platform.
Built for the Phase 1 Speed Run — **zero runtime dependencies, no build step, no
external UI/animation libraries.** Pure semantic HTML + custom CSS + vanilla ES modules.

## Run locally
Any static server works. For example:
```bash
python -m http.server 5173
# then open http://localhost:5173
```

## Architecture

```
index.html          Semantic shell + SEO/OG metadata + JSON-LD
src/css/styles.css  All design tokens (palette/fonts/motion) + layout + glassmorphism
src/js/data.js      Single source of truth — pricing matrix, tiers, features, metrics
src/js/pricing.js   Feature 1 — matrix-driven pricing with strict state isolation
src/js/bento.js     Feature 2 — Bento ⇄ Accordion + context-lock (WAAPI, zero deps)
src/js/main.js      Loader orchestration (≤500ms), counters, scroll reveals, wiring
```

## How the scoring requirements are met

**Feature 1 — Matrix-driven pricing & isolated currency switcher**
- Every price is computed at runtime: `base[tier] × tariff[currency] × (annual ? 0.8 : 1)`.
  No currency value is hardcoded in the markup (`src/js/data.js`).
- Currency/billing changes mutate **only the cached price text nodes** via
  `textContent` — no parent re-render, no sibling reflow. Card width is reserved with
  `tabular-nums` + `min-width` so digit changes never shift layout.

**Feature 2 — Bento ⇄ Accordion with context-lock**
- One DOM tree serves both layouts; the switch is pure CSS (grid → stacked).
- Accordion open/close uses the native Web Animations API (no libraries).
- **Context-lock:** the last-hovered bento index is preserved; crossing the mobile
  breakpoint auto-opens the matching accordion panel.

**SEO / Semantic / Performance**
- `<header>/<main>/<section>/<footer>`, single `<h1>`, full meta + Open Graph + JSON-LD.
- Content ships in HTML (crawlable without JS); animations are progressive enhancement.
- Loader + entrance orchestration capped at 500ms; nothing blocks Time to Interactive.

**Motion contract**
- Micro-interactions: 180ms ease-out. Structural reflows: 360ms ease-in-out.

## Assets
Design tokens (colors, fonts, SVGs) live as CSS variables at the top of
`src/css/styles.css`. Drop in the values from `asset_package.zip` to finalize the
exact palette and typography — no structural changes required.
