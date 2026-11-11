// The 16-step sequencer. A song is a tempo, a key and scale, a chord loop and a few pattern
// strings (plan/bible/tech/schemas.md, "Radio station and song"); the form says which section
// plays for how many bars. Notes are scheduled 0.12 s ahead on the audio clock every 25 ms
// (plan/bible/tech/algorithms.md section 9), never by the frame loop.
//   music.play(song, station, { at, hold })   start at an audio time; hold loops the intro for talk
//   music.release()    stop holding      music.stop()      music.onEnd = (time) => ...
//   music.beat         beats since the song began, as a fraction (lights pulse off this)
//   music.pulse        1 on each kick, fading to 0 in about a third of a second
//   compile(song)      the parsed song: bars, seconds and the melodies made from its seed
// Pattern strings: drums `x` hit, `X` accent, `o` open hat (a ghost on other lines), `r` two hits
// in a step, `.` rest. Notes: a scale degree 1 to 8 with `b` or `#` in front, `^` or `_` or `,`
// behind (an octave up or down), `~` in front to slide, `-` hold, `.` rest. Bass degrees count
// from the chord that is playing; lead degrees from the song's key, one entry per eighth note.

const AHEAD = 0.12, TICK = 25;
export const SCALES = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10], phrygian: [0, 1, 3, 5, 7, 8, 10] };
const PC = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const MAJOR = SCALES.major;
// which lines sound in which section; `perc` is every extra line without a rule of its own
const ARR = {
  intro: 'kick hat pad arp perc', verse: 'kick snare hat bass pad arp lead perc', chorus: 'kick snare hat bass pad arp lead perc',
  drop: 'kick snare hat bass pad arp lead perc', montuno: 'kick snare hat bass pad lead perc', brass: 'kick snare hat bass pad perc',
  break: 'hat pad arp lead', build: 'kick snare hat pad lead', out: 'kick hat bass pad perc',
};
// a line plays the patch of its own name unless the station or the song says otherwise
const DEFAULTS = { openhat: ['open-hat'], bass: ['saw-bass'], arp: ['pluck'], stab: ['brass'], fog: ['foghorn'], sub: ['sub-drop'], double: ['marimba'] };
const BIG = { chorus: 1, drop: 1, montuno: 1 };
const CORE = ['kick', 'snare', 'hat', 'bass', 'lead', 'pad', 'arp'];
const EXTRA = ['clap', 'tom', 'clave', 'bell', 'conga', 'stab', 'fog', 'sub'];

