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

  document.getElementById("year").textContent = new Date().getFullYear();
});
