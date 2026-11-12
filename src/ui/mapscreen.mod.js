// The full map: a page of the pause menu that fills the screen (plan/bible/art/ui-kit.md section 3).
// Drag to pan, wheel, pinch or the round buttons to zoom (0.3 to 4 px a metre), tap to set a
// waypoint, tap the pin to clear it. M opens and closes it; so does the pause card's Map row.
// It draws the same tiles, blips and route as the minimap, with district names and landmark icons.
// Public object: open() · close() · isOpen · view { x, z, zoom } · toScreen(x, z) · toWorld(px, py)
import { drawIcon, countColours, COL } from './maptiles.js';
import { metres } from './minimap.mod.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';
const CSS = `
#menu-veil:has(#menu-card[data-page="map"]) { padding: 0; }
#menu-card[data-page="map"] { position: relative; width: 100%; height: 100%; max-width: none; max-height: none; padding: 0; border-radius: 0; overflow: hidden;
  background: ${COL.water}; touch-action: none; }
#menu-card[data-page="map"] .menu-title { position: absolute; z-index: 1; left: calc(24px + var(--sl, 0px)); top: calc(16px + var(--st, 0px)); margin: 0; pointer-events: none; }
#menu-card[data-page="map"] > .menu-row { position: absolute; z-index: 1; right: calc(24px + var(--sr, 0px)); top: calc(16px + var(--st, 0px)); width: auto; min-height: 44px;
  padding: 0 20px; border: 0; border-radius: 22px; background: rgba(21, 15, 61, .8); font-size: 18px; transform: none; }
.map-canvas { position: absolute; inset: 0; width: 100%; height: 100%; cursor: grab; }
.map-tools { position: absolute; z-index: 1; right: calc(24px + var(--sr, 0px)); bottom: calc(24px + var(--sb, 0px)); display: flex; flex-direction: column; gap: 10px; }
.map-tools button { width: 56px; height: 56px; border: 0; border-radius: 50%; background: rgba(21, 15, 61, .8); color: ${COL.cyan}; font: 800 26px ${FONT}; cursor: pointer; }
.map-tools button:focus-visible, #menu-card[data-page="map"] > .menu-row:focus-visible { outline: 2px solid ${COL.cyan}; outline-offset: 2px; }
.map-note { position: absolute; z-index: 1; left: 50%; bottom: calc(24px + var(--sb, 0px)); transform: translateX(-50%); max-width: calc(100% - 220px); padding: 8px 16px;
  border-radius: 20px; background: rgba(21, 15, 61, .8); color: #fff; font: 16px ${FONT}; text-align: center; pointer-events: none; }
@media (max-width: 600px), (max-height: 500px) {
  .map-tools { right: calc(14px + var(--sr, 0px)); bottom: calc(14px + var(--sb, 0px)); }
  .map-tools button { width: 48px; height: 48px; }
  .map-note { bottom: calc(14px + var(--sb, 0px)); font-size: 14px; padding: 6px 12px; }
  #menu-card[data-page="map"] > .menu-row { right: calc(14px + var(--sr, 0px)); top: calc(10px + var(--st, 0px)); font-size: 16px; }
  #menu-card[data-page="map"] .menu-title { left: calc(14px + var(--sl, 0px)); top: calc(10px + var(--st, 0px)); }
}`;

