# Bible · catalog · Clothes

All 150 pieces of clothing in five slots (hat, glasses, top, bottom, shoes), the generator that makes endless floral shirts, and 12 named outfits. Characters are boxes, so a piece of clothing is a cut, one to three colours and a pattern drawn on a canvas. Clothes change no numbers; changing them unseen drops heat by one.

Tier: 40 items are A (the 40 at mid level in `04-systems.md`), 60 are B (100 with the bonus pool), 40 are C and 10 are D.

## Rules

- An outfit is five ids in slot order: hat, glasses, top, bottom, shoes. `none` leaves a slot bare. The sample save in `04-systems.md` shows four ids because it leaves out glasses; the save writes all five.
- Wardrobes are per lead: an item belongs to the lead who bought or earned it. Six saved outfits each.
- Change at any property or Second Wind Thrift. Changing two or more slots while no deputy or camera sees you drops heat by one.
- Prices run from $15 to $4,000. At 100,000 followers every shop takes 10% off.
- **Buy** gives the price and the shop; `-` means it is earned, not sold. A blank **Unlocks** cell means it is on the shelf from the start. Ticket prices: the Coral Arcade prize counter.
- Shops: SW Second Wind Thrift · MS Maison Sable · SM Storm Mart · SV Surf & Vinyl · GF Galleria Flamingo · BB Bait & Ballistics · BE Big Earl's · ST Scale & Tail · GC Glow Camp · CH the Mallard Greens clubhouse · CA Coral Arcade · PB Pill Bill's. Branches are in `shops.md`.

### Cuts

| Slot | Drawn on | Cuts |
|---|---|---|
| hat | one to three boxes on the head box (0.36 across) | `visor` a 0.2 brim and a band · `cap` crown and front brim · `bucket` crown and short brim all round · `straw` crown and a 0.18 brim · `trilby` crown and a 0.08 brim · `peaked` flat crown, dark brim · `flat` · `beanie` · `hood` · `helmet` · `wrap` · `dome` · `tiara` · `band` · `novelty` as noted |
| glasses | the face canvas, across the eye line | `bar` · `rounds` · `teardrops` · `hearts` · `winged` · `shield` one wide lens · `mask` · `patch` · `one round` |
| top | torso and arm boxes | `tee` · `tank` bare arms · `shirt` collar, short sleeves · `open shirt over tank` · `vest` bare arms, open front · `jacket` long sleeves · `hoodie` · `poncho`, `robe` and `long` also cover the top 0.3 of the legs |
| bottom | leg boxes | `shorts` colour the top 45% of each leg · `shorts, long` 60% · `long` all of it · `skirt` joins both legs into one box to the knee |
| shoes | the lowest 0.1 of each leg | `low` · `high` 0.16 · `boot` 0.24 · `sandal` skin between two straps |

### Patterns

A pattern is drawn once on a 64 × 64 cell of the clothes atlas. The first colour is the ground, the rest are the marks. `stripes-h N` and `stripes-v N`: N even stripes. `check N`: an N × N grid. `dots N`: N dots on a jittered grid. `wave N`: N sine bands. `palm N`: N fronds. `rings N`: N wobbly rings. `camo`: 14 blobs. `panel N`: N vertical blocks. `pixels N`: an N × N grid filled at random. `band`, `stripe` and `side stripe`: one line in the second colour. `logo X`: X printed, or the named shape, 24 px tall on the chest. `number N`: N on the back, 40 px tall. `glint`: a white sparkle sprite at night. `floral N`: the generator below.

## The items

