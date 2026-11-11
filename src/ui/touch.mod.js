// Touch controls: three layouts (driving, on foot, a menu is open) for a phone held sideways or
// upright. Buttons are page elements, so they are never in a photo or a clip. Places and sizes are
// plan/bible/art/ui-kit.md section 6: nothing under 64 px, everything inside the safe areas.
// The driving buttons are made by index.html (#touch) and the on-foot ones by the player lane's
// stand-in (#foot-touch); this module lays both out, and makes them itself where they are missing.
// It adds the buttons that are always there (pause, camera; phone and the lead switch once those
// ship) and a stick that appears under the thumb anywhere in the lower left of the screen.
// Public object: mode ('drive', 'foot', 'menu', or 'off' without touch) · layout() → [{ id, x, y, w, h }] ·
//   enable(id, on) for 'phone' and 'switch'.

const B = (px) => `calc(${px}px + var(--sb, 0px))`, R = (px) => `calc(${px}px + var(--sr, 0px))`, T = (px) => `calc(${px}px + var(--st, 0px))`;
// the top row of buttons sits at 138, or higher on a short screen so it stays 8 px clear of the horn and the context button
const ROW = 'min(calc(138px + var(--st, 0px)), calc(100vh - var(--sb, 0px) - 250px))';
const at = (sel, size, rules) => `${sel} { width: ${size}px; height: ${size}px; ${rules} }\n`;
const CSS = `
#touch-ui, #touch-zone { display: none; }
@media (pointer: coarse) {
  #touch .pad { display: contents; }
  #touch .btn, #foot-touch .fbtn, #touch-ui .tbtn { position: fixed; z-index: 8; font-size: 14px; line-height: 1.1; font-weight: bold; left: auto; top: auto; }
  #touch .btn { font-size: 14px; }
  #foot-touch #foot-stick { z-index: 8; width: 120px; height: 120px; left: var(--stick-l, 148px); bottom: ${B(26)}; opacity: .35; }
  #foot-touch #foot-stick.live { opacity: 1; }
  #foot-touch #foot-nub { left: 28px; top: 28px; }
  #touch-ui { display: block; }
  #touch-ui .tbtn { width: 64px; height: 64px; box-sizing: border-box; border-radius: 50%; border: 2px solid rgba(255, 255, 255, .55);
    background: rgba(21, 15, 61, .35); color: #fff; display: flex; align-items: center; justify-content: center; text-align: center; touch-action: none; top: ${ROW}; }
  #touch-ui .tbtn.on, #touch-ui .tbtn:active { background: rgba(255, 79, 168, .6); border-color: #fff; }
  #touch-ui .tbtn.off, body:not(.on-foot) #touch-ui .foot-only { display: none; }
  #touch-pause { right: ${R(14)}; } #touch-camera { right: ${R(86)}; } #touch-phone { right: ${R(158)}; } #touch-switch { right: ${R(230)}; }
  #foot-touch #foot-use { border-color: #29e6ff; }
  body.on-foot #touch-zone { display: block; position: fixed; z-index: 6; left: 0; width: 45%; top: 30%; bottom: 0; touch-action: none; }
  body.menu-open #touch, body.menu-open #foot-touch, body.menu-open #touch-ui, body.menu-open #touch-zone,
  body.clip #touch-ui, body.clip #touch-zone { display: none !important; }
${at('#touch [data-key=left]', 72, `left: var(--steer-l, 150px); bottom: ${B(18)};`)}${at('#touch [data-key=right]', 72, `left: calc(var(--steer-l, 150px) + 84px); bottom: ${B(18)};`)
}${at('#touch [data-key=gas]', 84, `right: ${R(16)}; bottom: ${B(18)};`)}${at('#touch [data-key=brake]', 72, `right: ${R(112)}; bottom: ${B(18)};`)
}${at('#touch [data-key=handbrake]', 64, `right: ${R(116)}; bottom: ${B(102)};`)}${at('#touch [data-key=horn]', 64, `right: ${R(26)}; bottom: ${B(114)};`)
}${at('#touch [data-key=back]', 64, `right: ${R(196)}; bottom: ${B(102)};`)}${at('#touch [data-press=KeyC]', 64, `right: ${R(86)}; top: ${ROW};`)
}${at('body #foot-touch #foot-out', 64, `right: ${R(196)}; bottom: ${B(18)};`)}${at('#foot-touch #foot-jump', 72, `right: ${R(16)}; bottom: ${B(18)};`)
}${at('#foot-touch #foot-sprint', 72, `right: ${R(100)}; bottom: ${B(18)};`)}${at('body #foot-touch #foot-use', 72, `right: ${R(22)}; bottom: ${B(102)};`)}
}
@media (pointer: coarse) and (orientation: portrait) {
  #touch-ui .tbtn, #touch [data-press=KeyC] { top: ${T(172)}; }
  body #foot-touch #foot-out { right: ${R(196)}; bottom: ${B(102)}; }
  #touch [data-key=back] { right: auto; left: calc(16px + var(--sl, 0px)); bottom: ${B(102)}; }
  #foot-touch #foot-stick { bottom: ${B(30)}; }
}
`;
const DRIVE_HTML = '<div class="pad left"><div class="btn small" data-press="KeyC">Camera</div><div class="btn small" data-key="horn">Horn</div>'
  + '<div class="btn" data-key="left">◀</div><div class="btn" data-key="right">▶</div></div>'
  + '<div class="pad right"><div class="btn small" data-key="handbrake">Hand<br>brake</div><div class="btn small" data-key="back">Look<br>back</div>'
  + '<div class="btn small" data-key="brake">Brake</div><div class="btn small" data-key="gas">Gas</div></div>';
