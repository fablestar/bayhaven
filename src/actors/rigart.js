// What a lead is made of: one small canvas sheet (eight faces, the shirt, a sleeve, a leg and
// flat colours) and boxes that map onto it. Numbers from plan/bible/art/characters.md, sections
// 1, 2 and 5. Nothing is loaded: the sheet is drawn here.
import * as THREE from 'three';

const W = 256, H = 128, INK = '#2a1a2e';
export const FACES = { neutral: 0, happy: 1, shocked: 2, angry: 3, squint: 4, dizzy: 5, blink: 6, talk: 7 };
// flat colour squares on the sheet, by name
const SWATCH = ['skin', 'roots', 'hair', 'shirt', 'tank', 'shorts', 'slide', 'screen', 'live', 'ink', 'battery', 'white'];
export const LOOKS = {
  teo: { skin: '#c68a5e', roots: '#3a2a1e', hair: '#f4e7a1', shirt: '#29e6ff', flower: '#ff4fa8', tank: '#fdf6ea', shorts: '#b46bff',
    slide: '#150f3d', screen: '#29e6ff', live: '#ff3fa4', ink: INK, battery: '#3b3946', white: '#ffffff',
    scale: 1, swing: 1.15, bob: 1.5, lean: 1, sprint: 6.8 },
};

function line(g, pts, w = 2) {
  g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = INK;
  g.beginPath(); g.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
  g.stroke();
}
function dot(g, x, y, r, fill = INK) { g.fillStyle = fill; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); }
function oval(g, x, y, w, h) { g.fillStyle = INK; g.beginPath(); g.ellipse(x, y, w / 2, h / 2, 0, 0, 6.2832); g.fill(); }
function arc(g, x, y, r, a0, a1, w = 2) { g.lineWidth = w; g.lineCap = 'round'; g.strokeStyle = INK; g.beginPath(); g.arc(x, y, r, a0 * Math.PI / 180, a1 * Math.PI / 180); g.stroke(); }

// the eight face cells of the bible's table, each 32 px, drawn at (0, 0)
const DRAW = [
  (g) => { dot(g, 10, 13, 2); dot(g, 22, 13, 2); line(g, [12, 22, 20, 22]); },
  (g) => { arc(g, 10, 14, 2.5, 180, 360); arc(g, 22, 14, 2.5, 180, 360); arc(g, 16, 19, 5, 20, 160);
    g.globalAlpha = 0.5; dot(g, 6, 19, 1.5, '#ff8fd0'); dot(g, 26, 19, 1.5, '#ff8fd0'); g.globalAlpha = 1; },
  (g) => { for (const x of [10, 22]) { dot(g, x, 12, 3, '#ffffff'); g.lineWidth = 1.5; g.strokeStyle = INK; g.beginPath(); g.arc(x, 12, 3, 0, 6.2832); g.stroke(); dot(g, x, 12, 1); }
    line(g, [7, 6, 13, 7]); line(g, [19, 7, 25, 6]); oval(g, 16, 23, 6, 8); },
  (g) => { dot(g, 10, 14, 2); dot(g, 22, 14, 2); line(g, [6, 8, 14, 11], 2.5); line(g, [26, 8, 18, 11], 2.5); arc(g, 16, 27, 5, 200, 340); },
  (g) => { line(g, [7, 13, 13, 13]); dot(g, 22, 13, 2.5); line(g, [19, 8, 25, 9]); line(g, [14, 22, 19, 21]); },
  (g) => { for (const x of [10, 22]) { g.lineWidth = 1.5; g.strokeStyle = INK; g.beginPath();
    for (let a = 0; a <= 9.42; a += 0.3) { const r = 3.5 * a / 9.42; g.lineTo(x + Math.cos(a) * r, 13 + Math.sin(a) * r); } g.stroke(); }
    line(g, [11, 23, 14, 21, 18, 24, 21, 22]); },
  (g) => { line(g, [8, 13, 12, 13]); line(g, [20, 13, 24, 13]); line(g, [12, 22, 20, 22]); },
  (g) => { dot(g, 10, 13, 2); dot(g, 22, 13, 2); oval(g, 16, 22, 5, 4); },
];

function flowers(g, x0, y0, look, seed) {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 9; i++) {
    const x = x0 + 3 + r() * 26, y = y0 + 3 + r() * 26;
    g.fillStyle = look.flower;
    for (const [dx, dy] of [[0, -2], [2, 0], [0, 2], [-2, 0]]) g.fillRect(Math.round(x + dx) - 1, Math.round(y + dy) - 1, 2, 2);
    g.fillStyle = '#ffffff'; g.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
  }
}

