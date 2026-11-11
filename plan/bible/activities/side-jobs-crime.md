# Bible · activities · Side jobs, criminal

Jobs 21 to 28, the last eight of the 28 repeatable side jobs, on the wrong side of the law. They follow jobs 1 to 20 in `side-jobs.md`: a getaway driver, an armed escort, smuggling by boat and airboat, hold-ups of Clam Secure cash trucks, cars stolen to order, collections, bail skips and a fight with Bellweather's eviction crews. Guns are real here. People die, crews and deputies shoot back, and a job can go wrong for good.

Tier: B for jobs 21, 22, 23, 25, 27 and 28. C for jobs 24 and 26.

## Rules these jobs share

| Rule | Value |
|---|---|
| File | `src/systems/activities/<id>.js`, one per job, found by the registry |
| Start ring | 3 m radius, a briefcase blip in red. Interact starts it (F, Y, the context button). The Jobs app sets a waypoint to it. |
| Blocked when | A mission or another job is running, or heat is 1 or more at the start |
| Heat | These jobs do not end at heat. Most cause it. Heat rises as `04-systems.md` sets out: firing a weapon, killing in view, killing a deputy. At heat 3 the job is live on *Bayhaven Blue: Live* and earns viewers like any chase. |
| Death | Anyone at zero health stays down. A vehicle at 0 health explodes and hurts everything within 6 m. Bystanders can be hit; that is a crime and raises heat fast. |
| You | Knocked out: you wake at Bayhaven General, the job has failed, and anything you were carrying is gone. Booked: the same, and your weapons with it. |
| Levels | 1 to 5, picked at the start. Level `n + 1` opens after 3 completions of level `n`. |
| Cooling off | After a job, the same giver has nothing for one in-game hour |
| Weapons | Bring your own. Givers lend nothing but the job. |
| Events | `job:started {id, level}`, `job:step {id, step}`, `job:completed {id, level, cash, followers}`, `job:failed {id, reason}`, with `crime`, `weapon:fired` and `heat:changed` as they happen |
| Test API | `test.job.start(id, level)`, `test.job.state()`, `test.job.skip()` |
| Default check | `test.job.start(id, 1)`, then `test.job.skip()` until `job:completed`. The cash gained is inside the job's pay range, and `test.errors()` is empty. |

## 21 · Getaway driver
`getaway`, tier B, endless, pays $600–$2,400

- **Giver and start:** Rafa Montalvo, at his table in Domino Park `(-1400, -880)`. He names a front and a time. Bring a four-door car.
- **Fronts:** a jeweller on Commerce Way `(212, -690)`; the cash office at Galleria Flamingo `(-200, -2000)`; the bank on Exchange Avenue `(680, -730)`; the count room at Humidity `(1450, -950)`.
- **Loop:**
  1. Be in the chalk bay outside the front, engine running, when the clock hits zero. More than 30 s early and a cruiser takes an interest.
  2. The alarm goes. A crew of three runs out with bags, shooting at the guards.
  3. Heat starts at 3. Drive. The crew fire from the windows at anything with a siren.
  4. Clear the heat.
  5. Drop them at the back door of the Lava Abuela kitchen `(-1700, -480)`.
- **Crew:** 100 health each. Pistols at levels 1 and 2, SMGs after. A crew member shot in the car slumps and stays there.
- **Fails:** knocked out; the car explodes; the whole crew is dead; you are late to the bay, and they are shot on the pavement.
- **Pays:** your cut of the take by level: $600, $1,000, $1,400, $1,900, $2,400. Each crew member who does not reach the door costs a third of it.
- **Levels:** 1 the jeweller; 2 the Galleria, with a roadblock on Gateway Boulevard; 3 the bank, heat 4 from the start; 4 Humidity on a Friday night: the owners' own men chase in two Groupers with SMGs; 5 the bank in the 15:15 storm, and heat 5 if you are still live after 3 minutes.
- **Check:** `test.job.start('getaway', 1)`, teleport to `targets[0]`, `test.job.skip()`. `test.heat()` is 3. Skip to the end: cash gained is 600.

## 22 · Riding shotgun
`sauce-escort`, tier B, endless, pays $300–$900

- **Giver and start:** Rafa, at the loading door of the Lava Abuela kitchen `(-1700, -480)`.
- **Loop:**
  1. A Pompano with 120 bottles of sauce leaves for three drops: the Mercado `(-1500, -800)`, Ventanita Rosa `(-1020, -640)` and one shop 800–2,400 m away.
  2. Escort it in your own car, or ride in its passenger seat and shoot.
  3. Okafor & Daughters' crew hits it between drops, once on level 1 and up to three times on level 5: first cars that ram, then gunmen across a street.
  4. Kill them or break them. One left alone runs.
  5. The van reaches the last drop.
