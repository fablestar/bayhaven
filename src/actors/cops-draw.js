// How the Sheriff's Tarpon and his deputies are drawn. The cruiser's body is the traffic fleet's
// Tarpon in white with teal as its accent; this file adds what makes it a cruiser, in three draw
// calls for every cruiser on the street: the livery (teal door panels, a pink stripe, the bar's
// base), the two lamps of the light bar (pink on the left, cyan on the right) and their glow on
// the road. Deputies are one more: a six-box figure in a sand shirt and a wide hat.
import * as THREE from 'three';
import { MeshBuilder, glowTexture } from '../gfx/builder.js';

export const LIVERY = { white: 0xf2f2ea, teal: 0x14b0a5, pink: 0xff4fa8, cyan: 0x29e6ff, bar: 0x23233a };
const BODY = { hw: 0.895, y0: 0.44, y1: 0.9, roof: 1.46, zf: 2.26, zr: -2.24 };     // the Tarpon's sheet

function liveryGeometry() {
  const B = new MeshBuilder({ size: 256 }), x = BODY.hw + 0.008;
  for (const s of [1, -1]) {
    const q = (y0, y1, z0, z1, col, out) => {
      const X = s * (x + out), a = [X, y0, z1], b = [X, y0, z0], c = [X, y1, z0], d = [X, y1, z1];
      if (s > 0) B.quad(a, b, c, d, col); else B.quad(d, c, b, a, col);
    };
    q(BODY.y0 + 0.02, BODY.y1 - 0.02, -1.25, 1.05, LIVERY.teal, 0);          // the doors
    q(0.60, 0.70, BODY.zr + 0.12, BODY.zf - 0.12, LIVERY.pink, 0.004);        // the stripe, nose to tail
  }
  B.box(0, BODY.roof + 0.03, -0.18, 1.16, 0.06, 0.3, LIVERY.bar);             // the bar's base
  B.box(0, BODY.roof + 0.1, -0.18, 0.1, 0.1, 0.24, 0xeeeeee);                 // the white block between the lamps
  B.box(0, BODY.y1 + 0.02, BODY.zf + 0.02, 1.5, 0.3, 0.08, LIVERY.bar);       // the push bar on the nose
  return B.build();
}
function deputyGeometry() {
  const B = new MeshBuilder({ size: 512 });
  const shirt = 0xdcc58c, trousers = 0x1c4e58, skin = 0xc48a5e, hat = 0xb7975a;
  B.box(0.1, 0.42, 0, 0.16, 0.84, 0.18, trousers); B.box(-0.1, 0.42, 0, 0.16, 0.84, 0.18, trousers);
  B.box(0, 1.14, 0, 0.44, 0.6, 0.24, shirt);
  B.box(0, 0.86, 0, 0.46, 0.06, 0.26, 0x2a2a33);                               // belt
  B.box(0.11, 1.28, 0.125, 0.07, 0.07, 0.01, 0xffd34d);                        // the star
  B.box(0.29, 1.1, 0.02, 0.12, 0.6, 0.14, shirt); B.box(-0.29, 1.1, 0.02, 0.12, 0.6, 0.14, shirt);
  B.box(0, 1.58, 0, 0.24, 0.26, 0.24, skin);
  B.box(0, 1.73, 0, 0.56, 0.03, 0.56, hat); B.box(0, 1.8, 0, 0.26, 0.12, 0.26, hat);
  B.box(0, 1.755, 0, 0.27, 0.03, 0.27, LIVERY.pink);                           // the hat band
  return B.build();
}

