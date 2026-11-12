// Damage panels for the hero build (the player's car): hood, boot lid, two doors, two bumpers.
// Nothing bends: a panel turns on its hinge, hangs, flaps and falls off
// (plan/bible/art/vehicles-modelling.md section 6). The six are slabs laid just proud of the body,
// all in one mesh that is rewritten when something moves: one draw call, 72 triangles.
// Where a panel has fallen off, a dark slab shows what was under it.
import * as THREE from 'three';
import { sheet } from './models.js';

const ENGINE = 0x3a3844, GAP = 0x1b1924, VERTS = 36;
// the corners of a unit box, two triangles a face, with the face's normal
const FACES = [[[1, 0, 0], [1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]], [[-1, 0, 0], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1], [-1, -1, -1]],
  [[0, 1, 0], [-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]], [[0, -1, 0], [-1, -1, 1], [-1, -1, -1], [1, -1, -1], [1, -1, 1]],
  [[0, 0, 1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]], [[0, 0, -1], [1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1]]];

// Where the panels sit on a model. Each: pivot (the hinge), box (centre from the hinge and half sizes),
// axis the hinge turns about, rest angle, zone ('front', 'rear', 'left', 'right').
export function panelDefs(model) {
  const s = sheet(model), by = (n) => s.pieces.find((p) => p.name === n), out = [];
  if (s.two) return out;
  const hood = by('hood'), cabin = by('cabin'), body = by('body') || by('box'), boot = by('boot'), base = by('sill') || by('chassis') || s.pieces[0];
  if (hood) {            // a wedge: the slab lies on its slope, hinged at the rear top edge
    const L = hood.L, y1 = hood.y + hood.H, rest = Math.atan2(hood.mod === '/f' ? 0.4 * hood.H : 0, L), len = Math.hypot(L, Math.tan(rest) * L) - 0.04;
    out.push({ name: 'hood', zone: 'front', pivot: [0, y1 + 0.02, hood.f - L / 2 + 0.03], c: [0, 0, len / 2], half: [hood.W / 2 - 0.05, 0.02, len / 2], axis: 'x', rest, dent: -0.1, open: -1.1, under: ENGINE });
  }
  if (cabin && body) {
    const rear = body.f - body.L / 2, bz = boot ? boot.f - boot.L / 2 : rear, front = boot ? boot.f + boot.L / 2 : cabin.f - cabin.L / 2 + 0.3, L = front - bz;
    const top = boot ? boot.y + boot.H : body.y + body.H;
    if (L > 0.35 && !by('bed')) {
      const rest = boot && boot.mod === '/r' ? Math.atan2(0.4 * boot.H, L) : 0, len = Math.hypot(L, Math.tan(rest) * L) - 0.04;
      out.push({ name: 'boot', zone: 'rear', pivot: [0, top + 0.03, front - 0.02], c: [0, 0, -len / 2], half: [(boot ? boot.W : body.W) / 2 - 0.05, 0.03, len / 2], axis: 'x', rest: -rest, dent: 0.08, open: 0.9, under: GAP });
    }
    const dl = 0.55 * cabin.L, y0 = body.y + 0.04, h = Math.min(body.H, 0.7) - 0.08, w = body.W / 2;
    for (const side of [1, -1]) out.push({ name: side > 0 ? 'doorL' : 'doorR', zone: side > 0 ? 'left' : 'right', pivot: [side * (w + 0.015), y0 + h / 2, cabin.f + dl / 2], c: [0, 0, -dl / 2],
      half: [0.02, h / 2, dl / 2], axis: 'y', rest: 0, dent: 0, open: -side * 1.2, under: GAP, side });
  }
  const bl = 0.15 * base.L, bw = base.W / 2 + 0.03, yb = base.y + base.H / 2, hang = Math.min(0.5, Math.asin(Math.min(1, (yb - 0.06) / (2 * bw))));
  out.push({ name: 'bumperF', zone: 'front', pivot: [bw, yb, base.L / 2 - bl / 2 + 0.04], c: [-bw, 0, 0], half: [bw, 0.11, bl / 2], axis: 'z', rest: 0, dent: 0.05, open: hang, under: GAP, drags: true });
  out.push({ name: 'bumperR', zone: 'rear', pivot: [-bw, yb, -base.L / 2 + bl / 2 - 0.04], c: [bw, 0, 0], half: [bw, 0.11, bl / 2], axis: 'z', rest: 0, dent: -0.05, open: -hang, under: GAP, drags: true });
  return out;
}

