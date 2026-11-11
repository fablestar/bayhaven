# Bible · catalog · Achievements and stats

Sixty achievements with our own names and exact conditions, then the 82 stats the game keeps, each with the event that updates it. An achievement here is a fridge magnet: a souvenir that snaps onto the fridge at Pelican Rest. Every condition reads only events and stats, so nothing in this file needs code inside another lane.

Tier: the Stats app is A (day 7), and so is the "100% list" in it, which counts the 45 achievements that need only A content. The achievements system itself is bonus session B-31, so every achievement is B, C or D: the 45 that need only A content are B, and the other 15 are B, C or D by the content they need.

## How achievements work

| Rule | Value |
|---|---|
| Look | A fridge magnet, 96 × 96 px, drawn on a canvas: a rounded shape in one pastel, a two-colour picture made of boxes, the name in heavy italic. Never a medal, a cup or a points score. |
| Earning one | A magnet slides in under the cash pill, snaps on with a click (the UI pluck, pitched down a fifth) and shows its name for 3 s. Emits `ui:toast` with `{kind: "magnet", id}`. Never during a cutscene; it waits. |
| The fridge | A tab in the Stats app: a fridge door with a 10 × 6 grid. Earned magnets are in colour, the rest are grey outlines with the name hidden until one condition in the same group is met. |
| Reward | 250 followers each. Teo posts the fridge. |
| Saved | `found.magnets` in the save: a list of ids. Checked again on `save:loaded`, so a magnet whose condition an older build already met is given at once. |
| Checking | `src/systems/magnets.mod.js` listens to the events named below and reads `state.stats`. It writes nothing but its own list. |
| Leads | Stats and magnets are shared by Mags and Teo unless a row names one of them. |

## The sixty

### Story

| id | Name | Earned when | Tier |
|---|---|---|---|
| `seatbelt` | Seatbelt. | `mission:completed` with id `final-notice` | B |
| `plastic-lawn` | It's Plastic | `mission:completed` `open-house` with the spotted count at 0 | B |
| `better-than-news` | Better Than the News | `mission:completed` `as-seen-on-tv` with 50,000 or more viewers reached during it | B |
| `talent` | Talent | `mission:completed` `yacht-rock` with the "who is this guy" bar never past half | B |
| `every-deed` | Every Deed He Forged | `mission:completed` `the-spire-job` | B |
| `fourteen-seconds` | Fourteen Seconds | `mission:completed` `going-viral` | B |
| `between-cones` | Between the Cones | in `going-viral`, the bus stops inside the bay with no `prop:broken` for either cone | B |
| `notice-served` | Notice Served | `missionsDone` reaches 20 | C |

### Driving

| id | Name | Earned when | Tier |
|---|---|---|---|
| `slides` | Slides If You Look at It | one `drift:end` with a score of 10,000 or more | B |
| `hang-time` | Hang Time | one `jump:landed` with `metres` of 60 or more | B |
| `frequent-flyer` | Frequent Flyer | `bigAirDone` reaches 15 | B |
| `low-altitude` | Low Altitude Airlines | `bigAirDone` reaches 50 | C |
| `exit-44` | Exit 44 | a vehicle passes through Big Earl `(-400, -2960)` at 100 km/h or more | B |
| `best-drive` | The Best Drive in the Game | the Longspan from `(-1900, 180)` to `(-3100, 1200)`, between 17:30 and 20:00, with no `vehicle:crash` | B |
| `for-the-pier` | He's Going for the Pier | a vehicle leaves the end of Gullwing Pier `(600, 430)` above 80 km/h at heat 3 or more | B |
| `favourite` | Mags's Favourite | `manateeKm` reaches 50 | B |
| `write-off` | Write-Off | `vehiclesDestroyed` reaches 100 | B |
| `water-park` | Free Water Park | `hydrantsHit` reaches 25 | B |

### Heat

| id | Name | Earned when | Tier |
|---|---|---|---|
| `trending` | Trending | the first `heat:live` | B |
| `hurricane-dale` | Hurricane Dale | `heat:changed` to level 5 | B |
| `they-lost-him` | They Lost Him | `heat:cleared` from level 5 | B |
| `remain-boring` | Please Remain Boring | `heat:cleared` from level 3 or more while inside a Birdbath | B |
| `costume-change` | Costume Change | `outfitDrops` reaches 10 | B |
| `prime-time` | Prime Time | `peakViewers` reaches 200,000 | B |
| `off-the-air` | Off the Air | `vehicle:destroyed` with id `mayfly` | B |
| `cut-to-ads` | Cut to Commercial | `vehicle:destroyed` with id `showtruck` | B |
| `booked-solid` | Booked Solid | `timesBooked` reaches 10 | B |
| `wristband` | Frequent Patient | `timesKnockedOut` reaches 10 | B |

