// The old paint factory (plan/bible/world/paintworks.md): three tall chimneys with paint running
// down them. Merged lot x 1179 to 1321, z -910 to -764; Umber Street and Sixth Street are closed
// across it. A brick hall 70 x 50 x 16 centred on (1272, -802) under a six-tooth sawtooth roof;
// chimneys at (1200, -885), (1222, -885) and (1244, -885), 62 m tipped pink, 54 m tipped cyan and
// 46 m tipped mint; four pigment vats along z = -850; a loading dock on the Pigment Avenue side.
import { CURB, GLASS, wallQuad } from '../gen/kit.js';
import { penB, penW, prism, paintInto, wallEnds } from '../gen/streets.js';
import { muralWall, paintworksPalette } from '../../gfx/murals.js';

const BRICK = 0xa8553a, CONCRETE = 0xc8ccd2, STEEL = 0x4a4f5c;
export const CHIMNEYS = [{ x: 1200, z: -885, h: 62, col: 0xff3fa4 }, { x: 1222, z: -885, h: 54, col: 0x29e6ff }, { x: 1244, z: -885, h: 46, col: 0x5dff9b }];
const VATS = [[1200, 0xb46bff], [1220, 0xffa02e], [1240, 0xff3fa4], [1260, 0x29e6ff]];
const HALL = { x0: 1237, x1: 1307, z0: -827, z1: -777, h: 16 };

function outline(p, inset = 0, far = false) {
  const H = HALL;
  p.box((H.x0 + H.x1) / 2, H.h / 2, (H.z0 + H.z1) / 2, H.x1 - H.x0 - inset * 2, H.h, H.z1 - H.z0 - inset * 2, BRICK, { top: 0x8a9099 });
  for (const c of CHIMNEYS) {
    p.prism(c.x, c.z, 2.2 - inset, 0, c.h - 12, BRICK, { n: far ? 6 : 8, noTop: true });
    p.prism(c.x, c.z, 2.3 - inset, c.h - 12, c.h, c.col, { n: far ? 6 : 8, top: 0x2b2838 });
  }
  for (const [x, col] of VATS) p.prism(x, -850, 3 - inset, 0, 8, col, { n: far ? 6 : 8, top: 0xfdf6ea });
}

export default {
  id: 'paint-factory', skyline: true, chimneys: CHIMNEYS,
  build(o, lot) {
    const y = CURB, B = o.B, H = HALL, r = o.rnd;
    o.G.flat(lot.x0, lot.x1, lot.z0, lot.z1, y + 0.012, CONCRETE);
    outline(penB(o));
    // six sawteeth along the hall, glass to the north
    const t = (H.x1 - H.x0) / 6;
    for (let i = 0; i < 6; i++) {
      const x0 = H.x0 + i * t, x1 = x0 + t, y1 = H.h + 3.4;
      B.hexa([[x0, H.h, H.z0], [x1, H.h, H.z0], [x1, H.h, H.z1], [x0, H.h, H.z1], [x0, y1, H.z0], [x1, H.h, H.z0], [x1, H.h, H.z1], [x0, y1, H.z1]], 0x8a9099, { top: 0x9aa3ad });
      B.quad([x0 - 0.03, H.h + 0.4, H.z0 + 1], [x0 - 0.03, H.h + 0.4, H.z1 - 1], [x0 - 0.03, y1 - 0.4, H.z1 - 1], [x0 - 0.03, y1 - 0.4, H.z0 + 1], GLASS, 1.1);
    }
    // steel windows on the north and east walls; one lit at night
    for (const side of ['n', 'e']) {
      const [a, b] = side === 'n' ? [H.x0, H.x1] : [H.z0, H.z1], n = Math.floor((b - a) / (o.low ? 10 : 5));
      for (let i = 0; i < n; i++) for (const yy of o.low ? [9] : [4, 10]) B.quad(...wallQuad(H, side, a + ((i + 0.5) * (b - a)) / n, yy, 3, 2, 0.08), GLASS, 0.8 + r() * 0.4);
    }
    o.L.quad(...wallQuad(H, 'e', H.z0 + 7.5, 10, 3, 2, 0.11), 0xffd58a, 0.9);
    // murals on the south and west walls
    const U = paintInto(o);
    muralWall(U, ...wallEnds(H, 's', 0.06), 0.4, H.h - 0.4, 5026, paintworksPalette(5026), { cells: 4, drips: true });
    muralWall(U, ...wallEnds(H, 'w', 0.06), 0.4, H.h - 0.4, 5030, paintworksPalette(5030), { cells: 2, drips: true });
    // the chimneys: six drips of paint running 4 to 14 m down the brick, a glow at the top after dark
    for (const c of CHIMNEYS) {
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 8 + ((i + 0.5 + (i % 2) * 0.5) / 6) * Math.PI * 2, len = 4 + r() * 10, rad = 2.2;
        B.box(c.x + Math.sin(a) * rad, c.h - 12 - len / 2, c.z + Math.cos(a) * rad, 0.5, len, 0.25, c.col, { rot: a, noTop: true });
        if (i % 2 === 0) o.L.box(c.x + Math.sin(a) * (rad + 0.1), c.h - 12 - len / 2, c.z + Math.cos(a) * (rad + 0.1), 0.5, len, 0.2, c.col, { rot: a, noTop: true });
      }
      prism(o.L, c.x, c.z, 2.42, c.h - 12, c.h, c.col, { noTop: true });
      prism(o.N, c.x, c.z, 2.4, c.h - 0.8, c.h + 0.1, c.col, { noTop: true });
      B.box(c.x, 1, c.z, 6, 2, 6, 0x8a4630);
      o.solid(c.x - 3, c.x + 3, c.z - 3, c.z + 3, c.h);
    }
    // a ladder up the tallest chimney to a platform at 40 m
    B.box(1200, 20, -882.6, 0.7, 40, 0.12, STEEL, { noTop: true });
    B.box(1200, 40, -885, 7, 0.3, 7, STEEL, { bottom: true });
    for (const [x] of VATS) o.solid(x - 2.8, x + 2.8, -852.8, -847.2, 8);
    // the loading dock, 30 x 8 x 1.2, on the Pigment Avenue side, with two roller doors
    B.box(1311, y + 0.6, -802, 8, 1.2, 30, CONCRETE);
    for (const z of [-810, -794]) B.quad(...wallQuad(H, 'e', z, 3.6, 4, 4.5, 0.08), STEEL, 0.85);
    o.solid(1307, 1315, -817, -787, 1.2); o.solid(H.x0, H.x1, H.z0, H.z1, H.h);
    for (const [x, z] of [[1185, -770], [1315, -770], [1185, -904], [1315, -904]]) o.prop('lamp', x, y, z, z > -800 ? 0 : Math.PI);
  },
  shell(o, lot, { inset = 0 } = {}) { outline(o.B ? penB(o) : penW(o), inset, true); },
};
