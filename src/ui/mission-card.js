// The postcard result card (plan/bible/art/ui-kit.md section 4): design 880 x 560, painted at twice
// that on its own canvas so `Save image` can export it. A snapshot from the mission in a white
// border, the mission's name in the wordmark's colours, three lines, a caption and a rubber stamp
// that lands: `Delivered`, or `Return to sender` in ink when the mission failed. Never a banner.
// createCard(ctx) → { show(data, photo), hide(), open, info(), canvas }
//   data: { title, seconds, cash, followers, caption, stamp, failed, text, day, best, mode }
const C = { ink: '#150f3d', pink: '#ff4fa8', cyan: '#29e6ff', sand: '#fff1c9', paper: '#fdf6ea', mango: '#ffa02e', mint: '#5dff9b' };
const FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';
const W = 880, H = 560, T = { up: 420, bright: 300, lines: [500, 650, 800], write: 250, stamp: 1100, land: 160, out: 300, done: 1500 };
const over = (t) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);
const sat = (v) => Math.max(0, Math.min(1, v));
const font = (g, px, weight = 400, italic = false) => { g.font = `${italic ? 'italic ' : ''}${weight} ${px}px ${FONT}`; };
export const clockText = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function wrap(g, text, width, most) {
  const out = []; let line = '';
  for (const word of text.split(' ')) { const t = line ? line + ' ' + word : word; if (g.measureText(t).width > width && line) { out.push(line); line = word; } else line = t; }
  if (line) out.push(line);
  return out.slice(0, most);
}
function pelican(g, x, y, s) {            // Gerald, 48 px: a body, a neck, a head and far too much beak
  g.save(); g.translate(x, y); g.scale(s / 48, s / 48); g.fillStyle = C.ink; g.strokeStyle = C.ink; g.lineWidth = 3; g.lineCap = 'round';
  g.beginPath(); g.ellipse(-4, 10, 15, 10, -0.2, 0, 7); g.fill();
  g.beginPath(); g.moveTo(4, 6); g.quadraticCurveTo(10, -6, 4, -14); g.lineWidth = 6; g.stroke();
  g.beginPath(); g.arc(4, -15, 6, 0, 7); g.fill();
  g.beginPath(); g.moveTo(8, -17); g.lineTo(30, -9); g.quadraticCurveTo(20, 2, 8, -11); g.closePath(); g.fill();
  g.lineWidth = 2.5; g.beginPath(); g.moveTo(-6, 19); g.lineTo(-6, 26); g.moveTo(1, 19); g.lineTo(1, 26); g.stroke();
  g.fillStyle = C.paper; g.beginPath(); g.arc(5, -16, 1.6, 0, 7); g.fill();
  g.restore();
}
function arcText(g, text, r, mid, px) {   // text round a circle, centred on the angle `mid` (clockwise from the top)
  font(g, px, 800); g.textAlign = 'center'; g.textBaseline = 'middle';
  const widths = [...text].map((ch) => g.measureText(ch).width + 2), total = widths.reduce((a, b) => a + b, 0), flip = Math.cos(mid) < 0;
  let a = mid - (flip ? -1 : 1) * total / r / 2;
  [...text].forEach((ch, i) => {
    const step = widths[i] / r * (flip ? -1 : 1); a += step / 2;
    g.save(); g.rotate(a); g.translate(0, -r); if (flip) g.rotate(Math.PI); g.fillText(ch, 0, 0); g.restore(); a += step / 2;
  });
}

