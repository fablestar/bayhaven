// The old-quarter kit: Palma Vieja's shop-houses, awnings, tiled roof strips, hand-painted boards
// and the strings of bulbs across its streets (plan/bible/world/palma-vieja.md). P1, the shop-house,
// is the one recipe built; P2 to P6 are tier B and their lots are shop-houses until they ship.
import { TRIM, ROOF, GLASS, CURB, wallQuad, span, wallSlab, cellBox } from './kit.js';
import { register, generator, paintInto, wallEnds } from './streets.js';
import { board, muralWall, PALMA } from '../../gfx/murals.js';

export const TILE = 0xa8553a, BULB = 0xfff2cc, PAVE = 0xe9b9a2;
const STRIPES = [0xfdf6ea, 0xff5a5a, 0x2ec4b6, 0xffb347, 0xff6f91];
const css = (n) => '#' + n.toString(16).padStart(6, '0');
// canon names and painted words from the bible's sign list (section 8)
const BOARDS = ['Abierto', 'Se Vende', 'Storm Mart', 'Second Wind Thrift', 'Bay Cab', 'Cerrado'];
export const stats = { parkTables: 0, per100Min: 99, houses: 0, bulbStrings: 0, bulbs: 0, boards: 0, murals: 0, tallest: 0 };

// A string of twelve warm bulbs from (ax, az) to (bx, bz) at height y, sagging 0.8 m in the middle.
// A bulb is two small squares back to back, facing along the street.
export function bulbString(o, ax, az, bx, bz, y = 6, n = 12) {
  const dx = bx - ax, dz = bz - az, len = Math.hypot(dx, dz), ux = dx / len, uz = dz / len, s = 0.17;
  let px = ax, py = y, pz = az;
  for (let i = 0; i <= n + 1; i++) {
    const f = i / (n + 1), x = ax + dx * f, z = az + dz * f, yy = y - 0.8 * 4 * f * (1 - f);
    if (i && !o.low) o.B.quad([px, py - 0.03, pz], [x, yy - 0.03, z], [x, yy + 0.03, z], [px, py + 0.03, pz], 0x2b2838), o.B.quad([x, yy - 0.03, z], [px, py - 0.03, pz], [px, py + 0.03, pz], [x, yy + 0.03, z], 0x2b2838);
    px = x; py = yy; pz = z;
    if (i === 0 || i === n + 1) continue;
    const a = [x - ux * s, yy - 0.42, z - uz * s], b = [x + ux * s, yy - 0.42, z + uz * s], c = [x + ux * s, yy - 0.08, z + uz * s], d = [x - ux * s, yy - 0.08, z - uz * s];
    o.N.quad(a, b, c, d, BULB); o.N.quad(b, a, d, c, BULB);
  }
  stats.bulbStrings++; stats.bulbs += n;
}

