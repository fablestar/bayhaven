// Photo mode, the phone's Camera app (plan/bible/systems/clips-photo.md, "Photo mode").
// Time stops while you frame. A free camera orbits the lead (or the vehicle they are in) inside the bible's limits,
// with three filters, the HUD on or off, and a selfie flip. A shot draws the view once at the photo-area size, at
// pixel ratio 1, in the same task as the copy (so preserveDrawingBuffer stays off), filters it and frames it as a
// postcard reading "Greetings from Bayhaven · Day N". Emits photo:taken { x, z, district, targets }.
// Keys: drag to orbit, WASD to pan, wheel for field of view, Q and E to roll, H for the HUD, F for the next filter,
// V for the selfie flip, Space to shoot, Esc to leave.
import { FILTERS, cardSize, applyFilter, drawBadge, frameCard } from './postcard.js';

export const LIMITS = { dist: [1.5, 25], height: [0.3, 20], pan: 10, tilt: 80 * Math.PI / 180, roll: 30 * Math.PI / 180, fov: [20, 100], wall: 0.7 };
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };

export function createCamera(ctx, { onExit }) {
  const S = ctx.state, ev = ctx.events, m = ctx.modules, cam = ctx.camera;
  const o = { on: false, yaw: 0, pitch: 0.25, dist: 6, panX: 0, panZ: 0, roll: 0, fov: 60, hud: false, filter: 0, selfie: false };
  const stats = { shots: 0, saved: 0, lastMs: 0 }, keys = new Set();
  let wasScale = 1, wasFov = 60, wasOrbit = null, last = null, lastT = 0, busy = false;

  const ui = el('div'); ui.id = 'photo-ui';
  const flash = el('div', 'photo-flash'), bar = el('div', 'photo-bar'), shown = el('div', 'photo-shown');
  const btn = (text, fn, cls) => { const b = el('button', cls || '', text); b.type = 'button'; b.addEventListener('click', (e) => { e.stopPropagation(); fn(); }); bar.appendChild(b); return b; };
  const bBack = btn('Back', () => exit()), bFilter = btn('', () => nextFilter()), bHud = btn('', () => setHud(!o.hud)), bFlip = btn('Flip', () => flip());
  const bShoot = btn('Take photo', () => shoot().then(show), 'go');
  ui.appendChild(flash); ui.appendChild(bar); ui.appendChild(shown); document.body.appendChild(ui);
  void bBack; void bFlip; void bShoot;
  function labels() { bFilter.textContent = 'Filter: ' + FILTERS[o.filter].name; bHud.textContent = o.hud ? 'HUD: on' : 'HUD: off'; document.body.classList.toggle('photo-nohud', o.on && !o.hud); }
  function nextFilter() { o.filter = (o.filter + 1) % FILTERS.length; labels(); }
  function setHud(on) { o.hud = !!on; labels(); }

  // the subject: the lead, or the vehicle they are in
  function subject() {
    const p = S.player, car = p.mode !== 'foot' && m.vehicles && m.vehicles.player;
    const y = (m.map && m.map.heightAt ? m.map.heightAt(p.x, p.z, p.level || 0) : 0) || 0;
    return { x: p.x, z: p.z, ground: Math.max(y, p.y || 0), up: car ? 0.9 : 1.2, h: car ? car.h : p.h };
  }
  function bound() {
    o.dist = clamp(o.dist, LIMITS.dist[0], LIMITS.dist[1]); o.pitch = clamp(o.pitch, -LIMITS.tilt, LIMITS.tilt);
    o.roll = clamp(o.roll, -LIMITS.roll, LIMITS.roll); o.fov = clamp(o.fov, LIMITS.fov[0], LIMITS.fov[1]);
    const d = Math.hypot(o.panX, o.panZ); if (d > LIMITS.pan) { o.panX *= LIMITS.pan / d; o.panZ *= LIMITS.pan / d; }
  }
  // put the game's camera where the orbit says, inside the limits and outside every building box
  function place() {
    bound();
    const s = subject(), tx = s.x + o.panX, tz = s.z + o.panZ, ty = s.ground + s.up;
    const cp = Math.cos(o.pitch); let dist = o.dist;
    const dx = Math.sin(o.yaw) * cp, dz = Math.cos(o.yaw) * cp, dy = Math.sin(o.pitch);
    const col = m.collide;
    if (col && col.ray) {
      const reach = dist * cp + LIMITS.wall, hit = reach > 0.1 && col.ray(tx, tz, tx + Math.sin(o.yaw) * reach, tz + Math.cos(o.yaw) * reach, undefined, Math.max(0.3, s.up + dy * dist));
      if (hit) dist = Math.max(0.4, (Math.hypot(hit.x - tx, hit.z - tz) - LIMITS.wall) / Math.max(0.05, cp));
    }
    const y = clamp(ty + dy * dist, s.ground + LIMITS.height[0], s.ground + LIMITS.height[1]);
    cam.position.set(tx + dx * dist, y, tz + dz * dist);
    cam.up.set(0, 1, 0); cam.lookAt(tx, ty, tz); cam.rotateZ(o.roll);
    if (cam.fov !== o.fov) { cam.fov = o.fov; cam.updateProjectionMatrix(); }
    o.at = { x: cam.position.x, y, z: cam.position.z, dist: Math.hypot(cam.position.x - tx, y - ty, cam.position.z - tz), ground: s.ground };
  }

  function enter() {
    if (o.on) return true;
    const s = subject(), p = cam.position;
    o.on = true; wasScale = ctx.loop.timeScale; ctx.loop.timeScale = 0; wasFov = cam.fov;
    o.yaw = Math.atan2(p.x - s.x, p.z - s.z); o.dist = clamp(Math.hypot(p.x - s.x, p.z - s.z), 3, LIMITS.dist[1]);
    o.pitch = clamp(Math.atan2(p.y - s.ground - s.up, o.dist), 0.05, 1); o.panX = o.panZ = 0; o.roll = 0; o.fov = clamp(wasFov, LIMITS.fov[0], LIMITS.fov[1]); o.selfie = false; o.hud = false;
    keys.clear(); lastT = performance.now();
    document.body.classList.add('photo-mode'); ui.classList.add('on'); shown.classList.remove('on'); labels();
    ev.emit('photo:mode', { on: true });
    return true;
  }
  function exit() {
    if (!o.on) return;
    o.on = false; ctx.loop.timeScale = wasScale;
    cam.fov = wasFov; cam.up.set(0, 1, 0); cam.updateProjectionMatrix();
    if (m.camera && m.camera.snap) m.camera.snap();
    document.body.classList.remove('photo-mode', 'photo-nohud'); ui.classList.remove('on');
    ev.emit('photo:mode', { on: false });
    if (onExit) onExit();
  }
  // the selfie flip: the camera comes round to face the lead from arm's length; again puts it back
  function flip() {
    if (!o.selfie) { wasOrbit = { yaw: o.yaw, pitch: o.pitch, dist: o.dist, fov: o.fov }; Object.assign(o, { yaw: subject().h, pitch: 0.12, dist: S.player.mode === 'foot' ? 1.8 : 5, panX: 0, panZ: 0, fov: 70, selfie: true }); }
    else { Object.assign(o, wasOrbit, { selfie: false }); }
  }

  // ---- what is in frame ----
  function targets() {
    const out = [], v = cam.position.clone(), seen = (id, x, y, z, far, edge) => {
      if (Math.max(0, Math.hypot(x - cam.position.x, z - cam.position.z) - edge) > far) return;
      v.set(x, y, z).project(cam);
      if (v.z < 1 && Math.abs(v.x) <= 0.6 && Math.abs(v.y) <= 0.6 && !out.includes(id)) out.push(id);
    };
    cam.updateMatrixWorld(); cam.matrixWorldInverse.copy(cam.matrixWorld).invert();
    for (const zn of (m.map && m.map.zones) || []) for (const id in zn.landmarks || {}) { const l = zn.landmarks[id]; seen(id, l.x, Math.min(8, (l.h || 4) / 2), l.z, 60, Math.max(l.w || 0, l.d || 0) / 2); }
    const want = m.missions && m.missions.view && m.missions.view.photo;
    if (want) seen(want.id, want.x, want.y, want.z, 60, 0);
    return out;
  }

  // ---- the shot ----
  function shoot(opts = {}) {
    if (busy) return Promise.resolve(last);
    busy = true;
    const t0 = performance.now(), r = ctx.renderer, hud = opts.hud != null ? !!opts.hud : o.hud;
    const filter = FILTERS.find((f) => f.id === opts.filter) || FILTERS[o.filter];
    const size = cardSize(ctx.quality.level, window.innerHeight > window.innerWidth), day = S.build.day;
    const photo = el('canvas'); photo.width = size.pw; photo.height = size.ph;
    const g = photo.getContext('2d', { willReadFrequently: true }), ratio = r.getPixelRatio(), aspect = cam.aspect;
    if (o.on) place();
    r.setPixelRatio(1); r.setSize(size.pw, size.ph, false); cam.aspect = size.pw / size.ph; cam.updateProjectionMatrix();
    const inFrame = targets();
    r.render(ctx.scene, cam);
    g.drawImage(r.domElement, 0, 0, size.pw, size.ph);
    r.setPixelRatio(ratio); r.setSize(window.innerWidth, window.innerHeight, false); cam.aspect = aspect; cam.updateProjectionMatrix();
    r.render(ctx.scene, cam);                                         // the screen gets its own picture back at once
    applyFilter(g, size.pw, size.ph, filter.id);
    if (hud && m.hud && m.hud.canvas) g.drawImage(m.hud.canvas, 0, 0, size.pw, size.ph); else drawBadge(g, size.pw, size.ph, day);
    const zone = m.map && S.world.district && m.map.zone(S.world.district), district = zone ? zone.name : 'Bayhaven';
    const h = S.clock.hour, hh = String(Math.floor(h)).padStart(2, '0'), mm = String(Math.floor((h % 1) * 60)).padStart(2, '0');
    const card = frameCard(photo, size, { day, district, time: `${hh}:${mm}` });
    const name = `bayhaven-day-${day}-${district.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${hh}${mm}.png`;
    stats.shots++;
    ev.emit('photo:taken', { x: S.player.x, z: S.player.z, district: S.world.district || null, targets: inFrame, filter: filter.id, hud });
    if (o.on && !S.settings.reduceMotion) { flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); }
    return new Promise((resolve) => card.toBlob((blob) => {
      busy = false; stats.lastMs = performance.now() - t0;
      last = { width: size.W, height: size.H, bytes: blob ? blob.size : 0, badge: true, framed: true, greeting: `Greetings from Bayhaven · Day ${day}`, targets: inFrame, filter: filter.id, hud, name, blob, card,
        photo: { x: size.px, y: size.py, w: size.pw, h: size.ph } };
      resolve(last);
    }, 'image/png'));
  }
  function save() {
    if (!last || !last.blob) { ev.emit('ui:toast', { text: 'Could not save. Try again from the Camera app.', seconds: 4, tone: 'bad' }); return false; }
    const a = el('a'), url = URL.createObjectURL(last.blob); a.download = last.name; a.href = url; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000); stats.saved++;
    return true;
  }
  // after a shot: the card, with Save and Again under it
  function show(shot) {
    if (!o.on || !shot) return;
    shown.textContent = '';
    const img = el('img'); img.alt = shot.greeting; img.src = URL.createObjectURL(shot.blob); img.onload = () => URL.revokeObjectURL(img.src);
    const row = el('div', 'photo-row'), mk = (text, fn, cls) => { const b = el('button', cls || '', text); b.type = 'button'; b.addEventListener('click', (e) => { e.stopPropagation(); fn(); }); row.appendChild(b); return b; };
    const s = mk('Save photo', () => { if (save()) s.textContent = 'Saved'; }, 'go'); mk('Another', () => shown.classList.remove('on'));
    shown.appendChild(img); shown.appendChild(row); shown.classList.add('on');
  }

  // ---- hands ----
  let drag = null;
  ui.addEventListener('pointerdown', (e) => { if (e.target !== ui) return; drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; ui.setPointerCapture(e.pointerId); });
  ui.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    o.yaw -= (e.clientX - drag.x) * 0.0044; o.pitch += (e.clientY - drag.y) * 0.0044;       // a quarter of a degree a pixel
    drag.x = e.clientX; drag.y = e.clientY;
  });
  const drop = () => { drag = null; };
  ui.addEventListener('pointerup', drop); ui.addEventListener('pointercancel', drop);
  ui.addEventListener('wheel', (e) => { e.preventDefault(); if (e.shiftKey) o.dist *= e.deltaY > 0 ? 1.1 : 0.9; else o.fov += e.deltaY > 0 ? 4 : -4; }, { passive: false });
  window.addEventListener('keydown', (e) => {
    if (!o.on) return;
    e.stopImmediatePropagation(); e.preventDefault();
    if (e.repeat) return;
    keys.add(e.code);
    if (e.code === 'Escape') { if (shown.classList.contains('on')) shown.classList.remove('on'); else exit(); }
    else if (e.code === 'KeyH') setHud(!o.hud);
    else if (e.code === 'KeyF') nextFilter();
    else if (e.code === 'KeyV') flip();
    else if (e.code === 'Space' || e.code === 'Enter') shoot().then(show);
  }, true);
  window.addEventListener('keyup', (e) => { if (o.on) { keys.delete(e.code); e.stopImmediatePropagation(); } }, true);

  return {
    o, stats, LIMITS, filters: FILTERS, enter, exit, shoot, save, flip, setHud, nextFilter, place,
    get on() { return o.on; }, get last() { return last; },
    // once a frame, after the game's own camera has had its say
    render() {
      if (!o.on) return;
      const now = performance.now(), dt = Math.min(0.1, (now - lastT) / 1000); lastT = now;
      const fx = (keys.has('KeyD') ? 1 : 0) - (keys.has('KeyA') ? 1 : 0), fz = (keys.has('KeyS') ? 1 : 0) - (keys.has('KeyW') ? 1 : 0);
      if (fx || fz) { const c = Math.cos(o.yaw), s = Math.sin(o.yaw); o.panX += (fx * c + fz * s) * 6 * dt; o.panZ += (-fx * s + fz * c) * 6 * dt; }
      o.roll += ((keys.has('KeyE') ? 1 : 0) - (keys.has('KeyQ') ? 1 : 0)) * dt * 0.8;
      if (keys.has('ArrowUp')) o.dist -= 8 * dt; if (keys.has('ArrowDown')) o.dist += 8 * dt;
      place();
    },
    info: () => ({ on: o.on, yaw: o.yaw, pitch: o.pitch, dist: o.dist, pan: Math.hypot(o.panX, o.panZ), roll: o.roll, fov: o.fov, hud: o.hud, filter: FILTERS[o.filter].id, selfie: o.selfie,
      at: o.at ? { ...o.at } : null, timeScale: ctx.loop.timeScale, shown: shown.classList.contains('on'), shots: stats.shots, saved: stats.saved, lastMs: stats.lastMs }),
  };
}
