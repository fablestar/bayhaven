// The beachfront kit: builds one 160 m chunk of Tideline, a piece at a time (it is a generator
// function, so the streamer can stop after any lot when its 4 ms are up). Recipes T1 to T5 from
// plan/bible/world/tideline.md; T6, T7 and T8 are tier B and their lots are T1 until they ship.
import { rng } from '../../core/rng.js';
import { TRIM, ROOF, GLASS, NEON, CURB, BOARD, pick, wallQuad, span, windows, ribbons, neonStrip, wallSlab, cellBox, signBoard,
  detailBuilding, slab, barrier } from './kit.js';
import { signUV } from '../../gfx/atlas.js';

const ASPHALT = 0x3b3946, SAND = 0xf2ddb0, WET = 0xe2c998, DASH = 0xf2e6b0, PAVE = 0xd6cdc4, Y = 0.02;
const beachY = (z) => (z > 72 ? 0.02 - (z - 72) / 28 : 0.02);

// ---------- recipes: (o, lot) ----------

const T1 = (o, lot) => detailBuilding(o, lot.body, lot.floors - 1, lot.sides, o.rnd() < 0.6, { col: lot.wall, lit: 0.3, plain: o.low });

// T3 hotel slab: 8 to 11 floors, two setbacks at the top, a neon fin, a balcony a floor, a canopy
function T3(o, lot) {
  const c = lot.body, h = lot.h, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2, w = c.x1 - c.x0, d = c.z1 - c.z0, neon = pick(o, NEON), f = lot.face;
  const h1 = h - 6.4;
  o.B.box(cx, h1 / 2, cz, w, h1, d, lot.wall, { top: ROOF });
  o.B.box(cx, 1.75, cz, w + 0.3, 3.5, d + 0.3, TRIM, { top: TRIM });
  o.B.box(cx, h1 + 1.6, cz, w - 6, 3.2, d - 6, lot.wall, { top: ROOF });
  o.B.box(cx, h1 + 4.8, cz, w - 12, 3.2, d - 12, lot.wall, { top: ROOF });
  o.B.box(cx, h + 0.2, cz, w - 11.6, 0.5, d - 11.6, TRIM, { top: ROOF });
  const main = { x0: c.x0, x1: c.x1, z0: c.z0, z1: c.z1 };
  for (const side of ['s', 'n', 'e', 'w']) {
    if (side === f || !o.low) ribbons(o, main, side, 3.6, h1 - 0.2, 3.2, 1.5, 0.05, side === f ? 0.6 : 0.3);
    if (lot.sides[side]) { windows(o, c, side, 0.5, 3.1, 4.2, 2.6, 3.4, 2.2, 0.19, 0.75); neonStrip(o, c, side, 3.62, neon); }
  }
  // balcony slabs on the street face, 1.2 m deep
  const bz = f === 's' ? c.z1 + 0.6 : c.z0 - 0.6;
  if (!o.low) for (let y = 6.8; y < h1 - 1; y += 3.2) o.B.box(cx, y, bz, w - 1, 0.16, 1.2, TRIM, { bottom: true });
  // the fin, 6 m over the roof, with its tube; and the canopy over the door
  const fin = wallSlab(c, f, c.x0 + w * 0.2, 1.1, 0.7);
  cellBox(o, fin, 3.5, h + 6, TRIM);
  const tube = wallSlab(fin, f, c.x0 + w * 0.2, 0.1, 0.1);
  o.N.box((tube.x0 + tube.x1) / 2, (h + 9.5) / 2, (tube.z0 + tube.z1) / 2, tube.x1 - tube.x0, h + 2.5, tube.z1 - tube.z0, neon);
  const can = wallSlab(c, f, cx + 4, 6, 3.6);
  cellBox(o, can, 3.2, 3.5, neon === 0xffa02e ? 0xff3fa4 : 0xfdf6ea, { bottom: true });
  signBoard(o, { ...c, x0: cx - 2, x1: cx + 10 }, f, pick(o, [6, 10, 6, 2]), 5.2);
  o.solid(c.x0 - 0.15, c.x1 + 0.15, c.z0 - 0.15, c.z1 + 0.15, h);
}

