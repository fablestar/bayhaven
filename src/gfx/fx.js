// Effects: tyre smoke, skid marks, sparks and camera shake.
// Three draw calls in all: one mesh of soft quads (smoke), one of bright streaks (sparks),
// one of strips on the road (skid marks). Recipes from plan/bible/art/vfx.md rows 1 to 3.

import * as THREE from 'three';
import { glowTexture, rng } from './builder.js';

function quadMesh(max, material) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(max * 12), col = new Float32Array(max * 16), uv = new Float32Array(max * 8), idx = new Uint16Array(max * 6);
  for (let i = 0; i < max; i++) {
    uv.set([0, 0, 1, 0, 1, 1, 0, 1], i * 8);
    idx.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3], i * 6);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 4).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  const mesh = new THREE.Mesh(geo, material);
  mesh.frustumCulled = false;
  return { mesh, pos, col, geo };
}
function setColor(col, q, r, g, b, a) {
  for (let k = 0; k < 4; k++) { const o = q * 16 + k * 4; col[o] = r; col[o + 1] = g; col[o + 2] = b; col[o + 3] = a; }
}

export function createFx(scene, { low = false, heightAt = () => 0 } = {}) {
  const MAX_SMOKE = low ? 24 : 96, MAX_SPARK = low ? 100 : 250, MAX_SKID = low ? 60 : 300;
  const SKID_LIFE = low ? 8 : 20, BURST = low ? 6 : 24;
  let rnd = rng(7);

  const smoke = quadMesh(MAX_SMOKE, new THREE.MeshBasicMaterial({ map: glowTexture(), vertexColors: true, transparent: true, depthWrite: false }));
  const sparks = quadMesh(MAX_SPARK, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide }));
  const skids = quadMesh(MAX_SKID, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false,
    side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }));
  smoke.mesh.renderOrder = 5; sparks.mesh.renderOrder = 6; skids.mesh.renderOrder = 1;
  scene.add(skids.mesh, smoke.mesh, sparks.mesh);

  const puffs = [], bits = [];
  for (let i = 0; i < MAX_SMOKE; i++) puffs.push({ life: 0 });
  for (let i = 0; i < MAX_SPARK; i++) bits.push({ life: 0 });
  let nextPuff = 0, nextBit = 0, nextSkid = 0, shakeMag = 0, time = 0;
  const skidBorn = new Float32Array(MAX_SKID).fill(-1e9);
  const trails = [null, null, null, null];           // last point laid by each tyre
  const right = new THREE.Vector3(), upv = new THREE.Vector3(), tmp = new THREE.Vector3(), dir = new THREE.Vector3();

  const fx = {
    shakeX: 0, shakeY: 0,
    seed(n) { rnd = rng(n); },
    // one puff of tyre smoke: 0.6 to 2.4 m, rising 0.8 m/s, 0.9 s
    puff(x, y, z, vx = 0, vz = 0) {
      const p = puffs[nextPuff]; nextPuff = (nextPuff + 1) % MAX_SMOKE; // when full, the oldest is reused
      p.x = x + (rnd() - 0.5) * 0.3; p.y = y; p.z = z + (rnd() - 0.5) * 0.3;
      p.vx = vx + (rnd() - 0.5) * 0.8; p.vy = 0.8; p.vz = vz + (rnd() - 0.5) * 0.8;
      p.life = p.max = 0.9;
    },
    // a burst of sparks thrown off a wall along its normal
    sparks(x, y, z, nx, nz, count = BURST) {
      for (let i = 0; i < count; i++) {
        const b = bits[nextBit]; nextBit = (nextBit + 1) % MAX_SPARK;
        const sp = 4 + rnd() * 5, a = (rnd() - 0.5) * 2.2;
        const c = Math.cos(a), s = Math.sin(a);
        b.x = x; b.y = y + rnd() * 0.4; b.z = z;
        b.vx = (nx * c - nz * s) * sp; b.vz = (nx * s + nz * c) * sp; b.vy = 1 + rnd() * 4;
        b.life = b.max = 0.35;
      }
    },
    // lay a skid mark point for one tyre; call with on = false when it stops sliding
    skid(tyre, x, z, on) {
      const last = trails[tyre];
      if (!on) { trails[tyre] = null; return; }
      if (!last) { trails[tyre] = { x, z, px: 0, pz: 0, has: false }; return; }
      const dx = x - last.x, dz = z - last.z, d = Math.hypot(dx, dz);
      if (d < 0.5) return;
      if (d > 3) { trails[tyre] = { x, z, has: false }; return; }
      const px = -dz / d * 0.12, pz = dx / d * 0.12;      // 0.24 m wide
      if (!last.has) { last.px = px; last.pz = pz; }
      const q = nextSkid; nextSkid = (nextSkid + 1) % MAX_SKID;
      const y0 = heightAt(last.x, last.z) + 0.025, y1 = heightAt(x, z) + 0.025;
      skids.pos.set([last.x - last.px, y0, last.z - last.pz, last.x + last.px, y0, last.z + last.pz,
        x + px, y1, z + pz, x - px, y1, z - pz], q * 12);
      skidBorn[q] = time;
      skids.geo.attributes.position.needsUpdate = true;
      trails[tyre] = { x, z, px, pz, has: true };
    },
    // camera shake in metres; fades at 6 a second
    shake(metres) { shakeMag = Math.max(shakeMag, Math.min(0.25, metres)); },
    count(name) {
      if (name === 'skid') { let n = 0; for (let i = 0; i < MAX_SKID; i++) if (time - skidBorn[i] < SKID_LIFE) n++; return n; }
      if (name === 'smoke') return puffs.filter((p) => p.life > 0).length;
      if (name === 'sparks') return bits.filter((b) => b.life > 0).length;
      return 0;
    },
    // move the particles on (no drawing work); safe to call many times a frame
    step(dt) {
      time += dt;
      for (const p of puffs) if (p.life > 0) {
        p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        const f = Math.max(0, 1 - 1.5 * dt); p.vx *= f; p.vz *= f;
      }
      for (const b of bits) if (b.life > 0) {
        b.life -= dt; b.vy -= 12 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt;
        if (b.y < 0.03) { b.y = 0.03; b.vy *= -0.4; }
      }
      shakeMag *= Math.exp(-6 * dt);
    },
    // write the buffers for this frame
    draw(camera, night = 0, speedShake = 0) {
      right.setFromMatrixColumn(camera.matrixWorld, 0); upv.setFromMatrixColumn(camera.matrixWorld, 1);
      const tint = 0.9 * (1 - 0.62 * night);          // smoke takes the light of the hour
      for (let i = 0; i < MAX_SMOKE; i++) {
        const p = puffs[i], o = i * 12;
        if (p.life <= 0) { smoke.pos.fill(0, o, o + 12); continue; }
        const k = 1 - p.life / p.max, s = (0.6 + 1.8 * k) * 0.5;
        const a = 0.9 * (k > 0.6 ? (1 - k) / 0.4 : 1) * Math.min(1, k * 8);   // the soft texture brings this to about 50% at the middle
        const P = smoke.pos;
        P[o] = p.x - (right.x + upv.x) * s; P[o + 1] = p.y - (right.y + upv.y) * s; P[o + 2] = p.z - (right.z + upv.z) * s;
        P[o + 3] = p.x + (right.x - upv.x) * s; P[o + 4] = p.y + (right.y - upv.y) * s; P[o + 5] = p.z + (right.z - upv.z) * s;
        P[o + 6] = p.x + (right.x + upv.x) * s; P[o + 7] = p.y + (right.y + upv.y) * s; P[o + 8] = p.z + (right.z + upv.z) * s;
        P[o + 9] = p.x - (right.x - upv.x) * s; P[o + 10] = p.y - (right.y - upv.y) * s; P[o + 11] = p.z - (right.z - upv.z) * s;
        setColor(smoke.col, i, 0.93 * tint, 0.9 * tint, 0.82 * tint, a);
      }
      for (let i = 0; i < MAX_SPARK; i++) {
        const b = bits[i], o = i * 12;
        if (b.life <= 0) { sparks.pos.fill(0, o, o + 12); continue; }
        dir.set(b.vx, b.vy, b.vz).normalize();
        tmp.set(b.x, b.y, b.z).sub(camera.position).cross(dir).normalize().multiplyScalar(0.035);
        const P = sparks.pos, L = 0.3;
        P[o] = b.x - tmp.x; P[o + 1] = b.y - tmp.y; P[o + 2] = b.z - tmp.z;
        P[o + 3] = b.x + tmp.x; P[o + 4] = b.y + tmp.y; P[o + 5] = b.z + tmp.z;
        P[o + 6] = b.x + tmp.x - dir.x * L; P[o + 7] = b.y + tmp.y - dir.y * L; P[o + 8] = b.z + tmp.z - dir.z * L;
        P[o + 9] = b.x - tmp.x - dir.x * L; P[o + 10] = b.y - tmp.y - dir.y * L; P[o + 11] = b.z - tmp.z - dir.z * L;
        const k = 1 - b.life / b.max;                  // #fff1c9 cooling to #ffa02e
        setColor(sparks.col, i, 1, 0.94 - 0.5 * k, 0.6 - 0.57 * k, k > 0.6 ? (1 - k) / 0.4 : 1);
      }
      for (let i = 0; i < MAX_SKID; i++) {
        const age = time - skidBorn[i];
        setColor(skids.col, i, 0.008, 0.008, 0.016, age < SKID_LIFE ? 0.55 * (1 - age / SKID_LIFE) : 0);
      }
      smoke.geo.attributes.position.needsUpdate = smoke.geo.attributes.color.needsUpdate = true;
      sparks.geo.attributes.position.needsUpdate = sparks.geo.attributes.color.needsUpdate = true;
      skids.geo.attributes.color.needsUpdate = true;
      const m = shakeMag + speedShake;
      fx.shakeX = m * Math.sin(time * 22 * 6.283); fx.shakeY = m * Math.cos(time * 17 * 6.283);
    },
  };
  return fx;
}
