// The fifteen step types of plan/05-content.md. Each is { enter, update → true when done, skip, exit, view }.
// `E` is what the engine lends a step: the player's place, the scripted vehicles, dialogue, seat(),
// fail(text), and `run` (counters, flags, the step's own scratch object `run.st`).
// Stubs today: cutscene (its lines play as dialogue; one tap skips), switch (completes at once and records
// the lead). `goto` does not read `stealth` yet. `photo` is real since D6-S2: it waits for the phone
// camera's `photo:taken` with the step's `subject` in its list of targets.

const near = (E, at, r) => Math.hypot(E.px() - at.x, E.pz() - at.z) <= r;
const goal = (at, r, kind = 'goal') => ({ id: 'goal', x: at.x, z: at.z, r, kind });

// "Honk at the cruiser": for a `heat` step with `honk: { at, r, every }`, a horn blast within r of the spot
// sets heat 1, and every `every` seconds of not pulling over adds a level, up to the step's level.
function honk(st, run, E, level) {
  const h = st.honk;
  if (level === 0) { run.st.honkT = 0; if (E.horn() && E.inCar() && near(E, h.at, h.r || 20)) { E.setHeat(1); E.cue('honk'); } return; }
  if (level >= (st.level || 1)) return;
  run.st.honkT = (run.st.honkT || 0) + (E.speed() > 2 ? E.dt : 0);
  if (run.st.honkT >= (h.every || 15)) { run.st.honkT = 0; E.setHeat(level + 1); }
}

const talk = {
  enter(st, run, E) { run.st.talk = st.lines && run.mode !== 'cup' ? E.say(st.lines, true) : null; },
  update(st, run, E) { return !run.st.talk || run.st.talk.done || !!run.st.skip; },
  skip(st, run, E) { E.hush(); },
};

