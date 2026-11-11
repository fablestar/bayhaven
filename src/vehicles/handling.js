// Handling: one 2D body stepped 60 times a second. Position, heading, forward speed,
// sideways speed and spin. No three.js in here, so it can be run and tuned on its own.
// Follows plan/bible/systems/driving.md ("The step").

import { PRESET_ROWS } from '../content/vehicles.js';

export const DT = 1 / 60;
export const GEAR_PULL = [1.30, 1.05, 0.92, 0.80];
const UP = [0.30, 0.55, 0.78], DOWN = [0.24, 0.48, 0.70];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Two arcade aids on top of the bible's step. Without them a held handbrake turn spins the
// car right round and scrubs off nearly all its speed, so a slide can't be held.
//   keep:     share of the speed that sideways grip would scrub off which a sliding car keeps
//   slipSoft: past this slip angle the tail is eased back (a slide settles instead of spinning)
//   rearSlide: rear sideways speed (m/s) past which power keeps the tail out
export const TUNE = { keep: 0.8, slipSoft: 0.75, slipK: 24, slipDamp: 6, rearSlide: 3.0, rearBack: 0.8 };

export const SURFACES = {
  road: { grip: 1.0, drag: 0 },
  sand: { grip: 0.6, drag: 0.5 },
  sea: { grip: 0.5, drag: 2.5 },   // day 1's "a lot stronger in the sea"
};

// One preset per model: top speed, time to 100 km/h and mass are the catalogue's (plan/04 section 3).
// capF / capR: grip caps per axle. a / b: axle distances. hw / hl: half width and half length of
// the collision box. pull: what a traffic driver uses on rails (m/s2).
const preset = (id, top, t100, mass, o) => ({ id, drive: 'front', capF: 15, capR: 17, A: 6, vTop: top / 3.6, t100, mass,
  slideHold: 0.3, lockMul: 1, steerRate: 7, pull: 2.5, solved: false, ...o });
export const PRESETS = {
  heron: preset('heron', 137, 7.5, 1300, { drive: 'rear', A: 6.64, slideHold: 0.35, a: 1.35, b: 1.35, hw: 0.96, hl: 2.23 }),
  snook: preset('snook', 125, 10, 1000, { capF: 16, capR: 16, a: 1.15, b: 1.15, hw: 0.8, hl: 1.85, lockMul: 1.1, steerRate: 8 }),
  tarpon: preset('tarpon', 140, 9, 1500, { a: 1.45, b: 1.45, hw: 0.925, hl: 2.35 }),
  mullet: preset('mullet', 130, 9.5, 1900, { drive: 'rear', capF: 14, capR: 14, a: 1.65, b: 1.65, hw: 0.975, hl: 2.65, lockMul: 0.9, steerRate: 6 }),
  pompano: preset('pompano', 120, 12, 2200, { capF: 13, capR: 14, a: 1.6, b: 1.6, hw: 1.0, hl: 2.6, lockMul: 0.85, steerRate: 5, pull: 2.0 }),
};
PRESETS.taxi = { ...PRESETS.tarpon, id: 'taxi' };      // the Bay Cab is a Tarpon in a yellow coat
for (const id in PRESET_ROWS) { const [top, t100, mass, o] = PRESET_ROWS[id]; PRESETS[id] = preset(id, top, t100, mass, { ...o, fit: true }); }      // day 3's eight

// A preset ready to drive: its pull solved once so 0 to 100 km/h takes the catalogue's time.
export function ready(id) {
  const p = PRESETS[id] || PRESETS.heron;
  if (!p.solved) { solveA(p); p.solved = true; }
  return p;
}

// Solve every preset now (at load), so the first car of a model to spawn costs nothing in a step.
export function readyAll() { for (const id in PRESETS) ready(id); }

export function createBody(preset) {
  return {
    preset, x: 0, z: 0, y: 0, h: 0, vf: 0, vl: 0, w: 0, steer: 0, gear: 0, shiftT: 0,
    slip: 0, slipSigned: 0, sR: 0, rearOut: false, lean: 0, acc: 0, mu: 1, wallHit: 0, braking: false, handbrake: false,
    drift: { active: false, score: 0, mult: 1, held: 0, calm: 0, banked: 0 },
  };
}

