// Heat 4 and 5 in words: 20 more LIVE chat rows and 10 more of the Sheriff's ticker lines, word for
// word from plan/bible/voices/live-chat.md (groups 3, 4 and 14) and plan/bible/radio/scanner.md.
// src/actors/cops-heavy.mod.js adds them to the lists the LIVE overlay reads and fires their triggers.
// Chat triggers: heat4 · heat5 · filler4 · filler5 · roadblock · spikes · chopper2 · shootout · truck · truckfire · big · choppercam.
// Ticker `on`: step4 · step5 · chopper2 · viewers (with `when`, the count passed).

const row = (n, on, text, tier = 'A') => ({ n, on, if: null, text, tier });

export const CHAT_HIGH = [
  // 3 · heat 4, Breaking News
  row(25, 'heat4', 'BREAKING NEWS'), row(26, 'heat4', 'they got the vans out'), row(27, 'roadblock', 'roadblock ahead!!'),
  row(28, 'spikes', 'spike strips. oh shit'), row(29, 'heat4', 'my radio just switched to this'), row(30, 'filler4', 'every station is this now'),
  row(31, 'filler4', 'four sirens. FOUR'), row(32, 'chopper2', 'two helicopters??', 'B'), row(33, 'shootout', 'it\'s a shoot-out now', 'B'),
  // 4 · heat 5, Hurricane Dale
  row(35, 'heat5', 'HURRICANE DALE'), row(36, 'heat5', 'the sheriff\'s truck!!!'), row(37, 'truck', 'dale\'s driving it himself'),
  row(38, 'heat5', 'every unit in the county'), row(39, 'heat5', 'all five sirens'), row(40, 'filler5', 'that truck has its own cameras'),
  row(41, 'filler5', 'whole county\'s on one road'), row(42, 'big', '200k of us watching', 'B'), row(43, 'truckfire', 'dale brought the big guns. literally', 'B'),
  // 14 · helicopter cam
  row(161, 'choppercam', 'chopper cam!!'), row(162, 'choppercam', 'look how small'),
];

export const TICKER_HIGH = [
  { id: 'D04', on: 'step4', text: 'This just became Breaking News, folks. Every radio in the county is ours now. Hello, radio.' },
  { id: 'D05', on: 'step4', text: 'Roadblocks are going up and so are the numbers. Tactical team, find your light, then find the suspect.' },
  { id: 'D06', on: 'chopper2', text: 'Two helicopters now. One for the suspect, one for my good side.' },
  { id: 'D07', on: 'step5', text: 'Folks, I\'m getting in the truck. Hurricane Dale has made landfall. Where are my (bleep) keys?' },
  { id: 'D08', on: 'step5', text: 'Every unit in Marlin County is on your screen right now. Do not adjust your set. Adjust your seat.' },
  { id: 'D09', on: 'step5', text: 'I\'m coming for you myself, friend. I\'m bringing nine cameras and a shotgun. Mostly the cameras.' },
  { id: 'D12', on: 'viewers', when: 50000, text: 'Fifty thousand viewers. That is a stadium, folks, and nobody had to park.' },
  { id: 'D13', on: 'viewers', when: 150000, text: '{viewers} of you. I\'d like to thank the suspect, without whom, none of this.' },
  { id: 'D14', on: 'viewers', when: 250000, text: 'A quarter of a million. I\'m told that\'s everyone in the county and some pets.' },
  { id: 'D15', on: 'viewers', when: 500000, text: '{viewers}. Folks, I have never been so proud of a crime.' },
];
