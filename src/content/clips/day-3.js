// The day 3 clip: golden hour. The coupe pulls up by the promenade, Teo gets out on the sea side
// and walks down onto the beach. 12 seconds. The crowd he walks into arrives with the pedestrians.

export default {
  id: 'day-3', seconds: 12, hour: 18.0, weather: 'clear', vehicle: 'heron', camera: 'chase',
  at: { x: 19, z: 41.6, heading: -Math.PI / 2 },         // facing west, so the driver's door opens towards the sea
  inputs: [
    { t: 0, hold: ['gas'] },
    { t: 1.9, hold: ['brake'] },
    { t: 2.36, hold: [] },
    { t: 3.2, hold: [], press: 'interact' },             // out of the car: 0.8 s
    { t: 4.1, hold: ['gas'], look: [-0.9, 0.05] },       // walk, and swing the view round to the sea
    { t: 5.85, hold: ['gas'] },
    { t: 12, hold: [] },
  ],
};
