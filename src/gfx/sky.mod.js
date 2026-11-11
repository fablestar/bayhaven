// The sky, sun, sea and fog, all turned by the clock. Public object: { night, sunDir, update }.
import { createSky } from './sky.js';

let sky;
export default {
  name: 'sky', order: 12, renderOrder: 62,      // drawn after the camera has moved, as on day 1
  init(ctx) { sky = createSky(ctx.scene); return sky; },
  render(alpha, ctx) { sky.update(ctx.state.clock.hour, ctx.loop.frameTime, ctx.camera); },
};
