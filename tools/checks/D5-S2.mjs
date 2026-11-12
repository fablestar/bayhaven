// Session D5-S2 (Heat 4 and 5): D5.2 (the helicopter) and D5.8 (load at heat 5) from plan/08-roadmap.md,
// and one check per item on the session's list.
import { TABLE } from '../../src/core/quality.js';
const QUIET = '&quality=low&traffic=0&peds=0';
const SMALL = { viewport: { width: 960, height: 540 } };
const settle = (page, ms = 500) => page.waitForTimeout(ms);

export default [
  {
    id: 'D5.2', name: 'Live: at heat 3 heat:live fires, chat lines appear and the news helicopter exists, arrives inside 8 s and lights you at night',
    async run(t) {
      const page = await t.open(QUIET + '&hour=22', SMALL);
      await settle(page);
      await page.evaluate(() => { const g = window.__game; g.liveSeen = []; g.arrived = []; g.events.on('heat:live', (e) => g.liveSeen.push(e.viewers)); g.events.on('chopper:arrived', (e) => g.arrived.push(e)); g.test.setHeat(3); g.test.advance(9); });
      await page.waitForTimeout(1500);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, c = T.chopper(), p = T.player();
        return { liveSeen: g.liveSeen, arrived: g.arrived, live: T.live(), c, heat: T.heat(), module: !!g.modules.chopper, discD: Math.hypot(c.disc.x - p.x, c.disc.z - p.z), stats: T.stats(), errors: T.errors() };
      });
      const h = r.c.list[0] || {};
      t.expect(r.liveSeen.length, '>=', 1, 'heat:live events');
      t.expect(r.live.shown, '>=', 3, 'chat lines shown');
      t.expect(r.module && r.c.count, '==', 1, 'helicopters in the sky at heat 3');
      t.expect(r.arrived.length, '>=', 1, 'chopper:arrived events');
      t.expect(r.arrived[0] ? r.arrived[0].seconds : 99, '<=', 8, 'seconds from heat 3 to the helicopter on the scene');
      t.expect(h.y, '>=', 45, 'metres up');
      t.expect(h.d, '<=', 90, 'metres out from the player (the rule is 45)');
      t.expect(r.c.disc.opacity, '>=', 0.4, 'the spotlight disc at night (opacity)');
      t.expect(r.discD, '<=', 7, 'metres from the disc to a player standing still');
      t.expect(r.heat.seen, '==', true, 'the disc on you is a camera: seen with no deputy near');
      t.expect(r.c.stats.gain, '>', 0.05, 'the rotor is heard (gain)');
      t.expect(r.c.calls, '<=', 4, 'draw calls for one helicopter, its disc and beam');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`helicopter on the scene ${r.arrived[0] ? r.arrived[0].seconds.toFixed(1) : '?'} s after heat 3, ${h.y.toFixed(0)} m up and ${h.d.toFixed(0)} m out, state ${h.state}; disc ${r.discD.toFixed(1)} m from the player, opacity ${r.c.disc.opacity.toFixed(2)}; rotor gain ${r.c.stats.gain.toFixed(2)}; ${r.c.calls} draw calls, ${r.c.triangles} triangles; frame ${r.stats.calls} calls, ${r.stats.tris} triangles`);
    },
  },
  {
    id: 'D5-S2.1', name: 'The spotlight trails by 0.4 s: flat out you leave the disc, and by day it is faint; the helicopter sweeps where you were last seen',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test;
        T.teleport(-900, 40.5, Math.PI / 2, 0); T.setHeat(3);
        let secs = 0; while (secs < 12 && !T.chopper().onScene) { T.advance(0.25); secs += 0.25; }
        T.advance(4);
        const still = { seen: T.heat().seen, sees: T.chopper().list[0].sees };
        g.modules.cops.numbers.want[3] = 0; T.cops.clear();            // an empty road for the run: no cruiser in the way, none watching
        T.input([{ t: 0, hold: ['gas'] }, { t: 20, hold: [] }]);
        T.advance(8);
        const p = T.player(), c = T.chopper(), fast = { kmh: p.kmh, discBehind: Math.hypot(c.disc.x - p.x, c.disc.z - p.z), sees: c.list[0].sees, state: c.list[0].state, d: c.list[0].d, tracking: c.tracking };
        T.advance(9);
        const shaken = { state: T.chopper().list[0].state, tracking: T.chopper().tracking, kmh: T.player().kmh, dark: T.chopper().darkT };
        // far away and unseen: it stays to sweep the last place
        T.teleport(900, 40.5, Math.PI / 2, 0); T.advance(8);
        const c2 = T.chopper(), h = T.heat();
        return { secs, still, fast, shaken, lost: { state: c2.list[0].state, fromLast: Math.hypot(c2.list[0].x - c2.spot.x, c2.list[0].z - c2.spot.z), seen: h.seen, d: c2.list[0].d }, errors: T.errors() };
      });
      t.expect(r.still.sees, '==', true, 'standing still under it: the disc is on you');
      t.expect(r.fast.kmh, '>=', 90, 'km/h in the fast run');
      t.expect(r.fast.discBehind, '>=', 8.5, 'metres the disc trails a car flat out (speed x 0.4 s)');
      t.expect(r.fast.sees, '==', false, 'flat out the disc is not on you');
      t.expect(r.fast.d, '<=', 140, 'metres from the helicopter to the car after 8 s flat out (it keeps up)');
      t.expect(r.fast.tracking, '==', true, 'it still has the car after 8 s out of its light');
      t.expect(r.shaken.tracking, '==', false, 'out of its light for more than 12 s with no deputy watching: it has lost the car');
      t.expect(r.lost.state, '==', 'search', 'unseen for 3 s: the helicopter searches');
      t.expect(r.lost.fromLast, '<=', 120, 'metres from the helicopter to the last place it had the player');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`still: seen ${r.still.seen}; at ${r.fast.kmh.toFixed(0)} km/h the disc is ${r.fast.discBehind.toFixed(1)} m behind and the helicopter ${r.fast.d.toFixed(0)} m off; ${r.shaken.dark.toFixed(1)} s out of the light it is ${r.shaken.state}; after a teleport it is ${r.lost.state}, ${r.lost.fromLast.toFixed(0)} m from the last seen point and ${r.lost.d.toFixed(0)} m from the player`);
    },
  },
  {
    id: 'D5-S2.2', name: 'Helicopter cam: V moves the view to the helicopter, 35 degrees wide, tagged CHOPPER CAM; V again gives the chase camera back',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      await page.evaluate(() => { const g = window.__game, T = g.test; g.camEvents = []; g.events.on('chopper:cam', (e) => g.camEvents.push(e.on)); T.setHeat(3); });
      await page.keyboard.press('KeyV');
      await settle(page, 300);
      const early = await page.evaluate(() => window.__game.test.chopper().cam);
      await page.evaluate(() => window.__game.test.advance(8));
      await settle(page, 400);
      const before = await page.evaluate(() => ({ c: window.__game.test.chopper(), cam: window.__game.camera.position.y }));
      await page.keyboard.press('KeyV');
      await settle(page, 600);
      const on = await page.evaluate(() => {
        const g = window.__game, c = g.test.chopper(), p = g.test.player(), cam = g.camera, hud = g.modules.hud.canvas, dpr = hud.width / window.innerWidth;
        const fwd = new cam.position.constructor(0, 0, -1).applyQuaternion(cam.quaternion), to = { x: p.x - cam.position.x, y: 1 - cam.position.y, z: p.z - cam.position.z }, l = Math.hypot(to.x, to.y, to.z);
        const px = hud.getContext('2d').getImageData(Math.round((window.innerWidth / 2 - 40) * dpr), Math.round(80 * dpr), 1, 1).data;
        return { c, y: cam.position.y, fov: cam.fov, aim: (fwd.x * to.x + fwd.y * to.y + fwd.z * to.z) / l, tagPixel: [...px], active: g.modules.chopper.active, chat: g.modules.live.rows.map((q) => q.user + ': ' + q.text) };
      });
      await page.keyboard.press('KeyV');
      await settle(page, 600);
      const off = await page.evaluate(() => { const g = window.__game; return { c: g.test.chopper(), y: g.camera.position.y, fov: g.camera.fov, events: g.camEvents, errors: g.test.errors() }; });
      t.expect(early, '==', false, 'V before the helicopter is on the scene does nothing');
      t.expect(on.active, '==', true, 'modules.chopper.active after V');
      t.expect(on.y, '>=', 40, 'the camera\'s height in the helicopter view (metres)');
      t.expect(Math.abs(on.fov - 35), '<=', 0.1, 'field of view is 35 degrees');
      t.expect(on.aim, '>=', 0.99, 'the camera looks at the player (cosine)');
      t.expect(on.c.tag, '==', true, 'the CHOPPER CAM tag is painted on the HUD');
      t.expect(on.tagPixel[0] > 200 && on.tagPixel[3] > 150, '==', true, 'a red pixel inside the tag on the HUD canvas');
      t.expect(on.c.button.includes('CHOPPER CAM'), '==', true, 'the on-screen button reads CHOPPER CAM');
      t.expect(off.c.cam, '==', false, 'V again: off');
      t.expect(off.y, '<=', 12, 'the chase camera is back (height)');
      t.expect(off.fov, '>=', 55, 'the chase field of view is back');
      t.expect(off.events.join(','), '==', 'true,false', 'chopper:cam events');
      t.expect(off.errors.length, '==', 0, 'errors');
      t.note(`chase camera at ${before.cam.toFixed(1)} m; chopper cam at ${on.y.toFixed(0)} m, ${on.fov} degrees, aim ${on.aim.toFixed(3)}; chat: ${on.chat.slice(-3).join(' | ')}`);
    },
  },
  {
    id: 'D5-S2.3', name: 'Heat 4: SUVs and tactical vans come, never over the cap, the radio is told, and a roadblock lands 160 to 400 m ahead on Coral Boulevard',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, blocks = [], casts = [], lifted = [];
        g.events.on('heat:roadblock', (e) => { const p = T.player(); blocks.push({ ...e, ahead: p.z - e.z, off: Math.abs(e.x - 52), t: secs }); });
        g.events.on('heat:broadcast', (e) => casts.push(e));
        g.events.on('heat:roadblock:lifted', (e) => lifted.push(e.why));
        let secs = 0, maxCops = 0, top = 0; const kinds = { cruiser: 0, suv: 0, van: 0 };
        T.teleport(56, -150, Math.PI, 20); await T.ensure(56, -400, 2);
        T.setHeat(4);
        // north on the boulevard at about 80 km/h, held there by the script
        T.input((a) => { const k = Math.abs(T.player().kmh); a.gas = k < 78 ? 1 : 0; a.brake = k > 86 ? 0.5 : 0; a.steer = 0; return secs >= 30; });
        const first = { x: 0, units: [] };
        while (secs < 30) {
          T.advance(0.5); secs += 0.5;
          const h = T.heavy(); maxCops = Math.max(maxCops, T.stats().cops); top = Math.max(top, Math.abs(T.player().kmh));
          for (const k in kinds) kinds[k] = Math.max(kinds[k], h.counts[k]);
          if (h.roadblocks.up.length && !first.units.length) Object.assign(first, h.roadblocks.up[0]);
        }
        const live = T.live();
        return { blocks, casts, lifted, maxCops, top, kinds, first, cap: T.heavy().cap, plan: T.heavy().plan, heat: T.heat().level, rb: T.heavy().roadblocks, rows: live.lines, ticker: T.heavy().tickerRows, shown: live.shown, errors: T.errors() };
      });
      const b = r.blocks[0] || {};
      t.expect(r.blocks.length, '>=', 1, 'heat:roadblock events in 30 s');
      t.expect(b.ahead, '>=', 160, 'metres ahead of the player when it went up');
      t.expect(b.ahead, '<=', 400, 'metres ahead of the player when it went up (upper limit)');
      t.expect(['avenue', 'boulevard'].includes(b.kind), '==', true, 'on an avenue or bigger');
      t.expect(b.off, '<=', 1, 'metres from the boulevard\'s centre line');
      t.expect(r.first.units.length, '==', 2, 'vehicles standing in the roadblock');
      t.expect(r.kinds.suv, '>=', 1, 'Sheriff SUVs seen during the run');
      t.expect(r.kinds.van, '>=', 1, 'tactical vans seen during the run');
      t.expect(r.maxCops, '<=', r.cap, 'police vehicles never pass the cap');
      t.expect(r.casts.length >= 1 && r.casts[0].on === true, '==', true, 'heat:broadcast { on: true } at heat 4');
      t.expect(r.rows, '>=', 87, 'chat rows the overlay can pick from (67 and 20 more)');
      t.expect(r.ticker, '>=', 28, 'ticker lines (18 and 10 more)');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`roadblock ${b.ahead && b.ahead.toFixed(0)} m ahead on ${b.road} (${b.kind}, ${b.width} m wide) ${b.t} s in; ${r.blocks.length} in 30 s, lifted: ${r.lifted.join(', ') || 'none'}; most units ${r.maxCops} of ${r.cap}; kinds seen ${JSON.stringify(r.kinds)}; plan ${JSON.stringify(r.plan)}; top ${r.top.toFixed(0)} km/h; heat at the end ${r.heat}; tyres burst ${r.rb.bursts}`);
    },
  },
  {
    id: 'D5-S2.4', name: 'Spike strips: a tyre that crosses above 10 km/h bursts (grip 0.3 on that corner, sparks); a car in the air and a crawl are untouched',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, bursts = [];
        g.events.on('tyre:burst', (e) => bursts.push(e));
        T.teleport(56, -150, Math.PI, 20); await T.ensure(56, -400, 2);
        T.setHeat(4); g.modules.heat.hold = true;
        g.modules.heat.hold = false; const made = T.roadblock.force(); g.modules.heat.hold = true;
        const up = T.heavy().roadblocks.up[0];
        if (!up) return { made, why: T.heavy().roadblocks.why, errors: T.errors() };
        const s = up.strip;
        // a crawl: 6 km/h over the strip
        T.teleport(s.x, s.z + 3, Math.PI, 1.6); T.advance(3);
        const crawl = { bursts: bursts.length, z: T.player().z };
        // 54 km/h over it
        const sparks0 = g.modules.fx.count('sparks');
        T.teleport(s.x, s.z + 12, Math.PI, 15); T.advance(1.2);
        const tyres = T.heavy().tyres, after = bursts.length;
        T.input([{ t: 0, hold: ['gas'] }, { t: 2, hold: [] }]); T.advance(1);
        const sparks = g.modules.fx.count('sparks');
        // grip: the same corner, with and without the tyres
        const turn = () => { T.teleport(-900, 40.5, Math.PI / 2, 20); T.input([{ t: 0, hold: ['gas', 'left'] }, { t: 1.5, hold: [] }]); T.advance(1.5); return T.player(); };
        const flat = turn();
        g.modules.copsheavy.roadblocks.mend();
        const whole = turn();
        return { made, up, crawl, after, tyres, bursts, sparks: sparks - sparks0, flat: { h: flat.h, slip: flat.slip }, whole: { h: whole.h, slip: whole.slip }, mended: T.heavy().tyres, errors: T.errors() };
      });
      t.expect(!!r.up, '==', true, 'a roadblock was placed (' + (r.why || '') + ')');
      if (!r.up) return;
      t.expect(r.up.strip.len, '>=', 7, 'the strip\'s length in metres');
      t.expect(r.crawl.bursts, '==', 0, 'tyres burst at 6 km/h');
      t.expect(r.after, '>=', 2, 'tyres burst at 54 km/h');
      t.expect(r.bursts[0].grip, '==', 0.3, 'grip left on a burst corner');
      t.expect(Math.min(r.tyres.f, r.tyres.r), '<=', 0.65, 'the worse axle\'s share of grip');
      t.expect(r.sparks, '>=', 8, 'sparks from the rims');
      t.expect(Math.abs(r.flat.h - r.whole.h), '>=', 0.05, 'radians the same 1.5 s turn differs on burst tyres');
      t.expect(r.mended, '==', null, 'a mended car has its tyres back');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`strip ${r.up.strip.len.toFixed(1)} m; roadblock of ${r.up.units.map((u) => u.kind).join(' and ')} with ${r.up.props} barriers on a ${r.up.width} m road; ${r.after} tyres burst at 54 km/h (corners ${r.tyres.corners.join(' ')}), axle grip front ${r.tyres.f} rear ${r.tyres.r}; ${r.sparks} sparks; the turn: heading ${r.flat.h.toFixed(2)} flat against ${r.whole.h.toFixed(2)} whole`);
    },
  },
  {
    id: 'D5-S2.5', name: 'Heat 5, Hurricane Dale: the show truck comes, every unit up to the cap and never over it; its chat and ticker lines play',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      await page.evaluate(() => { const g = window.__game; g.test.teleport(-300, 40.5, Math.PI / 2, 0); g.test.setHeat(5); });
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, said = new Set();
        let secs = 0, maxCops = 0, full = -1, truckAt = -1;
        const note = () => { for (const row of g.modules.live.rows) said.add(row.text); };
        note();
        while (secs < 60) {
          T.advance(0.5); secs += 0.5; note();
          const h = T.heavy(), n = T.stats().cops; maxCops = Math.max(maxCops, n);
          if (truckAt < 0 && h.counts.truck) truckAt = secs;
          if (full < 0 && n >= h.cap) full = secs;
          if (full >= 0 && secs > full + 6) break;
        }
        const h = T.heavy(), truck = T.cops.list().find((u) => u.kind === 'truck');
        return { secs, maxCops, full, truckAt, h, truck, heat: T.heat(), said: [...said], tickerLines: T.live().tickerLines, horns: h.stats.horns, errors: T.errors() };
      });
      const lines5 = ['HURRICANE DALE', 'the sheriff\'s truck!!!', 'every unit in the county', 'all five sirens', 'dale\'s driving it himself', 'that truck has its own cameras', 'whole county\'s on one road'];
      const heard = r.said.filter((s) => lines5.includes(s));
      t.expect(r.truckAt, '>=', 0, 'the show truck was sent');
      t.expect(r.h.counts.truck, '==', 1, 'show trucks on the street');
      t.expect(r.full, '>=', 0, 'the unit count reached the cap');
      t.expect(r.maxCops, '==', r.h.cap, 'most police vehicles at once is the cap');
      t.expect(r.h.counts.suv >= 1 && r.h.counts.van >= 1 && r.h.counts.cruiser >= 1, '==', true, 'cruisers, SUVs and vans are all there');
      t.expect(heard.length, '>=', 2, 'heat 5 chat lines shown');
      t.expect(r.h.stats.ticker, '>=', 1, 'heat 5 ticker lines this module sent');
      t.expect(r.tickerLines, '>=', 2, 'lines the ticker took (the show\'s opening and the step to heat 5)');
      t.expect(r.h.broadcast, '==', true, 'the broadcast flag is on');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`truck sent after ${r.truckAt} s, cap (${r.h.cap}) reached after ${r.full} s; counts ${JSON.stringify(r.h.counts)}; truck ${r.truck ? r.truck.d.toFixed(0) + ' m off, ' + r.truck.role + '/' + r.truck.state : 'gone'}; horn played ${r.horns} times; chat: ${heard.join(' | ')}; ticker lines taken ${r.tickerLines}`);
    },
  },
  {
    id: 'D5-S2.6', name: 'The drop: the red button in the plaza starts heat 5 and the sign keeps your peak viewers (build day 5 only)',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, d = g.modules.drops, a = d.active;
        if (!a || !a.score) return { id: d.id, errors: T.errors() };
        const at = { x: a.score.x, z: a.score.z }, blocked = g.modules.collide.blocked(at.x, 1, at.z + 2.5, 0.4), surface = g.modules.map.surfaceAt(at.x, at.z);
        T.exit(); T.advance(1.2);
        T.teleport(at.x, at.z + 4.5, Math.PI, 0); T.advance(0.3);
        const before = T.heat().level;
        T.input([{ t: 0, hold: ['gas'] }, { t: 4, hold: [] }]);
        // the drop is stepped when a frame is drawn, so walk, then let frames go by
        let secs = 0; while (secs < 4) { T.advance(0.1); secs += 0.1; }
        await new Promise((res) => setTimeout(res, 1200));
        const pressed = { level: T.heat().level, secs, presses: a.score.presses, d: Math.hypot(T.player().x - at.x, T.player().z - at.z) };
        g.modules.heat.hold = true; T.advance(6); g.modules.heat.hold = false;
        await new Promise((res) => setTimeout(res, 700));
        const live = { viewers: T.heat().viewers, shown: a.score.live, drop: a.label };
        T.teleport(-1000, 40.5, Math.PI / 2); await T.ensure(-1000, 40.5, 1);
        let wait = 0; while (wait < 90 && T.heat().level > 0) { T.advance(0.5); wait += 0.5; }
        await new Promise((res) => setTimeout(res, 2500));
        return { id: d.id, at, blocked, surface, before, pressed, live, wait, score: { ...a.score }, armed: a.armed, drop: a.label, calls: a.calls, errors: T.errors() };
      });
      t.expect(r.id, '==', 'bayhaven-blue-pilot', 'the drop running on build day 5');
      if (!r.at) return;
      t.expect(r.surface !== 'road' && !r.blocked, '==', true, 'the button stands on paving with room in front of it');
      t.expect(r.before, '==', 0, 'heat before the button');
      t.expect(r.pressed.level, '==', 5, 'heat after walking into the button');
      t.expect(r.pressed.presses, '==', 1, 'presses counted');
      t.expect(r.live.shown, '>=', 200000, 'viewers the sign is showing while on air');
      t.expect(r.score.best, '>=', 200000, 'peak viewers recorded when the episode ends');
      t.expect(/[Pp]eak viewers \d/.test(r.drop || ''), '==', true, 'the HUD\'s drop line shows the peak');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`button at (${r.at.x.toFixed(0)}, ${r.at.z.toFixed(0)}) on ${r.surface}; walked to ${r.pressed.d.toFixed(1)} m from it; peak ${r.score.best.toLocaleString('en-US')}; cleared ${r.wait} s after hiding 1 km away; HUD: "${r.drop}"; ${r.calls} draw calls`);
    },
  },
  {
    id: 'D5.8', name: 'Load: the budgets (G3) hold at heat 5 with the full unit cap around the player', quality: ['low', 'high'],
    async run(t) {
      const page = await t.open('&quality=' + t.quality + '&hour=21', SMALL), i = t.quality === 'low' ? 0 : 2;
      const cal = await (await import('../check-lib.mjs')).calibrate(page);
      await page.evaluate(() => { const T = window.__game.test; T.teleport(-24, 40.5, Math.PI / 2, 0); T.setHeat(5); });
      // game time is stepped until every unit is there (a headless page draws too slowly to wait for them in real time)
      const cap = TABLE.copCap[i];
      const waited = await page.evaluate((n) => { const T = window.__game.test; let s = 0; while (s < 90 && T.stats().cops < n) { T.advance(0.5); s += 0.5; } T.advance(4); return s; }, cap);
      await page.waitForTimeout(2500);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test; await T.wait(1.5);
        const s = T.stats(), list = T.cops.list();
        return { ...s, h: T.heavy(), chopper: T.chopper(), near: list.filter((u) => u.d < 120).length, heat: T.heat().level, copCalls: T.cops.stats().calls, errors: T.errors() };
      });
      t.expect(r.heat, '==', 5, 'heat while measuring');
      t.expect(r.cops, '==', cap, 'police vehicles (the cap)');
      t.expect(r.calls, '<=', TABLE.maxCalls[i], 'draw calls');
      t.expect(r.tris, '<=', TABLE.maxTris[i], 'triangles');
      t.expect(r.simMs, '<=', TABLE.maxSimMs[i] * cal.k, `simMs (times k ${cal.k.toFixed(2)})`);
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`${t.quality}: ${r.cops} units after ${waited} s (${JSON.stringify(r.h.counts)}), ${r.near} within 120 m, ${r.chopper.count} helicopters; ${r.calls} draw calls, ${r.tris} triangles, simMs ${r.simMs.toFixed(2)}; heavy bodywork ${r.h.calls} calls and ${r.h.triangles} triangles, cruiser extras ${r.copCalls} calls, helicopters ${r.chopper.calls} calls and ${r.chopper.triangles} triangles`);
    },
  },
];
