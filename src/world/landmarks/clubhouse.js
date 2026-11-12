// The clubhouse (plan/bible/world/mallard-greens.md, section 4): a long hipped hall on the island
// of Clubhouse Circle with a square clock tower, 25 m to the tip. The clock's hands are drawn by
// clubclock.mod.js from the game clock.
import { TRIM, ROOF, GLASS, wallQuad, cellBox } from '../gen/kit.js';

const HALL = { x0: -2032, x1: -1968, z0: -2120, z1: -2080 }, WING = { x0: -2052, x1: -2032, z0: -2107, z1: -2093 }, CREAM = 0xf5ecd7;
export const TOWER = { x: -2000, z: -2100, half: 3, top: 25, clockY: 18.5 };
function solids(B) {
  cellBox({ B }, HALL, 0, 9, CREAM, { noTop: true });
  B.box(-2000, 11.5, -2100, 68, 5, 44, ROOF, { taper: [0.6, 0.1] });
  B.box(TOWER.x, 11, TOWER.z, 6, 22, 6, CREAM, { noTop: true });
  B.box(TOWER.x, 23.5, TOWER.z, 6.6, 3, 6.6, ROOF, { taper: [0.02, 0.02] });
  cellBox({ B }, WING, 0, 4.5, 0xb7c9a8, { top: ROOF });
}
export default {
  id: 'clubhouse',
  build(o) {
    const B = o.B, T = { x0: TOWER.x - 3, x1: TOWER.x + 3, z0: TOWER.z - 3, z1: TOWER.z + 3 };
    solids(B);
    for (const side of ['n', 's', 'e', 'w']) {
      const u = side === 'n' || side === 's' ? TOWER.x : TOWER.z;
      B.quad(...wallQuad(T, side, u, TOWER.clockY, 4.4, 4.4, 0.04), 0x6f6a78); o.N.quad(...wallQuad(T, side, u, TOWER.clockY, 4, 4, 0.07), 0xffffff);      // four white clock faces
      const a = side === 'n' || side === 's' ? [HALL.x0, HALL.x1] : [HALL.z0, HALL.z1];
      for (let v = a[0] + 4; v < a[1] - 2; v += 6) { B.quad(...wallQuad(HALL, side, v, 4.4, 2.6, 5, 0.05), GLASS, 0.9); if (o.rnd() < 0.6) o.L.quad(...wallQuad(HALL, side, v, 4.4, 2.6, 5, 0.08), 0xffd58a, 0.6); }
    }
    // the portico on six columns, east side, facing Fairway Drive; the south terrace
    B.box(HALL.x1 + 3, 7.3, -2100, 6, 0.6, 20, TRIM, { bottom: true });
    for (let i = 0; i < 6; i++) B.box(HALL.x1 + 5.4, 3.5, -2109 + i * 3.6, 0.6, 7, 0.6, TRIM, { noTop: true });
    B.box(-2000, 0.3, HALL.z1 + 5, 40, 0.6, 10, 0xe9e2d2);
    o.solid(HALL.x0, HALL.x1, HALL.z0, HALL.z1, 14); o.solid(WING.x0, WING.x1, WING.z0, WING.z1, 4.5);
  },
  shell(o) { solids(o.B); },
};