// T2 motel court: a two-floor U of doors round a small bright pool, open to the street
function T2(o, lot) {
  const c = lot.body, s = lot.face === 's', h = 6.0, doorA = 0x8fe3cf, doorB = 0xff9eb5, rnd = o.rnd;
  const back = s ? { x0: c.x0, x1: c.x1, z0: c.z0, z1: c.z0 + 8 } : { x0: c.x0, x1: c.x1, z0: c.z1 - 8, z1: c.z1 };
  const zw0 = s ? c.z0 + 8 : c.z0, zw1 = s ? c.z1 : c.z1 - 8;
  const wings = [{ x0: c.x0, x1: c.x0 + 8, z0: zw0, z1: zw1 }, { x0: c.x1 - 8, x1: c.x1, z0: zw0, z1: zw1 }];
  const inner = [[back, s ? 's' : 'n'], [wings[0], 'e'], [wings[1], 'w']];
  for (const [r, side] of inner) {
    cellBox(o, r, 0, h, lot.wall, { top: ROOF });
    o.B.box((r.x0 + r.x1) / 2, h + 0.3, (r.z0 + r.z1) / 2, r.x1 - r.x0 + 1.2, 0.6, r.z1 - r.z0 + 1.2, TRIM, { top: ROOF, bottom: true });
    const [a, b] = span(r, side), n = Math.floor((b - a - 1) / 4), step = (b - a) / n;
    for (let fl = 0; fl < 2; fl++) for (let i = 0; i < n; i++) {
      const u = a + (i + 0.5) * step, y = fl * 3.0;
      o.B.quad(...wallQuad(r, side, u - 0.9, y + 1.1, 1.0, 2.2, 0.05), (i + fl) % 2 ? doorA : doorB);
      if (!o.low || fl === 0) o.B.quad(...wallQuad(r, side, u + 0.8, y + 1.5, 1.6, 1.2, 0.05), GLASS, 0.85 + rnd() * 0.3);
      if (rnd() < 0.3) o.L.quad(...wallQuad(r, side, u + 0.8, y + 1.5, 1.6, 1.2, 0.08), 0xffd58a, 0.5 + rnd() * 0.5);
    }
    cellBox(o, wallSlab(r, side, (a + b) / 2, (b - a) / 2, 1.4), 2.92, 3.06, TRIM, { bottom: true });   // the walkway
    o.solid(r.x0, r.x1, r.z0, r.z1, h);
  }
  // the pool, in the court
  const px = (c.x0 + c.x1) / 2, pz = (zw0 + zw1) / 2 + (s ? -1 : 1) * 2;
  o.G.flat(c.x0 + 8, c.x1 - 8, zw0, zw1, CURB + 0.012, 0xe9b9a2);
  o.B.box(px, CURB + 0.1, pz, 12.8, 0.2, 6.8, TRIM, { top: 0x35c8c8 });
  o.L.flat(px - 6, px + 6, pz - 3, pz + 3, CURB + 0.23, 0x29e6ff, 0.5);
  o.decor('umbrella', px - 8.5, CURB, pz + 1, 0, 1); o.decor('umbrella', px + 8.5, CURB, pz - 1, 1, 1);
  // a 9 m pole sign at the street
  const sz = s ? c.z1 + 1.6 : c.z0 - 1.6, sx = c.x0 + 3;
  o.B.box(sx, 4.5, sz, 0.3, 9, 0.3, 0x2b2838);
  const board = { x0: sx - 3.3, x1: sx + 3.3, z0: sz - 0.22, z1: sz + 0.22 };
  cellBox(o, board, 7.2, 9.0, BOARD, { bottom: true });
  for (const side of ['s', 'n']) o.S.quad(...wallQuad(board, side, sx, 8.1, 6.4, 1.6, 0.02), 0xffffff, 1, signUV(3));
  o.N.box(sx, 9.1, sz, 6.8, 0.14, 0.5, 0xffa02e);
  o.solid(sx - 0.3, sx + 0.3, sz - 0.3, sz + 0.3, 9);
}

// T4 beach shack: one room, a blue hip roof, a serving hatch and a rack of boards
function T4(o, lot) {
  const c = lot.body, f = lot.face, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2;
  o.G.flat(lot.x0 + 0.5, lot.x1 - 0.5, lot.z0 + 0.5, lot.z1 - 0.5, CURB + 0.012, SAND);
  o.B.box(cx, 1.5, cz, 8, 3, 6, lot.wall);
  o.B.box(cx, 3.6, cz, 9, 1.2, 7, 0x29b6e6, { taper: [0.45, 0.3], bottom: true });
  o.B.quad(...wallQuad(c, f, cx - 1.2, 1.75, 3, 1.3, 0.04), 0x2b2838);
  cellBox(o, wallSlab(c, f, cx - 1.2, 1.7, 0.5), 1.0, 1.1, TRIM, { bottom: true });
  o.B.quad(...wallQuad(c, f, cx + 2.6, 1.1, 1.0, 2.2, 0.04), TRIM);
  o.L.quad(...wallQuad(c, f, cx - 1.2, 1.75, 3, 1.3, 0.07), 0xffd58a, 0.7);
  neonStrip(o, c, f, 3.05, pick(o, NEON), 0.1);
  const rx = c.x1 + 1.4;                                   // the board rack
  for (let i = 0; i < 4; i++) o.B.box(rx + i * 0.5, 1.1, cz, 0.12, 2.2, 0.55, pick(o, [0xff4f6e, 0x29b6e6, 0xffc23e, 0x3fd68a]), { shift: [0.25, 0] });
  for (let i = 0; i < 2; i++) o.decor('umbrella', c.x0 - 3 - i * 4, CURB, cz + (f === 's' ? 2 : -2), i, 1);
  o.solid(c.x0, c.x1, c.z0, c.z1, 3); o.solid(rx - 0.2, rx + 1.9, cz - 0.4, cz + 0.4, 2);
}

