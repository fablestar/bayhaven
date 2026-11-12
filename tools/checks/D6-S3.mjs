// Session D6-S3 (Expressway, Northgate and Mallard Greens): D6.6 (the ramp at x = 700, then 30 s at
// 110 km/h on the deck inside the streaming budget), G3 at one spot in each district and on the
// expressway, and one check per item on the session's list, with the bibles' own checks (section
// 10 of each district file) as far as this session built.
import { calibrate } from '../check-lib.mjs';
import { TABLE } from '../../src/core/quality.js';

const QUIET = '&traffic=0&peds=0';
const SMALL = { viewport: { width: 480, height: 270 } };     // software drawing is slow; counts do not depend on the size
const SPOTS = [[0, -1474, Math.PI / 2, 'Bayline Expressway, over Coral Boulevard\'s line'], [-330, -1800, Math.PI / 2, 'Northgate, Gateway Boulevard by the Galleria'], [-1985, -1730, Math.PI / 2, 'Mallard Greens, Cormorant Way at Vulture Loop']];

export default [
  {
    id: 'D6.6', name: 'Deck: up the ramp at x = 700 to level 1 at 8 m, then 30 s at 110 km/h on the expressway inside G4', quality: ['low', 'high'],
    async run(t) {
      const page = await t.open('&quality=' + t.quality + '&seed=1' + QUIET, SMALL), cal = await calibrate(page);
      const d = await page.evaluate(async () => {
        const G = window.__game, T = G.test, map = G.modules.map;
        T.teleport(700, -1560, 0); await T.wait(1.5);
        const start = { level: G.state.player.level, y: T.player().y };
        let under = 0; const watch = setInterval(() => { const p = T.player(); if (Math.abs(p.z + 1480) < 12 && G.state.player.level === 0) under++; }, 100);
        const up = await T.drive([{ x: 1000, z: -1474 }], { seconds: 45, speed: 14 });
        const top = { level: G.state.player.level, y: T.player().y, x: T.player().x, z: T.player().z };
        T.resetStats();
        const chunkMs = [], ys = [], levels = new Set();
        const timer = setInterval(() => { const s = T.stats(), p = T.player(); chunkMs.push(s.chunkMs); ys.push(p.y); levels.add(G.state.player.level); }, 250);
        const run = await T.drive([{ x: 2900, z: -1474 }], { seconds: 30, speed: 30.6 });
        clearInterval(timer); clearInterval(watch); chunkMs.sort((a, b) => a - b);
        const s = T.stats(), p = T.player();
        return { start, up, top, run, under, x: p.x, z: p.z, yMin: Math.min(...ys), yMax: Math.max(...ys), levels: [...levels].join(), chunkMsP95: chunkMs[Math.floor(chunkMs.length * 0.95)] || 0, simMax: s.simMax,
          surface: map.surfaceAt(p.x, p.z, 1), errors: T.errors() };
      });
      t.expect(d.errors.length, '==', 0, 'console errors and warnings' + (d.errors.length ? ' (' + d.errors.slice(0, 2).join(' | ') + ')' : ''));
      t.expect(d.start.level, '==', 0, 'on Route 44 before the ramp: player.level');
      t.expect(d.top.level, '==', 1, `after the ramp at x = 700: player.level (at ${d.top.x.toFixed(0)}, ${d.top.z.toFixed(0)}, ${d.up.seconds.toFixed(0)} s)`);
      t.expect(Math.abs(d.top.y - 8), '<=', 0.6, 'after the ramp: height is near 8 m (off by)');
      t.expect(d.under, '==', 0, 'never under the deck at level 0 on the way up');
      t.expect(d.run.metres, '>=', 600, '30 s on the expressway: metres driven');
      t.expect(d.levels, '==', '1', 'level through the 30 s');
      t.expect(d.yMin, '>=', 7.4, 'lowest height through the 30 s');
      t.expect(Math.abs(d.z + 1480), '<=', 13, 'still on the deck at the end (metres from its centre line)');
      t.expect(d.chunkMsP95, '<=', 4 * cal.k, `G4: chunkMs p95 (k ${cal.k.toFixed(2)})`);
      t.expect(d.simMax, '<=', 12 * cal.kHitch, `G4: the longest simulation frame, ms (single-frame k ${cal.kHitch.toFixed(2)})`);
    },
  },
  {
    id: 'D6-S3.G3', name: 'Budgets (G3) on the expressway and at one spot in Northgate and Mallard Greens', quality: ['low', 'high'],
    async run(t) {
      const page = await t.open('&quality=' + t.quality + '&seed=1', SMALL), i = ['low', 'medium', 'high'].indexOf(t.quality), k = (await calibrate(page)).k;
      for (const [x, z, h, name] of SPOTS) {
        const s = await page.evaluate(async ([a, b, c]) => { const T = window.__game.test; T.teleport(a, b, c); await T.wait(2.5); return { ...T.stats(), ch: T.chunks(), level: window.__game.state.player.level }; }, [x, z, h]);
        t.expect(s.calls, '<=', TABLE.maxCalls[i], `${name}: draw calls`);
        t.expect(s.tris, '<=', TABLE.maxTris[i], `${name}: triangles`);
        t.expect(s.simMs, '<=', TABLE.maxSimMs[i] * k, `${name}: simMs (k ${k.toFixed(2)})`);
        t.expect(s.ch.lod0TrisMax, '<=', t.quality === 'low' ? 8400 : 20000, `${name}: the heaviest full chunk (triangles)`);
        t.expect(s.ch.shellTrisPerChunkMax, '<=', 600, `${name}: the heaviest far shell, per chunk`);
        if (z === -1474) t.expect(s.level, '==', 1, `${name}: set down on the deck, level`);
      }
    },
  },
  {
    id: 'D6-S3.1', name: 'Deck levels: height and collision filter by level; the level changes only on a ramp',
    async run(t) {
      const page = await t.open('&quality=low' + QUIET, SMALL);
      const r = await page.evaluate(async () => {
        const G = window.__game, T = G.test, map = G.modules.map, col = G.modules.collide, D = map.decks, out = [];
        T.teleport(120, -1474, Math.PI / 2); await T.wait(1.5);
        const walk = (pts) => { let level = 0; const seen = []; for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k <= 40; k++) { level = D.step(level, pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k / 40, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k / 40); seen.push(level); } return seen; };
        const under = walk([[700, -1530], [700, -1430]]), up = walk([[700, -1498], [715, -1498], [815, -1498], [855, -1485], [900, -1485]]), off = walk([[715, -1498], [815, -1498], [855, -1485], [855, -1440]]);
        const side = walk([[760, -1520], [760, -1490]]);
        return { h: [map.heightAt(120, -1480, 1), map.heightAt(120, -1480, 0), map.heightAt(765, -1498, 1), map.heightAt(765, -1498, 0), map.heightAt(120, -1600, 1)],
          barrier0: col.circle(120, -1467.2, 1.5, 0, out), barrier1: col.circle(120, -1467.2, 1.5, 1, out), pillar0: col.circle(120, -1472, 1.2, 0, out), pillar1: col.circle(120, -1472, 1.2, 1, out),
          under: Math.max(...under), up: up[up.length - 1], upFirst: up[0], off: off[off.length - 1], side: Math.max(...side), ramps: D.ramps.length, rampXs: [...new Set(D.ramps.map((q) => q.x))].join(),
          surface: [map.surfaceAt(120, -1480, 1), map.surfaceAt(120, -1480, 0)], width: D.deck.half * 2, y: D.deck.y, auto: [map.heightAt(300, -1480), map.heightAt(700, -1480)], stats: T.city().stats.decks };
      });
      t.expect(r.h.join(), '==', '8,0,4,0,0', 'heightAt: deck at level 1, ground under it at level 0, half way up a ramp, the ground under that, plain ground at level 1');
      t.expect(r.barrier0 + ',' + (r.barrier1 > 0), '==', '0,true', 'the deck\'s edge barrier: hits at level 0, any at level 1');
      t.expect((r.pillar0 > 0) + ',' + r.pillar1, '==', 'true,0', 'a pillar: any hit at level 0, hits at level 1');
      t.expect(r.under, '==', 0, 'driving under the deck on Route 44: highest level reached');
      t.expect(r.upFirst + ',' + r.up, '==', '0,1', 'up the ramp: level at its foot, level on the deck');
      t.expect(r.off, '==', 0, 'over the edge of the deck: level after leaving it');
      t.expect(r.side, '==', 0, 'walking under the high part of a ramp from the side: highest level reached');
      t.expect(r.ramps + ' at ' + r.rampXs, '==', '6 at -2400,-900,700,2200', 'ramps');
      t.expect(r.width + ' m wide, ' + r.y + ' m up', '==', '26 m wide, 8 m up', 'the deck');
      t.expect(r.surface.join(), '==', 'deck,dirt', 'surfaceAt on the deck by level');
      t.expect(r.auto.join(), '==', '8,0', 'old callers with no level: on the deck, but on the ground where Route 44 passes under');
      t.expect(r.stats.pillars, '>=', 8, 'pillars built round the player');
    },
  },
  {
    id: 'D6-S3.2', name: 'The Bayline Expressway in the lane graph: three lanes each way at 110 km/h, joined to the ground by its ramps',
    async run(t) {
      const page = await t.open('&quality=low' + QUIET, SMALL);
      const r = await page.evaluate(() => {
        const nav = window.__game.modules.nav, ex = nav.lanes.filter((l) => l.kind === 'expressway'), east = ex.filter((l) => Math.abs(l.heading - Math.PI / 2) < 0.01);
        const route = (a, b) => nav.route({ x: a[0], z: a[1] }, { x: b[0], z: b[1] }), usesDeck = (pts) => pts.some((p) => Math.abs(p.z + 1480) < 12 && Math.abs(p.x - 700) > 60 && Math.abs(p.x + 900) > 60);
        const near = nav.laneNear(0, -1474, Math.PI / 2);
        return { n: ex.length, east: east.length, perPiece: Math.max(...ex.map((l) => l.of)), kmh: Math.round(ex[0].speed * 3.6), level: [...new Set(ex.map((l) => l.level))].join(), x0: Math.min(...ex.map((l) => Math.min(l.ax, l.bx))), x1: Math.max(...ex.map((l) => Math.max(l.ax, l.bx))),
          southSide: east.every((l) => l.az > -1480), ramps: new Set(nav.lanes.filter((l) => l.kind === 'ramp').map((l) => l.roadId)).size, near: near && near.kind,
          a: usesDeck(route([700, -1560], [2000, -1474])), b: route([-2390, -1524], [-1500, -1474]).some((q) => q.x > -2390 && q.x < -2280 && Math.abs(q.z + 1498) < 6), c: route([52, -1300], [0, -1800]).length };
      });
      t.expect(r.perPiece, '==', 3, 'lanes each way');
      t.expect(r.east * 2, '==', r.n, 'as many lanes east as west');
      t.expect(r.kmh, '==', 110, 'speed limit, km/h');
      t.expect(r.level, '==', '1', 'deck level of its lanes');
      t.expect(r.x0 + ' to ' + r.x1, '==', '-3000 to 3000', 'it runs from x');
      t.expect(r.southSide, '==', true, 'eastbound lanes are on the south side (driving on the right)');
      t.expect(r.ramps, '==', 6, 'ramp roads in the graph');
      t.expect(r.near, '==', 'expressway', 'laneNear on the deck');
      t.expect(r.a, '==', true, 'a route from Route 44 to x = 2000 climbs onto the expressway');
      t.expect(r.b, '==', true, 'a route from Gander Road onto the deck goes up the ramp at x = -2400');
      t.expect(r.c, '>=', 4, 'a route from Meridian to Northgate exists (points)');
    },
  },
  {
    id: 'D6-S3.3', name: 'Northgate: the zone, six-lane Gateway Boulevard, car parks twice their shops, pole signs, Billboard Row, three landmarks',
    async run(t) {
      const page = await t.open('&quality=low' + QUIET, SMALL);
      const r = await page.evaluate(async () => {
        const G = window.__game, T = G.test, m = G.modules.map, nav = G.modules.nav, zn = m.zone('northgate'), lots = m.lots.filter((l) => l.zone === 'northgate');
        const seeds = [[-500, -1700], [200, -2150], [-200, -2000], [350, -2400], [100, -1750], [420, -1830], [-600, -2450], [-100, -2620]];
        const gw = nav.lanes.filter((l) => l.roadId === 'gateway-boulevard'), spans = {};
        for (const l of gw) { const k = Math.round(Math.min(l.from.x, l.to.x)); spans[k] = (spans[k] || 0) + 1; }
        const recipes = {}; for (const l of lots) recipes[l.recipe] = (recipes[l.recipe] || 0) + 1;
        const park = lots.filter((l) => l.recipe === 'strip' || l.recipe === 'box');
        const out = { districts: seeds.map(([x, z]) => m.districtAt(x, z)), hoods: [m.neighbourhoodAt(-600, -2400), m.neighbourhoodAt(-600, -1700), m.neighbourhoodAt(300, -1600), m.neighbourhoodAt(0, -1900), m.neighbourhoodAt(300, -2300)].join(),
          lanesPerSpan: [...new Set(Object.values(spans))].join(), gwFrom: Math.min(...gw.map((l) => l.from.x)), gwTo: Math.max(...gw.map((l) => l.to.x)),
          signals: [...m.nodes.values()].filter((n) => n.signal && n.z === -1800).map((n) => n.x).sort((a, b) => a - b).join(), recipes, ratioMin: Math.min(...park.map((l) => l.parkArea / l.bodyArea)), parks: park.length,
          hospital: m.landmark('hospital'), hq: m.landmark('sheriff-hq'), galleria: m.landmark('galleria'), wake: m.places('hospital')[0], booking: m.places('booking')[0], ns: zn.roads.lines.filter((l) => l.axis === 'ns').map((l) => l.at), boards: zn.billboards.xs };
        T.teleport(-330, -1800, Math.PI / 2); await T.wait(2); out.a = { ...T.city().stats.northgate };
        out.wakeClear = !G.modules.collide.blocked(-500, 1, -1700, 0.4); out.bookClear = !G.modules.collide.blocked(200, 1, -2146, 0.4);
        T.teleport(-420, -2440, Math.PI / 2); await T.wait(2); out.b = { ...T.city().stats.northgate };
        T.teleport(200, -2125, Math.PI / 2); await T.wait(2); out.c = { ...T.city().stats.northgate }; out.errors = T.errors();
        return out;
      });
      const BILLBOARDS = r.boards;
      t.expect(r.errors.length, '==', 0, 'console errors and warnings' + (r.errors.length ? ' (' + r.errors.slice(0, 2).join(' | ') + ')' : ''));
      t.expect(r.districts.every((d) => d === 'northgate'), '==', true, 'bible check 1: districtAt is northgate at the eight landmark seeds');
      t.expect(r.hoods, '==', 'sinkhole-park,medical-mile,motel-circle,the-strip,studio-park', 'the five neighbourhoods');
      t.expect(r.lanesPerSpan, '==', '6', 'bible check 2: lanes on every stretch of Gateway Boulevard');
      t.expect(r.gwFrom + ' to ' + r.gwTo, '==', '-800 to 700', 'Gateway Boulevard\'s lanes run from x (it carries on to Route 44)');
      t.expect(r.signals, '==', '-520,-200,120,440,700', 'bible check 2: lights on Gateway Boulevard at the four avenues, and at Route 44');
      t.expect(r.ratioMin, '>=', 2, `bible check 6: the smallest car park over its building, across ${r.parks} strip mall and big-box lots`);
      t.expect(['strip', 'box', 'drive', 'motel'].every((k) => r.recipes[k] > 0), '==', true, 'lots of all four tier A recipes (' + JSON.stringify(r.recipes) + ')');
      t.expect(r.a.strips > 0 && r.a.poleSigns > 0 && r.a.cars > 0, '==', true, `built by the Galleria: strip malls ${r.a.strips}, pole signs ${r.a.poleSigns}, parked cars ${r.a.cars}`);
      t.expect(r.a.poleMin, '>=', 12, 'the shortest pole sign, m (a strip mall is 6.7)');
      t.expect(r.c.motels + r.c.drives, '>', 0, `motels (${r.c.motels}, pools ${r.c.pools}) and drive-throughs (${r.c.drives}) built on the way`);
      t.expect(r.b.billboards, '>=', 12, 'boards of Billboard Row built round (-420, -2440)');
      t.expect(r.b.larry, '>', 0, 'of them Larry\'s');
      t.expect(BILLBOARDS.length, '==', 40, 'bible check 3: boards on Billboard Row');
      t.expect(Math.min(...BILLBOARDS.map((x) => Math.min(...r.ns.map((at) => Math.abs(x - at))))), '>=', 15, 'bible check 3: the nearest board to a north to south road\'s centre line, m');
      t.expect(Math.max(r.c.tallest, r.hq.h), '<=', 45, 'bible check 5: the tallest thing in the zone, m');
      t.expect(Math.abs(r.galleria.h - 36), '<=', 1, 'bible check 5: the flamingo\'s top is at 36 m (off by)');
      t.expect(`${r.hospital.x},${r.hospital.z} ${r.hq.x},${r.hq.z}`, '==', '-500,-1700 200,-2150', 'map.landmark gives the hospital doors and the HQ steps');
      t.expect(Math.hypot(r.wake.x + 500, r.wake.z + 1700) <= 25 && Math.hypot(r.booking.x - 200, r.booking.z + 2150) <= 25, '==', true, 'bible check 4, as far as World goes: places(\'hospital\') and places(\'booking\') are within 25 m of the seeds');
      t.expect(r.wakeClear && r.bookClear, '==', true, 'both points are clear of walls');
    },
  },
  {
    id: 'D6-S3.4', name: 'Mallard Greens: lanes from splines, houses in the four approved colours, the golf course, the wall, the gate, two landmarks',
    async run(t) {
      const page = await t.open('&quality=low' + QUIET, SMALL);
      const r = await page.evaluate(async () => {
        const G = window.__game, T = G.test, m = G.modules.map, nav = G.modules.nav, zn = m.zone('mallardgreens'), lots = zn.lotList;
        const len = (id) => { const q = zn.paths.find((p) => p.id === id).pts; let s = 0; for (let i = 0; i < q.length - 1; i++) s += Math.hypot(q[i + 1][0] - q[i][0], q[i + 1][1] - q[i][1]); return s; };
        const last = {}; let same = 0; for (const l of lots) { const k = l.lane + ':' + l.side; if (last[k] === l.wall) same++; last[k] = l.wall; }
        const ends = (id) => { const q = zn.paths.find((p) => p.id === id).pts; return [q[0], q[q.length - 1]]; };
        const inside = (x, z) => x > -3190 && x < -810 && z < -1540 && (z > -2430 || (x < -2650 && z > -2680));
        const onRoad = lots.filter((l) => { const n = m.nearestRoad(l.cx, l.cz); return n && n.d < n.width / 2 + 6; }).length;
        const out = { districts: [[-900, -1900], [-2000, -2100], [-1100, -2300], [-2450, -2420], [-2700, -1900], [-3000, -2500]].map(([x, z]) => m.districtAt(x, z)),
          hoods: [m.neighbourhoodAt(-900, -1900), m.neighbourhoodAt(-1200, -2000), m.neighbourhoodAt(-2000, -2100), m.neighbourhoodAt(-3000, -2500), m.neighbourhoodAt(-2800, -1800), m.neighbourhoodAt(-1700, -1900)].join(),
          houses: lots.length, colours: [...new Set(lots.map((l) => l.wall.toString(16)))].sort().join(), same, recipes: [...new Set(lots.map((l) => l.recipe))].sort().join(), onRoad,
          par: zn.holes.reduce((s, h) => s + h.par, 0), holes: zn.holes.length, seedsInside: zn.holes.every((h) => inside(h.tx, h.tz) && inside(h.gx, h.gz)), parked: zn.parked,
          fairway: len('fairway-drive') + len('fairway-drive-west') + Math.PI * 90, e0: Math.hypot(ends('fairway-drive')[0][0] + 900, ends('fairway-drive')[0][1] + 1900), e1: Math.hypot(ends('fairway-drive-west')[1][0] + 3000, ends('fairway-drive-west')[1][1] + 2500),
          lanes: new Set(zn.paths.map((p) => p.name)).size, curved: nav.lanes.filter((l) => l.kind === 'lane' && Math.abs(Math.sin(2 * l.heading)) > 0.2).length, speed: Math.round(nav.lanes.find((l) => l.kind === 'lane').speed * 3.6),
          route: nav.route({ x: -700, z: -1803 }, { x: -2000, z: -2015 }).length, deadEnds: [...m.nodes.values()].filter((n) => n.free && n.pieces.length === 1 && n.pieces[0].kind === 'lane').length,
          surf: [m.surfaceAt(-1500, -1900), m.surfaceAt(-1480, -1790), m.surfaceAt(-2700, -1900)].join(), club: m.landmark('clubhouse'), model: m.landmark('model-home') };
        T.setHour(9.5); T.teleport(-1985, -1730, Math.PI / 2); await T.wait(2); out.a = { ...T.city().stats.mallardgreens };
        T.teleport(-1912, -2085, Math.PI); await T.wait(2); out.b = { ...T.city().stats.mallardgreens };
        await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
        out.clock = T.clubclock(); out.minute = Math.floor(G.state.clock.hour * 60);
        out.wallHit = G.modules.collide.circle(-810, -1700, 1, 0, []) > 0; out.gateOpen = G.modules.collide.circle(-810, -1808, 3, 0, []) === 0;
        T.teleport(-890, -1885, -Math.PI / 2); await T.wait(2); out.c = { ...T.city().stats.mallardgreens }; out.gateOpen2 = G.modules.collide.circle(-810, -1808, 3, 0, []) === 0; out.errors = T.errors();
        return out;
      });
      t.expect(r.errors.length, '==', 0, 'console errors and warnings' + (r.errors.length ? ' (' + r.errors.slice(0, 2).join(' | ') + ')' : ''));
      t.expect(r.districts.every((d) => d === 'mallardgreens'), '==', true, 'districtAt is mallardgreens at six landmark seeds');
      t.expect(r.hoods, '==', 'the-gatehouse,model-mile,clubhouse-circle,phase-four,lake-serenity,the-fairways', 'six neighbourhoods');
      t.expect(r.houses, '>=', 300, 'house lots along the lanes');
      t.expect(r.colours, '==', 'b7c9a8,c9cdd4,f0d0c8,f5ecd7', 'bible check 1: every house wall is one of the four approved colours');
      t.expect(r.same, '==', 0, 'bible check 1: neighbours on a lane that share a colour');
      t.expect(r.recipes, '==', 'mg-ranch,mg-two,mg-villa', 'the three tier A house models');
      t.expect(r.onRoad, '==', 0, 'houses standing on or within 6 m of a lane');
      t.expect(r.par + ' over ' + r.holes + ' holes', '==', '71 over 18 holes', 'bible check 2: the card');
      t.expect(r.seedsInside, '==', true, 'bible check 2: all 36 tee and green seeds are inside the perimeter');
      t.expect(r.parked, '==', 0, 'bible check 3: the zone\'s share of kerb-parked cars');
      t.expect(r.fairway, '>=', 2300, 'bible check 6: Fairway Drive, m (both halves and half the circle)'); t.expect(r.fairway, '<=', 2500, 'bible check 6: Fairway Drive, m, upper bound');
      t.expect(Math.max(r.e0, r.e1), '<=', 15, 'bible check 6: its ends are at (-900, -1900) and (-3000, -2500) (off by, m)');
      t.expect(r.lanes, '>=', 18, 'named lanes');
      t.expect(r.curved, '>=', 100, 'lanes in the graph that run at an angle (not on a grid)');
      t.expect(r.speed, '==', 30, 'suburb lane speed limit, km/h');
      t.expect(r.deadEnds, '>=', 8, 'cul-de-sacs and dead ends');
      t.expect(r.route, '>=', 10, 'a route from Gateway Boulevard through the gate to the clubhouse (points)');
      t.expect(r.surf, '==', 'grass,road,water', 'surfaceAt: a lawn, a lane, the lake');
      t.expect(r.a.houses > 0 && r.a.trees > 0, '==', true, `built at Vulture Loop: houses ${r.a.houses}, trees ${r.a.trees}, lamps ${r.a.lamps}`);
      t.expect(r.b.greens > 0 && r.b.flags > 0, '==', true, `built by the clubhouse: greens ${r.b.greens}, flags ${r.b.flags}`);
      t.expect(r.clock.minute, '==', r.minute, 'bible check 5: the clubhouse clock\'s hands are set to the game clock, to the minute');
      t.expect(r.clock.visible, '==', true, 'the clock is drawn when the tower is near');
      t.expect(r.c.walls > 0 && r.gateOpen2, '==', true, 'the wall is built at the Gatehouse and the way in is open');
      t.expect(`${r.club.x},${r.club.z},${r.club.h} ${r.model.x},${r.model.z}`, '==', '-2000,-2100,25 -1100,-2300', 'the clubhouse (25 m) and the model home are landmarks');
    },
  },
];
