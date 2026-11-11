// Tower tiers, drawn the same way at every distance (plan/bible/art/kits.md sections 4 and 6).
// A tier is a box { x0, x1, z0, z1, y0, y1, col } with optional `rot` (a turn round its centre),
// `round` (one corner cut to a curve) and `plain` (no windows). Its walls go to o.W, the mesh that
// carries the window-grid texture. Plain faces go to o.B when there is one (a full chunk), or into
// o.W with the "no windows" UV (far shells and the skyline, which are one mesh each).
import { wallUV, PLAIN_UV } from '../../gfx/windowgrid.js';

export const ROOF = 0x6f6a78;
const PLAIN3 = [-1, 0, -1, 0, -1, 0];

// a plain box in the window mesh
export function plainBox(W, cx, cy, cz, sx, sy, sz, col, opts) {
  const a = W.count * 2;
  W.box(cx, cy, cz, sx, sy, sz, col, opts);
  W.t.fill(-1, a, W.count * 2);
  for (let i = a + 1; i < W.count * 2; i += 2) W.t[i] = 0;
}
export function plainFlat(W, x0, x1, z0, z1, y, col) { W.flat(x0, x1, z0, z1, y, col, 1, PLAIN_UV); }
const plainTri = (W, a, b, c, col) => { const at = W.count * 2; W.tri(a, b, c, col); W.t.set(PLAIN3, at); };

// The walls of a tier as runs of points, going round south, east, north, west (each run is one
// wall for the window grid; a curved corner is one run of seven points).
export function tierWalls(t, inset = 0) {
  const x0 = t.x0 + inset, x1 = t.x1 - inset, z0 = t.z0 + inset, z1 = t.z1 - inset;
  const C = { sw: [x0, z1], se: [x1, z1], ne: [x1, z0], nw: [x0, z0] }, order = ['sw', 'se', 'ne', 'nw'];
  let runs = [];
  if (!t.round) runs = order.map((k, i) => [C[k], C[order[(i + 1) % 4]]]);
  else {
    const i = order.indexOf(t.round), c = C[t.round], p = C[order[(i + 3) % 4]], n = C[order[(i + 1) % 4]], r = Math.min(t.r || 12, (x1 - x0) / 2 - 1);
    const up = [Math.sign(p[0] - c[0]), Math.sign(p[1] - c[1])], un = [Math.sign(n[0] - c[0]), Math.sign(n[1] - c[1])];
    const mx = c[0] + r * (up[0] + un[0]), mz = c[1] + r * (up[1] + un[1]), arc = [];
    for (let s = 0; s <= 6; s++) { const a = (s / 6) * Math.PI / 2; arc.push([mx - r * (un[0] * Math.cos(a) + up[0] * Math.sin(a)), mz - r * (un[1] * Math.cos(a) + up[1] * Math.sin(a))]); }
    // start with the run after the curve, end with the curve
    let from = arc[6];
    for (let k = 1; k <= 4; k++) { const to = k === 4 ? arc[0] : C[order[(i + k) % 4]]; runs.push([from, to]); from = to; }
    runs.push(arc);
  }
  if (t.rot) {
    const cx = (t.x0 + t.x1) / 2, cz = (t.z0 + t.z1) / 2, cs = Math.cos(t.rot), sn = Math.sin(t.rot);
    runs = runs.map((run) => run.map(([x, z]) => [cx + (x - cx) * cs + (z - cz) * sn, cz - (x - cx) * sn + (z - cz) * cs]));
  }
  return runs;
}

// Draw tiers. cell: the window pitch (4.6 m near; 6 m far, never cut). inset: how far inside the
// real walls (the skyline sits a hair inside the shells that cover it). Returns triangles added.
export function drawTiers(o, tiers, { cell = 4.6, inset = 0, cut = true, roofs = true } = {}) {
  const W = o.W, start = W.count + (o.B ? o.B.count : 0);
  for (const t of tiers) {
    const runs = tierWalls(t, inset), ring = [];
    for (const run of runs) {
      let len = 0; const at = [0];
      for (let i = 1; i < run.length; i++) { len += Math.hypot(run[i][0] - run[i - 1][0], run[i][1] - run[i - 1][1]); at.push(len); }
      for (let i = 0; i < run.length - 1; i++) ring.push(run[i]);
      if (t.plain) {
        for (let i = 0; i < run.length - 1; i++) {
          const p = run[i], q = run[i + 1], quad = [[p[0], t.y0, p[1]], [q[0], t.y0, q[1]], [q[0], t.y1, q[1]], [p[0], t.y1, p[1]]];
          if (o.B) o.B.quad(...quad, t.col); else W.quad(...quad, t.col, 1, PLAIN_UV);
        }
        continue;
      }
      // a straight wall with more than nine columns is cut into equal pieces, each with its own strip
      const cols = Math.round(len / cell), pieces = cut && run.length === 2 && cols > 9 ? Math.ceil(cols / 9) : 1;
      const [u0, u1, v0, v1] = wallUV(len / pieces, t.y0, t.y1, cell);
      for (let k = 0; k < pieces; k++) for (let i = 0; i < run.length - 1; i++) {
        const fa = pieces > 1 ? k / pieces : at[i] / len, fb = pieces > 1 ? (k + 1) / pieces : at[i + 1] / len;
        const p = run[0], q = run[run.length - 1];
        const a = pieces > 1 ? [p[0] + (q[0] - p[0]) * fa, p[1] + (q[1] - p[1]) * fa] : run[i], b = pieces > 1 ? [p[0] + (q[0] - p[0]) * fb, p[1] + (q[1] - p[1]) * fb] : run[i + 1];
        const ua = pieces > 1 ? u0 : u0 + (u1 - u0) * fa, ub = pieces > 1 ? u1 : u0 + (u1 - u0) * fb;
        W.quad([a[0], t.y0, a[1]], [b[0], t.y0, b[1]], [b[0], t.y1, b[1]], [a[0], t.y1, a[1]], t.col, 1, [ua, v0, ub, v0, ub, v1, ua, v1]);
      }
    }
    if (!roofs || t.noRoof) continue;
    const top = t.top !== undefined ? t.top : ROOF;
    for (let i = 1; i < ring.length - 1; i++) {
      const a = [ring[0][0], t.y1, ring[0][1]], b = [ring[i][0], t.y1, ring[i][1]], c = [ring[i + 1][0], t.y1, ring[i + 1][1]];
      if (o.B) o.B.tri(a, b, c, top); else plainTri(W, a, b, c, top);
    }
  }
  return (W.count + (o.B ? o.B.count : 0) - start) / 3;
}
