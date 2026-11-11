// The downtown kit: builds one 160 m chunk of Meridian, a piece at a time (a generator function,
// so the streamer can stop after any lot). Five tower recipes from plan/bible/world/meridian.md:
// M1 slab, M2 stepped, M3 twin, M4 curved corner, M5 podium with a plaza. The shape of each tower
// (its tiers) is fixed in zones/meridian.js; this file adds what you see from the street.
import { rng } from '../../core/rng.js';
import { TRIM, NEON, CURB, BOARD, pick, wallQuad, windows, neonStrip, wallSlab, cellBox, signBoard, slab, barrier } from './kit.js';
import { signUV, TOWER_SIGNS } from '../../gfx/atlas.js';
import { drawTiers, plainFlat } from './towers.js';

const ASPHALT = 0x3b3946, DASH = 0xf2e6b0, PAVE = 0xd6cdc4, PLAZA = 0xe0e0e6, LAWN = 0x3fb86a, Y = 0.02;
const hit = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.z0 < b.z1 && a.z1 > b.z0;

// "Bayhaven Tomorrow: Now Leasing The Sky": a board on two posts, 12.8 x 6.4 m, two sign cells high
const stats = { billboards: 0, towers: 0 };
export function billboard(o, x, z, face = 's') {
  stats.billboards++;
  const ns = face === 's' || face === 'n', c = ns ? { x0: x - 6.6, x1: x + 6.6, z0: z - 0.25, z1: z + 0.25 } : { x0: x - 0.25, x1: x + 0.25, z0: z - 6.6, z1: z + 6.6 };
  for (const u of [-4.5, 4.5]) o.B.box(ns ? x + u : x, 3.5, ns ? z : z + u, 0.5, 7, 0.5, 0x2b2838);
  cellBox(o, c, 6.6, 13.4, BOARD, { bottom: true });
  for (const side of ns ? ['s', 'n'] : ['e', 'w']) {
    o.S.quad(...wallQuad(c, side, ns ? x : z, 11.6, 12.8, 3.2, 0.03), 0xffffff, 1, signUV(16));
    o.S.quad(...wallQuad(c, side, ns ? x : z, 8.4, 12.8, 3.2, 0.03), 0xffffff, 1, signUV(17));
  }
  o.N.box(x, 13.5, z, ns ? 13.4 : 0.6, 0.16, ns ? 0.6 : 13.4, 0x29e6ff);
  for (const u of [-4.5, 4.5]) o.solid((ns ? x + u : x) - 0.3, (ns ? x + u : x) + 0.3, (ns ? z : z + u) - 0.3, (ns ? z : z + u) + 0.3, 7);
}

