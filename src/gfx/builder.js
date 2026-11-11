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

// v2: positions are floats, normals are signed bytes and colours are unsigned bytes (18 bytes a
// vertex with padding instead of 36). The builder writes into typed arrays that grow by doubling
// and can be used again after reset(), so a streaming chunk does not allocate while it builds.
export class MeshBuilder {
  constructor({ uv = false, size = 1024 } = {}) {
    this.p = new Float32Array(size * 3); this.n = new Int8Array(size * 3); this.c = new Uint8Array(size * 3);
    this.t = uv ? new Float32Array(size * 2) : null;
    this.count = 0;                        // vertices written
  }

  reset() { this.count = 0; return this; }

  grow(need) {
    let size = this.p.length / 3;
    if (this.count + need <= size) return;
    while (this.count + need > size) size *= 2;
    const p = new Float32Array(size * 3); p.set(this.p.subarray(0, this.count * 3)); this.p = p;
    const n = new Int8Array(size * 3); n.set(this.n.subarray(0, this.count * 3)); this.n = n;
    const c = new Uint8Array(size * 3); c.set(this.c.subarray(0, this.count * 3)); this.c = c;
    if (this.t) { const t = new Float32Array(size * 2); t.set(this.t.subarray(0, this.count * 2)); this.t = t; }
  }

  // Triangle a,b,c, counter-clockwise seen from the front.
  tri(a, b, c, color, shade = 1) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = 127 / (Math.hypot(nx, ny, nz) || 1); nx = Math.round(nx * l); ny = Math.round(ny * l); nz = Math.round(nz * l);
    const k = rgb(color), s = shade * 255;
    const r = Math.min(255, k[0] * s + 0.5) | 0, g = Math.min(255, k[1] * s + 0.5) | 0, bl = Math.min(255, k[2] * s + 0.5) | 0;
    this.grow(3);
    let i = this.count * 3;
    const P = this.p, N = this.n, C = this.c;
    P[i] = a[0]; P[i + 1] = a[1]; P[i + 2] = a[2]; N[i] = nx; N[i + 1] = ny; N[i + 2] = nz; C[i] = r; C[i + 1] = g; C[i + 2] = bl; i += 3;
    P[i] = b[0]; P[i + 1] = b[1]; P[i + 2] = b[2]; N[i] = nx; N[i + 1] = ny; N[i + 2] = nz; C[i] = r; C[i + 1] = g; C[i + 2] = bl; i += 3;
    P[i] = c[0]; P[i + 1] = c[1]; P[i + 2] = c[2]; N[i] = nx; N[i + 1] = ny; N[i + 2] = nz; C[i] = r; C[i + 1] = g; C[i + 2] = bl;
    this.count += 3;
  }

  // Quad a,b,c,d, counter-clockwise seen from the front. uv = [au,av, bu,bv, cu,cv, du,dv].
  quad(a, b, c, d, color, shade = 1, uv = UV_FULL) {
    const at = this.count * 2;
    this.tri(a, b, c, color, shade);
    this.tri(a, c, d, color, shade);
    if (this.t) {
      const T = this.t;
      T[at] = uv[0]; T[at + 1] = uv[1]; T[at + 2] = uv[2]; T[at + 3] = uv[3]; T[at + 4] = uv[4]; T[at + 5] = uv[5];
      T[at + 6] = uv[0]; T[at + 7] = uv[1]; T[at + 8] = uv[4]; T[at + 9] = uv[5]; T[at + 10] = uv[6]; T[at + 11] = uv[7];
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

  // A geometry holding a copy of what was written. free: let go of the copies once they are on
  // the graphics card (chunk meshes: nothing reads them again). groundUv: add world-metre UVs.
  build({ free = false, groundUv = 0 } = {}) {
    const g = new THREE.BufferGeometry(), v = this.count;
    const attr = (name, a) => { if (free) a.onUpload(function () { this.array = null; }); g.setAttribute(name, a); };
    attr('position', new THREE.BufferAttribute(this.p.slice(0, v * 3), 3));
    attr('normal', new THREE.BufferAttribute(this.n.slice(0, v * 3), 3, true));
    attr('color', new THREE.BufferAttribute(this.c.slice(0, v * 3), 3, true));
    if (this.t) attr('uv', new THREE.BufferAttribute(this.t.slice(0, v * 2), 2));
    else if (groundUv) {
      const uv = new Float32Array(v * 2);
      for (let i = 0; i < v; i++) { uv[i * 2] = this.p[i * 3] / groundUv; uv[i * 2 + 1] = this.p[i * 3 + 2] / groundUv; }
      attr('uv', new THREE.BufferAttribute(uv, 2));
    }
    g.computeBoundingSphere(); g.computeBoundingBox();
    return g;
  }

  get triangles() { return this.count / 3; }
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
