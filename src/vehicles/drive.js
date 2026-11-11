// The traffic driver: a car on rails. It follows its lane by distance, keeps a 2 second gap to
// whatever is ahead, stops at red lights and stop lines, waits its turn at junctions and follows
// a short curve to the lane it picked (plan/bible/systems/traffic.md). No three.js in here.
// A car's driver state is car.ai; W is what the driver can see: { cars, others, signals, time, rnd, honk }.

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const angle = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const RANK = { street: 0, avenue: 1, boulevard: 2 };
export const RULES = { gapSeconds: 2.0, standstill: 2.5, cone: 20, comfortable: 3.5, hard: 8, turnSpeed: 6.5, uTurnSpeed: 4, cutOff: 1.2 };

export function turnKind(from, to) {
  const t = angle(to.heading - from.heading);
  return Math.abs(t) < 0.3 ? 's' : Math.abs(t) > 2.6 ? 'u' : t < 0 ? 'r' : 'l';
}

// The curve across a junction from the end of one lane to the start of the next: a quadratic
// whose middle point is where the two lanes' lines meet.
export function makeCurve(from, to, kind) {
  const x0 = from.bx, z0 = from.bz, x1 = to.ax, z1 = to.az, fx = Math.sin(from.heading), fz = Math.cos(from.heading);
  let cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  if (kind === 'u') { cx += fx * 7; cz += fz * 7; }
  else if (kind !== 's') { const t = (x1 - x0) * fx + (z1 - z0) * fz; cx = x0 + fx * t; cz = z0 + fz * t; }
  const len = (Math.hypot(cx - x0, cz - z0) + Math.hypot(x1 - cx, z1 - cz) + Math.hypot(x1 - x0, z1 - z0)) / 2;
  return { x0, z0, cx, cz, x1, z1, len: Math.max(1, len) };
}

// Pick a legal lane to take at the far end: straight 0.6, right 0.2, left 0.2, over what is there.
// A taxi likes avenues twice as much.
export function pickNext(c, nav, rnd) {
  const ai = c.ai, lane = ai.lane;
  let total = 0, pick = null;
  const opts = [];
  for (const id of lane.next) {
    const to = nav.lane(id); if (!to) continue;
    const kind = turnKind(lane, to);
    let w = kind === 's' ? 0.6 : kind === 'u' ? 0.05 : 0.2;
    if (c.model === 'taxi' && to.kind === 'avenue') w *= 2;
    opts.push(to, kind, w); total += w;
  }
  let r = rnd() * total;
  for (let i = 0; i < opts.length; i += 3) { r -= opts[i + 2]; if (r <= 0 || i === opts.length - 3) { pick = i; break; } }
  ai.next = pick === null ? null : opts[pick];
  ai.kind = pick === null ? 's' : opts[pick + 1];
  ai.nextCurve = ai.next ? makeCurve(lane, ai.next, ai.kind) : null;
}

export function startOn(c, lane, s, nav, rnd) {
  c.ai = { lane, s, next: null, kind: 's', nextCurve: null, curve: null, u: 0, from: null, node: null, turn: 's', granted: false,
    lat: 0, latGoal: 0, latV: 0, hOff: 0, state: 'cruise', stopT: 0, waitT: 0, arriveT: 0, enterT: 0, honkT: 0, swerveT: 0, blockedT: 0,
    gapS: null, red: false, sinceRed: 9, crossedRed: 0, unseenT: 0, k: 0 };
  pickNext(c, nav, rnd);
  place(c);
}

// Put the car where its lane distance (or its place on the junction curve) says.
export function place(c) {
  const ai = c.ai;
  let x, z, h;
  if (ai.curve) {
    const q = ai.curve, u = clamp(ai.u, 0, 1), v = 1 - u;
    x = v * v * q.x0 + 2 * v * u * q.cx + u * u * q.x1; z = v * v * q.z0 + 2 * v * u * q.cz + u * u * q.z1;
    h = Math.atan2(v * (q.cx - q.x0) + u * (q.x1 - q.cx), v * (q.cz - q.z0) + u * (q.z1 - q.cz));
  } else {
    const l = ai.lane, fx = Math.sin(l.heading), fz = Math.cos(l.heading);
    x = l.ax + fx * ai.s; z = l.az + fz * ai.s; h = l.heading;
  }
  // sideways offset: positive is to the right of travel
  c.x = x - Math.cos(h) * ai.lat; c.z = z + Math.sin(h) * ai.lat;
  c.h = h - Math.atan2(ai.latV, Math.max(c.vf, 3)) + ai.hOff;
}

