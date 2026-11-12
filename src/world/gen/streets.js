// What the day 4 side districts share (Palma Vieja, The Paintworks, Rustwater): the ground, the
// road paint and the order a chunk is built in. A chunk may hold two of these districts (the line
// between The Paintworks and Rustwater at x = 1800 is not a chunk edge), so each district's kit
// registers here and one builder asks the right kit for each lot, block and road piece.
//   register(zoneId, { asphalt, pave, blockRect(b), ground(o, rect, chunk, map), lot(o, lot, map, chunk),
//                      furniture(o, block, map, chunk), street(o, piece, map, chunk), shellLot(o, lot) })
// It also holds three small tools: eight-sided columns, pens that draw one shape into a full chunk
// or a far shell, and instanced shipping containers.
import * as THREE from 'three';
import { rng } from '../../core/rng.js';
import { MeshBuilder } from '../../gfx/builder.js';
import { PLAIN_UV } from '../../gfx/windowgrid.js';
import { muralMesh, muralAtlas } from '../../gfx/murals.js';
import { CURB, slab, barrier } from './kit.js';
import { plainBox, ROOF } from './towers.js';

const ASPHALT = 0x3b3946, DASH = 0xf2e6b0, PAVE = 0xd6cdc4, Y = 0.02;
const hit = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.z0 < b.z1 && a.z1 > b.z0;
const KITS = {};
export const register = (id, kit) => { KITS[id] = kit; };

// ---------- columns and pens ----------

// an n-sided column from y0 to y1; r1 is the radius at the top (a taper). Works on any builder:
// on one with UVs (a far shell, the skyline) its faces carry the "no windows" UV.
export function prism(M, cx, cz, r, y0, y1, col, { n = 8, r1 = r, top = col, noTop = false, rot = Math.PI / 8 } = {}) {
  const pt = (i, rad, y) => { const a = rot + (i / n) * Math.PI * 2; return [cx + Math.sin(a) * rad, y, cz + Math.cos(a) * rad]; };
  for (let i = 0; i < n; i++) M.quad(pt(i, r, y0), pt(i + 1, r, y0), pt(i + 1, r1, y1), pt(i, r1, y1), col, 0.86 + 0.14 * Math.cos((i / n) * Math.PI * 2), PLAIN_UV);
  if (noTop) return;
  for (let i = 1; i < n - 1; i++) {
    const at = M.count * 2;
    M.tri(pt(0, r1, y1), pt(i, r1, y1), pt(i + 1, r1, y1), top);
    if (M.t) M.t.set([-1, 0, -1, 0, -1, 0], at);
  }
}
// a pen draws boxes and columns either into a chunk's solids or into a window-wall mesh
export const penB = (o) => ({ box: (...a) => o.B.box(...a), prism: (...a) => prism(o.B, ...a) });
export const penW = (o) => ({ box: (...a) => plainBox(o.W, ...a), prism: (...a) => prism(o.W, ...a) });

// ---------- instanced shipping containers ----------

export const CONTAINER = { l: 12.2, w: 2.6, h: 2.6 };
let boxGeo = null, boxMat = null;
const stats = { containers: 0, colours: new Set() };
export const containerStats = stats;
// one container, its long side along x (or along z); y is its base
export function container(o, x, y, z, alongZ, col) { (o.boxes || (o.boxes = [])).push(x, y, z, alongZ ? 1 : 0, col); }
function containerMesh(list) {
  if (!boxGeo) {
    const b = new MeshBuilder({ size: 64 }), { l, w, h } = CONTAINER;
    b.box(0, h / 2, 0, l, h, w, 0xffffff, { top: 0xd8d8d8 });
    b.quad([l / 2 + 0.01, 0.15, w / 2 - 0.15], [l / 2 + 0.01, 0.15, -w / 2 + 0.15], [l / 2 + 0.01, h - 0.15, -w / 2 + 0.15], [l / 2 + 0.01, h - 0.15, w / 2 - 0.15], 0xbdbdbd);   // the doors
    boxGeo = b.build();
    boxMat = new THREE.MeshLambertMaterial({ vertexColors: true });
  }
  const n = list.length / 5, geo = boxGeo.clone(), mesh = new THREE.InstancedMesh(geo, boxMat, n), m = new THREE.Matrix4(), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const k = i * 5;
    if (list[k + 3]) m.makeRotationY(Math.PI / 2); else m.identity();
    m.setPosition(list[k], list[k + 1], list[k + 2]);
    mesh.setMatrixAt(i, m); mesh.setColorAt(i, c.set(list[k + 4]));
    stats.colours.add(list[k + 4]);
  }
  stats.containers += n;
  mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true;
  mesh.computeBoundingSphere();
  // the streamer frees a dropped chunk's geometry; the instance buffers go with it
  const drop = geo.dispose.bind(geo);
  geo.dispose = () => { drop(); mesh.dispose(); };
  return mesh;
}

// the builder a chunk's murals and painted boards go into (made the first time it is asked for)
export const paintInto = (o) => o.U || (o.U = new MeshBuilder({ uv: true, size: 256 }));

// the two ends of a wall of cell c, left to right as you face it from outside, e metres proud
export function wallEnds(c, side, e = 0.06) {
  if (side === 's') return [[c.x0, c.z1 + e], [c.x1, c.z1 + e]];
  if (side === 'n') return [[c.x1, c.z0 - e], [c.x0, c.z0 - e]];
  if (side === 'e') return [[c.x1 + e, c.z1], [c.x1 + e, c.z0]];
  return [[c.x0 - e, c.z0], [c.x0 - e, c.z1]];
}

// ---------- road paint ----------

