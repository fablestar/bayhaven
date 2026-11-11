// The clock. Starts mid-afternoon and rolls on to sunset, dusk and night, then round again.
// One clock drives the sky, the sea, the fog, the neon and the windows. Owns state.clock.

function hoursPerSecond(h) {
  if (h >= 17.8 && h < 20.6) return 1 / 24;   // linger on the sunset
  if (h >= 21.5 || h < 5) return 1 / 3;        // nights go by quickly
  return 1 / 11;
}

export default {
  name: 'clock', order: 5, renderOrder: 1,
  init(ctx) {
    const c = ctx.state.clock;
    c.hour = parseFloat(ctx.params.get('hour')) || 14;
    const clock = {
      get hour() { return c.hour; },
      set(hour) { c.hour = ((hour % 24) + 24) % 24; },
      // jump to the next good bit: sunset, then night, then morning, then afternoon (the T key)
      skip() { const h = c.hour; c.hour = h < 5.5 ? 7 : h < 13.5 ? 14 : h < 18.3 ? 18.6 : h < 19.4 ? 19.5 : h < 20.6 ? 21.6 : 7; },
    };
    ctx.events.on('input:press', ({ name }) => { if (name === 'skipTime') clock.skip(); });
    return clock;
  },
  // the clock runs on drawn time, as on day 1, so running the simulation ahead in a test leaves the hour alone
  render(alpha, ctx) {
    const c = ctx.state.clock, was = Math.floor(c.hour);
    c.hour = (c.hour + ctx.loop.dt * c.speed * hoursPerSecond(c.hour)) % 24;
    if (Math.floor(c.hour) !== was) ctx.events.emit('clock:hour', { hour: Math.floor(c.hour) });
  },
};
