// The player's health (100) and armour (100, a life vest), and what happens at zero: Knocked out.
// Writes state.player.health and state.player.armour (the bible keeps them in state.player).
// Public object: { hurt(dmg, { ranged, weapon, by, x, z, raw }) → taken, heal(n), vest(n), knockOut(), wake(),
//   down (true while knocked out), hospital() → { x, z, standIn }, numbers }.
// Emits player:hurt { dmg, health, armour, by, weapon, x, z }, player:knockedout { bill, cash, lead, x, z, seconds },
//   player:woke { x, z, health, standIn }, cash:changed.
// Listens: combat:hit (a deputy's shot that landed), vehicle:blast, game:reset.
import { WHO, COMBAT } from '../content/weapons.js';

let api = null;
export default {
  name: 'health', order: 31, needs: ['player'],
  init(ctx) {
    const S = ctx.state, p = S.player, ev = ctx.events, m = ctx.modules, MAX = WHO.player;
    let sinceHit = 99, ko = null;
    p.health = MAX.health; p.armour = 0;

    // Bayhaven General, pulled inside today's map (Northgate is not built yet), then the kerb of the nearest road
    function hospital() {
      const B = m.map && m.map.bounds, H = COMBAT.hospital;
      const hx = B ? Math.max(B.x0 + 80, Math.min(B.x1 - 80, H.x)) : H.x, hz = B ? Math.max(B.z0 + 80, Math.min(B.z1 - 80, H.z)) : H.z;
      const road = m.map && m.map.nearestRoad ? m.map.nearestRoad(hx, hz) : null;
      const at = road && road.d < 200 ? { x: road.x + Math.cos(road.heading) * (road.width / 2 + 1.5), z: road.z - Math.sin(road.heading) * (road.width / 2 + 1.5) } : { x: hx, z: hz };
      return { x: at.x, z: at.z, standIn: at.x !== H.x || at.z !== H.z };
    }

    // dmg is the weapon table's number. A weapon in someone's hands does half of it to the player;
    // a vest takes 80% of a ranged hit while it lasts. `raw` skips the halving (the number is already the player's).
    function hurt(dmg, o = {}) {
      if (ko || !(dmg > 0)) return 0;
      if (o.weapon && !o.raw) dmg *= COMBAT.playerTakes;
      const soak = o.ranged ? Math.min(p.armour, dmg * COMBAT.vestSoak) : 0;
      p.armour -= soak; p.health -= dmg - soak; sinceHit = 0;
      ev.emit('player:hurt', { dmg, health: Math.max(0, p.health), armour: p.armour, by: o.by || null, weapon: o.weapon || null, x: o.x, z: o.z });
      if (p.health <= 0) knockOut();
      return dmg;
    }

    // Knocked out: 5% of cash up to $2,500, the screen for 5 s (the UI may end it early), then awake at the hospital point
    function knockOut() {
      if (ko) return null;
      const eco = S.economy, bill = Math.min(COMBAT.billMost, Math.round(eco.cash * COMBAT.bill));
      p.health = 0;
      eco.cash -= bill;
      if (bill) ev.emit('cash:changed', { cash: eco.cash, by: -bill, why: 'knockedout' });
      ko = { t: 0, bill };
      ctx.input.inject(() => !ko);                    // nobody walks or drives while the screen is up
      const out = { bill, cash: eco.cash, lead: p.id, x: p.x, z: p.z, seconds: COMBAT.screen };
      ev.emit('player:knockedout', out);
      return out;
    }
    function wake() {
      if (!ko) return null;
      ko = null;
      const at = hospital();
      if (m.heat && m.heat.clear) m.heat.clear();
      if (m.player) { if (m.player.mode === 'car') m.player.exit(); m.player.teleport(at.x, at.z, 0); }
      if (m.chunks && m.chunks.ensure) m.chunks.ensure(at.x, at.z, 1);
      p.health = COMBAT.wakeHealth; sinceHit = 99;
      const out = { x: at.x, z: at.z, health: p.health, standIn: at.standIn };
      ev.emit('player:woke', out);
      return out;
    }

    // a deputy's shot that landed (cops.mod.js): 9 on foot, already the player's half; in a car it is the car's
    ev.on('combat:hit', (e) => {
      if (!e || e.target !== 'player' || e.applied) return;
      if (p.mode === 'foot') hurt(e.damage, { ranged: true, raw: true, weapon: e.weapon, by: e.by, x: e.x, z: e.z });
      else if (m.damage && m.damage.hurt && m.vehicles) m.damage.hurt(m.vehicles.player, e.damage, { shot: true });
    });
    // a vehicle going up within 6 m: 120 at its centre, nothing at the edge
    ev.on('vehicle:blast', (e) => {
      if (!e || p.mode !== 'foot') return;
      const r = e.radius || 6, d = Math.hypot(p.x - e.x, p.z - e.z);
      if (d < r) hurt(120 * (1 - d / r), { by: 'blast', x: e.x, z: e.z });
    });
    ev.on('game:reset', () => { ko = null; p.health = MAX.health; sinceHit = 99; });

    ctx.save.section('health', { version: 1, get: () => ({ health: p.health, armour: p.armour }),
      set(d) { if (d) { p.health = d.health > 0 ? d.health : MAX.health; p.armour = d.armour || 0; } } });

    api = {
      hurt, knockOut, wake, hospital, numbers: COMBAT, max: MAX,
      get down() { return !!ko; },
      heal(n) { if (!ko) p.health = Math.min(MAX.health, p.health + n); return p.health; },
      vest(n = MAX.vest) { p.armour = Math.max(0, Math.min(MAX.vest, n)); return p.armour; },
      step(dt) {
        sinceHit += dt;
        if (ko) { ko.t += dt; if (ko.t >= COMBAT.screen) wake(); return; }
        // it creeps back to 30 on its own after 6 s without a hit; food does the rest (shops are not built)
        if (sinceHit > COMBAT.regenAfter && p.health < COMBAT.regenTo) p.health = Math.min(COMBAT.regenTo, p.health + COMBAT.regenRate * dt);
      },
    };
    const T = ctx.test;
    T.health = () => ({ health: p.health, armour: p.armour, down: !!ko, bill: ko ? ko.bill : 0, sinceHit, hospital: hospital(), max: MAX });
    T.health.set = (n) => { p.health = Math.min(MAX.health, n); if (n <= 0) knockOut(); return T.health(); };
    T.health.vest = (n) => { api.vest(n); return T.health(); };
    T.health.hurt = (dmg, o) => { hurt(dmg, o); return T.health(); };
    T.health.wake = () => wake();
    return api;
  },
  update(dt) { if (api) api.step(dt); },
};
