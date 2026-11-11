# Bible · activities · Calendar

The canon's seven-day week as full specs, eight seasonal events tied to the real date, and the daily challenge: three tasks picked from the date so every player gets the same three. Each entry says where, when, what spawns, what the player can do and what they win, with a radio line and a Squawk post.

Tier: A for the 15:15 storm. B for the week's clock, eight weekly entries and the daily challenge. C for six more weekly entries and the eight seasons. D for launch day, which needs Cape Calamity.

## How the calendar works

| Rule | Value |
|---|---|
| Files | `src/systems/calendar.mod.js` runs it. Entries are `src/content/calendar/<id>.js`. Seasons are in `src/content/calendar/seasons.js`. The phone page is `src/ui/phone/challenges.js`. |
| State | `state.calendar = {weekday, dayCount, date, season, active}`. `weekday` is 0 for Monday to 6 for Sunday. `dayCount` is in-game days since the save began. |
| First day | A new save starts on a Monday unless the clock's own spec names another day. The day changes at 00:00. |
| On screen | The clock shows the day before the time: `WED 15:14` |
| Entry | `{id, tier, weekday, from, to, where: {x, z, r}, start(ctx), stop(ctx)}` |
| Start | When the weekday and hour match and the player is within `r + 400` m, the entry starts within 30 s. Citywide entries have no `where` and always start. |
| Stop | At the end of its window. Whatever is in view stays until it is out of sight or 60 s pass. |
| Budgets | Entries change the mix of people and cars inside the caps in `04-systems.md` and never add to them. Bigger crowds are crowd cards: flat figures, up to 400 on laptop and 120 on phone. |
| Events | `calendar:day {weekday}`, `calendar:started {id}`, `calendar:ended {id}` |
| Test API | `test.calendar.set(weekday, hour)`, `test.calendar.setDate('2027-01-09')`, `test.calendar.active()` |
| Lines | The radio line is read once when an entry starts. The Squawk post lands within a minute. |

## Every day

Fixed points from `04-systems.md`, which the calendar reads and does not own: traffic at 0.3 of normal at 03:00, rush hours at 08:00 and 17:30, brand deals at 09:00, the storm at 15:15, and `clock:sunset`.

**The 15:15 storm** (`cal-storm`, A). Citywide. Every day, 15:15 to about 15:55.  
**Spawns:** hard rain, wipers, darker roads with stretched reflections, grip 0.8. People run for cover. Afterwards a rainbow and steaming roads.  
**Do:** the Storm run job ends when it starts. Lifeguard patrol's level 5 races it. Ten Pin Tide goes to thunder mode. Mixtape 10 can only be picked up in it. The redfish and the amberjack bite. Local Man 31, 37 and 45 need it.  
**Radio:** "It's 3:14. You have one minute to pretend to be surprised."  
**Squawk:** "3:15. right on time."

## The week

### Monday

**Bin day** (`cal-bin-day`, B). Every street in the grid districts, Northgate and Mallard Greens. Monday, 05:00–09:00.  
**Spawns:** from Sunday 20:00, a wheeled bin at the kerb outside every second lot. From 05:00, one Pelican per district near the player, crawling at 15 km/h and stopping every 40 m. Cars queue behind it and honk.  
**Do:** take the `bin-day` job. Knock bins over: each is a `prop:broken`, and a crew that sees it shakes a fist. Follow a full truck to the yard at `(2200, -1200)`.  
**Radio:** "It is five on Monday morning. Your bins know what they did."  
**Squawk:** "bin day. the trucks are out. so is my neighbour, in his robe"

**Lawn inspection** (`cal-lawn-inspection`, C). Mallard Greens. Monday, 09:00–12:00.  
**Spawns:** six inspectors in Birdies with rulers and clipboards. An orange violation flag on 20 seeded lawns. Residents on doorsteps, arguing.  
**Do:** walk into a flag before its inspector photographs it and the owner hands you $10. Park anywhere for 10 s and Local Man 12 starts at once.  
**Win:** $10 a flag. All 20 in one morning: 500 followers more.  
**Radio:** "Mallard Greens reminds residents that grass is a privilege."  
**Squawk:** "inspection day in the greens. hide your gnomes"

