// Bayhaven General (plan/bible/world/northgate.md, section 4): a mint slab on a beige podium, a pink
// cross, a helipad on top, a canopy over the emergency doors at (-500, -1700). You wake up here.
import { TRIM, ROOF, GLASS, CURB, wallQuad, cellBox } from '../gen/kit.js';
import { prism, paintInto } from '../gen/streets.js';
import { board } from '../../gfx/murals.js';

const POD = { x0: -495, x1: -375, z0: -1740, z1: -1660 }, TOWER = { x0: -460, x1: -400, z0: -1740, z1: -1700 }, MINT = 0xbce0ca, PINK = 0xff3fa4;
export const HELIPAD = { x: -430, z: -1720, y: 34, r: 9 };
const solids = (B) => { cellBox({ B }, POD, 0, 8, 0xe8dcc4, { top: ROOF }); cellBox({ B }, TOWER, 8, 34, MINT, { top: ROOF }); };

export default {
  id: 'hospital',
  build(o, lot) {
    o.G.flat(lot.x0 + 2, lot.x1 - 2, lot.z0 + 2, lot.z1 - 2, CURB + 0.012, 0x4a4754);
    solids(o.B);
    for (const side of ['n', 's', 'e', 'w']) {
      const a = side === 'n' || side === 's' ? [TOWER.x0, TOWER.x1] : [TOWER.z0, TOWER.z1], u = (a[0] + a[1]) / 2, w = a[1] - a[0] - 2;
      for (let y = 10; y < 33; y += 3.6) {
        o.B.quad(...wallQuad(TOWER, side, u, y, w, 1.7, 0.05), GLASS, 0.85 + o.rnd() * 0.3);
        for (let k = 0; k < 4; k++) if (o.rnd() < 0.4) o.L.quad(...wallQuad(TOWER, side, a[0] + 3 + o.rnd() * (w - 4), y, 3, 1.7, 0.08), 0xffd58a, 0.5 + o.rnd() * 0.4);
      }
      const p = side === 'n' || side === 's' ? [POD.x0, POD.x1] : [POD.z0, POD.z1];
      o.B.quad(...wallQuad(POD, side, (p[0] + p[1]) / 2, 5.4, p[1] - p[0] - 4, 1.6, 0.05), GLASS);
    }
    // the cross, glowing, on the tower's south and west faces
    for (const [x, z, ax] of [[-430, TOWER.z1 + 0.4, 1], [TOWER.x0 - 0.4, -1720, 0]]) { o.N.box(x, 27, z, ax ? 6 : 0.6, 2, ax ? 0.6 : 6, PINK); o.N.box(x, 27, z, ax ? 2 : 0.6, 6, ax ? 0.6 : 2, PINK); }
    prism(o.B, HELIPAD.x, HELIPAD.z, HELIPAD.r, 34, 34.4, ROOF, { n: 12, top: 0x86818f });
    for (const [dx, w, d] of [[-2, 0.7, 5], [2, 0.7, 5], [0, 4, 0.7]]) o.B.flat(HELIPAD.x + dx - w / 2, HELIPAD.x + dx + w / 2, HELIPAD.z - d / 2, HELIPAD.z + d / 2, 34.43, 0xffffff);
    for (let i = 0; i < 8; i++) o.N.box(HELIPAD.x + Math.sin(i * 0.785) * 8.6, 34.5, HELIPAD.z + Math.cos(i * 0.785) * 8.6, 0.3, 0.2, 0.3, 0xffa02e);
    // the emergency doors and their canopy at the Hospital Road kerb
    const can = { x0: -509, x1: -495, z0: -1708, z1: -1692 };
    cellBox(o, can, 5, 5.5, TRIM, { bottom: true });
    for (const z of [can.z0 + 0.5, can.z1 - 0.5]) for (const x of [-508.4, -497]) o.B.box(x, 2.5 + CURB / 2, z, 0.4, 5, 0.4, TRIM, { noTop: true });
    o.B.quad(...wallQuad(POD, 'w', -1700, 1.6, 8, 3, 0.05), GLASS); o.L.quad(...wallQuad(POD, 'w', -1700, 1.6, 8, 3, 0.08), 0x8fe8ff, 0.7);
    paintInto(o).quad(...wallQuad(POD, 'w', -1700, 6.5, 12, 3, 0.07), 0xffffff, 1, board('Bayhaven General', '#2f7d5b'));
    // three ambulances in a bay
    for (let i = 0; i < 3; i++) {
      const z = -1730 + i * 4.2;
      o.B.box(-502, CURB + 1.3, z, 5.6, 2.2, 2.3, 0xffffff); o.B.box(-502, CURB + 1.3, z, 5.7, 0.4, 2.35, PINK, { noTop: true }); o.N.box(-501, CURB + 2.5, z, 0.4, 0.2, 1.4, 0xff5a5a);
      o.solid(-504.8, -499.2, z - 1.15, z + 1.15, 2.6);
    }
    o.solid(POD.x0, POD.x1, POD.z0, POD.z1, 8); o.solid(TOWER.x0, TOWER.x1, TOWER.z0, TOWER.z1, 34);
  },
  shell(o) { solids(o.B); },
};
