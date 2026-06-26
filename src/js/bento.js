/**
 * bento.js — Feature 2: Bento-Grid (desktop) ⇄ Accordion (mobile).
 *
 * Zero dependencies. All structure + motion is hand-written:
 *   - Layout switch is pure CSS (grid → stacked) driven by a breakpoint class.
 *   - Accordion open/close uses the native Web Animations API (WAAPI) to animate
 *     height auto ↔ 0 with the spec'd 300–400ms ease-in-out reflow timing.
 *
 * THE CONTEXT-LOCK CONSTRAINT:
 *   We keep a single `activeIndex`. On desktop it tracks the hovered bento node.
 *   When the viewport crosses INTO mobile, the accordion panel matching that
 *   exact index is opened automatically — so the card you were inspecting
 *   becomes the open panel after the layout transition.
 */

import { FEATURES } from './data.js';

const MOBILE_QUERY = '(max-width: 768px)';
const REFLOW_MS = 360; // within the 300–400ms structural-reflow band
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'; // ease-in-out

export function initBento(root) {
  const container = root.querySelector('[data-bento]');

  // --- One-time render: same DOM serves both bento and accordion ------------
  container.innerHTML = FEATURES.map(
    (f, i) => `
    <section class="node node--${f.size}" data-node data-index="${i}">
      <button class="node__head" type="button"
              id="node-head-${i}"
              aria-expanded="false"
              aria-controls="node-panel-${i}">
        <span class="node__eyebrow">${f.eyebrow}</span>
        <span class="node__title">${f.title}</span>
        <svg class="node__chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="node__panel" id="node-panel-${i}" role="region"
           aria-labelledby="node-head-${i}">
        <div class="node__panel-inner">
          <p>${f.body}</p>
        </div>
      </div>
    </section>`
  ).join('');

  const nodes = Array.from(container.querySelectorAll('[data-node]'));
  const mq = window.matchMedia(MOBILE_QUERY);

  let activeIndex = 0;          // last hovered (desktop) / open panel (mobile)
  let isMobile = mq.matches;

  // ---- Helpers -------------------------------------------------------------
  const panelOf = (i) => nodes[i].querySelector('.node__panel');
  const headOf = (i) => nodes[i].querySelector('.node__head');

  /** Animate one accordion panel open/closed with WAAPI (mobile only). */
  function setPanel(i, open, animate = true) {
    const panel = panelOf(i);
    const head = headOf(i);
    head.setAttribute('aria-expanded', String(open));
    nodes[i].classList.toggle('is-open', open);

    if (!isMobile) {
      // Desktop bento: panels are always visible, no height animation.
      panel.style.height = '';
      return;
    }

    const start = panel.getBoundingClientRect().height;
    panel.style.height = 'auto';
    const end = open ? panel.scrollHeight : 0;
    panel.style.height = start + 'px';

    if (!animate) {
      panel.style.height = open ? 'auto' : '0px';
      return;
    }

    // void read to flush, then WAAPI tween
    panel.animate(
      [{ height: start + 'px' }, { height: end + 'px' }],
      { duration: REFLOW_MS, easing: EASE, fill: 'none' }
    ).onfinish = () => {
      panel.style.height = open ? 'auto' : '0px';
    };
  }

  /** Open exactly one accordion panel (mobile single-open behaviour). */
  function openOnly(i, animate = true) {
    nodes.forEach((_, idx) => setPanel(idx, idx === i, animate));
    activeIndex = i;
  }

  // ---- Desktop: track hover to seed the context-lock -----------------------
  nodes.forEach((node, i) => {
    node.addEventListener('pointerenter', () => {
      if (!isMobile) activeIndex = i;
    });
    // Pointer-tracking glow (desktop micro-interaction). Writes only CSS custom
    // properties — no layout reads, no reflow.
    node.addEventListener('pointermove', (e) => {
      if (isMobile) return;
      const r = node.getBoundingClientRect();
      node.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      node.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
    // Accordion header click (mobile)
    headOf(i).addEventListener('click', () => {
      if (!isMobile) return; // headers are non-collapsing on desktop bento
      const isOpen = headOf(i).getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        setPanel(i, false);
      } else {
        openOnly(i);
      }
    });
  });

  // ---- Layout-mode application --------------------------------------------
  function applyMode(animate) {
    container.classList.toggle('is-accordion', isMobile);
    container.classList.toggle('is-bento', !isMobile);

    if (isMobile) {
      // Entering mobile: honour the context-lock — open the last active node.
      openOnly(activeIndex, animate);
    } else {
      // Entering desktop: clear inline heights so the grid is fully visible.
      nodes.forEach((_, i) => {
        headOf(i).setAttribute('aria-expanded', 'false');
        nodes[i].classList.remove('is-open');
        panelOf(i).style.height = '';
      });
    }
  }

  // ---- Breakpoint crossing -------------------------------------------------
  const onChange = (e) => {
    const nowMobile = e.matches;
    if (nowMobile === isMobile) return;
    isMobile = nowMobile;
    applyMode(true); // animate the transition + context handoff
  };
  // addEventListener('change') is the modern, supported API
  mq.addEventListener('change', onChange);

  // Initial paint (no animation on first load → respects ≤500ms / no jank)
  applyMode(false);
}
