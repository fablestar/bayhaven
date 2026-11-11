# Bible · world · Palma Vieja

Palma Vieja is the old quarter: 1.2 by 1.1 km of two- and three-floor shop-houses in hot colours, west of downtown. Rafa Montalvo runs it from a table in Domino Park, and the early story jobs start here. Below: the grid, the building kit, each landmark as a parts list, street life, sound, signs and things to find.

Tier: A for the grid, the kit recipes marked A, street life and the canon A landmarks. Everything else carries its own tag.

Bounds `[-2000, -800] × [-1440, -320]`. Sizes are width (x) × depth (z) × height in metres; footprints are width × depth. Every `(x, z)` is a seed. Hour bands: dawn 05:00 to 08:00, day 08:00 to 17:00, golden 17:00 to 21:00, night 21:00 to 05:00.

## 1. Feel

Low, loud and warm. Mango, turquoise, rose and lime walls stand shoulder to shoulder, each with an awning, a hand-painted sign and somebody sitting outside. Bulbs hang across the streets. Half the people here are not going anywhere: they are at a table, in a doorway or in a queue for coffee. The traffic is slow on purpose. Nothing is taller than the church bell tower, and downtown's glass shows over the roofs to the east. It is also the one district that polices itself. Whatever moves through here goes past Rafa's table first: untaxed liquor, cigarettes, car parts, loans. Nobody sells drugs on these streets, because his mother said so.

Any screenshot of Palma Vieja must show:

1. Two neighbouring walls in two different hot colours.
2. A string of bulbs across the street, or a mural.
3. Someone sitting down.

## 2. Neighbourhoods

The grid is the shared one: streets every 80 m and 14 m wide, avenues 22 m. A block is 66 × 66 m, or 62 m on a side that faces an avenue. Every block is cut in two by a 4 m alley along its east-west centre line, so lots sit in two rows, each 27 m deep behind a 4 m sidewalk.

Height rule: ground floor 3.6 m, upper floors 3.0 m, parapet 0.6 m. Three floors is 10.2 m. No kit building passes 11 m.

### The kit

|id|Recipe|Footprint|Floors|Walls|Roof|Street level|Tier|
|---|---|---|---|---|---|---|---|
|P1|Shop-house|8 to 12 × 20|2 to 3|mango `#ffb347`, turquoise `#2ec4b6`, rose `#ff6f91`, lime `#b5e48c`|flat behind a 1.2 m tiled strip `#a8553a`|striped awning 1.5 m deep, painted board 5×1.2, folding doors, two chairs, a balcony rail above|B|
|P2|Courtyard house|16×22, a U round a 6×8 patio|1 to 2, floor 3.2|the same four, or `#fdf6ea` with a 1 m base band in one of them|tiled on all sides `#a8553a`|barred window boxes, one step, a laundry line across the patio, a potted palm|B|
|P3|Corner store|14×14, the corner cut at 45 degrees|2|rose `#ff6f91` or mango `#ffb347`|flat, tiled strip|corner door, wraparound awning, fruit crates in three colours, an ice chest, a bench|B|
|P4|Workshop|20×24|1, floor 5.0|lime `#b5e48c` or turquoise `#2ec4b6` at 85% brightness|flat `#6f6a78`, or three sawteeth|two roller doors 4×4, tyre stacks, barrels, a car on stands, a painted price list|B|
|P5|Arcade building|30×20|3|rose `#ff6f91`, mango `#ffb347`|flat, tiled strip, a clock box|a covered walk 3 m deep on columns 0.8×3.6 every 5 m, café tables under it, a long balcony|B|
|P6|Walled yard|20×20 lot, wall 2.4 m|none|one mural from the lot's seed, edge to edge|a tin shelter 6×5×2.6|a 3 m gate, banana plants, one parked car|B|

`07-art-and-audio.md` gives no tile colour, so tiles reuse brick `#a8553a`. No two neighbours share a wall colour. Until a B recipe is built, its share goes to P1.

A bulb string is 12 warm bulbs `#fff2cc` across the street at 6 m, sagging 0.8 m in the middle.

