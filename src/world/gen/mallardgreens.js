// The Mallard Greens kit (plan/bible/world/mallard-greens.md): lawn, curving lanes drawn as
// ribbons, three house models in the four approved colours, the golf course, Lake Serenity and
// its jets, the wall and hedge, the Gatehouse. Houses stand at any angle, so they are drawn in
// their own frame and their colliders are turned boxes.
import * as THREE from 'three';
import { rng } from '../../core/rng.js';
import { MeshBuilder } from '../../gfx/builder.js';
import { TRIM, ROOF, GLASS } from './kit.js';
import { prism, paintInto } from './streets.js';
import { board, muralMesh, muralAtlas } from '../../gfx/murals.js';
import { WALL, LAKE, GATE, PONDS, HOLES } from '../zones/mallardgreens.js';

const LAWN = 0x3fb86a, FAIR = 0x58cc7c, PUTT = 0x9be89a, SCRUB = 0x9aa06e, ASPH = 0x4a4754, SAGE = 0xb7c9a8, WATER = 0x7fd6e8, HEDGE = 0x3d6b4a, CREAM = 0xf5ecd7, DRIVE = 0xd6cdc4;
export const stats = { houses: 0, trees: 0, greens: 0, flags: 0, jets: 0, walls: 0, lamps: 0, bulbs: 0, sprinklers: 0, tallest: 0 };
// Every lawn's sprinkler shares this material: clubclock.mod.js shows it at 06:00, 18:00 and 15:15 for ten game minutes, all on the same second.
export const sprinklerMaterial = new THREE.MeshBasicMaterial({ color: 0xe8fbff, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false, visible: false });
function sprinklerMesh(list) {
  const b = new MeshBuilder({ size: 256 });
  for (let i = 0; i < list.length; i += 2) for (let k = 0; k < 4; k++) {
    const a = k * 1.571 + i, dx = Math.sin(a), dz = Math.cos(a), x = list[i], z = list[i + 1];
    b.tri([x, 0.15, z], [x + dx * 2.4, 1.5, z + dz * 2.4], [x + dx * 3.8, 0.05, z + dz * 3.8], 0xffffff);
  }
  return new THREE.Mesh(b.build({ free: true }), sprinklerMaterial);
}
const inR = (R, x, z) => x >= R.x0 && x < R.x1 && z >= R.z0 && z < R.z1;

// a flat strip along a road piece (or any a to b), `half` wide each side
export function ribbon(M, ax, az, bx, bz, half, y, col, ext = 1.2) {
  const len = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / len, uz = (bz - az) / len, nx = -uz * half, nz = ux * half;
  ax -= ux * ext; az -= uz * ext; bx += ux * ext; bz += uz * ext;
  M.quad([ax - nx, y, az - nz], [ax + nx, y, az + nz], [bx + nx, y, bz + nz], [bx - nx, y, bz - nz], col);
}