// How far ahead something sits in the car's path, or -1: the "cone" for things that are not in a lane.
let sideOf = 0;
function corridor(c, o, range) {
  const fx = Math.sin(c.h), fz = Math.cos(c.h), dx = o.x - c.x, dz = o.z - c.z, fwd = dx * fx + dz * fz;
  if (fwd <= 0 || fwd > range + o.hl + c.hl) return -1;
  const side = -dx * fz + dz * fx, turn = Math.abs(Math.sin(o.h - c.h));
  const across = o.hw + (o.hl - o.hw) * turn, along = o.hl - (o.hl - o.hw) * turn;
  if (Math.abs(side) > c.hw + across + 0.35 + fwd * 0.02) return -1;
  sideOf = side;
  return Math.max(0, fwd - c.hl - along);
}

// where a car is coming from, going to and how it turns, whether it is in the junction or still at the line
const fromOf = (a) => (a.curve ? a.from : a.lane), toOf = (a) => (a.curve ? a.lane : a.next), kindOf = (a) => (a.curve ? a.turn : a.kind);
// May two cars be in the same junction together? Only when their paths do not meet.
function compatible(a, b) {
  const fa = fromOf(a), fb = fromOf(b);
  if (fa === fb) return true;
  if (toOf(a) === toOf(b)) return false;
  const d = Math.abs(angle(fa.heading - fb.heading)), ka = kindOf(a), kb = kindOf(b);
  if (d < 0.3) return true;                                   // side by side, the same way
  if (d < 2.8) return false;                                  // crossing roads
  if (ka === 'u' || kb === 'u') return false;
  return (ka === 's' || ka === 'r') && (kb === 's' || kb === 'r');   // oncoming: only a left turn crosses
}

const nodeRank = new Map();
function topRank(node) {
  let r = nodeRank.get(node);
  if (r === undefined) { r = 0; for (const l of node.in) r = Math.max(r, RANK[l.kind] || 0); nodeRank.set(node, r); }
  return r;
}

// May this car go into the junction at the end of its lane? gapLine: metres from its nose to the line.
function mayEnter(c, W, gapLine) {
  const ai = c.ai, lane = ai.lane, node = lane.to, next = ai.next;
  if (!next) return false;
  const force = ai.waitT > 25;                                  // nobody waits for ever
  const minor = !lane.signal && (RANK[lane.kind] || 0) < topRank(node);
  if (lane.signal) {
    const sig = W.signals.state(lane);
    if (sig === 'red' && gapLine > -0.5) return false;
    if (sig === 'amber' && gapLine > c.vf * 1.2 && gapLine > -0.5) return false;
  } else if (!ai.granted && (minor || topRank(node) === 0) && ai.stopT < 1) return false;     // a stop line: a full second
  if (force) return true;
  for (let i = 0; i < W.cars.length; i++) {
    const o = W.cars[i], oa = o.ai;
    if (o === c) continue;
    const here = oa.curve ? oa.node === node : oa.lane.to === node;
    if (here) {
      // someone in the junction (or already waved in) whose path meets mine
      if ((oa.curve || oa.granted) && !compatible(ai, oa)) return false;
      if (!oa.curve && !oa.granted && !ai.granted) {
        const dist = oa.lane.len - oa.s, coming = o.vf > 1 && dist < 4 * o.vf + 6;
        // first in, first out at a stop line
        if (!lane.signal && oa.arriveT > 0 && oa.arriveT < ai.arriveT && !compatible(ai, oa)) return false;
        // a side street waits for the main road; a left turn waits for a 4 second gap in oncoming cars
        if (coming && minor && (RANK[oa.lane.kind] || 0) > (RANK[lane.kind] || 0)) return false;
        if (coming && (ai.kind === 'l' || ai.kind === 'u') && Math.abs(angle(oa.lane.heading - lane.heading)) > 2.8 && oa.kind !== 'l') return false;
      }
    }
    // the box rule: nobody enters unless the exit lane has room
    if (!oa.curve && oa.lane === next && o.vf < 1.5 && oa.s < c.hl + o.hl + 3.5) return false;
  }
  if (gapLine < 3) ai.granted = true;
  return true;
}

