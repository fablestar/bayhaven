// The day 4 drop: Rooftop Launch Party. A stage on a Meridian rooftop near the beach end of
// Coral Boulevard, with a row of lamps that change colour on every beat and six beams that
// sweep the sky and flash on every kick of whatever the radio is playing. With the radio off
// the party keeps its own time, at the tempo of Tideline 98's first song. Only built when the
// build day is 4. Three draw calls. (The ramp up to it waits for vehicles that can climb.)

import * as THREE from 'three';

const NEON = [0xff3fa4, 0x29e6ff, 0x5dff9b, 0xffa02e];
const PARTY = { id: 'rooftop-launch-party', near: { x: 52, z: -420 }, bpm: 104, lamps: 12, beams: 6, range: 1400 };

// the roof: a tower close to the boulevard's beach end, not too tall, with a flat top big enough
function pickRoof(map) {
  let best = null;
  for (const l of map.lots) {
    if (l.zone !== 'meridian' || !l.tiers || l.hero || l.mast || l.helipad) continue;
    const top = l.tiers.reduce((a, b) => (b.y1 > a.y1 ? b : a));
    if (top.round || top.rot || top.x1 - top.x0 < 18 || top.z1 - top.z0 < 14) continue;
    const cx = (top.x0 + top.x1) / 2, cz = (top.z0 + top.z1) / 2;
    const score = Math.hypot(cx - PARTY.near.x, cz - PARTY.near.z) + top.y1 * 1.5;
    if (!best || score < best.score) best = { score, lot: l.id, x: cx, z: cz, y: top.y1, w: top.x1 - top.x0, d: top.z1 - top.z0 };
  }
  return best;
}

function createParty(ctx) {
  const map = ctx.modules.map, hud = ctx.modules.hud, roof = map && map.lots ? pickRoof(map) : null;
  const party = { id: PARTY.id, roof, beat: 0, pulse: 0, follows: 'own', calls: 0, marker: null };
  if (hud) hud.drop(roof ? 'Rooftop Launch Party, on a Meridian roof. Follow the lights' : '');
  if (!roof) return party;
  party.marker = { x: roof.x, z: roof.z };
  const group = new THREE.Group(); group.position.set(roof.x, roof.y, roof.z);
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), S = new THREE.Vector3(), col = new THREE.Color();

  // the stage faces south, to the beach: a deck, a back wall, two speaker stacks, a truss on two legs
  const parts = [[0, 0.3, 0, 12, 0.6, 7, 0x2b2838], [0, 2.6, -3.3, 12, 4, 0.3, 0x150f3d], [-5, 1.9, 2.2, 1.6, 2.6, 1.4, 0x1b1924], [5, 1.9, 2.2, 1.6, 2.6, 1.4, 0x1b1924],
    [-6.3, 3, 3, 0.3, 6, 0.3, 0xc8ccd2], [6.3, 3, 3, 0.3, 6, 0.3, 0xc8ccd2], [0, 6, 3, 13, 0.35, 0.35, 0xc8ccd2], [0, 1.2, 0.5, 2.4, 1.2, 1, 0xff3fa4]];
  const stage = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial(), parts.length);
  parts.forEach(([x, y, z, w, h, d, c], i) => { stage.setMatrixAt(i, M.compose(P.set(x, y, z), Q.identity(), S.set(w, h, d))); stage.setColorAt(i, col.setHex(c)); });
  // the lamps along the truss
  const lamps = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshBasicMaterial(), PARTY.lamps);
  for (let i = 0; i < PARTY.lamps; i++) { lamps.setMatrixAt(i, M.compose(P.set(-5.5 + i, 5.6, 3), Q.identity(), S.set(1, 1, 1))); lamps.setColorAt(i, col.setHex(NEON[i % 4])); }
  // the beams: open cones from the truss into the sky
  const cone = new THREE.ConeGeometry(5, 70, 8, 1, true); cone.rotateX(Math.PI); cone.translate(0, 35, 0);
  const beamMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
  const beams = new THREE.InstancedMesh(cone, beamMat, PARTY.beams);
  for (let i = 0; i < PARTY.beams; i++) beams.setColorAt(i, col.setHex(NEON[i % 4]));
  for (const m of [stage, lamps, beams]) { m.frustumCulled = false; group.add(m); }
  ctx.scene.add(group);
  party.calls = 3; party.triangles = parts.length * 12 + PARTY.lamps * 12 + PARTY.beams * 16;

  let clock = 0, lastBeat = -1;
  party.update = (dt, night = 0) => {
    const radio = ctx.modules.radio, p = ctx.state.player;
    group.visible = Math.hypot(p.x - roof.x, p.z - roof.z) < PARTY.range;
    clock += dt;
    if (radio && radio.on && radio.bpm) { party.follows = 'radio'; party.beat = radio.beat; party.pulse = radio.pulse; }
    else { party.follows = 'own'; party.beat = clock * PARTY.bpm / 60; party.pulse = Math.exp(-(party.beat % 1) * 60 / PARTY.bpm * 9); }
    if (!group.visible) return;
    const b = Math.floor(party.beat), glow = 0.3 + 0.7 * party.pulse;
    if (b !== lastBeat) {                      // the colours step along the truss on every beat
      lastBeat = b;
      for (let i = 0; i < PARTY.beams; i++) beams.setColorAt(i, col.setHex(NEON[(i + b) % 4]));
      beams.instanceColor.needsUpdate = true;
    }
    for (let i = 0; i < PARTY.lamps; i++) lamps.setColorAt(i, col.setHex(NEON[(i + b) % 4]).multiplyScalar(glow));
    lamps.instanceColor.needsUpdate = true;
    // the beams sway on the bar and flash on the kick; faint by day, bright at night
    for (let i = 0; i < PARTY.beams; i++) {
      const a = party.beat * Math.PI / 8 + i * 1.1;
      E.set(-0.35 + 0.3 * Math.sin(a), 0, (i - 2.5) * 0.22 + 0.25 * Math.cos(a * 0.7));
      beams.setMatrixAt(i, M.compose(P.set(-5 + i * 2, 5.8, 3), Q.setFromEuler(E), S.set(1, 1, 1)));
    }
    beams.instanceMatrix.needsUpdate = true;
    beamMat.opacity = (0.05 + 0.3 * party.pulse) * (0.3 + 0.7 * night);
    party.level = glow;
  };
  party.reset = () => { clock = 0; };
  return party;
}

const drop = {
  day: 4, id: PARTY.id, marker: { x: PARTY.near.x, z: PARTY.near.z },
  start(ctx) { const party = createParty(ctx); if (party.marker) drop.marker = party.marker; return party; },
  stop() {},
};
export default drop;
