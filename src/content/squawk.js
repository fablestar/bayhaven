// Squawk: the city's feed in the phone (plan/05-content.md "Squawk", plan/bible/voices/squawk.md).
// The 40 tier A templates, word for word, with the bible's row numbers. People type lowercase; institutions do not.
// A row is { n, on, if, who, text, tier }. `if` is read by src/ui/phone/feed.js:
//   min { field: at least } · is { field: value or [values] } · lead 'mags' | 'teo' · he (skipped while Mags leads) ·
//   after (the weather before this one) · shots (gunfire in the last 30 s) · `kmh` is read from the payload's speed.
// REPLIES are the Sheriff's account answering a post that names it, or a post about one of his chases.
export const HANDLES = { teo: '@teo.navarro.live', sheriff: '@BayhavenBlue', kiki: '@kiki.halcyon' };

export const ACCOUNTS = {
  '@teo.navarro.live': { name: 'Teo Navarro', colour: '#3fd6c8' },
  '@BayhavenBlue': { name: 'Bayhaven Blue: Live', colour: '#1fb5a8', official: true },
  '@thebayhaventide': { name: 'The Bayhaven Tide', colour: '#fff1c9', official: true },
  '@mallardgreens.hoa': { name: 'Mallard Greens HOA', colour: '#3fb86a', official: true },
  '@bayhaventomorrow': { name: 'Bayhaven Tomorrow', colour: '#ffa02e', official: true },
  '@lawyerlarry': { name: 'Lawyer Larry', colour: '#ffa02e', official: true },
  '@motelrow.mo': { name: 'Mo', colour: '#b46bff' },
  '@visiting.vic': { name: 'Vic', colour: '#ff4fa8' },
  '@lorraine.on.grackle': { name: 'Lorraine', colour: '#5dff9b' },
};

