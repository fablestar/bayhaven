# Bible · story · Messages

Every text the phone can receive in chapter 1: the twenty mission offers, sixty lines of banter between Mags and Teo, two texts from each of the twelve Regulars and twelve pieces of spam. Each row names the event or place that sends it, so the whole file can be loaded as data. No text is longer than 160 characters.

Tier: A for the Messages app, the banter and the offers for A missions. Other rows carry the tier of the mission, Regular or brand they belong to.

## How messages work

- **Data.** One entry per row, in `src/content/messages.js`:
  `{ id: 'offer-03', from: 'wendell', to: 'any', on: 'mission:offered', when: { id: 'repo-woman' }, text: '...', waypoint: [284, 46], once: true }`
- **Threads.** One per sender. Mags and Teo share one thread. A new text plays two blips at the sender's pitch and shows as a pill above the minimap for 4 s.
- **Waypoints.** Tapping a text that has a seed sets the waypoint, as `04-systems.md` says.
- **Offers** are sent on `mission:offered` and stay pinned at the top of the thread until `mission:started`. When the giver is the lead being played, the text shows on the right, as already sent.
- **Banter** comes from the lead you are not playing. At most one every 4 minutes of play. Each row fires once a game day. Nothing is sent during a mission step that has a clock. Rows triggered by heat are sent at once; the rest wait while heat is 3 or more.
- **Regulars** send their first text when the meeting trigger in `regulars-1.md` or `regulars-2.md` happens, and their second one game day after their chain ends.
- **Spam** is one a game day at most, between 09:00 and 18:00. Replying "Stop" sends the same text again.
- **Casing.** Mags writes full sentences with punctuation. Teo writes in lower case with no full stops; that is his voice and the lint allows it in this file. Everyone else uses normal sentence casing. Swearing follows the character: Teo freely, Mags about once in thirty texts, brands never.
- **Fill-ins** work as they do for Squawk: `{landmark}`, `{street}`.

## Mission offers

One per chapter 1 mission, from its giver. Missions 1 and 20 have no giver, so Teo sends the first and Mags the last. Missions 18 and 19 are given by both: the player sees the row written by the other lead. Missions 1, 19 and 20 start by themselves; their texts are in the thread, already read, for anyone who scrolls back.

