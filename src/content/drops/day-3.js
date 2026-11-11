// The day 3 drop: Flamingo Flash Mob. 150 people in flamingo pink on the beach at (0, 64), in a
// grid 15 wide and 10 deep, doing one dance off one clock at sunset. Walk in and they shuffle
// aside, and the two nearest stop to film you. Drive at them, or fire a shot, and the grid breaks
// for the evening. Only built when the build day is 3. Numbers: plan/bible/systems/people.md, "Crowds".

export const MOB = { id: 'flamingo-flash-mob', x: 0, z: 64, cols: 15, rows: 10, gap: 1.6, bpm: 104, from: 17.5, to: 20.25,
  breakRange: 6, shuffleRange: 2, shuffle: 0.6, filmRange: 5, filmers: 2, pink: '#ff6fb8', streetCap: { low: 8, medium: 14, high: 20 } };
const KINDS = ['beachgoer', 'beachgoer', 'tourist', 'tourist', 'skater', 'retiree', 'clubber', 'jogger'];
const MOVES = ['arms up', 'step left', 'step right', 'spin'];

function createFlashMob(ctx) {
  const m = ctx.modules, peds = m.peds, events = ctx.events, S = ctx.state, hud = m.hud;
  const mob = { formed: false, broken: false, size: 0, beat: 0, move: MOVES[0], filming: 0, scattered: 0 };
  let crowd = null, homes = new Map(), filmers = [], label = '';
  const say = (text) => { if (text !== label && hud) { label = text; hud.drop(text); } };
  const inWindow = () => S.clock.hour >= MOB.from && S.clock.hour < MOB.to;

  function form() {
    crowd = peds.crowd({ id: MOB.id, x: MOB.x, z: MOB.z, streetCap: MOB.streetCap[ctx.quality.level] });
    homes = new Map(); filmers = [];
    let n = 0;
    for (let r = 0; r < MOB.rows; r++) for (let c = 0; c < MOB.cols; c++) {
      const x = MOB.x + (c - (MOB.cols - 1) / 2) * MOB.gap, z = MOB.z + (r - (MOB.rows - 1) / 2) * MOB.gap;
      const p = peds.join(crowd, KINDS[(n++ * 5 + r) % KINDS.length], x, z, Math.PI, MOB.pink);    // facing the promenade
      if (p) homes.set(p, { x, z });
    }
    mob.formed = true; mob.size = crowd.members.length; mob.beat = 0;
    events.emit('crowd:formed', { id: MOB.id, size: mob.size });
  }
  // the grid breaks: everyone runs from (x, z)
  function scatter(x, z) {
    if (!crowd) return;
    for (const p of crowd.members.slice()) peds.release(p, 'flee', x, z);
    peds.disband(crowd); crowd = null; mob.formed = false; mob.broken = true; mob.size = 0; mob.scattered++;
    events.emit('crowd:scattered', { id: MOB.id });
  }
  // the evening is over: they stop and wander off
  function goHome() {
    if (!crowd) return;
    for (const p of crowd.members.slice()) peds.release(p, 'walk');
    peds.disband(crowd); crowd = null; mob.formed = false; mob.size = 0;
  }
  events.on('weapon:fired', () => { if (crowd) scatter(S.player.x, S.player.z); });
  events.on('peds:rebuilt', () => { crowd = null; mob.formed = false; });

  Object.assign(mob, {
    numbers: MOB, moves: MOVES,
    get members() { return crowd ? crowd.members.length : 0; },
    reset() { if (crowd) { peds.disband(crowd); crowd = null; } mob.formed = false; mob.broken = false; },
    update(dt) {
      if (!peds || peds.disabled) return;
      if (!inWindow()) { if (crowd) goHome(); mob.broken = false; say('Flamingo Flash Mob, on the beach at sunset'); return; }
      if (mob.broken) { say('Flamingo Flash Mob, scattered. Back tomorrow at sunset'); return; }
      if (!crowd) form();
      mob.beat += dt * MOB.bpm / 60; crowd.beat = mob.beat;
      mob.move = MOVES[Math.floor(mob.beat / 2) % 4];
      const pl = S.player, onFoot = pl.mode === 'foot', half = MOB.cols * MOB.gap / 2 + 12;
      const close = Math.abs(pl.x - MOB.x) < half && Math.abs(pl.z - MOB.z) < half;
      let nearest = [], lost = false;
      for (const p of crowd.members) {
        if (p.gone || (p.state !== 'crowd' && !filmers.includes(p))) { lost = true; continue; }    // knocked out of the dance
        const home = homes.get(p);
        let tx = home.x, tz = home.z;
        if (close) {
          const dx = home.x - pl.x, dz = home.z - pl.z, d = Math.hypot(dx, dz);
          if (!onFoot && d < MOB.breakRange && pl.speed > 1) return scatter(pl.x, pl.z);
          if (onFoot && d < MOB.shuffleRange) { tx += dx / (d || 1) * MOB.shuffle; tz += dz / (d || 1) * MOB.shuffle; }
          if (onFoot && d < MOB.filmRange) nearest.push({ p, d });
        }
        p.x += (tx - p.x) * Math.min(1, dt * 5); p.z += (tz - p.z) * Math.min(1, dt * 5);      // the ones filming give him room too
        if (p.state === 'crowd') { p.beat = mob.beat; p.h = Math.PI; }
      }
      if (lost) crowd.members = crowd.members.filter((p) => !p.gone && (p.state === 'crowd' || filmers.includes(p)));
      // the two nearest stop and film him for as long as he is among them
      nearest.sort((a, b) => a.d - b.d);
      for (const { p } of nearest.slice(0, MOB.filmers)) if (!filmers.includes(p) && filmers.length < MOB.filmers) { peds.release(p, 'film'); if (p.state === 'film') filmers.push(p); }
      for (let i = filmers.length - 1; i >= 0; i--) {
        const p = filmers[i], d = Math.hypot(p.x - pl.x, p.z - pl.z);
        if (p.state === 'film' && onFoot && d < MOB.filmRange + 3) { p.own = 1; continue; }
        if (p.state === 'film') continue;                       // lowering the phone
        filmers.splice(i, 1);
        if (!peds.hold(crowd, p)) crowd.members = crowd.members.filter((q) => q !== p);
      }
      mob.filming = filmers.length; mob.size = crowd.members.length;
      say(`Flamingo Flash Mob, ${mob.size} dancing on the beach`);
    },
  });
  if (!peds || peds.disabled) say('Flamingo Flash Mob, on the beach at sunset');
  return mob;
}

export default {
  day: 3, id: MOB.id, marker: { x: MOB.x, z: MOB.z },
  start(ctx) { return createFlashMob(ctx); },
  stop() {},
};
