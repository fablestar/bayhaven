// The Sheriff's deputies: cruisers (a white and teal Tarpon with a pink stripe and a pink and
// cyan light bar) that answer heat, and the deputy who gets out when you stop.
// A cruiser is a vehicle the traffic system holds (so the player's car hits it, traffic brakes for
// it and the fleet draws its body); this module drives it with the pursuit brain (cops-brain.js)
// through the same handling step as the player's car. Knocked hard, traffic takes it for a few
// seconds as a loose body; when it has come to rest the brain has it again.
// Other kinds of unit (the Sheriff's SUVs, tactical vans and the show truck: cops-heavy.mod.js) are rows
// added to `kinds`; `plan(level)` says how many of each to send, and a unit with a `post` stands where it is.
// Public object: { units, sees(x, z, range), unitAt(x, z, r), nearest(), nearestLit(), stage(n), numbers, stats,
//   kinds, plan, add(x, z, h, speed, kind), remove(unit), count(kind), onCamera(x, z), clearLine }.
// Emits cop:dispatched, cop:deputy { out }, cop:fired, combat:hit (a deputy's shot that landed).
import { SURFACES } from '../vehicles/handling.js';
import { overlap, resolve, bumpWorld } from '../vehicles/crash.js';
import { createCopDraw, LIVERY } from './cops-draw.js';
import { createBrain, BRAIN } from './cops-brain.js';

export const COPS = { want: [0, 1, 3, 5, 5, 5], ring: [120, 260], first: [105, 170], gone: 400, fill: [0, 4, 3, 2.5, 2, 2], arc: -0.17,
  walk: 1.7, run: 3.6, door: 1.5, bookAfter: 3, backAt: 30, fireEvery: 1.4, fireReach: 40, reach: [0, 0, 0, 40, 50, 60], dive: 15, hit: 0.35, damage: 9, footCap: [3, 4, 6] };

