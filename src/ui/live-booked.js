// The booking screen: our mugshot board (plan/bible/art/ui-kit.md). One canvas, 900 x 560 in
// design pixels, so it can be saved as a picture: the lead against the wall with the height
// marks, holding the board; the sand panel with the cost; Lawyer Larry's card sliding in.
// `Walk out` is a page button. It leaves by itself after 6 s.
import { C } from './hud-draw.js';

const W = 900, H = 560, FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

function person(g, lead) {
  // a flat, boxy figure from the chest up to the knees, in the lead's colours
  const mags = lead === 'mags', skin = mags ? '#d9a47c' : '#b9774d', top = mags ? '#3fb7a6' : '#ff7a3d', hair = mags ? '#d8d8de' : '#2b1d16';
  g.fillStyle = '#2e3350'; g.fillRect(205, 430, 60, 130); g.fillRect(275, 430, 60, 130);          // legs
  g.fillStyle = top; g.fillRect(185, 250, 170, 190);                                                // torso
  g.fillStyle = skin; g.fillRect(232, 205, 76, 50);                                                 // neck
  g.fillRect(215, 110, 110, 110);                                                                   // head
  g.fillStyle = hair; g.fillRect(210, 96, 120, 34);
  if (mags) { g.fillStyle = C.pink; g.fillRect(200, 124, 140, 12); g.fillRect(215, 132, 110, 8); }  // her visor
  else { g.fillStyle = '#1b1b24'; g.fillRect(246, 286, 48, 30); g.fillStyle = C.cyan; g.fillRect(262, 294, 16, 12); }   // his chest phone
  g.fillStyle = '#1b1320';
  g.fillRect(238, 158, 16, 8); g.fillRect(286, 158, 16, 8);                                         // eyes
  if (mags) { g.fillRect(234, 146, 24, 5); g.fillRect(282, 146, 24, 5); g.fillRect(250, 194, 40, 6); }     // angry
  else { g.fillRect(246, 186, 48, 6); g.fillRect(240, 180, 8, 8); g.fillRect(292, 180, 8, 8); }            // happy
  g.fillStyle = top; g.fillRect(120, 270, 70, 44); g.fillRect(350, 270, 70, 44);                    // arms out to the board
  g.fillStyle = skin; g.fillRect(104, 318, 30, 34); g.fillRect(406, 318, 30, 34);                   // hands
}

