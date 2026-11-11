// STAND-IN: a tiny event bus until session D2-S2 ships the real one in src/core/.
// Same shape as the plan: events.on(name, fn), events.emit(name, data), events.count(name).
const subs = new Map(), counts = new Map();
export const events = {
  on(name, fn) { if (!subs.has(name)) subs.set(name, []); subs.get(name).push(fn); },
  emit(name, data = {}) {
    counts.set(name, (counts.get(name) || 0) + 1);
    const list = subs.get(name);
    if (list) for (const fn of list) fn(data);
  },
  count(name) { return counts.get(name) || 0; },
};
