// Cameras. In a car: the chase view, a close chase view (C) and look-back (hold B), with rig
// numbers from plan/bible/systems/driving.md ("Cameras"). On foot: third person, 4.5 m back and
// 1.7 m up, orbited by the mouse, a finger or the right stick, recentred behind him after 2 s of
// running, pulled in when a wall is in the way. Changing between the two is a 0.7 s glide.

import * as THREE from 'three';

const RIGS = {
  chase: { dist: 7.4, more: 1.6, height: 2.9, pDist: 9.5, pHeight: 3.6, fov: 60, pFov: 78 },
  close: { dist: 4.6, more: 0.8, height: 1.7, pDist: 6.2, pHeight: 2.2, fov: 64, pFov: 80 },
};
export const FOOT_CAM = { dist: 4.5, height: 1.7, pDist: 6.2, fov: 60, pFov: 76, recentre: 2, handover: 0.7, minPitch: -0.3, maxPitch: 1.1 };
const STEPS = [1, 0.8, 0.62, 0.45, 0.3, 0.15];
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export function createCameras(camera, world, car, fx, collide) {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;   // no shake, no speed zoom
  const camPos = new THREE.Vector3(), look = new THREE.Vector3(), side = new THREE.Vector3(), upv = new THREE.Vector3();
  const carPos = new THREE.Vector3(), carLook = new THREE.Vector3(), footPos = new THREE.Vector3(), footLook = new THREE.Vector3();
  let camYaw = car.h, ready = false, wasBack = false, portrait = false, carFov = 60;
  let target = 'car', me = null, mix = 0, footReady = false, pull = 1, eyeY = 0, quiet = 0, ran = 0;

  function carView(dt, back) {
    const rig = RIGS[cams.mode];
    // in a slide the camera aims part of the way toward where the car is going, so the car shows its side
    const aim = car.h + (car.slip > 0.2 && car.vf > 2 ? 0.3 * car.slipSigned : 0);
    camYaw += wrap(aim - camYaw) * (1 - Math.exp(-dt * 4));
    const ratio = Math.min(1, Math.abs(car.vf) / car.maxSpeed);
    const dist = (portrait ? rig.pDist : rig.dist) + ratio * rig.more, height = portrait ? rig.pHeight : rig.height;
    const yaw = back ? camYaw + Math.PI : camYaw;
    const bx = -Math.sin(yaw), bz = -Math.cos(yaw);
    // pull the camera in if it would end up inside a building
    for (const k of STEPS) {
      camPos.set(car.x + bx * dist * k, car.y + height + (1 - k) * 1.2, car.z + bz * dist * k);
      if (!world.insideBuilding(camPos.x, camPos.y, camPos.z, 0.7)) break;
    }
    if (!ready || back !== wasBack) { carPos.copy(camPos); ready = true; }
    else carPos.lerp(camPos, 1 - Math.exp(-dt * 9));
    wasBack = back; cams.lookBack = back;
    const ahead = back ? -3 : 3;
    carLook.set(car.x + Math.sin(car.h) * ahead, car.y + 1.25, car.z + Math.cos(car.h) * ahead);
    carFov = (portrait ? rig.pFov : rig.fov) + (calm ? 0 : ratio * 10);
  }

  function footView(dt) {
    const F = FOOT_CAM, dist = portrait ? F.pDist : F.dist, cp = Math.cos(cams.pitch), sp = Math.sin(cams.pitch);
    const bx = -Math.sin(cams.yaw), bz = -Math.cos(cams.yaw);
    eyeY = footReady ? eyeY + (me.y - eyeY) * Math.min(1, dt * 8) : me.y;        // a jump lifts him, not the whole picture
    // a wall between him and the camera pulls it in at once; it eases back out
    let k = 1;
    const ex = me.x + bx * dist * cp, ez = me.z + bz * dist * cp;
    if (collide && collide.ray) {
      const hit = collide.ray(me.x, me.z, ex + bx * 0.4, ez + bz * 0.4, undefined, 1.6);
      if (hit) k = Math.max(0.12, Math.hypot(hit.x - me.x, hit.z - me.z) / (dist * cp + 0.4) - 0.1);
    }
    pull = k < pull || !footReady ? k : pull + (k - pull) * Math.min(1, dt * 3);
    for (const s of STEPS) {
      const q = pull * s;
      camPos.set(me.x + bx * dist * cp * q, Math.max(0.35, eyeY + F.height + dist * sp * q + (1 - q) * 0.25), me.z + bz * dist * cp * q);
      if (s < 1 || !world.insideBuilding(camPos.x, camPos.y, camPos.z, 0.4)) break;
    }
    if (!footReady) { footPos.copy(camPos); footReady = true; }
    else footPos.lerp(camPos, 1 - Math.exp(-dt * 14));
    footLook.set(me.x - bx * 0.6, eyeY + 1.45, me.z - bz * 0.6);
  }

  const cams = {
    mode: 'chase', lookBack: false, target: 'car',
    yaw: car.h, pitch: 0,       // the orbit on foot; walking is relative to yaw
    get mix() { return mix; },
    next() { cams.mode = cams.mode === 'chase' ? 'close' : 'chase'; ready = false; return cams.mode; },
    snap() { camYaw = car.h; ready = false; footReady = false; pull = 1; if (me && target === 'foot') { cams.yaw = me.h; cams.pitch = 0; } mix = target === 'foot' ? 1 : 0; },
    resize(w, h) { camera.aspect = w / h; portrait = h > w; camera.updateProjectionMatrix(); },
    // extra shake above 120 km/h, in metres
    speedShake() { return calm || target !== 'car' ? 0 : 0.03 * Math.max(0, Math.min(1, (car.kmh - 120) / 80)); },
    // hand the camera to the person on foot, or back to the car. Each starts from where the other looked.
    setTarget(next, body) {
      if (next === target) return;
      target = cams.target = next; me = body || me;
      if (next === 'foot') { cams.yaw = wrap(camYaw); cams.pitch = 0; footReady = false; pull = 1; quiet = ran = 0; }
      else { camYaw = cams.yaw; ready = false; }
    },
    // once a step: the orbit, and the drift back behind him after 2 s of running with the view left alone
    step(dt, a) {
      if (target !== 'foot' || !me) return;
      if (a.lookX || a.lookY) {
        cams.yaw = wrap(cams.yaw - a.lookX);
        cams.pitch = Math.max(FOOT_CAM.minPitch, Math.min(FOOT_CAM.maxPitch, cams.pitch + a.lookY));
        quiet = 0;
      } else quiet += dt;
      ran = me.speed > 2.5 ? ran + dt : 0;
      if (ran > FOOT_CAM.recentre && quiet > FOOT_CAM.recentre) {
        cams.yaw = wrap(cams.yaw + wrap(me.h - cams.yaw) * (1 - Math.exp(-dt * 1.6)));
        cams.pitch += (0 - cams.pitch) * (1 - Math.exp(-dt * 1.6));
      }
    },
    update(dt, back) {
      const want = target === 'foot' ? 1 : 0;
      if (mix !== want) mix = want > mix ? Math.min(1, mix + dt / FOOT_CAM.handover) : Math.max(0, mix - dt / FOOT_CAM.handover);
      if (mix < 1) carView(dt, back);
      if (mix > 0) footView(dt);
      const e = mix * mix * (3 - 2 * mix), footFov = portrait ? FOOT_CAM.pFov : FOOT_CAM.fov;
      let fov;
      if (mix <= 0) { camera.position.copy(carPos); look.copy(carLook); fov = carFov; }
      else if (mix >= 1) { camera.position.copy(footPos); look.copy(footLook); fov = footFov; }
      else { camera.position.lerpVectors(carPos, footPos, e); look.lerpVectors(carLook, footLook, e); fov = carFov + (footFov - carFov) * e; }
      camera.lookAt(look);
      if (!calm && (fx.shakeX || fx.shakeY)) {
        side.setFromMatrixColumn(camera.matrix, 0); upv.setFromMatrixColumn(camera.matrix, 1);
        camera.position.addScaledVector(side, fx.shakeX).addScaledVector(upv, fx.shakeY);
      }
      if (Math.abs(fov - camera.fov) > 0.05) { camera.fov = fov; camera.updateProjectionMatrix(); }
    },
  };
  return cams;
}
