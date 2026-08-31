/* ============================================================
   about.js — the about page is prose, so there is nothing to
   drive here beyond the shared interface bits.
   ============================================================ */

import { initAnchors, initFooter, initFootMarques, initFootCraft, initAsk } from './ui.js';
import { initSearch } from './search.js';

const root = document.querySelector('[data-view="about"]') || document;

initFooter(root);
initFootMarques(root);
initFootCraft(root);
initAsk(root);
initAnchors(null);
initSearch(root);
