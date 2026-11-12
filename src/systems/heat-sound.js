// What heat sounds like: the cruisers' siren (one voice, as loud as the nearest lit cruiser is
// close) and the police scanner (the dispatcher's calls as blips, with a burst of static before
// and a beep after). The scanner is heard inside a cruiser or within 30 m of one.
// All of it is made in code on the audio lane's `effects` and `voice` buses.
import { speak } from '../audio/voice.js';
import { CALLS, CALL_AS, DISPATCH_VOICE } from '../content/scanner.js';

const SIREN = { wail: [640, 1320, 0.28], yelp: [700, 1500, 3.1], reach: 220, level: 0.16 };

export function createHeatSound(ctx) {
  const S = ctx.state, ev = ctx.events, m = ctx.modules;
  const stats = { calls: 0, dropped: 0, sirenLevel: 0, sirenOn: false, mode: '', last: '', lastKind: '', spoken: 0 };
  let siren = null, busyUntil = 0, unit = 3 + Math.floor(Math.random() * 56), time = 0;
  const ac = () => (m.audio && m.audio.ctx) || null;

  function makeSiren(a) {
    const osc = a.createOscillator(), lfo = a.createOscillator(), depth = a.createGain(), lp = a.createBiquadFilter(), gain = a.createGain();
    osc.type = 'sawtooth'; lfo.type = 'triangle'; lp.type = 'lowpass'; lp.frequency.value = 2600; gain.gain.value = 0;
    lfo.connect(depth); depth.connect(osc.frequency); osc.connect(lp); lp.connect(gain); gain.connect(m.audio.bus('effects'));
    osc.start(); lfo.start();
    return { osc, lfo, depth, gain, mode: '' };
  }
  function setSiren(mode, level) {
    const a = ac();
    stats.sirenLevel = level; stats.sirenOn = level > 0.001; stats.mode = level > 0.001 ? mode : '';
    if (!a) return;
    if (!siren) { if (level <= 0) return; siren = makeSiren(a); }
    if (siren.mode !== mode) {
      const [lo, hi, hz] = SIREN[mode];
      siren.osc.frequency.setTargetAtTime((lo + hi) / 2, a.currentTime, 0.05);
      siren.depth.gain.setTargetAtTime((hi - lo) / 2, a.currentTime, 0.05);
      siren.lfo.frequency.setTargetAtTime(hz, a.currentTime, 0.05);
      siren.mode = mode;
    }
    siren.gain.gain.setTargetAtTime(level, a.currentTime, 0.12);
  }

  const HEADINGS = ['southbound', 'eastbound', 'northbound', 'westbound'];
  function fill(text) {
    const p = S.player, car = m.vehicles && m.vehicles.player, onFoot = p.mode === 'foot';
    const road = m.map.nearestRoad ? m.map.nearestRoad(p.x, p.z) : null, zone = m.map.zoneAt ? m.map.zoneAt(p.x, p.z) : null;
    const model = car && m.vehicles.models && m.vehicles.models[car.model], name = (model && model.name) || (car ? car.model : 'car');
    const hd = HEADINGS[((Math.round(Math.atan2(Math.sin(p.h), Math.cos(p.h)) / (Math.PI / 2)) % 4) + 4) % 4];
    let out = text;
    if (onFoot) out = out.replace(/(the|a|an) \{vehicle\}/gi, 'suspect on foot');
    return out.replace(/\{unit\}/g, unit).replace(/\{street\}/g, (road && road.name) || 'the beachfront').replace(/\{district\}/g, (zone && zone.name) || 'Bayhaven')
      .replace(/\{vehicle\}/g, name).replace(/\{heading\}/g, hd).replace(/\{suspect\}/g, p.id === 'mags' ? 'a woman in a visor' : 'a man with a phone on his chest')
      .replace(/\{viewers\}/g, Math.round(S.heat.viewers).toLocaleString('en-US'));
  }
  // one call at a time; a newer one is dropped unless it is a killing or a deputy down
  function call(kind, level, seen) {
    const rows = CALLS[kind] || CALLS[CALL_AS[kind]];
    if (!rows || !seen) return null;
    const cut = kind === 'killing' || kind === 'deputy-down';
    if (time < busyUntil && !cut) { stats.dropped++; return null; }
    const text = fill(rows[Math.max(0, Math.min(rows.length - 1, level - 1))]);
    stats.calls++; stats.last = text; stats.lastKind = kind;
    const near = m.cops && m.cops.nearest ? m.cops.nearest() : 1e9;
    const heard = near < 30;
    let seconds = 3;
    const a = ac();
    if (a && heard) {
      const out = m.audio.bus('voice'), t0 = a.currentTime + 0.03;
      // 60 ms of static opens the call
      const n = a.createBufferSource(), buf = a.createBuffer(1, Math.ceil(a.sampleRate * 0.06), a.sampleRate), d = buf.getChannelData(0), ng = a.createGain();
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      n.buffer = buf; ng.gain.value = 0.18; n.connect(ng); ng.connect(out); n.start(t0);
      const said = speak(a, out, text, DISPATCH_VOICE, t0 + 0.07);
      seconds = said.seconds + 0.2;
      // and an 80 ms beep at 1 kHz closes it
      const o = a.createOscillator(), og = a.createGain(), t1 = t0 + 0.07 + said.seconds + 0.05;
      o.frequency.value = 1000; og.gain.setValueAtTime(0.12, t1); og.gain.setValueAtTime(0, t1 + 0.08); o.connect(og); og.connect(out); o.start(t1); o.stop(t1 + 0.1);
      stats.spoken++;
    }
    if (heard) ev.emit('ui:toast', { kind: 'subtitle', who: 'Dispatch', text, seconds: Math.min(6, Math.max(3, seconds)) });
    busyUntil = time + Math.min(6, seconds);
    ev.emit('scanner:call', { kind, level, text, heard });
    return text;
  }
  ev.on('crime', (e) => { if (e && e.points !== undefined && (e.seen || e.points > 0)) call(e.kind, Math.max(1, e.level || 0), true); });
  ev.on('heat:cleared', () => { unit = 3 + Math.floor(Math.random() * 56); });

  return {
    call, fill, stats: () => ({ ...stats, unit, running: !!siren }),
    update(dt, cops) {
      time += dt;
      const L = S.heat.level;
      let level = 0;
      if (cops && L > 0 && cops.nearestLit) {
        const d = cops.nearestLit();
        if (d < SIREN.reach) level = SIREN.level * (1 - d / SIREN.reach) ** 1.5 * (S.ui.paused ? 0 : 1);
      }
      setSiren(L >= 3 ? 'yelp' : 'wail', level);
    },
  };
}