| # | Mission id | From | Tier | Waypoint | Text |
|---|---|---|---|---|---|
| 1 | `final-notice` | Teo | A | `(-1256, -226)` | mags come outside, a guy is stapling something to the board and a tow truck has my fucking scooter, this is not a drill |
| 2 | `content-is-king` | Teo | B | `(-1246, -224)` | new plan, we go viral and the internet saves the park, i need 3 stunts and you watching the stream, yes from under the car |
| 3 | `repo-woman` | Wendell | A | `(284, 46)` | Mags. Bellweather's outfit owes me for 40 cars. I want 3 back today. I'm on the bench across from Hotel Alba. |
| 4 | `hot-sauce` | Rafa | B | `(-1400, -880)` | You're the one who rammed the tow truck. I have a van of my mother's sauce and a small problem. Domino Park, table one. Sit first. |
| 5 | `open-house` | Mags | A | `(-1250, -220)` | There's a tour of the model home in Mallard Greens. We're going. Wash the car and wear a shirt with all its buttons. |
| 6 | `glow-up` | June | B | `(-1108, 110)` | It's June. Don't say my name out loud. White van at the Sandpiper Bridge, before one. Bring nothing. Especially not a plan. |
| 7 | `as-seen-on-tv` | Teo | A | `(-1246, -224)` | ok hear me out, the sheriff gets half a million viewers and i get 212, what if we borrowed his, come to my trailer, i am already live |
| 8 | `swamp-thing` | Nilda | B | `(1200, -3250)` | Nilda Ferro! Airboats! Surveyors staked my damn channels! I need a driver at my dock before eight! Their patrol shoots! So do I! |
| 9 | `crane-game` | Dess | B | `(2900, -260)` | Whitlock, at the port. There's a pink box on my dock with your Monday in it. Foot of crane 3, before six. Over. |
| 10 | `injury-time` | Lawyer Larry | C | `(420, -1830)` | Hurt? Not yet? Lawyer Larry here. Mr Bellweather's limo and my new clients should meet. Gently. Come by the office. 555-0144. |
| 11 | `yacht-rock` | June | A | `(-1150, 70)` | Saturday, 21:00, the yacht club gate. Bellweather's key card will be in his jacket. I can get Teo aboard as talent. Loosely. |
| 12 | `paint-it-pink` | June | C | `(1180, -1180)` | Five Bayhaven Tomorrow billboards. One night. I have pink wrap, a ladder and a grudge. My loft, after dark. |
| 13 | `the-binder` | Barbara | B | `(-1250, -220)` | This is Barbara Wetherby, Bayhaven Public Radio. I understand you have a binder. I would like to read it on air. I am calling you now. |
| 14 | `speedbowl` | Wendell | B | `(2700, -1850)` | Friday. Race night. First prize is the hauler you need. I kept the number 9 car. Infield garage. Don't make it a thing. |
| 15 | `dry-run` | Mags | B | `(60, -700)` | We look at the Spire today. Three photographs, then the way out until I can drive it asleep. I'm parked on Coral Boulevard. |
| 16 | `hurricane-party` | Rafa | C | `(-1400, -880)` | Storm's coming and my street has no power. The Galleria has a generator truck lighting a showroom. Table one. Bring gloves. |
| 17 | `evacuation-route` | Mags | C | `(-400, -2980)` | The neighbours are safe at Big Earl's. Every lane is leaving town and I'm going back in. Stay by the phone. |
| 18 | `the-spire-job` | Mags | A | `(-1256, -226)` | It's tonight. The bus is ready. His men will be armed. Wear shoes you can climb in. That does not mean the slides. |
| 18 | `the-spire-job` | Teo | A | `(-1256, -226)` | its tonight, its actually tonight, i charged two phones and i might throw up, holy shit mags |
| 19 | `eye-of-the-storm` | Mags | B | `(0, 37)` | The eye is over us. We have a few quiet minutes. Keep hold of those papers. |
| 19 | `eye-of-the-storm` | Teo | B | `(0, 37)` | mags the sky has a fucking hole in it and the sheriff is still filming, i think we show him the deeds |
| 20 | `going-viral` | Mags | A | `(0, 37)` | Morning. The bus goes home now. So do we. I'm driving. |

## Banter from Teo

Sent when the player is Mags. Sender `teo`. Each trigger is an event from `06-tech-architecture.md` with one condition, or a place or an hour.

