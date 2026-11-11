// Builds CHANGELOG.md from the notes in changelog/, and writes src/core/build.js with the build
// day. Runs before every build. A note is named after its session (D4-S2.md is day 4); the build
// day is the highest day number found, so the day badge and the daily drop follow the newest note.
// usage: node tools/changelog.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const notes = readdirSync('changelog').filter((f) => /^d\d+(-s\d+)?.*\.md$/i.test(f)).map((file) => {
  const m = file.match(/^d(\d+)(?:-s(\d+))?/i);
  const text = readFileSync('changelog/' + file, 'utf8');
  return { file, id: file.replace(/\.md$/, ''), day: +m[1], session: m[2] ? +m[2] : 0, text,
    title: (text.match(/^#\s+(.*)$/m) || [, file])[1] };
}).sort((a, b) => b.day - a.day || a.session - b.session);

// the lines under a heading or label such as "## What shipped" or "Shipped:", up to the next one
function part(text, re) {
  const lines = text.split('\n'), out = [];
  let on = false;
  for (const line of lines) {
    const head = /^(#{1,6}\s|[A-Z][A-Za-z ,]*:\s*$|(Shipped|Not shipped|Rough edges|Numbers|Stand-ins|For integration):)/.test(line);
    if (head) { on = re.test(line); if (on && /:\s*\S/.test(line) && !line.startsWith('#')) out.push(line.replace(/^[^:]*:\s*/, '')); continue; }
    if (on) out.push(line);
  }
  return out.join('\n').trim();
}

const day = notes.length ? notes[0].day : 1;
let md = '# Changelog\n\nBuilt from the notes in `changelog/` by `tools/changelog.mjs`. Newest day first.\n';
for (const d of [...new Set(notes.map((n) => n.day))]) {
  const list = notes.filter((n) => n.day === d);
  const headline = list[0].title.replace(/^D\d+(-S\d+)?\s*[·:.-]?\s*/i, '');
  md += `\n## Day ${d}: ${headline}\n`;
  for (const n of list) {
    md += `\n### ${n.title}\n`;
    const shipped = part(n.text, /^(#+\s*)?(What )?shipped/i), not = part(n.text, /^(#+\s*)?(What did not ship|Not shipped)/i);
    if (shipped) md += `\n**Shipped**\n\n${shipped}\n`;
    if (not) md += `\n**Not shipped**\n\n${not}\n`;
  }
}
writeFileSync('CHANGELOG.md', md);

let commit = 'dev';
try { commit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch {}
writeFileSync('src/core/build.js', `// Written by tools/changelog.mjs before every build. Do not edit; not kept in git.
export const BUILD = ${JSON.stringify({ day, commit, sessions: notes.map((n) => n.id).reverse() })};
`);
console.log(`changelog: ${notes.length} notes, build day ${day}, commit ${commit}`);
