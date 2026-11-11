// Traffic: who is on the road. Cars are spawned on lanes 120 to 260 m from the player where the
// camera cannot see, driven on rails by drive.js, and removed past 320 m. Parked cars come from
// each chunk's curb spaces. Anything hit hard enough becomes a full physics body until it comes
// to rest. See plan/bible/systems/traffic.md.
import { weighted } from '../core/rng.js';
import { Vehicle } from './vehicle.js';
import { SURFACES } from './handling.js';
import { MODEL_IDS, pickPaint, sheet } from './models.js';
import { DISTRICT_MIX } from '../content/vehicles.js';
import { startOn, drive, rejoin } from './drive.js';
import { overlap, closing, resolve, bumpWorld } from './crash.js';
import { curbSpaces } from './parked.js';

export const RING = { near: 120, far: 260, gone: 320, openRoad: 250, thin: 200 };
// moving cars wanted on `high` (out of 40) by district and hour band; other levels scale by their cap.
// Rush hour (x 1.5 at 08:00 and 17:30) and the quiet hour (x 0.3 at 03:00) are in these rows.
const BANDS = [0, 5, 7, 10, 16, 19, 24];
const DENSITY = { tideline: [10, 19, 40, 32, 40, 31], default: [8, 16, 34, 28, 34, 22] };
const BRAKES_ON = { steer: 0, gas: 0, brake: 0.3, handbrake: false };      // a stunned driver, foot half on the brake

// Cars wanted out of 40 at an hour, eased across each band edge over 30 game minutes.
export function density(district, hour) {
  const row = DENSITY[district] || DENSITY.default, h = ((hour % 24) + 24) % 24;
  let i = 0; while (i < 5 && h >= BANDS[i + 1]) i++;
  const next = row[(i + 1) % 6], prev = row[(i + 5) % 6], toNext = BANDS[i + 1] - h, fromPrev = h - BANDS[i];
  if (toNext < 0.25) return row[i] + (next - row[i]) * (0.5 - toNext * 2);
  if (fromPrev < 0.25) return row[i] + (prev - row[i]) * (0.5 - fromPrev * 2);
  return row[i];
}

// What drives in a place: the zone file's own `traffic` row if it has one, else the district's row
// from the bible, else the common mix. Models that do not exist yet drop out.
export function mixFor(zone, district, hour = 12) {
  const night = hour >= 20 || hour < 5;
  const row = (zone && zone.traffic) || (night && DISTRICT_MIX[district + '-night']) || DISTRICT_MIX[district] || DISTRICT_MIX.default, mix = {};
  for (const id of MODEL_IDS) mix[id] = row[id] || 0;
  return mix;
}

