// Taking a car from traffic. A driver brakes for Teo standing in the road or at their door; when
// he takes the car the driver gets out the far side, complains in a subtitle and walks off, and
// the game hears crime { kind: 'cartheft', seen }. The getting-in itself is the player module's
// (src/actors/doors.js): it calls vehicles.despawn on the car it takes, which is where this hooks in.
import { THEFT_LINES, DRIVERS } from '../content/vehicles.js';
import { createSubtitle } from './subtitle.js';

const me = { x: 0, z: 0, h: 0, vf: 0, vl: 0, hw: 0.4, hl: 0.4, r: 0.6, walker: true };
const ghost = { x: 0, z: 0, h: 0, vf: 0, vl: 0, hw: 0.3, hl: 0.3, r: 0.45, walker: true };
const near = [];
let sub = null, last = null, count = 0;

export default {
  name: 'cartheft', order: 23, needs: ['traffic'],
  init(ctx) {
    const m = ctx.modules, traffic = m.traffic;
    if (!traffic || traffic.disabled) return { disabled: true, count: 0 };
    sub = createSubtitle();
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    traffic.onTake = (v) => {
      const pl = m.player, foot = pl && pl.mode === 'foot' ? pl.me : null;
      if (!foot || Math.hypot(foot.x - v.x, foot.z - v.z) > 6) return;          // taken off the street by a script, not by him
      // out of the door away from him, facing away from the car
      const c = Math.cos(v.h), s = Math.sin(v.h), lx = (foot.x - v.x) * c - (foot.z - v.z) * s, side = lx > 0 ? -1 : 1, d = v.hw + 0.7;
      const x = v.x + side * d * c, z = v.z - side * d * s, h = v.h + side * Math.PI / 2;
      const kinds = DRIVERS[v.model] || DRIVERS.default, kind = kinds[Math.floor(rnd() * kinds.length)], lines = THEFT_LINES[kind];
      const text = lines[Math.floor(rnd() * lines.length)];
      let driver = null;
      if (m.peds && m.peds.add) driver = m.peds.add(kind, x, z, h);             // a person on the street from here on: they walk off
      // who saw it, apart from the driver: anyone on foot within 30 m, or another driver within 25 m
      let witnesses = 0;
      if (m.peds && m.peds.near) { m.peds.near(v.x, v.z, 30, near); for (const p of near) if (p !== driver) witnesses++; }
      for (const o of traffic.cars) if (o !== v && Math.hypot(o.x - v.x, o.z - v.z) < 25) witnesses++;
      const seen = m.heat && m.heat.witnessed ? !!m.heat.witnessed(v.x, v.z) : witnesses > 0;
      count++; traffic.taken = count;
      last = { model: v.model, kind, text, seen, witnesses, x, z, driver: driver ? driver.id : null };
      sub.show('Driver', text, 3.5);
      ctx.events.emit('ui:toast', { kind: 'subtitle', who: 'Driver', text, seconds: 3.5 });
      ctx.events.emit('crime', { kind: 'cartheft', case: 'carjack', seen, witnesses, x: v.x, z: v.z, model: v.model });
      ctx.events.emit('vehicle:taken', { model: v.model, id: v.id, x: v.x, z: v.z, driver: driver ? driver.id : null, line: text });
    };
    ctx.test.cartheft = () => ({ count, last, subtitle: sub.text(), walkers: traffic.walkers.length });
    return { get count() { return count; }, get last() { return last; }, subtitle: sub };
  },
  update(dt, ctx) {
    const m = ctx.modules, traffic = m.traffic;
    if (!sub) return;
    sub.step(dt);
    const w = traffic.walkers, pl = m.player, foot = pl && pl.mode === 'foot' ? pl.me : null;
    w.length = 0;
    if (!foot) return;
    me.x = foot.x; me.z = foot.z; w.push(me);
    // a driver with someone at their door stays put: the nearest slow car within reach is held
    let best = null, bd = 3.6;
    for (const c of traffic.cars) {
      if (Math.abs(c.vf) > 6) continue;
      const d = Math.hypot(c.x - foot.x, c.z - foot.z) - c.hw;
      if (d < bd) { bd = d; best = c; }
    }
    if (best) { const k = best.hl + 1.3; ghost.x = best.x + Math.sin(best.h) * k; ghost.z = best.z + Math.cos(best.h) * k; w.push(ghost); }
  },
};
