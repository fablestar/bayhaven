// Session D4-S4 (Minimap and map): D4.5 from plan/08-roadmap.md and one check per item on the session's list.
const QUIET = '&quality=low&traffic=0&peds=0';
const SMALL = { viewport: { width: 960, height: 540 } };
const settle = (page, ms = 400) => page.waitForTimeout(ms);

export default [
  {
    id: 'D4.5', name: 'Minimap: three colours or more, and a route from the beach to the Spire',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page, 600);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, spire = g.modules.map.landmark('spire');
        const mm = T.minimap(), p = T.player();
        g.seen = []; g.events.on('waypoint:set', (w) => g.seen.push(w));
        T.waypoint(spire.x, spire.z);
        const gps = T.gps();
        return { mm, gps, spire, from: { x: p.x, z: p.z }, seen: g.seen, district: g.modules.map.districtAt(p.x, p.z) };
      });
      t.expect(r.mm.colours, '>=', 3, 'distinct colours on the minimap canvas');
      t.expect(r.mm.onHud, '>=', 250, 'the minimap is drawn on the HUD canvas (alpha at its centre)');
      t.expect(r.district, '==', 'tideline', 'the route starts on the beachfront');
      const straight = Math.hypot(r.spire.x - r.from.x, r.spire.z - r.from.z);
      t.expect(r.gps.distance / straight, 'between', [1.0, 1.6], 'route length over the straight line to the Spire');
      t.expect(r.gps.points, '>=', 4, 'points on the route');
      t.expect(r.seen.length === 1 && r.seen[0].x === r.spire.x && r.seen[0].z === r.spire.z, '==', true, 'waypoint:set was emitted with the place');
      t.note(`straight ${straight.toFixed(0)} m, by road ${r.gps.distance.toFixed(0)} m, ${r.gps.expanded} junctions opened of ${r.gps.nodes}, ${r.gps.ms.toFixed(2)} ms`);
    },
  },
  {
    id: 'D4-S4.1', name: 'Minimap: a rounded rectangle at the bottom left that turns with the heading, tiles made once',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await settle(page, 600);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
        const a = T.minimap(), alpha = [a.corner, a.middle];
        T.teleport(52, -300, Math.PI); await wait(700);
        const b = T.minimap();
        T.teleport(52, -300, Math.PI / 2); await wait(700);
        const c = T.minimap();
        await wait(1200);
        const d = T.minimap();
        return { a, b, c, d, alpha, vw: window.innerWidth, vh: window.innerHeight, cap: 400 };
      });
      const q = r.a.rect;
      t.expect(q.x < r.vw / 4 && q.y + q.h > r.vh * 0.9, '==', true, 'bottom left of the screen');
      t.expect(q.w === q.h && q.w >= 120 && q.w <= 180, '==', true, `a square between 120 and 180 px (${q.w})`);
      t.expect(r.alpha[0], '==', 0, 'the corner pixel is clear (rounded, not a square)');
      t.expect(r.alpha[1], '==', 255, 'the middle is solid');
      t.expect(Math.abs(r.b.heading - Math.PI) < 0.1, '==', true, 'heading follows the car: north');
      t.expect(Math.abs(r.c.heading - Math.PI / 2) < 0.1, '==', true, 'heading follows the car: east');
      t.expect(r.d.paints - r.c.paints, 'between', [8, 14], 'repaints in 1.2 s (10 Hz)');
      t.expect(r.d.built, '==', r.c.built, 'no tile is drawn twice while standing still');
      t.expect(r.d.tiles, '<=', r.cap, 'tiles kept');
      t.expect(r.d.span, 'between', [299, 301], 'metres across when slow');
      t.note(`one tile ${r.d.tileMs.toFixed(2)} ms, one repaint ${r.d.ms.toFixed(2)} ms, ${r.d.tiles} tiles kept`);
    },
  },
  {
    id: 'D4-S4.2', name: 'Blips: any module can add, move and remove one; kinds differ by shape and colour',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, mm = g.modules.minimap, wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
        const before = T.minimap().blips.length;
        mm.addBlip({ id: 'check', x: 10, z: 20, icon: 'mission', colour: '#ffa02e' });
        const added = T.minimap().blips.find((b) => b.id === 'check');
        mm.moveBlip('check', 30, 40);
        const moved = T.minimap().blips.find((b) => b.id === 'check');
        const gone = mm.removeBlip('check'), after = T.minimap().blips.length;
        const all = T.minimap().blips, kinds = {};
        for (const b of all) kinds[b.icon] = b.colour;
        // draw two icons alone and compare their outlines
        const { drawIcon, iconIds } = mm.icons, shapes = new Set();
        for (const id of iconIds) {
          const c = document.createElement('canvas'); c.width = c.height = 24; const x = c.getContext('2d', { willReadFrequently: true });
          drawIcon(x, id, 12, 12, 22, '#ffffff');
          const d = x.getImageData(0, 0, 24, 24).data; let s = '';
          for (let i = 0; i < d.length; i += 4) s += d[i] > 128 && d[i + 3] > 128 ? '1' : '0';
          shapes.add(s);
        }
        await wait(50);
        return { before, added, moved, gone, after, icons: Object.keys(kinds).length, colours: new Set(Object.values(kinds)).size, ids: iconIds.length, shapes: shapes.size, drop: all.find((b) => b.id === 'drop') || null, day: g.state.build.day,
          marker: g.modules.drops && g.modules.drops.active ? g.modules.drops.active.marker : null };
      });
      t.expect(!!r.added && r.added.icon === 'mission', '==', true, 'addBlip puts a blip on the map');
      t.expect(r.moved.x === 30 && r.moved.z === 40, '==', true, 'moveBlip moves it');
      t.expect(r.gone && r.after === r.before, '==', true, 'removeBlip takes it off');
      t.expect(r.icons, '>=', 5, 'kinds of icon on the map from the start');
      t.expect(r.colours, '>=', 4, 'colours among them');
      t.expect(r.shapes, '==', r.ids, 'every icon has an outline of its own');
      if (r.marker) {
        t.expect(!!r.drop && r.drop.icon === 'drop' && r.drop.edge, '==', true, 'the day\'s drop is a blip that stays on the rim');
        t.expect(r.drop && Math.hypot(r.drop.x - r.marker.x, r.drop.z - r.marker.z), '<', 1, 'the drop blip is at the drop');
      } else t.note(`day ${r.day} has no drop marker`);
    },
  },
  {
    id: 'D4-S4.3', name: 'Map screen: M opens it, pan, zoom, district names, a tap sets a waypoint, 0 mutes and M does not',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      const T = (fn, arg) => page.evaluate(fn, arg);
      await page.keyboard.press('KeyM'); await settle(page, 900);
      const a = await T(() => ({ map: window.__game.test.map(), paused: window.__game.state.ui.paused, scale: window.__game.loop.timeScale, muted: window.__game.test.audio ? window.__game.test.audio().muted : null }));
      t.expect(a.map.open && a.paused && a.scale === 0, '==', true, 'M opens the map and time stops');
      t.expect(a.muted === true, '==', false, 'M no longer mutes');
      t.expect(a.map.w >= 950 && a.map.h >= 530, '==', true, 'the map fills the screen');
      t.expect(a.map.colours, '>=', 4, 'distinct colours on the map');
      t.expect(a.map.districts.length, '>=', 5, 'district names drawn');
      t.expect(a.map.landmarks, '>=', 10, 'landmark icons');
      // zoom out with the wheel, then drag
      await page.mouse.move(480, 270); await page.mouse.wheel(0, 600); await settle(page, 500);
      const b = await T(() => window.__game.test.map());
      t.expect(b.zoom, '<', a.map.zoom * 0.6, 'the wheel zooms out');
      t.expect(b.zoom, '>=', 0.29, 'zoom stops at 0.3 px a metre');
      await page.mouse.move(480, 270); await page.mouse.down(); await page.mouse.move(380, 300, { steps: 5 }); await page.mouse.up(); await settle(page, 300);
      const c = await T(() => ({ map: window.__game.test.map(), gps: window.__game.test.gps() }));
      t.expect(c.map.x - b.x, 'between', [100 / b.zoom - 30, 100 / b.zoom + 30], 'a 100 px drag left pans east by as many metres');
      t.expect(c.gps.waypoint, '==', null, 'a drag is not a tap');
      // tap a spot up and left of the middle
      const at = { x: 300, y: 150 }, spot = await T((q) => window.__game.test.mapWorld(q.x, q.y), at);
      await page.mouse.click(at.x, at.y); await settle(page, 300);
      const d = await T(() => ({ gps: window.__game.test.gps(), map: window.__game.test.map(), n: window.__game.test.count('waypoint:set') }));
      t.expect(!!d.gps.waypoint && Math.hypot(d.gps.waypoint.x - spot.x, d.gps.waypoint.z - spot.z) < 2, '==', true, 'a tap sets the waypoint where it landed');
      t.expect(d.n, '==', 1, 'waypoint:set events');
      t.expect(/Waypoint: .* by road/.test(d.map.note), '==', true, `the note says how far (${d.map.note})`);
      const pin = await T((q) => window.__game.test.mapScreen(q.x, q.z), spot);
      t.expect(Math.hypot(pin.x - at.x, pin.y - at.y), '<', 2, 'the pin is drawn where the tap was');
      await page.mouse.click(at.x, at.y); await settle(page, 200);
      const e = await T(() => window.__game.test.gps());
      t.expect(e.waypoint, '==', null, 'a tap on the pin clears it');
      await page.keyboard.press('KeyM'); await settle(page, 200);
      const f = await T(() => ({ open: window.__game.test.map().open, paused: window.__game.state.ui.paused }));
      t.expect(f.open || f.paused, '==', false, 'M closes it and the game goes on');
      // from the pause card
      await page.keyboard.press('Escape'); await settle(page, 200);
      const row = await page.$('#menu-card .menu-row:nth-of-type(2)');
      const text = row ? await row.textContent() : '';
      t.expect(text, '==', 'Map', 'the pause card has a Map row');
      if (row) { await row.click(); await settle(page, 300); }
      t.expect(await T(() => window.__game.test.map().open), '==', true, 'which opens the map');
      await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await settle(page, 200);
      // the mute key
      await page.keyboard.press('Digit0'); await settle(page, 200);
      const m = await T(() => (window.__game.test.audio ? window.__game.test.audio().muted : null));
      if (m !== null) t.expect(m, '==', true, '0 mutes');
      t.expect((await T(() => window.__game.test.errors())).length, '==', 0, 'console errors');
    },
  },
  {
    id: 'D4-S4.4', name: 'GPS: the route follows roads, shortens as you drive, has chevrons, and is found again when you leave it',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, map = g.modules.map;
        T.teleport(-24, 37, Math.PI / 2); await T.wait(0.3);
        T.waypoint(52, -900);
        const a = T.gps();
        // every corner of the route is a junction of the map
        let offRoad = 0;
        for (const [x, z] of a.route.slice(0, -1)) { const n = map.nearestRoad(x, z); if (!n || n.d > 1.5) offRoad++; }
        const calls0 = T.stats().calls;
        // drive a little way along it
        T.teleport(52, -100, Math.PI); await T.wait(0.8);
        const b = T.gps();
        // leave it: three blocks west
        const west = map.nearestRoad(-420, -500);
        T.teleport(west.x, west.z, 0); await T.wait(1.6);
        const c = T.gps();
        // arrive: at the end of the road to it (the Spire itself is inside a block)
        const end = c.route[c.route.length - 2];
        T.teleport(end[0], end[1], Math.PI); await T.wait(0.8);
        const d = T.gps();
        // a route that crosses districts that are not loaded
        T.waypoint(2500, -700);
        const far = T.gps();
        T.waypoint();
        return { a, b, c, d, far, offRoad, calls0, cleared: T.count('waypoint:cleared'), loadedFar: g.modules.chunks.isLoaded(map.chunkOf(2500, -700).cx, map.chunkOf(2500, -700).cz) };
      });
      t.expect(r.offRoad, '==', 0, 'route corners that are not on a road');
      t.expect(r.a.chevrons, '>=', 8, 'chevrons on the road ahead');
      t.expect(r.a.ms, '<', 4, 'milliseconds to find the route');
      t.expect(r.b.distance, '<', r.a.distance - 100, 'the route shortens as you drive it');
      t.expect(r.b.reroutes, '==', 0, 'no new route while on it');
      t.expect(r.c.reroutes, '>=', 1, 'a new route after leaving it');
      t.expect(r.c.distance, '>', 300, 'the new route starts where you are');
      t.expect(r.d.waypoint, '==', null, 'the waypoint clears on arrival');
      t.expect(r.d.chevrons, '==', 0, 'and the chevrons go');
      t.expect(r.far.points >= 6 && r.far.distance > 2400 && !r.loadedFar, '==', true, `a route across the city, to a district that is not loaded (${Math.round(r.far.distance)} m)`);
      t.expect(r.far.distance / r.far.straight, 'between', [1.0, 1.6], 'that route over its straight line');
      t.expect(r.cleared, '>=', 2, 'waypoint:cleared events');
      t.note(`graph: ${r.a.nodes} junctions, ${r.a.edges} pieces; far route ${r.far.ms.toFixed(2)} ms, ${r.far.expanded} junctions opened`);
    },
  },
  {
    id: 'D4-S4.5', name: 'Districts: faint until first entered, kept in the save',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
        const px = () => T.minimap().ahead.slice(0, 3);
        const a = T.minimap().explored.slice();
        // look at Meridian from the edge of Tideline, facing north: the top of the minimap is unexplored
        T.teleport(52, -300, Math.PI); await wait(500);
        const faint = px();
        const b0 = T.minimap().explored.slice();
        T.teleport(52, -420, Math.PI); await wait(500);
        const b = T.minimap().explored.slice();
        T.teleport(52, -300, Math.PI); await wait(500);
        const clear = px();
        const snap = T.save.snapshot();
        // the luggage tag carries the district's own name
        T.teleport(-1400, -900, Math.PI); await wait(400);
        const tag = T.hud().tag;
        return { a, b0, b, faint, clear, tag, saved: snap.sections && snap.sections.map };
      });
      t.expect(r.a.includes('tideline') && !r.a.includes('meridian'), '==', true, 'at the start only Tideline is known');
      t.expect(r.b.includes('meridian'), '==', true, 'driving into Meridian marks it');
      const lum = (c) => c[0] + c[1] + c[2];
      t.expect(Math.abs(lum(r.faint) - lum(r.clear)), '>', 40, `the same spot is drawn differently before and after (${r.faint} then ${r.clear})`);
      t.expect(!!r.saved && r.saved.explored.includes('meridian'), '==', true, 'the save keeps the list');
      t.expect(r.tag, '==', 'Palma Vieja', 'the tag on entering a district shows its name');
    },
  },
  {
    id: 'D4-S4.6', name: 'Phone size: the minimap is 120 px, text is 14 px or more, and it costs one draw call',
    async run(t) {
      const page = await t.open(QUIET, { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
      await settle(page, 500);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test;
        // the smallest of five counts each way, so one car coming into view does not move the number
        const calls = async () => { let m = 1e9; for (let i = 0; i < 5; i++) { await T.wait(0.1); m = Math.min(m, T.stats().calls); } return m; };
        const c0 = await calls();
        T.waypoint(52, -900); await T.wait(0.3);
        const c1 = await calls(), mm = T.minimap(), gps = T.gps();
        // and off again: the scene moves between counts, so the cost is measured against both sides
        T.waypoint(); await T.wait(0.3);
        const c2 = await calls();
        return { c0, c1, c2, mm, gps, mode: T.hud().mode };
      });
      t.expect(r.mm.rect.w, '==', 120, 'minimap size on a phone');
      t.expect(r.mm.colours, '>=', 3, 'colours');
      t.expect(r.gps.chevrons, '>', 0, 'chevrons on the road');
      t.expect(r.c1 - Math.max(r.c0, r.c2), '<=', 1, 'draw calls added by the route chevrons');
      t.note(`draw calls without, with, without a route: ${r.c0}, ${r.c1}, ${r.c2}`);
      t.expect(r.mm.ms, '<', 6, 'milliseconds for one repaint');
      t.note(`hud mode ${r.mode}, repaint ${r.mm.ms.toFixed(2)} ms, ${r.gps.chevrons} chevrons`);
    },
  },
];
