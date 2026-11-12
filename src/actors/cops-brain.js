// The pursuit brain: what one cruiser wants to do this step, as the same inputs a player gives
// (steer, gas, brake, handbrake). One state per unit, from plan/bible/systems/heat.md:
// pullover (sit 8 m behind), chase, cutoff (get ahead and turn across), ram (alongside, then into
// the rear quarter, 4 s between tries), box (front, side and rear slots), stop (the player has
// stopped: pull up and let the deputy out), search (loop the last seen point), leave (heat is over).
// No three.js in here.

export const BRAIN = { pullGap: 8, ramGap: 4, ramFor: 0.9, boxBelow: 40 / 3.6, boxOff: 50 / 3.6, stopWithin: 25, searchOut: 150, routeEvery: 1.2,
  direct: 400, reach: 9, catchUp: 1.08, catchFrom: 30, cruise: 15, lost: 3 };

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function createBrain({ nav, collide, map, rnd }) {
  const clearLine = (x0, z0, x1, z1) => { const hit = collide.ray(x0, z0, x1, z1, 0, 2); return !hit || hit.t > 0.97; };

  // steer for a point and hold a speed
  function aim(u, tx, tz, vd, inp) {
    const v = u.v, fx = Math.sin(v.h), fz = Math.cos(v.h), dx = tx - v.x, dz = tz - v.z;
    const fwd = dx * fx + dz * fz, lat = dx * fz - dz * fx, ang = Math.atan2(lat, fwd), a = Math.abs(ang);
    // right on a moving target the angle to it swings wildly: close in sideways and keep the speed
    if (u.pursuit && dx * dx + dz * dz < 144 && v.vf > 6) inp.steer = clamp(lat * 0.3, -0.6, 0.6);
    else {
      inp.steer = clamp(ang * 1.9, -1, 1);
      if (a > 1.3) vd = Math.min(vd, 6); else if (a > 0.7) vd = Math.min(vd, 10); else if (a > 0.35) vd = Math.min(vd, 17);
    }
    inp.gas = v.vf < vd ? 1 : 0;
    inp.brake = v.vf > vd + 1.5 && v.vf > 0.4 ? clamp((v.vf - vd) / 6, 0.25, 1) : 0;      // (a brake held at a standstill is reverse)
    inp.handbrake = a > 1.1 && v.vf > 11 && !(u.pursuit && dx * dx + dz * dz < 144);
    return ang;
  }
  // the next point to drive at: straight there if the line is clear, else along the lanes
  function path(u, tx, tz, time) {
    const v = u.v, d = Math.hypot(tx - v.x, tz - v.z);
    if (d < BRAIN.direct && clearLine(v.x, v.z, tx, tz)) { u.route = null; return u.at.set(tx, tz); }
    if (!u.route || time >= u.routeT || Math.hypot(u.routeTo.x - tx, u.routeTo.z - tz) > 40) {
      u.route = nav.route({ x: v.x, z: v.z }, { x: tx, z: tz }); u.routeI = 0; u.routeT = time + BRAIN.routeEvery + (u.id % 5) * 0.1; u.routeTo.x = tx; u.routeTo.z = tz;
    }
    const r = u.route;
    while (u.routeI < r.length - 1 && Math.hypot(r[u.routeI].x - v.x, r[u.routeI].z - v.z) < BRAIN.reach) u.routeI++;
    // a later point in plain sight is a short cut
    if (u.routeI < r.length - 1) { const n = r[u.routeI + 1]; if (Math.hypot(n.x - v.x, n.z - v.z) < 45 && Math.abs(angleTo(v, n.x, n.z)) < 0.5 && clearLine(v.x, v.z, n.x, n.z)) u.routeI++; }
    const p = r[u.routeI];
    u.corner = u.routeI < r.length - 1 && Math.hypot(p.x - v.x, p.z - v.z) < 24;
    return u.at.set(p.x, p.z);
  }
  const angleTo = (v, x, z) => { const fx = Math.sin(v.h), fz = Math.cos(v.h), dx = x - v.x, dz = z - v.z; return Math.atan2(dx * fz - dz * fx, dx * fx + dz * fz); };

  // W: { p { x, z, fx, fz, lx, lz, vx, vz, speed, onFoot, hw, hl }, known, last { x, z }, level, time, slots }
  function think(u, W, dt) {
    const v = u.v, inp = u.inp, p = W.p, time = W.time;
    inp.steer = 0; inp.gas = 0; inp.brake = 0; inp.handbrake = false;
    u.ramming = false;
    const dx = p.x - v.x, dz = p.z - v.z, dist = Math.hypot(dx, dz);
    // backing out of whatever it is stuck on
    if (u.revT > 0) { u.revT -= dt; inp.brake = 1; inp.steer = -u.revSteer; return; }
    let tx, tz, vd = BRAIN.cruise, state = u.role;
    if (W.level === 0) state = 'leave';
    else if (!W.known) state = 'search';
    else if ((p.speed < 1 || p.onFoot) && dist < BRAIN.stopWithin && state !== 'box') state = 'stop';
    u.state = state;
    const top = v.maxSpeed;
    if (state === 'leave') {
      if (!u.goal || Math.hypot(u.goal.x - v.x, u.goal.z - v.z) < 14) u.goal = roadPoint(v.x + Math.sin(v.h) * 220, v.z + Math.cos(v.h) * 220, 120);
      tx = u.goal.x; tz = u.goal.z; vd = 11;
    } else if (state === 'search') {
      // loop the last seen point, out to 150 m
      if (!u.goal || Math.hypot(u.goal.x - v.x, u.goal.z - v.z) < 12 || time > u.goalT) {
        const first = !u.searched; u.searched = true; u.goalT = time + 14; u.responding = first;
        u.goal = first ? { x: W.last.x, z: W.last.z } : roadPoint(W.last.x, W.last.z, 30 + rnd() * (BRAIN.searchOut - 30));
      }
      tx = u.goal.x; tz = u.goal.z; vd = u.responding ? 26 : 14;
    } else {
      u.goal = null; u.searched = false;
      const along = -(dx * p.fx + dz * p.fz), side = -(dx * p.lx + dz * p.lz);      // where the unit is in the player's frame
      if (state === 'stop') {
        // pull up short of the player, nose towards them, and stop
        tx = p.x; tz = p.z; vd = dist > 9 ? clamp((dist - 7) * 0.9, 2, 14) : 0;
      } else if (state === 'pullover') {
        tx = p.x - p.fx * BRAIN.pullGap; tz = p.z - p.fz * BRAIN.pullGap;
        vd = Math.max(0, p.speed + clamp((dist - BRAIN.pullGap) * 0.7, -4, 13));
        if (along > -3) vd = Math.max(0, p.speed - 3);          // never in front at heat 1
      } else if (state === 'cutoff') {
        // get ahead: aim well down the player's road, then turn across it
        const lead = clamp(dist / 12, 1.5, 5);
        tx = p.x + p.vx * lead + p.fx * 14; tz = p.z + p.vz * lead + p.fz * 14; vd = top;
        if (along > 30) { u.role = 'chase'; }
        if (along > 12 && dist < 40) { tx = p.x + p.fx * 10; tz = p.z + p.fz * 10; vd = Math.max(4, p.speed * 0.5); }
      } else if (state === 'ram') {
        const s = side >= 0 ? 1 : -1;
        if (time < u.ramUntil) {            // the swing: into the rear quarter
          tx = p.x - p.fx * 1.2 + p.vx * 0.25; tz = p.z - p.fz * 1.2 + p.vz * 0.25; vd = p.speed + 5; u.ramming = true;
        } else {
          tx = p.x + p.lx * s * 3.1 + p.fx * 1 + p.vx * 0.4; tz = p.z + p.lz * s * 3.1 + p.fz * 1 + p.vz * 0.4;
          vd = p.speed + clamp((dist - 3) * 0.8, -2, 14);
          if (Math.abs(along) < 4 && Math.abs(side) < 5 && time > u.ramT && p.speed < 150 / 3.6) { u.ramUntil = time + BRAIN.ramFor; u.ramT = time + BRAIN.ramGap; u.rams++; }
        }
      } else if (state === 'box') {
        const sl = u.slot || 0, ox = sl === 0 ? 6.2 : sl === 2 ? -6.2 : 0.5, oy = sl === 1 ? 3 * (side >= 0 ? 1 : -1) : 0;
        tx = p.x + p.fx * ox + p.lx * oy + p.vx * 0.5; tz = p.z + p.fz * ox + p.lz * oy + p.vz * 0.5;
        const d = Math.hypot(tx - v.x, tz - v.z);
        vd = d < 1.5 ? Math.max(0, p.speed - 2) : p.speed + clamp(d * 0.9, 1, 12);
      } else {                              // chase
        tx = p.x + p.vx * 0.3; tz = p.z + p.vz * 0.3;
        vd = p.speed * 1.1 + clamp((dist - 7) * 0.6, -3, 14);
        if (dist < 7 && W.level < 2) vd = Math.max(0, p.speed - 2);
      }
      // more than 30 m behind (the bible says 60; a coupe on a straight was gone before that): allowed 1.08 times the player's speed, whatever its own engine says
      if (dist > BRAIN.catchFrom && state !== 'stop') { vd = Math.max(vd, p.speed * BRAIN.catchUp + 6, 22); u.boost = Math.min(p.top * 1.15, p.speed * BRAIN.catchUp); } else u.boost = 0;
    }
    u.pursuit = state === 'chase' || state === 'ram' || state === 'box' || state === 'pullover' || state === 'cutoff';
    const at = path(u, tx, tz, time);
    if (u.corner) vd = Math.min(vd, 12);
    const ang = aim(u, at.x, at.z, vd, inp);
    if (state === 'stop' && vd === 0) { inp.gas = 0; inp.brake = v.vf > 0.4 ? 1 : 0; inp.handbrake = true; inp.steer = 0; }
    // stuck: wanting to go, not going
    if (inp.gas > 0 && Math.abs(v.vf) < 0.8 && vd > 2) { u.stuckT += dt; if (u.stuckT > 1.2) { u.stuckT = 0; u.revT = 1.1; u.revSteer = Math.sign(ang) || 1; } } else u.stuckT = Math.max(0, u.stuckT - dt);
  }
  function roadPoint(x, z, r) {
    const a = rnd() * Math.PI * 2, px = x + Math.sin(a) * r, pz = z + Math.cos(a) * r, road = map.nearestRoad(px, pz);
    return road && road.d < 120 ? { x: road.x, z: road.z } : { x: px, z: pz };
  }
  return { think, clearLine, roadPoint };
}
