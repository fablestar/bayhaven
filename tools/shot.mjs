// Test helper: opens the built game in a headless browser and saves screenshots to shots/.
// usage: PLAYWRIGHT_BROWSERS_PATH=/studio/.pw node tools/shot.mjs [name] [hour] [w] [h] [driveSeconds] [keys]
import { chromium } from 'playwright';
import { preview } from 'vite';

const [name = 'shot', hour = '14', w = '1280', h = '720', drive = '0', keys = 'ArrowUp', js = ''] = process.argv.slice(2);
const server = await preview({ preview: { port: 4179, strictPort: false }, logLevel: 'silent' });
const url = server.resolvedUrls.local[0];
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
await page.goto(url + '?hour=' + hour);
await page.waitForTimeout(1500);
if (js) { await page.evaluate(js); await page.waitForTimeout(1500); }
if (+drive > 0) {
  for (const k of keys.split('+')) await page.keyboard.down(k);
  await page.waitForTimeout(+drive * 1000);
  for (const k of keys.split('+')) await page.keyboard.up(k);
}
await page.screenshot({ path: `shots/${name}.png` });
const info = await page.evaluate(() => {
  const g = window.__game; if (!g) return null;
  const i = g.renderer.info;
  return { x: g.car.x, z: g.car.z, speed: g.car.speed, calls: i.render.calls, tris: i.render.triangles, worldTris: g.world.triangles };
});
console.log(JSON.stringify(info), errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nno console errors');
await browser.close();
await server.close();
