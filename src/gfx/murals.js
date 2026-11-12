// The mural painter (plan/bible/art/kits.md section 7). One canvas holds the painted walls of the
// city: 48 square mural cells in six rows of eight, and under them 16 hand-painted or stencilled
// sign boards. mural(seed, palette) paints a cell the first time it is asked for and hands back its
// UVs; when the sheet is full the cell that was asked for longest ago is painted over. The same
// seed and palette always give the same picture. Murals are drawn unlit and dim a little at night.
import * as THREE from 'three';
import { rng } from '../core/rng.js';
import { chunkMaterials } from './materials.js';

export const PALMA = ['#ffb347', '#2ec4b6', '#ff6f91', '#b5e48c', '#fff1c9'];
const NEON = ['#ff3fa4', '#29e6ff', '#ffa02e', '#ff5a5a'], PASTEL = ['#ff9eb5', '#8fe3cf', '#ffc98f', '#9fd2ff', '#fff1c9', '#c9a8ff', '#ff8f7a', '#7fd6e8', '#f7f3ea'];
const INK = '#150f3d', TAU = Math.PI * 2, COLS = 8, ROWS = 6, CELLS = COLS * ROWS, BOARDS = 16;
// The Paintworks: violet, mint and three more by seed from the neon and pastel sets
export function paintworksPalette(seed) {
  const r = rng(seed * 7 + 3), rest = [...NEON, ...PASTEL], out = ['#b46bff', '#5dff9b'];
  while (out.length < 5) out.push(rest.splice(Math.floor(r() * rest.length), 1)[0]);
  return out;
}

// ---------- the twelve shapes, each drawn in a box from -0.5 to 0.5 ----------
const fs = (g) => { g.fill(); g.stroke(); };
const oval = (g, x, y, rx, ry) => { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); fs(g); };
const poly = (g, pts) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); fs(g); };
const bar = (g, x, y, w, h, rad) => { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, rad); else g.rect(x, y, w, h); fs(g); };
// a thick line in the fill colour with the outline round it
const stroke2 = (g, path, w) => {
  const lw = g.lineWidth, ink = g.strokeStyle;
  g.lineCap = 'round'; g.beginPath(); path(); g.lineWidth = w + lw * 2; g.stroke();
  g.beginPath(); path(); g.lineWidth = w; g.strokeStyle = g.fillStyle; g.stroke();
  g.lineWidth = lw; g.strokeStyle = ink;
};
const SHAPES = {
  disc(g) {
    for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; poly(g, [[Math.cos(a - 0.12) * 0.31, Math.sin(a - 0.12) * 0.31], [Math.cos(a + 0.12) * 0.31, Math.sin(a + 0.12) * 0.31], [Math.cos(a) * 0.5, Math.sin(a) * 0.5]]); }
    oval(g, 0, 0, 0.27, 0.27);
  },
  halfdisc(g, bg) {
    g.beginPath(); g.arc(0, 0.25, 0.5, Math.PI, 0); g.closePath(); fs(g);
    g.save(); g.clip(); g.fillStyle = bg; for (let k = 0; k < 3; k++) g.fillRect(-0.5, 0.1 - k * 0.13, 1, 0.045); g.restore();
  },
  wave(g) {
    for (let i = 0; i < 4; i++) { const x = -0.5 + i * 0.25; g.beginPath(); g.moveTo(x, 0.12); g.arc(x + 0.25, 0.12, 0.25, Math.PI, Math.PI * 1.5); g.lineTo(x + 0.25, 0.12); g.closePath(); fs(g); }
  },
  bird(g) {
    stroke2(g, () => { g.moveTo(0.2, 0.02); g.quadraticCurveTo(0.3, -0.26, 0.36, -0.27); }, 0.07);
    oval(g, 0.38, -0.28, 0.07, 0.07);
    poly(g, [[0.43, -0.32], [0.5, -0.27], [0.43, -0.23]]);
    oval(g, -0.05, 0.1, 0.32, 0.17);
    g.beginPath(); g.arc(-0.06, 0.12, 0.19, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
  },
  fish(g) {
    poly(g, [[0.2, 0], [0.48, -0.2], [0.48, 0.2]]);
    oval(g, -0.06, 0, 0.33, 0.17);
    g.fillStyle = g.strokeStyle; g.beginPath(); g.arc(-0.22, -0.04, 0.03, 0, TAU); g.fill();
  },
  hand(g) {
    const len = [0.26, 0.36, 0.4, 0.36, 0.28];
    for (let i = 0; i < 5; i++) { g.save(); g.translate(0, 0.14); g.rotate((-30 + i * 15) * Math.PI / 180); bar(g, -0.04, -len[i] - 0.1, 0.08, len[i] + 0.06, 0.04); g.restore(); }
    bar(g, -0.17, 0.02, 0.34, 0.36, 0.09);
  },
  frond(g) {
    for (let i = 0; i < 7; i++) for (const s of [-1, 1]) { const y = -0.42 + i * 0.13; poly(g, [[0, y], [s * (0.34 - Math.abs(i - 3) * 0.04), y - 0.1], [0, y + 0.09]]); }
    stroke2(g, () => { g.moveTo(0, 0.5); g.lineTo(0, -0.48); }, 0.035);
  },
  eye(g) {
    g.beginPath(); g.moveTo(-0.5, 0); g.quadraticCurveTo(0, -0.44, 0.5, 0); g.quadraticCurveTo(0, 0.44, -0.5, 0); fs(g);
    g.fillStyle = g.strokeStyle; g.beginPath(); g.arc(0, 0, 0.14, 0, TAU); g.fill();
  },
  flamingo(g) {
    stroke2(g, () => { g.moveTo(-0.1, 0.16); g.lineTo(-0.1, 0.5); g.moveTo(0, 0.16); g.lineTo(0.03, 0.5); }, 0.025);
    stroke2(g, () => { g.moveTo(0.06, -0.02); g.bezierCurveTo(0.26, -0.18, -0.12, -0.3, 0.1, -0.44); }, 0.06);
    oval(g, -0.05, 0.06, 0.21, 0.13);
    poly(g, [[0.1, -0.47], [0.22, -0.4], [0.1, -0.4]]);
  },
  dots(g) { for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) oval(g, -0.4 + i * 0.2, -0.4 + j * 0.2, 0.065, 0.065); },
  zigzag(g) { stroke2(g, () => { for (let i = 0; i <= 8; i++) { const x = -0.5 + i * 0.125, y = i % 2 ? -0.1 : 0.1; if (i) g.lineTo(x, y); else g.moveTo(x, y); } }, 0.08); },
};
export const SHAPE_NAMES = Object.keys(SHAPES).concat('band');
export const LAYOUTS = ['hero', 'parade', 'collage', 'horizon', 'split'];
const FIGURES = ['bird', 'fish', 'hand', 'flamingo', 'disc', 'frond', 'eye'], ALL = [...FIGURES, 'dots', 'zigzag', 'wave', 'halfdisc'];

