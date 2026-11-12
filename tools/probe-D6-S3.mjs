import { createServer } from 'vite';
const s = await createServer({ root: '/studio', server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', logLevel: 'error', optimizeDeps: { noDiscovery: true } });
try {
  const { createMap } = await s.ssrLoadModule('/src/world/map.js'), { createNav } = await s.ssrLoadModule('/src/world/nav.js');
  const t0 = Date.now(), map = createMap(), nav = createNav(map), D = map.decks, out = {};
  out.ms = Date.now() - t0; out.pieces = map.pieces.length; out.lanes = nav.lanes.length; out.lots = map.lots.length;
  out.d = [map.districtAt(-500, -1700), map.districtAt(200, -2150), map.districtAt(-2000, -2100), map.heightAt(0, -1480, 1), map.heightAt(0, -1480, 0), map.heightAt(765, -1498, 1), map.heightAt(0, -1480)];
  const ex = nav.lanes.filter((l) => l.kind === 'expressway');
  out.ex = { n: ex.length, speed: ex[0] && ex[0].speed, level: ex[0] && ex[0].level, minLen: Math.min(...nav.lanes.map((l) => l.len)), nan: nav.lanes.filter((l) => !(l.len > 0)).map((l) => l.id).slice(0, 5) };
  out.gw = nav.lanes.filter((l) => l.roadId === 'gateway-boulevard' && l.ax > 130 && l.bx < 440).length;
  out.sig = [...map.nodes.values()].filter((n) => n.signal && n.z === -1800).map((n) => n.x);
  const r = nav.route({ x: 700, z: -1560 }, { x: 1100, z: -1474 });
  out.route = r.map((p) => Math.round(p.x) + ',' + Math.round(p.z)).join(' ');
  let level = 0, top = 0; const trace = [];
  for (let i = 0; i < r.length - 1; i++) for (let k = 0; k < 20; k++) { const x = r[i].x + (r[i + 1].x - r[i].x) * k / 20, z = r[i].z + (r[i + 1].z - r[i].z) * k / 20; level = D.step(level, x, z); const y = map.heightAt(x, z, level); top = Math.max(top, y); if (k === 0) trace.push(level + ':' + y.toFixed(1)); }
  out.trace = trace.join(' '); out.endLevel = level; out.top = top;
  const ng = map.lots.filter((l) => l.zone === 'northgate'), by = {};
  for (const l of ng) by[l.recipe] = (by[l.recipe] || 0) + 1;
  out.ng = by; out.ratioMin = Math.min(...ng.filter((l) => l.parkArea).map((l) => l.parkArea / l.bodyArea));
  out.badBody = ng.filter((l) => l.body && (l.body.x0 < l.x0 || l.body.x1 > l.x1 || l.body.z0 < l.z0 || l.body.z1 > l.z1)).map((l) => l.id + ' ' + l.recipe).slice(0, 5);
  out.stubs = map.pieces.filter((p) => p.zone === 'northgate' && p.stub).length; out.ngPieces = map.pieces.filter((p) => p.zone === 'northgate').length;
  out.mg = { lots: map.lots.filter((l) => l.zone === 'mallardgreens').length, pieces: map.pieces.filter((p) => p.zone === 'mallardgreens').length };
  console.log(JSON.stringify(out, null, 1));
} catch (e) { console.log('ERR', e.stack); }
await s.close(); process.exit(0);
