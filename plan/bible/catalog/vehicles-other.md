# Bible · catalog · Boats, aircraft, emergency and special vehicles

Everything that moves and is not an ordinary road vehicle: 7 emergency vehicles, 10 boats, 8 aircraft and 22 special versions of existing models. It gives the water and flight rules, a model sheet for each, and which ones only the game may drive. The numbers `04-systems.md` gives for the tactical van, the three day 7 boats, the Dragonfly and the Cormorant are unchanged.

Tier: A for the emergency fleet, the Skipjack, Skimmer and Gatorback, the Mayfly as an AI helicopter, and the King Tide as a set piece that cannot be driven; B to D for the rest, tagged per row.

Model sheets, paint and sound use the notation in `vehicles-road.md`. Two extra marks: `/p` is a piece that narrows to a point in plan at the front, and a sheet that says "plus these" adds its pieces to the named base sheet.

## The table

Metres, kg, km/h. Grip and drift are road values and blank off the road. Health is the vehicle's hit points (Heron 100); the HUD shows damage as 0 to 100% of them. For a vehicle whose top speed is under 100 km/h, the 0-100 column is the time to 90% of top speed. A price in brackets is a scrap value, never a sale price.

| id | kind | L×W×H | mass | top | 0-100 | grip | drift | health | seats | price | tier | driven by |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `sheriff-tarpon` | cruiser | 4.70×1.85×1.58 | 1,650 | 160 | 7.5 | 1.05 | 0.30 | 140 | 4 | ($30,000) | A | AI, player if taken |
| `sheriff-grouper` | pursuit SUV | 4.90×2.00×1.94 | 2,500 | 165 | 7.0 | 0.95 | 0.25 | 190 | 5 | ($52,000) | A | AI, player if taken |
| `tactical` | armoured van | 6.00×2.30×2.70 | 4,500 | 125 | 11.0 | 0.70 | 0.10 | 400 | 8 | ($140,000) | A | AI, player if taken |
| `showtruck` | broadcast truck | 7.50×2.40×3.90 | 6,800 | 150 | 9.0 | 0.80 | 0.15 | 600 | 4 | none | A | AI only |
| `ambulance` | Pompano | 5.20×2.00×2.35 | 2,400 | 135 | 10.5 | 0.85 | 0.20 | 150 | 4 | ($60,000) | A | AI, player if taken |
| `firetruck` | Hogfish | 7.50×2.40×3.30 | 7,500 | 115 | 15.0 | 0.65 | 0.15 | 320 | 4 | ($150,000) | A | AI, player if taken |
| `newsvan` | Pompano | 5.20×2.00×2.20 | 2,350 | 120 | 12.0 | 0.80 | 0.20 | 130 | 3 | ($45,000) | A | AI, player if taken |
| `skipjack` | speedboat | 6.40×2.20×1.60 | 900 | 95 | n/a | 1.00 | 0.50 | 120 | 4 | $38,000 | A | player, AI |
| `skimmer` | jet ski | 3.00×1.10×1.10 | 250 | 100 | n/a | 1.10 | 0.60 | 45 | 2 | $9,000 | A | player, AI |
| `gatorback` | airboat | 5.00×2.30×2.60 | 600 | 80 | n/a | 0.60 | 0.80 | 90 | 3 | $24,000 | A | player, AI |
| `minnow` | dinghy | 3.20×1.50×0.90 | 180 | 45 | n/a | 0.90 | 0.30 | 40 | 3 | $2,500 | B | player, AI |
| `swan` | pedal boat | 2.60×1.60×1.90 | 120 | 9 | n/a | 0.80 | 0.00 | 30 | 2 | $900 | C | player, AI |
| `shrimper` | trawler | 14.00×4.50×7.50 | 30,000 | 28 | n/a | 0.50 | 0.00 | 600 | 4 | ($95,000) | C | player, AI |
| `snowbird` | yacht | 18.00×5.00×6.50 | 40,000 | 45 | n/a | 0.60 | 0.10 | 500 | 8 | $850,000 | C | player, AI |
| `king-tide` | superyacht | 62.00×11.00×18.00 | 900,000 | - | n/a | - | - | - | - | none | A | nobody: a set |
| `hammerhead` | Sheriff's patrol boat | 8.00×2.80×2.60 | 2,400 | 105 | n/a | 1.05 | 0.40 | 220 | 4 | ($120,000) | B | AI, player if taken |
| `bay-ferry` | car ferry | 42.00×12.00×11.00 | 400,000 | 22 | n/a | - | - | - | 60 | none | C | AI only |
| `dragonfly` | helicopter | 7.00×1.80×2.70 | 1,100 | 160 | n/a | - | - | 110 | 4 | $450,000 | C | player |
| `mayfly` | news helicopter | 6.60×1.70×2.60 | 1,000 | 150 | n/a | - | - | 100 | 3 | none | A | AI only until tier C |
| `horsefly` | Sheriff's helicopter | 7.40×1.90×2.80 | 1,300 | 185 | n/a | - | - | 160 | 4 | none | C | AI only |
| `gnat` | gyrocopter | 3.60×1.60×2.40 | 180 | 110 | n/a | - | - | 30 | 1 | $60,000 | C | player |
| `cormorant` | seaplane | 9.00×11.00×3.20 | 1,300 | 220 | n/a | - | - | 120 | 4 | $380,000 | C | player |
| `sandhill` | crop duster | 7.50×9.50×3.00 | 1,500 | 175 | n/a | - | - | 140 | 1 | $90,000 | D | player, AI |
| `tropicbird` | private jet | 14.00×13.00×4.40 | 6,500 | 320 | n/a | - | - | 200 | 8 | $1,900,000 | D | player, AI |
| `pufferfish` | blimp | 40.00×12.00×14.00 | 5,000 | 45 | n/a | - | - | - | - | none | C | AI only |

