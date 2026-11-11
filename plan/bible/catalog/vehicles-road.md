# Bible · catalog · Road vehicles

Every road vehicle in Bayhaven: 52 models in eight classes, each with numbers, a model sheet in boxes, paint, sound and spawns. The 16 road models in `04-systems.md` keep their top speed, 0-100 time and mass exactly. Boats, aircraft, emergency vehicles and special versions are in `vehicles-other.md`.

Tier: A for the 15 models that days 2, 3 and 5 ship, which includes the Remora, because mission 1 needs a tow truck; B and C for the rest, tagged per row.

## The table

- Metres, kg, km/h. **Class** is the kind from canon section 7; the headings further down give the eight class groups.
- **0-100:** seconds to 100 km/h. For a vehicle whose top speed is under 100 km/h, it is the time to 90% of top speed instead. `n/a` under 40 km/h and for anything pedalled.
- **Grip** multiplies the 6.5 /s sideways decay in `04-systems.md` (Heron 1.0), before surface grip.
- **Drift:** how readily the rear lets go, 0 (never) to 1 (always). The Heron's 0.5 is day 1's slide.
- **Health** is the vehicle's hit points. The HUD shows damage as 0 to 100% of them, as `04-systems.md` does.
- **Seats** counts the driver. A **price** in brackets is never for sale: it is the value the scrapyard pays 5% of. Sellers are in `shops.md`.
- Mags at the wheel: grip × 1.15, damage taken × 0.75.

| id | class | L×W×H | wheelbase | mass | top | 0-100 | grip | drift | health | seats | price | tier |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `snook` | compact | 3.70×1.60×1.50 | 2.35 | 1,000 | 125 | 10.0 | 1.05 | 0.20 | 80 | 4 | $9,000 | A |
| `anchovy` | microcar | 2.50×1.40×1.50 | 1.70 | 600 | 90 | 14.0 | 1.10 | 0.10 | 60 | 2 | $4,500 | C |
| `guppy` | hatchback | 3.95×1.70×1.48 | 2.50 | 1,100 | 130 | 9.5 | 1.00 | 0.25 | 90 | 5 | $11,000 | B |
| `snapper` | hot hatch | 3.95×1.72×1.42 | 2.50 | 1,150 | 165 | 6.5 | 1.15 | 0.45 | 90 | 5 | $26,000 | B |
| `possum` | beater sedan | 4.50×1.75×1.45 | 2.65 | 1,400 | 115 | 13.0 | 0.85 | 0.40 | 70 | 5 | $1,800 | B |
| `permit` | driving-school car | 3.90×1.65×1.52 | 2.45 | 1,050 | 110 | 12.0 | 1.00 | 0.10 | 85 | 4 | ($8,500) | C |
| `heron` | coupe | 4.46×1.92×1.40 | 2.76 | 1,300 | 137 | 7.5 | 1.00 | 0.50 | 100 | 2 | $18,000 | A |
| `tarpon` | sedan | 4.70×1.85×1.46 | 2.80 | 1,500 | 140 | 9.0 | 0.95 | 0.30 | 110 | 5 | $14,000 | A |
| `gallinule` | luxury sedan | 5.15×1.92×1.46 | 3.10 | 2,000 | 160 | 8.0 | 0.95 | 0.25 | 130 | 5 | $85,000 | C |
| `egret` | silent electric sedan | 4.85×1.90×1.42 | 2.95 | 1,900 | 170 | 5.0 | 1.10 | 0.15 | 110 | 5 | $70,000 | C |
| `tern` | convertible | 4.40×1.80×1.28 | 2.60 | 1,400 | 150 | 8.0 | 1.00 | 0.40 | 95 | 4 | $32,000 | B |
| `coquina` | luxury convertible | 5.00×1.95×1.32 | 3.00 | 1,900 | 175 | 6.5 | 1.05 | 0.35 | 115 | 4 | $140,000 | C |
| `ibis` | long classic | 5.60×2.00×1.42 | 3.25 | 2,100 | 135 | 11.5 | 0.80 | 0.45 | 130 | 6 | $48,000 | C |
| `spoonbill` | pink finned classic | 5.55×2.02×1.44 | 3.25 | 2,000 | 140 | 11.0 | 0.80 | 0.50 | 125 | 6 | $60,000 | C |
| `flounder` | lowrider | 5.30×1.95×1.25 | 3.05 | 1,700 | 120 | 10.0 | 0.80 | 0.45 | 100 | 5 | $38,000 | A |
| `wahoo` | muscle | 4.90×1.95×1.34 | 2.85 | 1,600 | 170 | 5.5 | 0.85 | 0.90 | 110 | 4 | $45,000 | A |
| `sailfin` | sports | 4.40×1.90×1.22 | 2.60 | 1,350 | 190 | 4.5 | 1.25 | 0.30 | 90 | 2 | $95,000 | A |
| `cobia` | sports coupe | 4.55×1.92×1.26 | 2.70 | 1,450 | 205 | 4.2 | 1.20 | 0.45 | 95 | 4 | $120,000 | C |
| `bonito` | supercar | 4.50×2.00×1.12 | 2.65 | 1,400 | 230 | 3.2 | 1.30 | 0.35 | 85 | 2 | $420,000 | B |
| `swordtail` | supercar | 4.75×2.05×1.10 | 2.75 | 1,500 | 245 | 2.9 | 1.35 | 0.40 | 80 | 2 | $650,000 | C |
| `gar` | hot rod | 4.00×1.80×1.38 | 2.80 | 1,100 | 180 | 4.8 | 0.80 | 0.85 | 75 | 2 | $75,000 | C |
| `mullet` | pickup | 5.30×1.95×1.80 | 3.30 | 1,900 | 130 | 9.5 | 0.85 | 0.50 | 130 | 3 | $16,000 | A |
| `osprey` | heavy pickup | 6.00×2.15×2.05 | 3.80 | 2,900 | 135 | 10.5 | 0.80 | 0.40 | 170 | 5 | $42,000 | C |
| `grouper` | SUV | 4.90×2.00×1.82 | 2.90 | 2,300 | 150 | 8.5 | 0.90 | 0.25 | 140 | 7 | $36,000 | A |
| `pompano` | van | 5.20×2.00×2.20 | 3.20 | 2,200 | 120 | 12.0 | 0.80 | 0.20 | 130 | 3 | $22,000 | A |
| `hermit` | camper van | 5.60×2.10×2.75 | 3.40 | 2,800 | 105 | 16.0 | 0.70 | 0.15 | 120 | 4 | $30,000 | C |
| `conch` | ice-cream van | 5.00×2.00×2.70 | 3.00 | 2,400 | 95 | 17.0 | 0.75 | 0.15 | 110 | 2 | $28,000 | C |
| `hogfish` | box truck | 7.50×2.40×3.20 | 4.40 | 6,000 | 105 | 18.0 | 0.65 | 0.15 | 220 | 3 | $40,000 | A |
| `remora` | tow truck | 6.50×2.30×2.50 | 4.00 | 4,200 | 110 | 15.0 | 0.70 | 0.20 | 200 | 2 | ($55,000) | A |
| `whelk` | cement mixer | 8.00×2.50×3.50 | 4.60 | 12,000 | 85 | 24.0 | 0.60 | 0.10 | 320 | 2 | ($90,000) | C |
| `pelican` | garbage truck | 8.50×2.50×3.40 | 4.60 | 11,000 | 90 | 20.0 | 0.60 | 0.10 | 350 | 3 | ($110,000) | B |
| `clam` | armoured cash truck | 6.20×2.40×2.80 | 3.70 | 6,500 | 100 | 19.0 | 0.65 | 0.10 | 500 | 4 | ($150,000) | C |
| `sturgeon` | limo | 7.60×1.90×1.46 | 5.20 | 2,800 | 130 | 11.0 | 0.75 | 0.30 | 150 | 8 | $120,000 | B |
| `manatee` | city bus | 11.50×2.55×3.10 | 6.00 | 9,000 | 95 | 22.0 | 0.70 | 0.05 | 300 | 40 | ($180,000) | A |
| `manatee-s` | school bus | 10.80×2.50×3.00 | 5.80 | 8,200 | 100 | 20.0 | 0.70 | 0.05 | 280 | 36 | $25,000 | B |
| `pinfish` | scooter | 1.80×0.70×1.10 | 1.30 | 110 | 85 | 9.0 | 0.90 | 0.20 | 40 | 2 | $1,200 | A |
| `needlefish` | sport bike | 2.05×0.72×1.12 | 1.42 | 190 | 200 | 3.5 | 1.15 | 0.50 | 35 | 2 | $28,000 | A |
| `bowfin` | cruiser | 2.40×0.90×1.10 | 1.65 | 300 | 160 | 5.5 | 0.95 | 0.40 | 55 | 2 | $19,000 | C |
| `cicada` | dirt bike | 2.10×0.80×1.22 | 1.45 | 120 | 130 | 5.0 | 0.90 | 0.60 | 40 | 1 | $6,500 | C |
| `plover` | bicycle | 1.75×0.60×1.05 | 1.05 | 14 | 35 | n/a | 0.85 | 0.10 | 20 | 1 | $250 | C |
| `sandflea` | BMX | 1.50×0.60×0.95 | 0.95 | 11 | 30 | n/a | 0.90 | 0.30 | 25 | 1 | $180 | C |
| `sanderling` | rental kick scooter | 1.10×0.45×1.15 | 0.85 | 16 | 25 | n/a | 0.80 | 0.10 | 15 | 1 | $1/min | C |
| `birdie` | golf cart | 2.40×1.20×1.80 | 1.65 | 400 | 38 | n/a | 0.80 | 0.30 | 50 | 2 | $6,000 | A |
| `coot` | mobility scooter | 1.30×0.65×1.05 | 0.95 | 90 | 12 | n/a | 0.90 | 0.00 | 25 | 1 | $1,500 | C |
| `cricket` | ride-on mower | 1.80×1.00×1.10 | 1.20 | 250 | 14 | n/a | 0.85 | 0.20 | 45 | 1 | $2,200 | C |
| `fiddler` | forklift | 2.60×1.20×2.27 | 1.30 | 3,500 | 22 | n/a | 0.80 | 0.00 | 160 | 1 | ($18,000) | B |
| `gopher` | airport tug | 3.00×1.50×1.30 | 1.90 | 4,000 | 30 | n/a | 0.90 | 0.00 | 180 | 2 | ($15,000) | C |
| `skink` | quad bike | 2.00×1.20×1.20 | 1.30 | 280 | 95 | 6.5 | 0.95 | 0.55 | 50 | 2 | $7,500 | C |
| `tortoise` | tractor | 3.80×2.00×2.70 | 2.30 | 3,200 | 32 | n/a | 0.85 | 0.00 | 240 | 1 | $24,000 | C |
| `bullfrog` | swamp buggy | 5.00×2.60×3.00 | 3.20 | 2,500 | 90 | 12.0 | 0.75 | 0.30 | 180 | 4 | $65,000 | B |
| `sandshark` | dune buggy | 3.40×1.80×1.72 | 2.30 | 650 | 140 | 6.0 | 0.95 | 0.70 | 60 | 2 | $17,000 | C |
| `sawfish` | monster truck | 5.60×3.20×3.40 | 3.50 | 4,800 | 110 | 9.0 | 0.70 | 0.35 | 400 | 2 | $160,000 | C |

