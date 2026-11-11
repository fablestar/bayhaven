// Session D2-S2 (Foundation): D2.3 from plan/08-roadmap.md, plus one check per piece of the frame.
// "Reproduces day 1's numbers" is tools/checks/d1.mjs, which every run of this file also runs (gate G7).
import { readdirSync, readFileSync, existsSync } from 'node:fs';

const lines = (f) => readFileSync(f, 'utf8').split('\n').length;
const srcFiles = () => readdirSync('src', { recursive: true }).filter((f) => f.endsWith('.js')).map((f) => 'src/' + f);

export default [
  {
    id: 'D2.3', name: 'Layout',
    async run(t) {
      const mods = await t.eval(() => window.__game.test.modules());
      t.expect(mods.length, '>=', 8, 'modules the registry found');
      t.note('modules: ' + mods.map((m) => `${m.name} (${m.order})`).join(', '));
      t.expect(mods.every((m) => /\.mod\.js$/.test(m.path)), '==', true, 'every module is a *.mod.js file');
      t.expect(lines('src/main.js'), '<=', 60, 'lines in src/main.js');
      const big = srcFiles().map((f) => [f, lines(f)]).filter(([, n]) => n > 500);
      t.expect(big.length, '==', 0, 'source files over 500 lines ' + JSON.stringify(big));
      const flat = readdirSync('src').filter((f) => f.endsWith('.js') && f !== 'main.js');
      t.expect(flat.length, '==', 0, 'loose files left in src/ ' + JSON.stringify(flat));
      for (const d of ['core', 'gfx', 'world', 'vehicles', 'actors', 'systems', 'content', 'audio', 'ui']) {
        t.expect(existsSync('src/' + d) && existsSync(`docs/contracts/${d}.md`), '==', true, `src/${d}/ exists and has a contract file`);
      }
      const main = readFileSync('src/main.js', 'utf8');
      t.expect(/\.mod\.js/.test(main.replace(/\/\/.*$/gm, '')), '==', false, 'main.js names a module file');
    },
  },
  {
    id: 'D2-S2.1', name: 'Events, state, rng, loop',
    async run(t) {
      const r = await t.eval(() => {
        const g = window.__game, ev = g.events, out = {};
        const got = [];
        const off = ev.on('test:a', (d) => got.push('1:' + d.n));
        ev.once('test:a', () => got.push('once'));
        ev.on('test:a', () => { throw new Error('boom on purpose'); });
        ev.on('test:a', (d) => got.push('4:' + d.n));
        const before = g.test.errors().length;
        const realError = console.error; console.error = () => {};        // keep the on-purpose error out of the page's console
        ev.emit('test:a', { n: 1 }); off(); ev.emit('test:a', { n: 2 });
        console.error = realError;
        out.order = got.join(' '); out.caught = g.test.errors().length - before; out.count = ev.count('test:a');
        out.keys = Object.keys(g.state).join(' ');
        out.player = Object.keys(g.test.player()).join(' ');
        const ticks = []; const stop = g.loop.every(0.1, () => ticks.push(g.loop.step));
        let after = 0; g.loop.after(0.25, () => { after = g.loop.time; });
        const t0 = g.loop.time; g.test.advance(1); stop(); g.test.advance(0.5);
        out.ticks = ticks.length; out.after = after - t0; out.simmed = g.loop.time - t0;
        return out;
      });
      t.expect(r.order, '==', '1:1 once 4:1 4:2', 'handlers run in order; off() and once() remove them; a throw does not stop the rest');
      t.expect(r.caught, '==', 2, 'handler exceptions counted in test.errors()');
      t.expect(r.count, '==', 2, 'events.count');
      for (const k of ['build', 'clock', 'weather', 'player', 'chars', 'heat', 'economy', 'mission', 'world', 'ui', 'settings']) t.expect(r.keys.split(' ').includes(k), '==', true, `state.${k}`);
      for (const k of ['id', 'mode', 'x', 'z', 'y', 'h', 'level', 'speed', 'health', 'armour', 'vehicle']) t.expect(r.player.split(' ').includes(k), '==', true, `state.player.${k}`);
      t.expect(r.ticks, '==', 10, 'loop.every(0.1) ticks in 1 s of game time, none after it is stopped');
      t.expect(r.after, 'between', [0.24, 0.27], 'loop.after(0.25) fires on time (s)');
      t.expect(r.simmed, 'between', [1.49, 1.51], 'test.advance(1.5) runs 1.5 s of fixed steps');
      const rng = await import('../../src/core/rng.js');
      const a = rng.rng(42), b = rng.rng(42);
      t.expect([a(), a(), a()].join() === [b(), b(), b()].join(), '==', true, 'rng(seed) repeats');
      // taken from day 1's own builder.js (commit d46d937) with the city's seed
      const city = rng.rng(20261111);
      t.expect([city(), city(), city()].join(), '==', [0.5643661734648049, 0.9201769302599132, 0.6690848593134433].join(), 'rng is still day 1\'s generator (first three numbers of the city seed)');
      t.expect(rng.hash2(7, 3, -2) === rng.hash2(7, 3, -2) && rng.hash2(7, 3, -2) !== rng.hash2(7, -2, 3), '==', true, 'hash2 is steady and tells (3, -2) from (-2, 3)');
      const r3 = rng.rng(5); let taxi = 0;
      for (let i = 0; i < 1000; i++) if (rng.weighted(r3, { tarpon: 3, taxi: 1 }) === 'taxi') taxi++;
      t.expect(taxi, 'between', [200, 300], 'weighted picks taxi about a quarter of the time (of 1000)');
    },
  },
  {
    id: 'D2-S2.2', name: 'Quality levels', quality: ['low', 'high'],
    async run(t) {
      const { TABLE } = await import('../../src/core/quality.js');
      const q = await t.eval(() => { const g = window.__game; return { level: g.quality.level, traffic: g.quality.get('trafficCap'), calls: g.quality.get('maxCalls'), ratio: g.quality.pixelRatio, s: g.test.stats() }; });
      const i = t.quality === 'low' ? 0 : 2;
      t.expect(q.level, '==', t.quality, '?quality= sets the level');
      t.expect(q.traffic, '==', [14, 26, 40][i], 'trafficCap');
      t.expect(q.calls, '==', [150, 225, 300][i], 'draw-call budget');
      t.expect(q.ratio, '<=', [1.5, 1.5, 2][i], 'pixel ratio at or under the level\'s cap');
      for (const key of ['maxCalls', 'maxTris', 'maxSimMs', 'maxChunkMs', 'maxFrameMs', 'maxHeapMB', 'lod0Radius', 'lod1Radius', 'pixelRatio', 'minPixelRatio', 'trafficCap', 'pedCap', 'copCap',
        'debrisCap', 'windowGeometry', 'shadows', 'post', 'fog', 'rainStreaks', 'audioVoices', 'maxCanvasTextures', 'targetFps']) {
        t.expect(Array.isArray(TABLE[key]) && TABLE[key].length === 3, '==', true, `quality table row ${key} has low, medium, high`);
      }
      t.expect(q.s.calls, '<=', q.calls, 'draw calls at the spawn inside this level\'s budget');
      for (const k of ['calls', 'tris', 'simMs', 'chunkMs', 'fps', 'heapMB', 'chunks', 'cars', 'peds', 'cops']) t.expect(typeof q.s[k], '==', 'number', `test.stats().${k}`);
      const changed = await t.eval(() => { const g = window.__game; let got = null; g.events.once('quality:changed', (d) => { got = d; }); g.test.setQuality('medium'); return { got, level: g.quality.level, cap: g.quality.get('pedCap') }; });
      t.expect(changed.level === 'medium' && changed.cap === 40 && changed.got.level === 'medium', '==', true, 'test.setQuality switches level and emits quality:changed');
    },
  },
  {
    id: 'D2-S2.3', name: 'Input actions and the test API',
    async run(t) {
      const page = await t.page();
      const keys = await t.eval(() => Object.keys(window.__game.test).join(' '));
      for (const k of ['ready', 'stats', 'errors', 'teleport', 'setHour', 'setQuality', 'input', 'wait', 'player']) t.expect(keys.split(' ').includes(k), '==', true, `test.${k}`);
      await page.keyboard.down('KeyW'); await page.keyboard.down('KeyA'); await t.frames(3);
      const held = await t.eval(() => { const a = window.__game.input; return { steer: a.steer, throttle: a.throttle, gas: a.gas }; });
      await page.keyboard.up('KeyW'); await page.keyboard.up('KeyA');
      t.expect(held.steer === 1 && held.throttle === 1 && held.gas === 1, '==', true, 'W and A give throttle +1 and steer +1 (left)');
      const pressed = await t.eval(() => {
        const g = window.__game, seen = [];
        const off = g.events.on('input:press', (d) => seen.push(d.name));
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyC' }));
        off();
        return { seen: seen.join(), mode: g.modules.camera.mode };
      });
      t.expect(pressed.seen, '==', 'camera', 'a key press arrives as input:press');
      t.expect(pressed.mode, '==', 'close', 'the camera module heard it');
      const w = await t.eval(async () => { const g = window.__game, a = g.loop.time; await g.test.wait(0.5); return g.loop.time - a; });
      t.expect(w, 'between', [0.49, 0.6], 'test.wait(0.5) resolves after 0.5 s of game time');
      const tp = await t.eval(() => { const T = window.__game.test; T.teleport(40, -37, Math.PI); const p = T.player(); T.setHour(21); return { x: p.x, z: p.z, h: p.h, hour: window.__game.state.clock.hour }; });
      t.expect(tp.x === 40 && tp.z === -37 && Math.abs(tp.h - Math.PI) < 1e-9, '==', true, 'test.teleport moves the player');
      t.expect(Math.abs(tp.hour - 21), '<', 0.01, 'test.setHour');
      t.expect((await t.gameErrors()).length, '==', 0, 'test.errors() is empty');
    },
  },
  {
    id: 'D2-S2.4', name: 'Map and lane-graph stand-ins',
    async run(t) {
      const r = await t.eval(() => {
        const { map, nav } = window.__game.modules;
        const east = nav.laneNear(0, 40, Math.PI / 2), west = nav.laneNear(0, 34, -Math.PI / 2);
        const route = [{ x: -24, z: 40.5 }, ...nav.route({ x: -24, z: 40.5 }, { x: 52, z: -37 })];
        let len = 0; for (let i = 1; i < route.length; i++) len += Math.hypot(route[i].x - route[i - 1].x, route[i].z - route[i - 1].z);
        const dead = nav.lanes.find((l) => l.to.out.length === 1);
        return {
          district: map.districtAt(0, 0), far: map.districtAt(5000, 0), land: map.isLand(0, 37), sea: map.isLand(0, 120),
          road: map.heightAt(0, 37), walk: map.heightAt(0, 46), surf: [map.surfaceAt(0, 37), map.surfaceAt(0, 60), map.surfaceAt(0, 120)].join(),
          depth: map.depthAt(0, 100), lanes: nav.lanes.length, eastZ: east.az, eastName: east.name, eastH: east.heading, westZ: west.az,
          next: east.next.length, nextOk: nav.lanes.every((l) => l.next.length > 0 && l.next.every((id) => nav.lane(id))), deadTurns: nav.lane(dead.next[0]).to === dead.from,
          routeLen: len, routeEnd: route[route.length - 1], viaMap: window.__game.modules.map.nearestRoad(0, 30).roadId, state: window.__game.state.world.district,
        };
      });
      t.expect(r.district, '==', 'tideline', 'districtAt(0, 0)');
      t.expect(r.far, '==', null, 'districtAt far off the map');
      t.expect(r.land && !r.sea, '==', true, 'isLand: the street is land, the sea is not');
      t.expect(r.road, '==', 0, 'heightAt on the road (m)');
      t.expect(r.walk, 'between', [0.1, 0.2], 'heightAt on the promenade kerb (m)');
      t.expect(r.surf, '==', 'road,sand,water', 'surfaceAt street, beach, sea');
      t.expect(r.depth, '>', 0.5, 'depthAt 20 m out to sea (m)');
      t.expect(r.lanes, '==', 20, 'lanes: 10 street pieces, one lane each way');
      t.expect(r.eastZ === 40.5 && r.westZ === 33.5, '==', true, 'traffic keeps right: eastbound lane on the sea side of Heron Walk Drive');
      t.expect(r.eastName, '==', 'Heron Walk Drive', 'the beachfront street\'s name');
      t.expect(r.nextOk && r.next === 2, '==', true, 'every lane leads somewhere; a T-junction offers two ways on');
      t.expect(r.deadTurns, '==', true, 'a dead end turns back');
      t.expect(r.routeLen, 'between', [140, 160], 'route from the spawn round the corner to the far end of the block (m; 150 along the street centres)');
      t.expect(r.viaMap, '==', 'heron-walk-drive', 'map.nearestRoad');
      t.expect(r.state, '==', 'tideline', 'state.world.district');
    },
  },
  {
    id: 'D2-S2.5', name: 'Save format v1, export and import',
    async run(t) {
      const r = await t.eval(() => {
        const g = window.__game, T = g.test, S = g.state;
        S.economy.cash = 18250; S.economy.followers = 12840; S.stats.bestDrift = 8420; S.found.flamingos.push(3, 17);
        const snap = T.save.snapshot(), code = T.save.export();
        S.economy.cash = 0; S.economy.followers = 0; S.stats.bestDrift = 0; S.found.flamingos.length = 0;
        let loaded = 0; g.events.once('save:loaded', () => loaded++);
        const ok = T.save.import(code);
        return { snap, code: code.slice(0, 4), ok, loaded, cash: S.economy.cash, followers: S.economy.followers, drift: S.stats.bestDrift, flamingos: S.found.flamingos.join(),
          bad: [T.save.import('nonsense'), T.save.import('BH1.!!!!'), T.save.import('BH1.' + btoa('{"v":99,"sections":{}}'))].join() };
      });
      const s = r.snap;
      t.expect(s.v, '==', 1, 'save version');
      t.expect(s.day === 2 && typeof s.savedAt === 'string' && typeof s.playSeconds === 'number', '==', true, 'day, savedAt, playSeconds');
      t.expect(Object.keys(s.sections).sort().join(), '==', 'chars,clock,economy,found,missions,property,settings,stats', 'sections');
      const flat = { ...s.sections.clock, ...s.sections.economy, ...s.sections.chars, ...s.sections.missions, ...s.sections.found, ...s.sections.stats, ...s.sections.settings, ...s.sections.property };
      for (const k of ['hour', 'weather', 'cash', 'followers', 'active', 'mags', 'teo', 'done', 'available', 'owned', 'garage', 'flamingos', 'postcards', 'bigair', 'distanceKm', 'bestDrift', 'peakViewers', 'quality', 'music', 'sfx', 'reduceMotion']) {
        t.expect(k in flat, '==', true, `save field ${k}`);
      }
      t.expect(Object.keys(s.sections.chars.mags).sort().join(), '==', 'armour,h,health,outfit,radio,weapons,x,z', 'a lead\'s fields');
      t.expect(r.code, '==', 'BH1.', 'export code prefix');
      t.expect(r.ok && r.loaded === 1, '==', true, 'import succeeds and emits save:loaded');
      t.expect(r.cash === 18250 && r.followers === 12840 && r.drift === 8420 && r.flamingos === '3,17', '==', true, 'import puts cash, followers, best drift and finds back');
      t.expect(r.bad, '==', 'false,false,false', 'bad codes and saves from the future are refused');
      // slots, and a section this build does not know passes through untouched
      const slots = await t.eval(() => {
        const g = window.__game, S = g.state;
        const fixture = g.test.save.snapshot(); fixture.sections.pets = { gerald: true }; fixture.versions.pets = 3; fixture.sections.economy.cash = 77;
        localStorage.setItem('bayhaven.save.2', JSON.stringify(fixture));
        const api = window.__game.save;
        const ok = api.load('2'); api.write('3');
        const back = JSON.parse(localStorage.getItem('bayhaven.save.3'));
        const list = api.list().map((x) => x.slot).join();
        localStorage.clear();
        return { ok, cash: S.economy.cash, pets: back.sections.pets, petsV: back.versions.pets, list, auto: api.auto() };
      });
      t.expect(slots.ok && slots.cash === 77, '==', true, 'load from slot 2');
      t.expect(slots.pets && slots.pets.gerald === true && slots.petsV === 3, '==', true, 'an unknown section is kept and written back');
      t.expect(slots.list, '==', '2,3', 'save.list()');
      t.expect(slots.auto, '==', false, 'no autosave in test mode');
      // the fixture: a real v1 save exported from this build
      const fx = JSON.parse(readFileSync('tools/fixtures/saves/v1.json', 'utf8'));
      t.expect(Object.keys(fx.sections).sort().join(), '==', Object.keys(s.sections).sort().join(), 'tools/fixtures/saves/v1.json has today\'s sections');
      const again = await t.eval((f) => { const ok = window.__game.save.apply(f); return { ok, cash: window.__game.state.economy.cash }; }, fx);
      t.expect(again.ok && again.cash === fx.sections.economy.cash, '==', true, 'the v1 fixture loads');
    },
  },
  {
    id: 'D2-S2.6', name: 'Tools: name check, changelog, build day',
    async run(t) {
      const { spawnSync } = await import('node:child_process');
      const { writeFileSync, rmSync } = await import('node:fs');
      const ok = spawnSync('node', ['tools/lint-names.mjs'], { encoding: 'utf8' });
      t.expect(ok.status, '==', 0, 'lint-names exit code on the real source');
      // a banned word must be caught: a made-up digital-money word in a scratch file
      writeFileSync('src/content/zz-lint-probe.js', '// the block' + 'chain is not in this game\n');
      const bad = spawnSync('node', ['tools/lint-names.mjs'], { encoding: 'utf8' });
      rmSync('src/content/zz-lint-probe.js');
      t.expect(bad.status, '==', 1, 'lint-names exit code with a banned word planted');
      t.expect(/zz-lint-probe\.js:1: /.test(bad.stdout), '==', true, 'the hit is printed as file:line');
      const newest = Math.max(...readdirSync('changelog').map((f) => +(f.match(/^d(\d+)/i) || [0, 0])[1]));
      const b = await t.eval(() => ({ day: window.__game.state.build.day, commit: window.__game.state.build.commit }));
      t.expect(b.day, '==', newest, 'build day comes from the newest changelog note');
      t.expect(typeof b.commit === 'string' && b.commit.length >= 3, '==', true, 'build commit');
      const log = readFileSync('CHANGELOG.md', 'utf8');
      t.expect(/^## Day 2: /m.test(log) && /^## Day 1: /m.test(log) && log.indexOf('## Day 2') < log.indexOf('## Day 1'), '==', true, 'CHANGELOG.md has a section per day, newest first');
      t.expect(log.includes('Handling with weight'), '==', true, 'CHANGELOG.md carries the notes\' shipped lists');
      const other = await t.open('&day=7');
      t.expect(await other.evaluate(() => window.__game.state.build.day), '==', 7, '?day=N still overrides the build day');
    },
  },
  {
    id: 'D2-S2.7', name: 'Debug overlay',
    async run(t) {
      const off = await t.eval(() => !!document.getElementById('debug'));
      t.expect(off, '==', false, 'no overlay without ?debug');
      const page = await t.open('&debug=1');
      await page.evaluate(() => window.__game.test.wait(0.6));
      const d = await page.evaluate(() => { const c = document.getElementById('debug'), m = window.__game.modules.debug; return { canvas: !!c && c.width > 0, text: m.text(), profile: window.__game.test.modules().some((x) => x.ms > 0) }; });
      t.expect(d.canvas, '==', true, 'overlay canvas with ?debug');
      t.expect(/calls \d+/.test(d.text) && /tris \d+/.test(d.text) && /sim \d/.test(d.text), '==', true, 'overlay shows calls, tris and sim ms: ' + d.text.slice(0, 80));
      t.expect(d.profile, '==', true, 'per-module times are measured');
    },
  },
];
