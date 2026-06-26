/**
 * main.js — boot orchestration.
 *
 * Performance rule: the loader + entry animation must finish within 500ms and
 * must NOT block semantic HTML indexing or Time to Interactive. So:
 *   - The full semantic DOM ships in index.html (crawlable without JS).
 *   - JS only ENHANCES: it builds the pricing cards / bento nodes and layers
 *     CSS-driven entrance animations on top. Nothing is gated behind the loader.
 *   - The loader is a CSS overlay we dismiss on first paint; total orchestration
 *     budget is tracked below and capped at 500ms.
 */

import { initPricing } from './pricing.js';
import { initBento } from './bento.js';
import { METRICS } from './data.js';

const ORCHESTRATION_BUDGET = 500; // ms — hard cap per the brief

// --- Animated stat counters (WAAPI-free; rAF, hardware-cheap) ---------------
function countUp(el) {
  const metric = METRICS.find((m) => m.id === el.dataset.count);
  if (!metric) return;
  const target = metric.value;
  const dur = 900;
  let startTs = null;

  const fmt = (v) => {
    if (metric.format === 'compact')
      return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v);
    if (metric.format === 'decimal') return v.toFixed(2);
    return Math.round(v).toString();
  };

  function step(ts) {
    if (startTs === null) startTs = ts;
    const p = Math.min((ts - startTs) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = fmt(target * eased) + (metric.suffix || '');
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = fmt(target) + (metric.suffix || '');
  }
  requestAnimationFrame(step);
}

// --- Reveal-on-scroll (IntersectionObserver → CSS class, no JS animation) ---
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Count up any leaf stat spans within this revealed block.
          entry.target.querySelectorAll('[data-count]').forEach(countUp);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );
  els.forEach((el) => io.observe(el));
}

// --- Loader dismissal within budget -----------------------------------------
function dismissLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  document.documentElement.classList.add('is-ready');
  loader.addEventListener(
    'transitionend',
    () => loader.remove(),
    { once: true }
  );
  // Safety: hard-remove if transitionend never fires
  setTimeout(() => loader.remove(), ORCHESTRATION_BUDGET);
}

// --- Boot --------------------------------------------------------------------
function boot() {
  // Interactive immediately — build enhanced components.
  initPricing(document.getElementById('pricing'));
  initBento(document.getElementById('features'));
  initReveal();

  // Kick the entrance orchestration; keep it inside the 500ms budget.
  requestAnimationFrame(() => {
    document.documentElement.classList.add('is-entered');
    dismissLoader();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
