// The driving HUD: speed, gear, rev bar, drift score, the clock and the drop's score line.
// Public object: { state, update, drop(text), clipMode(on) }.
import { createHud } from './hud.js';

let hud, clockEl, lastClock = '';
export default {
  name: 'hud', order: 70,
  init(ctx) {
    hud = createHud(ctx.events);
    const hint = document.getElementById('hint');
    clockEl = document.getElementById('clock');
    clockEl.addEventListener('pointerdown', (e) => { e.preventDefault(); if (ctx.modules.clock) ctx.modules.clock.skip(); });
    ctx.events.on('input:first', () => { hint.style.opacity = 0; });
    // clip mode: hints, touch buttons and the drop line off (see index.html, body.clip)
    hud.clipMode = (on) => document.body.classList.toggle('clip', !!on);
    return hud;
  },
  render(alpha, ctx) {
    const m = ctx.modules, car = m.vehicles && m.vehicles.player;
    if (car) hud.update(ctx.loop.dt, car, m.audio ? m.audio.stats.q : 0);
    const hour = ctx.state.clock.hour, hh = Math.floor(hour), mm = Math.floor((hour - hh) * 60 / 10) * 10;
    const key = hh * 100 + mm;
    if (key !== lastClock) { lastClock = key; clockEl.textContent = String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0'); }
  },
};