For boats, grip multiplies the keel value below and drift is how far the stern swings in a turn. For aircraft, W is the wingspan or the body width of a helicopter.

## Sheriff livery

Marlin County Sheriff, on every Sheriff vehicle and boat: body `#fdf6ea`, lower half and doors teal `#2ec4b6`, one pink `#ff4fa8` stripe 0.1 tall at the door handles, "Marlin County Sheriff" on the doors and `@BayhavenBlue` on the tail. The light bar alternates pink `#ff3fa4` and cyan `#29e6ff`, twice a second at heat 1 and 2, four times at heat 3 and up. Sirens are the two recipes in `07-art-and-audio.md`. Every emergency vehicle carries the scanner in place of a radio. From heat 3 the deputy in the passenger seat fires from the window: a pistol, and a shotgun from heat 4.

## How boats handle

A boat is the same 2D body as a car, on water, with these changes.

| Rule | Value |
|---|---|
| Keel (sideways decay) | 2.0 /s × grip, against 6.5 on the road, so every turn is a slide |
| Water drag | forward speed decays 0.6 /s off the throttle; there are no brakes, only reverse thrust at 40% power |
| Steering | needs thrust: turn rate × (0.3 + 0.7 × throttle); the Gatorback has no 0.3 |
| Bow lift | pitch rises to 8° at top speed; above 60% of top the boat planes and drag falls 30% |
| Wake | two foam ribbons from the stern, each speed × 1.5 s long, opening 0.4 m per metre; crossing one above 50 km/h is a jump of up to 1.2 m |
| Swell | hulls bob 0.15 m in the bay, 0.4 m in a tropical storm, 0.8 m in a hurricane |
| Draught | in water shallower than its draught a boat grounds: speed decays 6 /s; hold reverse for 2 s to slide off |
| Hits | a boat is a vehicle: a swimmer or rider hit above 50 km/h stays down, as on the road |
| Damage | the road thresholds: smoke at 40%, fire at 20%; at 0 it explodes as `04-systems.md` says, hurting everything within 6 m, then sinks. Rounds hurt boats as they hurt cars. |
| Getting on | from the water or a dock within 2.5 m, one button, 1.2 s |

## How aircraft handle

Aircraft add height to the same body. Nothing here is a simulator.

