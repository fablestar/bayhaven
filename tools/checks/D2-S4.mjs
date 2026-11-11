// Session D2-S4 (Traffic): D2.5 and D2.6 from plan/08-roadmap.md, the script checks in
// plan/bible/systems/traffic.md as far as this session built them (1 to 5), and one check per
// piece: signals, following, the spawn ring, car against car, honking, parked cars, the hours,
// lights on the cars, and what it all costs.
const SMALL = { viewport: { width: 480, height: 270 } };
const open = (t, extra = '') => t.open('&quality=' + (t.quality || 'high') + extra, SMALL);
// stand at a place and let the chunks round it load (they are built while frames are drawn)
const stand = (page, x, z, h = Math.PI / 2, seconds = 1.5) => page.evaluate(async ([px, pz, ph, s]) => {
  const T = window.__game.test; T.teleport(px, pz, ph); await T.wait(s);
}, [x, z, h, seconds]);

export default [
  {
    id: 'D2.5', name: 'Traffic', quality: ['low', 'high'],
    async run(t) {
      const page = await open(t, '&hour=12');
      await stand(page, 0, 37);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, hash = g.modules.collide, hits = [];
        let at10 = 0, most = 0, redStops = 0, inside = 0, crossed = 0;
        for (let i = 0; i < 240; i++) {
          T.advance(0.25);
          const list = T.traffic.list(), n = T.stats().cars;
          most = Math.max(most, n);
          if (i === 39) at10 = n;
          for (const v of list) {
            if (v.kind !== 'traffic' && v.kind !== 'loose') continue;
            if (v.red && v.v < 0.3 && v.state === 'stop') redStops++;
            crossed = Math.max(crossed, v.crossedRed);
            const k = hash.circle(v.x, v.z, 0.4, 0, hits);
            for (let j = 0; j < k; j++) if (hits[j].h > 1 && !String(hits[j].owner).startsWith('signal')) inside++;
          }
        }
        return { at10, most, redStops, inside, crossed, end: T.traffic.counts(), cap: g.quality.get('trafficCap'), signal: T.signals.at(0, 37) };
      });
      t.note(`after 60 s: ${r.end.moving} moving, ${r.end.parked} parked, ${r.end.calls} draw calls for all of them; nearest lights at (${r.signal.x}, ${r.signal.z}), ${Math.round(r.signal.distance)} m away`);
      t.expect(r.at10, '>=', t.quality === 'low' ? 10 : 25, 'moving cars at (0, 37) at noon after 10 s');
      t.expect(r.most, '<=', r.cap, 'most moving cars at once, against the cap');
      t.expect(r.inside, '==', 0, 'samples of a car inside a building box over 60 s');
      t.expect(r.redStops, '>=', 1, 'samples of a car stopped at a red light over 60 s');
      t.expect(r.crossed, '==', 0, 'cars that crossed a red line faster than 2 m/s');
    },
  },
  {
    id: 'D2.6', name: 'Models',
    async run(t) {
      const page = await open(t, '&traffic=0');
      for (const id of ['snook', 'tarpon', 'mullet', 'pompano', 'taxi']) {
        const r = await page.evaluate(async (model) => {
          const g = window.__game, T = g.test, info = T.vehicleInfo(model);
          // the player gets into one on Heron Walk Drive and holds the gas down for 30 s on the real road
          T.spawnVehicle(model, { x: -1300, z: 40.5, heading: Math.PI / 2 });
          await T.wait(0.3);
          T.input([{ t: 0, hold: ['gas'] }, { t: 30, hold: [] }]);
          let best = 0;
          for (let i = 0; i < 120; i++) { const p = T.advance(0.25); best = Math.max(best, p.kmh); }
          T.input([{ t: 0, hold: [] }]);
          // and one is stood at the curb as a parked car
          const placed = T.placeVehicle(model, -1300, 30, Math.PI / 2);
          return { info, best, driving: T.player().vehicle, placed, flat: T.topSpeed(60, model), t100: T.zeroToHundred(model), listed: T.traffic.list().some((v) => v.id === placed.id || true) };
        }, id);
        t.note(`${r.info.name}: ${r.info.triangles} triangles (body ${r.info.bodyTriangles}), ${r.best.toFixed(0)} km/h on the road in 30 s, ${r.flat.toFixed(1)} km/h flat out, 0 to 100 in ${r.t100.toFixed(2)} s`);
        t.expect(r.driving, '==', id, `${id}: the player is driving it`);
        t.expect(r.placed.model, '==', id, `${id}: one spawns at the curb`);
        t.expect(r.info.triangles, 'between', [300, 600], `${id}: triangles`);
        t.expect(r.best, '>=', 0.8 * r.info.top, `${id}: speed reached on the road (km/h), against 80% of ${r.info.top}`);
        t.expect(r.flat, 'between', [0.98 * r.info.top, 1.02 * r.info.top], `${id}: flat-out speed within 2% of the catalogue`);
        t.expect(r.t100, 'between', [r.info.t100 - 0.3, r.info.t100 + 0.3], `${id}: 0 to 100 km/h (s)`);
      }
      const back = await page.evaluate(() => { const T = window.__game.test; T.spawnVehicle('heron'); return { model: T.player().vehicle, top: T.topSpeed(60), z: T.zeroToHundred() }; });
      t.expect(back.model, '==', 'heron', 'back in the Heron');
      t.expect(back.top, 'between', [134, 140], 'the Heron still tops out at 137 km/h');
    },
  },
  {
    id: 'D2-S4.signals', name: 'Light cycles',
    async run(t) {
      const page = await open(t, '&hour=12');
      await stand(page, 30, 40.5);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, S = g.modules.signals, sec = { ns: { green: 0, amber: 0, red: 0 }, ew: { green: 0, amber: 0, red: 0 } };
        let bothGo = 0, first = T.signals.at(30, 40.5), same = true;
        const before = T.count('signals:phase');
        for (let i = 0; i < 1800; i++) {
          T.advance(1 / 60);
          const p = T.signals.at(30, 40.5);
          sec.ns[p.ns] += 1 / 60; sec.ew[p.ew] += 1 / 60;
          if (p.ns !== 'red' && p.ew !== 'red') bothGo++;
          if (i === 1799) same = p.ns === first.ns && p.ew === first.ew;
        }
        // what the table says for the two roads that meet here
        const RANK = { street: 0, avenue: 1, boulevard: 2 }, rank = { ns: 0, ew: 0 }, node = g.modules.nav.nodes.get(first.node);
        for (const l of node.in) rank[l.signal.axis] = Math.max(rank[l.signal.axis], RANK[l.kind]);
        const hi = Math.max(rank.ns, rank.ew), lo = Math.min(rank.ns, rank.ew), want = hi === lo ? [12, 12] : lo === 0 ? [17, 7] : [15, 9];
        return { sec, bothGo, same, node: first.node, big: first.big, want, kinds: rank, events: T.count('signals:phase') - before, count: S.count, poles: S.poles, cycle: S.cycle };
      });
      const big = r.sec[r.big], other = r.sec[r.big === 'ns' ? 'ew' : 'ns'];
      t.note(`junction ${r.node}: the big road (${r.big}) shows green ${big.green.toFixed(1)} s, amber ${big.amber.toFixed(1)} s; the other green ${other.green.toFixed(1)} s, amber ${other.amber.toFixed(1)} s; ${r.count} lit junctions on the map, ${r.poles} poles standing nearby`);
      t.expect(r.cycle, '==', 30, 'cycle length (s)');
      t.expect(r.same, '==', true, 'the lights show the same thing 30 s later');
      t.expect(big.green, 'between', [r.want[0] - 0.2, r.want[0] + 0.2], `big road green (s), the table says ${r.want[0]}`);
      t.expect(big.amber, 'between', [1.9, 2.1], 'big road amber (s)');
      t.expect(other.green, 'between', [r.want[1] - 0.2, r.want[1] + 0.2], `other road green (s), the table says ${r.want[1]}`);
      t.expect(r.bothGo, '==', 0, 'steps with both roads on green or amber');
      t.expect(r.events, '>=', 4, 'signals:phase events in one cycle');
      t.expect(r.poles, '>=', 3, 'light poles standing near the player');
    },
  },
  {
    id: 'D2-S4.follow', name: 'Following and red lines', quality: ['high'],
    async run(t) {
      const page = await open(t, '&hour=8');
      await stand(page, 52, 20, Math.PI);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, gaps = [];
        let redStops = 0, crossed = 0, overlaps = 0, turns = 0, blinkWrong = 0, braking = 0;
        const boxes = (a, b) => Math.hypot(a.x - b.x, a.z - b.z) < Math.min(a.hw, b.hw) * 1.6;      // centres closer than a car is wide
        for (let i = 0; i < 240; i++) {
          T.advance(0.25);
          const list = T.traffic.list().filter((v) => v.kind === 'traffic');
          for (const v of list) {
            if (v.state === 'follow' && v.v > 20 / 3.6 && v.gapS) gaps.push(v.gapS);
            if (v.red && v.v < 0.3) redStops++;
            crossed = Math.max(crossed, v.crossedRed);
            if (v.state === 'turn') { turns++; }
            if (v.braking) braking++;
          }
          for (let a = 0; a < list.length; a++) for (let b = a + 1; b < list.length; b++) if (boxes(list[a], list[b])) overlaps++;
        }
        gaps.sort((a, b) => a - b);
        const blinking = T.traffic.list().filter((v) => v.blink).length;
        return { median: gaps[gaps.length >> 1] || 0, n: gaps.length, redStops, crossed, overlaps, turns, braking, blinking, blinkWrong };
      });
      t.note(`${r.n} samples of a car following above 20 km/h; ${r.turns} samples in a turn; ${r.braking} with brake lights on`);
      t.expect(r.median, 'between', [1.5, 3], 'median gap of cars in follow above 20 km/h (s)');
      t.expect(r.redStops, '>=', 1, 'samples of a car stopped at a red light');
      t.expect(r.crossed, '==', 0, 'cars that crossed a red line faster than 2 m/s');
      t.expect(r.overlaps, '<=', 2, 'samples (4 a second) of two moving cars sitting on top of each other');
      t.expect(r.turns, '>=', 10, 'samples of a car turning at a junction');
      t.expect(r.braking, '>=', 10, 'samples of a traffic car with its brake lights on');
    },
  },
  {
    id: 'D2-S4.ring', name: 'Spawn ring', quality: ['low', 'high'],
    async run(t) {
      const page = await open(t, '&hour=12');
      await stand(page, 0, 37);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test;
        T.advance(20);
        const first = T.traffic.firstSeen(), before = T.stats().cars;
        T.teleport(1000, 37, Math.PI / 2);
        T.advance(2);
        const p = T.player(), far = T.traffic.list().filter((v) => v.kind === 'traffic' && Math.hypot(v.x - p.x, v.z - p.z) > 320).length;
        await T.wait(1.5);
        T.advance(15);
        return { n: first.length, min: Math.min(...first), max: Math.max(...first), before, far, after: T.stats().cars };
      });
      t.note(`${r.n} cars spawned between ${r.min.toFixed(0)} and ${r.max.toFixed(0)} m; ${r.before} before the jump, ${r.after} round the new place 17 s later`);
      t.expect(r.min, '>=', 120, 'nearest a car first appeared (m)');
      t.expect(r.max, '<=', 260, 'furthest a car first appeared (m)');
      t.expect(r.far, '==', 0, 'cars left beyond 320 m, 2 s after a 1 km jump');
      t.expect(r.after, '>=', t.quality === 'low' ? 8 : 20, 'moving cars round the new place');
    },
  },
  {
    id: 'D2-S4.crash', name: 'Car against car',
    async run(t) {
      const page = await open(t, '&traffic=0');
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, out = {};
        const ram = async (model, speed) => {
          T.traffic.clear(true);
          T.teleport(-900, 40.5, Math.PI / 2); await T.wait(0.2);
          const v = T.placeVehicle(model, -882, 40.5, Math.PI / 2), before = T.count('vehicle:crash');
          T.teleport(-900, 40.5, Math.PI / 2, speed);
          let peak = 0, kind = '';
          for (let i = 0; i < 150; i++) { T.advance(1 / 60); const o = T.traffic.list().find((c) => c.id === v.id); if (o.v > peak) { peak = o.v; } if (o.kind === 'loose') kind = 'loose'; }
          const o = T.traffic.list().find((c) => c.id === v.id), p = T.player();
          return { peak, kind, moved: o.x - v.x, crashes: T.count('vehicle:crash') - before, playerSpeed: p.speed, gapX: o.x - p.x };
        };
        out.snook = await ram('snook', 15); out.pompano = await ram('pompano', 15); out.tap = await ram('tarpon', 1.5);
        return out;
      });
      t.note(`Heron at 15 m/s into a parked Snook: the Snook leaves at ${r.snook.peak.toFixed(1)} m/s and ends ${r.snook.moved.toFixed(1)} m on; into a Pompano: ${r.pompano.peak.toFixed(1)} m/s, ${r.pompano.moved.toFixed(1)} m`);
      t.expect(r.snook.crashes, '>=', 1, 'vehicle:crash fired on the hit');
      t.expect(r.snook.kind, '==', 'loose', 'a parked car hit hard wakes into a full body');
      t.expect(r.snook.peak, '>', r.pompano.peak * 1.2, 'the light car is thrown faster than the heavy van (m/s)');
      t.expect(r.pompano.peak, '>=', 4, 'the 2,200 kg van still moves (m/s)');
      t.expect(r.snook.gapX, '>=', 3.5, 'the two cars are not left inside each other (m between centres)');
      t.expect(r.tap.kind, '==', '', 'a tap under 2 m/s leaves a parked car parked');
      t.expect(Math.abs(r.tap.moved), '<=', 0.01, 'and it has not moved (m)');
    },
  },
  {
    id: 'D2-S4.honk', name: 'Cut off', quality: ['high'],
    async run(t) {
      const page = await open(t, '&hour=12');
      await stand(page, 0, 37);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test;
        T.advance(15);
        let done = null;
        for (let tries = 0; tries < 200 && !done; tries++) {
          T.advance(0.1);
          const v = T.traffic.list().find((c) => c.kind === 'traffic' && c.state === 'cruise' && c.v > 8);
          if (!v) continue;
          // pull out across its lane, 10 m in front of its nose
          const before = T.count('traffic:honk'), d = v.hl + 10;
          T.teleport(v.x + Math.sin(v.h) * d, v.z + Math.cos(v.h) * d, v.h + Math.PI / 2);
          let swerved = false, slowest = v.v, hit = false;
          for (let i = 0; i < 120; i++) {
            T.advance(1 / 60);
            const now = T.traffic.list().find((c) => c.id === v.id);
            if (!now) break;
            if (now.state === 'swerve') swerved = true;
            if (now.kind === 'loose') hit = true;
            slowest = Math.min(slowest, now.v);
          }
          done = { was: v.v, slowest, swerved, hit, honks: T.count('traffic:honk') - before };
        }
        return done;
      });
      t.expect(!!r, '==', true, 'found a cruising car to cut off');
      if (!r) return;
      t.note(`a car doing ${(r.was * 3.6).toFixed(0)} km/h was cut off 10 m ahead: slowed to ${(r.slowest * 3.6).toFixed(0)} km/h${r.hit ? ' and still hit' : ''}`);
      t.expect(r.honks, '>=', 1, 'traffic:honk fired');
      t.expect(r.swerved, '==', true, 'the car went into swerve');
      t.expect(r.slowest, '<=', r.was * 0.6, 'and braked hard (m/s)');
    },
  },
  {
    id: 'D2-S4.parked', name: 'Parked cars', quality: ['low', 'high'],
    async run(t) {
      const page = await open(t, '&hour=12');
      await stand(page, 400, -100, 0, 2.5);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, map = g.modules.map, c = map.chunkOf(400, -100);
        T.advance(1);
        let spaces = 0, filled = 0;
        for (let i = -3; i <= 3; i++) for (let j = -1; j <= 1; j++) { const s = T.traffic.spaces(c.cx + i, c.cz + j); spaces += s.spaces; filled += s.filled; }
        const list = T.traffic.list().filter((v) => v.kind === 'parked'), models = new Set(list.map((v) => v.model));
        const again = T.traffic.spaces(c.cx, c.cz), once = T.traffic.spaces(c.cx, c.cz);
        return { spaces, filled, parked: list.length, models: models.size, same: again.filled === once.filled, moving: list.filter((v) => v.v > 0).length };
      });
      t.note(`${r.spaces} curb spaces in 21 chunks, ${r.filled} filled (${(100 * r.filled / r.spaces).toFixed(0)}%); ${r.parked} parked cars standing near the player in ${r.models} models`);
      t.expect(r.filled / r.spaces, 'between', [0.25, 0.35], 'share of curb spaces filled');
      t.expect(r.parked, 'between', [10, t.quality === 'low' ? 24 : 60], 'parked cars drawn, against the cap');
      t.expect(r.models, '>=', 3, 'models among the parked cars');
      t.expect(r.same, '==', true, 'a chunk parks the same cars every time');
    },
  },
  {
    id: 'D2-S4.hours', name: 'Rush hour and the quiet hour', quality: ['high'],
    async run(t) {
      const page = await open(t, '&hour=12');
      await stand(page, 0, 37);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, tr = g.modules.traffic, cap = g.quality.get('trafficCap');
        const want = (h) => tr.density('tideline', h);
        T.advance(15);
        const noon = T.stats().cars;
        T.setHour(3); T.advance(60);
        const night = T.stats().cars, nightTarget = T.traffic.counts().target;
        T.setHour(8); T.advance(30);
        return { cap, noon, night, nightTarget, rush: T.stats().cars, w: [want(3), want(8), want(12), want(17.5), want(9.95), want(10.05)] };
      });
      t.note(`out of 40: 03:00 ${r.w[0]}, 08:00 ${r.w[1]}, noon ${r.w[2]}, 17:30 ${r.w[3]}; cars on the road: noon ${r.noon}, 60 s into 03:00 ${r.night}, 30 s into 08:00 ${r.rush}`);
      t.expect(r.w[0] / r.w[2], '<=', 0.35, 'the quiet hour against noon');
      t.expect(r.w[1], '==', 40, '08:00 fills the cap');
      t.expect(r.w[3], '==', 40, '17:30 fills the cap');
      t.expect(Math.abs(r.w[4] - r.w[5]), '<=', 3, 'the count eases across a band edge');
      t.expect(r.night, '<=', Math.ceil(0.35 * r.noon) + 1, 'moving cars 60 s after the clock goes to 03:00');
      t.expect(r.rush, '==', r.cap, 'moving cars 30 s after the clock goes to 08:00');
    },
  },
  {
    id: 'D2-S4.cost', name: 'What traffic costs', quality: ['low', 'high'],
    async run(t) {
      const page = await open(t, '&hour=8');
      await stand(page, 0, 37);
      const lib = await import('../check-lib.mjs');
      const cal = await lib.calibrate(page);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, tr = g.modules.traffic;
        T.advance(20);
        await T.wait(0.5);
        const withCars = T.stats(), c = T.traffic.counts();
        let t0 = performance.now();
        for (let i = 0; i < 600; i++) tr.update(1 / 60, 8);
        const step = (performance.now() - t0) / 600;
        t0 = performance.now();
        for (let i = 0; i < 200; i++) tr.fleet.draw(tr.all, 0, 0, 37, i / 60, 120);
        const draw = (performance.now() - t0) / 200;
        tr.clear(true); await T.wait(0.5);
        const without = T.stats();
        return { step, draw, c, calls: withCars.calls - without.calls, tris: withCars.tris - without.tris, total: withCars.calls };
      });
      t.note(`${r.c.moving} moving and ${r.c.parked} parked cars: ${r.calls} draw calls and ${r.tris} triangles more than the empty street (${r.total} in all); one step ${r.step.toFixed(3)} ms, writing the instances ${r.draw.toFixed(3)} ms; k ${cal.k.toFixed(2)}`);
      t.expect(r.c.calls, '<=', t.quality === 'low' ? 16 : 24, 'draw calls for moving and parked cars');
      t.expect(r.calls, '<=', t.quality === 'low' ? 16 : 24, 'draw calls added to the frame');
      t.expect(r.step + r.draw, '<=', (t.quality === 'low' ? 1.5 : 1.2) * cal.k, 'traffic time a frame: one step and one draw (ms, times k)');
    },
  },
];
