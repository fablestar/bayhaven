// What a mission puts on screen (plan/bible/art/ui-kit.md): the objective line, the timer and a bar
// when a step needs them, the subtitle with a small portrait, markers in the world and on the
// minimap, start markers for missions on offer, the choice pills, and the postcard result card
// (mission-card.js). It reads modules.missions.view and modules.dialogue.current; it decides nothing.
// The objective, timer and subtitle are painted on the HUD canvas after the HUD, in their own boxes.
// Public object: card · info() · rects() · portrait(who) → canvas
import * as THREE from 'three';
import { createCard, clockText } from './mission-card.js';
import { CAST, VIA } from '../content/cast.js';

const C = { ink: '#150f3d', pink: '#ff4fa8', cyan: '#29e6ff', sand: '#fff1c9', mango: '#ffa02e', mint: '#5dff9b' };
const FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const font = (g, px, weight = 400, italic = false) => { g.font = `${italic ? 'italic ' : ''}${weight} ${Math.max(14, Math.round(px))}px ${FONT}`; };
const SHADOW = 'rgba(20, 5, 40, .7)';

// a 96 px portrait from a cast row: a face on the speaker's shirt colour
function drawPortrait(who) {
  const c = document.createElement('canvas'); c.width = c.height = 96;
  const g = c.getContext('2d'), p = CAST[who] || { shirt: C.mango, skin: '#e3b08a', hair: '#3b2a20' };
  g.fillStyle = p.shirt; g.beginPath(); g.roundRect(0, 0, 96, 96, 20); g.fill(); g.save(); g.clip();
  g.fillStyle = 'rgba(21,15,61,.18)'; g.fillRect(0, 70, 96, 26);
  g.fillStyle = p.skin; g.fillRect(40, 62, 16, 16);                                   // neck
  g.fillStyle = p.hair; g.beginPath(); g.roundRect(22, 12, 52, 30, 12); g.fill();      // hair
  if (who === 'mags') { g.beginPath(); g.roundRect(68, 26, 14, 22, 7); g.fill(); }     // her ponytail
  g.fillStyle = p.skin; g.beginPath(); g.roundRect(26, 24, 44, 46, 12); g.fill();      // the head, a rounded box
  if (p.hat === 'visor') { g.fillStyle = p.hatColour; g.beginPath(); g.roundRect(22, 22, 52, 9, 4); g.fill(); g.beginPath(); g.ellipse(48, 33, 30, 7, 0, 0, Math.PI); g.fill(); }
  if (p.hat === 'cap') { g.fillStyle = p.hatColour; g.beginPath(); g.roundRect(22, 8, 52, 22, 10); g.fill(); g.fillRect(18, 26, 44, 6); }
  g.fillStyle = C.ink; g.beginPath(); g.arc(38, 46, 3.4, 0, 7); g.arc(58, 46, 3.4, 0, 7); g.fill();
  g.strokeStyle = C.ink; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath();
  if (who === 'teo') g.arc(48, 55, 8, 0.2, Math.PI - 0.2); else { g.moveTo(41, 60); g.lineTo(55, who === 'mags' ? 60 : 58); }
  g.stroke();
  g.restore();
  return c;
}

