// Tideline 98: the night-drive station. Synth-pop with gated pads, arpeggios and a snare that
// rings out. From plan/bible/radio/tideline-98.md (tier A: songs 1 to 3, lines 1 to 6, idents 1 and 2).
export default {
  id: 'tideline98', name: 'Tideline 98', freq: '98.3', dial: 7, tier: 'A', slogan: 'Driving nowhere on purpose.',
  host: { name: 'Nightshift Nina', voice: { wave: 'sine', hz: 205, ms: 70, rate: 6, end: -0.08 } },
  recipe: { bpm: [96, 118], scales: ['major', 'dorian'], kit: 'pop', instruments: ['kick', 'snare', 'hat', 'tom', 'saw-bass', 'lead', 'pad', 'pluck', 'bell'] },
  startsIn: ['heron', 'tarpon', 'taxi', 'tern', 'skipjack', 'coquina', 'spoonbill', 'sandshark', 'manatee'], firstFor: 'mags',
  // snare: the long tail. pad: gated. arp: the glass arp. The pad dips 4 dB on every kick.
  kit: { snare: ['snare', { variant: 'tail', gain: 2 }], bass: ['saw-bass', { gain: 2 }], lead: ['lead', { gain: 1 }], pad: ['pad'], arp: ['pluck', { variant: 'glass', gain: -2 }] },
  duck: { pad: [4, 0.12] },
  songs: [{
    title: 'Low Sun, High Tide', artist: 'Motel Ice Machine', seed: 9801, bpm: 104, key: 'A', scale: 'dorian', bars: 4,
    chords: ['Am7', 'D9', 'Fmaj7', 'E7'],
    kick: 'x...x...x...x...', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.',
    bass: '1..1..5..1..b7..5', lead: '5.653.1.|3.5.6...', pad: 'gate8',
    form: [['intro', 4], ['verse', 8], ['chorus', 8], ['verse', 8], ['chorus', 8], ['break', 4], ['chorus', 8], ['out', 4]],
  }, {
    title: 'Valet Parking for Ghosts', artist: 'Sodium Sweetheart', seed: 9802, bpm: 112, key: 'C', scale: 'major', bars: 2,
    chords: ['Fmaj7', 'G6', 'Em7', 'Am7'],
    kick: 'x...x...x...x...', snare: '....x.......x...', hat: '..o...o...o...o.',
    bass: '1.1.1.1.1.1.1.8.', lead: '3.5.8.75|6.5.323.', pad: 'whole', arp: '1585',
    form: [['intro', 8], ['verse', 8], ['chorus', 8], ['verse', 8], ['chorus', 16], ['out', 4]],
  }, {
    title: 'Second Shift at the Car Wash', artist: 'Pastel Alibi', seed: 9803, bpm: 98, key: 'D', scale: 'dorian', bars: 2,
    chords: ['Dm9', 'G13', 'Cmaj7', 'Am7'],
    kick: 'x.....x.x.......', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.', tom: '............x.xx', when: { tom: 'last8' },
    bass: '1.....1.5.....8.', lead: '5--43.1.|2--35...', pad: 'x.xxx.xx', padHalf: true,
    form: [['intro', 4], ['verse', 8], ['chorus', 8], ['break', 4], ['verse', 8], ['chorus', 8], ['out', 8]],
  }],
  // each line starts with when it may play
  lines: [
    'night · It\'s 2 a.m., the roads are empty, and so is my fridge. This one\'s for everybody driving nowhere on purpose.',
    'any · You\'re on Tideline 98. I\'m Nina. The day host is running late. It has been eleven years.',
    'day · It\'s {hour} in Bayhaven, which means somewhere it\'s 2 a.m. Keep the windows down for them.',
    'storm · Three-fifteen. There\'s the rain. If you parked under a palm, that was a choice, and I respect it.',
    'after-song · That one goes out to the valet asleep in a Sailfin outside Hotel Alba. Sleep well. Check the handbrake.',
    'cut · The Sheriff wants my frequency again. He never asks. Somebody\'s about to get shot on television. Back after.',
  ],
  idents: ['Tideline 98. Driving nowhere on purpose.', 'Ninety-eight point three. It\'s later than you think.'],
  ads: ['spf-1000', 'lawyer-larry', 'bayhaven-tomorrow', 'storm-mart', 'big-earls', 'gator-putt', 'manatee-mattress', 'pelican-fuel', 'bun-voyage', 'bay-cab'],
};
