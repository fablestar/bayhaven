// All sound is made here from oscillators and noise. No audio files anywhere in this game.
// The mixer (day 4): master > music, effects, ambience, voice, ui. Each bus is
//   in > duck > fader > master, and the master ends in a soft limiter (a hard compressor, then tanh).
//   mixer.bus(name)                 the node to connect a sound to
//   mixer.duck(bus, dB, seconds, { attack, release, id })   a dip as a gain ramp; the deepest one wins
//   mixer.rms(bus)                  what the bus measures right now (music and master only)
// Faders and ducks: plan/bible/art/synth-patches.md section 6.
// The car (days 1 and 2), now on the effects bus, with wind and surf on the ambience bus:
//   engine: two oscillators through a low-pass filter, four gears
//   wind:   noise that rises with speed      surf: noise that swells like waves near the sea
//   tyre squeal, crash thumps, lamp clangs, a horn (plan/bible/art/sfx.md rows 1, 17, 22, 26, 29, 32)

const dB = (d) => Math.pow(10, d / 20);
export const BUSES = { music: -10, effects: -6, ambience: -14, voice: -8, ui: -12 };
const SLIDER = { music: 'music', effects: 'sfx', ambience: 'sfx', voice: 'voice', ui: 'sfx' };

export function createMixer(settings = {}) {
  const mixer = { ctx: null, master: null, muted: false, ducks: [], buses: {} };
  const probes = {};
  const slider = (name) => { const v = settings[SLIDER[name]]; return v == null ? 1 : v; };

  mixer.start = () => {
    if (mixer.ctx) { if (mixer.ctx.state === 'suspended' && !document.hidden) mixer.ctx.resume(); return false; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    const ctx = mixer.ctx = new AC();
    // the limiter: nothing leaves louder than 0.98 of full scale
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -3; comp.knee.value = 0; comp.ratio.value = 20; comp.attack.value = 0.003; comp.release.value = 0.25;
    const soft = ctx.createWaveShaper(), curve = new Float32Array(1025), k = 1.5;
    for (let i = 0; i < 1025; i++) curve[i] = 0.98 * Math.tanh(k * (i / 512 - 1)) / Math.tanh(k);
    soft.curve = curve;
    mixer.master = ctx.createGain(); mixer.master.gain.value = mixer.muted ? 0 : (settings.master ?? 1);
    mixer.master.connect(comp); comp.connect(soft); soft.connect(ctx.destination);
    for (const name in BUSES) {
      const input = ctx.createGain(), duck = ctx.createGain(), fader = ctx.createGain();
      fader.gain.value = dB(BUSES[name]) * slider(name);
      input.connect(duck); duck.connect(fader); fader.connect(mixer.master);
      mixer.buses[name] = { input, duck, fader, depth: 0 };
    }
    for (const [name, node] of [['music', mixer.buses.music.fader], ['master', soft]]) {
      const a = ctx.createAnalyser(); a.fftSize = 2048; node.connect(a);
      probes[name] = { a, data: new Float32Array(2048) };
    }
    return true;
  };
  mixer.bus = (name) => (mixer.buses[name] ? mixer.buses[name].input : null);
  // sliders from the settings menu: master, music, sfx, voice (0 to 1)
  mixer.setLevel = (key, value) => {
    settings[key] = value;
    if (!mixer.ctx) return;
    const t = mixer.ctx.currentTime;
    if (key === 'master') { if (!mixer.muted) mixer.master.gain.setTargetAtTime(value, t, 0.03); return; }
    for (const name in BUSES) if (SLIDER[name] === key) mixer.buses[name].fader.gain.setTargetAtTime(dB(BUSES[name]) * value, t, 0.03);
  };
  // a duck holds for `seconds` (Infinity until unduck(id)); two at once use the deeper one
  mixer.duck = (bus, depth, seconds = 0.3, { attack = 0.03, release = 0.4, id = null, filter = null } = {}) => {
    if (!mixer.ctx || !mixer.buses[bus]) return;
    if (id) mixer.ducks = mixer.ducks.filter((d) => d.id !== id);
    mixer.ducks.push({ bus, depth: Math.abs(depth), until: mixer.ctx.currentTime + attack + seconds, attack, release, id, filter });
    mixer.update();
  };
  mixer.unduck = (id) => { for (const d of mixer.ducks) if (d.id === id) d.until = 0; mixer.update(); };
  // called every frame: lets go of ducks whose time is up
  mixer.update = () => {
    if (!mixer.ctx) return;
    const t = mixer.ctx.currentTime;
    for (const name in mixer.buses) {
      const b = mixer.buses[name];
      let deep = 0, attack = 0.03, release = b.release || 0.4;
      for (const d of mixer.ducks) if (d.bus === name && d.until > t && d.depth >= deep) { deep = d.depth; attack = d.attack; release = d.release; }
      if (deep === b.depth) continue;
      // setTargetAtTime gets 95% of the way in three time constants
      b.duck.gain.cancelScheduledValues(t);
      b.duck.gain.setTargetAtTime(dB(-deep), t, (deep > b.depth ? attack : release) / 3);
      b.depth = deep; b.release = release;
    }
    if (mixer.ducks.length) mixer.ducks = mixer.ducks.filter((d) => d.until > t);
  };
  mixer.rms = (name = 'music') => {
    const p = probes[name];
    if (!p) return 0;
    p.a.getFloatTimeDomainData(p.data);
    let sum = 0;
    for (let i = 0; i < p.data.length; i++) sum += p.data[i] * p.data[i];
    return Math.sqrt(sum / p.data.length);
  };
  // the mute key: master to silence in 50 ms
  mixer.toggleMute = () => {
    mixer.muted = !mixer.muted;
    if (mixer.master) mixer.master.gain.setTargetAtTime(mixer.muted ? 0 : (settings.master ?? 1), mixer.ctx.currentTime, 0.017);
    return mixer.muted;
  };
  mixer.depth = (bus) => (mixer.buses[bus] ? mixer.buses[bus].depth : 0);
  document.addEventListener('visibilitychange', () => {       // quiet while the tab is hidden
    if (!mixer.ctx) return;
    if (document.hidden) mixer.ctx.suspend(); else mixer.ctx.resume();
  });
  return mixer;
}

// engine pitch within each gear: [speed share from, to, q from, to]
const GEARS = [[0, 0.28, 0, 0.55], [0.28, 0.50, 0.35, 0.72], [0.50, 0.74, 0.50, 0.87], [0.74, 1, 0.62, 1]];
// The car's levels were set by ear on day 1 with no buses. The bus faders are now in the way
// (effects -6 dB, ambience -14 dB), so these put the same loudness back.
const LEVEL = 0.3, FX = 1 / dB(BUSES.effects), AMB = 1 / dB(BUSES.ambience);

export function createAudio(mixer) {
  let ctx = null, master, ambience, o1, o2, filt, engine, wind, windFilt, surf;
  let white, squeal, squealFilt, squealSaw, horn = null, dipUntil = 0;
  const stats = { gear: 1, q: 0, squeal: 0, crashes: 0, clangs: 0, clatters: 0, horn: false, shifts: 0 };

  function noiseBuffer() {
    const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { last = last * 0.6 + (Math.random() * 2 - 1) * 0.4; d[i] = last * 1.6; }
    return buf;
  }

  function start() {
    if (!mixer.start()) return;
    ctx = mixer.ctx;
    // two trims put day 1's levels back under the new faders
    master = ctx.createGain(); master.gain.value = FX; master.connect(mixer.bus('effects'));
    ambience = ctx.createGain(); ambience.gain.value = AMB; ambience.connect(mixer.bus('ambience'));

    o1 = ctx.createOscillator(); o1.type = 'sawtooth';
    o2 = ctx.createOscillator(); o2.type = 'square';
    filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.Q.value = 2;
    engine = ctx.createGain(); engine.gain.value = 0;
    const g2 = ctx.createGain(); g2.gain.value = 0.5;
    o1.connect(filt); o2.connect(g2); g2.connect(filt);
    filt.connect(engine); engine.connect(master);
    o1.start(); o2.start();

    const noise = ctx.createBufferSource(); noise.buffer = noiseBuffer(); noise.loop = true;
    windFilt = ctx.createBiquadFilter(); windFilt.type = 'bandpass'; windFilt.Q.value = 0.6;
    wind = ctx.createGain(); wind.gain.value = 0;
    noise.connect(windFilt); windFilt.connect(wind); wind.connect(ambience);

    // surf: a slow oscillator opens and closes the volume, like waves rolling in
    const surfFilt = ctx.createBiquadFilter(); surfFilt.type = 'lowpass'; surfFilt.frequency.value = 650;
    const swell = ctx.createGain(); swell.gain.value = 0.55;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.13;
    const lfoAmt = ctx.createGain(); lfoAmt.gain.value = 0.4;
    lfo.connect(lfoAmt); lfoAmt.connect(swell.gain);
    surf = ctx.createGain(); surf.gain.value = 0;
    noise.connect(surfFilt); surfFilt.connect(swell); swell.connect(surf); surf.connect(ambience);
    noise.start(); lfo.start();

    // white noise for squeals and crashes
    white = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const wd = white.getChannelData(0);
    for (let i = 0; i < wd.length; i++) wd[i] = Math.random() * 2 - 1;
    // tyre squeal: band-passed noise plus a little saw at the same pitch
    const sq = ctx.createBufferSource(); sq.buffer = white; sq.loop = true;
    squealFilt = ctx.createBiquadFilter(); squealFilt.type = 'bandpass'; squealFilt.Q.value = 7; squealFilt.frequency.value = 1800;
    squealSaw = ctx.createOscillator(); squealSaw.type = 'sawtooth'; squealSaw.frequency.value = 1800;
    const sawG = ctx.createGain(); sawG.gain.value = 0.15;
    squeal = ctx.createGain(); squeal.gain.value = 0;
    sq.connect(squealFilt); squealFilt.connect(squeal); squealSaw.connect(sawG); sawG.connect(squeal); squeal.connect(master);
    sq.start(); squealSaw.start();
  }

  // a short one-shot: source > optional filter > gain envelope (attack a, decay d)
  function shot(src, filter, g, a, d, at = 0) {
    const t = ctx.currentTime + at, gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(g * LEVEL, t + a);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    if (filter) { src.connect(filter); filter.connect(gain); } else src.connect(gain);
    gain.connect(master);
    src.start(t); src.stop(t + a + d + 0.05);
  }
  function noiseSrc() { const n = ctx.createBufferSource(); n.buffer = white; n.loop = true; return n; }
  function osc(type, f0, f1, glide) {
    const o = ctx.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f0, ctx.currentTime);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, ctx.currentTime + glide);
    return o;
  }
  function filter(type, f, q = 0.7) { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; }

  // a hit: noise burst plus a 60 Hz thump, both scaled by impact speed (m/s)
  function crash(speed) {
    stats.crashes++;
    if (!ctx) return;
    const v = Math.min(1, speed / 30);
    shot(noiseSrc(), filter('lowpass', 600 + 3000 * v), 0.8 * v, 0.001, 0.12 + 0.2 * v);
    shot(osc('sine', 60, 40, 0.2), null, 0.9 * v, 0.001, 0.25);
  }
  // a lamp post going over
  function clang() {
    stats.clangs++;
    if (!ctx) return;
    for (const f of [310, 472, 811]) shot(osc('sine', f), null, 0.3, 0.001, 0.9);
    shot(noiseSrc(), null, 0.3, 0.001, 0.005);
  }
  // cones and barriers: five light hits over 0.4 s
  function clatter() {
    stats.clatters++;
    if (!ctx) return;
    for (let i = 0; i < 5; i++) {
      shot(osc('triangle', 700 + Math.random() * 700), null, 0.3 * (1 - i * 0.15), 0.001, 0.05, i * 0.09);
      shot(noiseSrc(), filter('highpass', 3000), 0.2 * (1 - i * 0.15), 0.001, 0.03, i * 0.09);
    }
  }
  // the Heron's horn: A4 and C#5, the upper note a touch sharp
  function setHorn(on) {
    if (on === stats.horn) return;
    stats.horn = on;
    if (!ctx) return;
    const t = ctx.currentTime;
    if (on) {
      const g = ctx.createGain(), lp = filter('lowpass', 2400);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.25 * LEVEL, t + 0.01);
      const a = osc('square', 440), b = osc('square', 554.37 * 1.004);
      a.connect(lp); b.connect(lp); lp.connect(g); g.connect(master);
      a.start(); b.start();
      horn = { g, a, b };
    } else if (horn) {
      horn.g.gain.setTargetAtTime(0, t, 0.02);
      horn.a.stop(t + 0.2); horn.b.stop(t + 0.2);
      horn = null;
    }
  }

  // speedRatio 0..1, throttle 0..1, sea 0..1 (how close the sea is), gear 1..4, slip in rad, km/h
  function update(speedRatio, throttle, sea, gear = 1, slip = 0, kmh = 0) {
    const G = GEARS[gear - 1], k = Math.max(0, Math.min(1, (speedRatio - G[0]) / (G[1] - G[0])));
    const q = G[2] + (G[3] - G[2]) * k;         // revs: climb through a gear, drop on the change up
    if (gear !== stats.gear) { stats.shifts++; if (gear > stats.gear && ctx) dipUntil = ctx.currentTime + 0.08; }
    stats.gear = gear; stats.q = q;
    stats.squeal = 0.45 * Math.max(0, Math.min(1, (slip - 0.15) / 0.4)) * (kmh > 15 ? 1 : 0);
    if (!ctx) return;
    const t = ctx.currentTime;
    const f = (40 + (170 - 40) * q) * (1 + 0.06 * throttle);
    o1.frequency.setTargetAtTime(f, t, 0.04);
    o2.frequency.setTargetAtTime(f * 0.5, t, 0.04);
    filt.frequency.setTargetAtTime(260 + q * 1300 + throttle * 350, t, 0.08);
    const dip = t < dipUntil ? 0.63 : 1;        // 4 dB down for 80 ms on a change up
    engine.gain.setTargetAtTime((0.03 + throttle * 0.03 + q * 0.015) * dip, t, dip < 1 ? 0.01 : 0.1);
    windFilt.frequency.setTargetAtTime(500 + speedRatio * 1400, t, 0.2);
    wind.gain.setTargetAtTime(speedRatio * speedRatio * 0.05, t, 0.15);
    surf.gain.setTargetAtTime(sea * 0.1, t, 0.4);
    const sf = Math.min(3200, 1800 + 12 * kmh);
    squealFilt.frequency.setTargetAtTime(sf, t, 0.05); squealSaw.frequency.setTargetAtTime(sf, t, 0.05);
    squeal.gain.setTargetAtTime(stats.squeal * LEVEL * 0.5, t, 0.04);
  }

  return { start, update, crash, clang, clatter, setHorn, stats, toggleMute: () => mixer.toggleMute() };
}
