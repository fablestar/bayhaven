// The model home for "Bayhaven Tomorrow" (plan/bible/world/mallard-greens.md, section 4): a blush
// Drake on a plastic lawn brighter than the rest, six feather flags and a banner. It stands beside
// Grackle Lane, 19 m east of the bible's seed (which is on the lane itself).
import { TRIM } from '../gen/kit.js';
import { paintInto } from '../gen/streets.js';
import { board } from '../../gfx/murals.js';
import { house } from '../gen/mallardgreens.js';
import { MODEL } from '../zones/mallardgreens.js';

const lotOf = () => ({ cx: MODEL.x, cz: MODEL.z, rot: MODEL.rot, w: 20, d: 12, recipe: 'mg-two', wall: 0xf0d0c8, show: false });
export default {
  id: 'model-home',
  build(o) {
    const x = MODEL.x, z = MODEL.z;
    o.G.flat(x - 15, x + 7, z - 12, z + 12, 0.02, 0x62e884);                     // the plastic lawn, 22 x 24
    house(o, lotOf(), false);
    for (let i = 0; i < 6; i++) { const fz = z - 11 + i * 4.4; o.B.box(x - 14.4, 2.5, fz, 0.08, 5, 0.08, TRIM); o.B.box(x - 14.4, 3, fz + 0.35, 0.06, 4, 0.6, i % 2 ? 0xff3fa4 : 0x7fd6e8, { taper: [1, 0.4] }); }
    for (const pz of [z - 4, z + 4]) o.B.box(x - 13, 1.6, pz, 0.15, 3.2, 0.15, TRIM);
    o.B.box(x - 13, 2.6, z, 0.1, 1.3, 8.2, TRIM);
    paintInto(o).quad([x - 13.07, 1.6, z - 4], [x - 13.07, 1.6, z + 4], [x - 13.07, 3.6, z + 4], [x - 13.07, 3.6, z - 4], 0xffffff, 1, board('Bayhaven Tomorrow', '#ff3fa4'));
  },
  shell(o) { house(o, lotOf(), true); },
};
