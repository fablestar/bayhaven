// Session D2-S1 (Drift): D2.1 and D2.2 from plan/08-roadmap.md, plus one check per item built.
// Game time is run with test.advance, which calls the same fixed step the frame loop does.
import { readdirSync, readFileSync } from 'node:fs';
import { devices } from 'playwright';

const frame = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

export default [
  {
    id: 'D2.1', name: 'Slide',
    async run(t) {
      const page = await t.open();
      const r = await page.evaluate(() => {
        const T = window.__game.test;
        T.teleport(50, -85, 0);
        T.input([{ t: 0, hold: ['gas'] }, { t: 3, hold: ['gas', 'left', 'handbrake'] }, { t: 4.5, hold: [] }]);
        let peak = 0, smoke = 0, squeal = 0, low = 1e9;
        for (let i = 0; i < 270; i++) {
          const p = T.advance(1 / 60);
          if (i >= 180) { peak = Math.max(peak, p.slip); low = Math.min(low, p.kmh); }
          smoke = Math.max(smoke, window.__game.fx.count('smoke'));
        }
        const end = T.player();
        T.advance(3);
        return { peak, smoke, low, kmh: end.kmh, skid: window.__game.fx.count('skid'), starts: T.count('drift:start'), ends: T.count('drift:end'),
          banked: window.__game.car.drift.banked, crashes: T.count('vehicle:crash') };
      });
      t.expect(r.peak, '>=', 0.35, 'peak slip angle (rad)');
      t.expect(r.skid, '>', 0, 'skid-mark segments');
      t.expect(r.kmh, '>=', 30, 'speed at the end of the slide (km/h)');
      t.expect(r.low, '>=', 30, 'lowest speed during the slide (km/h)');
      t.expect(r.smoke, '>', 0, 'smoke puffs alive');
      t.expect(r.starts, '>=', 1, 'drift:start fired');
      t.expect(r.banked, '>', 0, 'drift score banked on drift:end');
      t.expect(r.crashes, '==', 0, 'wall hits during the slide');
    },
  },
  {
    id: 'D2.2', name: 'Props',
    async run(t) {
      const page = await t.open();
      const r = await page.evaluate(() => {
        const G = window.__game, T = G.test;
        let lamp = null;
        G.events.on('prop:broken', (e) => { if (e.kind.startsWith('lamp') && !lamp) lamp = e; });
        T.teleport(0, 25, 0, 60 / 3.6);          // 60 km/h, just short of the lamp at (0, 29)
        T.input([{ t: 0, hold: ['gas'] }, { t: 9, hold: [] }]);
        let before = 0, after = 0;
        for (let i = 0; i < 400 && !lamp; i++) { before = T.player().kmh; after = T.advance(1 / 60).kmh; }
        const down = G.props.count('lamp', 'down');
        T.advance(2);
        return { lamp, before, after, down, broken: T.count('prop:broken') };
      });
      t.expect(!!r.lamp, '==', true, 'prop:broken emitted for the lamp post');
      t.expect(r.before, 'in', [58, 62], 'speed going into the lamp (km/h)');
      t.expect(r.after / r.before, '>=', 0.5, 'share of speed kept');
      t.expect(r.down, '==', 1, 'lamp posts down');
    },
  },
  {
    id: 'D2-S1.1', name: 'Top speed and page text',
    async run(t) {
      const page = await t.open();
      const r = await page.evaluate(() => ({ top: window.__game.test.topSpeed(60), at40: window.__game.test.topSpeed(40),
        t100: window.__game.test.zeroToHundred(), title: document.title, hint: document.getElementById('hint').textContent }));
      t.expect(r.top, 'in', [137 * 0.98, 137 * 1.02], 'Heron top speed after 60 s on the flat (km/h)');
      t.expect(r.at40, '>=', 137 * 0.93, 'speed after 40 s (km/h)');
      t.expect(r.t100, 'in', [7.5 * 0.9, 7.5 * 1.1], '0 to 100 km/h (s)');
      t.expect(r.title, '==', 'Bayhaven | Day 2', 'page title');
      t.expect(/[·—–]/.test(r.hint), '==', false, 'hint has dots or dashes between items');
      t.expect(r.hint.includes(','), '==', true, 'hint uses commas');
    },
  },
  {
    id: 'D2-S1.2', name: 'Phone layout',
    async run(t) {
      for (const [w, h] of [[390, 844], [844, 390]]) {
        const page = await t.open('', { ...devices['iPhone 13'], viewport: { width: w, height: h }, screen: { width: w, height: h } });
        const r = await page.evaluate(() => {
          const box = (el) => { const b = el.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, b: b.bottom, w: b.width, h: b.height }; };
          const inside = (b) => b.l >= 0 && b.t >= 0 && b.r <= innerWidth && b.b <= innerHeight;
          const btns = [...document.querySelectorAll('#touch .btn')].map(box);
          const hud = ['title', 'clock', 'speed', 'hint', 'drop'].map((id) => box(document.getElementById(id)));
          const hint = box(document.getElementById('hint'));
          return { sw: document.documentElement.scrollWidth, vw: innerWidth, hint, hintInside: inside(hint), hudInside: hud.every(inside),
            buttons: btns.length, btnInside: btns.every(inside), btnMin: Math.min(...btns.map((b) => Math.min(b.w, b.h))),
            handbrakeAboveBrake: box(document.querySelector('[data-key=handbrake]')).b <= box(document.querySelector('[data-key=brake]')).t };
        });
        t.expect(r.sw, '==', w, `${w}x${h} document scrollWidth`);
        t.expect(r.hintInside, '==', true, `${w}x${h} hint inside the screen (left ${Math.round(r.hint.l)}, right ${Math.round(r.hint.r)})`);
        t.expect(r.hudInside, '==', true, `${w}x${h} every HUD piece inside the screen`);
        t.expect(r.btnInside && r.buttons === 8, '==', true, `${w}x${h} eight touch buttons inside the screen`);
        t.expect(r.btnMin, '>=', 64, `${w}x${h} smallest touch button (px)`);
        t.expect(r.handbrakeAboveBrake, '==', true, `${w}x${h} handbrake button above brake`);
        // the touch handbrake reaches the car
        const hb = await page.locator('[data-key=handbrake]').boundingBox();
        const cdp = await page.context().newCDPSession(page);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: hb.x + hb.width / 2, y: hb.y + hb.height / 2, id: 1 }] });
        const on = await page.evaluate(() => { const i = window.__game.input.poll(0); return i.handbrake && i.touch; });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        t.expect(on, '==', true, `${w}x${h} touch handbrake button sets the handbrake`);
      }
    },
  },
  {
    id: 'D2-S1.3', name: 'Hits: sparks, shake, knocked-over props',
    async run(t) {
      const page = await t.open();
      const r = await page.evaluate(() => {
        const G = window.__game, T = G.test;
        // into the building on the north side of the beachfront street
        T.teleport(-30, 40, Math.PI);
        T.input([{ t: 0, hold: ['gas'] }, { t: 3, hold: [] }]);
        let sparks = 0, shake = 0;
        for (let i = 0; i < 180; i++) { T.advance(1 / 60); G.fx.draw(G.camera, 0, 0); sparks = Math.max(sparks, G.fx.count('sparks')); shake = Math.max(shake, Math.abs(G.fx.shakeX) + Math.abs(G.fx.shakeY)); }
        const crash = T.count('vehicle:crash'), thumps = G.audio.stats.crashes;
        // through a barrier section at the east end of the street
        T.teleport(80, 34, Math.PI / 2);
        T.input([{ t: 0, hold: ['gas'] }, { t: 3, hold: [] }]);
        T.advance(3.5);
        const barriers = G.props.count('barrier', 'down');
        // through the slalom cones
        T.teleport(-56, 37, Math.PI / 2);
        T.input([{ t: 0, hold: ['gas'] }, { t: 5, hold: [] }]);
        T.advance(5);
        const cones = G.props.count('cone', 'down'), boardCones = G.drop.score.cones;
        T.advance(4);
        const moved = G.props.all.filter((p) => p.state === 2 && Math.hypot(p.x - p.home.x, p.z - p.home.z) > 0.5).length;
        T.reset();
        return { sparks, shake, crash, thumps, barriers, cones, boardCones, moved, standing: G.props.count(null, 'up'), all: G.props.all.length,
          kinds: Object.fromEntries(Object.entries(G.props.kinds).map(([k, v]) => [k, v.list.length])) };
      });
      t.expect(r.crash, '>=', 1, 'vehicle:crash fired on the wall hit');
      t.expect(r.sparks, '>', 0, 'sparks alive after the hit');
      t.expect(r.shake, '>', 0, 'camera shake after the hit (m)');
      t.expect(r.thumps, '>=', 1, 'impact thumps played');
      t.expect(r.barriers, '>=', 1, 'barrier sections knocked over');
      t.expect(r.cones, '>=', 3, 'cones knocked over');
      t.expect(r.boardCones, '==', r.cones, 'score board cone count matches');
      t.expect(r.moved, '>=', 3, 'props that came to rest away from where they stood');
      t.expect(r.standing, '==', r.all, 'R stands every prop back up');
      t.note('props: ' + JSON.stringify(r.kinds));
    },
  },
  {
    id: 'D2-S1.4', name: 'Speedometer, gears, sounds, horn',
    async run(t) {
      const page = await t.open();
      await page.evaluate(() => {
        const T = window.__game.test;
        T.teleport(-95, 40.5, Math.PI / 2);
        T.input([{ t: 0, hold: ['gas', 'horn'] }, { t: 8, hold: [] }]);
        T.advance(7);
      });
      await frame(page);
      const r = await page.evaluate(() => {
        const G = window.__game;
        return { gear: G.car.gear + 1, hudGear: document.getElementById('gear').textContent, hudKmh: +document.getElementById('kmh').textContent,
          kmh: G.car.kmh, audioGear: G.audio.stats.gear, shifts: G.audio.stats.shifts, horn: G.audio.stats.horn, q: G.audio.stats.q,
          gearEvents: G.test.count('vehicle:gear') };
      });
      t.expect(r.gear, '>=', 3, 'gear reached on the beachfront street');
      t.expect(r.hudGear, '==', String(r.gear), 'gear shown on the speedometer');
      t.expect(Math.abs(r.hudKmh - r.kmh), '<=', 1.5, 'speedometer matches the car (km/h off)');
      t.expect(r.audioGear, '==', r.gear, 'engine sound is in the same gear');
      t.expect(r.gearEvents, '>=', 2, 'gear changes on the way up');
      t.expect(r.horn, '==', true, 'horn sounding while H is held');
      // squeal in a slide, horn off on release, and the real H key
      const s = await page.evaluate(() => {
        const G = window.__game, T = G.test;
        T.teleport(50, -85, 0);
        T.input([{ t: 0, hold: ['gas'] }, { t: 3, hold: ['gas', 'left', 'handbrake'] }, { t: 4.5, hold: [] }]);
        T.advance(3.8);
        return new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(() => res({ squeal: G.audio.stats.squeal, horn: G.audio.stats.horn }))));
      });
      t.expect(s.squeal, '>', 0, 'tyre squeal level in the slide');
      t.expect(s.horn, '==', false, 'horn off after release');
      await page.evaluate(() => window.__game.test.advance(2));
      await page.keyboard.down('KeyH'); await frame(page);
      t.expect(await page.evaluate(() => window.__game.audio.stats.horn), '==', true, 'H key sounds the horn');
      await page.keyboard.up('KeyH');
    },
  },
  {
    id: 'D2-S1.5', name: 'Cameras and gamepad',
    async run(t) {
      const page = await t.open();
      const dist = () => page.evaluate(() => {
        const G = window.__game, c = G.cams, cam = G.camera.position, car = G.car;
        const fx = Math.sin(car.h), fz = Math.cos(car.h);
        return { d: Math.hypot(cam.x - car.x, cam.z - car.z), ahead: (cam.x - car.x) * fx + (cam.z - car.z) * fz, mode: c.mode, back: c.lookBack };
      });
      await frame(page);
      const chase = await dist();
      await page.keyboard.down('KeyB'); await frame(page); await frame(page);
      const back = await dist();
      await page.keyboard.up('KeyB'); await frame(page); await frame(page);
      await page.keyboard.press('KeyC'); await frame(page); await frame(page);
      const close = await dist();
      t.expect(chase.ahead, '<', 0, 'chase camera sits behind the car (m ahead)');
      t.expect(back.ahead, '>', 0, 'look-back camera sits in front of the car (m ahead)');
      t.expect(back.back, '==', true, 'look-back flag while B is held');
      t.expect(close.mode, '==', 'close', 'C switches to the close chase view');
      t.expect(close.d, '<', chase.d - 1.5, 'close view is nearer (m)');
      // a gamepad: right trigger, stick left, A for the handbrake, stick clicks for horn and camera
      const pad = await page.evaluate(() => {
        const G = window.__game, T = G.test;
        const state = { axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) };
        navigator.getGamepads = () => [state];
        const press = (i, v = 1) => { state.buttons[i] = { pressed: v > 0.5, value: v }; };
        T.teleport(50, -85, 0);
        press(7, 1); T.advance(3);
        const gasKmh = G.car.kmh, padSeen = G.input.pad;
        state.axes[0] = -1; press(0); press(10); press(1); press(11);
        const mode0 = G.cams.mode;
        let peak = 0; for (let i = 0; i < 80; i++) peak = Math.max(peak, T.advance(1 / 60).slip);
        const out = { gasKmh, padSeen, peak, handbrake: G.input.handbrake, horn: G.input.horn, back: G.input.lookBack, camChanged: G.cams.mode !== mode0, steer: G.input.steer };
        press(7, 0); press(0, 0); press(6, 1); state.axes[0] = 0;
        out.brakedKmh = 1e9; for (let i = 0; i < 120; i++) out.brakedKmh = Math.min(out.brakedKmh, T.advance(1 / 60).kmh);
        press(8); T.advance(0.1); out.resetX = G.car.x;
        return out;
      });
      t.expect(pad.padSeen, '==', true, 'gamepad detected');
      t.expect(pad.gasKmh, '>', 50, 'right trigger drives (km/h after 3 s)');
      t.expect(pad.steer, '==', 1, 'left stick steers left');
      t.expect(pad.peak, '>=', 0.35, 'pad A handbrake slides the car (rad)');
      t.expect(pad.handbrake && pad.horn && pad.back && pad.camChanged, '==', true, 'pad handbrake, horn, look-back and camera');
      t.expect(pad.brakedKmh, '<', 10, 'left trigger brakes (km/h)');
      t.expect(Math.round(pad.resetX), '==', -24, 'pad Back resets to the spawn');
    },
  },
  {
    id: 'D2-S1.6', name: 'Drift Night drop',
    async run(t) {
      const page = await t.open();
      const r = await page.evaluate(() => {
        const G = window.__game, T = G.test;
        T.teleport(50, -85, 0);
        T.input([{ t: 0, hold: ['gas'] }, { t: 3, hold: ['gas', 'left', 'handbrake'] }, { t: 4.5, hold: [] }]);
        T.advance(8);
        return { day: G.buildDay, drop: !!G.drop, cones: G.props.count('cone'), score: G.drop && { ...G.drop.score } };
      });
      await frame(page); await new Promise((res) => setTimeout(res, 500)); await frame(page);
      const pill = await page.evaluate(() => document.getElementById('drop').textContent);
      t.expect(r.day === 2 && r.drop, '==', true, 'Drift Night built on day 2');
      t.expect(r.cones, '>=', 20, 'neon cones on the course');
      t.expect(r.score.best, '>', 0, 'score board best drift after a slide');
      t.expect(r.score.last, '==', r.score.best, 'score board last drift');
      t.expect(/^Drift Night, best drift [\d,]+, cones \d+ of \d+$/.test(pill), '==', true, 'score line on the HUD: ' + pill);
      const other = await t.open('&day=3');
      const o = await other.evaluate(() => ({ drop: !!window.__game.drop, cones: window.__game.props.count('cone'), pill: document.getElementById('drop').textContent }));
      t.expect(!o.drop && o.cones === 0 && o.pill === '', '==', true, 'no Drift Night on any other build day');
    },
  },
  {
    id: 'D2-S1.7', name: 'Clip day-2',
    async run(t) {
      const page = await t.open('&clip=day-2');
      const start = await page.evaluate(() => ({ t: window.__game.test.stats().simTime, clip: document.body.classList.contains('clip') }));
      t.expect(start.clip, '==', true, 'clip mode on');
      await page.waitForFunction(() => !document.body.classList.contains('clip'), null, { timeout: 150000 });
      const r = await page.evaluate(() => {
        const G = window.__game, T = G.test;
        return { len: T.stats().simTime, drift: T.count('drift:start'), cones: G.props.count('cone', 'down'), crash: T.count('vehicle:crash'),
          x: G.car.x, z: G.car.z, kmh: G.car.kmh, hour: G.sky && +document.getElementById('clock').textContent.slice(0, 2), skid: G.fx.count('skid') };
      });
      t.expect(r.len - start.t, 'in', [11.9, 12.2], 'clip length (game seconds)');
      t.expect(r.hour, 'in', [18, 19], 'hour on the clock (sunset)');
      t.expect(r.drift, '>=', 1, 'drifts in the clip');
      t.expect(r.skid, '>', 0, 'skid marks left');
      t.expect(r.cones, '>=', 1, 'cones scattered');
      t.expect(r.crash, '==', 0, 'wall hits in the clip');
      t.expect(r.z, '<', 25, 'car ends up the side street past the plaza corner (z)');
      t.note(`clip ends at (${r.x.toFixed(1)}, ${r.z.toFixed(1)}) at ${r.kmh.toFixed(0)} km/h`);
    },
  },
  {
    id: 'D2-S1.8', name: 'Budgets and file sizes',
    async run(t) {
      const page = await t.open('&hour=19.5');
      await page.evaluate(() => {
        const T = window.__game.test;
        T.teleport(50, -85, 0);
        T.input([{ t: 0, hold: ['gas'] }, { t: 3, hold: ['gas', 'left', 'handbrake'] }, { t: 4.5, hold: [] }]);
        T.advance(4);
      });
      await frame(page);
      const s = await page.evaluate(() => window.__game.test.stats());
      t.expect(s.calls, '<=', 150, 'draw calls in a slide at dusk');
      t.expect(s.tris, '<=', 180000, 'triangles in a slide at dusk');
      const big = readdirSync('src').map((f) => [f, readFileSync('src/' + f, 'utf8').split('\n').length]).filter(([, n]) => n > 500);
      t.expect(big.length, '==', 0, 'source files over 500 lines ' + JSON.stringify(big));
    },
  },
];
