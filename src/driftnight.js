// The day 2 drop: Drift Night. A neon cone course on the beachfront street, a sign at the
// spawn and a score board on the promenade. Only built when the build day is 2.

import * as THREE from 'three';
import { MeshBuilder } from './builder.js';

const NEON = [0xff3fa4, 0x29e6ff, 0x5dff9b, 0xffa02e];
const FONT = '"Trebuchet MS", "Arial Black", sans-serif';
const fmt = (n) => Math.round(n).toLocaleString('en-US');

export function createDriftNight(scene, world, props, events, hud) {
  const score = { best: 0, last: 0, total: 0, drifts: 0, cones: 0, coneCount: 0 };
  const cone = (x, z, i) => { props.add('cone', x, 0, z, 0, { color: NEON[i % NEON.length] }); score.coneCount++; };

  // the course: a gate, a slalom down the middle of the street, a ring for donuts,
  // and an arc round the outside of the plaza corner
  cone(-58, 33.5, 0); cone(-58, 40.5, 0);
  for (let i = 0; i < 9; i++) cone(-50 + i * 10, 37 + (i % 2 ? 1.3 : -1.3), i + 1);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; cone(-76 + Math.cos(a) * 5, 37 + Math.sin(a) * 5, i); }
  for (let i = 0; i < 7; i++) { const a = (i / 6) * Math.PI / 2; cone(45 + Math.sin(a) * 12.6, 30 + Math.cos(a) * 12.6, i + 2); }

  // one canvas: the sign on the top half, the score board on the bottom half
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const g = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  function glowText(text, x, y, size, color, align = 'center') {
    g.font = `italic 900 ${size}px ${FONT}`; g.textAlign = align; g.textBaseline = 'middle';
    g.shadowColor = color; g.shadowBlur = 16; g.fillStyle = color; g.fillText(text, x, y);
    g.shadowBlur = 0; g.fillStyle = 'rgba(255,255,255,0.75)'; g.fillText(text, x, y);
  }
  function paint() {
    g.shadowBlur = 0; g.fillStyle = '#140c2c'; g.fillRect(0, 0, 512, 512);
    g.lineWidth = 6;
    g.strokeStyle = '#ff3fa4'; g.strokeRect(10, 10, 492, 236);
    g.strokeStyle = '#29e6ff'; g.strokeRect(10, 266, 492, 236);
    glowText('Drift Night', 256, 92, 84, '#ff3fa4');
    glowText('Slide through the cones', 256, 170, 30, '#29e6ff');
    glowText('Space is the handbrake', 256, 210, 24, '#fff1c9');
    glowText('Drift Night scores', 256, 302, 34, '#ff3fa4');
    const rows = [['Best drift', fmt(score.best)], ['Last drift', fmt(score.last)], ['Tonight', fmt(score.total)], ['Cones down', `${score.cones} of ${score.coneCount}`]];
    rows.forEach(([label, value], i) => {
      glowText(label, 40, 352 + i * 38, 28, '#fff1c9', 'left');
      glowText(value, 472, 352 + i * 38, 30, '#5dff9b', 'right');
    });
    tex.needsUpdate = true;
  }

  // a board on two posts, turned to face `yaw`; half = which half of the canvas it shows
  const frame = new MeshBuilder(), face = new MeshBuilder({ uv: true });
  function board(x, z, yaw, w, h, y0, half) {
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const at = (lx, y, lz) => [x + lx * c + lz * s, y, z - lx * s + lz * c];
    frame.box(x, y0 + h / 2, z, w + 0.3, h + 0.3, 0.2, 0x140c2c, { rot: yaw, bottom: true });
    for (const o of [-w / 2 + 0.3, w / 2 - 0.3]) frame.box(...at(o, y0 / 2, 0), 0.16, y0, 0.16, 0x2b2838, { rot: yaw });
    const v0 = half ? 0 : 0.5, v1 = v0 + 0.5;
    face.quad(at(-w / 2, y0, 0.11), at(w / 2, y0, 0.11), at(w / 2, y0 + h, 0.11), at(-w / 2, y0 + h, 0.11), 0xffffff, 1, [0, v0, 1, v0, 1, v1, 0, v1]);
    world.colliders.push({ x0: x - 0.4, x1: x + 0.4, z0: z - 0.4, z1: z + 0.4 });
  }
  board(-11, 46.2, -2.2, 4.2, 2.0, 1.3, 0);      // the sign, facing the spawn
  board(38, 46.4, Math.PI + 0.35, 6.4, 3.1, 2.4, 1);   // the score board, facing the street
  scene.add(new THREE.Mesh(frame.build(), new THREE.MeshLambertMaterial({ vertexColors: true })));
  const faceMat = new THREE.MeshBasicMaterial({ map: tex });
  scene.add(new THREE.Mesh(face.build(), faceMat));

  let dirty = true, wait = 0;
  const show = () => hud.drop(`Drift Night, best drift ${fmt(score.best)}, cones ${score.cones} of ${score.coneCount}`);
  events.on('drift:end', ({ score: s }) => {
    if (s < 1) return;
    score.last = s; score.total += s; score.drifts++; score.best = Math.max(score.best, s);
    dirty = true;
  });
  events.on('prop:broken', ({ kind }) => { if (kind === 'cone') { score.cones++; dirty = true; } });

  return {
    score, triangles: frame.triangles + face.triangles,
    reset() { score.cones = 0; dirty = true; },
    update(dt, night) {
      faceMat.color.setScalar(0.7 + Math.min(1, night * 1.6) * 0.5);
      wait -= dt;
      if (dirty && wait <= 0) { dirty = false; wait = 0.3; paint(); show(); }
    },
  };
}