| Rule | Value |
|---|---|
| Ceiling | 300 m. Lift fades from 280 m and is zero at 300; the engine coughs and the nose drops. The Spire is 260 m. |
| Helicopter lift | jump key climbs 6 m/s, sprint key descends 8 m/s; let go and it holds its height |
| Hover | with the stick free it levels and stops in 2 s. Stick forward tilts up to 20° and gives speed. |
| Helicopter turn | steer keys yaw at 90° a second below 40 km/h, and bank into the turn above it |
| Ground cushion | within 3 m of the ground descent is capped at 2 m/s, so any flat spot 10 m across is a landing pad |
| Rotor wash | below 15 m, everything loose within 12 m is pushed away: umbrellas, café tables, hats, people |
| Plane lift | needs airspeed above the stall speed on its sheet. Below it the plane sinks 4 m/s nose-down until speed returns. |
| Plane turn | steer keys bank up to 60°; turn rate follows bank; gas and brake are the throttle |
| Landing | wheels on the runway or a road, floats on water. Touching down faster than 8 m/s of descent costs 40 health. |
| Bailing out | one button. The lead comes down under a parachute at 5 m/s and can steer. The aircraft carries on and lands on somebody. |
| Damage | smoke at 40%; at 20% the engine stops and it glides or autorotates down; at 0, or on hitting anything above 60 km/h, it explodes as on the road. Rounds hurt aircraft as they hurt cars. |
| Heat | landing on the Sheriff's studio roof or the runway while a jet is on approach is a crime, heat +1 |
| Edge of the map | a headwind turns any aircraft back 200 m before the edge |

## Emergency

**Sheriff Tarpon** (`sheriff-tarpon`, tier A)  
`lightbar:0.3×1.2×0.12@-0.2,1.46 pushbar:0.1×1.6×0.5@2.34,0.3`  
The Tarpon sheet plus these two pieces. Heat 1 and up. Siren, scanner, no radio.

**Sheriff Grouper** (`sheriff-grouper`, tier A)  
`lightbar:0.3×1.3×0.12@-0.1,1.82 bullbar:0.12×1.8×0.7@2.45,0.4`  
The Grouper sheet plus these two. Heat 4 and up. Built to ram from the side: its shove counts as mass × 1.5.

**Sheriff tactical van** (`tactical`, tier A)  
`chassis:6×2.2×0.28@0,0.4 hull:4.24×2.3×1.9@-0.82,0.68 body:0.7×2.2×0.92@1.65,0.68 hood/f:0.8×2.2×0.92@2.4,0.68 cabin:1.3×2.1×0.8@1.95,1.6 roof:0.29×1.74×0.06@1.88,2.4 ram/f0:0.2×2.3×0.8@2.9,0.4 lightbar:0.3×1.4×0.12@1.05,2.58 boards:3×0.25×0.1@-0.5,0.55×2 hatch:0.8×0.8×0.06@-1.1,2.58`  
Wheels 0.46. Heat 4 and up only. Carries four tactical deputies with SMGs and one spike strip 6 m wide, laid two junctions ahead. Glass is a 0.3 slit; pistol rounds do nothing to the hull.

**Sheriff's show truck** (`showtruck`, tier A)  
`stage:5.15×2.4×1.3@-1.12,0.9 screens:4.6×0.1×1@-1.15,2.2×2 podium:1×1×0.3@-1.05,2.2 crane:4×0.2×0.2@-1.15,3.3 camera:0.4×0.4×0.4@-3.25,3.1 dish:0.7×0.7×0.7@1,3.2 lightbars:0.3×1.6×0.12@2.1,2.51×2 speakers:0.3×0.5×0.6@1.3,2.2×2`  
A Hogfish with cameras: its chassis, cab and hood, with the box swapped for these. Heat 5 only. Sheriff Rucker stands in the podium with a megaphone. Each screen shows the LIVE pill and the viewer count. It never rams from behind; it pulls alongside to film, then squeezes you towards a roadblock. Horn: the first four notes of the show's theme, D4 F4 A4 D5.

**Ambulance** (`ambulance`, tier A)  
`lightbar:0.3×1.5×0.15@1.05,2.2 vent:0.8×0.8×0.1@-0.7,2.2`  
The Pompano sheet plus these. White `#fdf6ea` with a mint `#8fe3cf` band and a mango heart crossed by a pulse line. Leaves Bayhaven General `(-500, -1700)` and reaches anyone left down within 40 s. The crew load them and drive back, so nobody lies in the street for long. Taken by the player, its siren clears traffic.

**Fire truck** (`firetruck`, tier A)  
`tank:5.15×2.4×1.7@-1.12,0.9 ladder:5.9×0.6×0.2@-0.5,2.6 cannon:0.6×0.3×0.3@0.95,2.8 reels:0.6×0.2×0.6@-2.45,1.2×2 lightbar:0.3×1.6×0.12@2.2,2.51`  
A Hogfish with the box swapped for these. Coral `#ff5a5a` with a `#fdf6ea` band at 1.4. The cannon works for the player on the fire key: a 25 m jet for 60 s a tank, refilled at any hydrant. It pushes people over without hurting them and puts out a vehicle fire, resetting health to 21%.