export function drawSheet(look) {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = look.skin; g.fillRect(0, 0, W, 32);
  DRAW.forEach((fn, i) => { g.save(); g.translate(i * 32, 0); fn(g); g.restore(); });
  // shirt front (cell 13): the open floral shirt over a white tank, and the phone harness in ink
  g.fillStyle = look.shirt; g.fillRect(0, 32, 64, 32);
  flowers(g, 0, 32, look, 3); flowers(g, 32, 32, look, 7);
  g.fillStyle = look.tank; g.fillRect(10, 32, 12, 32);
  g.fillStyle = look.skin; g.fillRect(12, 32, 8, 4);
  g.fillStyle = INK; g.fillRect(7, 32, 2, 32); g.fillRect(23, 32, 2, 32); g.fillRect(7, 48, 18, 2);
  // shirt back: the harness cross
  g.save(); g.beginPath(); g.rect(32, 32, 32, 32); g.clip();
  g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(34, 33); g.lineTo(62, 63); g.moveTo(62, 33); g.lineTo(34, 63); g.stroke(); g.restore();
  // short sleeve: top 40% cloth, the rest skin
  g.fillStyle = look.skin; g.fillRect(64, 32, 16, 32); g.fillStyle = look.shirt; g.fillRect(64, 32, 16, 13);
  // leg: board shorts with a white side stripe, skin, then a white sock
  g.fillStyle = look.skin; g.fillRect(80, 32, 16, 32); g.fillStyle = look.shorts; g.fillRect(80, 32, 16, 14);
  g.fillStyle = '#ffffff'; g.fillRect(80, 32, 3, 14); g.fillRect(80, 56, 16, 8);
  SWATCH.forEach((name, i) => { g.fillStyle = look[name]; g.fillRect(i * 16, 64, 16, 16); });
  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false; tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// rectangles on the sheet, in pixels: [x, y, w, h]
export const CELL = {
  face: (i) => [i * 32, 0, 32, 32], front: [0, 32, 32, 32], back: [32, 32, 32, 32], arm: [64, 32, 16, 32], leg: [80, 32, 16, 32],
};
for (let i = 0; i < SWATCH.length; i++) CELL[SWATCH[i]] = [i * 16 + 4, 68, 8, 8];

// normal, u axis, v axis of the six faces: front (+z), back, left (+x), right, top, bottom
const SIDES = [
  ['front', [0, 0, 1], [1, 0, 0], [0, 1, 0]], ['back', [0, 0, -1], [-1, 0, 0], [0, 1, 0]],
  ['side', [1, 0, 0], [0, 0, -1], [0, 1, 0]], ['side', [-1, 0, 0], [0, 0, 1], [0, 1, 0]],
  ['top', [0, 1, 0], [1, 0, 0], [0, 0, -1]], ['bottom', [0, -1, 0], [1, 0, 0], [0, 0, 1]],
];

// One geometry from a list of boxes: { w, h, d, at: [x, y, z] (centre), uv: { side, front, back, top, bottom } }.
// A face without its own rectangle takes `side`. Returns the geometry; geo.userData.faceUv is where
// the first box's front face keeps its four uvs (the head swaps its face there).
export function boxes(list) {
  const pos = [], nor = [], uv = [], idx = [];
  for (const b of list) {
    const half = [b.w / 2, b.h / 2, b.d / 2];
    for (const [name, n, u, v] of SIDES) {
      const r = b.uv[name] || b.uv.side, base = pos.length / 3;
      const hn = Math.abs(n[0]) * half[0] + Math.abs(n[1]) * half[1] + Math.abs(n[2]) * half[2];
      const hu = Math.abs(u[0]) * half[0] + Math.abs(u[1]) * half[1] + Math.abs(u[2]) * half[2];
      const hv = Math.abs(v[0]) * half[0] + Math.abs(v[1]) * half[1] + Math.abs(v[2]) * half[2];
      for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        for (let k = 0; k < 3; k++) pos.push(b.at[k] + n[k] * hn + u[k] * hu * su + v[k] * hv * sv);
        nor.push(n[0], n[1], n[2]);
        uv.push((r[0] + (su > 0 ? r[2] : 0)) / W, 1 - (r[1] + (sv > 0 ? 0 : r[3])) / H);
      }
      idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  return geo;
}

// write a sheet rectangle into the first face (four vertices) of a geometry
export function setFaceUv(geo, r) {
  const a = geo.attributes.uv;
  a.setXY(0, r[0] / W, 1 - (r[1] + r[3]) / H); a.setXY(1, (r[0] + r[2]) / W, 1 - (r[1] + r[3]) / H);
  a.setXY(2, (r[0] + r[2]) / W, 1 - r[1] / H); a.setXY(3, r[0] / W, 1 - r[1] / H);
  a.needsUpdate = true;
}
