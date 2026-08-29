/* ============================================================
   profile.js — the cars, drawn rather than photographed
   Every car is rendered as a side profile built from a handful
   of numbers: a silhouette per body type, painted in the car's
   own colour. No photography, so nothing to load and nothing
   that goes stale when a car sells.
   ============================================================ */

/* ---------- profile geometry ----------
   A body is a run of points along the top of the car, front to
   rear, closed along the ground. Catmull-Rom through those points
   keeps every silhouette in the same hand. */

function smooth(pts){
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for(let i = 0; i < pts.length - 1; i++){
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i], p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 7.5).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 7.5).toFixed(1)}` +
         ` ${(p2[0] - (p3[0] - p1[0]) / 7.5).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 7.5).toFixed(1)}` +
         ` ${p2[0]},${p2[1]}`;
  }
  return d;
}

const SILL   = 116;                  // where the body meets the road
const GROUND = 142;
const AXLE   = { rear: 104, front: 300, y: 116, tyre: 25, arch: 27.5 };

/* The return leg of every body: front bumper back to the rear, lifting
   over each wheel so the arches are cut out of the car rather than the
   wheels being pasted on top of it. */
function underside(){
  const { rear, front, y, arch } = AXLE;
  return ` L386,${SILL}` +
         ` L${front + arch},${y} A${arch},${arch} 0 0,0 ${front - arch},${y}` +
         ` L${rear + arch},${y} A${arch},${arch} 0 0,0 ${rear - arch},${y}` +
         ` L14,${SILL} Z`;
}

/* Every car points right: the run below reads rear bumper to nose. */
const BODIES = {
  coupe: {
    body: [[14,106],[22,86],[58,76],[108,66],[150,48],[206,38],[252,42],[298,64],[344,74],[378,86],[386,104]],
    glass:[[140,50],[198,40],[246,44],[286,64],[176,64]],
    crease:[[40,80],[200,70],[350,76]]
  },
  super: {
    body: [[14,104],[26,88],[70,80],[120,66],[160,54],[204,48],[248,56],[296,74],[344,84],[376,92],[386,106]],
    glass:[[152,58],[196,52],[238,60],[268,74],[168,74]],
    crease:[[52,86],[190,80],[340,88]]
  },
  saloon: {
    body: [[14,102],[24,82],[56,72],[100,58],[142,42],[196,34],[262,34],[300,44],[336,64],[372,76],[386,98]],
    glass:[[136,44],[192,36],[258,36],[292,48],[286,58],[150,58]],
    crease:[[36,78],[200,66],[356,76]]
  },
  suv: {
    body: [[14,92],[22,62],[52,52],[96,42],[132,28],[188,20],[268,20],[308,30],[342,50],[372,62],[386,90]],
    glass:[[128,30],[184,22],[264,22],[300,34],[292,44],[140,44]],
    crease:[[32,64],[200,52],[358,64]]
  },
  box: {
    body: [[16,88],[20,48],[36,40],[74,34],[110,22],[126,16],[300,16],[330,24],[352,44],[370,52],[382,88]],
    glass:[[120,22],[296,22],[318,30],[312,40],[124,40]],
    crease:[[30,54],[200,48],[360,56]]
  },
  roadster: {
    body: [[14,106],[22,86],[60,76],[118,68],[168,60],[206,52],[232,56],[286,68],[340,78],[376,88],[386,106]],
    glass:[[196,56],[224,58],[240,68],[204,68]],
    crease:[[42,82],[200,74],[348,82]]
  }
};

/* a wheel cut down to what reads at this size: tyre, rim, hub */
function wheel(cx){
  const { y, tyre } = AXLE;
  return `<circle cx="${cx}" cy="${y}" r="${tyre}" fill="#17181B"/>` +
         `<circle cx="${cx}" cy="${y}" r="${tyre * 0.62}" fill="#2A2C31"/>` +
         `<circle cx="${cx}" cy="${y}" r="${tyre * 0.60}" fill="none" stroke="#C4C8CD" stroke-width="2.4"/>` +
         `<circle cx="${cx}" cy="${y}" r="${tyre * 0.17}" fill="#C4C8CD"/>`;
}

export function profile(type, paint, id){
  const b = BODIES[type] || BODIES.coupe;
  const shell = smooth(b.body) + underside();
  return `<svg class="motor__art" viewBox="0 0 400 152" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="sh${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".34"/>
      <stop offset=".42" stop-color="#fff" stop-opacity=".04"/>
      <stop offset="1" stop-color="#000" stop-opacity=".26"/>
    </linearGradient>
    <clipPath id="cl${id}"><path d="${shell}"/></clipPath>
  </defs>
  <ellipse cx="200" cy="${GROUND}" rx="180" ry="6" fill="#121316" opacity=".12"/>
  ${wheel(AXLE.rear)}${wheel(AXLE.front)}
  <path d="${shell}" fill="${paint}"/>
  <g clip-path="url(#cl${id})">
    <path d="${shell}" fill="url(#sh${id})"/>
    <path d="${smooth(b.crease)}" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="1.6"/>
  </g>
  <path d="${smooth(b.glass)} Z" fill="#1E222A" opacity=".84"/>
</svg>`;
}
