/**
 * main.js
 * Entry point — wires up every module once the DOM is ready. Theme is
 * initialized first so there's no flash of the wrong palette.
 */
document.addEventListener("DOMContentLoaded", () => {
  hydrateIcons();
  Theme.init();
  Navbar.init();
  Carousel.init();
  OrderForm.init();

  // Google Maps embed pulls ~500 KB of JS — attach it only when the
  // map is about to become visible.
  const mapFrame = document.querySelector(".locate__map-frame[data-src]");
  whenNearViewport(mapFrame, () => {
    mapFrame.src = mapFrame.dataset.src;
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