let api = null;
export default {
  name: 'missionui', order: 74, renderOrder: 74, needs: ['hud', 'missions'],
  init(ctx) {
    const m = ctx.modules, S = ctx.state, ev = ctx.events, hud = m.hud, g = hud.canvas.getContext('2d'), mis = m.missions, view = mis.view;
    const stats = { paints: 0, subtitles: 0, photos: 0, markers: 0 };
    const portraits = {};
    const portrait = (who) => portraits[who] || (portraits[who] = drawPortrait(who));

    // ---- the postcard ----
    const photo = document.createElement('canvas'); photo.width = 880; photo.height = 1024;
    function snap() {
      const src = ctx.renderer.domElement, pg = photo.getContext('2d');
      try {
        ctx.renderer.render(ctx.scene, ctx.camera);              // drawn and copied in one go, so the frame is still in the buffer
        const k = Math.max(photo.width / src.width, photo.height / src.height), w = src.width * k, h = src.height * k;
        pg.drawImage(src, (photo.width - w) / 2, (photo.height - h) / 2, w, h); stats.photos++;
      } catch (e) { pg.fillStyle = '#ffb27a'; pg.fillRect(0, 0, photo.width, photo.height); }
      return photo;
    }
    const card = createCard(ctx, {
      retry: () => mis.retry(),
      replay: () => mis.replay(),
      closed: (d) => { if (mis.view.card || mis.view.failed) mis.dismiss(); },
      stamped: (d) => ev.emit('mission:stamped', { id: d.id, failed: !!d.failed }),
    });
    ev.on('mission:completed', (r) => card.show({ ...r, note: r.mode === 'cup' ? (r.record ? 'A new best in the Getaway Cup.' : 'The Getaway Cup.') : '' }, snap()));
    ev.on('mission:failed', (f) => card.show({ id: f.id, title: f.title, seconds: f.seconds, failed: true, text: f.text, checkpoint: f.checkpoint }, snap()));
    ev.on('mission:ended', () => card.hide(true));
    ev.on('mission:retried', () => card.hide(true));
    ev.on('mission:offered', (o) => ev.emit('ui:toast', { text: 'New job: ' + o.title, seconds: 4 }));
    ev.on('mission:started', (s) => { if (s.mode !== 'clip') ev.emit('ui:tag', { text: s.title, sub: s.mode === 'cup' ? 'The Getaway Cup' : 'Mission ' + s.n, colour: C.pink }); });
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (e.code === 'Enter' || e.code === 'NumpadEnter') { if (card.open) card.primary(); else mis.skip(); }
      if (view.choice && /^Digit[1-9]$/.test(e.code)) { const o = view.choice[+e.code.slice(5) - 1]; if (o) mis.choose(o.id); }
    });
    window.addEventListener('pointerdown', () => { if (view.cutscene) mis.skip(); });

    // ---- page elements: the bars of a cutscene, the choice pills ----
    const dom = document.createElement('div'); dom.id = 'mission-ui';
    dom.innerHTML = '<style>#mission-ui .bar{position:fixed;left:0;right:0;height:0;background:#150f3d;z-index:6;transition:height .35s;pointer-events:none}#mission-ui .bar.t{top:0}#mission-ui .bar.b{bottom:0}'
      + '#mission-ui.cut .bar{height:9vh}#mission-ui .skip{position:fixed;right:calc(18px + var(--sr,0px));bottom:calc(9vh + 10px);color:#fff;font:14px ' + FONT.replace(/"/g, "'") + ';letter-spacing:1px;opacity:0;z-index:7;text-shadow:0 1px 6px rgba(20,5,40,.7);pointer-events:none}'
      + '#mission-ui.cut .skip{opacity:.85}#mission-ui .choice{position:fixed;left:50%;bottom:30%;transform:translateX(-50%);display:none;gap:10px;z-index:8}#mission-ui .choice.on{display:flex}'
      + '#mission-ui .choice button{font:italic 800 16px ' + FONT.replace(/"/g, "'") + ';min-height:48px;padding:0 20px;border-radius:24px;border:0;background:#29e6ff;color:#150f3d;cursor:pointer}body.clip #mission-ui{display:none}</style>'
      + '<div class="bar t"></div><div class="bar b"></div><div class="skip">Tap or press Enter to skip</div><div class="choice"></div>';
    document.body.appendChild(dom);
    const choiceEl = dom.querySelector('.choice');
    let choiceKey = '';

    // ---- markers in the world: a ring and a beam for a place, a pointer over a vehicle ----
    const ringGeo = new THREE.CylinderGeometry(1, 1, 1, 28, 1, true), beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 10, 1, true), coneGeo = new THREE.ConeGeometry(0.55, 1.1, 4);
    const mat = (colour, opacity) => new THREE.MeshBasicMaterial({ color: colour, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, fog: false });
    const MATS = { pink: [mat(0xff4fa8, 0.75), mat(0xff4fa8, 0.2), new THREE.MeshBasicMaterial({ color: 0xff4fa8, fog: false })], cyan: [mat(0x29e6ff, 0.7), mat(0x29e6ff, 0.2), new THREE.MeshBasicMaterial({ color: 0x29e6ff, fog: false })] };
    const pool = [];
    function marker(i) {
      if (pool[i]) return pool[i];
      const grp = new THREE.Group(), ring = new THREE.Mesh(ringGeo), beam = new THREE.Mesh(beamGeo), cone = new THREE.Mesh(coneGeo);
      cone.rotation.x = Math.PI; ring.renderOrder = beam.renderOrder = 5;
      grp.add(ring, beam, cone); grp.visible = false; ctx.scene.add(grp);
      return (pool[i] = { grp, ring, beam, cone, x: 0, z: 0 });
    }
    const shown = [];
    function place(time) {
      shown.length = 0;
      if (view.markers) for (const q of view.markers) shown.push({ ...q, colour: 'pink', blip: 'mission:' + q.id });
      if (view.offers) for (const o of view.offers) shown.push({ id: 'offer:' + o.id, x: o.x, z: o.z, r: mis.numbers.startR, kind: 'start', colour: 'cyan', blip: 'mission:offer:' + o.id, label: o.title });
      const clip = document.body.classList.contains('clip');
      for (let i = 0; i < Math.max(shown.length, pool.length); i++) {
        const q = shown[i], k = marker(i);
        if (!q || (clip && q.kind !== 'target')) { k.grp.visible = false; continue; }
        const mt = MATS[q.colour], place = q.kind === 'goal' || q.kind === 'start', y = m.map.heightAt(q.x, q.z), beat = S.settings.reduceMotion ? 0 : Math.sin(time * 4);
        k.grp.visible = true; k.grp.position.set(q.x, y, q.z);
        k.ring.visible = k.beam.visible = place; k.cone.visible = !place;
        if (place) {
          k.ring.material = mt[0]; k.beam.material = mt[1];
          k.ring.scale.set(q.r, 0.5 + 0.12 * beat, q.r); k.ring.position.y = 0.3;
          k.beam.scale.set(Math.min(1.6, q.r * 0.3), 36, Math.min(1.6, q.r * 0.3)); k.beam.position.y = 18;
        } else {
          k.cone.material = mt[2]; k.cone.position.y = (q.kind === 'target' ? 3.9 : 2.7) + 0.18 * beat; k.cone.rotation.y = time * 1.5;
          k.cone.scale.setScalar(q.kind === 'pickup' ? 0.7 : 1);
        }
      }
      stats.markers = shown.length;
    }
    // the same markers as blips; a marker that moves is moved, one that is gone is taken off
    const blips = new Set();
    let routeKey = '';
    function mapBlips() {
      const mm = m.minimap;
      if (!mm) return;
      const want = new Set();
      for (const q of shown) {
        want.add(q.blip);
        if (blips.has(q.blip)) mm.moveBlip(q.blip, q.x, q.z);
        else { mm.addBlip({ id: q.blip, x: q.x, z: q.z, icon: q.kind === 'target' || q.kind === 'vehicle' || q.kind === 'pickup' ? 'dot' : 'mission', colour: q.colour === 'pink' ? C.pink : C.cyan, pulse: q.colour === 'pink', edge: true, label: q.label || view.objective || '' }); blips.add(q.blip); }
      }
      for (const id of [...blips]) if (!want.has(id)) { mm.removeBlip(id); blips.delete(id); }
      // a step that asks for a route gets the road chevrons to its marker
      const key = view.route ? view.route.x + ',' + view.route.z : '';
      if (key !== routeKey && m.gps) { if (key) m.gps.setWaypoint(view.route.x, view.route.z); else if (routeKey) m.gps.clear(); routeKey = key; }
    }

    // ---- the HUD canvas: objective, timer, bar, subtitle ----
    let objWidth = 0, box = null, subRect = null, layT = 0, objText = '', objOld = '', objT = -9, wasPainted = false, subWas = false, hidHints = false;
    function measure() {
      const Wd = window.innerWidth, Hd = window.innerHeight, k = clamp((Math.min(Wd, Hd) - 390) / 690, 0, 1), s = (p, d) => p + (d - p) * k, ins = hud.insets || { l: 0, t: 0, r: 0, b: 0 };
      const portraitMode = hud.mode === 'portrait';
      box = { x: ins.l + Math.round(s(14, 24)), y: ins.t + Math.round(portraitMode ? 196 : s(58, 104)), w: Math.round(Math.min(s(260, 520), Wd - 28)), s, k,
        objPx: s(14, 20), timerPx: s(20, 32), barW: Math.round(s(150, 240)), barH: Math.round(s(8, 12)), gap: Math.round(s(20, 32)) };
      box.h = Math.round(box.gap + s(20, 32) + 6 + box.barH + 30 + box.barH + 8);
      subRect = (hud.layout().find((r) => r.id === 'subtitle')) || { x: Wd / 2 - 170, y: Hd - 190, w: 340, h: 52 };
    }
    ev.on('hud:layout', () => { box = null; }); ev.on('view:resize', () => { box = null; });
    function paint(now) {
      if (!box || now - layT > 1) { measure(); layT = now; }
      const line = S.build && view.active && view.status === 'running' ? view.objective || '' : '';
      if (line !== objText) { objOld = objText; objText = line; objT = now; }
      const dpr = hud.canvas.width / window.innerWidth, b = box, reduce = !!S.settings.reduceMotion, clip = document.body.classList.contains('clip');
      const any = !clip && (objText || now - objT < 0.5 || view.timer || view.bar || view.clock != null);
      g.save(); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (any || wasPainted) g.clearRect(b.x - 6, b.y - 6, b.w + 12, b.h + 12);
      if (!!any !== wasPainted) { hud.show('drop', !any); if (!any && hud.refresh) hud.refresh(); }      // the day's drop line shares this corner
      wasPainted = !!any; if (!objText) objWidth = 0;
      if (any) {
        stats.paints++;
        g.shadowColor = SHADOW; g.shadowBlur = 6; g.shadowOffsetY = 1; g.textBaseline = 'middle'; g.textAlign = 'left';
        const age = now - objT, mid = b.y + b.gap / 2;
        font(g, b.objPx, 700, true); objWidth = objText ? Math.min(b.w - 18, g.measureText(objText).width) : 0;
        const drawLine = (text, dx, alpha, strike) => {
          if (!text || alpha <= 0) return;
          g.globalAlpha = alpha; font(g, b.objPx, 700, true);
          g.fillStyle = C.cyan; g.beginPath(); g.moveTo(b.x + dx, mid - 6); g.lineTo(b.x + dx + 7, mid); g.lineTo(b.x + dx, mid + 6); g.lineWidth = 3; g.strokeStyle = C.cyan; g.lineCap = 'round'; g.stroke();
          g.fillStyle = '#fff'; g.fillText(text, b.x + dx + 16, mid + 1, b.w - 18);
          if (strike > 0) { const tw = Math.min(b.w - 18, g.measureText(text).width); g.fillStyle = C.pink; g.fillRect(b.x + dx + 16, mid, tw * strike, 2); }
          g.globalAlpha = 1;
        };
        // a new step: the old line is struck in pink (200 ms) and slides out, the new one slides in (250 ms)
        if (objOld && age < 0.45 && !reduce) drawLine(objOld, -clamp((age - 0.2) / 0.25, 0, 1) * 30, 1 - clamp((age - 0.2) / 0.25, 0, 1), clamp(age / 0.2, 0, 1));
        const inK = reduce ? 1 : clamp((age - (objOld ? 0.2 : 0)) / 0.25, 0, 1);
        drawLine(objText, (1 - inK) * 24, inK, 0);
        let y = b.y + b.gap + 4;
        const t = view.timer, clock = view.clock;
        if (t || clock != null) {
          const left = t ? t.left : clock, low = t && !t.good && left < 10;
          font(g, b.timerPx, 800); g.fillStyle = low ? C.pink : '#fff'; g.globalAlpha = low && !reduce ? 0.6 + 0.4 * Math.abs(Math.sin(now * Math.PI)) : 1;
          g.fillText(clockText(t ? Math.ceil(left) : left) + (t ? '' : '.' + Math.floor((left % 1) * 10)), b.x, y + b.timerPx / 2); g.globalAlpha = 1;
          y += b.timerPx + 6;
          if (t) { meter(b.x, y, b.barW, b.barH, clamp(left / t.total, 0, 1), low ? C.pink : C.cyan); y += b.barH + 8; }
        }
        if (view.bar) {
          const q = view.bar; font(g, Math.max(14, b.objPx - 2), 800); g.fillStyle = '#fff';
          g.fillText(`${q.label} ${q.value}/${q.of}`, b.x, y + 10); y += 22;
          meter(b.x, y, b.barW, b.barH, clamp(q.value / q.of, 0, 1), q.bad ? C.pink : C.mint, q.of <= 6 ? q.of : 0);
        }
      }
      // the subtitle: ink 70%, the speaker's face, the name, the line in white, up to two rows
      const d = m.dialogue && m.dialogue.current, r = subRect;
      if (d || subWas) g.clearRect(r.x - 8, r.y - 8, r.w + 16, r.h + 16);
      if (d) {
        const face = Math.round(b.s(36, 48)), pad = 8, px = Math.round(b.s(14, 20)), namePx = Math.round(b.s(14, 16));
        g.shadowColor = 'transparent'; g.shadowBlur = 0; g.shadowOffsetY = 0;
        font(g, px); const tag = d.via && VIA[d.via] ? ' · ' + VIA[d.via].tag : '', name = d.name + tag;
        const words = d.text.split(' '), rowsOut = []; let cur = '';
        const maxW = r.w - face - pad * 3 - 4;
        for (const w of words) { const tt = cur ? cur + ' ' + w : w; if (g.measureText(tt).width > maxW && cur) { rowsOut.push(cur); cur = w; } else cur = tt; }
        if (cur) rowsOut.push(cur);
        const two = rowsOut.length > 1, lw = Math.max(...rowsOut.map((q) => g.measureText(q).width));
        font(g, namePx, 800); const nw = g.measureText(name).width;
        const h = Math.max(r.h, two ? px * 2 + namePx + 22 : r.h), w = Math.min(r.w, pad * 3 + face + Math.max(lw, two ? nw : nw + 10 + lw) + 8), x = r.x + (r.w - w) / 2, y0 = r.y + r.h - h;
        g.clearRect(r.x - 8, y0 - 8, r.w + 16, h + 16);
        g.globalAlpha = reduce ? 1 : clamp(d.t / 0.12, 0, 1);
        g.fillStyle = 'rgba(21, 15, 61, .7)'; g.beginPath(); g.roundRect(x, y0, w, h, 14); g.fill();
        g.drawImage(portrait(d.who), x + pad, y0 + (h - face) / 2, face, face);
        g.textAlign = 'left'; g.textBaseline = 'middle';
        const tx = x + pad * 2 + face;
        if (two || rowsOut.length === 0) {
          g.fillStyle = C.mango; font(g, namePx, 800); g.fillText(name, tx, y0 + 8 + namePx / 2);
          g.fillStyle = '#fff'; font(g, px); rowsOut.slice(0, 2).forEach((q, i) => g.fillText(q, tx, y0 + 14 + namePx + px / 2 + i * (px + 2)));
        } else {
          g.fillStyle = C.mango; font(g, namePx, 800); g.fillText(name, tx, y0 + h / 2 + 1);
          g.fillStyle = '#fff'; font(g, px); g.fillText(rowsOut[0], tx + nw + 10, y0 + h / 2 + 1);
        }
        g.globalAlpha = 1;
        api.lastSub = { who: d.who, name, text: d.text, rows: rowsOut.length, rect: { x, y: y0, w, h }, px, face };
        if (!subWas) stats.subtitles++;
      }
      // a spoken line hides the hint and the prompt (ui-kit: `subtitle`)
      if (!!d !== hidHints) { hidHints = !!d; hud.show('hint', !d); hud.show('prompt', !d); hud.show('subtitle', !d); }
      subWas = !!d;
      g.restore();
    }
    function meter(x, y, w, h, k, colour, pips) {
      g.shadowBlur = 0; g.shadowOffsetY = 0;
      g.fillStyle = 'rgba(21, 15, 61, .55)'; g.beginPath(); g.roundRect(x, y, w, h, h / 2); g.fill();
      if (k > 0) { g.fillStyle = colour; g.beginPath(); g.roundRect(x, y, Math.max(h, w * k), h, h / 2); g.fill(); }
      if (pips) { g.fillStyle = 'rgba(21, 15, 61, .8)'; for (let i = 1; i < pips; i++) g.fillRect(x + w * i / pips - 1, y, 2, h); }
      g.shadowColor = SHADOW; g.shadowBlur = 6; g.shadowOffsetY = 1;
    }

    api = {
      card, stats, portrait, lastSub: null,
      rects: () => { if (!box) measure(); return { objective: { x: box.x, y: box.y, w: box.w, h: box.gap }, block: { x: box.x, y: box.y, w: box.w, h: box.h }, subtitle: { ...subRect } }; },
      frame(time) {
        place(time); mapBlips();
        dom.classList.toggle('cut', !!view.cutscene);
        const key = view.choice ? view.choice.map((o) => o.id).join('|') : '';
        if (key !== choiceKey) {
          choiceKey = key; choiceEl.innerHTML = ''; choiceEl.classList.toggle('on', !!key);
          for (const o of view.choice || []) { const bt = document.createElement('button'); bt.textContent = o.text; bt.addEventListener('click', () => mis.choose(o.id)); choiceEl.appendChild(bt); }
        }
        paint(performance.now() / 1000);
      },
      info() {
        api.frame(ctx.loop.time);                 // a check may ask between frames
        const rc = api.rects(), ink = objWidth;
        return { objective: objText, objectiveInk: ink, timer: view.timer ? { ...view.timer } : null, clock: view.clock ?? null, bar: view.bar ? { ...view.bar } : null, cutscene: !!view.cutscene,
          markers: shown.map((q) => ({ id: q.id, kind: q.kind, x: q.x, z: q.z, r: q.r, colour: q.colour })), meshes: pool.filter((k) => k.grp.visible).length,
          blips: [...blips], route: routeKey, subtitle: m.dialogue && m.dialogue.current ? api.lastSub : null, portraits: Object.keys(portraits), card: card.info(), rects: rc, stats: { ...stats }, choice: choiceKey };
      },
    };
    ctx.test.missionUi = () => api.info();
    return api;
  },
  render(alpha, ctx) { api.frame(ctx.loop.time); },
};
