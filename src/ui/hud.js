// The driving HUD: speed, gear, a rev bar, and the drift score.

const fmt = (n) => Math.round(n).toLocaleString('en-US');

export function createHud(events) {
  const $ = (id) => document.getElementById(id);
  const kmhEl = $('kmh'), gearEl = $('gear'), revEl = $('rev'), driftEl = $('drift'), dropEl = $('drop');
  let lastKmh = -1, lastGear = '', lastRev = -1, lastDrift = '', hold = 0;
  const state = { drift: '', gear: 'N', kmh: 0 };

  function setDrift(text, cls) {
    if (text === lastDrift) return;
    lastDrift = state.drift = text;
    driftEl.textContent = text;
    driftEl.className = 'hud' + (text ? ' show' : '') + (cls ? ' ' + cls : '');
  }
  events.on('drift:end', ({ score, wall }) => {
    if (score < 1) { setDrift(''); return; }
    setDrift(wall ? `Wall hit, half banked: ${fmt(score)}` : `Drift banked: ${fmt(score)}`, wall ? 'bad' : 'good');
    hold = 1.8;
  });

  return {
    state,
    // revs is 0..1 within the gear
    update(dt, car, revs) {
      const kmh = Math.round(car.kmh);
      if (kmh !== lastKmh) { kmhEl.textContent = lastKmh = state.kmh = kmh; }
      const gear = car.vf < -0.3 ? 'R' : car.kmh < 1 ? 'N' : String(car.gear + 1);
      if (gear !== lastGear) { gearEl.textContent = lastGear = state.gear = gear; }
      const rev = Math.round(revs * 20);
      if (rev !== lastRev) { lastRev = rev; revEl.style.width = rev * 5 + '%'; revEl.classList.toggle('hot', rev >= 18); }
      if (car.drift.active && car.drift.score >= 1) {
        hold = 0;
        setDrift(`Drift ${fmt(car.drift.score)}` + (car.drift.mult > 1 ? `  x${car.drift.mult.toFixed(1)}` : ''));
      } else if (hold > 0) { hold -= dt; if (hold <= 0) setDrift(''); }
    },
    drop(text) { dropEl.textContent = text; dropEl.style.display = text ? 'block' : 'none'; },
  };
}
