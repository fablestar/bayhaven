// The day 1 block: the buildings, streets, promenade and beach at the origin.
// Public object (day 1's shape, until streaming replaces it): { colliders, buildings, bounds,
// spawn, heightAt(x, z), insideBuilding(x, y, z, pad), triangles }.
import { createWorld } from './block.js';

let world;
export default {
  name: 'world', order: 11, renderOrder: 63, needs: ['props'],
  init(ctx) { world = createWorld(ctx.scene, ctx.modules.props); return world; },
  render(alpha, ctx) { world.update(ctx.modules.sky ? ctx.modules.sky.night : 0); },
};
