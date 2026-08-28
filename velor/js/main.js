/* ============================================================
   main.js — one unbroken shot.
   The page is a timeline; scroll position is the playhead.
   Nothing here fades the tyre out and back in: every section
   is the same object, somewhere else in its transformation.
   ============================================================ */

import { initCars } from './cars.js';

const body   = document.body;
const canvas = document.getElementById('scene');
const page   = document.getElementById('page');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse  = window.matchMedia('(pointer: coarse)').matches;
const narrow  = window.matchMedia('(max-width: 880px)').matches;

/* ---------- always-on interface bits ---------- */

function initForm(){
  const form = document.getElementById('reserve');
  const input = document.getElementById('email');
  const note = document.getElementById('reserveNote');
  if(!form) return;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const value = input.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    note.classList.toggle('is-error', !valid);
    note.textContent = valid
      ? 'Received. We will write within one working day.'
      : 'A valid email, please.';
    if(valid) form.reset();
  });
}

function initAnchors(lenis){
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const el = document.querySelector(a.getAttribute('href'));
      if(!el) return;
      ev.preventDefault();
      if(lenis) lenis.scrollTo(el, { offset: 0 });
      else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  });
}

initForm();
initCars();

/* ---------- footer: the page dips to black on arrival ----------
   An observer rather than a scrubbed tween, so the band commits to
   ink once it is genuinely in view and lets go on the way back up.
   Runs on every path, reduced motion included. */
function initFooter(){
  const foot = document.getElementById('foot');
  if(!foot) return;
  if(!('IntersectionObserver' in window)){ foot.classList.add('is-dark'); return; }
  new IntersectionObserver(
    ([entry]) => foot.classList.toggle('is-dark', entry.isIntersecting),
    { rootMargin: '0px 0px -10% 0px' }
  ).observe(foot);
}

initFooter();

/* ---------- reduced motion / no WebGL: hold a still frame ---------- */

function webglAvailable(){
  try{
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl')));
  }catch(e){ return false; }
}

if(reduced || !webglAvailable()){
  body.classList.add(reduced ? 'reduced' : 'no-webgl');
  body.classList.remove('is-loading');
  document.getElementById('stageFallback').style.opacity = 1;
  initAnchors(null);
}else{
  boot();
}

/* ============================================================ */

