# VELOR MOTORS — single-asset kinetic concept

A scroll-driven landing page for a luxury car reseller, set in a white
cyclorama studio. The whole homepage is choreographed around **one hero 3D
asset: a wheel** — a low-profile tyre on a forged mesh-spoke rim. There is no
stock photography anywhere on the page. Motion, material and lighting carry
the content; the wheel never disappears and reappears, it only transforms.

## The sequence

| Beat | What the tyre does | Copy |
|---|---|---|
| Hero | Drops under gravity, bounces three times with decaying height, a puff of smoke and a squash on each contact, settles and turns slowly in place | VELOR / *Fewer cars. Absolute condition.* |
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
css/style.css       palette, type, grain, smoke veil, and the chrome over the stage
js/stage.js         the wheel: geometry, materials, studio, reflection, smoke, render loop
js/main.js          orchestration: hero drop, the scrubbed scroll timeline, reveals
vendor/             three.js, GSAP + ScrollTrigger, Lenis (vendored, no CDN at runtime)
```

**The wheel is generated in code**, not loaded as a model. The rim face is ten
Y-spokes — a trunk from the hub to a fork, two branches to the lip, and two
fine ribs crossing each window onto the neighbouring fork — over a polished lip
band and a dark drum. Tread pattern, sidewall lettering and the brushed grain
on the alloy are all procedural normal maps rather than geometry, so the scene
stays low-poly: about 26k triangles in 69 draw calls.

`js/stage.js` exposes a single `state` object — `flip`, `roll`, `explode`,
`squash`, `idleSpeed`, `opacity`, `reflection`, `smoke`, `target` — and
`js/main.js` does nothing but tween that object against scroll. To retime the
choreography, edit `buildMaster()`; to change what the object *is*, edit
`buildWheel()`.

### Details worth knowing

- **Reflection.** A mirrored clone of the wheel sits under the floor plane and
  copies every part's transform each frame, so the reflection follows the
  exploded view too. The floor's alpha mask keeps it to a hint.
- **Smoke.** Two sources. Sprites in the scene thicken with how fast you are
  scrolling — rising quickly, falling away slowly, so the trail lingers behind
  the movement — and a CSS wash (`.veil`) sweeps across as one section hands
  over to the next. The bounce impacts drive the same system.
- **The dish is one radius function**, applied to every rib's vertices. Tilting
  each rib about its own axis instead splits open every joint they share.
- **The lip is a ring, not a lathe.** Head on, that polished band is most of
  what you see of the rim; a `RingGeometry` guarantees its normals face the
  light, where a lathed profile's winding can quietly invert them.
- **Contact shadow.** A gradient plane whose scale and opacity read the wheel's
  height off the floor, so it tightens as the wheel lands.
- **The explode is counter-rotated** out of the wheel's own roll. Without that
  the diagram turns with the wheel and reads as a pile.
- **Scroll mapping.** Beats are placed against each section's *on-screen
  window* — from the moment its top clears the viewport bottom until its
  sticky block releases — not its `offsetTop`, which is a viewport out.
- **Pointer parallax** tilts the wheel a few degrees, everywhere, all the way
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
nowhere else. Palette and type live in the `:root` block of `css/style.css`; the studio's
own white is `PAPER` at the top of `js/stage.js` and must match `--paper`.
The inventory is four `<li class="car">` rows — the layout holds three to six.
