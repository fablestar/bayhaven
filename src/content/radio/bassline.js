// Bassline FM: the club station. Half-time songs with sliding 808s and rolling hats, and
// four-on-the-floor club songs. From plan/bible/radio/bassline-fm.md (tier A: songs 1 to 3, lines 1 to 6, idents 1 and 2).
export default {
  id: 'bassline', name: 'Bassline FM', freq: '101.9', dial: 8, tier: 'A', slogan: 'Ninety-four percent bass.',
  host: { name: 'DJ Subtropic', voice: { wave: 'sine', hz: 98, ms: 80, rate: 5, sub: true, echo: 0.06 } },
  recipe: { bpm: [130, 150], scales: ['minor', 'phrygian'], kit: 'club', instruments: ['kick', 'snare', 'clap', 'hat', 'open-hat', 'bass-808', 'saw-bass', 'lead', 'pluck', 'bell', 'riser', 'sub-drop', 'foghorn'] },
  startsIn: ['sailfin', 'cobia', 'bonito', 'snapper', 'pinfish', 'skimmer', 'dragonfly', 'anchovy', 'gnat', 'wahoo', 'needlefish', 'sandflea', 'swordtail'], firstFor: 'teo',
  // the 808 is the loudest thing here, with a 500 ms decay; each kick dips it 6 dB for 60 ms
  kit: { kick: ['kick', { variant: 'club', gain: -2 }], bass: ['bass-808', { decay: 0.5, gain: 3 }], lead: ['lead', { variant: 'one', gain: 1 }], pad: ['pad'] },
  duck: { bass: [6, 0.06], pad: [5, 0.18] },
  songs: [{
    title: 'Ninety-Four Percent', artist: 'Kid Condensation', seed: 10191, bpm: 140, key: 'F', scale: 'minor', bars: 4,
    chords: ['Fm', 'Db'],
    kick: 'x.....x...x.....', snare: '........x.......', clap: '........x.......', hat: 'x.x.x.xrx.x.x.rr', when: { clap: 'verse drop' },
    bass: '1---..1-..~5--.~1-', lead: '5..5..5.|.5..5.5.', oneNote: true, pad: 'none', kit: { lead: ['bell', { gain: 3 }] },
    form: [['intro', 4], ['verse', 16], ['drop', 8], ['verse', 16], ['drop', 8], ['out', 4]],
  }, {
    title: 'Guest List Says No', artist: 'Low Pressure Lisa', seed: 10192, bpm: 130, key: 'G', scale: 'minor', bars: 2,
    chords: ['Gm', 'Eb', 'Bb', 'F'],
    kick: 'x...x...x...x...', snare: '....x.......x...', clap: '....x.......x...', hat: '..o...o...o...o.', when: { clap: 'drop' },
    bass: '..1...1...1...1.', lead: '88.8.88.|88.8.78.', oneNote: true, pad: 'whole', kit: { bass: ['saw-bass', { gain: 4 }], lead: ['pluck', { gain: 3 }] },
    form: [['intro', 8], ['build', 8], ['drop', 16], ['break', 8], ['build', 8], ['drop', 16], ['out', 8]],
  }, {
    title: 'Sandbag Season', artist: 'Wet Bulb Collective', seed: 10193, bpm: 150, key: 'D', scale: 'minor', bars: 4,
    chords: ['Dm', 'Bb'],
    kick: 'x..x..x...x.....', snare: '........x.......', clap: '........x.......', hat: 'x..x..x.x..x..xr',
    fog: 'x...............', sub: 'x...............', when: { clap: 'verse drop', fog: 'last8', sub: 'first:drop' },
    bass: '1--1--1-..~5--...', lead: '8..8..7.|8..8..5.', oneNote: true, pad: 'none',
    form: [['intro', 4], ['verse', 16], ['drop', 8], ['verse', 16], ['drop', 16], ['out', 4]],
  }],
  lines: [
    'any · Humidity\'s at ninety-four percent. So is this bassline.',
    'any · Bassline FM, 101.9. I\'m DJ Subtropic. Tonight\'s low is forty hertz.',
    'storm · Three-fifteen. Precipitation: one hundred percent. Duration: forty minutes. Bass: unaffected.',
    'after-song · That front has passed. Another is moving in from the east at one hundred and forty beats a minute.',
    'cut · Advisory. The Sheriff is taking this frequency. Expect scattered gunfire and a seventy percent chance of a body.',
    'back · All clear. Viewers at zero, pressure falling. We return you to your scheduled low end.',
  ],
  idents: ['Bassline FM. Ninety-four percent bass.', 'One-oh-one point nine. Bassline FM. Tonight\'s low: forty hertz.'],
  ads: ['spf-1000', 'lawyer-larry', 'bayhaven-tomorrow', 'storm-mart', 'big-earls', 'gator-putt', 'cash-4-jet-skis', 'pelican-fuel', 'lava-abuela', 'bun-voyage', 'bay-cab'],
};
