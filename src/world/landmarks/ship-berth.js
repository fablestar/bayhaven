// The container ship Slack Tide at her berth under the four cranes (plan/bible/world/rustwater.md):
// hull 40 x 300 x 14 in blue with a rust band at the waterline, x 3030 to 3070, z -450 to -150; a
// white bridge block 30 x 16 x 30 at the north end, to 44 m; container stacks four high on deck.
// Only the boxes you can see are drawn: the top layer and the outside of the pile.
import { penB, penW, container, CONTAINER } from '../gen/streets.js';

const HULL = 0x2e4a6b, RUST = 0xb5532f, WHITE = 0xe0e0e6, CX = 3050, DECK = 14;
const COLOURS = [0xb5532f, 0xffc300, 0xbf4343, 0x2e4a6b, 0x3d6b4a, 0xe0e0e6];
const ROWS = 12, BAYS = 20, PX = CONTAINER.w + 0.3, PZ = CONTAINER.l + 0.4, Z_FIRST = -412;
export const stats = { deckContainers: 0, top: 44 };

function ship(p, i) {
  p.box(CX, 5.8, -300, 40 - i, 16.4 - i, 300 - i, HULL, { top: 0x5b5660 });           // from under the water to the deck at 14 m
  p.box(CX, 29, -436, 30 - i, 30, 16 - i, WHITE);                                      // the bridge block, to 44 m
  p.box(CX, 37, -436, 38 - i, 3, 10 - i, WHITE);                                       // its wings
}

export default {
  id: 'ship-berth', skyline: true, stats,
  build(o) {
    const B = o.B;
    ship(penB(o), 0);
    B.box(CX, 0.3, -300, 40.3, 1.8, 300.3, RUST, { noTop: true });                    // the rust band at the waterline
    B.box(CX, 14.6, -152, 36, 1.2, 3, HULL);                                            // the bow rail
    B.box(CX + 8, 46, -438, 4, 4, 5, RUST);                                             // the funnel, behind the bridge
    for (const y of [33, 38, 41.5]) { B.quad([CX - 14, y, -427.95], [CX + 14, y, -427.95], [CX + 14, y + 1.4, -427.95], [CX - 14, y + 1.4, -427.95], 0x1b2a40); o.L.quad([CX - 14, y, -427.9], [CX + 14, y, -427.9], [CX + 14, y + 1.4, -427.9], [CX - 14, y + 1.4, -427.9], 0xffd58a, 0.5); }
    // deck cargo, four high, long side fore and aft
    const rnd = o.rnd;
    for (let b = 0; b < BAYS; b++) for (let r = 0; r < ROWS; r++) for (let k = 0; k < 4; k++) {
      const col = COLOURS[Math.floor(rnd() * 6)];
      if (k < 3 && b > 0 && b < BAYS - 1 && r > 0 && r < ROWS - 1) continue;          // hidden inside the pile
      if (o.low && k < 3 && (b + r) % 2) continue;
      container(o, CX + (r - (ROWS - 1) / 2) * PX, DECK + k * CONTAINER.h, Z_FIRST + b * PZ, true, col); stats.deckContainers++;
    }
    if (o.low) B.box(CX, DECK + 3.8, Z_FIRST + (BAYS - 1) * PZ / 2, ROWS * PX - 1, 7.6, BAYS * PZ - 1, RUST, { noTop: true });      // phones: a plain core behind the thinned boxes
    o.solid(3030, 3070, -450, -150, 14);
  },
  shell(o, lot, { inset = 0 } = {}) {
    const p = penW(o), i = inset ? 0.4 : 0;
    ship(p, i);
    p.box(CX, DECK + 5.2, Z_FIRST + (BAYS - 1) * PZ / 2, ROWS * PX - i, 10.4 - i, BAYS * PZ - i, RUST, { top: 0x3d6b4a });
  },
};