## Reading a model sheet

Each piece is `name:L×W×H@f,y`: L along the vehicle, W across, H up, in metres. `f` is how far the piece's centre sits ahead of the vehicle's centre (negative is behind); `y` is its underside above the road. `×2` or more means copies, mirrored at the body's edges unless the paint note places them. After the pieces come paint and stripe height, the six factory colours, engine, horn, spawns and a note.

- `/f` marks a wedge whose top falls to 60% of H at the front; `/r` at the rear; `/f0` and `/r0` fall to zero.
- `cabin` is glass `#16263c`, tapered as on day 1: top 0.2 narrower each side, front edge 0.6 back, rear edge 0.45 in. `roof` is the paint slab on it. `cab` and `glass` are square.
- `sill` and `chassis` are dark `#1b1924` and include the bumpers. Steel is `#c8ccd2`.
- Wheels: 12-sided, tyre `#15141a`, hub `#9a9aa8`, 0.83 × radius wide (0.4 × on two-wheelers). Axles at ± half the wheelbase; track is W minus 0.24.
- Lights are separate bright pieces: two headlight quads 0.44 × 0.11, one tail strip, amber corner quads.
- Damage panels are cut from the pieces: the hood wedge; the body's top behind the cabin (boot lid); its sides under the cabin (doors); the first and last 0.15 of the sill (bumpers).
- Triangles: 12 a piece, 72 a wheel with spokes, 14 for lights and stripes. No sheet passes 600; one under 300 spends the spare on 16-sided wheels.

**Paint.** The main paint, one of six factory colours (the first is the showroom colour; traffic picks by seed), covers every piece not named otherwise. The sheet names the second tone. The stripe is a quad 0.07 tall along both sides, lower edge at the stated height, in the accent: cyan `#29e6ff` on warm paints, pink `#ff4fa8` on cool or dark ones, ink `#150f3d` on pale ones.

**Sound.** Engines are day 1's two oscillators through a low-pass, plus a sub where listed; the range runs from idle to the top of fourth gear. Horns are two detuned squares on the notes given. One interval per class: small cars a minor third, cars a major third, fast a fourth, trucks and vans a fifth, buses an octave, two wheels a major second, small and odd a minor second, off-road a tritone.

## Small cars

**Snook**, wheels 0.29  
`sill:3.7×1.6×0.22@0,0.19 body:2.76×1.54×0.49@-0.39,0.39 hood/f:0.8×1.54×0.49@1.39,0.39 cabin:2.5×1.4×0.56@-0.45,0.88 roof:1.49×1.04×0.06@-0.52,1.44 mirrors:0.1×0.14×0.1@0.75,0.88×2`  
Roof `#fdf6ea`; stripe 0.59. `#ff8f7a,#8fe3cf,#ffc98f,#9fd2ff,#fff1c9,#c9a8ff`. Engine: square 55-210 Hz. Horn: E5+G5. Spawns: Tideline, Palma Vieja, Rental Row. Parks in half a space. A side hit above 50 km/h tips it for 2 s.

**Anchovy**, wheels 0.24  
`sill:2.5×1.4×0.2@0,0.16 body:1.91×1.34×0.48@-0.22,0.34 hood/f:0.45×1.34×0.48@0.96,0.34 cabin:1.8×1.2×0.62@-0.23,0.82 roof:0.79×0.84×0.06@-0.31,1.44 aerial:0.03×0.03×0.5@-0.94,1.5 bumper:0.06×1.3×0.14@1.22,0.2`  
Doors `#fdf6ea`; stripe 0.54. `#29e6ff,#ff3fa4,#ffc300,#5dff9b,#f7f3ea,#b46bff`. Engine: thin square 70-260 Hz. Horn: G5+Bb5. Spawns: Pier Quarter, Wet Paint Alley. Seats two if they like each other. Radio starts on Arcade FM.

