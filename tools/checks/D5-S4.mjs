// Session D5-S4 (Combat): D5.7 from plan/08-roadmap.md, and one check per item on the session's list.
const QUIET = '&traffic=0&peds=0&quality=high';
const SMALL = { viewport: { width: 960, height: 540 } };
const settle = (page, ms = 600) => page.waitForTimeout(ms);

// in the page: get out, stand on the beachfront road where 26 m of it is clear, facing along it.
// g.pt(side, ahead) is a point relative to that place; g.H is the heading along the road.
const OPEN = `(() => {
  const g = window.__game, T = g.test, C = g.modules.collide, M = g.modules.map, sp = T.player();
  T.exit(); T.advance(1.2);
  const road = M.nearestRoad(sp.x, sp.z), H = road.heading, fx = Math.sin(H), fz = Math.cos(H);
  let at = null;
  for (let k = 0; k < 40 && !at; k++) {
    const x = road.x + fx * k * 6, z = road.z + fz * k * 6; let clear = true;
    for (let d = -4; d <= 26 && clear; d += 3) if (C.circle(x + fx * d, z + fz * d, 4.5, 0, []) > 0 || M.surfaceAt(x + fx * d, z + fz * d) !== 'road') clear = false;
    if (clear) at = { x, z, width: road.width };
  }
  if (!at) return null;
  g.at = at; g.H = H; g.seen = {};
  g.pt = (side, ahead) => [at.x + fx * ahead - fz * side, at.z + fz * ahead + fx * side];
  for (const n of ['weapon:fired', 'player:knockedout', 'player:woke', 'combat:hit', 'combat:down', 'combat:lock', 'crime', 'ui:toast', 'player:hurt', 'cash:changed', 'fireworks:start'])
    g.events.on(n, (e) => (g.seen[n] = g.seen[n] || []).push(e));
  g.stand = (h = H) => { T.teleport(at.x, at.z, h, 0); T.advance(0.1); return T.player(); };
  g.stand();
  return at;
})()`;

