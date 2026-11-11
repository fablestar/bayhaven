// The window-grid texture and the wall material that reads it (plan/bible/art/kits.md section 6).
// One 1024 x 1024 canvas, drawn once: eight strips of 128 px, strip k holding k + 2 window columns,
// each strip 16 floors of 64 px that repeat upwards. Colour is what a pane adds at night, alpha is
// the pane mask. Towers, their far shells and the skyline all draw their walls with it, so a tower
// costs a handful of triangles however many windows it has.
import * as THREE from 'three';
import { rng } from '../core/rng.js';

let tex = null, mat = null;
export function windowGrid() {
  if (tex) return tex;
  const c = document.createElement('canvas');
  c.width = c.height = 1024;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 1024, 1024);
  for (let k = 0; k < 8; k++) {
    const cols = k + 2, r = rng(4102 + k), cw = 120 / cols, x0 = k * 128 + 4;
    for (let row = 0; row < 16; row++) {
      let run = false;
      for (let i = 0; i < cols; i++) {
        // about 30% lit; a lit pane's right-hand neighbour is lit half the time, so floors read as offices
        const lit = run ? r() < 0.5 : r() < 0.22;
        run = lit;
        if (lit) {
          const m = r(), b = 0.45 + r() * 0.55, col = m < 0.75 ? [255, 213, 138] : m < 0.9 ? [143, 232, 255] : [255, 143, 208];
          g.fillStyle = `rgb(${col.map((v) => Math.round(v * b)).join(',')})`;
        } else g.fillStyle = '#0c1420';
        g.fillRect(Math.round(x0 + (i + 0.2) * cw), row * 64 + 16, Math.round(cw * 0.6), 32);
      }
    }
  }
  tex = new THREE.CanvasTexture(c);
  tex.wrapT = THREE.RepeatWrapping; tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return tex;
}

// UVs for one wall: [u0, u1, v0, v1]. cell is the window pitch (4.6 m near, 6 m for far shells),
// floor the storey height. A wall takes the strip with its number of columns, 9 at most.
export function wallUV(width, y0, y1, cell = 4.6, floor = 3.8) {
  const k = Math.max(2, Math.min(9, Math.round(width / cell))) - 2;
  return [(k * 128 + 4) / 1024, ((k + 1) * 128 - 4) / 1024, y0 / (16 * floor), y1 / (16 * floor)];
}
// the UV that means "no windows here": the shader leaves such a face as plain wall
export const PLAIN_UV = [-1, 0, -1, 0, -1, 0, -1, 0];

// Lambert, plus the grid: panes darken the wall by day and glow at night. A tower lights floor by
// floor at dusk: low floors first, the top of the Spire (260 m) last.
export function windowMaterial() {
  if (mat) return mat;
  mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  const uniforms = { uGrid: { value: windowGrid() }, uOn: { value: 0 }, uGlass: { value: new THREE.Color(0x2e4a6b).multiplyScalar(0.9) } };
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = 'varying vec2 vWuv;\nvarying float vWy;\n' + sh.vertexShader
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n  vWuv = uv; vWy = position.y;');
    sh.fragmentShader = 'uniform sampler2D uGrid;\nuniform float uOn;\nuniform vec3 uGlass;\nvarying vec2 vWuv;\nvarying float vWy;\n' + sh.fragmentShader
      .replace('#include <color_fragment>', '#include <color_fragment>\n  vec4 wg = texture2D(uGrid, vWuv) * step(0.0, vWuv.x);\n  diffuseColor.rgb = mix(diffuseColor.rgb, uGlass, wg.a);')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n  totalEmissiveRadiance += wg.rgb * smoothstep(0.0, 0.08, uOn - 0.10 - 0.80 * vWy / 260.0);');
  };
  mat.setOn = (on) => { uniforms.uOn.value = on; };
  return mat;
}