**Guppy**, wheels 0.3  
`sill:3.95×1.7×0.24@0,0.2 body:2.86×1.64×0.46@-0.46,0.42 hood/f:0.95×1.64×0.46@1.44,0.42 cabin:2.55×1.5×0.54@-0.55,0.88 roof:1.54×1.14×0.06@-0.62,1.42 lip:0.16×1.2×0.06@-1.4,1.42 mirrors:0.1×0.14×0.1@0.68,0.88×2`  
Body's lowest 0.15 `#6f6a78`; stripe 0.62. `#9fd2ff,#b7c9a8,#e8dcc4,#ff9eb5,#c8ccd2,#7fd6e8`. Engine: saw+square 50-190 Hz. Horn: D5+F5. Spawns: everywhere, most in Northgate. The car your aunt swears by.

**Snapper**, wheels 0.31  
`sill:3.95×1.72×0.24@0,0.2 body:2.86×1.66×0.44@-0.46,0.42 hood/f:0.95×1.66×0.44@1.44,0.42 cabin:2.5×1.52×0.5@-0.52,0.86 roof:1.49×1.16×0.06@-0.6,1.36 wing:0.3×1.5×0.05@-1.48,1.37 splitter:0.15×1.72×0.05@1.9,0.12 scoop:0.4×0.4×0.1@1.23,0.82`  
Roof, wing `#1b1924`; stripe 0.62. `#ff5a5a,#ffa02e,#29e6ff,#150f3d,#fdf6ea,#5dff9b`. Engine: saw 55-240 Hz, pops on lift-off. Horn: F5+Ab5. Spawns: The Paintworks at night. A Guppy that found the gym. Lift off mid-corner and it steps out.

**Possum**, wheels 0.31  
`sill:4.5×1.75×0.24@0,0.2 body:2.21×1.69×0.47@-0.11,0.42 hood/f:1.2×1.69×0.47@1.59,0.42 boot/r:0.95×1.69×0.47@-1.69,0.42 cabin:2.15×1.55×0.5@-0.2,0.89 roof:1.14×1.19×0.06@-0.28,1.39 rack:1.2×1.2×0.05@-0.1,1.45 mattress:1.9×1.3×0.2@-0.1,1.5`  
One door `#6f6a78`, boot `#b5532f`; stripe 0.62. `#8a6f55,#b7c9a8,#e8dcc4,#6f6a78,#a8553a,#c9cdd4`. Engine: saw+noise 38-150 Hz, misfires. Horn: C5+Eb5, 30 cents flat. Spawns: Pelican Rest, Scrap Mile, Motel Circle. Runs on spite. Spawns at 70% health and stalls 1.5 s after any crash.

**Permit**, wheels 0.29  
`sill:3.9×1.65×0.22@0,0.19 body:2.86×1.59×0.51@-0.44,0.39 hood/f:0.9×1.59×0.51@1.44,0.39 cabin:2.5×1.45×0.56@-0.55,0.9 roof:1.49×1.09×0.06@-0.63,1.46 sign:0.7×0.4×0.3@-0.4,1.52 mirrors:0.1×0.14×0.1@0.65,0.9×4`  
Sign `#ffc300`: "Learner. Be kind."; stripe 0.59. `#fdf6ea,#fff1c9,#9fd2ff,#8fe3cf,#ffc98f,#f0d0c8`. Engine: square 55-200 Hz. Horn: E5+G5. Spawns: Galleria Flamingo car park, 09:00-17:00. Dual controls: the instructor brakes at the limit plus 20 km/h until asked out.

## Cars

**Heron**, wheels 0.36  
`sill:4.46×1.92×0.24@0,0.24 body:2.9×1.86×0.48@-0.7,0.46 hood/f:1.42×1.86×0.48@1.46,0.46 cabin:2.1×1.72×0.4@-0.25,0.94 roof:1.09×1.36×0.06@-0.32,1.34 spoiler:0.34×1.84×0.06@-2.02,1.11 struts:0.2×0.08×0.2@-2,0.92×2`  
One tone, as day 1; stripe 0.66. `#ff4f6e,#8fe3cf,#ffc98f,#9fd2ff,#c9a8ff,#f7f3ea`. Engine: saw plus square an octave down, 40-170 Hz (day 1). Horn: A4+C#5. Spawns: Pelican Rest (Mags's), Tideline. The day 1 car, unchanged. Mags built the engine.

**Tarpon**, wheels 0.33  
`sill:4.7×1.85×0.24@0,0.22 body:2.31×1.79×0.46@-0.11,0.44 hood/f:1.25×1.79×0.46@1.67,0.44 boot/r:1×1.79×0.46@-1.77,0.44 cabin:2.3×1.65×0.5@-0.1,0.9 roof:1.29×1.29×0.06@-0.18,1.4 mirrors:0.1×0.14×0.1@0.95,0.9×2`  
Roof `#f7f3ea` on dark paints; stripe 0.64. `#c8ccd2,#f7f3ea,#2e4a6b,#b8cfe0,#6f6a78,#e8dcc4`. Engine: saw+triangle 42-165 Hz. Horn: G4+B4. Spawns: everywhere. Half the traffic in Bayhaven. No witness has ever described one.

**Gallinule**, wheels 0.35  
`sill:5.15×1.92×0.24@0,0.23 body:2.41×1.86×0.47@-0.14,0.45 hood/f:1.45×1.86×0.47@1.79,0.45 boot/r:1.15×1.86×0.47@-1.92,0.45 cabin:2.45×1.72×0.48@-0.15,0.92 roof:1.44×1.36×0.06@-0.23,1.4 grille:0.06×0.9×0.34@2.55,0.45 bird:0.12×0.04×0.1@2.39,0.73`  
Roof a shade darker, grille steel; stripe 0.65. `#150f3d,#2e4a6b,#1f6f5c,#7a3b69,#c8ccd2,#f7f3ea`. Engine: triangle+sub 35-140 Hz. Horn: F4+A4. Spawns: The Exchange, Sandpiper Isle. For people who say "my driver".

**Egret**, wheels 0.34  
`sill:4.85×1.9×0.24@0,0.22 body:2.61×1.84×0.46@-0.14,0.44 hood/f:1.2×1.84×0.46@1.76,0.44 boot/r:0.9×1.84×0.46@-1.89,0.44 cabin:2.65×1.7×0.46@-0.08,0.9 roof:1.64×1.34×0.06@-0.15,1.36 lightstrip:0.04×1.7×0.04@2.41,0.64`  
Roof glass, light strip cyan; stripe 0.64. `#fdf6ea,#e0e0e6,#b8cfe0,#b8e0d3,#c9cdd4,#9fd2ff`. Engine: sine whine 180-900 Hz at 15% volume. Horn: C5+E5. Spawns: Mallard Greens, Meridian. Silent: people on foot only react at 6 m.

**Tern**, wheels 0.33  
`sill:4.4×1.8×0.24@0,0.22 body:2.11×1.74×0.46@-0.17,0.44 hood/f:1.25×1.74×0.46@1.51,0.44 boot/r:0.9×1.74×0.46@-1.67,0.44 screen/f0:0.4×1.6×0.38@0.75,0.9 seats:0.45×0.5×0.35@-0.23,0.8×2 top:0.45×1.5×0.12@-0.98,0.9`  
Seats, top `#fdf6ea`; stripe 0.64. `#ff8f7a,#7fd6e8,#fff1c9,#ff9eb5,#8fe3cf,#ffa02e`. Engine: saw+square 45-180 Hz. Horn: A4+C#5. Spawns: Heron Walk Drive, the Longspan. Roof down when dry. Wet, `top` becomes a cabin 1.6×1.6×0.36 at 0.90.

