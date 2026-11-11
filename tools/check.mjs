// The acceptance runner (plan/bible/tech/test-harness.md).
//   npm run check -- --id D2-S2          that session's checks, earlier days' checks, and the standing gates
//   npm run check -- --day 2             every check for days 1 to 2 and the gates
//   --only D2.3,G4     named checks or gates only        --quality low    one quality level (default: low, then high)
//   --fps              real frame rates (needs a GPU)    --shots          a 960 x 540 picture of each failed check
//   --keep             leave the server and browser open on failure
// Builds the game, serves dist/, opens it in headless Chromium, prints one JSON object (also
// written to dist/report.json). Exit code 0 all passed, 1 a check failed, 2 the harness broke.
import { chromium } from 'playwright';
import { preview } from 'vite';
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { FLAGS, GPU_FLAGS, SPOTS, ROUTES, openPage, calibrate, driveRoute, runCheck, sleep } from './check-lib.mjs';
import { TABLE, bundleBudgetKb } from '../src/core/quality.js';

const argv = process.argv.slice(2);
const arg = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };
const flag = (name) => argv.includes(name);
const id = arg('--id'), dayArg = arg('--day') ? +arg('--day') : null;
const only = arg('--only') ? arg('--only').split(',') : null;
const fps = flag('--fps'), keep = flag('--keep'), shots = flag('--shots');
const levels = arg('--quality') ? [arg('--quality')] : ['low', 'high'];
const say = (...a) => console.error(...a);          // progress goes to stderr; stdout is the JSON
if (!id && !dayArg) { say('usage: npm run check -- --id <session-id> | --day <n> [--only ids] [--quality low] [--fps] [--shots] [--keep]'); process.exit(2); }

const wanted = (name) => !only || only.includes(name);
const dayOf = (name) => { const m = name.match(/^d(\d+)/i); return m ? +m[1] : null; };
const started = Date.now();
const gates = { G1: 'skipped', G2: 'skipped', G3: 'skipped', G4: 'skipped', G5: 'skipped', G6: 'skipped', G7: 'skipped', G8: 'skipped' };
const report = { id: id || `day-${dayArg}`, day: 0, mode: fps ? 'fps' : 'budget', k: 1, seconds: 0, pass: false, gates, gateNotes: {}, checks: [], spots: [] };
const failGate = (g, why) => { gates[g] = 'fail'; (report.gateNotes[g] ||= []).push(why); };
function finish(code) {
  report.seconds = Math.round((Date.now() - started) / 1000);
  report.pass = code === 0;
  try { writeFileSync('dist/report.json', JSON.stringify(report, null, 2)); } catch {}
  console.log(JSON.stringify(report, null, 2));
  process.exit(code);
}

// ---- which check files ----
const all = readdirSync('tools/checks').filter((f) => f.endsWith('.mjs') && dayOf(f) !== null).map((f) => ({ file: f, id: f.replace(/\.mjs$/, ''), day: dayOf(f) }))
  .sort((a, b) => a.day - b.day || (a.id.toLowerCase() < b.id.toLowerCase() ? -1 : 1));
const own = id ? all.find((f) => f.id.toLowerCase() === id.toLowerCase()) : null;
if (id && !own) { say(`no check file tools/checks/${id}.mjs`); process.exit(2); }
const day = report.day = id ? own.day : dayArg;
const files = id ? [...all.filter((f) => f.day < day), own] : all.filter((f) => f.day <= day);

// ---- G1 build, G6 size, G5 names ----
const build = spawnSync('npm', ['run', 'build'], { encoding: 'utf8' });
gates.G1 = build.status === 0 ? 'pass' : 'fail';
if (build.status !== 0) { say(build.stdout + build.stderr); report.error = 'the build failed'; finish(2); }
let bytes = 0;
for (const f of readdirSync('dist/assets')) if (f.endsWith('.js')) bytes += gzipSync(readFileSync('dist/assets/' + f)).length;
report.bundleKb = +(bytes / 1000).toFixed(1); report.bundleBudgetKb = bundleBudgetKb(day);
if (wanted('G6')) { gates.G6 = 'pass'; if (report.bundleKb > report.bundleBudgetKb) failGate('G6', `bundle ${report.bundleKb} kB gzipped, budget ${report.bundleBudgetKb} kB`); }
if (wanted('G5')) {
  const lint = spawnSync('node', ['tools/lint-names.mjs'], { encoding: 'utf8' });
  gates.G5 = 'pass';
  if (lint.status !== 0) failGate('G5', lint.stdout.trim().split('\n').slice(0, 8).join(' | '));
}
// lines and files of game source, for the day's record
const walk = (dir) => readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));
const src = walk('src').filter((f) => f.endsWith('.js') && !f.endsWith('core/build.js'));
report.files = src.length; report.lines = src.reduce((n, f) => n + readFileSync(f, 'utf8').split('\n').length, 0);
try { report.commit = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).stdout.trim(); } catch {}

