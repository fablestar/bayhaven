// Street furniture that stays put: palms, umbrellas and benches. One instanced mesh per shape for
// the whole city. Each loaded chunk keeps a list of matrices per shape; every frame the lists of
// the chunks in view are joined into the mesh, so what is behind the camera costs nothing
// (plan/bible/tech/perf-playbook.md section 3: instanced meshes are culled by hand).
import * as THREE from 'three';
import { MeshBuilder, rng } from '../gfx/builder.js';
import { chunkMaterials } from '../gfx/materials.js';

const GREENS = [0x2f9e58, 0x3fb86a, 0x2a8a50, 0x4bbf62];
// day 1's palm, 8.5 m tall, at the origin. far: 3 trunk boxes and 5 fronds of 2 segments.
function palmGeo(seed, far) {
  const P = new MeshBuilder(), rnd = rng(seed), height = 8.5;
  const lean = rnd() * Math.PI * 2, bend = 0.25 + rnd() * 0.45, segs = far ? 3 : 5, sh = height / segs, shrink = far ? 0.78 : 0.86;
  let bx = 0, by = 0, bz = 0, w = 0.5;
  for (let i = 0; i < segs; i++) {
    const k = (i + 0.5) / segs, dx = Math.cos(lean) * bend * k * (5 / segs), dz = Math.sin(lean) * bend * k * (5 / segs), w2 = w * shrink;
    P.box(bx, by + sh / 2, bz, w, sh, w, i % 2 ? 0x8a6a4a : 0x7a5c40, { taper: [w2 / w, w2 / w], shift: [dx, dz], rot: 0.5, noTop: far });
    bx += dx; by += sh; bz += dz; w = w2;
  }
  const n = far ? 5 : 9, steps = far ? 2 : 4, a0 = rnd() * 6;
  for (let f = 0; f < n; f++) {
    const th = a0 + (f / n) * Math.PI * 2 + (rnd() - 0.5) * 0.3, dx = Math.cos(th), dz = Math.sin(th), px = -dz, pz = dx;
    const len = 2.7 + rnd() * 1.1, droop = 0.75 + rnd() * 0.35, col = GREENS[Math.floor(rnd() * 4)];
    let prev = null;
    for (let k = 0; k <= steps; k++) {
      const t = k / steps, r = len * t, y = by + 0.9 * len * (0.55 * t - droop * t * t);
      const hw = (far ? 0.75 : 0.55) * Math.sin(Math.PI * (0.15 + 0.85 * t));
      const R = [bx + dx * r, y, bz + dz * r], A = [R[0] + px * hw, y - 0.35 * hw, R[2] + pz * hw], C = [R[0] - px * hw, y - 0.35 * hw, R[2] - pz * hw];
      if (prev) { P.quad(prev.R, R, A, prev.A, col, 1); P.quad(prev.R, prev.C, C, R, col, 0.8); }
      prev = { R, A, C };
    }
  }
  return P.build();
}
function umbrellaGeo() {            // white and near-white panels; the instance colour tints them
  const P = new MeshBuilder(), r = 1.7, n = 8;
  P.box(0, 1.1, 0, 0.08, 2.2, 0.08, 0xffffff);
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
    P.tri([0, 2.45, 0], [Math.cos(a1) * r, 1.9, Math.sin(a1) * r], [Math.cos(a0) * r, 1.9, Math.sin(a0) * r], 0xffffff, i % 2 ? 1 : 0.62);
  }
  return P.build();
}
function benchGeo() {               // 1.8 x 0.45 x 0.5, facing +z
  const B = new MeshBuilder();
  B.box(0, 0.45, 0, 1.8, 0.08, 0.45, 0x8a6f55, { bottom: true });
  B.box(0, 0.75, -0.2, 1.8, 0.4, 0.06, 0x8a6f55, { bottom: true });
  for (const x of [-0.75, 0.75]) B.box(x, 0.22, 0, 0.08, 0.44, 0.4, 0x2b2838);
  return B.build();
}
const UMBRELLA = [0xff4f6e, 0x29b6e6, 0xffc23e, 0xff7a1e, 0x3fd68a];