**Coquina**, wheels 0.36  
`sill:5×1.95×0.24@0,0.24 body:2.36×1.89×0.48@-0.24,0.46 hood/f:1.5×1.89×0.48@1.69,0.46 boot/r:1×1.89×0.48@-1.92,0.46 screen/f0:0.45×1.75×0.38@0.77,0.94 seats:0.5×0.55×0.36@-0.2,0.84×2 bench:0.4×1.3×0.26@-0.85,0.84 top:0.3×1.6×0.12@-1.25,0.94 grille:0.06×1×0.28@2.47,0.46`  
Seats, bench `#fff1c9`; stripe 0.66. `#f7f3ea,#ffc98f,#f0d0c8,#c9a8ff,#2e4a6b,#e0b33c`. Engine: saw+sub 38-175 Hz. Horn: E4+G#4. Spawns: Sandpiper Isle, Hotel Alba. Costs more than all of Pelican Rest. Bellweather keeps three.

**Ibis**, wheels 0.36  
`sill:5.6×2×0.24@0,0.24 body:2.06×1.94×0.46@-0.19,0.46 hood/f:1.9×1.94×0.46@1.79,0.46 boot/r:1.5×1.94×0.46@-1.97,0.46 cabin:1.95×1.8×0.44@-0.23,0.92 roof:0.94×1.44×0.06@-0.3,1.36 bumpers:0.1×2×0.14@-2.75,0.3×2 grille:0.06×1.2×0.3@2.77,0.5`  
Roof `#fdf6ea`, bumpers steel; stripe 0.66. `#8fe3cf,#fff1c9,#ff8f7a,#9fd2ff,#1f6f5c,#5a4a32`. Engine: saw+sub 30-120 Hz. Horn: D4+F#4. Spawns: Palma Vieja, Motel Row. Two bench seats. Body roll is doubled.

**Spoonbill**, wheels 0.36  
`sill:5.55×2.02×0.24@0,0.24 body:2.01×1.96×0.48@-0.09,0.46 hood/f:1.8×1.96×0.48@1.81,0.46 boot/r:1.6×1.96×0.48@-1.89,0.46 cabin:1.9×1.82×0.44@-0.1,0.94 roof:0.89×1.46×0.06@-0.18,1.38 fins/f0:1.42×0.08×0.36@-1.98,0.94×2 bill:0.2×1.3×0.1@2.67,0.38 lamps:0.2×0.12×0.12@-2.67,0.8×2`  
Roof, fin tips `#fdf6ea`; stripe 0.66. `#ff9eb5,#ff4fa8,#ff3fa4,#f0d0c8,#ff6f91,#ffc9d6`. Engine: saw+sub 30-125 Hz. Horn: F4+A4. Spawns: Motel Row, the Starlite on Tuesdays. Comes in pink, pink, pink, pink, pink or pink.

**Flounder**, wheels 0.3  
`sill:5.3×1.95×0.22@0,0.1 body:2.06×1.89×0.51@-0.19,0.3 hood/f:1.75×1.89×0.51@1.72,0.3 boot/r:1.35×1.89×0.51@-1.89,0.3 cabin:2×1.75×0.38@-0.2,0.81 roof:0.99×1.39×0.06@-0.28,1.19 skirts:0.9×0.04×0.4@-1.52,0.12×2 visor:0.3×1.6×0.04@0.3,1.14`  
Roof, skirts in a second factory colour; stripe 0.58. `#7a3b69,#2ec4b6,#ffb347,#d7263d,#1f6f5c,#b46bff`. Engine: saw+sub 32-130 Hz, lopes. Horn: Bb3+D4. Spawns: Palma Vieja, Flounder Works. Hops: double-tap the handbrake and the front jumps 0.45 m, 0.8 s cooldown.

## Fast

**Wahoo**, wheels 0.36  
`sill:4.9×1.95×0.24@0,0.24 body:2.36×1.89×0.42@-0.54,0.46 hood/f:1.75×1.89×0.42@1.52,0.46 boot/r:0.65×1.89×0.42@-2.05,0.46 cabin:1.95×1.75×0.4@-0.68,0.88 roof:0.94×1.39×0.06@-0.75,1.28 scoop:0.6×0.55×0.14@1.35,0.82 tail:0.25×1.85×0.1@-2.28,0.88 pipes:1.2×0.09×0.09@-0.55,0.2×2`  
Two 0.25 hood stripes in the accent. `#ffa02e,#d7263d,#150f3d,#5dff9b,#b46bff,#ffc300`. Engine: saw+square+sub 34-200 Hz. Horn: G4+C5. Spawns: Rustwater, the Speedbowl, Wahoo World. Slides if you look at it. Look at it.

**Sailfin**, wheels 0.34  
`sill:4.4×1.9×0.24@0,0.22 body:2.91×1.84×0.36@-0.66,0.44 hood/f:1.35×1.84×0.36@1.47,0.44 cabin:2×1.7×0.36@-0.45,0.8 roof:0.99×1.34×0.06@-0.53,1.16 sail/f0:0.9×0.06×0.42@-1.65,0.8 wing:0.3×1.84×0.05@-2.01,0.98 splitter:0.15×1.9×0.05@2.12,0.12`  
Sail, wing in the accent; stripe 0.64. `#29e6ff,#ff3fa4,#fdf6ea,#ffc300,#ff5a5a,#2e4a6b`. Engine: saw 60-320 Hz. Horn: A4+D5. Spawns: The Paintworks at night, Pier Quarter. Grip and speed. The fin does nothing. Never remove the fin.

**Cobia**, wheels 0.35  
`sill:4.55×1.92×0.24@0,0.23 body:2.41×1.86×0.37@-0.49,0.45 hood/f:1.5×1.86×0.37@1.47,0.45 boot/r:0.5×1.86×0.37@-1.94,0.45 cabin:2×1.72×0.38@-0.57,0.82 roof:0.99×1.36×0.06@-0.65,1.2 splitter:0.15×1.92×0.05@2.2,0.14 vents:0.5×0.06×0.2@0.18,0.5×2 lip:0.18×1.8×0.06@-2.1,0.82`  
Roof `#1b1924`; stripe 0.65. `#6f6a78,#2e4a6b,#d7263d,#c8ccd2,#1f6f5c,#150f3d`. Engine: saw+square 55-300 Hz. Horn: F#4+B4. Spawns: The Exchange, the Twin Sails. A Sailfin with a back seat and a grudge.

**Bonito**, wheels 0.35  
`sill:4.5×2×0.2@0,0.14 body:1.81×1.94×0.4@0.04,0.32 hood/f:1.25×1.94×0.4@1.57,0.32 boot/r:1.3×1.94×0.4@-1.52,0.32 cabin:1.75×1.8×0.34@0.08,0.72 roof:0.74×1.44×0.06@0,1.06 wing:0.34×1.9×0.05@-2.06,1.02 struts:0.1×0.06×0.46@-2.05,0.56×2 intakes:0.6×0.1×0.22@-0.45,0.4×2`  
`boot/r` (the engine deck), intakes `#1b1924`; stripe 0.52. `#ff3fa4,#29e6ff,#ffa02e,#5dff9b,#fdf6ea,#b46bff`. Engine: two saws a fifth apart, 70-420 Hz. Horn: B4+E5. Spawns: Hotel Alba, Sandpiper Isle. The valet at Hotel Alba has crashed four.

**Swordtail**, wheels 0.36  
`sill:4.75×2.05×0.2@0,0.14 body:1.86×1.99×0.39@0.09,0.32 hood/f:1.3×1.99×0.39@1.67,0.32 boot/r:1.45×1.99×0.39@-1.57,0.32 cabin:1.75×1.85×0.33@0.1,0.71 roof:0.74×1.49×0.06@0.03,1.04 sword/r0:1.45×0.1×0.24@-1.65,0.71 splitter:0.15×2.05×0.05@2.3,0.1 intakes:0.6×0.1×0.22@-0.43,0.4×2`  
Sword in the accent, deck `#1b1924`; stripe 0.52. `#150f3d,#ff5a5a,#e0b33c,#b46bff,#29e6ff,#fdf6ea`. Engine: two saws a fifth apart, 75-460 Hz. Horn: C5+F5. Spawns: the Bellweather mansion, Humidity on Fridays. Road legal in the sense that nobody has checked.

