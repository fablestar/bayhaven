# Bible · art · Sound effects

One hundred and four sounds as Web Audio recipes: oscillators, noise, filters, envelopes and gains, with numbers. These are the code-made versions, and none needs an audio file. Engines keep day 1's two-oscillator hum and grow from it; guns, impacts and the explosion are real ones, kept short. Each id is the name passed to `audio.sfx(name, opts)` or `audio.loop(name, opts)`.

Tier: A unless a row carries another tag.

## 1. How to read a recipe

|Mark|Means|
|---|---|
|`sine 300→150/0.12`|an oscillator: type, start frequency in Hz, where it glides to, over how many seconds (an exponential ramp)|
|`noise white`, `pink`, `rumble`|three shared 2 s loops: white; pink (white through a 2,000 Hz low-pass, mixed half and half with white through 300 Hz); rumble (`y = 0.98y + 0.02w`, scaled to full level). Each play starts at a random offset|
|`lp`, `hp`, `bp f Q`|a biquad filter: low-pass, high-pass, band-pass, frequency, and Q if it is not 0.7|
|`env a/d`|gain rises in `a` seconds and falls to zero in `d`. `env a/d/s/r` holds at level `s` until released|
|`g`|peak gain into the sound's bus, where 1 is full scale|
|`>`|feeds into|
|`+`|layered with|
|loop|runs until stopped; values are smoothed over 40 ms|

Rules for every sound:

- Distance: `gain × 1 / (1 + (d / 12)²)`, silent past 150 m. Pan: `clamp(dx / 30, ±0.8)`, where dx is how far right of the camera it is.
- Far sounds arrive late: gunshots, explosions and thunder past 60 m are delayed by d / 343 s and low-passed at `12,000 / (1 + d / 60)` Hz.
- The same id is not played twice within 40 ms. Each repeat is detuned by up to ±4%.
- Voices alive at once: 24, 36 and 48 on `low`, `medium` and `high`. The quietest old voice is stolen first; loops for the player's own vehicle are never stolen.
- A passing vehicle's pitch is multiplied by `1 + closing speed / 343`, kept within 0.9 to 1.12.
- Buses: everything here goes to effects unless its group says ambience, voice, UI or music.

## 2. Engines (1 to 16)

Day 1's recipe is the base: oscillator A at `f`, oscillator B through its own gain, both into one low-pass, then a gain. Its numbers stay: `f = 40 + r × 120 + throttle × 10`, low-pass `260 + r × 1300 + throttle × 350` at Q 2, gain `0.03 + throttle × 0.03 + r × 0.015`, smoothing 0.06, 0.08 and 0.1 s. From day 2, `r` is replaced by a gear curve `q`:

|Gear|Speed, share of top|`q` runs|
|---|---|---|
|1|0 to 0.28|0 to 0.55|
|2|0.28 to 0.50|0.35 to 0.72|
|3|0.50 to 0.74|0.50 to 0.87|
|4|0.74 to 1|0.62 to 1|

`f = idle + (top - idle) × q + 6% × throttle`. On a change up the pitch drops to the next gear's start over 120 ms and the gain dips 4 dB for 80 ms. Ranges are idle to the top of fourth, as the catalogue lists them per model; the row gives the class default.

