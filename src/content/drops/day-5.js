// The day 5 drop: "Bayhaven Blue: Pilot Episode". A big red button on a plinth in the plaza of the
// day 1 block. Walk or drive into it and you are the pilot episode: heat 5 at once, Hurricane Dale,
// every unit in the county. The sign beside it keeps your peak viewers. Only built when the build
// day is 5. Two draw calls (the plinth and button; the sign's face).

import * as THREE from 'three';
import { MeshBuilder } from '../../gfx/builder.js';

export const PILOT = { id: 'bayhaven-blue-pilot', title: 'Bayhaven Blue: Pilot Episode', z: 26.5, scanZ: 21, reach: 1.9, rearm: 7, level: 5 };
const FONT = '"Trebuchet MS", "Arial Black", sans-serif';
const fmt = (n) => Math.round(n).toLocaleString('en-US');

// the plaza is the open cell in the block's front row: the middle of the widest gap between its buildings
function findPlaza(collide) {
  let best = null, start = null;
  for (let x = -44; x <= 44; x += 1) {
    const open = !collide.blocked(x, 1, PILOT.scanZ, 0.5);
    if (open && start === null) start = x;
    if ((!open || x === 44) && start !== null) { const w = x - start; if (w < 60 && (!best || w > best.w)) best = { x: (start + x) / 2, w }; start = null; }
  }
  return best && best.w >= 6 ? best.x : 30;
}

function createPilot(ctx) {
  const m = ctx.modules, S = ctx.state, ev = ctx.events, hud = m.hud;
  const x = findPlaza(m.collide) + 4.5, z = PILOT.z, y = m.map.heightAt(x, z);
  const score = { best: Math.round(S.stats.peakViewers || 0), last: 0, live: 0, presses: 0, x, z };
  const pilot = { id: PILOT.id, score, armed: true, pressed: false, running: false, marker: { x, z }, calls: 2 };

  // the plinth, the button's collar and the button itself (a separate mesh would be a call more: it sinks by scale instead)
  const B = new MeshBuilder({ size: 256 });
  B.box(x, y + 0.45, z, 1.1, 0.9, 1.1, 0x23233a);
  B.box(x, y + 0.93, z, 1.24, 0.08, 1.24, 0xffc300);
  B.box(x + 2.3, y + 1.2, z, 0.14, 2.4, 0.14, 0x23233a);                // the sign's post
  B.box(x + 2.3, y + 2.5, z, 2.9, 1.5, 0.16, 0x140c2c);
  const base = new THREE.Mesh(B.build(), new THREE.MeshLambertMaterial({ vertexColors: true }));
  const knob = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), new THREE.MeshBasicMaterial({ color: 0xff2d55, toneMapped: false }));
  knob.position.set(x, y + 1.1, z);
  // the sign's face
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 256;
  const g = canvas.getContext('2d'), tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.35), new THREE.MeshBasicMaterial({ map: tex }));
  face.position.set(x + 2.3, y + 2.5, z + 0.09);
  base.add(knob);                                                       // (the knob is the third, small call)
  ctx.scene.add(base, face);
  pilot.calls = 3; pilot.triangles = B.triangles + 12 + 2;
  if (m.world && m.world.colliders) { m.world.colliders.push({ x0: x - 0.55, x1: x + 0.55, z0: z - 0.55, z1: z + 0.55 }); m.world.colliders.push({ x0: x + 2.2, x1: x + 2.4, z0: z - 0.1, z1: z + 0.1 }); }

  function paint() {
    g.fillStyle = '#140c2c'; g.fillRect(0, 0, 512, 256);
    g.lineWidth = 6; g.strokeStyle = '#ff2d55'; g.strokeRect(8, 8, 496, 240);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#ff2d55'; g.beginPath(); g.roundRect(196, 22, 120, 40, 20); g.fill();
    g.fillStyle = '#fff'; g.font = `900 26px ${FONT}`; g.fillText('LIVE', 256, 43);
    g.font = `italic 900 40px ${FONT}`; g.fillStyle = '#29e6ff'; g.fillText('Bayhaven Blue', 256, 94);
    g.font = `italic 700 26px ${FONT}`; g.fillStyle = '#fff1c9'; g.fillText('Pilot Episode', 256, 132);
    g.font = `700 22px ${FONT}`; g.fillStyle = '#ffa02e';
    g.fillText(pilot.running ? `On air: ${fmt(score.live)} watching` : 'Press the red button. Be the show.', 256, 176);
    g.fillStyle = '#5dff9b'; g.fillText(`Peak viewers: ${fmt(score.best)}`, 256, 214);
    tex.needsUpdate = true;
  }
  const say = () => { pilot.label = pilot.running ? `${PILOT.title}, on air, ${fmt(score.live)} watching` : `${PILOT.title}, peak viewers ${fmt(score.best)}`; if (hud) hud.drop(pilot.label); };
  let dirty = true, wait = 0, away = true;

  function press() {
    if (!pilot.armed || !m.heat || S.heat.level >= PILOT.level) return false;
    pilot.armed = false; pilot.pressed = true; pilot.running = true; score.presses++; score.live = 0; score.last = 0;
    m.heat.set(PILOT.level);
    ev.emit('drop:pilot', { on: true, x, z });
    ev.emit('ui:toast', { text: 'You pressed it. Hurricane Dale is coming', seconds: 4 });
    dirty = true;
    return true;
  }
  ev.on('heat:live', (e) => {
    if (!pilot.running) return;
    score.live = e.viewers; score.last = Math.max(score.last, e.peak);
    if (score.last > score.best) score.best = score.last;
    dirty = true;
  });
  ev.on('heat:cleared', (e) => {
    if (!pilot.running) return;
    pilot.running = false; score.last = Math.max(score.last, e.peak || 0); score.best = Math.max(score.best, score.last);
    ev.emit('drop:pilot', { on: false, peak: score.last, best: score.best });
    ev.emit('ui:toast', { text: `Pilot episode over. Peak viewers ${fmt(score.last)}`, seconds: 5 });
    dirty = true;
  });

  Object.assign(pilot, {
    press,
    reset() { pilot.running = false; pilot.pressed = false; pilot.armed = true; away = true; dirty = true; },
    update(dt, night = 0) {
      const p = S.player, car = m.vehicles && m.vehicles.player, reach = PILOT.reach + (p.mode === 'foot' ? 0 : car ? car.hl : 2), d = Math.hypot(p.x - x, p.z - z);
      // it must be let go of (7 m away, heat gone) before it can be pressed again
      if (!pilot.armed && !pilot.running && S.heat.level === 0 && d > PILOT.rearm) { pilot.armed = true; pilot.pressed = false; }
      if (d > reach + 1) away = true;
      if (d < reach && away && pilot.armed) { away = false; press(); }
      knob.position.y = y + (pilot.pressed ? 1.0 : 1.1);
      knob.material.color.setHex(pilot.pressed ? 0x8a1830 : (Math.floor(performance.now() / 500) % 2 ? 0xff2d55 : 0xff5c7c));
      face.material.color.setScalar(0.75 + Math.min(1, night * 1.6) * 0.25);
      wait -= dt;
      if (dirty && wait <= 0) { dirty = false; wait = 0.5; paint(); say(); }
    },
  });
  return pilot;
}

const drop = {
  day: 5, id: PILOT.id, marker: { x: 27, z: PILOT.z },
  start(ctx) { const pilot = createPilot(ctx); drop.marker = pilot.marker; return pilot; },
  stop() {},
};
export default drop;
