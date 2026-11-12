// The cruise terminal and the cruise ship Early Supper (plan/bible/world/rustwater.md). The hall is
// 120 x 40 x 12, x 2440 to 2560, z 70 to 110, under a wave canopy of three tapered boxes, with
// twelve flagpoles in front and two gangways at 8 m to the ship. The ship lies along the south
// quay, x 2360 to 2640, z 134 to 170: a white hull 18 m high, six decks of 3 m stepping in, a pink
// funnel to 52 m and a row of orange lifeboats. Until the calendar is built she is always in port.
import { windows } from '../gen/kit.js';
import { penB, penW } from '../gen/streets.js';

const HALL = { x0: 2440, x1: 2560, z0: 70, z1: 110 }, WHITE = 0xe0e0e6, HULL = 0xf7f3ea, WAVE = 0x29b6e6, PINK = 0xff9eb5, BOAT = 0xffa02e, SX = 2500, SZ = 152;
export const stats = { decks: 6, flagpoles: 0, lifeboats: 0, top: 52 };

function shapes(p, i) {
  p.box(SX, 7.5, SZ, 280 - i, 21 - i, 36 - i, HULL, { taper: [1, 1], top: 0xd8d2c4 });              // the hull, from under the water to 18 m
  for (let k = 0; k < 6; k++) p.box(SX - 6 - k * 3, 19.5 + k * 3, SZ, 236 - k * 22 - i, 3, 30 - k * 2.4 - i, HULL, { top: 0xd8d2c4 });
  p.box(SX - 30, 38, SZ, 16 - i, 4, 10 - i, HULL);
  p.box(SX - 30, 46, SZ, 10 - i, 12, 8 - i, PINK, { shift: [-2, 0] });                               // the funnel, to 52 m
  p.box(2500, 6, 90, 120 - i, 12 - i, 40 - i, WHITE, { top: 0xc8ccd2 });                             // the hall
}

export default {
  id: 'cruise-terminal', skyline: true, stats,
  build(o) {
    const B = o.B;
    shapes(penB(o), 0);
    // the hall: glass along the road side, the wave canopy, the gangways
    windows(o, HALL, 'n', 0.6, 8.6, 8, 8, 6.6, 6.4, 0.06, 0.7);
    for (let k = 0; k < 3; k++) B.box(2460 + k * 40, 13.4 + (k % 2) * 0.8, 88, 42, 2, 46, WAVE, { taper: [0.9, 0.8], shift: [k % 2 ? -3 : 3, 0], bottom: true });
    for (const x of [2470, 2530]) { B.box(x, 9.5, 122, 3, 3, 24, WHITE, { bottom: true }); for (const z of [114, 128]) B.box(x, 4, z, 0.5, 8, 0.5, 0x9aa3ad, { noTop: true }); }
    // twelve flagpoles in front, flags in three colours
    for (let k = 0; k < 12; k++) {
      const x = 2445 + k * 10;
      B.box(x, 5, 62, 0.16, 10, 0.16, 0xc8ccd2); stats.flagpoles++;
      if (!o.low) B.box(x + 0.9, 9.2, 62, 1.6, 1, 0.05, [WAVE, PINK, 0xfff1c9][k % 3], { bottom: true });
    }
    // the cruise lot: bay lines west of the hall, coach bays in front
    for (let x = 2312; x < 2430; x += o.low ? 10.8 : 5.4) for (const z of [72, 96]) o.M.flat(x - 0.06, x + 0.06, z, z + 10.8, 0.03, 0xf4efe6);
    // the ship: a blue line at the water, dark window bands a deck, bulbs from bow to stern, lifeboats
    B.box(SX, 0.4, SZ, 280.3, 1.6, 36.3, WAVE, { noTop: true });
    for (let k = 0; k < 6; k++) {
      const cx = SX - 6 - k * 3, w = 236 - k * 22 - 8, y = 19.2 + k * 3, hz = (30 - k * 2.4) / 2 + 0.04;
      for (const s of [-1, 1]) {
        const z = SZ + s * hz, q = s < 0 ? [[cx + w / 2, y, z], [cx - w / 2, y, z], [cx - w / 2, y + 1.3, z], [cx + w / 2, y + 1.3, z]] : [[cx - w / 2, y, z], [cx + w / 2, y, z], [cx + w / 2, y + 1.3, z], [cx - w / 2, y + 1.3, z]];
        B.quad(...q, 0x2e4a6b);
        if (s < 0 || !o.low) o.L.quad(...q.map(([x, yy, zz]) => [x, yy, zz + s * 0.03]), 0xffd58a, 0.35);
      }
    }
    for (let k = 0; k < (o.low ? 6 : 12); k++) for (const s of [-1, 1]) { B.box(2400 + k * (o.low ? 32 : 16), 19.6, SZ + s * 17.2, 7, 1.8, 2, BOAT, { taper: [0.8, 0.7], bottom: true }); stats.lifeboats++; }
    for (let x = 2366; x < 2640; x += o.low ? 24 : 8) o.N.box(x, 18.5, SZ - 18.1, 0.5, 0.5, 0.5, 0xfff2cc);
    o.N.box(SX - 31, 52.3, SZ, 1, 0.6, 1, 0xff5a5a);
    o.solid(HALL.x0, HALL.x1, HALL.z0, HALL.z1, 12);
    o.solid(2360, 2640, 134, 170, 18);
    for (const x of [2470, 2530]) for (const z of [114, 128]) o.solid(x - 0.4, x + 0.4, z - 0.4, z + 0.4, 8);
  },
  shell(o, lot, { inset = 0 } = {}) { shapes(penW(o), inset ? 0.4 : 0); },
};