|#|id|A|B|Sub|Hz|Low-pass|Level|Extras|
|---|---|---|---|---|---|---|---|---|
|1|`engine-coupe`|saw|square × 0.5 at 0.5|none|40 to 170|260 + 1300r + 350t, Q 2|× 1|day 1's Heron|
|2|`engine-small`|square|saw × 1 at 0.35|none|55 to 210|320 + 1500r, Q 2.5|× 0.9|a buzz|
|3|`engine-sedan`|saw|triangle × 0.5 at 0.6|none|42 to 165|240 + 1100r, Q 1.5|× 0.9|the Flounder uses 32 to 130 and the lope below|
|4|`engine-muscle`|saw|square × 0.5 at 0.7|sine × 0.25 at 0.6|34 to 200|220 + 1200r + 500t, Q 3|× 1.3|lope at idle: gain wobbles at 9 Hz, depth 0.35, while r is under 0.08|
|5|`engine-sports`|saw|saw × 1.5 at 0.4|none|60 to 320|400 + 2200r + 600t, Q 3.5|× 1|high and smooth|
|6|`engine-truck`|saw|square × 0.5 at 0.6|sine × 0.5 at 0.4|36 to 155|220 + 1000r, Q 1.8|× 1.15|pickups and SUVs|
|7|`engine-van`|square|none|sine × 0.5 at 0.5|38 to 140|240 + 900r, Q 1.5|× 1|cargo rattle on bumps: `noise white > bp 1800 Q 3`, bursts of 30 to 90 ms, g 0.01 × r|
|8|`engine-boxtruck`|saw|square × 0.5 at 0.8|sine × 0.5 at 0.7|26 to 110|180 + 800r, Q 2|× 1.4|the van's rattle; an air hiss on stopping: `noise white > hp 3000`, env 0.01/0.4, g 0.12|
|9|`engine-bus`|saw|square × 0.5 at 0.8|sine × 0.5 at 0.8|20 to 85|160 + 700r, Q 2|× 1.6|`noise rumble > lp 90`, g 0.03; the hiss when doors open|
|10|`engine-scooter`|square|square × 2.01 at 0.3|none|90 to 360|700 + 2400r, Q 4, then `hp 150`|× 0.7|a buzz|
|11|`engine-bike`|saw|saw × 2 at 0.35|none|110 to 620|500 + 3200r, Q 4|× 0.95|a scream|
|12|`engine-cart`|triangle|sine × 2 at 0.25|none|200 to 520|2400|× 0.4|no gears: pitch follows speed|
|13|`engine-outboard`|saw|square × 0.5 at 0.6|none|45 to 160|300 + 900r, Q 2|× 1.1|gain chopped by a sine at 28 to 60 Hz, depth 0.4; wash: `noise pink > bp 900`, g 0.05 × r|
|14|`engine-jetski`|saw|saw × 1.01 at 0.8|none|110 to 380|900 + 2600r, Q 3|× 0.95|pitch × 1.25 while the hull is in the air|
|15|`engine-airboat`|`noise white > bp (180 + 520r) Q 1.2`, chopped by a square at 22 to 75 Hz, depth 0.6|saw 50 to 140 Hz at 0.04|none|as given|none|g 0.05 to 0.16|the fan is the sound|
|16|`engine-heli`|`noise pink > lp 420`, gain shaped by a falling saw at 13 Hz, depth 0.85|a sine 55 Hz thump on each chop, env 0.005/0.05, g 0.2|none|as given|none|g 0.04 at 300 m to 0.22 overhead|a whine: sine 1,900 Hz, g 0.006|

Only the 4 / 8 nearest other vehicles (`low` / `high`) get an engine voice: one saw through `lp 600` at their class pitch.

## 3. Tyres, impacts, horns, sirens (17 to 41)

