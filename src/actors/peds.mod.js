// The people of Bayhaven: instanced box figures on every sidewalk, the promenade and the sand,
// for eight draw calls. They walk the sidewalk graph, wait for lights, hang out, film trouble, run
// from cars and get knocked over. Work is in peds.js (who and where), pedsreact.js (filming, horn),
// pedsdraw.js (the eight meshes), pedspose.js (angles), pedstumble.js (the rope), pedskinds.js (data).
// Public object: { count, list, kinds, stats(), add(kind, x, z, h, opts), remove(p), crowd(def), disband(crowd),
//   release(p, how, x, z), near(x, z, r), trigger(seconds, 'crash' or 'stunt'), freeze(seconds, range), filming, interest }.
// Owns state.peds = { count, filming, interest, down }. Emits ped:hit, ped:filming, ped:fled, ped:gotup.
// ?peds=0 starts with nobody about. People arrive with the day 3 build.
import * as THREE from 'three';
import { createPeds, PEDS } from './peds.js';
import { createPedDraw } from './pedsdraw.js';
import { poseFor } from './pedspose.js';
import { KINDS, KIND_IDS, mixFor, targetFor } from './pedskinds.js';
import { TUMBLE } from './pedstumble.js';
import { REACT } from './pedsreact.js';

const CAP = { low: 192, medium: 224, high: 256 }, ROPES = { low: 2, medium: 5, high: 8 };
let sim = null, draw = null, api = null, frame = 0, ms = 0, drawMs = 0;
const o = {}, dir = new THREE.Vector3(), near = [];