**News van** (`newsvan`, tier A)  
`mast:0.2×0.2×4.3@-0.7,2.2 dish:0.8×0.8×0.4@-0.7,6.5 rack:2.6×1.6×0.08@-0.7,2.2`  
The Pompano sheet plus these. BHTV 6 livery: `#fdf6ea`, a violet `#b46bff` band, a big 6 on the sign panel. The mast folds flat to drive and stands up 3 s after parking. Parked with the mast up it is a camera: within 60 m and in its sight, viewers do not drain. Bump the van and the camera is off for 20 s.

## Boats

**Skipjack** (`skipjack`, tier A)  
`hull:4.6×2.2×0.9@-0.9,0 bow/p:1.8×2.2×0.8@2.3,0.1 deck:2.8×1.9×0.08@1.6,0.9 screen/f0:0.5×1.8×0.52@0.05,0.98 console:0.3×1.6×0.5@-0.35,0.6 seats:0.5×0.6×0.55@-0.85,0.6×2 bench:0.5×1.8×0.4@-2.05,0.6 motors:0.4×0.35×0.95@-3,0.3×2 rail:6.2×0.04×0.07@-0.1,0.8×2`  
Draught 0.5. Two outboards; deck and seats `#fdf6ea`, hull in paint with the rail as its stripe. `#ff4f6e,#29e6ff,#fdf6ea,#ffa02e,#2e4a6b,#8fe3cf`. Engine: saw+sub 40-190 Hz, a slap of noise on each bounce. Horn: A3+F#4. Spawns: the west marina, Gullwing Pier, the cruise basin. The boat Mags waits in during Yacht Rock.

**Skimmer** (`skimmer`, tier A)  
`hull:2.1×1.1×0.45@-0.45,0 bow/p:0.9×1.1×0.4@1.05,0.05 cowl/f:1×0.7×0.4@0.5,0.45 column:0.12×0.12×0.17@0.06,0.85 bars:0.06×0.7×0.08@0.03,1.02 seat:1.2×0.4×0.3@-0.6,0.45 skirts:1.6×0.2×0.12@-0.5,0.2×2`  
Draught 0.25. Leans like a two-wheeler; a bad landing throws the rider. A jet of spray 3 m long rises behind it at speed. `#29e6ff,#ff3fa4,#5dff9b,#ffc300,#fdf6ea,#b46bff`. Engine: saw 90-480 Hz, cutting out in the air. Horn: none. Spawns: every beach hut with a flag, Cash 4 Jet Skis, Glow Camp.

**Gatorback** (`gatorback`, tier A)  
`hull:4.2×2.3×0.35@-0.4,0 bow/f0:0.8×2.3×0.35@2.1,0 bench:0.5×1.6×0.45@0.35,0.35 highseat:0.5×0.6×1.15@-0.65,0.35 engine:0.7×0.7×0.95@-1.25,0.35 cage:0.8×2.1×2.1@-2,0.5 fan:0.1×1.9×1.9@-2,0.6 rudders:0.1×0.05×1.8@-2.45,0.6×2 stick:0.05×0.05×0.7@-0.58,1`  
Draught 0.1, flat bottom. The cage is an open frame; the fan is two crossed blades turning with the throttle. The rudders only bite in the fan's wind, so there is no steering off the throttle. Hull `#8a6f55` with a row of ridged scutes down each side in paint. `#3d6b4a,#6a8f4e,#ffc300,#b5532f,#d7263d,#5a4a32`. Engine: saw+noise 50-160 Hz with the fan as noise chopped at 30 Hz. Horn: none. Spawns: Captain Nilda's dock, the fish camp. On grass: grip 0.3 and 30 km/h. On road: 15 km/h, sparks, health falls 2 a second.

**Minnow** (`minnow`, tier B)  
`hull:2.4×1.5×0.45@-0.4,0 bow/p:0.8×1.5×0.4@1.2,0.05 thwarts:0.2×1.3×0.06@-0.6,0.3×2 motor:0.25×0.25×0.7@-1.48,0.2 tiller:0.45×0.04×0.04@-1.12,0.7 oars:1.8×0.06×0.05@-0.1,0.45×2`  
Draught 0.2. Steered from the stern by the tiller. Under 40% health the motor quits and it rows at 6 km/h. `#fdf6ea,#ff8f7a,#8fe3cf,#ffc300,#9fd2ff,#6f6a78`. Engine: square 60-200 Hz, a putter. Horn: none. Spawns: tied behind every houseboat and yacht, Tackle Key, the fish camp.