|#|id|Recipe|
|---|---|---|
|17|`tyre-squeal`|`noise white > bp (1800 + 12 × km/h, at most 3200) Q 7` + a saw at that frequency at 0.15 of the noise; g `0.45 × clamp((slip - 0.15) / 0.4, 0, 1)`; loop|
|18|`tyre-dirt`|`noise pink > lp 900` + clicks of 5 ms, 20 to 60 a second by speed; g 0.25 × r; loop|
|19|`tyre-sand`|`noise white > bp 3500`; g 0.18 × r; loop|
|20|`tyre-wet`|`noise white > hp 2500 > lp 7000`; g 0.2 × r × wet; loop|
|21|`tyre-burst`|`noise white > lp 1200`, env 0.001/0.25, g 0.7 + `sine 180→60/0.1`, env 0.001/0.15, g 0.5. Then a rim grind loop: `noise white > bp 1100 Q 4` + square 90 Hz at 0.1; g 0.3 × r|
|22|`crash`|with `v = min(1, impact speed / 30)`: `noise white > lp (600 + 3000v)`, env 0.001/(0.12 + 0.2v), g 0.8v + the 60 Hz thump `sine 60→40/0.2`, env 0.001/0.25, g 0.9v|
|23|`crunch`|car against car: `crash` with its low-pass × 0.7 + three ticks, squares at 420, 610 and 880 Hz, env 0.001/0.03, 20 ms apart, g 0.15|
|24|`scrape`|`noise white > bp 2200 Q 3`; g 0.3 × r; loop|
|25|`glass`|`noise white > hp 5000`, env 0.001/0.08, g 0.5 + five pings, sines between 2,600 and 5,200 Hz, env 0.001/0.06, spread over 120 ms, g 0.12|
|26|`lamp-clang`|sines 310 + 472 + 811 Hz, env 0.001/0.9, g 0.3 each + a 5 ms noise click|
|27|`hydrant`|burst: `noise white > lp 2000`, env 0.005/0.3, g 0.6 + `sine 90→50/0.2`. Then a loop: `noise white > bp 1400 Q 0.6`, g 0.35 + `noise white > hp 6000`, g 0.1|
|28|`splinter`|four clicks, `noise white > bp 1800 Q 2`, env 0.001/0.04, at random within 90 ms, g 0.4|
|29|`clatter`|tables, bins, signs, a fallen panel: five hits over 0.4 s, each a triangle between 700 and 1,400 Hz, env 0.001/0.05, + `noise white > hp 3000`, env 0.001/0.03; g 0.3, falling|
|30|`thud`|a body hit: `sine 110→70/0.08`, env 0.002/0.14, g 0.5 + `noise white > lp 500`, env 0.001/0.06, g 0.25. A bullet hitting a person plays it at g 0.35|
|31|`whump`|landing a jump: `sine 80→45/0.15`, env 0.002/0.3, g 0.7v + `noise white > lp 350`, env 0.001/0.15, g 0.4 + a creak, `saw 220→180/0.2 > bp 900 Q 5`, g 0.08|
|32|`horn-car`|two squares on the model's two notes (cars: a major third; the Heron is A4 and C#5), the upper one 0.4% sharp, `> lp 2400`; env 0.01/0.06 round the hold; g 0.25|
|33|`horn-small`|`horn-car` with `lp 3200` and g 0.2. Small cars: a minor third. Two wheels: a major second. Small and odd: a minor second|
|34|`horn-truck`|trucks and vans: a fifth, `lp 1600`, g 0.3, + a saw an octave under the lower note at 0.3. Off-road: a tritone|
|35|`horn-bus`|an octave (F2 and F3), `lp 1200`, g 0.35. Bus Driver Voice: the same horn an octave down, held 0.9 s, through a 180 ms delay with 0.35 feedback, g 0.5; the music ducks 6 dB|
|36|`horn-boat`|saws at 110 and 165 Hz `> lp 500`, env 0.15/0.4 round the hold, g 0.3|
|37|`siren-sweep`|heat 1 and 2: a sine sweeping 600 to 1,200 Hz and back, 0.9 s each way, + a square at the same pitch at 0.15, `> lp 2600`; g 0.22; loop|
|38|`siren-twotone`|heat 3 and up: a sine + a square at 0.3, 960 Hz for 0.28 s then 720 Hz for 0.28 s, `> lp 3000`; g 0.24; loop|
|39|`siren-chirp`|`sine 800→1600/0.08` twice, 0.1 s apart, env 0.005/0.08, g 0.25: "pull over"|
|40|`siren-ambulance`|a wail: a triangle sweeping 700 to 1,500 Hz, 2 s up and 2 s down, `> lp 3200`; g 0.2; loop while driving to a call|
|41|`siren-ambulance-yelp`|the same triangle sweeping 700 to 1,500 Hz 3.5 times a second; g 0.22; used through junctions and for the last 60 m, then it stops and only the lights run|

## 4. Weapons and explosions (42 to 56)

A gunshot is four layers: a crack, a body, a thump and the 07 "pitched click". Past 60 m only the body and thump are heard, late and dull, by the far rule above. Every shot sends -8 dB to the effects reverb for its tail.

