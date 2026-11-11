// City Hall and its fountain (plan/bible/world/meridian.md): a white colonnade under a small dome,
// with a jet of water in front. Merged lot x -285 to -139, z -590 to -524; Cypress Street is closed
// across it. The hall is 70 x 30 x 16 on the north side, twelve columns across the south face, a
// drum and an eight-sided dome to 38 m. The fountain is at (-212, -540).
import { TRIM, CURB, wallQuad, signBoard, cellBox } from '../gen/kit.js';
import { signUV } from '../../gfx/atlas.js';
import { drawTiers, plainBox } from '../gen/towers.js';

const WHITE = 0xf7f3ea, WATER = 0x7fd6e8, PAVE = 0xe9b9a2, HX = -212, FX = -212, FZ = -540;
const HALL = { x0: HX - 35, x1: HX + 35, z0: -590, z1: -560, y0: 0, y1: 16, col: WHITE, top: 0xc8ccd2 };

// a ring of n flat sides between two radii and heights; r1 = 0 closes it to a point
function ring(B, cx, cz, r0, y0, r1, y1, n, col, quad = (b, ...a) => b.quad(...a), tri = (b, ...a) => b.tri(...a)) {
  for (let i = 0; i < n; i++) {
    const a0 = ((i + 0.5) / n) * Math.PI * 2, a1 = ((i + 1.5) / n) * Math.PI * 2, c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
    const p = [cx + c0 * r0, y0, cz + s0 * r0], q = [cx + c1 * r0, y0, cz + s1 * r0];
    if (r1 > 0) quad(B, q, p, [cx + c0 * r1, y1, cz + s0 * r1], [cx + c1 * r1, y1, cz + s1 * r1], col, i % 2 ? 1 : 0.94);
    else tri(B, q, p, [cx, y1, cz], col, i % 2 ? 1 : 0.94);
  }
}
function dome(B, sink) {
  const cz = -575;
  ring(B, HX, cz, 7, 16, 7, 24, 8, WHITE, ...sink);          // the drum, 14 m across
  ring(B, HX, cz, 7.4, 24, 6.2, 29, 8, 0x8fe3cf, ...sink);   // the dome, in old copper green
  ring(B, HX, cz, 6.2, 29, 3.6, 34, 8, 0x8fe3cf, ...sink);
  ring(B, HX, cz, 3.6, 34, 0, 38, 8, 0x8fe3cf, ...sink);
}

