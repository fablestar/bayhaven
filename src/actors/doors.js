// Getting in and out of vehicles. One button within 2.5 m of a door: he walks to the door and
// slides onto the seat in 0.8 s. Out the same way, by whichever door has room. Above 30 km/h he
// bails out and rolls. Any vehicle works: a parked or stopped car becomes the player's car, and
// the car he left stays where it was as a parked one. No three.js in here.
export const DOORS = { reach: 2.5, seconds: 0.8, bailKmh: 30, walk: 3.4, rollDrag: 14, getUp: 1.2 };
const ease = (k) => k * k * (3 - 2 * k);
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export function createDoors({ foot, vehicles, events, state }) {
  const me = foot.me, near = [], pt = { x: 0, z: 0 };
  // a door: beside the body, a little ahead of the middle. side +1 is the car's left (the driver's)
  function door(v, side, out = pt) {
    const c = Math.cos(v.h), s = Math.sin(v.h), off = side * (v.hw + 0.47);
    out.x = v.x + c * off + s * 0.15; out.z = v.z - s * off + c * 0.15;
    return out;
  }
  function seat(v, out = pt) {
    const c = Math.cos(v.h), s = Math.sin(v.h);
    out.x = v.x + c * 0.36 - s * 0.15; out.z = v.z - s * 0.36 - c * 0.15;
    return out;
  }
  const speedOf = (v) => Math.hypot(v.vf || 0, v.vl || 0);
  let from = { x: 0, z: 0, y: 0, h: 0 }, to = { x: 0, z: 0 };

  const doors = {
    act: null,            // null, 'toDoor', 'in', 'out', 'roll', 'getup'
    t: 0, k: 0, veh: null, side: 1,
    placed: [],
    // the nearest door he could use: { veh, side, d } or null
    nearest() {
      near.length = 0;
      if (vehicles.near) vehicles.near(me.x, me.z, DOORS.reach + 4, near);
      if (vehicles.player && !near.includes(vehicles.player)) near.push(vehicles.player);
      for (const v of doors.placed) if (!near.includes(v)) near.push(v);      // stood there this step: not in the street's list yet
      let best = null;
      for (const v of near) {
        if (speedOf(v) > 1.5) continue;                       // taking a moving car from traffic comes with the garage session
        for (const side of [1, -1]) {
          const p = door(v, side), d = Math.hypot(p.x - me.x, p.z - me.z);
          if (d <= DOORS.reach && (!best || d < best.d)) best = { veh: v, side, d };
        }
      }
      return best;
    },
    enter() {
      if (doors.act || !me.grounded) return false;
      const n = doors.nearest();
      if (!n) return false;
      Object.assign(doors, { act: 'toDoor', t: 0, veh: n.veh, side: n.side });
      return true;
    },
    // Make this vehicle the player's car. The player's car is one object that takes on a model and
    // a paint, so the stopped car is taken off the street and the player's car stands in its place.
    adopt(v) {
      const car = vehicles.player;
      if (v === car) return car;
      if (vehicles.spawn) { const left = vehicles.spawn(car.model, car.x, car.z, car.h); left.paint = car.paint; left.accent = car.accent; }
      if (v.slot) v.slot.gone = true;                         // its curb space stays empty now
      vehicles.despawn(v); doors.placed.length = 0;
      car.swap(v.model, v.paint, v.accent);
      car.reset({ x: v.x, z: v.z, h: v.h, y: v.y || 0 });
      return car;
    },
    // out of the car: by a door when slow, a roll when fast. Returns 'out' or 'roll'.
    exit(car) {
      const kmh = speedOf(car) * 3.6, bail = kmh > DOORS.bailKmh;
      let side = 1;
      if (!bail) for (const s of [1, -1]) { const p = door(car, s); if (foot.clear(p.x, p.z, car)) { side = s; break; } }
      const d = door(car, side), sx = d.x, sz = d.z;
      Object.assign(doors, { veh: car, side, t: 0, k: 1 });
      if (bail) {
        foot.place(sx, sz, car.h);
        const f = Math.sin(car.h), c = Math.cos(car.h);
        me.vx = f * car.vf + c * car.vl; me.vz = c * car.vf - f * car.vl;
        doors.act = 'roll'; me.pose = 'roll';
        return 'roll';
      }
      const st = seat(car);
      foot.place(st.x, st.z, car.h);
      from = { x: st.x, z: st.z, y: car.y - 0.1, h: car.h }; to = { x: sx, z: sz };
      doors.act = 'out'; me.pose = 'door';
      return 'out';
    },
    cancel() { doors.act = null; doors.veh = null; },
    // one step of whatever he is in the middle of. Returns 'seated' on the step he sits down.
    step(dt) {
      const v = doors.veh;
      doors.t += dt;
      switch (doors.act) {
        case 'toDoor': {
          if (speedOf(v) > 1.5) { doors.cancel(); return null; }           // it drove off
          const p = door(v, doors.side), dx = p.x - me.x, dz = p.z - me.z, d = Math.hypot(dx, dz);
          if (d < 0.2 || doors.t > 1.1) {
            const car = doors.adopt(v), st = seat(car);
            doors.veh = car; from = { x: me.x, z: me.z, y: me.y, h: me.h }; to = { x: st.x, z: st.z };
            doors.act = 'in'; doors.t = 0; doors.k = 0; me.pose = 'door'; me.vx = me.vz = 0; me.speed = 0;
            return null;
          }
          const sp = Math.min(DOORS.walk, d / dt), h0 = me.h;
          me.vx = dx / d * sp; me.vz = dz / d * sp;
          me.h = wrap(me.h + Math.max(-0.25, Math.min(0.25, wrap(Math.atan2(dx, dz) - me.h))));
          me.yawRate = wrap(me.h - h0) / dt;
          foot.move(dt, null);
          me.pose = 'move';
          return null;
        }
        case 'in': case 'out': {
          const k = Math.min(1, doors.t / DOORS.seconds), e = ease(k), into = doors.act === 'in';
          me.x = from.x + (to.x - from.x) * e; me.z = from.z + (to.z - from.z) * e;
          const ground = foot.groundAt(me.x, me.z, v.y + 0.2);
          me.y = into ? from.y + (v.y - 0.1 - from.y) * e : from.y + (ground - from.y) * e;
          if (into) me.h = wrap(from.h + wrap(v.h - from.h) * e);
          doors.k = into ? e : 1 - e;
          me.vx = me.vz = 0; me.speed = 0; me.yawRate = 0; me.pose = 'door';
          if (k >= 1) {
            doors.act = null;
            if (into) return 'seated';
            foot.place(me.x, me.z, me.h);
          }
          return null;
        }
        case 'roll': {                                         // tumbling along the road until the speed is gone
          const sp = Math.hypot(me.vx, me.vz), cut = Math.max(0, sp - DOORS.rollDrag * dt) / (sp || 1);
          me.vx *= cut; me.vz *= cut; me.yawRate = 0;
          foot.move(dt, v);
          me.pose = 'roll';
          const turns = doors.t / 0.5;
          if (me.speed < 2.5 && turns >= 1 && turns - Math.floor(turns) < 0.1) { doors.act = 'getup'; doors.t = 0; me.vx = me.vz = 0; me.speed = 0; me.pose = 'getup'; }
          return null;
        }
        case 'getup':
          me.pose = 'getup';
          if (doors.t >= DOORS.getUp) { doors.act = null; me.pose = 'idle'; }
          return null;
        default: return null;
      }
    },
  };
  void state;
  return doors;
}
