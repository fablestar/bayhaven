// Bayhaven. Boot the renderer, find the modules, start the loop. Nobody edits this after day 2:
// a feature is a new *.mod.js file that core/registry.js finds by itself.

import * as THREE from 'three';
import { createEvents } from './core/events.js';
import { createState } from './core/state.js';
import { createQuality } from './core/quality.js';
import { createInput } from './core/input.js';
import { createLoop } from './core/loop.js';
import { createRegistry } from './core/registry.js';
import { createSave } from './core/save.js';
import { createTestApi } from './core/testapi.js';
import * as rng from './core/rng.js';

const params = new URLSearchParams(location.search);
const events = createEvents();
const state = createState(params);
const quality = createQuality(params, events);
state.settings.quality = params.get('quality') || 'auto';

const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: quality.get('antialias'), powerPreference: 'high-performance' });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.3, 4000);

const ctx = {
  scene, camera, renderer, state, events, quality, params, rng, modules: {},
  input: createInput(events), build: state.build,
  get map() { return ctx.modules.map; },
};
ctx.save = createSave(ctx);
const registry = ctx.registry = createRegistry(ctx);
const loop = ctx.loop = createLoop({
  events,
  step(dt) { ctx.input.sample(dt); registry.update(dt); },
  draw(alpha, dt, raw) { registry.render(alpha); renderer.render(scene, camera); quality.frame(raw); },
});
ctx.test = createTestApi(ctx);

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  events.emit('view:resize', { w, h });
}
events.on('input:press', ({ name }) => { if (name === 'reset') events.emit('game:reset'); });   // the R key

registry.init();
quality.attach((ratio) => { renderer.setPixelRatio(ratio); resize(); });
window.addEventListener('resize', resize);
loop.start();
