// Canvas textures for the city: the neon sign sheet and the ground grain.

import * as THREE from 'three';
import { rng } from './builder.js';

const SIGNS = [
  ['BAYHAVEN', '#ff4fa8'], ['CLUB LUMA', '#29e6ff'], ['THE PINK HERON', '#ff6fb8'], ['TIDELINE MOTEL', '#ffa02e'],
  ['MANGO MOON', '#ffd23e'], ['CORAL ARCADE', '#b98bff'], ['BAYHAVEN GRAND', '#fff0c0'], ['DINER · 24H', '#ff5a5a'],
  ['MORE CITY SOON', '#ffb020'], ['SURF & VINYL', '#5dff9b'], ['HOTEL ALBA', '#7fd6ff'], ['LOW TIDE BAR', '#ff8f5a'],
  ['SHELL YEAH', '#5dff9b'], ['STORM MART', '#ffa02e'], ['SECOND WIND THRIFT', '#b98bff'], ['BIRDBATH CAR WASH', '#29e6ff'],
];
// the cells shop fronts may use (0 is the roof sign, 8 the map-edge board), and a cell's UVs
export const SHOP_SIGNS = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];
export function signUV(i) {
  const u0 = (i % 2) / 2 + 0.0005, u1 = u0 + 0.499, v1 = 1 - Math.floor(i / 2) / 8 - 0.0005, v0 = v1 - 1 / 8 + 0.001;
  return [u0, v0, u1, v0, u1, v1, u0, v1];
}
let signTex = null;

// All the signs are drawn onto one canvas, so they share one texture and one draw call.
export function signAtlas() {
  if (signTex) return signTex;
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
  return (signTex = t);
}
let grainTex = null;
// Speckled grain for asphalt, paving and sand. Mostly white, so it only darkens a little.
export function grainTexture() {
  if (grainTex) return grainTex;
  const size = 256, c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d'), img = g.createImageData(size, size), r = rng(77);
  const coarse = new Float32Array(32 * 32).map(() => r());
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let v = 222 + (coarse[(y >> 3) * 32 + (x >> 3)] - 0.5) * 22 + (r() - 0.5) * 44;
    const speck = r();
    if (speck > 0.992) v = 255; else if (speck < 0.01) v = 150;
    const i = (y * size + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.max(0, Math.min(255, v)); img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return (grainTex = t);
}
