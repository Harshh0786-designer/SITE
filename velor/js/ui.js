/* ============================================================
   ui.js — the interface bits both pages need.
   The home page runs these alongside the 3D stage; the cars
   page runs them on their own.
   ============================================================ */

import { MARQUES, CRAFT } from './data.js';

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

/* In-page anchors only. A router hash such as "#cars:marque=ferrari" is
   not a valid selector, so match a plain id rather than handing anything
   that starts with a hash to querySelector. */
const PLAIN_ID = /^#[A-Za-z][\w-]*$/;

export function initAnchors(lenis){
  document.querySelectorAll('a[href^="#"]:not([data-route])').forEach(a => {
    const href = a.getAttribute('href');
    if(!PLAIN_ID.test(href)) return;
    a.addEventListener('click', (ev) => {
      const el = document.querySelector(href);
      if(!el) return;
      ev.preventDefault();
      if(lenis) lenis.scrollTo(el, { offset: 0 });
      else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  });
}

/* the footer lists the floor by marque, straight from the catalogue, so
   it cannot drift out of step with what we actually hold */
export function initFootMarques(root = document){
  const list = root.querySelector('[id^="footMarques"]');
  if(!list) return;
  /* names only here — the count belongs on the floor, not in the footer */
  list.innerHTML = MARQUES.map(m =>
    `<li><a href="${pageHref('brand.html', m.id)}">${m.name}</a></li>`
  ).join('');
}

/* and the same for what the cars are made of */
export function initFootCraft(root = document){
  const list = root.querySelector('[id^="footCraft"]');
  if(!list) return;
  list.innerHTML = CRAFT.map(t =>
    `<li><a href="${pageHref('craft.html', t.id)}">${t.name}</a></li>`
  ).join('');
}

/* the ask bar hands the question to the people who answer it */
export function initAsk(root = document){
  const form = root.querySelector('.ask');
  if(!form) return;
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = form.querySelector('.ask__input').value.trim();
    window.location.href = q
      ? `mailto:viewings@carstory.com?subject=${encodeURIComponent('Enquiry')}&body=${encodeURIComponent(q)}`
      : 'mailto:viewings@carstory.com?subject=Enquiry';
    form.reset();
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
const VIEW_OF = { 'index.html': 'home', 'cars.html': 'cars',
                  'contact.html': 'contact', 'car.html': 'car',
                  'brand.html': 'brand', 'craft.html': 'craft' };

export function pageHref(page, frag){
  if(!ROUTED) return frag ? `${page}#${frag}` : page;
  const view = VIEW_OF[page] || 'home';
  return frag ? `#${view}:${frag}` : `#${view}`;
}
