// The Paintworks kit (plan/bible/world/paintworks.md): W1 brick warehouse, W2 metal shed, W4
// container bar, W5 rooftop club with moving lights. Every warehouse, shed and club carries at
// least one mural wall from the mural painter. W3, W6 and W7 are tier B: their lots are W1.
import * as THREE from 'three';
import { TRIM, ROOF, GLASS, CURB, NEON, wallQuad, span, neonStrip } from './kit.js';
import { register, generator, paintInto, wallEnds, container, CONTAINER } from './streets.js';
import { muralWall, paintworksPalette } from '../../gfx/murals.js';
import { chunkMaterials } from '../../gfx/materials.js';
import { MeshBuilder } from '../../gfx/builder.js';
import { bulbString } from './palmavieja.js';
import { BRICK, METAL, BAR_COLOURS } from '../zones/paintworks.js';

const STEEL = 0x4a4f5c, GRAVEL = 0xb9a58a, VIOLET = 0xb46bff, MINT = 0x5dff9b;
const stats = { warehouses: 0, sheds: 0, bars: 0, clubs: 0, murals: 0, muralCells: 0, barContainers: 0, movingLights: 0, tallest: 0 };

function murals(o, lot, y0 = 0.4) {
  for (const m of lot.murals || []) {
    const [a, b] = wallEnds(lot.body, m.side, 0.06);
    stats.muralCells += muralWall(paintInto(o), a, b, y0, lot.h - 0.5, m.seed, paintworksPalette(m.seed), { cells: m.cells, drips: true }); stats.murals++;
  }
}
// steel-framed windows 3 x 2 in a grid along a wall, from y0 up; a few lit at night
function steelWindows(o, c, side, y0, y1, e = 0.1) {
  const [a, b] = span(c, side), cols = Math.floor((b - a - 2) / (o.low ? 9 : 4.5)), rows = Math.max(1, Math.floor((y1 - y0) / 5));
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const u = a + ((i + 0.5) * (b - a)) / cols, y = y0 + j * 5 + 2.4;
    o.B.quad(...wallQuad(c, side, u, y, 3, 2, e), GLASS, 0.8 + o.rnd() * 0.4);
    if (o.rnd() < 0.2) o.L.quad(...wallQuad(c, side, u, y, 3, 2, e + 0.03), o.rnd() < 0.7 ? 0xffd58a : 0x8fe8ff, 0.4 + o.rnd() * 0.5);
  }
}
const inner = (lot) => (lot.out === 'w' ? 'e' : 'w'), back = (lot) => (lot.face === 's' ? 'n' : 's');
function yard(o, lot) { o.G.flat(lot.x0, lot.x1, lot.z0, lot.z1, CURB + 0.012, 0xc9c0b2); }

// W1: brick, two or three 5 m floors, a sawtooth or flat roof, a loading door, a steel stair, bins
function warehouse(o, lot) {
  const c = lot.body, h = lot.h, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2, w = c.x1 - c.x0, d = c.z1 - c.z0, f = lot.face, dir = f === 's' ? 1 : -1;
  stats.warehouses++; yard(o, lot);
  o.B.box(cx, h / 2, cz, w, h, d, BRICK, { top: ROOF });
  let top = h;
  if (o.rnd() < 0.6) {            // three to five sawteeth, glass to the north
    const n = 3 + Math.floor(o.rnd() * 3), t = d / n;
    for (let i = 0; i < n; i++) {
      const z0 = c.z0 + i * t, z1 = z0 + t, y1 = h + 2.6;
      o.B.hexa([[c.x0, h, z0], [c.x1, h, z0], [c.x1, h, z1], [c.x0, h, z1], [c.x0, y1, z0], [c.x1, y1, z0], [c.x1, h, z1], [c.x0, h, z1]], 0x8a9099, { top: 0x9aa3ad });
      o.B.quad([c.x1 - 1, h + 0.4, z0 - 0.03], [c.x0 + 1, h + 0.4, z0 - 0.03], [c.x0 + 1, y1 - 0.4, z0 - 0.03], [c.x1 - 1, y1 - 0.4, z0 - 0.03], GLASS, 1.1);
    }
    top = h + 2.6;
  } else o.B.box(cx + w / 5, h + 1.3, cz, 3, 2.6, 3, 0x8a6f55, { taper: [0.9, 0.9] });         // a rusted tank
  stats.tallest = Math.max(stats.tallest, top);
  murals(o, lot);
  steelWindows(o, c, f, 5, h - 0.6); steelWindows(o, c, inner(lot), 0.4, h - 0.6);
  if (!o.low) steelWindows(o, c, back(lot), 0.4, h - 0.6);
  o.B.quad(...wallQuad(c, f, cx - w / 4, 2.25, 4, 4.5, 0.12), STEEL, 0.9);                    // the loading door
  o.B.quad(...wallQuad(c, f, cx + w / 4, 1.2, 1.2, 2.4, 0.12), TRIM, 0.9);
  if (!o.low) {                   // a steel stair up the inner wall, and two bins by the door
    const sx = lot.out === 'w' ? c.x1 + 0.7 : c.x0 - 0.7;
    for (let k = 0; k < Math.min(3, lot.floors); k++) o.B.box(sx, 2.5 + k * 5, cz + (k % 2 ? 3 : -3), 1.3, 0.15, 7, STEEL, { bottom: true, shift: [0, 0] });
    o.B.box(sx, h / 2 - 1, cz, 0.15, h - 2, 0.15, STEEL, { noTop: true });
    for (const u of [1.5, 3]) o.B.box(cx + w / 4 + u, CURB + 0.55, (f === 's' ? c.z1 : c.z0) + dir * 0.7, 1.1, 1.1, 0.9, [0x3d6b4a, 0x2e4a6b][u > 2 ? 1 : 0], { top: 0x2b2838 });
  }
  o.solid(c.x0, c.x1, c.z0, c.z1, h);
}

