// The phone (plan/04-systems.md section 10). It slides up from the bottom, the game runs at 30% speed behind it,
// and one button closes it (P, Esc, the Close bar, the touch button, or a tap outside it).
// Apps are a registry: `modules.phone.register({ id, title, colour, icon, order, build(list, phone, kit) or launch(phone), badge() })`.
// Built in: Messages, Map, Camera, Squawk, Jobs, Stats, Settings. Jobs and Stats are lists other sessions fill:
//   phone.jobs.add({ id, title, line, icon, start() })   ·   phone.stats.add({ id, title, value() })
// Public object: open() · close() · toggle() · isOpen · show(appId) · home() · register(app) · apps · jobs · stats ·
//   messages (the inbox) · squawk (the feed) · camera (photo mode) · unread · numbers
// Owns state.ui.phoneOpen. Emits phone:opened, phone:closed, phone:app { id }, and through its parts phone:message,
// squawk:posted, squawk:reply, photo:taken, photo:mode.
import { createShell } from '../ui/phone/shell.js';
import { createFeed } from '../ui/phone/feed.js';
import { createInbox } from '../ui/phone/inbox.js';
import { createCamera } from '../ui/phone/camera.js';

const NUM = { speed: 0.3, up: 0.32, down: 0.22 };
const num = (n) => Math.floor(n || 0).toLocaleString('en-US');

