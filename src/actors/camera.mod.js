// Cameras: in a car the chase view, the close chase view (C) and look-back (hold B); on foot a
// third-person orbit. Public object: { mode, lookBack, target, yaw, pitch, mix, next(), snap(),
// resize(w, h), speedShake(), setTarget('car' or 'foot', body), step(dt, actions) }.
import { createCameras } from './camera.js';

let cams;
export default {
  name: 'camera', order: 60, needs: ['world', 'vehicles', 'fx', 'collide', 'player'],
  init(ctx) {
    const m = ctx.modules;
    cams = createCameras(ctx.camera, m.world, m.vehicles.player, m.fx, m.collide);
    ctx.events.on('input:press', ({ name }) => { if (name === 'camera' && cams.target === 'car') cams.next(); });
    ctx.events.on('game:reset', () => cams.snap());
    ctx.events.on('view:resize', ({ w, h }) => cams.resize(w, h));
    return cams;
  },
  update(dt, ctx) { cams.step(dt, ctx.input.actions); },
  render(alpha, ctx) { cams.update(ctx.loop.dt, ctx.input.actions.lookBack); },
};
