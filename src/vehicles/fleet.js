// Drawing for every car that is not the player's: one InstancedMesh per model (paint and accent
// per instance), one for all wheels, one for all light quads and one for the blob shadows. Each
// frame the live cars are written into the front of each mesh; nothing is added to the scene later.
import * as THREE from 'three';
import { glowTexture } from '../gfx/builder.js';
import { MODEL_IDS, sheet, trafficGeometry, paintMaterial, wheelGeometry, bodyMat, indicatorSpots } from './models.js';

const spotCache = {}, spots = (id) => spotCache[id] || (spotCache[id] = indicatorSpots(id));

const HEAD = [1, 1, 1], TAIL = [1, 0.08, 0.12], AMBER = [1.6, 0.9, 0.1];
const col = new THREE.Color();

export function createFleet(scene, cap) {
  const bodies = {};
  const keys = [];
  for (const id of MODEL_IDS) { keys.push([id, id, false]); if (sheet(id).rider) keys.push([id + '+rider', id, true]); }      // a two-wheeler with someone on it is its own mesh
  for (const [id, model, rider] of keys) {
    const g = trafficGeometry(model, rider), mesh = new THREE.InstancedMesh(g, paintMaterial(), cap);
    const accent = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3);
    g.setAttribute('accent', accent);
    mesh.setColorAt(0, col.set(0xffffff));
    mesh.frustumCulled = false; mesh.count = 0;
    scene.add(mesh);
    bodies[id] = { mesh, accent, n: 0, m: mesh.instanceMatrix.array, c: mesh.instanceColor.array, tris: g.attributes.position.count / 3 };
  }
  const wheels = new THREE.InstancedMesh(wheelGeometry(8), bodyMat, cap * 4);
  const quad = new THREE.PlaneGeometry(1, 1);
  const lights = new THREE.InstancedMesh(quad, new THREE.MeshBasicMaterial({ color: 0xffffff }), cap * 5);
  lights.setColorAt(0, col.set(0xffffff));
  const flat = new THREE.PlaneGeometry(1, 1); flat.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({ map: glowTexture(), color: 0x000000, transparent: true, opacity: 0.6, depthWrite: false });
  const shadows = new THREE.InstancedMesh(flat, shadowMat, cap);
  for (const m of [wheels, lights, shadows]) { m.frustumCulled = false; m.count = 0; scene.add(m); }
  const wm = wheels.instanceMatrix.array, lm = lights.instanceMatrix.array, lc = lights.instanceColor.array, sm = shadows.instanceMatrix.array;
  const paints = new Map();
  const linear = (hex) => { let v = paints.get(hex); if (!v) { col.set(hex); v = [col.r, col.g, col.b]; paints.set(hex, v); } return v; };
  let nw = 0, nl = 0, ns = 0;

  // a matrix turned by `a` about the y axis, scaled, at a place
  function put(arr, i, x, y, z, a, sx, sy, sz) {
    const o = i * 16, c = Math.cos(a), s = Math.sin(a);
    arr[o] = c * sx; arr[o + 1] = 0; arr[o + 2] = -s * sx; arr[o + 3] = 0;
    arr[o + 4] = 0; arr[o + 5] = sy; arr[o + 6] = 0; arr[o + 7] = 0;
    arr[o + 8] = s * sz; arr[o + 9] = 0; arr[o + 10] = c * sz; arr[o + 11] = 0;
    arr[o + 12] = x; arr[o + 13] = y; arr[o + 14] = z; arr[o + 15] = 1;
  }
  function light(car, c, s, lx, ly, lz, face, w, h, rgb, k) {
    if (nl >= cap * 5) return;
    put(lm, nl, car.x + lx * c + lz * s, car.y + ly, car.z - lx * s + lz * c, car.h + face, w, h, 1);
    lc[nl * 3] = rgb[0] * k; lc[nl * 3 + 1] = rgb[1] * k; lc[nl * 3 + 2] = rgb[2] * k;
    nl++;
  }

  const fleet = {
    cap, bodies,
    get calls() { let n = 3; for (const id in bodies) if (bodies[id].n) n++; return n; },
    get instances() { return ns; },
    // cars: a list of vehicles with { x, y, z, h, model, paint, accent, spin, braking, blink, parked }
    draw(cars, night, camX, camZ, time, wheelRange) {
      for (const id in bodies) bodies[id].n = 0;
      nw = nl = ns = 0;
      const blinkOn = (time * 1.5) % 1 < 0.5, far2 = wheelRange * wheelRange;
      for (let k = 0; k < cars.length; k++) {
        const car = cars[k], sh = sheet(car.model), b = bodies[sh.rider && car.ridden ? car.model + '+rider' : car.model];
        if (!b || b.n >= cap) continue;
        const c = Math.cos(car.h), s = Math.sin(car.h), i = b.n++;
        put(b.m, i, car.x, car.y, car.z, car.h, 1, 1, 1);
        if (sh.two) {
          // lean: the up axis tips towards the rider's left by `lean` (a parked one rests on its stand)
          const a = car.ridden ? car.lean || 0 : 0.14, o = i * 16, ca = Math.cos(a), sa = Math.sin(a);
          b.m[o] = c * ca; b.m[o + 1] = -sa; b.m[o + 2] = -s * ca;
          b.m[o + 4] = c * sa; b.m[o + 5] = ca; b.m[o + 6] = -s * sa;
        }
        const p = linear(car.paint), a = linear(car.accent), ac = b.accent.array;
        b.c[i * 3] = p[0]; b.c[i * 3 + 1] = p[1]; b.c[i * 3 + 2] = p[2];
        ac[i * 3] = a[0]; ac[i * 3 + 1] = a[1]; ac[i * 3 + 2] = a[2];
        put(sm, ns++, car.x, car.y + 0.04, car.z, car.h, sh.W + 1.48, 1, sh.L + 1.74);
        // wheels: turned by the car's heading, spun about their axle
        const near = (car.x - camX) * (car.x - camX) + (car.z - camZ) * (car.z - camZ) < far2;
        const spin = near ? car.spin : 0, ca = Math.cos(spin), sa = Math.sin(spin), r = sh.wheelR;
        for (let j = 0; j < 4 && !sh.two; j++) {
          const lx = sh.wheels[j][0], lz = sh.wheels[j][1], o = nw++ * 16, w = sh.wheelW * sh.wheels[j][2];
          wm[o] = c * w; wm[o + 1] = 0; wm[o + 2] = -s * w; wm[o + 3] = 0;
          wm[o + 4] = s * sa * r; wm[o + 5] = ca * r; wm[o + 6] = c * sa * r; wm[o + 7] = 0;
          wm[o + 8] = s * ca * r; wm[o + 9] = -sa * r; wm[o + 10] = c * ca * r; wm[o + 11] = 0;
          wm[o + 12] = car.x + lx * c + lz * s; wm[o + 13] = car.y + r; wm[o + 14] = car.z - lx * s + lz * c; wm[o + 15] = 1;
        }
        // lights: two headlights, one tail strip (bright while braking), indicators while signalling
        const hd = sh.head, tl = sh.tail, lit = car.parked ? 0.55 : 0.75 + night * 0.6;
        light(car, c, s, hd[0], hd[1], hd[2] + 0.005, 0, sh.hs[0], sh.hs[1], HEAD, lit);
        if (hd[0]) light(car, c, s, -hd[0], hd[1], hd[2] + 0.005, 0, sh.hs[0], sh.hs[1], HEAD, lit);
        light(car, c, s, 0, tl[1], tl[2] - 0.005, Math.PI, tl[0], sh.th, TAIL, car.braking ? 1.7 : car.parked ? 0.45 : 0.5 + night * 0.35);
        if (car.blink && blinkOn && near) {
          const side = car.blink > 0 ? 1 : -1, sp = spots(car.model);      // +1 is a left turn; a car's left is its +x
          for (let j = side > 0 ? 0 : 2, e = j + 2; j < e; j++) light(car, c, s, sp[j][0], sp[j][1], sp[j][2], side * Math.PI / 2, sh.two ? 0.14 : 0.3, sh.two ? 0.1 : 0.12, AMBER, 1);
        }
      }
      for (const id in bodies) {
        const b = bodies[id];
        b.mesh.count = b.n;
        if (b.n) { b.mesh.instanceMatrix.needsUpdate = b.mesh.instanceColor.needsUpdate = b.accent.needsUpdate = true; }
      }
      wheels.count = nw; lights.count = nl; shadows.count = ns;
      wheels.instanceMatrix.needsUpdate = lights.instanceMatrix.needsUpdate = lights.instanceColor.needsUpdate = shadows.instanceMatrix.needsUpdate = true;
      shadowMat.opacity = 0.6 - night * 0.25;
    },
    dispose() { for (const id in bodies) scene.remove(bodies[id].mesh); scene.remove(wheels, lights, shadows); },
  };
  return fleet;
}