### Tuesday

**Domino league** (`cal-domino-league`, B). Domino Park `(-1400, -880)`. Tuesday, 18:00–21:00.  
**Spawns:** eight tables, 24 players, 30 people watching, a chalk league table, a coffee cart. Hector and Abuela Carmen share the top table. Rafa keeps score.  
**Do:** play one league game to 50 against the next name on the chalk table (`minigames.md`). A win is 3 league points. A season is four Tuesdays. The top table plays for $1,000 a game.  
**Win:** 100 followers a win. Three wins: the trophy and free coffee. Race SR3 opens on Avenida Rosa at 20:00.  
**Radio:** "League night at the park. Hector says he is not nervous. Hector is polishing his tiles."  
**Squawk:** "abuela carmen just knocked on the table and three grown men left"

**Two-for-one at the Starlite** (`cal-starlite`, B). Starlite Drive-In `(350, -2400)`. Tuesday, 20:00–23:00.  
**Spawns:** from 19:30 a queue of 12 cars on Billboard Road. 40 cars parked facing the screen. The usual film, Triangle Meets Circle, with a second film, Square Goes Alone, projected over it. A snack hatch.  
**Do:** a ticket is $5 and covers both leads: switch, and the other one is in the next seat. Park in a bay for 60 s and health refills. Honk and the car beside you honks back, then all 40 do: 300 followers, once a night. Big Air ramp 28 pays double followers. Mixtape 20 is in the booth, which is open only tonight.  
**Radio:** "Two films for one ticket at the Starlite. They play at the same time."  
**Squawk:** "starlite is showing two movies on one screen again. i followed both"

### Wednesday

**Cruise day** (`cal-cruise-day`, B). The cruise terminal `(2500, 100)` and all of Tideline. Wednesday, 10:00–17:00.  
**Spawns:** the white ship docks at 09:30 with one long horn. In Tideline four people in five are tourists, in groups of 6 to 12 behind a guide with an umbrella. Two shuttle Manatees loop between the terminal and the plaza. Ten souvenir stalls on the promenade. Tourists film from 60 m, not 40 m.  
**Do:** Bay Cab fares come twice as often and tip a quarter more; the $180 cap stays. The valet's level 5 opens. Race BR1 pays double followers. Local Man 33 can start. At 16:45 the horn sounds three times and three late passengers need a ride to the terminal by 17:00, each at a full tip.  
**Radio:** "The ship is in. If you are on Heron Walk, so is everyone."  
**Squawk:** "cruise day. three thousand people just found the plaza at once"

### Thursday

**Open mic** (`cal-open-mic`, C). Wet Paint, in Wet Paint Alley `(1100, -600)`. Thursday, 20:00–23:00.  
**Spawns:** 25 people inside, a queue of 8 in the alley, a chalkboard with five acts, a host with a bell.  
**Do:** the `open-mic` game in `minigames.md`.  
**Win:** followers, and $200 from the tip jar for topping the board.  
**Radio:** "Open mic at Wet Paint. Bring a song, a poem or a bus timetable."  
**Squawk:** "a grandma just read a bus timetable at open mic and got an encore"

**Tank Farm meet** (`cal-tank-farm-meet`, C). The beach-ball tanks `(2400, -700)`. Thursday, 23:00–03:00.  
**Spawns:** 30 parked cars with their bonnets up, 40 people filming, a starter with a beach towel, Bassline FM from every open door.  
**Do:** race SR4. Park in the chalk square to be judged: a score from your paint, wrap and parts, held up on phones, worth 100 to 1,000 followers once a night. Drift corner 6 scores double. Side bets as in `races.md`, and bigger here than anywhere. At 01:00 a cruiser rolls past, everyone scatters, and anyone moving fast takes heat 1.  
**Radio:** "Nothing is happening at the Tank Farm tonight. Do not go at eleven."  
**Squawk:** "tank farm. 11. you did not hear it from me"

