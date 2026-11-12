// One of the four gantry cranes over the container ship (plan/bible/world/rustwater.md). Four
// yellow legs 2 x 2 x 56: a landside pair at x = 2900 and a waterside pair at x = 3012, 24 m apart
// along z, each pair joined by a sill beam at 14 m. A boom 200 x 4 x 6 on top, from x = 2885 out
// over the water to x = 3085. An A-frame to 70 m over the waterside legs, a trolley with a cab
// under the boom, a spreader on four cables. Breakwater Road runs between the legs: nothing here
// is lower than 14 m between x = 2921 and x = 2943. The port is the four cranes: they are in the skyline.
import { CURB } from '../gen/kit.js';
import { penB, penW } from '../gen/streets.js';

const YELLOW = 0xffc300, INK = 0x24212b, STEEL = 0x5b5660, LAND = 2900, WATER = 3012, X0 = 2885, X1 = 3085;
export const stats = { cranes: 0, top: 70, tops: {}, lowestOverRoad: 14 };

// the shape, the same at every distance: p is a pen (penB close up, penW far away)
function frame(p, zc, i) {
  for (const x of [LAND, WATER]) {
    for (const dz of [-12, 12]) p.box(x, 28 + i, zc + dz, 2 - i, 56 - i, 2 - i, YELLOW);
    p.box(x, 15, zc, 1.6 - i, 2, 22, YELLOW);                               // the sill beam, its underside at 14 m
    p.box(x, 54, zc, 1.6 - i, 2.4, 22, YELLOW);
  }
  for (const dz of [-12, 12]) p.box((LAND + WATER) / 2, 53.5, zc + dz, WATER - LAND - 2, 2.4, 1.4 - i, YELLOW);   // portal beams, far over the road
  p.box((X0 + X1) / 2, 59, zc, X1 - X0, 6 - i, 4 - i, YELLOW);                                                     // the boom
  for (const s of [-1, 1]) p.box(WATER + s * 9, 66, zc, 1.6, 8, 1.6, YELLOW, { shift: [-s * 9, 0] });              // the A-frame, to 70 m
  p.box(WATER, 62.6, zc, 22, 1.2, 5, STEEL);                                                                        // the machinery house
}

export default {
  id: 'gantry-crane', skyline: true, stats,
  build(o, lot) {
    const zc = lot.zc, B = o.B, tx = 3046 + (lot.n % 2) * 12;        // where this crane's trolley stands today
    stats.cranes++; stats.tops[lot.n] = 70;
    frame(penB(o), zc, 0);
    // black hazard stripes on the lowest 4 m of each leg
    for (const x of [LAND, WATER]) for (const dz of [-12, 12]) {
      for (const y of [0.9, 2.7]) B.box(x, CURB + y, zc + dz, 2.08, 0.9, 2.08, INK, { noTop: true });
      o.solid(x - 1.1, x + 1.1, zc + dz - 1.1, zc + dz + 1.1, 56);
    }
    // stays from the top of the A-frame to both ends of the boom
    for (const [xe, ye] of [[X0 + 4, 62], [X1 - 4, 62]]) {
      const t = 0.3, a = xe < WATER ? [xe, ye] : [WATER, 69.6], b = xe < WATER ? [WATER, 69.6] : [xe, ye];
      B.hexa([[a[0], a[1] - t, zc - t], [b[0], b[1] - t, zc - t], [b[0], b[1] - t, zc + t], [a[0], a[1] - t, zc + t],
        [a[0], a[1] + t, zc - t], [b[0], b[1] + t, zc - t], [b[0], b[1] + t, zc + t], [a[0], a[1] + t, zc + t]], STEEL, { bottom: true });
    }
    // the trolley 6 x 6 x 3 with its cab, four cables and the spreader holding one box
    B.box(tx, 54.5, zc, 6, 3, 6, STEEL, { bottom: true });
    B.box(tx - 4.5, 53.4, zc, 3, 2.6, 3, 0xe0e0e6, { bottom: true });
    B.quad([tx - 6.02, 52.6, zc - 1.2], [tx - 6.02, 52.6, zc + 1.2], [tx - 6.02, 54.2, zc + 1.2], [tx - 6.02, 54.2, zc - 1.2], 0x2e4a6b);
    if (!o.low) for (const dx of [-2.5, 2.5]) for (const dz of [-5, 5]) B.box(tx + dx, 43.5, zc + dz, 0.12, 19, 0.12, INK, { noTop: true });
    B.box(tx, 33.6, zc, 3, 0.8, 12.6, YELLOW, { bottom: true });
    B.box(tx, 31.9, zc, 2.6, 2.6, 12.2, [0xb5532f, 0x2e4a6b, 0x3d6b4a, 0xbf4343][lot.n - 1], { bottom: true });
    // night: floodlights along the boom, a red light on the A-frame
    for (let x = X0 + 10; x < X1; x += o.low ? 45 : 22.5) { o.N.box(x, 55.8, zc, 1.4, 0.3, 1.4, 0xfff2cc); o.L.flat(x - 9, x + 9, zc - 9, zc + 9, x > 3024 ? 24.6 : CURB + 0.08, 0xff9a3c, 0.12); }
    o.N.box(WATER, 70.3, zc, 0.9, 0.9, 0.9, 0xff5a5a);
  },
  shell(o, lot, { inset = 0 } = {}) { frame(penW(o), lot.zc, inset ? 0.3 : 0); },
};