// T5 bait shed: a white box under a low grey gable, an ice chest and a net rack outside
function T5(o, lot) {
  const c = lot.body, f = lot.face, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2;
  o.G.flat(lot.x0 + 0.5, lot.x1 - 0.5, lot.z0 + 0.5, lot.z1 - 0.5, CURB + 0.012, 0xc9c0b2);
  o.B.box(cx, 1.7, cz, 14, 3.4, 10, lot.wall);
  o.B.box(cx, 4.2, cz, 14.8, 1.6, 10.8, ROOF, { taper: [1, 0.06], bottom: true });
  o.B.quad(...wallQuad(c, f, cx + 3, 1.2, 1.8, 2.4, 0.04), 0x3d7f8f);
  for (const u of [-4, -1]) o.B.quad(...wallQuad(c, f, cx + u, 2.0, 1.6, 0.8, 0.04), GLASS);
  const out = f === 's' ? c.z1 + 0.8 : c.z0 - 0.8;
  o.B.box(cx - 5, CURB + 0.5, out, 1.6, 1.0, 0.9, 0xf7f3ea, { top: 0x9fd2ff });                 // ice chest
  o.B.box(cx - 2, CURB + 0.9, out, 2.4, 1.8, 0.12, 0x8a6f55);                                   // net rack
  cellBox(o, wallSlab(c, f, cx + 3, 2.4, 0.2), 2.9, 3.7, pick(o, [0xffc98f, 0x8fe3cf, 0xff8f7a]));   // a hand-painted board
  o.solid(c.x0, c.x1, c.z0, c.z1, 3.4);
}

// a fenced empty lot in East Strand: mud, a printed fence along the street, sometimes a site cabin
function emptyLot(o, lot) {
  const f = lot.face, zf = f === 's' ? lot.z1 - 0.4 : lot.z0 + 0.4;
  o.G.flat(lot.x0, lot.x1, lot.z0, lot.z1, CURB + 0.012, 0xb9a58a);
  for (let x = lot.x0; x < lot.x1 - 0.1; x += 2.4) {
    const w = Math.min(2.4, lot.x1 - x);
    o.B.box(x + w / 2, CURB + 1.2, zf, w - 0.06, 2.4, 0.08, Math.round(x / 2.4) % 3 ? 0xe0e0e6 : 0xb8cfe0, { bottom: true });
  }
  o.solid(lot.x0, lot.x1, zf - 0.2, zf + 0.2, 2.4);
  if (o.rnd() < 0.5) {
    const x = lot.x0 + 5 + o.rnd() * (lot.x1 - lot.x0 - 10), z = (lot.z0 + lot.z1) / 2;
    o.B.box(x, CURB + 1.3, z, 6, 2.6, 2.5, 0xf7f3ea, { top: 0x9aa3ad });
    o.solid(x - 3, x + 3, z - 1.25, z + 1.25, 2.6);
  }
  if (lot.sides.w || lot.sides.e) o.prop('cone', lot.sides.w ? lot.x0 - 1.5 : lot.x1 + 1.5, CURB, zf, 0, { color: 0xff7a1e });
}
const reserved = (o, lot) => o.G.flat(lot.x0, lot.x1, lot.z0, lot.z1, CURB + 0.012, lot.ground);

const RECIPES = { T1, T2, T3, T4, T5, empty: emptyLot, reserved };

// ---------- the chunk ----------