| id | Trigger | Text |
|---|---|---|
| T01 | `vehicle:crash`, speed over 80 | holy shit i heard that from the park, are you ok, is the car ok, did anyone film it |
| T02 | `drift:end`, score over 5,000 | someone posted a grandma drifting past {landmark}, 4k likes, i have never had 4k of anything |
| T03 | `jump:landed`, over 30 m | what the fuck, you were in the air, you told me you never left the ground in 31 years |
| T04 | `heat:changed`, to 3 | you are on the show right now and his deputies are shooting, dont wave, drive |
| T05 | `heat:live`, viewers over 100,000 | 100k people are watching you, i would like everyone to know i know her |
| T06 | `heat:cleared`, from 3 or more | they lost you?? the chat is furious, this is the best day of my life |
| T07 | `player:booked` | they booked you?? do i call a lawyer, i only know the one from the billboards |
| T08 | `player:knockedout` | the hospital called, i am your emergency contact, i am on my way, do not die before i get there |
| T09 | `clock:hour`, 3 | why are you awake, im awake for content, whats your excuse |
| T10 | `clock:hour`, 15 | storm in fifteen minutes, i dont make the rules, the sky does |
| T11 | `clock:sunset` | golden hour, if you see anything beautiful point the car at it |
| T12 | `weather:lightning`, within 400 m of the Spire | that one hit the spire again, good |
| T13 | `district:entered`, Mallard Greens | dont touch the grass in there, they measure it |
| T14 | `district:entered`, Mudcat Glades | say hi to the big alligator, the fake one, do not say hi to the real ones |
| T15 | `district:entered`, The Islands | you are on sandpiper isle, do not make eye contact with a hedge |
| T16 | `vehicle:entered`, Manatee | you smiled when you got on that bus, someone posted it |
| T17 | `weapon:fired`, by Mags | was that a gun, was that your gun, since when do you have a gun |
| T18 | `vehicle:destroyed` | that car just blew up, tell me you were not in it, wendell is going to do the face |
| T19 | `prop:broken`, a hydrant | free water park on {street}, the kids say thank you |
| T20 | `ped:filming`, count 10 or more | ten people are filming you and none of them are me, this hurts |
| T21 | `followers:milestone`, 1,000 | one thousand, we hit one thousand, i know you dont care, im telling you anyway |
| T22 | `followers:milestone`, 10,000 | a guy at shell yeah knew my name, he said it wrong but he knew it |
| T23 | `crime`, a killing, seen | mags that guy is not getting up, are we ok, are we the bad guys, call me |
| T24 | `radio:station`, The Grind 24/7 | you are listening to kiki, i can feel it from here, change it |
| T25 | `photo:taken` | send me that, no filter, ok one filter |
| T26 | `mission:failed` | that was the rehearsal, everyone gets a rehearsal |
| T27 | `mission:completed` | the postcard looks great, you are frowning in it, on brand |
| T28 | `cash:changed`, up $10,000 or more | we are rich, can i have 40 dollars for phone storage |
| T29 | `property:bought` | we own a second place?? do i get a room, do i get a shelf |
| T30 | Place: within 80 m of the ferris wheel `(600, 400)` | if you are at the pier bring me a scoop dreams, any flavour, not the fish one |

## Banter from Mags

Sent when the player is Teo. Sender `mags`.

| id | Trigger | Text |
|---|---|---|
| M01 | `vehicle:crash`, speed over 60 | I heard a crash. If that was my car, keep walking. Away from town. |
| M02 | `jump:landed`, over 20 m | Wheels belong on the road. I shouldn't have to write that down. |
| M03 | `heat:changed`, to 1 | Pull over, apologise, and do not tell him your handle. |
| M04 | `heat:changed`, to 3 | You are on television and they are shooting. Drive like it fucking matters. |
| M05 | `heat:live`, viewers over 50,000 | Fifty thousand people are watching you drive badly. Use your mirrors. |
| M06 | `heat:cleared` | Good. Now park, switch off and be boring for five minutes. |
| M07 | `player:booked` | I am not picking you up. I am parked outside. Those are different. |
| M08 | `player:knockedout` | The hospital says nothing hit anything you use. I asked them to check again. |
| M09 | `clock:hour`, 6 | Tai chi on the beach at six. You're invited. You won't come. |
| M10 | `clock:hour`, 2 | It is two in the morning. Whatever you're filming will still be there in daylight. |
| M11 | `clock:hour`, 12 | Eat something that didn't come through a window. |
| M12 | `weather:changed`, to afternoon storm | Rain. Slow down by a third. A real third, not one of yours. |
| M13 | `weather:changed`, to hurricane | Get inside. That is not advice. |
| M14 | `district:entered`, Rustwater | Mind the forklifts. They don't mind you. |
| M15 | `district:entered`, Palma Vieja | If Rafa offers coffee, say yes. If his mother does, say thank you first. |
| M16 | `district:entered`, Meridian | Mind the buses downtown. They were there first. |
| M17 | `district:entered`, Runway Flats | The runway is not a road. I know it looks like the best road. |
| M18 | `vehicle:entered`, Pinfish | Helmet. |
| M19 | `vehicle:entered`, the Heron | That's my car. I know the mileage. |
| M20 | `vehicle:destroyed` | Did you get out first? Good. Now tell me whose it was. |
| M21 | `ped:hit`, over 50 km/h | People are not cones. That one is not getting up. |
| M22 | `weapon:fired` | If you fire that, you own whatever it hits. Think first. |
| M23 | `followers:milestone`, 100,000 | A hundred thousand. Your grandmother would have told the whole park. So I did. |
| M24 | `drift:end`, score under 500 | I saw that drift. I've seen shopping trolleys hold a better line. |
| M25 | `shop:opened`, Ventanita Rosa | No more coffee. You vibrate. |
| M26 | `radio:station`, Swamp Country 94 | Leave that on. I like the one about the truck. |
| M27 | `mission:failed` | Again. Slower, then faster. |
| M28 | `mission:completed` | That was fine. |
| M29 | `player:switched`, to Teo | I was in the middle of something. It can wait. It always does. |
| M30 | Place: within 60 m of Pelican Rest `(-1250, -220)`, after 22:00 | Lights are out at the park. Shut the gate quietly. Gerald is asleep on your scooter. |

