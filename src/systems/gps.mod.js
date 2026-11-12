// The waypoint and the way to it. One A* over the whole city's junctions (plan/bible/tech/
// algorithms.md section 6): nodes are junctions, an edge is a road piece costing length / speed
// limit, the heuristic is the straight line at 110 km/h, the open list is a binary heap of indices
// over typed arrays, and scores are reset by a generation counter. The graph is built once from the
// map, so a route can cross districts that are not loaded. The route is drawn by the minimap and
// the map screen, and here as faint chevrons on the road (one draw call).
// Public object: setWaypoint(x, z) · clear() · waypoint · route [{ x, z }] · distance (metres left)
//   · straight · stats. Emits waypoint:set { x, z } and waypoint:cleared { reached }.
import * as THREE from 'three';

const TOP = 110 / 3.6, OFF = 35, ARRIVE = 22, GAP = 14, AHEAD = 320, CHEVRONS = 24;

function createGraph(map) {
  const keys = [...map.nodes.keys()], index = new Map(keys.map((k, i) => [k, i])), N = keys.length;
  const X = new Float32Array(N + 1), Z = new Float32Array(N + 1);
  keys.forEach((k, i) => { const n = map.nodes.get(k); X[i] = n.x; Z[i] = n.z; });
  const edges = map.pieces.filter((p) => !p.stub && p.a && p.b && index.has(p.a) && index.has(p.b));
  const start = new Int32Array(N + 2), to = new Int32Array(edges.length * 2), cost = new Float32Array(edges.length * 2);
  for (const p of edges) { start[index.get(p.a) + 1]++; start[index.get(p.b) + 1]++; }
  for (let i = 0; i < N; i++) start[i + 1] += start[i];
  const fill = start.slice();
  for (const p of edges) {
    const a = index.get(p.a), b = index.get(p.b), c = p.len / p.speed;
    to[fill[a]] = b; cost[fill[a]++] = c; to[fill[b]] = a; cost[fill[b]++] = c;
  }
  const g = new Float32Array(N + 1), came = new Int32Array(N + 1), gen = new Uint32Array(N + 1), shut = new Uint32Array(N + 1);
  // the open list: a binary heap of node indices, each with the score it was pushed with
  const heap = new Int32Array(edges.length * 2 + 8), key = new Float32Array(heap.length);
  let run = 0, size = 0;
  const push = (i, k) => { let c = size++; while (c > 0) { const up = (c - 1) >> 1; if (key[up] <= k) break; heap[c] = heap[up]; key[c] = key[up]; c = up; } heap[c] = i; key[c] = k; };
  const pop = () => {
    const top = heap[0], li = heap[--size], lk = key[size];
    let c = 0;
    for (;;) { let k = c * 2 + 1; if (k >= size) break; if (k + 1 < size && key[k + 1] < key[k]) k++; if (key[k] >= lk) break; heap[c] = heap[k]; key[c] = key[k]; c = k; }
    heap[c] = li; key[c] = lk;
    return top;
  };
  // the road piece nearest a point, and the point on it: looks in rings of chunks, wider if it must
  function onRoad(x, z) {
    const c = map.chunkOf(x, z);
    let best = null, bd = Infinity;
    for (let r = 1; r <= 9 && !best; r += 2) {
      for (let i = -r; i <= r; i++) for (let j = -r; j <= r; j++) for (const p of map.roadsInChunk(c.cx + i, c.cz + j)) {
        if (p.stub || !index.has(p.a) || !index.has(p.b)) continue;
        const dx = p.bx - p.ax, dz = p.bz - p.az, t = Math.max(0, Math.min(1, ((x - p.ax) * dx + (z - p.az) * dz) / (p.len * p.len)));
        const qx = p.ax + dx * t, qz = p.az + dz * t, d = Math.hypot(qx - x, qz - z);
        if (d < bd) { bd = d; best = { p, x: qx, z: qz, t, d }; }
      }
    }
    return best;
  }
  return {
    nodes: N, edges: edges.length, onRoad, expanded: 0,
    // the fastest way by road from one point to another: [{ x, z }], or null if there is none
    find(from, goal) {
      const A = onRoad(from.x, from.z), B = onRoad(goal.x, goal.z);
      if (!A || !B) return null;
      const out = [{ x: A.x, z: A.z }], end = [{ x: B.x, z: B.z }, { x: goal.x, z: goal.z }];
      if (A.p === B.p) return out.concat(end);
      const G = N, ga = index.get(B.p.a), gb = index.get(B.p.b);
      X[G] = B.x; Z[G] = B.z;
      const h = (i) => Math.hypot(X[i] - X[G], Z[i] - Z[G]) / TOP;
      run++; size = 0; this.expanded = 0;
      const seed = (i, c) => { g[i] = c; came[i] = -1; gen[i] = run; push(i, c + h(i)); };
      seed(index.get(A.p.a), A.t * A.p.len / A.p.speed); seed(index.get(A.p.b), (1 - A.t) * A.p.len / A.p.speed);
      const relax = (u, v, c) => { const s = g[u] + c; if (gen[v] !== run || s < g[v]) { g[v] = s; came[v] = u; gen[v] = run; push(v, s + (v === G ? 0 : h(v))); } };
      let found = false;
      while (size) {
        const u = pop();
        if (shut[u] === run) continue;
        shut[u] = run; this.expanded++;
        if (u === G) { found = true; break; }
        if (u === ga) relax(u, G, B.t * B.p.len / B.p.speed);
        if (u === gb) relax(u, G, (1 - B.t) * B.p.len / B.p.speed);
        for (let e = start[u]; e < start[u + 1]; e++) if (shut[to[e]] !== run) relax(u, to[e], cost[e]);
      }
      if (!found) return null;
      const mid = [];
      for (let i = came[G]; i >= 0; i = came[i]) mid.push({ x: X[i], z: Z[i] });
      return out.concat(mid.reverse(), end);
    },
  };
}