**Gar**, wheels 0.28 front, 0.40 rear  
`rails:3.8×0.8×0.12@0,0.3 tub:1.7×1.5×0.53@-0.95,0.42 cab:1×1.3×0.37@-0.7,0.95 roof:1.1×1.35×0.06@-0.7,1.32 cowl:0.4×1.2×0.48@0.1,0.42 block:0.7×0.6×0.53@0.65,0.42 pipes:0.8×0.1×0.1@0.6,0.5×2 shell:0.15×0.65×0.58@1.12,0.42 scoop:0.4×0.4×0.15@0.65,0.95 lamps:0.15×0.18×0.18@1.28,0.7×2`  
Flames from the cowl back, block steel; no stripe. `#d7263d,#150f3d,#ffc300,#ffa02e,#2e4a6b,#5dff9b`. Engine: saw+sub+noise 30-220 Hz. Horn: E4+A4. Spawns: the Speedbowl on Fridays, the Tank Farm meet. All engine, some car. Flames from the pipes on every gear change.

## Trucks and vans

**Mullet**, wheels 0.38  
`chassis:5.3×1.95×0.22@0,0.3 bed:2.14×1.95×0.53@-1.52,0.52 tailgate:0.06×1.75×0.5@-2.62,0.55 body:1.75×1.89×0.53@0.43,0.52 hood/f:1.29×1.89×0.53@1.95,0.52 cabin:1.7×1.75×0.69@0.45,1.05 roof:0.69×1.39×0.06@0.38,1.74 bumper:0.06×1.95×0.2@2.62,0.4`  
Bed `#f7f3ea`; stripe 0.80. `#b5532f,#f7f3ea,#4f7cac,#6a8f4e,#e8dcc4,#ff8f7a`. Engine: saw+sub 36-150 Hz. Horn: D4+A4. Spawns: Rustwater, Palma Vieja, Mudcat Road. Up to 6 props ride in the bed and leave in any hard turn.

**Osprey**, wheels 6×0.45, twin rears  
`chassis:6×2×0.24@0,0.38 bed:2.44×2.15×0.6@-1.72,0.62 tailgate:0.06×1.95×0.57@-2.97,0.65 body:2×2.05×0.6@0.5,0.62 hood/f:1.4×2.05×0.6@2.2,0.62 cabin:1.95×1.9×0.77@0.52,1.22 roof:0.94×1.5×0.06@0.45,1.99 bullbar:0.1×1.9×0.75@2.95,0.5 stacks:0.12×0.1×0.83@-0.56,1.22×2 arches:1.1×0.15×0.38@-1.95,0.62×2`  
Arches, bullbar `#1b1924`; stripe 0.95. `#150f3d,#c8ccd2,#d7263d,#3d6b4a,#4f7cac,#f7f3ea`. Engine: saw+sub 30-130 Hz. Horn: C3+G3. Spawns: Mudcat Glades, Big Earl's. A Mullet for people with something to prove.

**Grouper**, wheels 0.4  
`sill:4.9×2×0.26@0,0.3 body:3.56×1.94×0.6@-0.59,0.54 hood/f:1.2×1.94×0.6@1.79,0.54 cabin:3.4×1.8×0.62@-0.55,1.14 roof:2.39×1.44×0.06@-0.62,1.76 rails:1.8×0.06×0.05@-0.55,1.82×2 spare:0.18×0.7×0.7@-2.36,0.8`  
Body's lowest 0.25 `#6f6a78`; stripe 0.86. `#c9cdd4,#b7c9a8,#2e4a6b,#f5ecd7,#6f6a78,#a8553a`. Engine: saw+sub 36-155 Hz. Horn: E4+B4. Spawns: Mallard Greens, Northgate. Seven seats, six cup holders, both lanes.

**Pompano**, wheels 0.36  
`chassis:5.2×1.9×0.22@0,0.28 box:3.94×2×1.7@-0.57,0.5 body:0.4×1.94×0.7@1.6,0.5 hood/f:0.74×1.94×0.7@2.17,0.5 screen/f0:0.75×1.84×1@1.77,1.2 sideglass:0.7×0.03×0.65@1.05,1.3×2 doors:0.06×0.95×1.55@-2.57,0.55×2 bumper:0.06×2×0.2@2.57,0.34`  
Box sides are blank sign panels; stripe 0.85. `#fdf6ea,#c8ccd2,#9fd2ff,#ffc98f,#8fe3cf,#e8dcc4`. Engine: square+sub 38-140 Hz. Horn: D4+A4. Spawns: Meridian, The Paintworks by day. White, anonymous, everywhere.

**Hermit**, wheels 0.36  
`chassis:5.6×1.95×0.22@0,0.28 box:4.24×2.1×1.9@-0.62,0.5 pod:0.65×2.1×0.45@1.83,1.95 shell/r:3.95×1.8×0.35@0.18,2.4 body:0.5×2×0.7@1.75,0.5 hood/f:0.74×2×0.7@2.37,0.5 screen/f0:0.7×1.9×0.75@1.85,1.2 awning:2.8×0.15×0.15@-0.2,2.25 ladder:0.06×0.4×1.8@-2.77,0.6`  
Shell, pod `#fdf6ea`; wave band at 1.0. `#fff1c9,#8fe3cf,#ffc98f,#ff9eb5,#7fd6e8,#b5e48c`. Engine: square+sub 36-125 Hz. Horn: C4+G4. Spawns: the Keys, Big Earl's, the Jetty. Rest in the back at heat 0 to skip to 06:00 and save.

**Conch**, wheels 0.34  
`chassis:5×1.9×0.22@0,0.26 box:3.74×2×1.67@-0.57,0.48 body:0.45×1.94×0.67@1.53,0.48 hood/f:0.69×1.94×0.67@2.1,0.48 screen/f0:0.7×1.84×1@1.65,1.15 hatch:1.6×0.05×0.8@-0.5,1.1 cone:0.5×0.5×0.35@-0.65,2.15 scoop:0.6×0.6×0.25@-0.65,2.45 speaker:0.3×0.3×0.2@1.65,2.15`  
Scoop Dreams livery: upper half `#fdf6ea`, cone `#ffc98f`, scoop `#ff9eb5` turned 45°; stripe 1.10. `#ff9eb5,#fff1c9,#8fe3cf,#9fd2ff,#ffc98f,#c9a8ff`. Engine: square 38-120 Hz. Horn: the jingle, C5 E5 G5 E5 F5 D5 B4 C5 at 132 bpm. Spawns: Heron Walk Drive, Mallard Greens at 16:00. The jingle draws people within 30 m. Parked, each sale pays $8.

**Hogfish**, wheels 6×0.48, twin rears  
`chassis:7.5×2.2×0.3@0,0.45 box:5.15×2.4×2.3@-1.12,0.9 body:1×2.3×0.8@2.05,0.75 hood/f:1.14×2.3×0.8@3.12,0.75 cabin:1.4×2.2×0.9@2.25,1.55 roof:0.39×1.84×0.06@2.18,2.45 fairing/f0:0.8×2×0.59@1.95,2.51 door:0.05×2.2×2.15@-3.73,0.95 bumper:0.06×2.4×0.3@3.72,0.5 tanks:1×0.3×0.35@0.55,0.5×2`  
Box `#fdf6ea` with sign panels; stripe 1.20. `#fdf6ea,#ffc300,#4f7cac,#b5532f,#6a8f4e,#c8ccd2`. Engine: saw+sub 26-110 Hz. Horn: A2+E3. Spawns: Rustwater, the Bayline Expressway. If it fits in a box, it is already in a Hogfish.

