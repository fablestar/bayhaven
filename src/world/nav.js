// The lane graph and the sidewalks, made from the map's road pieces (plan/bible/tech/algorithms.md
// section 4). Driving is on the right. A lane stops short of each junction; `next` lists the lanes a
// car may take from its end. Pure data, no three.js. Built once for the whole map (it is a few
// thousand numbers) and indexed by chunk, so a lookup never loops over every lane.
import { CHUNK } from './map.js';

const angle = (a) => Math.atan2(Math.sin(a), Math.cos(a));
// lane centre offsets from the road's centre line, innermost first (plan/bible/art/kits.md, "Lanes")
const OFFSETS = { 1: [3.5], 2: [2.9, 6.7], 3: [3.8, 7.4, 11.0] };

export function createNav(map) {
  const lanes = [], byId = new Map(), nodes = new Map(), laneBucket = new Map(), walks = [], walkBucket = new Map();
  const ckey = (x, z) => { const c = map.chunkOf(x, z); return c.cx + c.cz * 64; };
  const put = (bucket, x, z, item) => { const k = ckey(x, z); if (!bucket.has(k)) bucket.set(k, []); bucket.get(k).push(item); };
  const node = (k) => {
    if (!nodes.has(k)) { const m = map.nodes.get(k); nodes.set(k, { key: k, x: m.x, z: m.z, half: m.free ? { ns: 0, ew: 0 } : m.half, signal: m.signal, free: !!m.free, pieces: m.pieces.length, out: [], in: [], corners: {} }); }
    return nodes.get(k);
  };
  const streets = [];
  for (const zn of map.zones) for (const l of zn.roads.lines) streets.push({ id: l.id, name: l.name, kind: l.kind, [l.axis === 'ns' ? 'x' : 'z']: l.at });

  for (const p of map.pieces) {
    if (p.stub) continue;                          // a dead-end stub behind a barrier carries no traffic
    const A = node(p.a), B = node(p.b);
    for (const [from, to] of [[A, B], [B, A]]) {
      const dx = to.x - from.x, dz = to.z - from.z, full = Math.hypot(dx, dz), fx = dx / full, fz = dz / full;
      // stop width / 2 + 2 short of each junction centre (the crossing road's half width)
      // a free piece (decks.js, a suburb lane) runs joint to joint: it stops short only where roads meet
      const cross = p.axis === 'ns' ? 'ew' : 'ns', trim = (n) => (n.free ? (p.free ? (n.pieces > 2 ? Math.min(6, p.len / 3) : 0) : 2) : (p.free ? Math.min(Math.max(n.half.ns, n.half.ew) + 2, p.len / 3) : n.half[cross] + 2));
      const ta = trim(from), tb = trim(to);
      if (p.oneWay && from !== A) continue;
      const signal = to.signal ? { id: to.key, axis: p.axis, offset: (Math.abs(to.x * 31 + to.z * 17) | 0) % 30 } : null;
      (p.offsets || OFFSETS[p.lanes]).forEach((off, i) => {
        const ox = -fz * off, oz = fx * off;       // to the right of the way it runs
        const l = { id: `${p.roadId}:${from.key}>${to.key}${i ? '#' + i : ''}`, roadId: p.roadId, name: p.name, kind: p.kind, index: i, of: p.lanes,
          ax: from.x + ox + fx * ta, az: from.z + oz + fz * ta, bx: to.x + ox - fx * tb, bz: to.z + oz - fz * tb,
          len: full - ta - tb, heading: Math.atan2(fx, fz), speed: p.speed, level: p.level || 0, next: [], signal, left: null, right: null, from, to, piece: p };
        lanes.push(l); byId.set(l.id, l); from.out.push(l); to.in.push(l);
        put(laneBucket, (l.ax + l.bx) / 2, (l.az + l.bz) / 2, l);
      });
    }
    // a free piece on the ground has a verge to walk on each side; they join end to end. Decks and ramps have none.
    if (p.free) {
      if (p.level || p.kind === 'street') continue;
      const nx = -(p.bz - p.az) / p.len, nz = (p.bx - p.ax) / p.len;
      for (const side of [-1, 1]) {
        const off = side * (p.width / 2 + 1.5);
        const w = { id: `${p.id}:${side > 0 ? 'r' : 'l'}`, kind: 'walk', roadId: p.roadId, ax: p.ax + nx * off, az: p.az + nz * off, bx: p.bx + nx * off, bz: p.bz + nz * off, len: p.len, next: [], crossing: false };
        (A.corners['f' + side] ||= []).push(w); (B.corners['f' + side] ||= []).push(w);
        walks.push(w); put(walkBucket, (w.ax + w.bx) / 2, (w.az + w.bz) / 2, w);
      }
      continue;
    }
    // sidewalks: one walking edge each side, width / 2 + 1.5 from the centre line
    for (const side of [-1, 1]) {
      const off = side * (p.width / 2 + 1.5), nsP = p.axis === 'ns';
      const w = { id: `${p.id}:${side > 0 ? 'r' : 'l'}`, kind: 'walk', roadId: p.roadId, ax: p.ax + (nsP ? off : A.half.ns + 1.5), az: p.az + (nsP ? A.half.ew + 1.5 : off),
        bx: p.bx - (nsP ? -off : B.half.ns + 1.5), bz: p.bz - (nsP ? B.half.ew + 1.5 : -off), next: [], crossing: false };
      w.len = Math.hypot(w.bx - w.ax, w.bz - w.az);
      // which corner of each junction it ends on: 'ne', 'nw', 'se', 'sw' of the node
      const corner = (n, end) => (nsP ? (end === 'a' ? 's' : 'n') + (side > 0 ? 'e' : 'w') : (side > 0 ? 's' : 'n') + (end === 'a' ? 'e' : 'w'));
      for (const [n, end] of [[A, 'a'], [B, 'b']]) { const c = corner(n, end); (n.corners[c] ||= []).push(w); }
      walks.push(w); put(walkBucket, (w.ax + w.bx) / 2, (w.az + w.bz) / 2, w);
    }
  }
  // where a lane leads: straight on from any lane, right from the outside lane, left from the
  // inside lane; back the way it came only at a dead end
  for (const l of lanes) {
    const on = [];
    for (const o of l.to.out) {
      if (o.to === l.from) continue;
      const turn = angle(o.heading - l.heading);
      if (Math.abs(turn) < 0.3) { if (o.index === Math.min(l.index, o.of - 1)) on.push(o.id); }
      else if (turn < 0) { if (l.index === l.of - 1 && o.index === o.of - 1) on.push(o.id); }        // right turn (heading falls)
      else if (l.index === 0 && o.index === 0) on.push(o.id);                                         // left turn
    }
    if (!on.length) for (const o of l.to.out) if (o.to !== l.from && o.index === 0) on.push(o.id);
    if (!on.length) for (const o of l.to.out) if (o.index === 0) on.push(o.id);
    l.next = on;
    const sib = l.from.out.filter((o) => o.to === l.to);
    l.left = l.index > 0 ? sib[l.index - 1].id : null; l.right = l.index < l.of - 1 ? sib[l.index + 1].id : null;
  }
  // crossings: at a junction, the two corners either side of an arm are joined across it
  for (const n of nodes.values()) {
    const at = { ne: [n.half.ns + 1.5, -n.half.ew - 1.5], nw: [-n.half.ns - 1.5, -n.half.ew - 1.5], se: [n.half.ns + 1.5, n.half.ew + 1.5], sw: [-n.half.ns - 1.5, n.half.ew + 1.5] };
    for (const [a, b] of [['nw', 'ne'], ['sw', 'se'], ['nw', 'sw'], ['ne', 'se']]) {
      if (n.free || (!n.corners[a] && !n.corners[b])) continue;
      const w = { id: `x:${n.key}:${a}${b}`, kind: 'crossing', node: n.key, signal: n.signal, ax: n.x + at[a][0], az: n.z + at[a][1], bx: n.x + at[b][0], bz: n.z + at[b][1], next: [], crossing: true };
      w.len = Math.hypot(w.bx - w.ax, w.bz - w.az);
      (n.corners[a] ||= []).push(w); (n.corners[b] ||= []).push(w);
      walks.push(w); put(walkBucket, (w.ax + w.bx) / 2, (w.az + w.bz) / 2, w);
    }
    for (const c in n.corners) for (const w of n.corners[c]) for (const o of n.corners[c]) if (o !== w) w.next.push(o);
  }

  function nearIn(bucket, x, z, score) {
    const c = map.chunkOf(x, z);
    let best = null, bd = Infinity;
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
      const list = bucket.get(c.cx + i + (c.cz + j) * 64);
      if (!list) continue;
      for (const l of list) {
        const dx = l.bx - l.ax, dz = l.bz - l.az;
        const t = Math.max(0, Math.min(1, ((x - l.ax) * dx + (z - l.az) * dz) / (l.len * l.len)));
        const d = Math.hypot(l.ax + dx * t - x, l.az + dz * t - z) + score(l);
        if (d < bd) { bd = d; best = l; }
      }
    }
    return best;
  }
  function nearestNode(x, z) {
    const l = nav.laneNear(x, z);
    if (l) return Math.hypot(l.from.x - x, l.from.z - z) < Math.hypot(l.to.x - x, l.to.z - z) ? l.from : l.to;
    let best = null, bd = Infinity;
    for (const n of nodes.values()) { const d = Math.hypot(n.x - x, n.z - z); if (d < bd) { bd = d; best = n; } }
    return best;
  }

  const nav = {
    lanes, streets, walks, nodes, chunk: CHUNK,
    lane: (id) => byId.get(id) || null,
    // the lane nearest a point; give a heading to prefer lanes that run that way
    laneNear: (x, z, heading) => nearIn(laneBucket, x, z, (l) => (heading !== undefined && Math.abs(angle(l.heading - heading)) > Math.PI / 2 ? 20 : 0)),
    next(l, r = Math.random) { return byId.get(l.next[Math.floor(r() * l.next.length)]) || null; },
    lanesInChunk: (cx, cz) => laneBucket.get(cx + cz * 64) || [],
    // is a lane's light green? Two phases of 15 s, in step for everyone (clock seconds in)
    green(l, seconds) { return !l.signal || (Math.floor((seconds + l.signal.offset) / 15) % 2 === 0) === (l.signal.axis === 'ns'); },
    walkNear: (x, z) => nearIn(walkBucket, x, z, (w) => (w.crossing ? 3 : 0)),
    walkNext(edge, r = Math.random) { return edge.next.length ? edge.next[Math.floor(r() * edge.next.length)] : null; },
    crossings: (edge) => edge.next.filter((w) => w.crossing),
    walksInChunk: (cx, cz) => walkBucket.get(cx + cz * 64) || [],
    // A line of points to drive from one place to another, along the lanes (A* over junctions).
    // opts.avoid is a list of road ids.
    route(from, to, opts = {}) {
      const avoid = opts.avoid || [];
      const start = nearestNode(from.x, from.z), goal = nearestNode(to.x, to.z);
      if (!start || !goal) return [{ x: to.x, z: to.z }];
      const dist = new Map([[start, 0]]), came = new Map(), open = [start], h = (n) => Math.hypot(n.x - goal.x, n.z - goal.z);
      while (open.length) {
        let bi = 0; for (let i = 1; i < open.length; i++) if (dist.get(open[i]) + h(open[i]) < dist.get(open[bi]) + h(open[bi])) bi = i;
        const n = open.splice(bi, 1)[0];
        if (n === goal) break;
        for (const l of n.out) {
          if (l.index !== l.of - 1 || avoid.includes(l.roadId)) continue;       // one edge per piece: its outside lane
          const d = dist.get(n) + l.len + 20;
          if (d < (dist.has(l.to) ? dist.get(l.to) : Infinity)) { dist.set(l.to, d); came.set(l.to, l); if (!open.includes(l.to)) open.push(l.to); }
        }
      }
      const path = [];
      for (let n = goal; came.has(n); n = came.get(n).from) path.unshift(came.get(n));
      const out = [];
      for (const l of path) {
        const fx = Math.sin(l.heading), fz = Math.cos(l.heading);
        // a start part-way down the first lane: do not send the car back to the lane's beginning
        if (l !== path[0] || (from.x - l.ax) * fx + (from.z - l.az) * fz < 0) out.push({ x: l.ax, z: l.az });
        out.push({ x: l.bx, z: l.bz });
      }
      out.push({ x: to.x, z: to.z });
      return out;
    },
  };
  return nav;
}
