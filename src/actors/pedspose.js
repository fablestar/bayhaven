// Poses for street people, as angles: the same maths as the lead's rig (plan/bible/art/characters.md
// section 6), cut down to what a crowd needs. No three.js. poseFor fills `o` for one person:
// hips, dx, yaw, pitch, lean, twist, head, armL, armR, outL, outR, legL, legR, phone, face.
import { FACE } from './pedsfaces.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const DANCE = { bpm: 104, beats: 2, moves: ['arms up', 'step left', 'step right', 'spin'] };

function walk(o, p, v, far) {
  const swing = Math.min(1, 0.28 + 0.11 * v), sw = far ? (Math.sin(p.phase) > 0 ? swing : -swing) * 0.7 : Math.sin(p.phase) * swing;
  o.hips += Math.abs(Math.sin(p.phase * 2)) * (0.02 + 0.006 * v);
  o.lean = 0.02 + 0.035 * v;
  o.twist = 0.12 * Math.sin(p.phase) * Math.min(1, v / 3); o.head = -o.twist / 2;
  o.armL = sw; o.armR = -sw; o.outL = o.outR = Math.min(0.2, 0.06 + 0.02 * v);
  o.legL = clamp(-1.2 * sw, -1.3, 1.3); o.legR = -o.legL;
}

// the flash mob's four moves, two beats each, off one clock
export function dance(o, beat) {
  const move = Math.floor(beat / DANCE.beats) % 4, u = (beat % DANCE.beats) / DANCE.beats, b = Math.sin(beat * Math.PI);
  const env = Math.min(1, u * 5, (1 - u) * 5);
  o.face = FACE.happy;
  o.hips += 0.05 * Math.abs(b);
  if (move === 0) { o.armL = o.armR = -2.8 * env; o.outL = o.outR = 0.3 + 0.3 * b * b; }
  else if (move === 1 || move === 2) {
    const side = move === 1 ? 1 : -1;
    o.dx = side * 0.45 * Math.sin(u * Math.PI);
    o.armL = (-0.6 - 0.5 * b) * env; o.armR = (-0.6 + 0.5 * b) * env; o.outL = o.outR = 0.25;
    o.legL = side * 0.25 * Math.sin(u * Math.PI * 2) * 0.6; o.legR = -o.legL;
    o.twist = side * 0.2 * env;
  } else { o.yaw = Math.PI * 2 * (u * u * (3 - 2 * u)); o.outL = o.outR = 0.9 * env + 0.06; o.armL = o.armR = -0.3 * env; }
  return move;
}

