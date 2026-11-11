// Scripted clips, one per day. A clip is a start pose, an hour and a list of timed holds,
// played through the same input and physics as a player, so it comes out the same every time.

export const CLIPS = {
  // sunset, down the beachfront, handbrake round the plaza corner. 12 seconds.
  'day-2': {
    hour: 18.9,
    start: { x: -95, z: 40.5, h: Math.PI / 2 },
    script: [
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
  },
};
