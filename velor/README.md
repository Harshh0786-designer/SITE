# VELOR MOTORS — single-asset kinetic concept

A scroll-driven landing page for a luxury car reseller. The whole homepage is
choreographed around **one hero 3D asset: a tyre**. There is no stock
photography anywhere on the page. Motion, material and lighting carry the
content; the tyre never disappears and reappears, it only transforms.

## The sequence

| Beat | What the tyre does | Copy |
|---|---|---|
| Hero | Drops under gravity, bounces three times with decaying height, a dust puff and a squash on each contact, settles and turns slowly in place | VELOR / *Fewer cars. Absolute condition.* |
| 1 → 2 | Rolls diagonally to a new mark, camera travelling with it | — |
| 2 → 3 | Squares up to the camera, opens into tread, sidewalls, rim and hub with micro-labels | *Nothing overlooked.* |
| 3 → 4 | Reassembles, flips onto its side, becomes a spinning wheel | *A curated few, not a lot.* + inventory |
| 4 → 5 | Comes back upright and centres | *Inspected. Verified. Delivered.* |
| 5 | Rolls out of frame, leaving the empty studio | *Reserve a viewing.* |

Every beat after the hero is **scrubbed** — tied to scroll position, not
autoplayed — so the page reads as one unbroken shot in either direction.

## Running it

Any static server; there is no build step.

```
python3 -m http.server 8000    # then open /velor/
```

## How it is put together

```
index.html          markup and copy — six lines of copy in total
css/style.css       palette, type, grain, and the chrome over the stage
js/stage.js         the tyre: geometry, materials, lighting, reflection, render loop
js/main.js          orchestration: hero drop, the scrubbed scroll timeline, reveals
vendor/             three.js, GSAP + ScrollTrigger, Lenis (vendored, no CDN at runtime)
```

**The tyre is generated in code**, not loaded as a model: lathed carcass and
sidewalls, an instanced ring of tread sipes, a five-spoke rim over a dark drum,
and a hub with lugs. Rubber grain comes from a procedurally generated normal
map rather than geometry, so the whole scene stays low-poly.

`js/stage.js` exposes a single `state` object — `flip`, `roll`, `explode`,
`squash`, `idleSpeed`, `opacity`, `reflection`, `target` — and `js/main.js`
does nothing but tween that object against scroll. To retime the choreography,
edit `buildMaster()`; to change what the object *is*, edit `buildTyre()`.

### Details worth knowing

- **Reflection.** A mirrored clone of the tyre sits under the floor plane and
  copies every part's transform each frame, so the reflection follows the
  exploded view too. The floor's alpha mask keeps it to a hint.
- **Contact shadow.** A gradient plane whose scale and opacity read the tyre's
  height off the floor, so it tightens as the tyre lands.
- **The explode is counter-rotated** out of the tyre's own roll. Without that
  the diagram turns with the wheel and reads as a pile.
- **Scroll mapping.** Beats are placed against each section's *on-screen
  window* — from the moment its top clears the viewport bottom until its
  sticky block releases — not its `offsetTop`, which is a viewport out.
- **Pointer parallax** tilts the tyre a few degrees, everywhere, all the way
  through. It is the only thing on the page that responds to the cursor.

## Fallbacks

- `prefers-reduced-motion: reduce` — the 3D scene is never loaded. A CSS still
  frame stands in, smooth scrolling is off, and every section lays out
  statically with all copy visible.
- **No WebGL** — same still frame.
- **Low-end / touch devices** — reduced pixel ratio, coarser geometry, smaller
  textures, no smooth-scroll hijack, no hover inspection. Every beat is kept;
  only the camera moves are simplified.

## Swapping the brand

The name appears in `index.html` (title, nav mark, hero wordmark, footer) and
nowhere else. Palette and type live in the `:root` block of `css/style.css`.
The inventory is four `<li class="car">` rows — the layout holds three to six.
