// The instruments the radio plays, each a few oscillators or a noise burst made at the note's
// start time and stopped at its end. Numbers: plan/bible/art/synth-patches.md and the station
// files in plan/bible/radio/.
//   synth.play(patch, ev, time)   ev: { n: MIDI note or notes: [..], v: velocity 0..127, d: seconds,
//                                       plus what a patch reads: variant, gate, slide, pan, f0 }
//   synth.setTempo(bpm)           the tempo delay follows the song
//   synth.duck(group, dB, release, time)   a dip on the bass or pad group (each kick)
//   synth.patches                 the names           synth.stats { voices, played, stolen }
// Chain: voice > the patch's strip > its group (drums, bass, pad, lead) > out, with sends from
// the strip to a plate reverb and a tempo delay, both built from delay nodes only.

const dB = (d) => Math.pow(10, d / 20);
const hz = (n) => 440 * Math.pow(2, (n - 69) / 12);
const SILENT = 0.0001;

// [level dB, group, reverb send dB, delay send dB]
const STRIPS = {
  kick: [-6, 'drums'], snare: [-9, 'drums'], clap: [-10, 'drums', -10], hat: [-16, 'drums'], 'open-hat': [-17, 'drums'], tom: [-10, 'drums'],
  'bass-808': [-5, 'bass'], 'saw-bass': [-9, 'bass'], lead: [-11, 'lead', -14, -9], pad: [-15, 'pad', -8], pluck: [-12, 'lead', null, -8],
  marimba: [-10, 'lead', -14], bell: [-14, 'lead', -8], piano: [-11, 'lead', -12], brass: [-10, 'lead', -12],
  cowbell: [-15, 'drums'], clave: [-13, 'drums'], conga: [-12, 'drums'], guiro: [-16, 'drums'], rim: [-14, 'drums'],
  riser: [-12, 'lead'], 'sub-drop': [-6, 'bass'], foghorn: [-12, 'lead', -8],
};

