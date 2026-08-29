/* ============================================================
   floor.js — the cars page.
   No stage, no timeline: this page is a catalogue, so it loads
   the floor and the interface bits and nothing else.
   ============================================================ */

import { initCars } from './cars.js';
import { initAnchors, initFooter, initFootMarques, initFootCraft, initAsk } from './ui.js';
import { initSearch } from './search.js';

/* served on its own this is the whole document; bundled into the
   single-file preview it is one view of two, so scope the footer
   observer to whatever root this page actually occupies */
const root = document.querySelector('[data-view="cars"]') || document;

initCars();
initFooter(root);
initFootMarques(root);
initFootCraft(root);
initAsk(root);
initAnchors(null);
initSearch(root);
