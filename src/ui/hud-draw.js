// The painters, one per HUD piece. Each has key(V) (a string that changes when the piece must be
// redrawn, or null when the piece is hidden), an optional anim(V) (true while it is moving) and
// draw(g, r, V, L). g is the HUD's 2D context already scaled to CSS pixels, r is the piece's
// rectangle, V is this frame's values (hud.mod.js) and L is the layout (hud-layout.js).

export const C = { ink: '#150f3d', pink: '#ff4fa8', cyan: '#29e6ff', sand: '#fff1c9', mango: '#ffa02e', mint: '#5dff9b' };
const INK55 = 'rgba(21, 15, 61, .55)', INK70 = 'rgba(21, 15, 61, .7)';
const FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';
export const meter = { minFont: 99, dpr: 1 };

// every text size goes through here: never under 14 px, and the smallest used is remembered
export function font(g, size, weight = 400, italic = false) {
  size = Math.max(14, Math.round(size));
  if (size < meter.minFont) meter.minFont = size;
  g.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${FONT}`;
  return size;
}
function pill(g, x, y, w, h, fill, radius) {
  g.beginPath(); g.roundRect(x, y, w, h, radius === undefined ? h / 2 : radius);
  g.fillStyle = fill; g.fill();
}
function shadow(g, on) {
  g.shadowColor = on ? 'rgba(20, 5, 40, .7)' : 'transparent';
  g.shadowBlur = on ? 6 * meter.dpr : 0; g.shadowOffsetY = on ? meter.dpr : 0;
}
const spacing = (g, px) => { if ('letterSpacing' in g) g.letterSpacing = px + 'px'; };
export const overshoot = (t) => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2;
const sat = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const fmt = (n) => Math.round(n).toLocaleString('en-US');
export function fmtFollowers(n) {
  if (n < 10000) return fmt(n);
  if (n < 1e6) return (Math.floor(n / 100) / 10).toFixed(1) + 'K';
  return (Math.floor(n / 1e4) / 100).toFixed(2) + 'M';
}
// in over `tin` seconds, out over `tout` before `end`; 0..1
const fade = (now, t0, end, tin, tout) => sat(Math.min((now - t0) / tin, (end - now) / tout));

function wrap(g, text, maxW, maxLines) {
  const words = text.split(' '), lines = [''];
  for (const w of words) {
    const cur = lines[lines.length - 1], next = cur ? cur + ' ' + w : w;
    if (!cur || g.measureText(next).width <= maxW || lines.length >= maxLines) lines[lines.length - 1] = next;
    else lines.push(w);
  }
  return lines;
}

// the luggage tag is painted once per district on its own canvas at twice the design size
let tagCanvas = null, tagFor = '';
function paintTag(tag) {
  if (!tagCanvas) { tagCanvas = document.createElement('canvas'); tagCanvas.width = 720; tagCanvas.height = 240; }
  const g = tagCanvas.getContext('2d');
  g.setTransform(2, 0, 0, 2, 0, 0); g.clearRect(0, 0, 360, 120);
  g.beginPath(); g.moveTo(20, 0); g.lineTo(340, 0); g.lineTo(360, 20); g.lineTo(360, 106); g.arcTo(360, 120, 346, 120, 14);
  g.lineTo(14, 120); g.arcTo(0, 120, 0, 106, 14); g.lineTo(0, 20); g.closePath();
  g.save(); g.clip();
  g.fillStyle = C.sand; g.fillRect(0, 0, 360, 120);
  g.fillStyle = tag.colour; g.fillRect(0, 106, 360, 14);
  g.restore();
  g.beginPath(); g.arc(180, 14, 9, 0, 7); g.fillStyle = C.ink; g.fill();
  g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(180, 14, 4, 0, 7); g.fill();
  g.globalCompositeOperation = 'source-over';
  g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  g.font = `23px ${FONT}`; g.fillStyle = 'rgba(21, 15, 61, .6)'; g.fillText('Now entering', 180, tag.hood ? 44 : 50);
  g.font = `italic 900 38px ${FONT}`; g.fillStyle = C.ink; g.fillText(tag.title, 180, tag.hood ? 78 : 88, 330);
  if (tag.hood) { g.font = `23px ${FONT}`; g.fillText(tag.hood, 180, 100, 330); }
  tagFor = tag.title + '|' + tag.hood + '|' + tag.colour;
}

export const PIECES = [
  { id: 'cash',
    key: (V) => V.cashShown + V.cashRing,
    anim: (V) => V.cashAnim,
    draw(g, r, V, L) {
      const pad = L.s(8, 12), cw = L.s(20, 28), ch = L.s(14, 20), mid = r.y + r.h / 2;
      const x = r.x + V.cashShake;
      font(g, L.s(16, 24), 800, true);
      const txt = fmt(V.cashShown), tw = Math.min(g.measureText(txt).width, r.w - pad * 2 - cw - 6);
      const w = pad + cw + 6 + tw + pad + 2;
      pill(g, x, r.y, w, r.h, INK55);
      if (V.cashRing) { g.strokeStyle = V.cashRing === 'gain' ? C.mint : C.pink; g.lineWidth = 2; g.stroke(); }
      pill(g, x + pad, mid - ch / 2, cw, ch, C.mango, Math.min(10, ch / 2));
      g.textBaseline = 'middle'; g.textAlign = 'center';
      g.fillStyle = C.ink; font(g, L.s(14, 17), 800); g.fillText('$', x + pad + cw / 2, mid + 1);
      g.textAlign = 'left'; g.fillStyle = '#fff'; font(g, L.s(16, 24), 800, true);
      g.fillText(txt, x + pad + cw + 6, mid + 1, tw);
    } },
  { id: 'followers',
    key: (V) => (V.live && L_PORTRAIT.on ? null : V.followers + (V.folRing ? 'r' : '')),
    anim: (V) => V.folPop > 0,
    draw(g, r, V, L) {
      const pad = L.s(8, 12), ic = L.s(16, 22), mid = r.y + r.h / 2, word = L.mode === 'D' && L.k > 0.5;
      font(g, L.s(16, 24), 800, true);
      const txt = fmtFollowers(V.followers), tw = g.measureText(txt).width;
      let ww = 0;
      if (word) { font(g, 16); ww = g.measureText('followers').width + 8; }
      const w = Math.min(r.w, pad + ic + 6 + tw + ww + pad + 2);
      g.save();
      if (V.folPop > 0) { const z = 1 + 0.15 * Math.sin(V.folPop * Math.PI); g.translate(r.x + w / 2, mid); g.scale(z, z); g.translate(-r.x - w / 2, -mid); }
      pill(g, r.x, r.y, w, r.h, INK55);
      if (V.folRing) { g.strokeStyle = C.cyan; g.lineWidth = 2; g.stroke(); }
      // the follower icon: a head, shoulders and a small plus
      const ix = r.x + pad + ic / 2, u = ic / 24;
      g.strokeStyle = '#fff'; g.lineWidth = 2 * u + 0.6; g.lineCap = 'round';
      g.beginPath(); g.arc(ix - 2 * u, mid - 4 * u, 4 * u, 0, 7); g.stroke();
      g.beginPath(); g.arc(ix - 2 * u, mid + 10 * u, 8 * u, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
      g.beginPath(); g.moveTo(ix + 6 * u, mid - 3 * u); g.lineTo(ix + 12 * u, mid - 3 * u); g.moveTo(ix + 9 * u, mid - 6 * u); g.lineTo(ix + 9 * u, mid); g.stroke();
      g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillStyle = '#fff';
      font(g, L.s(16, 24), 800, true); g.fillText(txt, r.x + pad + ic + 6, mid + 1);
      if (word) { g.globalAlpha = 0.8; font(g, 16); g.fillText('followers', r.x + pad + ic + 6 + tw + 8, mid + 1); }
      g.restore();
    } },
  { id: 'clock',
    key: (V) => V.clock + V.weekday,
    draw(g, r, V, L) {
      const pad = L.s(10, 16), mid = r.y + r.h / 2;
      font(g, L.s(16, 24), 700); spacing(g, 2);
      const tw = g.measureText(V.clock).width;
      let dw = 0;
      if (V.weekday) { spacing(g, 0); font(g, 14); dw = g.measureText(V.weekday).width + 6; }
      const w = Math.min(r.w, pad * 2 + tw + dw), x = r.x + r.w - w;
      pill(g, x, r.y, w, r.h, INK55);
      g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillStyle = '#fff';
      if (V.weekday) { g.globalAlpha = 0.8; g.fillText(V.weekday, x + pad, mid + 1); g.globalAlpha = 1; }
      font(g, L.s(16, 24), 700); spacing(g, 2);
      g.fillText(V.clock, x + pad + dw, mid + 1);
    } },
  { id: 'live',
    key: (V) => (V.live ? V.viewers + (V.blink ? 'b' : '') : null),
    anim: (V) => V.liveIn < 1,
    draw(g, r, V, L) {
      const pad = L.s(10, 14), dot = L.s(5, 6), mid = r.y + r.h / 2;
      font(g, L.s(14, 20), 900, true); const lw = g.measureText('LIVE').width;
      font(g, L.s(16, 24), 800); const txt = fmt(V.viewers), vw = g.measureText(txt).width;
      const w = Math.min(r.w, pad * 2 + dot * 2 + 6 + lw + 8 + vw), x = L.mode === 'portrait' ? r.x : r.x + r.w - w;
      const drop = V.reduce ? 0 : (1 - overshoot(V.liveIn)) * -Math.min(60, r.y + r.h);
      g.globalAlpha = V.reduce ? V.liveIn : 1;
      g.translate(0, drop);
      pill(g, x, r.y, w, r.h, 'rgba(255, 79, 168, .92)');
      g.fillStyle = '#fff';
      if (!V.blink) { g.beginPath(); g.arc(x + pad + dot, mid, dot, 0, 7); g.fill(); }
      g.textBaseline = 'middle'; g.textAlign = 'left';
      font(g, L.s(14, 20), 900, true); g.fillText('LIVE', x + pad + dot * 2 + 6, mid + 1);
      font(g, L.s(16, 24), 800); g.fillText(txt, x + pad + dot * 2 + 6 + lw + 8, mid + 1, r.w - (pad * 2 + dot * 2 + 14 + lw));
    } },
  { id: 'heat',
    key: (V) => V.heat + '|' + V.heatPhase + '|' + V.heatFlash,
    anim: (V) => V.heatPop < 1,
    draw(g, r, V) {
      const d = r.h, gap = (r.w - 5 * d) / 4;
      for (let i = 0; i < 5; i++) {
        const cx = r.x + d / 2 + i * (d + gap), cy = r.y + d / 2, lit = i < V.heat;
        let rad = d / 2;
        if (lit && i === V.heat - 1 && V.heatPop < 1) rad *= V.heatPop < 0.6 ? 1.3 * V.heatPop / 0.6 : 1.3 - 0.3 * (V.heatPop - 0.6) / 0.4;
        g.beginPath(); g.arc(cx, cy, Math.max(0.5, rad - 1), 0, 7);
        if (lit || V.heatFlash) {
          const col = V.heatFlash ? '#fff' : (i + V.heatPhase) % 2 === 0 ? C.pink : C.cyan;
          g.shadowColor = col; g.shadowBlur = 10 * meter.dpr; g.fillStyle = col; g.fill(); g.shadowBlur = 0;
        } else {
          g.fillStyle = INK55; g.fill(); g.strokeStyle = 'rgba(255, 255, 255, .4)'; g.lineWidth = 2; g.stroke();
        }
      }
    } },
  { id: 'speed',
    key: (V) => (V.onFoot ? null : V.kmh + V.vehicle),
    draw(g, r, V, L) {
      const big = L.s(22, 44), base = r.y + r.h - Math.max(4, r.h * 0.16);
      font(g, big, 900, true); const nw = g.measureText(String(V.kmh)).width;
      spacing(g, 2); font(g, 14); const uw = g.measureText('km/h').width; spacing(g, 0);
      const name = V.vehicle ? ' · ' + V.vehicle : '';
      font(g, L.s(14, 20), 700, true); const vw = g.measureText(name).width;
      const total = nw + 6 + uw + vw;
      let x = L.mode === 'D' ? r.x : r.x + (r.w - Math.min(total, r.w)) / 2;
      shadow(g, true); g.fillStyle = '#fff'; g.textBaseline = 'alphabetic'; g.textAlign = 'left';
      font(g, big, 900, true); g.fillText(String(V.kmh), x, base); x += nw + 6;
      spacing(g, 2); font(g, 14); g.fillText('km/h', x, base); x += uw; spacing(g, 0);
      font(g, L.s(14, 20), 700, true); g.fillText(name, x, base, Math.max(10, r.x + r.w - x));
    } },
  { id: 'badge',
    key: (V) => V.badge,
    draw(g, r, V, L) {
      shadow(g, true); g.globalAlpha = 0.85; g.fillStyle = '#fff'; g.textBaseline = 'middle';
      font(g, L.s(14, 16)); spacing(g, 1);
      g.textAlign = L.mode === 'D' ? 'right' : 'center';
      g.fillText(V.badge, L.mode === 'D' ? r.x + r.w : r.x + r.w / 2, r.y + r.h / 2 + 1, r.w);
    } },
  { id: 'drop',
    key: (V) => V.drop || null,
    draw(g, r, V, L) {
      shadow(g, true); g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.textAlign = 'left';
      font(g, L.s(14, 20), 700, true);
      g.fillStyle = C.cyan; g.fillText('›', r.x, r.y + r.h / 2); g.fillStyle = '#fff';
      g.fillText(V.drop, r.x + 14, r.y + r.h / 2 + 1, r.w - 14);
    } },
  { id: 'drift',
    key: (V) => (V.drift ? V.drift + V.driftTone : null),
    draw(g, r, V, L) {
      shadow(g, true); g.textBaseline = 'middle'; g.textAlign = 'center';
      g.fillStyle = V.driftTone === 'bad' ? C.pink : V.driftTone === 'good' ? C.mint : C.mango;
      font(g, L.s(22, 36), 900, true);
      g.fillText(V.drift, r.x + r.w / 2, r.y + r.h / 2 + 1, r.w);
    } },
  { id: 'prompt',
    key: (V) => (V.prompt && !V.sub && !V.clip ? V.prompt.key + V.prompt.text + V.pulse : null),
    anim: (V) => V.prompt && V.now - V.prompt.t0 < 0.15,
    draw(g, r, V, L) {
      const p = V.prompt, cap = Math.min(r.h - 8, L.s(24, 30)), pad = L.s(8, 12), mid = r.y + r.h / 2;
      font(g, L.s(14, 18), 800); const kw = Math.max(cap, g.measureText(p.key).width + 12);
      font(g, L.s(14, 18)); const tw = g.measureText(p.text).width;
      const w = Math.min(r.w, pad + kw + 10 + tw + pad + 4), x = r.x + (r.w - w) / 2;
      g.globalAlpha = sat((V.now - p.t0) / 0.15);
      pill(g, x, r.y, w, r.h, INK55);
      const beat = V.reduce ? 1 : 0.8 + 0.2 * Math.abs(Math.cos(V.pulse * Math.PI / 10));
      g.globalAlpha *= beat; pill(g, x + pad, mid - cap / 2, kw, cap, C.cyan, 8); g.globalAlpha /= beat;
      g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillStyle = C.ink;
      font(g, L.s(14, 18), 800); g.fillText(p.key, x + pad + kw / 2, mid + 1);
      g.textAlign = 'left'; g.fillStyle = '#fff'; font(g, L.s(14, 18));
      g.fillText(p.text, x + pad + kw + 10, mid + 1, r.w - (pad * 2 + kw + 14));
    } },
  { id: 'hint',
    key: (V) => (V.hint && !V.sub && !V.clip ? V.hint.text : null),
    anim: (V) => V.hint && (V.now - V.hint.t0 < 0.3 || V.hint.end - V.now < 0.8),
    draw(g, r, V, L) {
      const h = V.hint, size = font(g, L.s(14, 16)); spacing(g, 1);
      const lineH = size + 6, maxLines = Math.max(1, Math.floor((r.h - 16) / lineH));
      const lines = wrap(g, h.text, r.w - 28, maxLines);
      const w = Math.min(r.w, Math.max(...lines.map((s) => g.measureText(s).width)) + 28), hh = lines.length * lineH + 10;
      g.globalAlpha = fade(V.now, h.t0, h.end, V.reduce ? 0.12 : 0.3, V.reduce ? 0.12 : 0.8);
      pill(g, r.x + (r.w - w) / 2, r.y + r.h - hh, w, hh, INK55, Math.min(20, hh / 2));
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
      lines.forEach((s, i) => g.fillText(s, r.x + r.w / 2, r.y + r.h - hh + 5 + lineH * (i + 0.5) + 1, r.w - 28));
    } },
  { id: 'toast',
    key: (V) => (V.toasts.length ? V.toasts.map((t) => t.n).join() : null),
    anim: (V) => V.toasts.some((t) => V.now - t.t0 < 0.2 || t.end - V.now < 0.3),
    draw(g, r, V, L) {
      g.textBaseline = 'middle';
      V.toasts.forEach((t, i) => {
        const a = fade(V.now, t.t0, t.end, V.reduce ? 0.12 : 0.2, V.reduce ? 0.12 : 0.3);
        const y = r.y + i * r.step - (V.reduce ? 0 : (1 - sat((V.now - t.t0) / 0.2)) * 16), mid = y + r.rowH / 2;
        font(g, L.s(14, 16));
        const tw = Math.min(g.measureText(t.text).width, r.w - 44), w = tw + 44, x = r.x + (r.w - w) / 2;
        g.globalAlpha = a;
        pill(g, x, y, w, r.rowH, INK55);
        g.beginPath(); g.arc(x + 16, mid, 5, 0, 7); g.fillStyle = t.tone === 'gain' ? C.mint : t.tone === 'bad' ? C.pink : C.cyan; g.fill();
        g.fillStyle = '#fff'; g.textAlign = 'left'; g.fillText(t.text, x + 28, mid + 1, tw);
      });
    } },
  { id: 'subtitle',
    key: (V) => (V.sub ? V.sub.who + V.sub.text : null),
    anim: (V) => V.sub && (V.now - V.sub.t0 < 0.12 || V.sub.end - V.now < 0.2),
    draw(g, r, V, L) {
      const sb = V.sub, face = L.s(36, 48), pad = 8;
      font(g, L.s(14, 20)); const lines = wrap(g, sb.text, r.w - face - pad * 3 - 4, 2), lw = Math.max(...lines.map((s) => g.measureText(s).width));
      font(g, L.s(14, 16), 800); const nw = lines.length > 1 ? 0 : g.measureText(sb.who).width + 8;
      const w = Math.min(r.w, pad * 3 + face + nw + lw + 6), x = r.x + (r.w - w) / 2, mid = r.y + r.h / 2;
      g.globalAlpha = fade(V.now, sb.t0, sb.end, 0.12, 0.2);
      pill(g, x, r.y, w, r.h, INK70, 14);
      pill(g, x + pad, mid - face / 2, face, face, C.mango, 10);     // the speaker's square: their initial until faces ship
      g.fillStyle = C.ink; g.textAlign = 'center'; g.textBaseline = 'middle';
      font(g, L.s(18, 24), 900, true); g.fillText(sb.who.charAt(0).toUpperCase(), x + pad + face / 2, mid + 1);
      g.textAlign = 'left';
      let tx = x + pad * 2 + face;
      if (nw) { g.fillStyle = C.mango; font(g, L.s(14, 16), 800); g.fillText(sb.who, tx, mid + 1); tx += nw; }
      g.fillStyle = '#fff'; const size = font(g, L.s(14, 20));
      lines.forEach((s, i) => g.fillText(s, tx, mid + 1 + (i - (lines.length - 1) / 2) * (size + 4), r.x + r.w - tx - pad));
    } },
  { id: 'tag',
    key: (V) => (V.tag ? V.tag.title : null),
    anim: (V) => !!V.tag,
    draw(g, r, V) {
      const tag = V.tag, t = V.now - tag.t0, str = r.string, bw = r.w, bh = r.h - str, scale = bw / 360;
      if (tagFor !== tag.title + '|' + tag.hood + '|' + tag.colour) paintTag(tag);
      if (23 * scale < meter.minFont) meter.minFont = Math.floor(23 * scale * 10) / 10;
      const px = r.x + bw / 2, py = r.y;
      let dy = 0, ang = 0, a = 1;
      if (V.reduce) a = sat(Math.min(t / 0.12, (3.25 - t) / 0.12));
      else {
        const travel = r.y + r.h + 20;
        if (t < 0.35) dy = -travel * (1 - sat(t / 0.35)) ** 2;
        else if (t > 3) dy = -travel * sat((t - 3) / 0.25) ** 2;
        ang = (14 * Math.PI / 180) * Math.exp(-2.2 * t) * Math.cos(6.9 * t);
      }
      g.globalAlpha = a;
      g.translate(px, py + dy); g.rotate(ang);
      g.strokeStyle = C.sand; g.lineWidth = 2; g.beginPath(); g.moveTo(0, py > 1 ? 0 : -400); g.lineTo(0, str + 14 * scale); g.stroke();
      if (py > 1) { g.beginPath(); g.arc(0, 0, 4, 0, 7); g.fillStyle = C.ink; g.fill(); g.stroke(); }     // a pin where there is no screen edge to hang from
      g.shadowColor = 'rgba(21, 15, 61, .45)'; g.shadowBlur = 12 * meter.dpr; g.shadowOffsetY = 4 * meter.dpr;
      g.drawImage(tagCanvas, -bw / 2, str, bw, bh);
    } },
];
// the followers pill gives its place to LIVE on an upright phone; hud.mod.js sets this on layout
export const L_PORTRAIT = { on: false };
