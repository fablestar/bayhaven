# 02 · World

## The city

**Bayhaven** is a coastal city on a warm, flat, storm-prone bay. Beach along the south, glass towers behind it, a working port to the east, suburbs and an airport to the north, swamp beyond that, and a chain of small islands out in the bay.

Day 1 already built the heart of it: one pastel block on the beachfront with a promenade, a plaza and a rooftop sign. Everything below grows outward from that block. The day 1 block stays where it is, at the map origin, for the whole project.

## Axes and units

Kept exactly as day 1 wrote them, so no existing code moves:

- 1 unit = 1 metre. `y` is up.
- `x` grows to the **east**. `z` grows to the **south**, towards the sea. North is `-z`.
- The sun rises behind the city and sets over the water. That is an art rule (the sunset over the bay is the money shot). Don't "fix" the compass.
- The day 1 central block sits at `(0, 0)`. The beach starts at `z = 50`, the waterline is at `z ≈ 80`.

## Size

| | Value |
|---|---|
| World rectangle | `x` from −3,200 to +3,200 (6.4 km), `z` from −3,520 to +1,280 (4.8 km) |
| Total area | 30.7 km², about 22 km² of land and marsh, the rest bay |
| Chunk size | 160 m × 160 m |
| Chunk grid | 40 columns × 30 rows = 1,200 chunks |
| Chunk index | `cx = floor((x + 3200) / 160)`, `cz = floor((z + 3520) / 160)` |
| Street block pitch | 80 m in grid districts (66 m block + 14 m street, the day 1 numbers) |
| Flat-out drive, west edge to east edge | about 2 min 50 s in the day 1 coupe (38 m/s). With traffic and corners, 5–6 minutes. |
| Walk across downtown | about 12 minutes at jogging pace |

## Map

One character is 160 m wide and 320 m tall. North is up.

```
        x=-3200        -1600          0          +1600       +3200
z=-3520 GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   G  Mudcat Glades (swamp)
        GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
        GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
z=-2560 MMMMMMMMMMMMMMMNNNNNNNNNAAAAAAAAAAAAAAAA   M  Mallard Greens (suburb, golf)
        MMMMMMMMMMMMMMMNNNNNNNNNAAAAAAAAAAAAAAAA   N  Northgate (strip malls, hospital)
        MMMMMMMMMMMMMMMNNNNNNNNNAAAAAAAAAAAAAAAA   A  Runway Flats (airport, speedway)
z=-1600 ========================================   =  Bayline Expressway (raised)
        hhhhhhhhPPPPPPPDDDDDDDDDDWWWWWWRRRRRRRRR   P  Palma Vieja    D  Meridian (downtown)
        hhhhhhhhPPPPPPPDDDDDDDDDDWWWWWWRRRRRRRRR   W  The Paintworks R  Rustwater (port)
        hhhhhhhhPPPPPPPDDDDDDDDDDWWWWWWRRRRRRRRR   h  Heron Marsh (mangroves)
z=-320  hhhhhhhhhhTTTTTTTTTTTTTTTTTTTTRRRRRRRRRR   T  Tideline (beachfront, day 1 block at 0,0)
z=0     ~~~~~~~~~~..........*..p......RRRRRRRRRR   .  beach   *  day 1 block   p  Gullwing Pier
z=+320  ~~~~~~~k~~~SSSSS~~~~~~~p~~~~~~~~~~~~~~~~   S  Sandpiper Isle
        ~~~~kk~~~~~SSSSS~~~~~~~~~~~~~~~~~~~~~~~~   k  Pelican Keys (joined by the Longspan)
z=+960  ~kk~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   ~  the bay
```

## Districts

Ten districts. Each has its own palette, building kit, traffic mix, people and sound, so you know where you are from a single screenshot. Bounds are `[x0, x1] × [z0, z1]` in metres.

### 1. Tideline (the beachfront)
- **Bounds:** `[-1600, 1600] × [-320, 130]`. 3.2 km of beach.
- **Look:** pastel art-deco hotels of 2–6 floors, rounded corners, neon trim, shop signs, palm rows. This is the day 1 style and the style of the game's key art.
- **Landmarks:** the day 1 block and plaza with the Bayhaven rooftop sign · Heron Walk, the palm promenade along `z = 44–50` · Gullwing Pier at `x = 600`, 350 m long, with a ferris wheel and Coral Arcade at the end · Hotel Alba, the tallest pink hotel on the strip · lifeguard huts every 300 m, each a different colour · Pelican Rest, the trailer park where the story starts, at `(-1250, -220)` · Yacht Club Bayhaven and the west marina at `(-1150, 90)`, beside the bridge to Sandpiper Isle.
- **Traffic:** convertibles, scooters, taxis, the odd sports car. **People:** tourists, joggers, skaters, sunbathers.
- **Sound:** waves, gulls, music leaking from bars.