// W2: a metal shed with an 8 m eave, a low gable with three vents, a sliding door, pallets
function shed(o, lot) {
  const c = lot.body, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2, w = c.x1 - c.x0, d = c.z1 - c.z0, f = lot.face, dir = f === 's' ? 1 : -1;
  stats.sheds++; yard(o, lot); stats.tallest = Math.max(stats.tallest, 10.6);
  o.B.box(cx, 4, cz, w, 8, d, METAL, { noTop: true });
  o.B.box(cx, 9, cz, w + 0.6, 2, d + 0.6, 0x9aa3ad, { taper: [0.05, 1], bottom: true });
  for (let i = -1; i <= 1; i++) o.B.box(cx, 10.1, cz + i * d / 3.4, 1.2, 1, 1.2, 0xc8ccd2);
  murals(o, lot);
  o.B.quad(...wallQuad(c, f, cx, 2.5, 6, 5, 0.12), STEEL, 0.85);
  o.B.quad(...wallQuad(c, f, cx, 5.3, 7, 0.3, 0.14), 0x2b2838);
  if (!o.low) for (let k = 0; k < 3; k++) o.B.box(cx + 5.5 + (k === 2 ? 0 : k * 1.3), CURB + 0.3 + (k === 2 ? 0.6 : 0), (f === 's' ? c.z1 : c.z0) + dir * 1.2, 1.2, 0.6, 1.2, 0xc8a878);
  o.solid(c.x0, c.x1, c.z0, c.z1, 8);
}

// W4: a container bar. Bright boxes stacked two or three high, one side folded down as a counter,
// stools, a neon arrow, a railed deck on the top box, bulbs over the court.
function containerBar(o, lot) {
  const c = lot.body, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2, f = lot.face, dir = f === 's' ? 1 : -1, H = CONTAINER.h, y = CURB, rnd = o.rnd;
  const col = () => BAR_COLOURS[Math.floor(rnd() * BAR_COLOURS.length)];
  stats.bars++; o.G.flat(lot.x0, lot.x1, lot.z0, lot.z1, y + 0.012, GRAVEL);
  const put = (x, yy, z, alongZ) => { container(o, x, yy, z, alongZ, col()); stats.barContainers++; };
  put(cx, y, cz - 5, false); put(cx, y, cz + 5, false);                       // two on the ground, a court between
  put(cx - 4, y + H, cz, true);                                               // one across them
  if (rnd() < 0.6) put(cx + 4, y + H, cz, true);
  let top = 2 * H;
  if (lot.floors > 2) { put(cx - 4, y + 2 * H, cz - 3, false); top = 3 * H; }
  stats.tallest = Math.max(stats.tallest, top + 1.1);
  for (const z of [cz - 5, cz + 5]) o.solid(cx - 6.1, cx + 6.1, z - 1.3, z + 1.3, H);
  // the counter: the street-side box's wall folded down, with stools
  const zc = cz + dir * 5 + dir * 1.9;
  o.B.box(cx, y + 1.05, zc, 8, 0.1, 1.0, TRIM, { bottom: true });
  o.B.quad(...wallQuad({ x0: cx - 6.1, x1: cx + 6.1, z0: cz + dir * 5 - 1.3, z1: cz + dir * 5 + 1.3 }, f, cx, y + 1.75, 8, 1.2, 0.03), 0x1b1530);
  o.L.quad(...wallQuad({ x0: cx - 6.1, x1: cx + 6.1, z0: cz + dir * 5 - 1.3, z1: cz + dir * 5 + 1.3 }, f, cx, y + 1.75, 8, 1.2, 0.06), 0xff8fd0, 0.6);
  if (!o.low) for (let i = -3; i <= 3; i += 1.5) o.B.box(cx + i, y + 0.38, zc + dir * 0.8, 0.4, 0.76, 0.4, 0x2b2838);
  // a deck rail on the top box, a neon arrow to the door, bulbs over the court
  if (!o.low) { const ry = y + top + 0.5; o.B.box(cx - 4, ry, cz, lot.floors > 2 ? 12.2 : 2.6, 1, lot.floors > 2 ? 0.08 : 12.2, 0x2b2838, { noTop: true }); }
  const ax = cx + 7.4, az = cz + dir * 5, an = NEON[Math.floor(rnd() * 5)];
  o.B.box(ax, y + 2.2, az, 0.2, 4.4, 0.2, 0x2b2838); o.solid(ax - 0.2, ax + 0.2, az - 0.2, az + 0.2, 4);
  o.N.box(ax - 0.9, y + 4.2, az, 1.8, 0.3, 0.14, an); o.N.box(ax - 1.9, y + 4.2, az, 0.7, 0.9, 0.14, an, { taper: [0.05, 1], rot: Math.PI / 2 });
  bulbString(o, cx - 6, cz - 3.6, cx + 6, cz + 3.6, 4.4, 8);
}

