// Roadblocks and spike strips (plan/bible/systems/heat.md, "Roadblocks and spike strips").
// Every 2 s at heat 4 or more the player's road is followed straight on to the second junction ahead;
// if that is an avenue or bigger, 160 to 400 m off and out of the camera's view, two units are stood
// nose to nose 20 m before it with a 3.2 m gap at one kerb (barriers fill what two vehicles cannot),
// and a spike strip 0.6 m deep is laid 25 m in front, across the lanes but not the gap.
// A tyre that crosses the strip above 10 km/h bursts: that axle keeps 0.3 of its grip on that corner.
// No three.js in here.

export const BLOCK = { every: 2, min: 160, max: 400, far: 220, before: 20, gap: 3.2, angle: Math.PI / 6, stripAt: 25, stripLen: 7, stripWide: 0.6,
  burstAbove: 10 / 3.6, grip: 0.3, life: 40, offRoute: 6, next: [0, 0, 0, 0, 12, 6], limit: [0, 0, 0, 0, 1, 2], through: 0.08 };
const BIG = { avenue: true, boulevard: true };

export function createRoadblocks({ S, ev, m, cops, quality }) {
  const nav = m.nav, map = m.map, blocks = [], stats = { placed: 0, lifted: 0, bursts: 0, through: 0, tries: 0, why: '' };
  const wheel = { x: 0, z: 0 };
  let thinkT = 0, waitT = 0, sparkT = 0;

  // the lane graph from the player's lane, straight on at each node: [{ key, lane, metres }]
  function predict() {
    const p = S.player, car = m.vehicles.player;
    if (p.mode === 'foot' || Math.abs(car.vf) < 6) return null;
    let lane = nav.laneNear(p.x, p.z, p.h);
    if (!lane || Math.cos(lane.heading - p.h) < 0.7) return null;
    const out = [];
    for (let i = 0; i < 8; i++) {
      const to = lane.to;
      out.push({ key: to.key, x: to.x, z: to.z, lane, metres: Math.hypot(to.x - p.x, to.z - p.z) });
      let best = null, bc = 0.6;
      for (const id of lane.next || []) { const n = nav.lane(id); if (n) { const c = Math.cos(n.heading - lane.heading); if (c > bc) { bc = c; best = n; } } }
      if (!best) break;
      lane = best;
    }
    return out;
  }

  function place(node) {
    const lane = node.lane, h = lane.heading, fx = Math.sin(h), fz = Math.cos(h), ax = fz, az = -fx;      // a: across the road, to the driver's left
    const pc = lane.piece, road = { kind: lane.kind, name: lane.name, width: (pc && pc.width) || 22 };
    if (!BIG[lane.kind] || !pc) { stats.why = 'not an avenue'; return null; }
    // 20 m before the junction, on the road's centre line
    const jx = node.x - fx * BLOCK.before, jz = node.z - fz * BLOCK.before, px = pc.bx - pc.ax, pz = pc.bz - pc.az, pl = px * px + pz * pz || 1;
    const k = ((jx - pc.ax) * px + (jz - pc.az) * pz) / pl, cx = pc.ax + px * k, cz = pc.az + pz * k;
    const sx = lane.bx, sz = lane.bz;
    // out of the camera's view, or far enough down a straight road that the haze covers it going up
    if (node.metres < BLOCK.far && cops.onCamera(cx, cz)) { stats.why = 'in view'; return null; }
    const W = road.width, off = (sx - cx) * ax + (sz - cz) * az, side = off > 0 ? 1 : -1;      // the gap is at the kerb on the player's side
    // two units nobody is looking at: vans first, then SUVs, then cruisers; new vans if the cap allows
    const free = cops.units.filter((u) => !u.post && u.kind !== 'truck' && u.v.kind !== 'loose' && !u.deputy.out && u.d > 60 && !cops.onCamera(u.v.x, u.v.z))
      .sort((a, b) => rank(a) - rank(b) || b.d - a.d);
    const cap = quality.get('copCap') || 6, pair = free.slice(0, 2);
    while (pair.length < 2 && cops.units.length < cap) pair.push(cops.add(sx, sz, h, 0, 'van'));
    if (pair.length < 2) { stats.why = 'no units free'; return null; }
    const cos = Math.cos(BLOCK.angle), sin = Math.sin(BLOCK.angle), edge = side * (W / 2 - BLOCK.gap);
    const [B, A] = pair, hlB = B.v.hl, hlA = A.v.hl;
    const tN = edge - side * 2 * hlB * cos;                                   // where the two noses meet, across the road
    const b = { id: stats.placed + 1, key: node.key, x: cx, z: cz, h, fx, fz, side, width: W, t: 0, offT: 0, units: pair, props: [], passed: false, near: false, spikesNear: false, strip: null };
    const stand = (u, dir, hl) => {
      const dx = ax * dir * cos - fx * sin, dz = az * dir * cos - fz * sin;     // nose towards the other one, 30 degrees towards the player
      const nx = cx + ax * tN, nz = cz + az * tN, v = u.v;
      Object.assign(v, { x: nx - dx * hl, z: nz - dz * hl, h: Math.atan2(dx, dz), vf: 0, vl: 0, w: 0, steer: 0 });
      v.y = map.heightAt(v.x, v.z);
      u.post = { block: b.id, x: v.x, z: v.z }; u.route = null; u.state = 'stop'; u.stillT = 0;
    };
    stand(B, -side, hlB); stand(A, side, hlA);
    // barriers from the far vehicle's tail to the far kerb
    const tail = tN - side * 2 * hlA * cos, far = -side * W / 2;
    if (m.props && m.props.add) for (let t = tail - side * 1.4; (t - far) * side > 0.4; t -= side * 2.5) {
      const pr = m.props.add('barrier', cx + ax * t, map.heightAt(cx + ax * t, cz + az * t), cz + az * t, h, { owner: 'roadblock' });
      if (pr) b.props.push(pr);
    }
    // the strip: 25 m in front, ending at the gap's edge
    // (7 m in the bible; here it runs kerb to gap, because two vehicles and a row of barriers cannot close a 22 or 30 m road)
    const len = Math.max(BLOCK.stripLen, W - BLOCK.gap), tc = edge - side * len / 2;
    const kx = cx - fx * BLOCK.stripAt + ax * tc, kz = cz - fz * BLOCK.stripAt + az * tc;
    b.strip = { x: kx, z: kz, y: map.heightAt(kx, kz) + 0.02, h, len, ax, az, fx, fz };
    blocks.push(b); stats.placed++; stats.why = '';
    ev.emit('heat:roadblock', { x: cx, z: cz, id: b.id, metres: Math.round(node.metres), road: road.name, kind: road.kind, width: W, gap: BLOCK.gap, side, strip: { x: kx, z: kz, len } });
    return b;
  }
  const rank = (u) => (u.kind === 'van' ? 0 : u.kind === 'suv' ? 1 : 2);

  function lift(b, why) {
    const i = blocks.indexOf(b); if (i < 0) return;
    blocks.splice(i, 1); stats.lifted++;
    for (const u of b.units) if (u.post && u.post.block === b.id) { u.post = null; u.stillT = 0; }
    if (m.props && m.props.remove) for (const pr of b.props) m.props.remove(pr);
    waitT = BLOCK.next[Math.min(5, S.heat.level)] || 12;
    ev.emit('heat:roadblock:lifted', { id: b.id, why, x: b.x, z: b.z });
  }

  // the player's tyres against a strip
  function spikes(b, dt) {
    const car = m.vehicles.player, k = b.strip, p = S.player;
    if (p.mode === 'foot' || Math.abs(car.vf) < BLOCK.burstAbove || car.lift > 0.05) return;
    if (Math.hypot(car.x - k.x, car.z - k.z) > k.len / 2 + 4) return;
    const reach = BLOCK.stripWide / 2 + Math.abs(car.vf) * dt;
    for (let i = 0; i < 4; i++) {
      car.wheelPos(i, wheel);
      const dx = wheel.x - k.x, dz = wheel.z - k.z;
      if (Math.abs(dx * k.ax + dz * k.az) > k.len / 2 || Math.abs(dx * k.fx + dz * k.fz) > reach) continue;
      burst(car, i, wheel.x, wheel.z);
    }
  }
  // corner i of the car loses its tyre: [front-left, front-right, rear-left, rear-right] by where the wheel is
  function burst(car, i, x, z) {
    const c = Math.cos(car.h), s = Math.sin(car.h), dx = x - car.x, dz = z - car.z, left = dx * c - dz * s > 0, front = dx * s + dz * c > 0;
    const ty = car.tyres || (car.tyres = { f: 1, r: 1, pull: 0, n: 0, corners: [1, 1, 1, 1] });
    const ci = (front ? 0 : 2) + (left ? 0 : 1);
    if (ty.corners[ci] < 1) return;
    ty.corners[ci] = BLOCK.grip; ty.n++;
    ty.f = (ty.corners[0] + ty.corners[1]) / 2; ty.r = (ty.corners[2] + ty.corners[3]) / 2;
    ty.pull = (ty.corners[1] + ty.corners[3] - ty.corners[0] - ty.corners[2]) / (2 * (1 - BLOCK.grip));      // + pulls left: the left side drags
    stats.bursts++;
    if (m.fx && m.fx.sparks) m.fx.sparks(x, 0.15, z, -Math.sin(car.h), -Math.cos(car.h), 8);
    if (m.audio && m.audio.clang) m.audio.clang();
    ev.emit('tyre:burst', { corner: ci, x, z, grip: BLOCK.grip, left: 4 - ty.n });
  }
  function mend() { const car = m.vehicles.player; if (car) car.tyres = null; }

  return {
    blocks, stats, numbers: BLOCK, predict, mend, burst,
    clear(why = 'clear') { for (const b of blocks.slice()) lift(b, why); waitT = 0; },
    // put one where the rule would, without waiting (a check)
    force() { const r = predict(); if (!r) return null; for (let i = 1; i < r.length; i++) if (r[i].metres - BLOCK.before >= BLOCK.min && r[i].metres <= BLOCK.max) { const b = place(r[i]); if (b) return b; } return null; },
    update(dt) {
      const L = S.heat.level, p = S.player, car = m.vehicles.player;
      // a rim on the road throws sparks
      if (car && car.tyres && car.tyres.n && p.mode !== 'foot' && Math.abs(car.vf) > 5 && (sparkT -= dt) <= 0) {
        sparkT = 0.12;
        for (let i = 0; i < 4; i++) {
          car.wheelPos(i, wheel);
          const c = Math.cos(car.h), s = Math.sin(car.h), dx = wheel.x - car.x, dz = wheel.z - car.z, ci = (dx * s + dz * c > 0 ? 0 : 2) + (dx * c - dz * s > 0 ? 0 : 1);
          if (car.tyres.corners[ci] < 1 && m.fx && m.fx.sparks) m.fx.sparks(wheel.x, 0.1, wheel.z, -Math.sin(car.h), -Math.cos(car.h), 2);
        }
      }
      if (L < 4) { if (blocks.length) this.clear('heat'); return; }
      for (const b of blocks.slice()) {
        b.t += dt;
        spikes(b, dt);
        const along = (p.x - b.x) * b.fx + (p.z - b.z) * b.fz, d = Math.hypot(p.x - b.x, p.z - b.z);
        if (!b.near && d < 200) { b.near = true; ev.emit('heat:roadblock:near', { id: b.id, metres: Math.round(d) }); }
        if (!b.spikesNear && Math.hypot(p.x - b.strip.x, p.z - b.strip.z) < 100) { b.spikesNear = true; ev.emit('heat:spikes:near', { id: b.id }); }
        if (along > 5 && d < b.width + 12 && !b.passed) {
          // through it: 8% of the level's range in viewers
          b.passed = true; stats.through++;
          if (S.heat.seen && m.heat.stunt) m.heat.stunt(BLOCK.through);
          ev.emit('heat:roadblock:passed', { id: b.id, x: b.x, z: b.z });
        }
        if (b.passed && along > 30) lift(b, 'passed');
        else if (b.t > BLOCK.life) lift(b, 'time');
      }
      waitT -= dt; thinkT -= dt;
      if (thinkT > 0) return;
      thinkT = BLOCK.every;
      const route = predict();
      // a block the route no longer leads to comes down after 6 s
      for (const b of blocks.slice()) {
        const on = !route || route.some((n) => n.key === b.key) || Math.hypot(p.x - b.x, p.z - b.z) < 60;
        b.offT = on ? 0 : b.offT + BLOCK.every;
        if (b.offT >= BLOCK.offRoute) lift(b, 'route');
      }
      const limit = quality.level === 'low' ? 1 : BLOCK.limit[L];
      if (!route || blocks.length >= limit || waitT > 0 || m.heat.hold) return;
      stats.tries++;
      for (let i = 1; i < route.length; i++) {
        const n = route[i];
        if (n.metres - BLOCK.before < BLOCK.min || n.metres > BLOCK.max || n.lane.len < 30 || blocks.some((b) => b.key === n.key)) { stats.why = 'range'; continue; }
        if (place(n)) break;
      }
    },
  };
}
