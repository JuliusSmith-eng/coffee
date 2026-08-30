/**
 * utils.js
 * Small dependency-free helpers shared across modules.
 */

/** Delays calling `fn` until `wait` ms have passed since the last call. */
function debounce(fn, wait = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/** Current responsive tier, kept in sync with the CSS breakpoints. */
function getBreakpoint() {
  const w = window.innerWidth;
  if (w < 720) return "mobile";
  if (w < 960) return "tablet";
  return "desktop";
}

const prefersReducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
