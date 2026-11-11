// The first hints and the door prompt. Hints are one line and vanish when the thing is done.
// STAND-IN (the door prompt only): the player module should emit ui:prompt itself when a door is
// in reach; until it does, this asks modules.player.nearest() ten times a second.
export default {
  name: 'coach', order: 73,
  init(ctx) {
    const ev = ctx.events, S = ctx.state, touch = window.matchMedia('(pointer: coarse)').matches;
    let prompt = '', walked = false, stop = null;
    ev.once('game:ready', () => ev.emit('ui:hint', { id: 'drive', seconds: 20,
      text: touch ? 'Hold Gas to drive, hold Handbrake in a turn to slide' : 'WASD or arrows to drive, Space for the handbrake, F to get out' }));
    ev.on('input:first', () => ev.emit('ui:hint:done', { id: 'drive' }));
    ev.on('vehicle:exited', () => {
      if (walked) return;
      walked = true;
      ev.emit('ui:hint:done', { id: 'drive' });
      ev.emit('ui:hint', { id: 'walk', text: touch ? 'Push the stick to walk, drag the right side to look around' : 'Shift to sprint, Space to jump, drag to look around' });
    });
    ev.on('vehicle:entered', () => ev.emit('ui:hint:done', { id: 'walk' }));
    stop = ctx.loop.every(0.1, () => {
      const p = ctx.modules.player;
      let text = '';
      if (S.player.mode === 'foot' && p && p.nearest && !S.ui.paused) { const n = p.nearest(); if (n) text = 'Get in'; }
      if (text === prompt) return;
      prompt = text;
      ev.emit('ui:prompt', text ? { key: 'F', text } : null);
    });
    return { get prompt() { return prompt; }, stop: () => stop && stop() };
  },
};
