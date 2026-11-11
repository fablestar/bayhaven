// STAND-IN check runner until session D2-S2 ships the real one (plan/bible/tech/test-harness.md).
// usage: npm run check -- --id D2-S1 [--only D2.1,D2.2]
// Opens the built game in headless Chromium and runs tools/checks/<id>.mjs.
import { chromium } from 'playwright';
import { preview } from 'vite';

export const FLAGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
  '--autoplay-policy=no-user-gesture-required', '--mute-audio'];

// Run a list of checks against a preview server. Returns [{ id, name, pass, notes, error }].
export async function runChecks(checks, browser, baseUrl, only) {
  const results = [];
  for (const check of checks) {
    if (only && !only.includes(check.id)) continue;
    const notes = [], fails = [], errors = [], pages = [];
    const open = async (query = '', opts = {}) => {
      const ctx = await browser.newContext({ viewport: { width: 960, height: 540 }, ...opts });
      const page = await ctx.newPage();
      page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
      page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
      await page.goto(baseUrl + '?test=1&hour=14' + query);
      await page.evaluate(() => window.__game.test.ready);
      pages.push(ctx);
      return page;
    };
    const t = {
      open, errors,
      note: (text) => notes.push(text),
      expect(value, op, target, label) {
        const ok = op === '>=' ? value >= target : op === '>' ? value > target : op === '<=' ? value <= target : op === '<' ? value < target
          : op === 'in' ? value >= target[0] && value <= target[1] : value === target;
        const shown = typeof value === 'number' ? +value.toFixed(3) : JSON.stringify(value);
        notes.push(`${ok ? 'ok  ' : 'FAIL'} ${label}: ${shown} ${op} ${JSON.stringify(target)}`);
        if (!ok) fails.push(label);
      },
    };
    let error = null;
    try { await check.run(t); } catch (e) { error = e.message; }
    if (errors.length) fails.push('console errors: ' + errors.slice(0, 3).join(' | '));
    for (const ctx of pages) await ctx.close();
    results.push({ id: check.id, name: check.name, pass: !error && !fails.length, notes, error, fails });
  }
  return results;
}

export function print(results) {
  for (const r of results) {
    console.log(`${r.pass ? 'PASS' : 'FAIL'} ${r.id} ${r.name}`);
    for (const n of r.notes) console.log('     ' + n);
    if (r.error) console.log('     ERROR ' + r.error);
    for (const f of r.fails) if (f.startsWith('console')) console.log('     ' + f);
  }
  const failed = results.filter((r) => !r.pass).length;
  console.log(`${results.length - failed} of ${results.length} checks passed`);
  return failed;
}

if (process.argv[1].endsWith('check.mjs')) {
  const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
  const id = arg('--id');
  if (!id) { console.error('usage: npm run check -- --id <session-id>'); process.exit(2); }
  const only = arg('--only') ? arg('--only').split(',') : null;
  const checks = (await import(`./checks/${id}.mjs`)).default;
  const server = await preview({ preview: { port: 4181, strictPort: false }, logLevel: 'silent' });
  const browser = await chromium.launch({ args: FLAGS });
  let failed = 1;
  try { failed = print(await runChecks(checks, browser, server.resolvedUrls.local[0], only)); }
  finally { await browser.close(); await server.close(); }
  process.exit(failed ? 1 : 0);
}