### Block recipes

|Neighbourhood|Bounds|Lots (frontage × depth)|Recipes, share of lots|Parking|Per 100 m of street|
|---|---|---|---|---|---|
|La Plaza|x -2000 to -1100, z -1100 to -600|8 to 12 × 27; 30×20 on sides facing the park|P1 45%, P5 30%, P3 15%, P6 10%|kerbside; none round Domino Park|4 shade trees, 6 bulb strings, 3 benches, 2 vendor carts, 1 domino table|
|Calle Mural|x -1100 to -800, z -1100 to -600|8 to 12 × 27|P1 55%, P6 20%, P3 15%, P5 10%|kerbside; one car in each yard|3 palms, 6 bulb strings, 4 café tables, 2 record crates, 1 ladder with paint pots|
|Los Patios|z -1440 to -1100|16×27|P2 60%, P1 15%, P3 15%, P6 10%|kerbside, and one car per 30 m of alley|5 fruit trees, 2 bulb strings, 4 laundry lines, 3 plastic chairs, 2 bicycles|
|El Bajo|z -600 to -320|20×27|P4 45%, P1 25%, P6 20%, P3 10%|kerbside; yards hold cars on stands|2 trees, 1 bulb string, 4 tyre stacks, 3 barrels, 1 engine hoist, 2 pallets|

## 3. Streets

- West of Founders Avenue the numbered streets are signed Calle Uno to Calle Trece. Commerce Way, Tower Way and Union Avenue keep their names.
- The east bound (x = -800) is 108 m west of Founders Avenue. The strip between belongs to Meridian.
- Mangrove Avenue is the west edge. Marsh Road leaves it at (-1972, -357).
- Alleys are one-way, limited to 20 km/h, and have no names.
- Closed or covered pieces: Calle Mamey from Calle Seis to Calle Siete (Domino Park). Calle Clavel runs under the Mercado roof from Calle Cinco to Calle Seis. Calle Cinco and Calle Seis pass through openings in the mural wall.
- The expressway ramp at x = -900 leaves Calle Trece between Calle Orquídea and Calle Papaya.

### Canon roads

|Line|Name|Notes|
|---|---|---|
|x = -1972|Mangrove Avenue|avenue|
|x = -1652|Avenida Campana|avenue|
|x = -1332|Avenida Mercado|avenue; passes Domino Park|
|x = -1012|Avenida Rosa|avenue; the mural wall|
|z = -357|Flamingo Avenue|avenue; ends at Mangrove Avenue|
|z = -437, -517, -597|Calle Uno, Calle Dos, Calle Tres| |
|z = -677|Commerce Way|avenue|
|z = -757, -837, -917|Calle Cinco, Calle Seis, Calle Siete| |
|z = -997|Tower Way|avenue|
|z = -1077, -1157, -1237|Calle Nueve, Calle Diez, Calle Once| |
|z = -1317|Union Avenue|avenue|
|z = -1397|Calle Trece| |

### New names: fruits and flowers

Five are the canon's (Guayaba, Mamey, Jazmín, Azucena, Níspero). All run from Flamingo Avenue to Calle Trece.

|Line|Name|Line|Name|
|---|---|---|---|
|x = -1892|Calle Caimito|x = -1412|Calle Mamey|
|x = -1812|Calle Azucena|x = -1252|Calle Guayaba|
|x = -1732|Calle Guanábana|x = -1172|Calle Gardenia|
|x = -1572|Calle Níspero|x = -1092|Calle Jazmín|
|x = -1492|Calle Clavel|x = -932|Calle Orquídea|
| | |x = -852|Calle Papaya|

## 4. Landmarks

