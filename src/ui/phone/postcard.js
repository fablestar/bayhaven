// The photo's postcard frame and the three filters (plan/bible/systems/clips-photo.md, "Photo mode").
// A filter is run once over the finished picture. The card is white with rounded corners; the bottom band reads
// "Greetings from Bayhaven · Day N" in the wordmark's colours, with a stamp box for the district and the time.
const FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';

export const FILTERS = [
  { id: 'postcard', name: 'Postcard' },
  { id: 'bleached', name: 'Sun-bleached' },
  { id: 'neon', name: 'Neon Night' },
];

// whole card, photo area and bottom band, by quality and by how the screen is held
export function cardSize(quality, portrait) {
  if (portrait) return { W: 1080, H: 1500, px: 44, py: 44, pw: 992, ph: 1240, band: 216 };
  if (quality === 'low') return { W: 1280, H: 854, px: 43, py: 43, pw: 1194, ph: 672, band: 139 };
  return { W: 1920, H: 1280, px: 64, py: 64, pw: 1792, ph: 1008, band: 208 };
}

export function applyFilter(g, w, h, id) {
  const img = g.getImageData(0, 0, w, h), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], gr = d[i + 1], b = d[i + 2];
    const l = 0.299 * r + 0.587 * gr + 0.114 * b;
    if (id === 'bleached') {                       // saturation down 20%, blacks lifted to 8%
      r = 20.4 + (l + (r - l) * 0.8) * 0.92; gr = 20.4 + (l + (gr - l) * 0.8) * 0.92; b = 20.4 + (l + (b - l) * 0.8) * 0.92;
    } else if (id === 'neon') {                    // contrast up 15%, shadows toward ink, highlights split pink and cyan
      r = 128 + (r - 128) * 1.15; gr = 128 + (gr - 128) * 1.15; b = 128 + (b - 128) * 1.15;
      const s = (1 - l / 255) ** 2 * 0.55;
      r += (21 - r) * s; gr += (15 - gr) * s; b += (61 - b) * s;
      if (l > 170) { const k = ((l - 170) / 85) * 0.22; r += (41 - r) * k; gr += (230 - gr) * k; b += (255 - b) * k; }
      else if (l > 100) { const k = (1 - Math.abs(l - 135) / 35) * 0.16; if (k > 0) { r += (255 - r) * k; gr += (79 - gr) * k; b += (168 - b) * k; } }
    } else {                                       // Postcard: saturation up 12%, a warm lift in the shadows
      const s = (1 - l / 255) ** 2;
      r = l + (r - l) * 1.12 + 14 * s; gr = l + (gr - l) * 1.12 + 6 * s; b = l + (b - l) * 1.12 - 4 * s;
    }
    d[i] = r; d[i + 1] = gr; d[i + 2] = b;          // a clamped array: no need to clamp by hand
  }
  g.putImageData(img, 0, 0);
}

// "Bayhaven · Day N build", bottom right, at least 3% of the frame's height and never under 14 px
export function drawBadge(g, w, h, day) {
  const px = Math.max(14, Math.round(h * 0.032));
  g.save();
  g.font = `${px}px ${FONT}`; g.textAlign = 'right'; g.textBaseline = 'alphabetic';
  g.shadowColor = 'rgba(20, 5, 40, .7)'; g.shadowBlur = px * 0.4; g.shadowOffsetY = 1;
  g.fillStyle = 'rgba(255, 255, 255, .88)';
  g.fillText(`Bayhaven · Day ${day} build`, w - px, h - px * 0.9);
  g.restore();
}

function rounded(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

// photo: a canvas of the photo-area size. Returns the card canvas.
export function frameCard(photo, size, { day, district, time }) {
  const c = document.createElement('canvas'); c.width = size.W; c.height = size.H;
  const g = c.getContext('2d', { willReadFrequently: true }), band = size.band, top = size.H - band;
  rounded(g, 0, 0, size.W, size.H, Math.min(size.W, size.H) * 0.015); g.fillStyle = '#fdf6ea'; g.fill();
  g.drawImage(photo, size.px, size.py, size.pw, size.ph);
  // bottom left: the greeting, pink over a cyan copy, as the wordmark is
  const text = `Greetings from Bayhaven · Day ${day}`, boxW = Math.round(band * 1.9), room = size.W - size.px * 2 - boxW - band * 0.3;
  let px = Math.round(band * 0.36);
  g.font = `italic 900 ${px}px ${FONT}`;
  const wide = g.measureText(text).width; if (wide > room) { px = Math.floor(px * room / wide); g.font = `italic 900 ${px}px ${FONT}`; }
  const base = top + (band - size.py * 0.4) / 2 + px * 0.34, off = Math.max(2, Math.round(px * 0.06));
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  g.fillStyle = '#29e6ff'; g.fillText(text, size.px + off, base + off);
  g.fillStyle = '#ff4fa8'; g.fillText(text, size.px, base);
  // bottom right: a stamp box with the district and the game time
  const bh = Math.round(band * 0.62), bx = size.W - size.px - boxW, by = top + (band - size.py * 0.4 - bh) / 2;
  g.strokeStyle = 'rgba(21, 15, 61, .55)'; g.lineWidth = Math.max(2, band * 0.016); g.setLineDash([band * 0.06, band * 0.04]);
  rounded(g, bx, by, boxW, bh, band * 0.06); g.stroke(); g.setLineDash([]);
  g.textAlign = 'center'; g.fillStyle = '#150f3d';
  let dpx = Math.round(bh * 0.3); g.font = `italic 800 ${dpx}px ${FONT}`;
  const dw = g.measureText(district).width; if (dw > boxW * 0.88) { dpx = Math.floor(dpx * boxW * 0.88 / dw); g.font = `italic 800 ${dpx}px ${FONT}`; }
  g.fillText(district, bx + boxW / 2, by + bh * 0.46);
  g.font = `${Math.round(bh * 0.24)}px ${FONT}`; g.fillStyle = 'rgba(21, 15, 61, .7)';
  g.fillText(time, bx + boxW / 2, by + bh * 0.82);
  return c;
}
