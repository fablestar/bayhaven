# 05 · Content

What fills the world: missions, side jobs, things to find, things that happen to you, what the radio says, and one drop that exists only in each day's build.

## Missions

Missions are **data, not code**. Each is one file in `src/content/missions/` that lists steps. The engine (`src/systems/missions.js`, day 6) knows these step types, and a new mission should need no new engine code:

| Step type | Ends when |
|---|---|
| `say` | the dialogue lines have played |
| `cutscene` | the cutscene ends or is skipped |
| `goto` | the player reaches a marker (on foot, in any vehicle, or in a named one) |
| `enter` | the player is in the named vehicle |
| `follow` / `chase` | the target reaches its end / the target is stopped or caught |
| `deliver` | a carried vehicle or item reaches a marker (optional damage limit) |
| `collect` | N pickups have been taken |
| `photo` | the camera has framed the named target |
| `heat` | heat reaches, holds or clears a level |
| `survive` / `timer` | a clock runs out (good or bad) |
| `defeat` | named enemies are knocked out |
| `switch` | the player is the named lead |
| `choice` | the player picks an option; sets a flag later steps can read |

Every mission has: a giver and start marker, checkpoints (fail restarts from the last one), a fail list (vehicle destroyed, target lost, time up), a payout, and a result card.

**The result card** is a postcard, our own look: a snapshot from the mission in a white border, the mission name in the wordmark's style, three lines (time, cash, followers) and a stamp that says `Delivered`. It never uses a banner across the screen.

### The seven A missions, step by step

**1 · Final Notice** (Tideline, about 4 minutes, pays $500)
1. `cutscene` opening: the notice goes up; the tow truck leaves with Teo's scooter.
2. `enter` the Heron (Mags). Hint: how to drive.
3. `chase` the tow truck east along Heron Walk Drive. It runs two lights.
4. `survive` 3 rams against the truck's rear so the scooter breaks loose (bar on screen).
5. `say` Teo rides the scooter home. Mags follows him.
6. `goto` Park & Sons Auto. Hint: the minimap.
7. Result card. Unlocks: Repo Woman, free roam.

**3 · Repo Woman** (Tideline to Palma Vieja, about 6 minutes, pays $1,200)
1. `say` Wendell hands over three addresses.
2. `goto` car 1, a Tarpon outside Hotel Alba. `enter` it. `deliver` to the garage, damage under 30%. Timer 2:30.
3. Car 2, a Mullet in a Palma Vieja alley with a dog barking (text). Timer 3:00.
4. Car 3, a Wahoo. The owner sees you and gives chase in a Grouper. `deliver` with him ramming you. No timer.
5. Result card. Unlocks: repo side jobs, Open House.

**5 · Open House** (Mallard Greens, about 7 minutes, pays $4,000)
1. `goto` the gate in any tidy car (a dented car is turned away: go and fix it or steal another).
2. `say` on the tour: the guide's pitch for Bayhaven Tomorrow.
3. `goto` the clubhouse office on foot while the guide's back is turned (stay out of two guards' view cones, shown on the ground).
4. `collect` the binder. Alarm.
5. `enter` a Birdie golf cart. `heat` rises to 2.
6. `goto` the hole in the hedge behind the 14th green, across the golf course, with security carts behind you.
7. `heat` clear it. Hint: how viewers drain.
8. Result card. Unlocks: As Seen on TV.

**7 · As Seen on TV** (anywhere, about 5 minutes, pays $2,500 and 5,000 followers)
1. `say` Teo explains the plan. Mags says no. Teo is already live.
2. `heat` reach 3 (any way you like; the hint suggests honking at a cruiser).
3. `survive` 60 s at heat 3 or more. The LIVE overlay and chat are introduced. Bonus followers for stunts in view.
4. `heat` clear it. Hint: car washes, changing cars.
5. Result card showing peak viewers. Unlocks: Yacht Rock, the helicopter cam hint.

**11 · Yacht Rock** (yacht club, about 8 minutes, pays $12,000)
1. `cutscene` the switch is introduced: Teo at the gangway, Mags at the fuel dock.
2. As Teo: `goto` the top deck through the party without bumping three guards (bumping raises a "who is this guy" bar).
3. `photo` Bellweather and Kiki together, for June.
4. `collect` the key card from Bellweather's jacket on a chair.
5. `switch` to Mags. `enter` the Skipjack. `goto` the stern within 40 s.
6. `switch` to Teo. Jump.
7. As Mags: `survive` the boat chase out past the Sandpiper bridge; two security jet skis.
8. Result card. Unlocks: The Spire Job (when only A missions exist), otherwise Dry Run.

