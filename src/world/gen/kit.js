// The box grammar shared by every district kit (plan/bible/art/kits.md): day 1's building code,
// moved here so the hero lot and the kit recipes draw with the same hands. Every function takes
// `o`, the place a chunk is being built into:
//   o.G ground  o.M road paint  o.B solids  o.N neon  o.S signs  o.L lit windows  (MeshBuilders)
//   o.rnd seeded random  o.low phone detail  o.solid(x0, x1, z0, z1, h) collider  o.prop(kind, x, y, z, rot, opts)
//   o.decor(kind, x, y, z, rot, scale) instanced palms, umbrellas, benches
import { signUV, SHOP_SIGNS } from '../../gfx/atlas.js';

export const PASTEL = [0xff9eb5, 0x8fe3cf, 0xffc98f, 0x9fd2ff, 0xfff1c9, 0xc9a8ff, 0xff8f7a, 0x7fd6e8, 0xf7f3ea];
export const NEON = [0xff3fa4, 0x29e6ff, 0xb46bff, 0xffa02e, 0x5dff9b, 0xff5a5a];
export const TRIM = 0xfdf6ea, ROOF = 0x6f6a78, GLASS = 0x2e4a6b, CURB = 0.14, BOARD = 0x140c2c;
export const pick = (o, arr) => arr[Math.floor(o.rnd() * arr.length)];

// A rectangle on one wall of a box-shaped cell, facing outwards.
// side: n (-z), s (+z), w (-x), e (+x). u = where along the wall, e = how far it sticks out.
export function wallQuad(c, side, u, y, w, h, e) {
  const a = u - w / 2, b = u + w / 2, y0 = y - h / 2, y1 = y + h / 2;
  if (side === 's') { const z = c.z1 + e; return [[a, y0, z], [b, y0, z], [b, y1, z], [a, y1, z]]; }
  if (side === 'n') { const z = c.z0 - e; return [[b, y0, z], [a, y0, z], [a, y1, z], [b, y1, z]]; }
  if (side === 'e') { const x = c.x1 + e; return [[x, y0, b], [x, y0, a], [x, y1, a], [x, y1, b]]; }
  const x = c.x0 - e; return [[x, y0, a], [x, y0, b], [x, y1, b], [x, y1, a]];
}
export const span = (c, side) => ((side === 'n' || side === 's') ? [c.x0, c.x1] : [c.z0, c.z1]);

export function windows(o, c, side, y0, y1, cellW, cellH, ww, wh, e, litChance) {
  const [a, b] = span(c, side), rnd = o.rnd;
  const cols = Math.floor((b - a - 1) / cellW);
  const rows = Math.floor((y1 - y0) / cellH + 0.01);
  if (cols < 1 || rows < 1) return;
  const step = (b - a) / cols;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const u = a + (i + 0.5) * step, y = y0 + (j + 0.5) * cellH;
    o.B.quad(...wallQuad(c, side, u, y, ww, wh, e), GLASS, 0.8 + rnd() * 0.4);
    if (rnd() < litChance) {
      const r = rnd(), col = r < 0.75 ? 0xffd58a : r < 0.9 ? 0x8fe8ff : 0xff8fd0;
      o.L.quad(...wallQuad(c, side, u, y, ww, wh, e + 0.03), col, 0.45 + rnd() * 0.55);
    }
  }
}
// the phone version of upper windows: one ribbon of glass a floor, and now and then a lit one
export function ribbons(o, c, side, y0, y1, cellH, wh, e, litChance) {
  const [a, b] = span(c, side), rows = Math.floor((y1 - y0) / cellH + 0.01), u = (a + b) / 2, w = b - a - 2.4;
  for (let j = 0; j < rows; j++) {
    const y = y0 + (j + 0.5) * cellH;
    o.B.quad(...wallQuad(c, side, u, y, w, wh, e), GLASS, 0.85 + o.rnd() * 0.3);
    if (o.rnd() < litChance) o.L.quad(...wallQuad(c, side, a + 2 + o.rnd() * (b - a - 4), y, 1.9, wh, e + 0.03), o.rnd() < 0.75 ? 0xffd58a : 0x8fe8ff, 0.45 + o.rnd() * 0.55);
  }
}

