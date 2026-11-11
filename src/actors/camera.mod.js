// Cameras: the chase view, the close chase view (C) and look-back (hold B).
// Public object: { mode, lookBack, next(), snap(), resize(w, h), speedShake() }.
import { createCameras } from './camera.js';

let cams;
export default {
  name: 'camera', order: 60, needs: ['world', 'vehicles', 'fx'],
  init(ctx) {
    const m = ctx.modules;
    cams = createCameras(ctx.camera, m.world, m.vehicles.player, m.fx);
    ctx.events.on('input:press', ({ name }) => { if (name === 'camera') cams.next(); });
    ctx.events.on('game:reset', () => cams.snap());
    ctx.events.on('view:resize', ({ w, h }) => cams.resize(w, h));
    return cams;
  },
  render(alpha, ctx) { cams.update(ctx.loop.dt, ctx.input.actions.lookBack); },
};
