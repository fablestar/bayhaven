// The Northgate kit (plan/bible/world/northgate.md): strip malls behind car parks, big-box stores,
// drive-throughs, motels with pools, pole signs taller than the shops, and Billboard Row's forty
// lawyers. The four tier A recipes are built; B and C lots are strip malls until they ship.
import { TRIM, ROOF, GLASS, CURB, wallQuad, wallSlab, cellBox } from './kit.js';
import { register, generator, paintInto } from './streets.js';
import { board } from '../../gfx/murals.js';
import { signUV, SHOP_SIGNS } from '../../gfx/atlas.js';
import { BEIGE } from '../zones/northgate.js';

const LOT = 0x4a4754, RED = 0xff5a5a, YELLOW = 0xffc300, CARS = [0xf7f3ea, 0x9aa3ad, 0x2e4a6b, 0xff8f7a, 0x8fe3cf, 0x3a3844, 0xffc98f];
export const stats = { strips: 0, boxes: 0, drives: 0, motels: 0, pools: 0, poleSigns: 0, poleMin: 99, billboards: 0, larry: 0, cars: 0, tallest: 0, parkRatioMin: 99 };

// Billboard Row: forty boards on the north kerb of Billboard Road, owners in the bible's order
const OWNERS = ['larry', 'annie', 'larry', 'gull', 'annie', 'larry', 'limpet', 'annie', 'larry', 'jellyfish'];
const FIRMS = {
  larry: { text: 'Larry 555-0144', bg: 0xffc300, ink: '#c8372d', suit: 0x2e4a6b }, annie: { text: 'Annie 555-0155', bg: 0x7fd6e8, ink: '#150f3d', suit: 0xff3fa4 },
  gull: { text: 'Gull, Gull & Gull', bg: 0xf7f3ea, ink: '#2e4a6b', suit: 0x6f6a78 }, limpet: { text: 'Limpet Legal', bg: 0xbce0ca, ink: '#2f7d5b', suit: 0x3a3844 },
  jellyfish: { text: 'Jellyfish Injury Law', bg: 0xf4bdbd, ink: '#b46bff', suit: 0xb46bff },
};
export const BILLBOARDS = [];
for (const west of [-509, -353, -189, -33, 131, 287]) for (let i = 0; i < 6; i++) BILLBOARDS.push(west + 11 + 24 * i);
BILLBOARDS.push(462, 486, 510, 534);
export const BOARD_Z = -2458;

// a parked car: two boxes and a collider. Decoration: the cars you can drive come from the traffic lane.
export function car(o, x, z, alongZ, col = CARS[Math.floor(o.rnd() * CARS.length)], y = CURB) {
  const l = 4.3, w = 1.8;
  o.B.box(x, y + 0.55, z, alongZ ? w : l, 0.7, alongZ ? l : w, col);
  o.B.box(x, y + 1.15, z, alongZ ? w - 0.2 : l * 0.5, 0.5, alongZ ? l * 0.5 : w - 0.2, GLASS, { top: col });
  o.solid(x - (alongZ ? w : l) / 2, x + (alongZ ? w : l) / 2, z - (alongZ ? l : w) / 2, z + (alongZ ? l : w) / 2, 1.4);
  stats.cars++;
}
// a pole sign: a red board and a yellow one under it, both faces carrying a shop sign
export function poleSign(o, x, z, h, neon) {
  const c = { x0: x - 0.3, x1: x + 0.3, z0: z - 2.6, z1: z + 2.6 }, idx = SHOP_SIGNS[Math.floor(o.rnd() * SHOP_SIGNS.length)];
  o.B.box(x, (h - 3) / 2, z, 0.5, h - 3, 0.5, ROOF);
  cellBox(o, c, h - 3, h, RED);
  o.B.box(x, h - 4.2, z, 0.5, 1.6, 3.6, YELLOW);
  for (const side of ['e', 'w']) o.S.quad(...wallQuad(c, side, z, h - 1.5, 4.8, 1.2, 0.03), 0xffffff, 1, signUV(idx));
  if (neon) o.N.box(x, h + 0.12, z, 0.3, 0.16, 5.4, neon);
  o.solid(x - 0.3, x + 0.3, z - 0.3, z + 0.3, h);
  stats.poleSigns++; stats.poleMin = Math.min(stats.poleMin, h); stats.tallest = Math.max(stats.tallest, h);
}
// the car park: asphalt on the block, bays in double rows, some of them taken
export function carPark(o, r, fill = 0.3, cap = 10) {
  o.G.flat(r.x0, r.x1, r.z0, r.z1, CURB + 0.012, LOT);
  const step = o.low ? 5.4 : 2.7, y = CURB + 0.03;
  let cars = 0;
  for (let z = r.z0 + 6; z + 6 <= r.z1; z += 17) {
    o.M.flat(r.x0 + 4, r.x1 - 4, z - 0.07, z + 0.07, y, 0xffffff);
    for (let x = r.x0 + 4; x <= r.x1 - 4; x += step) o.M.flat(x - 0.07, x + 0.07, z - 5, z + 5, y, 0xffffff);
    for (let x = r.x0 + 5.35; x < r.x1 - 6 && cars < (o.low ? cap / 2 : cap); x += 2.7) if (o.rnd() < fill * 0.35) { car(o, x, z + (o.rnd() < 0.5 ? -2.6 : 2.6), true); cars++; }
  }
}
const frontZ = (lot) => (lot.face === 's' ? lot.z1 - 2.5 : lot.z0 + 2.5);

