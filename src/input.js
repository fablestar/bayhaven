// Keyboard + touch input. Everything ends up as two numbers: steer and throttle.

const KEYMAP = {
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'gas', KeyW: 'gas',
  ArrowDown: 'brake', KeyS: 'brake', Space: 'brake',
};

export function createInput({ onFirstInput, onKey } = {}) {
  const down = { left: false, right: false, gas: false, brake: false };
  let touched = false;

  function first() {
    if (touched) return;
    touched = true;
    onFirstInput && onFirstInput();
  }

  window.addEventListener('keydown', (e) => {
    const k = KEYMAP[e.code];
    if (k) { down[k] = true; e.preventDefault(); first(); }
    else if (!e.repeat && onKey) onKey(e.code);
  });
  window.addEventListener('keyup', (e) => {
    const k = KEYMAP[e.code];
    if (k) down[k] = false;
  });
  window.addEventListener('blur', () => { for (const k in down) down[k] = false; });

  for (const el of document.querySelectorAll('[data-key]')) {
    const k = el.dataset.key;
    const set = (v) => (e) => {
      e.preventDefault();
      down[k] = v;
      el.classList.toggle('on', v);
      if (v) { first(); try { el.setPointerCapture(e.pointerId); } catch {} }
    };
    el.addEventListener('pointerdown', set(true));
    el.addEventListener('pointerup', set(false));
    el.addEventListener('pointercancel', set(false));
    el.addEventListener('lostpointercapture', set(false));
  }
  window.addEventListener('contextmenu', (e) => e.preventDefault());

  return {
    get steer() { return (down.left ? 1 : 0) - (down.right ? 1 : 0); },   // +1 = left
    get throttle() { return (down.gas ? 1 : 0) - (down.brake ? 1 : 0); }, // +1 = forward
    down,
  };
}
