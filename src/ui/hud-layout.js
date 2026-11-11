// Where every HUD piece sits. One pure function: screen size, touch or not, safe-area insets in,
// a rectangle per piece out. Numbers are CSS pixels from plan/bible/art/ui-kit.md section 2:
// "P" is a phone held sideways (844x390), "D" is 1920x1080, and sizes slide between the two by k.
// Three placements: 'D' (no touch, landscape), 'P' (touch, landscape) and 'portrait'.
// Each piece owns its rectangle. Pairs that are never on screen together are listed in `excl`.

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// what the touch buttons take up at the bottom corners, from touch.mod.js (CSS px)
export const TOUCH = { steer: 72, steerGap: 12, rightBlock: 260 };

export function layoutFor(W, H, touch, ins) {
  const k = clamp((Math.min(W, H) - 390) / 690, 0, 1), s = (p, d) => p + (d - p) * k;
  const portrait = H > W, mode = portrait ? 'portrait' : touch ? 'P' : 'D';
  const l = ins.l, t = ins.t, r = W - ins.r, b = H - ins.b, cx = Math.round((l + r) / 2);
  const m = s(14, 24), mt = s(10, 24), mb = s(14, 24), ph = s(28, 44), gap = s(6, 10);
  const R = {};
  const put = (id, x, y, w, h, bleed = 2, excl) => {
    R[id] = { id, x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h), bleed, excl: excl || [] };
    return R[id];
  };
  const centred = (id, y, w, h, bleed, excl) => put(id, cx - w / 2, y, w, h, bleed, excl);

  // top row: cash and followers on the left, the clock on the right, LIVE beside the clock
  const cash = put('cash', l + m, t + mt, s(120, 190), ph, 4);
  const clock = put('clock', r - m - s(104, 150), t + mt, s(104, 150), ph);
  if (portrait) {
    put('followers', cash.x + cash.w + gap, t + mt, 92, ph, 2, ['live']);
    put('live', cash.x + cash.w + gap, t + mt, 126, ph, 2, ['followers']);     // takes the followers' place while live
  } else {
    put('followers', cash.x + cash.w + gap, t + mt, s(92, 230), ph);
    const lw = s(132, 210);
    put('live', clock.x - gap - lw, t + mt, lw, ph);
  }

  const mmSize = s(120, 180), d = s(18, 24), hg = s(6, 10), heatW = 5 * d + 4 * hg;
  let mm, leftEdge, rightEdge;      // what the hint has to fit between
  if (portrait) {
    mm = put('minimap', l + 14, t + 46, 120, 120);
    put('heat', l + 144, t + 50, heatW, d, 12);
    put('speed', l + 144, t + 76, 220, 28, 8);
    put('radio', l + 144, t + 108, 200, 28, 2);
    centred('badge', t + 242, 200, 18, 8);
    centred('toast', t + 266, Math.min(280, r - l - 28), 30, 18, ['tag']);
    put('tag', cx - 110, t + 266, 220, 20 + 73, 40, ['toast']).string = 20;
    put('drop', l + 14, t + 364, r - l - 28, 22, 8);
    centred('drift', t + 392, 240, 30, 8);
    centred('subtitle', b - 250 - 52, Math.min(340, r - l - 28), 52, 2, ['hint', 'prompt']);
    centred('hint', b - 190 - 56, r - l - 28, 56, 2, ['subtitle']);
  } else if (mode === 'P') {
    mm = put('minimap', l + m, b - mb - mmSize, mmSize, mmSize);
    put('heat', l + m, mm.y - 6 - d, heatW, d, 12);            // above the minimap: the stick rests beside it
    // the bottom middle is what the thumbs leave free: between the steer buttons (or the resting stick) and the right-hand buttons
    leftEdge = mm.x + mm.w + 16 + TOUCH.steer * 2 + TOUCH.steerGap; rightEdge = r - TOUCH.rightBlock;
    const free = Math.max(140, rightEdge - leftEdge - 12), fx = Math.round((leftEdge + rightEdge) / 2);
    const mid = (id, y, w, h, bleed, excl) => put(id, fx - Math.min(w, free) / 2, y, Math.min(w, free), h, bleed, excl);
    mid('speed', b - 34 - 28, 220, 28, 4);
    mid('badge', b - 12 - 18, 200, 18, 4);
    centred('radio', t + 10, 200, 28, 2, ['tag']);
    const toast = centred('toast', t + 44, 280, 30, 18, ['tag']);
    put('tag', cx - 110, t, 220, 44 + 73, 40, ['toast', 'radio']).string = 44;
    put('drop', l + m, t + 58, Math.min(260, toast.x - 8 - l - m), 22, 8);
    centred('drift', t + 130, 240, 30, 8);
    centred('subtitle', b - 134 - 52, 300, 52, 2, ['hint', 'prompt']);
    mid('hint', b - 66 - 56, 420, 56, 2, ['subtitle']);
  } else {
    mm = put('minimap', l + m, b - mb - mmSize, mmSize, mmSize);
    const hx = mm.x + mm.w + s(16, 20);
    put('heat', hx, b - s(104, 126) - d, heatW, d, 12);
    put('speed', hx, b - mb - s(30, 52), s(220, 330), s(30, 52), 8);
    const bw = s(200, 240), bh = s(18, 22);
    put('badge', r - m - bw, b - s(12, 24) - bh, bw, bh, 8);
    const rw = s(200, 280), rh = s(28, 40);
    const radio = put('radio', r - m - rw, b - s(46, 60) - rh, rw, rh, 2);
    const fol = R.followers, tw = Math.min(s(280, 560), 2 * Math.min(cx - fol.x - fol.w - 8, R.live.x - 8 - cx));
    const th = s(30, 40), step = s(36, 48);
    const toast = centred('toast', t + mt, tw, th + 2 * step, 18, ['tag']); toast.rows = 3; toast.step = step; toast.rowH = th;
    const tagW = s(220, 360), str = s(44, 60);
    put('tag', cx - tagW / 2, t, tagW, str + s(73, 120), s(40, 64), ['toast']).string = str;
    put('drop', l + m, t + s(58, 104), Math.min(s(260, 520), toast.x - 8 - l - m), s(22, 28), 8);
    centred('drift', t + s(130, 230), s(240, 420), s(30, 44), 8);
    centred('subtitle', b - s(134, 210) - s(52, 64), s(300, 720), s(52, 64), 2, ['hint', 'prompt']);
    centred('prompt', b - s(102, 150) - s(30, 44), s(260, 420), s(30, 44), 4, ['subtitle']);
    const hw = Math.min(s(520, 900), 2 * Math.min(cx - mm.x - mm.w - 8, radio.x - 8 - cx));
    centred('hint', b - s(66, 96) - s(30, 36), hw, s(30, 36), 2, ['subtitle']);
  }
  if (!R.toast.rows) { R.toast.rows = 1; R.toast.step = 0; R.toast.rowH = 30; }
  return { mode, k, s, W, H, cx, safe: { l, t, r, b }, rects: R };
}
