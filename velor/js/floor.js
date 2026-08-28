/* ============================================================
   floor.js — the cars page.
   No stage, no timeline: this page is a catalogue, so it loads
   the floor and the interface bits and nothing else.
   ============================================================ */

import { initCars } from './cars.js';
import { initAnchors, initFooter } from './ui.js';

/* served on its own this is the whole document; bundled into the
   single-file preview it is one view of two, so scope the footer
   observer to whatever root this page actually occupies */
const root = document.querySelector('[data-view="cars"]') || document;

initCars();
initFooter(root);
initAnchors(null);