// One house. Local +z is the front (it looks at the lane), local x runs along the lane.
export function house(o, lot, shell) {
  const { cx, cz, rot, w, d } = lot, cs = Math.cos(rot), sn = Math.sin(rot), B = o.B, two = lot.recipe === 'mg-two', villa = lot.recipe === 'mg-villa';
  const L = (lx, lz, y = 0) => [cx + lx * cs + lz * sn, y, cz - lx * sn + lz * cs];
  const h = two ? 6 : 3.2, mw = two ? 14 : w, P = L(two ? 3 : 0, 0), G = L(-7, 2.5);
  B.box(P[0], h / 2, P[2], mw, h, d, lot.wall, { rot, noTop: true });
  B.box(P[0], h + 1.2, P[2], mw + 1, 2.4, d + 1, ROOF, { rot, taper: [0.45, 0.06] });            // the hip roof, 22 degrees
  if (two) B.box(G[0], 1.4, G[2], 6, 2.8, 7, lot.wall, { rot, top: ROOF });                     // the Drake's garage
  if (shell) return;
  const fq = (lx, y, ww, hh, col, zf = d / 2 + 0.05, M = B) => M.quad(L(lx - ww / 2, zf, y - hh / 2), L(lx + ww / 2, zf, y - hh / 2), L(lx + ww / 2, zf, y + hh / 2), L(lx - ww / 2, zf, y + hh / 2), col);
  const light = (lx) => { const q = L(lx, d / 2 + 0.2, 2.2); o.N.box(q[0], q[1], q[2], 0.25, 0.25, 0.25, 0xffd58a); };
  const garages = villa ? [-8, 8] : [two ? -7 : -5.5], doors = villa ? [-3.4, 3.4] : [two ? 1 : 2];
  for (const gx of garages) {
    fq(gx, 1.2, 5, 2.4, TRIM, two ? 6.05 : undefined);
    o.G.quad(L(gx - 2.7, d / 2 + 8.6, 0.04), L(gx + 2.7, d / 2 + 8.6, 0.04), L(gx + 2.7, d / 2, 0.04), L(gx - 2.7, d / 2, 0.04), DRIVE);        // the driveway
  }
  for (const dx of doors) { fq(dx, 1.05, 1, 2.1, 0x6f6a78); light(dx); }
  for (const wx of villa ? [-1.3, 1.3] : two ? [6] : [5.5, -0.8]) { fq(wx, 1.7, villa ? 1.6 : 2.2, 1.2, GLASS); if (o.rnd() < 0.3) fq(wx, 1.7, villa ? 1.6 : 2.2, 1.2, 0xffd58a, d / 2 + 0.08, o.L); }
  if (two) {                                                                                     // upstairs, and the balcony nobody stands on
    fq(1, 4.5, 1.6, 1.2, GLASS); fq(6, 4.5, 2.2, 1.2, GLASS);
    const b = L(3, d / 2 + 0.6); B.box(b[0], 3.05, b[2], 5, 0.12, 1.2, TRIM, { rot, bottom: true }); fq(3, 3.6, 5, 0.9, TRIM, d / 2 + 1.2);
  } else if (!villa && !o.low) {                                                                 // the Mallard's porch on two posts
    const s = L(2, d / 2 + 0.9); B.box(s[0], 2.7, s[2], 2.8, 0.15, 1.8, TRIM, { rot, bottom: true });
    for (const px of [0.8, 3.2]) { const q = L(px, d / 2 + 1.7); B.box(q[0], 1.35, q[2], 0.15, 2.7, 0.15, TRIM, { noTop: true }); }
  }
  // one tree, provided; the mailbox at the kerb
  const t = L(villa ? 0 : w / 2 - 2.5, d / 2 + 4.6), m = L(garages[0] + 3.6, d / 2 + 7.7);
  B.box(t[0], 1.1, t[2], 0.4, 2.2, 0.4, 0x8a6f55, { noTop: true });
  B.box(t[0], 3.3, t[2], 2.7, 2.7, 2.7, 0x2f9e58, { rot }); if (!o.low) B.box(t[0], 3.3, t[2], 2.7, 2.7, 2.7, 0x35a85e, { rot: rot + Math.PI / 4 });
  o.solid(t[0] - 0.3, t[0] + 0.3, t[2] - 0.3, t[2] + 0.3, 2);
  B.box(m[0], 0.6, m[2], 0.3, 1.2, 0.3, TRIM, { top: ROOF });
  const sp = L(villa ? 5 : -1.5, d / 2 + 4.8); (o.spr || (o.spr = [])).push(sp[0], sp[2]); stats.sprinklers++;
  if (lot.show && !o.low) for (const fx of [-9.5, 9.5]) { const q = L(fx, d / 2 + 7.2); B.box(q[0], 2.5, q[2], 0.6, 4, 0.08, 0x7fd6e8, { rot, taper: [0.4, 1] }); }
  o.obb(P[0], P[2], mw / 2, d / 2, rot, h + 2.4);
  if (two) o.obb(G[0], G[2], 3, 3.5, rot, 2.8);
  stats.houses++; stats.trees++; stats.tallest = Math.max(stats.tallest, h + 2.4);
}