function updateGear(v, emit) {
  const r = v.vf / v.preset.vTop;
  if (v.gear < 3 && r > UP[v.gear]) { v.gear++; v.shiftT = 0.18; emit('vehicle:gear', { gear: v.gear + 1, up: true }); }
  else if (v.gear > 0 && r < DOWN[v.gear - 1]) { v.gear--; v.shiftT = 0.18; emit('vehicle:gear', { gear: v.gear + 1, up: false }); }
}

function updateDrift(v, emit) {
  const d = v.drift, kmh = Math.hypot(v.vf, v.vl) * 3.6;
  if (!d.active) {
    if (v.slip >= 0.35 && kmh > 40 && !v.wallHit) {
      d.active = true; d.score = 0; d.mult = 1; d.held = 0; d.calm = 0;
      emit('drift:start', {});
    }
    return;
  }
  d.held += DT;
  d.mult = Math.min(5, 1 + 0.5 * Math.floor(d.held / 2));
  d.score += 6 * v.slip * kmh * d.mult * DT;
  d.calm = v.slip < 0.2 ? d.calm + DT : 0;
  if (v.wallHit) d.score *= 0.5;          // a wall hit banks half
  if (d.calm >= 0.6 || kmh < 30 || v.wallHit) {
    d.active = false; d.banked = Math.round(d.score);
    emit('drift:end', { score: d.banked, wall: !!v.wallHit });
  }
}

