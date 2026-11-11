// Vehicle shapes: low-poly bodies made of boxes and wedges, read from the model sheets in
// plan/bible/catalog/vehicles-road.md. A piece is `name:LxWxH@f,y`: L along the car, W across,
// H up, f the centre's distance ahead of the origin, y the underside's height. The car faces +z.
// One shape serves three builds: the player's (colours baked), a parked one-mesh car, and the
// traffic build, where a mask on each vertex says "take this car's paint" or "its accent", so
// one InstancedMesh per model draws every colour. World code may import createParkedCar.

import * as THREE from 'three';
import { MeshBuilder } from '../gfx/builder.js';
import { SHEETS as DAY3 } from '../content/vehicles.js';

const DARK = 0x1b1924, GLASS = 0x16263c, STEEL = 0xc8ccd2, TYRE = 0x15141a, HUB = 0x9a9aa8, SPOKE = 0x2a2a34;
export const WHEEL_R = 0.36;

// head: [x, y, z] of a headlight's centre (mirrored). tail: [width, y, z] of the tail strip.
const SHEETS = {
  heron: { name: 'Heron', wheelR: 0.36, base: 2.76, stripe: 0.66, head: [0.65, 0.655, 2.175], tail: [1.72, 0.765, -2.155],
    pieces: 'sill:4.46x1.92x0.24@0,0.24 body:2.9x1.86x0.48@-0.7,0.46 hood/f:1.42x1.86x0.48@1.46,0.46 cabin:2.1x1.72x0.4@-0.25,0.94 roof:1.09x1.36x0.06@-0.32,1.34 spoiler:0.34x1.84x0.06@-2.02,1.11 struts:0.2x0.08x0.2@-2,0.92x2|0.7',
    paints: [0xff4f6e, 0x8fe3cf, 0xffc98f, 0x9fd2ff, 0xc9a8ff, 0xf7f3ea] },
  snook: { name: 'Snook', wheelR: 0.29, base: 2.3, stripe: 0.59, head: [0.544, 0.6, 1.795], tail: [1.34, 0.705, -1.775],
    pieces: 'sill:3.7x1.6x0.22@0,0.19 body:2.76x1.54x0.49@-0.39,0.39 hood/f:0.8x1.54x0.49@1.39,0.39 cabin:2.5x1.4x0.56@-0.45,0.88 roof:1.49x1.04x0.06@-0.52,1.44#fdf6ea mirrors:0.1x0.14x0.1@0.75,0.88x2|0.84',
    paints: [0xff8f7a, 0x8fe3cf, 0xffc98f, 0x9fd2ff, 0xfff1c9, 0xc9a8ff] },
  tarpon: { name: 'Tarpon', wheelR: 0.33, base: 2.9, stripe: 0.64, head: [0.629, 0.631, 2.3], tail: [1.59, 0.621, -2.275],
    pieces: 'sill:4.7x1.85x0.24@0,0.22 body:2.31x1.79x0.46@-0.11,0.44 hood/f:1.25x1.79x0.46@1.67,0.44 boot/r:1x1.79x0.46@-1.77,0.44 cabin:2.3x1.65x0.5@-0.1,0.9 roof:1.29x1.29x0.06@-0.18,1.4 mirrors:0.1x0.14x0.1@0.95,0.9x2|0.965',
    paints: [0xc8ccd2, 0xf7f3ea, 0x2e4a6b, 0xb8cfe0, 0x6f6a78, 0xe8dcc4] },
  mullet: { name: 'Mullet', wheelR: 0.38, base: 3.3, stripe: 0.8, head: [0.663, 0.753, 2.6], tail: [1.75, 0.875, -2.655],
    pieces: 'chassis:5.3x1.95x0.22@0,0.3 bed:2.14x1.95x0.53@-1.52,0.52#f7f3ea tailgate:0.06x1.75x0.5@-2.62,0.55 body:1.75x1.89x0.53@0.43,0.52 hood/f:1.29x1.89x0.53@1.95,0.52 cabin:1.7x1.75x0.69@0.45,1.05 roof:0.69x1.39x0.06@0.38,1.74 bumper:0.06x1.95x0.2@2.62,0.4',
    paints: [0xb5532f, 0xf7f3ea, 0x4f7cac, 0x6a8f4e, 0xe8dcc4, 0xff8f7a] },
  pompano: { name: 'Pompano', wheelR: 0.36, base: 3.2, stripe: 0.85, head: [0.646, 0.835, 2.545], tail: [1.8, 1.025, -2.605],
    pieces: 'chassis:5.2x1.9x0.22@0,0.28 box:3.94x2x1.7@-0.57,0.5 body:0.4x1.94x0.7@1.6,0.5 hood/f:0.74x1.94x0.7@2.17,0.5 screen/f0:0.75x1.84x1@1.77,1.2 sideglass:0.7x0.03x0.65@1.05,1.3x2|1 doors:0.06x0.95x1.55@-2.57,0.55x2|0.475 bumper:0.06x2x0.2@2.57,0.34',
    paints: [0xfdf6ea, 0xc8ccd2, 0x9fd2ff, 0xffc98f, 0x8fe3cf, 0xe8dcc4] },
};
// the Bay Cab: a Tarpon in yellow with a cyan stripe and a roof box
SHEETS.taxi = { ...SHEETS.tarpon, name: 'Bay Cab', pieces: SHEETS.tarpon.pieces + ' sign:0.16x0.5x0.2@-0.18,1.46#ffa02e', paints: [0xffd23e], accent: 0x29e6ff };

