// The bell tower of the old mission church (plan/bible/world/palma-vieja.md): the block north of
// Domino Park. A white nave 40 x 16 x 12 under a tiled roof, x -1400 to -1360, and a white tower
// 8 x 8 x 34 at (-1350, -960) with three mango bands. Its top 6 m is open on four sides round a
// yellow bell, under a tiled pyramid cap, and is lit warm from inside at night. Nothing in the
// quarter is taller, so it is in the skyline.
import { CURB, GLASS, wallQuad } from '../gen/kit.js';
import { penB, penW } from '../gen/streets.js';

const WHITE = 0xfdf6ea, TILE = 0xa8553a, MANGO = 0xffb347, BELL = 0xffc300, TX = -1350, TZ = -960, NX = -1380;
export const BELL_TOWER = { x: TX, z: TZ, h: 34 };

// the outline, drawn with a pen so the far shell and the skyline are the same building
function outline(p, inset = 0) {
  const k = inset * 2;
  p.box(NX, 6, TZ, 40 - k, 12, 16 - k, WHITE, { top: TILE });
  p.box(NX, 13.4, TZ, 40 - k, 2.8, 16 - k, TILE, { taper: [1, 0.08] });
  p.box(TX, 13, TZ, 8 - k, 26, 8 - k, WHITE);
  for (const [dx, dz] of [[-3.3, -3.3], [3.3, -3.3], [-3.3, 3.3], [3.3, 3.3]]) p.box(TX + dx, 29, TZ + dz, 1.4, 6, 1.4, WHITE, { noTop: true });
  p.box(TX, 33, TZ, 9 - k, 2, 9 - k, TILE, { taper: [0.06, 0.06] });
}

export default {
  id: 'bell-tower', skyline: true,
  build(o, lot) {
    const y = CURB, B = o.B;
    o.G.flat(lot.x0, lot.x1, lot.z0, lot.z1, y + 0.012, 0xe9b9a2);
    outline(penB(o));
    for (const h of [8, 16, 24]) B.box(TX, h, TZ, 8.3, 0.9, 8.3, MANGO, { noTop: true });          // three bands
    B.box(TX, 26.1, TZ, 8.6, 0.3, 8.6, WHITE, { bottom: true });                                  // the bell floor
    B.box(TX, 28.6, TZ, 2, 2, 2, BELL, { bottom: true, taper: [0.55, 0.55] });
    B.box(TX, 30.4, TZ, 0.3, 1.6, 0.3, 0x6f6a78);
    o.L.box(TX, 29, TZ, 5, 5.6, 5, 0xffc27a, { noTop: true });                                     // warm light inside the open top
    // the nave: arched door, a round window, side windows, the tower door
    const nave = { x0: NX - 20, x1: NX + 20, z0: TZ - 8, z1: TZ + 8 };
    B.quad(...wallQuad(nave, 's', NX, 2.2, 3.2, 4.4, 0.06), 0x8a6a4a);
    B.quad(...wallQuad(nave, 's', NX, 8.4, 2.4, 2.4, 0.06), GLASS);
    o.L.quad(...wallQuad(nave, 's', NX, 8.4, 2.4, 2.4, 0.09), 0xffd58a, 0.7);
    for (let i = -3; i <= 3; i++) if (i) for (const s of ['s', 'n']) B.quad(...wallQuad(nave, s, NX + i * 5.4, 6.2, 1.4, 4.2, 0.06), GLASS, 0.85 + (i & 1) * 0.2);
    B.quad(...wallQuad({ x0: TX - 4, x1: TX + 4, z0: TZ - 4, z1: TZ + 4 }, 's', TX, 1.4, 1.6, 2.8, 0.06), 0x8a6a4a);
    // the forecourt, 20 x 14, south of the nave, with two benches
    o.G.flat(NX - 10, NX + 10, TZ + 8, TZ + 22, y + 0.02, 0xd6cdc4);
    for (const x of [NX - 7, NX + 7]) o.decor('bench', x, y, TZ + 19, Math.PI, 1);
    for (const x of [lot.x0 + 6, lot.x0 + 16]) o.decor('palm', x, y, lot.z0 + 8, x, 0.9);
    o.solid(nave.x0, nave.x1, nave.z0, nave.z1, 12); o.solid(TX - 4, TX + 4, TZ - 4, TZ + 4, 34);
  },
  shell(o, lot, { inset = 0 } = {}) { outline(o.B ? penB(o) : penW(o), inset); },
};