// inp: { steer (+1 left), gas 0..1, brake 0..1, handbrake, touch }
// env: { surfaceAt(v), collide(v), emit(name, data) }
export function step(v, inp, env) {
  const p = v.preset, s = env.surfaceAt(v), mu = s.grip;
  v.mu = mu;

  // 1 steering and the touch assist
  const k = Math.min(1, Math.abs(v.vf) / 34);
  const lock = (0.55 + (0.075 - 0.55) * Math.pow(k, 0.6)) * p.lockMul;
  let cmd = inp.steer;
  if (inp.touch && v.slip > 0.15) cmd = 0.7 * cmd + 0.3 * clamp(v.slipSigned / lock, -1, 1);
  v.steer += (cmd - v.steer) * Math.min(1, (inp.touch ? 5 : p.steerRate) * DT);
  const tanD = Math.tan(v.steer * lock);

  // 2 engine, brakes, drag
  if (!p.oneGear) updateGear(v, env.emit);
  let acc = 0;
  v.braking = false;
  if (inp.gas > 0) {
    if (v.vf < -0.3) { acc = 20; v.braking = true; }
    else acc = p.A * (p.oneGear ? 1 : GEAR_PULL[v.gear]) * Math.max(0, 1 - v.vf / p.vTop) * inp.gas;
  }
  if (inp.brake > 0) {
    if (v.vf > 0.3) { acc = -24 * inp.brake; v.braking = true; }
    else acc = v.vf > -9 ? -7 * inp.brake : 0;
  }
  if (v.shiftT > 0) { if (acc > 0) acc *= 0.2; v.shiftT -= DT; }
  if (inp.handbrake) acc = acc * 0.3 - 5 * Math.sign(v.vf);
  acc = clamp(acc, -24 * mu, 14 * mu);
  v.acc = acc; v.handbrake = !!inp.handbrake;
  v.vf += acc * DT;
  const coast = inp.gas === 0 && inp.brake === 0 ? 0.45 : 0;
  v.vf -= v.vf * (s.drag + coast + 0.25 * Math.min(1, v.slip)) * DT;
  if (coast && Math.abs(v.vf) < 0.25 && Math.abs(v.vl) < 0.25) v.vf = 0;

  // 3 grip per axle: decay rate g, cap c; t is weight transfer
  const t = clamp(acc / 24, -1, 1);
  const gF = 6.5 * mu;
  let gR = 6.5 * mu;
  const cF = p.capF * mu * (1 - 0.15 * t);
  let cR = p.capR * mu * (1 + 0.15 * t);
  if (inp.handbrake) { gR = 1.2 * mu; cR = 5 * mu; }
  // power keeps the tail out once it has let go (and until it has nearly come back)
  const out = Math.abs(v.sR);
  v.rearOut = out > TUNE.rearSlide || (v.rearOut && out > TUNE.rearBack);
  if (!inp.handbrake && v.rearOut && inp.gas > 0.5 && p.drive !== 'front') cR *= 1 - p.slideHold;

  // 4 shed sideways speed at each axle, rebuild vl and w
  const before = Math.hypot(v.vf, v.vl);
  let sF = v.vl + v.w * p.a - v.vf * tanD, sR = v.vl - v.w * p.b;
  sF -= clamp(sF * (1 - Math.exp(-gF * DT)), -cF * DT, cF * DT);
  sR -= clamp(sR * (1 - Math.exp(-gR * DT)), -cR * DT, cR * DT);
  v.w = (sF - sR + v.vf * tanD) / (p.a + p.b);
  v.vl = sR + v.w * p.b;
  v.sR = sR;
  // two wheels lean into the turn: up to 0.75 rad, positive to the rider's left
  if (p.two) v.lean = clamp(Math.atan(v.vf * v.w / 9.81) * 0.9, -0.75, 0.75);
  if (before > 5) {
    // a sliding car keeps most of its momentum
    const after = Math.hypot(v.vf, v.vl);
    if (v.slip > 0.2 && after > 0.1 && after < before) {
      const kk = (after + TUNE.keep * Math.min(1, (v.slip - 0.2) * 4) * (before - after)) / after;
      v.vf *= kk; v.vl *= kk;
    }
    // ease the tail back once the slide angle gets big
    const over = v.slip - TUNE.slipSoft;
    if (over > 0) {
      const f = Math.min(1, (before - 5) / 4);
      v.w += Math.sign(v.slipSigned) * over * TUNE.slipK * f * DT;
      v.w *= 1 - Math.min(1, TUNE.slipDamp * over * f * DT);
    }
  }

  // 5 turn the body; left is (fz, -fx)
  const d = v.w * DT, c = Math.cos(d), sn = Math.sin(d);
  const vf = v.vf * c + v.vl * sn, vl = v.vl * c - v.vf * sn;
  v.vf = vf; v.vl = vl;
  v.h += d;
  const fx = Math.sin(v.h), fz = Math.cos(v.h);
  v.x += (fx * v.vf + fz * v.vl) * DT;
  v.z += (fz * v.vf - fx * v.vl) * DT;

  // 6 walls and props
  v.wallHit = 0;
  env.collide(v);

  // 8 slip angle and drift
  v.slipSigned = Math.atan2(v.vl, Math.max(Math.abs(v.vf), 0.5));
  v.slip = Math.abs(v.slipSigned);
  updateDrift(v, env.emit);
}

const FLAT = { surfaceAt: () => SURFACES.road, collide() {}, emit() {} };

// Run the real step on an empty flat road with the gas held down.
// Returns the time to reach `until` m/s (or the speed after `seconds`).
export function straightRun(preset, seconds, until = Infinity) {
  const v = createBody(preset), inp = { steer: 0, gas: 1, brake: 0, handbrake: false };
  const n = Math.round(seconds / DT);
  for (let i = 0; i < n; i++) {
    step(v, inp, FLAT);
    if (v.vf >= until) return { time: (i + 1) * DT, speed: v.vf, x: v.z };
  }
  return { time: seconds, speed: v.vf, x: v.z };
}

// Solve the pull A so the time from rest to 100 km/h (or 90% of top) matches the catalogue.
export function solveA(p) {
  const vRef = Math.min(27.78, 0.9 * p.vTop);
  let lo = 2, hi = 30;
  for (let i = 0; i < 24; i++) {
    const A = (lo + hi) / 2;
    const r = straightRun({ ...p, A }, p.t100 + 1, vRef);      // no need to run past the time wanted
    if (r.speed >= vRef && r.time < p.t100) hi = A; else lo = A;
  }
  p.A = (lo + hi) / 2;
  return p.A;
}
