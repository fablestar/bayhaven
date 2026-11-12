// Everyone on the street in eight draw calls: six InstancedMesh for the body parts (the rig's
// boxes and pivots, plan/bible/art/characters.md section 1), one of unit boxes for hair, hats, bags,
// phones and the birds round a dazed head, and one of blob shadows. Each instance carries a tint,
// a skin colour and a cell of the people atlas. Poses are maths (section 6 of the same file).
import * as THREE from 'three';
import { boxes, drawSheet } from './rigart.js';
import { HEAD, NECK, CHEST, HIPS, HAND_L, HAND_R, FOOT_L, FOOT_R } from './tumble.js';

import { FACE } from './pedsfaces.js';
const W = 256, H = 128, EXTRAS = 4, BIRDS = 12;
const CLOTH = '#00ff00', SKINKEY = '#ff00ff', INK = '#2a1a2e';
const shade = (v) => `rgb(0,${v},0)`;

// The people atlas. It is drawn with two key colours and then turned into pixels whose alpha says
// how to tint them: 255 takes the instance's tint (cloth), 128 its skin colour, 0 is drawn as painted.
function atlas() {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true });
  // row 0: the rig's eight faces, on the skin key
  const sheet = drawSheet({ skin: SKINKEY, shirt: CLOTH, flower: '#ffffff', tank: '#ffffff', shorts: CLOTH });
  g.drawImage(sheet.image, 0, 0, W, 32, 0, 0, W, 32); sheet.dispose();
  // row 1: shirts. plain, stripes, check, hi-vis, tank, polo, suit, floral
  g.fillStyle = CLOTH; g.fillRect(0, 32, W, 64);
  for (let i = 0; i < 4; i += 2) { g.fillStyle = shade(165); g.fillRect(32, 32 + i * 8 + 8, 32, 8); }
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) { g.fillStyle = shade(175); g.fillRect(64 + i * 8, 32 + j * 8, 8, 8); }
  g.fillStyle = '#f4f0d0'; g.fillRect(96, 40, 32, 4); g.fillRect(96, 52, 32, 4);
  g.fillStyle = SKINKEY; g.fillRect(128, 32, 6, 14); g.fillRect(154, 32, 6, 14); g.fillRect(140, 32, 8, 5);
  g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(170, 32); g.lineTo(176, 41); g.lineTo(182, 32); g.fill();
  g.beginPath(); g.moveTo(200, 32); g.lineTo(208, 48); g.lineTo(216, 32); g.fill();
  g.fillStyle = INK; g.fillRect(207, 36, 3, 14);
  let s = 11; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 9; i++) {
    const x = Math.round(227 + r() * 26), y = Math.round(35 + r() * 26);
    g.fillStyle = i % 2 ? '#ffffff' : '#ff4fa8';
    g.fillRect(x - 2, y - 1, 5, 3); g.fillRect(x - 1, y - 2, 3, 5);
    g.fillStyle = '#fff1c9'; g.fillRect(x, y, 1, 1);
  }
  // row 2: limbs. long sleeve or trousers, short sleeve, bare, spare, shorts, boardies
  g.fillStyle = SKINKEY; g.fillRect(32, 64 + 13, 32, 19); g.fillRect(64, 64, 32, 32); g.fillRect(128, 64 + 14, 64, 18);
  g.fillStyle = '#ffffff'; g.fillRect(160, 64, 3, 14);
  // row 3: flat skin, and one cell of flat cloth for the boxes of hair, hats and bags
  g.fillStyle = SKINKEY; g.fillRect(0, 96, 224, 32); g.fillStyle = CLOTH; g.fillRect(224, 96, 32, 32);
  const src = g.getImageData(0, 0, W, H).data, out = new Uint8Array(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4, o = ((H - 1 - y) * W + x) * 4, R = src[i], G = src[i + 1], B = src[i + 2];
    if (R < 60 && B < 60 && G > 90) { out[o] = out[o + 1] = out[o + 2] = G; out[o + 3] = 255; }                       // cloth, and its darker shades
    else if (G < 60 && Math.abs(R - B) < 50 && R > 70) { out[o] = out[o + 1] = out[o + 2] = R; out[o + 3] = 128; }    // skin, shading into ink
    else { out[o] = R; out[o + 1] = G; out[o + 2] = B; out[o + 3] = 0; }
  }
  const tex = new THREE.DataTexture(out, W, H, THREE.RGBAFormat);
  tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false; tex.colorSpace = THREE.SRGBColorSpace; tex.needsUpdate = true;
  return tex;
}