export default {
  name: 'mapscreen', order: 76, needs: ['menus', 'minimap', 'map'],
  init(ctx) {
    const S = ctx.state, M = ctx.modules, map = M.map, mm = M.minimap, menus = M.menus;
    const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
    const landmarks = [];
    for (const zn of map.zones) for (const id in zn.landmarks) landmarks.push({ id, zone: zn.id, x: zn.landmarks[id].x, z: zn.landmarks[id].z });
    const view = { x: 0, z: 0, zoom: 0.8 }, want = { x: 0, z: 0, zoom: 0.8 }, stats = { paints: 0, owed: 0, ms: 0 };
    let canvas = null, g = null, note = null, W = 0, H = 0, dpr = 1, dirty = true, lastT = 0, minZoom = 0.3;

    const toScreen = (x, z) => ({ x: W / 2 + (x - view.x) * view.zoom, y: H / 2 + (z - view.z) * view.zoom });
    const toWorld = (px, py) => ({ x: view.x + (px - W / 2) / view.zoom, z: view.z + (py - H / 2) / view.zoom });
    function bound() {
      want.zoom = clamp(want.zoom, minZoom, 4);
      want.x = clamp(want.x, map.world.x0, map.world.x1); want.z = clamp(want.z, map.world.z0, map.world.z1);
      dirty = true;
    }
    // zoom by a factor, keeping the point under (px, py) where it is
    function zoomAt(f, px = W / 2, py = H / 2) {
      const z0 = want.zoom, z1 = clamp(z0 * f, minZoom, 4), sx = px - W / 2, sy = py - H / 2;
      want.x += sx / z0 - sx / z1; want.z += sy / z0 - sy / z1; want.zoom = z1;
      bound();
    }
    function say() {
      const gps = M.gps;
      if (note) note.textContent = gps && gps.waypoint ? `Waypoint: ${metres(gps.distance)} by road. Tap the pin to clear it` : 'Tap the map to set a waypoint';
    }
    function tap(px, py) {
      const gps = M.gps;
      if (!gps) return;
      const wp = gps.waypoint, at = wp && toScreen(wp.x, wp.z);
      if (at && Math.hypot(at.x - px, at.y - py) < 22) gps.clear(); else { const w = toWorld(px, py); gps.setWaypoint(w.x, w.z); }
      say(); dirty = true;
    }

    function paint() {
      const t0 = performance.now(), z = view.zoom, k = z * dpr, p = S.player, small = Math.min(W, H) < 500;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.fillStyle = COL.water; g.fillRect(0, 0, canvas.width, canvas.height);
      g.setTransform(k, 0, 0, k, canvas.width / 2 - view.x * k, canvas.height / 2 - view.z * k);
      stats.owed = mm.tiles.paint(g, view.x, view.z, W / 2 / z, H / 2 / z, k, mm.explored, 10);
      const gps = M.gps, route = gps && gps.route;
      if (route && route.length > 1) {
        g.lineJoin = g.lineCap = 'round';
        g.beginPath(); g.moveTo(route[0].x, route[0].z);
        for (let i = 1; i < route.length; i++) g.lineTo(route[i].x, route[i].z);
        g.strokeStyle = COL.ink; g.lineWidth = 8 / z; g.stroke();
        g.strokeStyle = COL.cyan; g.lineWidth = 4 / z; g.stroke();
      }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      // district names: italic 800, wide spacing, white at 60% (fainter where nobody has been)
      g.font = `italic 800 ${small ? 16 : 28}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
      if ('letterSpacing' in g) g.letterSpacing = '4px';
      for (const zn of map.zones) {
        const b = zn.bounds, s = toScreen((b.x0 + b.x1) / 2, (b.z0 + b.z1) / 2);
        g.fillStyle = COL.ink; g.globalAlpha = 0.35; g.fillText(zn.name, s.x + 1, s.y + 2);
        g.fillStyle = '#ffffff'; g.globalAlpha = mm.explored.has(zn.id) ? 0.6 : 0.32; g.fillText(zn.name, s.x, s.y);
      }
      g.globalAlpha = 1;
      if ('letterSpacing' in g) g.letterSpacing = '0px';
      // landmarks, then the registered blips; small things wait until the map is close enough to tell them apart
      const size = small ? 18 : 22, on = (s) => s.x > -20 && s.x < W + 20 && s.y > -20 && s.y < H + 20;
      if (z >= 0.3) for (const l of landmarks) { const s = toScreen(l.x, l.z); if (on(s) && mm.explored.has(l.zone)) drawIcon(g, 'landmark', s.x, s.y, size * 0.9, COL.sand); }
      for (const b of mm.blips.values()) {
        if (!b.edge && z < 0.45) continue;
        const s = toScreen(b.x, b.z);
        if (on(s)) drawIcon(g, b.icon, s.x, s.y - (b.icon === 'waypoint' ? size * 0.55 : 0), size * (b.edge ? 1.3 : 1), b.colour);
      }
      const me = toScreen(p.x, p.z);
      drawIcon(g, 'player', me.x, me.y, size * 1.2, '#ffffff', Math.PI - p.h);
      stats.paints++; stats.ms = performance.now() - t0;
    }
    function frame(t) {
      if (!canvas || !canvas.isConnected) { canvas = null; return; }
      requestAnimationFrame(frame);
      const dt = Math.min(0.1, (t - lastT) / 1000 || 0.016), a = S.settings.reduceMotion ? 1 : 1 - Math.exp(-dt / 0.05); lastT = t;
      const cw = canvas.clientWidth, ch = canvas.clientHeight, d = Math.min(window.devicePixelRatio || 1, 2);
      if (cw !== W || ch !== H || d !== dpr) { W = cw; H = ch; dpr = d; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); minZoom = Math.min(0.3, W / 5600); bound(); }
      const dx = want.x - view.x, dz = want.z - view.z, dzm = want.zoom - view.zoom;
      if (Math.abs(dx) + Math.abs(dz) > 0.05 || Math.abs(dzm) > 0.0005) { view.x += dx * a; view.z += dz * a; view.zoom += dzm * a; dirty = true; }
      if (dirty || stats.owed) { dirty = false; if (W && H) paint(); }
    }

    menus.register({ id: 'map', title: 'Map', build(page) {
      canvas = document.createElement('canvas'); canvas.className = 'map-canvas'; g = canvas.getContext('2d');
      page.appendChild(canvas);
      const tools = document.createElement('div'); tools.className = 'map-tools';
      for (const [text, label, fn] of [['+', 'Zoom in', () => zoomAt(1.6)], ['−', 'Zoom out', () => zoomAt(1 / 1.6)], ['◎', 'Find me', () => { want.x = S.player.x; want.z = S.player.z; bound(); }]]) {
        const b = document.createElement('button'); b.type = 'button'; b.textContent = text; b.setAttribute('aria-label', label); b.title = label;
        b.addEventListener('click', fn); tools.appendChild(b);
      }
      page.appendChild(tools);
      note = document.createElement('div'); note.className = 'map-note'; page.appendChild(note); say();
      // one finger or the mouse pans, and is a tap if it hardly moved; two fingers pinch
      const pts = new Map();
      let moved = 0, pinch = 0;
      const local = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
      canvas.addEventListener('pointerdown', (e) => { canvas.setPointerCapture(e.pointerId); pts.set(e.pointerId, local(e)); if (pts.size === 1) moved = 0; else moved = 99; pinch = 0; });
      canvas.addEventListener('pointermove', (e) => {
        const was = pts.get(e.pointerId); if (!was) return;
        const now = local(e);
        if (pts.size === 1) {
          moved += Math.abs(now.x - was.x) + Math.abs(now.y - was.y);
          if (moved > 6) { want.x -= (now.x - was.x) / want.zoom; want.z -= (now.y - was.y) / want.zoom; view.x = want.x; view.z = want.z; bound(); view.x = want.x; view.z = want.z; }
        }
        pts.set(e.pointerId, now);
        if (pts.size === 2) {
          const [a, b] = [...pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (pinch > 0 && d > 0) zoomAt(d / pinch, (a.x + b.x) / 2, (a.y + b.y) / 2);
          pinch = d;
        }
      });
      const up = (e) => { const was = pts.get(e.pointerId); if (!was) return; pts.delete(e.pointerId); pinch = 0; if (e.type === 'pointerup' && moved <= 6 && !pts.size) tap(was.x, was.y); };
      canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
      canvas.addEventListener('wheel', (e) => { e.preventDefault(); const q = local(e); zoomAt(Math.exp(-e.deltaY * 0.0015), q.x, q.y); }, { passive: false });
      // open on the player, close enough to read the streets
      want.x = view.x = S.player.x; want.z = view.z = S.player.z; want.zoom = view.zoom = window.innerHeight < 500 ? 0.5 : 0.8;
      W = H = 0; dirty = true; lastT = performance.now();
      requestAnimationFrame(frame);
    } });

    const api = {
      view, stats, toScreen, toWorld,
      get isOpen() { return menus.current === 'map'; },
      open() { return menus.current === 'map' || menus.open('map'); },
      close() { if (menus.current === 'map') menus.close(); },
    };
    // M opens the map from the game and closes it again (the menu keeps other keys from the game while it is up)
    window.addEventListener('keydown', (e) => {
      if (e.code !== 'KeyM' || e.repeat || e.ctrlKey || e.metaKey) return;
      if (menus.current === 'map') menus.close(); else if (!menus.isOpen) menus.open('map');
    }, true);
    ctx.events.on('waypoint:cleared', () => { say(); dirty = true; });

    ctx.test.map = () => {
      const out = { open: api.isOpen, x: view.x, z: view.z, zoom: view.zoom, w: W, h: H, paints: stats.paints, owed: stats.owed, ms: stats.ms, colours: 0,
        districts: map.zones.map((zn) => zn.name), landmarks: landmarks.length, note: note ? note.textContent : '' };
      if (api.isOpen && canvas) out.colours = countColours(canvas, 37);
      return out;
    };
    ctx.test.mapWorld = (px, py) => { const r = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0 }; return toWorld(px - r.left, py - r.top); };
    ctx.test.mapScreen = (x, z) => { const s = toScreen(x, z), r = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0 }; return { x: s.x + r.left, y: s.y + r.top }; };
    return api;
  },
};
