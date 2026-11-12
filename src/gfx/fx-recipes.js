// The named effects of plan/bible/art/vfx.md, built from fx.smoke, fx.bit, fx.debris and fx.scorch.
// fx.emit(id, x, y, z, opts) → true if it was made (nothing is made more than 120 m from the
// camera, 80 m on low). Steady effects (engine smoke, fire, the geyser, the smoke column) are
// called every step with opts.dt and make "so many a second". Counts are low / high.
import * as THREE from 'three';

const c = new THREE.Color();
const lin = (hex) => { c.set(hex); return [c.r, c.g, c.b]; };
const SMOKE = lin(0x6f6a78), SOOT = lin(0x2b2838), CREAM = lin(0xfff1c9), MANGO = lin(0xffa02e), CORAL = lin(0xff5a5a), ICE = lin(0x9fd2ff),
  WHITE = lin(0xffffff), ROAD = lin(0xb7b0b8);

export function createRecipes(fx, low) {
  const r = () => fx.rnd(), sym = (k = 1) => (fx.rnd() - 0.5) * 2 * k;
  // how many this step, for "n a second": the whole part, and the rest as a chance
  const per = (rate, dt) => { const n = rate * dt, w = Math.floor(n); return w + (r() < n - w ? 1 : 0); };
  const recipes = {
    // row 7: grey smoke from the engine box; dark under 20 health
    'engine-smoke'(x, y, z, o) {
      for (let i = per(low ? 6 : 16, o.dt); i > 0; i--) fx.smoke(x + sym(0.2), y, z + sym(0.2), { vx: (o.vx || 0) * 0.3 + sym(0.3), vy: 2, vz: (o.vz || 0) * 0.3 + sym(0.3),
        s0: 0.4, s1: 1.6, life: 1.6, c0: o.dark ? SOOT : SMOKE, a: o.dark ? 0.9 : 0.75 });
    },
    // row 8: flames rising 1.5 m/s and a 2 m glow
    'engine-fire'(x, y, z, o) {
      for (let i = per(low ? 8 : 24, o.dt); i > 0; i--) fx.smoke(x + sym(0.35), y + r() * 0.2, z + sym(0.35), { vx: (o.vx || 0) * 0.5, vy: 1.5 + r(), vz: (o.vz || 0) * 0.5,
        s0: 0.3 * (o.size || 1), s1: 0.7 * (o.size || 1), life: 0.5, c0: MANGO, c1: CORAL, a: 1, glow: true });
      if (per(6, o.dt)) fx.smoke(x, y + 0.3, z, { vy: 0, s0: 2, s1: 2, life: 0.22, c0: MANGO, a: 0.3, glow: true });
    },
    // the column over a wreck: 1 to 3 m puffs rising 3 m/s
    column(x, y, z, o) {
      for (let i = per(low ? 2 : 7, o.dt); i > 0; i--) fx.smoke(x + sym(0.5), y + 0.5, z + sym(0.5), { vx: sym(0.4), vy: 3, vz: sym(0.4), s0: 1, s1: 3, life: 2.4, c0: SOOT, a: 0.9 });
    },
    // row 9: the flash, the fireball, embers, the ring of dust, the hood and boxes in the car's paint
    explosion(x, y, z, o) {
      fx.smoke(x, y + 1, z, { vy: 0, s0: 6, s1: 6, life: 0.08, c0: WHITE, a: 1, glow: true });
      for (let i = low ? 20 : 60; i > 0; i--) fx.smoke(x + sym(0.6), y + 0.5 + r(), z + sym(0.6), { vx: sym(3), vy: 1 + r() * 4, vz: sym(3), s0: 1, s1: 4, life: 0.4 + r() * 0.25, c0: CREAM, c1: CORAL, a: 1, glow: true });
      for (let i = low ? 40 : 200; i > 0; i--) {
        const a = r() * 6.283, tilt = r() * 0.87, sp = 6 + r() * 8;          // up, inside a 50 degree cone
        fx.bit(x, y + 0.8, z, Math.cos(a) * Math.sin(tilt) * sp, Math.cos(tilt) * sp, Math.sin(a) * Math.sin(tilt) * sp, { life: 1.2 + r() * 1.2, grav: 6, c0: CREAM, c1: MANGO, len: 0.4, w: 0.05 });
      }
      for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; fx.smoke(x, y + 0.3, z, { vx: Math.cos(a) * 12, vy: 0.3, vz: Math.sin(a) * 12, s0: 0.8, s1: 2.2, life: 0.5, c0: ROAD, a: 0.7 }); }
      fx.scorch(x, z, 3, 60);
      const paint = o.paint === undefined ? 0x6f6a78 : o.paint, h = o.hood || [1.2, 0.06, 1.6];
      fx.debris(o.hx === undefined ? x : o.hx, y + 1, o.hz === undefined ? z : o.hz, { sx: h[0], sy: h[1], sz: h[2], color: paint, vx: sym(1.5), vy: 9, vz: sym(1.5), spin: 7, life: 6, onLand: o.onLand });
      for (let i = low ? 4 : 10; i > 0; i--) fx.debris(x + sym(0.8), y + 0.8, z + sym(0.8), { sx: 0.2 + r() * 0.4, sy: 0.08, sz: 0.2 + r() * 0.3, color: i % 3 ? paint : 0x2b2838, vx: sym(6), vy: 4 + r() * 5, vz: sym(6), spin: 9, life: 3.5 });
      fx.shake(0.25);
    },
    // row 10: shards of glass. o: nx, nz the way they fly
    glass(x, y, z, o) {
      for (let i = low ? 12 : 40; i > 0; i--) fx.bit(x + sym(0.2), y + sym(0.15), z + sym(0.2), (o.nx || 0) * 3 + sym(2.5), 1 + r() * 3, (o.nz || 0) * 3 + sym(2.5), { life: 1, c0: ICE, c1: ICE, len: 0.14, w: 0.05 });
    },
    // row 11: what a broken prop throws. o.kind: fence (splinters), palm (two coconuts)
    'prop-bits'(x, y, z, o) {
      if (o.kind === 'palm') {
        for (let i = 0; i < 2; i++) fx.debris(x + sym(0.8), y + 7 + r(), z + sym(0.8), { sx: 0.2, sy: 0.2, sz: 0.2, color: 0x6a4630, vx: sym(1), vy: 0, vz: sym(1), spin: 5, life: 5, onLand: o.onLand });
        return;
      }
      for (let i = low ? 6 : 14; i > 0; i--) fx.debris(x + sym(o.spread || 1), y + 0.3 + r() * 0.8, z + sym(o.spread || 1), { sx: 0.5 + r() * 0.4, sy: 0.05, sz: 0.1, color: o.color === undefined ? 0x8a6f55 : o.color,
        vx: (o.vx || 0) * (0.4 + r() * 0.5) + sym(2), vy: 2 + r() * 4, vz: (o.vz || 0) * (0.4 + r() * 0.5) + sym(2), spin: 10, life: 3 });
    },
    // row 12: the hydrant's jet, 7 m tall, drops falling from the top, mist at the foot. o.k shrinks it (1 to 0)
    geyser(x, y, z, o) {
      const k = o.k === undefined ? 1 : o.k, up = 13 * Math.sqrt(Math.max(0.05, k));
      for (let i = per(low ? 14 : 30, o.dt); i > 0; i--) fx.smoke(x + sym(0.1), y + 0.4, z + sym(0.1), { vx: sym(0.5), vy: up * (0.9 + r() * 0.15), vz: sym(0.5), grav: 12, s0: 0.5, s1: 1.7, life: 1.05, c0: WHITE, c1: ICE, a: 0.85 });
      for (let i = per(low ? 20 : 60, o.dt); i > 0; i--) fx.bit(x + sym(0.4), y + 6.5 * k + r(), z + sym(0.4), sym(2.5), r() * 2, sym(2.5), { life: 1.1, c0: WHITE, c1: ICE, len: 0.25, w: 0.04 });
      for (let i = per(low ? 4 : 10, o.dt); i > 0; i--) fx.smoke(x + sym(1.2), y + 0.2, z + sym(1.2), { vx: sym(1), vy: 0.4, vz: sym(1), s0: 0.8, s1: 2.2, life: 1.2, c0: WHITE, a: 0.35 });
    },
    // row 5: a ring of dust moving outwards
    landing(x, y, z) {
      const n = low ? 8 : 16;
      for (let i = 0; i < n; i++) { const a = i / n * 6.283; fx.smoke(x, y + 0.2, z, { vx: Math.cos(a) * 3, vy: 0.3, vz: Math.sin(a) * 3, s0: 0.5, s1: 1.6, life: 0.5, c0: ROAD, a: 0.6 }); }
    },
  };
  return function emit(id, x, y, z, o = {}) {
    const cam = fx.camera, far = low ? 80 : 120, fn = recipes[id];
    if (!fn || (cam.set && (x - cam.x) * (x - cam.x) + (z - cam.z) * (z - cam.z) > far * far)) return false;
    fn(x, y, z, o);
    return true;
  };
}