// P1, the shop-house: two or three floors in one hot colour, a tiled strip along the roof edge,
// a striped awning over folding doors, a painted board, a balcony rail, two chairs outside.
function shopHouse(o, lot) {
  const c = lot.body, f = lot.face, h = lot.h, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2, w = c.x1 - c.x0, d = c.z1 - c.z0, dir = f === 's' ? 1 : -1, rnd = o.rnd;
  const zf = f === 's' ? c.z1 : c.z0;
  stats.houses++; stats.tallest = Math.max(stats.tallest, h + 0.5);
  o.B.box(cx, h / 2, cz, w - 0.1, h, d, lot.wall, { top: ROOF });
  // the tiled strip: 1.2 m of roof tile sloping up from the street edge
  o.B.box(cx, h + 0.25, zf - dir * 0.5, w - 0.1, 0.5, 1.4, TILE, { shift: [0, -dir * 0.35], taper: [1, 0.5] });
  // street level: folding doors, shop glass, the awning
  const n = Math.max(1, Math.floor(w / 4.2)), step = w / n, door = Math.floor(rnd() * n);
  for (let i = 0; i < n; i++) {
    const u = c.x0 + (i + 0.5) * step;
    if (i === door) o.B.quad(...wallQuad(c, f, u, 1.3, 2.6, 2.6, 0.05), lot.accent, 0.8);
    else { o.B.quad(...wallQuad(c, f, u, 1.7, step - 1.2, 2.0, 0.05), GLASS, 0.85 + rnd() * 0.3); if (rnd() < 0.7) o.L.quad(...wallQuad(c, f, u, 1.7, step - 1.2, 2.0, 0.08), 0xffd58a, 0.4 + rnd() * 0.5); }
  }
  const a0 = c.x0 + 0.3, a1 = c.x1 - 0.3, parts = o.low ? 1 : Math.max(2, Math.round((a1 - a0) / 2.4)), c1 = STRIPES[1 + Math.floor(rnd() * 4)];
  for (let i = 0; i < parts; i++) {
    const x0 = a0 + ((a1 - a0) * i) / parts, x1 = a0 + ((a1 - a0) * (i + 1)) / parts, zb = zf + dir * 0.05, zo = zf + dir * 1.5, col = i % 2 ? STRIPES[0] : c1;
    const p = [[x0, 3.3, zb], [x1, 3.3, zb], [x1, 2.7, zo], [x0, 2.7, zo]];
    if (dir > 0) { o.B.quad(p[3], p[2], p[1], p[0], col); o.B.quad(p[0], p[1], p[2], p[3], col, 0.7); } else { o.B.quad(p[0], p[1], p[2], p[3], col); o.B.quad(p[3], p[2], p[1], p[0], col, 0.7); }
  }
  // floors above: shuttered windows, some lit; a balcony rail on the first of them
  const cols = Math.max(1, Math.floor(w / 3.4)), cs = w / cols;
  for (let k = 1; k < lot.floors; k++) for (let i = 0; i < cols; i++) {
    const u = c.x0 + (i + 0.5) * cs, y = 3.6 + (k - 0.5) * 3.0 + 0.1;
    o.B.quad(...wallQuad(c, f, u, y, 1.5, 1.7, 0.05), GLASS, 0.8 + rnd() * 0.4);
    if (rnd() < 0.3) o.L.quad(...wallQuad(c, f, u, y, 1.5, 1.7, 0.08), 0xffd58a, 0.45 + rnd() * 0.5);
  }
  if (!o.low) {
    cellBox(o, wallSlab(c, f, cx, w / 2 - 0.4, 0.9), 3.72, 3.84, TRIM, { bottom: true });
    cellBox(o, wallSlab({ ...c, z0: c.z0 - 0.85, z1: c.z1 + 0.85 }, f, cx, w / 2 - 0.4, 0.06), 3.84, 4.7, lot.accent, { noTop: true });
    for (const u of [-1, 1]) o.B.box(cx + u * 0.7 + (door - (n - 1) / 2) * 0.4, CURB + 0.45, zf + dir * 2.3, 0.5, 0.9, 0.5, STRIPES[1 + Math.floor(rnd() * 4)], { taper: [1, 0.2], shift: [0, dir * 0.2] });   // two chairs
  }
  // the hand-painted board over the awning, on most houses wide enough for one
  if (w >= 7 && rnd() < 0.7) {
    const U = paintInto(o), text = BOARDS[Math.floor(rnd() * BOARDS.length)], bw = Math.min(5, w - 1.5);
    U.quad(...wallQuad(c, f, cx, lot.floors > 2 ? 6.9 : h - 0.55, bw, bw / 4, 0.07), 0xffffff, 1, board(text, css(lot.accent === lot.wall ? 0x150f3d : [0xff6f91, 0x2ec4b6, 0xff5a5a, 0x2e4a6b][Math.floor(rnd() * 4)])));
    stats.boards++;
  }
  // a mural on the bare side wall of some corner houses
  if (lot.mural) {
    const [a, b] = wallEnds(c, lot.mural.side, 0.06);
    muralWall(paintInto(o), a, b, 0.4, h - 0.3, lot.mural.seed, PALMA, { cells: lot.mural.cells }); stats.murals++;
  }
  o.solid(c.x0, c.x1, c.z0, c.z1, h);
}

