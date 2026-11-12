// Who speaks in missions: the name on the subtitle, the speech blip (plan/03: Mags 180 Hz low and
// dry, Teo 260 Hz quick and bright) and what the small portrait is drawn from. No faces are files.
// `voice` is the shape src/audio/voice.js speaks: { wave, hz, ms, rate, end }.

export const CAST = {
  mags:  { name: 'Mags',  voice: { wave: 'triangle', hz: 180, ms: 70, rate: 9,  end: -0.08 }, shirt: '#ff9eb5', skin: '#e9b995', hair: '#dfe3e8', hat: 'visor',    hatColour: '#29e6ff' },
  teo:   { name: 'Teo',   voice: { wave: 'sine',     hz: 260, ms: 50, rate: 13, end: 0.12 },  shirt: '#3fd6c8', skin: '#c9905f', hair: '#f6eaa6', hat: null,       hatColour: null },
  marco: { name: 'Marco', voice: { wave: 'square',   hz: 140, ms: 65, rate: 8,  end: -0.04 }, shirt: '#ffa02e', skin: '#d9a273', hair: '#3b2a20', hat: 'cap',      hatColour: '#150f3d' },
  wendell: { name: 'Wendell', voice: { wave: 'triangle', hz: 120, ms: 80, rate: 7, end: -0.05 }, shirt: '#5a7fb8', skin: '#8a5a3c', hair: '#c8ccd2', hat: 'cap', hatColour: '#ff5a5a' },
  guide: { name: 'Guide', voice: { wave: 'sine',     hz: 300, ms: 55, rate: 11, end: 0.1 },   shirt: '#3fb86a', skin: '#e3b08a', hair: '#7a4a20', hat: null,       hatColour: null },
};

// how a line sounds when it is not spoken face to face
export const VIA = {
  phone:      { lp: 2400, tag: 'on the phone' },
  radio:      { lp: 3000, tag: 'on the radio' },
  loudhailer: { lp: 1800, echo: 0.09, tag: 'loudhailer' },
};
