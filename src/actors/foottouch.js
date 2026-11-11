// STAND-IN for src/ui/touch.js (the HUD and controls session owns the real one): the on-foot touch
// layout. A left stick, Jump and Sprint, and a context button that reads "Get in" by a vehicle.
// In a car the driving layout of index.html comes back, with one "Get out" button added above it.
// Everything is made here in code; buttons are 72 px and sit inside the phone's safe areas.
const CSS = `
#foot-touch { display: none; }
@media (pointer: coarse) { #foot-touch { display: block; } body.on-foot #touch { display: none; } }
body.clip #foot-touch { display: none; }
#foot-touch .fbtn { position: fixed; width: 72px; height: 72px; box-sizing: border-box; border-radius: 50%; border: 2px solid rgba(255, 255, 255, .55);
  background: rgba(21, 15, 61, .35); color: #fff; font-size: 12px; line-height: 1.15; font-weight: bold; display: flex; text-align: center;
  align-items: center; justify-content: center; touch-action: none; }
#foot-touch .fbtn.on { background: rgba(255, 79, 168, .6); border-color: #fff; }
#foot-stick { position: fixed; left: calc(20px + env(safe-area-inset-left)); bottom: calc(22px + env(safe-area-inset-bottom)); width: 132px; height: 132px;
  box-sizing: border-box; border-radius: 50%; border: 2px solid rgba(255, 255, 255, .45); background: rgba(21, 15, 61, .28); touch-action: none; }
#foot-nub { position: absolute; left: 34px; top: 34px; width: 60px; height: 60px; border-radius: 50%; background: rgba(255, 255, 255, .55); pointer-events: none; }
#foot-jump { right: calc(16px + env(safe-area-inset-right)); bottom: calc(18px + env(safe-area-inset-bottom)); }
#foot-sprint { right: calc(100px + env(safe-area-inset-right)); bottom: calc(18px + env(safe-area-inset-bottom)); }
#foot-use { right: calc(16px + env(safe-area-inset-right)); bottom: calc(102px + env(safe-area-inset-bottom)); }
#foot-out { right: calc(16px + env(safe-area-inset-right)); bottom: calc(190px + env(safe-area-inset-bottom)); }
body.on-foot #foot-out, body:not(.on-foot) .foot-only { display: none !important; }
#foot-use.off { display: none; }
`;

export function createFootTouch(input) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
  const root = document.createElement('div'); root.id = 'foot-touch';
  root.innerHTML = '<div id="foot-stick" class="foot-only"><div id="foot-nub"></div></div>'
    + '<div id="foot-jump" class="fbtn foot-only" data-key="jump">Jump</div>'
    + '<div id="foot-sprint" class="fbtn foot-only" data-key="sprint">Sprint</div>'
    + '<div id="foot-use" class="fbtn foot-only off" data-press="interact">Get in</div>'
    + '<div id="foot-out" class="fbtn" data-press="interact">Get out</div>';
  document.body.appendChild(root);
  // the hint line learns the new keys (index.html belongs to the HUD session)
  const keys = document.querySelector('#hint .keys'), taps = document.querySelector('#hint .touch');
  if (keys) keys.textContent += ', F gets out and in, on foot Shift sprints and Space jumps, drag to look around';
  if (taps) taps.textContent += ', tap Get out to walk';
  for (const el of root.querySelectorAll('[data-key], [data-press]')) input.bind(el);
  const stick = root.querySelector('#foot-stick'), nub = root.querySelector('#foot-nub'), use = root.querySelector('#foot-use');
  // the stick: the nub follows the finger up to 46 px from the middle; a full push is a jog
  const REACH = 46;
  let finger = -1, shown = false;
  function push(e) {
    const b = stick.getBoundingClientRect();
    let dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2);
    const d = Math.hypot(dx, dy);
    if (d > REACH) { dx *= REACH / d; dy *= REACH / d; }
    nub.style.transform = `translate(${dx}px, ${dy}px)`;
    input.stick(dx / REACH, -dy / REACH);
  }
  function letGo(e) { if (e.pointerId !== finger) return; finger = -1; nub.style.transform = ''; input.stick(0, 0); }
  stick.addEventListener('pointerdown', (e) => { e.preventDefault(); finger = e.pointerId; try { stick.setPointerCapture(e.pointerId); } catch {} push(e); });
  stick.addEventListener('pointermove', (e) => { if (e.pointerId === finger) push(e); });
  stick.addEventListener('pointerup', letGo); stick.addEventListener('pointercancel', letGo);

  return {
    root,
    set(mode) { document.body.classList.toggle('on-foot', mode === 'foot'); if (mode !== 'foot') { finger = -1; nub.style.transform = ''; input.stick(0, 0); } },
    // the context button shows only when a door is in reach
    update(near) { const on = !!near; if (on !== shown) { shown = on; use.classList.toggle('off', !on); } },
  };
}