|#|id|Recipe|
|---|---|---|
|42|`swing`|`noise white > bp 800→2400/0.12 Q 1.5`, env 0.02/0.12, g 0.2|
|43|`punch`|`sine 140→80/0.06`, env 0.001/0.09, g 0.5 + `noise white > lp 1200`, env 0.001/0.04, g 0.3|
|44|`noodle`|the pool noodle's note from `07`: `sine 300→150/0.12`, env 0.002/0.16, g 0.5 + `sine 600→300/0.12` at 0.2|
|45|`flamingo-whack`|`triangle 420→260/0.05`, env 0.001/0.1, g 0.45 + `noise white > bp 2400 Q 2`, env 0.001/0.03, g 0.25. The tenth hit adds `splinter`|
|46|`pistol`|crack: `noise white > hp 2500`, env 0.001/0.03, g 0.6. Body: `noise white > lp 4500`, env 0.001/0.11, g 0.6. Thump: `sine 160→70/0.05`, g 0.3. Click: square 1,100 Hz, env 0.001/0.012, g 0.3|
|47|`smg`|as `pistol` with the body at env 0.001/0.06 through `lp 5500`, the click at 1,400 Hz, g 0.45 overall; 12 shots a second, each detuned up to 4%|
|48|`shotgun`|crack g 0.7. Body: `noise white > lp 3200`, env 0.001/0.22, g 0.75. The low boom: `sine 90→38/0.25`, env 0.001/0.3, g 0.8. Click at 800 Hz. A pump 0.25 s later: two clicks of `noise white > bp 1500`, env 0.001/0.03, 0.12 s apart|
|49|`flare-gun`|`sine 220→90/0.12`, env 0.002/0.15, g 0.6. Then a fizz for 6 s: `noise white > bp 3000 Q 1`, g 0.12, fading|
|50|`reload`|two clicks 0.18 s apart: square 1,800 Hz, env 0.001/0.01 + `noise white > hp 3000`, env 0.001/0.02; g 0.25. Empty: one click at 2,400 Hz, g 0.15|
|51|`ricochet`|on one hit in four on metal or stone: `sine 2400→900/0.25` with a 30 Hz wobble of 3%, env 0.001/0.28, g 0.12 + `noise white > bp 3500 Q 4`, env 0.001/0.05, g 0.2. A near miss on the player: `noise white > bp 3000→1200/0.12 Q 3`, env 0.005/0.12, g 0.18, panned across|
|52|`bullet-wall`|`noise white > bp 1800 Q 1.5`, env 0.001/0.05, g 0.3 + `sine 220→120/0.03`, g 0.15 + grit, `noise white > hp 4000`, env 0.01/0.12, g 0.06|
|53|`bullet-metal`|cars, containers, signs: sines 1,150 + 1,730 + 2,620 Hz, env 0.001/0.09, g 0.12 each + `noise white > hp 3000`, env 0.001/0.02, g 0.25. Glass plays `glass`|
|54|`bullet-water`|`noise white > bp 2600 Q 1.2`, env 0.001/0.08, g 0.2 + `sine 900→300/0.04`, g 0.1|
|55|`explosion`|a crack: `noise white > hp 1500`, env 0.001/0.04, g 0.7. The long low-passed noise: `noise white > lp 900→200/0.8`, env 0.002/1.4, g 0.9. The sub drop: `sine 120→35/0.5`, env 0.002/0.7, g 0.9. The crackle of falling debris: 14 clicks between 0.3 and 1.8 s, each `noise white > bp (1200 to 3500) Q 2`, env 0.001/0.03, g 0.25 falling to 0.05, then three `clatter` hits. Within 10 m the effects bus is muffled (`lp 800`, opening over 0.4 s). The music ducks 4 dB for 0.6 s|
|56|`firework`|up: `sine 900→2400/1.2`, g 0.1. The burst, late by distance: `noise white > lp 1800`, env 0.002/0.6, g 0.6 + `sine 70→40/0.3`, g 0.5. Crackle: 20 clicks of `noise white > hp 5000` over 0.8 s, g 0.15|

## 5. Weather and water (57 to 68) · ambience bus

