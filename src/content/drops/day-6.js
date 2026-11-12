// Day 6's drop, in this build only: "The Getaway Cup". Mission 1 against the clock, from the moment
// Mags stands up to the forecourt of Park & Sons, with a ghost of your best run driving it beside you.
// A mango ring by the Pelican Rest gate starts it. The best run is kept in this browser.
import * as THREE from 'three';
import { createParkedCar } from '../../vehicles/models.js';

export const CUP = { mission: 'final-notice', from: 1, every: 0.25, r: 4, key: 'bayhaven.cup', most: 2400 };
const clockText = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}.${Math.floor((s % 1) * 10)}`;

export default {
  day: 6, id: 'getaway-cup', marker: { x: -1238, z: -208 },
  start(ctx) {
    const m = ctx.modules, S = ctx.state, ev = ctx.events, mis = m.missions, at = this.marker;
    const keep = !ctx.params.get('test');
    const score = { best: null, last: null, runs: 0, finished: 0, x: at.x, z: at.z };
    let bestRun = null, rec = null, recT = 0, armed = true, ghostOn = false;
    if (keep) try { const d = JSON.parse(localStorage.getItem(CUP.key) || 'null'); if (d && d.seconds && Array.isArray(d.samples)) { bestRun = d; score.best = d.seconds; } } catch (e) { /* no stored run */ }

    // the start ring, and the ghost: the coupe in see-through cyan
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(CUP.r, CUP.r, 0.6, 28, 1, true), new THREE.MeshBasicMaterial({ color: 0xffa02e, transparent: true, opacity: 0.7, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, fog: false }));
    ring.position.set(at.x, m.map.heightAt(at.x, at.z) + 0.3, at.z); ctx.scene.add(ring);
    const ghost = createParkedCar(0xffffff, 0xffffff, 'heron');
    ghost.material = new THREE.MeshBasicMaterial({ color: 0x29e6ff, transparent: true, opacity: 0.32, depthWrite: false });
    ghost.visible = false; ctx.scene.add(ghost);

    const label = () => (score.best != null ? `The Getaway Cup · best ${clockText(score.best)}` : 'The Getaway Cup · no time set');
    const show = () => { if (m.hud && m.hud.drop) m.hud.drop(label()); };
    function begin() {
      if (!mis || !mis.get(CUP.mission)) return false;
      const ok = mis.start(CUP.mission, { mode: 'cup', from: CUP.from });
      if (ok) { rec = []; recT = 0; score.runs++; ghostOn = !!bestRun; }
      return ok;
    }
    ev.on('mission:completed', (r) => {
      if (r.mode !== 'cup' || !rec) return;
      score.last = r.seconds; score.finished++;
      if (score.best == null || r.seconds < score.best) {
        score.best = r.seconds; bestRun = { seconds: r.seconds, samples: rec };
        if (keep) try { localStorage.setItem(CUP.key, JSON.stringify(bestRun)); } catch (e) { /* storage is full or off */ }
      }
      rec = null; ghostOn = false; show();
    });
    ev.on('mission:failed', (f) => { if (rec) ghostOn = false; });
    ev.on('mission:retried', () => { if (rec && mis.run) { rec = rec.filter((q) => q[0] <= mis.run.t); ghostOn = !!bestRun; } });
    ev.on('mission:ended', () => { rec = null; ghostOn = false; });
    show();

    const api = {
      id: 'getaway-cup', score, numbers: CUP, begin, label,
      get running() { return !!rec; },
      get ghost() { return { on: ghost.visible, x: ghost.position.x, z: ghost.position.z, samples: bestRun ? bestRun.samples.length : 0, seconds: bestRun ? bestRun.seconds : null }; },
      get recorded() { return rec ? rec.length : 0; },
      reset() { armed = false; },
      update(dt, night) {
        const run = mis && mis.run, cup = run && run.mode === 'cup', p = S.player, clip = document.body.classList.contains('clip');
        ring.visible = !run && !clip;
        ring.scale.y = 1 + 0.2 * Math.sin(ctx.loop.time * 4);
        if (!run) { const inside = Math.hypot(p.x - at.x, p.z - at.z) < CUP.r; if (inside && armed && !clip) { armed = false; begin(); } else if (!inside) armed = true; }
        // record this run four times a second: [seconds, x, z, heading]
        if (cup && rec && run.status === 'running') {
          recT -= dt;
          if (recT <= 0 && rec.length < CUP.most) { recT = CUP.every; rec.push([+run.t.toFixed(2), +p.x.toFixed(2), +p.z.toFixed(2), +p.h.toFixed(3)]); }
        }
        // the ghost: the best run, at this run's clock
        let seen = false;
        if (cup && ghostOn && bestRun && run.status === 'running') {
          const q = bestRun.samples, t = run.t;
          let i = Math.min(q.length - 2, Math.max(0, Math.floor(t / CUP.every) - 1));
          while (i < q.length - 2 && q[i + 1][0] < t) i++;
          while (i > 0 && q[i][0] > t) i--;
          const a = q[i], b = q[i + 1];
          if (a && b && t <= b[0] + 0.5) {
            const k = Math.max(0, Math.min(1, (t - a[0]) / Math.max(0.01, b[0] - a[0])));
            let dh = b[3] - a[3]; while (dh > Math.PI) dh -= 6.2832; while (dh < -Math.PI) dh += 6.2832;
            const x = a[1] + (b[1] - a[1]) * k, z = a[2] + (b[2] - a[2]) * k;
            ghost.position.set(x, m.map.heightAt(x, z), z); ghost.rotation.y = a[3] + dh * k; seen = true;
          }
        }
        ghost.visible = seen;
      },
    };
    ctx.test.cup = () => ({ ...score, running: api.running, recorded: api.recorded, ghost: api.ghost, label: label(), ring: ring.visible });
    ctx.test.cup.begin = begin;
    return api;
  },
  stop() {},
};
