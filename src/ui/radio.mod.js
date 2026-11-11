// The radio pill: the station and the song, and a ticker that scrolls whatever the host, an ad
// or the ident is saying. It sits in the rectangle the HUD keeps for `radio`. On a desktop it
// slides in from the right for 4 s when the station or the song changes and stays up while
// somebody talks; on a phone it is always there in a vehicle. Tap it or swipe it to change station.
// test.radioPill() → { shown, station, song, ticker, rect }
import { C } from './hud-draw.js';

const FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';
const CSS = `
#radio-pill { position: fixed; z-index: 6; box-sizing: border-box; display: flex; align-items: center; gap: 6px; padding: 0 10px 0 8px;
  border-radius: 999px; background: rgba(21, 15, 61, .78); color: ${C.sand}; font: 14px ${FONT}; white-space: nowrap; overflow: hidden;
  opacity: 0; transform: translateX(24px); transition: opacity .25s, transform .25s; pointer-events: none; touch-action: none; user-select: none; -webkit-user-select: none; }
#radio-pill.on { opacity: 1; transform: none; pointer-events: auto; }
#radio-pill svg { flex: none; }
#radio-pill .view { flex: 1; min-width: 0; overflow: hidden; position: relative; height: 100%; display: flex; align-items: center; }
#radio-pill b { font-style: italic; font-weight: 800; font-size: 15px; }
#radio-pill .song { opacity: .8; font-size: 13px; }
#radio-pill .now, #radio-pill .ticker { position: absolute; left: 0; }
#radio-pill .ticker { color: #fff; will-change: transform; }
#radio-pill .who { color: ${C.cyan}; font-weight: 700; }
body.menu-open #radio-pill { opacity: 0; }
`;
const NOTE = `<svg width="14" height="16" viewBox="0 0 14 16"><path d="M5 2.5 12 1v9.2a2.3 2.3 0 1 1-1.4-2.1V4L6.4 4.9v6.9A2.3 2.3 0 1 1 5 9.7z" fill="${C.cyan}"/></svg>`;

export default {
  name: 'radioPill', order: 76, needs: ['hud', 'radio'],
  init(ctx) {
    const { events } = ctx, hud = ctx.modules.hud, radio = ctx.modules.radio;
    const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
    const el = document.createElement('div'); el.id = 'radio-pill';
    el.innerHTML = `${NOTE}<div class="view"><span class="now"><b></b><span class="song"></span></span><span class="ticker"></span></div>`;
    document.body.appendChild(el);
    const name = el.querySelector('b'), song = el.querySelector('.song'), now = el.querySelector('.now'), ticker = el.querySelector('.ticker'), view = el.querySelector('.view');
    const pill = { shown: false, station: '', song: '', ticker: '', until: 0, talkUntil: 0, shows: 0, lines: 0, at: 0 };
    let anim = null, downX = null;

    function place() {
      const r = hud && hud.layout().find((x) => x.id === 'radio');
      if (!r) return;
      Object.assign(el.style, { left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px' });
      song.style.display = hud.mode === 'D' && r.w >= 180 ? '' : 'none';
      pill.rect = { x: r.x, y: r.y, w: r.w, h: r.h };
    }
    const clock = () => performance.now() / 1000;
    function refresh() {
      const always = hud && hud.mode !== 'D';              // phones: always there in a vehicle
      const want = !!radio && radio.on && !(hud && hud.clip) && (always || clock() < pill.until || clock() < pill.talkUntil);
      if (want && !pill.shown) { place(); pill.shows++; }
      pill.shown = want; el.classList.toggle('on', want);
      if (clock() >= pill.talkUntil && pill.ticker) endTalk();
    }
    function endTalk() { pill.ticker = ''; ticker.textContent = ''; now.style.visibility = ''; if (anim) anim.cancel(); anim = null; }
    const peek = (s = 4) => { pill.until = Math.max(pill.until, clock() + s); refresh(); };

    events.on('radio:station', (s) => { pill.at = clock(); pill.station = s.name; pill.song = ''; name.textContent = s.name; song.textContent = ' · ' + s.freq; endTalk(); pill.talkUntil = 0; peek(); });
    events.on('radio:song', (s) => { pill.song = s.title; song.textContent = ' · ' + s.title; peek(); });
    events.on('radio:line', (l) => {
      // the words scroll through once, at the pace they are spoken
      pill.lines++; pill.ticker = l.text; pill.talkUntil = clock() + l.seconds + 0.6;
      ticker.innerHTML = '<span class="who"></span> '; ticker.firstChild.textContent = l.who + ':'; ticker.append(l.text);
      now.style.visibility = 'hidden'; refresh();
      if (anim) anim.cancel();
      const w = view.clientWidth || 150, tw = ticker.scrollWidth || l.text.length * 7;
      anim = ticker.animate([{ transform: `translateX(${Math.round(w * 0.6)}px)` }, { transform: `translateX(${-tw}px)` }], { duration: (l.seconds + 0.5) * 1000, easing: 'linear', fill: 'forwards' });
    });
    events.on('radio:off', () => { endTalk(); pill.until = pill.talkUntil = 0; refresh(); });
    events.on('hud:layout', place); events.on('view:resize', place);

    // a tap is the next station; a swipe picks the side
    el.addEventListener('pointerdown', (e) => { downX = e.clientX; e.preventDefault(); });
    el.addEventListener('pointerup', (e) => { if (downX == null) return; const dx = e.clientX - downX; downX = null; if (dx > 24) radio.prev(); else radio.next(); });
    el.addEventListener('pointercancel', () => { downX = null; });

    place();
    pill.refresh = refresh; pill.el = el;
    ctx.test.radioPill = () => { refresh(); return { shown: pill.shown, station: pill.station, song: pill.song, ticker: pill.ticker, rect: pill.rect, shows: pill.shows, lines: pill.lines, age: clock() - pill.at, on: !!radio.on, clip: !!(hud && hud.clip), mode: hud && hud.mode, opacity: +getComputedStyle(el).opacity }; };
    return pill;
  },
  render(alpha, ctx) { ctx.modules.radioPill.refresh(); },
};
