// STAND-IN: replace with the map contract in plan/bible/tech/contracts.md when the districts ship.
// Answers the map's questions for the day 1 block only: which district, land or water, how
// high the ground is, what it is made of. No three.js in here.

const CHUNK = 160;
// the day 1 block and the city sketched around it; the sea starts at z = 80
const DRAWN = { x0: -285, x1: 285, z0: -270, z1: 300 };
const SHORE = 80;

// block: { heightAt(x, z), bounds, spawn } from the day 1 world; nav: the lane graph (may be missing)
export function createMap(block, nav) {
  const inside = (x, z) => x >= DRAWN.x0 && x <= DRAWN.x1 && z >= DRAWN.z0 && z <= DRAWN.z1;
  const map = {
    chunk: CHUNK,
    bounds: block.bounds,          // where the player can go today
    drawn: DRAWN,
    spawn: block.spawn,
    chunkOf: (x, z) => ({ cx: Math.floor(x / CHUNK), cz: Math.floor(z / CHUNK) }),
    districtAt: (x, z) => (inside(x, z) ? 'tideline' : null),
    neighbourhoodAt: () => null,
    isLand: (x, z) => inside(x, z) && z <= SHORE,
    heightAt: (x, z) => block.heightAt(x, z),
    depthAt: (x, z) => (z > SHORE ? Math.max(0, -block.heightAt(x, z)) : 0),
    surfaceAt(x, z) {
      if (z > SHORE) return 'water';
      if (z > 50) return 'sand';
      return block.heightAt(x, z) > 0.05 ? 'sidewalk' : 'road';
    },
    lotsInChunk: () => [], roadsInChunk: () => [], places: () => [], landmark: () => null,
    nearestRoad(x, z) {
      const l = nav && nav.laneNear(x, z);
      if (!l) return null;
      const dx = l.bx - l.ax, dz = l.bz - l.az;
      const t = Math.max(0, Math.min(1, ((x - l.ax) * dx + (z - l.az) * dz) / (l.len * l.len)));
      return { x: l.ax + dx * t, z: l.az + dz * t, heading: l.heading, roadId: l.roadId };
    },
    // the nearest valid spot for a seed position; only 'road' moves the point so far
    snap(seed, need) {
      if (need === 'road') { const r = map.nearestRoad(seed.x, seed.z); if (r) return { x: r.x, z: r.z }; }
      return { x: seed.x, z: seed.z };
    },
  };
  return map;
}