**18 · The Spire Job** (Meridian, about 12 minutes, pays $250,000)
1. `cutscene` the hurricane makes landfall. Weather is locked to hurricane.
2. As Mags: `deliver` the Manatee bus to the Spire's service dock through flooding streets and flying debris.
3. `switch` to Teo. Climb: `goto` up four service floors (outside scaffolding, a window-cleaning cradle that swings in the wind, the roof garden).
4. `collect` the deeds from the vault with the key card. Alarm. `heat` jumps to 4.
5. `switch` to Mags. `survive` 90 s holding the dock against cruisers with the bus. Bus Driver Voice works once.
6. `switch` to Teo. `goto` the cradle. Ride it down the outside of the tower in the storm.
7. As Mags with Teo aboard: `heat` 5. `goto` the pier gate at Heron Walk Drive `(600, 37)` across the city, the Sheriff's show truck behind you, by the route set in Dry Run (or the default route).
8. `heat` clear it: the storm knocks the broadcast off air at the pier gate.
9. `cutscene` ending. Leads into Going Viral.

**20 · Going Viral** (Tideline, about 3 minutes, pays $0 and 2,000,000 followers)
1. Morning, clear sky, wet roads. The bus is parked at the plaza where the ending left it. As Mags: `goto` Pelican Rest, 1.5 km west along the beach, while Bayhaven Public Radio reads the news of the night.
2. `say` Teo checks his phone. The clip.
3. Park the bus between two cones. However you park, the chat loves it.
4. Credits roll over a slow drive along the Longspan at sunset. The player can still steer.

B and C missions follow the same pattern from the one-line descriptions in `03-characters-and-story.md`. Each is written in the bonus pool or after release.

## Side jobs

`src/systems/activities/`, one file each. Started from a marker or the Jobs app.

| Job | How it plays | Pays | Count | Ships |
|---|---|---|---|---|
| **Bay Cab fares** | Pick up, drive to the pin, tip falls with every bump | $40–$180 | endless | day 7 |
| **Pelican Eats** | Teo on the scooter: deliver hot food before it cools | $30–$120 | endless | day 7 |
| **Street races** | Checkpoint races against 3–5 drivers | $500–$5,000 | 4, then 8 | day 7 |
| **Repo runs** | Take back a car, deliver it undamaged | $200–$400 | endless | day 7 (after mission 3) |
| **Airboat races** | Channels in the Glades | $800 | 4 | bonus |
| **Jet-ski slalom** | Buoys off the beach | $600 | 4 | bonus |
| **Gator wrangling** | Lure an alligator out of a pool with a chicken on a rope, drive it home | $350 | 6 | bonus |
| **Golf cart derby** | Last cart rolling on the 9th fairway | $1,000 | 1 arena | bonus |
| **Pier fishing** | A timing game. Twelve kinds of fish, one boot. | $5–$900 | endless | bonus |
| **Valet at Hotel Alba** | Park guests' cars fast and clean | $60 each | endless | bonus |
| **Drift scores** | Marked corners with a score to beat | $250 | 10 | day 2 (first one), bonus |
| **Speedbowl time trials** | Lap records in each class | $1,500 | 6 | after release |

## Things to find

| What | Count | Reward | Notes |
|---|---|---|---|
| **Lawn flamingos** | 100, ten per district | $250 each; all ten in a district unlocks a shirt | Pink plastic, glow faintly at night. Run them over or walk into them. 40 by day 7, 100 in the bonus pool. |
| **Big Air ramps** | 50 | $500 and followers by distance | A slow-motion replay from a side camera plays as you land. 15 by day 7, 30 with the bonus pool, 50 after release. |
| **Postcards** | 40 | followers; all 40 unlocks a filter | Photo spots: stand in the footprints, frame the view, shoot. 10 by day 7, 30 with the bonus pool, 40 after release. |
| **Gnomes** | 10 | a golden golf cart | Stolen from Mallard Greens lawns by persons unknown. Each is somewhere absurd: on a crane, in the alligator's mouth. Bonus pool. |
| **Mixtapes** | 24, two per station | each adds one song to its station | Cassettes. Bonus pool. |
| **Gerald sightings** | 20 | followers; all 20 unlocks a pelican hat | Photograph the pelican in twenty odd places. Bonus pool. |
| **Lawyer Larry billboards** | 40 | $100 each; all 40 makes Attorney Annie your lawyer | Deface them. Bonus pool. |

Positions are generated from each district's seed and then nudged by hand so each one is somewhere you would want to go: a rooftop you can reach, the end of the pier, under the expressway.

## Random events ("Local Man")

Short things that happen near you, a few minutes apart. Each is one file in `src/content/events/`, has a trigger (place, hour, weather), lasts under 90 seconds, and ends with a headline on Bayhaven Public Radio and a post on Squawk. Sixty at full size, all specified in `bible/activities/local-man.md`. The first twenty are listed here; the five marked * are the first to be built.

