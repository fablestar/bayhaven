// Keyboard, touch buttons, gamepad and scripted input. Everything ends up in one actions
// object that the game reads every step, plus presses that are true for one step.
//   input.actions            held values (see below)
//   input.pressed('camera')  true for the one step after the press
//   input.inject(script)     tests and clips: timed holds, or a function that drives
// On foot (input.setMode('foot')) the same keys and script names move the person instead: steer and
// gas become moveX and moveY, Space (handbrake) is jump, Shift is sprint, and the car gets nothing.
//   input.look(dx, dy)       turn the camera (mouse drag, touch drag, right stick), in radians
//   input.stick(x, y)        the touch stick; input.bind(el) wires a button made after load
// A press is also sent at once as the event input:press { name }, because sound may only
// start inside the browser's own key or touch handler.

const HOLD = {
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'gas', KeyW: 'gas', ArrowDown: 'brake', KeyS: 'brake',
  Space: 'handbrake', KeyH: 'horn', KeyB: 'back', ShiftLeft: 'sprint', ShiftRight: 'sprint',
};
// C camera, T skip time, R reset. M opens the map (ui/mapscreen.mod.js) and 0 mutes (audio/engine.mod.js) since day 4. F, E and Q are named in plan/04 section 19.
const PRESS = { KeyC: 'camera', KeyT: 'skipTime', KeyR: 'reset', KeyF: 'interact', KeyE: 'radioNext', KeyQ: 'radioPrev' };
// pad buttons that act like a press: right stick click, Y, Back, Start
const PAD_PRESS = { 11: 'camera', 3: 'skipTime', 8: 'reset', 9: 'mute' };
const dead = (v) => (Math.abs(v) < 0.15 ? 0 : (v - Math.sign(v) * 0.15) / 0.85);

