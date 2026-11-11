// Quality levels and every budget number, in one table. Tuning the game for phones is this file.
// Each row is [low, medium, high]. quality.get('trafficCap') reads the row for the current level.
// Also here: the resolution that drops by itself when frames are slow.

const LEVELS = ['low', 'medium', 'high'];

export const TABLE = {
  // --- budgets a check holds the build to (plan/06, "Performance budgets") ---
  targetFps:      [30, 45, 60],
  maxCalls:       [150, 225, 300],
  maxTris:        [180000, 390000, 600000],
  maxSimMs:       [6, 5, 4],
  maxChunkMs:     [4, 4, 4],
  maxFrameMs:     [50, 40, 33],
  maxHeapMB:      [250, 425, 600],
  maxCanvasTextures: [6, 7, 8],   canvasTextureSize: [1024, 2048, 2048],
  // --- what the game draws and simulates ---
  lod0Radius:     [1, 2, 2],      lod1Radius: [4, 5, 6],
  pixelRatio:     [1.5, 1.5, 2],  minPixelRatio: [0.75, 1, 1],
  antialias:      [false, true, true],
  trafficCap:     [14, 26, 40],   pedCap: [20, 40, 60],   copCap: [6, 9, 12],
  debrisCap:      [40, 80, 120],  windowGeometry: [false, true, true],
  shadows:        ['blob', 'blob', 'sun'],  post: [false, false, true],
  fog:            [[150, 700], [220, 1000], [300, 1400]],
  rainStreaks:    [300, 700, 1400],  audioVoices: [24, 36, 48],
  smokeEvery:     [0.075, 0.02, 0.02],      // seconds between tyre smoke puffs (day 2's numbers)
  contentTier:    'A',                       // raised by the build for bonus and later content
};

// gzipped JavaScript allowed on a given day: 220 kB on day 2, 35 kB more each day, never over 450
export const bundleBudgetKb = (day) => Math.min(450, 220 + 35 * Math.max(0, day - 2));

export function createQuality(params, events) {
  const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;   // phones and tablets
  const asked = params.get('quality');
  let index = LEVELS.includes(asked) ? LEVELS.indexOf(asked) : coarse ? 0 : 2;
  let ratio = 1, frames = 0, slow = 0, apply = () => {};

  const quality = {
    levels: LEVELS, coarse,
    get level() { return LEVELS[index]; },
    get pixelRatio() { return ratio; },
    get(key, level) {
      const row = TABLE[key];
      return Array.isArray(row) ? row[level ? LEVELS.indexOf(level) : index] : row;
    },
    set(level) {
      const i = LEVELS.indexOf(level);
      if (i < 0 || i === index) return;
      const from = LEVELS[index];
      index = i;
      ratio = Math.min(window.devicePixelRatio || 1, quality.get('pixelRatio'));
      apply(ratio);
      events.emit('quality:changed', { level, from });
    },
    // main.js hands over the function that puts a pixel ratio on the renderer
    attach(fn) {
      apply = fn;
      ratio = Math.min(window.devicePixelRatio || 1, quality.get('pixelRatio'));
      apply(ratio);
    },
    // called once a frame with the real frame time: if most frames are slow, draw fewer pixels
    frame(rawSeconds) {
      frames++;
      if (rawSeconds > 1 / 35) slow++;
      if (frames < 120) return;
      if (slow > 70 && ratio > quality.get('minPixelRatio')) {
        ratio = Math.max(quality.get('minPixelRatio'), ratio - 0.25);
        apply(ratio);
      }
      frames = slow = 0;
    },
  };
  return quality;
}
