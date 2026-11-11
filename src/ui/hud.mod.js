// The HUD: a livestream overlay drawn on one 2D canvas (#hud) over the game canvas, so photos and
// clips can include it. Each piece owns a rectangle (hud-layout.js) and is cleared and repainted
// (hud-draw.js) only when its value changes or while it moves.
// Public object: canvas · layout() → [{ id, x, y, w, h, excl }] · show(id, on) · clipMode(on) ·
//   wordmark(height) → canvas · state { drift, gear, kmh } · drop(text) · stats · insets
// Listens: view:resize, ui:prompt, ui:hint, ui:hint:done, ui:toast, ui:tag, district:entered,
//   drift:end, input:first. Reads state.economy, clock, heat, player, build, settings.
import { layoutFor } from './hud-layout.js';
import { PIECES, L_PORTRAIT, meter } from './hud-draw.js';
import { wordmarkCanvas } from './wordmark.js';
import { createHud as createLegacy } from './hud.js';

// district colours and names for the luggage tag (plan/bible/art/ui-kit.md section 4)
const DISTRICTS = {
  tideline: ['Tideline', '#ff3fa4'], meridian: ['Meridian', '#b8cfe0'], 'palma-vieja': ['Palma Vieja', '#ffb347'],
  paintworks: ['The Paintworks', '#b46bff'], rustwater: ['Rustwater', '#ffc300'], northgate: ['Northgate', '#ff5a5a'],
  'mallard-greens': ['Mallard Greens', '#3fb86a'], 'runway-flats': ['Runway Flats', '#ffa02e'],
  'mudcat-glades': ['Mudcat Glades', '#3d6b4a'], islands: ['The Islands', '#1f2f5a'], 'heron-marsh': ['Heron Marsh', '#6a8f4e'],
};
const slug = (id) => String(id).toLowerCase().replace(/^the[-_ ]/, '').replace(/[_ ]+/g, '-');
const title = (id) => String(id).replace(/[-_]+/g, ' ').replace(/^./, (c) => c.toUpperCase());
const TAG_SECONDS = 3.25;

