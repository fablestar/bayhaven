// Opens the built game, runs the async function in the file argv[2] in the page, prints what it returns; argv[3] extra query, argv[4] screenshot path.
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { preview } from 'vite';
import { FLAGS } from './check-lib.mjs';
const server = await preview({ root: '/studio', preview: { port: 4999, strictPort: false }, logLevel: 'silent' });
const url = server.resolvedUrls.local[0];
const browser = await chromium.launch({ args: FLAGS });
const page = await (await browser.newContext({ viewport: { width: 960, height: 540 } })).newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await page.goto(url + '?test=1&hour=14&quality=low&traffic=0&peds=0' + (process.argv[3] || ''));
await page.evaluate(() => window.__game.test.ready);
const out = await page.evaluate(`(${readFileSync(process.argv[2], 'utf8').trim()})()`);
console.log(JSON.stringify(out, null, 1));
if (process.argv[4]) await page.screenshot({ path: process.argv[4] });
await browser.close(); await server.close(); process.exit(0);
