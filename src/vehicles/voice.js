// The engine and horn of each class, from the recipes in src/content/vehicles.js (art/sfx.md
// section 2 and rows 32 to 35): oscillator A, oscillator B through its own gain, an optional sine
// sub, one low-pass, a gain. Pitch runs idle to top along the gear curve.
// STAND-IN: engines belong to the Sound lane (src/audio), which today plays the Heron's hum for
// every model. Until it reads `modules.vehicles.sounds`, this plays the class voice over it for
// every model that is not on the coupe recipe, and plays other drivers' horns.
const GEARS = [[0, 0.28, 0, 0.55], [0.28, 0.5, 0.35, 0.72], [0.5, 0.74, 0.5, 0.87], [0.74, 1, 0.62, 1]];
const LEVEL = 1;

// What the voice should be doing: pure numbers, so it can be checked without a sound card.
export function engineTone(rec, ratio, throttle, gear) {
  let q = Math.max(0, Math.min(1, ratio));
  if (!rec.noGears) { const G = GEARS[Math.max(0, Math.min(3, gear))], k = Math.max(0, Math.min(1, (ratio - G[0]) / (G[1] - G[0]))); q = G[2] + (G[3] - G[2]) * k; }
  const f = (rec.hz[0] + (rec.hz[1] - rec.hz[0]) * q) * (1 + 0.06 * throttle);
  return { q, f, fb: rec.b ? f * rec.b[1] : 0, sub: rec.sub ? f * rec.sub[0] : 0, lp: rec.lp[0] + rec.lp[1] * q + rec.lp[2] * throttle,
    gain: (0.03 + throttle * 0.03 + q * 0.015) * rec.level, lope: !!rec.lope && q < 0.08 };
}

export function createVoice() {
  let ctx = null, master = null, muted = false, cur = null, curId = null, horn = null;
  const stats = { id: null, f: 0, lp: 0, gain: 0, playing: false, horn: null, honks: 0, started: false };

  function start() {
    if (ctx) { if (ctx.state === 'suspended' && !document.hidden) ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC(); stats.started = true;
    master = ctx.createGain(); master.gain.value = muted ? 0 : 1; master.connect(ctx.destination);
    document.addEventListener('visibilitychange', () => { if (document.hidden) ctx.suspend(); else ctx.resume(); });
  }
  const osc = (type, f) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; return o; };

  function build(rec) {
    const v = { a: osc(rec.a, rec.hz[0]), b: null, sub: null, lp: ctx.createBiquadFilter(), out: ctx.createGain(), lfo: null, lfoG: null };
    v.lp.type = 'lowpass'; v.lp.Q.value = rec.q; v.out.gain.value = 0;
    v.a.connect(v.lp);
    if (rec.b) { v.b = osc(rec.b[0], rec.hz[0] * rec.b[1]); const g = ctx.createGain(); g.gain.value = rec.b[2]; v.b.connect(g); g.connect(v.lp); v.b.start(); }
    if (rec.sub) { v.sub = osc('sine', rec.hz[0] * rec.sub[0]); const g = ctx.createGain(); g.gain.value = rec.sub[1]; v.sub.connect(g); g.connect(v.lp); v.sub.start(); }
    let tail = v.lp;
    if (rec.hp) { const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = rec.hp; v.lp.connect(hp); tail = hp; }
    // the lope: at idle the gain wobbles at 9 Hz, depth 0.35
    const wob = ctx.createGain(); wob.gain.value = 1;
    if (rec.lope) { v.lfo = osc('sine', 9); v.lfoG = ctx.createGain(); v.lfoG.gain.value = 0; v.lfo.connect(v.lfoG); v.lfoG.connect(wob.gain); v.lfo.start(); }
    tail.connect(wob); wob.connect(v.out); v.out.connect(master);
    v.a.start();
    return v;
  }
  function drop(v) {
    const t = ctx.currentTime;
    v.out.gain.setTargetAtTime(0, t, 0.03);
    for (const o of [v.a, v.b, v.sub, v.lfo]) if (o) o.stop(t + 0.3);
  }

  return {
    start, stats,
    setMuted(m) { muted = m; if (master) master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, 0.03); },
    // sound: a row of SOUNDS. on: someone is driving it.
    update(sound, ratio, throttle, gear, on) {
      const rec = sound.engine, tone = engineTone(rec, ratio, throttle, gear);
      const play = on && rec.id !== 'engine-coupe';          // the Sound lane's own hum is the coupe
      Object.assign(stats, { id: rec.id, f: tone.f, lp: tone.lp, gain: play ? tone.gain : 0, playing: play });
      if (!ctx) return;
      const t = ctx.currentTime;
      if (curId !== (play ? rec.id + rec.hz[0] : null)) { if (cur) drop(cur); cur = play ? build(rec) : null; curId = play ? rec.id + rec.hz[0] : null; }
      if (!cur) return;
      cur.a.frequency.setTargetAtTime(tone.f, t, 0.04);
      if (cur.b) cur.b.frequency.setTargetAtTime(tone.fb, t, 0.04);
      if (cur.sub) cur.sub.frequency.setTargetAtTime(tone.sub, t, 0.04);
      cur.lp.frequency.setTargetAtTime(tone.lp, t, 0.08);
      cur.out.gain.setTargetAtTime(tone.gain * LEVEL, t, 0.1);
      if (cur.lfoG) cur.lfoG.gain.setTargetAtTime(tone.lope ? 0.35 : 0, t, 0.1);
    },
    // a horn: two squares on the model's two notes, the upper 0.4% sharp, through a low-pass
    honk(sound, seconds = 0.5, loud = 1) {
      stats.honks++; stats.horn = sound.horn.slice(0, 2);
      if (!ctx || loud <= 0.01) return;
      const [lo, hi, cut, g] = sound.horn, t = ctx.currentTime, lp = ctx.createBiquadFilter(), out = ctx.createGain();
      lp.type = 'lowpass'; lp.frequency.value = cut;
      out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(g * loud * LEVEL, t + 0.01);
      out.gain.setValueAtTime(g * loud * LEVEL, t + seconds); out.gain.linearRampToValueAtTime(0, t + seconds + 0.06);
      const a = osc('square', lo), b = osc('square', hi * 1.004);
      a.connect(lp); b.connect(lp); lp.connect(out); out.connect(master);
      a.start(t); b.start(t); a.stop(t + seconds + 0.1); b.stop(t + seconds + 0.1);
      horn = out;
    },
  };
}