### 2. Meridian (downtown)
- **Bounds:** `[-800, 800] × [-1440, -320]`.
- **Look:** glass and pastel-concrete towers, 60–220 m, on podiums with plazas. Cool blues and whites by day, lit window grids by night.
- **Landmarks:** the **Meridian Spire** at `(52, -900)`, 260 m, the tallest thing on the map and the story's last location. It sits at the top of Coral Boulevard, so you see it from the day 1 block looking north · Coral Boulevard itself, the main street, 30 m wide with a palm median, from the beach to the Spire · City Hall plaza with a fountain · the Twin Sails, two leaning towers joined by a skybridge · Bayfront Park.
- **Traffic:** sedans, taxis, buses, vans. **People:** office workers, couriers, tourists.
- **Sound:** city hum, crossing beeps, distant sirens.

### 3. Palma Vieja (the old quarter)
- **Bounds:** `[-2000, -800] × [-1440, -320]`.
- **Look:** two- and three-floor shop-houses in hot colours (mango, turquoise, rose, lime), hand-painted signs, murals, awnings, tiled roofs, strings of lights across the streets.
- **Landmarks:** Domino Park, a shaded square where Rafa holds court · the bell tower of the old mission church · Ventanita Rosa, a coffee window with a queue at all hours · the Mercado, a covered market · a wall of murals 200 m long.
- **Traffic:** lowriders, vans, pickups, scooters. **People:** families, old men at tables, street vendors.
- **Sound:** radios in doorways, dominoes clacking, church bell on the hour.

### 4. The Paintworks (arts and nightlife)
- **Bounds:** `[800, 1800] × [-1440, -320]`.
- **Look:** low brick and metal warehouses covered edge to edge in generated murals, shipping-container bars, rooftop clubs with moving lights.
- **Landmarks:** the old paint factory with three painted chimneys · Humidity, a nightclub with a light rig on the roof · Wet Paint Alley, a pedestrian lane of murals · a food-truck yard.
- **Traffic:** sports cars at night, vans by day. **People:** clubbers at night, artists and photographers by day.
- **Sound:** bass through walls at night, spray cans and a distant saw by day.

### 5. Rustwater (the port)
- **Bounds:** `[1800, 3200] × [-1600, 200]`, plus the strip beside the port `[1600, 1800] × [-320, 130]`.
- **Look:** container stacks in six colours, gantry cranes, warehouses, rail tracks, rust and safety yellow. Sodium-orange lights at night.
- **Landmarks:** four gantry cranes, 70 m tall, working over a moored container ship · the cruise terminal with a white cruise ship · the shipyard dry dock · a scrapyard with a car crusher · fuel tanks painted like beach balls.
- **Traffic:** box trucks, pickups, forklifts. **People:** dock workers in hi-vis.
- **Sound:** ship horns, crane alarms, clanking.

### 6. Northgate (the strip)
- **Bounds:** `[-800, 700] × [-2700, -1500]`. The east edge is Route 44, so the road and both its kerbs belong to Northgate.
- **Look:** wide six-lane roads, strip malls with huge parking lots, motels with pools, drive-throughs, tall pole signs, billboards for lawyers.
- **Landmarks:** Galleria Flamingo, the mall, with a giant flamingo on the roof · Bayhaven General Hospital (where you wake up) · the Sheriff's headquarters, which is also a TV studio with a satellite dish · the Starlite, a drive-in cinema showing a looping film made of shapes · a used-car lot with an inflatable tube man.
- **Traffic:** everything, slowly. **People:** shoppers, mascots waving signs.
- **Sound:** traffic wash, tannoy jingles.

### 7. Mallard Greens (the suburb)
- **Bounds:** `[-3200, -800] × [-2700, -1500]`.
- **Look:** curving streets and cul-de-sacs, near-identical houses in four approved colours, perfect lawns, lakes with fountains, a golf course through the middle. Gated, with a guard hut.
- **Landmarks:** the homeowners' clubhouse with a clock that is always right · the 18-hole golf course · the model home for "Bayhaven Tomorrow" · a lake with one very large alligator.
- **Traffic:** golf carts, SUVs, sedans. **People:** retirees, power-walkers, a man measuring grass with a ruler.
- **Sound:** sprinklers, birds, a distant leaf blower that never stops.

### 8. Runway Flats (airport and speedway)
- **Bounds:** `[700, 3200] × [-2700, -1600]`.
- **Look:** flat, wide and windy. Terminal glass, hangars, long fences, parking garages. The speedway is a bright oval of grandstands.
- **Landmarks:** Bayhaven International: a terminal, a control tower and an 1,800 m runway you can drive on · the Speedbowl, a banked oval where Mags used to race · a row of rental-car lots · a plane on a pole outside a diner.
- **Traffic:** taxis, buses, vans. **People:** travellers with wheeled bags.
- **Sound:** jets overhead every few minutes, wind.