|Landmark|id|Seed|Footprint|Height|Tier|
|---|---|---|---|---|---|
|Domino Park|`domino-park`|(-1400, -880)|142×66|trees 9 m|A|
|The bell tower|`bell-tower`|(-1340, -960)|church 48×16, tower 8×8|34 m|A|
|The Mercado|`mercado`|(-1500, -800)|80×66|12 m|B|
|The mural wall|`mural-wall`|Avenida Rosa, z -900 to -700|200 m long|7 m|A|
|Ventanita Rosa|`ventanita-rosa`|(-1020, -640)|12×14|7 m|A|
|Lava Abuela kitchen|`lava-abuela`|(-1700, -480)|24×30|chimney 12 m|B|
|Flounder Works|`flounder-works`|(-1250, -420)|30×24|7 m|C|
|Arco del Dominó|`domino-arch`|(-1332, -700)|26×3|10 m|B|
|Teatro Marea|`teatro-marea`|(-984, -720)|24×30|blade sign 18 m|B|
|Radio Palma studio|`radio-palma`|(-890, -960)|12×20|mast 22 m|B|
|El Tanque|`el-tanque`|(-1800, -1250)|8×8|22 m|C|
|El Gallo|`el-gallo`|(-1188, -1018)|14×14|12 m|C|

### Domino Park
- Silhouette: a block of dark round trees with bulbs strung between them.
- Parts: merged lot x -1485 to -1343, z -910 to -844, paving `#e9b9a2`, a 0.6 m wall round it with four gates. Twelve shade trees: trunk 0.5×0.5×4, canopy box 6×6×5 `#2f9e58`. A tin pergola 30×8×3.2 `#2ec4b6` along the north side over eight tables 1.2×1.2×0.8, four stools each. Rafa's table is at the seed, under the largest tree, with a parasol `#ff6f91`. A chalk league board 3×2. On Saturday from 08:00 to 13:00, sixteen stalls 3×2×2.4 with striped tops.
- Night: bulbs tree to tree, one lamp over each table.
- Use: Rafa gives Hot Sauce (B) and Hurricane Party (C) here. The domino league is on Tuesday at 18:00. Debts are settled at his table, and the table beside it is always two of his men with pistols under their shirts.

### The bell tower
- Silhouette: one white tower with an open top, the tallest thing in the quarter.
- Parts: the block north of the park. Nave 40×16×12 `#fdf6ea`, x -1400 to -1360, tiled roof `#a8553a`. Tower 8×8×34 `#fdf6ea` at (-1350, -960) with three bands `#ffb347`. The top 6 m is open on four sides and holds a bell box 2×2×2 `#ffc300`. A tiled pyramid cap. A forecourt 20×14 with two benches.
- Night: the open top lit warm from inside.
- Use: the bell strikes the hour and is heard for 600 m. Teo can climb the stair to the bell.

### The Mercado
- Silhouette: a wide tin roof with a raised strip down the middle and a painted gable.
- Parts: roof 80×66×0.6 `#2ec4b6` at 8 m on 24 columns 0.6×8, x -1565 to -1485, z -830 to -764. A raised strip 60×10×3 `#ffb347` to 12 m. Open sides. Calle Clavel runs under the east bay. Forty stalls 3×2×2.4 in four rows: fruit crates in three colours, fish on ice, flowers, Hector's butcher counter. A gable board 20×5 reading EL MERCADO on the Calle Cinco side.
- Night: shutters down, six hanging lamps. Box trucks unload from 05:00, and not every crate is on a list.
- Use: Hot Sauce ends at the seed (B). Food. Driving the aisle scatters crates and everybody films. The cold room behind Hector's counter holds Rafa's liquor.

### The mural wall
- Silhouette: 200 m of colour along the avenue with two streets going through it.
- Parts: a wall 0.4 m thick and 7 m tall at x = -1027, the east face of three blocks. Panels of 56, 66 and 50 m, north to south, joined by two lintels 14×0.4×2 over openings 14×5 at Calle Seis and Calle Cinco. One mural from seed 3301 across all of it: birds, fish, waves, suns and hands in the four hot colours on `#fdf6ea`. Tiled coping `#a8553a`. A painter's scaffold 6×1.5×4 that moves 10 m along each day.
- Night: washed from below by sixteen warm floodlights, with a bulb string to the far kerb every 16 m.
- Use: postcard P2. Squawk posts name it.

