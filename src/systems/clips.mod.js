// Scripted clips, one per day, in src/content/clips/day-<n>.js. A clip is a start pose, an hour
// and timed holds, played through the same input and physics as a player, so it comes out the
// same every time. ?clip=day-2 plays one at load; test.clip.play(id) plays one in a check.

const files = import.meta.glob('../content/clips/day-*.js', { eager: true });

export default {
  name: 'clips', order: 46, needs: ['player', 'hud'],
  init(ctx) {
    const clips = {};
    for (const path in files) clips[files[path].default.id] = files[path].default;
    const m = ctx.modules;
    function play(id) {
      const clip = clips[id];
      if (!clip) return Promise.reject(new Error('no clip called ' + id));
      if (m.hud) m.hud.clipMode(true);
      if (m.clock) m.clock.set(clip.hour);
      if (m.fx) m.fx.seed(1);
      ctx.events.emit('game:reset');
      m.player.teleport(clip.at.x, clip.at.z, clip.at.heading);
      return ctx.input.inject(clip.inputs).then(() => { if (m.hud) m.hud.clipMode(false); });
    }
    ctx.test.clip = { play };
    const id = ctx.params.get('clip');
    if (id) ctx.events.once('game:ready', () => play(id).catch((e) => console.error(e.message)));
    return { play, ids: Object.keys(clips) };
  },
};