// the wall, the hedge and the fence, as thin rectangles with their three openings cut out
const WALLS = [
  [WALL.east - 0.2, WALL.east + 0.2, WALL.north, -1822, 2.4, CREAM], [WALL.east - 0.2, WALL.east + 0.2, -1794, WALL.south, 2.4, CREAM],
  [WALL.west, -2008, WALL.south - 0.2, WALL.south + 0.2, 2.4, CREAM], [-1992, WALL.east, WALL.south - 0.2, WALL.south + 0.2, 2.4, CREAM],
  [WALL.jogX, -2450.9, WALL.north - 1, WALL.north + 1, 3, HEDGE], [-2449.1, WALL.east, WALL.north - 1, WALL.north + 1, 3, HEDGE],
  [WALL.jogX - 1, WALL.jogX + 1, WALL.jogZ, WALL.north, 3, HEDGE], [WALL.west, WALL.jogX, WALL.jogZ - 1, WALL.jogZ + 1, 3, HEDGE],
  [WALL.west - 0.15, WALL.west + 0.15, WALL.jogZ, WALL.south, 2.4, CREAM],
];
function walls(o, R, shell) {
  for (const [x0, x1, z0, z1, h, col] of WALLS) {
    const a = Math.max(x0, R.x0), b = Math.min(x1, R.x1), c = Math.max(z0, R.z0), d = Math.min(z1, R.z1);
    if (b - a < 0.05 || d - c < 0.05) continue;
    o.B.box((a + b) / 2, h / 2, (c + d) / 2, b - a, h, d - c, col);
    if (!shell) { o.solid(a, b, c, d, h); stats.walls++; }
  }
}
// fairways, greens and their flags, the three ponds, Lake Serenity and its jets
function course(o, R, shell) {
  const G = shell ? o.B : o.G;
  for (const h of HOLES) {
    const len = Math.hypot(h.gx - h.tx, h.gz - h.tz), n = Math.ceil(len / 40);
    for (let i = 0; i < n; i++) {
      const ax = h.tx + ((h.gx - h.tx) * i) / n, az = h.tz + ((h.gz - h.tz) * i) / n, bx = h.tx + ((h.gx - h.tx) * (i + 1)) / n, bz = h.tz + ((h.gz - h.tz) * (i + 1)) / n;
      if (inR(R, (ax + bx) / 2, (az + bz) / 2)) ribbon(G, ax, az, bx, bz, h.half, 0.015, FAIR, i === 0 || i === n - 1 ? 12 : 0.5);
    }
    if (shell || !inR(R, h.gx, h.gz)) continue;
    prism(G, h.gx, h.gz, 12, 0, 0.03, PUTT, { n: 12 });
    o.B.box(h.gx, 1.2, h.gz, 0.08, 2.4, 0.08, TRIM); o.B.box(h.gx + 0.45, 2.1, h.gz, 0.9, 0.5, 0.04, 0xff5a5a);
    stats.greens++; stats.flags++;
  }
  for (const [x, z, r] of PONDS) if (inR(R, x, z)) { prism(G, x, z, r, 0, 0.04, WATER, { n: 10 }); if (!shell) { o.B.box(x, 2, z, 0.3, 4, 0.3, 0xe8fbff, { taper: [0.3, 0.3] }); stats.jets++; } }
  const step = shell ? 40 : 10;
  for (let z = Math.ceil(Math.max(R.z0, LAKE.z - LAKE.b) / step) * step; z < Math.min(R.z1, LAKE.z + LAKE.b); z += step) {
    const k = 1 - ((z + step / 2 - LAKE.z) / LAKE.b) ** 2;
    if (k <= 0) continue;
    const hw = LAKE.a * Math.sqrt(k), x0 = Math.max(R.x0, LAKE.x - hw), x1 = Math.min(R.x1, LAKE.x + hw);
    if (x1 > x0) G.flat(x0, x1, z, z + step, 0.04, WATER);
  }
  if (shell) return;
  const jets = [[LAKE.x, LAKE.z, 12]];
  for (let i = 0; i < 6; i++) jets.push([LAKE.x + Math.sin(i * 1.047) * 90, LAKE.z + Math.cos(i * 1.047) * 90, 3]);
  for (const [x, z, h] of jets) if (inR(R, x, z)) { if (h > 4) o.B.box(x, 0.3, z, 3, 0.5, 3, TRIM); o.B.box(x, h / 2 + 0.3, z, h > 4 ? 0.6 : 0.3, h, h > 4 ? 0.6 : 0.3, 0xe8fbff, { taper: [0.25, 0.25] }); stats.jets++; }
}
// the Gatehouse: a tiny hut under a wide canopy, two striped arms (up), the sign wall with its duck
function gatehouse(o) {
  const B = o.B, { x, z } = GATE;
  B.box(x, 4.75, z, 10, 0.5, 18, TRIM, { bottom: true });
  B.box(x, 2.25, z - 8.5, 0.8, 4.5, 0.8, CREAM); o.solid(x - 0.4, x + 0.4, z - 8.9, z - 8.1, 4.5);
  B.box(x, 1.6, z + 8.2, 5, 3.2, 4, CREAM); B.box(x, 3.7, z + 8.2, 5.6, 1, 4.6, ROOF, { taper: [0.3, 0.3] }); o.solid(x - 2.5, x + 2.5, z + 6.2, z + 10.2, 4);
  B.quad([x + 1.5, 1.2, z + 6.15], [x - 1.5, 1.2, z + 6.15], [x - 1.5, 2.4, z + 6.15], [x + 1.5, 2.4, z + 6.15], GLASS);                 // the window onto the lane
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) B.box(x + s * 3, 1.4 + i * 0.85, z + s * (5.6 - i * 0.5), 0.14, 1, 0.14, i % 2 ? SAGE : 0xffffff, { shift: [0, -s * 0.5] });
  B.box(x + 14, 1.2, z - 12, 1, 2.4, 12, CREAM); o.solid(x + 13.5, x + 14.5, z - 18, z - 6, 2.4);                 // the sign wall, facing the approach
  B.box(x + 14, 2.9, z - 12, 0.6, 0.7, 1.1, 0xffc300); B.box(x + 14.2, 3.4, z - 11.6, 0.4, 0.45, 0.5, 0x2f9e58); B.box(x + 14.5, 3.35, z - 11.6, 0.3, 0.14, 0.3, 0xffa02e);   // a box duck
  paintInto(o).quad([x + 14.52, 0.9, z - 16], [x + 14.52, 0.9, z - 8], [x + 14.52, 2.9, z - 8], [x + 14.52, 2.9, z - 16], 0xffffff, 1, board('Mallard Greens', '#2f7d5b'));
}