### Combat

| id | Name | Earned when | Tier |
|---|---|---|---|
| `thirteen-hits` | Thirteen Hits | a `ped:hit` with id `noodle` and `down` true | B |
| `lawn-ornament` | Lawn Ornament | a `ped:hit` with id `flamingo` and `down` true | B |
| `busy-month` | A Busy Month | `peopleDowned` reaches 100 | B |
| `clean-hands` | Clean Hands | `followers:milestone` 10,000 arrives while `bystandersHurt` is 0 | B |
| `across-the-bay` | From Across the Bay | a `ped:hit` with id `sniper` from 200 m or more | C |
| `live-bait` | Live Bait | three `ped:hit` events with `down` true from one grenade | C |
| `yard-work` | Yard Work | someone pushed by the leaf blower falls into the Sinkhole `(-600, -2450)` | C |

### Followers and filming

| id | Name | Earned when | Tier |
|---|---|---|---|
| `grandma` | Is That a Grandma | `followers:milestone` 10,000 | B |
| `ten-percent` | Ten Percent Off | `followers:milestone` 100,000 | B |
| `statue` | A Statue of a Phone | `followers:milestone` 1,000,000 | B |
| `everyone-filming` | Everyone Is Filming | one `ped:filming` with a count of 20 or more | B |
| `greetings` | Greetings from Bayhaven | `postcardsFound` reaches 10 | B |
| `wish-you-were` | Wish You Were Here | `postcardsFound` reaches 40 | C |

### Things to find

| id | Name | Earned when | Tier |
|---|---|---|---|
| `flock` | Flock | `flamingosFound` reaches 40 | B |
| `whole-flock` | The Whole Flock | `flamingosFound` reaches 100 | B |
| `persons-unknown` | Persons Unknown | `gnomesFound` reaches 10 | B |
| `gerald-approves` | Gerald Approves | `geraldSightings` reaches 20 | B |
| `hurt-bored` | Hurt? Bored? | `billboardsDefaced` reaches 40 | B |
| `b-sides` | B-Sides | `mixtapesFound` reaches 24 | B |

### Money and property

| id | Name | Earned when | Tier |
|---|---|---|---|
| `room-12` | Room 12 | `property:bought` with id `motel-12` | B |
| `small-business` | Small Business Owner | the first `cash:changed` whose reason is a business id | B |
| `nine-hundreds` | From the Low Nine Hundreds | `cashPeak` reaches 900,000 | B |
| `buyers-market` | Buyer's Market | `propertiesOwned` reaches 26, which costs $7,818,000 | D |

### Jobs

| id | Name | Earned when | Tier |
|---|---|---|---|
| `meter-running` | Keep the Meter Running | `faresDone` reaches 25 | B |
| `podium` | Podium | a `race:finished` in first place for each of the 4 street races in the day 9 build | B |
| `one-boot` | One Boot | `fishKinds` reaches 13: the twelve fish and the boot | B |

### The city

| id | Name | Earned when | Tier |
|---|---|---|---|
| `right-on-time` | Right on Time | `stormsSeen` reaches 10 | B |
| `ten-postmarks` | Ten Postmarks | `districtsVisited` reaches 10 | B |
| `meanwhile` | Meanwhile | `vignettesSeen` reaches 16 | B |
| `inside-voice` | Inside Voice | `pulledOver` reaches 100 | B |
| `time-machine` | Time Machine | `save:loaded` with a save made by an earlier day's build | B |
| `not-scrubbed` | Not Scrubbed | within 800 m of the pad at Cape Calamity when a launch goes | D |

## Stats

The Stats app shows these in six groups. Each is one key in `state.stats`, saved under `stats`. The three keys in the sample save (`distanceKm`, `bestDrift`, `peakViewers`) keep their names. "Sum" adds, "max" keeps the largest, "count" adds one, "set" counts distinct values. Distances build up per trip in memory and are written when the event fires.

### Driving