export function createInput(events) {
  const actions = {
    steer: 0,            // -1 right .. +1 left (day 1's sign)
    throttle: 0,         // -1 brake or reverse .. +1 gas (gas minus brake)
    gas: 0, brake: 0,    // 0..1 each, for the driving step
    handbrake: false,
    moveX: 0, moveY: 0, lookX: 0, lookY: 0,
    sprint: false, jump: false, aim: false, fire: false, horn: false,
    lookBack: false,     // held on day 2 (B)
    touch: false, pad: false,   // which device spoke last
  };
  const down = { left: false, right: false, gas: false, brake: false, handbrake: false, horn: false, back: false, sprint: false, jump: false };
  const touchDown = { ...down };
  const padWas = {};
  let now = {}, pending = {};
  let touched = false, lastTouch = false, script = null, driver = null, scriptT = 0, scriptDone = null;
  let mode = 'car', lookDX = 0, lookDY = 0, stickX = 0, stickY = 0;
  const unit = (v) => (v < -1 ? -1 : v > 1 ? 1 : v);
  const fired = new Set();

  function first() {
    if (touched) return;
    touched = true;
    events.emit('input:first');
  }
  function press(name) {
    pending[name] = true;
    events.emit('input:press', { name });
  }

  window.addEventListener('keydown', (e) => {
    const k = HOLD[e.code];
    if (k) { down[k] = true; lastTouch = false; e.preventDefault(); first(); }
    else if (!e.repeat && PRESS[e.code]) press(PRESS[e.code]);
  });
  window.addEventListener('keyup', (e) => {
    const k = HOLD[e.code];
    if (k) down[k] = false;
  });
  window.addEventListener('blur', () => { for (const k in down) down[k] = touchDown[k] = false; });

  function bind(el) {
    const k = el.dataset.key;
    if (!k) { el.addEventListener('pointerdown', (e) => { e.preventDefault(); first(); press(PRESS[el.dataset.press] || el.dataset.press); }); return; }
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
  for (const el of document.querySelectorAll('[data-key], [data-press]')) bind(el);
  // dragging on the picture turns the camera: a mouse with a button held, or a finger
  const view = document.getElementById('game');
  if (view) {
    let drag = -1, px = 0, py = 0;
    view.addEventListener('pointerdown', (e) => { drag = e.pointerId; px = e.clientX; py = e.clientY; try { view.setPointerCapture(e.pointerId); } catch {} });
    view.addEventListener('pointermove', (e) => {
      if (e.pointerId !== drag) return;
      const k = e.pointerType === 'mouse' ? 0.004 : 0.007;
      lookDX += (e.clientX - px) * k; lookDY += (e.clientY - py) * k; px = e.clientX; py = e.clientY;
    });
    const end = (e) => { if (e.pointerId === drag) drag = -1; };
    view.addEventListener('pointerup', end); view.addEventListener('pointercancel', end);
  }
  // On foot the driving values become walking values, and the car is left with nothing (and its
  // handbrake while it still rolls). Every path through sample() ends here.
  function route() {
    actions.lookX = lookDX; actions.lookY = lookDY; lookDX = lookDY = 0;
    if (mode !== 'foot') { actions.moveX = actions.moveY = 0; actions.jump = false; return; }
    actions.moveX = unit(actions.moveX - actions.steer); actions.moveY = unit(actions.moveY + actions.gas - actions.brake);
    actions.jump = actions.jump || actions.handbrake;
    actions.steer = actions.gas = actions.brake = actions.throttle = 0;
    actions.handbrake = input.parkBrake; actions.horn = false;
  }
  window.addEventListener('contextmenu', (e) => e.preventDefault());

  function finishScript() {
    script = driver = null;
    const done = scriptDone; scriptDone = null;
    if (done) done();
  }
  function holds(H) {
    actions.steer = (H.includes('left') ? 1 : 0) - (H.includes('right') ? 1 : 0);
    actions.gas = H.includes('gas') ? 1 : 0; actions.brake = H.includes('brake') ? 1 : 0;
    actions.handbrake = H.includes('handbrake'); actions.horn = H.includes('horn'); actions.lookBack = H.includes('back');
    actions.sprint = H.includes('sprint'); actions.jump = H.includes('jump'); actions.moveX = actions.moveY = 0;
    actions.touch = false; actions.throttle = actions.gas - actions.brake;
  }

  const input = {
    actions, down, bind,
    parkBrake: false,        // on foot: hold the empty car's handbrake (the player module sets this while it rolls)
    get mode() { return mode; },
    setMode(m) { mode = m === 'foot' ? 'foot' : 'car'; },
    look(dx, dy) { lookDX += dx; lookDY += dy; },
    stick(x, y) { stickX = x; stickY = y; if (x || y) { lastTouch = true; first(); } },
    pressed: (name) => now[name] === true,
    press,
    scripted: () => !!(script || driver),
    // Play timed holds instead of the player: [{ t: 0, hold: ['gas'] }, { t: 3, hold: [] }]. Times are
    // game seconds and the last entry ends the script. Or pass a function (actions, dt) that sets the
    // actions itself each step and returns true when it is done. Resolves when the script ends.
    inject(steps) {
      if (scriptDone) finishScript();
      if (typeof steps === 'function') { driver = steps; script = null; }
      else { script = steps.slice().sort((a, b) => a.t - b.t); driver = null; }
      scriptT = 0; fired.clear();
      return new Promise((resolve) => { scriptDone = resolve; });
    },
    stop() { if (script || driver) { holds([]); route(); finishScript(); } },
    // Called once a step, before anything reads the actions. dt is game time.
    sample(dt) {
      const was = now; now = pending; pending = was;
      for (const k in pending) pending[k] = false;
      if (driver) {
        actions.touch = false;
        if (mode === 'foot') { actions.steer = actions.gas = actions.brake = actions.moveX = actions.moveY = 0; actions.handbrake = actions.jump = actions.sprint = false; }
        const done = driver(actions, dt);
        actions.throttle = actions.gas - actions.brake;
        if (done) { holds([]); finishScript(); }
        route();
        return actions;
      }
      if (script) {
        let cur = null;
        for (const s of script) if (s.t <= scriptT) cur = s;
        holds(cur ? cur.hold || [] : []);
        // an entry may also press a button once ({ press: 'interact' }) and turn the camera while it
        // lasts ({ look: [yaw, pitch] } in radians a second)
        if (cur && cur.press && !fired.has(cur)) { fired.add(cur); press(cur.press); }
        if (cur && cur.look) { lookDX += cur.look[0] * dt; lookDY += cur.look[1] * dt; }
        scriptT += dt;
        if (scriptT >= script[script.length - 1].t) finishScript();
        route();
        return actions;
      }
      const d = (k) => down[k] || touchDown[k];
      let steer = (d('left') ? 1 : 0) - (d('right') ? 1 : 0);   // +1 = left
      let gas = d('gas') ? 1 : 0, brake = d('brake') ? 1 : 0;
      let handbrake = d('handbrake'), horn = d('horn'), back = d('back');
      let sprint = d('sprint'), jump = d('jump'), mx = stickX, my = stickY;
      actions.pad = false;
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
        if (mode === 'foot') {                                           // left stick walks, A sprints, X jumps
          my -= dead(pad.axes[1] || 0); sprint = sprint || b(0) > 0.5; jump = jump || b(2) > 0.5; handbrake = d('handbrake');
        }
        lookDX += dead(pad.axes[2] || 0) * 2.6 * dt; lookDY += dead(pad.axes[3] || 0) * 1.8 * dt;   // right stick
        for (const i in PAD_PRESS) {
          const on = b(i) > 0.5;
          if (on && !padWas[i]) press(PAD_PRESS[i]);
          padWas[i] = on;
        }
        if (sx || my || gas || brake || handbrake || horn || back) { actions.pad = true; lastTouch = false; first(); }
        break;
      }
      actions.steer = steer; actions.gas = gas; actions.brake = brake; actions.throttle = gas - brake;
      actions.handbrake = handbrake; actions.horn = horn; actions.lookBack = back; actions.touch = lastTouch;
      actions.sprint = sprint; actions.jump = jump; actions.moveX = mx; actions.moveY = my;
      route();
      return actions;
    },
  };
  return input;
}