export function poseFor(p, t, o, far) {
  o.hips = 0.80; o.dx = 0; o.yaw = 0; o.pitch = 0; o.lean = 0; o.twist = 0; o.head = 0;
  o.armL = o.armR = 0; o.outL = o.outR = 0.06; o.legL = o.legR = 0; o.phone = false; o.face = p.face;
  const st = p.state, v = p.v, k = p.seed;
  if (p.frozen > 0) { o.armL = o.armR = -0.3; o.face = FACE.shocked; return o; }
  if (st === 'walk' || st === 'cross') {
    if (p.rolls && v > 1.5) {          // a skater: knees are not a thing, so he stands side-on and pushes now and then
      const push = Math.max(0, Math.sin(t * 2.2 + k * 6));
      o.lean = 0.12; o.twist = 0.5; o.head = -0.5; o.outL = o.outR = 0.35; o.legL = 0.15; o.legR = -0.15 + push * 0.5; o.hips = 0.78;
    } else if (v > 0.15) walk(o, p, v, far);
    if (p.annoyed > 0) { o.armR = -2.2 + 0.3 * Math.sin(t * 75); o.face = FACE.angry; }
  } else if (st === 'flee') {
    walk(o, p, v, far); o.armL = o.armR = -2.6; o.outL = o.outR = 0.25; o.face = FACE.shocked;
  } else if (st === 'film') {
    const up = p.t0 <= 0;                 // the phone comes out after a moment
    o.armR = up ? -1.9 + 0.02 * Math.sin(t * 19) : 0; o.outR = up ? -0.09 : 0.06; o.phone = up; o.head = clamp(p.gaze || 0, -0.6, 0.6);
    o.face = up ? FACE.squint : FACE.shocked;
  } else if (st === 'dodge') {
    const u = clamp(p.st / 0.35, 0, 1);
    o.hips += 0.25 * Math.sin(u * Math.PI); o.outL = o.outR = 0.9; o.legL = 0.3; o.legR = -0.3; o.lean = 0.15; o.face = FACE.shocked;
  } else if (st === 'dazed' || st === 'fall') {
    o.pitch = -1.57; o.hips = 0.12; o.outL = 0.7; o.outR = 1.1; o.legL = 0.15; o.legR = -0.25; o.head = 0.5; o.face = st === 'fall' ? FACE.shocked : FACE.dizzy;
  } else if (st === 'getup') {
    const u = clamp(p.st / 1.2, 0, 1), a = clamp(p.st / 0.9, 0, 1);
    o.hips = 0.30 + 0.50 * u; o.pitch = -1.57 * Math.max(0, 1 - u * 3);
    o.lean = u < 0.33 ? 1.2 * u * 3 : 1.2 - 0.9 * a - 0.3 * clamp((p.st - 0.9) / 0.3, 0, 1);
    o.armL = o.armR = -1.2 * (1 - a); o.legL = -0.9 * (1 - a); o.face = FACE.angry;
  } else if (st === 'hang') {
    const sub = p.sub;
    if (sub === 'sit') { o.hips = 0.22; o.lean = -0.08; o.armL = o.armR = -0.5; o.legL = o.legR = -1.45; o.head = 0.3 * Math.sin(t * 0.3 + k * 9); }
    else if (sub === 'sunbathe') {
      o.pitch = -1.57; o.hips = 0.12; o.face = FACE.happy; o.legL = -0.35;
      if (k < 0.5) { o.outL = o.outR = 1.3; } else { o.armL = o.armR = -2.9; o.outL = o.outR = 0.3; }
    } else if (sub === 'lean') { o.pitch = -0.14; o.armL = o.armR = -0.25; o.legR = -0.3; o.head = 0.4 * Math.sin(t * 0.25 + k * 9); }
    else if (sub === 'chat') {
      const blip = Math.max(0, Math.sin(t * 5 + k * 20)) * (Math.sin(t * 0.9 + k * 7) > 0 ? 1 : 0);
      o.armR = -0.6 * blip - 0.3 * blip * blip; o.armL = -0.3 * (1 - blip) * (k > 0.5 ? 1 : 0); o.lean = 0.06 * blip; o.face = blip > 0.5 ? FACE.happy : FACE.neutral;
    } else if (sub === 'phone') { o.armR = -1.15; o.outR = -0.2; o.phone = true; o.lean = 0.1; }
    else if (sub === 'look') { o.head = clamp(p.gaze || 0, -0.9, 0.9); }
    else if (sub === 'shout') { o.armR = -2.2 + 0.3 * Math.sin(t * 75); o.face = FACE.angry; o.head = clamp(p.gaze || 0, -0.9, 0.9); }
    else if (sub === 'wave') { o.armL = -2.6; o.outL = 0.4 * Math.sin(t * 50) + 0.4; o.face = FACE.happy; o.head = clamp(p.gaze || 0, -0.9, 0.9); }
  } else if (st === 'crowd') {
    dance(o, p.beat);
  }
  if (st !== 'crowd' && st !== 'dazed' && st !== 'getup' && o.pitch === 0 && v < 0.15) {
    o.hips += 0.008 * Math.sin(1.57 * t + k * 20);      // breath
  }
  return o;
}
