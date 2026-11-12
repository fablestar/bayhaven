// Combat on foot (plan/04-systems.md section 8, plan/bible/systems/combat-stealth.md): the seven weapons, a
// three-slot quick bar, lock-on, lethal damage for bystanders, guards and deputies, and three pickup spots.
// Owns state.combat = { slot, weapon, ammo, spare, lock, reloading, inv }.
// Public object: { give(id, spare), select(slot), cycle(), spawn(x, z, h, { kind, hostile }), guards, hold { aim, fire },
//   hurt(target, dmg, ranged, { weapon, knock }), pickups, drops, stats, numbers }.
// Emits weapon:fired { weapon, x, z, by, melee }, combat:hit { target, id, dmg, weapon, health }, combat:down { who, by },
//   combat:lock { id }, combat:slot { slot, weapon }, weapon:picked { weapon }, weapon:broke { weapon }.
// Files: combat-guards.js (the enemies' brain), combat-draw.js (one draw call), combat-flare.js, combat-sound.js.
import { WEAPONS, SLOTS, WHO, COMBAT, PICKUPS, damageAt } from '../content/weapons.js';
import { createGuards, segBox, segPoint } from './combat-guards.js';
import { createCombatDraw } from './combat-draw.js';
import { createFlares } from './combat-flare.js';
import { createCombatSound } from './combat-sound.js';

const RAD = Math.PI / 180, BLOOD = [0.45, 0.02, 0.04], BLOOD2 = [0.25, 0.01, 0.02], TRACE = [1, 0.95, 0.7];
const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
let api = null, step = null, paint = null;

