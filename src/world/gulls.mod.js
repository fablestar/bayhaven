// Gulls over the beach. They go home at night.
import { createGulls } from './gulls.js';

let gulls;
export default {
  name: 'gulls', order: 18, renderOrder: 64,
  init(ctx) { gulls = createGulls(ctx.scene); return {}; },
  render(alpha, ctx) { gulls.update(ctx.loop.frameTime, ctx.modules.sky ? ctx.modules.sky.night : 0); },
};