export function drawBoard(g, d, t) {
  g.clearRect(0, 0, W, H);
  g.save();
  // the card drops in over 300 ms after the flash at 400 ms
  const k = Math.max(0, Math.min(1, (t - 0.4) / 0.3)), ease = 1 - (1 - k) ** 3;
  g.globalAlpha = ease; g.translate(0, (1 - ease) * -40);
  // photo
  g.fillStyle = '#cfd6d2'; g.fillRect(0, 0, 540, H);
  g.fillStyle = '#b9c2be'; for (let y = 56; y < H; y += 56) g.fillRect(0, y, 540, 2);
  g.fillStyle = 'rgba(21,15,61,0.35)'; g.font = `700 22px ${FONT}`; g.textAlign = 'left'; g.textBaseline = 'middle';
  for (let i = 0, y = 62; y < H; y += 28, i++) { g.fillRect(0, y, i % 2 ? 22 : 40, 2); if (i % 4 === 0) g.fillText(String(200 - i * 2.5 | 0), 10, y + 14); }
  person(g, d.lead);
  // the board in the lead's hands
  g.fillStyle = C.ink; g.fillRect(120, 330, 300, 170);
  g.strokeStyle = '#fff'; g.lineWidth = 3; g.strokeRect(128, 338, 284, 154);
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  g.font = `700 24px ${FONT}`; g.letterSpacing = '2px'; g.fillText('Marlin County', 270, 376); g.letterSpacing = '0px';
  g.font = `italic 800 30px ${FONT}`; g.fillText(d.name, 270, 418);
  g.font = `800 44px ${FONT}`; g.fillText('No. ' + String(d.day).padStart(4, '0'), 270, 474);
  // the panel
  g.fillStyle = C.sand; g.fillRect(540, 0, 360, H);
  g.textAlign = 'left';
  g.font = `italic 900 56px ${FONT}`; g.fillStyle = C.cyan; g.fillText('Booked', 573, 93); g.fillStyle = C.pink; g.fillText('Booked', 570, 90);
  g.fillStyle = C.ink; g.font = `800 34px ${FONT}`; g.fillText('Cost ' + money(d.cost), 570, 170);
  g.font = `400 22px ${FONT}`; g.globalAlpha = ease * 0.6; g.fillText('10% of cash', 570, 204); g.globalAlpha = ease;
  g.fillText('Weapons kept at the desk', 570, 240);
  g.fillText(d.when, 570, 276);
  g.restore();
  // Lawyer Larry's card slides in from the right at 1.8 s
  const s = Math.max(0, Math.min(1, (t - 1.8) / 0.35)), se = 1 - (1 - s) ** 3;
  if (s > 0) {
    g.save();
    g.translate(500 + 190 + (1 - se) * 460, 330 + 107); g.rotate(5 * Math.PI / 180);
    g.shadowColor = 'rgba(21,15,61,0.45)'; g.shadowBlur = 18; g.shadowOffsetY = 6;
    g.fillStyle = C.mango; g.beginPath(); g.roundRect(-190, -107, 380, 214, 12); g.fill();
    g.shadowColor = 'transparent';
    g.fillStyle = C.ink; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    g.font = `italic 900 36px ${FONT}`; g.fillText('Lawyer Larry', -166, -40);
    g.font = `400 22px ${FONT}`; g.fillText('Hurt? Flirt with a lawsuit.', -166, 4);
    g.font = `800 30px ${FONT}`; g.fillText('555-0144', -166, 58);
    g.restore();
  }
  // the shutter: a white flash for 80 ms at 400 ms
  if (t >= 0.4 && t < 0.48) { g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); }
}

export function createBooked(ctx) {
  let root = null, canvas = null, raf = 0, t0 = 0, data = null, closeT = 0;
  const api = {
    open: false, data: null, shows: 0,
    show(d) {
      api.hide();
      data = api.data = d; api.open = true; api.shows++;
      root = document.createElement('div'); root.id = 'booked';
      root.style.cssText = 'position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:rgba(21,15,61,0.62);';
      canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
      canvas.style.cssText = 'width:min(900px,92vw,calc(78vh * 900 / 560));height:auto;border-radius:10px;box-shadow:0 18px 60px rgba(0,0,0,0.5);';
      const btn = document.createElement('button'); btn.textContent = 'Walk out';
      btn.style.cssText = `font:italic 800 20px ${FONT};color:${C.ink};background:${C.cyan};border:0;border-radius:999px;padding:10px 28px;cursor:pointer;`;
      btn.addEventListener('click', () => api.hide());
      root.append(canvas, btn); document.body.append(root);
      const g = canvas.getContext('2d'); t0 = performance.now();
      const reduce = !!ctx.state.settings.reduceMotion;
      const frame = () => {
        if (!api.open) return;
        const t = reduce ? 9 : (performance.now() - t0) / 1000;
        drawBoard(g, data, t);
        if (t < 2.4) raf = requestAnimationFrame(frame);
      };
      frame();
      closeT = setTimeout(() => api.hide(), 6000);
      window.addEventListener('keydown', api.key);
    },
    key(e) { if (e.code === 'Enter' || e.code === 'Space' || e.code === 'Escape') api.hide(); },
    hide() {
      if (!api.open) return;
      api.open = false; cancelAnimationFrame(raf); clearTimeout(closeT); window.removeEventListener('keydown', api.key);
      if (root) root.remove(); root = canvas = null;
    },
    // what the card shows, for a check
    info() { return { open: api.open, shows: api.shows, cost: data ? data.cost : null, name: data ? data.name : null, day: data ? data.day : null }; },
  };
  return api;
}
