// STAND-IN: replace with audio.sfx(name, opts) once the Sound lane has it.
// The weapons' sounds as the recipes in plan/bible/catalog/weapons.md, made from oscillators and one noise
// buffer on the mixer's `effects` bus. Each falls off with distance and never plays twice inside 40 ms.
export function createCombatSound(ctx) {
  const m = ctx.modules, S = ctx.state, stats = { played: 0 }, last = {};
  let white = null;
  const ac = () => (m.audio && m.audio.ctx && m.audio.ctx.state === 'running' && !m.audio.muted ? m.audio.ctx : null);
  const fall = (x, z) => { if (x === undefined) return 1; const d = Math.hypot(x - S.player.x, z - S.player.z); return d > 150 ? 0 : 1 / (1 + (d / 14) * (d / 14)); };
  function buffer(c) {
    if (white) return white;
    white = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = white.getChannelData(0); let s = 4242;
    for (let i = 0; i < d.length; i++) { s = (s * 16807) % 2147483647; d[i] = s / 1073741823.5 - 1; }
    return white;
  }
  function env(c, node, g, a, d, at) {
    const gain = c.createGain(), t = c.currentTime + at;
    gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(g, t + a); gain.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    node.connect(gain); gain.connect(m.audio.bus('effects'));
    return t;
  }
  function noise(c, type, f, g, d, at = 0) {
    const src = c.createBufferSource(), flt = c.createBiquadFilter();
    src.buffer = buffer(c); src.loop = true; flt.type = type; flt.frequency.value = f;
    src.connect(flt);
    const t = env(c, flt, g, 0.001, d, at);
    src.start(t, Math.random() * 0.8); src.stop(t + d + 0.05);
  }
  function tone(c, type, f0, f1, glide, g, d, at = 0) {
    const o = c.createOscillator(); o.type = type;
    const t = env(c, o, g, 0.002, d, at);
    o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + glide);
    o.start(t); o.stop(t + d + 0.05);
  }
  const recipes = {
    punch(c, k, o) { noise(c, 'lowpass', 400, 0.5 * k, 0.04); tone(c, 'sine', 220, 180, 0.03, 0.3 * k, 0.04); if (o.heavy) tone(c, 'sine', 60, 45, 0.1, 0.6 * k, 0.14); },
    bop(c, k) { tone(c, 'sine', 300, 150, 0.09, 0.55 * k, 0.09); },                       // the noodle's "bop"
    knock(c, k) { noise(c, 'lowpass', 500, 0.35 * k, 0.04); tone(c, 'sine', 180, 170, 0.05, 0.5 * k, 0.06); },
    pistol(c, k) { noise(c, 'highpass', 900, 0.7 * k, 0.03); tone(c, 'square', 900, 500, 0.02, 0.18 * k, 0.025); tone(c, 'sine', 4200, 3900, 0.05, 0.05 * k, 0.05, 0.2); },
    smg(c, k) { noise(c, 'highpass', 1000, 0.55 * k, 0.025); tone(c, 'square', 700 + Math.random() * 100, 450, 0.02, 0.14 * k, 0.02); },
    shotgun(c, k) { noise(c, 'lowpass', 2400, 0.9 * k, 0.08); tone(c, 'sine', 110, 50, 0.25, 0.7 * k, 0.25); tone(c, 'square', 300, 300, 0, 0.1 * k, 0.015, 0.3); tone(c, 'square', 240, 240, 0, 0.1 * k, 0.015, 0.4); },
    flare(c, k) { noise(c, 'bandpass', 300, 0.8 * k, 0.09); tone(c, 'sine', 600, 1400, 0.9, 0.12 * k, 0.9, 0.05); },
    click(c, k) { tone(c, 'square', 1400, 1400, 0, 0.1 * k, 0.012); tone(c, 'square', 900, 900, 0, 0.1 * k, 0.012, 0.09); },
    pickup(c, k) { tone(c, 'triangle', 660, 660, 0, 0.2 * k, 0.07); tone(c, 'triangle', 990, 990, 0, 0.2 * k, 0.1, 0.07); },
    snap(c, k) { noise(c, 'highpass', 2000, 0.5 * k, 0.05); tone(c, 'sine', 500, 200, 0.08, 0.3 * k, 0.08); },
    hurt(c, k) { tone(c, 'sine', 90, 55, 0.12, 0.5 * k, 0.14); },
  };
  return {
    stats,
    play(name, x, z, o = {}) {
      const c = ac(), now = performance.now();
      stats[name] = (stats[name] || 0) + 1;
      if (!c || !recipes[name] || now - (last[name] || 0) < 40) return;
      const k = fall(x, z); if (k < 0.01) return;
      last[name] = now; stats.played++;
      recipes[name](c, k, o);
    },
  };
}
