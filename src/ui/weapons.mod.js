// What the fight shows and how it is held: the three-slot quick bar (a bar, not a wheel), the health and
// armour bars (only when not full), the Lock and Fire touch buttons, the mouse, key and pad bindings for
// aim and fire, and our Knocked out screen: the view tilts and drains of colour and a hospital wristband
// slides in with the bill (plan/bible/art/ui-kit.md). Page elements, shown on foot only.
// Keys: right mouse (or L) holds the lock, left mouse (or Ctrl) fires, 1 2 3 pick a slot, G is the next target.
// Pad: left trigger locks, right trigger fires, d-pad left and right step through the slots.
// Public object: { bar, vitals, knockedOut { open, show(data), hide() }, layout() }.
import { WEAPONS, SLOTS, SLOT_NAMES, WHO } from '../content/weapons.js';

const FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif', INK = '#150f3d', PINK = '#ff4fa8', MINT = '#8fe3cf';
const CSS = `
#combat-ui { position: fixed; right: calc(24px + var(--sr, 0px)); bottom: calc(118px + var(--sb, 0px)); display: none; flex-direction: column; gap: 6px; align-items: stretch;
  font-family: ${FONT}; z-index: 6; user-select: none; -webkit-user-select: none; }
body.on-foot #combat-ui { display: flex; }
body.clip #combat-ui, body.menu-open #combat-ui, body.clip #combat-touch { display: none; }
#quickbar { display: flex; gap: 6px; }
#quickbar .qslot { min-width: 84px; height: 44px; box-sizing: border-box; padding: 3px 10px; border-radius: 22px; border: 2px solid transparent; background: rgba(21, 15, 61, .55);
  color: #fff; font: 700 14px ${FONT}; text-align: left; line-height: 17px; cursor: pointer; touch-action: none; }
#quickbar .qslot small { display: block; font: 400 14px ${FONT}; opacity: .8; }
#quickbar .qslot.on { border-color: ${PINK}; background: rgba(21, 15, 61, .8); }
#quickbar .qslot.none { opacity: .45; }
#vitals { display: none; flex-direction: column; gap: 3px; }
#vitals.on { display: flex; }
#vitals .vbar { height: 8px; border-radius: 4px; background: rgba(21, 15, 61, .55); overflow: hidden; }
#vitals .vbar i { display: block; height: 100%; border-radius: 4px; background: #5dff9b; }
#vitals .vbar.low i { background: ${PINK}; }
#vitals .vbar.vest i { background: #29e6ff; }
#vitals .vbar.off { display: none; }
#combat-touch { display: none; }
@media (pointer: coarse) {
  body.on-foot #combat-touch { display: block; }
  #combat-ui { bottom: auto; top: calc(46px + var(--st, 0px)); right: calc(14px + var(--sr, 0px)); }
  #quickbar .qslot { min-width: 72px; height: 64px; padding-top: 12px; }
}
#combat-touch .cbtn { position: fixed; width: 72px; height: 72px; box-sizing: border-box; border-radius: 50%; border: 2px solid rgba(255, 255, 255, .55); background: rgba(21, 15, 61, .35);
  color: #fff; font: 700 14px ${FONT}; display: flex; align-items: center; justify-content: center; touch-action: none; user-select: none; -webkit-user-select: none; }
#combat-touch .cbtn.on { background: rgba(255, 79, 168, .6); border-color: #fff; }
#touch-fire { right: calc(100px + var(--sr, 0px)); bottom: calc(102px + var(--sb, 0px)); }
#touch-lock { right: calc(184px + var(--sr, 0px)); bottom: calc(18px + var(--sb, 0px)); }
#hurt-flash { position: fixed; inset: 0; pointer-events: none; box-shadow: inset 0 0 120px 30px rgba(255, 79, 168, .75); opacity: 0; transition: opacity .5s; z-index: 5; }
#hurt-flash.on { opacity: 1; transition: none; }
#game.ko { filter: grayscale(1) contrast(.92); transform: rotate(12deg) scale(1.32); transition: filter .6s, transform .6s; }
#game.ko.flat { transform: none; }
#knockedout { position: fixed; inset: 0; display: none; z-index: 40; overflow: hidden; }
#knockedout.open { display: block; }
#knockedout canvas { position: absolute; left: 50%; top: 57%; width: min(1200px, max(62.5vw, 560px), 94vw); transform: translate(-260%, -50%) rotate(-4deg);
  transition: transform .38s cubic-bezier(0.34, 1.56, 0.64, 1); filter: drop-shadow(0 6px 14px rgba(20, 5, 40, .5)); }
#knockedout.in canvas { transform: translate(-50%, -50%) rotate(-4deg); }
#knockedout.out canvas { transform: translate(160%, -50%) rotate(-4deg); transition: transform .3s ease-in; }
#ko-white { position: fixed; inset: 0; background: #fff; opacity: 0; pointer-events: none; z-index: 41; transition: opacity .6s; }
#ko-white.on { opacity: 1; transition: none; }
`;
const el = (tag, id, cls, text) => { const e = document.createElement(tag); if (id) e.id = id; if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

// the wristband, 1200 x 120 design pixels, drawn once per visit
function drawBand(g, d) {
  g.clearRect(0, 0, 1200, 120);
  g.fillStyle = '#fdf6ea'; g.beginPath(); g.roundRect(0, 0, 1200, 120, 60); g.fill();
  g.save(); g.clip(); g.fillStyle = MINT; g.fillRect(0, 0, 1200, 10); g.fillRect(0, 110, 1200, 10); g.restore();
  g.fillStyle = '#c8ccd2'; g.beginPath(); g.arc(60, 60, 18, 0, 6.3); g.fill();
  g.fillStyle = 'rgba(21,15,61,0.3)'; g.beginPath(); g.arc(60, 60, 8, 0, 6.3); g.fill();
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  g.fillStyle = 'rgba(21,15,61,0.6)'; g.font = `700 28px ${FONT}`; g.letterSpacing = '3px'; g.fillText('Bayhaven General', 110, 46); g.letterSpacing = '0px';
  g.fillStyle = INK; g.font = `italic 800 40px ${FONT}`; g.fillText(d.name, 110, 96);
  let s = d.seed >>> 0, x = 540;
  for (let i = 0; i < 24 && x < 756; i++) { s = (s * 1664525 + 1013904223) >>> 0; const w = 2 + (s >>> 28) % 5; g.fillRect(x, 28, w, 64); x += w + 3 + (s >>> 20) % 3; }
  g.fillStyle = PINK; g.font = `800 40px ${FONT}`; g.fillText('Bill ' + money(d.bill), 780, 58);
  g.fillStyle = 'rgba(21,15,61,0.6)'; g.font = `400 28px ${FONT}`; g.fillText(d.bill >= 2500 ? 'The most they can charge' : '5% of cash', 780, 100);
  g.fillStyle = 'rgba(21,15,61,0.3)'; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(1090 + i * 20, 60, 5, 0, 6.3); g.fill(); }
}