export const STEPS = {
  say: talk,
  cutscene: { ...talk, view: (st, run) => ({ cutscene: run.mode !== 'cup' }) },

  goto: {
    update(st, run, E) {
      if (!near(E, st.at, st.r || 6)) return false;
      if (st.as === 'foot' && E.inCar()) return false;
      if (st.as === 'vehicle' && !E.inCar()) return false;
      if (st.vehicle && E.car().model !== st.vehicle) return false;
      if (st.cond === 'tidy' && E.carHealth() < 80) { E.hint(st.hint || 'Dents get you turned away.'); return false; }
      return true;
    },
    skip(st, run, E) { E.put(st.at.x, st.at.z, st.at.h, st.as === 'vehicle' || (st.as !== 'foot' && E.inCar())); },
    view: (st) => ({ markers: [goal(st.at, st.r || 6)], route: st.route ? st.at : null }),
  },

  enter: {
    enter(st, run, E) {
      if (E.inCar() && run.ride === st.vehicle && E.car().model === st.vehicle) return;      // already in the mission's car (a retry)
      const stood = run.stood && run.stood[st.vehicle];                                       // an earlier step's `cars` put it there
      if (stood && E.onStreet(stood)) { run.st.v = stood; return; }
      if (st.spawn) run.st.v = E.standCar(st.vehicle, st.spawn, st.paint, st.accent);
    },
    update(st, run, E) {
      if (!E.inCar() || E.car().model !== st.vehicle) return false;
      if (run.st.v && E.onStreet(run.st.v)) return false;          // it has to be the one that was put there
      run.ride = st.vehicle;
      return true;
    },
    skip(st, run, E) {
      const v = run.st.v, at = v && E.onStreet(v) ? { x: v.x, z: v.z, h: v.h } : st.spawn || { x: E.px(), z: E.pz(), h: 0 };
      if (v && E.onStreet(v)) E.takeCar(v);
      E.seat(st.vehicle, at, st.paint, st.accent);
      run.ride = st.vehicle;
    },
    view(st, run) { const v = run.st.v || st.spawn; return v ? { markers: [{ id: 'goal', x: v.x, z: v.z, r: 2.5, kind: 'vehicle' }] } : {}; },
  },

  follow: {
    update(st, run, E) {
      const a = E.actor(st.target);
      if (!a) return true;
      if (st.keep && Math.hypot(E.px() - a.x, E.pz() - a.z) > st.keep) { E.fail(st.lost || 'You lost them.', 'target:lost'); return false; }
      return a.done;
    },
    view(st, run, E) { const a = E.actor(st.target); return a ? { markers: [{ id: 'target', x: a.x, z: a.z, kind: 'target', label: a.def.label }] } : {}; },
  },

  chase: {
    update(st, run, E) {
      const a = E.actor(st.target);
      if (!a) return true;
      const by = st.stopBy || 'near';
      if (by === 'ram') return run.counters.rams >= (st.hits || 1);
      if (by === 'time') return run.stepT >= (st.seconds || 30);
      const t = E.tail(a), d = Math.hypot(E.px() - t.x, E.pz() - t.z) - E.car().hl;
      if (by === 'block') { run.st.held = a.speed < 1 && d < 15 ? (run.st.held || 0) + E.dt : 0; return run.st.held > 2; }
      return E.inCar() && d <= (st.within || 12);
    },
    skip(st, run, E) {          // put the player's car close behind it, at its speed
      const a = E.actor(st.target);
      if (!a) return;
      const t = E.tail(a), back = (st.stopBy === 'near' ? Math.min(8, (st.within || 12) - 2) : 8) + E.car().hl;
      E.seat(run.ride || E.car().model, { x: t.x - Math.sin(a.h) * back, z: t.z - Math.cos(a.h) * back, h: a.h, speed: a.speed });
    },
    view(st, run, E) { const a = E.actor(st.target); return a ? { markers: [{ id: 'target', x: a.x, z: a.z, kind: 'target', label: a.def.label }] } : {}; },
  },

  deliver: {
    enter(st, run, E) { run.st.health0 = E.carHealth(); },
    update(st, run, E) {
      const isCar = !st.what || st.what === 'vehicle' || E.models()[st.what];
      if (st.maxDamage != null && isCar && E.inCar() && 100 - E.carHealth() > st.maxDamage) { E.fail('Too much damage.', 'damage'); return false; }
      if (!near(E, st.to, st.r || 6)) return false;
      if (isCar) return E.inCar() && (!E.models()[st.what] || E.car().model === st.what) && Math.abs(E.car().vf) < 6;
      return !!run.flags['has:' + st.what];
    },
    skip(st, run, E) { if (st.what && !E.models()[st.what] && st.what !== 'vehicle') run.flags['has:' + st.what] = true; E.put(st.to.x, st.to.z, st.to.h, E.inCar()); },
    view(st, run, E) {
      const v = { markers: [goal(st.to, st.r || 6)], route: st.to };
      if (st.maxDamage != null) v.bar = { label: 'Damage', value: Math.round(100 - E.carHealth()), of: st.maxDamage, bad: true };
      return v;
    },
  },

  collect: {
    enter(st, run) { run.st.left = (st.points || (st.at ? [st.at] : [])).map((p, i) => ({ ...p, i })); run.st.got = 0; },
    update(st, run, E) {
      const reach = E.inCar() ? 4 : 2.5, want = st.count || run.st.left.length + run.st.got;
      for (let i = run.st.left.length - 1; i >= 0; i--) {
        const p = run.st.left[i];
        if (Math.hypot(E.px() - p.x, E.pz() - p.z) > reach) continue;
        run.st.left.splice(i, 1); run.st.got++; run.flags['has:' + st.item] = true;
        E.emit('mission:pickup', { id: run.def.id, item: st.item, n: run.st.got, of: want, x: p.x, z: p.z });
      }
      return run.st.got >= want;
    },
    skip(st, run) { run.st.got = 1e9; run.flags['has:' + st.item] = true; },
    view(st, run) {
      const want = st.count || run.st.left.length + run.st.got, v = { markers: run.st.left.map((p) => ({ id: 'pick' + p.i, x: p.x, z: p.z, r: 1.5, kind: 'pickup' })) };
      if (want > 1) v.bar = { label: st.label || 'Collected', value: Math.min(want, run.st.got), of: want };
      return v;
    },
  },

  // The phone camera's photo:taken lists what was in frame. `subject` is the name wanted (none: any photo),
  // `at` is where the subject is (the camera asks the view for it), `from` is where to stand, if it matters.
  photo: {
    update(st, run) { return !!run.st.shot; },
    on: { 'photo:taken'(st, run, e, E) {
      if (st.from && !near(E, st.from, st.r || 15)) return;
      if (!st.subject || ((e && e.targets) || []).includes(st.subject)) run.st.shot = true;
    } },
    view(st) {
      const at = st.from || st.at, v = at ? { markers: [goal(at, st.from ? st.r || 15 : 3)] } : {};
      if (st.subject && st.at) v.photo = { id: st.subject, x: st.at.x, z: st.at.z, y: st.at.y ?? 1.5 };
      return v;
    },
  },

  heat: {
    enter(st, run) { run.st.held = 0; },
    update(st, run, E) {
      const level = E.heat(), want = st.want || 'reach';
      if (st.honk) honk(st, run, E, level);
      if (want === 'reach') return level >= (st.level || 1);
      if (want === 'clear') return level === 0 && run.stepT > 0.2;
      run.st.held = level >= (st.level || 1) ? run.st.held + E.dt : st.reset ? 0 : run.st.held;
      return run.st.held >= (st.seconds || 30);
    },
    skip(st, run, E) { E.setHeat(st.want === 'clear' ? 0 : st.level || 1); },
    view(st, run) { return st.want === 'hold' ? { timer: { left: Math.max(0, (st.seconds || 30) - run.st.held), total: st.seconds || 30, good: true } } : {}; },
  },

  // `atHeat: n`: the clock only runs while heat is n or more
  survive: {
    enter(st, run) { run.st.t = 0; },
    update(st, run, E) {
      if (st.until && st.until.rams) return run.counters.rams >= st.until.rams;
      if (!st.atHeat || E.heat() >= st.atHeat) run.st.t += E.dt;
      return run.st.t >= (st.seconds || 30);
    },
    skip(st, run) { if (st.until && st.until.rams) run.counters.rams = st.until.rams; run.st.t = 1e9; },
    view(st, run, E) {
      if (st.until && st.until.rams) {
        const a = E.actor(st.until.on), v = { bar: { label: st.bar || 'Rams', value: Math.min(run.counters.rams, st.until.rams), of: st.until.rams } };
        if (a) v.markers = [{ id: 'target', x: a.x, z: a.z, kind: 'target', label: a.def.label }];
        return v;
      }
      return { timer: { left: Math.max(0, (st.seconds || 30) - (run.st.t || 0)), total: st.seconds || 30, good: true, held: !!st.atHeat && E.heat() < st.atHeat } };
    },
  },

  timer: {
    update(st, run, E) {
      if (run.stepT < (st.seconds || 30)) return false;
      if ((st.onEnd || 'next') === 'fail') { E.fail(st.lost || 'Out of time.', 'timer'); return false; }
      return true;
    },
    view: (st, run) => ({ timer: { left: Math.max(0, (st.seconds || 30) - run.stepT), total: st.seconds || 30, good: (st.onEnd || 'next') !== 'fail' } }),
  },

  defeat: {
    enter(st, run, E) {
      run.st.down = 0; run.st.want = Array.isArray(st.enemies) ? st.enemies.length : st.enemies || 1;
      if (Array.isArray(st.enemies)) for (const e of st.enemies) E.enemy(e);
    },
    update(st, run) { return run.st.down >= run.st.want; },
    on: { 'combat:down'(st, run, e) { if (e && e.who !== 'player' && e.by && e.by.player) run.st.down++; } },
    skip(st, run) { run.st.down = 1e9; },
    view: (st, run) => ({ bar: { label: st.label || 'Knocked out', value: Math.min(run.st.want, run.st.down), of: run.st.want } }),
  },

  // STUB until the leads can be switched (D7-S1): the step records who should be active and moves on
  switch: {
    enter(st, run, E) { run.flags.lead = st.to; E.emit('mission:switch', { id: run.def.id, to: st.to }); },
    update: () => true,
  },

  choice: {
    update(st, run) { return run.flags[st.flag] != null; },
    choose(st, run, id) { if (st.options.some((o) => o.id === id)) run.flags[st.flag] = id; },
    skip(st, run) { if (run.flags[st.flag] == null) run.flags[st.flag] = st.options[0].id; },
    view: (st) => ({ choice: st.options }),
  },
};