### Friday

**Race night** (`cal-race-night`, B). The Speedbowl `(2700, -1850)`. Friday, 19:00–23:00.  
**Spawns:** floodlights, 400 crowd cards in the stands, eight stock Wahoos with numbers, a pace Heron, an announcer on the speakers.  
**Do:** enter the feature race: 10 laps against seven, rolling start, in a stock Wahoo they lend. Or watch from the stand. If races are not built, the eight cars lap as a show. Time trials are shut tonight.  
**Win:** $2,000, $800 or $300, and a number plate for the trailer wall.  
**Radio:** "Race night at the Speedbowl. Eight cars, one oval, no need for the right indicator."  
**Squawk:** "speedbowl friday. bring earplugs and a loud opinion"

**Humidity is full** (`cal-humidity-full`, C). Humidity `(1450, -950)`. Friday, 22:00–04:00.  
**Spawns:** a queue of 40 round the block, two door staff, Sturgeons dropping guests, sports cars cruising Tower Way at 20 km/h, the roof lights at full.  
**Do:** anything done within 80 m is filmed by the queue, for double followers. Bay Cab fares from the queue come twice as often. The door lets you in with 10,000 followers or an outfit worth $500; otherwise, "Not tonight." Inside is a menu, like a shop: dancing is the open-mic lanes to a club track. Race SR7 passes the door.  
**Radio:** "Humidity is at capacity. So is the humidity."  
**Squawk:** "queue for humidity is round the block. someone just did a burnout for us"

### Saturday

**Farmers' market** (`cal-farmers-market`, B). Domino Park `(-1400, -880)`. Saturday, 08:00–13:00.  
**Spawns:** 14 stalls under striped awnings: mangoes, honey, plants, pies from Key Lime Crimes, Lava Abuela, and the rival sauce of Okafor & Daughters. 40 shoppers and a busker.  
**Do:** food here costs half. Taste both sauces and vote; the radio reports the count. One stallholder wants three crates fetched from the Mercado `(-1500, -800)` before 09:00.  
**Win:** $90 for the crates, 200 followers for voting.  
**Radio:** "Market is open. Buy a mango. Buy two. The mango man has a boat to pay for."  
**Squawk:** "okafor sauce or lava abuela. families have split over less"

**Launch day** (`cal-launch-day`, D). Cape Calamity, seen from the whole map. Saturday, 13:30–14:10.  
**Spawns:** at 13:50 every station carries Upward's countdown. People on beaches and roofs face east with phones up. At the Cape, a crowd in the viewing car park.  
**What happens:** six Saturdays in seven it is scrubbed with ten seconds to go, decided by `dayCount`. On the seventh a bright trail climbs in the east for 40 s, and a double boom 20 s later sets off car alarms across the city.  
**Do:** photograph the trail. The best view in the city is the Jetty `(1550, 100)`. Local Man 60 follows a scrub.  
**Win:** 5,000 followers and the I Saw It Go shirt.  
**Radio:** "Upward regrets that today's launch is scrubbed, owing to a cloud, a boat and a feeling."  
**Squawk:** "scrubbed. again. that rocket is a statue"

**Yacht party** (`cal-yacht-party`, B). Yacht Club Bayhaven `(-1150, 90)`. Saturday, 21:00–02:00, once mission `yacht-rock` is done.  
**Spawns:** a Snowbird lit up at the long dock, 30 guests, three armed guards, a valet line of Sturgeons, six fireworks at 23:00. Tripp Vandermeer is on the top deck and does not know whose party it is.  
**Do:** the gangway lets you aboard with 10,000 followers or clothes from Maison Sable. Teo can also climb the stern from the fuel dock. Guests film anything on deck, for double followers. Tripp's dare: dive from the top deck, once a night. Mixtape 19 is on the party deck. Race BR2 starts here at 19:00.  
**Win:** 2,000 followers for the dive.  
**Radio:** "Yacht party at the club tonight. The host has asked us who is hosting."  
**Squawk:** "tripp's party again. he asked me if i was tripp"