### Ventanita Rosa
- Silhouette: a rose corner with a hatch in the wall and a line of people.
- Parts: building 12×14×7 `#ff6f91` at (-1031, -640). A hatch 2.4×1.2 in the east wall, 1.1 m up, with a shelf `#fdf6ea`. A striped awning 5×2×0.2. A painted board above, a menu board, a queue rail. Four to nine people queue at every hour.
- Night: one bare bulb over the hatch and a cup outline in pink neon.
- Use: coffee, with no door and no menu screen: sprint stamina is doubled for 2 minutes. You wait 3 s for each person ahead. Push in, and somebody's uncle shows you the pistol in his belt.

### Lava Abuela kitchen
- Silhouette: a lime shed with a brick chimney that puffs.
- Parts: a P4 building 24×30×6 `#b5e48c`. Chimney 1.5×1.5×12 `#a8553a`. A roller door painted with peppers. Pallets of crates with bottle boxes `#ff5a5a`. A loading bay holding a `pompano` in `#ffb347`. Strings of drying peppers. The sign is a volcano wearing glasses.
- Night: warm light at the door, an orange glow at the chimney top.
- Use: Hot Sauce starts here (B). Crates leave for the port twice a week, and not every bottle is sauce.

### Flounder Works
- Silhouette: a turquoise garage with a car held up in the air.
- Parts: garage 30×24×7 `#2ec4b6` at (-1232, -418), two bays, a lift holding a Flounder. A mural of a flatfish on chrome wheels. Three Flounders at the kerb on Calle Guayaba. A hop pad 4×4 in a checker pattern.
- Night: violet, cyan and pink glow under the three parked cars.
- Use: lowrider parts and a hop contest (C). Flounders spawn here. It is the one workshop in El Bajo that has never stripped a stolen car, and says so on the wall.

### Arco del Dominó
- Silhouette: an arch over the avenue with one giant domino at its top.
- Parts: two piers 2×3×8 at x = -1345 and x = -1319. A beam 26×3×2 from 8 to 10 m, `#ffb347`. A double-six tile 6×0.6×3 `#fdf6ea` with twelve black pips at the centre. Clearance is 8 m.
- Night: bulbs along the beam, the tile lit from the front.
- Use: the way in from Commerce Way. Postcard P4.

### Teatro Marea
- Silhouette: a stepped rose front with a tall blade sign.
- Parts: hall 24×30×12 `#ff6f91` facing Avenida Rosa, its parapet stepped in three. A blade sign 2×1×12 from 6 to 18 m reading TEATRO. A marquee 14×4×2 with a line that changes each day from seven fixed strings. A ticket booth 2×2×2.4. It never opens.
- Night: turquoise bulbs chase up the blade. Two letters are out. From Thursday to Saturday the side door opens on Abuela Carmen's card game. No phones, and no arguing with the dealer.
- Use: Teo can reach the roof from the marquee.

### Radio Palma studio
- Silhouette: a turquoise shop-house with a glass box and four horns on its roof.
- Parts: a P1 building 12×20×9.6 `#2ec4b6`, 3 floors. A roof booth 5×4×3 of glass, with El Capitán Memo at a desk as a box figure in a captain's hat. Four horn speakers on the parapet. A lattice mast 2×2×12 to 22 m.
- Night: warm booth, a mango light on the mast.
- Use: within 60 m the station plays aloud, on foot, at full quality.

### El Tanque
- Silhouette: a water tank on legs, painted as a small coffee cup.
- Parts: an 8-sided drum of radius 4 and height 7 `#fdf6ea` with a rose band and a handle box 1×2×3. Four legs 0.6×0.6×15 with cross braces. Three thin steam boxes on top. A ladder up one leg.
- Night: a red lamp on top, a spiral of bulbs up one leg.
- Use: Teo can climb to the rim. Postcard P3.

### El Gallo
- Silhouette: a rooster on a corner roof.
- Parts: a P3 store 14×14×7 `#ffb347`. On its roof a rooster 5 m tall: body 2.4×1.4×2 `#fdf6ea`, five tail boxes in the four hot colours, a comb `#ff5a5a`.
- Night: unlit.
- Use: it turns to face the nearest horn within 60 m. The store sells food.