1. * Local Man tries to return an alligator to a pet shop. Follow the trail of fleeing shoppers.
2. * A wedding party's limo has broken down. Drive the couple to the pier before sunset.
3. * A runaway shopping-trolley train rolls down the Galleria car park.
4. * A man in an inflatable flamingo is being blown out to sea. Reach him by boat or jet ski.
5. * A mascot in a hot-dog suit is being chased by a mascot in a taco suit. Pick a side.
6. A drone has stolen a sandwich. Chase it.
7. Someone has parked a jet ski in a swimming pool and wants it back in the sea.
8. A tourist asks to be photographed. Then asks again, 40 metres later.
9. Golf carts are racing on the expressway.
10. An ice-cream van and a rival ice-cream van are having a slow chase.
11. A pelican has taken a deputy's hat. The deputy offers $200.
12. A homeowner is measuring your parked car with a ruler. Fines follow you by text.
13. A flash mob dances on Heron Walk at sunset.
14. A man is selling "hurricane insurance" from a folding table in a hurricane.
15. Iguanas fall from the palms on a cold morning. Drive carefully.
16. A boat on a trailer has come loose and is overtaking the truck towing it.
17. A film crew is shooting a car chase. Drive through it.
18. An influencer is live from the middle of the road and will not move.
19. A lost bus of retirees thinks you are the tour guide.
20. Gerald the pelican is sitting on your car. He will leave when he is ready.

## Squawk

`src/content/squawk.js`. Posts are templates filled from events the game already emits (`06-tech-architecture.md` lists them). Squawk posts are the one place lowercase is in character; everything else a player reads uses normal casing. About 40 templates at mid level, 120 in the bonus pool. Samples:

- On a long drift: *"whoever is drifting past {landmark} rn: marry me"*
- On a crash into a hydrant: *"free water park on {street}. thank you, mystery driver"*
- On losing heat 3: *"they LOST him?? @BayhavenBlue explain"*
- On the 15:15 storm: *"3:15. right on time."*
- On Mags doing anything: *"is that a grandma"*
- On followers passing 10,000: *"ok who is {handle} and why is he on my feed every day"*

Teo's handle is `@teo.navarro.live`. The Sheriff's is `@BayhavenBlue`. Kiki's is `@kiki.halcyon`.

## Radio scripts

Each station is one file in `src/content/radio/` with songs (seed and patterns), host lines, idents and ads. Each station ships with at least 6 host lines, 2 idents and 4 ads; ads are shared across stations from a pool of 24. Samples to set the voice:

- **Tideline 98, Nightshift Nina:** *"It's 2 a.m., the roads are empty, and so is my fridge. This one's for everybody driving nowhere on purpose."*
- **Radio Palma, El Capitán Memo:** *"If you can hear this, turn it up. If your neighbour can hear this, you're welcome, neighbour."*
- **Bassline FM, DJ Subtropic:** *"Humidity's at ninety-four percent. So is this bassline."*
- **Swamp Country 94, Hoot Gibbons:** *"That was a song about a truck. Coming up, a song about a different truck."*
- **Bayhaven Public Radio, Barbara Wetherby:** *"In local news, a man described only as 'driving like that' was seen near {district} this afternoon. Police are asking viewers to stay tuned."*
- **The Grind 24/7, Kiki Halcyon:** *"Sleep is a subscription you can cancel. Day forty of my nine-day cleanse."*

Ads (all invented):

- **SPF 1000:** *"The sun can't see you. Not available in stores, pharmacies, or daylight."*
- **Lawyer Larry:** *"Hurt? Bored? Standing near something? Call Larry. 555-0144."*
- **Bayhaven Tomorrow:** *"Luxury living where your neighbourhood used to be. From the low nine hundreds."*
- **Storm Mart:** *"Plywood, water, and one remaining pool noodle. Storm Mart. We were going to close anyway."*
- **Big Earl's:** *"Thirty metres of alligator. Zero metres of museum. Exit 44."*
- **Gator Putt:** *"Eighteen holes. Seventeen alligators. One is on break."*

Phone numbers always use the 555-01xx range.

## Names that are already approved

New shops, signs and brands come from this list first. Anything new must pass the name check (`tools/lint-names.mjs`, see `06-tech-architecture.md`) and follow the pattern: a plain word or a pun about beaches, weather, birds, fish, food or heat. Nothing that sounds like a real company, a real place or anything to do with money systems.

**Bars, clubs, hotels:** Club Luma · The Pink Heron · Low Tide Bar · Hotel Alba · Tideline Motel · Humidity · Dew Point · Feels Like 104 · The Sweaty Flamingo · Wet Paint · The Stilt House · Yacht Club Bayhaven

**Food:** Mango Moon · Shell Yeah · Ventanita Rosa · Key Lime Crimes · Squeeze Play · Hush Hour Diner · Pressed · Lava Abuela (hot sauce) · Pelican Eats (delivery) · Big Earl's

