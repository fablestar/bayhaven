// Each class's engine and horn (see voice.js: a STAND-IN until the Sound lane takes the recipes).
// The player's engine by class, and other drivers' horns on `traffic:honk`, quieter with distance.
import { createVoice, engineTone } from './voice.js';
import { SOUNDS } from '../content/vehicles.js';

let voice;
export default {
  name: 'carvoice', order: 51, renderOrder: 68, needs: ['vehicles'],
  init(ctx) {
    voice = createVoice();
    const on = ctx.events.on, models = new Map();
    on('input:first', () => voice.start());
    let muted = false;
    on('input:press', ({ name }) => { if (name === 'mute') { voice.start(); muted = !muted; voice.setMuted(muted); } });
    on('traffic:honk', ({ x, z, id, seconds }) => {
      const p = ctx.state.player, d = Math.hypot(x - p.x, z - p.z), t = ctx.modules.traffic;
      let model = 'tarpon';
      if (t && t.cars) for (const c of t.cars) if (c.id === id) { model = c.model; break; }
      voice.honk(SOUNDS[model] || SOUNDS.tarpon, Math.min(1.2, seconds || 0.5), Math.max(0, 1 - d / 70) * 0.6);
    });
    // what a model sounds like at a speed: the numbers the voice is driven with
    ctx.test.engineTone = (model, ratio = 0, throttle = 0, gear = 0) => ({ ...engineTone(SOUNDS[model].engine, ratio, throttle, gear), id: SOUNDS[model].engine.id, level: SOUNDS[model].engine.level,
      hz: SOUNDS[model].engine.hz, wave: [SOUNDS[model].engine.a, SOUNDS[model].engine.b ? SOUNDS[model].engine.b[0] : null, SOUNDS[model].engine.sub ? 'sine' : null],
      horn: SOUNDS[model].horn.slice(0, 2), interval: SOUNDS[model].interval });
    ctx.test.carvoice = () => ({ ...voice.stats });
    return voice;
  },
  render(alpha, ctx) {
    const car = ctx.modules.vehicles.player, a = ctx.input.actions, onFoot = ctx.input.mode === 'foot';
    voice.update(SOUNDS[car.model] || SOUNDS.heron, Math.min(1, Math.abs(car.vf) / car.maxSpeed), onFoot ? 0 : a.gas, car.gear, !onFoot && !(car.thrown > 0));
  },
};