## 5. Places of use

Shops and properties listed in `04-systems.md` are tier A. A door goes on a kit building until its landmark is built.

|Place|Kind|Seed|Tier|
|---|---|---|---|
|Ventanita Rosa|coffee|(-1020, -640)|A|
|Flat over the bakery|property, $35,000, 2 slots|(-960, -800)|A|
|Second Wind Thrift|clothes|(-1130, -720)|A|
|Storm Mart|life vest, flares, noodles|(-1600, -1180)|A|
|Birdbath Car Wash|hand car wash|(-1450, -478)|A|
|Domino Park, Rafa's table|mission giver|(-1400, -880)|A|
|Repo Woman car 2|a Mullet in an alley|(-1130, -557)|A|
|Bay Cab rank|taxi job|(-1343, -880)|A|
|Mercado stalls|food|(-1530, -797)|B|
|Pan Comido|food; the bakery under the flat|(-960, -800)|B|
|Frond Memories|florist|(-1120, -880)|B|
|Barbería El Remolino|barber|(-1210, -640)|B|
|Pelican Fuel|petrol|(-1930, -400)|B|
|Okafor & Daughters|rival sauce kitchen, Hot Sauce|(-900, -478)|B|
|Bus stops, 3|Route 4 on Commerce Way at Mangrove Avenue (-1972, -677), the Mercado (-1500, -677) and Ventanita Rosa (-1012, -677); Route 7 also calls at Mangrove Avenue|(-1012, -677)|B|
|Abuela Carmen's porch|House Rules chain|(-1450, -1200)|C|
|Flounder Works|lowrider parts|(-1250, -420)|C|

## 6. Street life

Traffic weights by vehicle id. `taxi` is the Bay Cab version of `tarpon`. An id that is not built yet gives its weight to `tarpon`. Traffic here holds 30 km/h on streets.

|id|dawn|day|golden|night|
|---|---|---|---|---|
|flounder|1|3|4|3|
|mullet|3|3|2|1|
|pompano|3|3|1|0|
|pinfish|2|3|3|1|
|tarpon|2|2|2|2|
|possum|2|2|2|1|
|snook|1|2|1|1|
|hogfish|3|1|0|0|
|manatee|1|1|1|0|
|ibis|0|1|2|1|
|taxi|0|1|1|2|
|conch|0|1|1|0|

People weights, and how much of the people cap is in use. `family` and `vendor` are tier B kinds; until then their weights go to retiree and tourist.

|kind|dawn|day|golden|night|
|---|---|---|---|---|
|retiree|4|4|4|1|
|family|1|4|4|0|
|vendor|2|3|2|0|
|tourist|0|3|3|1|
|office worker|2|1|1|0|
|jogger|1|0|1|0|
|clubber|0|0|1|2|
|cap in use|50%|100%|130%|40%|

Half the people here are in the hang-out state at any moment, the highest share in the city: at tables, on doorsteps, in the coffee queue.

Ambient vignettes (tier B):

|#|Where|When|What you see|
|---|---|---|---|
|1|(-1532, -797)|05:30|Hector rolls up his shutter. A crate tips. Under forty limes there are forty cartons of cigarettes.|
|2|(-1020, -636)|06:00|Nine people queue for coffee. Each downs a tiny cup in one go and walks off faster.|
|3|(-1350, -960)|on the hour|The bell rings. Every gull on the church roof lifts off, circles once and lands.|
|4|(-1024, -790)|11:00|A painter on the scaffold fills three bullet holes, steps back and paints a fish over them.|
|5|(-1400, -880)|10:00 to 20:00|A player slams the last tile. The loser says "hijo de puta" and counts out notes without being asked.|
|6|(-1414, -877)|15:14|The domino players lift their table, carry it under the pergola and keep playing.|
|7|(-1245, -425)|16:00|A Flounder hops at the kerb. A hubcap comes off and rolls into a drain.|
|8|(-1600, -1157)|19:30|Two neighbours pass a cooking pot across the street on a laundry-line pulley.|

