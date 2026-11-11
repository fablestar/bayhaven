# Bible · world · The Islands

Three pieces of the bay's west side. Sandpiper Isle is where the money lives: white mansions behind hedges, Bellweather's among them, and men with rifles paid to keep it that way. The Pelican Keys are five scraps of sand joined by the Longspan, the best drive in the game by day and the bay's smuggling route by night. Heron Marsh is the mangrove edge that the road to the Keys runs through.

Tier: A for the land, the Sandpiper Bridge, Isle Drive, Marsh Road, the Longspan and its five keys, the kit recipes marked A, the island gatehouse and the Bellweather mansion (day 8). The rest is B or C.

## 1. Feel

**Sandpiper Isle** is quiet, white and clipped. You see hedges, gates and top floors, never front doors. **The Keys** are the opposite: striped shacks, boats on trailers, hammocks, and a low road over open water with the sun going down at the end of it. **Heron Marsh** is a green wall with a road cut through it.

Any screenshot must show:

1. On the Isle: a hedge taller than a person and a white wall above it.
2. On the Keys: open water on both sides of the road, or a shack in beach-towel stripes.
3. In the Marsh: mangrove roots standing in water.

## 2. Neighbourhoods

The canon's split is Sandpiper Isle, the five Pelican Keys, and Heron Marsh.

### Sandpiper Isle

Bounds `[-1500, -700] × [420, 900]`. The island is an ellipse centred on `(-1100, 660)` with radii 390 (east to west) and 230. Ground +2.0 m, a seawall on the north, east and south, a beach on the west. About 22 lots of 70×80 line Isle Drive; the Bellweather estate has the south shore from `x` -1150 to -850.

### The Pelican Keys

Each key is an ellipse of sand, long axis along the Longspan, crown at +2.0 m, beach all round. Sizes are length × width.

| Key | Centre | Size | Layout | Tier of what stands on it |
|---|---|---|---|---|
| Flip-Flop Key | `(-2000, 300)` | 140×90 | North side: The Sweaty Flamingo tiki bar and a rack of Sanderling scooters. South side: four shacks and a 30 m beach. At the east end, The Right One, a 6 m flip-flop standing on its heel. | B |
| Tackle Key | `(-2280, 520)` | 160×110 | North side: Bait & Ballistics, Reel Estate and a boat ramp. South side: six shacks, eight boats on trailers, a 40 m pier at `(-2260, 580)`. | B |
| Hammock Key | `(-2550, 750)` | 200×130 | North side: eight shacks under 30 palms, a hammock between every pair. South side: the houseboat marina and Low Tide Bar at `(-2520, 800)`. | B |
| Lime Key | `(-2830, 980)` | 140×100 | North side: Dr. Okoro's Tide Pool lab. South side: forty lime trees in five rows, the Key Lime Crimes stand, three shacks. | C |
| Last Key | `(-3100, 1200)` | 120×90 | The road ends in a loop of radius 18 round the lighthouse. A cottage, one bench facing south-west, one sign. | B |

### Heron Marsh

Bounds `[-3200, -2000] × [-1440, -320]` and the coast west of Tideline down to `z = 200`. No lots. Mud at -0.3 m, tidal creeks at -1.2 m. Instanced mangroves cover 70%: arched roots 1.5 m high under a round crown 5 to 7 m across, `#3d6b4a` and `#6a8f4e`, one per 30 m².

### Kit

Sizes are width×depth in metres. Isle: white `#ffffff`, trim `#fdf6ea`, shutters in yacht-club navy `#2e4a6b`, hedges `#3d6b4a`. Keys: stripes 0.5 m wide in two base pastels, tin roofs `#e0e0e6`, thatch `#f2ddb0`.

| id | Recipe | Footprint | Floors × height | Roof | Details | Tier |
|---|---|---|---|---|---|---|
| `is-mansion` | Mansion | 28×18 and two wings 10×12 | 2 × 4 | low hip `#fdf6ea` | six columns, a pool 14×6 behind, a hedge 2.5 m round the lot, a 5 m gate | A |
| `is-modern` | Glass house | boxes 30×14 and 20×12, offset | 2 × 3.6 | flat, 2 m overhang | glass `#b8cfe0` to the sea, a blank white wall to the road | B |
| `is-villa` | Guest villa | 16×12 | 1 × 3.6 | low hip | a covered car port with a Birdie | B |
| `is-dock` | Private dock | 24×3 | none | none | a boat lift, two lamp posts, one moored boat | A |
| `ky-shack` | Beach shack | 7×5 on posts 1 m high | 1 × 2.6 | tin, one slope | striped walls, a porch with a hammock, a boat on a trailer | A |
| `ky-tiki` | Tiki bar | 8×8, open sides | 1 × 3 | thatch pyramid 3 m | four posts, a counter ring, six stools | A |
| `ky-houseboat` | Houseboat | hull 12×4, cabin 8×3.5 | 1 × 2.6 | a roof deck with two chairs | striped cabin, a plank to the pontoon | B |

