// The chunk streamer (plan/bible/tech/algorithms.md section 2). The city is cut into 160 m chunks
// that build and drop as the player moves, so there is never a loading screen.
//   LOD0: full detail and collision, within lod0Radius chunks. At most six meshes a chunk.
//   LOD1: a shell per building, merged per 4 x 4 group of chunks: one draw call a group.
//   LOD2: the skyline (skyline.js), built once.
// Building is cut into slices of at most 4 ms a frame; chunks ahead of the player go first; a
// chunk drops only when it is one ring further out than where it would load.
import * as THREE from 'three';
import { MeshBuilder } from '../gfx/builder.js';
import { chunkMaterials } from '../gfx/materials.js';
import { rng } from '../core/rng.js';

const LETTERS = ['G', 'M', 'B', 'N', 'S', 'L'];
const key = (cx, cz) => cx + cz * 64;
const now = () => performance.now();

export function createChunks({ scene, map, collide, props, decor, quality, events, state, generators, heroes }) {
  const mats = chunkMaterials();
  const loaded = new Map();          // key -> chunk, LOD0
  const building = new Map();        // key -> job, LOD0 chunks queued or part-built
  const groups = new Map();          // group key -> { gx, gz, mesh, sig, tris, queued }
  const sets = [];                   // builder sets, used again and again (the pool)
  const shellB = new MeshBuilder({ size: 8192 });
  let queue = [], current = null, ringAt = 0, lastX = null, lastZ = null, litWas = null;
  const centre = { cx: -99, cz: -99 };
  const stat = { built: 0, dropped: 0, maxStepMs: 0, buildMsMax: 0, ensureMs: 0, groupsBuilt: 0, pooled: 0 };

  const takeSet = () => {
    const s = sets.pop() || { G: new MeshBuilder({ size: 512 }), M: new MeshBuilder({ size: 2048 }), B: new MeshBuilder({ size: 16384 }),
      N: new MeshBuilder({ size: 2048 }), S: new MeshBuilder({ uv: true, size: 256 }), L: new MeshBuilder({ size: 2048 }) };
    for (const l of LETTERS) s[l].reset();
    return s;
  };
  const generatorFor = (rect) => {
    for (const zn of map.zones) if (zn.bounds.x0 < rect.x1 && zn.bounds.x1 > rect.x0 && zn.bounds.z0 < rect.z1 && zn.bounds.z1 > rect.z0) return generators[zn.generator] || null;
    return null;
  };
  const cheb = (cx, cz, c) => Math.max(Math.abs(cx - c.cx), Math.abs(cz - c.cz));

  // ---------- LOD0 ----------

  function begin(job) {
    const { cx, cz } = job, rect = map.chunkRect(cx, cz), k = key(cx, cz);
    const chunk = job.chunk = { cx, cz, key: k, rect, seed: map.chunkSeed(cx, cz), owner: 'chunk:' + k, meshes: [], objects: [], props: [], tris: 0, lit: null };
    const gen = generatorFor(rect);
    job.set = takeSet(); job.dec = decor.open(k, cx, cz, rect);
    const o = job.o = { ...job.set, rnd: rng(chunk.seed), low: quality.level === 'low',
      solid(x0, x1, z0, z1, h = 0) { collide.add(chunk.owner, { x0, x1, z0, z1, h }); },
      prop(kind, x, y, z, rot, opts) { const p = props.add(kind, x, y, z, rot, { ...opts, owner: chunk.owner }); if (p) chunk.props.push(p); return p; },
      decor: job.dec.add,
      object(m) { m.matrixAutoUpdate = false; chunk.objects.push(m); },
    };
    job.it = gen ? gen.build(o, chunk, map, heroes) : null;     // land with nothing on it yet loads as an empty chunk
    job.begun = true;
  }
  function upload(job) {
    const chunk = job.chunk;
    for (const l of LETTERS) {
      const b = job.set[l];
      if (!b.count) continue;
      const mesh = new THREE.Mesh(b.build({ free: true, groundUv: l === 'G' ? 7 : 0 }), mats[l]);
      mesh.matrixAutoUpdate = false; mesh.renderOrder = mats.order[l] || 0;
      if (l === 'L') { mesh.visible = mats.lit; chunk.lit = mesh; }
      chunk.tris += b.triangles; chunk.meshes.push(mesh); scene.add(mesh);
    }
    for (const m of chunk.objects) scene.add(m);
    job.dec.done();
    sets.push(job.set); stat.pooled = sets.length; job.set = null;
    loaded.set(chunk.key, chunk); building.delete(chunk.key);
    state.world.chunksLoaded = loaded.size; stat.built++;
    events.emit('chunk:loaded', { cx: chunk.cx, cz: chunk.cz, lod: 0 });
    ringAt = 0;                     // the shells round it need another look
  }
  function free(chunk) {
    for (const m of chunk.meshes) { scene.remove(m); m.geometry.dispose(); }
    for (const m of chunk.objects) { scene.remove(m); m.traverse((c) => { if (c.geometry) c.geometry.dispose(); }); }
    collide.removeOwner(chunk.owner);
    for (const p of chunk.props) props.remove(p);
    decor.drop(chunk.key);
  }
  function drop(chunk) {
    free(chunk); loaded.delete(chunk.key);
    state.world.chunksLoaded = loaded.size; stat.dropped++;
    events.emit('chunk:unloaded', { cx: chunk.cx, cz: chunk.cz, lod: 0 });
  }
  function cancel(job) {
    building.delete(key(job.cx, job.cz));
    if (job.begun) { free(job.chunk); sets.push(job.set); }
    if (current === job) current = null;
  }

  // ---------- LOD1 ----------

  function members(gx, gz, r1) {
    const g = groups.get(gx + gz * 16), out = [];
    for (let cx = gx * 4; cx < gx * 4 + 4; cx++) for (let cz = gz * 4; cz < gz * 4 + 4; cz++) {
      const k = key(cx, cz), d = cheb(cx, cz, centre);
      if (!map.inWorld(cx, cz) || loaded.has(k)) continue;
      if (d <= r1 || (d <= r1 + 1 && g && g.has && g.has.has(k))) out.push(k);
    }
    return out;
  }
  function buildGroup(job) {
    if (!job.begun) { job.begun = true; job.list = members(job.gx, job.gz, quality.get('lod1Radius')); job.i = 0; shellB.reset(); }
    if (job.i < job.list.length) {
      const k = job.list[job.i++], cx = k % 64, cz = Math.floor(k / 64), rect = map.chunkRect(cx, cz), gen = generatorFor(rect);
      if (gen && gen.shell) gen.shell({ B: shellB }, { cx, cz, rect }, map, heroes);
      return false;
    }
    const gk = job.gx + job.gz * 16, g = groups.get(gk) || { gx: job.gx, gz: job.gz, mesh: null };
    if (g.mesh) { scene.remove(g.mesh); g.mesh.geometry.dispose(); g.mesh = null; }
    if (shellB.count) {
      g.mesh = new THREE.Mesh(shellB.build({ free: true }), mats.B);
      g.mesh.matrixAutoUpdate = false; scene.add(g.mesh);
    }
    g.tris = shellB.triangles; g.sig = job.list.join(); g.has = new Set(job.list); g.queued = false;
    groups.set(gk, g); stat.groupsBuilt++;
    for (const k of job.list) events.emit('chunk:loaded', { cx: k % 64, cz: Math.floor(k / 64), lod: 1 });
    return true;
  }

  // ---------- which chunks, in what order ----------

  function rings() {
    const p = state.player, sp = p.vf !== undefined ? p.vf : p.speed || 0, vx = Math.sin(p.h) * sp, vz = Math.cos(p.h) * sp;
    const c = map.chunkOf(p.x + vx * 1.5, p.z + vz * 1.5);            // look 1.5 s ahead
    centre.cx = c.cx; centre.cz = c.cz;
    const r0 = quality.get('lod0Radius'), r1 = quality.get('lod1Radius');
    for (const ch of [...loaded.values()]) if (cheb(ch.cx, ch.cz, c) > r0 + 1) drop(ch);
    for (const job of [...building.values()]) if (cheb(job.cx, job.cz, c) > r0 + 1) cancel(job);
    for (let cx = c.cx - r0; cx <= c.cx + r0; cx++) for (let cz = c.cz - r0; cz <= c.cz + r0; cz++) {
      const k = key(cx, cz);
      if (map.inWorld(cx, cz) && !loaded.has(k) && !building.has(k)) building.set(k, { lod: 0, cx, cz });
    }
    const g0x = (c.cx - r1 - 1) >> 2, g1x = (c.cx + r1 + 1) >> 2, g0z = (c.cz - r1 - 1) >> 2, g1z = (c.cz + r1 + 1) >> 2;
    const groupJobs = queue.filter((j) => j.lod === 1 && j !== current);
    for (let gx = Math.max(0, g0x); gx <= Math.min(9, g1x); gx++) for (let gz = Math.max(0, g0z); gz <= Math.min(7, g1z); gz++) {
      const gk = gx + gz * 16, g = groups.get(gk), sig = members(gx, gz, r1).join();
      if ((g ? g.sig : '') !== sig && !(g && g.queued) && !groupJobs.some((j) => j.gx === gx && j.gz === gz)) {
        const job = { lod: 1, gx, gz, cx: gx * 4 + 1.5, cz: gz * 4 + 1.5 };
        if (g) g.queued = true; else groups.set(gk, { gx, gz, mesh: null, sig: '', queued: true });
        groupJobs.push(job);
      }
    }
    for (const [gk, g] of groups) {
      if (g.gx >= g0x && g.gx <= g1x && g.gz >= g0z && g.gz <= g1z) continue;
      if (g.mesh) { scene.remove(g.mesh); g.mesh.geometry.dispose(); }
      for (const k of g.has || []) events.emit('chunk:unloaded', { cx: k % 64, cz: Math.floor(k / 64), lod: 1 });
      groups.delete(gk);
    }
    // order: full chunks before shells; ahead of the player's velocity first, then by distance
    const len = Math.hypot(vx, vz), dx = len > 1 ? vx / len : 0, dz = len > 1 ? vz / len : 0;
    const pc = map.chunkOf(p.x, p.z);
    const score = (j) => { const ox = j.cx - pc.cx, oz = j.cz - pc.cz; return j.lod * 1000 + Math.hypot(ox, oz) - 1.5 * (ox * dx + oz * dz); };
    queue = [...building.values(), ...groupJobs].filter((j) => j !== current).sort((a, b) => score(a) - score(b));
  }

  // one step of a job; true when the job is finished
  function step(job) {
    if (job.lod === 1) return buildGroup(job);
    if (!job.begun) { begin(job); return false; }
    if (job.it && !job.done) { job.done = job.it.next().done; return false; }
    upload(job);
    return true;
  }
  function pump(budgetMs) {
    const t0 = now();
    let job;
    while ((job = current || queue.shift())) {
      current = job;
      for (;;) {
        const s0 = now();
        if (s0 - t0 >= budgetMs) return;
        const done = step(job);
        stat.maxStepMs = Math.max(stat.maxStepMs, now() - s0);
        if (done) break;
      }
      current = null;
    }
  }

  const chunks = {
    buildMs: 0, stat, loaded, groups,
    get loadedCount() { return loaded.size; },
    get pending() { return queue.length + (current ? 1 : 0); },
    isLoaded: (cx, cz) => loaded.has(key(cx, cz)),
    // Build the chunks round a point right now, without the 4 ms slices: for the first frame, a
    // teleport, a character switch or a cutscene (all cuts, so a long frame does not show).
    ensure(x, z, radius = 1) {
      const t0 = now(), c = map.chunkOf(x, z);
      for (let cx = c.cx - radius; cx <= c.cx + radius; cx++) for (let cz = c.cz - radius; cz <= c.cz + radius; cz++) {
        const k = key(cx, cz);
        if (!map.inWorld(cx, cz) || loaded.has(k)) continue;
        const job = building.get(k) || { lod: 0, cx, cz };
        building.set(k, job);
        while (!step(job)) { /* straight through */ }
        if (current === job) current = null;
      }
      queue = queue.filter((j) => j.lod === 1 || building.has(key(j.cx, j.cz)));
      stat.ensureMs = now() - t0; ringAt = 0;
      return Promise.resolve(loaded.size);
    },
    // once a frame, outside the simulation steps
    update(camera) {
      const p = state.player, t = now();
      if (lastX !== null && Math.hypot(p.x - lastX, p.z - lastZ) > 120) chunks.ensure(p.x, p.z, Math.min(1, quality.get('lod0Radius')));
      lastX = p.x; lastZ = p.z;
      if (t - ringAt > 250) { ringAt = t; rings(); }
      const t0 = now();
      pump(quality.get('maxChunkMs'));
      chunks.buildMs = now() - t0; stat.buildMsMax = Math.max(stat.buildMsMax, chunks.buildMs);
      if (mats.lit !== litWas) { litWas = mats.lit; for (const ch of loaded.values()) if (ch.lit) ch.lit.visible = mats.lit; }
      const pc = map.chunkOf(p.x, p.z);
      decor.update(camera, pc.cx, pc.cz);
    },
    stats() {
      let tris = 0, max = 0, n = 0, shell = 0, shellMax = 0, gn = 0;
      for (const ch of loaded.values()) if (ch.tris) { tris += ch.tris; max = Math.max(max, ch.tris); n++; }
      for (const g of groups.values()) if (g.mesh) { shell += g.tris; gn++; shellMax = Math.max(shellMax, g.tris / Math.max(1, g.has.size)); }
      return { lod0: loaded.size, lod0Built: n, lod0TrisAvg: n ? Math.round(tris / n) : 0, lod0TrisMax: max, groups: gn, shellTris: shell, shellTrisPerChunkMax: Math.round(shellMax),
        pending: chunks.pending, colliders: collide.count, ...stat };
    },
    // drop everything, shells too; the next update builds the rings again from nothing
    reset() {
      for (const ch of [...loaded.values()]) drop(ch);
      for (const j of [...building.values()]) cancel(j);
      for (const g of groups.values()) if (g.mesh) { scene.remove(g.mesh); g.mesh.geometry.dispose(); }
      groups.clear(); queue = []; current = null; ringAt = 0;
    },
  };
  events.on('quality:changed', () => { ringAt = 0; });
  return chunks;
}
