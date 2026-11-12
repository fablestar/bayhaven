// two pictures for the D4-S4 note: the minimap with a route, and the map screen
import { chromium } from 'playwright';
import { openPage, FLAGS } from './check-lib.mjs';
import { preview } from 'vite';
const server = await preview({ preview: { port: 4197, strictPort: false }, logLevel: 'silent' });
const url = server.resolvedUrls.local[0];
const browser = await chromium.launch({ args: FLAGS });
const page = await openPage(browser, url, '&quality=low&seed=1', {}, []);
await page.waitForTimeout(2500);
await page.evaluate(async () => { const T = window.__game.test; T.waypoint(52, -900); await T.wait(1); });
await page.screenshot({ path: 'shots/D4-S4-minimap.png' });
await page.keyboard.press('m'); await page.waitForTimeout(1200);
await page.screenshot({ path: 'shots/D4-S4-map.png' });
console.log(JSON.stringify(await page.evaluate(() => ({ map: window.__game.test.map(), mm: window.__game.test.minimap() }))).slice(0, 900));
await browser.close(); await server.httpServer.close();
