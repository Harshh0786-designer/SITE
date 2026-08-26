/* ============================================================
   stage.js — the single hero asset.

   One low-profile wheel on a forged mesh-spoke rim, built
   procedurally so it can roll, come apart into its components
   and lie down again. Lit as a white cyclorama studio, with a
   contact shadow, a soft floor reflection, and a smoke field
   that thickens with scroll.

   Everything the scroll timeline needs is exposed on `state`.
   ============================================================ */

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const R = 1;        // tyre outer radius — the unit of the scene
const BEAD = 0.795;        // rim seat: a 21" rim inside a 35-profile tyre
const W    = 0.345;        // carcass half width
const TIP  = 0.700;        // where the ribs land on the polished lip
const PAPER = 0xf4f3ef;

/* ============================================================
   procedural maps
   ============================================================ */

function canvas2d(w, h){
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

/* height field -> tangent-space normal map. Every bit of surface
   relief on this wheel is baked here rather than in geometry. */
function normalFromHeight(src, strength){
  const w = src.width, h = src.height;
  const px = src.getContext('2d').getImageData(0, 0, w, h).data;
  const at = (x, y) => px[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
  const [c, ctx] = canvas2d(w, h);
  const out = ctx.createImageData(w, h);
  for(let y = 0; y < h; y++){
    for(let x = 0; x < w; x++){
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * w + x) * 4;
      out.data[i]     = ((-dx / len) * 0.5 + 0.5) * 255;
      out.data[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
      out.data[i + 2] = ((1 / len)   * 0.5 + 0.5) * 255;
      out.data[i + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);
  return c;
}

function tex(c, repX = 1, repY = 1, srgb = false){
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repX, repY);
  t.anisotropy = 8;
  if(srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* --- brushed aluminium: fine directional grain --- */
function brushedHeight(){
  const [c, ctx] = canvas2d(256, 256);
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);
  for(let i = 0; i < 5200; i++){
    const v = 116 + Math.random() * 24;
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 22, 1);
  }
  return c;
}

/* --- tread: circumferential grooves, angled shoulder slots, sipes --- */
function treadHeight(){
  const W_ = 512, H_ = 128;
  const [c, ctx] = canvas2d(W_, H_);
  ctx.fillStyle = '#909090';
  ctx.fillRect(0, 0, W_, H_);

  // fine rubber tooth over the whole crown
  for(let i = 0; i < 9000; i++){
    const v = 130 + Math.random() * 46;
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(Math.random() * W_, Math.random() * H_, 2, 2);
  }

  // three circumferential grooves — the ribs they define run the tyre
  ctx.fillStyle = '#0d0d0d';
  [[0.20, 0.055], [0.50, 0.045], [0.80, 0.055]].forEach(([v, t]) => {
    ctx.fillRect(0, (v - t / 2) * H_, W_, t * H_);
  });

  // lateral slots: angled through the shoulders, shorter sipes inboard
  const slot = (x, y0, y1, wpx, lean, shade) => {
    ctx.save();
    ctx.translate(x, (y0 + y1) / 2 * H_);
    ctx.rotate(lean);
    ctx.fillStyle = shade;
    ctx.fillRect(-wpx / 2, -(y1 - y0) * H_ / 2, wpx, (y1 - y0) * H_);
    ctx.restore();
  };
  const blocks = 30;
  for(let i = 0; i < blocks; i++){
    const x = (i / blocks) * W_;
    slot(x,          0.00, 0.19, 15, 0.30, '#101010');
    slot(x + W_ / blocks / 2, 0.81, 1.00, 15, -0.30, '#101010');
    slot(x + W_ / blocks / 4, 0.235, 0.465, 8, 0.16, '#2a2a2a');
    slot(x - W_ / blocks / 4, 0.535, 0.765, 8, -0.16, '#2a2a2a');
  }
  return c;
}

function treadColor(){
  const [c, ctx] = canvas2d(512, 128);
  ctx.fillStyle = '#1a1a1c';
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = '#0b0b0c';
  [[0.20, 0.06], [0.50, 0.05], [0.80, 0.06]].forEach(([v, t]) => {
    ctx.fillRect(0, (v - t / 2) * 128, 512, t * 128);
  });
  return c;
}

/* --- sidewall: the moulded lettering and rib bands of a real tyre --- */
function sidewallHeight(){
  const W_ = 1024, H_ = 256;
  const [c, ctx] = canvas2d(W_, H_);
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, W_, H_);

  for(let i = 0; i < 10000; i++){
    const v = 118 + Math.random() * 30;
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(Math.random() * W_, Math.random() * H_, 2, 2);
  }

  // v runs bead (0) to shoulder (1); the lettering band sits mid-sidewall
  ctx.fillStyle = '#6a6a6a';
  ctx.fillRect(0, 0.05 * H_, W_, 0.05 * H_);
  ctx.fillRect(0, 0.90 * H_, W_, 0.04 * H_);

  // fine radial ribs around the bead — catches a highlight when it turns
  ctx.fillStyle = '#9a9a9a';
  for(let i = 0; i < 130; i++){
    ctx.fillRect((i / 130) * W_, 0.12 * H_, 4, 0.12 * H_);
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const stamp = (text, v, px, weight, shade) => {
    ctx.fillStyle = shade;
    ctx.font = `${weight} ${px}px "Helvetica Neue", Arial, sans-serif`;
    ctx.fillText(text, 0, 0);
  };
  const REP = 2;
  for(let r = 0; r < REP; r++){
    const x0 = (r / REP) * W_;
    ctx.save(); ctx.translate(x0 + W_ / REP * 0.25, 0.44 * H_);
    stamp('VELOR', 0, 48, '700', '#d8d8d8'); ctx.restore();
    ctx.save(); ctx.translate(x0 + W_ / REP * 0.25, 0.62 * H_);
    stamp('SPORT CONTACT', 0, 20, '500', '#c4c4c4'); ctx.restore();
    ctx.save(); ctx.translate(x0 + W_ / REP * 0.72, 0.50 * H_);
    stamp('265/35 ZR21', 0, 23, '600', '#cfcfcf'); ctx.restore();
    ctx.save(); ctx.translate(x0 + W_ / REP * 0.72, 0.66 * H_);
    stamp('101Y  XL', 0, 17, '500', '#bcbcbc'); ctx.restore();
  }
  return c;
}

function radialAlpha(size, inner, falloff){
  const [c, ctx] = canvas2d(size, size);
  const g = ctx.createRadialGradient(size / 2, size / 2, size * inner, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(falloff, 'rgba(255,255,255,.34)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

/* floor mask: opaque paper at the edges, open beneath the tyre, so the
   reflection reads only where an object is standing on it */
function floorMask(size = 512){
  const [c, ctx] = canvas2d(size, size);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0,   'rgba(244,243,239,.30)');
  g.addColorStop(.26, 'rgba(244,243,239,.66)');
  g.addColorStop(.58, 'rgba(244,243,239,.94)');
  g.addColorStop(1,   'rgba(244,243,239,1)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return tex(c, 1, 1, true);
}

/* a white cyclorama with two soft overhead panels — this is what the
   machined rim actually reflects, so it does the work of the lighting */
function studioEnv(){
  const [c, ctx] = canvas2d(1024, 512);
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0,   '#ffffff');
  g.addColorStop(.34, '#f2f2f4');
  g.addColorStop(.52, '#dcdde1');
  g.addColorStop(.62, '#c2c4ca');
  g.addColorStop(1,   '#eceded');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 512);

  const panel = (x, y, w, h, a) => {
    const rg = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) / 2);
    rg.addColorStop(0, `rgba(255,255,255,${a})`);
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  panel(300, 96, 460, 190, 1);
  panel(760, 128, 380, 150, .9);
  panel(520, 300, 300, 90, .5);

  // a couple of dark strips: without something to catch, metal reads flat
  ctx.fillStyle = 'rgba(120,124,132,.55)';
  ctx.fillRect(0, 232, 1024, 16);
  ctx.fillStyle = 'rgba(150,154,162,.4)';
  ctx.fillRect(140, 190, 240, 10);

  const t = new THREE.CanvasTexture(c);
  t.mapping = THREE.EquirectangularReflectionMapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function smokeTexture(size = 256){
  const [c, ctx] = canvas2d(size, size);
  for(let i = 0; i < 26; i++){
    const x = size / 2 + (Math.random() - 0.5) * size * 0.52;
    const y = size / 2 + (Math.random() - 0.5) * size * 0.52;
    const r = size * (0.10 + Math.random() * 0.24);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,.20)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  // hold it to a soft round envelope so no sprite shows its own edges
  ctx.globalCompositeOperation = 'destination-in';
  const env = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  env.addColorStop(0,   'rgba(0,0,0,1)');
  env.addColorStop(.55, 'rgba(0,0,0,.75)');
  env.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = env;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

/* ============================================================
   geometry helpers
   ============================================================ */

function lathe(points, segments){
  const g = new THREE.LatheGeometry(points.map(p => new THREE.Vector2(p[0], p[1])), segments);
  g.rotateX(-Math.PI / 2);          // lathe axis Y -> wheel axis Z
  g.computeVertexNormals();
  return g;
}

/* a tapered strut between two polar points — the unit the mesh face
   is woven from */
function strut(a0, r0, w0, a1, r1, w1){
  const p0 = new THREE.Vector2(Math.cos(a0) * r0, Math.sin(a0) * r0);
  const p1 = new THREE.Vector2(Math.cos(a1) * r1, Math.sin(a1) * r1);
  const d  = p1.clone().sub(p0).normalize();
  const n  = new THREE.Vector2(-d.y, d.x);

  const A = p0.clone().addScaledVector(n,  w0);
  const B = p1.clone().addScaledVector(n,  w1);
  const C = p1.clone().addScaledVector(n, -w1);
  const D = p0.clone().addScaledVector(n, -w0);

  const s = new THREE.Shape();
  s.moveTo(A.x, A.y);
  s.lineTo(B.x, B.y);
  s.lineTo(C.x, C.y);
  s.lineTo(D.x, D.y);
  s.closePath();
  return s;
}

/* ============================================================
   the wheel
   ============================================================ */

function buildWheel(quality){
  const seg = quality === 'low' ? 72 : 128;
  const low = quality === 'low';

  const treadH = treadHeight();
  const sideH  = sidewallHeight();

  const rubberTread = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: .95, metalness: 0,
    clearcoat: .10, clearcoatRoughness: .85,
    map: tex(treadColor(), 2, 1, true),
    normalMap: tex(normalFromHeight(treadH, 3.4), 2, 1),
    normalScale: new THREE.Vector2(1.4, 1.4),
    side: THREE.DoubleSide
  });
  const rubberWall = new THREE.MeshPhysicalMaterial({
    color: 0x1a1b1f, roughness: .70, metalness: .02,
    clearcoat: .22, clearcoatRoughness: .42,
    normalMap: tex(normalFromHeight(sideH, 2.1), 1, 1),
    normalScale: new THREE.Vector2(1.55, 1.55),
    side: THREE.DoubleSide
  });
  /* forged aluminium, satin-finished — not chrome. Chrome on white
     goes to mush; a satin metal keeps its gradients. */
  const brushed = tex(normalFromHeight(brushedHeight(), 1.1), 3, 3);
  const alloy = new THREE.MeshPhysicalMaterial({
    color: 0xbcc0c7, roughness: .26, metalness: 1, side: THREE.DoubleSide,
    normalMap: brushed, normalScale: new THREE.Vector2(.24, .24),
    clearcoat: .55, clearcoatRoughness: .16,
    anisotropy: .45, anisotropyRotation: Math.PI / 2
  });
  const alloyPolished = new THREE.MeshPhysicalMaterial({
    color: 0xd4d7dc, roughness: .09, metalness: 1, side: THREE.DoubleSide,
    clearcoat: .8, clearcoatRoughness: .05
  });
  const alloyDark = new THREE.MeshPhysicalMaterial({
    color: 0x74777d, roughness: .36, metalness: 1, side: THREE.DoubleSide,
    clearcoat: .3, clearcoatRoughness: .28
  });
  const brake = new THREE.MeshStandardMaterial({
    color: 0x303236, roughness: .58, metalness: .72, side: THREE.DoubleSide
  });

  const root = new THREE.Group();
  const parts = {};
  const mk = (name) => { const g = new THREE.Group(); g.name = name; root.add(g); parts[name] = g; return g; };

  /* --- tread: a wide, shallow crown with square shoulders --- */
  const tread = mk('tread');
  tread.add(new THREE.Mesh(lathe([
    [0.958, -W*0.99], [0.988, -W*0.94], [0.9985, -W*0.86],
    [1.000, -W*0.55], [1.000,  W*0.55], [0.9985, W*0.86],
    [0.988,  W*0.94], [0.958,  W*0.99]
  ], seg), rubberTread));

  /* --- sidewalls: short and near-vertical, as a 35 profile is --- */
  const wall = (s) => lathe([
    [BEAD,  s*W*0.90], [0.834, s*W*0.985], [0.888, s*W*1.00],
    [0.928, s*W*0.998], [0.958, s*W*0.99]
  ], seg);
  mk('wallFront').add(new THREE.Mesh(wall(1),  rubberWall));
  mk('wallBack').add(new THREE.Mesh(wall(-1), rubberWall));

  /* --- rim --- */
  const rim = mk('rim');

  // barrel: the seat the tyre sits on, front lip to back lip
  rim.add(new THREE.Mesh(lathe([
    [BEAD,   W*0.84], [0.772, W*0.58], [0.742, W*0.10],
    [0.742, -W*0.42], [0.772, -W*0.70], [BEAD, -W*0.86]
  ], seg), alloyDark));

  /* The polished lip is a flat annulus facing the camera, not a lathed
     cylinder: head on, that band is most of what you see of the rim,
     and a ring guarantees its normals point at the light. */
  const zLip = 0.050;
  const lipFace = new THREE.Mesh(new THREE.RingGeometry(TIP - 0.014, 0.793, seg), alloyPolished);
  lipFace.position.z = zLip;
  rim.add(lipFace);

  // the flange edge standing proud of that band
  const flange = new THREE.Mesh(
    new THREE.CylinderGeometry(0.795, 0.793, W*0.84 - zLip, seg, 1, true), alloyPolished);
  flange.rotation.x = Math.PI / 2;
  flange.position.z = zLip + (W*0.84 - zLip) / 2;
  rim.add(flange);

  // dark drum: the mesh face has to read against something
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.700, 0.62, W*1.30, seg, 1, true), brake);
  drum.rotation.x = Math.PI / 2;
  drum.position.z = -W * 0.28;
  rim.add(drum);
  const drumBack = new THREE.Mesh(new THREE.CircleGeometry(0.64, seg), brake);
  drumBack.position.z = -W * 0.92;
  rim.add(drumBack);

  /* The face is ten Y-spokes: a trunk from the hub out to a fork, each
     fork splitting into two ribs at the lip, and a fine inverted-V
     closing the window between neighbouring Ys. Twenty ribs land on the
     lip; the whole figure repeats ten times. */
  const SPOKES = 10;
  const R_HUB = 0.200, R_FORK = 0.430;
  const SPLIT = (Math.PI * 2) / 38;      // half the gap between paired tips
  const zFace = W * 0.46;
  const DISH  = 0.235;                   // concave face: z falls with r squared

  const A = (t) => t * Math.PI * 2;

  /* One radius-driven displacement applied to every rib, so ribs that
     share a node still share it after dishing. Tilting each rib about
     its own axis splits those joints open. */
  function dished(geo){
    const p = geo.attributes.position;
    for(let i = 0; i < p.count; i++){
      const x = p.getX(i), y = p.getY(i);
      p.setZ(i, p.getZ(i) - DISH * (x * x + y * y));
    }
    p.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  /* the chamfer is sized off the rib, never fixed: a fixed bevel eats a
     thin rib entirely and leaves faceted chips instead of a spoke */
  const ribGeometries = [];
  const rib = (shape, depth, halfWidth, zOff = 0) => {
    const bevel = Math.min(0.010, halfWidth * 0.30);
    const geo = dished(new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel,
      bevelSegments: low ? 2 : 3, curveSegments: low ? 5 : 10
    }));
    geo.translate(0, 0, zFace + zOff);
    ribGeometries.push(geo);
  };

  for(let j = 0; j < SPOKES; j++){
    const a = A(j / SPOKES);

    // trunk: hub out to the fork
    rib(strut(a, R_HUB, 0.038, a, R_FORK, 0.031), 0.052, 0.031);

    // the two branches of the Y
    rib(strut(a, R_FORK, 0.027, a - SPLIT, TIP, 0.018), 0.048, 0.018);
    rib(strut(a, R_FORK, 0.027, a + SPLIT, TIP, 0.018), 0.048, 0.018);

    /* The weave: two fine ribs cross each window diagonally, each
       landing on the fork of the neighbouring Y. Running them to a free
       apex instead leaves spikes hanging in open space; landing them on
       solid nodes is what makes the face read as one woven piece. */
    const nextFork = A((j + 1) / SPOKES);
    const nextTip  = nextFork - SPLIT;
    rib(strut(a + SPLIT, TIP - 0.004, 0.012, nextFork, R_FORK, 0.013), 0.036, 0.012, -0.018);
    rib(strut(nextTip,   TIP - 0.004, 0.012, a,        R_FORK, 0.013), 0.036, 0.012, -0.018);
  }

  /* one draw call for the whole face, not fifty */
  const face = mergeGeometries(ribGeometries, false);
  ribGeometries.forEach(g => g.dispose());
  rim.add(new THREE.Mesh(face, alloy));

  /* --- hub: machined pad, five recessed lugs, one small cap --- */
  const hub = mk('hub');
  const zHub = zFace - DISH * R_HUB * R_HUB;

  const pad = new THREE.Mesh(new THREE.CircleGeometry(0.190, seg), alloy);
  pad.position.z = zHub + 0.052;
  hub.add(pad);
  const padWall = new THREE.Mesh(new THREE.CylinderGeometry(0.190, 0.202, 0.06, seg, 1, true), alloy);
  padWall.rotation.x = Math.PI / 2;
  padWall.position.z = zHub + 0.022;
  hub.add(padWall);

  const lugGeo  = new THREE.CylinderGeometry(0.021, 0.021, 0.030, low ? 10 : 16);
  const seatGeo = new THREE.CircleGeometry(0.032, low ? 10 : 20);
  for(let i = 0; i < 5; i++){
    const ang = (i / 5) * Math.PI * 2 + Math.PI / 5;
    const x = Math.cos(ang) * 0.122, y = Math.sin(ang) * 0.122;
    const seat = new THREE.Mesh(seatGeo, alloyDark);
    seat.position.set(x, y, zHub + 0.0525);
    hub.add(seat);
    const lug = new THREE.Mesh(lugGeo, alloyPolished);
    lug.rotation.x = Math.PI / 2;
    lug.position.set(x, y, zHub + 0.046);
    hub.add(lug);
  }
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.050, 0.028, low ? 16 : 32), alloyDark);
  cap.rotation.x = Math.PI / 2;
  cap.position.z = zHub + 0.066;
  hub.add(cap);
  const capFace = new THREE.Mesh(new THREE.CircleGeometry(0.056, low ? 16 : 32), alloyPolished);
  capFace.position.z = zHub + 0.0815;
  hub.add(capFace);

  /* Where each part travels when the wheel opens up: a single vertical
     column, authored in the picture plane. Head on, an axial spread just
     overlaps; a radial one throws parts below the floor line. The small
     hub sits at the centre, where the headline crosses it. */
  const spread = {
    tread:     { p: [ 0.00,  1.85,  0.10], r: [ 0.34, -0.10,  0.10] },
    wallFront: { p: [ 0.00,  0.92,  0.50], r: [-0.30,  0.14,  0.06] },
    wallBack:  { p: [ 0.00,  0.00, -0.30], r: [ 0.28, -0.16, -0.06] },
    rim:       { p: [ 0.00, -0.92,  0.30], r: [-0.26,  0.12, -0.10] },
    hub:       { p: [ 0.00, -1.85,  0.95], r: [ 0.40,  0.00,  0.16] }
  };

  /* each part owns its material instances: hovering one part has to be
     able to dim the others */
  const partMaterials = {};
  for(const name in parts){
    const seen = new Map();
    partMaterials[name] = [];
    parts[name].traverse(o => {
      if(!o.isMesh && !o.isInstancedMesh) return;
      let mt = seen.get(o.material);
      if(!mt){
        mt = o.material.clone();
        mt.transparent = true;
        seen.set(o.material, mt);
        partMaterials[name].push(mt);
      }
      o.material = mt;
    });
  }

  const materials = [rubberTread, rubberWall, alloy, alloyPolished, alloyDark, brake];
  return { root, parts, spread, materials, partMaterials };
}

