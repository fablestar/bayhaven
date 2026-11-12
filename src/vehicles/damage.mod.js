// Vehicle health (plan/04-systems.md section 4, plan/bible/systems/driving.md "Damage, fire and the blast").
// Every vehicle near the player is watched: a change of speed of more than 3 m/s in one step is a
// hit, and costs max(0, dv - 3) * 0.8 health. Stages: under 60 dents and a cracked light, under 40
// smoke, under 20 fire and 8 seconds, 0 an explosion that throws the hood and hurts what is
// within 6 m. The player's car carries real panels (panels.js); traffic cars show damage as darker
// paint and throw a box where a panel would fall. AI drivers brake and bail when the car burns.
// Repair is free at the spawn for now (game:reset).
import * as THREE from 'three';
import { createPanels } from './panels.js';
import { bodyMat, sheet } from './models.js';

export const DAMAGE = { minDv: 3, perDv: 0.8, dent: 60, smoke: 40, fire: 20, fuse: 8, blastR: 6, blastCar: 60, blastPerson: 120, bailAfter: 1.5, bailKmh: 20, burn: 20, column: 6, watch: 90 };
const MUL = { manatee: 0.5, pinfish: 1.5, needlefish: 2, hogfish: 0.6, tactical: 0.4 };
const WRECK = 0x2b2838, DRIVER_KINDS = ['tourist', 'office', 'retiree'];
const stageOf = (h) => (h <= 0 ? 4 : h < DAMAGE.fire ? 3 : h < DAMAGE.smoke ? 2 : h < DAMAGE.dent ? 1 : 0);
const dim = (hex, k) => (Math.round(((hex >> 16) & 255) * k) << 16) | (Math.round(((hex >> 8) & 255) * k) << 8) | Math.round((hex & 255) * k);

