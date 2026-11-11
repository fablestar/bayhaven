// window.__game.test: what the checks in tools/ drive the game with. Checks use only this,
// so they keep working when the insides move. A lane adds its own entries from its module's
// init: ctx.test.spawnVehicle = ... and lists them in its docs/contracts file.

import { STEP } from './loop.js';

export function createTestApi(ctx) {
  const { events, state, loop, quality } = ctx;
  const M = ctx.modules;
  const seen = [];

  // console errors and warnings, page errors and failed promises, as the game saw them
  for (const kind of ['error', 'warn']) {
    const real = console[kind].bind(console);
    console[kind] = (...args) => { seen.push(kind + ': ' + args.map((a) => (a && a.message) || String(a)).join(' ')); real(...args); };
  }
  window.addEventListener('error', (e) => seen.push('page error: ' + e.message));
  window.addEventListener('unhandledrejection', (e) => seen.push('rejection: ' + ((e.reason && e.reason.message) || e.reason)));

  const copyPlayer = () => {
    const p = M.player ? M.player.get() : state.player;
    return { ...p, drift: p.drift ? { ...p.drift } : undefined };
  };
  const angle = (a) => Math.atan2(Math.sin(a), Math.cos(a));

  const test = {
    ready: new Promise((resolve) => events.once('game:ready', resolve)),
    stats() {
      const info = ctx.renderer.info.render, mem = performance.memory;
      return {
        calls: info.calls, tris: info.triangles,
        simMs: loop.simMs, simP95: loop.simP95, simMax: loop.simMax, chunkMs: M.chunks ? M.chunks.buildMs || 0 : 0,
        fps: loop.fps, frameMs: loop.frameMs, heapMB: mem ? mem.usedJSHeapSize / 1048576 : 0,
        chunks: state.world.chunksLoaded, cars: M.traffic ? M.traffic.count : 0, peds: M.peds ? M.peds.count || 0 : 0,
        cops: M.cops && M.cops.units ? M.cops.units.length : 0,
        simTime: loop.time, quality: quality.level, pixelRatio: quality.pixelRatio,
      };
    },
    resetStats: () => loop.resetStats(),
    errors: () => seen.concat(events.errors),
    modules: () => ctx.registry.list(),
    teleport(x, z, h, speed = 0) { if (M.player) M.player.teleport(x, z, h, 0, speed); },   // speed in m/s
    setHour(h) { if (M.clock) M.clock.set(h); else state.clock.hour = h; },
    setQuality: (q) => quality.set(q),
    input: (steps) => ctx.input.inject(steps),
    // resolves after this many seconds of game time have gone by in the real frame loop
    wait(seconds) { return new Promise((resolve) => loop.after(seconds, resolve)); },
    // run game time forward right now, without drawing (the same steps the frame loop runs)
    advance(seconds) { for (let i = 0, n = Math.round(seconds / STEP); i < n; i++) loop.stepOnce(); return copyPlayer(); },
    player: copyPlayer,
    count: (name) => events.count(name),
    reset: () => events.emit('game:reset'),
    save: { export: () => ctx.save.exportCode(), import: (code) => ctx.save.importCode(code), snapshot: () => ctx.save.snapshot() },

    // The route follower: a small autopilot that steers the player's vehicle along a line of
    // points, looking 12 m ahead and slowing for corners. `to` is a list of { x, z } stops; the
    // roads between them come from nav.route. Resolves with { seconds, metres, reached } at the
    // end of the line or after `seconds` of game time, whichever is first.
    drive(to, { seconds = 60, speed = 12, loops = 1 } = {}) {
      const line = [];
      let from = M.player.get();
      for (let n = 0; n < loops; n++) for (const stop of to) {
        const leg = M.nav ? M.nav.route(from, stop) : [stop];
        for (const p of leg) line.push(p);
        from = stop;
      }
      let i = 0, t = 0, metres = 0, lastX = from.x, lastZ = from.z, started = false;
      return ctx.input.inject((a, dt) => {
        const p = M.player.get();
        if (!started) { started = true; lastX = p.x; lastZ = p.z; }
        metres += Math.hypot(p.x - lastX, p.z - lastZ); lastX = p.x; lastZ = p.z;
        while (i < line.length - 1 && Math.hypot(line[i].x - p.x, line[i].z - p.z) < 12) i++;
        const aim = line[i], dist = Math.hypot(aim.x - p.x, aim.z - p.z);
        const turn = angle(Math.atan2(aim.x - p.x, aim.z - p.z) - p.h);
        // slow down when the line bends soon, or when the nose points well off it
        let want = speed;
        if (i < line.length - 1) {
          const nx = line[i + 1], bend = Math.abs(angle(Math.atan2(nx.x - aim.x, nx.z - aim.z) - Math.atan2(aim.x - p.x, aim.z - p.z)));
          if (bend > 0.5 && dist < 26) want = Math.min(want, 6.5);
        }
        if (Math.abs(turn) > 0.6) want = Math.min(want, 5);
        a.steer = Math.max(-1, Math.min(1, turn * 2.2));
        a.gas = p.speed < want ? 1 : 0; a.brake = p.speed > want + 1.5 ? 1 : 0;
        a.handbrake = false; a.horn = false; a.lookBack = false;
        t += dt;
        const reached = i === line.length - 1 && dist < 6;
        if (reached || t >= seconds) { test.lastDrive = { seconds: t, metres, reached }; return true; }
        return false;
      }).then(() => test.lastDrive);
    },
  };

  // names day 2's first checks and tools/shot.mjs still read; new checks use test and modules
  const game = window.__game = {
    test, state, events, modules: M, renderer: ctx.renderer, camera: ctx.camera, quality, loop, save: ctx.save, scene: ctx.scene,
    setHour: (h) => test.setHour(h),
    get buildDay() { return state.build.day; },
    get car() { return M.vehicles && M.vehicles.player; },
    get world() { return M.world; }, get sky() { return M.sky; }, get props() { return M.props; }, get fx() { return M.fx; },
    get audio() { return M.audio; }, get cams() { return M.camera; }, get hud() { return M.hud; },
    get drop() { return M.drops ? M.drops.active : null; },
    input: Object.assign(Object.create(ctx.input.actions), { poll: (dt) => ctx.input.sample(dt) }),
  };
  void game;
  return test;
}
