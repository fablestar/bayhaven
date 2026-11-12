// The ambulance (plan/bible/systems/traffic.md "Ambulances"): a white Pompano that comes for anyone
// who is down. Called 5 s after `ped:down`, it starts 150 to 260 m away, drives the roads with its
// siren and red and white bar, stops within 8 m, spends 6 s on each person (up to 3 within 15 m),
// takes them away and leaves towards Bayhaven General. 1 at once on low, 2 on high.
// Not built: the two medics who get out, the Sheriff Tarpon that follows, traffic pulling over.
import * as THREE from 'three';

const AMB = { callAfter: 5, near: 150, far: 260, speed: 16, accel: 4, brake: 8, turn: 1.3, stopAt: 8, perPerson: 6, most: 3, reach: 15, leaveFor: 25, goneAt: 180,
  hospital: { x: -500, z: -1700 }, white: 0xfdf6ea, red: 0xff5a5a };
const ang = (a) => { while (a > Math.PI) a -= 6.2832; while (a < -Math.PI) a += 6.2832; return a; };

let api = null;
export default {
  name: 'ambulance', order: 23, renderOrder: 22, needs: ['traffic', 'nav', 'map', 'vehicles'],
  init(ctx) {
    const m = ctx.modules, ev = ctx.events, S = ctx.state, { nav, map, traffic } = m;
    const calls = [], active = [], downed = [], stats = { calls: 0, sent: 0, arrived: 0, collected: 0, left: 0 };
    const off = !traffic || traffic.disabled || !traffic.spawn;
    const barGeo = new THREE.BoxGeometry(1.3, 0.14, 0.3);
    const look = new THREE.Vector3();
    let siren = null;

    function send(call) {
      // a lane 150 to 260 m from the scene, behind the camera if there is one
      let best = null, bs = -1e9;
      const cam = ctx.camera; cam.getWorldDirection(look);
      const fx = look.x, fz = look.z;
      for (const l of nav.lanes) {
        const x = (l.ax + l.bx) / 2, z = (l.az + l.bz) / 2, d = Math.hypot(x - call.x, z - call.z);
        if (d < AMB.near || d > AMB.far) continue;
        const score = -((x - cam.position.x) * fx + (z - cam.position.z) * fz) - Math.abs(d - 200) * 0.2 + ((l.id.length * 37 + stats.sent * 11) % 20);
        if (score > bs) { bs = score; best = l; }
      }
      if (!best) return false;
      const x = (best.ax + best.bx) / 2, z = (best.az + best.bz) / 2;
      const v = traffic.spawn('pompano', x, z, best.heading);
      if (!v) return false;
      Object.assign(v, { paint: AMB.white, accent: AMB.red, ambulance: true, parked: false });
      const bar = new THREE.Mesh(barGeo, new THREE.MeshBasicMaterial({ color: AMB.red }));
      ctx.scene.add(bar);
      const path = nav.route({ x, z }, { x: call.x, z: call.z });
      active.push({ v, bar, path, from: { x, z }, at: 0, state: 'drive', goal: call, t: 0, speed: 0, work: 0, taken: 0, age: 0 });
      stats.sent++;
      ev.emit('traffic:ambulance', { x, z, step: 'sent' });
      return true;
    }
    function drive(a, dt, stopR) {
      const v = a.v, path = a.path;
      while (a.at < path.length - 1 && Math.hypot(path[a.at].x - v.x, path[a.at].z - v.z) < 7) a.at++;
      // stuck behind something that is not moving: pull out to the left and go round it at 6 m/s
      if (a.swerve > 0) a.swerve -= dt;
      const p = path[a.at], out = a.swerve > 0 ? 3.4 : 0, hx = Math.cos(v.h), hz = -Math.sin(v.h);
      const dx = p.x + hx * out - v.x, dz = p.z + hz * out - v.z, d = Math.hypot(p.x - v.x, p.z - v.z);
      let err = ang(Math.atan2(dx, dz) - v.h);
      // on a long stretch it holds a line `out` metres left of the lane instead of aiming at the far end
      const prev = a.at > 0 ? path[a.at - 1] : a.from, sl = Math.hypot(p.x - prev.x, p.z - prev.z);
      if (d > 10 && sl > 12) {
        const ux = (p.x - prev.x) / sl, uz = (p.z - prev.z) / sl, across = (v.x - prev.x) * uz - (v.z - prev.z) * ux;
        err = ang(Math.atan2(ux, uz) + Math.max(-0.6, Math.min(0.6, (out - across) * 0.3)) - v.h);
      }
      const toGoal = Math.hypot(a.goal.x - v.x, a.goal.z - v.z), last = a.at === path.length - 1;
      const arrived = toGoal < stopR || (last && d < 3);
      let want = AMB.speed * Math.max(0.3, 1 - Math.abs(err) * 0.9);
      if (stopR && toGoal < 40) want = Math.min(want, Math.max(3, toGoal * 0.4));
      // it brakes for whatever is in the road ahead of it: the player's car, a wreck, a queue
      let blocked = false;
      const sn = Math.sin(v.h), cs = Math.cos(v.h), reach = v.hl + 5 + a.speed * 0.9;
      const ahead = (o) => { if (o === v) return false; const rx = o.x - v.x, rz = o.z - v.z, fwd = rx * sn + rz * cs; return fwd > 0 && fwd < reach + o.hl && Math.abs(rx * cs - rz * sn) < v.hw + o.hw + 0.4; };
      if (ahead(m.vehicles.player)) blocked = true;
      else for (const o of traffic.all) if (Math.abs(o.x - v.x) < 30 && Math.abs(o.z - v.z) < 30 && ahead(o)) { blocked = true; break; }
      // something standing in the lane up to 28 m ahead: pull out early, and stay out until it is behind
      const still = (o) => {
        if (o === v || Math.hypot(o.vf || 0, o.vl || 0) > 1) return false;
        const rx = o.x - v.x, rz = o.z - v.z, fwd = rx * sn + rz * cs, lat = rx * cs - rz * sn, w = v.hw + o.hw;
        return fwd > -(v.hl + o.hl + 2) && fwd < 28 && (a.swerve > 0 ? lat > -w - 3.8 && lat < w + 0.2 : Math.abs(lat) < w + 0.2);
      };
      if (!(stopR > 0 && toGoal < AMB.reach + AMB.stopAt)) {
        let inWay = still(m.vehicles.player);
        if (!inWay) for (const o of traffic.all) if (Math.abs(o.x - v.x) < 40 && Math.abs(o.z - v.z) < 40 && still(o)) { inWay = true; break; }
        if (inWay) a.swerve = Math.max(a.swerve || 0, 0.6);
      }
      if (a.swerve > 0) want = Math.min(want, 8);
      a.blockedT = blocked && a.speed < 0.5 ? (a.blockedT || 0) + dt : 0;
      if (a.blockedT > 0.8 && !(stopR > 0 && toGoal < AMB.reach + AMB.stopAt)) { a.swerve = 5; a.blockedT = 0; }
      if (arrived || blocked) want = 0;
      a.speed += Math.max(-AMB.brake * dt, Math.min(AMB.accel * dt, want - a.speed));
      v.h += Math.max(-AMB.turn * dt, Math.min(AMB.turn * dt, err)) * Math.min(1, a.speed / 3);
      v.x += Math.sin(v.h) * a.speed * dt; v.z += Math.cos(v.h) * a.speed * dt; v.y = map.heightAt(v.x, v.z);
      v.vf = a.speed; v.vl = 0; v.spin = (v.spin || 0) + a.speed / 0.36 * dt; v.braking = want < a.speed - 0.5;
      return a.speed < 0.5 && (arrived || (stopR > 0 && a.blockedT > 1.5 && toGoal < AMB.reach + AMB.stopAt));      // stuck behind a car within reach of them counts as there
    }
    function end(a, despawn, why = 'done') {
      ctx.scene.remove(a.bar); a.bar.material.dispose();
      const i = active.indexOf(a); if (i >= 0) active.splice(i, 1);
      if (despawn) traffic.despawn(a.v); else { a.v.ambulance = false; a.v.placed = false; }
      stats.left++;
      ev.emit('traffic:ambulance', { x: a.v.x, z: a.v.z, step: 'left', why, kind: a.v.kind, health: a.v.health });
    }

    ev.on('ped:down', (e) => { if (e && !off) { calls.push({ x: e.x, z: e.z, t: AMB.callAfter, id: e.id }); stats.calls++; ev.emit('traffic:ambulance', { x: e.x, z: e.z, step: 'called' }); } });
    ev.on('game:reset', () => { calls.length = 0; for (const a of active.slice()) end(a, true, 'reset'); });

    api = {
      numbers: AMB, stats, active, calls,
      update(dt) {
        if (off) return;
        const cap = ctx.quality.level === 'low' ? 1 : 2;
        for (let i = calls.length - 1; i >= 0; i--) {
          const c = calls[i];
          c.t -= dt;
          if (c.t > 0) continue;
          // one ambulance serves every call within its reach
          if (active.some((a) => a.state !== 'leave' && Math.hypot(a.goal.x - c.x, a.goal.z - c.z) < AMB.reach)) { calls.splice(i, 1); continue; }
          if (active.length < cap && send(c)) calls.splice(i, 1);
        }
        for (const a of active.slice()) {
          const v = a.v;
          a.age += dt;
          if (v.kind !== 'wreck' || v.health <= 0) { end(a, false, 'hit'); continue; }       // rammed off its job, or blown up
          if (a.state === 'drive') {
            if (drive(a, dt, AMB.stopAt) || a.age > 90) { a.state = 'scene'; a.speed = 0; v.vf = 0; a.work = 0; stats.arrived++; ev.emit('traffic:ambulance', { x: v.x, z: v.z, step: 'arrived' }); }
          } else if (a.state === 'scene') {
            a.work += dt;
            if (m.peds && m.peds.downed) m.peds.downed(downed); else downed.length = 0;
            const here = downed.filter((p) => Math.hypot(p.x - v.x, p.z - v.z) < AMB.reach + AMB.stopAt);
            if (a.work >= AMB.perPerson) {
              a.work = 0;
              const p = here[0];
              if (p && a.taken < AMB.most) { m.peds.remove(p); a.taken++; stats.collected++; ev.emit('ped:collected', { id: p.id, x: p.x, z: p.z }); }
              if (!p || a.taken >= AMB.most || here.length <= 1) {
                a.state = 'leave'; a.t = 0; a.at = 0; a.goal = AMB.hospital;
                a.from = { x: v.x, z: v.z };
                a.path = nav.route({ x: v.x + Math.sin(v.h) * 6, z: v.z + Math.cos(v.h) * 6 }, AMB.hospital);
              }
            }
          } else {
            a.t += dt; drive(a, dt, 0);
            const far = Math.hypot(v.x - S.player.x, v.z - S.player.z);
            if (far > AMB.goneAt || (a.t > AMB.leaveFor && far > 90) || a.t > 90) end(a, true);
          }
        }
      },
      draw(time) {
        let nearest = 1e9, running = false;
        for (const a of active) {
          const v = a.v, s = Math.sin(v.h), c = Math.cos(v.h), red = (time * 1.5) % 1 < 0.5;
          a.bar.position.set(v.x + s * 1.75, (v.y || 0) + 2.28, v.z + c * 1.75); a.bar.rotation.y = v.h;
          a.bar.material.color.setHex(red ? AMB.red : AMB.white).multiplyScalar(1.6);
          if (a.state !== 'scene') { running = true; nearest = Math.min(nearest, Math.hypot(v.x - S.player.x, v.z - S.player.z)); }
        }
        // the wail: a triangle sweeping 700 to 1,500 Hz, 2 s up and 2 s down (sfx.md row 40); it stops on the scene
        const au = m.audio, ac = au && au.ctx && au.ctx.state === 'running' ? au.ctx : null, g = running && nearest < 150 ? 0.2 / (1 + (nearest / 12) * (nearest / 12)) * 6 : 0;
        api.stats.siren = Math.min(0.2, g);
        if (!ac) return;
        if (!siren && g > 0) {
          const o = ac.createOscillator(), lfo = ac.createOscillator(), depth = ac.createGain(), lp = ac.createBiquadFilter(), gain = ac.createGain();
          o.type = 'triangle'; o.frequency.value = 1100; lfo.type = 'triangle'; lfo.frequency.value = 0.25; depth.gain.value = 400;
          lp.type = 'lowpass'; lp.frequency.value = 3200; gain.gain.value = 0;
          lfo.connect(depth); depth.connect(o.frequency); o.connect(lp); lp.connect(gain); gain.connect(au.bus('effects'));
          o.start(); lfo.start(); siren = { o, lfo, gain };
        }
        if (siren) {
          siren.gain.gain.setTargetAtTime(Math.min(0.2, g), ac.currentTime, 0.05);
          if (!active.length) { siren.o.stop(ac.currentTime + 0.3); siren.lfo.stop(ac.currentTime + 0.3); siren = null; }
        }
      },
    };
    ctx.test.ambulance = () => ({ ...stats, waiting: calls.length, list: active.map((a) => ({ id: a.v.id, x: a.v.x, z: a.v.z, state: a.state, speed: a.speed, taken: a.taken, toGoal: Math.hypot(a.goal.x - a.v.x, a.goal.z - a.v.z), paint: a.v.paint })) });
    return api;
  },
  update(dt) { api.update(dt); },
  render(alpha, ctx) { api.draw(ctx.loop.time); },
};
