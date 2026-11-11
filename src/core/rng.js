// Seeded random numbers, so the city is the same city every time you load it.

// rng(seed) gives a function that returns the next number in [0, 1). Day 1's generator.
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A well-mixed uint32 from a seed and two whole numbers (a chunk's column and row, say).
export function hash2(seed, a, b) {
  let h = (seed ^ Math.imul(a | 0, 0x27d4eb2d) ^ Math.imul(b | 0, 0x165667b1)) | 0;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}

export const pick = (r, array) => array[Math.floor(r() * array.length)];

// weighted(r, { tarpon: 4, taxi: 3 }) picks a key with a chance in proportion to its weight.
export function weighted(r, weights) {
  let total = 0, last = null;
  for (const k in weights) total += weights[k];
  let at = r() * total;
  for (const k in weights) { last = k; at -= weights[k]; if (at < 0) return k; }
  return last;
}
