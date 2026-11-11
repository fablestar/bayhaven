# Bible · systems · Progression

Progression is one table of gates. Missions open shops, stock, properties, abilities and the Regulars; followers open a few more; nothing ever locks again. This file gives the gate rule, what each mission opens, the follower milestones, the 100% list, three difficulty settings and the first hour of a new game minute by minute.

Tier: A (the mission chain, the four follower milestones, the 100% list in D9-S3, the first ten minutes in D9-S1). Rows marked B or C wait for that content. The difficulty settings are C.

## Purpose

Hand the player one new thing every few minutes for the first hour and every session after it.
Work in any build: with six missions or with twenty, no door is left without a key.

## Data

Owner: `src/systems/unlocks.mod.js` and `src/content/unlocks.js` (gates), `src/systems/missions.js` (offers), `src/systems/endgame.mod.js` (the 100% list).

### The gate rule

```js
// src/content/unlocks.js: one row for each thing that can open
{ id: 'weapon.pistol', needs: { mission: 'open-house' } }
{ id: 'property.loft', needs: { any: [{ mission: 'glow-up' }, { followers: 10000 }] } }

function met(n, s) {
  if (n.any)       return n.any.some(x => met(x, s));
  if (n.all)       return n.all.every(x => met(x, s));
  if (n.mission)   return s.done.has(fallback(n.mission));
  if (n.followers) return s.peakFollowers >= n.followers;
  if (n.stat)      return s.stats[n.stat] >= n.value;
  if (n.owns)      return s.property.has(n.owns);
  return true;
}
// fallback(id): if that mission is not in this build, the nearest earlier mission that is.
// If there is none, the gate is open from free roam.
```

### The mission chain

The next mission offered is the lowest-numbered one in the build that is not done. The offer is a message from its giver with a marker, 60 to 120 s after the last result card, or at once if the player is within 150 m of the giver. An offer waits while heat is above zero.

- Day 9 build: 1 → 3 → 5 → 7 → 11 → 18 → 20.
- Full story: 1 to 20 in order.
- Mission 18 also needs 11, for the key card. Mission 20 follows 18 with no gap.
- Mission 18 reads the route flag set in 15, and uses the default route without it.

### What each mission opens

| After | Opens |
|---|---|
| 1 Final Notice | free roam and switching leads; Park & Sons for repairs and paint; Second Wind Thrift, food, Storm Mart, car washes; Bay Cab fares and Pelican Eats; the motel room and the food truck go on sale |
| 2 Content Is King (B) | Go Live; Teo's camera drone (B); Coral Arcade goes on sale |
| 3 Repo Woman | Bus Driver Voice; repo runs; street races; engine level 1 and tyres |
| 4 Hot Sauce (B) | the flat over the bakery goes on sale; Abuela Carmen (C) |
| 5 Open House | the pistol; the Mallard Greens gate stays open to you; Lawyer Larry's chain (B); Dee Pfeffer and Coach Brenda (C) |
| 6 Glow Up (B) | the Sandpiper Isle gate; Maison Sable on the Isle; the Paintworks loft goes on sale |
| 7 As Seen on TV | the helicopter cam hint; nitro |
| 8 Swamp Thing (B) | a Gatorback for anyone at Nilda's dock; the fish camp goes on sale; Gus Thibodeaux (B) |
| 9 Crane Game (B) | the SMG; the Rustwater warehouse goes on sale |
| 11 Yacht Rock | engine level 2; the houseboat goes on sale |
| 13 The Binder (B) | the shotgun |
| 14 Speedbowl (B) | engine level 3; the Manatee S school bus; Speedbowl time trials (C) |
| 18 The Spire Job | the Bellweather mansion goes on sale; hurricanes in free roam; the Dragonfly at Hangar Row (C) |
| 20 Going Viral | credits, and the 100% list shows its total |

With the fallback, the day 9 build opens Go Live with free roam, the flat after 3, the loft after 5, the SMG, the fish camp and the warehouse after 7, and the shotgun and engine level 3 after 11.

### Leads and abilities

| Thing | Opens | Numbers |
|---|---|---|
| Switching | with free roam. Its hint arrives with Teo's first message, about minute 12. Mission 11's cutscene shows it off | 2.5 s swoop |
| Bus Driver Voice | after mission 3 | 5 s, 30 s cooldown |
| Go Live | after mission 2 | 20 s, 60 s cooldown |
| Helicopter cam | from the first heat 3; the hint after mission 7 | |
| Lawyer Larry's half-price bills | after mission 10, or his first job, or the first time you are Booked or knocked out, when his card turns up and he texts you | |

### Follower milestones

Gates read the highest count ever reached.