export default {
  name: 'peds', order: 32, needs: ['player', 'map', 'nav', 'collide', 'signals', 'vehicles', 'traffic', 'chunks'],
  init(ctx) {
    const m = ctx.modules, q = ctx.quality, S = ctx.state;
    S.peds = { count: 0, filming: 0, interest: 0, down: 0 };
    if (S.build.day < 3 || !m.nav || !m.chunks || m.chunks.disabled) return { disabled: true, count: 0, list: [], stats: () => ({ count: 0, calls: 0 }) };
    sim = createPeds({ map: m.map, nav: m.nav, collide: m.collide, signals: m.signals, events: ctx.events, state: S, cap: CAP[q.level], ropes: ROPES[q.level] });
    const size = () => { sim.cap = CAP[q.level]; sim.ropes = ROPES[q.level]; sim.streetCap = q.get('pedCap'); sim.crowdScale = 60 / q.get('pedCap'); };
    size();
    draw = createPedDraw(ctx.scene, sim.cap);
    sim.removed = (n) => draw.hide(n);
    if (ctx.params.get('peds') === '0') sim.paused = true;
    ctx.events.on('quality:changed', () => {
      for (const c of sim.crowds) c.members.length = 0;
      sim.clear(); draw.dispose(); size(); draw = createPedDraw(ctx.scene, sim.cap);
      ctx.events.emit('peds:rebuilt', {});
    });
    ctx.events.on('game:reset', () => { for (const p of sim.list.slice()) if (p.street) sim.remove(p); });

    const info = (p) => ({ id: p.id, kind: p.kind, state: p.state, sub: p.sub, x: p.x, y: p.y, z: p.z, h: p.h, v: p.v, face: p.face, street: p.street, jay: p.jay,
      waiting: !!p.hold, crossing: p.state === 'cross' && p.edge ? { node: p.edge.node, signal: !!(m.signals.phase && m.signals.phase(p.edge.node)), axis: Math.abs(p.edge.bx - p.edge.ax) > Math.abs(p.edge.bz - p.edge.az) ? 'ew' : 'ns' } : null,
      d: Math.hypot(p.x - sim.focus.x, p.z - sim.focus.z), hat: p.look.hat, bag: p.look.bag, walk: p.K.walk, courage: p.K.courage, frozen: p.frozen > 0 });
    function stats() {
      const byState = {}, byKind = {};
      let within = 0, street = 0;
      for (const p of sim.list) {
        const key = p.state === 'cross' ? 'walk' : p.state === 'dazed' || p.state === 'fall' ? 'fall' : p.state;
        byState[key] = (byState[key] || 0) + 1; byKind[p.kind] = (byKind[p.kind] || 0) + 1;
        if (Math.hypot(p.x - sim.focus.x, p.z - sim.focus.z) <= PEDS.gone) within++;
        if (p.street) street++;
      }
      let calls = 0; for (const mesh of draw.meshes) if (mesh.visible && mesh.count > 0) calls++;
      if (draw.shadows.visible && draw.shadows.count > 0) calls++;
      return { count: sim.list.length, within, street, target: sim.retarget(), cap: sim.cap, streetCap: sim.streetCap, calls, meshes: draw.calls, filming: sim.react.filming, interest: sim.react.interest,
        down: 0, byState, byKind, frozen: sim.react.frozen || 0, crowdScale: sim.crowdScale, gained: sim.react.gained, ms, drawMs, triangles: draw.triangles(sim.list.length), ...sim.stats };
    }
    api = {
      get count() { return sim.list.length; }, get list() { return sim.list; }, get filming() { return sim.react.filming; }, get interest() { return sim.react.interest; },
      get paused() { return sim.paused; }, set paused(v) { sim.paused = v; },
      kinds: KINDS, numbers: { PEDS, REACT, TUMBLE, CAP }, stats, info,
      add: (kind, x, z, h = 0, opts) => sim.add(kind, x, z, h, opts),
      remove: (p) => { if (!p.gone) sim.remove(p); },
      near(x, z, r, out = []) { out.length = 0; for (const p of sim.list) if ((p.x - x) * (p.x - x) + (p.z - z) * (p.z - z) <= r * r) out.push(p); return out; },
      trigger: (seconds, code = 'crash', x, z) => sim.react.trigger(seconds, code, x, z),
      freeze: (seconds, range) => sim.react.freeze(seconds, range),
      // A crowd owns its members: they have no brain until it lets them go. def: { id, x, z, streetCap }.
      crowd(def) { const c = { members: [], beat: 0, ...def }; sim.crowds.push(c); return c; },
      join(c, kind, x, z, h, look) { const p = sim.add(kind, x, z, h, { crowd: true, look }); if (p) { p.crowd = c; p.beat = 0; sim.setState(p, 'crowd'); c.members.push(p); } return p; },
      disband(c) { const i = sim.crowds.indexOf(c); if (i >= 0) sim.crowds.splice(i, 1); for (const p of c.members) if (!p.gone && p.state === 'crowd') sim.remove(p); c.members.length = 0; },
      // let one member go: 'flee' from (x, z), 'film' the player, or just 'walk' off
      release(p, how, x, z) {
        if (p.gone || p.state !== 'crowd') return;
        sim.release(p);
        if (how === 'flee') sim.flee(p, x, z); else if (how === 'film') sim.react.startFilm(p, 4);
      },
    };

    ctx.test.peds = {
      stats, kinds: () => KIND_IDS.map((id) => ({ id, ...KINDS[id] })),
      list: (r = 1e9) => sim.list.filter((p) => Math.hypot(p.x - sim.focus.x, p.z - sim.focus.z) <= r).map(info),
      get: (id) => { const p = sim.list.find((x) => x.id === id); return p ? info(p) : null; },
      // stand one person somewhere: opts { state, sub, seconds } (by default they hang about on their phone for a minute)
      spawn(kind, x, z, h = 0, opts = {}) {
        const p = sim.add(kind, x, z, h); if (!p) return null;
        sim.setState(p, opts.state || 'hang', opts.sub === undefined ? 'phone' : opts.sub, opts.seconds || 60);
        if (opts.state === 'walk') sim.resume(p);
        return info(p);
      },
      clear: () => { for (const p of sim.list.slice()) if (p.street) sim.remove(p); },
      auto: (on) => { sim.paused = !on; },
      fill: () => { sim.focus.x = S.player.x; sim.focus.z = S.player.z; sim.fill(); return sim.list.length; },
      trigger: api.trigger, freeze: api.freeze,
      show: (on) => { for (const mesh of draw.meshes) mesh.visible = on; draw.shadows.visible = on; },
      mix: (district, hour) => mixFor((m.map.zone(district) || {}).peds, district, hour), target: targetFor,
      pose: (id) => { const p = sim.list.find((x) => x.id === id); return p ? { ...poseFor(p, sim.time, {}, false) } : null; },
    };
    return api;
  },
  update(dt, ctx) {
    if (!sim) return;
    const t0 = performance.now(), m = ctx.modules, pl = ctx.state.player, car = m.vehicles.player, f = sim.focus;
    f.x = pl.x; f.z = pl.z; f.onFoot = pl.mode === 'foot'; f.speed = pl.speed;
    sim.car = car; sim.horn = !f.onFoot && !!ctx.input.actions.horn;
    sim.cars.length = 0; sim.cars.push(car);
    if (m.vehicles.near) for (const v of m.vehicles.near(f.x, f.z, 60, near)) if (v !== car && v.kind !== 'parked' && v.kind !== 'wreck') sim.cars.push(v);
    sim.step(dt);
    const s = ctx.state.peds; s.count = sim.list.length; s.filming = sim.react.filming; s.interest = sim.react.interest;
    ms += (performance.now() - t0 - ms) * 0.05;
  },
  render(alpha, ctx) {
    if (!sim) return;
    const t0 = performance.now(), cam = ctx.camera, list = sim.list, t = sim.time, night = ctx.modules.sky ? ctx.modules.sky.night : 0;
    cam.getWorldDirection(dir);
    const flat = Math.hypot(dir.x, dir.z) || 1;
    sim.view.x = cam.position.x; sim.view.z = cam.position.z; sim.view.fx = dir.x / flat; sim.view.fz = dir.z / flat;
    frame++; draw.begin();
    for (let i = 0; i < list.length; i++) {
      const p = list[i], dx = p.x - cam.position.x, dz = p.z - cam.position.z, d2 = dx * dx + dz * dz, dancer = p.state === 'crowd';
      // near people every frame; further ones every few frames, with a two-pose walk past 60 m
      const every = p.fresh || d2 < 900 || p.rope ? 1 : d2 < 6400 ? (dancer ? 2 : 4) : dancer ? 4 : 8;
      if (p.state === 'dazed') draw.birds(p.x - Math.sin(p.h) * 0.85, p.y + 0.5, p.z - Math.cos(p.h) * 0.85, t + p.seed * 9);
      if ((frame + i) % every) continue;
      if (p.fresh) { draw.dress(i, p.look); p.fresh = false; }
      if (p.rope && !p.rope.canned) draw.rope(i, p, p.rope, ctx.modules.map.heightAt(p.x, p.z));
      else draw.pose(i, p, poseFor(p, t, o, d2 > 3600), p.y, night);
    }
    draw.end(list.length, night);
    drawMs += (performance.now() - t0 - drawMs) * 0.05;
  },
};