const FOOT_HTML = '<div id="foot-stick" class="foot-only"><div id="foot-nub"></div></div><div id="foot-jump" class="fbtn foot-only" data-key="jump">Jump</div>'
  + '<div id="foot-sprint" class="fbtn foot-only" data-key="sprint">Sprint</div><div id="foot-use" class="fbtn foot-only off" data-press="interact">Get in</div>'
  + '<div id="foot-out" class="fbtn" data-press="interact">Get out</div>';
// the look of a button made here, when the page and the stand-in no longer bring their own
const OWN_CSS = `@media (pointer: coarse) { #touch.own, #foot-touch.own { display: block; }
  .own .btn, .own .fbtn { box-sizing: border-box; border-radius: 50%; border: 2px solid rgba(255, 255, 255, .55); background: rgba(21, 15, 61, .35); color: #fff;
    display: flex; align-items: center; justify-content: center; text-align: center; touch-action: none; }
  .own .btn.on, .own .fbtn.on { background: rgba(255, 79, 168, .6); border-color: #fff; }
  .own #foot-stick { position: fixed; box-sizing: border-box; border-radius: 50%; border: 2px solid rgba(255, 255, 255, .45); background: rgba(21, 15, 61, .28); pointer-events: none; }
  .own #foot-nub { position: absolute; width: 60px; height: 60px; border-radius: 50%; background: rgba(255, 255, 255, .55); }
  body.on-foot #touch.own, body.on-foot .own #foot-out, body:not(.on-foot) .own .foot-only, .own #foot-use.off { display: none !important; } }
#touch.own, #foot-touch.own { display: none; }`;
const REACH = 46;

