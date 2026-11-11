// LOD2: the far skyline and the ground under everything, one mesh for the whole city, built once
// from the map alone. It shows the city that is coming: the towers of Meridian behind the beach
// and the Spire at the top of Coral Boulevard, plus every beachfront building over 30 m.
import * as THREE from 'three';
import { MeshBuilder } from '../gfx/builder.js';
import { chunkMaterials } from '../gfx/materials.js';
import { rng } from '../core/rng.js';

const TOWER = [0xd9b8c4, 0xb8cfe0, 0xe6d3b8, 0xc4b8e0, 0xb8e0d3, 0xe0e0e6, 0xe8c0b0];
const ROOF = 0x6f6a78, GLASS = 0x2e4a6b;

export function createSkyline(scene, map) {
  const B = new MeshBuilder({ size: 32768 }), rnd = rng(4102), W = map.world;
  // the ground far away, a little under the streamed ground so the two never fight
  const Y = -0.4;
  B.flat(W.x0, W.x1, W.z0, -320, Y, 0x45424f);
  B.flat(-1600, 1600, -320, 50, Y, 0x3b3946);
  B.flat(W.x0, -1600, -320, 50, Y, 0x5f8f5a);
  B.flat(1600, W.x1, -320, 50, Y, 0x77747f);
  B.flat(W.x0, W.x1, 50, 78, -0.3, 0xf2ddb0);
  const ground = B.triangles;
  // a tower: tiers of boxes with dark window bands, cheap enough for hundreds
  function tower(cx, cz, w, d, h, col, tiers = 1) {
    let y = 0, s = 1;
    for (let t = 0; t < tiers; t++) {
      const th = tiers === 1 ? h : h * [0.5, 0.3, 0.2][t], tw = w * s, td = d * s;
      B.box(cx, y + th / 2, cz, tw, th, td, col, { top: ROOF });
      for (let by = y + 10; by < y + th - 4; by += 18) {
        B.quad([cx - tw / 2, by, cz + td / 2 + 0.3], [cx + tw / 2, by, cz + td / 2 + 0.3], [cx + tw / 2, by + 5, cz + td / 2 + 0.3], [cx - tw / 2, by + 5, cz + td / 2 + 0.3], GLASS);
        B.quad([cx + tw / 2 + 0.3, by, cz + td / 2], [cx + tw / 2 + 0.3, by, cz - td / 2], [cx + tw / 2 + 0.3, by + 5, cz - td / 2], [cx + tw / 2 + 0.3, by + 5, cz + td / 2], GLASS);
        B.quad([cx - tw / 2 - 0.3, by, cz - td / 2], [cx - tw / 2 - 0.3, by, cz + td / 2], [cx - tw / 2 - 0.3, by + 5, cz + td / 2], [cx - tw / 2 - 0.3, by + 5, cz - td / 2], GLASS);
      }
      y += th; s -= 0.22;
    }
    return y;
  }
  // Meridian, not built yet: towers of 60 to 220 m on the 80 m grid, Coral Boulevard kept clear
  let towers = 0;
  for (let x = -760; x <= 760; x += 80) for (let z = -1400; z <= -360; z += 80) {
    const r = rnd(), h = 60 + rnd() * rnd() * 160, w = 24 + rnd() * 12, d = 24 + rnd() * 12, col = TOWER[Math.floor(rnd() * TOWER.length)];
    if (r > 0.72 || Math.abs(x - 52) < 45) continue;
    tower(x + (rnd() - 0.5) * 20, z, w, d, h, col, rnd() < 0.3 ? 3 : 1); towers++;
  }
  // the Meridian Spire, 260 m, at the top of Coral Boulevard
  const top = tower(52, -900, 44, 44, 236, 0xb8cfe0, 3);
  B.box(52, top + 12, -900, 1.2, 24, 1.2, 0xff3fa4);
  // the beachfront's own tall buildings, a hair inside their real walls
  let tall = 0;
  for (const lot of map.lots) {
    if (!lot.body || lot.h <= 30 || lot.hero) continue;
    const c = lot.body;
    B.box((c.x0 + c.x1) / 2, lot.h / 2, (c.z0 + c.z1) / 2, c.x1 - c.x0 - 0.8, lot.h - 0.4, c.z1 - c.z0 - 0.8, lot.wall, { top: ROOF }); tall++;
  }
  const mesh = new THREE.Mesh(B.build({ free: true }), chunkMaterials().B);
  mesh.matrixAutoUpdate = false; mesh.frustumCulled = false; mesh.renderOrder = -1;
  scene.add(mesh);
  return { mesh, triangles: B.triangles, ground, towers, tall };
}
