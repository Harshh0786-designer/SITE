/* ============================================================
   CARS — the floor, drawn rather than photographed
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

function profile(type, paint, id){
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

/* ---------- the floor ---------- */

const FLOOR = [
  ['Rolls-Royce','Goodwood, England','Phantom VIII','saloon','#E7E5DF','Arctic White','2022 · 12,400 km · 6.75 V12','₹9,50,00,000'],
  ['Rolls-Royce','Goodwood, England','Ghost Black Badge','saloon','#15161A','Black Badge','2023 · 8,100 km · 6.75 V12','₹8,20,00,000'],
  ['Rolls-Royce','Goodwood, England','Cullinan','suv','#1B3A63','Salamanca Blue','2022 · 16,700 km · 6.75 V12','₹6,95,00,000'],

  ['Ferrari','Maranello, Italy','812 Superfast','coupe','#C8102E','Rosso Corsa','2021 · 7,850 km · 6.5 V12','₹5,20,00,000'],
  ['Ferrari','Maranello, Italy','Roma','coupe','#6E7176','Grigio Titanio','2022 · 9,300 km · 3.9 V8','₹3,76,00,000'],
  ['Ferrari','Maranello, Italy','SF90 Stradale','super','#F2C200','Giallo Modena','2023 · 3,200 km · 4.0 V8 Hybrid','₹7,50,00,000'],

  ['Lamborghini',"Sant'Agata, Italy",'Huracán Tecnica','super','#7FB800','Verde Mantis','2023 · 3,750 km · 5.2 V10','₹4,04,00,000'],
  ['Lamborghini',"Sant'Agata, Italy",'Urus S','suv','#1C1D21','Nero Noctis','2023 · 11,200 km · 4.0 V8','₹4,18,00,000'],
  ['Lamborghini',"Sant'Agata, Italy",'Revuelto','super','#E8590C','Arancio Apodis','2024 · 1,450 km · 6.5 V12 Hybrid','₹8,89,00,000'],

  ['Porsche','Stuttgart, Germany','911 Turbo S','coupe','#B9BDC1','GT Silver','2022 · 11,600 km · 3.7 Flat-6','₹3,45,00,000'],
  ['Porsche','Stuttgart, Germany','Taycan Turbo S','saloon','#5B7FA6','Frozen Blue','2023 · 14,900 km · Electric','₹2,54,00,000'],
  ['Porsche','Stuttgart, Germany','718 Cayman GT4','coupe','#F4C400','Racing Yellow','2021 · 9,800 km · 4.0 Flat-6','₹1,73,00,000'],

  ['Bentley','Crewe, England','Continental GT Speed','coupe','#EDEDEA','Glacier White','2023 · 9,200 km · 6.0 W12','₹3,95,00,000'],
  ['Bentley','Crewe, England','Flying Spur','saloon','#1A1B1F','Onyx','2022 · 18,400 km · 4.0 V8','₹3,42,00,000'],
  ['Bentley','Crewe, England','Bentayga EWB','suv','#2C4F7C','Sequin Blue','2023 · 13,050 km · 4.0 V8','₹4,10,00,000'],

  ['Aston Martin','Gaydon, England','DB12 Coupé','coupe','#17493C','Iridescent Emerald','2024 · 4,600 km · 4.0 V8','₹4,59,00,000'],
  ['Aston Martin','Gaydon, England','Vantage','coupe','#0B3B2E','Aston Racing Green','2023 · 7,400 km · 4.0 V8','₹3,99,00,000'],
  ['Aston Martin','Gaydon, England','DBX707','suv','#55585C','Satin Xenon Grey','2023 · 12,800 km · 4.0 V8','₹4,64,00,000'],

  ['McLaren','Woking, England','750S Coupé','super','#F26522','Papaya Spark','2024 · 2,100 km · 4.0 V8','₹5,91,00,000'],
  ['McLaren','Woking, England','Artura','super','#9AA0A6','Ceramic Grey','2023 · 5,600 km · 3.0 V6 Hybrid','₹5,10,00,000'],
  ['McLaren','Woking, England','GT','coupe','#E6E6E3','Silica White','2022 · 10,300 km · 4.0 V8','₹3,72,00,000'],

  ['Mercedes-AMG','Affalterbach, Germany','G 63','box','#15161A','Obsidian Black','2023 · 14,100 km · 4.0 V8','₹3,60,00,000'],
  ['Mercedes-AMG','Affalterbach, Germany','GT 63 S','coupe','#5A5E63','Selenite Grey','2022 · 16,200 km · 4.0 V8','₹3,29,00,000'],
  ['Mercedes-AMG','Affalterbach, Germany','SL 55','roadster','#A2172A','Patagonia Red','2023 · 8,700 km · 4.0 V8','₹2,45,00,000']
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export function initCars(){
  const grid = document.getElementById('motors');
  const rail = document.getElementById('brands');
  const tally = document.getElementById('carsTally');
  if(!grid || !rail) return;

  /* ---- cards ---- */
  grid.innerHTML = FLOOR.map(([marque, origin, name, type, paint, colour, spec, price], i) => `
    <li class="motor" data-brand="${slug(marque)}">
      <span class="motor__frame">${profile(type, paint, i)}</span>
      <p class="motor__marque">${marque}<span class="motor__origin">${origin}</span></p>
      <h3 class="motor__name">${name}</h3>
      <p class="motor__spec">${spec}</p>
      <p class="motor__colour"><span class="motor__chip" style="--chip:${paint}"></span>${colour}</p>
      <p class="motor__price">${price}</p>
    </li>`).join('');

  /* ---- brand rail: every marque on the floor, in stock order ---- */
  const brands = [];
  FLOOR.forEach(([marque]) => {
    const found = brands.find(b => b.name === marque);
    if(found) found.n++; else brands.push({ name: marque, id: slug(marque), n: 1 });
  });

  rail.innerHTML = [{ name: 'All marques', id: 'all', n: FLOOR.length }, ...brands]
    .map(b => `
      <li>
        <button class="brand" role="radio" aria-checked="${b.id === 'all'}" data-brand="${b.id}">
          <span class="brand__mark" aria-hidden="true"></span>
          <span class="brand__name">${b.name}</span>
          <span class="brand__n">${b.n}</span>
        </button>
      </li>`).join('');

  const cards   = [...grid.children];
  const buttons = [...rail.querySelectorAll('.brand')];

  function show(id){
    let shown = 0;
    cards.forEach(c => {
      const on = id === 'all' || c.dataset.brand === id;
      c.hidden = !on;
      if(on) shown++;
    });
    buttons.forEach(b => b.setAttribute('aria-checked', String(b.dataset.brand === id)));
    if(tally) tally.textContent = shown === FLOOR.length
      ? `${shown} cars` : `${shown} of ${FLOOR.length} cars`;

    /* the page just changed height — anything measuring it has to re-measure */
    if(window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  rail.addEventListener('click', (ev) => {
    const b = ev.target.closest('.brand');
    if(b) show(b.dataset.brand);
  });

  show('all');
}
