// The day 2 clip: sunset, down the beachfront, handbrake round the plaza corner. 12 seconds.

export default {
  id: 'day-2', seconds: 12, hour: 18.9, weather: 'clear', vehicle: 'heron', camera: 'chase',
  at: { x: -95, z: 40.5, heading: Math.PI / 2 },
  inputs: [
    { t: 0, hold: ['gas'] },
    { t: 6.9, hold: ['brake'] },                       // scrub speed for the corner
    { t: 7.4, hold: ['gas', 'left', 'handbrake'] },    // pivot
    { t: 8.3, hold: ['gas', 'left'] },
    { t: 8.8, hold: ['gas', 'right'] },                // catch the slide
    { t: 9.1, hold: ['gas'] },
    { t: 9.7, hold: ['gas', 'left'] },                 // straighten up the side street
    { t: 9.88, hold: ['gas'] },
    { t: 12, hold: [] },
  ],
};