**Swan** (`swan`, tier C)  
`hull:2.2×1.6×0.4@-0.2,0 breast/f:0.4×1×0.6@1.1,0 neck:0.2×0.2×1@1,0.6 head:0.35×0.25×0.3@1.07,1.6 beak/f0:0.05×0.12×0.1@1.28,1.68 wings:1.6×0.15×0.5@-0.3,0.4×2 seats:0.5×0.6×0.45@-0.25,0.3×2 wheel:0.2×0.8×0.5@-1.2,0`  
Draught 0.15. Tap the gas in rhythm to pedal; holding it gives 5 km/h. Rents for $10 at Lake Serenity `(-2700, -1900)`, Bayfront Park and the pier. `#fdf6ea,#ff9eb5,#150f3d,#8fe3cf,#ffc98f,#c9a8ff`, beak mango. Engine: none, a paddle splash per stroke. Horn: one honk, a square at 300 Hz sliding to 240. The slowest getaway in the game, and deputies will still follow it along the bank.

**Shrimper** (`shrimper`, tier C)  
`hull:11×4.5×1.8@-1.5,0 bow/p:3×4.5×1.9@5.5,0.3 wheelhouse:2.5×3×2.4@2.25,1.8 mast:0.3×0.3×5.7@-0.35,1.8 booms:1.6×0.2×0.2@-1.2,4×2 winch:1×1.6×0.8@-2.5,1.8 hatch:2×2×0.2@-4.5,1.8 nets:3.5×0.6×1@-4.75,2×2`  
Draught 1.4. Each boom swings out 6 m level with the deck on the horn key and knocks jet skis flat. With booms out the nets pick up floating props. Hull `#fdf6ea` over a rust `#b5532f` waterline, wheelhouse in paint. `#2ec4b6,#ff8f7a,#4f7cac,#ffc300,#6a8f4e,#f7f3ea`. Engine: saw+sub 18-60 Hz, thudding at 3 Hz. Horn: D2+B2. Spawns: Tackle Key, the Rustwater quay, Hammock Key.

**Snowbird** (`snowbird`, tier C)  
`hull:14×5×2.2@-2,0 bow/p:4×5×2.2@7,0.4 saloon:7.5×4.2×2@-1.25,2.2 bridge:4×3.4×1.4@-1,4.2 screen/f0:1×3.2×1.2@1.5,4.2 arch:0.4×3.6×0.9@-3.8,5.6 sundeck:3.7×4.6×0.1@-6.85,2.2 tub:1.6×1.6×0.5@-7.2,2.3 swimstep:0.3×4×0.2@-8.85,0.3`  
Draught 1.2. Hold the horn key to lock the heading and speed, then walk the decks while it sails itself. The tub is a hot tub; sitting in it restores 5 health a second. All `#fdf6ea` with a waterline band in paint. `#2e4a6b,#ff9eb5,#e0b33c,#8fe3cf,#150f3d,#ff8f7a`. Engine: triangle+sub 24-90 Hz. Horn: F2+D3. Spawns: Sandpiper Isle docks, the west marina.

**King Tide** (`king-tide`, tier A as a set piece)  
`hull:50×11×5@-6,0 bow/p:12×11×5@25,1 deck1:40×10×3@-5,5 deck2:28×8.5×3@-5,8 deck3:16×7×3@-5,11 mast:2×3×4@-6,14 helipad:5.5×9×0.2@-27.75,5 pool:6×5×0.1@12,8 gangway:2×6×0.2@-10,2`  
Not drivable. Three walkable decks joined by stairs at 20 and 36 from the stern. Moored bow-west off the yacht club at `(-1260, 200)`, gangway to the dock. `#fdf6ea` with navy `#2e4a6b` glass bands and a pink waterline. The moored hull is part of the Yacht Club landmark and is Tripp Vandermeer's superyacht and hosts Yacht Rock (mission 11, tier A); as tier D it cruises a slow loop of the bay on Saturdays for the 21:00 party.

**Hammerhead** (`hammerhead`, tier B)  
`hull:6×2.8×1.1@-1,0 bow/p:2×2.8×1@3,0.1 cabin:2×2.2×0.9@0,1.1 roof:0.99×1.84×0.06@-0.08,2 hammer:0.3×2.8×0.18@-0.05,2.06 mast:0.1×0.1×0.54@-0.55,2.06 motors:0.5×0.4×1.1@-3.75,0.3×2 fender:6×0.1×0.2@-1,0.9×2`  
Draught 0.6. The `hammer` is the light bar: a T across the cabin roof as wide as the boat, pink and cyan. Sheriff livery. Comes at heat 2 and up when the player is on water; two at heat 4. Until it ships, deputies on water ride Skimmers in Sheriff livery. Engine: saw+sub 36-200 Hz. Horn: G3+E4, plus the siren.

