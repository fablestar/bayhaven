// Saving. The format is fixed here on day 2 so later days never have to rework it.
// A save is { v, day, savedAt, playSeconds, sections, versions }: one section per owner, holding
// the fields in plan/04-systems.md section 18. Stored in localStorage as bayhaven.save.<slot>
// (slots 1, 2, 3 and auto). A module that owns a section registers it with save.section();
// until then the defaults below read and write state through a whitelist.
// A section this build does not know is kept and written back untouched, so a save can pass
// through an older build without losing newer data.

export const SAVE_VERSION = 1;
const KEY = 'bayhaven.save.';
const SLOTS = ['1', '2', '3', 'auto'];
const PREFIX = 'BH1.';

// lifts a whole save from version n to n + 1 (none yet: version 1 is the first)
const migrate = {};

const copy = (v) => JSON.parse(JSON.stringify(v));
const leadOut = (c) => ({ x: c.x, z: c.z, h: c.h, health: c.health, armour: c.armour, outfit: c.outfit.slice(), weapons: { ...c.weapons }, radio: c.radio });

export function createSave(ctx) {
  const { state, events } = ctx;
  const sections = new Map();
  let unknown = {}, unknownVersions = {};

  const save = {
    version: SAVE_VERSION, slots: SLOTS,
    // section(key, { version, get(), set(data), migrate: { 1: fn } }); registering a key again replaces it
    section(key, def) { sections.set(key, { version: 1, migrate: {}, ...def }); },

    // the save object for right now
    snapshot() {
      const out = { v: SAVE_VERSION, day: state.build.day, savedAt: new Date().toISOString(),
        playSeconds: Math.round(state.stats.playSeconds), sections: { ...copy(unknown) }, versions: { ...unknownVersions } };
      for (const [key, s] of sections) { out.sections[key] = copy(s.get()); out.versions[key] = s.version; }
      return out;
    },
    // put a save object into the game; returns false when it is not a save this build can read
    apply(data) {
      if (!data || typeof data !== 'object' || typeof data.v !== 'number' || !data.sections || data.v > SAVE_VERSION) return false;
      data = copy(data);
      while (data.v < SAVE_VERSION) { if (!migrate[data.v]) return false; data = migrate[data.v](data); data.v++; }
      unknown = {}; unknownVersions = {};
      const versions = data.versions || {};
      for (const key in data.sections) {
        const s = sections.get(key);
        if (!s) { unknown[key] = data.sections[key]; if (key in versions) unknownVersions[key] = versions[key]; continue; }
        let d = data.sections[key], v = versions[key] || 1;
        if (v > s.version) continue;                 // made by a newer build: leave this part alone
        while (v < s.version && s.migrate[v]) { d = s.migrate[v](d); v++; }
        try { s.set(d); } catch (e) { console.error('save section ' + key + ': ' + e.message); }
      }
      state.stats.playSeconds = data.playSeconds || 0;
      events.emit('save:loaded', { day: data.day, v: data.v });
      return true;
    },
    write(slot = 'auto') {
      try { localStorage.setItem(KEY + slot, JSON.stringify(save.snapshot())); return true; } catch { return false; }
    },
    load(slot = 'auto') {
      try { return save.apply(JSON.parse(localStorage.getItem(KEY + slot))); } catch { return false; }
    },
    list() {
      const out = [];
      for (const slot of SLOTS) {
        try {
          const d = JSON.parse(localStorage.getItem(KEY + slot));
          if (d && d.sections) out.push({ slot, v: d.v, day: d.day, savedAt: d.savedAt, playSeconds: d.playSeconds });
        } catch {}
      }
      return out;
    },
    // a text code for moving a save between devices
    exportCode() {
      const bytes = new TextEncoder().encode(JSON.stringify(save.snapshot()));
      let bin = '';
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      return PREFIX + btoa(bin);
    },
    importCode(str) {
      try {
        if (typeof str !== 'string' || !str.startsWith(PREFIX)) return false;
        const bin = atob(str.slice(PREFIX.length).trim()), bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return save.apply(JSON.parse(new TextDecoder().decode(bytes)));
      } catch { return false; }
    },
    // the autosave; nothing calls it yet (never in tests, never mid-mission)
    auto() {
      if (ctx.params.has('test') || state.mission.id) return false;
      return save.write('auto');
    },
  };

  // ---- the default sections: every field in plan/04 section 18 ----
  const S = state;
  save.section('clock', { get: () => ({ hour: S.clock.hour, weather: S.weather.kind }),
    set(d) { if (typeof d.hour === 'number') S.clock.hour = d.hour; if (d.weather) S.weather.kind = d.weather; } });
  save.section('economy', { get: () => ({ cash: S.economy.cash, followers: S.economy.followers }),
    set(d) { S.economy.cash = d.cash | 0; S.economy.followers = d.followers | 0; } });
  save.section('chars', { get: () => ({ active: S.chars.active, mags: leadOut(S.chars.mags), teo: leadOut(S.chars.teo) }),
    set(d) { S.chars.active = d.active === 'teo' ? 'teo' : 'mags'; Object.assign(S.chars.mags, d.mags); Object.assign(S.chars.teo, d.teo); } });
  save.section('missions', { get: () => ({ done: S.mission.done, available: S.mission.available }),
    set(d) { S.mission.done = d.done || []; S.mission.available = d.available || []; } });
  save.section('property', { get: () => ({ owned: S.property.owned, garage: S.property.garage }),
    set(d) { S.property.owned = d.owned || []; S.property.garage = d.garage || {}; } });
  save.section('found', { get: () => S.found, set(d) { Object.assign(S.found, d); } });
  save.section('stats', { get: () => ({ distanceKm: S.stats.distanceKm, bestDrift: S.stats.bestDrift, peakViewers: S.stats.peakViewers }),
    set(d) { Object.assign(S.stats, d); } });
  save.section('settings', { get: () => S.settings, set(d) { Object.assign(S.settings, d); } });
  return save;
}
