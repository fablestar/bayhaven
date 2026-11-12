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
  {
    id: 'D5-S3.1', name: 'Panels and the blast: the hit end comes loose, the hood falls off, and the explosion throws the hood, hurts a car 4 m away and puts a person 2 m away down',
    async run(t) {
      const page = await t.open(QUIET + '&quality=high', SMALL);
      await settle(page);
      await page.evaluate(WALL);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test;
        g.fell = []; g.events.on('panel:fell', (e) => g.fell.push(e.name));
        g.downs = []; g.events.on('ped:down', (e) => g.downs.push(e));
        const fresh = T.damage().panels;
        g.ram(100); g.ram(100);
        const two = T.damage();
        g.ram(100); g.ram(100);
        T.advance(1.5);
        const four = T.damage(), fellAt4 = g.fell.slice();
        // park next to a standing car and a bystander, then let the fuse run out
        T.teleport(T.player().x, T.player().z + 30, 0, 0);
        const p = T.player(), other = T.placeVehicle('tarpon', p.x + 4, p.z, 0), who = T.peds.spawn('tourist', p.x - 2.6, p.z, 0), far = T.peds.spawn('office', p.x - 5.2, p.z + 1, 0);
        T.advance(0.2);
        const before = T.damage(other.id).health;
        T.damageSet(15); const fuse = T.damage().fuse;
        T.advance(7); const at7 = T.damage().dead; const debris0 = T.fx().debris;
        T.advance(1.2);
        const dead = T.damage(), boom = T.fx();
        T.advance(4);
        return { fresh, two, four, fellAt4, fell: g.fell, fuse, at7, dead, debris0, boom, other: T.damage(other.id), before, downs: g.downs, who: T.peds.get(who.id), far: T.peds.get(far.id), kmh: T.player().kmh,
          input: (T.input([{ t: 0, hold: ['gas'] }, { t: 2, hold: [] }]), T.advance(2), T.player().kmh), repaired: (T.reset(), T.advance(0.2), T.damage()), errors: T.errors() };
      });
      t.expect(Object.keys(r.fresh).length, '==', 6, 'panels on the Heron (hood, boot, two doors, two bumpers)');
      t.expect(r.two.health, 'in', [60, 66], 'health after two hits (not yet dented)');
      t.expect(r.four.panels.hood.state, '>=', 2, 'hood after four front hits (2 loose, 3 gone)');
      t.expect(r.four.panels.bumperF.state, '==', 3, 'front bumper after four (3 gone: under 30 health)');
      t.expect(r.four.panels.doorL.state, '==', 1, 'a door nothing hit (1 dented)');
      t.expect(r.fellAt4.includes('bumperF'), '==', true, 'panel:fell for the front bumper');
      t.expect(r.fuse, 'in', [7.9, 8], 'seconds on the fuse at 15 health');
      t.expect(r.at7, '==', false, 'blown up after 7 s');
      t.expect(r.dead.dead, '==', true, 'blown up after 8.2 s');
      t.expect(r.boom.debris - r.debris0, '>=', 5, 'debris boxes from the blast (the hood and more)');
      t.expect(r.dead.panels.hood.state, '==', 3, 'the hood is gone');
      t.expect(r.before - r.other.health, 'in', [10, 30], 'health the car 4 m away lost (60 x (1 - d / 6))');
      t.expect(r.downs.length, '==', 1, 'ped:down events (the person 2.6 m away)');
      t.expect(r.who.state, '==', 'down', 'the person 2.6 m away');
      t.expect(['fall', 'dazed', 'getup', 'walk', 'flee'].includes(r.far.state), '==', true, 'the person 5.3 m away is thrown but not down (' + r.far.state + ')');
      t.expect(r.input, '<', 3, 'km/h a destroyed car makes with the gas held');
      t.expect(r.repaired.health, '==', 100, 'health after a reset at the spawn');
      t.expect(r.repaired.panels.hood.state, '==', 0, 'the hood is back');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`panels after four hits: ${Object.entries(r.four.panels).map(([k, v]) => k + ' ' + v.state).join(', ')}; fell: ${r.fell.join(', ')}; the car 4 m off lost ${(r.before - r.other.health).toFixed(1)}; far person ${r.far.state}`);
    },
  },
  {
    id: 'D5-S3.2', name: 'A traffic driver whose car catches fire brakes, bails and runs; the car blows up empty and is left as a dark wreck',
    async run(t) {
      const page = await t.open('&peds=0&quality=high&hour=12', SMALL);
      await settle(page, 1500);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test;
        g.bailed = []; g.events.on('driver:bailed', (e) => g.bailed.push(e)); g.gone = []; g.events.on('vehicle:destroyed', (e) => g.gone.push(e));
        T.advance(3);
        const p = T.player(), car = T.traffic.list().filter((c) => c.kind === 'traffic' && c.v > 3).sort((a, b) => Math.hypot(a.x - p.x, a.z - p.z) - Math.hypot(b.x - p.x, b.z - p.z))[0];
        if (!car) return { car: null };
        T.teleport(car.x, car.z + 30, 0, 0);
        const paint0 = T.damage(car.id).paint;
        T.damageSet(15, car.id);
        let slowest = 99;
        for (let i = 0; i < 50; i++) { T.advance(0.1); const c = T.traffic.list().find((c) => c.id === car.id); if (c) slowest = Math.min(slowest, c.v); }
        const mid = T.damage(car.id), midCar = { v: slowest };
        T.advance(4);
        const end = T.damage(car.id), endCar = T.traffic.list().find((c) => c.id === car.id);
        return { car, paint0, mid, midCar, end, endCar, bailed: g.bailed, gone: g.gone, peds: T.peds.list(60).length, errors: T.errors() };
      });
      t.expect(!!r.car, '==', true, 'a moving traffic car to set alight');
      if (!r.car) return;
      t.expect(r.mid.burning, '==', true, 'burning at 15 health');
      t.expect(r.midCar.v, '<', 1, 'slowest m/s in the 5 s after it caught fire: the driver stopped');
      t.expect(r.bailed.length, '==', 1, 'driver:bailed events');
      t.expect(r.peds, '>=', 1, 'people on the street (the driver)');
      t.expect(r.gone.length, '==', 1, 'vehicle:destroyed events');
      t.expect(r.gone[0] ? r.gone[0].driverDied : true, '==', false, 'the driver was inside');
      t.expect(r.endCar.kind, '==', 'wreck', 'the car afterwards');
      t.expect(r.end.paint, '==', 0x2b2838, 'wreck paint');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`a ${r.car.model} at ${r.car.v.toFixed(1)} m/s: stopped, driver out at (${r.bailed[0] ? r.bailed[0].x.toFixed(0) + ', ' + r.bailed[0].z.toFixed(0) : '?'}), blown up, kind ${r.endCar.kind}`);
    },
  },
  {
    id: 'D5-S3.3', name: 'Breakable props: lamp posts bend with speed, a hydrant leaves a geyser that lifts the car, a fence splinters, tables scatter, signs fall, a palm drops coconuts',
    async run(t) {
      const page = await t.open(QUIET + '&quality=high', SMALL);
      await settle(page, 1200);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, C = g.modules.collide;
        g.broken = []; g.events.on('prop:broken', (e) => g.broken.push(e.kind));
        const placed = T.breakables();
        const home = T.player();
        // a clear run: the road in front of the spawn, heading as spawned
        const run = (kind, kmh, ahead = 9) => { T.reset(); T.advance(0.1); const p = T.propAhead(kind, ahead); T.teleport(T.player().x, T.player().z, T.player().h, kmh / 3.6); T.advance(1.5); return { p, now: T.prop(p.id), kmh: T.player().kmh }; };
        const slow = run('lamp', 40), fast = run('lamp', 110);
        const fence0 = T.fx().debris, fence = run('fence', 60), fenceBits = T.fx().debris - fence0;
        const table = run('table', 50), chair = run('chair', 50), sign = run('sign', 50);
        // the hydrant: break it, then stand the car on the jet
        const hyd = run('hydrant', 50);
        const gy = T.breakables().geysers[0];
        let lift = 0, mist = 0;
        if (gy) { T.teleport(gy.x, gy.z, 0, 0); for (let i = 0; i < 90; i++) { T.advance(1 / 60); lift = Math.max(lift, T.ride().lift); } mist = T.fx().smoke; }
        T.advance(26); const after = T.breakables().geysers.length, liftAfter = T.ride().lift;
        // a palm: find a trunk (a 0.6 m square in the collision hash) south of the spawn and drive into it
        let palm = null;
        for (let x = home.x - 60; x <= home.x + 60 && !palm; x += 0.5) { const h = C.ray(x, home.z, x, home.z + 40); if (h && h.shape.x1 - h.shape.x0 < 0.7 && h.shape.z1 - h.shape.z0 < 0.7 && h.shape.h <= 1.2 && h.z - home.z > 5) palm = { x: (h.shape.x0 + h.shape.x1) / 2, z: h.shape.z0 }; }
        let nuts = 0, nutBoxes = 0;
        if (palm) { const d0 = T.fx().debris; T.teleport(palm.x, palm.z - 4, 0, 50 / 3.6); T.advance(0.6); nuts = T.breakables().coconuts; nutBoxes = T.fx().debris - d0; }
        return { placed, slow, fast, fence, fenceBits, table, chair, sign, hyd, gy, lift, mist, after, liftAfter, palm, nuts, nutBoxes, broken: g.broken, errors: T.errors() };
      });
      t.expect(r.placed.kinds.hydrant, '>=', 3, 'hydrants standing round the spawn');
      t.expect(r.placed.kinds.sign + r.placed.kinds.table + r.placed.kinds.fence, '>=', 9, 'signs, tables and fence sections round the spawn');
      t.expect(r.slow.now.rest, 'in', [0.45, 1.0], 'a lamp post hit at 40 km/h leans (rad)');
      t.expect(r.fast.now.rest, '>', r.slow.now.rest + 0.3, 'a lamp post hit at 110 km/h leans further');
      t.expect(r.fence.now.hidden, '==', true, 'the fence section is gone');
      t.expect(r.fenceBits, '>=', 6, 'splinters in the debris pool');
      t.expect(Math.hypot(r.table.now.x - r.table.p.x, r.table.now.z - r.table.p.z), '>', 2, 'metres the table was thrown');
      t.expect(Math.hypot(r.chair.now.x - r.chair.p.x, r.chair.now.z - r.chair.p.z), '>', 2, 'metres the chair was thrown');
      t.expect(r.sign.now.tilt, '>', 1, 'the sign is down (rad)');
      t.expect(!!r.gy, '==', true, 'a geyser where the hydrant stood');
      t.expect(r.lift, '>', 0.5, 'metres the geyser lifted the car');
      t.expect(r.mist, '>', 10, 'geyser puffs in the air');
      t.expect(r.after, '==', 0, 'geysers left after 25 s');
      t.expect(r.liftAfter, '==', 0, 'the car is back on the road');
      t.expect(!!r.palm, '==', true, 'a palm to hit');
      t.expect(r.nuts, '==', 2, 'coconuts dropped');
      t.expect(r.nutBoxes, '>=', 2, 'coconut boxes in the debris pool');
      for (const k of ['lamp', 'fence', 'table', 'chair', 'sign', 'hydrant', 'palm']) t.expect(r.broken.includes(k), '==', true, 'prop:broken for ' + k);
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`placed round the spawn: ${JSON.stringify(r.placed.kinds)}; lamp lean ${r.slow.now.rest.toFixed(2)} rad at 40 km/h, ${r.fast.now.rest.toFixed(2)} at 110; geyser lift ${r.lift.toFixed(2)} m; ${r.fenceBits} splinters`);
    },
  },
  {
    id: 'D5-S3.4', name: 'People: a 40 km/h hit is a tumble and they walk again within 8 s; a 65 km/h hit and they stay down, and an ambulance comes inside 60 s and takes them',
    async run(t) {
      const page = await t.open(QUIET + '&quality=high', SMALL);
      await settle(page);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test;
        g.seen = { hit: [], down: [], gotup: [], amb: [], collected: [] };
        g.events.on('ped:hit', (e) => g.seen.hit.push(e.kmh)); g.events.on('ped:down', (e) => g.seen.down.push(e)); g.events.on('ped:gotup', (e) => g.seen.gotup.push(e));
        g.events.on('traffic:ambulance', (e) => g.seen.amb.push(e.step + (e.why ? ':' + e.why + ':' + e.kind + ':' + e.health : ''))); g.events.on('ped:collected', (e) => g.seen.collected.push(e));
        const ahead = (d) => { const p = T.player(); return { x: p.x + Math.sin(p.h) * d, z: p.z + Math.cos(p.h) * d }; };
        let a = ahead(8); const light = T.peds.spawn('tourist', a.x, a.z, T.player().h);
        T.teleport(T.player().x, T.player().z, T.player().h, 40 / 3.6); T.advance(1); T.input([{ t: 0, hold: ['brake'] }, { t: 3, hold: [] }]);
        let ropeSeen = T.peds.get(light.id).state;
        T.advance(7.5);
        const lightEnd = T.peds.get(light.id), downsAfterLight = g.seen.down.length;
        T.reset(); T.advance(0.2);
        a = ahead(8); const hard = T.peds.spawn('office', a.x, a.z, T.player().h);
        T.teleport(T.player().x, T.player().z, T.player().h, 65 / 3.6); T.advance(1); T.input([{ t: 0, hold: ['brake'] }, { t: 3, hold: [] }]);
        T.advance(5);
        const hardMid = T.peds.get(hard.id);
        let secs = 6, arrived = null, minD = 1e9;
        while (secs < 60 && !arrived) { T.advance(0.5); secs += 0.5; const am = T.ambulance(), v = am.list[0], who = T.peds.get(hard.id); if (v && who) minD = Math.min(minD, Math.hypot(v.x - who.x, v.z - who.z)); if (am.arrived) arrived = { secs, d: minD, paint: v ? v.paint : 0 }; }
        const still = T.peds.get(hard.id), ambAt = T.ambulance();
        T.advance(8);
        const gone = T.peds.get(hard.id), amb = T.ambulance();
        T.advance(40);
        return { ambAt, ropeSeen, lightEnd, downsAfterLight, hardMid, arrived, still, gone, amb, ambEnd: T.ambulance(), seen: g.seen, pedsDown: g.state.peds.down, sound: T.mayhemSound(), errors: T.errors() };
      });
      t.expect(r.seen.hit.length, '>=', 2, 'ped:hit events');
      t.expect(r.ropeSeen, '==', 'fall', 'state a second after the light hit (the rope)');
      t.expect(['walk', 'hang', 'film', 'flee'].includes(r.lightEnd.state), '==', true, 'on their feet 8.5 s after a 40 km/h hit (' + r.lightEnd.state + ')');
      t.expect(r.downsAfterLight, '==', 0, 'ped:down after the light hit');
      t.expect(r.seen.down.length, '==', 1, 'ped:down after the 65 km/h hit');
      t.expect(r.hardMid.state, '==', 'down', 'state 6 s after the hard hit');
      t.note('ambulance at 60 s: ' + JSON.stringify(r.ambAt) + ' steps ' + r.seen.amb.join(' '));
      t.expect(!!r.arrived, '==', true, 'an ambulance arrived inside 60 s');
      if (r.arrived) { t.expect(r.arrived.d, '<=', 20, 'metres from the ambulance to the person'); t.expect(r.arrived.paint, '==', 0xfdf6ea, 'ambulance paint'); }
      t.expect(r.still && r.still.state, '==', 'down', 'still down when it arrives');
      t.expect(r.gone, '==', null, 'the person is gone 8 s after it arrives');
      t.expect(r.amb.collected, '==', 1, 'people collected');
      t.expect(r.ambEnd.list.length, '==', 0, 'ambulances left on the map 40 s later');
      t.expect(r.sound.thud, '>=', 2, 'thuds asked for');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`hits at ${r.seen.hit.map((k) => k.toFixed(0)).join(' and ')} km/h; ambulance on the scene ${r.arrived ? r.arrived.secs.toFixed(1) : '?'} s after the hit, ${r.arrived ? r.arrived.d.toFixed(1) : '?'} m from the person; steps ${r.seen.amb.join(' ')}`);
    },
  },
  {
    id: 'D5-S3.5', name: 'Sounds and cost: glass, the explosion, the geyser, splinters and clatter are played; effects stay at four draw calls and the frame inside the low budget mid-explosion',
    async run(t) {
      const page = await t.open(QUIET + '&quality=low', SMALL);
      await settle(page);
      await page.keyboard.press('KeyW');
      await settle(page, 300);
      await page.evaluate(() => {
        const g = window.__game, T = g.test;
        T.damageSet(55); T.damageSet(30);
        const f = T.propAhead('fence', 6), h = T.propAhead('hydrant', 12), s = T.propAhead('sign', 16);
        T.teleport(T.player().x, T.player().z, T.player().h, 14); T.advance(1.6);
        g.modules.damage.explode();
      });
      await settle(page, 700);
      const r = await page.evaluate(() => { const g = window.__game, T = g.test; return { sound: T.mayhemSound(), audio: T.audio().running, fx: T.fx(), stats: T.stats(), dmg: T.damage(), tris: g.modules.damage.panels.list.length * 12, errors: T.errors() }; });
      for (const k of ['glass', 'explosion', 'hydrant', 'splinter', 'clatter']) t.expect(r.sound[k], '>=', 1, k + ' sounds asked for');
      if (r.audio) { t.expect(r.sound.played, '>=', 5, 'sounds played through the mixer'); t.expect(r.sound.loop, '>', 0, 'the geyser loop gain'); } else t.note('the audio context did not start in this browser: sounds counted, not played');
      t.expect(r.fx.calls, '==', 4, 'draw calls for every effect');
      t.expect(r.fx.debris, '<=', TABLE.debrisCap[0], 'debris alive on low');
      t.expect(r.fx.smoke, '<=', 120, 'smoke family alive on low');
      t.expect(r.stats.calls, '<=', TABLE.maxCalls[0], 'draw calls mid-explosion on low');
      t.expect(r.stats.tris, '<=', TABLE.maxTris[0], 'triangles mid-explosion on low');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`low, a second after the blast: ${r.stats.calls} draw calls, ${r.stats.tris} triangles, sim ${r.stats.simMs.toFixed(2)} ms; smoke ${r.fx.smoke}, sparks ${r.fx.sparks}, debris ${r.fx.debris}; panels ${r.tris} triangles; sounds ${JSON.stringify(r.sound)}`);
    },
  },
];