/* ============================================================ */

export function createStage(canvas, opts = {}){
  const quality = opts.quality || 'high';
  const low = quality === 'low';

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: !low, alpha: false, powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, low ? 1.5 : 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(PAPER, 1);
  /* A cast shadow is what tells the eye an object is a solid sitting in
     a room rather than a picture of one. The blob below is kept, but
     only as contact darkening. */
  renderer.shadowMap.enabled = !low;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(PAPER, 9, 24);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 2.42, 7.0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envSrc = studioEnv();
  scene.environment = pmrem.fromEquirectangular(envSrc).texture;
  envSrc.dispose();
  pmrem.dispose();

  /* the env carries most of the light; these shape the form and set
     the direction the contact shadow falls */
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-3.0, 5.6, 4.0);
  key.castShadow = !low;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 16;
  key.shadow.camera.left = -2.6;
  key.shadow.camera.right = 2.6;
  key.shadow.camera.top = 3.4;
  key.shadow.camera.bottom = -3.4;
  key.shadow.bias = -0.0009;
  key.shadow.normalBias = 0.022;
  key.shadow.radius = 3;
  scene.add(key);
  scene.add(key.target);
  const rimLight = new THREE.DirectionalLight(0xdfe6f2, 1.1);
  rimLight.position.set(4.6, 2.0, -4.4);
  scene.add(rimLight);
  const fill = new THREE.DirectionalLight(0xffffff, 0.6);
  fill.position.set(2.4, -0.6, 3.4);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  /* ---------- floor ---------- */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 70),
    new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: .40, metalness: .06,
      map: floorMask(), transparent: true, depthWrite: false
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.renderOrder = 2;
  floor.receiveShadow = true;
  scene.add(floor);

  /* ---------- wheel + reflection ---------- */
  const tilt = new THREE.Group();          // pointer parallax only
  scene.add(tilt);

  const { root, parts, spread, materials, partMaterials } = buildWheel(quality);
  root.position.set(0, R, 0);
  root.traverse(o => { if(o.isMesh) o.castShadow = true; });
  tilt.add(root);

  const mirror = new THREE.Group();
  mirror.scale.set(1, -1, 1);
  tilt.add(mirror);

  const ghost = root.clone(true);
  const ghostMaterials = [];
  ghost.traverse(o => {
    if(!o.isMesh && !o.isInstancedMesh) return;
    o.material = o.material.clone();
    o.material.transparent = true;
    o.material.opacity = 0.09;
    o.material.depthWrite = false;
    o.material.side = THREE.DoubleSide;
    o.renderOrder = 1;
    o.castShadow = false;
    o.receiveShadow = false;
    ghostMaterials.push(o.material);
  });
  mirror.add(ghost);

  const srcNodes = [], dstNodes = [];
  (function pair(a, b){
    srcNodes.push(a); dstNodes.push(b);
    for(let i = 0; i < a.children.length; i++) pair(a.children[i], b.children[i]);
  })(root, ghost);

  /* ---------- contact shadow ---------- */
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 2.5),
    new THREE.MeshBasicMaterial({
      color: 0x4c5057, transparent: true, opacity: .22,
      alphaMap: radialAlpha(256, 0.005, .16), depthWrite: false
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.004;
  shadow.renderOrder = 3;
  scene.add(shadow);

  /* ---------- smoke ---------- */
  const smokeTex = smokeTexture(low ? 128 : 256);

  /* Impact smoke is a separate, short-lived set. Reusing the ambient
     sprites meant every bounce teleported drifting smoke across the
     frame, which is most of what read as jitter in the drop. */
  const IMPACTS = low ? 5 : 8;
  const impacts = [];
  for(let i = 0; i < IMPACTS; i++){
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: smokeTex, transparent: true, opacity: 0,
      color: 0x878e99, depthWrite: false, fog: false
    }));
    sp.renderOrder = 6;
    scene.add(sp);
    impacts.push({ sprite: sp, life: 0, vx: 0, vy: 0, size: 1, spin: 0 });
  }
  const puffs = [];
  const SMOKE = low ? 8 : 14;
  for(let i = 0; i < SMOKE; i++){
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: smokeTex, transparent: true, opacity: 0,
      color: 0x878e99, depthWrite: false, fog: false
    }));
    const p = {
      sprite: s,
      x: (Math.random() * 2 - 1) * 7,
      y: 0.25 + Math.random() * 2.6,
      z: -2.6 + Math.random() * 5.2,
      size: 2.8 + Math.random() * 3.6,
      speed: 0.16 + Math.random() * 0.5,
      spin: (Math.random() - 0.5) * 0.16,
      weight: 0.35 + Math.random() * 0.65,
      phase: Math.random() * Math.PI * 2
    };
    s.scale.setScalar(p.size);
    s.renderOrder = 5;
    puffs.push(p);
    scene.add(s);
  }

  /* ---------- state the timeline drives ---------- */
  const state = {
    flip: 0,          // x rotation — upright (0) to flat (-PI/2)
    yaw: 0,
    roll: 0,          // authored rotation about the axle
    rollCouple: 1,    // 1 = rotation follows travel, as a rolling wheel must
    idleSpeed: 0.06,  // rad/s of slow rotation at rest
    explode: 0,       // 0..1
    squash: 0,        // 0..1, impact deformation
    opacity: 1,
    shadowScale: 1,
    reflection: 0.09,
    smoke: 0.12,      // resting haze
    target: new THREE.Vector3(0, R * 1.62, 0),
    pointer: new THREE.Vector2(),
    hovered: null
  };

  let idle = 0, pulse = 0, scrollEnergy = 0, drift = 0;
  const tiltTarget = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const partList = Object.values(parts);
  const basePos = new THREE.Vector3();
  const scaleTarget = new THREE.Vector3();

  function puff(strength = 1){
    // a wheel hitting a studio floor pushes a low, fast ring outward
    pulse = Math.max(pulse, strength * 0.9);
    for(let i = 0; i < impacts.length; i++){
      const im = impacts[i];
      const side = i % 2 ? 1 : -1;
      const spreadOut = 0.25 + Math.random() * 0.55;
      im.life = 1;
      im.vx = side * (0.9 + Math.random() * 1.5) * strength;
      im.vy = 0.16 + Math.random() * 0.34;
      im.size = (0.8 + Math.random() * 0.9) * (0.7 + strength * 0.6);
      im.spin = (Math.random() - 0.5) * 0.9;
      im.sprite.position.set(
        root.position.x + side * spreadOut,
        0.10 + Math.random() * 0.16,
        root.position.z + (Math.random() - 0.5) * 0.7
      );
      im.sprite.scale.setScalar(im.size);
      im.sprite.material.opacity = 0;
    }
  }

  function smokePulse(strength = 1){ pulse = Math.max(pulse, strength); }
  function setScrollEnergy(v){ scrollEnergy = v; }

  function hitTest(){
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(partList, true);
    if(!hits.length) return null;
    let o = hits[0].object;
    while(o && !parts[o.name]) o = o.parent;
    return o ? o.name : null;
  }

  let hoverEnabled = false;
  let pointerLive = false;
  const clock = new THREE.Clock();

  function frame(){
    const dt = Math.min(clock.getDelta(), 0.05);
    idle += dt * state.idleSpeed;
    pulse *= Math.pow(0.14, dt);
    drift += dt * (0.25 + scrollEnergy * 2.6);

    /* pointer parallax — a few degrees, everywhere, always the same */
    tiltTarget.set(-state.pointer.y * 0.075, state.pointer.x * 0.11);
    tilt.rotation.x += (tiltTarget.x - tilt.rotation.x) * Math.min(1, dt * 3.4);
    tilt.rotation.y += (tiltTarget.y - tilt.rotation.y) * Math.min(1, dt * 3.4);

    /* rotation: authored spin + travel-coupled roll */
    const travel = state.rollCouple * (-root.position.x / R);
    const roll = state.roll + idle + travel;
    root.rotation.set(state.flip, state.yaw, roll, 'XYZ');

    /* impact squash, along the axis the wheel is standing on */
    const sq = state.squash;
    root.scale.set(1 + sq * 0.075, 1 - sq * 0.10, 1 + sq * 0.05);

    /* exploded view. The spread is authored in the picture plane, so it
       is counter-rotated out of the wheel's own roll — otherwise the
       whole diagram turns with it and reads as a pile. */
    const e = state.explode;
    const cr = Math.cos(-roll), sr = Math.sin(-roll);
    for(const name in parts){
      const g = parts[name], sp = spread[name];
      g.position.set(
        (sp.p[0] * cr - sp.p[1] * sr) * e,
        (sp.p[0] * sr + sp.p[1] * cr) * e,
        sp.p[2] * e
      );
      g.rotation.set(sp.r[0] * e, sp.r[1] * e, sp.r[2] * e);
      const hot = state.hovered === name;
      const want = hot ? 1.07 : 1;
      scaleTarget.setScalar(want);
      g.scale.lerp(scaleTarget, Math.min(1, dt * 6));
      const dim = (state.hovered && !hot) ? 0.34 : 1;
      const mats = partMaterials[name];
      for(let i = 0; i < mats.length; i++) mats[i].opacity = state.opacity * dim;
    }

    /* contact shadow reads the height off the floor */
    root.getWorldPosition(basePos);
    const h = Math.max(0, basePos.y - R);
    const tightness = 1 / (1 + h * 0.9);
    shadow.position.x = root.position.x;
    shadow.position.z = root.position.z;
    shadow.scale.setScalar((0.74 + h * 0.26) * state.shadowScale * (1 + e * 0.35));
    shadow.material.opacity = 0.26 * tightness * state.opacity * (1 - e * 0.8);

    /* smoke: a resting haze that thickens with scroll and on impact */
    const density = Math.min(1, state.smoke + scrollEnergy * 0.8 + pulse * 0.6);
    for(let i = 0; i < puffs.length; i++){
      const p = puffs[i];
      p.x += dt * p.speed * (0.35 + scrollEnergy * 5.5);
      p.y += dt * p.speed * 0.12;
      if(p.x > 8.5){ p.x = -8.5; p.y = 0.25 + Math.random() * 2.4; }
      const bob = Math.sin(drift * 0.5 + p.phase) * 0.16;
      p.sprite.position.set(p.x, p.y + bob, p.z);
      p.sprite.material.rotation += dt * p.spin;
      p.sprite.material.opacity = density * p.weight * 0.52 * state.opacity;
      p.sprite.scale.setScalar(p.size * (1 + pulse * 0.12));
    }

    /* impact smoke: pushes out low and fast, then lifts and thins */
    for(let i = 0; i < impacts.length; i++){
      const im = impacts[i];
      if(im.life <= 0) continue;
      im.life = Math.max(0, im.life - dt * 0.85);
      im.vx *= Math.pow(0.22, dt);
      im.sprite.position.x += im.vx * dt;
      im.sprite.position.y += im.vy * dt;
      im.sprite.material.rotation += im.spin * dt;
      im.sprite.scale.setScalar(im.size * (1 + (1 - im.life) * 2.6));
      // fade in over the first sliver of life, then out
      const l = im.life;
      im.sprite.material.opacity = Math.min(1, (1 - l) * 6) * l * l * 0.42 * state.opacity;
    }

    /* reflection follows every part, mirrored through the floor */
    for(let i = 0; i < srcNodes.length; i++){
      dstNodes[i].position.copy(srcNodes[i].position);
      dstNodes[i].quaternion.copy(srcNodes[i].quaternion);
      dstNodes[i].scale.copy(srcNodes[i].scale);
    }
    for(let i = 0; i < ghostMaterials.length; i++){
      ghostMaterials[i].opacity = state.reflection * state.opacity;
    }

    if(hoverEnabled && pointerLive && state.explode > 0.2){
      const hit = hitTest();
      if(hit !== state.hovered){
        state.hovered = hit;
        opts.onHover && opts.onHover(hit);
      }
    }else if(state.hovered){
      state.hovered = null;
      opts.onHover && opts.onHover(null);
    }

    /* the light travels with the wheel so one tight shadow map covers
       the whole journey instead of one huge, soft, low-resolution one */
    key.position.set(root.position.x - 3.0, 5.6, root.position.z + 4.0);
    key.target.position.set(root.position.x, root.position.y * 0.5, root.position.z);
    key.target.updateMatrixWorld();

    camera.lookAt(state.target);
    renderer.render(scene, camera);
  }

  let raf = 0;
  const loop = () => { raf = requestAnimationFrame(loop); frame(); };

  const BASE_FOV = 38;
  function resize(){
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    const aspect = w / h;
    camera.aspect = aspect;
    /* hold the horizontal field on portrait screens, so the wheel keeps
       its proportion instead of filling a phone edge to edge */
    camera.fov = aspect < 1
      ? Math.min(64, THREE.MathUtils.radToDeg(
          2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(BASE_FOV) / 2) / aspect)))
      : BASE_FOV;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function setPointer(x, y){
    pointerLive = true;
    state.pointer.set(x, y);
    ndc.set(x, y);
  }

  resize();
  window.addEventListener('resize', resize);

  /* Compile every program and upload every texture up front. Without
     this the first seconds of the drop are spent on shader compilation
     and the motion stutters exactly when it is most exposed. */
  function warmUp(){
    const keep = { explode: state.explode, opacity: state.opacity };
    state.explode = 1;              // touch the exploded materials too
    renderer.compile(scene, camera);
    renderer.render(scene, camera);
    state.explode = keep.explode;
    state.opacity = keep.opacity;
    renderer.render(scene, camera);
  }

  return {
    scene, camera, renderer, root, parts, state,
    start(){ if(!raf){ clock.getDelta(); loop(); } },
    stop(){ cancelAnimationFrame(raf); raf = 0; },
    renderOnce(){ frame(); },
    setPointer,
    warmUp,
    puff,
    smokePulse,
    setScrollEnergy,
    enableHover(v){ hoverEnabled = v; },
    resize,
    dispose(){
      this.stop();
      window.removeEventListener('resize', resize);
      materials.forEach(mt => mt.dispose());
      renderer.dispose();
    }
  };
}
