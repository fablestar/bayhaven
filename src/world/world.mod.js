// modules.world: day 1's shape ({ colliders, buildings, bounds, spawn, heightAt, insideBuilding,
// triangles }), kept so the car and the camera need no change while the city streams. Behind it
// are the map and the collision hash: `colliders` holds only the boxes within 14 m of the player,
// filled again each step from the hash, so nobody loops over every box in the city.
// With ?day=1 this is day 1's own block, built whole, as a record of where the game started.
import { createWorld } from './block.js';

let legacy = null, world;
export default {
  name: 'world', order: 11, renderOrder: 63, needs: ['props', 'map', 'collide', 'chunks'],
  init(ctx) {
    const { map, collide, chunks, props } = ctx.modules;
    if (ctx.state.build.day < 2) {
      legacy = createWorld(ctx.scene, props);
      ctx.state.world.chunksLoaded = 1;
      return legacy;
    }
    const colliders = [];
    // a board or a sign another module stands up for good goes into the hash, not this list
    colliders.push = (...boxes) => { for (const b of boxes) collide.add('world:extra', { h: 3, ...b }); return colliders.length; };
    world = {
      colliders, buildings: [], bounds: map.bounds, spawn: map.spawn,
      heightAt: (x, z) => map.heightAt(x, z),
      insideBuilding: (x, y, z, pad) => collide.blocked(x, y, z, pad),
      get triangles() { const s = chunks.stats(); return s.lod0TrisAvg * s.lod0Built + s.shellTris; },
      refresh(x, z) { colliders.length = collide.circle(x, z, 14, undefined, colliders); },
    };
    // Past the barriers at the two ends of the beachfront there is bare ground until its districts
    // are built. The map's bounds used to stop a car there; since they reach the port, a wall does.
    const t = map.zone('tideline');
    if (t) for (const [x, side] of [[t.bounds.x1, 1], [t.bounds.x0, -1]]) {
      if (!map.districtAt(x + side * 10, -100)) colliders.push({ x0: x - (side > 0 ? 5.5 : 0.5), x1: x + (side > 0 ? 0.5 : 5.5), z0: t.bounds.z0, z1: 90, h: 4 });
    }
    return world;
  },
  update(dt, ctx) { if (world) world.refresh(ctx.state.player.x, ctx.state.player.z); },
  render(alpha, ctx) { if (legacy) legacy.update(ctx.modules.sky ? ctx.modules.sky.night : 0); },
};
