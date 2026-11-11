// Car against car: two rotated boxes, a separating-axis test on their four axes, a push apart
// split by inverse mass and an impulse scaled by mass (plan/bible/tech/algorithms.md section 3).
// A body is anything with { x, z, h, vf, vl, w, hw, hl, mass }. No three.js in here.

const hit = { nx: 0, nz: 0, depth: 0, x: 0, z: 0 };

// Do the boxes overlap? Returns the shared `hit` (normal from b towards a, depth, a contact point) or null.
export function overlap(a, b) {
  const dx = a.x - b.x, dz = a.z - b.z, reach = a.hl + a.hw + b.hl + b.hw;
  if (dx * dx + dz * dz > reach * reach) return null;
  const afx = Math.sin(a.h), afz = Math.cos(a.h), bfx = Math.sin(b.h), bfz = Math.cos(b.h);
  let best = Infinity, nx = 0, nz = 0;
  for (let i = 0; i < 4; i++) {
    // forward and right axes of a, then of b
    const ax = i === 0 ? afx : i === 1 ? afz : i === 2 ? bfx : bfz, az = i === 0 ? afz : i === 1 ? -afx : i === 2 ? bfz : -bfx;
    const ra = a.hl * Math.abs(afx * ax + afz * az) + a.hw * Math.abs(afz * ax - afx * az);
    const rb = b.hl * Math.abs(bfx * ax + bfz * az) + b.hw * Math.abs(bfz * ax - bfx * az);
    const d = dx * ax + dz * az, o = ra + rb - Math.abs(d);
    if (o <= 0) return null;
    if (o < best) { best = o; nx = d < 0 ? -ax : ax; nz = d < 0 ? -az : az; hit.x = b.x + nx * (rb - o / 2); hit.z = b.z + nz * (rb - o / 2); }
  }
  hit.nx = nx; hit.nz = nz; hit.depth = best;
  return hit;
}

const worldV = (v, out) => { const fx = Math.sin(v.h), fz = Math.cos(v.h); out.x = fx * v.vf + fz * v.vl; out.z = fz * v.vf - fx * v.vl; };
const setV = (v, vx, vz) => { const fx = Math.sin(v.h), fz = Math.cos(v.h); v.vf = vx * fx + vz * fz; v.vl = vx * fz - vz * fx; };
const va = { x: 0, z: 0 }, vb = { x: 0, z: 0 };

// How fast the two are closing along the normal (m/s, 0 if they are parting), and the change of
// speed the hit would give b if b were free to move.
export function closing(a, b, h) {
  worldV(a, va); worldV(b, vb);
  const rel = (va.x - vb.x) * h.nx + (va.z - vb.z) * h.nz;
  if (rel >= 0) return { speed: 0, dvB: 0 };
  return { speed: -rel, dvB: (1.25 * -rel / (1 / a.mass + 1 / b.mass)) / b.mass };
}

// Push the two apart and trade momentum. fixedB: b stands its ground (a parked car that was only
// nudged, a traffic car that stays in its lane) and a takes the whole push.
export function resolve(a, b, h, fixedB = false) {
  const ia = 1 / a.mass, ib = fixedB ? 0 : 1 / b.mass, sum = ia + ib;
  a.x += h.nx * h.depth * ia / sum; a.z += h.nz * h.depth * ia / sum;
  b.x -= h.nx * h.depth * ib / sum; b.z -= h.nz * h.depth * ib / sum;
  worldV(a, va); worldV(b, vb);
  const rel = (va.x - vb.x) * h.nx + (va.z - vb.z) * h.nz;
  if (rel >= 0) return 0;
  const j = -1.25 * rel / sum;                                  // restitution 0.25
  setV(a, va.x + j * h.nx * ia, va.z + j * h.nz * ia);
  // a little yaw from off-centre hits
  const ra = (h.x - a.x) * h.nz - (h.z - a.z) * h.nx;
  a.w -= j * ra / (a.mass * (a.hw * a.hw + a.hl * a.hl) / 3) * 0.5;
  if (!fixedB) {
    setV(b, vb.x - j * h.nx * ib, vb.z - j * h.nz * ib);
    const rb = (h.x - b.x) * h.nz - (h.z - b.z) * h.nx;
    b.w += j * rb / (b.mass * (b.hw * b.hw + b.hl * b.hl) / 3) * 0.5;
  }
  return -rel;
}

// A loose car against the static world: two circles along its length pushed out of the collision
// hash, losing the speed that went into the wall. Returns the speed lost (m/s).
const circle = { x: 0, z: 0, r: 1, level: 0 };
export function bumpWorld(v, collide) {
  const fx = Math.sin(v.h), fz = Math.cos(v.h), off = v.hl - v.hw;
  let lost = 0;
  for (const s of [off, -off]) {
    circle.x = v.x + fx * s; circle.z = v.z + fz * s; circle.r = v.hw + 0.1;
    const c = collide.pushOutCircle(circle);
    if (!c) continue;
    v.x = circle.x - fx * s; v.z = circle.z - fz * s;
    worldV(v, va);
    const vn = va.x * c.nx + va.z * c.nz;
    if (vn < 0) { setV(v, (va.x - c.nx * vn * 1.05) * 0.97, (va.z - c.nz * vn * 1.05) * 0.97); v.w *= 0.6; lost = Math.max(lost, -vn); }
  }
  return lost;
}