| Followers | What changes | Tier |
|---|---|---|
| 1,000 | Squawk begins mentioning you | A |
| 5,000 | Zoom Ziegler calls | B |
| 10,000 | people recognise you and wave or run; Maison Sable in Meridian lets you in | A |
| 25,000 | no queue for you at Humidity | C |
| 100,000 | shops give 10% off; Gator Putt is offered for sale | A |
| 250,000 | a billboard of Teo on Billboard Road | C |
| 1,000,000 | a statue of Teo's phone in the plaza | A |

### Regulars

Each next job in a chain opens one game day after the last.

| Regular and chain | Opens when | Tier |
|---|---|---|
| Lawyer Larry · Billable Hours | mission 5, or your first time Booked | B |
| Zoom Ziegler · Exclusive | 5,000 followers and one photo taken | B |
| Gus Thibodeaux · Wrangler | driving through Big Earl `(-400, -2980)` after mission 8 | B |
| Dee Pfeffer · Violations | mission 5, then entering Mallard Greens by day | C |
| Coach Brenda · Dawn Patrol | being in Mallard Greens between 05:00 and 07:00 after mission 5 | C |
| Priya Raman · Lunch Rush | eating at Pressed three times, or owning the food truck | C |
| Old Man Fitch · Buried | all ten Tideline flamingos found | C |
| Madame Calypso · Forecast | staying outdoors through a whole tropical storm | C |
| Deputy Wade Purdy · Off Camera | reaching heat 4 and losing it | C |
| Dr. Imani Okoro · Tide Pool | docking a boat at any Pelican Keys marina | C |
| Skip Lindqvist · Repo Depot | mission 3 and five repo runs | C |
| Abuela Carmen · House Rules | mission 4 | C |

### Property and vehicles

- For sale from free roam: the motel room, the food truck. By mission: the flat (4), the loft (6, or 10,000 followers), the fish camp (8), the warehouse (9), the houseboat (11), the mansion (18), Coral Arcade (2). By other means: Gator Putt at 100,000 followers, the car wash after ten paid washes.
- Any vehicle in traffic can be taken as soon as its model exists.
- Special vehicles: Mags's Heron and Teo's Pinfish from the first mission; the Gatorback after 8; the Manatee S after 14; a golden Birdie for all ten gnomes (B); a Bonito parked on Sandpiper Isle (B); the Dragonfly after 18 and the Cormorant after the Tide Pool chain (C). Sheriff vehicles can be driven but never stored.

## States

| State | Enters when | Does | Leaves when |
|---|---|---|---|
| Hidden | the thing is not in this build | nothing is shown | a later build |
| Teased | in the build, `needs` not met | shown greyed with one line on what it waits for, such as "Wendell does not know you yet." | `needs` are met |
| Open | `needs` are met | `unlock:opened { id }`, a toast, a marker | bought, finished or collected |
| Owned | bought, finished or collected | counts toward 100% | never |

A mission moves Locked, Offered, Active, then Completed, or Failed and back to Active from its last checkpoint.

## The 100% list

```js
live    = categories.filter(c => c.total > 0);
percent = 100 * sum(live, c => c.weight * c.done / c.total) / sum(live, c => c.weight);
```

| Category | Weight | Day 9 total | Full total |
|---|---|---|---|
| Story missions | 30 | 6 | 20 |
| Properties and businesses | 15 | 12 | 12 |
| Lawn flamingos | 10 | 40 | 100 |
| Street races won | 8 | 4 | 8 |
| Big Air ramps | 7 | 15 | 50 |
| Followers: 1,000,000 | 7 | 1 | 1 |
| Postcards | 5 | 10 | 40 |
| Side jobs: five runs of each kind | 5 | 4 kinds | 12 kinds |
| Peak viewers: 200,000 | 5 | 1 | 1 |
| Vehicles driven | 3 | 18 | every model |
| Best drift: 5,000 | 3 | 1 | 1 |
| Distance: 100 km | 2 | 1 | 1 |
| Regulars' jobs | 8 | 0 | 46 |
| Gnomes, mixtapes, Gerald sightings, billboards | 6 | 0 | 94 |

The first twelve weights sum to 100. A category with nothing in the build is left out and the rest are scaled, so 100% can be reached in every build. When a later build adds things, an old save drops below 100 and the Stats app says "New things to do arrived with Day N." The reward is a postcard, "Wish you were here · 100%", and Gerald in a small visor.

## Difficulty (C)

Every number in the plan is the middle setting. Checks always run on it.

| | Low tide | High tide (default) | King tide |
|---|---|---|---|
| Damage to the player | × 0.6 | × 1 | × 1.4 |
| Damage to your vehicle | × 0.75 | × 1 | × 1.25 |
| Police catch-up | 1.04 | 1.08 | 1.12 |
| Viewer drain out of sight | × 1.25 | 8% of peak per second ÷ heat level | × 0.85 |
| Mission timers | × 1.3 | × 1 | × 0.85 |
| Countersteer assist | 30% on touch, 15% on keys and pad | 30% on touch | 30% on touch |
| Lock-on cone | 50 degrees | 35 degrees, 50 on touch | the same |
| Pay, prices, followers | the same | the same | the same |
| Result card | | | a King tide stamp |