// Paint one cell: S pixels square at (x0, y0). Returns the layout's name.
export function paintCell(g, x0, y0, S, seed, pal, drips) {
  const r = rng(seed), layout = Math.floor(r() * 5), turn = Math.floor(r() * pal.length), C = pal.map((_, i) => pal[(i + turn) % pal.length]);
  const ink = r() < 0.5 ? INK : '#ffffff', lw = (3 * S) / 256, placed = [];
  let last = 0;
  const next = () => { let k; do k = 1 + Math.floor(r() * (C.length - 1)); while (k === last); last = k; return C[k]; };
  const any = (list) => list[Math.floor(r() * list.length)];
  const put = (name, cx, cy, size, ang, col, flip) => {
    g.save(); g.translate(cx * S, cy * S); g.rotate(ang); g.scale(size * S * (flip ? -1 : 1), size * S);
    g.lineWidth = lw / (size * S); g.lineJoin = 'round'; g.strokeStyle = ink; g.fillStyle = col;
    SHAPES[name](g, C[0]); g.restore(); placed.push([cx, cy, size, col]);
  };
  g.save(); g.beginPath(); g.rect(x0, y0, S, S); g.clip(); g.translate(x0, y0);
  g.fillStyle = C[0]; g.fillRect(0, 0, S, S);
  for (let i = 0, n = 1 + Math.floor(r() * 3); i < n; i++) {           // slanted bands, edge to edge
    const y = (0.1 + r() * 0.7) * S, w = (0.06 + r() * 0.14) * S, tilt = (r() - 0.5) * 0.7 * S;
    g.fillStyle = C[1 + (i % 2)]; g.beginPath(); g.moveTo(0, y - tilt); g.lineTo(S, y + tilt); g.lineTo(S, y + tilt + w); g.lineTo(0, y - tilt + w); g.fill();
  }
  if (layout === 0) put(any(FIGURES), r() < 0.5 ? 1 / 3 : 2 / 3, 0.52, 0.7, (r() - 0.5) * 0.3, next(), r() < 0.5);
  else if (layout === 1) { const n = 5 + Math.floor(r() * 3), name = any(FIGURES), a = next(), b = next(); for (let i = 0; i < n; i++) put(name, (i + 0.5) / n, 0.55 + (i % 2 ? 0.05 : -0.05), 0.95 / n * 1.5, i % 2 ? 0.15 : -0.15, i % 2 ? a : b); }
  else if (layout === 2) for (let i = 0, n = 9 + Math.floor(r() * 6); i < n; i++) put(any(ALL), 0.1 + r() * 0.8, 0.1 + r() * 0.75, 0.2 + r() * 0.4, (r() - 0.5) * 1.2, next(), r() < 0.5);
  else if (layout === 3) {
    put('halfdisc', 0.3 + r() * 0.4, 0.5, 0.56, 0, next());
    for (let k = 0; k < 3; k++) put('wave', 0.5 + (k % 2 ? 0.06 : -0.06), 0.72 + k * 0.11, 1.15, 0, next());
    put('bird', 0.22 + r() * 0.1, 0.2, 0.24, -0.1, next()); put('bird', 0.7 + r() * 0.1, 0.14, 0.18, 0.1, next(), true);
  } else {
    const a = C[1], b = C[2], name = any(FIGURES);
    g.fillStyle = a; g.fillRect(0, 0, S / 2, S); g.fillStyle = b; g.fillRect(S / 2, 0, S / 2, S);
    put(name, 0.27, 0.5, 0.42, 0, b); put(name, 0.73, 0.5, 0.42, 0, a, true);
  }
  if (drips) for (let i = 0; i < 3; i++) {                              // paint running down from a shape
    const p = placed[Math.floor(r() * placed.length)], w = ((4 + r() * 4) * S) / 256, len = ((20 + r() * 70) * S) / 256;
    const x = (p[0] + (r() - 0.5) * p[2] * 0.5) * S, y = Math.min(0.9, p[1] + p[2] * 0.2) * S;
    g.fillStyle = p[3]; g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, len, w / 2); else g.rect(x, y, w, len); g.fill();
  }
  g.fillStyle = ink; g.globalAlpha = 0.06;
  for (let i = 0; i < 300; i++) g.fillRect(r() * S, r() * S, lw * 0.8, lw * 0.8);
  g.globalAlpha = 1;
  ['fish', 'disc', 'eye'].forEach((name, i) => put(name, 0.78 + i * 0.08, 0.94, 0.06, 0, ink));      // the painter's tag
  g.restore();
  return LAYOUTS[layout];
}

