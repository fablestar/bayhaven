// Street people: who is out, where they walk, and what state each is in (plan/04 section 6,
// plan/bible/systems/people.md). No three.js: pedsdraw.js draws what this decides.
// States: walk, cross, hang (sit, lean, chat, sunbathe, phone, look, shout, wave), flee, film,
// dodge, fall (a rope), dazed, getup, down (hit hard: they stay there until the ambulance or the clock takes them), crowd (a member of a crowd, with no brain of its own).
import { KINDS, dress, mixFor, targetFor } from './pedskinds.js';
import { FACE } from './pedsfaces.js';
import { startRope, stepRope, HIPS, NECK, HIT, hitOutcome } from './tumble.js';
import { createReactions } from './pedsreact.js';

export const PEDS = { radius: 0.35, ringIn: 60, ringOut: 140, gone: 150, full: 40, space: 1.2, filmRange: 40, hornRange: 15,
  sideRange: 6, dazed: 3, getUp: 1.2, dodge: 0.35, slowKmh: 10, hardKmh: 50, sureDodgeKmh: 30, calm: 6 };
const WEATHER = { haze: 0.9, 'afternoon storm': 0.3, 'swamp fog': 0.5, 'tropical storm': 0.1, hurricane: 0 };
const angle = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const UP = { walk: 1, cross: 1, hang: 1, film: 1, flee: 1 };     // states with a brain that a car can interrupt

