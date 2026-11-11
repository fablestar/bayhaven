// The loop: a fixed 60 steps a second of simulation, drawing as often as the screen allows,
// never more than three steps in one frame (plan/bible/tech/algorithms.md, section 1).
//   loop.time (seconds simulated), loop.step (count), loop.timeScale (1, 0.3, 0)
//   loop.every(seconds, fn), loop.after(seconds, fn): slow ticks, counted in game time
//   loop.dt and loop.alpha: this frame's length and how far it sits between two steps (for drawing)

export const STEP = 1 / 60;
const WINDOW = 120;

export function createLoop({ step, draw, events }) {
  const simRing = new Float32Array(WINDOW), frameRing = new Float32Array(WINDOW), sorted = new Float32Array(WINDOW);
  const timers = [];
  let acc = 0, last = 0, ringAt = 0, ringFull = false, started = false;

  const loop = {
    time: 0, frameTime: 0, step: 0, frame: 0, timeScale: 1, dt: 0, alpha: 0,
    simMs: 0, simP95: 0, simMax: 0, frameMs: 0, fps: 0,
    every(seconds, fn) { const t = { period: seconds, left: seconds, fn, repeat: true }; timers.push(t); return () => drop(t); },
    after(seconds, fn) { const t = { period: seconds, left: seconds, fn, repeat: false }; timers.push(t); return () => drop(t); },
    // one fixed step, right now (the frame loop and test.advance both come through here)
    stepOnce() {
      step(STEP);
      loop.time += STEP; loop.step++;
      for (let i = 0; i < timers.length; i++) {
        const t = timers[i];
        t.left -= STEP;
        if (t.left > 1e-9) continue;
        if (t.repeat) t.left += t.period; else { timers.splice(i, 1); i--; }
        t.fn(t.period);
      }
    },
    resetStats() { loop.simMax = 0; ringAt = 0; ringFull = false; },
    start() { if (!started) { started = true; last = performance.now(); requestAnimationFrame(frame); } },
  };
  function drop(t) { const i = timers.indexOf(t); if (i >= 0) timers.splice(i, 1); }

  function frame(t) {
    requestAnimationFrame(frame);
    const raw = Math.max(0, (t - last) / 1000); last = t;
    const dt = Math.min(raw, 0.1) * loop.timeScale;
    acc += dt;
    const t0 = performance.now();
    let n = 0;
    while (acc >= STEP && n < 3) { loop.stepOnce(); acc -= STEP; n++; }
    if (n === 3 && acc >= STEP) acc = 0;          // too slow: drop time, never spiral
    const ms = performance.now() - t0;
    loop.dt = dt; loop.alpha = acc / STEP; loop.frameTime += dt; loop.frame++;
    draw(loop.alpha, dt, raw);

    simRing[ringAt] = ms; frameRing[ringAt] = raw * 1000;
    if (ms > loop.simMax) loop.simMax = ms;
    if (++ringAt === WINDOW) { ringAt = 0; ringFull = true; }
    if (loop.frame % 20 === 0 || loop.frame < 20) {
      const count = ringFull ? WINDOW : ringAt;
      let sim = 0, fr = 0;
      for (let i = 0; i < count; i++) { sim += simRing[i]; fr += frameRing[i]; sorted[i] = simRing[i]; }
      loop.simMs = sim / count; loop.frameMs = fr / count; loop.fps = fr > 0 ? 1000 * count / fr : 0;
      const part = sorted.subarray(0, count).sort();
      loop.simP95 = part[Math.min(count - 1, Math.floor(count * 0.95))];
    }
    if (loop.frame === 1) events.emit('game:ready');
  }
  return loop;
}
