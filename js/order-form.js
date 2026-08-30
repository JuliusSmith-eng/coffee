/**
 * order-form.js
 * A real order dialog: picks up the drink currently shown in the carousel,
 * collects quantity/size/contact details, validates them, and shows a
 * confirmation. This is a static site with no backend, so submission is
 * handled client-side — the summary object built in `buildOrderPayload`
 * is exactly what you'd POST to a real endpoint (own API, email service,
 * POS integration, etc.) once one exists; nothing else needs to change.
 */
const OrderForm = (() => {
  let backdrop, modal, form, product;
  let qty = 1;
  let size = "Regular";
  const SIZE_UPCHARGE = { Regular: 0, Large: 0.5 };

  function money(n) {
    return n.toFixed(2);
  }

  function updateTotal() {
    if (!product) return;
    const unit = parseFloat(product.price) + SIZE_UPCHARGE[size];
    const total = unit * qty;
    modal.querySelector("#orderTotal").textContent = `€${money(total)}`;
  }

  function setQty(next) {
    qty = Math.min(10, Math.max(1, next));
    modal.querySelector("#orderQtyValue").textContent = qty;
    updateTotal();
  }

  function setSize(next) {
    size = next;
    modal.querySelectorAll(".order-size").forEach((btn) => {
      btn.classList.toggle("is-selected", btn.dataset.size === next);
    });
    updateTotal();
  }

  function validateField(field, condition, message) {
    const wrap = field.closest(".order-field");
    wrap.classList.toggle("has-error", !condition);
    wrap.querySelector(".error").textContent = message;
    return condition;
  }

  function validate() {
    const name = form.elements.name;
    const phone = form.elements.phone;
    let ok = true;
    ok = validateField(name, name.value.trim().length > 1, "Please enter your name.") && ok;
    ok = validateField(phone, /^[+\d][\d\s()-]{6,}$/.test(phone.value.trim()), "Please enter a valid phone number.") && ok;
    return ok;
  }

  function buildOrderPayload() {
    return {
      product: product.name,
      unitPrice: parseFloat(product.price) + SIZE_UPCHARGE[size],
      size,
      quantity: qty,
      total: (parseFloat(product.price) + SIZE_UPCHARGE[size]) * qty,
      customerName: form.elements.name.value.trim(),
      customerPhone: form.elements.phone.value.trim(),
      notes: form.elements.notes.value.trim(),
      submittedAt: new Date().toISOString(),
    };
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = buildOrderPayload();
    // No backend on this static build — this is the one line you'd replace
    // with a real request, e.g.:
    //   await fetch("/api/orders", { method: "POST", body: JSON.stringify(payload) });
    console.info("Order ready to submit:", payload);

    modal.querySelector("#orderSuccessText").textContent =
      `We've got it — ${payload.quantity}× ${product.name} for ${payload.customerName}. We'll text ${payload.customerPhone} when it's ready.`;
    modal.classList.add("is-success");
  }

  function reset() {
    form.reset();
    setQty(1);
    setSize("Regular");
    form.querySelectorAll(".order-field").forEach((f) => f.classList.remove("has-error"));
    modal.classList.remove("is-success");
  }

  function open(activeProduct) {
    product = activeProduct;
    reset();
    modal.querySelector("#orderProductImg").src = product.image;
    modal.querySelector("#orderProductName").textContent = product.name;
    modal.querySelector("#orderProductPrice").innerHTML = `<sup>&euro;</sup>${product.price}`;
    updateTotal();

    backdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(() => form.elements.name.focus(), 250);
  }

  function close() {
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function buildMarkup() {
    backdrop = document.createElement("div");
    backdrop.className = "order-backdrop";
    backdrop.id = "orderBackdrop";
    backdrop.innerHTML = `
      <div class="order-modal" role="dialog" aria-modal="true" aria-labelledby="orderProductName">
        <button type="button" class="order-modal__close" id="orderCloseBtn" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>

        <div class="order-modal__product">
          <img id="orderProductImg" src="" alt="" />
          <div>
            <h3 id="orderProductName"></h3>
            <span class="price" id="orderProductPrice"></span>
          </div>
        </div>

        <form class="order-modal__form" id="orderForm" novalidate>
          <div class="order-row">
            <div class="order-field">
              <label>Quantity</label>
              <div class="order-qty">
                <button type="button" id="qtyMinus" aria-label="Decrease quantity">−</button>
                <output id="orderQtyValue">1</output>
                <button type="button" id="qtyPlus" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div class="order-field">
              <label>Size</label>
              <div class="order-sizes">
                <button type="button" class="order-size is-selected" data-size="Regular">Regular</button>
                <button type="button" class="order-size" data-size="Large">Large +€0.50</button>
              </div>
            </div>
          </div>

          <div class="order-row">
            <div class="order-field">
              <label for="orderName">Name</label>
              <input type="text" id="orderName" name="name" autocomplete="name" placeholder="Your name" />
              <span class="error"></span>
            </div>

            <div class="order-field">
              <label for="orderPhone">Phone</label>
              <input type="tel" id="orderPhone" name="phone" autocomplete="tel" placeholder="+421 900 000 000" />
              <span class="hint">We'll text you when it's ready.</span>
              <span class="error"></span>
            </div>
          </div>

          <div class="order-field">
            <label for="orderNotes">Notes (optional)</label>
            <textarea id="orderNotes" name="notes" placeholder="Oat milk, extra hot, no whipped cream…"></textarea>
          </div>

          <div class="order-modal__total">
            <span>Total</span>
            <strong id="orderTotal">€0.00</strong>
          </div>

          <button type="submit" class="btn btn--primary order-modal__submit">Place order</button>
        </form>

        <div class="order-modal__success" id="orderSuccess">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg>
          <h3>Order received</h3>
          <p id="orderSuccessText"></p>
          <button type="button" class="btn btn--ghost" id="orderCloseSuccessBtn">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    modal = backdrop.querySelector(".order-modal");
    form = backdrop.querySelector("#orderForm");
  }

  function init() {
    buildMarkup();

    modal.querySelector("#qtyMinus").addEventListener("click", () => setQty(qty - 1));
    modal.querySelector("#qtyPlus").addEventListener("click", () => setQty(qty + 1));
    modal.querySelectorAll(".order-size").forEach((btn) => {
      btn.addEventListener("click", () => setSize(btn.dataset.size));
    });

    form.addEventListener("submit", onSubmit);
    modal.querySelector("#orderCloseBtn").addEventListener("click", close);
    modal.querySelector("#orderCloseSuccessBtn").addEventListener("click", close);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && backdrop.classList.contains("is-open")) close();
    });

    // Each carousel card has its own "Add to order" button (identified by
    // data-real-index), plus the carousel keeps clones of the edge cards
    // for the infinite loop — delegate from the document so newly rendered
    // cards are covered without re-binding anything.
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".card__add-btn");
      if (btn) open(PRODUCTS[Number(btn.dataset.realIndex)]);
    });
  }

  return { init, open, close };
})();