let api;
export default {
  name: 'hud', order: 70,
  init(ctx) {
    const S = ctx.state, events = ctx.events;
    // the day 1 and day 2 page elements stay, unseen, so older checks can still read them
    const style = document.createElement('style');
    style.textContent = '#title, #clock, #speed, #drift, #hint, #drop { visibility: hidden !important; } #car-subtitle { display: none !important; }'
      + ' #hud { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; }'
      + ' :root { --sl: env(safe-area-inset-left, 0px); --st: env(safe-area-inset-top, 0px); --sr: env(safe-area-inset-right, 0px); --sb: env(safe-area-inset-bottom, 0px); }'
      + ' #hud-probe { position: fixed; visibility: hidden; pointer-events: none; padding: var(--st) var(--sr) var(--sb) var(--sl); }';
    document.head.appendChild(style);
    const canvas = document.createElement('canvas'); canvas.id = 'hud';
    document.body.appendChild(canvas);
    const probe = document.createElement('div'); probe.id = 'hud-probe'; document.body.appendChild(probe);
    const g = canvas.getContext('2d');
    const legacy = createLegacy(events);
    const legacyClock = document.getElementById('clock'), legacyHint = document.getElementById('hint');
    if (legacyClock) legacyClock.addEventListener('pointerdown', (e) => { e.preventDefault(); if (ctx.modules.clock) ctx.modules.clock.skip(); });
    events.on('input:first', () => { if (legacyHint) legacyHint.style.opacity = 0; });

    const coarse = window.matchMedia('(pointer: coarse)');
    const hidden = new Set(), last = {}, draws = {}, wasMoving = {};
    const stats = { frames: 0, redraws: 0, draws, get minFont() { return meter.minFont; } };
    let L = null, dpr = 1, all = true, clip = false, toastN = 0;
    const insets = { l: 0, t: 0, r: 0, b: 0 };

    // this frame's values; the painters read these and nothing else
    const V = {
      now: 0, reduce: false, clip: false,
      cashShown: S.economy.cash, cashRing: '', cashAnim: false, cashShake: 0,
      followers: S.economy.followers, folRing: false, folPop: 0,
      clock: '', weekday: '', live: false, viewers: 0, blink: false, liveIn: 1,
      heat: 0, heatPhase: 0, heatFlash: '', heatPop: 1,
      kmh: 0, vehicle: '', onFoot: false, badge: '', drop: '', drift: '', driftTone: '',
      prompt: null, pulse: 0, hint: null, toasts: [], sub: null, tag: null,
    };
    const roll = { from: V.cashShown, to: V.cashShown, t0: -9, ringT: -9, loss: false };
    let folT = -9, folPopT = -9, liveT = -9, heatT = -9, flashT = -9, driftHold = 0;
    const waiting = [], seenHints = new Set();
    const seconds = () => performance.now() / 1000;

    function resize() {
      const w = window.innerWidth, h = window.innerHeight, cs = getComputedStyle(probe);
      dpr = Math.min(window.devicePixelRatio || 1, 2); meter.dpr = dpr;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      insets.l = parseFloat(cs.paddingLeft) || 0; insets.t = parseFloat(cs.paddingTop) || 0;
      insets.r = parseFloat(cs.paddingRight) || 0; insets.b = parseFloat(cs.paddingBottom) || 0;
      L = layoutFor(w, h, coarse.matches, insets);
      L_PORTRAIT.on = L.mode === 'portrait';
      all = true;
      events.emit('hud:layout', { mode: L.mode });
    }
    events.on('view:resize', resize);
    resize();

    // prompts, hints, toasts, the subtitle and the tag
    events.on('ui:prompt', (p) => {
      if (!p || !p.text) { V.prompt = null; return; }
      if (!V.prompt || V.prompt.text !== p.text || V.prompt.key !== p.key) V.prompt = { key: p.key || '', text: p.text, t0: seconds() };
    });
    events.on('ui:hint', (h) => {
      if (!h || !h.text || seenHints.has(h.id)) return;       // a hint is shown once
      seenHints.add(h.id);
      const now = seconds();
      V.hint = { id: h.id, text: h.text, t0: now, end: now + (h.seconds || 8) };
    });
    events.on('ui:hint:done', (h) => {
      if (V.hint && (!h || h.id === undefined || h.id === V.hint.id)) V.hint.end = Math.min(V.hint.end, seconds() + 0.8);
    });
    events.on('ui:toast', (t) => {
      if (!t || !t.text) return;
      if (t.kind === 'subtitle') { const now = seconds(); V.sub = { who: t.who || '', text: t.text, t0: now, end: now + (t.seconds || 3) }; return; }
      waiting.push({ text: t.text, life: t.seconds || 4, tone: t.tone || '', n: ++toastN });
    });
    function tag(text, hood, colour) { V.tag = { title: text, hood: hood || '', colour: colour || '#ff3fa4', t0: seconds() }; }
    events.on('ui:tag', (t) => { if (t && t.text) tag(t.text, t.sub, t.colour); });
    events.on('district:entered', (d) => {
      if (!d || !d.id) return;
      const known = DISTRICTS[slug(d.id)], p = S.player, map = ctx.modules.map;
      let hood = '';
      try { const n = map && map.neighbourhoodAt && map.neighbourhoodAt(p.x, p.z); hood = n ? (n.name || (typeof n === 'string' ? title(n) : '')) : ''; } catch { hood = ''; }
      tag(known ? known[0] : title(d.id), hood === (known && known[0]) ? '' : hood, known ? known[1] : '#ff3fa4');
    });
    events.on('drift:end', ({ score, wall }) => {
      if (score < 1) { V.drift = ''; return; }
      V.drift = (wall ? 'Wall hit, half banked ' : 'Drift banked ') + Math.round(score).toLocaleString('en-US');
      V.driftTone = wall ? 'bad' : 'good'; driftHold = 1.8;
    });

    function gather(dt) {
      const now = V.now = seconds(), m = ctx.modules, eco = S.economy, car = m.vehicles && m.vehicles.player;
      V.reduce = !!S.settings.reduceMotion; V.clip = clip;
      // cash: the digits roll for 600 ms and a ring shows gain (mint) or loss (pink, with a shake)
      if (eco.cash !== roll.to) {
        const diff = eco.cash - roll.to;
        roll.from = V.cashShown; roll.to = eco.cash; roll.t0 = roll.ringT = now; roll.loss = diff < 0;
      }
      const rt = (now - roll.t0) / 0.6;
      V.cashShown = rt >= 1 || V.reduce ? roll.to : Math.round(roll.from + (roll.to - roll.from) * (1 - (1 - rt) ** 3));
      V.cashRing = now - roll.ringT < 0.4 ? (roll.loss ? 'loss' : 'gain') : '';
      V.cashShake = V.cashRing === 'loss' && !V.reduce ? Math.round(3 * Math.sin((now - roll.ringT) * 60)) : 0;
      V.cashAnim = rt < 1 || !!V.cashRing;
      // followers: a ring on a jump of 50 or more, a pop when a thousand is crossed
      if (eco.followers !== V.followers) {
        if (Math.abs(eco.followers - V.followers) >= 50) folT = now;
        if (Math.floor(eco.followers / 1000) > Math.floor(V.followers / 1000) && !V.reduce) folPopT = now;
        V.followers = eco.followers;
      }
      V.folRing = now - folT < 0.3;
      V.folPop = now - folPopT < 0.5 ? (now - folPopT) / 0.5 : 0;
      // the clock moves every ten game minutes
      const hour = S.clock.hour, hh = Math.floor(hour) % 24, mm = Math.floor((hour - Math.floor(hour)) * 6) * 10;
      V.clock = String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
      if (legacyClock && legacyClock.textContent !== V.clock) legacyClock.textContent = V.clock;
      V.weekday = typeof S.clock.weekday === 'string' ? S.clock.weekday : '';
      // heat: five siren lights, and the LIVE pill from heat 3
      const heat = S.heat.level | 0;
      if (heat !== V.heat) { if (heat > V.heat) heatT = now; else if (heat === 0) flashT = now; V.heat = heat; }
      V.heatPop = V.reduce ? 1 : Math.min(1, (now - heatT) / 0.3);
      V.heatFlash = now - flashT < 0.15 && !V.reduce ? 'f' : '';
      V.heatPhase = heat > 0 && !V.reduce ? Math.floor(now / (heat >= 3 ? 0.2 : 0.4)) % 2 : 0;
      const live = heat >= 3;
      if (live && !V.live) liveT = now;
      V.live = live; V.viewers = S.heat.viewers | 0;
      V.liveIn = Math.min(1, (now - liveT) / (V.reduce ? 0.12 : 0.3));
      V.blink = live && !V.reduce && Math.floor(now * 2) % 2 === 1;
      // speed and the vehicle's name, hidden on foot
      V.onFoot = S.player.mode === 'foot';
      V.kmh = Math.round(Math.abs(car ? car.kmh : S.player.kmh || 0));
      const model = S.player.vehicle || (car && car.model), preset = m.vehicles && m.vehicles.models && m.vehicles.models[model];
      V.vehicle = model ? (preset && preset.name) || title(model) : '';
      V.badge = `Bayhaven · Day ${S.build.day} build`;
      // the drift score, as on day 2
      if (car && car.drift && car.drift.active && car.drift.score >= 1) {
        driftHold = 0; V.driftTone = '';
        V.drift = 'Drift ' + Math.round(car.drift.score).toLocaleString('en-US') + (car.drift.mult > 1 ? '  x' + car.drift.mult.toFixed(1) : '');
      } else if (driftHold > 0) { driftHold -= dt; if (driftHold <= 0) V.drift = ''; }
      // prompt pulse, hint and subtitle ends, the toast queue (which waits while the tag is down)
      V.pulse = V.prompt && !V.reduce ? Math.floor(now * 10) % 10 : 0;
      if (V.hint && now >= V.hint.end) V.hint = null;
      if (V.sub && now >= V.sub.end) V.sub = null;
      if (V.tag && now - V.tag.t0 >= TAG_SECONDS) V.tag = null;
      for (let i = V.toasts.length - 1; i >= 0; i--) if (now >= V.toasts[i].end) V.toasts.splice(i, 1);
      const rows = L.rects.toast.rows;
      while (waiting.length && V.toasts.length < rows && !V.tag && !clip) { const t = waiting.shift(); t.t0 = now; t.end = now + t.life + 0.5; V.toasts.push(t); }
      if (waiting.length > 6) waiting.splice(0, waiting.length - 6);
    }

    const touches = (a, b) => a.x - a.bleed < b.x + b.w + b.bleed && b.x - b.bleed < a.x + a.w + a.bleed
      && a.y - a.bleed < b.y + b.h + b.bleed && b.y - b.bleed < a.y + a.h + a.bleed;
    const dirty = [];
    function paint() {
      stats.frames++;
      if (all) { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, canvas.width, canvas.height); }
      dirty.length = 0;
      const keys = {};
      for (const p of PIECES) {
        const r = L.rects[p.id];
        const key = !r || hidden.has(p.id) ? null : p.key(V);
        keys[p.id] = key;
        if (all && key === null) last[p.id] = null;
        // a piece that was moving last frame is painted once more, so it rests in its final state
        const moving = key !== null && !!p.anim && !!p.anim(V);
        if (all ? key !== null : key !== last[p.id] || moving || wasMoving[p.id]) dirty.push(p);
        wasMoving[p.id] = moving;
      }
      // clearing a piece's rectangle and bleed may bite a neighbour's glow: repaint that neighbour too
      for (let i = 0; i < dirty.length && !all; i++) {
        const a = L.rects[dirty[i].id];
        for (const p of PIECES) {
          if (keys[p.id] === null || dirty.includes(p)) continue;
          if (touches(a, L.rects[p.id])) dirty.push(p);
        }
      }
      if (!all) {
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        for (const p of dirty) { const r = L.rects[p.id], e = r.bleed; g.clearRect(r.x - e, r.y - e, r.w + e * 2, r.h + e * 2); }
      }
      for (const p of PIECES) {       // in the list's order, so the tag stays on top
        if (!dirty.includes(p)) continue;
        last[p.id] = keys[p.id];
        if (keys[p.id] === null) continue;
        g.save();
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        if ('letterSpacing' in g) g.letterSpacing = '0px';
        p.draw(g, L.rects[p.id], V, L);
        g.restore();
        draws[p.id] = (draws[p.id] || 0) + 1; stats.redraws++;
      }
      all = false;
    }

    api = {
      canvas, stats, insets, state: legacy.state,
      layout() {
        const out = [];
        for (const id in L.rects) { const r = L.rects[id]; out.push({ id, x: r.x, y: r.y, w: r.w, h: r.h, excl: r.excl, shown: last[id] != null }); }
        return out;
      },
      get mode() { return L.mode; },
      show(id, on) { if (on) hidden.delete(id); else hidden.add(id); },
      // clip mode: hints, prompts, toasts and touch buttons off; the badge stays
      clipMode(on) { clip = !!on; document.body.classList.toggle('clip', clip); },
      get clip() { return clip; },
      wordmark: (height) => wordmarkCanvas(height),
      drop(text) { V.drop = text || ''; legacy.drop(text); },
      refresh() { resize(); },
      frame(dt) { gather(dt); paint(); },
      legacy,
    };
    // for the checks: the smallest text drawn, how often each piece was painted, and a way to set the safe area
    ctx.test.hud = () => ({ mode: L.mode, k: L.k, minFont: meter.minFont, frames: stats.frames, redraws: stats.redraws, draws: { ...draws },
      safe: { ...L.safe }, dpr, size: [canvas.width, canvas.height], prompt: V.prompt && V.prompt.text, hint: V.hint && V.hint.text,
      badge: V.badge, toasts: V.toasts.map((t) => t.text), tag: V.tag && V.tag.title, sub: V.sub && V.sub.text, clip, cashShown: V.cashShown });
    ctx.test.hudInsets = (o) => {
      const st = document.documentElement.style;
      st.setProperty('--sl', (o.l || 0) + 'px'); st.setProperty('--st', (o.t || 0) + 'px');
      st.setProperty('--sr', (o.r || 0) + 'px'); st.setProperty('--sb', (o.b || 0) + 'px');
      resize();
    };
    return api;
  },
  render(alpha, ctx) {
    const m = ctx.modules, car = m.vehicles && m.vehicles.player;
    if (car) api.legacy.update(ctx.loop.dt, car, m.audio ? m.audio.stats.q : 0);
    api.frame(ctx.loop.dt);
  },
};
