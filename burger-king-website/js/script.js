(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
  const rupees = (n) => "₹" + inr.format(Math.round(n));

  const GST_RATE = 0.05;
  const FREE_DELIVERY_OVER = 199;

  /* ---------------------------------------------------------------- embers */
  function startEmbers() {
    const canvas = $("#ember-canvas");
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext("2d");
    const host = canvas.parentElement;
    let w = 0;
    let h = 0;
    let embers = [];
    let raf = null;

    const seed = (e, initial) => {
      e.x = Math.random() * w;
      e.y = initial ? Math.random() * h : h + Math.random() * 40;
      e.r = 0.6 + Math.random() * 2.1;
      e.vy = 0.25 + Math.random() * 0.85;
      e.vx = (Math.random() - 0.5) * 0.35;
      e.life = 0;
      e.span = 160 + Math.random() * 220;
      e.hue = 14 + Math.random() * 28;
      return e;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host.offsetWidth;
      h = host.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(90, Math.max(26, w / 14)));
      embers = Array.from({ length: target }, () => seed({}, true));
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (const e of embers) {
        e.life += 1;
        e.y -= e.vy;
        e.x += e.vx + Math.sin(e.life / 26) * 0.35;

        const fade = 1 - e.life / e.span;
        if (fade <= 0 || e.y < -10) {
          seed(e, false);
          continue;
        }

        const glow = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 5);
        glow.addColorStop(0, `hsla(${e.hue}, 100%, 66%, ${0.55 * fade})`);
        glow.addColorStop(1, `hsla(${e.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsla(${e.hue + 12}, 100%, 78%, ${0.85 * fade})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 0.62, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };
    const play = () => {
      if (raf === null) raf = requestAnimationFrame(frame);
    };

    resize();
    play();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));
  }

  /* ------------------------------------------------------- hero burger loop */
  const HERO_BUILDS = [
    { name: "The Whopper®", layers: ["lettuce", "tomato", "cheese", "patty", "onion"] },
    { name: "Double Patty Stack", layers: ["cheese", "patty", "patty2", "onion"] },
    { name: "Chicken Tandoori Grill", layers: ["lettuce", "tomato", "patty", "jalapeno", "onion"] },
    { name: "Paneer King Melt", layers: ["lettuce", "tomato", "cheese", "patty"] }
  ];

  function initHeroBurger() {
    const stack = $("#hero-stack");
    const caption = $("#hero-caption");
    const buns = ["bun-top", "bun-bottom"];
    const layers = $$(".layer", stack);

    // Resting markup shows every layer, so the hero reads complete without JS.
    if (reduceMotion) {
      const first = new Set([...buns, ...HERO_BUILDS[0].layers]);
      layers.forEach((l) => l.classList.toggle("is-off", !first.has(l.dataset.layer)));
      caption.textContent = HERO_BUILDS[0].name;
      return;
    }

    const apply = (build) => {
      const on = new Set([...buns, ...build.layers]);
      let step = 0;

      for (const layer of layers) {
        const shouldShow = on.has(layer.dataset.layer);
        const showing = !layer.classList.contains("is-off");
        // Stagger only the layers being added, top-down, so it reads as stacking.
        layer.style.transitionDelay = shouldShow && !showing ? `${step++ * 90}ms` : "0ms";
        layer.classList.toggle("is-off", !shouldShow);
      }

      caption.classList.add("is-swapping");
      setTimeout(() => {
        caption.textContent = build.name;
        caption.classList.remove("is-swapping");
      }, 250);
    };

    let index = 0;
    let timer = null;

    const advance = () => {
      index = (index + 1) % HERO_BUILDS.length;
      apply(HERO_BUILDS[index]);
    };

    const start = () => {
      if (timer === null) timer = setInterval(advance, 4200);
    };
    const stop = () => {
      if (timer !== null) clearInterval(timer);
      timer = null;
    };

    setTimeout(() => apply(HERO_BUILDS[0]), 900);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
        { threshold: 0.2 }
      ).observe(stack);
    } else {
      start();
    }

    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  }

  /* ------------------------------------------------------------------- nav */
  function initNav() {
    const toggle = $("#nav-toggle");
    const nav = $("#main-nav");
    const header = $(".site-header");

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------ tray */
  const tray = new Map();

  function trayTotals() {
    let count = 0;
    let subtotal = 0;
    for (const item of tray.values()) {
      count += item.qty;
      subtotal += item.qty * item.price;
    }
    const gst = subtotal * GST_RATE;
    return { count, subtotal, gst, total: subtotal + gst };
  }

  function renderTray() {
    const list = $("#tray-items");
    const { count, subtotal, gst, total } = trayTotals();

    $("#tray-count").textContent = count;
    $("#tray-count").hidden = count === 0;

    if (tray.size === 0) {
      list.innerHTML =
        '<p class="tray-empty">Your tray is empty.<br />Flame-grilled greatness is one tap away.</p>';
    } else {
      list.innerHTML = "";
      for (const [id, item] of tray) {
        const row = document.createElement("div");
        row.className = "tray-item";
        row.innerHTML = `
          <div>
            <h4>${item.name}</h4>
            <div class="unit">${rupees(item.price)} each &middot; ${rupees(item.price * item.qty)}</div>
          </div>
          <div class="qty">
            <button type="button" data-step="-1" data-id="${id}" aria-label="Remove one ${item.name}">&minus;</button>
            <span>${item.qty}</span>
            <button type="button" data-step="1" data-id="${id}" aria-label="Add one ${item.name}">+</button>
          </div>`;
        list.appendChild(row);
      }
    }

    $("#bill-sub").textContent = rupees(subtotal);
    $("#bill-gst").textContent = rupees(gst);
    $("#bill-total").textContent = rupees(total);

    const gap = FREE_DELIVERY_OVER - subtotal;
    const note = $("#free-del");
    if (subtotal > 0 && gap > 0) {
      note.textContent = `Add ${rupees(gap)} more for free delivery`;
      note.hidden = false;
    } else if (subtotal > 0) {
      note.textContent = "Free delivery unlocked";
      note.hidden = false;
    } else {
      note.hidden = true;
    }
  }

  function addToTray(id, name, price) {
    const existing = tray.get(id);
    if (existing) existing.qty += 1;
    else tray.set(id, { name, price, qty: 1 });
    renderTray();
  }

  function initTray() {
    const drawer = $("#tray");
    const backdrop = $("#tray-backdrop");
    const openBtn = $("#tray-btn");

    const open = () => {
      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      $("#tray-close").focus();
    };
    const close = () => {
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      openBtn.focus();
    };

    openBtn.addEventListener("click", open);
    $("#tray-close").addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) close();
    });

    $("#tray-items").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-step]");
      if (!btn) return;
      const item = tray.get(btn.dataset.id);
      if (!item) return;
      item.qty += Number(btn.dataset.step);
      if (item.qty <= 0) tray.delete(btn.dataset.id);
      renderTray();
    });

    $("#checkout").addEventListener("click", () => {
      if (tray.size === 0) return;
      const { total } = trayTotals();
      $("#checkout").textContent = `Order placed — ${rupees(total)}`;
      setTimeout(() => {
        tray.clear();
        renderTray();
        $("#checkout").textContent = "Proceed to Checkout";
        close();
      }, 1600);
    });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-btn");
      if (!btn) return;
      const card = btn.closest("[data-id]");
      addToTray(card.dataset.id, card.dataset.name, Number(card.dataset.price));
      btn.classList.add("is-added");
      btn.textContent = "Added";
      setTimeout(() => {
        btn.classList.remove("is-added");
        btn.textContent = "Add";
      }, 1100);
    });

    renderTray();
  }

  /* ------------------------------------------------------------ menu filter */
  function initMenu() {
    const cards = $$(".menu-card");
    const empty = $("#menu-empty");
    const vegOnly = $("#veg-only");
    let category = "all";

    const apply = () => {
      let shown = 0;
      for (const card of cards) {
        const catOk = category === "all" || card.dataset.category === category;
        const vegOk = !vegOnly.checked || card.dataset.diet === "veg";
        const visible = catOk && vegOk;
        card.hidden = !visible;
        if (visible) shown += 1;
      }
      empty.hidden = shown > 0;
    };

    $("#menu-tabs").addEventListener("click", (e) => {
      const btn = e.target.closest(".tab-btn");
      if (!btn) return;
      $$(".tab-btn").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      category = btn.dataset.filter;
      apply();
    });

    vegOnly.addEventListener("change", apply);
    apply();
  }

  /* ----------------------------------------------------------- configurator */
  function initBuilder() {
    const form = $("#builder-form");
    const stack = $("#builder-stack");

    const sync = () => {
      let total = 0;
      let kcal = 250; // buns
      const active = new Set(["bun-top", "bun-bottom"]);

      const patty = form.querySelector('input[name="patty"]:checked');
      if (patty) {
        total += Number(patty.dataset.price);
        kcal += Number(patty.dataset.kcal);
        active.add("patty");
      }

      for (const box of $$('input[type="checkbox"]', form)) {
        if (!box.checked) continue;
        total += Number(box.dataset.price);
        kcal += Number(box.dataset.kcal || 0);
        if (box.dataset.layer) active.add(box.dataset.layer);
      }

      for (const layer of $$(".layer", stack)) {
        layer.classList.toggle("is-off", !active.has(layer.dataset.layer));
      }

      $("#builder-price").textContent = rupees(total);
      $("#builder-kcal").textContent = `${inr.format(kcal)} kcal · incl. all taxes`;
      form.dataset.total = String(total);

      const name = patty ? patty.dataset.name : "Custom Burger";
      form.dataset.name = `${name} (Your Way)`;
    };

    form.addEventListener("change", sync);

    $("#builder-add").addEventListener("click", () => {
      const total = Number(form.dataset.total || 0);
      if (!total) return;
      addToTray(`custom-${Date.now()}`, form.dataset.name, total);
      const btn = $("#builder-add");
      btn.textContent = "Added to Tray";
      setTimeout(() => (btn.textContent = "Add to Tray"), 1300);
    });

    sync();
  }

  /* --------------------------------------------------------------- locator */
  const OUTLETS = [
    { city: "mumbai", name: "BK Phoenix Palladium", area: "Lower Parel, Mumbai", km: 1.2, eta: 22 },
    { city: "mumbai", name: "BK Linking Road", area: "Bandra West, Mumbai", km: 3.8, eta: 31 },
    { city: "mumbai", name: "BK Infiniti Mall", area: "Andheri West, Mumbai", km: 6.4, eta: 38 },
    { city: "delhi", name: "BK Connaught Place", area: "CP Block A, New Delhi", km: 0.9, eta: 19 },
    { city: "delhi", name: "BK Select Citywalk", area: "Saket, New Delhi", km: 4.6, eta: 29 },
    { city: "delhi", name: "BK DLF CyberHub", area: "Gurugram, Delhi NCR", km: 8.1, eta: 36 },
    { city: "bengaluru", name: "BK Church Street", area: "MG Road, Bengaluru", km: 1.7, eta: 21 },
    { city: "bengaluru", name: "BK Phoenix Mall of Asia", area: "Hebbal, Bengaluru", km: 5.3, eta: 33 },
    { city: "bengaluru", name: "BK Forum Koramangala", area: "Koramangala, Bengaluru", km: 3.1, eta: 26 },
    { city: "pune", name: "BK Phoenix Marketcity", area: "Viman Nagar, Pune", km: 2.4, eta: 24 },
    { city: "pune", name: "BK FC Road", area: "Shivajinagar, Pune", km: 4.9, eta: 30 },
    { city: "hyderabad", name: "BK Inorbit Mall", area: "Madhapur, Hyderabad", km: 2.9, eta: 25 },
    { city: "hyderabad", name: "BK Banjara Hills", area: "Road No. 1, Hyderabad", km: 5.8, eta: 34 }
  ];

  function initLocator() {
    const form = $("#locate-form");
    const input = $("#locate-input");
    const list = $("#outlet-list");

    const render = (query) => {
      const q = query.trim().toLowerCase();
      let found = OUTLETS.filter(
        (o) => o.city.includes(q) || o.area.toLowerCase().includes(q) || o.name.toLowerCase().includes(q)
      );
      if (!q || found.length === 0) found = OUTLETS.slice(0, 3);

      list.innerHTML = found
        .slice(0, 3)
        .map(
          (o) => `
          <article class="outlet">
            <h4>${o.name}</h4>
            <div class="area">${o.area}</div>
            <div class="outlet-meta">
              <span><b>${o.km.toFixed(1)}</b> km</span>
              <span><b>${o.eta}</b> min delivery</span>
              <span class="open">Open now</span>
            </div>
          </article>`
        )
        .join("");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      render(input.value);
    });

    $("#city-chips").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      input.value = chip.textContent.trim();
      render(chip.dataset.city);
    });

    render("");
  }

  /* --------------------------------------------------------- promo & forms */
  function initMisc() {
    $("#year").textContent = new Date().getFullYear();

    document.addEventListener("click", (e) => {
      const code = e.target.closest(".deal-code");
      if (!code) return;
      const label = code.dataset.code;
      navigator.clipboard?.writeText(label).catch(() => {});
      code.classList.add("is-copied");
      code.textContent = "Copied ✓";
      setTimeout(() => {
        code.classList.remove("is-copied");
        code.textContent = label;
      }, 1400);
    });

    const contact = $("#contact-form");
    contact.addEventListener("submit", (e) => {
      e.preventDefault();
      $("#form-status").textContent = "Thanks! Our Guest Care team replies within 24 hours.";
      contact.reset();
    });
  }

  /* ------------------------------------------------------- reveal + counters */
  function initMotion() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.style.animationDelay = `${(Number(entry.target.dataset.delay) || 0) * 70}ms`;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    $$(".reveal").forEach((el) => revealObserver.observe(el));

    const countObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          const target = Number(el.dataset.count);
          const suffix = el.dataset.suffix || "";
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / 1100, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = inr.format(Math.round(target * eased)) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          countObserver.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    $$("[data-count]").forEach((el) => countObserver.observe(el));
  }

  /* ------------------------------------------------------------ card tilt */
  function initTilt() {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    for (const card of $$(".menu-card")) {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    }
  }

  const boot = () => {
    startEmbers();
    initHeroBurger();
    initNav();
    initTray();
    initMenu();
    initBuilder();
    initLocator();
    initMisc();
    initMotion();
    initTilt();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
