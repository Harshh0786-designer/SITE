/* ============================================================
   search.js — one field over a blurred page.
   Opens from the bar, filters the floor and the pages as you
   type, and hands you to the best match on Enter.
   ============================================================ */

import { FLOOR } from './data.js';
import { pageHref } from './ui.js';

/* "huracan" has to find Huracán, so both sides lose their accents */
const fold = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/* the pages and sections worth landing on, alongside the cars */
const PLACES = [
  ['Home',            'The wheel, and what we stand for',   'index.html',  ''],
  ['Craftsmanship',   'What we check, and what we fix',     'index.html',  'craft'],
  ['Selection',       'A curated few, not a lot',           'index.html',  'selection'],
  ['Parts',           'Factory-supplied, traced, fitted',   'index.html',  'parts'],
  ['Sell a Car',      'We buy outright and we broker',      'index.html',  'sell'],
  ['Enquiries',       'Reserve your drive',                 'index.html',  'contact'],
  ['Cars',            'Every car on the floor',             'cars.html',   ''],
  ['Contact Us',      'Who we are and how to reach us',     'contact.html',''],
  ['Reaching us',     'Four ways in, and where to find us', 'contact.html','reach']
];

const INDEX = [
  ...FLOOR.map(c => ({
    title: `${c.marque} ${c.name}`,
    note: `${c.spec} · ${c.colour} · ${c.price}`,
    hay: fold(`${c.marque} ${c.name} ${c.origin} ${c.colour} ${c.spec} ${c.price} ${c.engine} ${c.body}`),
    page: 'car.html',
    frag: c.id
  })),
  ...PLACES.map(([title, note, page, frag]) => ({
    title, note, hay: fold(`${title} ${note}`), page, frag
  }))
];

export function initSearch(root = document){
  const btn = root.querySelector('.search-btn');
  if(!btn) return;

  const shell = document.createElement('div');
  shell.className = 'search';
  shell.hidden = true;
  shell.innerHTML = `
    <div class="search__scrim" data-close></div>
    <div class="search__panel" role="dialog" aria-modal="true" aria-label="Search">
      <div class="search__field">
        <svg class="search__glass" viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.6" cy="8.6" r="5.6"/><path d="M12.8 12.8 L17 17"/></svg>
        <input class="search__input" id="searchInput" type="search" autocomplete="off"
               placeholder="A marque, a model, a colour…" aria-label="Search the site" />
        <span class="search__hint">Enter</span>
      </div>
      <ul class="search__results" id="searchResults"></ul>
    </div>`;
  document.body.appendChild(shell);

  const input = shell.querySelector('#searchInput');
  const list  = shell.querySelector('#searchResults');
  let hits = [];

  function render(q){
    const query = fold(q.trim());
    hits = query
      ? INDEX.filter(r => query.split(/\s+/).every(w => r.hay.includes(w))).slice(0, 7)
      : [];
    list.innerHTML = query && !hits.length
      ? `<li class="search__empty">Nothing here by that name.</li>`
      : hits.map((r, i) => `
          <li>
            <a class="search__hit${i ? '' : ' is-first'}" href="${pageHref(r.page, r.frag)}">
              <span class="search__hitname">${r.title}</span>
              <span class="search__hitnote">${r.note}</span>
            </a>
          </li>`).join('');
  }

  function open(){
    shell.hidden = false;
    document.body.classList.add('is-searching');
    btn.setAttribute('aria-expanded', 'true');
    input.value = '';
    render('');
    requestAnimationFrame(() => input.focus());
  }

  /* Enter is what lifts the blur: either it takes you to the top match
     or, with nothing to go to, it simply closes. */
  function close(){
    shell.hidden = true;
    document.body.classList.remove('is-searching');
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }

  btn.addEventListener('click', () => (shell.hidden ? open() : close()));
  input.addEventListener('input', () => render(input.value));

  shell.addEventListener('click', (ev) => {
    if(ev.target.closest('[data-close]')) close();
  });

  input.addEventListener('keydown', (ev) => {
    if(ev.key === 'Escape'){ ev.preventDefault(); close(); }
    if(ev.key !== 'Enter') return;
    ev.preventDefault();
    const first = list.querySelector('.search__hit');
    close();
    if(first) first.click();
  });
}
