// Session D3-S4 (HUD and controls): D3.7 from plan/08-roadmap.md, plus one check per item built.
import { devices } from 'playwright';

// low quality: at high, reading pixels back crashes the page under software rendering (it did before this session too)
const NO_TRAFFIC = '&traffic=0&peds=0&quality=low';
const phone = (w, h) => ({ ...devices['iPhone 13'], viewport: { width: w, height: h }, screen: { width: w, height: h } });
// runs in the page: how many pixels of a HUD piece's rectangle are painted
// (copied to a small canvas first: reading the big one back directly makes the browser warn)
const INK = `(id) => { const g = window.__game, h = g.modules.hud, r = h.layout().find((x) => x.id === id), d = h.canvas.width / innerWidth;
  const w = Math.max(1, Math.round(r.w * d)), ht = Math.max(1, Math.round(r.h * d)), c = window.__ink || (window.__ink = document.createElement('canvas'));
  c.width = w; c.height = ht; const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(h.canvas, Math.round(r.x * d), Math.round(r.y * d), w, ht, 0, 0, w, ht);
  const px = x.getImageData(0, 0, w, ht).data;
  let n = 0; for (let i = 3; i < px.length; i += 4) if (px[i] > 20) n++; return n; }`;
const frames = (page, n = 3) => page.evaluate((c) => new Promise((res) => { const s = () => (--c <= 0 ? res() : requestAnimationFrame(s)); requestAnimationFrame(s); }), n);

// wait (in real time) for the luggage tag and the spoken line to leave
const gone = (page) => page.evaluate(async () => { const T = window.__game.test, end = performance.now() + 9000;
  while ((T.hud().tag !== null || T.hud().sub !== null) && performance.now() < end) await new Promise((r) => setTimeout(r, 100)); });

// everything on screen at once: heat 3 (LIVE), a prompt, a hint, a toast, then the tag and a subtitle
async function crowd(page) {
  await page.evaluate(() => {
    const g = window.__game, e = g.events;
    g.state.heat.level = 3; g.state.heat.viewers = 51204; g.state.economy.cash = 1234567; g.state.economy.followers = 128400;
    e.emit('ui:prompt', { key: 'F', text: 'Get in' });
    e.emit('ui:hint', { id: 'check' + Math.random(), text: 'A one-line hint that is long enough to need the room it is given on a phone' });
    e.emit('ui:toast', { text: 'A toast with a fair number of words in it' });
    g.modules.hud.drop('Drift night: 12,400 points');
  });
  await frames(page, 4);
}
async function measure(page) {
  return page.evaluate(() => {
    const g = window.__game, hud = g.modules.hud, info = g.test.hud(), safe = info.safe;
    const pieces = hud.layout().filter((r) => r.shown || r.id === 'minimap' || r.id === 'radio' || r.id === 'live');
    const buttons = g.modules.touch.layout().map((b) => ({ ...b, id: 'button:' + b.id, excl: [], button: true }));
    const boxes = [...pieces, ...buttons], overlaps = [], outside = [];
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (a.excl.includes(b.id) || b.excl.includes(a.id)) continue;
      if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) overlaps.push(a.id + ' x ' + b.id);
    }
    for (const b of boxes) if (b.x < safe.l - 0.5 || b.y < safe.t - 0.5 || b.x + b.w > safe.r + 0.5 || b.y + b.h > safe.b + 0.5) outside.push(b.id);
    const small = [...document.querySelectorAll('#touch .btn, #foot-touch .fbtn, #touch-ui .tbtn, #menu-card *')]
      .filter((el) => el.textContent.trim() && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0)
      .map((el) => parseFloat(getComputedStyle(el).fontSize)).filter((s) => s < 14).length;
    return { mode: info.mode, shown: pieces.map((p) => p.id).sort().join(' '), buttons: buttons.length, overlaps, outside, small, minFont: info.minFont, badge: info.badge,
      minButton: buttons.length ? Math.min(...buttons.map((b) => Math.min(b.w, b.h))) : 99 };
  });
}

