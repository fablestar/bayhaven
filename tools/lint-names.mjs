// The name check (gate G5). Searches the game's own source for strings the game must never
// contain: plan/BANNED.txt, one regular expression per line, matched without regard to case.
// "#" starts a comment; "allow: <regex> -- <reason>" exempts matches of a narrower pattern.
// Scans src/**/*.{js,css,html} and index.html (not dist/, not plan/). Exits 1 on any hit.
// usage: node tools/lint-names.mjs [--report]
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const patterns = [], allows = [];
for (const raw of readFileSync('plan/BANNED.txt', 'utf8').split('\n')) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  try {
    if (/^allow:/i.test(line)) allows.push(new RegExp(line.replace(/^allow:\s*/i, '').split(' -- ')[0].trim(), 'gi'));
    else patterns.push({ source: line, re: new RegExp(line, 'gi') });
  } catch (e) { console.error(`plan/BANNED.txt: bad pattern "${line}": ${e.message}`); process.exit(2); }
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(js|css|html)$/.test(name)) out.push(path);
  }
  return out;
}
const files = walk('src');
if (existsSync('index.html')) files.push('index.html');

if (process.argv.includes('--report')) {
  // how much text each folder can show, so a person can skim it
  const byFolder = {};
  for (const file of files) {
    const n = (readFileSync(file, 'utf8').match(/(['"`])(?:(?!\1)[^\\\n]|\\.){4,}\1/g) || []).length;
    const folder = file.split('/').slice(0, -1).join('/') || '.';
    byFolder[folder] = (byFolder[folder] || 0) + n;
  }
  console.log(JSON.stringify(byFolder, null, 2));
}

let hits = 0;
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((text, i) => {
    // spans of this line an allow pattern covers
    const ok = [];
    for (const a of allows) { a.lastIndex = 0; for (let m; (m = a.exec(text)); ) { ok.push([m.index, m.index + m[0].length]); if (!m[0]) a.lastIndex++; } }
    for (const p of patterns) {
      p.re.lastIndex = 0;
      for (let m; (m = p.re.exec(text)); ) {
        if (!m[0]) { p.re.lastIndex++; continue; }
        if (ok.some(([a, b]) => m.index >= a && m.index + m[0].length <= b)) continue;
        console.log(`${file}:${i + 1}: ${p.source}: ${m[0]}`);
        hits++;
      }
    }
  });
}
console.log(hits ? `${hits} banned strings found` : `name check passed: ${files.length} files, ${patterns.length} patterns, 0 hits`);
process.exit(hits ? 1 : 0);