function paintBase(g, d, photo) {
  g.setTransform(2, 0, 0, 2, 0, 0); g.clearRect(0, 0, W, H);
  g.fillStyle = C.paper; g.beginPath(); g.roundRect(0, 0, W, H, 6); g.fill();
  // the photo, cropped to its centre, under a 12% sand tint
  g.save(); g.beginPath(); g.rect(24, 24, 440, 512); g.clip();
  if (photo && photo.width) { const k = Math.max(440 / photo.width, 512 / photo.height), w = photo.width * k, h = photo.height * k; g.drawImage(photo, 24 + (440 - w) / 2, 24 + (512 - h) / 2, w, h); }
  else { const sky = g.createLinearGradient(0, 24, 0, 536); sky.addColorStop(0, '#ff8f6b'); sky.addColorStop(0.6, '#ffd08a'); sky.addColorStop(0.61, '#35c8c8'); sky.addColorStop(1, '#0e5fa8'); g.fillStyle = sky; g.fillRect(24, 24, 440, 512); }
  g.globalAlpha = 0.12; g.fillStyle = C.sand; g.fillRect(24, 24, 440, 512); g.globalAlpha = 1;
  if (d.failed) { g.globalCompositeOperation = 'saturation'; g.fillStyle = '#808080'; g.fillRect(24, 24, 440, 512); g.globalCompositeOperation = 'source-over'; }
  const shade = g.createLinearGradient(0, 400, 0, 536); shade.addColorStop(0, 'rgba(21,15,61,0)'); shade.addColorStop(1, 'rgba(21,15,61,.55)'); g.fillStyle = shade; g.fillRect(24, 400, 440, 136);
  // the mission's name: pink over a cyan copy 3 px off, as the wordmark
  let px = 52; font(g, px, 900, true);
  while (g.measureText(d.title).width > 400 && px > 30) { px -= 2; font(g, px, 900, true); }
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  g.fillStyle = C.cyan; g.fillText(d.title, 43, 513); g.fillStyle = C.pink; g.fillText(d.title, 40, 510);
  g.restore();
  // the back
  g.fillStyle = C.sand; g.fillRect(488, 24, 368, 512);
  g.fillStyle = 'rgba(21,15,61,.6)'; font(g, 24); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  if ('letterSpacing' in g) g.letterSpacing = '1px';
  g.fillText('Greetings from', 504, 78); g.fillText('Bayhaven', 504, 108);
  if ('letterSpacing' in g) g.letterSpacing = '0px';
  // the postage stamp: a scalloped edge, Gerald, the day
  g.fillStyle = C.paper; g.fillRect(744, 40, 96, 116);
  g.fillStyle = C.sand;
  for (let x = 744; x <= 840; x += 12) { g.beginPath(); g.arc(x, 40, 4, 0, 7); g.arc(x, 156, 4, 0, 7); g.fill(); }
  for (let y = 40; y <= 156; y += 12) { g.beginPath(); g.arc(744, y, 4, 0, 7); g.arc(840, y, 4, 0, 7); g.fill(); }
  pelican(g, 790, 88, 48);
  g.fillStyle = C.ink; font(g, 22, 800); g.textAlign = 'center'; g.fillText('Day ' + d.day, 792, 146);
  // the caption
  g.textAlign = 'left'; g.fillStyle = C.ink; font(g, 26, 400, true);
  wrap(g, d.failed ? d.text || '' : d.caption || '', 320, 2).forEach((line, i) => g.fillText(line, 504, 444 + i * 32));
  if (d.note) { g.fillStyle = 'rgba(21,15,61,.6)'; font(g, 22); g.fillText(d.note, 504, 516); }
}
function rows(d) {
  if (d.failed) return [['Time', clockText(d.seconds)], ['Cash', '$0'], ['Back to', d.checkpoint ? 'the checkpoint' : 'the start']];
  const out = [['Time', clockText(d.seconds)], ['Cash', '+$' + (d.cash || 0).toLocaleString('en-US')], ['Followers', '+' + (d.followers || 0).toLocaleString('en-US')]];
  if (d.mode === 'cup') out[2] = ['Best', d.best != null ? clockText(d.best) : clockText(d.seconds)];
  return out;
}
function paintLive(g, base, d, ms, reduce) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W * 2, H * 2); g.drawImage(base, 0, 0);
  g.setTransform(2, 0, 0, 2, 0, 0);
  const bright = reduce ? 0 : 0.6 * (1 - sat(ms / T.bright));
  if (bright > 0) { g.globalAlpha = bright; g.fillStyle = '#fff'; g.fillRect(24, 24, 440, 512); g.globalAlpha = 1; }
  // three lines, written on from the left
  rows(d).forEach(([label, value], i) => {
    const k = reduce ? 1 : sat((ms - T.lines[i]) / T.write), y = 240 + i * 60;
    if (k <= 0) return;
    g.save(); g.beginPath(); g.rect(504, y - 40, 336 * k, 50); g.clip();
    g.fillStyle = 'rgba(21,15,61,.25)'; g.fillRect(504, y, 336, 1);
    g.textBaseline = 'alphabetic'; g.fillStyle = 'rgba(21,15,61,.6)'; font(g, 24); g.textAlign = 'left'; g.fillText(label, 504, y - 10);
    g.fillStyle = C.ink; font(g, 30, 800); g.textAlign = 'right'; g.fillText(value, 840, y - 10);
    g.restore();
  });
  // the rubber stamp: from 2.2 times its size in 160 ms, with a 4 px shake
  const s = reduce ? (ms >= T.stamp ? 1 : 0) : sat((ms - T.stamp) / T.land);
  if (s <= 0) return false;
  const scale = 2.2 - 1.2 * s, shake = !reduce && ms - T.stamp < 320 && s >= 1 ? Math.sin(ms * 0.09) * 4 * (1 - (ms - T.stamp - T.land) / 160) : 0;
  g.save(); g.translate(760 + shake, 190); g.rotate(-12 * Math.PI / 180); g.scale(scale, scale);
  g.globalAlpha = 0.85 * s; const col = d.failed ? C.ink : C.pink; g.strokeStyle = col; g.fillStyle = col;
  g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 76, 0, 7); g.stroke();
  g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 58, 0, 7); g.stroke();
  arcText(g, 'BAYHAVEN', 67, 0, 15); arcText(g, `DAY ${d.day} BUILD`, 67, Math.PI, 15);
  const word = d.failed ? 'Return to sender' : d.stamp || 'Delivered';
  let px = 34; font(g, px, 900, true); while (g.measureText(word).width > 200 && px > 20) { px -= 2; font(g, px, 900, true); }
  const tw = g.measureText(word).width;
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(word, 0, 1);
  g.lineWidth = 3;
  for (let i = -1; i <= 1; i++) { g.beginPath(); for (let x = 0; x <= 90; x += 6) { const px2 = -80 - 90 + x - 6, py = i * 14 + Math.sin(x / 90 * Math.PI * 4) * 4; if (x === 0) g.moveTo(px2, py); else g.lineTo(px2, py); } g.stroke(); }
  g.restore();
  return s >= 1;
}

