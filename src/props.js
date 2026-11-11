// Props you can knock over: lamp posts, barrier sections and neon cones.
// Every prop is its own object with its own position, but each kind is drawn as one
// instanced mesh (one draw call per part), so a hundred cones cost the same as one.

import * as THREE from 'three';
import { MeshBuilder, rng } from './builder.js';

const POST = 0x2b2838;

function lampGeo(arm) {              // the arm points along +z
  const post = new MeshBuilder(), head = new MeshBuilder();
  post.box(0, 3.25, 0, 0.18, 6.5, 0.18, POST);
  post.box(0, 6.45, arm / 2, 0.14, 0.12, arm + 0.14, POST, { bottom: true });
  head.box(0, 6.32, arm, 0.55, 0.14, 0.55, 0xfff2cc, { bottom: true });
  return [post.build(), head.build()];
}
function barrierGeo() {              // a 2.4 m striped section along x
  const B = new MeshBuilder();
  for (const [o, col] of [[-0.6, 0xff7a1e], [0.6, 0xffffff]]) for (const y of [0.55, 1.05]) B.box(o, y, 0, 1.2, 0.3, 0.14, col, { bottom: true });
  for (const o of [-1.05, 1.05]) B.box(o, 0.6, 0, 0.12, 1.2, 0.5, 0x3a3844);
  return [B.build()];
}
function coneGeo() {
  const B = new MeshBuilder();
  B.box(0, 0.03, 0, 0.5, 0.06, 0.5, 0xffffff, { bottom: true });
  B.box(0, 0.38, 0, 0.34, 0.64, 0.34, 0xffffff, { taper: [0.2, 0.2] });
  return [B.build()];
}

