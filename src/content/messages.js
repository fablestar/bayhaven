// Texts the phone can receive (plan/bible/story/messages.md). Today: the mission offers, word for word.
// A row is { id, from, on, when, text, waypoint: [x, z], once, tier }. Teo writes in lower case with no full
// stops; that is his voice. Banter, the Regulars and spam are not loaded yet.
const offer = (n, mission, from, tier, waypoint, text) => ({ id: 'offer-' + String(n).padStart(2, '0') + (n >= 18 && n < 20 ? '-' + from : ''), from, to: 'any', on: 'mission:offered', when: { id: mission }, text, waypoint, once: true, tier });

export const SENDERS = {
  teo: { name: 'Teo', hz: 260 }, mags: { name: 'Mags', hz: 180 }, wendell: { name: 'Wendell', hz: 120 }, rafa: { name: 'Rafa', hz: 150 },
  june: { name: 'June', hz: 240 }, nilda: { name: 'Nilda', hz: 200 }, dess: { name: 'Dess', hz: 170 }, larry: { name: 'Lawyer Larry', hz: 190 }, barbara: { name: 'Barbara', hz: 220 },
};

export const MESSAGES = [
  offer(1, 'final-notice', 'teo', 'A', [-1256, -226], 'mags come outside, a guy is stapling something to the board and a tow truck has my fucking scooter, this is not a drill'),
  offer(2, 'content-is-king', 'teo', 'B', [-1246, -224], 'new plan, we go viral and the internet saves the park, i need 3 stunts and you watching the stream, yes from under the car'),
  offer(3, 'repo-woman', 'wendell', 'A', [284, 46], "Mags. Bellweather's outfit owes me for 40 cars. I want 3 back today. I'm on the bench across from Hotel Alba."),
  offer(4, 'hot-sauce', 'rafa', 'B', [-1400, -880], "You're the one who rammed the tow truck. I have a van of my mother's sauce and a small problem. Domino Park, table one. Sit first."),
  offer(5, 'open-house', 'mags', 'A', [-1250, -220], "There's a tour of the model home in Mallard Greens. We're going. Wash the car and wear a shirt with all its buttons."),
  offer(6, 'glow-up', 'june', 'B', [-1108, 110], "It's June. Don't say my name out loud. White van at the Sandpiper Bridge, before one. Bring nothing. Especially not a plan."),
  offer(7, 'as-seen-on-tv', 'teo', 'A', [-1246, -224], 'ok hear me out, the sheriff gets half a million viewers and i get 212, what if we borrowed his, come to my trailer, i am already live'),
  offer(8, 'swamp-thing', 'nilda', 'B', [1200, -3250], 'Nilda Ferro! Airboats! Surveyors staked my damn channels! I need a driver at my dock before eight! Their patrol shoots! So do I!'),
  offer(9, 'crane-game', 'dess', 'B', [2900, -260], "Whitlock, at the port. There's a pink box on my dock with your Monday in it. Foot of crane 3, before six. Over."),
  offer(10, 'injury-time', 'larry', 'C', [420, -1830], "Hurt? Not yet? Lawyer Larry here. Mr Bellweather's limo and my new clients should meet. Gently. Come by the office. 555-0144."),
  offer(11, 'yacht-rock', 'june', 'A', [-1150, 70], "Saturday, 21:00, the yacht club gate. Bellweather's key card will be in his jacket. I can get Teo aboard as talent. Loosely."),
  offer(12, 'paint-it-pink', 'june', 'C', [1180, -1180], 'Five Bayhaven Tomorrow billboards. One night. I have pink wrap, a ladder and a grudge. My loft, after dark.'),
  offer(13, 'the-binder', 'barbara', 'B', [-1250, -220], 'This is Barbara Wetherby, Bayhaven Public Radio. I understand you have a binder. I would like to read it on air. I am calling you now.'),
  offer(14, 'speedbowl', 'wendell', 'B', [2700, -1850], "Friday. Race night. First prize is the hauler you need. I kept the number 9 car. Infield garage. Don't make it a thing."),
  offer(15, 'dry-run', 'mags', 'B', [60, -700], "We look at the Spire today. Three photographs, then the way out until I can drive it asleep. I'm parked on Coral Boulevard."),
  offer(16, 'hurricane-party', 'rafa', 'C', [-1400, -880], "Storm's coming and my street has no power. The Galleria has a generator truck lighting a showroom. Table one. Bring gloves."),
  offer(17, 'evacuation-route', 'mags', 'C', [-400, -2980], "The neighbours are safe at Big Earl's. Every lane is leaving town and I'm going back in. Stay by the phone."),
  offer(18, 'the-spire-job', 'mags', 'A', [-1256, -226], "It's tonight. The bus is ready. His men will be armed. Wear shoes you can climb in. That does not mean the slides."),
  offer(18, 'the-spire-job', 'teo', 'A', [-1256, -226], 'its tonight, its actually tonight, i charged two phones and i might throw up, holy shit mags'),
  offer(19, 'eye-of-the-storm', 'mags', 'B', [0, 37], 'The eye is over us. We have a few quiet minutes. Keep hold of those papers.'),
  offer(19, 'eye-of-the-storm', 'teo', 'B', [0, 37], 'mags the sky has a fucking hole in it and the sheriff is still filming, i think we show him the deeds'),
  offer(20, 'going-viral', 'mags', 'A', [0, 37], "Morning. The bus goes home now. So do we. I'm driving."),
];
