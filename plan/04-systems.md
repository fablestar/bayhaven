# 04 · Systems

Each system lists what it does, the numbers to start from, the file that owns it, and the day it ships. Numbers are starting values to tune by feel, not laws. Module paths are from `06-tech-architecture.md`.

## 1. On foot

`src/actors/player.js`, `src/actors/rig.js` · day 3

| | Value |
|---|---|
| Walk / jog / sprint | 1.6 / 3.4 / 6.2 m/s (Teo sprints 6.8, Mags 5.0) |
| Sprint stamina | 12 s, refills in 6 s |
| Jump | 1.1 m high, 2.8 m long at a sprint |
| Step up | 0.35 m without jumping (curbs, stairs) |
| Climb | ledges up to 2.2 m (Teo 3.0 m) |
| Wade / swim | 1.2 m/s to waist depth, 2.0 m/s swimming, from day 7 |
| Body | a circle of radius 0.35 m for collision, 1.8 m tall |

- Camera: third person, 4.5 m back, 1.7 m up, pulls in near walls (day 1's trick, reused). Mouse or right stick orbits. Recentres behind you after 2 s of running.
- Enter a vehicle: within 2.5 m of a door, one button. The character walks to the door and gets in (0.8 s). Exit the same way; bail out above 30 km/h and you roll.
- Animation is procedural: limbs swing on sine waves scaled by speed, the torso leans into turns, a jump tucks the legs. No keyframe files.

## 2. Driving

`src/vehicles/handling.js`, `src/vehicles/vehicle.js` · day 2

A vehicle is a 2D body: position, heading, forward speed, sideways speed, spin. Day 1's model is the base; day 2 adds weight, a handbrake and real slides.

| Rule | Value |
|---|---|
| Sideways grip | sideways speed decays at 6.5 /s (day 1). On handbrake, rear grip drops to 1.2 /s and the car pivots. |
| Drift | counts when the slip angle is over 0.35 rad above 40 km/h. Shows a drift score, lays skid marks, makes smoke. |
| Steering | tight at low speed, gentle at high speed (day 1's curve), plus countersteer assist of 30% on touch controls |
| Surfaces | road 1.0 grip · sand 0.6 · grass 0.75 · dirt 0.7 · wet road 0.8 · flood water 0.5 |
| Air | leaving a ramp or curb at speed makes you airborne: gravity 18 m/s², pitch follows the arc, landing squashes the body |
| Damage | each vehicle has its own hit points (the catalogue lists them); the HUD and the damage stages read them as 0–100%. See "Damage" below. |
| Collisions | vehicle against world: slide along walls (day 1). Vehicle against vehicle: 2D box overlap with an impulse scaled by mass. Vehicle against prop: light props break and fly. |

**Cameras:** chase (default), close chase, hood, look-back (hold a key), and from day 5 the helicopter cam. Speed widens the field of view (day 1) and adds a slight shake above 120 km/h. All shake is off under "reduce motion".

## 3. Vehicle classes

`src/vehicles/models.js`, `src/content/vehicles.js` · days 2–3, more in the bonus pool

All models are built in code from boxes and wedges, 300–600 triangles each. Names are our own (fish and birds). No real makes or models.

The 0–100 column is the time from rest to 100 km/h. For a vehicle whose top speed is under 100 km/h it is the time to 90% of its top speed. Every top speed here must be reachable on a flat road: day 1's drag stops the Heron near 99 km/h, so session D2-S1 retunes drag until each vehicle reaches its listed top speed within 2%.

| id | Name | Kind | Top km/h | 0–100 s | Mass kg | Notes | Ships |
|---|---|---|---|---|---|---|---|
| `heron` | Heron | coupe | 137 | 7.5 | 1,300 | The day 1 car. Mags's car. | day 1 |
| `snook` | Snook | compact | 125 | 10.0 | 1,000 | Nimble, tips easily | day 2 |
| `tarpon` | Tarpon | sedan | 140 | 9.0 | 1,500 | The common car. Taxi and sheriff versions. | day 2 |
| `mullet` | Mullet | pickup | 130 | 9.5 | 1,900 | Things in the bed fall out | day 2 |
| `pompano` | Pompano | van | 120 | 12.0 | 2,200 | News van, ambulance and food truck versions | day 2 |
| `wahoo` | Wahoo | muscle | 170 | 5.5 | 1,600 | Slides if you look at it | day 3 |
| `sailfin` | Sailfin | sports | 190 | 4.5 | 1,350 | Grip and speed | day 3 |
| `grouper` | Grouper | SUV | 150 | 8.5 | 2,300 | Sheriff SUV version | day 3 |
| `manatee` | Manatee | bus | 95 | 22.0 | 9,000 | Huge, slow, pushes everything. Mags's favourite. | day 3 |
| `pinfish` | Pinfish | scooter | 85 | 9.0 | 110 | Teo's ride. Leans. | day 3 |
| `needlefish` | Needlefish | motorcycle | 200 | 3.5 | 190 | Fast and fragile | day 3 |
| `birdie` | Birdie | golf cart | 38 | n/a | 400 | Silent. Fits on sidewalks. | day 3 |
| `flounder` | Flounder | lowrider | 120 | 10.0 | 1,700 | Hops on a button | day 3 |
| `hogfish` | Hogfish | box truck | 105 | 18.0 | 6,000 | Fire truck version. The tow truck is its own model, the Remora (`bible/catalog/vehicles-road.md`), needed by mission 1 | day 5 |
| `tactical` | Sheriff tactical van | armoured van | 125 | 11.0 | 4,500 | Heat 4+ only | day 5 |
| `skipjack` | Skipjack | speedboat | 95 | n/a | 900 | | day 7 |
| `skimmer` | Skimmer | jet ski | 100 | n/a | 250 | | day 7 |
| `gatorback` | Gatorback | airboat | 80 | n/a | 600 | Runs on shallow water and, badly, on grass | day 7 |
| `bonito` | Bonito | supercar | 230 | 3.2 | 1,400 | | bonus |
| `tern` | Tern | convertible | 150 | 8.0 | 1,400 | | bonus |
| `sturgeon` | Sturgeon | limo | 130 | 11.0 | 2,800 | | bonus |
| `bullfrog` | Bullfrog | swamp buggy | 90 | 12.0 | 2,500 | Huge wheels, drives through shallow water | bonus |
| `pelican` | Pelican | garbage truck | 90 | 20.0 | 11,000 | | bonus |
| `dragonfly` | Dragonfly | helicopter | 160 | n/a | 1,100 | | after release |
| `cormorant` | Cormorant | seaplane | 220 | n/a | 1,300 | | after release |

The full catalogue (51 road vehicles, 10 boats, 8 aircraft) is in `bible/catalog/`; the roster is in the canon. Two-wheelers lean into turns and throw the rider on a hard hit. Boats use the same 2D body with water drag, a bow that lifts with speed and a wake.

## 4. Damage and mayhem

`src/vehicles/damage.js`, `src/gfx/fx.js`, `src/world/props.js` · day 5

- Vehicle health: 100 → 60 dents and a cracked light · 40 smoke · 20 fire and 8 seconds to get out · 0 an explosion that throws the hood into the air and hurts everything within 6 m. AI drivers try to bail at the fire stage; not all make it.
- Panels (hood, doors, bumpers, boot lid) are separate pieces that can hang, flap and fall off.
- Tyres burst on spike strips: grip on that corner drops to 0.3 and sparks fly.
- Breakable props: lamp posts bend, hydrants make a geyser that lifts cars, palms drop coconuts, umbrellas fly off in wind, café tables scatter, fences splinter, signs fall.
- People hit by a vehicle tumble with a simple 10-point rope body. After a light hit they get up, dazed. After a hard one (over 50 km/h) they stay down and an ambulance comes.
- Debris is pooled: at most 120 pieces on laptop and 40 on phone, oldest removed first.

## 5. Traffic

`src/vehicles/traffic.js`, `src/world/nav.js`, `src/systems/signals.js` · day 2

- The road network gives a **lane graph**: nodes at junctions, one edge per lane with a direction, a speed limit and a length.
- Each car follows its lane, keeps a gap to the car ahead (2 s rule), brakes for red lights and for anything in a 20 m cone in front, and picks a random legal turn at each junction.
- Lights: every avenue crossing runs a 30 s cycle. Streets use stop-sign rules (first in, first out).
- Reactions: honk and swerve when cut off, pull over for sirens and for Mags's horn, panic and floor it when shots are fired, rubberneck at crashes.
- Spawning: cars appear 120–260 m from the player outside the camera's view and are removed past 320 m. Parked cars are generated per chunk (about 30% of curb spaces filled).
- Counts: 40 moving cars on laptop, 14 on phone. The mix comes from the district (`02-world.md`).
- Time of day: rush at 08:00 and 17:30 (×1.5), quiet at 03:00 (×0.3).

## 6. Pedestrians

`src/actors/peds.js` · day 3

- Drawn as instanced box people: six parts each (head, torso, two arms, two legs), so every person on screen costs six draw calls in total, not six each.
- They walk a sidewalk graph taken from the roads, cross at crossings, and wait for the light.
- **States:** walk · hang out (sit, lean, chat, sunbathe, look at phone) · flee · **film you** (stop, raise phone, follow you with it) · fall over · get up · down (after a hard hit or a shot; an ambulance comes).
- Filming is the signature. A crash, a drift, a jump or a chase within 40 m makes nearby people film. Each person filming adds followers (see Followers).
- Eight kinds at mid level: tourist, jogger, retiree, skater, office worker, dock worker, clubber, beachgoer. Each is a palette, a hat or bag, a walk speed and a courage value.
- Counts: 60 on laptop, 20 on phone. More at the beach by day, in The Paintworks by night, nobody in a hurricane.

## 7. Heat (police)

`src/systems/heat.js`, `src/actors/cops.js`, `src/vehicles/chopper.js` · day 5

Our own take on a wanted level. Trouble puts you on the Sheriff's live show. **Heat is five siren lights on the HUD**, and the number that matters is **viewers**.

| Heat | Name | What comes | Viewers |
|---|---|---|---|
| 1 | Warm | 1 cruiser. Lights on, tries to pull you over. | not live yet |
| 2 | Hot | 3 cruisers. They ram and box in. | not live yet |
| 3 | Trending | 5 cruisers and the news helicopter with a spotlight. **The LIVE overlay starts.** | 1,000–20,000 |
| 4 | Breaking News | Sheriff SUVs, tactical vans, roadblocks on avenues, spike strips, a second helicopter. Radio stations cut to the chase. | 20,000–200,000 |
| 5 | Hurricane Dale | Sheriff Rucker's own show truck, every unit in the county. | 200,000+ |

**What raises heat:** hitting people or cars in view of a cop (+small), stealing an occupied car in view (+1), hitting a cop car (+1), firing a weapon (+1 to +2), killing someone in view (+2), killing a deputy (+3), outrunning a pull-over for 20 s (+1), surviving 90 s at a level (+1).

**How you lose it (the twist):** when no cop or camera can see you, viewers start leaving. The stream ends when viewers hit zero, and the heat clears. At heat 1 and 2 the show isn't live yet, so the same meter runs unseen as the dispatcher's attention and the HUD shows only the siren lights dimming.

- Out of sight, viewers drain at `8% of peak per second ÷ heat level`. So heat 1 clears in about 12 s and heat 5 in about 60 s.
- Parked with the engine off, in a car wash, under a bridge or in a garage: drain is doubled.
- Changing car or outfit while unseen drops one level at once.
- Doing anything interesting in view (drift, jump, crash) **adds** viewers. Great for followers, bad for getting away. That is the choice the system gives you.

**The LIVE overlay** (heat 3+): a red LIVE pill with the viewer count, a scrolling fake chat on the right ("HE'S GOING FOR THE PIER", "grandma???", "this is better than the news"), and a ticker with the Sheriff's commentary. The chat lines react to events. This is the look of the game's clips.

**Helicopter cam:** at heat 3+ one key switches your view to the news helicopter's camera. Harder to drive, much better to watch.

**Getting caught:** at heat 1–2, stopped with a deputy at your door for 3 s means **Booked**: you lose 10% of your cash (up to $5,000) and your weapons, and walk out of the Sheriff's HQ in Northgate. At heat 3+ they don't arrest, they shoot. **Knocked out** (health at zero, however it happened): you wake at Bayhaven General, minus 5% (up to $2,500). Lawyer Larry halves either cost once you've met him.

Unit caps: 12 police vehicles on laptop, 6 on phone. Police drive with the traffic system plus a pursuit brain: chase, cut off, ram from the side, form a roadblock two junctions ahead.

## 8. Combat

`src/actors/combat.js`, `src/systems/health.js`, `src/content/weapons.js` · day 5

A real part of the game, though driving comes first.

| Weapon | Damage | Notes |
|---|---|---|
| Fists | 12 | three-hit combo, last hit knocks down |
| Pool noodle | 8 | fast, makes a "bop". Free at any beach shop. |
| Lawn flamingo | 25 | slow, breaks after 10 hits |
| Pistol | 18 | 12 rounds, 1.4 s reload |
| SMG | 9 | 30 rounds, sprays |
| Shotgun | 60 at 5 m, 10 at 20 m | 6 shells, knocks people over |
| Flare gun | 5 | sets off fireworks crates, makes peds film |

- Health 100, armour 100 (a life vest). Health comes back from food; slowly up to 30 on its own.
- Aiming: hold aim to lock on to the nearest threat in view (works on touch and pad); mouse players can free-aim. A simple three-slot quick bar, not a wheel.
- Weapons are lethal, for you and against you. Bystanders flee; hurting one is a crime that raises heat fast. Enemies and deputies shoot back, and anyone at zero health stays down.
- Enemies: security guards, rival crews, deputies at heat 3+. They take cover behind cars, call out, and run when alone.

## 9. Character switching

`src/systems/switch.js`, `src/actors/characters.js` · day 7

- One button, any time outside a mission step that forbids it. The camera lifts straight up into the sky, slides across the map, and drops onto the other lead (2.5 s).
- The other lead is always doing something: Mags doing tai chi on the beach, under a car at Wendell's, feeding Gerald, driving the 9 bus for fun; Teo filming an unboxing of a sandwich, stuck on a roof, arguing with a parking meter, asleep on a pool float. Eight vignettes each, picked by place and hour.
- Cash is shared. Clothes, weapons and the car they're in are per character.

## 10. Phone

`src/systems/phone.js`, `src/ui/phone/` · day 6

Pulls up from the bottom of the screen; the game keeps running at 30% speed behind it. It is also the pause menu.

| App | What it does |
|---|---|
| **Messages** | Mission offers and replies. Tap a message to set a waypoint. |
| **Map** | The full map: pan, zoom, set a waypoint, filter icons. |
| **Camera** | Photo mode: free camera, three filters, hide HUD. Saves a PNG in a postcard frame with "Greetings from Bayhaven · Day N". Made to be shared. |
| **Squawk** | The city's social feed. Reacts to what you do. Shows Teo's follower count. |
| **Jobs** | Side jobs you can start from here (taxi, delivery, repo). |
| **Garage** | Have a stored car delivered to the nearest road ($50). |
| **Stats** | Progress, collectibles, records. |
| **Browser** | The city's web pages (`bible/voices/web.md`). Tier B, session B-27. |
| **Settings** | Quality, sound, controls, save slots. |

## 11. Radio

`src/audio/music.js`, `src/audio/radio.js`, `src/content/radio/` · day 4 (three stations), day 8 (seven)

All music is sequenced in code. All talk is written text shown on a ticker and "spoken" as blips. Details of the sound are in `07-art-and-audio.md`; the scripts are in `05-content.md`.

| Station | Sound | Host | Tempo | Ships |
|---|---|---|---|---|
| **Tideline 98** | Synth-pop and night-drive music | Nightshift Nina | 96–118 | day 4 |
| **Radio Palma** | Dembow and salsa-flavoured rhythms | El Capitán Memo | 92–104, 180 for salsa | day 4 |
| **Bassline FM** | Club, bass and trap | DJ Subtropic | 130–150 | day 4 |
| **Swamp Country 94** | Twang, shuffle, banjo plucks | Hoot Gibbons | 100–124 | day 8 |
| **Low Tide Lounge** | Lo-fi and slow jazz chords | nobody, just waves | 70–84 | day 8 |
| **Bayhaven Public Radio** | Talk and news that reports on what you just did | Barbara Wetherby | n/a | day 8 |
| **The Grind 24/7** | Motivation talk over hard drums | Kiki Halcyon | 140 | day 8 |

- Plays in vehicles. Change station with Q/E, the d-pad or a swipe on the radio pill. A vehicle starts on its class's station the first time a character gets in (each station file in `bible/radio/` names the classes it owns); after that the character's last choice wins.
- Each station loops: 2–3 songs, a host line, an ad, a station ident.
- Each station has 3 songs at first and 6 by day 9. A song is a seed plus 4–6 patterns, so it costs under 2 kB.
- At heat 4+ every station is interrupted by the Sheriff's show.
- Emergency vehicles have no radio; they have the police scanner (short written calls).
- Five more stations are written for after release (Postcard 66, The Crash, Glitterball 107, Reef Roots, Arcade FM). Every station's songs and lines are in `bible/radio/`.

## 12. Money and followers

`src/systems/economy.js` · day 6

Two numbers. **Cash** buys things. **Followers** is a score that also pays.

| Cash in | Amount |
|---|---|
| Story missions | $500 (first) rising to $250,000 (the Spire) |
| Side jobs | $40–$400 each |
| Street races | $500–$5,000 |
| Brand deals | each in-game day at 09:00 you are paid `followers × $0.02`, capped at $20,000 |
| Selling a stolen car to the scrapyard | 5% of its value, once per model |

| Cash out | Amount |
|---|---|
| Food | $5–$40 |
| Clothes | $15–$4,000 |
| Car paint, wraps, parts | $100–$25,000 |
| Weapons and ammo | $0 (noodle) to $3,500 |
| Property | $8,000 to $2,500,000 |
| Hospital / booking | 5% / 10% of cash |

**Followers** come from being filmed: `+5` per person filming per second of something interesting, `+1` per 100 viewers per second while live, plus stunt bonuses. Milestones: 1,000 (Squawk starts mentioning you), 10,000 (people recognise you and wave or run), 100,000 (shops give 10% off), 1,000,000 (a statue of Teo's phone in the plaza).

## 13. Shops

`src/systems/shops.js`, `src/content/shops.js` · day 6

Shops are doors with a marker. Walking in opens a menu over a blurred view of the street. No interiors to build.

| Shop | Sells | Where |
|---|---|---|
| **Second Wind Thrift** | cheap clothes, changes your look to lose heat | 6 across the city |
| **Maison Sable** | expensive clothes | Meridian, Sandpiper Isle |
| **Shell Yeah** and food stands | food (health) | everywhere |
| **Ventanita Rosa** | coffee: sprint stamina doubled for 2 minutes | Palma Vieja |
| **Park & Sons Auto** | paint, wraps, engine (3 levels), tyres, nitro, horn sounds, repairs | Tideline, Northgate, Rustwater |
| **Bait & Ballistics** | bait, and weapons | Northgate, Glades, Keys |
| **Storm Mart** | life vest (armour), flares, pool noodles | 8 across the city |
| **Car washes** | cleans the car and doubles viewer drain while inside | 5 across the city |

## 14. Property

`src/systems/property.js`, `src/content/properties.js` · day 9

A property is a save point, a wardrobe and garage slots. Some are businesses that pay each in-game day.

| Property | Price | Garage | Daily income |
|---|---|---|---|
| Pelican Rest trailer (start) | free | 1 | 0 |
| Tideline Motel, room 12 | $8,000 | 1 | 0 |
| Flat over the bakery, Palma Vieja | $35,000 | 2 | 0 |
| Paintworks loft | $90,000 | 2 | 0 |
| Rustwater warehouse | $150,000 | 6 | 0 |
| Fish camp, Mudcat Glades | $60,000 | 2 + boat | 0 |
| Houseboat, Pelican Keys | $220,000 | 1 + 2 boats | 0 |
| Bellweather mansion, Sandpiper Isle (after the story) | $2,500,000 | 8 + helipad | 0 |
| Business: Coral Arcade | $120,000 | | $1,500 |
| Business: Gator Putt mini-golf | $200,000 | | $2,600 |
| Business: car wash | $300,000 | | $4,200 |
| Business: food truck | $45,000 | | $700 |

## 15. Clothing

`src/systems/wardrobe.js`, `src/content/clothes.js` · day 6

Slots: hat, glasses, top, bottom, shoes. Characters are boxes, so clothes are colours plus canvas-drawn patterns. A floral-shirt generator makes endless shirts from a seed. 40 items at mid level, 100 in the bonus pool. Outfits are saved per character. Changing outfit while unseen drops heat by one.

## 16. Time and weather

`src/systems/clock.js`, `src/gfx/weather.js` · clock day 1, weather day 8

- One in-game hour is 60 real seconds by day, 120 seconds between 17:30 and 20:00 (the sunset lingers, as day 1 does), and 45 seconds at night (00:00 to 04:00). A full day is about 26 minutes.
- **Weather states:** clear · humid haze · afternoon storm · tropical storm · hurricane · swamp fog.
- **The 15:15 storm:** it rains hard at 15:15 every day for about 40 in-game minutes. The radio jokes about it. After it, a rainbow and steaming roads.
- Rain: streak particles around the camera, darker roads with stretched reflections of lights, wipers on cars, people run for cover, grip 0.8.
- Wind bends palms in the vertex shader and pushes light vehicles.
- **Hurricane** (story finale, and a rare event afterwards): sideways rain, flying lawn furniture, flooded low streets (0.3 m, grip 0.5), no people, power flickering across districts, a green sky.

## 17. Minimap and map

`src/ui/minimap.js`, `src/ui/mapscreen.js`, `src/systems/gps.js` · day 4

- The minimap is a rounded rectangle (not a circle), bottom left, 180 px on desktop, 120 px on phone. It rotates with your heading.
- Map tiles are drawn once per chunk onto a 64 × 64 canvas from the road and land data, then reused.
- Blips: any module can register one (`minimap.addBlip({ id, x, z, icon, colour })`). Icons differ by shape as well as colour.
- Waypoints: tap the big map. The route is found on the road graph (A*) and drawn on the minimap and as faint chevrons on the road.
- Entering a district shows its name for 3 seconds.

## 18. Saving

`src/core/save.js` · day 9 (the format is fixed on day 2 so nothing has to be reworked)

- Stored in the browser (`localStorage`), key `bayhaven.save.<slot>`. Three slots and an autosave.
- Autosaves on mission complete, on entering a property, and every 60 s when heat is zero.
- Every daily build is on the same site, so **your save carries into tomorrow's build.** The save has a version number and each build ships the steps to upgrade older saves.
- Export and import as a text code, for moving between devices.
- Never saved mid-mission; a mission restarts from its last checkpoint.

```json
{
  "v": 3, "day": 9, "savedAt": "2026-11-19T15:30:00Z", "playSeconds": 5400,
  "clock": 17.5, "weather": "clear", "cash": 18250, "followers": 12840,
  "active": "mags",
  "chars": {
    "mags": { "x": -1250, "z": -220, "h": 1.57, "health": 100, "armour": 0, "outfit": ["visor","none","floral-12","cargo","boat-shoes"], "weapons": {"pistol": 24}, "radio": "tideline98" },
    "teo":  { "x": 600,  "z": 300,  "h": 0,    "health": 80,  "armour": 0, "outfit": ["none","none","floral-3","boardies","slides"], "weapons": {}, "radio": "bassline" }
  },
  "missions": { "done": ["final-notice","repo-woman"], "available": ["open-house"] },
  "property": ["pelican-rest"], "garage": { "pelican-rest": [{ "model": "heron", "paint": "#ff4f6e", "mods": ["engine1"] }] },
  "found": { "flamingos": [3,17,41], "postcards": [2], "bigair": [] },
  "stats": { "distanceKm": 61.2, "bestDrift": 8420, "peakViewers": 51200 },
  "settings": { "quality": "auto", "music": 0.8, "sfx": 1, "reduceMotion": false }
}
```

## 19. Controls

`src/core/input.js`, `src/ui/touch.js` · day 1, grown each day

| Action | Keyboard and mouse | Gamepad | Touch |
|---|---|---|---|
| Steer / move | WASD or arrows | left stick | left stick (on foot), left/right buttons or tilt (driving) |
| Gas / brake | W / S | right / left trigger | right-side buttons |
| Handbrake | Space | A | button above brake |
| Enter / exit, interact | F | Y | context button |
| Sprint / jump | Shift / Space | A / X | buttons |
| Horn (Mags: ability) | H | left stick click | horn button |
| Aim / fire | right / left mouse | left / right trigger | lock button / fire button |
| Radio next / previous | E / Q | d-pad left / right | swipe the radio pill |
| Switch character | Tab | d-pad down | portrait button |
| Phone | P | d-pad up | phone button |
| Map | M | Start, then Map | minimap tap |
| Mute | 0 (day 1's M becomes the map key on day 4) | in the pause menu | in the pause menu |
| Camera | C | right stick click | camera button |
| Helicopter cam | V | Back | LIVE pill |
| Skip time (debug builds only after day 2) | T | | tap the clock |

Touch layout changes with what you are doing (driving, on foot, aiming). Buttons are at least 64 px and stay inside the phone's safe areas.

## 20. Settings and access

`src/ui/menus.js`, `src/core/quality.js` · day 3

- Quality: auto, low, medium, high. Auto picks from the device and the first three seconds of frame times, and keeps adjusting resolution (day 1's code).
- Sound: master, music, effects, voice blips.
- Subtitles are always on. Text is never smaller than 14 px on a phone.
- Reduce motion: no camera shake, no speed zoom, no lightning flashes.
- Minimap icons differ by shape, not only colour.
- Hold-to-press can be switched to toggle (sprint, aim).

## 21. More systems, and where each is specified

Each of the systems above has a deep file in `bible/systems/` with its state machine, formulas and tuning tables. These further systems exist only there and in their prompts:

| System | In one line | Tier | Spec |
|---|---|---|---|
| **Stealth** | Guards with a view cone drawn on the ground and a "who is this" bar | A (day 7) | `bible/systems/combat-stealth.md` |
| **Clips** | A record button: up to 20 seconds of the game with its HUD and sound, saved as a file on the player's device. Automatic highlights at heat 3, big jumps and long drifts. | B | `bible/systems/clips-photo.md` |
| **The week** | Seven weekdays with their own events, and three daily challenges that are the same for every player | B | `bible/activities/calendar.md` |
| **Transit** | Six bus routes you can ride or drive, taxis as a paid skip, later a monorail and ferries | B, C | `bible/systems/transit.md` |
| **Regulars** | Side characters with chains of jobs | B, C | `bible/story/regulars-1.md`, `regulars-2.md` |
| **Small games** | Dominoes, mini-golf, fishing, arcade cabinets and more | B, C | `bible/activities/minigames.md` |
| **Wildlife** | Alligators, pelicans, iguanas and the rest. Never harmed. | B, C | `bible/systems/wildlife.md` |
| **Achievements** | Sixty, with our own names, and the 100% list | B | `bible/catalog/achievements.md` |
| **Aircraft** | A helicopter, a seaplane, a jet, a blimp | C | `bible/systems/boats-aircraft.md` |
| **Sharing** | A gallery, race ghosts as text codes, missions players can write | C | `bible/systems/clips-photo.md`, `bible/tech/schemas.md` |

The in-game HUD is drawn on a 2D canvas over the game canvas, not in the page's own elements, so that photos and clips include it.
