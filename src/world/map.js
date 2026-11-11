// The map: one source of truth for where things are. Loads every zone file, builds the road
// network, the blocks and the building lots, and answers the questions the rest of the game
// asks. Pure data: no three.js in here, so it can run in a check or a worker.
import { rng, hash2 } from '../core/rng.js';

export const CHUNK = 160, WORLD = { x0: -3200, x1: 3200, z0: -3520, z1: 1280 };
export const CURB = 0.14, SHORE = 80, WORLD_SEED = 20261111;
const ROAD = { street: { width: 14, speed: 11.1 }, avenue: { width: 22, speed: 16.7 }, boulevard: { width: 30, speed: 19.4 } };
export const PASTEL = [0xff9eb5, 0x8fe3cf, 0xffc98f, 0x9fd2ff, 0xfff1c9, 0xc9a8ff, 0xff8f7a, 0x7fd6e8, 0xf7f3ea];
const KIT_WALLS = { T2: [0x8fe3cf, 0xffc98f, 0x7fd6e8], T3: [0xff9eb5, 0xfff1c9, 0x9fd2ff], T4: [0xff8f7a, 0x7fd6e8, 0xfff1c9], T5: [0xf7f3ea, 0x8fe3cf] };

const zoneFiles = import.meta.glob('./zones/*.js', { eager: true });
const chunkX = (x) => Math.floor((x - WORLD.x0) / CHUNK), chunkZ = (z) => Math.floor((z - WORLD.z0) / CHUNK);
const key = (cx, cz) => cx + cz * 64;
const inRect = (r, x, z) => x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1;
const overlap = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.z0 < b.z1 && a.z1 > b.z0;