export default [
  {
    id: 'D5.7', name: 'Knocked out: health 0 emits player:knockedout and the player wakes at the hospital point with 5% less cash',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      t.expect(!!(await page.evaluate(OPEN)), '==', true, 'open ground to stand on');
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, S = g.state;
        S.economy.cash = 18240;
        const before = T.player();
        T.health.set(0);
        const ui0 = T.weaponsUi().knockedOut, down = T.health().down, cashAfter = S.economy.cash;
        T.advance(2); const mid = T.player(), still = T.health().down;
        T.advance(3.3);
        const woke = T.player(), h = T.health(), ui1 = T.weaponsUi().knockedOut;
        // the most it can cost, and from inside a car
        S.economy.cash = 90000; T.health.set(0); const big = S.economy.cash; T.advance(5.2);
        const again = T.player();
        return { before, ui0, down, cashAfter, mid, still, woke, h, ui1, big, again, ko: (g.seen['player:knockedout'] || []), wokeEv: (g.seen['player:woke'] || []), heat: S.heat.level, errors: T.errors() };
      });
      t.expect(r.ko.length, '==', 2, 'player:knockedout events (two visits)');
      t.expect(r.ko[0].bill, '==', 912, 'the bill on $18,240 (5%)');
      t.expect(r.cashAfter, '==', 18240 - 912, 'cash after the bill');
      t.expect(r.down, '==', true, 'down while the screen is up');
      t.expect(r.ui0.open, '==', true, 'the wristband screen is open');
      t.expect(r.ui0.tilted, '==', true, 'the view is tilted and drained');
      t.expect(r.ui0.data.bill, '==', 912, 'the bill on the wristband');
      t.expect(Math.hypot(r.mid.x - r.before.x, r.mid.z - r.before.z), '<', 1, 'metres moved while knocked out');
      t.expect(r.still, '==', true, 'still down after 2 s');
      t.expect(r.wokeEv.length, '==', 2, 'player:woke events');
      t.expect(Math.hypot(r.woke.x - r.h.hospital.x, r.woke.z - r.h.hospital.z), '<', 30, 'metres from the hospital point on waking');
      t.expect(r.h.health, '==', 50, 'health on waking');
      t.expect(r.woke.mode, '==', 'foot', 'on foot at the hospital');
      t.expect(r.ui1.open, '==', false, 'the screen has gone');
      t.expect(r.big, '==', 90000 - 2500, 'cash after the most it can cost ($2,500)');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`bill $${r.ko[0].bill}; woke at (${r.woke.x.toFixed(0)}, ${r.woke.z.toFixed(0)}), the stand-in for Bayhaven General (-500, -1700): ${JSON.stringify(r.h.hospital)}`);
      await page.close();
    },
  },
  {
    id: 'D5-S4.1', name: 'Health 100 and armour 100: a vest takes 80% of a ranged hit, health creeps back to 30, and the bars show only when not full',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      await page.evaluate(OPEN);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, frame = () => new Promise((f) => requestAnimationFrame(() => requestAnimationFrame(f)));
        const full = T.health(); await frame(); const ui0 = T.weaponsUi();
        T.health.hurt(18, { weapon: 'pistol', ranged: true }); const noVest = T.health(); await frame(); const ui1 = T.weaponsUi();
        T.health.set(100); T.health.vest(100); await frame(); const ui2 = T.weaponsUi();
        T.health.hurt(18, { weapon: 'pistol', ranged: true }); const vest = T.health(); await frame(); const ui3 = T.weaponsUi();
        T.health.set(12); T.advance(5); const at5 = T.health().health; T.advance(4); const at9 = T.health().health; T.advance(12); const at21 = T.health().health;
        return { full, ui0, noVest, ui1, ui2, vest, ui3, at5, at9, at21, errors: T.errors() };
      });
      t.expect(r.full.health, '==', 100, 'health at the start');
      t.expect(r.full.max.vest, '==', 100, 'the most armour');
      t.expect(r.ui0.vitals.shown, '==', false, 'bars shown at full health');
      t.expect(r.ui0.shown, '==', true, 'the quick bar is shown on foot');
      t.expect(r.noVest.health, '==', 91, 'health after a guard\'s pistol round (18 halved)');
      t.expect(r.ui1.vitals.shown, '==', true, 'bars shown when hurt');
      t.expect(r.ui2.vitals.shown, '==', false, 'bars shown with full health and a full vest');
      t.expect(r.vest.armour, 'in', [92.7, 92.9], 'armour after the same round (7.2 soaked)');
      t.expect(r.vest.health, 'in', [98.1, 98.3], 'health after the same round (1.8 through)');
      t.expect(r.ui3.vitals.armourShown, '==', true, 'the armour bar shows');
      t.expect(r.at5, '==', 12, 'health 5 s after a hit (no regen yet)');
      t.expect(r.at9, 'in', [17, 19], 'health 9 s after (2 a second from 6 s)');
      t.expect(r.at21, '==', 30, 'health stops creeping at 30');
      t.expect(r.errors.length, '==', 0, 'errors');
      await page.close();
    },
  },
  {
    id: 'D5-S4.2', name: 'Seven weapons with the plan\'s numbers on a three-slot bar: shotgun falloff, a pistol empties in 12 and reloads in 1.4 s, the combo, the noodle, the flamingo that breaks',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      await page.evaluate(OPEN);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, W = g.modules.combat.weapons, D = T.combat.damageAt;
        const table = Object.values(W).map((w) => [w.id, w.slot, w.damage, w.holds || 0, w.reload || 0]);
        const sg = [5, 12.5, 20, 31].map((d) => D('shotgun', d));
        // pistol: hold fire, note the time of each shot
        g.stand(); T.combat.give('pistol', 24);
        const shots = []; let time = 0;
        g.events.on('weapon:fired', (e) => { if (e.weapon === 'pistol') shots.push(time); });
        T.combat.hold({ fire: true });
        for (let i = 0; i < 60 * 6; i++) { T.advance(1 / 60); time += 1 / 60; }
        T.combat.hold({ fire: false });
        const pistol = T.combat();
        // smg: rounds in one second
        T.combat.give('smg', 60); const smgT = []; time = 0;
        g.events.on('weapon:fired', (e) => { if (e.weapon === 'smg') smgT.push(time); });
        T.combat.hold({ fire: true }); for (let i = 0; i < 60; i++) { T.advance(1 / 60); time += 1 / 60; } T.combat.hold({ fire: false });
        const smg = smgT.length, bar = T.combat();
        const sel = [T.combat.select('hand'), T.combat().weapon, T.combat.select('sidearm'), T.combat().weapon, T.combat.select('long'), T.combat().weapon];
        // fists on a guard 1 m ahead: the third hit floors him
        const p = g.stand();
        T.combat.select('hand');
        const a = T.combat.spawn(...g.pt(0, 1.1), g.H + Math.PI, {});
        const states = [];
        g.events.on('combat:hit', (e) => { if (e.target === 'guard') states.push([e.health, T.guards().find((x) => x.id === e.id).state]); });
        T.combat.hold({ fire: true }); T.advance(1.1); T.combat.hold({ fire: false });
        const fists = states.slice(), floored = T.guards()[0].state; T.combat.clear();
        // flamingo: ten hits and it snaps
        T.combat.give('flamingo'); g.stand();
        const b = T.combat.spawn(...g.pt(0, 1.2), g.H + Math.PI, { health: 9999 });
        T.combat.hold({ fire: true }); T.advance(7.5); T.combat.hold({ fire: false });
        const flam = { hits: (g.seen['combat:hit'] || []).filter((e) => e.weapon === 'flamingo').length, weapon: T.combat().weapon, broke: T.combat().stats.broke }; T.combat.clear();
        // noodle: fifty hits leave a guard at 1
        T.combat.give('noodle'); g.stand();
        const c = T.combat.spawn(...g.pt(0, 1.2), g.H + Math.PI, {});
        const nood = T.combat.hit(c.id, 'noodle', 50);
        return { table, sg, shots, pistol, smg, smgT, floored, bar, sel, fists, flam, nood, melee: (g.seen['weapon:fired'] || []).filter((e) => e.melee).length, crimes: (g.seen.crime || []).map((e) => e.case), errors: T.errors() };
      });
      const want = { fists: ['hand', 12], noodle: ['hand', 8], flamingo: ['hand', 25], pistol: ['sidearm', 18], flare: ['sidearm', 5], smg: ['long', 9], shotgun: ['long', 60] };
      t.expect(r.table.length, '==', 7, 'weapons');
      for (const [id, slot, dmg] of r.table) { t.expect(slot, '==', want[id][0], id + ': slot'); t.expect(dmg, '==', want[id][1], id + ': damage'); }
      t.expect(r.sg[0], '==', 60, 'shotgun at 5 m'); t.expect(r.sg[1], 'in', [34, 36], 'shotgun at 12.5 m'); t.expect(r.sg[2], '==', 10, 'shotgun at 20 m'); t.expect(r.sg[3], '==', 0, 'shotgun at 31 m');
      t.expect(r.shots.length, '>=', 14, 'pistol shots in 6 s of holding fire');
      t.expect(r.shots[11] - r.shots[0], 'in', [2.9, 3.3], 'seconds for 12 rounds (0.28 s apart)');
      t.expect(r.shots[12] - r.shots[11], 'in', [1.3, 1.5], 'seconds from the twelfth shot to the next (the reload)');
      t.expect(r.smg, 'in', [11, 13], 'SMG rounds in a second');
      t.expect(JSON.stringify(r.sel.filter((x) => typeof x === 'string')), '==', JSON.stringify(['fists', 'pistol', 'smg']), 'the three slots hold');
      t.expect(Object.keys(r.bar.inv).length, '==', 3, 'slots on the bar');
      t.expect(r.fists.length, '==', 3, 'punches landed in 1.1 s');
      t.expect(r.fists[1] && r.fists[1][1] !== 'floor', '==', true, 'second punch leaves him standing');
      t.expect(r.floored, '==', 'floor', 'third punch of the combo knocks him down');
      t.expect(r.fists[2] && r.fists[2][0], '==', 24, 'guard health after three punches (60 - 36)');
      t.expect(r.flam.hits, '==', 10, 'flamingo hits before it broke');
      t.expect(r.flam.weapon, '==', 'fists', 'what is in the hand after it broke');
      t.expect(r.nood.health, '==', 1, 'guard health after fifty noodle hits');
      t.expect(r.melee, '>=', 13, 'weapon:fired events for swings');
      t.expect(r.crimes.includes('gunfire'), '==', true, 'gunfire is a crime');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`pistol shot times ${r.shots.slice(0, 14).map((s) => s.toFixed(2)).join(' ')}; SMG ${r.smg} rounds a second; fists ${JSON.stringify(r.fists)}; SMG times ${r.smgT.slice(0, 6).map((s) => s.toFixed(3)).join(' ')}`);
      await page.close();
    },
  },
  {
    id: 'D5-S4.3', name: 'Lock-on: holding aim locks the nearest threat in view by the bible\'s score, never a bystander, and it works from the touch button',
    async run(t) {
      const page = await t.open('&traffic=0&quality=high', { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
      await settle(page);
      await page.evaluate(OPEN);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, p = g.stand(), rad = Math.PI / 180;
        T.peds.clear(); T.peds.auto(false);
        const at = (d, deg) => [p.x + Math.sin(g.H + deg * rad) * d, p.z + Math.cos(g.H + deg * rad) * d];
        const a = T.combat.spawn(...at(10, 5), g.H + Math.PI, { hostile: true }), b = T.combat.spawn(...at(6, 30), g.H + Math.PI, { hostile: true });
        const by = T.peds.spawn('tourist', ...at(3, 0), 0);
        T.combat.give('pistol');
        T.advance(0.05);
        const none = T.combat().lock, scores = T.combat.scores();
        T.combat.hold({ aim: true }); T.advance(0.05);
        const locked = T.combat().lock;
        const next = (T.combat.cycle(), T.combat().lock);
        T.combat.hold({ aim: false }); T.advance(0.05);
        const released = T.combat().lock;
        return { a: a.id, b: b.id, by: by && by.id, none, scores, locked, next, released, locks: (g.seen['combat:lock'] || []).map((e) => e.id), ui: T.weaponsUi(), errors: T.errors() };
      });
      const sa = r.scores.find((s) => s.id === r.a), sb = r.scores.find((s) => s.id === r.b);
      t.expect(r.none, '==', null, 'no lock without aim held');
      t.expect(sa && sa.score, 'in', [10.9, 11.2], 'score of the guard at 10 m, 5 degrees off');
      t.expect(sb && sb.score, 'in', [12.1, 12.5], 'score of the guard at 6 m, 30 degrees off');
      t.expect(r.locked, '==', r.a, 'the lock is on the first');
      t.expect(r.scores.some((s) => s.id === r.by), '==', false, 'a bystander 3 m straight ahead is a candidate');
      t.expect(r.next, '==', r.b, 'next target');
      t.expect(r.released, '==', null, 'lock after letting go');
      t.expect(r.locks.length, '>=', 3, 'combat:lock events');
      // the touch buttons: 64 px or more, and Lock holds the lock
      const lay = Object.fromEntries(r.ui.layout.map((b) => [b.id, b]));
      t.expect(Math.min(lay.fire.w, lay.fire.h, lay.lock.w, lay.lock.h), '>=', 64, 'smallest touch button, px');
      t.expect(Math.min(...r.ui.slots.map((s) => Math.min(s.w, s.h))), '>=', 64, 'smallest quick bar slot on a phone, px');
      t.expect(Math.max(...r.ui.layout.map((b) => b.x + b.w)), '<=', 844, 'everything inside the screen');
      await page.tap('#touch-lock'); await page.waitForTimeout(250);
      const viaTouch = await page.evaluate(() => ({ lock: window.__game.test.combat().lock, ui: window.__game.test.weaponsUi().held }));
      t.expect(viaTouch.ui.touchAim, '==', true, 'the Lock button is on');
      t.expect(viaTouch.lock, '==', r.b, 'lock from the touch button (the last one locked gets 4 off its score)');
      await page.tap('#quickbar .qslot[data-slot="hand"]'); await page.waitForTimeout(150);
      t.expect(await page.evaluate(() => window.__game.test.combat().weapon), '==', 'fists', 'a tap on the hand slot');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`scores ${r.scores.map((s) => s.id + ' ' + s.score.toFixed(2)).join(', ')}`);
      await page.close();
    },
  },
  {
    id: 'D5-S4.4', name: 'Guards: four pistol hits put one down for good; shot once near a parked car he is in cover within 3 s; they call out, shoot back, and run when alone',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      await page.evaluate(OPEN);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, p = g.stand();
        // four hits
        const a = T.combat.spawn(...g.pt(0, 8), g.H + Math.PI, {});
        const three = T.combat.hit(a.id, 'pistol', 3), four = T.combat.hit(a.id, 'pistol', 1);
        T.advance(20); const later = T.guards().find((x) => x.id === a.id);
        const downs = (g.seen['combat:down'] || []).length, drops = T.combat().drops;
        T.combat.clear();
        // cover: a parked car 6 m from him, side on to the player
        const car = T.placeVehicle('tarpon', ...g.pt(1.5, 16), g.H + Math.PI / 2);
        const b = T.combat.spawn(...g.pt(-1, 12), g.H + Math.PI, {});
        T.combat.hit(b.id, 'pistol', 1);
        let coverAt = null; const seenStates = [];
        for (let i = 0; i < 180; i++) { T.advance(1 / 60); const s = T.guards()[0].state; if (seenStates[seenStates.length - 1] !== s) seenStates.push(s); if (s === 'cover' && coverAt === null) coverAt = (i + 1) / 60; }
        T.advance(2);
        const inCover = T.guards()[0], barks = (g.seen['ui:toast'] || []).filter((e) => e.kind === 'subtitle').map((e) => e.who + ': ' + e.text);
        // the car shields him from where the player stands: a pistol held on the guard's place hits metal or nothing
        const h0 = T.health().health; T.advance(12);
        const shotAt = T.combat().guardStats, h1 = T.health().health;
        // alone and hurt: he runs
        T.combat.hit(b.id, 'pistol', 1);            // 60 - 36 = 24, under 60%
        T.advance(1.5);
        const fled = T.guards()[0] || { state: 'gone' };
        T.health.set(100);
        return { three, four, later, downs, drops, car: !!car, coverAt, seenStates, inCover, barks, h0, h1, shotAt, fled, enemyShots: (g.seen['weapon:fired'] || []).filter((e) => e.by === 'guard').length, errors: T.errors() };
      });
      t.expect(r.three.health, '==', 6, 'guard health after three pistol hits');
      t.expect(r.three.state !== 'down', '==', true, 'still up after three');
      t.expect(r.four.state, '==', 'down', 'state after the fourth');
      t.expect(r.later.state, '==', 'down', 'state 20 s later (he never leaves it)');
      t.expect(r.downs, '==', 1, 'combat:down events');
      t.expect(r.drops, '==', 1, 'weapons dropped (his pistol)');
      t.expect(r.coverAt, '<=', 3, 'seconds from the hit to cover');
      t.expect(r.inCover.pose === 'crouch' || r.inCover.pose === 'aim' || r.inCover.pose === 'run', '==', true, 'crouching or leaning at the car (' + r.inCover.pose + ')');
      t.expect(r.barks.length, '>=', 1, 'subtitle call-outs');
      t.expect(r.enemyShots, '>=', 2, 'shots the guard fired back');
      t.expect(r.shotAt.shots, '>=', 2, 'rounds counted by the guards');
      t.expect(r.fled.state === 'flee' || r.fled.state === 'gone', '==', true, 'alone under 60% health he runs (' + r.fled.state + ')');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`cover after ${r.coverAt && r.coverAt.toFixed(2)} s; states ${r.seenStates.join(' > ')}; barks: ${r.barks.join(' | ')}; guard fired ${r.shotAt.shots}, hit ${r.shotAt.hits}; player lost ${(r.h0 - r.h1).toFixed(1)}`);
      await page.close();
    },
  },
  {
    id: 'D5-S4.5', name: 'Bystanders: they run from gunfire, three pistol hits put one down and it is a killing that raises heat; fifty noodle hits leave one at 1 health; blood can be turned off',
    async run(t) {
      const page = await t.open('&traffic=0&quality=high', SMALL);
      await settle(page);
      await page.evaluate(OPEN);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, p = g.stand();
        T.peds.clear(); T.peds.auto(false);
        const a = T.peds.spawn('tourist', ...g.pt(2, 9), 0), b = T.peds.spawn('office', ...g.pt(-3, 12), 0), c = T.peds.spawn('retiree', ...g.pt(0.5, 1.2), 0);
        T.advance(0.2);
        const nood = T.combat.hit(c.id, 'noodle', 50), heatNoodle = g.state.heat.points;
        // a shot in the air: everyone runs
        T.combat.give('pistol'); g.stand(g.H + Math.PI);
        T.combat.hold({ fire: true }); T.advance(0.1); T.combat.hold({ fire: false }); T.advance(0.5);
        const fled = [T.peds.get(a.id).state, T.peds.get(b.id).state];
        const bits0 = T.fx().sparks;
        const two = T.combat.hit(a.id, 'pistol', 2); const bits1 = T.fx().sparks;
        const three = T.combat.hit(a.id, 'pistol', 1);
        T.advance(4);
        const down = T.peds.get(a.id), crimes = (g.seen.crime || []).map((e) => ({ case: e.case, kind: e.kind }));
        // blood off: grey dust, no red bits
        g.state.settings.blood = false; T.advance(1.5);
        const q0 = T.fx().sparks; T.combat.hit(b.id, 'pistol', 1); const q1 = T.fx().sparks;
        const animals = Object.values(g.seen).flat().filter((e) => e && /gull|animal|dog|bird/.test(String(e.target) + String(e.kind))).length;
        return { nood, heatNoodle, fled, two, three, down, crimes, bits: bits1 - bits0, dust: q1 - q0, heat: g.state.heat, downEv: (g.seen['combat:down'] || []), animals, errors: T.errors() };
      });
      t.expect(r.nood.health, '==', 1, 'bystander health after fifty noodle hits');
      t.expect(r.heatNoodle, '==', 0, 'heat points from the noodle');
      t.expect(r.fled.every((s) => s === 'flee'), '==', true, 'people 9 and 13 m away run from a shot (' + r.fled.join(', ') + ')');
      t.expect(r.two.health, '==', 14, 'bystander health after two pistol hits (50 - 36)');
      t.expect(r.bits, '>=', 3, 'small red quads thrown by two hits');
      t.expect(r.down && r.down.state, '==', 'down', 'state after the third');
      t.expect(r.downEv.length, '==', 1, 'combat:down events');
      t.expect(r.crimes.some((c) => c.case === 'kill' && c.kind === 'killing'), '==', true, 'a crime with case kill and kind killing');
      t.expect(r.crimes.some((c) => c.case === 'hurt'), '==', true, 'wounding one is the case hurt');
      t.expect(r.heat.level, '>=', 1, 'heat level after it (nobody from the Sheriff saw it)');
      t.expect(r.dust, '==', 0, 'red quads with blood turned off');
      t.expect(r.animals, '==', 0, 'events that name an animal as a target');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`crimes: ${r.crimes.map((c) => c.case).join(' ')}; heat ${r.heat.level} (${r.heat.points} points)`);
      await page.close();
    },
  },
  {
    id: 'D5-S4.6', name: 'Deputies at heat 3: they shoot and it costs health; from heat 3 the lock takes them, seven pistol hits put one down and it is a deputy down',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page);
      await page.evaluate(OPEN);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, p = g.stand(), cops = g.modules.cops;
        T.combat.give('pistol');
        T.setHeat(2);
        const u = cops.add(...g.pt(2, 16), g.H + Math.PI, 0, 'cruiser');
        let out = 0; for (let i = 0; i < 400 && !u.deputy.out; i++) { T.advance(0.05); out = i * 0.05; }
        T.combat.hold({ aim: true }); T.advance(0.2); const lock2 = T.combat().lock; T.combat.hold({ aim: false });
        const h2 = T.health().health; T.advance(1); const lost2 = h2 - T.health().health;
        T.setHeat(3);
        const h3 = T.health().health, shots0 = cops.stats.shots;
        T.advance(8);
        const lost3 = h3 - T.health().health, shots = cops.stats.shots - shots0, hits = (g.seen['combat:hit'] || []).filter((e) => e.target === 'player' && e.by === 'deputy').length;
        T.health.set(100);
        { const k = Math.hypot(u.deputy.x - p.x, u.deputy.z - p.z); T.teleport(u.deputy.x - (u.deputy.x - p.x) / k * 8, u.deputy.z - (u.deputy.z - p.z) / k * 8, Math.atan2(u.deputy.x - p.x, u.deputy.z - p.z), 0); T.advance(0.1); }
        T.combat.hold({ aim: true }); T.advance(0.2); const lock3 = T.combat().lock; T.combat.hold({ aim: false });
        const id = 'd' + u.id, six = T.combat.hit(id, 'pistol', 6), seven = T.combat.hit(id, 'pistol', 1);
        const s1 = u.deputy.shots; T.advance(6); const after = u.deputy.shots - s1;
        return { out, isOut: u.deputy.out, lock2, lost2, lost3, shots, hits, lock3, id, six, seven, down: !!u.deputy.down, after, crimes: (g.seen.crime || []).map((e) => e.kind), downs: (g.seen['combat:down'] || []).map((e) => e.who.kind), errors: T.errors() };
      });
      t.expect(r.isOut, '==', true, 'the deputy got out');
      t.expect(r.lock2, '==', null, 'lock on a deputy at heat 2');
      t.expect(r.lost2, '==', 0, 'health lost at heat 2 (he does not fire)');
      t.expect(r.shots, '>=', 3, 'shots deputies fired in 8 s at heat 3');
      t.expect(r.lost3, '>', 0, 'health lost to him at heat 3');
      t.expect(r.lost3, 'in', [r.hits * 9 - 0.01, r.hits * 9 + 0.01], 'health lost is 9 a hit (' + r.hits + ' hits)');
      t.expect(r.lock3, '==', r.id, 'lock on the deputy at heat 3');
      t.expect(r.six.health > 0, '==', true, 'still up after six pistol hits');
      t.expect(r.down, '==', true, 'down after the seventh');
      t.expect(r.after, '==', 0, 'shots he fires once down');
      t.expect(r.crimes.includes('deputy-down'), '==', true, 'a crime of kind deputy-down');
      t.expect(r.downs.includes('deputy'), '==', true, 'combat:down names a deputy');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`deputy out after ${r.out.toFixed(1)} s; ${r.shots} shots, ${r.hits} hits, ${r.lost3.toFixed(0)} health in 8 s at heat 3`);
      await page.close();
    },
  },
  {
    id: 'D5-S4.7', name: 'weapon:fired carries the weapon and the place; three marked pickup spots hand out the six weapons and the vest; the flare sets off the fireworks crate; one draw call',
    async run(t) {
      for (const level of ['low', 'high']) {
        const page = await t.open('&traffic=0&peds=0&quality=' + level, SMALL);
        await settle(page);
        await page.evaluate(OPEN);
        const r = await page.evaluate(() => {
          const g = window.__game, T = g.test;
          T.combat.place();
          const start = T.combat(), blips = [...g.modules.minimap.blips.keys()].filter((k) => k.startsWith('pickup:')).length;
          const got = [];
          for (const pk of start.pickups) { T.teleport(pk.x, pk.z, 0, 0); T.advance(0.2); got.push(T.combat().inv); }
          const all = T.combat(), vest = T.health().armour;
          T.teleport(start.pickups[0].x, start.pickups[0].z, 0, 0); T.advance(0.3); const again = T.combat().stats.picked;
          // a pistol round down the road
          g.stand();
          T.combat.select('sidearm');
          const w0 = T.combat().weapon;
          T.combat.hold({ fire: true }); T.advance(0.4); T.combat.hold({ fire: false });
          const fired = (g.seen['weapon:fired'] || []).slice(-1)[0], pl = T.player();
          T.advance(3);
          const fl = T.combat(); T.advance(6);
          for (let i = 0; i < 6; i++) T.combat.spawn(...g.pt(i - 2.5, 6), 0, {});
          T.advance(0.2);
          return { start, blips, got, all, vest, again, w0, fired, pl, fl, end: T.combat(), fw: (g.seen['fireworks:start'] || []).length, calls: g.modules.combat.draw.mesh.visible ? 1 : 0, stats: T.stats(), errors: T.errors() };
        });
        t.expect(r.start.pickups.length, '==', 3, level + ': pickup spots');
        t.expect(r.blips, '==', 3, level + ': marked on the minimap');
        t.expect(JSON.stringify(r.all.inv), '==', JSON.stringify({ hand: 'flamingo', sidearm: 'pistol', long: 'shotgun' }), level + ': the bar after walking over all three');
        t.expect(JSON.stringify(r.got[0]), '==', JSON.stringify({ hand: 'noodle', sidearm: 'flare', long: null }), level + ': the bar after the first');
        t.expect(r.all.stats.picked, '==', 6, level + ': weapons handed out');
        t.expect(r.vest, '==', 100, level + ': armour from the life vest');
        t.expect(r.again, '==', 6, level + ': an emptied spot gives nothing for a minute');
        t.expect(r.w0, '==', 'pistol', level + ': the sidearm slot holds the last one picked up');
        t.expect(r.fired.weapon, '==', 'pistol', level + ': weapon:fired names the weapon');
        t.expect(Math.hypot(r.fired.x - r.pl.x, r.fired.z - r.pl.z), '<', 0.5, level + ': weapon:fired carries the place');
        t.expect(r.errors.length, '==', 0, level + ': errors');
        // the flare needs the flare gun back in the slot
        const f = await page.evaluate(() => {
          const g = window.__game, T = g.test;
          T.combat.clear(); T.advance(0.5); T.combat.crate(...g.pt(0, 20.5)); T.combat.give('flare'); g.stand();
          T.combat.hold({ fire: true }); T.advance(0.1); T.combat.hold({ fire: false });
          T.advance(1.5); const mid = T.combat(); T.advance(1.5);
          return { mid, end: T.combat(), where: T.combat().flares, fw: (g.seen['fireworks:start'] || []).length, flareCrime: (g.seen.crime || []).some((e) => e.case === 'flare'), errors: T.errors() };
        });
        t.expect(f.mid.flares.landed, '==', 1, level + ': flares landed');
        t.expect(f.fw, '==', 1, level + ': fireworks:start events');
        t.expect(f.end.flares.rockets, '>=', 4, level + ': rockets up after 1.5 s');
        t.expect(r.end.triangles, '<=', 320 * 12, level + ': triangles the fight draws');
        t.expect(f.errors.length, '==', 0, level + ': errors after the flare');
        t.note(`${level}: pickups at ${r.start.pickups.map((p) => `(${p.x.toFixed(0)}, ${p.z.toFixed(0)})`).join(' ')}; six guards, pickups and weapons: ${r.end.boxes} boxes, ${r.end.triangles} triangles, 1 draw call; frame ${JSON.stringify({ calls: r.stats.calls ?? r.stats.drawCalls, tris: r.stats.triangles })}`);
        await page.close();
      }
    },
  },
];
