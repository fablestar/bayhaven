// The vehicle: one class for the player's car and every traffic car. The driving itself is in
// handling.js and the shapes in models.js; this file holds the class, puts the player's car in the
// scene, bumps it into walls and props, and reports hits.

import * as THREE from 'three';
import { MeshBuilder, glowTexture } from '../gfx/builder.js';
import { DT, SURFACES, createBody, step, ready } from './handling.js';
import { sheet, addModel, addHeadlights, addTaillights, bodyMat, wheelGeometry } from './models.js';

let nextId = 1;
// A 2D body with a model's preset. Traffic moves it along a lane and only calls drive() once it
// has been knocked loose; the player's car calls drive() every step.
export class Vehicle {
  constructor(model) {
    Object.assign(this, createBody(ready(model)));
    this.id = nextId++;
    this.setModel(model);
  }
  setModel(model) {
    const p = ready(model);
    this.preset = p; this.model = p.id; this.mass = p.mass; this.hw = p.hw; this.hl = p.hl; this.maxSpeed = p.vTop;
    this.r = Math.hypot(p.hw, p.hl);
    return this;
  }
  drive(inp, env) { step(this, inp, env); }
  // where a wheel touches the road, in world space
  wheelPos(i, out) {
    const [lx, lz] = sheet(this.model).wheels[i], c = Math.cos(this.h), s = Math.sin(this.h);
    out.x = this.x + lx * c + lz * s; out.z = this.z - lx * s + lz * c;
    return out;
  }
}

export function createCar(scene, world, props, events, paint = 0xff4f6e, accent = 0x29e6ff, model = 'heron') {
  const group = new THREE.Group();
  const body = new THREE.Group(); // leans and squats a little
  group.add(body);
  const headMat = new THREE.MeshBasicMaterial({ vertexColors: true }), tailMat = new THREE.MeshBasicMaterial({ vertexColors: true });
  const shadowMat = new THREE.MeshBasicMaterial({ map: glowTexture(), color: 0x000000, transparent: true, opacity: 0.6, depthWrite: false });
  // headlight beams on the road (only show up when it gets dark)
  const beamMat = new THREE.MeshBasicMaterial({
    map: glowTexture(), color: 0xfff0c8, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  const wheelGeo = wheelGeometry(12);
  let wheels = [], pivots = [], made = [], wheelR = 0.36;

  // the shape of one model in one paint: body, lights, four wheels, shadow, beam
  function dress(id) {
    for (const m of made) { m.parent.remove(m); if (m.geometry && m.geometry !== wheelGeo) m.geometry.dispose(); }
    made = []; wheels = []; pivots = [];
    const s = sheet(id), keep = (parent, m) => { parent.add(m); made.push(m); return m; };
    wheelR = s.wheelR;
    const B = new MeshBuilder(); addModel(B, id, paint, accent);
    keep(body, new THREE.Mesh(B.build(), bodyMat));
    const HB = new MeshBuilder(); addHeadlights(HB, 0xffffff, id);
    keep(body, new THREE.Mesh(HB.build(), headMat));
    const TB = new MeshBuilder(); addTaillights(TB, 0xffffff, id);
    keep(body, new THREE.Mesh(TB.build(), tailMat));
    for (const [x, z] of s.wheels) {
      const pivot = keep(group, new THREE.Group());
      pivot.position.set(x, s.wheelR, z);
      const w = new THREE.Mesh(wheelGeo, bodyMat);
      w.scale.set(s.wheelW, s.wheelR, s.wheelR);
      pivot.add(w); wheels.push(w); pivots.push(pivot);
    }
    const shadow = keep(group, new THREE.Mesh(new THREE.PlaneGeometry(s.W + 1.48, s.L + 1.74), shadowMat));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.04;
    const beam = keep(group, new THREE.Mesh(new THREE.PlaneGeometry(8, 24), beamMat));
    beam.rotation.x = -Math.PI / 2; beam.position.set(0, 0.06, 11);
  }
  scene.add(group);

  const car = new Vehicle(model);
  dress(model);
  let preset = car.preset;
  Object.assign(car, { group, speed: 0, kmh: 0, scrape: null, smoking: false, skidding: 0, paint, accent, isPlayer: true });
  let spin = 0, roll = 0, pitch = 0, acc = 0, scrapeT = 0;
  const R = 1.05;

  // put the player in another model (same object, so the camera and the HUD keep their hold on it)
  car.swap = function (id, newPaint, newAccent) {
    if (newPaint !== undefined) { paint = car.paint = newPaint; accent = car.accent = newAccent; }
    car.setModel(id); preset = car.preset; car.gear = 0;
    dress(car.model);
  };

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
    car.drive(inp, env);
    scrapeT -= DT;
    const v = Math.hypot(car.vf, car.vl);
    car.speed = car.vf; car.kmh = v * 3.6;
    const sliding = car.slip >= 0.35 && car.kmh > 40;
    const spinUp = inp.gas > 0.5 && car.vf >= 0 && car.vf < 4 && car.gear === 0 && car.mu > 0.9; // wheelspin from rest
    car.smoking = car.mu > 0.9 && (sliding || (car.handbrake && v > 4) || spinUp);
    // 2 = all four tyres mark the road (hard braking), 1 = the rear pair
    car.skidding = car.mu <= 0.9 ? 0 : (car.braking && car.kmh > 50 && inp.brake > 0.5) ? 2 : (sliding || (car.handbrake && v > 4)) ? 1 : 0;
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
    spin += (car.vf / wheelR) * dt;
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
    shadowMat.opacity = 0.6 - night * 0.25;
  };

  return car;
}