| id | Name | Slot | Colours | Cut and pattern | Buy | Unlocks | Tier |
|---|---|---|---|---|---|---|---|
| `visor` | Sun visor | hat | `#fdf6ea,#29e6ff` | visor, band | - | start, Mags | A |
| `cap-bay` | Bayhaven cap | hat | `#ff4fa8,#fdf6ea` | cap, logo Bayhaven | $15 SW |  | A |
| `bucket-sand` | Bucket hat | hat | `#fff1c9` | bucket | $18 SW |  | A |
| `bandana` | Bandana | hat | `#ff5a5a,#fdf6ea` | wrap, dots 12 | $15 SW |  | A |
| `cap-back` | Backwards cap | hat | `#150f3d,#29e6ff` | cap, reversed | $22 SW |  | A |
| `storm-hood` | Rain hood | hat | `#ffc300` | hood | $25 SM |  | A |
| `straw-wide` | Sun hat | hat | `#f2ddb0,#ff8f7a` | straw, band | $25 SV |  | B |
| `visor-neon` | Neon visor | hat | `#5dff9b,#ff3fa4` | visor | $20 SV |  | B |
| `cap-earl` | Big Earl's cap | hat | `#3d6b4a,#fdf6ea` | cap, logo Exit 44 | $20 BE |  | B |
| `camo-cap` | Camo cap | hat | `#3d6b4a,#6a8f4e,#8a6f55` | cap, camo | $25 BB |  | B |
| `swamp-hat` | Swamp hat | hat | `#8a6f55` | straw, curled brim | $45 BB |  | B |
| `hardhat` | Hard hat | hat | `#ffc300` | helmet | $30 SM |  | B |
| `trilby-white` | White trilby | hat | `#fdf6ea,#150f3d` | trilby, band | $180 MS |  | B |
| `captain` | Captain's cap | hat | `#fdf6ea,#2e4a6b,#e0b33c` | peaked, badge | $90 MS | after yacht-rock | B |
| `cap-bhtv` | BHTV 6 cap | hat | `#b46bff,#fdf6ea` | cap, logo 6 | - | peak viewers 100,000 | B |
| `race-helmet` | Race helmet | hat | `#ff4f6e,#29e6ff` | helmet, full, number 9 | - | mission speedbowl | B |
| `pelican-hat` | Pelican hat | hat | `#fdf6ea,#ffa02e` | novelty: beak and pouch boxes | - | all 20 Gerald sightings | B |
| `beanie` | Beanie | hat | `#b46bff` | beanie | $18 SW |  | C |
| `golf-cap` | Golf cap | hat | `#f5ecd7` | flat | $70 CH |  | C |
| `shower-cap` | Shower cap | hat | `#9fd2ff,#fdf6ea` | dome, dots 9 | $15 PB |  | C |
| `pilot` | Pilot's cap | hat | `#2e4a6b,#e0b33c` | peaked, badge | $150 MS | own an aircraft | C |
| `tiara` | Pageant tiara | hat | `#e0b33c,#ff3fa4` | tiara | $900 MS |  | C |
| `gator-hat` | Gator head hat | hat | `#3d6b4a,#fdf6ea` | novelty: snout box | $35 ST |  | C |
| `sun-hood` | Glow Camp hood | hat | `#fdf6ea` | hood | $220 GC | after glow-up | C |
| `deputy-hat` | Deputy's hat | hat | `#2ec4b6,#ff4fa8` | straw, flat brim, band | - | Local Man 11: keep the hat | C |
| `ear-muffs` | Ear defenders | hat | `#ff9a3c,#150f3d` | band, cups 2 | $40 SM |  | C |
| `umbrella-hat` | Umbrella hat | hat | `#ff3fa4,#29e6ff,#ffc300` | novelty: 6-panel canopy 0.5 across | $30 SV |  | C |
| `grove-cap` | Tangelo growers cap | hat | `#ffa02e,#3fb86a` | cap, logo orange | $20 Tangelo fruit stand |  | D |
| `launch-cap` | Upward launch cap | hat | `#150f3d,#fdf6ea` | cap, logo arrow | $35 Cape Calamity gift shop |  | D |
| `shades-bar` | Shades | glasses | `#150f3d` | bar | $15 SW |  | A |
| `shades-pink` | Pink shades | glasses | `#ff3fa4` | bar | $20 SW |  | A |
| `readers` | Readers on a chain | glasses | `#c8ccd2` | rounds, chain | $15 SW |  | A |
| `teardrops` | Teardrop shades | glasses | `#e0b33c,#3b3946` | teardrops | $40 SV |  | B |
| `hearts` | Heart shades | glasses | `#ff5a5a` | hearts | $25 SW |  | B |
| `shield` | Wraparound shield | glasses | `#29e6ff,#b46bff` | shield, gradient | $60 SV |  | B |
| `cat-eye` | Cat-eye frames | glasses | `#ff4f6e` | winged | $180 MS |  | B |
| `gold-rims` | Gold rims | glasses | `#e0b33c` | rounds | $650 MS |  | B |
| `drive-in` | Drive-in glasses | glasses | `#ff5a5a,#29e6ff` | bar, split | - | a film at the Starlite | B |
| `stream-specs` | Streamer specs | glasses | `#b46bff` | rounds | - | followers 100,000 | B |
| `safety` | Safety glasses | glasses | `#fff1c9` | shield, clear | $15 SM |  | C |
| `snorkel` | Snorkel mask | glasses | `#ffc300,#29e6ff` | mask, tube | $35 SV |  | C |
| `monocle` | Monocle | glasses | `#e0b33c` | one round | $400 MS |  | C |
| `gnome-specs` | Gnome spectacles | glasses | `#ff5a5a` | rounds, tiny | - | find 5 gnomes | C |
| `eye-patch` | Eye patch | glasses | `#150f3d` | patch, left | - | find all 3 shipwrecks | D |
| `launch-shades` | Launch shades | glasses | `#ffa02e,#150f3d` | shield | - | see a real launch | D |
| `floral-12` | Mags's floral | top | `#2e4a6b,#ff9eb5,#fff1c9` | shirt, floral 12 | - | start, Mags | A |
| `floral-3` | Teo's open floral | top | `#ff8f7a,#fff1c9,#29e6ff` | open shirt over tank, floral 3 | - | start, Teo | A |
| `floral-7` | Mint floral | top | `#8fe3cf,#ff4f6e,#ffc300` | shirt, floral 7 | $15 SW |  | A |
| `floral-21` | Midnight floral | top | `#150f3d,#ff3fa4,#5dff9b` | shirt, floral 21 | $18 SW |  | A |
| `floral-44` | Peach floral | top | `#ffc98f,#2ec4b6,#fdf6ea` | shirt, floral 44 | $18 SW |  | A |
| `tee-white` | White tee | top | `#fdf6ea` | tee | $15 SW |  | A |
| `tee-ink` | Ink tee | top | `#150f3d` | tee | $15 SW |  | A |
| `tank-white` | Tank top | top | `#fdf6ea` | tank | $15 SW |  | A |
| `tee-greetings` | Greetings tee | top | `#9fd2ff,#ff4fa8` | tee, logo wordmark | $20 SW |  | A |
| `guayabera` | Guayabera | top | `#fdf6ea,#c8ccd2` | shirt, stripes-v 4 | $45 SW |  | A |
| `hi-vis` | Hi-vis vest | top | `#ffc300,#c8ccd2` | vest, bands 2 | $30 SM |  | A |
| `poncho` | Storm poncho | top | `#ffc300` | poncho | $20 SM |  | A |
| `work-shirt` | Work shirt | top | `#4f7cac,#fdf6ea` | shirt, name patch | - | mission repo-woman | A |
| `linen-white` | Linen shirt | top | `#fdf6ea` | shirt | $220 MS |  | A |
| `blazer-coral` | Coral blazer | top | `#ff8f7a,#fdf6ea` | jacket | $900 MS |  | A |
| `floral-58` | Lilac floral | top | `#c9a8ff,#fff1c9,#ff8f7a` | shirt, floral 58 | $20 SV |  | B |
| `floral-101` | Hibiscus floral | top | `#fdf6ea,#ff5a5a,#3fb86a` | shirt, floral 101 | $20 SV |  | B |
| `tie-dye` | Tie-dye tee | top | `#ff3fa4,#29e6ff,#ffc300` | tee, rings 5 | $25 SV |  | B |
| `fishing-vest` | Fishing vest | top | `#e8dcc4,#8a6f55` | vest, pockets 6 | $55 BB |  | B |
| `hoodie-live` | Streamer hoodie | top | `#b46bff,#fdf6ea` | hoodie, logo LIVE | $60 GF |  | B |
| `windbreaker` | Windbreaker | top | `#7fd6e8,#ff3fa4,#fdf6ea` | jacket, panel 3 | $55 GF |  | B |
| `silk-palm` | Silk palm shirt | top | `#1f6f5c,#e0b33c` | shirt, palm 5 | $650 MS |  | B |
| `flamingo-jacket` | Flamingo suit jacket | top | `#ff9eb5,#fdf6ea` | jacket | $1,800 MS |  | B |
| `dinner-jacket` | White dinner jacket | top | `#fdf6ea,#150f3d` | jacket, bow | $2,400 MS |  | B |
| `sequin-jacket` | Sequin jacket | top | `#e0b33c,#ff3fa4` | jacket, dots 40, glint | $4,000 MS |  | B |
| `cab-shirt` | Bay Cab shirt | top | `#ffa02e,#150f3d` | shirt, logo Bay Cab | - | 25 fares | B |
| `eats-jacket` | Pelican Eats jacket | top | `#ffa02e,#fdf6ea` | jacket, logo pelican | - | 25 deliveries | B |
| `race-jacket` | Race jacket | top | `#ff4f6e,#29e6ff,#fdf6ea` | jacket, number 9 | - | mission speedbowl | B |
| `union-jacket` | Union jacket | top | `#2e4a6b,#ffc300` | jacket, logo crane | - | mission crane-game | B |
| `larry-tee` | Call Larry tee | top | `#ffc300,#150f3d` | tee, logo 555-0144 | - | Billable Hours, job 1 | B |
| `crew-shirt` | Show crew shirt | top | `#2ec4b6,#ff4fa8` | shirt, logo LIVE | - | clear heat 5 | B |
| `arcade-tee` | Arcade prize tee | top | `#150f3d,#29e6ff,#ff3fa4` | tee, pixels 8 | 500 tickets CA |  | B |
| `flock-tideline` | Tideline flock | top | `#ff9eb5,#29e6ff,#fff1c9` | shirt, floral 201 | - | 10 flamingos, Tideline | B |
| `flock-meridian` | Meridian flock | top | `#b8cfe0,#ff8f7a,#fdf6ea` | shirt, floral 202 | - | 10 flamingos, Meridian | B |
| `flock-palma` | Palma Vieja flock | top | `#2ec4b6,#ffb347,#ff6f91` | shirt, floral 203 | - | 10 flamingos, Palma Vieja | B |
| `flock-paintworks` | Paintworks flock | top | `#a8553a,#b46bff,#5dff9b` | shirt, floral 204 | - | 10 flamingos, The Paintworks | B |
| `flock-rustwater` | Rustwater flock | top | `#2e4a6b,#ffc300,#b5532f` | shirt, floral 205 | - | 10 flamingos, Rustwater | B |
| `flock-northgate` | Northgate flock | top | `#e8dcc4,#ff5a5a,#ffc300` | shirt, floral 206 | - | 10 flamingos, Northgate | B |
| `flock-mallard` | Mallard Greens flock | top | `#f5ecd7,#b7c9a8,#f0d0c8` | shirt, floral 207 | - | 10 flamingos, Mallard Greens | B |
| `flock-runway` | Runway Flats flock | top | `#c8ccd2,#9fd2ff,#ffa02e` | shirt, floral 208 | - | 10 flamingos, Runway Flats | B |
| `flock-glades` | Glades flock | top | `#3d6b4a,#d8ff7a,#8a6f55` | shirt, floral 209 | - | 10 flamingos, Mudcat Glades | B |
| `flock-islands` | Islands flock | top | `#fdf6ea,#2e4a6b,#ff8f7a` | shirt, floral 210 | - | 10 flamingos, The Islands | B |
| `bowling` | Bowling shirt | top | `#ff8f7a,#150f3d` | shirt, panel 2 | $35 SW |  | C |
| `caftan` | Resort caftan | top | `#7fd6e8,#e0b33c` | long, wave 3 | $480 MS |  | C |
| `glow-robe` | Glow Camp robe | top | `#fdf6ea` | robe | $300 GC | after glow-up | C |
| `spf-tee` | SPF 1000 tee | top | `#fdf6ea,#ff3fa4` | tee, logo sun | $28 GC |  | C |
| `gator-tee` | Scale & Tail tee | top | `#6a8f4e,#fdf6ea` | tee, logo gator | $25 ST |  | C |
| `dawn-top` | Track top | top | `#c9a8ff,#fdf6ea` | jacket, stripe | - | Dawn Patrol, job 4 | C |
| `crest-blazer` | Association blazer | top | `#b7c9a8,#e0b33c` | jacket, crest | - | Violations, job 4 | C |
| `gown` | Hospital gown | top | `#9fd2ff,#fdf6ea` | long, dots 16, open back | - | 5 hospital visits | C |
| `tee-key-lime` | Key Lime Crimes tee | top | `#b5e48c,#fdf6ea` | tee, logo pie | $24 GF |  | C |
| `mascot-dog` | Hot-dog suit top | top | `#ff8f7a,#ffc300` | long, stripe mustard | - | Local Man 5, hot dog's side | C |
| `mascot-taco` | Taco suit top | top | `#ffc98f,#3fb86a` | long, shell | - | Local Man 5, taco's side | C |
| `tour-guide` | Tour guide blazer | top | `#ff5a5a,#fdf6ea` | jacket, name badge | - | Local Man 19 | C |
| `lifeguard` | Lifeguard vest | top | `#ff5a5a,#fdf6ea` | tank, logo hut | - | Local Man 4 | C |
| `nilda-vest` | Airboat tours vest | top | `#6a8f4e,#ffc300` | vest, logo airboat | - | win all 4 airboat races | C |
| `valet-vest` | Valet vest | top | `#7a3b69,#e0b33c` | vest, buttons 4 | - | 20 valet parks | C |
| `ref-stripes` | Marshal stripes | top | `#fdf6ea,#150f3d` | tee, stripes-v 8 | - | win the derby | C |
| `cove-tee` | Mermaid Cove tee | top | `#7fd6e8,#ff9eb5` | tee, logo tail | $25 Mermaid Cove |  | D |
| `mudhen-shirt` | Camp Mudhen shirt | top | `#ff9a3c,#fdf6ea` | shirt, number 0144 | - | chapter 2 | D |
| `rig-shirt` | The Rig shirt | top | `#150f3d,#29e6ff,#ff3fa4` | shirt, wave 4, glow at night | $120 The Rig |  | D |
| `cargo` | Cargo shorts | bottom | `#e8dcc4` | shorts, pockets | - | start, Mags | A |
| `boardies` | Board shorts | bottom | `#29e6ff,#ff3fa4` | shorts, wave 2 | - | start, Teo | A |
| `jeans` | Jeans | bottom | `#4f7cac` | long | $20 SW |  | A |
| `shorts-white` | White shorts | bottom | `#fdf6ea` | shorts | $15 SW |  | A |
| `cut-offs` | Cut-offs | bottom | `#4f7cac,#fdf6ea` | shorts, frayed hem | $15 SW |  | A |
| `track` | Track bottoms | bottom | `#150f3d,#fdf6ea` | long, side stripe | $22 SW |  | A |
| `trunks` | Swim trunks | bottom | `#ff8f7a,#fff1c9` | shorts, stripes-h 4 | $18 SW |  | A |
| `linen-trousers` | Linen trousers | bottom | `#fff1c9` | long | $180 MS |  | A |
| `floral-shorts` | Floral shorts | bottom | `#8fe3cf,#ff4f6e,#ffc300` | shorts, floral 7 | $20 SV |  | B |
| `sarong` | Beach sarong | bottom | `#ff8f7a,#ffc300` | skirt, long, palm 3 | $30 SV |  | B |
| `plaid-shorts` | Plaid shorts | bottom | `#9fd2ff,#fdf6ea,#ff8f7a` | shorts, long, check 5 | $35 GF |  | B |
| `leggings` | Neon leggings | bottom | `#ff3fa4,#5dff9b` | long, panel 2 | $28 GF |  | B |
| `waders` | Chest waders | bottom | `#5a4a32` | long, bib | $80 BB |  | B |
| `work-trousers` | Work trousers | bottom | `#2e4a6b,#6f6a78` | long, knee patches | $30 SM |  | B |
| `flamingo-trousers` | Flamingo suit trousers | bottom | `#ff9eb5` | long | $1,200 MS |  | B |
| `dinner-trousers` | Dinner trousers | bottom | `#150f3d` | long, side stripe | $900 MS |  | B |
| `race-trousers` | Race trousers | bottom | `#ff4f6e,#29e6ff` | long, side stripe | - | mission speedbowl | B |
| `golf-trousers` | Golf trousers | bottom | `#ff5a5a,#fdf6ea,#3fb86a` | long, check 4 | $140 CH |  | C |
| `pleat-skirt` | Pickleball skirt | bottom | `#fdf6ea,#b7c9a8` | skirt, pleats 6 | $60 CH |  | C |
| `glow-wraps` | Glow Camp wraps | bottom | `#fdf6ea` | long, loose | $240 GC | after glow-up | C |
| `sequin-trousers` | Sequin trousers | bottom | `#e0b33c,#ff3fa4` | long, dots 40, glint | $3,200 MS |  | C |
| `court-shorts` | Shuffleboard shorts | bottom | `#fdf6ea,#8fe3cf` | shorts, long, check 3 | $30 Driftwood boardwalk |  | D |
| `bass-waders` | Tournament waders | bottom | `#3d6b4a,#ffc300` | long, bib, logo fish | - | win the bass tournament | D |
| `boat-shoes` | Boat shoes | shoes | `#8a6f55,#fdf6ea` | low | - | start, Mags | A |
| `slides` | Slides with socks | shoes | `#150f3d,#fdf6ea` | sandal, sock | - | start, Teo | A |
| `flip-flops` | Flip-flops | shoes | `#29e6ff` | sandal | $15 SW |  | A |
| `trainers` | Trainers | shoes | `#fdf6ea` | low | $25 SW |  | A |
| `high-tops` | High-tops | shoes | `#ff3fa4,#fdf6ea` | high | $40 SW |  | A |
| `sandals` | Sandals | shoes | `#8a6f55` | sandal | $20 SW |  | A |
| `work-boots` | Work boots | shoes | `#a8553a` | boot | $45 SM |  | A |
| `loafers` | Loafers, no socks | shoes | `#5a4a32` | low | $320 MS |  | A |
| `foam-clogs` | Foam clogs | shoes | `#ffa02e` | low, holes 6 | $22 SW |  | B |
| `rubber-boots` | Rubber boots | shoes | `#ffc300` | boot | $20 SM |  | B |
| `deck-white` | White deck shoes | shoes | `#fdf6ea,#e0b33c` | low | $280 MS |  | B |
| `lace-ups` | Lace-ups | shoes | `#150f3d` | low, glint | $700 MS |  | B |
| `race-boots` | Race boots | shoes | `#ff4f6e,#fdf6ea` | high | - | mission speedbowl | B |
| `slippers` | Motel slippers | shoes | `#fdf6ea` | low, soft | - | own the motel room | B |
| `lane-shoes` | Bowling shoes | shoes | `#ff5a5a,#9fd2ff` | low, split | 200 tickets CA |  | C |
| `swim-fins` | Swim fins | shoes | `#29e6ff` | low, long toe 0.3 | $30 SV |  | C |
| `platforms` | Platform sandals | shoes | `#ff3fa4,#e0b33c` | sandal, tall 0.1 | $240 MS |  | C |
| `golf-shoes` | Golf shoes | shoes | `#fdf6ea,#b7c9a8` | low, flap | $110 CH |  | C |
| `scale-boots` | Scale-print boots | shoes | `#3d6b4a,#e0b33c` | boot, scales | $90 ST |  | C |
| `knee-socks` | Knee socks | shoes | `#c9a8ff,#fdf6ea` | low, sock to the knee | - | Dawn Patrol, job 2 | C |
| `moon-boots` | Upward moon boots | shoes | `#c8ccd2,#ffa02e` | boot, tall, thick sole | $400 Cape Calamity gift shop |  | D |

