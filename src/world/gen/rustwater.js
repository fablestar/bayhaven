// The port kit: Rustwater's part of a chunk (gen/streets.js builds the chunk and calls in here).
// Two recipes from plan/bible/world/rustwater.md: R1 container stacks in six colours, as instances,
// and R2 transit sheds. Also the yards, the port railway along z = -277, the quay edge and the
// 18 m sodium masts. R3 to R6 are tier B and their lots are R2 until they ship.
import { rng } from '../../core/rng.js';
import { CURB, wallQuad, span, cellBox, wallSlab } from './kit.js';
import { register, generator, container, CONTAINER } from './streets.js';
import { QUAY, RAIL_Z, COLOURS } from '../zones/rustwater.js';
import { stats as craneStats } from '../landmarks/gantry-crane.js';

const ASPHALT = 0x45414a, CONCRETE = 0x8f8c96, RUST = 0xb5532f, YELLOW = 0xffc300, INK = 0x24212b, SODIUM = 0xff9a3c, ROOF = 0x6f6a78, STEEL = 0x5b5660, TIE = 0x4a3f38;
const hit = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.z0 < b.z1 && a.z1 > b.z0;
const stats = { stacks: 0, sheds: 0, masts: 0, wagons: 0, bollards: 0, lampColours: [SODIUM], containerColours: COLOURS.slice(), crane: craneStats };

// ---------- sodium light ----------
// an 18 m mast with four heads; the orange pool under it is drawn at night only
export function mast(o, x, z, y = CURB) {
  stats.masts++;
  o.B.box(x, y + 9, z, 0.5, 18, 0.5, 0x2b2838, { noTop: true });
  o.B.box(x, y + 18.1, z, 3.4, 0.3, 3.4, 0x2b2838, { bottom: true });
  for (const [dx, dz] of [[-1.3, -1.3], [1.3, -1.3], [-1.3, 1.3], [1.3, 1.3]]) o.N.box(x + dx, y + 17.8, z + dz, 0.9, 0.3, 0.9, SODIUM);
  for (const [r, s] of [[16, 0.1], [10, 0.12], [5, 0.16]]) o.L.flat(x - r, x + r, z - r, z + r, y + 0.07, SODIUM, s);
  o.solid(x - 0.4, x + 0.4, z - 0.4, z + 0.4, 18);
}

// ---------- R1: container stacks ----------
// Runs of three bays (containers end to end along x) and four rows, with 6 m truck aisles between
// runs. The grid hangs from (ox, oz) so the pieces of one yard line up across chunk edges.
const BAY = CONTAINER.l + 0.4, ROW = CONTAINER.w + 0.3, RUN_X = 3 * BAY + 6, RUN_Z = 4 * ROW + 6;
function stacks(o, area, piece, ox, oz, masts) {
  const rnd = o.rnd, maxH = o.low ? 3 : 5;
  const i0 = Math.ceil((piece.x0 - ox) / RUN_X), j0 = Math.ceil((piece.z0 - oz) / RUN_Z);
  for (let i = i0; ox + i * RUN_X < piece.x1; i++) for (let j = j0; oz + j * RUN_Z < piece.z1; j++) {
    const x0 = ox + i * RUN_X, z0 = oz + j * RUN_Z, x1 = x0 + 3 * BAY - 0.4, z1 = z0 + 4 * ROW - 0.3;
    if (x1 > area.x1 || z1 > area.z1) continue;
    if (z0 < RAIL_Z + 6 && z1 > RAIL_Z - 6 && x0 < 2900) continue;          // the railway runs through the south yard
    if (masts && i % 2 === 0 && j % 4 === 0) mast(o, x0 - 3, z0 - 3);
    let top = 0;
    for (let b = 0; b < 3; b++) for (let r = 0; r < 4; r++) {
      let n = rnd() < 0.1 ? 0 : 1 + Math.floor(rnd() * rnd() * 5.99);
      if (o.low && (b + r + i + j) % 2 && n > 1) n = 1;                   // phones: half the stacks are a single box
      n = Math.min(n, maxH); top = Math.max(top, n);
      for (let k = 0; k < n; k++) container(o, x0 + b * BAY + CONTAINER.l / 2, CURB + k * CONTAINER.h, z0 + r * ROW + CONTAINER.w / 2, false, COLOURS[Math.floor(rnd() * 6)]);
    }
    if (top) { stats.stacks++; o.solid(x0, x1, z0, z1, top * CONTAINER.h); }
  }
}
// far away a column of runs is one box, on the same grid as the real stacks
const stackShell = (o, areaX1, piece, ox) => {
  for (let i = Math.ceil((piece.x0 - ox) / RUN_X); ox + i * RUN_X < piece.x1; i++) {
    const x0 = ox + i * RUN_X, x1 = x0 + 3 * BAY - 0.4;
    if (x1 <= areaX1 && piece.z1 - piece.z0 > 8) o.B.box((x0 + x1) / 2, 3.9, (piece.z0 + piece.z1) / 2, x1 - x0, 7.8, piece.z1 - piece.z0 - 6, COLOURS[(i + 6) % 6], { top: COLOURS[(i + 9) % 6] });
  }
};