export function createProps(scene) {
  const lambert = new THREE.MeshLambertMaterial({ vertexColors: true });
  const headMat = new THREE.MeshBasicMaterial({ vertexColors: true });   // lamp heads glow at night
  const neonMat = new THREE.MeshBasicMaterial({ vertexColors: true });   // neon cones always glow
  // hx, hz: half size of the footprint; mode: how it goes down
  const kinds = {
    lamp: { geos: lampGeo(1.8), mats: [lambert, headMat], mass: 60, hx: 0.2, hz: 0.2, mode: 'topple', rest: 1.52 },
    lampLong: { geos: lampGeo(3.7), mats: [lambert, headMat], mass: 70, hx: 0.2, hz: 0.2, mode: 'topple', rest: 1.52 },
    barrier: { geos: barrierGeo(), mats: [lambert], mass: 25, hx: 1.2, hz: 0.25, mode: 'topple', rest: 1.5 },
    cone: { geos: coneGeo(), mats: [neonMat], mass: 3, hx: 0.25, hz: 0.25, mode: 'fly', rest: 1.72 },
  };
  for (const k in kinds) { kinds[k].name = k; kinds[k].list = []; kinds[k].tris = kinds[k].geos.reduce((n, g) => n + g.attributes.position.count / 3, 0); }
  const all = [], moving = new Set();
  const rnd = rng(4242);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion();
  const pos = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1), axis = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const col = new THREE.Color();

  function write(p) {
    // lean over about a flat axis through the foot, then turn to face
    axis.set(Math.cos(p.fall), 0, -Math.sin(p.fall));
    qa.setFromAxisAngle(axis, p.tilt); qb.setFromAxisAngle(up, p.rot + p.yaw);
    q.multiplyQuaternions(qa, qb);
    pos.set(p.x, p.y, p.z);
    m4.compose(pos, q, one);
    for (const mesh of kinds[p.kind].meshes) { mesh.setMatrixAt(p.idx, m4); mesh.instanceMatrix.needsUpdate = true; }
  }

  const props = {
    kinds, all, triangles: 0,
    // rot turns the prop around y. onChange(broken) is called when it goes down or is stood back up.
    add(kind, x, y, z, rot = 0, opts = {}) {
      const k = kinds[kind], c = Math.abs(Math.cos(rot)), s = Math.abs(Math.sin(rot));
      const p = { kind, mass: k.mass, x, y, z, rot, home: { x, y, z }, hx: k.hx * c + k.hz * s, hz: k.hx * s + k.hz * c,
        state: 0, vx: 0, vy: 0, vz: 0, tilt: 0, tiltV: 0, fall: 0, yaw: 0, yawV: 0, idx: k.list.length,
        color: opts.color, onChange: opts.onChange };
      k.list.push(p); all.push(p);
      return p;
    },
    // call once, after every prop has been added
    finish() {
      for (const k of Object.values(kinds)) {
        k.meshes = [];
        if (!k.list.length) continue;
        k.geos.forEach((geo, i) => {
          const mesh = new THREE.InstancedMesh(geo, k.mats[i], k.list.length);
          mesh.frustumCulled = false;
          k.meshes.push(mesh); scene.add(mesh);
        });
        for (const p of k.list) {
          write(p);
          if (p.color !== undefined) k.meshes[0].setColorAt(p.idx, col.set(p.color));
        }
        props.triangles += k.tris * k.list.length;
      }
    },
    // Is a circle (the car's nose or tail) touching a standing prop? If so it goes down.
    hitTest(cx, cz, R, vx, vz, onHit) {
      const sp = Math.hypot(vx, vz);
      if (sp < 1.5) return;
      for (const p of all) {
        if (p.state !== 0) continue;
        const dx = cx - Math.max(p.x - p.hx, Math.min(cx, p.x + p.hx)), dz = cz - Math.max(p.z - p.hz, Math.min(cz, p.z + p.hz));
        if (dx * dx + dz * dz > R * R) continue;
        const k = kinds[p.kind];
        p.state = 1; p.fall = Math.atan2(vx, vz) + (rnd() - 0.5) * 0.5;
        if (k.mode === 'fly') {
          const side = (rnd() - 0.5) * 0.9;
          p.vx = vx * (0.75 + rnd() * 0.4) + vz * side * 0.3; p.vz = vz * (0.75 + rnd() * 0.4) - vx * side * 0.3;
          p.vy = 2 + sp * (0.1 + rnd() * 0.1); p.tiltV = 5 + rnd() * 8; p.yawV = (rnd() - 0.5) * 12;
        } else {
          p.vx = vx * 0.45; p.vz = vz * 0.45; p.tiltV = 1.2 + sp * 0.12; p.yawV = (rnd() - 0.5) * 1.5;
        }
        moving.add(p);
        if (p.onChange) p.onChange(true);
        onHit(p);
      }
    },
    update(dt, night = 0) {
      headMat.color.setScalar(0.62 + Math.min(1, night * 1.6) * 0.6);
      for (const p of moving) {
        const k = kinds[p.kind];
        p.x += p.vx * dt; p.z += p.vz * dt; p.yaw += p.yawV * dt;
        if (k.mode === 'fly') {
          p.vy -= 12 * dt; p.y += p.vy * dt; p.tilt += p.tiltV * dt;
          if (p.y <= p.home.y) {            // bounce, then lie on its side
            p.y = p.home.y;
            if (p.vy < -1.5) { p.vy *= -0.35; p.tiltV *= 0.6; } else { p.vy = 0; p.tiltV = 0; p.tilt += (k.rest - (p.tilt % (Math.PI * 2))) * Math.min(1, dt * 10); }
            const f = Math.max(0, 1 - 3 * dt); p.vx *= f; p.vz *= f; p.yawV *= f;
          }
        } else {
          p.tiltV += 7 * Math.sin(Math.max(0.05, p.tilt)) * dt; p.tilt += p.tiltV * dt;
          if (p.tilt >= k.rest) { p.tilt = k.rest; p.tiltV = p.tiltV > 2 ? -p.tiltV * 0.25 : 0; }
          const f = Math.max(0, 1 - 2.5 * dt); p.vx *= f; p.vz *= f; p.yawV *= f;
        }
        write(p);
        if (p.vy === 0 && p.tiltV === 0 && Math.hypot(p.vx, p.vz) < 0.15 && Math.abs(p.tilt % (Math.PI * 2) - k.rest) < 0.05) { p.state = 2; moving.delete(p); }
      }
    },
    // stand everything back up (the R key)
    reset() {
      for (const p of all) {
        if (p.state === 0) continue;
        Object.assign(p, p.home, { state: 0, vx: 0, vy: 0, vz: 0, tilt: 0, tiltV: 0, yaw: 0, yawV: 0 });
        write(p);
        if (p.onChange) p.onChange(false);
      }
      moving.clear();
    },
    count(kind, state) { return all.filter((p) => (!kind || p.kind === kind) && (state === undefined || (state === 'down' ? p.state !== 0 : p.state === 0))).length; },
  };
  return props;
}
