// Heat: the Sheriff's attention. Crimes add points (100 is one level); from heat 3 the chase is a
// live show and the number that matters is viewers. They rise while a deputy can see you and
// leave when nobody can; at zero the heat clears. plan/04 section 7, plan/bible/systems/heat.md.
// Public object: { level, set(n), clear(), addPoints(n), crime(case, x, z, opts), witnessed(x, z), book(), hidden(), numbers }.
// Owns state.heat = { level, viewers, peak, seen, points, levelT, unseenT, last: { x, z } }.
// Emits crime, heat:changed, heat:live, heat:cleared, heat:seen, heat:dropped, player:booked.
import { createHeatSound } from './heat-sound.js';

const clipFiles = import.meta.glob('../content/clips/day-*.js', { eager: true });

export const ENTRY = [0, 200, 600, 1000, 20000, 200000];       // the meter on reaching a level
export const CAP = [0, 600, 1000, 20000, 200000, 1000000];     // the top of the level's range
// case: [kind, points, counts ('seen', 'always' or 'auto')]
export const CASES = {
  hitprop: ['property', 10, 'seen'], hitcar: ['collision', 15, 'seen'], punch: ['hit-and-run', 20, 'seen'],
  hitped: ['hit-and-run', 25, 'seen'], carparked: ['theft', 30, 'seen'], cartheft: ['carjack', 100, 'seen'],
  hurt: ['hit-and-run', 100, 'seen'], flare: ['shots', 100, 'seen'], hitcop: ['cop-ram', 100, 'always'],
  punchcop: ['cop-ram', 100, 'always'], threat: ['shots', 100, 'always'], gunfire: ['shots', 100, 'always'],
  kill: ['killing', 200, 'seen'], killcop: ['deputy-down', 300, 'always'], evade: ['evade', 100, 'auto'], survive: ['outlast', 100, 'auto'],
};
export const NUM = { drain: 0.08, grace: 1.5, climb: 90, fade: 5, quiet: 10, evade: 20, dropGap: 20, sightDay: 60, sightNight: 45,
  bookShare: 0.1, bookMax: 5000, bookHours: 2, hq: { x: 200, z: -2150 },
  stunt: { drift: 0.01, jump: 0.002, crash: 0.03, pass: 0.01 } };

