// Teo on foot: walk, jog, sprint with stamina, jump, step up curbs, slide along walls, wade into
// the sea. A circle of radius 0.35 m against the collision hash and against cars.
// Numbers from plan/04-systems.md section 1. No three.js in here: the rig draws him.
//   const foot = createFoot({ map, collide, vehicles, events });
//   foot.step(dt, actions, camYaw)   one fixed step; movement is relative to the camera
//   foot.me                          { x, y, z, h, vx, vz, vy, speed, grounded, air, stamina, depth, yawRate, pose }

export const FOOT = {
  walk: 1.6, jog: 3.4, sprint: 6.8,          // Teo sprints 6.8 (Mags will be 5.0)
  stamina: 12, refill: 6,                    // seconds of sprint, seconds to refill
  jump: 1.1, gravity: 36,                    // metres high; 36 m/s² gives a 0.49 s hop, 3 m long at a sprint
  step: 0.35, radius: 0.35, height: 1.8,
  wade: 1.2, wadeFrom: 0.2, waist: 0.9,      // wading speed, the depth it starts at, and as deep as he goes before day 7
  accel: 22, turn: 11, airControl: 0.3,
};
const JUMP_V = Math.sqrt(2 * FOOT.gravity * FOOT.jump), CROUCH = 0.08;
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export function createFoot({ map, collide, vehicles, events }) {
  const me = {
    x: 0, y: 0, z: 0, h: 0, vx: 0, vz: 0, vy: 0, speed: 0, grounded: true, air: 0, stamina: FOOT.stamina, tired: false,
    depth: 0, yawRate: 0, pose: 'idle', surface: 'road', sprinting: false, peak: 0, r: FOOT.radius, level: undefined,
  };
  const shapes = [], cars = [];
  let crouch = 0, jumpWas = false, takeoff = 0, stepT = 0;

  // the sea lies at height 0 and the beach slopes down under it: depth is how far the sand is below that
  const depthAt = (x, z) => Math.max(0, -map.heightAt(x, z));
  // The ground under a point: the map's height, or the top of something low enough to stand on.
  function groundAt(x, z, feet) {
    let g = map.heightAt(x, z);
    const n = collide.circle(x, z, 0.05, undefined, shapes);
    for (let i = 0; i < n; i++) { const s = shapes[i]; if (s.h <= feet + FOOT.step && s.h > g) g = s.h; }
    return g;
  }
  // Walls push the circle out, so he slides along them. Things no higher than a step are walked onto.
  function walls() {
    const n = collide.circle(me.x, me.z, me.r, undefined, shapes);
    let tall = false;
    for (let i = 0; i < n; i++) if (shapes[i].h > me.y + FOOT.step) { tall = true; break; }
    return tall ? collide.pushOutCircle(me) : null;
  }
  // a car is a turned box: push the circle out of it along the nearest side
  function carPush(v) {
    const c = Math.cos(v.h), s = Math.sin(v.h), dx = me.x - v.x, dz = me.z - v.z;
    const lx = dx * c - dz * s, lz = dx * s + dz * c;                   // into the car's frame: x to its left, z ahead
    const qx = Math.max(-v.hw, Math.min(lx, v.hw)), qz = Math.max(-v.hl, Math.min(lz, v.hl));
    let nx = lx - qx, nz = lz - qz, d = Math.hypot(nx, nz), push;
    if (d > me.r) return false;
    if (d < 1e-6) {                                                     // inside: leave by the nearest side
      const l = v.hw - Math.abs(lx), f = v.hl - Math.abs(lz);
      if (l < f) { nx = Math.sign(lx) || 1; nz = 0; push = l + me.r; } else { nx = 0; nz = Math.sign(lz) || 1; push = f + me.r; }
    } else { nx /= d; nz /= d; push = me.r - d; }
    me.x += (nx * c + nz * s) * push; me.z += (-nx * s + nz * c) * push;
    return true;
  }
  function carsPush(skip) {
    cars.length = 0;
    if (vehicles.near) vehicles.near(me.x, me.z, 7, cars);
    if (vehicles.player) cars.push(vehicles.player);
    let hit = false;
    for (const v of cars) if (v !== skip && me.y < 1.2) hit = carPush(v) || hit;
    return hit;
  }

  const foot = {
    me, FOOT,
    depthAt, groundAt,
    place(x, z, h = me.h) {
      Object.assign(me, { x, z, h, vx: 0, vz: 0, vy: 0, speed: 0, grounded: true, air: 0, yawRate: 0, pose: 'idle' });
      me.y = groundAt(x, z, map.heightAt(x, z)); me.depth = depthAt(x, z); crouch = 0;
    },
    // is there room for him to stand here (walls and cars; `skip` is the car he is getting out of)
    clear(x, z, skip) {
      const n = collide.circle(x, z, me.r, undefined, shapes);
      for (let i = 0; i < n; i++) if (shapes[i].h > map.heightAt(x, z) + FOOT.step) return false;
      cars.length = 0;
      if (vehicles.near) vehicles.near(x, z, 7, cars);
      for (const v of cars) {
        if (v === skip) continue;
        const c = Math.cos(v.h), s = Math.sin(v.h), dx = x - v.x, dz = z - v.z;
        if (Math.abs(dx * c - dz * s) < v.hw + me.r && Math.abs(dx * s + dz * c) < v.hl + me.r) return false;
      }
      return true;
    },
    // Move by the velocity, then settle against walls, cars, the ground and the sea. Used by free
    // walking and by the roll after a bail-out.
    move(dt, skipCar) {
      const px = me.x, pz = me.z;
      me.x += me.vx * dt; me.z += me.vz * dt;
      const hit = walls();
      if (hit) { const vn = me.vx * hit.nx + me.vz * hit.nz; if (vn < 0) { me.vx -= hit.nx * vn; me.vz -= hit.nz * vn; } }
      carsPush(skipCar);
      // the map's edge on land; out to sea he stops at waist depth (swimming is day 7)
      const b = map.bounds;
      me.x = Math.max(b.x0, Math.min(b.x1, me.x)); if (me.z < b.z0) me.z = b.z0;
      if (depthAt(me.x, me.z) > FOOT.waist) { me.z = pz; if (depthAt(me.x, me.z) > FOOT.waist) me.x = px; me.vz = Math.min(0, me.vz); }
      const g = groundAt(me.x, me.z, me.y);
      if (me.grounded) {
        if (g > me.y + FOOT.step) { me.x = px; me.z = pz; }             // too high to step up: it is a wall
        else if (g < me.y - 0.45) { me.grounded = false; me.vy = 0; me.air = 0; takeoff = me.y; }
        else me.y += (g - me.y) * Math.min(1, dt * 20);                 // curbs and the beach slope
      } else {
        me.air += dt; me.y += me.vy * dt - 0.5 * FOOT.gravity * dt * dt; me.vy -= FOOT.gravity * dt;
        me.peak = Math.max(me.peak, me.y - takeoff);
        if (me.y <= g && me.vy <= 0) {
          me.y = g; me.grounded = true; me.landed = true;
          events.emit('player:landed', { x: me.x, z: me.z, air: me.air, speed: -me.vy, surface: map.surfaceAt(me.x, me.z) });
          me.vy = 0; me.air = 0;
        }
      }
      me.depth = depthAt(me.x, me.z);
      me.speed = Math.hypot(me.vx, me.vz);
    },
    // one step of free walking
    step(dt, a, camYaw) {
      const mag = Math.min(1, Math.hypot(a.moveX, a.moveY));
      const wading = me.depth > FOOT.wadeFrom;
      // which pace: a full stick or a held key walks; Shift sprints while stamina lasts, then jogs
      let want = 0;
      me.sprinting = false;
      if (mag > 0.05) {
        const analog = a.touch || a.pad;
        want = analog ? (mag > 0.6 ? FOOT.jog : FOOT.walk * Math.min(1, mag / 0.5)) : FOOT.walk;
        if (a.sprint) { if (!me.tired && me.stamina > 0) { want = FOOT.sprint; me.sprinting = true; } else want = FOOT.jog; }
        if (wading) { want = Math.min(want, FOOT.wade); me.sprinting = false; }
      }
      if (me.sprinting) { me.stamina = Math.max(0, me.stamina - dt); if (me.stamina === 0) me.tired = true; }
      else { me.stamina = Math.min(FOOT.stamina, me.stamina + dt * FOOT.stamina / FOOT.refill); if (me.stamina >= 4) me.tired = false; }

      // direction, relative to the camera: forward is where it looks, +moveX is to its right
      const sy = Math.sin(camYaw), cy = Math.cos(camYaw);
      let dx = sy * a.moveY - cy * a.moveX, dz = cy * a.moveY + sy * a.moveX;
      const dl = Math.hypot(dx, dz) || 1; dx /= dl; dz /= dl;
      const k = (me.grounded ? 1 : FOOT.airControl) * FOOT.accel * dt;
      const tx = dx * want, tz = dz * want, ex = tx - me.vx, ez = tz - me.vz, el = Math.hypot(ex, ez);
      if (me.grounded || want > 0) { if (el <= k) { me.vx = tx; me.vz = tz; } else { me.vx += ex / el * k; me.vz += ez / el * k; } }
      const h0 = me.h;
      if (want > 0) { const turn = wrap(Math.atan2(dx, dz) - me.h), lim = FOOT.turn * dt; me.h = wrap(me.h + Math.max(-lim, Math.min(lim, turn))); }
      me.yawRate = wrap(me.h - h0) / dt;

      // jump: a short crouch, then off the ground
      const press = a.jump && !jumpWas; jumpWas = a.jump;
      if (press && me.grounded && crouch <= 0 && !wading) crouch = CROUCH;
      if (crouch > 0) {
        crouch -= dt;
        if (crouch <= 0 && me.grounded) { me.grounded = false; me.vy = JUMP_V; me.air = 0; me.peak = 0; takeoff = me.y; events.emit('player:jumped', { x: me.x, z: me.z }); }
      }
      foot.move(dt, null);

      // footsteps: one event a stride, with the surface under him
      if (me.grounded && me.speed > 0.5) {
        stepT += me.speed * dt;
        const stride = 0.7 + me.speed * 0.1;
        if (stepT >= stride) { stepT -= stride; events.emit('player:step', { x: me.x, z: me.z, surface: wading ? 'water' : map.surfaceAt(me.x, me.z), speed: me.speed }); }
      }
      me.surface = map.surfaceAt(me.x, me.z);
      me.pose = !me.grounded ? (me.air > 0.6 ? 'fall' : 'jump') : crouch > 0 ? 'jump' : me.speed > 0.2 ? (wading ? 'wade' : 'move') : 'idle';
    },
  };
  return foot;
}
