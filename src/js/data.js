/**
 * data.js — Single source of truth.
 *
 * Feature 1 requirement: prices are NEVER hardcoded in the UI. Every value the
 * pricing panel shows is derived at runtime from this multi-dimensional matrix:
 *
 *      final = base[tier] * tariff[currency] * (annual ? (1 - annualDiscount) : 1)
 *
 * Change a number here and the whole pricing UI follows. Nothing in index.html
 * carries a literal currency value.
 */

export const PRICING = {
  // Base monthly rate per tier, expressed in the neutral USD unit.
  base: {
    starter: 29,
    scale: 99,
    enterprise: 299,
  },

  // Flat annual discount multiplier (20% off when billed annually).
  annualDiscount: 0.2,

  // Regional tariff variables — multiplier applied to the neutral base.
  tariff: {
    USD: 1.0,
    INR: 83.0,
    EUR: 0.92,
  },

  // Locale used purely for Intl currency formatting (symbol + grouping).
  locale: {
    USD: 'en-US',
    INR: 'en-IN',
    EUR: 'de-DE',
  },
};

/** Tier display metadata (copy/structure — not pricing). */
export const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For solo operators automating their first workflows.',
    features: [
      '5 active automation pipelines',
      '10k tasks / month',
      'Community support',
      '3-day run history',
    ],
    featured: false,
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'For teams running production-grade AI operations.',
    features: [
      'Unlimited pipelines',
      '1M tasks / month',
      'Priority support + SLA',
      '90-day run history',
      'Custom model routing',
    ],
    featured: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For orgs needing isolation, governance, and scale.',
    features: [
      'Dedicated compute isolation',
      'Unlimited everything',
      'SSO + audit logs',
      '24/7 white-glove support',
      'On-prem / VPC deploy',
    ],
    featured: false,
  },
];

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR' },
  { code: 'USD', symbol: '$', label: 'USD' },
  { code: 'EUR', symbol: '€', label: 'EUR' },
];

/**
 * Compute the displayed price for one tier under a given currency + cycle.
 * Returns a fully formatted currency string via the native Intl API.
 */
export function computePrice(tierId, currency, annual) {
  const monthlyNeutral = PRICING.base[tierId] * PRICING.tariff[currency];
  const value = annual ? monthlyNeutral * (1 - PRICING.annualDiscount) : monthlyNeutral;

  const fmt = new Intl.NumberFormat(PRICING.locale[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'INR' ? 0 : 0,
    minimumFractionDigits: 0,
  });
  return fmt.format(Math.round(value));
}

/** Feature cards powering the Bento grid / mobile Accordion (Feature 2). */
export const FEATURES = [
  {
    id: 'orchestration',
    eyebrow: 'Core Engine',
    title: 'Visual Workflow Orchestration',
    body: 'Drag, branch, and fork AI pipelines on an infinite canvas. Every node runs in an isolated sandbox with automatic retries and backpressure.',
    size: 'lg', // spans 2x2 in the bento grid
  },
  {
    id: 'routing',
    eyebrow: 'Intelligence',
    title: 'Adaptive Model Routing',
    body: 'Route each task to the optimal model by cost, latency, and accuracy — automatically, in real time.',
    size: 'md',
  },
  {
    id: 'observability',
    eyebrow: 'Insight',
    title: 'Live Observability',
    body: 'Trace every token, every run. Streaming logs, latency heatmaps, and anomaly alerts built in.',
    size: 'md',
  },
  {
    id: 'governance',
    eyebrow: 'Trust',
    title: 'Governance & Guardrails',
    body: 'Policy-as-code, PII redaction, and full audit trails keep every automation compliant by default.',
    size: 'sm',
  },
  {
    id: 'integrations',
    eyebrow: 'Connectivity',
    title: '300+ Native Integrations',
    body: 'Connect your stack in minutes with first-class connectors and a typed webhook layer.',
    size: 'sm',
  },
];

/** Animated hero dashboard metrics + social-proof stats (counted up via WAAPI). */
export const METRICS = [
  { id: 'tasks', label: 'Tasks automated', value: 4820000, suffix: '+', format: 'compact' },
  { id: 'uptime', label: 'Platform uptime', value: 99.99, suffix: '%', format: 'decimal' },
  { id: 'latency', label: 'Median routing latency', value: 42, suffix: 'ms', format: 'int' },
  { id: 'teams', label: 'Teams onboarded', value: 12400, suffix: '+', format: 'compact' },
];
