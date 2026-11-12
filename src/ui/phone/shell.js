// The phone's body and screen: page elements (plan/bible/art/ui-kit.md section 3, "Phone", "Home screen",
// "App pages"). D: 360 x 720 at right 80, top 180. P: 300 x 366 at right 14, top 12. Ink body with a sand edge,
// the screen filled with the sky colours of the hour, a 28 px bar with the clock, the weather and the unread count.
// It comes up from the bottom in 320 ms with an overshoot and goes down in 220 ms. No text is under 14 px.
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const svg = (body) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

// the kit's icons 37 to 44, on its 24-unit grid with 2-unit round strokes
export const ICONS = {
  messages: svg('<path d="M4 5h16v11H10l-4 4v-4H4z"/><path d="M8 9h8M8 12h5"/>'),
  map: svg('<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/><path d="M5 12h2M11 10h2M17 12h2" stroke-dasharray="1 2"/>'),
  camera: svg('<rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/>'),
  squawk: svg('<circle cx="10" cy="12" r="6"/><path d="M15 9l6-2-4 4M15 15l6 2-4-4" fill="currentColor"/><circle cx="9" cy="10.5" r="0.6" fill="currentColor"/>'),
  jobs: svg('<rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 4h6v3H9z" fill="currentColor"/><path d="M8 12l1.5 1.5L12 11M8 17l1.5 1.5L12 16M14 13h2M14 18h2"/>'),
  garage: svg('<rect x="4" y="6" width="16" height="14"/><path d="M4 10h16M4 14h16M4 18h16"/>'),
  stats: svg('<path d="M6 20v-6M12 20V9M18 20V4" stroke-width="3"/>'),
  settings: svg('<path d="M4 8h16M4 16h16"/><circle cx="9" cy="8" r="2.5" fill="currentColor"/><circle cx="15" cy="16" r="2.5" fill="currentColor"/>'),
  dot: svg('<circle cx="12" cy="12" r="5" fill="currentColor"/>'),
  sun: svg('<circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>'),
  rain: svg('<path d="M7 14a4 4 0 010-8 5 5 0 019.6 1A3.5 3.5 0 0116 14z"/><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/>'),
};

