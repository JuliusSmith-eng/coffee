/**
 * navbar.js
 * Sticky background on scroll, a pill that slides under the hovered/active
 * link, a scrollspy that keeps the active link in sync with the section in
 * view, and the mobile slide-down menu.
 */
const Navbar = (() => {
  let navbar, nav, pill, links, burger;
  let activeLink = null;

  function movePillTo(link) {
    if (!link || getComputedStyle(pill).display === "none") return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    pill.style.width = `${linkRect.width}px`;
    pill.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
    pill.classList.add("is-visible");
  }

  function hidePillToActive() {
    if (activeLink) movePillTo(activeLink);
    else pill.classList.remove("is-visible");
  }

  function setActive(id) {
    links.forEach((l) => l.classList.toggle("is-active", l.dataset.nav === id));
    activeLink = links.find((l) => l.dataset.nav === id) || null;
    hidePillToActive();
  }

  function onScroll() {
    navbar.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  function initScrollspy() {
    const sections = links
      .map((l) => document.getElementById(l.dataset.nav))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => observer.observe(s));
  }

  function closeMobileMenu() {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  function initMobileMenu() {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    links.forEach((l) => l.addEventListener("click", closeMobileMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileMenu();
    });
  }

  function initPillInteractions() {
    links.forEach((l) => {
      l.addEventListener("mouseenter", () => movePillTo(l));
    });
    nav.addEventListener("mouseleave", hidePillToActive);
    window.addEventListener("resize", debounce(hidePillToActive, 120));
  }

  function init() {
    navbar = document.getElementById("navbar");
    nav = document.getElementById("navbarNav");
    pill = document.getElementById("navPill");
    burger = document.getElementById("burgerBtn");
    links = Array.from(nav.querySelectorAll(".navbar__link"));

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    initPillInteractions();
    initScrollspy();
    initMobileMenu();
    setActive("home");
  }

  return { init };
})();
