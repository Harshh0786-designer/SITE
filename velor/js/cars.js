/* ============================================================
   cars.js — the floor: a marque rail and a grid of cards.
   ============================================================ */

import { FLOOR } from './data.js';
import { profile } from './profile.js';
import { pageHref } from './ui.js';

export function initCars(){
  const grid = document.getElementById('motors');
  const rail = document.getElementById('brands');
  const tally = document.getElementById('carsTally');
  if(!grid || !rail) return;

  /* ---- cards: the whole card is the way into the car's own page ---- */
  grid.innerHTML = FLOOR.map((c, i) => `
    <li class="motor" data-brand="${c.marque.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">
      <a class="motor__link" href="${pageHref('car.html', c.id)}">
        <span class="motor__frame">${profile(c.body, c.paint, i)}</span>
        <p class="motor__marque">${c.marque}<span class="motor__origin">${c.origin}</span></p>
        <h3 class="motor__name">${c.name}</h3>
        <p class="motor__spec">${c.spec}</p>
        <p class="motor__colour"><span class="motor__chip" style="--chip:${c.paint}"></span>${c.colour}</p>
        <p class="motor__price">${c.price}</p>
      </a>
    </li>`).join('');

  /* ---- brand rail: every marque on the floor, in stock order ---- */
  const brands = [];
  FLOOR.forEach(c => {
    const id = c.marque.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const found = brands.find(b => b.id === id);
    if(found) found.n++; else brands.push({ name: c.marque, id, n: 1 });
  });

  rail.innerHTML = [{ name: 'All marques', id: 'all', n: FLOOR.length }, ...brands]
    .map(b => `
      <li>
        <button class="brand" role="radio" aria-checked="${b.id === 'all'}" data-brand="${b.id}">
          <span class="brand__mark" aria-hidden="true"></span>
          <span class="brand__name">${b.name}</span>
          <span class="brand__n">${b.n}</span>
        </button>
      </li>`).join('');

  const cards   = [...grid.children];
  const buttons = [...rail.querySelectorAll('.brand')];

  function show(id){
    let shown = 0;
    cards.forEach(c => {
      const on = id === 'all' || c.dataset.brand === id;
      c.hidden = !on;
      if(on) shown++;
    });
    buttons.forEach(b => b.setAttribute('aria-checked', String(b.dataset.brand === id)));
    if(tally) tally.textContent = shown === FLOOR.length
      ? `${shown} cars` : `${shown} of ${FLOOR.length} cars`;

    /* the page just changed height — anything measuring it has to re-measure */
    if(window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  rail.addEventListener('click', (ev) => {
    const b = ev.target.closest('.brand');
    if(b) show(b.dataset.brand);
  });

  show('all');
}