let cops = null;
export default {
  name: 'cops', order: 25, renderOrder: 22, needs: ['traffic', 'heat', 'nav', 'collide', 'map', 'vehicles'],
  init(ctx) {
    const m = ctx.modules, S = ctx.state, ev = ctx.events, traffic = m.traffic, nav = m.nav, collide = m.collide, map = m.map;
    if (!traffic || traffic.disabled || !m.heat) return { disabled: true, units: [], sees: () => false, nearest: () => 1e9, nearestLit: () => 1e9 };
    let seed = 5150;
    const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const cap = ctx.quality.TABLE && ctx.quality.TABLE.copCap ? ctx.quality.TABLE.copCap[2] : 12;
    const draw = createCopDraw(ctx.scene, cap), brain = createBrain({ nav, collide, map, rnd });
    const units = [], near = [], stats = { spawned: 0, removed: 0, rams: 0, shots: 0, hits: 0, booked: 0, readopted: 0, tries: 0, deputiesOut: 0, dives: 0 };
    // a kind of unit: the model it is, its paint, where its light bar sits [z, y, half gap], and (for the heavy ones) its size, mass, top speed, role and sight
    const KINDS = { cruiser: { model: 'tarpon', paint: LIVERY.white, accent: LIVERY.teal } };
    const count = (kind) => units.reduce((n, u) => n + (u.kind === kind ? 1 : 0), 0);
    const env = { surfaceAt: () => SURFACES.road, collide: (v) => { bumpWorld(v, collide); }, emit() {} };
    const W = { p: { x: 0, z: 0, fx: 0, fz: 1, lx: 1, lz: 0, vx: 0, vz: 0, speed: 0, onFoot: false, top: 40 }, known: false, last: S.heat.last, level: 0, time: 0 };
    let time = 0, fillT = 0, sightT = 0, roleT = 0, nextId = 1, bookT = 0, waitT = 0, staged = 0;
    const cam = { x: 0, z: 0, fx: 0, fz: 1, cos: 0 };
    const copCap = () => ctx.quality.get('copCap') || 6;
    const footCap = () => COPS.footCap[ctx.quality.level === 'low' ? 0 : ctx.quality.level === 'high' ? 2 : 1];

    function readCamera() {
      const c = ctx.camera, e = c.matrixWorld.elements, half = Math.atan(Math.tan((c.fov * Math.PI) / 360) * c.aspect) + 0.175, l = Math.hypot(e[8], e[10]) || 1;
      cam.x = e[12]; cam.z = e[14]; cam.fx = -e[8] / l; cam.fz = -e[10] / l; cam.cos = Math.cos(Math.min(Math.PI, half));
    }
    function onCamera(x, z) {
      const dx = x - cam.x, dz = z - cam.z, d = Math.hypot(dx, dz);
      if (d < 1) return true;
      if ((dx * cam.fx + dz * cam.fz) / d < cam.cos) return false;
      return brain.clearLine(cam.x, cam.z, x, z);
    }
    function dress(v, K = KINDS.cruiser) {
      Object.assign(v, { paint: K.paint, accent: K.accent, parked: false, placed: true, cop: true, spin: v.spin || 0 });
      if (K.hw) { v.hw = K.hw; v.hl = K.hl; v.r = Math.hypot(K.hw, K.hl); }
      if (K.mass) v.mass = K.mass;
      return v;
    }
    function add(x, z, h, speed = 0, kind = 'cruiser') {
      const K = KINDS[kind] || KINDS.cruiser, v = dress(m.vehicles.spawn(K.model, x, z, h), K);
      v.vf = speed;
      const u = { id: nextId++, v, kind: KINDS[kind] ? kind : 'cruiser', bar: K.bar, eye: K.eye, top: K.top, fixed: K.role, post: null, role: 'chase', state: 'chase', lit: true, fast: false, sees: false, inp: { steer: 0, gas: 0, brake: 0, handbrake: false },
        at: { x: 0, z: 0, set(ax, az) { this.x = ax; this.z = az; return this; } }, route: null, routeI: 0, routeT: 0, routeTo: { x: 0, z: 0 }, corner: false,
        stuckT: 0, revT: 0, revSteer: 1, ramT: 0, ramUntil: 0, ramming: false, rams: 0, boost: 0, goal: null, goalT: 0, searched: false, slot: 0, speed: 0, born: time, stillT: 0,
        deputy: { out: false, x: 0, z: 0, y: 0, h: 0, bob: 0, state: 'in', t: 0, fireT: 0, shots: 0 } };
      units.push(u); stats.spawned++;
      ev.emit('cop:dispatched', { id: u.id, x, z });
      return u;
    }
    function remove(u) {
      const i = units.indexOf(u); if (i >= 0) units.splice(i, 1);
      if (inTraffic(u.v)) m.vehicles.despawn(u.v);
      stats.removed++;
    }
    const inTraffic = (v) => traffic.wrecks.includes(v) || traffic.loose.includes(v);

    // a place on a lane, out of the camera's view, with the lane running towards the player
    function findSpawn(first) {
      const p = W.p, c = map.chunkOf(p.x, p.z), lanes = [], ring = first ? COPS.first : COPS.ring;
      for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) for (const l of nav.lanesInChunk(c.cx + i, c.cz + j)) if (l.len > 14) lanes.push(l);
      if (!lanes.length) return null;
      stats.tries++;
      for (let n = 0; n < 14; n++) {
        const l = lanes[Math.floor(rnd() * lanes.length)], s = 4 + rnd() * (l.len - 8), fx = Math.sin(l.heading), fz = Math.cos(l.heading);
        const x = l.ax + fx * s, z = l.az + fz * s, dx = p.x - x, dz = p.z - z, d = Math.hypot(dx, dz);
        if (d < ring[0] || d > ring[1]) continue;
        if (waitT < 3 && (dx * fx + dz * fz) / d < 0.2) continue;                        // facing the player, unless that has failed for 3 s
        if (p.speed > 4 && -(dx * p.vx + dz * p.vz) < 0 && rnd() < 0.7) continue;        // mostly ahead
        if (waitT < 4 && onCamera(x, z)) continue;
        let clear = true;
        for (const o of traffic.near(x, z, 9, near)) { clear = false; break; }
        if (!clear) continue;
        return { x, z, h: l.heading, speed: Math.min(l.speed || 12, 12) };
      }
      return null;
    }

    // ---- sight ----
    function unitSees(u, x, z, range) {
      const v = u.v, d = u.deputy;
      if (d.out && !d.down) { const r = Math.hypot(x - d.x, z - d.z); if (r < range && (r < 3 || brain.clearLine(d.x, d.z, x, z))) return true; }
      const dx = x - v.x, dz = z - v.z, r = Math.hypot(dx, dz);
      if (u.eye && r < u.eye) return brain.clearLine(v.x, v.z, x, z);               // the show truck's cameras look all round
      if (r > range) return false;
      if (r < 4) return true;
      if ((dx * Math.sin(v.h) + dz * Math.cos(v.h)) / r < COPS.arc) return false;      // 100 degrees either side of the nose
      return brain.clearLine(v.x, v.z, x, z);
    }
    function sees(x, z, range = 60) { for (const u of units) if (unitSees(u, x, z, range)) return true; return false; }

    // ---- roles: nearest chases (or pulls over at heat 1), second cuts off, third rams; three near a slow player box in ----
    function assign() {
      const p = W.p, L = W.level, list = units.filter((u) => u.v.kind !== 'loose' && !u.deputy.out && !u.post).sort((a, b) => a.d - b.d);
      const close = list.filter((u) => u.d < 45).length, boxing = L >= 2 && close >= 3 && p.speed < BRAIN.boxBelow && p.speed > 1 && !p.onFoot;
      list.forEach((u, i) => {
        if (u.fixed) { u.role = u.fixed; u.slot = 1; return; }                       // the show truck only films: alongside, never behind
        if (L === 1) u.role = 'pullover';
        else if (boxing && i < 3) { u.role = 'box'; u.slot = i; }
        else if (u.role === 'box' && p.speed < BRAIN.boxOff && p.speed > 1 && i < 3) { u.slot = i; }
        else u.role = i === 0 ? (list.length === 1 && L >= 2 ? 'ram' : 'chase') : i === 1 ? 'cutoff' : i === 2 ? 'ram' : i % 2 ? 'chase' : 'ram';
        if (u.role === 'cutoff' && u.d < 25) u.role = 'ram';
      });
    }

    // ---- the deputy on foot ----
    function deputy(u, dt) {
      const d = u.deputy, v = u.v, p = W.p, L = W.level, c = Math.cos(v.h), s = Math.sin(v.h);
      const ds = (p.x - v.x) * c - (p.z - v.z) * s >= 0 ? 1 : -1;                     // he gets out on your side
      if (!d.out) d.side = ds;
      const doorX = v.x + c * d.side * (v.hw + 0.55), doorZ = v.z - s * d.side * (v.hw + 0.55);
      const out = units.reduce((n, o) => n + (o.deputy.out ? 1 : 0), 0);
      if (!d.out) {
        const stopped = Math.abs(v.vf) < 0.6 && v.kind !== 'loose';
        u.stillT = stopped && u.state === 'stop' && u.d < (u.post ? 90 : COPS.backAt - 3) ? u.stillT + dt : 0;
        if (u.stillT > 0.5 && out < footCap() && L > 0) {
          Object.assign(d, { out: true, x: doorX, z: doorZ, y: v.y || 0, h: v.h, state: 'out', t: 0, fireT: 0.8 + rnd() * 0.8 });
          stats.deputiesOut++; ev.emit('cop:deputy', { id: u.id, out: true, x: d.x, z: d.z });
        }
        return;
      }
      if (d.down) return;                      // put down by the combat module: he stays where he fell
      d.t += dt;
      let gx, gz, speed = COPS.walk, stopAt = 0.3;
      const far = u.post ? L === 0 : Math.hypot(p.x - v.x, p.z - v.z) > COPS.backAt || L === 0 || (!p.onFoot && p.speed > 6);       // at a roadblock he holds his ground
      if (far || d.state === 'back') {
        if (d.state !== 'back') { d.state = 'back'; d.t = 0; }
        gx = doorX; gz = doorZ; speed = COPS.run;
        if (Math.hypot(gx - d.x, gz - d.z) < 0.8 || d.t > 6) {                 // 1.5 s to get back in
          if ((d.in = (d.in || 0) + dt) >= 1.5) { d.out = false; d.in = 0; d.state = 'in'; u.stillT = 0; ev.emit('cop:deputy', { id: u.id, out: false }); }
          return;
        }
      } else if (L <= 2) {
        // to your door, or to you
        if (p.onFoot) { gx = p.x; gz = p.z; stopAt = 1.0; speed = p.speed > 2 ? COPS.run : COPS.walk; }
        else { gx = p.x + p.lx * (p.hw + 0.6); gz = p.z + p.lz * (p.hw + 0.6); }
        d.state = 'walk';
      } else {
        // behind his own car, away from you, and firing
        const ax = v.x - p.x, az = v.z - p.z, al = Math.hypot(ax, az) || 1;
        gx = v.x + ax / al * 1.7 + c * 0.9; gz = v.z + az / al * 1.7 - s * 0.9; d.state = 'cover';
      }
      // a car coming at him inside 15 m: he dives out of its way
      if (u.post && d.near < COPS.dive && !p.onFoot && p.speed > 6 && d.state !== 'back') {
        const side = (d.x - p.x) * p.lx + (d.z - p.z) * p.lz >= 0 ? 1 : -1;
        if (!d.diving) { d.diving = true; stats.dives++; ev.emit('cop:dive', { id: u.id, x: d.x, z: d.z }); }
        d.x += p.lx * side * 7 * dt; d.z += p.lz * side * 7 * dt; d.bob += dt * 24; d.state = 'dive';
        d.near = Math.hypot(p.x - d.x, p.z - d.z);
        return;
      }
      d.diving = false;
      const dx = gx - d.x, dz = gz - d.z, dist = Math.hypot(dx, dz);
      if (dist > stopAt) { const k = Math.min(dist - stopAt, speed * dt) / dist; d.x += dx * k; d.z += dz * k; d.h = Math.atan2(dx, dz); d.bob += dt * speed * 4; }
      else { d.h = Math.atan2(p.x - d.x, p.z - d.z); d.bob = 0; }
      d.y = map.heightAt ? map.heightAt(d.x, d.z) : 0;
      d.near = Math.hypot(p.x - d.x, p.z - d.z);
      if (d.state === 'cover' && !m.heat.hold) {
        d.h = Math.atan2(p.x - d.x, p.z - d.z);
        d.fireT -= dt;
        const flags = (S.mission.flags && S.mission.flags.heat) || {};
        if (d.fireT <= 0 && d.near < (COPS.reach[L] || COPS.fireReach) && S.heat.seen && !flags.holdFire && brain.clearLine(d.x, d.z, p.x, p.z)) {
          d.fireT = COPS.fireEvery * (0.8 + rnd() * 0.4); d.shots++; stats.shots++;
          const hit = rnd() < COPS.hit;
          if (m.fx && m.fx.sparks) m.fx.sparks(d.x + Math.sin(d.h) * 0.6, d.y + 1.3, d.z + Math.cos(d.h) * 0.6, Math.sin(d.h), Math.cos(d.h), 4);
          if (hit && m.fx && m.fx.sparks) m.fx.sparks(p.x, 0.8, p.z, -Math.sin(d.h), -Math.cos(d.h), 6);
          ev.emit('cop:fired', { id: u.id, x: d.x, z: d.z, tx: p.x, tz: p.z, hit, weapon: u.kind === 'van' ? 'smg' : 'pistol' });
          if (hit) { stats.hits++; ev.emit('combat:hit', { target: 'player', by: 'deputy', weapon: 'pistol', damage: p.onFoot ? COPS.damage : 4, x: p.x, z: p.z }); }
        }
      }
    }

    function step(u, dt) {
      const v = u.v, p = W.p;
      u.d = Math.hypot(p.x - v.x, p.z - v.z); u.speed = Math.hypot(v.vf, v.vl);
      u.lit = W.level > 0; u.fast = W.level >= 3;
      if (v.kind === 'loose') { u.stillT = 0; return; }           // spun out: traffic has it until it rests
      if (u.deputy.out || u.post) { u.inp.gas = 0; u.inp.steer = 0; u.inp.brake = v.vf > 0.4 ? 1 : 0; u.inp.handbrake = true; u.state = 'stop'; }
      else brain.think(u, W, dt);
      // the catch-up allowance: a unit far behind is held to at least 1.08 times the player's speed
      if (u.boost > 0 && v.vf > 8 && v.vf < u.boost && Math.abs(v.steer) < 0.25) v.vf += 5 * dt;
      if (u.top && v.vf > u.top) v.vf = u.top;
      v.drive(u.inp, env);
      v.braking = u.inp.brake > 0; v.spin += (v.vf / 0.33) * dt; v.y = map.heightAt(v.x, v.z);
      if (u.ramming) stats.rams = Math.max(stats.rams, u.rams);
      // against other cars: the cruiser gives way (traffic handles the player's car against it)
      traffic.near(v.x, v.z, 8, near);
      for (const o of near) {
        if (o === v || o.isPlayer) continue;
        const hit = overlap(v, o);
        if (hit) resolve(v, o, hit, true);
      }
      if (traffic.held) { const pl = m.vehicles.player, hit = overlap(v, pl); if (hit) resolve(v, pl, hit, true); }
    }

    cops = {
      units, numbers: COPS, brain: BRAIN, stats, draw, sees, kinds: KINDS, plan: null, add, remove, count, onCamera, clearLine: brain.clearLine, roadPoint: brain.roadPoint,
      // the unit whose body is at a spot (the heat module asks after a crash)
      unitAt(x, z, r = 4.5) { for (const u of units) if (Math.hypot(u.v.x - x, u.v.z - z) < r + u.v.hl) return { id: u.id, ramming: u.ramming || time < u.ramUntil + 0.6, speed: u.speed, state: u.state }; return null; },
      nearest() { let best = 1e9; for (const u of units) if (u.state !== 'leave') best = Math.min(best, u.d === undefined ? 1e9 : u.d); return best; },
      nearestLit() { let best = 1e9; const p = S.player; for (const u of units) if (u.lit) best = Math.min(best, Math.hypot(u.v.x - p.x, u.v.z - p.z)); return best; },
      // put n cruisers on the road behind the player at once (a clip, a check)
      stage(n = 3) {
        const p = S.player, fx = Math.sin(p.h), fz = Math.cos(p.h), lx = fz, lz = -fx;
        for (const u of units.slice()) remove(u);
        // one close behind, one coming the other way up the next lane, the rest behind on alternate sides
        for (let i = 0; i < n; i++) {
          if (i === 1) { add(p.x + fx * 150 + lx * 3.4, p.z + fz * 150 + lz * 3.4, p.h + Math.PI, 0); continue; }
          const back = 10 + i * 5, side = i === 0 ? 0 : (i % 4 === 2 ? -3 : 3);
          add(p.x - fx * back + lx * side, p.z - fz * back + lz * side, p.h, Math.abs(p.kmh || 0) / 3.6);
        }
        staged = n;
        return units.length;
      },
      clear() { for (const u of units.slice()) remove(u); },
      list: () => units.map((u) => ({ id: u.id, kind: u.kind, post: !!u.post, x: u.v.x, z: u.v.z, h: u.v.h, v: u.speed, d: u.d, role: u.role, state: u.state, lit: u.lit, loose: u.v.kind === 'loose', sees: u.sees,
        rams: u.rams, deputy: u.deputy.out ? { x: u.deputy.x, z: u.deputy.z, state: u.deputy.state, near: u.deputy.near, shots: u.deputy.shots } : null })),
      update(dt) {
        time += dt; W.time = time;
        const p = S.player, car = m.vehicles.player, L = S.heat.level, onFoot = p.mode === 'foot';
        const fx = Math.sin(p.h), fz = Math.cos(p.h), sp = onFoot ? (m.player && m.player.me ? m.player.me.speed || 0 : 0) : Math.hypot(car.vf, car.vl);
        Object.assign(W.p, { x: p.x, z: p.z, fx, fz, lx: fz, lz: -fx, speed: sp, onFoot, hw: car.hw, hl: car.hl, top: car.maxSpeed || 40,
          vx: onFoot ? 0 : fx * car.vf + fz * car.vl, vz: onFoot ? 0 : fz * car.vf - fx * car.vl });
        W.level = L; W.known = L > 0 && (S.heat.seen || S.heat.unseenT < BRAIN.lost);
        readCamera();
        // a cruiser the traffic system dropped (a clip began, the quality changed) goes back in; one the player drove off in is gone
        for (let i = units.length - 1; i >= 0; i--) {
          const u = units[i];
          if (inTraffic(u.v)) continue;
          if (!onFoot && Math.hypot(u.v.x - car.x, u.v.z - car.z) < 1.5 && car.paint === KINDS[u.kind].paint) { units.splice(i, 1); stats.removed++; continue; }
          const old = u.v; u.v = dress(m.vehicles.spawn(KINDS[u.kind].model, old.x, old.z, old.h), KINDS[u.kind]);
          Object.assign(u.v, { vf: old.vf, vl: old.vl, w: old.w, steer: old.steer, gear: old.gear }); stats.readopted++;
        }
        if (traffic.held) for (const u of units) if (!traffic.all.includes(u.v)) traffic.all.push(u.v);       // traffic sleeps through a clip; the fleet still draws these
        // dispatch
        // how many, and which kind is short: cruisers by level, or whatever the plan says (heat 4 and 5)
        let want = Math.min(copCap(), COPS.want[L] || 0), kind = 'cruiser';
        const plan = cops.plan ? cops.plan(L) : null;
        if (plan) { want = 0; kind = null; for (const [k, n] of plan) { want += n; if (!kind && count(k) < n) kind = k; } want = Math.min(copCap(), want); }
        if (L > 0 && units.length < want && kind && !m.heat.hold && Math.hypot(W.last.x - p.x, W.last.z - p.z) < 300) {
          fillT -= dt;
          if (fillT <= 0) {
            const first = units.length === 0, at = findSpawn(first);
            if (at) { add(at.x, at.z, at.h, at.speed, kind); fillT = COPS.fill[L]; waitT = 0; } else { waitT += 0.25; fillT = 0.25; }
          }
        } else if (L === 0) fillT = 0;
        // far behind, or the show is over and nobody is looking: off the road
        for (let i = units.length - 1; i >= 0; i--) {
          const u = units[i], d = Math.hypot(u.v.x - p.x, u.v.z - p.z);
          if ((d > COPS.gone && !u.post) || (L === 0 && !u.deputy.out && (d > 200 || (time - u.leftAt > 8 && !onCamera(u.v.x, u.v.z))))) remove(u);
          else if (L === 0 && u.leftAt === undefined) u.leftAt = time; else if (L > 0) u.leftAt = undefined;
        }
        sightT -= dt;
        if (sightT <= 0) { sightT = 0.25; const r = m.heat.sight(); for (const u of units) u.sees = unitSees(u, p.x, p.z, r); }
        roleT -= dt;
        for (const u of units) u.d = Math.hypot(p.x - u.v.x, p.z - u.v.z);
        if (roleT <= 0) { roleT = 0.5; assign(); }
        for (const u of units) { step(u, dt); deputy(u, dt); }
        // Booked: heat 1 or 2, under 1 m/s, a deputy within 1.5 m of your door (or of you) for 3 s
        let atDoor = false;
        if (L >= 1 && L <= 2 && sp < 1) for (const u of units) if (u.deputy.out && u.deputy.state === 'walk' && u.deputy.near < (onFoot ? COPS.door : COPS.door + car.hw + 0.6)) atDoor = true;
        bookT = atDoor ? bookT + dt : 0;
        cops.bookT = bookT;
        if (bookT >= COPS.bookAfter) { bookT = 0; stats.booked++; for (const u of units) { u.deputy.state = 'back'; } m.heat.book(); }
      },
    };
    ev.on('game:reset', () => cops.clear());
    ev.on('quality:changed', () => cops.clear());
    ctx.test.cops = { list: () => cops.list(), stats: () => ({ ...stats, units: units.length, calls: draw.calls, triangles: draw.triangles, bookT }), stage: (n) => cops.stage(n), clear: () => cops.clear(),
      spawn: (x, z, h = 0) => { const u = add(x, z, h); return { id: u.id, x, z }; } };
    return cops;
  },
  update(dt) { if (cops && cops.update) cops.update(dt); },
  render(alpha, ctx) {
    if (!cops || !cops.draw) return;
    cops.draw.draw(cops.units, ctx.loop.time, ctx.modules.sky ? ctx.modules.sky.night : 0);
  },
};
