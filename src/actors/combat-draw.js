// Everything the fight draws, in one instanced mesh of unit boxes (one draw call, 12 triangles a box):
// guards and people who are down (seven boxes and a weapon), the weapon in the player's hand, the
// pickups, the four chevrons of the lock-on and the flare in flight. No textures.
import * as THREE from 'three';

const CAP = 320;
const root = new THREE.Matrix4(), part = new THREE.Matrix4(), tmp = new THREE.Matrix4(), rot = new THREE.Matrix4(), col = new THREE.Color();
const q = new THREE.Quaternion(), e = new THREE.Euler(), pos = new THREE.Vector3(), scl = new THREE.Vector3();

export function createCombatDraw(scene) {
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial(), CAP);
  mesh.frustumCulled = false; mesh.count = 0;
  mesh.setColorAt(0, col.set(0xffffff));
  scene.add(mesh);
  let n = 0;

  // a box under the current root: centre, size, then a turn about x at a pivot (for a swinging limb)
  function box(x, y, z, sx, sy, sz, colour, swing = 0, py = 0, glow = 1) {
    if (n >= CAP) return;
    if (swing) {
      // turn about the point (x, y + py, z): move the box down from the pivot, turn, move to the pivot
      part.makeTranslation(x, y + py, z); rot.makeRotationX(swing); part.multiply(rot);
      tmp.makeTranslation(0, -py, 0); part.multiply(tmp);
    } else part.makeTranslation(x, y, z);
    tmp.makeScale(sx, sy, sz); part.multiply(tmp);
    tmp.multiplyMatrices(root, part);
    mesh.setMatrixAt(n, tmp);
    col.set(colour); if (glow !== 1) col.multiplyScalar(glow);
    mesh.setColorAt(n, col); n++;
  }
  function setRoot(x, y, z, h, pitch = 0, roll = 0) {
    e.set(pitch, h, roll, 'YXZ'); q.setFromEuler(e); pos.set(x, y, z); scl.set(1, 1, 1);
    root.compose(pos, q, scl);
  }
  // weapon boxes are written along +x (the aim); here the aim is the root's +z
  function weapon(boxes, ox, oy, oz) {
    if (!boxes) return;
    for (const b of boxes) box(ox + b[2], oy + b[1], oz + b[0], b[5], b[4], b[3], b[6]);
  }

  return {
    mesh,
    begin() { n = 0; },
    end() { mesh.count = n; mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true; },
    get boxes() { return n; }, get triangles() { return n * 12; }, cap: CAP,
    // g: { x, y, z, h, pose: 'stand' 'run' 'crouch' 'aim' 'floor' 'down', phase, look { shirt, legs, hat, skin }, gun (boxes), flash }
    figure(g) {
      const L = g.look, lying = g.pose === 'down' || g.pose === 'floor', crouch = g.pose === 'crouch';
      const skin = L.skin || 0xc98f62, tint = g.flash > 0 ? 1.6 : 1;
      if (lying) setRoot(g.x, g.y + 0.14, g.z, g.h, -Math.PI / 2);
      else setRoot(g.x, g.y - (crouch ? 0.42 : 0), g.z, g.h);
      const sw = g.pose === 'run' ? Math.sin(g.phase) * 0.7 : 0, legH = crouch ? 0.42 : 0.8, legY = crouch ? 0.42 + 0.21 : 0.4;
      box(-0.11, legY, 0, 0.16, legH, 0.18, L.legs, sw, legH / 2);
      box(0.11, legY, 0, 0.16, legH, 0.18, L.legs, -sw, legH / 2);
      box(0, 1.1, 0, 0.44, 0.6, 0.24, L.shirt, 0, 0, tint);
      box(0, 1.56, 0, 0.26, 0.28, 0.26, skin);
      box(0, 1.73, 0.02, 0.3, 0.08, 0.34, L.hat);
      const aim = g.pose === 'aim' || g.pose === 'crouch';
      box(-0.29, 1.1, 0, 0.12, 0.58, 0.14, L.shirt, lying ? 0.5 : -sw, 0.28);
      box(0.29, 1.1, 0, 0.12, 0.58, 0.14, L.shirt, aim ? -1.45 : lying ? -0.6 : sw, 0.28);
      if (g.gun && aim) weapon(g.gun, 0.29, 1.4, 0.58);
    },
    // the weapon in the player's right hand, held out along his heading (raised when aiming or swinging)
    held(x, y, z, h, boxes, raise, swing) {
      setRoot(x, y + 1.02 + raise * 0.3, z, h, -swing);
      weapon(boxes, 0.3, 0, 0.32);
    },
    // a pickup: a cyan ring of four posts with the weapons turning above it
    pickup(x, y, z, t, kits, ready) {
      setRoot(x, y, z, 0);
      const c = ready ? 0x29e6ff : 0x3b3946, r = 0.8, bob = Math.sin(t * 2.2) * 0.06;
      box(0, 0.03, 0, 1.9, 0.06, 1.9, 0x150f3d);
      for (let i = 0; i < 4; i++) box(Math.cos(i * 1.5708) * r, 0.35, Math.sin(i * 1.5708) * r, 0.1, 0.7, 0.1, c, 0, 0, ready ? 1.4 : 1);
      if (!ready) return;
      for (let i = 0; i < kits.length; i++) { setRoot(x, y + 0.95 + bob + i * 0.38, z, t * 1.4 + i * 1.6); weapon(kits[i], 0, 0, -0.3); }
    },
    // four chevrons round the locked target; k is its health, 1 cyan to 0 pink
    lock(x, y, z, yaw, k, t) {
      col.set(0xff4fa8).lerp(new THREE.Color(0x29e6ff), Math.max(0, Math.min(1, k)));
      const c = col.getHex(), r = 0.62 + Math.sin(t * 6) * 0.04;
      setRoot(x, y + 1.05, z, yaw);
      for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        box(sx * r, sy * r * 1.25, 0, 0.26, 0.06, 0.06, c, 0, 0, 1.6);
        box(sx * (r + 0.1), sy * (r * 1.25 - 0.1), 0, 0.06, 0.26, 0.06, c, 0, 0, 1.6);
      }
    },
    // a small bright box (the flare, a crate)
    blob(x, y, z, s, colour, glow = 1, h = 0) { setRoot(x, y, z, h); box(0, 0, 0, s, s, s, colour, 0, 0, glow); },
    dispose() { scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); },
  };
}