**Shops:** Surf & Vinyl · Coral Arcade · Second Wind Thrift · Maison Sable · Storm Mart · Bait & Ballistics · Park & Sons Auto · Frond Memories (florist) · Mullet Over (barber) · Reel Estate (bait and houses) · Manatee Mattress · Iguana Insurance · Cash 4 Jet Skis · Galleria Flamingo · Gator Putt · Starlite Drive-In

**Institutions:** Bayhaven General · Bayhaven Public Radio · Bayhaven Blue: Live · Bay Cab · Bayhaven International · the Speedbowl · Bayhaven Tomorrow · Glow Camp · SPF 1000 · Lawyer Larry · Squawk

## Only on day N

Each daily build carries one drop that exists **only in that day's build**. Old builds stay online, so each drop becomes a small time capsule and a reason to post that day's link. A drop is one file, `src/content/drops/day-N.js`, switched on by the build's day number. It must be findable within 60 seconds of starting (a marker on the minimap from day 4, a sign near the spawn before that).

| Day | Drop | What it is |
|---|---|---|
| 2 | **Drift Night** | A cone course on Heron Walk Drive with a drift score board. The cones are neon. |
| 3 | **Flamingo Flash Mob** | At sunset, 150 people on the beach do the same dance. Walk into the middle of it. |
| 4 | **Rooftop Launch Party** | A stage on a Meridian rooftop with lights that pulse in time with Tideline 98. Reachable by a ramp. |
| 5 | **Bayhaven Blue: Pilot Episode** | Heat 5 can be started from a red button in the plaza. The build records your peak viewers. |
| 6 | **The Getaway Cup** | Final Notice against the clock, with a ghost of your best run. |
| 7 | **Switch Day** | Every switch lands on a new vignette (all sixteen in a row), and a parade of golf carts crosses Tideline at noon. |
| 8 | **Hurricane Party** | A hurricane arrives at 21:00 game time. Lawn furniture flies. A man sells insurance. |
| 9 | **Launch Night** | Fireworks over the bay at midnight, and a billboard in the plaza listing how many commits each day took. |

After release, the eight drops come back as "Reruns" in the title menu (see the roadmap's after-release track).

## The first ten minutes

What a new player meets, in order, in the day 9 build. Nothing here is a wall of text; each hint is one line that disappears when you do the thing.

1. Title screen: the city at sunset, the wordmark, then `Continue`, `New game`, `Time machine`, `Settings`, `Credits` (as `07-art-and-audio.md` says).
2. The opening cutscene (30 s, skippable).
3. Final Notice: drive, chase, ram. Three hints: steer, handbrake, minimap.
4. Free roam with one message waiting from Wendell and a pulsing marker 300 m away: his garage door says "Back in 5" and he waits by Hotel Alba `(284, 46)`.
5. Within the first two minutes of free roam, a flamingo, a ramp and a person filming you are placed on the way to that marker, so the player meets all three by accident.
6. Getting out of the car anywhere shows the on-foot hint once.

## Where the full lists are

This file sets the patterns. The complete content, item by item, is in the bible:

| What | Count at full size | File |
|---|---|---|
| Chapter 1 missions, scripted line by line | 20 | `bible/story/act-1.md` to `act-4.md` |
| Cutscene shot lists | 10 | `bible/story/cutscenes.md` |
| Regulars and their jobs | 12 and 46 | `bible/story/regulars-1.md`, `regulars-2.md` |
| Chapters 2 and 3, outlined | 40 missions | `bible/story/chapter-2.md`, `chapter-3.md` |
| Phone messages | about 120 | `bible/story/messages.md` |
| Radio stations, songs, host lines | 12 stations, 72 songs | `bible/radio/` |
| Ads, news templates, scanner calls | 48, 80, 60 | `bible/radio/ads.md`, `news.md`, `scanner.md` |
| Squawk posts, LIVE chat lines | 200, 250 | `bible/voices/squawk.md`, `live-chat.md` |
| Street barks, signs and billboards | 400, 200 | `bible/voices/barks.md`, `signs.md` |
| In-game web pages, what plays on screens | 12 sites, 38 items | `bible/voices/web.md`, `screens.md` |
| Side jobs (20, plus 8 criminal jobs), small games, races | 28, 12, 20 | `bible/activities/side-jobs.md`, `side-jobs-crime.md`, `minigames.md`, `races.md` |
| Big Air ramps and things to find | 50 and 234 | `bible/activities/big-air.md`, `finds.md` |
| Local Man events | 60 | `bible/activities/local-man.md` |
| The week, seasons, daily challenges | 7 days, 8 seasons, 30 templates | `bible/activities/calendar.md` |
| Vehicles, weapons, clothes, property, achievements, and every shop | 69, up to 15, 150, 26, 60 | `bible/catalog/` |