// A sign board. 'paint': hand-painted letters on cream, each a little crooked, over two brush
// stripes. 'stencil': ink letters between two hazard bands.
function paintBoard(g, x0, y0, w, h, text, colour, style, seed) {
  const k = w / 512, r = rng(seed);
  g.save(); g.beginPath(); g.rect(x0, y0, w, h); g.clip(); g.translate(x0, y0);
  g.fillStyle = style === 'stencil' ? colour : '#fff1c9'; g.fillRect(0, 0, w, h);
  g.textAlign = 'left'; g.textBaseline = 'middle';
  let size = 76 * k;
  const font = () => { g.font = `900 ${size}px "Trebuchet MS", "Arial Black", sans-serif`; };
  const gap = style === 'stencil' ? 6 * k : 0, width = () => { let t = 0; for (const ch of text) t += g.measureText(ch).width + gap; return t; };
  font(); while (width() > 440 * k && size > 18 * k) { size -= 4 * k; font(); }
  if (style === 'stencil') {
    for (const y of [0, h - 10 * k]) for (let x = -h; x < w; x += 24 * k) { g.fillStyle = INK; g.beginPath(); g.moveTo(x, y + 10 * k); g.lineTo(x + 12 * k, y + 10 * k); g.lineTo(x + 22 * k, y); g.lineTo(x + 10 * k, y); g.fill(); }
  } else {
    g.globalAlpha = 0.45; g.fillStyle = colour;
    for (const y of [0.74, 0.86]) { g.beginPath(); g.moveTo(40 * k, y * h); g.quadraticCurveTo(w / 2, (y + 0.04) * h, w - 40 * k, (y - 0.02) * h); g.lineTo(w - 44 * k, (y + 0.05) * h); g.quadraticCurveTo(w / 2, (y + 0.1) * h, 36 * k, (y + 0.06) * h); g.fill(); }
    g.globalAlpha = 1;
  }
  let x = (w - width()) / 2;
  for (const ch of text) {
    const cw = g.measureText(ch).width, tilt = style === 'stencil' ? 0 : (r() - 0.5) * 0.105, up = style === 'stencil' ? 0 : (r() - 0.5) * 6 * k;
    g.save(); g.translate(x + cw / 2, h * (style === 'stencil' ? 0.52 : 0.46) + up); g.rotate(tilt);
    if (style !== 'stencil') { g.fillStyle = INK; g.fillText(ch, -cw / 2 + 4 * k, 4 * k); }
    g.fillStyle = style === 'stencil' ? INK : colour; g.fillText(ch, -cw / 2, 0);
    g.restore(); x += cw + gap;
  }
  g.restore();
}

