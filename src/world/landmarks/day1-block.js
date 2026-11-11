// The day 1 block and plaza: the hand-written hero lot at the map origin. This is day 1's central
// block, moved to its own file and never regenerated: its random numbers start where day 1's
// stream stood when it reached this block, so every colour, fin and sign is the one day 1 drew.
import { rng } from '../../core/rng.js';
import { createParkedCar } from '../../vehicles/models.js';
import { signUV } from '../../gfx/atlas.js';
import { TRIM, ROOF, BOARD, CURB, PASTEL, detailBuilding, cellBox, wallQuad } from '../gen/kit.js';

// day 1's seed, moved on by the 13,112 numbers it had drawn before this block; and its sign counter
const SEED = (20261111 + Math.imul(13112, 0x6D2B79F5)) >>> 0, SIGN_AT = 17;
const DAY1_SIGNS = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11];
const PARKED = [[-34, 31.4, 1, 0x29b6e6, 0xffffff], [22, 31.4, 1, 0xffc23e, 0x2b2838], [-12, -31.4, -1, 0xf7f3ea, 0xff3fa4],
  [30, -31.4, -1, 0x8a5cff, 0xffd23e], [46.4, 12, 0, 0x3fd68a, 0xffffff]];

let heights = null;      // each cell's height, known once the block has been built
function splitRange(rnd, a, b, min, max) {
  const out = [];
  let s = a;
  while (b - s > max) {
    const w = min + rnd() * (max - min);
    if (b - (s + w) < min) break;
    out.push([s, s + w]); s += w;
  }
  out.push([s, b]);
  return out;
}
// the block's cells: two rows of lots split at z = 0; the same numbers every time
function layout() {
  const rnd = rng(SEED);
  const xs = splitRange(rnd, -41, 41, 13, 19), zs = [[-26, 0], [0, 26]], pi = Math.floor(xs.length / 2), cells = [];
  xs.forEach(([a, b], i) => zs.forEach(([c, d], j) => {
    const sides = { w: i === 0, e: i === xs.length - 1, n: j === 0, s: j === zs.length - 1 };
    cells.push({ i, j, pi, sides, cell: { x0: a + (sides.w ? 0 : 0.1), x1: b - (sides.e ? 0 : 0.1), z0: c + (sides.n ? 0 : 0.1), z1: d - (sides.s ? 0 : 0.1) } });
  }));
  return { rnd, cells };
}

