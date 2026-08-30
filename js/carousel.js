/**
 * carousel.js
 * A classic infinite horizontal scroll-snap carousel (the same mechanics
 * Swiper's `loop: true` uses): the track holds a clone of the last card
 * before the first real one and a clone of the first card after the last
 * real one. The browser's native scroll-snap does all the sliding; once a
 * scroll gesture settles, we check whether it landed on a clone and, if
 * so, silently jump (no animation) to the matching real card on the other
 * end — that jump is invisible because the clone looks identical to what
 * it's standing in for.
 */
const Carousel = (() => {
  const N = PRODUCTS.length;
  let track, dotsEl;
  let currentSlot = 1; // 1..N map to PRODUCTS[0..N-1]; slot 0 and N+1 are clones
  let settleTimer = null;
  let autoplayTimer = null;
  const AUTOPLAY_MS = 5200;

  function gradientVars(product) {
    const [c1, c2, c3] = product.gradient;
    return `--c1:${c1};--c2:${c2};--c3:${c3}`;
  }

  function cardMarkup(product, realIndex, isClone) {
    return `
      <article class="carousel__card" data-real-index="${realIndex}" ${isClone ? 'data-clone="true" aria-hidden="true"' : ""} style="${gradientVars(product)}">
        <div class="card__visual">
          <img src="${product.image}" alt="${isClone ? "" : product.name}" draggable="false" loading="${isClone ? "lazy" : "eager"}">
        </div>
        <div class="card__info">
          <span class="card__index">${String(realIndex + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}</span>
          <h3 class="card__name">${product.name}</h3>
          <p class="card__tagline">${product.tagline}</p>
          <ul class="card__ingredients">
            ${product.ingredients.map((ing) => `<li class="card__ingredient">${getIcon(ing.icon)}<span>${ing.label}</span></li>`).join("")}
          </ul>
          <div class="card__footer">
            <span class="card__price"><sup>&euro;</sup>${product.price}</span>
            <button class="btn btn--primary card__add-btn" data-real-index="${realIndex}" ${isClone ? 'tabindex="-1"' : ""}>Add to order</button>
          </div>
        </div>
      </article>`;
  }

  function render() {
    const real = PRODUCTS.map((p, i) => cardMarkup(p, i, false)).join("");
    const cloneFirst = cardMarkup(PRODUCTS[0], 0, true);
    const cloneLast = cardMarkup(PRODUCTS[N - 1], N - 1, true);
    track.innerHTML = cloneLast + real + cloneFirst;

    dotsEl.innerHTML = PRODUCTS.map(
      (_, i) => `<button class="carousel__dot" data-index="${i}" aria-label="Drink ${i + 1}"></button>`
    ).join("");
  }

  function cardWidth() {
    return track.clientWidth;
  }

  function slotEl(slot) {
    return track.children[slot];
  }

  function jumpTo(slot) {
    track.scrollLeft = slotEl(slot).offsetLeft;
    currentSlot = slot;
  }

  function goTo(slot, { smooth = true } = {}) {
    const el = slotEl(slot);
    if (!el) return;
    track.scrollTo({ left: el.offsetLeft, behavior: smooth ? "smooth" : "auto" });
    currentSlot = slot;
  }

  function next() {
    goTo(currentSlot + 1);
    restartAutoplay();
  }
  function prev() {
    goTo(currentSlot - 1);
    restartAutoplay();
  }

  function updateActiveState() {
    const realIndex = ((currentSlot - 1) + N) % N;
    dotsEl.querySelectorAll(".carousel__dot").forEach((d, i) => d.classList.toggle("is-active", i === realIndex));
  }

  // After a scroll gesture settles, snap our tracked slot to whichever
  // card is actually nearest, then — if that's one of the two clones —
  // silently re-center onto the equivalent real card so the loop never
  // hits a visible edge.
  function onScrollSettled() {
    const nearest = Math.round(track.scrollLeft / cardWidth());
    if (nearest === 0) {
      jumpTo(N); // was on the prepended "last" clone → real last card
    } else if (nearest === N + 1) {
      jumpTo(1); // was on the appended "first" clone → real first card
    } else {
      currentSlot = nearest;
    }
    updateActiveState();
  }

  function onScroll() {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(onScrollSettled, 120);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    if (prefersReducedMotion) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(currentSlot + 1), AUTOPLAY_MS);
  }

  function restartAutoplay() {
    startAutoplay();
  }

  function initDrag() {
    const DRAG_THRESHOLD = 6; // px of movement before a mousedown counts as a drag
    let pending = false;
    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    function suppressNextClick() {
      const swallow = (e) => {
        e.stopPropagation();
        e.preventDefault();
        track.removeEventListener("click", swallow, true);
      };
      track.addEventListener("click", swallow, true);
    }

    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return; // touch/pen keep native scrolling
      pending = true;
      dragging = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
    });

    track.addEventListener("pointermove", (e) => {
      if (!pending) return;
      const dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) > DRAG_THRESHOLD) {
        // Only now, once real movement is confirmed, do we actually take
        // over the pointer — a plain click/tap never reaches this branch,
        // so buttons inside the track stay clickable.
        dragging = true;
        track.setPointerCapture(e.pointerId);
        track.classList.add("is-dragging");
        stopAutoplay();
      }
      if (dragging) track.scrollLeft = startScroll - dx;
    });

    function endDrag() {
      if (dragging) {
        track.classList.remove("is-dragging");
        onScrollSettled();
        restartAutoplay();
        suppressNextClick(); // the browser still fires a click after a drag-release; swallow it
      }
      pending = false;
      dragging = false;
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("pointerleave", () => dragging && endDrag());
  }

  function initResize() {
    window.addEventListener(
      "resize",
      debounce(() => jumpTo(currentSlot), 150)
    );
  }

  function init() {
    const root = document.getElementById("carousel");
    if (!root) return;

    track = document.getElementById("carouselTrack");
    dotsEl = document.getElementById("carouselDots");

    render();
    jumpTo(1);
    updateActiveState();

    root.querySelector(".carousel__arrow--prev").addEventListener("click", prev);
    root.querySelector(".carousel__arrow--next").addEventListener("click", next);

    dotsEl.querySelectorAll(".carousel__dot").forEach((btn) => {
      btn.addEventListener("click", () => {
        goTo(Number(btn.dataset.index) + 1);
        restartAutoplay();
      });
    });

    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    initDrag();
    initResize();

    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", restartAutoplay);
    root.addEventListener("focusin", stopAutoplay);
    root.addEventListener("focusout", restartAutoplay);
    root.addEventListener("touchstart", stopAutoplay, { passive: true });

    startAutoplay();
  }

  function getActiveProduct() {
    return PRODUCTS[((currentSlot - 1) + N) % N];
  }

  return { init, getActiveProduct };
})();