**Remora**, wheels 6×0.46, twin rears  
`chassis:6.5×2.1×0.28@0,0.42 deck:3.7×2.3×0.25@-1.2,0.7 body:1×2.2×0.75@1.55,0.7 hood/f:1.14×2.2×0.75@2.62,0.7 cabin:1.4×2.1×0.85@1.75,1.45 roof:0.39×1.74×0.06@1.68,2.3 lightbar:0.25×1.4×0.14@1.67,2.36 mast:0.3×0.5×1.35@0.4,0.95 boom:3.4×0.25×0.25@-1.35,1.9 hook:0.15×0.12×0.8@-3.02,0.9 lockers:1.4×0.35×0.45@-0.55,0.95×2`  
Deck, boom `#1b1924`, light bar amber; stripe 1.10. `#ffc300,#ff9a3c,#4f7cac,#f7f3ea,#d7263d,#2ec4b6`. Engine: saw+sub 26-115 Hz. Horn: G2+D3. Spawns: Scrap Mile, Park & Sons Auto. Reverse to within 1.5 m of a car and the hook latches. The boom tilts 10°.

**Whelk**, wheels 6×0.50  
`chassis:8×2.3×0.32@0,0.48 body:1×2.4×0.8@2.4,0.8 hood/f:1.04×2.4×0.8@3.42,0.8 cabin:1.4×2.3×0.9@2.6,1.6 roof:0.39×1.94×0.06@2.53,2.5 drum:4.6×2.3×2.3@-0.7,1.2 chute/r0:1.2×0.5×0.7@-3.4,0.9 hopper:0.7×0.9×0.7@-2.85,2.6 tank:0.5×1.8×0.7@1.55,0.8 cradles:0.4×2×0.5@-2.6,0.8×2`  
Drum is 8-sided, tipped 12° nose-down, turns 0.4 rev/s, spiral band in the accent. `#ff9a3c,#ffc300,#f7f3ea,#4f7cac,#b5532f,#7fd6e8`. Engine: saw+sub 22-90 Hz plus drum rumble. Horn: F2+C3. Spawns: East Strand, Phase Four. A crash above 60 km/h dumps a 6 m grey slick: grip 0.5 for 20 s.

**Pelican**, wheels 6×0.50  
`chassis:8.5×2.3×0.32@0,0.48 cab:1.84×2.5×2.1@3.27,0.8 beak/f0:0.8×2.3×0.2@3.85,2.9 hopper:5.1×2.5×2.4@-0.3,0.9 pouch/r:1.4×2.5×2.7@-3.55,0.6 arms:1.3×0.12×0.3@-3.3,1.2×2 stack:0.15×0.15×0.5@2.22,2.9 beacon:0.2×0.2×0.15@3.15,2.9 steps:0.5×0.2×0.3@2.8,0.5×2`  
Cab `#fdf6ea`, pouch `#ffa02e`; stripe 1.40. `#f7f3ea,#2ec4b6,#6a8f4e,#ffc300,#9fd2ff,#ff8f7a`. Engine: saw+sub 22-95 Hz, hydraulic whine. Horn: E2+B2. Spawns: every street Monday 05:00-08:00. Eats bins whole. The pouch tips up 40°.

**Clam**, wheels 0.46  
`chassis:6.2×2.2×0.28@0,0.42 hull:4.14×2.4×2@-0.97,0.7 body:0.8×2.3×1@1.5,0.7 hood/f:1.14×2.3×1@2.47,0.7 cabin:1.4×2.2×0.8@1.8,1.7 roof:0.39×1.84×0.06@1.72,2.5 lids:0.06×2.2×0.95@-3.07,0.75×2 bullbar:0.06×2.2×0.8@3.07,0.5 beacon:0.2×0.2×0.1@-1,2.7`  
Clam Secure livery: one pink band at 1.70, glass a 0.3 slit. `#c9cdd4,#6f6a78,#b8cfe0,#e0e0e6,#2e4a6b,#f7f3ea`. Engine: saw+sub 24-100 Hz. Horn: G2+D3. Spawns: First Bayhaven Savings, Galleria Flamingo at 10:00. At 40% health the rear lids pop and drop five $400 cash bags. Taking one: heat +2.

**Sturgeon**, wheels 0.34  
`sill:7.6×1.9×0.24@0,0.22 body:4.81×1.84×0.48@-0.17,0.44 hood/f:1.5×1.84×0.48@2.99,0.44 boot/r:1.15×1.84×0.48@-3.14,0.44 cabin:4.7×1.7×0.48@-0.17,0.92 roof:3.69×1.34×0.06@-0.24,1.4 scutes:0.2×0.2×0.04@-1.8,1.46×3 aerial/r0:0.6×0.4×0.12@-3.2,0.92 grille:0.06×1×0.3@3.77,0.44`  
Roof a shade darker; scutes are roof lamps 1.5 apart; stripe 0.64. `#150f3d,#fdf6ea,#ff9eb5,#c8ccd2,#7a3b69,#e0b33c`. Engine: triangle+sub 34-135 Hz. Horn: F4+C5. Spawns: The Exchange, Sandpiper Isle, the yacht club. Turns in three moves and one apology.

## Buses

**Manatee**, wheels 6×0.50, twin rears  
`chassis:11.5×2.45×0.35@0,0.3 body:11.05×2.55×1.15@-0.17,0.65 glass:10.7×2.5×0.85@-0.1,1.8 roof:11.15×2.55×0.3@-0.12,2.65 snout/f:0.4×2.45×1.15@5.55,0.65 screen/f0:0.45×2.4×0.85@5.47,1.8 sign:0.15×1.6×0.3@5.38,2.65 aircon:2.5×1.6×0.15@-0.5,2.95 doors:1.2×0.05×1.9@4.25,0.7×2 bumper:0.06×2.55×0.25@5.72,0.35`  
Body `#fdf6ea`, mango wave band at 1.0, sign "9 Heron Walk", kerb-side doors at 4.6 and 9.4. `#8fe3cf,#9fd2ff,#ffc98f,#7fd6e8,#ff9eb5,#c9a8ff`. Engine: saw+sub 20-85 Hz, door hiss. Horn: F2+F3. Spawns: Central Bus Terminal, Coral Boulevard, Heron Walk Drive. Huge, slow, pushes everything. Mags's favourite.

**Manatee S**, wheels 6×0.50, twin rears  
`chassis:10.8×2.4×0.35@0,0.4 body:9.15×2.5×1.1@-0.78,0.75 glass:8.8×2.45×0.7@-0.7,1.85 roof:9.2×2.5×0.35@-0.75,2.55 hood/f:1.49×2×1@4.6,0.75 screen/f0:0.5×2.3×0.7@3.85,1.85 flashers:0.15×0.15×0.1@3.67,2.9×2 stoparm:0.05×0.45×0.45@3.22,1.3 mirrors:0.1×0.3×0.4@4.25,1.6×2`  
Roof `#fdf6ea`, ink bands at 1.0 and 1.6. `#ffa02e,#ffb347,#ffc300,#ffc98f,#ff9a3c,#ffe38a`. Engine: saw+sub 22-90 Hz. Horn: G2+G3. Spawns: Northgate at school hours, the scrapyard. Mags drove one for 31 years. The stop arm swings out with Bus Driver Voice.

## Two wheels

**Pinfish**, wheels 2×0.22  
`deck:0.55×0.32×0.07@0.12,0.2 tail:0.75×0.34×0.41@-0.47,0.27 seat:0.65×0.3×0.1@-0.42,0.68 shield:0.1×0.42×0.63@0.45,0.22 column:0.08×0.08×0.2@0.5,0.85 bars:0.06×0.7×0.05@0.49,1.05 lamp:0.1×0.16×0.14@0.59,0.88 mudguard:0.4×0.14×0.06@0.65,0.44`  
Shield, mudguard `#fdf6ea`; stripe 0.45. `#8fe3cf,#ff9eb5,#fff1c9,#9fd2ff,#ffa02e,#c9a8ff`. Engine: square 90-360 Hz. Horn: B5+C#6. Spawns: Tideline, Palma Vieja, the Keys. Teo's ride. His whole career is strapped to one.

