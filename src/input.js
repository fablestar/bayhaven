// Keyboard, touch buttons, gamepad and scripted input. Everything ends up as one small
// set of actions: steer, gas, brake, handbrake, horn, look back.

const KEYMAP = {
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'gas', KeyW: 'gas',
  ArrowDown: 'brake', KeyS: 'brake',
  Space: 'handbrake', KeyH: 'horn', KeyB: 'back',
};
// pad buttons that act like a key press: right stick click = camera, Y = skip time,
// Back = reset, Start = mute
const PAD_PRESS = { 11: 'KeyC', 3: 'KeyT', 8: 'KeyR', 9: 'KeyM' };
const dead = (v) => (Math.abs(v) < 0.15 ? 0 : (v - Math.sign(v) * 0.15) / 0.85);

export function createInput({ onFirstInput, onKey } = {}) {
  const down = { left: false, right: false, gas: false, brake: false, handbrake: false, horn: false, back: false };
  const touchDown = { ...down };
  const padWas = {};
  let touched = false, lastTouch = false, script = null, scriptT = 0, scriptDone = null;
  const input = { steer: 0, gas: 0, brake: 0, throttle: 0, handbrake: false, horn: false, lookBack: false, touch: false, pad: false, down };

  function first() {
    if (touched) return;
    touched = true;
    onFirstInput && onFirstInput();
  }

  window.addEventListener('keydown', (e) => {
    const k = KEYMAP[e.code];
    if (k) { down[k] = true; lastTouch = false; e.preventDefault(); first(); }
    else if (!e.repeat && onKey) onKey(e.code);
  });
  window.addEventListener('keyup', (e) => {
    const k = KEYMAP[e.code];
    if (k) down[k] = false;
  });
  window.addEventListener('blur', () => { for (const k in down) down[k] = touchDown[k] = false; });

  for (const el of document.querySelectorAll('[data-key]')) {
    const k = el.dataset.key;
    const set = (v) => (e) => {
      e.preventDefault();
      touchDown[k] = v;
      el.classList.toggle('on', v);
      if (v) { lastTouch = true; first(); try { el.setPointerCapture(e.pointerId); } catch {} }
    };
    el.addEventListener('pointerdown', set(true));
    el.addEventListener('pointerup', set(false));
    el.addEventListener('pointercancel', set(false));
    el.addEventListener('lostpointercapture', set(false));
  }
  for (const el of document.querySelectorAll('[data-press]')) {
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); first(); onKey && onKey(el.dataset.press); });
  }
  window.addEventListener('contextmenu', (e) => e.preventDefault());

  // Play a list of timed holds instead of the player: [{ t: 0, hold: ['gas'] }, { t: 3, hold: [] }].
  // Times are in game seconds. The last entry ends the script. Resolves when it ends.
  input.script = function (steps) {
    script = steps.slice().sort((a, b) => a.t - b.t); scriptT = 0;
    return new Promise((resolve) => { scriptDone = resolve; });
  };
  input.scripted = () => !!script;

  // Call once per frame, before the car is stepped. dt is game time.
  input.poll = function (dt) {
    if (script) {
      let cur = null;
      for (const s of script) if (s.t <= scriptT) cur = s;
      const H = cur ? cur.hold : [];
      input.steer = (H.includes('left') ? 1 : 0) - (H.includes('right') ? 1 : 0);
      input.gas = H.includes('gas') ? 1 : 0; input.brake = H.includes('brake') ? 1 : 0;
      input.handbrake = H.includes('handbrake'); input.horn = H.includes('horn'); input.lookBack = H.includes('back');
      input.touch = false; input.throttle = input.gas - input.brake;
      scriptT += dt;
      if (scriptT >= script[script.length - 1].t) { script = null; const done = scriptDone; scriptDone = null; done && done(); }
      return input;
    }
    const d = (k) => down[k] || touchDown[k];
    let steer = (d('left') ? 1 : 0) - (d('right') ? 1 : 0);   // +1 = left
    let gas = d('gas') ? 1 : 0, brake = d('brake') ? 1 : 0;
    let handbrake = d('handbrake'), horn = d('horn'), back = d('back');
    input.pad = false;
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const pad of pads) {
      if (!pad || !pad.buttons || pad.buttons.length < 8) continue;
      const b = (i) => (pad.buttons[i] ? pad.buttons[i].value || (pad.buttons[i].pressed ? 1 : 0) : 0);
      const sx = dead(pad.axes[0] || 0) + (b(14) ? -1 : 0) + (b(15) ? 1 : 0);
      if (sx) steer = Math.max(-1, Math.min(1, -sx));
      gas = Math.max(gas, b(7)); brake = Math.max(brake, b(6));       // triggers
      handbrake = handbrake || b(0) > 0.5;                             // A
      horn = horn || b(10) > 0.5;                                      // left stick click
      back = back || b(1) > 0.5;                                       // B
      for (const i in PAD_PRESS) {
        const on = b(i) > 0.5;
        if (on && !padWas[i] && onKey) onKey(PAD_PRESS[i]);
        padWas[i] = on;
      }
      if (sx || gas || brake || handbrake || horn || back) { input.pad = true; lastTouch = false; first(); }
      break;
    }
    Object.assign(input, { steer, gas, brake, throttle: gas - brake, handbrake, horn, lookBack: back, touch: lastTouch });
    return input;
  };

  return input;
}