### 9. Mudcat Glades (the swamp)
- **Bounds:** `[-3200, 3200] × [-3520, -2700]`.
- **Look:** water channels through sawgrass, cypress domes, wooden boardwalks, shacks on stilts, one long two-lane road (Mudcat Road). Green and brown by day, fog at dawn, fireflies at night.
- **Landmarks:** Big Earl, a 30 m roadside alligator statue you can drive through · Captain Nilda's airboat dock · a fish camp on stilts · an abandoned theme park entrance swallowed by vines · a trailer with a satellite dish bigger than the trailer.
- **Traffic:** pickups, swamp buggies, airboats in the channels. **People:** few. Alligators, herons.
- **Sound:** cicadas, frogs, an airboat far away.

### 10. The Islands (Sandpiper Isle and the Pelican Keys)
- **Bounds:** Sandpiper Isle `[-1500, -700] × [420, 900]`, joined to Tideline by a 300 m bridge at `x = -1100`. The Pelican Keys are five islets on a line from `(-2000, 300)` to `(-3100, 1200)`, joined by the **Longspan**, a 1.6 km causeway.
- **Look:** Sandpiper Isle is white mansions, hedges, private docks and yachts. The Keys are sand, sea-grape, pastel shacks, tiki bars and boats on trailers.
- **Landmarks:** the Bellweather mansion with a helipad · Glow Camp, a wellness retreat of white tents · the Longspan at sunset (the best drive in the game) · a lighthouse on the last key · a bar on stilts in the water.
- **Traffic:** convertibles and limos on the Isle, pickups and scooters on the Keys. Boats everywhere.
- **Sound:** rigging clinking on masts, steel drums from the stilt bar.

### Heron Marsh (filler, not a district)
`[-3200, -2000] × [-1440, -320]` and the coast west of Tideline. Mangroves, a kayak trail, one road to the Keys. Cheap to draw, and it gives the map a green edge.

## Roads

| Kind | Width | Lanes | Speed limit | Where |
|---|---|---|---|---|
| Expressway | 26 m, raised 8 m | 3 each way | 110 km/h | Bayline Expressway along `z = -1480`, `x` from −3,000 to +3,000. Route 44 runs north from it at `x = 700` to the airport and the Glades. |
| Boulevard | 30 m | 3 each way plus median | 70 km/h | Coral Boulevard at `x = 52`, from the beach to the Spire. Heron Walk Drive along the beach at `z = 37`. Both stay 14 m wide (the day 1 street) where they pass the day 1 block, so the block is never cut. |
| Avenue | 22 m | 2 each way | 60 km/h | Every 320–400 m in grid districts. Traffic lights at avenue crossings. |
| Street | 14 m | 1 each way | 40 km/h | The 80 m grid. The day 1 streets are these. |
| Suburb lane | 10 m | 1 each way | 30 km/h | Curved, in Mallard Greens. Built from splines. |
| Dirt track | 6 m | 1 | none | Glades and Keys. Lower grip. |
| Causeway | 14 m | 1 each way | 80 km/h | The Longspan and the Sandpiper bridge. |

Ramps join the expressway at `x = -2400, -900, 700, 2200`. Raised roads use two **deck levels**: every vehicle and person carries `level` (0 = ground, 1 = deck) and switches only on a ramp. Collision and height lookups filter by level. That is the whole overpass system.

Roughly 250 km of drivable road at full size (worked out from the grid pitch; measured properly once the generators exist).

## Water

