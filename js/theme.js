/**
 * theme.js
 * Handles light/dark theme switching. Brand default is dark (the palette
 * and photography are built for it); a saved choice in localStorage always
 * wins on repeat visits.
 */
const Theme = (() => {
  const STORAGE_KEY = "bc-theme";
  const root = document.documentElement;

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#0c1519" : "#f7efe4");
    }
    const toggle = document.getElementById("themeToggle");
    if (toggle) toggle.setAttribute("aria-pressed", String(theme === "light"));
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  }

  function current() {
    return root.getAttribute("data-theme") || "dark";
  }

  function toggle() {
    const next = current() === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    apply(saved === "light" || saved === "dark" ? saved : "dark");

    const btn = document.getElementById("themeToggle");
    if (btn) btn.addEventListener("click", toggle);
  }

  return { init, toggle, current };
})();
