// Effects: tyre smoke, sparks, skid marks and camera shake. Reacts to hits through events.
import { createFx } from './fx.js';

let fx;
export default {
  name: 'fx', order: 28, renderOrder: 66, needs: ['world'],
  init(ctx) {
    fx = createFx(ctx.scene, { low: ctx.quality.level === 'low', heightAt: ctx.modules.world.heightAt });
    const y = () => ctx.state.player.y;
    ctx.events.on('vehicle:crash', ({ speed, x, z, nx, nz }) => { fx.sparks(x, y() + 0.45, z, nx, nz); fx.shake(speed * 0.02); });
    ctx.events.on('vehicle:scrape', ({ x, z, nx, nz }) => fx.sparks(x, y() + 0.4, z, nx, nz, 3));
    ctx.events.on('prop:broken', ({ kind }) => fx.shake(kind === 'cone' ? 0.02 : 0.06));
    return fx;
  },
  update(dt) { fx.step(dt); },
  render(alpha, ctx) {
    const cam = ctx.modules.camera;
    fx.draw(ctx.camera, ctx.modules.sky ? ctx.modules.sky.night : 0, cam ? cam.speedShake() : 0);
  },
};
