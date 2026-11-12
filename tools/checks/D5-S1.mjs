// Session D5-S1 (Heat): D5.1 to D5.5 from plan/08-roadmap.md, and one check per item on the session's list.
const QUIET = '&quality=low&traffic=0&peds=0';
const SMALL = { viewport: { width: 960, height: 540 } };
const settle = (page, ms = 500) => page.waitForTimeout(ms);

export default [
  {
    id: 'D5.1', name: 'Response: heat 1 brings a cruiser within 10 s; ramming a cruiser from heat 0 gives heat 1 or more within 2 s',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test;
        T.setHeat(1);
        let secs = 0; while (secs < 10 && T.stats().cops < 1) { T.advance(0.25); secs += 0.25; }
        const first = { secs, cops: T.stats().cops, list: T.cops.list(), heat: T.heat() };
        const trail = [];
        for (let i = 0; i < 8; i++) { T.advance(1); const u = T.cops.list()[0]; if (u) trail.push(`${u.d.toFixed(0)}m ${u.v.toFixed(0)}m/s ${u.state}`); }
        const later = { list: T.cops.list(), heat: T.heat(), trail };
        // from heat 0: a cruiser stands 14 m ahead, and the player drives into it at 15 m/s
        T.reset(); T.advance(0.5);
        const p = T.player(), fx = Math.sin(p.h), fz = Math.cos(p.h);
        T.cops.spawn(p.x + fx * 14, p.z + fz * 14, p.h + Math.PI / 2);
        const before = T.heat().level;
        T.teleport(p.x, p.z, p.h, 15);
        let ram = 0; while (ram < 2 && T.heat().level < 1) { T.advance(0.1); ram += 0.1; }
        return { first, later, before, ram, after: T.heat(), crimes: g.events.count('crime'), errors: T.errors() };
      });
      const nearest = r.later.list.length ? Math.min(...r.later.list.map((u) => u.d)) : 999;
      t.expect(r.first.cops, '>=', 1, 'cruisers on the street after test.setHeat(1)');
      t.expect(r.first.secs, '<=', 10, 'seconds until the first cruiser exists');
      t.expect(r.first.list[0].d - nearest, '>=', 45, 'metres the cruiser closed on the player in 8 s (it is coming, by road)');
      t.expect(r.before, '==', 0, 'heat before the ram');
      t.expect(r.after.level, '>=', 1, 'heat after ramming a cruiser');
      t.expect(r.ram, '<=', 2, 'seconds from the drive-off to heat');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`first cruiser after ${r.first.secs} s at ${r.first.list[0] ? r.first.list[0].d.toFixed(0) : '?'} m; 8 s later nearest ${nearest.toFixed(0)} m, seen ${r.later.heat.seen}; ram gave heat ${r.after.level} in ${r.ram.toFixed(1)} s; the cruiser each second: ${r.later.trail.join(', ')}`);
    },
  },
  {
    id: 'D5.2', name: 'Live: heat 3 fires heat:live with viewers, the LIVE pill shows, three chat lines or more within 10 s',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      await page.evaluate(() => { const g = window.__game; g.liveSeen = []; g.events.on('heat:live', (e) => g.liveSeen.push(e.viewers)); g.test.setHeat(3); });
      await page.waitForTimeout(7000);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, hud = T.hud(), live = T.live();
        const pill = g.modules.hud.layout().find((q) => q.id === 'live');
        return { liveSeen: g.liveSeen, hud, live, pill, heat: T.heat(), chopper: !!g.modules.chopper, errors: T.errors() };
      });
      t.expect(r.liveSeen.length, '>=', 1, 'heat:live events');
      t.expect(Math.max(0, ...r.liveSeen), '>=', 1000, 'viewers in heat:live');
      t.expect(!!(r.pill && r.pill.shown), '==', true, 'the LIVE pill is showing');
      t.expect(r.live.shown, '>=', 3, 'chat lines shown within the wait');
      t.expect(r.live.onHud, '>=', 100, 'the chat is painted on the HUD canvas (alpha in its box)');
      t.expect(r.live.ticker.length, '>=', 10, 'the Sheriff\'s ticker has a line');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`${r.liveSeen.length} heat:live events, top ${Math.max(0, ...r.liveSeen)} viewers; ${r.live.shown} chat lines; ticker "${r.live.ticker.slice(0, 50)}..."; the helicopter is session D5-S2's (modules.chopper: ${r.chopper})`);
    },
  },
  {
    id: 'D5.3', name: 'Escape: heat 2 and a teleport 1 km away clears in under 30 s; heat 5 in under 75 s',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, out = {};
        for (const L of [2, 5]) {
          T.reset(); T.advance(0.2);
          g.cleared = null; const off = g.events.on('heat:cleared', (e) => { g.cleared = e; });
          T.teleport(0, 37, Math.PI / 2); T.setHeat(L); T.advance(1);
          T.teleport(-1000, 40.5, Math.PI / 2);
          await T.ensure(-1000, 40.5, 1);
          let secs = 0; while (secs < 90 && T.heat().level > 0) { T.advance(0.25); secs += 0.25; }
          out[L] = { secs, cleared: g.cleared, cops: T.stats().cops }; off();
        }
        return { out, errors: T.errors() };
      });
      t.expect(r.out[2].secs, 'between', [24.5, 28.5], 'seconds for heat 2 to clear, unseen (26.5 by the rule)');
      t.expect(r.out[5].secs, 'between', [61, 67], 'seconds for heat 5 to clear, unseen (64 by the rule)');
      t.expect(!!r.out[2].cleared, '==', true, 'heat:cleared was emitted');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`heat 2 cleared in ${r.out[2].secs} s, heat 5 in ${r.out[5].secs} s`);
    },
  },
  {
    id: 'D5.4', name: 'Stunts add viewers: at heat 3 in a deputy\'s view, a drift leaves more viewers than the same run without it',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, out = {};
        for (const kind of ['straight', 'drift']) {
          T.reset(); T.advance(0.2);
          T.teleport(-300, 40.5, Math.PI / 2, 24);
          T.setHeat(3); T.cops.stage(2); T.advance(0.5);
          const v0 = T.heat().viewers;
          T.input(kind === 'drift' ? [{ t: 0, hold: ['gas', 'left', 'handbrake'] }, { t: 0.7, hold: ['gas', 'left'] }, { t: 1.6, hold: ['gas', 'right'] }, { t: 3, hold: [] }] : [{ t: 0, hold: ['gas'] }, { t: 3, hold: [] }]);
          let drifting = 0, seen = 0, n = 0;
          for (let i = 0; i < 30; i++) { T.advance(0.1); n++; const p = T.player(); if (p.drift && p.drift.active) drifting++; if (T.heat().seen) seen++; }
          out[kind] = { v0, v1: T.heat().viewers, drifting: drifting / 10, seen: seen / n, level: T.heat().level };
        }
        return { out, errors: T.errors() };
      });
      const gain = (o) => o.v1 - o.v0;
      t.expect(r.out.drift.drifting, '>=', 0.5, 'seconds the car was drifting');
      t.expect(r.out.drift.seen, '>=', 0.7, 'share of the run a deputy could see the car');
      t.expect(gain(r.out.drift) - gain(r.out.straight), '>=', 100, 'extra viewers from the drift');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`straight +${gain(r.out.straight).toFixed(0)} viewers in 3 s, with a ${r.out.drift.drifting.toFixed(1)} s drift +${gain(r.out.drift).toFixed(0)}`);
    },
  },
  {
    id: 'D5.5', name: 'Booked: heat 1, stopped beside a deputy for 5 s: player:booked, cash down 10%, on foot at the stand-in for the Sheriff\'s HQ',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, S = g.state;
        S.economy.cash = 18250;
        g.booked = []; g.events.on('player:booked', (e) => g.booked.push(e));
        const p = T.player(), fx = Math.sin(p.h), fz = Math.cos(p.h), lx = fz, lz = -fx;
        T.setHeat(1);
        T.cops.spawn(p.x + lx * 4, p.z + lz * 4, p.h + Math.PI);          // a cruiser stopped beside the car, nose to tail
        let secs = 0; const trail = [];
        while (secs < 5 && !g.booked.length) { T.advance(0.25); secs += 0.25; const u = T.cops.list()[0]; if (u) trail.push(u.deputy ? +u.deputy.near.toFixed(1) : -1); }
        const me = T.player(), b = g.booked[0] || null;
        await new Promise((ok) => setTimeout(ok, 700));
        const card = T.live().booked;
        return { secs, b, cash: S.economy.cash, me: { x: me.x, z: me.z, mode: me.mode }, heat: T.heat(), trail, card, hq: g.modules.heat.numbers.hq, errors: T.errors() };
      });
      t.expect(!!r.b, '==', true, 'player:booked was emitted');
      t.expect(r.secs, '<=', 5, 'seconds stopped beside the deputy');
      t.expect(r.cash, '==', 16425, 'cash after losing 10% of $18,250');
      t.expect(r.heat.level, '==', 0, 'heat after being booked');
      t.expect(r.me.mode, '==', 'foot', 'the player is on foot');
      t.expect(r.b ? Math.hypot(r.me.x - r.b.x, r.me.z - r.b.z) : 999, '<=', 30, 'metres from the stand-in point');
      t.expect(r.b ? Math.hypot(r.b.x - r.hq.x, r.b.z - r.hq.z) : 999, '<=', 120, 'metres from the stand-in point to the HQ\'s place (200, -2150)');
      t.expect(!!(r.card && r.card.open), '==', true, 'the booking screen is up');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`booked after ${r.secs} s; cost $${r.b && r.b.cost}; stand-in point (${r.b && r.b.x.toFixed(0)}, ${r.b && r.b.z.toFixed(0)}); deputy's distance each 0.25 s: ${r.trail.join(' ')}`);
    },
  },
];
