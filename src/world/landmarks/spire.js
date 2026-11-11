// The Meridian Spire at (52, -900): 260 m, a twisting taper with a light on top, at the end of
// Coral Boulevard. Parts from plan/bible/world/meridian.md: a 60 x 60 podium, a shaft of 22 boxes
// each 10 m tall and turned 4 degrees more than the one below, shrinking from 40 m to 16 m, a dark
// band at every joint, a penthouse, a lantern at 244 m and a mast to 260 m.
import { TRIM, CURB, wallQuad, windows, signBoard, cellBox } from '../gen/kit.js';
import { drawTiers, tierWalls, plainBox } from '../gen/towers.js';

const X = 52, Z = -900, GLASS = 0xb8cfe0, BAND = 0x2e4a6b, PAVE = 0xe0e0e6, LAWN = 0x3fb86a, PINK = 0xff3fa4;
const sq = (s, y0, y1, col, more) => ({ x0: X - s / 2, x1: X + s / 2, z0: Z - s / 2, z1: Z + s / 2, y0, y1, col, ...more });

export const SPIRE = { x: X, z: Z, top: 260, lantern: 248 };
let cache = null;
export function spireTiers() {
  if (cache) return cache;
  const tiers = [sq(60, 0, 12, PAVE, { plain: true, top: 0xc8ccd2 })], bands = [];
  for (let i = 0; i < 22; i++) {
    const s = 40 - 24 * (i / 21), y = 12 + 10 * i, rot = (i * 4 * Math.PI) / 180;
    const band = sq(s + 0.5, y, y + 0.7, BAND, { plain: true, rot, noRoof: true });
    bands.push(band); tiers.push(band, sq(s, y + 0.7, y + 10, GLASS, { rot }));
  }
  tiers.push(sq(14, 232, 244, 0xfdf6ea, { rot: (88 * Math.PI) / 180 }));           // the penthouse, holding the vault
  tiers.push(sq(8, 244, 252, 0xffd9ec, { plain: true, top: PINK }));               // the lantern
  tiers.push(sq(1.2, 252, 260, 0xfdf6ea, { plain: true, top: PINK }));             // the mast
  return (cache = { tiers, bands });
}

export default {
  id: 'spire', skyline: true,
  build(o, lot) {
    const { tiers, bands } = spireTiers(), pod = { x0: X - 30, x1: X + 30, z0: Z - 30, z1: Z + 30 };
    o.G.flat(lot.x0, lot.x1, lot.z0, lot.z1, CURB + 0.012, PAVE);
    o.G.flat(37, 67, lot.z1, -844, CURB + 0.012, PAVE);                            // the plaza steps down to Spire Circle
    drawTiers(o, tiers);
    // night: every joint band white
    for (const b of bands) for (const run of tierWalls(b, -0.06)) {
      const [p, q] = run; o.L.quad([p[0], b.y0, p[1]], [q[0], b.y0, q[1]], [q[0], b.y1, q[1]], [p[0], b.y1, p[1]], 0xffffff, 0.8);
    }
    o.N.box(X, 248, Z, 8.3, 7.6, 8.3, 0xffd9ec); o.N.box(X, 260.4, Z, 1.6, 1.6, 1.6, PINK);
    // the podium at street level: a glass lobby on every side, the name over the south doors
    for (const side of ['s', 'n', 'e', 'w']) windows(o, pod, side, 0.6, 5.4, 6, 4.8, 5.2, 4.4, 0.05, 0.9);
    cellBox(o, { x0: X - 7, x1: X + 7, z0: pod.z1, z1: pod.z1 + 5 }, 5.6, 6.0, TRIM, { bottom: true });
    signBoard(o, pod, 's', 18, 8.4);
    o.solid(pod.x0, pod.x1, pod.z0, pod.z1, 12);
    // the service dock on Tower Way: a ramp mouth 12 x 6 into the basement
    o.B.box(X, CURB + 2.6, -981, 13, 0.6, 7, TRIM, { bottom: true });
    for (const dx of [-6.25, 6.25]) o.B.box(X + dx, CURB + 1.3, -981, 0.5, 2.6, 7, TRIM);
    o.B.quad(...wallQuad({ x0: X - 6, x1: X + 6, z0: -984.4, z1: -977.6 }, 's', X, CURB + 1.2, 12, 2.3, -6.6), 0x1a1826);
    o.B.flat(X - 6, X + 6, -984.4, -977.6, CURB + 0.03, 0x2b2838);
    o.solid(X - 6.5, X - 6, -984.5, -977.5, 3); o.solid(X + 6, X + 6.5, -984.5, -977.5, 3);
    // scaffold on the north face from 12 to 28 m
    if (!o.low) {
      const z = Z - 21.5;
      for (let i = -3; i <= 3; i++) o.B.box(X + i * 5, 20, z, 0.18, 16, 0.18, 0xc8ccd2);
      for (let y = 14; y <= 28; y += 3.5) o.B.box(X, y, z, 30.4, 0.14, 1.2, 0x8a6f55, { bottom: true });
    }
    // 24 palms round the plaza, and a half ring of eight on a lawn where the boulevard stops
    for (let i = 0; i < 12; i++) for (const z of [lot.z0 + 5, lot.z1 - 5]) {
      const x = lot.x0 + 8 + i * 14;
      if (Math.abs(x - X) < 20 && z > Z) continue;
      o.decor('palm', x, CURB, z, x + z, 1.05); o.solid(x - 0.3, x + 0.3, z - 0.3, z + 0.3, 1);
    }
    for (let i = 0; i < 16; i++) {
      const a0 = Math.PI + (i / 16) * Math.PI, a1 = Math.PI + ((i + 1) / 16) * Math.PI, c = [X, CURB + 0.03, -848];
      o.G.tri(c, [X + Math.cos(a0) * 14, c[1], -848 + Math.sin(a0) * 14], [X + Math.cos(a1) * 14, c[1], -848 + Math.sin(a1) * 14], LAWN);
    }
    for (let i = 0; i < 8; i++) {
      const a = Math.PI + ((i + 0.5) / 8) * Math.PI, x = X + Math.cos(a) * 11, z = -848 + Math.sin(a) * 11;
      o.decor('palm', x, CURB, z, i * 2.1, 1.1); o.solid(x - 0.3, x + 0.3, z - 0.3, z + 0.3, 1);
    }
    for (const dx of [-36, 36]) for (const z of [-862, -938]) o.prop('lamp', X + dx, CURB, z, dx > 0 ? Math.PI / 2 : -Math.PI / 2);
  },
  // the far shell and the skyline: the same tiers, all in the window mesh
  shell(o, lot, opts = {}) {
    drawTiers({ W: o.W }, spireTiers().tiers, { cell: 6, cut: false, inset: opts.inset || 0 });
    if (!opts.inset) plainBox(o.W, (lot.x0 + lot.x1) / 2, CURB + 0.02, (lot.z0 + lot.z1) / 2, lot.x1 - lot.x0, 0.04, lot.z1 - lot.z0, PAVE);
  },
};
