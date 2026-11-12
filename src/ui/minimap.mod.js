// The minimap: a rounded rectangle in the HUD's `minimap` place, turned so the way you face is up,
// with the player's arrow fixed at 60% of its height (plan/bible/art/ui-kit.md section 2). It is
// painted ten times a second on its own canvas and copied onto the HUD canvas every frame, so
// photos and clips include it. It also keeps the blip registry and the list of districts seen.
// Public object: addBlip({ id, x, z, icon, colour, pulse, edge }) · moveBlip(id, x, z) ·
//   removeBlip(id) · blips · zoom (metres across) · explored (Set of district ids) · tiles · canvas
//   · icons { drawIcon, iconIds }
// Listens: district:entered, game:ready. Reads state.player, modules.gps.route, modules.drops.
import { createTiles, drawIcon, iconIds, readBack, countColours, COL, PLACE } from './maptiles.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const angle = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const EDGE = { waypoint: 1, mission: 1, drop: 1 };          // these stay on the rim when they are off the map
export const metres = (d) => (d < 1000 ? Math.round(d / 10) * 10 + ' m' : (d / 1000).toFixed(1) + ' km');

let frame = () => {};
export default {
  name: 'minimap', order: 72, renderOrder: 72, needs: ['hud', 'map'],
  init(ctx) {
    const S = ctx.state, M = ctx.modules, map = M.map, hud = M.hud;
    const tiles = createTiles(map), blips = new Map(), explored = new Set();
    const canvas = document.createElement('canvas'), g = canvas.getContext('2d'), hg = hud.canvas.getContext('2d');
    const stats = { paints: 0, ms: 0, owed: 0 };
    let span = 300, heading = 0, last = -1, dpr = 1, rect = null;

    const api = {
      canvas, tiles, blips, explored, stats, icons: { drawIcon, iconIds },
      get zoom() { return span; },
      addBlip(b) {
        if (!b || b.id === undefined) return null;
        const blip = { icon: 'dot', colour: '#ffffff', pulse: false, ...b };
        if (blip.edge === undefined) blip.edge = !!EDGE[blip.icon];
        blips.set(b.id, blip); last = -1;
        return blip;
      },
      moveBlip(id, x, z) { const b = blips.get(id); if (b) { b.x = x; b.z = z; } return !!b; },
      removeBlip(id) { last = -1; return blips.delete(id); },
    };

    // districts: faint until first entered, and kept in the save
    const here = map.districtAt(S.player.x, S.player.z);
    if (here) explored.add(here);
    ctx.events.on('district:entered', (d) => { if (d && d.id) { explored.add(d.id); last = -1; } });
    ctx.save.section('map', { version: 1, get: () => ({ explored: [...explored] }), set(d) { if (d && d.explored) for (const id of d.explored) explored.add(id); } });

    // what is on the map from the start: shops, garages and the rest of the map's places, and the day's drop
    for (const p of map.places()) { const look = PLACE[p.kind]; if (look) api.addBlip({ id: 'place:' + p.id, x: p.x, z: p.z, icon: look[0], colour: look[1], kind: p.kind }); }
    const drop = () => {
      const d = M.drops && M.drops.active, at = d && d.marker;
      if (at) api.addBlip({ id: 'drop', x: at.x, z: at.z, icon: 'drop', colour: COL.mango, pulse: true, label: 'Today\'s drop' });
    };
    drop(); ctx.events.on('game:ready', drop);

    function paint(now) {
      const t0 = performance.now(), p = S.player, W = canvas.width, cx = W / 2, cy = W * 0.6, pm = W / span, th = heading - Math.PI;
      const cos = Math.cos(th), sin = Math.sin(th), rad = (rect.w > 150 ? 20 : 14) * dpr;
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, W);
      g.save();
      g.beginPath(); g.roundRect(1, 1, W - 2, W - 2, rad); g.clip();
      g.fillStyle = COL.water; g.fillRect(0, 0, W, W);
      g.translate(cx, cy); g.rotate(th); g.scale(pm, pm); g.translate(-p.x, -p.z);
      stats.owed = tiles.paint(g, p.x, p.z, span * 0.8, span * 0.8, pm, explored, 3);
      // the route: cyan on an ink edge
      const gps = M.gps, route = gps && gps.route;
      if (route && route.length > 1) {
        g.lineJoin = g.lineCap = 'round';
        g.beginPath(); g.moveTo(route[0].x, route[0].z);
        for (let i = 1; i < route.length; i++) g.lineTo(route[i].x, route[i].z);
        g.strokeStyle = COL.ink; g.lineWidth = 7 * dpr / pm; g.stroke();
        g.strokeStyle = COL.cyan; g.lineWidth = 4 * dpr / pm; g.stroke();
      }
      g.setTransform(1, 0, 0, 1, 0, 0);
      // blips, upright; the ones that matter wait on the rim when they are off the map
      const size = (rect.w > 150 ? 20 : 17) * dpr, pad = size * 0.6;
      for (const b of blips.values()) {
        const dx = b.x - p.x, dz = b.z - p.z;
        let x = cx + pm * (dx * cos - dz * sin), y = cy + pm * (dx * sin + dz * cos);
        const off = x < pad || x > W - pad || y < pad || y > W - pad;
        if (off && !b.edge) continue;
        x = clamp(x, pad, W - pad); y = clamp(y, pad, W - pad);
        const beat = b.pulse && !S.settings.reduceMotion ? 1 + 0.15 * Math.sin(now * 6) : 1;
        drawIcon(g, b.icon, x, y, size * (b.edge ? 1.15 : 1) * beat * (off ? 0.85 : 1), b.colour);
      }
      // the player: a chevron that points the way they face
      drawIcon(g, 'player', cx, cy, size * 1.1, '#ffffff', angle(p.h - heading) * -1);
      // the N tab on the rim, and how far the waypoint is
      const nx = sin, ny = -cos, k = (W / 2 - 11 * dpr) / Math.max(Math.abs(nx), Math.abs(ny)), tx = W / 2 + nx * k, ty = W / 2 + ny * k;
      g.fillStyle = COL.ink; g.beginPath(); g.arc(tx, ty, 9 * dpr, 0, 7); g.fill();
      g.fillStyle = COL.pink; g.font = `800 ${14 * dpr}px "Trebuchet MS", "Segoe UI", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('N', tx, ty + dpr);
      if (gps && gps.waypoint) {
        const text = metres(gps.distance), w = g.measureText(text).width + 14 * dpr, h = 20 * dpr;
        g.fillStyle = 'rgba(21, 15, 61, .78)'; g.beginPath(); g.roundRect(W / 2 - w / 2, W - h - 5 * dpr, w, h, h / 2); g.fill();
        g.fillStyle = '#ffffff'; g.fillText(text, W / 2, W - h / 2 - 4 * dpr);
      }
      g.restore();
      g.strokeStyle = 'rgba(255, 255, 255, .55)'; g.lineWidth = 2 * dpr;
      g.beginPath(); g.roundRect(dpr, dpr, W - 2 * dpr, W - 2 * dpr, rad); g.stroke();
      stats.paints++; stats.ms = performance.now() - t0;
    }

    frame = () => {
      const r = hud.layout().find((q) => q.id === 'minimap');
      if (!r) return;
      const now = performance.now() / 1000, p = S.player, d = hud.canvas.width / window.innerWidth, px = Math.round(r.w * d);
      if (px !== canvas.width || d !== dpr) { dpr = d; canvas.width = canvas.height = px; last = -1; }
      rect = r;
      if (now - last >= 0.1 || stats.owed) {
        const dt = last < 0 ? 0 : Math.min(0.3, now - last);
        // 300 m across on foot and when slow, 520 m above 60 km/h, easing over 600 ms
        const car = M.vehicles && M.vehicles.player, kmh = p.mode === 'foot' ? 0 : Math.abs(car ? car.kmh : (p.speed || 0) * 3.6);
        span += ((kmh > 60 ? 520 : 300) - span) * (dt ? 1 - Math.exp(-dt / 0.2) : 1);
        // up is the way the car points, or the way the camera looks on foot
        let want = p.h;
        if (p.mode === 'foot') { const e = ctx.camera.matrixWorld.elements; want = Math.atan2(-e[8], -e[10]); }
        heading = dt ? heading + angle(want - heading) * (1 - Math.exp(-dt / 0.12)) : want;
        last = now;
        paint(now);
      }
      hg.setTransform(1, 0, 0, 1, 0, 0);
      hg.clearRect(Math.round(r.x * dpr), Math.round(r.y * dpr), px, px);
      hg.drawImage(canvas, Math.round(r.x * dpr), Math.round(r.y * dpr));
    };

    // for the checks: how many colours the minimap shows, and what is on it
    ctx.test.minimap = () => {
      const W = canvas.width, px = (c, x, y) => [...readBack(c, Math.round(x), Math.round(y), 1, 1)];
      return { colours: countColours(canvas, 7), size: W, dpr, span, heading, rect: rect && { ...rect }, paints: stats.paints, ms: stats.ms, tiles: tiles.count, tileMs: tiles.stats.ms, built: tiles.stats.built,
        explored: [...explored], corner: W ? px(canvas, 0, 0)[3] : 0, middle: W ? px(canvas, W / 2, W / 2)[3] : 0, ahead: W ? px(canvas, W / 2, W * 0.25) : [],
        onHud: rect ? px(hud.canvas, (rect.x + rect.w / 2) * dpr, (rect.y + rect.h / 2) * dpr)[3] : 0,
        blips: [...blips.values()].map((b) => ({ id: b.id, icon: b.icon, colour: b.colour, x: b.x, z: b.z, edge: b.edge })) };
    };
    return api;
  },
  render() { frame(); },
};