export const PHONE_CSS = `
#phone-veil { position: fixed; inset: 0; z-index: 37; background: rgba(21, 15, 61, .25); opacity: 0; visibility: hidden; transition: opacity .22s, visibility 0s .22s; }
#phone-veil.on { opacity: 1; visibility: visible; transition: opacity .32s; }
#phone { position: fixed; z-index: 38; right: calc(14px + var(--sr, 0px)); top: calc(12px + var(--st, 0px)); width: 300px; height: 366px; max-height: calc(100% - 24px); box-sizing: border-box;
  padding: 12px; background: #150f3d; border: 3px solid #fff1c9; border-radius: 28px; color: #fff; font-family: "Trebuchet MS", "Segoe UI", system-ui, sans-serif;
  display: flex; flex-direction: column; -webkit-user-select: none; user-select: none; touch-action: manipulation;
  transform: translateY(calc(100vh + 40px)); visibility: hidden; transition: transform .22s ease-in, visibility 0s .22s; }
#phone.on { transform: none; visibility: visible; transition: transform .32s cubic-bezier(0.34, 1.56, 0.64, 1); }
#phone.calm { transform: none; opacity: 0; transition: opacity .12s, visibility 0s .12s; }
#phone.calm.on { opacity: 1; transition: opacity .12s; }
.ph-screen { position: relative; flex: 1; min-height: 0; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; background: linear-gradient(#3fa9f5, #bfe9ff); }
.ph-bar { flex: none; height: 28px; display: flex; align-items: center; gap: 6px; padding: 0 12px; font-size: 14px; font-weight: 700; text-shadow: 0 1px 6px rgba(20, 5, 40, .7); }
.ph-bar svg { width: 16px; height: 16px; } .ph-bar .ph-grow { flex: 1; }
.ph-count { min-width: 18px; height: 18px; padding: 0 5px; box-sizing: border-box; border-radius: 9px; background: #ff4fa8; color: #fff; font-size: 14px; line-height: 18px; text-align: center; text-shadow: none; }
.ph-count:empty { display: none; }
.ph-home { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(4, 56px); gap: 8px 12px; justify-content: center; align-content: center; padding: 4px 0 6px; overflow-y: auto; }
.ph-app { position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 0; border: 0; background: none; color: #fff; font: inherit; font-size: 14px; cursor: pointer; text-shadow: 0 1px 6px rgba(20, 5, 40, .7); }
.ph-tile { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #150f3d; box-shadow: 0 2px 8px rgba(21, 15, 61, .35); transition: transform .12s; }
.ph-tile svg { width: 60%; height: 60%; }
.ph-app:focus-visible { outline: none; } .ph-app:focus-visible .ph-tile, .ph-app:active .ph-tile { transform: scale(.92); outline: 3px solid #29e6ff; }
.ph-app .ph-count { position: absolute; right: -4px; top: -4px; }
.ph-page { position: absolute; inset: 28px 0 0 0; display: none; flex-direction: column; background: rgba(21, 15, 61, .93); }
.ph-page.on { display: flex; animation: ph-grow .24s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes ph-grow { from { transform: scale(.2); opacity: 0; } to { transform: none; opacity: 1; } }
.ph-head { flex: none; height: 48px; display: flex; align-items: center; gap: 4px; padding: 0 8px; }
.ph-back { width: 44px; height: 44px; border: 0; background: none; color: #29e6ff; font: 800 26px/1 inherit; cursor: pointer; border-radius: 12px; }
.ph-back:focus-visible { outline: 2px solid #29e6ff; }
.ph-head h3 { margin: 0; font-size: 20px; font-style: italic; font-weight: 800; }
.ph-rows { flex: 1; min-height: 0; overflow-y: auto; padding: 0 6px 8px; touch-action: pan-y; }
.ph-row { position: relative; display: flex; align-items: center; gap: 10px; width: 100%; min-height: 52px; box-sizing: border-box; padding: 6px 8px; border: 0; border-radius: 12px; background: none; color: #fff;
  font: inherit; text-align: left; animation: ph-row .2s both; }
button.ph-row { cursor: pointer; } button.ph-row:active, button.ph-row:focus-visible { background: rgba(41, 230, 255, .2); outline: none; }
@keyframes ph-row { from { transform: translateX(20px); opacity: 0; } to { transform: none; opacity: 1; } }
.ph-icon { flex: none; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, .14); font-weight: 800; font-size: 18px; }
.ph-icon svg { width: 60%; height: 60%; }
.ph-text { flex: 1; min-width: 0; } .ph-text b { display: block; font-size: 16px; font-weight: 700; } .ph-text span { display: block; font-size: 14px; opacity: .78; overflow-wrap: anywhere; }
.ph-row.unread::after { content: ""; flex: none; width: 10px; height: 10px; border-radius: 50%; background: #ff4fa8; }
.ph-row.mine { flex-direction: row-reverse; text-align: right; }
.ph-value { flex: none; font-size: 16px; font-weight: 800; color: #ffa02e; }
.ph-note { padding: 14px 10px; font-size: 14px; opacity: .78; }
.ph-top { margin: 0 2px 6px; padding: 8px 10px; border-radius: 12px; background: rgba(255, 79, 168, .22); font-size: 14px; } .ph-top b { font-size: 18px; font-style: italic; font-weight: 800; color: #29e6ff; }
.ph-reply { margin: 4px 0 0; padding: 4px 8px; border-left: 3px solid #1fb5a8; font-size: 14px; opacity: .9; }
.ph-close { flex: none; height: 30px; margin-top: 6px; border: 0; background: none; color: #fff1c9; font: inherit; font-size: 14px; font-weight: 700; cursor: pointer; border-radius: 12px; }
.ph-close::before { content: ""; display: inline-block; width: 44px; height: 4px; margin-right: 8px; vertical-align: middle; border-radius: 2px; background: #fff1c9; }
.ph-close:focus-visible { outline: 2px solid #29e6ff; }
#phone-pill { position: fixed; z-index: 30; left: calc(14px + var(--sl, 0px)); bottom: 150px; max-width: min(300px, 60vw); padding: 6px 14px; border-radius: 18px; background: rgba(21, 15, 61, .55); color: #fff;
  font: 14px "Trebuchet MS", "Segoe UI", system-ui, sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0; transform: translateY(8px); transition: opacity .2s, transform .2s; pointer-events: none; }
#phone-pill.on { opacity: 1; transform: none; } #phone-pill b { color: #5dff9b; }
body.clip #phone-pill, body.menu-open #phone-pill, body.photo-mode #phone-pill { display: none; }
@media (min-width: 1000px) and (min-height: 900px) {
  #phone { width: 360px; height: 720px; right: calc(80px + var(--sr, 0px)); top: 180px; border-radius: 40px; }
  .ph-screen { border-radius: 30px; }
  .ph-home { grid-template-columns: repeat(2, 96px); gap: 24px; }
  .ph-tile { width: 96px; height: 96px; border-radius: 24px; }
  .ph-row { min-height: 64px; }
  .ph-close { height: 40px; }
}
#photo-ui { position: fixed; inset: 0; z-index: 45; display: none; cursor: grab; touch-action: none; font-family: "Trebuchet MS", "Segoe UI", system-ui, sans-serif; -webkit-user-select: none; user-select: none; }
#photo-ui.on { display: block; }
.photo-bar { position: absolute; left: 50%; bottom: calc(14px + var(--sb, 0px)); transform: translateX(-50%); display: flex; gap: 8px; max-width: calc(100% - 20px); flex-wrap: wrap; justify-content: center; }
.photo-bar button, .photo-row button { min-height: 48px; padding: 0 16px; border: 2px solid rgba(255, 255, 255, .55); border-radius: 24px; background: rgba(21, 15, 61, .55); color: #fff; font: 700 16px inherit; font-family: inherit; cursor: pointer; }
.photo-bar button.go, .photo-row button.go { background: #29e6ff; border-color: #29e6ff; color: #150f3d; }
.photo-bar button:focus-visible, .photo-row button:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.photo-flash { position: absolute; inset: 0; background: #fff; opacity: 0; pointer-events: none; } .photo-flash.go { animation: photo-flash .35s; }
@keyframes photo-flash { from { opacity: .9; } to { opacity: 0; } }
.photo-shown { position: absolute; inset: 0; display: none; flex-direction: column; align-items: center; justify-content: center; gap: 12px; background: rgba(21, 15, 61, .6); cursor: default; }
.photo-shown.on { display: flex; }
.photo-shown img { max-width: 78%; max-height: 70%; transform: rotate(-3deg); box-shadow: 0 20px 60px rgba(21, 15, 61, .5); border-radius: 6px; }
.photo-row { display: flex; gap: 10px; }
body.photo-mode #touch, body.photo-mode #foot-touch, body.photo-mode #touch-ui, body.photo-mode #touch-zone, body.photo-mode #combat-ui, body.photo-mode #combat-touch, body.photo-mode #mission-ui, body.photo-mode .radio-pill { visibility: hidden; }
body.photo-nohud #hud { visibility: hidden; }
@media (prefers-reduced-motion: reduce) { .ph-page.on, .ph-row { animation: none; } }
`;