export function createTraffic({ map, nav, collide, chunks, signals, events, state, quality, camera, player, fleetCap }) {
  const cars = [], loose = [], wrecks = [], parked = [], others = [], all = [];
  const slotsByChunk = new Map(), tmp = [];
  let frame = 0, time = 0, lanesAt = null, laneList = [], scanAt = 0, parkT = 0, overT = 0, firstSeen = [];
  let seed = 20261111;
  const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const cfg = () => ({ cap: quality.get('trafficCap'), low: quality.level === 'low', high: quality.level === 'high' });
  const W = { cars, others, signals, time: 0, rnd, honk(c, seconds) { events.emit('traffic:honk', { x: c.x, z: c.z, id: c.id, seconds }); traffic.honks++; } };
  const env = { surfaceAt: () => SURFACES.road, collide: (v) => { v.wallLost = bumpWorld(v, collide); }, emit() {} };

  // ---- can the camera see a point? outside the view cone widened by 10 degrees, or behind a building ----
  const cam = { x: 0, z: 0, fx: 0, fz: 1, cos: 0 };
  function readCamera() {
    const e = camera.matrixWorld.elements, half = Math.atan(Math.tan((camera.fov * Math.PI) / 360) * camera.aspect) + 0.175;
    const l = Math.hypot(e[8], e[10]) || 1;
    cam.x = e[12]; cam.z = e[14]; cam.fx = -e[8] / l; cam.fz = -e[10] / l; cam.cos = Math.cos(Math.min(Math.PI, half));
  }
  function seen(x, z) {
    const dx = x - cam.x, dz = z - cam.z, d = Math.hypot(dx, dz);
    if (d < 1) return true;
    if ((dx * cam.fx + dz * cam.fz) / d < cam.cos) return false;
    const hit = collide.ray(cam.x, cam.z, x, z, 0, 2.5);
    return !hit || hit.t > 0.97;
  }

  function make(model, paint) {
    const c = new Vehicle(model), p = paint || pickPaint(model, rnd());
    Object.assign(c, { paint: p.paint, accent: p.accent, spin: 0, braking: false, blink: 0, parked: false, kind: 'traffic', restT: 0, wallLost: 0, slot: null, y: 0 });
    return c;
  }
  const drop = (list, c) => { const i = list.indexOf(c); if (i >= 0) { list[i] = list[list.length - 1]; list.pop(); } };

  // ---- spawning ----
  function nearLanes(px, pz) {
    const c = map.chunkOf(px, pz);
    if (lanesAt && lanesAt.cx === c.cx && lanesAt.cz === c.cz) return laneList;
    lanesAt = c; laneList = [];
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) for (const l of nav.lanesInChunk(c.cx + i, c.cz + j)) if (l.len > 16 && l.next.length) laneList.push(l);
    return laneList;
  }
  function trySpawn(px, pz, vx, vz) {
    const lanes = nearLanes(px, pz);
    if (!lanes.length) return false;
    for (let n = 0; n < 6; n++) {
      const l = lanes[Math.floor(rnd() * lanes.length)], s = 5 + rnd() * (l.len - 13);
      const x = l.ax + Math.sin(l.heading) * s, z = l.az + Math.cos(l.heading) * s, d = Math.hypot(x - px, z - pz);
      if (d < RING.near || d > RING.far) continue;
      if (vx * vx + vz * vz > 9 && (x - px) * vx + (z - pz) * vz < 0 && rnd() < 0.65) continue;        // most picks are ahead of the player
      if (d < RING.openRoad && seen(x, z)) continue;           // on a long open road nothing hides a spawn: only the far edge
      let clear = true;
      for (const o of cars) if (Math.abs(o.x - x) < 16 && Math.abs(o.z - z) < 16) { clear = false; break; }
      for (const o of others) if (Math.abs(o.x - x) < 10 && Math.abs(o.z - z) < 10) { clear = false; break; }
      if (!clear) continue;
      const zone = map.zoneAt(x, z), mix = mixFor(zone, (zone && zone.id) || state.world.district, state.clock ? state.clock.hour : 12);
      const c = make(weighted(rnd, mix));
      c.ridden = true;
      c.vf = Math.min(l.speed * 0.8, Math.sqrt(2 * 2 * Math.max(0.5, l.len - s - 6)));
      startOn(c, l, s, nav, rnd);
      c.y = map.heightAt(c.x, c.z); c.born = d;
      cars.push(c); collide.bodies.add(c);
      if (firstSeen.length < 400) firstSeen.push(d);
      return true;
    }
    return false;
  }
  function remove(c) {
    drop(cars, c); drop(loose, c); drop(wrecks, c); collide.bodies.remove(c);
    if (c.slot) { c.slot.car = null; drop(parked, c); }
  }

  // ---- parked cars: the nearest filled curb spaces in loaded chunks become vehicles ----
  function refreshParked(px, pz) {
    const c = map.chunkOf(px, pz), cap = quality.level === 'low' ? 24 : quality.level === 'high' ? 60 : 42, want = [];
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
      const cx = c.cx + i, cz = c.cz + j, k = cx + ',' + cz;
      if (!chunks.isLoaded(cx, cz)) continue;
      if (!slotsByChunk.has(k)) slotsByChunk.set(k, curbSpaces(map, cx, cz));
      for (const s of slotsByChunk.get(k)) if (!s.gone) { s.d = (s.x - px) * (s.x - px) + (s.z - pz) * (s.z - pz); want.push(s); }
    }
    want.sort((a, b) => a.d - b.d);
    want.length = Math.min(want.length, cap);
    for (const s of want) s.keep = true;
    for (let i = parked.length - 1; i >= 0; i--) { const v = parked[i]; if (!v.slot.keep) { v.slot.car = null; collide.bodies.remove(v); parked[i] = parked[parked.length - 1]; parked.pop(); } }
    for (const s of want) {
      s.keep = false;
      if (s.car) continue;
      // a space something already stands in (day 1's own parked cars, a kiosk) stays empty
      if (collide.circle(s.x, s.z, 1.7, 0, tmp) > 0) { s.gone = true; continue; }
      const v = make(s.model, s);
      Object.assign(v, { x: s.x, z: s.z, h: s.h, y: map.heightAt(s.x, s.z), parked: true, kind: 'parked', slot: s });
      s.car = v; parked.push(v); collide.bodies.add(v);
    }
  }

  // ---- knocked loose: the full handling step, brakes on, until it has been at rest for 3 s ----
  function knock(c) {
    if (c.kind === 'loose') return;
    if (c.slot) { c.slot.gone = true; c.slot.car = null; drop(parked, c); c.slot = null; c.wasParked = true; }
    if (c.kind !== 'traffic') c.wasParked = true;
    drop(cars, c); drop(wrecks, c);
    c.kind = 'loose'; c.parked = false; c.restT = 0; c.ai = null; c.blink = 0; c.lean = 0;
    loose.push(c);
  }
  function stepLoose(c, dt) {
    c.drive(BRAKES_ON, env);
    c.braking = true; c.spin += (c.vf / sheet(c.model).wheelR) * dt;
    if (Math.hypot(c.vf, c.vl) > 0.3) { c.restT = 0; return; }
    c.restT += dt;
    if (c.restT < 3) return;
    c.vf = c.vl = c.w = 0;
    drop(loose, c);
    if (!c.wasParked && rejoin(c, nav, rnd)) { c.kind = 'traffic'; cars.push(c); return; }
    c.kind = 'wreck'; c.parked = true; c.braking = false; c.leftT = 0; wrecks.push(c);       // left where it stopped
  }
  // one pair: a (the player or a loose car) against b
  function collidePair(a, b, awakeCap) {
    const h = overlap(a, b);
    if (!h) return;
    const cl = closing(a, b, h), free = b.kind === 'loose' || b.isPlayer;
    // a bus (a `pusher`) shoves aside anything it so much as leans on
    const wake = !free && (cl.dvB > 2 || (a.preset.pusher && !b.preset.pusher && cl.speed > 0.4)) && loose.length < awakeCap;
    if (wake) knock(b);
    const speed = resolve(a, b, h, !(free || wake));
    if (!free && !wake && b.kind === 'traffic' && cl.speed > 0.5) { b.vf *= 0.6; if (b.ai.honkT <= 0) { b.ai.honkT = 2.5; W.honk(b, 0.6); } }
    if (speed > 3 && (a.isPlayer || b.isPlayer)) events.emit('vehicle:crash', { speed, what: 'vehicle', x: h.x, z: h.z, nx: h.nx, nz: h.nz, model: b.model });
    if (speed > 0.5) traffic.hits++;
  }

  const traffic = {
    cars, loose, parked, wrecks, all, enabled: true, honks: 0, hits: 0, target: 0, walkers: [], mixFor, taken: 0,
    onTake: null,          // called with a traffic car just before it is taken off the street by hand
    get count() { return cars.length + loose.length; },
    density,
    firstSeen: () => firstSeen.slice(),
    // a vehicle put down by hand (missions, checks): it stands where it is put until something hits it
    spawn(model, x, z, h = 0) {
      const v = make(MODEL_IDS.includes(model) ? model : 'tarpon');
      Object.assign(v, { x, z, h, y: map.heightAt(x, z), parked: true, kind: 'wreck', leftT: -1e9, placed: true });
      wrecks.push(v); collide.bodies.add(v);
      return v;
    },
    despawn(v) { if (traffic.onTake && v.kind === 'traffic' && v.ai) traffic.onTake(v); remove(v); },
    near(x, z, r, out = []) { out.length = 0; for (const v of all) if ((v.x - x) * (v.x - x) + (v.z - z) * (v.z - z) <= r * r) out.push(v); return out; },
    clear(keepOff = false) {
      for (const v of all.slice()) remove(v);
      all.length = 0; firstSeen = []; lanesAt = null;
      if (keepOff) traffic.enabled = false;
    },
    update(dt, hour) {
      const p = player, px = p.x, pz = p.z, q = cfg();
      time += dt; frame++; W.time = time;
      readCamera();
      const fx = Math.sin(p.h), fz = Math.cos(p.h), vx = fx * p.vf + fz * p.vl, vz = fz * p.vf - fx * p.vl;

      // what a driver must brake for that is not in a lane
      others.length = 0; others.push(p);
      for (const o of traffic.walkers) others.push(o);             // someone standing in the road (the player on foot)
      for (const c of loose) others.push(c);
      for (const c of wrecks) others.push(c);

      // how many cars the hour and the district want
      const want = traffic.enabled ? Math.min(q.cap, Math.round(q.cap * density(state.world.district, hour) / 40)) : 0;
      traffic.target = want;
      if (traffic.enabled && cars.length + loose.length < want) trySpawn(px, pz, vx, vz);
      overT = cars.length > want ? overT + dt : 0;

      // drive: every step near the player, every 2nd to 8th step further off
      const nearR = q.low ? 60 : q.high ? 80 : 70, k1 = q.high ? 2 : 4, k2 = k1 * 2;
      for (let i = cars.length - 1; i >= 0; i--) {
        const c = cars[i], d = Math.hypot(c.x - px, c.z - pz), ai = c.ai;
        if (d > RING.gone) { remove(c); continue; }
        const k = d < nearR ? 1 : d < 200 ? k1 : k2;
        if (k === 1 || (frame + c.id) % k === 0) {
          const h0 = c.h;
          drive(c, dt * k, W, nav);
          if (c.preset.two) {           // riders lean with the turn they are making
            let dh = c.h - h0; if (dh > Math.PI) dh -= 6.2832; else if (dh < -Math.PI) dh += 6.2832;
            const want = Math.max(-0.75, Math.min(0.75, Math.atan(c.vf * (dh / (dt * k)) / 9.81) * 0.9));
            c.lean = (c.lean || 0) + (want - (c.lean || 0)) * Math.min(1, dt * k * 8);
          }
        }
      }
      // one car a step is asked "can the camera see you?"; unseen cars over the target, or stuck, go
      if (cars.length) {
        scanAt = (scanAt + 1) % cars.length;
        const c = cars[scanAt], d = Math.hypot(c.x - px, c.z - pz), gap = cars.length / 60;
        c.ai.unseenT = seen(c.x, c.z) ? 0 : c.ai.unseenT + gap;
        const over = cars.length > want;
        if (c.ai.unseenT >= 5 && ((over && (d > RING.thin || (overT > 15 && d > RING.near))) || c.ai.waitT > 25)) remove(c);
      }
      for (let i = loose.length - 1; i >= 0; i--) stepLoose(loose[i], dt);
      for (let i = wrecks.length - 1; i >= 0; i--) {
        const c = wrecks[i];
        c.leftT += dt;
        if (!c.placed && (Math.hypot(c.x - px, c.z - pz) > RING.gone || (c.leftT > 60 && !seen(c.x, c.z)))) remove(c);
      }
      parkT -= dt;
      if (parkT <= 0) { parkT = 0.5; if (traffic.enabled) refreshParked(px, pz); for (const c of cars) c.y = map.heightAt(c.x, c.z); }

      // car against car: the player and every loose car against whatever is near them
      const awake = q.low ? 8 : q.high ? 20 : 14;
      all.length = 0;
      for (const c of cars) all.push(c);
      for (const c of loose) all.push(c);
      for (const c of wrecks) all.push(c);
      for (const c of parked) all.push(c);
      for (let i = 0; i < all.length; i++) { const o = all[i]; if (Math.abs(o.x - px) < 9 && Math.abs(o.z - pz) < 9) collidePair(p, o, awake); }
      for (let n = 0; n < loose.length; n++) {
        const a = loose[n];
        for (let i = 0; i < all.length; i++) {
          const o = all[i];
          if (o === a || (o.kind === 'loose' && o.id < a.id) || Math.abs(o.x - a.x) > 9 || Math.abs(o.z - a.z) > 9) continue;
          collidePair(a, o, awake);
        }
      }
      state.traffic.count = cars.length + loose.length; state.traffic.target = want; state.traffic.parked = parked.length;
    },
    // what the checks read: [{ id, model, x, z, v, state, gapS, ... }]
    list() {
      return all.map((c) => ({ id: c.id, model: c.model, x: c.x, z: c.z, h: c.h, v: Math.hypot(c.vf, c.vl), kind: c.kind,
        state: c.ai ? c.ai.state : c.kind, gapS: c.ai ? c.ai.gapS : null, red: !!(c.ai && c.ai.red), crossedRed: c.ai ? c.ai.crossedRed : 0,
        lane: c.ai ? c.ai.lane.id : null, wait: c.ai ? c.ai.waitT : 0, born: c.born || 0, hw: c.hw, hl: c.hl, braking: !!c.braking, blink: c.blink || 0, lean: c.lean || 0, ridden: !!c.ridden }));
    },
  };
  return traffic;
}