### Sunday

**The Mallard Open** (`cal-golf-tournament`, C). The Fairways; first tee beside the clubhouse `(-2000, -2100)`. Sunday, 09:00–17:00.  
**Spawns:** galleries of 20 at four greens, leaderboards, 12 golfers in Birdies, marshals with "Quiet" paddles. Bellweather tees off at 14:00 and the leaderboard puts him first whatever he scores.  
**Do:** a horn, or an engine over 30 km/h, within 60 m of a putt sends a marshal after you on foot and a $25 fine by text. Closest to the pin at the 9th: one swing with the driving range controls. The range itself is shut. The derby, SP1, follows at 18:00.  
**Win:** the Closest to the Pin visor for the day's best swing. 1,000 followers for a horn timed to Bellweather's backswing.  
**Radio:** "Bellweather leads the Mallard Open. He has not started."  
**Squawk:** "quiet please signs at the golf. a bus just honked. iconic"

**Boat parade** (`cal-boat-parade`, B). Off Tideline, from the Jetty to the Yacht Club. Sunday, 16:00–17:00.  
**Spawns:** 14 decorated boats in line (Shrimpers, Snowbirds, Skipjacks and two Swans) moving west at 9 km/h along `z = 140` from `x = 1500` to `x = -1150`. A judges' stand on the beach at `(0, 70)`.  
**Do:** join the line in any boat. The stand scores you as you pass: 40 points for holding 20 m behind the boat ahead, 30 for a blast of the horn, 30 for anything pink aboard. A lawn flamingo in your hands counts.  
**Win:** 70 points: the Best in Parade ribbon, 3,000 followers and bunting for your boats.  
**Radio:** "Boat parade at four. Decorations are judged. Seamanship is not."  
**Squawk:** "someone joined the boat parade on a jet ski holding a flamingo and WON"

**Early closing** (`cal-early-closing`, C). Citywide. Sunday 18:00 to Monday 05:00.  
**Spawns:** every shop door but Storm Mart, the food stands and the car washes shows "Closed. It is Sunday." Traffic and people drop to half.  
**Do:** use the empty roads: race SP2 at 20:00, race SR5 at 22:00, and drift corners pay double followers.  
**Radio:** "It is six on Sunday. Bayhaven is shut. Go home, or go fast."  
**Squawk:** "everything shuts at 6 on sundays and every week i forget"

## Seasons

Tier C. A season runs on real dates, read from the device as UTC, so every player sees the same one. Hours below are in-game hours.

| Season | id | Real dates |
|---|---|---|
| Snowbird migration | `season-snowbirds` | 1 December to the end of February |
| Cold snap | `season-cold-snap` | The second Saturday and Sunday of January |
| Founders Day | `season-founders-day` | The first Saturday of March |
| Bayhaven Boat Show | `season-boat-show` | 10 to 16 April |
| Turtle weeks | `season-turtle-weeks` | 1 May to 30 June |
| Mango Fest | `season-mango-fest` | The third Friday of July and the two days after |
| Hurricane season | `season-hurricane` | 1 August to 31 October |
| Election week | `season-election` | 1 to 7 November |

**Snowbird migration.** Route 44, the expressway, Tideline and Mallard Greens.  
**Spawns:** one car in six is a Hermit or a Gallinule with a roof box, doing 20 km/h under the limit. Twice the retirees. Snowbirds fill the marinas. Three times the Coots on the promenade. A queue outside Hush Hour Diner at 16:00.  
**Do:** the convoy: five Hermits at the terminal `(1500, -2000)` follow you to Tideline Motel `(-520, -60)` at 60 km/h or less. Race SP3 runs every morning.  
**Win:** $300 for a convoy with none lost. Three convoys: the Snowbird shirt.  
**Radio:** "They are back. Leave early. Leave earlier than that."  
**Squawk:** "snowbird season. the fast lane is now a suggestion"

