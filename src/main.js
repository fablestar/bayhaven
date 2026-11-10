// Bayhaven: day 1. Boot the renderer, build the city, drive the car, turn the sky.

import * as THREE from 'three';
import { createInput } from './input.js';
import { createEngineSound } from './audio.js';
import { createWorld } from './world.js';
import { createCar } from './car.js';
import { createSky } from './sky.js';

const canvas = document.getElementById('game');
const coarse = matchMedia('(pointer: coarse)').matches; // phones and tablets
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !coarse, powerPreference: 'high-performance' });
let pixelRatio = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
renderer.setPixelRatio(pixelRatio);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.3, 4000);

const sky = createSky(scene);
const world = createWorld(scene);
const car = createCar(scene, world);
Object.assign(car, world.spawn);

const audio = createEngineSound();
const hint = document.getElementById('hint');
const clockEl = document.getElementById('clock');
const kmhEl = document.getElementById('kmh');

// ---------- the clock ----------
// Starts mid-afternoon and rolls on to sunset, dusk and night, then round again.
const params = new URLSearchParams(location.search);
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

const input = createInput({
  onFirstInput() { audio.start(); hint.style.opacity = 0; },
  onKey(code) {
    if (code === 'KeyT') skipTime();
    if (code === 'KeyM') { audio.start(); audio.toggleMute(); }
    if (code === 'KeyR') { Object.assign(car, world.spawn, { vx: 0, vz: 0 }); }
  },
});

// ---------- chase camera ----------
let camYaw = car.h, portrait = false;
const camPos = new THREE.Vector3(), look = new THREE.Vector3();
let camReady = false;

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  portrait = h > w;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

function updateCamera(dt) {
  let d = car.h - camYaw;
  d = Math.atan2(Math.sin(d), Math.cos(d));
  camYaw += d * (1 - Math.exp(-dt * 4));
  const ratio = Math.min(1, Math.abs(car.speed) / car.maxSpeed);
  const dist = (portrait ? 9.5 : 7.4) + ratio * 1.6, height = portrait ? 3.6 : 2.9;
  const bx = -Math.sin(camYaw), bz = -Math.cos(camYaw);
  // pull the camera in if it would end up inside a building
  for (const k of [1, 0.8, 0.62, 0.45, 0.3, 0.15]) {
    camPos.set(car.x + bx * dist * k, car.y + height + (1 - k) * 1.2, car.z + bz * dist * k);
    if (!world.insideBuilding(camPos.x, camPos.y, camPos.z, 0.7)) break;
  }
  if (!camReady) { camera.position.copy(camPos); camReady = true; }
  else camera.position.lerp(camPos, 1 - Math.exp(-dt * 9));
  look.set(car.x + Math.sin(car.h) * 3, car.y + 1.25, car.z + Math.cos(car.h) * 3);
  camera.lookAt(look);
  const fov = (portrait ? 78 : 60) + ratio * 10;
  if (Math.abs(fov - camera.fov) > 0.05) { camera.fov = fov; camera.updateProjectionMatrix(); }
}

// ---------- main loop ----------
let last = performance.now(), slowFrames = 0, frames = 0, lastClock = '';
function frame(now) {
  requestAnimationFrame(frame);
  const raw = (now - last) / 1000;
  last = now;
  const dt = Math.min(raw, 0.05);
  time += dt;
  hour = (hour + dt * hoursPerSecond(hour)) % 24;

  car.update(dt, input, sky.night);
  updateCamera(dt);
  sky.update(hour, time, camera);
  world.update(sky.night);
  audio.update(Math.min(1, Math.abs(car.speed) / car.maxSpeed), Math.abs(input.throttle));
  renderer.render(scene, camera);

  // HUD
  kmhEl.textContent = Math.round(Math.abs(car.speed) * 3.6);
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
}
requestAnimationFrame(frame);

// handy for testing from the console
window.__game = { car, world, sky, renderer, setHour: (h) => { hour = h; } };
