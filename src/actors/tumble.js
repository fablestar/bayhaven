// A person who has been hit becomes a ten-point rope for a few seconds (plan/bible/tech/algorithms.md
// section 8). Points: head, neck, chest, hips, two hands, two knees, two feet. No three.js.

// standing, in the person's own space: x is their left, y up, z forwards
const REST = [[0, 1.62, 0], [0, 1.44, 0], [0, 1.25, 0], [0, 0.80, 0], [0.30, 0.85, 0], [-0.30, 0.85, 0], [0.10, 0.42, 0], [-0.10, 0.42, 0], [0.10, 0.02, 0], [-0.10, 0.02, 0]];
// eleven sticks: the body, then two that keep its shape (head to chest, knee to knee)
const STICKS = [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5], [3, 6], [3, 7], [6, 8], [7, 9], [0, 2], [6, 7]];
const LEN = STICKS.map(([a, b]) => Math.hypot(REST[a][0] - REST[b][0], REST[a][1] - REST[b][1], REST[a][2] - REST[b][2]));
export const POINTS = 10, HEAD = 0, NECK = 1, CHEST = 2, HIPS = 3, HAND_L = 4, HAND_R = 5, FOOT_L = 8, FOOT_R = 9;
export const TUMBLE = { damping: 0.98, gravity: 9.8, friction: 0.6, passes: 3, push: 0.6, up: 3, restSpeed: 0.4, restFor: 0.5, longest: 3 };

// Start a rope where the person stands. (vx, vz) is the vehicle's velocity in m/s.
export function startRope(x, y, z, h, scale, vx, vz, rnd = Math.random) {
  const p = new Float32Array(POINTS * 3), q = new Float32Array(POINTS * 3);
  const c = Math.cos(h), s = Math.sin(h), dt = 1 / 60;
  const px = vx * TUMBLE.push, pz = vz * TUMBLE.push;
  for (let i = 0; i < POINTS; i++) {
    const r = REST[i], lx = r[0] * scale, lz = r[2] * scale;
    p[i * 3] = x + lx * c + lz * s; p[i * 3 + 1] = y + r[1] * scale; p[i * 3 + 2] = z - lx * s + lz * c;
    // the top of the body is thrown a little harder than the feet, so the figure turns over
    const k = 0.75 + 0.5 * (r[1] / 1.62) + (rnd() - 0.5) * 0.2;
    q[i * 3] = p[i * 3] - px * k * dt; q[i * 3 + 1] = p[i * 3 + 1] - TUMBLE.up * dt; q[i * 3 + 2] = p[i * 3 + 2] - pz * k * dt;
  }
  return { p, q, t: 0, still: 0, done: false, scale, speed: Math.hypot(px, pz) };
}

// One fixed step. groundAt(x, z) gives the ground height. Returns true once the body has come to rest.
export function stepRope(rope, dt, groundAt) {
  const { p, q } = rope, g = TUMBLE.gravity * dt * dt;
  let moved = 0;
  for (let i = 0; i < POINTS * 3; i += 3) {
    const vx = (p[i] - q[i]) * TUMBLE.damping, vy = (p[i + 1] - q[i + 1]) * TUMBLE.damping, vz = (p[i + 2] - q[i + 2]) * TUMBLE.damping;
    q[i] = p[i]; q[i + 1] = p[i + 1]; q[i + 2] = p[i + 2];
    p[i] += vx; p[i + 1] += vy - g; p[i + 2] += vz;
    moved += Math.hypot(vx, vy, vz);
  }
  for (let pass = 0; pass < TUMBLE.passes; pass++) {
    for (let k = 0; k < STICKS.length; k++) {
      const a = STICKS[k][0] * 3, b = STICKS[k][1] * 3;
      const dx = p[b] - p[a], dy = p[b + 1] - p[a + 1], dz = p[b + 2] - p[a + 2];
      const d = Math.hypot(dx, dy, dz) || 1e-6, f = (d - LEN[k] * rope.scale) / d * 0.5;
      p[a] += dx * f; p[a + 1] += dy * f; p[a + 2] += dz * f;
      p[b] -= dx * f; p[b + 1] -= dy * f; p[b + 2] -= dz * f;
    }
  }
  for (let i = 0; i < POINTS * 3; i += 3) {
    const floor = groundAt(p[i], p[i + 2]) + 0.09;
    if (p[i + 1] < floor) {
      p[i + 1] = floor;
      if (q[i + 1] < floor) q[i + 1] = floor;
      q[i] = p[i] - (p[i] - q[i]) * TUMBLE.friction; q[i + 2] = p[i + 2] - (p[i + 2] - q[i + 2]) * TUMBLE.friction;
    }
  }
  rope.t += dt;
  rope.speed = moved / POINTS / dt;
  rope.still = rope.speed < TUMBLE.restSpeed ? rope.still + dt : 0;
  if (rope.still >= TUMBLE.restFor || rope.t >= TUMBLE.longest) rope.done = true;
  return rope.done;
}

// What a hit does to a person (plan/04-systems.md section 4, plan/bible/systems/people.md): everyone has
// 50 health; a vehicle takes off km/h - 10. Over 50 km/h, or with no health left, they stay down
// and an ambulance is called; otherwise they tumble, lie dazed and get up.
export const HIT = { health: 50, hardKmh: 50, spare: 10, downFor: 120, downUnseen: 45 };
export function hitOutcome(kmh, health = HIT.health) {
  const left = Math.max(0, health - Math.max(0, kmh - HIT.spare));
  return { health: left, down: kmh > HIT.hardKmh || left <= 0 };
}