**Cold snap.** Citywide.  
**Spawns:** a pale clear sky and no 15:15 storm. People wear parkas over shorts and breathe out puffs. Pools steam. Iguanas drop from the palms from 06:00 to 09:00, so Local Man 15 can start every morning. Scoop Dreams vans sell soup.  
**Do:** the iguana round for Dr. Okoro: carry 20 stiff iguanas to marked sunny patches before 09:00.  
**Win:** $20 an iguana and a parka.  
**Radio:** "It is nine degrees. The beach is shut. Bayhaven was not built for this."  
**Squawk:** "nine degrees and my neighbour wore a duvet to the mailbox"

**Founders Day.** Coral Boulevard, from Spire Circle `(52, -837)` to Heron Walk Drive `(52, 37)`, 10:00–12:00.  
**Spawns:** the boulevard is closed from 09:30. Twelve floats at 8 km/h: a giant flamingo, a half-size Big Earl, Lawyer Larry on a bench, and a model tower from Bayhaven Tomorrow that is taller than what it passes. A marching band. Mayor Bunny Castellano waving from a Coquina. Crowds two deep.  
**Do:** drive float 7, a Tortoise towing a key lime pie the size of a pool: hold 8 km/h and a 15 m gap for 870 m. Or crash the parade for heat 2 at once and double viewers. Photograph three floats.  
**Win:** $600 and the Grand Marshal sash for a clean drive.  
**Radio:** "Founders Day. Nobody is sure who the founders were. There is a float."  
**Squawk:** "the bayhaven tomorrow float just clipped a traffic light. symbolism"

**Bayhaven Boat Show.** The west marina and Yacht Club `(-1150, 90)`.  
**Spawns:** 20 boats moored in rows under flags, one of every boat in the build for test drives, the King Tide at anchor off the dock, and Skip Lindqvist selling at 15% off.  
**Do:** demo laps: a three-buoy course in each of five boats, against the dealer's time.  
**Win:** the 15% off all week. Beat all five times: a Minnow, free.  
**Radio:** "The Boat Show is on. A boat is a hole in the water you pour weekends into."  
**Squawk:** "went to the boat show to look. i now own a jet ski"

**Turtle weeks.** Tideline's beach, 20:00–05:00.  
**Spawns:** promenade lamps dim to amber and neon on the sea side of Heron Walk goes dark. Roped nests every 200 m. Driving on the sand at night brings a $50 fine by text. On in-game Saturdays at 22:00 one seeded nest hatches: 30 hatchlings cross 25 m of sand in 90 s. Vehicles cannot enter the roped lane.  
**Do:** on hatch night, put out or block three lights so the hatchlings head for the sea: stand in front of a floodlight, park across a headlight, unplug a bar's sign. Dr. Okoro counts.  
**Win:** $300 and the turtle shirt for 30 out of 30.  
**Radio:** "Lights out on the beach, please. The turtles cannot read the signs."  
**Squawk:** "30 baby turtles crossed the beach and a whole bar turned its sign off for them"

**Mango Fest.** Domino Park and Avenida Mercado.  
**Spawns:** the avenue is closed. 20 stalls. Radio Palma plays from a stage. At 12:00, 500 foam mangoes are tipped from the bell tower and roll down the avenue.  
**Do:** park a Mullet under the tower before noon; every mango that lands in the bed counts. Lava Abuela's mango batch refills health and doubles sprint stamina for 2 minutes.  
**Win:** 40 mangoes in the bed: a crate of three bottles and the Mango shirt.  
**Radio:** "Mango Fest. If one hits you, it is yours. Those are the rules."  
**Squawk:** "the mango drop got me. worth it"