| Key | Counts | Updated by |
|---|---|---|
| `distanceKm` | km in road vehicles, sum | `vehicle:exited` |
| `distanceBoatKm` | km in boats, sum | `vehicle:exited` |
| `distanceAirKm` | km in aircraft, sum | `vehicle:exited` |
| `distanceFootKm` | km on foot and swimming, sum | `vehicle:entered`, `player:switched` |
| `manateeKm` | km in a Manatee as Mags, sum | `vehicle:exited` |
| `topSpeedKmh` | fastest speed reached, max | `vehicle:exited` |
| `bestDrift` | best single drift score, max | `drift:end` |
| `driftTotal` | all drift scores, sum | `drift:end` |
| `driftCount` | drifts, count | `drift:end` |
| `longestJumpM` | longest jump, max | `jump:landed` |
| `jumpCount` | jumps landed, count | `jump:landed` |
| `crashes` | crashes above 30 km/h, count | `vehicle:crash` |
| `hardestCrashKmh` | fastest crash, max | `vehicle:crash` |
| `vehiclesDestroyed` | vehicles blown up by you, count | `vehicle:destroyed` |
| `vehiclesDriven` | models entered, set | `vehicle:entered` |
| `vehiclesStolen` | occupied or parked vehicles taken, count | `crime` kinds `carjack` and `theft` |
| `vehiclesScrapped` | sold at the scrapyard, count | `cash:changed` reason `scrap` |
| `propsBroken` | props broken, count | `prop:broken` |
| `hydrantsHit` | hydrants broken, count | `prop:broken` kind `hydrant` |

### Heat

| Key | Counts | Updated by |
|---|---|---|
| `peakViewers` | most viewers at once, max | `heat:live` |
| `heatPeak` | highest heat level, max | `heat:changed` |
| `heatCleared` | times heat was lost, count | `heat:cleared` |
| `heat5Cleared` | times heat 5 was lost, count | `heat:cleared` |
| `secondsLive` | seconds on the Sheriff's show, sum | `heat:live`, once a second |
| `longestChaseS` | longest time from heat 1 to clear, max | `heat:cleared` |
| `outfitDrops` | heat levels dropped by changing outfit unseen, count | `wardrobe:changed` |
| `carDrops` | heat levels dropped by changing car unseen, count | `vehicle:entered` |
| `washes` | passes through a Birdbath, count | `shop:bought` shop `birdbath` |
| `timesBooked` | times booked, count | `player:booked` |
| `timesKnockedOut` | times knocked out, count | `player:knockedout` |
| `crimesSeen` | crimes a deputy or camera saw, count | `crime` with `seen` true |
| `sheriffWrecked` | Sheriff vehicles destroyed, count | `vehicle:destroyed` |
| `helicoptersDowned` | helicopters brought down, count | `vehicle:destroyed` |

### Combat

| Key | Counts | Updated by |
|---|---|---|
| `roundsFired` | rounds from firearms, count | `weapon:fired` |
| `roundsHit` | rounds that hit a person, count | `ped:hit` |
| `headHits` | free-aimed hits on the head box, count | `ped:hit` |
| `meleeHits` | hits with slot 1 weapons, count | `ped:hit` |
| `peopleDowned` | people put down by you, count | `ped:hit` with `down` true |
| `deputiesDowned` | deputies put down, count | `crime` kind `deputy-down` |
| `bystandersHurt` | bystanders hit by your weapons or vehicle, count | `crime` kind `hit-and-run` |
| `grenadesThrown` | grenades thrown, count | `weapon:fired` |
| `shirtsFired` | shirts from the T-shirt cannon, count | `weapon:fired` |
| `longestShotM` | longest hit, max | `ped:hit` |

Accuracy on the Stats page is `roundsHit ÷ roundsFired`, worked out when shown.

### Followers and filming

| Key | Counts | Updated by |
|---|---|---|
| `followersPeak` | most followers held, max | `followers:changed` |
| `filmedByPeak` | most people filming you at once, max | `ped:filming` |
| `filmedSeconds` | person-seconds of being filmed, sum | `ped:filming` |
| `photoCount` | photos saved from photo mode, count | `photo:taken` |
| `goLiveUses` | times Teo went live, count | `player:ability` |
| `pulledOver` | vehicles stopped by Bus Driver Voice, sum | `player:ability` |

### Things to find and jobs

