// Cameras: the chase view, a close chase view (C), and look-back (hold B).
// Rig numbers from plan/bible/systems/driving.md ("Cameras").

import * as THREE from 'three';

const RIGS = {
  chase: { dist: 7.4, more: 1.6, height: 2.9, pDist: 9.5, pHeight: 3.6, fov: 60, pFov: 78 },
  close: { dist: 4.6, more: 0.8, height: 1.7, pDist: 6.2, pHeight: 2.2, fov: 64, pFov: 80 },
};
const STEPS = [1, 0.8, 0.62, 0.45, 0.3, 0.15];

export function createCameras(camera, world, car, fx) {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;   // no shake, no speed zoom
  const camPos = new THREE.Vector3(), look = new THREE.Vector3(), side = new THREE.Vector3(), upv = new THREE.Vector3();
  let camYaw = car.h, ready = false, wasBack = false, portrait = false;
  const cams = {
    mode: 'chase', lookBack: false,
    next() { cams.mode = cams.mode === 'chase' ? 'close' : 'chase'; ready = false; return cams.mode; },
    snap() { camYaw = car.h; ready = false; },
    resize(w, h) { camera.aspect = w / h; portrait = h > w; camera.updateProjectionMatrix(); },
    // extra shake above 120 km/h, in metres
    speedShake() { return calm ? 0 : 0.03 * Math.max(0, Math.min(1, (car.kmh - 120) / 80)); },
    update(dt, back) {
      const rig = RIGS[cams.mode];
      // in a slide the camera aims part of the way toward where the car is going, so the car shows its side
      const aim = car.h + (car.slip > 0.2 && car.vf > 2 ? 0.3 * car.slipSigned : 0);
      let d = aim - camYaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      camYaw += d * (1 - Math.exp(-dt * 4));
      const ratio = Math.min(1, Math.abs(car.vf) / car.maxSpeed);
      const dist = (portrait ? rig.pDist : rig.dist) + ratio * rig.more, height = portrait ? rig.pHeight : rig.height;
      const yaw = back ? camYaw + Math.PI : camYaw;
      const bx = -Math.sin(yaw), bz = -Math.cos(yaw);
      // pull the camera in if it would end up inside a building
      for (const k of STEPS) {
        camPos.set(car.x + bx * dist * k, car.y + height + (1 - k) * 1.2, car.z + bz * dist * k);
        if (!world.insideBuilding(camPos.x, camPos.y, camPos.z, 0.7)) break;
      }
      if (!ready || back !== wasBack) { camera.position.copy(camPos); ready = true; }
      else camera.position.lerp(camPos, 1 - Math.exp(-dt * 9));
      wasBack = back; cams.lookBack = back;
      const ahead = back ? -3 : 3;
      look.set(car.x + Math.sin(car.h) * ahead, car.y + 1.25, car.z + Math.cos(car.h) * ahead);
      camera.lookAt(look);
      if (!calm && (fx.shakeX || fx.shakeY)) {
        side.setFromMatrixColumn(camera.matrix, 0); upv.setFromMatrixColumn(camera.matrix, 1);
        camera.position.addScaledVector(side, fx.shakeX).addScaledVector(upv, fx.shakeY);
      }
      const fov = (portrait ? rig.pFov : rig.fov) + (calm ? 0 : ratio * 10);
      if (Math.abs(fov - camera.fov) > 0.05) { camera.fov = fov; camera.updateProjectionMatrix(); }
    },
  };
  return cams;
}