**Hurricane season.** Citywide.  
**Spawns:** on every third in-game day (`dayCount mod 3 = 0`) the 15:15 storm is a tropical storm and lasts until 18:00. On in-game Saturdays it becomes a hurricane from 21:00 to 02:00, exactly as in `04-systems.md`. The day before, shop fronts are boarded with plywood and Storm Mart's shelves are bare.  
**Do:** the Storm run job at level 5. Local Man 14 and 40. Surf at the Jetty. Stay outdoors from 21:00 to 02:00 without being knocked out.  
**Win:** the I Stayed shirt.  
**Radio:** "A hurricane is coming. Storm Mart has one pool noodle left."  
**Squawk:** "hurricane party at mine. bring ice. and a roof"

**Election week.** Every avenue, and City Hall `(-200, -560)`.  
**Spawns:** yard signs for Mayor Bunny Castellano on every verge, six to a block, some standing in the bay. Two Pompano sound trucks play her jingle. At City Hall at 19:00 there is a debate with two lecterns, and she stands at both. She is unopposed and behind in the polls.  
**Do:** a sound-truck shift: drive the jingle round a 3 km loop under 30 km/h so the tune stays in time. Knock down 50 signs; they grow back by morning. Ask one of three questions at the debate, and the headline quotes her answer.  
**Win:** $200 for the shift, 500 followers for the signs, the I Was Polled hat for the question.  
**Radio:** "The mayor leads the mayor by two points."  
**Squawk:** "bunny castellano is debating herself tonight and i think she might lose"

## The daily challenge

Tier B. Three challenges a day, the Daily Three, shown on the phone's Challenges page. One comes from each group below.

### How the three are picked

1. `date` is today in UTC, written `YYYY-MM-DD`. A new set starts at 00:00 UTC.
2. `seed` is a 32-bit hash of the text `daily:` followed by `date`, and `rng` is the seeded generator from `core/rng.js`. If `bible/tech/algorithms.md` names the hash, use that one.
3. For each group in the order Drive, Explore, Wild: list the group's templates that this build can run, in number order, and take index `floor(rng() × count)`.
4. For the chosen template, draw each parameter in the order written with one `rng()` each: `floor(rng() × number of values)`.
5. Nothing else goes in: not the save, the clock, the player's position or `Math.random`. So two page loads on one date, and any two players on one build, get the same three.
6. A template is skipped in step 3 when what it needs is not in the build: fishing, boats, Gerald, postcards, crime jobs.
7. Progress is kept under `stats.daily[date]`. Unfinished challenges are gone at 00:00 UTC.

Events: `challenge:set {date, ids}`, `challenge:progress {id, value}`, `challenge:done {id}`. Test API: `test.challenge.forDate('2026-11-20')` returns the three with their parameters; `test.challenge.complete(n)` finishes one and pays.

### Rewards

Where a parameter lists three values, they are easy, medium and hard, in that order.

| Result | Cash | Followers |
|---|---|---|
| An easy challenge | $150 | 100 |
| A medium challenge | $300 | 250 |
| A hard challenge | $600 | 500 |
| All three in one day | $500 more | 1,000 more, and a stamp on the page |
| Seven stamps in a row | | The Daily Three shirt |

### Drive

