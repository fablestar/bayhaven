// Heat 4 "Breaking News" and heat 5 "Hurricane Dale": the Sheriff's heavy units.
// - Sheriff Grouper SUVs (they shove with one and a half times their mass), tactical vans (armoured,
//   slow, they hold the roadblocks) and, at heat 5, Sheriff Rucker's show truck, which never rams:
//   it pulls alongside to film, and its cameras see 80 m all round.
// - Roadblocks two junctions ahead on avenues, with a spike strip in front (cops-roadblock.js).
// - `heat:broadcast { on, level }` when the level crosses 4, for the radio to cut to the chase.
// - 20 more chat rows and 10 more ticker lines (src/content/heat-high.js), fired from here.
// The units are rows in the deputies' `kinds` and live in `modules.cops.units`, so the same brain
// drives them and the same cap holds them. Nothing here edits the heat module.
// Public object: { plan(level), counts(), roadblocks, draw, stats }.
import { createHeavyDraw, HEAVY_BARS } from './cops-heavy-draw.js';
import { createRoadblocks } from './cops-roadblock.js';
import { LIVERY } from './cops-draw.js';
import { CHAT } from '../content/chat.js';
import { TICKER } from '../content/scanner.js';
import { CHAT_HIGH, TICKER_HIGH } from '../content/heat-high.js';

// units by level: [low, medium, high] (plan/bible/systems/heat.md, "Levels and what comes"). The truck is asked for first.
export const HEAVY = {
  plan: { 4: [['cruiser', [2, 3, 4]], ['suv', [2, 2, 3]], ['van', [2, 2, 2]]], 5: [['truck', [1, 1, 1]], ['cruiser', [2, 3, 4]], ['suv', [1, 2, 4]], ['van', [2, 3, 3]]] },
  kinds: {
    suv: { model: 'grouper', paint: LIVERY.white, accent: LIVERY.teal, mass: 2500 * 1.5, top: 165 / 3.6, bar: HEAVY_BARS.suv },
    van: { model: 'pompano', paint: LIVERY.teal, accent: LIVERY.teal, hw: 1.15, hl: 3.0, mass: 4500, top: 125 / 3.6, bar: HEAVY_BARS.van },
    truck: { model: 'mullet', paint: LIVERY.teal, accent: LIVERY.teal, hw: 1.2, hl: 3.75, mass: 6800, top: 150 / 3.6, bar: HEAVY_BARS.truck, role: 'box', eye: 80 },
  },
  marks: [[4, 50000], [4, 150000], [5, 250000], [5, 500000]], filler: 14, horn: [293.66, 349.23, 440, 587.33], hornEvery: 14,
};

