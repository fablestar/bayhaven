// Enemies on foot: security guards and rival crew. A small state machine each (plan/bible/systems/combat-stealth.md):
// post → callout → engage ⇄ cover → search → post, flee when alone and hurt, floor (knocked over), down (for good).
// They fire two or three shots and wait 1.5 to 3 s, hold fire while a bystander is in the line, crouch behind the
// far side of a car and lean out to shoot. No three.js here; combat-draw.js draws them.
import { WHO, COMBAT, WEAPONS, BARKS } from '../content/weapons.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// where a segment enters a vehicle's turned box (0..1 along it), or -1. grow widens the box.
export function segBox(x0, z0, x1, z1, v, grow = 0) {
  const sn = Math.sin(v.h), cs = Math.cos(v.h), hw = v.hw + grow, hl = v.hl + grow;
  const ax = x0 - v.x, az = z0 - v.z, bx = x1 - v.x, bz = z1 - v.z;
  const f0 = ax * sn + az * cs, l0 = ax * cs - az * sn, df = bx * sn + bz * cs - f0, dl = bx * cs - bz * sn - l0;
  let t0 = 0, t1 = 1;
  for (const [o, d, h] of [[f0, df, hl], [l0, dl, hw]]) {
    if (Math.abs(d) < 1e-9) { if (Math.abs(o) > h) return -1; continue; }
    let a = (-h - o) / d, b = (h - o) / d; if (a > b) { const s = a; a = b; b = s; }
    if (a > t0) t0 = a; if (b < t1) t1 = b; if (t0 > t1) return -1;
  }
  return t0;
}
// distance from a point to a segment, and how far along it
export function segPoint(x0, z0, x1, z1, px, pz) {
  const dx = x1 - x0, dz = z1 - z0, l2 = dx * dx + dz * dz || 1, t = clamp(((px - x0) * dx + (pz - z0) * dz) / l2, 0, 1);
  return { d: Math.hypot(px - (x0 + dx * t), pz - (z0 + dz * t)), t };
}

