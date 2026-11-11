// The map (see map.js): zones, roads, blocks, lots, and the questions everyone asks of them.
// Public object: the map contract in docs/contracts/world.md. Owns state.world.district.
import { createMap } from './map.js';

let map, was = null;
export default {
  name: 'map', order: 10,
  init() { map = createMap(); return map; },
  update(dt, ctx) {
    const p = ctx.state.player, id = map.districtAt(p.x, p.z);
    if (id === was) return;
    ctx.state.world.district = id;
    ctx.events.emit('district:entered', { id, was });
    was = id;
  },
};
