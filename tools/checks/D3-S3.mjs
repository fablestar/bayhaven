// Session D3-S3 (Garage): D3.6 from plan/08-roadmap.md, plus one check per item built.
// Game time is run with test.advance (the same fixed step the frame loop runs).

const NO_TRAFFIC = '&traffic=0';
const ALL = ['heron', 'snook', 'tarpon', 'mullet', 'pompano', 'wahoo', 'sailfin', 'grouper', 'manatee', 'pinfish', 'needlefish', 'birdie', 'flounder'];
const NEW = ALL.slice(5);
const TOP = { heron: 137, snook: 125, tarpon: 140, mullet: 130, pompano: 120, wahoo: 170, sailfin: 190, grouper: 150, manatee: 95, pinfish: 85, needlefish: 200, birdie: 38, flounder: 120 };
const T100 = { wahoo: 5.5, sailfin: 4.5, grouper: 8.5, needlefish: 3.5, flounder: 10 };      // the others top out under 100 km/h
const ROAD = { x: -1300, z: 40.5, heading: Math.PI / 2 };      // Heron Walk Drive, a long straight

export default [
  {
    id: 'D3.6', name: 'Vehicles',
    async run(t) {
      const page = await t.open('&hour=12' + NO_TRAFFIC);
      for (const id of ALL) {
        const r = await page.evaluate(async ([model, at]) => {
          const T = window.__game.test;
          T.spawnVehicle(model, at);
          await T.wait(0.2);
          T.input([{ t: 0, hold: ['gas'] }, { t: 40, hold: [] }]);
          let best = 0;
          for (let i = 0; i < 140; i++) { const p = T.advance(0.25); best = Math.max(best, p.kmh); }
          // then steer: slow to a town speed and hold left
          T.input([{ t: 0, hold: [] }]); T.spawnVehicle(model, at); T.teleport(at.x, at.z, at.heading, 9);
          T.input([{ t: 0, hold: ['gas', 'left'] }, { t: 1.2, hold: [] }]);
          let lean = 0;
          for (let i = 0; i < 12; i++) { T.advance(0.1); lean = Math.max(lean, Math.abs(T.ride().lean || 0)); }
          T.input([{ t: 0, hold: [] }]);
          return { best, lean, driving: T.player().vehicle, v: T.ride(), info: T.vehicleInfo(model), flat: T.topSpeed(90, model), t100: T.zeroToHundred(model), errors: T.errors().length };
        }, [id, ROAD]);
        t.expect(r.driving, '==', id, `${id}: the player is in it`);
        t.expect(r.best, '>=', 0.8 * TOP[id], `${id}: km/h reached on the road in 35 s (listed ${TOP[id]})`);
        t.expect(r.flat, 'between', [TOP[id] * 0.97, TOP[id] * 1.02], `${id}: flat out on an empty road`);
        if (T100[id]) t.expect(r.t100, 'between', [T100[id] - 0.3, T100[id] + 0.3], `${id}: 0 to 100 km/h`);
        if (r.v.two) t.expect(r.lean, 'between', [0.05, 0.75], `${id}: lean while steering at about 30 km/h (rad)`);
        else t.expect(r.lean, '==', 0, `${id}: four wheels do not lean`);
        t.expect(r.info.triangles, 'between', [300, 600], `${id}: triangles`);
        t.expect(r.errors, '==', 0, `${id}: errors`);
        t.note(`${r.info.name}: ${r.best.toFixed(0)} km/h on the road, ${r.flat.toFixed(1)} flat out, 0 to 100 in ${r.t100.toFixed(1)} s, ${r.info.triangles} triangles, ${r.info.wheels} wheels, lean ${r.lean.toFixed(2)}`);
      }
    },
  },
  {
    id: 'S3.two', name: 'Two wheels: lean and the rider thrown',
    async run(t) {
      const page = await t.open('&hour=12' + NO_TRAFFIC);
      const r = await page.evaluate(async (at) => {
        const g = window.__game, T = g.test, out = {};
        for (const model of ['pinfish', 'needlefish']) {
          T.spawnVehicle(model, at); T.teleport(at.x, at.z, at.heading, 11.1);
          T.input([{ t: 0, hold: ['gas', 'left'] }, { t: 1, hold: [] }]);
          T.advance(0.8);
          const left = T.ride().lean, w = T.ride().w;
          T.input([{ t: 0, hold: [] }]);
          // into the wall of a building at 60 km/h: find one by driving north off the road
          const before = T.count('rider:thrown');
          // a long wall on the north side of day 1's street, met square on at 60 km/h
          T.teleport(0, 37, Math.PI, 0); T.advance(0.1);
          const wall = g.modules.world.colliders.find((c) => c.z1 > 22 && c.z1 < 31 && c.x1 - c.x0 > 10 && c.x0 > -40 && c.x1 < 40), wz = wall ? wall.z1 : 0;
          out.wall = !!wall;
          T.teleport(wall ? (wall.x0 + wall.x1) / 2 : 0, wz + 8, Math.PI, 16.7); T.advance(0.05);
          const riding = !T.ride().thrown;
          T.input([{ t: 0, hold: ['gas'] }, { t: 1, hold: [] }]);
          T.advance(0.7);
          const v = T.ride(), thrown = T.count('rider:thrown') - before;
          T.advance(2);
          out[model] = { left, w, thrown, riding, wall: out.wall, wz, z: g.modules.vehicles.player.z, near: g.modules.world.colliders.length, wasThrown: v.thrown, back: !T.ride().thrown, kmhAfter: T.ride().kmh };
          T.input([{ t: 0, hold: [] }]);
        }
        return out;
      }, ROAD);
      for (const id of ['pinfish', 'needlefish']) {
        const o = r[id];
        t.expect(o.left, 'between', [0.05, 0.75], `${id}: lean at 40 km/h with left held, positive to the left`);
        t.expect(o.w, '>', 0, `${id}: it is turning left`);
        t.note(`${id}: wall ${o.wall} at z ${o.wz.toFixed(1)}, bike at z ${o.z.toFixed(1)}, ${o.near} boxes near, ${o.kmhAfter.toFixed(0)} km/h after`);
        t.expect(o.riding, '==', true, `${id}: still riding after being put on the road at 60 km/h`);
        t.expect(o.thrown, '==', 1, `${id}: rider:thrown fired by a 60 km/h wall hit`);
        t.expect(o.wasThrown, '==', true, `${id}: the rider is off right after the hit`);
        t.expect(o.back, '==', true, `${id}: back on 2 s later`);
      }
    },
  },
  {
    id: 'S3.hop', name: 'The hop, the cart and the bus',
    async run(t) {
      const page = await t.open('&hour=12' + NO_TRAFFIC);
      const r = await page.evaluate(async (at) => {
        const g = window.__game, T = g.test, out = {};
        T.spawnVehicle('flounder', at); await T.wait(0.2);
        T.input([{ t: 0, hold: ['sprint'] }, { t: 0.1, hold: [] }]);
        let peak = 0, air = 0;
        for (let i = 0; i < 60; i++) { T.advance(1 / 60); const l = T.ride().lift; peak = Math.max(peak, l); if (l > 0) air += 1 / 60; }
        out.hop = { peak, air, hops: T.ride().hops, events: T.count('vehicle:hop') };
        // a car that cannot hop stays down
        T.spawnVehicle('tarpon', at); T.input([{ t: 0, hold: ['sprint'] }, { t: 0.1, hold: [] }]);
        let other = 0; for (let i = 0; i < 30; i++) { T.advance(1 / 60); other = Math.max(other, T.ride().lift); }
        out.noHop = other;
        const M = g.modules.vehicles.models;
        out.birdie = { hw: M.birdie.hw, top: M.birdie.vTop * 3.6, sidewalk: M.birdie.sidewalk, quiet: M.birdie.quiet, level: T.engineTone('birdie', 1, 1, 0).level, gain: T.engineTone('birdie', 1, 1, 0).gain, heron: T.engineTone('heron', 1, 1, 3).gain };
        // the bus against a car standing in the road, at walking pace and at 30 km/h; then a Snook does the same
        const push = (model, speed) => {
          T.traffic.clear(true);
          T.spawnVehicle(model, at); T.teleport(at.x, at.z, at.heading, speed);
          const hl = M[model].hl, car = g.modules.vehicles.spawn('tarpon', at.x + hl + 6, at.z, 0);
          const x0 = car.x;
          T.input([{ t: 0, hold: ['gas'] }, { t: 3, hold: [] }]);
          T.advance(3);
          const me = T.ride();
          T.input([{ t: 0, hold: [] }]);
          return { moved: Math.hypot(car.x - x0, car.z - at.z), kind: car.kind, kmh: me.kmh };
        };
        out.busSlow = push('manatee', 1.2); out.bus = push('manatee', 8.3); out.snook = push('snook', 1.2);
        return out;
      }, ROAD);
      t.expect(r.hop.peak, 'between', [0.4, 0.6], 'Flounder: height of a hop (m)');
      t.expect(r.hop.air, 'between', [0.35, 0.6], 'Flounder: time in the air (s)');
      t.expect(r.hop.events, '==', 1, 'vehicle:hop fired once for one tap');
      t.expect(r.noHop, '==', 0, 'a Tarpon does not hop');
      t.expect(r.birdie.hw * 2, '<=', 1.2, 'Birdie: width (m), narrow enough for a sidewalk');
      t.expect(r.birdie.sidewalk && r.birdie.quiet, '==', true, 'Birdie: marked for sidewalks and quiet');
      t.expect(r.birdie.gain / r.birdie.heron, '<=', 0.45, 'Birdie: engine level against the Heron flat out');
      t.expect(r.busSlow.moved, '>=', 2, 'Manatee at walking pace: metres it pushed a standing Tarpon in 3 s');
      t.expect(r.bus.moved, '>=', 6, 'Manatee at 30 km/h: metres it pushed a standing Tarpon in 3 s');
      t.expect(r.bus.kmh, '>=', 20, 'Manatee: km/h it still has after the shove');
      t.expect(r.snook.moved, '<', r.busSlow.moved, 'a Snook at the same pace moves it less than the bus');
      t.note(`hop ${r.hop.peak.toFixed(2)} m, ${r.hop.air.toFixed(2)} s; bus pushed ${r.busSlow.moved.toFixed(1)} m slow and ${r.bus.moved.toFixed(1)} m at speed, Snook ${r.snook.moved.toFixed(1)} m`);
    },
  },
  {
    id: 'S3.sound', name: 'Engines and horns by class',
    async run(t) {
      const page = await t.open('&hour=12' + NO_TRAFFIC);
      const r = await page.evaluate(async (ids) => {
        const T = window.__game.test, out = {};
        for (const id of ids) out[id] = { idle: T.engineTone(id, 0, 0, 0), top: T.engineTone(id, 1, 1, 3) };
        T.spawnVehicle('pinfish', { x: -1300, z: 40.5, heading: Math.PI / 2 });
        await T.wait(0.3);
        out.playing = T.carvoice();
        return out;
      }, ALL);
      const semis = (h) => Math.round(12 * Math.log2(h[1] / h[0]));
      const want = { wahoo: [34, 200, 5], sailfin: [60, 320, 5], grouper: [36, 155, 7], manatee: [20, 85, 12], pinfish: [90, 360, 2], needlefish: [110, 620, 2], birdie: [200, 520, 1], flounder: [32, 130, 4] };
      for (const id of NEW) {
        const o = r[id], w = want[id];
        t.expect(o.idle.f, 'between', [w[0] - 0.5, w[0] + 0.5], `${id}: idle pitch (Hz)`);
        t.expect(o.top.f, 'between', [w[1], w[1] * 1.07], `${id}: pitch at the top of fourth, gas down (Hz)`);
        t.expect(semis(o.idle.horn), '==', w[2], `${id}: horn interval in semitones (${o.idle.interval})`);
      }
      const mixes = new Set(ALL.map((id) => r[id].idle.id));
      t.expect(mixes.size, '>=', 10, 'different engine recipes across the 13 models');
      t.expect(r.manatee.idle.wave[2], '==', 'sine', 'the bus has a sub');
      t.expect(r.pinfish.idle.wave[0], '==', 'square', 'the scooter buzzes on a square wave');
      t.expect(r.birdie.idle.wave[0], '==', 'triangle', 'the cart whines on a triangle wave');
      t.expect(r.playing.id, '==', 'engine-scooter', 'the voice follows the model being driven');
      t.expect(r.playing.playing, '==', true, 'and is switched on for it');
    },
  },
  {
    id: 'S3.theft', name: 'Taking a car from traffic',
    async run(t) {
      const page = await t.open('&hour=12&quality=high');
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, m = g.modules;
        let crime = null; g.events.on('crime', (c) => { crime = c; });
        T.teleport(-300, 40.5, Math.PI / 2); T.advance(20);
        T.exit(); T.advance(1.5);
        // stand in the road in front of the nearest moving car and wait for its driver to stop for him
        let got = null, tries = 0, stopped = false, entered = false;
        const pedsBefore = T.peds ? T.peds.stats().count : 0;
        for (; tries < 40 && !entered; tries++) {
          const cars = m.traffic.cars.filter((c) => Math.hypot(c.x - m.player.me.x, c.z - m.player.me.z) < 260 && c.vf > 2);
          if (!cars.length) { T.advance(2); continue; }
          cars.sort((a, b) => Math.hypot(a.x - m.player.me.x, a.z - m.player.me.z) - Math.hypot(b.x - m.player.me.x, b.z - m.player.me.z));
          const c = cars[0], k = c.hl + 9;
          m.player.teleport(c.x + Math.sin(c.h) * k, c.z + Math.cos(c.h) * k, c.h + Math.PI);
          for (let i = 0; i < 50 && Math.abs(c.vf) > 0.5; i++) T.advance(0.1);
          if (Math.abs(c.vf) > 0.5 || c.kind !== 'traffic') continue;
          stopped = true;
          // walk round to a door and get in
          const side = c.hw + 1.0;
          m.player.teleport(c.x + Math.cos(c.h) * side, c.z - Math.sin(c.h) * side, c.h);
          T.advance(0.1);
          got = { model: c.model, v: Math.abs(c.vf), id: c.id };
          if (!T.enter()) continue;
          for (let i = 0; i < 30 && m.player.mode !== 'car'; i++) T.advance(0.1);
          entered = m.player.mode === 'car';
        }
        const th = T.cartheft();
        const driver = th.last && th.last.driver != null && T.peds ? T.peds.get(th.last.driver) : null;
        const d0 = driver ? { x: driver.x, z: driver.z } : null;
        T.advance(4);
        const d1 = th.last && th.last.driver != null && T.peds ? T.peds.get(th.last.driver) : null;
        return { tries, stopped, entered, got, th, crime, in: T.player().vehicle, walked: d0 && d1 ? Math.hypot(d1.x - d0.x, d1.z - d0.z) : -1, state: d1 ? d1.state : null,
          toasts: T.count('ui:toast'), subtitleAfter: T.cartheft().subtitle, errors: T.errors() };
      });
      t.expect(r.stopped, '==', true, 'a driver stopped for Teo standing in the road');
      t.expect(r.entered, '==', true, 'he got into the stopped car');
      t.expect(r.in, '==', r.got && r.got.model, 'the player is driving the model he took');
      t.expect(r.th.count, '==', 1, 'thefts counted');
      t.expect(!!(r.crime && r.crime.kind === 'cartheft' && typeof r.crime.seen === 'boolean'), '==', true, "crime { kind: 'cartheft', seen } fired");
      t.expect((r.th.last && r.th.last.text || '').length, '>=', 8, 'the driver said a line');
      t.expect(r.th.subtitle.startsWith('Driver: '), '==', true, 'the line was on screen as a subtitle');
      t.expect(r.subtitleAfter, '==', '', 'and is gone 4 s later');
      t.expect(r.walked, '>=', 1, 'metres the driver walked in the next 4 s');
      t.expect(r.errors.length, '==', 0, 'errors');
      t.note(`took a ${r.got && r.got.model} on try ${r.tries}; "${r.th.last && r.th.last.text}"; seen ${r.crime && r.crime.seen} by ${r.crime && r.crime.witnesses}; driver ${r.state}, walked ${r.walked.toFixed(1)} m`);
    },
  },
  {
    id: 'S3.mix', name: 'District traffic mixes',
    async run(t) {
      const page = await t.open('&hour=12&quality=high');
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, seen = {};
        const zone = g.modules.map.zone('tideline');
        // drive up and down the beach road for a while and count what turns up
        for (let lap = 0; lap < 12; lap++) {
          T.teleport(-600 + lap * 110, 40.5, Math.PI / 2); T.advance(12);
          for (const c of g.modules.traffic.cars) seen[c.id] = c.model;
        }
        const n = {}; for (const id in seen) n[seen[id]] = (n[seen[id]] || 0) + 1;
        const stuck = T.traffic.list().filter((c) => c.kind === 'traffic' && c.wait > 25).length;
        return { zoneRow: zone.traffic, n, total: Object.keys(seen).length, tideline: T.traffic.mix('tideline'), meridian: T.traffic.mix('meridian'), greens: T.traffic.mix('mallard-greens'), palma: T.traffic.mix('palma-vieja'),
          night: T.traffic.mix('paintworks', 23), stuck, counts: T.traffic.counts(), errors: T.errors().length };
      });
      t.expect(r.tideline.pinfish, '==', r.zoneRow.pinfish, 'Tideline: the scooter weight is the zone file\'s own');
      t.expect(r.tideline.pinfish, '>=', 3, 'Tideline: scooters in the mix');
      t.expect(r.meridian.manatee, '>=', 1, 'Meridian: buses in the mix');
      t.expect(r.meridian.pinfish, '==', 0, 'Meridian: no scooters');
      t.expect(r.greens.birdie, '>=', 4, 'Mallard Greens: golf carts');
      t.expect(r.palma.flounder, '>=', 3, 'Palma Vieja: lowriders');
      t.expect(r.night.wahoo, '>=', 2, 'The Paintworks at night: muscle cars');
      t.expect(r.total, '>=', 30, 'cars seen along the beach road');
      t.expect((r.n.pinfish || 0) / r.total, '>=', 0.08, 'share of them that were scooters');
      t.expect(Object.keys(r.n).length, '>=', 5, 'different models seen');
      t.expect(r.errors, '==', 0, 'errors');
      t.note(`seen on the beach road: ${JSON.stringify(r.n)}; ${r.stuck} waiting over 25 s; fleet ${r.counts.calls} draw calls, ${r.counts.instances} cars`);
    },
  },
  {
    id: 'S3.lights', name: 'Lights on every model',
    async run(t) {
      const page = await t.open('&hour=22' + NO_TRAFFIC);
      const r = await page.evaluate(async ([ids, at]) => {
        const g = window.__game, T = g.test, out = {};
        const frames = (n) => new Promise((res) => { const f = () => (--n <= 0 ? res() : requestAnimationFrame(f)); requestAnimationFrame(f); });
        for (const id of ids) {
          T.spawnVehicle(id, at); T.teleport(at.x, at.z, at.heading, 6);
          T.input([{ t: 0, hold: ['gas', 'left'] }, { t: 0.6, hold: ['brake'] }, { t: 1, hold: [] }]);
          T.advance(0.5); await frames(2);
          const body = g.modules.vehicles.player.group.children[0];
          const unlit = body.children.filter((m) => m.isMesh && m.material.isMeshBasicMaterial);
          const blink = T.ride().blink;
          T.teleport(at.x, at.z, at.heading, 9); T.input([{ t: 0, hold: ['brake'] }, { t: 0.5, hold: [] }]);
          T.advance(0.15); await frames(2);
          const tail = unlit[1].material.color;
          out[id] = { unlit: unlit.length, quads: unlit.map((m) => m.geometry.attributes.position.count), blink, brake: tail.r, info: T.vehicleInfo(id).lights };
          T.input([{ t: 0, hold: [] }]);
        }
        return out;
      }, [ALL, ROAD]);
      for (const id of ALL) {
        const o = r[id];
        t.expect(o.unlit, '==', 3, `${id}: separate unlit light meshes on the player's build (head, tail, indicators)`);
        t.expect(o.blink, '==', 1, `${id}: the left indicators are on while turning left`);
        t.expect(o.brake, '>=', 1.5, `${id}: the tail strip brightens under braking`);
      }
      t.expect(r.pinfish.info.head, '==', 1, 'a scooter has one headlight');
      t.expect(r.manatee.info.head, '==', 2, 'a bus has two');
    },
  },
];
