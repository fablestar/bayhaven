// The phone's messages (plan/bible/story/messages.md, "How messages work"). One thread per sender; an offer is
// sent on mission:offered and stays pinned until mission:started. Tapping a text that has a seed sets the waypoint.
// A new text plays two blips at the sender's pitch and shows as a pill above the minimap for 4 s.
// Emits phone:message { id, from, name, text, mission }.
import { MESSAGES, SENDERS } from '../../content/messages.js';

export function createInbox(ctx) {
  const S = ctx.state, ev = ctx.events, m = ctx.modules;
  const items = [], stats = { received: 0, waypoints: 0, blips: 0 };
  let nextId = 1;
  const stamp = () => { const h = S.clock.hour; return String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.floor((h % 1) * 60)).padStart(2, '0'); };

  function blip(hz) {
    const a = m.audio, ac = a && a.ctx;
    if (!ac || a.muted || !a.bus) return;
    try {
      for (let i = 0; i < 2; i++) {
        const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + i * 0.16;
        o.type = 'sine'; o.frequency.value = hz * 2 * (i ? 1.25 : 1);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
        o.connect(g); g.connect(a.bus('ui')); o.start(t); o.stop(t + 0.14);
      }
      stats.blips++;
    } catch { /* no sound is not an error */ }
  }

  // { from, text, waypoint: [x, z], mission, pinned, mine, quiet }
  function add(msg) {
    const who = SENDERS[msg.from] || { name: msg.from, hz: 220 };
    const item = { id: nextId++, from: msg.from, name: who.name, text: msg.text, waypoint: msg.waypoint || null, mission: msg.mission || null,
      pinned: !!msg.pinned, mine: !!msg.mine, unread: !msg.mine && !msg.read, at: stamp(), order: nextId };
    items.push(item); stats.received++;
    if (item.unread && !msg.quiet) blip(who.hz);
    ev.emit('phone:message', { id: item.id, from: item.from, name: item.name, text: item.text, mission: item.mission, unread: item.unread });
    return item;
  }

  ev.on('mission:offered', (e) => {
    if (!e || items.some((i) => i.mission === e.id && i.pinned)) return;
    const lead = S.chars.active, rows = MESSAGES.filter((r) => r.on === 'mission:offered' && r.when.id === e.id);
    const row = rows.find((r) => r.from !== lead) || rows[0];
    const def = m.missions && m.missions.get(e.id), from = row ? row.from : (def && def.giver) || 'teo';
    // a mission's own start marker wins over the bible's seed when they differ (the marker is where it starts)
    add({ from, text: row ? row.text : e.text || `${e.title} is on offer.`, waypoint: [e.x, e.z], mission: e.id, pinned: true, mine: from === lead && rows.length === 1 });
  });
  const settle = (e) => { for (const i of items) if (e && i.mission === e.id) { i.pinned = false; i.unread = false; } };
  ev.on('mission:started', settle);
  ev.on('mission:completed', settle);

  return {
    items, stats, add,
    get unread() { return items.filter((i) => i.unread).length; },
    // pinned offers first, then newest first
    list: () => items.slice().sort((a, b) => (b.pinned - a.pinned) || b.order - a.order),
    threads() { const out = {}; for (const i of items) (out[i.from] = out[i.from] || { from: i.from, name: i.name, items: [] }).items.push(i); return Object.values(out); },
    read(id) { const i = items.find((q) => q.id === id); if (i) i.unread = false; return i || null; },
    // tap: read it, and set the waypoint if it carries a seed
    tap(id) {
      const i = this.read(id);
      if (!i || !i.waypoint || !m.gps) return false;
      const ok = m.gps.setWaypoint(i.waypoint[0], i.waypoint[1]);
      if (ok !== false) stats.waypoints++;
      return ok !== false;
    },
  };
}
