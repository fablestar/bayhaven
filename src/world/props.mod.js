// Props you can knock over. Other modules add props while they start up; the instanced
// meshes are built once, just before the first step or frame.
// Order 26: props move after the vehicles step (20), as they did before the module split.
import { createProps } from './props.js';

let props, built = false;
const build = () => { if (!built) { built = true; props.finish(); } };
export default {
  name: 'props', order: 26,
  init(ctx) {
    props = createProps(ctx.scene);
    ctx.events.on('game:reset', () => props.reset());
    return props;
  },
  update(dt, ctx) { build(); props.update(dt, ctx.modules.sky ? ctx.modules.sky.night : 0); },
  render() { build(); },
};