const STORM = ['storm', 'afternoon storm', 'afternoon-storm', 'afternoonStorm'];
export const SQUAWK = [
  { n: 32, on: 'weather:changed', if: { is: { kind: STORM } }, who: '@motelrow.mo', text: '3:15. right on time.' },
  { n: 33, on: 'weather:changed', if: { is: { kind: 'clear' }, after: STORM }, who: '@visiting.vic', text: 'rainbow over {landmark}. the road is steaming. is the road supposed to steam' },
  { n: 36, on: 'weather:changed', if: { is: { kind: 'hurricane' } }, who: '@thebayhaventide', text: 'Hurricane warning for all of Marlin County. Lawn furniture is now airborne.' },
  { n: 54, on: 'vehicle:entered', if: { is: { taken: true } }, who: '@visiting.vic', text: 'someone just borrowed my rental {vehicle} on {street}. they waved. i waved back??' },
  { n: 62, on: 'vehicle:crash', if: { min: { kmh: 80 } }, who: '@motelrow.mo', text: 'heard that one from the lobby. {street}. holy shit. the {vehicle} is a different shape now' },
  { n: 63, on: 'vehicle:crash', if: { is: { cop: true } }, who: '@BayhavenBlue', text: 'A guest has made contact with one of our vehicles. We have it from four angles.' },
  { n: 66, on: 'vehicle:destroyed', who: '@visiting.vic', text: 'a {vehicle} just blew up on {street}. the hood is still in the air. i need a drink' },
  { n: 70, on: 'drift:start', who: '@motelrow.mo', text: 'tyres on {street}. here we go' },
  { n: 74, on: 'drift:end', if: { min: { score: 5000 } }, who: '@motelrow.mo', text: 'whoever is drifting past {landmark} rn: marry me' },
  { n: 75, on: 'drift:end', if: { min: { score: 2000 } }, who: '@visiting.vic', text: 'someone is doing donuts outside {landmark} and honestly? needed' },
  { n: 77, on: 'drift:end', if: { min: { score: 10000 }, lead: 'teo' }, who: '@teo.navarro.live', text: 'chat. {score} POINT DRIFT. clip is up. please. i have a phone bill' },
  { n: 78, on: 'jump:landed', if: { min: { metres: 40 } }, who: '@visiting.vic', text: 'a {vehicle} just flew over {street}. flew. with a wingspan' },
  { n: 79, on: 'jump:landed', if: { min: { metres: 20 }, lead: 'teo' }, who: '@teo.navarro.live', text: "okay {metres} metres of air. landed it. mostly. clip's up" },
  { n: 82, on: 'prop:broken', if: { is: { kind: 'hydrant' } }, who: '@motelrow.mo', text: 'free water park on {street}. thank you, mystery driver' },
  { n: 90, on: 'ped:hit', if: { is: { by: 'player' } }, who: '@lawyerlarry', text: "Hurt? Flirt with a lawsuit. Bumped on {street}? That's a flirt." },
  { n: 91, on: 'ped:hit', if: { is: { by: 'player' }, max: { kmh: 50 } }, who: '@visiting.vic', text: "got clipped by a {vehicle} on {street}. nothing broken. driver didn't even slow down. asshole" },
  { n: 94, on: 'ped:filming', if: { min: { count: 1 }, lead: 'mags' }, who: '@visiting.vic', text: 'is that a grandma' },
  { n: 95, on: 'ped:filming', if: { min: { count: 5 }, lead: 'teo' }, who: '@teo.navarro.live', text: 'chat there are {count} people filming me right now. tag me. TAG ME' },
  { n: 98, on: 'player:knockedout', if: { he: true }, who: '@thebayhaventide', text: 'Local man left for dead on {street} is alive at Bayhaven General and arguing with the bill.' },
  { n: 110, on: 'crime', if: { is: { case: 'cartheft', seen: true } }, who: '@BayhavenBlue', text: 'Vehicle taken on {street}. Our next guest is described as "in a hurry". Stay tuned.' },
  { n: 114, on: 'heat:changed', if: { is: { level: 3 } }, who: '@BayhavenBlue', text: "WE ARE LIVE. Tonight's guest is in a {vehicle} on {street}. Deputies are weapons free. Tell a friend." },
  { n: 115, on: 'heat:changed', if: { is: { level: 4 } }, who: '@thebayhaventide', text: 'Breaking: every radio station in Bayhaven is now the same chase.' },
  { n: 116, on: 'heat:changed', if: { is: { level: 5 } }, who: '@BayhavenBlue', text: 'Hurricane Dale has made landfall. The Sheriff is in the truck. Repeat: in the truck.' },
  { n: 118, on: 'heat:live', if: { min: { viewers: 20000 }, lead: 'teo' }, who: '@teo.navarro.live', text: 'chat. {viewers} PEOPLE WATCHING. that is the most people who have ever looked at me' },
  { n: 120, on: 'heat:live', if: { min: { viewers: 1000 }, shots: true }, who: '@visiting.vic', text: 'the shoot-out on the bar tv is also happening outside the bar. nobody in here has looked up' },
  { n: 122, on: 'heat:cleared', if: { min: { from: 3 }, he: true }, who: '@motelrow.mo', text: 'they LOST him?? @BayhavenBlue explain' },
  { n: 123, on: 'heat:cleared', if: { min: { from: 3 } }, who: '@BayhavenBlue', text: "Our guest is no longer visible. That's the show. Ratings were strong." },
  { n: 126, on: 'player:booked', if: { is: { level: 2 } }, who: '@BayhavenBlue', text: "Tonight's guest was booked at heat 2. Not our best episode. We'll trim it." },
  { n: 127, on: 'player:booked', who: '@lawyerlarry', text: 'My client was merely near a car at speed. Out by lunch.' },
  { n: 134, on: 'mission:started', if: { is: { id: 'final-notice' } }, who: '@teo.navarro.live', text: 'chat THEY TOWED MY SCOOTER. my whole career is on that scooter' },
  { n: 146, on: 'mission:completed', if: { is: { id: 'final-notice' } }, who: '@motelrow.mo', text: 'a coupe just rammed a tow truck till a scooter fell off. the driver was 60 if she was a day' },
  { n: 147, on: 'mission:completed', if: { is: { id: 'repo-woman' } }, who: '@thebayhaventide', text: 'Three cars vanish from Bellweather properties. Mechanic has "no sons and no comment".' },
  { n: 148, on: 'mission:completed', if: { is: { id: 'open-house' } }, who: '@mallardgreens.hoa', text: 'A golf cart has left the property through the hedge at the 14th green. The hedge will be billed.' },
  { n: 149, on: 'mission:completed', if: { is: { id: 'as-seen-on-tv' } }, who: '@teo.navarro.live', text: 'chat. 5,000 NEW FOLLOWERS. thank you sheriff. thank you helicopter. sorry mags' },
  { n: 150, on: 'mission:completed', if: { is: { id: 'yacht-rock' } }, who: '@bayhaventomorrow', text: 'Mr. Bellweather enjoyed a lovely evening on the bay and is missing nothing. Why do you ask?' },
  { n: 151, on: 'mission:completed', if: { is: { id: 'the-spire-job' } }, who: '@BayhavenBlue', text: 'We have lost the picture. We have lost the bus. Please stand by.' },
  { n: 152, on: 'mission:completed', if: { is: { id: 'going-viral' } }, who: '@teo.navarro.live', text: "okay so the clip that finally went viral is 14 seconds of mags parking a bus. i'm fine. it's fine" },
  { n: 161, on: 'followers:milestone', if: { is: { count: 1000 } }, who: '@teo.navarro.live', text: "chat. 1,000 FOLLOWERS. four figures. there's a comma now. mags look" },
  { n: 162, on: 'followers:milestone', if: { is: { count: 10000 } }, who: '@lorraine.on.grackle', text: 'ok who is {handle} and why is he on my feed every day' },
  { n: 164, on: 'followers:milestone', if: { is: { count: 1000000 } }, who: '@thebayhaventide', text: 'City unveils a statue of a phone in the plaza. Mayor claims to have always supported {handle}.' },
].map((r) => ({ tier: 'A', ...r }));

// The Sheriff's account replies under a post (the producer types; the person chased is "our guest").
// `to` is a row number, or 'mention' for any post by someone else that names @BayhavenBlue.
export const REPLIES = [
  { to: 'mention', text: 'We do not comment on guests who are still at large. Stay tuned.' },
  { to: 'mention', text: 'The Sheriff has seen your post. The Sheriff sees every post. Stay tuned.' },
  { to: 122, text: 'Our guest stepped out for a moment. The helicopter is looking into it. Stay tuned.' },
  { to: 74, text: 'Drifting is a moving violation and, frankly, good television. Stay tuned.' },
  { to: 82, text: 'That hydrant was county property. So is the footage. Stay tuned.' },
  { to: 146, text: 'A tow truck is not a guest. We have asked the driver to stop calling. Stay tuned.' },
  { to: 149, text: 'Those are our viewers. We would like them back by Friday. Stay tuned.' },
];
