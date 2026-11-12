// Mission 7, "As Seen on TV" (plan/05-content.md, script in plan/bible/story/act-2.md).
// Steps 1 and 2 are the plan's; 3a and 3b are its step 3; 4a is its step 4; 4b is the closing lines before the card.
// The cruiser on Rosa Street is a parked Tarpon in the Sheriff's colours: a real deputy is taken off the street at
// heat 0, so the honk is read near the car. Stunt bonuses pay only while a deputy can see (state.heat.seen).
const CRUISER = { x: -1015.5, z: 12, h: 0 };

export default {
  id: 'as-seen-on-tv', n: 7, title: 'As Seen on TV', tier: 'A', chapter: 1, act: 2,
  giver: 'teo', leads: ['mags', 'teo'], start: { x: -1246, z: -224 }, minutes: 5,
  pays: { cash: 2500, followers: 5000 }, unlocks: ['yacht-rock', 'swamp-thing'], needs: ['missions', 'heat', 'live'],
  offer: 'Teo has a plan. He is already live.',

  steps: [
    { type: 'say', lines: 'plan', text: 'Hear Teo out.', checkpoint: true },
    { type: 'heat', want: 'reach', level: 3, say: 'honk', text: 'Get three siren lights. Any way you like.', hint: 'Honk at the cruiser on Rosa Street.',
      honk: { at: CRUISER, r: 20, every: 15 }, cues: [{ when: 'honk', lines: 'honked' }],
      cars: [{ model: 'tarpon', at: CRUISER, paint: 0xffffff, accent: 0x1fb5a8 }],
      fail: [{ when: 'booked', text: 'Booked before the show began. Nobody saw it.' }] },
    { type: 'say', lines: 'live', text: 'The Sheriff is live. Keep driving.' },
    { type: 'survive', seconds: 60, atHeat: 3, say: 'show', text: 'Stay on the show for 60 seconds.', hint: 'Stunts in view add viewers and followers.',
      bonus: { 'drift:end': { min: { score: 1500 }, followers: 250 }, 'jump:landed': { min: { metres: 10 }, followers: 500 }, 'traffic:nearmiss': { followers: 100 } },
      cues: [{ when: 'time', t: 30, lines: 'half' }], checkpoint: true },
    { type: 'heat', want: 'clear', say: 'dull', text: 'Lose them. Be boring until the viewers leave.', hint: 'Car wash, bridge or a new car. Then sit.' },
    { type: 'say', lines: 'count', text: 'Teo is counting.' },
  ],
  fail: [{ when: 'knockedout', text: 'Mags needs a minute.' }],

  lines: {
    plan: [
      { who: 'teo', text: "I have an idea and you're going to hate it." },
      { who: 'mags', text: "Then I'll save time and hate it now." },
      { who: 'teo', text: 'Bayhaven Blue: Live. Top show in the county. Half a million on a good chase.' },
      { who: 'teo', text: "If we're the chase, my stream rides along. His audience becomes ours." },
      { who: 'mags', text: 'You want the Sheriff to chase us. On purpose. For followers.' },
      { who: 'teo', text: "For the park! Nobody saves a place they've never seen." },
      { who: 'mags', text: 'No.' },
      { who: 'teo', text: "I'm already live." },
      { who: 'mags', text: 'Of course you are.' },
    ],
    honk: [
      { who: 'teo', text: "Three lights and he goes live. There's a cruiser on Rosa Street. Honk at it." },
      { who: 'mags', text: 'I have never honked at an officer in my life.' },
    ],
    honked: [{ who: 'deputy', text: 'Ma\'am, did you just honk at me? ... Ma\'am. MA\'AM.' }],
    live: [
      { who: 'rucker', via: 'radio', text: 'Hello, Marlin County! We are LIVE, and we have a runner!' },
      { who: 'rucker', via: 'radio', text: 'Suspect is in a {vehicle}. Driven by... zoom in. Is that a grandmother?' },
      { who: 'chat', text: 'grandma???' },
    ],
    show: [
      { who: 'teo', text: "They're shooting! Mags, they are actually fucking shooting at us!" },
      { who: 'mags', text: 'Three lights. You ordered three lights.' },
      { who: 'rucker', via: 'radio', text: "She's signalling. Folks, the suspect is signalling her turns." },
      { who: 'teo', text: 'Do something! A drift! A jump! They love a jump!' },
      { who: 'mags', text: "I'm doing the limit plus forty. That's my something." },
    ],
    half: [
      { who: 'rucker', via: 'radio', text: 'Brought to you by Bayhaven Tomorrow. Quality living. Quality pursuit.' },
      { who: 'teo', text: 'Thirty-one thousand viewers! Mags, the number has a COMMA.' },
    ],
    dull: [
      { who: 'mags', text: "Sixty. Show's over. Now we get dull." },
      { who: 'mags', text: "Out of sight, engine off. They'll watch a parked car for ten seconds, then go." },
      { who: 'rucker', via: 'radio', text: "Where'd she go? Chopper, where'd she go? Stay with us, folks. Folks?" },
      { who: 'chat', text: 'boring' },
      { who: 'chat', text: 'bring back grandma' },
    ],
    count: [
      { who: 'teo', text: 'Five thousand new followers. Five thousand people know my name.' },
      { who: 'mags', text: "Do they know the park's name?" },
      { who: 'teo', text: '...They will. Mags. Bellweather pays for the Sheriff\'s show.' },
      { who: 'mags', text: "Then the man evicting us owns the cameras. Good. He'll be watching." },
    ],
  },
  card: { caption: 'She signalled every turn.', stamp: 'Delivered' },
  react: {
    squawk: '@BayhavenBlue lost a grandma who used her indicators the whole chase. explain',
    news: "The Sheriff's programme ended early tonight when its suspect parked, switched off and became, in his words, bad television.",
  },
};