export function createCopDraw(scene, cap) {
  const lam = new THREE.MeshLambertMaterial({ vertexColors: true });
  const livery = new THREE.InstancedMesh(liveryGeometry(), lam, cap);
  const lampGeo = new THREE.BoxGeometry(0.5, 0.12, 0.26);
  const lamps = new THREE.InstancedMesh(lampGeo, new THREE.MeshBasicMaterial({ toneMapped: false }), cap * 2);
  const flat = new THREE.PlaneGeometry(1, 1); flat.rotateX(-Math.PI / 2);
  const glow = new THREE.InstancedMesh(flat, new THREE.MeshBasicMaterial({ map: glowTexture(), transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, toneMapped: false }), cap * 3);
  const deputies = new THREE.InstancedMesh(deputyGeometry(), lam, Math.max(1, cap));
  const col = new THREE.Color(), M = new THREE.Matrix4();
  lamps.setColorAt(0, col); glow.setColorAt(0, col);
  glow.renderOrder = 4;
  for (const mesh of [livery, lamps, glow, deputies]) { mesh.frustumCulled = false; mesh.count = 0; scene.add(mesh); }
  const pink = new THREE.Color(LIVERY.pink), cyan = new THREE.Color(LIVERY.cyan);

  function put(mesh, i, x, y, z, a, sx, sy, sz) {
    const c = Math.cos(a), s = Math.sin(a);
    M.set(c * sx, 0, s * sz, x, 0, sy, 0, y, -s * sx, 0, c * sz, z, 0, 0, 0, 1);
    mesh.setMatrixAt(i, M);
  }
  const tint = (mesh, i, base, k) => { col.copy(base).multiplyScalar(k); mesh.setColorAt(i, col); };

  return {
    meshes: { livery, lamps, glow, deputies },
    get calls() { return (livery.count ? 1 : 0) + (lamps.count ? 1 : 0) + (glow.count ? 1 : 0) + (deputies.count ? 1 : 0); },
    get triangles() { return livery.count * 44 + lamps.count * 12 + glow.count * 2 + deputies.count * 120; },
    // units: [{ v: the vehicle, lit, deputy: { out, x, z, h, bob } }]
    draw(units, time, night) {
      let n = 0, nl = 0, ng = 0, nd = 0;
      for (const u of units) {
        const v = u.v; if (!v || n >= cap) continue;
        const c = Math.cos(v.h), s = Math.sin(v.h), y = v.y || 0;
        put(livery, n++, v.x, y, v.z, v.h, 1, 1, 1);
        // the bar: pink and cyan take turns, five flashes a second at heat 3, half that below
        const phase = Math.floor(time * (u.fast ? 5 : 2.5) + u.id * 0.5) % 2, on = u.lit ? 1 : 0;
        for (const side of [1, -1]) {
          const lx = side * 0.31, lz = -0.18, bright = on ? ((side > 0) === (phase === 0) ? 1.6 : 0.25) : 0.3;
          const x = v.x + lx * c + lz * s, z = v.z - lx * s + lz * c;
          put(lamps, nl, x, y + BODY.roof + 0.12, z, v.h, 1, 1, 1);
          tint(lamps, nl++, side > 0 ? pink : cyan, bright);
          if (on && bright > 1) { put(glow, ng, x, y + BODY.roof + 0.2, z, 0, 2.6, 1, 2.6); tint(glow, ng++, side > 0 ? pink : cyan, 0.7); }
        }
        // the wash on the road: wider and stronger at night
        if (on) { put(glow, ng, v.x, y + 0.06, v.z, 0, 15, 1, 15); tint(glow, ng++, phase === 0 ? pink : cyan, 0.16 + night * 0.34); }
        const d = u.deputy;
        if (d && d.out && nd < cap) {
          put(deputies, nd++, d.x, (d.y || 0) + Math.abs(Math.sin(d.bob || 0)) * 0.05, d.z, d.h, 1, 1, 1);
        }
      }
      livery.count = n; lamps.count = nl; glow.count = ng; deputies.count = nd;
      livery.instanceMatrix.needsUpdate = lamps.instanceMatrix.needsUpdate = glow.instanceMatrix.needsUpdate = deputies.instanceMatrix.needsUpdate = true;
      lamps.instanceColor.needsUpdate = glow.instanceColor.needsUpdate = true;
    },
    dispose() { for (const mesh of [livery, lamps, glow, deputies]) scene.remove(mesh); },
  };
}
