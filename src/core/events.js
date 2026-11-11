// The event bus. Lanes talk to each other through this and through state, never by imports.
//   events.on(name, fn) returns a function that takes the listener off again
//   events.once(name, fn), events.emit(name, payload), events.count(name)
// Handlers run at once, in the order they were added. A handler that throws is caught and
// counted, and the others still run.

export function createEvents() {
  const subs = new Map(), counts = new Map(), errors = [];
  const none = Object.freeze({});
  const events = {
    errors,
    on(name, fn) {
      let list = subs.get(name);
      if (!list) subs.set(name, list = []);
      list.push(fn);
      return () => { const i = list.indexOf(fn); if (i >= 0) list.splice(i, 1); };
    },
    once(name, fn) {
      const off = events.on(name, (data) => { off(); fn(data); });
      return off;
    },
    emit(name, data = none) {
      counts.set(name, (counts.get(name) || 0) + 1);
      const list = subs.get(name);
      if (!list) return;
      for (let i = 0; i < list.length; i++) {
        const fn = list[i];
        try { fn(data); } catch (e) { errors.push(`event ${name}: ${e && e.message}`); console.error(e); }
        if (list[i] !== fn) i--;               // the handler took itself off
      }
    },
    count(name) { return counts.get(name) || 0; },
  };
  return events;
}
