// How the Sheriff's heavy units are drawn. Each rides on a body the traffic fleet already draws
// (the SUV is a Grouper; the tactical van hides a Pompano; the show truck hides a Mullet, until a
// Hogfish ships) and this file adds the bodywork from plan/bible/catalog/vehicles-other.md on top:
// one draw call per kind, and one for every spike strip. Light bars are drawn by cops-draw.js.
import * as THREE from 'three';
import { MeshBuilder } from '../gfx/builder.js';
import { LIVERY } from './cops-draw.js';

const INK = 0x23233a, GLASS = 0x18222e, RED = 0xff2d55, SAND = 0xdcc58c;
// a sheet piece: length (along the car), width, height, at `fwd` along the car and `y0` off the road, `x` off the centre line
const piece = (B, L, W, H, fwd, y0, col, x = 0) => B.box(x, y0 + H / 2, fwd, W, H, L, col);
const both = (B, L, W, H, fwd, y0, col, x) => { piece(B, L, W, H, fwd, y0, col, x); piece(B, L, W, H, fwd, y0, col, -x); };

// the Sheriff Grouper: teal doors, the pink stripe, the bar's base and a bull bar
function suvGeometry() {
  const B = new MeshBuilder({ size: 256 });
  both(B, 2.5, 0.02, 0.5, -0.1, 0.5, LIVERY.teal, 0.985);
  both(B, 4.5, 0.02, 0.1, 0, 1.0, LIVERY.pink, 0.99);
  piece(B, 0.3, 1.3, 0.12, -0.1, 1.82, INK);
  piece(B, 0.12, 1.8, 0.7, 2.45, 0.4, INK);
  both(B, 0.5, 0.08, 0.08, 2.25, 0.7, INK, 0.7);
  return B.build();
}
// the tactical van, whole: an armoured box with a slit for glass and a ram on the nose
function vanGeometry() {
  const B = new MeshBuilder({ size: 256 });
  piece(B, 6, 2.2, 0.28, 0, 0.4, INK);                                   // chassis
  piece(B, 4.24, 2.3, 0.7, -0.82, 0.68, LIVERY.teal);                    // hull, lower half
  piece(B, 4.24, 2.3, 1.2, -0.82, 1.38, LIVERY.white);                   // hull, upper half
  both(B, 4.26, 0.02, 0.1, -0.82, 1.33, LIVERY.pink, 1.155);             // the stripe
  piece(B, 0.7, 2.2, 0.92, 1.65, 0.68, LIVERY.teal);                     // body
  piece(B, 0.8, 2.2, 0.92, 2.4, 0.68, LIVERY.teal);                      // hood
  piece(B, 1.3, 2.1, 0.8, 1.95, 1.6, LIVERY.white);                      // cabin
  piece(B, 0.02, 1.8, 0.3, 2.61, 1.9, GLASS);                            // the slit
  both(B, 0.8, 0.02, 0.3, 2.1, 1.9, GLASS, 1.06);
  piece(B, 0.29, 1.74, 0.06, 1.88, 2.4, INK);                            // roof plate
  piece(B, 0.2, 2.3, 0.8, 2.9, 0.4, INK);                                // the ram
  piece(B, 0.3, 1.4, 0.12, 1.05, 2.58, INK);                             // the bar's base
  both(B, 3, 0.25, 0.1, -0.5, 0.55, INK, 1.2);                           // running boards
  piece(B, 0.8, 0.8, 0.06, -1.1, 2.58, INK);                             // roof hatch
  piece(B, 0.02, 1.6, 1.5, -2.95, 0.8, INK);                             // rear doors
  return B.build();
}
// the show truck: a cab, a stage with a screen each side, a camera crane, a dish, and the Sheriff at his podium
function truckGeometry() {
  const B = new MeshBuilder({ size: 512 });
  piece(B, 7.5, 2.2, 0.3, 0, 0.45, INK);                                 // chassis
  piece(B, 1, 2.3, 0.8, 2.05, 0.75, LIVERY.teal);                        // body
  piece(B, 1.14, 2.3, 0.8, 3.12, 0.75, LIVERY.teal);                     // hood
  piece(B, 1.4, 2.2, 0.9, 2.25, 1.55, LIVERY.white);                     // cabin
  piece(B, 0.02, 1.9, 0.5, 2.96, 1.8, GLASS);
  both(B, 0.9, 0.02, 0.45, 2.3, 1.85, GLASS, 1.11);
  piece(B, 0.06, 2.4, 0.3, 3.72, 0.5, INK);                              // bumper
  piece(B, 5.15, 2.4, 0.5, -1.12, 0.9, LIVERY.teal);                     // the stage, lower
  piece(B, 5.15, 2.4, 0.8, -1.12, 1.4, LIVERY.white);                    // the stage, upper
  both(B, 5.17, 0.02, 0.1, -1.12, 1.35, LIVERY.pink, 1.205);
  // the screens: dark panels with the red LIVE pill and a row of white blocks for the count
  for (const s of [1, -1]) {
    piece(B, 4.6, 0.1, 1, -1.15, 2.2, INK, s * 1.15);
    piece(B, 0.9, 0.02, 0.3, -2.75, 2.75, RED, s * 1.21);
    for (let i = 0; i < 6; i++) piece(B, 0.34, 0.02, 0.4, -1.9 + i * 0.5 + (i > 2 ? 0.15 : 0), 2.35, 0xffffff, s * 1.21);
  }
  piece(B, 1, 1, 0.3, -1.05, 2.2, LIVERY.pink);                          // the podium
  piece(B, 0.2, 0.2, 1.1, 0.75, 2.2, INK);                               // the crane's post
  piece(B, 4, 0.2, 0.2, -1.15, 3.3, INK);                                // the crane
  piece(B, 0.4, 0.4, 0.4, -3.25, 3.1, GLASS);                            // the camera
  piece(B, 0.1, 0.1, 0.75, 1, 2.45, INK);
  piece(B, 0.7, 0.7, 0.7, 1, 3.2, LIVERY.white);                         // the dish
  piece(B, 0.3, 1.6, 0.12, 2.1, 2.51, INK);                              // the bar's base
  both(B, 0.3, 0.5, 0.6, 1.3, 2.2, INK, 0.75);                           // speakers
  // Sheriff Rucker: white hat, sand shirt, a megaphone
  const f = -1.05, y = 2.5;
  both(B, 0.18, 0.16, 0.8, f, y, 0x1c4e58, 0.1);
  piece(B, 0.26, 0.5, 0.62, f, y + 0.8, SAND);
  piece(B, 0.01, 0.08, 0.08, f + 0.135, y + 1.22, 0xffd34d, 0.12);
  both(B, 0.14, 0.12, 0.55, f, y + 0.82, SAND, 0.31);
  piece(B, 0.24, 0.24, 0.26, f, y + 1.44, 0xd9a47a);
  piece(B, 0.62, 0.62, 0.03, f, y + 1.7, 0xffffff);
  piece(B, 0.28, 0.28, 0.16, f, y + 1.73, 0xffffff);
  piece(B, 0.29, 0.29, 0.04, f, y + 1.73, LIVERY.pink);
  piece(B, 0.34, 0.16, 0.16, f + 0.3, y + 1.38, RED, 0.1);
  return B.build();
}

