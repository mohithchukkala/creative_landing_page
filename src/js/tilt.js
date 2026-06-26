/**
 * tilt.js — 3D pointer-tilt micro-interaction. Native transforms only.
 *
 * Writes only CSS custom properties (--rx/--ry); the transform is applied by
 * CSS :hover, transitioned over 180ms ease-out (within the micro-interaction
 * band). Desktop fine-pointer only, and disabled under reduced-motion.
 */
export function initTilt(els, max = 6) {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduce) return;

  els.forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', (px * 2 * max).toFixed(2) + 'deg');
      el.style.setProperty('--rx', (py * -2 * max).toFixed(2) + 'deg');
    });
    el.addEventListener('pointerleave', () => {
      el.style.removeProperty('--rx');
      el.style.removeProperty('--ry');
    });
  });
}
