// The flare gun's flare and the fireworks crates it sets off. A flare is lobbed at 30 m/s, does 5 on a direct
// hit, burns 6 s where it lands with a red-pink glow, and makes people within 40 m film. A crate within 2 m of
// a burning flare goes up for 5 s. Crates stand by the pickup spots until Storm Mart yards exist.
const G = 9.8, RED = [1, 0.12, 0.3], PINK = [1, 0.31, 0.66], CYAN = [0.16, 0.9, 1], MANGO = [1, 0.63, 0.18], MINT = [0.36, 1, 0.61];
const SHOW = [PINK, CYAN, MANGO, MINT];

export function createFlares(env) {
  // env: { fx, collide, map, events, rnd, peds, people() → who a flare can hit, hurt(target, dmg), sound(name, x, z) }
  const flares = [], crates = [], stats = { fired: 0, landed: 0, direct: 0, crates: 0, rockets: 0 };
  const fx = () => env.fx();
  function land(f) {
    f.burn = f.burns; f.vx = f.vy = f.vz = 0; f.y = env.map.heightAt(f.x, f.z) + 0.1; stats.landed++;
    const P = env.peds(); if (P && P.trigger) P.trigger(f.burns, 'stunt', f.x, f.z);
    env.events.emit('flare:landed', { x: f.x, z: f.z, seconds: f.burns });
  }
  return {
    flares, crates, stats,
    fire(x, y, z, a, W) {
      const up = 0.05, c = Math.cos(up) * W.speed;
      flares.push({ x, y, z, vx: Math.sin(a) * c, vy: Math.sin(up) * W.speed, vz: Math.cos(a) * c, burn: 0, burns: W.burns, t: 0, puffT: 0, dmg: W.damage });
      stats.fired++;
    },
    crate(x, z) { const c = { x, z, y: env.map.heightAt(x, z), going: 0, spent: false, t: 0 }; crates.push(c); return c; },
    reset() { flares.length = 0; for (const c of crates) { c.going = 0; c.spent = false; } },
    step(dt) {
      const F = fx();
      for (let i = flares.length - 1; i >= 0; i--) {
        const f = flares[i]; f.t += dt; f.puffT -= dt;
        if (f.burn > 0) {
          f.burn -= dt;
          if (F && f.puffT <= 0) { f.puffT = 0.09; F.smoke(f.x, f.y + 0.3, f.z, { s0: 1.2, s1: 6, life: 0.45, c0: RED, c1: PINK, a: 0.35, glow: true, vy: 0.6 }); F.bit(f.x, f.y + 0.2, f.z, (env.rnd() - 0.5) * 4, 3 + env.rnd() * 3, (env.rnd() - 0.5) * 4, { life: 0.5, c0: PINK, c1: RED, len: 0.2 }); }
          for (const c of crates) if (!c.spent && !c.going && Math.hypot(c.x - f.x, c.z - f.z) < 2) { c.going = 5; c.t = 0; stats.crates++; env.events.emit('fireworks:start', { x: c.x, z: c.z, seconds: 5 }); const P = env.peds(); if (P && P.trigger) P.trigger(8, 'stunt', c.x, c.z); }
          if (f.burn <= 0) flares.splice(i, 1);
          continue;
        }
        const nx = f.x + f.vx * dt, nz = f.z + f.vz * dt;
        f.vy -= G * dt; f.y += f.vy * dt;
        if (F && f.puffT <= 0) { f.puffT = 0.03; F.smoke(f.x, f.y, f.z, { s0: 0.3, s1: 0.9, life: 0.5, c0: PINK, a: 0.5, glow: true, vy: 0.2 }); }
        let hitSomeone = false;
        if (f.y < 2.2) for (const o of env.people()) if (Math.hypot(o.x - nx, o.z - nz) < 0.6) { env.hurt(o, f.dmg); stats.direct++; hitSomeone = true; break; }
        const wall = env.collide.ray(f.x, f.z, nx, nz, 0, Math.max(0.5, f.y));
        if (wall) { f.x = wall.x - f.vx * 0.01; f.z = wall.z - f.vz * 0.01; } else { f.x = nx; f.z = nz; }
        if (hitSomeone || wall || f.y <= env.map.heightAt(f.x, f.z) + 0.1 || f.t > 8) land(f);
      }
      for (const c of crates) {
        if (!c.going) continue;
        c.going -= dt; c.t -= dt;
        if (c.t <= 0 && F) {             // a rocket every 0.3 s: a streak up, then a ring of sparks
          c.t = 0.3; stats.rockets++;
          const col = SHOW[stats.rockets % SHOW.length], ox = (env.rnd() - 0.5) * 6, oz = (env.rnd() - 0.5) * 6, top = 9 + env.rnd() * 6;
          F.bit(c.x, c.y + 0.6, c.z, ox, 26, oz, { life: 0.45, c0: col, c1: col, grav: 4, len: 1.2, w: 0.06 });
          for (let k = 0; k < 14; k++) { const a = k / 14 * 6.283, s = 5 + env.rnd() * 3; F.bit(c.x + ox * 0.45, c.y + top, c.z + oz * 0.45, Math.cos(a) * s, (env.rnd() - 0.3) * 5, Math.sin(a) * s, { life: 0.9, c0: col, c1: col, grav: 3, len: 0.35, w: 0.07 }); }
          F.smoke(c.x + ox * 0.45, c.y + top, c.z + oz * 0.45, { s0: 2, s1: 7, life: 0.5, c0: col, a: 0.3, glow: true, vy: 0 });
          env.sound('snap', c.x, c.z);
        }
        if (c.going <= 0) { c.going = 0; c.spent = true; env.events.emit('fireworks:end', { x: c.x, z: c.z }); }
      }
    },
  };
}
