// Sky, sun, sea and light. One clock (the hour of the day) drives all of it:
// the sky dome colours, the sun's position, the lamps on the scene, the fog and the ocean.

import * as THREE from 'three';

// Colour keys through the day. Everything in between is blended.
const NIGHT = { top: 0x050818, hor: 0x1d1650, sun: 0xff6a8a, sunI: 0, hemiSky: 0x4a55b0, hemiGnd: 0x221638, hemiI: 0.95,
  cloud: 0x1c1a40, glowCol: 0x3a1a6a, glow: 0.3, night: 1, deep: 0x050a26, shallow: 0x122a55 };
const DAY = { top: 0x1f7ae0, hor: 0xa6dcf7, sun: 0xfff1d6, sunI: 2.6, hemiSky: 0xcfeaff, hemiGnd: 0x9a8a78, hemiI: 1.9,
  cloud: 0xffffff, glowCol: 0xffffff, glow: 0.15, night: 0, deep: 0x0e5fa8, shallow: 0x35c8c8 };
const KEYS = [
  { h: 0, ...NIGHT },
  { h: 5.0, ...NIGHT },
  { h: 6.3, top: 0x3558a8, hor: 0xffb59a, sun: 0xffb080, sunI: 1.2, hemiSky: 0x9fb4e8, hemiGnd: 0x6a5560, hemiI: 1.3,
    cloud: 0xffc9b8, glowCol: 0xff9a6a, glow: 0.8, night: 0.25, deep: 0x1c4a7a, shallow: 0x4aa0b0 },
  { h: 8, ...DAY },
  { h: 16.8, ...DAY },
  { h: 18.4, top: 0x3a6fd0, hor: 0xffcf8f, sun: 0xffb866, sunI: 2.3, hemiSky: 0xd9c4f0, hemiGnd: 0x9a7460, hemiI: 1.6,
    cloud: 0xffe2c2, glowCol: 0xff9a3a, glow: 0.7, night: 0.05, deep: 0x1a5a9a, shallow: 0x55b8b0 },
  { h: 19.5, top: 0x3b2f8f, hor: 0xff7a5a, sun: 0xff6a30, sunI: 1.5, hemiSky: 0xb884e0, hemiGnd: 0x7a4660, hemiI: 1.3,
    cloud: 0xff7aa8, glowCol: 0xff3a6a, glow: 1.0, night: 0.45, deep: 0x2a2a7a, shallow: 0x9a5a9a },
  { h: 20.4, top: 0x15145a, hor: 0xc04a8a, sun: 0xff3f7a, sunI: 0, hemiSky: 0x7a60d0, hemiGnd: 0x3a2450, hemiI: 1.1,
    cloud: 0x6a3a80, glowCol: 0xff3a8a, glow: 0.8, night: 0.85, deep: 0x10124a, shallow: 0x4a2a6a },
  { h: 21.6, ...NIGHT },
  { h: 24, ...NIGHT },
];
const COLOR_FIELDS = ['top', 'hor', 'sun', 'hemiSky', 'hemiGnd', 'cloud', 'glowCol', 'deep', 'shallow'];
const NUM_FIELDS = ['sunI', 'hemiI', 'glow', 'night'];
for (const k of KEYS) for (const f of COLOR_FIELDS) k[f] = new THREE.Color(k[f]);

