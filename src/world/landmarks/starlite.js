// The Starlite Drive-In (plan/bible/world/northgate.md, section 4), the short version: the white
// screen on six legs facing south, the sunburst, the snack hut and the ticket booth. The tilted car
// terraces and the looping film are not built yet.
import { CURB } from '../gen/kit.js';

const X = 350, Z = -2400;
function screen(B) {
  for (let i = 0; i < 6; i++) B.box(X - 13.5 + i * 5.4, 4, Z, 0.5, 8, 0.5, 0x6f6a78);
  B.box(X, 15, Z, 30, 14, 1, 0xffffff);
}
export default {
  id: 'starlite',
  build(o, lot) {
    o.G.flat(lot.x0 + 2, lot.x1 - 2, lot.z0 + 2, lot.z1 - 2, CURB + 0.012, 0x4a4754);
    screen(o.B);
    o.N.box(X, 23, Z + 0.3, 3, 3, 0.3, 0xffa02e);
    for (let r = 0; r < 5; r++) o.M.flat(X - 90, X + 90, Z + 22 + r * 18 - 0.1, Z + 22 + r * 18 + 0.1, CURB + 0.03, 0xffffff);
    o.B.box(X, CURB + 2, -2320, 12, 4, 8, 0xf4d3aa, { top: 0x6f6a78 }); o.solid(X - 6, X + 6, -2324, -2316, 4);
    o.B.box(425, CURB + 1.5, -2300, 3, 3, 3, 0xff5a5a, { top: 0x6f6a78 }); o.solid(423.5, 426.5, -2301.5, -2298.5, 3);
    o.solid(X - 15, X + 15, Z - 0.5, Z + 0.5, 22);
  },
  shell(o) { screen(o.B); },
};
