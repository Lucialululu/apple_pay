(() => {
  "use strict";

  const DATA = window.__SHOP__;
  const PRODUCTS = DATA.products;
  const SNACKS = DATA.snacks;
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const snackById = Object.fromEntries(SNACKS.map((s) => [s.id, s]));

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
  const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";

  const money = (n) => `$ ${n.toFixed(2)} USD`;
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ------------------------------------------------------------------ */
  /* Cart state (kept in this browser only)                              */
  /* ------------------------------------------------------------------ */
  const STORE_KEY = "hammie-cart-v1";
  let cart = [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    if (Array.isArray(saved)) cart = saved.filter((l) => byId[l.id] && snackById[l.snack] && l.qty > 0);
  } catch (e) { /* storage unavailable: cart lives in memory */ }

  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (e) {} };
  const cartCount = () => cart.reduce((n, l) => n + l.qty, 0);
  const cartTotal = () => cart.reduce((n, l) => n + l.qty * byId[l.id].price, 0);

  function addToCart(id, snack, qty) {
    const key = `${id}:${snack}`;
    const line = cart.find((l) => l.key === key);
    if (line) line.qty = Math.min(99, line.qty + qty);
    else cart.push({ key, id, snack, qty, fresh: true });
    save();
    updateBadge(true);
    renderCart();
  }

  /* ------------------------------------------------------------------ */
  /* Announcement + nav                                                  */
  /* ------------------------------------------------------------------ */
  $("#announceClose").addEventListener("click", () => $("#announce").classList.add("closed"));

  const pagesBtn = $("#pagesBtn");
  const pagesMenu = $("#pagesMenu");
  function setMenu(open) {
    pagesMenu.classList.toggle("open", open);
    pagesBtn.setAttribute("aria-expanded", String(open));
    if (open) pagesMenu.querySelector("button").focus({ preventScroll: true });
  }
  pagesBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenu(!pagesMenu.classList.contains("open"));
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".menu")) setMenu(false);
  });

  // Every [data-go] element routes through here.
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-go]");
    if (!el) return;
    e.preventDefault();
    setMenu(false);
    const go = el.dataset.go;
    if (go === "home") return showHome("top");
    if (go === "shop") return showHome("shop");
    if (go === "about") return showHome("about");
    if (go === "sale") { setSort("sale"); return showHome("shop"); }
    if (go === "random") {
      const p = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      return openProduct(p.id);
    }
  });

  /* ------------------------------------------------------------------ */
  /* Hero: hamsters hanging from cables, swaying, with spring parallax   */
  /* ------------------------------------------------------------------ */
  const heroArt = $("#heroArt");
  const hangers = [
    { id: "queen", left: 17, width: 25, len: "clamp(50px, 13vh, 150px)", amp: "3deg", dur: "5.2s", delay: "-1.4s", depth: 26, in: ".25s" },
    { id: "happy", left: 51, width: 44, len: "clamp(80px, 25vh, 260px)", amp: "1.6deg", dur: "6.4s", delay: "-3s", depth: 14, in: ".1s" },
    { id: "tongue", left: 85, width: 24, len: "clamp(24px, 6vh, 80px)", amp: "2.6deg", dur: "5.8s", delay: "-0.6s", depth: 22, in: ".4s" },
  ];
  const floaties = [
    { snack: "pizza", x: 8, y: 66, s: "clamp(44px, 5vw, 72px)", dur: "4.6s", delay: "-1s", depth: 40, in: ".55s" },
    { snack: "apple", x: 80, y: 72, s: "clamp(40px, 4.4vw, 64px)", dur: "5.4s", delay: "-2.4s", depth: 46, in: ".65s" },
    { snack: "lemon", x: 30, y: 84, s: "clamp(30px, 3.2vw, 48px)", dur: "4.2s", delay: "-.4s", depth: 34, in: ".75s" },
    { snack: "eggplant", x: 64, y: 88, s: "clamp(34px, 3.6vw, 54px)", dur: "6s", delay: "-3.2s", depth: 30, in: ".85s" },
  ];

  const layers = [];
  hangers.forEach((h) => {
    const p = byId[h.id];
    const layer = document.createElement("div");
    layer.className = "layer";
    layer.style.cssText = `left:${h.left}%;width:${h.width}%;margin-left:-${h.width / 2}%;--in:${h.in}`;
    layer.innerHTML = `
      <div class="swing" style="--amp:${h.amp};--dur:${h.dur};--delay:${h.delay}">
        <div class="cable" style="--len:${h.len}"></div>
        <div class="hook"></div>
        <div class="tag-frame"><div class="paper" style="aspect-ratio:1"><img src="${p.img}" alt=""></div></div>
      </div>`;
    heroArt.appendChild(layer);
    layers.push({ el: layer, depth: h.depth });
  });
  floaties.forEach((f) => {
    const wrap = document.createElement("div");
    wrap.className = `floaty-wrap f-${f.snack}`;
    wrap.style.cssText = `left:${f.x}%;top:${f.y}%;--in:${f.in}`;
    wrap.innerHTML = `<div class="layer-inner"><img class="floaty" src="${snackById[f.snack].img}" alt="" style="--s:${f.s};--dur:${f.dur};--delay:${f.delay}"></div>`;
    heroArt.appendChild(wrap);
    layers.push({ el: wrap.firstElementChild, depth: f.depth });
  });
  requestAnimationFrame(() => heroArt.classList.add("ready"));

  // Spring toward the pointer: decorative, so it gets momentum instead of 1:1 tracking.
  if (!reduceMotion && finePointer) {
    let tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0;
    const STIFF = 0.045, DAMP = 0.84;
    const tick = () => {
      vx = (vx + (tx - x) * STIFF) * DAMP;
      vy = (vy + (ty - y) * STIFF) * DAMP;
      x += vx; y += vy;
      layers.forEach((l) => { l.el.style.transform = `translate3d(${(x * l.depth).toFixed(2)}px, ${(y * l.depth * 0.6).toFixed(2)}px, 0)`; });
      if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(vx) + Math.abs(vy) > 0.0005) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    $(".hero").addEventListener("pointermove", (e) => {
      const r = heroArt.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      kick();
    });
    $(".hero").addEventListener("pointerleave", () => { tx = 0; ty = 0; kick(); });
  }

  /* Marquee of moods (content doubled for a seamless loop). */
  const moods = PRODUCTS.map((p) => p.mood.toUpperCase());
  $("#marquee").innerHTML = [...moods, ...moods].map((m) => `<span>${esc(m)}</span>`).join("");

  /* ------------------------------------------------------------------ */
  /* Product grid with sort/filter (FLIP-animated) and scroll reveal     */
  /* ------------------------------------------------------------------ */
  let sortMode = "featured";
  const grid = $("#grid");
  const seg = $("#seg");
  const segInd = $(".seg-ind", seg);

  function priceHTML(p) {
    return `${money(p.price)}${p.compare ? `<s aria-label="was">${money(p.compare)}</s>` : ""}`;
  }

  function cardHTML(p) {
    return `
      <div class="media-wrap">
        <button class="frame card-media" data-open="${p.id}" aria-label="View ${esc(p.name)}">
          <span class="paper"><img src="${p.img}" alt="${esc(p.name)}: hand-drawn hamster looking ${esc(p.mood.toLowerCase())}" loading="lazy" decoding="async"></span>
          <span class="num">NO. ${pad(p.no)}</span>
          ${p.compare ? `<span class="sale-tag">SALE</span>` : ""}
        </button>
        <button class="quick-add" data-add="${p.id}" aria-label="Add ${esc(p.name)} to cart">+ ADD</button>
      </div>
      <h3 class="card-name">${esc(p.name)}</h3>
      <p class="card-mood">${esc(p.mood)}</p>
      <p class="price">${priceHTML(p)}</p>`;
  }

  const revealer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("in");
          revealer.unobserve(en.target);
        });
      }, { rootMargin: "0px 0px -60px 0px" })
    : null;

  function makeCard(p, index, reveal) {
    const el = document.createElement("article");
    el.className = "card";
    el.dataset.id = p.id;
    el.innerHTML = cardHTML(p);
    if (reveal && revealer) {
      el.classList.add("reveal");
      el.style.setProperty("--sd", `${(index % 4) * 70}ms`);
      revealer.observe(el);
    }
    return el;
  }

  function visibleProducts() {
    let list = [...PRODUCTS];
    if (sortMode === "sale") list = list.filter((p) => p.compare);
    if (sortMode === "low") list.sort((a, b) => a.price - b.price);
    if (sortMode === "high") list.sort((a, b) => b.price - a.price);
    return list;
  }

  function renderGrid(animate) {
    const before = new Map();
    if (animate) $$(".card", grid).forEach((c) => before.set(c.dataset.id, c.getBoundingClientRect()));
    const existing = new Map($$(".card", grid).map((c) => [c.dataset.id, c]));
    const list = visibleProducts();
    const frag = document.createDocumentFragment();
    const fresh = new Set();
    list.forEach((p, i) => {
      let el = existing.get(p.id);
      if (el) existing.delete(p.id);
      else { el = makeCard(p, i, !animate); fresh.add(p.id); }
      frag.appendChild(el);
    });
    existing.forEach((el) => el.remove());
    grid.appendChild(frag);

    const n = list.length;
    $("#count").textContent = sortMode === "sale" ? `${n} HAMSTERS ON SALE` : `${n} HAMSTERS, ALL ORIGINALS`;

    if (!animate || reduceMotion) return;
    list.forEach((p, i) => {
      const el = grid.children[i];
      if (fresh.has(p.id)) {
        el.animate([{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }],
          { duration: 320, delay: 120, easing: EASE_OUT, fill: "backwards" });
        return;
      }
      el.classList.add("in");
      const f = before.get(p.id);
      const l = el.getBoundingClientRect();
      const dx = f.left - l.left, dy = f.top - l.top;
      if (dx || dy) {
        el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
          { duration: 520, easing: EASE_IN_OUT });
      }
    });
  }

  function moveSegIndicator() {
    const btn = $(`[data-sort="${sortMode}"]`, seg);
    segInd.style.width = `${btn.offsetWidth}px`;
    segInd.style.transform = `translateX(${btn.offsetLeft}px)`;
  }

  function setSort(mode) {
    if (mode === sortMode) return;
    sortMode = mode;
    $$("button", seg).forEach((b) => b.setAttribute("aria-checked", String(b.dataset.sort === mode)));
    moveSegIndicator();
    renderGrid(true);
  }

  seg.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sort]");
    if (b) setSort(b.dataset.sort);
  });
  seg.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const btns = $$("button", seg);
    const i = btns.findIndex((b) => b.dataset.sort === sortMode);
    const next = btns[(i + (e.key === "ArrowRight" ? 1 : -1) + btns.length) % btns.length];
    next.focus();
    setSort(next.dataset.sort);
  });

  renderGrid(false);
  segInd.style.transition = "none";
  moveSegIndicator();
  requestAnimationFrame(() => { segInd.style.transition = ""; });
  addEventListener("resize", moveSegIndicator);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveSegIndicator);

  // Grid clicks: open a product, or quick-add with the default snack.
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      const id = add.dataset.add;
      const img = add.closest(".media-wrap").querySelector("img");
      flyToCart(img, byId[id].img);
      addToCart(id, SNACKS[0].id, 1);
      showToast(id, SNACKS[0].id, 1);
      return;
    }
    const open = e.target.closest("[data-open]");
    if (open) openProduct(open.dataset.open);
  });

  /* ------------------------------------------------------------------ */
  /* Views: home <-> product detail                                      */
  /* ------------------------------------------------------------------ */
  const home = $("#home");
  const detail = $("#detail");
  let lastHomeScroll = 0;

  function enter(view) {
    view.classList.remove("view-enter");
    void view.offsetWidth;
    view.classList.add("view-enter");
  }

  function showHome(anchor) {
    const wasDetail = !detail.hidden;
    if (wasDetail) {
      detail.hidden = true;
      home.hidden = false;
      enter(home);
    }
    if (anchor === "back") {
      scrollTo({ top: lastHomeScroll, behavior: "instant" });
      return;
    }
    const target = anchor === "top" ? 0 : $(`#${anchor}`).getBoundingClientRect().top + scrollY - $("#nav").offsetHeight + 1;
    scrollTo({ top: target, behavior: wasDetail || reduceMotion ? "instant" : "smooth" });
  }

  function openProduct(id) {
    const p = byId[id];
    if (!p) return;
    if (!home.hidden) lastHomeScroll = scrollY;
    let snack = SNACKS[0].id;
    let qty = 1;

    const others = PRODUCTS.filter((o) => o.id !== id);
    const start = (PRODUCTS.indexOf(p) * 5) % others.length;
    const related = [0, 1, 2, 3].map((k) => others[(start + k * 4) % others.length]);

    detail.innerHTML = `
      <div class="shell detail-wrap">
        <button class="back" data-back><span class="arr">←</span> ALL HAMSTERS</button>
        <div class="detail-grid">
          <div class="detail-media">
            <div class="frame" id="tilt"><div class="paper"><img src="${p.img}" alt="${esc(p.name)}: hand-drawn hamster looking ${esc(p.mood.toLowerCase())}"></div></div>
          </div>
          <div class="detail-info">
            <p class="eyebrow mono">NO. ${pad(p.no)} / ${pad(PRODUCTS.length)} · MOOD: ${esc(p.mood.toUpperCase())}</p>
            <h1 class="detail-title">${esc(p.name)}</h1>
            <p class="detail-price">${priceHTML(p)}</p>
            <p class="desc">${esc(p.blurb)}</p>
            <p class="specs">• Hand-drawn original • One of ${PRODUCTS.length} moods • Ships with a snack of your choice • 100% hamster, 0% assembly</p>
            <div class="box">
              <p class="box-label" id="snackLabel">SELECT SNACK</p>
              <div class="chips" role="radiogroup" aria-labelledby="snackLabel">
                ${SNACKS.map((s, i) => `
                  <button class="chip" role="radio" aria-checked="${i === 0}" data-snack="${s.id}">
                    <img src="${s.img}" alt="">${esc(s.name)}
                  </button>`).join("")}
              </div>
            </div>
            <div class="box buyrow">
              <div class="step" aria-label="Quantity">
                <button data-step="-1" aria-label="Decrease quantity">−</button>
                <output id="qty" aria-live="polite">1</output>
                <button data-step="1" aria-label="Increase quantity">+</button>
              </div>
              <button class="btn-iri add-btn" id="addBtn">
                <span><span class="label idle">ADD TO CART</span><span class="label done" aria-hidden="true">ADDED ✓</span></span>
              </button>
            </div>
            <p class="ship-note muted">FREE SHIPPING ON EVERY HAMSTER, ANYWHERE</p>
            <div class="acc">
              <button class="acc-btn" aria-expanded="false" aria-controls="accBody" id="accBtn">Hamster Guide <span class="plus" aria-hidden="true"></span></button>
              <div class="acc-body" id="accBody" role="region" aria-labelledby="accBtn">
                <div>
                  <dl>
                    <dt>POCKET</dt><dd>Fits in a jacket pocket. Will complain about the lint.</dd>
                    <dt>DESK</dt><dd>Sits next to your monitor and silently judges your tabs.</dd>
                    <dt>HEART</dt><dd>Infinitely large. One size fits all.</dd>
                    <dt>CARE</dt><dd>Feed the included snack. Do not get wet. Do not feed after midnight, just in case.</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section class="related" aria-label="More hamsters">
          <h2>You might also adopt</h2>
          <div class="grid" id="relatedGrid"></div>
        </section>
      </div>`;

    const rg = $("#relatedGrid", detail);
    related.forEach((o, i) => rg.appendChild(makeCard(o, i, true)));

    home.hidden = true;
    detail.hidden = false;
    scrollTo({ top: 0, behavior: "instant" });
    enter(detail);

    // Snack picker
    const chips = $$(".chip", detail);
    chips.forEach((c) => c.addEventListener("click", () => {
      snack = c.dataset.snack;
      chips.forEach((o) => o.setAttribute("aria-checked", String(o === c)));
    }));

    // Quantity
    const out = $("#qty", detail);
    $$("[data-step]", detail).forEach((b) => b.addEventListener("click", () => {
      qty = Math.max(1, Math.min(99, qty + Number(b.dataset.step)));
      out.textContent = qty;
    }));

    // Add to cart: label morphs to ADDED, the chosen snack flies to the cart.
    const addBtn = $("#addBtn", detail);
    let doneTimer = 0;
    addBtn.addEventListener("click", () => {
      const chip = chips.find((c) => c.dataset.snack === snack);
      flyToCart(chip.querySelector("img"), snackById[snack].img, true);
      addToCart(id, snack, qty);
      showToast(id, snack, qty);
      addBtn.classList.add("added");
      clearTimeout(doneTimer);
      doneTimer = setTimeout(() => addBtn.classList.remove("added"), 1400);
    });

    // Accordion
    const acc = $("#accBtn", detail);
    acc.addEventListener("click", () => acc.setAttribute("aria-expanded", String(acc.getAttribute("aria-expanded") !== "true")));

    $("[data-back]", detail).addEventListener("click", () => showHome("back"));
    setupTilt($("#tilt", detail));
  }

  // Decorative 3D tilt on the big product image, sprung so it has weight.
  function setupTilt(el) {
    if (reduceMotion || !finePointer || !el) return;
    let tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0;
    const tick = () => {
      vx = (vx + (tx - x) * 0.08) * 0.78;
      vy = (vy + (ty - y) * 0.08) * 0.78;
      x += vx; y += vy;
      el.style.transform = `rotateY(${(x * 7).toFixed(2)}deg) rotateX(${(-y * 7).toFixed(2)}deg)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(vx) + Math.abs(vy) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      kick();
    });
    el.addEventListener("pointerleave", () => { tx = 0; ty = 0; kick(); });
  }

  /* ------------------------------------------------------------------ */
  /* Fly-to-cart, badge bump, toast                                      */
  /* ------------------------------------------------------------------ */
  const cartBtn = $("#cartBtn");
  const badge = $("#badge");

  function flyToCart(fromEl, src, round) {
    if (reduceMotion || !fromEl) return;
    const a = fromEl.getBoundingClientRect();
    const b = $(".cart-icon", cartBtn).getBoundingClientRect();
    const size = Math.min(a.width, 120);
    const sx = a.left + a.width / 2 - size / 2, sy = a.top + a.height / 2 - size / 2;
    const ex = b.left + b.width / 2 - size / 2, ey = b.top + b.height / 2 - size / 2;

    // Two nested movers: x eases out, y eases in, which draws an arc.
    const fx = document.createElement("div");
    const fy = document.createElement("div");
    fx.className = "flyer-x"; fy.className = "flyer-y";
    fy.style.width = fy.style.height = `${size}px`;
    fy.innerHTML = `<img src="${src}" alt="" style="${round ? "background:none;box-shadow:none;object-fit:contain" : ""}">`;
    fx.appendChild(fy);
    document.body.appendChild(fx);

    const dur = 680;
    fx.animate([{ transform: `translateX(${sx}px)` }, { transform: `translateX(${ex}px)` }],
      { duration: dur, easing: "cubic-bezier(0.3, 0.7, 0.4, 1)", fill: "forwards" });
    const anim = fy.animate([
      { transform: `translateY(${sy}px) scale(1) rotate(0deg)`, opacity: 1 },
      { transform: `translateY(${sy - 60}px) scale(0.75) rotate(-8deg)`, opacity: 1, offset: 0.3 },
      { transform: `translateY(${ey}px) scale(0.18) rotate(12deg)`, opacity: 0.6 },
    ], { duration: dur, easing: "cubic-bezier(0.55, 0, 0.9, 0.5)", fill: "forwards" });
    anim.onfinish = () => {
      fx.remove();
      $(".cart-icon", cartBtn).animate(
        [{ transform: "rotate(0)" }, { transform: "rotate(-10deg) scale(1.08)" }, { transform: "rotate(7deg)" }, { transform: "rotate(0)" }],
        { duration: 420, easing: EASE_OUT });
    };
  }

  function updateBadge(bump) {
    const n = cartCount();
    badge.textContent = n > 99 ? "99+" : n;
    badge.classList.toggle("empty", n === 0);
    cartBtn.setAttribute("aria-label", n ? `Open cart, ${n} item${n === 1 ? "" : "s"}` : "Open cart");
    if (bump && n && !reduceMotion) {
      badge.animate([{ transform: "scale(1)" }, { transform: "scale(1.35)" }, { transform: "scale(1)" }],
        { duration: 360, delay: reduceMotion ? 0 : 560, easing: EASE_OUT });
    }
  }

  const toast = $("#toast");
  let toastTimer = 0;
  function showToast(id, snack, qty) {
    const p = byId[id];
    toast.innerHTML = `<img src="${p.img}" alt=""><span>${qty > 1 ? `${qty} × ` : ""}${esc(p.name)} added</span><img class="snack" src="${snackById[snack].img}" alt="">`;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  /* ------------------------------------------------------------------ */
  /* Cart drawer                                                         */
  /* ------------------------------------------------------------------ */
  const drawer = $("#drawer");
  const scrim = $("#scrim");
  const body = $("#drawerBody");
  const foot = $("#drawerFoot");
  let lastFocus = null;

  function openCart() {
    lastFocus = document.activeElement;
    renderCart();
    drawer.removeAttribute("inert");
    drawer.setAttribute("aria-hidden", "false");
    drawer.classList.add("open");
    scrim.classList.add("open");
    document.body.classList.add("locked");
    setTimeout(() => $("#drawerClose").focus({ preventScroll: true }), 50);
  }
  function closeCart() {
    if (!drawer.classList.contains("open")) return;
    drawer.classList.remove("open");
    scrim.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    drawer.setAttribute("inert", "");
    document.body.classList.remove("locked");
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  cartBtn.addEventListener("click", openCart);
  $("#drawerClose").addEventListener("click", closeCart);
  scrim.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (pagesMenu.classList.contains("open")) { setMenu(false); pagesBtn.focus(); return; }
    closeCart();
  });

  function renderCart() {
    const n = cartCount();
    $("#drawerCount").textContent = n ? `(${n})` : "";

    if (!cart.length) {
      const sad = byId.sad;
      body.innerHTML = `
        <div class="empty-state">
          <div class="frame"><div class="paper" style="aspect-ratio:1"><img src="${sad.img}" alt=""></div></div>
          <h3>No hamsters yet</h3>
          <p>This one is sad about it. Go find a friend for it.</p>
          <button class="btn-iri" data-browse><span>BROWSE HAMSTERS</span></button>
        </div>`;
      foot.innerHTML = "";
      $("[data-browse]", body).addEventListener("click", () => { closeCart(); showHome("shop"); });
      return;
    }

    body.innerHTML = cart.map((l) => {
      const p = byId[l.id], s = snackById[l.snack];
      return `
        <div class="cart-line ${l.fresh ? "entering" : ""}" data-key="${l.key}">
          <button class="frame" data-open-from-cart="${p.id}" aria-label="View ${esc(p.name)}"><span class="paper" style="aspect-ratio:1"><img src="${p.img}" alt=""></span></button>
          <div>
            <div class="line-top">
              <p class="line-name">${esc(p.name)}</p>
              <p class="line-price">$ ${(p.price * l.qty).toFixed(2)}</p>
            </div>
            <p class="line-snack"><img src="${s.img}" alt="">with ${esc(s.name.toLowerCase())}</p>
            <div class="line-bottom">
              <div class="step sm" aria-label="Quantity of ${esc(p.name)}">
                <button data-line-step="-1" aria-label="Decrease">−</button>
                <output>${l.qty}</output>
                <button data-line-step="1" aria-label="Increase">+</button>
              </div>
              <button class="link-btn" data-remove>REMOVE</button>
            </div>
          </div>
        </div>`;
    }).join("");
    cart.forEach((l) => delete l.fresh);

    const total = cartTotal();
    foot.innerHTML = `
      <div class="sum-row"><span>SUBTOTAL</span><span>${money(total)}</span></div>
      <div class="sum-row"><span>SHIPPING</span><span>FREE</span></div>
      <div class="sum-row total"><span>TOTAL</span><span>${money(total)}</span></div>
      <button class="btn-iri wide" id="checkout"><span>CHECKOUT</span></button>`;
    $("#checkout").addEventListener("click", checkout);
  }

  body.addEventListener("click", (e) => {
    const lineEl = e.target.closest(".cart-line");
    const openBtn = e.target.closest("[data-open-from-cart]");
    if (openBtn) { closeCart(); openProduct(openBtn.dataset.openFromCart); return; }
    if (!lineEl) return;
    const line = cart.find((l) => l.key === lineEl.dataset.key);
    if (!line) return;
    const step = e.target.closest("[data-line-step]");
    if (step) {
      line.qty += Number(step.dataset.lineStep);
      if (line.qty < 1) return removeLine(lineEl, line);
      line.qty = Math.min(99, line.qty);
      save(); updateBadge(false); renderCart();
      const again = $(`[data-key="${line.key}"] [data-line-step="${step.dataset.lineStep}"]`, body);
      if (again) again.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest("[data-remove]")) removeLine(lineEl, line);
  });

  function removeLine(el, line) {
    cart = cart.filter((l) => l !== line);
    save(); updateBadge(false);
    if (reduceMotion) return renderCart();
    el.classList.add("leaving");
    setTimeout(renderCart, 220);
  }

  function checkout() {
    const count = cartCount();
    const total = cartTotal();
    cart = [];
    save();
    updateBadge(false);
    $("#drawerCount").textContent = "";
    const happy = byId.happy;
    body.innerHTML = `
      <div class="empty-state">
        <div class="frame"><div class="paper" style="aspect-ratio:1"><img src="${happy.img}" alt=""></div></div>
        <h3>Adoption complete!</h3>
        <p>${count} hamster${count === 1 ? "" : "s"} for ${money(total)}. Pretend ones, of course: this shop is just for fun.</p>
        <button class="btn-iri" data-browse><span>KEEP BROWSING</span></button>
      </div>`;
    foot.innerHTML = "";
    $("[data-browse]", body).addEventListener("click", () => { closeCart(); showHome("shop"); });
    confetti();
  }

  // A rare, celebratory moment, so it is allowed to be a little extra.
  function confetti() {
    if (reduceMotion) return;
    const W = innerWidth, H = innerHeight;
    for (let i = 0; i < 28; i++) {
      const s = SNACKS[i % SNACKS.length];
      const img = document.createElement("img");
      img.className = "confetti";
      img.src = s.img;
      img.alt = "";
      const size = 26 + Math.random() * 26;
      img.style.width = `${size}px`;
      img.style.left = `${Math.random() * (W - size)}px`;
      document.body.appendChild(img);
      const drift = (Math.random() - 0.5) * 220;
      const spin = (Math.random() - 0.5) * 900;
      img.animate([
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${drift}px, ${H + 120}px) rotate(${spin}deg)`, opacity: 1 },
      ], {
        duration: 1500 + Math.random() * 1100,
        delay: Math.random() * 450,
        easing: "cubic-bezier(0.35, 0.1, 0.65, 1)",
        fill: "backwards",
      }).onfinish = () => img.remove();
    }
  }

  updateBadge(false);
  renderCart();
})();
