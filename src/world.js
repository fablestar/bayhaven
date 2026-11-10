// Bayhaven, day 1: one playable city block by the sea, with the rest of the city
// sketched in around it. Everything here is generated in code from a fixed seed.
//
// Map (x = east, z = towards the sea):
//   - the central block sits at the origin, with a ring of streets around it
//   - five neighbour blocks to the north, east and west
//   - a palm promenade and the beach to the south, then the ocean
//   - further out: big simple towers for the skyline

import * as THREE from 'three';
import { MeshBuilder, rng, glowTexture } from './builder.js';
import { createParkedCar } from './car.js';

const PASTEL = [0xff9eb5, 0x8fe3cf, 0xffc98f, 0x9fd2ff, 0xfff1c9, 0xc9a8ff, 0xff8f7a, 0x7fd6e8, 0xf7f3ea];
const NEON = [0xff3fa4, 0x29e6ff, 0xb46bff, 0xffa02e, 0x5dff9b, 0xff5a5a];
const TOWER = [0xd9b8c4, 0xb8cfe0, 0xe6d3b8, 0xc4b8e0, 0xb8e0d3, 0xe0e0e6, 0xe8c0b0];
const TRIM = 0xfdf6ea, ROOF = 0x6f6a78, GLASS = 0x2e4a6b;

// block columns and rows (each [from, to]); the gaps between them are the 14 m streets
const XB = [[-285, -219], [-205, -139], [-125, -59], [-45, 45], [59, 125], [139, 205], [219, 285]];
const ZB = [[-270, -204], [-190, -124], [-110, -44], [-30, 30]];
const NS_STREETS = [-212, -132, -52, 52, 132, 212];
const EW_STREETS = [-197, -117, -37, 37];
const CURB = 0.14;

const SIGNS = [
  ['BAYHAVEN', '#ff4fa8'], ['CLUB LUMA', '#29e6ff'], ['THE PINK HERON', '#ff6fb8'], ['TIDELINE MOTEL', '#ffa02e'],
  ['MANGO MOON', '#ffd23e'], ['CORAL ARCADE', '#b98bff'], ['BAYHAVEN GRAND', '#fff0c0'], ['DINER · 24H', '#ff5a5a'],
  ['MORE CITY SOON', '#ffb020'], ['SURF & VINYL', '#5dff9b'], ['HOTEL ALBA', '#7fd6ff'], ['LOW TIDE BAR', '#ff8f5a'],
];

