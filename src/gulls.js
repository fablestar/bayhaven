// Gulls circling over the beach. All of them live in one small mesh (two triangles per
// bird), and the wings flap by moving the vertices each frame. They go home at night.

import * as THREE from 'three';
import { rng } from './builder.js';

export function createGulls(scene, count = 9) {
  const rnd = rng(4242);
  const birds = [];
  for (let i = 0; i < count; i++) {
    birds.push({
      cx: -80 + rnd() * 160, cz: 58 + rnd() * 40,      // centre of its circle
      r: 9 + rnd() * 22, y: 11 + rnd() * 16,
      w: (0.16 + rnd() * 0.14) * (rnd() < 0.5 ? -1 : 1), // how fast it circles, and which way
      a: rnd() * 6.28, flap: 5 + rnd() * 3, ph: rnd() * 6.28,
    });
  }
  const pos = new Float32Array(count * 18);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  scene.add(mesh);

  const SPAN = 1.5, LEN = 0.3, SWEEP = 0.45; // wing length, body half-length, how far the tips trail back
  function update(time, night) {
    mesh.visible = night < 0.8;
    if (!mesh.visible) return;
    mat.color.setScalar(0.96 - night * 0.7);
    for (let i = 0; i < count; i++) {
      const b = birds[i], a = b.a + time * b.w, dir = Math.sign(b.w);
      const x = b.cx + Math.cos(a) * b.r, z = b.cz + Math.sin(a) * b.r;
      const y = b.y + Math.sin(time * 0.4 + b.ph) * 1.5;
      const fx = -Math.sin(a) * dir, fz = Math.cos(a) * dir; // flying direction
      const rx = fz, rz = -fx;                                // out along the wing
      // flap for a while, then glide with the wings held up a little
      const glide = Math.sin(time * 0.35 + b.ph * 2) > 0.3;
      const up = glide ? 0.22 : Math.sin(time * b.flap + b.ph) * 0.75;
      const wx = Math.cos(up) * SPAN, wy = Math.sin(up) * SPAN;
      const o = i * 18;
      const nx = x + fx * LEN, nz = z + fz * LEN, tx = x - fx * LEN, tz = z - fz * LEN;
      pos[o] = nx; pos[o + 1] = y; pos[o + 2] = nz;
      pos[o + 3] = tx; pos[o + 4] = y; pos[o + 5] = tz;
      pos[o + 6] = x + rx * wx - fx * SWEEP; pos[o + 7] = y + wy; pos[o + 8] = z + rz * wx - fz * SWEEP;
      pos[o + 9] = nx; pos[o + 10] = y; pos[o + 11] = nz;
      pos[o + 12] = tx; pos[o + 13] = y; pos[o + 14] = tz;
      pos[o + 15] = x - rx * wx - fx * SWEEP; pos[o + 16] = y + wy; pos[o + 17] = z - rz * wx - fz * SWEEP;
    }
    geo.attributes.position.needsUpdate = true;
  }
  return { update };
}