### Block recipes

| Where | Shares (%) | Parking | Trees and props |
|---|---|---|---|
| Sandpiper Isle | `is-mansion` 60, `is-modern` 25, `is-villa` 15; an `is-dock` on every shore lot | none on the road; two cars behind each gate | per 100 m of Isle Drive: 8 royal palms, hedge on both sides, 2 gate piers, 3 low lamps |
| A key | `ky-shack` 80, `ky-tiki` 20 | sand yards: a Mullet at 50%, a Pinfish at 40% | per key: 10 to 30 coconut palms, sea-grape clumps `#6a8f4e`, 4 boats on trailers |
| Heron Marsh | none | two lay-bys on Marsh Road | mangroves; a reflector post every 40 m |

## 3. Streets

Causeways are 14 m wide, 80 km/h; island lanes 10 m. Isle lanes are named for winds. Control points are `(x,z)` pairs for a Catmull-Rom spline.

| Name | Line or control points | Tier |
|---|---|---|
| Sandpiper Bridge | straight on `x = -1100` from (-1100,130) to (-1100,430). Deck +2.5 at both ends, +12 at `z = 280`. Boats pass under the middle 80 m. | A |
| Isle Drive (Isle, closed loop) | (-1100,500) (-960,515) (-850,570) (-800,660) (-830,725) (-900,745) (-1000,738) (-1100,745) (-1200,790) (-1280,740) (-1300,660) (-1290,580) (-1240,525) (-1180,500); a stem from the gatehouse (-1100,430) to (-1100,500) | A |
| Windward Way (Isle) | (-1100,500) (-1090,620) (-1100,745) | B |
| Zephyr Court (Isle, cul-de-sac) | (-1090,620) (-1170,630) (-1230,650) | B |
| Leeward Lane (Isle) | (-830,725) (-800,770) (-850,815) | B |
| Doldrums Drive (Isle) | (-1200,790) (-1260,820) (-1330,800) | B |
| Trade Wind Lane (Isle, Glow Camp's drive) | (-1290,580) (-1340,590) (-1400,620) | B |
| Marsh Road (Marsh, 10 m, two timber trestles) | (-1972,-357) (-2050,-270) (-2130,-150) (-2140,-20) (-2060,90) (-1960,150) (-1900,180) | A |
| Tunnel Road (Marsh, 10 m, from the expressway ramp at `x = -2400`) | (-2400,-1440) (-2410,-1200) (-2380,-950) (-2400,-700) (-2350,-480) (-2240,-330) (-2130,-150) | B |
| Tower boardwalk (Marsh, 2.4 m, on foot) | (-2380,-950) (-2500,-980) (-2600,-960) (-2700,-1000) | C |
| Kayak trail (Marsh, a creek 8 m wide) | (-2140,-20) (-2300,-100) (-2500,-250) (-2650,-500) (-2600,-760) (-2450,-640) (-2300,-560) (-2200,-380) (-2180,-150) | C |
| The Longspan | (-1900,180) (-2000,300) (-2280,520) (-2550,750) (-2830,980) (-3100,1200); see below | A |

### The Longspan's geometry

A polyline through the key centres, 1,578 m from the abutment to the lighthouse: five spans of 86, 206, 175, 192 and 219 m. It is level 0: `map.heightAt` returns the deck. The deck is 14 m wide: two 4 m lanes, 1.5 m shoulders, a 1.5 m walkway each side, rails 0.9 m high in `#fdf6ea`. Piers are pairs of round piles `#c8ccd2` every 20 m. No lamps. A leaning pole every 40 m on the north side, most with a pelican on top.

| Piece | Chainage (m) | Ends | Deck height |
|---|---|---|---|
| Span 1, the Step-Off | 0 to 86 | (-1900,180) to (-1955,246) | +2.5 |
| Flip-Flop Key | 86 to 226 | | +2.5 |
| Span 2, the Hump | 226 to 432 | (-2055,343) to (-2217,470) | +2.5 at both ends, +16 at chainage 329, `(-2136, 407)`, eased with a cosine |
| Tackle Key | 432 to 592 | | +2.5 |
| Span 3, beside the Stilt House | 592 to 767 | (-2341,572) to (-2474,685) | +5 |
| Hammock Key | 767 to 967 | | +2.5 |
| Span 4, the Fishing Gap | 967 to 1159 | (-2627,813) to (-2776,935) | +5, with an anglers' catwalk at +3 on the south side |
| Lime Key | 1159 to 1299 | | +2.5 |
| Span 5, the Long Reach | 1299 to 1518 | (-2884,1024) to (-3053,1162) | +5, aimed at the lighthouse |
| Last Key | 1518 to 1578 | | +2.5 |

Each low span ramps from +2.5 to +5 over its first and last 18 m. Yachts pass only under the Hump (13 m clear). Small boats pass under every span (3.5 m clear). Above 110 km/h a car leaves the deck at the Hump's crest.

## 4. Landmarks

A seed is the landmark's centre or tallest piece. Parts are width×depth×height in metres.

**The island gatehouse**, `isle-gatehouse`, seed `(-1100, 430)`, 12×8, 5 m, tier A.
Silhouette: a white hut with a navy roof, two arms down.
Parts: hut 6×5×3.5 `#ffffff`, hip roof `#2e4a6b`, a rifle rack inside; two arms 4.5 m; a sign wall 8×1×2; two lanterns on piers.
Night: the two lanterns.
Player: the arm lifts for a Sturgeon, Gallinule, Coquina, Bonito or Birdie. Anything else tailgates, comes by boat, or breaks the arm for heat 1 and rifle fire from both guards.

**The Bellweather mansion**, `bellweather-mansion`, seed `(-1000, 780)`, estate 300×140, 16 m, tier A.
Silhouette: a white U open to the sea, a glass drum, a bell weathervane, a helipad over the water.
Parts: main block 40×20×9; two wings 14×24×7 running south; an 8-sided glass drum of radius 6, 12 m high, `#b8cfe0`; weathervane, a bell 2×2×2 on a 2 m rod, brass `#ffc98f`; ten columns 0.8×0.8×8; a pool 24×8; a garage block 30×10×4 with eight doors; a helipad disc of radius 9 on six piles at `(-930, 850)`; a dock 40×4 at `(-1000, 880)`; gates on Isle Drive at `(-1000, 742)`, a bell on each pier; a 3 m hedge.
Night: every window lit, the pool cyan, eight green lights round the helipad.
Player: guarded by twelve of Chad and Brad's men with SMGs, two of them on the roof. After the story it is for sale: $2,500,000, eight cars and the helipad.

**Glow Camp**, `glow-camp`, seed `(-1350, 600)`, 160×170 on the west beach, tents 3.5 m, tier B.
Silhouette: two arcs of white tents, like a very clean circus.
Parts: twelve bell tents, 8-sided cones of radius 3, `#ffffff`; a stage 10×6×1 with a banner 8×2 reading "Glow Camp"; a bronze bowl 2 m across; a service tent 10×6 with a stack of SPF 1000 crates; a jetty 16×2 at `(-1440, 610)` with two Skimmers.
Night: the tents glow `#fff1c9` from inside.
Player: mission 6. The jetty is the jet-ski way out. The camp takes cash only; Kiki's people count it in the back of the service tent.

**Maison Sable**, `maison-sable`, seed `(-850, 520)`, 14×10, 5 m, tier C.
Silhouette: a white cube with one window and one thing in it.
Parts: cube 14×10×5; a window 6×3; a navy awning; three smaller cubes beside it, shut.
Night: the one lit window.
Player: the expensive clothes shop.

**The private docks**, `isle-docks`, eight `is-dock` along the south shore at `x = -1400 + 60i`, `i` 0 to 3, and `x = -820 + 30i`, `i` 0 to 3, tier B.
Silhouette: a comb of jetties with white boats.
Parts: per dock, one boat: Skipjack 50%, Snowbird 30% (C), a Skimmer on a lift 20%.
Night: two lamps a dock.
Player: boats to steal. The Isle's marina for boat spawns. A guard Skipjack with two riflemen circles the island every 6 minutes.

**The flamingo lawn**, `flamingo-lawn`, seed `(-1090, 620)`, 40×30, tier B.
Silhouette: a perfect lawn with a crowd of real flamingos on it.
Parts: lawn `#3fb86a`; fourteen instanced flamingos 1.4 m tall; a pond of radius 5.
Night: the birds sleep with heads tucked.
Player: they scatter and come back. One is plastic.

**The Stilt House**, `stilt-house`, seed `(-2400, 640)`, 18×14 on piles in the water, 9 m, tier B.
Silhouette: a striped bar on legs beside the bridge, ringed by boats.
Parts: deck 18×14 at +5 on sixteen piles; bar hut 10×8×3, stripes `#ff9eb5` and `#fff1c9`, a thatch roof; a gangway 6×2 to the Longspan's walkway; a lay-by for six cars on the bridge; a floating dock 12×3 below.
Night: bulb strings and pink neon.
Player: food and drink. Steel drums from 18:00. The Keys' crews settle up at the back table. Nobody there wants a photograph.

**The houseboat marina**, `houseboat-marina`, seed `(-2520, 800)`, three pontoons 40×3, tier B.
Silhouette: floating striped sheds with chairs on their roofs.
Parts: three pontoons 20 m apart; twelve `ky-houseboat`; Low Tide Bar, a `ky-tiki`, at the head.
Night: one porthole lit a boat.
Player: the Houseboat property is the last boat on the middle pontoon: $220,000, one car, two boats. One other boat never shows a light or the same padlock twice.

**The lighthouse**, `lighthouse`, seed `(-3100, 1200)`, base radius 4, 30 m, tier B (a plain tower without a beam is A).
Silhouette: a tapering tower in pink and white bands.
Parts: a 12-sided tower, radius 4 at the base and 2.5 at the top, 24 m, in six bands of `#ff9eb5` and `#ffffff`; a gallery at 24 m; a glass lantern drum of radius 2, 4 m high; a 2 m cap; a cottage 8×6×3.
Night: one beam, a full turn every 10 s, seen from Tideline. Some nights it goes dark for four minutes at 02:00. Boats come in then.
Player: a ladder up the back. Mission 20's closing drive ends here.

**The Right One**, `right-one`, seed `(-1950, 262)`, 3×1, 6 m, tier C.
Silhouette: a giant flip-flop on its heel: the pair of The Left One in Tideline.
Parts: a sole 3×0.5×6 `#ff8f7a`; a strap of two boxes `#29e6ff`; a post beside it with forty real flip-flops nailed on.
Night: one spotlight.
Player: marks the start of the Keys.

**Key Lime Crimes**, `lime-stand`, seed `(-2840, 1000)`, 4×3, sign 7 m, tier C.
Silhouette: a hut under a giant lime slice.
Parts: a `gl-stand` from the Glades kit; a half disc of radius 3 on a 4 m pole, rind `#b5e48c`.
Night: the slice glows green.
Player: food.

**The Tide Pool lab**, `tide-pool-lab`, seed `(-2810, 950)`, 10×6, 4 m, tier C.
Silhouette: a shack with tanks outside.
Parts: a white `ky-shack`; four glass tanks 2×1×1; a dock 10×2 with a Minnow.
Night: the tanks glow pale blue.
Player: Dr. Okoro's Tide Pool chain starts here.

**The Mangrove Tunnel**, `mangrove-tunnel`, seed `(-2400, -700)`, 200 m of Tunnel Road from `z = -800` to `-600`, canopy 6 m, tier B.
Silhouette: the road vanishes into a green mouth.
Parts: 40 pairs of mangroves 5 m apart, crowns joined over the road; light shafts as additive quads; a 60 m timber trestle in the middle.
Night: black, with fireflies and your headlights.
Player: the engine echoes.

**The bird-watching tower**, `bird-tower`, seed `(-2700, -1000)`, 4×4, 14 m, tier C.
Silhouette: a timber platform on four legs over the mangroves.
Parts: four posts 0.4×0.4×12; decks 4×4 at 4, 8 and 12 m; ladders; a roof.
Night: unlit.
Player: from the top, the Spire, the Longspan and the lighthouse in one turn of the head.

## 5. Places of use

| Place | Use | Seed | Tier |
|---|---|---|---|
| Isle gatehouse | entry check | `(-1100, 430)` | A |
| Isle docks | marina: boats spawn | `(-1310, 868)` | B |
| Glow Camp service tent | mission 6, the swap | `(-1330, 640)` | B |
| Glow Camp jetty | mission 6, the exit | `(-1440, 610)` | B |
| Bellweather mansion | property after the story | `(-1000, 780)` | A as a building |
| Maison Sable | expensive clothes | `(-850, 520)` | C |
| The Sweaty Flamingo, Flip-Flop Key | food | `(-2010, 285)` | B |
| Bait & Ballistics, Tackle Key | guns, ammunition and bait | `(-2290, 495)` | B |
| Reel Estate, Tackle Key | bait and houses; sign only until the catalogue gives it a use | `(-2265, 500)` | C |
| Tackle Key boat ramp | launch a boat; night drops land here, 02:00 | `(-2310, 500)` | B |
| The Stilt House, Low Tide Bar | food | `(-2400, 640)` `(-2520, 800)` | B |
| Houseboat, Hammock Key | property, $220,000 | `(-2520, 830)` | B |
| Key Lime Crimes | food | `(-2840, 1000)` | C |
| Tide Pool lab | Dr. Okoro's chain | `(-2810, 950)` | C |
| Last Key bench | mission 20's closing drive ends here | `(-3110, 1215)` | A |
| Kayak hut, Marsh Road | Swan and Minnow hire for the trail | `(-2140, -20)` | C |

No car wash and no garage on the islands.

## 6. Street life

Until a vehicle is built, its weight goes to `tern` on the Isle and `mullet` on the Keys. Ids marked * are tier C.

| Where | Dawn and day, 05:00 to 17:00 | Golden, 17:00 to 21:00 | Night, 21:00 to 05:00 |
|---|---|---|---|
| Sandpiper Isle | birdie 4, tern 3, sturgeon 2, gallinule* 2, coquina* 2, egret* 1, bonito 1 | sturgeon 4, tern 2, bonito 2, gallinule* 2 | count × 0.1: egret* 1 (Saturday until 01:00: sturgeon 8) |
| The Keys and the Longspan | mullet 5, pinfish 4, tern 2, hermit* 1, plover* 2, pompano 1 | mullet 3, pinfish 3, tern 3, wahoo 1 | count × 0.2: mullet 2 |
| Marsh Road | mullet 3, tarpon 2, pinfish 2, tern 1 | the same, count × 0.5 | count × 0.1 |
| The water | skipjack 3, skimmer 3, minnow 2, snowbird* 1, shrimper* 1 | skipjack 2, snowbird* 1 | hammerhead 1, skipjack 2 with no lights |

People. Isle: retiree 3, jogger 2, guard* 2 (armed, shoot at heat 1), gardener* 2, and at Glow Camp 40 camper* in white. Keys: beachgoer 5, angler* 3, tourist 2, skater 1. Marsh: none on foot. `guard`, `gardener`, `camper` and `angler` are tier B; until built they are `retiree`.

Vignettes:

1. Isle gatehouse, all day: one guard polishes the barrier arm. The other watches you down a rifle.
2. Glow Camp, 06:00: forty guests in white breathe at the sea. The sun rises behind them.
3. Hammock Key, 14:00: every hammock is taken and nobody moves. At 15:15 everybody moves at once.
4. Tackle Key pier, dawn: six anglers in a row, a pelican behind each.
5. The Long Reach, 19:00 to 20:00: cars pull over to photograph the sunset.
6. The Stilt House, 21:00: boats tied three deep. Someone is thrown in. He owed.
7. Tackle Key ramp, 02:00: a Skipjack with no lights noses in. Three men pass forty sealed bales to a Mullet in ninety seconds. A lookout on the Hump has a radio.
8. Off Hammock Key, 01:50: the Sheriff's Hammerhead idles with its lights out, and leaves ten minutes before the boats arrive.

Parked cars: none on Isle Drive or the Longspan, except the Stilt House lay-by and the sunset stop.

## 7. Sound bed

| Layer | Recipe | When |
|---|---|---|
| Rigging | a bright clink on a mast | near any dock or marina, faster in wind |
| Water under the deck | slow slaps of filtered noise | on the Longspan and the bridge |
| Joint thump | a low double thud for every 20 m of deck | driving any causeway |
| Steel drums | a pentatonic pattern on a bell-like FM voice | 18:00 to 01:00, within 200 m of the Stilt House |
| Glow Camp bowl | one 220 Hz tone with a 6 s tail | every 30 s, within 120 m |
| Marsh | clicks, one fish plop, a heron's croak | always in the Marsh, louder at dusk |
| Night boats | two outboards at low revs, no lights, then nothing | 01:30 to 03:00, off the Keys |

## 8. Signs

```text
Sandpiper Isle. Private. Armed response.
Residents, guests and staff. In that order.
Isle Drive
Windward Way
Doldrums Drive
No stopping. Guards are armed and bored.
Bellweather
Deliveries at the rear. The rear is also private.
Glow Camp: arrive tired, leave lighter
Glow Camp: silence is included
SPF 1000: the sun can't see you
Please respect the flamingos. They were here second.
Maison Sable: by appointment or by accident
Sandpiper Bridge: no fishing from the bridge
Marsh Road: turtles crossing. They have right of way.
Mangrove Tunnel: lights on
Manatees seen today: 3
Marsh Road: no dumping. Cars or otherwise.
Bird tower: 96 steps, 41 species
The Longspan: 1.6 km. No petrol. No shade. Worth it.
Welcome to the Pelican Keys. Set your watch back.
Flip-Flop Key: shoes optional
The Sweaty Flamingo: cold drinks, warm chairs
Leave a flip-flop, take a flip-flop
The Hump: check your speed. Then check it again.
Tackle Key: what boat? Nobody saw a boat.
Bait & Ballistics: the fish won't know what hit them
Reel Estate: bait and houses
Boat ramp: no launching after midnight. Ha.
The Stilt House: no cops, no cameras, no tabs
Humid Lager served here
Slow the fuck down. Kids and drunks.
Low Tide Bar: open when the tide is
Houseboat for sale. Floats.
The Fishing Gap: mind your back cast
Lime Key: limes, pie, science
Key Lime Crimes: guilty
Tide Pool lab: please don't tap the glass
Last Key: end of the road
You made it. Turn round slowly.
```

## 9. Things to find

Flamingos, all tier B:

| # | Seed | Why here |
|---|---|---|
| F1 | `(-930, 850)` | Middle of Bellweather's helipad. |
| F2 | `(-1090, 620)` | Among the real flamingos: the one that stays put. |
| F3 | `(-1350, 600)` | On the Glow Camp stage, on a yoga mat. |
| F4 | `(-1100, 432)` | On the island gatehouse roof. |
| F5 | `(-1950, 264)` | Nailed to the flip-flop post beside The Right One. |
| F6 | `(-2400, 646)` | Under the Stilt House, on a pile. Come by boat. |
| F7 | `(-2520, 832)` | On the roof deck of the houseboat that is for sale. |
| F8 | `(-3100, 1200)` | On the lighthouse gallery at 24 m. |
| F9 | `(-2400, -700)` | Hanging in the roof of the Mangrove Tunnel. |
| F10 | `(-2700, -1000)` | Top deck of the bird tower. |

Big Air ramps:

- R1: The Hump, `(-2136, 407)`, either way along the Longspan. Tier B.
- R2: Bellweather's terrace, `(-1000, 820)`, heading south over the pool and the seawall. Tier C.
- R3: The Last Jump, `(-3125, 1222)`, south-west off the end of Last Key. Nothing to land on. Tier B.

Postcards:

- P1: The Keys in a line to the lighthouse. Stand on the Hump at `(-2136, 407)`, look south-west at sunset. Tier B.
- P2: White roofs over hedges. Stand at the crest of the Sandpiper Bridge, `(-1100, 280)`, look south. Tier B.
- P3: The beam. Stand at the Last Key bench, `(-3110, 1215)`, at night. Tier C.

## 10. Checks

1. A scripted drive from `(-2000, 300)` to `(-3100, 1200)` arrives without entering water.
2. The Longspan polyline measures 1,578 m ± 15 from `(-1900, 180)` to `(-3100, 1200)`.
3. Deck height is 16 m ± 0.5 at `(-2136, 407)` and no more than 5 m on any other span.
4. `map.isLand` is true at the five key centres and false at `(-2400, 640)`.
5. A Skipjack can pass under the Sandpiper Bridge at `z = 280`, and a Snowbird only under the Hump.
6. Every Isle lot has a hedge on its road side, and no wall on the Isle is any colour but `#ffffff` or glass.

## New names

- Isle lanes: Windward Way, Zephyr Court, Leeward Lane, Doldrums Drive, Trade Wind Lane.
- Marsh: Tunnel Road, the Tower boardwalk.
- Longspan spans: the Step-Off, the Hump, the Fishing Gap, the Long Reach.
- Landmarks: the flamingo lawn, The Right One, the houseboat marina, the Tide Pool lab, the Last Jump.
- camper, gardener, guard, angler: kinds of people, tier B.
