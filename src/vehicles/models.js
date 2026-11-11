// Vehicle shapes: low-poly bodies made of boxes. One builder per model; the Heron coupe
// is the only one so far. World code may import this file to park cars (see docs/contracts).

import * as THREE from 'three';
import { MeshBuilder } from '../gfx/builder.js';

export const WHEEL_R = 0.36;
export const WHEELS = [[0.84, 1.38], [-0.84, 1.38], [0.84, -1.38], [-0.84, -1.38]]; // x, z (front first)

// Push the body shape into a builder. The car faces +z.
export function addBody(B, paint, accent) {
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

export function addHeadlights(B, color) {
  for (const s of [1, -1]) {
    B.quad([s * 0.65 - 0.22, 0.60, 2.175], [s * 0.65 + 0.22, 0.60, 2.175],
           [s * 0.65 + 0.22, 0.71, 2.175], [s * 0.65 - 0.22, 0.71, 2.175], color);
  }
}
export function addTaillights(B, color) {
  B.quad([0.86, 0.70, -2.155], [-0.86, 0.70, -2.155], [-0.86, 0.83, -2.155], [0.86, 0.83, -2.155], color);
}

export const bodyMat = new THREE.MeshLambertMaterial({ vertexColors: true });

// A parked car: everything baked into one mesh, one draw call.
export function createParkedCar(paint, accent) {
  const B = new MeshBuilder();
  addBody(B, paint, accent);
  addHeadlights(B, 0xf4f0d8);
  addTaillights(B, 0xa01828);
  for (const [x, z] of WHEELS) B.cylX(x, WHEEL_R, z, WHEEL_R, 0.3, 0x15141a, 0x8a8a96, 8);
  return new THREE.Mesh(B.build(), bodyMat);
}
