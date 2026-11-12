// The day 5 clip: night on the beachfront, heat 3. Three cruisers behind with their bars lit,
// a handbrake turn round the plaza corner, the viewer count climbing and the chat flying. 13 seconds.
// `heat`, `viewers` and `cops` are read by src/systems/heat.mod.js when the clip starts.

export default {
  id: 'day-5', seconds: 13, hour: 21.5, weather: 'clear', vehicle: 'heron', camera: 'chase',
  heat: 3, viewers: 6400, cops: 3,
  at: { x: -95, z: 40.5, heading: Math.PI / 2 },
  inputs: [
    { t: 0, hold: ['gas'] },
    { t: 6.9, hold: ['brake'] },                       // scrub speed for the corner
    { t: 7.4, hold: ['gas', 'left', 'handbrake'] },    // pivot, with the sirens right behind
    { t: 8.3, hold: ['gas', 'left'] },
    { t: 8.8, hold: ['gas', 'right'] },                // catch the slide
    { t: 9.1, hold: ['gas'] },
    { t: 9.7, hold: ['gas', 'left'] },
    { t: 9.88, hold: ['gas'] },
    { t: 13, hold: [] },
  ],
};