// ---------- the sheet ----------
let canvas = null, ctx = null, tex = null, mat = null, tick = 0;
const cells = new Map(), boards = new Map();          // key -> { slot, used, ... }
export const stats = { size: 0, cells: CELLS, boards: BOARDS, painted: 0, reused: 0, boardsPainted: 0, layouts: {} };

// the sheet at a size: 1024 on phones (128 px cells), 2048 otherwise (256 px cells)
export function muralAtlas(size = 2048) {
  if (canvas && canvas.width === size) return tex;
  if (!canvas) { canvas = document.createElement('canvas'); ctx = canvas.getContext('2d'); }
  canvas.width = canvas.height = size; cells.clear(); boards.clear(); stats.size = size;
  ctx.fillStyle = '#fdf6ea'; ctx.fillRect(0, 0, size, size);
  if (tex) tex.dispose();
  tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  if (mat) mat.map = tex;
  return tex;
}
function slotFor(table, key, count) {
  const hit = table.get(key);
  if (hit) { hit.used = ++tick; return hit; }
  let slot = table.size, old = null;
  if (table.size >= count) { for (const [k, v] of table) if (!old || v.used < old[1].used) old = [k, v]; slot = old[1].slot; table.delete(old[0]); stats.reused++; }
  const made = { slot, used: ++tick, fresh: true };
  table.set(key, made);
  return made;
}
const uvOf = (x, y, w, h, m) => { const S = canvas.width, u0 = (x + m) / S, u1 = (x + w - m) / S, v1 = 1 - (y + m) / S, v0 = 1 - (y + h - m) / S; return [u0, v0, u1, v0, u1, v1, u0, v1]; };

// UVs of the mural for a seed and palette (a list of five colours), painted now if it is new
export function mural(seed, palette, { drips = false } = {}) {
  if (!canvas) muralAtlas();
  const S = canvas.width / COLS, e = slotFor(cells, seed + '|' + palette.join() + (drips ? 'd' : ''), CELLS), x = (e.slot % COLS) * S, y = Math.floor(e.slot / COLS) * S;
  if (e.fresh) { e.fresh = false; e.layout = paintCell(ctx, x, y, S, seed, palette, drips); stats.painted++; stats.layouts[e.layout] = (stats.layouts[e.layout] || 0) + 1; tex.needsUpdate = true; }
  return uvOf(x, y, S, S, 1.5);
}
// UVs of a sign board, 4 to 1: style 'paint' or 'stencil'
export function board(text, colour = '#ff6f91', style = 'paint') {
  if (!canvas) muralAtlas();
  const w = canvas.width / 4, h = w / 4, e = slotFor(boards, style + '|' + colour + '|' + text, BOARDS), x = (e.slot % 4) * w, y = ROWS * (canvas.width / COLS) + Math.floor(e.slot / 4) * h;
  if (e.fresh) { e.fresh = false; let s = 0; for (const ch of text) s = (s * 31 + ch.charCodeAt(0)) | 0; paintBoard(ctx, x, y, w, h, text, colour, style, s); stats.boardsPainted++; tex.needsUpdate = true; }
  return uvOf(x, y, w, h, 1);
}
// A painted wall from a to b (left to right as you face it; each is [x, z]) between y0 and y1:
// one cell for each 12 m, with seeds seed, seed + 1 and so on, none stretched past 2 to 1.
export function muralWall(U, a, b, y0, y1, seed, palette, opts) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = (opts && opts.cells) || Math.max(1, Math.round(len / 12), Math.ceil(len / (2 * (y1 - y0))));
  for (let i = 0; i < n; i++) {
    const p = [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n], q = [a[0] + ((b[0] - a[0]) * (i + 1)) / n, a[1] + ((b[1] - a[1]) * (i + 1)) / n];
    U.quad([p[0], y0, p[1]], [q[0], y0, q[1]], [q[0], y1, q[1]], [p[0], y1, p[1]], 0xffffff, 1, mural(seed + i, palette, opts));
  }
  return n;
}
// the one material every mural and board uses, and a mesh for a chunk's painted quads
export function muralMaterial() { if (!mat) mat = new THREE.MeshBasicMaterial({ map: tex || muralAtlas() }); return mat; }
const dim = () => { mat.color.setScalar(1 - 0.5 * (chunkMaterials().on || 0)); };
export function muralMesh(builder) {
  const mesh = new THREE.Mesh(builder.build({ free: true }), muralMaterial());
  mesh.onBeforeRender = dim; mesh.userData.murals = builder.triangles / 2;
  return mesh;
}
// the sheet's canvas, for a check or a screenshot of the painter's work
export const muralCanvas = () => canvas;
