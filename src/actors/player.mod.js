// The player: Teo, in a car or on foot. Owns state.player (mode is 'car' or 'foot').
// F (interact) gets out of the car, or into the nearest vehicle within 2.5 m of a door.
// Public object: { get(), teleport(x, z, heading, level, speed), mode, me, rig, exit(), enter(), nearest(), stamina }.
// Events: player:spawned, vehicle:entered, vehicle:exited, player:jumped, player:landed, player:step.
import { createFoot, FOOT } from './player.js';
import { createDoors, DOORS } from './doors.js';
import { createRig } from './rig.js';
import { createFootTouch } from './foottouch.js';

let car, p, foot, doors, rig, me, touch, api, mode = 'car';
function sync() {
  const d = p.drift, c = car.drift;
  d.active = c.active; d.score = c.score; d.mult = c.mult; d.held = c.held; d.banked = c.banked;
  p.stamina = me.stamina; p.mode = mode;
  if (mode === 'car') {
    p.x = car.x; p.z = car.z; p.y = car.y; p.h = car.h;
    p.speed = Math.hypot(car.vf, car.vl); p.kmh = car.kmh; p.vf = car.vf; p.vl = car.vl; p.w = car.w;
    p.slip = car.slip; p.gear = car.gear + 1; p.mu = car.mu; p.vehicle = car.model;
    p.grounded = true; p.depth = 0; p.pose = 'drive'; p.act = null;
  } else {
    p.x = me.x; p.z = me.z; p.y = me.y; p.h = me.h;
    p.speed = me.speed; p.kmh = me.speed * 3.6; p.vf = me.speed; p.vl = 0; p.w = me.yawRate;
    p.slip = 0; p.gear = 1; p.mu = 1; p.vehicle = null;
    p.grounded = me.grounded; p.depth = me.depth; p.pose = me.pose; p.act = doors.act;
  }
  return p;
}

export default {
  name: 'player', order: 30, needs: ['vehicles', 'traffic', 'map', 'collide'],
  init(ctx) {
    const m = ctx.modules, ev = ctx.events;
    car = m.vehicles.player;
    p = ctx.state.player;
    foot = createFoot({ map: m.map, collide: m.collide, vehicles: m.vehicles, events: ev });
    me = foot.me;
    doors = createDoors({ foot, vehicles: m.vehicles, events: ev, state: ctx.state });
    rig = createRig('teo');
    rig.group.visible = false;
    ctx.scene.add(rig.group);
    touch = createFootTouch(ctx.input);
    Object.assign(p, { id: 'teo', mode: 'car', level: 0, vehicle: car.model, kmh: 0, vf: 0, vl: 0, w: 0, slip: 0, gear: 1, mu: 1,
      stamina: FOOT.stamina, grounded: true, depth: 0, pose: 'drive', act: null, drift: { active: false, score: 0, mult: 1, held: 0, banked: 0 } });

    function setMode(next) {
      mode = api.mode = next;
      ctx.input.setMode(next);
      if (m.camera && m.camera.setTarget) m.camera.setTarget(next, me);
      touch.set(next);
    }
    function exit() {
      if (mode !== 'car') return false;
      const speed = Math.hypot(car.vf, car.vl), how = doors.exit(car);
      setMode('foot'); sync();
      ev.emit('vehicle:exited', { model: car.model, id: car.id, x: car.x, z: car.z, speed, bailed: how === 'roll' });
      return true;
    }
    function seated(quiet) {
      doors.cancel(); setMode('car'); sync();
      ev.emit('vehicle:entered', { model: car.model, id: car.id, x: car.x, z: car.z, reset: !!quiet });
    }
    const enter = () => mode === 'foot' && doors.enter();
    ev.on('input:press', ({ name }) => { if (name === 'interact') { if (mode === 'car') exit(); else enter(); } });
    ev.on('game:reset', () => { if (mode === 'foot') seated(true); me.stamina = FOOT.stamina; me.tired = false; });

    api = {
      mode, me, rig, foot, doors, exit, enter,
      get: sync,
      nearest: () => (mode === 'foot' && !doors.act ? doors.nearest() : null),
      get stamina() { return me.stamina / FOOT.stamina; },
      // in a car this moves the car (day 2's meaning); on foot it moves him
      teleport(x, z, heading, level = 0, speed = 0) {
        if (mode === 'car') car.reset({ x, z, h: heading ?? car.h, vf: speed });
        else { doors.cancel(); foot.place(x, z, heading ?? me.h); }
        if (m.camera) m.camera.snap();
        sync();
      },
    };

    // ---- test API ----
    const T = ctx.test, inCar = T.spawnVehicle;
    T.vehicle = T.player;
    T.exit = () => { exit(); return { ...sync() }; };
    T.enter = () => enter();
    // In a car: put the player in that model (and at a place), as on day 2. On foot: stand a parked
    // car of that model at a place, by default 2 m to his right, facing the way he faces.
    T.spawnVehicle = (model, at = {}) => {
      if (mode === 'car') return inCar ? inCar(model, at) : null;
      if (!m.vehicles.spawn) return null;
      const x = at.x ?? me.x - Math.cos(me.h) * 2.4, z = at.z ?? me.z + Math.sin(me.h) * 2.4;
      const v = m.vehicles.spawn(model, x, z, at.heading ?? me.h);
      doors.placed.length = 0; doors.placed.push(v);
      return { id: v.id, model: v.model, x: v.x, z: v.z, h: v.h };
    };
    T.foot = () => ({ ...me, mode, act: doors.act, reach: DOORS.reach, numbers: FOOT, near: (() => { const n = api.nearest(); return n ? { model: n.veh.model, d: n.d, side: n.side } : null; })() });
    // run the rig through a pose for some seconds and read its angles (drawing does this each frame)
    T.rig = (s, seconds = 0.5) => {
      for (let i = 0, n = Math.round(seconds * 60); i < n; i++) rig.update(1 / 60, { ...s, t: (s.t || 0) + i / 60 });
      return { ...rig.pose, face: rig.face, state: rig.state, phase: rig.phase, ...rig.count(), visible: rig.group.visible };
    };

    sync();
    ev.emit('player:spawned', { id: p.id, x: p.x, z: p.z });
    api.seated = seated;
    return api;
  },
  update(dt, ctx) {
    if (mode === 'foot') {
      const cam = ctx.modules.camera;
      const done = doors.step(dt);
      if (done === 'seated') api.seated(false);
      else if (!doors.act) foot.step(dt, ctx.input.actions, cam && cam.yaw !== undefined ? cam.yaw : me.h);
    }
    // an empty car that still rolls gets its handbrake
    ctx.input.parkBrake = mode === 'foot' && Math.hypot(car.vf, car.vl) > 0.3;
    sync();
  },
  render(alpha, ctx) {
    const shown = mode === 'foot';
    rig.group.visible = shown;
    if (!shown) return;
    const g = rig.group, night = ctx.modules.sky ? ctx.modules.sky.night : 0;
    g.position.set(me.x, me.y, me.z); g.rotation.y = me.h;
    const ground = ctx.modules.map.heightAt(me.x, me.z);
    rig.update(ctx.loop.dt, { state: me.pose, v: me.speed, yawRate: me.yawRate, air: me.grounded ? 0 : Math.max(me.air, 0.001), vy: me.vy,
      t: doors.t, k: doors.k, night, lift: me.grounded ? 0 : me.y - ground, wet: me.depth > 0.05 });
    if (me.landed) { me.landed = false; rig.land(); }
    touch.update(api.nearest());
  },
};
