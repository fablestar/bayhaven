// LOD2: the far skyline and the ground under everything, one mesh for the whole city, built once
// from the map alone: every tower over 30 m (its real tiers, with window walls) and every landmark
// outline, a hair inside the real walls so the nearer rings cover it. The Spire's beacon is here
// too, so its pink light shows from the beach.
import * as THREE from 'three';
import { MeshBuilder, glowTexture } from '../gfx/builder.js';
import { chunkMaterials } from '../gfx/materials.js';
import { drawTiers, plainBox, plainFlat } from './gen/towers.js';

const ROOF = 0x6f6a78;

export function createSkyline(scene, map, heroes = {}) {
  const W = new MeshBuilder({ uv: true, size: 32768 }), Wd = map.world, o = { W };
  // the ground far away, a little under the streamed ground so the two never fight
  const Y = -0.4;
  plainFlat(W, Wd.x0, Wd.x1, Wd.z0, -320, Y, 0x45424f);
  plainFlat(W, -1600, 1600, -320, 50, Y, 0x3b3946);
  plainFlat(W, Wd.x0, -1600, -320, 50, Y, 0x5f8f5a);
  plainFlat(W, 1600, Wd.x1, -320, 50, Y, 0x77747f);
  plainFlat(W, Wd.x0, Wd.x1, 50, 78, -0.3, 0xf2ddb0);
  // the port: its quay runs out past the beach line, and east of the quay edge is harbour water
  plainFlat(W, 1800, 3024, 50, 130, -0.25, 0x8f8c96);
  plainFlat(W, 3024, Wd.x1, -1600, 78, -0.27, 0x2f7f9a);       // STAND-IN: the sea plane in gfx/sky.js starts at z = 76
  const ground = W.triangles, landmarks = [];
  let towers = 0, tall = 0, top = 0;
  for (const lot of map.lots) {
    const hero = lot.hero && heroes[lot.hero];
    if (hero && hero.skyline && hero.shell) { hero.shell(o, lot, { inset: 0.4 }); landmarks.push(lot.hero); top = Math.max(top, lot.h); continue; }
    if (!lot.body || lot.h <= 30 || lot.hero) continue;
    if (lot.tiers) { drawTiers(o, lot.tiers, { cell: 6, cut: false, inset: 0.4 }); towers++; top = Math.max(top, lot.h); continue; }
    const c = lot.body;                    // the beachfront's own tall buildings
    plainBox(W, (c.x0 + c.x1) / 2, lot.h / 2, (c.z0 + c.z1) / 2, c.x1 - c.x0 - 0.8, lot.h - 0.4, c.z1 - c.z0 - 0.8, lot.wall, { top: ROOF }); tall++;
  }
  const mats = chunkMaterials();
  const mesh = new THREE.Mesh(W.build({ free: true }), mats.W);
  mesh.matrixAutoUpdate = false; mesh.frustumCulled = false; mesh.renderOrder = -1;
  scene.add(mesh);
  // the Spire's tip: a pink glow pulsing every 2 s, never lost in the fog
  let beacon = null;
  const spire = map.landmark('spire');
  if (spire && landmarks.includes('spire')) {
    beacon = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xff3fa4, fog: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    beacon.position.set(spire.x, spire.h - 2, spire.z); beacon.renderOrder = 2;
    scene.add(beacon);
  }
  return { mesh, triangles: W.triangles, ground, towers, tall, landmarks, top, beacon,
    update(seconds, on) {
      if (!beacon) return;
      const pulse = 0.5 + 0.5 * Math.cos(seconds * Math.PI), s = (10 + 16 * on) * (0.7 + 0.3 * pulse);
      beacon.scale.set(s, s, 1); beacon.material.opacity = (0.35 + 0.65 * on) * (0.45 + 0.55 * pulse);
    } };
}