// ---------- R2: transit shed ----------
function shed(o, lot) {
  stats.sheds++;
  const c = lot.body, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2, w = c.x1 - c.x0, d = c.z1 - c.z0, alongX = w >= d;
  o.G.flat(lot.x0, lot.x1, lot.z0, lot.z1, CURB + 0.012, CONCRETE);
  o.B.box(cx, 5, cz, w, 10, d, RUST, { noTop: true });
  o.B.box(cx, 11.5, cz, w + 0.8, 3, d + 0.8, ROOF, { taper: alongX ? [1, 0.06] : [0.06, 1], bottom: true });
  o.B.box(cx, 13.3, cz, alongX ? w * 0.7 : 1.6, 0.7, alongX ? 1.6 : d * 0.7, STEEL);                  // the ridge vent
  o.B.box(cx, 1, cz, w + 0.3, 2, d + 0.3, YELLOW, { noTop: true });                                    // the hazard band
  const stripe = o.low ? 6 : 3;
  for (const side of ['s', 'n', 'e', 'w']) {
    const [a, b] = span(c, side);
    for (let u = a + 1.2; u < b - 0.6; u += stripe) o.B.quad(...wallQuad(c, side, u, 1, 1.1, 2, 0.17).map((p, i) => (i > 1 ? [p[0] + (side === 's' || side === 'n' ? 0.9 : 0), p[1], p[2] + (side === 'e' || side === 'w' ? 0.9 : 0)] : p)), INK);
    if (!o.low) for (let u = a + 2.5; u < b - 2; u += 5) o.B.quad(...wallQuad(c, side, u, 6, 0.25, 7.6, 0.03), RUST, 0.8);       // corrugation
  }
  // four dock doors 4 x 4.5 on a 1.2 m platform, on the long street face, with a lamp over each
  const face = alongX ? 's' : 'e', [a, b] = span(c, face), step = (b - a) / 4;
  cellBox(o, wallSlab(c, face, (a + b) / 2, (b - a) / 2 - 2, 3), 0, 1.2, CONCRETE);
  for (let i = 0; i < 4; i++) {
    const u = a + (i + 0.5) * step;
    o.B.quad(...wallQuad(c, face, u, 3.45, 4, 4.5, 0.2), i % 2 ? 0x8f8c96 : INK);
    const lamp = wallSlab(c, face, u, 0.4, 0.5);
    o.N.box((lamp.x0 + lamp.x1) / 2, 6.3, (lamp.z0 + lamp.z1) / 2, lamp.x1 - lamp.x0, 0.25, lamp.z1 - lamp.z0, SODIUM);
    o.L.quad(...wallQuad(c, face, u, 3.45, 4, 4.5, 0.24), SODIUM, 0.22);
  }
  const p = wallSlab(c, face, (a + b) / 2, (b - a) / 2 - 2, 3);
  o.solid(c.x0 - 0.15, c.x1 + 0.15, c.z0 - 0.15, c.z1 + 0.15, 13); o.solid(p.x0, p.x1, p.z0, p.z1, 1.2);
}

