// The Sheriff's HQ and studio (plan/bible/world/northgate.md, section 4): a white and teal office,
// a windowless studio behind it with a dish bigger than its roof, a red-lit mast, and a fenced motor
// pool to the east. The front steps at (200, -2150) are where a booking lets you go.
import { ROOF, GLASS, CURB, wallQuad, cellBox } from '../gen/kit.js';
import { prism, paintInto } from '../gen/streets.js';
import { board } from '../../gfx/murals.js';
import { car } from '../gen/northgate.js';

const OFFICE = { x0: 150, x1: 250, z0: -2212, z1: -2152 }, STUDIO = { x0: 170, x1: 230, z0: -2252, z1: -2212 }, HOLD = { x0: 136, x1: 150, z0: -2204, z1: -2164 };
const POOL = { x0: 292, x1: 430, z0: -2268, z1: -2140 }, WHITE = 0xf7f3ea, TEAL = 0x7fd6e8, PINK = 0xff3fa4;
export const DISH = { x: 195, z: -2238, r: 7, y: 24 }, MAST = { x: 240, z: -2228, h: 45 };
function solids(B) {
  cellBox({ B }, OFFICE, 0, 16, WHITE, { top: ROOF }); cellBox({ B }, STUDIO, 0, 14, 0xc4d7e2, { top: ROOF });
  B.box(MAST.x, MAST.h / 2, MAST.z, 1.4, MAST.h, 1.4, ROOF, { taper: [0.4, 0.4] });
  B.box(DISH.x, 19, DISH.z, 1.2, 10, 1.2, ROOF);
  prism(B, DISH.x, DISH.z, 1.2, DISH.y, DISH.y + 2.6, 0xdad6d0, { n: 10, r1: DISH.r, top: WHITE });
}

export default {
  id: 'sheriff-hq',
  build(o, lot) {
    const B = o.B, cx = 200;
    o.G.flat(lot.x0 + 2, lot.x1 - 2, lot.z0 + 2, lot.z1 - 2, CURB + 0.012, 0x4a4754);
    solids(B);
    B.box(cx, 12.6, -2182, 100.4, 1.6, 60.4, TEAL, { noTop: true }); B.box(cx, 11.4, -2182, 100.4, 0.5, 60.4, PINK, { noTop: true });
    for (const side of ['s', 'e', 'w']) for (const y of [2.4, 6, 9.4]) {
      const a = side === 's' ? [OFFICE.x0, OFFICE.x1] : [OFFICE.z0, OFFICE.z1];
      B.quad(...wallQuad(OFFICE, side, (a[0] + a[1]) / 2, y, a[1] - a[0] - 6, 1.6, 0.05), GLASS, 0.9);
      for (let k = 0; k < 5; k++) if (o.rnd() < 0.4) o.L.quad(...wallQuad(OFFICE, side, a[0] + 5 + o.rnd() * (a[1] - a[0] - 10), y, 3, 1.6, 0.08), 0xffd58a, 0.6);
    }
    // the steps, the door and the "On air" box over it
    B.box(cx, CURB + 0.2, -2150, 14, 0.4, 4, 0xd6cdc4); B.box(cx, CURB + 0.5, -2151, 10, 0.3, 2, 0xd6cdc4);
    B.quad(...wallQuad(OFFICE, 's', cx, 2, 6, 3.4, 0.07), 0x150f3d);
    B.box(cx, 4.6, -2151.6, 4, 1, 0.5, 0xff5a5a);
    paintInto(o).quad(...wallQuad(OFFICE, 's', cx, 14.2, 14, 3.5, 0.07), 0xffffff, 1, board('Bayhaven Blue: Live', '#2e4a6b'));
    o.N.box(DISH.x, DISH.y - 0.3, DISH.z, 2.2, 0.2, 2.2, 0x29e6ff);
    for (const y of [15, 30, 44.6]) o.N.box(MAST.x, y, MAST.z, 0.9, 0.4, 0.9, 0xff5a5a);
    // the holding block, with slit windows
    cellBox(o, HOLD, 0, 5, 0xb7b0b8, { top: ROOF });
    for (let z = HOLD.z0 + 3; z < HOLD.z1; z += 5) B.quad(...wallQuad(HOLD, 'w', z, 3.4, 0.4, 1.2, 0.05), GLASS);
    // the motor pool: a fence with a gate on the south side, eight cruisers, a cage of seized cars
    const f = (x0, x1, z0, z1) => { B.box((x0 + x1) / 2, CURB + 1.1, (z0 + z1) / 2, Math.max(0.15, x1 - x0), 2.2, Math.max(0.15, z1 - z0), 0x9aa3ad); o.solid(x0 - 0.1, x1 + 0.1, z0 - 0.1, z1 + 0.1, 2.3); };
    f(POOL.x0, POOL.x1, POOL.z0, POOL.z0); f(POOL.x0, POOL.x0, POOL.z0, POOL.z1); f(POOL.x1, POOL.x1, POOL.z0, POOL.z1);
    f(POOL.x0, 352, POOL.z1, POOL.z1); f(366, POOL.x1, POOL.z1, POOL.z1);
    for (let i = 0; i < 8; i++) { const x = 304 + i * 6, z = -2160; car(o, x, z, true, WHITE); B.box(x, CURB + 0.56, z, 1.84, 0.3, 4.34, 0x2e4a6b, { noTop: true }); o.N.box(x, CURB + 1.5, z, 1.2, 0.14, 0.3, i % 2 ? 0xff5a5a : 0x29e6ff); }
    f(300, 340, -2240, -2240); f(300, 300, -2262, -2240); f(340, 340, -2262, -2240);
    for (let i = 0; i < 4; i++) car(o, 306 + i * 8, -2252, true);
    o.solid(OFFICE.x0, OFFICE.x1, OFFICE.z0, OFFICE.z1, 16); o.solid(STUDIO.x0, STUDIO.x1, STUDIO.z0, STUDIO.z1, 14); o.solid(HOLD.x0, HOLD.x1, HOLD.z0, HOLD.z1, 5);
    o.solid(MAST.x - 0.8, MAST.x + 0.8, MAST.z - 0.8, MAST.z + 0.8, 45);
  },
  shell(o) { solids(o.B); },
};