// One step of driving for one car. dt may be several fixed steps for a far car.
export function drive(c, dt, W, nav) {
  const ai = c.ai, inJ = !!ai.curve, lane = ai.lane, v = c.vf;
  let limit = lane.speed, gap = 80, vAhead = limit, what = null, body = null, bodySide = 0;

  // 1 the car ahead, by lane order
  for (let i = 0; i < W.cars.length; i++) {
    const o = W.cars[i], oa = o.ai;
    if (o === c) continue;
    let d = -1;
    if (!inJ) {
      if (!oa.curve) { if (oa.lane === lane) { if (oa.s > ai.s) d = oa.s - ai.s; } else if (oa.lane === ai.next) d = lane.len - ai.s + ai.nextCurve.len + oa.s; }
      else if (oa.from === lane) d = lane.len - ai.s + oa.u * oa.curve.len;
    } else if (oa.curve) {
      if (oa.from === ai.from && oa.lane === lane) { if (oa.u > ai.u) d = (oa.u - ai.u) * ai.curve.len; }
      else if (oa.node === ai.node && oa.enterT < ai.enterT) { const g = corridor(c, o, 9); if (g >= 0 && g < gap) { gap = g; vAhead = 0; what = 'car'; } }
    } else if (oa.lane === lane) d = (1 - ai.u) * ai.curve.len + oa.s;
    if (d < 0) continue;
    d -= c.hl + o.hl;
    if (d < gap) { gap = Math.max(0, d); vAhead = o.vf; what = 'car'; }
  }
  // 2 anything in the path that is not in a lane: the player, a car knocked loose, a wreck
  for (let i = 0; i < W.others.length; i++) {
    const o = W.others[i], g = corridor(c, o, RULES.cone);
    if (g < 0 || g >= gap) continue;
    gap = g; what = 'body'; body = o; bodySide = sideOf;
    vAhead = Math.max(0, (Math.sin(o.h) * o.vf + Math.cos(o.h) * o.vl) * Math.sin(c.h) + (Math.cos(o.h) * o.vf - Math.sin(o.h) * o.vl) * Math.cos(c.h));
  }
  // 3 the line at the end of the lane: a red light, a stop line, a junction that is not free
  let dLine = 0;
  ai.red = false;
  if (!inJ) {
    dLine = lane.len - ai.s;
    const gapLine = dLine - c.hl;
    if (gapLine < 3 && v < 0.3) { ai.stopT += dt; if (!ai.arriveT) ai.arriveT = W.time; }
    if (gapLine < 60 && !mayEnter(c, W, gapLine)) {
      ai.granted = false;
      if (lane.signal && W.signals.state(lane) !== 'green') ai.red = true;
      if (gapLine + 2 < gap) { gap = Math.max(0, gapLine + 2); vAhead = 0; what = 'line'; }
    }
    const vt = ai.kind === 's' ? limit : ai.kind === 'u' ? RULES.uTurnSpeed : RULES.turnSpeed;
    limit = Math.min(limit, Math.sqrt(vt * vt + 5 * Math.max(0, dLine)));
  } else if (ai.turn !== 's') limit = ai.turn === 'u' ? RULES.uTurnSpeed : RULES.turnSpeed;

  // 4 the following rule
  const pull = c.preset.pull, want = RULES.gapSeconds * v + RULES.standstill;
  const free = v > limit + 0.5 ? -RULES.comfortable : pull * (1 - v / limit);
  const follow = 0.6 * (gap - want) + 1.2 * (vAhead - v);
  let a = clamp(Math.min(free, follow), -RULES.hard, pull);
  if (gap < 0.5 * v + 1) a = -RULES.hard;

  // cut off: honk, brake hard and lean away
  ai.honkT -= dt; ai.swerveT -= dt;
  if (what === 'body') {
    const ttc = gap / Math.max(0.1, v - vAhead);
    if (ttc < RULES.cutOff && v > 3) {
      a = -RULES.hard;
      if (ai.swerveT <= 0) { ai.swerveT = 4; ai.latGoal = bodySide > 0 ? -1.3 : 0.5; }
      if (ai.honkT <= 0) { ai.honkT = 2.5; W.honk(c, 0.4 + W.rnd() * 0.5); }
    }
    if (v < 0.3) { ai.blockedT += dt; if (ai.blockedT > 4 && ai.honkT <= 0) { ai.honkT = 3 + W.rnd() * 3; W.honk(c, 0.4 + W.rnd() * 0.5); } }
  } else ai.blockedT = 0;
  if (ai.swerveT <= 0) ai.latGoal = 0;

  c.vf = Math.max(0, v + a * dt);
  c.acc = a;
  const ds = c.vf * dt;
  ai.waitT = c.vf < 0.3 ? ai.waitT + dt : 0;

  // 5 along the lane, or along the curve
  if (!inJ) {
    ai.s += ds;
    if (ai.s >= lane.len) {
      if (ai.next && mayEnter(c, W, -c.hl)) {
        // a light that is not green as the car crosses is written down (the checks read it)
        if (lane.signal && W.signals.state(lane) === 'red' && c.vf > 2) ai.crossedRed++;
        ai.curve = ai.nextCurve; ai.u = (ai.s - lane.len) / ai.curve.len; ai.from = lane; ai.node = lane.to; ai.turn = ai.kind;
        ai.lane = ai.next; ai.enterT = W.time; ai.stopT = 0; ai.arriveT = 0; ai.granted = false;
      } else { ai.s = lane.len; c.vf = 0; }
    }
  } else {
    ai.u += ds / ai.curve.len;
    if (ai.u >= 1) {
      ai.s = (ai.u - 1) * ai.curve.len; ai.curve = null; ai.from = null; ai.node = null; ai.u = 0;
      pickNext(c, nav, W.rnd);
    }
  }

  // 6 sideways: ease towards the goal, faster when moving
  const dl = clamp(ai.latGoal - ai.lat, -1, 1) * 1.6 * Math.min(1, c.vf / 3);
  ai.latV = dl; ai.lat += dl * dt;
  ai.hOff *= Math.exp(-3 * dt);
  place(c);

  // 7 what the driver is doing, for the lights and the checks
  ai.state = ai.swerveT > 0 ? 'swerve' : ai.curve ? 'turn' : c.vf < 0.3 && what ? 'stop' : what && gap < want * 1.15 ? 'follow' : 'cruise';
  ai.gapS = what === 'car' && c.vf > 1 ? gap / c.vf : null;
  c.braking = a < -0.8 || c.vf < 0.2;
  c.blink = ai.curve ? (ai.turn === 'l' || ai.turn === 'u' ? 1 : ai.turn === 'r' ? -1 : 0) : dLine < 32 ? (ai.kind === 'l' || ai.kind === 'u' ? 1 : ai.kind === 'r' ? -1 : 0) : 0;
  c.spin += (c.vf / 0.33) * dt;
}

// Put a car that was knocked loose back on rails: the nearest lane running its way, with its
// sideways offset and heading error eased out as it drives. False if no lane is close enough.
export function rejoin(c, nav, rnd) {
  const l = nav.laneNear(c.x, c.z, c.h);
  if (!l) return false;
  const fx = Math.sin(l.heading), fz = Math.cos(l.heading), dx = c.x - l.ax, dz = c.z - l.az;
  const s = dx * fx + dz * fz, lat = -dx * fz + dz * fx, turn = angle(c.h - l.heading);
  if (s < 1 || s > l.len - 6 || Math.abs(lat) > 5 || Math.abs(turn) > 1.2) return false;
  const h = c.h;
  startOn(c, l, s, nav, rnd);
  c.ai.lat = lat; c.ai.hOff = angle(h - l.heading);
  place(c);
  return true;
}