**Bay Ferry** (`bay-ferry`, tier C)  
`hull:42×12×3@0,0 cardeck:38×10×0.2@0,3 ramps:2×6×0.2@-20,3×2 lounge:26×12×2.5@0,6 bridge:6×8×2@10,8.5 funnel:3×3×2.5@-5.5,8.5 pillars:0.5×0.5×2.8@-12.75,3.2×4`  
AI only, but anyone can walk or drive on: the car deck holds eight vehicles. Double-ended, one ramp each end. Runs the Bay Ferry terminal `(2300, 150)` to a landing off Gullwing Pier `(640, 440)` to the west marina `(-1150, 150)` and back, 12 in-game minutes a leg, 06:00 to 22:00. Fare $2 on foot, $10 a vehicle. Heat is frozen aboard, not cleared. `#fdf6ea`, mint `#8fe3cf` funnel with a pink wave. Horn: C2+A2, held 2 s on leaving.

## Aircraft

**Dragonfly** (`dragonfly`, tier C)  
`pod:2.2×1.8×1.5@0.8,0.5 nose/f0:0.8×1.6×1.1@2.3,0.5 boom:2.8×0.35×0.35@-1.7,1.3 fin:0.5×0.08×1.2@-3.25,1.2 tailrotor:0.1×0.05×0.8@-3.35,1.5 hub:0.3×0.3×0.5@0.75,2 blades:8×0.25×0.05@0.8,2.5×2 skids:2.6×0.1×0.1@0.8,0×2 struts:0.1×0.08×0.4@0.15,0.1×4`  
Rotor 8.0 across: the two blades cross at the hub and spin at 6 rev/s. Pod glass from the nose back 1.2. `#fdf6ea,#ff4f6e,#29e6ff,#ffa02e,#2e4a6b,#5dff9b`, tail boom banded in the accent. Sound: noise chopped at 12 Hz, low-passed at 900 Hz. Spawns: Hangar Row `(2400, -2200)`, the Bellweather mansion helipad once owned, the Twin Sails roof.

**Mayfly** (`mayfly`, tier A)  
`spotlight:0.4×0.4×0.3@1.5,0.2 camball:0.4×0.4×0.4@2.5,0.3`  
The Dragonfly sheet at 0.94 scale plus these two under the nose. BHTV 6 livery: `#fdf6ea`, violet `#b46bff` boom, a 6 on the pod. Arrives 15 s after heat reaches 3. Holds 70 m up, 60 m behind your heading, and circles if you stop. Its spotlight is a 14 m disc on the ground. While the disc is on you it is a camera and viewers do not drain; a bridge, a garage, a car wash or the Mangrove Tunnel breaks it. This is the helicopter cam's eye. It can be brought down: health 100, and rounds fired at it are heat +2. The next one arrives 45 s later. From tier C one sits on the roof pad of the Sheriff's studio `(200, -2150)` and can be taken.

**Horsefly** (`horsefly`, tier C)  
`spotlight:0.4×0.4×0.3@1.5,0.2 speaker:0.6×0.5×0.3@0.6,0.2 lightbar:0.3×1.2×0.1@0.45,2`  
The Dragonfly sheet at 1.06 scale plus these. Sheriff livery. The second helicopter at heat 4 and up; until it ships, that slot is a second Mayfly in Sheriff colours. Flies lower, 40 m, and ahead of you instead of behind. Its speaker reads the Sheriff's ticker lines as blips at 120 Hz. At heat 5 a marksman sits in its door (`weapons.md`). Rotor noise chopped at 14 Hz.

**Gnat** (`gnat`, tier C)  
`keel:3.2×0.12×0.12@0,0.4 seat:0.5×0.5×0.78@0.25,0.52 mast:0.12×0.12×1.78@-0.14,0.52 blades:5.4×0.2×0.05@0,2.3×2 engine:0.6×0.5×0.5@-0.5,0.7 prop:0.1×1.3×1.3@-0.85,0.3 fin:0.5×0.06×1.1@-1.55,0.4 nosewheel:0.3×0.1×0.3@1.45,0 mains:0.3×0.1×0.3@-0.35,0×2`  
An open frame with a free-spinning rotor 5.4 across and a pusher prop. It cannot hover. Stall 40 km/h, take-off run 30 m, lands in 10 m. `#ffc300,#ff3fa4,#29e6ff,#5dff9b,#fdf6ea,#ff5a5a`. Sound: square 80-300 Hz plus rotor noise chopped at 9 Hz. Spawns: Hangar Row, Last Key, the fish camp.

