// Engine hum made from two oscillators. No audio files anywhere in this game.

export function createEngineSound() {
  let ctx = null, o1, o2, filt, gain, muted = false;

  function start() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    o1 = ctx.createOscillator(); o1.type = 'sawtooth';
    o2 = ctx.createOscillator(); o2.type = 'square';
    filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.Q.value = 2;
    gain = ctx.createGain(); gain.gain.value = 0;
    const g2 = ctx.createGain(); g2.gain.value = 0.5;
    o1.connect(filt); o2.connect(g2); g2.connect(filt);
    filt.connect(gain); gain.connect(ctx.destination);
    o1.start(); o2.start();
  }

  function update(speedRatio, throttle) {
    if (!ctx) return;
    const t = ctx.currentTime;
    const f = 40 + speedRatio * 120 + throttle * 10;
    o1.frequency.setTargetAtTime(f, t, 0.06);
    o2.frequency.setTargetAtTime(f * 0.5, t, 0.06);
    filt.frequency.setTargetAtTime(260 + speedRatio * 1300 + throttle * 350, t, 0.08);
    gain.gain.setTargetAtTime(muted ? 0 : 0.03 + throttle * 0.03 + speedRatio * 0.015, t, 0.1);
  }

  return {
    start, update,
    toggleMute() { muted = !muted; return muted; },
  };
}
