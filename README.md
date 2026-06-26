<div align="center">

# ⚡ Nexus AI

### The Autonomous Control Center for AI Data Automation

*A premium, motion-rich SaaS landing page — engineered for a 4-hour speed run, built with **zero dependencies**.*

<br/>

![No Dependencies](https://img.shields.io/badge/dependencies-0-22d3a6?style=for-the-badge)
![No Build Step](https://img.shields.io/badge/build_step-none-36e2ff?style=for-the-badge)
![Vanilla JS](https://img.shields.io/badge/vanilla-JS-8b5cf6?style=for-the-badge)
![Native Motion](https://img.shields.io/badge/motion-100%25_native-eef2ff?style=for-the-badge)

<br/>

```
  ┌─────────────────────────────────────────────────────────┐
  │  ◉ ◉ ◉                                operations / live  │
  │                                                           │
  │     ●━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●       │
  │     ●━━━━━━●         ╲                              │       │
  │     ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●       │
  │                                                           │
  │   throughput 1.2k/s     queue 312      errors 0.02%       │
  └─────────────────────────────────────────────────────────┘
```

*No frameworks. No animation libraries. No CSS-in-JS. Just the platform, pushed hard.*

</div>

---

## 🎯 The Premise

Build a high-converting landing page for an advanced AI-driven data automation platform — under a strict countdown, judged on **architecture, state isolation, SEO hygiene, and motion choreography**.

The twist: **no shortcuts allowed.** No Framer Motion. No Shadcn. No Radix. Every transition, every interaction, every pixel of motion is hand-written against the native browser platform.

> *Constraints don't limit creativity. They focus it.*

---

## ✨ Signature Features

### 🧮 Matrix-Driven Pricing Engine
Three tiers. Three currencies (₹ / $ / €). Two billing cycles. **Zero hardcoded prices.**

Every number is computed live from a multi-dimensional config matrix:

```
finalPrice = base[tier] × tariff[currency] × (annual ? 0.80 : 1.00)
```

…and here's the part that wins points: switching currency or billing cycle mutates **only the price text nodes** — no parent re-render, no layout reflow, no global state churn. Verifiable under Chrome DevTools paint-flashing. The cards never blink.

### 🪟 Bento ⇄ Accordion with Context-Lock
A modern Bento grid on desktop that **refactors into a touch-friendly accordion** on mobile — from a *single* DOM tree, with a pure-CSS layout switch.

The flourish: **hover a bento node on desktop, shrink the window past the breakpoint, and the matching accordion panel opens automatically.** Your focus follows you across the layout boundary. Hand-written with the Web Animations API and the native View Transitions API — not a library in sight.

### 🌌 Motion, From Scratch
Six layers of native motion, all GPU-friendly, all within the performance budget:

| Effect | Built With |
|---|---|
| Drifting **neural-network** hero | hand-written `<canvas>`, cursor-reactive |
| Rotating **glow ring** on the featured tier | `@property` + animated `conic-gradient` |
| **3D pointer-tilt** on cards | CSS custom properties + `transform` |
| **Spring** easing on the accordion | native CSS `linear()` |
| **Scroll progress + parallax** | `animation-timeline: scroll()` |
| **Layout morph** on breakpoint | View Transitions API |

---

## 🏛️ Architecture

```
nexus-ai/
├── index.html              ·  Semantic shell · SEO + Open Graph + JSON-LD
├── src/
│   ├── css/
│   │   └── styles.css       ·  Design tokens · glassmorphism · all six motion layers
│   └── js/
│       ├── data.js          ·  Single source of truth — the pricing matrix
│       ├── pricing.js       ·  Feature 1 · surgical state isolation
│       ├── bento.js         ·  Feature 2 · bento↔accordion + context-lock
│       ├── tilt.js          ·  3D pointer-tilt micro-interaction
│       ├── neural.js        ·  canvas neural-network background
│       └── main.js          ·  boot orchestration · loader · counters · reveals
└── README.md
```

**Design philosophy:** ship semantic HTML first (crawlable, instantly interactive), then *enhance* with JavaScript. Nothing critical hides behind the loader. The page works before the JS even arrives.

---

## ⚙️ The Rules — and How We Honored Them

| Constraint | Our Answer |
|---|---|
| 🚫 No external UI / animation libraries | **Zero dependencies.** There is no `package.json` to ban. |
| 🚫 No global re-renders on price change | Direct `textContent` writes to cached nodes. Same element identity, before and after. |
| 🚫 No runtime CSS-in-JS engines | Native CSS Transitions / Animations + WAAPI only. |
| ⏱️ ≤ 500ms entrance · don't block TTI | Heavy canvas defers to `requestIdleCallback`. Content paints first. |
| 🎚️ Micro 150–200ms · reflows 300–400ms | Tokenized easings, every timing inside the band. |
| ♿ Respect the user | Full `prefers-reduced-motion` support. Semantic landmarks. `alt` everywhere. |

---

## 🚀 Run It

It's a static site — any server works. No install, no build.

```bash
# clone
git clone https://github.com/mohithchukkala/creative_landing_page.git
cd creative_landing_page

# serve (pick one)
python -m http.server 5173
npx serve .

# open
http://localhost:5173
```

> ⚠️ Open it over **http**, not `file://` — ES modules require a server to load.

---

## 🎨 Make It Yours

The entire aesthetic lives in CSS custom properties at the top of `styles.css` — palette, fonts, radii, and motion timings. Swap the values, and the whole interface follows. The pricing, the features, and the stats are all data-driven from `data.js`.

<div align="center">

<br/>

**Built for the speed run.** ⚡

*Semantic. Isolated. Native. Fast.*

</div>