| Key | Counts | Updated by |
|---|---|---|
| `flamingosFound` | lawn flamingos, count | `collect:found` kind `flamingo` |
| `bigAirDone` | Big Air ramps landed, set | `collect:found` kind `bigair` |
| `postcardsFound` | postcard spots shot, set | `collect:found` kind `postcard` |
| `gnomesFound` | gnomes, count | `collect:found` kind `gnome` |
| `mixtapesFound` | mixtapes, count | `collect:found` kind `mixtape` |
| `geraldSightings` | Gerald photographed, set | `collect:found` kind `gerald` |
| `billboardsDefaced` | Lawyer Larry billboards, count | `collect:found` kind `billboard` |
| `missionsDone` | story missions completed, set | `mission:completed` |
| `missionsFailed` | mission failures, count | `mission:failed` |
| `faresDone` | Bay Cab fares, count | `job:completed` kind `cab` |
| `deliveriesDone` | Pelican Eats deliveries, count | `job:completed` kind `eats` |
| `reposDone` | repo runs, count | `job:completed` kind `repo` |
| `racesWon` | races won, count | `race:finished` |
| `fishKinds` | kinds of fish caught, set | `fish:caught` |
| `biggestFish` | most valuable catch in cash, max | `fish:caught` |
| `localManSeen` | Local Man events finished, set | `localman:ended` |

### Money and the city

| Key | Counts | Updated by |
|---|---|---|
| `cashEarned` | all cash in, sum | `cash:changed` |
| `cashSpent` | all cash out, sum | `cash:changed` |
| `cashPeak` | most cash held, max | `cash:changed` |
| `brandDealTotal` | brand deal pay, sum | `cash:changed` reason `brand-deal` |
| `businessIncome` | business payouts, sum | `cash:changed` reason a business id |
| `billsPaid` | hospital and booking costs, sum | `cash:changed` reasons `hospital`, `booking` |
| `propertiesOwned` | properties bought, count | `property:bought` |
| `upgradesBought` | property upgrades, count | `property:upgraded` |
| `shopsVisited` | shop brands entered, set | `shop:opened` |
| `coffees` | cups at Ventanita Rosa, count | `shop:bought` |
| `districtsVisited` | districts entered, set | `district:entered` |
| `switches` | switches between leads, count | `player:switched` |
| `vignettesSeen` | switch vignettes seen, set | `switch:vignette` |
| `stormsSeen` | 15:15 storms you were outdoors for, count | `weather:changed` |
| `sunsetsSeen` | sunsets, count | `clock:sunset` |
| `stationsHeard` | radio stations tuned, set | `radio:station` |
| `songsHeard` | songs started, count | `radio:song` |

`playSeconds` stays at the top of the save, as in `04-systems.md`, and is shown first on the Stats page.

## Events this file needs

These are not in the starting set in `06-tech-architecture.md`. They are now in the merged events table in `bible/tech/contracts.md`, which owns the names and payloads. Each is owned by the lane named.

| Event | Payload | Owner |
|---|---|---|
| `collect:found` | `{kind, id, district}` | Play, things to find |
| `job:completed` | `{kind, pay, tip}` | Play, activities |
| `race:finished` | `{id, place, time}` | Play, activities |
| `fish:caught` | `{kind, value}` | Play, activities |
| `localman:ended` | `{id, result}` | Play, events |
| `shop:bought` | `{shop, kind, item, price}` | Play, economy |
| `wardrobe:changed` | `{lead, slots, seen, dropped}` | Play, wardrobe |
| `property:upgraded` | `{id, step}` | Play, property |
| `player:ability` | `{lead, affected}` | Motion, actors |
| `switch:vignette` | `{lead, id}` | Play, switch |

Existing events need these fields: `ped:hit` `{id, target, down, head, dist, speed, weapon}` · `cash:changed` `{delta, reason}` · `heat:cleared` `{peak, seconds, from, where}` · `vehicle:destroyed` `{id, by, owner}` · `vehicle:entered` `{id, dropped}` · `crime` `{kind, case, seen, points, x, z, weapon}`, where `kind` is one of the thirteen in `bible/tech/contracts.md`. This file uses `carjack`, `theft`, `shots`, `hit-and-run`, `killing` and `deputy-down`.

## New names

The sixty achievement names above are new. All are lines from the game's own script, ads, chat and signs, or plain phrases. `magnets` is the name of the system and of the save key.
