// The player's car. Day 2 has one vehicle, the Heron; spawn, despawn and traffic come later.
// Public object: { player (the vehicle the player is in), models (the presets by id) }.
import { createCar } from './vehicle.js';
import { DT, PRESETS, straightRun } from './handling.js';

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
    car.model = 'heron';
    car.reset(world.spawn);
    smokeEvery = ctx.quality.get('smokeEvery');
    ctx.events.on('game:reset', () => car.reset(world.spawn));
    // the real handling step on an empty flat road, gas held: speed in km/h after `seconds`
    ctx.test.topSpeed = (seconds = 60) => straightRun(PRESETS.heron, seconds).speed * 3.6;
    ctx.test.zeroToHundred = () => straightRun(PRESETS.heron, 60, 100 / 3.6).time;
    return { player: car, models: PRESETS };
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