export default {
  id: 'mallardgreens', stats,
  *build(o, chunk, map, heroes) {
    const R = chunk.rect, zn = map.zone('mallardgreens'), x0 = Math.max(R.x0, zn.bounds.x0), x1 = Math.min(R.x1, zn.bounds.x1), z0 = Math.max(R.z0, zn.bounds.z0), z1 = Math.min(R.z1, zn.bounds.z1);
    muralAtlas(o.low ? 1024 : 2048);
    o.G.flat(x0, x1, z0, z1, 0, LAWN);
    if (z1 > WALL.south) o.G.flat(x0, x1, WALL.south, z1, 0.01, SCRUB);                           // outside the south wall
    if (z0 < WALL.north && x1 > WALL.jogX) o.G.flat(Math.max(x0, WALL.jogX), x1, z0, Math.min(z1, WALL.north), 0.01, SCRUB);     // the Easement
    course(o, R, false);
    yield;
    // lanes: asphalt ribbons, sage cart lanes on Fairway Drive, a bulb at every dead end, a lamp every other piece
    for (const p of map.roadsInChunk(chunk.cx, chunk.cz)) {
      if (p.zone !== 'mallardgreens') continue;
      if (p.roadId.startsWith('fairway-drive')) ribbon(o.G, p.ax, p.az, p.bx, p.bz, 7, 0.045, SAGE);
      ribbon(o.G, p.ax, p.az, p.bx, p.bz, p.width / 2, 0.05, ASPH);
      if (p.kind !== 'lane') { ribbon(o.M, p.ax, p.az, p.bx, p.bz, 0.12, 0.07, 0xf2e6b0, -3); continue; }
      for (const [k, x, z] of [[p.a, p.ax, p.az], [p.b, p.bx, p.bz]]) if (map.nodes.get(k).pieces.length === 1) { prism(o.G, x, z, 14, 0, 0.05, ASPH, { n: 12 }); stats.bulbs++; }
      const i = +p.id.slice(p.id.lastIndexOf(':') + 1);
      if (i % (o.low ? 4 : 2) === 0) { const ux = (p.bx - p.ax) / p.len, uz = (p.bz - p.az) / p.len; o.prop('lamp', p.ax - uz * 6.3, 0, p.az + ux * 6.3, Math.atan2(uz, -ux)); stats.lamps++; }
    }
    yield;
    for (const lot of map.lotsInChunk(chunk.cx, chunk.cz)) {
      if (lot.zone !== 'mallardgreens') continue;
      o.rnd = rng(lot.seed || 7);
      if (lot.hero) { if (heroes[lot.hero]) heroes[lot.hero].build(o, lot, map); } else house(o, lot, false);
      yield;
    }
    walls(o, R, false);
    if (inR(R, GATE.x, GATE.z)) gatehouse(o);
    if (inR(R, -2009, -1546)) { o.B.box(-2009, 1.5, -1546, 3, 3, 3, 0xc9cdd4, { top: ROOF }); o.solid(-2010.5, -2007.5, -1547.5, -1544.5, 3); }       // the south gate's empty hut
    if (o.U && o.U.count) o.object(muralMesh(o.U));
    if (o.spr && o.spr.length) o.object(sprinklerMesh(o.spr));
  },
  // far away: lawn, lanes, fairways, the lake, a box and a roof for each house, the wall
  shell(o, chunk, map, heroes) {
    const R = chunk.rect, zn = map.zone('mallardgreens'), x0 = Math.max(R.x0, zn.bounds.x0), x1 = Math.min(R.x1, zn.bounds.x1);
    if (x1 <= x0) return;
    o.B.flat(x0, x1, Math.max(R.z0, zn.bounds.z0), Math.min(R.z1, zn.bounds.z1), 0, LAWN);
    course(o, R, true);
    for (const p of map.roadsInChunk(chunk.cx, chunk.cz)) if (p.zone === 'mallardgreens') ribbon(o.B, p.ax, p.az, p.bx, p.bz, p.width / 2, 0.05, ASPH);
    for (const lot of map.lotsInChunk(chunk.cx, chunk.cz)) {
      if (lot.zone !== 'mallardgreens') continue;
      if (lot.hero) { if (heroes[lot.hero] && heroes[lot.hero].shell) heroes[lot.hero].shell(o, lot, {}); } else house(o, lot, true);
    }
    walls(o, R, true);
  },
};