function material(map) {
  const mat = new THREE.MeshLambertMaterial({ map });
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec3 aTint;\nattribute vec3 aSkin;\nattribute float aCell;\nvarying vec3 vTint;\nvarying vec3 vSkin;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\nvMapUv.x += aCell * 0.125;\nvTint = aTint;\nvSkin = aSkin;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vTint;\nvarying vec3 vSkin;')
      .replace('#include <map_fragment>', 'vec4 tx = texture2D( map, vMapUv );\ndiffuseColor.rgb *= tx.rgb * ( tx.a > 0.75 ? vTint : ( tx.a > 0.25 ? vSkin : vec3( 1.0 ) ) );');
  };
  return mat;
}

const cell = (row, top) => [1, row * 32 + (top ? 1 : 0), 30, top ? 2 : 32];
// [name, w, h, d, centre y from the pivot, atlas row for the front, row for the other sides]
const PARTS = [['head', 0.38, 0.36, 0.36, 0.18, 0, 3], ['torso', 0.40, 0.64, 0.24, 0.32, 1, 1], ['armL', 0.12, 0.60, 0.12, -0.30, 2, 2],
  ['armR', 0.12, 0.60, 0.12, -0.30, 2, 2], ['legL', 0.18, 0.80, 0.20, -0.40, 2, 2], ['legR', 0.18, 0.80, 0.20, -0.40, 2, 2]];