let api = null;
export default {
  name: 'damage', order: 27, renderOrder: 21, needs: ['vehicles', 'traffic', 'fx', 'props', 'world'],
  init(ctx) {
    const m = ctx.modules, ev = ctx.events, car = m.vehicles.player, S = ctx.state;
    const recs = new Map(), near = [], w = { x: 0, y: 0, z: 0 }, wreckMat = bodyMat.clone();
    wreckMat.color = new THREE.Color(WRECK).multiplyScalar(2.2);
    const stats = { hits: 0, destroyed: 0, bails: 0, died: 0, panelsLost: 0, glass: 0 };
    let panels = null, pruneT = 0, skip = 2, sparkT = 0, swapped = [];
    const fx = () => m.fx;
    const local = (v, lx, lz, out) => { const c = Math.cos(v.h), s = Math.sin(v.h); out.x = v.x + lx * c + lz * s; out.z = v.z - lx * s + lz * c; return out; };
    const vel = (v, out) => { const s = Math.sin(v.h), c = Math.cos(v.h); out.x = s * v.vf + c * v.vl; out.z = c * v.vf - s * v.vl; return out; };
    const pv = { x: 0, z: 0 };

    function rec(v) {
      let r = recs.get(v.id);
      if (r && r.v === v) return r;
      r = { v, health: 100, stage: 0, fresh: true, pvx: 0, pvz: 0, px: v.x, pz: v.z, fireT: 0, bailT: DAMAGE.bailAfter, burnT: 0, blowT: 0, dead: false,
        driver: !v.isPlayer && (v.kind === 'traffic' || (v.kind === 'loose' && !v.wasParked)), lost: {}, paint0: v.paint, accent0: v.accent, age: 0 };
      v.health = 100; recs.set(v.id, r);
      return r;
    }
    function dressPanels() {
      if (panels) panels.dispose();
      panels = car.body ? createPanels(car.body, car.model, car.paint) : null;
      for (const mesh of swapped) if (mesh.material === wreckMat) mesh.material = bodyMat;
      swapped = [];
    }
    function repair(v = car) {
      const r = rec(v);
      Object.assign(r, { health: 100, stage: 0, fireT: 0, burnT: 0, blowT: 0, dead: false, lost: {}, fresh: true, bailT: DAMAGE.bailAfter });
      v.health = 100;
      if (v === car) { car.dead = false; if (panels) panels.repair(); for (const mesh of swapped) if (mesh.material === wreckMat) mesh.material = bodyMat; swapped = []; } else { v.paint = r.paint0; v.accent = r.accent0; }
      publish();
    }
    function publish() { const r = recs.get(car.id); if (r && S.vehicle) S.vehicle.health = r.health; }

    // a piece comes off: the panel is gone from the car and a box of its size takes its place in the debris pool
    function shed(r, name, size, lx, ly, lz) {
      if (r.lost[name]) return;
      r.lost[name] = true; stats.panelsLost++;
      const v = r.v; local(v, lx, lz, w); vel(v, pv);
      if (fx()) fx().debris(w.x, (v.y || 0) + ly, w.z, { sx: size[0], sy: size[1], sz: size[2], color: r.stage > 0 ? dim(r.paint0, 0.85) : r.paint0, vx: pv.x * 0.7 + (Math.random() - 0.5) * 2, vy: 2.5, vz: pv.z * 0.7 + (Math.random() - 0.5) * 2, spin: 5, life: 5 });
      ev.emit('panel:fell', { id: v.id, name, x: w.x, z: w.z, player: v === car });
    }
    function dropPanel(r, name) {
      const v = r.v;
      if (v === car && panels) {
        const p = panels.get(name);
        if (!p || p.state === 3) return;
        panels.setState(p, 3); panels.centre(p, w);
        shed(r, name, [p.half[0] * 2, p.half[1] * 2, p.half[2] * 2], w.x, w.y, w.z);
      } else if (!sheet(v.model).two) {
        const side = name === 'doorL' ? 1 : -1;
        if (name === 'hood') shed(r, name, [v.hw * 1.8, 0.05, 1.1], 0, 0.95, v.hl * 0.6);
        else if (name === 'boot') shed(r, name, [v.hw * 1.8, 0.05, 0.9], 0, 0.95, -v.hl * 0.7);
        else if (name.startsWith('door')) shed(r, name, [0.05, 0.6, 1.1], side * (v.hw + 0.1), 0.7, 0);
        else shed(r, name, [v.hw * 2, 0.2, 0.3], 0, 0.35, name === 'bumperF' ? v.hl : -v.hl);
      }
    }
    function loosen(zone) { if (panels) for (const p of panels.zone(zone)) panels.setState(p, 2); }

    function look(r) {            // traffic cars wear their damage as darker paint
      const v = r.v;
      if (v === car) return;
      const k = r.dead ? 0 : r.stage >= 3 ? 0.5 : r.stage === 2 ? 0.7 : r.stage === 1 ? 0.85 : 1;
      v.paint = r.dead ? WRECK : dim(r.paint0, k); v.accent = r.dead ? WRECK : dim(r.accent0, k);
    }

    // take health off a vehicle. info: { dv (m/s), zone ('front' 'rear' 'left' 'right'), blast, by }
    function hurt(r, dmg, info = {}) {
      if (r.dead || dmg <= 0) return;
      const v = r.v, kmh = (info.dv || 0) * 3.6, zone = info.zone;
      r.health = Math.max(0, r.health - dmg); v.health = r.health;
      const stage = stageOf(r.health), was = r.stage;
      r.stage = stage;
      if (stage >= 1 && was < 1) {           // dents and a cracked light
        if (v === car && panels) panels.dentAll();
        local(v, (Math.random() < 0.5 ? 1 : -1) * v.hw * 0.7, v.hl, w); stats.glass++;
        if (fx()) fx().emit('glass', w.x, (v.y || 0) + 0.65, w.z, { nx: Math.sin(v.h), nz: Math.cos(v.h) });
      }
      if (stage === 3 && was < 3) {
        r.fireT = DAMAGE.fuse;
        if (v === car && S.player.mode !== 'foot') ev.emit('ui:toast', { text: 'The engine is on fire. Get out.', seconds: 4 });
        if (r.driver && v.kind === 'traffic' && m.traffic.loosen) m.traffic.loosen(v);          // the driver stands on the brakes
      }
      if (stage !== was) { look(r); ev.emit('vehicle:damaged', { id: v.id, model: v.model, health: r.health, stage, was, x: v.x, z: v.z, player: v === car }); }
      // panels: the end that was hit comes loose, and falls off when the hit is hard enough
      if (zone && r.health < DAMAGE.dent && info.dv >= 6 && v === car) loosen(zone);
      if (zone === 'front' || zone === 'rear') {
        const lid = zone === 'front' ? 'hood' : 'boot', bumper = zone === 'front' ? 'bumperF' : 'bumperR';
        if (kmh > 60 && r.health < 40) dropPanel(r, lid);
        if (r.health < 30 || kmh > 70) dropPanel(r, bumper);
      } else if (zone && kmh > 50 && r.health < 50) dropPanel(r, zone === 'left' ? 'doorL' : 'doorR');
      if (v === car) publish();
      if (stage === 4) { if (info.blast) r.blowT = 0.5; else explode(r); }
    }

    function bail(r) {
      const v = r.v, side = Math.random() < 0.5 ? 1 : -1;
      r.driver = false; v.noDriver = true; stats.bails++;
      local(v, side * (v.hw + 0.7), 0, w);
      let who = null;
      if (m.peds && m.peds.add) who = m.peds.add(DRIVER_KINDS[stats.bails % DRIVER_KINDS.length], w.x, w.z, v.h + side * Math.PI / 2);
      if (who && m.peds.scare) m.peds.scare(who, v.x, v.z);
      ev.emit('driver:bailed', { id: v.id, model: v.model, x: w.x, z: w.z, person: who ? who.id : null });
    }

    function explode(r) {
      if (r.dead) return;
      const v = r.v, y = v.y || 0, driverDied = !!r.driver, inside = v === car && S.player.mode !== 'foot';
      r.dead = true; r.health = 0; v.health = 0; r.stage = 4; r.fireT = 0; r.blowT = 0; r.burnT = DAMAGE.burn; r.driver = false;
      stats.destroyed++; if (driverDied) stats.died++;
      const hood = v === car && panels ? panels.get('hood') : null;
      local(v, 0, v.hl * 0.55, w);
      if (fx()) fx().emit('explosion', v.x, y, v.z, { paint: r.paint0, hx: w.x, hz: w.z, hood: hood ? [hood.half[0] * 2, 0.05, hood.half[2] * 2] : [v.hw * 1.8, 0.05, Math.min(1.4, v.hl * 0.6)],
        onLand: (p) => ev.emit('panel:fell', { id: v.id, name: 'hood', x: p.x, z: p.z, player: v === car }) });
      if (hood && hood.state !== 3) { panels.setState(hood, 3); r.lost.hood = true; stats.panelsLost++; }
      if (v === car) {
        car.dead = true;
        if (panels) panels.setWreck(true);
        if (car.body) for (const mesh of car.body.children) if (mesh.material === bodyMat) { mesh.material = wreckMat; swapped.push(mesh); }
        publish();
      } else if (m.traffic.wreck) m.traffic.wreck(v);
      look(r);
      const data = { id: v.id, model: v.model, x: v.x, z: v.z, player: v === car, inside, driverDied, radius: DAMAGE.blastR };
      ev.emit('vehicle:destroyed', data); ev.emit('vehicle:blast', data);
      // the blast: vehicles lose up to 60, people up to 120, nothing past 6 m
      if (m.vehicles.near) m.vehicles.near(v.x, v.z, DAMAGE.blastR + 3, near); else near.length = 0;
      if (!near.includes(car)) near.push(car);
      for (const o of near.slice()) {
        const d = Math.hypot(o.x - v.x, o.z - v.z);
        if (o !== v && d < DAMAGE.blastR) hurt(rec(o), DAMAGE.blastCar * (1 - d / DAMAGE.blastR), { blast: true });
      }
      const pl = S.player, dp = inside ? 0 : Math.hypot(pl.x - v.x, pl.z - v.z);
      if (dp < DAMAGE.blastR && m.combat && m.combat.damagePlayer) m.combat.damagePlayer(inside ? 200 : DAMAGE.blastPerson * (1 - dp / DAMAGE.blastR), 'blast');
    }

    ev.on('game:reset', () => { repair(car); skip = 2; });
    ev.on('vehicle:entered', () => { recs.delete(car.id); dressPanels(); car.dead = false; rec(car); publish(); skip = 2; });
    // being put somewhere at speed (a teleport, a mission start) is not a hit
    const reset0 = car.reset;
    car.reset = (pose) => { reset0(pose); const r = recs.get(car.id); if (r) r.fresh = true; };
    dressPanels(); rec(car);

    api = {
      numbers: DAMAGE, stats, recs,
      get panels() { return panels; },
      health: (v = car) => { const r = recs.get(v.id); return r ? r.health : 100; },
      stage: (v = car) => { const r = recs.get(v.id); return r ? r.stage : 0; },
      // other lanes ask for damage here (bullets, spike strips, a ram): n health off, where it landed
      hurt: (v, n, info) => hurt(rec(v), n, info),
      hit: (v, dv, zone = 'front') => hurt(rec(v), Math.max(0, dv - DAMAGE.minDv) * DAMAGE.perDv * (MUL[v.model] || 1), { dv, zone }),
      repair, explode: (v = car) => explode(rec(v)),
      update(dt) {
        const f = fx();
        // who is watched: the player's car and whatever is near it
        if (m.vehicles.near) m.vehicles.near(car.x, car.z, DAMAGE.watch, near); else near.length = 0;
        if (!near.includes(car)) near.push(car);
        for (let i = 0; i < near.length; i++) {
          const v = near[i], r = rec(v);
          vel(v, pv);
          const moved = Math.hypot(v.x - r.px, v.z - r.pz), dvx = pv.x - r.pvx, dvz = pv.z - r.pvz, dv = Math.hypot(dvx, dvz) / 1.05;
          if (!r.fresh && !skip && !r.dead && dv > DAMAGE.minDv && moved < 3) {
            // which end took it: the car was pushed along (dvx, dvz), so it was struck on the other side
            const s = Math.sin(v.h), c = Math.cos(v.h), lf = dvx * s + dvz * c, ll = dvx * c - dvz * s;
            const zone = Math.abs(lf) >= Math.abs(ll) ? (lf < 0 ? 'front' : 'rear') : ll < 0 ? 'left' : 'right';
            stats.hits++;
            hurt(r, (dv - DAMAGE.minDv) * DAMAGE.perDv * (MUL[v.model] || 1), { dv, zone });
          }
          r.fresh = false; r.pvx = pv.x; r.pvz = pv.z; r.px = v.x; r.pz = v.z; r.age = 0;
        }
        if (skip) skip--;
        // smoke, fire, the fuse, drivers getting out, wrecks burning
        for (const r of recs.values()) {
          const v = r.v, y = v.y || 0;
          r.age += dt;
          if (r.blowT > 0) { r.blowT -= dt; if (r.blowT <= 0) explode(r); continue; }
          if (r.stage < 2 || r.age > 1) continue;
          const two = v.preset && v.preset.two;
          local(v, 0, two ? 0 : v.hl * 0.6, w); vel(v, pv);
          if (r.dead) {
            if (r.burnT <= 0) continue;
            r.burnT -= dt;
            if (f) { f.emit('engine-fire', v.x, y + 0.7, v.z, { dt, size: 1.6 }); if (r.burnT > DAMAGE.burn - DAMAGE.column) f.emit('column', v.x, y + 0.8, v.z, { dt }); else f.emit('engine-smoke', v.x, y + 1, v.z, { dt, dark: true }); }
            continue;
          }
          if (f) f.emit('engine-smoke', w.x, y + 0.95, w.z, { dt, dark: r.stage === 3, vx: pv.x, vz: pv.z });
          if (r.stage === 3) {
            if (f) f.emit('engine-fire', w.x, y + 0.9, w.z, { dt, vx: pv.x, vz: pv.z });
            if (r.driver && Math.hypot(v.vf, v.vl) * 3.6 < DAMAGE.bailKmh) { r.bailT -= dt; if (r.bailT <= 0) bail(r); }
            r.fireT -= dt;
            if (r.fireT <= 0) explode(r);
          }
        }
        // the player's loose panels flap; a hanging bumper drags and throws sparks (4 a second)
        if (panels) {
          const sp = Math.hypot(car.vf, car.vl);
          panels.step(dt, sp, car.w);
          sparkT -= dt;
          if (f && sp > 3 && sparkT <= 0) {
            sparkT = 0.25;
            for (const p of panels.list) if (p.drags && p.state === 2) { local(car, -Math.sign(p.pivot[0]) * car.hw, p.pivot[2], w); f.sparks(w.x, car.y + 0.05, w.z, -Math.sin(car.h), -Math.cos(car.h), 2); }
          }
        }
        // forget cars that have left the street
        pruneT -= dt;
        if (pruneT <= 0) { pruneT = 2; const live = new Set(m.traffic.all || []); for (const [id, r] of recs) if (r.v !== car && !live.has(r.v)) recs.delete(id); }
      },
    };
    // what the checks read and push
    const info = (v) => { const r = rec(v); return { id: v.id, model: v.model, health: r.health, stage: r.stage, smoking: r.stage >= 2 && !r.dead, burning: r.stage === 3, fuse: r.fireT, dead: r.dead, wreckBurning: r.burnT > 0, driver: r.driver, lost: Object.keys(r.lost), paint: v.paint }; };
    const find = (id) => (id === undefined || id === car.id ? car : (m.traffic.all || []).find((v) => v.id === id));
    ctx.test.damage = (id) => { const v = find(id); return v ? { ...info(v), panels: v === car && panels ? Object.fromEntries(panels.list.map((p) => [p.name, { state: p.state, angle: p.a }])) : null, tracked: recs.size, stats: { ...stats }, numbers: DAMAGE } : null; };
    ctx.test.damageHit = (dv, zone, id) => { const v = find(id); if (v) api.hit(v, dv, zone); return v ? info(v) : null; };
    ctx.test.damageSet = (health, id) => { const v = find(id); if (!v) return null; const r = rec(v); if (health >= r.health) { repair(v); r.health = v.health = health; r.stage = stageOf(health); } else hurt(r, r.health - health, {}); return info(v); };
    ctx.test.repair = () => { repair(car); return info(car); };
    return api;
  },
  update(dt) { api.update(dt); },
  render() { if (api.panels) api.panels.draw(); },
};
