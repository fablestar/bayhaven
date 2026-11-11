// Sound: the mixer (master, music, effects, ambience, voice, ui, with ducking and a limiter) and
// the car's engine, wind, surf, tyre squeal, hits and horn, all made from oscillators.
// Starts on the first key or touch (browsers allow sound only then). 0 mutes (M still does until
// the map takes that key).
import { createAudio, createMixer, BUSES } from './engine.js';

let audio, mixer;
export default {
  name: 'audio', order: 50, renderOrder: 67,
  init(ctx) {
    const S = ctx.state.settings;
    mixer = createMixer({ master: S.master ?? 1, music: S.music ?? 0.8, sfx: S.sfx ?? 1, voice: S.voice ?? 1 });
    audio = createAudio(mixer);
    const on = ctx.events.on;
    const start = () => { const first = !mixer.ctx; audio.start(); if (first && mixer.ctx) ctx.events.emit('audio:started'); };
    on('input:first', start);
    on('input:press', ({ name }) => { if (name === 'mute') { start(); audio.toggleMute(); } });
    window.addEventListener('keydown', (e) => { if (e.code === 'Digit0' && !e.repeat) { start(); audio.toggleMute(); } });
    on('settings:changed', ({ key, value }) => { if (['master', 'music', 'sfx', 'voice'].includes(key)) mixer.setLevel(key, value); });
    // the pause card: every bus but UI goes to -60 dB in 200 ms
    on('menu:opened', () => { for (const b in BUSES) if (b !== 'ui') mixer.duck(b, 60, Infinity, { attack: 0.2, release: 0.2, id: 'pause:' + b }); });
    on('menu:closed', () => { for (const b in BUSES) mixer.unduck('pause:' + b); });
    on('vehicle:crash', ({ speed }) => audio.crash(speed));
    on('prop:broken', ({ kind, speed }) => {
      if (kind === 'cone') audio.clatter(); else if (kind === 'barrier') { audio.clatter(); audio.crash(speed * 0.4); } else { audio.clang(); audio.crash(speed * 0.5); }
    });
    ctx.test.audio = () => ({ running: !!mixer.ctx && mixer.ctx.state === 'running', time: mixer.ctx ? mixer.ctx.currentTime : 0, muted: mixer.muted,
      buses: Object.keys(mixer.buses), rms: { music: mixer.rms('music'), master: mixer.rms('master') },
      duck: Object.fromEntries(Object.keys(mixer.buses).map((b) => [b, mixer.depth(b)])), limiter: !!mixer.master });
    // other sound modules reach the mixer through the public object
    Object.assign(audio, { mixer, bus: (name) => mixer.bus(name), duck: mixer.duck, unduck: mixer.unduck, rms: mixer.rms });
    Object.defineProperties(audio, { ctx: { get: () => mixer.ctx }, muted: { get: () => mixer.muted } });
    return audio;
  },
  render(alpha, ctx) {
    mixer.update();
    const car = ctx.modules.vehicles && ctx.modules.vehicles.player, a = ctx.input.actions;
    if (!car) return;
    const ratio = Math.min(1, Math.abs(car.vf) / car.maxSpeed);
    const seaNear = Math.max(0, Math.min(1, (car.z + 30) / 90));
    audio.update(ratio, a.gas, seaNear * Math.sqrt(seaNear), car.gear + 1, car.slip, car.kmh);
    audio.setHorn(a.horn);
  },
};