- **Meters:** the van has 100 health and cruises at 60 km/h. Its driver takes any gap you open. Each ram breaks 4 bottles and each burst of gunfire 6.
- **Fails:** the van is destroyed; its driver is killed.
- **Pays:** `$300 + $150 × (level − 1) − $2 for each broken bottle`.
- **Levels:** 1 one Snook that rams; 2 two cars; 3 a roadblock and four gunmen with pistols; 4 SMGs, and a Needlefish whose rider shoots at the tyres; 5 a night run down the Longspan to Hammock Key: two cars and a Skipjack firing from the water.

## 23 · Night freight
`smuggle-run`, tier B, nightly 22:00–04:00, pays $160 a crate

- **Giver and start:** Captain Nilda Ferro. Airboat runs start on her dock `(1200, -3250)`. Boat runs start at the Stilt House `(-2400, 640)`. The cargo is untaxed rum and cigars and, from level 4, guns with no numbers.
- **Loop:**
  1. Collect the crates. Airboat: a seaplane's drop in the sawgrass at `(2600, -3400)`. Boat: a trawler with no lights at `(-1500, 1100)`.
  2. Run them to two or three drops: the boardwalk behind Bait & Ballistics `(-1000, -3060)`, the fish camp `(2300, -3350)`, a private dock on Sandpiper Isle `(-1200, 900)`, the west marina `(-1150, 110)`.
  3. At a drop, stop within 5 m. Crates come off one a second.
- **Patrols:** the wildlife patrol's airboats in the Glades and the Sheriff's Hammerhead in the bay. Each sweeps a searchlight 60 m long and 20° wide, side to side every 8 s. Three seconds in a beam is heat 2. At heat 3 they shoot. Horn switches your running lights off, which halves the distance at which a patrol hears you and makes the channel posts hard to see.
- **Crates:** a hit over 40 km/h, or a burst of gunfire, puts one over the side.
- **Fails:** every crate lost; the boat destroyed; knocked out.
- **Pays:** $160 for each crate delivered: $640 for a clean level 1, $1,600 for a clean level 5.
- **Levels:** 1 four crates by airboat, one patrol; 2 six crates, two patrols; 3 six crates by Skipjack, the Hammerhead on station off the Isle; 4 eight crates with guns among them, and a searchlight on Sandpiper Bridge; 5 ten crates in swamp fog or a tropical storm, two Hammerheads.

## 24 · Clam digging
`clam-job`, tier C, endless, pays $600 a bag

- **Giver and start:** Odessa "Dess" Whitlock, at the union hall `(2650, -500)`. She knows which Clam Secure truck carries what, and marks one on your map.
- **Routes:** the truck runs between the bank on Exchange Avenue `(680, -730)`, Galleria Flamingo `(-200, -2000)` and the cruise terminal `(2500, 100)`.
- **The truck:** a Clam. Bullets do a quarter of their damage to it. Its side glass stops a pistol, not a shotgun.
- **Loop:**
  1. Stop the truck: ram it under 40 health, box it in at a light, or shoot the driver through the side glass.
  2. Two guards get out and fire. Kill them or drive them off.
  3. Hold Interact at the back door for 12 s.
  4. Carry the bags to your car, 2 s each.
  5. Heat is 3 from the first shot and 4 if a guard dies. Lose it.
  6. Deliver to Dess's container on the quay `(2900, -330)`.
- **Dye packs:** a crash over 50 km/h bursts one bag in four. A dyed bag pays half, and your car is marked: viewers drain at half speed until you use a car wash.
- **Fails:** knocked out; no bag delivered.
- **Pays:** $600 a clean bag, $300 a dyed one.
- **Levels:** 1 three bags, two guards with pistols; 2 four bags, one shotgun, a cruiser 20 s away; 3 five bags, and an escort Grouper with two more guards; 4 six bags, on the expressway, and the truck will not stop for a block; 5 seven bags in two trucks, a tactical van behind them, and heat 4 at the first shot.

## 25 · The shopping list
`shopping-list`, tier B, five cars a day, pays 15% of each car's value

- **Giver and start:** the yard boss in the back office of the scrapyard `(2200, -1200)`. He answers to "Boss" and to nothing else.
- **The list:** five cars, each a model and a colour, with the neighbourhood where one was last seen. It changes at 06:00, seeded by the day count, so it is the same on a reload.
- **Loop:**
  1. Find a car that matches. One is parked in the named neighbourhood; others may be in traffic.
  2. Take it. A parked car's alarm goes off one time in three. An occupied car is a carjacking, and a crime if seen.
  3. Deliver it to the blue container at the yard.
- **Trackers:** from level 3 each car carries one. Heat 2 follows you until 60 s out of sight or a car wash.
- **Fails:** the car is destroyed. Any other car from the list still counts.
- **Pays:** `15% of the car's catalogue value × health ÷ 100`, three times what the crusher gives for a stolen car. All five in one day: $1,000 more.
- **Levels:** 1 Snooks, Tarpons and Mullets, parked; 2 Herons, Groupers and Terns, half of them occupied; 3 Wahoos and Sailfins, tracked; 4 Gallinules, Coquinas and a Sturgeon from the valet line at the Yacht Club, each with a driver who carries a pistol; 5 one-offs: a Sheriff Tarpon, the Bonito outside Humidity, Lawyer Larry's own Sturgeon.
- **Check:** `test.job.start('shopping-list', 1)`, `test.spawnVehicle('snook')`, `test.enter()`, teleport to `(2200, -1200)`. Cash gained is over 0.

