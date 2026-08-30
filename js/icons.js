/**
 * icons.js
 * Small library of inline SVG line icons (24x24, stroke = currentColor).
 * Kept as raw markup strings so any module can drop them into innerHTML
 * without a build step or icon font.
 */
const ICONS = {
  // ---- UI ----
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.5 12h2.4M19 12h2.4M4.9 19l1.7-1.7M17.4 6.6l1.7-1.7"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8l7 7 7-7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h3l1.5 4-2 1.6a12 12 0 0 0 6.9 6.9L17 13.5l4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 21v-7h2.5l.5-3H14V9c0-.9.3-1.5 1.7-1.5H17V5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9V11H8v3h3v7"/></svg>',

  // ---- Ingredients ----
  espresso: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M3 20h15"/><path d="M8 5c0 .8-.6 1-.6 1.8S8 8 8 8"/><path d="M12 5c0 .8-.6 1-.6 1.8S12 8 12 8"/></svg>',
  milk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 3h7l1.3 4H7.2L8.5 3Z"/><path d="M6.8 7h10.4v12a1 1 0 0 1-1 1H7.8a1 1 0 0 1-1-1V7Z"/><path d="M6.8 12.5h10.4"/></svg>',
  ice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8.2 12 4l8 4.2v7.6L12 20l-8-4.2V8.2Z"/><path d="M4 8.2 12 12l8-4.2M12 12v8"/></svg>',
  cream: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M8.5 20c-.9-2.8.4-3.8.4-6S6.5 10.5 6.5 8A4 4 0 0 1 10.5 4c1.5 0 2.5.9 3.2 1.8.7-.9 1.6-1.3 2.7-1.3A3.3 3.3 0 0 1 19.7 8c0 1.8-1.8 2.4-1.8 4.6S19.2 16 17.5 20"/></svg>',
  iceCream: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M8.2 12.5 10 20h4l1.8-7.5"/></svg>',
  berry: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8c4 0 6.5 3 6.5 6.5S15.5 21 12 21s-6.5-3-6.5-6.5S8 8 12 8Z"/><path d="M9 5l1.5 3M12 4v3.2M15 5l-1.5 3"/><circle cx="9.6" cy="13.2" r=".5" fill="currentColor" stroke="none"/><circle cx="12.6" cy="15.6" r=".5" fill="currentColor" stroke="none"/><circle cx="14.6" cy="12.2" r=".5" fill="currentColor" stroke="none"/><circle cx="10.6" cy="17" r=".5" fill="currentColor" stroke="none"/></svg>',
  coconut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13a8 8 0 0 1 16 0c0 3.5-3.6 6-8 6s-8-2.5-8-6Z"/><path d="M8.2 13c0-1.5 1.7-2.5 3.8-2.5s3.8 1 3.8 2.5-1.7 2.5-3.8 2.5-3.8-1-3.8-2.5Z"/></svg>',
  cinnamon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12c0-3.3 6.5-3.3 6.5 0s6.5 3.3 6.5 0 6.5-3.3 6.5 0"/><path d="M2.5 12a4.3 4.3 0 0 0 4.3 4.3M21.5 12a4.3 4.3 0 0 1-4.3 4.3"/></svg>',
  honey: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v6M9 5.5h6"/><path d="M8 11c0 4 2.2 4.4 2.2 7a1.8 1.8 0 0 0 3.6 0c0-2.6 2.2-3 2.2-7"/><path d="M8 11h8"/></svg>',
  chocolate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="10" rx="1.5"/><path d="M9 7v10M15 7v10M3 12h18"/></svg>',
  banana: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6c-1 6 1 13 8 14 4.5.6 8-2 8.5-4.7"/><path d="M19 15c1.2.2 2 .8 2 1.6 0 1.3-2 2.2-4 1.9"/></svg>',
  oats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="8" cy="8" rx="2.5" ry="1.5" transform="rotate(-30 8 8)"/><ellipse cx="15.5" cy="7.5" rx="2.5" ry="1.5" transform="rotate(20 15.5 7.5)"/><ellipse cx="7" cy="15.5" rx="2.5" ry="1.5" transform="rotate(15 7 15.5)"/><ellipse cx="16" cy="15.5" rx="2.5" ry="1.5" transform="rotate(-20 16 15.5)"/><ellipse cx="12" cy="11.5" rx="2.5" ry="1.5" transform="rotate(-5 12 11.5)"/></svg>',
  almond: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 3 6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 3-8 6-11Z"/><path d="M12 8v9"/></svg>',
  syrup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3h4v3l2 2v11a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 19V8l2-2V3Z"/><path d="M8 12h8"/></svg>',
};

/** Returns an icon's SVG markup, or an empty string if the key is unknown. */
function getIcon(name) {
  return ICONS[name] || "";
}

/** Fills every element with a [data-icon] attribute with its SVG markup. */
function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = getIcon(el.dataset.icon);
  });
}