export function createPanels(parent, model, paint) {
  const defs = panelDefs(model), n = defs.length;
  const pos = new Float32Array(n * VERTS * 3), nor = new Float32Array(n * VERTS * 3), col = new Float32Array(n * VERTS * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage));
  const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
  mesh.frustumCulled = false;
  if (n) parent.add(mesh);
  const c = new THREE.Color();
  // state: 0 on, 1 dented, 2 loose, 3 gone
  const list = defs.map((d, i) => ({ ...d, i, state: 0, a: 0, v: 0, t: i * 1.7 }));
  let dirty = true, wreck = false;

  function write(p) {
    const gone = p.state === 3, ang = gone ? p.rest : p.rest + p.a, cs = Math.cos(ang), sn = Math.sin(ang), o = p.i * VERTS * 3;
    c.set(wreck ? 0x2b2838 : gone ? p.under : paint); if (p.state === 1 || p.state === 2) c.multiplyScalar(0.85);
    const k = gone ? 0.96 : 1;
    let at = o;
    for (const f of FACES) {
      for (const j of [1, 2, 3, 1, 3, 4]) {
        let x = p.c[0] + f[j][0] * p.half[0] * k, y = p.c[1] + f[j][1] * p.half[1], z = p.c[2] + f[j][2] * p.half[2] * k, nx = f[0][0], ny = f[0][1], nz = f[0][2], t;
        if (p.axis === 'x') { t = y * cs - z * sn; z = y * sn + z * cs; y = t; t = ny * cs - nz * sn; nz = ny * sn + nz * cs; ny = t; }
        else if (p.axis === 'y') { t = x * cs + z * sn; z = -x * sn + z * cs; x = t; t = nx * cs + nz * sn; nz = -nx * sn + nz * cs; nx = t; }
        else { t = x * cs - y * sn; y = x * sn + y * cs; x = t; t = nx * cs - ny * sn; ny = nx * sn + ny * cs; nx = t; }
        pos[at] = x + p.pivot[0]; pos[at + 1] = y + p.pivot[1]; pos[at + 2] = z + p.pivot[2];
        nor[at] = nx; nor[at + 1] = ny; nor[at + 2] = nz; col[at] = c.r; col[at + 1] = c.g; col[at + 2] = c.b;
        at += 3;
      }
    }
  }

  const panels = {
    list, mesh,
    get(name) { return list.find((p) => p.name === name); },
    zone(zone) { return list.filter((p) => p.zone === zone); },
    setState(p, state) { if (p.state === 3 || p.state >= state) return false; p.state = state; if (state === 1) p.a = p.dent; if (state === 3) { p.a = 0; p.v = 0; } dirty = true; return true; },
    dentAll() { for (const p of list) panels.setState(p, 1); },
    setWreck(on) { wreck = on; dirty = true; },
    repair() { for (const p of list) { p.state = 0; p.a = 0; p.v = 0; } wreck = false; dirty = true; },
    // a panel's middle in the car's own space (for the debris box that takes its place)
    centre(p, out) { out.x = p.pivot[0] + p.c[0]; out.y = p.pivot[1] + p.c[1]; out.z = p.pivot[2] + p.c[2]; return out; },
    // loose panels flap: the hood and boot lift with speed on a spring, doors swing out in turns, a bumper hangs
    step(dt, speed, spin) {
      for (const p of list) {
        if (p.state !== 2) continue;
        p.t += dt;
        let want;
        if (p.axis === 'x') want = p.open * Math.min(1, speed / 28) * (0.75 + 0.25 * Math.sin(p.t * 9)) + p.dent;
        else if (p.axis === 'y') want = p.open * Math.min(1, 0.12 + Math.max(0, -p.side * spin) * 0.9 + Math.abs(Math.sin(p.t * 2.3)) * 0.1 * Math.min(1, speed / 10));
        else want = p.open;
        p.v += ((want - p.a) * 60 - p.v * 7) * dt; p.a += p.v * dt;
        dirty = true;
      }
    },
    draw() {
      if (!dirty) return;
      for (const p of list) write(p);
      geo.attributes.position.needsUpdate = geo.attributes.normal.needsUpdate = geo.attributes.color.needsUpdate = true;
      dirty = false;
    },
    dispose() { if (mesh.parent) mesh.parent.remove(mesh); geo.dispose(); mesh.material.dispose(); },
  };
  return panels;
}