register('palmavieja', {
  pave: PAVE,
  lot: shopHouse,
  // the far shell: the house in its colour, the walls that show, and the tile strip as a darker lip
  shellLot(o, lot) {
    const c = lot.body, h = lot.h;
    if (!c) return;
    const y = h, B = o.B, col = lot.wall;
    B.flat(c.x0, c.x1, c.z0, c.z1, y, ROOF);
    B.quad(...wallQuad(c, lot.face, (c.x0 + c.x1) / 2, h / 2, c.x1 - c.x0, h, 0), col);
    if (lot.wallW) B.quad(...wallQuad(c, 'w', (c.z0 + c.z1) / 2, h / 2, c.z1 - c.z0, h, 0), col);
    if (lot.wallE) B.quad(...wallQuad(c, 'e', (c.z0 + c.z1) / 2, h / 2, c.z1 - c.z0, h, 0), col);
  },
  // the alley down the middle of each block, a lamp at each corner, a palm and a bench between
  furniture(o, b) {
    if (b.row.strip) { for (let x = b.x0 + 10; x <= b.x1 - 8; x += 26) o.decor('palm', x, CURB, (b.z0 + b.z1) / 2, x, 0.9); return; }
    if (b.x1 - b.x0 < 30 || b.zone.hero.some((h) => h.x0 < b.x1 && h.x1 > b.x0 && h.z0 < b.z1 && h.z1 > b.z0)) return;
    const mid = (b.z0 + b.z1) / 2;
    o.G.flat(b.x0, b.x1, mid - 2, mid + 2, CURB + 0.012, 0x8d8791);
    for (const [z, dz] of [[b.z1 - 1, 1], [b.z0 + 1, -1]]) {
      o.prop('lamp', b.x0 + 7, CURB, z, dz > 0 ? 0 : Math.PI); o.prop('lamp', b.x1 - 7, CURB, z, dz > 0 ? 0 : Math.PI);
      if (!o.low || dz > 0) { const x = (b.x0 + b.x1) / 2 + (dz > 0 ? 6 : -6); o.decor('palm', x, CURB, z - dz * 0.4, x * 5 + z, 0.75 + o.rnd() * 0.3); o.solid(x - 0.3, x + 0.3, z - dz * 0.4 - 0.3, z - dz * 0.4 + 0.3, 1); }
    }
    o.decor('bench', b.x0 + 18, CURB, b.z1 - 2.8, Math.PI, 1);
  },
  // bulbs across the street, wall to wall: so many strings per 100 m by neighbourhood
  street(o, p, map) {
    if (p.stub && p.len < 20) return;
    const ns = p.axis === 'ns', mx = (p.ax + p.bx) / 2, mz = (p.az + p.bz) / 2;
    const hood = map.zone('palmavieja').hoods.find((h) => mx >= h.x0 && mx < h.x1 && mz >= h.z0 && mz < h.z1);
    if (!hood) return;
    const a = (ns ? p.az : p.ax) + (p.a ? map.nodes.get(p.a).half[ns ? 'ew' : 'ns'] : 0) + 5, b = (ns ? p.bz : p.bx) - (p.b ? map.nodes.get(p.b).half[ns ? 'ew' : 'ns'] : 0) - 5;
    const want = Math.max(1, Math.ceil(((b - a + 10) * hood.bulbs) / 100)), reach = p.width / 2 + 4, c = ns ? p.ax : p.az;
    if (hood.bulbs >= 6) stats.per100Min = Math.min(stats.per100Min, (want * 100) / (b - a + 10));
    for (let i = 0; i < want; i++) {
      const t = a + ((b - a) * (i + 0.5)) / want;
      if (ns) bulbString(o, c - reach, t, c + reach, t); else bulbString(o, t, c - reach, t, c + reach);
    }
  },
});
export default generator('palmavieja', stats);
