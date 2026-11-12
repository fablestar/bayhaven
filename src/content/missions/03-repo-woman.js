// Mission 3, "Repo Woman" (plan/05-content.md, script in plan/bible/story/act-1.md).
// Steps 2a to 2c are the plan's step 2, 3a to 3c its step 3, 4a to 4d its step 4; its step 5 is the result card.
// 4d is one step more than the bible's ten: the closing lines at the forecourt need a step of their own to play out.
// Not built yet: Chad's pistol and his side rams (he drives the same road at speed), the Mullet's falling yard signs.
// The service bay (332, -236) cannot be driven into until Park & Sons has its own lot, so the cars come to the
// forecourt seed (340, -222), which the engine moves to the kerb in front of the garage, as it does for mission 1.
const GARAGE = { x: 340, z: -222 }, LOANER = { model: 'snook', at: { x: 352, z: -222, h: Math.PI / 2 }, paint: 0xf4f4f4 };

export default {
  id: 'repo-woman', n: 3, title: 'Repo Woman', tier: 'A', chapter: 1, act: 1,
  giver: 'wendell', leads: ['mags'], start: { x: 284, z: 46 }, minutes: 6,
  pays: { cash: 1200, followers: 0 }, unlocks: ['open-house', 'hot-sauce'], needs: ['missions', 'phone', 'damage', 'palmavieja', 'meridian'],
  offer: 'Wendell wants three cars back.',

  actors: {
    chad: { model: 'grouper', paint: 0x1a1a22, label: 'Chad', speed: 27, corner: 9, path: [[52, -800], [52, -197], [322, -197]] },
  },

  steps: [
    { type: 'say', lines: 'wendell', text: 'Hear Wendell out.' },
    { type: 'goto', at: { x: 300, z: 24 }, r: 4, as: 'foot', text: 'Walk to the silver Tarpon at the Hotel Alba drop-off.',
      cars: [{ model: 'tarpon', at: { x: 300, z: 24, h: Math.PI / 2 }, paint: 0xc8ccd2, accent: 0x29e6ff }] },
    { type: 'enter', vehicle: 'tarpon', text: 'Get in the Tarpon.', hint: 'Walk to the door. One button gets you in.' },
    { type: 'deliver', what: 'tarpon', to: GARAGE, r: 7, maxDamage: 30, timer: 150, say: 'car1', done: 'car1done',
      text: 'Bring the Tarpon to Park & Sons.', hint: 'Dents cost money. Brake early.',
      fail: [{ when: 'timer', text: 'Too slow. The valet called it in.' }], checkpoint: true },

    { type: 'goto', at: { x: -892, z: -397 }, r: 6, route: true, say: 'car2', text: 'Find the Mullet in the alley off Flamingo Avenue.', hint: 'The loaner is on the forecourt.',
      cars: [LOANER, { model: 'mullet', at: { x: -892, z: -397, h: 0 }, paint: 0x6f8f5a }] },
    { type: 'enter', vehicle: 'mullet', say: 'dog', text: 'Take the Mullet. A dog is barking. It knows.' },
    { type: 'deliver', what: 'mullet', to: GARAGE, r: 7, maxDamage: 30, timer: 180, say: 'car2drive', done: 'car2done',
      text: 'Bring the Mullet to Park & Sons.',
      fail: [{ when: 'timer', text: 'Too slow. The dog told everyone.' }], checkpoint: true },

    { type: 'goto', at: { x: 70, z: -850 }, r: 6, route: true, say: 'car3', text: 'Find the orange Wahoo at the Spire drop-off.',
      cars: [LOANER, { model: 'wahoo', at: { x: 70, z: -850, h: 0 }, paint: 0xff7a1a, accent: 0x150f3d }] },
    { type: 'enter', vehicle: 'wahoo', done: 'chad', text: 'Take the Wahoo.' },
    { type: 'deliver', what: 'wahoo', to: GARAGE, r: 7, maxDamage: 60, say: 'car3drive', set: { chad: { go: true, after: 3 } },
      text: 'Bring the Wahoo home. Chad is right behind you.', hint: 'He rams wide. Turn in tight.' },
    { type: 'say', lines: 'arrival', text: 'Wendell has the paperwork.' },
  ],
  fail: [
    { when: 'vehicle:destroyed', text: 'The repo car is wrecked. Wendell cannot sell a crater.' },
    { when: 'knockedout', text: 'Mags needs a minute.' },
  ],

  lines: {
    wendell: [
      { who: 'wendell', text: 'Margaret Calloway. Ramming tow trucks. At your age.' },
      { who: 'mags', text: 'At my age I\'ve had the practice. Your door says "back in 5".' },
      { who: 'wendell', text: "I've been busy. That son of a bitch Bellweather owes me for forty cars." },
      { who: 'wendell', text: 'Fleet service. Eight months. Not a dollar. So the cars are coming back.' },
      { who: 'mags', text: "You're taking them back." },
      { who: 'wendell', text: "You're taking them back. I've got a knee. Three today. Bring them in clean." },
      { who: 'wendell', text: "First one's right there. Silver Tarpon. The valet thinks it's his." },
    ],
    car1: [
      { who: 'mags', text: 'Company car. Smells like a pine tree held a meeting in it.' },
      { who: 'wendell', via: 'phone', text: "Under 30 percent, Mags. I can't sell a dent." },
      { who: 'mags', text: 'I drove 31 years without one.' },
      { who: 'wendell', via: 'phone', text: 'You drove a bus. Things got out of your way.' },
    ],
    car1done: [{ who: 'wendell', via: 'phone', text: "Clean. Thirty-nine to go. Loaner's out front. Don't race it." }],
    car2: [
      { who: 'wendell', via: 'phone', text: "Number two. Pickup. Alley in Palma Vieja. There's a dog." },
      { who: 'mags', text: 'Is the dog a problem?' },
      { who: 'wendell', via: 'phone', text: "The dog's a talker." },
    ],
    dog: [{ who: 'mags', text: "Good boy. Loud boy. I'm only borrowing it back." }],
    car2drive: [
      { who: 'teo', via: 'phone', text: 'Mags! Are you stealing cars? Without me? Without a CAMERA?' },
      { who: 'mags', text: "Repossessing. There's paperwork." },
      { who: 'teo', via: 'phone', text: "That's worse! Paperwork doesn't trend!" },
      { who: 'mags', text: 'The bed\'s full of yard signs. "Bayhaven Tomorrow." They\'re falling out.' },
      { who: 'wendell', via: 'phone', text: "Let them fall. Spread the man's name around." },
    ],
    car2done: [{ who: 'wendell', via: 'phone', text: 'Two. You always did bring them home straight.' }],
    car3: [
      { who: 'wendell', via: 'phone', text: "Last one. Orange Wahoo, front of the Spire. His security chief's." },
      { who: 'mags', text: 'A Wahoo. Does it still slide when you look at it?' },
      { who: 'wendell', via: 'phone', text: "Don't look at it." },
    ],
    chad: [{ who: 'chad', text: "HEY! That's my car! Brad! Somebody's in my car! ... Brad's not here. HEY!" }],
    car3drive: [
      { who: 'mags', text: "He's got a Grouper. Two tonnes of opinion." },
      { who: 'chad', via: 'loudhailer', text: 'Pull over or I shoot! That car belongs to Bayhaven Tomorrow!' },
      { who: 'mags', text: 'It belongs to whoever paid the mechanic. So far, nobody.' },
      { who: 'mags', text: 'He shoots like he parks. Wide.' },
      { who: 'wendell', via: 'phone', text: "Don't fight him. Just get here. I've got the lien on a clipboard." },
    ],
    arrival: [
      { who: 'wendell', text: 'Afternoon, son. Lien. Invoice. Shotgun. Pick one to argue with.' },
      { who: 'chad', text: "Mr. Bellweather's going to hear about this." },
      { who: 'wendell', text: "I'm counting on it. Tell him thirty-seven to go." },
      { who: 'wendell', text: 'Twelve hundred, Mags. Same split as the old days.' },
      { who: 'mags', text: 'In the old days you kept it all.' },
      { who: 'wendell', text: "And you never noticed. There's more work if you want it." },
      { who: 'mags', text: 'Who is Bellweather?' },
      { who: 'wendell', text: "The name on your notice. Go and see what he's building. Mallard Greens." },
    ],
  },
  card: { caption: 'Three cars home. Thirty-seven to go.', stamp: 'Delivered' },
  react: {
    squawk: 'orange wahoo vs black suv all the way down coral boulevard. the grandma is winning',
    news: 'Three Bellweather Group cars were repossessed today. Shots were fired down Coral Boulevard. A mechanic called it an invoice.',
  },
};
