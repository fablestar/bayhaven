// The car: a low-poly coupe made of boxes, plus simple arcade driving.
// Day 1 keeps the physics small: gas, brake, steering, a little slide, bumping into walls.

import * as THREE from 'three';
import { MeshBuilder, glowTexture } from './builder.js';

const WHEEL_R = 0.36;
const WHEELS = [[0.84, 1.38], [-0.84, 1.38], [0.84, -1.38], [-0.84, -1.38]]; // x, z (front first)

// Push the body shape into a builder. The car faces +z.
function addBody(B, paint, accent) {
  const dark = 0x1b1924, glass = 0x16263c;
  B.box(0, 0.40, 0, 1.92, 0.34, 4.46, dark, { bottom: true });            // sills + bumpers
  B.box(0, 0.74, -0.70, 1.86, 0.40, 2.90, paint);                          // main body
  // wedge nose: the hood slopes down to the front
  const x = 0.93, z0 = 0.75, z1 = 2.17;
  B.hexa([[-x, 0.54, z0], [x, 0.54, z0], [x, 0.54, z1], [-x, 0.54, z1],
          [-x, 0.94, z0], [x, 0.94, z0], [x, 0.74, z1], [-x, 0.74, z1]], paint);
  // cabin: glass, narrower at the top
  B.hexa([[-0.86, 0.94, -1.30], [0.86, 0.94, -1.30], [0.86, 0.94, 0.80], [-0.86, 0.94, 0.80],
          [-0.66, 1.34, -0.85], [0.66, 1.34, -0.85], [0.66, 1.34, 0.20], [-0.66, 1.34, 0.20]], glass, { noTop: true });
  B.box(0, 1.365, -0.325, 1.36, 0.06, 1.09, paint);                        // roof
  // spoiler
  B.box(0, 1.14, -2.02, 1.84, 0.06, 0.34, paint, { bottom: true });
  B.box(0.7, 1.02, -2.0, 0.08, 0.2, 0.2, dark);
  B.box(-0.7, 1.02, -2.0, 0.08, 0.2, 0.2, dark);
  // side stripes
  for (const s of [1, -1]) {
    const sx = s * 0.936;
    const a = [sx, 0.66, -2.1], b = [sx, 0.66, 2.1], c = [sx, 0.73, 2.1], d = [sx, 0.73, -2.1];
    if (s > 0) B.quad(b, a, d, c, accent); else B.quad(a, b, c, d, accent);
  }
}

function addHeadlights(B, color) {
  for (const s of [1, -1]) {
    B.quad([s * 0.65 - 0.22, 0.60, 2.175], [s * 0.65 + 0.22, 0.60, 2.175],
           [s * 0.65 + 0.22, 0.71, 2.175], [s * 0.65 - 0.22, 0.71, 2.175], color);
  }
}
function addTaillights(B, color) {
  B.quad([0.86, 0.70, -2.155], [-0.86, 0.70, -2.155], [-0.86, 0.83, -2.155], [0.86, 0.83, -2.155], color);
}

const bodyMat = new THREE.MeshLambertMaterial({ vertexColors: true });

// A parked car: everything baked into one mesh, one draw call.
export function createParkedCar(paint, accent) {
  const B = new MeshBuilder();
  addBody(B, paint, accent);
  addHeadlights(B, 0xf4f0d8);
  addTaillights(B, 0xa01828);
  for (const [x, z] of WHEELS) B.cylX(x, WHEEL_R, z, WHEEL_R, 0.3, 0x15141a, 0x8a8a96, 8);
  return new THREE.Mesh(B.build(), bodyMat);
}