**Needlefish**, wheels 2×0.30  
`frame:0.95×0.22×0.34@0,0.32 fairing/f:0.7×0.42×0.52@0.52,0.4 screen/f0:0.3×0.3×0.2@0.58,0.92 tank:0.5×0.3×0.24@0.18,0.66 seat:0.45×0.26×0.12@-0.3,0.66 tail/f0:0.5×0.22×0.22@-0.72,0.7 bars:0.06×0.62×0.05@0.43,0.86 pipe:0.7×0.1×0.1@-0.52,0.4 needle:0.15×0.08×0.08@0.95,0.62`  
Tank, tail in the accent. `#29e6ff,#ff3fa4,#5dff9b,#ffc300,#fdf6ea,#ff5a5a`. Engine: saw 110-620 Hz. Horn: A5+B5. Spawns: the expressway, The Paintworks at night. Fast and fragile. Any hit above 40 km/h throws the rider.

**Bowfin**, wheels 2×0.32  
`frame:1.1×0.25×0.25@-0.05,0.3 engine:0.5×0.4×0.35@-0.05,0.25 tank:0.6×0.36×0.24@0.15,0.6 seat:0.6×0.4×0.13@-0.45,0.55 fender:0.7×0.26×0.08@-0.85,0.62 fork:0.4×0.14×0.63@0.65,0.32 bars:0.06×0.9×0.05@0.33,1.05 lamp:0.17×0.18×0.18@0.74,0.78 pipes:1.2×0.09×0.09@-0.5,0.22×2 backrest:0.05×0.28×0.37@-0.77,0.68`  
Engine, pipes steel; decal by seed. `#150f3d,#7a3b69,#1f6f5c,#d7263d,#c8ccd2,#e0b33c`. Engine: square+sub 28-140 Hz, chopped at 9 Hz at idle. Horn: E4+F#4. Spawns: Big Earl's, Rustwater, Flip-Flop Key. Loud on purpose.

**Cicada**, wheels 2×0.33  
`frame:0.9×0.16×0.38@0,0.42 tank:0.4×0.26×0.2@0.2,0.8 seat:0.7×0.2×0.1@-0.35,0.84 fender-f:0.6×0.16×0.04@0.7,0.78 fender-r:0.55×0.16×0.04@-0.78,0.86 plate:0.04×0.24×0.24@0.69,0.86 bars:0.06×0.8×0.05@0.53,1.17 pipe:0.7×0.08×0.1@-0.5,0.7 fork:0.1×0.14×0.75@0.62,0.4`  
Fenders, plate `#fdf6ea`. `#5dff9b,#ffc300,#ff5a5a,#29e6ff,#fdf6ea,#ffa02e`. Engine: square+noise 80-420 Hz. Horn: D6+E6. Spawns: Mudcat Glades, Heron Marsh. Sand, grass and dirt cost it half the usual grip.

**Plover**, wheels 2×0.34  
`toptube:0.6×0.04×0.04@0.04,0.8 downtube:0.53×0.04×0.48@0.11,0.32 seattube:0.06×0.04×0.58@-0.19,0.32 saddle:0.27×0.14×0.05@-0.19,0.9 stays:0.36×0.03×0.46@-0.35,0.34×2 fork:0.15×0.08×0.51@0.45,0.34 bars:0.05×0.56×0.05@0.37,1 basket:0.3×0.36×0.23@0.58,0.72`  
Basket `#8a6f55`; tubes run corner to corner of their spans. `#ff8f7a,#7fd6e8,#fff1c9,#b5e48c,#c9a8ff,#f7f3ea`. Engine: none, a chain tick. Horn: bell, 2,100+3,150 Hz. Spawns: Heron Walk promenade, Bayfront Park. The sprint key adds 10 km/h and spends stamina.

**Sandflea**, wheels 2×0.25  
`toptube:0.55×0.05×0.05@0.03,0.52 downtube:0.53×0.05×0.27@0.07,0.28 seattube:0.05×0.05×0.34@-0.22,0.28 saddle:0.22×0.12×0.05@-0.24,0.62 fork:0.14×0.07×0.35@0.4,0.25 bars:0.05×0.6×0.05@0.29,0.9 crossbar:0.04×0.4×0.04@0.29,0.8 pegs:0.06×0.1×0.06@-0.5,0.22×4`  
Bars, pegs steel; tyres in the accent. `#ff3fa4,#29e6ff,#ffc300,#5dff9b,#150f3d,#c8ccd2`. Engine: none, a freewheel click. Horn: none. Spawns: the plaza, Wet Paint Alley. The jump key hops 0.9 m. Grinds along rails and curbs.

**Sanderling**, wheels 2×0.10  
`deck:0.65×0.15×0.04@-0.08,0.08 neck:0.15×0.06×0.2@0.32,0.1 stem:0.06×0.05×0.9@0.38,0.2 bars:0.05×0.45×0.05@0.38,1.1 pack:0.06×0.1×0.35@0.32,0.35 guard:0.22×0.12×0.03@-0.44,0.2`  
Deck `#1b1924`; one colour per district. `#ff4fa8,#29e6ff,#5dff9b,#ffa02e,#b46bff,#fff1c9`. Engine: sine 300-700 Hz. Horn: bell, 2,400+3,600 Hz. Spawns: three a block in Tideline and Meridian. Left all over the sidewalks. Falls over when you step off.

## Small and odd

**Birdie**, wheels 0.22  
`chassis:2.4×1.2×0.17@0,0.15 nose/f:0.8×1.1×0.4@0.75,0.32 bench:0.55×1.1×0.3@-0.18,0.32 backrest:0.1×1.1×0.4@-0.47,0.62 bags:0.22×0.22×0.93@-0.89,0.32×2 posts:0.05×0.05×1@-0.47,0.72×4 canopy:1.2×1.2×0.08@-0.05,1.72 screen:0.04×1.1×0.68@0.32,0.72`  
Canopy, bench `#fdf6ea`; posts at 0.70 and 1.50; stripe 0.50. `#f5ecd7,#b7c9a8,#c9cdd4,#f0d0c8,#fdf6ea,#3fb86a`. Engine: triangle whine 200-520 Hz. Horn: D5+Eb5. Spawns: Mallard Greens, Sandpiper Isle, the yacht club. Silent. Fits on sidewalks. The association owns 200.

**Coot**, wheels 0.13  
`deck:1.1×0.5×0.1@-0.05,0.12 shroud:0.45×0.56×0.23@-0.43,0.22 seat:0.4×0.46×0.1@-0.33,0.48 backrest:0.07×0.46×0.42@-0.52,0.58 tiller:0.07×0.07×0.68@0.39,0.22 bars:0.06×0.5×0.05@0.36,0.9 basket:0.22×0.36×0.23@0.54,0.55 flag:0.02×0.02×0.85@-0.59,1`  
Seat `#1b1924`; orange pennant on the flag. `#d7263d,#4f7cac,#c8ccd2,#7a3b69,#1f6f5c,#150f3d`. Engine: triangle whine 150-300 Hz. Horn: C5+Db5. Spawns: Mallard Greens, Galleria Flamingo, the promenade. Nobody flees from it. At heat 1 the deputy walks beside you.

