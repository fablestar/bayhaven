// A tiny kit for building low-poly meshes in code. Everything in the city is boxes,
// quads and triangles pushed into a few big buffers, so the whole block draws in a
// handful of draw calls (that is what keeps it fast on phones).

import * as THREE from 'three';

const _c = new THREE.Color();
const cache = new Map();
function rgb(hex) {
  let v = cache.get(hex);
  if (!v) { _c.set(hex); v = [_c.r, _c.g, _c.b]; cache.set(hex, v); }
  return v;
}

// Seeded random numbers live in core/rng.js; passed on here because day 1's files import them from the builder.
export { rng } from '../core/rng.js';

const UV_FULL = [0, 0, 1, 0, 1, 1, 0, 1];

export class MeshBuilder {
  constructor({ uv = false } = {}) {
    this.pos = []; this.nor = []; this.col = [];
    this.uvs = uv ? [] : null;
  }

  // Triangle a,b,c, counter-clockwise seen from the front.
  tri(a, b, c, color, shade = 1) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    const k = rgb(color);
    for (const p of [a, b, c]) {
      this.pos.push(p[0], p[1], p[2]);
      this.nor.push(nx, ny, nz);
      this.col.push(k[0] * shade, k[1] * shade, k[2] * shade);
    }
  }

  // Quad a,b,c,d, counter-clockwise seen from the front. uv = [au,av, bu,bv, cu,cv, du,dv].
  quad(a, b, c, d, color, shade = 1, uv = UV_FULL) {
    this.tri(a, b, c, color, shade);
    this.tri(a, c, d, color, shade);
    if (this.uvs) {
      this.uvs.push(uv[0], uv[1], uv[2], uv[3], uv[4], uv[5], uv[0], uv[1], uv[4], uv[5], uv[6], uv[7]);
    }
  }

  // Flat quad facing up.
  flat(x0, x1, z0, z1, y, color, shade = 1, uv) {
    this.quad([x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0], color, shade, uv);
  }

  // Six-sided solid from 8 corners:
  // 0:(-x,-y,-z) 1:(+x,-y,-z) 2:(+x,-y,+z) 3:(-x,-y,+z)  4..7: the same, on top.
  hexa(p, color, { top = color, bottom = false, noTop = false } = {}) {
    if (!noTop) this.quad(p[7], p[6], p[5], p[4], top);
    this.quad(p[3], p[2], p[6], p[7], color);
    this.quad(p[1], p[0], p[4], p[5], color);
    this.quad(p[2], p[1], p[5], p[6], color);
    this.quad(p[0], p[3], p[7], p[4], color);
    if (bottom) this.quad(p[0], p[1], p[2], p[3], color);
  }

  // Box centred at (cx,cy,cz). Options: rot (turn around y), taper [tx,tz] (shrink the
  // top), shift [dx,dz] (slide the top sideways), top (roof colour).
  box(cx, cy, cz, sx, sy, sz, color, opts = {}) {
    const { rot = 0, taper, shift } = opts;
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const cs = Math.cos(rot), sn = Math.sin(rot);
    const pt = (a, b, c) => {
      let x = a * hx, z = c * hz;
      if (b > 0) {
        if (taper) { x *= taper[0]; z *= taper[1]; }
        if (shift) { x += shift[0]; z += shift[1]; }
      }
      return [cx + x * cs + z * sn, cy + b * hy, cz - x * sn + z * cs];
    };
    this.hexa([
      pt(-1, -1, -1), pt(1, -1, -1), pt(1, -1, 1), pt(-1, -1, 1),
      pt(-1, 1, -1), pt(1, 1, -1), pt(1, 1, 1), pt(-1, 1, 1),
    ], color, opts);
  }

  // Cylinder lying along the x axis (a wheel).
  cylX(cx, cy, cz, r, w, color, cap = color, n = 10) {
    const xl = cx - w / 2, xr = cx + w / 2;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
      const y0 = cy + r * Math.cos(a0), z0 = cz + r * Math.sin(a0);
      const y1 = cy + r * Math.cos(a1), z1 = cz + r * Math.sin(a1);
      this.quad([xr, y0, z0], [xl, y0, z0], [xl, y1, z1], [xr, y1, z1], color);
      this.tri([xr, cy, cz], [xr, y0, z0], [xr, y1, z1], cap);
      this.tri([xl, cy, cz], [xl, y1, z1], [xl, y0, z0], cap);
    }
  }

  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    if (this.uvs) g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uvs, 2));
    g.computeBoundingSphere();
    return g;
  }

  get triangles() { return this.pos.length / 9; }
}

// Soft round glow, painted on a canvas. Used for lamp halos, light pools and headlights.
let glowTex = null;
export function glowTexture() {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  grad.addColorStop(0.6, 'rgba(255,255,255,0.14)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  glowTex = new THREE.CanvasTexture(c);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  return glowTex;
}