function strip(o, lot) {
  const c = lot.body, f = lot.face, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2, w = c.x1 - c.x0, d = c.z1 - c.z0;
  o.B.box(cx, 2.75, cz, w, 5.5, d, BEIGE, { noTop: true });
  o.B.box(cx, 6.1, cz, w + 0.4, 1.2, d + 0.4, lot.tint, { top: ROOF });                         // the parapet, in the lot's faded tint
  const n = Math.max(1, Math.floor(w / 13)), sw = w / n;
  for (let i = 0; i < n; i++) {
    const u = c.x0 + (i + 0.5) * sw;
    o.B.quad(...wallQuad(c, f, u, 1.7, sw - 3, 2.8, 0.05), GLASS, 0.85 + o.rnd() * 0.3);
    if (o.rnd() < 0.55) o.L.quad(...wallQuad(c, f, u, 1.7, sw - 3, 2.8, 0.08), 0xffd58a, 0.4 + o.rnd() * 0.5);
    if (i % 2 === 0 || !o.low) o.S.quad(...wallQuad(c, f, u, 4.5, 6.4, 1.6, 0.06), 0xffffff, 1, signUV(SHOP_SIGNS[Math.floor(o.rnd() * SHOP_SIGNS.length)]));
  }
  const walk = wallSlab(c, f, cx, w / 2, 3);                                                     // the walkway roof on posts
  cellBox(o, walk, 3.35, 3.55, TRIM, { bottom: true });
  if (!o.low) for (let i = 0; i <= n; i++) o.B.box(c.x0 + i * sw, 1.75, f === 's' ? walk.z1 - 0.2 : walk.z0 + 0.2, 0.2, 3.3, 0.2, TRIM, { noTop: true });
  o.solid(c.x0, c.x1, c.z0, c.z1, 6.7);
  carPark(o, lot.park);
  poleSign(o, lot.x0 + 12, frontZ(lot), lot.pole);
  stats.strips++; stats.parkRatioMin = Math.min(stats.parkRatioMin, lot.parkArea / lot.bodyArea);
}

function bigBox(o, lot) {
  const c = lot.body, f = lot.face, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2, w = c.x1 - c.x0, d = c.z1 - c.z0, dir = f === 's' ? 1 : -1;
  o.B.box(cx, 4.5, cz, w, 9, d, BEIGE, { top: ROOF });
  o.B.box(cx, 7, cz, w + 0.3, 2, d + 0.3, lot.tint, { noTop: true });                           // the 2 m stripe
  for (let i = 0; i < (o.low ? 3 : 6); i++) o.B.box(c.x0 + 12 + (i % 3) * 30, 9.6, cz + (i < 3 ? -12 : 12), 4, 1.2, 3, 0xb7b0b8);
  const portal = wallSlab(c, f, cx, 7, 3);                                                       // a 14 m portal over 12 m of glass
  cellBox(o, portal, 0, 11, lot.tint, { top: ROOF });
  o.B.quad(...wallQuad(portal, f, cx, 2.6, 12, 5, 0.05), GLASS);
  o.L.quad(...wallQuad(portal, f, cx, 2.6, 12, 5, 0.08), 0xffd58a, 0.5);
  o.S.quad(...wallQuad(portal, f, cx, 8.3, 12.8, 3.2, 0.06), 0xffffff, 1, signUV(SHOP_SIGNS[Math.floor(o.rnd() * SHOP_SIGNS.length)]));
  o.solid(c.x0, c.x1, c.z0, c.z1, 9); o.solid(portal.x0, portal.x1, portal.z0, portal.z1, 11);
  carPark(o, lot.park, 0.3, 14);
  // bays down both sides of the store
  for (const s of [-1, 1]) { const x0 = s < 0 ? lot.x0 + 3 : c.x1 + 2, x1 = s < 0 ? c.x0 - 2 : lot.x1 - 3; o.G.flat(x0, x1, c.z0, c.z1 + dir * 3, CURB + 0.012, LOT); }
  poleSign(o, lot.x0 + 12, frontZ(lot), lot.pole);
  stats.boxes++; stats.tallest = Math.max(stats.tallest, 11); stats.parkRatioMin = Math.min(stats.parkRatioMin, lot.parkArea / lot.bodyArea);
}

