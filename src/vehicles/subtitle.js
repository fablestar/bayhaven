// STAND-IN for the HUD's subtitle line (src/ui has none yet): one line of speech at the bottom
// of the screen, "Who: what they said", gone after a few seconds. The HUD session should show
// `ui:toast { kind: 'subtitle', who, text, seconds }` itself and delete this file.
export function createSubtitle() {
  let el = null, left = 0, shown = '';
  function make() {
    el = document.createElement('div');
    el.id = 'car-subtitle';
    el.style.cssText = 'position:fixed;left:50%;bottom:14%;transform:translateX(-50%);max-width:80vw;padding:6px 14px;border-radius:6px;' +
      'background:rgba(21,15,61,0.78);color:#fdf6ea;font:600 16px/1.3 system-ui,sans-serif;text-align:center;pointer-events:none;opacity:0;transition:opacity .2s;z-index:20';
    document.body.appendChild(el);
  }
  return {
    show(who, text, seconds = 3) {
      if (!el) make();
      shown = who + ': ' + text; left = seconds;
      el.textContent = shown; el.style.opacity = 1;
    },
    step(dt) { if (left > 0) { left -= dt; if (left <= 0 && el) { el.style.opacity = 0; shown = ''; } } },
    text: () => shown,
  };
}