## Texts from the Regulars

Two each. The first is sent on the meeting trigger. The second is sent one game day after the chain's last job.

| Regular | Tier | When | Waypoint | Text |
|---|---|---|---|---|
| Lawyer Larry | B | first | `(420, -1830)` | Hurt? Booked? Shot at? Lawyer Larry. Bail is half off for clients. Become one. 555-0144. |
| Lawyer Larry | B | after | | Billboard 41 is up. You're in the corner. It's a good corner. Annie says hello. Allegedly. |
| Dee Pfeffer | C | first | `(-2000, -2100)` | This is not an official message. Your parking was a violation. I can arrange worse ones for worse people. My cart, by the clubhouse. |
| Dee Pfeffer | C | after | | Room 9 at the Tideline Motel. No lawn. No rules. Brad shot my stapler. I have not measured anything in a week. I miss it a little. |
| Priya Raman | C | first | `(1000, -1100)` | Pressed here. Wrap Battle is in my spot again and their cook showed me a shotgun. You eat my sandwiches. Come and earn one. |
| Priya Raman | C | after | | Your sandwich is on the board. The Double Press. Double pickle, pressed twice. You eat free, so it costs you nothing. |
| Old Man Fitch | C | first | `(-900, 70)` | This is Fitch. I don't text. My wife is typing. You beeped nicely the other day. I have a map. Mornings, on the sand. |
| Old Man Fitch | C | after | | Mrs Fitch here. He wears the ring in the bath now. Thank you. He found your hat on the beach, by the way. It beeped. |
| Coach Brenda Oyelaran | C | first | `(-2000, -1520)` | Coach Brenda Oyelaran. You were in our lane this morning. Good posture, bad timing. South gate, 05:30. Late is 05:31. |
| Coach Brenda Oyelaran | C | after | | The cup is on my mantel. The board thinks a heron took it. Walk with us any dawn. Knees up. |
| Zoom Ziegler | B | first | `(-560, -760)` | Nice driving in Meridian. I got it all from 60 metres up. Want to be paid for the next one? Zoom, at the Tide. Radio Row. |
| Zoom Ziegler | B | after | | Front page again. The drone pulls left, I did warn you. If it comes home with a sandwich, that was the gull. |
| Madame Calypso | C | first | `(-320, -1790)` | I foresaw this message. I foresee rain at 3:15. I foresee you outside my shop on Gateway Boulevard. Two of those are certain. |
| Madame Calypso | C | after | | Tomorrow: fog at dawn, a storm at 3:15, and something falls out of a palm near you. The first two are free. |
| Deputy Wade Purdy | C | first | `(-40, -1840)` | Thanks for the hat. Mostly. Meet me where there are no cameras: behind Bun Voyage, after ten at night. Bring nothing that films. |
| Deputy Wade Purdy | C | after | | The show has been shapes for a week and ratings are up. I filed a report about it. On paper. Nobody read it. Perfect. |
| Gus Thibodeaux | B | first | `(-400, -2980)` | Gus at Big Earl's. You drove through my alligator and didn't scratch a tooth. I've got work for a careful driver. Exit 44. |
| Gus Thibodeaux | B | after | | Pickles is back in the motel pool. He's fine. Leave him. The Amenity says hello. He doesn't, but I can tell. |
| Dr. Imani Okoro | C | first | `(-2280, 520)` | Dr. Okoro. You stopped for the turtles. Most people honk. I have more work like that at the lab on Tackle Key. |
| Dr. Imani Okoro | C | after | | Sixty-one hatchlings reached the water at Glow Camp. I counted twice. The houseboat owner will take your offer. Say I sent you. |
| Skip Lindqvist | C | first | `(-1450, 60)` | Skip Lindqvist, Cash 4 Jet Skis! Wendell says you repo. I've got hulls out there that think they're free. Some owners shoot. Come by the lot. |
| Skip Lindqvist | C | after | | Tripp wants his yacht back. I said read page nine. He framed page nine. Free jet ski for you at any marina, partner. |
| Abuela Carmen | C | first | `(-1700, -480)` | This is Carmen Montalvo. My son gave me your number. I counted the bottles. Come to the kitchen. Wash your hands first. |
| Abuela Carmen | C | after | | The flat over the bakery is aired. Half price is still a price. Pay on time. Come Tuesday. You owe Hector a game. |

