// Raised roads: the two deck levels (plan/02-world.md, "Roads"). Level 0 is the ground, level 1
// is a deck. A body carries `level` and changes it only on a ramp: `step` is that rule. Height
// and collision are asked for by level. Pure data, no three.js: map.js turns the paths below into
// road pieces, nav.js into lanes, gen/decks.js draws them.
//   The Bayline Expressway: z = -1480, x -3000 to 3000, 26 m wide, 8 m up, three lanes each way.
//   Ramps at x = -2400, -900, 700 and 2200: 10 m slip roads beside the deck, 100 m long (8%).
//   A ground road passes under the deck at -900 and 700 and ties the districts either side together.

export const DECK = { z: -1480, half: 13, y: 8, x0: -3000, x1: 3000, speed: 30.6, thick: 1.1 };
const RUN = 100, LEAD = 15, PAD = 40, RW = 5;            // ramp length, the flat lead-in at its foot, the merge pad on top, half its width
// side: -1 north of the deck, +1 south. dir: which way it climbs along x.
const RAMP_LIST = [[-2400, -1, 1], [-900, -1, 1], [-900, 1, -1], [700, -1, 1], [700, 1, -1], [2200, 1, -1]];
// the ground roads at each ramp: from a junction of the district to the south, under the deck, to the frontage road to the north
const CROSS = [
  { x: -2400, name: 'Gander Road', pts: [[-2400, -1520], [-2400, -1498]] },
  { x: -900, name: 'Calle Orquídea', under: true, pts: [[-932, -1397], [-900, -1440], [-900, -1462], [-900, -1498], [-900, -1520]] },
  { x: 700, name: 'Route 44', under: true, pts: [[692, -1397], [700, -1440], [700, -1462], [700, -1498], [700, -1520]] },
  { x: 2200, name: 'Keel Street', pts: [[2212, -1397], [2200, -1440], [2200, -1462]] },
];
export const RAMPS = RAMP_LIST.map(([x, side, dir]) => {
  const zc = DECK.z + side * (DECK.half + RW), foot = x + dir * LEAD, top = foot + dir * RUN, join = top + dir * PAD;
  return { x, side, dir, zc, foot, top, join, z0: zc - RW, z1: zc + RW, x0: Math.min(foot, top), x1: Math.max(foot, top), p0: Math.min(top, join), p1: Math.max(top, join) };
});
export const UNDER = CROSS.filter((c) => c.under).map((c) => c.x);

// The road paths: map.js makes one piece for each pair of points. A point is [x, z, y].
export function deckPaths() {
  const paths = [], xs = new Set([DECK.x0, DECK.x1]);
  for (const r of RAMPS) xs.add(r.join);
  const cuts = [...xs].sort((a, b) => a - b), pts = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const n = Math.ceil((cuts[i + 1] - cuts[i]) / 150);
    for (let k = 0; k < n; k++) pts.push([Math.round(cuts[i] + ((cuts[i + 1] - cuts[i]) * k) / n), DECK.z, DECK.y]);
  }
  pts.push([DECK.x1, DECK.z, DECK.y]);
  paths.push({ id: 'bayline-expressway', name: 'Bayline Expressway', kind: 'expressway', width: 26, lanes: 3, offsets: [2.2, 5.8, 9.4], speed: DECK.speed, level: 1, pts });
  for (const r of RAMPS) {
    paths.push({ id: 'ramp:' + r.x + (r.side < 0 ? 'n' : 's'), name: 'Bayline Expressway ramp', kind: 'ramp', width: 10, lanes: 1, offsets: [2.5], speed: 16.7, level: 1,
      pts: [[r.x, r.zc, 0], [r.foot, r.zc, 0], [r.top, r.zc, DECK.y], [r.join, DECK.z, DECK.y]] });
  }
  for (const c of CROSS) paths.push({ id: 'under:' + c.x, name: c.name, kind: 'street', width: 14, lanes: 1, offsets: [3.5], speed: 11.1, level: 0, pts: c.pts.map(([x, z]) => [x, z, 0]) });
  return paths;
}

export function createDecks() {
  let px = 1e9, pz = 1e9, plevel = 0;
  const inBand = (z) => z >= DECK.z - DECK.half - 2 * RW && z <= DECK.z + DECK.half + 2 * RW;
  // the deck or ramp surface over a point: { y, ramp } or null
  const hit = { y: 0, ramp: false };
  function surface(x, z) {
    if (!inBand(z) || x < DECK.x0 || x > DECK.x1) return null;
    if (Math.abs(z - DECK.z) <= DECK.half) { hit.y = DECK.y; hit.ramp = false; return hit; }
    for (const r of RAMPS) {
      if (z < r.z0 || z > r.z1) continue;
      if (x >= r.x0 && x <= r.x1) { hit.y = (DECK.y * Math.abs(x - r.foot)) / RUN; hit.ramp = true; return hit; }
      if (x >= r.p0 && x <= r.p1) { hit.y = DECK.y; hit.ramp = false; return hit; }
    }
    return null;
  }
  const roadUnder = (x) => UNDER.some((u) => Math.abs(x - u) <= 8);
  const decks = {
    deck: DECK, ramps: RAMPS, surface,
    // Height of the raised road at a point for a body on `level`, or null where the ground decides.
    // The first 1.5 m of a ramp is there for both levels. With no level given (old callers), a
    // point within 3 m of the player takes the player's level; anything else is on the deck unless
    // a ground road runs under it there.
    heightAt(x, z, level) {
      const s = surface(x, z);
      if (!s) return null;
      if (s.ramp && s.y < 1.5) return s.y;
      if (level === undefined) level = Math.abs(x - px) < 3 && Math.abs(z - pz) < 3 ? plevel : s.ramp || !roadUnder(x) ? 1 : 0;
      return level ? s.y : null;
    },
    // The level a body is on after moving to (x, z): up only from the foot of a ramp, down at the
    // foot or by leaving the deck (over the edge).
    step(level, x, z) {
      const s = surface(x, z);
      if (!s) return 0;
      if (s.ramp) return s.y < 0.3 ? 0 : level || s.y < 1.5 ? 1 : 0;
      return level;
    },
    // a body set down from nowhere (a teleport, a spawn): on the deck if there is one and no road under it
    levelAt(x, z) { const s = surface(x, z); return s && (s.ramp ? s.y >= 0.3 : !roadUnder(x)) ? 1 : 0; },
    track(x, z, level) { px = x; pz = z; plevel = level; },
  };
  return decks;
}