let heavy = null;
export default {
  name: 'copsheavy', order: 26, renderOrder: 23, needs: ['cops', 'heat', 'nav', 'map', 'vehicles'],
  init(ctx) {
    const m = ctx.modules, S = ctx.state, ev = ctx.events, cops = m.cops;
    if (!cops || cops.disabled || !cops.kinds) return { disabled: true };
    Object.assign(cops.kinds, HEAVY.kinds);
    // the words: once, into the lists the LIVE overlay reads
    for (const r of CHAT_HIGH) if (!CHAT.some((q) => q.n === r.n)) CHAT.push(r);
    for (const r of TICKER_HIGH) if (!TICKER.some((q) => q.id === r.id)) TICKER.push(r);

    const qi = () => (ctx.quality.level === 'low' ? 0 : ctx.quality.level === 'high' ? 2 : 1);
    const rows = { 4: [], 5: [] };
    let rowsFor = -1;
    function plan(L) {
      if (L < 4) return null;
      const q = qi();
      if (q !== rowsFor) { rowsFor = q; for (const k of [4, 5]) rows[k] = HEAVY.plan[k].map(([kind, n]) => [kind, n[q]]); }
      return rows[Math.min(5, L)];
    }
    cops.plan = plan;
    const wanted = (kind, L) => { const p = plan(L); if (!p) return kind === 'cruiser' ? cops.numbers.want[L] || 0 : 0; for (const r of p) if (r[0] === kind) return r[1]; return 0; };

    const cap = ctx.quality.TABLE && ctx.quality.TABLE.copCap ? ctx.quality.TABLE.copCap[2] : 12;
    const draw = createHeavyDraw(ctx.scene, cap);
    const roadblocks = createRoadblocks({ S, ev, m, cops, quality: ctx.quality });
    const stats = { retired: 0, broadcasts: 0, horns: 0, chat: 0, ticker: 0 };
    const marks = {};
    let retireT = 0, fillT = HEAVY.filler, hornT = 2, truckNear = false, live = false, copFireT = -99, gunT = -99, shootT = -99, time = 0, big = false;
    const say = (trigger) => { if (m.live && m.live.fire) stats.chat += m.live.fire(trigger) || 0; };
    const line = (on, data) => { if (m.live && m.live.line) { m.live.line(on, data || {}, true); stats.ticker++; } };

    ev.on('heat:changed', (e) => {
      const on = e.level >= 4;
      if (on !== live) { live = on; stats.broadcasts++; ev.emit('heat:broadcast', { on, level: e.level }); }
      if (e.level === 4 && e.from < 4) { say('heat4'); line('step4'); }
      if (e.level === 5 && e.from < 5) { say('heat5'); line('step5'); hornT = 3; truckNear = false; }
      if (e.level === 0) { for (const k in marks) delete marks[k]; big = false; }
    });
    ev.on('heat:live', (e) => {
      const L = S.heat.level;
      for (const [lv, n] of HEAVY.marks) if (L === lv && e.viewers >= n && !marks[n]) { marks[n] = true; line('viewers', { when: n }); }
      if (L === 5 && e.viewers >= 200000 && !big) { big = true; say('big'); }
    });
    ev.on('heat:roadblock:near', () => say('roadblock'));
    ev.on('heat:spikes:near', () => say('spikes'));
    ev.on('chopper:arrived', (e) => { if (e && e.n === 2) { say('chopper2'); line('chopper2'); } });
    ev.on('chopper:cam', (e) => { if (e && e.on) say('choppercam'); });
    ev.on('tyre:burst', (e) => ev.emit('ui:toast', { text: e.left > 0 ? 'Tyre burst' : 'All four tyres are gone', seconds: 3 }));
    // fire both ways inside 5 s is a shoot-out to the chat
    const both = () => { if (S.heat.level >= 4 && Math.abs(copFireT - gunT) < 5 && time - shootT > 30) { shootT = time; say('shootout'); } };
    ev.on('cop:fired', (e) => {
      copFireT = time; both();
      const u = e && cops.units.find((q) => q.id === e.id);
      if (u && u.kind === 'truck' && !marks.truckfire) { marks.truckfire = true; say('truckfire'); }
    });
    ev.on('weapon:fired', (e) => { if (!e || !e.by || e.by === 'player') { gunT = time; both(); } });
    // a burst tyre lasts as long as the chase or the car, whichever ends first
    for (const name of ['vehicle:entered', 'game:reset', 'heat:cleared', 'player:booked']) ev.on(name, () => roadblocks.mend());
    ev.on('game:reset', () => roadblocks.clear('reset'));
    ev.on('quality:changed', () => roadblocks.clear('quality'));

    // the show's theme as the truck's horn: D4 F4 A4 D5
    function horn(gain) {
      const a = m.audio && m.audio.ctx; stats.horns++;
      if (!a || !m.audio.bus) return;
      const t0 = a.currentTime + 0.02, out = a.createGain(); out.gain.value = gain; out.connect(m.audio.bus('effects'));
      HEAVY.horn.forEach((hz, i) => {
        const o = a.createOscillator(), g = a.createGain(), t = t0 + i * 0.2;
        o.type = 'sawtooth'; o.frequency.value = hz;
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.5, t + 0.02); g.gain.setValueAtTime(0.5, t + (i === 3 ? 0.5 : 0.15)); g.gain.exponentialRampToValueAtTime(0.0001, t + (i === 3 ? 0.7 : 0.19));
        o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.75);
      });
    }

    const counts = () => { const c = { cruiser: 0, suv: 0, van: 0, truck: 0 }; for (const u of cops.units) c[u.kind] = (c[u.kind] || 0) + 1; return c; };
    heavy = {
      numbers: HEAVY, plan, counts, roadblocks, draw, stats,
      get broadcast() { return live; },
      update(dt) {
        time += dt;
        const L = S.heat.level;
        // one a second: a unit the level no longer asks for drives off the show when nobody is looking
        if ((retireT -= dt) <= 0) {
          retireT = 1;
          if (L > 0) for (const kind of ['cruiser', 'suv', 'van', 'truck']) {
            if (cops.count(kind) <= wanted(kind, L)) continue;
            let pick = null;
            for (const u of cops.units) if (u.kind === kind && !u.post && !u.deputy.out && u.d > 50 && (!pick || u.d > pick.d) && !cops.onCamera(u.v.x, u.v.z)) pick = u;
            if (pick) { cops.remove(pick); stats.retired++; break; }
          }
        }
        roadblocks.update(dt);
        if (L < 4) return;
        // the chat's own lines for these levels, when it has been quiet
        if (S.heat.seen && (fillT -= dt) <= 0) { fillT = HEAVY.filler; say('filler' + L); }
        // the truck: its horn when it arrives and now and then, and the chat when it is close
        const truck = L === 5 ? cops.units.find((u) => u.kind === 'truck') : null;
        if (truck && truck.d !== undefined) {
          if (truck.d < 150 && !truckNear) { truckNear = true; say('truck'); }
          if (truck.d < 120 && (hornT -= dt) <= 0) { hornT = HEAVY.hornEvery; horn(Math.max(0.08, 0.5 * (1 - truck.d / 140))); }
        }
      },
    };
    ctx.test.heavy = () => ({ counts: counts(), plan: plan(S.heat.level), cap: ctx.quality.get('copCap'), units: cops.units.length, broadcast: live, stats: { ...stats }, calls: draw.calls, triangles: draw.triangles,
      chatRows: CHAT.length, tickerRows: TICKER.length, tyres: m.vehicles.player.tyres ? { ...m.vehicles.player.tyres, corners: m.vehicles.player.tyres.corners.slice() } : null,
      roadblocks: { ...roadblocks.stats, up: roadblocks.blocks.map((b) => ({ id: b.id, x: b.x, z: b.z, t: b.t, side: b.side, width: b.width, strip: { x: b.strip.x, z: b.strip.z, len: b.strip.len }, props: b.props.length,
        units: b.units.map((u) => ({ id: u.id, kind: u.kind, x: u.v.x, z: u.v.z, h: u.v.h, hw: u.v.hw, hl: u.v.hl })) })) } });
    ctx.test.roadblock = { force: () => { const b = roadblocks.force(); return b ? { id: b.id, x: b.x, z: b.z } : null; }, clear: () => roadblocks.clear('test'), predict: () => (roadblocks.predict() || []).map((n) => ({ key: n.key, metres: Math.round(n.metres), kind: n.lane.kind, name: n.lane.name, width: n.lane.piece && n.lane.piece.width, len: n.lane.len })) };
    ctx.test.burst = (corner = 0) => { const car = m.vehicles.player, w = { x: 0, z: 0 }; car.wheelPos(corner, w); roadblocks.burst(car, corner, w.x, w.z); return car.tyres && car.tyres.corners.slice(); };
    return heavy;
  },
  update(dt) { if (heavy && heavy.update) heavy.update(dt); },
  render(alpha, ctx) { if (heavy && heavy.draw) heavy.draw.draw(ctx.modules.cops.units, heavy.roadblocks.blocks); },
};
