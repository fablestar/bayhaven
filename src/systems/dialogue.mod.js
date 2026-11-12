// Dialogue: subtitle lines, one at a time, each with its speaker's speech blip (plan/03: a blip per
// character, Mags 180 Hz, Teo 260 Hz). Nobody is recorded. The line and its small portrait are drawn
// by src/ui/missionui.mod.js from `current`. Music ducks 6 dB while someone speaks (plan/07).
// Public object: play(lines, { block }) → { done } · stop() · busy · current { who, name, text, via, t, seconds, n } · said · stats
// A line is { who, text, via: 'phone' | 'radio' | 'loudhailer' }. Emits dialogue:line and dialogue:done.
import { speak } from '../audio/voice.js';
import { CAST, VIA } from '../content/cast.js';

const NUM = { base: 1.2, perChar: 0.045, min: 1.6, max: 5.2, gap: 0.15 };
let api = null;

export default {
  name: 'dialogue', order: 43,
  init(ctx) {
    const m = ctx.modules, ev = ctx.events;
    const stats = { lines: 0, blips: 0, plays: 0 };
    let queue = [], handle = null, cur = null, gap = 0, voice = null;

    function next() {
      const line = queue.shift();
      if (!line) { cur = null; if (handle) handle.done = true; handle = null; ev.emit('dialogue:done', {}); return; }
      const who = CAST[line.who] || { name: line.who ? line.who.charAt(0).toUpperCase() + line.who.slice(1) : '', voice: { wave: 'sine', hz: 220, ms: 55, rate: 10 } };
      const seconds = Math.max(NUM.min, Math.min(NUM.max, NUM.base + line.text.length * NUM.perChar));
      cur = { who: line.who, name: who.name, text: line.text, via: line.via || null, t: 0, seconds, n: ++stats.lines, hz: who.voice.hz };
      api.said.push(line.text); if (api.said.length > 40) api.said.shift();
      const au = m.audio, ac = au && au.ctx && au.ctx.state === 'running' ? au.ctx : null;
      if (ac && !au.muted) {
        const v = { ...who.voice, ...(line.via && VIA[line.via] ? { lp: VIA[line.via].lp, echo: VIA[line.via].echo } : {}) };
        voice = speak(ac, au.bus('voice'), line.text, v, ac.currentTime + 0.03);
        stats.blips += voice.syllables;
        if (au.duck) au.duck('music', 6, seconds, { attack: 0.05, release: 0.3, id: 'dialogue' });
      }
      ev.emit('dialogue:line', { who: line.who, name: who.name, text: line.text, via: cur.via, seconds, hz: who.voice.hz });
    }
    function stop() {
      queue = []; cur = null; gap = 0;
      if (voice) { voice.cancel(); voice = null; }
      if (handle) handle.done = true;
      handle = null;
    }

    api = {
      numbers: NUM, stats, said: [],
      get busy() { return !!cur || queue.length > 0; },
      get current() { return cur; },
      // a new set of lines takes over from whatever was being said
      play(lines, opts = {}) {
        stop();
        stats.plays++;
        queue = lines.slice(); handle = { done: false, block: !!opts.block };
        const h = handle;
        next();
        return h;
      },
      stop,
      update(dt) {
        if (!cur) return;
        cur.t += dt;
        if (cur.t < cur.seconds) return;
        if (gap <= 0) { gap = NUM.gap; }
        gap -= dt;
        if (gap <= 0) { gap = 0; next(); }
      },
    };
    ev.on('game:reset', () => { if (!document.body.classList.contains('clip')) stop(); });
    ctx.test.dialogue = () => ({ busy: api.busy, current: cur ? { ...cur } : null, queued: queue.length, said: api.said.slice(), stats: { ...stats }, cast: Object.keys(CAST), hz: Object.fromEntries(Object.entries(CAST).map(([k, c]) => [k, c.voice.hz])) });
    return api;
  },
  update(dt) { api.update(dt); },
};