Object.assign(SHEETS, DAY3);       // day 3's eight, from src/content/vehicles.js

const RE = /^([a-z]+)(\/[fr]0?)?:([\d.]+)x([\d.]+)x([\d.]+)@(-?[\d.]+),([\d.]+)(x2)?(?:\|(-?[\d.]+))?(?:#([0-9a-f]{6}))?(!)?$/;
const parsed = new Map();
export const MODEL_IDS = Object.keys(SHEETS);

// A sheet with its pieces read and its wheels placed: track is W minus 0.24, axles at half the wheelbase.
export function sheet(id) {
  if (parsed.has(id)) return parsed.get(id);
  const s = SHEETS[id] || SHEETS.heron;
  const pieces = s.pieces.split(' ').map((tok) => {
    const m = RE.exec(tok);
    return { name: m[1], mod: m[2] || '', L: +m[3], W: +m[4], H: +m[5], f: +m[6], y: +m[7], twin: !!m[8], x: m[9] ? +m[9] : 0, color: m[10] ? parseInt(m[10], 16) : null, accent: !!m[11] };
  });
  const L = s.size ? s.size[0] : pieces[0].L, W = s.size ? s.size[1] : pieces[0].W, tz = s.base / 2;
  const wheelW = (s.two ? 0.4 : 0.83) * s.wheelR, tx = (W - 0.24) / 2, rx = s.twinRear ? W / 2 - 0.85 * wheelW : tx, rw = s.twinRear ? 1.7 : 1;
  // a wheel is [x, z, width multiplier]: two-wheelers have one each end, twin rears are one wide wheel
  const wheels = s.two ? [[0, tz, 1], [0, -tz, 1]] : [[tx, tz, 1], [-tx, tz, 1], [rx, -tz, rw], [-rx, -tz, rw]];
  const out = { ...s, id, pieces, W, L, wheels, wheelW, hs: s.hs || [0.44, 0.11], th: s.th || 0.13,
    bodyW: s.bw || Math.max(...pieces.filter((p) => !p.twin && p.name !== 'sill' && p.name !== 'chassis').map((p) => p.W)) };
  parsed.set(id, out);
  return out;
}
export const WHEELS = sheet('heron').wheels;

const FIXED = { sill: DARK, chassis: DARK, cabin: GLASS, screen: GLASS, sideglass: GLASS, glass: GLASS, mirrors: DARK, struts: DARK, bumper: STEEL };
const SHADE = { doors: 0.9, tailgate: 0.92 };

// One piece as a six-sided solid. Wedges drop their front or rear top edge; a cabin tapers as day 1's did.
function solid(B, p, x, color, opts) {
  const z0 = p.f - p.L / 2, z1 = p.f + p.L / 2, x0 = x - p.W / 2, x1 = x + p.W / 2, y0 = p.y, y1 = p.y + p.H;
  let yf = y1, yr = y1, tx = 0, zf = z1, zr = z0;
  if (p.mod === '/f') yf = y0 + 0.6 * p.H; else if (p.mod === '/f0') yf = y0;
  else if (p.mod === '/r') yr = y0 + 0.6 * p.H; else if (p.mod === '/r0') yr = y0;
  if (p.name === 'cabin') { tx = 0.2; zf = z1 - 0.6; zr = z0 + 0.45; }
  B.hexa([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [x0 + tx, yr, zr], [x1 - tx, yr, zr], [x1 - tx, yf, zf], [x0 + tx, yf, zf]], color, opts);
}

const mul = (hex, k) => (Math.min(255, ((hex >> 16) & 255) * k) << 16) | (Math.min(255, ((hex >> 8) & 255) * k) << 8) | Math.min(255, (hex & 255) * k);
const grey = (k) => mul(0xffffff, k);

// Push a model's body into a builder. With paint given, colours are baked in. With paint null the
// painted pieces are written white and `masks` gets, per vertex, 0 fixed, 1 paint, 2 accent.
// opts.baked: a two-wheeler's wheels go into the mesh. opts.rider: someone is sitting on it.
export function addModel(B, id, paint = null, accent = null, masks = null, opts = {}) {
  const s = sheet(id);
  const put = (mask, shade, fn) => {
    const from = B.count;
    fn(mask === 0 ? shade : paint === null ? grey(shade) : mul(mask === 1 ? paint : accent, shade));
    if (masks) for (let i = from; i < B.count; i++) masks[i] = mask;
  };
  for (const p of s.pieces) {
    const fixed = p.color !== null ? p.color : FIXED[p.name];
    const opts = { bottom: p.name === 'sill' || p.name === 'chassis' || p.name === 'spoiler', noTop: p.name === 'cabin' };
    if (p.name === 'bed') opts.top = 0x3a3844;                       // the load floor
    for (const x of p.twin ? [p.x, -p.x] : [p.x]) {
      if (fixed !== undefined) put(0, fixed, (c) => solid(B, p, x, c, opts));
      else put(p.accent ? 2 : 1, SHADE[p.name] || 1, (c) => solid(B, p, x, c, opts));
    }
  }
  // the stripe: 0.07 tall on both sides (0.30 on a bus), 0.006 outside the body, stopping 0.13 short of each end
  if (s.stripe != null) {
    const sx = s.bodyW / 2 + 0.006, z1 = s.stripeZ ? s.stripeZ[1] : s.L / 2 - 0.13, z0 = s.stripeZ ? s.stripeZ[0] : -z1, y0 = s.stripe, y1 = s.stripe + (s.stripeH || 0.07);
    put(2, 1, (c) => {
      B.quad([sx, y0, z1], [sx, y0, z0], [sx, y1, z0], [sx, y1, z1], c);
      B.quad([-sx, y0, z0], [-sx, y0, z1], [-sx, y1, z1], [-sx, y1, z0], c);
    });
  }
  // two stripes down the hood (the Wahoo), lying 0.006 above the wedge
  if (s.hoodStripes) {
    const h = s.pieces.find((p) => p.name === 'hood'), w = s.hoodStripes, zr = h.f - h.L / 2, zf = h.f + h.L / 2 - 0.02, yr = h.y + h.H + 0.006, yf = h.y + 0.6 * h.H + 0.006;
    put(2, 1, (c) => { for (const x of [0.3, -0.3 - w]) B.quad([x, yr, zr], [x, yf, zf], [x + w, yf, zf], [x + w, yr, zr], c); });
  }
  if (opts.baked && s.two) for (const [x, z] of s.wheels) put(0, 1, () => addWheel(B, x, s.wheelR, z, s.wheelR, s.wheelW, 16));
  if (opts.rider && s.rider) addRider(B, s.rider, put);
}

// A wheel written into a body mesh, with a spoke on each face.
function addWheel(B, x, y, z, r, w, sides) {
  B.cylX(x, y, z, r, w, TYRE, HUB, sides);
  B.box(x + w * 0.51, y, z, 0.02, 1.4 * r, 0.28 * r, SPOKE); B.box(x - w * 0.51, y, z, 0.02, 1.4 * r, 0.28 * r, SPOKE);
}

// The rider of a two-wheeler: eight boxes, sat on the seat, leaning to the bars. The shirt takes
// the stripe colour so riders differ; the helmet is cream.
const SKIN = 0xc68a5e, DENIM = 0x2e4a6b, HELMET = 0xfdf6ea;
export function addRider(B, r, put = (mask, shade, fn) => fn(mask === 0 ? shade : 0xff4fa8)) {
  const y = r.y, z = r.z, fz = (r.barZ - z) * 0.3, t = 0.05;
  const beam = (c, a, b, k) => B.hexa([[a[0] - k, a[1] - k, a[2]], [a[0] + k, a[1] - k, a[2]], [b[0] + k, b[1] - k, b[2]], [b[0] - k, b[1] - k, b[2]],
    [a[0] - k, a[1] + k, a[2]], [a[0] + k, a[1] + k, a[2]], [b[0] + k, b[1] + k, b[2]], [b[0] - k, b[1] + k, b[2]]], c, { bottom: true });
  put(2, 1, (c) => B.box(0, y + 0.27, z + 0.02, 0.34, 0.54, 0.22, c, { shift: [0, fz], bottom: true }));
  put(0, HELMET, (c) => B.box(0, y + 0.68, z + 0.04 + fz, 0.25, 0.26, 0.27, c, { bottom: true }));
  for (const s of [1, -1]) {
    put(0, DENIM, (c) => beam(c, [s * 0.12, y + 0.05, z - 0.02], [s * 0.15, y + 0.02, z + 0.4], 0.07));
    put(0, DENIM, (c) => beam(c, [s * 0.15, y - 0.36, z + 0.42], [s * 0.15, y - 0.36, z + 0.54], 0.06));
    put(0, DENIM, (c) => B.box(s * 0.15, y - 0.17, z + 0.44, 0.11, 0.42, 0.12, c));
    put(0, SKIN, (c) => beam(c, [s * 0.2, y + 0.46, z + fz + 0.05], [s * r.barX, r.barY + 0.03, r.barZ - 0.04], t));
  }
}

// Light quads, baked (the player's car and one-mesh parked cars)
export function addHeadlights(B, color, id = 'heron') {
  const sh = sheet(id), [x, y, z] = sh.head, w = sh.hs[0] / 2, h = sh.hs[1] / 2;
  for (const s of x ? [1, -1] : [1]) B.quad([s * x - w, y - h, z], [s * x + w, y - h, z], [s * x + w, y + h, z], [s * x - w, y + h, z], color);     // two wheels have one
}
export function addTaillights(B, color, id = 'heron') {
  const sh = sheet(id), [w, y, z] = sh.tail, x = w / 2, h = sh.th / 2;
  B.quad([x, y - h, z], [-x, y - h, z], [-x, y + h, z], [x, y + h, z], color);
}
// Where the four indicators sit: [x side, y, z] on the side faces at the corners. Left pair first.
export function indicatorSpots(id) {
  const sh = sheet(id), x = Math.max(sh.bodyW / 2, sh.two ? 0.2 : 0) + 0.012, zf = sh.two ? sh.head[2] - 0.12 : sh.L / 2 - 0.45, zr = sh.two ? sh.tail[2] + 0.12 : -sh.L / 2 + 0.4;
  return [[1, sh.head[1], zf], [1, sh.tail[1], zr], [-1, sh.head[1], zf], [-1, sh.tail[1], zr]].map(([s, y, z]) => [s * x, y, z]);
}
// The four amber corner quads, 0.14 x 0.10, left pair first (so a mesh can light one side).
export function addIndicators(B, color, id = 'heron') {
  for (const [x, y, z] of indicatorSpots(id)) {
    if (x > 0) B.quad([x, y - 0.05, z + 0.07], [x, y - 0.05, z - 0.07], [x, y + 0.05, z - 0.07], [x, y + 0.05, z + 0.07], color);
    else B.quad([x, y - 0.05, z - 0.07], [x, y - 0.05, z + 0.07], [x, y + 0.05, z + 0.07], [x, y + 0.05, z - 0.07], color);
  }
}
export const addBody = (B, paint, accent) => addModel(B, 'heron', paint, accent);

// The stripe colour that goes with a paint: ink on pale paints, cyan on warm ones, pink on the rest.
export function accentFor(paint) {
  const r = ((paint >> 16) & 255) / 255, g = ((paint >> 8) & 255) / 255, b = (paint & 255) / 255;
  if (0.2126 * r + 0.7152 * g + 0.0722 * b > 0.78) return 0x150f3d;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min || 1;
  let hue = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  hue = (hue * 60 + 360) % 360;
  return hue >= 330 || hue <= 70 ? 0x29e6ff : 0xff4fa8;
}
// A factory colour by seed (0..1) and its accent
export function pickPaint(id, r) {
  const s = sheet(id), paint = s.paints[Math.floor(r * s.paints.length) % s.paints.length];
  return { paint, accent: s.accent || accentFor(paint) };
}

export const bodyMat = new THREE.MeshLambertMaterial({ vertexColors: true });

// The traffic material: vertex colour times the instance's paint or accent, picked by the mask.
let paintMat = null;
export function paintMaterial() {
  if (paintMat) return paintMat;
  paintMat = new THREE.MeshLambertMaterial({ vertexColors: true });
  paintMat.onBeforeCompile = (sh) => {
    sh.vertexShader = 'attribute float paintMask;\nattribute vec3 accent;\n' + sh.vertexShader.replace('#include <color_vertex>',
      '#include <color_vertex>\n\tvColor.rgb = color.rgb * ( paintMask < 0.5 ? vec3( 1.0 ) : paintMask < 1.5 ? instanceColor.rgb : accent );');
  };
  paintMat.customProgramCacheKey = () => 'vehicle-paint-mask';
  return paintMat;
}

// The traffic build of a model: one geometry with the paint mask on it.
// A two-wheeler's has its wheels in it, and `rider` adds the person on the seat.
export function trafficGeometry(id, rider = false) {
  const B = new MeshBuilder(), masks = [];
  addModel(B, id, null, null, masks, { baked: true, rider });
  const g = B.build();
  g.setAttribute('paintMask', new THREE.BufferAttribute(new Uint8Array(masks), 1));
  return g;
}

// A unit wheel (radius 1, width 1) with a spoke on each face so its spin shows. 8 sides: 56 triangles.
export function wheelGeometry(sides = 8) {
  const B = new MeshBuilder();
  B.cylX(0, 0, 0, 1, 1, TYRE, HUB, sides);
  B.box(0.51, 0, 0, 0.03, 1.4, 0.28, SPOKE); B.box(-0.51, 0, 0, 0.03, 1.4, 0.28, SPOKE);
  return B.build();
}

// Triangles in the traffic build: body, four 8-sided wheels with spokes, seven light quads.
export function triangles(id) {
  const B = new MeshBuilder();
  addModel(B, id, 0xffffff, 0xffffff, null, { baked: true, rider: true });
  return B.triangles + (sheet(id).two ? 4 + 8 : 4 * 56 + 14);
}

// A parked car: everything baked into one mesh, one draw call (day 1's five, and any hand-placed car).
export function createParkedCar(paint, accent, id = 'heron') {
  const B = new MeshBuilder(), s = sheet(id);
  addModel(B, id, paint, accent, null, { baked: true });
  addHeadlights(B, 0xf4f0d8, id);
  addTaillights(B, 0xa01828, id);
  addIndicators(B, 0x7a4a10, id);
  if (!s.two) for (const [x, z, k] of s.wheels) B.cylX(x, s.wheelR, z, s.wheelR, s.wheelW * k, TYRE, 0x8a8a96, 8);
  return new THREE.Mesh(B.build(), bodyMat);
}
