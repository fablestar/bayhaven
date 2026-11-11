// Session D3-S1 (On foot): D3.1 and D3.2 from plan/08-roadmap.md, plus one check per item built.
// Game time is run with test.advance (the same fixed step the frame loop runs); the camera and the
// rig are drawn things, so their checks wait for real frames.
import { devices } from 'playwright';

const NO_TRAFFIC = '&traffic=0';

export default [
  {
    id: 'D3.1', name: 'Exit',
    async run(t) {
      const page = await t.open(NO_TRAFFIC);
      const r = await page.evaluate(() => {
        const T = window.__game.test, d = (a, b) => Math.hypot(b.x - a.x, b.z - a.z);
        const before = T.player().mode;
        T.exit();
        let steps = 0;
        while (T.player().mode !== 'foot' && steps < 200) { T.advance(1 / 60); steps++; }
        const mode = T.player().mode, exited = T.count('vehicle:exited');
        T.advance(1.5);                                       // he is out of the door and standing
        const act = T.foot().act, a = T.player();
        T.input([{ t: 0, hold: ['gas'] }, { t: 5, hold: [] }]);
        const b = T.advance(5);
        T.advance(0.5);
        const c = T.player();
        T.input([{ t: 0, hold: ['gas', 'sprint'] }, { t: 5, hold: [] }]);
        const e = T.advance(5);
        T.advance(1);
        const ground = T.player().y;
        T.input([{ t: 0, hold: ['jump'] }, { t: 0.2, hold: [] }]);
        let peak = 0, air = 0;
        for (let i = 0; i < 90; i++) { const p = T.advance(1 / 60); peak = Math.max(peak, p.y - ground); if (!p.grounded) air++; }
        return { before, mode, seconds: steps / 60, exited, act, walked: d(a, b), sprinted: d(c, e), peak, air: air / 60, landed: T.count('player:landed'), grounded: T.player().grounded };
      });
      t.expect(r.before, '==', 'car', 'mode before test.exit()');
      t.expect(r.mode, '==', 'foot', 'mode after test.exit()');
      t.expect(r.seconds, '<=', 1.5, 'seconds until mode is foot');
      t.expect(r.exited, '==', 1, 'vehicle:exited fired');
      t.expect(r.act, '==', null, 'he has finished getting out after 1.5 s');
      t.expect(r.walked, 'between', [7, 9], 'metres moved holding forward for 5 s');
      t.expect(r.sprinted, '>=', 28, 'metres moved sprinting for 5 s');
      t.expect(r.peak, '>=', 1.0, 'jump peak (m)');
      t.expect(r.peak, '<=', 1.2, 'jump peak is the plan\'s 1.1 m, not more (m)');
      t.expect(r.landed >= 1 && r.grounded, '==', true, 'he lands again (player:landed)');
      t.note(`time in the air ${r.air.toFixed(2)} s`);
    },
  },
  {
    id: 'D3.2', name: 'Enter',
    async run(t) {
      const page = await t.open(NO_TRAFFIC);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test;
        T.exit(); T.advance(1.5);
        // walk off, then stand a parked car beside him
        T.input([{ t: 0, hold: ['gas'] }, { t: 6, hold: [] }]); T.advance(6.2);
        const far = T.foot().near, farTry = T.enter();
        const v = T.spawnVehicle('snook'), me = T.foot();
        const centre = Math.hypot(v.x - me.x, v.z - me.z), near = me.near;
        const entered0 = T.count('vehicle:entered');
        const ok = T.enter();
        let steps = 0;
        while (T.player().mode !== 'car' && steps < 300) { T.advance(1 / 60); steps++; }
        const p = T.player();
        // and it drives
        T.input([{ t: 0, hold: ['gas'] }, { t: 2, hold: [] }]);
        const q = T.advance(2);
        return { far, farTry, centre, near, ok, seconds: steps / 60, mode: p.mode, model: p.vehicle, at: Math.hypot(p.x - v.x, p.z - v.z), entered: T.count('vehicle:entered') - entered0,
          kmh: q.kmh, left: g.modules.traffic.wrecks.map((w) => w.model), reach: me.reach };
      });
      t.expect(r.far === null && r.farTry === false, '==', true, 'nothing to get into when no door is within 2.5 m (the car he left is 9 m back)');
      t.expect(r.near && r.near.d, '<=', 2.5, 'distance to the parked car\'s nearest door (m)');
      t.expect(r.reach, '==', 2.5, 'door reach (m)');
      t.expect(r.ok, '==', true, 'test.enter() starts');
      t.expect(r.mode, '==', 'car', 'mode after test.enter()');
      t.expect(r.seconds, '<=', 2, 'seconds until mode is car');
      t.expect(r.seconds, '>=', 0.8, 'getting in takes its 0.8 s (he does not teleport)');
      t.expect(r.model, '==', 'snook', 'the vehicle he is in');
      t.expect(r.at, '<=', 0.1, 'the car is where it was parked (m)');
      t.expect(r.entered, '==', 1, 'vehicle:entered fired once');
      t.expect(r.kmh, '>=', 15, 'the car he got into drives (km/h after 2 s of gas)');
      t.expect(r.left.includes('heron'), '==', true, 'the Heron he left stays parked on the street');
    },
  },
  {
    id: 'D3-S1.1', name: 'Rig: six boxes, a drawn face, poses by maths',
    async run(t) {
      const page = await t.open(NO_TRAFFIC);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, rig = g.modules.player.rig;
        const parts = []; rig.group.traverse((o) => { if (o.isMesh && o.geometry.index) parts.push(o.geometry.index.count / 6); });
        const tex = rig.group.children[0].children[0].children[0].material.map;
        const idle = T.rig({ state: 'idle' }, 1);
        const walk = [], sprint = [];
        for (let i = 0; i < 60; i++) walk.push(T.rig({ state: 'move', v: 1.6 }, 1 / 60));
        for (let i = 0; i < 60; i++) sprint.push(T.rig({ state: 'move', v: 6.8 }, 1 / 60));
        const amp = (list, k) => Math.max(...list.map((p) => Math.abs(p[k])));
        const steps = (list) => { let n = 0; for (let i = 1; i < list.length; i++) if (Math.sign(list[i].legL) !== Math.sign(list[i - 1].legL)) n++; return n; };
        const opposite = walk.every((p) => p.armL * p.legL <= 1e-6 && Math.abs(p.legL + p.legR) < 1e-6);
        return {
          parts: parts.sort((a, b) => b - a), count: rig.count(), canvas: tex.image.width + 'x' + tex.image.height, visibleInCar: rig.group.visible,
          idle, walkLeg: amp(walk, 'legL'), sprintLeg: amp(sprint, 'legL'), walkLean: walk[59].lean, sprintLean: sprint[59].lean, sprintArm: Math.min(...sprint.map((p) => p.armL)),
          sprintSteps: steps(sprint), opposite, maxLeg: Math.max(amp(sprint, 'legL'), amp(sprint, 'legR')),
          rise: T.rig({ state: 'jump', air: 0.1, vy: 3 }), drop: T.rig({ state: 'jump', air: 0.5, vy: -3 }), fall: T.rig({ state: 'fall', air: 0.8, vy: -9 }),
          sit: T.rig({ state: 'sit' }), drive: T.rig({ state: 'drive', steer: 1 }), roll: T.rig({ state: 'roll', t: 0 }, 0.25), back: T.rig({ state: 'idle' }, 0.5),
        };
      });
      t.expect(r.count.tris, '<=', 230, 'triangles in Teo with his shadow (the bible allows 19 boxes, 228, and a shadow quad)');
      t.expect(r.parts.length, '==', 9, 'meshes: head, torso, two arms, two legs, two shirt tails, and the blob shadow');
      t.expect(r.canvas, '==', '256x128', 'the face and clothes sheet is drawn on a canvas');
      t.expect(r.visibleInCar, '==', false, 'the rig is hidden while he is in the car');
      t.expect(r.idle.hips, 'between', [0.79, 0.81], 'idle: hips at 0.80 m');
      t.expect(Math.abs(r.idle.legL) + Math.abs(r.idle.legR), '<', 0.01, 'idle: legs still');
      t.expect(r.walkLeg, 'between', [0.4, 0.75], 'walk: leg swing (rad; 1.2 x swing x 1.15 at 1.6 m/s)');
      t.expect(r.sprintLeg, '>', r.walkLeg, 'sprint: legs swing wider than at a walk');
      t.expect(r.maxLeg, '<=', 1.3, 'leg swing stays inside 1.3 rad');
      t.expect(r.opposite, '==', true, 'walk: each arm swings against its own leg, and the legs against each other');
      t.expect(r.sprintLean, '>', r.walkLean + 0.1, 'sprint leans further forward than a walk');
      t.expect(r.sprintArm, '<', -0.9, 'sprint: arms pump forward (rad)');
      t.expect(r.sprintSteps, 'between', [3, 5], 'steps in one second of sprinting (about four)');
      t.expect(r.rise.armL, '<', -2, 'jump, rising: arms up');
      t.expect(r.drop.outL, '>', 0.7, 'jump, falling: arms out');
      t.expect(r.fall.armL < -2 && r.fall.face === 2, '==', true, 'fall: arms flail overhead, shocked face');
      t.expect(r.sit.hips, 'between', [0.41, 0.43], 'sit: hips at 0.42 m');
      t.expect(r.sit.legL, 'between', [-1.46, -1.44], 'sit: legs straight out like a doll (-1.45)');
      t.expect(r.drive.armL - r.drive.armR, 'between', [0.45, 0.55], 'driving: the arms follow the wheel (0.25 x steer each)');
      t.expect(r.roll.pitch, 'between', [2.5, 3.8], 'bail-out roll: half a turn after 0.25 s (rad)');
      t.expect(Math.abs(r.back.pitch) < 0.01 && r.back.state === 'idle', '==', true, 'back upright in idle after a roll');
      t.note(`Teo: ${r.count.meshes} draw calls (8 parts, shadow, night glow), ${r.count.tris} triangles; boxes per mesh ${r.parts.join(', ')}`);
    },
  },
  {
    id: 'D3-S1.2', name: 'Teo on foot: stamina, curbs, walls, the sea',
    async run(t) {
      const page = await t.open(NO_TRAFFIC);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, P = g.modules.player, cam = g.modules.camera;
        T.exit(); T.advance(1.5);
        const put = (x, z, yaw) => { P.teleport(x, z, yaw); cam.yaw = yaw; };
        const N = T.foot().numbers;
        // stamina: 12 s of sprint down the middle of the empty street, then a jog; full again 6 s after stopping
        put(-300, 37, Math.PI / 2);
        T.input([{ t: 0, hold: ['gas', 'sprint'] }, { t: 16, hold: [] }]);
        let fastT = 0, slow = 0, empty = 99;
        for (let i = 0; i < 15 * 60; i++) { const p = T.advance(1 / 60); if (p.speed > 6) fastT += 1 / 60; if (i > 13 * 60) slow = Math.max(slow, p.speed); empty = Math.min(empty, p.stamina); }
        T.advance(1.2); T.advance(6);
        const refilled = T.foot().stamina;
        // curb: from the road up onto the promenade without jumping
        put(-20, 42, 0);
        T.input([{ t: 0, hold: ['gas'] }, { t: 3, hold: [] }]); T.advance(3.2);
        const curb = { z: T.foot().z, y: T.foot().y, kerb: g.modules.map.heightAt(-20, 46), jumps: T.count('player:jumped') };
        // wall: walk at 45 degrees into the shopfront north of the street; he slides along it
        put(-30, 31, Math.PI * 0.75);
        const out = [];
        T.input([{ t: 0, hold: ['gas'] }, { t: 5, hold: [] }]);
        const track = [];
        for (let i = 0; i < 300; i++) { const p = T.advance(1 / 60); track.push([p.x, p.z]); }
        const last = track[299], mid = track[200];
        const tall = (x, z, r) => { const n = g.modules.collide.circle(x, z, r, undefined, out); let m = 0; for (let i = 0; i < n; i++) if (out[i].h > 1) m++; return m; };
        // his circle is 0.35 m: it may touch a wall, it may never sink 2 cm into one
        const inside = track.filter(([x, z]) => tall(x, z, 0.33) > 0).length, touching = track.filter(([x, z]) => tall(x, z, 0.37) > 0).length;
        // the sea: walk in from the sand
        put(40, 70, 0);
        T.input([{ t: 0, hold: ['gas', 'sprint'] }, { t: 40, hold: [] }]);
        let wadeSpeed = 0, maxDepth = 0, wadePose = '';
        for (let i = 0; i < 40 * 4; i++) { const p = T.advance(0.25); maxDepth = Math.max(maxDepth, p.depth); if (p.depth > 0.4 && p.depth < 0.8) { wadeSpeed = Math.max(wadeSpeed, p.speed); wadePose = p.pose; } }
        const sea = T.player();
        return { N, fastT, slow, empty, refilled, curb, slide: { dx: last[0] - mid[0], inside, touching }, wadeSpeed, maxDepth, wadePose, seaZ: sea.z, shore: 80, steps: T.count('player:step') };
      });
      t.expect([r.N.walk, r.N.jog, r.N.sprint, r.N.radius, r.N.step].join(), '==', '1.6,3.4,6.8,0.35,0.35', 'walk, jog, sprint (m/s), body radius, step-up height (m)');
      t.expect(r.fastT, 'between', [11.5, 12.5], 'seconds of sprint before the stamina runs out');
      t.expect(r.slow, 'between', [3.3, 3.5], 'fastest he goes from 13 to 15 s, Shift still held: a jog until he lets go (m/s)');
      t.expect(r.empty, '<=', 0.01, 'lowest stamina while Shift was held for 15 s (s)');
      t.expect(r.refilled, '>=', 11.99, 'stamina 7 s after stopping (s of 12; a full refill takes 6)');
      t.expect(r.curb.y, 'between', [r.curb.kerb - 0.01, r.curb.kerb + 0.01], 'height after walking onto the promenade (m)');
      t.expect(r.curb.z, '>', 45, 'he is past the kerb line (z)');
      t.expect(r.curb.jumps, '==', 0, 'jumps used to climb the kerb');
      t.expect(Math.abs(r.slide.dx), '>=', 1, 'metres slid along the wall in the last 1.7 s');
      t.expect(r.slide.touching, '>=', 30, 'steps of the 300 spent pressed against the wall');
      t.expect(r.slide.inside, '==', 0, 'steps where his circle sank into a wall');
      t.expect(r.wadeSpeed, 'between', [1.1, 1.25], 'wading speed with sprint held (m/s)');
      t.expect(r.wadePose, '==', 'wade', 'the pose in the water');
      t.expect(r.maxDepth, 'between', [0.85, 0.92], 'deepest he wades (m; swimming comes on day 7)');
      t.expect(r.seaZ, '>', r.shore + 10, 'he is well out past the shoreline (z)');
      t.expect(r.steps, '>', 20, 'player:step events (one a stride, with the surface under him)');
    },
  },
  {
    id: 'D3-S1.3', name: 'Bailing out at speed, and the door that has room',
    async run(t) {
      const page = await t.open(NO_TRAFFIC);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test;
        let ev = null; g.events.on('vehicle:exited', (e) => { ev = e; });
        T.teleport(-300, 40.5, Math.PI / 2);
        T.input([{ t: 0, hold: ['gas'] }, { t: 4, hold: [] }]);
        T.advance(3);
        const kmh = T.player().kmh, x0 = T.player().x;
        T.exit();
        const acts = new Set(), poses = new Set();
        let steps = 0;
        while (T.foot().act && steps < 900) { T.advance(1 / 60); steps++; const f = T.foot(); if (f.act) acts.add(f.act); poses.add(f.pose); }
        const rolled = T.foot().x - x0;
        T.advance(4);
        const carKmh = g.car.kmh, carRan = g.car.x - x0;
        return { kmh, bailed: ev && ev.bailed, speed: ev && ev.speed, acts: [...acts].join(), poses: [...poses].join(), seconds: steps / 60, rolled, carKmh, carRan, mode: T.player().mode };
      });
      t.expect(r.kmh, '>', 30, 'speed when he gets out (km/h)');
      t.expect(r.bailed, '==', true, 'vehicle:exited says he bailed');
      t.expect(r.acts, '==', 'roll,getup', 'what he does: rolls, then gets up');
      t.expect(r.rolled, 'between', [3, 25], 'metres he tumbles along the road');
      t.expect(r.seconds, 'between', [1.7, 5], 'seconds until he is on his feet');
      t.expect(r.carKmh, '<', 1, 'the empty car comes to a stop (km/h)');
      t.expect(r.carRan, '>', r.rolled, 'the car rolls on further than he does (m)');
      const s = await page.evaluate(() => {
        const g = window.__game, T = g.test;
        T.reset(); T.advance(0.2);
        // heading east with a wall close on the car's left (north): he must use the other door
        const out = []; let z = 33;
        while (z > 20 && g.modules.collide.circle(-30, z - 1.2, 0.3, undefined, out) === 0) z -= 0.1;
        T.teleport(-30, z, Math.PI / 2);
        T.exit(); T.advance(1.5);
        const f = T.foot();
        return { carZ: z, footZ: f.z, stuck: g.modules.collide.circle(f.x, f.z, 0.3, undefined, out), slow: T.count('vehicle:exited') };
      });
      t.expect(s.footZ, '>', s.carZ, 'with a wall on the driver\'s side he gets out on the other side (z south of the car)');
      t.expect(s.stuck, '==', 0, 'walls he is standing in after getting out');
    },
  },
  {
    id: 'D3-S1.4', name: 'Third-person camera: orbit, recentre, walls, hand-over',
    async run(t) {
      const page = await t.open(NO_TRAFFIC);
      const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
      const cam = () => page.evaluate(() => {
        const g = window.__game, c = g.modules.camera, p = g.test.player(), q = g.camera.position, car = g.car;
        return { yaw: c.yaw, pitch: c.pitch, mix: c.mix, target: c.target, x: q.x, y: q.y, z: q.z, dist: Math.hypot(q.x - p.x, q.z - p.z), up: q.y - p.y, px: p.x, pz: p.z, h: p.h,
          toCar: Math.hypot(q.x - car.x, q.z - car.z), inWall: g.modules.collide.blocked(q.x, q.y, q.z, 0.2), fov: g.camera.fov };
      });
      const wait = (s) => page.evaluate((sec) => window.__game.test.wait(sec), s);
      await wait(0.5);
      const inCar = await cam();
      // hand-over: the camera glides, it does not jump
      await page.evaluate(() => window.__game.test.exit());
      let worst = 0, prev = await cam(), mids = 0;
      for (let i = 0; i < 40; i++) {
        await page.evaluate(() => new Promise((r) => requestAnimationFrame(r)));
        const c = await cam();
        worst = Math.max(worst, Math.hypot(c.x - prev.x, c.y - prev.y, c.z - prev.z));
        if (c.mix > 0.05 && c.mix < 0.95) mids++;
        prev = c;
        if (c.mix >= 1) break;
      }
      await wait(1.5);
      const foot = await cam();
      t.expect(inCar.target + '>' + foot.target, '==', 'car>foot', 'camera target before and after getting out');
      t.expect(mids, '>=', 2, 'frames drawn part-way between the car camera and the foot camera');
      t.expect(worst, '<=', 3, 'biggest camera move in one frame during the hand-over (m; the two views are 4 m apart)');
      t.expect(foot.dist, 'between', [4.0, 4.7], 'on foot: metres behind him (4.5 at rest)');
      t.expect(foot.up, 'between', [1.5, 2.0], 'on foot: metres above his feet (1.7)');
      // orbit: a look input turns the camera round him, and walking follows the camera
      await page.evaluate(() => { const g = window.__game; g.modules.player.teleport(-200, 62, Math.PI / 2); g.modules.camera.yaw = Math.PI / 2; });
      await page.evaluate(() => window.__game.modules.camera.step(1 / 60, { lookX: -1.2, lookY: 0.3 }));
      await wait(0.6);
      const turned = await cam();
      t.expect(Math.abs(wrap(turned.yaw - (Math.PI / 2 + 1.2))), '<', 0.01, 'orbit: a look of 1.2 rad turns the camera 1.2 rad round him');
      t.expect(turned.pitch, 'between', [0.29, 0.31], 'orbit: the camera tilts by the look');
      t.expect(turned.dist, 'between', [3.6, 4.7], 'orbit: still at arm\'s length from him (m, on the ground plane)');
      const walk = await page.evaluate(() => { const T = window.__game.test, a = T.player(); T.input([{ t: 0, hold: ['gas'] }, { t: 2, hold: [] }]); const b = T.advance(2); return Math.atan2(b.x - a.x, b.z - a.z); });
      t.expect(Math.abs(wrap(walk - turned.yaw)), '<', 0.05, 'forward walks where the camera looks (rad apart)');
      // recentre: after 2 s of running with the view left alone, it swings round behind him
      await page.evaluate(() => { const g = window.__game; g.modules.player.teleport(-200, 62, Math.PI / 2); g.modules.camera.yaw = Math.PI / 2; g.modules.camera.step(1 / 60, { lookX: -1.4, lookY: 0 }); });
      // run along a fixed heading with the scripted driver, so the camera's own turning does not steer him
      const rec = await page.evaluate(() => {
        const g = window.__game, T = g.test, c = g.modules.camera, w = (a) => Math.atan2(Math.sin(a), Math.cos(a));
        const off = () => Math.abs(w(c.yaw - T.player().h));
        T.input((a) => { const rel = c.yaw - Math.PI / 2; a.moveY = Math.cos(rel); a.moveX = Math.sin(rel); a.sprint = true; return false; });
        T.advance(1.8); const early = off();
        T.advance(4.5); const late = off(), h = T.player().h;
        return { early, late, h };
      });
      await page.evaluate(() => window.__game.test.input([{ t: 0, hold: [] }]));
      t.expect(rec.early, '>', 1.0, 'recentre: before 2 s of running the view stays where it was put (rad off his back)');
      t.expect(rec.late, '<', 0.15, 'recentre: after it the camera is behind him again (rad off his back)');
      // walls: with his back near a shopfront the camera comes in instead of going through it
      const wall = await page.evaluate(async () => {
        const g = window.__game, T = g.test, out = [];
        let z = 33; while (z > 20 && g.modules.collide.circle(-30, z - 0.6, 0.3, undefined, out) === 0) z -= 0.1;
        g.modules.player.teleport(-30, z, 0); g.modules.camera.yaw = 0; g.modules.camera.pitch = 0;      // facing south, the wall behind him
        await T.wait(1);
        const q = g.camera.position, p = T.player();
        return { dist: Math.hypot(q.x - p.x, q.z - p.z), blocked: g.modules.collide.blocked(q.x, q.y, q.z, 0.1), wallBehind: p.z - z };
      });
      t.expect(wall.dist, '<', 2, 'a wall 1 m behind him pulls the camera in (m from him; 4.5 in the open)');
      t.expect(wall.blocked, '==', false, 'the camera is not inside the building');
      // and back to the car camera
      const back = await page.evaluate(async () => { const g = window.__game, T = g.test; g.modules.player.teleport(g.car.x, g.car.z + 2.2, 0); T.advance(0.1); const ok = T.enter(); await T.wait(3); return { ok, mode: T.player().mode, mix: g.modules.camera.mix, target: g.modules.camera.target }; });
      t.expect(back.ok && back.mode === 'car' && back.mix === 0 && back.target === 'car', '==', true, 'back in the car the chase camera has it again');
    },
  },
  {
    id: 'D3-S1.5', name: 'Mode, events and the test API',
    async run(t) {
      const page = await t.open(NO_TRAFFIC);
      const r = await page.evaluate(() => {
        const g = window.__game, T = g.test, S = g.state, log = [];
        for (const n of ['vehicle:entered', 'vehicle:exited', 'player:spawned']) g.events.on(n, (e) => log.push(n + ':' + (e.model || e.id)));
        const spawned = T.count('player:spawned'), m0 = S.player.mode, id = S.player.id;
        const api = ['exit', 'enter', 'spawnVehicle'].every((k) => typeof T[k] === 'function');
        T.exit(); T.advance(1.5);
        const m1 = S.player.mode, veh1 = S.player.vehicle, inputMode = g.modules.player.inputMode;
        // F is the one button
        g.events.emit('input:press', { name: 'interact' }); T.advance(2.5);
        const m2 = S.player.mode;
        g.events.emit('input:press', { name: 'interact' }); T.advance(1.5);
        const m3 = S.player.mode;
        // on foot, the car gets no gas from the walking keys
        const carX = g.car.x; T.input([{ t: 0, hold: ['gas'] }, { t: 2, hold: [] }]); T.advance(2.2);
        const carMoved = Math.abs(g.car.x - carX), walked = T.player().speed;
        // R (reset) puts him back in the car at the spawn
        T.reset(); T.advance(0.2);
        const m4 = S.player.mode, at = [S.player.x, S.player.z];
        // spawnVehicle in a car keeps day 2's meaning
        const sv = T.spawnVehicle('tarpon', { x: 0, z: 37, heading: 0 });
        return { spawned, m0, id, api, m1, veh1, inputMode, m2, m3, carMoved, m4, at, log, sv, veh: S.player.vehicle, saved: T.save.snapshot().sections ? 1 : 0, errors: T.errors() };
      });
      t.expect(r.api, '==', true, 'test.exit, test.enter and test.spawnVehicle exist');
      t.expect(r.spawned, '>=', 1, 'player:spawned fired at load');
      t.expect(r.id, '==', 'teo', 'the player is Teo');
      t.expect([r.m0, r.m1, r.m2, r.m3, r.m4].join(), '==', 'car,foot,car,foot,car', 'state.player.mode: start, out, F by the car, F in the car, after a reset');
      t.expect(r.veh1, '==', null, 'state.player.vehicle on foot');
      t.expect(r.inputMode, '==', 'foot', 'input mode on foot');
      t.expect(r.carMoved, '<', 0.05, 'metres the empty car moves when he walks');
      t.expect(r.log.join(' '), '==', 'vehicle:exited:heron vehicle:entered:heron vehicle:exited:heron vehicle:entered:heron vehicle:entered:tarpon', 'events in order');
      t.expect(Math.hypot(r.at[0] + 24, r.at[1] - 40.5), '<', 0.5, 'reset puts him back at the spawn (m off)');
      t.expect(r.sv && r.sv.model === 'tarpon' && r.veh === 'tarpon', '==', true, 'test.spawnVehicle in a car puts him in that model');
      t.expect(r.errors.length, '==', 0, 'errors ' + JSON.stringify(r.errors.slice(0, 3)));
    },
  },
  {
    id: 'D3-S1.6', name: 'Touch: a stick and context buttons on foot, the driving layout in a car',
    async run(t) {
      for (const [w, h] of [[844, 390], [390, 844]]) {
        const page = await t.open(NO_TRAFFIC, { ...devices['iPhone 13'], viewport: { width: w, height: h }, screen: { width: w, height: h } });
        const look = () => page.evaluate(() => {
          const shown = (el) => { const b = el.getBoundingClientRect(), s = getComputedStyle(el); return s.display !== 'none' && b.width > 0 ? { l: b.left, r: b.right, t: b.top, b: b.bottom, w: b.width, h: b.height, text: el.textContent.trim() } : null; };
          const all = (sel) => [...document.querySelectorAll(sel)].map(shown).filter(Boolean);
          const inside = (b) => b.l >= 0 && b.t >= 0 && b.r <= innerWidth && b.b <= innerHeight;
          const drive = all('#touch .btn'), foot = all('#foot-touch .fbtn'), stick = all('#foot-stick');
          const boxes = [...drive, ...foot, ...stick];
          let overlap = 0;
          for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) { const a = boxes[i], b = boxes[j]; if (a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b) overlap++; }
          return { drive: drive.length, foot: foot.map((b) => b.text).join('|'), stick: stick.length, inside: boxes.every(inside), min: Math.min(...boxes.map((b) => Math.min(b.w, b.h))), overlap,
            lower: boxes.every((b) => /^[A-Z][a-z ]*$|^[◀▶]$/.test(b.text) || b.text === '') };
        });
        const car = await look();
        t.expect(car.drive, '==', 8, `${w}x${h} in the car: the eight driving buttons`);
        t.expect(car.foot, '==', 'Get out', `${w}x${h} in the car: one context button`);
        t.expect(car.stick, '==', 0, `${w}x${h} in the car: no stick`);
        t.expect(car.inside && car.overlap === 0, '==', true, `${w}x${h} in the car: every button inside the screen, none overlapping`);
        // tap Get out with a finger
        const cdp = await page.context().newCDPSession(page);
        const tap = async (sel) => { const b = await page.locator(sel).boundingBox(); await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: b.x + b.width / 2, y: b.y + b.height / 2, id: 1 }] }); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); };
        await tap('#foot-out');
        await page.evaluate(() => window.__game.test.wait(1.5));
        const out = await page.evaluate(() => window.__game.test.player().mode);
        t.expect(out, '==', 'foot', `${w}x${h} tapping Get out gets him out`);
        const foot = await look();
        t.expect(foot.drive, '==', 0, `${w}x${h} on foot: the driving buttons are gone`);
        t.expect(foot.stick, '==', 1, `${w}x${h} on foot: the left stick`);
        t.expect(foot.foot, '==', 'Jump|Sprint|Get in', `${w}x${h} on foot: Jump, Sprint, and Get in beside the car`);
        t.expect(foot.inside && foot.overlap === 0, '==', true, `${w}x${h} on foot: everything inside the screen, nothing overlapping`);
        t.expect(foot.min, '>=', 64, `${w}x${h} smallest touch control (px)`);
        t.expect(foot.lower, '==', true, `${w}x${h} labels in sentence case`);
        // push the stick up: he walks; a full push is a jog
        const sb = await page.locator('#foot-stick').boundingBox(), cx = sb.x + sb.width / 2, cy = sb.y + sb.height / 2;
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx, y: cy, id: 2 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx, y: cy - 60, id: 2 }] });
        const moving = await page.evaluate(() => { const g = window.__game, T = g.test; const a = T.player(); const p = T.advance(2); return { speed: p.speed, moveY: g.input.moveY, d: Math.hypot(p.x - a.x, p.z - a.z) }; });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        t.expect(moving.speed, 'between', [3.3, 3.5], `${w}x${h} stick pushed all the way: a jog (m/s)`);
        // walk away: the context button goes; then back in by the button
        const gone = await page.evaluate(async () => { const T = window.__game.test; await T.wait(0.2); T.advance(3); await T.wait(0.3); return getComputedStyle(document.getElementById('foot-use')).display; });
        t.expect(gone, '==', 'none', `${w}x${h} no Get in button away from any car`);
        await page.context().close();          // a second page loads slowly while this one is still drawing
      }
    },
  },
  {
    id: 'D3-S1.7', name: 'Clip day-3',
    async run(t) {
      const page = await t.open('', { viewport: { width: 480, height: 270 } });
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, t0 = g.loop.time;
        let outAt = -1; g.events.once('vehicle:exited', (e) => { outAt = g.loop.time - t0; g.__bail = e.bailed; });
        await T.clip.play('day-3');
        const p = T.player(), f = T.foot();
        return { seconds: g.loop.time - t0, outAt, bailed: g.__bail, mode: p.mode, z: p.z, surface: f.surface, hour: g.state.clock.hour, carKmh: g.car.kmh, clipClass: document.body.classList.contains('clip'), errors: T.errors() };
      });
      t.expect(r.seconds, 'between', [11.9, 12.2], 'clip length (game seconds)');
      t.expect(r.outAt, 'between', [2.5, 5], 'he gets out at (s)');
      t.expect(r.bailed, '==', false, 'he steps out, he does not bail');
      t.expect(r.mode, '==', 'foot', 'mode at the end');
      t.expect(r.surface, '==', 'sand', 'he ends on the beach');
      t.expect(r.z, '>', 50, 'he is past the promenade (z)');
      t.expect(r.hour, 'between', [18, 19], 'golden hour');
      t.expect(r.carKmh, '<', 1, 'the car is parked (km/h)');
      t.expect(r.clipClass, '==', false, 'clip mode is off again when it ends');
      t.expect(r.errors.length, '==', 0, 'errors ' + JSON.stringify(r.errors.slice(0, 3)));
    },
  },
];