// A neon tube running along the whole wall at height y.
export function neonStrip(o, c, side, y, color, out = 0.2) {
  const w = c.x1 - c.x0, d = c.z1 - c.z0, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2;
  if (side === 's') o.N.box(cx, y, c.z1 + out, w + 0.4, 0.16, 0.12, color);
  else if (side === 'n') o.N.box(cx, y, c.z0 - out, w + 0.4, 0.16, 0.12, color);
  else if (side === 'e') o.N.box(c.x1 + out, y, cz, 0.12, 0.16, d + 0.4, color);
  else o.N.box(c.x0 - out, y, cz, 0.12, 0.16, d + 0.4, color);
}

// A thin slab sticking out of a wall (sign boards, fins). Returns its cell.
export function wallSlab(c, side, u, halfW, depth) {
  if (side === 's') return { x0: u - halfW, x1: u + halfW, z0: c.z1, z1: c.z1 + depth };
  if (side === 'n') return { x0: u - halfW, x1: u + halfW, z0: c.z0 - depth, z1: c.z0 };
  if (side === 'e') return { x0: c.x1, x1: c.x1 + depth, z0: u - halfW, z1: u + halfW };
  return { x0: c.x0 - depth, x1: c.x0, z0: u - halfW, z1: u + halfW };
}
export function cellBox(o, c, y0, y1, color, opts) {
  o.B.box((c.x0 + c.x1) / 2, (y0 + y1) / 2, (c.z0 + c.z1) / 2, c.x1 - c.x0, y1 - y0, c.z1 - c.z0, color, opts);
}
// a sign board on a wall; index is a cell of the sign atlas
export function signBoard(o, c, side, index, y = 4.9) {
  const [a, b] = span(c, side);
  const u = (a + b) / 2;
  const slab = wallSlab(c, side, u, 3.3, 0.45);
  cellBox(o, slab, y - 0.9, y + 0.9, BOARD);
  o.S.quad(...wallQuad(slab, side, u, y, 6.4, 1.6, 0.02), 0xffffff, 1, signUV(index));
}
export const shopSign = (o, c, side) => signBoard(o, c, side, o.nextSign ? o.nextSign() : SHOP_SIGNS[Math.floor(o.rnd() * SHOP_SIGNS.length)]);

// A street-level building you drive right past: shopfront, windows, neon, art-deco trim.
// Day 1's detailBuilding. opt.col fixes the wall colour (kit lots decide it in the map); opt.lit is
// the share of upper windows lit; opt.plain drops the small parts (phones).
export function detailBuilding(o, c, floors, sides, wantSign, opt = {}) {
  const rnd = o.rnd, h = 3.6 + floors * 3.2 + 0.8;
  const col = opt.col !== undefined ? opt.col : pick(o, PASTEL), neon = pick(o, NEON);
  const cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2, w = c.x1 - c.x0, d = c.z1 - c.z0;
  o.B.box(cx, h / 2, cz, w, h, d, col, { top: ROOF });
  o.B.box(cx, 1.75, cz, w + 0.3, 3.5, d + 0.3, pick(o, [TRIM, 0x2f2b40, 0x3d7f8f, 0xe86a8a, TRIM]), { top: TRIM });
  if (!opt.plain) for (let k = 1; k <= floors; k++) o.B.box(cx, 3.6 + k * 3.2, cz, w + 0.5, 0.14, d + 0.5, TRIM);
  o.B.box(cx, h + 0.2, cz, w + 0.4, 0.5, d + 0.4, TRIM, { top: ROOF });
  // roof clutter
  for (let k = 0; k < 2; k++) if (rnd() < 0.7) {
    const bx = cx + (rnd() - 0.5) * (w - 5), bz = cz + (rnd() - 0.5) * (d - 5), sx = 2 + rnd() * 1.5, sz = 1.6 + rnd();
    if (!opt.plain) o.B.box(bx, h + 0.95, bz, sx, 1, sz, 0xb7b0b8);
  }
  let first = true;
  for (const side of ['s', 'n', 'e', 'w']) {
    if (!sides[side]) continue;
    windows(o, c, side, 0.5, 3.1, 4.2, 2.6, 3.4, 2.2, 0.19, 0.75);          // shopfront glass
    if (opt.plain) ribbons(o, c, side, 3.6, h - 0.3, 3.2, 1.6, 0.04, opt.lit ?? 0.45);
    else windows(o, c, side, 3.6, h - 0.3, 3.2, 3.2, 1.9, 1.6, 0.04, opt.lit ?? 0.45);   // floors above
    neonStrip(o, c, side, 3.62, neon);
    if (first && rnd() < 0.4) { // an art-deco fin up the front, with a neon tube on it
      const [a, b] = span(c, side);
      const u = a + (b - a) * (0.3 + rnd() * 0.4);
      const fin = wallSlab(c, side, u, 1.1, 0.7);
      cellBox(o, fin, 3.5, h + 2.6, TRIM);
      const tube = wallSlab(fin, side, u, 0.1, 0.1);
      o.N.box((tube.x0 + tube.x1) / 2, (h + 6.4) / 2, (tube.z0 + tube.z1) / 2, tube.x1 - tube.x0, h - 1.6, tube.z1 - tube.z0, neon);
    } else if (first && wantSign) shopSign(o, c, side);
    else if (wantSign && rnd() < 0.35) shopSign(o, c, side);
    first = false;
  }
  o.solid(c.x0 - 0.15, c.x1 + 0.15, c.z0 - 0.15, c.z1 + 0.15, h);
  return h;
}

