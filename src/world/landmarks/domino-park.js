// Domino Park (plan/bible/world/palma-vieja.md): a shaded square where Rafa holds court. Merged
// lot x -1485 to -1343, z -910 to -844, Calle Mamey closed across it. Twelve dark shade trees with
// bulbs strung between them, a tin pergola along the north side over eight tables, and Rafa's
// table at (-1400, -880) under the largest tree, with a rose parasol.
import { CURB } from '../gen/kit.js';
import { bulbString, stats as gen } from '../gen/palmavieja.js';

const PAVE = 0xe9b9a2, WALL = 0xfdf6ea, LEAF = 0x2f9e58, TRUNK = 0x8a6a4a, TIN = 0x2ec4b6, ROSE = 0xff6f91;
export const TABLES = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ x: -1440.25 + i * 3.5, z: -904 }));
const TREES = [];
for (let i = 0; i < 6; i++) for (const z of [-889, -861]) TREES.push({ x: -1472 + i * 23.6 + (z === -861 ? 6 : 0), z, s: 1 });
TREES[5].x = -1400; TREES[5].z = -883; TREES[5].s = 1.25;          // the largest, over Rafa's table
const stats = { tables: 0, trees: 0 };

function table(o, x, z, stools, y = CURB) {
  o.B.box(x, y + 0.76, z, 1.2, 0.08, 1.2, WALL, { bottom: true }); o.B.box(x, y + 0.36, z, 0.2, 0.72, 0.2, 0x6f6a78, { noTop: true });
  for (const [dx, dz] of [[0, 0.95], [0, -0.95], [0.95, 0], [-0.95, 0]].slice(0, stools)) o.B.box(x + dx, y + 0.23, z + dz, 0.4, 0.46, 0.4, TIN);
  o.solid(x - 0.6, x + 0.6, z - 0.6, z + 0.6, 0.8);
  stats.tables++;
}

export default {
  id: 'domino-park', stats, tables: TABLES,
  build(o, lot) {
    const { x0, x1, z0, z1 } = lot, mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, y = CURB;
    stats.tables = 0; stats.trees = 0;
    o.G.flat(x0, x1, z0, z1, y + 0.012, PAVE);
    // a 0.6 m wall round it, with a gate in the middle of each side
    for (const [a, b] of [[x0, mx - 3], [mx + 3, x1]]) for (const z of [z0 + 0.2, z1 - 0.2]) { o.B.box((a + b) / 2, y + 0.3, z, b - a, 0.6, 0.4, WALL); o.solid(a, b, z - 0.2, z + 0.2, 0.6); }
    for (const [a, b] of [[z0, mz - 3], [mz + 3, z1]]) for (const x of [x0 + 0.2, x1 - 0.2]) { o.B.box(x, y + 0.3, (a + b) / 2, 0.4, 0.6, b - a, WALL); o.solid(x - 0.2, x + 0.2, a, b, 0.6); }
    // twelve shade trees: a square trunk, a dark box of leaves to 9 m
    for (const t of TREES) {
      o.B.box(t.x, y + 2, t.z, 0.5 * t.s, 4, 0.5 * t.s, TRUNK, { noTop: true });
      o.B.box(t.x, y + 6.5 - (t.s - 1), t.z, 6 * t.s, 5, 6 * t.s, LEAF, { bottom: true, taper: [0.8, 0.8], top: 0x3fb86a });
      o.solid(t.x - 0.3, t.x + 0.3, t.z - 0.3, t.z + 0.3, 4); stats.trees++;
    }
    // bulbs tree to tree, along both rows
    for (let i = 0; i < 5; i++) for (const r of [0, 1]) { const a = TREES[i * 2 + r], b = TREES[i * 2 + 2 + r]; bulbString(o, a.x, a.z, b.x, b.z, 4.6, o.low ? 6 : 10); }
    // the tin pergola, 30 x 8 x 3.2, along the north side over eight tables
    const px = -1428, pz = -904;
    o.B.box(px, y + 3.1, pz, 30, 0.2, 8, TIN, { bottom: true });
    for (let x = px - 14.6; x <= px + 14.6; x += 9.73) for (const z of [pz - 3.6, pz + 3.6]) o.B.box(x, y + 1.5, z, 0.25, 3, 0.25, 0x6f6a78, { noTop: true });
    for (const t of TABLES) {
      table(o, t.x, t.z, o.low ? 2 : 4);
      o.N.box(t.x, y + 2.7, t.z, 0.3, 0.2, 0.3, 0xfff2cc, { bottom: true });            // a lamp over each table
      o.L.flat(t.x - 1.6, t.x + 1.6, t.z - 1.6, t.z + 1.6, y + 0.05, 0xffc27a, 0.35);
    }
    // Rafa's table under the largest tree, with its parasol; the chalk league board
    const rx = -1400, rz = -880;
    o.B.box(rx, y + 0.76, rz, 1.4, 0.08, 1.4, WALL, { bottom: true }); o.B.box(rx, y + 1.3, rz, 0.1, 2.6, 0.1, 0x6f6a78);
    o.B.box(rx, y + 2.75, rz, 3.4, 0.5, 3.4, ROSE, { taper: [0.1, 0.1], bottom: true });
    for (const [dx, dz] of [[0, 1.1], [0, -1.1], [1.1, 0], [-1.1, 0]]) o.B.box(rx + dx, y + 0.23, rz + dz, 0.4, 0.46, 0.4, ROSE);
    o.solid(rx - 0.7, rx + 0.7, rz - 0.7, rz + 0.7, 0.8);
    o.B.box(-1391, y + 1.5, -897, 3, 2, 0.15, 0x2b3a35); o.B.box(-1391, y + 0.5, -897, 0.15, 1, 0.15, 0x6f6a78); o.solid(-1392.5, -1389.5, -897.2, -896.8, 2.5);
    gen.parkTables = stats.tables;
    for (const x of [x0 + 14, x1 - 14]) o.decor('bench', x, y, z1 - 3, Math.PI, 1);
  },
  // from far away: a block of dark trees
  shell(o, lot) {
    if (!o.B) return;
    o.B.flat(lot.x0, lot.x1, lot.z0, lot.z1, CURB + 0.02, PAVE);
    for (const t of TREES) o.B.box(t.x, 6.6, t.z, 6 * t.s, 5, 6 * t.s, LEAF, { taper: [0.8, 0.8], top: 0x3fb86a });
  },
};