// ---------- what a tower has at street level ----------
function streetLevel(o, lot) {
  const rnd = o.rnd, base = lot.tiers[0], bandH = lot.recipe === 'M1' ? 6 : lot.recipe === 'M2' ? 5 : 4.5;
  const c = { x0: base.x0 - 0.15, x1: base.x1 + 0.15, z0: base.z0 - 0.15, z1: base.z1 + 0.15 }, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2;
  o.B.box(cx, bandH / 2, cz, c.x1 - c.x0, bandH, c.z1 - c.z0, pick(o, [TRIM, 0x2f2b40, TRIM, 0x3d7f8f]), { top: TRIM });
  const front = lot.corner ? lot.corner[0] : pick(o, ['s', 'n']);
  for (const side of ['s', 'n', 'e', 'w']) {
    windows(o, c, side, 0.5, 3.1, 4.2, 2.6, 3.4, 2.2, 0.04, 0.75);                     // shop and lobby glass
    if (lot.recipe === 'M1' && !o.low) windows(o, c, side, 3.3, 5.7, 8.4, 2.4, 7.2, 1.6, 0.04, 0.9);    // the lobby's upper lights
    if (lot.recipe === 'M3' && !o.low && (side === 's' || side === 'n')) {            // podium shops with awnings
      const col = pick(o, NEON), n = Math.floor((c.x1 - c.x0 - 1) / 8.4), step = (c.x1 - c.x0) / n;
      for (let i = 0; i < n; i++) cellBox(o, wallSlab(c, side, c.x0 + (i + 0.5) * step, 3.6, 1.2), 3.0, 3.12, i % 2 ? col : TRIM, { bottom: true });
    }
  }
  if (lot.recipe === 'M2' && !o.low) {       // a colonnade of bank fronts: square columns 1.2 m off the wall
    for (const side of ['s', 'n']) for (let x = c.x0 + 2; x <= c.x1 - 1.9; x += (c.x1 - c.x0 - 4) / 6) {
      o.B.box(x, 2.5, side === 's' ? c.z1 + 1.6 : c.z0 - 1.6, 0.8, 5, 0.8, TRIM);
    }
    for (const side of ['s', 'n']) cellBox(o, wallSlab(c, side, cx, (c.x1 - c.x0) / 2, 2.2), 5, 5.5, TRIM, { bottom: true });
  }
  // the door under a canopy on two posts, and the tower's name over it
  const can = wallSlab(c, front, front === 's' || front === 'n' ? cx : cz, 4, 4);
  cellBox(o, can, 3.9, 4.2, lot.wall === 0xff8f7a ? 0xfdf6ea : pick(o, [0xfdf6ea, 0x2e4a6b, 0xff3fa4]), { bottom: true });
  o.B.quad(...wallQuad(c, front, front === 's' || front === 'n' ? cx : cz, 1.6, 3.6, 3.2, 0.08), 0x1b2a40);
  if (lot.wall === 0xff8f7a) signBoard(o, c, front, 20, 5.2);
  else if (rnd() < 0.6) signBoard(o, c, front, pick(o, TOWER_SIGNS), bandH + 0.9);
  if (lot.recipe === 'M4') {                 // the clock over the corner door
    const q = wallQuad(c, front, (front === 's' || front === 'n' ? (lot.corner[1] === 'w' ? c.x0 + 15 : c.x1 - 15) : cz), 7.2, 2.2, 2.2, 0.3);
    o.B.quad(...q, TRIM); o.L.quad(...wallQuad(c, front, lot.corner[1] === 'w' ? c.x0 + 15 : c.x1 - 15, 7.2, 2.2, 2.2, 0.34), 0xffd58a, 0.5);
  }
}

