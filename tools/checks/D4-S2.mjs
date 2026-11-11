// Session D4-S2 (Radio): D4.4 from plan/08-roadmap.md and one check per item on the session's list.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const QUIET = '&quality=low&traffic=0&peds=0';
const SMALL = { viewport: { width: 480, height: 270 } };
// sound starts on the first key: tap the gas, then wait for the radio to come on
async function wake(page) {
  await page.keyboard.down('ArrowUp'); await page.waitForTimeout(80); await page.keyboard.up('ArrowUp');
  try { await page.waitForFunction(() => window.__game.test.radio().on, null, { timeout: 15000 }); }
  catch { throw new Error('the radio did not come on: ' + JSON.stringify(await page.evaluate(() => { const T = window.__game.test, r = T.radio(); return { audio: T.audio(), on: r.on, station: r.station, mode: window.__game.state.player.mode, errors: T.errors().slice(0, 4) }; }))); }
}
const walk = (dir, out = []) => { for (const n of readdirSync(dir)) { const p = join(dir, n); if (statSync(p).isDirectory()) walk(p, out); else out.push(p); } return out; };

export default [
  {
    id: 'D4.4', name: 'Radio plays',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await page.evaluate(() => { const g = window.__game; g.seen = []; g.t0 = performance.now(); for (const e of ['radio:station', 'radio:song', 'radio:line']) g.events.on(e, (p) => g.seen.push({ e, at: (performance.now() - g.t0) / 1000, ...p })); });
      await wake(page);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test;
        let sum = 0, n = 0, peak = 0;
        for (let i = 0; i < 50; i++) { await new Promise((ok) => setTimeout(ok, 100)); const v = T.audio().rms.music; sum += v * v; n++; peak = Math.max(peak, v); }
        return { rms: Math.sqrt(sum / n), peak, radio: T.radio(), mode: g.state.player.mode, audio: T.audio() };
      });
      t.expect(r.mode !== 'foot', '==', true, 'the player is in a vehicle');
      t.expect(r.rms, '>', 0.01, 'music bus RMS over 5 s');
      t.expect(r.radio.stations.length, '>=', 3, 'stations');
      for (const s of r.radio.stations) {
        t.expect(s.songs, '>=', 3, `${s.name}: songs`); t.expect(s.lines, '>=', 6, `${s.name}: host lines`);
        t.expect(s.ads, '>=', 4, `${s.name}: ads`); t.expect(s.idents, '>=', 2, `${s.name}: idents`);
      }
      const before = await page.evaluate(() => ({ n: window.__game.test.count('radio:station'), id: window.__game.test.radio().station }));
      await page.keyboard.press('KeyE'); await page.waitForTimeout(300);
      const after = await page.evaluate(() => ({ n: window.__game.test.count('radio:station'), id: window.__game.test.radio().station, seen: window.__game.seen }));
      t.expect(after.n, '==', before.n + 1, 'radio:station events after one press of E');
      t.expect(after.id !== before.id, '==', true, 'the station changed');
      const first = after.seen.find((x) => x.e === 'radio:line');
      t.expect(first ? first.at : 999, '<=', 120, 'seconds until the first radio:line');
      t.expect(!!first && first.text.length > 8, '==', true, 'the line has text');
    },
  },
  {
    id: 'D4-S2.1', name: 'Mixer: six buses, ducking, the limiter, the mute key',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await wake(page);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, A = g.modules.audio, wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
        const out = { buses: T.audio().buses, limiter: T.audio().limiter, master: !!A.mixer.master, engineStats: Object.keys(A.stats).length };
        A.duck('effects', 6, 0.4, { id: 'a' }); A.duck('effects', 3, 2, { id: 'b' }); await wait(150);
        const t0 = T.audio().time; out.deep = T.audio().duck.effects; await wait(900); out.shallow = T.audio().duck.effects; out.dt = T.audio().time - t0; out.list = A.mixer.ducks.map((d) => [d.id, d.depth, +(d.until - T.audio().time).toFixed(2)]); await wait(1700); out.none = T.audio().duck.effects;
        out.gain = A.mixer.buses.effects.duck.gain.value;
        return out;
      });
      for (const b of ['music', 'effects', 'ambience', 'voice', 'ui']) t.expect(r.buses.includes(b), '==', true, `bus ${b}`);
      t.expect(r.master && r.limiter, '==', true, 'the master bus ends in the limiter');
      t.expect(r.deep, '==', 6, 'two ducks at once: the deeper one (dB)');
      t.expect(r.shallow, '==', 3, `when the deep one ends, the other (dB) [${r.dt.toFixed(2)} s on, ${JSON.stringify(r.list)}]`);
      t.expect(r.none, '==', 0, 'and then none');
      t.expect(r.gain, '>', 0.9, 'the bus is back to full');
      await page.keyboard.press('Digit0'); await page.waitForTimeout(400);
      const m = await page.evaluate(() => ({ muted: window.__game.test.audio().muted, rms: window.__game.test.audio().rms.master }));
      t.expect(m.muted, '==', true, '0 mutes'); t.expect(m.rms, '<', 0.0005, 'master RMS when muted');
    },
  },
  {
    id: 'D4-S2.2', name: 'Synth: the ten instruments each make sound; voices stay under the cap',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await wake(page);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, R = g.modules.radio, wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
        await wait(3000);
        const busy = { ...R.synth.stats };
        // leave the car's radio: stop the music, then play each patch alone and measure the bus
        R.music.stop(); R.on = false; await wait(3500);
        const out = { silent: T.audio().rms.music, busy, patches: R.synth.patches, made: {} };
        for (const name of ['kick', 'snare', 'clap', 'hat', 'open-hat', 'bass-808', 'saw-bass', 'lead', 'pad', 'pluck', 'bell']) {
          let peak = 0;
          R.synth.play(name, name === 'pad' ? { notes: [57, 60, 64], d: 0.5 } : { n: name.includes('bass') ? 45 : 69, d: 0.25 }, 0);
          for (let i = 0; i < 8; i++) { await wait(40); peak = Math.max(peak, T.audio().rms.music); }
          out.made[name] = peak; await wait(700);
        }
        return out;
      });
      t.expect(r.silent, '<', 0.003, 'the bus is quiet with the music stopped');
      for (const name in r.made) t.expect(r.made[name], '>', 0.004, `${name}: RMS when played alone`);
      t.expect(r.patches.length, '>=', 10, 'patches');
      t.expect(r.busy.voices, '<=', 12, 'voices sounding in a song (the cap on low is 12)');
      t.expect(r.busy.played, '>', 10, 'notes played in 3 s');
    },
  },
  {
    id: 'D4-S2.3', name: 'Sequencer: in time, and every song is a small recipe with a fixed melody',
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await wake(page);
      const r = await page.evaluate(async () => {
        const T = window.__game.test, wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
        const a = T.radio(), t0 = T.audio().time; await wait(4000); const b = T.radio(), t1 = T.audio().time;
        return { bpm: a.song.bpm, beats: b.beat - a.beat, steps: b.steps - a.steps, late: b.late - a.late, ahead: b.ahead, seconds: t1 - t0, stations: b.stations };
      });
      const want = r.bpm / 60 * r.seconds;
      t.expect(Math.abs(r.beats - want), '<=', 0.05 * want + 0.3, `beats in ${r.seconds.toFixed(1)} s at ${r.bpm} bpm (got ${r.beats.toFixed(2)})`);
      t.expect(Math.abs(r.steps - want * 4), '<=', 4 + r.ahead * r.bpm / 15, `sixteenth steps scheduled (window ${r.ahead.toFixed(2)} s)`);
      t.expect(r.late, '<=', 2, 'steps that came too late to play');
      const { compile } = await import('../../src/audio/music.js');
      for (const id of ['tideline98', 'palma', 'bassline']) {
        const st = (await import(`../../src/content/radio/${id}.js`)).default, info = r.stations.find((x) => x.id === id);
        for (const [i, song] of st.songs.entries()) {
          const { _c, ...plain } = song; void _c;
          const c = compile({ ...plain }), kinds = new Set(song.form.map((f) => f[0])).size;
          t.expect(JSON.stringify(plain).length, '<', 2048, `${song.title}: size in bytes`);
          t.expect(kinds >= 4 && kinds <= 6, '==', true, `${song.title}: ${kinds} arrangements (4 to 6)`);
          t.expect(song.bpm >= (song.div === 2 ? 180 : st.recipe.bpm[0]) && song.bpm <= (song.div === 2 ? 180 : st.recipe.bpm[1]), '==', true, `${song.title}: ${song.bpm} bpm is in the station's range`);
          t.expect(c.melody.answer, '==', info.songInfo[i].melody.answer, `${song.title}: the melody from the seed is the same in the game and here`);
        }
      }
    },
  },
  {
    id: 'D4-S2.4', name: 'The loop: host line, ad and ident; the station is remembered; vehicles only', quality: ['low'],
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await page.evaluate(() => { const g = window.__game; g.seen = []; g.events.on('radio:line', (p) => g.seen.push(p)); });
      await wake(page);
      await page.keyboard.press('KeyQ'); await page.waitForTimeout(200);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, R = g.modules.radio, wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
        const tuned = T.radio().station;
        R.skip(); await wait(300); R.skip();                  // song, song, then the break
        for (let i = 0; i < 90 && !(g.seen.some((l) => l.kind === 'ad') && g.seen.filter((l) => l.kind === 'ident').length >= 2); i++) await wait(500);
        const kinds = g.seen.map((l) => l.kind), ducked = T.audio().duck.music;
        const longest = Math.max(...g.seen.map((l) => l.text.length));
        const saved = JSON.stringify(T.save.snapshot()).includes(tuned);
        const out = g.modules.player.exit(); await wait(600);
        const near = { on: T.radio().on, duck: T.audio().duck.music };
        const p = T.player(); T.teleport(p.x + 40, p.z, 0); await wait(1200);
        return { tuned, remembered: T.radio().remembered, kinds, ducked, longest, saved, out, near, far: T.radio().on, mode: g.state.player.mode };
      });
      t.expect(r.remembered, '==', r.tuned, 'the lead remembers the station');
      t.expect(r.saved, '==', true, 'and it is in the save');
      for (const k of ['host', 'ad', 'ident']) t.expect(r.kinds.includes(k), '==', true, `a radio:line of kind ${k}`);
      t.expect(r.longest, '<=', 260, 'the longest line (characters)');
      t.expect(r.out, '==', true, 'the player got out');
      t.expect(r.near.on && r.near.duck >= 12, '==', true, 'beside the car the radio is still heard, 12 dB down');
      t.expect(r.far, '==', false, 'past 20 m the radio is off');
    },
  },
  {
    id: 'D4-S2.5', name: 'The radio pill', quality: ['low'],
    async run(t) {
      const page = await t.open(QUIET, SMALL);
      await wake(page);
      // a slow test machine can take longer than the pill's 4 s to get here, so change station and look at once
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
        g.modules.radio.next(); await wait(1200);
        return { pill: T.radioPill(), radio: T.radio(), slot: g.modules.hud.layout().find((x) => x.id === 'radio') };
      });
      t.expect(r.pill.shown, '==', true, 'shown when the station changes');
      t.expect(r.pill.opacity, '>', 0.5, 'and visible');
      t.expect(r.pill.station, '==', r.radio.stations.find((s) => s.id === r.radio.station).name, 'the station name');
      t.expect(r.pill.ticker.length, '>', 8, 'the ticker carries the ident');
      t.expect(r.pill.rect.x === r.slot.x && r.pill.rect.y === r.slot.y && r.pill.rect.w <= r.slot.w, '==', true, 'inside the place the HUD keeps for it');
      const box = r.pill.rect;
      await page.mouse.click(box.x + box.w / 2, box.y + box.h / 2); await page.waitForTimeout(300);
      const after = await page.evaluate(() => window.__game.test.radio().station);
      t.expect(after !== r.radio.station, '==', true, 'a tap changes the station');
      if (process.env.SHOT) await page.screenshot({ path: 'shots/D4-S2-radio-pill.png' });
    },
  },
  {
    id: 'D4-S2.6', name: 'Rooftop Launch Party: only on day 4, lights on the beat', quality: ['low', 'high'],
    async run(t) {
      const page = await t.open('&quality=' + t.quality + '&traffic=0&peds=0', SMALL);
      await wake(page);
      const r = await page.evaluate(async () => {
        const g = window.__game, T = g.test, D = g.modules.drops, P = D.active, wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
        T.teleport(P.roof.x, P.roof.z + 90, Math.PI); await wait(2500);
        let peak = 0, low = 1; const beats = new Set();
        for (let i = 0; i < 60; i++) { await wait(50); peak = Math.max(peak, P.pulse); low = Math.min(low, P.pulse); beats.add(Math.floor(P.beat)); }
        return { id: D.id, roof: P.roof, follows: P.follows, peak, low, beats: beats.size, calls: P.calls, tris: P.triangles, stats: T.stats(), district: g.modules.map.districtAt(P.roof.x, P.roof.z), bpm: T.radio().song.bpm };
      });
      t.expect(r.id, '==', 'rooftop-launch-party', 'the drop on build day 4');
      t.expect(r.district, '==', 'meridian', 'the roof is in Meridian');
      t.expect(r.roof.y, '>=', 10, 'height of the roof (m)');
      t.expect(r.follows, '==', 'radio', 'the lights follow the radio');
      t.expect(r.peak, '>', 0.6, 'the lights flash on a kick'); t.expect(r.low, '<', 0.3, 'and fade between kicks');
      t.expect(r.beats, '>=', Math.floor(r.bpm / 60 * 3) - 1, 'beats counted in 3 s');
      t.expect(r.calls, '<=', 3, 'draw calls the party adds');
      const i = t.quality === 'high' ? 2 : 0, { TABLE } = await import('../../src/core/quality.js');
      t.expect(r.stats.calls, '<=', TABLE.maxCalls[i], 'draw calls looking at the party'); t.expect(r.stats.tris, '<=', TABLE.maxTris[i], 'triangles looking at the party');
      const other = await t.open('&quality=low&day=3&traffic=0&peds=0', SMALL);
      const id = await other.evaluate(() => window.__game.modules.drops.id);
      t.expect(id !== 'rooftop-launch-party', '==', true, 'not there on day 3');
    },
  },
  {
    id: 'D4-S2.7', name: 'No audio files', quality: ['low'],
    async run(t) {
      const AUDIO = /\.(mp3|ogg|oga|wav|m4a|aac|flac|opus|mid|midi|webm)$/i;
      const files = [...walk('dist'), ...walk('src'), ...(() => { try { return walk('public'); } catch { return []; } })()];
      t.expect(files.filter((f) => AUDIO.test(f)).length, '==', 0, 'audio files in dist, src and public');
      const code = walk('src').filter((f) => /\.(js|html)$/.test(f)).filter((f) => /new Audio\(|<audio|decodeAudioData/.test(readFileSync(f, 'utf8')));
      t.expect(code.length, '==', 0, 'source files that load or decode recorded sound');
    },
  },
];

