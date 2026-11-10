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

  // Name: letters only (any alphabet), every word starts with a capital
  // letter, single spaces between words. E.g. "Anna", "Anna Maria".
  const NAME_RE = /^\p{Lu}\p{Ll}*(?: \p{Lu}\p{Ll}*)*$/u;

  // Phone: +<country code> (<operator>) xxx-xx-xx
  // e.g. "+380 (67) 123-45-67", "+421 (900) 123-45-67".
  const PHONE_RE = /^\+\d{1,3} ?\(\d{2,3}\) ?\d{3}-\d{2}-\d{2}$/;

  // Notes: letters, digits, whitespace and punctuation marks only —
  // no symbols like @ # $ % ^ & * _ = + < > / \ | ~ ` { } [ ] or emoji.
  const NOTES_FORBIDDEN_RE = /[^\p{L}\p{N}\s.,!?:;'"«»()\-–—…]/gu;

  const MESSAGES = {
    name: "Letters only, starting with a capital letter (e.g. Anna).",
    phone: "Format: +country (operator) xxx-xx-xx, e.g. +380 (67) 123-45-67.",
    notes: "Only letters, numbers and punctuation (. , ! ? : ; - ' \" ( )) are allowed.",
  };

  function isValidName(value) {
    const v = value.trim();
    return v.length >= 2 && NAME_RE.test(v);
  }

  function isValidPhone(value) {
    return PHONE_RE.test(value.trim());
  }

  function isValidNotes(value) {
    return !new RegExp(NOTES_FORBIDDEN_RE.source, "u").test(value);
  }

  const CHECKS = {
    name: isValidName,
    phone: isValidPhone,
    notes: isValidNotes,
  };

  function validateOne(fieldName) {
    const field = form.elements[fieldName];
    return validateField(field, CHECKS[fieldName](field.value), MESSAGES[fieldName]);
  }

  function validate() {
    let ok = true;
    Object.keys(CHECKS).forEach((n) => {
      ok = validateOne(n) && ok;
    });
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
    const doneBtn = modal.querySelector("#orderCloseSuccessBtn");
    doneBtn.classList.remove("is-loading", "is-success");
    doneBtn.disabled = false;
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
      <div class="order-modal" role="dialog" aria-modal="true" aria-label="Place an order">
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
              <input type="text" id="orderName" name="name" autocomplete="name" autocapitalize="words" placeholder="Anna" maxlength="40" aria-describedby="orderNameError" />
              <span class="error" id="orderNameError" aria-live="polite"></span>
            </div>

            <div class="order-field">
              <label for="orderPhone">Phone</label>
              <input type="tel" id="orderPhone" name="phone" autocomplete="tel" inputmode="tel" placeholder="+380 (67) 123-45-67" maxlength="22" aria-describedby="orderPhoneHint orderPhoneError" />
              <span class="hint" id="orderPhoneHint">Format: +380 (67) 123-45-67</span>
              <span class="error" id="orderPhoneError" aria-live="polite"></span>
            </div>
          </div>

          <div class="order-field">
            <label for="orderNotes">Notes (optional)</label>
            <textarea id="orderNotes" name="notes" maxlength="300" placeholder="Oat milk, extra hot, no whipped cream…" aria-describedby="orderNotesError"></textarea>
            <span class="error" id="orderNotesError" aria-live="polite"></span>
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
          <button type="button" class="done-btn" id="orderCloseSuccessBtn">
            <span class="done-btn__spinner" aria-hidden="true"></span>
            <span class="done-btn__icon" aria-hidden="true">${getIcon("car")}</span>
            <span class="done-btn__label">Done</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    modal = backdrop.querySelector(".order-modal");
    form = backdrop.querySelector("#orderForm");
  }

  function playDoneAnimation(btn) {
    if (btn.classList.contains("is-loading")) return; // already animating
    btn.disabled = true;
    btn.classList.add("is-loading");
    setTimeout(() => {
      btn.classList.remove("is-loading");
      btn.classList.add("is-success");
      setTimeout(() => {
        close();
        // reset so the next order shows the idle state again
        btn.classList.remove("is-success");
        btn.disabled = false;
      }, 500);
    }, 800);
  }

  function init() {
    buildMarkup();

    modal.querySelector("#qtyMinus").addEventListener("click", () => setQty(qty - 1));
    modal.querySelector("#qtyPlus").addEventListener("click", () => setQty(qty + 1));
    modal.querySelectorAll(".order-size").forEach((btn) => {
      btn.addEventListener("click", () => setSize(btn.dataset.size));
    });

    // Strip disallowed characters as the person types, instead of only
    // complaining after they hit submit. Bound to keyup/paste too (not just
    // "input") since some mobile keyboards — predictive text, swipe-typing,
    // autocorrect suggestions — insert text in ways that don't reliably
    // fire a plain "input" event on every device.
    const sanitizeName = (e) => {
      const el = e.target;
      const cleaned = el.value.replace(/[^\p{L}\s]/gu, "");
      if (cleaned !== el.value) el.value = cleaned;
    };
    const sanitizePhone = (e) => {
      const el = e.target;
      let cleaned = el.value.replace(/[^\d+\-() ]/g, "");
      if (cleaned.length > 0) cleaned = cleaned[0] + cleaned.slice(1).replace(/\+/g, ""); // only a leading "+" is allowed
      if (cleaned.length > 0 && cleaned[0] !== "+") cleaned = "+" + cleaned.replace(/\+/g, "");
      if (cleaned !== el.value) el.value = cleaned;
    };
    const sanitizeNotes = (e) => {
      const el = e.target;
      const cleaned = el.value.replace(NOTES_FORBIDDEN_RE, "");
      if (cleaned !== el.value) el.value = cleaned;
    };
    ["input", "keyup", "paste", "change", "compositionend"].forEach((evt) => {
      form.elements.name.addEventListener(evt, sanitizeName);
      form.elements.phone.addEventListener(evt, sanitizePhone);
      form.elements.notes.addEventListener(evt, sanitizeNotes);
    });

    // Show the error as soon as the person leaves a field, and clear it
    // live once the value becomes valid.
    Object.keys(CHECKS).forEach((n) => {
      const el = form.elements[n];
      el.addEventListener("blur", () => {
        if (el.value.trim() !== "" || n !== "notes") validateOne(n);
      });
      el.addEventListener("input", () => {
        if (el.closest(".order-field").classList.contains("has-error")) validateOne(n);
      });
    });

    form.addEventListener("submit", onSubmit);
    modal.querySelector("#orderCloseBtn").addEventListener("click", close);
    modal.querySelector("#orderCloseSuccessBtn").addEventListener("click", (e) => playDoneAnimation(e.currentTarget));
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && backdrop.classList.contains("is-open")) close();
    });

    // Single shared "Add to order" button — always reflects whichever
    // drink is currently active in the carousel.
    const trigger = document.getElementById("addToOrderBtn");
    if (trigger) {
      trigger.addEventListener("click", () => open(Carousel.getActiveProduct()));
    }
  }

  return { init, open, close };
})();