export const HEAVY_BARS = { suv: [-0.1, 2.0, 0.35], van: [1.05, 2.76, 0.4], truck: [2.1, 2.69, 0.5] };

export function createHeavyDraw(scene, cap) {
  const lam = new THREE.MeshLambertMaterial({ vertexColors: true });
  const geo = { suv: suvGeometry(), van: vanGeometry(), truck: truckGeometry() };
  const tris = {}, meshes = {};
  for (const k in geo) {
    meshes[k] = new THREE.InstancedMesh(geo[k], lam, k === 'truck' ? 1 : cap);
    tris[k] = (geo[k].index ? geo[k].index.count : geo[k].attributes.position.count) / 3;
  }
  // a spike strip: a dark mat with a row of pale teeth
  const SB = new MeshBuilder({ size: 256 });
  SB.box(0, 0.03, 0, 1, 0.06, 0.6, 0x15151c);
  for (let i = 0; i < 14; i++) SB.box(-0.465 + i * 0.0715, 0.09, 0, 0.012, 0.08, 0.12, 0xd8dde4);
  const spikeGeo = SB.build();
  meshes.spikes = new THREE.InstancedMesh(spikeGeo, lam, 2);
  tris.spikes = (spikeGeo.index ? spikeGeo.index.count : spikeGeo.attributes.position.count) / 3;
  const M = new THREE.Matrix4();
  for (const k in meshes) { meshes[k].frustumCulled = false; meshes[k].count = 0; scene.add(meshes[k]); }
  function put(mesh, i, x, y, z, a, sx) {
    const c = Math.cos(a), s = Math.sin(a);
    M.set(c * sx, 0, s, x, 0, 1, 0, y, -s * sx, 0, c, z, 0, 0, 0, 1);
    mesh.setMatrixAt(i, M);
  }
  return {
    meshes, tris,
    get calls() { let n = 0; for (const k in meshes) if (meshes[k].count) n++; return n; },
    get triangles() { let n = 0; for (const k in meshes) n += meshes[k].count * tris[k]; return n; },
    // units: the deputies' units; blocks: the roadblocks, each with a strip { x, y, z, h, len }
    draw(units, blocks) {
      const n = { suv: 0, van: 0, truck: 0 };
      for (const u of units) {
        const mesh = meshes[u.kind]; if (!mesh || n[u.kind] === undefined || n[u.kind] >= mesh.instanceMatrix.count) continue;
        put(mesh, n[u.kind]++, u.v.x, u.v.y || 0, u.v.z, u.v.h, 1);
      }
      let ns = 0;
      for (const b of blocks) if (ns < 2) put(meshes.spikes, ns++, b.strip.x, b.strip.y || 0, b.strip.z, b.strip.h, b.strip.len);
      for (const k in n) { meshes[k].count = n[k]; meshes[k].instanceMatrix.needsUpdate = true; }
      meshes.spikes.count = ns; meshes.spikes.instanceMatrix.needsUpdate = true;
    },
  };
}