function paint(o, p, map) {
  const M = o.M, ns = p.axis === 'ns', a = (ns ? p.az : p.ax) + (p.a ? map.nodes.get(p.a).half[ns ? 'ew' : 'ns'] + 2.5 : 0);
  const b = (ns ? p.bz : p.bx) - (p.b ? map.nodes.get(p.b).half[ns ? 'ew' : 'ns'] + 2.5 : 0), c = ns ? p.ax : p.az;
  const offs = p.lanes === 1 ? [0] : [-4.8, 4.8];
  for (let t = a; t + 3 <= b; t += 9) for (const off of offs) {
    if (ns) M.flat(c + off - 0.12, c + off + 0.12, t, t + 3, Y, DASH); else M.flat(t, t + 3, c + off - 0.12, c + off + 0.12, Y, DASH);
  }
  if (p.lanes > 1) { if (ns) M.flat(c - 0.25, c + 0.25, a, b, Y, DASH); else M.flat(a, b, c - 0.25, c + 0.25, Y, DASH); }
  for (const [k, end] of [[p.a, a], [p.b, b]]) {
    const n = k && map.nodes.get(k);
    if (!n || !n.signal) continue;
    const dir = end === a ? 1 : -1, hw = p.width / 2 - 0.7;
    for (let s = -hw; s < hw - 0.3; s += 1.4) {
      const u0 = end - dir * 1.5, u1 = end + dir * 1.0, lo = Math.min(u0, u1), hi = Math.max(u0, u1);
      if (ns) M.flat(c + s, c + s + 0.7, lo, hi, Y, 0xffffff); else M.flat(lo, hi, c + s, c + s + 0.7, Y, 0xffffff);
    }
  }
  if (p.stub && p.len > 20) {            // where today's map ends: day 1's striped barrier
    if (ns) barrier(o, c, p.a ? p.bz - 8 : p.az + 8, true, p.width + 8, p.a ? 's' : 'n');
    else barrier(o, p.a ? p.bx - 10 : p.ax + 10, c, false, p.width + 8, p.a ? 'w' : 'e');
  }
}

// ---------- the chunk ----------

const clip = (r, R) => ({ x0: Math.max(r.x0, R.x0), x1: Math.min(r.x1, R.x1), z0: Math.max(r.z0, R.z0), z1: Math.min(r.z1, R.z1) });

export function* buildChunk(o, chunk, map, heroes) {
  const R = chunk.rect, { cx, cz } = chunk;
  muralAtlas(o.low ? 1024 : 2048);
  for (const id in KITS) {
    const zn = map.zone(id), k = KITS[id];
    if (!zn || !hit(zn.bounds, R)) continue;
    const r = clip(zn.bounds, R);
    if (k.ground) k.ground(o, r, chunk, map); else o.G.flat(r.x0, r.x1, r.z0, r.z1, 0, k.asphalt || ASPHALT);
    for (const p of zn.plazas || []) if (hit(p, R)) { const q = clip(p, R); slab(o, q.x0, q.x1, q.z0, q.z1); }
  }
  for (const b of map.blocksInChunk(cx, cz)) {
    const k = KITS[b.zone.id];
    if (!k) continue;
    const r = k.blockRect ? k.blockRect(b) : b;
    if (r) slab(o, r.x0, r.x1, r.z0, r.z1);
  }
  yield;
  for (const p of map.roadsInChunk(cx, cz)) if (KITS[p.zone]) paint(o, p, map);
  yield;
  for (const lot of map.lotsInChunk(cx, cz)) {
    const k = KITS[lot.zone];
    if (!k) continue;
    o.rnd = rng(lot.seed || 7);
    if (lot.hero) { if (heroes[lot.hero]) heroes[lot.hero].build(o, lot, map); } else k.lot(o, lot, map, chunk);
    yield;
  }
  o.rnd = rng(chunk.seed);
  for (const b of map.blocksInChunk(cx, cz)) { const k = KITS[b.zone.id]; if (k && k.furniture) k.furniture(o, b, map, chunk); }
  yield;
  for (const p of map.roadsInChunk(cx, cz)) { const k = KITS[p.zone]; if (k && k.street) k.street(o, p, map, chunk); }
  // the two extra meshes a chunk of these districts may have: murals and hand-painted boards, and containers
  if (o.U && o.U.count) o.object(muralMesh(o.U));
  if (o.boxes && o.boxes.length) o.object(containerMesh(o.boxes));
}

// the far shell: sidewalks, and one box a building in its own colour
export function shellChunk(o, chunk, map, heroes) {
  for (const b of map.blocksInChunk(chunk.cx, chunk.cz)) {
    const k = KITS[b.zone.id];
    if (!k) continue;
    const r = k.blockRect ? k.blockRect(b) : b;
    if (r) o.B.flat(r.x0, r.x1, r.z0, r.z1, CURB, k.pave || PAVE);
  }
  for (const lot of map.lotsInChunk(chunk.cx, chunk.cz)) {
    const k = KITS[lot.zone], c = lot.body;
    if (!k) continue;
    if (lot.hero) { if (heroes[lot.hero] && heroes[lot.hero].shell) heroes[lot.hero].shell(o, lot, {}); continue; }
    if (k.shellLot) { k.shellLot(o, lot); continue; }
    if (!c || !lot.h) continue;
    o.B.box((c.x0 + c.x1) / 2, lot.h / 2, (c.z0 + c.z1) / 2, c.x1 - c.x0, lot.h, c.z1 - c.z0, lot.wall, { top: lot.roof || ROOF });
  }
}
// what each of the three generator files exports
export const generator = (id, stats) => ({ id, stats, build: buildChunk, shell: shellChunk });