export function createMap() {
  const zones = Object.values(zoneFiles).map((m) => m.default);
  const pieces = [], nodes = new Map(), blocks = [], lots = [];
  const roadBucket = new Map(), lotBucket = new Map(), blockBucket = new Map();
  const put = (bucket, x, z, item) => { const k = key(chunkX(x), chunkZ(z)); if (!bucket.has(k)) bucket.set(k, []); bucket.get(k).push(item); };
  const widthAt = (line, pos) => {
    if (line.widths) for (const w of line.widths) if (pos >= w.from && pos <= w.to) return w.width;
    return line.width || ROAD[line.kind].width;
  };

  for (const zone of zones) {
    const all = zone.roads.lines, ns = all.filter((l) => l.axis === 'ns').sort((a, b) => a.at - b.at), ew = all.filter((l) => l.axis === 'ew').sort((a, b) => a.at - b.at);
    zone.ns = ns; zone.ew = ew; zone.nsAt = ns.map((l) => l.at);
    // ---- road pieces: every line cut where it crosses another ----
    for (const line of all) {
      const cross = (line.axis === 'ns' ? ew : ns).filter((o) => o.at >= line.from && o.at <= line.to && line.at >= o.from && line.at <= o.to);
      const cuts = [...new Set([line.from, ...cross.map((o) => o.at), line.to])].sort((a, b) => a - b);
      const isNode = (pos) => cross.some((o) => o.at === pos);
      for (let i = 0; i < cuts.length - 1; i++) {
        const a = cuts[i], b = cuts[i + 1], mid = (a + b) / 2;
        if (line.closed.some(([c0, c1]) => mid > c0 && mid < c1)) continue;
        const width = widthAt(line, mid), nsLine = line.axis === 'ns';
        const part = (line.parts && line.parts.find((q) => mid >= q.from && mid <= q.to)) || line;      // a line may change its name on the way
        const p = { id: (line.pid || line.id) + ':' + i, roadId: part.id || line.id, name: part.name, kind: part.kind, axis: line.axis, zone: zone.id,
          ax: nsLine ? line.at : a, az: nsLine ? a : line.at, bx: nsLine ? line.at : b, bz: nsLine ? b : line.at,
          width, lanes: width >= 30 ? 3 : width >= 22 ? 2 : 1, speed: ROAD[part.kind].speed, level: 0,
          a: isNode(a) ? (nsLine ? line.at + ',' + a : a + ',' + line.at) : null, b: isNode(b) ? (nsLine ? line.at + ',' + b : b + ',' + line.at) : null };
        p.len = b - a; p.stub = !p.a || !p.b;
        pieces.push(p); put(roadBucket, (p.ax + p.bx) / 2, (p.az + p.bz) / 2, p);
        for (const [k, x, z] of [[p.a, p.ax, p.az], [p.b, p.bx, p.bz]]) {
          if (!k) continue;
          if (!nodes.has(k)) nodes.set(k, { key: k, x, z, pieces: [], signal: false, half: { ns: 7, ew: 7 } });
          const n = nodes.get(k); n.pieces.push(p); n.half[line.axis] = Math.max(n.half[line.axis], width / 2);
        }
      }
    }
    // ---- blocks: the land between the lines, a row at a time ----
    zone.rows.forEach((row, ri) => {
      const mid = (row.z0 + row.z1) / 2;
      for (let ci = 0; ci <= ns.length; ci++) {
        const west = ns[ci - 1], east = ns[ci];
        const x0 = west ? west.at + widthAt(west, mid) / 2 : zone.bounds.x0, x1 = east ? east.at - widthAt(east, mid) / 2 : zone.bounds.x1;
        const b = { id: `${zone.id}:${ci}:${row.id}`, zone, row, ci, ri, x0, x1, z0: row.z0, z1: row.z1, seed: hash2(zone.seed, ci, ri), edge: !west || !east };
        blocks.push(b); put(blockBucket, (x0 + x1) / 2, mid, b);
        if (zone.split) zone.split(b, addLot, { rng, hash2, overlap }); else splitBlock(zone, b);
      }
    });
    for (const h of zone.hero) addLot({ ...h, id: `${zone.id}:${h.key || h.id}`, zone: zone.id, hero: h.id, recipe: 'hero', body: h, wall: h.body || 0xfdf6ea, seed: hash2(zone.seed, h.x0 | 0, 7), sides: { n: true, s: true, e: true, w: true } });
    for (const r of zone.reserved) addLot({ ...r, id: `${zone.id}:${r.id}`, zone: zone.id, reserved: r.id, recipe: 'reserved', body: null, h: 0, seed: 0, sides: {} });
  }
  // where a road of one district ends on the road of the next, the two dead ends become one joint
  const ends = new Map();
  for (const p of pieces) for (const [end, x, z] of [['a', p.ax, p.az], ['b', p.bx, p.bz]]) {
    if (p[end]) continue;
    const k = x + ',' + z, other = ends.get(k);
    if (!other) { ends.set(k, [p, end]); continue; }
    if (other[0].zone === p.zone || other[0].axis !== p.axis) continue;
    nodes.set(k, { key: k, x, z, pieces: [other[0], p], signal: false, half: { ns: 0, ew: 0 }, seam: true });
    other[0][other[1]] = k; p[end] = k;
    other[0].stub = !other[0].a || !other[0].b; p.stub = !p.a || !p.b;
  }
  for (const n of nodes.values()) {       // traffic lights where two big roads meet
    const kinds = new Set(n.pieces.map((p) => p.axis + (p.kind === 'street' ? '' : '!')));
    n.signal = kinds.has('ns!') && kinds.has('ew!');
  }

  function addLot(lot) { lots.push(lot); put(lotBucket, (lot.x0 + lot.x1) / 2, (lot.z0 + lot.z1) / 2, lot); return lot; }

  // Cut a block into lots: one or two rows of frontages, each given a kit recipe by the
  // neighbourhood's shares. Everything a later stage needs to agree on (footprint, height,
  // wall colour) is decided here, so the full building, its far shell and the skyline match.
  function splitBlock(zone, b) {
    if (b.edge || b.x1 - b.x0 < 30) return;
    if (zone.hero.some((h) => !h.beach && overlap(h, b)) || zone.reserved.some((r) => overlap(r, b))) return;
    const rnd = rng(b.seed), hood = zone.hoods.find((h) => (b.x0 + b.x1) / 2 < h.x1) || zone.hoods[zone.hoods.length - 1];
    const ix0 = b.x0 + 4, ix1 = b.x1 - 4, iz0 = b.z0 + 4, iz1 = b.z1 - 4, rowA = b.row.id === 'A';
    const bands = b.row.rows === 2 ? [[iz0, (iz0 + iz1) / 2, 'n'], [(iz0 + iz1) / 2, iz1, 's']] : [[iz0, iz1, 's']];
    let total = 0; for (const k in hood.shares) total += hood.shares[k];
    let n = 0;
    for (const [z0, z1, face] of bands) {
      let x = ix0;
      while (ix1 - x > 1) {
        let at = rnd() * total, id = 'T1';
        for (const k in hood.shares) { at -= hood.shares[k]; if (at < 0) { id = k; break; } }
        let kit = zone.kit[id];
        const left = ix1 - x;
        if ((rowA && !kit.rowA) || kit.w[0] > left) { id = 'T1'; kit = zone.kit.T1; }
        const lo = id === 'T1' ? hood.frontage[0] : kit.w[0], hi = id === 'T1' ? hood.frontage[1] : kit.w[1];
        let w = lo + rnd() * (hi - lo);
        if (left - w < 13) w = left;
        const lot = { id: `${b.id}:${n}`, zone: zone.id, hood: hood.id, block: b.id, recipe: id, kit, x0: x, x1: x + w, z0, z1, face,
          sides: { w: x === ix0, e: x + w >= ix1 - 0.01, n: face === 'n', s: face === 's' }, seed: hash2(b.seed, n, 0) };
        const r2 = rng(lot.seed), floors = kit.floors[0] + Math.floor(r2() * (kit.floors[1] - kit.floors[0] + 1));
        const walls = KIT_WALLS[id] || PASTEL;
        lot.floors = floors; lot.wall = walls[Math.floor(r2() * walls.length)];
        lot.h = id === 'empty' ? 0 : id === 'T1' || id === 'T3' ? 4.4 + 3.2 * (floors - 1) : id === 'T2' ? 6.6 : id === 'T5' ? 3.4 : 3.0;
        // the building's footprint inside the lot: against the street, a hair clear of its neighbours
        const d = Math.min(kit.d, z1 - z0), gw = lot.sides.w ? 0 : 0.1, ge = lot.sides.e ? 0 : 0.1;
        let bx0 = x + gw, bx1 = x + w - ge, set = 0;
        if (id === 'T4') { const c = x + w / 2; bx0 = c - 4; bx1 = c + 4; set = 1; }
        if (id === 'T5') { const c = x + w / 2; bx0 = c - 7; bx1 = c + 7; set = 2; }
        const depth = id === 'T4' ? 6 : id === 'T5' ? 10 : d;
        lot.body = id === 'empty' ? null : face === 's' ? { x0: bx0, x1: bx1, z0: z1 - set - depth, z1: z1 - set } : { x0: bx0, x1: bx1, z0: z0 + set, z1: z0 + set + depth };
        addLot(lot); n++; x += w;
      }
    }
  }

  const zoneAt = (x, z) => { for (const zn of zones) if (inRect(zn.bounds, x, z)) return zn; return null; };
  function blockAt(x, z) {
    const zn = zoneAt(x, z);
    if (!zn) return null;
    const row = zn.rows.find((r) => z >= r.z0 && z <= r.z1);
    if (!row) return null;
    let lo = 0, hi = zn.nsAt.length;           // the column: how many lines lie west of x
    while (lo < hi) { const m = (lo + hi) >> 1; if (zn.nsAt[m] < x) lo = m + 1; else hi = m; }
    const mid = (row.z0 + row.z1) / 2, west = zn.ns[lo - 1], east = zn.ns[lo];
    const x0 = west ? west.at + widthAt(west, mid) / 2 : zn.bounds.x0, x1 = east ? east.at - widthAt(east, mid) / 2 : zn.bounds.x1;
    return x >= x0 && x <= x1 ? { x0, x1, z0: row.z0, z1: row.z1 } : null;
  }
  const onPromenade = (x, z) => {
    const zn = zoneAt(x, z), p = zn && zn.promenade;
    return !!p && z >= p.z0 && z <= p.z1 && !p.gaps.some(([a, b]) => x > a && x < b);
  };
  function near(bucket, x, z, visit) {
    const cx = chunkX(x), cz = chunkZ(z);
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) { const list = bucket.get(key(cx + i, cz + j)); if (list) for (const it of list) visit(it); }
  }
  function nearestPiece(x, z) {
    let best = null, bd = Infinity, bx = 0, bz = 0;
    near(roadBucket, x, z, (p) => {
      const dx = p.bx - p.ax, dz = p.bz - p.az, t = Math.max(0, Math.min(1, ((x - p.ax) * dx + (z - p.az) * dz) / (p.len * p.len)));
      const qx = p.ax + dx * t, qz = p.az + dz * t, d = Math.hypot(qx - x, qz - z);
      if (d < bd) { bd = d; best = p; bx = qx; bz = qz; }
    });
    return best && { piece: best, x: bx, z: bz, d: bd };
  }

  const map = {
    chunk: CHUNK, world: WORLD, zones, pieces, nodes, blocks, lots, snapFailures: [],
    bounds: { x0: -1593, x1: 1593, z0: zones.reduce((m, z) => Math.min(m, z.bounds.z0), -320) + 6, z1: 84.5 },       // where the player can go today
    spawn: { x: -24, z: 40.5, h: Math.PI / 2 },
    chunkOf: (x, z) => ({ cx: chunkX(x), cz: chunkZ(z) }),
    chunkRect: (cx, cz) => ({ x0: WORLD.x0 + cx * CHUNK, x1: WORLD.x0 + (cx + 1) * CHUNK, z0: WORLD.z0 + cz * CHUNK, z1: WORLD.z0 + (cz + 1) * CHUNK }),
    inWorld: (cx, cz) => cx >= 0 && cx < 40 && cz >= 0 && cz < 30,
    chunkSeed: (cx, cz) => hash2(WORLD_SEED, cx, cz),
    zone: (id) => zones.find((z) => z.id === id) || null,
    zoneAt,
    districtAt: (x, z) => { const zn = zoneAt(x, z); return zn ? zn.id : null; },
    neighbourhoodAt(x, z) { const zn = zoneAt(x, z), h = zn && zn.hoods.find((hd) => x >= hd.x0 && x < hd.x1 && (hd.z0 === undefined || (z >= hd.z0 && z < hd.z1))); return h ? h.id : null; },
    isLand: (x, z) => inRect(WORLD, x, z) && z <= SHORE,
    depthAt: (x, z) => (z > SHORE ? Math.max(0, -map.heightAt(x, z)) : 0),
    // ground height: kerbs, the promenade, the beach sloping under the sea. level is for decks, later.
    heightAt(x, z) {
      if (z > 72) return 0.02 - (z - 72) / 28;
      if (z > 50) return 0.02;
      if (z >= 44) return onPromenade(x, z) ? CURB : 0;
      if (blockAt(x, z)) return CURB;
      const zn = zoneAt(x, z);              // a plaza paved over a closed street stands as high as the sidewalk
      return zn && zn.plazas && zn.plazas.some((r) => inRect(r, x, z)) ? CURB : 0;
    },
    surfaceAt(x, z) {
      if (z > SHORE) return 'water';
      if (z > 50) return 'sand';
      if (!zoneAt(x, z)) return 'dirt';
      return map.heightAt(x, z) > 0.05 ? 'sidewalk' : 'road';
    },
    blockAt,
    lotsInChunk: (cx, cz) => lotBucket.get(key(cx, cz)) || [],
    roadsInChunk: (cx, cz) => roadBucket.get(key(cx, cz)) || [],
    blocksInChunk: (cx, cz) => blockBucket.get(key(cx, cz)) || [],
    landmark(id) { for (const zn of zones) if (zn.landmarks[id]) return zn.landmarks[id]; return null; },
    places(kind) { const out = []; for (const zn of zones) for (const p of zn.places) if (!kind || p.kind === kind) out.push({ ...p, district: zn.id }); return out; },
    nearestRoad(x, z) {
      const n = nearestPiece(x, z);
      if (!n) return null;
      const p = n.piece;
      return { x: n.x, z: n.z, heading: Math.atan2(p.bx - p.ax, p.bz - p.az), roadId: p.roadId, name: p.name, kind: p.kind, width: p.width, d: n.d };
    },
    // the road under a point, or null
    roadAt(x, z) { const r = map.nearestRoad(x, z); return r && r.d <= r.width / 2 ? r : null; },
    // the nearest valid spot for a seed position (plan/bible/tech/algorithms.md section 11)
    snap(seed, need) {
      const { x, z } = seed;
      let out = null;
      if (need === 'road' || need === 'curb' || need === 'sidewalk') {
        const n = nearestPiece(x, z);
        if (n && (n.d <= 25 || need === 'road')) {
          const p = n.piece, off = need === 'road' ? 0 : p.width / 2 + (need === 'curb' ? -1.2 : 1.5);
          const side = p.axis === 'ns' ? (x >= p.ax ? 1 : -1) : (z >= p.az ? 1 : -1);
          out = p.axis === 'ns' ? { x: p.ax + side * off, z: n.z } : { x: n.x, z: p.az + side * off };
        }
      } else if (need === 'lot') {
        let bd = 25;
        near(lotBucket, x, z, (l) => {
          const qx = Math.max(l.x0, Math.min(x, l.x1)), qz = Math.max(l.z0, Math.min(z, l.z1)), d = Math.hypot(qx - x, qz - z);
          if (d < bd) { bd = d; out = { x: qx, z: qz }; }
        });
      } else if (need === 'sand') { if (z > 25 && z < 97) out = { x, z: Math.max(52, Math.min(z, 71)) }; }
      else if (need === 'water') { if (z > 61) out = { x, z: Math.max(86, z) }; }
      else out = { x, z };
      if (!out) map.snapFailures.push({ x, z, need });
      return out;
    },
  };
  return map;
}
