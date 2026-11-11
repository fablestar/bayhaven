// Day 1, as checks: the block, the car, the sky, and day 1's numbers (about 22 draw calls,
// 19 to 24 through the day, and about 56,000 triangles). Opened with ?day=1 so no later drop is built.
// Day 2 added knock-over props and effects that day 1 did not draw, so draw calls are counted
// twice: the whole frame, and the frame without those (day 1's own scene).

const DAY1 = { calls: [19, 24], tris: 56000 };

async function numbers(page) {
  return page.evaluate(async () => {
    const g = window.__game, T = g.test;
    const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await frames();
    const all = T.stats(), hidden = [];
    g.scene.traverse((o) => { if (o.visible && (o.isInstancedMesh || (o.isMesh && o.frustumCulled === false))) { hidden.push(o); o.visible = false; } });
    await frames();
    const own = T.stats();
    for (const o of hidden) o.visible = true;
    return { calls: all.calls, tris: all.tris, ownCalls: own.calls, ownTris: own.tris, night: g.modules.sky.night, world: g.modules.world.triangles };
  });
}

export default [
  {
    id: 'D1.1', name: 'Day 1 numbers',
    async run(t) {
      const day = await numbers(await t.open('&day=1'));
      const night = await numbers(await t.open('&day=1&hour=22.5'));
      t.note(`afternoon: ${day.calls} draw calls and ${day.tris} triangles in the frame, ${day.ownCalls} calls without day 2's props and effects`);
      t.note(`night: ${night.calls} draw calls and ${night.tris} triangles in the frame, ${night.ownCalls} calls without day 2's props and effects`);
      t.expect(day.ownCalls, 'between', [DAY1.calls[0] * 0.9, DAY1.calls[1] * 1.1], 'draw calls of day 1\'s scene, afternoon (day 1: 19 to 24)');
      t.expect(night.ownCalls, 'between', [DAY1.calls[0] * 0.9, DAY1.calls[1] * 1.1], 'draw calls of day 1\'s scene, night (day 1: 19 to 24)');
      t.expect(day.tris, 'between', [DAY1.tris * 0.9, DAY1.tris * 1.1], 'triangles on screen at the spawn, afternoon (day 1: about 56,000)');
      t.expect(night.tris, 'between', [DAY1.tris * 0.9, DAY1.tris * 1.1], 'triangles on screen at the spawn, night (day 1: about 56,000)');
      t.expect(day.calls, '<=', 150, 'whole frame inside the phone budget (draw calls)');
      t.expect(day.night, '==', 0, 'no night at 14:00');
      t.expect(night.night, '>', 0.9, 'night at 22:30');
      t.expect(night.calls, '>', day.calls, 'the city switches lights on at night (more draw calls)');
    },
  },
  {
    id: 'D1.2', name: 'The car drives and bumps into walls',
    async run(t) {
      const page = await t.open('&day=1');
      const r = await page.evaluate(() => {
        const T = window.__game.test, a = T.player();
        T.input([{ t: 0, hold: ['gas'] }, { t: 3, hold: [] }]);
        const b = T.advance(3);
        // straight at a building on the north side of the beachfront street
        const wall = window.__game.modules.world.colliders.find((c) => c.z1 > 22 && c.z1 < 31 && c.x1 - c.x0 > 10 && c.x0 > -40 && c.x1 < 40);
        T.teleport((wall.x0 + wall.x1) / 2, 37, Math.PI, 0);
        T.input([{ t: 0, hold: ['gas'] }, { t: 4, hold: [] }]);
        const c = T.advance(4);
        // and into the sea: the car slows in the water and stops at the edge of today's map
        T.teleport(0, 60, 0, 0);
        T.input([{ t: 0, hold: ['gas'] }, { t: 8, hold: [] }]);
        const d = T.advance(8);
        return { start: [a.x, a.z, a.h], moved: b.x - a.x, kmh: b.kmh, wallZ: c.z, wallKmh: c.kmh, crashes: T.count('vehicle:crash'), seaZ: d.z, bound: window.__game.modules.world.bounds.z1, wall: wall.z1 };
      });
      t.expect(r.start.join(), '==', [-24, 40.5, Math.PI / 2].join(), 'spawn pose on the beachfront street');
      t.expect(r.moved, '>', 15, 'metres driven east in 3 s of gas');
      t.expect(r.kmh, '>', 30, 'speed after 3 s of gas (km/h)');
      t.expect(r.crashes, '>=', 1, 'hitting a building reports a crash');
      t.expect(r.wallZ, 'between', [r.wall, 37], 'the wall stops the car (z, between the wall and the street)');
      t.expect(r.wallKmh, '<', 15, 'speed against the wall (km/h)');
      t.expect(r.seaZ, '<=', r.bound, 'the car cannot leave today\'s map through the sea');
    },
  },
  {
    id: 'D1.3', name: 'One clock turns the sky',
    async run(t) {
      const page = await t.open('&day=1');
      const frames = () => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const read = async (h) => { await page.evaluate((v) => window.__game.test.setHour(v), h); await frames(); return page.evaluate(() => ({ night: window.__game.modules.sky.night, sunY: window.__game.modules.sky.sunDir.y, text: document.getElementById('clock').textContent })); };
      const noon = await read(14), dusk = await read(19.5), night = await read(23);
      t.expect(noon.text, '==', '14:00', 'clock text at 14:00');
      t.expect(noon.sunY, '>', dusk.sunY, 'the sun is lower at dusk than in the afternoon');
      t.expect(noon.night === 0 && dusk.night > 0 && dusk.night < night.night && night.night > 0.9, '==', true, `night goes 0, part, full (${noon.night.toFixed(2)}, ${dusk.night.toFixed(2)}, ${night.night.toFixed(2)})`);
      await page.evaluate(() => window.__game.test.setHour(14));
      await page.keyboard.press('KeyT'); await frames();
      t.expect(await page.evaluate(() => window.__game.state.clock.hour), 'between', [18.5, 18.8], 'T skips to the sunset');
      await page.locator('#clock').dispatchEvent('pointerdown'); await frames();
      t.expect(await page.evaluate(() => window.__game.state.clock.hour), 'between', [19.4, 19.7], 'tapping the clock skips again');
      const a = await page.evaluate(() => window.__game.state.clock.hour);
      await page.evaluate(() => window.__game.test.wait(1));
      t.expect(await page.evaluate(() => window.__game.state.clock.hour) - a, '>', 0, 'the clock runs by itself');
      t.expect((await page.evaluate(() => window.__game.test.errors())).length, '==', 0, 'console errors and warnings');
    },
  },
];
