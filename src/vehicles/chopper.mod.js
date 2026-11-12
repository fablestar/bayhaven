// The news helicopter: BHTV 6's Mayfly (plan/bible/catalog/vehicles-other.md, plan/bible/systems/heat.md).
// From heat 3 it arrives inside 8 s and holds 60 m up and 45 m out, behind and to the left; it circles
// when you stop. Its spotlight is a 14 m disc that trails you by 0.4 s: while the disc is on you it is a
// camera, so viewers do not drain (above about 70 km/h in a straight line you outrun the disc; a car wash
// hides you from it). It stays with a car it can see within 150 m, but one that keeps out of its light for 12 s
// with no deputy watching is lost (there is no bridge or garage to hide under yet): then it sweeps the last place it had you.
// At heat 4 a second one in the Sheriff's colours flies ahead and lower (not on `low`); it only watches.
// The helicopter cam (V, a pad's Back button, or the on-screen button): the view moves to the helicopter,
// 35 degrees wide, tagged CHOPPER CAM. After 2 s under cover the chase camera returns.
// Public object: { active (the cam is on), list, count, cam(on), sees(x, z), disc, numbers, stats }.
// Emits chopper:arrived { n }, chopper:left { n }, chopper:cam { on }.
import * as THREE from 'three';
import { MeshBuilder, glowTexture } from '../gfx/builder.js';

export const CHOPPER = { from: 3, second: 4, up: 60, out: 45, up2: 40, ahead: 55, top: 70, spawn: 380, scale: 0.94, rotor: 6, disc: 14, trail: 0.4, beam: 110,
  lost: 3, reach: 150, shake: 12, sweep: 60, fov: 35, cover: 2, chop: 12, lowpass: 900, hear: 260 };
const WHITE = 0xfdf6ea, VIOLET = 0xb46bff, GLASS = 0x1d2a3a, INK = 0x23233a, TEAL = 0x14b0a5, PINK = 0xff4fa8;
const piece = (B, L, W, H, fwd, y0, col, x = 0) => B.box(x, y0 + H / 2, fwd, W, H, L, col);

// the Dragonfly sheet plus the Mayfly's spotlight and camera ball; `boom` is the livery's colour
function bodyGeometry(boom, six) {
  const B = new MeshBuilder({ size: 256 });
  piece(B, 2.2, 1.8, 1.5, 0.8, 0.5, WHITE);                            // pod
  piece(B, 1.0, 1.82, 0.75, 1.42, 1.2, GLASS);                         // glass, from the nose back
  piece(B, 0.8, 1.6, 1.1, 2.3, 0.5, GLASS);                            // nose
  piece(B, 2.8, 0.35, 0.35, -1.7, 1.3, boom);                          // boom
  piece(B, 0.5, 0.08, 1.2, -3.25, 1.2, boom);                          // fin
  piece(B, 0.1, 0.05, 0.8, -3.35, 1.5, INK, 0.1);                      // tail rotor
  piece(B, 0.3, 0.3, 0.5, 0.75, 2, INK);                               // hub
  for (const s of [0.7, -0.7]) { piece(B, 2.6, 0.1, 0.1, 0.8, 0, INK, s); piece(B, 0.1, 0.08, 0.4, 0.15, 0.1, INK, s); piece(B, 0.1, 0.08, 0.4, 1.45, 0.1, INK, s); }
  piece(B, 0.4, 0.4, 0.3, 1.5, 0.2, 0xfff3b0);                         // spotlight
  piece(B, 0.4, 0.4, 0.4, 2.5, 0.3, INK);                              // camera ball
  for (const s of [1, -1]) {
    const x = s * 0.91, f = (o) => 0.35 + o * s;
    if (six) {                                                         // a 6 on the pod
      for (const y of [0.7, 0.98, 1.26]) piece(B, 0.42, 0.02, 0.09, f(0), y, boom, x);
      piece(B, 0.09, 0.02, 0.65, f(-0.165), 0.7, boom, x); piece(B, 0.09, 0.02, 0.36, f(0.165), 0.7, boom, x);
    } else { piece(B, 1.6, 0.02, 0.45, 0.8, 0.55, TEAL, x); piece(B, 2.1, 0.02, 0.09, 0.8, 1.02, PINK, x); }
  }
  return B.build();
}
function rotorGeometry() {
  const B = new MeshBuilder({ size: 64 });
  B.box(0, 0, 0, 8, 0.05, 0.25, INK); B.box(0, 0, 0, 0.25, 0.05, 8, INK);
  return B.build();
}

