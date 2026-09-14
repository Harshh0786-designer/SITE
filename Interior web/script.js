/* ============================================================
   Meridian House — flight, tour and the small stuff
   ------------------------------------------------------------
   The whole opening sequence is one sticky stage whose camera is
   driven by a single scroll value. No scroll hijacking: the page
   scrolls normally, the camera just reads the number.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IMG_AR  = 1376 / 768;

  /* ---------- maths ---------- */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function range(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function lerp(a, b, t)  { return a + (b - a) * t; }
  function ease(t)        { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function easeIn(t)      { return t * t * t; }
  function easeOut(t)     { return 1 - Math.pow(1 - t, 3); }

  /* ============================================================
     1 · BOOT — hold the curtain until the house is decoded
     ============================================================ */
  var SOURCES = [
    'assets/villa-aerial.jpg',
    'assets/villa-entry.jpg',
    'assets/villa-great-room.jpg'
  ];
  var MESSAGES = ['Loading elevation data', 'Surveying the meadow', 'Warming the 18:42 light'];

  function boot() {
    var el = $('#boot'), fill = $('#bootFill'), pct = $('#bootPct'), msg = $('#bootMsg');
    var done = 0, total = SOURCES.length + 1, finished = false;

    function tick(label) {
      done++;
      var v = Math.round(done / total * 100);
      fill.style.width = v + '%';
      pct.textContent = v;
      if (label) msg.textContent = label;
      if (done >= total) close();
    }
    function close() {
      if (finished) return;
      finished = true;
      msg.textContent = 'Cleared for descent';
      setTimeout(function () {
        el.classList.add('is-done');
        document.body.classList.add('is-ready');
        setTimeout(function () { el.remove(); }, 1000);
      }, 420);
    }

    SOURCES.forEach(function (src, i) {
      var im = new Image();
      im.onload = im.onerror = function () { tick(MESSAGES[i]); };
      im.src = src;
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { tick(null); });
    } else { tick(null); }

    setTimeout(close, 7000); // never trap the visitor behind a slow network
  }

  /* ============================================================
     2 · SKY — clouds you fall through, not clouds that drift by
     Perspective model: every puff sits at a depth below the
     camera. Scroll advances the camera; depth shrinks; the puff
     rushes outward from the centre of frame and passes you.
     ============================================================ */
  function Sky(canvas) {
    var ctx = canvas.getContext('2d', { alpha: true });
    var w = 0, h = 0, dpr = 1;
    var RANGE = 4.2;
    var puffs = [];
    var sprites = [];

    function sprite(r, g, b) {
      var c = document.createElement('canvas');
      c.width = c.height = 160;
      var x = c.getContext('2d');
      // three overlapping lobes so the silhouette is never a perfect disc
      [[80, 84, 62], [52, 96, 40], [110, 92, 44]].forEach(function (o) {
        var gr = x.createRadialGradient(o[0], o[1], 0, o[0], o[1], o[2]);
        gr.addColorStop(0,   'rgba(' + r + ',' + g + ',' + b + ',.36)');
        gr.addColorStop(.42, 'rgba(' + r + ',' + g + ',' + b + ',.13)');
        gr.addColorStop(1,   'rgba(' + r + ',' + g + ',' + b + ',0)');
        x.fillStyle = gr;
        x.beginPath(); x.arc(o[0], o[1], o[2], 0, 6.2832); x.fill();
      });
      return c;
    }

    function build() {
      sprites = [sprite(214, 226, 244), sprite(255, 214, 168), sprite(246, 238, 230)];
      var n = window.innerWidth < 760 ? 46 : 88;
      puffs = [];
      for (var i = 0; i < n; i++) {
        puffs.push({
          d: Math.random() * RANGE,
          u: (Math.random() * 2 - 1) * 1.15,
          v: (Math.random() * 2 - 1) * .95 + .06,
          r: .14 + Math.random() * .30,
          a: .24 + Math.random() * .40,
          rot: Math.random() * 6.28,
          sp: Math.floor(Math.random() * 3)
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(travel, t) {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);

      // dusk gradient, tuned to the horizon in the aerial plate
      var g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0,   '#0B1220');
      g.addColorStop(.30, '#22334C');
      g.addColorStop(.58, '#6B6274');
      g.addColorStop(.78, '#C4763E');
      g.addColorStop(1,   '#F0A85C');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      var f = h * .62, cx = w * .5, cy = h * .46;
      for (var i = 0; i < puffs.length; i++) {
        var p = puffs[i];
        var d = (p.d - travel) % RANGE;
        if (d < 0) d += RANGE;
        d += .14;
        var inv = 1 / d;
        var x = cx + p.u * inv * f + Math.sin(t * .00012 + p.rot) * 14;
        var y = cy + p.v * inv * f * 1.1;
        var r = p.r * inv * f * 2.1;
        if (r < 2 || x + r < 0 || x - r > w || y + r < 0 || y - r > h) continue;
        var a = p.a * clamp((RANGE - d) / 2.0, 0, 1) * clamp((d - .18) / .8, 0, 1);
        if (a <= .004) continue;
        ctx.globalAlpha = a;
        ctx.drawImage(sprites[p.sp], x - r, y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
    }

    build(); resize();
    window.addEventListener('resize', function () { resize(); build(); });
    return { draw: draw, resize: resize };
  }

  /* ============================================================
     3 · THE FLIGHT
     ============================================================ */
  function flight() {
    var journey = $('#journey'), stage = $('#stage');
    if (!journey || !stage) return;

    var sky      = Sky($('#sky'));
    var skyEl    = $('#sky');
    var scenes = {
      aerial: $('#sc-aerial'),
      entry:  $('#sc-entry'),
      great:  $('#sc-great'),
      exit:   $('#sc-exit')
    };
    var bloom  = $('#bloom');
    var grade  = $('#grade');
    var scrim  = $('#scrim');
    var lockup = $('#lockup');
    var cue    = $('#cue');
    var skip   = $('#skip');
    var nav    = $('#nav');
    var altVal = $('#altVal'), altUnit = $('#altUnit'), altLabel = $('#altLabel');
    var caption = $('#caption');
    var railItems = $$('#rail li');

    /* place a full-bleed plate so that an image-space focal point
       lands dead centre, without ever exposing an edge */
    function place(el, s, fx, fy, o, blur, bright) {
      if (o <= .002) { el.style.opacity = 0; el.style.visibility = 'hidden'; return; }
      el.style.visibility = 'visible';
      el.style.opacity = o;

      var bw = stage.clientWidth, bh = stage.clientHeight;
      var boxAR = bw / bh, x = fx, y = fy;
      if (boxAR < IMG_AR) { x = .5 + (fx - .5) * (IMG_AR / boxAR); }
      else                { y = .5 + (fy - .5) * (boxAR / IMG_AR); }

      var lim = (s - 1) / (2 * s) + .028;   // .028 = the 6% overscan on the plate
      x = clamp(x, .5 - lim, .5 + lim);
      y = clamp(y, .5 - lim, .5 + lim);

      el.style.transform =
        'translate3d(' + (-s * (x - .5) * 100).toFixed(3) + '%,' +
                         (-s * (y - .5) * 100).toFixed(3) + '%,0) scale(' + s.toFixed(4) + ')';
      var img = el.firstElementChild;
      img.style.filter = 'blur(' + blur.toFixed(2) + 'px) brightness(' + bright.toFixed(3) + ')';
    }

    var CAPTIONS = [
      [.00, .15, 'Hudson meadowlands · 62 acres · 1,140 ft'],
      [.15, .33, 'Meridian House · 8,400 sq ft · completed spring 2025'],
      [.33, .46, 'South elevation · approach over the pool terrace'],
      [.46, .62, 'Entry hall · white oak, quarried limestone, blackened steel'],
      [.62, .86, 'Great room · 24 ft of retractable glass facing west'],
      [.86, 1.01, 'Rear terrace · the twelve minutes this house was drawn for']
    ];
    var lastCap = -1, lastRail = -1;

    var p = 0, raf = 0, t0 = performance.now();

    function render(now) {
      raf = 0;

      /* ---- camera value ---- */
      var top = journey.offsetTop;
      var span = journey.offsetHeight - stage.clientHeight;
      p = REDUCED ? .26 : clamp((window.scrollY - top) / Math.max(span, 1), 0, 1);

      /* ---- sky ---- */
      var skyO = 1 - range(p, .17, .30);
      skyEl.style.opacity = skyO;
      if (skyO > .01) sky.draw(range(p, 0, .30) * 3.1, now - t0);

      /* ---- plate 1 · the descent, the arrival, the approach ---- */
      var aO = range(p, .06, .19) * (1 - range(p, .425, .468));
      var aS, aFX, aFY;
      if (p < .34) {
        var ta = ease(range(p, .06, .34));
        aS = lerp(1.03, 1.26, ta); aFX = lerp(.50, .47, ta); aFY = lerp(.40, .56, ta);
      } else {
        var tb = easeIn(range(p, .34, .47));
        aS = lerp(1.26, 4.4, tb); aFX = lerp(.47, .525, tb); aFY = lerp(.56, .645, tb);
      }
      place(scenes.aerial, aS, aFX, aFY, aO,
            range(p, .405, .47) * 13, 1 + range(p, .40, .47) * .28);

      /* ---- plate 2 · through the door, down the hall ---- */
      var eO = range(p, .435, .49) * (1 - range(p, .60, .638));
      var te = ease(range(p, .435, .638));
      place(scenes.entry, lerp(1.72, 3.05, te), lerp(.505, .492, te), lerp(.545, .478, te), eO,
            (1 - range(p, .435, .505)) * 11 + range(p, .60, .638) * 9,
            lerp(1.06, 1, range(p, .435, .52)));

      /* ---- plate 3 · the room opens, then we leave through it ---- */
      var gO = range(p, .615, .662) * (1 - range(p, .862, .902));
      var gS, gFX, gFY;
      if (p < .745) {
        var tg = easeOut(range(p, .615, .745));
        gS = lerp(1.92, 1.13, tg); gFX = lerp(.455, .50, tg); gFY = lerp(.535, .50, tg);
      } else {
        var th = easeIn(range(p, .745, .902));
        gS = lerp(1.13, 4.6, th); gFX = lerp(.50, .805, th); gFY = lerp(.50, .425, th);
      }
      place(scenes.great, gS, gFX, gFY, gO,
            (1 - range(p, .615, .672)) * 10 + range(p, .855, .902) * 10,
            1 + range(p, .78, .90) * .55);

      /* ---- the glass, blown out. the vignette steps aside for it ---- */
      var flare = ease(range(p, .815, .898)) * (1 - range(p, .898, .958));
      bloom.style.opacity = flare;
      grade.style.opacity = 1 - flare * .8;

      /* ---- plate 4 · out the back, pulling away over the meadow ---- */
      var xO = range(p, .888, .945);
      var tx = easeOut(range(p, .888, 1));
      place(scenes.exit, lerp(3.0, 1.1, tx), lerp(.56, .5, tx), lerp(.62, .45, tx), xO,
            (1 - range(p, .888, .952)) * 9, 1 - range(p, .94, 1) * .86);

      /* ---- titles and instruments ---- */
      var titleIn = range(p, .155, .225) * (1 - range(p, .295, .355));
      lockup.style.opacity = titleIn;
      scrim.style.opacity = titleIn;
      cue.style.opacity    = 1 - range(p, .012, .055);
      var skipO = 1 - range(p, .90, .965);
      skip.style.opacity = skipO;
      skip.style.pointerEvents = skipO < .12 ? 'none' : 'auto';

      if (p < .46) {
        altVal.textContent = Math.round(lerp(4280, 18, ease(range(p, 0, .45)))).toLocaleString('en-US');
        altUnit.textContent = 'ft'; altLabel.textContent = 'Descending';
      } else if (p < .63) {
        altVal.textContent = '42'; altUnit.textContent = 'ft'; altLabel.textContent = 'Corridor run';
      } else if (p < .88) {
        altVal.textContent = '24'; altUnit.textContent = 'ft'; altLabel.textContent = 'Glass span';
      } else {
        altVal.textContent = '62'; altUnit.textContent = 'acres'; altLabel.textContent = 'Meadow beyond';
      }

      for (var i = 0; i < CAPTIONS.length; i++) {
        if (p >= CAPTIONS[i][0] && p < CAPTIONS[i][1]) {
          if (i !== lastCap) {
            lastCap = i;
            caption.style.opacity = 0;
            (function (txt) {
              setTimeout(function () { caption.textContent = txt; caption.style.opacity = 1; }, 180);
            })(CAPTIONS[i][2]);
          }
          break;
        }
      }

      var active = 0;
      for (var j = 0; j < railItems.length; j++) {
        if (p >= parseFloat(railItems[j].dataset.p)) active = j;
      }
      if (active !== lastRail) {
        if (lastRail > -1) railItems[lastRail].classList.remove('is-on');
        railItems[active].classList.add('is-on');
        lastRail = active;
      }

      nav.classList.toggle('is-on', p > .955);
    }

    var looping = false;
    function loop(now) {
      if (REDUCED || p >= .33) { looping = false; return; }
      render(now);
      requestAnimationFrame(loop);
    }
    function wake() { if (!looping && !REDUCED && p < .31) { looping = true; requestAnimationFrame(loop); } }

    function onScroll() { if (!raf) raf = requestAnimationFrame(render); wake(); }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    render(performance.now());
    wake();

    skip.addEventListener('click', function () {
      var target = $('#overture');
      window.scrollTo(0, target.offsetTop - 60);
    });

    if (REDUCED) {
      nav.classList.add('is-on');
      skyEl.style.opacity = 0;
    }
  }

  /* ============================================================
     4 · HOUSE TOUR — drag to look, click a mark to read the spec
     ============================================================ */
  var ROOMS = {
    entry: {
      src: 'assets/villa-entry.jpg',
      alt: 'Entry hall of Meridian House',
      label: 'Entry hall · north approach',
      meta: '4 marks · white oak, limestone, blackened steel',
      spots: [
        { x: 13, y: 58, t: 'Wardrobe wall', b: 'Twenty-one feet of rift-sawn white oak, hand-oiled. Every door is a push-latch — no handle interrupts the grain, which runs continuously across all nine leaves.', m: 'White oak · 21 ft run · shop-built' },
        { x: 34, y: 44, t: 'Quarried limestone', b: 'Split-face limestone from a quarry ninety minutes north, laid in a random ashlar bond. The same stone wraps outside and becomes the chimney mass.', m: 'Limestone · 90 × 300 mm · random ashlar' },
        { x: 79, y: 47, t: 'Glazed corridor', b: 'A sixty-millimetre sightline in blackened steel. The corridor is glazed on one side only so the meadow arrives as a single uninterrupted panel.', m: 'Blackened steel · 60 mm sightline' },
        { x: 90, y: 74, t: 'Cut garden', b: 'A sunken courtyard that keeps the corridor from ever feeling like a passage. Planted with hellebore and fern — things that hold in low light.', m: 'Courtyard · 4.2 × 9 m · north facing' },
        { x: 49, y: 44, t: 'The long view', b: 'Stand at the front door and you see clean through the house to the treeline. This is the only place in the plan where that happens, and it is deliberate.', m: 'Axis · 118 ft door to glass' }
      ]
    },
    great: {
      src: 'assets/villa-great-room.jpg',
      alt: 'Great room of Meridian House',
      label: 'Great room · west facing',
      meta: '5 marks · fir, stone, walnut, wool',
      spots: [
        { x: 41, y: 13, t: 'Douglas fir beams', b: 'Exposed structure at 1,200 mm centres, with linear coves routed into the ceiling boards between them. The light source is never visible from a seated position.', m: 'Douglas fir · 1,200 mm centres' },
        { x: 31, y: 42, t: 'The hearth', b: 'Set off the room axis on purpose, so the sofa faces the glass and not the fire. Eleven feet of the same limestone as the entry, with a single walnut lintel.', m: 'Stone hearth · 11 ft · walnut lintel' },
        { x: 44, y: 64, t: 'Walnut, live edge', b: 'One slab, sixty millimetres, on a blackened steel base we drew to disappear. The edge was left exactly as the tree gave it.', m: 'Walnut · single slab · 60 mm' },
        { x: 64, y: 60, t: 'Bouclé sectional', b: 'Undyed 780 gsm wool over a feather-wrapped foam core. Twelve feet long, and it arrived in three pieces because the meadow track is narrow.', m: 'Wool bouclé · undyed · 780 gsm' },
        { x: 77, y: 42, t: 'Retractable glass', b: 'Twenty-four feet that stacks away entirely. Open, there is no threshold: the stone floor runs out to the terrace at the same level, with a slot drain doing the work.', m: 'Glass wall · 24 ft · level threshold' }
      ]
    },
    aerial: {
      src: 'assets/villa-aerial.jpg',
      alt: 'Meridian House and pool terrace from the air',
      label: 'Pool terrace · south elevation',
      meta: '4 marks · pool, fire, suite, approach',
      spots: [
        { x: 36, y: 71, t: 'Infinity edge', b: 'Fifty-two feet, with the weir edge set on the meadow side so the water reads as one plane against the grass from inside the great room.', m: 'Pool · 52 ft · weir edge south' },
        { x: 56, y: 75, t: 'Fire terrace', b: 'The room you use from September onward. Sunken a step below the pool deck so the wind off the meadow passes over it rather than through it.', m: 'Terrace · sunken 180 mm' },
        { x: 63, y: 46, t: 'Primary suite', b: 'Placed at the upper west corner with its own balcony, because this is where the sun lands last. The dressing room sits behind, windowless and lined in oak.', m: 'Level 2 · west corner' },
        { x: 86, y: 79, t: 'Meadow approach', b: 'A gravel track that curves so you never see the whole house at once. The first full view is from thirty metres out, and it is the view you are looking at now.', m: 'Approach · 340 m · crushed bluestone' }
      ]
    }
  };

  function tour() {
    var frame = $('#tourFrame'); if (!frame) return;
    var pan   = $('#tourPan'), img = $('#tourImg'), holder = $('#hotspots');
    var plate = $('#tourPlate'), pIdx = $('#plateIndex'), pTit = $('#plateTitle'),
        pBody = $('#plateBody'), pMeta = $('#plateMeta');
    var hint  = $('#tourHint'), roomLabel = $('#roomLabel'), roomMeta = $('#roomMeta');
    var tabs  = $$('.tour__tab');

    var cur = 'entry';
    var tx = 0, ty = 0, gx = 0, gy = 0;        // target / current offset, in px
    var dragging = false, moved = false, last = null, running = false;
    var ZOOM = 1.16;

    /* the plate is object-fit:cover inside the frame, so how far you can
       look around depends on how much of it is cropped away right now */
    function shown() {
      var bw = frame.clientWidth, bh = frame.clientHeight, ar = bw / bh;
      return ar < IMG_AR
        ? { w: bh * IMG_AR * ZOOM, h: bh * ZOOM, bw: bw, bh: bh }
        : { w: bw * ZOOM, h: (bw / IMG_AR) * ZOOM, bw: bw, bh: bh };
    }
    function maxOff() {
      var v = shown();
      return { x: Math.max(0, (v.w - v.bw) / 2), y: Math.max(0, (v.h - v.bh) / 2) };
    }
    /* image-space percentage -> frame-space percentage */
    function mapSpot(x, y) {
      var ar = frame.clientWidth / frame.clientHeight;
      return ar < IMG_AR
        ? [50 + (x - 50) * (IMG_AR / ar), y]
        : [x, 50 + (y - 50) * (ar / IMG_AR)];
    }
    function layoutSpots() {
      var list = ROOMS[cur].spots;
      $$('.hot', holder).forEach(function (b, i) {
        var m = mapSpot(list[i].x, list[i].y);
        b.style.left = m[0] + '%';
        b.style.top = m[1] + '%';
      });
    }

    function tickPan() {
      gx += (tx - gx) * .12;
      gy += (ty - gy) * .12;
      pan.style.transform = 'translate3d(' + gx.toFixed(2) + 'px,' + gy.toFixed(2) + 'px,0) scale(' + ZOOM + ')';
      if (Math.abs(tx - gx) > .3 || Math.abs(ty - gy) > .3) {
        requestAnimationFrame(tickPan);
      } else { running = false; }
    }
    function kick() { if (!running) { running = true; requestAnimationFrame(tickPan); } }

    function aimFromPointer(e) {
      var r = frame.getBoundingClientRect(), m = maxOff();
      var nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      var ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      tx = -nx * m.x * .85; ty = -ny * m.y * .7;
      kick();
    }

    frame.addEventListener('pointerdown', function (e) {
      dragging = true; moved = false; last = { x: e.clientX, y: e.clientY };
      frame.classList.add('is-drag');
    });
    frame.addEventListener('pointermove', function (e) {
      if (dragging) {
        var m = maxOff();
        tx = clamp(tx + (e.clientX - last.x), -m.x, m.x);
        ty = clamp(ty + (e.clientY - last.y), -m.y, m.y);
        if (Math.abs(e.clientX - last.x) + Math.abs(e.clientY - last.y) > 2) moved = true;
        last = { x: e.clientX, y: e.clientY };
        if (hint) hint.style.opacity = 0;
        kick();
      } else if (e.pointerType === 'mouse') {
        aimFromPointer(e);
      }
    });
    function release() { dragging = false; frame.classList.remove('is-drag'); }
    frame.addEventListener('pointerup', release);
    frame.addEventListener('pointercancel', release);
    frame.addEventListener('pointerleave', function () {
      release(); tx = 0; ty = 0; kick();
    });

    function openPlate(i) {
      var s = ROOMS[cur].spots[i];
      pIdx.textContent = ('0' + (i + 1)).slice(-2);
      pTit.textContent = s.t; pBody.textContent = s.b; pMeta.textContent = s.m;
      plate.hidden = false;
      $$('.hot', holder).forEach(function (h, n) { h.classList.toggle('is-on', n === i); });
    }
    function closePlate() {
      plate.hidden = true;
      $$('.hot', holder).forEach(function (h) { h.classList.remove('is-on'); });
    }
    $('#plateClose').addEventListener('click', closePlate);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePlate(); });

    function paint(key) {
      cur = key;
      var r = ROOMS[key];
      img.style.transition = 'opacity .32s ease';
      img.style.opacity = 0;
      setTimeout(function () { img.src = r.src; img.alt = r.alt; img.style.opacity = 1; }, 160);
      roomLabel.textContent = r.label;
      roomMeta.textContent = r.meta;
      holder.innerHTML = '';
      r.spots.forEach(function (s, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'hot';
        b.textContent = ('0' + (i + 1)).slice(-2);
        b.setAttribute('aria-label', s.t);
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          if (moved) { moved = false; return; }
          openPlate(i);
        });
        holder.appendChild(b);
      });
      layoutSpots();
      closePlate();
      if (hint) hint.style.opacity = 1;
    }

    window.addEventListener('resize', function () {
      layoutSpots();
      var m = maxOff();
      tx = clamp(tx, -m.x, m.x); ty = clamp(ty, -m.y, m.y);
      kick();
    });

    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabs.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        paint(btn.dataset.room);
      });
    });

    pan.style.transform = 'translate3d(0,0,0) scale(' + ZOOM + ')';
    paint('entry');
  }

  /* ============================================================
     5 · REVEALS — everything already above the fold stays put
     ============================================================ */
  function reveals() {
    if (REDUCED || !('IntersectionObserver' in window)) return;
    var targets = $$('.sec__head, .specs > div, .svc li, .steps li, .mats li, .amen li, .systems, .tour, .contact, .foot__in');
    var vh = window.innerHeight;
    var watched = targets.filter(function (el) {
      return el.getBoundingClientRect().top > vh * .92;
    });
    watched.forEach(function (el, i) {
      el.classList.add('js-hide');
      el.style.transitionDelay = (Math.min(i % 6, 5) * 55) + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('js-reveal');
        en.target.classList.remove('js-hide');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    watched.forEach(function (el) { io.observe(el); });
  }

  /* ============================================================
     6 · ENQUIRY FORM — local only, and it says so
     ============================================================ */
  function form() {
    var f = $('#form'); if (!f) return;
    var note = $('#formNote'), btn = $('#submit');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#f-name'), email = $('#f-email');
      var ok = true;
      [name, email].forEach(function (input) {
        var bad = !input.value.trim() || (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value));
        input.parentElement.classList.toggle('is-bad', bad);
        if (bad) ok = false;
      });
      if (!ok) {
        note.classList.remove('is-good');
        note.textContent = 'Add a name and a valid email so we can reply.';
        name.value.trim() ? email.focus() : name.focus();
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Sent';
      note.classList.add('is-good');
      note.textContent = 'Thank you, ' + name.value.trim().split(' ')[0] + '. Demo form — nothing left your browser.';
    });
  }

  /* ---------- go ---------- */
  function init() { boot(); flight(); tour(); reveals(); form(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
