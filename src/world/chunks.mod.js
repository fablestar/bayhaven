// The streamer (see chunks.js), the instanced decor and the far skyline. With ?day=1 nothing
// streams: day 1's single block is drawn as it was (world.mod.js), so its numbers can be checked.
import { createChunks } from './chunks.js';
import { createDecor } from './decor.js';
import { createSkyline } from './skyline.js';
import { chunkMaterials } from '../gfx/materials.js';

const genFiles = import.meta.glob('./gen/*.js', { eager: true });
const heroFiles = import.meta.glob('./landmarks/*.js', { eager: true });
const byId = (files) => Object.fromEntries(Object.values(files).filter((m) => m.default && m.default.id).map((m) => [m.default.id, m.default]));

let chunks = null, mats;
export default {
  name: 'chunks', order: 12, renderOrder: 61, needs: ['map', 'collide', 'props', 'nav'],
  init(ctx) {
    const { map, collide, props } = ctx.modules;
    if (ctx.state.build.day < 2) return { disabled: true, buildMs: 0, loadedCount: 0, isLoaded: () => false, ensure: () => Promise.resolve(0), stats: () => ({}) };
    mats = chunkMaterials();
    const decor = createDecor(ctx.scene, { low: () => ctx.quality.level === 'low' });
    const heroes = byId(heroFiles);
    chunks = createChunks({ scene: ctx.scene, map, collide, props, decor, quality: ctx.quality, events: ctx.events, state: ctx.state,
      generators: byId(genFiles), heroes });
    chunks.decor = decor;
    chunks.skyline = createSkyline(ctx.scene, map, heroes);
    chunks.ensure(map.spawn.x, map.spawn.z, 1);          // the first frame shows the nine chunks round the spawn
    ctx.events.on('quality:changed', () => { const p = ctx.state.player; chunks.reset(); chunks.ensure(p.x, p.z, 1); });
    ctx.test.chunks = () => chunks.stats();
    ctx.test.ensure = (x, z, r) => chunks.ensure(x, z, r);
    return chunks;
  },
  render(alpha, ctx) {
    if (!chunks) return;
    mats.update(ctx.modules.sky ? ctx.modules.sky.night : 0);
    chunks.skyline.update(ctx.loop.time, mats.on || 0);
    chunks.update(ctx.camera);
  },
};
