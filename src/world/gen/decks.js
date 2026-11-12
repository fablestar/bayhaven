// What the raised roads look like (data and rules: ../decks.js): the Bayline Expressway's slab,
// barriers, lane paint, pillars and exit signs, its six ramps, and the ground roads that pass
// under it. The streamer runs this after the district's own generator for any chunk it touches.
import { MeshBuilder } from '../../gfx/builder.js';
import { board, muralMesh, muralAtlas } from '../../gfx/murals.js';
import { DECK, RAMPS, UNDER } from '../decks.js';

const CONC = 0xb9b4ae, ASPH = 0x3b3946, DASH = 0xf2e6b0, RAIL = 0xd8d2c8, SCRUB = 0x9aa06e, GREEN = '#2f7d5b';
const EXIT = { '-2400n': 'Mallard Greens', '-900n': 'Northgate', '-900s': 'Palma Vieja', '700n': 'Route 44', '700s': 'Meridian', '2200s': 'Rustwater' };
export const stats = { pillars: 0, signs: 0, ramps: 0, spans: 0 };

// [a, b] with the gaps taken out
function cut(a, b, gaps) {
  let out = [[a, b]];
  for (const [g0, g1] of gaps) out = out.flatMap(([p, q]) => (g1 <= p || g0 >= q ? [[p, q]] : [[p, Math.min(q, g0)], [Math.max(p, g1), q]].filter(([u, v]) => v - u > 0.5)));
  return out;
}
const both = (B, a, b, c, d, col, shade) => { B.quad(a, b, c, d, col, shade); B.quad(d, c, b, a, col, shade); };
const Y = DECK.y, T = DECK.thick;

function ramp(o, r, shell) {
  const B = o.B, xa = r.x0, xb = r.x1, ya = r.dir > 0 ? 0.02 : Y, yb = r.dir > 0 ? Y : 0.02, zo = r.zc + r.side * 5, zi = r.zc - r.side * 5;
  B.quad([xa, ya, r.z1], [xb, yb, r.z1], [xb, yb, r.z0], [xa, ya, r.z0], ASPH);
  for (const z of [zo, zi]) both(B, [xa, 0, z], [xb, 0, z], [xb, yb, z], [xa, ya, z], CONC, 0.85);          // the wedge's sides
  both(B, [r.top, 0, r.z0], [r.top, 0, r.z1], [r.top, Y, r.z1], [r.top, Y, r.z0], CONC, 0.75);
  B.box((r.p0 + r.p1) / 2, Y - T / 2, r.zc, r.p1 - r.p0, T, 10, CONC, { top: ASPH, bottom: true });           // the pad where it joins the deck
  if (shell) return;
  for (const z of [zo, zi]) both(B, [xa, ya, z], [xb, yb, z], [xb, yb + 0.9, z], [xa, ya + 0.9, z], RAIL);
  B.box((r.p0 + r.p1) / 2, Y + 0.45, zo, r.p1 - r.p0, 0.9, 0.5, RAIL);
  o.M.quad([xa, ya + 0.03, r.zc + 0.12], [xb, yb + 0.03, r.zc + 0.12], [xb, yb + 0.03, r.zc - 0.12], [xa, ya + 0.03, r.zc - 0.12], DASH);
  // on the ramp (level 1): a rail each side. On the ground (level 0): the wedge is solid where it is over a metre high.
  o.solid(Math.min(r.foot, r.join), Math.max(r.foot, r.join), zo - 0.25, zo + 0.25, Y + 1, 1);
  o.solid(xa, xb, zi - 0.25, zi + 0.25, Y + 1, 1);
  const h0 = r.foot + r.dir * 12.5;
  o.solid(Math.min(h0, r.top), Math.max(h0, r.top), r.z0, r.z1, Y, 0);
  stats.ramps++;
}

// an exit sign on a gantry over the deck, readable from both ways
function gantry(o, U, x, text) {
  const B = o.B;
  for (const s of [-1, 1]) B.box(x, Y + 3.5, DECK.z + s * 13.6, 0.5, 7, 0.5, 0x6f6a78);
  B.box(x, Y + 7.2, DECK.z, 0.5, 0.6, 27.6, 0x6f6a78);
  for (const s of [-1, 1]) {
    const z = DECK.z + s * 6.5, uv = board(text, GREEN), e = 0.3;
    U.quad([x + e, Y + 5.2, z + 6], [x + e, Y + 5.2, z - 6], [x + e, Y + 8.2, z - 6], [x + e, Y + 8.2, z + 6], 0xffffff, 1, uv);
    U.quad([x - e, Y + 5.2, z - 6], [x - e, Y + 5.2, z + 6], [x - e, Y + 8.2, z + 6], [x - e, Y + 8.2, z - 6], 0xffffff, 1, uv);
    B.box(x, Y + 6.7, z, 0.5, 3.3, 12.4, 0x1f5a41);
  }
  stats.signs++;
}

