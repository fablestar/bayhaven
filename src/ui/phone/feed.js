// The Squawk feed: posts made from the game's own events (plan/bible/voices/squawk.md, "How the feed picks a post").
// When an event fires, the rows of src/content/squawk.js whose `if` passes are collected, the row used last time for
// that event is dropped, and one is picked. At most one new post every 20 s. A mission's own post goes out first.
// 30 posts are kept, newest first. Emits squawk:posted { id, who, text, n } and squawk:reply { id, who, text }.
import { SQUAWK, ACCOUNTS, HANDLES, REPLIES } from '../../content/squawk.js';

export const PACE = 20, KEPT = 30, MILESTONES = [1000, 10000, 100000, 1000000];
const title = (id) => id.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
const num = (n) => Math.round(n).toLocaleString('en-US');

export function createFeed(ctx) {
  const S = ctx.state, ev = ctx.events, m = ctx.modules, rand = ctx.rng.rng(4107);
  const posts = [], lastRow = {}, reached = new Set(), stats = { posted: 0, paced: 0, unfilled: 0, replies: 0, scripted: 0 };
  let lastT = -1e9, weatherWas = null, shotsT = -1e9, unread = 0, nextId = 1, followersWas = S.economy.followers || 0, replyN = 0;
  const seconds = () => performance.now() / 1000;
  const stamp = () => { const h = S.clock.hour; return String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.floor((h % 1) * 60)).padStart(2, '0'); };

  // ---- the slots ----
  function landmark() {
    const map = m.map, p = S.player; let best = null, bd = 300;
    for (const zn of (map && map.zones) || []) for (const id in zn.landmarks || {}) {
      if (/\d/.test(id)) continue;
      const l = zn.landmarks[id], d = Math.hypot(Math.max(0, Math.abs(l.x - p.x) - (l.w || 0) / 2), Math.max(0, Math.abs(l.z - p.z) - (l.d || 0) / 2));
      if (d < bd) { bd = d; best = title(id); }
    }
    return best;
  }
  const SLOT = {
    landmark,
    street: () => { const r = m.map && m.map.nearestRoad(S.player.x, S.player.z); return r && r.name && r.d < 80 ? r.name : null; },
    district: () => { const z = m.map && S.world.district && m.map.zone(S.world.district); return z ? z.name : null; },
    vehicle: (e) => { const id = (e && e.model) || S.player.vehicle, d = id && m.vehicles && m.vehicles.models[id]; return d ? d.name : null; },
    score: (e) => (e && e.score != null ? num(Math.round(e.score / 10) * 10) : null),
    count: (e) => (e && e.count != null ? num(e.count) : null),
    handle: () => HANDLES.teo,
    viewers: () => num(S.heat.viewers || 0),
    metres: (e) => (e && e.metres != null ? String(Math.round(e.metres)) : null),
    station: (e) => (e && e.station) || null, song: (e) => (e && e.song) || null,
  };
  function fill(row, e) {
    let ok = true;
    const lower = !(ACCOUNTS[row.who] || {}).official;
    const text = row.text.replace(/\{(\w+)\}/g, (all, k) => {
      const v = SLOT[k] ? SLOT[k](e) : null;
      if (v == null) { ok = false; return all; }
      return lower && k !== 'handle' ? String(v).toLowerCase() : v;
    });
    return ok ? text : null;
  }

  // ---- the conditions ----
  const field = (e, k) => (k === 'kmh' ? (e.kmh != null ? e.kmh : (e.speed || 0) * 3.6) : e[k]);
  function pass(row, e) {
    const c = row.if, lead = S.chars.active;
    if (row.text.includes('{handle}') && ((S.economy.followers || 0) < 1000 || (row.on !== 'followers:milestone' && lead !== 'teo'))) return false;
    if (!c) return true;
    if (c.lead && c.lead !== lead) return false;
    if (c.he && lead === 'mags') return false;
    if (c.shots && seconds() - shotsT > 30) return false;
    if (c.after && !c.after.includes(weatherWas)) return false;
    for (const k in c.min || {}) if (!(field(e, k) >= c.min[k])) return false;
    for (const k in c.max || {}) if (!(field(e, k) <= c.max[k])) return false;
    for (const k in c.is || {}) { const want = c.is[k], v = field(e, k); if (Array.isArray(want) ? !want.includes(v) : v !== want) return false; }
    return true;
  }

  function push(who, text, n) {
    const post = { id: nextId++, who, name: (ACCOUNTS[who] || {}).name || who, text, n: n || 0, at: stamp(), reply: null };
    posts.unshift(post); if (posts.length > KEPT) posts.length = KEPT;
    unread++; stats.posted++;
    ev.emit('squawk:posted', { id: post.id, who, text, n: post.n });
    // the Sheriff's account answers a post that names it, or one of the rows it has a line for
    if (who !== HANDLES.sheriff) {
      const own = REPLIES.filter((r) => r.to === post.n), named = text.includes(HANDLES.sheriff) ? REPLIES.filter((r) => r.to === 'mention') : [];
      const pool = own.length ? own : named;
      if (pool.length) setTimeout(() => {
        post.reply = { who: HANDLES.sheriff, name: ACCOUNTS[HANDLES.sheriff].name, text: pool[replyN++ % pool.length].text };
        stats.replies++; unread++;
        ev.emit('squawk:reply', { id: post.id, who: HANDLES.sheriff, text: post.reply.text });
      }, 2500);
    }
    return post;
  }
  function handle(name, e) {
    e = e || {};
    const rows = SQUAWK.filter((r) => r.on === name && pass(r, e));
    if (!rows.length) return null;
    if (seconds() - lastT < PACE) { stats.paced++; return null; }
    const fresh = rows.length > 1 ? rows.filter((r) => r !== lastRow[name]) : rows;
    for (let tries = fresh.length; tries > 0; tries--) {
      const row = fresh.splice(Math.floor(rand() * fresh.length), 1)[0], text = fill(row, e);
      if (text == null) { stats.unfilled++; continue; }
      lastRow[name] = row; lastT = seconds();
      return push(row.who, text, row.n);
    }
    return null;
  }

  for (const name of new Set(SQUAWK.map((r) => r.on))) {
    if (name === 'followers:milestone') ev.on(name, (e) => { if (e && !reached.has(e.count)) { reached.add(e.count); handle(name, e); } });
    else if (name === 'mission:completed') ev.on(name, (e) => {
      const def = e && e.first !== false && m.missions && m.missions.get(e.id);
      if (def && def.react && def.react.squawk) { stats.scripted++; push(def.n % 2 ? '@motelrow.mo' : '@visiting.vic', def.react.squawk, 0); }
      handle(name, e);
    });
    else ev.on(name, (e) => handle(name, e));
  }
  ev.on('weather:changed', (e) => { weatherWas = e && e.was != null ? e.was : S.weather.kind; });
  for (const name of ['weapon:fired', 'cop:fired']) ev.on(name, () => { shotsT = seconds(); });
  for (const n of MILESTONES) if (followersWas >= n) reached.add(n);
  // STAND-IN: nothing emits followers:milestone yet (the economy session will). Until then the feed watches the
  // count itself, twice a second, and treats a crossing as that event without emitting it.
  ctx.loop.every(0.5, () => {
    const f = S.economy.followers || 0;
    for (const n of MILESTONES) if (followersWas < n && f >= n && !reached.has(n)) { reached.add(n); lastT = -1e9; handle('followers:milestone', { count: n }); }
    followersWas = f;
  });
  ev.on('game:reset', () => { lastT = -1e9; });

  return {
    posts, stats, handle, push,
    get unread() { return unread; }, read() { unread = 0; },
    get followers() { return Math.floor(S.economy.followers || 0); },
    handleName: HANDLES.teo, templates: SQUAWK.length, pace: PACE,
  };
}