let frame = () => {};
export default {
  name: 'touch', order: 76,
  init(ctx) {
    const coarse = window.matchMedia('(pointer: coarse)'), input = ctx.input, S = ctx.state, ev = ctx.events;
    const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
    const make = (id, html) => { const d = document.createElement('div'); d.id = id; d.innerHTML = html; document.body.appendChild(d); return d; };
    const bindAll = (root) => { for (const b of root.querySelectorAll('[data-key], [data-press]')) input.bind(b); };
    // adopt the page's driving buttons and the stand-in's on-foot buttons, or make them
    let own = false;
    if (!document.getElementById('touch')) { const d = make('touch', DRIVE_HTML); d.className = 'own'; bindAll(d); own = true; }
    let ownFoot = false;
    if (!document.getElementById('foot-touch')) { const d = make('foot-touch', FOOT_HTML); d.className = 'own'; bindAll(d); own = ownFoot = true; }
    if (own) { const s = document.createElement('style'); s.textContent = OWN_CSS; document.head.appendChild(s); }
    const ui = make('touch-ui', '<div id="touch-pause" class="tbtn">Pause</div><div id="touch-camera" class="tbtn foot-only" data-press="camera">Camera</div>'
      + '<div id="touch-phone" class="tbtn off" data-press="phone">Phone</div><div id="touch-switch" class="tbtn off" data-press="switch">Switch</div>');
    bindAll(ui);
    ui.querySelector('#touch-pause').addEventListener('pointerdown', (e) => { e.preventDefault(); if (ctx.modules.menus) ctx.modules.menus.open('pause'); });
    const zone = make('touch-zone', '');
    const stick = document.getElementById('foot-stick'), nub = document.getElementById('foot-nub'), use = document.getElementById('foot-use');

    // the stick appears under the thumb anywhere in the zone, off the minimap, and goes home when let go
    let finger = -1, ox = 0, oy = 0;
    const home = () => { finger = -1; stick.classList.remove('live'); stick.style.left = stick.style.top = stick.style.bottom = ''; nub.style.transform = ''; input.stick(0, 0); };
    zone.addEventListener('pointerdown', (e) => {
      if (finger >= 0) return;
      const hud = ctx.modules.hud, mm = hud && hud.layout().find((r) => r.id === 'minimap');
      if (mm && e.clientX >= mm.x && e.clientX <= mm.x + mm.w && e.clientY >= mm.y && e.clientY <= mm.y + mm.h) return;
      e.preventDefault();
      finger = e.pointerId; ox = e.clientX; oy = e.clientY;
      try { zone.setPointerCapture(e.pointerId); } catch { /* an old browser */ }
      stick.classList.add('live');
      stick.style.left = ox - 60 + 'px'; stick.style.top = oy - 60 + 'px'; stick.style.bottom = 'auto';
      input.stick(0, 0);
    });
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerId !== finger) return;
      let dx = e.clientX - ox, dy = e.clientY - oy;
      const d = Math.hypot(dx, dy);
      if (d > REACH) { dx *= REACH / d; dy *= REACH / d; }
      nub.style.transform = `translate(${dx}px, ${dy}px)`;
      input.stick(dx / REACH, -dy / REACH);
    });
    const letGo = (e) => { if (e.pointerId === finger) home(); };
    zone.addEventListener('pointerup', letGo); zone.addEventListener('pointercancel', letGo);

    // where the steer buttons and the resting stick start: beside the minimap sideways, at the edge upright
    function place() {
      const hud = ctx.modules.hud, st = document.documentElement.style;
      const mm = hud && hud.layout().find((r) => r.id === 'minimap'), up = window.innerHeight > window.innerWidth;
      const edge = hud ? hud.insets.l : 0;
      st.setProperty('--steer-l', (up || !mm ? edge + 16 : mm.x + mm.w + 16) + 'px');
      st.setProperty('--stick-l', (up || !mm ? edge + 30 : mm.x + mm.w + 14) + 'px');
    }
    ev.on('hud:layout', place); place();
    // with our own on-foot buttons, the context button follows the prompt
    if (ownFoot) ev.on('ui:prompt', (p) => { use.classList.toggle('off', !(p && p.text)); if (p && p.text) use.textContent = p.text; });

    let mode = '';
    frame = () => {
      const next = !coarse.matches ? 'off' : S.ui.paused || (ctx.modules.menus && ctx.modules.menus.isOpen) ? 'menu' : S.player.mode === 'foot' ? 'foot' : 'drive';
      if (next === mode) return;
      if (mode === 'foot' && finger >= 0) home();
      mode = next;
      document.body.dataset.touch = mode;
      if (ownFoot) document.body.classList.toggle('on-foot', S.player.mode === 'foot');
    };
    const shown = (e) => { const b = e.getBoundingClientRect(); return getComputedStyle(e).display !== 'none' && b.width > 0 ? { id: e.id || e.dataset.key || e.dataset.press, x: b.left, y: b.top, w: b.width, h: b.height } : null; };
    return {
      get mode() { return mode; },
      layout: () => [...document.querySelectorAll('#touch .btn, #foot-touch .fbtn, #foot-stick, #touch-ui .tbtn')].map(shown).filter(Boolean),
      enable(id, on) { const b = document.getElementById('touch-' + id); if (b) b.classList.toggle('off', !on); },
    };
  },
  render() { frame(); },
};
