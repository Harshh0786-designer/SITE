/* ============================================================
   brand.js — one marque, and only its cars.
   Addressed by the marque's slug in the hash, so every brand has
   its own URL and title.
   ============================================================ */

import { MARQUES, carsOf } from './data.js';
import { profile } from './profile.js';
import { initAnchors, initFooter, initFootMarques, initAsk, pageHref } from './ui.js';
import { initSearch } from './search.js';

const root = document.querySelector('[data-view="brand"]') || document;
const mount = root.querySelector('#brandPage');

function render(id){
  const marque = MARQUES.find(m => m.id === id) || MARQUES[0];
  const cars = carsOf(marque.id);

  document.title = `${marque.name} — Car Story`;

  mount.innerHTML = `
    <nav class="crumb"><a href="${pageHref('cars.html')}">The floor</a><span>/</span>${marque.name}</nav>

    <header class="sheet__head">
      <p class="eyebrow">${marque.home}</p>
      <h1 class="display">${marque.name}</h1>
      <p class="sheet__note">${marque.blurb}</p>
    </header>

    <ul class="motors">
      ${cars.map((c, i) => `
        <li class="motor">
          <a class="motor__link" href="${pageHref('car.html', c.id)}">
            <span class="motor__frame">${profile(c.body, c.paint, marque.id + i)}</span>
            <p class="motor__marque">${c.marque}<span class="motor__origin">${c.origin}</span></p>
            <h2 class="motor__name">${c.name}</h2>
            <p class="motor__spec">${c.spec}</p>
            <p class="motor__colour"><span class="motor__chip" style="--chip:${c.paint}"></span>${c.colour}</p>
            <p class="motor__price">${c.price}</p>
          </a>
        </li>`).join('')}
    </ul>

    <nav class="brandnav">
      <p class="brandnav__head">Other marques</p>
      <ul class="brandnav__list">
        ${MARQUES.filter(m => m.id !== marque.id).map(m =>
          `<li><a href="${pageHref('brand.html', m.id)}">${m.name}</a></li>`).join('')}
        <li><a class="brandnav__all" href="${pageHref('cars.html')}">The whole floor</a></li>
      </ul>
    </nav>`;
}

/* Which record the hash is asking for — or null when it is addressing a
   different page. Served alone the hash is just the id; bundled into the
   single-file preview it is prefixed with this view's name. */
function askedFor(){
  const hash = location.hash.replace(/^#/, '');
  if(root === document) return hash;
  if(hash === 'brand') return '';
  return hash.startsWith('brand:') ? hash.slice(6) : null;
}

if(mount){
  render(askedFor() || '');
  /* Do not gate this on the view being visible: the router unhides it in
     its own hashchange listener, which may run after this one. */
  window.addEventListener('hashchange', () => {
    const id = askedFor();
    if(id !== null) render(id);
  });
}

initFooter(root);
initFootMarques(root);
initAsk(root);
initAnchors(null);
initSearch(root);