export function createCard(ctx, handlers) {
  const S = ctx.state, m = ctx.modules;
  const root = document.createElement('div'); root.id = 'postcard';
  root.innerHTML = '<style>#postcard{position:fixed;inset:0;display:none;z-index:40;pointer-events:none;align-items:center;justify-content:center;flex-direction:column;gap:14px;font-family:' + FONT.replace(/"/g, "'") + '}'
    + '#postcard.open{display:flex}#postcard canvas.card{width:min(880px,88vw,calc((100vh - 110px)*1.5714));height:auto;border-radius:3px;box-shadow:0 20px 60px rgba(21,15,61,.5);will-change:transform}'
    + '#postcard canvas.bits{position:absolute;inset:0;width:100%;height:100%}#postcard .pills{display:flex;gap:10px;pointer-events:auto;opacity:0;transition:opacity .3s}#postcard.ready .pills{opacity:1}'
    + '#postcard button{font:italic 800 16px ' + FONT.replace(/"/g, "'") + ';height:44px;padding:0 22px;border-radius:22px;border:2px solid rgba(255,255,255,.8);background:rgba(21,15,61,.55);color:#fff;cursor:pointer}'
    + '#postcard button.go{background:#29e6ff;border-color:#29e6ff;color:#150f3d}body.clip #postcard .pills{display:none}</style>'
    + '<canvas class="bits"></canvas><canvas class="card" width="1760" height="1120"></canvas><div class="pills"></div>';
  document.body.appendChild(root);
  const canvas = root.querySelector('canvas.card'), g = canvas.getContext('2d'), bits = root.querySelector('canvas.bits'), bg = bits.getContext('2d'), pills = root.querySelector('.pills');
  const base = document.createElement('canvas'); base.width = W * 2; base.height = H * 2;
  let data = null, t0 = 0, raf = 0, leaving = 0, stamped = false, confetti = [];
  const stats = { shown: 0, stamps: 0, saved: 0, frames: 0 };

  function thud() {
    const au = m.audio, ac = au && au.ctx && au.ctx.state === 'running' ? au.ctx : null;
    if (!ac || au.muted) return;
    const o = ac.createOscillator(), gn = ac.createGain(), t = ac.currentTime;
    o.type = 'sine'; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.16);
    gn.gain.setValueAtTime(0.5, t); gn.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(gn); gn.connect(au.bus('ui')); o.start(t); o.stop(t + 0.25);
  }
  function frame() {
    const now = performance.now(), ms = now - t0, reduce = !!S.settings.reduceMotion;
    stats.frames++;
    const done = paintLive(g, base, data, ms, reduce);
    if (done && !stamped) {
      stamped = true; stats.stamps++; thud(); root.classList.add('ready');
      const r = canvas.getBoundingClientRect(), cx = r.left + r.width * 760 / W, cy = r.top + r.height * 190 / H;
      if (!reduce && !data.failed) for (let i = 0; i < 46; i++) { const a = Math.random() * 6.283, v = 120 + Math.random() * 320; confetti.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 160, c: [C.pink, C.cyan, C.mango, C.mint][i % 4], r: Math.random() * 6, life: 1.2 }); }
      if (handlers.stamped) handlers.stamped(data);
    }
    // up from below with an overshoot, turning from -12 to -3 degrees; out to the right, turning 8
    let y = 0, x = 0, rot = -3, alpha = 1;
    if (leaving) { const k = sat((now - leaving) / T.out); x = k * window.innerWidth; rot = -3 + 11 * k; if (reduce) { x = 0; rot = -3; alpha = 1 - k; } if (k >= 1) return close(); }
    else if (reduce) alpha = sat(ms / 120);
    else { const k = sat(ms / T.up), e = over(k); y = (1 - e) * window.innerHeight * 0.8; rot = -12 + 9 * e; }
    canvas.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`; canvas.style.opacity = alpha;
    // confetti
    if (bits.width !== window.innerWidth) { bits.width = window.innerWidth; bits.height = window.innerHeight; }
    bg.clearRect(0, 0, bits.width, bits.height);
    for (const p of confetti) { p.life -= 1 / 60; p.vy += 600 / 60; p.x += p.vx / 60; p.y += p.vy / 60; p.r += 0.2; if (p.life <= 0) continue; bg.globalAlpha = sat(p.life * 2); bg.fillStyle = p.c; bg.save(); bg.translate(p.x, p.y); bg.rotate(p.r); bg.fillRect(-4, -2.5, 8, 5); bg.restore(); }
    confetti = confetti.filter((p) => p.life > 0);
    if (ms < T.done + 400 || confetti.length || leaving) raf = requestAnimationFrame(frame); else raf = 0;
  }
  function close() {
    cancelAnimationFrame(raf); raf = 0; leaving = 0;
    root.classList.remove('open', 'ready'); const was = data; data = null;
    if (handlers.closed) handlers.closed(was);
  }
  function button(text, fn, go) { const b = document.createElement('button'); b.textContent = text; if (go) b.className = 'go'; b.addEventListener('click', (e) => { e.stopPropagation(); fn(); }); pills.appendChild(b); return b; }
  function save() {
    paintLive(g, base, data, 1e6, true); stats.saved++;
    const a = document.createElement('a'); a.download = `bayhaven-${data.id || 'postcard'}.png`; a.href = canvas.toDataURL('image/png'); a.click();
    return a.href.length;
  }
  const api = {
    canvas, stats, timings: T,
    get open() { return !!data; },
    show(d, photo) {
      data = { day: S.build.day, ...d }; t0 = performance.now(); stamped = false; leaving = 0; confetti = [];
      paintBase(base.getContext('2d'), data, photo);
      pills.innerHTML = '';
      if (data.failed) { button('Retry', () => handlers.retry && handlers.retry(), true); button('Give up', () => api.hide()); }
      else { button('Continue', () => api.hide(), true); button('Replay', () => handlers.replay && handlers.replay()); button('Save image', save); }
      root.classList.add('open'); root.classList.remove('ready'); stats.shown++;
      cancelAnimationFrame(raf); frame();
    },
    hide(now) { if (!data) return; if (now) return close(); if (!leaving) { leaving = performance.now(); if (!raf) frame(); } },
    primary() { if (!data || !stamped) return false; if (data.failed) { if (handlers.retry) handlers.retry(); } else api.hide(); return true; },
    save,
    info() {
      if (!data) return { open: false, shown: stats.shown, stamps: stats.stamps };
      const r = canvas.getBoundingClientRect(), ms = performance.now() - t0;
      return { open: true, failed: !!data.failed, title: data.title, stamp: data.failed ? 'Return to sender' : data.stamp, stamped, ms, rows: rows(data).map((q) => q.join(' ')), caption: data.caption, day: data.day,
        rect: { x: r.left, y: r.top, w: r.width, h: r.height }, widthShare: r.width / window.innerWidth, buttons: [...pills.children].map((b) => b.textContent), design: [W, H], shown: stats.shown, stamps: stats.stamps };
    },
  };
  return api;
}