After dark (tier B):

|Where|Who runs it|What happens|
|---|---|---|
|Domino Park|Rafa Montalvo, for Abuela Carmen|Loans, favours and judgments at table one from 09:00 to 22:00.|
|The Mercado at dawn|Rafa's drivers|Untaxed liquor and cigarettes come in under the fruit at 05:00.|
|El Bajo workshops|crews who pay Rafa|A stolen car is a bare shell within the hour. After 23:00 every yard has a man with a shotgun, and a stranger gets one question.|
|Teatro Marea, side door|Abuela Carmen|Cards, Thursday to Saturday. The house does not lose.|
|Calle Papaya and Calle Orquídea|Okafor & Daughters, pushing in from Founders Avenue|Rammed vans and broken windows. About twice a year somebody is shot.|
|Los Patios|every doorstep|The safest streets in the city at night. The Undertow sells nothing west of Founders Avenue. The last man who tried is the reason.|

Parked cars:

- Kerbs fill to 45%, the highest in the city. Half the parked cars are `flounder`, `possum` or `ibis`.
- In alleys, cars park with two wheels on the sidewalk.
- One kerb space in twelve holds a vendor cart instead of a car.
- El Bajo's yard cars sit on stands with no wheels. They are props and cannot be driven. Half of them were somebody's this morning.
- On Sunday everything is parked by 15:00 and the fill is 60%.

## 7. Sound bed

|Layer|Plays|Tier|
|---|---|---|
|Doorway radios: Radio Palma's current song, low-passed at 600 Hz, one source for each open shop|08:00 to 23:00 within 20 m of a P1 or P3 door|A|
|Dominoes: 3 to 8 clicks a second, a slam every 20 to 40 s, then a burst of voice blips|10:00 to 22:00 within 60 m of Domino Park|A|
|Church bell: an FM bell, one strike for each hour on a 12-hour count|on the hour, heard for 600 m|A|
|Rooster: three rising chirps|05:30 to 07:00 in Los Patios|B|
|Kitchen hiss: band-passed noise with pops|11:00 to 14:00 and 18:00 to 21:00 near patios and the Mercado|B|
|Workshop: a saw burst of 2 to 5 s, then a hammer in threes|08:00 to 17:00 in El Bajo|B|
|Evening guitar: slow single plucks|19:00 to 23:00 in Los Patios|B|
|One shot, then every doorway radio turned down for 10 s|at most once a night, in El Bajo|B|

## 8. Signs

Signs with canon names are tier A. Signs with new names are tier B. The neon sign atlas draws in capitals, as day 1 does.

Shop signs and painted wall adverts:

```text
Ventanita Rosa
Cafecito. One Size: Small.
Lava Abuela
El Mercado
Hector: Carnes
Flounder Works
Pan Comido
Radio Palma
Teatro
Frond Memories
Barbería El Remolino
Second Wind Thrift
Storm Mart
Birdbath Car Wash: Lavado A Mano
Pelican Fuel
Okafor & Daughters Pepper Sauce
El Gallo: Frutas, Hielo, Jugos
Domino Park
Bay Cab
Tome Fizzy Lizard
Humid Lager
We Deliver With Pelican Eats
```

Painted words and notices:

```text
Abierto
Cerrado
Se Vende
Hoy No Se Fía. Ask Rafa.
No Estacionar. Yes, You, Cabrón.
Cuidado Con El Gallo
League Night Tuesday. Bring Your Own Luck.
No Standing On The Tables
Farmers' Market, Saturday At 8
Wet Mural
Bayhaven Tomorrow? Vete A La Mierda.
Closed For Renovation Since Opening Night
Rafa Says No Parking
```

Bumper stickers:

```text
Slower Than You, On Purpose
My Other Car Also Hops
Honk And The Rooster Looks
Abuela Is Watching
Touch This Car And Rafa Hears About It
```

## 9. Things to find

Flamingos: 10, all tier B. First picks for the tier A set of 40: F1 to F4.

