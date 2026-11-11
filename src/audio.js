// All sound is made here from oscillators and noise. No audio files anywhere in this game.
//   engine: two oscillators through a low-pass filter
//   wind:   noise that rises with speed
//   surf:   noise that swells and fades like waves, louder the closer you are to the sea

export function createAudio() {
  let ctx = null, master, o1, o2, filt, engine, wind, windFilt, surf, muted = false;

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
  }

  // speedRatio 0..1, throttle 0..1, sea 0..1 (how close the sea is)
  function update(speedRatio, throttle, sea) {
    if (!ctx) return;
    const t = ctx.currentTime;
    const f = 40 + speedRatio * 120 + throttle * 10;
    o1.frequency.setTargetAtTime(f, t, 0.06);
    o2.frequency.setTargetAtTime(f * 0.5, t, 0.06);
    filt.frequency.setTargetAtTime(260 + speedRatio * 1300 + throttle * 350, t, 0.08);
    engine.gain.setTargetAtTime(0.03 + throttle * 0.03 + speedRatio * 0.015, t, 0.1);
    windFilt.frequency.setTargetAtTime(500 + speedRatio * 1400, t, 0.2);
    wind.gain.setTargetAtTime(speedRatio * speedRatio * 0.05, t, 0.15);
    surf.gain.setTargetAtTime(sea * 0.1, t, 0.4);
  }

  // go quiet when the tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });

  return {
    start, update,
    toggleMute() {
      muted = !muted;
      if (master) master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.03);
      return muted;
    },
  };
}
