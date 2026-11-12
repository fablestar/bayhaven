// Scripted vehicles for missions: a mission file's `actors` are driven here, on rails, along the
// path the file gives. An actor is a vehicle the traffic module stands on the street (so the player
// crashes into it like any car) that this file moves by hand, as the ambulance is moved.
//   look: 'tow'   a boom, a swinging hook and a flashing amber light (the tow truck until the Remora exists)
//   carry         another model hung from the hook until `release`
// A heading of 0 faces +z; forward is (sin h, cos h); the right-hand side is (-cos h, sin h).
import * as THREE from 'three';
import { createParkedCar } from '../vehicles/models.js';

const NUM = { accel: 4, brake: 8, look: 4, cornerAhead: 18, cornerAt: 0.3, dodge: 3.4, dodgeSee: 28, goneAt: 190, surge: 9, surgeFor: 5, surgeBrake: 2.2, slideKeep: 0.7, slideSide: 1.0, slideDrag: 5, hookK: 30, hookC: 2.2, hookMax: 0.9 };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dark = new THREE.MeshBasicMaterial({ color: 0x3b3946 }), steel = new THREE.MeshBasicMaterial({ color: 0xc8ccd2 });

export function createActors(ctx) {
  const m = ctx.modules, S = ctx.state, traffic = m.traffic, map = m.map;
  const list = new Map();
  const ok = !!(traffic && traffic.spawn && !traffic.disabled);
  const onStreet = (v) => !!v && (traffic.wrecks.includes(v) || traffic.loose.includes(v));

  // ---- the path: a polyline with running lengths ----
  function makePath(points) {
    const pts = points.map((p) => ({ x: p[0], z: p[1] })), cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z));
    return { raw: points, pts, cum, total: cum[cum.length - 1] };
  }
  function pointAt(path, s, out) {
    const { pts, cum } = path; let i = 1;
    s = clamp(s, 0, path.total);
    while (i < pts.length - 1 && cum[i] < s) i++;
    const a = pts[i - 1], b = pts[i], k = (s - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]);
    out.x = a.x + (b.x - a.x) * k; out.z = a.z + (b.z - a.z) * k;
    return out;
  }
  function nearestS(path, x, z) {
    let best = 0, bd = 1e18;
    for (let i = 1; i < path.pts.length; i++) {
      const a = path.pts[i - 1], b = path.pts[i], dx = b.x - a.x, dz = b.z - a.z, L = dx * dx + dz * dz || 1;
      const k = clamp(((x - a.x) * dx + (z - a.z) * dz) / L, 0, 1), px = a.x + dx * k, pz = a.z + dz * k, d = (px - x) * (px - x) + (pz - z) * (pz - z);
      if (d < bd) { bd = d; best = path.cum[i - 1] + Math.sqrt(L) * k; }
    }
    return best;
  }
  const A = { x: 0, z: 0 }, B = { x: 0, z: 0 }, C = { x: 0, z: 0 };
  // where the rails put it at `s`: corners are cut by taking the middle of two points 4 m either side
  function pose(a, out) {
    const p = a.path, s = a.s;
    pointAt(p, s - NUM.look, A); pointAt(p, s + NUM.look, B);
    if (s < NUM.look) { pointAt(p, 0, A); pointAt(p, NUM.look * 2, B); pointAt(p, s, C); out.x = C.x; out.z = C.z; }
    else if (s > p.total - NUM.look) { pointAt(p, p.total - NUM.look * 2, A); pointAt(p, p.total, B); pointAt(p, s, C); out.x = C.x; out.z = C.z; }
    else { out.x = (A.x + B.x) / 2; out.z = (A.z + B.z) / 2; }
    out.h = Math.atan2(B.x - A.x, B.z - A.z);
    return out;
  }

  // ---- what a tow truck wears ----
  function dress(a) {
    const g = new THREE.Group(), hl = a.v.hl;
    if (a.def.look === 'tow') {
      const boom = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 2.0), dark);
      boom.position.set(0, 1.75, -hl + 0.75); boom.rotation.x = 0.55; g.add(boom);
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.16), dark); post.position.set(0, 1.2, -hl + 1.55); g.add(post);
      const pivot = new THREE.Group(); pivot.position.set(0, 2.27, -hl - 0.1); g.add(pivot);
      const cable = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.05), steel); cable.position.y = -0.45; pivot.add(cable);
      const hook = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.2), steel); hook.position.y = -0.95; pivot.add(hook);
      a.pivot = pivot;
      a.lightMat = new THREE.MeshBasicMaterial({ color: 0xffa02e });
      const bar = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.16, 0.26), a.lightMat); bar.position.set(0, 1.92, 0.35); g.add(bar);
    }
    if (a.def.carry) hang(a);
    a.group = g; ctx.scene.add(g);
  }
  function hang(a) {
    const c = a.def.carry, mesh = createParkedCar(c.paint, 0x29e6ff, c.model);
    mesh.rotation.x = -1.15; mesh.position.set(0, -1.75, -0.35);          // by its front wheel, nose up
    (a.pivot || a.group).add(mesh);
    a.carried = mesh; a.carrying = true;
  }
  function undress(a) {
    if (!a.group) return;
    ctx.scene.remove(a.group);
    a.group.traverse((o) => { if (o.isMesh && o !== a.carried) o.geometry.dispose(); });
    if (a.carried) a.carried.geometry.dispose();
    if (a.lightMat) a.lightMat.dispose();
    a.group = a.pivot = a.carried = a.lightMat = null;
  }

  // ---- make, place, remove ----
  function stand(a, x, z, h) {
    const v = traffic.spawn(a.def.model, x, z, h);
    if (a.def.paint != null) { v.paint = a.def.paint; if (a.def.accent != null) v.accent = a.def.accent; }
    v.actor = a.name; a.v = v;
    return v;
  }
  function spawn(name, def, at) {
    if (!ok) return null;
    remove(name);
    const a = { name, def, path: makePath(def.path), s: 0, speed: 0, want: def.speed || 12, weave: 0, phase: 0, lat: 0, dodge: 0, dodgeT: 0, going: false, after: 0,
      carrying: false, leaving: false, done: false, free: false, swing: 0, swingV: 0, x: 0, z: 0, h: 0 };
    if (at && at.s != null) a.s = at.s;
    else if (at && at.x != null && !at.exact) a.s = nearestS(a.path, at.x, at.z);
    const p = pose(a, {});
    if (at && at.exact) { p.x = at.x; p.z = at.z; p.h = at.h ?? p.h; }
    Object.assign(a, p);
    stand(a, p.x, p.z, p.h);
    dress(a);
    list.set(name, a);
    return a;
  }
  function remove(name) {
    const a = list.get(name);
    if (!a) return;
    undress(a);
    if (onStreet(a.v)) traffic.despawn(a.v);
    list.delete(name);
  }
  function clear(keepLeaving) { for (const a of [...list.values()]) { if (keepLeaving && a.going && !a.done) { a.leaving = true; continue; } remove(a.name); } }

  // an order from a step's `set`: { go, speed, weave, after, leave }
  function command(name, def, o) {
    let a = list.get(name);
    if (!a) a = spawn(name, def);
    if (!a) return null;
    if (o.speed != null) a.want = o.speed;
    if (o.weave != null) a.weave = o.weave;
    if (o.leave) a.leaving = true;
    if (o.go) {
      a.after = o.after || 0;
      if (a.free) a.rejoin = true;          // it is lying in the road: its path will start where it lies when it sets off
      a.going = true; a.done = false;
    } else if (o.go === false) a.going = false;
    return a;
  }
  // the carrier lets go: the load becomes a vehicle of its own, sliding to rest with its brakes on
  function release(name, defs) {
    const a = list.get(name);
    if (!a || !a.carrying) return null;
    const c = a.def.carry, sn = Math.sin(a.h), cs = Math.cos(a.h);
    if (a.carried) { a.carried.removeFromParent(); a.carried.geometry.dispose(); a.carried = null; }
    a.carrying = false; a.swingV += 3;
    const def = (defs && defs[c.id]) || { model: c.model, paint: c.paint, path: [[a.x, a.z], [a.x + sn * 20, a.z + cs * 20]] };
    // it lands beside the carrier's tail, on the kerb side, and slides: moved by hand so it keeps sliding (the physics would brake it in half a second)
    const d = spawn(c.id, def, { x: a.x - sn * (a.v.hl + 1.0) - cs * 1.3, z: a.z - cs * (a.v.hl + 1.0) + sn * 1.3, h: a.h + 0.5, exact: true });
    if (!d) return null;
    const v0 = Math.max(4, a.speed * NUM.slideKeep);
    d.slide = { vx: sn * v0 - cs * NUM.slideSide, vz: cs * v0 + sn * NUM.slideSide, w: 2.6 };
    d.v.lean = 1.25; d.free = true;
    return d;
  }
  // a ram: the driver floors it for a moment, which opens the gap the next ram needs
  const jolt = (name, by = NUM.surge) => { const a = list.get(name); if (a) { a.speed = Math.min(a.speed + by, a.want + by); a.surgeT = NUM.surgeFor; a.swingV += 2.4; if (m.damage && m.damage.repair && a.v) m.damage.repair(a.v); } };

  // ---- each step ----
  const P = {};
  function blockedAhead(a, lat) {
    const v = a.v, sn = Math.sin(a.h), cs = Math.cos(a.h), reach = NUM.dodgeSee;
    let near = 1e9;
    const see = (o) => {
      if (o === v || o.actor) return;
      const rx = o.x - a.x, rz = o.z - a.z, fwd = rx * sn + rz * cs, side = -(rx * cs - rz * sn) - lat;        // side: metres to the right of where it would be
      if (fwd > v.hl && fwd < reach + o.hl && Math.abs(side) < v.hw + o.hw + 0.5 && (o.vf || 0) < a.speed - 2) near = Math.min(near, fwd - v.hl - o.hl);
    };
    for (const o of traffic.all) if (Math.abs(o.x - a.x) < 40 && Math.abs(o.z - a.z) < 40) see(o);
    see(m.vehicles.player);
    return near;
  }
  function move(a, dt) {
    const v = a.v;
    if (a.after > 0) { a.after -= dt; return; }
    if (a.rejoin) {              // the path starts where it lies, and joins the file's line 12 m on
      const full = makePath(a.def.path), s0 = nearestS(full, v.x, v.z), join = pointAt(full, s0 + 12, {}), rest = full.raw.filter((p, i) => full.cum[i] > s0 + 14);
      a.path = makePath([[v.x, v.z], [join.x, join.z], ...rest]); a.s = 0; a.speed = 0; a.rejoin = false; a.pendingFree = true; a.slide = null; v.lean = 0;
    }
    if (a.pendingFree || v.kind !== 'wreck') { traffic.wreck(v); a.pendingFree = false; a.free = false; }       // taken back from the physics (a ram knocks it loose for a step)
    v.placed = true; v.parked = false; v.ridden = !!a.def.ridden;
    // speed: the order, less at a corner, less behind something it cannot pass
    let want = a.want;
    pointAt(a.path, a.s + NUM.cornerAhead, A); pointAt(a.path, a.s + NUM.cornerAhead + 4, B);
    let turn = Math.atan2(B.x - A.x, B.z - A.z) - a.h; while (turn > Math.PI) turn -= 6.2832; while (turn < -Math.PI) turn += 6.2832;
    if (Math.abs(turn) > NUM.cornerAt) want = Math.min(want, a.def.corner || 8);
    a.dodgeT -= dt;
    if (a.dodgeT <= 0) {
      a.dodgeT = 0.2;
      const here = blockedAhead(a, 0);
      if (here > 1e8) a.dodgeWant = 0;
      else { const left = blockedAhead(a, -NUM.dodge); a.dodgeWant = left > here ? -NUM.dodge : 0; a.gap = Math.max(here, left); }
      if (a.dodgeWant === 0 && here > 1e8) a.gap = 1e9;
    }
    if (a.gap < 7) want = Math.min(want, Math.max(0, a.gap - 2) * 1.5);
    if (a.s >= a.path.total - 0.5) { want = 0; a.done = true; }
    a.surgeT = Math.max(0, (a.surgeT || 0) - dt);
    a.speed += clamp(want - a.speed, -(a.surgeT > 0 ? NUM.surgeBrake : NUM.brake) * dt, NUM.accel * dt);
    a.s = Math.min(a.path.total, a.s + a.speed * dt);
    a.dodge += clamp((a.dodgeWant || 0) - a.dodge, -4 * dt, 4 * dt);
    a.phase += dt * 1.5;
    const wob = a.weave ? Math.sin(a.phase) * a.weave : 0, h0 = a.h;
    pose(a, P);
    const lat = a.dodge + wob, cs = Math.cos(P.h), sn = Math.sin(P.h);
    a.x = P.x - cs * lat; a.z = P.z + sn * lat;
    a.h = P.h - (a.weave ? Math.cos(a.phase) * a.weave * 1.5 / Math.max(6, a.speed) : 0);
    v.x = a.x; v.z = a.z; v.h = a.h; v.y = map.heightAt(a.x, a.z);
    v.vf = a.speed; v.vl = 0; v.w = 0; v.spin = (v.spin || 0) + a.speed / 0.36 * dt; v.braking = want < a.speed - 0.5;
    // the hook: a damped pendulum pushed by turning and by every ram
    let dh = a.h - h0; while (dh > Math.PI) dh -= 6.2832; while (dh < -Math.PI) dh += 6.2832;
    a.swingV += (-NUM.hookK * a.swing - NUM.hookC * a.swingV) * dt + dh * a.speed * 0.9;
    a.swing = clamp(a.swing + a.swingV * dt, -NUM.hookMax, NUM.hookMax);
  }
  function update(dt) {
    if (!ok) return;
    const px = S.player.x, pz = S.player.z;
    for (const a of [...list.values()]) {
      if (!onStreet(a.v)) stand(a, a.x, a.z, a.h);              // the street was emptied under it (a clip, a quality change)
      if (a.going && !(a.slide && a.after > 0)) move(a, dt);
      else if (a.slide) {
        if (a.going) a.after -= dt;          // a dropped load sliding to rest, spinning, until it stops or something hits it
        const v = a.v, q = a.slide, sp = Math.hypot(q.vx, q.vz), k = Math.max(0, sp - NUM.slideDrag * dt) / (sp || 1);
        if (v.kind !== 'wreck' || sp < 0.3) { a.slide = null; if (v.kind === 'wreck') { v.vf = v.vl = 0; } continue; }
        q.vx *= k; q.vz *= k; q.w *= 1 - 1.2 * dt;
        a.x += q.vx * dt; a.z += q.vz * dt; a.h += q.w * dt; a.speed = sp;
        v.x = a.x; v.z = a.z; v.h = a.h; v.y = map.heightAt(a.x, a.z); v.vf = 0; v.vl = 0; v.placed = true; v.lean = 1.25;
      } else {
        const v = a.v; a.x = v.x; a.z = v.z; a.h = v.h; a.speed = Math.hypot(v.vf || 0, v.vl || 0);
        if (v.kind === 'wreck') v.placed = true;
        a.swingV += (-NUM.hookK * a.swing - NUM.hookC * a.swingV) * dt; a.swing = clamp(a.swing + a.swingV * dt, -NUM.hookMax, NUM.hookMax);
      }
      if (a.leaving && (a.done || Math.hypot(a.x - px, a.z - pz) > NUM.goneAt)) remove(a.name);
    }
  }
  function draw(time) {
    for (const a of list.values()) {
      if (!a.group) continue;
      const v = a.v;
      a.group.position.set(v.x, v.y || 0, v.z); a.group.rotation.y = v.h;
      if (a.pivot) { a.pivot.rotation.z = a.swing; a.pivot.rotation.x = a.swing * 0.4; }
      if (a.lightMat) a.lightMat.color.setHex((time * 2.5) % 1 < 0.5 ? 0xffa02e : 0x6b4210).multiplyScalar((time * 2.5) % 1 < 0.5 ? 1.7 : 1);
    }
  }

  // ---- for checkpoints ----
  function snapshot() {
    const out = {};
    for (const a of list.values()) out[a.name] = { x: a.x, z: a.z, h: a.h, s: a.s, speed: a.speed, want: a.want, weave: a.weave, going: a.going, carrying: a.carrying, leaving: a.leaving, free: a.free, raw: a.path.raw };
    return out;
  }
  function restore(snap, defs) {
    clear(false);
    for (const name in snap) {
      const q = snap[name], def = defs[name];
      if (!def || q.leaving) continue;
      const a = spawn(name, { ...def, path: q.raw }, q.free ? { x: q.x, z: q.z, h: q.h, exact: true } : { s: q.s });
      if (!a) continue;
      a.def = def;
      Object.assign(a, { want: q.want, weave: q.weave, going: q.going, free: q.free, speed: q.going ? q.speed : 0 });
      if (!q.carrying && a.carrying) { a.carried.removeFromParent(); a.carried.geometry.dispose(); a.carried = null; a.carrying = false; }
    }
  }

  return {
    ok, list, numbers: NUM, spawn, remove, clear, command, release, jolt, update, draw, snapshot, restore,
    get: (name) => list.get(name) || null,
    tail(a, out = {}) { out.x = a.x - Math.sin(a.h) * a.v.hl; out.z = a.z - Math.cos(a.h) * a.v.hl; return out; },
    info: () => [...list.values()].map((a) => ({ name: a.name, model: a.def.model, x: a.x, z: a.z, h: a.h, s: a.s, speed: a.speed, going: a.going, carrying: a.carrying, leaving: a.leaving,
      free: a.free, done: a.done, kind: a.v.kind, swing: a.swing, id: a.v.id })),
  };
}