function tower(o, lot) {
  stats.towers++;
  const rnd = o.rnd, top = lot.tiers.filter((t) => !t.plain).reduce((a, b) => (b.y1 > a.y1 ? b : a));
  o.G.flat(lot.x0, lot.x1, lot.z0, lot.z1, CURB + 0.012, PLAZA);
  drawTiers(o, lot.tiers);
  streetLevel(o, lot);
  // the crown: neon round the top of anything over 34 m, three times in four
  if (lot.crown || (lot.h > 34 && rnd() < 0.75)) { const col = lot.crown || pick(o, [0xffffff, 0x29e6ff, 0xff3fa4, 0xffffff]); for (const side of ['s', 'n', 'e', 'w']) if (!top.round) neonStrip(o, top, side, top.y1 - 0.5, col); }
  if (lot.mast) { o.B.box(lot.mast.x, (lot.mast.y0 + lot.mast.y1) / 2, lot.mast.z, 0.4, lot.mast.y1 - lot.mast.y0, 0.4, TRIM); o.N.box(lot.mast.x, lot.mast.y1, lot.mast.z, 0.8, 0.8, 0.8, 0xff5a5a); }
  if (lot.helipad) {
    const cx = (top.x0 + top.x1) / 2, cz = (top.z0 + top.z1) / 2, y = top.y1 + 0.05;
    o.B.flat(cx - 8, cx + 8, cz - 8, cz + 8, y, 0x3b3946);
    for (const [dx, w, d] of [[-2.2, 1, 7], [2.2, 1, 7], [0, 4, 1]]) o.B.flat(cx + dx - w / 2, cx + dx + w / 2, cz - d / 2, cz + d / 2, y + 0.04, TRIM);
  }
  if (lot.plaza) {                           // M5's open half: planters, benches, flagpoles, one box sculpture
    const s = lot.plaza, cx = (lot.x0 + lot.x1) / 2, cz = (lot.z0 + lot.z1) / 2;
    const px = s === 'e' ? lot.x0 + 12 : s === 'w' ? lot.x1 - 12 : cx, pz = s === 's' ? lot.z0 + 12 : s === 'n' ? lot.z1 - 12 : cz, ns = s === 'n' || s === 's';
    o.B.box(px, CURB + 1.6, pz, 2.2, 3.2, 2.2, pick(o, NEON), { rot: 0.6, bottom: true }); o.solid(px - 1.4, px + 1.4, pz - 1.4, pz + 1.4, 3.4);
    for (const u of [-18, 18]) {
      const x = ns ? px + u : px, z = ns ? pz : pz + u;
      if (!o.low) { o.B.box(x, CURB + 0.4, z, ns ? 8 : 2, 0.8, ns ? 2 : 8, TRIM, { top: LAWN }); o.solid(x - (ns ? 4 : 1), x + (ns ? 4 : 1), z - (ns ? 1 : 4), z + (ns ? 1 : 4), 0.9); }
      o.decor('palm', x, CURB + 0.6, z, x + z, 0.8);
      o.decor('bench', ns ? x : px + 4, CURB, ns ? pz + 4 : z, ns ? Math.PI : Math.PI / 2, 1);
    }
    for (let i = -1; i <= 1; i++) {          // three flagpoles between the plaza and the street
      const x = ns ? px + i * 3 : (s === 'e' ? lot.x0 + 2 : lot.x1 - 2), z = ns ? (s === 's' ? lot.z0 + 2 : lot.z1 - 2) : pz + i * 3;
      o.B.box(x, 5, z, 0.14, 10, 0.14, 0xc8ccd2);
      if (!o.low) o.B.box(x + 0.9, 9.2, z, 1.6, 1, 0.05, [0x29e6ff, 0xff3fa4, 0xfff1c9][i + 1], { bottom: true });
    }
  }
  for (const t of lot.tiers) if (t.y0 === 0) o.solid(t.x0 - 0.15, t.x1 + 0.15, t.z0 - 0.15, t.z1 + 0.15, t.y1);
}
const reserved = (o, lot) => {
  o.G.flat(lot.x0, lot.x1, lot.z0, lot.z1, CURB + 0.012, lot.ground);
  for (let i = 0; i < 16; i++) { const x = lot.x0 + 10 + o.rnd() * (lot.x1 - lot.x0 - 20), z = lot.z0 + 10 + o.rnd() * (lot.z1 - lot.z0 - 20); o.decor('palm', x, CURB, z, i * 1.7, 0.9 + o.rnd() * 0.4); o.solid(x - 0.3, x + 0.3, z - 0.3, z + 0.3, 1); }
};

