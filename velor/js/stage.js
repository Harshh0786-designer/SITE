/* ============================================================
   stage.js — the single hero asset.
   One tyre, built procedurally (low poly + procedural normal
   detail), lit like a studio floor, with a contact shadow and
   a soft mirrored reflection under it at all times.
   Everything the scroll timeline needs is exposed on `state`.
   ============================================================ */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const R = 1;                       // tyre outer radius, the unit of the scene
const W = 0.30;                           // carcass half width
const BEAD = 0.72;                        // rim seat radius — a low profile, as these cars wear

/* ---------- procedural maps ---------- */

function noiseCanvas(size, scale){
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  for(let i = 0; i < size * size; i++){
    const v = 128 + (Math.random() - 0.5) * 255 * scale;
    img.data[i*4] = img.data[i*4+1] = img.data[i*4+2] = v;
    img.data[i*4+3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/* height field -> tangent-space normal map; gives rubber its bite
   without any extra geometry */
function rubberNormalMap(size = 256){
  const src = noiseCanvas(size, 1).getContext('2d').getImageData(0, 0, size, size).data;
  const h = (x, y) => src[((y & (size-1)) * size + (x & (size-1))) * 4] / 255;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const out = ctx.createImageData(size, size);
  const strength = 2.4;
  for(let y = 0; y < size; y++){
    for(let x = 0; x < size; x++){
      const dx = (h(x+1, y) - h(x-1, y)) * strength;
      const dy = (h(x, y+1) - h(x, y-1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      out.data[i]   = ((-dx/len) * 0.5 + 0.5) * 255;
      out.data[i+1] = ((-dy/len) * 0.5 + 0.5) * 255;
      out.data[i+2] = ((1/len)   * 0.5 + 0.5) * 255;
      out.data[i+3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 3);
  return tex;
}

function radialAlpha(size, inner, falloff){
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size/2, size/2, size*inner, size/2, size/2, size/2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(falloff, 'rgba(255,255,255,.34)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

/* floor mask: opaque at the edges, open in the middle so the
   reflection only reads directly beneath the tyre */
function floorMask(size = 512){
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  g.addColorStop(0,   'rgba(10,10,10,.34)');
  g.addColorStop(.30, 'rgba(10,10,10,.74)');
  g.addColorStop(.62, 'rgba(10,10,10,.96)');
  g.addColorStop(1,   'rgba(10,10,10,1)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

/* ---------- geometry helpers ---------- */

function lathe(points, segments){
  const pts = points.map(p => new THREE.Vector2(p[0], p[1]));
  const g = new THREE.LatheGeometry(pts, segments);
  g.rotateX(-Math.PI / 2);   // lathe axis Y -> tyre axis Z
  g.computeVertexNormals();
  return g;
}

/* ---------- the tyre ---------- */

function buildTyre(quality){
  const seg   = quality === 'low' ? 48 : 96;
  const sipes = quality === 'low' ? 28 : 56;

  const rubber = new THREE.MeshStandardMaterial({
    color: 0x0e0e10, roughness: .88, metalness: .03,
    normalMap: rubberNormalMap(quality === 'low' ? 128 : 256),
    normalScale: new THREE.Vector2(.85, .85),
    side: THREE.DoubleSide
  });
  const rubberDeep = new THREE.MeshStandardMaterial({
    color: 0x0a0a0c, roughness: .95, metalness: 0, side: THREE.DoubleSide
  });
  const chrome = new THREE.MeshStandardMaterial({
    color: 0xc4c6cb, roughness: .13, metalness: 1, side: THREE.DoubleSide
  });
  const chromeDark = new THREE.MeshStandardMaterial({
    color: 0x5e6066, roughness: .30, metalness: 1, side: THREE.DoubleSide
  });

  const root = new THREE.Group();
  const parts = {};
  const mk = (name) => { const g = new THREE.Group(); g.name = name; root.add(g); parts[name] = g; return g; };

  /* tread band — crown, both shoulders, four circumferential ribs */
  const tread = mk('tread');
  tread.add(new THREE.Mesh(lathe([
    [0.940, -W*0.98], [0.985, -W*0.86], [0.998, -W*0.66],
    [0.976, -W*0.62], [0.976, -W*0.42], [1.000, -W*0.38],
    [1.000,  W*0.38], [0.976,  W*0.42], [0.976,  W*0.62],
    [0.998,  W*0.66], [0.985,  W*0.86], [0.940,  W*0.98]
  ], seg), rubber));

  /* lateral sipes: thin blocks stepped around the crown */
  const sipeGeo = new THREE.BoxGeometry(0.05, 0.028, W*1.05);
  const sipeMesh = new THREE.InstancedMesh(sipeGeo, rubberDeep, sipes);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  const pos = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
  for(let i = 0; i < sipes; i++){
    const a = (i / sipes) * Math.PI * 2;
    const lean = (i % 2 ? 1 : -1) * 0.22;
    pos.set(Math.cos(a) * 0.988, Math.sin(a) * 0.988, 0);
    e.set(0, lean, a);
    q.setFromEuler(e);
    sipeMesh.setMatrixAt(i, m.compose(pos, q, one));
  }
  sipeMesh.instanceMatrix.needsUpdate = true;
  tread.add(sipeMesh);

  /* sidewalls — one group per face so they can separate outward */
  const wallProfile = (s) => lathe([
    [BEAD, s*W*0.72], [0.775, s*W*0.94], [0.855, s*W*1.00],
    [0.910, s*W*0.99], [0.940, s*W*0.98]
  ], seg);
  const wallFront = mk('wallFront');
  wallFront.add(new THREE.Mesh(wallProfile(1), rubber));
  const wallBack = mk('wallBack');
  wallBack.add(new THREE.Mesh(wallProfile(-1), rubber));

  /* rim — barrel, lip, open spokes over a dark drum */
  const rim = mk('rim');

  // barrel: the seat the tyre sits on, front lip to back lip
  rim.add(new THREE.Mesh(lathe([
    [BEAD,   W*0.74], [0.700, W*0.52], [0.665, W*0.10],
    [0.665, -W*0.34], [0.700, -W*0.62], [BEAD, -W*0.76]
  ], seg), chromeDark));

  // outer lip: a polished ring, nothing behind it
  rim.add(new THREE.Mesh(lathe([
    [BEAD, W*0.72], [0.706, W*0.54], [0.672, W*0.36], [0.648, W*0.30]
  ], seg), chrome));

  // the dark drum the spokes read against, so the face is not a hubcap
  const drum = new THREE.Mesh(
    new THREE.CylinderGeometry(0.655, 0.60, W*0.9, seg, 1, false),
    new THREE.MeshStandardMaterial({ color: 0x141416, roughness: .72, metalness: .5, side: THREE.DoubleSide })
  );
  drum.rotation.x = Math.PI / 2;
  drum.position.z = -W * 0.18;
  rim.add(drum);

  // centre disc the spokes spring from
  rim.add(new THREE.Mesh(lathe([
    [0.30, W*0.22], [0.24, W*0.20], [0.10, W*0.18], [0, W*0.17]
  ], seg), chrome));

  const spokeShape = new THREE.Shape();
  spokeShape.moveTo(-0.115, 0.20);
  spokeShape.lineTo( 0.115, 0.20);
  spokeShape.lineTo( 0.055, 0.690);
  spokeShape.lineTo(-0.055, 0.690);
  spokeShape.closePath();
  const spokeGeo = new THREE.ExtrudeGeometry(spokeShape, {
    depth: 0.07, bevelEnabled: true, bevelSize: .016, bevelThickness: .016, bevelSegments: 2
  });
  for(let i = 0; i < 5; i++){
    const sp = new THREE.Mesh(spokeGeo, chrome);
    sp.rotation.z = (i / 5) * Math.PI * 2;
    sp.position.z = W * 0.12;
    rim.add(sp);
  }

  /* hub — centre cap plus five lugs */
  const hub = mk('hub');
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.165, 0.11, seg / 2), chromeDark);
  cap.rotation.x = Math.PI / 2;
  cap.position.z = W * 0.22;
  hub.add(cap);
  const lugGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.05, 12);
  for(let i = 0; i < 5; i++){
    const a = (i / 5) * Math.PI * 2 + 0.35;
    const lug = new THREE.Mesh(lugGeo, chrome);
    lug.rotation.x = Math.PI / 2;
    lug.position.set(Math.cos(a) * 0.285, Math.sin(a) * 0.285, W * 0.24);
    hub.add(lug);
  }

  /* where each part travels when the tyre opens up */
  const spread = {
    tread:     { p: [ 0.00,  1.28,  0.00], r: [ 0.05,  0.00,  0.14] },
    wallFront: { p: [ 1.42,  0.34,  0.45], r: [ 0.00, -0.22,  0.08] },
    wallBack:  { p: [-1.42,  0.28, -0.30], r: [ 0.00,  0.22, -0.08] },
    rim:       { p: [ 0.86, -1.06,  0.20], r: [-0.06,  0.08, -0.12] },
    hub:       { p: [-0.86, -1.02,  0.55], r: [ 0.16,  0.00,  0.18] }
  };

  /* each part owns its material instances: hovering one part has to be
     able to dim the others, and they share source materials otherwise */
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

  const materials = [rubber, rubberDeep, chrome, chromeDark];
  return { root, parts, spread, materials, partMaterials };
}

/* ============================================================ */

export function createStage(canvas, opts = {}){
  const quality = opts.quality || 'high';

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: quality !== 'low', alpha: false, powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'low' ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.setClearColor(0x0a0a0a, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0a0a, 7.5, 17);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 2.30, 7.6);

  /* studio: a soft room for reflections, one key, one rim, one fill */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;
  scene.environment = env;
  pmrem.dispose();

  const key = new THREE.DirectionalLight(0xffffff, 1.75);
  key.position.set(-3.2, 5.4, 4.2);
  scene.add(key);
  const rimLight = new THREE.DirectionalLight(0xbfd0e6, 1.65);
  rimLight.position.set(4.4, 2.2, -4.6);
  scene.add(rimLight);
  const fill = new THREE.DirectionalLight(0xffe6cc, 0.5);
  fill.position.set(2.6, -1.4, 3.2);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffffff, 0.18));
  const wash = new THREE.DirectionalLight(0xdfe6f2, 0.42);
  wash.position.set(-5.2, 1.4, 2.0);
  scene.add(wash);

  /* ---------- floor ---------- */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({
      color: 0x0f0f11, roughness: .66, metalness: .24,
      map: floorMask(), transparent: true, depthWrite: false
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.renderOrder = 2;
  scene.add(floor);

  /* ---------- tyre + reflection ---------- */
  const tilt = new THREE.Group();          // pointer parallax only
  scene.add(tilt);

  const { root, parts, spread, materials, partMaterials } = buildTyre(quality);
  root.position.set(0, R, 0);
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
    o.material.opacity = 0.22;
    o.material.depthWrite = false;
    o.material.side = THREE.DoubleSide;
    o.renderOrder = 1;
    ghostMaterials.push(o.material);
  });
  mirror.add(ghost);

  /* parallel node lists so the reflection tracks every part */
  const srcNodes = [], dstNodes = [];
  (function pair(a, b){
    srcNodes.push(a); dstNodes.push(b);
    for(let i = 0; i < a.children.length; i++) pair(a.children[i], b.children[i]);
  })(root, ghost);

  /* ---------- contact shadow + dust ---------- */
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.9, 2.9),
    new THREE.MeshBasicMaterial({
      color: 0x000000, transparent: true, opacity: .78,
      alphaMap: radialAlpha(256, 0.01, .22), depthWrite: false
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.004;
  shadow.renderOrder = 3;
  scene.add(shadow);

  const dust = new THREE.Sprite(new THREE.SpriteMaterial({
    color: 0x6a6a72, transparent: true, opacity: 0,
    alphaMap: radialAlpha(128, 0.30, .55), depthWrite: false
  }));
  dust.scale.setScalar(1);
  dust.renderOrder = 4;
  scene.add(dust);

  /* ---------- state the timeline drives ---------- */
  const state = {
    flip: 0,          // x rotation — upright (0) to flat (-PI/2)
    yaw: 0,
    roll: 0,          // authored rotation about the axle
    rollCouple: 1,    // 1 = rotation follows travel, as a rolling tyre must
    idleSpeed: 0.06,  // rad/s of slow rotation at rest
    explode: 0,       // 0..1
    squash: 0,        // 0..1, impact deformation
    opacity: 1,
    shadowScale: 1,
    reflection: 0.11,
    target: new THREE.Vector3(0, R * 1.45, 0),
    pointer: new THREE.Vector2(),
    hovered: null
  };

  let idle = 0;
  const tiltTarget = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const partList = Object.values(parts);
  const basePos = new THREE.Vector3();
  const scaleTarget = new THREE.Vector3();

  function puff(strength = 1){
    dust.position.set(root.position.x, 0.05, root.position.z);
    dust.scale.setScalar(0.5 * strength);
    dust.material.opacity = 0.34 * strength;
  }

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

    /* pointer parallax — a few degrees, everywhere, always the same */
    tiltTarget.set(-state.pointer.y * 0.075, state.pointer.x * 0.11);
    tilt.rotation.x += (tiltTarget.x - tilt.rotation.x) * Math.min(1, dt * 3.4);
    tilt.rotation.y += (tiltTarget.y - tilt.rotation.y) * Math.min(1, dt * 3.4);

    /* rotation: authored spin + travel-coupled roll */
    const travel = state.rollCouple * (-root.position.x / R);
    const roll = state.roll + idle + travel;
    root.rotation.set(state.flip, state.yaw, roll, 'XYZ');

    /* impact squash, along the axis the tyre is standing on */
    const s = state.squash;
    root.scale.set(1 + s * 0.09, 1 - s * 0.12, 1 + s * 0.06);

    /* exploded view. The spread is authored in the picture plane, so it
       is counter-rotated out of the tyre's own roll — otherwise the whole
       diagram turns with the wheel and reads as a pile. */
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
    const tightness = 1 / (1 + h * 0.85);
    shadow.position.x = root.position.x;
    shadow.position.z = root.position.z;
    shadow.scale.setScalar((0.72 + h * 0.28) * state.shadowScale * (1 + e * 0.35));
    shadow.material.opacity = 0.72 * tightness * state.opacity * (1 - e * 0.8);

    if(dust.material.opacity > 0.001){
      dust.material.opacity *= Math.pow(0.02, dt);
      dust.scale.setScalar(dust.scale.x + dt * 3.4);
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
    /* hold the horizontal field on portrait screens, so the tyre keeps
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

  return {
    scene, camera, renderer, root, parts, state,
    start(){ if(!raf){ clock.getDelta(); loop(); } },
    stop(){ cancelAnimationFrame(raf); raf = 0; },
    renderOnce(){ frame(); },
    setPointer,
    puff,
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
