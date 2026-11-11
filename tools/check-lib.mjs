// Helpers for tools/check.mjs: browser flags, the `t` object a check is handed, the standing
// gates' spots and routes, and the calibration that makes millisecond budgets fair on a slow machine.
// See plan/bible/tech/test-harness.md.
import { mkdirSync } from 'node:fs';

export const FLAGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
  '--autoplay-policy=no-user-gesture-required', '--mute-audio'];
export const GPU_FLAGS = ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--autoplay-policy=no-user-gesture-required'];

// fixed places, so numbers can be compared from day to day; a spot off today's map is skipped
export const SPOTS = [
  { name: 'beach', x: 0, z: 37, h: Math.PI / 2 },
  { name: 'downtown', x: 52, z: -700, h: Math.PI },
  { name: 'port', x: 2800, z: -400, h: Math.PI / 2 },
  { name: 'expressway', x: 700, z: -1480, h: -Math.PI / 2 },
  { name: 'swamp', x: -400, z: -3000, h: -Math.PI / 2 },
];
// routes for the route follower: a start pose and the stops to drive through
export const ROUTES = {
  // 60 s round the day 1 block, the wrong way round the clock: every street the map has today
  'block-60': { from: { x: -24, z: 40.5, h: Math.PI / 2 }, seconds: 60, loops: 3,
    stops: [{ x: 52, z: 37 }, { x: 52, z: -37 }, { x: -52, z: -37 }, { x: -52, z: 37 }] },
  // 60 s east along Heron Walk Drive (needs the streamed beachfront: session D2-S3)
  'beach-60': { from: { x: -1400, z: 40.5, h: Math.PI / 2 }, seconds: 60, loops: 1, stops: [{ x: 1500, z: 37 }] },
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OPS = {
  '>=': (v, b) => v >= b, '<=': (v, b) => v <= b, '>': (v, b) => v > b, '<': (v, b) => v < b, '==': (v, b) => v === b,
  between: (v, b) => v >= b[0] && v <= b[1], in: (v, b) => v >= b[0] && v <= b[1],
};
const show = (v) => (typeof v === 'number' ? +v.toFixed(3) : JSON.stringify(v));

// Open the game in a fresh browser context and wait for its first frame. Console errors and
// warnings land in `errors`.
export async function openPage(browser, baseUrl, query, opts, errors) {
  const context = await browser.newContext({ viewport: { width: 960, height: 540 }, ...opts });
  const page = await context.newPage();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
  // the hour is 14 unless the query names one (the first of two would win)
  await page.goto(baseUrl + '?test=1' + (/[&?]hour=/.test(query) ? '' : '&hour=14') + query);
  await Promise.race([
    page.evaluate(() => window.__game.test.ready),
    sleep(30000).then(() => { throw new Error('the page was not ready after 30 s'); }),
  ]);
  return page;
}

// The median time of a fixed piece of work in the page, against the 5.0 ms it takes on the
// reference laptop. Millisecond budgets are multiplied by k = max(1, median / 5) in budget mode.
export async function calibrate(page) {
  const median = await page.evaluate(() => {
    const a = new Float64Array(1 << 16), runs = [];
    for (let r = 0; r < 20; r++) {
      const t0 = performance.now();
      for (let p = 0; p < 64; p++) for (let i = 0; i < a.length; i++) a[i] = a[i] * 0.999 + i;
      runs.push(performance.now() - t0);
    }
    return runs.sort((x, y) => x - y)[10];
  });
  // The same work again, inside 60 real frames, keeping the slowest run. With no graphics card the
  // drawing threads take the processor away from the page now and then; this measures how badly,
  // so the limit on a single frame (gate G4) is stretched by what the machine does, not the game.
  const worst = await page.evaluate(() => new Promise((resolve) => {
    const a = new Float64Array(1 << 16); let n = 0, max = 0;
    const tick = () => {
      const t0 = performance.now();
      for (let p = 0; p < 64; p++) for (let i = 0; i < a.length; i++) a[i] = a[i] * 0.999 + i;
      max = Math.max(max, performance.now() - t0);
      if (++n < 60) requestAnimationFrame(tick); else resolve(max);
    };
    requestAnimationFrame(tick);
  }));
  return { median, worst, k: Math.max(1, median / 5), kHitch: Math.max(1, median / 5, worst / 5) };
}

// Drive a named route with the route follower, sampling the numbers the gates need.
export async function driveRoute(page, name) {
  const route = ROUTES[name];
  const exists = await page.evaluate((r) => { const m = window.__game.modules.map; return !!m && m.districtAt(r.from.x, r.from.z) !== null; }, route);
  if (!exists) return null;
  return page.evaluate(async (r) => {
    const T = window.__game.test, map = window.__game.modules.map;
    T.teleport(r.from.x, r.from.z, r.from.h);
    await T.wait(0.2);
    T.resetStats();
    const chunkMs = [], chunks = new Set();
    const timer = setInterval(() => {
      const s = T.stats(), p = T.player(), c = map.chunkOf(p.x, p.z);
      chunkMs.push(s.chunkMs); chunks.add(c.cx + ',' + c.cz);
    }, 250);
    const t0 = performance.now();
    const done = await T.drive(r.stops, { seconds: r.seconds, loops: r.loops });
    clearInterval(timer);
    chunkMs.sort((a, b) => a - b);
    const s = T.stats();
    return { ...done, wallSeconds: (performance.now() - t0) / 1000, chunksCrossed: chunks.size, chunkMsP95: chunkMs[Math.floor(chunkMs.length * 0.95)] || 0,
      simMax: s.simMax, simMs: s.simMs, simP95: s.simP95, crashes: T.count('vehicle:crash'), errors: T.errors() };
  }, route);
}

// The `t` a check's run(t) is handed. Helpers work on t.page, opened on first use with the
// check's quality; t.open(query, opts) opens another page (a phone, another build day).
export function makeT({ browser, baseUrl, quality, shots }) {
  const notes = [], fails = [], errors = [], values = {}, contexts = [];
  let page = null;
  const open = async (query = '', opts = {}) => {
    const p = await openPage(browser, baseUrl, query, opts, errors);
    contexts.push(p.context());
    return p;
  };
  const get = async () => page || (page = await open(quality ? '&quality=' + quality : ''));
  const ev = async (fn, arg) => (await get()).evaluate(fn, arg);
  const t = {
    notes, fails, errors, values, quality, open,
    page: get,
    note: (text) => notes.push(text),
    expect(value, op, bound, label) {
      const ok = OPS[op](value, bound);
      notes.push(`${ok ? 'ok  ' : 'FAIL'} ${label}: ${show(value)} ${op} ${JSON.stringify(bound)}`);
      values[label] = typeof value === 'number' ? +value.toFixed(3) : value;
      if (!ok) fails.push(`${label}: got ${show(value)}, wanted ${op} ${JSON.stringify(bound)}`);
      return ok;
    },
    eval: ev,
    stats: () => ev(() => window.__game.test.stats()),
    player: () => ev(() => window.__game.test.player()),
    gameErrors: () => ev(() => window.__game.test.errors()),
    teleport: (x, z, h) => ev(([a, b, c]) => window.__game.test.teleport(a, b, c), [x, z, h]),
    // only the Heron exists so far, so spawn puts the player's car at the place
    spawn: (model, at) => ev((a) => { const T = window.__game.test; return T.spawnVehicle ? T.spawnVehicle(a.model, a) : T.teleport(a.x, a.z, a.heading); }, { model, ...at }),
    input: (script) => ev((s) => window.__game.test.input(s), script),
    advance: (seconds) => ev((s) => window.__game.test.advance(s), seconds),
    setHour: (h) => ev((v) => window.__game.test.setHour(v), h),
    setQuality: (q) => ev((v) => window.__game.test.setQuality(v), q),
    drive: async (name) => driveRoute(await get(), name),
    async until(fn, seconds, label) {
      const end = Date.now() + seconds * 1000;
      for (;;) {
        const v = await ev(fn);
        if (v) return v;
        if (Date.now() > end) throw new Error(`timed out after ${seconds} s waiting for: ${label}`);
        await sleep(100);
      }
    },
    async series(fn, seconds, hz = 10) {
      const out = [], end = Date.now() + seconds * 1000;
      while (Date.now() < end) { out.push(await ev(fn)); await sleep(1000 / hz); }
      return out;
    },
    async peak(fn, seconds) { return Math.max(...(await t.series(fn, seconds, 20))); },
    event: (name, seconds = 10) => ev(([n, s]) => new Promise((resolve, reject) => {
      const off = window.__game.events.once(n, (d) => { clearTimeout(timer); resolve(JSON.parse(JSON.stringify(d ?? null))); });
      const timer = setTimeout(() => { off(); reject(new Error(`no ${n} event within ${s} s`)); }, s * 1000);
    }), [name, seconds]),
    frames: (n = 2) => ev((count) => new Promise((resolve) => { const step = () => (--count <= 0 ? resolve() : requestAnimationFrame(step)); requestAnimationFrame(step); }), n),
    async shot(name) { mkdirSync('shots', { recursive: true }); await (await get()).screenshot({ path: `shots/${name}.png` }); return `shots/${name}.png`; },
    rects: () => ev(() => { const h = window.__game.modules.hud; return h && h.layout ? h.layout() : []; }),
    async fresh() {
      const p = await get();
      await p.evaluate(() => localStorage.clear());
      await p.reload();
      await p.evaluate(() => window.__game.test.ready);
    },
    async close() { for (const c of contexts) await c.close(); },
    shots,
  };
  return t;
}

// Run one check (once per quality it names). Returns the report row.
export async function runCheck(check, env) {
  const rows = [];
  for (const quality of check.quality || [null]) {
    const t = makeT({ ...env, quality });
    let error = null, shot;
    try { await check.run(t); } catch (e) { error = e.message.split('\n')[0]; }
    if (t.errors.length) t.fails.push('console: ' + t.errors.slice(0, 3).join(' | '));
    const pass = !error && !t.fails.length;
    if (!pass && env.shots) { try { shot = await t.shot(check.id + (quality ? '-' + quality : '')); } catch {} }
    await t.close();
    rows.push({ id: check.id, name: check.name, quality: quality || undefined, pass, values: t.values,
      message: pass ? undefined : [error, ...t.fails].filter(Boolean).join('; '), shot, notes: t.notes });
  }
  if (rows.length === 1) return rows[0];
  return { id: check.id, name: check.name, pass: rows.every((r) => r.pass), values: Object.fromEntries(rows.map((r) => [r.quality, r.values])),
    message: rows.filter((r) => !r.pass).map((r) => `${r.quality}: ${r.message}`).join('; ') || undefined, notes: rows.flatMap((r) => r.notes.map((n) => `[${r.quality}] ${n}`)) };
}
