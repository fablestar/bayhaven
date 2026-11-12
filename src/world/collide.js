// Collision: a spatial hash with 20 m cells (plan/bible/tech/algorithms.md section 3). Static
// shapes go in when their chunk loads and come out by owner when it drops; a query looks only
// at the cells a body touches. Shapes live in one flat typed array; no three.js in here.
//   shape: { x0, x1, z0, z1, level, h } or { cx, cz, hw, hd, rot, level, h }  (h: height, for cameras and rays)

const CELL = 20, STRIDE = 12;   // bx0 bx1 bz0 bz1 | cx cz hw hd cos sin | h level
const cellKey = (ix, iz) => (Math.imul(ix, 73856093) ^ Math.imul(iz, 19349663)) | 0;

export function createCollide() {
  let data = new Float32Array(1024 * STRIDE), stamp = new Uint32Array(1024), tick = 1, top = 0;
  const free = [], shapes = [], owners = new Map(), cells = new Map();
  const dyn = new Map(), bodies = new Set();
  let tested = 0, queries = 0;

  function eachCell(x0, x1, z0, z1, fn) {
    const a = Math.floor(x0 / CELL), b = Math.floor(x1 / CELL), c = Math.floor(z0 / CELL), d = Math.floor(z1 / CELL);
    for (let ix = a; ix <= b; ix++) for (let iz = c; iz <= d; iz++) fn(cellKey(ix, iz));
  }
  // gather the shapes whose cells a box touches, each once
  function gather(x0, x1, z0, z1, level, out) {
    let n = 0; tick++; queries++;
    const a = Math.floor(x0 / CELL), b = Math.floor(x1 / CELL), c = Math.floor(z0 / CELL), d = Math.floor(z1 / CELL);
    for (let ix = a; ix <= b; ix++) for (let iz = c; iz <= d; iz++) {
      const list = cells.get(cellKey(ix, iz));
      if (!list) continue;
      for (let k = 0; k < list.length; k++) {
        const id = list[k], o = id * STRIDE;
        if (stamp[id] === tick) continue;
        stamp[id] = tick; tested++;
        if (data[o] > x1 || data[o + 1] < x0 || data[o + 2] > z1 || data[o + 3] < z0) continue;
        if (data[o + 11] !== (level || 0) && level !== -1) continue;       // no level given means the ground; -1 asks for every level
        out[n++] = id;
      }
    }
    return n;
  }
  // nearest point of shape `id` to (x, z), in world space; returns squared distance, sets hit.*
  const hit = { x: 0, z: 0, nx: 0, nz: 0, depth: 0, inside: false };
  function closest(id, x, z) {
    const o = id * STRIDE, cs = data[o + 8], sn = data[o + 9], hw = data[o + 6], hd = data[o + 7];
    const dx = x - data[o + 4], dz = z - data[o + 5];
    const lx = dx * cs - dz * sn, lz = dx * sn + dz * cs;            // into the box's own frame
    let qx = Math.max(-hw, Math.min(lx, hw)), qz = Math.max(-hd, Math.min(lz, hd));
    hit.inside = qx === lx && qz === lz;
    let nx, nz, dist;
    if (hit.inside) {                                               // leave through the nearest face
      const l = lx + hw, r = hw - lx, n = lz + hd, s = hd - lz, m = Math.min(l, r, n, s);
      nx = m === l ? -1 : m === r ? 1 : 0; nz = nx ? 0 : m === n ? -1 : 1; dist = -m;
      qx = lx; qz = lz;
    } else { nx = lx - qx; nz = lz - qz; dist = Math.hypot(nx, nz); nx /= dist; nz /= dist; }
    hit.x = data[o + 4] + qx * cs + qz * sn; hit.z = data[o + 5] - qx * sn + qz * cs;
    hit.nx = nx * cs + nz * sn; hit.nz = -nx * sn + nz * cs; hit.depth = dist;
    return dist;
  }
  const scratch = [];

  const collide = {
    cell: CELL, shapes,
    get count() { return top - free.length; },
    stats: () => ({ shapes: top - free.length, cells: cells.size, tested, queries }),
    // add a static shape for an owner (a chunk key, say). Returns the shape's id.
    add(owner, s) {
      const id = free.length ? free.pop() : top++;
      if (id * STRIDE >= data.length) {
        const d = new Float32Array(data.length * 2); d.set(data); data = d;
        const st = new Uint32Array(stamp.length * 2); st.set(stamp); stamp = st;
      }
      const o = id * STRIDE;
      let cx, cz, hw, hd, rot = 0;
      if (s.cx !== undefined) { cx = s.cx; cz = s.cz; hw = s.hw; hd = s.hd; rot = s.rot || 0; }
      else { cx = (s.x0 + s.x1) / 2; cz = (s.z0 + s.z1) / 2; hw = (s.x1 - s.x0) / 2; hd = (s.z1 - s.z0) / 2; }
      const cs = Math.cos(rot), sn = Math.sin(rot), ex = Math.abs(cs) * hw + Math.abs(sn) * hd, ez = Math.abs(sn) * hw + Math.abs(cs) * hd;
      data[o] = cx - ex; data[o + 1] = cx + ex; data[o + 2] = cz - ez; data[o + 3] = cz + ez;
      data[o + 4] = cx; data[o + 5] = cz; data[o + 6] = hw; data[o + 7] = hd; data[o + 8] = cs; data[o + 9] = sn;
      data[o + 10] = s.h || 0; data[o + 11] = s.level || 0;
      // the object other code may hold: its bounding box, day 1's shape
      shapes[id] = { id, owner, x0: cx - ex, x1: cx + ex, z0: cz - ez, z1: cz + ez, h: s.h || 0, level: s.level || 0 };
      eachCell(data[o], data[o + 1], data[o + 2], data[o + 3], (k) => { const l = cells.get(k); if (l) l.push(id); else cells.set(k, [id]); });
      if (!owners.has(owner)) owners.set(owner, []);
      owners.get(owner).push(id);
      return id;
    },
    removeOwner(owner) {
      const ids = owners.get(owner);
      if (!ids) return 0;
      for (const id of ids) {
        const o = id * STRIDE;
        eachCell(data[o], data[o + 1], data[o + 2], data[o + 3], (k) => {
          const l = cells.get(k); if (!l) return;
          const i = l.indexOf(id); if (i >= 0) { l[i] = l[l.length - 1]; l.pop(); }
          if (!l.length) cells.delete(k);
        });
        shapes[id] = null; free.push(id);
      }
      owners.delete(owner);
      return ids.length;
    },
    // shapes a circle touches: fills out with shape objects, returns how many
    circle(x, z, r, level, out) {
      const n = gather(x - r, x + r, z - r, z + r, level, scratch);
      let m = 0;
      for (let i = 0; i < n; i++) if (closest(scratch[i], x, z) <= r) out[m++] = shapes[scratch[i]];
      return m;
    },
    // shapes whose bounding box a rotated box { cx, cz, hw, hd, rot } may touch
    box(b, level, out) {
      const cs = Math.abs(Math.cos(b.rot || 0)), sn = Math.abs(Math.sin(b.rot || 0)), ex = cs * b.hw + sn * b.hd, ez = sn * b.hw + cs * b.hd;
      const n = gather(b.cx - ex, b.cx + ex, b.cz - ez, b.cz + ez, level, scratch);
      for (let i = 0; i < n; i++) out[i] = shapes[scratch[i]];
      return n;
    },
    // push a circle { x, z, r, level } out of everything it touches. Returns the deepest contact
    // { x, z, nx, nz, depth, owner } or null. The body's x and z are moved.
    pushOutCircle(body) {
      const n = gather(body.x - body.r, body.x + body.r, body.z - body.r, body.z + body.r, body.level, scratch);
      let worst = null, deep = 0;
      for (let i = 0; i < n; i++) {
        const d = closest(scratch[i], body.x, body.z);
        if (d > body.r) continue;
        const push = body.r - d;
        body.x += hit.nx * push; body.z += hit.nz * push;
        if (push > deep) { deep = push; worst = { x: hit.x, z: hit.z, nx: hit.nx, nz: hit.nz, depth: push, owner: shapes[scratch[i]].owner }; }
      }
      return worst;
    },
    // a rotated box against the static world, as two circles along its length (day 1's car)
    pushOutBox(body) {
      const fx = Math.sin(body.rot || 0), fz = Math.cos(body.rot || 0), off = Math.max(0, body.hd - body.hw);
      let worst = null;
      for (const s of [off, -off]) {
        const c = { x: body.cx + fx * s, z: body.cz + fz * s, r: body.hw, level: body.level };
        const h = collide.pushOutCircle(c);
        if (h) { body.cx = c.x - fx * s; body.cz = c.z - fz * s; if (!worst || h.depth > worst.depth) worst = h; }
      }
      return worst;
    },
    // First thing a ray hits: walks the grid a cell at a time. minH: ignore shapes lower than this.
    ray(x0, z0, x1, z1, level, minH = 0) {
      const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz);
      if (len < 1e-6) return null;
      let ix = Math.floor(x0 / CELL), iz = Math.floor(z0 / CELL);
      const sx = dx > 0 ? 1 : -1, sz = dz > 0 ? 1 : -1;
      const tdx = dx ? Math.abs(CELL / dx) : Infinity, tdz = dz ? Math.abs(CELL / dz) : Infinity;
      let tx = dx ? ((dx > 0 ? (ix + 1) * CELL - x0 : x0 - ix * CELL) / Math.abs(dx)) : Infinity;
      let tz = dz ? ((dz > 0 ? (iz + 1) * CELL - z0 : z0 - iz * CELL) / Math.abs(dz)) : Infinity;
      let best = null, bt = Infinity, t = 0;
      tick++; queries++;
      while (t <= 1) {
        const list = cells.get(cellKey(ix, iz)), tEnd = Math.min(tx, tz);
        if (list) for (let k = 0; k < list.length; k++) {
          const id = list[k], o = id * STRIDE;
          if (stamp[id] === tick) continue;
          stamp[id] = tick; tested++;
          if ((data[o + 11] !== (level || 0) && level !== -1) || data[o + 10] < minH) continue;
          // slab test in the box's own frame
          const cs = data[o + 8], sn = data[o + 9], rx = x0 - data[o + 4], rz = z0 - data[o + 5];
          const ox = rx * cs - rz * sn, oz = rx * sn + rz * cs, ex = dx * cs - dz * sn, ez = dx * sn + dz * cs;
          let t0 = 0, t1 = 1, ok = true;
          for (const [p, d, hh] of [[ox, ex, data[o + 6]], [oz, ez, data[o + 7]]]) {
            if (Math.abs(d) < 1e-9) { if (p < -hh || p > hh) { ok = false; break; } continue; }
            let a = (-hh - p) / d, b = (hh - p) / d; if (a > b) { const s = a; a = b; b = s; }
            t0 = Math.max(t0, a); t1 = Math.min(t1, b); if (t0 > t1) { ok = false; break; }
          }
          if (ok && t0 < bt) { bt = t0; best = id; }
        }
        if (best !== null && bt <= tEnd) break;
        if (tx < tz) { t = tx; tx += tdx; ix += sx; } else { t = tz; tz += tdz; iz += sz; }
      }
      return best === null ? null : { t: bt, x: x0 + dx * bt, z: z0 + dz * bt, owner: shapes[best].owner, shape: shapes[best] };
    },
    // is a point inside something at least as tall as y (the chase camera asks this)
    blocked(x, y, z, pad) {
      const n = gather(x - pad, x + pad, z - pad, z + pad, undefined, scratch);
      for (let i = 0; i < n; i++) { const s = shapes[scratch[i]]; if (s.h > 2.5 && y < s.h + pad) return true; }
      return false;
    },
    // moving things: a second grid, filled again every step by clearing lengths, not allocating
    bodies: {
      add(b) { bodies.add(b); }, remove(b) { bodies.delete(b); },
      refresh() {
        for (const l of dyn.values()) l.length = 0;
        for (const b of bodies) { const k = cellKey(Math.floor(b.x / CELL), Math.floor(b.z / CELL)); const l = dyn.get(k); if (l) l.push(b); else dyn.set(k, [b]); }
      },
      near(x, z, r, out) {
        let n = 0;
        const a = Math.floor((x - r) / CELL), b = Math.floor((x + r) / CELL), c = Math.floor((z - r) / CELL), d = Math.floor((z + r) / CELL);
        for (let ix = a; ix <= b; ix++) for (let iz = c; iz <= d; iz++) {
          const l = dyn.get(cellKey(ix, iz)); if (!l) continue;
          for (const o of l) if ((o.x - x) * (o.x - x) + (o.z - z) * (o.z - z) <= (r + (o.r || 0)) * (r + (o.r || 0))) out[n++] = o;
        }
        return n;
      },
    },
  };
  return collide;
}