|#|id|Recipe|
|---|---|---|
|57|`rain-light`|`noise pink > hp 1200 > lp 9000`; g 0.10 × rain; loop|
|58|`rain-heavy`|adds `noise white > bp 2400 Q 0.5`, g 0.22 × rain, + drips: sines between 1,800 and 3,200 Hz, env 0.001/0.03, 8 a second|
|59|`rain-roof`|inside a vehicle, in place of 57: `noise white > bp 900 Q 0.8`, g 0.2 × rain + taps, `sine 240→180/0.02`, env 0.001/0.03, 20 to 40 a second, g 0.05|
|60|`wind`|`noise pink > bp (300 + 500 × gust) Q 1.5`, gust wandering at 0.1 to 0.3 Hz; g 0.05 + 0.25 × wind / 38; loop|
|61|`gust`|hurricane, every 4 to 9 s: `noise white > bp 500→1400/1.5 Q 2`, env 0.6/1.8, g 0.5 + a howl, a sine moving 380 to 520 to 340 Hz over 2.2 s, g 0.08|
|62|`thunder-near`|a crack, `noise white > hp 2000`, env 0.001/0.05, g 0.6; then `noise white > lp 2400→150/1.8`, env 0.002/2.2, g 0.9 + `sine 55→30/1.2`, g 0.8|
|63|`thunder-far`|`noise rumble > lp 220`, env 0.4/4.5, g 0.5, its gain wobbling at 3 to 6 Hz, depth 0.5|
|64|`waves`|`noise pink > lp (600 to 2200)`, gain and filter both following `0.15 + 0.85 × max(0, sin(2πt / 7.5))²`: a wave every 7.5 s; g 0.22; loop|
|65|`splash-big`|`noise white > lp 3000→600/0.5`, env 0.002/0.7, g 0.7 + `sine 100→50/0.2`, g 0.4|
|66|`splash-small`|`noise white > bp 2200 Q 1`, env 0.002/0.16, g 0.3 + `sine 700→300/0.05`, g 0.1. Also a step in a puddle, at g 0.2|
|67|`swim`|once a stroke: `noise pink > bp 900→1600/0.25 Q 1`, env 0.08/0.3, g 0.2|
|68|`hull-slap`|each wave above 40 km/h: `sine 130→80/0.06`, env 0.001/0.12, g 0.4 + `noise white > lp 2000`, env 0.001/0.15, g 0.3. A car going under: 12 bubbles over 1.5 s, sines between 200 and 900 Hz rising 30% in 0.06 s, env 0.005/0.06, g 0.15|

## 6. Footsteps, people, animals (69 to 85)

Steps are filtered clicks, pitched ±6% at random, × 1.3 louder at a sprint. Mags's are 8% lower. Teo's slides add a flap 30 ms after each step: `noise white > bp 1200`, env 0.001/0.03, g 0.1.

