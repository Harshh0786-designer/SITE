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

  /* ---- marque rail: every marque leads to its own page ---- */
  const marques = [];
  FLOOR.forEach(c => {
    const id = c.marque.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const found = marques.find(m => m.id === id);
    if(found) found.n++; else marques.push({ name: c.marque, id, n: 1 });
  });

  rail.innerHTML = `
    <li>
      <span class="brand brand--here" aria-current="page">
        <span class="brand__mark" aria-hidden="true"></span>
        <span class="brand__name">All marques</span>
        <span class="brand__n">${FLOOR.length}</span>
      </span>
    </li>` + marques.map(m => `
      <li>
        <a class="brand" href="${pageHref('brand.html', m.id)}">
          <span class="brand__mark" aria-hidden="true"></span>
          <span class="brand__name">${m.name}</span>
          <span class="brand__n">${m.n}</span>
        </a>
      </li>`).join('');

  if(tally) tally.textContent = `${FLOOR.length} cars`;
}