function drive(o, lot) {
  const c = lot.body, f = lot.face, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2, neon = [0xff3fa4, 0xffa02e, 0x29e6ff][Math.floor(o.rnd() * 3)];
  o.G.flat(lot.x0 + 3, lot.x1 - 3, lot.z0 + 4, lot.z1 - 4, CURB + 0.012, LOT);
  o.B.box(cx, 2, cz, 14, 4, 10, lot.wall, { top: ROOF });
  o.B.box(cx, 5.5, cz, 7, 3, 2.4, RED, { taper: [0.55, 1], top: YELLOW });                       // the shaped sign crown
  o.N.box(cx, 4.1, f === 's' ? c.z1 + 0.2 : c.z0 - 0.2, 14.4, 0.16, 0.12, neon);
  o.B.quad(...wallQuad(c, f, cx, 1.8, 9, 2.4, 0.05), GLASS);
  o.L.quad(...wallQuad(c, f, cx, 1.8, 9, 2.4, 0.08), 0xffd58a, 0.6);
  o.B.quad(...wallQuad(c, 'e', cz, 1.9, 1.6, 1.2, 0.05), GLASS);                                 // the window
  o.B.box(c.x1 + 5.2, CURB + 1.2, c.z0 + 1, 0.3, 2.2, 1.8, 0x140c2c);                            // the menu board
  o.solid(c.x1 + 5, c.x1 + 5.4, c.z0 + 0.1, c.z0 + 1.9, 2.4);
  // the 4 m lane looping the building, as paint
  const y = CURB + 0.03, a = { x0: c.x0 - 5, x1: c.x1 + 5, z0: c.z0 - 5, z1: c.z1 + 5 };
  for (const [x0, x1, z0, z1] of [[a.x0, a.x1, a.z0, a.z0 + 0.15], [a.x0, a.x1, a.z1 - 0.15, a.z1], [a.x0, a.x0 + 0.15, a.z0, a.z1], [a.x1 - 0.15, a.x1, a.z0, a.z1]]) o.M.flat(x0, x1, z0, z1, y, 0xf2e6b0);
  o.solid(c.x0, c.x1, c.z0, c.z1, 4);
  for (let i = 0; i < (o.low ? 1 : 3); i++) if (o.rnd() < 0.6) car(o, lot.x0 + 8 + i * 2.8, cz, true);
  poleSign(o, lot.x1 - 8, frontZ(lot), lot.pole, neon);
  stats.drives++; stats.tallest = Math.max(stats.tallest, 7);
}

// a U of two wings and a bar round a pool, a door every 4 m on two floors, a walkway balcony
function motel(o, lot) {
  const c = lot.body, f = lot.face, cx = (c.x0 + c.x1) / 2, col = lot.wall, s = f === 's';
  const bar = { x0: c.x0 + 9, x1: c.x1 - 9, z0: s ? c.z0 : c.z1 - 9, z1: s ? c.z0 + 9 : c.z1 }, west = { x0: c.x0, x1: c.x0 + 9, z0: c.z0, z1: c.z1 }, east = { x0: c.x1 - 9, x1: c.x1, z0: c.z0, z1: c.z1 };
  o.G.flat(lot.x0 + 3, lot.x1 - 3, lot.z0 + 4, lot.z1 - 4, CURB + 0.012, LOT);
  for (const [cell, side] of [[west, 'e'], [east, 'w'], [bar, f]]) {
    cellBox(o, cell, 0, 6.4, col, { top: ROOF });
    cellBox(o, wallSlab(cell, side, side === f ? cx : (cell.z0 + cell.z1) / 2, (side === f ? 30 : 57) / 2, 1.4), 3.1, 3.25, TRIM, { bottom: true });       // the balcony
    const a = side === f ? cell.x0 : cell.z0, b = side === f ? cell.x1 : cell.z1;
    for (let u = a + 2; u < b - 1; u += 4) for (let k = 0; k < (o.low ? 1 : 2); k++) {
      o.B.quad(...wallQuad(cell, side, u, 1.05 + k * 3.2, 1, 2.1, 0.04), TRIM, 0.9);
      if (o.rnd() < 0.25) o.L.quad(...wallQuad(cell, side, u + 1.5, 1.6 + k * 3.2, 1.2, 1, 0.05), 0xffd58a, 0.5 + o.rnd() * 0.4);
    }
    o.solid(cell.x0, cell.x1, cell.z0, cell.z1, 6.4);
  }
  const pz = s ? c.z0 + 9 + 20 : c.z1 - 9 - 20;                                                  // the pool in the court
  o.B.box(cx, CURB + 0.1, pz, 13, 0.2, 7, TRIM, { noTop: true });
  o.G.flat(cx - 6, cx + 6, pz - 3, pz + 3, CURB + 0.16, 0x7fd6e8);
  o.N.box(cx, 6.6, s ? bar.z1 + 0.2 : bar.z0 - 0.2, 30, 0.16, 0.12, 0xff3fa4);
  for (let i = 0; i < (o.low ? 2 : 4); i++) if (o.rnd() < 0.5) car(o, c.x0 - 4, c.z0 + 8 + i * 9, false);
  poleSign(o, c.x1 + 5, frontZ(lot), 12, 0x29e6ff);
  stats.motels++; stats.pools++;
}

