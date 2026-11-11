// Sound: the engine, wind, surf, tyre squeal, hits and the horn, all made from oscillators.
// Starts on the first key or touch (browsers allow sound only then). M mutes.
import { createAudio } from './engine.js';

let audio;
export default {
  name: 'audio', order: 50, renderOrder: 67,
  init(ctx) {
    audio = createAudio();
    const on = ctx.events.on;
    on('input:first', () => audio.start());
    on('input:press', ({ name }) => { if (name === 'mute') { audio.start(); audio.toggleMute(); } });
    on('vehicle:crash', ({ speed }) => audio.crash(speed));
    on('prop:broken', ({ kind, speed }) => {
      if (kind === 'cone') audio.clatter(); else if (kind === 'barrier') { audio.clatter(); audio.crash(speed * 0.4); } else { audio.clang(); audio.crash(speed * 0.5); }
    });
    return audio;
  },
  render(alpha, ctx) {
    const car = ctx.modules.vehicles && ctx.modules.vehicles.player, a = ctx.input.actions;
    if (!car) return;
    const ratio = Math.min(1, Math.abs(car.vf) / car.maxSpeed);
    const seaNear = Math.max(0, Math.min(1, (car.z + 30) / 90));
    audio.update(ratio, a.gas, seaNear * Math.sqrt(seaNear), car.gear + 1, car.slip, car.kmh);
    audio.setHorn(a.horn);
  },
};
