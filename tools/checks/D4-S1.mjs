// Session D4-S1 (Downtown): D4.1 (the Meridian part), D4.2 and D4.3 from plan/08-roadmap.md, the
// six checks in plan/bible/world/meridian.md section 10 as far as this session built, and one
// check per item on the session's list.
import { calibrate } from '../check-lib.mjs';
import { TABLE } from '../../src/core/quality.js';

const QUIET = '&traffic=0&peds=0';
const SMALL = { viewport: { width: 480, height: 270 } };     // software drawing is slow; counts do not depend on the size

export default [
  {
    id: 'D4.1', name: 'Districts (Meridian; the other three belong to session D4-S3)',
    async run(t) {
      const page = await t.open('&quality=low' + QUIET, SMALL);
      const r = await page.evaluate(() => { const m = window.__game.modules.map; return [[52, -900], [-200, -560], [0, -330], [790, -1430]].map(([x, z]) => m.districtAt(x, z)); });
      r.forEach((id, i) => t.expect(id, '==', 'meridian', `districtAt, point ${i + 1}`));
      const drove = await page.evaluate(async () => { const T = window.__game.test; T.teleport(59.4, -300, Math.PI); await T.wait(0.5); return window.__game.state.world.district; });
      t.expect(drove, '==', 'tideline', 'the district just south of the seam');
    },
  },
  {
    id: 'D4.2', name: 'Spire',
    async run(t) {
      const page = await t.open('&quality=low' + QUIET, SMALL);
      const r = await page.evaluate(() => { const g = window.__game, lm = g.modules.map.landmark('spire'), c = g.test.city(); return { lm, c, lot: g.modules.map.lots.find((l) => l.hero === 'spire').h }; });
      t.expect(!!r.lm && r.lm.x === 52 && r.lm.z === -900, '==', true, 'the landmark spire is at (52, -900)');
      t.expect(r.lm.h, '>=', 250, 'its height (m)');
      t.expect(r.c.landmarks.includes('spire'), '==', true, 'it is part of the skyline mesh');
      t.expect(r.c.top, '==', 260, 'the tallest thing in the skyline (m)');
      t.expect(r.c.beacon, '==', true, 'the light on top');
      t.expect(r.c.triangles, '<=', 20000, 'skyline triangles');
      t.expect(r.c.towers, '>=', 250, 'towers over 30 m in the skyline');
    },
  },
  {
    id: 'D4.3', name: 'Budgets at (52, -900)', quality: ['low', 'high'],
    async run(t) {
      const page = await t.open('&quality=' + t.quality + '&seed=1', SMALL), i = ['low', 'medium', 'high'].indexOf(t.quality), k = (await calibrate(page)).k;
      for (const [x, z, h, name] of [[52, -900, Math.PI, 'the Spire'], [59.4, -700, Math.PI, 'the boulevard'], [59.4, -830, 0, 'Spire Circle, looking back to the beach']]) {
        const s = await page.evaluate(async ([a, b, c]) => { const T = window.__game.test; T.teleport(a, b, c); await T.wait(2.5); return { ...T.stats(), ch: T.chunks() }; }, [x, z, h]);
        t.expect(s.calls, '<=', TABLE.maxCalls[i], `${name}: draw calls`);
        t.expect(s.tris, '<=', TABLE.maxTris[i], `${name}: triangles`);
        t.expect(s.simMs, '<=', TABLE.maxSimMs[i] * k, `${name}: simMs (k ${k.toFixed(2)})`);
        t.expect(s.ch.lod0TrisMax, '<=', t.quality === 'low' ? 8400 : 20000, `${name}: the heaviest full chunk (triangles)`);
        t.expect(s.ch.shellTrisPerChunkMax, '<=', 600, `${name}: the heaviest far shell, per chunk`);
      }
    },
  },
  {
    id: 'D4-S1.1', name: 'The grid, the boulevard and the five recipes (bible checks 2 to 6)',
    async run(t) {
      const page = await t.open('&quality=low' + QUIET, SMALL);
      const r = await page.evaluate(() => {
        const m = window.__game.modules.map, L = m.lots.filter((l) => l.zone === 'meridian'), kit = L.filter((l) => l.tiers);
        const by = {}; for (const l of kit) by[l.recipe] = (by[l.recipe] || 0) + 1;
        const coral = kit.filter((l) => l.wall === 0xff8f7a);
        const lines = m.zone('meridian').roads.lines;
        return { recipes: by, tallest: Math.max(...kit.map((l) => l.h)), lowest: Math.min(...kit.map((l) => l.h)),
          tiersTop: Math.max(...kit.map((l) => Math.max(...l.tiers.map((q) => q.y1)))),
          blvd: L.filter((l) => l.x0 < 67 && l.x1 > 37 && l.z1 > -807 && l.z0 < -320).length,
          coral: coral.length, coralAt: coral.length ? coral[0].x0 < 96 && coral[0].x1 > 96 && coral[0].z0 < -636 && coral[0].z1 > -636 : false, coralH: coral.length ? coral[0].h : 0,
          ex150: kit.filter((l) => l.hood === 'the-exchange' && l.h >= 150).length, radioMax: Math.max(...kit.filter((l) => l.hood === 'radio-row').map((l) => l.h)),
          radio110: kit.filter((l) => l.hood === 'radio-row' && l.h > 100).length,
          names: [m.nearestRoad(132, -700).name, m.nearestRoad(52, -1100).name, m.nearestRoad(52, -600).name, m.nearestRoad(52, -600).width, m.nearestRoad(-372, -700).kind],
          trees: lines.filter((l) => l.axis === 'ns' && /Street$/.test(l.name)).length, avenues: lines.filter((l) => l.kind === 'avenue').length,
          signals: [...m.nodes.values()].filter((n) => n.signal && n.z < -320).length, seam: !!m.nodes.get('52,-320'), stubs: m.pieces.filter((p) => p.zone === 'tideline' && p.stub && Math.abs(p.ax) < 780 && p.az === -320).length,
          hoods: [m.neighbourhoodAt(96, -636), m.neighbourhoodAt(-500, -800), m.neighbourhoodAt(0, -400), m.neighbourhoodAt(0, -1300)], kerb: [m.heightAt(-212, -560), m.heightAt(52, -900), m.heightAt(59, -600)] };
      });
      for (const id of ['M1', 'M2', 'M3', 'M4', 'M5']) t.expect(r.recipes[id] || 0, '>=', 8, `towers built from recipe ${id}`);
      t.expect(r.tallest, '<=', 220, 'the tallest kit tower (m)'); t.expect(r.tiersTop, '<=', 220, 'the highest tier of any kit tower (m)');
      t.expect(r.tallest, '>=', 200, 'and it is a real tower (m)');
      t.expect(r.blvd, '==', 0, 'lots across Coral Boulevard between the beach and the Spire');
      t.expect(r.coral === 1 && r.coralAt && r.coralH === 184, '==', true, 'exactly one coral tower, 184 m, on the lot at (96, -636)');
      t.expect(r.ex150, '>=', 12, 'Exchange towers of 150 m or more');
      t.expect(r.radioMax, '<=', 110, 'the tallest tower in Radio Row (m)'); t.expect(r.radio110, '==', 2, 'Radio Row towers that reach past 100 m');
      t.expect(r.names[0], '==', 'Poinciana Street', 'the road at (132, -700)'); t.expect(r.names[1], '==', 'Kapok Street', 'the road at (52, -1100)');
      t.expect(r.names[2] === 'Coral Boulevard' && r.names[3] === 30, '==', true, 'Coral Boulevard is 30 m wide at (52, -600)');
      t.expect(r.names[4], '==', 'avenue', 'Egret Avenue is an avenue');
      t.expect(r.trees, '>=', 15, 'tree streets with a name'); t.expect(r.avenues, '==', 8, 'avenues (every fourth line each way)');
      t.expect(r.signals, '==', 18, 'crossings with lights (four avenues by four avenues, and the boulevard twice)'); t.expect(r.seam && r.stubs === 0, '==', true, 'beachfront streets run on into downtown with no barrier');
      t.expect(r.hoods.join(), '==', 'the-exchange,radio-row,bayfront,uptown', 'neighbourhoods');
      t.expect(r.kerb[0] > 0.1 && r.kerb[1] > 0.1 && r.kerb[2] === 0, '==', true, 'plazas stand at kerb height, the boulevard at road height');
    },
  },
  {
    id: 'D4-S1.2', name: 'Window walls light floor by floor at dusk',
    async run(t) {
      const page = await t.open('&quality=low' + QUIET, SMALL);
      const at = async (hour) => page.evaluate(async (h) => { const T = window.__game.test; T.teleport(59.4, -700, Math.PI); T.setHour(h); await T.wait(0.6); return T.city(); }, hour);
      const day = await at(14), early = await at(18.7), late = await at(19.3), night = await at(22.5);
      t.expect(day.on, '==', 0, 'lights at 14:00');
      t.expect(early.litTo, 'between', [15, 70], 'lit floors reach this high at 18:42 (m)');
      t.expect(late.litTo, '>', early.litTo + 40, 'and higher at 19:18 (m)');
      t.expect(night.litTo, '==', 260, 'every floor to the top of the Spire at night (m)');
      const tex = await page.evaluate(() => {
        const g = window.__game; let grid = null, meshes = 0, tris = 0;
        g.scene.traverse((o) => { if (o.isMesh && o.material && o.material.setOn) { meshes++; tris += o.geometry.attributes.position.count / 3; grid = grid || o.material; } });
        return { meshes, tris, uv: !!grid };
      });
      t.expect(tex.meshes, '>=', 3, 'meshes drawn with the window-grid material (full chunks, far shells, the skyline)');
      t.expect(tex.tris, '>', 5000, 'triangles in window walls');
    },
  },
  {
    id: 'D4-S1.3', name: 'The Spire, City Hall and the billboards stand where the bible puts them',
    async run(t) {
      const page = await t.open('&quality=high' + QUIET, SMALL);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, c = g.modules.collide, out = [], res = {};
        T.teleport(59.4, -840, Math.PI); await T.wait(1.5);
        res.podium = c.circle(52, -900, 2, undefined, out) > 0 ? Math.max(...out.slice(0, c.circle(52, -900, 2, undefined, out)).map((s) => s.h)) : 0;
        res.clearRoad = c.circle(59.4, -700, 3, undefined, out);
        T.teleport(-212, -518, Math.PI); await T.wait(1.5);
        res.hall = c.circle(-212, -575, 2, undefined, out) > 0; res.fountain = c.circle(-212, -540, 2, undefined, out) > 0;
        res.cityhall = g.modules.map.landmark('cityhall');
        T.teleport(59.4, -330, Math.PI); await T.wait(1.5);
        res.stats = T.city().stats.meridian; res.errors = T.errors().length;
        return res;
      });
      t.expect(r.podium, '>=', 12, 'the Spire podium is solid (m)'); t.expect(r.clearRoad, '==', 0, 'nothing solid on the boulevard lane');
      t.expect(r.hall && r.fountain, '==', true, 'City Hall and its fountain are solid');
      t.expect(r.cityhall.h, '==', 38, 'City Hall dome (m)');
      t.expect(r.stats.billboards, '>=', 2, 'Bayhaven Tomorrow billboards built near the foot of the boulevard');
      t.expect(r.errors, '==', 0, 'console errors');
    },
  },
  {
    id: 'D4-S1.4', name: 'The day 4 clip drives up Coral Boulevard at dusk',
    async run(t) {
      const page = await t.open('&quality=low' + QUIET, SMALL);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, city0 = T.city();
        await T.clip.play('day-4');
        const p = T.player();
        return { x: p.x, z: p.z, hour: g.state.clock.hour, lit0: city0.litTo, lit1: T.city().litTo, district: g.modules.map.districtAt(p.x, p.z), ids: g.modules.clips.ids };
      });
      t.expect(r.ids.includes('day-4'), '==', true, 'the clip is registered');
      t.expect(r.z, '<', -480, 'how far north the car got (z)'); t.expect(Math.abs(r.x - 59.4), '<', 4, 'it stayed in its lane (m off line)');
      t.expect(r.district, '==', 'meridian', 'it ends downtown');
      t.expect(r.hour, 'between', [18.9, 20.2], 'the hour at the end: dusk (the clock runs on drawn time, so a slow machine ends later)');
      t.expect(r.lit1, '>', 60, 'lit floors reach this high at the end (m)');
    },
  },
];
