// The Bayhaven wordmark, in our own letterforms: thick single-weight strokes made of straight bars
// and circle arcs, a slight forward slant, and the y's tail running on as a wave under the word.
// Pink over a cyan offset shadow. No font is used. Units: the x-height is 1, the baseline is y = 0
// and up is negative. wordmarkCanvas(height) paints it once per size and keeps it.

const PINK = '#ff4fa8', CYAN = '#29e6ff';
const P = Math.PI, STROKE = 0.3, GAP = 0.44, SLANT = 0.18;
const ASC = 1.7, DESC = 0.85;

// each letter: its advance width and a function that adds its strokes to the path at x
const LETTERS = {
  B: [0.85, (g, x) => {
    g.moveTo(x, -ASC); g.lineTo(x, 0);
    g.moveTo(x, -ASC); g.lineTo(x + 0.35, -ASC); g.arc(x + 0.35, -1.3, 0.4, -P / 2, P / 2); g.lineTo(x, -0.9);
    g.moveTo(x + 0.4, -0.9); g.arc(x + 0.4, -0.45, 0.45, -P / 2, P / 2); g.lineTo(x, 0);
  }],
  a: [1, (g, x) => { g.moveTo(x + 1, -0.5); g.arc(x + 0.5, -0.5, 0.5, 0, P * 2); g.moveTo(x + 1, -1); g.lineTo(x + 1, 0); }],
  y: [0.9, (g, x, end) => {
    g.moveTo(x, -1); g.lineTo(x, -0.45); g.arc(x + 0.45, -0.45, 0.45, P, 0, true); g.lineTo(x + 0.9, -1);
    // the tail: down, round the corner, and off to the right as a wave under the rest of the word
    g.moveTo(x + 0.9, -0.45); g.lineTo(x + 0.9, 0.3); g.arc(x + 1.2, 0.3, 0.3, P, P / 2, true);
    for (let wx = x + 1.2; wx <= end; wx += 0.06) g.lineTo(wx, 0.6 - 0.085 * (1 - Math.cos((wx - x - 1.2) * 4.4)) + 0.085 * 0);
  }],
  h: [0.9, (g, x) => { g.moveTo(x, -ASC); g.lineTo(x, 0); g.moveTo(x, -0.45); g.arc(x + 0.45, -0.55, 0.45, P, 0); g.lineTo(x + 0.9, 0); }],
  v: [0.9, (g, x) => { g.moveTo(x, -1); g.lineTo(x + 0.45, 0); g.lineTo(x + 0.9, -1); }],
  e: [0.97, (g, x) => { g.moveTo(x + 0.03, -0.5); g.lineTo(x + 0.97, -0.5); g.arc(x + 0.5, -0.5, 0.47, 0, 0.95, true); }],
  n: [0.9, (g, x) => { g.moveTo(x, -1); g.lineTo(x, 0); g.moveTo(x, -0.45); g.arc(x + 0.45, -0.55, 0.45, P, 0); g.lineTo(x + 0.9, 0); }],
};
const WORD = 'Bayhaven';
const WIDTH = [...WORD].reduce((w, ch) => w + LETTERS[ch][0] + GAP, -GAP);
// the box the mark needs, in units: the slant pushes tall letters right, the shadow adds a little
const PAD = STROKE / 2 + 0.06, SHADOW = 0.1;
export const WORDMARK_ASPECT = (WIDTH + ASC * SLANT + PAD * 2 + SHADOW) / (ASC + DESC + PAD * 2 + SHADOW);

function trace(g) {
  g.beginPath();
  let x = 0;
  for (const ch of WORD) { const [w, add] = LETTERS[ch]; add(g, x, WIDTH); x += w + GAP; }
}

// Draw the mark with its top left at (x, y), `height` pixels tall. Returns the width used.
export function drawWordmark(g, x, y, height) {
  const u = height / (ASC + DESC + PAD * 2 + SHADOW);
  g.save();
  g.translate(x + PAD * u, y + (ASC + PAD) * u);
  g.scale(u, u);
  g.transform(1, 0, -SLANT, 1, 0, 0);
  g.lineWidth = STROKE; g.lineCap = 'round'; g.lineJoin = 'round';
  g.translate(SHADOW, SHADOW); trace(g); g.strokeStyle = CYAN; g.stroke();
  g.translate(-SHADOW, -SHADOW); trace(g); g.strokeStyle = PINK; g.stroke();
  g.restore();
  return height * WORDMARK_ASPECT;
}

const made = new Map();
export function wordmarkCanvas(height) {
  height = Math.round(height);
  if (!made.has(height)) {
    const c = document.createElement('canvas');
    c.height = height; c.width = Math.ceil(height * WORDMARK_ASPECT);
    drawWordmark(c.getContext('2d'), 0, 0, height);
    made.set(height, c);
  }
  return made.get(height);
}