export function createCar(scene, world) {
  const group = new THREE.Group();
  const body = new THREE.Group(); // leans and squats a little
  group.add(body);

  const B = new MeshBuilder();
  addBody(B, 0xff4f6e, 0x29e6ff);
  body.add(new THREE.Mesh(B.build(), bodyMat));

  const HB = new MeshBuilder(); addHeadlights(HB, 0xffffff);
  const headMat = new THREE.MeshBasicMaterial({ vertexColors: true });
  body.add(new THREE.Mesh(HB.build(), headMat));
  const TB = new MeshBuilder(); addTaillights(TB, 0xffffff);
  const tailMat = new THREE.MeshBasicMaterial({ vertexColors: true });
  body.add(new THREE.Mesh(TB.build(), tailMat));

  const WB = new MeshBuilder();
  WB.cylX(0, 0, 0, WHEEL_R, 0.3, 0x15141a, 0x9a9aa8, 12);
  // a spoke, so you can see the wheels turning
  WB.box(0.155, 0, 0, 0.02, 0.5, 0.1, 0x2a2a34); WB.box(-0.155, 0, 0, 0.02, 0.5, 0.1, 0x2a2a34);
  const wheelGeo = WB.build();
  const wheels = [], pivots = [];
  for (const [x, z] of WHEELS) {
    const pivot = new THREE.Group();
    pivot.position.set(x, WHEEL_R, z);
    const w = new THREE.Mesh(wheelGeo, bodyMat);
    pivot.add(w); group.add(pivot);
    wheels.push(w); pivots.push(pivot);
  }

  // soft shadow under the car
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 6.2),
    new THREE.MeshBasicMaterial({ map: glowTexture(), color: 0x000000, transparent: true, opacity: 0.6, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.04;
  group.add(shadow);

  // headlight beams on the road (only show up when it gets dark)
  const beamMat = new THREE.MeshBasicMaterial({
    map: glowTexture(), color: 0xfff0c8, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(7, 16), beamMat);
  beam.rotation.x = -Math.PI / 2; beam.position.set(0, 0.06, 8.5);
  group.add(beam);

  scene.add(group);

  const MAX_V = 38, MAX_REV = 9;
  const car = {
    group, x: -20, z: 40.5, y: 0, h: Math.PI / 2, // heading: 0 faces +z, grows turning left
    vx: 0, vz: 0, speed: 0, steer: 0, maxSpeed: MAX_V, braking: false,
  };
  let spin = 0, roll = 0, pitch = 0;

  function collide() {
    const fx = Math.sin(car.h), fz = Math.cos(car.h);
    const R = 1.05;
    for (const off of [1.2, -1.2]) {
      let cx = car.x + fx * off, cz = car.z + fz * off;
      for (const b of world.colliders) {
        if (cx < b.x0 - R || cx > b.x1 + R || cz < b.z0 - R || cz > b.z1 + R) continue;
        const px = Math.max(b.x0, Math.min(cx, b.x1)), pz = Math.max(b.z0, Math.min(cz, b.z1));
        let dx = cx - px, dz = cz - pz, d = Math.hypot(dx, dz), push;
        if (d > R) continue;
        if (d < 1e-5) { // centre is inside the box: leave through the nearest side
          const l = cx - b.x0, r = b.x1 - cx, n = cz - b.z0, s = b.z1 - cz, m = Math.min(l, r, n, s);
          dx = 0; dz = 0;
          if (m === l) dx = -1; else if (m === r) dx = 1; else if (m === n) dz = -1; else dz = 1;
          push = m + R;
        } else { dx /= d; dz /= d; push = R - d; }
        car.x += dx * push; car.z += dz * push; cx += dx * push; cz += dz * push;
        const vn = car.vx * dx + car.vz * dz;
        if (vn < 0) { // lose the speed going into the wall, keep sliding along it
          car.vx -= dx * vn * 1.25; car.vz -= dz * vn * 1.25;
          car.vx *= 0.97; car.vz *= 0.97;
        }
      }
    }
  }

  car.update = function (dt, input, night) {
    const thr = input.throttle;
    car.steer += (input.steer - car.steer) * Math.min(1, dt * 7);

    const fx = Math.sin(car.h), fz = Math.cos(car.h);
    const lx = Math.cos(car.h), lz = -Math.sin(car.h);
    let vf = car.vx * fx + car.vz * fz;   // forward speed
    let vl = car.vx * lx + car.vz * lz;   // sideways slide

    car.braking = false;
    let acc = 0;
    if (thr > 0) {
      if (vf < -0.3) { acc = 20; car.braking = true; }
      else acc = 12 * Math.max(0, 1 - vf / MAX_V);
    } else if (thr < 0) {
      if (vf > 0.3) { acc = -24; car.braking = true; }
      else acc = vf > -MAX_REV ? -7 : 0;
    }
    vf += acc * dt;
    // drag + rolling resistance (stronger when coasting, and a lot stronger in the sea)
    const wet = car.z > 80 ? 2.5 : 0;
    vf -= vf * (0.12 + (thr === 0 ? 0.45 : 0) + wet) * dt;
    if (thr === 0 && Math.abs(vf) < 0.25) vf = 0;
    vl *= Math.exp(-6.5 * dt); // tyres grip: sideways speed dies off fast

    // steering: tighter at low speed, gentle at high speed
    const k = Math.min(1, Math.abs(vf) / 34);
    const maxAngle = 0.55 + (0.075 - 0.55) * Math.pow(k, 0.6);
    car.h += (vf / 2.7) * Math.tan(car.steer * maxAngle) * dt;

    car.vx = fx * vf + lx * vl; car.vz = fz * vf + lz * vl;
    car.x += car.vx * dt; car.z += car.vz * dt;

    collide();
    const bd = world.bounds;
    if (car.x < bd.x0) { car.x = bd.x0; if (car.vx < 0) car.vx = 0; }
    if (car.x > bd.x1) { car.x = bd.x1; if (car.vx > 0) car.vx = 0; }
    if (car.z < bd.z0) { car.z = bd.z0; if (car.vz < 0) car.vz = 0; }
    if (car.z > bd.z1) { car.z = bd.z1; if (car.vz > 0) car.vz = 0; }

    car.speed = car.vx * Math.sin(car.h) + car.vz * Math.cos(car.h);
    car.y += (world.heightAt(car.x, car.z) - car.y) * Math.min(1, dt * 14);

    // looks
    group.position.set(car.x, car.y, car.z);
    group.rotation.y = car.h;
    spin += (car.speed / WHEEL_R) * dt;
    for (let i = 0; i < 4; i++) wheels[i].rotation.x = spin;
    pivots[0].rotation.y = pivots[1].rotation.y = car.steer * 0.5;
    const targetRoll = Math.max(-0.07, Math.min(0.07, car.steer * car.speed * 0.004));
    roll += (targetRoll - roll) * Math.min(1, dt * 6);
    pitch += (-acc * 0.0022 - pitch) * Math.min(1, dt * 6);
    body.rotation.z = roll; body.rotation.x = pitch;

    headMat.color.setScalar(0.75 + night * 0.6);
    tailMat.color.setRGB(car.braking ? 1.6 : 0.5 + night * 0.35, car.braking ? 0.16 : 0.04, car.braking ? 0.12 : 0.06);
    beamMat.opacity = night * 0.55;
    shadow.material.opacity = 0.6 - night * 0.25;
  };

  return car;
}
