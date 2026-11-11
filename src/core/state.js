// The one shared game state. Each module owns one key and only it writes there; anyone may read.
// The shape is fixed in plan/06-tech-architecture.md. The save file is a filtered copy of this.

import { BUILD } from './build.js';

const lead = (x, z, h, radio) => ({ x, z, h, health: 100, armour: 0, outfit: ['none', 'none', 'none', 'none', 'none'], weapons: {}, radio });

export function createState(params) {
  return {
    build:   { day: parseInt(params.get('day'), 10) || BUILD.day, commit: BUILD.commit },   // ?day=N is for testing the daily drop
    clock:   { hour: 14, speed: 1 },
    weather: { kind: 'clear', wet: 0, wind: 0 },
    player:  { id: 'mags', mode: 'vehicle', x: 0, z: 0, y: 0, h: 0, level: 0, speed: 0, health: 100, armour: 0, vehicle: null },
    chars:   { active: 'mags', mags: lead(-24, 40.5, Math.PI / 2, null), teo: lead(-24, 40.5, Math.PI / 2, null) },
    heat:    { level: 0, viewers: 0, peak: 0, seen: false },
    economy: { cash: 0, followers: 212 },
    mission: { id: null, step: 0, flags: {}, done: [], available: [] },
    world:   { district: null, chunksLoaded: 0 },
    ui:      { phoneOpen: false, paused: false },
    settings:{ quality: 'auto', music: 0.8, sfx: 1, reduceMotion: false },
    // kept for the save file; their owners arrive on later days
    property:{ owned: [], garage: {} },
    found:   { flamingos: [], postcards: [], bigair: [] },
    stats:   { distanceKm: 0, bestDrift: 0, peakViewers: 0, playSeconds: 0 },
  };
}
