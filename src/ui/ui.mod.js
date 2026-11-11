// The small API other lanes call to put words on the HUD. Everything here is an event, so a lane
// may also emit the event itself: ui:toast { text, seconds, tone } (tone: 'gain' or 'bad'; with
// kind: 'subtitle' and who it is a spoken line), ui:prompt { key, text } (null clears it),
// ui:hint { id, text, seconds } (shown once per id), ui:hint:done { id }, ui:tag { text, sub, colour }.
// Public object: toast(text, seconds) · prompt(key, text) · clearPrompt() · hint(id, text) ·
//   hintDone(id) · tag(text, sub). Not built yet: card(spec) (the postcard, wristband and mugshot board).
export default {
  name: 'ui', order: 71,
  init(ctx) {
    const emit = (name, data) => ctx.events.emit(name, data);
    return {
      toast: (text, seconds) => emit('ui:toast', { text, seconds }),
      prompt: (key, text) => emit('ui:prompt', { key, text }),
      clearPrompt: () => emit('ui:prompt', null),
      hint: (id, text, seconds) => emit('ui:hint', { id, text, seconds }),
      hintDone: (id) => emit('ui:hint:done', { id }),
      tag: (text, sub) => emit('ui:tag', { text, sub }),
    };
  },
};
