// What the street does about the player: filming and the followers it pays, the horn, a car on
// the sidewalk, shots. Numbers and the reaction table are in plan/bible/systems/people.md.
import { FACE } from './pedsfaces.js';

const angle = (a) => Math.atan2(Math.sin(a), Math.cos(a));
export const REACT = { range: 40, crash: 4, crashSpeed: 5, driftTail: 2, jump: 3, blast: 6, geyser: 5, filmTail: 2, turn: 2.5, least: 3, perFilmer: 5,
  hornRange: 15, sideRange: 6, shots: 60, freeze: 5, freezeRange: 30 };

export function createReactions(sim, { map, collide, events, state, rnd, setState, flee }) {
  const R = { interest: 0, show: 0, filming: 0, fled: 0, drifting: false, gained: 0, hornWas: false, hornWait: 0 };
  let sayWait = 0, said = -1, owed = 0, brain = 0;
  const canReact = (p) => p.street && (p.state === 'walk' || p.state === 'hang') && !p.hold && p.frozen <= 0;
  const sees = (p) => !collide.ray(p.x, p.z, sim.focus.x, sim.focus.z, 0, 2.5);
  const dist = (p) => Math.hypot(p.x - sim.focus.x, p.z - sim.focus.z);

  function startFilm(p, own = 0) {
    setState(p, 'film'); p.t0 = 0.3 + rnd() * 1.2; p.timer = REACT.filmTail; p.own = own; p.face = FACE.shocked;
    p.hold = null;
  }
  // Something worth watching happened: the timer runs, and everyone who can see it decides once.
  function trigger(seconds, code, x, z) {
    if (x !== undefined && Math.hypot(x - sim.focus.x, z - sim.focus.z) > 60) return;
    if (R.interest <= 0) R.show++;
    R.interest = Math.max(R.interest, seconds);
    const able = [];
    let filming = 0;
    for (const p of sim.list) {
      if (p.state === 'film') { if (dist(p) <= REACT.range) filming++; continue; }
      if (!canReact(p) || dist(p) > REACT.range || !sees(p)) continue;
      if (p.show === R.show) { able.push(p); continue; }
      p.show = R.show;
      const what = p.K[code] || 'L';
      // a crash right beside someone timid sends them running instead
      if (code === 'crash' && x !== undefined && Math.hypot(p.x - x, p.z - z) < 12 && rnd() > p.K.courage + 0.3) { flee(p, x, z); continue; }
      if (what === 'F' && rnd() < p.K.films) { startFilm(p); filming++; continue; }
      able.push(p);
      if (p.state !== 'walk') continue;
      if (what === 'L' || what === 'F') setState(p, 'hang', 'look', seconds + 1);
      else if (what === 'S') { setState(p, 'hang', 'shout', 2); p.face = FACE.angry; }
    }
    // with three or more people in range, at least three always film
    if (filming < REACT.least && filming + able.length >= REACT.least) {
      able.sort((a, b) => dist(a) - dist(b));
      for (const p of able) { if (filming >= REACT.least) break; startFilm(p); filming++; }
    }
  }
  events.on('vehicle:crash', (d) => { if (d.speed >= REACT.crashSpeed) trigger(REACT.crash, 'crash', d.x, d.z); });
  events.on('drift:start', () => { R.drifting = true; trigger(REACT.driftTail, 'stunt'); });
  events.on('drift:end', () => { R.drifting = false; R.interest = Math.max(R.interest, REACT.driftTail); });
  events.on('jump:landed', () => trigger(REACT.jump, 'stunt'));
  events.on('vehicle:blast', (d) => trigger(REACT.blast, 'crash', d && d.x, d && d.z));
  events.on('prop:broken', (d) => { if (d.kind === 'hydrant') trigger(REACT.geyser, 'stunt', d.x, d.z); });
  events.on('weapon:fired', (d) => { if (d && d.melee) return; const x = d && d.x !== undefined ? d.x : sim.focus.x, z = d && d.z !== undefined ? d.z : sim.focus.z;
    for (const p of sim.list) if (p.street && Math.hypot(p.x - x, p.z - z) < REACT.shots) flee(p, x, z); });
  // Mags's Bus Driver Voice: everyone in earshot stands still
  events.on('player:ability', (d) => { if (d && /voice|horn/.test(String(d.id || d.ability || d.name || ''))) R.freeze(); });

  Object.assign(R, {
    trigger, startFilm,
    freeze(seconds = REACT.freeze, range = REACT.freezeRange) { let n = 0; for (const p of sim.list) if (!p.rope && dist(p) <= range) { p.frozen = seconds; n++; } return n; },
    // turn the head, then the body, towards the player
    face(p, dt) {
      const want = angle(Math.atan2(sim.focus.x - p.x, sim.focus.z - p.z) - p.h);
      p.gaze = want;
      if (Math.abs(want) > 0.6) p.h += Math.sign(want) * Math.min(Math.abs(want) - 0.6, REACT.turn * dt);
    },
    film(p, dt) {
      p.t0 -= dt;
      const want = angle(Math.atan2(sim.focus.x - p.x, sim.focus.z - p.z) - p.h);
      p.h += Math.sign(want) * Math.min(Math.abs(want), REACT.turn * dt);
      p.gaze = angle(want - Math.sign(want) * Math.min(Math.abs(want), REACT.turn * dt));
      if (p.own > 0) { p.own -= dt; return; }
      if (R.interest > 0 && dist(p) < REACT.range * 1.5) { p.timer = REACT.filmTail; return; }
      p.timer -= dt;
      if (p.timer <= 0) p.state = 'done';       // peds.js sends them on their way
    },
    step(dt) {
      brain = (brain + 1) % 12;
      const f = sim.focus, heat = state.heat;
      if (R.drifting) R.interest = Math.max(R.interest, REACT.driftTail);
      if (heat.level >= 1 && brain === 0) trigger(0.5, 'crash');          // a chase is always worth filming
      R.interest = Math.max(0, R.interest - dt);
      let filming = 0, frozen = 0;
      for (const p of sim.list) { if (p.state === 'film' && p.t0 <= 0) filming++; if (p.frozen > 0) frozen++; }
      R.filming = filming; R.frozen = frozen;
      // followers: 5 a second for each phone, scaled so a phone's small crowd pays what a big one does
      let gain = 0;
      if (R.interest > 0 || heat.level >= 3) gain += REACT.perFilmer * filming * sim.crowdScale * dt;
      if (heat.level >= 3) gain += heat.viewers / 100 * dt;
      owed += gain * (state.player.live ? 2 : 1);
      if (owed >= 1) { const whole = Math.floor(owed); owed -= whole; state.economy.followers += whole; R.gained += whole; }
      sayWait -= dt;
      if (filming !== said && sayWait <= 0) { said = filming; sayWait = 0.5; events.emit('ped:filming', { count: filming }); }
      if (R.fled && brain === 6) { events.emit('ped:fled', { count: R.fled }); R.fled = 0; }

      const car = sim.car;
      if (!car || f.onFoot) { R.hornWas = false; return; }
      // a car up on the sidewalk or the sand: the people within 6 m run, shout or film, by kind
      if (brain === 9 && Math.hypot(car.vf, car.vl) > 2.8 && map.surfaceAt(car.x, car.z) !== 'road') {
        for (const p of sim.list) {
          if (!canReact(p) || Math.hypot(p.x - car.x, p.z - car.z) > REACT.sideRange) continue;
          const code = p.K.side;
          if (code.includes('R')) flee(p, car.x, car.z);
          else if (code.includes('F')) startFilm(p, 3);
          else if (code.includes('S')) { setState(p, 'hang', 'shout', 2); p.face = FACE.angry; }
        }
      }
      // the horn: people in the way hear it and get clear; the rest look, shout or wave
      R.hornWait -= dt;
      if (sim.horn && (!R.hornWas || R.hornWait <= 0)) {
        R.hornWait = 1; R.horns = (R.horns || 0) + 1;
        for (const p of sim.list) {
          if (!p.street || Math.hypot(p.x - car.x, p.z - car.z) > REACT.hornRange) continue;
          p.heard = 1.5;
          if (p.state !== 'walk' || p.hold) continue;
          const code = p.K.horn;
          if (code === 'L') setState(p, 'hang', 'look', 1.5);
          else if (code === 'S') { setState(p, 'hang', 'shout', 2); p.face = FACE.angry; }
          else if (code === 'V') setState(p, 'hang', 'wave', 2);
        }
      }
      R.hornWas = sim.horn;
    },
  });
  return R;
}
