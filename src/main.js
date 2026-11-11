// Bayhaven: day 2. Boot the renderer, build the city, drive the car, turn the sky.

import * as THREE from 'three';
import { createInput } from './input.js';
import { createAudio } from './audio.js';
import { createGulls } from './gulls.js';
import { createWorld } from './world.js';
import { createCar } from './car.js';
import { createSky } from './sky.js';
import { createProps } from './props.js';
import { createFx } from './fx.js';
import { createCameras } from './camera.js';
import { createHud } from './hud.js';
import { createDriftNight } from './driftnight.js';
import { events } from './events.js';
import { DT, PRESETS, straightRun } from './handling.js';
import { CLIPS } from './clip.js';

const params = new URLSearchParams(location.search);
const BUILD_DAY = parseInt(params.get('day'), 10) || 2;   // ?day=N is for testing the daily drop
const clipId = params.get('clip');

const canvas = document.getElementById('game');
const coarse = matchMedia('(pointer: coarse)').matches; // phones and tablets
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !coarse, powerPreference: 'high-performance' });
let pixelRatio = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
renderer.setPixelRatio(pixelRatio);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.3, 4000);

const sky = createSky(scene);
const props = createProps(scene);
const world = createWorld(scene, props);
// the Heron comes in one of two paints, picked each load (the clip always uses the pink one)
const PAINTS = [[0xff4f6e, 0x29e6ff], [0x1fc8b4, 0xffd23e]];
const paint = PAINTS[clipId ? 0 : Math.floor(Math.random() * PAINTS.length)];
const car = createCar(scene, world, props, paint[0], paint[1]);
car.reset(world.spawn);
const fx = createFx(scene, { low: coarse, heightAt: world.heightAt });
const hud = createHud(events);
const drop = BUILD_DAY === 2 ? createDriftNight(scene, world, props, events, hud) : null;
if (!drop) hud.drop('');
props.finish();

const gulls = createGulls(scene);
const audio = createAudio();
const cams = createCameras(camera, world, car, fx);
const hint = document.getElementById('hint');
const clockEl = document.getElementById('clock');

// ---------- the clock ----------
// Starts mid-afternoon and rolls on to sunset, dusk and night, then round again.
let hour = parseFloat(params.get('hour')) || 14;
let time = 0;
function hoursPerSecond(h) {
  if (h >= 17.8 && h < 20.6) return 1 / 24;   // linger on the sunset
  if (h >= 21.5 || h < 5) return 1 / 3;        // nights go by quickly
  return 1 / 11;
}
function skipTime() {
  // jump to the next good bit: sunset, then night, then morning, then afternoon
  hour = hour < 5.5 ? 7 : hour < 13.5 ? 14 : hour < 18.3 ? 18.6 : hour < 19.4 ? 19.5 : hour < 20.6 ? 21.6 : 7;
}
clockEl.addEventListener('pointerdown', (e) => { e.preventDefault(); skipTime(); });

function resetAll() {
  car.reset(world.spawn); props.reset(); cams.snap();
  if (drop) drop.reset();
}
const input = createInput({
  onFirstInput() { audio.start(); hint.style.opacity = 0; },
  onKey(code) {
    if (code === 'KeyT') skipTime();
    if (code === 'KeyM') { audio.start(); audio.toggleMute(); }
    if (code === 'KeyR') resetAll();
    if (code === 'KeyC') cams.next();
  },
});

// ---------- what a hit, a slide or a broken prop sets off ----------
events.on('vehicle:crash', ({ speed, x, z, nx, nz }) => {
  fx.sparks(x, car.y + 0.45, z, nx, nz);
  fx.shake(speed * 0.02);
  audio.crash(speed);
});
events.on('vehicle:scrape', ({ x, z, nx, nz }) => fx.sparks(x, car.y + 0.4, z, nx, nz, 3));
events.on('prop:broken', ({ kind, speed }) => {
  fx.shake(kind === 'cone' ? 0.02 : 0.06);
  if (kind === 'cone') audio.clatter(); else if (kind === 'barrier') { audio.clatter(); audio.crash(speed * 0.4); } else { audio.clang(); audio.crash(speed * 0.5); }
});