let gps, tick = () => {};
export default {
  name: 'gps', order: 46, needs: ['map'],
  init(ctx) {
    const S = ctx.state, map = ctx.modules.map, graph = createGraph(map);
    const stats = { routes: 0, reroutes: 0, ms: 0, nodes: graph.nodes, edges: graph.edges, expanded: 0, chevrons: 0 };
    let waypoint = null, route = null, left = 0, at = { x: 0, z: 0 }, clock = 0, since = 9;

    // chevrons on the road: flat V shapes that point along the route
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 1.5, -1.5, 0, 0, -1.5, 0, -0.9, 0, 0, 0.6, 1.5, 0, 0, 1.5, 0, -0.9], 3));
    geo.setIndex([0, 1, 2, 0, 2, 3, 0, 3, 5, 0, 5, 4]);
    const mesh = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: 0x29e6ff, transparent: true, opacity: 0.34, depthWrite: false, side: THREE.DoubleSide,
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), CHEVRONS);
    mesh.frustumCulled = false; mesh.count = 0; mesh.visible = false; mesh.renderOrder = 2;
    ctx.scene.add(mesh);
    const mat = new THREE.Matrix4(), pos = new THREE.Vector3(), quat = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1), up = new THREE.Vector3(0, 1, 0);

    const length = (r) => { let d = 0; for (let i = 1; i < r.length; i++) d += Math.hypot(r[i].x - r[i - 1].x, r[i].z - r[i - 1].z); return d; };
    function chevrons() {
      let n = 0;
      if (route) {
        // spaced by the distance still to go, so they lie still on the road as the car passes over them
        let next = left % GAP + 6, walked = 0;
        for (let i = 1; i < route.length - 1 && n < CHEVRONS && walked < AHEAD; i++) {
          const a = route[i - 1], b = route[i], len = Math.hypot(b.x - a.x, b.z - a.z);
          if (len < 0.01) continue;
          const h = Math.atan2(b.x - a.x, b.z - a.z);
          for (; next <= walked + len && n < CHEVRONS && next < AHEAD; next += GAP) {
            const t = (next - walked) / len, x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t;
            mesh.setMatrixAt(n++, mat.compose(pos.set(x, map.heightAt(x, z) + 0.07, z), quat.setFromAxisAngle(up, h), one));
          }
          walked += len;
        }
      }
      mesh.count = stats.chevrons = n; mesh.visible = n > 0;
      mesh.instanceMatrix.needsUpdate = true;
    }
    function solve(again) {
      const t0 = performance.now(), p = S.player;
      route = graph.find(p, waypoint) || [{ x: p.x, z: p.z }, { ...waypoint }];
      left = length(route); at = { x: p.x, z: p.z }; since = 0;
      stats.ms = performance.now() - t0; stats.expanded = graph.expanded; stats.routes++; if (again) stats.reroutes++;
      chevrons();
    }
    // where the player is along the route: drop what is behind them, and say how far off they are
    function follow() {
      const p = S.player;
      let bi = 0, bd = Infinity, bx = 0, bz = 0;
      for (let i = 0; i < route.length - 1; i++) {
        const a = route[i], b = route[i + 1], dx = b.x - a.x, dz = b.z - a.z, l2 = dx * dx + dz * dz;
        const t = l2 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / l2)) : 0;
        const d = Math.hypot(a.x + dx * t - p.x, a.z + dz * t - p.z);
        if (d < bd - 0.01) { bd = d; bi = i; bx = a.x + dx * t; bz = a.z + dz * t; }
      }
      if (bd <= OFF) { route.splice(0, bi + 1, { x: bx, z: bz }); left = length(route); chevrons(); }
      return bd;
    }

    gps = {
      stats,
      get waypoint() { return waypoint; },
      get route() { return route; },
      get distance() { return waypoint ? left : 0; },
      get straight() { return waypoint ? Math.hypot(waypoint.x - S.player.x, waypoint.z - S.player.z) : 0; },
      setWaypoint(x, z) {
        if (!Number.isFinite(x) || !Number.isFinite(z)) return false;
        waypoint = { x, z };
        solve(false);
        const mm = ctx.modules.minimap;
        if (mm) mm.addBlip({ id: 'waypoint', x, z, icon: 'waypoint', colour: '#ff4fa8', label: 'Waypoint' });
        ctx.events.emit('waypoint:set', { x, z });
        return true;
      },
      clear(reached = false) {
        if (!waypoint) return;
        waypoint = null; route = null; left = 0; chevrons();
        const mm = ctx.modules.minimap;
        if (mm) mm.removeBlip('waypoint');
        ctx.events.emit('waypoint:cleared', { reached });
      },
    };
    tick = (dt) => {
      if (!waypoint) return;
      clock += dt; since += dt;
      if (clock < 0.25) return;
      clock = 0;
      const p = S.player;
      // there: beside the waypoint, or at the end of the road to it when it is inside a block
      const end = route[route.length - 2];
      if (Math.hypot(waypoint.x - p.x, waypoint.z - p.z) < ARRIVE || Math.hypot(end.x - p.x, end.z - p.z) < 10) { gps.clear(true); ctx.events.emit('ui:toast', { text: 'You have arrived', seconds: 3, tone: 'gain' }); return; }
      // off the route by more than 35 m: find a new one, once a second at most and only after moving
      if (follow() > OFF && since >= 1 && Math.hypot(p.x - at.x, p.z - at.z) > 12) solve(true);
    };
    ctx.test.gps = () => ({ waypoint: waypoint && { ...waypoint }, distance: gps.distance, straight: gps.straight, points: route ? route.length : 0,
      route: route ? route.map((q) => [Math.round(q.x), Math.round(q.z)]) : null, ...stats });
    ctx.test.waypoint = (x, z) => (x === undefined ? gps.clear() : gps.setWaypoint(x, z));
    return gps;
  },
  update(dt) { tick(dt); },
};