// one of Billboard Row's boards: a 9 m pole, a 12 x 5 board, a lawyer's face and a phone number
function billboard(o, x, i) {
  const who = OWNERS[i % OWNERS.length], firm = FIRMS[who], z = BOARD_Z, zf = z + 0.22, U = paintInto(o);
  const q = (x0, x1, y0, y1, col, e = 0) => o.B.quad([x0, y0, zf + e], [x1, y0, zf + e], [x1, y1, zf + e], [x0, y1, zf + e], col);
  o.B.box(x, 4.5, z, 0.6, 9, 0.6, ROOF);
  o.B.box(x, 11.5, z, 12, 5, 0.4, firm.bg);
  q(x - 5.2, x - 1.8, 9.2, 10.9, firm.suit, 0.01);                                               // the suit
  q(x - 4.4, x - 2.6, 10.6, 13.2, 0xffd9b0, 0.02);                                               // the face
  q(x - 4.6, x - 2.4, 13.0, 13.6, 0x3a3844, 0.03);                                               // the hair
  q(x - 4.0, x - 3.0, 11.1, 11.35, 0xffffff, 0.03);                                              // the smile
  for (const ex of [-3.95, -3.05]) q(x + ex - 0.12, x + ex + 0.12, 12.2, 12.45, 0x150f3d, 0.03);
  U.quad([x - 1.2, 10.5, zf + 0.02], [x + 5.6, 10.5, zf + 0.02], [x + 5.6, 12.2, zf + 0.02], [x - 1.2, 12.2, zf + 0.02], 0xffffff, 1, board(firm.text, firm.ink));
  o.N.box(x, 8.8, z + 0.9, 8, 0.12, 0.12, 0xfff2cc);                                             // the floodlight bar
  o.solid(x - 0.3, x + 0.3, z - 0.3, z + 0.3, 14);
  stats.billboards++; if (who === 'larry') stats.larry++;
  stats.tallest = Math.max(stats.tallest, 14);
}

const RECIPES = { strip, box: bigBox, drive, motel };
register('northgate', {
  pave: 0xd9d0c0,
  ground(o, r) {
    o.G.flat(r.x0, r.x1, r.z0, r.z1, 0, 0x3b3946);
    BILLBOARDS.forEach((x, i) => { if (x >= r.x0 && x < r.x1 && BOARD_Z >= r.z0 && BOARD_Z < r.z1) billboard(o, x, i); });
  },
  lot(o, lot) { RECIPES[lot.recipe](o, lot); },
  shellLot(o, lot) {
    const c = lot.body;
    if (lot.recipe === 'motel') { for (const x of [c.x0 + 4.5, c.x1 - 4.5]) o.B.box(x, 3.2, (c.z0 + c.z1) / 2, 9, 6.4, c.z1 - c.z0, lot.wall, { top: ROOF }); return; }
    const h = lot.recipe === 'drive' ? 4 : lot.recipe === 'box' ? 9 : 6.7;
    o.B.box((c.x0 + c.x1) / 2, h / 2, (c.z0 + c.z1) / 2, c.x1 - c.x0, h, c.z1 - c.z0, lot.wall, { top: ROOF });
  },
  // per block: light masts at the corners of the kerb, two palms
  furniture(o, b) {
    if (b.x1 - b.x0 < 60 || b.zone.hero.some((h) => h.x0 < b.x1 && h.x1 > b.x0 && h.z0 < b.z1 && h.z1 > b.z0)) return;
    for (const [z, rot] of [[b.z1 - 1, 0], [b.z0 + 1, Math.PI]]) {
      o.prop('lamp', b.x0 + 8, CURB, z, rot); if (!o.low) o.prop('lamp', b.x1 - 8, CURB, z, rot);
      const x = (b.x0 + b.x1) / 2 + (rot ? -9 : 9);
      o.decor('palm', x, CURB, z, x * 3 + z, 0.8 + o.rnd() * 0.3); o.solid(x - 0.3, x + 0.3, z - 0.3, z + 0.3, 1);
    }
  },
});
export default generator('northgate', stats);
