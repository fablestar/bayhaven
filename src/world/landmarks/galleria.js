// Galleria Flamingo (plan/bible/world/northgate.md, section 4): a flat mall with a giant pink
// flamingo on the roof, standing on one leg. Its top is 36 m up, the tallest pink thing north of
// the expressway.
import { ROOF, GLASS, CURB, wallQuad, wallSlab, cellBox } from '../gen/kit.js';
import { paintInto } from '../gen/streets.js';
import { board } from '../../gfx/murals.js';
import { carPark } from '../gen/northgate.js';

const MALL = { x0: -310, x1: -90, z0: -2060, z1: -1940 }, PINK = 0xff3fa4, BLUSH = 0xf4bdbd, X = -200, Z = -2000;
export const FLAMINGO_TOP = 36;
// leg, body, an S of five neck boxes, head and beak; `box` draws one
function flamingo(box) {
  box(X, 19, Z, 1, 10, 1, PINK);
  box(X, 26.25, Z, 8, 4.5, 5, PINK);
  [[3.2, 0], [4.2, 1.3], [4.6, 2.6], [4.0, 3.9], [3.4, 5.2]].forEach(([dx, dy]) => box(X + dx, 28.5 + dy + 0.65, Z, 1.2, 2, 1.2, PINK));
  box(X + 3.9, 35.25, Z, 2, 1.5, 1.5, PINK);
  box(X + 5.4, 34.8, Z, 1.5, 0.6, 0.6, 0x150f3d);
}
function solids(B) {
  cellBox({ B }, MALL, 0, 14, 0xe8dcc4, { top: ROOF });
  for (const [side, u] of [['s', X], ['n', X], ['e', Z], ['w', Z]]) cellBox({ B }, wallSlab(MALL, side, u, 8, 4), 0, 16, BLUSH, { top: ROOF });
}

export default {
  id: 'galleria',
  build(o, lot) {
    const B = o.B;
    o.G.flat(lot.x0 + 2, lot.x1 - 2, lot.z0 + 2, lot.z1 - 2, CURB + 0.012, 0x4a4754);
    solids(B);
    for (const [side, u] of [['s', X], ['n', X], ['e', Z], ['w', Z]]) {
      const p = wallSlab(MALL, side, u, 8, 4);
      B.quad(...wallQuad(p, side, u, 3, 12, 5.4, 0.05), GLASS); o.L.quad(...wallQuad(p, side, u, 3, 12, 5.4, 0.08), 0xffd58a, 0.55);
      if (side === 's' || side === 'n') paintInto(o).quad(...wallQuad(p, side, u, 12.5, 14, 3.5, 0.07), 0xffffff, 1, board('Galleria Flamingo', '#ff3fa4'));
      o.solid(p.x0, p.x1, p.z0, p.z1, 16);
    }
    B.box(X, 16, -1972, 40, 4, 20, 0x8fb8d8, { top: 0xb8cfe0 });                              // the glass roof lantern
    o.N.box(X, 14.3, Z, 3, 0.3, 3, PINK);
    flamingo((...a) => o.N.box(...a));
    B.box(X, 2.5, MALL.z0 - 5, 30, 5, 10, 0xd9cdb4, { top: ROOF });                           // the loading dock, north side
    o.solid(X - 15, X + 15, MALL.z0 - 10, MALL.z0, 5);
    carPark(o, { x0: lot.x0 + 6, x1: lot.x1 - 6, z0: MALL.z1 + 8, z1: lot.z1 - 6 }, 0.3, 16);
    carPark(o, { x0: lot.x0 + 6, x1: lot.x1 - 6, z0: lot.z0 + 6, z1: MALL.z0 - 14 }, 0.15, 6);
    o.solid(MALL.x0, MALL.x1, MALL.z0, MALL.z1, 14);
  },
  shell(o) { solids(o.B); flamingo((...a) => o.B.box(...a)); },
};