export default {
  id: 'tideline',
  // o: the build context (see kit.js); chunk: { cx, cz, rect }; heroes: { id: fn(o, lot, map) }
  *build(o, chunk, map, heroes) {
    const R = chunk.rect, zone = map.zone('tideline'), Z = zone.bounds, G = o.G, M = o.M;
    const x0 = Math.max(R.x0, Z.x0), x1 = Math.min(R.x1, Z.x1), z0 = Math.max(R.z0, Z.z0);
    // ground: asphalt under everything, then sand, then wet sand going under the sea
    if (z0 < 50) G.flat(x0, x1, z0, Math.min(R.z1, 50), 0, ASPHALT);
    if (R.z1 > 50) {
      G.flat(x0, x1, 50, 72, 0.02, SAND);
      G.quad([x0, 0.02, 72], [x0, beachY(R.z1), R.z1], [x1, beachY(R.z1), R.z1], [x1, 0.02, 72], WET);
      const p = zone.promenade;                             // the promenade slab, with its gaps
      let at = x0;
      for (const [a, b] of [...p.gaps].sort((m, n) => m[0] - n[0]).concat([[x1, x1]])) {
        if (a > at && at < x1) slab(o, at, Math.min(a, x1), p.z0, p.z1);
        at = Math.max(at, b);
      }
    }
    for (const b of map.blocksInChunk(chunk.cx, chunk.cz)) slab(o, b.x0, b.x1, b.z0, b.z1);
    yield;
    // road paint: a dashed centre line; lane dashes and a median on the wide roads; zebras at lights
    for (const p of map.roadsInChunk(chunk.cx, chunk.cz)) {
      const ns = p.axis === 'ns', a = (ns ? p.az : p.ax) + (p.a ? map.nodes.get(p.a).half[ns ? 'ew' : 'ns'] + 2.5 : 0);
      const b = (ns ? p.bz : p.bx) - (p.b ? map.nodes.get(p.b).half[ns ? 'ew' : 'ns'] + 2.5 : 0), c = ns ? p.ax : p.az;
      const offs = p.lanes === 1 ? [0] : p.lanes === 2 ? [-4.8, 4.8] : [-5.6, 5.6, -9.2, 9.2];
      for (let t = a; t + 3 <= b; t += 9) for (const off of offs) {
        if (ns) M.flat(c + off - 0.12, c + off + 0.12, t, t + 3, Y, DASH); else M.flat(t, t + 3, c + off - 0.12, c + off + 0.12, Y, DASH);
      }
      if (p.lanes > 1) {
        const hw = p.lanes === 3 ? 2 : 0.25, col = p.lanes === 3 ? PAVE : DASH;
        if (ns) M.flat(c - hw, c + hw, a, b, Y, col); else M.flat(a, b, c - hw, c + hw, Y, col);
        if (p.lanes === 3) for (let t = a + 6; t < b - 4; t += 16) { o.decor('palm', c, 0, t, t, 0.9 + o.rnd() * 0.3); o.solid(c - 0.3, c + 0.3, t - 0.3, t + 0.3, 1); }
      }
      for (const [k, end] of [[p.a, a], [p.b, b]]) {
        const n = k && map.nodes.get(k);
        if (!n || !(n.signal || (Math.abs(n.x) === 52 && Math.abs(n.z) === 37))) continue;
        const dir = end === a ? 1 : -1, hw = p.width / 2 - 0.7;
        for (let s = -hw; s < hw - 0.3; s += 1.4) {
          const u0 = end - dir * 1.5, u1 = end + dir * 1.0, lo = Math.min(u0, u1), hi = Math.max(u0, u1);
          if (ns) M.flat(c + s, c + s + 0.7, lo, hi, Y, 0xffffff); else M.flat(lo, hi, c + s, c + s + 0.7, Y, 0xffffff);
        }
      }
      // where today's map ends: day 1's striped barrier across the stub
      if (p.stub) {
        if (ns) barrier(o, c, p.a ? p.bz - 8 : p.az + 8, true, p.width + 8, 's');
        else { const west = !p.a; barrier(o, west ? p.ax + 10 : p.bx - 10, c === 37 ? 40 : c, false, c === 37 ? 20 : p.width + 8, west ? 'e' : 'w'); }
      }
    }
    yield;
    // the lots: hand-written ones call their own file, the rest a kit recipe
    for (const lot of map.lotsInChunk(chunk.cx, chunk.cz)) {
      o.rnd = rng(lot.seed);
      if (lot.hero) heroes[lot.hero].build(o, lot, map); else RECIPES[lot.recipe](o, lot);
      yield;
    }
    o.rnd = rng(chunk.seed);
    // street furniture: lamps and palms by turns along the north and south kerbs of each block
    for (const b of map.blocksInChunk(chunk.cx, chunk.cz)) {
      if (b.edge || zone.hero.some((h) => !h.beach && h.x0 < b.x1 && h.x1 > b.x0 && h.z0 < b.z1 && h.z1 > b.z0)) continue;
      let i = 0;
      for (let x = b.x0 + 6; x <= b.x1 - 5; x += 13.5, i++) for (const [z, dz] of [[b.z1 - 1, 1], [b.z0 + 1, -1]]) {
        if (b.row.id === 'E' && dz < 0) continue;
        if (i % 2 === 0) o.prop('lamp', x, CURB, z, dz > 0 ? 0 : Math.PI);
        else if (!o.low || i % 4 === 1) { o.decor('palm', x, CURB, z - dz * 0.4, x * 7 + z, 0.85 + o.rnd() * 0.45); o.solid(x - 0.3, x + 0.3, z - dz * 0.4 - 0.3, z - dz * 0.4 + 0.3, 1); }
      }
      if (b.row.id === 'A') o.decor('bench', b.x0 + 20, CURB, b.z1 - 2.6, Math.PI, 1);
    }
    yield;
    // Heron Walk and the beach: one unbroken row of palms, long-armed lamps, benches, umbrellas
    if (R.z1 > 50) {
      const p = zone.promenade, gap = (x) => p.gaps.some(([a, b]) => x > a - 1 && x < b + 1);
      for (let x = Math.ceil((x0 + 5) / 10) * 10 - 5; x < x1; x += 10) {
        if (gap(x)) continue;
        o.decor('palm', x, CURB, 47.4, x * 3, 0.9 + o.rnd() * 0.4); o.solid(x - 0.3, x + 0.3, 47.1, 47.7, 1);
      }
      for (let x = Math.ceil(x0 / 27.5) * 27.5; x < x1; x += 27.5) if (!gap(x) && Math.abs(x) > 1) o.prop('lampLong', x, CURB, 49.3, Math.PI);
      for (let x = Math.ceil((x0 - 12) / 40) * 40 + 12; x < x1; x += 40) if (!gap(x)) o.decor('bench', x, CURB, 45.2, 0, 1);
      for (let i = 0; i < 12; i++) {
        const x = x0 + (i + 0.5) * (x1 - x0) / 12 + (o.rnd() - 0.5) * 6, z = 54.5 + o.rnd() * 13;
        if (zone.hero.some((h) => h.beach && Math.abs((h.x0 + h.x1) / 2 - x) < 4)) continue;
        o.decor('umbrella', x, 0.02, z, i + chunk.cx, 1); o.solid(x - 0.15, x + 0.15, z - 0.15, z + 0.15, 1);
        o.B.box(x + 1.6, 0.05, z + (o.rnd() - 0.5), 0.9, 0.06, 2, pick(o, [0xff6fb8, 0x29e6ff, 0xffd23e, 0xffffff]));     // a towel
      }
      for (let i = 0; i < 4; i++) {
        const x = x0 + (i + 0.5) * (x1 - x0) / 4 + (o.rnd() - 0.5) * 12, z = 53 + o.rnd() * 5;
        o.decor('palm', x, 0, z, i, 0.75 + o.rnd() * 0.35); o.solid(x - 0.3, x + 0.3, z - 0.3, z + 0.3, 1);
      }
    }
  },

  // the far shell of a chunk: one box a building in its own colour, a base band, the sidewalks
  shell(o, chunk, map, heroes) {
    for (const b of map.blocksInChunk(chunk.cx, chunk.cz)) o.B.flat(b.x0, b.x1, b.z0, b.z1, CURB, PAVE);
    for (const lot of map.lotsInChunk(chunk.cx, chunk.cz)) {
      const c = lot.body;
      if (lot.hero && heroes[lot.hero].shell) { heroes[lot.hero].shell(o, lot); continue; }
      if (!c || !lot.h || lot.beach) continue;
      const cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2, w = c.x1 - c.x0, d = c.z1 - c.z0;
      if (lot.recipe === 'T2') {            // the motel keeps its U
        const s = lot.face === 's';
        o.B.box(cx, 3.3, s ? c.z0 + 4 : c.z1 - 4, w, 6.6, 8, lot.wall, { top: ROOF });
        for (const x of [c.x0 + 4, c.x1 - 4]) o.B.box(x, 3.3, cz + (s ? 4 : -4), 8, 6.6, d - 8, lot.wall, { top: ROOF });
        continue;
      }
      o.B.box(cx, lot.h / 2, cz, w, lot.h, d, lot.wall, { top: ROOF });
      if (lot.h > 6) o.B.box(cx, 1.75, cz, w + 0.3, 3.5, d + 0.3, TRIM, { noTop: true });
    }
  },
};