// ---------- one fixed step of the game (60 a second) ----------
const wp = { x: 0, z: 0 };
let smokeT = 0, simTime = 0;
const SMOKE_EVERY = coarse ? 0.075 : 0.02;
function simStep() {
  input.poll(DT);
  car.step(input);
  if (car.smoking) {
    smokeT += DT;
    if (smokeT >= SMOKE_EVERY) {
      smokeT = 0;
      const c = Math.cos(car.h), s = Math.sin(car.h);
      const vx = (s * car.vf + c * car.vl) * 0.2, vz = (c * car.vf - s * car.vl) * 0.2;
      for (const i of [2, 3]) { car.wheelPos(i, wp); fx.puff(wp.x, car.y + 0.25, wp.z, vx, vz); }
    }
  }
  for (let i = 0; i < 4; i++) {
    car.wheelPos(i, wp);
    fx.skid(i, wp.x, wp.z, car.skidding === 2 || (car.skidding === 1 && i > 1));
  }
  props.update(DT, sky.night);
  fx.step(DT);
  simTime += DT;
}

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  cams.resize(w, h);
}
window.addEventListener('resize', resize);
resize();

// ---------- main loop ----------
let last = performance.now(), slowFrames = 0, frames = 0, lastClock = '', acc = 0, simMs = 0;
let readyResolve;
const ready = new Promise((r) => { readyResolve = r; });
function frame(now) {
  requestAnimationFrame(frame);
  const raw = (now - last) / 1000;
  last = now;
  const dt = Math.min(raw, 0.05);
  time += dt;
  hour = (hour + dt * hoursPerSecond(hour)) % 24;

  const t0 = performance.now();
  acc = Math.min(acc + dt, DT * 4);
  while (acc >= DT) { simStep(); acc -= DT; }
  car.draw(dt, sky.night);
  cams.update(dt, input.lookBack);
  sky.update(hour, time, camera);
  world.update(sky.night);
  gulls.update(time, sky.night);
  if (drop) drop.update(dt, sky.night);
  fx.draw(camera, sky.night, cams.speedShake());
  const ratio = Math.min(1, Math.abs(car.vf) / car.maxSpeed);
  const seaNear = Math.max(0, Math.min(1, (car.z + 30) / 90));
  audio.update(ratio, input.gas, seaNear * Math.sqrt(seaNear), car.gear + 1, car.slip, car.kmh);
  audio.setHorn(input.horn);
  hud.update(dt, car, audio.stats.q);
  simMs = performance.now() - t0;
  renderer.render(scene, camera);

  const hh = Math.floor(hour), mm = Math.floor((hour - hh) * 60 / 10) * 10;
  const text = String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
  if (text !== lastClock) { clockEl.textContent = lastClock = text; }

  // if the phone can't keep up, render fewer pixels
  frames++;
  if (raw > 1 / 35) slowFrames++;
  if (frames >= 120) {
    if (slowFrames > 70 && pixelRatio > 0.75) {
      pixelRatio = Math.max(0.75, pixelRatio - 0.25);
      renderer.setPixelRatio(pixelRatio);
      resize();
    }
    frames = slowFrames = 0;
  }
  readyResolve();
}
requestAnimationFrame(frame);

// ---------- the scripted clip (?clip=day-2) ----------
function playClip(id) {
  const clip = CLIPS[id];
  if (!clip) return Promise.reject(new Error('no clip called ' + id));
  document.body.classList.add('clip');
  hour = clip.hour; fx.seed(1);
  resetAll(); car.reset(clip.start); cams.snap();
  return input.script(clip.script).then(() => { document.body.classList.remove('clip'); });
}
if (clipId) ready.then(() => playClip(clipId)).catch((e) => console.error(e.message));

// ---------- for tests and the console ----------
const player = () => ({ x: car.x, z: car.z, h: car.h, speed: Math.hypot(car.vf, car.vl), kmh: car.kmh, vf: car.vf, vl: car.vl, w: car.w,
  slip: car.slip, gear: car.gear + 1, mu: car.mu, drift: { ...car.drift } });
window.__game = {
  car, world, sky, renderer, camera, props, fx, audio, input, cams, hud, drop, events, buildDay: BUILD_DAY,
  setHour: (h) => { hour = h; },
  test: {
    ready,
    stats: () => ({ calls: renderer.info.render.calls, tris: renderer.info.render.triangles, simMs, simTime }),
    teleport(x, z, h = car.h, speed = 0) { car.reset({ x, z, h, vf: speed }); cams.snap(); },   // speed in m/s
    setHour: (h) => { hour = h; },
    input: (steps) => input.script(steps),
    // run game time forward right now, without drawing (the same steps the frame loop runs)
    advance(seconds) { for (let i = 0, n = Math.round(seconds / DT); i < n; i++) simStep(); return player(); },
    player, vehicle: player,
    count: (name) => events.count(name),
    reset: resetAll,
    // the real handling step on an empty flat road, gas held: speed in km/h after `seconds`
    topSpeed: (seconds = 60) => straightRun(PRESETS.heron, seconds).speed * 3.6,
    zeroToHundred: () => straightRun(PRESETS.heron, 60, 100 / 3.6).time,
    clip: { play: playClip },
  },
};
