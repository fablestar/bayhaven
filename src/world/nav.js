// STAND-IN: replace with the nav contract in plan/bible/tech/contracts.md when streaming ships.
// Day 1's four streets as a small lane graph: one lane each way, driving on the right,
// 3.5 m off the centre line. No walking edges yet. No three.js in here.
//   Heron Walk Drive (z = 37), Seagrape Street (z = -37), Plaza Street (x = -52), Coral Boulevard (x = 52)

const OFFSET = 3.5, SPEED = 13.9, CHUNK = 160;
const XS = [-90, -52, 52, 90], ZS = [-85, -37, 37];
export const STREETS = [
  { id: 'heron-walk-drive', name: 'Heron Walk Drive', kind: 'boulevard', z: 37 },
  { id: 'seagrape-street', name: 'Seagrape Street', kind: 'street', z: -37 },
  { id: 'plaza-street', name: 'Plaza Street', kind: 'street', x: -52 },
  { id: 'coral-blvd', name: 'Coral Boulevard', kind: 'boulevard', x: 52 },
];
const angle = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export function createNav() {
  const lanes = [], byId = new Map(), nodes = new Map();
  const node = (x, z) => {
    const key = x + ',' + z;
    if (!nodes.has(key)) nodes.set(key, { key, x, z, out: [] });
    return nodes.get(key);
  };
  function lane(street, a, b) {
    const dx = b.x - a.x, dz = b.z - a.z, len = Math.hypot(dx, dz), fx = dx / len, fz = dz / len;
    const ox = -fz * OFFSET, oz = fx * OFFSET;        // to the right of the way it runs
    const l = { id: `${street.id}:${a.key}>${b.key}`, roadId: street.id, name: street.name, kind: street.kind,
      ax: a.x + ox, az: a.z + oz, bx: b.x + ox, bz: b.z + oz, len, heading: Math.atan2(fx, fz),
      speed: SPEED, level: 0, next: [], signal: null, left: null, right: null, from: a, to: b };
    lanes.push(l); byId.set(l.id, l); a.out.push(l);
  }
  for (const s of STREETS) {
    const along = s.z !== undefined ? XS.map((x) => node(x, s.z)) : ZS.map((z) => node(s.x, z));
    for (let i = 0; i < along.length - 1; i++) { lane(s, along[i], along[i + 1]); lane(s, along[i + 1], along[i]); }
  }
  // where a lane leads: every lane leaving its end, but back the way it came only at a dead end
  for (const l of lanes) {
    const on = l.to.out.filter((o) => o.to !== l.from);
    l.next = (on.length ? on : l.to.out).map((o) => o.id);
  }

  function nearestNode(x, z) {
    let best = null, bd = Infinity;
    for (const n of nodes.values()) { const d = Math.hypot(n.x - x, n.z - z); if (d < bd) { bd = d; best = n; } }
    return best;
  }
  const nav = {
    lanes, streets: STREETS,
    lane: (id) => byId.get(id) || null,
    // the lane nearest a point; give a heading to prefer lanes that run that way
    laneNear(x, z, heading) {
      let best = null, bd = Infinity;
      for (const l of lanes) {
        const dx = l.bx - l.ax, dz = l.bz - l.az;
        const t = Math.max(0, Math.min(1, ((x - l.ax) * dx + (z - l.az) * dz) / (l.len * l.len)));
        let d = Math.hypot(l.ax + dx * t - x, l.az + dz * t - z);
        if (heading !== undefined && Math.abs(angle(l.heading - heading)) > Math.PI / 2) d += 20;
        if (d < bd) { bd = d; best = l; }
      }
      return best;
    },
    next(l, r = Math.random) { return byId.get(l.next[Math.floor(r() * l.next.length)]) || null; },
    lanesInChunk(cx, cz) {
      return lanes.filter((l) => Math.floor((l.ax + l.bx) / 2 / CHUNK) === cx && Math.floor((l.az + l.bz) / 2 / CHUNK) === cz);
    },
    walkNear: () => null, walkNext: () => null, crossings: () => [],
    // A line of points to drive from one place to another: along the right-hand lanes, pulled
    // 9 m short of each junction so the corners come out round. opts.avoid is a list of road ids.
    route(from, to, opts = {}) {
      const avoid = opts.avoid || [];
      const start = nearestNode(from.x, from.z), goal = nearestNode(to.x, to.z);
      const dist = new Map([[start, 0]]), came = new Map(), open = [start];
      while (open.length) {
        open.sort((a, b) => dist.get(a) + Math.hypot(a.x - goal.x, a.z - goal.z) - dist.get(b) - Math.hypot(b.x - goal.x, b.z - goal.z));
        const n = open.shift();
        if (n === goal) break;
        for (const l of n.out) {
          if (avoid.includes(l.roadId)) continue;
          const d = dist.get(n) + l.len;
          if (d < (dist.has(l.to) ? dist.get(l.to) : Infinity)) { dist.set(l.to, d); came.set(l.to, l); if (!open.includes(l.to)) open.push(l.to); }
        }
      }
      const path = [];
      for (let n = goal; came.has(n); n = came.get(n).from) path.unshift(came.get(n));
      const out = [];
      for (const l of path) {
        const fx = Math.sin(l.heading), fz = Math.cos(l.heading), cut = Math.min(9, l.len / 3);
        const ax = l.ax + fx * cut, az = l.az + fz * cut;
        // a start part-way down the first lane: do not send the car back to the lane's beginning
        if (l !== path[0] || (from.x - ax) * fx + (from.z - az) * fz < 0) out.push({ x: ax, z: az });
        out.push({ x: l.bx - fx * cut, z: l.bz - fz * cut });
      }
      out.push({ x: to.x, z: to.z });
      return out;
    },
  };
  return nav;
}
