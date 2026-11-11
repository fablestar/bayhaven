// The car: a low-poly coupe made of boxes. The driving itself is in handling.js;
// this file draws the car, bumps it into walls and props, and reports hits.

import * as THREE from 'three';
import { MeshBuilder, glowTexture } from './builder.js';
import { DT, PRESETS, SURFACES, createBody, step, solveA } from './handling.js';
import { events } from './events.js';

const WHEEL_R = 0.36;
export const WHEELS = [[0.84, 1.38], [-0.84, 1.38], [0.84, -1.38], [-0.84, -1.38]]; // x, z (front first)

// Push the body shape into a builder. The car faces +z.
function addBody(B, paint, accent) {
  const dark = 0x1b1924, glass = 0x16263c;
  B.box(0, 0.36, 0, 1.92, 0.24, 4.46, dark, { bottom: true });            // sills + bumpers
  B.box(0, 0.70, -0.70, 1.86, 0.48, 2.90, paint);                          // main body
  // wedge nose: the hood slopes down to the front
  const x = 0.93, z0 = 0.75, z1 = 2.17;
  B.hexa([[-x, 0.46, z0], [x, 0.46, z0], [x, 0.46, z1], [-x, 0.46, z1],
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

export function createCar(scene, world, props, paint = 0xff4f6e, accent = 0x29e6ff) {
  const group = new THREE.Group();
  const body = new THREE.Group(); // leans and squats a little
  group.add(body);

  const B = new MeshBuilder();
  addBody(B, paint, accent);
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
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(8, 24), beamMat);
  beam.rotation.x = -Math.PI / 2; beam.position.set(0, 0.06, 11);
  group.add(beam);

  scene.add(group);

  const preset = PRESETS.heron;
  solveA(preset); // pull solved so 0 to 100 km/h takes the catalogue's 7.5 s
  const car = createBody(preset);
  Object.assign(car, { group, maxSpeed: preset.vTop, speed: 0, kmh: 0, scrape: null, smoking: false, skidding: 0 });
  let spin = 0, roll = 0, pitch = 0, acc = 0, scrapeT = 0;
  const R = 1.05;

  // Walls stop the car and let it slide along; light props get knocked over.
  function collide(v) {
    const fx = Math.sin(v.h), fz = Math.cos(v.h);
    let vx = fx * v.vf + fz * v.vl, vz = fz * v.vf - fx * v.vl;
    let hit = 0, hitX = 0, hitZ = 0, nX = 0, nZ = 0, touching = false;
    for (const off of [1.2, -1.2]) {
      let cx = v.x + fx * off, cz = v.z + fz * off;
      props.hitTest(cx, cz, R, vx, vz, (prop) => {
        const keep = 1 - Math.min(0.5, 4 * prop.mass / (prop.mass + preset.mass));
        vx *= keep; vz *= keep;
        events.emit('prop:broken', { kind: prop.kind, x: prop.x, z: prop.z, speed: Math.hypot(vx, vz) });
      });
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
        v.x += dx * push; v.z += dz * push; cx += dx * push; cz += dz * push;
        const vn = vx * dx + vz * dz;
        if (vn < 0) { // lose the speed going into the wall, keep sliding along it
          if (-vn > hit) { hit = -vn; hitX = px; hitZ = pz; nX = dx; nZ = dz; }
          vx -= dx * vn * 1.05; vz -= dz * vn * 1.05;
          vx *= 0.97; vz *= 0.97;
          touching = true; if (hit <= -vn) { hitX = px; hitZ = pz; nX = dx; nZ = dz; }
        }
      }
    }
    const bd = world.bounds;
    if (v.x < bd.x0) { v.x = bd.x0; if (vx < 0) vx = 0; }
    if (v.x > bd.x1) { v.x = bd.x1; if (vx > 0) vx = 0; }
    if (v.z < bd.z0) { v.z = bd.z0; if (vz < 0) vz = 0; }
    if (v.z > bd.z1) { v.z = bd.z1; if (vz > 0) vz = 0; }
    v.vf = vx * fx + vz * fz; v.vl = vx * fz - vz * fx;
    if (touching) {
      v.w *= 0.8;
      const along = Math.hypot(vx, vz);
      if (hit > 3) {
        v.wallHit = hit; v.w *= 0.4;
        events.emit('vehicle:crash', { speed: hit, what: 'wall', x: hitX, z: hitZ, nx: nX, nz: nZ });
      } else if (along > 8 && scrapeT <= 0) { // scraping along a wall throws sparks
        scrapeT = 0.08;
        events.emit('vehicle:scrape', { x: hitX, z: hitZ, nx: nX, nz: nZ, speed: along });
      }
    }
  }

  const env = {
    surfaceAt: (v) => (v.z > 80 ? SURFACES.sea : v.z > 50 ? SURFACES.sand : SURFACES.road),
    collide,
    emit: (name, data) => events.emit(name, data),
  };

  car.reset = function (pose) {
    Object.assign(car, { vf: 0, vl: 0, w: 0, steer: 0, gear: 0, shiftT: 0, slip: 0, slipSigned: 0, sR: 0, rearOut: false }, pose);
    car.drift.active = false; car.drift.score = 0;
    acc = 0;
  };

  // one fixed step of driving (the test API calls this directly to run time quickly)
  car.step = function (inp) {
    step(car, inp, env);
    scrapeT -= DT;
    const v = Math.hypot(car.vf, car.vl);
    car.speed = car.vf; car.kmh = v * 3.6;
    const sliding = car.slip >= 0.35 && car.kmh > 40;
    const spinUp = inp.gas > 0.5 && car.vf >= 0 && car.vf < 4 && car.gear === 0 && car.mu > 0.9; // wheelspin from rest
    car.smoking = car.mu > 0.9 && (sliding || (car.handbrake && v > 4) || spinUp);
    // 2 = all four tyres mark the road (hard braking), 1 = the rear pair
    car.skidding = car.mu <= 0.9 ? 0 : (car.braking && car.kmh > 50 && inp.brake > 0.5) ? 2 : (sliding || (car.handbrake && v > 4)) ? 1 : 0;
  };

  // where a wheel touches the road, in world space
  car.wheelPos = function (i, out) {
    const [lx, lz] = WHEELS[i], c = Math.cos(car.h), s = Math.sin(car.h);
    out.x = car.x + lx * c + lz * s; out.z = car.z - lx * s + lz * c;
    return out;
  };

  car.update = function (dt, input, night) {
    acc = Math.min(acc + dt, DT * 4);
    while (acc >= DT) { car.step(input); acc -= DT; }
    car.draw(dt, night);
  };

  car.draw = function (dt, night) {
    car.y += (world.heightAt(car.x, car.z) - car.y) * Math.min(1, dt * 14);
    group.position.set(car.x, car.y, car.z);
    group.rotation.y = car.h;
    spin += (car.vf / WHEEL_R) * dt;
    for (let i = 0; i < 4; i++) wheels[i].rotation.x = car.handbrake && i > 1 ? wheels[i].rotation.x : spin;
    pivots[0].rotation.y = pivots[1].rotation.y = car.steer * 0.5;
    const targetRoll = Math.max(-0.07, Math.min(0.07, car.vf * car.w * 0.0045));
    roll += (targetRoll - roll) * Math.min(1, dt * 6);
    const targetPitch = Math.max(-0.06, Math.min(0.06, -car.acc * 0.0022));
    pitch += (targetPitch - pitch) * Math.min(1, dt * 6);
    body.rotation.z = roll; body.rotation.x = pitch;

    const brakeLight = car.braking || car.handbrake;
    headMat.color.setScalar(0.75 + night * 0.6);
    tailMat.color.setRGB(brakeLight ? 1.6 : 0.5 + night * 0.35, brakeLight ? 0.16 : 0.04, brakeLight ? 0.12 : 0.06);
    beamMat.opacity = night * 0.8;
    shadow.material.opacity = 0.6 - night * 0.25;
  };

  return car;
}
