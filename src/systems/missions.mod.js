// The mission engine (plan/05-content.md "Missions"). Missions are data: one file each in
// src/content/missions/, found by a glob. This module runs their steps (missions-steps.js), keeps
// checkpoints, watches the fail list, pays out, and offers the next mission.
// Public object: list · get(id) · start(id, opts) · skipStep() · fail(text, when) · retry() · replay() · quit() ·
//   dismiss() · choose(id) · skip() (a cutscene) · active · view · state() · actors · best
// Owns state.mission { id, step, flags, done, available }. Save section `missions`.
// Emits mission:offered, mission:started, mission:step, mission:failed, mission:completed, and
// mission:ram, mission:pickup, mission:switch, mission:retried, mission:ended.
import { createActors } from './missions-actors.js';
import { STEPS } from './missions-steps.js';

const files = import.meta.glob('../content/missions/*.js', { eager: true });
const clipFiles = import.meta.glob('../content/clips/day-*.js', { eager: true });
const NUM = { startR: 4, ramGap: 0.7, ramKmh: 15, wrap: 7 };
const clone = (o) => JSON.parse(JSON.stringify(o || {}));

let api = null;
export default {
  name: 'missions', order: 44, renderOrder: 44, needs: ['player', 'vehicles', 'traffic', 'map'],
  init(ctx) {
    const m = ctx.modules, S = ctx.state, ev = ctx.events, pl = m.player, car = () => m.vehicles.player;
    const byId = {}, list = [];
    for (const path in files) { const d = files[path].default; if (d && d.id && (d.tier || 'A') <= (ctx.quality.get('contentTier') || 'A')) { byId[d.id] = d; list.push(d); } }
    list.sort((a, b) => a.n - b.n);
    const actors = createActors(ctx);
    const M = S.mission; Object.assign(M, { id: null, step: 0, flags: {}, done: M.done || [], available: M.available || [] });
    const best = {};
    let run = null, armed = true, ramT = 0, lastDt = 1 / 60, clipWas = false, lastClip = null;
    const view = { active: false };

    // ---- what a step may use ----
    const inCar = () => pl.mode === 'car';
    function seat(model, at, paint, accent) {
      const c = car();
      if (c.model !== model || paint != null) c.swap(model, paint ?? c.paint, accent ?? c.accent);
      c.reset({ x: at.x, z: at.z, h: at.h ?? c.h, vf: at.speed || 0 });
      S.player.vehicle = c.model;
      if (pl.mode === 'foot') pl.seated(true);
      if (m.damage) m.damage.repair(c);
      if (m.camera) m.camera.snap();
      pl.get();
    }
    function onFoot(at) { if (pl.mode === 'car') pl.exit(); pl.teleport(at.x, at.z, at.h ?? 0); pl.get(); }
    const E = {
      get dt() { return lastDt; },
      px: () => S.player.x, pz: () => S.player.z, inCar, car, seat,
      carHealth: () => (m.damage ? m.damage.health(car()) : 100),
      models: () => m.vehicles.models,
      heat: () => S.heat.level, setHeat: (n) => { if (m.heat) { if (n) m.heat.set(n); else m.heat.clear('mission'); } },
      actor: (name) => actors.get(name), tail: (a) => actors.tail(a),
      onStreet: (v) => m.traffic.wrecks.includes(v) || m.traffic.loose.includes(v),
      standCar(model, at, paint, accent) { const v = m.vehicles.spawn(model, at.x, at.z, at.h || 0); if (paint != null) { v.paint = paint; v.accent = accent ?? v.accent; } return v; },
      takeCar: (v) => m.vehicles.despawn(v),
      put(x, z, h, asCar) { if (asCar && !inCar()) seat(run.ride || car().model, { x, z, h }); else pl.teleport(x, z, h); pl.get(); },
      say: (key, block) => say(key, block), hush: () => { if (m.dialogue) m.dialogue.stop(); },
      hint: (text) => ev.emit('ui:hint', { id: 'mission:cond', text, seconds: 5 }),
      fail: (text, when) => fail(text, when),
      enemy: (e) => (m.combat && m.combat.spawn ? m.combat.spawn(e.x, e.z, e.h || 0, { kind: e.kind || 'guard', hostile: true }) : null),
      emit: (n, p) => ev.emit(n, p),
    };
    function say(key, block) {
      const lines = run && run.def.lines && run.def.lines[key];
      if (!lines || !m.dialogue || run.mode === 'cup') return null;
      return m.dialogue.play(lines, { block });
    }

    // ---- checkpoints ----
    function snapshot(i) {
      const c = car(), p = S.player;
      return { i, t: run.t, ride: run.ride, counters: clone(run.counters), flags: clone(run.flags),
        player: inCar() ? { car: true, x: c.x, z: c.z, h: c.h, model: c.model, paint: c.paint, accent: c.accent } : { car: false, x: p.x, z: p.z, h: p.h },
        actors: actors.snapshot() };
    }
    function restore(cp) {
      if (m.health && m.health.down) m.health.wake();
      if (m.health) m.health.heal(100);
      if (m.heat) m.heat.clear('mission');
      actors.restore(cp.actors, run.def.actors || {});
      if (cp.player.car) seat(cp.player.model, cp.player, cp.player.paint, cp.player.accent); else onFoot(cp.player);
      run.ride = cp.ride; run.counters = clone(cp.counters); run.flags = clone(cp.flags); M.flags = run.flags;
    }

    // ---- steps ----
    const stepKind = () => STEPS[run.step.type] || STEPS.switch;
    function enterStep(i, skipped) {
      const def = run.def;
      while (i < def.steps.length && def.steps[i].if && run.flags[def.steps[i].if.flag] !== def.steps[i].if.is) i++;      // a step a choice ruled out
      if (i >= def.steps.length) return wrap(skipped);
      const st = def.steps[i];
      Object.assign(run, { i, step: st, stepT: 0, st: {}, cues: new Set(), timer: st.timer ? { left: st.timer, total: st.timer } : null });
      M.step = i;
      if (st.stage && st.stage.foot && run.mode !== 'cup') onFoot(st.stage.foot);
      if (st.hour != null && m.clock) m.clock.set(st.hour);
      if (st.heat && st.heat.set != null) E.setHeat(st.heat.set);
      if (st.set) for (const name in st.set) actors.command(name, def.actors[name], st.set[name]);
      if (st.say) say(st.say, false);
      if (st.hint && run.mode !== 'cup') ev.emit('ui:hint', { id: `mission:${def.id}:${i}`, text: st.hint, seconds: 8 });
      const k = stepKind();
      if (k.enter) k.enter(st, run, E);
      refresh();
      ev.emit('mission:step', { id: def.id, step: i, n: i + 1, type: st.type, text: st.text || '', skipped: !!skipped, checkpoint: run.cp.i });
    }
    function completeStep(skipped) {
      const st = run.step, k = stepKind(), def = run.def;
      if (k.exit) k.exit(st, run, E, skipped);
      if (st.then) {
        if (st.then.release) actors.release(st.then.release, def.actors);
        if (st.then.leave) actors.command(st.then.leave, def.actors[st.then.leave], { leave: true });
        if (st.then.remove) actors.remove(st.then.remove);
        if (st.then.flag) run.flags[st.then.flag] = true;
      }
      if (st.done && !skipped) say(st.done, false);
      ev.emit('ui:hint:done', { id: `mission:${def.id}:${run.i}` });
      if (st.checkpoint) run.cp = snapshot(run.i + 1);
      enterStep(run.i + 1, skipped);
    }
    function wrap(skipped) {
      run.status = 'wrap'; run.wrapT = NUM.wrap; run.step = null; refresh();
      if (skipped || !m.dialogue || !m.dialogue.busy) complete();
    }
    function complete() {
      const def = run.def, pays = def.pays || {}, cash = pays.cash || 0, eco = S.economy;
      eco.followers = (eco.followers || 0) + (pays.followers || 0);
      if (cash) { eco.cash = (eco.cash || 0) + cash; ev.emit('cash:changed', { cash: eco.cash, by: cash, why: 'mission' }); }
      const first = !M.done.includes(def.id);
      if (first) M.done.push(def.id);
      M.available = M.available.filter((id) => id !== def.id);
      const was = best[def.id], record = was == null || run.t < was;
      if (record) best[def.id] = run.t;
      const result = { id: def.id, title: def.title, n: def.n, cash, followers: Math.max(0, Math.round(eco.followers - run.followers0)), seconds: run.t, best: best[def.id], record, was: was ?? null,
        mode: run.mode, retries: run.retries, caption: (def.card && def.card.caption) || '', stamp: (def.card && def.card.stamp) || 'Delivered', first };
      run.status = 'card'; run.result = result; M.id = null; M.flags = {};
      refresh();
      ev.emit('mission:completed', result);
      if (first) for (const id of def.unlocks || []) if (byId[id]) offer(id);
      if (ctx.save && ctx.save.auto) ctx.save.auto();
    }
    function fail(text, when) {
      if (!run || run.status !== 'running') return false;
      run.status = 'failed'; run.failText = text || 'It went wrong.';
      if (m.dialogue) m.dialogue.stop();
      refresh();
      ev.emit('mission:failed', { id: run.def.id, title: run.def.title, step: run.i, when: when || 'failed', text: run.failText, checkpoint: run.cp.i, seconds: run.t });
      return true;
    }
    function retry() {
      if (!run || (run.status !== 'failed' && run.status !== 'running')) return false;
      const cp = run.cp;
      restore(cp);
      run.status = 'running'; run.failText = null; run.retries++; run.t = cp.t; M.id = run.def.id;
      ev.emit('mission:retried', { id: run.def.id, step: cp.i });
      enterStep(cp.i, false);
      return true;
    }
    function end(why) {
      if (!run) return;
      const id = run.def.id;
      if (m.dialogue) m.dialogue.stop();
      actors.clear(run.status === 'card');
      if (m.gps && view.route) m.gps.clear();
      run = null; M.id = null; M.flags = {}; M.step = 0; armed = false;
      refresh();
      ev.emit('mission:ended', { id, why });
    }

    function start(id, opts = {}) {
      const def = byId[id];
      if (!def) return false;
      if (run) end('restart');
      run = { def, mode: opts.mode || 'story', status: 'running', i: 0, step: null, stepT: 0, t: 0, st: {}, cues: new Set(), counters: { rams: 0, ...(opts.counters || {}) }, flags: clone(def.flags),
        ride: null, retries: 0, timer: null, followers0: S.economy.followers || 0, result: null, failText: null, cp: null };
      M.id = id; M.flags = run.flags; M.step = 0;
      if (def.hour != null && m.clock && opts.hour !== false) m.clock.set(opts.hour ?? def.hour);
      for (const name in def.actors || {}) if (def.actors[name].carry || def.actors[name].spawn === true) actors.spawn(name, def.actors[name], opts.actors && opts.actors[name]);
      if (opts.player) seat(opts.player.model, opts.player, opts.player.paint, opts.player.accent);
      else if (opts.stage !== false && def.start) onFoot({ x: def.start.x, z: def.start.z, h: 0 });
      if (opts.player) run.ride = opts.player.model;
      const from = opts.from || 0;
      run.cp = snapshot(from);
      ev.emit('mission:started', { id, title: def.title, n: def.n, mode: run.mode, step: from, steps: def.steps.length });
      enterStep(from, false);
      if (opts.actors) for (const name in opts.actors) { const o = opts.actors[name]; if (o.go) actors.command(name, def.actors[name], { go: true }); const a = actors.get(name); if (a && o.speed != null) a.speed = o.speed; }
      run.cut = opts.cut || null;          // a clip's edit: { step, seconds } cuts to the result card that long after that step
      return true;
    }
    function offer(id) {
      const def = byId[id];
      if (!def || M.available.includes(id) || M.done.includes(id)) return false;
      M.available.push(id);
      ev.emit('mission:offered', { id, title: def.title, n: def.n, x: def.start.x, z: def.start.z, text: def.offer || '' });
      return true;
    }

    // ---- rams, fail list, cues ----
    function ramTarget() { const st = run.step; return st && ((st.until && st.until.rams && st.until.on) || (st.type === 'chase' && st.stopBy === 'ram' && st.target)) || null; }
    ev.on('vehicle:crash', (e) => {
      if (!run || run.status !== 'running' || !e || e.what !== 'vehicle' || ramT > 0) return;
      const name = ramTarget(), a = name && actors.get(name);
      if (!a || !inCar()) return;
      const c = car(), sn = Math.sin(a.h), cs = Math.cos(a.h), behind = (a.x - c.x) * sn + (a.z - c.z) * cs;
      const minKmh = (run.step.until && run.step.until.minKmh) || NUM.ramKmh;
      if (Math.hypot(e.x - a.x, e.z - a.z) > a.v.hl + 2.5 || behind < 0.5 || e.speed * 3.6 < minKmh) return;
      ramT = NUM.ramGap; run.counters.rams++;
      actors.jolt(name);
      ev.emit('mission:ram', { id: run.def.id, n: run.counters.rams, kmh: e.speed * 3.6, x: e.x, z: e.z });
      cue('ram', run.counters.rams);
    });
    function cue(when, n) {
      for (const q of run.step.cues || []) if (q.when === when && (q.n == null || q.n === n) && !run.cues.has(q)) { run.cues.add(q); say(q.lines, false); }
    }
    const failList = () => [...(run.def.fail || []), ...((run.step && run.step.fail) || [])];
    ev.on('vehicle:destroyed', (e) => { if (run && e && e.player !== false && failList().some((f) => f.when === 'vehicle:destroyed')) fail(failList().find((f) => f.when === 'vehicle:destroyed').text, 'vehicle:destroyed'); });
    ev.on('player:knockedout', () => { if (run) fail((failList().find((f) => f.when === 'knockedout') || {}).text || 'Knocked out.', 'knockedout'); });
    ev.on('combat:down', (e) => { if (run && run.status === 'running' && stepKind().on && stepKind().on['combat:down']) stepKind().on['combat:down'](run.step, run, e); });
    ev.on('stealth:seen', () => { if (run) { run.counters.seen = (run.counters.seen || 0) + 1; const f = failList().find((q) => q.when === 'stealth:seen'); if (f && run.counters.seen >= (f.count || 1)) fail(f.text || 'They saw you.', 'stealth:seen'); } });
    ev.on('game:reset', () => { if (run && !document.body.classList.contains('clip')) end('reset'); });
    function watch() {
      const st = run.step, c = car();
      for (const f of failList()) {
        if (f.when === 'vehicle:destroyed') { if (inCar() && c.dead) return fail(f.text, f.when); continue; }
        const a = f.target && actors.get(f.target);
        if (f.when === 'ahead' && a && Math.hypot(a.x - S.player.x, a.z - S.player.z) > f.metres) return fail(f.text, 'target:lost');
        if (f.when === 'reaches' && a && Math.hypot(a.x - f.at.x, a.z - f.at.z) < (f.r || 10)) return fail(f.text, 'target:reached');
      }
      if (run.timer) { run.timer.left -= lastDt; if (run.timer.left <= 0) return fail((failList().find((f) => f.when === 'timer') || {}).text || 'Out of time.', 'timer'); }
      for (const q of st.cues || []) {
        if (run.cues.has(q)) continue;
        const a = q.actor && actors.get(q.actor);
        if ((q.when === 'passes' && a && Math.hypot(a.x - q.at.x, a.z - q.at.z) < (q.r || 15)) || (q.when === 'time' && run.stepT >= q.t)) { run.cues.add(q); say(q.lines, false); }
      }
      return false;
    }

    // ---- what the screen shows ----
    function refresh() {
      for (const k in view) delete view[k];
      view.active = !!run;
      view.offers = run ? [] : M.available.map((id) => ({ id, title: byId[id].title, x: byId[id].start.x, z: byId[id].start.z })).filter((o) => byId[o.id]);
      if (!run) return;
      Object.assign(view, { id: run.def.id, title: run.def.title, mode: run.mode, status: run.status, seconds: run.t, step: run.i, steps: run.def.steps.length });
      if (run.status === 'failed') view.failed = { text: run.failText, title: run.def.title, checkpoint: run.cp.i, seconds: run.t };
      if (run.status === 'card') view.card = run.result;
      if (run.status !== 'running' || !run.step) return;
      const extra = stepKind().view ? stepKind().view(run.step, run, E) : {};
      Object.assign(view, { objective: run.step.text || '', markers: [], ...extra });
      if (run.timer) view.timer = { left: Math.max(0, run.timer.left), total: run.timer.total };
      if (run.mode === 'cup') view.clock = run.t;
    }

    // a clip that carries `mission: { id, from, player, actors, counters }` is staged when it starts
    function clipStage() {
      const id = lastClip || ctx.params.get('clip');
      let clip = null;
      for (const path in clipFiles) if (clipFiles[path].default.id === id) clip = clipFiles[path].default;
      if (clip && clip.mission && byId[clip.mission.id]) start(clip.mission.id, { ...clip.mission, hour: clip.hour, mode: 'clip' });
    }

    api = {
      list, actors, best, numbers: NUM, view,
      get: (id) => byId[id] || null,
      get active() { return run ? run.def.id : null; },
      get run() { return run; },
      start, offer, fail, retry, quit: () => end('quit'),
      skipStep() { if (!run || run.status !== 'running') return false; const k = stepKind(); if (k.skip) k.skip(run.step, run, E); if (m.dialogue) m.dialogue.stop(); completeStep(true); return true; },
      skip() { if (run && run.status === 'running' && run.step.type === 'cutscene') { run.st.skip = true; if (m.dialogue) m.dialogue.stop(); return true; } return false; },
      choose(id) { if (run && run.status === 'running' && stepKind().choose) stepKind().choose(run.step, run, id); },
      dismiss() { if (run && (run.status === 'card' || run.status === 'failed')) end(run.status === 'card' ? 'done' : 'gave up'); },
      replay() { if (!run) return false; const id = run.def.id, mode = run.mode; end('replay'); return start(id, { mode: mode === 'clip' ? 'story' : mode, from: mode === 'cup' ? 1 : 0 }); },
      state() {
        return { id: run ? run.def.id : null, active: !!run, status: run ? run.status : 'idle', step: run ? run.i : 0, type: run && run.step ? run.step.type : null, steps: run ? run.def.steps.length : 0,
          objective: view.objective || '', seconds: run ? run.t : 0, stepSeconds: run ? run.stepT : 0, mode: run ? run.mode : null, checkpoint: run && run.cp ? run.cp.i : 0, retries: run ? run.retries : 0,
          counters: run ? { ...run.counters } : {}, flags: run ? { ...run.flags } : {}, ride: run ? run.ride : null, timer: view.timer || null, bar: view.bar || null,
          markers: (view.markers || []).map((q) => ({ ...q })), failed: run && run.failText, result: run ? run.result : null,
          done: [...M.done], available: [...M.available], actors: actors.info(), missions: list.map((d) => d.id), best: { ...best } };
      },
      update(dt) {
        lastDt = dt; ramT -= dt;
        const clip = document.body.classList.contains('clip');
        if (clip && !clipWas) clipStage();
        clipWas = clip;
        actors.update(dt);
        if (!run) {
          // walking or driving into a start marker begins that mission; leave the marker before it can start again
          let inside = false;
          for (const id of M.available) { const d = byId[id]; if (d && Math.hypot(S.player.x - d.start.x, S.player.z - d.start.z) < NUM.startR) { inside = true; if (armed && !clip && !S.ui.paused) { start(id); break; } } }
          if (!inside) armed = true;
          return;
        }
        if (run.status === 'wrap') { run.wrapT -= dt; if (run.wrapT <= 0 || !m.dialogue || !m.dialogue.busy) complete(); return; }
        if (run.status !== 'running') return;
        run.t += dt; run.stepT += dt;
        if (watch()) return;
        if (run.cut && run.i > run.cut.step && run.stepT >= run.cut.seconds) { if (m.dialogue) m.dialogue.stop(); return wrap(true); }
        if (stepKind().update(run.step, run, E)) completeStep(false);
        if (run) refresh();
      },
    };

    if (ctx.save && ctx.save.section) ctx.save.section('missions', { version: 1, get: () => ({ done: [...M.done], best: { ...best } }),
      set: (d) => { M.done = [...((d && d.done) || [])]; Object.assign(best, (d && d.best) || {}); M.available = M.available.filter((id) => !M.done.includes(id)); refresh(); } });
    // what is on offer at the start: the first mission of the story that is not done
    ev.once('game:ready', () => {
      // which clip is playing: the clips module does not say, so its play() is watched from here
      const cl = m.clips;
      if (cl && cl.play) { const play = cl.play; cl.play = (id) => { lastClip = id; return play(id); }; if (ctx.test.clip) ctx.test.clip.play = cl.play; }
      const first = list.find((d) => !M.done.includes(d.id) && (d.n === 1 || M.done.length)); if (first) offer(first.id); refresh(); const id = ctx.params.get('mission'); if (id && byId[id]) start(id);
    });

    ctx.test.mission = { start: (id, opts) => start(id, opts), skipStep: () => { api.skipStep(); return api.state(); }, state: () => api.state(), fail: (text) => fail(text || 'A check failed it.', 'test'), retry: () => retry(),
      dismiss: () => api.dismiss(), replay: () => api.replay(), quit: () => api.quit(), choose: (id) => api.choose(id), offer: (id) => offer(id) };
    refresh();
    return api;
  },
  update(dt) { api.update(dt); },
  render(alpha, ctx) { api.actors.draw(ctx.loop.time); },
};
