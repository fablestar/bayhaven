// Session D6-S1 (Missions): D6.1, D6.2 and D6.3 from plan/08-roadmap.md, and one check per item on the session's list.
import { readFileSync } from 'node:fs';
import mission from '../../src/content/missions/01-final-notice.js';
import { STEPS } from '../../src/systems/missions-steps.js';

const QUIET = '&traffic=0&peds=0&hour=17.5';
const SMALL = { viewport: { width: 960, height: 540 } };
const settle = (page, ms = 500) => page.waitForTimeout(ms);
// in the page: keep every mission event, in order
const WATCH = `(() => { const g = window.__game; g.seen = [];
  for (const n of ['mission:offered', 'mission:started', 'mission:step', 'mission:failed', 'mission:completed', 'mission:ram', 'mission:retried', 'mission:stamped', 'cash:changed', 'dialogue:line'])
    g.events.on(n, (e) => g.seen.push({ ...e, ev: n }));
  return true; })()`;

export default [
  {
    id: 'D6.1', name: 'Mission 1: final-notice runs from start to mission:completed by skipping steps; cash rises by 500; the result card is shown',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page); await page.evaluate(WATCH);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, cash0 = g.state.economy.cash, s0 = T.mission.state();
        const started = T.mission.start('final-notice');
        const types = [T.mission.state().type];
        for (let i = 0; i < 6; i++) { const s = T.mission.skipStep(); types.push(s.type || s.status); T.advance(0.2); }
        const s = T.mission.state(), done = g.seen.find((e) => e.ev === 'mission:completed');
        return { started, offered: s0.available, missions: s0.missions, types, status: s.status, done, cash: g.state.economy.cash - cash0, steps: g.seen.filter((e) => e.ev === 'mission:step').length,
          startedEv: g.seen.filter((e) => e.ev === 'mission:started').length, doneList: s.done, p: T.player(), errors: T.errors() };
      });
      t.expect(r.offered.includes('final-notice'), '==', true, 'final-notice is on offer at the start');
      t.expect(r.started, '==', true, 'test.mission.start');
      t.expect(r.types.join(' '), '==', 'cutscene enter chase survive say goto card', 'the six steps of plan/05, then the card');
      t.expect(r.steps, '==', 6, 'mission:step events');
      t.expect(r.startedEv, '==', 1, 'mission:started events');
      t.expect(!!r.done && r.done.cash, '==', 500, 'mission:completed carries cash 500');
      t.expect(r.cash, '==', 500, 'cash rose by');
      t.expect(r.doneList.includes('final-notice'), '==', true, 'the mission is in state.mission.done');
      t.expect(Math.hypot(r.p.x - 340, r.p.z + 222), '<', 25, 'the player is at Park & Sons (metres from the seed)');
      await page.waitForTimeout(1900);
      const c = await page.evaluate(() => ({ ui: window.__game.test.missionUi().card, seen: window.__game.seen.filter((e) => e.ev === 'mission:stamped').length, banner: window.__game.test.missionUi().card.widthShare }));
      t.expect(c.ui.open, '==', true, 'the result card is on screen');
      t.expect(c.ui.failed, '==', false, 'it is the Delivered card');
      t.expect(c.ui.stamp, '==', 'Delivered', 'the stamp');
      t.expect(c.ui.stamped, '==', true, 'the stamp has landed');
      t.expect(c.ui.rows.join(' | ').replace(/0:0\d/, '0:0n'), '==', 'Time 0:0n | Cash +$500 | Followers +0', 'the three lines');
      t.expect(c.banner, '<', 0.95, 'the card is a postcard, not a banner across the screen (share of the width)');
      t.expect(r.errors.length, '==', 0, 'errors');
    },
  },
  {
    id: 'D6.2', name: 'Fail and retry: destroying the vehicle mid-mission emits mission:failed; retry resumes from the last checkpoint',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page); await page.evaluate(WATCH);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test;
        T.mission.start('final-notice'); T.mission.skipStep(); T.mission.skipStep(); T.advance(2.5);
        const before = T.mission.state(), truck0 = before.actors.find((a) => a.name === 'truck');
        T.damageSet(0); T.advance(1.5);
        const failed = g.seen.find((e) => e.ev === 'mission:failed'), mid = T.mission.state(), card = T.missionUi().card, dead = T.damage().dead;
        const ok = T.mission.retry(); T.advance(0.3);
        const s = T.mission.state(), p = T.player(), truck = s.actors.find((a) => a.name === 'truck');
        // the second checkpoint is after the rams: fail in the last step and come back to step 5 (index 4)
        T.mission.skipStep(); T.mission.skipStep(); T.mission.skipStep(); T.advance(0.3);
        T.mission.fail('check'); const ok2 = T.mission.retry(); T.advance(0.2); const s2 = T.mission.state();
        return { before: { step: before.step, cp: before.checkpoint, truckMoved: truck0.s }, failed, mid: mid.status, card, dead, ok, s: { status: s.status, step: s.step, type: s.type, retries: s.retries }, p,
          health: T.damage().health, truck: { s: truck.s, carrying: truck.carrying }, ok2, s2: { step: s2.step, type: s2.type, scooter: s2.actors.some((a) => a.name === 'scooter') }, errors: T.errors() };
      });
      t.expect(r.before.step, '==', 2, 'the chase is running (step index)');
      t.expect(r.before.truckMoved, '>', 10, 'the truck had driven off (metres along its path)');
      t.expect(r.dead, '==', true, 'the Heron is destroyed');
      t.expect(!!r.failed, '==', true, 'mission:failed was emitted');
      t.expect(r.failed && r.failed.when, '==', 'vehicle:destroyed', 'why');
      t.expect(r.failed && r.failed.checkpoint, '==', 2, 'the checkpoint named in the event (after step 2)');
      t.expect(r.mid, '==', 'failed', 'status after the wreck');
      t.expect(r.card.failed && r.card.stamp, '==', 'Return to sender', 'the fail card');
      t.expect(r.ok, '==', true, 'retry');
      t.expect(r.s.status + ' ' + r.s.step + ' ' + r.s.type, '==', 'running 2 chase', 'retry resumes at the checkpoint');
      t.expect(r.p.mode + ' ' + r.p.vehicle, '==', 'car heron', 'back in the Heron');
      t.expect(Math.hypot(r.p.x + 1256, r.p.z + 226), '<', 3, 'at the carport (metres off)');
      t.expect(r.health, '==', 100, 'the Heron is whole again');
      t.expect(r.truck.s, '<', 3, 'the truck is back at the gate (metres along its path)');
      t.expect(r.truck.carrying, '==', true, 'with the scooter on its hook');
      t.expect(r.s2.step + ' ' + r.s2.type, '==', '4 say', 'a fail after the rams resumes at the second checkpoint');
      t.expect(r.s2.scooter, '==', true, 'the scooter is loose in the road again');
      t.expect(r.errors.length, '==', 0, 'errors');
    },
  },
  {
    id: 'D6.3', name: 'A real step: the goto step completes when the player is driven (not skipped) to its marker by an input script',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page); await page.evaluate(WATCH);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test;
        T.mission.start('final-notice');
        for (let i = 0; i < 5; i++) T.mission.skipStep();
        const at = T.mission.state();
        // 40 m west of the marker on the same line, facing it (the bible's check, from wherever the marker stands today)
        const mk = at.markers[0];
        T.spawnVehicle('heron', { x: mk.x - 40, z: mk.z, heading: Math.PI / 2 });
        const ui = (T.advance(0.2), T.missionUi());
        const t0 = T.mission.state().seconds;
        T.input([{ t: 0, hold: ['gas'] }, { t: 3, hold: [] }]);
        let took = -1;
        for (let i = 0; i < 100; i++) { T.advance(0.1); const s = T.mission.state(); if (s.status !== 'running') { took = (i + 1) * 0.1; break; } }
        T.advance(8);
        const s = T.mission.state(), done = g.seen.find((e) => e.ev === 'mission:completed'), p = T.player();
        return { moved: at.moved, at: at.type, marker: at.markers[0], ui: { markers: ui.markers, meshes: ui.meshes, blips: ui.blips, route: ui.route, objective: ui.objective, ink: ui.objectiveInk }, took, status: s.status, done: !!done,
          skipped: g.seen.filter((e) => e.ev === 'mission:step' && e.skipped).length, d: Math.hypot(p.x - mk.x, p.z - mk.z), said: T.dialogue().said.slice(-2), errors: T.errors() };
      });
      t.expect(r.at, '==', 'goto', 'the step');
      t.expect(r.marker && r.marker.r, '==', 8, 'its marker: r 8');
      t.expect(r.marker && Math.hypot(r.marker.x - 340, r.marker.z + 222), '<', 25, 'the marker is at the Park & Sons forecourt seed, or the kerb in front of it while a building stands there (metres off)');
      t.note(`goto marker at ${r.marker.x}, ${r.marker.z}; seeds moved out of buildings: ${JSON.stringify(r.moved)}`);
      t.expect(r.ui.meshes, '>=', 1, 'the marker is drawn in the world');
      t.expect(r.ui.blips.includes('mission:goal'), '==', true, 'and is a blip on the minimap');
      t.expect(r.ui.objective, '==', 'Drive to Park & Sons Auto.', 'the objective line');
      t.expect(r.ui.ink, '>', 100, 'the objective line is painted on the HUD (its width in px)');
      t.expect(r.took, 'between', [0.5, 10], 'seconds of driving until the step completed by itself (ended ' + r.d.toFixed(1) + ' m off, ' + r.status + ')');
      t.expect(r.done, '==', true, 'mission:completed followed');
      t.expect(r.said.join(' '), '==', 'Closed. "Back in 5." He wrote that sign in the spring. Good thing I never gave back the key.', 'the arrival lines played first');
      t.expect(r.errors.length, '==', 0, 'errors');
    },
  },
  {
    id: 'D6-S1.rams', name: 'Three real rams: the coupe driven into the truck\'s tail fills the Hook bar, and the scooter breaks loose',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page); await page.evaluate(WATCH);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, E = Math.PI / 2, M = g.modules.missions;
        T.mission.start('final-notice', { from: 3, player: { model: 'heron', x: -700, z: 40.5, h: E, speed: 18, paint: 0xff4f6e, accent: 0x29e6ff }, actors: { truck: { x: -672, z: 40.5, go: true, speed: 15.3 } } });
        const look0 = T.mission.state().actors[0];
        // a driver who keeps the lane and the gas down, as a player would
        T.input((a) => { const p = g.state.player; if (!M.run || M.run.i !== 3) { a.gas = 0; a.steer = 0; a.brake = 1; return true; }
          let err = E + Math.max(-0.35, Math.min(0.35, (p.z - 40.5) * 0.08)) - p.h; while (err > Math.PI) err -= 6.2832; while (err < -Math.PI) err += 6.2832;
          a.steer = Math.max(-1, Math.min(1, err * 2.5)); a.gas = 1; a.brake = 0; return false; });
        let bar1 = null, sim = 0;
        for (; sim < 45 && T.mission.state().type === 'survive'; sim += 0.25) { T.advance(0.25); const b = T.mission.state().bar; if (b && b.value === 1 && !bar1) bar1 = b; }
        const s = T.mission.state(), rams = g.seen.filter((e) => e.ev === 'mission:ram');
        T.advance(1.0);
        const s1 = T.mission.state(), sc1 = s1.actors.find((a) => a.name === 'scooter');
        T.advance(9);
        const s2 = T.mission.state(), sc2 = s2.actors.find((a) => a.name === 'scooter');
        return { look0, sim, type: s.type, counters: s.counters, rams: rams.map((e) => Math.round(e.kmh)), bar1, truck: s.actors.find((a) => a.name === 'truck'), sc1, sc2, heat: g.state.heat.level,
          said: T.dialogue().said.filter((q) => /^(Tap|Two|Three)/.test(q)).length, health: T.damage().health, errors: T.errors() };
      });
      t.expect(r.look0.model + ' ' + r.look0.carrying, '==', 'mullet true', 'the tow truck is a Mullet with the scooter on its hook');
      t.expect(r.rams.length, '==', 3, 'rams counted');
      t.expect(Math.min(...r.rams), '>=', 15, 'the slowest counted ram (km/h closing)');
      t.expect(r.bar1 && r.bar1.label + ' ' + r.bar1.value + '/' + r.bar1.of, '==', 'Hook 1/3', 'the bar after the first ram');
      t.expect(r.type, '==', 'say', 'the step after the third ram');
      t.expect(r.sim, '<', 40, 'seconds it took');
      t.expect(r.truck.carrying, '==', false, 'the truck no longer carries the scooter');
      t.expect(!!r.sc1, '==', true, 'the scooter is its own vehicle now');
      t.expect(r.sc1 && r.sc1.speed, '>', 1, 'and is sliding (m/s, one second on)');
      t.expect(r.sc2 && r.sc2.going && r.sc2.h < 0, '==', true, 'ten seconds on Teo is riding it west');
      t.expect(r.said, '==', 3, 'Teo counted the three rams out loud');
      t.expect(r.heat, '==', 0, 'no police heat in the driving lesson');
      t.expect(r.health, '>', 40, 'the Heron survived (health)');
      t.expect(r.errors.length, '==', 0, 'errors');
    },
  },
  {
    id: 'D6-S1.talk', name: 'Dialogue: every line has its speaker\'s blip and portrait; the script fits; every step type is known to the engine',
    async run(t) {
      const types = ['say', 'cutscene', 'goto', 'enter', 'follow', 'chase', 'deliver', 'collect', 'photo', 'heat', 'survive', 'timer', 'defeat', 'switch', 'choice'];
      t.expect(types.filter((k) => !STEPS[k] || typeof STEPS[k].update !== 'function').join(','), '==', '', 'step types with no handler');
      const lines = Object.values(mission.lines).flat();
      t.expect(lines.length, '==', 40, 'lines in the mission 1 script');
      t.expect(Math.max(...lines.map((l) => l.text.length)), '<=', 90, 'the longest line (characters)');
      t.expect(Math.max(...mission.steps.filter((s) => s.hint).map((s) => s.hint.length)), '<=', 60, 'the longest hint');
      t.expect(mission.pays.cash + ' ' + mission.title + ' ' + mission.card.caption, '==', '500 Final Notice One scooter, slightly used.', 'pay, title, caption');
      const page = await t.open(QUIET, SMALL);
      await settle(page); await page.evaluate(WATCH);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test;
        T.mission.start('final-notice'); T.advance(0.5);
        const d0 = T.dialogue(), ui0 = T.missionUi(), s0 = T.mission.state();
        T.advance(60);
        const s1 = T.mission.state(), d1 = T.dialogue();
        const first = g.seen.filter((e) => e.ev === 'dialogue:line').slice(0, 7).map((e) => e.who + ':' + e.hz);
        return { d0, sub: ui0.subtitle, cut: ui0.cutscene, portraits: ui0.portraits, s0: s0.type, s1: s1.type, first, lines: d1.stats.lines, objective: s1.objective, minFont: T.hud().minFont, errors: T.errors() };
      });
      t.expect(r.s0, '==', 'cutscene', 'the opening');
      t.expect(r.cut, '==', true, 'the cutscene stub is up');
      t.expect(r.d0.current && r.d0.current.name + ': ' + r.d0.current.text, '==', 'Marco: Thirty days. Says so right there. I just staple.', 'the first line');
      t.expect(r.d0.hz.mags + ' ' + r.d0.hz.teo, '==', '180 260', 'the leads\' blips (Hz)');
      t.expect(r.first.join(' '), '==', 'marco:140 teo:260 marco:140 teo:260 mags:180 teo:260 mags:180', 'who spoke, at what pitch');
      t.expect(!!r.sub && r.sub.who, '==', 'marco', 'the subtitle on the HUD');
      t.expect(r.sub && r.sub.face, '>=', 36, 'its portrait (px)');
      t.expect(r.sub && r.sub.px, '>=', 14, 'its text (px)');
      t.expect(r.portraits.includes('marco'), '==', true, 'a portrait was drawn for the speaker');
      t.expect(r.s1, '==', 'enter', 'the cutscene ended by itself after its lines');
      t.expect(r.objective, '==', 'Get in the Heron.', 'the objective then');
      t.expect(r.errors.length, '==', 0, 'errors');
    },
  },
  {
    id: 'D6-S1.cup', name: 'The Getaway Cup (day 6 only): mission 1 against the clock, the best run kept and replayed as a ghost',
    async run(t) {
      const page = await t.open(QUIET + '&day=6', SMALL);
      await settle(page); await page.evaluate(WATCH);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test;
        const c0 = T.cup(), id = g.modules.drops.id;
        const ok = T.cup.begin(); T.advance(0.3);
        const s0 = T.mission.state(), ui0 = T.missionUi();
        T.mission.skipStep(); await T.wait(3); const rec = T.cup().recorded;        // three seconds in the Heron are recorded
        for (let i = 0; i < 4; i++) T.mission.skipStep();
        T.advance(0.3); const c1 = T.cup(), cash1 = g.state.economy.cash, done = g.seen.filter((e) => e.ev === 'mission:completed');
        T.mission.dismiss();
        T.cup.begin(); T.mission.skipStep(); await T.wait(1.5);
        const c2 = T.cup(), s2 = T.mission.state();
        await T.wait(1.0); const c3 = T.cup();
        for (let i = 0; i < 4; i++) T.mission.skipStep();
        return { day: g.state.build.day, id, c0, ok, s0: { mode: s0.mode, type: s0.type }, clock: ui0.clock, rec, c1, cash1, mode: done[0] && done[0].mode, c2, c3, s2: s2.mode, cash2: g.state.economy.cash, errors: T.errors() };
      });
      t.expect(r.id, '==', 'getaway-cup', 'the day 6 drop');
      t.expect(r.c0.best, '==', null, 'no time set at first');
      t.expect(r.ok, '==', true, 'the cup starts');
      t.expect(r.s0.mode + ' ' + r.s0.type, '==', 'cup enter', 'mission 1 in cup mode, from getting in the Heron');
      t.expect(r.clock, '>', 0, 'the running clock is on the HUD (seconds)');
      t.expect(r.rec, '>=', 10, 'samples of the run recorded');
      t.expect(r.mode, '==', 'cup', 'mission:completed says it was a cup run');
      t.expect(r.c1.best, '>', 3, 'the best time is kept (seconds)');
      t.expect(r.c1.label.startsWith('The Getaway Cup · best 0:0'), '==', true, 'the drop line shows it');
      t.expect(r.c2.ghost.on, '==', true, 'the second run has the ghost of the first');
      t.expect(Math.hypot(r.c3.ghost.x - r.c2.ghost.x, r.c3.ghost.z - r.c2.ghost.z) >= 0, '==', true, 'the ghost has a place');
      t.expect(r.cash2 - r.cash1, '==', 0, 'a second run does not pay again');
      // the drop module runs the one file whose `day` is the build day (a ?day=5 page does not load in this harness: see the note)
      t.expect(/day: 6, id: 'getaway-cup'/.test(readFileSync('src/content/drops/day-6.js', 'utf8')), '==', true, 'the drop file is marked day 6 only');
      t.expect(r.day, '==', 6, 'the build day of this page');
      t.expect(r.errors.length, '==', 0, 'errors');
    },
  },
  {
    id: 'D6-S1.clip', name: 'The clip (?clip=day-6): the ram, the scooter falls, the postcard stamps',
    async run(t) {
      const page = await t.open('&hour=18.7', SMALL);
      await settle(page); await page.evaluate(WATCH);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, t0 = g.loop.time;
        T.clip.play('day-6');
        for (let i = 0; i < 40 && !g.seen.some((e) => e.ev === 'mission:completed'); i++) await T.wait(0.25);
        const tDone = g.loop.time - t0, ram = g.seen.find((e) => e.ev === 'mission:ram'), s = T.mission.state();
        for (let i = 0; i < 24 && !g.seen.some((e) => e.ev === 'mission:stamped'); i++) await new Promise((res) => setTimeout(res, 250));
        const card = T.missionUi().card;
        return { tDone, ram, scooter: s.actors.find((a) => a.name === 'scooter'), truck: s.actors.find((a) => a.name === 'truck'), card, cash: g.state.economy.cash, stats: T.stats(), errors: T.errors() };
      });
      t.expect(!!r.ram && r.ram.n, '==', 3, 'the third ram landed for real');
      t.expect(r.ram && r.ram.kmh, '>=', 15, 'its closing speed (km/h)');
      t.expect(r.ram && Math.abs(r.ram.x), '<', 60, 'in front of the plaza (metres from x = 0)');
      t.expect(!!r.scooter, '==', true, 'the scooter fell off the hook');
      t.expect(r.truck && r.truck.carrying, '==', false, 'the hook is empty');
      t.expect(r.tDone, '<', 9, 'the cut to the card (seconds into the clip)');
      t.expect(r.card.open && r.card.stamped && r.card.stamp, '==', 'Delivered', 'the postcard is up and stamped');
      t.expect(r.cash, '==', 500, 'cash');
      t.expect(r.errors.length, '==', 0, 'errors');
    },
  },
];
