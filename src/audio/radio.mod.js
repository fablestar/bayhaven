// The radio. It plays in vehicles only. Each station loops: song, song, then the host talks
// over the next song's intro, an ad, and the station's ident; then round again. All talk is
// text on the ticker (the radio pill) spoken as blips. Q and E, the d-pad or a swipe on the
// pill change station; the lead's choice is remembered in state.chars.<lead>.radio (and saved).
// Stations are the files in src/content/radio/; a file with kind 'ads' is the shared ad pool.
//   modules.radio: on · station · stations · song · line · next() · prev() · tune(id) · skip()
//                  beat · pulse · bpm (for lights that follow the music) · stats
// Events: radio:station { id, name, freq, host }, radio:song { station, title, artist, bpm },
//         radio:line { station, kind: 'host' | 'ad' | 'ident', who, text, seconds }, radio:off.
import { createSynth } from './synth.js';
import { createMusic, compile } from './music.js';
import { speak } from './voice.js';

const files = import.meta.glob('../content/radio/*.js', { eager: true });
const CHARS = 14;            // the ticker's pace, characters a second
const TRIM = 2.5;
const NEAR = 6, FAR = 20;    // out of the car: muffled within 6 m, gone past 20 m

export default {
  name: 'radio', order: 52, needs: ['audio'],
  init(ctx) {
    const { events, state: S } = ctx, audio = ctx.modules.audio;
    let pool = { ads: {}, voices: {} };
    const stations = [];
    for (const path in files) { const f = files[path].default; if (f.kind === 'ads') pool = f; else if (f.songs) stations.push(f); }
    stations.sort((a, b) => a.dial - b.dial);
    const runtime = {};
    for (const s of stations) runtime[s.id] = { song: 0, slot: 0, ident: 0, identDue: true, said: [], adsLeft: [] };
    const stats = { songs: 0, lines: 0, ads: 0, idents: 0, hosts: 0, switches: 0 };
    const radio = { stations, on: false, station: null, song: null, line: null, stats, section: '' };
    let ac = null, synth = null, music = null, door = null, queue = [], talking = null, wasIn = false, car = null, pad = 0;

    const lead = () => S.chars[S.chars.active] || {};
    const station = () => stations.find((s) => s.id === radio.station) || stations[0];
    const now = () => ac.currentTime;
    const later = (at, fn) => { queue.push({ at, fn }); queue.sort((a, b) => a.at - b.at); };

    function graph() {
      if (synth) return;
      ac = audio.ctx;
      // the radio's own trim: the patch levels in the bible leave it under the day 1 engine, so +8 dB
      const trim = ac.createGain(); trim.gain.value = TRIM; trim.connect(audio.bus('music'));
      door = ac.createBiquadFilter(); door.type = 'lowpass'; door.frequency.value = 20000; door.connect(trim);
      synth = createSynth(ac, door, { voiceCap: Math.round(ctx.quality.get('audioVoices') / 2), stereo: ctx.quality.level !== 'low' });
      music = createMusic(ac, synth);
      music.onEnd = (t) => { if (radio.on) segment(t); };
    }

    // ---- talk ----
    function say(kind, who, text, voice, delay = 0) {
      const u = speak(ac, audio.bus('voice'), text, voice, now() + delay, text.length / CHARS);
      audio.duck('music', 6, delay + u.seconds + 0.15, { attack: 0.03, release: 0.4, id: 'voice' });
      talking = u; stats.lines++; stats[kind + 's']++;
      radio.line = { station: radio.station, kind, who, text, seconds: u.seconds };
      events.emit('radio:line', radio.line);
      return delay + u.seconds;
    }
    function quiet() { queue = []; if (talking) talking.cancel(); talking = null; audio.unduck('voice'); }
    const hourText = () => { const h = Math.floor(S.clock.hour) % 24; return `${h % 12 || 12} ${h < 12 ? 'a.m.' : 'p.m.'}`; };
    const wet = () => /rain|storm|hurricane/.test(S.weather.kind);
    function may(when, slot) {
      const h = S.clock.hour;
      if (when === 'after-ad') return slot === 'after-ad';
      if (slot === 'after-ad') return false;
      return when === 'any' || when === 'after-song' || (when === 'night' && (h >= 20 || h < 5)) || (when === 'day' && h >= 6 && h < 18)
        || (when === 'dawn' && h >= 5 && h < 7) || (when === 'storm' && wet() && h >= 15 && h < 16.5) || (when === 'rain' && wet());
      // `cut` and `back` wait for the Sheriff's show (heat 4), which has not shipped
    }
    // a host line that may play now, never one again until the others have had a turn
    function hostLine(s, slot) {
      const r = runtime[s.id], all = s.lines.map((l, i) => { const k = l.indexOf(' · '); return { i, when: l.slice(0, k), text: l.slice(k + 3) }; }).filter((l) => may(l.when, slot));
      if (!all.length) return null;
      let fresh = all.filter((l) => !r.said.includes(l.i));
      if (!fresh.length) { r.said = r.said.filter((i) => !all.some((l) => l.i === i)); fresh = all; }
      const l = fresh[Math.floor(Math.random() * fresh.length)];
      r.said.push(l.i);
      return l.text.replace('{hour}', hourText());
    }
    function nextAd(s) {
      const r = runtime[s.id];
      if (!r.adsLeft.length) r.adsLeft = s.ads.filter((id) => pool.ads[id]).sort(() => Math.random() - 0.5);
      // the storm rule: when it is raining the plywood ad goes first
      const i = wet() ? Math.max(0, r.adsLeft.indexOf('storm-mart')) : 0;
      return pool.ads[r.adsLeft.splice(i, 1)[0]];
    }
    const ident = (s) => { const r = runtime[s.id]; return say('ident', s.name, s.idents[r.ident++ % s.idents.length], s.host.voice, 0.2); };
    // two marimba notes before an ad (fifth, then root of the song's key) and one after
    function sting(song, after) {
      const root = 72 + compile(song).key - (compile(song).key > 6 ? 12 : 0), t = now() + 0.05;
      if (after) synth.play('marimba', { n: root, v: 110 }, t);
      else { synth.play('marimba', { n: root + 7, v: 110 }, t); synth.play('marimba', { n: root, v: 110 }, t + 0.2); }
    }
    // the break: host, ad, sometimes a word about the ad, then the ident as the song gets going
    function talkBreak(s, song, at) {
      later(at, () => {
        const line = hostLine(s, 'main'), d = line ? say('host', s.host.name, line, s.host.voice) : 0;
        later(now() + d + 0.5, () => {
          const ad = nextAd(s); let d2 = 0.3;
          if (ad) { sting(song, false); d2 = say('ad', ad.brand, ad.text, pool.voices[ad.voice] || pool.voices.announcer, 0.6); }
          later(now() + d2 + 0.3, () => {
            if (ad) sting(song, true);
            const word = Math.random() < 0.5 ? hostLine(s, 'after-ad') : null, d3 = word ? say('host', s.host.name, word, s.host.voice, 0.5) : 0;
            later(now() + d3 + 0.5, () => { music.release(); ident(s); });
          });
        });
      });
    }

    // ---- the loop ----
    function segment(at) {
      const s = station(), r = runtime[s.id], song = s.songs[r.song++ % s.songs.length], talk = r.slot >= 2;
      const t0 = music.play(song, s, { at, hold: talk });
      radio.song = { station: s.id, title: song.title, artist: song.artist, bpm: song.bpm, seconds: compile(song).seconds };
      stats.songs++;
      events.emit('radio:song', radio.song);
      if (talk) { r.slot = 1; r.identDue = false; talkBreak(s, song, t0 + 60 / song.bpm * 4); }
      else { r.slot++; if (r.identDue) { r.identDue = false; later(t0 + 0.3, () => ident(s)); } }
    }
    function start() { radio.on = true; runtime[station().id].identDue = true; segment(); }
    function stop() { radio.on = false; quiet(); music.stop(); radio.song = null; radio.line = null; events.emit('radio:off'); }

    function tune(id, remember = false) {
      const s = stations.find((x) => x.id === id);
      if (!s) return false;
      if (remember) lead().radio = id;
      if (radio.station === id) return true;
      radio.station = id; stats.switches++;
      events.emit('radio:station', { id, name: s.name, freq: s.freq, host: s.host.name });
      if (radio.on) {
        quiet(); music.stop();
        // a breath of static between stations, on the UI bus
        const n = ac.createBufferSource(), g = ac.createGain(), buf = ac.createBuffer(1, 2400, ac.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
        n.buffer = buf; g.gain.value = 0.25; n.connect(g); g.connect(audio.bus('ui')); n.start();
        runtime[id].identDue = true; segment();
      }
      return true;
    }
    function step(dir) {
      if (S.player.mode === 'foot' || !stations.length) return;
      audio.start();
      const i = stations.findIndex((s) => s.id === radio.station);
      tune(stations[(i + dir + stations.length) % stations.length].id, true);
    }
    // getting in: the lead's own choice if they have made one, else the station this kind of vehicle is tuned to
    function choose(model) {
      const mine = stations.find((s) => s.id === lead().radio), byModel = stations.find((s) => s.startsIn.includes(model));
      const first = stations.find((s) => s.firstFor === S.chars.active);
      tune((mine || byModel || first || stations[0]).id);
    }

    function tick() {
      if (!audio.ctx || !stations.length) return;
      graph();
      const p = S.player, inCar = p.mode !== 'foot';
      if (inCar) {
        if (!wasIn) { wasIn = true; choose(p.vehicle); door.frequency.setTargetAtTime(20000, now(), 0.1); audio.unduck('door'); }
        if (!radio.on && ac.state === 'running') start();
      } else {
        if (wasIn) { wasIn = false; car = car || { x: p.x, z: p.z }; }
        if (radio.on) {
          const d = car ? Math.hypot(p.x - car.x, p.z - car.z) : 0;
          if (d > FAR) stop();
          else { door.frequency.setTargetAtTime(600, now(), 0.1); audio.duck('music', 12 + Math.max(0, d - NEAR) / (FAR - NEAR) * 30, Infinity, { attack: 0.3, release: 0.3, id: 'door' }); }
        }
      }
      while (radio.on && queue.length && queue[0].at <= now() + 0.03) queue.shift().fn();
      if (radio.on) radio.section = music.section;
      // the d-pad: left and right
      const g = navigator.getGamepads ? [...navigator.getGamepads()].find(Boolean) : null;
      const dir = g && g.buttons[15] && g.buttons[15].pressed ? 1 : g && g.buttons[14] && g.buttons[14].pressed ? -1 : 0;
      if (dir && !pad) step(dir);
      pad = dir;
    }
    const timer = setInterval(tick, 100);
    events.on('audio:started', tick);
    events.on('vehicle:exited', ({ x, z }) => { car = { x, z }; });
    events.on('vehicle:entered', () => { car = null; });
    events.on('input:press', ({ name }) => { if (name === 'radioNext') step(1); else if (name === 'radioPrev') step(-1); });

    Object.assign(radio, {
      tune, next: () => step(1), prev: () => step(-1), tick,
      skip() { if (radio.on) { quiet(); music.stop(); segment(); } },          // to the next thing in the loop
      dispose() { clearInterval(timer); if (music) music.dispose(); },
    });
    // live values: the beat for lights, and the sequencer and synth for checks
    Object.defineProperties(radio, {
      beat: { get: () => (music ? music.beat : 0) }, pulse: { get: () => (music ? music.pulse : 0) },
      bpm: { get: () => (music && music.playing ? music.bpm : 0) }, music: { get: () => music }, synth: { get: () => synth },
    });
    ctx.test.radio = () => ({
      on: radio.on, station: radio.station, song: radio.song, line: radio.line, section: radio.section, stats: { ...stats },
      bar: music ? music.bar : 0, beat: radio.beat, pulse: radio.pulse, steps: music ? music.steps : 0, late: music ? music.late : 0, ahead: music ? music.ahead : 0,
      voices: synth ? { ...synth.stats } : null, patches: synth ? synth.patches : [], remembered: lead().radio || null,
      stations: stations.map((s) => ({ id: s.id, name: s.name, freq: s.freq, host: s.host.name, songs: s.songs.length, lines: s.lines.length, idents: s.idents.length,
        ads: s.ads.filter((id) => pool.ads[id]).length, songInfo: s.songs.map((g) => { const c = compile(g); return { title: g.title, bpm: g.bpm, bars: c.bars, seconds: c.seconds, patterns: c.patterns, melody: c.melody }; }) })),
    });
    return radio;
  },
  dispose(ctx) { ctx.modules.radio.dispose(); },
};