// All the signs are drawn onto one canvas, so they share one texture and one draw call.
function signAtlas() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 1024;
  const g = c.getContext('2d');
  g.fillStyle = '#0d0820'; g.fillRect(0, 0, 1024, 1024);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  SIGNS.forEach(([text, color], i) => {
    const x = (i % 2) * 512, y = Math.floor(i / 2) * 128;
    g.fillStyle = '#140c2c'; g.fillRect(x, y, 512, 128);
    g.strokeStyle = color; g.lineWidth = 6; g.shadowColor = color; g.shadowBlur = 18;
    g.strokeRect(x + 12, y + 12, 488, 104);
    let size = 76;
    do { g.font = `italic 900 ${size}px "Trebuchet MS", "Arial Black", sans-serif`; size -= 4; }
    while (g.measureText(text).width > 440 && size > 20);
    g.fillStyle = color;
    g.fillText(text, x + 256, y + 68); g.fillText(text, x + 256, y + 68);
    g.shadowBlur = 0; g.fillStyle = 'rgba(255,255,255,0.75)';
    g.fillText(text, x + 256, y + 68);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
function signUV(i) {
  const u0 = (i % 2) / 2, u1 = u0 + 0.5, v1 = 1 - Math.floor(i / 2) / 8, v0 = v1 - 1 / 8;
  return [u0, v0, u1, v0, u1, v1, u0, v1];
}

export function createWorld(scene) {
  const rnd = rng(20261111);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const G = new MeshBuilder();              // ground: asphalt, sidewalks, sand
  const M = new MeshBuilder();              // paint on the road
  const B = new MeshBuilder();              // buildings and street furniture
  const N = new MeshBuilder();              // neon tubes and lamp heads (glow at night)
  const L = new MeshBuilder();              // lit windows (fade in at night)
  const P = new MeshBuilder();              // palm trees (leaves are double-sided)
  const S = new MeshBuilder({ uv: true });  // signs
  const pools = new MeshBuilder({ uv: true }); // pools of lamp light on the ground
  const glowPts = [];
  const colliders = [];   // boxes the car bumps into: {x0,x1,z0,z1}
  const buildings = [];   // the big ones, used to keep the camera out of walls
  const slabs = [];       // raised sidewalks
  const solid = (x0, x1, z0, z1) => colliders.push({ x0, x1, z0, z1 });

  // ---------- helpers ----------

  // A rectangle on one wall of a box-shaped cell, facing outwards.
  // side: n (-z), s (+z), w (-x), e (+x). u = where along the wall, e = how far it sticks out.
  function wallQuad(c, side, u, y, w, h, e) {
    const a = u - w / 2, b = u + w / 2, y0 = y - h / 2, y1 = y + h / 2;
    if (side === 's') { const z = c.z1 + e; return [[a, y0, z], [b, y0, z], [b, y1, z], [a, y1, z]]; }
    if (side === 'n') { const z = c.z0 - e; return [[b, y0, z], [a, y0, z], [a, y1, z], [b, y1, z]]; }
    if (side === 'e') { const x = c.x1 + e; return [[x, y0, b], [x, y0, a], [x, y1, a], [x, y1, b]]; }
    const x = c.x0 - e; return [[x, y0, a], [x, y0, b], [x, y1, b], [x, y1, a]];
  }
  const span = (c, side) => (side === 'n' || side === 's') ? [c.x0, c.x1] : [c.z0, c.z1];

  function windows(c, side, y0, y1, cellW, cellH, ww, wh, e, litChance) {
    const [a, b] = span(c, side);
    const cols = Math.floor((b - a - 1) / cellW);
    const rows = Math.floor((y1 - y0) / cellH + 0.01);
    if (cols < 1 || rows < 1) return;
    const step = (b - a) / cols;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const u = a + (i + 0.5) * step, y = y0 + (j + 0.5) * cellH;
      B.quad(...wallQuad(c, side, u, y, ww, wh, e), GLASS, 0.8 + rnd() * 0.4);
      if (rnd() < litChance) {
        const r = rnd(), col = r < 0.75 ? 0xffd58a : r < 0.9 ? 0x8fe8ff : 0xff8fd0;
        L.quad(...wallQuad(c, side, u, y, ww, wh, e + 0.03), col, 0.45 + rnd() * 0.55);
      }
    }
  }

  // A neon tube running along the whole wall at height y.
  function neonStrip(c, side, y, color, out = 0.2) {
    const w = c.x1 - c.x0, d = c.z1 - c.z0, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2;
    if (side === 's') N.box(cx, y, c.z1 + out, w + 0.4, 0.16, 0.12, color);
    else if (side === 'n') N.box(cx, y, c.z0 - out, w + 0.4, 0.16, 0.12, color);
    else if (side === 'e') N.box(c.x1 + out, y, cz, 0.12, 0.16, d + 0.4, color);
    else N.box(c.x0 - out, y, cz, 0.12, 0.16, d + 0.4, color);
  }

  // A thin slab sticking out of a wall (sign boards, fins). Returns its cell.
  function wallSlab(c, side, u, halfW, depth) {
    if (side === 's') return { x0: u - halfW, x1: u + halfW, z0: c.z1, z1: c.z1 + depth };
    if (side === 'n') return { x0: u - halfW, x1: u + halfW, z0: c.z0 - depth, z1: c.z0 };
    if (side === 'e') return { x0: c.x1, x1: c.x1 + depth, z0: u - halfW, z1: u + halfW };
    return { x0: c.x0 - depth, x1: c.x0, z0: u - halfW, z1: u + halfW };
  }
  function cellBox(c, y0, y1, color, opts) {
    B.box((c.x0 + c.x1) / 2, (y0 + y1) / 2, (c.z0 + c.z1) / 2, c.x1 - c.x0, y1 - y0, c.z1 - c.z0, color, opts);
  }

  let signIdx = 0;
  const SHOP_SIGNS = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11];
  function shopSign(c, side) {
    const [a, b] = span(c, side);
    const u = (a + b) / 2;
    const slab = wallSlab(c, side, u, 3.3, 0.45);
    cellBox(slab, 4.0, 5.8, 0x140c2c);
    S.quad(...wallQuad(slab, side, u, 4.9, 6.4, 1.6, 0.02), 0xffffff, 1, signUV(SHOP_SIGNS[signIdx++ % SHOP_SIGNS.length]));
  }

  // ---------- buildings ----------

  // A street-level building you drive right past: shopfront, windows, neon, art-deco trim.
  function detailBuilding(c, floors, sides, wantSign) {
    const h = 3.6 + floors * 3.2 + 0.8;
    const col = pick(PASTEL), neon = pick(NEON);
    const cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2, w = c.x1 - c.x0, d = c.z1 - c.z0;
    B.box(cx, h / 2, cz, w, h, d, col, { top: ROOF });
    B.box(cx, 1.75, cz, w + 0.3, 3.5, d + 0.3, pick([TRIM, 0x2f2b40, 0x3d7f8f, 0xe86a8a, TRIM]), { top: TRIM });
    for (let k = 1; k <= floors; k++) B.box(cx, 3.6 + k * 3.2, cz, w + 0.5, 0.14, d + 0.5, TRIM);
    B.box(cx, h + 0.2, cz, w + 0.4, 0.5, d + 0.4, TRIM, { top: ROOF });
    // roof clutter
    for (let k = 0; k < 2; k++) if (rnd() < 0.7) {
      B.box(cx + (rnd() - 0.5) * (w - 5), h + 0.95, cz + (rnd() - 0.5) * (d - 5), 2 + rnd() * 1.5, 1, 1.6 + rnd(), 0xb7b0b8);
    }
    let first = true;
    for (const side of ['s', 'n', 'e', 'w']) {
      if (!sides[side]) continue;
      windows(c, side, 0.5, 3.1, 4.2, 2.6, 3.4, 2.2, 0.19, 0.75);          // shopfront glass
      windows(c, side, 3.6, h - 0.3, 3.2, 3.2, 1.9, 1.6, 0.04, 0.45);       // floors above
      neonStrip(c, side, 3.62, neon);
      if (first && rnd() < 0.4) { // an art-deco fin up the front, with a neon tube on it
        const [a, b] = span(c, side);
        const u = a + (b - a) * (0.3 + rnd() * 0.4);
        const fin = wallSlab(c, side, u, 1.1, 0.7);
        cellBox(fin, 3.5, h + 2.6, TRIM);
        const tube = wallSlab(fin, side, u, 0.1, 0.1);
        N.box((tube.x0 + tube.x1) / 2, (h + 6.4) / 2, (tube.z0 + tube.z1) / 2,
          tube.x1 - tube.x0, h - 1.6, tube.z1 - tube.z0, neon);
      } else if (first && wantSign) shopSign(c, side);
      else if (wantSign && rnd() < 0.35) shopSign(c, side);
      first = false;
    }
    solid(c.x0 - 0.15, c.x1 + 0.15, c.z0 - 0.15, c.z1 + 0.15);
    buildings.push({ x0: c.x0, x1: c.x1, z0: c.z0, z1: c.z1, h });
    return h;
  }

  // A plain tower for the skyline: big windows, sometimes a neon crown.
  function tower(c, h, far) {
    const col = pick(TOWER);
    cellBox(c, 0, h, col, { top: ROOF });
    const cw = far ? 7 : 4.6, ch = far ? 6 : 3.8;
    for (const side of ['s', 'n', 'e', 'w']) {
      windows(c, side, far ? 5 : 8, h - 1, cw, ch, cw * 0.8, ch * 0.55, 0.05, 0.5);
    }
    if (h > 34 && rnd() < 0.75) {
      const neon = pick(NEON);
      for (const side of ['s', 'n', 'e', 'w']) neonStrip(c, side, h - 0.5, neon, 0.15);
      if (rnd() < 0.5) N.box((c.x0 + c.x1) / 2, h + 4, (c.z0 + c.z1) / 2, 0.3, 8, 0.3, neon); // antenna
    }
    solid(c.x0, c.x1, c.z0, c.z1);
    buildings.push({ x0: c.x0, x1: c.x1, z0: c.z0, z1: c.z1, h });
  }

  function splitRange(a, b, min, max) {
    const out = [];
    let s = a;
    while (b - s > max) {
      const w = min + rnd() * (max - min);
      if (b - (s + w) < min) break;
      out.push([s, s + w]); s += w;
    }
    out.push([s, b]);
    return out;
  }

  let plaza = null, billboardCell = null, billboardH = 0;

  function block(x0, x1, z0, z1, near, central) {
    cellBoxG(x0, x1, z0, z1);
    slabs.push({ x0, x1, z0, z1 });
    const ix0 = x0 + 4, ix1 = x1 - 4, iz0 = z0 + 4, iz1 = z1 - 4;
    const xs = near ? splitRange(ix0, ix1, 13, central ? 19 : 20) : splitRange(ix0, ix1, 24, 36);
    const zs = central ? [[iz0, 0], [0, iz1]] : near ? splitRange(iz0, iz1, 16, 24) : splitRange(iz0, iz1, 24, 36);
    const pi = Math.floor(xs.length / 2);
    xs.forEach(([a, b], i) => zs.forEach(([c, d], j) => {
      const sides = { w: i === 0, e: i === xs.length - 1, n: j === 0, s: j === zs.length - 1 };
      const perim = sides.w || sides.e || sides.n || sides.s;
      // leave a hair of a gap between neighbours so walls don't flicker
      const cell = { x0: a + (sides.w ? 0 : 0.1), x1: b - (sides.e ? 0 : 0.1), z0: c + (sides.n ? 0 : 0.1), z1: d - (sides.s ? 0 : 0.1) };
      if (central) {
        if (j === 1 && i === pi) { plaza = cell; return; }       // an open plaza instead of a building
        if (j === 1 && i === pi - 1) sides.e = true;
        if (j === 1 && i === pi + 1) sides.w = true;
        if (j === 0 && i === pi) { sides.s = true; billboardCell = cell; billboardH = detailBuilding(cell, 5, sides, false); return; }
        detailBuilding(cell, 2 + Math.floor(rnd() * 4), sides, true);
      } else if (near) {
        if (perim) detailBuilding(cell, 2 + Math.floor(rnd() * 6), sides, rnd() < 0.6);
        else if (rnd() < 0.7) tower(cell, 34 + rnd() * 30, false);
      } else if (perim || rnd() < 0.5) {
        tower(cell, 14 + rnd() * rnd() * 85, true);
      }
    }));
  }
  function cellBoxG(x0, x1, z0, z1) {
    G.box((x0 + x1) / 2, CURB / 2, (z0 + z1) / 2, x1 - x0, CURB, z1 - z0, 0x9c948f, { top: 0xd6cdc4 });
  }

  // ---------- trees, lamps and other street furniture ----------

  function palm(x, z, height = 7 + rnd() * 3, base = 0) {
    const lean = rnd() * Math.PI * 2, bend = 0.25 + rnd() * 0.45;
    let bx = x, by = base, bz = z, w = 0.5;
    const segs = 5, sh = height / segs;
    for (let i = 0; i < segs; i++) {
      const k = (i + 0.5) / segs, dx = Math.cos(lean) * bend * k, dz = Math.sin(lean) * bend * k;
      const w2 = w * 0.86;
      P.box(bx, by + sh / 2, bz, w, sh, w, i % 2 ? 0x8a6a4a : 0x7a5c40, { taper: [w2 / w, w2 / w], shift: [dx, dz], rot: 0.5 });
      bx += dx; by += sh; bz += dz; w = w2;
    }
    const n = 9, a0 = rnd() * 6;
    for (let f = 0; f < n; f++) {
      const th = a0 + (f / n) * Math.PI * 2 + (rnd() - 0.5) * 0.3;
      const dx = Math.cos(th), dz = Math.sin(th), px = -dz, pz = dx;
      const len = 2.7 + rnd() * 1.1, droop = 0.75 + rnd() * 0.35;
      const col = pick([0x2f9e58, 0x3fb86a, 0x2a8a50, 0x4bbf62]);
      let prev = null;
      for (let k = 0; k <= 4; k++) {
        const t = k / 4, r = len * t;
        const y = by + 0.9 * len * (0.55 * t - droop * t * t);
        const hw = 0.55 * Math.sin(Math.PI * (0.15 + 0.85 * t));
        const R = [bx + dx * r, y, bz + dz * r];
        const A = [R[0] + px * hw, y - 0.35 * hw, R[2] + pz * hw];
        const C = [R[0] - px * hw, y - 0.35 * hw, R[2] - pz * hw];
        if (prev) {
          P.quad(prev.R, R, A, prev.A, col, 1);
          P.quad(prev.R, prev.C, C, R, col, 0.8);
        }
        prev = { R, A, C };
      }
    }
    solid(x - 0.3, x + 0.3, z - 0.3, z + 0.3);
  }

  function lamp(x, z, dx, dz) {
    const y = world.heightAt(x, z);
    B.box(x, y + 3.25, z, 0.18, 6.5, 0.18, 0x2b2838);
    B.box(x + dx * 0.9, y + 6.45, z + dz * 0.9, Math.abs(dx) * 1.8 + 0.14, 0.12, Math.abs(dz) * 1.8 + 0.14, 0x2b2838, { bottom: true });
    const hx = x + dx * 1.8, hz = z + dz * 1.8;
    N.box(hx, y + 6.32, hz, 0.55, 0.14, 0.55, 0xfff2cc, { bottom: true });
    glowPts.push(hx, y + 6.25, hz);
    pools.flat(hx - 9, hx + 9, hz - 9, hz + 9, 0.2, 0xffffff);
    solid(x - 0.2, x + 0.2, z - 0.2, z + 0.2);
  }

  // Striped barrier across a street where today's playable area ends.
  function barrier(x, z, alongX, len, face) {
    const n = Math.round(len / 1.2), seg = len / n;
    for (let i = 0; i < n; i++) {
      const o = -len / 2 + (i + 0.5) * seg, col = i % 2 ? 0xffffff : 0xff7a1e;
      for (const y of [0.55, 1.05]) {
        if (alongX) B.box(x + o, y, z, seg, 0.3, 0.14, col, { bottom: true });
        else B.box(x, y, z + o, 0.14, 0.3, seg, col, { bottom: true });
      }
      if (i % 3 === 0) {
        if (alongX) B.box(x + o, 0.6, z, 0.12, 1.2, 0.5, 0x3a3844); else B.box(x, 0.6, z + o, 0.5, 1.2, 0.12, 0x3a3844);
      }
    }
    const c = alongX ? { x0: x - 3.3, x1: x + 3.3, z0: z - 0.12, z1: z + 0.12 } : { x0: x - 0.12, x1: x + 0.12, z0: z - 3.3, z1: z + 3.3 };
    cellBox(c, 1.4, 3.1, 0x140c2c);
    S.quad(...wallQuad(c, face, alongX ? x : z, 2.25, 6.4, 1.6, 0.02), 0xffffff, 1, signUV(8));
    if (alongX) solid(x - len / 2, x + len / 2, z - 0.3, z + 0.3); else solid(x - 0.3, x + 0.3, z - len / 2, z + len / 2);
  }

  function umbrella(x, z) {
    const colA = pick([0xff4f6e, 0x29b6e6, 0xffc23e, 0xff7a1e, 0x3fd68a]), colB = 0xfff8ee;
    B.box(x, 1.1, z, 0.08, 2.2, 0.08, 0xe8e0d8);
    const r = 1.7, n = 8, tilt = (rnd() - 0.5) * 0.5;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
      const p0 = [x + Math.cos(a0) * r, 1.9 + Math.cos(a0) * tilt, z + Math.sin(a0) * r];
      const p1 = [x + Math.cos(a1) * r, 1.9 + Math.cos(a1) * tilt, z + Math.sin(a1) * r];
      P.tri([x, 2.45, z], p1, p0, i % 2 ? colA : colB); // palm material is double-sided
    }
    // a towel next to it
    const tx = x + 1.6, tz = z + (rnd() - 0.5);
    B.box(tx, 0.05, tz, 0.9, 0.06, 2, pick([0xff6fb8, 0x29e6ff, 0xffd23e, 0xffffff]));
    solid(x - 0.15, x + 0.15, z - 0.15, z + 0.15);
  }

  function rock(x, z, s) {
    B.box(x, s * 0.3 - 0.4, z, s, s * 0.9, s * 0.9, pick([0x7a6f78, 0x8a7f80, 0x6a6470]),
      { rot: rnd() * 3, taper: [0.55 + rnd() * 0.2, 0.6 + rnd() * 0.2], shift: [(rnd() - 0.5) * 0.4, (rnd() - 0.5) * 0.4] });
    solid(x - s * 0.42, x + s * 0.42, z - s * 0.42, z + s * 0.42);
  }

  // ---------- the world object (heightAt is needed while building) ----------

  const world = {
    colliders, buildings,
    bounds: { x0: -98, x1: 98, z0: -93, z1: 84.5 },
    spawn: { x: -24, z: 40.5, h: Math.PI / 2 },
    heightAt(x, z) {
      if (z > 72) return 0.02 - (z - 72) / 28;             // the beach slopes into the sea
      if (z > 50) return 0.02;
      for (const s of slabs) if (x >= s.x0 && x <= s.x1 && z >= s.z0 && z <= s.z1) return CURB;
      return 0;
    },
    // Is this point inside a building (below its roof)? Used by the chase camera.
    insideBuilding(x, y, z, pad) {
      for (const b of buildings) {
        if (x > b.x0 - pad && x < b.x1 + pad && z > b.z0 - pad && z < b.z1 + pad && y < b.h + pad) return true;
      }
      return false;
    },
  };

  // ---------- ground ----------

  G.flat(-800, 800, -800, 50, 0, 0x3b3946);                                   // asphalt
  G.flat(-800, 800, 50, 72, 0.02, 0xf2ddb0);                                  // dry sand
  G.quad([-800, 0.02, 72], [-800, -2.05, 130], [800, -2.05, 130], [800, 0.02, 72], 0xe2c998); // wet sand going under
  cellBoxG(-300, 300, 44, 50);                                                // promenade
  slabs.push({ x0: -300, x1: 300, z0: 44, z1: 50 });

  // dashed centre lines
  const DASH = 0xf2e6b0, Y = 0.02;
  for (const z of EW_STREETS) for (let x = -297; x < 297; x += 9) {
    if (NS_STREETS.some((s) => Math.abs(x + 1.5 - s) < 9.5)) continue;
    M.flat(x, x + 3, z - 0.12, z + 0.12, Y, DASH);
  }
  for (const x of NS_STREETS) for (let z = -279; z < 27; z += 9) {
    if (EW_STREETS.some((s) => Math.abs(z + 1.5 - s) < 9.5)) continue;
    M.flat(x - 0.12, x + 0.12, z, z + 3, Y, DASH);
  }
  // zebra crossings at the four corners of the central block
  for (const sx of [-52, 52]) for (const sz of [-37, 37]) {
    for (let o = -6.3; o < 6; o += 1.4) {
      M.flat(sx - 10.5, sx - 8, sz + o, sz + o + 0.7, Y, 0xffffff);
      M.flat(sx + 8, sx + 10.5, sz + o, sz + o + 0.7, Y, 0xffffff);
      M.flat(sx + o, sx + o + 0.7, sz - 10.5, sz - 8, Y, 0xffffff);
      if (sz < 0) M.flat(sx + o, sx + o + 0.7, sz + 8, sz + 10.5, Y, 0xffffff);
    }
  }

  // ---------- blocks ----------

  XB.forEach(([x0, x1], ci) => ZB.forEach(([z0, z1], ri) => {
    const near = ci >= 2 && ci <= 4 && ri >= 2;
    block(x0, x1, z0, z1, near, ci === 3 && ri === 3);
  }));

  // the plaza: warm paving, palms, a view through to the big rooftop sign
  if (plaza) {
    G.flat(plaza.x0 - 0.1, plaza.x1 + 0.1, plaza.z0, plaza.z1 + 0.5, CURB + 0.012, 0xe9b9a2);
    const px = (plaza.x0 + plaza.x1) / 2, w = plaza.x1 - plaza.x0;
    for (const [ox, oz] of [[-0.3, 6], [0.3, 6], [-0.3, 15], [0.3, 15]]) palm(px + ox * w, plaza.z0 + oz, 6 + rnd() * 2, CURB);
    // planter in the middle
    B.box(px, CURB + 0.3, plaza.z0 + 10.5, 3, 0.6, 3, TRIM, { top: 0x3fb86a });
    solid(px - 1.5, px + 1.5, plaza.z0 + 9, plaza.z0 + 12);
  }
  // rooftop billboard: the city's name in lights
  if (billboardCell) {
    const c = billboardCell, cx = (c.x0 + c.x1) / 2, h = billboardH;
    const board = { x0: cx - 8, x1: cx + 8, z0: c.z1 - 1.6, z1: c.z1 - 1.2 };
    cellBox(board, h + 1.6, h + 5.8, 0x140c2c, { bottom: true });
    for (const o of [-6, 0, 6]) B.box(cx + o, h + 1, board.z0 + 0.2, 0.3, 1.6, 0.3, 0x2b2838);
    S.quad(...wallQuad(board, 's', cx, h + 3.7, 15.6, 3.9, 0.02), 0xffffff, 1, signUV(0));
    N.box(cx, h + 5.9, board.z1, 16.4, 0.18, 0.18, 0xff3fa4); N.box(cx, h + 1.5, board.z1, 16.4, 0.18, 0.18, 0xff3fa4);
    N.box(cx - 8.1, h + 3.7, board.z1, 0.18, 4.4, 0.18, 0x29e6ff); N.box(cx + 8.1, h + 3.7, board.z1, 0.18, 4.4, 0.18, 0x29e6ff);
  }

  // ---------- street furniture ----------

  // around the central block: lamps and palms take turns along the curb
  for (let x = -38; x <= 38; x += 19) { lamp(x, 29, 0, 1); lamp(x, -29, 0, -1); }
  for (let x = -28.5; x <= 30; x += 19) {
    if (!plaza || x < plaza.x0 - 2 || x > plaza.x1 + 2) palm(x, 28.6, undefined, CURB);
    palm(x, -28.6, undefined, CURB);
  }
  for (const z of [-20, 0, 20]) { lamp(44, z, 1, 0); lamp(-44, z, -1, 0); }
  for (const z of [-10, 10]) { palm(43.6, z, undefined, CURB); palm(-43.6, z, undefined, CURB); }
  // across the street
  for (let x = -30; x <= 30; x += 30) lamp(x, -45, 0, 1);
  for (const z of [-15, 15]) { lamp(60, z, -1, 0); lamp(-60, z, 1, 0); }
  // the promenade: a long row of palms with lamps between them
  for (let x = -295; x <= 295; x += 10) palm(x, 47.4, 7.5 + rnd() * 3, CURB);
  for (let x = -110; x <= 110; x += 27.5) lamp(x + 5, 45, 0, -1);

  // where today's map ends
  barrier(100, -37, false, 22, 'w'); barrier(-100, -37, false, 22, 'e');
  barrier(100, 40, false, 20, 'w'); barrier(-100, 40, false, 20, 'e');
  barrier(52, -95, true, 22, 's'); barrier(-52, -95, true, 22, 's');

  // the beach
  for (let i = 0; i < 16; i++) umbrella(-92 + i * 12 + (rnd() - 0.5) * 6, 54.5 + rnd() * 13);
  for (let i = 0; i < 7; i++) palm(-90 + i * 30 + (rnd() - 0.5) * 12, 53 + rnd() * 5, 6 + rnd() * 3, 0);
  for (const sx of [-1, 1]) for (let z = 51; z < 96; z += 2.6) rock(sx * (101.5 + rnd() * 2), z, 2.6 + rnd() * 1.8);
  for (let i = 0; i < 40; i++) rock((rnd() < 0.5 ? -1 : 1) * (106 + rnd() * 180), 74 + rnd() * 14, 1.5 + rnd() * 2.5);
  // lifeguard hut on stilts
  {
    const x = 34, z = 63;
    for (const [ox, oz] of [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]]) B.box(x + ox, 1.1, z + oz, 0.2, 2.2, 0.2, 0xe8e0d8);
    B.box(x, 2.3, z, 3.4, 0.2, 3.4, 0xfff8ee, { bottom: true });
    B.box(x, 3.4, z - 0.3, 2.6, 2, 2.4, 0xff8f7a);
    B.box(x, 4.55, z - 0.3, 3.2, 0.3, 3, 0x29b6e6, { taper: [0.75, 0.75], bottom: true });
    B.quad(...wallQuad({ x0: x - 1.3, x1: x + 1.3, z0: z - 1.5, z1: z + 0.9 }, 's', x, 3.5, 1.6, 0.9, 0.03), GLASS);
    solid(x - 1.5, x + 1.5, z - 1.5, z + 1.5);
  }

  // parked cars
  const parked = [[-34, 31.4, 1, 0x29b6e6, 0xffffff], [22, 31.4, 1, 0xffc23e, 0x2b2838], [-12, -31.4, -1, 0xf7f3ea, 0xff3fa4],
    [30, -31.4, -1, 0x8a5cff, 0xffd23e], [46.4, 12, 0, 0x3fd68a, 0xffffff]];
  for (const [x, z, dir, paint, accent] of parked) {
    const m = createParkedCar(paint, accent);
    m.position.set(x, 0, z); m.rotation.y = dir * Math.PI / 2;
    scene.add(m);
    if (dir) solid(x - 2.25, x + 2.25, z - 0.98, z + 0.98); else solid(x - 0.98, x + 0.98, z - 2.25, z + 2.25);
  }

  // ---------- meshes ----------

  const lambert = new THREE.MeshLambertMaterial({ vertexColors: true });
  const add = (geo, mat, order = 0) => { const m = new THREE.Mesh(geo, mat); m.renderOrder = order; scene.add(m); return m; };
  add(G.build(), lambert);
  add(M.build(), new THREE.MeshLambertMaterial({ vertexColors: true, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  add(B.build(), lambert);
  add(P.build(), new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }));
  const neonMat = new THREE.MeshBasicMaterial({ vertexColors: true });
  add(N.build(), neonMat);
  const signMat = new THREE.MeshBasicMaterial({ map: signAtlas() });
  add(S.build(), signMat);
  const litMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  add(L.build(), litMat, 1);
  const poolMat = new THREE.MeshBasicMaterial({ map: glowTexture(), color: 0xffc27a, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  add(pools.build(), poolMat, 2);
  const glowGeo = new THREE.BufferGeometry();
  glowGeo.setAttribute('position', new THREE.Float32BufferAttribute(glowPts, 3));
  const glowMat = new THREE.PointsMaterial({ map: glowTexture(), color: 0xffd9a0, size: 7, sizeAttenuation: true,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  const glows = new THREE.Points(glowGeo, glowMat); glows.renderOrder = 3; scene.add(glows);

  world.triangles = G.triangles + M.triangles + B.triangles + P.triangles + N.triangles + S.triangles + L.triangles;

  // The city switches its lights on as the sky gets dark.
  world.update = function (night) {
    const on = Math.min(1, night * 1.6);
    neonMat.color.setScalar(0.62 + on * 0.6);
    signMat.color.setScalar(0.6 + on * 0.6);
    litMat.color.setScalar(on);
    litMat.visible = glows.visible = on > 0.01;
    poolMat.opacity = on * 0.34;
    glowMat.opacity = on * 0.9;
  };

  return world;
}
