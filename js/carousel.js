/**
 * carousel.js
 * Same mechanic as the Yudiz "Headphone Slider" reference: every tick,
 * every image gets reassigned one of four classes based on its position
 * relative to the active index (active / next / previous / inactive), and
 * the matching full-bleed gradient background crossfades in behind it.
 * Unlike the original demo, the name/tagline/ingredients/price also swap
 * with the active drink instead of staying static.
 */
const Carousel = (() => {
  const N = PRODUCTS.length;
  let index = 0;
  let els = {};
  let imageEls = [];
  let bgEls = [];
  let autoplayTimer = null;
  const AUTOPLAY_MS = 3400;

  function radialGradient(product) {
    const [c1, , c3] = product.gradient;
    return `radial-gradient(60% 60% at 50% 50%, ${c1} 0%, ${c3} 100%)`;
  }

  function buildBackgrounds() {
    els.backgrounds.innerHTML = PRODUCTS.map(() => `<div class="carousel__bg"></div>`).join("");
    bgEls = Array.from(els.backgrounds.children);
    bgEls.forEach((bg, i) => (bg.style.background = radialGradient(PRODUCTS[i])));
  }

  function buildImages() {
    els.images.innerHTML = PRODUCTS.map(
      (p, i) => `<img src="${p.image}" alt="${p.name}" data-index="${i}" draggable="false">`
    ).join("");
    imageEls = Array.from(els.images.children);
    // Only reveal each image once its bitmap has actually decoded —
    // see the matching CSS guard on .carousel__images img:not(.is-loaded).
    imageEls.forEach((img) => {
      if (img.complete) img.classList.add("is-loaded");
      else img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
    });
  }

  function buildDots() {
    els.dots.innerHTML = PRODUCTS.map(
      (_, i) => `<button class="carousel__dot" data-index="${i}" aria-label="Drink ${i + 1}"></button>`
    ).join("");
  }

  function renderIngredients(product) {
    els.ingredients.innerHTML = product.ingredients
      .map((ing) => `<li class="carousel__ingredient">${getIcon(ing.icon)}<span>${ing.label}</span></li>`)
      .join("");
  }

  function renderContent() {
    const product = PRODUCTS[index];
    els.name.textContent = product.name;
    els.tagline.textContent = product.tagline;
    els.price.innerHTML = `<sup>&euro;</sup>${product.price}`;
    els.index.textContent = `${String(index + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
    renderIngredients(product);
  }

  function update() {
    const prevIndex = (index - 1 + N) % N;
    const nextIndex = (index + 1) % N;

    imageEls.forEach((img, i) => {
      img.classList.remove("active", "previous", "next", "inactive");
      if (i === index) img.classList.add("active");
      else if (i === prevIndex) img.classList.add("previous");
      else if (i === nextIndex) img.classList.add("next");
      else img.classList.add("inactive");
    });

    bgEls.forEach((bg, i) => bg.classList.toggle("is-active", i === index));
    els.dots.querySelectorAll(".carousel__dot").forEach((d, i) => d.classList.toggle("is-active", i === index));

    renderContent();
  }

  function goTo(i, { userInitiated = true } = {}) {
    index = (i + N) % N;
    update();
    if (userInitiated) restartAutoplay();
  }
  function next() {
    goTo(index + 1);
  }
  function prev() {
    goTo(index - 1);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
  function startAutoplay() {
    if (prefersReducedMotion) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(index + 1, { userInitiated: false }), AUTOPLAY_MS);
  }
  function restartAutoplay() {
    startAutoplay();
  }

  function initSwipe(root) {
    let startX = 0;
    let dx = 0;
    root.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; dx = 0; stopAutoplay(); }, { passive: true });
    root.addEventListener("touchmove", (e) => { dx = e.touches[0].clientX - startX; }, { passive: true });
    root.addEventListener("touchend", () => {
      if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
      else restartAutoplay();
    });
  }

  function init() {
    const root = document.getElementById("carousel");
    if (!root) return;

    els = {
      backgrounds: document.getElementById("carouselBackgrounds"),
      images: document.getElementById("carouselImages"),
      dots: document.getElementById("carouselDots"),
      name: document.getElementById("carouselName"),
      tagline: document.getElementById("carouselTagline"),
      price: document.getElementById("carouselPrice"),
      index: document.getElementById("carouselIndex"),
      ingredients: document.getElementById("carouselIngredients"),
    };

    buildBackgrounds();
    buildImages();
    buildDots();
    update();

    root.querySelector(".carousel__arrow--prev").addEventListener("click", prev);
    root.querySelector(".carousel__arrow--next").addEventListener("click", next);
    els.dots.querySelectorAll(".carousel__dot").forEach((btn) => {
      btn.addEventListener("click", () => goTo(Number(btn.dataset.index)));
    });

    initSwipe(root);
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", restartAutoplay);
    root.addEventListener("focusin", stopAutoplay);
    root.addEventListener("focusout", restartAutoplay);

    startAutoplay();
  }

  function getActiveProduct() {
    return PRODUCTS[index];
  }

  return { init, getActiveProduct };
})();