|#|id|Recipe|
|---|---|---|
|69|`step-sand`|soft: `noise white > lp 700`, env 0.004/0.09, g 0.18|
|70|`step-road`|sharp: `noise white > bp 2600 Q 1.5`, env 0.001/0.035, g 0.22 + sine 180 Hz, env 0.001/0.02, g 0.08|
|71|`step-boardwalk`|hollow: `sine 150→110/0.05`, env 0.001/0.09, g 0.3 + `noise white > bp 900 Q 2`, env 0.001/0.04, g 0.15|
|72|`step-grass`|`noise pink > bp 1400`, env 0.006/0.07, g 0.14|
|73|`step-metal`|sines 520 + 780 Hz, env 0.001/0.12, g 0.12 + `noise white > hp 3500`, env 0.001/0.02, g 0.15|
|74|`blip`|voice bus. One a syllable: 70 ms, six a second, the last falls 8%, a question ends 12% up. A triangle `> lp 1800`, env 0.005/0.06, g 0.2. Pitch: Mags 180 Hz, Teo 260 Hz, the Sheriff 120 Hz through `bp 1200 Q 1` with a crackle (`noise white > bp 2000`, g 0.03), Kiki 340 Hz with a 7 Hz vibrato of 25 cents; anyone else between 140 and 320 Hz by a hash of their name|
|75|`crowd`|ambience bus: `noise pink > bp 500 Q 0.6` + `> bp 1400 Q 0.8`; g 0.02 a person within 40 m, at most 0.2, wandering between half and full at 0.7 Hz; loop|
|76|`yelp`|a saw moving 420 to 760 to 380 Hz over 0.3 s `> bp 1200 Q 2`, env 0.01/0.3, g 0.25; pitched ±30% by the person. A scream when shots are fired: the same, held 0.8 s, 20% higher|
|77|`ooh`|five saws between 180 and 260 Hz, each rising 12% over 0.5 s, `> bp 800 Q 1.2`, env 0.12/0.6, g 0.2: a crowd watching|
|78|`cheer`|`noise pink > bp 1800`, env 0.2/1.6, g 0.3 + six whistles, sines between 1,600 and 2,400 Hz rising 20%, env 0.02/0.2, g 0.06|
|79|`grumble`|getting up after a light hit: a saw between 110 and 150 Hz with a 14 Hz wobble of 8%, `> lp 600`, three bursts of 0.12 s, g 0.2|
|80|`gull`|`saw 1400→900/0.25 > bp 1800 Q 4`, two or three calls 0.3 s apart, env 0.02/0.22, g 0.12|
|81|`pelican`|Gerald: a square at 95 Hz with a 22 Hz gain wobble, `> lp 500`, env 0.03/0.3, g 0.2; then two bill clacks, `noise white > bp 1500`, env 0.001/0.02|
|82|`cicadas`|`noise white > bp 5200 Q 9`, chopped by a square at 38 Hz, swelling from 0.2 to 1 and back over 6 s; g 0.08; loop by day|
|83|`frogs`|three to six frogs panned apart. Each: a sine at 480, 620 or 760 Hz in pulses of env 0.005/0.03, 18 a second, in croaks of 0.4 s every 1.5 to 4 s; g 0.07; night|
|84|`alligator`|a bellow: a saw at 48 Hz with a 12 Hz wobble, `> lp 220`, env 0.3/1.4, g 0.4. A hiss: `noise white > hp 3000`, env 0.1/0.8, g 0.2|
|85|`songbird`|a sine moving 2,800 to 3,600 to 2,600 Hz in 0.12 s, three to five chirps 0.09 s apart, env 0.005/0.05, g 0.08. The dazed-birds effect loops it at 0.06 s, panned round at 1.2 turns a second|

## 7. District ambience (86 to 92) · ambience bus

|#|id|Recipe|
|---|---|---|
|86|`city-hum`|`noise rumble > lp 180`, g 0.12 + a sine at 120 Hz, g 0.01 + far traffic, `noise pink > bp 700 Q 0.5`, g 0.05 × traffic density; loop|
|87|`crossing-beep`|a sine at 1,000 Hz, 0.1 s on and 0.4 s off while people may cross, 0.1 on and 0.1 off for the last 5 s; g 0.05; heard within 30 m|
|88|`ship-horn`|saws at 73 and 110 Hz `> lp 400`, env 0.3/1.2 round a 2.5 s hold, g 0.3, with a full reverb send; every 90 to 240 s|
|89|`crane`|while a crane moves: a square at 1,250 Hz, 0.25 s on and off, g 0.05. A clank every 6 to 20 s: sines 220 + 367 + 590 Hz, env 0.001/0.5, g 0.2|
|90|`sprinkler`|`noise white > hp 4000`: 12 ticks of 0.03 s at 9 a second, then a 0.6 s sweep back through `lp 6000→2000`; g 0.08|
|91|`leaf-blower`|a saw at 185 Hz + `noise white > bp 1800 Q 1`, pitch wandering 4% at 0.2 Hz; g 0.06; it never stops by day|
|92|`jet`|`noise white > bp 400→1800→300 Q 0.8` over 14 s, env 4/8, g 0.35 + a whine, `sine 2600→1900/14`, g 0.02; every 3 to 6 minutes|

