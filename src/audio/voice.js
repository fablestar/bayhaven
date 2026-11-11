// Speech as blips: nobody is recorded. A line is "spoken" as one short pitched blip per
// syllable at the speaker's pitch, with a breath at commas and full stops, while the text
// scrolls on the radio's ticker. Recipes: the host sections of plan/bible/radio/*.md.
//   speak(ac, out, text, voice, at, minSeconds) → { seconds, syllables, cancel() }; the blips are
//                                     spread out to last at least minSeconds (the ticker's pace)
//   voice: { wave, hz, ms (blip length), rate (syllables a second), end (the last syllable of a
//            sentence rises or falls by this share), sub (a copy an octave down), echo (seconds),
//            lp (a low-pass in Hz), vibrato }

const VOWELS = /[aeiouyáéíóúü]+/gi;

// how many blips a word gets: its vowel groups, less a silent final e; a number is read digit by digit
export function syllables(word) {
  const digits = word.match(/\d/g);
  if (digits) return digits.length;
  const w = word.toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
  if (!w) return 0;
  let n = (w.match(VOWELS) || []).length;
  if (n > 1 && /[^aeiouy]e$/.test(w) && !/le$/.test(w)) n--;
  return Math.max(1, n);
}

// the line as timed blips: [{ t, f }] and how long it takes
export function plan(text, voice) {
  const gap = 1 / voice.rate, blips = [];
  let t = 0, n = 0;
  for (const word of text.split(/\s+/)) {
    const count = syllables(word), stop = /[.?!:]["')]?$/.test(word), comma = /[,;]$/.test(word);
    for (let i = 0; i < count; i++) {
      // a small wander so it sounds like talk, the same for everyone
      const wander = 1 + 0.07 * Math.sin(n * 2.4 + word.length) + 0.03 * Math.sin(n * 0.7);
      const last = stop && i === count - 1;
      blips.push({ t, f: voice.hz * wander * (last ? 1 + (voice.end || 0) : 1) });
      t += gap; n++;
    }
    if (stop) t += gap * 1.6; else if (comma) t += gap * 0.8;
  }
  return { blips, seconds: t };
}

export function speak(ac, out, text, voice, at, minSeconds = 0) {
  const said = plan(text, voice), k = Math.max(1, minSeconds / (said.seconds || 1)), blips = said.blips, seconds = said.seconds * k;
  const t0 = Math.max(at || 0, ac.currentTime + 0.02), len = voice.ms / 1000;
  const bus = ac.createGain();
  let node = bus;
  if (voice.lp) { const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = voice.lp; bus.connect(f); node = f; }
  node.connect(out);
  if (voice.echo) { const d = ac.createDelay(0.3), g = ac.createGain(); d.delayTime.value = voice.echo; g.gain.value = 0.4; node.connect(d); d.connect(g); g.connect(out); }
  const level = voice.wave === 'square' ? 0.22 : 0.5;
  for (const b of blips) {
    const t = t0 + b.t * k, g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(level, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    const o = ac.createOscillator(); o.type = voice.wave || 'sine'; o.frequency.setValueAtTime(b.f, t);
    if (voice.vibrato) { o.frequency.linearRampToValueAtTime(b.f * 1.04, t + len / 2); o.frequency.linearRampToValueAtTime(b.f, t + len); }
    o.connect(g); o.start(t); o.stop(t + len + 0.02);
    if (voice.sub) { const s = ac.createOscillator(), sg = ac.createGain(); sg.gain.value = 0.5; s.frequency.setValueAtTime(b.f / 2, t); s.connect(sg); sg.connect(g); s.start(t); s.stop(t + len + 0.02); }
    g.connect(bus);
  }
  return {
    seconds, syllables: blips.length, start: t0,
    cancel() { const t = ac.currentTime; bus.gain.setTargetAtTime(0, t, 0.01); setTimeout(() => bus.disconnect(), 200); },
  };
}