export default [
  {
    id: 'D3.7', name: 'HUD',
    async run(t) {
      const cases = [[1920, 1080, false, null], [960, 540, false, null], [844, 390, true, { l: 47, r: 47, b: 21 }], [390, 844, true, { t: 47, b: 34 }], [844, 390, false, null]];
      for (const [w, h, touch, ins] of cases) {
        const page = await t.open(NO_TRAFFIC, touch ? phone(w, h) : { viewport: { width: w, height: h } });
        const name = `${w}x${h}${touch ? ' touch' : ''}`;
        if (ins) await page.evaluate((o) => window.__game.test.hudInsets(o), ins);
        for (const where of ['car', 'foot']) {
          if (where === 'foot') { await page.evaluate(async () => { const T = window.__game.test; T.exit(); T.advance(1.5); await T.wait(0.3); }); }
          await gone(page);
          await crowd(page);
          const a = await measure(page);
          // then the pair that takes turns with those: the luggage tag and a spoken line
          await page.evaluate(() => { const e = window.__game.events; e.emit('district:entered', { id: 'tideline' }); e.emit('ui:toast', { kind: 'subtitle', who: 'Driver', text: 'That is my car, you absolute pelican', seconds: 3 }); });
          await frames(page, 4);
          const b = await measure(page);
          for (const [tag, r] of [['', a], [' with tag and subtitle', b]]) {
            t.expect(r.overlaps.length, '==', 0, `${name} ${where}${tag}: overlapping pairs ${JSON.stringify(r.overlaps.slice(0, 4))}`);
            t.expect(r.outside.length, '==', 0, `${name} ${where}${tag}: outside the safe area ${JSON.stringify(r.outside.slice(0, 4))}`);
            t.expect(r.small, '==', 0, `${name} ${where}${tag}: page texts under 14 px`);
          }
          t.expect(/cash/.test(a.shown) && /live/.test(a.shown) && /heat/.test(a.shown) && /badge/.test(a.shown) && /toast/.test(a.shown) && /hint/.test(a.shown), '==', true, `${name} ${where}: pieces on screen (${a.shown})`);
          t.expect(/tag/.test(b.shown) && /subtitle/.test(b.shown), '==', true, `${name} ${where}: the tag and subtitle are up (${b.shown})`);
          t.expect(b.minFont, '>=', 14, `${name} ${where}: smallest text drawn on the canvas (px)`);
          t.expect(a.badge, '==', 'Bayhaven · Day 3 build', `${name} ${where}: the badge`);
          if (touch) t.expect(a.minButton, '>=', 64, `${name} ${where}: smallest touch button (px)`);
          await gone(page);
        }
        const ink = await page.evaluate(`(${INK})('badge')`);
        t.expect(ink, '>', 100, `${name}: painted pixels in the badge`);
        await page.context().close();
      }
    },
  },
  {
    id: 'D3-S4.1', name: 'One canvas, repainted only where a value changed',
    async run(t) {
      const page = await t.open(NO_TRAFFIC);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, wait = (s) => new Promise((res) => setTimeout(res, s * 1000));
        await wait(4.5);                                   // the first hint and the district tag have gone
        g.events.emit('ui:hint:done'); await wait(1);
        const a = T.hud(); await wait(2); const b = T.hud();
        g.state.economy.cash += 500; await wait(1.5); const c = T.hud();
        const cv = document.querySelectorAll('canvas#hud');
        return { canvases: cv.length, over: getComputedStyle(cv[0]).position, events: getComputedStyle(cv[0]).pointerEvents, frames: b.frames - a.frames, idle: b.redraws - a.redraws,
          cash: (c.draws.cash || 0) - (b.draws.cash || 0), badge: (c.draws.badge || 0) - (b.draws.badge || 0), clock: (c.draws.clock || 0) - (b.draws.clock || 0),
          shown: c.cashShown, size: c.size, dpr: c.dpr, w: innerWidth };
      });
      t.expect(r.canvases === 1 && r.over === 'fixed' && r.events === 'none', '==', true, 'one #hud canvas over the game, letting touches through');
      t.expect(r.size[0], '==', Math.round(r.w * r.dpr), 'backing store is CSS size x dpr');
      t.expect(r.frames, '>', 5, 'frames drawn in two idle seconds');
      t.expect(r.idle, '<=', 2, 'pieces repainted in two idle seconds');
      t.expect(r.cash, '>=', 2, 'cash repaints while its digits roll');
      t.expect(r.badge + r.clock, '<=', 1, 'the badge and clock are left alone meanwhile');
      t.expect(r.shown, '==', 500, 'cash shown after the roll');
    },
  },
  {
    id: 'D3-S4.2', name: 'The wordmark is drawn from shapes, pink over cyan',
    async run(t) {
      const r = await t.eval(() => {
        const c = window.__game.modules.hud.wordmark(120), px = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        let pink = 0, cyan = 0, cols = new Set();
        for (let i = 0; i < px.length; i += 4) if (px[i + 3] > 200) {
          if (px[i] > 230 && px[i + 1] < 120) { pink++; cols.add(((i / 4) % c.width) >> 3); } else if (px[i] < 90 && px[i + 1] > 200) cyan++;
        }
        return { w: c.width, h: c.height, pink, cyan, spread: cols.size / (c.width >> 3), fonts: document.fonts ? document.fonts.size : 0 };
      });
      t.expect(r.w / r.h, 'between', [3, 4.5], 'wordmark width over height');
      t.expect(r.pink, '>', 4000, 'pink pixels');
      t.expect(r.cyan, '>', 500, 'cyan shadow pixels');
      t.expect(r.spread, '>', 0.9, 'share of the width the letters and wave cover');
      t.expect(r.fonts, '==', 0, 'font files loaded');
    },
  },
  {
    id: 'D3-S4.3', name: 'Prompts, hints and toasts follow ui:prompt, ui:hint and ui:toast',
    async run(t) {
      const page = await t.open(NO_TRAFFIC);
      const r = await page.evaluate(async (INK) => {
        const g = window.__game, T = g.test, e = g.events, ink = eval(INK), wait = (s) => new Promise((res) => setTimeout(res, s * 1000));
        await wait(4.5); e.emit('ui:hint:done'); await wait(1);
        const out = {};
        g.modules.ui.prompt('F', 'Get in'); await wait(0.4);
        out.prompt = T.hud().prompt; out.promptInk = ink('prompt');
        g.modules.ui.clearPrompt(); await wait(0.2); out.promptGone = T.hud().prompt === null && ink('prompt') === 0;
        g.modules.ui.hint('h1', 'Hold the handbrake in a turn to slide'); await wait(0.5);
        out.hint = T.hud().hint; out.hintInk = ink('hint');
        g.modules.ui.hintDone('h1'); await wait(1.1); out.hintGone = T.hud().hint === null && ink('hint') === 0;
        g.modules.ui.hint('h1', 'Hold the handbrake in a turn to slide'); await wait(0.2); out.hintOnce = T.hud().hint === null;
        e.emit('ui:toast', { text: 'Saved', seconds: 1 }); e.emit('ui:toast', { text: 'Second', seconds: 1 }); await wait(0.5);
        out.toasts = T.hud().toasts.join('|'); out.toastInk = ink('toast');
        await wait(1.6); out.toastGone = T.hud().toasts.length === 0 && ink('toast') === 0;
        // the door prompt: on foot beside the car
        T.exit(); T.advance(1.5); await wait(0.5);
        out.door = T.hud().prompt; out.mode = T.player().mode;
        T.advance(0.1); g.modules.player.teleport(T.player().x + 30, T.player().z, 0); T.advance(0.3); await wait(0.3);
        out.away = T.hud().prompt;
        return out;
      }, INK);
      t.expect(r.prompt === 'Get in' && r.promptInk > 300, '==', true, `the prompt is drawn (${r.promptInk} px)`);
      t.expect(r.promptGone, '==', true, 'the prompt clears');
      t.expect(r.hint !== null && r.hintInk > 300, '==', true, `the hint is drawn (${r.hintInk} px)`);
      t.expect(r.hintGone, '==', true, 'the hint vanishes when the thing is done');
      t.expect(r.hintOnce, '==', true, 'a hint is shown once only');
      t.expect(r.toasts, '==', 'Saved|Second', 'toasts shown');
      t.expect(r.toastInk, '>', 300, 'toast pixels');
      t.expect(r.toastGone, '==', true, 'toasts leave after their time');
      t.expect(r.mode === 'foot' && r.door === 'Get in', '==', true, `on foot by the car the prompt reads "F  Get in" (${r.door})`);
      t.expect(r.away, '==', null, 'no prompt away from any car');
    },
  },
  {
    id: 'D3-S4.4', name: 'The district name swings in as a luggage tag',
    async run(t) {
      const page = await t.open(NO_TRAFFIC);
      const r = await page.evaluate(async (INK) => {
        const g = window.__game, T = g.test, ink = eval(INK), wait = (s) => new Promise((res) => setTimeout(res, s * 1000));
        const first = T.hud().tag;                       // the game starts by entering a district
        const until = async (fn, max) => { const end = performance.now() + max * 1000; while (!fn() && performance.now() < end) await wait(0.1); return fn(); };
        await until(() => T.hud().tag === null, 8); await wait(0.5);
        g.events.emit('district:entered', { id: 'tideline', was: null });
        await wait(0.25); const up = T.hud().tag, a1 = ink('tag'); await wait(0.2); const a2 = ink('tag');
        const left = await until(() => T.hud().tag === null, 8); await wait(0.4);
        const gone = left && ink('tag') === 0;
        // a toast sent while the tag is down waits for it
        g.events.emit('district:entered', { id: 'tideline', was: null }); g.events.emit('ui:toast', { text: 'Waits for the tag' });
        await wait(0.4); const held = T.hud().toasts.length, down = T.hud().tag;
        await until(() => T.hud().tag === null, 8); await wait(0.5);
        return { first, a2: Math.max(a1, a2), moved: a1 !== a2, up, held, down, gone, after: T.hud().toasts.length };
      }, INK);
      t.expect(r.first, '==', 'Tideline', 'the tag at the start of the game');
      t.expect(r.up, '==', 'Tideline', 'the tag after district:entered');
      t.expect(r.a2, '>', 2000, 'tag pixels');
      t.expect(r.moved, '==', true, 'it is moving (swinging) just after it drops');
      t.expect(r.down === 'Tideline' && r.held === 0, '==', true, 'a toast waits while the tag is down');
      t.expect(r.gone, '==', true, 'the tag leaves and its place is clear');
      t.expect(r.after, '==', 1, 'then the toast shows');
    },
  },
  {
    id: 'D3-S4.5', name: 'Pause menu and settings',
    async run(t) {
      const page = await t.open(NO_TRAFFIC);
      await page.keyboard.press('Escape');
      const open = await page.evaluate(() => { const g = window.__game; return { open: g.modules.menus.isOpen, scale: g.loop.timeScale, paused: g.state.ui.paused,
        rows: [...document.querySelectorAll('#menu-card .menu-row')].map((b) => b.textContent).join('|'), mark: !!document.querySelector('#menu-card canvas.menu-mark') }; });
      t.expect(open.open && open.scale === 0 && open.paused, '==', true, 'Esc opens the pause card and stops time');
      t.expect(open.rows, '==', 'Resume|Settings|Controls|Save', 'pause rows');
      t.expect(open.mark, '==', true, 'the wordmark heads the card');
      const still = await page.evaluate(async () => { const a = window.__game.loop.time; await new Promise((res) => setTimeout(res, 500)); return window.__game.loop.time - a; });
      t.expect(still, '==', 0, 'game seconds that pass while paused');
      await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
      const set = await page.evaluate(() => { const g = window.__game, card = document.getElementById('menu-card'); return { page: g.modules.menus.current,
        labels: [...card.querySelectorAll('.menu-set > span')].map((s) => s.textContent).join('|'), sliders: card.querySelectorAll('input[type=range]').length,
        choices: [...card.querySelectorAll('.menu-choice button')].map((b) => b.textContent).join('|') }; });
      t.expect(set.page, '==', 'settings', 'arrow down and Enter open Settings');
      t.expect(set.labels, '==', 'Quality|Master volume|Music volume|Effects volume|Reduce motion|Sprint', 'settings rows');
      t.expect(set.sliders, '==', 3, 'volume sliders');
      t.expect(set.choices, '==', 'Auto|Low|Medium|High', 'quality choices');
      await page.locator('.menu-choice button[data-value=medium]').click();
      await page.locator('#menu-card button.menu-set', { hasText: 'Reduce motion' }).click();
      await page.locator('#menu-card button.menu-set', { hasText: 'Sprint' }).click();
      await page.locator('#menu-card input[type=range]').first().fill('40');
      const after = await page.evaluate(() => { const g = window.__game, s = g.state.settings; return { level: g.quality.level, q: s.quality, reduce: s.reduceMotion, toggle: s.sprintToggle, master: s.master, events: g.test.count('settings:changed') }; });
      t.expect(after.level === 'medium' && after.q === 'medium', '==', true, 'quality set to medium');
      t.expect(after.reduce && after.toggle, '==', true, 'reduce motion and sprint toggle are on');
      t.expect(after.master, '==', 0.4, 'master volume');
      t.expect(after.events, '>=', 4, 'settings:changed events');
      await page.keyboard.press('Escape'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
      const keys = await page.evaluate(() => ({ page: window.__game.modules.menus.current, rows: document.querySelectorAll('#menu-card .menu-keys dt').length, text: document.querySelector('#menu-card .menu-keys').textContent }));
      t.expect(keys.page === 'controls' && keys.rows >= 12 && /WASD/.test(keys.text), '==', true, `the controls list (${keys.rows} rows)`);
      await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
      const shut = await page.evaluate(() => { const g = window.__game; return { open: g.modules.menus.isOpen, scale: g.loop.timeScale, paused: g.state.ui.paused }; });
      t.expect(!shut.open && shut.scale === 1 && !shut.paused, '==', true, 'Esc steps back and closes; time runs again');
      // sprint as a toggle: one tap on Shift keeps him running
      const run = await page.evaluate(async () => { const g = window.__game, T = g.test; T.exit(); T.advance(1.5); await T.wait(0.2); return T.player().mode; });
      await page.keyboard.press('ShiftLeft');
      await page.keyboard.down('KeyW');
      const speed = await page.evaluate(async () => { const g = window.__game, T = g.test; await T.wait(0.2); const p = T.advance(2); return { speed: p.speed, latched: g.modules.menus.sprintLatched() }; });
      await page.keyboard.up('KeyW');
      t.expect(run === 'foot' && speed.latched, '==', true, 'a tap on Shift latches sprint');
      t.expect(speed.speed, '>', 4.5, 'speed with W held and Shift let go (m/s)');
    },
  },
  {
    id: 'D3-S4.6', name: 'Touch: driving, on-foot and menu layouts, sideways and upright',
    async run(t) {
      for (const [w, h] of [[844, 390], [390, 844]]) {
        const page = await t.open(NO_TRAFFIC, phone(w, h));
        const look = () => page.evaluate(() => { const m = window.__game.modules.touch, b = m.layout(); return { mode: m.mode, ids: b.map((x) => x.id).sort().join(' '), min: Math.min(...b.map((x) => Math.min(x.w, x.h))), n: b.length }; });
        const car = await look();
        t.expect(car.mode, '==', 'drive', `${w}x${h} mode in the car`);
        t.expect(car.ids, '==', 'KeyC back brake foot-out gas handbrake horn left right touch-pause', `${w}x${h} driving buttons`);
        t.expect(car.min, '>=', 64, `${w}x${h} smallest driving button (px)`);
        await page.evaluate(async () => { const T = window.__game.test; T.exit(); T.advance(1.5); await T.wait(0.3); });
        const foot = await look();
        t.expect(foot.mode, '==', 'foot', `${w}x${h} mode on foot`);
        t.expect(foot.ids, '==', 'foot-jump foot-sprint foot-stick foot-use touch-camera touch-pause', `${w}x${h} on-foot buttons`);
        t.expect(foot.min, '>=', 64, `${w}x${h} smallest on-foot control (px)`);
        // the stick appears under a thumb put down anywhere in the lower left
        const cdp = await page.context().newCDPSession(page);
        const x = Math.round(w * 0.3), y = Math.round(h * 0.62);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 5 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - 60, id: 5 }] });
        const push = await page.evaluate(() => { const g = window.__game, T = g.test, a = T.player(), b = document.getElementById('foot-stick').getBoundingClientRect(); const p = T.advance(2);
          return { speed: p.speed, d: Math.hypot(p.x - a.x, p.z - a.z), cx: b.left + b.width / 2, cy: b.top + b.height / 2 }; });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        t.expect(Math.hypot(push.cx - x, push.cy - y), '<', 3, `${w}x${h} the stick sits under the thumb (px off)`);
        t.expect(push.speed, 'between', [3.3, 3.5], `${w}x${h} a full push is a jog (m/s)`);
        const rest = await page.evaluate(async () => { const T = window.__game.test; await T.wait(0.2); const p = T.advance(1); return p.speed; });
        t.expect(rest, '<', 0.1, `${w}x${h} letting go stops him (m/s)`);
        // the pause button opens the menu and the game buttons go
        const b = await page.locator('#touch-pause').boundingBox();
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: b.x + 32, y: b.y + 32, id: 6 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await frames(page, 3);
        const menu = await page.evaluate(() => { const g = window.__game, c = document.getElementById('menu-card').getBoundingClientRect();
          const rows = [...document.querySelectorAll('#menu-card .menu-row')].map((r) => r.getBoundingClientRect().height);
          return { mode: g.modules.touch.mode, n: g.modules.touch.layout().length, open: g.modules.menus.isOpen, inside: c.left >= 0 && c.top >= 0 && c.right <= innerWidth && c.bottom <= innerHeight, row: Math.min(...rows) }; });
        t.expect(menu.open && menu.mode === 'menu' && menu.n === 0, '==', true, `${w}x${h} the pause button opens the menu; game buttons hidden`);
        t.expect(menu.inside && menu.row >= 48, '==', true, `${w}x${h} the card fits the screen, rows at least 48 px (${menu.row})`);
        await page.context().close();
      }
    },
  },
  {
    id: 'D3-S4.7', name: 'Clip mode hides hints and keeps the badge; pills react to numbers',
    async run(t) {
      const page = await t.open(NO_TRAFFIC);
      const r = await page.evaluate(async (INK) => {
        const g = window.__game, T = g.test, hud = g.modules.hud, ink = eval(INK), wait = (s) => new Promise((res) => setTimeout(res, s * 1000));
        await wait(4.5); g.events.emit('ui:hint:done'); await wait(1);
        hud.clipMode(true);
        g.events.emit('ui:hint', { id: 'clip-hint', text: 'Not in a clip' }); g.events.emit('ui:prompt', { key: 'F', text: 'Get in' }); await wait(0.5);
        await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
        const out = { hint: ink('hint'), prompt: ink('prompt'), badge: ink('badge') };
        hud.clipMode(false); await wait(0.5);
        out.back = ink('hint') + ink('prompt');
        g.events.emit('ui:prompt', null);
        // a gain rolls the digits: part way there after 200 ms, all the way after 700
        g.state.economy.cash = 1000; await wait(0.2); out.mid = T.hud().cashShown; await wait(0.6); out.end = T.hud().cashShown;
        return out;
      }, INK);
      t.expect(r.hint + r.prompt, '==', 0, 'hint and prompt pixels in clip mode');
      t.expect(r.badge, '>', 100, 'badge pixels in clip mode');
      t.expect(r.back, '>', 300, 'they return after clip mode');
      t.expect(r.mid > 0 && r.mid < 1000 && r.end === 1000, '==', true, `cash rolls (${r.mid} then ${r.end})`);
    },
  },
];
