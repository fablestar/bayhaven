// The debris family: boxes with spin and bounce, one instanced mesh, one draw call. Panels that
// fall off cars, fence splinters, cafe furniture, coconuts, the hood of a car that blew up.
// Pooled: at most `cap` alive (40, 80 and 120 on low, medium and high); the oldest is used again.
import * as THREE from 'three';

const MOST = 120, GRAVITY = 12;

export function createDebris(scene, heightAt, cap) {
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial(), MOST);
  mesh.frustumCulled = false; mesh.count = 0; mesh.matrixAutoUpdate = false;
  scene.add(mesh);
  const pieces = [];
  for (let i = 0; i < MOST; i++) pieces.push({ life: 0, i });
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), pos = new THREE.Vector3(), scl = new THREE.Vector3(), axis = new THREE.Vector3();
  const col = new THREE.Color(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
  let next = 0, top = 0, dirty = false, peak = 0;
  for (let i = 0; i < MOST; i++) { mesh.setMatrixAt(i, zero); mesh.setColorAt(i, col.set(0xffffff)); }
  cap = Math.max(1, Math.min(MOST, cap));

  return {
    pieces,
    get cap() { return cap; },
    get peak() { return peak; },
    setCap(n) {
      cap = Math.max(1, Math.min(MOST, n));
      for (let i = cap; i < MOST; i++) if (pieces[i].life > 0) { pieces[i].life = 0; mesh.setMatrixAt(i, zero); dirty = true; }
      if (next >= cap) next = 0;
    },
    // o: { sx sy sz (metres), color (hex), vx vy vz, spin (rad/s), life (seconds), onLand(piece, speed) }
    add(x, y, z, o = {}) {
      const p = pieces[next]; next = (next + 1) % cap;
      p.x = x; p.y = y; p.z = z; p.vx = o.vx || 0; p.vy = o.vy || 0; p.vz = o.vz || 0;
      p.sx = o.sx || 0.2; p.sy = o.sy || 0.2; p.sz = o.sz || 0.2; p.half = Math.min(p.sx, p.sy, p.sz) / 2;
      p.spin = o.spin === undefined ? 6 : o.spin; p.ang = o.ang || 0;
      const a = (p.i * 2.399) % 6.283;                       // each slot spins about its own axis
      p.ax = Math.cos(a) * 0.8; p.ay = 0.45; p.az = Math.sin(a) * 0.8;
      p.life = p.max = o.life || 3; p.onLand = o.onLand || null; p.landed = false;
      mesh.setColorAt(p.i, col.set(o.color === undefined ? 0x8a6f55 : o.color)); mesh.instanceColor.needsUpdate = true;
      top = Math.max(top, p.i + 1); mesh.count = top;
      return p;
    },
    count() { let n = 0; for (let i = 0; i < top; i++) if (pieces[i].life > 0) n++; peak = Math.max(peak, n); return n; },
    step(dt) {
      let alive = 0;
      for (let i = 0; i < top; i++) {
        const p = pieces[i];
        if (p.life <= 0) continue;
        p.life -= dt; alive++;
        p.vy -= GRAVITY * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.ang += p.spin * dt;
        const floor = heightAt(p.x, p.z) + p.half;
        if (p.y < floor) {
          p.y = floor;
          if (p.onLand && !p.landed) p.onLand(p, -p.vy);
          p.landed = true;
          p.vy = p.vy < -1.5 ? -p.vy * 0.35 : 0;
          const f = Math.max(0, 1 - 4 * dt); p.vx *= f; p.vz *= f; p.spin *= Math.max(0, 1 - 6 * dt);
        }
      }
      if (alive > peak) peak = alive;
    },
    draw() {
      for (let i = 0; i < top; i++) {
        const p = pieces[i];
        if (p.life <= 0) { if (p.shown) { p.shown = false; mesh.setMatrixAt(i, zero); dirty = true; } continue; }
        const k = Math.min(1, p.life / 0.5);                 // shrinks away over its last half second
        q.setFromAxisAngle(axis.set(p.ax, p.ay, p.az).normalize(), p.ang);
        m4.compose(pos.set(p.x, p.y, p.z), q, scl.set(p.sx * k, p.sy * k, p.sz * k));
        mesh.setMatrixAt(i, m4); p.shown = true; dirty = true;
      }
      if (dirty) { mesh.instanceMatrix.needsUpdate = true; dirty = false; }
    },
  };
}
