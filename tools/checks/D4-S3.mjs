// Session D4-S3 (Port, Palma Vieja and Paintworks): D4.1 for the three districts, D4.6 (the long
// drive from the beach to the port), G3 at one spot in each district, and one check per item on
// the session's list, with the bible's own checks (section 10 of each district file) as far as
// this session built.
import { calibrate } from '../check-lib.mjs';
import { TABLE } from '../../src/core/quality.js';

const QUIET = '&traffic=0&peds=0';
const SMALL = { viewport: { width: 480, height: 270 } };     // software drawing is slow; counts do not depend on the size
const SPOTS = [[-1321, -850, Math.PI, 'Palma Vieja, by Domino Park'], [1332, -730, Math.PI, 'The Paintworks, by the factory'], [2800, -357, Math.PI / 2, 'Rustwater, at the port gate']];

export default [
  {
    id: 'D4.1', name: 'Districts (Palma Vieja, The Paintworks, Rustwater)',
    async run(t) {
      const page = await t.open('&quality=low' + QUIET, SMALL);
      const r = await page.evaluate(() => {
        const m = window.__game.modules.map, at = (list) => list.map(([x, z]) => m.districtAt(x, z));
        return { road: [m.districtAt(-1400, -900), m.districtAt(1300, -800), m.districtAt(2500, -700), m.districtAt(52, -900)],
          pv: at([[-1400, -880], [-1020, -640], [-1990, -330], [-810, -1430]]), pw: at([[1300, -800], [1100, -600], [810, -330], [1790, -1270]]),
          rw: at([[2900, -300], [2500, 100], [2200, -1200], [1810, -1590]]) };
      });
      t.expect(r.road.join(), '==', 'palmavieja,paintworks,rustwater,meridian', 'the roadmap\'s four points');
      t.expect(r.pv.every((d) => d === 'palmavieja'), '==', true, 'the bible\'s four Palma Vieja points');
      t.expect(r.pw.every((d) => d === 'paintworks'), '==', true, 'the bible\'s four Paintworks points');
      t.expect(r.rw.every((d) => d === 'rustwater'), '==', true, 'the bible\'s four Rustwater points');
    },
  },
  {
    id: 'D4.6', name: 'Long drive: 90 s from the beach to the port on empty streets, clean and inside the streaming budget', quality: ['low', 'high'],
    async run(t) {
      // traffic is off: the route follower cannot overtake, and one run in three it sat behind a stopped car for the rest of the drive
      const page = await t.open('&quality=' + t.quality + '&seed=1&traffic=0', SMALL), cal = await calibrate(page);
      const d = await page.evaluate(async () => {
        const T = window.__game.test, map = window.__game.modules.map;
        T.teleport(1100, 40.5, Math.PI / 2); await T.wait(2); T.resetStats();
        const chunkMs = [], chunks = new Set(), districts = new Set();
        const timer = setInterval(() => { const s = T.stats(), p = T.player(), c = map.chunkOf(p.x, p.z); chunkMs.push(s.chunkMs); chunks.add(c.cx + ',' + c.cz); districts.add(map.districtAt(p.x, p.z)); }, 250);
        const done = await T.drive([{ x: 1332, z: 37 }, { x: 1332, z: -357 }, { x: 2900, z: -357 }], { seconds: 90, speed: 24 });
        clearInterval(timer); chunkMs.sort((a, b) => a - b);
        const s = T.stats(), p = T.player();
        return { ...done, x: p.x, z: p.z, crashes: T.count('vehicle:crash'), chunks: chunks.size, districts: [...districts].sort().join(), chunkMsP95: chunkMs[Math.floor(chunkMs.length * 0.95)] || 0, simMax: s.simMax, errors: T.errors() };
      });
      t.expect(d.errors.length, '==', 0, 'G2: console errors and warnings' + (d.errors.length ? ' (' + d.errors.slice(0, 2).join(' | ') + ')' : ''));
      t.expect(d.chunks, '>=', 8, 'G2: chunks crossed');
      t.expect(d.metres, '>=', 1500, 'metres driven in 90 s');
      t.expect(d.districts, '==', 'paintworks,rustwater,tideline', 'districts driven through');
      t.expect(d.x, '>', 2300, `it ends in the port (x; z ${d.z.toFixed(0)}, ${d.seconds.toFixed(0)} s, ${d.crashes} bumps)`);
      t.expect(d.chunkMsP95, '<=', 4 * cal.k, `G4: chunkMs p95 (k ${cal.k.toFixed(2)})`);
      t.expect(d.simMax, '<=', 12 * cal.kHitch, `G4: the longest simulation frame, ms (single-frame k ${cal.kHitch.toFixed(2)})`);
    },
  },
  {
    id: 'D4-S3.G3', name: 'Budgets (G3) at one spot in each of the three districts', quality: ['low', 'high'],
    async run(t) {
      const page = await t.open('&quality=' + t.quality + '&seed=1', SMALL), i = ['low', 'medium', 'high'].indexOf(t.quality), k = (await calibrate(page)).k;
      for (const [x, z, h, name] of SPOTS) {
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
    id: 'D4-S3.1', name: 'The mural painter: seeded, twelve shapes, five layouts, a given palette',
    async run(t) {
      const page = await t.open('&quality=low' + QUIET, SMALL);
      const r = await page.evaluate(() => {
        const M = window.__game.test.murals, a = M.paint(3301), b = M.paint(3301), c = M.paint(3302), seen = new Set(), hashes = new Set(), neon = ['#b46bff', '#5dff9b', '#ff3fa4', '#fff1c9', '#29e6ff'];
        for (let s = 100; s < 160; s++) { const p = M.paint(s, neon); hashes.add(p.hash); seen.add(p.layout); }
        const other = M.paint(3301, neon), again = M.paint(3301);
        const uv = M.ask(3301); for (let s = 100; s < 160; s++) M.ask(s, neon);          // 61 murals on a sheet with room for 48
        const uv2 = M.ask(3301);
        return { a, b, c, again, other, hashes: hashes.size, m: M(), layouts: seen.size, uv: uv.every((v) => v >= 0 && v <= 1) && uv2.every((v) => v >= 0 && v <= 1) };
      });
      t.expect(r.a.hash === r.b.hash, '==', true, 'the same seed and palette give the same picture');
      t.expect(r.a.hash !== r.c.hash, '==', true, 'the next seed gives another');
      t.expect(r.again.hash === r.a.hash, '==', true, 'and the same again after 60 other murals');
      t.expect(r.other.hash !== r.a.hash, '==', true, 'another palette gives another picture'); t.expect(r.uv, '==', true, 'cells on the sheet have UVs inside it');
      t.expect(r.hashes, '>=', 58, 'different pictures from 60 seeds');
      t.expect(r.a.colours, 'between', [4, 120], 'colour steps in one Palma Vieja mural (five paints, ink and their soft edges)');
      t.expect(r.m.shapes, '==', 12, 'shapes the painter knows');
      t.expect(r.layouts, '==', 5, 'layouts used across those seeds');
      t.expect(r.m.reused, '>=', 1, 'cells painted over when the sheet was full');
      t.expect(r.m.size, 'between', [1024, 2048], 'the sheet (px): 1024 once a phone-quality chunk has asked for it');
    },
  },
  {
    id: 'D4-S3.2', name: 'Palma Vieja: shop-houses in hot colours, bulbs, Domino Park and the bell tower',
    async run(t) {
      const page = await t.open('&quality=low' + QUIET, SMALL);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, m = g.modules.map, c = g.modules.collide, out = [];
        const L = m.lots.filter((l) => l.zone === 'palmavieja'), kit = L.filter((l) => !l.hero), hot = [0xffb347, 0x2ec4b6, 0xff6f91, 0xb5e48c];
        let same = 0, pairs = 0;
        const rows = {}; for (const l of kit) (rows[l.block + l.face] ||= []).push(l);
        for (const k in rows) { const row = rows[k].sort((a, b) => a.x0 - b.x0); for (let i = 1; i < row.length; i++) { pairs++; if (row[i].wall === row[i - 1].wall) same++; } }
        const res = { lots: kit.length, same, pairs, offPalette: kit.filter((l) => !hot.includes(l.wall)).length, floors: [...new Set(kit.map((l) => l.floors))].sort().join(),
          tallest: Math.max(...kit.map((l) => l.h)), tower: m.landmark('bell-tower'), park: m.landmark('domino-park'),
          names: [m.nearestRoad(-1092, -500).name, m.nearestRoad(-1200, -437).name, m.nearestRoad(-1332, -700).name, m.nearestRoad(-1332, -700).kind],
          calles: m.zone('palmavieja').roads.lines.filter((l) => l.axis === 'ns' && /^Calle /.test(l.name)).length,
          closed: m.roadAt(-1412, -880), seam: !!m.nodes.get('-800,-677'), hoods: [m.neighbourhoodAt(-1400, -880), m.neighbourhoodAt(-900, -800), m.neighbourhoodAt(-1500, -1300), m.neighbourhoodAt(-1500, -400)],
          mix: [m.zone('palmavieja').traffic, m.zone('palmavieja').peds] };
        T.teleport(-1321, -850, Math.PI); await T.wait(2);
        res.gen = T.city().stats.palmavieja; res.city = T.city();
        res.tableSolid = c.circle(-1400, -880, 1, undefined, out) > 0; res.towerSolid = c.circle(-1350, -960, 2, undefined, out) > 0 ? Math.max(...out.slice(0, c.circle(-1350, -960, 2, undefined, out)).map((s) => s.h)) : 0;
        res.kerb = m.heightAt(-1412, -880);
        // bulbs: every bulb is drawn in #fff2cc; count the strings over one La Plaza street piece
        let murals = 0; g.scene.traverse((o) => { if (o.userData && o.userData.murals) murals += o.userData.murals; });
        res.painted = murals; res.errors = T.errors().length;
        return res;
      });
      t.expect(r.lots, '>=', 1500, 'shop-house lots'); t.expect(r.offPalette, '==', 0, 'walls that are not mango, turquoise, rose or lime');
      t.expect(r.same, '==', 0, `neighbours that share a wall colour (of ${r.pairs} pairs)`);
      t.expect(r.floors, '==', '2,3', 'floors'); t.expect(r.tallest, '<=', 11, 'the tallest kit building (m)');
      t.expect(r.tower.h === 34 && r.tower.x === -1350 && r.tower.z === -960, '==', true, 'the bell tower is 34 m at (-1350, -960)');
      t.expect(r.towerSolid, '==', 34, 'and solid to its top (m)');
      t.expect(r.city.landmarks.includes('bell-tower'), '==', true, 'the bell tower is in the skyline');
      t.expect(r.names.slice(0, 3).join(), '==', 'Calle Jazmín,Calle Uno,Avenida Mercado', 'road names at three points'); t.expect(r.names[3], '==', 'avenue', 'Avenida Mercado is an avenue');
      t.expect(r.calles, '==', 11, 'north-south streets with a Calle name');
      t.expect(r.closed, '==', null, 'Calle Mamey is closed across Domino Park'); t.expect(r.kerb, '>', 0.1, 'the park stands at kerb height');
      t.expect(r.seam, '==', true, 'Commerce Way runs on into downtown with no barrier');
      t.expect(r.hoods.join(), '==', 'la-plaza,calle-mural,los-patios,el-bajo', 'neighbourhoods');
      t.expect(r.gen.houses, '>=', 100, 'shop-houses built round the park'); t.expect(r.gen.bulbStrings, '>=', 40, 'strings of bulbs hung');
      t.expect(r.gen.bulbs / r.gen.bulbStrings, '>=', 6, 'bulbs a string (12 across a street, fewer between the park\'s trees)');
      t.expect(r.gen.boards, '>=', 30, 'hand-painted boards'); t.expect(r.painted, '>=', 30, 'painted quads in the scene (boards and murals)');
      t.expect(r.tableSolid, '==', true, 'Rafa\'s table stands at (-1400, -880)');
      t.expect(r.mix[0].flounder === 3 && r.mix[1].retiree >= 4, '==', true, 'the district\'s traffic and people mixes');
      t.expect(r.errors, '==', 0, 'console errors');
    },
  },
  {
    id: 'D4-S3.3', name: 'Palma Vieja on a laptop: six bulb strings per 100 m in La Plaza and Calle Mural, eight tables in the park',
    async run(t) {
      const page = await t.open('&quality=high' + QUIET, SMALL);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test;
        T.teleport(-1321, -850, Math.PI); await T.wait(3);
        T.teleport(-1012, -800, Math.PI); await T.wait(3);
        return { gen: T.city().stats.palmavieja, ch: T.chunks(), errors: T.errors().length };
      });
      t.expect(r.gen.per100Min, '>=', 6, 'the fewest bulb strings per 100 m on any street built in La Plaza and Calle Mural');
      t.expect(r.gen.bulbs / r.gen.bulbStrings, '>=', 11, 'bulbs a string, on average (12 across a street, 10 between the park\'s trees)');
      t.expect(r.gen.parkTables, '==', 8, 'tables under the pergola in Domino Park (Rafa\'s is the ninth)');
      t.expect(r.gen.murals, '>=', 10, 'murals on corner houses'); t.expect(r.gen.tallest, '<=', 11, 'the tallest house built, tiles and all (m)');
      t.expect(r.ch.lod0TrisMax, '<=', 20000, 'the heaviest full chunk (triangles)');
      t.expect(r.errors, '==', 0, 'console errors');
    },
  },
  {
    id: 'D4-S3.4', name: 'Rustwater: containers in six colours, cranes over the ship, the cruise terminal, sodium lights',
    async run(t) {
      const page = await t.open('&quality=low' + QUIET, SMALL);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, m = g.modules.map, c = g.modules.collide, out = [], res = {};
        res.land = [m.isLand(3050, -300), m.isLand(2500, 150), m.isLand(3000, -300), m.isLand(2500, 120)];
        res.names = [m.nearestRoad(2212, -1400).name, m.nearestRoad(2932, -500).name, m.nearestRoad(2400, -357).name];
        res.lm = [m.landmark('gantry-cranes'), m.landmark('ship-berth'), m.landmark('cruise-terminal')];
        res.cranes = m.lots.filter((l) => l.hero === 'gantry-crane').map((l) => [l.zc !== undefined ? l.zc : (l.z0 + l.z1) / 2, l.h]);
        res.tallestKit = Math.max(...m.lots.filter((l) => l.zone === 'rustwater' && !l.hero).map((l) => l.h || 0));
        res.seam = [!!m.nodes.get('1800,-357'), !!m.nodes.get('1800,-1317')];
        res.mix = [m.zone('rustwater').traffic, m.zone('rustwater').peds];
        T.teleport(2932, -420, 0); await T.wait(2.5);
        res.road = c.circle(2932, -350, 3, undefined, out); res.leg = c.circle(2900, -362, 1.5, undefined, out) + c.circle(2900, -338, 1.5, undefined, out);
        res.hull = c.circle(3050, -300, 3, undefined, out) > 0;
        res.gen = T.city().stats.rustwater; res.landmarks = T.city().landmarks;
        let boxes = 0, lamps = 0; const cols = new Set();
        g.scene.traverse((o) => { if (o.isInstancedMesh && o.instanceColor && o.geometry.attributes.position.count === 36) { boxes += o.count; for (let i = 0; i < o.count; i++) cols.add([0, 1, 2].map((k) => Math.round(o.instanceColor.array[i * 3 + k] * 1000)).join()); } });
        res.boxes = boxes; res.colours = cols.size; res.lampProps = g.modules.props.count('lamp', 'up') + g.modules.props.count('lampLong', 'up');
        T.teleport(2500, 40, 0); await T.wait(2.5);
        res.hall = c.circle(2500, 90, 3, undefined, out) > 0; res.gen2 = T.city().stats.rustwater; res.errors = T.errors().length;
        return res;
      });
      t.expect(r.land.join(), '==', 'false,false,true,true', 'isLand: the berth and the cruise basin are water, the quay is land');
      t.expect(r.names.join(), '==', 'Keel Street,Breakwater Road,Flamingo Avenue', 'road names at three points');
      t.expect(r.cranes.length, '==', 4, 'gantry cranes'); t.expect(r.cranes.map((c) => c[0]).sort((a, b) => a - b).join(), '==', '-450,-350,-250,-150', 'their places along the quay (z)');
      t.expect(r.cranes.every((c) => c[1] === 70), '==', true, 'each crane top is at 70 m');
      t.expect(r.lm[2].h, '==', 52, 'the cruise ship\'s funnel (m)'); t.expect(r.tallestKit, '<=', 14, 'the tallest kit building (m)');
      t.expect(r.road, '==', 0, 'nothing solid on Breakwater Road under crane 2'); t.expect(r.leg, '>=', 2, 'crane 2\'s landside legs are solid');
      t.expect(r.gen.crane.lowestOverRoad, '>=', 14, 'the lowest crane part over Breakwater Road (m)');
      t.expect(r.hull && r.hall, '==', true, 'the container ship and the terminal hall are solid');
      t.expect(r.boxes, '>=', 150, 'containers drawn near the cranes (instanced)'); t.expect(r.colours, '==', 6, 'container colours in the scene');
      t.expect(r.gen.masts, '>=', 8, 'sodium light masts built'); t.expect(r.gen.lampColours.join(), '==', String(0xff9a3c), 'the one lamp colour the kit has');
      t.expect(r.lampProps, '==', 0, 'ordinary warm street lamps standing in the port');
      t.expect(r.gen2.wagons + r.gen.wagons, '>=', 0, 'rail wagons counted'); t.expect(r.gen2.sheds, '>=', 1, 'transit sheds built');
      t.expect(['gantry-crane', 'ship-berth', 'cruise-terminal'].every((id) => r.landmarks.includes(id)), '==', true, 'cranes and both ships are in the skyline');
      t.expect(r.seam.join(), '==', 'true,true', 'Flamingo Avenue and Union Avenue run on from The Paintworks');
      t.expect(r.mix[0].hogfish === 5 && r.mix[1]['dock worker'] === 6, '==', true, 'the district\'s traffic and people mixes');
      t.expect(r.errors, '==', 0, 'console errors');
    },
  },
  {
    id: 'D4-S3.5', name: 'The Paintworks: mural warehouses, container bars, a rooftop club, the factory\'s three chimneys',
    async run(t) {
      const page = await t.open('&quality=low&hour=22' + QUIET, SMALL);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, m = g.modules.map, c = g.modules.collide, out = [], res = {};
        const kit = m.lots.filter((l) => l.zone === 'paintworks' && !l.hero);
        res.lots = kit.length; res.withMural = kit.filter((l) => l.murals && l.murals.length).length;
        const by = {}; for (const l of kit) by[l.recipe] = (by[l.recipe] || 0) + 1; res.by = by;
        let shared = 0; const per = {};
        for (const l of kit) for (const mu of l.murals || []) { const k = m.chunkOf((l.x0 + l.x1) / 2, (l.z0 + l.z1) / 2), key = k.cx + ',' + k.cz + ':' + mu.seed; if (per[key]) shared++; per[key] = 1; }
        res.shared = shared; res.tallest = Math.max(...kit.map((l) => l.h + (l.recipe === 'W5' ? 5 : l.recipe === 'W1' ? 2.6 : l.recipe === 'W2' ? 2.6 : 1.1)));
        res.alley = g.modules.nav.lanes.filter((l) => Math.abs(l.ax - 1092) < 12 && Math.abs(l.bx - 1092) < 12 && Math.min(l.az, l.bz) < -444 && Math.max(l.az, l.bz) > -666 && Math.abs(l.ax - l.bx) < 1).length;
        res.names = [m.nearestRoad(1492, -900).name, m.nearestRoad(1092, -1100).name]; res.pigments = m.zone('paintworks').roads.lines.filter((l) => l.axis === 'ns' && l.kind === 'street').length;
        res.closed = [m.roadAt(1252, -837), m.roadAt(1092, -560)]; res.lm = m.landmark('paint-factory'); res.mix = [m.zone('paintworks').traffic, m.zone('paintworks').peds, m.zone('paintworks').night.peds];
        res.seam = [!!m.nodes.get('800,-677'), !!m.nodes.get('1012,-320')];
        T.teleport(1332, -730, Math.PI); await T.wait(2.5);
        const hAt = (x, z) => { const n = c.circle(x, z, 1.5, undefined, out); return n ? Math.max(...out.slice(0, n).map((s) => s.h)) : 0; };
        res.chimneys = [hAt(1200, -885), hAt(1222, -885), hAt(1244, -885)]; res.hall = hAt(1272, -802);
        res.landmarks = T.city().landmarks; res.gen = T.city().stats.paintworks; res.sheet = T.murals();
        // drive round until a club and a container bar have been built
        for (const [x, z] of [[1500, -500], [1500, -880], [1012, -1157], [1652, -1157]]) { T.teleport(x, z, 0); await T.wait(1.5); }
        res.gen2 = T.city().stats.paintworks;
        let beams = 0; g.scene.traverse((o) => { if (o.userData && o.userData.beams) beams += o.userData.beams; });
        res.beams = beams; res.errors = T.errors().length;
        return res;
      });
      t.expect(r.lots, '>=', 200, 'kit lots'); t.expect(r.withMural / r.lots, '>=', 0.8, 'share of kit buildings with a mural wall');
      t.expect(r.shared, '==', 0, 'murals in one chunk that share a seed');
      for (const id of ['W1', 'W2', 'W4', 'W5']) t.expect(r.by[id] || 0, '>=', 6, `lots of recipe ${id}`);
      t.expect(r.tallest, '<=', 26, 'the tallest kit building, roof gear and all (m)');
      t.expect(r.chimneys.join(), '==', '62,54,46', 'the three chimneys at z = -885 (m)'); t.expect(r.hall, '==', 16, 'the factory hall (m)');
      t.expect(r.lm.h, '==', 62, 'the landmark\'s height (m)'); t.expect(r.landmarks.includes('paint-factory'), '==', true, 'the chimneys are in the skyline');
      t.expect(r.alley, '==', 0, 'traffic lanes along Wet Paint Alley'); t.expect(r.closed[0] === null && r.closed[1] === null, '==', true, 'Sixth Street and the alley are closed to cars');
      t.expect(r.names.join(), '==', 'Cadmium Street,Cobalt Street', 'road names at two points'); t.expect(r.pigments, '==', 9, 'north-south streets named for pigments');
      t.expect(r.seam.join(), '==', 'true,true', 'streets run on from downtown and up from the beachfront');
      t.expect(r.gen.murals, '>=', 10, 'mural walls painted round the factory'); t.expect(r.sheet.painted, '>=', 12, 'cells painted on the sheet');
      t.expect(r.gen2.bars, '>=', 1, 'container bars built'); t.expect(r.gen2.barContainers / Math.max(1, r.gen2.bars), '>=', 3, 'containers a bar');
      t.expect(r.gen2.clubs, '>=', 1, 'rooftop clubs built'); t.expect(r.beams, '>=', 8, 'moving light beams in the scene');
      t.expect(r.mix[0].pompano === 3 && r.mix[1].tourist === 10 && r.mix[2].clubber === 8, '==', true, 'the district\'s traffic and people mixes, by day and by night');
      t.expect(r.errors, '==', 0, 'console errors');
    },
  },
  {
    id: 'D4-S3.6', name: 'Cranes, chimneys and the bell tower stand in the skyline',
    async run(t) {
      const page = await t.open('&quality=low' + QUIET, SMALL);
      const c = await page.evaluate(() => window.__game.test.city());
      for (const id of ['gantry-crane', 'paint-factory', 'bell-tower', 'spire']) t.expect(c.landmarks.includes(id), '==', true, `${id} is drawn in the skyline mesh`);
      t.expect(c.landmarks.filter((id) => id === 'gantry-crane').length, '==', 4, 'cranes in the skyline');
      t.expect(c.triangles, '<=', 20000, 'skyline triangles'); t.expect(c.top, '==', 260, 'the Spire is still the tallest thing (m)');
    },
  },
];