export function createSynth(ac, out, { voiceCap = 12, stereo = false, seed = 7 } = {}) {
  const stats = { voices: 0, played: 0, stolen: 0 };
  const live = [];                       // { end, amp } of sounding notes, oldest first
  const groups = {}, strips = {};
  for (const g of ['drums', 'bass', 'pad', 'lead']) { groups[g] = ac.createGain(); groups[g].connect(out); }

  // one second of white noise, the same for everyone
  const noise = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  { const d = noise.getChannelData(0); let s = seed >>> 0;
    for (let i = 0; i < d.length; i++) { s = (s * 1664525 + 1013904223) >>> 0; d[i] = s / 2147483648 - 1; } }

  const gain = (v = 1) => { const g = ac.createGain(); g.gain.value = v; return g; };
  const filter = (type, f, q = 0.7) => { const b = ac.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; };
  const shaper = (drive) => { const w = ac.createWaveShaper(), c = new Float32Array(513); for (let i = 0; i < 513; i++) c[i] = Math.tanh(drive * (i / 256 - 1)); w.curve = c; return w; };
  const chain = (...nodes) => { for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]); return nodes[0]; };

  // ---- the plate reverb: four combs side by side, then two all-passes (section 6) ----
  function reverb(T, scale) {
    const input = gain(), pre = ac.createDelay(0.05), sum = gain(0.25), output = gain();
    pre.delayTime.value = 0.012; input.connect(pre);
    for (const ms of [29.7, 37.1, 41.1, 43.7]) {
      const d = ac.createDelay(0.1), lp = filter('lowpass', 4200), fb = gain(Math.pow(10, -3 * (ms * scale / 1000) / T));
      d.delayTime.value = ms * scale / 1000;
      pre.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); d.connect(sum);
    }
    let node = sum;
    for (const ms of [5.0, 3.5]) {
      const s = gain(), d = ac.createDelay(0.02), back = gain(0.7), through = gain(-0.7), o = gain();
      d.delayTime.value = ms / 1000;
      node.connect(s); s.connect(d); d.connect(back); back.connect(s); s.connect(through); through.connect(o); d.connect(o);
      node = o;
    }
    node.connect(output);
    return { input, output };
  }
  const revIn = gain(), revOut = gain(dB(-12));
  if (stereo) {
    const merge = ac.createChannelMerger(2);
    [1, 1.021].forEach((k, i) => { const r = reverb(1.2, k); revIn.connect(r.input); r.output.connect(merge, 0, i); });
    merge.connect(revOut);
  } else { const r = reverb(1.2, 1); revIn.connect(r.input); r.output.connect(revOut); }
  revOut.connect(out);

  // ---- the tempo delay: left feeds right, right feeds left ----
  const delIn = gain(), delOut = gain(dB(-14)), taps = [];
  for (const pan of [-0.7, 0.7]) {
    const d = ac.createDelay(1), lp = filter('lowpass', 2800), hp = filter('highpass', 300), fb = gain(0.38);
    d.delayTime.value = 0.4; chain(d, lp, hp, fb);
    if (ac.createStereoPanner) { const p = ac.createStereoPanner(); p.pan.value = pan; fb.connect(p); p.connect(delOut); } else fb.connect(delOut);
    taps.push({ d, fb });
  }
  delIn.connect(taps[0].d); taps[0].fb.connect(taps[1].d); taps[1].fb.connect(taps[0].d);
  delOut.connect(out);

  // ---- a strip per patch, made the first time it plays ----
  function strip(name) {
    if (strips[name]) return strips[name];
    const [level, group, rev, del] = STRIPS[name];
    const s = gain(dB(level));
    strips[name] = s;
    s.connect(groups[group]);
    if (rev != null) { const g = gain(dB(rev)); s.connect(g); g.connect(revIn); }
    if (del != null) { const g = gain(dB(del)); s.connect(g); g.connect(delIn); }
    // patches that share one shaper or filter for all their notes
    if (name === 'kick') { s.pre = shaper(1.5); s.pre.connect(s); }
    else if (name === 'bass-808') { s.pre = shaper(2.2); chain(s.pre, filter('lowpass', 900), s); }
    else if (name === 'snare') { s.pre = filter('bandpass', 1800, 0.8); chain(s.pre, filter('highpass', 700), s); }
    else if (name === 'clap') { s.pre = filter('bandpass', 1200, 1.4); s.pre.connect(s); }
    else if (name === 'hat') { s.pre = filter('highpass', 7000); s.pre.connect(s); }
    else if (name === 'open-hat') { s.pre = filter('highpass', 6000); s.pre.connect(s); }
    else if (name === 'cowbell') { s.pre = filter('bandpass', 1000, 2.5); s.pre.connect(s); }
    else if (name === 'guiro') { s.pre = filter('bandpass', 4000, 3); s.pre.connect(s); }
    else if (name === 'pad') {
      // chorus: two short delays swept by a slow oscillator, mixed in at 40%
      const lfo = ac.createOscillator(); lfo.frequency.value = 0.3; lfo.start();
      s.pre = gain(); s.pre.connect(s);
      for (const [ms, sign] of [[14, 1], [21, -1]]) {
        const d = ac.createDelay(0.05), depth = gain(0.003 * sign), wet = gain(0.4);
        d.delayTime.value = ms / 1000; lfo.connect(depth); depth.connect(d.delayTime);
        s.pre.connect(d); d.connect(wet); wet.connect(s);
      }
    }
    return s;
  }
  const into = (name) => { const s = strip(name); return s.pre || s; };

  // ---- voices ----
  function track(end, amp) {
    const t = ac.currentTime;
    while (live.length && live[0].end <= t) live.shift();
    if (live.length >= voiceCap) {               // steal the oldest
      const v = live.shift(); stats.stolen++;
      try { v.amp.gain.cancelScheduledValues(t); v.amp.gain.setTargetAtTime(0, t, 0.01); } catch { /* already gone */ }
    }
    live.push({ end, amp }); stats.voices = live.length; stats.played++;
  }
  // an amp with attack, decay to a sustain level, held to `off`, then released. Seconds.
  function amp(t, peak, a, d, s, off, r) {
    const g = ac.createGain(), p = g.gain;
    p.setValueAtTime(SILENT, t); p.linearRampToValueAtTime(peak, t + a);
    if (!(s > 0)) { p.exponentialRampToValueAtTime(SILENT, t + a + d); g.end = t + a + d; return g; }
    const hold = Math.max(off, t + a + 0.005);
    p.setTargetAtTime(Math.max(SILENT, peak * s), t + a, d / 3);
    p.setTargetAtTime(SILENT, hold, r / 4);
    g.end = hold + r * 1.5;
    return g;
  }
  function osc(type, f, t, end, detune = 0) {
    const o = ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); o.detune.value = detune;
    o.start(t); o.stop(end + 0.03); return o;
  }
  function burst(t, end) { const n = ac.createBufferSource(); n.buffer = noise; n.loop = true; n.start(t, (t * 7.3) % 0.9); n.stop(end + 0.03); return n; }
  // a low-pass whose cutoff starts at base + env and falls back to base
  function sweep(t, base, env, a, d, q) {
    const f = filter('lowpass', base, q);
    f.frequency.setValueAtTime(base, t); f.frequency.linearRampToValueAtTime(base + env, t + a);
    f.frequency.exponentialRampToValueAtTime(base, t + a + d);
    return f;
  }
  const vel = (ev) => Math.pow((ev.v ?? 100) / 127, 1.5);
  const pan = (node, ev, dest) => {
    if (!ev.pan || !ac.createStereoPanner) return node.connect(dest);
    const p = ac.createStereoPanner(); p.pan.value = ev.pan; node.connect(p); p.connect(dest);
  };
  // a drum made of noise: bursts is a list of [start, attack, decay, level]
  function noiseHit(name, t, v, bursts, ev = {}) {
    const last = bursts[bursts.length - 1], end = t + last[0] + last[1] + last[2];
    const g = ac.createGain(), p = g.gain;
    p.setValueAtTime(SILENT, t);
    for (const [at, a, d, level] of bursts) { p.linearRampToValueAtTime(v * level, t + at + a); p.exponentialRampToValueAtTime(SILENT, t + at + a + d); }
    burst(t, end).connect(g); pan(g, ev, into(name)); g.end = end; track(end, g);
    return g;
  }
  function tone(name, t, v, type, f0, f1, glide, a, d, ev = {}) {
    const g = amp(t, v, a, d, 0), o = osc(type, f0, t, g.end);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + glide);
    o.connect(g); pan(g, ev, into(name)); track(g.end, g);
    return g;
  }

  let openHat = null, bass808 = null, lastLead = 0, lastLeadEnd = 0;
  const P = {
    kick(t, ev) {
      const k = { dembow: [48, 0.18], club: [44, 0.4], soft: [50, 0.2] }[ev.variant] || [48, 0.28], v = vel(ev);
      tone('kick', t, v, 'sine', ev.variant === 'soft' ? 120 : 150, k[0], 0.09, 0.001, k[1]);
      noiseHit('hat', t, v * 0.8, [[0, 0.0005, 0.004, 1]]);                     // the click
    },
    snare(t, ev) {
      const v = vel(ev);
      const body = amp(t, v * dB(-3), 0.001, 0.12, 0), o = osc('triangle', 185, t, body.end);
      o.frequency.exponentialRampToValueAtTime(140, t + 0.06); o.connect(body); body.connect(strip('snare')); track(body.end, body);
      if (ev.variant === 'tail') {
        // Tideline 98: a 40 ms body, then a 280 ms tail at -12 dB that stops at once (a gate, not a fade)
        const g = ac.createGain(), p = g.gain, end = t + 0.32;
        p.setValueAtTime(v, t); p.exponentialRampToValueAtTime(v * 0.25, t + 0.04); p.linearRampToValueAtTime(v * 0.2, end); p.setValueAtTime(0, end + 0.002);
        burst(t, end).connect(g); g.connect(into('snare')); track(end, g);
      } else noiseHit('snare', t, v, [[0, 0.001, 0.18, 1]]);
    },
    clap(t, ev) { const v = vel(ev); noiseHit('clap', t, v, [[0, 0.001, 0.01, 1], [0.012, 0.001, 0.01, 1], [0.024, 0.001, 0.14, 1]]); },
    hat(t, ev) {
      if (openHat && openHat.end > t) { openHat.gain.cancelScheduledValues(t); openHat.gain.setTargetAtTime(0, t, 0.004); openHat = null; }
      noiseHit('hat', t, vel(ev), [[0, 0.001, 0.045, 1]], ev);
    },
    'open-hat'(t, ev) { openHat = noiseHit('open-hat', t, vel(ev), [[0, 0.001, 0.32, 1]], ev); },
    tom(t, ev) { const f = ev.f0 || 180; tone('tom', t, vel(ev), 'sine', f, f / 2, 0.16, 0.001, 0.22); },
    // one voice: a note that slides moves the sounding oscillator instead of starting another
    'bass-808'(t, ev) {
      const f = hz(ev.n), v = vel(ev), decay = ev.decay || 0.9, end = t + Math.max(ev.d || 0.2, 0.08) + decay * 0.5;
      if (ev.slide && bass808 && bass808.end > t) {
        bass808.o.frequency.cancelScheduledValues(t); bass808.o.frequency.setTargetAtTime(f, t, 0.03);
        const p = bass808.g.gain; p.cancelScheduledValues(t); p.setTargetAtTime(v * 0.8, t, 0.01); p.setTargetAtTime(SILENT, t + (ev.d || 0.2), decay / 4);
        bass808.end = end + 0.3; try { bass808.o.stop(end + 0.4); } catch { /* stopped */ }
        return;
      }
      if (bass808 && bass808.end > t) { bass808.g.gain.cancelScheduledValues(t); bass808.g.gain.setTargetAtTime(0, t, 0.006); }
      const g = ac.createGain(), p = g.gain, o = ac.createOscillator();
      o.frequency.setValueAtTime(f * 2, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.025);
      p.setValueAtTime(SILENT, t); p.linearRampToValueAtTime(v, t + 0.002); p.setTargetAtTime(SILENT, t + 0.002, decay / 4);
      o.start(t); o.stop(end + 0.4); o.connect(g); g.connect(into('bass-808'));
      bass808 = { o, g, end: end + 0.3 }; track(end, g);
    },
    'saw-bass'(t, ev) {
      const f = hz(ev.n), g = amp(t, vel(ev) * 0.5, 0.003, 0.18, 0.6, t + (ev.d || 0.2), 0.08);
      const f1 = sweep(t, 180, 1400, 0.003, 0.16, 4), f2 = filter('lowpass', 1600, 0.7), sub = gain(0.4);
      osc('sawtooth', f, t, g.end, 6).connect(f1); osc('sawtooth', f, t, g.end, -6).connect(f1);
      osc('square', f / 2, t, g.end).connect(sub); sub.connect(f1);
      chain(f1, f2, g, strip('saw-bass')); track(g.end, g);
    },
    lead(t, ev) {
      const f = hz(ev.n), one = ev.variant === 'one', off = t + (ev.d || 0.2);
      const g = amp(t, vel(ev) * 0.45, 0.008, 0.12, 0.7, off, 0.16);
      const flt = one ? filter('lowpass', 1600, 1) : sweep(t, 2200, 1800, 0.005, 0.24, 2.5);
      const oscs = one ? [osc('square', f, t, g.end)] : [osc('sawtooth', f, t, g.end, 9), osc('sawtooth', f, t, g.end, -9)];
      for (const o of oscs) {
        if (!one && lastLead && lastLead !== f && t - lastLeadEnd < 0.08) { o.frequency.setValueAtTime(lastLead, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.04); }
        o.connect(flt);
      }
      if (!one && off - t > 0.25) {                 // vibrato: 6 Hz, 12 cents, after 200 ms
        const lfo = osc('sine', 6, t + 0.2, g.end), depth = gain(12);
        lfo.connect(depth); for (const o of oscs) depth.connect(o.detune);
      }
      lastLead = f; lastLeadEnd = off; chain(flt, g, strip('lead')); track(g.end, g);
    },
    // a chord is one voice: all its saws through one filter and one amp
    pad(t, ev) {
      const notes = ev.notes || [ev.n], off = t + (ev.d || 1), gated = !!ev.gate, v = vel(ev) * 0.3;
      const g = gated ? amp(t, v, 0.005, 0.2, 0.9, off, 0.03) : amp(t, v, 0.42, 0.6, 0.8, off, 0.9);
      const flt = filter('lowpass', 900, 0.8);
      flt.frequency.setValueAtTime(900, t); flt.frequency.linearRampToValueAtTime(1500, t + (gated ? 0.05 : 0.6));
      notes.forEach((n, i) => {
        const f = hz(n);
        for (const c of [-11, 11]) osc('sawtooth', f, t, g.end, c).connect(flt);
        if (i === notes.length - 1) { const up = gain(0.3); osc('sawtooth', f * 2, t, g.end).connect(up); up.connect(flt); }
      });
      let last = g;
      if (gated) {
        // the gate: the pad's volume switched step by step, 5 ms each way so it clicks softly
        const gate = ac.createGain(), p = gate.gain, { pattern, step } = ev.gate;
        p.setValueAtTime(0, t);
        for (let i = 0, n = Math.round((off - t) / step), was = false; i < n; i++) {
          const on = pattern[i % pattern.length] !== '.', at = t + i * step;
          if (on && !was) { p.setValueAtTime(0, at); p.linearRampToValueAtTime(1, at + 0.005); }
          else if (!on && was) { p.setValueAtTime(1, at - 0.005); p.linearRampToValueAtTime(0, at); }
          was = on;
        }
        g.connect(gate); last = gate;
      }
      flt.connect(g); last.connect(into('pad')); track(g.end, g);
    },
    pluck(t, ev) {
      const f = hz(ev.n), glass = ev.variant === 'glass';
      const g = amp(t, vel(ev) * 0.5, 0.001, 0.16, 0, 0, 0);
      const flt = glass ? sweep(t, 2500, 1200, 0.001, 0.09, 6) : sweep(t, 600, 3200, 0.001, 0.09, 3), sq = gain(0.5);
      osc('sawtooth', f, t, g.end).connect(flt); osc('square', f, t, g.end).connect(sq); sq.connect(flt);
      flt.connect(g); pan(g, ev, strip('pluck')); track(g.end, g);
      // the glass arp's quiet copy an octave up, a dotted eighth later
      if (glass && ev.echo) P.pluck(t + ev.echo, { variant: 'glass', n: ev.n + 12, v: (ev.v ?? 100) * 0.45, pan: -(ev.pan || 0) });
    },
    marimba(t, ev) {
      const f = hz(ev.n), v = vel(ev), long = ev.n < 48 ? 0.42 : 0.26;
      for (const [k, level, d] of [[1, 0, long], [4, -10, 0.04], [10, -22, 0.015]]) tone('marimba', t, v * dB(level) * 0.8, 'sine', f * k, 0, 0, 0.001, d);
    },
    bell(t, ev) {
      const f = hz(ev.n), g = amp(t, vel(ev) * 0.7, 0.001, 1.4, 0), car = osc('sine', f, t, g.end), mod = osc('sine', f * 3.5, t, g.end), index = ac.createGain();
      index.gain.setValueAtTime(4 * f * 3.5, t); index.gain.exponentialRampToValueAtTime(0.5 * f * 3.5, t + 0.9);
      mod.connect(index); index.connect(car.frequency); car.connect(g); g.connect(strip('bell')); track(g.end, g);
    },
    piano(t, ev) {
      const notes = ev.notes || [ev.n], off = t + (ev.d || 0.3), flt = filter('lowpass', 3500);
      const g = amp(t, vel(ev) * 0.6 / Math.sqrt(notes.length), 0.002, 1.6, 0.5, off, 0.22);
      for (const n of notes) {
        const f = hz(n), car = osc('sine', f, t, g.end), mod = osc('sine', f, t, g.end), index = ac.createGain();
        index.gain.setValueAtTime(1.8 * f, t); index.gain.exponentialRampToValueAtTime(0.3 * f, t + 0.5);
        mod.connect(index); index.connect(car.frequency); car.connect(flt);
      }
      flt.connect(g); pan(g, ev, strip('piano')); track(g.end, g);
    },
    brass(t, ev) {
      const notes = ev.notes || [ev.n], off = t + (ev.d || 0.2);
      const g = amp(t, vel(ev) * 0.4 / Math.sqrt(notes.length), 0.025, 0.14, 0.6, off, 0.12), flt = filter('lowpass', 500, 1.2);
      flt.frequency.setValueAtTime(500, t); flt.frequency.linearRampToValueAtTime(2600, t + 0.04); flt.frequency.exponentialRampToValueAtTime(1100, t + 0.22);
      for (const n of notes) for (const c of [7, -7]) {
        const o = osc('sawtooth', hz(n), t, g.end, c - 40);
        o.detune.setValueAtTime(c - 40, t); o.detune.linearRampToValueAtTime(c, t + 0.05); o.connect(flt);       // the scoop
      }
      flt.connect(g); g.connect(strip('brass')); track(g.end, g);
    },
    cowbell(t, ev) {
      const v = vel(ev), ring = (ev.v ?? 100) > 110 ? 0.25 : 0.08, end = t + 0.015 + ring;
      const g = ac.createGain(), p = g.gain;
      p.setValueAtTime(v, t); p.exponentialRampToValueAtTime(v * 0.4, t + 0.015); p.exponentialRampToValueAtTime(SILENT, end);
      for (const f of [540, 800]) osc('square', f, t, end).connect(g);
      pan(g, { pan: 0.2 }, into('cowbell')); track(end, g);
    },
    clave(t, ev) { tone('clave', t, vel(ev), 'sine', 2400, 0, 0, 0.0005, 0.03); },
    rim(t, ev) { tone('rim', t, vel(ev), 'sine', 1700, 0, 0, 0.0005, 0.02); noiseHit('hat', t, vel(ev) * 0.6, [[0, 0.0005, 0.002, 1]]); },
    conga(t, ev) {
      const v = vel(ev), f = ev.low ? 180 : 220;
      if (ev.slap) noiseHit('snare', t, v * 0.5, [[0, 0.001, 0.015, 1]]);
      else tone('conga', t, v, 'sine', f * 1.3, f, 0.02, 0.001, 0.18);
    },
    guiro(t, ev) {
      const long = ev.long ? 0.12 : 0.04, g = noiseHit('guiro', t, vel(ev) * 2, [[0, 0.005, long, 1]]);
      const chop = osc('square', 60, t, g.end), depth = gain(vel(ev)); chop.connect(depth); depth.connect(g.gain);
    },
    riser(t, ev) {
      const d = ev.d || 2, g = ac.createGain(), flt = filter('bandpass', 400, 2), v = vel(ev);
      g.gain.setValueAtTime(SILENT, t); g.gain.exponentialRampToValueAtTime(v, t + d); g.gain.setValueAtTime(0, t + d + 0.002);
      flt.frequency.setValueAtTime(400, t); flt.frequency.exponentialRampToValueAtTime(8000, t + d);
      chain(burst(t, t + d), flt, g, strip('riser')); track(t + d, g);
    },
    'sub-drop'(t, ev) { const d = ev.d || 1.6; tone('sub-drop', t, vel(ev), 'sine', 120, 35, d, 0.005, d); },
    foghorn(t, ev) {
      const g = amp(t, vel(ev) * 0.5, 0.03, 0.1, 0.9, t + 0.3, 0.2), flt = filter('lowpass', 900);
      for (const f of [110, 116.5]) osc('sawtooth', f, t, g.end).connect(flt);
      chain(flt, g, strip('foghorn')); track(g.end, g);
    },
  };

  return {
    stats, groups, patches: Object.keys(P), out,
    play(name, ev, time) {
      const t = Math.max(time ?? 0, ac.currentTime);
      if (P[name]) P[name](t, ev || {});
    },
    setTempo(bpm, dotted = true) {
      const s = Math.min(0.95, 60 / bpm * (dotted ? 0.75 : 0.5));
      for (const tap of taps) tap.d.delayTime.setTargetAtTime(s, ac.currentTime, 0.02);
      return s;
    },
    // each kick dips the bass or the pad: 12 ms down, then back over `release`
    duck(group, depth, release, time) {
      const p = groups[group].gain, t = Math.max(time, ac.currentTime);
      p.cancelScheduledValues(t); p.setTargetAtTime(dB(-depth), t, 0.004); p.setTargetAtTime(1, t + 0.012, release / 3);
    },
    // let go of everything: a station change or the door opening
    hush(seconds = 0.05) {
      const t = ac.currentTime;
      for (const v of live) { try { v.amp.gain.cancelScheduledValues(t); v.amp.gain.setTargetAtTime(0, t, seconds / 3); } catch { /* gone */ } }
      live.length = 0; bass808 = null; openHat = null; stats.voices = 0;
    },
  };
}