Any `floral-N`, N from 1 to 9999, is a valid top even without a row: the generator's defaults dress it. Each Second Wind Thrift stocks six a day, seeds `1000 + hash(day, branch, i) mod 9000`, at `$15 + (N mod 4) × 5`.

## The floral-shirt generator

`floral(seed, base, flowerA, flowerB, size, density)` returns a 64 × 64 canvas that tiles on all four edges.

| Input | Range | Default from a bare seed |
|---|---|---|
| `seed` | 1 to 9999 | the N in the id |
| `base` | any hex | pastel wall colour number `seed mod 9` in `07-art-and-audio.md` |
| `flowerA` | any hex | neon number `(seed × 7) mod 6` |
| `flowerB` | any hex | pastel wall colour number `(seed × 3 + 4) mod 9`, or `#fdf6ea` if that is the base |
| `size` | 8 to 16 px | `8 + (seed mod 5) × 2` |
| `density` | 0.4 to 1.0 | `0.4 + ((seed × 13) mod 7) × 0.1` |

A row above that names a floral gives base, flowerA and flowerB in that order; size and density still come from the seed.

1. Seed the generator in `core/rng.js` with `seed`. Fill the canvas with `base`.
2. **Leaves.** Draw `round(density × 8)` ellipses of 12 × 4 px at random points and angles, in `base` mixed half and half with `#1f6f5c`.
3. **Centres.** Place up to `round(density × 10)` flowers. For each, try up to 30 random points and keep the first that is `size × 1.6` px or more from every kept centre, measuring with wrap-around on both axes.
4. **Petals.** At each centre pick a start angle and draw five circles of radius `size × 0.42`, set `size × 0.5` px out at 72° steps. Even-numbered flowers use `flowerA`, odd ones `flowerB`.
5. **Eye.** A circle of radius `size × 0.22` on the centre, in `#fff1c9`, or `#150f3d` if the petals are paler than `#e0e0e0`.
6. **Wrap.** Any shape within `size` px of an edge is drawn again shifted by 64 px, so the tile has no seam.
7. Copy it into a free cell of the clothes atlas (512 × 512, 64 cells, the least recently worn reused). On `low` quality draw at 32 × 32 with every length halved.

