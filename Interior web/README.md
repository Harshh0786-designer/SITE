# Interior web — Meridian House

A scroll-driven site for a fictional interior studio (**Altus**) and the villa it
delivered (**Meridian House**). The whole opening is one continuous camera move:
you fall out of a cloud bank, land on the house, push through the glass, walk the
entry hall, cross the great room, and leave through the retractable wall onto the
rear terrace. Then the page settles into black and the studio's content begins.

## Run it

No build step, no dependencies. Serve the folder over HTTP:

```bash
cd "Interior web"
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` straight off the filesystem works too, but a server is
closer to how it will be deployed.

## Files

| File | What's in it |
| --- | --- |
| `index.html` | Markup for the flight stage and the six content sections |
| `style.css` | Tokens, the cinematic stage, section layouts, responsive + reduced-motion rules |
| `script.js` | The camera, the cloud canvas, the house tour, reveals, the form |
| `assets/*.jpg` | The three villa plates (aerial, entry hall, great room) |

## How the flight works

The page does **not** hijack scrolling. `#journey` is a tall block (820vh) with a
`position: sticky` stage inside it. On every scroll the script reads one number —
progress `p` from 0 to 1 through that block — and derives the whole shot from it:

```
0.00 – 0.17   descent    canvas cloud field, camera falling, altitude counting down
0.17 – 0.30   arrival    clouds clear, the aerial plate resolves, title lockup
0.34 – 0.47   approach   push in on the pool terrace, focus falls away
0.44 – 0.64   entry hall dolly down the glazed corridor toward the meadow
0.62 – 0.90   great room the room settles, then the camera leaves through the glass
0.83 – 0.96   flare      the 24 ft opening blows out to white
0.89 – 1.00   terrace    the house from behind, pulling away, fading to the page
```

Each plate is placed by `place(el, scale, focalX, focalY, opacity, blur, brightness)`.
The focal point is given in **image space** and converted to the element's box,
accounting for `object-fit: cover` cropping, then clamped so a zoom can never expose
an edge of the plate. That is why the camera keeps its subject centred at any
viewport ratio.

The clouds are a small perspective model on a 2D canvas: every puff holds a depth
below the camera, scroll advances the camera, depth shrinks, and the puff rushes
outward from the centre of frame and passes you. Sprites are pre-rendered once.

### A note on the "3D walkthrough"

This is a photographic camera move, not a real-time 3D model. The source material
is three still images, so the sequence sells depth through scale, focal drift,
defocus and light rather than geometry — you cannot orbit the house or open a door
that was never photographed. A true walkthrough would need the villa rebuilt as a
model (or captured by photogrammetry) and rendered with three.js or a streamed
engine. The house tour section is the interactive half of that: pan around each
room and open the specification behind anything marked.

## Content sections

Black ground, limestone text, seven numbered sections: the house, the interactive
house tour, services, process, material palette, amenities, and an enquiry form.

Amenities is a four-column icon grid (inline line-drawn SVG, no icon font) over a
ruled `House systems` strip — the two densities a property page needs: the things
you use, then the things that run underneath. The form is
**local only** — it validates and confirms in the browser and posts nothing. Wire
`#form`'s submit handler in `script.js` to a real endpoint before using it.

## Design

- **Type** — Bodoni Moda (display), Jost (body), IBM Plex Mono (instruments and specs).
- **Colour** — ink `#07080A`, limestone `#F2EDE4`, cedar `#C9702F` and ember `#E89A4E`
  taken off the rain screen at low sun, blackened steel `#2A3038` off the window frames.
  Every colour is a token in `:root`; nothing is hard-coded in a component.
- **Motion** — `prefers-reduced-motion: reduce` collapses the flight to a single
  still frame, drops the cloud canvas and reveals, and leaves the content untouched.

## Browser support

Modern evergreen browsers. Uses `position: sticky`, Pointer Events,
`IntersectionObserver`, `color-mix()` and `backdrop-filter`; degrades to a flat but
complete page where `backdrop-filter` is missing.
