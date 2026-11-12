// The LIVE chat: what the viewers type, from plan/bible/voices/live-chat.md. One object per row:
// { n (the bible's row number), on (the trigger), if (what must hold), text, tier }.
// This session: the 40 A rows of groups 1, 2, 5, 6, 7, 9, 10, 11, 15 and 16, and the B rows of
// those groups that today's events can fire. Every row is kept exactly as written.
// Triggers: live · heat3 · filler3 · drift · jump · crash · prop · pedhit · unseen · swap · dropped · mags · cleared · knockedout.
// Conditions: score, metres, kmh, seconds (at least); kind; lead; inCar; near (a landmark id and metres); half (viewers under half of peak); unseen; under (stream seconds).

export const USERS = ['pier_pressure', 'gull_friend', 'sandbar_sam', 'humidity94', 'porch_lou', 'tarponfan', 'coupon_queen', 'nightshift_fan', 'early_bird_430',
  'route44rob', 'mangomoonie', 'boat_shoes_bo', 'flamingo_dad', 'spf_zero', 'keylimekim', 'swampmom', 'dockside_del', 'pickleball_pat', 'xX_pelican_Xx', 'bingo_bettina',
  'turnsignal_tim', 'lawnchair_legend', 'tiki_torch', 'hushhourhero', 'grouper_trooper', 'palm_reader', 'wet_sock', 'snowbird_stan', 'cul_de_zach', 'abuela_online'];

const row = (n, on, text, tier = 'A', cond = null) => ({ n, on, if: cond, text, tier });

export const CHAT = [
  // 1 · going live
  row(1, 'live', 'we\'re live'), row(2, 'live', 'oh shit it\'s starting'), row(3, 'live', 'who is it tonight'), row(4, 'live', 'first'), row(5, 'live', 'turn it up, dale\'s on'),
  row(6, 'live', 'live from {district}', 'B'), row(7, 'live', 'here we gooo', 'B'), row(9, 'live', 'mom come look', 'B'), row(10, 'live', 'is that my street', 'B'),
  row(11, 'live', 'not a {vehicle} again', 'B', { inCar: true }),
  // 2 · heat 3, Trending
  row(15, 'heat3', 'three sirens!!'), row(16, 'heat3', 'we\'re trending'), row(17, 'heat3', 'helicopter\'s up', 'A', { chopper: true }),
  row(18, 'filler3', 'this is better than the news'), row(19, 'filler3', 'HE\'S GOING FOR THE PIER', 'A', { near: ['gullwing-pier', 400] }),
  row(21, 'filler3', 'five cruisers for one {vehicle}', 'B', { inCar: true }), row(22, 'heat3', 'heat 3. they can shoot now', 'B'),
  row(23, 'copfire', 'deputies got their guns out', 'B'),
  // 5 · drifts
  row(45, 'drift', 'that drift tho', 'A', { score: 1000 }), row(46, 'drift', 'sideways king', 'A', { score: 1000 }), row(47, 'drift', '{score}!!!', 'A', { score: 5000 }),
  row(48, 'drift', 'clip that', 'A', { score: 2000 }), row(49, 'drift', 'do it again', 'A', { score: 1000 }),
  row(50, 'drift', 'smooth as hell', 'B', { score: 1000 }), row(51, 'drift', 'tyres are gone', 'B', { score: 5000 }), row(53, 'drift', 'smoke show', 'B', { score: 2000 }),
  row(55, 'drift', '10/10 slide', 'B', { score: 5000 }), row(56, 'drift', 'sideways down {street}', 'B', { score: 2000 }),
  // 6 · jumps
  row(61, 'jump', 'AIRBORNE', 'A', { metres: 15 }), row(62, 'jump', 'air bayhaven', 'A', { metres: 15 }), row(63, 'jump', '{metres} metres!!', 'A', { metres: 20 }),
  row(64, 'jump', 'stuck the landing', 'A', { metres: 5 }),
  row(65, 'jump', 'replay replay replay', 'B', { metres: 30 }), row(66, 'jump', 'that {vehicle} has wings', 'B', { metres: 20 }), row(70, 'jump', 'holy shit the hang time', 'B', { metres: 30 }),
  // 7 · crashes
  row(75, 'crash', 'ouch', 'A', { kmh: 40 }), row(76, 'crash', 'there goes the bumper', 'A', { kmh: 60 }), row(77, 'crash', 'hood\'s gone', 'A', { healthUnder: 60 }),
  row(78, 'prop', 'free water park', 'A', { kind: 'hydrant' }), row(79, 'crash', 'call larry', 'A', { parked: true }),
  row(83, 'crash', 'insurance left the chat', 'B', { kmh: 80 }), row(85, 'pedhit', 'that guy is not getting up', 'B', { kmh: 50 }),
  // 9 · hiding
  row(103, 'unseen', 'where\'d he go', 'A', { seconds: 3 }), row(104, 'unseen', 'can\'t see shit', 'A', { seconds: 3 }), row(105, 'unseen', 'boring', 'A', { seconds: 6 }),
  row(106, 'unseen', 'viewers dropping', 'A', { seconds: 6, half: true }), row(107, 'unseen', 'do something!!', 'B', { seconds: 6 }), row(111, 'unseen', 'i\'m leaving', 'B', { seconds: 10 }),
  // 10 · changing cars
  row(117, 'swap', 'new car who dis'), row(118, 'swap', 'swapped!!'), row(119, 'swap', 'now it\'s a {vehicle}', 'B'), row(120, 'swap', 'cops didn\'t see the swap', 'B', { unseen: true }),
  row(121, 'dropped', 'lost a siren for that', 'B'),
  // 11 · Mags is seen
  row(127, 'mags', 'grandma???', 'A', { first: true }), row(128, 'mags', 'is that a grandma', 'A', { first: true }), row(129, 'mags', 'she\'s wearing a visor'),
  row(130, 'drift', 'GRANDMA DRIFT', 'A', { lead: 'mags' }),
  // 15 · getting away
  row(171, 'cleared', 'they LOST him??'), row(172, 'cleared', 'no way'), row(173, 'cleared', 'gone. show\'s over'),
  row(175, 'cleared', 'no arrest again lol', 'B'), row(176, 'cleared', 'same time tomorrow', 'B'), row(179, 'cleared', 'gg', 'B'), row(180, 'cleared', 'got boring. we left', 'B', { under: 60 }),
  // 16 · being caught
  row(185, 'knockedout', 'they got him'), row(186, 'knockedout', 'down!!'), row(187, 'knockedout', 'they shot him. on tv', 'A', { gunfire: true }),
];