// ---------- the chunk ----------
export default {
  id: 'meridian', stats,
  *build(o, chunk, map, heroes) {
    const R = chunk.rect, zone = map.zone('meridian'), Z = zone.bounds, G = o.G, M = o.M;
    const x0 = Math.max(R.x0, Z.x0), x1 = Math.min(R.x1, Z.x1), z0 = Math.max(R.z0, Z.z0), z1 = Math.min(R.z1, Z.z1);
    const special = [...zone.hero, ...zone.reserved];
    G.flat(x0, x1, z0, z1, 0, ASPHALT);
    for (const b of map.blocksInChunk(chunk.cx, chunk.cz)) slab(o, b.x0, b.x1, b.z0, b.z1);
    // plazas are paved over the streets they close
    for (const p of zone.plazas) if (hit(p, R)) slab(o, Math.max(p.x0, R.x0), Math.min(p.x1, R.x1), Math.max(p.z0, R.z0), Math.min(p.z1, R.z1));
    yield;
    // road paint: dashes, the boulevard's palm median, zebras at the lights, barriers where the map ends
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
        if (p.lanes === 3) for (let t = a + 6; t < b - 4; t += 16) { o.decor('palm', c, 0, t, t, 0.95 + o.rnd() * 0.3); o.solid(c - 0.3, c + 0.3, t - 0.3, t + 0.3, 1); }
      }
      for (const [k, end] of [[p.a, a], [p.b, b]]) {
        const n = k && map.nodes.get(k);
        if (!n || !n.signal) continue;
        const dir = end === a ? 1 : -1, hw = p.width / 2 - 0.7;
        for (let s = -hw; s < hw - 0.3; s += 1.4) {
          const u0 = end - dir * 1.5, u1 = end + dir * 1.0, lo = Math.min(u0, u1), hi = Math.max(u0, u1);
          if (ns) M.flat(c + s, c + s + 0.7, lo, hi, Y, 0xffffff); else M.flat(lo, hi, c + s, c + s + 0.7, Y, 0xffffff);
        }
      }
      if (p.stub) {
        if (ns) barrier(o, c, p.a ? p.bz - 8 : p.az + 8, true, p.width + 8, p.a ? 's' : 'n');
        else barrier(o, p.a ? p.bx - 10 : p.ax + 10, c, false, p.width + 8, p.a ? 'w' : 'e');
      }
    }
    yield;
    for (const lot of map.lotsInChunk(chunk.cx, chunk.cz)) {
      o.rnd = rng(lot.seed || 7);
      if (lot.hero) heroes[lot.hero].build(o, lot, map); else if (lot.reserved) reserved(o, lot); else tower(o, lot);
      yield;
    }
    o.rnd = rng(chunk.seed);
    // street furniture: lamps and palms by turns along each block's north and south kerbs, palms down its sides
    for (const b of map.blocksInChunk(chunk.cx, chunk.cz)) {
      if (b.edge || special.some((h) => hit(h, b))) continue;
      if (b.row.strip) {                     // the thin strips at the district's edge: a billboard on some, palms on all
        const mid = (b.x0 + b.x1) / 2, z = (b.z0 + b.z1) / 2;
        if (b.row.id === 'S' && (b.ci % 3 === 1 || Math.abs(mid - 52) < 60)) billboard(o, mid < 52 && mid > -8 ? b.x1 - 14 : mid > 52 && mid < 112 ? b.x0 + 14 : mid, z, 's');
        for (let x = b.x0 + 8; x <= b.x1 - 6; x += 16) { o.decor('palm', x, CURB, b.row.id === 'S' ? b.z0 + 2 : b.z1 - 2, x, 1); }
        continue;
      }
      let i = 0;
      for (let x = b.x0 + 6; x <= b.x1 - 5; x += 12, i++) for (const [z, dz] of [[b.z1 - 1, 1], [b.z0 + 1, -1]]) {
        if (i % 2 === 0) o.prop('lamp', x, CURB, z, dz > 0 ? 0 : Math.PI);
        else if (!o.low || i % 4 === 1) { o.decor('palm', x, CURB, z - dz * 0.4, x * 7 + z, 0.8 + o.rnd() * 0.3); o.solid(x - 0.3, x + 0.3, z - dz * 0.4 - 0.3, z - dz * 0.4 + 0.3, 1); }
      }
      if (!o.low) for (let z = b.z0 + 21; z <= b.z1 - 20; z += 24) for (const x of [b.x0 + 1.4, b.x1 - 1.4]) { o.decor('palm', x, CURB, z, x + z * 3, 0.85); o.solid(x - 0.3, x + 0.3, z - 0.3, z + 0.3, 1); }
      o.decor('bench', b.x0 + 20, CURB, b.z1 - 2.6, Math.PI, 1);
    }
  },

  // the far shell of a chunk: every tower's tiers with window walls, and the sidewalks, all in the window mesh
  shell(o, chunk, map, heroes) {
    for (const b of map.blocksInChunk(chunk.cx, chunk.cz)) plainFlat(o.W, b.x0, b.x1, b.z0, b.z1, CURB, PAVE);
    for (const lot of map.lotsInChunk(chunk.cx, chunk.cz)) {
      if (lot.hero) { if (heroes[lot.hero].shell) heroes[lot.hero].shell(o, lot); } else if (lot.tiers) drawTiers({ W: o.W }, lot.tiers, { cell: 6, cut: false });
      else if (lot.reserved) plainFlat(o.W, lot.x0, lot.x1, lot.z0, lot.z1, CURB + 0.02, lot.ground);
    }
  },
};
