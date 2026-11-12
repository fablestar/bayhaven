// The day 6 clip: golden hour on Heron Walk Drive, in front of the plaza. Mags's pink coupe rams
// the tow truck for the third time, the scooter swings off the hook and slides to the kerb, cut to
// the postcard result card and the `Delivered` stamp landing. 12 seconds.
// `mission` is read by src/systems/missions.mod.js when the clip starts: the mission is put at its
// ram step with two rams already counted; `cut` is the film edit to the result card.
const E = Math.PI / 2;

export default {
  id: 'day-6', seconds: 12, hour: 18.7, weather: 'clear', vehicle: 'heron', camera: 'chase',
  at: { x: -95, z: 40.5, heading: E },
  mission: {
    id: 'final-notice', from: 3, counters: { rams: 2 }, cut: { step: 3, seconds: 2.6 },
    player: { model: 'heron', x: -95, z: 40.5, h: E, speed: 20, paint: 0xff4f6e, accent: 0x29e6ff },
    actors: { truck: { x: -64, z: 40.5, go: true, speed: 15.3 } },
  },
  inputs: [
    { t: 0, hold: ['gas'] },
    { t: 4.6, hold: ['brake'] },          // she lifts off once the scooter is loose
    { t: 6.2, hold: [] },
    { t: 12, hold: [] },
  ],
};