// ---- the browser ----
let server, browser, code = 2;
try {
  server = await preview({ preview: { port: 4181, strictPort: false }, logLevel: 'silent' });
  const baseUrl = server.resolvedUrls.local[0];
  browser = await chromium.launch(fps ? { args: GPU_FLAGS, headless: true, channel: 'chromium' } : { args: FLAGS });
  const env = { browser, baseUrl, shots };

  // ---- the standing gates G2, G3, G4, once per quality level ----
  const gatesWanted = ['G2', 'G3', 'G4'].filter(wanted);
  for (const level of gatesWanted.length ? levels : []) {
    const errors = [];
    const page = await openPage(browser, baseUrl, `&quality=${level}&seed=1`, {}, errors);
    const cal = await calibrate(page);
    const k = fps ? 1 : cal.k;
    report.k = Math.max(report.k, +k.toFixed(2));
    say(`gates on ${level}: k = ${k.toFixed(2)} (calibration ${cal.median.toFixed(1)} ms)`);
    const B = (key) => TABLE[key][['low', 'medium', 'high'].indexOf(level)];
    if (wanted('G3')) {
      if (gates.G3 === 'skipped') gates.G3 = 'pass';
      for (const spot of SPOTS) {
        const s = await page.evaluate(async (sp) => {
          const g = window.__game, m = g.modules.map;
          if (!m || m.districtAt(sp.x, sp.z) === null) return null;
          g.test.teleport(sp.x, sp.z, sp.h);
          await g.test.wait(1.5);
          return g.test.stats();
        }, spot);
        if (!s) { report.spots.push({ name: spot.name, quality: level, skipped: 'not on the map yet' }); continue; }
        report.spots.push({ name: spot.name, quality: level, calls: s.calls, tris: s.tris, simMs: +s.simMs.toFixed(2), chunkMs: +s.chunkMs.toFixed(2), heapMB: Math.round(s.heapMB) });
        if (s.calls > B('maxCalls')) failGate('G3', `${spot.name} ${level}: ${s.calls} draw calls, budget ${B('maxCalls')}`);
        if (s.tris > B('maxTris')) failGate('G3', `${spot.name} ${level}: ${s.tris} triangles, budget ${B('maxTris')}`);
        if (s.simMs > B('maxSimMs') * k) failGate('G3', `${spot.name} ${level}: simMs ${s.simMs.toFixed(2)}, budget ${(B('maxSimMs') * k).toFixed(2)}`);
      }
    }
    if (wanted('G2') || wanted('G4')) {
      let name = 'beach-60', d = await driveRoute(page, name);
      if (!d) { name = 'block-60'; d = await driveRoute(page, name); }
      const all2 = [...errors, ...(d ? d.errors : [])];
      (report.drives ||= []).push({ route: name, quality: level, seconds: +d.seconds.toFixed(1), metres: Math.round(d.metres), chunksCrossed: d.chunksCrossed,
        simMs: +d.simMs.toFixed(2), simP95: +d.simP95.toFixed(2), simMax: +d.simMax.toFixed(2), chunkMsP95: d.chunkMsP95, wallHits: d.crashes, errors: all2.length });
      if (wanted('G2')) {
        if (gates.G2 === 'skipped') gates.G2 = 'pass';
        if (all2.length) failGate('G2', `${level}: ${all2.length} console errors or warnings: ${all2.slice(0, 3).join(' | ')}`);
        if (d.metres < 300) failGate('G2', `${level}: the scripted drive only covered ${Math.round(d.metres)} m in ${d.seconds.toFixed(0)} s`);
        if (d.chunksCrossed < 8) (report.gateNotes.G2 ||= []).push(`${level}: the drive crossed ${d.chunksCrossed} chunks, not 8: the map is one block until streaming ships`);
      }
      if (wanted('G4')) {
        if (gates.G4 === 'skipped') gates.G4 = 'pass';
        if (d.chunkMsP95 > 4 * k) failGate('G4', `${level}: chunkMs p95 ${d.chunkMsP95.toFixed(2)}, budget ${(4 * k).toFixed(2)}`);
        if (d.simMax > 12 * k) failGate('G4', `${level}: a frame's simulation took ${d.simMax.toFixed(2)} ms, limit ${(12 * k).toFixed(2)}`);
      }
    }
    await page.context().close();
  }

  // ---- G8: real frame rates, only with a real GPU ----
  if (fps) {
    const sizes = [{ name: 'laptop', viewport: { width: 1920, height: 1080 }, min: 55, slow: 1 },
      { name: 'phone', viewport: { width: 844, height: 390 }, deviceScaleFactor: 1.5, min: 30, slow: 4 }];
    gates.G8 = 'pass'; report.fps = [];
    for (const size of sizes) {
      const page = await openPage(browser, baseUrl, '&seed=1', { viewport: size.viewport, deviceScaleFactor: size.deviceScaleFactor || 1 }, []);
      const gpu = await page.evaluate(() => { const gl = window.__game.renderer.getContext(), e = gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'unknown'; });
      if (/swiftshader|llvmpipe/i.test(gpu)) { report.error = `--fps needs a real GPU; this browser draws with ${gpu}`; gates.G8 = 'fail'; await page.context().close(); break; }
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: size.slow });
      const route = (await page.evaluate((r) => window.__game.modules.map.districtAt(r.from.x, r.from.z), ROUTES['beach-60'])) ? 'beach-60' : 'block-60';
      const drive = driveRoute(page, route);
      await sleep(5000);
      const times = await page.evaluate(() => new Promise((resolve) => {
        const out = []; let last = performance.now(); const end = last + 20000;
        const tick = (now) => { out.push(now - last); last = now; if (now < end) requestAnimationFrame(tick); else resolve(out); };
        requestAnimationFrame(tick);
      }));
      await drive;
      times.sort((a, b) => a - b);
      const median = 1000 / times[Math.floor(times.length / 2)], p5 = 1000 / times[Math.floor(times.length * 0.95)];
      report.fps.push({ size: size.name, route, median: +median.toFixed(1), p5: +p5.toFixed(1), gpu });
      if (p5 < size.min) failGate('G8', `${size.name}: 5th-percentile frame rate ${p5.toFixed(1)}, wanted ${size.min}`);
      await page.context().close();
    }
  }

  // ---- the check files, in day order ----
  let earlierOk = true, earlier = 0;
  for (const f of files) {
    const checks = (await import(`./checks/${f.file}`)).default;
    for (const check of checks) {
      if (only && !only.includes(check.id)) continue;
      const row = await runCheck(check, env);
      row.file = f.id;
      report.checks.push(row);
      say(`${row.pass ? 'PASS' : 'FAIL'} ${row.id} ${row.name}${row.pass ? '' : ': ' + row.message}`);
      if (f.day < day) { earlier++; if (!row.pass) earlierOk = false; }
    }
  }
  if (earlier && wanted('G7')) { gates.G7 = 'pass'; if (!earlierOk) failGate('G7', 'an earlier day\'s check failed: ' + report.checks.filter((c) => !c.pass).map((c) => c.id).join(', ')); }

  const failed = report.checks.filter((c) => !c.pass).map((c) => c.id).concat(Object.keys(gates).filter((g) => gates[g] === 'fail'));
  report.summary = { passed: report.checks.filter((c) => c.pass).length, failed: failed.length, failedIds: failed };
  code = failed.length ? 1 : 0;
  say(`${report.summary.passed} checks passed, ${failed.length} failed${failed.length ? ': ' + failed.join(', ') : ''}; gates ${Object.entries(gates).map(([g, v]) => g + ' ' + v).join(', ')}`);
} catch (e) {
  report.error = e.message; say(e.stack); code = 2;
} finally {
  if (!(keep && code !== 0)) { if (browser) await browser.close(); if (server) await server.close(); }
}
if (keep && code !== 0) { say('left open: ' + (server ? server.resolvedUrls.local[0] : '')); report.seconds = Math.round((Date.now() - started) / 1000); console.log(JSON.stringify(report, null, 2)); }
else finish(code);