export default {
  name: 'heat', order: 24, needs: ['vehicles', 'map'],
  init(ctx) {
    const S = ctx.state, ev = ctx.events, m = ctx.modules;
    const h = S.heat = { level: 0, viewers: 0, peak: 0, seen: false, points: 0, levelT: 0, unseenT: 0, last: { x: 0, z: 0 } };
    const sound = createHeatSound(ctx);
    let quietT = 0, evadeT = 0, streamT = 0, liveT = 0, sightT = 0, dropT = 99, crashT = 0, jackT = -9, stillT = 0, time = 0, clipId = ctx.params.get('clip'), clipWas = false;
    let hold = false;                               // a clip or a check holds the level: no drain, no climb
    const known = new Set(), seenCars = new Set();  // cars that are his already; cars a unit has seen this chase
    const flags = () => (S.mission.flags && S.mission.flags.heat) || {};
    const carKey = () => { const c = m.vehicles.player; return c ? c.model + ':' + c.paint : ''; };
    const inCar = () => S.player.mode !== 'foot';
    const night = () => { const hr = S.clock.hour; return hr >= 20 || hr < 6 || (S.weather.kind !== 'clear' && S.weather.kind !== undefined); };
    const sight = () => (night() ? NUM.sightNight : NUM.sightDay);

    function setSeen(on) { if (on === h.seen) return; h.seen = on; ev.emit('heat:seen', { seen: on }); }
    function setLevel(L, why) {
      const f = flags(), from = h.level;
      L = Math.max(f.min || 0, Math.min(f.max === undefined ? 5 : f.max, Math.max(0, Math.min(5, L | 0))));
      if (L === from) return;
      if (L === 0) return clear(why || 'set');
      h.level = L;
      if (L > from) {
        h.levelT = 0; h.viewers = Math.max(h.viewers, ENTRY[L]); h.peak = Math.max(h.peak, h.viewers);
        if (from === 0) { streamT = 0; seenCars.clear(); h.last.x = S.player.x; h.last.z = S.player.z; }
      }
      if (h.points < L * 100 || h.points >= (L + 1) * 100) h.points = L * 100;
      evadeT = 0; h.unseenT = 0;
      ev.emit('heat:changed', { level: L, from });
    }
    function clear(why) {
      const from = h.level, peak = h.peak;
      if (from === 0 && h.points === 0) return;
      Object.assign(h, { level: 0, viewers: 0, peak: 0, points: 0, levelT: 0, unseenT: 0 });
      hold = false; evadeT = 0; setSeen(false);
      if (from > 0) {
        S.stats.peakViewers = Math.max(S.stats.peakViewers || 0, Math.round(from >= 3 ? peak : 0));
        ev.emit('heat:changed', { level: 0, from });
        ev.emit('heat:cleared', { peak: Math.round(peak), seconds: streamT, from, why: why || 'unseen' });
      }
    }
    function addPoints(n) {
      if (flags().muted || n <= 0) return;
      n = Math.min(300, n);
      // the small crimes cannot lift heat past 2 by themselves
      h.points = n <= 25 ? Math.max(h.points, Math.min(299, h.points + n)) : Math.min(599, h.points + n);
      quietT = 0;
      const L = Math.min(5, Math.floor(h.points / 100));
      if (L > h.level) setLevel(L);
    }
    // one level down, keeping the share of the audience (a change of car or outfit nobody saw)
    function drop(reason) {
      if (h.level < 1 || dropT < NUM.dropGap) return false;
      dropT = 0;
      if (h.level === 1) { clear(reason); ev.emit('heat:dropped', { reason, level: 0 }); return true; }
      const f = h.peak > 0 ? h.viewers / h.peak : 0, from = h.level;
      h.level -= 1; h.peak = Math.min(h.peak, CAP[h.level]); h.viewers = f * h.peak; h.points = h.level * 100; h.levelT = 0;
      ev.emit('heat:changed', { level: h.level, from });
      ev.emit('heat:dropped', { reason, level: h.level });
      return true;
    }
    // Could a deputy see this spot? The cops module answers; before it exists nobody can.
    const witnessed = (x, z) => !!(m.cops && m.cops.sees && m.cops.sees(x, z, sight()));
    // A crime: decide whether it counts, tell everyone, add the points.
    function crime(id, x, z, opts = {}) {
      const row = CASES[id]; if (!row) return null;
      const seen = opts.seen !== undefined ? !!opts.seen : witnessed(x, z);
      let points = opts.points !== undefined ? opts.points : row[1];
      if (id === 'gunfire' && seen && h.level >= 1) points = 200;
      if (row[2] === 'seen' && !seen) points = 0;
      if (flags().muted) points = 0;
      const before = h.level;
      if (points > 0 && (seen || row[2] === 'always')) { h.last.x = x; h.last.z = z; }
      ev.emit('crime', { kind: row[0], case: id, seen, points, x, z, weapon: opts.weapon || null, level: before });
      addPoints(points);
      return { points, seen };
    }

    // ---- what the game tells us ----
    ev.on('vehicle:crash', (e) => {
      if (!e || time - crashT < 0.5) return;
      const kmh = (e.speed || 0) * 3.6;
      if (e.what === 'vehicle') {
        const unit = m.cops && m.cops.unitAt ? m.cops.unitAt(e.x, e.z, 4.5) : null;
        if (unit) { if (!unit.ramming || Math.abs(m.vehicles.player.vf) > unit.speed + 2) { crashT = time; crime('hitcop', e.x, e.z); } }
        else if (kmh >= 15) { crashT = time; crime('hitcar', e.x, e.z); }
      }
      if (h.level >= 3 && h.seen && e.speed >= 8) stunt(NUM.stunt.crash);
    });
    ev.on('ped:hit', (e) => { if (e && e.by !== 'traffic') crime(e.kmh > 50 ? 'kill' : 'hitped', e.x, e.z); });
    ev.on('prop:broken', (e) => { if (e && e.kind !== 'cone') crime('hitprop', e.x, e.z); });
    ev.on('weapon:fired', (e) => {
      const x = e && e.x !== undefined ? e.x : S.player.x, z = e && e.z !== undefined ? e.z : S.player.z, w = e && e.weapon;
      if (e && e.by && e.by !== 'player') return;
      if (w === 'fists' || w === 'bat' || w === 'melee' || e.melee) return;
      crime(w === 'flare' ? 'flare' : 'gunfire', x, z, { weapon: w });
    });
    // a driven car taken: the vehicles lane emits its own `crime` (no points); it is worth 100 if seen
    ev.on('crime', (e) => {
      if (!e || e.points !== undefined) return;
      if (e.case === 'carjack' || e.kind === 'cartheft') {
        jackT = time; known.add(carKey());
        const seen = e.seen || witnessed(e.x, e.z);
        if (seen) { h.last.x = e.x; h.last.z = e.z; addPoints(100); sound.call('carjack', Math.max(1, h.level), true); }
      }
    });
    ev.on('vehicle:entered', (e) => {
      if (!e) return;
      const key = carKey();
      if (e.reset || !known.size) { known.add(key); return; }
      const fresh = !known.has(key);
      // a car nobody has seen this chase, taken while nobody is looking: one level down at once
      if (h.level > 0 && !h.seen && !seenCars.has(key) && h.unseenT > 0.5) drop('car');
      if (fresh && time - jackT > 2 && e.x !== undefined) crime('carparked', e.x, e.z);
      known.add(key);
    });
    ev.on('player:spawned', () => known.add(carKey()));
    ev.on('jump:landed', (e) => { if (h.level >= 3 && h.seen && e) stunt(NUM.stunt.jump * (e.metres || e.distance || 5)); });
    ev.on('game:reset', () => { clear('reset'); h.points = 0; known.add(carKey()); });
    function stunt(share) {
      const L = h.level; if (L < 3) return;
      h.viewers = Math.min(CAP[L], h.viewers + CAP[L] * share); h.peak = Math.max(h.peak, h.viewers);
    }

    // in a car wash the drain is doubled (parked with the engine off, a bridge and a garage wait for an engine switch and decks)
    function hidden() {
      const p = S.player;
      if (!washes) washes = m.map.places ? m.map.places('carwash') : [];
      for (const w of washes) if (Math.abs(w.x - p.x) < 12 && Math.abs(w.z - p.z) < 12) return true;
      return false;
    }
    let washes = null;

    // Booked: 10% of cash up to $5,000, two hours on, on foot outside the Sheriff's HQ (a stand-in: the nearest road to its place)
    function book() {
      if (h.level < 1 || h.level > 2) return null;
      const eco = S.economy, cost = Math.min(NUM.bookMax, Math.round(eco.cash * NUM.bookShare)), level = h.level;
      eco.cash -= cost;
      if (cost) ev.emit('cash:changed', { cash: eco.cash, by: -cost, why: 'booked' });
      clear('booked');
      // the HQ's place, pulled inside today's map (Northgate is not built yet), then the kerb of the nearest road
      const B = m.map.bounds, hx = B ? Math.max(B.x0 + 80, Math.min(B.x1 - 80, NUM.hq.x)) : NUM.hq.x, hz = B ? Math.max(B.z0 + 80, Math.min(B.z1 - 80, NUM.hq.z)) : NUM.hq.z;
      const road = m.map.nearestRoad ? m.map.nearestRoad(hx, hz) : null;
      const at = road && road.d < 200 ? { x: road.x + Math.cos(road.heading) * (road.width / 2 + 1.5), z: road.z - Math.sin(road.heading) * (road.width / 2 + 1.5) } : { x: hx, z: hz };
      if (m.player) { if (m.player.mode === 'car') m.player.exit(); m.player.teleport(at.x, at.z, 0); }
      if (m.chunks && m.chunks.ensure) m.chunks.ensure(at.x, at.z, 1);
      if (m.clock && m.clock.set) m.clock.set((S.clock.hour + NUM.bookHours) % 24);
      const out = { cost, level, x: at.x, z: at.z, standIn: true, cash: eco.cash };
      ev.emit('player:booked', out);
      return out;
    }

    // a clip that carries `heat: n` starts with that level held
    function clipStart() {
      let clip = null;
      for (const path in clipFiles) if (clipFiles[path].default.id === clipId) clip = clipFiles[path].default;
      if (!clip || !clip.heat) return;
      clear('clip'); setLevel(clip.heat); hold = true;
      h.viewers = clip.viewers || ENTRY[clip.heat] * 4; h.peak = h.viewers; setSeen(true);
      if (m.cops && m.cops.stage) m.cops.stage(clip.cops || 3);
    }
    ev.once('game:ready', () => { if (ctx.test.clip) { const play = ctx.test.clip.play; ctx.test.clip.play = (id) => { clipId = id; return play(id); }; } });

    const api = {
      get level() { return h.level; }, set: (n) => setLevel(n, 'set'), clear: () => clear('set'), addPoints, crime, witnessed, book, hidden, drop, stunt,
      sight, sound, numbers: NUM, ENTRY, CAP, CASES,
      get hold() { return hold; }, set hold(v) { hold = !!v; },
      tick,
    };
    ctx.test.setHeat = (n) => { setLevel(n, 'set'); return { ...h }; };
    ctx.test.heat = () => ({ ...h, last: { ...h.last }, hidden: h.level > 0 && hidden(), hold, evadeT, streamT, cops: m.cops && m.cops.units ? m.cops.units.length : 0 });
    ctx.test.crime = (id, x, z, opts) => crime(id, x === undefined ? S.player.x : x, z === undefined ? S.player.z : z, opts);
    ctx.test.heatSound = () => sound.stats();

    function tick(dt) {
      time += dt; dropT += dt;
      const p = S.player, L = h.level, f = flags(), speed = Math.abs(p.kmh || 0) / 3.6;
      stillT = speed < 0.5 ? stillT + dt : 0;
      const clip = !!(m.hud && m.hud.clip);
      if (clip && !clipWas) clipStart();
      if (!clip && clipWas && hold) clear('clip');
      clipWas = clip;
      if (L === 0) {
        // at heat 0 the points fade at 5 a second after 10 quiet seconds
        if (h.points > 0 && (quietT += dt) > NUM.quiet) h.points = Math.max(0, h.points - NUM.fade * dt);
        sound.update(dt, null);
        return;
      }
      streamT += dt;
      // sight, four times a second (eight on high)
      sightT -= dt;
      if (sightT <= 0) {
        sightT = ctx.quality.level === 'high' ? 0.125 : 0.25;
        const see = hold ? true : witnessed(p.x, p.z);
        setSeen(see);
        if (see) { h.last.x = p.x; h.last.z = p.z; if (inCar()) seenCars.add(carKey()); }
      }
      // stunts in view add viewers: a drift is 1% of the level's range a second
      const car = m.vehicles.player;
      if (L >= 3 && h.seen && inCar() && car && car.drift && car.drift.active) stunt(NUM.stunt.drift * dt, true);
      if (hold || f.frozen) { h.unseenT = 0; if (hold) h.viewers = h.peak = Math.min(CAP[L], h.viewers * Math.exp(Math.log(CAP[L] / ENTRY[L]) / NUM.climb * dt)); }
      else if (h.seen) {
        h.unseenT = 0; h.levelT += dt;
        h.viewers = Math.min(CAP[L], h.viewers * Math.exp(Math.log(CAP[L] / ENTRY[L]) / NUM.climb * dt));
        h.peak = Math.max(h.peak, h.viewers);
        // heat 1 is a pull-over: 20 s of not stopping with a unit close is the next level
        if (L === 1) {
          const near = m.cops && m.cops.nearest ? m.cops.nearest() : 1e9;
          evadeT = near < 80 && speed > 20 / 3.6 ? evadeT + dt : Math.max(0, evadeT - dt * 0.5);
          if (evadeT >= NUM.evade) { evadeT = 0; crime('evade', p.x, p.z, { seen: true }); }
        }
        if (h.level === L && L < 5 && (h.levelT >= NUM.climb || h.viewers >= CAP[L]) && (f.max === undefined || f.max > L)) { h.points = L * 100; crime('survive', p.x, p.z, { seen: true }); }
      } else if ((h.unseenT += dt) > NUM.grace) {
        h.viewers -= NUM.drain * h.peak / L * (hidden() ? 2 : 1) * dt;
        if (h.viewers <= 0) { clear('unseen'); sound.update(dt, null); return; }
      }
      if (h.level >= 3 && (liveT -= dt) <= 0) { liveT = 0.5; ev.emit('heat:live', { viewers: Math.round(h.viewers), peak: Math.round(h.peak) }); }
      sound.update(dt, m.cops || null);
    }
    return api;
  },
  update(dt, ctx) { ctx.modules.heat.tick(dt); },
};