It can be changed in Settings at any time. Inside a mission the change applies from the next checkpoint. It is stored as `settings.difficulty`.

## The first hour

Real minutes from pressing Play, full story order, phone shut. A new game begins at 17:30 on a Tuesday.

| Minute | What happens | Teaches or opens |
|---|---|---|
| 0:00 | Title: the city at 18:40, the wordmark, Play | |
| 0:10 | The opening cutscene, 30 to 45 s, skippable | Mags, Teo, Gerald, the notice |
| 1:00 | Final Notice: get in the Heron | hint 1, steering |
| 1:30 | Chase the tow truck east on Heron Walk Drive | hint 2, the handbrake, at the first corner |
| 2:30 | Three rams and the scooter breaks loose | ramming |
| 3:30 | Drive to Park & Sons Auto | hint 3, the minimap |
| 4:40 | Result card, $500. Free roam. The game clock reads 19:50 | the postcard |
| 5:00 | A message from Wendell and a pulsing marker 300 m off. Lamps and neon come on | messages |
| 5:30 | A lawn flamingo on the way, $250 | things to find |
| 6:00 | A Big Air ramp on the way: $500, a replay, the first phones out, followers leave 212 | filming |
| 7:00 | The first time out of the car | the on-foot hint |
| 10:00 | Content Is King (B). In the day 9 build, Repo Woman | walking, the camera, Go Live |
| 12:00 | Teo's first message | the switch hint |
| 16:00 | A first shop and a first meal | spending |
| 17:00 | 09:00 on Wednesday: the first brand deal, about $18 | payday |
| 18:00 | The cruise crowd fills Tideline until minute 25 (C) | the week |
| 20:00 | A first job from the Jobs app, usually Pelican Eats | side jobs |
| 22:00 | A first siren light, usually by accident | heat. Hint: "Stay out of sight and the lights go out." |
| 23:15 | The 15:15 storm: 40 s of rain, then a rainbow | weather |
| 28:00 | Repo Woman. In the day 9 build, Open House | timers, damage limits |
| 34:00 | Result card, $1,200. Repo runs, races, Bus Driver Voice | |
| 40:00 | 1,000 followers | the first milestone |
| 42:30 | The second payday, about $25 | |
| 45:00 | A first street race, or the motel room's for-sale sign | something to save for |
| 50:00 | Hot Sauce (B) is offered. In the day 9 build, As Seen on TV | |
| 60:00 | About $4,500 in hand, 1,500 followers, three missions done | the motel room is one mission away |

## Events

Emits: `mission:offered`, and the new `unlock:opened { id }`, `unlock:teased { id }`, `progress:percent { percent }`, `difficulty:changed { level }`.
Listens: `mission:completed`, `followers:milestone`, `property:bought`, `player:booked`, `player:knockedout`, `photo:taken`, `save:loaded`, `clock:day`.
State: `state.progress = { open, percent, peakFollowers }`.

## Edge cases

- On loading an old save every row is tested again. Rows already met open quietly behind one toast: "7 new things opened."
- A later build may add a mission earlier than where a save has reached. It is offered as a catch-up, and nothing that was open closes.
- A mission whose district is not in the build is not offered and does not block the chain.
- A gate with `any` opens on the first branch met and ignores the rest.
- Cash, followers and every gate are shared by both leads.

## Low and high

Nothing here depends on quality. The one device difference: a hint names the control in use, whether key, pad button or touch button.

## Script checks

New test entries: `test.unlocks.rows()` returns `[{ id, state, needs }]`; `test.unlocks.percent()`.

1. From a fresh save, finishing `final-notice` by skipping steps fires `mission:offered` within 120 s. In the day 9 build its id is `repo-woman`.
2. A script walks every row from a fresh save using only what this build contains, and shows each one can reach `open`. No row ever moves back from `open`.
3. Setting followers to 1,000, 10,000, 100,000 and 1,000,000 fires `followers:milestone` once each. At 100,000 a $1,000 shop item costs $900.
4. `test.unlocks.percent()` is 0 on a fresh save and 100.0 on a save with everything in this build done.
5. Before `open-house` the row `weapon.pistol` is `teased` and the shop refuses the sale. After it, the row is `open`.
6. A scripted new game through Final Notice into free roam ends with $500, at least 212 followers, each of the three hints shown once, and a marker 250 to 350 m from the player.

## New names

Difficulty settings Low tide, High tide, King tide · events `unlock:opened`, `unlock:teased`, `progress:percent`, `difficulty:changed` · state key `state.progress` · `settings.difficulty` · module `src/systems/unlocks.mod.js`, data `src/content/unlocks.js` · test entries `test.unlocks.rows()`, `test.unlocks.percent()`.
