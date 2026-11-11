// The materials every streamed chunk shares, made once. A chunk is at most six meshes, in day 1's
// letters: G ground, M road paint, B solids, N neon, S signs, L lit windows (night only). Tower
// chunks add W: walls that carry the window-grid texture (windowgrid.js).
import * as THREE from 'three';
import { signAtlas, grainTexture } from './atlas.js';
import { windowMaterial } from './windowgrid.js';

let set = null;
export function chunkMaterials() {
  if (set) return set;
  const G = new THREE.MeshLambertMaterial({ vertexColors: true, map: grainTexture() });
  const M = new THREE.MeshLambertMaterial({ vertexColors: true, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const B = new THREE.MeshLambertMaterial({ vertexColors: true });
  const N = new THREE.MeshBasicMaterial({ vertexColors: true });
  const S = new THREE.MeshBasicMaterial({ map: signAtlas() });
  const L = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const leaf = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });      // palms and umbrellas
  const W = windowMaterial();
  set = { G, M, B, N, S, L, W, leaf, order: { L: 1 },
    // the city switches its lights on as the sky gets dark
    update(night) {
      const on = Math.min(1, night * 1.6);
      N.color.setScalar(0.62 + on * 0.6); S.color.setScalar(0.6 + on * 0.6); L.color.setScalar(on); W.setOn(on); set.on = on;
      set.lit = on > 0.01;
    },
    lit: false,
  };
  return set;
}
