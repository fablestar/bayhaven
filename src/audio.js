// All sound is made here from oscillators and noise. No audio files anywhere in this game.
//   engine: two oscillators through a low-pass filter
//   wind:   noise that rises with speed
//   surf:   noise that swells and fades like waves, louder the closer you are to the sea
//   day 2:  four gears on the engine, tyre squeal, crash thumps, lamp clangs, a horn
// Recipes from plan/bible/art/sfx.md (rows 1, 17, 22, 26, 29, 32). Levels are scaled to sit
// with day 1's quiet engine.

// engine pitch within each gear: [speed share from, to, q from, to]
const GEARS = [[0, 0.28, 0, 0.55], [0.28, 0.50, 0.35, 0.72], [0.50, 0.74, 0.50, 0.87], [0.74, 1, 0.62, 1]];
const LEVEL = 0.3;

export function createAudio() {
  let ctx = null, master, o1, o2, filt, engine, wind, windFilt, surf, muted = false;
  let white, squeal, squealFilt, squealSaw, horn = null, dipUntil = 0;
  const stats = { gear: 1, q: 0, squeal: 0, crashes: 0, clangs: 0, clatters: 0, horn: false, shifts: 0 };

  function noiseBuffer() {
    const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { last = last * 0.6 + (Math.random() * 2 - 1) * 0.4; d[i] = last * 1.6; }
    return buf;
  }

  function start() {
    if (ctx) { if (ctx.state === 'suspended' && !document.hidden) ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination);

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
    noise.connect(windFilt); windFilt.connect(wind); wind.connect(master);

    // surf: a slow oscillator opens and closes the volume, like waves rolling in
    const surfFilt = ctx.createBiquadFilter(); surfFilt.type = 'lowpass'; surfFilt.frequency.value = 650;
    const swell = ctx.createGain(); swell.gain.value = 0.55;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.13;
    const lfoAmt = ctx.createGain(); lfoAmt.gain.value = 0.4;
    lfo.connect(lfoAmt); lfoAmt.connect(swell.gain);
    surf = ctx.createGain(); surf.gain.value = 0;
    noise.connect(surfFilt); surfFilt.connect(swell); swell.connect(surf); surf.connect(master);
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

  // go quiet when the tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });

  return {
    start, update, crash, clang, clatter, setHorn, stats,
    toggleMute() {
      muted = !muted;
      if (master) master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.03);
      return muted;
    },
  };
}