export default {
  name: 'combat', order: 33, needs: ['player', 'collide', 'map', 'vehicles', 'health'],
  init(ctx) {
    const S = ctx.state, ev = ctx.events, m = ctx.modules, A = ctx.input.actions, q = ctx.quality;
    const tier = () => (q.level === 'low' ? 0 : q.level === 'medium' ? 1 : 2);
    let seed = 20261112; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const inv = { hand: 'fists', sidearm: null, long: null }, mag = {}, spare = {};
    const C = S.combat = { slot: 'hand', weapon: 'fists', ammo: 0, spare: 0, lock: null, reloading: false, inv };
    const stats = { fired: 0, swings: 0, hits: 0, downs: 0, reloads: 0, locks: 0, picked: 0, broke: 0, bystanders: 0 };
    const hold = { aim: false, fire: false }, deps = new Map(), fallen = [], drops = [], pickups = [], cars = [], near = [], people = [], scratch = [];
    let time = 0, cool = 0, reloadT = 0, combo = 0, comboT = 9, noodle = 0, flamingo = 0, spray = 0, swingT = 0, raiseT = 0, lock = null, lockBlocked = 0, lastLock = null, placed = false;
    const draw = createCombatDraw(ctx.scene), sound = createCombatSound(ctx);
    const P = { x: 0, z: 0, speed: 0, sprinting: false, down: false, inCar: false, car: null };
    const me = () => m.player.me, W = () => WEAPONS[inv[C.slot] || 'fists'];
    const wall = (x0, z0, x1, z1) => { const h = m.collide.ray(x0, z0, x1, z1, 0, 1.2); return !!h && h.t < 0.97; };
    const typeOf = (o) => (o.unit ? 'deputy' : o.K ? 'ped' : 'guard');
    function inView(x, z) { const c = ctx.camera.position, y = m.camera ? m.camera.yaw : 0, dx = x - c.x, dz = z - c.z; return dx * dx + dz * dz < 160 * 160 && dx * Math.sin(y) + dz * Math.cos(y) > 0; }

    const guards = createGuards({ collide: m.collide, map: m.map, events: ev, rnd, fx: m.fx, player: P, inView,
      cars: () => cars, peds: () => near, cap: () => COMBAT.hostile[tier()], lying: () => COMBAT.lying[tier()],
      say: (who, text) => ev.emit('ui:toast', { kind: 'subtitle', who, text, seconds: 2.5 }),
      hurtPlayer(dmg, o) {
        if (P.inCar) { if (m.damage && m.damage.hurt) m.damage.hurt(P.car, dmg * COMBAT.vehicleShare, { shot: true }); }
        else m.health.hurt(dmg, o);
        ev.emit('combat:hit', { target: 'player', by: o.by, id: o.id, weapon: o.weapon, damage: dmg * COMBAT.playerTakes, applied: true, x: o.x, z: o.z });
      } });
    const flares = createFlares({ fx: () => m.fx, collide: m.collide, map: m.map, events: ev, rnd, peds: () => m.peds, people: () => people,
      hurt: (o, dmg) => hurt(o, dmg, true, { weapon: 'flare' }), sound: (n, x, z) => sound.play(n, x, z) });

    // ---- the quick bar ----
    function sync() { const w = W(); C.weapon = w.id; C.ammo = w.holds ? mag[w.id] || 0 : 0; C.spare = spare[w.id] || 0; C.reloading = reloadT > 0; C.lock = lock ? lock.id : null; }
    function keep() { const c = S.chars && S.chars[S.player.id]; if (c) { c.weapons = {}; for (const s of SLOTS) if (inv[s] && inv[s] !== 'fists') c.weapons[inv[s]] = spare[inv[s]] || 0; } }
    function select(slot) { if (!inv[slot] || slot === C.slot) return false; C.slot = slot; reloadT = 0; cool = Math.max(cool, 0.2); spray = 0; sync(); ev.emit('combat:slot', { slot, weapon: inv[slot] }); return true; }
    function give(id, rounds) {
      const w = WEAPONS[id]; if (!w) return null;
      const had = inv[w.slot] === id;
      inv[w.slot] = id;
      if (w.holds) { if (!had || !mag[id]) mag[id] = w.holds; spare[id] = Math.min(w.most, (had ? spare[id] || 0 : 0) + (rounds === undefined ? w.pack : rounds)); }
      if (id === 'flamingo') flamingo = 0;
      C.slot = w.slot; reloadT = 0; stats.picked++; sync(); keep();
      ev.emit('weapon:picked', { weapon: id }); ev.emit('combat:slot', { slot: w.slot, weapon: id });
      return { ...C, inv: { ...inv } };
    }

    // ---- damage (the bible's hurt()) ----
    function splash(x, y, z) {
      if (!m.fx) return;
      if (S.settings.blood === false) { m.fx.puff(x, y, z); return; }
      for (let i = 0, n = 3 + Math.floor(rnd() * 3); i < n; i++) m.fx.bit(x, y, z, (rnd() - 0.5) * 3, 1 + rnd() * 2, (rnd() - 0.5) * 3, { life: 0.7, c0: BLOOD, c1: BLOOD2, grav: 9, len: 0.09, w: 0.07 });
    }
    function hurt(t, dmg, ranged, by = {}) {
      const type = typeOf(t);
      if (t.animal || !(dmg > 0)) return 0;
      if (type === 'ped' && t.health === undefined) t.health = WHO.bystander.health;
      if (by.weapon === 'noodle') dmg = Math.min(dmg, t.health - 1);
      const soak = ranged ? Math.min(t.vest || 0, dmg * COMBAT.vestSoak) : 0;
      if (soak) t.vest -= soak;
      t.health -= dmg - soak; stats.hits++;
      const y = (t.y || 0) + 1.1, crime = (c) => { if (m.heat && m.heat.crime) m.heat.crime(c, t.x, t.z, { weapon: by.weapon }); };
      if (by.weapon !== 'noodle') splash(t.x, y, t.z);
      ev.emit('combat:hit', { target: type, id: t.id, kind: t.kind, dmg, weapon: by.weapon, health: Math.max(0, t.health), x: t.x, z: t.z });
      if (t.health <= 0) {
        t.health = 0; stats.downs++;
        const who = { id: t.id, kind: type === 'ped' ? 'bystander' : t.kind, x: t.x, z: t.z };
        if (type === 'guard') { guards.down(t); drop(t.x, t.z, t.weapon); crime('kill'); }
        else if (type === 'deputy') { t.unit.deputy.down = true; fallen.push({ x: t.x, y: t.y || 0, z: t.z, h: t.unit.deputy.h, pose: 'down', look: WHO.deputy, t: 0 }); drop(t.x, t.z, 'pistol'); crime('killcop'); }
        else { stats.bystanders++; if (m.peds.blast) m.peds.blast(t.x, t.z, 0.4); crime('kill'); }      // the people module lays them down for good
        if (S.settings.blood !== false && tier() > 0 && m.fx) m.fx.scorch(t.x, t.z, 0.4, 20);
        ev.emit('combat:down', { who, by: { player: true, weapon: by.weapon } });
        if (lock === t) lock = null;
        return dmg;
      }
      if (type === 'guard') guards.onHit(t, { floor: by.knock, stagger: by.stagger || (dmg <= 10 ? 0.3 : 0.6) });
      else if (type === 'deputy') { t.attacked = true; t.unit.deputy.fireT = Math.max(t.unit.deputy.fireT || 0, by.knock ? 2 : by.weapon === 'noodle' ? 1 : 0.6); if (!ranged && by.weapon !== 'noodle') crime('punchcop'); }
      else if (by.weapon === 'noodle') { if (m.peds.trigger) m.peds.trigger(3, 'stunt', t.x, t.z); }       // nobody runs from a noodle; they film it
      else {
        crime(ranged ? 'hurt' : 'punch');
        if (by.knock && m.peds.blast) { const k = t.health, a = Math.atan2(P.x - t.x, P.z - t.z); m.peds.blast(t.x + Math.sin(a) * 0.9, t.z + Math.cos(a) * 0.9, 1); t.health = k; }
        else if (m.peds.scare) m.peds.scare(t, P.x, P.z);
      }
      return dmg;
    }
    function drop(x, z, id) { const w = WEAPONS[id]; if (w && w.holds) drops.push({ x, z, y: m.map.heightAt(x, z), weapon: id, rounds: w.holds, t: COMBAT.pickupBack }); }

    // ---- who is where ----
    function gather() {
      const p = S.player, b = me();
      Object.assign(P, { x: p.x, z: p.z, speed: p.speed, sprinting: !!(b && b.sprinting), down: m.health.down, inCar: p.mode !== 'foot', car: m.vehicles.player });
      cars.length = 0;
      if (m.vehicles.near) for (const v of m.vehicles.near(P.x, P.z, 70, scratch)) if (v !== P.car) cars.push(v);
      cars.push(P.car);
      near.length = 0; people.length = 0;
      if (m.peds && m.peds.near) m.peds.near(P.x, P.z, 70, near);
      for (let i = near.length - 1; i >= 0; i--) if (near[i].state === 'down' || near[i].rope || near[i].gone) near.splice(i, 1);
      for (const g of guards.list) if (g.state !== 'down') people.push(g);
      const units = (m.cops && m.cops.units) || [];
      for (const u of units) {
        const d = u.deputy; if (!d || !d.out || d.down) continue;
        let r = deps.get(u.id); if (!r) { r = { id: 'd' + u.id, kind: 'deputy', unit: u, health: WHO.deputy.health, max: WHO.deputy.health, vest: WHO.deputy.vest, attacked: false }; deps.set(u.id, r); }
        r.x = d.x; r.z = d.z; r.y = d.y || 0; r.hostile = S.heat.level >= 3 || r.attacked; r.attacking = d.state === 'cover';
        people.push(r);
      }
      if (deps.size > units.length + 4) for (const id of deps.keys()) if (!units.find((u) => u.id === id)) deps.delete(id);
      for (const o of near) people.push(o);
    }

    // ---- lock-on ----
    const foe = (o) => (o.unit ? o.hostile : !o.K && o.hostile && o.state !== 'down');
    function scores() {
      const w = W(), range = w.range ? Math.min(w.range, COMBAT.lockMost) : COMBAT.lockMelee, cone = (A.touch ? COMBAT.coneTouch : COMBAT.coneMouse) * RAD, yaw = m.camera ? m.camera.yaw : me().h, out = [];
      for (const o of people) {
        if (!foe(o)) continue;
        const d = Math.hypot(o.x - P.x, o.z - P.z), ang = Math.abs(wrap(Math.atan2(o.x - P.x, o.z - P.z) - yaw));
        if (d > range || ang > cone || wall(P.x, P.z, o.x, o.z)) continue;
        out.push({ o, id: o.id, d, angle: ang, score: d + 12 * ang - (o.attacking ? 8 : 0) - (o === lastLock ? 4 : 0) });
      }
      return out.sort((a, b) => a.score - b.score);
    }
    function setLock(o) { if (o === lock) return; lock = o; lockBlocked = 0; if (o) { lastLock = o; stats.locks++; } ev.emit('combat:lock', { id: o ? o.id : null }); }
    function locking(dt, aiming) {
      if (!aiming) { if (lock) setLock(null); return; }
      if (lock) {
        const w = W(), range = (w.range ? Math.min(w.range, COMBAT.lockMost) : COMBAT.lockMelee) * COMBAT.lockFar, d = Math.hypot(lock.x - P.x, lock.z - P.z);
        lockBlocked = wall(P.x, P.z, lock.x, lock.z) ? lockBlocked + dt : 0;
        if (lock.health <= 0 || d > range || lockBlocked > COMBAT.lockLose || !people.includes(lock)) setLock(null);
      }
      if (!lock) { const s = scores(); if (s.length) setLock(s[0].o); }
    }
    function cycle() { const s = scores(); if (s.length < 2) return false; const i = s.findIndex((r) => r.o === lock); setLock(s[(i + 1) % s.length].o); return true; }

    // ---- firing ----
    function cast(ox, oz, a, range) {
      const ux = Math.sin(a), uz = Math.cos(a), ex = ox + ux * range, ez = oz + uz * range;
      let t = 1, what = null, kind = 'none';
      const w = m.collide.ray(ox, oz, ex, ez, 0, 1.0); if (w && w.t < t) { t = w.t; kind = 'wall'; }
      for (const v of cars) { const s = segBox(ox, oz, ex, ez, v); if (s >= 0 && s < t && (s > 0 || v !== P.car)) { t = s; what = v; kind = 'car'; } }
      for (const o of people) { const sp = segPoint(ox, oz, ex, ez, o.x, o.z); if (sp.d < 0.42 && sp.t < t && sp.t * range > 0.25) { t = sp.t; what = o; kind = 'person'; } }
      return { t, d: t * range, x: ox + ux * range * t, z: oz + uz * range * t, what, kind, ux, uz };
    }
    function round(a, w, dmgOf, tally) {
      const b = me(), ox = P.x + Math.sin(a) * 0.5, oz = P.z + Math.cos(a) * 0.5, y = b.y + 1.35, hit = cast(ox, oz, a, w.range);
      if (m.fx) {
        m.fx.bit(ox, y, oz, hit.ux * 260, 0, hit.uz * 260, { life: Math.min(0.08, hit.d / 260 + 0.01), c0: TRACE, c1: TRACE, grav: 0, len: 0.4, w: 0.03 });
        if (hit.kind === 'wall') m.fx.puff(hit.x, 1.2, hit.z); else if (hit.kind === 'car') m.fx.sparks(hit.x, 1.0, hit.z, -hit.ux, -hit.uz, 3);
      }
      if (hit.kind === 'car' && m.damage && m.damage.hurt) m.damage.hurt(hit.what, dmgOf(hit.d) * COMBAT.vehicleShare * (w.id === 'shotgun' ? 0.5 / 0.3 : 1), { shot: true });
      if (hit.kind === 'person') { const row = tally.get(hit.what) || { dmg: 0, d: hit.d }; row.dmg += dmgOf(hit.d); tally.set(hit.what, row); }
    }
    function shootGun(w) {
      const b = me(), a0 = lock ? Math.atan2(lock.x - P.x, lock.z - P.z) : m.camera ? m.camera.yaw : b.h, tally = new Map();
      b.h = a0; raiseT = 0.5; mag[w.id]--; stats.fired++; cool = Math.max(cool, -1 / 60) + w.every;       // what the last step overshot is carried, so the rate is exact
      if (w.lob) flares.fire(P.x + Math.sin(a0) * 0.5, b.y + 1.4, P.z + Math.cos(a0) * 0.5, a0, w);
      else if (w.pellets) for (let i = 0; i < w.pellets; i++) round(a0 + ((i + 0.5) / w.pellets - 0.5) * w.cone * RAD, w, (d) => damageAt(w.id, d) / w.pellets, tally);
      else {
        const still = COMBAT.lockSpread[P.sprinting ? 2 : P.speed > 0.5 ? 1 : 0], open = w.spreadMax ? w.spread + (w.spreadMax - w.spread) * Math.min(1, spray) : w.spread;
        const spreadDeg = lock ? still + (w.spreadMax ? open - w.spread : 0) : open;
        round(a0 + (rnd() * 2 - 1) * spreadDeg * RAD, w, (d) => damageAt(w.id, d), tally);
      }
      for (const [o, row] of tally) hurt(o, row.dmg, true, { weapon: w.id, knock: !!w.knockWithin && row.d <= w.knockWithin, dist: row.d });
      sound.play(w.sound, P.x, P.z);
      ev.emit('weapon:fired', { weapon: w.id, x: P.x, z: P.z, by: 'player' });
      if (mag[w.id] <= 0) reload();
    }
    function reload() { const w = W(); if (!w.holds || reloadT > 0 || mag[w.id] >= w.holds || !(spare[w.id] > 0)) return false; reloadT = w.reload; stats.reloads++; sound.play('click', P.x, P.z); return true; }
    function reloading(dt, firing) {
      const w = W();
      if (w.perShell && firing && mag[w.id] > 0 && cool <= 0) { reloadT = 0; return; }        // firing cuts a shotgun's reload short
      reloadT -= dt;
      if (reloadT > 0) return;
      const n = w.perShell ? 1 : Math.min(w.holds - mag[w.id], spare[w.id]);
      mag[w.id] += n; spare[w.id] -= n; reloadT = 0; keep();
      if (w.perShell && mag[w.id] < w.holds && spare[w.id] > 0) { reloadT = w.reload; sound.play('click', P.x, P.z); }
    }
    function swing(w) {
      const b = me(); cool = w.every; swingT = 0.25; stats.swings++;
      // the nearest person inside the reach and 75 degrees of where he faces; the locked one first
      let best = lock && Math.hypot(lock.x - P.x, lock.z - P.z) <= w.reach + 0.4 ? lock : null, bd = 1e9;
      if (!best) for (const o of people) { const d = Math.hypot(o.x - P.x, o.z - P.z); if (d <= w.reach + 0.4 && d < bd && Math.abs(wrap(Math.atan2(o.x - P.x, o.z - P.z) - b.h)) < 75 * RAD) { bd = d; best = o; } }
      ev.emit('weapon:fired', { weapon: w.id, x: P.x, z: P.z, by: 'player', melee: true });
      if (!best) { sound.play(w.sound, P.x, P.z, {}); return; }
      b.h = Math.atan2(best.x - P.x, best.z - P.z);
      let knock = !!w.knock, stagger = w.stagger || 0;
      if (w.combo) { if (comboT > 1) combo = 0; combo++; comboT = 0; if (combo >= w.combo) { knock = true; combo = 0; } }
      if (w.knockEvery) { noodle++; if (noodle % w.knockEvery === 0) knock = true; }
      sound.play(w.sound, P.x, P.z, { heavy: knock });
      hurt(best, w.damage, false, { weapon: w.id, knock, stagger });
      if (w.breaksAfter && ++flamingo >= w.breaksAfter) {         // it snaps: two legs, which count as fists
        inv.hand = 'fists'; flamingo = 0; stats.broke++; sound.play('snap', P.x, P.z);
        if (m.fx) for (let i = 0; i < 6; i++) m.fx.debris(P.x + Math.sin(b.h), b.y + 1.1, P.z + Math.cos(b.h), { sx: 0.08, sy: 0.05, sz: 0.08, color: 0xff9eb5, vx: (rnd() - 0.5) * 4, vy: 2 + rnd() * 2, vz: (rnd() - 0.5) * 4, life: 3 });
        ev.emit('weapon:broke', { weapon: 'flamingo' }); ev.emit('ui:toast', { text: 'The flamingo snapped', seconds: 2.5 }); keep();
      }
    }

    // ---- pickups: three marked spots until shops exist ----
    function place() {
      placed = true;
      const sp = m.map.spawn || { x: 0, z: 0 }, free = (x, z) => m.collide.circle(x, z, 1.1, 0, scratch) === 0 && (!m.map.isLand || m.map.isLand(x, z)) && (!m.map.surfaceAt || m.map.surfaceAt(x, z) !== 'road');
      const spot = (x, z) => { for (let r = 0; r <= 14; r += 1.75) for (let k = 0; k < 8; k++) { const px = x + Math.cos(k * 0.785) * r, pz = z + Math.sin(k * 0.785) * r; if (free(px, pz)) return { x: px, z: pz }; } return { x, z }; };
      for (const def of PICKUPS) {
        const at = spot(sp.x + def.dx, sp.z + def.dz), pk = { ...def, x: at.x, z: at.z, y: m.map.heightAt(at.x, at.z), ready: true, t: 0, kits: def.gives.map((id) => WEAPONS[id].boxes) };
        pickups.push(pk);
        if (m.minimap && m.minimap.addBlip) m.minimap.addBlip({ id: 'pickup:' + def.id, x: pk.x, z: pk.z, icon: 'dot', colour: '#29e6ff', label: def.label });
      }
      const h = pickups[pickups.length - 1]; if (h) flares.crate(h.x + 3.2, h.z + 1.5);
    }
    function collect(dt) {
      for (const pk of pickups) {
        if (!pk.ready) { pk.t -= dt; if (pk.t <= 0) pk.ready = true; continue; }
        if (P.inCar || Math.hypot(pk.x - P.x, pk.z - P.z) > 1.3) continue;
        pk.ready = false; pk.t = COMBAT.pickupBack;
        for (const id of pk.gives) give(id);
        if (pk.vest) m.health.vest();
        sound.play('pickup', pk.x, pk.z);
        ev.emit('ui:toast', { text: 'Picked up: ' + pk.gives.map((id, i) => (i ? WEAPONS[id].name.toLowerCase() : WEAPONS[id].name)).join(', ') + (pk.vest ? ', life vest' : ''), seconds: 3, tone: 'gain' });
      }
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]; d.t -= dt;
        if (!P.inCar && Math.hypot(d.x - P.x, d.z - P.z) < 1.1) { give(d.weapon, d.rounds); sound.play('pickup', d.x, d.z); ev.emit('ui:toast', { text: 'Picked up: ' + WEAPONS[d.weapon].name, seconds: 2, tone: 'gain' }); drops.splice(i, 1); }
        else if (d.t <= 0) drops.splice(i, 1);
      }
    }

    ev.once('game:ready', () => { if (!placed) place(); });
    ev.on('player:hurt', (e) => { sound.play('hurt', S.player.x, S.player.z); if (m.fx && m.fx.shake && !S.settings.reduceMotion) m.fx.shake(0.05); });
    ev.on('game:reset', () => { guards.clear(); flares.reset(); fallen.length = 0; drops.length = 0; setLock(null); for (const pk of pickups) pk.ready = true; for (const u of (m.cops && m.cops.units) || []) if (u.deputy) u.deputy.down = false; deps.clear(); });

    step = (dt) => {
      time += dt; cool -= dt; comboT += dt; if (swingT > 0) swingT -= dt; if (raiseT > 0) raiseT -= dt;
      gather();
      const b = me(), can = !P.inCar && !P.down && !S.player.act && b && !(b.depth > 0.6) && !(S.ui && S.ui.paused);
      const aiming = can && (A.aim || hold.aim), firing = can && (A.fire || hold.fire), w = W();
      locking(dt, aiming);
      if (lock && can) b.h = Math.atan2(lock.x - P.x, lock.z - P.z);
      if (aiming) raiseT = 0.3;
      spray = firing && w.auto ? spray + dt : Math.max(0, spray - dt * 2);
      if (reloadT > 0) reloading(dt, firing);
      if (firing && cool <= 0 && reloadT <= 0) {
        if (!w.holds) swing(w);
        else if (mag[w.id] > 0) shootGun(w);
        else if (!reload()) { cool = 0.4; sound.play('click', P.x, P.z); }
      }
      guards.step(dt, P);
      flares.step(dt);
      for (let i = fallen.length - 1; i >= 0; i--) { const f = fallen[i]; f.t += dt; if ((f.t > COMBAT.downFor && !inView(f.x, f.z)) || f.t > COMBAT.downSeen) fallen.splice(i, 1); }
      collect(dt);
      sync();
    };
    paint = () => {
      draw.begin();
      for (const g of guards.list) { g.gun = WEAPONS[g.weapon].boxes; draw.figure(g); }
      for (const f of fallen) draw.figure(f);
      const b = me(), w = W();
      if (!P.inCar && b && w.boxes && !P.down) draw.held(b.x, b.y, b.z, b.h, w.boxes, raiseT > 0 ? 1 : 0, swingT > 0 ? Math.sin((1 - swingT / 0.25) * Math.PI) * 1.1 : 0);
      for (const pk of pickups) draw.pickup(pk.x, pk.y, pk.z, time, pk.kits, pk.ready);
      for (const d of drops) draw.pickup(d.x, d.y, d.z, time, [WEAPONS[d.weapon].boxes], true);
      for (const c of flares.crates) { draw.blob(c.x, c.y + 0.3, c.z, 0.6, c.spent ? 0x3b3946 : 0xff4fa8, 1, 0.4); draw.blob(c.x, c.y + 0.62, c.z, 0.5, c.spent ? 0x3b3946 : 0xffa02e, c.going ? 2 : 1, 0.4); }
      for (const f of flares.flares) draw.blob(f.x, f.y, f.z, 0.14, 0xff4fa8, 3);
      if (lock) draw.lock(lock.x, lock.y || 0, lock.z, m.camera ? m.camera.yaw : 0, lock.health / lock.max, time);
      draw.end();
    };

    api = { give, select, cycle, hurt, hold, guards, pickups, drops, flares, stats, draw, sound, numbers: COMBAT, weapons: WEAPONS, inv,
      spawn: (x, z, h, o) => guards.add(x, z, h, o), get lock() { return lock; }, scores, reload, people: () => people };
    const T = ctx.test, info = guards.info;
    T.guards = () => guards.list.map(info);
    T.combat = () => (sync(), { slot: C.slot, weapon: C.weapon, ammo: C.ammo, spare: C.spare, lock: C.lock, reloading: C.reloading, inv: { ...inv }, cool, stats: { ...stats }, guardStats: { ...guards.stats }, flares: { ...flares.stats, flying: flares.flares.length },
      crates: flares.crates.map((c) => ({ x: c.x, z: c.z, going: c.going > 0, spent: c.spent })), pickups: pickups.map((p) => ({ id: p.id, x: p.x, z: p.z, ready: p.ready, gives: p.gives })), drops: drops.length, boxes: draw.boxes, triangles: draw.triangles, sounds: { ...sound.stats } });
    Object.assign(T.combat, {
      give, select, cycle, damageAt, crate: (x, z) => { const c = flares.crate(x, z); return { x: c.x, z: c.z }; }, place: () => { if (!placed) place(); return pickups.length; },
      hold: (o) => Object.assign(hold, o), spawn: (x, z, h, o) => { const g = guards.add(x, z, h, o); return g ? info(g) : null; }, clear: () => { guards.clear(); setLock(null); },
      scores: () => scores().map((r) => ({ id: r.id, d: r.d, angle: r.angle, score: r.score })),
      // n hits of a weapon on a guard, a deputy ('d' + unit id) or a person (their id), as if each had landed
      hit(id, weapon, n = 1, d = 5) { gather(); const o = people.find((x) => x.id === id); if (!o) return null; const w = WEAPONS[weapon]; let i = 0; for (; i < n && o.health !== 0; i++) hurt(o, damageAt(weapon, w.range ? d : 1), !!w.range, { weapon, knock: !!w.knock }); return { hits: i, health: o.health, state: o.state }; },
      health: (id) => { const o = people.find((x) => x.id === id) || guards.list.find((x) => x.id === id); return o ? o.health : null; },
    });
    sync();
    return api;
  },
  update(dt) { if (step) step(dt); },
  render() { if (paint) paint(); },
};