export default {
  id: 'decks', stats,
  touches: (R) => R.z0 < -1397 && R.z1 > -1520 && R.x1 > DECK.x0 - 40 && R.x0 < DECK.x1 + 40,
  *build(o, chunk, map) {
    const R = chunk.rect, x0 = Math.max(R.x0, DECK.x0), x1 = Math.min(R.x1, DECK.x1), has = R.z0 < DECK.z && R.z1 > DECK.z && x1 > x0;
    // the strip of scrub between the districts, which no district draws
    if (R.z0 < -1440 && R.z1 > -1500 && R.x0 < 1800) o.G.flat(R.x0, Math.min(R.x1, 1800), R.x0 >= 720 ? Math.max(R.z0, -1560) : -1500, -1440, -0.03, SCRUB);
    // the ground roads at the ramps
    for (const p of map.roadsInChunk(chunk.cx, chunk.cz)) {
      if (p.zone !== 'decks' || p.level) continue;
      const nx = (-(p.bz - p.az) / p.len) * 7, nz = ((p.bx - p.ax) / p.len) * 7, y = map.heightAt((p.ax + p.bx) / 2, (p.az + p.bz) / 2, 0) + 0.03;
      const ex = ((p.bx - p.ax) / p.len) * 3, ez = ((p.bz - p.az) / p.len) * 3;
      o.G.quad([p.ax - nx - ex, y, p.az - nz - ez], [p.ax + nx - ex, y, p.az + nz - ez], [p.bx + nx + ex, y, p.bz + nz + ez], [p.bx - nx + ex, y, p.bz - nz + ez], ASPH);
    }
    if (!has) return;
    yield;
    const B = o.B, M = o.M, mid = (x0 + x1) / 2, len = x1 - x0;
    B.box(mid, Y - T / 2, DECK.z, len, T, DECK.half * 2, CONC, { top: ASPH, bottom: true });
    stats.spans++;
    for (const s of [-1, 1]) {
      const z = DECK.z + s * (DECK.half - 0.25);
      for (const [a, b] of cut(x0, x1, RAMPS.filter((r) => r.side === s).map((r) => [r.p0, r.p1]))) { B.box((a + b) / 2, Y + 0.45, z, b - a, 0.9, 0.5, RAIL); o.solid(a, b, z - 0.25, z + 0.25, Y + 1, 1); }
      M.flat(x0, x1, DECK.z + s * 11.2 - 0.1, DECK.z + s * 11.2 + 0.1, Y + 0.02, 0xffffff);
      for (const off of [4, 7.6]) for (let x = Math.ceil(x0 / 12) * 12; x + 4 <= x1; x += 12) M.flat(x, x + 4, DECK.z + s * off - 0.1, DECK.z + s * off + 0.1, Y + 0.02, DASH);
    }
    // the median barrier, open where a ramp joins so a car can reach it from either side
    for (const [a, b] of cut(x0, x1, RAMPS.map((r) => [r.p0, r.p1]))) { B.box((a + b) / 2, Y + 0.4, DECK.z, b - a, 0.8, 0.8, RAIL, { top: 0xffc98f }); o.solid(a, b, DECK.z - 0.4, DECK.z + 0.4, Y + 1, 1); }
    for (const end of [DECK.x0, DECK.x1]) if (end >= R.x0 && end <= R.x1) { B.box(end, Y + 0.6, DECK.z, 0.6, 1.2, 26, 0xff7a1e); o.solid(end - 0.5, end + 0.5, DECK.z - 13, DECK.z + 13, Y + 1.2, 1); }
    yield;
    // a pair of columns and a beam every 40 m, none where a road passes under
    for (let x = Math.ceil(x0 / 40) * 40; x < x1; x += 40) {
      if (UNDER.some((u) => Math.abs(x - u) < 14)) continue;
      for (const s of [-1, 1]) { B.box(x, (Y - T) / 2, DECK.z + s * 8, 1.6, Y - T, 1.6, CONC); o.solid(x - 0.8, x + 0.8, DECK.z + s * 8 - 0.8, DECK.z + s * 8 + 0.8, Y - T, 0); }
      if (!o.low) B.box(x, Y - T - 0.5, DECK.z, 2, 1, 22, CONC, { bottom: true });
      stats.pillars++;
    }
    let U = null;
    for (const r of RAMPS) {
      if (r.top < R.x0 || r.top >= R.x1) continue;
      ramp(o, r, false);
      if (!U) { muralAtlas(o.low ? 1024 : 2048); U = new MeshBuilder({ uv: true, size: 64 }); }
      gantry(o, U, r.top - r.dir * 30, EXIT[r.x + (r.side < 0 ? 'n' : 's')]);
    }
    if (U) o.object(muralMesh(U));
  },
  // far away: the slab and the ramps
  shell(o, chunk) {
    const R = chunk.rect, x0 = Math.max(R.x0, DECK.x0), x1 = Math.min(R.x1, DECK.x1);
    if (!(R.z0 < DECK.z && R.z1 > DECK.z && x1 > x0)) return;
    o.B.box((x0 + x1) / 2, Y - T / 2, DECK.z, x1 - x0, T, DECK.half * 2, CONC, { top: ASPH, bottom: true });
    for (let x = Math.ceil(x0 / 80) * 80; x < x1; x += 80) o.B.box(x, (Y - T) / 2, DECK.z, 1.6, Y - T, 18, CONC, { noTop: true });
    for (const r of RAMPS) if (r.top >= R.x0 && r.top < R.x1) ramp(o, r, true);
  },
};