|Bed|Layers (cross-faded over 3 s as the district changes)|
|---|---|
|Tideline|`waves`, a `gull` every 8 to 20 s, the nearest bar's station through `lp 500` at -22 dB|
|Meridian|`city-hum`, `crossing-beep`, a far `siren-sweep` at g 0.03 every 2 to 5 minutes|
|Palma Vieja|doorway radios (Radio Palma through `lp 700` at -24 dB). Tier B: domino clacks, `noise white > bp 2800 Q 3`, env 0.001/0.015, in runs of 2 to 5; the bell on the hour, sines 392 + 588 + 941 + 1,176 Hz, env 0.002/3.5, g 0.25, one stroke per hour|
|The Paintworks|night: the club's kick alone through `lp 120` at -14 dB. Day: spray cans, `noise white > hp 5000` in bursts of 0.3 to 0.8 s, g 0.04|
|Rustwater|`ship-horn`, `crane`, `city-hum` × 0.6|
|Northgate|`city-hum` × 1.2. Tier B: a tannoy jingle of three marimba notes before a blip line|
|Mallard Greens|`sprinkler`, `leaf-blower`, `songbird`, `cicadas` × 0.5|
|Runway Flats|`jet`, `wind` × 1.3|
|Mudcat Glades|`cicadas` by day, `frogs` by night, a far `engine-airboat` at g 0.02|
|The Islands|`waves` × 0.7. Tier B: rigging clinks in wind, sines between 2,200 and 3,400 Hz, env 0.001/0.15, one to three a second, g 0.05|

Rain, wind and thunder sit on top of any bed. In a vehicle the ambience bus drops 6 dB.

## 8. Interface and stingers (93 to 104)

UI sounds are marimba-like plucks, a sine with a fast decay, pitched in the current station's key. `K` is that key's root in octave 5; with no station it is C. They go to the UI bus.

|#|id|Recipe|
|---|---|---|
|93|`ui-move`|a sine at K, env 0.002/0.09, g 0.18 + a sine at 4K at 0.25, env 0.001/0.03|
|94|`ui-select`|`ui-move` on the root, then on the fifth 60 ms later|
|95|`ui-back`|the fifth, then the root. An error: the root and the note a semitone above it together, triangles, env 0.002/0.11, g 0.15|
|96|`ui-cash`|plucks on the root, third and fifth, 50 ms apart, + a bell: a sine at 4K, modulated at 3.5 times its frequency with index 2, env 0.001/0.5, g 0.2. A loss: fifth, third, root, no bell|
|97|`ui-follower`|a sine at the fifth an octave up, env 0.001/0.03, g 0.06; 12 a second at most; each run of ten rises a semitone and resets after 1 s of quiet|
|98|`ui-chat`|`sine 1320→1760/0.04`, env 0.002/0.12, g 0.10; the music ducks 3 dB|
|99|`ui-phone`|opening: `noise white > bp 1200→3000/0.18 Q 1.5`, env 0.01/0.18, g 0.12, then `ui-move`; closing sweeps down. The camera shutter: two clicks of `noise white > hp 4000`, 45 ms apart, g 0.3|
|100|`ui-stamp`|the postcard's stamp thud: `sine 90→50/0.1`, env 0.002/0.18, g 0.6 + `noise white > lp 400`, env 0.001/0.06, g 0.3 + a paper slap, `noise white > bp 2500 Q 1`, env 0.001/0.012, g 0.2|

Stingers are two bars each on the music bus, at the station's tempo (110 bpm with no station), in the station's or district's key. The music ducks 6 dB under them.

|#|id|Recipe|
|---|---|---|
|101|`sting-complete`|the pluck patch on eighth notes rising through degrees 1, 3, 5, 8, 3, 5, 8 across two octaves, a pad on chord I under it, and `ui-stamp` on the fourth beat of bar 2|
|102|`sting-heat`|a siren-like bend: two saws 7 cents apart `> lp 1800` slide from the fifth up a fourth in 0.5 s and back a tone, twice, over a snare roll of 16 sixteenths rising from -18 to -6 dB|
|103|`sting-knockout`|a descending slide: a sine and a triangle fall 660 to 110 Hz over 1.6 s with a 6 Hz vibrato growing to 30 cents, low-passed from 4,000 down to 400 Hz as the colour drains; one marimba note an octave below to end|
|104|`sting-district`|three marimba notes, degrees 1, 5 and the 3 above, on eighths, the last ringing 0.8 s. Keys: Tideline C · Meridian D · Palma Vieja F · The Paintworks E minor · Rustwater G minor · Northgate B flat · Mallard Greens G · Runway Flats A · Mudcat Glades E · The Islands D flat|

## New names

- The 104 sound ids above, and the noise names `white`, `pink`, `rumble`.
- The district keys in row 104.
- No new people, places or brands.