**Cormorant** (`cormorant`, tier C)  
`fuselage:6×1.3×1.3@0,1 nose/f:1.1×1.1×1@3.55,1 tail/r0:1.5×1×0.9@-3.75,1.4 wing:1.6×11×0.15@1.3,2.3 tailplane:0.9×3.6×0.1@-3.85,2 fin:1.2×0.1×0.9@-3.9,2.3 floats:5.2×0.6×0.6@0.9,0×2 struts:0.1×0.1×0.4@0.05,0.6×4 prop:0.1×2×2@4.15,0.5`  
High wing, twin floats 2.4 apart with small wheels in them, so it lands on water or the runway. Stall 90 km/h, take-off run 220 m. `#fdf6ea,#ffa02e,#29e6ff,#ff4f6e,#2e4a6b,#8fe3cf`, one stripe along the fuselage at 1.6. Sound: saw 70-210 Hz with a 40 Hz prop beat. Spawns: Hammock Key marina, Captain Nilda's dock, the cruise basin.

**Sandhill** (`sandhill`, tier D)  
`fuselage:4.8×1×1.1@-0.15,0.9 cowl:1×1.1×1.1@2.75,0.9 tail/r0:1.2×0.8×0.8@-3.15,1.2 wing-low:1.4×9.5×0.1@1.15,0.9 wing-high:1.4×9.5×0.1@1.55,2.5 fin:1×0.1×1@-3.25,2 tailplane:0.8×3×0.1@-3.25,1.9 spraybar:0.1×9×0.06@0.3,0.8 legs:0.2×0.15×0.9@1.35,0×2 prop:0.1×2×2@3.3,0.4`  
A biplane with long legs, like the crane it is named for. Stall 80 km/h, take-off run 180 m, happy on dirt. The fire key sprays a pink water mist 9 m wide: roads under it are wet (grip 0.8) for 20 s and people open umbrellas. `#ffc300,#d7263d,#fdf6ea,#3d6b4a,#4f7cac,#ffa02e`. Sound: saw+noise 60-180 Hz. Spawns: Citrus Flats, the lost airstrip in the North Glades.

**Tropicbird** (`tropicbird`, tier D)  
`fuselage:9×1.8×1.8@0,1.2 nose/f0:2.5×1.6×1.6@5.75,1.2 tail/r0:2×1.4×1.2@-5.5,1.8 wing:2×13×0.15@-0.5,1.2 pods:2×0.7×0.7@-3.2,2.4×2 fin:2×0.12×1.4@-5.7,3 tailplane:1.2×4.6×0.1@-6.1,4.3 streamers:0.5×0.1×0.1@-6.75,2.3×2 gear:0.3×0.3×1.2@-0.55,0×3`  
Twin engine pods on the tail. Stall 160 km/h, take-off run 600 m, so only the runway at Bayhaven International and the strip at Cape Calamity will do. The streamers are two ribbons 6 m long that trail from the tail in flight. All `#fdf6ea` with a thin band along the windows in paint. `#ff4f6e,#2e4a6b,#e0b33c,#29e6ff,#150f3d,#ffa02e`. Sound: band-passed noise 400-2,400 Hz and a sine at 900 Hz. Spawns: Hangar Row.

**Pufferfish** (`pufferfish`, tier C)  
`envelope:32×12×12@0,2 nose/p:4×12×8@18,4 tailcone/r0:4×8×8@-18,4 fins:4.5×0.3×5@-17.25,8×4 gondola:6×2×2@-1,0 props:0.5×1.2×1.2@-4.25,0.5×2`  
AI only. Build the envelope 12-sided, not square. Its sides are sign panels showing one ad from the radio pool, changed each in-game day. Drifts at 150 m: over the Speedbowl on Fridays from 18:00, along the beach on Sundays for the boat parade, round the Spire otherwise. A flare or a dozen rounds make it sag, blow a long raspberry (a saw sliding from 180 to 60 Hz over 4 s), sink gently to the nearest open ground and reinflate two in-game hours later. Nobody is aboard.