export default {
  id: 'cityhall', skyline: true,
  build(o, lot) {
    const B = o.B, rnd = o.rnd;
    o.G.flat(lot.x0, lot.x1, lot.z0, lot.z1, CURB + 0.012, PAVE);
    drawTiers(o, [HALL]);
    B.box(HX, 8, -575, 70.4, 0.5, 30.4, TRIM); B.box(HX, 16.3, -575, 70.8, 0.6, 30.8, TRIM, { top: 0xc8ccd2 });
    dome(B, []);
    // the porch: a plinth, twelve columns 1.2 x 12, the beam they carry, and steps 40 x 6 x 2
    B.box(HX, 1, -558, 72, 2, 4, WHITE);
    for (let i = 0; i < 12; i++) {
      const x = HX - 33 + i * 6;
      B.box(x, 8, -557.6, 1.2, 12, 1.2, WHITE);
      o.L.quad(...wallQuad({ x0: x - 0.6, x1: x + 0.6, z0: -558.2, z1: -557 }, 's', x, 7, 1.2, 10, 0.03), 0xffd58a, 0.5);       // uplit warm at night
    }
    B.box(HX, 15, -558, 72, 2, 4.4, WHITE, { bottom: true });
    for (let k = 0; k < 4; k++) B.box(HX, CURB + (2 - k * 0.5) / 2, -555.25 + k * 1.5, 40, 2 - k * 0.5, 1.5, 0xe8e0d8);
    const beam = { x0: HX - 36, x1: HX + 36, z0: -560.2, z1: -555.8 };
    o.S.quad(...wallQuad(beam, 's', HX, 15, 8, 1.7, 0.03), 0xffffff, 1, signUV(19));
    B.box(HX - 3, 2.6 + CURB, -556, 1.8, 3.2, 0.1, 0x1b2a40); B.box(HX + 3, 2.6 + CURB, -556, 1.8, 3.2, 0.1, 0x1b2a40);
    o.solid(HALL.x0, HALL.x1, HALL.z0, -556, 16); o.solid(HX - 20, HX + 20, -556, -550, 2);
    // the fountain: a basin of radius 8, a 6 m jet, cyan at night
    ring(B, FX, FZ, 8.4, CURB, 8.4, CURB + 0.7, 12, TRIM); ring(B, FX, FZ, 8.4, CURB + 0.7, 7.6, CURB + 0.7, 12, TRIM);
    ring(B, FX, FZ, 7.6, CURB + 0.5, 0, CURB + 0.5, 12, WATER);
    B.box(FX, CURB + 0.6, FZ, 1.4, 1.2, 1.4, TRIM);
    B.box(FX, CURB + 4.2, FZ, 0.7, 6, 0.7, 0xdff6ff, { taper: [0.3, 0.3] });
    ring(B, FX, FZ, 0.3, CURB + 7.2, 1.6, CURB + 5.4, 6, 0xdff6ff);
    ring(o.L, FX, FZ, 7.6, CURB + 0.56, 0, CURB + 0.56, 12, 0x29e6ff); o.L.box(FX, CURB + 4.2, FZ, 0.9, 6, 0.9, 0x8fe8ff, { taper: [0.3, 0.3] });
    o.solid(FX - 6, FX + 6, FZ - 6, FZ + 6, 0.8);
    // the mayor's podium and banner, a flagpole, benches, palms and lamps
    B.box(FX + 14, CURB + 0.6, -549, 2, 1.2, 1, 0x8a6f55); o.solid(FX + 13, FX + 15, -549.5, -548.5, 1.2);
    const ban = { x0: FX + 10, x1: FX + 18, z0: -551.1, z1: -551 };
    for (const dx of [-4, 4]) B.box(FX + 14 + dx, CURB + 2, -551.05, 0.12, 4, 0.12, 0xc8ccd2);
    cellBox(o, ban, CURB + 2.4, CURB + 4, 0xff3fa4, { bottom: true });
    B.box(HX + 44, 6, -548, 0.16, 12, 0.16, 0xc8ccd2); B.box(HX + 45.1, 11, -548, 2, 1.2, 0.05, 0x29e6ff, { bottom: true });
    for (const dx of [-60, -44, -28, 28, 44, 60]) { o.decor('palm', FX + dx, CURB, -532, dx, 1 + rnd() * 0.2); o.solid(FX + dx - 0.3, FX + dx + 0.3, -532.3, -531.7, 1); }
    for (const dx of [-16, 16]) { o.decor('bench', FX + dx, CURB, FZ, dx > 0 ? -Math.PI / 2 : Math.PI / 2, 1); o.prop('lamp', FX + dx * 2.4, CURB, -527, 0); }
    signBoard(o, { x0: lot.x1 - 12, x1: lot.x1 - 4, z0: -528, z1: -527.6 }, 's', 19, 2.2);
  },
  shell(o, lot, opts = {}) {
    const W = o.W, i = opts.inset || 0, q = (b, ...a) => b.quad(...a, [-1, 0, -1, 0, -1, 0, -1, 0]), t = (b, p0, p1, p2, col, sh) => { const at = b.count * 2; b.tri(p0, p1, p2, col, sh); b.t.set([-1, 0, -1, 0, -1, 0], at); };
    drawTiers({ W }, [HALL], { cell: 6, cut: false, inset: i });
    dome(W, [q, t]);
    plainBox(W, HX, 8, -558, 72 - i * 2, 16, 4 - i * 2, WHITE);
    if (!i) plainBox(W, (lot.x0 + lot.x1) / 2, CURB + 0.02, (lot.z0 + lot.z1) / 2, lot.x1 - lot.x0, 0.04, lot.z1 - lot.z0, PAVE);
  },
};
