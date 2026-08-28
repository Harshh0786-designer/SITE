/* ============================================================
   ui.js — the interface bits both pages need.
   The home page runs these alongside the 3D stage; the cars
   page runs them on their own.
   ============================================================ */

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initForm(){
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

/* in-page anchors only: a link to another page is left alone */
export function initAnchors(lenis){
  document.querySelectorAll('a[href^="#"]:not([data-route])').forEach(a => {
    a.addEventListener('click', (ev) => {
      const el = document.querySelector(a.getAttribute('href'));
      if(!el) return;
      ev.preventDefault();
      if(lenis) lenis.scrollTo(el, { offset: 0 });
      else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  });
}

/* the footer dips to black on arrival — an observer rather than a
   scrubbed tween, so it commits once the band is genuinely in view
   and lets go on the way back up. Runs on every path. */
export function initFooter(root = document){
  const foot = root.querySelector('.foot');
  if(!foot) return;
  if(!('IntersectionObserver' in window)){ foot.classList.add('is-dark'); return; }
  new IntersectionObserver(
    ([entry]) => foot.classList.toggle('is-dark', entry.isIntersecting),
    { rootMargin: '0px 0px -10% 0px' }
  ).observe(foot);
}

/* Served from the repo these are ordinary pages; bundled into the
   single-file preview they are views behind a hash router. Links written
   at runtime have to work either way. */
const ROUTED = !!document.querySelector('[data-view]');
const VIEW_OF = { 'index.html': 'home', 'cars.html': 'cars', 'contact.html': 'contact' };

export function pageHref(page, frag){
  if(!ROUTED) return frag ? `${page}#${frag}` : page;
  const view = VIEW_OF[page] || 'home';
  return frag ? `#${view}:${frag}` : `#${view}`;
}