export function createPedDraw(scene, cap) {
  const map = atlas(), mat = material(map), meshes = {}, list = [];
  const make = (geo, n) => {
    const m = new THREE.InstancedMesh(geo, mat, n);
    for (const [name, size] of [['aTint', 3], ['aSkin', 3], ['aCell', 1]]) geo.setAttribute(name, new THREE.InstancedBufferAttribute(new Float32Array(n * size), size));
    m.frustumCulled = false; m.count = 0; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(m); list.push(m);
    return m;
  };
  for (const [name, w, h, d, cy, front, side] of PARTS) {
    const top = cell(side, true), bottom = [1, side * 32 + 29, 30, 2];
    meshes[name] = make(boxes([{ w, h, d, at: [0, cy, 0], uv: { front: cell(front), side: cell(side), back: cell(side), top, bottom } }]), cap);
  }
  const extras = make(boxes([{ w: 1, h: 1, d: 1, at: [0, 0, 0], uv: { side: [232, 104, 8, 8] } }]), cap * EXTRAS + BIRDS);
  // blob shadows: a soft black disc, made from numbers
  const px = new Uint8Array(32 * 32 * 4);
  for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) { const d = Math.hypot(x - 15.5, y - 15.5) / 15.5; px[(y * 32 + x) * 4 + 3] = Math.max(0, 1 - d * d) * 255; }
  const blob = new THREE.DataTexture(px, 32, 32, THREE.RGBAFormat); blob.magFilter = blob.minFilter = THREE.LinearFilter; blob.needsUpdate = true;
  const shadowMat = new THREE.MeshBasicMaterial({ map: blob, transparent: true, opacity: 0.45, depthWrite: false, color: 0x000000 });
  const shadows = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.9, 0.9).rotateX(-Math.PI / 2), shadowMat, cap);
  shadows.frustumCulled = false; shadows.count = 0; shadows.renderOrder = 2; shadows.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(shadows);

  const col = new THREE.Color();
  const setCol = (mesh, name, i, hex) => { col.set(hex); const a = mesh.geometry.attributes[name]; a.setXYZ(i, col.r, col.g, col.b); a.needsUpdate = true; };
  const setCell = (mesh, i, v) => { const a = mesh.geometry.attributes.aCell; if (a.array[i] !== v) { a.array[i] = v; a.needsUpdate = true; } };

  // temporaries
  const R = new THREE.Matrix4(), Bd = new THREE.Matrix4(), T = new THREE.Matrix4(), Hd = new THREE.Matrix4(), A = new THREE.Matrix4(), L = new THREE.Matrix4(), X = new THREE.Matrix4(), X2 = new THREE.Matrix4();
  const ZERO = new THREE.Matrix4().makeScale(0, 0, 0);
  const q = new THREE.Quaternion(), v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1), UP = new THREE.Vector3(0, 1, 0), DOWN = new THREE.Vector3(0, -1, 0);
  const put = (mesh, i, m) => { const e = m.elements, a = mesh.instanceMatrix.array, o = i * 16; for (let k = 0; k < 16; k++) a[o + k] = e[k]; };
  // out = parent * T(x, y, z) * Rx(rx) * Rz(rz)
  const hinge = (out, parent, x, y, z, rx, rz) => {
    const cx = Math.cos(rx), sx = Math.sin(rx), cz = Math.cos(rz), sz = Math.sin(rz);
    X.set(cz, -sz, 0, x, cx * sz, cx * cz, -sx, y, sx * sz, sx * cz, cx, z, 0, 0, 0, 1);
    return out.multiplyMatrices(parent, X);
  };
  const turnY = (out, parent, x, y, z, ry) => {
    const c = Math.cos(ry), s = Math.sin(ry);
    X.set(c, 0, s, x, 0, 1, 0, y, -s, 0, c, z, 0, 0, 0, 1);
    return out.multiplyMatrices(parent, X);
  };
  const boxAt = (i, parent, b, oy) => { X2.set(b[0], 0, 0, b[3], 0, b[1], 0, b[4] + oy, 0, 0, b[2], b[5], 0, 0, 0, 1); put(extras, i, X.multiplyMatrices(parent, X2)); };
  const PHONE = [0.08, 0.16, 0.02, 0, -0.66, 0.05];
  let birdsUsed = 0, dirty = false;

  const draw = {
    cap, calls: list.length + 1, meshes: list, shadows, extras, atlas: map,
    // colours and cells, once, when someone takes a slot
    dress(i, look) {
      const m = meshes;
      setCol(m.head, 'aSkin', i, look.skin); setCol(m.head, 'aTint', i, look.skin);
      setCol(m.torso, 'aTint', i, look.shirt); setCol(m.torso, 'aSkin', i, look.skin); setCell(m.torso, i, look.shirtCell);
      for (const a of [m.armL, m.armR]) { setCol(a, 'aTint', i, look.arm); setCol(a, 'aSkin', i, look.skin); setCell(a, i, look.armCell); }
      for (const l of [m.legL, m.legR]) { setCol(l, 'aTint', i, look.leg); setCol(l, 'aSkin', i, look.skin); setCell(l, i, look.legCell); }
      for (let k = 0; k < EXTRAS; k++) {
        const b = look.boxes[k];
        setCol(extras, 'aTint', i * EXTRAS + k, k === 3 ? '#1b1924' : b ? b.color : '#000000');
        if (!b) put(extras, i * EXTRAS + k, ZERO);
      }
    },
    // Write one person's matrices. `o` is the pose: hips, dx, pitch (whole body round x), lean, twist,
    // head, armL, armR, outL, outR, legL, legR, phone, face.
    pose(i, p, o, groundY, night) {
      const s = p.look.scale, c = Math.cos(p.h + (o.yaw || 0)), sn = Math.sin(p.h + (o.yaw || 0));
      R.set(c * s, 0, sn * s, p.x, 0, s, 0, p.y, -sn * s, 0, c * s, p.z, 0, 0, 0, 1);
      hinge(Bd, R, o.dx, o.hips, 0, o.pitch, 0);
      turnY(T, Bd, 0, 0, 0, o.twist); if (o.lean) hinge(T, T, 0, 0, 0, o.lean, 0);
      put(meshes.torso, i, T);
      turnY(Hd, T, 0, 0.64, 0, o.head); put(meshes.head, i, Hd);
      hinge(A, T, 0.26, 0.60, 0, o.armL, o.outL); put(meshes.armL, i, A);
      hinge(A, T, -0.26, 0.60, 0, o.armR, -o.outR); put(meshes.armR, i, A);
      if (o.phone) boxAt(i * EXTRAS + 3, A, PHONE, 0); else put(extras, i * EXTRAS + 3, ZERO);
      hinge(L, Bd, 0.10, 0, 0, o.legL, 0); put(meshes.legL, i, L);
      hinge(L, Bd, -0.10, 0, 0, o.legR, 0); put(meshes.legR, i, L);
      draw.dressed(i, p, T, Hd);
      draw.shadow(i, p.x + o.dx * c, groundY, p.z - o.dx * sn, o.pitch ? 1.5 : 1);
      setCell(meshes.head, i, o.face);
      dirty = true;
    },
    dressed(i, p, torso, head) {
      const bx = p.look.boxes;
      for (let k = 0; k < bx.length; k++) boxAt(i * EXTRAS + k, bx[k].on === 'head' ? head : torso, bx[k].box, bx[k].on === 'head' ? 0.18 : 0.32);
    },
    shadow(i, x, y, z, k) { X.set(k, 0, 0, x, 0, 1, 0, y + 0.03, 0, 0, k, z, 0, 0, 0, 1); put(shadows, i, X); },
    // a person who is a rope: each box runs between two of its points
    rope(i, p, rope, groundY) {
      const P = rope.p, s = rope.scale;
      const at = (k, out) => out.set(P[k * 3], P[k * 3 + 1], P[k * 3 + 2]);
      const span = (mesh, from, to, dir, shift) => {
        at(from, v0); at(to, v1); v1.sub(v0).normalize(); q.setFromUnitVectors(dir, v1);
        if (shift) v0.addScaledVector(shift, 1);
        X2.compose(v0, q, one.set(s, s, s)); put(mesh, i, X2);
        return X2;
      };
      T.copy(span(meshes.torso, HIPS, NECK, UP));
      Hd.copy(span(meshes.head, NECK, HEAD, UP));
      draw.dressed(i, p, T, Hd);
      span(meshes.armL, CHEST, HAND_L, DOWN); span(meshes.armR, CHEST, HAND_R, DOWN);
      span(meshes.legL, HIPS, FOOT_L, DOWN); span(meshes.legR, HIPS, FOOT_R, DOWN);
      put(extras, i * EXTRAS + 3, ZERO);
      draw.shadow(i, P[HIPS * 3], groundY, P[HIPS * 3 + 2], 1.5);
      setCell(meshes.head, i, FACE.shocked);
      dirty = true;
    },
    // three small birds on a ring round a dazed head
    birds(x, y, z, t) {
      for (let k = 0; k < 3 && birdsUsed < BIRDS; k++, birdsUsed++) {
        const a = t * 5 + k * 2.094, slot = cap * EXTRAS + birdsUsed;
        X.set(0.09, 0, 0, x + Math.cos(a) * 0.38, 0, 0.05 + 0.03 * Math.sin(t * 18 + k), 0, y + 0.1 * Math.sin(a * 0.5), 0, 0, 0.09, z + Math.sin(a) * 0.38, 0, 0, 0, 1);
        put(extras, slot, X);
      }
      dirty = true;
    },
    hide(i) { for (const m of list) if (m !== extras) put(m, i, ZERO); for (let k = 0; k < EXTRAS; k++) put(extras, i * EXTRAS + k, ZERO); put(shadows, i, ZERO); dirty = true; },
    begin() { for (let k = 0; k < birdsUsed; k++) put(extras, cap * EXTRAS + k, ZERO); if (birdsUsed) dirty = true; birdsUsed = 0; },
    // after the frame's poses: how many slots are alive
    end(n, night) {
      for (const m of list) m.count = m === extras ? (birdsUsed ? cap * EXTRAS + birdsUsed : n * EXTRAS) : n;
      shadows.count = n;
      shadowMat.opacity = 0.45 - 0.2 * night;
      if (dirty) { for (const m of list) m.instanceMatrix.needsUpdate = true; shadows.instanceMatrix.needsUpdate = true; dirty = false; }
    },
    triangles: (n) => n * (72 + EXTRAS * 12 + 2),
    dispose() { for (const m of list) { scene.remove(m); m.geometry.dispose(); } scene.remove(shadows); shadows.geometry.dispose(); mat.dispose(); map.dispose(); blob.dispose(); shadowMat.dispose(); },
  };
  for (let k = 0; k < BIRDS; k++) { setCol(extras, 'aTint', cap * EXTRAS + k, '#ffe14a'); put(extras, cap * EXTRAS + k, ZERO); }
  return draw;
}