export function createPeds({ map, nav, collide, signals, events, state, cap, ropes, rnd = Math.random }) {
  const list = [], crowds = [], cars = [], body = { x: 0, z: 0, r: PEDS.radius, level: 0 };
  let nextId = 1, spawnWait = 0, tick = 0, time = 0, filled = false, lastFx = 1e9, lastFz = 1e9, brain = 0;
  const sim = {
    list, crowds, cars, cap, ropes, streetCap: cap, crowdScale: 1, paused: false, weather: 1, time: 0, removed: null,
    focus: { x: 0, z: 0, onFoot: false, speed: 0 }, view: { x: 0, z: 0, fx: 0, fz: 1 }, car: null, horn: false,
    stats: { hits: 0, dodges: 0, spawned: 0, fled: 0, waits: 0, jaywalks: 0 },
  };
  const react = createReactions(sim, { map, collide, events, state, rnd, setState, flee });
  sim.react = react;

  function setState(p, st, sub = null, seconds = 0) { p.state = st; p.sub = sub; p.st = 0; p.timer = seconds; if (st !== 'walk' && st !== 'cross' && st !== 'flee') p.v = 0; }
  const ground = (x, z) => map.heightAt(x, z);

  // ---- spawning ----
  function add(kind, x, z, h, opts = {}) {
    if (list.length >= sim.cap) return null;
    const K = KINDS[kind], look = dress(kind, rnd);
    if (opts.shirt && look.shirt !== look.skin) { if (look.arm === look.shirt) look.arm = opts.shirt; look.shirt = opts.shirt; }     // a crowd in one colour
    const p = { id: nextId++, slot: list.length, kind, K, look, x, y: ground(x, z), z, h, v: 0, phase: rnd() * 6, seed: rnd(), nerve: rnd(), rolls: !!K.rolls,
      state: 'walk', sub: null, st: 0, timer: 0, face: FACE.neutral, mode: 'free', edge: null, dir: 1, s: 0, off: 0.2 + rnd() * 0.7, tx: x, tz: z,
      goal: 80 + rnd() * 220, hold: null, jay: false, frozen: 0, annoyed: 0, slow: 0, gaze: 0, t0: 0, show: 0, rope: null, crowd: null, heard: 0,
      street: !opts.crowd, fresh: true, born: time };
    list.push(p); sim.stats.spawned++;
    return p;
  }
  function remove(p) {
    const last = list.pop();
    if (last !== p) { list[p.slot] = last; last.slot = p.slot; last.fresh = true; }
    p.gone = true;
    if (sim.removed) sim.removed(list.length);
  }
  const inView = (x, z) => {
    const dx = x - sim.view.x, dz = z - sim.view.z, d = Math.hypot(dx, dz);
    return d < 110 && (dx * sim.view.fx + dz * sim.view.fz) / (d || 1) > 0.55;
  };
  function onEdge(p, e, s, dir) { p.mode = 'edge'; p.edge = e; p.s = s; p.dir = dir; place(p); }
  function place(p) {
    const e = p.edge, k = (p.dir > 0 ? p.s : e.len - p.s) / e.len, dx = (e.bx - e.ax) / e.len * p.dir, dz = (e.bz - e.az) / e.len * p.dir;
    p.x = e.ax + (e.bx - e.ax) * k - dz * p.off; p.z = e.az + (e.bz - e.az) * k + dx * p.off;
    p.h = Math.atan2(dx, dz);
  }
  const sandOk = (x, z) => map.surfaceAt(x, z) === 'sand' && z < 71.5;
  function hangOnSand(p) { const r = rnd(); setState(p, 'hang', r < 0.55 ? 'sunbathe' : r < 0.85 ? 'sit' : 'phone', 20 + rnd() * 70); p.h = rnd() * 6.28; }
  function spawnOne(fill) {
    const f = sim.focus, zone = map.zoneAt(f.x, f.z);
    if (!zone) return false;
    const mix = mixFor(zone.peds, zone.id, state.clock.hour);
    let total = 0; for (const k in mix) total += mix[k];
    let pickAt = rnd() * total, kind = null;
    for (const k in mix) { pickAt -= mix[k]; if (pickAt <= 0) { kind = k; break; } }
    const K = KINDS[kind], beach = !!zone.promenade;
    const spots = beach ? K.spot : { walk: 1 };
    let st = 0; for (const k in spots) st += spots[k];
    let sp = rnd() * st, spot = 'walk';
    for (const k in spots) { sp -= spots[k]; if (sp <= 0) { spot = k; break; } }
    for (let n = 0; n < 4; n++) {
      const a = rnd() * 6.283, r = (fill ? 12 : PEDS.ringIn) + rnd() * (PEDS.ringOut - (fill ? 12 : PEDS.ringIn));
      let x = f.x + Math.cos(a) * r, z = f.z + Math.sin(a) * r, p = null;
      if (spot === 'sand') {
        z = 52 + rnd() * 19; x = f.x + (rnd() < 0.5 ? -1 : 1) * Math.sqrt(Math.max(0, r * r - (z - f.z) * (z - f.z)));
        if (!sandOk(x, z) || bad(x, z, fill)) continue;
        p = add(kind, x, z, rnd() * 6.28);
        if (p && rnd() < 0.65) {
          hangOnSand(p);
          // a towel is two to four people
          for (let m = Math.floor(rnd() * 3); m > 0 && streetCount() < sim.target; m--) { const q = add(kind, x + (rnd() - 0.5) * 3, z + (rnd() - 0.5) * 2.4, p.h + (rnd() - 0.5)); if (q) hangOnSand(q); }
        } else if (p) freeGoal(p);
      } else if (spot === 'prom') {
        z = zone.promenade.z0 + 0.8 + rnd() * (zone.promenade.z1 - zone.promenade.z0 - 1.6); x = f.x + (rnd() < 0.5 ? -1 : 1) * r;
        if (ground(x, z) < 0.05 || bad(x, z, fill)) continue;
        p = add(kind, x, z, 0); if (p) { p.prom = zone.promenade; freeGoal(p); }
      } else {
        const e = nav.walkNear(x, z);
        if (!e || e.crossing || e.len < 4) continue;
        const s = rnd() * e.len, dir = rnd() < 0.5 ? 1 : -1;
        const ex = e.ax + (e.bx - e.ax) * (dir > 0 ? s : e.len - s) / e.len, ez = e.az + (e.bz - e.az) * (dir > 0 ? s : e.len - s) / e.len;
        if (bad(ex, ez, fill) || map.surfaceAt(ex, ez) === 'water') continue;
        p = add(kind, ex, ez, 0); if (p) { onEdge(p, e, s, dir); if (rnd() < 0.12) hang(p); }
      }
      return !!p;
    }
    return false;
  }
  function bad(x, z, fill) {
    const d = Math.hypot(x - sim.focus.x, z - sim.focus.z);
    if (d > PEDS.ringOut || d < (fill ? 10 : PEDS.ringIn)) return true;
    return !fill && inView(x, z);
  }
  const streetCount = () => { let n = 0; for (const p of list) if (p.street) n++; return n; };

  // ---- walking ----
  function freeGoal(p) {
    p.mode = 'free';
    if (p.prom) {             // along the promenade, keeping right
      const east = rnd() < 0.5, mid = (p.prom.z0 + p.prom.z1) / 2;
      p.tx = p.x + (east ? 1 : -1) * (80 + rnd() * 220);
      p.tz = east ? mid + 0.5 + rnd() * 1.6 : mid - 0.5 - rnd() * 1.6;
    } else {                  // somewhere else on the sand
      for (let n = 0; n < 5; n++) { const x = p.x + (rnd() - 0.5) * 80, z = 52 + rnd() * 19; if (sandOk(x, z)) { p.tx = x; p.tz = z; break; } }
    }
    setState(p, 'walk');
  }
  function hang(p) {
    const r = rnd();
    let other = null;
    if (r < 0.3) for (const q of list) if (q !== p && q.street && (q.state === 'walk' || (q.state === 'hang' && q.sub === 'phone')) && Math.abs(q.x - p.x) < 4 && Math.abs(q.z - p.z) < 4 && !q.hold) { other = q; break; }
    if (other) {
      const seconds = 20 + rnd() * 40;
      setState(p, 'hang', 'chat', seconds); setState(other, 'hang', 'chat', seconds);
      p.h = Math.atan2(other.x - p.x, other.z - p.z); other.h = p.h + Math.PI;
    } else if (map.surfaceAt(p.x, p.z) === 'sand') hangOnSand(p);
    else setState(p, 'hang', r < 0.55 ? 'phone' : r < 0.8 ? 'lean' : 'sit', 20 + rnd() * 70);
  }
  // back to walking from wherever they are: the edge they were on, or the nearest one, or the sand
  function resume(p) {
    p.face = FACE.neutral; p.hold = null;
    const surface = map.surfaceAt(p.x, p.z);
    if (p.prom && ground(p.x, p.z) > 0.05) return freeGoal(p);
    if (surface === 'sand' && (p.mode === 'free' || p.z > 56)) { p.prom = null; return freeGoal(p); }
    let e = nav.walkNear(p.x, p.z);
    if (e && e.crossing) e = e.next.find((n) => !n.crossing) || null;
    if (!e) e = p.edge && !p.edge.crossing ? p.edge : null;
    if (!e) return freeGoal(p);
    const dx = e.bx - e.ax, dz = e.bz - e.az, k = Math.max(0, Math.min(1, ((p.x - e.ax) * dx + (p.z - e.az) * dz) / (e.len * e.len)));
    p.edge = e; p.back = { e, s: p.dir > 0 ? k * e.len : (1 - k) * e.len };
    const px = e.ax + dx * k - dz / e.len * p.dir * p.off, pz = e.az + dz * k + dx / e.len * p.dir * p.off;
    p.mode = 'free'; p.tx = px; p.tz = pz;
    setState(p, 'walk');
  }
  function canCross(p, e) {
    const ph = signals && signals.phase ? signals.phase(e.node) : null;
    const carNear = (r, fast) => { for (const c of cars) if (Math.hypot(c.vf, c.vl) > fast && Math.hypot(c.x - p.x, c.z - p.z) < r) return true; return false; };
    if (ph) {
      const axis = Math.abs(e.bx - e.ax) > Math.abs(e.bz - e.az) ? 'ew' : 'ns';
      // the walk light is the green of the road beside them, less its last 4 s; they set off only
      // if they can be across before it ends, and jog when it is going to be close
      if (ph[axis] === 'green') {
        let left = 1; while (left < 40 && signals.phase(e.node, signals.time + left)[axis] === 'green') left++;
        const need = e.len / Math.max(0.5, left - 1.5);
        if (left > 4 && need <= p.K.flee) { p.crossV = Math.max(p.K.walk * 1.2, need); return true; }
      }
      if (p.jayRoll === undefined) p.jayRoll = rnd() < p.K.jay;
      if (p.jayRoll && !carNear(40, 0.5)) { p.jay = true; p.crossV = 0; sim.stats.jaywalks++; return true; }
      return false;
    }
    p.crossV = 0;
    return !carNear(12, 3);
  }
  function nextEdge(p) {
    const e = p.edge, ex = p.dir > 0 ? e.bx : e.ax, ez = p.dir > 0 ? e.bz : e.az;
    let pickN = null, w = 0;
    for (const n of e.next) {
      const atA = Math.abs(n.ax - ex) + Math.abs(n.az - ez) < 1, atB = Math.abs(n.bx - ex) + Math.abs(n.bz - ez) < 1;
      if (!atA && !atB) continue;
      const weight = n.crossing ? (e.crossing ? 0.3 : 1) : 3;
      w += weight; if (rnd() * w < weight) pickN = { n, dir: atA ? 1 : -1 };
    }
    if (!pickN) { p.dir = -p.dir; p.s = 0; return; }
    if (pickN.n.crossing) { p.hold = pickN; p.jayRoll = undefined; p.v = 0; sim.stats.waits++; return; }
    p.jay = false; onEdge(p, pickN.n, 0, pickN.dir); if (p.state === 'cross') p.state = 'walk';
  }
  function walk(p, dt, near) {
    const base = p.K.walk * (p.slow > 0 ? 0.8 : 1);
    if (p.hold) {               // at the curb, waiting to cross
      if (brain === 0 && canCross(p, p.hold.n)) { const h = p.hold; p.hold = null; onEdge(p, h.n, 0, h.dir); p.state = 'cross'; }
      else { p.v = 0; const n = p.hold.n; p.h += angle(Math.atan2((n.ax + n.bx) / 2 - p.x, (n.az + n.bz) / 2 - p.z) - p.h) * Math.min(1, dt * 4); return; }
    }
    if (p.mode === 'edge') {
      let v = base;
      if (p.state === 'cross') {
        v = Math.max(base * 1.2, p.crossV || 0);
      }
      p.v = v; p.s += v * dt; p.goal -= v * dt;
      if (near && p.want !== undefined) p.off += (p.want - p.off) * Math.min(1, dt * 2);
      if (p.s >= p.edge.len) { nextEdge(p); if (p.hold) return; }
      place(p);
      if (p.goal <= 0 && p.state === 'walk') { p.goal = 80 + rnd() * 220; if (rnd() < 0.6) hang(p); }
    } else {
      const dx = p.tx - p.x, dz = p.tz - p.z, d = Math.hypot(dx, dz), v = p.state === 'flee' ? p.K.flee : base;
      if (d < Math.max(0.3, v * dt * 1.5)) return arrive(p);
      let ux = dx / d, uz = dz / d;
      if (near && p.side) { const s = p.side * 0.6; ux += -uz * s; uz += dx / d * s; }
      p.v = v; p.x += ux * v * dt; p.z += uz * v * dt;
      p.h += angle(Math.atan2(dx, dz) - p.h) * Math.min(1, dt * 8);
      if (p.state === 'flee') {
        if (near) { body.x = p.x; body.z = p.z; if (collide.pushOutCircle(body)) { p.x = body.x; p.z = body.z; p.stuck = (p.stuck || 0) + dt; if (p.stuck > 0.6) return arrive(p); } }
        if (p.z > 74) { p.z = 74; p.tz = 70; }
      }
    }
  }
  function arrive(p) {
    p.v = 0; p.stuck = 0;
    if (p.state === 'flee') { setState(p, 'hang', 'look', PEDS.calm); p.face = FACE.shocked; p.gaze = 0; return; }
    if (p.back) { const b = p.back; p.back = null; return onEdge(p, b.e, b.s, p.dir); }
    if (rnd() < 0.5) hang(p); else freeGoal(p);
  }
  function flee(p, fromX, fromZ) {
    if (p.state === 'flee' || p.rope || p.state === 'dazed' || p.state === 'getup' || p.state === 'down') return;
    let dx = p.x - fromX, dz = p.z - fromZ; const d = Math.hypot(dx, dz) || 1, far = 30 + rnd() * 30;
    dx /= d; dz /= d;
    p.back = null; p.hold = null; p.mode = 'free'; p.tx = p.x + dx * far; p.tz = p.z + dz * far;
    setState(p, 'flee'); p.face = FACE.shocked; sim.stats.fled++; react.fled++;
  }

  // ---- cars ----
  function hit(p, c, speed) {
    const vx = Math.sin(c.h) * c.vf + Math.cos(c.h) * c.vl, vz = Math.cos(c.h) * c.vf - Math.sin(c.h) * c.vl;
    let live = 0; for (const q of list) if (q.rope && !q.rope.canned) live++;
    p.rope = startRope(p.x, p.y, p.z, p.h, p.look.scale, vx, vz, rnd);
    p.rope.canned = live >= sim.ropes;       // past the limit the body is thrown but not solved: it just slides
    p.hold = null; p.back = null; p.crowd = null; p.street = true; p.frozen = 0;
    setState(p, 'fall'); p.face = FACE.shocked;
    sim.stats.hits++;
    const out = hitOutcome(speed * 3.6, p.health === undefined ? HIT.health : p.health);
    p.health = out.health; p.hard = out.down || !!c.blast; p.by = c === sim.car ? 'player' : c.blast ? 'blast' : 'traffic';
    events.emit('ped:hit', { speed, kmh: speed * 3.6, x: p.x, z: p.z, kind: p.kind, id: p.id, by: c === sim.car ? 'player' : 'traffic' });
  }
  function carsAndPeople(p) {
    for (const c of cars) {
      const sp = Math.hypot(c.vf, c.vl);
      const rx = p.x - c.x, rz = p.z - c.z;
      if (Math.abs(rx) > 30 || Math.abs(rz) > 30) continue;
      const sn = Math.sin(c.h), cs = Math.cos(c.h), fwd = rx * sn + rz * cs, lat = rx * cs - rz * sn, kmh = sp * 3.6;
      const inside = Math.abs(lat) < c.hw + PEDS.radius && Math.abs(fwd) < c.hl + PEDS.radius;
      if (inside) {
        if (kmh >= PEDS.slowKmh && !p.rope) return hit(p, c, sp);
        // a car at a crawl pushes nobody over: they step aside
        const side = lat >= 0 ? 1 : -1, push = c.hw + PEDS.radius - Math.abs(lat) + 0.02;
        p.x += cs * side * push; p.z -= sn * side * push;
        continue;
      }
      if (sp < 0.5 || !UP[p.state]) continue;
      const along = fwd * (c.vf >= 0 ? 1 : -1);
      if (along > 0 && along < c.hl + 2 + sp * 0.8 && Math.abs(lat) < c.hw + 0.9) {
        // they jump clear if they can see it coming (or hear the horn), and it is slow enough
        const sees = (Math.sin(p.h) * -rx + Math.cos(p.h) * -rz) / (Math.hypot(rx, rz) || 1) > -0.5 || p.heard > 0;
        if (sees && (kmh < PEDS.sureDodgeKmh || p.nerve > (kmh - PEDS.sureDodgeKmh) / (PEDS.hardKmh - PEDS.sureDodgeKmh))) {
          const side = lat >= 0 ? 1 : -1;
          p.dx = cs * side; p.dz = -sn * side; p.after = c === sim.car && map.surfaceAt(c.x, c.z) !== 'road' ? p.K.side.replace('J', '')[0] || null : null;
          p.fromX = c.x; p.fromZ = c.z; p.hold = null;
          setState(p, 'dodge'); p.face = FACE.shocked; sim.stats.dodges++;
          return;
        }
      }
    }
  }
  function fall(p, dt) {
    const r = p.rope;
    if (r.canned) {        // thrown and sliding to a stop, lying down, without the rope's maths
      const k = Math.max(0, 1 - r.t / 0.8) * dt * 60;
      for (let i = 0; i < 30; i += 3) { const mx = (r.p[i] - r.q[i]) * k, mz = (r.p[i + 2] - r.q[i + 2]) * k; r.p[i] += mx; r.q[i] += mx; r.p[i + 2] += mz; r.q[i + 2] += mz; }
      r.t += dt; if (r.t > 1) r.done = true;
    }
    else stepRope(r, dt, ground);
    p.x = r.p[HIPS * 3]; p.z = r.p[HIPS * 3 + 2];
    if (!r.done) return;
    if (!r.canned) p.h = Math.atan2(r.p[HIPS * 3] - r.p[NECK * 3], r.p[HIPS * 3 + 2] - r.p[NECK * 3 + 2]);
    body.x = p.x; body.z = p.z; collide.pushOutCircle(body); p.x = body.x; p.z = body.z;
    p.rope = null; p.y = ground(p.x, p.z);
    if (p.hard) {          // a hard hit: no getting up from this one
      setState(p, 'down'); p.face = FACE.shocked; p.downT = 0; p.v = 0; sim.stats.downs = (sim.stats.downs || 0) + 1;
      events.emit('ped:down', { id: p.id, kind: p.kind, x: p.x, z: p.z, cause: p.by === 'blast' ? 'blast' : 'vehicle', by: p.by });
      return;
    }
    setState(p, 'dazed', null, PEDS.dazed); p.face = FACE.dizzy;
  }
  // an explosion: everyone inside r is thrown outwards; near the middle they stay down (120 health at the centre, none at r)
  const blastCar = { h: 0, vf: 0, vl: 0, blast: false };
  function blast(x, z, r) {
    let n = 0;
    for (const p of list.slice()) {
      const dx = p.x - x, dz = p.z - z, d = Math.hypot(dx, dz);
      if (d >= r || p.rope || p.state === 'down' || p.state === 'crowd') continue;
      const hurt = 120 * (1 - d / r);
      blastCar.h = Math.atan2(dx, dz); blastCar.vf = 4 + 8 * (1 - d / r); blastCar.blast = hurt >= (p.health === undefined ? HIT.health : p.health);
      hit(p, blastCar, blastCar.vf); n++;
    }
    return n;
  }

  function stepOne(p, dt, near) {
    p.st += dt;
    if (p.frozen > 0) { p.frozen -= dt; return; }
    if (p.annoyed > 0) p.annoyed -= dt;
    if (p.slow > 0) p.slow -= dt;
    if (p.heard > 0) p.heard -= dt;
    switch (p.state) {
      case 'walk': case 'cross': case 'flee': walk(p, dt, near); break;
      case 'hang':
        p.timer -= dt;
        if (p.sub === 'look' || p.sub === 'shout' || p.sub === 'wave') react.face(p, dt);
        if (p.timer <= 0) resume(p);
        break;
      case 'film': react.film(p, dt); if (p.state !== 'film') resume(p); break;
      case 'dodge':
        p.x += p.dx * 1.8 / PEDS.dodge * dt; p.z += p.dz * 1.8 / PEDS.dodge * dt;
        if (p.st >= PEDS.dodge) {
          const a = p.after;
          if (a === 'R') flee(p, p.fromX, p.fromZ);
          else if (a === 'S') { setState(p, 'hang', 'shout', 2); p.face = FACE.angry; }
          else if (a === 'F') react.startFilm(p, 3);
          else resume(p);
        }
        break;
      case 'fall': fall(p, dt); break;
      case 'dazed': p.timer -= dt; if (p.timer <= 0) { setState(p, 'getup'); p.face = FACE.angry; } break;
      case 'getup': if (p.st >= PEDS.getUp) { resume(p); p.annoyed = 1.5; p.slow = 10; p.face = FACE.angry; events.emit('ped:gotup', { id: p.id, kind: p.kind, x: p.x, z: p.z }); } break;
      case 'down': p.downT += dt; if (p.downT > HIT.downFor || (p.downT > HIT.downUnseen && !inView(p.x, p.z))) remove(p); break;
      default: break;        // 'crowd': the crowd moves its members
    }
    if (p.state !== 'fall') p.y = ground(p.x, p.z);
    if (p.v > 0) p.phase += p.v * dt * 3.4 / (1 + 0.16 * Math.max(0, p.v - 2));
  }

  Object.assign(sim, {
    add, remove, setState, flee, hit, resume, streetCount, hang, blast,
    downs() { let n = 0; for (const p of list) if (p.state === 'down') n++; return n; },
    clear() { while (list.length) remove(list[list.length - 1]); filled = false; },
    release(p) { p.crowd = null; p.street = true; resume(p); },
    fill() { sim.retarget(); for (let n = 0; n < 400 && streetCount() < sim.target; n++) spawnOne(true); filled = true; },
    retarget() {
      const f = sim.focus, hour = state.clock.hour;
      let target = Math.min(sim.streetCap, Math.round(targetFor(map.districtAt(f.x, f.z), hour) * sim.streetCap / 60 * sim.weather));
      for (const c of crowds) if (c.streetCap !== undefined && Math.hypot(c.x - f.x, c.z - f.z) < 150) target = Math.min(target, c.streetCap);
      sim.target = Math.min(target, sim.cap - (list.length - streetCount()));
      return sim.target;
    },
    step(dt) {
      time += dt; sim.time = time; tick++; brain = tick % 12;      // brain 0: the 5 Hz decisions
      const f = sim.focus;
      if (Math.hypot(f.x - lastFx, f.z - lastFz) > 80) filled = false;     // a jump (a teleport, a reset): fill round the new place
      lastFx = f.x; lastFz = f.z;
      spawnWait -= dt;
      if (sim.paused) spawnWait = 0.1;
      else if (!filled) sim.fill();
      else if (spawnWait <= 0) {
        spawnWait = 0.1; sim.retarget();
        const n = streetCount();
        if (n < sim.target) { spawnOne(false); if (n < sim.target - 6) spawnOne(false); }
        else if (n > sim.target + 1) {       // too many (night fell, a crowd formed): the farthest one out of view goes
          let worst = null, wd = 30;
          for (const p of list) if (p.street && !p.rope) { const d = Math.hypot(p.x - f.x, p.z - f.z); if (d > wd && !inView(p.x, p.z)) { wd = d; worst = p; } }
          if (worst) remove(worst);
        }
      }
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        if (p.state === 'crowd') continue;
        const dx = p.x - f.x, dz = p.z - f.z, d2 = dx * dx + dz * dz;
        if (d2 > PEDS.gone * PEDS.gone && p.street) { remove(p); continue; }
        const near = d2 < PEDS.full * PEDS.full || p.rope;
        if (near) {
          if (cars.length && p.state !== 'down') carsAndPeople(p);
          stepOne(p, dt, true);
        } else if ((p.id + tick) % 6 === 0) stepOne(p, dt * 6, false);
      }
      // personal space, five times a second: someone close ahead means a step to the right
      if (brain === 3) {
        for (const p of list) {
          if (p.state !== 'walk' || (p.x - f.x) * (p.x - f.x) + (p.z - f.z) * (p.z - f.z) > PEDS.full * PEDS.full) continue;
          let crowded = false;
          const fx = Math.sin(p.h), fz = Math.cos(p.h);
          for (const q of list) {
            if (q === p) continue;
            const dx = q.x - p.x, dz = q.z - p.z;
            if (Math.abs(dx) < PEDS.space && Math.abs(dz) < PEDS.space && dx * fx + dz * fz > 0) { crowded = true; break; }
          }
          if (!crowded && f.onFoot) { const dx = f.x - p.x, dz = f.z - p.z; crowded = Math.abs(dx) < PEDS.space && Math.abs(dz) < PEDS.space && dx * fx + dz * fz > 0; }
          p.want = crowded ? Math.min(1.1, p.off + 0.6) : Math.max(0.2, (p.want ?? p.off) - 0.1);
          p.side = crowded ? 1 : 0;
        }
      }
      react.step(dt);
    },
  });
  events.on('weather:changed', (d) => { sim.weather = d && d.kind in WEATHER ? WEATHER[d.kind] : 1; });
  return sim;
}
