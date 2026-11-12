// The LIVE overlay at heat 3 and above: the chat of viewer comments that react to what happens,
// and the Sheriff's ticker. Both are painted on the HUD canvas (so clips and photos include
// them) in their own boxes under the clock. Also the booking screen (live-booked.js).
// The red LIVE pill and the five siren lights are the HUD's own pieces and read state.heat.
// Public object: { say(user, text), fire(trigger, data), rows, ticker, booked, stats }.
// Sizes and timings: plan/bible/art/ui-kit.md. Lines: src/content/chat.js, src/content/scanner.js.
import { C, font } from './hud-draw.js';
import { CHAT, USERS } from '../content/chat.js';
import { TICKER } from '../content/scanner.js';
import { createBooked } from './live-booked.js';

const LIFE = 6, FADE = 0.8, ENTER = 0.18, STAY = 4, TICK_SPEED = 90, NAME_COLS = [C.pink, C.cyan, C.mango];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const HE = /\b(he|him|his)\b/i, SHE = /\b(she|her)\b/i;

export default {
  name: 'live', order: 73, renderOrder: 73, needs: ['hud', 'heat'],
  init(ctx) {
    const S = ctx.state, ev = ctx.events, m = ctx.modules, hud = m.hud, g = hud.canvas.getContext('2d');
    const rows = [], queue = [], used = [], lastUsers = [], stats = { shown: 0, events: 0, filler: 0, skipped: 0, pings: 0, tickerLines: 0, paints: 0 };
    const booked = createBooked(ctx);
    let now = 0, quietT = 0, fillT = 0, unseenT = 0, unseenStage = 0, upUntil = -1, wasLive = false, streamT = 0, firstLive = true, magsSeen = false, pingT = 0;
    let rnd = 987654321; const rand = () => { rnd = (rnd * 1664525 + 1013904223) >>> 0; return rnd / 4294967296; };
    const tick = { text: '', x: 0, w: 0, queue: [], idleT: 0, lastT: -9, marks: {}, id: '' };
    let box = null, cleared = true;

    // ---- filling a line ----
    function fill(text, data = {}) {
      const p = S.player, car = m.vehicles && m.vehicles.player, model = car && m.vehicles.models && m.vehicles.models[car.model];
      const road = m.map && m.map.nearestRoad ? m.map.nearestRoad(p.x, p.z) : null, zone = m.map && m.map.zoneAt ? m.map.zoneAt(p.x, p.z) : null;
      const n = (v) => Math.round(v || 0).toLocaleString('en-US');
      return text.replace(/\{vehicle\}/g, (model && model.name) || (car ? car.model[0].toUpperCase() + car.model.slice(1) : 'car')).replace(/\{street\}/g, (road && road.name) || 'the beachfront')
        .replace(/\{district\}/g, (zone && zone.name) || 'Bayhaven').replace(/\{score\}/g, n(data.score)).replace(/\{metres\}/g, n(data.metres)).replace(/\{distance\}/g, n(data.metres))
        .replace(/\{viewers\}/g, n(S.heat.peak || S.heat.viewers));
    }
    function holds(c, data) {
      if (!c) return true;
      const p = S.player, h = S.heat;
      if (c.score !== undefined && !((data.score || 0) > c.score)) return false;
      if (c.metres !== undefined && !((data.metres || 0) > c.metres)) return false;
      if (c.kmh !== undefined && !((data.kmh || 0) > c.kmh)) return false;
      if (c.seconds !== undefined && !((data.seconds || 0) >= c.seconds)) return false;
      if (c.kind !== undefined && data.kind !== c.kind) return false;
      if (c.lead !== undefined && p.id !== c.lead) return false;
      if (c.inCar && p.mode === 'foot') return false;
      if (c.half && !(h.viewers < h.peak / 2)) return false;
      if (c.unseen && h.seen) return false;
      if (c.under !== undefined && !(streamT < c.under)) return false;
      if (c.first && !data.first) return false;
      if (c.chopper && !m.chopper) return false;
      if (c.parked && !data.parked) return false;
      if (c.gunfire && !data.gunfire) return false;
      if (c.healthUnder !== undefined && !(data.health !== undefined && data.health < c.healthUnder)) return false;
      if (c.near) { const lm = m.map && m.map.landmark ? m.map.landmark(c.near[0]) : null; if (!lm || Math.hypot(lm.x - p.x, lm.z - p.z) > c.near[1]) return false; }
      return true;
    }
    // a row for a trigger: not one of the last 30 shown if there is another; never one of the last 3
    function pick(trigger, data) {
      const lead = S.player.id;
      const ok = CHAT.filter((r) => r.on === trigger && holds(r.if, data) && !(lead === 'mags' && r.on !== 'mags' && HE.test(r.text)) && !(lead === 'teo' && SHE.test(r.text)));
      let best = null, bestAge = -1;
      for (const r of ok) {
        const i = used.lastIndexOf(r.n), age = i < 0 ? 1e9 : used.length - i;
        if (age <= 3) continue;
        const score = age >= 30 ? 1e6 + rand() : age;
        if (score > bestAge) { bestAge = score; best = r; }
      }
      if (!best) return null;
      const text = fill(best.text, data);
      if (text.length > 40) { stats.skipped++; return null; }
      used.push(best.n); if (used.length > 60) used.shift();
      return text;
    }
    function user() {
      let i; do { i = Math.floor(rand() * USERS.length); } while (lastUsers.includes(i));
      lastUsers.push(i); if (lastUsers.length > 3) lastUsers.shift();
      return i;
    }
    // ---- showing ----
    function say(who, text) {
      const i = typeof who === 'number' ? who : Math.max(0, USERS.indexOf(who));
      rows.push({ user: USERS[i], col: NAME_COLS[(i + 1) % 3], text, t0: now, two: false, w: 0 });
      if (rows.length > 8) rows.shift();
      stats.shown++; cleared = false;
      ping();
    }
    function ping() {
      const a = m.audio && m.audio.ctx; stats.pings++;
      if (!a || now - pingT < 0.25) return;
      pingT = now;
      const o = a.createOscillator(), gn = a.createGain(), t = a.currentTime;
      o.type = 'sine'; o.frequency.setValueAtTime(1320, t); o.frequency.exponentialRampToValueAtTime(1760, t + 0.05);
      gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(0.05, t + 0.008); gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.connect(gn); gn.connect(m.audio.bus('ui')); o.start(t); o.stop(t + 0.14);
    }
    const up = () => S.heat.level >= 3 || now < upUntil;
    // an event: one row within 0.3 s, then one to three more over the next 2 s, each from someone else
    function fire(trigger, data = {}) {
      if (!up()) return 0;
      const n = 2 + Math.floor(rand() * 3);
      let made = 0;
      for (let i = 0; i < n; i++) {
        const text = pick(trigger, data);
        if (!text) break;
        queue.push({ at: now + (i === 0 ? 0.1 + rand() * 0.2 : 0.4 + rand() * 1.6), text }); made++;
      }
      if (made) { quietT = 0; stats.events++; }
      return made;
    }
    function line(on, data = {}, force = false) {
      if (S.heat.level < 3 && on !== 'cleared' && on !== 'knockedout') return;
      if (!force && now - tick.lastT < 4) return;
      const list = TICKER.filter((r) => r.on === on && (r.when === undefined || data.when === r.when) && r.id !== tick.id);
      if (!list.length) return;
      const r = list[Math.floor(rand() * list.length)], text = fill(r.text, data);
      if (text.length > 120) return;
      tick.queue.push({ id: r.id, text }); if (tick.queue.length > 3) tick.queue.shift();
      tick.lastT = now; tick.idleT = 0; stats.tickerLines++;
    }

    // ---- what the game tells us ----
    ev.on('heat:changed', (e) => {
      if (e.level >= 3 && e.from < 3) {
        cleared = false; streamT = 0; unseenT = 0; unseenStage = 0; tick.marks = {}; rows.length = 0; queue.length = 0; tick.queue.length = 0; tick.text = '';
        firstLive = true; magsSeen = false; upUntil = -1;
        line('open', {}, true); fire('heat3');
      }
    });
    ev.on('heat:live', (e) => {
      if (firstLive) { firstLive = false; fire('live'); }
      if (S.heat.level === 3 && e.viewers >= 5000 && !tick.marks.v5) { tick.marks.v5 = true; line('viewers', { when: 5000 }); }
      const share = e.peak > 0 ? e.viewers / e.peak : 1;
      if (share < 0.2 && !tick.marks.f2) { tick.marks.f2 = true; line('falling', { when: 0.2 }, true); }
      else if (share < 0.5 && !tick.marks.f5) { tick.marks.f5 = true; line('falling', { when: 0.5 }, true); }
      if (share > 0.6) tick.marks.f5 = tick.marks.f2 = false;
    });
    ev.on('heat:cleared', (e) => { if (e.from >= 3) { upUntil = now + STAY; queue.length = 0; fire('cleared'); line('cleared', {}, true); } });
    ev.on('drift:end', (e) => { if (e && fire('drift', { score: e.score }) && S.heat.seen && e.score > 1000) line('drift', { score: e.score }); });
    ev.on('jump:landed', (e) => { if (e) { const metres = e.metres || e.distance || 0; if (fire('jump', { metres }) && S.heat.seen) line('jump', { metres }); } });
    ev.on('vehicle:crash', (e) => {
      if (!e) return;
      const cop = e.what === 'vehicle' && m.cops && m.cops.unitAt && m.cops.unitAt(e.x, e.z, 4.5);
      fire('crash', { kmh: e.speed * 3.6, parked: e.what === 'vehicle' && !cop });
      if (S.heat.seen && e.speed > 6) line(cop ? 'copcrash' : 'crash');
    });
    ev.on('prop:broken', (e) => { if (e) fire('prop', { kind: e.kind }); });
    ev.on('ped:hit', (e) => { if (e && e.by !== 'traffic') fire('pedhit', { kmh: e.kmh }); });
    ev.on('vehicle:destroyed', () => { if (S.heat.seen) line('destroyed'); });
    ev.on('vehicle:entered', (e) => { if (e && !e.reset && S.heat.level >= 3) fire('swap'); });
    ev.on('heat:dropped', () => fire('dropped'));
    ev.on('cop:fired', () => { if (now - (tick.marks.fireT || -99) > 20) { tick.marks.fireT = now; fire('copfire'); } });
    ev.on('crime', (e) => { if (e && e.kind === 'killing' && e.seen) line('killing', {}, true); });
    ev.on('player:knockedout', () => { if (S.heat.level >= 3) { fire('knockedout'); line('knockedout', {}, true); } });
    ev.on('player:booked', (e) => {
      const hour = S.clock.hour, hh = String(Math.floor(hour) % 24).padStart(2, '0'), mm = String(Math.floor((hour % 1) * 60)).padStart(2, '0');
      booked.show({ cost: e.cost, lead: S.player.id, name: S.player.id === 'mags' ? 'Mags' : 'Teo', day: S.build.day,
        when: (typeof S.clock.weekday === 'string' ? S.clock.weekday : 'Day ' + S.build.day) + ' · ' + hh + ':' + mm });
    });
    ev.on('game:reset', () => { rows.length = 0; queue.length = 0; upUntil = -1; booked.hide(); });

    // ---- where the boxes go (CSS pixels), from the kit: D 320 x 130 and five rows, P 220 x 60 and three ----
    function place() {
      const W = window.innerWidth, H = window.innerHeight, k = clamp((Math.min(W, H) - 390) / 690, 0, 1), s = (p, d) => p + (d - p) * k, mode = hud.mode;
      const ins = hud.insets || { l: 0, t: 0, r: 0, b: 0 };
      const w = Math.round(s(220, 320)), rowH = Math.round(s(20, 26)), n = mode === 'D' ? 5 : 3, right = W - ins.r - Math.round(s(14, 24));
      if (mode === 'portrait') box = { x: ins.l + 14, y: ins.t + 300, w: Math.min(260, W - 28), rowH: 22, n: 3, size: 14, ticker: null };
      else {
        const y = ins.t + Math.round(s(44, 80));
        box = { x: right - w, y, w, rowH, n, size: Math.round(s(14, 15)), ticker: { x: right - w, y: y + n * rowH + 8, w, h: Math.round(s(22, 28)) } };
      }
      box.mode = mode;
    }
    ev.on('hud:layout', () => { box = null; });
    ev.on('view:resize', () => { box = null; });

    function paint(dt) {
      if (!box) place();
      const dpr = hud.canvas.width / window.innerWidth, b = box, pad = 6;
      g.save();
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const th = b.ticker ? b.ticker.h + 10 : 0;
      g.clearRect(b.x - 4, b.y - 4, b.w + 8, b.n * b.rowH + th + 12);
      if (!up()) { g.restore(); cleared = true; return; }
      stats.paints++;
      // the chat: newest at the bottom, a row in from below in 180 ms, alive 6 s, fading over the last 800 ms
      g.textBaseline = 'middle'; g.textAlign = 'left';
      let slot = 0;
      const reduce = !!S.settings.reduceMotion;
      for (let i = rows.length - 1; i >= 0 && slot < b.n; i--) {
        const r = rows[i], age = now - r.t0;
        if (age > LIFE) continue;
        font(g, b.size, 700);
        const nameW = g.measureText(r.user + ' ').width;
        font(g, b.size, 400);
        const textW = g.measureText(r.text).width, two = nameW + textW + pad * 2 > b.w, need = two ? 2 : 1;
        if (slot + need > b.n) break;
        const enter = reduce ? 1 : clamp(age / ENTER, 0, 1), alpha = clamp((LIFE - age) / FADE, 0, 1) * (reduce ? clamp(age / ENTER, 0, 1) : 1);
        const y = b.y + (b.n - slot - need) * b.rowH + (1 - enter) * b.rowH, w = Math.min(b.w, (two ? Math.max(nameW, textW) : nameW + textW) + pad * 2);
        g.globalAlpha = alpha * 0.55; g.fillStyle = C.ink; g.beginPath(); g.roundRect(b.x + b.w - w, y + 1, w, need * b.rowH - 2, 8); g.fill();
        g.globalAlpha = alpha;
        const x = b.x + b.w - w + pad;
        font(g, b.size, 700); g.fillStyle = r.col; g.fillText(r.user, x, y + b.rowH / 2 + 1);
        font(g, b.size, 400); g.fillStyle = '#fff';
        if (two) g.fillText(r.text, x, y + b.rowH * 1.5, b.w - pad * 2); else g.fillText(r.text, x + nameW, y + b.rowH / 2 + 1);
        r.px = x + 4; r.py = y + b.rowH / 2;
        slot += need;
      }
      g.globalAlpha = 1;
      // the Sheriff's ticker: mango italic, 90 px a second, clipped to its box
      if (b.ticker && S.heat.level >= (b.mode === 'D' ? 3 : 4)) {
        const t = b.ticker;
        if (!tick.text && tick.queue.length) { const q = tick.queue.shift(); tick.text = 'Sheriff Rucker · ' + q.text; tick.id = q.id; font(g, b.size, 700, true); tick.w = g.measureText(tick.text).width; tick.x = t.w; }
        g.globalAlpha = 0.7; g.fillStyle = C.ink; g.beginPath(); g.roundRect(t.x, t.y, t.w, t.h, 8); g.fill(); g.globalAlpha = 1;
        if (tick.text) {
          g.save(); g.beginPath(); g.rect(t.x + 6, t.y, t.w - 12, t.h); g.clip();
          font(g, b.size, 700, true); g.fillStyle = C.mango; g.fillText(tick.text, t.x + tick.x, t.y + t.h / 2 + 1);
          g.restore();
          tick.x -= (reduce ? TICK_SPEED * 0.6 : TICK_SPEED) * dt;
          if (tick.x < -tick.w) tick.text = '';
        }
      }
      g.restore();
    }

    const api = {
      say, fire, rows, booked, stats, line,
      get ticker() { return tick.text; },
      get up() { return up(); },
      step(dt) {
        now += dt;
        const h = S.heat, live = h.level >= 3;
        if (live) streamT += dt;
        if (!up()) { wasLive = false; return; }
        wasLive = true;
        while (queue.length && queue[0].at <= now) say(user(), queue.shift().text);
        queue.sort((a, b) => a.at - b.at);
        if (!live) return;
        // nobody can see the player: the hiding lines at 3, 6 and 10 s
        if (!h.seen) {
          unseenT += dt;
          const stage = unseenT >= 10 ? 3 : unseenT >= 6 ? 2 : unseenT >= 3 ? 1 : 0;
          if (stage > unseenStage) { unseenStage = stage; fire('unseen', { seconds: unseenT }); }
        } else {
          unseenT = 0; unseenStage = 0;
          if (S.player.id === 'mags' && !magsSeen) { magsSeen = true; fire('mags', { first: true }); }
        }
        // filler: nothing for 4 s, then 0.5 lines a second at 1,000 viewers up to 4 a second at 200,000
        quietT += dt;
        if (quietT > 4) {
          fillT -= dt;
          if (fillT <= 0) {
            const rate = 0.5 + 3.5 * clamp((h.viewers - 1000) / 199000, 0, 1);
            fillT = 1 / rate * (0.7 + rand() * 0.6);
            const text = h.seen ? pick(S.player.id === 'mags' && rand() < 0.3 ? 'mags' : 'filler3', {}) : pick('unseen', { seconds: unseenT });
            if (text) { say(user(), text); stats.filler++; }
          }
        }
        // the ticker's idle line after 12 s
        tick.idleT += dt;
        if (tick.idleT > 12 && !tick.text && !tick.queue.length) line('idle', {}, true);
      },
      paint,
    };
    ctx.test.live = () => {
      let onHud = 0;
      const r = rows[rows.length - 1];
      if (r && r.px !== undefined && now - r.t0 < LIFE - FADE) {
        const dpr = hud.canvas.width / window.innerWidth;
        try { onHud = g.getImageData(Math.round((r.px - 8) * dpr), Math.round(r.py * dpr), 1, 1).data[3]; } catch (e) { onHud = -1; }
      }
      return { up: up(), shown: stats.shown, rows: rows.filter((q) => now - q.t0 < LIFE).map((q) => q.user + ': ' + q.text), ticker: tick.text, tickerLines: stats.tickerLines, onHud, box: box && { ...box },
        stats: { ...stats }, lines: CHAT.length, tierA: CHAT.filter((q) => q.tier === 'A').length, users: USERS.length, booked: booked.info() };
    };
    return api;
  },
  update(dt, ctx) { ctx.modules.live.step(dt); },
  render(alpha, ctx) {
    const live = ctx.modules.live, t = performance.now() / 1000, dt = Math.min(0.1, t - (live.lastPaint || t));
    live.lastPaint = t;
    if (live.up || !live.wiped) { live.paint(dt); live.wiped = !live.up; }
  },
};