| # | Template | Parameters | Counted from |
|---|---|---|---|
| 1 | Drift {n} metres in {district} | n: 400, 800, 1,500. district: a grid district | metres moved in a live drift |
| 2 | Fly {n} metres in total off Big Air ramps | n: 100, 200, 400 | `jump:landed` |
| 3 | Finish {n} Bay Cab fares with the tip meter over 90 | n: 2, 3, 5 | `job:completed` |
| 4 | Win {race} | race: any route in the build. Always medium. | `race:finished` |
| 5 | Drive from {a} to {b} without a crash in {t} seconds | a, b: two of the eight places below. t: road distance divided by 14, 16 or 18 m/s | `vehicle:crash` |
| 6 | Hold 80 km/h in a Manatee for {n} seconds | n: 10, 20, 30 | speed |
| 7 | Pass {n} moving cars within 1 m at over 100 km/h | n: 10, 20, 30 | a distance test each frame |
| 8 | Slide into the chalk bay at {place} and stop inside it | place: one of the eight. Entry speed at least 40, 50 or 60 km/h | `drift:end` inside a 6 × 3 m bay |
| 9 | Lap Sandpiper Isle by boat in under {n} seconds | n: 150, 130, 115 | the checkpoints of race BR4 |
| 10 | Deliver {n} Pelican Eats orders with heat over 70 | n: 2, 3, 4 | `job:completed` |

The eight places: the plaza, the Spire, Domino Park, the paint factory, the cruise terminal, Galleria Flamingo, the Gatehouse, the terminal.

### Explore

| # | Template | Parameters | Counted from |
|---|---|---|---|
| 11 | Photograph Gerald before {hour} | hour: 18:00, 12:00, 09:00 | `collect:found` or `photo:taken` |
| 12 | Photograph {place} {when} | place: one of the eight. when: at sunset, in the 15:15 storm, between 00:00 and 04:00 | `photo:taken` |
| 13 | Find {n} lawn flamingos | n: 1, 2, 3. If fewer are left unfound, any flamingo touched counts | `collect:found` |
| 14 | Stand in {n} districts before 15:15 | n: 4, 6, 8 | `district:entered` |
| 15 | As Teo, stand on a roof over {n} metres up | n: 20, 40, 80 | height |
| 16 | Swim {n} metres without touching land | n: 100, 200, 300 | distance |
| 17 | Eat at {n} different food shops | n: 3, 4, 5 | `shop:opened` |
| 18 | Catch a {fish} | fish: grunt, sheepshead, mackerel | `fish:caught` |
| 19 | Retake postcard {n} within an hour of its best hour | n: any postcard in the build. Always medium. | `photo:taken` |
| 20 | Drive {n} km without changing from {station} | n: 2, 4, 6. station: any in the build | `radio:station` |

### Wild

| # | Template | Parameters | Counted from |
|---|---|---|---|
| 21 | Reach {n} viewers on Bayhaven Blue: Live | n: 5,000, 25,000, 100,000 | `heat:live` |
| 22 | Clear heat {n} without changing car or clothes | n: 2, 3, 4 | `heat:cleared` |
| 23 | Be filmed by {n} people at once | n: 5, 10, 15 | `ped:filming` |
| 24 | Lift a car on {n} hydrant geysers | n: 1, 2, 3 | `prop:broken` |
| 25 | As Mags, freeze {n} people with one Bus Driver Voice | n: 8, 12, 16 | the ability's own count |
| 26 | As Teo, earn {n} followers in one Go Live | n: 200, 500, 1,000 | `followers:changed` |
| 27 | Finish a criminal side job at level {n} | n: 1, 2, 3 | `job:completed` |
| 28 | See {n} different switch vignettes | n: 3, 5, 8 | `player:switched` |
| 29 | Finish {n} Local Man events | n: 1, 2, 3 | `localman:ended` |
| 30 | Walk into {shop} wearing {a} and {b} | shop: Maison Sable, Storm Mart, Second Wind Thrift. a, b: two of a visor, slides, a floral shirt, a life vest, cargo shorts. Always medium. | `shop:opened` |

## New names

| Name | What it is |
|---|---|
| The Mallard Open | Sunday's golf tournament in Mallard Greens |
| The Daily Three | The daily challenge |
| Snowbird migration, Cold snap, Founders Day, Bayhaven Boat Show, Turtle weeks, Mango Fest, Hurricane season, Election week | The eight seasons |
| The shirts, hats, sash, visor and ribbon named in the entries | Things won from the calendar |
