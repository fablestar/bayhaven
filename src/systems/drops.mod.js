// The daily drop: each build day can carry one small extra (day 2: Drift Night). Drops are
// files in src/content/drops/ named day-<n>.js; the one whose day matches the build day runs.
// Public object: { id, active } where active is what the drop's start(ctx) returned, or null.

const files = import.meta.glob('../content/drops/day-*.js', { eager: true });
let active = null;

export default {
  name: 'drops', order: 45, renderOrder: 65, needs: ['props', 'world', 'hud'],
  init(ctx) {
    let drop = null;
    for (const path in files) if (files[path].default.day === ctx.build.day) drop = files[path].default;
    if (drop) active = drop.start(ctx);
    else if (ctx.modules.hud) ctx.modules.hud.drop('');
    ctx.events.on('game:reset', () => { if (active && active.reset) active.reset(); });
    return { id: drop ? drop.id : null, active };
  },
  render(alpha, ctx) { if (active && active.update) active.update(ctx.loop.dt, ctx.modules.sky ? ctx.modules.sky.night : 0); },
};
