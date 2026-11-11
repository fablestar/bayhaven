// Traffic lights. Every junction where two big roads cross runs a 30 second cycle: the bigger road
// gets the longer green, then amber, then a moment with every light red, then the other road
// (plan/bible/systems/traffic.md, "Signals"). The phase is worked out from the game clock and
// the junction's place, so nothing is stored and everyone agrees. This file also stands a pole
// with three lamps at each stop line near the player: two draw calls for all of them.
import * as THREE from 'three';

export const CYCLE = 30;
const RANK = { street: 0, avenue: 1, boulevard: 2 };
// green seconds for [the bigger road, the other road]; each is followed by 2 s amber and 1 s all red
const GREENS = { '1,1': [12, 12], '2,2': [12, 12], '2,1': [15, 9], '1,0': [17, 7], '2,0': [17, 7] };
const LIT = { red: [1.7, 0.16, 0.12], amber: [1.7, 0.95, 0.1], green: [0.15, 1.6, 0.55] };
const ORDER = ['red', 'amber', 'green'];
const MAX_ARMS = 96, NEAR = 230;

export function createSignals({ nav, scene, events, collide }) {
  const plans = new Map();
  for (const n of nav.nodes.values()) {
    if (!n.signal) continue;
    const rank = { ns: 0, ew: 0 };
    for (const l of n.in) if (l.signal) rank[l.signal.axis] = Math.max(rank[l.signal.axis], RANK[l.kind] || 0);
    const big = rank.ew > rank.ns ? 'ew' : 'ns', hi = Math.max(rank.ns, rank.ew), lo = Math.min(rank.ns, rank.ew);
    const [g1, g2] = GREENS[hi + ',' + lo] || [12, 12];
    // a 50 km/h green wave out from the plaza
    plans.set(n.key, { node: n, big, g1, g2, offset: ((Math.abs(n.x) + Math.abs(n.z)) / 13.9) % CYCLE, last: '' });
  }

  const out = { ns: 'red', ew: 'red' };
  function phase(plan, t) {
    const p = (((t + plan.offset) % CYCLE) + CYCLE) % CYCLE, other = plan.big === 'ns' ? 'ew' : 'ns', b = plan.g1 + 3;
    out[plan.big] = p < plan.g1 ? 'green' : p < plan.g1 + 2 ? 'amber' : 'red';
    out[other] = p < b ? 'red' : p < b + plan.g2 ? 'green' : p < b + plan.g2 + 2 ? 'amber' : 'red';
    return out;
  }

  // ---- the lamps ----
  const box = new THREE.BoxGeometry(1, 1, 1);
  const poles = new THREE.InstancedMesh(box, new THREE.MeshLambertMaterial({ color: 0x2b2838 }), MAX_ARMS * 2);
  const lamps = new THREE.InstancedMesh(box, new THREE.MeshBasicMaterial({ color: 0xffffff }), MAX_ARMS * 3);
  poles.frustumCulled = lamps.frustumCulled = false; poles.count = lamps.count = 0;
  const col = new THREE.Color(), m4 = new THREE.Matrix4();
  for (let i = 0; i < MAX_ARMS * 3; i++) lamps.setColorAt(i, col.setRGB(0, 0, 0));
  scene.add(poles, lamps);
  let shown = [], arms = [], builtAt = null;

  function place(mesh, i, x, y, z, sx, sy, sz) { m4.makeScale(sx, sy, sz).setPosition(x, y, z); mesh.setMatrixAt(i, m4); }
  // stand poles at the junctions near (px, pz): one per road arm, on the kerb beside the stop line
  function rebuild(px, pz) {
    for (const p of shown) collide.removeOwner('signal:' + p.node.key);
    shown = []; arms = [];
    for (const p of plans.values()) if (Math.hypot(p.node.x - px, p.node.z - pz) < NEAR) shown.push(p);
    shown.sort((a, b) => Math.hypot(a.node.x - px, a.node.z - pz) - Math.hypot(b.node.x - px, b.node.z - pz));
    for (const p of shown) {
      for (const l of p.node.in) {
        if (l.index !== l.of - 1 || arms.length >= MAX_ARMS) continue;
        const fx = Math.sin(l.heading), fz = Math.cos(l.heading), rx = -fz, rz = fx;
        const laneOff = Math.abs((l.bx - p.node.x) * rx + (l.bz - p.node.z) * rz), half = l.piece ? l.piece.width / 2 : laneOff + 3.5;
        const x = l.bx + rx * (half - laneOff + 0.9), z = l.bz + rz * (half - laneOff + 0.9), i = arms.length;
        place(poles, i * 2, x, 1.6, z, 0.14, 3.2, 0.14);
        place(poles, i * 2 + 1, x, 3.75, z, 0.36, 1.1, 0.36);
        for (let k = 0; k < 3; k++) place(lamps, i * 3 + k, x - fx * 0.12, 4.1 - k * 0.35, z - fz * 0.12, 0.26, 0.26, 0.26);
        collide.add('signal:' + p.node.key, { x0: x - 0.15, x1: x + 0.15, z0: z - 0.15, z1: z + 0.15, h: 4.3 });
        arms.push({ plan: p, axis: l.signal.axis, was: '' });
      }
    }
    poles.count = arms.length * 2; lamps.count = arms.length * 3;
    poles.instanceMatrix.needsUpdate = lamps.instanceMatrix.needsUpdate = true;
    builtAt = { x: px, z: pz };
  }

  const signals = {
    cycle: CYCLE, time: 0, count: plans.size,
    get poles() { return arms.length; },
    // the light a lane faces at its far end: 'green', 'amber' or 'red' (always green with no light there)
    state(lane, t = signals.time) {
      const plan = lane.signal && plans.get(lane.signal.id);
      return plan ? phase(plan, t)[lane.signal.axis] : 'green';
    },
    phase(key, t = signals.time) { const plan = plans.get(key); return plan ? { ...phase(plan, t) } : null; },
    // the nearest lit junction to a point and what it shows
    at(x, z) {
      let best = null, bd = Infinity;
      for (const p of plans.values()) { const d = Math.hypot(p.node.x - x, p.node.z - z); if (d < bd) { bd = d; best = p; } }
      return best ? { node: best.node.key, x: best.node.x, z: best.node.z, distance: bd, big: best.big, time: signals.time, ...phase(best, signals.time) } : null;
    },
    update(t, px, pz) {
      signals.time = t;
      if (!builtAt || Math.hypot(px - builtAt.x, pz - builtAt.z) > 40) rebuild(px, pz);
      for (const p of shown) {
        const ph = phase(p, t), tag = ph.ns + '/' + ph.ew;
        if (tag !== p.last) { p.last = tag; events.emit('signals:phase', { node: p.node.key, phase: tag, ns: ph.ns, ew: ph.ew }); }
      }
      let dirty = false;
      for (let i = 0; i < arms.length; i++) {
        const a = arms[i], now = phase(a.plan, t)[a.axis];
        if (now === a.was) continue;
        a.was = now; dirty = true;
        for (let k = 0; k < 3; k++) { const c = LIT[ORDER[k]], on = ORDER[k] === now ? 1 : 0.1; lamps.setColorAt(i * 3 + k, col.setRGB(c[0] * on, c[1] * on, c[2] * on)); }
      }
      if (dirty) lamps.instanceColor.needsUpdate = true;
    },
    reset() { builtAt = null; },
  };
  return signals;
}
