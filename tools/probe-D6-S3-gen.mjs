// Builds every chunk of a district in Node (no browser, no drawing): counts triangles and colliders, finds loops that never end.
// usage: node tools/probe-D6-S3-gen.mjs mallardgreens|northgate
import { createServer } from 'vite';
const noop = new Proxy(function () {}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 10 }) : k === 'canvas' ? { width: 2048, height: 2048 } : noop), apply: () => noop });
globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => noop, style: {} }) };
const s = await createServer({ root: '/studio', server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', logLevel: 'error', optimizeDeps: { noDiscovery: true } });
try {
  const id = process.argv[2] || 'mallardgreens';
  const { createMap } = await s.ssrLoadModule('/src/world/map.js'), { MeshBuilder } = await s.ssrLoadModule('/src/gfx/builder.js');
  const gen = (await s.ssrLoadModule(`/src/world/gen/${id}.js`)).default, over = (await s.ssrLoadModule('/src/world/gen/decks.js')).default, heroes = {};
  for (const h of ['hospital', 'sheriff-hq', 'galleria', 'starlite', 'clubhouse', 'model-home']) heroes[h] = (await s.ssrLoadModule(`/src/world/landmarks/${h}.js`)).default;
  const { rng } = await s.ssrLoadModule('/src/core/rng.js');
  const map = createMap(), zn = map.zone(id), a = map.chunkOf(zn.bounds.x0 + 1, zn.bounds.z0 + 1), b = map.chunkOf(zn.bounds.x1 - 1, zn.bounds.z1 - 1);
  let max = 0, maxAt = '', total = 0, n = 0, solids = 0, props = 0, shellMax = 0, slow = 0, slowAt = '';
  for (const low of [true, false]) {
    max = 0; total = 0; n = 0; solids = 0; props = 0;
    for (let cx = a.cx; cx <= b.cx; cx++) for (let cz = a.cz; cz <= b.cz; cz++) {
      const o = { rnd: rng(1), low, solid() { solids++; }, obb() { solids++; }, prop() { props++; return {}; }, decor() {}, object() {} };
      for (const l of 'GMBNL') o[l] = new MeshBuilder({ size: 4096 }); o.S = new MeshBuilder({ uv: true, size: 256 }); o.W = new MeshBuilder({ uv: true, size: 256 });
      const chunk = { cx, cz, rect: map.chunkRect(cx, cz), seed: map.chunkSeed(cx, cz) }, t0 = Date.now();
      let steps = 0; for (const _ of gen.build(o, chunk, map, heroes)) if (++steps > 5000) throw new Error('never ends at ' + cx + ',' + cz);
      if (over.touches(chunk.rect)) for (const _ of over.build(o, chunk, map)) steps++;
      const ms = Date.now() - t0; if (ms > slow) { slow = ms; slowAt = cx + ',' + cz; }
      const tris = 'GMBNLSW'.split('').reduce((t, l) => t + o[l].triangles, 0) + (o.U ? o.U.triangles : 0);
      total += tris; n++; if (tris > max) { max = tris; maxAt = cx + ',' + cz + ' ' + JSON.stringify(chunk.rect); }
      if (low) { const sh = { B: new MeshBuilder({ size: 4096 }), W: new MeshBuilder({ uv: true, size: 256 }) }; gen.shell(sh, chunk, map, heroes); if (over.touches(chunk.rect)) over.shell(sh, chunk, map); shellMax = Math.max(shellMax, sh.B.triangles + sh.W.triangles); }
    }
    console.log(JSON.stringify({ id, low, chunks: n, trisMax: max, maxAt, trisAvg: Math.round(total / n), solids, props, shellMax, slowestMs: slow, slowAt, stats: gen.stats }));
  }
} catch (e) { console.log('ERR', e.stack.split('\n').slice(0, 6).join('\n')); }
await s.close(); process.exit(0);
