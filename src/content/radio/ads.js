// The shared pool of radio ads, every brand invented. The first six are the samples in
// plan/05-content.md, word for word; the rest are from plan/bible/radio/ads.md (tier A).
// A station lists the ids it runs. Voices are speech blips (src/audio/voice.js).
export default {
  kind: 'ads',
  voices: {
    announcer: { wave: 'square', hz: 250, ms: 45, rate: 9, lp: 2000 },
    larry: { wave: 'triangle', hz: 200, ms: 40, rate: 10, end: 0.2 },
    kiki: { wave: 'sine', hz: 340, ms: 55, rate: 7, vibrato: true },
  },
  ads: {
    'spf-1000': { brand: 'SPF 1000', voice: 'kiki', text: 'The sun can\'t see you. Not available in stores, pharmacies, or daylight.' },
    'lawyer-larry': { brand: 'Lawyer Larry', voice: 'larry', text: 'Hurt? Bored? Standing near something? Call Larry. 555-0144.' },
    'bayhaven-tomorrow': { brand: 'Bayhaven Tomorrow', voice: 'announcer', text: 'Luxury living where your neighbourhood used to be. From the low nine hundreds.' },
    'storm-mart': { brand: 'Storm Mart', voice: 'announcer', text: 'Plywood, water, and one remaining pool noodle. Storm Mart. We were going to close anyway.' },
    'big-earls': { brand: 'Big Earl\'s', voice: 'announcer', text: 'Thirty metres of alligator. Zero metres of museum. Exit 44.' },
    'gator-putt': { brand: 'Gator Putt', voice: 'announcer', text: 'Eighteen holes. Seventeen alligators. One is on break.' },
    'manatee-mattress': { brand: 'Manatee Mattress', voice: 'announcer', text: 'Can\'t sleep? Is it the heat, the sirens, or the gunfire? Manatee Mattress. Slow. Soft. Enormous. Thick enough to stop a stray round, though we\'re told not to say so. Free delivery anywhere a van can reach.' },
    'cash-4-jet-skis': { brand: 'Cash 4 Jet Skis', voice: 'announcer', text: 'Got a jet ski? Want cash? That\'s the whole business. Cash 4 Jet Skis, West End. We don\'t ask where it came from. We don\'t ask what that stain is. We just count. Out loud. Slowly.' },
    'pelican-fuel': { brand: 'Pelican Fuel', voice: 'announcer', text: 'Pelican Fuel. Fill up, wash your windscreen, and ask yourself why there\'s a pelican on pump four. He isn\'t ours. He was here before the pumps. Pelican Fuel. All over Bayhaven. One bird, somehow, at every one.' },
    'lava-abuela': { brand: 'Lava Abuela', voice: 'announcer', text: 'Lava Abuela hot sauce. Made in Palma Vieja from peppers, vinegar and a grudge. One drop for flavour. Two drops for courage. Three drops, call your mother. Lava Abuela. She told you it was hot.' },
    'bun-voyage': { brand: 'Bun Voyage', voice: 'announcer', text: 'Bun Voyage. Burgers so big they need a departure lounge. Try the Long Haul: two patties and a layover of cheese. You won\'t finish it. Wave it goodbye. Bun Voyage. Now boarding at every drive-through on Gateway Boulevard.' },
    'bay-cab': { brand: 'Bay Cab', voice: 'announcer', text: 'Need a ride? Bay Cab. We know every street in Bayhaven and most of the shortcuts across other people\'s lawns. Fair fares, cold air, and a driver who won\'t ask what\'s in the bag. Bay Cab. Get in.' },
  },
};