// the sky's top and horizon colours of the hour, for the screen behind the icons
export function skyOf(hour) {
  if (hour >= 19.75 || hour < 5.5) return ['#150f3d', '#3b2a7a'];
  if (hour >= 17 || hour < 7) return ['#ff6fae', '#ffc46b'];
  return ['#3fa9f5', '#bfe9ff'];
}

export function createShell(ctx, phone) {
  const S = ctx.state;
  const style = el('style'); style.textContent = PHONE_CSS; document.head.appendChild(style);
  const veil = el('div'); veil.id = 'phone-veil';
  const body = el('div'); body.id = 'phone'; body.setAttribute('role', 'dialog'); body.setAttribute('aria-label', 'Phone');
  const screen = el('div', 'ph-screen'), bar = el('div', 'ph-bar'), home = el('div', 'ph-home'), page = el('div', 'ph-page');
  const clock = el('span'), weather = el('span'), count = el('span', 'ph-count');
  bar.appendChild(clock); bar.appendChild(weather); bar.appendChild(el('span', 'ph-grow')); bar.appendChild(count);
  const close = el('button', 'ph-close', 'Close'); close.type = 'button'; close.addEventListener('click', () => phone.close());
  screen.appendChild(bar); screen.appendChild(home); screen.appendChild(page);
  body.appendChild(screen); body.appendChild(close);
  document.body.appendChild(veil); document.body.appendChild(body);
  veil.addEventListener('pointerdown', () => phone.close());
  const pill = el('div'); pill.id = 'phone-pill'; document.body.appendChild(pill);
  let current = null, pillT = 0;

  // the pieces a page is built from
  const kit = {
    row(list, { icon, title, line, value, unread, mine, tap, reply }) {
      const r = el(tap ? 'button' : 'div', 'ph-row' + (unread ? ' unread' : '') + (mine ? ' mine' : '')); if (tap) { r.type = 'button'; r.addEventListener('click', () => tap(r)); }
      r.style.animationDelay = Math.min(10, list.children.length) * 30 + 'ms';
      const ic = el('span', 'ph-icon'); if (icon && ICONS[icon]) ic.innerHTML = ICONS[icon]; else ic.textContent = icon || '';
      const text = el('span', 'ph-text'); text.appendChild(el('b', '', title)); if (line) text.appendChild(el('span', '', line));
      if (reply) { const q = el('span', 'ph-reply', `${reply.who}: ${reply.text}`); text.appendChild(q); }
      r.appendChild(ic); r.appendChild(text); if (value != null) r.appendChild(el('span', 'ph-value', String(value)));
      list.appendChild(r); return r;
    },
    note(list, text) { const n = el('div', 'ph-note', text); list.appendChild(n); return n; },
    top(list, big, small) { const t = el('div', 'ph-top'); t.appendChild(el('b', '', big)); t.appendChild(document.createTextNode(' ' + small)); list.appendChild(t); return t; },
  };

  function drawHome() {
    home.textContent = '';
    for (const app of phone.apps) {
      const b = el('button', 'ph-app'); b.type = 'button'; b.dataset.app = app.id;
      const tile = el('span', 'ph-tile'); tile.style.background = app.colour || '#fff'; tile.innerHTML = ICONS[app.icon || app.id] || ICONS.dot;
      b.appendChild(tile); b.appendChild(el('span', '', app.title));
      const n = app.badge ? app.badge() : 0; if (n) b.appendChild(el('span', 'ph-count', String(n)));
      b.addEventListener('click', () => phone.show(app.id));
      home.appendChild(b);
    }
  }
  function drawBar() {
    const h = S.clock.hour, sky = skyOf(h);
    clock.textContent = String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.floor((h % 1) * 60)).padStart(2, '0');
    weather.innerHTML = /storm|rain|hurricane/.test(S.weather.kind || '') ? ICONS.rain : ICONS.sun;
    screen.style.background = `linear-gradient(${sky[0]}, ${sky[1]})`;
    const n = phone.unread; count.textContent = n ? String(n) : '';
  }
  function drawPage(app, grow) {
    page.textContent = '';
    const head = el('div', 'ph-head'), back = el('button', 'ph-back', '‹'); back.type = 'button'; back.setAttribute('aria-label', 'Back'); back.addEventListener('click', () => phone.home());
    head.appendChild(back); head.appendChild(el('h3', '', app.title));
    const list = el('div', 'ph-rows'); page.appendChild(head); page.appendChild(list);
    app.build(list, phone, kit);
    if (grow) {
      const icon = home.querySelector(`[data-app="${app.id}"]`), a = icon && icon.getBoundingClientRect(), b = screen.getBoundingClientRect();
      page.style.transformOrigin = a ? `${a.left + a.width / 2 - b.left}px ${a.top + a.height / 2 - b.top - 28}px` : '50% 50%';
      page.classList.remove('on'); void page.offsetWidth;
    }
    page.classList.add('on');
    if (grow) back.focus({ preventScroll: true });
  }

  return {
    body, veil, kit,
    get page() { return current; },
    open() { body.classList.toggle('calm', !!S.settings.reduceMotion); current = null; page.classList.remove('on'); drawBar(); drawHome(); body.classList.add('on'); veil.classList.add('on'); },
    close() { body.classList.remove('on'); veil.classList.remove('on'); current = null; if (body.contains(document.activeElement)) document.activeElement.blur(); },
    show(app) { current = app.id; drawPage(app, true); drawBar(); },
    home() { current = null; page.classList.remove('on'); drawHome(); drawBar(); },
    // something changed while the phone is up: paint what is showing again
    refresh() { drawBar(); if (current) { const app = phone.apps.find((a) => a.id === current); if (app) { const list = page.querySelector('.ph-rows'), at = list ? list.scrollTop : 0; drawPage(app, false); const now = page.querySelector('.ph-rows'); if (now) now.scrollTop = at; } } else drawHome(); },
    tick() { drawBar(); },
    // "a pill above the minimap for 4 s"
    pill(name, text) {
      const mm = ctx.modules.hud && ctx.modules.hud.layout().find((r) => r.id === 'minimap');
      if (mm) { pill.style.left = mm.x + 'px'; pill.style.bottom = Math.round(window.innerHeight - mm.y + 8) + 'px'; }
      pill.textContent = ''; pill.appendChild(el('b', '', name + ': ')); pill.appendChild(document.createTextNode(text));
      pill.classList.add('on'); clearTimeout(pillT); pillT = setTimeout(() => pill.classList.remove('on'), 4000);
    },
    info() {
      const r = body.getBoundingClientRect();
      return { rect: { x: r.x, y: r.y, w: r.width, h: r.height }, icons: [...home.querySelectorAll('.ph-app')].map((b) => b.dataset.app), rows: page.classList.contains('on') ? page.querySelectorAll('.ph-row').length : 0,
        title: page.classList.contains('on') ? page.querySelector('h3').textContent : null, pill: pill.classList.contains('on') ? pill.textContent : null,
        minFont: Math.min(...[...body.querySelectorAll('button, span, b, h3, div')].filter((e) => e.textContent && e.children.length === 0).map((e) => parseFloat(getComputedStyle(e).fontSize))) };
    },
  };
}
