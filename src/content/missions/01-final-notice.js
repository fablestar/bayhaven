// Mission 1, "Final Notice" (plan/05-content.md, script in plan/bible/story/act-1.md).
// Steps 1 to 6 are the plan's steps 1 to 6; its step 7 is the result card.
// Until the Remora exists the tow truck is a Mullet with a hook and a flashing light (`look: 'tow'`).
const E = Math.PI / 2, W = -Math.PI / 2;

export default {
  id: 'final-notice', n: 1, title: 'Final Notice', tier: 'A', chapter: 1, act: 1,
  giver: null, leads: ['mags'], start: { x: -1250, z: -220 }, minutes: 4, hour: 17.5, weather: 'clear',
  pays: { cash: 500, followers: 0 }, unlocks: ['repo-woman', 'content-is-king'], needs: ['missions', 'driving', 'traffic', 'tideline'],
  offer: 'A tow truck is at Pelican Rest.',
  flags: { heat: { max: 0 } },                       // this one teaches driving; the Sheriff waits for mission 5

  // scripted vehicles: a path is driven on the right of its line, at `speed` metres a second
  actors: {
    truck: {
      model: 'mullet', look: 'tow', paint: 0xffc23e, label: 'Tow truck', speed: 19.4, corner: 8,
      path: [[-1255.5, -190], [-1255.5, 26], [-1240, 40.5], [640, 40.5]],
      carry: { id: 'scooter', model: 'pinfish', paint: 0x29b6e6 },
    },
    scooter: { model: 'pinfish', paint: 0x29b6e6, label: 'Teo', speed: 12.5, corner: 6, ridden: true, path: [[-10, 33.5], [-1240, 33.5]] },
  },

  steps: [
    { type: 'cutscene', id: 'opening', lines: 'opening', text: "Marco is towing Teo's scooter. Get in the Heron.", stage: { foot: { x: -1250, z: -220, h: W } } },
    { type: 'enter', vehicle: 'heron', spawn: { x: -1256, z: -226, h: 0 }, paint: 0xff4f6e, accent: 0x29e6ff, say: 'enter',
      text: 'Get in the Heron.', hint: 'Hold gas to go. Steer early, she is heavy.', checkpoint: true },
    { type: 'chase', target: 'truck', stopBy: 'near', within: 12, say: 'chase', set: { truck: { go: true } },
      text: 'Catch the tow truck.', hint: 'Handbrake for the sharp turn.',
      cues: [{ when: 'passes', actor: 'truck', at: { x: -1012, z: 37 }, r: 20, lines: 'light' }],
      fail: [{ when: 'ahead', target: 'truck', metres: 250, text: 'Marco got away.' }] },
    { type: 'survive', until: { rams: 3, on: 'truck', minKmh: 15 }, bar: 'Hook', say: 'survive', set: { truck: { speed: 15.3, weave: 1.0 } },
      text: "Ram the truck's tail three times.",
      cues: [{ when: 'ram', n: 1, lines: 'ram1' }, { when: 'ram', n: 2, lines: 'ram2' }, { when: 'ram', n: 3, lines: 'ram3' }],
      fail: [{ when: 'reaches', target: 'truck', at: { x: 600, z: 37 }, r: 14, text: 'The truck reached Pier Road with the scooter.' }],
      then: { release: 'truck', leave: 'truck' }, checkpoint: true },
    { type: 'say', lines: 'home', free: true, text: 'Teo has his scooter back.', set: { scooter: { go: true, after: 6, leave: true } } },
    { type: 'goto', at: { x: 340, z: -222 }, r: 8, as: 'vehicle', say: 'phone', done: 'arrival', route: true,
      text: 'Drive to Park & Sons Auto.', hint: 'The pink dot on the minimap is where to go.' },
  ],
  fail: [{ when: 'vehicle:destroyed', text: 'The Heron is wrecked.' }, { when: 'knockedout', text: 'Mags needs a minute.' }],

  lines: {
    opening: [
      { who: 'marco', text: 'Thirty days. Says so right there. I just staple.' },
      { who: 'teo', text: "Hey! That's my fucking scooter! I'm mid-upload!" },
      { who: 'marco', text: 'Lot charges, kid. Take it up with the new owner.' },
      { who: 'teo', text: 'They took my scooter. My whole career is on that scooter.' },
      { who: 'mags', text: 'Your career is a phone on a stick.' },
      { who: 'teo', text: 'Are you going to help?' },
      { who: 'mags', text: 'Seatbelt.' },
    ],
    enter: [
      { who: 'teo', text: "You have a car? You've had a car this whole time?" },
      { who: 'mags', text: 'I have a coupe. A car is what other people have.' },
    ],
    chase: [
      { who: 'teo', text: "There! Heading for the beach road! He's not even hurrying!" },
      { who: 'mags', text: 'He will be.' },
    ],
    light: [
      { who: 'teo', text: 'Holy shit, he ran the light! Can he do that?' },
      { who: 'mags', text: 'He just did. So can we. Once.' },
      { who: 'teo', text: 'Since when do you drive like this?' },
      { who: 'mags', text: 'Since before you were an idea. Hold the dash.' },
      { who: 'teo', text: "I'm filming this. Is it okay if I film this?" },
      { who: 'mags', text: 'You were going to anyway.' },
    ],
    survive: [{ who: 'mags', text: "I'm going to tap his bumper. Three times. Count for me." }],
    ram1: [
      { who: 'teo', text: "Tap? That was a ram! That's one!" },
      { who: 'marco', via: 'loudhailer', text: 'Lady! I just drive the truck!' },
    ],
    ram2: [
      { who: 'teo', text: "Two! The hook's swinging! My baby's swinging!" },
      { who: 'marco', via: 'loudhailer', text: "Stop fucking hitting me! It's a lease!" },
    ],
    ram3: [
      { who: 'teo', text: "Three! She's loose! She's sliding! She's... fine. She's fine!" },
      { who: 'mags', text: 'Three. As agreed.' },
    ],
    home: [
      { who: 'teo', text: 'Not a scratch. Okay, one scratch. It adds character.' },
      { who: 'teo', text: 'Mags. That was the best fucking thing I have ever filmed.' },
      { who: 'mags', text: 'How many people watched?' },
      { who: 'teo', text: 'Live? Four. One of them was you.' },
      { who: 'mags', text: 'I was driving.' },
      { who: 'teo', text: 'Then three. Three is a start!' },
      { who: 'teo', text: 'I had $500 saved for the tow charge. Take it. Fuel money.' },
      { who: 'mags', text: "I'll take it. You'd only spend it on phone storage." },
      { who: 'teo', text: 'What do we do about the notice?' },
      { who: 'mags', text: "Thirty days is a long time. I've been given bus routes on less." },
      { who: 'mags', text: "Go home. I'm taking her to Wendell. That bumper is older than you." },
    ],
    phone: [
      { who: 'teo', via: 'phone', text: "Mags! Somebody clipped it! We're on Squawk! Eleven likes!" },
      { who: 'mags', via: 'phone', text: 'Is eleven good?' },
      { who: 'teo', via: 'phone', text: "It's eleven more than yesterday!" },
    ],
    arrival: [
      { who: 'mags', text: 'Closed. "Back in 5." He wrote that sign in the spring.' },
      { who: 'mags', text: 'Good thing I never gave back the key.' },
    ],
  },
  card: { caption: 'One scooter, slightly used.', stamp: 'Delivered' },
  react: {
    squawk: 'a grandma in a pink coupe just rammed a tow truck on heron walk. three times. on purpose',
    news: "A tow truck lost a scooter on Heron Walk Drive this evening. The scooter is said to be fine. She's fine.",
  },
};
