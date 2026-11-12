// Session D6-S2 (Phone and two missions): D6.4 and D6.5 from plan/08-roadmap.md, and one check per item on the session's list.
import { SQUAWK, REPLIES } from '../../src/content/squawk.js';
import { MESSAGES } from '../../src/content/messages.js';
import { STEPS } from '../../src/systems/missions-steps.js';
import repo from '../../src/content/missions/03-repo-woman.js';
import tv from '../../src/content/missions/07-as-seen-on-tv.js';

const QUIET = '&traffic=0&peds=0&hour=17.5';
const SMALL = { viewport: { width: 960, height: 540 } };
const settle = (page, ms = 500) => page.waitForTimeout(ms);
// a page that does not load in 30 s (a busy machine) is asked for again, twice at most
async function load(t, query, opts) {
  for (let i = 0; ; i++) {
    try { return await t.open(query, opts); } catch (e) { if (i >= 2 || !/goto|closed|not ready/.test(String(e && e.message))) throw e; t.note('the page did not load; asking again'); }
  }
}
const WATCH = `(() => { const g = window.__game; g.seen = [];
  for (const n of ['mission:offered', 'mission:started', 'mission:step', 'mission:failed', 'mission:completed', 'cash:changed', 'photo:taken', 'photo:mode', 'squawk:posted', 'squawk:reply', 'phone:message', 'phone:opened', 'phone:closed', 'waypoint:set'])
    g.events.on(n, (e) => g.seen.push({ ...(e || {}), ev: n, at: performance.now() }));
  return true; })()`;