The torso's front and back show the tile twice across and twice down; each arm shows it once. `open shirt over tank` leaves a strip 30% of the torso wide down the front in `#fdf6ea`.

## Named outfits

A lead who owns all five pieces can put the outfit on in one tap.

| Outfit | hat, glasses, top, bottom, shoes | Who wears it | Tier |
|---|---|---|---|
| Route 9 | `visor` `none` `floral-12` `cargo` `boat-shoes` | Mags, from the start | A |
| Phone on a Stick | `none` `none` `floral-3` `boardies` `slides` | Teo, from the start, with the phone on his chest mount | A |
| Tidy Car | `visor` `readers` `linen-white` `linen-trousers` `loafers` | Mags on the model-home tour in Open House | A |
| Talent | `none` `shades-pink` `blazer-coral` `shorts-white` `slides` | Teo at the gangway in Yacht Rock | A |
| Pit Chief | `cap-bay` `readers` `work-shirt` `jeans` `work-boots` | Wendell Park | A |
| Number 9 | `race-helmet` `none` `race-jacket` `race-trousers` `race-boots` | Mags at the Speedbowl | B |
| Domino Table | `trilby-white` `shades-bar` `guayabera` `linen-trousers` `loafers` | Rafa Montalvo | B |
| Every Tooth | `none` `gold-rims` `flamingo-jacket` `flamingo-trousers` `deck-white` | Gordy Bellweather | B |
| Airboat Captain | `camo-cap` `teardrops` `fishing-vest` `waders` `rubber-boots` | Captain Nilda Ferro | B |
| Steward | `hardhat` `none` `union-jacket` `work-trousers` `work-boots` | Dess Whitlock | B |
| Abundance | `sun-hood` `shield` `glow-robe` `glow-wraps` `platforms` | Kiki Halcyon and everyone at Glow Camp | C |
| Dawn Patrol | `visor-neon` `shield` `dawn-top` `leggings` `knee-socks` | Coach Brenda Oyelaran and the club | C |

People on the street dress from the A items by kind: tourists `floral-N` and `cargo`, joggers `tank-white` and `track`, retirees `visor` and `guayabera`, skaters `cap-back` and `cut-offs`, office workers `linen-white` and `linen-trousers`, dock workers `hi-vis` and `work-boots`, clubbers `tee-ink` and `high-tops`, beachgoers `trunks` and `flip-flops`.

## New names

None. Every shop and place named here is in canon section 3 or 8. Item names are plain descriptions.