let api = null;
export default {
  name: 'phone', order: 46, renderOrder: 96,
  init(ctx) {
    const S = ctx.state, ev = ctx.events, m = ctx.modules;
    const apps = [], jobs = [], stats = [];
    let wasScale = 1, ticker = 0, reopen = false;
    S.ui.phoneOpen = false;

    const camera = createCamera(ctx, { onExit: () => { if (reopen) { reopen = false; open(); } } });   // made first: its keys win while framing
    const feed = createFeed(ctx), inbox = createInbox(ctx);
    const list = (rows) => ({
      rows,
      add(row) { const i = rows.findIndex((r) => r.id === row.id); if (i >= 0) rows[i] = row; else rows.push(row); rows.sort((a, b) => (a.order || 50) - (b.order || 50)); if (S.ui.phoneOpen) shell.refresh(); return row; },
      remove(id) { const i = rows.findIndex((r) => r.id === id); if (i >= 0) rows.splice(i, 1); },
      list: () => rows.slice(),
    });

    const blocked = () => (m.menus && m.menus.isOpen) || document.body.classList.contains('clip') || camera.on || (m.health && m.health.down) || ctx.loop.timeScale === 0;
    function open() {
      if (S.ui.phoneOpen) return true;
      if (blocked()) return false;
      wasScale = ctx.loop.timeScale; ctx.loop.timeScale = NUM.speed; S.ui.phoneOpen = true;
      shell.open(); ticker = setInterval(() => shell.tick(), 500);
      ev.emit('phone:opened');
      return true;
    }
    function close() {
      if (!S.ui.phoneOpen) return;
      S.ui.phoneOpen = false; ctx.loop.timeScale = wasScale; clearInterval(ticker);
      shell.close();
      ev.emit('phone:closed');
    }
    const phone = api = {
      apps, numbers: NUM, camera, squawk: feed, messages: inbox, jobs: list(jobs), stats: list(stats),
      get isOpen() { return S.ui.phoneOpen; },
      get unread() { return inbox.unread + feed.unread; },
      get page() { return shell.page; },
      open, close, toggle: () => (S.ui.phoneOpen ? (close(), false) : open()),
      register(app) { const i = apps.findIndex((a) => a.id === app.id); if (i >= 0) apps[i] = app; else apps.push(app); apps.sort((a, b) => (a.order || 50) - (b.order || 50)); if (S.ui.phoneOpen) shell.refresh(); return app; },
      show(id) {
        const app = apps.find((a) => a.id === id);
        if (!app || !S.ui.phoneOpen) return false;
        ev.emit('phone:app', { id });
        if (app.launch) app.launch(phone); else { if (app.opened) app.opened(); shell.show(app); }
        return true;
      },
      home() { shell.home(); },
      render() { camera.render(); },
    };
    const shell = createShell(ctx, phone);

    // ---- the seven apps (the kit's colours) ----
    phone.register({ id: 'messages', title: 'Messages', colour: '#5dff9b', order: 1, badge: () => inbox.unread,
      build(rows, p, kit) {
        const all = inbox.list();
        if (!all.length) kit.note(rows, 'No messages yet.');
        for (const i of all) kit.row(rows, { icon: i.name[0], title: i.pinned ? `${i.name} · job` : i.name, line: i.waypoint ? `${i.text}  (tap for a waypoint)` : i.text, unread: i.unread, mine: i.mine,
          tap: () => { if (inbox.tap(i.id)) ev.emit('ui:toast', { text: `Waypoint set: ${i.name}`, seconds: 3 }); shell.refresh(); } });
      } });
    phone.register({ id: 'map', title: 'Map', colour: '#29e6ff', order: 2, launch() { if (m.mapscreen) m.mapscreen.open(); else if (m.menus) m.menus.open('map'); } });
    phone.register({ id: 'camera', title: 'Camera', colour: '#fff1c9', order: 3, launch() { reopen = true; close(); if (!camera.enter()) { reopen = false; open(); } } });
    phone.register({ id: 'squawk', title: 'Squawk', colour: '#ff4fa8', order: 4, badge: () => feed.unread, opened: () => feed.read(),
      build(rows, p, kit) {
        kit.top(rows, num(feed.followers), `followers · ${feed.handleName}`);
        if (!feed.posts.length) kit.note(rows, 'Quiet out there. Go and give them something to post about.');
        for (const q of feed.posts) kit.row(rows, { icon: q.who[1].toUpperCase(), title: q.who, line: `${q.text}  · ${q.at}`, reply: q.reply });
        feed.read();
      } });
    phone.register({ id: 'jobs', title: 'Jobs', colour: '#ffa02e', order: 5,
      build(rows, p, kit) {
        if (!jobs.length) kit.note(rows, 'Nothing on the board yet. Taxi, delivery and repo work will be listed here.');
        for (const j of jobs) kit.row(rows, { icon: j.icon || 'jobs', title: j.title, line: typeof j.line === 'function' ? j.line() : j.line, value: j.value ? j.value() : null,
          tap: j.start ? () => { close(); j.start(ctx); } : null });
      } });
    phone.register({ id: 'stats', title: 'Stats', colour: '#ffffff', order: 7,
      build(rows, p, kit) { for (const s of stats) kit.row(rows, { icon: s.icon || 'stats', title: s.title, line: s.line ? s.line() : '', value: s.value() }); } });
    phone.register({ id: 'settings', title: 'Settings', colour: '#6f6a78', order: 8, launch() { if (m.menus) m.menus.open('settings'); } });

    // a few lines to start the Stats list; later sessions add their own through phone.stats.add
    phone.stats.add({ id: 'missions', title: 'Missions done', order: 1, value: () => `${S.mission.done.length} of ${m.missions ? m.missions.list.length : 0}` });
    phone.stats.add({ id: 'followers', title: 'Followers', order: 2, value: () => num(S.economy.followers) });
    phone.stats.add({ id: 'peak', title: 'Most viewers', order: 3, value: () => num(Math.max(S.stats.peakViewers || 0, S.heat.peak || 0)) });
    phone.stats.add({ id: 'photos', title: 'Photos taken', order: 4, value: () => num(camera.stats.shots) });
    phone.stats.add({ id: 'squawks', title: 'Squawk posts about you', order: 5, value: () => num(feed.stats.posted) });

    // ---- what brings it up and down ----
    window.addEventListener('keydown', (e) => {
      if (e.repeat || (m.menus && m.menus.isOpen)) return;
      if (e.code === 'KeyP') { if (S.ui.phoneOpen) close(); else open(); e.stopImmediatePropagation(); }
      else if (e.code === 'Escape' && S.ui.phoneOpen) { if (shell.page) shell.home(); else close(); e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);
    ev.on('input:press', (e) => { if (e && e.name === 'phone') phone.toggle(); });
    ev.once('game:ready', () => { if (m.touch && m.touch.enable) m.touch.enable('phone', true); });
    ev.on('game:reset', () => { reopen = false; camera.exit(); close(); });
    ev.on('player:knockedout', () => { reopen = false; camera.exit(); close(); });
    ev.on('phone:message', (e) => { if (S.ui.phoneOpen) shell.refresh(); else if (e.unread) shell.pill(e.name, e.text); });
    for (const name of ['squawk:posted', 'squawk:reply', 'mission:started', 'mission:completed', 'waypoint:set']) ev.on(name, () => { if (S.ui.phoneOpen) shell.refresh(); });

    // ---- for the checks ----
    const strip = (r) => r && ({ width: r.width, height: r.height, bytes: r.bytes, badge: r.badge, framed: r.framed, greeting: r.greeting, targets: r.targets, filter: r.filter, hud: r.hud, name: r.name, photo: r.photo });
    ctx.test.phone = Object.assign(() => ({ open: S.ui.phoneOpen, timeScale: ctx.loop.timeScale, apps: apps.map((a) => a.id), page: shell.page, unread: phone.unread,
      messages: inbox.list().map((i) => ({ id: i.id, from: i.from, name: i.name, text: i.text, waypoint: i.waypoint, mission: i.mission, pinned: i.pinned, unread: i.unread, mine: i.mine })),
      jobs: jobs.map((j) => j.id), stats: stats.map((s) => ({ id: s.id, title: s.title, value: s.value() })), inbox: { ...inbox.stats }, ...shell.info() }),
    { open: () => open(), close: () => close(), app: (id) => phone.show(id), home: () => phone.home(), tap: (id) => inbox.tap(id) });
    ctx.test.squawk = () => ({ posts: feed.posts.map((q) => ({ ...q })), followers: feed.followers, handle: feed.handleName, templates: feed.templates, unread: feed.unread, stats: { ...feed.stats } });
    ctx.test.photo = Object.assign((opts) => camera.shoot(opts).then(strip), { enter: () => camera.enter(), exit: () => camera.exit(), info: () => camera.info(), flip: () => camera.flip(),
      set(o) { Object.assign(camera.o, o); camera.place(); return camera.info(); }, pixel(x, y) { const c = camera.last && camera.last.card; return c ? [...c.getContext('2d').getImageData(x, y, 1, 1).data] : null; } });
    return phone;
  },
  render() { api.render(); },
};