const SKY_VERT = /* glsl */`
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const SKY_FRAG = /* glsl */`
precision highp float;
uniform vec3 uTop, uHorizon, uSunDir, uSunCol, uCloudCol, uGlowCol;
uniform float uNight, uTime, uGlow;
varying vec3 vDir;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
void main() {
  vec3 d = normalize(vDir);
  float h = max(d.y, 0.0);
  vec3 col = mix(uHorizon, uTop, 1.0 - exp(-h * 3.2));

  // warm band along the horizon on the side where the sun is
  float sd = max(dot(d, uSunDir), 0.0);
  float az = max(dot(normalize(d.xz), normalize(uSunDir.xz)), 0.0);
  col += uGlowCol * uGlow * pow(az, 3.0) * exp(-h * 5.0) * 0.55;

  // the sun: a soft halo and a disc that gets bigger as it sinks
  col += uSunCol * (pow(sd, 24.0) * 0.28 + pow(sd, 180.0) * 0.5);
  float low = 1.0 - clamp(uSunDir.y * 2.2, 0.0, 1.0);
  float edge = mix(0.9992, 0.9972, low);
  float disc = smoothstep(edge, edge + 0.0003, sd);
  vec3 discCol = mix(uSunCol * 1.3 + 0.35, mix(vec3(1.0, 0.25, 0.5), vec3(1.0, 0.9, 0.45), smoothstep(-0.03, 0.05, d.y - uSunDir.y)), low);
  col = mix(col, discCol, disc);

  // stars
  vec2 sp = d.xz / (abs(d.y) + 0.35) * 70.0;
  float star = step(0.986, hash(floor(sp))) * smoothstep(0.3, 0.0, length(fract(sp) - 0.5));
  col += star * uNight * uNight * smoothstep(0.02, 0.25, d.y) * (0.5 + 0.5 * hash(floor(sp) + 3.0));

  // drifting clouds
  vec2 uv = d.xz / (d.y + 0.14) * 1.25 + vec2(uTime * 0.012, uTime * 0.004);
  float n = noise(uv) * 0.6 + noise(uv * 2.3 + 7.0) * 0.3 + noise(uv * 5.1 + 2.0) * 0.1;
  float c = smoothstep(0.5, 0.78, n) * smoothstep(0.015, 0.2, d.y);
  vec3 cc = mix(uCloudCol, uCloudCol * 0.7 + uSunCol * 0.45, pow(sd, 3.0));
  col = mix(col, cc, c * 0.85);

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

const SEA_VERT = /* glsl */`
varying vec3 vW;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const SEA_FRAG = /* glsl */`
precision highp float;
uniform vec3 uDeep, uShallow, uHorizon, uSunDir, uSunCol;
uniform float uTime, uNight;
varying vec3 vW;
void main() {
  vec3 toCam = cameraPosition - vW;
  float dist = length(toCam);
  vec3 V = toCam / dist;
  float shore = smoothstep(150.0, 82.0, vW.z);
  vec3 col = mix(uDeep, uShallow, shore * 0.85);

  // little ripples tilt the surface, which makes the sun sparkle in a long path
  float w1 = sin(vW.x * 0.33 + uTime * 1.1 + sin(vW.z * 0.21) * 1.5);
  float w2 = sin(vW.z * 0.47 - uTime * 1.4 + vW.x * 0.13);
  float w3 = sin(vW.x * 1.3 - vW.z * 0.9 + uTime * 2.0);
  vec3 N = normalize(vec3(w1 * 0.05 + w3 * 0.03, 1.0, w2 * 0.07 + w3 * 0.03));
  float fres = pow(1.0 - max(dot(V, N), 0.0), 3.0);
  col = mix(col, uHorizon, fres * 0.65);
  vec3 R = reflect(-V, N);
  col += uSunCol * pow(max(dot(R, uSunDir), 0.0), 70.0) * 0.9;

  // foam: lines rolling in, and a white edge where the sea meets the sand
  float roll = sin(vW.z * 0.42 + uTime * 0.9 + sin(vW.x * 0.07) * 1.8);
  float foam = smoothstep(0.93, 1.0, roll) * smoothstep(128.0, 86.0, vW.z) * 0.7;
  float lap = sin(uTime * 0.8 + vW.x * 0.11) * 1.1;
  foam = max(foam, smoothstep(86.0 + lap, 83.0 + lap, vW.z));
  col = mix(col, mix(vec3(1.0), uHorizon, 0.25) * (1.0 - uNight * 0.55), foam);

  col = mix(col, uHorizon, smoothstep(160.0, 800.0, dist));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

export function createSky(scene) {
  const skyU = {
    uTop: { value: new THREE.Color() }, uHorizon: { value: new THREE.Color() },
    uSunDir: { value: new THREE.Vector3(0, 1, 0) }, uSunCol: { value: new THREE.Color() },
    uCloudCol: { value: new THREE.Color() }, uGlowCol: { value: new THREE.Color() },
    uNight: { value: 0 }, uTime: { value: 0 }, uGlow: { value: 0 },
  };
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(1500, 32, 16),
    new THREE.ShaderMaterial({ uniforms: skyU, vertexShader: SKY_VERT, fragmentShader: SKY_FRAG,
      side: THREE.BackSide, depthWrite: false, fog: false }));
  dome.renderOrder = -10;
  dome.frustumCulled = false;
  scene.add(dome);

  const seaU = {
    uDeep: { value: new THREE.Color() }, uShallow: { value: new THREE.Color() },
    uHorizon: skyU.uHorizon, uSunDir: skyU.uSunDir, uSunCol: skyU.uSunCol,
    uTime: skyU.uTime, uNight: skyU.uNight,
  };
  const seaGeo = new THREE.PlaneGeometry(3600, 1700);
  seaGeo.rotateX(-Math.PI / 2);
  const sea = new THREE.Mesh(seaGeo,
    new THREE.ShaderMaterial({ uniforms: seaU, vertexShader: SEA_VERT, fragmentShader: SEA_FRAG, fog: false }));
  sea.position.set(0, -0.35, 76 + 850);
  scene.add(sea);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 1);
  const sun = new THREE.DirectionalLight(0xffffff, 1);
  const moon = new THREE.DirectionalLight(0x8f9fff, 0);
  moon.position.set(-40, 80, -30);
  scene.add(hemi, sun, sun.target, moon);
  scene.fog = new THREE.Fog(0xffffff, 150, 560);

  const cur = { night: 0 };
  for (const f of COLOR_FIELDS) cur[f] = new THREE.Color();
  const sunDir = skyU.uSunDir.value;

  function update(hour, time, camera) {
    let i = 0;
    while (i < KEYS.length - 2 && hour >= KEYS[i + 1].h) i++;
    const a = KEYS[i], b = KEYS[i + 1];
    let t = (hour - a.h) / (b.h - a.h);
    t = t * t * (3 - 2 * t);
    for (const f of COLOR_FIELDS) cur[f].lerpColors(a[f], b[f], t);
    for (const f of NUM_FIELDS) cur[f] = a[f] + (b[f] - a[f]) * t;

    // the sun rises behind the city and sets over the sea
    const ang = Math.max(-0.2, Math.min(Math.PI + 0.2, ((hour - 6) / 14) * Math.PI));
    const c = -Math.cos(ang);
    sunDir.set(c * 0.5, Math.sin(ang), c * 0.87).normalize();

    skyU.uTop.value.copy(cur.top); skyU.uHorizon.value.copy(cur.hor);
    skyU.uSunCol.value.copy(cur.sun); skyU.uCloudCol.value.copy(cur.cloud);
    skyU.uGlowCol.value.copy(cur.glowCol);
    skyU.uGlow.value = cur.glow; skyU.uNight.value = cur.night; skyU.uTime.value = time;
    seaU.uDeep.value.copy(cur.deep); seaU.uShallow.value.copy(cur.shallow);

    hemi.color.copy(cur.hemiSky); hemi.groundColor.copy(cur.hemiGnd); hemi.intensity = cur.hemiI;
    sun.color.copy(cur.sun); sun.intensity = cur.sunI;
    sun.position.set(sunDir.x, Math.max(sunDir.y, 0.08), sunDir.z).multiplyScalar(100);
    moon.intensity = cur.night * 0.55;
    scene.fog.color.copy(cur.hor);

    dome.position.copy(camera.position);
    sky.night = cur.night;
  }

  const sky = { update, night: 0, sunDir };
  return sky;
}