export function createDecor(scene, { low = () => false } = {}) {
  const mats = chunkMaterials();
  const shapes = {
    palm0: { geo: palmGeo(11), mat: mats.leaf, cap: 420 }, palm1: { geo: palmGeo(23), mat: mats.leaf, cap: 420 },
    palm2: { geo: palmGeo(37), mat: mats.leaf, cap: 420 }, palm3: { geo: palmGeo(51), mat: mats.leaf, cap: 420 },
    palmFar: { geo: palmGeo(11, true), mat: mats.leaf, cap: 1600 },
    umbrella: { geo: umbrellaGeo(), mat: mats.leaf, cap: 640, tint: true }, bench: { geo: benchGeo(), mat: mats.B, cap: 256 },
  };
  for (const name in shapes) {
    const s = shapes[name];
    s.tris = s.geo.attributes.position.count / 3;
    s.mesh = new THREE.InstancedMesh(s.geo, s.mat, s.cap);
    s.mesh.frustumCulled = false; s.mesh.count = 0; s.mesh.matrixAutoUpdate = false;
    if (s.tint) s.mesh.setColorAt(0, new THREE.Color(1, 1, 1));
    scene.add(s.mesh);
  }
  const chunks = new Map();          // key -> { cx, cz, box, lists: { shape: number[] }, tints: number[] }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), pos = new THREE.Vector3(), scl = new THREE.Vector3();
  const frustum = new THREE.Frustum(), pv = new THREE.Matrix4(), col = new THREE.Color();
  let dirty = true, lastSig = '', shown = 0;

  const decor = {
    shapes,
    get count() { return shown; },
    // start a chunk's lists; returns add(kind, x, y, z, rot, scale): kind is palm, umbrella or bench
    open(key, cx, cz, rect) {
      const c = { cx, cz, box: new THREE.Box3(new THREE.Vector3(rect.x0 - 6, -2, rect.z0 - 6), new THREE.Vector3(rect.x1 + 6, 14, rect.z1 + 6)), lists: {}, tints: [] };
      const push = (name, x, y, z, rot, scale) => {
        q.setFromAxisAngle(up, rot); pos.set(x, y, z); scl.set(scale, scale, scale); m4.compose(pos, q, scl);
        const l = (c.lists[name] ||= []); for (let i = 0; i < 16; i++) l.push(m4.elements[i]);
      };
      return {
        add(kind, x, y, z, rot = 0, scale = 1) {
          if (kind === 'palm') {
            const v = Math.abs(Math.floor(rot * 7.3 + x)) % 4;
            push('palm' + v, x, y, z, rot, scale); push('palmFar', x, y, z, rot, scale);
          } else { push(kind, x, y, z, rot, scale); if (kind === 'umbrella') c.tints.push(UMBRELLA[Math.abs(Math.floor(rot * 3 + x)) % UMBRELLA.length]); }
        },
        done() { for (const n in c.lists) c.lists[n] = new Float32Array(c.lists[n]); chunks.set(key, c); dirty = true; },
      };
    },
    drop(key) { if (chunks.delete(key)) dirty = true; },
    // join the lists of the chunks in view; palms near the camera chunk get the full shape
    update(camera, camCx, camCz) {
      pv.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); frustum.setFromProjectionMatrix(pv);
      let sig = camCx + ',' + camCz + ':';
      const vis = [];
      for (const [key, c] of chunks) if (frustum.intersectsBox(c.box)) { vis.push(c); sig += key + ','; }
      if (!dirty && sig === lastSig) return;
      dirty = false; lastSig = sig; shown = 0;
      const nearR = low() ? 0 : 1;
      for (const name in shapes) {
        const s = shapes[name], arr = s.mesh.instanceMatrix.array;
        let n = 0;
        for (const c of vis) {
          const l = c.lists[name];
          if (!l) continue;
          const near = Math.max(Math.abs(c.cx - camCx), Math.abs(c.cz - camCz)) <= nearR;
          if (name === 'palmFar' ? near : name.startsWith('palm') && !near) continue;
          const take = Math.min(l.length / 16, s.cap - n);
          arr.set(take * 16 === l.length ? l : l.subarray(0, take * 16), n * 16);
          if (s.tint) for (let i = 0; i < take; i++) s.mesh.setColorAt(n + i, col.set(c.tints[i]));
          n += take;
        }
        s.mesh.count = n; s.mesh.instanceMatrix.needsUpdate = true; shown += n;
        if (s.tint && s.mesh.instanceColor) s.mesh.instanceColor.needsUpdate = true;
      }
    },
  };
  return decor;
}
