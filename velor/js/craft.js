/* ============================================================
   craft.js — one material, at length.
   Addressed by slug in the hash, so each has its own URL.
   ============================================================ */

import { CRAFT } from './data.js';
import { initAnchors, initFooter, initFootMarques, initFootCraft, initAsk, pageHref } from './ui.js';
import { initSearch } from './search.js';

const root = document.querySelector('[data-view="craft"]') || document;
const mount = root.querySelector('#craftPage');

function render(id){
  const topic = CRAFT.find(t => t.id === id) || CRAFT[0];
  document.title = `${topic.name} — Car Story`;

  mount.innerHTML = `
    <nav class="crumb"><a href="${pageHref('index.html', 'craft')}">Craftsmanship</a><span>/</span>${topic.name}</nav>

    <header class="sheet__head">
      <p class="eyebrow">Craftsmanship</p>
      <h1 class="display">${topic.name}</h1>
      <p class="sheet__note">${topic.lede}</p>
    </header>

    <div class="brief">
      <div class="brief__prose">
        ${topic.blocks.map(([head, paras]) => `
          <h2 class="brief__head">${head}</h2>
          ${paras.map(t => `<p>${t}</p>`).join('')}`).join('')}
      </div>

      <aside class="brief__aside">
        <h2 class="brief__head">What we check</h2>
        <ul class="keys">
          ${topic.checks.map((c, i) => `
            <li class="key"><span class="key__n">0${i + 1}</span>${c}</li>`).join('')}
        </ul>
      </aside>
    </div>

    <section class="terms">
      <h2 class="record__h">The words for it</h2>
      <dl class="dl dl--split">
        ${topic.terms.map(([t, d]) => `
          <div class="dl__row"><dt>${t}</dt><dd>${d}</dd></div>`).join('')}
      </dl>
    </section>

    <nav class="brandnav">
      <p class="brandnav__head">The rest of the car</p>
      <ul class="brandnav__list">
        ${CRAFT.filter(t => t.id !== topic.id).map(t =>
          `<li><a href="${pageHref('craft.html', t.id)}">${t.name}</a></li>`).join('')}
        <li><a class="brandnav__all" href="${pageHref('cars.html')}">See the cars</a></li>
      </ul>
    </nav>`;
}

/* Which topic the hash is asking for — or null when it addresses another
   page. Served alone the hash is just the id; bundled it is prefixed. */
function askedFor(){
  const hash = location.hash.replace(/^#/, '');
  if(root === document) return hash;
  if(hash === 'craft') return '';
  return hash.startsWith('craft:') ? hash.slice(6) : null;
}

if(mount){
  render(askedFor() || '');
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
