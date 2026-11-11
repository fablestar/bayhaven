// STAND-IN: the map for the day 1 block (see map.js). Owns state.world.
// Public object: districtAt, isLand, heightAt, depthAt, surfaceAt, nearestRoad, snap, bounds, chunkOf.
import { createMap } from './map.js';

let map, was = null;
export default {
  name: 'map', order: 14, needs: ['world', 'nav'],
  init(ctx) {
    map = createMap(ctx.modules.world, ctx.modules.nav);
    ctx.state.world.chunksLoaded = 1;        // the whole block is one piece until streaming ships
    return map;
  },
  update(dt, ctx) {
    const p = ctx.state.player, id = map.districtAt(p.x, p.z);
    if (id === was) return;
    ctx.state.world.district = id;
    ctx.events.emit('district:entered', { id, was });
    was = id;
  },
};
