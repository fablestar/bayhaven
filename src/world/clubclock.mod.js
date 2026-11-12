// The clubhouse clock and the sprinklers' timer: eight hands on the four faces of the clock tower in Mallard Greens, set from
// the game clock once a game minute. One small mesh, one draw call, hidden when the tower is far off.
import * as THREE from 'three';
import { TOWER } from './landmarks/clubhouse.js';
import { sprinklerMaterial } from './gen/mallardgreens.js';

// the sprinklers run for ten game minutes from 06:00 and 18:00, and at 15:15 in the rain
const sprinkling = (hour) => [6, 15.25, 18].some((h) => hour >= h && hour < h + 1 / 6);

let mesh, pos, last = -1;
const FACES = [[0, 1], [0, -1], [1, 0], [-1, 0]];        // outward normals (x, z)
function set(hour) {
  const mins = (hour * 60) % 720, angles = [(mins / 720) * Math.PI * 2, ((mins % 60) / 60) * Math.PI * 2], lens = [1.1, 1.7], wid = [0.16, 0.1];
  let i = 0;
  for (const [nx, nz] of FACES) for (let k = 0; k < 2; k++) {
    // on the face: `right` is to the viewer's right, so the hands turn clockwise as seen from outside
    const rx = -nz, rz = nx, a = angles[k], dx = Math.sin(a), dy = Math.cos(a), px = Math.cos(a) * wid[k], py = -Math.sin(a) * wid[k];
    const cx = TOWER.x + nx * (TOWER.half + 0.12 + k * 0.02), cz = TOWER.z + nz * (TOWER.half + 0.12 + k * 0.02), cy = TOWER.clockY;
    const P = (u, v) => { pos[i++] = cx + rx * u; pos[i++] = cy + v; pos[i++] = cz + rz * u; };
    const q = [[-px, -py], [px, py], [dx * lens[k] + px, dy * lens[k] + py], [dx * lens[k] - px, dy * lens[k] - py]];
    for (const j of [0, 1, 2, 0, 2, 3]) P(q[j][0], q[j][1]);
  }
  mesh.geometry.attributes.position.needsUpdate = true;
}
export default {
  name: 'clubclock', order: 19, renderOrder: 65,
  init(ctx) {
    pos = new Float32Array(8 * 6 * 3);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0x150f3d, side: THREE.DoubleSide }));
    mesh.frustumCulled = false; mesh.visible = false; ctx.scene.add(mesh);
    const api = { minute: -1, sprinklers: false, hands: () => ({ minute: api.minute, visible: mesh.visible, sprinklers: api.sprinklers }) };
    ctx.test.clubclock = api.hands;
    return api;
  },
  render(alpha, ctx) {
    const on = sprinkling(ctx.state.clock.hour);
    ctx.modules.clubclock.sprinklers = on; sprinklerMaterial.visible = on;
    if (on) sprinklerMaterial.opacity = 0.32 + 0.18 * Math.sin(ctx.loop.time * 9);
    const p = ctx.state.player, near = Math.abs(p.x - TOWER.x) < 500 && Math.abs(p.z - TOWER.z) < 500;
    mesh.visible = near;
    if (!near) return;
    const minute = Math.floor(ctx.state.clock.hour * 60);
    if (minute !== last) { last = minute; ctx.modules.clubclock.minute = minute; set(ctx.state.clock.hour); }
  },
};