## Special versions

A special version is a base sheet with a livery and a few changes. It shares the base model's numbers unless the row says otherwise.

| id | Base | What changes | Where | Tier |
|---|---|---|---|---|
| `bay-cab` | Tarpon | Mango `#ffa02e`, pink wave stripe, lit roof sign "Bay Cab", a fare meter on the HUD | everywhere; fares from the Jobs app | A |
| `mags-heron` | Heron | `#ff4f6e`, cyan stripe, a faded 9 on each door. Returns to Pelican Rest whenever it is lost. | `(-1250, -220)` | A |
| `marco-remora` | Remora | Marco's truck in Final Notice, with the Pinfish chained on the deck. The Remora is tier A because mission 1 needs a tow truck. | mission 1 | A |
| `security-birdie` | Birdie | Sage `#b7c9a8`, amber beacon on the canopy, top speed 42 | Mallard Greens; Open House | A |
| `security-skimmer` | Skimmer | Navy `#2e4a6b`, top speed 105 | Sandpiper Isle; Yacht Rock | A |
| `eats-pinfish` | Pinfish | A mango box 0.4 across behind the seat, marked Pelican Eats | Pelican Eats jobs | A |
| `getaway-manatee` | Manatee | Plywood over the glass, rope over the roof, health 450, wades 0.5 m of flood | The Spire Job | A |
| `cradle` | none | The Spire's window-cleaning platform, 4.0×0.9×1.1 with rails. Rides two cables at 2.5 m/s, swings up to 1.5 m sideways in a hurricane. | the Spire, east face | A |
| `pressed-truck` | Pompano | Serving hatch and awning on the kerb side, grill smoke, Pressed on the sign panel | the food-truck yard `(1000, -1100)` | B |
| `lava-van` | Pompano | Lava Abuela flames on the sign panel; 24 bottles in the back with a breakage meter | Hot Sauce | B |
| `golden-birdie` | Birdie | Gold `#e0b33c` that glints, top speed 70, the horn plays a four-note fanfare | reward for all 10 gnomes | B |
| `speedbowl-wahoo` | Wahoo | No lights, door numbers, a roll cage in the cabin, top speed 200, grip 1.10 | the Speedbowl | B |
| `hauler` | Hogfish | Open deck with ramps; carries one car | Speedbowl (mission 14) | B |
| `dent-a-car` | Snook, Guppy, Tarpon | White with a pink dent sticker on the driver's door, and one real dent: it arrives at 90% health | Rental Row `(1100, -1750)` | B |
| `derby-birdie` | Birdie | A number, tyres lashed round the body, health 120 | the golf cart derby | B |
| `dawn-birdie` | Birdie | Canopy shaped like a sun visor, a pennant, a cooler in the bag rack | the Dawn Patrol | C |
| `generator-truck` | Hogfish | Box swapped for a yellow generator with a cable drum | Hurricane Party | C |
| `scoop-conch` | Conch | The Conch you own as a business: the jingle can be changed at Park & Sons | see `properties.md` | C |
| `baylink` | none | Monorail, AI only: three cars of 9.0×2.6×3.0 on a beam 7 m up, 50 km/h, six stations. Ride as a passenger for $2. | Meridian loop | C |
| `airliner` | none | Low Altitude Airlines jet, AI only: 30×28×9, lands every 6 real minutes, taxis to the terminal. Drive under it, not into it. | the runway `(1000, -2450)` to `(2800, -2450)` | C |
| `upward-rocket` | none | AI only, 40 m tall. Counts down every Saturday at 14:00 and is scrubbed five times in six. | Cape Calamity | D |
| `tangelo-tortoise` | Tortoise | Tows a trailer of 200 loose oranges | Citrus Flats | D |

## Who may drive what

- **AI only, always:** the show truck, the Horsefly, the Bay Ferry, the Pufferfish, the Baylink, the airliner, the rocket. The King Tide never moves under anyone's hand.
- **AI only for now:** the Mayfly, until tier C.
- **Player if taken:** every other Sheriff vehicle, the ambulance, the fire truck and the news van. Taking one in view is heat +1, as for any occupied car, and its light bar keeps flashing, which makes traffic pull over for you too.
- **Boats and private aircraft** are bought at Cash 4 Jet Skis or Hangar Row and stored at a property with a boat slip, a hangar or a helipad (`properties.md`).

## New names

None. Every model is from canon section 7. The ids in the special versions table are ids only and are never shown to the player.
