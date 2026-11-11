// The rig: a six-box toy person, 1.8 m tall, no knees and no elbows, posed by maths.
// Boxes, pivots and every pose come from plan/bible/art/characters.md (sections 1, 5 and 6).
// The person faces +z and their left is +x. A positive turn round x swings a limb backwards.
//   const rig = createRig('teo'); scene.add(rig.group);
//   rig.update(dt, { state, v, yawRate, air, vy, steer, t, night })
// States: idle, move, wade, jump, fall, sit, drive, door, roll, getup.
import * as THREE from 'three';
import { glowTexture } from '../gfx/builder.js';
import { LOOKS, FACES, CELL, drawSheet, boxes, setFaceUv } from './rigart.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const KEYS = ['hips', 'pitch', 'lean', 'twist', 'roll', 'armL', 'armR', 'outL', 'outR', 'legL', 'legR', 'head', 'tail'];
const BLEND = 0.15;

export function createRig(id = 'teo') {
  const look = LOOKS[id], C = CELL;
  const mat = new THREE.MeshLambertMaterial({ map: drawSheet(look) });
  const mesh = (list) => new THREE.Mesh(boxes(list), mat);
  const flat = (c) => ({ side: c });

  const group = new THREE.Group();            // at the soles, turned to the heading
  const body = new THREE.Group();             // at the hips: bob, crouch, the bail-out roll
  const torso = new THREE.Group();            // leans, twists and rolls above the hips
  group.add(body); body.add(torso);
  // torso, with the chest phone on its stalk and the battery box with its light on the back
  const torsoMesh = mesh([
    { w: 0.40, h: 0.64, d: 0.24, at: [0, 0.32, 0], uv: { side: C.shirt, front: C.front, back: C.back, bottom: C.shorts } },
    { w: 0.03, h: 0.03, d: 0.05, at: [0, 0.40, 0.145], uv: flat(C.ink) },
    { w: 0.09, h: 0.17, d: 0.02, at: [0, 0.40, 0.18], uv: { side: C.ink, front: C.screen } },
    { w: 0.12, h: 0.16, d: 0.05, at: [0, 0.38, -0.145], uv: flat(C.battery) },
    { w: 0.03, h: 0.03, d: 0.02, at: [0, 0.43, -0.18], uv: flat(C.live) },
  ]);
  torso.add(torsoMesh);
  // head: the first box's front face is the face cell. Dark roots as a crop, the bleached block on top
  const head = new THREE.Group(); head.position.set(0, 0.64, 0); torso.add(head);
  const headMesh = mesh([
    { w: 0.38, h: 0.36, d: 0.36, at: [0, 0.18, 0], uv: { side: C.skin, front: C.face(0) } },
    { w: 0.40, h: 0.08, d: 0.38, at: [0, 0.38, -0.01], uv: flat(C.roots) },
    { w: 0.34, h: 0.16, d: 0.30, at: [0, 0.48, 0.06], uv: flat(C.hair) },
  ]);
  head.add(headMesh);
  const limb = (parent, x, y, list) => { const g = new THREE.Group(); g.position.set(x, y, 0); g.add(mesh(list)); parent.add(g); return g; };
  const arm = [{ w: 0.12, h: 0.60, d: 0.12, at: [0, -0.30, 0], uv: { side: C.arm, top: C.shirt, bottom: C.skin } }];
  const leg = [{ w: 0.18, h: 0.80, d: 0.20, at: [0, -0.40, 0], uv: { side: C.leg, top: C.shorts, bottom: C.slide } },
    { w: 0.18, h: 0.06, d: 0.27, at: [0, -0.77, 0.035], uv: flat(C.slide) }];
  const armL = limb(torso, 0.26, 0.60, arm), armR = limb(torso, -0.26, 0.60, arm);
  const legL = limb(body, 0.10, 0, leg), legR = limb(body, -0.10, 0, leg);
  // two shirt tails hinged at the back of the hips: they lift with speed and lag behind turns
  const tail = [{ w: 0.19, h: 0.30, d: 0.02, at: [0, -0.15, 0], uv: flat(C.shirt) }];
  const tailL = limb(torso, 0.10, 0.04, tail), tailR = limb(torso, -0.10, 0.04, tail);
  tailL.position.z = tailR.position.z = -0.13;
  // blob shadow and the pink light's glow at night
  const shadowMat = new THREE.MeshBasicMaterial({ map: glowTexture(), color: 0x000000, transparent: true, opacity: 0.45, depthWrite: false });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), shadowMat);
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.03; group.add(shadow);
  const glowMat = new THREE.SpriteMaterial({ map: glowTexture(), color: look.live, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  const glow = new THREE.Sprite(glowMat); glow.scale.set(0.5, 0.5, 1); glow.position.set(0, 0.43, -0.22); torso.add(glow);
  group.scale.setScalar(look.scale);

  const cur = {}, from = {}, want = {};
  for (const k of KEYS) cur[k] = from[k] = want[k] = 0;
  cur.hips = from.hips = 0.8; cur.outL = cur.outR = 0.06;
  let state = 'idle', blendT = BLEND, blendLen = BLEND, phase = 0, clock = 0, face = 0, faceShown = -1;
  let lookAt = 0, lookFrom = 0, lookT = 0, lookNext = 5, blinkNext = 4, blinkT = 0, tailLag = 0, landT = 1;

  function target(s, dt) {
    const v = s.v || 0, t = s.t || 0, w = want;
    w.hips = 0.8; w.pitch = 0; w.lean = 0; w.twist = 0; w.roll = 0; w.armL = w.armR = 0; w.outL = w.outR = 0.06; w.legL = w.legR = 0; w.head = 0; w.tail = 0;
    let f = FACES.neutral;
    switch (s.state) {
      case 'move': case 'wade': {
        phase += v * dt * 3.4 / (1 + 0.16 * Math.max(0, v - 2));
        const wade = s.state === 'wade';
        const swing = Math.min(1, 0.28 + 0.11 * v) * look.swing * (wade ? 0.7 : 1), sw = Math.sin(phase) * swing;
        w.hips += Math.abs(Math.sin(2 * phase)) * (0.02 + 0.006 * v) * look.bob;
        w.lean = (0.02 + 0.035 * v) * look.lean;
        w.twist = 0.12 * Math.sin(phase) * Math.min(1, v / 3);
        w.roll = clamp(-0.08 * (s.yawRate || 0), -0.25, 0.25);
        const fast = v > 5.2 ? -0.5 : 0;
        w.armL = sw + fast; w.armR = -sw + fast;
        w.outL = w.outR = wade ? 0.5 : Math.min(0.2, 0.06 + 0.02 * v);
        w.legL = clamp(-1.2 * sw, -1.3, 1.3); w.legR = clamp(1.2 * sw, -1.3, 1.3);
        w.head = -w.twist / 2;
        w.tail = Math.min(0.9, 0.12 * v);
        break;
      }
      case 'jump': {                                   // crouch, then up with the arms, then out and kicking
        if (s.air <= 0) { w.hips -= 0.10; break; }
        w.lean = 0.15;
        if (s.vy > 0) { w.armL = w.armR = -2.4; w.legL = -0.9; w.legR = -0.5; }
        else { w.outL = w.outR = 0.9; const k = 0.2 * Math.sin(clock * 6 * 6.2832); w.legL = k; w.legR = -k; }
        if (s.air > 0.4) f = FACES.shocked;
        w.tail = 0.5;
        break;
      }
      case 'fall': {
        w.lean = -0.2;
        const a = 0.5 * Math.sin(clock * 14 * 6.2832), k = 0.4 * Math.sin(clock * 11 * 6.2832);
        w.armL = -2.6 + a; w.armR = -2.6 - a; w.legL = k; w.legR = -k; w.tail = 0.9;
        f = FACES.shocked;
        break;
      }
      case 'sit': w.hips = 0.42; w.lean = -0.08; w.armL = w.armR = -0.5; w.legL = w.legR = -1.45; break;
      case 'drive': {
        const st = s.steer || 0;
        w.hips = 0.42; w.lean = -0.08 + (s.crash || 0); w.roll = clamp(-0.10 * (s.sideG || 0), -0.15, 0.15);
        w.armL = -1.25 + 0.25 * st; w.armR = -1.25 - 0.25 * st; w.legL = w.legR = -1.45; w.head = 0.3 * st;
        break;
      }
      case 'door': {                                   // getting in or out: reach, one stepping leg, easing down to the seat
        const k = clamp(s.k ?? 1, 0, 1);               // 0 standing at the door, 1 on the seat
        w.hips = 0.8 - 0.38 * k; w.lean = -0.08 * k; w.armL = w.armR = -1.0 + 0.5 * k; w.legL = -0.8 - 0.65 * k; w.legR = -1.45 * k;
        break;
      }
      case 'roll': {                                   // bailing out: one full roll round x in 0.5 s
        w.hips = 0.42; w.pitch = t / 0.5 * 6.2832; w.armL = w.armR = -1.0; w.legL = w.legR = -0.9;
        f = FACES.shocked;
        break;
      }
      case 'getup': {                                  // 1.2 s: hips rise, the lean comes back, a push off the ground
        const k = clamp(t / 1.2, 0, 1), up = k < 0.75;
        w.hips = 0.30 + 0.50 * k; w.lean = up ? 1.2 - 0.9 * (k / 0.75) : 0.3 * (1 - (k - 0.75) / 0.25);
        w.armL = w.armR = up ? -1.2 : 0; w.legL = up ? -0.9 * (1 - k / 0.75) : 0; w.legR = 0;
        f = FACES.angry;
        break;
      }
      default: {                                       // idle: breath, sway, a look round now and then, blinks
        w.roll = 0.02 * Math.sin(0.63 * clock);
        lookT += dt;
        if (clock > lookNext) { lookFrom = lookAt; lookAt = (Math.random() - 0.5); lookT = 0; lookNext = clock + 4 + Math.random() * 5; }
        const e = clamp(lookT / 0.4, 0, 1);
        w.head = lookFrom + (lookAt - lookFrom) * e * e * (3 - 2 * e);
      }
    }
    if (s.face !== undefined && f === FACES.neutral) f = s.face;
    return f;
  }

  const rig = {
    group, id, look, state: 'idle', face: 0, pose: cur,
    get phase() { return phase; },
    // meshes and triangles, for the session note
    count() { let meshes = 0, tris = 0; group.traverse((o) => { if (o.isMesh) { meshes++; tris += o.geometry.index.count / 3; } }); return { meshes: meshes + 1, tris }; },
    land() { landT = 0; },                             // the dip of a landing: hips -0.14 in 0.06 s, back in 0.18 s
    snap() { blendT = blendLen; },
    update(dt, s) {
      clock += dt;
      if (s.state !== state) {
        for (const k of KEYS) from[k] = cur[k];
        if (state === 'roll') from.pitch = 0;             // a roll that ended is the same pose as upright
        blendLen = s.state === 'getup' ? 0.1 : BLEND; blendT = 0; state = rig.state = s.state;
      }
      let f = target(s, dt);
      blendT += dt;
      const k = blendT >= blendLen ? 1 : blendT / blendLen;
      for (const key of KEYS) cur[key] = from[key] + (want[key] - from[key]) * k;
      // arms never pass through the torso; legs stay inside ±1.3 except on a seat
      cur.outL = Math.max(0.04, cur.outL); cur.outR = Math.max(0.04, cur.outR);
      landT += dt;
      const dip = landT < 0.06 ? landT / 0.06 : landT < 0.24 ? 1 - (landT - 0.06) / 0.18 : 0;

      body.position.y = cur.hips - 0.14 * dip;
      body.rotation.x = cur.pitch;
      torso.rotation.set(cur.lean, cur.twist, cur.roll);
      torso.scale.y = state === 'idle' ? 1 + 0.012 * Math.sin(1.57 * clock) : 1;
      head.rotation.y = cur.head;
      armL.rotation.set(cur.armL, 0, cur.outL); armR.rotation.set(cur.armR, 0, -cur.outR);
      legL.rotation.x = cur.legL; legR.rotation.x = cur.legR;
      // shirt tails: lift with speed, and trail a turn by 0.15 s
      tailLag += ((s.yawRate || 0) - tailLag) * Math.min(1, dt / 0.15);
      const flare = clamp(tailLag * 0.12, -0.5, 0.5);
      tailL.rotation.set(cur.tail, 0, 0.1 + cur.tail * 0.35 + flare); tailR.rotation.set(cur.tail, 0, -0.1 - cur.tail * 0.35 + flare);

      // the face: blink for 0.12 s every 3 to 6 s unless something louder is on it
      if (clock > blinkNext) { blinkT = 0.12; blinkNext = clock + 3 + Math.random() * 3; }
      if (blinkT > 0) { blinkT -= dt; if (f === FACES.neutral) f = FACES.blink; }
      face = rig.face = f;
      if (face !== faceShown) { faceShown = face; setFaceUv(headMesh.geometry, CELL.face(face)); }
      const night = s.night || 0;
      shadowMat.opacity = 0.45 - 0.2 * night;
      shadow.position.y = 0.03 - (s.lift || 0);        // the shadow stays on the ground under a jump
      shadow.visible = !s.inCar && !s.wet;
      glowMat.opacity = night * 0.9; glow.visible = night > 0.05;
    },
    dispose() { group.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); mat.map.dispose(); mat.dispose(); },
  };
  return rig;
}
