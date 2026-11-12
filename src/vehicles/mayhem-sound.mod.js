// STAND-IN: replace with audio.sfx(name, opts) and audio.loop(name, opts) once the Sound lane has them.
// The sounds of things breaking, as the recipes in plan/bible/art/sfx.md: glass (25), hydrant (27),
// splinter (28), clatter (29), thud (30) and explosion (55). Each hangs on an event, falls off with
// distance as gain / (1 + (d / 12)^2), is silent past 150 m, and never plays twice inside 40 ms.
// Made from oscillators and one shared noise buffer; connects to the mixer's `effects` bus.

let api = null;
export default {
  name: 'mayhemsound', order: 53, needs: ['audio'],
  init(ctx) {
    const m = ctx.modules, ev = ctx.events, S = ctx.state;
    const stats = { glass: 0, explosion: 0, hydrant: 0, splinter: 0, clatter: 0, thud: 0, played: 0, loop: 0 };
    const last = {};
    let white = null, loop = null;
    const ac = () => (m.audio && m.audio.ctx && m.audio.ctx.state === 'running' && !m.audio.muted ? m.audio.ctx : null);
    const out = () => m.audio.bus('effects');
    const fall = (x, z) => { if (x === undefined) return 1; const d = Math.hypot(x - S.player.x, z - S.player.z); return d > 150 ? 0 : 1 / (1 + (d / 12) * (d / 12)); };
    function buffer(c) {
      if (white) return white;
      white = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
      const d = white.getChannelData(0); let s = 12345;
      for (let i = 0; i < d.length; i++) { s = (s * 16807) % 2147483647; d[i] = s / 1073741823.5 - 1; }
      return white;
    }
    // gain rises in a seconds and falls to nothing in d
    function env(c, node, g, a, d, at) {
      const gain = c.createGain(), t = c.currentTime + at;
      gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(g, t + a); gain.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
      node.connect(gain); gain.connect(out());
      return t;
    }
    function noise(c, type, f, q, g, a, d, at = 0, f1 = 0, glide = 0) {
      const src = c.createBufferSource(), flt = c.createBiquadFilter();
      src.buffer = buffer(c); src.loop = true; flt.type = type; flt.frequency.value = f; flt.Q.value = q;
      src.connect(flt);
      const t = env(c, flt, g, a, d, at);
      if (f1) { flt.frequency.setValueAtTime(f, t); flt.frequency.exponentialRampToValueAtTime(f1, t + glide); }
      src.start(t, Math.random() * 1.5); src.stop(t + a + d + 0.05);
    }
    function tone(c, type, f0, f1, glide, g, a, d, at = 0) {
      const o = c.createOscillator(); o.type = type;
      const t = env(c, o, g, a, d, at);
      o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + glide);
      o.start(t); o.stop(t + a + d + 0.05);
    }
    const recipes = {
      glass(c, k) {
        noise(c, 'highpass', 5000, 0.7, 0.5 * k, 0.001, 0.08);
        for (let i = 0; i < 5; i++) tone(c, 'sine', 2600 + Math.random() * 2600, 2600, 0, 0.12 * k, 0.001, 0.06, i * 0.03);
      },
      explosion(c, k) {
        noise(c, 'highpass', 1500, 0.7, 0.7 * k, 0.001, 0.04);
        noise(c, 'lowpass', 900, 0.7, 0.9 * k, 0.002, 1.4, 0, 200, 0.8);
        tone(c, 'sine', 120, 35, 0.5, 0.9 * k, 0.002, 0.7);
        for (let i = 0; i < 14; i++) noise(c, 'bandpass', 1200 + Math.random() * 2300, 2, (0.25 - 0.2 * i / 13) * k, 0.001, 0.03, 0.3 + 1.5 * i / 13 + Math.random() * 0.05);
        for (let i = 0; i < 3; i++) recipes.clatter(c, k * 0.6, 1.9 + i * 0.25);
        if (m.audio.duck) m.audio.duck('music', 4, 0.6);
      },
      hydrant(c, k) { noise(c, 'lowpass', 2000, 0.7, 0.6 * k, 0.005, 0.3); tone(c, 'sine', 90, 50, 0.2, 0.5 * k, 0.002, 0.25); },
      splinter(c, k) { for (let i = 0; i < 4; i++) noise(c, 'bandpass', 1800, 2, 0.4 * k, 0.001, 0.04, Math.random() * 0.09); },
      clatter(c, k, at = 0) {
        for (let i = 0; i < 5; i++) { const g = 0.3 * k * (1 - i * 0.15); tone(c, 'triangle', 700 + Math.random() * 700, 700, 0, g, 0.001, 0.05, at + i * 0.09); noise(c, 'highpass', 3000, 0.7, g * 0.7, 0.001, 0.03, at + i * 0.09); }
      },
      thud(c, k) { tone(c, 'sine', 110, 70, 0.08, 0.5 * k, 0.002, 0.14); noise(c, 'lowpass', 500, 0.7, 0.25 * k, 0.001, 0.06); },
    };
    function play(id, x, z, level = 1) {
      const now = performance.now();
      if (now - (last[id] || -1e9) < 40) return;
      last[id] = now; stats[id]++;
      const c = ac(), k = fall(x, z) * level;
      if (!c || k < 0.004) return;
      recipes[id](c, k); stats.played++;
    }
    ev.on('vehicle:damaged', (e) => { if (e.stage >= 1 && e.was < 1) play('glass', e.x, e.z); });
    ev.on('vehicle:destroyed', (e) => play('explosion', e.x, e.z));
    ev.on('panel:fell', (e) => play('clatter', e.x, e.z));
    ev.on('prop:broken', (e) => {
      if (!e) return;
      if (e.kind === 'hydrant') play('hydrant', e.x, e.z); else if (e.kind === 'fence') play('splinter', e.x, e.z);
      else if (e.kind === 'table' || e.kind === 'chair' || e.kind === 'sign') play('clatter', e.x, e.z);
    });
    ev.on('coconut:landed', (e) => play('thud', e.x, e.z, 0.8));
    ev.on('ped:hit', (e) => play('thud', e.x, e.z));

    api = {
      stats, play,
      // the geyser's hiss: one loop, as loud as the nearest geyser is near
      update() {
        const c = ac(), gs = m.breakables ? m.breakables.geysers : [];
        let k = 0;
        for (const g of gs) k = Math.max(k, fall(g.x, g.z) * Math.min(1, g.t / 3));
        stats.loop = k;
        if (!c) return;
        if (!loop && k > 0.004) {
          const src = c.createBufferSource(), band = c.createBiquadFilter(), high = c.createBiquadFilter(), g1 = c.createGain(), g2 = c.createGain(), gain = c.createGain();
          src.buffer = buffer(c); src.loop = true; band.type = 'bandpass'; band.frequency.value = 1400; band.Q.value = 0.6; high.type = 'highpass'; high.frequency.value = 6000;
          g1.gain.value = 0.35; g2.gain.value = 0.1; gain.gain.value = 0;
          src.connect(band); band.connect(g1); g1.connect(gain); src.connect(high); high.connect(g2); g2.connect(gain); gain.connect(out());
          src.start(); loop = { src, gain };
        }
        if (loop) {
          loop.gain.gain.setTargetAtTime(k, c.currentTime, 0.04);
          if (k === 0 && !gs.length) { loop.src.stop(c.currentTime + 0.3); loop = null; }
        }
      },
    };
    ctx.test.mayhemSound = () => ({ ...stats, running: !!ac(), looping: !!loop });
    return api;
  },
  render() { api.update(); },
};