|#|Seed|Tier|Why here|
|---|---|---|---|
|F1|(-1392, -872)|B|Under Rafa's tree. He acts as if it is not there.|
|F2|(-1024, -812)|B|At the foot of the mural wall, in front of a painted flamingo.|
|F3|(-1016, -652)|B|At the back of the coffee queue, waiting its turn.|
|F4|(-1350, -948)|B|On the church forecourt, by the tower door.|
|F5|(-1532, -780)|B|On a Mercado fruit stall, among the pineapples.|
|F6|(-1700, -492)|B|In a pepper crate on the Lava Abuela loading bay.|
|F7|(-990, -720)|B|On the Teatro Marea marquee.|
|F8|(-890, -952)|B|On the Radio Palma roof, beside the booth.|
|F9|(-1700, -1275)|B|At the far end of an alley in Los Patios, behind a laundry line.|
|F10|(-1990, -900)|B|On the west verge of Mangrove Avenue, where the city stops and the marsh starts.|

Big Air ramps: 5. First pick for the tier A set of 15: R1.

|#|Seed|Heading|Tier|What it is|
|---|---|---|---|---|
|R1|(-1012, -900)|north|B|A painter's plank ramp at the north end of the mural wall. Clears the Calle Siete crossing.|
|R2|(-1492, -750)|north|B|A loading ramp at the Mercado's south door. You fly the length of the aisle.|
|R3|(-1750, -517)|west|B|A tilted flatbed outside a workshop on Calle Dos. Lands in a pile of tyres.|
|R4|(-1900, -1397)|west|B|A dirt mound where the road works stop on Calle Trece. Lands on Mangrove Avenue.|
|R5|(-1252, -445)|south|C|A kicker on Calle Guayaba by the hop pad. Clears Calle Uno.|

Postcard views: 4. First pick for the tier A set of 10: P1.

|#|Stand at|Frame|Tier|
|---|---|---|---|
|P1|(-1321, -850)|The bell tower over the trees of Domino Park|B|
|P2|(-997, -800)|The middle panel of the mural wall under the bulbs at dusk|B|
|P3|(-1800, -1250)|Roofs, laundry and downtown's towers, from the rim of El Tanque|C|
|P4|(-1332, -660)|Avenida Mercado through the Arco del Dominó, looking north|B|

## 10. Checks

1. `map.districtAt` returns `palmavieja` at (-1400, -880), (-1020, -640), (-1990, -330) and (-810, -1430).
2. `bell-tower` is 34 m and nothing else in the district is taller. No kit building is over 11 m.
3. The mural wall is one mural 200 m long at x = -1027 from z = -900 to z = -700, with two openings 14 m wide.
4. Every street in La Plaza and Calle Mural has at least 6 bulb strings per 100 m, all in `#fff2cc`.
5. Domino Park has 8 tables. At least 4 people queue at Ventanita Rosa at every hour.
6. All 11 minor north-south lines carry a Calle name: the road name at (-1092, -500) is Calle Jazmín, and at (-1200, -437) it is Calle Uno. Counts: 10 flamingos, 5 ramps, 4 postcards, 40 sign strings.

## New names

- **Streets:** Calle Caimito, Calle Guanábana, Calle Clavel, Calle Gardenia, Calle Orquídea, Calle Papaya (fruits and flowers).
- **Arco del Dominó:** an arch over Avenida Mercado with a domino tile as its keystone.
- **Teatro Marea:** a closed theatre on Avenida Rosa. Marea means tide.
- **Radio Palma studio:** the building for the canon's station.
- **El Tanque:** an old water tank painted as a coffee cup.
- **El Gallo:** a corner store with a rooster on its roof.
- **Pan Comido:** the bakery under the flat that `04-systems.md` lists as a property.
- **Birdbath Car Wash:** the car wash chain, as in `bible/catalog/shops.md`.
- **The Undertow:** the crew that brings drugs into the city and sells them. It keeps out of Palma Vieja. Tier B.
- **Barbería El Remolino:** a barber. Remolino means whirlwind.