let chopper = null;
export default {
  name: 'chopper', order: 27, renderOrder: 62, needs: ['heat', 'cops', 'vehicles', 'map'],
  init(ctx) {
    const m = ctx.modules, S = ctx.state, ev = ctx.events, heat = m.heat, cam = ctx.camera;
    if (!heat) return { disabled: true, active: false, list: [], count: 0, sees: () => false };
    const lam = new THREE.MeshLambertMaterial({ vertexColors: true }), rotorGeo = rotorGeometry();
    const list = [], stats = { arrived: 0, left: 0, camOn: 0, coverOffs: 0, seenSteps: 0, soundOn: false, gain: 0 };
    const disc = { x: 0, z: 0, y: 0, on: false, opacity: 0, r: CHOPPER.disc / 2 };
    const spot = { x: 0, z: 0 };                     // where the helicopters think the player is
    let tracking = false, darkT = 0, jumpT = 0, px = 0, pz = 0;
    let time = 0, camOn = false, coverT = 0, hinted = false, lastPad = false, tagRect = null, tagDrawn = false;

    // the spotlight: a disc on the ground and a faint cone down to it
    const flat = new THREE.PlaneGeometry(1, 1); flat.rotateX(-Math.PI / 2);
    const discMesh = new THREE.Mesh(flat, new THREE.MeshBasicMaterial({ map: glowTexture(), color: 0xfff3c4, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    const cone = new THREE.ConeGeometry(CHOPPER.disc / 2, 1, 12, 1, true); cone.translate(0, -0.5, 0);
    const beamMesh = new THREE.Mesh(cone, new THREE.MeshBasicMaterial({ color: 0xfff3c4, transparent: true, opacity: 0.1, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false, fog: false }));
    discMesh.scale.set(CHOPPER.disc * 1.5, 1, CHOPPER.disc * 1.5); discMesh.renderOrder = 4; beamMesh.renderOrder = 5;
    for (const mesh of [discMesh, beamMesh]) { mesh.frustumCulled = false; mesh.visible = false; ctx.scene.add(mesh); }
    const DOWN = new THREE.Vector3(0, -1, 0), dir = new THREE.Vector3(), look = new THREE.Vector3();

    function make(n) {
      const group = new THREE.Group(), body = new THREE.Mesh(bodyGeometry(n === 1 ? VIOLET : TEAL, n === 1), lam), rotor = new THREE.Mesh(rotorGeo, lam);
      rotor.position.set(0, 2.5, 0.8); group.add(body, rotor); group.scale.setScalar(CHOPPER.scale);
      body.frustumCulled = rotor.frustumCulled = false;
      ctx.scene.add(group);
      const p = S.player, a = p.h + Math.PI + (n === 1 ? 0.5 : -2.4);
      const h = { n, group, rotor, x: p.x + Math.sin(a) * CHOPPER.spawn, z: p.z + Math.cos(a) * CHOPPER.spawn, y: 95, h: a + Math.PI, vx: 0, vz: 0, state: 'in', sees: false, orbit: a, d: CHOPPER.spawn, t: 0,
        tris: (body.geometry.index ? body.geometry.index.count : body.geometry.attributes.position.count) / 3 };
      list.push(h);
      return h;
    }
    function drop(h) { ctx.scene.remove(h.group); h.group.children[0].geometry.dispose(); list.splice(list.indexOf(h), 1); stats.left++; ev.emit('chopper:left', { n: h.n }); }
    const flags = () => (S.mission.flags && S.mission.flags.heat) || {};
    const grounded = () => { const w = S.weather.kind; return w === 'storm' || w === 'hurricane' || !!flags().noHelicopter; };
    const wantCount = () => { const L = S.heat.level; return L < CHOPPER.from || grounded() ? 0 : L >= CHOPPER.second && ctx.quality.level !== 'low' ? 2 : 1; };
    const onScene = () => list.length > 0 && list[0].n === 1 && (list[0].state === 'on' || list[0].state === 'search');
    // is this spot under the disc of a helicopter that is on the scene?
    const sees = (x, z) => onScene() && disc.on && Math.hypot(x - disc.x, z - disc.z) < disc.r + 1.2 && !(heat.hidden && heat.hidden());

    // the deputies' sight now includes the camera in the sky (the heat module asks modules.cops.sees)
    if (m.cops && m.cops.sees) { const base = m.cops.sees; m.cops.sees = (x, z, range) => base(x, z, range) || sees(x, z); }

    function setCam(on) {
      on = !!on && S.heat.level >= CHOPPER.from && onScene();
      if (on === camOn) return camOn;
      camOn = on; coverT = 0;
      if (on) stats.camOn++;
      ev.emit('chopper:cam', { on });
      return camOn;
    }
    const toggle = () => setCam(!camOn);
    window.addEventListener('keydown', (e) => { if (e.code === 'KeyV' && !e.repeat && !e.ctrlKey && !e.metaKey && !(e.target && /INPUT|TEXTAREA/.test(e.target.tagName))) toggle(); });
    // the button: the way in on a phone, and the tag while the view is on
    const btn = document.createElement('button');
    btn.id = 'chopper-cam'; btn.type = 'button'; btn.textContent = 'Chopper cam';
    btn.style.cssText = 'position:fixed;left:50%;top:calc(env(safe-area-inset-top, 0px) + 64px);transform:translateX(-50%);z-index:30;display:none;padding:6px 14px;border-radius:999px;border:2px solid #fff;'
      + 'background:rgba(20,12,44,0.72);color:#fff;font:700 13px "Trebuchet MS",Arial,sans-serif;letter-spacing:0.06em;cursor:pointer;touch-action:manipulation';
    btn.addEventListener('click', (e) => { e.preventDefault(); btn.blur(); toggle(); });
    document.body.appendChild(btn);

    // the rotor: noise chopped at 12 Hz through a 900 Hz low-pass
    let snd = null;
    function sound(level) {
      const a = m.audio && m.audio.ctx;
      if (!a || !m.audio.bus) return;
      if (!snd) {
        if (level <= 0) return;
        const buf = a.createBuffer(1, a.sampleRate, a.sampleRate), d = buf.getChannelData(0);
        let s = 12345; for (let i = 0; i < d.length; i++) { s = (s * 1664525 + 1013904223) >>> 0; d[i] = s / 2147483648 - 1; }
        const src = a.createBufferSource(); src.buffer = buf; src.loop = true;
        const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = CHOPPER.lowpass;
        const chop = a.createGain(); chop.gain.value = 0.55;
        const lfo = a.createOscillator(); lfo.type = 'square'; lfo.frequency.value = CHOPPER.chop;
        const depth = a.createGain(); depth.gain.value = 0.45;
        const out = a.createGain(); out.gain.value = 0;
        lfo.connect(depth); depth.connect(chop.gain); src.connect(lp); lp.connect(chop); chop.connect(out); out.connect(m.audio.bus('effects'));
        src.start(); lfo.start();
        snd = { out }; stats.soundOn = true;
      }
      snd.out.gain.setTargetAtTime(level, a.currentTime, 0.15);
    }

    function fly(h, dt) {
      const p = S.player, known = tracking, last = spot;
      const fx = Math.sin(p.h), fz = Math.cos(p.h), speed = Math.abs(p.kmh || 0) / 3.6;
      let tx, tz, ty;
      h.t += dt;
      if (h.state === 'out') { tx = h.x + Math.sin(h.h) * 400; tz = h.z + Math.cos(h.h) * 400; ty = 140; }
      else if (known) {
        if (h.state === 'search') h.state = 'on';
        if (h.n === 1) {
          // behind and to the left; it circles when you stop
          if (speed < 2) { h.orbit += 0.3 * dt; tx = p.x + Math.sin(h.orbit) * CHOPPER.out; tz = p.z + Math.cos(h.orbit) * CHOPPER.out; }
          else { h.orbit = Math.atan2(-fx * 0.8 + fz * 0.6, -fz * 0.8 - fx * 0.6); tx = p.x - fx * 36 + fz * 27; tz = p.z - fz * 36 - fx * 27; }
          ty = CHOPPER.up;
        } else { tx = p.x + fx * CHOPPER.ahead - fz * 20; tz = p.z + fz * CHOPPER.ahead + fx * 20; ty = CHOPPER.up2; }
      } else {
        // nobody knows where you are: a loop round the last place you were seen
        if (h.state === 'on') h.state = 'search';
        h.orbit += 0.35 * dt * (h.n === 1 ? 1 : -1);
        tx = last.x + Math.sin(h.orbit) * CHOPPER.sweep; tz = last.z + Math.cos(h.orbit) * CHOPPER.sweep; ty = h.n === 1 ? CHOPPER.up : CHOPPER.up2;
      }
      const dx = tx - h.x, dz = tz - h.z, dist = Math.hypot(dx, dz), want = Math.min(CHOPPER.top, dist * 1.3), k = Math.min(1, dt * 2.5);
      h.vx += ((dist > 0.01 ? dx / dist * want : 0) - h.vx) * k; h.vz += ((dist > 0.01 ? dz / dist * want : 0) - h.vz) * k;
      h.x += h.vx * dt; h.z += h.vz * dt;
      const ground = m.map.heightAt ? m.map.heightAt(h.x, h.z) : 0;
      h.y += (ground + ty - h.y) * Math.min(1, dt * 0.8);
      h.d = Math.hypot(p.x - h.x, p.z - h.z);
      if (h.state === 'in' && h.d < 85) { h.state = 'on'; stats.arrived++; ev.emit('chopper:arrived', { n: h.n, seconds: h.t }); }
      // nose: along its flight while it is moving, else at the player
      const sp = Math.hypot(h.vx, h.vz), aim = sp > 6 && h.state !== 'on' ? Math.atan2(h.vx, h.vz) : Math.atan2((known ? p.x : last.x) - h.x, (known ? p.z : last.z) - h.z);
      h.h += Math.atan2(Math.sin(aim - h.h), Math.cos(aim - h.h)) * Math.min(1, dt * 3);
      h.speed = sp;
      if (h.state === 'out' && (h.d > 500 || h.t > 12)) drop(h);
    }

    chopper = {
      list, numbers: CHOPPER, stats, disc, sees, cam: setCam, toggle,
      get active() { return camOn; },
      get count() { return list.length; },
      get onScene() { return onScene(); },
      update(dt) {
        time += dt;
        const p = S.player, L = S.heat.level, want = wantCount();
        // who should be up
        for (let n = 1; n <= 2; n++) {
          const h = list.find((q) => q.n === n);
          if (n <= want && !h && !heat.hold) make(n);
          else if (n <= want && !h && heat.hold) { const s = make(n); s.x = p.x - Math.sin(p.h) * 36 + Math.cos(p.h) * 27; s.z = p.z - Math.cos(p.h) * 36 - Math.sin(p.h) * 27; s.y = CHOPPER.up; }     // a clip starts with it overhead
          else if (n > want && h && h.state !== 'out') { h.state = 'out'; h.t = 0; }
          else if (n <= want && h && h.state === 'out') h.state = 'in';
        }
        list.sort((a, b) => a.n - b.n);
        // do they know where the player is? A deputy does (or did 3 s ago), or the first helicopter has them within 150 m
        // and they have not kept out of its light for 12 s
        const lead = list[0] && list[0].n === 1 && list[0].state !== 'out' && list[0].state !== 'in' ? list[0] : null;
        darkT = lead && lead.sees ? 0 : darkT + dt;
        const byDeputy = L > 0 && (S.heat.seen || S.heat.unseenT < CHOPPER.lost), wasTracking = tracking;
        const byAir = !!lead && wasTracking && lead.d < CHOPPER.reach && darkT < CHOPPER.shake && !(heat.hidden && heat.hidden());
        // a player who is suddenly somewhere else (booked, a hospital, a mission's cut) is not followed there
        if (Math.hypot(p.x - px, p.z - pz) > 60) jumpT = 0.6;
        px = p.x; pz = p.z; jumpT -= dt;
        tracking = L > 0 && jumpT <= 0 && (byDeputy || byAir);
        if (tracking && (S.heat.seen || byAir)) { spot.x = p.x; spot.z = p.z; } else if (!wasTracking && L > 0 && !list.length) { spot.x = S.heat.last.x; spot.z = S.heat.last.z; }
        if (L === 0) { tracking = false; darkT = 0; }
        for (const h of list.slice()) fly(h, dt);
        // the disc: trails the player by 0.4 s while the helicopter knows where they are; sweeps while it searches
        const h1 = list[0] && list[0].n === 1 ? list[0] : null;
        disc.on = !!h1 && (h1.state === 'on' || h1.state === 'search');
        if (disc.on) {
          let gx = p.x, gz = p.z;
          if (h1.state === 'search') { const a = h1.orbit * 1.7, r = 38 * Math.abs(Math.sin(h1.orbit * 0.9)); gx = spot.x + Math.sin(a) * r; gz = spot.z + Math.cos(a) * r; }      // a rose: out and back through the middle
          const k = 1 - Math.exp(-dt / CHOPPER.trail);
          disc.x += (gx - disc.x) * k; disc.z += (gz - disc.z) * k;
          const bx = disc.x - h1.x, bz = disc.z - h1.z, bl = Math.hypot(bx, bz);
          if (bl > CHOPPER.beam) { disc.x = h1.x + bx / bl * CHOPPER.beam; disc.z = h1.z + bz / bl * CHOPPER.beam; }      // as far as the lamp reaches
          disc.y = (m.map.heightAt ? m.map.heightAt(disc.x, disc.z) : 0) + 0.09;
          h1.sees = sees(p.x, p.z);
          if (h1.sees) stats.seenSteps++;
        } else if (h1) { disc.x = p.x; disc.z = p.z; h1.sees = false; }
        // the cam: off when the helicopter goes, or after 2 s under cover
        if (camOn) {
          if (!onScene() || L < CHOPPER.from) setCam(false);
          else { coverT = heat.hidden && heat.hidden() ? coverT + dt : 0; if (coverT >= CHOPPER.cover) { stats.coverOffs++; setCam(false); } }
        }
        const pads = navigator.getGamepads ? navigator.getGamepads() : null, pad = pads && pads[0], back = !!(pad && pad.buttons[8] && pad.buttons[8].pressed);
        if (back && !lastPad) toggle();
        lastPad = back;
        if (onScene() && !hinted && !(m.hud && m.hud.clip)) { hinted = true; ev.emit('ui:toast', { text: 'The news helicopter is up. V for the chopper cam', seconds: 5 }); }
        if (L === 0) hinted = false;
        // the rotor, by how near the closest one is (always close when you are looking through its camera)
        let near = 1e9; for (const h of list) near = Math.min(near, Math.hypot(h.d, h.y - (p.y || 0)));
        stats.gain = list.length ? (camOn ? 0.5 : 0.55 * Math.pow(Math.max(0, 1 - near / CHOPPER.hear), 1.5)) : 0;
        sound(stats.gain);
      },
      render(dt, night) {
        const p = S.player;
        for (const h of list) {
          h.group.position.set(h.x, h.y, h.z); h.group.rotation.set(0, h.h, 0);
          h.rotor.rotation.y = time * CHOPPER.rotor * Math.PI * 2;
        }
        const h1 = list[0] && list[0].n === 1 ? list[0] : null, lit = disc.on && h1;
        discMesh.visible = beamMesh.visible = !!lit;
        if (lit) {
          disc.opacity = 0.05 + 0.6 * Math.min(1, night * 1.4);
          discMesh.position.set(disc.x, disc.y, disc.z); discMesh.material.opacity = disc.opacity;
          const sx = h1.x + Math.sin(h1.h) * 1.4, sy = h1.y + 0.2, sz = h1.z + Math.cos(h1.h) * 1.4;
          dir.set(disc.x - sx, disc.y - sy, disc.z - sz); const len = dir.length(); dir.multiplyScalar(1 / len);
          beamMesh.position.set(sx, sy, sz); beamMesh.quaternion.setFromUnitVectors(DOWN, dir); beamMesh.scale.set(1, len, 1);
          beamMesh.material.opacity = 0.02 + 0.1 * Math.min(1, night * 1.4);
          beamMesh.visible = !camOn;                       // from inside the beam it would only fog the picture
        }
        // the helicopter's camera: from under its nose, at the player, 35 degrees wide
        if (camOn && h1) {
          cam.position.set(h1.x + Math.sin(h1.h) * 2.4, h1.y - 0.4, h1.z + Math.cos(h1.h) * 2.4);
          look.set(p.x, (p.y || 0) + 1, p.z); cam.lookAt(look);
          if (Math.abs(cam.fov - CHOPPER.fov) > 0.01) { cam.fov = CHOPPER.fov; cam.updateProjectionMatrix(); }
        }
        // the button and the tag
        const show = onScene() && S.heat.level >= CHOPPER.from && !(m.hud && m.hud.clip && !camOn);
        const label = camOn ? '● CHOPPER CAM' : 'Chopper cam';
        if (btn.textContent !== label) { btn.textContent = label; btn.style.background = camOn ? 'rgba(255,45,85,0.92)' : 'rgba(20,12,44,0.72)'; }
        const disp = show ? 'block' : 'none';
        if (btn.style.display !== disp) btn.style.display = disp;
        tagOnHud(camOn);
      },
    };
    // the tag on the HUD canvas as well, so a clip or a photo carries it
    function tagOnHud(on) {
      const hud = m.hud; if (!hud || !hud.canvas || (!on && !tagDrawn)) return;
      const g = hud.canvas.getContext('2d'), dpr = hud.canvas.width / window.innerWidth, W = window.innerWidth, ins = hud.insets || { t: 0 };
      g.save(); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (tagRect) g.clearRect(tagRect.x - 2, tagRect.y - 2, tagRect.w + 4, tagRect.h + 4);
      tagDrawn = on;
      if (on) {
        g.font = '700 13px "Trebuchet MS", Arial, sans-serif'; g.textBaseline = 'middle'; g.textAlign = 'center';
        const text = 'CHOPPER CAM', w = Math.ceil(g.measureText(text).width) + 44, h = 26;
        tagRect = { x: Math.round(W / 2 - w / 2), y: (ins.t || 0) + 64 + 3, w, h };
        g.fillStyle = 'rgba(255,45,85,0.92)'; g.beginPath(); g.roundRect(tagRect.x, tagRect.y, w, h, 13); g.fill();
        g.fillStyle = '#fff'; if (Math.floor(time * 2) % 2 === 0) { g.beginPath(); g.arc(tagRect.x + 15, tagRect.y + h / 2, 4, 0, Math.PI * 2); g.fill(); }
        g.fillText(text, tagRect.x + w / 2 + 8, tagRect.y + h / 2 + 1);
      }
      g.restore();
    }
    ev.on('game:reset', () => { for (const h of list.slice()) drop(h); setCam(false); tracking = false; darkT = 0; });
    ev.on('heat:changed', (e) => { if (e.from === 0) { spot.x = S.heat.last.x; spot.z = S.heat.last.z; darkT = 0; } });
    ev.on('heat:cleared', () => setCam(false));
    ctx.test.chopper = () => ({ count: list.length, tracking, darkT, spot: { ...spot }, cam: camOn, onScene: onScene(), stats: { ...stats }, disc: { ...disc }, tag: tagDrawn, button: btn.style.display !== 'none' ? btn.textContent : '',
      fov: cam.fov, camY: cam.position.y, calls: list.length * 2 + (discMesh.visible ? 1 : 0) + (beamMesh.visible ? 1 : 0), triangles: list.reduce((n, h) => n + h.tris + 24, 0) + (discMesh.visible ? 2 : 0) + (beamMesh.visible ? 24 : 0),
      list: list.map((h) => ({ n: h.n, x: h.x, y: h.y, z: h.z, h: h.h, state: h.state, sees: h.sees, d: h.d, speed: h.speed, t: h.t })) });
    ctx.test.chopperCam = (on) => (on === undefined ? toggle() : setCam(on));
    return chopper;
  },
  update(dt) { if (chopper && chopper.update) chopper.update(dt); },
  render(alpha, ctx) { if (chopper && chopper.render) chopper.render(ctx.loop.dt, ctx.modules.sky ? ctx.modules.sky.night : 0); },
};
