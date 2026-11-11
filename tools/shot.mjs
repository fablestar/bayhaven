// Test helper: opens the built game in a headless browser, saves a screenshot to shots/,
// and prints the day 2 checks D2.1 (Slide) and D2.2 (Props).
// usage: PLAYWRIGHT_BROWSERS_PATH=/studio/.pw node tools/shot.mjs [name] [hour] [w] [h] [driveSeconds] [keys] [js] [query]
//   js runs in the page before the shot (window.__game.test is there); query is added to the URL, like "&clip=day-2"
import { chromium } from 'playwright';
import { preview } from 'vite';
import { FLAGS, runChecks, print } from './check.mjs';
import checks from './checks/D2-S1.mjs';

const [name = 'shot', hour = '14', w = '960', h = '540', drive = '0', keys = 'ArrowUp', js = '', query = ''] = process.argv.slice(2);
const server = await preview({ preview: { port: 4179, strictPort: false }, logLevel: 'silent' });
const url = server.resolvedUrls.local[0];
const browser = await chromium.launch({ args: FLAGS });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
await page.goto(url + '?hour=' + hour + query);
await page.waitForTimeout(1500);
if (js) { await page.evaluate(js); await page.waitForTimeout(700); }
if (+drive > 0) {
  for (const k of keys.split('+')) await page.keyboard.down(k);
  await page.waitForTimeout(+drive * 1000);
  for (const k of keys.split('+')) await page.keyboard.up(k);
}
await page.screenshot({ path: `shots/${name}.png` });
const info = await page.evaluate(() => {
  const g = window.__game; if (!g) return null;
  const i = g.renderer.info;
  return { x: g.car.x, z: g.car.z, kmh: g.car.kmh, calls: i.render.calls, tris: i.render.triangles, worldTris: g.world.triangles, propTris: g.props.triangles };
});
console.log(JSON.stringify(info), errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nno console errors');
print(await runChecks(checks, browser, url, ['D2.1', 'D2.2']));
await browser.close();
await server.close();