// ---------- yards ----------
// a mesh fence round a yard, with a gate gap in the middle of each side
function fence(o, r, col = 0x9aa3ad) {
  for (const [x0, x1, z0, z1] of [[r.x0, r.x1, r.z0, r.z0], [r.x0, r.x1, r.z1, r.z1], [r.x0, r.x0, r.z0, r.z1], [r.x1, r.x1, r.z0, r.z1]]) {
    const ns = x0 === x1, a = ns ? z0 : x0, b = ns ? z1 : x1, mid = (a + b) / 2;
    for (const [u0, u1] of [[a, mid - 6], [mid + 6, b]]) {
      if (ns) { o.B.box(x0, CURB + 1.5, (u0 + u1) / 2, 0.12, 3, u1 - u0, col, { bottom: true }); o.solid(x0 - 0.2, x0 + 0.2, u0, u1, 3); }
      else { o.B.box((u0 + u1) / 2, CURB + 1.5, z0, u1 - u0, 3, 0.12, col, { bottom: true }); o.solid(u0, u1, z0 - 0.2, z0 + 0.2, 3); }
    }
    for (const u of [mid - 6, mid + 6]) o.B.box(ns ? x0 : u, CURB + 1.7, ns ? u : z0, 0.5, 3.4, 0.5, YELLOW);
  }
}
// a flat wagon 14 x 2.8 x 1.2 carrying one container
function wagon(o, x, z) {
  stats.wagons++;
  o.B.box(x, CURB + 0.75, z, 14, 0.5, 2.8, STEEL, { bottom: true });
  for (const dx of [-5, 5]) o.B.box(x + dx, CURB + 0.3, z, 2.4, 0.5, 2, INK);
  container(o, x, CURB + 1.0, z, false, COLOURS[Math.floor(o.rnd() * 6)]);
  o.solid(x - 7, x + 7, z - 1.4, z + 1.4, 3.6);
}
const SIDINGS = [-330, -315, -300, -254, -239, -224];
function yard(o, lot) {
  o.rnd = rng((lot.x0 * 31 + lot.z0 * 17) | 0);
  if (lot.kind === 'stacks') { stacks(o, { x1: Math.min(lot.yx1, 2893), z1: lot.yz1 }, lot, lot.ox + 4, lot.oz + 4, true); return; }
  o.G.flat(lot.x0, lot.x1, lot.z0, lot.z1, CURB + 0.012, lot.ground);
  fence(o, lot);
  if (lot.kind === 'rail') {
    for (const z of SIDINGS) for (let x = lot.x0 + 30 + o.rnd() * 40; x < lot.x1 - 30; x += 16 + (o.rnd() < 0.35 ? 0 : 50 + o.rnd() * 60)) if (!o.low || o.rnd() < 0.6) wagon(o, x, z);
    for (const x of [lot.x0 + 40, (lot.x0 + lot.x1) / 2, lot.x1 - 40]) mast(o, x, RAIL_Z - 8);
  } else {
    for (let x = lot.x0 + 30; x < lot.x1 - 20; x += 80) for (let z = lot.z0 + 30; z < lot.z1 - 20; z += 80) mast(o, x, z);
  }
}

// ---------- the ground: asphalt to the quay edge, the quay wall, the rails ----------
function track(o, x0, x1, z, sleepers, y) {
  o.M.flat(x0, x1, z - 1.6, z + 1.6, y + 0.03, 0x5a554e);
  if (sleepers) for (let x = Math.ceil(x0 / 2.4) * 2.4; x < x1; x += 2.4) o.M.flat(x - 0.35, x + 0.35, z - 1.25, z + 1.25, y + 0.05, TIE);
  for (const dz of [-0.72, 0.72]) o.B.box((x0 + x1) / 2, 0.14, z + dz, x1 - x0, 0.28, 0.14, 0xb9b4b0);
}
function ground(o, r, chunk, map) {
  const zone = map.zone('rustwater'), x1 = Math.min(r.x1, QUAY.x1), z1 = Math.min(r.z1, QUAY.z1);
  if (x1 <= r.x0 || z1 <= r.z0) return;
  if (r.z0 < 44) o.G.flat(r.x0, x1, r.z0, Math.min(z1, 44), 0, ASPHALT);
  if (z1 > 44) o.G.flat(r.x0, x1, Math.max(r.z0, 44), z1, 0, CONCRETE);
  // the quay wall and its edge: a low yellow kerb you cannot drive over, a bollard every 20 m
  if (r.x1 > QUAY.x1 && r.x0 <= QUAY.x1) {
    const x = QUAY.x1;
    o.B.quad([x, -6, r.z0], [x, -6, z1], [x, 0.2, z1], [x, 0.2, r.z0], 0x6f6a78);
    o.B.box(x - 0.3, 0.3, (r.z0 + z1) / 2, 0.6, 0.6, z1 - r.z0, YELLOW);
    o.solid(x - 0.7, x + 0.3, r.z0, z1, 1.2);
    for (let z = Math.ceil(r.z0 / 20) * 20; z < z1; z += 20) { o.B.box(x - 1.4, 0.55, z, 0.6, 0.9, 0.6, INK, { taper: [1.4, 1.4] }); stats.bollards++; }
  }
  if (r.z1 > QUAY.z1 && r.z0 <= QUAY.z1) {
    const z = QUAY.z1;
    o.B.quad([r.x0, -6, z], [x1, -6, z], [x1, 0.2, z], [r.x0, 0.2, z], 0x6f6a78);
    o.B.box((r.x0 + x1) / 2, 0.3, z - 0.3, x1 - r.x0, 0.6, 0.6, YELLOW);
    o.solid(r.x0, x1, z - 0.7, z + 0.3, 1.2);
    for (let x = Math.ceil(r.x0 / 20) * 20; x < x1; x += 20) { o.B.box(x, 0.55, z - 1.4, 0.6, 0.9, 0.6, INK, { taper: [1.4, 1.4] }); stats.bollards++; }
  }
  // the port railway: one track along z = -277 from the district line to a buffer at x = 2900, six sidings in the rail yard
  if (r.z0 < RAIL_Z && r.z1 > RAIL_Z) {
    const a = Math.max(r.x0, 1800), b = Math.min(r.x1, 2900);
    if (b > a) track(o, a, b, RAIL_Z, !o.low, 0);       // on the road's level; inside a yard only the rails show above the paving
    if (r.x0 < 2900 && r.x1 >= 2900) { o.B.box(2901, CURB + 0.9, RAIL_Z, 1.2, 1.8, 3.2, YELLOW); o.B.box(2900.3, CURB + 1.1, RAIL_Z, 0.3, 0.6, 3.4, 0xbf4343); o.solid(2900, 2902, RAIL_Z - 1.7, RAIL_Z + 1.7, 2); }
  }
  const ry = zone.yards.find((y) => y.kind === 'rail');
  if (hit(ry, r)) for (const z of SIDINGS) if (z > r.z0 && z < r.z1) { const a = Math.max(r.x0, ry.x0 + 12), b = Math.min(r.x1, ry.x1 - 12); if (b > a) track(o, a, b, z, false, CURB); }
}