function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export function chord(name) {
  const m = /^([A-G][#b]?)(.*)$/.exec(name), q = m[2];
  const minor = /^m(?!aj)/.test(q);
  const seventh = /maj7/.test(q) ? 11 : /6/.test(q) ? 9 : /7|9|13/.test(q) ? 10 : 12;
  return { name, root: PC[m[1]], third: minor ? 3 : 4, fifth: 7, seventh };
}
export function parse(str) {
  return (str.replace(/[\s|]/g, '').match(/~?[b#]?[1-8][\^_,]?|-|\./g) || []).map((s) => {
    if (s === '-' || s === '.') return { k: s };
    const m = /^(~?)([b#]?)([1-8])([\^_,]?)$/.exec(s);
    return { k: 'n', slide: !!m[1], acc: m[2] === 'b' ? -1 : m[2] === '#' ? 1 : 0, deg: +m[3], oct: m[4] === '^' ? 1 : m[4] ? -1 : 0 };
  });
}
const text = (toks) => toks.map((t) => (t.k === 'n' ? (t.acc < 0 ? 'b' : t.acc > 0 ? '#' : '') + t.deg + (t.oct > 0 ? '^' : t.oct < 0 ? '_' : '') : t.k)).join('');

// A second melody from the song's seed: it keeps most of the hook's rhythm and walks the scale,
// landing on 1, 3 or 5. A one-note song keeps its one note and only the rhythm moves.
function generate(hook, rnd, oneNote, montuno) {
  const first = hook.find((t) => t.k === 'n') || { deg: 1 };
  const tones = montuno ? [1, 3, 5, 8] : [1, 3, 5, 8];
  let deg = first.deg, last = -1;
  const out = hook.map((h, i) => {
    const play = h.k === 'n' ? rnd() < 0.82 : h.k === '.' ? rnd() < 0.22 : false;
    if (!play) return { k: h.k === '-' && last === i - 1 ? '-' : '.' };
    if (oneNote) deg = rnd() < 0.85 ? first.deg : h.deg || first.deg;
    else if (montuno) deg = tones[Math.floor(rnd() * 4)];
    else {
      deg = Math.max(1, Math.min(8, deg + [-2, -1, -1, 1, 1, 2, 0][Math.floor(rnd() * 7)]));
      if (i % 4 === 0) deg = tones.reduce((a, b) => (Math.abs(b - deg) < Math.abs(a - deg) ? b : a));
    }
    last = i;
    return { k: 'n', slide: false, acc: 0, deg, oct: 0 };
  });
  if (!oneNote && last >= 0) out[last].deg = [1, 3, 5][Math.floor(rnd() * 3)];
  return out;
}

// parse a song once; the result is kept on the song, so the melody is fixed from then on
export function compile(song) {
  if (song._c) return song._c;
  const div = song.div || 4, spb = div * 4, rnd = rng(song.seed || 1);
  const c = { div, spb, stepLen: 60 / song.bpm / div, key: PC[song.key], scale: SCALES[song.scale] || MAJOR, chords: song.chords.map(chord), drums: {}, when: song.when || {} };
  for (const k of ['kick', 'snare', 'hat', ...EXTRA]) if (song[k]) c.drums[k] = song[k].replace(/\s/g, '');
  c.bass = song.bass ? parse(song.bass) : null;
  c.hook = song.lead ? parse(song.lead) : null;
  if (c.hook) {
    c.answer = generate(c.hook, rnd, !!song.oneNote, !!song.montuno);
    c.fill = generate(c.hook, rnd, !!song.oneNote, !!song.montuno);
    c.melody = { hook: text(c.hook), answer: text(c.answer), fill: text(c.fill) };
  }
  c.sections = []; let bar = 0;
  for (const [name, bars] of song.form) { c.sections.push({ name, from: bar, bars, lines: (ARR[name] || ARR.verse).split(' ') }); bar += bars; }
  c.bars = bar; c.steps = bar * spb; c.seconds = c.steps * c.stepLen;
  c.patterns = Object.keys(c.drums).length + (c.bass ? 1 : 0) + (c.hook ? 3 : 0) + (song.pad && song.pad !== 'none' ? 1 : 0) + (song.arp ? 1 : 0);
  return (song._c = c);
}

export function createMusic(ac, synth) {
  const music = { song: null, station: null, playing: false, onEnd: null, section: '', bar: 0, steps: 0, late: 0, ahead: AHEAD, hold: false };
  let c = null, kit = {}, pos = 0, nextT = 0, t0 = 0, beatLen = 0.5, toms = 0, arpN = 0;
  const kicks = [];

  const patch = (line) => kit[line] || DEFAULTS[line] || [line];
  const scaled = (v, opts) => (opts && opts.gain ? v * Math.pow(10, opts.gain / 30) : v);     // gain goes as velocity to the 1.5
  function hit(line, v, t, more) {
    const [name, opts] = patch(line);
    synth.play(name, { ...opts, ...more, v: scaled(v, opts) }, t);
  }
  // does an extra line play in this bar? its rule: section names, `last8`, `first:<section>`
  function allowed(line, sec, bar) {
    const rule = c.when[line];
    if (!rule) return sec.lines.includes('perc');
    return rule.split(' ').some((r) => (r === 'last8' ? bar % 8 === 7 : r.startsWith('first:') ? sec.name === r.slice(6) && bar === sec.from : r === sec.name));
  }
  const holds = (toks, i) => { let n = 1; while (n < toks.length && toks[(i + n) % toks.length].k === '-') n++; return n; };

  function step(s, t) {
    const song = music.song, spb = c.spb, bar = Math.floor(s / spb), inBar = s % spb, L = c.stepLen;
    const sec = c.sections.find((x) => bar < x.from + x.bars) || c.sections[c.sections.length - 1];
    const has = (line) => sec.lines.includes(line);
    const ch = c.chords[Math.floor(bar / (song.bars || 1)) % c.chords.length];
    if (inBar === 0) { music.bar = bar; music.section = sec.name; toms = 0; }

    // drums and the extra lines
    for (const line in c.drums) {
      const pat = c.drums[line], x = pat[s % pat.length];
      if (x === '.' || !(CORE.includes(line) ? has(line) : allowed(line, sec, bar))) continue;
      const v = x === 'X' ? 127 : x === 'o' ? 70 : 100;
      if (line === 'kick') {
        hit('kick', v, t); kicks.push(t);
        const d = music.station.duck; if (d) for (const g in d) synth.duck(g, d[g][0], d[g][1], t);
      } else if (line === 'hat') {
        if (x === 'o') hit('openhat', 100, t);
        else if (x === 'r') { hit('hat', 60, t); hit('hat', 110, t + L / 2); }
        else hit('hat', v, t, { long: pat[(s + 1) % pat.length] === '.' });
      } else if (line === 'tom') hit('tom', v, t, { f0: [180, 150, 120][toms++ % 3] });
      else if (line === 'conga') hit('conga', v, t, { slap: pat[(s + 1) % pat.length] !== '.' });
      else if (line === 'stab') hit('stab', v, t, { notes: [0, ch.third, 7].map((i) => 60 + ch.root + i), d: L * 0.9 });
      else if (line === 'sub') hit('sub', v, t, { d: L * spb });
      else hit(line, v, t);
    }
    // a riser over the last two bars of every build
    if (sec.name === 'build' && inBar === 0 && bar === sec.from + sec.bars - 2) hit('riser', 100, t, { d: L * spb * 2 });

    if (c.bass && has('bass')) {
      const i = s % c.bass.length, tok = c.bass[i];
      if (tok.k === 'n') {
        const at = s + (song.bassAhead || 0), cb = song.bassAhead ? c.chords[Math.floor(Math.floor(at / spb) / (song.bars || 1)) % c.chords.length] : ch;
        const semis = (tok.deg === 3 ? cb.third : tok.deg === 8 ? 12 : MAJOR[tok.deg - 1]) + tok.acc + 12 * tok.oct;
        hit('bass', 105, t, { n: 36 + cb.root + semis, d: holds(c.bass, i) * L * 0.9, slide: tok.slide });
      }
    }
    // the lead: one entry per eighth note, over two bars
    const per = c.div === 4 ? 2 : 1;
    if (c.hook && has('lead') && inBar % per === 0) {
      const sb = bar - sec.from, phrase = Math.floor(sb / 2);
      const line = BIG[sec.name] ? (phrase % 2 ? c.answer : c.hook) : sec.name === 'verse' && phrase % 4 === 3 ? c.fill : c.hook;
      const i = ((sb % 2) * 8 + inBar / per) % line.length, tok = line[i];
      if (tok.k === 'n') {
        const d = holds(line, i) * L * per * 0.8, [name] = patch('lead');
        let n;
        if (song.montuno) { const r = ch.root > 6 ? 48 + ch.root : 60 + ch.root; n = r + (tok.deg === 3 ? ch.third : tok.deg === 5 ? 7 : tok.deg === 8 ? 12 : MAJOR[tok.deg - 1]) + tok.acc + 12 * tok.oct; }
        else { const idx = tok.deg - 1; n = (c.key > 6 ? 48 : 60) + c.key + c.scale[idx % 7] + 12 * Math.floor(idx / 7) + tok.acc + 12 * tok.oct; }
        if (name === 'piano') hit('lead', 100, t, { notes: [n, n + 12], d, pan: -0.2 });
        else hit('lead', 100, t, { n, d });
        if (song.double && BIG[sec.name]) hit('double', 90, t, { n: n + 12, d });
      }
    }
    // the chord: a pad for the bar (or half of it), gated where the song says so
    const mode = song.pad || 'none';
    if (mode !== 'none' && has('pad')) {
      const notes = [0, ch.third, 7, ch.seventh].map((i) => 48 + ch.root + i), [name] = patch('pad');
      if (name !== 'pad') {            // a struck chord: marimba or piano on beat 1 (or beats 2 and 4)
        const on = mode === 'stab24' ? inBar === spb / 4 || inBar === spb * 3 / 4 : inBar === 0;
        if (on) notes.forEach((n, i) => hit('pad', 85, t + i * 0.018, { n: n + 12, d: L * 3 }));
      } else {
        const span = song.padHalf ? spb / 2 : spb;
        if (inBar % span === 0) {
          const gate = mode === 'gate8' ? { pattern: 'x.', step: beatLen / 4 } : mode === 'gate16' ? { pattern: 'x.', step: beatLen / 8 }
            : mode === 'whole' ? null : { pattern: mode, step: L };
          hit('pad', 100, t, { notes, d: span * L * 0.97, gate });
        }
      }
    }
    // the arp: chord tones on every sixteenth, left then right
    if (song.arp && has('arp')) {
      const d = +song.arp[inBar % song.arp.length], semis = d === 3 ? ch.third : d === 5 ? 7 : d === 8 ? 12 : 0;
      hit('arp', 80, t, { n: 60 + ch.root + semis, pan: arpN++ % 2 ? 0.3 : -0.3, echo: L * 3 });
    }
  }

  // The timer can run late (a slow frame, a chunk being built). The window then grows to about
  // three times the gap, up to 1.5 s, so the music never runs dry; a step that is already in the
  // past is passed over in silence, so the song stays in time.
  let lastPump = 0, gap = TICK / 1000;
  function pump() {
    if (!music.playing || ac.state !== 'running') return;
    const now = ac.currentTime;
    if (lastPump) gap = Math.max(now - lastPump, gap * 0.995);      // widens at once, narrows over a few seconds
    lastPump = now;
    const ahead = Math.min(1.5, Math.max(AHEAD, gap * 3));
    music.ahead = ahead;
    while (music.playing && nextT < now + ahead) {
      if (nextT >= now - 0.01) step(pos, nextT); else music.late++;
      music.steps++;
      nextT += c.stepLen; pos++;
      if (music.hold && pos >= c.sections[0].bars * c.spb) pos = 0;
      if (pos >= c.steps) { music.playing = false; if (music.onEnd) music.onEnd(nextT); }
    }
    while (kicks.length > 1 && kicks[1] <= now) kicks.shift();
  }
  const timer = setInterval(pump, TICK);

  Object.assign(music, {
    play(song, station, { at, hold = false } = {}) {
      c = compile(song);
      music.song = song; music.station = station; music.hold = hold; music.playing = true;
      kit = { ...station.kit, ...song.kit };
      pos = 0; nextT = t0 = Math.max(at || 0, ac.currentTime + 0.05); beatLen = 60 / song.bpm;
      kicks.length = 0; music.bar = 0; music.section = c.sections[0].name;
      synth.setTempo(song.bpm);
      pump();
      return t0;
    },
    release() { music.hold = false; },
    stop() { music.playing = false; kicks.length = 0; synth.hush(); },
    pump, compile,
    dispose() { clearInterval(timer); },
  });
  Object.defineProperties(music, {
    beat: { get: () => (music.playing ? Math.max(0, (ac.currentTime - t0) / beatLen) : 0) },
    pulse: { get() { const now = ac.currentTime; while (kicks.length > 1 && kicks[1] <= now) kicks.shift(); return music.playing && kicks.length && kicks[0] <= now ? Math.exp(-(now - kicks[0]) * 9) : 0; } },
    bpm: { get: () => (music.song ? music.song.bpm : 0) },
  });
  return music;
}