// a raised sidewalk slab with a kerb
export function slab(o, x0, x1, z0, z1) {
  o.G.box((x0 + x1) / 2, CURB / 2, (z0 + z1) / 2, x1 - x0, CURB, z1 - z0, 0x9c948f, { top: 0xd6cdc4 });
}

// Striped barrier across a street where today's map ends: day 1's. The middle, with the sign,
// stays put; the striped sections either side are props you can knock over.
export function barrier(o, x, z, alongX, len, face) {
  const sections = Math.floor((len / 2 - 3.6) / 2.4), half = len / 2 - sections * 2.4;
  const n = Math.round(half * 2 / 1.2), seg = half * 2 / n;
  for (let i = 0; i < n; i++) {
    const at = -half + (i + 0.5) * seg, col = i % 2 ? 0xffffff : 0xff7a1e;
    for (const y of [0.55, 1.05]) {
      if (alongX) o.B.box(x + at, y, z, seg, 0.3, 0.14, col, { bottom: true });
      else o.B.box(x, y, z + at, 0.14, 0.3, seg, col, { bottom: true });
    }
    if (i % 3 === 0) {
      if (alongX) o.B.box(x + at, 0.6, z, 0.12, 1.2, 0.5, 0x3a3844); else o.B.box(x, 0.6, z + at, 0.5, 1.2, 0.12, 0x3a3844);
    }
  }
  for (const side of [-1, 1]) for (let i = 0; i < sections; i++) {
    const at = side * (half + 1.2 + i * 2.4);
    o.prop('barrier', alongX ? x + at : x, 0, alongX ? z : z + at, alongX ? 0 : Math.PI / 2);
  }
  const c = alongX ? { x0: x - 3.3, x1: x + 3.3, z0: z - 0.12, z1: z + 0.12 } : { x0: x - 0.12, x1: x + 0.12, z0: z - 3.3, z1: z + 3.3 };
  cellBox(o, c, 1.4, 3.1, BOARD);
  o.S.quad(...wallQuad(c, face, alongX ? x : z, 2.25, 6.4, 1.6, 0.02), 0xffffff, 1, signUV(8));
  if (alongX) o.solid(x - half, x + half, z - 0.3, z + 0.3, 1.2); else o.solid(x - 0.3, x + 0.3, z - half, z + half, 1.2);
}

// day 1's lifeguard hut: a box on stilts with a hat
export function lifeguardHut(o, x, z, body, roof) {
  for (const [ox, oz] of [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]]) o.B.box(x + ox, 1.1, z + oz, 0.2, 2.2, 0.2, 0xe8e0d8);
  o.B.box(x, 2.3, z, 3.4, 0.2, 3.4, 0xfff8ee, { bottom: true });
  o.B.box(x, 3.4, z - 0.3, 2.6, 2, 2.4, body);
  o.B.box(x, 4.55, z - 0.3, 3.2, 0.3, 3, roof, { taper: [0.75, 0.75], bottom: true });
  o.B.quad(...wallQuad({ x0: x - 1.3, x1: x + 1.3, z0: z - 1.5, z1: z + 0.9 }, 's', x, 3.5, 1.6, 0.9, 0.03), GLASS);
  o.solid(x - 1.5, x + 1.5, z - 1.5, z + 1.5, 4.7);
}
