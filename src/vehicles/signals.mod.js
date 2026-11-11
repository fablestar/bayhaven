// Traffic lights (the work is in src/systems/signals.js; this file is only how the registry finds it).
// Public object: { state(lane), phase(nodeKey), at(x, z), cycle, count, poles }.
import { createSignals } from '../systems/signals.js';

let signals;
export default {
  name: 'signals', order: 19, needs: ['nav', 'collide'],
  init(ctx) {
    if (ctx.state.build.day < 2) return { disabled: true, state: () => 'green', at: () => null, count: 0 };
    signals = createSignals({ nav: ctx.modules.nav, scene: ctx.scene, events: ctx.events, collide: ctx.modules.collide });
    ctx.test.signals = { at: (x, z) => signals.at(x, z) };
    return signals;
  },
  update(dt, ctx) { if (signals) signals.update(ctx.loop.time, ctx.state.player.x, ctx.state.player.z); },
};
