// Finds every *.mod.js under src/ and runs it. Adding a feature is adding a file: nobody
// edits a list. A module is { name, order, needs, init(ctx), update(dt, ctx), render(alpha, ctx), dispose() }.
// init returns the module's public object, kept at ctx.modules.<name>. Other lanes reach a
// module only through that object, events and state.
// Update order bands: 0-9 input and clock, 10-19 world, 20-29 vehicles, 30-39 actors,
// 40-49 systems, 50-59 audio, 60-69 camera, 70-79 UI, 90 and up test and debug.
// render runs once a frame, in `renderOrder` when a module gives one, else in `order`.

const files = import.meta.glob('../**/*.mod.js', { eager: true });

export function createRegistry(ctx) {
  const mods = [];
  for (const path in files) {
    const mod = files[path].default;
    if (!mod || !mod.name) { console.error('module without a name: ' + path); continue; }
    mods.push({ mod, name: mod.name, order: mod.order ?? 50, path: path.replace('../', 'src/'), ms: 0, off: false });
  }
  mods.sort((a, b) => a.order - b.order || (a.name < b.name ? -1 : 1));
  const names = new Set(mods.map((m) => m.name));
  const updaters = mods.filter((m) => m.mod.update);
  const drawers = mods.filter((m) => m.mod.render)
    .sort((a, b) => (a.mod.renderOrder ?? a.order) - (b.mod.renderOrder ?? b.order));

  const registry = {
    profile: false,          // the debug overlay turns this on to time each module
    init() {
      // in update order, but a module waits for the ones it needs (a needed module that
      // does not exist is not an error: it may arrive in a later session)
      const waiting = mods.slice();
      while (waiting.length) {
        let i = waiting.findIndex((m) => (m.mod.needs || []).every((n) => !names.has(n) || n in ctx.modules));
        if (i < 0) { console.error('modules need each other in a circle: ' + waiting.map((m) => m.name).join(', ')); i = 0; }
        const m = waiting.splice(i, 1)[0];
        ctx.modules[m.name] = (m.mod.init && m.mod.init(ctx)) || {};
      }
    },
    update(dt) {
      for (let i = 0; i < updaters.length; i++) {
        const m = updaters[i];
        if (m.off) continue;
        if (registry.profile) { const t0 = performance.now(); m.mod.update(dt, ctx); m.ms += (performance.now() - t0 - m.ms) * 0.05; }
        else m.mod.update(dt, ctx);
      }
    },
    render(alpha) {
      for (let i = 0; i < drawers.length; i++) if (!drawers[i].off) drawers[i].mod.render(alpha, ctx);
    },
    list: () => mods.map((m) => ({ name: m.name, order: m.order, path: m.path, ms: m.ms, off: m.off })),
    toggle(name) { const m = mods.find((x) => x.name === name); if (m) m.off = !m.off; return m ? m.off : null; },
    dispose() { for (const m of mods) if (m.mod.dispose) m.mod.dispose(ctx); },
  };
  return registry;
}
