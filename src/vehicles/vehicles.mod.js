// The player's vehicle. It starts as the Heron; any model can be swapped in (the same object, so
// the camera and the HUD keep hold of it). Traffic and parked cars are in traffic.mod.js.
// Public object: { player (the vehicle the player is in), models (the presets by id), swap(model) }
// plus spawn, despawn and near, added by the traffic module.
import { createCar } from './vehicle.js';
import { DT, PRESETS, straightRun, ready } from './handling.js';
import { pickPaint } from './models.js';

// the Heron comes in one of two paints, picked each load (the clip always uses the pink one)
const PAINTS = [[0xff4f6e, 0x29e6ff], [0x1fc8b4, 0xffd23e]];
const wp = { x: 0, z: 0 };
let car, smokeT = 0, smokeEvery = 0.02;

export default {
  name: 'vehicles', order: 20, needs: ['world', 'props'],
  init(ctx) {
    const { world, props } = ctx.modules;
    const paint = PAINTS[ctx.params.get('clip') ? 0 : Math.floor(Math.random() * PAINTS.length)];
    car = createCar(ctx.scene, world, props, ctx.events, paint[0], paint[1]);
    car.reset(world.spawn);
    smokeEvery = ctx.quality.get('smokeEvery');
    ctx.events.on('game:reset', () => car.reset(world.spawn));
    const swap = (model) => {
      if (!PRESETS[model] || model === car.model) return car;
      const p = model === 'heron' ? { paint: paint[0], accent: paint[1] } : pickPaint(model, 0);
      car.swap(model, p.paint, p.accent);
      ctx.state.player.vehicle = car.model;
      ctx.events.emit('vehicle:entered', { model: car.model });
      return car;
    };
    // the real handling step on an empty flat road, gas held: speed in km/h after `seconds`
    ctx.test.topSpeed = (seconds = 60, model = 'heron') => straightRun(ready(model), seconds).speed * 3.6;
    ctx.test.zeroToHundred = (model = 'heron') => straightRun(ready(model), 60, 100 / 3.6).time;
    // put the player in a model at a place: spawnVehicle('snook', { x, z, heading })
    ctx.test.spawnVehicle = (model, at = {}) => {
      swap(model);
      if (at.x !== undefined && ctx.modules.player) ctx.modules.player.teleport(at.x, at.z, at.heading);
      return { model: car.model, x: car.x, z: car.z };
    };
    return { player: car, models: PRESETS, swap };
  },
  update(dt, ctx) {
    const fx = ctx.modules.fx;
    car.step(ctx.input.actions);
    if (!fx) return;
    if (car.smoking) {
      smokeT += DT;
      if (smokeT >= smokeEvery) {
        smokeT = 0;
        const c = Math.cos(car.h), s = Math.sin(car.h);
        const vx = (s * car.vf + c * car.vl) * 0.2, vz = (c * car.vf - s * car.vl) * 0.2;
        car.wheelPos(2, wp); fx.puff(wp.x, car.y + 0.25, wp.z, vx, vz);
        car.wheelPos(3, wp); fx.puff(wp.x, car.y + 0.25, wp.z, vx, vz);
      }
    }
    for (let i = 0; i < 4; i++) {
      car.wheelPos(i, wp);
      fx.skid(i, wp.x, wp.z, car.skidding === 2 || (car.skidding === 1 && i > 1));
    }
  },
  render(alpha, ctx) { car.draw(ctx.loop.dt, ctx.modules.sky ? ctx.modules.sky.night : 0); },
};