export function createGuards(env) {
  // env: { collide, map, events, rnd, cars() → vehicles near the fight, peds() → people near it, player (x z speed sprinting down inCar),
  //        hurtPlayer(dmg, opts), fx, say(who, text), inView(x, z), cap() → most standing, lying() → most lying }
  const list = [], stats = { spawned: 0, shots: 0, hits: 0, held: 0, covers: 0, fled: 0, downs: 0, barks: 0, removed: 0 };
  const body = { x: 0, z: 0, r: 0.35, level: 0 };
  let nextId = 1, time = 0;
  const rnd = env.rnd, pick = (a) => a[Math.floor(rnd() * a.length) % a.length], between = (a) => a[0] + rnd() * (a[1] - a[0]);
  const wall = (x0, z0, x1, z1) => { const h = env.collide.ray(x0, z0, x1, z1, 0, 1.2); return !!h && h.t < 0.97; };
  const carOn = (x0, z0, x1, z1, skip) => { for (const v of env.cars()) if (v !== skip && segBox(x0, z0, x1, z1, v) >= 0) return v; return null; };
  const standing = (g) => g.state !== 'down';
  function set(g, st) { g.state = st; g.st = 0; }
  function bark(g, kind) { if (time - g.barkT < 2.5) return; g.barkT = time; stats.barks++; env.say(WHO[g.kind].name, pick(BARKS[kind])); }

  function add(x, z, h = 0, o = {}) {
    if (list.filter(standing).length >= env.cap()) return null;
    const K = WHO[o.kind] ? o.kind : 'guard', W = WHO[K];
    const g = { id: 'g' + nextId++, kind: K, look: W, x, z, y: env.map.heightAt(x, z), h, health: o.health || W.health, max: o.health || W.health, vest: W.vest,
      weapon: W.carries, hostile: !!o.hostile, state: 'post', st: 0, pose: 'stand', phase: 0, post: { x, z, h }, seen: { x, z }, unseenT: 0, sees: false,
      burst: 0, shotT: 0, wait: 0.6 + rnd() * 0.8, cover: null, lean: 0, coverT: 0, wantCover: false, exposed: 0, flash: 0, stagger: 0, floorT: 0, downT: 0, barkT: -9, attacking: false, shots: 0 };
    list.push(g); stats.spawned++;
    return g;
  }
  function remove(g) { const i = list.indexOf(g); if (i >= 0) { list.splice(i, 1); stats.removed++; } }
  function alert(g) { for (const o of list) if (o !== g && standing(o) && Math.hypot(o.x - g.x, o.z - g.z) < COMBAT.allyHears) { o.hostile = true; if (o.state === 'post' || o.state === 'search') set(o, 'engage'); } }
  function ally(g, r) { let best = null, bd = r; for (const o of list) { if (o === g || !standing(o) || o.state === 'flee') continue; const d = Math.hypot(o.x - g.x, o.z - g.z); if (d < bd) { bd = d; best = o; } } return best; }

  function move(g, x, z, speed, dt) {
    const dx = x - g.x, dz = z - g.z, d = Math.hypot(dx, dz);
    if (d < 0.05) return true;
    const k = Math.min(d, speed * dt) / d;
    body.x = g.x + dx * k; body.z = g.z + dz * k;
    env.collide.pushOutCircle(body);
    for (const v of env.cars()) {                       // round a car, not through it
      const sn = Math.sin(v.h), cs = Math.cos(v.h), rx = body.x - v.x, rz = body.z - v.z, f = rx * sn + rz * cs, l = rx * cs - rz * sn;
      const pf = v.hl + 0.35 - Math.abs(f), pl = v.hw + 0.35 - Math.abs(l);
      if (pf <= 0 || pl <= 0) continue;
      if (pl < pf) { const s = (l >= 0 ? 1 : -1) * pl; body.x += cs * s; body.z -= sn * s; } else { const s = (f >= 0 ? 1 : -1) * pf; body.x += sn * s; body.z += cs * s; }
    }
    g.x = body.x; g.z = body.z; g.h = Math.atan2(dx, dz); g.phase += speed * dt * 3.2; g.pose = 'run';
    return d <= speed * dt + 0.05;
  }

  // the far side of a car within 15 m: a spot the player cannot see, with a lean point 1.1 m along the car that he can
  function findCover(g, P) {
    let best = null, score = 1e9;
    for (const v of env.cars()) {
      if (Math.hypot(v.x - g.x, v.z - g.z) > COMBAT.coverWithin || (v.health !== undefined && v.health < 20) || Math.hypot(v.vf || 0, v.vl || 0) > 1) continue;
      const sn = Math.sin(v.h), cs = Math.cos(v.h);
      for (const side of [-1, 1]) for (const end of [-1, 1]) {
        const l = side * (v.hw + COMBAT.coverOut), f = end * (v.hl - 0.5), lf = end * (v.hl + 0.9);
        const x = v.x + sn * f + cs * l, z = v.z + cs * f - sn * l, lx = v.x + sn * lf + cs * l, lz = v.z + cs * lf - sn * l;
        if (segBox(x, z, P.x, P.z, v) < 0 || segBox(lx, lz, P.x, P.z, v) >= 0) continue;
        if (env.collide.circle(x, z, 0.3, 0, []) > 0) continue;
        const s = Math.hypot(x - g.x, z - g.z) + 0.5 * Math.hypot(x - P.x, z - P.z);
        if (s < score) { score = s; best = { x, z, lx, lz, v, vx: v.x, vz: v.z }; }
      }
    }
    return best;
  }

  function shoot(g, P, d, dt) {
    const W = WEAPONS[g.weapon];
    g.shotT = W.every; g.burst--; g.shots++; g.attacking = true;
    if (g.burst <= 0) g.wait = between(COMBAT.wait);
    // a bystander in the line: hold fire
    for (const p of env.peds()) if (p.state !== 'down' && segPoint(g.x, g.z, P.x, P.z, p.x, p.z).d < 0.6) { stats.held++; return; }
    const car = carOn(g.x, g.z, P.x, P.z, P.inCar ? P.car : null);
    const chance = clamp(COMBAT.hitBase - d / COMBAT.hitFall, COMBAT.hitMin, COMBAT.hitBase) * (P.sprinting ? COMBAT.sprintDodge : 1) * (car ? COMBAT.coverDodge : 1);
    const hit = rnd() < chance, ux = (P.x - g.x) / (d || 1), uz = (P.z - g.z) / (d || 1);
    stats.shots++;
    if (env.fx) {
      env.fx.bit(g.x + ux * 0.7, g.y + 1.4, g.z + uz * 0.7, ux * 220, 0, uz * 220, { life: 0.08, grav: 0, len: 0.5, w: 0.03 });
      if (!hit && car) env.fx.sparks(car.x, 0.9, car.z, -ux, -uz, 3);
    }
    env.events.emit('weapon:fired', { weapon: g.weapon, x: g.x, z: g.z, by: g.kind, id: g.id, hit });
    if (hit) { stats.hits++; env.hurtPlayer(W.damage, { ranged: true, weapon: g.weapon, by: g.kind, id: g.id, x: g.x, z: g.z }); }
  }
  function fire(g, P, d, dt) {
    if (d > WEAPONS[g.weapon].range || P.down) return;
    if (g.burst <= 0) { g.wait -= dt; if (g.wait <= 0) { g.burst = COMBAT.burst[0] + Math.floor(rnd() * (COMBAT.burst[1] - COMBAT.burst[0] + 1)); g.shotT = 0; } return; }
    g.shotT -= dt;
    if (g.shotT <= 0) shoot(g, P, d, dt);
  }
  function alone(g) { return g.health < g.max * COMBAT.aloneUnder && !ally(g, COMBAT.aloneWithin); }

  function stepOne(g, dt, P) {
    g.st += dt; if (g.flash > 0) g.flash -= dt; if (g.coverT > 0) g.coverT -= dt;
    g.y = env.map.heightAt(g.x, g.z);
    if (g.state === 'down') { g.downT += dt; if ((g.downT > COMBAT.downFor && !env.inView(g.x, g.z)) || g.downT > COMBAT.downSeen) remove(g); return; }
    if (g.state === 'floor') { g.pose = 'floor'; if (g.st >= COMBAT.floored) { g.hostile = true; set(g, 'engage'); } return; }
    if (g.stagger > 0) { g.stagger -= dt; g.pose = 'stand'; return; }
    const d = Math.hypot(P.x - g.x, P.z - g.z), face = () => { g.h = Math.atan2(P.x - g.x, P.z - g.z); };
    g.sees = d < 60 && !P.down && !wall(g.x, g.z, P.x, P.z);
    if (g.sees) { g.seen.x = P.x; g.seen.z = P.z; g.unseenT = 0; } else g.unseenT += dt;
    g.attacking = false;
    switch (g.state) {
      case 'post':
        g.pose = 'stand';
        if (g.hostile && g.sees) { set(g, 'callout'); bark(g, 'callout'); alert(g); }
        else if (Math.hypot(g.post.x - g.x, g.post.z - g.z) > 0.5) move(g, g.post.x, g.post.z, COMBAT.walk, dt); else g.h = g.post.h;
        break;
      case 'callout': face(); g.pose = 'aim'; if (g.st >= 1) set(g, 'engage'); break;
      case 'engage': {
        if (alone(g)) { set(g, 'flee'); stats.fled++; bark(g, 'flee'); break; }
        if (!g.sees) { if (g.unseenT > COMBAT.unseen) { set(g, 'search'); bark(g, 'search'); } else move(g, g.seen.x, g.seen.z, COMBAT.run, dt); break; }
        if ((g.wantCover || g.health < g.max / 2) && g.coverT <= 0) {
          g.wantCover = false; g.coverT = env.coverEvery ? env.coverEvery() : 0.4;
          const c = findCover(g, P);
          if (c) { g.cover = c; g.lean = 0; g.wait = between(COMBAT.wait) * 0.5; stats.covers++; set(g, 'cover'); bark(g, 'cover'); break; }
        }
        const reach = g.weapon === 'fists' ? 1.2 : 18;
        if (d > reach) move(g, P.x, P.z, COMBAT.run, dt); else { face(); g.pose = 'aim'; }
        if (d <= WEAPONS[g.weapon].range) { if (g.pose !== 'run') fire(g, P, d, dt); else { g.wait -= dt; } }
        break;
      }
      case 'cover': {
        const c = g.cover, v = c.v;
        if (alone(g)) { set(g, 'flee'); stats.fled++; bark(g, 'flee'); break; }
        const moved = Math.hypot(v.x - c.vx, v.z - c.vz) > 1 || v.gone || v.dead, burning = v.health !== undefined && v.health < 20;
        const flanked = g.lean <= 0 && g.st > 1 && segBox(c.x, c.z, P.x, P.z, v) < 0;
        if (burning) { g.cover = null; g.coverT = 3; set(g, 'engage'); break; }             // it is about to explode
        if (moved || flanked) { g.exposed += dt; g.pose = 'stand'; face(); if (g.exposed >= 1) { g.exposed = 0; g.cover = null; g.coverT = 0; g.wantCover = true; set(g, 'engage'); } break; }
        g.exposed = 0;
        if (g.unseenT > COMBAT.unseen + 3 && g.lean <= 0) { set(g, 'search'); break; }
        if (g.lean > 0) {                    // out from behind the car for 0.8 s, firing
          g.lean -= dt;
          if (!move(g, c.lx, c.lz, COMBAT.run, dt)) break;
          face(); g.pose = 'aim';
          if (g.burst > 0 && !wall(g.x, g.z, P.x, P.z)) { g.shotT -= dt; if (g.shotT <= 0) shoot(g, P, d, dt); }
          if (g.lean <= 0) { g.burst = 0; g.wait = between(COMBAT.wait); }
          break;
        }
        if (!move(g, c.x, c.z, COMBAT.run, dt)) break;
        face(); g.pose = 'crouch';
        g.wait -= dt;
        if (g.wait <= 0) { g.lean = COMBAT.lean; g.burst = COMBAT.burst[0] + Math.floor(rnd() * 2); g.shotT = 0.15; }
        break;
      }
      case 'search':
        if (g.sees && g.hostile) { set(g, 'engage'); break; }
        if (Math.hypot(g.seen.x - g.x, g.seen.z - g.z) > 1.5 && g.st < 20) { move(g, g.seen.x, g.seen.z, COMBAT.walk * 1.4, dt); g.lookT = 0; }
        else { g.pose = 'stand'; g.h += dt * 0.8; g.lookT = (g.lookT || 0) + dt; if (g.lookT > COMBAT.search) set(g, 'post'); }
        break;
      case 'flee': {
        const a = ally(g, 80);
        if (a) { if (move(g, a.x, a.z, COMBAT.flee, dt) || Math.hypot(a.x - g.x, a.z - g.z) < 6) set(g, 'engage'); }
        else { const k = d || 1; move(g, g.x + (g.x - P.x) / k * 10, g.z + (g.z - P.z) / k * 10, COMBAT.flee, dt); if (d > 120 || (d > 60 && !env.inView(g.x, g.z))) remove(g); }
        break;
      }
      default: break;
    }
  }

  return {
    list, stats, add, remove, findCover, standing,
    clear() { list.length = 0; },
    step(dt, P) {
      time += dt;
      for (const g of list.slice()) stepOne(g, dt, P);
      const lying = list.filter((g) => g.state === 'down');
      while (lying.length > env.lying()) remove(lying.shift());
    },
    // he was hit and lived: he turns on you, tells the others, and looks for a car to get behind
    onHit(g, o = {}) {
      g.hostile = true; g.flash = 0.12; g.wantCover = true; alert(g);
      if (o.floor) { set(g, 'floor'); g.cover = null; }
      else { if (o.stagger) g.stagger = Math.max(g.stagger, o.stagger); if (g.state === 'post' || g.state === 'search') { set(g, 'engage'); bark(g, 'hit'); } }
    },
    down(g) { set(g, 'down'); g.pose = 'down'; g.downT = 0; g.cover = null; g.attacking = false; stats.downs++; },
    info: (g) => ({ id: g.id, kind: g.kind, state: g.state, health: g.health, x: g.x, z: g.z, h: g.h, hostile: g.hostile, pose: g.pose, sees: g.sees, shots: g.shots, cover: g.cover ? { x: g.cover.x, z: g.cover.z } : null }),
  };
}
