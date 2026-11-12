// The police scanner's calls and the Sheriff's ticker, from plan/bible/radio/scanner.md.
// This session: the nine A kinds at heat 1 to 3 (27 calls) and the A ticker lines for heat 3.
// Placeholders: {unit} {street} {district} {vehicle} {heading} {suspect} {viewers} {score} {distance}.

export const DISPATCH_VOICE = { wave: 'square', hz: 240, ms: 55, rate: 7, lp: 2800 };

// kind: [heat 1, heat 2, heat 3]
export const CALLS = {
  collision: [
    'Unit {unit}, collision on {street}. {vehicle}, {heading}, didn\'t stop. Go and have a word.',
    'All units {district}, the {vehicle} has hit a second car. One driver hurt. Box it in. Mind your paint.',
    'We\'re live. The {vehicle} is trading paint on {street}. Control room says the sparks look great. Carry on.',
  ],
  'hit-and-run': [
    'Unit {unit}, pedestrian struck on {street}. He\'s up and he\'s swearing. {vehicle} left {heading}. Take a statement.',
    'Pedestrian down on {street} and not getting up. Ambulance is rolling. Suspect is {suspect} in a {vehicle}.',
    'Live update. Two down on {street}, one not moving. Bystanders are filming instead of helping. Coroner\'s on standby.',
  ],
  carjack: [
    'Unit {unit}, a driver on {street} was pulled out of his {vehicle} by a stranger. He\'s shaken. Stranger went {heading}.',
    'Carjacking, {street}. Suspect is {suspect}, armed. {vehicle}, {heading}. Owner unhurt. Three units.',
    'We\'re live. Suspect has changed vehicles on camera. Now in a {vehicle}. Graphics need the new colour.',
  ],
  'cop-ram': [
    'Unit {unit} reports contact. Somebody hit his cruiser on {street}. He\'s fine. He\'s offended. Assist.',
    'Second cruiser rammed in {district}. One deputy hurt. The {vehicle} is doing it on purpose. Box and stop.',
    'We\'re live and we\'ve lost a cruiser on {street}. Unit {unit}, you\'re on camera. Fix your hat, then return fire.',
  ],
  shots: [
    'Unit {unit}, shots fired on {street}. Nobody hit that we know of. Go and find out. Carefully.',
    'Shots confirmed, {district}. Suspect is {suspect} in a {vehicle}, armed. Vests on, heads down.',
    'Live. Shots on {street}. You are cleared to return fire. Control room asks: not near the sponsor\'s billboard.',
  ],
  killing: [
    'Unit {unit}, one person shot on {street}. Not breathing. Suspect is {suspect}, last seen {heading}. Go now.',
    'That\'s a second body in {district}. Coroner\'s van is rolling. All units, the suspect is armed and not shy about it.',
    'We\'re live with a fatality on {street}. Control room says the blur is on. Deputies, you are cleared to shoot.',
  ],
  'deputy-down': [
    'Officer down. Officer down on {street}. Unit {unit} is not answering. All units, drop what you\'re doing.',
    'Deputy down in {district}. Second one today. Suspect is {suspect} in a {vehicle}. Nobody goes in alone.',
    'Deputy down, live on air, {street}. Control room cut to a sponsor. They\'ve cut back. Return fire.',
  ],
  evade: [
    'Unit {unit} lit up a {vehicle} on {street} and it didn\'t stop. It\'s {heading}. Stay with it.',
    'The {vehicle} is still not stopping. Twenty seconds now. {district}, {heading}. Units, close the avenues.',
    'That\'s a pursuit, and that\'s a show. We are live. {vehicle}, {street}, {heading}. Weapons free. Smile, units.',
  ],
  outlast: [
    'Unit {unit}, that {vehicle} you lost on {street} is still out there. That\'s ninety seconds. Sending two more.',
    'Three units and nobody has stopped a {vehicle} in {district}. I\'m waking the helicopter. Stand by for cameras.',
    'Ninety seconds live and still breathing. Control room wants more. I\'m sending the big vehicles. Heads up, {district}.',
  ],
};
// kinds without their own calls this session read as their nearest A kind
export const CALL_AS = { property: 'collision', theft: 'carjack', explosion: 'collision', 'shoot-out': 'shots' };

// The Sheriff's ticker at heat 3: { id, on, when, text }. `when` is read by src/ui/live.mod.js.
export const TICKER = [
  { id: 'D01', on: 'open', text: 'Good evening, Bayhaven, and welcome to Bayhaven Blue: Live. I\'m Sheriff Dale Rucker. We have a guest.' },
  { id: 'D02', on: 'open', text: 'We are live. Tonight\'s star is in a {vehicle} on {street}. Deputies, weapons free. Nobody rehearsed this.' },
  { id: 'D03', on: 'open', text: 'Welcome to the only show where the cast doesn\'t know it\'s been cast. Safeties off. Roll the sirens.' },
  { id: 'D10', on: 'viewers', when: 5000, text: 'Five thousand of you watching. Tell a neighbour. Knock on the wall.' },
  { id: 'D16', on: 'drift', text: 'Sideways through the junction. Judges? I\'m the judges. Nine out of ten.' },
  { id: 'D17', on: 'drift', text: 'That\'s a drift worth {score}, folks. We don\'t score those. We should score those.' },
  { id: 'D22', on: 'jump', text: 'And they\'re airborne. {distance} metres. Cabin crew, prepare for landing.' },
  { id: 'D23', on: 'jump', text: 'Up, over and down. The suspension has gone but the dream is alive.' },
  { id: 'D28', on: 'crash', text: 'Ooh. That was not in the script. Is the {vehicle} still moving? It\'s still moving.' },
  { id: 'D29', on: 'copcrash', text: 'Contact with a cruiser. That deputy has a family, folks. Names on screen. Spell them right this time.' },
  { id: 'D37', on: 'destroyed', text: 'And it\'s gone up. That is a real fireball, folks, not an effect. We can\'t afford effects.' },
  { id: 'D43', on: 'killing', text: 'We have a fatality on {street}, folks. The blur is on. Thoughts, prayers, and we\'ll be right back.' },
  { id: 'D62', on: 'falling', when: 0.5, text: 'Where did they go? Camera two? Camera anybody? Folks, don\'t leave. Something\'s coming.' },
  { id: 'D63', on: 'falling', when: 0.2, text: 'We\'re losing viewers. Deputies, do something interesting. Shoot something. A tyre. Anything.' },
  { id: 'D68', on: 'cleared', text: 'And that\'s the show. Our guest has left the building, alive, which is a first this week.' },
  { id: 'D69', on: 'cleared', text: 'They got boring and we lost them. There\'s a lesson there, folks. I don\'t know who for.' },
  { id: 'D74', on: 'knockedout', text: 'Suspect is down. Suspect is down. Medics, go in. Camera one, go in first.' },
  { id: 'D80', on: 'idle', text: 'If you\'re just joining us: a {vehicle}, {district}, some gunfire and me. You haven\'t missed the good part.' },
];