**Cricket**, wheels 0.20 front, 0.26 rear  
`frame:1.65×0.5×0.16@0.03,0.22 hood/f:0.78×0.6×0.42@0.49,0.38 deck:0.8×1×0.12@0.05,0.06 chute:0.3×0.2×0.12@0,0.08 seat:0.4×0.42×0.12@-0.45,0.62 backrest:0.07×0.42×0.31@-0.67,0.74 column:0.06×0.05×0.22@0.05,0.8 rim:0.04×0.34×0.16@-0.02,0.94 fenders:0.55×0.2×0.24@-0.53,0.38×2`  
Deck `#ffc300`, seat `#1b1924`. `#3fb86a,#ffc300,#d7263d,#ffa02e,#4f7cac,#6a8f4e`. Engine: square+noise 45-110 Hz. Horn: none. Spawns: Mallard Greens, Bayfront Park, the Speedbowl infield. Leaves a 1 m stripe on grass. Uninvited mowing in Mallard Greens: $50 fine.

**Fiddler**, wheels 0.28  
`body:1.25×1.2×0.72@-0.32,0.18 weight:0.4×1.2×0.92@-1.1,0.18 posts:0.06×0.06×1.19@-0.82,0.9×4 guard:1.1×1.1×0.06@-0.35,2.09 mast:0.16×0.9×2@0.4,0.1 carriage:0.08×0.9×0.5@0.52,0.15 fork-big:1.1×0.16×0.06@0.75,0.1 fork-small:0.54×0.1×0.05@0.83,0.1 beacon:0.12×0.12×0.12@-0.34,2.15`  
Weight `#1b1924`, forks `#6f6a78`; posts at 0.45 and 1.45. `#ffc300,#ff9a3c,#d7263d,#4f7cac,#f7f3ea,#2ec4b6`. Engine: triangle whine plus hydraulics. Horn: E5+F5. Spawns: The Gantries, Storm Mart yards. One fork is bigger, like the crab. Rear steering. Lifts 1,200 kg to 2 m.

**Gopher**, wheels 0.30  
`body:3×1.5×0.53@0,0.22 hood:1.2×1.3×0.13@0.8,0.75 bumper:0.15×1.5×0.4@1.42,0.15 bench:0.4×1.3×0.15@-0.4,0.75 backrest:0.1×1.3×0.35@-0.63,0.9 screen:0.04×1.3×0.42@0.18,0.88 beacon:0.12×0.12×0.15@-1.14,0.75 hitch:0.12×0.2×0.12@-1.44,0.3`  
Hazard chevrons on the tail; stripe 0.45. `#fdf6ea,#ffc300,#c8ccd2,#9fd2ff,#ff9a3c,#4f7cac`. Engine: saw 30-80 Hz. Horn: D5+Eb5. Spawns: the airport apron, Hangar Row. Tows four baggage carts in a snake. Each spills six bags.

**Skink**, wheels 0.28  
`frame:1.4×0.5×0.3@0,0.28 fenders-f:0.65×0.32×0.08@0.62,0.6×2 fenders-r:0.7×0.36×0.08@-0.6,0.6×2 tank:0.5×0.36×0.22@0.2,0.58 seat:0.6×0.3×0.12@-0.35,0.72 column:0.06×0.08×0.34@0.39,0.8 bars:0.06×0.8×0.06@0.38,1.14 rack-f:0.45×0.7×0.04@0.73,0.7 rack-r:0.5×0.8×0.04@-0.75,0.72 lamp:0.1×0.3×0.12@0.95,0.5`  
Racks, frame `#1b1924`. `#5dff9b,#ffc300,#d7263d,#4f7cac,#150f3d,#ffa02e`. Engine: square 70-380 Hz. Horn: A5+Bb5. Spawns: Mudcat Glades, the Keys, Scale & Tail. Sand, grass and dirt cost it half the usual grip.

**Tortoise**, wheels 0.42 front, 0.75 rear  
`frame:3.4×0.7×0.4@0,0.55 hood:1.7×0.8×0.7@0.85,0.95 grille:0.08×0.8×0.95@1.74,0.7 stack:0.1×0.1×0.85@0.35,1.65 seat:0.5×0.5×0.15@-0.75,1.15 fenders:1.4×0.45×0.6@-1.1,1×2 posts:0.08×0.08×1.02@-1.61,1.6×4 shell:1.6×1.6×0.08@-0.9,2.62`  
Hubs `#ffc300`, shell `#8a6f55` with 13 hexagon plates; posts at 0.25 and 1.70. `#3d6b4a,#d7263d,#4f7cac,#ffc300,#ffa02e,#6a8f4e`. Engine: saw+sub 18-60 Hz, chugs at 4 Hz. Horn: G3+Ab3. Spawns: Mudcat Road, Mount Seagull. Wins eventually.

## Off-road

**Bullfrog**, wheels 0.85, 0.5 wide  
`frame:4.6×1.4×0.3@0,1.45 deck:4.3×2.5×0.1@-0.05,1.75 bench-f:0.5×1.6×0.4@0.75,1.85 bench-r:0.5×2.2×0.4@-0.65,2.05 engine:1×1×0.7@-1.7,1.85 posts:0.08×0.08×1.07@-1.21,1.85×4 canopy:3×2.3×0.08@0.2,2.92 eyes:0.3×0.3×0.3@1.95,2.05×2`  
Canopy `#fdf6ea`; eyes are headlamps on stalks; posts at 1.25 and 4.10. `#3d6b4a,#6a8f4e,#8a6f55,#b5532f,#ffc300,#5a4a32`. Engine: saw+sub 24-110 Hz. Horn: A2+Eb3. Spawns: Nilda's dock, the fish camp. Huge wheels. Wades water up to 1.6 m deep without stalling.

**Sandshark**, wheels 0.33 front, 0.40 rear  
`tub:1.9×1.2×0.42@-0.15,0.3 nose/f0:0.9×1×0.4@1.25,0.3 engine:0.6×0.8×0.5@-1.4,0.35 seats:0.5×0.45×0.6@-0.45,0.45×2 hoop-f:0.08×1.3×0.7@0.34,0.72 hoop-r:0.08×1.3×0.7@-0.81,0.72 rails:1.23×0.06×0.06@-0.23,1.36×2 fin/f0:0.6×0.05×0.3@-0.3,1.42 lamps:0.1×1×0.1@0.35,1.42`  
Hoops, rails are open tube frames; fin in the accent. `#ffa02e,#29e6ff,#ff3fa4,#fff1c9,#5dff9b,#ffc300`. Engine: square+noise 60-340 Hz. Horn: E4+Bb4. Spawns: the west beach, the Keys. Sand costs it no grip at all.

**Sawfish**, wheels 0.85, 0.9 wide  
`frame:4.4×1.4×0.5@0,1.4 bed:1.8×2.1×0.6@-1.5,1.9 body:1.7×2.05×0.6@0.25,1.9 hood/f:1×2.05×0.6@1.6,1.9 cabin:1.65×1.9×0.7@0.28,2.5 roof:0.64×1.54×0.06@0.2,3.2 lights:0.1×1.4×0.14@0.15,3.26 rostrum:0.7×0.6×0.12@2.45,2 teeth:0.7×0.12×0.06@2.45,2.03×2`  
Rostrum, teeth steel; each `teeth` strip is five saw points. `#b46bff,#5dff9b,#ff5a5a,#ffc300,#29e6ff,#150f3d`. Engine: saw+square+sub 26-180 Hz. Horn: D2+Ab2. Spawns: the Speedbowl infield on Fridays. Drives over any vehicle under 1.5 m tall, taking 60 health off it.

## Rules for every sheet

- Two-wheelers lean up to 35° and throw the rider on a hit above 40 km/h.
- Anything 1.2 wide or less with a top speed under 40 km/h may use sidewalks; people step aside.
- Every engine-driven vehicle has a radio. Pedalled ones and the Sanderling do not.
- At zero health anything with an engine explodes: `04-systems.md` section 4.

## New names

None. `flounder` (lowrider) comes from `04-systems.md`; canon section 7 leaves it out. It is kept at tier A because day 3 ships it.