export default {
  id: 'day1-block',
  build(o, lot) {
    const { rnd, cells } = layout(), keep = { rnd: o.rnd, nextSign: o.nextSign };
    let signIdx = SIGN_AT, plaza = null, billboard = null, billboardH = 0;
    o.rnd = rnd; o.nextSign = () => DAY1_SIGNS[signIdx++ % DAY1_SIGNS.length];
    const hs = [];
    for (const { i, j, pi, sides, cell } of cells) {
      if (j === 1 && i === pi) { plaza = cell; hs.push(0); continue; }       // an open plaza instead of a building
      if (j === 1 && i === pi - 1) sides.e = true;
      if (j === 1 && i === pi + 1) sides.w = true;
      if (j === 0 && i === pi) { sides.s = true; billboard = cell; billboardH = detailBuilding(o, cell, 5, sides, false); hs.push(billboardH); continue; }
      hs.push(detailBuilding(o, cell, 2 + Math.floor(rnd() * 4), sides, true));
    }
    heights = hs;
    // the plaza: warm paving, palms, a view through to the big rooftop sign
    o.G.flat(plaza.x0 - 0.1, plaza.x1 + 0.1, plaza.z0, plaza.z1 + 0.5, CURB + 0.012, 0xe9b9a2);
    const px = (plaza.x0 + plaza.x1) / 2, w = plaza.x1 - plaza.x0;
    for (const [ox, oz] of [[-0.3, 6], [0.3, 6], [-0.3, 15], [0.3, 15]]) palm(o, px + ox * w, plaza.z0 + oz, 6 + rnd() * 2);
    o.B.box(px, CURB + 0.3, plaza.z0 + 10.5, 3, 0.6, 3, TRIM, { top: 0x3fb86a });
    o.solid(px - 1.5, px + 1.5, plaza.z0 + 9, plaza.z0 + 12, 0.7);
    // rooftop billboard: the city's name in lights
    {
      const c = billboard, cx = (c.x0 + c.x1) / 2, h = billboardH;
      const board = { x0: cx - 8, x1: cx + 8, z0: c.z1 - 1.6, z1: c.z1 - 1.2 };
      cellBox(o, board, h + 1.6, h + 5.8, BOARD, { bottom: true });
      for (const at of [-6, 0, 6]) o.B.box(cx + at, h + 1, board.z0 + 0.2, 0.3, 1.6, 0.3, 0x2b2838);
      o.S.quad(...wallQuad(board, 's', cx, h + 3.7, 15.6, 3.9, 0.02), 0xffffff, 1, signUV(0));
      o.N.box(cx, h + 5.9, board.z1, 16.4, 0.18, 0.18, 0xff3fa4); o.N.box(cx, h + 1.5, board.z1, 16.4, 0.18, 0.18, 0xff3fa4);
      o.N.box(cx - 8.1, h + 3.7, board.z1, 0.18, 4.4, 0.18, 0x29e6ff); o.N.box(cx + 8.1, h + 3.7, board.z1, 0.18, 4.4, 0.18, 0x29e6ff);
    }
    // lamps and palms take turns along the kerb, as day 1 placed them
    for (let x = -38; x <= 38; x += 19) { o.prop('lamp', x, CURB, 29, 0); o.prop('lamp', x, CURB, -29, Math.PI); }
    for (let x = -28.5; x <= 30; x += 19) {
      if (x < plaza.x0 - 2 || x > plaza.x1 + 2) palm(o, x, 28.6, 7 + rnd() * 3);
      palm(o, x, -28.6, 7 + rnd() * 3);
    }
    for (const z of [-20, 0, 20]) { o.prop('lamp', 44, CURB, z, Math.PI / 2); o.prop('lamp', -44, CURB, z, -Math.PI / 2); }
    for (const z of [-10, 10]) { palm(o, 43.6, z, 7 + rnd() * 3); palm(o, -43.6, z, 7 + rnd() * 3); }
    // day 1's five parked cars keep their places and colours
    for (const [x, z, dir, paint, accent] of PARKED) {
      const m = createParkedCar(paint, accent);
      m.position.set(x, 0, z); m.rotation.y = dir * Math.PI / 2; m.updateMatrix();
      o.object(m);
      if (dir) o.solid(x - 2.25, x + 2.25, z - 0.98, z + 0.98, 1.3); else o.solid(x - 0.98, x + 0.98, z - 2.25, z + 2.25, 1.3);
    }
    o.rnd = keep.rnd; o.nextSign = keep.nextSign;
    void lot;
  },
  // seen from far away: the same cells as plain boxes, the plaza left open
  shell(o) {
    const { cells } = layout();
    for (const [k, { i, j, pi, cell: c }] of cells.entries()) {
      if (j === 1 && i === pi) continue;
      const h = heights ? heights[k] : j === 0 && i === pi ? 20.4 : 13.6;
      o.B.box((c.x0 + c.x1) / 2, h / 2, (c.z0 + c.z1) / 2, c.x1 - c.x0, h, c.z1 - c.z0, PASTEL[(i * 2 + j * 5) % PASTEL.length], { top: ROOF });
    }
  },
};
function palm(o, x, z, height) {
  o.decor('palm', x, CURB, z, x * 5 + z, height / 8.5);
  o.solid(x - 0.3, x + 0.3, z - 0.3, z + 0.3, 1);
}