export default [
  {
    id: 'D6.4', name: 'Phone: opening shows 7 apps or more; game speed is 0.3 while open; Camera returns a PNG over 50 kB with the postcard frame; Squawk has a new post within 5 s of a drift:end',
    async run(t) {
      const level = t.quality || 'low', page = await load(t, QUIET + '&quality=' + level, SMALL);
      await settle(page); await page.evaluate(WATCH);
      await page.keyboard.press('KeyP');
      await page.waitForFunction(() => { const r = document.getElementById('phone').getBoundingClientRect(); return r.bottom <= window.innerHeight && r.top >= 0 && r.top < 40; }, null, { timeout: 8000 }).catch(() => {});
      await settle(page, 400);
      const a = await page.evaluate(() => ({ ...window.__game.test.phone(), state: window.__game.state.ui.phoneOpen }));
      t.expect(a.open && a.state, '==', true, 'P opens the phone (state.ui.phoneOpen)');
      t.expect(a.apps.length, '>=', 7, 'apps on the home screen');
      t.expect(a.icons.join(' '), '==', 'messages map camera squawk jobs stats settings', 'the icons, in order');
      t.expect(a.timeScale, '==', 0.3, 'game speed while it is open');
      t.expect(a.rect.y + a.rect.h, '<=', 540, 'the phone is on the screen (its bottom edge, px)');
      t.expect(a.minFont, '>=', 14, 'smallest text on the phone (px)');
      // the game really is running at 30%: game seconds over one real second
      // (a frame longer than 0.1 s counts as 0.1 s in the loop, so the real seconds are counted the same way)
      const ran = await page.evaluate(() => new Promise((res) => {
        const g = window.__game, f0 = g.loop.frameTime; let real = 0, last = performance.now(), n = 0;
        const tick = (now) => { real += Math.min(0.1, Math.max(0, (now - last) / 1000)); last = now; if (++n < 40) requestAnimationFrame(tick); else res((g.loop.frameTime - f0) / real); };
        requestAnimationFrame((now) => { last = now; requestAnimationFrame(tick); });
      }));
      t.expect(ran, 'between', [0.27, 0.33], 'game seconds a real second behind the phone, over 40 frames');
      if (t.shots) await page.screenshot({ path: 'shots/D6-S2-phone.png' });
      await page.keyboard.press('KeyP'); await settle(page, 350);
      const b = await page.evaluate(() => window.__game.test.phone());
      t.expect(b.open, '==', false, 'one button (P again) closes it');
      t.expect(b.timeScale, '==', 1, 'game speed after it closes');
      // the camera
      const shot = await page.evaluate(async () => { const T = window.__game.test, r = await T.photo({ hud: false }); return { ...r, corner: T.photo.pixel(3, 3), edge: T.photo.pixel(12, 300), band: T.photo.pixel(600, r.height - 6), mid: T.photo.pixel(r.width >> 1, r.height >> 1) }; });
      t.expect(shot.bytes, '>', 50000, 'the PNG (bytes)');
      t.expect(shot.width + 'x' + shot.height, '==', level === 'low' ? '1280x854' : '1920x1280', 'the card on ' + level);
      t.expect(shot.greeting, '==', 'Greetings from Bayhaven · Day 6', 'the greeting on the card');
      t.expect(shot.edge.slice(0, 3).join(','), '==', '253,246,234', 'the white border (left edge pixel)');
      t.expect(shot.band.slice(0, 3).join(','), '==', '253,246,234', 'the bottom band is card');
      t.expect(shot.corner[3], '<', 255, 'the corner is rounded (alpha of pixel 3,3)');
      t.expect(shot.mid.slice(0, 3).join(',') !== '253,246,234', '==', true, 'the middle is the photo, not card');
      t.expect(shot.badge, '==', true, 'the day badge is in the photo');
      t.expect(/^bayhaven-day-6-[a-z-]+-\d{4}\.png$/.test(shot.name), '==', true, 'file name ' + shot.name);
      // Squawk
      const s = await page.evaluate(async () => {
        const g = window.__game, T = g.test, n0 = T.squawk().posts.length, t0 = performance.now();
        g.events.emit('drift:end', { score: 6240, wall: false });
        const post = g.seen.find((e) => e.ev === 'squawk:posted');
        return { n0, n1: T.squawk().posts.length, ms: post ? post.at - t0 : -1, top: T.squawk().posts[0], errors: T.errors() };
      });
      t.expect(s.n1 - s.n0, '==', 1, 'a new Squawk post after drift:end');
      t.expect(s.ms, 'between', [0, 5000], 'how long it took (ms)');
      t.expect(/drifting past|donuts outside/.test(s.top.text) && !/[{}]/.test(s.top.text), '==', true, 'the post: ' + s.top.text);
      t.expect(s.errors.length, '==', 0, 'errors');
    },
  },
  {
    id: 'D6.5', name: 'Missions 3 and 7: both complete by skipping steps; mission 7\'s heat steps complete for real when heat is set',
    async run(t) {
      const page = await load(t, QUIET, SMALL);
      await settle(page); await page.evaluate(WATCH);
      const r3 = await page.evaluate(() => {
        const g = window.__game, T = g.test, cash0 = g.state.economy.cash;
        const started = T.mission.start('repo-woman'), types = [T.mission.state().type];
        for (let i = 0; i < 11; i++) { const s = T.mission.skipStep(); types.push(s.type || s.status); T.advance(0.2); }
        const done = g.seen.find((e) => e.ev === 'mission:completed' && e.id === 'repo-woman');
        return { started, types, done, cash: g.state.economy.cash - cash0, missions: T.mission.state().missions, errors: T.errors() };
      });
      t.expect(r3.missions.join(' '), '==', 'final-notice repo-woman as-seen-on-tv', 'the missions in the build');
      t.expect(r3.started, '==', true, 'repo-woman starts');
      t.expect(r3.types.join(' '), '==', 'say goto enter deliver goto enter deliver goto enter deliver say card', 'its steps, then the card');
      t.expect(!!r3.done && r3.done.cash, '==', 1200, 'mission:completed carries cash 1200');
      t.expect(r3.cash, '==', 1200, 'cash rose by');
      const r7 = await page.evaluate(() => {
        const g = window.__game, T = g.test, eco = g.state.economy, cash0 = eco.cash, f0 = eco.followers, out = {};
        T.mission.dismiss();
        out.started = T.mission.start('as-seen-on-tv');
        T.mission.skipStep();                                         // 1: Teo explains
        out.step2 = T.mission.state().type; T.advance(0.3); out.stillWaiting = T.mission.state().step;
        T.setHeat(3); g.modules.heat.hold = true; T.advance(0.2);     // 2: heat reaches 3, for real
        out.afterHeat3 = T.mission.state().step + ' ' + T.mission.state().type;
        T.mission.skipStep();                                         // 3a: the Sheriff opens his show
        out.step3b = T.mission.state().type; T.advance(30); out.halfway = T.mission.state().timer;
        T.advance(31);                                                // 3b: 61 s at heat 3, for real
        out.after60 = T.mission.state().step + ' ' + T.mission.state().type;
        g.modules.heat.hold = false; T.advance(1); out.notYet = T.mission.state().type;
        T.setHeat(0); T.advance(0.5);                                 // 4a: heat cleared, for real
        out.afterClear = T.mission.state().step + ' ' + T.mission.state().type;
        T.mission.skipStep(); T.advance(0.2);                         // 4b: the count
        out.status = T.mission.state().status;
        out.done = g.seen.find((e) => e.ev === 'mission:completed' && e.id === 'as-seen-on-tv');
        out.cash = eco.cash - cash0; out.followers = eco.followers - f0; out.errors = T.errors();
        return out;
      });
      t.expect(r7.started, '==', true, 'as-seen-on-tv starts');
      t.expect(r7.step2 + ' ' + r7.stillWaiting, '==', 'heat 1', 'step 2 is a heat step and waits at heat 0');
      t.expect(r7.afterHeat3, '==', '2 say', 'heat 3 completed step 2 (not skipped)');
      t.expect(r7.step3b, '==', 'survive', 'step 3b');
      t.expect(r7.halfway && r7.halfway.left, 'between', [28, 32], 'seconds left on the clock after 30 s at heat 3');
      t.expect(r7.after60, '==', '4 heat', '61 s at heat 3 completed step 3b (not skipped)');
      t.expect(r7.notYet, '==', 'heat', 'step 4a waits while heat is up');
      t.expect(r7.afterClear, '==', '5 say', 'heat 0 completed step 4a (not skipped)');
      t.expect(r7.status, '==', 'card', 'the mission is complete');
      t.expect(!!r7.done && r7.done.cash, '==', 2500, 'mission:completed carries cash 2500');
      t.expect(r7.followers, '>=', 5000, 'followers rose by');
      t.expect(r3.errors.length + r7.errors.length, '==', 0, 'errors');
    },
  },
  {
    id: 'D6-S2.1', name: 'Repo Woman, a real step: the first car is driven (not skipped) into the service bay marker and the deliver step completes with the car under 30% damage',
    async run(t) {
      const page = await load(t, QUIET, SMALL);
      await settle(page); await page.evaluate(WATCH);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test;
        T.mission.start('repo-woman'); T.mission.skipStep(); T.advance(0.2);
        const stood = T.mission.state();                                    // 2a: the Tarpon is standing at the drop-off
        T.mission.skipStep(); T.mission.skipStep(); T.advance(0.2);
        const at = T.mission.state(), mk = at.markers[0];
        T.spawnVehicle('tarpon', { x: mk.x - 30, z: mk.z, heading: Math.PI / 2 });
        // gas until the marker is 6 m ahead, then the brake
        T.input((a) => { const p = T.player(), d = mk.x - p.x; a.steer = 0; a.gas = d > 6 && p.speed < 9 ? 1 : 0; a.brake = d <= 6 ? 1 : 0; a.handbrake = false; a.horn = false; return false; });
        let took = -1;
        for (let i = 0; i < 100 && took < 0; i++) { T.advance(0.1); if (T.mission.state().step > at.step) took = i / 10; }
        const s = T.mission.state(); g.modules.missions && T.input([{ t: 0, hold: [] }]);
        return { goto: stood.type, cars: g.modules.missions.run.stood ? Object.keys(g.modules.missions.run.stood) : [], at: { step: at.step, type: at.type, timer: at.timer, bar: at.bar }, mk, took, s: { step: s.step, type: s.type, cp: s.checkpoint },
          health: T.damage().health, moved: s.moved.filter((q) => q.mission === 'repo-woman').length, errors: T.errors() };
      });
      t.expect(r.goto, '==', 'goto', 'step 2a');
      t.expect(r.at.step + ' ' + r.at.type, '==', '3 deliver', 'step 2c');
      t.expect(r.at.timer && r.at.timer.total, '==', 150, 'the clock on the first delivery (s)');
      t.expect(r.at.bar && r.at.bar.of, '==', 30, 'the damage limit (%)');
      t.expect(r.took, 'between', [0.5, 9.5], 'seconds of driving until the deliver step completed');
      t.expect(r.s.step + ' ' + r.s.type, '==', '4 goto', 'the next step is car 2');
      t.expect(r.s.cp, '==', 4, 'a checkpoint was saved after the delivery');
      t.expect(r.health, '>', 70, 'the car is under its damage limit (health)');
      t.note(`the garage marker stands at (${r.mk.x}, ${r.mk.z}); seeds moved to a kerb for this mission: ${r.moved}; cars stood: ${r.cars.join(', ')}`);
      t.expect(r.errors.length, '==', 0, 'errors');
    },
  },
  {
    id: 'D6-S2.2', name: 'Messages: a mission on offer is a text from its giver; a new text arrives when a mission becomes available; a tap sets the waypoint',
    async run(t) {
      const page = await load(t, QUIET, SMALL);
      await settle(page); await page.evaluate(WATCH);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, first = T.phone().messages;
        T.mission.start('final-notice'); for (let i = 0; i < 6; i++) { T.mission.skipStep(); T.advance(0.2); }
        const after = T.phone(), msg = after.messages.find((q) => q.mission === 'repo-woman'), event = g.seen.find((e) => e.ev === 'phone:message' && e.mission === 'repo-woman');
        T.mission.dismiss(); T.phone.open(); T.phone.app('messages');
        const page1 = T.phone(), ok = T.phone.tap(msg.id), wp = T.gps().waypoint, after2 = T.phone().messages.find((q) => q.id === msg.id);
        T.phone.close();
        return { first, msg, event: !!event, pill: after.pill, unread: after.unread, page1: { page: page1.page, rows: page1.rows, title: page1.title }, ok, wp, read: !after2.unread, old: after.messages.find((q) => q.mission === 'final-notice'), errors: T.errors() };
      });
      t.expect(r.first.length, '==', 1, 'texts at the start');
      t.expect(r.first[0].from + ' ' + r.first[0].mission + ' ' + r.first[0].unread, '==', 'teo final-notice true', 'the first text');
      t.expect(/^mags come outside/.test(r.first[0].text), '==', true, "it is Teo's line from the bible");
      t.expect(!!r.msg && r.msg.from, '==', 'wendell', 'finishing mission 1 brings a text from');
      t.expect(r.msg.text, '==', MESSAGES.find((q) => q.when.id === 'repo-woman').text, 'word for word');
      t.expect(r.event, '==', true, 'phone:message was emitted');
      t.expect(r.msg.unread && r.msg.pinned, '==', true, 'it is unread and pinned');
      t.expect(/^Wendell: Mags\./.test(r.pill || ''), '==', true, 'the pill above the minimap: ' + r.pill);
      t.expect(r.old.pinned || r.old.unread, '==', false, "mission 1's text is no longer pinned or unread");
      t.expect(r.page1.page + ' ' + r.page1.title + ' ' + r.page1.rows, '==', 'messages Messages 2', 'the Messages page');
      t.expect(r.ok, '==', true, 'a tap on the text');
      t.expect(!!r.wp && Math.hypot(r.wp.x - 284, r.wp.z - 46) < 1, '==', true, "the waypoint is Wendell's bench (284, 46)");
      t.expect(r.read, '==', true, 'the text is read');
      t.expect(r.errors.length, '==', 0, 'errors');
    },
  },
  {
    id: 'D6-S2.3', name: 'Apps: Map opens the map screen, Settings reuses the pause settings, Jobs and Stats are lists a registry fills',
    async run(t) {
      const page = await load(t, QUIET, SMALL);
      await settle(page);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, P = g.modules.phone, out = {};
        T.phone.open();
        T.phone.app('jobs'); out.jobs0 = T.phone().rows;
        let ran = 0; P.jobs.add({ id: 'check-job', title: 'A check job', line: 'Added through the registry', start: () => { ran++; } });
        out.jobs1 = T.phone().rows; document.querySelector('#phone button.ph-row').click(); out.ran = ran; out.closedByJob = !T.phone().open; P.jobs.remove('check-job');
        T.phone.open(); T.phone.app('stats'); out.stats0 = T.phone().rows; P.stats.add({ id: 'check-stat', title: 'A check stat', value: () => '42' });
        out.stats1 = T.phone().rows; out.statValues = T.phone().stats;
        T.phone.home(); T.phone.app('map'); out.map = { menu: g.modules.menus.current, scale: g.loop.timeScale };
        g.modules.menus.close(); out.afterMap = { open: T.phone().open, scale: g.loop.timeScale };
        T.phone.app('settings'); out.settings = { menu: g.modules.menus.current, rows: document.querySelectorAll('#menu-card .menu-set').length };
        g.modules.menus.close(); T.phone.close(); out.end = g.loop.timeScale; out.errors = T.errors();
        return out;
      });
      t.expect(r.jobs0 + ' ' + r.jobs1, '==', '0 1', 'Jobs rows before and after jobs.add');
      t.expect(r.ran + ' ' + r.closedByJob, '==', '1 true', 'a tap starts the job and puts the phone away');
      t.expect(r.stats1 - r.stats0, '==', 1, 'Stats rows added by stats.add');
      t.expect(r.statValues.find((s) => s.id === 'missions').value, '==', '0 of 3', 'the missions line');
      t.expect(r.map.menu + ' ' + r.map.scale, '==', 'map 0', 'Map opens the map screen (time stops there)');
      t.expect(r.afterMap.open + ' ' + r.afterMap.scale, '==', 'true 0.3', 'closing the map is back on the phone at 30%');
      t.expect(r.settings.menu, '==', 'settings', 'Settings opens the pause menu\'s settings page');
      t.expect(r.settings.rows, '>=', 6, 'its rows');
      t.expect(r.end, '==', 1, 'game speed at the end');
      t.expect(r.errors.length, '==', 0, 'errors');
    },
  },
  {
    id: 'D6-S2.4', name: 'Photo mode: time stops, the free camera stays inside its limits, three filters give three pictures, the HUD goes off, photo:taken is emitted, the selfie flip faces the lead',
    async run(t) {
      const page = await load(t, QUIET, SMALL);
      await settle(page); await page.evaluate(WATCH);
      await page.evaluate(() => { const T = window.__game.test; T.phone.open(); T.phone.app('camera'); });
      await settle(page, 600);
      const a = await page.evaluate(() => { const g = window.__game; return { info: g.test.photo.info(), phone: g.test.phone().open, hour: g.state.clock.hour, time: g.loop.time, hudHidden: getComputedStyle(document.getElementById('hud')).visibility }; });
      await settle(page, 700);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, out = { hour: g.state.clock.hour, time: g.loop.time };
        out.far = T.photo.set({ dist: 400, pitch: 0.3 }); out.low = T.photo.set({ dist: 6, pitch: -1.5 }); out.wide = T.photo.set({ fov: 300, roll: 2, panX: 90, pitch: 0.3 });
        T.photo.set({ fov: 60, roll: 0, panX: 0, dist: 7, pitch: 0.3 });
        out.pix = [];
        for (const f of ['postcard', 'bleached', 'neon']) { const s = await T.photo({ filter: f }); out.pix.push(T.photo.pixel(s.width >> 1, 200).slice(0, 3).join(',')); out.bytes = s.bytes; out.targets = s.targets; }
        const p = g.state.player; T.photo.flip(); const sf = T.photo.set({});
        out.selfie = { on: sf.selfie, dist: sf.dist, facing: Math.cos(Math.atan2(sf.at.x - p.x, sf.at.z - p.z) - (g.car && p.mode !== 'foot' ? g.car.h : p.h)) };
        T.photo.flip(); out.unflipped = T.photo.info().selfie;
        out.events = g.seen.filter((e) => e.ev === 'photo:taken').length; out.last = g.seen.filter((e) => e.ev === 'photo:taken').pop();
        return out;
      });
      if (t.shots) await page.screenshot({ path: 'shots/D6-S2-photo.png' });
      await page.keyboard.press('Escape'); await settle(page, 400);
      const z = await page.evaluate(() => { const g = window.__game; return { info: g.test.photo.info(), phone: g.test.phone().open, scale: g.loop.timeScale, fov: g.camera.fov, errors: g.test.errors() }; });
      t.expect(a.info.on, '==', true, 'the Camera app starts photo mode');
      t.expect(a.info.timeScale, '==', 0, 'time is stopped while framing');
      t.expect(a.hudHidden, '==', 'hidden', 'the HUD is off');
      t.expect(Math.abs(r.hour - a.hour) + Math.abs(r.time - a.time), '==', 0, 'the game clock and game time did not move in 0.7 s');
      t.expect(r.far.at.dist, '<=', 25.01, 'pushed to 400 m, the camera is this far from the subject (m)');
      t.expect(r.low.at.y - r.low.at.ground, '>=', 0.299, 'pushed under the ground, its height (m)');
      t.expect(r.wide.fov + ' ' + r.wide.roll.toFixed(3) + ' ' + r.wide.pan.toFixed(1), '==', '100 0.524 10.0', 'field of view, roll and pan are held at 100 degrees, 30 degrees, 10 m');
      t.expect(new Set(r.pix).size, '==', 3, 'three filters, three different pixels: ' + r.pix.join(' | '));
      t.expect(r.bytes, '>', 50000, 'a framed photo (bytes)');
      t.expect(r.events, '==', 3, 'photo:taken events');
      t.expect(Array.isArray(r.last.targets) && r.last.x != null, '==', true, 'photo:taken carries x, z, district and targets: ' + JSON.stringify(r.last.targets));
      t.expect(r.selfie.on && r.selfie.dist < 6 && r.selfie.facing > 0.9, '==', true, 'the selfie flip puts the camera in front of the lead (cos ' + r.selfie.facing.toFixed(2) + ')');
      t.expect(r.unflipped, '==', false, 'and back');
      t.expect(z.info.on, '==', false, 'Esc leaves photo mode');
      t.expect(z.phone + ' ' + z.scale, '==', 'true 0.3', 'and the phone is back up, at 30%');
      t.expect(z.errors.length, '==', 0, 'errors');
    },
  },
  {
    id: 'D6-S2.5', name: 'Squawk: 40 templates or more, each keyed to an event; the feed shows Teo\'s follower count; a mission posts its own line first; the Sheriff\'s account replies',
    async run(t) {
      t.expect(SQUAWK.length, '>=', 40, 'templates');
      t.expect(new Set(SQUAWK.map((r) => r.n)).size, '==', SQUAWK.length, 'no row twice');
      t.expect(SQUAWK.every((r) => r.on && r.who && r.who[0] === '@' && r.text), '==', true, 'every row has an event, an account and a text');
      t.expect(new Set(SQUAWK.map((r) => r.on)).size, '>=', 14, 'different events the feed reads');
      for (const s of ['whoever is drifting past {landmark} rn: marry me', 'free water park on {street}. thank you, mystery driver', 'they LOST him?? @BayhavenBlue explain', '3:15. right on time.', 'is that a grandma', 'ok who is {handle} and why is he on my feed every day'])
        t.expect(SQUAWK.some((r) => r.text === s), '==', true, 'the plan\'s sample, word for word: ' + s.slice(0, 28));
      t.expect(REPLIES.length, '>=', 5, "the Sheriff's replies");
      const page = await load(t, QUIET, SMALL);
      await settle(page); await page.evaluate(WATCH);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, out = {};
        g.events.emit('prop:broken', { kind: 'hydrant', x: 0, z: 37, speed: 12 });
        out.hydrant = T.squawk().posts[0];
        g.events.emit('drift:end', { score: 9000 }); out.paced = T.squawk().posts.length;      // inside 20 s: no second post
        await new Promise((res) => setTimeout(res, 2900));
        out.reply = T.squawk().posts[0].reply;
        T.mission.start('as-seen-on-tv'); for (let i = 0; i < 6; i++) { T.mission.skipStep(); T.advance(0.2); }
        T.advance(1);
        const s = T.squawk(); out.posts = s.posts.map((q) => q.who + ' ' + q.text); out.followers = s.followers; out.handle = s.handle; out.stats = s.stats;
        T.mission.dismiss(); T.phone.open(); T.phone.app('squawk');
        out.top = document.querySelector('#phone .ph-top').textContent; out.rows = T.phone().rows; out.errors = T.errors();
        return out;
      });
      if (t.shots) await page.screenshot({ path: 'shots/D6-S2-squawk.png' });
      t.expect(r.hydrant && r.hydrant.text, '==', 'free water park on heron walk drive. thank you, mystery driver', 'a hydrant post, with the street filled in');
      t.expect(r.paced, '==', 1, 'posts after a second event inside 20 s');
      t.expect(!!r.reply && r.reply.who, '==', '@BayhavenBlue', 'a reply under it from');
      t.expect(r.posts.some((p) => p.endsWith('@BayhavenBlue lost a grandma who used her indicators the whole chase. explain')), '==', true, "mission 7's own post went out");
      t.expect(r.posts.some((p) => /1,000 FOLLOWERS/.test(p)), '==', true, 'passing 1,000 followers posted the milestone row');
      t.expect(r.handle + ' ' + (r.followers >= 5212), '==', '@teo.navarro.live true', "Teo's handle and count (" + r.followers + ')');
      t.expect(/^5,\d{3} followers · @teo\.navarro\.live$/.test(r.top), '==', true, 'the top of the Squawk page: ' + r.top);
      t.expect(r.rows, '==', r.posts.length, 'one row a post');
      t.expect(r.errors.length, '==', 0, 'errors');
    },
  },
  {
    id: 'D6-S2.6', name: 'The photo step is real: it waits for photo:taken with its subject in frame; the two missions follow the plan step by step, with every line of their scripts',
    async run(t) {
      const run = { st: {} }, E = { px: () => 0, pz: () => 0 }, st = { type: 'photo', subject: 'gerald', at: { x: 5, z: 5 } };
      t.expect(STEPS.photo.update(st, run, E), '==', false, 'standing at the spot is no longer the photo');
      STEPS.photo.on['photo:taken'](st, run, { targets: ['spire'] }, E);
      t.expect(STEPS.photo.update(st, run, E), '==', false, 'a photo without the subject');
      STEPS.photo.on['photo:taken'](st, run, { targets: ['spire', 'gerald'] }, E);
      t.expect(STEPS.photo.update(st, run, E), '==', true, 'a photo with the subject in frame');
      t.expect(STEPS.photo.view(st, run, E).photo.id, '==', 'gerald', 'the step tells the camera what to look for');
      const count = (m) => Object.values(m.lines).reduce((n, l) => n + l.length, 0);
      t.expect(repo.steps.map((s) => s.type).join(' '), '==', 'say goto enter deliver goto enter deliver goto enter deliver say', 'Repo Woman: 1, 2a to 2c, 3a to 3c, 4a to 4c and the closing lines');
      t.expect([repo.steps[3].timer, repo.steps[6].timer, repo.steps[9].timer].join(' '), '==', '150 180 ', 'its clocks: 2:30, 3:00, none');
      t.expect([repo.steps[3].maxDamage, repo.steps[6].maxDamage, repo.steps[9].maxDamage].join(' '), '==', '30 30 60', 'its damage limits');
      t.expect(repo.pays.cash + ' ' + count(repo), '==', '1200 39', 'Repo Woman pays, and its lines');
      t.expect(tv.steps.map((s) => s.type).join(' '), '==', 'say heat say survive heat say', 'As Seen on TV: 1, 2, 3a, 3b, 4a, 4b');
      t.expect(tv.steps[1].level + ' ' + tv.steps[3].seconds + ' ' + tv.steps[3].atHeat + ' ' + tv.steps[4].want, '==', '3 60 3 clear', 'reach 3, 60 s at 3 or more, clear');
      t.expect(tv.pays.cash + ' ' + tv.pays.followers + ' ' + count(tv), '==', '2500 5000 31', 'As Seen on TV pays, and its lines');
      const page = await load(t, QUIET, SMALL);
      await settle(page);
      // the honk: beside the parked cruiser on Rosa Street, a horn blast is heat 1; fifteen seconds of driving on is heat 2
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, out = {};
        T.mission.start('as-seen-on-tv', { from: 1, player: { model: 'heron', x: -1008.5, z: 12, h: Math.PI } });      // step 2, in a coupe beside the cruiser
        T.advance(0.5); out.mode = g.modules.player.mode; out.type = T.mission.state().type; out.before = g.state.heat.level;
        T.input([{ t: 0, hold: ['horn'] }, { t: 0.5, hold: [] }]); T.advance(1); out.honked = g.state.heat.level;
        out.said = T.dialogue().said ? T.dialogue().said.slice(-3).map((l) => l.who || l) : null;
        g.modules.heat.hold = true; T.input([{ t: 0, hold: ['gas'] }, { t: 16, hold: [] }]); T.advance(16); out.later = g.state.heat.level; g.modules.heat.hold = false;
        out.errors = T.errors();
        return out;
      });
      t.expect(r.type + ' ' + r.mode, '==', 'heat car', 'the step, and the player is in a car');
      t.expect(r.before + ' ' + r.honked, '==', '0 1', 'heat before and after honking at the cruiser');
      t.expect(r.later, '>=', 2, 'heat after 16 s of not pulling over');
      t.expect(r.errors.length, '==', 0, 'errors');
    },
  },
];
