// Session D5-S3 (Mayhem): D5.6 from plan/08-roadmap.md, and one check per item on the session's list.
import { TABLE } from '../../src/core/quality.js';
const QUIET = '&traffic=0&peds=0';
const SMALL = { viewport: { width: 960, height: 540 } };
const settle = (page, ms = 500) => page.waitForTimeout(ms);

// in the page: find a long wall near the spawn and give a function that drives the player into it at `kmh`
const WALL = `(() => {
  const g = window.__game, T = g.test, C = g.modules.collide, p0 = T.player();
  let best = null;
  for (const off of [0, 12, -12, 24, -24, 40, -40, 60, -60]) {
    const x = p0.x + off, hits = [-1.6, 0, 1.6].map((o) => C.ray(x + o, p0.z, x + o, p0.z - 300, undefined, 3));
    if (hits.some((h) => !h) || Math.abs(hits[0].z - hits[1].z) > 0.1 || Math.abs(hits[2].z - hits[1].z) > 0.1) continue;
    if (p0.z - hits[1].z < 12) continue;
    best = { x, z: hits[1].z }; break;
  }
  g.ram = (kmh = 100) => { T.teleport(best.x, best.z + 5.5, Math.PI, kmh / 3.6); T.advance(0.4); return T.damage(); };
  return best;
})()`;

export default [
  {
    id: 'D5.6', name: 'Damage: four 100 km/h wall hits put health under 40 with smoke; further hits emit vehicle:destroyed; debris never exceeds the cap',
    async run(t) {
      for (const level of ['high', 'low']) {
        const page = await t.open(QUIET + '&quality=' + level, SMALL);
        await settle(page);
        const wall = await page.evaluate(WALL);
        t.expect(!!wall, '==', true, level + ': a wall to hit');
        const r = await page.evaluate(() => {
          const g = window.__game, T = g.test;
          g.destroyed = []; g.blasts = 0; g.stages = [];
          g.events.on('vehicle:destroyed', (e) => g.destroyed.push(e)); g.events.on('vehicle:blast', () => g.blasts++);
          g.events.on('vehicle:damaged', (e) => g.stages.push(e.stage));
          const healths = [];
          let peak = 0;
          for (let i = 0; i < 4; i++) { healths.push(g.ram(100).health); peak = Math.max(peak, T.fx().debris); }
          T.advance(0.5);
          const four = T.damage(), fx4 = T.fx(), destroyedAt4 = g.destroyed.length;
          let more = 0;
          while (more < 4 && !g.destroyed.length) { g.ram(100); more++; peak = Math.max(peak, T.fx().debris); }
          // flood the pool: far more boxes than the cap in one go
          for (let i = 0; i < 300; i++) g.modules.fx.debris(T.player().x + (i % 10), 3, T.player().z + 4, { vy: 3 });
          T.advance(0.2);
          const flood = T.fx();
          return { healths, four, fx4, destroyedAt4, more, destroyed: g.destroyed, blasts: g.blasts, stages: g.stages, after: T.damage(), peak: Math.max(peak, flood.debrisPeak), flood, cap: g.quality.get('debrisCap'), errors: T.errors() };
        });
        t.expect(r.four.health, '<', 40, level + ': health after four 100 km/h wall hits');
        t.expect(r.four.health, '>', 0, level + ': still alive after four');
        t.expect(r.four.smoking, '==', true, level + ': smoking');
        t.expect(r.fx4.smoke, '>', 0, level + ': smoke puffs in the air');
        t.expect(r.destroyedAt4, '==', 0, level + ': vehicle:destroyed before the fifth hit');
        t.expect(r.destroyed.length, '==', 1, level + ': vehicle:destroyed events after further hits');
        t.expect(r.more, '<=', 2, level + ': further hits needed');
        t.expect(r.after.dead, '==', true, level + ': the car is a wreck');
        t.expect(r.cap, '==', TABLE.debrisCap[level === 'low' ? 0 : 2], level + ': the debris cap');
        t.expect(r.peak, '<=', r.cap, level + ': most debris alive at once');
        t.expect(r.flood.debris, '==', r.cap, level + ': debris alive after 300 were asked for');
        t.expect(r.errors.length, '==', 0, level + ': errors');
        await page.close();
        t.note(`${level}: health after each hit ${r.healths.map((h) => h.toFixed(1)).join(', ')}; stages ${r.stages.join(' ')}; destroyed after ${4 + r.more} hits; debris peak ${r.peak} of ${r.cap}`);
      }
    },
  },
];