- The bay is one shader plane (day 1's sea, extended). The shoreline comes from the map's land mask, so foam follows any coast, not only the straight day 1 beach.
- Depth: wading to 1.2 m, swimming beyond. Cars stall at 0.8 m and drift to shore.
- Canals in the Glades and lakes in Mallard Greens are the same water at a different height and colour.
- Boats spawn at marinas: six on day 7, up to 14 at full size. See `04-systems.md`.

## How the map is stored

One source of truth: `src/world/map.js` plus one file per district in `src/world/zones/`.

```js
// src/world/zones/meridian.js
export default {
  id: 'meridian', name: 'Meridian',
  bounds: { x0: -800, x1: 800, z0: -1440, z1: -320 },
  seed: 4102,
  roads: { grid: { pitchX: 80, pitchZ: 80, avenuesEvery: 4 }, extra: [/* splines for boulevards */] },
  lots: 'grid',                 // or 'spline' (suburb), 'free' (glades)
  generator: 'meridian',        // src/world/gen/meridian.js
  landmarks: ['spire', 'cityhall', 'twinsails'],   // src/world/landmarks/<id>.js
  traffic: { sedan: 4, taxi: 3, bus: 1, van: 2 },
  peds: { office: 5, courier: 1, tourist: 2 },
  ambience: 'city',
  palette: 'meridian',
};
```

`map.js` loads every zone file (`import.meta.glob`), and answers the questions the rest of the game asks:

- `map.districtAt(x, z)` → zone id
- `map.isLand(x, z)`, `map.depthAt(x, z)`
- `map.heightAt(x, z, level)` → ground height (curbs, beach slope, ramps)
- `map.lotsInChunk(cx, cz)` → the building lots whose centre is in that chunk
- `map.roadsInChunk(cx, cz)` → road pieces, for meshes, the lane graph and the minimap

A **lot belongs to the chunk that holds its centre.** Lots may hang over a chunk edge; chunks are only a loading unit, not a wall.

## Streaming

The player never sees a loading screen. Chunks build and drop as you move.

| Ring | What is drawn | Laptop radius | Phone radius |
|---|---|---|---|
| **LOD0** | Full detail: windows, shop fronts, signs, props, collision | 2 chunks (5 × 5 = 25 chunks, 800 m across) | 1 chunk (3 × 3 = 9 chunks, 480 m across) |
| **LOD1** | A shell per chunk (building boxes with a window texture, no props, no collision), drawn merged per 4 × 4 group of chunks so a group is one draw call | 6 chunks | 4 chunks |
| **LOD2** | One skyline mesh for the whole city, built once at start: every tower over 30 m and every landmark outline | whole map | whole map |

Rules:

- **Build budget:** chunk generation is cut into slices of at most 4 ms per frame. From day 8 the heavy part moves to a Web Worker (the mesh builder is plain arrays, so it moves cleanly).
- **Order:** chunks ahead of the player's velocity build first.
- **Hysteresis:** a chunk drops only when it is one ring further out than where it would load, so driving along a boundary doesn't thrash.
- **Triangles:** a LOD0 chunk averages 14,000 triangles on laptop (20,000 cap downtown) and 8,400 on phone (windows become texture). A LOD1 chunk is 600 or fewer. The skyline is 20,000 or fewer.
- **Fog** hides the ring edges: 300–1,400 m on laptop, 150–700 m on phone, coloured by the sky as day 1 does.
- **Seeded:** each chunk's random numbers come from `hash(worldSeed, cx, cz)`, so the city is identical on every device and in every screenshot.
- **Hero lots:** hand-written pieces (the day 1 block, each landmark) are lots like any other. The generator calls their file instead of the district kit.
- **Disposal:** geometry and collision for a dropped chunk are freed and their arrays go back to a pool.

## How the map grows

| Build | Playable area |
|---|---|
| Day 1 | The hero block, 200 × 180 m |
| Day 2 | All of Tideline: 3.2 km × 0.45 km |
| Day 4 | Plus Meridian, Palma Vieja, The Paintworks and Rustwater: about 5.2 km × 1.6 km |
| Day 6 | Plus the Expressway, Northgate and Mallard Greens (the story needs the suburb on day 7) |
| Day 7 | Plus the bay itself (boats) |
| Day 8 | Plus Runway Flats, Mudcat Glades and the Islands: the full 6.4 × 4.8 km |

Where the map ends on a given day, the road is closed with the striped barriers day 1 invented. Past the barriers the LOD2 skyline still shows the city that is coming.

At the low compute level the map stops at Tideline and the barriers stay up. That is said plainly in the changelog.

## Going deeper

- Every district has its own file in `bible/world/`: neighbourhoods, block recipes, every street name, landmarks as parts lists, places, street life by the hour, signs.
- `bible/00-canon.md` fixes the shared grid, the named roads and every landmark's seed position.

## Beyond the city: Marlin County (full vision, tier D)

The city above is the game through its first month. Around it the full vision adds a ring of seven zones, taking the world to 12.8 × 9.6 km (`x` −6,400 to 6,400, `z` −6,400 to 3,200; 4,800 chunks). Nothing about streaming or zone files changes with size.

| Zone | What it is |
|---|---|
| Driftwood | A sleepy beach town down the coast, past the Keys |
| Citrus Flats | Groves, ranches and the one-street town of Tangelo |
| Lake Minnow | A wide shallow lake with fish camps and a mermaid show |
| North Glades | Deeper swamp, a lost airstrip, the county work farm |
| Cape Calamity | A barrier island with a rocket launch site. Launches on Saturdays, usually scrubbed. |
| The Reef | Open water, shipwrecks, and The Rig, a platform turned nightclub |
| East Bay | Shipping lanes and the ferry route to the Cape |

Bounds are in the canon; layouts are in `bible/world/county.md`. None of it is built before release.
