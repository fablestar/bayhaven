// Breakable street furniture (plan/04-systems.md section 4): where the hydrants, cafe tables,
// picket fences and sandwich boards stand, and what happens when one breaks. A hydrant leaves a
// geyser that lifts the player's car for 25 seconds; a fence becomes splinters; a palm that is hit
// drops two coconuts. The props themselves, and the lamp posts that bend, are in props.js.
// Placement is by chunk seed along the sidewalks, so the same hydrant is always in the same place.
import { rng } from '../gfx/builder.js';

const GEYSER = { seconds: 25, fade: 3, reach: 1.7, lift: 5.5, top: 1.8, most: 3, wet: 3 };
const CHAIRS = [0xff8f7a, 0x8fe3cf, 0xffc98f, 0x9fd2ff];
const BOARDS = [0xffd23e, 0xff8f7a, 0x8fe3cf, 0xfdf6ea];

let api = null;
export default {
  name: 'breakables', order: 27, needs: ['props', 'nav', 'map', 'chunks', 'collide', 'vehicles', 'fx', 'world'],
  init(ctx) {
    const m = ctx.modules, ev = ctx.events, { props, nav, map, chunks, collide } = m;
    const placed = new Map(), geysers = [], stats = { placed: 0, hydrants: 0, geysers: 0, coconuts: 0, splintered: 0, lifted: 0 };
    const off = !chunks || chunks.disabled || ctx.params.get('breakables') === '0';
    let scanT = 0;

    // one chunk's furniture: hydrants by the curb, the rest against the buildings
    function place(cx, cz) {
      const list = [], low = ctx.quality.level === 'low', rnd = rng((map.chunkSeed(cx, cz) ^ 0x5eed) >>> 0);
      const walks = nav.walksInChunk(cx, cz).filter((w) => !w.crossing && Math.hypot(w.bx - w.ax, w.bz - w.az) > 24);
      const add = (kind, x, z, rot, opts) => { const p = props.add(kind, x, map.heightAt(x, z), z, rot, opts); if (p) { list.push(p); stats.placed++; } return p; };
      const want = low ? ['hydrant', 'sign', 'cafe'] : ['hydrant', 'fence', 'sign', 'cafe', 'hydrant', 'sign'];
      for (let i = 0; i < want.length && walks.length; i++) {
        const w = walks[Math.floor(rnd() * walks.length)], t = 0.2 + rnd() * 0.6, x = w.ax + (w.bx - w.ax) * t, z = w.az + (w.bz - w.az) * t;
        const len = Math.hypot(w.bx - w.ax, w.bz - w.az), ux = (w.bx - w.ax) / len, uz = (w.bz - w.az) / len;
        // which way is the road: towards the nearest lane
        const lane = nav.laneNear(x, z);
        if (!lane) continue;
        const lx = (lane.ax + lane.bx) / 2 - x, lz = (lane.az + lane.bz) / 2 - z, side = Math.sign(lx * -uz + lz * ux) || 1, nx = -uz * side, nz = ux * side;
        const rot = Math.atan2(ux, uz) + Math.PI / 2;            // long side along the sidewalk
        const what = want[i];
        if (what === 'hydrant') { if (add('hydrant', x + nx * 1.05, z + nz * 1.05, rot)) stats.hydrants++; }
        else if (what === 'sign') add('sign', x - nx * 0.9, z - nz * 0.9, rot + Math.PI / 2, { color: BOARDS[Math.floor(rnd() * BOARDS.length)] });
        else if (what === 'fence') for (let k = -1; k <= 1; k++) add('fence', x - nx * 1.25 + ux * k * 2.4, z - nz * 1.25 + uz * k * 2.4, rot);
        else {
          const tx = x - nx * 0.8, tz = z - nz * 0.8, col = CHAIRS[Math.floor(rnd() * CHAIRS.length)];
          add('table', tx, tz, rot);
          for (const k of low ? [1] : [1, -1]) add('chair', tx + ux * k * 0.75, tz + uz * k * 0.75, Math.atan2(-ux * k, -uz * k), { color: col });
        }
      }
      return list;
    }
    function scan() {
      const p = ctx.state.player, c = map.chunkOf(p.x, p.z), r = ctx.quality.get('lod0Radius');
      for (let cx = c.cx - r; cx <= c.cx + r; cx++) for (let cz = c.cz - r; cz <= c.cz + r; cz++) {
        const k = cx + cz * 64;
        if (!placed.has(k) && chunks.isLoaded(cx, cz)) placed.set(k, place(cx, cz));
      }
      for (const [k, list] of placed) {
        const cx = ((k % 64) + 64) % 64, cz = Math.round((k - cx) / 64);
        if (chunks.isLoaded(cx, cz)) continue;
        for (const q of list) props.remove(q);
        placed.delete(k);
      }
    }
    function clear() { for (const list of placed.values()) for (const q of list) props.remove(q); placed.clear(); }

    function geyser(x, z) {
      if (geysers.length >= GEYSER.most) geysers.shift();
      geysers.push({ x, z, y: map.heightAt(x, z), t: GEYSER.seconds });
      stats.geysers++;
      if (m.fx) m.fx.scorch(x, z, GEYSER.wet, GEYSER.seconds);         // the wet patch, 6 m across
      ev.emit('geyser:start', { x, z, seconds: GEYSER.seconds });
    }

    ev.on('prop:broken', (e) => {
      if (!e) return;
      const fx = m.fx, car = m.vehicles.player, s = Math.sin(car.h), c = Math.cos(car.h), vx = s * car.vf + c * car.vl, vz = c * car.vf - s * car.vl;
      if (e.kind === 'hydrant') geyser(e.x, e.z);
      else if (e.kind === 'fence') { stats.splintered++; if (fx) fx.emit('prop-bits', e.x, map.heightAt(e.x, e.z), e.z, { kind: 'fence', vx, vz, spread: 1 }); }
    });
    // a palm that takes a hit drops two coconuts (a palm's trunk is a 0.6 m square in the collision hash)
    ev.on('vehicle:crash', (e) => {
      if (!e || e.what !== 'wall' || e.speed < 4 || !collide.ray) return;
      const h = collide.ray(e.x + e.nx * 0.6, e.z + e.nz * 0.6, e.x - e.nx * 0.6, e.z - e.nz * 0.6), b = h && h.shape;
      if (!b || b.x1 - b.x0 > 0.7 || b.z1 - b.z0 > 0.7 || b.x1 - b.x0 < 0.5 || (b.h || 0) > 1.2) return;
      const x = (b.x0 + b.x1) / 2, z = (b.z0 + b.z1) / 2;
      stats.coconuts += 2;
      if (m.fx) m.fx.emit('prop-bits', x, map.heightAt(x, z), z, { kind: 'palm', onLand: (p, speed) => ev.emit('coconut:landed', { x: p.x, z: p.z, speed }) });
      ev.emit('prop:broken', { kind: 'palm', x, z, speed: e.speed });
    });
    ev.on('game:reset', () => { geysers.length = 0; });
    ev.on('chunk:loaded', (e) => { if (e && e.lod === 0) scanT = 0; });          // furniture arrives with its chunk, not half a second later
    ev.on('quality:changed', clear);

    api = {
      numbers: GEYSER, stats, geysers, placed,
      geyser,
      update(dt) {
        if (!off) { scanT -= dt; if (scanT <= 0) { scanT = 0.5; scan(); } }
        const fx = m.fx, car = m.vehicles.player;
        for (let i = geysers.length - 1; i >= 0; i--) {
          const g = geysers[i];
          g.t -= dt;
          if (g.t <= 0) { geysers.splice(i, 1); ev.emit('geyser:end', { x: g.x, z: g.z }); continue; }
          const k = Math.min(1, g.t / GEYSER.fade);              // shrinking over its last 3 seconds
          if (fx) fx.emit('geyser', g.x, g.y, g.z, { dt, k });
          // it lifts cars: anything over the jet is pushed up to 1.8 m and held there
          const sn = Math.sin(car.h), cs = Math.cos(car.h), rx = g.x - car.x, rz = g.z - car.z, fwd = rx * sn + rz * cs, lat = rx * cs - rz * sn;
          if (Math.abs(fwd) < car.hl + 0.4 && Math.abs(lat) < car.hw + 0.4 && car.lift < GEYSER.top * k) {
            if (car.lift === 0) stats.lifted++;
            car.vy = Math.max(car.vy, GEYSER.lift * k);
          }
          // and anything loose in the debris pool
          if (fx) for (const p of fx.pieces) if (p.life > 0 && p.y < g.y + 6 * k && Math.abs(p.x - g.x) < 0.7 && Math.abs(p.z - g.z) < 0.7) p.vy = Math.max(p.vy, 9 * k);
        }
      },
    };
    ctx.test.breakables = () => ({ ...stats, chunks: placed.size, geysers: geysers.map((g) => ({ x: g.x, z: g.z, t: g.t })),
      kinds: Object.fromEntries(['hydrant', 'table', 'chair', 'fence', 'sign', 'lamp', 'lampLong'].map((k) => [k, props.count(k)])) });
    // stand one prop in front of the player's car, `ahead` metres on: returns where it is
    ctx.test.propAhead = (kind, ahead = 8, side = 0) => {
      const car = m.vehicles.player, s = Math.sin(car.h), c = Math.cos(car.h), x = car.x + s * ahead + c * side, z = car.z + c * ahead - s * side;
      const p = props.add(kind, x, map.heightAt(x, z), z, car.h + Math.PI / 2);
      return p ? { id: p.id, kind, x, z } : null;
    };
    ctx.test.prop = (id) => { const p = props.all.find((q) => q.id === id); return p ? { id, kind: p.kind, state: p.state, tilt: p.tilt, rest: p.rest, hidden: !!p.hidden, x: p.x, y: p.y, z: p.z } : null; };
    return api;
  },
  update(dt) { api.update(dt); },
};