let frame = null;
export default {
  name: 'weapons', order: 77, needs: ['combat', 'health'],
  init(ctx) {
    const S = ctx.state, ev = ctx.events, m = ctx.modules, A = ctx.input.actions, C = S.combat, p = S.player;
    const style = el('style'); style.textContent = CSS; document.head.appendChild(style);
    const root = el('div', 'combat-ui'), vitals = el('div', 'vitals'), bar = el('div', 'quickbar');
    const hp = el('div', null, 'vbar'), hpFill = el('i'), vest = el('div', null, 'vbar vest'), vestFill = el('i');
    hp.appendChild(hpFill); vest.appendChild(vestFill); vitals.append(hp, vest);
    hp.setAttribute('role', 'meter'); hp.setAttribute('aria-label', 'Health'); vest.setAttribute('role', 'meter'); vest.setAttribute('aria-label', 'Armour');
    const slots = SLOTS.map((s, i) => {
      const b = el('button', null, 'qslot'); b.dataset.slot = s; b.type = 'button';
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); m.combat.select(s); });
      bar.appendChild(b); return b;
    });
    root.append(vitals, bar); document.body.appendChild(root);
    const flash = el('div', 'hurt-flash'); document.body.appendChild(flash);

    // ---- holding aim and fire ----
    const held = { mouseAim: false, mouseFire: false, keyAim: false, keyFire: false, touchAim: false, touchFire: false, padAim: false, padFire: false };
    const game = document.getElementById('game');
    window.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.target !== game) return; if (e.button === 0) held.mouseFire = true; else if (e.button === 2) held.mouseAim = true; });
    window.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') return; if (e.button === 0) held.mouseFire = false; else if (e.button === 2) held.mouseAim = false; });
    window.addEventListener('blur', () => { for (const k in held) if (k !== 'touchAim') held[k] = false; });
    window.addEventListener('keydown', (e) => {
      if (e.repeat || (S.ui && S.ui.paused)) return;
      if (e.code === 'KeyL') held.keyAim = true; else if (e.code === 'ControlLeft' || e.code === 'ControlRight') held.keyFire = true;
      else if (e.code === 'KeyG') m.combat.cycle();
      else if (/^Digit[1-3]$/.test(e.code) && !ctx.params.has('debug')) m.combat.select(SLOTS[+e.code.slice(5) - 1]);
    });
    window.addEventListener('keyup', (e) => { if (e.code === 'KeyL') held.keyAim = false; else if (e.code === 'ControlLeft' || e.code === 'ControlRight') held.keyFire = false; });
    const touch = el('div', 'combat-touch'), fire = el('div', 'touch-fire', 'cbtn', 'Fire'), lockBtn = el('div', 'touch-lock', 'cbtn', 'Lock');
    touch.append(fire, lockBtn); document.body.appendChild(touch);
    const press = (on) => (e) => { e.preventDefault(); held.touchFire = on; fire.classList.toggle('on', on); if (on) { A.touch = true; try { fire.setPointerCapture(e.pointerId); } catch { /* not a live pointer */ } } };
    fire.addEventListener('pointerdown', press(true)); for (const n of ['pointerup', 'pointercancel', 'lostpointercapture']) fire.addEventListener(n, press(false));
    lockBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); held.touchAim = !held.touchAim; lockBtn.classList.toggle('on', held.touchAim); });
    let padWas = 0;
    function pad() {
      held.padAim = held.padFire = false;
      if (p.mode !== 'foot' || !navigator.getGamepads) return;
      for (const g of navigator.getGamepads()) {
        if (!g || !g.buttons || g.buttons.length < 16) continue;
        const b = (i) => (g.buttons[i] ? g.buttons[i].value || (g.buttons[i].pressed ? 1 : 0) : 0);
        held.padAim = b(6) > 0.4; held.padFire = b(7) > 0.4;
        const step = b(15) > 0.5 ? 1 : b(14) > 0.5 ? -1 : 0;
        if (step && !padWas) { const have = SLOTS.filter((s) => C.inv[s]), i = have.indexOf(C.slot); m.combat.select(have[(i + step + have.length) % have.length]); }
        padWas = step;
        break;
      }
    }

    // ---- knocked out ----
    const ko = el('div', 'knockedout'), band = el('canvas'), white = el('div', 'ko-white');
    band.width = 1200; band.height = 120; ko.appendChild(band); ko.setAttribute('role', 'dialog'); ko.setAttribute('aria-label', 'Knocked out');
    document.body.append(ko, white);
    const K = { open: false, data: null, at: 0, timers: [] };
    const later = (ms, fn) => K.timers.push(setTimeout(fn, ms));
    function show(d) {
      hide(true);
      const calm = !!S.settings.reduceMotion;
      K.open = true; K.at = performance.now();
      K.data = { name: d.lead === 'mags' ? 'Mags' : 'Navarro, Teo', bill: d.bill || 0, seed: Math.round((d.x || 0) * 31 + (d.z || 0) * 17 + (d.bill || 0)) };
      drawBand(band.getContext('2d'), K.data);
      if (game) { game.classList.add('ko'); game.classList.toggle('flat', calm); }
      ko.className = 'open';
      later(calm ? 100 : 900, () => ko.classList.add('in'));
    }
    function hide(quiet) {
      for (const t of K.timers) clearTimeout(t); K.timers.length = 0;
      if (!K.open) return;
      K.open = false; ko.className = '';
      if (game) game.classList.remove('ko', 'flat');
      if (!quiet) { white.classList.add('on'); void white.offsetWidth; white.classList.remove('on'); }       // a 600 ms fade from white
    }
    // a press sends the band out to the right, then he wakes
    function dismiss() { if (!K.open || performance.now() - K.at < 1400 || ko.classList.contains('out')) return; ko.classList.add('out'); later(300, () => m.health.wake()); }
    ko.addEventListener('pointerdown', dismiss);
    window.addEventListener('keydown', (e) => { if (K.open && (e.code === 'Enter' || e.code === 'Space')) dismiss(); });
    ev.on('player:knockedout', show);
    ev.on('player:woke', () => { hide(false); held.touchAim = false; lockBtn.classList.remove('on'); });
    ev.on('game:reset', () => hide(true));
    ev.on('player:hurt', () => { if (S.settings.reduceMotion) return; flash.classList.add('on'); void flash.offsetWidth; flash.classList.remove('on'); });
    let hinted = false;
    ev.on('weapon:picked', () => {
      if (hinted) return; hinted = true;
      ev.emit('ui:hint', { id: 'combat', seconds: 9, text: A.touch ? 'Tap a slot to switch. Lock picks the nearest threat, Fire does the rest' : 'Hold right mouse to lock on, left mouse to fire, 1 2 3 to switch' });
    });

    let sig = '';
    frame = () => {
      pad();
      if (!ctx.input.scripted()) {
        const foot = p.mode === 'foot' && !K.open;
        A.aim = foot && (held.mouseAim || held.keyAim || held.touchAim || held.padAim);
        A.fire = foot && (held.mouseFire || held.keyFire || held.touchFire || held.padFire);
      }
      const h = Math.max(0, Math.min(100, p.health)), a = Math.max(0, Math.min(100, p.armour || 0)), showH = h < WHO.player.health, showA = a > 0 && a < WHO.player.vest;
      const next = [C.slot, C.weapon, C.ammo, C.spare, C.reloading, C.inv.hand, C.inv.sidearm, C.inv.long, Math.round(h), Math.round(a)].join('|');
      if (next === sig) return;
      sig = next;
      slots.forEach((b, i) => {
        const s = SLOTS[i], id = C.inv[s], w = id && WEAPONS[id], on = s === C.slot;
        b.classList.toggle('on', on); b.classList.toggle('none', !w);
        const ammo = !w ? 'Empty' : !w.holds ? SLOT_NAMES[s] : on ? (C.reloading ? 'Reloading' : C.ammo + ' / ' + C.spare) : 'Ready';
        b.innerHTML = ''; b.append(w ? w.name : SLOT_NAMES[s], el('small', null, null, ammo));
        b.setAttribute('aria-pressed', on);
      });
      vitals.classList.toggle('on', showH || showA);
      hp.classList.toggle('off', !showH && !showA); hp.classList.toggle('low', h < 30); hpFill.style.width = h + '%'; hp.setAttribute('aria-valuenow', Math.round(h));
      vest.classList.toggle('off', a <= 0); vestFill.style.width = a + '%'; vest.setAttribute('aria-valuenow', Math.round(a));
    };

    const rect = (e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
    const api = { bar, vitals, knockedOut: { get open() { return K.open; }, show, hide, dismiss, get data() { return K.data; } },
      layout: () => [{ id: 'quickbar', ...rect(bar) }, { id: 'vitals', ...rect(vitals) }, { id: 'fire', ...rect(fire) }, { id: 'lock', ...rect(lockBtn) }] };
    ctx.test.weaponsUi = () => ({ shown: getComputedStyle(root).display !== 'none', slots: slots.map((b) => ({ slot: b.dataset.slot, text: b.textContent, on: b.classList.contains('on'), empty: b.classList.contains('none'), ...rect(b) })),
      vitals: { shown: vitals.classList.contains('on'), health: hpFill.style.width, armour: vestFill.style.width, armourShown: !vest.classList.contains('off') },
      knockedOut: { open: K.open, data: K.data, tilted: !!game && game.classList.contains('ko'), flat: !!game && game.classList.contains('flat') }, layout: api.layout(), held: { ...held }, aim: A.aim, fire: A.fire });
    return api;
  },
  render() { if (frame) frame(); },
};
