// Parked cars. Every road piece has curb spaces 6 m long down both sides; each chunk fills about
// 30% of its own from its seed, so the same cars are parked there every time. Pure data: the
// traffic module turns the nearest ones into vehicles. No three.js in here.
import { hash2 } from '../core/rng.js';
import { MODEL_IDS, pickPaint } from './models.js';

export const SPACE = 6, FILL = 0.3;
// a cab on the curb is at a rank, not asleep; a bus is twice as long as a space; carts stay on the greens
const PARKABLE = MODEL_IDS.filter((id) => id !== 'taxi' && id !== 'manatee' && id !== 'birdie');
const unit = (h) => h / 4294967296;

// The filled curb spaces of one chunk: [{ key, x, z, h, model, paint, accent, gone }]
export function curbSpaces(map, cx, cz) {
  const out = [], seed = map.chunkSeed(cx, cz);
  out.total = 0;
  map.roadsInChunk(cx, cz).forEach((p, pi) => {
    if (p.stub || !p.a || !p.b) return;
    const A = map.nodes.get(p.a), B = map.nodes.get(p.b), ns = p.axis === 'ns', cross = ns ? 'ew' : 'ns';
    const from = A.half[cross] + 8, to = p.len - B.half[cross] - 8, n = Math.floor((to - from) / SPACE);
    for (let side = 0; side < 2; side++) {
      // the side to the right of travel: heading 0 runs south (+z), a quarter turn runs east (+x)
      const h = ns ? (side ? Math.PI : 0) : (side ? -Math.PI / 2 : Math.PI / 2);
      const fx = Math.sin(h), fz = Math.cos(h), off = p.width / 2 - 1.2;
      for (let i = 0; i < n; i++) {
        const r = hash2(seed, pi * 4 + side, i);
        out.total++;
        if (unit(r) >= FILL) continue;
        const t = from + (i + 0.5) * SPACE, mx = ns ? p.ax : p.ax + t, mz = ns ? p.az + t : p.az;
        if (Math.abs(mx) < 60 && Math.abs(mz) < 45) continue;        // day 1's block keeps its own five parked cars
        const model = PARKABLE[hash2(r, 1, 7) % PARKABLE.length], paint = pickPaint(model, unit(hash2(r, 2, 9)));
        out.push({ key: cx + ',' + cz + ':' + pi + ':' + side + ':' + i, x: mx - fz * off, z: mz + fx * off, h, model, paint: paint.paint, accent: paint.accent,
          alarm: hash2(r, 3, 11) % 10 < 4, gone: false, car: null });
      }
    }
  });
  return out;
}
