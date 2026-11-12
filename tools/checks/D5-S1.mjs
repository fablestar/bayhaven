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
      t.expect(!!(r.card && r.card.open), '==', true, 'the booking screen is up');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`booked after ${r.secs} s; cost $${r.b && r.b.cost}; stand-in point (${r.b && r.b.x.toFixed(0)}, ${r.b && r.b.z.toFixed(0)}), ${r.b ? Math.hypot(r.b.x - r.hq.x, r.b.z - r.hq.z).toFixed(0) : '?'} m from the HQ's place, which is off today's map; deputy's distance each 0.25 s: ${r.trail.join(' ')}`);
    },
  },
  {
    id: 'D5-S1.1', name: 'Crimes: seen ones add their points, unseen ones add none, gunfire is heard anywhere, small crimes stop at heat 2',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, out = {}, crimes = [];
        g.events.on('crime', (e) => crimes.push(e));
        const p = T.player(), fx = Math.sin(p.h), fz = Math.cos(p.h);
        out.unseen = T.crime('hitcar').points; out.afterUnseen = T.heat().points;
        T.cops.spawn(p.x - fx * 15, p.z - fz * 15, p.h);                    // a cruiser behind, looking this way
        out.witnessed = g.modules.heat.witnessed(p.x, p.z);
        out.seenCar = T.crime('hitcar').points; out.p1 = T.heat().points;
        g.events.emit('ped:hit', { speed: 20, kmh: 72, x: p.x, z: p.z, kind: 'tourist', id: 1, by: 'player' });
        out.p2 = T.heat().points; out.l2 = T.heat().level;
        for (let i = 0; i < 6; i++) T.crime('hitped');
        out.p3 = T.heat().points; out.l3 = T.heat().level;
        T.cops.clear(); g.modules.heat.clear(); T.advance(0.1);
        g.events.emit('weapon:fired', { weapon: 'pistol', x: p.x, z: p.z });
        out.gun = T.heat().points; out.gunLevel = T.heat().level;
        out.kinds = crimes.map((c) => c.case + ':' + c.kind + ':' + c.points + ':' + c.seen);
        return { out, errors: T.errors() };
      });
      const o = r.out;
      t.expect(o.unseen, '==', 0, 'points for hitting a car with no deputy near');
      t.expect(o.witnessed, '==', true, 'a cruiser 15 m behind can see the player');
      t.expect(o.p1 - o.afterUnseen, '==', 15, 'points for hitting a car in view');
      t.expect(o.p2 - o.p1, '==', 200, 'points for putting a bystander down in view (ped:hit at 72 km/h)');
      t.expect(o.l2, '==', 2, 'heat after that');
      t.expect(o.p3, '==', 299, 'points after six more small crimes (they stop short of heat 3)');
      t.expect(o.gunLevel, '==', 1, 'heat from one unseen shot (heard anywhere)');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(o.kinds.join(' · '));
    },
  },
  {
    id: 'D5-S1.2', name: 'Changing car unseen drops one level, once in 20 s; the meter keeps its share',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, drops = [];
        g.events.on('heat:dropped', (e) => drops.push(e));
        T.setHeat(2); T.advance(4);
        const a = T.heat();
        T.spawnVehicle('snook'); T.advance(0.1);
        const b = T.heat();
        T.spawnVehicle('tarpon'); T.advance(0.1);
        const c = T.heat();
        return { a, b, c, drops, errors: T.errors() };
      });
      t.expect(r.a.level, '==', 2, 'heat before the swap');
      t.expect(r.b.level, '==', 1, 'heat after changing car unseen');
      t.expect(Math.abs(r.b.viewers / r.b.peak - r.a.viewers / r.a.peak), '<=', 0.02, 'the share of the meter kept across the drop');
      t.expect(r.c.level, '==', 1, 'heat after a second swap at once (20 s must pass)');
      t.expect(r.drops.length, '==', 1, 'heat:dropped events');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`meter ${r.a.viewers.toFixed(0)} of ${r.a.peak} at heat 2, then ${r.b.viewers.toFixed(0)} of ${r.b.peak} at heat 1; reason "${r.drops[0] && r.drops[0].reason}"`);
    },
  },
  {
    id: 'D5-S1.3', name: 'Chat: 40 A lines or more, 30 usernames, lines that answer a drift and a getaway, the ticker speaks',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test;
        const info = T.live();
        T.setHeat(3); g.modules.heat.hold = true; T.advance(3);
        const opening = T.live().rows;
        g.events.emit('drift:end', { score: 6200, wall: false }); T.advance(2.5);
        const drift = T.live().rows;
        g.modules.heat.hold = false; g.modules.heat.clear(); T.advance(2.5);
        const away = T.live();
        return { info, opening, drift, away, errors: T.errors() };
      });
      const DRIFT = ['that drift tho', 'sideways king', '6,200!!!', 'clip that', 'do it again', 'smooth as hell', 'tyres are gone', 'smoke show', '10/10 slide'];
      const AWAY = ['they LOST him??', 'no way', 'gone. show\'s over', 'no arrest again lol', 'same time tomorrow', 'gg', 'got boring. we left'];
      const has = (rows, list) => rows.filter((q) => list.some((l) => q.endsWith(': ' + l) || q.includes(l))).length;
      t.expect(r.info.lines, '>=', 40, 'chat lines in the file');
      t.expect(r.info.tierA, '>=', 40, 'tier A lines');      // (was == 40: D5-S2 added 16 more A rows; the check's name says "or more")
      t.expect(r.info.users, '==', 30, 'usernames');
      t.expect(r.opening.length, '>=', 2, 'rows up 3 s after going live');
      t.expect(has(r.drift, DRIFT), '>=', 1, 'rows about the drift');
      t.expect(has(r.away.rows, AWAY), '>=', 1, 'rows about the getaway');
      t.expect(r.away.up, '==', true, 'the overlay stays up after the heat clears (4 s)');
      t.expect(r.away.tickerLines, '>=', 2, 'ticker lines queued (the opening and the sign-off)');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`${r.info.lines} lines (${r.info.tierA} A); after the drift: ${r.drift.join(' | ')}; after the getaway: ${r.away.rows.join(' | ')}`);
    },
  },
  {
    id: 'D5-S1.4', name: 'Clip day-5: night, heat 3, three cruisers lit, the chat up; and what the police cost to draw',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test;
        const base = T.stats();
        T.clip.play('day-5'); T.advance(4);
        await new Promise((ok) => setTimeout(ok, 800));
        const s = T.stats(), cs = T.cops.stats(), heat = T.heat(), live = T.live(), hour = g.state.clock.hour, cops = T.cops.list();
        return { base: { calls: base.calls, tris: base.tris }, s: { calls: s.calls, tris: s.tris, cops: s.cops }, cs, heat, rows: live.rows, hour, lit: cops.filter((u) => u.lit).length, ids: g.modules.clips.ids, errors: T.errors() };
      });
      t.expect(r.ids.includes('day-5'), '==', true, 'the clip is found');
      t.expect(r.hour >= 20 || r.hour < 5, '==', true, 'it is night');
      t.expect(r.heat.level, '==', 3, 'heat during the clip');
      t.expect(r.s.cops, '==', 3, 'cruisers');
      t.expect(r.lit, '==', 3, 'cruisers with their bars lit');
      t.expect(r.rows.length, '>=', 2, 'chat rows on screen 4 s in');
      t.expect(r.cs.calls, '<=', 4, 'draw calls for every cruiser\'s livery, lamps, glow and the deputies');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`frame ${r.s.calls} draw calls, ${r.s.tris} triangles with three cruisers (police extras: ${r.cs.calls} calls, ${r.cs.triangles} triangles; before the clip ${r.base.calls} calls, ${r.base.tris} triangles); viewers ${r.heat.viewers.toFixed(0)}`);
    },
  },
  {
    id: 'D5-S1.5', name: 'Sound: the siren follows the nearest lit cruiser and the scanner reads a call for a seen crime',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, calls = [];
        g.events.on('scanner:call', (e) => calls.push(e));
        const quiet = T.heatSound();
        T.setHeat(2); T.cops.stage(1); T.advance(0.5);
        const near = T.heatSound();
        T.crime('hitcop'); T.advance(0.2);
        const after = T.heatSound();
        g.modules.heat.clear(); T.advance(0.5);
        return { quiet, near, after, calls, off: T.heatSound(), errors: T.errors() };
      });
      t.expect(r.quiet.sirenOn, '==', false, 'the siren at heat 0');
      t.expect(r.near.sirenOn, '==', true, 'the siren with a lit cruiser 10 m behind');
      t.expect(r.near.mode, '==', 'wail', 'the siren\'s pattern at heat 2');
      t.expect(r.calls.length, '>=', 1, 'scanner calls');
      t.expect(r.calls[0] ? r.calls[0].text.length : 999, '<=', 160, 'characters in the call');
      t.expect(/\{/.test(r.calls[0] ? r.calls[0].text : '{'), '==', false, 'every placeholder was filled');
      t.expect(r.off.sirenOn, '==', false, 'the siren after the heat clears');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`siren level ${r.near.sirenLevel.toFixed(3)} (${r.near.mode}); the call: "${r.calls[0] && r.calls[0].text}"`);
    },
  },
  {
    id: 'D5-S1.6', name: 'Chase: at heat 2 three cruisers stay with a car driven flat out down the beachfront for 15 s',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, roles = new Set(), states = new Set();
        let crashes = 0; g.events.on('vehicle:crash', (e) => { if (e.what === 'vehicle') crashes++; });
        T.teleport(-900, 40.5, Math.PI / 2, 10);
        T.setHeat(2); T.cops.stage(3);
        T.input([{ t: 0, hold: ['gas'] }, { t: 15, hold: [] }]);
        let nearest = 1e9, far = 0, seen = 0; const trail = [];
        for (let i = 0; i < 60; i++) {
          T.advance(0.25);
          if (i % 8 === 7) { const u = T.cops.list().sort((a, b) => a.d - b.d)[0]; if (u) trail.push(`${u.d.toFixed(0)}m ${(u.v * 3.6).toFixed(0)}km/h ${u.state}`); }
          const list = T.cops.list(); let d = 1e9;
          for (const u of list) { roles.add(u.role); states.add(u.state); d = Math.min(d, u.d); }
          nearest = Math.min(nearest, d); far = Math.max(far, d); if (T.heat().seen) seen++;
        }
        const list = T.cops.list(), p = T.player();
        return { roles: [...roles], states: [...states], nearest, far, seen: seen / 60, crashes, end: list.map((u) => +u.d.toFixed(0)), units: list.length, kmh: p.kmh, heat: T.heat().level, rams: T.cops.stats().rams, trail, errors: T.errors() };
      });
      t.expect(r.units, '>=', 3, 'cruisers at the end');
      t.expect(r.far, '<=', 120, 'metres from the player to the nearest cruiser at its worst');
      t.expect(r.seen, '>=', 0.6, 'share of the run the player was in a deputy\'s view');
      t.expect(r.roles.includes('chase') && r.roles.includes('ram'), '==', true, 'chase and ram roles were handed out');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`player at ${r.kmh.toFixed(0)} km/h; nearest cruiser between ${r.nearest.toFixed(0)} and ${r.far.toFixed(0)} m; at the end ${r.end.join(', ')} m; roles ${r.roles.join(' ')}; states ${r.states.join(' ')}; ram swings ${r.rams}; car-to-car hits ${r.crashes}; heat ${r.heat}; the nearest every 2 s: ${r.trail.join(', ')}`);
    },
  },
];
