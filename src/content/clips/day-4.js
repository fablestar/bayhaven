// The day 4 clip: dusk, up Coral Boulevard from the beach end as the towers light floor by floor,
// the Meridian Spire dead ahead with its pink light. 13 seconds. (The radio flip in the roadmap's
// clip line belongs to the radio session.)

export default {
  id: 'day-4', seconds: 13, hour: 19.05, weather: 'clear', vehicle: 'heron', camera: 'chase',
  at: { x: 59.4, z: -326, heading: Math.PI },           // the middle northbound lane, facing the Spire
  inputs: [
    { t: 0, hold: ['gas'] },
    { t: 13, hold: [] },
  ],
};
