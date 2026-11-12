// The mural painter's test entry: test.murals() gives the sheet's numbers, and
// test.murals.paint(seed, palette) paints that mural on a scratch canvas and returns a fingerprint
// of its pixels (the same painter, so the same picture as on the sheet).
import { mural, paintCell, stats, PALMA, SHAPE_NAMES, LAYOUTS } from './murals.js';

export default {
  name: 'murals', order: 11,
  init(ctx) {
    let g = null;
    ctx.test.murals = () => ({ ...stats, layouts: { ...stats.layouts }, shapes: SHAPE_NAMES.length, layoutNames: LAYOUTS.slice() });
    ctx.test.murals.ask = (seed, palette = PALMA) => mural(seed, palette);
    ctx.test.murals.paint = (seed, palette = PALMA) => {
      if (!g) { const c = document.createElement('canvas'); c.width = c.height = 128; g = c.getContext('2d', { willReadFrequently: true }); }
      const layout = paintCell(g, 0, 0, 128, seed, palette, false), d = g.getImageData(0, 0, 128, 128).data, colours = new Set();
      let hash = 0;
      for (let i = 0; i < d.length; i += 4) { hash = (Math.imul(hash, 31) + d[i] * 65536 + d[i + 1] * 256 + d[i + 2]) | 0; colours.add((d[i] >> 5) * 64 + (d[i + 1] >> 5) * 8 + (d[i + 2] >> 5)); }
      return { hash, colours: colours.size, layout };
    };
    return { stats };
  },
};
