// Session D2-S3 (Streets): D2.4 from plan/08-roadmap.md, the six checks in plan/bible/world/tideline.md
// section 10 as far as this session built them, and one check per piece: map, streamer, collision
// hash, lanes and sidewalks, props and decor, the byte vertex format, the skyline, the barriers.
// G3 runs at three beach spots (west end, the day 1 block, east end) inside the check 'D2-S3.G3'.
import { TABLE } from '../../src/core/quality.js';

const SMALL = { viewport: { width: 480, height: 270 } };
const settle = (page, seconds = 30) => page.evaluate((s) => new Promise((resolve) => {
  const end = performance.now() + s * 1000, c = window.__game.modules.chunks;
  const tick = () => (c.pending === 0 || performance.now() > end ? resolve(c.pending) : requestAnimationFrame(tick));
  requestAnimationFrame(tick);
}), seconds);

export default [
  {
    id: 'D2.4', name: 'Streaming', quality: ['low', 'high'],
    async run(t) {
      // a small window, as the standing gates use: with no graphics card, drawing 960 x 540 runs at 9 frames a second
      const page = await t.open('&quality=' + t.quality, SMALL);
      for (const [x, z] of [[-1500, -100], [1500, -100]]) {
        const r = await page.evaluate(async ([px, pz]) => {
          const g = window.__game, T = g.test;
          T.teleport(px, pz, Math.PI / 2);
          await T.wait(0.5);
          return { chunks: T.stats().chunks, district: g.modules.map.districtAt(px, pz), state: g.state.world.district };
        }, [x, z]);
        t.expect(r.chunks, '>=', 9, `chunks loaded at (${x}, ${z})`);
        t.expect(r.district, '==', 'tideline', `districtAt (${x}, ${z})`);
      }
      const lib = await import('../check-lib.mjs');
      await page.evaluate(() => window.__game.modules.chunks.resetStats());
      const d = await lib.driveRoute(page, 'beach-60'), cal = await lib.calibrate(page);
      const st = await page.evaluate(() => window.__game.test.chunks());
      t.note(`streamer over the drive: ${st.built} chunks built, ${st.dropped} dropped, ${st.slices} frames did building work: p95 ${st.buildMsP95.toFixed(2)} ms, longest ${st.buildMsMax.toFixed(2)} ms, longest single piece ${st.maxStepMs.toFixed(2)} ms`);
      t.expect(st.built, '>=', 9, 'chunks built in slices during the drive');
      t.note(`with drawing (no graphics card here, so the drawing threads take the processor): slices p95 ${st.buildMsP95.toFixed(2)} ms`);
      t.expect(st.buildMsP95, '<=', 4 * cal.kHitch, 'p95 of the frames that did chunk building, with drawing (ms, times single-frame k)');
      // the same drive with no drawing: the player is moved along the beach and the streamer and the
      // simulation are run by hand, so the numbers are the game's own
      const dry = await page.evaluate(() => {
        const g = window.__game, T = g.test, c = g.modules.chunks, p = g.state.player, all = [];
        T.teleport(-1400, 40.5, Math.PI / 2); c.update(g.camera); c.resetStats();
        T.drive([{ x: 1500, z: 37 }], { seconds: 60 });
        let worst = 0;
        for (let i = 0; i < 3600; i++) {
          const t0 = performance.now(); g.loop.stepOnce(); worst = Math.max(worst, performance.now() - t0);
          c.update(g.camera); if (c.buildMs > 0.05) all.push(c.buildMs);
          if (i % 15 === 0) { const end = performance.now() + 4; while (performance.now() < end); }      // let the streamer's 250 ms timer run
        }
        all.sort((x, y) => x - y);
        const s = c.stats();
        return { step: worst, slices: all.length, p95: all[Math.floor(all.length * 0.95)] || 0, max: all[all.length - 1] || 0, piece: s.maxStepMs, at: s.maxStepAt, built: s.built, x: p.x };
      });
      t.note(`no drawing: ${dry.built} chunks built in ${dry.slices} slices, p95 ${dry.p95.toFixed(2)} ms, longest ${dry.max.toFixed(2)} ms, longest single piece ${dry.piece.toFixed(2)} ms (${dry.at}); longest simulation step ${dry.step.toFixed(2)} ms; car reached x ${Math.round(dry.x)}`);
      t.expect(dry.built, '>=', 9, 'chunks built during the drive with no drawing');
      t.expect(dry.p95, '<=', 4 * cal.k, 'G4: chunk building p95 over the frames that built, no drawing (ms, times k)');
      t.expect(dry.step, '<=', 12 * cal.k, 'G4: longest simulation step over the drive, no drawing (ms, times k)');
      t.note(`drive: ${Math.round(d.metres)} m in ${d.seconds.toFixed(0)} s, ${d.chunksCrossed} chunks crossed, chunkMs p95 ${d.chunkMsP95.toFixed(2)}, sim max ${d.simMax.toFixed(2)} ms, wall hits ${d.crashes}; k ${cal.k.toFixed(2)}, single-frame k ${cal.kHitch.toFixed(2)}`);
      t.expect(d.metres, '>=', 300, 'metres driven along Heron Walk Drive in 60 s');
      t.expect(d.chunksCrossed, '>=', 4, 'chunks crossed on the drive');
      t.expect(d.chunkMsP95, '<=', 4 * cal.k, 'G4: chunkMs p95 over the drive (ms, times k)');
      t.expect(d.simMax, '<=', 12 * cal.kHitch, 'G4: longest simulation frame over the drive (ms, times single-frame k)');
      t.expect(d.errors.length, '==', 0, 'console errors over the drive ' + JSON.stringify(d.errors.slice(0, 3)));
    },
  },
  {
    id: 'D2-S3.G3', name: 'Budgets at three beach spots', quality: ['low', 'high'],
    async run(t) {
      const page = await t.open('&quality=' + t.quality, SMALL), i = t.quality === 'low' ? 0 : 2;
      const cal = await (await import('../check-lib.mjs')).calibrate(page);
      for (const s of [{ name: 'west end', x: -1400, z: 40.5 }, { name: 'day 1 block', x: 0, z: 37 }, { name: 'east end', x: 1400, z: 40.5 }, { name: 'day 1 block at night', x: -24, z: 40.5, hour: 22 }]) {
        await page.evaluate((sp) => { const T = window.__game.test; T.setHour(sp.hour || 14); T.teleport(sp.x, sp.z, Math.PI / 2); }, s);
        await settle(page);
        const r = await page.evaluate(async () => { const T = window.__game.test; await T.wait(1.0); return { ...T.stats(), c: T.chunks() }; });
        t.note(`${s.name}: ${r.calls} draw calls, ${r.tris} triangles, simMs ${r.simMs.toFixed(2)}, ${r.c.lod0} LOD0 chunks (avg ${r.c.lod0TrisAvg}, max ${r.c.lod0TrisMax} triangles), ${r.c.groups} shell groups (${r.c.shellTris} triangles, ${r.c.shellTrisPerChunkMax} a chunk at most)`);
        t.expect(r.calls, '<=', TABLE.maxCalls[i], `${s.name}: draw calls`);
        t.expect(r.tris, '<=', TABLE.maxTris[i], `${s.name}: triangles`);
        t.expect(r.simMs, '<=', TABLE.maxSimMs[i] * cal.k, `${s.name}: simMs (times k ${cal.k.toFixed(2)})`);
        t.expect(r.c.lod0TrisMax, '<=', i === 0 ? 8400 * 1.5 : 20000, `${s.name}: triangles in the fullest LOD0 chunk`);
        t.expect(r.c.shellTrisPerChunkMax, '<=', 600, `${s.name}: shell triangles a chunk`);
      }
    },
  },
  {
    id: 'D2-S3.1', name: 'Map: zones, roads, lots, heights',
    async run(t) {
      const r = await t.eval(() => {
        const m = window.__game.modules.map, z = m.zone('tideline');
        const names = z.ns.map((l) => l.name), lots = m.lots.filter((l) => !l.hero && !l.reserved);
        const hero = { x0: -45, x1: 45, z0: -30, z1: 30 };
        const huts = m.lots.filter((l) => l.hero === 'lifeguard-hut');
        let inChunks = 0; for (let cx = 0; cx < 40; cx++) for (let cz = 0; cz < 30; cz++) inChunks += m.lotsInChunk(cx, cz).length;
        const seeds = [[-1262, -212], [2, 12], [250, -170], [604, 70], [-606, -122], [-500, -76], [272, 8], [1295, -60], [-1184, 72], [-1500, 66], [330, -196], [-170, 40], [-755, 14], [1210, -40], [-1490, 50], [4, 47], [540, 70], [-1190, 60], [1480, 70]];
        return {
          d: [m.districtAt(0, 0), m.districtAt(-1250, -220), m.districtAt(1550, 100), m.districtAt(0, -400), m.districtAt(5000, 0)],
          names: names.length, named: names.every((n) => /\S+ (Street|Avenue|Boulevard)$/.test(n)), unique: new Set(names).size,
          at: m.roadAt(132, -80) && m.roadAt(132, -80).name, heron: m.nearestRoad(0, 30).roadId, noRoad: m.roadAt(0, 0),
          overlapHero: lots.filter((l) => l.x0 < hero.x1 && l.x1 > hero.x0 && l.z0 < hero.z1 && l.z1 > hero.z0).length,
          lots: lots.length, inChunks, all: m.lots.length, tallest: Math.max(...lots.map((l) => l.h)), recipes: [...new Set(lots.map((l) => l.recipe))].sort().join(),
          huts: huts.length, hutX: huts.map((h) => Math.round((h.x0 + h.x1) / 2)).join(), hutColours: new Set(huts.map((h) => h.wall)).size,
          land: [m.isLand(0, 37), m.isLand(0, 120), m.isLand(-1500, -300)], depth: m.depthAt(0, 100), depthLand: m.depthAt(0, 0),
          h: [m.heightAt(0, 37), m.heightAt(0, 46), m.heightAt(0, 0), m.heightAt(-1000, -80), m.heightAt(-1012, -80), m.heightAt(0, 60)],
          surf: [m.surfaceAt(0, 37), m.surfaceAt(0, 60), m.surfaceAt(0, 120), m.surfaceAt(-1000, -80)].join(),
          hood: [m.neighbourhoodAt(-1200, 0), m.neighbourhoodAt(0, 0), m.neighbourhoodAt(1300, 0)].join(),
          roads: m.pieces.length, chunkRoads: m.roadsInChunk(20, 22).length, chunk: m.chunkOf(0, 0), seedsOnLand: seeds.filter(([x, z]) => m.isLand(x, z)).length, seeds: seeds.length,
          snapRoad: m.snap({ x: 10, z: 20 }, 'road'), snapWalk: m.snap({ x: 10, z: 38 }, 'sidewalk'), fails: m.snapFailures.length, garage: m.places('garage').length,
          sign: m.landmark('day1-block').h, lotSame: JSON.stringify(m.lotsInChunk(12, 21).map((l) => [l.x0, l.h, l.wall])).length,
        };
      });
      t.expect(r.d.join(), '==', 'tideline,tideline,tideline,,', 'districtAt (0, 0), (-1250, -220), (1550, 100); null north of the bounds and off the map');
      t.expect(r.names === 40 && r.named && r.unique === 40, '==', true, 'all 40 north-south lines have a name of their own');
      t.expect(r.at, '==', 'Wentletrap Street', 'the road name at (132, -80)');
      t.expect(r.heron, '==', 'heron-walk-drive', 'nearestRoad from the day 1 kerb');
      t.expect(r.noRoad, '==', null, 'no road under the middle of the day 1 block');
      t.expect(r.overlapHero, '==', 0, 'generated lots overlapping x -45 to 45, z -30 to 30');
      t.expect(r.lots, '>=', 900, 'kit lots in Tideline');
      t.expect(r.inChunks, '==', r.all, 'every lot is in exactly one chunk');
      t.expect(r.tallest, '<=', 40, 'tallest kit building (m)');
      t.expect(r.recipes, '==', 'T1,T2,T3,T4,T5,empty', 'recipes in use');
      t.expect(r.huts === 11 && r.hutColours === 11, '==', true, `11 lifeguard huts in 11 body colours (x ${r.hutX})`);
      t.expect(r.hutX, '==', [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((k) => 34 + 300 * k).join(), 'huts at x = 34 + 300k');
      t.expect(r.land.join(), '==', 'true,false,true', 'isLand: street, sea, back row');
      t.expect(r.depth > 0.5 && r.depthLand === 0, '==', true, 'depthAt: 20 m out to sea, and on land');
      t.expect(r.h.map((v) => +v.toFixed(2)).join(), '==', '0,0.14,0.14,0.14,0,0.02', 'heightAt: street, promenade, block, a West End sidewalk, Rosa Street, sand');
      t.expect(r.surf, '==', 'road,sand,water,sidewalk', 'surfaceAt');
      t.expect(r.hood, '==', 'west-end,the-strand,east-strand', 'neighbourhoodAt');
      t.expect(r.roads, '>=', 380, 'road pieces');
      t.expect(r.chunkRoads, '>=', 3, 'roadsInChunk at the origin chunk');
      t.expect(r.chunk.cx === 20 && r.chunk.cz === 22, '==', true, 'chunkOf (0, 0) is column 20, row 22');
      t.expect(r.seedsOnLand, '==', r.seeds, 'every find, ramp and postcard seed in the district file is on land');
      t.expect(r.snapRoad.z === -37 || r.snapRoad.z === 37, '==', true, 'snap to the road');
      t.expect(Math.abs(r.snapWalk.z - 45.5) < 0.01 && r.fails === 0, '==', true, 'snap to the sidewalk; no snap failures');
      t.expect(r.sign, 'between', [26.0, 26.4], 'top of the roof sign (m)');
    },
  },
  {
    id: 'D2-S3.2', name: 'Chunk streamer: rings, hysteresis, disposal, pooling, same city every time', quality: ['low', 'high'],
    async run(t) {
      const page = await t.page();
      await settle(page);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, c = g.modules.chunks, info = g.renderer.info.memory;
        const wait = () => new Promise((resolve) => { const end = performance.now() + 20000; const tick = () => (c.pending === 0 || performance.now() > end ? resolve() : requestAnimationFrame(tick)); requestAnimationFrame(tick); });
        const frames = (n) => new Promise((resolve) => { const s = () => (--n <= 0 ? resolve() : requestAnimationFrame(s)); requestAnimationFrame(s); });
        const sig = () => { let s = 0; g.scene.traverse((o) => { if (o.isMesh && !o.isInstancedMesh && o.geometry.attributes.position) s += o.geometry.attributes.position.count; }); return s; };
        const out = { r0: g.quality.get('lod0Radius'), r1: g.quality.get('lod1Radius') };
        // measured from a clean start both times: shells kept by hysteresis depend on where you came from
        const fresh = async () => { T.teleport(-24, 40.5, Math.PI / 2); c.reset(); c.ensure(-24, 40.5, 1); await frames(3); await wait(); await frames(3); };
        await fresh();
        out.home = { ...T.chunks(), geo: info.geometries, verts: sig(), colliders: g.modules.collide.count, props: g.modules.props.all.length };
        const pos = g.scene.children.find((o) => o.isMesh && !o.isInstancedMesh && o.geometry.attributes.normal && o.geometry.attributes.normal.array === null);
        const any = g.scene.children.find((o) => o.isMesh && !o.isInstancedMesh && o.geometry.attributes.color && o.geometry.attributes.color.normalized);
        out.freed = !!pos; out.bytes = !!any && any.geometry.attributes.normal.normalized;
        // hysteresis: step over a chunk edge and back; nothing may be dropped
        const d0 = c.stat.dropped; T.teleport(-1, 40.5, Math.PI / 2); await frames(20); T.teleport(1, 40.5, Math.PI / 2); await frames(20); T.teleport(-1, 40.5, Math.PI / 2); await frames(20);
        out.thrash = c.stat.dropped - d0;
        // a round trip: far away and back
        T.teleport(1400, 40.5, Math.PI / 2); await wait(); await frames(3);
        out.away = { ...T.chunks(), homeLoaded: c.isLoaded(20, 22) };
        T.teleport(-24, 40.5, Math.PI / 2); await wait(); await frames(3);
        out.backShells = T.chunks().groups;
        await fresh();
        out.back = { ...T.chunks(), geo: info.geometries, verts: sig(), colliders: g.modules.collide.count, props: g.modules.props.all.length };
        return out;
      });
      const n0 = (2 * r.r0 + 1) ** 2;
      t.note(`home: ${JSON.stringify(r.home)}`);
      t.expect(r.home.lod0, '==', n0, `LOD0 chunks round the spawn (radius ${r.r0})`);
      t.expect(r.home.groups, '>=', 2, 'LOD1 shell groups drawn');
      t.expect(r.home.pending, '==', 0, 'build queue empty once settled');
      t.expect(r.bytes, '==', true, 'chunk meshes carry normalised byte normals and colours');
      t.expect(r.freed, '==', true, 'vertex arrays are let go once uploaded');
      t.expect(r.thrash, '==', 0, 'chunks dropped while crossing a chunk edge three times');
      t.expect(r.away.homeLoaded, '==', false, 'the home chunk is dropped when the player is 1.4 km away');
      t.expect(r.back.dropped, '>=', n0, 'chunks dropped over the round trip');
      t.expect(r.back.geo, '==', r.home.geo, 'geometries alive after the round trip (same as before)');
      t.expect(r.back.verts, '==', r.home.verts, 'the same city comes back: vertex count of every mesh');
      t.expect(r.back.colliders, '==', r.home.colliders, 'colliders after the round trip');
      t.expect(r.back.props, '==', r.home.props, 'props after the round trip');
      t.expect(r.back.pooled, '>=', 1, 'builder sets waiting in the pool');
      t.expect(r.home.lod0TrisAvg, '<=', t.quality === 'low' ? 8400 : 14000, 'average triangles in a LOD0 chunk');
    },
  },
  {
    id: 'D2-S3.3', name: 'Collision: the spatial hash',
    async run(t) {
      const r = await t.eval(async () => {
        const g = window.__game, T = g.test, c = g.modules.collide, w = g.modules.world;
        T.teleport(-24, 40.5, Math.PI / 2); T.advance(0.1);
        const out = { total: c.count, near: w.colliders.length, cell: c.cell };
        const before = c.stats(); const list = []; for (let i = 0; i < 100; i++) c.circle(-24 + i * 0.1, 40.5, 2, 0, list); const after = c.stats();
        out.testedPerQuery = (after.tested - before.tested) / 100;
        // own shapes: a box and a turned box
        c.add('t', { x0: 5000, x1: 5010, z0: 0, z1: 4, h: 5 }); c.add('t', { cx: 5030, cz: 0, hw: 5, hd: 1, rot: Math.PI / 4, h: 5 });
        const hits = []; out.hitBox = c.circle(5005, 5, 1.5, 0, hits); out.missBox = c.circle(5005, 6, 1.5, 0, hits);
        out.hitTurned = c.circle(5033, -3, 0.5, 0, hits); out.missTurned = c.circle(5033, 3, 0.5, 0, hits);
        const body = { x: 5005, z: 4.5, r: 1, level: 0 }; const push = c.pushOutCircle(body); out.pushed = body.z; out.normal = push && push.nz;
        const ray = c.ray(4990, 2, 5020, 2, 0); out.rayX = ray && ray.x; out.rayMiss = c.ray(4990, 20, 5020, 20, 0);
        out.blocked = [c.blocked(5005, 2, 2, 0.5), c.blocked(5005, 9, 2, 0.5)];
        out.removed = c.removeOwner('t'); out.gone = c.circle(5005, 2, 1, 0, hits);
        // the car still stops at a wall
        const found = []; found.length = c.circle(-24, 30, 14, 0, found);
        const wall = found.filter((b) => b.h > 6 && b.z1 > 22 && b.z1 < 31 && b.x1 - b.x0 > 10).sort((a, b) => Math.abs(a.x0 + a.x1) - Math.abs(b.x0 + b.x1))[0];
        T.teleport((wall.x0 + wall.x1) / 2, 37, Math.PI, 0);
        T.input([{ t: 0, hold: ['gas'] }, { t: 4, hold: [] }]);
        const p = T.advance(4);
        out.wallZ = p.z; out.wall = wall.z1; out.kmh = p.kmh; out.crashes = T.count('vehicle:crash');
        return out;
      });
      t.note(`${r.total} static shapes in the hash; ${r.near} handed to the car; ${r.testedPerQuery.toFixed(1)} shapes looked at per query`);
      t.expect(r.cell, '==', 20, 'cell size (m)');
      t.expect(r.total, '>', 300, 'static shapes in the hash');
      t.expect(r.testedPerQuery, '<', 30, 'shapes tested per circle query (was every box in the city)');
      t.expect(r.near, '<', 60, 'boxes the car is handed each step');
      t.expect([r.hitBox, r.missBox, r.hitTurned, r.missTurned].join(), '==', '1,0,1,0', 'circle against a box and a turned box: hit, miss, hit, miss');
      t.expect(r.pushed, 'between', [4.99, 5.01], 'pushOutCircle moves the body to the face (z)');
      t.expect(r.normal, '==', 1, 'push normal');
      t.expect(r.rayX, 'between', [4999.9, 5000.1], 'ray hits the box where it should (x)');
      t.expect(r.rayMiss, '==', null, 'a ray past the box hits nothing');
      t.expect(r.blocked.join(), '==', 'true,false', 'blocked(): inside the box below its roof, and above it');
      t.expect(r.removed === 2 && r.gone === 0, '==', true, 'removeOwner takes the shapes out');
      t.expect(r.wallZ, 'between', [r.wall, 37], 'a building still stops the car (z)');
      t.expect(r.kmh, '<', 15, 'speed against the wall (km/h)');
      t.expect(r.crashes, '>=', 1, 'vehicle:crash fired');
    },
  },
  {
    id: 'D2-S3.4', name: 'Lanes and sidewalks from the road network',
    async run(t) {
      const r = await t.eval(() => {
        const { nav, map } = window.__game.modules;
        const east = nav.laneNear(0, 40, Math.PI / 2), west = nav.laneNear(0, 34, -Math.PI / 2);
        const coral = nav.lanes.filter((l) => l.roadId === 'coral-blvd' && l.of === 3), ave = nav.lanes.filter((l) => l.kind === 'avenue');
        const route = nav.route({ x: -1400, z: 40.5 }, { x: 1500, z: 37 });
        let len = 0; for (let i = 1; i < route.length; i++) len += Math.hypot(route[i].x - route[i - 1].x, route[i].z - route[i - 1].z);
        const round = nav.route({ x: -24, z: 40.5 }, { x: 52, z: -37 });
        const walk = nav.walkNear(0, 46), sig = nav.lanes.find((l) => l.signal);
        const onRoad = nav.lanes.every((l) => map.heightAt((l.ax + l.bx) / 2, (l.az + l.bz) / 2) === 0);
        const onWalk = nav.walks.filter((w) => !w.crossing).every((w) => map.heightAt((w.ax + w.bx) / 2, (w.az + w.bz) / 2) > 0.1 || map.zoneAt((w.ax + w.bx) / 2, (w.az + w.bz) / 2) === null);
        return {
          lanes: nav.lanes.length, eastZ: east.az, westZ: west.az, name: east.name, keys: Object.keys(east).join(),
          nextOk: nav.lanes.every((l) => l.next.length > 0 && l.next.every((id) => nav.lane(id))), noU: nav.lanes.every((l) => l.next.every((id) => nav.lane(id).to !== l.from)),
          coral: coral.length, coralSide: coral.every((l) => (l.heading > 1 ? l.ax < 52 : l.ax > 52) || true), ave: ave.length, lefts: ave.filter((l) => l.left || l.right).length,
          inChunk: nav.lanesInChunk(20, 22).length, routeLen: len, routeEnd: route[route.length - 1], roundLen: round.length,
          walks: nav.walks.length, walkZ: walk.az, walkNext: walk.next.length, crossings: nav.crossings(walk).length, walkNextOk: !!nav.walkNext(walk, () => 0),
          signals: new Set(nav.lanes.filter((l) => l.signal).map((l) => l.signal.id)).size, green: [nav.green(sig, 0), nav.green(sig, 15)].join(), onRoad, onWalk,
          closed: nav.lanes.filter((l) => l.roadId === 'whimbrel-street' && l.az < -200 && l.bz < -200 && l.az > -275 && l.bz > -275).length,
        };
      });
      t.note(`${r.lanes} lanes, ${r.walks} walking edges, ${r.signals} signalled junctions`);
      t.expect(r.lanes, '>', 700, 'lanes');
      t.expect(r.eastZ === 40.5 && r.westZ === 33.5, '==', true, 'traffic keeps right on Heron Walk Drive, 3.5 m off the centre line');
      t.expect(r.name, '==', 'Heron Walk Drive', 'the lane knows its street');
      for (const k of ['id', 'ax', 'az', 'bx', 'bz', 'len', 'heading', 'speed', 'level', 'kind', 'next', 'signal', 'left', 'right']) t.expect(r.keys.split(',').includes(k), '==', true, `lane.${k}`);
      t.expect(r.nextOk && r.noU, '==', true, 'every lane leads somewhere, and never straight back');
      t.expect(r.coral, '>=', 18, 'three lanes each way on the wide part of Coral Boulevard');
      t.expect(r.lefts, '==', r.ave, 'avenue lanes know their neighbour');
      t.expect(r.inChunk, '>', 4, 'lanesInChunk at the origin');
      t.expect(r.routeLen, 'between', [2800, 3100], 'route along the beach, west to east (m)');
      t.expect(r.roundLen, '>=', 3, 'route round the day 1 corner has points');
      t.expect(r.walks, '>', 1000, 'walking edges');
      t.expect(r.walkZ, 'between', [45.4, 45.6], 'the promenade is a walking edge (z)');
      t.expect(r.walkNext > 0 && r.crossings > 0 && r.walkNextOk, '==', true, 'a walking edge leads on, and has crossings');
      t.expect(r.signals, '>=', 9, 'junctions with lights');
      t.expect(r.green, '==', 'true,false', 'a light changes after 15 s');
      t.expect(r.onRoad, '==', true, 'every lane runs on the road');
      t.expect(r.onWalk, '==', true, 'every sidewalk edge runs on a sidewalk');
      t.expect(r.closed, '==', 0, 'no lanes through Pelican Rest');
    },
  },
  {
    id: 'D2-S3.5', name: 'Props, decor, skyline, barriers', quality: ['low', 'high'],
    async run(t) {
      const page = await t.page();
      await settle(page);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, M = g.modules, c = M.chunks;
        const wait = () => new Promise((resolve) => { const end = performance.now() + 20000; const tick = () => (c.pending === 0 || performance.now() > end ? resolve() : requestAnimationFrame(tick)); requestAnimationFrame(tick); });
        const frames = (n) => new Promise((resolve) => { const s = () => (--n <= 0 ? resolve() : requestAnimationFrame(s)); requestAnimationFrame(s); });
        T.teleport(-24, 40.5, Math.PI / 2); await wait(); await frames(3);
        const out = { kinds: Object.fromEntries(Object.entries(M.props.kinds).map(([k, v]) => [k, v.list.length])), decor: Object.fromEntries(Object.entries(c.decor.shapes).map(([k, v]) => [k, v.mesh.count])) };
        out.instanced = 0; g.scene.traverse((o) => { if (o.isInstancedMesh && o.visible && o.count > 0) out.instanced++; });
        out.skyline = { tris: c.skyline.triangles, towers: c.skyline.towers, tall: c.skyline.tall };
        // looking out to sea, the street palms behind the camera are not drawn
        T.teleport(-24, 40.5, 0); await frames(4); out.palmsSea = c.decor.count;
        T.teleport(-24, 40.5, Math.PI); await frames(4); out.palmsCity = c.decor.count;
        // the west end of Heron Walk Drive: the barrier stops the car, and its side sections fall
        T.teleport(-1560, 40.5, -Math.PI / 2); await wait(); await frames(3);
        out.barriers = M.props.count('barrier');
        T.input([{ t: 0, hold: ['gas'] }, { t: 6, hold: [] }]); const p = T.advance(6);
        out.x = p.x; out.bound = M.map.bounds.x0;
        T.teleport(-1575, 34.6, -Math.PI / 2, 12); T.advance(1.5); out.down = M.props.count('barrier', 'down');
        T.reset();
        // a lamp post near the spawn goes down, and its light with it
        T.teleport(0, 25, 0, 60 / 3.6); await wait();
        T.input([{ t: 0, hold: ['gas'] }, { t: 2, hold: [] }]); T.advance(2);
        out.lampsDown = M.props.count('lamp', 'down'); T.reset(); out.lampsDownAfter = M.props.count('lamp', 'down');
        return out;
      });
      t.note(`props ${JSON.stringify(r.kinds)}, decor in view ${JSON.stringify(r.decor)}, skyline ${JSON.stringify(r.skyline)}`);
      t.expect(r.kinds.lamp + r.kinds.lampLong, '>=', 30, 'lamp posts alive round the spawn');
      t.expect(r.decor.palm0 + r.decor.palm1 + r.decor.palm2 + r.decor.palm3 + r.decor.palmFar, '>=', 20, 'palms drawn');
      t.expect(r.decor.umbrella, '>=', 8, 'umbrellas drawn');
      t.expect(r.decor.bench, '>=', 2, 'benches drawn');
      t.expect(r.instanced, '<=', 16, 'instanced draw calls for all props and decor');
      t.expect(r.palmsSea, '>', 0, 'decor drawn looking out to sea');
      t.expect(r.palmsCity, '>', 0, 'decor drawn looking at the city');
      t.expect(r.skyline.tris, '<=', 20000, 'skyline triangles');
      t.expect(r.skyline.towers, '>=', 100, 'towers on the skyline');
      t.expect(r.barriers, '>=', 4, 'barrier sections standing at the west end');
      t.expect(r.x, '>=', r.bound, 'the car cannot leave the map at the west end (x)');
      t.expect(r.x, '<', -1570, 'and it got as far as the barrier');
      t.expect(r.down, '>=', 1, 'barrier sections knocked over');
      t.expect(r.lampsDown, '>=', 1, 'the lamp at (0, 29) goes down');
      t.expect(r.lampsDownAfter, '==', 0, 'reset stands it back up');
    },
  },
];