// ---------- blocks ----------
const yardsOf = (b) => b.zone.yards;
// the sidewalk slab of a block: none inside a yard (the yard is paved already), cut off at the quay edge
function blockRect(b) {
  if (b.x0 >= QUAY.x1 || yardsOf(b).some((y) => hit(y, b)) || hit(b.zone.apron, b)) return null;
  return b.x1 > QUAY.x1 ? { x0: b.x0, x1: QUAY.x1, z0: b.z0, z1: b.z1 } : b;
}
function furniture(o, b) {
  if (!blockRect(b) || b.x1 - b.x0 < 30) return;
  const xs = o.low ? [(b.x0 + b.x1) / 2] : [b.x0 + 12, Math.min(b.x1, QUAY.x1) - 12];
  for (const x of xs) { mast(o, x, b.z1 - 1.2); if (b.z1 - b.z0 > 40) mast(o, x + (o.low ? 0 : 6), b.z0 + 1.2); }
  // hazard-striped bollards at the block's corners
  if (!o.low) for (const x of [b.x0 + 0.8, b.x1 - 0.8]) for (const z of [b.z0 + 0.8, b.z1 - 0.8]) if (x < QUAY.x1) { o.B.box(x, CURB + 0.45, z, 0.3, 0.9, 0.3, YELLOW); o.B.box(x, CURB + 0.45, z, 0.34, 0.25, 0.34, INK); stats.bollards++; }
}
// the quay apron under the cranes, and the lit strip beside the south quay
function street(o, p, map, chunk) {
  if (p.roadId !== 'breakwater-road' && p.roadId !== 'gunwale-road') return;
  const ns = p.axis === 'ns', a = ns ? p.az : p.ax, b = ns ? p.bz : p.bx;
  for (let t = a + 20; t < b - 10; t += 60) { if (ns) mast(o, 2946, t, CURB); else mast(o, t, 48, 0); }
}

function lot(o, L) {
  if (L.reserved) return yard(o, L);
  if (L.recipe === 'R1') { o.G.flat(L.x0, L.x1, L.z0, L.z1, CURB + 0.012, CONCRETE); stacks(o, L.body, L.body, L.body.x0 + 0.5, L.body.z0 + 0.5, false); return; }
  shed(o, L);
}
function shellLot(o, L) {
  if (L.reserved) {
    if (L.kind === 'stacks') stackShell(o, Math.min(L.yx1, 2893), L, L.ox + 4);
    else o.B.flat(L.x0, L.x1, L.z0, L.z1, CURB + 0.02, L.ground);
    return;
  }
  const c = L.body;
  if (L.recipe === 'R1') stackShell(o, c.x1, c, c.x0 + 0.5);
  else o.B.box((c.x0 + c.x1) / 2, 5.75, (c.z0 + c.z1) / 2, c.x1 - c.x0, 11.5, c.z1 - c.z0, RUST, { top: ROOF });
}

register('rustwater', { asphalt: ASPHALT, pave: 0xb9b4b0, ground, blockRect, lot, furniture, street, shellLot });
export default generator('rustwater', stats);
