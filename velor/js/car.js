/* ============================================================
   car.js — one car, in full.
   The page is addressed by the car's slug in the hash, so every
   car has its own URL, title and history entry.
   ============================================================ */

import { FLOOR } from './data.js';
import { profile } from './profile.js';
import { initAnchors, initFooter, pageHref, initFootMarques, initFootCraft, initAsk } from './ui.js';
import { initSearch } from './search.js';

const root = document.querySelector('[data-view="car"]') || document;
const mount = root.querySelector('#carPage');

const GRADE_NOTE = {
  A:  'As it should be',
  'A−': 'Sound, with something noted',
  'B+': 'Serviceable, item due',
  B:  'Usable, work to come'
};

function row(label, value){
  return value ? `<div class="dl__row"><dt>${label}</dt><dd>${value}</dd></div>` : '';
}

function render(id){
  const car = FLOOR.find(c => c.id === id) || FLOOR[0];
  const i = FLOOR.indexOf(car);

  document.title = `${car.marque} ${car.name} — Car Story`;

  const health = Object.entries(car.health).map(([area, [grade, note]]) => `
    <li class="vital">
      <span class="vital__area">${area}</span>
      <span class="vital__grade" data-grade="${grade}">${grade}</span>
      <span class="vital__note">${note}</span>
    </li>`).join('');

  mount.innerHTML = `
    <nav class="crumb"><a href="${pageHref('cars.html')}">The floor</a><span>/</span>${car.marque}</nav>

    <header class="record__head">
      <div class="record__title">
        <p class="eyebrow">${car.marque} · ${car.origin}</p>
        <h1 class="display">${car.name}</h1>
        <p class="record__price">${car.price}</p>
        <p class="record__paint"><span class="motor__chip" style="--chip:${car.paint}"></span>${car.colour}</p>
      </div>
      <div class="record__art">${profile(car.body, car.paint, 'p' + i)}</div>
    </header>

    <section class="record__band">
      <div class="stat"><span class="stat__k">Driven</span><span class="stat__v">${car.km} km</span></div>
      <div class="stat"><span class="stat__k">Year</span><span class="stat__v">${car.year}</span></div>
      <div class="stat"><span class="stat__k">Owners</span><span class="stat__v">${car.owners}</span></div>
      <div class="stat"><span class="stat__k">Power</span><span class="stat__v">${car.power}</span></div>
    </section>

    <p class="record__note">${car.note}</p>

    <section class="record__block">
      <h2 class="record__h">Health</h2>
      <p class="record__lede">Graded by the technician who inspected the car, not by the person
         selling it. Anything marked below an A is explained rather than smoothed over.</p>
      <ul class="vitals">${health}</ul>
    </section>

    <section class="record__block">
      <h2 class="record__h">Status on the road</h2>
      <dl class="dl">
        ${row('Driven status', car.status)}
        ${row('Registration', car.reg)}
        ${row('Service history', car.service)}
        ${row('Keys', car.keys)}
      </dl>
    </section>

    <section class="record__block">
      <h2 class="record__h">Specification</h2>
      <dl class="dl dl--split">
        ${row('Engine', car.engine)}
        ${row('Power', car.power)}
        ${row('Torque', car.torque)}
        ${row('Gearbox', car.gearbox)}
        ${row('Drive', car.drive)}
        ${row('0–100 km/h', car.sprint)}
        ${row('Top speed', car.top)}
        ${row('Kerb weight', car.weight)}
        ${row('Seats', car.seats)}
        ${row('Paint', car.colour)}
      </dl>
    </section>

    <section class="record__cta">
      <h2 class="record__h">See it</h2>
      <p class="record__lede">The car is at the workshop in Lower Parel. Viewings are by
         appointment, seven days a week.</p>
      <p class="record__actions">
        <a class="link" href="mailto:viewings@carstory.com?subject=${encodeURIComponent(car.marque + ' ' + car.name)}">viewings@carstory.com</a>
        <span class="contact__sep">·</span>
        <a class="link" href="tel:+912261004500">+91 22 6100 4500</a>
      </p>
    </section>

    <nav class="record__more">
      <p class="record__morehead">Others from ${car.marque}</p>
      <ul class="siblings">
        ${FLOOR.filter(c => c.marque === car.marque && c.id !== car.id).map(c => `
          <li><a href="${pageHref('car.html', c.id)}">
            <span class="siblings__name">${c.name}</span>
            <span class="siblings__spec">${c.spec}</span>
            <span class="siblings__price">${c.price}</span>
          </a></li>`).join('')}
      </ul>
    </nav>`;

  /* grades carry a plain-language reading for anyone who does not know the scale */
  mount.querySelectorAll('.vital__grade').forEach(el => {
    el.title = GRADE_NOTE[el.dataset.grade] || '';
  });
}

/* Which record the hash is asking for — or null when it is addressing a
   different page. Served alone the hash is just the id; bundled into the
   single-file preview it is prefixed with this view's name. */
function askedFor(){
  const hash = location.hash.replace(/^#/, '');
  if(root === document) return hash;
  if(hash === 'car') return '';
  return hash.startsWith('car:') ? hash.slice(4) : null;
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
initFootCraft(root);
initAsk(root);
initAnchors(null);
initSearch(root);
