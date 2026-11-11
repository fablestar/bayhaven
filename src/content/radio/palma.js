// Radio Palma: Palma Vieja's station. Dembow at 92 to 104, salsa at 180, loud enough for the
// whole street. From plan/bible/radio/radio-palma.md (tier A: songs 1 to 3, lines 1 to 6, idents 1 and 2).
export default {
  id: 'palma', name: 'Radio Palma', freq: '92.5', dial: 4, tier: 'A', slogan: 'Más alto, vecino.',
  host: { name: 'El Capitán Memo', voice: { wave: 'triangle', hz: 165, ms: 55, rate: 8, end: 0.15 } },
  recipe: { bpm: [92, 104], salsa: 180, scales: ['minor', 'phrygian', 'major'], kit: 'dembow', instruments: ['kick', 'snare', 'hat', 'bass-808', 'piano', 'brass', 'marimba', 'cowbell', 'clave', 'conga', 'guiro'] },
  startsIn: ['flounder', 'pompano', 'possum', 'fiddler', 'pelican', 'conch'],
  // dembow: the snare dry and a touch over the kick; the 808 rings 400 ms and dips 3 dB under each kick
  kit: { kick: ['kick', { variant: 'dembow' }], snare: ['snare', { gain: 4 }], bass: ['bass-808', { decay: 0.4 }], lead: ['piano'], pad: ['marimba'], stab: ['brass'], bell: ['cowbell'], double: ['marimba'] },
  duck: { bass: [3, 0.1] },
  songs: [{
    title: 'Sube el Volumen, Vecino', artist: 'Los Ventiladores de Techo', seed: 9251, bpm: 96, key: 'A', scale: 'minor', bars: 2,
    chords: ['Am', 'F', 'G', 'Em'],
    kick: 'x...x...x...x...', snare: '...x..x....x..x.', hat: 'x.x.x.x.x.x.x.x.', stab: 'x.....x.........', when: { stab: 'chorus' },
    bass: '1..1..1...5...8.', lead: '5.565.3.|4.454.2.', double: true, pad: 'none',
    form: [['intro', 4], ['verse', 8], ['chorus', 8], ['verse', 8], ['chorus', 8], ['break', 4], ['chorus', 8], ['out', 4]],
  }, {
    // salsa: a step is an eighth note, so sixteen steps are two bars and one clave. The snare
    // line is a rim click, the hat line is the güiro, and each bass `1` is the next chord, early.
    title: 'Cafecito a las Tres', artist: 'Orquesta Paraguas Roto', seed: 9252, bpm: 180, key: 'C', scale: 'major', bars: 1, div: 2,
    chords: ['Dm7', 'G7', 'Cmaj7', 'A7'],
    kick: 'x.......x.......', snare: 'x.x.xx.xx.xx.xx.', hat: 'x.xxx.xxx.xxx.xx',
    clave: '..x.x...x..x..x.', bell: 'X.xxX.xxX.xxX.xx', conga: '..x...xx..x...xx', stab: 'x.x..x..', when: { stab: 'brass last8' },
    bass: '...5..1....5..1.', bassAhead: 2, lead: '1.35.8.5|.3.5.8.5', montuno: true, pad: 'none',
    kit: { kick: ['kick', { variant: 'soft' }], snare: ['rim'], hat: ['guiro'], bass: ['bass-808', { decay: 0.3 }] },
    form: [['intro', 4], ['verse', 16], ['montuno', 16], ['brass', 8], ['montuno', 16], ['out', 4]],
  }, {
    title: 'Calle Guayaba No Duerme', artist: 'La Nevera Rota', seed: 9253, bpm: 100, key: 'E', scale: 'phrygian', bars: 2,
    chords: ['Em', 'F', 'G', 'F'],
    kick: 'x...x...x...x...', snare: '...x..x....x..x.', hat: 'x.xxx.xxx.xxx.xx', bell: '..x...x...x...x.',
    bass: '1..1..1..1..5,.1.', lead: '1.21.7,1.|3.21.21.', pad: 'whole',
    form: [['intro', 8], ['verse', 8], ['chorus', 8], ['verse', 8], ['chorus', 8], ['out', 4]],
  }],
  lines: [
    'any · If you can hear this, turn it up. If your neighbour can hear this, you\'re welcome, neighbour.',
    'any · Buenos días, buenas tardes, buenas noches. I don\'t know when you\'re listening, mi gente, so take all three.',
    'storm · Las tres y cuarto. Here comes the rain, right on time. Bring in the laundry, abuela. I\'ll wait.',
    'after-song · That one was for table three in Domino Park. Play the tile, Hector. We all know you have it.',
    'cut · Oye, the Sheriff is borrowing the station. He does not say please. Stay close, mi gente, and stay low.',
    'after-ad · That was an ad, familia. I read them fast so there\'s more time for the music.',
  ],
  idents: ['Radio Palma. Más alto, vecino.', 'Noventa y dos punto cinco. Ninety-two point five. Radio Palma, louder than your neighbour.'],
  ads: ['spf-1000', 'lawyer-larry', 'bayhaven-tomorrow', 'storm-mart', 'big-earls', 'gator-putt', 'cash-4-jet-skis', 'pelican-fuel', 'lava-abuela', 'bay-cab'],
};
