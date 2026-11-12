// The vehicle: one class for the player's car and every traffic car. The driving itself is in
// handling.js and the shapes in models.js; this file holds the class, puts the player's car in the
// scene, bumps it into walls and props, and reports hits.

import * as THREE from 'three';
import { MeshBuilder, glowTexture } from '../gfx/builder.js';
import { DT, SURFACES, createBody, step, ready } from './handling.js';
import { sheet, addModel, addHeadlights, addTaillights, addIndicators, addRider, bodyMat, wheelGeometry } from './models.js';

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
    const ws = sheet(this.model).wheels, [lx, lz] = ws.length === 2 ? ws[i >> 1] : ws[i], c = Math.cos(this.h), s = Math.sin(this.h);
    out.x = this.x + lx * c + lz * s; out.z = this.z - lx * s + lz * c;
    return out;
  }
}

export function createCar(scene, world, props, events, paint = 0xff4f6e, accent = 0x29e6ff, model = 'heron') {
  const group = new THREE.Group();
  const body = new THREE.Group(); // leans and squats a little
  group.add(body);
  const headMat = new THREE.MeshBasicMaterial({ vertexColors: true }), tailMat = new THREE.MeshBasicMaterial({ vertexColors: true });
  const blinkMat = new THREE.MeshBasicMaterial({ vertexColors: true });
  const riderBox = new THREE.Group();         // the rider of a two-wheeler: sits in the body, leaves it when thrown
  let blinkCol = null, blinkState = -1, riderMesh = null, two = false;
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
    // indicators: four amber corner pieces in one unlit mesh, the left pair first
    const IB = new MeshBuilder(); addIndicators(IB, 0xffffff, id);
    const ind = keep(body, new THREE.Mesh(IB.build(), blinkMat));
    blinkCol = ind.geometry.attributes.color; blinkState = -1;
    two = !!s.two;
    scene.remove(riderBox); body.remove(riderBox); riderBox.position.set(0, 0, 0); riderBox.rotation.set(0, 0, 0); riderMesh = null;
    if (s.rider) {
      const RB = new MeshBuilder(); addRider(RB, s.rider, (mask, shade, fn) => fn(mask === 0 ? shade : accent));
      riderMesh = new THREE.Mesh(RB.build(), bodyMat); riderBox.add(riderMesh); made.push(riderMesh); body.add(riderBox);
    }
    for (const [x, z, k] of s.wheels) {
      const pivot = keep(two ? body : group, new THREE.Group());      // a two-wheeler's wheels lean with it
      pivot.position.set(x, s.wheelR, z);
      const w = new THREE.Mesh(wheelGeo, bodyMat);
      w.scale.set(s.wheelW * k, s.wheelR, s.wheelR);
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
  Object.assign(car, { group, speed: 0, kmh: 0, scrape: null, smoking: false, skidding: 0, paint, accent, isPlayer: true,
    lift: 0, vy: 0, hops: 0, thrown: 0, special: false, blink: 0, empty: false, dead: false, body });
  let spin = 0, roll = 0, pitch = 0, acc = 0, scrapeT = 0, hopCool = 0, wasSpecial = false, hopRoll = 0, hopPitch = 0, slipT = 0, pvx = 0, pvz = 0;
  let R = 1.05, offs = [1.2, -1.2];
  const fall = { x: 0, z: 0, vx: 0, vz: 0, h: 0 };
  fit();
  const STUNNED = { steer: 0, gas: 0, brake: 1 / 3, handbrake: false, touch: false };       // a riderless bike slides to rest at 8 m/s2
  // the circles that keep it out of walls: day 2's pair for the first six models; the new ones are
  // sized to the model, so the cart fits a sidewalk and the bus is long
  function fit() {
    if (!car) return;
    const p = car.preset;
    if (!p.fit) { R = 1.05; offs = [1.2, -1.2]; return; }
    R = p.hw + 0.09; offs = [];
    const span = Math.max(0, p.hl - p.hw), n = Math.max(1, Math.ceil(span / (1.6 * R)));
    for (let i = -n; i <= n; i++) offs.push(span * i / n);
    if (!span) offs = [0];
  }

  // put the player in another model (same object, so the camera and the HUD keep their hold on it)
  car.swap = function (id, newPaint, newAccent) {
    if (newPaint !== undefined) { paint = car.paint = newPaint; accent = car.accent = newAccent; }
    car.setModel(id); preset = car.preset; car.gear = 0;
    Object.assign(car, { lift: 0, vy: 0, thrown: 0, lean: 0 });
    dress(car.model); fit();
  };

  // Walls stop the car and let it slide along; light props get knocked over.
  function collide(v) {
    const fx = Math.sin(v.h), fz = Math.cos(v.h);
    let vx = fx * v.vf + fz * v.vl, vz = fz * v.vf - fx * v.vl;
    let hit = 0, hitX = 0, hitZ = 0, nX = 0, nZ = 0, touching = false;
    for (const off of offs) {
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
    Object.assign(car, { lift: 0, vy: 0, thrown: 0, lean: 0 }); seat();
    pvx = Math.sin(car.h) * car.vf + Math.cos(car.h) * car.vl; pvz = Math.cos(car.h) * car.vf - Math.sin(car.h) * car.vl;      // being put somewhere at speed is not a hit
    acc = 0;
  };

  // one fixed step of driving (the test API calls this directly to run time quickly)
  // put the rider back on the seat
  function seat() { if (riderBox.parent !== body) { scene.remove(riderBox); body.add(riderBox); } riderBox.position.set(0, 0, 0); riderBox.rotation.set(0, 0, 0); }
  // Thrown off: the rider tumbles for 1.2 s while the bike slides to rest on its side.
  function throwRider(dv, why) {
    car.thrown = 1.2;
    Object.assign(fall, { x: car.x, z: car.z, vx: pvx * 0.6, vz: pvz * 0.6, h: car.h });
    body.remove(riderBox); scene.add(riderBox);
    events.emit('rider:thrown', { x: car.x, z: car.z, dv, why, model: car.model, damage: Math.max(5, Math.min(35, (dv - 5) * 4)) });
  }
  car.step = function (inp) {
    const special = !!(car.special || inp.special), fx0 = Math.sin(car.h), fz0 = Math.cos(car.h);
    // a hit from another car since the last step shows up as a jump in speed
    const hitDv = Math.hypot(fx0 * car.vf + fz0 * car.vl - pvx, fz0 * car.vf - fx0 * car.vl - pvz);
    car.drive(car.thrown > 0 || car.dead ? STUNNED : inp, env);         // a destroyed car only rolls to a stop
    scrapeT -= DT;
    // the hop (the Flounder): a tap of `special` throws the car 0.49 m up; 0.6 s before the next
    hopCool -= DT;
    if (preset.hop && special && !wasSpecial && car.lift === 0 && hopCool <= 0) {
      car.vy = 4.2; car.hops++;
      hopRoll = 0.25 * Math.sign(inp.steer || 0); car.vl += 0.8 * Math.sign(inp.steer || 0);
      hopPitch = inp.gas > 0.5 ? -0.18 : inp.brake > 0.5 ? 0.18 : 0;
      events.emit('vehicle:hop', { x: car.x, z: car.z, model: car.model });
    }
    wasSpecial = special;
    if (car.vy !== 0 || car.lift > 0) {
      car.lift += car.vy * DT; car.vy -= 18 * DT;
      if (car.lift <= 0) { car.lift = 0; car.vy = 0; hopCool = 0.6; hopRoll = hopPitch = 0; }
    }
    // two wheels: a hard hit, or a long slide, throws the rider
    const fx1 = Math.sin(car.h), fz1 = Math.cos(car.h), nvx = fx1 * car.vf + fz1 * car.vl, nvz = fz1 * car.vf - fx1 * car.vl;
    if (preset.two) {
      if (car.thrown > 0) { car.thrown -= DT; if (car.thrown <= 0) { car.thrown = 0; seat(); } }
      else {
        const dv = Math.max(car.wallHit, hitDv);
        slipT = car.slip > 0.9 && Math.hypot(car.vf, car.vl) > 11.1 ? slipT + DT : 0;
        if (dv >= preset.throwDv) throwRider(dv, 'hit'); else if (slipT >= 0.4) { slipT = 0; throwRider(5, 'slide'); }
      }
    }
    pvx = nvx; pvz = nvz;
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
    group.position.set(car.x, car.y + car.lift, car.z);
    group.rotation.y = car.h;
    spin += (car.vf / wheelR) * dt;
    const rearFrom = wheels.length / 2;
    for (let i = 0; i < wheels.length; i++) wheels[i].rotation.x = car.handbrake && i >= rearFrom ? wheels[i].rotation.x : spin;
    for (let i = 0; i < rearFrom; i++) pivots[i].rotation.y = car.steer * 0.5;
    // cars roll a little out of a turn; two wheels lean into it, and lie down once the rider is off
    const rm = preset.rollMul || 1, cap = rm > 1 ? 0.10 : 0.07;
    const targetRoll = two ? (car.thrown > 0 ? -1.35 * (Math.sign(car.lean) || 1) : -car.lean) : Math.max(-cap, Math.min(cap, car.vf * car.w * 0.0045 * rm)) + (car.lift > 0 ? hopRoll : 0);
    roll += (targetRoll - roll) * Math.min(1, dt * (two ? 10 : 6));
    riderBox.visible = !car.empty;
    if (car.thrown > 0 && riderMesh) {
      // the thrown rider: carried on by the speed they had, over in the air, down on the road
      const t = 1.2 - car.thrown;
      fall.x += fall.vx * dt * Math.max(0, 1 - t); fall.z += fall.vz * dt * Math.max(0, 1 - t);
      riderBox.position.set(fall.x, car.y + Math.max(0, 2.2 * t - 4.5 * t * t) - Math.min(0.55, t * 1.4), fall.z);
      riderBox.rotation.set(Math.min(t * 5, Math.PI / 2 + 6.283), fall.h, 0, 'YXZ');
    }
    const targetPitch = Math.max(-0.06, Math.min(0.06, -car.acc * 0.0022)) + (car.lift > 0 ? hopPitch : 0);
    pitch += (targetPitch - pitch) * Math.min(1, dt * 6);
    body.rotation.z = roll; body.rotation.x = pitch;

    const brakeLight = car.braking || car.handbrake;
    headMat.color.setScalar(0.75 + night * 0.6);
    tailMat.color.setRGB(brakeLight ? 1.6 : 0.5 + night * 0.35, brakeLight ? 0.16 : 0.04, brakeLight ? 0.12 : 0.06);
    // indicators: the side being steered to blinks at 1.5 Hz under 50 km/h; unlit they are dull amber
    car.blink = car.kmh < 50 && car.kmh > 1 && Math.abs(car.steer) > 0.3 ? Math.sign(car.steer) : 0;
    const on = (performance.now() / 1000 * 1.5) % 1 < 0.5 ? car.blink : 0;
    if (on !== blinkState && blinkCol) {
      blinkState = on;
      const half = blinkCol.count / 2;
      for (let i = 0; i < blinkCol.count; i++) { const lit = on !== 0 && (i < half) === (on > 0); blinkCol.setXYZ(i, lit ? 1.6 : 0.19, lit ? 0.9 : 0.07, lit ? 0.1 : 0.005); }
      blinkCol.needsUpdate = true;
    }
    beamMat.opacity = night * 0.8;
    shadowMat.opacity = 0.6 - night * 0.25;
  };

  return car;
}
