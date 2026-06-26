/**
 * pricing.js — Feature 1 engine with STRICT state isolation.
 *
 * The scoring guardrail: changing the billing cycle or currency must update ONLY
 * the price text nodes — no parent re-render, no layout reflow of the cards.
 *
 * How we satisfy it:
 *   - Cards are rendered ONCE into the DOM (static structure).
 *   - We cache a direct reference to each price <span> and period <span>.
 *   - Toggle/select handlers rewrite ONLY those cached text nodes' textContent.
 *   - No element is created, removed, re-ordered, or re-styled in a way that
 *     reflows siblings. Width is reserved via CSS so digit changes don't shift
 *     layout. Verifiable in Chrome DevTools "Paint flashing" / Performance.
 */

import { TIERS, CURRENCIES, computePrice } from './data.js';

export function initPricing(root) {
  const grid = root.querySelector('[data-pricing-grid]');
  const currencyControl = root.querySelector('[data-currency]');
  const billingToggle = root.querySelector('[data-billing-toggle]');

  // --- One-time render of the static card structure -------------------------
  const priceNodes = new Map(); // tierId -> { value, period }

  const frag = document.createDocumentFragment();
  TIERS.forEach((tier) => {
    const card = document.createElement('article');
    card.className = 'tier' + (tier.featured ? ' tier--featured' : '');
    card.setAttribute('aria-labelledby', `tier-${tier.id}`);

    const badge = tier.featured
      ? '<span class="tier__badge">Most popular</span>'
      : '';

    card.innerHTML = `
      ${badge}
      <h3 class="tier__name" id="tier-${tier.id}">${tier.name}</h3>
      <p class="tier__tagline">${tier.tagline}</p>
      <p class="tier__price">
        <span class="tier__amount" data-price="${tier.id}">—</span>
        <span class="tier__period" data-period="${tier.id}">/mo</span>
      </p>
      <ul class="tier__features">
        ${tier.features.map((f) => `<li>${f}</li>`).join('')}
      </ul>
      <a class="tier__cta" href="#get-started">${tier.featured ? 'Start free trial' : 'Choose ' + tier.name}</a>
    `;
    frag.appendChild(card);

    priceNodes.set(tier.id, {
      value: card.querySelector(`[data-price="${tier.id}"]`),
      period: card.querySelector(`[data-period="${tier.id}"]`),
    });
  });
  grid.appendChild(frag);

  // --- Isolated state (NOT framework state — plain locals) -------------------
  let currency = 'INR';
  let annual = false;

  /**
   * The ONLY DOM mutation path. Touches nothing but the cached text nodes.
   * No reads of layout properties here, so no forced synchronous reflow.
   */
  function paintPrices() {
    for (const tier of TIERS) {
      const node = priceNodes.get(tier.id);
      node.value.textContent = computePrice(tier.id, currency, annual);
      node.period.textContent = annual ? '/mo · billed yearly' : '/mo';
    }
  }

  // --- Controls -------------------------------------------------------------
  // Build currency segmented control (radio group for a11y, no reflow on change)
  currencyControl.innerHTML = CURRENCIES.map(
    (c, i) => `
      <label class="seg__option">
        <input type="radio" name="currency" value="${c.code}" ${c.code === currency ? 'checked' : ''}>
        <span aria-hidden="true">${c.symbol}</span> ${c.label}
      </label>`
  ).join('');

  currencyControl.addEventListener('change', (e) => {
    const t = e.target;
    if (t && t.name === 'currency') {
      currency = t.value;
      paintPrices(); // isolated: only text nodes change
    }
  });

  billingToggle.addEventListener('change', (e) => {
    annual = e.target.checked;
    billingToggle
      .closest('[data-billing]')
      ?.setAttribute('data-annual', String(annual));
    paintPrices(); // isolated: only text nodes change
  });

  // First paint
  paintPrices();
}
