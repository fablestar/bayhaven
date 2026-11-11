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
    return world;
  },
  update(dt, ctx) { if (world) world.refresh(ctx.state.player.x, ctx.state.player.z); },
  render(alpha, ctx) { if (legacy) legacy.update(ctx.modules.sky ? ctx.modules.sky.night : 0); },
};