## 26 · Collections
`collections`, tier C, endless, pays $400–$1,200

- **Giver and start:** Abuela Carmen Montalvo, at the top table in Domino Park `(-1400, -880)`. She slides over a list of four doors. "We do not collect from the bakery. We collect from the people who collect from the bakery."
- **The doors:** four seeded shopfronts in Palma Vieja and The Paintworks, each run by somebody who squeezes the street: a payday lender, a tow yard that takes cars it should not, a letting office for the Bellweather Group, a pawnbroker with a thumb on the scale. Each owes $500 to $1,500.
- **Loop:** at each door, one of three things happens.
  1. They pay.
  2. They stall. Break three things in the shopfront within 20 s and they pay.
  3. They have hired muscle. Two to four men come out, with bats on level 1 and guns from level 3.
- **Rule:** an owner you hurt pays nothing. "They cannot pay if they cannot stand." An owner you kill fails the job, and Carmen has no work for a day.
- **Rivals:** from level 3 a collector for Okafor & Daughters works the same list from the other end. A door they reach first is theirs, unless you take the envelope off him.
- **Fails:** knocked out; an owner dead; no door collected.
- **Pays:** a fifth of what you bring back to her table.
- **Levels:** 1 all four pay or stall; 2 one door has muscle; 3 two do, and the rival collector is out; 4 muscle has SMGs, and one owner runs for his car; 5 one door is a set built by *Bayhaven Blue: Live*, with deputies inside. The camera van parked outside gives it away. Walk on and Carmen lets that door go. Walk in and it is heat 3.

## 27 · Skip tracing
`skip-trace`, tier B, endless, pays $250–$1,250

- **Giver and start:** Lawyer Larry, at the desk in his office `(420, -1830)`. A client has missed court and Larry stood the bail.
- **Loop:**
  1. Go to the 150 m circle where the client was last seen.
  2. They run when they see you: on foot, then in whatever the level gives them.
  3. Stop them alive. Wreck their car to under 30 health and they get out. Knock them down with fists, a pool noodle or a lawn flamingo. A client you shoot is a client you have killed.
  4. A downed client is cuffed in 3 s and rides in your back seat.
  5. Deliver them to the side door of the Sheriff's HQ `(200, -2150)`.
- **Fails:** knocked out; the client gets 400 m away.
- **Pays:** `$250 × level` for a client delivered breathing. A dead one pays a quarter: Larry bills the estate.
- **Levels:** 1 a man who skipped traffic court, on a Pinfish; 2 a Snook; 3 a Wahoo, and he has a pistol; 4 a client who leaves the west marina on a Skimmer, so bring a boat; 5 an accountant for the Bellweather Group in a Gallinule with two bodyguards. He is worth more alive: Larry adds $1,000 and a headline.

## 28 · Neighbourhood watch
`eviction-crew`, tier B, endless, pays $250–$1,300

- **Giver and start:** the noticeboard at Pelican Rest `(-1250, -220)`. Neighbours pin up the address where Bellweather's eviction crew is working today.
- **Loop:**
  1. Go to the address. Men in Bayhaven Tomorrow polo shirts are carrying somebody's furniture out to a Hogfish, with a Grouper parked across the street.
  2. Stop the eviction, any way you like: wreck both vehicles, put the crew down, or drive the Hogfish away with the furniture in it.
  3. After 45 s they call for a second Grouper.
  4. Hold the street until every man is down or gone.
- **Deputies** take the crew's side. Heat rises as usual.
- **Fails:** knocked out; the Hogfish leaves with the furniture.
- **Pays:** from the neighbours' jar, by level: $250, $450, $700, $900, $1,150. Add $150 if the furniture comes back in one piece.
- **Levels:** 1 a trailer in West End, three men with batons; 2 a courtyard in Los Patios, four men and one pistol; 3 a workshop in El Bajo, five men with pistols; 4 a houseboat on Hammock Key, reached by boat, SMGs; 5 Pelican Rest itself: two crews, a Whelk backing up to fill the pool with cement, and Chad or Brad in person with a shotgun. He leaves at 30 health.

## Checks

| Check | Pass |
|---|---|
| Start and finish | The default check passes for all eight |
| Heat | `getaway` and `clam-job` raise `test.heat()` to 3 at the step that says so |
| Lethal | In `sauce-escort` an attacker brought to zero health stays down for the rest of the job |
| Alive or dead | `skip-trace` pays in full for a client knocked down and a quarter for one shot |
| Seeds | Every seed here snaps within 25 m to land, or to water for the two pick-ups in job 23 |

## New names

| Name | What it is |
|---|---|
| Getaway driver, Riding shotgun, Night freight, Clam digging, The shopping list, Collections, Skip tracing, Neighbourhood watch | The eight criminal jobs |
| Boss | The yard boss at the scrapyard. It is the only name he gives. |
