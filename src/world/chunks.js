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

const LETTERS = ['G', 'M', 'B', 'W', 'N', 'S', 'L'];        // W: walls with the window-grid texture (tower districts only)
const key = (cx, cz) => cx + cz * 64;
const now = () => performance.now();

export function createChunks({ scene, map, collide, props, decor, quality, events, state, generators, heroes }) {
  const mats = chunkMaterials();
  const loaded = new Map();          // key -> chunk, LOD0
  const building = new Map();        // key -> job, LOD0 chunks queued or part-built
  const groups = new Map();          // group key -> { gx, gz, mesh, sig, tris, queued }
  const sets = [];                   // builder sets, used again and again (the pool)
  const shellB = new MeshBuilder({ size: 8192 }), shellW = new MeshBuilder({ uv: true, size: 8192 });
  let queue = [], current = null, ringAt = 0, lastX = null, lastZ = null, litWas = null;
  const centre = { cx: -99, cz: -99 };
  const slices = new Float32Array(1024); let sliceAt = 0;      // the last 1,024 frames that did building work
  const stat = { slices: 0, maxStepAt: '', built: 0, dropped: 0, maxStepMs: 0, buildMsMax: 0, ensureMs: 0, groupsBuilt: 0, pooled: 0 };

  const takeSet = () => {
    const s = sets.pop() || { G: new MeshBuilder({ size: 512 }), M: new MeshBuilder({ size: 2048 }), B: new MeshBuilder({ size: 16384 }),
      N: new MeshBuilder({ size: 2048 }), S: new MeshBuilder({ uv: true, size: 256 }), L: new MeshBuilder({ size: 2048 }), W: new MeshBuilder({ uv: true, size: 1024 }) };
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
      solid(x0, x1, z0, z1, h = 0, level = 0) { collide.add(chunk.owner, { x0, x1, z0, z1, h, level }); },
      prop(kind, x, y, z, rot, opts) { const p = props.add(kind, x, y, z, rot, { ...opts, owner: chunk.owner }); if (p) chunk.props.push(p); return p; },
      decor: job.dec.add,
      object(m) { m.matrixAutoUpdate = false; chunk.objects.push(m); },
    };
    // the district's generator, then the raised roads that cross the chunk (gen/decks.js); land with neither loads as an empty chunk
    const over = generators.decks && generators.decks.touches(rect) ? generators.decks : null;
    job.it = gen && over ? (function* () { yield* gen.build(o, chunk, map, heroes); yield* over.build(o, chunk, map); })() : gen ? gen.build(o, chunk, map, heroes) : over ? over.build(o, chunk, map) : null;
    job.begun = true;
  }
  // one mesh a call, so no single piece of work is long; true when the chunk is in the scene
  function upload(job) {
    const chunk = job.chunk;
    job.at = job.at || 0;
    while (job.at < LETTERS.length) {
      const l = LETTERS[job.at++], b = job.set[l];
      if (!b.count) continue;
      const mesh = new THREE.Mesh(b.build({ free: true, groundUv: l === 'G' ? 7 : 0 }), mats[l]);
      mesh.matrixAutoUpdate = false; mesh.renderOrder = mats.order[l] || 0; mesh.visible = false;
      if (l === 'L') chunk.lit = mesh;
      chunk.tris += b.triangles; chunk.meshes.push(mesh); scene.add(mesh);
      return false;
    }
    for (const m of chunk.meshes) m.visible = m !== chunk.lit || mats.lit;       // the whole chunk appears at once
    for (const m of chunk.objects) scene.add(m);
    job.dec.done();
    sets.push(job.set); stat.pooled = sets.length; job.set = null;
    loaded.set(chunk.key, chunk); building.delete(chunk.key);
    state.world.chunksLoaded = loaded.size; stat.built++;
    events.emit('chunk:loaded', { cx: chunk.cx, cz: chunk.cz, lod: 0 });
    ringAt = 0;                     // the shells round it need another look
    return true;
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
    if (job.begun) { free(job.chunk); if (job.set) sets.push(job.set); }
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
  function dropGroup(g) {
    for (const slot of ['mesh', 'meshW']) if (g[slot]) { scene.remove(g[slot]); g[slot].geometry.dispose(); g[slot] = null; }
  }
  function buildGroup(job) {
    if (!job.begun) { job.begun = true; job.list = members(job.gx, job.gz, quality.get('lod1Radius')); job.i = 0; shellB.reset(); shellW.reset(); }
    if (job.i < job.list.length) {
      const k = job.list[job.i++], cx = k % 64, cz = Math.floor(k / 64), rect = map.chunkRect(cx, cz), gen = generatorFor(rect);
      if (gen && gen.shell) gen.shell({ B: shellB, W: shellW }, { cx, cz, rect }, map, heroes);
      if (generators.decks && generators.decks.touches(rect)) generators.decks.shell({ B: shellB, W: shellW }, { cx, cz, rect }, map);
      return false;
    }
    const gk = job.gx + job.gz * 16, g = groups.get(gk) || { gx: job.gx, gz: job.gz, mesh: null };
    dropGroup(g);
    // one mesh a group; a group that has towers is drawn with the window-wall material (two meshes only where districts meet)
    for (const [b, mat, slot] of [[shellB, mats.B, 'mesh'], [shellW, mats.W, 'meshW']]) {
      if (!b.count) continue;
      g[slot] = new THREE.Mesh(b.build({ free: true }), mat);
      g[slot].matrixAutoUpdate = false; scene.add(g[slot]);
    }
    g.tris = shellB.triangles + shellW.triangles; g.sig = job.list.join(); g.has = new Set(job.list); g.queued = false;
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
      dropGroup(g);
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
    return upload(job);
  }
  function pump(budgetMs) {
    const t0 = now();
    let job;
    while ((job = current || queue.shift())) {
      current = job;
      for (;;) {
        const s0 = now();
        if (s0 - t0 >= budgetMs - 1) return;          // a piece is about 1 ms: stop early so the slice stays inside the budget
        const done = step(job);
        const ms = now() - s0;
        if (ms > stat.maxStepMs) { stat.maxStepMs = ms; stat.maxStepAt = job.lod === 1 ? 'shell group' : !job.it || job.done ? 'upload' : 'build ' + job.cx + ',' + job.cz; }
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
      if (chunks.buildMs > 0.05) { slices[sliceAt++ % slices.length] = chunks.buildMs; stat.slices++; }
      if (mats.lit !== litWas) { litWas = mats.lit; for (const ch of loaded.values()) if (ch.lit) ch.lit.visible = mats.lit; }
      const pc = map.chunkOf(p.x, p.z);
      decor.update(camera, pc.cx, pc.cz);
    },
    stats() {
      let tris = 0, max = 0, n = 0, shell = 0, shellMax = 0, gn = 0;
      for (const ch of loaded.values()) if (ch.tris) { tris += ch.tris; max = Math.max(max, ch.tris); n++; }
      for (const g of groups.values()) if (g.mesh || g.meshW) { shell += g.tris; gn++; shellMax = Math.max(shellMax, g.tris / Math.max(1, g.has.size)); }
      const used = Array.from(slices.subarray(0, Math.min(sliceAt, slices.length))).sort((a, b) => a - b);
      return { buildMsP95: used.length ? used[Math.floor(used.length * 0.95)] : 0, lod0: loaded.size, lod0Built: n, lod0TrisAvg: n ? Math.round(tris / n) : 0, lod0TrisMax: max, groups: gn, shellTris: shell, shellTrisPerChunkMax: Math.round(shellMax),
        pending: chunks.pending, colliders: collide.count, ...stat };
    },
    // drop everything, shells too; the next update builds the rings again from nothing
    resetStats() { sliceAt = 0; stat.slices = 0; stat.buildMsMax = 0; stat.maxStepMs = 0; stat.built = 0; stat.dropped = 0; },
    reset() {
      for (const ch of [...loaded.values()]) drop(ch);
      for (const j of [...building.values()]) cancel(j);
      for (const g of groups.values()) dropGroup(g);
      groups.clear(); queue = []; current = null; ringAt = 0;
    },
  };
  events.on('quality:changed', () => { ringAt = 0; });
  return chunks;
}
