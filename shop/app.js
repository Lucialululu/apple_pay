(() => {
  "use strict";

  const DATA = window.__SHOP__;
  const PRODUCTS = DATA.products;
  const FRUIT = DATA.fruit;
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
  const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";

  const money = (n) => `$ ${n.toFixed(2)} USD`;
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Everything the shop remembers lives in this browser only.
  function load(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (e) { return fallback; }
  }
  function store(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  const saved = new Set(load("hammie-saved", []).filter((id) => byId[id]));

  /* ------------------------------------------------------------------ */
  /* Discount codes (won on the wheel, or typed in the cart)             */
  /* ------------------------------------------------------------------ */
  const CODES = { SQUEAK5: 5, SQUEAK10: 10, SQUEAK15: 15, SQUEAK20: 20, SQUEAK25: 25, SQUEAK30: 30, HAMMIE10: 10 };
  let discount = load("hammie-code", null);
  if (!discount || !CODES[discount.code]) discount = null;

  function applyCode(raw) {
    const code = String(raw).trim().toUpperCase().replace(/\s+/g, "");
    if (!CODES[code]) return false;
    discount = { code, pct: CODES[code] };
    store("hammie-code", discount);
    return true;
  }
  function removeCode() {
    discount = null;
    store("hammie-code", null);
  }
  function totals() {
    const subtotal = cartTotal();
    const pct = discount ? discount.pct : 0;
    const off = Math.round(subtotal * pct) / 100;
    return { subtotal, pct, off, total: Math.round((subtotal - off) * 100) / 100 };
  }
  const STICKER_GOAL = 150;

  /* ------------------------------------------------------------------ */
  /* Cart state                                                          */
  /* ------------------------------------------------------------------ */
  const STORE_KEY = "hammie-cart-v2";
  let cart = [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    if (Array.isArray(saved)) cart = saved.filter((l) => byId[l.id] && l.qty > 0);
  } catch (e) { /* storage unavailable: cart lives in memory */ }

  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (e) {} };
  const cartCount = () => cart.reduce((n, l) => n + l.qty, 0);
  const cartTotal = () => cart.reduce((n, l) => n + l.qty * byId[l.id].price, 0);

  function addToCart(id, qty) {
    const line = cart.find((l) => l.key === id);
    if (line) line.qty = Math.min(99, line.qty + qty);
    else cart.push({ key: id, id, qty, fresh: true });
    save();
    updateBadge(true);
    renderCart();
  }

  /* ------------------------------------------------------------------ */
  /* Announcement + nav                                                  */
  /* ------------------------------------------------------------------ */
  $("#logoImg").src = DATA.logo;

  // The announcement bar cycles through a few messages; hovering pauses it.
  const announce = $("#announce");
  const msgs = $$("#announceMsgs p");
  let msgIndex = 0, msgPaused = false;
  const msgTimer = setInterval(() => {
    if (msgPaused || announce.classList.contains("closed")) return;
    msgs[msgIndex].classList.remove("on");
    msgIndex = (msgIndex + 1) % msgs.length;
    msgs[msgIndex].classList.add("on");
  }, 4500);
  announce.addEventListener("pointerenter", () => { msgPaused = true; });
  announce.addEventListener("pointerleave", () => { msgPaused = false; });
  announce.addEventListener("focusin", () => { msgPaused = true; });
  announce.addEventListener("focusout", () => { msgPaused = false; });
  $("#announceClose").addEventListener("click", () => { announce.classList.add("closed"); clearInterval(msgTimer); });

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
    if (go === "sale") { setFilter("sale"); return showHome("shop"); }
    if (go === "new") { setFilter("new"); return showHome("shop"); }
    if (go === "wheel") return openWheel();
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
    // Back row first, so the front tags overlap their cables.
    { id: "glad", left: 13, width: 19, len: "clamp(260px, 50vh, 470px)", amp: "2.2deg", dur: "7s", delay: "-2s", depth: 8, in: ".5s", cls: "back" },
    { id: "guitar", left: 87, width: 19, len: "clamp(220px, 40vh, 380px)", amp: "2.4deg", dur: "6.6s", delay: "-4s", depth: 10, in: ".6s", cls: "back" },
    { id: "queen", left: 17, width: 25, len: "clamp(50px, 13vh, 150px)", amp: "3deg", dur: "5.2s", delay: "-1.4s", depth: 26, in: ".25s" },
    { id: "happy", left: 51, width: 44, len: "clamp(80px, 25vh, 260px)", amp: "1.6deg", dur: "6.4s", delay: "-3s", depth: 14, in: ".1s" },
    { id: "tongue", left: 85, width: 24, len: "clamp(24px, 6vh, 80px)", amp: "2.6deg", dur: "5.8s", delay: "-0.6s", depth: 22, in: ".4s" },
  ];
  const layers = [];
  hangers.forEach((h) => {
    const p = byId[h.id];
    const layer = document.createElement("div");
    layer.className = `layer ${h.cls || ""}`;
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
  $("#marquee").style.animationDuration = `${moods.length * 3.4}s`;

  /* ------------------------------------------------------------------ */
  /* Product grid with sort/filter (FLIP-animated) and scroll reveal     */
  /* ------------------------------------------------------------------ */
  let sortMode = "featured";
  let filter = "all";
  let query = "";
  const grid = $("#grid");
  const seg = $("#seg");
  const segInd = $(".seg-ind", seg);
  const filtersEl = $("#filters");
  const searchEl = $("#search");
  const noResults = $("#noResults");

  const HEART = `<svg viewBox="0 0 24 22" aria-hidden="true"><path d="M12 20.5S2 14.4 2 7.6A5.1 5.1 0 0 1 7.2 2.5c2 0 3.7 1.1 4.8 2.8 1.1-1.7 2.8-2.8 4.8-2.8A5.1 5.1 0 0 1 22 7.6c0 6.8-10 12.9-10 12.9z"/></svg>`;

  function priceHTML(p) {
    return `${money(p.price)}${p.compare ? `<s aria-label="was">${money(p.compare)}</s>` : ""}`;
  }

  function heartButton(p, extraClass = "") {
    const on = saved.has(p.id);
    return `<button class="heart ${extraClass} ${on ? "on" : ""}" data-save="${p.id}" aria-pressed="${on}" aria-label="Save ${esc(p.name)}">${HEART}</button>`;
  }

  function cardHTML(p) {
    return `
      <div class="media-wrap">
        <button class="frame card-media" data-open="${p.id}" aria-label="View ${esc(p.name)}">
          <span class="paper"><img src="${p.img}" alt="${esc(p.name)}: hand-drawn hamster looking ${esc(p.mood.toLowerCase())}" loading="lazy" decoding="async"></span>
          <span class="num">NO. ${pad(p.no)}</span>
          <span class="tags">${p.new ? `<span class="new-tag">NEW</span>` : ""}${p.compare ? `<span class="sale-tag">SALE</span>` : ""}</span>
        </button>
        ${heartButton(p)}
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

  /* Filters: All, New (the latest drop), On sale, Saved. */
  const FILTERS = [
    { id: "all", label: "All", test: () => true },
    { id: "new", label: "New", isNew: true, test: (p) => p.new },
    { id: "sale", label: "On sale", test: (p) => !!p.compare },
    { id: "saved", label: "Saved", test: (p) => saved.has(p.id) },
  ];
  const filterById = Object.fromEntries(FILTERS.map((f) => [f.id, f]));

  function renderFilters() {
    filtersEl.innerHTML = FILTERS.map((f) => {
      const n = PRODUCTS.filter(f.test).length;
      return `<button role="radio" aria-checked="${f.id === filter}" data-filter="${f.id}">
        ${f.isNew ? `<span class="chip-new">NEW</span>` : esc(f.label)}<span class="f-count">${n}</span>
      </button>`;
    }).join("");
  }
  function updateFilterCounts() {
    FILTERS.forEach((f) => {
      const el = $(`[data-filter="${f.id}"] .f-count`, filtersEl);
      if (el) el.textContent = PRODUCTS.filter(f.test).length;
    });
  }

  function matches(p) {
    if (!filterById[filter].test(p)) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return `${p.name} ${p.mood}`.toLowerCase().includes(q);
  }

  function visibleProducts() {
    const list = PRODUCTS.filter(matches);
    if (sortMode === "low") list.sort((a, b) => a.price - b.price);
    if (sortMode === "high") list.sort((a, b) => b.price - a.price);
    return list;
  }

  function renderNoResults(show) {
    noResults.hidden = !show;
    if (!show) return;
    const savedEmpty = filter === "saved" && !query;
    const face = savedEmpty ? byId.sad : (byId.idek || byId.idk);
    noResults.innerHTML = `
      <div class="frame"><div class="paper" style="aspect-ratio:1"><img src="${face.img}" alt=""></div></div>
      <h3>${savedEmpty ? "Nothing saved yet" : `No hamster feels like “${esc(query || filterById[filter].label)}” yet`}</h3>
      <p class="muted">${savedEmpty ? "Tap the heart on any hamster to keep it here for later." : "Try another mood, like sad, smug or cooked."}</p>
      <button class="btn-iri" data-clear-filters><span>SHOW ALL HAMSTERS</span></button>`;
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
    const narrowed = filter !== "all" || query;
    $("#count").textContent = narrowed ? `${n} OF ${PRODUCTS.length} HAMSTERS` : `${n} HAMSTERS, ALL ORIGINALS`;
    renderNoResults(n === 0);

    if (!animate || reduceMotion) return;
    list.forEach((p, i) => {
      const el = grid.children[i];
      if (fresh.has(p.id)) {
        el.classList.add("in");
        el.animate([{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }],
          { duration: 320, delay: Math.min(i, 8) * 30 + 80, easing: EASE_OUT, fill: "backwards" });
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

  function setFilter(id) {
    if (!filterById[id]) return;
    filter = id;
    $$("[data-filter]", filtersEl).forEach((b) => b.setAttribute("aria-checked", String(b.dataset.filter === id)));
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
  filtersEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-filter]");
    if (b) setFilter(b.dataset.filter);
  });
  noResults.addEventListener("click", (e) => {
    if (!e.target.closest("[data-clear-filters]")) return;
    searchEl.value = "";
    query = "";
    setFilter("all");
  });

  // Search: filters as you type. "/" jumps to the field, Escape clears it.
  let searchTimer = 0;
  searchEl.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { query = searchEl.value.trim(); renderGrid(true); }, 140);
  });
  searchEl.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchEl.value) {
      e.stopPropagation();
      searchEl.value = "";
      query = "";
      renderGrid(true);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.metaKey || e.ctrlKey) return;
    if (e.target.closest("input, textarea") || !detail.hidden) return;
    e.preventDefault();
    searchEl.focus({ preventScroll: true });
    searchEl.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* Wishlist hearts: every heart for the same hamster stays in sync. */
  const savedBadge = $("#savedBadge");
  function updateSavedBadge() {
    savedBadge.textContent = saved.size;
    savedBadge.classList.toggle("empty", saved.size === 0);
    $("#savedBtn").setAttribute("aria-label", saved.size ? `Show saved hamsters, ${saved.size} saved` : "Show saved hamsters");
  }
  function toggleSave(id) {
    const p = byId[id];
    if (saved.has(id)) saved.delete(id); else saved.add(id);
    store("hammie-saved", [...saved]);
    const on = saved.has(id);
    $$(`[data-save="${id}"]`).forEach((b) => {
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", String(on));
      if (on && !reduceMotion) {
        b.querySelector("svg").animate(
          [{ transform: "scale(1)" }, { transform: "scale(1.35)" }, { transform: "scale(0.92)" }, { transform: "scale(1)" }],
          { duration: 420, easing: EASE_OUT });
        b.classList.remove("burst");
        void b.offsetWidth;
        b.classList.add("burst");
      }
    });
    updateSavedBadge();
    updateFilterCounts();
    if (on && !reduceMotion) {
      $(".heart-icon").animate([{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
        { duration: 360, delay: 120, easing: EASE_OUT });
    }
    showToast(id, 0, on ? `Saved ${p.name}` : `Removed ${p.name} from saved`);
    if (filter === "saved") renderGrid(true);
  }
  $("#savedBtn").addEventListener("click", () => {
    setFilter("saved");
    showHome("shop");
  });

  /* Recently viewed (last 4 product pages opened). */
  let recent = load("hammie-recent", []).filter((id) => byId[id]);
  function pushRecent(id) {
    recent = [id, ...recent.filter((x) => x !== id)].slice(0, 8);
    store("hammie-recent", recent);
  }
  function renderRecent() {
    const sec = $("#recent");
    const ids = recent.slice(0, 4);
    sec.hidden = ids.length === 0;
    const g = $("#recentGrid");
    g.innerHTML = "";
    ids.forEach((id, i) => g.appendChild(makeCard(byId[id], i, false)));
  }
  $("#recentClear").addEventListener("click", () => {
    recent = [];
    store("hammie-recent", recent);
    renderRecent();
  });

  renderFilters();
  renderGrid(false);
  renderRecent();
  updateSavedBadge();
  segInd.style.transition = "none";
  moveSegIndicator();
  requestAnimationFrame(() => { segInd.style.transition = ""; });
  addEventListener("resize", moveSegIndicator);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveSegIndicator);

  // Grid clicks: save, open a product, or quick-add one.
  document.addEventListener("click", (e) => {
    const heart = e.target.closest("[data-save]");
    if (heart) { toggleSave(heart.dataset.save); return; }
    const add = e.target.closest("[data-add]");
    if (add) {
      const id = add.dataset.add;
      const img = add.closest(".media-wrap").querySelector("img");
      flyToCart(img, byId[id].img);
      addToCart(id, 1);
      showToast(id, 1);
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
      renderRecent();
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
    pushRecent(id);
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
            <p class="eyebrow mono">NO. ${pad(p.no)} / ${pad(PRODUCTS.length)}${p.new ? " · NEW" : ""} · MOOD: ${esc(p.mood.toUpperCase())}</p>
            <h1 class="detail-title">${esc(p.name)}</h1>
            <p class="detail-price">${priceHTML(p)}</p>
            <p class="desc">${esc(p.blurb)}</p>
            <p class="specs">• Hand-drawn original • One of ${PRODUCTS.length} moods • Ships in a tiny cardboard box • 100% hamster, 0% assembly</p>
            <div class="box buyrow">
              <div class="step" aria-label="Quantity">
                <button data-step="-1" aria-label="Decrease quantity">−</button>
                <output id="qty" aria-live="polite">1</output>
                <button data-step="1" aria-label="Increase quantity">+</button>
              </div>
              <div class="buy-actions">
                ${heartButton(p, "heart-lg")}
                <button class="btn-iri add-btn" id="addBtn">
                  <span><span class="label idle">ADD TO CART</span><span class="label done" aria-hidden="true">ADDED ✓</span></span>
                </button>
              </div>
            </div>
            <p class="ship-note muted">FREE SHIPPING ON EVERY HAMSTER · FREE MYSTERY STICKER OVER $${STICKER_GOAL}</p>
            <div class="acc">
              <button class="acc-btn" aria-expanded="false" aria-controls="accBody" id="accBtn">Hamster Guide <span class="plus" aria-hidden="true"></span></button>
              <div class="acc-body" id="accBody" role="region" aria-labelledby="accBtn">
                <div>
                  <dl>
                    <dt>POCKET</dt><dd>Fits in a jacket pocket. Will complain about the lint.</dd>
                    <dt>DESK</dt><dd>Sits next to your monitor and silently judges your tabs.</dd>
                    <dt>HEART</dt><dd>Infinitely large. One size fits all.</dd>
                    <dt>CARE</dt><dd>Feed apples. Do not get wet. Do not feed after midnight, just in case.</dd>
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

    // Quantity
    const out = $("#qty", detail);
    $$("[data-step]", detail).forEach((b) => b.addEventListener("click", () => {
      qty = Math.max(1, Math.min(99, qty + Number(b.dataset.step)));
      out.textContent = qty;
    }));

    // Add to cart: label morphs to ADDED, the hamster flies to the cart.
    const addBtn = $("#addBtn", detail);
    let doneTimer = 0;
    addBtn.addEventListener("click", () => {
      flyToCart($("#tilt img", detail), p.img);
      addToCart(id, qty);
      showToast(id, qty);
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

  function flyToCart(fromEl, src) {
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
    fy.innerHTML = `<img src="${src}" alt="">`;
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
  function showToast(id, qty, text) {
    const p = byId[id];
    const label = text || `${qty > 1 ? `${qty} × ` : ""}${p.name} added`;
    toast.innerHTML = `${p ? `<img src="${p.img}" alt="">` : ""}<span>${esc(label)}</span>`;
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
    if (game) { if (game.running) cancelPay(); return; }
    if (!wheelModal.hidden) { closeWheel(); return; }
    if (pagesMenu.classList.contains("open")) { setMenu(false); pagesBtn.focus(); return; }
    closeCart();
  });

  let lastProgress = 0;
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

    const t = totals();
    const progress = Math.min(1, t.subtotal / STICKER_GOAL);
    const left = STICKER_GOAL - t.subtotal;
    const reward = `
      <div class="reward ${left <= 0 ? "done" : ""}">
        <p>${left > 0 ? `Spend <b>$${left.toFixed(2)}</b> more for a free mystery sticker` : `<b>Mystery sticker unlocked!</b> It ships free with your hamsters.`}</p>
        <div class="reward-bar"><span style="transform:scaleX(${lastProgress})"></span></div>
      </div>`;
    const sticker = left <= 0 ? `
        <div class="cart-line sticker-line">
          <div class="sticker-art" aria-hidden="true"><span>?</span></div>
          <div>
            <div class="line-top"><p class="line-name">Mystery sticker</p><p class="line-price">FREE</p></div>
            <p class="line-mood">A surprise hamster from the vault</p>
          </div>
        </div>` : "";

    body.innerHTML = reward + cart.map((l) => {
      const p = byId[l.id];
      return `
        <div class="cart-line ${l.fresh ? "entering" : ""}" data-key="${l.key}">
          <button class="frame" data-open-from-cart="${p.id}" aria-label="View ${esc(p.name)}"><span class="paper" style="aspect-ratio:1"><img src="${p.img}" alt=""></span></button>
          <div>
            <div class="line-top">
              <p class="line-name">${esc(p.name)}</p>
              <p class="line-price">$ ${(p.price * l.qty).toFixed(2)}</p>
            </div>
            <p class="line-mood">${esc(p.mood)}</p>
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
    }).join("") + sticker;
    cart.forEach((l) => delete l.fresh);

    // Grow the reward bar from where it was, not from zero.
    const bar = $(".reward-bar span", body);
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transform = `scaleX(${progress})`; }));
    lastProgress = progress;

    foot.innerHTML = `
      <div class="sum-row"><span>SUBTOTAL</span><span>${money(t.subtotal)}</span></div>
      ${discount ? `<div class="sum-row disc"><span>DISCOUNT · ${discount.code} <button class="link-btn" id="removeCode" aria-label="Remove discount code">REMOVE</button></span><span>− ${money(t.off)}</span></div>` : ""}
      <div class="sum-row"><span>SHIPPING</span><span>FREE</span></div>
      <div class="sum-row total"><span>TOTAL</span><span>${money(t.total)}</span></div>
      ${discount ? "" : `
      <form class="code-form" id="codeForm" novalidate>
        <input id="codeInput" placeholder="Discount code" autocomplete="off" spellcheck="false" aria-label="Discount code" aria-describedby="codeMsg">
        <button class="code-apply">APPLY</button>
      </form>
      <p class="code-msg" id="codeMsg" aria-live="polite">${wheelState ? "" : `No code? <button class="link-btn inline" data-go="wheel">Spin the wheel</button>`}</p>`}
      <button class="btn-iri wide" id="checkout"><span>CHECKOUT</span></button>`;
    $("#checkout").addEventListener("click", renderPayment);
    const rm = $("#removeCode", foot);
    if (rm) rm.addEventListener("click", () => { removeCode(); renderCart(); });
    const form = $("#codeForm", foot);
    if (form) form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("#codeInput", foot);
      if (applyCode(input.value)) {
        renderCart();
        toast.innerHTML = `<span>Code ${esc(discount.code)} applied: ${discount.pct}% off</span>`;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
      } else {
        $("#codeMsg", foot).textContent = input.value.trim() ? "That code isn't one of ours. Try spinning the wheel." : "Type a code first.";
        if (!reduceMotion) input.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(5px)" }, { transform: "translateX(-3px)" }, { transform: "translateX(0)" }], { duration: 300, easing: "ease-out" });
        input.focus();
      }
    });
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

  /* ------------------------------------------------------------------ */
  /* Checkout step 2: Apple Pay, where you literally pay in apples        */
  /* ------------------------------------------------------------------ */
  const APPLE = FRUIT.find((f) => f.value > 0);
  const DECOYS = FRUIT.filter((f) => f.value === 0);
  const APPLE_VALUE = APPLE.value;

  const pay = $("#pay");
  const arena = $("#arena");
  const payDone = $("#payDone");
  const payGot = $("#payGot");
  const payFill = $("#payFill");
  let game = null;

  // Drawer step between the cart and the game.
  function renderPayment() {
    const t = totals();
    const total = t.total;
    const count = cartCount();
    const apples = Math.ceil(total / APPLE_VALUE);
    body.innerHTML = `
      <div class="pay-step">
        <button class="back" data-back-cart><span class="arr">←</span> BACK TO CART</button>
        <p class="eyebrow mono">STEP 2 OF 2 · PAYMENT</p>
        <h3>How would you like to pay?</h3>
        <div class="pay-summary">
          <div class="sum-row"><span>${count} HAMSTER${count === 1 ? "" : "S"}</span><span>${money(t.subtotal)}</span></div>
          ${discount ? `<div class="sum-row disc"><span>DISCOUNT · ${discount.code}</span><span>− ${money(t.off)}</span></div>` : ""}
          <div class="sum-row"><span>SHIPPING</span><span>FREE</span></div>
          <div class="sum-row total"><span>TO PAY</span><span>${money(total)}</span></div>
        </div>
        <button class="apple-pay" id="applePay">
          <span>Pay with</span><img src="${APPLE.img}" alt=""><b>Apple Pay</b>
        </button>
        <p class="pay-note">Our cashier only accepts apples. Each apple you catch is worth $${APPLE_VALUE}, so you'll need about <b>${apples}</b>.</p>
        <button class="pay-alt" disabled>
          <span>Card</span><span class="mono">OUT OF ORDER</span>
        </button>
      </div>`;
    foot.innerHTML = "";
    $("[data-back-cart]", body).addEventListener("click", renderCart);
    $("#applePay", body).addEventListener("click", startPay);
    $("#applePay", body).focus({ preventScroll: true });
  }

  function setCollected() {
    payGot.textContent = money(game.got);
    payFill.style.transform = `scaleX(${Math.min(1, game.got / game.total)})`;
  }

  function startPay() {
    const total = totals().total;
    if (!total) return;
    game = {
      total, got: 0, caught: 0, items: [], running: true,
      last: performance.now(), spawnIn: 0.2, raf: 0,
    };
    $("#payTotal").textContent = money(total);
    setCollected();
    arena.innerHTML = "";
    payDone.hidden = true;
    pay.hidden = false;
    pay.classList.remove("done");
    void pay.offsetWidth;
    pay.classList.add("open");
    $("#payCancel").focus({ preventScroll: true });
    game.raf = requestAnimationFrame(loop);
  }

  function spawn() {
    const W = arena.clientWidth, H = arena.clientHeight;
    const isApple = Math.random() < 0.5;
    const f = isApple ? APPLE : DECOYS[Math.floor(Math.random() * DECOYS.length)];
    const size = (W < 600 ? 58 : 72) + Math.random() * 18;
    const el = document.createElement("button");
    el.type = "button";
    el.className = "fruit";
    el.style.width = el.style.height = `${size}px`;
    el.setAttribute("aria-label", isApple ? `Apple, worth $${APPLE_VALUE}` : "Not an apple");
    el.innerHTML = `<img src="${f.img}" alt="" draggable="false">`;
    const speed = H * (0.24 + Math.random() * 0.2) * (reduceMotion ? 0.6 : 1);
    const item = {
      el, f, size,
      x: size / 2 + Math.random() * Math.max(1, W - size * 2),
      y: -size,
      vy: speed,
      sway: 10 + Math.random() * 24,
      phase: Math.random() * Math.PI * 2,
      rot: (Math.random() - 0.5) * 40,
      vr: reduceMotion ? 0 : (Math.random() - 0.5) * 120,
      dead: false,
    };
    el.addEventListener("pointerdown", (e) => { e.preventDefault(); hit(item, e.clientX, e.clientY); });
    el.addEventListener("click", (e) => {
      // Keyboard activation (Enter/Space) arrives as a click with no pointer.
      if (e.detail === 0) { const r = el.getBoundingClientRect(); hit(item, r.left + r.width / 2, r.top); }
    });
    arena.appendChild(el);
    game.items.push(item);
  }

  function place(item, t) {
    const x = item.x + Math.sin(t / 700 + item.phase) * item.sway;
    item.el.style.transform = `translate3d(${x.toFixed(1)}px, ${item.y.toFixed(1)}px, 0) rotate(${item.rot.toFixed(1)}deg)`;
  }

  function loop(now) {
    if (!game || !game.running) return;
    const dt = Math.min(0.05, (now - game.last) / 1000);
    game.last = now;
    const H = arena.clientHeight;

    game.spawnIn -= dt;
    if (game.spawnIn <= 0 && game.items.length < 16) {
      spawn();
      game.spawnIn = 0.34 + Math.random() * 0.3;
    }
    game.items.forEach((it) => {
      if (it.dead) return;
      it.y += it.vy * dt;
      it.rot += it.vr * dt;
      if (it.y > H + 10) { it.dead = true; it.el.remove(); return; }
      place(it, now);
    });
    game.items = game.items.filter((it) => !it.dead);
    game.raf = requestAnimationFrame(loop);
  }

  function floatText(text, x, y, good) {
    const r = pay.getBoundingClientRect();
    const t = document.createElement("span");
    t.className = `float-text ${good ? "good" : "bad"}`;
    t.textContent = text;
    t.style.left = `${x - r.left}px`;
    t.style.top = `${y - r.top}px`;
    pay.appendChild(t);
    t.animate([
      { transform: "translate(-50%, -50%) scale(0.9)", opacity: 0 },
      { transform: "translate(-50%, -90%) scale(1.05)", opacity: 1, offset: 0.25 },
      { transform: "translate(-50%, -190%) scale(1)", opacity: 0 },
    ], { duration: reduceMotion ? 500 : 800, easing: EASE_OUT }).onfinish = () => t.remove();
  }

  function hit(item, x, y) {
    if (!game || !game.running || item.dead) return;
    if (item.f.value > 0) {
      item.dead = true;
      game.got += item.f.value;
      game.caught += 1;
      setCollected();
      floatText(`+$${item.f.value}`, x, y, true);
      const img = item.el.firstElementChild;
      img.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(1.45)", opacity: 0 }],
        { duration: 200, easing: EASE_OUT, fill: "forwards" }).onfinish = () => item.el.remove();
      payGot.animate([{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }],
        { duration: 240, easing: EASE_OUT });
      if (game.got >= game.total) win();
    } else {
      floatText("Not an apple!", x, y, false);
      if (!reduceMotion) {
        item.el.firstElementChild.animate(
          [{ transform: "rotate(0)" }, { transform: "rotate(-16deg)" }, { transform: "rotate(14deg)" }, { transform: "rotate(-8deg)" }, { transform: "rotate(0)" }],
          { duration: 360, easing: "ease-in-out" });
      }
    }
  }

  function stopGame() {
    game.running = false;
    cancelAnimationFrame(game.raf);
    game.items.forEach((it) => {
      if (it.dead) return;
      it.dead = true;
      it.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" }).onfinish = () => it.el.remove();
    });
  }

  function cancelPay() {
    if (!game) return;
    stopGame();
    game = null;
    pay.classList.remove("open");
    setTimeout(() => { pay.hidden = true; arena.innerHTML = ""; }, 220);
    const btn = $("#applePay", body);
    if (btn) btn.focus({ preventScroll: true });
  }
  $("#payCancel").addEventListener("click", cancelPay);

  function win() {
    stopGame();
    const { total, got, caught } = game;
    const change = Math.round((got - total) * 100) / 100;
    const usedCode = discount ? discount.code : null;
    cart = [];
    save();
    removeCode();
    updateBadge(false);
    renderCart();

    $("#payDoneText").innerHTML =
      `You paid ${money(total)} with <b>${caught}</b> apple${caught === 1 ? "" : "s"}.` +
      (usedCode ? ` Code ${usedCode} saved you some apples.` : "") +
      (change > 0 ? ` Keep the change ($${Number.isInteger(change) ? change : change.toFixed(2)}).` : "") +
      " Your hamsters are on their way.";
    pay.classList.add("done");
    payDone.hidden = false;
    $("#payDoneBtn").focus({ preventScroll: true });
    appleRain();
  }

  $("#payDoneBtn").addEventListener("click", () => {
    game = null;
    pay.classList.remove("open", "done");
    setTimeout(() => { pay.hidden = true; arena.innerHTML = ""; payDone.hidden = true; }, 220);
    closeCart();
    showHome("shop");
  });

  // The payment went through: a short celebratory shower of apples.
  function appleRain() {
    if (reduceMotion) return;
    const W = innerWidth, H = innerHeight;
    for (let i = 0; i < 30; i++) {
      const img = document.createElement("img");
      img.className = "confetti";
      img.src = APPLE.img;
      img.alt = "";
      const size = 26 + Math.random() * 30;
      img.style.width = `${size}px`;
      img.style.left = `${Math.random() * (W - size)}px`;
      pay.appendChild(img);
      img.animate([
        { transform: "translate(0, 0) rotate(0deg)" },
        { transform: `translate(${(Math.random() - 0.5) * 220}px, ${H + 120}px) rotate(${(Math.random() - 0.5) * 900}deg)` },
      ], {
        duration: 1500 + Math.random() * 1100,
        delay: Math.random() * 500,
        easing: "cubic-bezier(0.35, 0.1, 0.65, 1)",
        fill: "backwards",
      }).onfinish = () => img.remove();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Spin the wheel: one spin per visitor, every slice wins a code        */
  /* ------------------------------------------------------------------ */
  const SLICES = [5, 15, 10, 25, 5, 20, 10, 30];          // % off, clockwise from the top
  const ODDS = { 5: 18, 10: 14, 15: 16, 20: 10, 25: 6, 30: 4 }; // weight per slice
  const SLICE_COLORS = ["#5b8cff", "#b07bff", "#ff86c8", "#ffd37a"];
  const SEG = 360 / SLICES.length;
  const wheelModal = $("#wheelModal");
  const wheelEl = $("#wheel");
  const pointerEl = $("#wheelPointer");
  const spinBtn = $("#spinBtn");
  const spinPill = $("#spinPill");
  let wheelState = load("hammie-wheel", null);
  let spinning = false;
  let wheelLastFocus = null;

  $("#hubImg").src = DATA.logo;

  (function drawWheel() {
    const polar = (r, deg) => {
      const a = ((deg - 90) * Math.PI) / 180;
      return [(r * Math.cos(a)).toFixed(2), (r * Math.sin(a)).toFixed(2)];
    };
    let svg = `<svg viewBox="-106 -106 212 212"><circle r="104" fill="#0e0e18" stroke="rgba(244,242,238,.24)" stroke-width="1"/>`;
    SLICES.forEach((pct, i) => {
      const a0 = i * SEG, a1 = a0 + SEG, mid = a0 + SEG / 2;
      const [x0, y0] = polar(94, a0), [x1, y1] = polar(94, a1);
      const jackpot = pct === 30;
      const fill = jackpot ? "url(#iri)" : i % 2 ? "#15151f" : SLICE_COLORS[(i / 2) % 4];
      const ink = jackpot || i % 2 === 0 ? "#07070d" : "#f4f2ee";
      svg += `<path class="slice" data-slice="${i}" d="M0 0L${x0} ${y0}A94 94 0 0 1 ${x1} ${y1}Z" fill="${fill}" stroke="#07070d" stroke-width="1.5"/>`;
      svg += `<g transform="rotate(${mid})" fill="${ink}" text-anchor="middle">
        <text y="-56" font-size="${jackpot ? 19 : 21}" font-weight="600" font-family="Schibsted Grotesk, sans-serif">${pct}%</text>
        <text y="-42" font-size="${jackpot ? 6 : 7.5}" letter-spacing="${jackpot ? 0.6 : 1.2}" font-family="JetBrains Mono, monospace">${jackpot ? "JACKPOT" : "OFF"}</text>
      </g>`;
    });
    for (let i = 0; i < 16; i++) {
      const [x, y] = polar(99.5, i * 22.5 + 11.25);
      svg += `<circle class="bulb ${i % 2 ? "b2" : "b1"}" cx="${x}" cy="${y}" r="2.4"/>`;
    }
    wheelEl.innerHTML = svg + "</svg>";
  })();

  function pickSlice() {
    const total = SLICES.reduce((n, pct) => n + ODDS[pct], 0);
    let r = Math.random() * total;
    for (let i = 0; i < SLICES.length; i++) {
      r -= ODDS[SLICES[i]];
      if (r < 0) return i;
    }
    return 0;
  }

  function updatePill() {
    spinPill.hidden = !!wheelState;
  }

  function showWon(animate) {
    const { pct, code, slice } = wheelState;
    $("#wonBig").innerHTML = pct === 30 ? `30% OFF<span>JACKPOT!</span>` : `${pct}% OFF`;
    $("#wonCode").textContent = code;
    $("#wonCta").textContent = `SHOP WITH ${pct}% OFF`;
    $$(".slice", wheelEl).forEach((s) => s.classList.toggle("win", Number(s.dataset.slice) === slice));
    const ask = $("#wheelAsk"), won = $("#wheelWon");
    if (!animate || reduceMotion) { ask.hidden = true; won.hidden = false; return; }
    ask.animate([{ opacity: 1, filter: "blur(0)" }, { opacity: 0, filter: "blur(4px)" }], { duration: 180, easing: "ease" }).onfinish = () => {
      ask.hidden = true;
      won.hidden = false;
      won.animate([{ opacity: 0, filter: "blur(4px)", transform: "translateY(8px)" }, { opacity: 1, filter: "blur(0)", transform: "none" }],
        { duration: 320, easing: EASE_OUT });
      $(".wheel-hub").animate([{ transform: "translate(-50%,-50%) scale(1)" }, { transform: "translate(-50%,-50%) scale(1.18)" }, { transform: "translate(-50%,-50%) scale(1)" }],
        { duration: 500, easing: EASE_OUT });
    };
  }

  function openWheel() {
    if (!wheelModal.hidden) return;
    wheelLastFocus = document.activeElement;
    wheelModal.hidden = false;
    if (wheelState) {
      wheelEl.style.transition = "none";
      wheelEl.style.transform = `rotate(${wheelState.rot}deg)`;
      showWon(false);
    } else {
      $("#wheelAsk").hidden = false;
      $("#wheelWon").hidden = true;
    }
    void wheelModal.offsetWidth;
    wheelModal.classList.add("open");
    document.body.classList.add("locked");
    setTimeout(() => (wheelState ? $("#copyCode") : spinBtn).focus({ preventScroll: true }), 60);
  }

  function closeWheel() {
    if (wheelModal.hidden || spinning) return;
    wheelModal.classList.remove("open");
    try { sessionStorage.setItem("hammie-wheel-later", "1"); } catch (e) {}
    if (!drawer.classList.contains("open")) document.body.classList.remove("locked");
    setTimeout(() => { wheelModal.hidden = true; }, 220);
    if (wheelLastFocus && wheelLastFocus.isConnected) wheelLastFocus.focus({ preventScroll: true });
  }

  function spin() {
    if (spinning || wheelState) return;
    spinning = true;
    spinBtn.disabled = true;
    const slice = pickSlice();
    const mid = slice * SEG + SEG / 2;
    const jitter = (Math.random() - 0.5) * (SEG - 14);
    const rot = 360 * (reduceMotion ? 2 : 6) + (360 - mid - jitter);
    const dur = reduceMotion ? 1200 : 5200;

    wheelEl.style.transition = "none";
    wheelEl.style.transform = "rotate(0deg)";
    void wheelEl.offsetWidth;
    wheelEl.style.transition = `transform ${dur}ms cubic-bezier(0.12, 0.7, 0.08, 1)`;
    wheelEl.style.transform = `rotate(${rot}deg)`;
    wheelModal.classList.add("spinning");

    // The pointer flicks every time a slice edge passes under it.
    let lastIdx = -1;
    const track = () => {
      if (!spinning) return;
      const m = getComputedStyle(wheelEl).transform;
      if (m && m !== "none") {
        const [a, b] = m.slice(m.indexOf("(") + 1, -1).split(",").map(Number);
        const ang = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360;
        const idx = Math.floor(((360 - ang) % 360) / SEG);
        if (lastIdx !== -1 && idx !== lastIdx && !reduceMotion) {
          pointerEl.animate([{ transform: "translateX(-50%) rotate(0)" }, { transform: "translateX(-50%) rotate(-24deg)" }, { transform: "translateX(-50%) rotate(0)" }],
            { duration: 130, easing: "ease-out" });
        }
        lastIdx = idx;
      }
      requestAnimationFrame(track);
    };
    requestAnimationFrame(track);

    setTimeout(() => {
      spinning = false;
      spinBtn.disabled = false;
      wheelModal.classList.remove("spinning");
      const pct = SLICES[slice];
      wheelState = { pct, code: `SQUEAK${pct}`, slice, rot };
      store("hammie-wheel", wheelState);
      if (!discount || discount.pct <= pct) applyCode(wheelState.code);
      renderCart();
      updatePill();
      showWon(true);
      $("#copyCode").focus({ preventScroll: true });
    }, dur + 60);
  }

  spinBtn.addEventListener("click", spin);
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-wheel-close]")) closeWheel();
  });
  $("#copyCode").addEventListener("click", async () => {
    const btn = $("#copyCode");
    try {
      await navigator.clipboard.writeText(wheelState.code);
      btn.textContent = "COPIED";
    } catch (e) {
      const range = document.createRange();
      range.selectNodeContents($("#wonCode"));
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      btn.textContent = "SELECTED";
    }
    setTimeout(() => { btn.textContent = "COPY"; }, 1600);
  });

  // First visit: offer the wheel once the visitor has had a moment to look around.
  updatePill();
  let laterAsked = false;
  try { laterAsked = sessionStorage.getItem("hammie-wheel-later") === "1"; } catch (e) {}
  if (!wheelState && !laterAsked) {
    const tryOpen = () => {
      const busy = drawer.classList.contains("open") || (game && game.running) || document.activeElement === searchEl;
      if (busy) return setTimeout(tryOpen, 4000);
      if (!wheelState) openWheel();
    };
    setTimeout(tryOpen, 9000);
  }

  updateBadge(false);
  renderCart();
})();
