// The player. On day 2 the player is always in the Heron, so this copies the car into
// state.player each step and moves it on teleport. Owns state.player.
// Public object: { get(), teleport(x, z, heading, level, speed) }.

let car, p;
function sync() {
  p.x = car.x; p.z = car.z; p.y = car.y; p.h = car.h;
  p.speed = Math.hypot(car.vf, car.vl); p.kmh = car.kmh; p.vf = car.vf; p.vl = car.vl; p.w = car.w;
  p.slip = car.slip; p.gear = car.gear + 1; p.mu = car.mu;
  const d = p.drift, c = car.drift;
  d.active = c.active; d.score = c.score; d.mult = c.mult; d.held = c.held; d.banked = c.banked;
  return p;
}

export default {
  name: 'player', order: 30, needs: ['vehicles'],
  init(ctx) {
    car = ctx.modules.vehicles.player;
    p = ctx.state.player;
    Object.assign(p, { id: ctx.state.chars.active, mode: 'vehicle', level: 0, vehicle: car.model, kmh: 0, vf: 0, vl: 0, w: 0, slip: 0, gear: 1, mu: 1,
      drift: { active: false, score: 0, mult: 1, held: 0, banked: 0 } });
    sync();
    ctx.test.vehicle = ctx.test.player;
    ctx.events.emit('player:spawned', { id: p.id, x: p.x, z: p.z });
    return {
      get: sync,
      teleport(x, z, heading = car.h, level = 0, speed = 0) {
        car.reset({ x, z, h: heading, vf: speed });
        if (ctx.modules.camera) ctx.modules.camera.snap();
        sync();
      },
    };
  },
  update: sync,
};