## Spam

Twelve brands from the canon. The sender shows as the brand name. A row with a trigger is sent the next morning after that event; a row without one fills an empty day.

| Brand | Tier | Trigger | Text |
|---|---|---|---|
| SPF 1000 | A | `clock:hour`, 12, clear weather | SPF 1000: the sun can't see you. Reply GLOW for a sample. Not available in stores, pharmacies or daylight. |
| Bayhaven Tomorrow | A | `mission:completed`, `final-notice` | Bayhaven Tomorrow: luxury living where your neighbourhood used to be. Tour the model home today. Please do not touch the lawn. |
| Storm Mart | A | `weather:changed`, to tropical storm | Storm Mart: plywood is back in stock. So is the one pool noodle. First come, first served. We were going to close anyway. |
| Iguana Insurance | B | `vehicle:destroyed` | Iguana Insurance: your claim is important to us. Bullet holes count as weather. You are number 4,112 in the queue. |
| Dent-A-Car | B | `vehicle:crash`, speed over 100 | Dent-A-Car: every rental comes with dents already in it, so you can relax. Bring it back with new ones and we call it even. |
| Pelican Eats | A | | Pelican Eats: your order is 2 minutes away. Your rider has been 2 minutes away for 20 minutes. He says there was a ramp. |
| Big Earl's | A | `district:entered`, Mudcat Glades | Big Earl's: thirty metres of alligator. Zero metres of museum. Drive in at the mouth, leave by the gift shop. Exit 44. |
| Manatee Mattress | B | `clock:hour`, 3 | Manatee Mattress: sleep like something large and unbothered. Half off all floor models. They have been napped on. |
| Cash 4 Jet Skis | C | `vehicle:exited`, any boat | Cash 4 Jet Skis: got a jet ski? Want cash? That is the whole business. Skip pays up to forty dollars. |
| Glow Camp | B | `player:knockedout` | Glow Camp: nine days, forty tents, one you. Early prices end when Kiki says so. Bring nothing. We sell everything. |
| Pill Bill's | B | `clock:hour`, 16, after a clear day | Pill Bill's Pharmacy: your sunburn cream is ready. So is everybody's. The queue starts in aisle one and ends outside. |
| Low Altitude Airlines | A | `district:entered`, Runway Flats | Low Altitude Airlines: now boarding, eventually. See the whole city from much too close. Carry-on is whatever you can hold. |

## New names

- **The Double Press:** a sandwich at Pressed, named after the player when the Lunch Rush chain ends.
- **Room 9, Tideline Motel:** where Dee Pfeffer moves. Room 12 stays for sale to the player.
