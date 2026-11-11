// Props you can knock over: lamp posts, barrier sections and neon cones.
// Every prop is its own object with its own position, but each kind is drawn as one
// instanced mesh (one draw call per part), so a hundred cones cost the same as one.
// Props come and go with their chunk: a kind's mesh has room for `cap` of them and a freed
// place is used again. Palms, umbrellas and benches (which stay put) are in decor.js.

import * as THREE from 'three';
import { MeshBuilder, rng, glowTexture } from '../gfx/builder.js';

const POST = 0x2b2838;

function lampGeo(arm) {              // the arm points along +z
  const post = new MeshBuilder(), head = new MeshBuilder();
  post.box(0, 3.25, 0, 0.18, 6.5, 0.18, POST);
  post.box(0, 6.45, arm / 2, 0.14, 0.12, arm + 0.14, POST, { bottom: true });
  head.box(0, 6.32, arm, 0.55, 0.14, 0.55, 0xfff2cc, { bottom: true });
  // the light: a pool on the ground under the head and a soft halo round it (two crossed quads)
  const pool = new MeshBuilder({ uv: true }), halo = new MeshBuilder({ uv: true });
  pool.flat(-9, 9, arm - 9, arm + 9, 0.06, 0xffffff);
  const y = 6.25, r = 2.6;
  halo.quad([-r, y - r, arm], [r, y - r, arm], [r, y + r, arm], [-r, y + r, arm], 0xffffff);
  halo.quad([0, y - r, arm - r], [0, y - r, arm + r], [0, y + r, arm + r], [0, y + r, arm - r], 0xffffff);
  halo.flat(-r, r, arm - r, arm + r, y, 0xffffff);
  return [post.build(), head.build(), pool.build(), halo.build()];
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
  const add = { map: glowTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide };
  const poolMat = new THREE.MeshBasicMaterial({ ...add, color: 0xffc27a }), haloMat = new THREE.MeshBasicMaterial({ ...add, color: 0xffd9a0 });
  const lampMats = [lambert, headMat, poolMat, haloMat];
  // hx, hz: half size of the footprint; mode: how it goes down; cap: most alive at once; lights: parts that go out when it falls
  const kinds = {
    lamp: { geos: lampGeo(1.8), mats: lampMats, mass: 60, hx: 0.2, hz: 0.2, mode: 'topple', rest: 1.52, cap: 640, lights: 2 },
    lampLong: { geos: lampGeo(3.7), mats: lampMats, mass: 70, hx: 0.2, hz: 0.2, mode: 'topple', rest: 1.52, cap: 192, lights: 2 },
    barrier: { geos: barrierGeo(), mats: [lambert], mass: 25, hx: 1.2, hz: 0.25, mode: 'topple', rest: 1.5, cap: 256 },
    cone: { geos: coneGeo(), mats: [neonMat], mass: 3, hx: 0.25, hz: 0.25, mode: 'fly', rest: 1.72, cap: 192 },
  };
  const all = [], moving = new Set(), byId = new Map();
  const rnd = rng(4242);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion();
  const pos = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1), axis = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const col = new THREE.Color(), white = new THREE.Color(1, 1, 1), zero = new THREE.Matrix4().makeScale(0, 0, 0);
  let nextId = 1;
  for (const name in kinds) {
    const k = kinds[name];
    k.name = name; k.list = []; k.free = []; k.high = 0;
    k.tris = k.geos.slice(0, k.geos.length - (k.lights || 0)).reduce((n, g) => n + g.attributes.position.count / 3, 0);
    k.meshes = k.geos.map((geo, i) => {
      const mesh = new THREE.InstancedMesh(geo, k.mats[i], k.cap);
      mesh.frustumCulled = false; mesh.count = 0; mesh.matrixAutoUpdate = false;
      if (i >= k.geos.length - (k.lights || 0)) { mesh.renderOrder = 2; mesh.userData.light = true; mesh.visible = false; }
      scene.add(mesh);
      return mesh;
    });
  }

  function write(p) {
    // lean over about a flat axis through the foot, then turn to face
    axis.set(Math.cos(p.fall), 0, -Math.sin(p.fall));
    qa.setFromAxisAngle(axis, p.tilt); qb.setFromAxisAngle(up, p.rot + p.yaw);
    q.multiplyQuaternions(qa, qb);
    pos.set(p.x, p.y, p.z);
    m4.compose(pos, q, one);
    const k = kinds[p.kind], lit = k.meshes.length - (k.lights || 0);
    k.meshes.forEach((mesh, i) => {
      mesh.setMatrixAt(p.idx, i >= lit && (p.state !== 0 || p.noLight) ? zero : m4); mesh.instanceMatrix.needsUpdate = true;
    });
  }

  const props = {
    kinds, all, triangles: 0,
    // rot turns the prop around y. opts: color, onChange(broken) when it goes down or is stood back up,
    // noLight (a lamp whose glow somebody else draws), owner (the chunk it belongs to).
    add(kind, x, y, z, rot = 0, opts = {}) {
      const k = kinds[kind], c = Math.abs(Math.cos(rot)), s = Math.abs(Math.sin(rot));
      if (!k.free.length && k.high >= k.cap) return null;                 // full: better one lamp short than an error
      const idx = k.free.length ? k.free.pop() : k.high++;
      const p = { id: nextId++, kind, mass: k.mass, x, y, z, rot, home: { x, y, z }, hx: k.hx * c + k.hz * s, hz: k.hx * s + k.hz * c,
        state: 0, vx: 0, vy: 0, vz: 0, tilt: 0, tiltV: 0, fall: 0, yaw: 0, yawV: 0, idx,
        color: opts.color, onChange: opts.onChange, noLight: !!opts.noLight, owner: opts.owner };
      k.list.push(p); all.push(p); byId.set(p.id, p);
      for (const mesh of k.meshes) mesh.count = k.high;
      write(p);
      if (p.color !== undefined || k.meshes[0].instanceColor) { k.meshes[0].setColorAt(idx, p.color !== undefined ? col.set(p.color) : white); k.meshes[0].instanceColor.needsUpdate = true; }
      props.triangles += k.tris;
      return p;
    },
    // the contract's names: spawn gives an id, remove takes an id or the prop
    spawn(kind, x, z, opts = {}) { const p = props.add(kind, x, opts.y || 0, z, opts.rot || 0, opts); return p ? p.id : 0; },
    remove(ref) {
      const p = typeof ref === 'number' ? byId.get(ref) : ref;
      if (!p || !byId.has(p.id)) return;
      const k = kinds[p.kind];
      for (const mesh of k.meshes) { mesh.setMatrixAt(p.idx, zero); mesh.instanceMatrix.needsUpdate = true; }
      k.free.push(p.idx); byId.delete(p.id); moving.delete(p);
      k.list.splice(k.list.indexOf(p), 1); all.splice(all.indexOf(p), 1);
      props.triangles -= k.tris;
    },
    near(x, z, r, out) { let n = 0; for (const p of all) if ((p.x - x) * (p.x - x) + (p.z - z) * (p.z - z) <= r * r) out[n++] = p; return n; },
    finish() {},          // day 1's call; meshes are ready from the start now
    // Is a circle (the car's nose or tail) touching a standing prop? If so it goes down.
    hitTest(cx, cz, R, vx, vz, onHit) {
      const sp = Math.hypot(vx, vz);
      if (sp < 1.5) return;
      for (let i = 0; i < all.length; i++) {
        const p = all[i];
        if (p.state !== 0 || Math.abs(p.x - cx) > R + 1.3 || Math.abs(p.z - cz) > R + 1.3) continue;
        const dx = cx - Math.max(p.x - p.hx, Math.min(cx, p.x + p.hx)), dz = cz - Math.max(p.z - p.hz, Math.min(cz, p.z + p.hz));
        if (dx * dx + dz * dz > R * R) continue;
        props.knock(p, vx, vz);
        onHit(p);
      }
    },
    hit(id, vx, vz) { const p = byId.get(id); if (p && p.state === 0) props.knock(p, vx, vz); },
    knock(p, vx, vz) {
      const k = kinds[p.kind], sp = Math.hypot(vx, vz);
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
    },
    update(dt, night = 0) {
      const on = Math.min(1, night * 1.6);
      headMat.color.setScalar(0.62 + on * 0.6);
      poolMat.opacity = on * 0.34; haloMat.opacity = on * 0.9;
      // light parts are drawn only at night, and only if some lamp of the kind carries its own light
      for (const name in kinds) {
        const k = kinds[name], want = on > 0.01 && k.list.some((p) => !p.noLight);
        if (!k.lights || want === k.shown) continue;
        k.shown = want;
        for (const mesh of k.meshes) if (mesh.userData.light) mesh.visible = want;
      }
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
      for (const p of all) if (!p.noLight && kinds[p.kind].lights) write(p);
    },
    count(kind, state) { return all.filter((p) => (!kind || p.kind === kind) && (state === undefined || (state === 'down' ? p.state !== 0 : p.state === 0))).length; },
  };
  return props;
}
