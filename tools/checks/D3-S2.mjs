// Session D3-S2 (Pedestrians): D3.3, D3.4 and D3.5 from plan/08-roadmap.md, plus one check per item
// built. Game time is run with test.advance (the same fixed step the frame loop runs). The flash
// mob's dance clock runs on drawn time, so its checks call the drop's own update, as a frame does.

const NO_TRAFFIC = '&traffic=0';

export default [
  {
    id: 'D3.3', name: 'Crowd', quality: ['low', 'high'],
    async run(t) {
      const page = await t.open(`&quality=${t.quality}&hour=12`);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, frames = (n) => new Promise((res) => { const f = () => (--n <= 0 ? res() : requestAnimationFrame(f)); requestAnimationFrame(f); });
        T.teleport(0, 45, Math.PI / 2); T.advance(3);
        await frames(3);
        const s = T.peds.stats();
        T.traffic.on(false); T.traffic.clear(true); await frames(3);       // nothing else on screen that comes and goes
        for (let i = 0; i < 200 && g.modules.chunks.pending; i++) await frames(2);      // and the city has finished streaming in
        const shown = T.stats().calls;
        T.peds.show(false); await frames(2);
        const without = T.stats().calls;
        T.peds.show(true); await frames(2);
        const again = T.stats().calls, list = T.peds.list(150);
        return { s, drawn: Math.max(shown, again) - without, steady: shown === again, pending: g.modules.chunks.pending, within: list.length, kinds: Object.keys(s.byKind).length, meshes: g.scene.children.filter((o) => o.isInstancedMesh && o.geometry.attributes.aTint).length };
      });
      t.expect(r.within, '>=', t.quality === 'low' ? 15 : 40, 'people within 150 m of (0, 45) at noon');
      t.expect(r.s.count, '<=', r.s.streetCap, 'people are inside the cap for this quality');
      t.expect(r.s.calls, '<=', 8, 'draw calls for all people (meshes with anything in them)');
      t.expect(r.drawn, '<=', 8, 'draw calls the renderer loses when the people are hidden');
      t.note(`calls steady between the two shown frames: ${r.steady}, chunks still pending: ${r.pending}`);
      t.expect(r.drawn, '>=', 6, 'the people really are drawn (calls lost when hidden)');
      t.expect(r.meshes, '==', 7, 'instanced meshes sharing the people atlas: six body parts and the extras');
      t.expect(r.kinds, '>=', 3, 'kinds of people about');
      t.note(`states ${JSON.stringify(r.s.byState)}, kinds ${JSON.stringify(r.s.byKind)}, sim ${r.s.ms.toFixed(3)} ms, draw ${r.s.drawMs.toFixed(3)} ms, triangles ${r.s.triangles}`);
    },
  },
  {
    id: 'D3.4', name: 'Filming', quality: ['low', 'high'],
    async run(t) {
      const page = await t.open(`&quality=${t.quality}&hour=12` + NO_TRAFFIC);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test;
        T.teleport(-12, 40.5, Math.PI / 2); T.advance(2);
        // a small crowd can leave few people close by: stand a few on the promenade if so (and say so)
        let placed = 0;
        const close = () => T.peds.list(38).filter((p) => p.state === 'walk' || p.state === 'hang').length;
        while (close() < 5) { T.peds.spawn('tourist', -8 + placed * 4, 46 + (placed % 2), Math.PI); placed++; }
        const natural = close() - placed, before = g.state.economy.followers, filmEvents = T.count('ped:filming');
        // a real crash: a parked car 12 m ahead, hit at 30 km/h
        T.placeVehicle('snook', 14, 40.5, Math.PI / 2);
        T.teleport(-12, 40.5, Math.PI / 2, 8.4);
        const cruise = (kmh, seconds, horn = false) => { let time = 0; T.input((a, dt) => { const k = T.player().kmh; a.steer = 0; a.gas = k < kmh ? 1 : 0; a.brake = k > kmh + 4 ? 1 : 0; a.handbrake = false; a.horn = horn; a.lookBack = false; time += dt; return time > seconds; }); };
        cruise(30, 6);
        let crashAt = -1, at3 = -1, expected = 0, got = 0, peak = 0, crashSpeed = 0;
        const off = g.events.on('vehicle:crash', (d) => { crashSpeed = Math.max(crashSpeed, d.speed); });
        const scale = T.peds.stats().crowdScale;
        for (let i = 0; i < 60 * 9; i++) {
          const f0 = g.state.economy.followers;
          T.advance(1 / 60);
          const s = g.state.peds;
          if (crashAt < 0 && T.count('vehicle:crash') > 0) crashAt = i;
          if (crashAt >= 0 && at3 < 0 && s.filming >= 3) at3 = (i - crashAt) / 60;
          peak = Math.max(peak, s.filming);
          if (crashAt >= 0 && i - crashAt > 100 && i - crashAt <= 220) { expected += 5 * s.filming * scale / 60; got += g.state.economy.followers - f0; }
        }
        if (typeof off === 'function') off();
        const after = T.peds.stats();
        return { placed, natural, crashAt, at3, peak, expected, got, crashSpeed, rise: g.state.economy.followers - before, filmEvents: T.count('ped:filming') - filmEvents, after, scale,
          stillFilming: g.state.peds.filming, faces: T.peds.list(60).filter((p) => p.state === 'film').length };
      });
      t.note(`${r.natural} people were within 38 m by themselves; ${r.placed} were stood on the promenade by the check`);
      t.expect(r.crashAt, '>=', 0, 'the car crashed (vehicle:crash fired)');
      t.expect(r.crashSpeed * 3.6, 'between', [18, 40], 'crash speed (km/h)');
      t.expect(r.at3 >= 0 ? r.at3 : 99, '<=', 3, 'seconds from the crash until 3 people are filming');
      t.expect(r.peak, '>=', 3, 'most people filming at once');
      t.expect(r.rise, '>', 0, 'followers gained');
      t.expect(r.got / r.expected, 'between', [0.8, 1.2], 'followers gained over 2 s against 5 x filming x crowdScale a second');
      t.expect(r.filmEvents, '>=', 1, 'ped:filming events');
      t.expect(r.stillFilming, '==', 0, 'the phones are down again once the interest and its 2 s tail are over');
      t.note(`crowdScale ${r.scale}, followers +${r.rise}, expected in the window ${r.expected.toFixed(1)}, got ${r.got}`);
    },
  },
  {
    id: 'D3.5', name: 'Get up',
    async run(t) {
      const page = await t.open('&quality=high&hour=12' + NO_TRAFFIC);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test;
        T.peds.auto(false); T.peds.clear();
        // a tourist on the road with their back to the car, on their phone
        const who = T.peds.spawn('tourist', 20, 40.5, Math.PI / 2);
        let hit = null, gotUp = 0;
        g.events.on('ped:hit', (d) => { hit = { ...d }; });
        g.events.on('ped:gotup', () => { gotUp++; });
        T.teleport(-20, 40.5, Math.PI / 2, 11.2);
        const cruise = (kmh, seconds, horn = false) => { let time = 0; T.input((a, dt) => { const k = T.player().kmh; a.steer = 0; a.gas = k < kmh ? 1 : 0; a.brake = k > kmh + 4 ? 1 : 0; a.handbrake = false; a.horn = horn; a.lookBack = false; time += dt; return time > seconds; }); };
        cruise(40, 4.2);
        const seen = [], times = {};
        let hitAt = -1, walkAt = -1, birds = 0, maxY = 0, angry = false;
        for (let i = 0; i < 60 * 13; i++) {
          T.advance(1 / 60);
          const p = T.peds.get(who.id);
          if (!p) break;
          if (hitAt < 0 && hit) hitAt = i;
          if (seen[seen.length - 1] !== p.state) { seen.push(p.state); times[p.state] = i / 60; }
          if (p.state === 'dazed') birds++;
          if (hitAt >= 0 && walkAt < 0 && p.state === 'walk') { walkAt = (i - hitAt) / 60; angry = p.face === 3; }
        }
        const p = T.peds.get(who.id);
        return { hit, hits: T.count('ped:hit'), gotUp, hitAt, walkAt, seen, times, dazed: birds / 60, angry, moved: p ? Math.hypot(p.x - 20, p.z - 40.5) : -1, end: p && p.state, stats: T.peds.stats() };
      });
      t.expect(r.hits, '==', 1, 'ped:hit fired once');
      t.expect(r.hit ? r.hit.kmh : 0, 'between', [34, 46], 'speed of the hit (km/h; the car is held at 40)');
      t.expect(r.seen.join(' '), '==', 'hang fall dazed getup walk', 'states: knocked over, dazed, getting up, walking');
      t.expect(r.dazed, 'between', [2.9, 3.1], 'seconds lying dazed with birds round the head');
      t.expect(r.walkAt >= 0 ? r.walkAt : 99, '<=', 8, 'seconds from the hit until walking again');
      t.expect(r.angry, '==', true, 'they get up annoyed (angry face)');
      t.expect(r.gotUp, '==', 1, 'ped:gotup fired');
      t.expect(r.moved, '>=', 1.5, 'metres thrown by the hit');
      t.note(`hit at ${r.hit && r.hit.kmh.toFixed(1)} km/h, walking again ${r.walkAt.toFixed(2)} s later, thrown ${r.moved.toFixed(1)} m`);
    },
  },
  {
    id: 'D3-S2.1', name: 'Eight kinds; district and hour set the mix and the count',
    async run(t) {
      const page = await t.open('&quality=high&hour=12' + NO_TRAFFIC);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, P = T.peds;
        const kinds = P.kinds().map((k) => ({ id: k.id, walk: k.walk, flee: k.flee, courage: k.courage, films: k.films, hats: k.hats.length + k.bags.length, colours: k.shirts.length }));
        T.teleport(0, 45, Math.PI / 2); T.advance(1);
        const noon = P.stats();
        const dressed = P.list(200).filter((p) => p.hat || p.bag).length / noon.count;
        T.setHour(22); P.clear(); T.peds.fill(); T.advance(1);
        const late = P.stats();
        T.setHour(2); P.clear(); T.peds.fill(); T.advance(1);
        const night = P.stats();
        return { kinds, noon, late, night, dressed, mixNoon: P.mix('tideline', 12), mixLate: P.mix('tideline', 22), targets: [P.target('tideline', 12), P.target('tideline', 21), P.target('tideline', 2), P.target('paintworks', 21), P.target('mudcat-glades', 12)] };
      });
      t.expect(r.kinds.map((k) => k.id).join(' '), '==', 'tourist jogger retiree skater office docker clubber beachgoer', 'the eight kinds of plan/04 section 6');
      t.expect(new Set(r.kinds.map((k) => k.walk)).size, '>=', 7, 'different walking speeds');
      t.expect(r.kinds.every((k) => k.courage > 0 && k.courage <= 1 && k.flee > k.walk && k.hats > 0 && k.colours > 0), '==', true, 'every kind has a courage, a flee speed, a palette and a hat or bag');
      t.expect(r.targets.join(' '), '==', '60 40 6 60 4', 'targets: Tideline by day, evening and night, The Paintworks in the evening, Mudcat Glades');
      t.expect(r.noon.count, '==', 60, 'people in Tideline at noon on high');
      t.expect(r.late.count, '==', 40, 'people in Tideline at 22:00');
      t.expect(r.night.count, '==', 6, 'people in Tideline at 02:00');
      t.expect('beachgoer' in r.mixNoon && !('clubber' in r.mixNoon), '==', true, 'noon: beachgoers, no clubbers');
      t.expect('clubber' in r.mixLate && !('beachgoer' in r.mixLate), '==', true, '22:00: clubbers, no beachgoers');
      t.expect(r.late.byKind.beachgoer || 0, '==', 0, 'no beachgoers spawned at 22:00');
      t.expect(r.dressed, '>=', 0.4, 'share of people with a hat or a bag');
    },
  },
  {
    id: 'D3-S2.2', name: 'Sidewalks, crossings and lights',
    async run(t) {
      const page = await t.open('&quality=high&hour=12');
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, sig = g.modules.signals, map = g.modules.map;
        const at = T.signals.at(0, 0);
        T.teleport(at.x + 30, at.z + 3, Math.PI / 2); T.advance(1);
        let bad = 0, crossing = 0, signalCross = 0, jay = 0, onRoad = 0, walkers = 0, maxOff = 0;
        const crossed = new Set();
        for (let i = 0; i < 90 * 4; i++) {
          T.advance(0.25);
          for (const p of T.peds.list(150)) {
            if (p.state !== 'walk' && p.state !== 'cross') continue;
            if (p.crossing) {
              crossing++; crossed.add(p.id);
              if (p.crossing.signal) { signalCross++; if (p.jay) jay++; else if (sig.phase(p.crossing.node)[p.crossing.axis] !== 'green') bad++; }
            } else if (!p.waiting && p.v > 0) { walkers++; if (map.surfaceAt(p.x, p.z) === 'road' && p.z < 43) onRoad++; }
          }
        }
        return { at, bad, crossing, signalCross, jay, people: crossed.size, onRoad, walkers, stats: T.peds.stats() };
      });
      t.note(`lights at (${r.at.x}, ${r.at.z}); ${r.people} people crossed in 90 s, ${r.signalCross} samples on a lit crossing, ${r.jay} of them jaywalking, ${r.stats.waits} waits at a curb`);
      t.expect(r.people, '>=', 1, 'people who crossed a road in 90 s');
      t.expect(r.stats.waits, '>=', 1, 'times someone stopped at a curb to wait');
      t.expect(r.bad, '==', 0, 'samples of someone on a lit crossing against the light without the jaywalk flag');
      t.expect(r.onRoad / Math.max(1, r.walkers), '<=', 0.02, 'share of walking samples on the road away from a crossing');
    },
  },
  {
    id: 'D3-S2.3', name: 'Hanging out, dodging, the horn, running from a car on the sidewalk',
    async run(t) {
      const page = await t.open('&quality=high&hour=12' + NO_TRAFFIC);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, P = T.peds;
        const cruise = (kmh, seconds, horn = false) => { let time = 0; T.input((a, dt) => { const k = T.player().kmh; a.steer = 0; a.gas = k < kmh ? 1 : 0; a.brake = k > kmh + 4 ? 1 : 0; a.handbrake = false; a.horn = horn; a.lookBack = false; time += dt; return time > seconds; }); };
        T.teleport(0, 45, Math.PI / 2); T.advance(1);
        const subs = {}; for (const p of P.list(200)) if (p.state === 'hang') subs[p.sub] = (subs[p.sub] || 0) + 1;
        P.auto(false); P.clear();
        // 1: facing a slow car, they jump clear
        const a = P.spawn('office', 20, 40.5, -Math.PI / 2);
        T.teleport(-6, 40.5, Math.PI / 2, 5.5); cruise(22, 4);
        const hits0 = T.count('ped:hit'); T.advance(4.2);
        const one = { dodges: P.stats().dodges, hits: T.count('ped:hit') - hits0, moved: Math.abs(P.get(a.id).z - 40.5) };
        // 2: back to the car, but the horn sounds
        P.clear();
        const b = P.spawn('office', 20, 40.5, Math.PI / 2);
        T.teleport(-6, 40.5, Math.PI / 2, 5.5); cruise(22, 4, true);
        const d0 = P.stats().dodges; T.advance(4.2);
        const two = { dodges: P.stats().dodges - d0, hits: T.count('ped:hit') - hits0 };
        // 3: the horn near people walking: retirees shout, tourists look
        P.clear(); T.teleport(0, 40.5, Math.PI / 2); T.advance(0.2);
        const ret = P.spawn('retiree', 6, 46, 0, { state: 'walk' }), tou = P.spawn('tourist', -6, 46, 0, { state: 'walk' }), far = P.spawn('tourist', 30, 46, 0, { state: 'walk' });
        T.input([{ t: 0, hold: ['horn'] }, { t: 0.5, hold: [] }]); T.advance(0.4);
        const horn = { ret: P.get(ret.id).sub, tou: P.get(tou.id).sub, far: P.get(far.id).state + ':' + P.get(far.id).sub };
        // 4: a car on the promenade: tourists and beachgoers run, hands in the air
        P.clear(); T.advance(1);
        const run = [P.spawn('tourist', 20, 44.6, 0), P.spawn('beachgoer', 22, 49.6, 0), P.spawn('tourist', 80, 47, 0)];
        const fled0 = T.count('ped:fled');
        T.teleport(4, 47, Math.PI / 2, 8); cruise(30, 2.4);
        T.advance(2.6);
        const states = run.map((p) => P.get(p.id)), pose = P.pose(run[0].id);
        // 5: stand still when told to
        const frozen = P.freeze(5, 200); T.advance(1 / 60); const f1 = P.stats().frozen; T.advance(5.2); const f2 = P.stats().frozen;
        return { subs, one, two, horn, flee: states.map((s) => s.state), fleeV: states[0].v, pose, fledEvents: T.count('ped:fled') - fled0, hitsInFlee: T.count('ped:hit') - hits0 - two.hits, frozen, f1, f2 };
      });
      t.note(`hanging out at noon: ${JSON.stringify(r.subs)}`);
      t.expect(Object.keys(r.subs).length, '>=', 3, 'ways of hanging out seen at noon (sit, lean, chat, sunbathe, phone)');
      t.expect(r.subs.sunbathe || 0, '>=', 1, 'sunbathers on the sand');
      t.expect(r.one.dodges, '>=', 1, 'facing a car at about 22 km/h: they jump clear');
      t.expect(r.one.hits, '==', 0, 'and are not hit');
      t.expect(r.one.moved, '>=', 1, 'metres jumped sideways');
      t.expect(r.two.dodges, '>=', 1, 'back to the car, horn sounding: they jump clear');
      t.expect(r.two.hits, '==', 0, 'and are not hit');
      t.expect(r.horn.ret, '==', 'shout', 'horn within 15 m: a retiree shouts');
      t.expect(r.horn.tou, '==', 'look', 'horn within 15 m: a tourist looks');
      t.expect(r.horn.far, '==', 'walk:null', 'horn 30 m away: nothing');
      t.expect(r.flee.slice(0, 2).join(' '), '==', 'flee flee', 'a car on the promenade within 6 m: the tourist and the beachgoer run');
      t.expect(r.flee[2], '==', 'hang', 'someone 70 m away does not');
      t.expect(r.fleeV, '==', 4, 'a tourist runs at 4.0 m/s');
      t.expect(r.pose.armL, '<=', -2.5, 'running with hands in the air (rad)');
      t.expect(r.fledEvents, '>=', 1, 'ped:fled events');
      t.expect(r.f1 === r.frozen && r.frozen >= 3 && r.f2 === 0, '==', true, 'freeze holds everyone for 5 s, then lets go');
    },
  },
  {
    id: 'D3-S2.4', name: 'Drop: Flamingo Flash Mob', quality: ['low', 'high'],
    async run(t) {
      const page = await t.open(`&quality=${t.quality}&hour=18` + NO_TRAFFIC);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, P = T.peds, frames = (n) => new Promise((res) => { const f = () => (--n <= 0 ? res() : requestAnimationFrame(f)); requestAnimationFrame(f); });
        await frames(3);
        const mob = g.drop, formed = T.count('crowd:formed');
        T.advance(4); await frames(3);
        const s = P.stats(), dancers = P.list(400).filter((p) => p.state === 'crowd');
        const xs = dancers.map((p) => p.x), zs = dancers.map((p) => p.z);
        // one clock: every dancer is in the same pose, and the four moves come round in 8 beats
        const moves = [], poses = new Set();
        for (let i = 0; i < 8 * 60 / 104 * 30 + 2; i++) { mob.update(1 / 30); if (moves[moves.length - 1] !== mob.move) moves.push(mob.move); }
        for (const p of dancers.slice(0, 40)) { const o = P.pose(p.id); poses.add([o.armL, o.dx, o.yaw].map((v) => v.toFixed(4)).join()); }
        // walk in: the nearest shuffle aside and two film
        T.exit(); T.advance(1.5);
        g.modules.player.teleport(0, 57.6, 0); T.advance(0.1);
        for (let i = 0; i < 90; i++) { T.advance(1 / 30); mob.update(1 / 30); }
        const me = T.player(), around = P.list(3).filter((p) => p.state === 'crowd' || p.state === 'film');
        const walkIn = { filming: mob.filming, state: g.state.peds.filming, nearest: Math.min(...around.map((p) => p.d)), size: mob.size, formed: mob.formed };
        // walk away again: they go back to the dance
        g.modules.player.teleport(0, 46, 0);
        for (let i = 0; i < 240; i++) { T.advance(1 / 30); mob.update(1 / 30); }
        const back = { filming: mob.filming, dancing: P.list(400).filter((p) => p.state === 'crowd').length };
        // a car within 6 m breaks the grid
        g.modules.player.teleport(-20, 46, 0); T.advance(0.1);
        T.spawnVehicle('heron', { x: -20, z: 48.5, heading: Math.PI / 2 }); T.enter();
        for (let i = 0; i < 120 && T.player().mode !== 'car'; i++) T.advance(1 / 30);
        T.teleport(0, 44, 0, 5);
        let time = 0; T.input((a, dt) => { const k = T.player().kmh; a.steer = 0; a.gas = k < 20 ? 1 : 0; a.brake = 0; a.handbrake = false; a.horn = false; a.lookBack = false; time += dt; return time > 2.5; });
        let brokeAt = -1;
        for (let i = 0; i < 90; i++) { T.advance(1 / 30); mob.update(1 / 30); if (brokeAt < 0 && mob.broken) brokeAt = 56.8 - T.player().z; }
        const after = P.stats();
        mob.update(1 / 30);
        return { id: g.modules.drops.id, formed, s, count: dancers.length, w: Math.max(...xs) - Math.min(...xs), d: Math.max(...zs) - Math.min(...zs), cx: (Math.max(...xs) + Math.min(...xs)) / 2, cz: (Math.max(...zs) + Math.min(...zs)) / 2,
          brokeAt, moves, poses: poses.size, walkIn, back, mode: T.player().mode, scattered: T.count('crowd:scattered'), after, broken: mob.broken, label: document.body.innerText.includes('Flamingo Flash Mob') };
      });
      t.expect(r.id, '==', 'flamingo-flash-mob', 'the drop that runs on the day 3 build');
      t.expect(r.formed, '==', 1, 'crowd:formed fired');
      t.expect(r.count, '==', 150, 'dancers');
      t.expect(r.w, 'between', [22.3, 22.5], 'the grid is 15 wide at 1.6 m (m)');
      t.expect(r.d, 'between', [14.3, 14.5], 'and 10 deep (m)');
      t.expect(Math.hypot(r.cx, r.cz - 64), '<=', 0.5, 'centred on (0, 64) (m off)');
      t.expect(r.s.calls, '<=', 8, 'draw calls for the mob and the street together');
      t.expect(r.s.street, '<=', t.quality === 'low' ? 8 : 20, 'street people while the mob is within 150 m');
      t.expect(r.s.count, '<=', r.s.cap, 'everyone fits the instance capacity');
      t.expect(r.moves.slice(0, 5).join(', '), '==', 'arms up, step left, step right, spin, arms up', 'the four moves, two beats each, then round again');
      t.expect(r.poses, '==', 1, 'different poses among 40 dancers at one moment (one clock)');
      t.expect(r.walkIn.filming, '==', 2, 'dancers who stop and film when he walks in');
      t.expect(r.walkIn.state, '>=', 2, 'state.peds.filming while he is among them');
      t.expect(r.walkIn.nearest, '>=', 1.2, 'the nearest people have shuffled aside (m from him; they stood 0.8 m away)');
      t.expect(r.back.dancing, '==', 150, 'dancing again after he leaves');
      t.expect(r.mode, '==', 'car', 'he is back in a car for the last part');
      t.expect(r.brokeAt, 'between', [3.5, 6.5], 'metres between the car and the front row when the grid broke');
      t.expect(r.scattered, '==', 1, 'crowd:scattered fired when the car came within 6 m');
      t.expect(r.after.byState.crowd || 0, '==', 0, 'nobody is still dancing');
      t.expect((r.after.byState.flee || 0) + (r.after.byState.fall || 0), '>=', 120, 'dancers running (or knocked over)');
      t.expect(r.broken, '==', true, 'the grid stays broken');
      t.expect(r.label, '==', true, 'the drop is named on the screen');
      t.note(`sim ${r.s.ms.toFixed(3)} ms, draw ${r.s.drawMs.toFixed(3)} ms with ${r.s.count} people; triangles ${r.s.triangles}`);
    },
  },
  {
    id: 'D3-S2.5', name: 'The mob is for sunset on the day 3 build only',
    async run(t) {
      const noon = await t.open('&quality=low&hour=12' + NO_TRAFFIC);
      const a = await noon.evaluate(async () => { const g = window.__game, T = g.test; await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); T.advance(1);
        return { id: g.modules.drops.id, formed: g.drop.formed, crowd: T.peds.stats().byState.crowd || 0, people: T.peds.stats().count }; });
      await noon.context().close();
      const day4 = await t.open('&quality=low&hour=18&day=4' + NO_TRAFFIC);
      const b = await day4.evaluate(async () => { const g = window.__game, T = g.test; await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); T.advance(1);
        return { id: g.modules.drops.id, crowd: T.peds.stats().byState.crowd || 0, people: T.peds.stats().count }; });
      await day4.context().close();
      const day2 = await t.open('&quality=low&hour=18&day=2' + NO_TRAFFIC);
      const c = await day2.evaluate(() => ({ disabled: !!window.__game.modules.peds.disabled, count: window.__game.test.stats().peds }));
      t.expect(a.id === 'flamingo-flash-mob' && a.formed === false && a.crowd === 0, '==', true, 'day 3 at noon: the drop is there but nobody is dancing');
      t.expect(a.people, '>=', 15, 'day 3 at noon: ordinary people are about');
      t.expect(b.id === null && b.crowd === 0, '==', true, 'a day 4 build at sunset: no flash mob');
      t.expect(b.people, '>=', 10, 'a day 4 build still has its street people');
      t.expect(c.disabled && c.count === 0, '==', true, 'a day 2 build has no people at all (they arrive on day 3)');
    },
  },
];
