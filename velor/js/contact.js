/* ============================================================
   contact.js — the contact page: prose, so nothing to drive
   beyond the shared interface bits.
   ============================================================ */

import { initAnchors, initFooter } from './ui.js';
import { initSearch } from './search.js';

const root = document.querySelector('[data-view="contact"]') || document;

initFooter(root);
initAnchors(null);
initSearch(root);