async function boot(){
  await new Promise(r => (document.readyState === 'complete'
    ? r()
    : window.addEventListener('load', r, { once: true })));

  /* the scene is the heaviest thing on the page — it waits for
     first paint rather than blocking it */
  const { createStage, R } = await import('./stage.js');

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  const lowEnd = coarse || (navigator.hardwareConcurrency || 8) <= 4;
  const annotations = [...document.querySelectorAll('.annotation')];

  const stage = createStage(canvas, {
    quality: lowEnd ? 'low' : 'high',
    onHover(part){
      annotations.forEach(a => a.classList.toggle('is-hot', a.dataset.part === part));
      document.documentElement.style.cursor = part ? 'crosshair' : '';
    }
  });
  const { state, camera } = stage;

  /* ---------- smooth, inertial scroll ---------- */
  let lenis = null;
  if(!coarse && window.Lenis){
    lenis = new window.Lenis({ lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    /* lagSmoothing off is the documented pairing with Lenis: the master
       timeline is scrubbed from scroll position, so a stall must not put
       the animation into slow motion and desynchronise it from where the
       page actually is. */
    gsap.ticker.lagSmoothing(0);
  }
  initAnchors(lenis);

  /* ---------- pointer parallax: the one signature flourish ---------- */
  if(!coarse){
    window.addEventListener('pointermove', (ev) => {
      stage.setPointer(
        (ev.clientX / window.innerWidth) * 2 - 1,
        -((ev.clientY / window.innerHeight) * 2 - 1)
      );
    }, { passive: true });
  }

  stage.warmUp();
  stage.start();
  body.classList.remove('is-loading');

  /* two settled frames after warm-up: the first frame after start still
     carries texture uploads, and the drop is the worst place to spend
     them */
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  /* ============================================================
     HERO — gravity, three decaying bounces, then rest
     ============================================================ */

  const root = stage.root;
  root.position.set(0, 7.2, 0);
  state.idleSpeed = 0;
  state.rollCouple = 0;

  gsap.set(['#menu a', '#wordmark span', '#heroSub', '#heroLede', '#scrollCue'], { opacity: 0 });

  const intro = gsap.timeline({ defaults: { overwrite: 'auto' } });

  /* Gravity is symmetric: a bounce to height h takes as long going up
     as coming down, and each arc is sqrt(h) of the drop that produced
     it. Every beat is placed at an absolute time derived from that, not
     appended — chaining these lets the squash release serialise after
     the fall instead of overlapping the rise, which is what made the
     sequence feel long and disjointed. */
  const DROP_H = 6.2;                      // how far it falls to the floor
  const FALL   = 0.78;                     // and how long that takes
  const arc    = (h) => FALL * Math.sqrt(h / DROP_H);
  let at = 0;

  /* squash and release across the contact, overlapping whatever the
     wheel does next */
  function impact(force){
    intro.add(() => stage.puff(force), at)
         .to(state, { squash: force, duration: 0.05, ease: 'sine.out' }, at)
         .to(state, { squash: 0, duration: 0.20 + force * 0.14, ease: 'back.out(1.8)' }, at + 0.05);
  }

  function hop(height, force){
    impact(force);
    const a = arc(height);
    intro.to(root.position, { y: R + height, duration: a, ease: 'power2.out' }, at)
         .to(root.position, { y: R, duration: a, ease: 'power2.in' }, at + a);
    at += 2 * a;
  }

  intro.to(root.position, { y: R, duration: FALL, ease: 'power2.in' }, 0);
  at = FALL;

  hop(1.55, 0.62);
  hop(0.55, 0.34);
  hop(0.17, 0.16);
  hop(0.05, 0.07);
  impact(0.03);

  const copyAt = at - 0.62;
  intro
    .to(state, { idleSpeed: 0.075, duration: 1.3, ease: 'power1.out' }, at - 0.3)
    .fromTo('#menu a', { y: -8 }, {
      y: 0, opacity: 1, duration: 0.7, stagger: 0.04, ease: 'power2.out'
    }, copyAt - 0.12)
    .fromTo('#wordmark span', { yPercent: 60 }, {
      yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.05, ease: 'power3.out'
    }, copyAt)
    .to('#heroSub', { opacity: 1, duration: 0.8, ease: 'power2.out' }, copyAt + 0.28)
    .fromTo('#heroLede', { y: 14 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power2.out' }, copyAt + 0.42)
    .fromTo('#scrollCue', { scaleY: 0.2 }, { scaleY: 1, opacity: 1, duration: 0.7, ease: 'power2.out' }, copyAt + 0.66)
    .add(() => { state.rollCouple = 1; }, at);

  /* ============================================================
     SCROLL — one scrubbed timeline across the whole document
     ============================================================ */

  let master = null;

  function buildMaster(){
    if(master){ master.scrollTrigger && master.scrollTrigger.kill(); master.kill(); }

    const vh = window.innerHeight;
    const denom = Math.max(1, page.scrollHeight - vh);

    /* a section's copy is on screen from the moment its top clears the
       viewport bottom until its sticky block is released — that window,
       not its offsetTop, is what each beat has to land inside */
    const win = (id) => {
      const el = document.getElementById(id);
      return [
        Math.max(0, Math.min(1, (el.offsetTop - vh) / denom)),
        Math.max(0, Math.min(1, (el.offsetTop + el.offsetHeight - vh) / denom))
      ];
    };

    const [c0, c1] = win('craft');
    const [s0, s1] = win('selection');
    const [t0, t1] = win('process');
    const [k0]     = win('contact');
    const cs = Math.max(0.05, c1 - c0);
    const ts = Math.max(0.05, t1 - t0);
    const ks = Math.max(0.05, 1 - k0);

    /* mobile keeps every beat but spends less on camera moves */
    const camPan = narrow ? 0.55 : 1;
    const restX  = narrow ? 1.35 : 2.2;
    const flatX  = narrow ? -1.0 : -1.7;

    /* the exploded column is framed to fill the viewport: its centre and
       the camera distance that makes five parts span the full height */
    const colY = narrow ? 2.55 : 2.90;
    const colZ = narrow ? 6.4  : 7.9;

    master = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: page, start: 'top top', end: 'bottom bottom',
        scrub: 0.65, invalidateOnRefresh: true
      }
    });

    /* 1 -> 2 — rolls diagonally to a new mark, camera travelling with it */
    const rollEnd = c0 + cs * 0.40;
    master
      .to(root.position, { x: restX, z: -0.55, duration: rollEnd, ease: 'power1.inOut' }, 0)
      .to(state, { yaw: -0.42, duration: rollEnd * 0.7, ease: 'power1.inOut' }, 0)
      .to(camera.position, { x: restX * 0.52 * camPan, y: 1.55, duration: rollEnd, ease: 'power1.inOut' }, 0)
      .to(state.target, { x: restX * 0.72, y: R * 1.0, duration: rollEnd, ease: 'power1.inOut' }, 0);

    /* 2 -> 3 — squares up, lifts to the middle of the frame, and opens
       into a vertical column that fills the viewport */
    master
      .to(state, { yaw: 0, duration: cs * 0.20, ease: 'power2.inOut' }, c0 + cs * 0.38)
      .to(state, { idleSpeed: 0.03, duration: cs * 0.20 }, c0 + cs * 0.38)
      .to(root.position, { x: 0, y: colY, z: 0, duration: cs * 0.32, ease: 'power2.inOut' }, c0 + cs * 0.38)
      .to(state, { explode: 1, duration: cs * 0.28, ease: 'power2.inOut' }, c0 + cs * 0.42)
      .to(camera.position, { x: 0, y: colY, z: colZ, duration: cs * 0.34, ease: 'power1.inOut' }, c0 + cs * 0.38)
      .to(state.target, { x: 0, y: colY, duration: cs * 0.34, ease: 'power1.inOut' }, c0 + cs * 0.38)
      .to(state, { reflection: 0.02, duration: cs * 0.24, ease: 'power2.inOut' }, c0 + cs * 0.42)
      .to(annotations, {
        opacity: 1, y: 0, duration: cs * 0.12, stagger: cs * 0.035, ease: 'power2.out'
      }, c0 + cs * 0.58)
      .to(annotations, { opacity: 0, duration: cs * 0.10, ease: 'power2.in' }, c0 + cs * 0.84);

    /* 3 -> 4 — reassembles, flips onto its side, becomes a wheel */
    const reAt = c0 + cs * 0.86;
    const reDur = Math.max(0.04, (s0 + (s1 - s0) * 0.14) - reAt);
    master
      .to(state, { explode: 0, reflection: 0.09, duration: reDur * 0.7, ease: 'power2.inOut' }, reAt)
      .to(state, { flip: -Math.PI / 2, duration: reDur, ease: 'power2.inOut' }, reAt)
      .to(root.position, { x: flatX, y: R * 0.34, z: 0.4, duration: reDur, ease: 'power2.inOut' }, reAt)
      .to(state, { idleSpeed: 1.35, shadowScale: 1.25, duration: reDur, ease: 'power2.in' }, reAt + reDur * 0.1)
      .to(camera.position, {
        x: flatX * 0.35 * camPan, y: narrow ? 3.2 : 3.6, z: narrow ? 6.6 : 5.9,
        duration: reDur, ease: 'power1.inOut'
      }, reAt)
      .to(state.target, { x: flatX * 0.7, y: narrow ? -1.45 : 0.2, duration: reDur, ease: 'power1.inOut' }, reAt);

    /* 4 — the wheel turns while the selection reads */
    const spinAt = s0 + (s1 - s0) * 0.14;
    master
      .to(camera.position, { y: narrow ? 2.9 : 3.1, z: narrow ? 6.2 : 5.5, duration: s1 - spinAt }, spinAt)
      .to(state, { idleSpeed: 0.85, duration: s1 - spinAt }, spinAt);

    /* 4 -> 5 — back upright and centred for the process line */
    master
      .to(state, { flip: 0, idleSpeed: 0.09, shadowScale: 1, duration: ts * 0.72, ease: 'power2.inOut' }, t0)
      .to(root.position, { x: 0, y: R, z: 0, duration: ts * 0.72, ease: 'power2.inOut' }, t0)
      .to(camera.position, { x: 0, y: 2.30, z: narrow ? 7.2 : 6.1, duration: ts * 0.78, ease: 'power1.inOut' }, t0)
      .to(state.target, { x: 0, y: 1.72, duration: ts * 0.78, ease: 'power1.inOut' }, t0);

    /* 5 — rolls out of frame, leaving one last chrome trace */
    master
      .to(root.position, { x: narrow ? 7.5 : 10.5, duration: ks * 0.82, ease: 'power1.in' }, k0)
      .to(state, { reflection: 0.04, duration: ks * 0.82, ease: 'power1.in' }, k0)
      .to(state, { opacity: 0.05, duration: ks * 0.34, ease: 'power2.in' }, k0 + ks * 0.48)
      .to(camera.position, { x: 1.4 * camPan, duration: ks, ease: 'power1.inOut' }, k0);

    /* hover-to-inspect only exists while the tyre is open */
    ScrollTrigger.create({
      trigger: '#craft', start: 'top center', end: 'bottom center',
      onToggle: (self) => stage.enableHover(!coarse && self.isActive)
    });
  }

  /* ---------- copy reveals: crossfades, never parallax ---------- */
  gsap.utils.toArray('.panel:not(.panel--hero) .panel__type').forEach(el => {
    gsap.from(el.children, {
      y: 26, opacity: 0, duration: 1.1, stagger: 0.09, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 62%', toggleActions: 'play none none reverse' }
    });
  });

  /* let each pinned block dissolve as its panel releases, rather than
     sliding out from under the nav and colliding with the next one */
  gsap.utils.toArray('.panel--craft .panel__type, .selection__col, .panel--trust .panel__type')
    .forEach(el => {
      gsap.to(el, {
        opacity: 0, ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.panel'), start: 'bottom bottom', end: 'bottom 58%', scrub: true
        }
      });
    });

  gsap.from('.car', {
    y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
    scrollTrigger: { trigger: '#inventory', start: 'top 78%', toggleActions: 'play none none reverse' }
  });

  gsap.to('#scrollCue', {
    opacity: 0, duration: 0.4, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: '30% top', scrub: true }
  });

  gsap.set('.annotation', { opacity: 0, y: 6 });

  /* ---------- smoke ----------
     Two sources: the speed you are scrolling at, which thickens the
     ambient haze continuously, and a wash that sweeps across as one
     section hands over to the next. */
  const veil = document.querySelector('.veil');
  const clouds = gsap.utils.toArray('.veil__cloud');
  let energy = 0;

  gsap.ticker.add(() => {
    const v = master && master.scrollTrigger ? Math.abs(master.scrollTrigger.getVelocity()) : 0;
    const want = Math.min(1, v / 1300);
    /* rise quickly with the scroll, fall away slowly, so the trail
       lingers behind the movement instead of snapping off */
    energy += (want - energy) * (want > energy ? 0.22 : 0.045);
    stage.setScrollEnergy(energy);
  });

  const handover = gsap.timeline({ paused: true })
    .fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' })
    .to(veil, { opacity: 0, duration: 1.15, ease: 'power2.in' })
    .fromTo(clouds[0],
      { xPercent: -16, scale: 1.06, opacity: .5 },
      { xPercent: 14, scale: 1.22, opacity: .9, duration: 1.65, ease: 'power1.out' }, 0)
    .fromTo(clouds[1],
      { xPercent: 14, scale: 1.14, opacity: .4 },
      { xPercent: -12, scale: 1.3, opacity: .85, duration: 1.65, ease: 'power1.out' }, 0);

  function sweep(strength){
    stage.smokePulse(strength);
    handover.restart();
  }

  gsap.utils.toArray('.panel:not(.panel--hero)').forEach(panel => {
    ScrollTrigger.create({
      trigger: panel, start: 'top 82%', end: 'bottom 18%',
      onEnter: () => sweep(0.7),
      onEnterBack: () => sweep(0.55)
    });
  });

  buildMaster();

  let rebuild;
  window.addEventListener('resize', () => {
    clearTimeout(rebuild);
    rebuild = setTimeout(() => { buildMaster(); ScrollTrigger.refresh(); }, 220);
  });

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stage.stop() : stage.start();
  });
}
