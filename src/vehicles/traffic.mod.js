// Traffic: moving cars on the lanes, parked cars at the curb, and car-against-car hits (see
// traffic.js, drive.js, parked.js, crash.js). Drawn by fleet.js in a handful of instanced meshes.
// Public object: { count, target, cars, parked, all, list(), clear(), spawn(model, x, z, h), despawn(v), near(x, z, r), enabled }.
// Owns state.traffic = { count, target, parked }.
import { createTraffic } from './traffic.js';
import { createFleet } from './fleet.js';
import { triangles, MODEL_IDS, sheet } from './models.js';
import { PRESETS } from './handling.js';
import { curbSpaces } from './parked.js';

let traffic = null, fleet = null, holdT = 0;
export default {
  name: 'traffic', order: 22, renderOrder: 21, needs: ['vehicles', 'nav', 'map', 'collide', 'chunks', 'signals', 'world'],
  init(ctx) {
    const m = ctx.modules;
    ctx.state.traffic = { count: 0, target: 0, parked: 0 };
    if (ctx.state.build.day < 2 || !m.chunks || m.chunks.disabled || !m.signals || m.signals.disabled) return { disabled: true, count: 0, all: [], list: () => [], clear() {} };
    fleet = createFleet(ctx.scene, 128);
    traffic = createTraffic({ map: m.map, nav: m.nav, collide: m.collide, chunks: m.chunks, signals: m.signals, events: ctx.events, state: ctx.state,
      quality: ctx.quality, camera: ctx.camera, player: m.vehicles.player });
    traffic.fleet = fleet;
    if (ctx.params.get('traffic') === '0') traffic.enabled = false;
    // vehicles put down by hand go through the vehicles module
    Object.assign(m.vehicles, { spawn: traffic.spawn, despawn: traffic.despawn, near: traffic.near });
    ctx.test.traffic = {
      list: () => traffic.list(), clear: (keepOff) => traffic.clear(keepOff), on: (yes = true) => { traffic.enabled = yes; },
      firstSeen: () => traffic.firstSeen(), counts: () => ({ moving: traffic.count, target: traffic.target, parked: traffic.parked.length, loose: traffic.loose.length,
        wrecks: traffic.wrecks.length, honks: traffic.honks, hits: traffic.hits, calls: fleet.calls, instances: fleet.instances }),
    };
    // what a model is: its numbers from the catalogue and the triangles in its traffic build
    ctx.test.vehicleInfo = (id) => ({ id, name: sheet(id).name, triangles: triangles(id), bodyTriangles: fleet.bodies[id].tris, top: PRESETS[id].vTop * 3.6, t100: PRESETS[id].t100, mass: PRESETS[id].mass });
    // a chunk's curb spaces: how many there are and how many hold a parked car
    ctx.test.traffic.spaces = (cx, cz) => { const s = curbSpaces(m.map, cx, cz); return { spaces: s.total, filled: s.length }; };
    ctx.test.models = () => MODEL_IDS.slice();
    // stand a car of a model at a place: it is parked until something hits it
    ctx.test.placeVehicle = (model, x, z, h) => { const v = traffic.spawn(model, x, z, h); return { id: v.id, model: v.model, x: v.x, z: v.z }; };
    ctx.events.on('quality:changed', () => traffic.clear());
    return traffic;
  },
  update(dt, ctx) {
    if (!traffic) return;
    // a scripted clip was written for empty streets: traffic stays away while one plays
    holdT -= dt;
    if (holdT <= 0) { holdT = 0.5; const clip = document.body.classList.contains('clip'); if (clip && !traffic.held) traffic.clear(); traffic.held = clip; }
    if (traffic.held) return;
    traffic.update(dt, ctx.state.clock.hour);
  },
  render(alpha, ctx) {
    if (!traffic) return;
    const p = ctx.state.player, far = ctx.quality.level === 'low' ? 40 : 120;
    fleet.draw(traffic.all, ctx.modules.sky ? ctx.modules.sky.night : 0, p.x, p.z, ctx.loop.time, far);
  },
};