// the eight moving lights of a rooftop club: two fans of four beams, violet and mint, that swing
// against each other after dark
let fanGeo = null;
const beamMat = {};
function clubLights(o, x, y, z) {
  if (!fanGeo) {                   // four cones from one point, fanned out; shared by every club, so never freed with a chunk
    const b = new MeshBuilder({ size: 128 });
    for (const tilt of [-0.5, -0.18, 0.18, 0.5]) {
      const ax = Math.sin(tilt) * 46, ay = Math.cos(tilt) * 46, rim = (i) => { const a = (i / 6) * Math.PI * 2; return [ax + Math.cos(a) * 3.2 * Math.cos(tilt), ay - Math.cos(a) * 3.2 * Math.sin(tilt), Math.sin(a) * 3.2]; };
      for (let i = 0; i < 6; i++) b.tri([0, 0, 0], rim(i), rim(i + 1), 0xffffff);
    }
    fanGeo = b.build(); fanGeo.dispose = () => {};
  }
  const group = new THREE.Group(), fans = [];
  [VIOLET, MINT].forEach((col, k) => {
    const mat = beamMat[col] || (beamMat[col] = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    const fan = new THREE.Mesh(fanGeo, mat); fan.position.set(x + (k ? 5 : -5), y, z); fan.frustumCulled = false; fan.userData.beams = 4;
    fans.push(fan); group.add(fan);
  });
  fans[0].onBeforeRender = () => {
    const t = performance.now() / 1000, on = chunkMaterials().on || 0;
    beamMat[VIOLET].opacity = beamMat[MINT].opacity = 0.16 * on;
    fans[0].rotation.set(Math.sin(t * 0.9) * 0.45, t * 0.35, 0); fans[1].rotation.set(Math.sin(t * 0.9 + 2) * 0.45, -t * 0.35 + 1, 0);
  };
  o.object(group); stats.movingLights += 8;
}

// W5: a rooftop club, three floors of metal under a full mural, a terrace with a truss and lights
function club(o, lot) {
  const c = lot.body, h = lot.h, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2, w = c.x1 - c.x0, d = c.z1 - c.z0, f = lot.face, dir = f === 's' ? 1 : -1;
  stats.clubs++; yard(o, lot); stats.tallest = Math.max(stats.tallest, h + 5);
  o.B.box(cx, h / 2, cz, w, h, d, METAL, { top: 0x3b3946 });
  o.B.box(cx, h + 0.5, cz, w + 0.2, 1, d + 0.2, 0x2b2838, { noTop: true });             // the terrace rail
  // the truss, 20 x 12 x 5: four posts and a frame
  for (const dx of [-10, 10]) for (const dz of [-6, 6]) o.B.box(cx + dx, h + 2.5, cz + dz, 0.4, 5, 0.4, STEEL, { noTop: true });
  for (const dz of [-6, 6]) o.B.box(cx, h + 5, cz + dz, 20.4, 0.5, 0.5, STEEL, { bottom: true });
  for (const dx of [-10, 0, 10]) o.B.box(cx + dx, h + 5, cz, 0.5, 0.5, 12, STEEL, { bottom: true });
  for (let i = 0; i < 8; i++) o.N.box(cx - 8.75 + (i % 4) * 5.8, h + 4.6, cz + (i < 4 ? -6 : 6), 0.7, 0.5, 0.7, i % 2 ? VIOLET : MINT, { bottom: true });
  clubLights(o, cx, h + 4.6, cz);
  murals(o, lot, 0.2);
  // the door, a neon line over it, a rope line on the sidewalk, a poster wall
  const zf = f === 's' ? c.z1 : c.z0;
  o.B.quad(...wallQuad(c, f, cx, 1.5, 2.4, 3, 0.12), 0x150f3d);
  neonStrip(o, { x0: cx - 4, x1: cx + 4, z0: c.z0, z1: c.z1 }, f, 3.5, o.rnd() < 0.5 ? VIOLET : MINT, 0.2);
  for (let i = 0; i < 5; i++) { o.B.box(cx + 2 + i * 2.2, CURB + 0.5, zf + dir * 1.6, 0.14, 1, 0.14, 0xffc300); if (i && !o.low) o.B.box(cx + 0.9 + i * 2.2, CURB + 0.85, zf + dir * 1.6, 2.2, 0.06, 0.06, 0xb23a2e, { bottom: true }); }
  if (!o.low) for (let i = 0; i < 4; i++) o.B.quad(...wallQuad(c, f, cx - 5 - i * 1.5, 1.8, 1.2, 1.7, 0.1), [0xff3fa4, 0xfff1c9, 0x29e6ff, 0xffa02e][i]);
  o.solid(c.x0, c.x1, c.z0, c.z1, h);
}

const RECIPES = { W1: warehouse, W2: shed, W4: containerBar, W5: club };
register('paintworks', {
  lot: (o, lot) => RECIPES[lot.recipe](o, lot),
  shellLot(o, lot) {
    const c = lot.body, h = lot.h;
    if (!c) return;
    if (lot.recipe === 'W4') { o.B.box((c.x0 + c.x1) / 2, 2.6, (c.z0 + c.z1) / 2, 12.2, 5.2, 12.6, lot.wall, { top: 0xd8d8d8 }); return; }
    o.B.box((c.x0 + c.x1) / 2, h / 2, (c.z0 + c.z1) / 2, c.x1 - c.x0, h, c.z1 - c.z0, lot.wall, { top: lot.roof });
  },
  // lamps at the corners and the middle of each kerb, a palm in a tub, a skip, pallets
  furniture(o, b) {
    if (b.row.strip) { for (let x = b.x0 + 10; x <= b.x1 - 8; x += 26) o.decor('palm', x, CURB, (b.z0 + b.z1) / 2, x, 0.9); return; }
    if (b.edge || b.x1 - b.x0 < 40 || b.zone.hero.some((h) => h.x0 < b.x1 && h.x1 > b.x0 && h.z0 < b.z1 && h.z1 > b.z0)) return;
    for (const [z, dz] of [[b.z1 - 1, 1], [b.z0 + 1, -1]]) {
      for (const x of [b.x0 + 6, (b.x0 + b.x1) / 2, b.x1 - 6]) o.prop('lamp', x, CURB, z, dz > 0 ? 0 : Math.PI);
      const x = b.x0 + 20 + (dz > 0 ? 0 : 22);
      o.B.box(x, CURB + 0.4, z - dz * 0.6, 1.2, 0.8, 1.2, 0x8a6f55, { top: 0x5a4a32 }); o.decor('palm', x, CURB + 0.6, z - dz * 0.6, x + z, 0.75); o.solid(x - 0.6, x + 0.6, z - dz * 0.6 - 0.6, z - dz * 0.6 + 0.6, 1);
    }
    if (!o.low && o.rnd() < 0.5) { const x = b.x1 - 16, z = b.z1 - 1.7; o.B.box(x, CURB + 0.7, z, 3.6, 1.4, 1.7, 0xffc300, { taper: [1.15, 1] }); o.solid(x - 1.8, x + 1.8, z - 0.85, z + 0.85, 1.4); }
  },
  // Container Row hangs bulbs across its streets, six strings to 100 m
  street(o, p, map) {
    const ns = p.axis === 'ns', mx = (p.ax + p.bx) / 2, mz = (p.az + p.bz) / 2;
    if (!(mx >= 1180 && mz > -660 && mz < -357) || p.len < 30) return;
    const a = (ns ? p.az : p.ax) + (p.a ? map.nodes.get(p.a).half[ns ? 'ew' : 'ns'] : 0) + 5, b = (ns ? p.bz : p.bx) - (p.b ? map.nodes.get(p.b).half[ns ? 'ew' : 'ns'] : 0) - 5;
    const want = Math.ceil(((b - a + 10) * (o.low ? 3 : 6)) / 100), reach = p.width / 2 + 4, c = ns ? p.ax : p.az;
    for (let i = 0; i < want; i++) { const t = a + ((b - a) * (i + 0.5)) / want; if (ns) bulbString(o, c - reach, t, c + reach, t); else bulbString(o, t, c - reach, t, c + reach); }
  },
});
export default generator('paintworks', stats);
