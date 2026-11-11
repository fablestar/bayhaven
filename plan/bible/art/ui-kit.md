# Bible · art · UI kit

The HUD is a livestream overlay and nobody else's layout. It is drawn on one 2D canvas (`#hud`) over the game canvas, so photos and clips can include it. Menus, the phone, shop menus, the map screen and settings are DOM. The four cards (postcard, wristband, mugshot board, luggage tag) are canvas-drawn so they can be saved as images. Sizes are CSS pixels at 1920×1080 ("D") and at 844×390 held sideways with touch ("P").

Tier: A unless a row carries another tag.

## 1. Base values and rules

|Name|Value|
|---|---|
|Font|`"Trebuchet MS", "Segoe UI", system-ui, sans-serif` (day 1's stack). Big words italic 800 or 900. Never smaller than 14 px|
|Ink, pink, cyan, sand, mango|`#150f3d` · `#ff4fa8` · `#29e6ff` · `#fff1c9` · `#ffa02e`|
|Pill|ink at 55%, radius half its height, white text|
|Meaning|pink is live or dangerous; cyan can be pressed; mango is cash and side jobs; mint `#5dff9b` is gain|
|Text with no pill|shadow 0 1 px 6 px `rgba(20, 5, 40, .7)` (day 1)|
|Overshoot ease|`cubic-bezier(0.34, 1.56, 0.64, 1)`; on canvas `1 + 2.7(t - 1)³ + 1.7(t - 1)²`|
|Reduce motion|slides and pops become 120 ms fades; no shake, swing, tilt or flash|

**Canvas rules.** The backing store is CSS size × `dpr`, `dpr = min(devicePixelRatio, 2)`, set on resize; the game canvas may drop its own resolution, the HUD never does. All numbers below are multiplied by `dpr` when drawing. Each piece owns a rectangle (returned by `hud.layout()`), pieces never overlap, and a piece is cleared (with an 8 px bleed for glows) and redrawn only when its value changes or while it animates. The minimap redraws at 10 Hz. Safe-area insets are added to every edge offset. Between P and D, sizes scale by `k = clamp((h - 390) / 690, 0, 1)`, where h is the viewport height. `hud.clipMode(true)` hides hints and prompts and keeps the badge.

## 2. HUD pieces

Offsets are from the named edges. "cx" is the horizontal centre.

|id|D: place, size|P: place, size|Drawn as|Redraw and motion|
|---|---|---|---|---|
|`cash`|left 24, top 24; h 44|left 14, top 10; h 28|pill; a mango chip 28×20 (P 20×14), radius 10, holding an ink `$`; the amount `18,250` italic 800 24 (P 16)|on `cash:changed`: digits roll for 600 ms; a 2 px mint ring for 400 ms on a gain, pink and a 3 px shake on a loss; `+$500` rises 24 px and fades in 900 ms|
|`followers`|right of `cash`, gap 10; h 44|gap 6; h 28|pill; icon `follower`; `12.8K` italic 800 24 (P 16); the word `followers` 16 at 80%, D only. Under 10,000 the full number; from 1,000,000 `1.25M`|rolls on change, cyan ring 300 ms; a milestone pops to 1.15 and back in 500 ms|
|`health`|left 24, top 76; 240×8|left 14, top 42; 150×6|track ink 55%, fill pink; armour is a mint bar 4 tall (P 3) under it; stamina a cyan bar under that|shown under 100 or for 5 s after a change; fills ease 200 ms; a hit flashes the bar white for 120 ms and pulses it under 25|
|`objective`|left 24, top 104; up to 520 wide|left 14, top 58; up to 260|a cyan chevron, then italic 700 20 (P 14) with shadow|a new step: the old line is struck in pink (200 ms) and slides out, the new slides in 250 ms|
|`timer`|left 24, top 136|left 14, top 78|`2:30` 800 32 (P 20), tabular digits; a progress bar 240×12 (P 150×8) under it when a step has one|each second; pink and pulsing 1 Hz under 10 s|
|`clock`|right 24, top 24; h 44|right 14, top 10; h 28|pill; `Wed` 14 at 80%, `17:42` 24 (P 16), 2 px letter-spacing|each 10 game minutes, as day 1|
|`live`|left of `clock`, gap 10; h 44|gap 6; h 28|pink at 92%; a white dot r 6; `LIVE` italic 900 20 (P 14); viewers 800 24 (P 16)|at heat 3 drops in from -60 px in 300 ms, overshoot; dot blinks 1 Hz; count rolls. Unseen: ink fill, pink edge, a down arrow. At zero: `OFF AIR` for 1.2 s, then up and out in 250 ms|
|`chat`|right 24, top 80; 320×130, 5 lines of 26|right 14, top 44; 220×60, 3 lines of 20|per line: ink 55%, radius 8; the handle 700 15 (P 14) in pink, cyan or mango by name; the message in white|a line enters from below in 180 ms, lives 6 s, fades 800 ms; 0.5 to 4 lines a second by viewers|
|`ticker`|right 24, top 216; 320×28|right 14, top 108; 220×22; heat 4 and up only|ink 70%; mango italic 15 (P 14) scrolling 90 px a second, clipped|while live|
|`minimap`|left 24, bottom 24; 180×180|left 14, bottom 14; 120×120|a rounded rectangle, radius 20 (P 14), 2 px white edge at 55%; map tiles turned to the heading; the player arrow fixed at 60% of the height; an `N` tab on the edge|10 Hz. Shows 300 m across on foot, 520 m above 60 km/h, easing over 600 ms|
|`heat`|left 224, bottom 126; five circles d 24, gap 10|left 150, bottom 104; d 18, gap 6|unlit: ink 55% with a 2 px white ring at 40%. Lit: pink in places 1, 3, 5 and cyan in 2, 4, with a 12 px glow. On D the level name sits under them, italic 14, for 2 s|lit lights swap pink and cyan every 400 ms at heat 1 and 2, every 200 ms from 3. A new light pops 0 to 1.3 to 1 in 300 ms. Unseen: lit lights dim to 50% and the top one fades with the viewers. Cleared: all flash white 150 ms|
|`speed`|left 224, bottom 24|cx, bottom 34|`86` italic 900 44 (P 22), `km/h` 14 with 2 px spacing, ` · Heron` italic 700 20 (P 14); shadow|when the rounded number changes; hidden on foot|
|`radio`|right 24, bottom 60; h 40|cx, top 10; h 28; up to 200 wide|pill; icon `note` in cyan; station italic 800 18 (P 14); ` · ` and the song 14 at 80%, D only|D: slides in 24 px from the right for 4 s on `radio:station`. P: always there in a vehicle; a swipe changes station|
|`badge`|right 24, bottom 24|cx, bottom 12|`Bayhaven · Day 5 build` 16 (P 14) at 85%, 1 px spacing, shadow, no pill|once. On touch it sits at the centre because the corner is under a thumb|
|`prompt`|cx, bottom 150; h 44|cx, bottom 102; h 30; pad and keyboard only|pill; a cyan key cap 30×30, radius 8, with an ink letter 800 18; the text 18 (P 14)|in 150 ms; pulses once a second|
|`hint`|cx, bottom 96|cx, bottom 66|pill, padding 8 and 14, radius 20, text 16 (P 14), 1 px spacing (day 1's hint, text raised from 13)|in 300 ms; out over 800 ms (day 1) when the thing is done, or after 8 s|
|`toast`|cx, top 24; h 40; up to 3, 48 apart|cx, top 44; h 30; one; up to 280 wide|pill; an icon and text 16 (P 14)|drops 16 px in 200 ms, stays 4 s, out 300 ms. Waits while the tag is down|
|`drift`|cx, top 230|cx, top 130|`Drift 8,420` italic 900 36 (P 22) in mango, shadow|counts up; at `drift:end` grows to 1.2 and flies to `followers` in 500 ms|
|`subtitle`|cx, bottom 210; up to 720 wide|cx, bottom 134; up to 340|ink 70%, radius 14; a 48 (P 36) rounded square with the speaker's face on their shirt colour; the name 800 16 (P 14); the line 20 (P 14) in white|in 120 ms; hides `hint` and `prompt` while up|
|`quickbar`|right 24, bottom 112; three slots 56×56, gap 8|drawn by the touch layout|slot: ink 55%, radius 12; the weapon icon; ammo 14 at the lower right; the chosen slot has a 3 px cyan edge|shown while armed, and for 4 s after a change. Three slots, never a wheel|

Portrait (390×844): `cash` and `clock` on the top row, `live` in place of `followers` while live; `minimap` 120 at left 14, top 46; `heat` and `speed` to its right; `chat` under them only while live; `badge` at cx, top 176; `hint` at bottom 190; pads as in section 7 without the minimap offset.

## 3. Menus (DOM)

|Piece|D|P|Look and states|Motion|
|---|---|---|---|---|
|Phone|360×720, right 80, top 180|300×366, right 14, top 12|body ink with a 3 px sand edge, radius 40 (P 28); screen inset 12, radius 30, filled with the sky's top and horizon colours of the hour; a 28 px bar with clock, weather icon and badge count. The game runs at 30% speed behind an ink 25% veil|up from the bottom in 320 ms, overshoot; down in 220 ms|
|Home screen|2×4 icons of 96, gap 24, label 14|4×2 icons of 56, label 14|rounded squares, radius 24 (P 14), one flat colour each: Messages mint, Map cyan, Camera sand, Squawk pink, Jobs mango, Garage violet `#b46bff`, Stats white, Settings `#6f6a78`; ink icons; a pink count dot d 18|an app grows from its icon in 240 ms; back in 180 ms|
|App pages|header 48 with a cyan back chevron and an italic 800 20 title; rows 64 with a 40 icon, a 16 title and a 14 line at 70%|rows 52|a pressed row turns cyan at 20%; unread rows carry a pink dot|rows slide in 20 px, 30 ms apart|
|Map screen|full screen; filter panel left 24, top 24, 320 wide; zoom buttons d 56 at right 24, bottom 24|panel 220 wide, folds to a 56 button|water `#0e5fa8`, shallows `#35c8c8`, sand `#f2ddb0`, blocks `#d6cdc4`, buildings `#b7b0b8`, roads `#3b3946`, expressway edged in mango, parks `#3fb86a`, marsh `#6a8f4e`. Route: cyan 4 px on a 2 px ink edge. Waypoint: a pink pin. District names italic 800 28 (P 16), 4 px spacing, white at 60%. Filter chips h 36, cyan when on. Zoom 0.3 to 4 px a metre|pan and zoom ease 150 ms|
|Shop menu|panel left 96, top 120, 560×840 over a blurred street|left 14, top 12, 360×366|ink 80%, radius 20. Header 96 (P 56): the shop's sign as the sign atlas draws it. Tab pills h 40. Rows 72 (P 52): icon 48, name 18 (P 14), a mango price pill; owned rows carry a mint tick; the chosen row has a 2 px cyan edge. `Buy` is a cyan pill h 52 (P 48) with ink text; `Back` is an outline. Too dear: the price pill turns pink and `Buy` drops to 40%|a buy stamps a tick in 300 ms and rolls `cash` down; a refused buy shakes 4 px three times|
|Pause card|520 wide, centred|340 wide|ink 85%, radius 24; the wordmark 64 high; rows 56 (P 48), italic 800 22 (P 16): `Resume`, `Map`, `Phone`, `Settings`, `Save`, `Quit to title`. Focus: a 6 px cyan bar at the left, cyan text. The street behind is blurred 8 px under ink 35% and time is stopped|rows shift 8 px on focus in 120 ms|
|Settings|rows 56|rows 48|slider: track h 6, cyan knob d 22. Toggle: a pill 44×24, cyan when on. Quality: four joined pills. A `Blood` toggle, on by default, sits under `Reduce motion`: off swaps the blood puff for white dust and changes nothing else|120 ms|
|Title menu|wordmark 760 wide at left 120, top 200; items at left 128, top 480, italic 800 34, line 60|wordmark 380 wide at left 40, top 40; items at left 44, top 150, 20, line 44|the live city at 18:40 behind. `Continue`, `New game`, `Time machine`, `Settings`, `Credits` in white at 85%. Focus: pink with a cyan copy offset 3 px, as the wordmark, and a wave underline. The badge at the lower right|the first frame shows at once; the menu fades in 600 ms later, items 60 ms apart; the underline draws in 200 ms|
|Time machine|a row of postcards 240×160, one per day|160×106|the day's headline and a round day stamp; today's has a pin|scrolls sideways|

## 4. The four cards (canvas)

Each card is painted once on its own off-screen canvas at twice the design size below, then drawn on the HUD canvas, so `Save image` can export it as a PNG. On P the card is scaled to fit; no design text is under 22 px, so nothing lands under 14 px.

**Postcard result card** · design 880×560 · on screen centred, turned -3°, shadow 0 20 px 60 px ink 50% · P 575×366

|Part|Place (x, y from the card's top left)|Look|
|---|---|---|
|Card|880×560, radius 6|`#fdf6ea`; this is the 24 px white border|
|Photo|24, 24; 440×512|the mission's last frame, cropped centre, under a 12% sand tint|
|Title|40, 470 on the photo|the mission name, italic 900 52, pink over a cyan copy offset 3 px|
|Back|488, 24; 368×512|sand `#fff1c9`|
|Header|504, 60 and 504, 90|`Greetings from` and `Bayhaven`, 24, 1 px spacing, ink 60%|
|Postage stamp|744, 40; 96×116|`#fdf6ea` with a scalloped edge (r 4 bites every 12); the `gerald` icon 48 in ink; `Day 5` 22|
|Three lines|504 to 840 at y 240, 300, 360|a 1 px ink 25% rule each; label 24 at 60% on the left, value 800 30 on the right: `Time 6:42`, `Cash +$4,000`, `Followers +1,250`|
|Caption|504, 420; 320 wide, two lines|italic 26, ink|
|Rubber stamp|centre 760, 190|rings r 76 (5 px) and r 58 (2 px); `Delivered` italic 900 34 across; `BAYHAVEN` and `DAY 5 BUILD` 22 round the ring; three wavy lines 90 px to the left; pink at 85%, turned -12°. A failed mission reads `Return to sender` in ink|

Motion: the card comes up from below in 420 ms with overshoot, turning from -12° to -3°. The photo starts 1.6 times too bright and settles in 300 ms. The three lines write on at 500, 650 and 800 ms, 250 ms each. The rubber stamp lands at 1,100 ms, from 2.2 times its size in 160 ms, with a 4 px shake, the stamp thud and confetti. `Continue`, `Retry` and `Save image` are DOM pills under the card. Out: right and turning 8° in 300 ms. Never a banner across the screen.

**Hospital wristband** (knocked out) · design 1200×120 · centred at 57% of the height, turned -4° · P 600×60

|Part|Place|Look|
|---|---|---|
|Band|1200×120, radius 60|`#fdf6ea`, a 10 px mint `#8fe3cf` stripe along the top and bottom|
|Clasp|centre 60, 60|a `#c8ccd2` disc r 18 with an ink 30% hole r 8|
|Name block|x 110 to 520|`BAYHAVEN GENERAL` 28, 3 px spacing, ink 60%, baseline 46; `Navarro, Teo` italic 800 40, baseline 96|
|Bars|x 540 to 760, y 28 to 92|24 upright ink bars, 2 to 6 wide by seed|
|Bill|x 780 to 1080|`Bill $912` 800 40 pink, baseline 58; `5% of cash` 28 ink 60%, baseline 100. Once you have met Lawyer Larry the second row reads `Larry got you half off` in mango|
|Holes|x 1090 to 1170, y 60|five ink 30% dots r 5, 20 apart|

Motion: the view tilts 12° over 600 ms and drains of colour (`vfx.md`). At 900 ms the band slides in from the left in 380 ms with overshoot, and `cash` counts down with it. A press sends it out to the right in 300 ms, then a 600 ms fade from white and you wake at Bayhaven General.

**Mugshot board** (Booked) · design 900×560 · centred · P 589×366

|Part|Place|Look|
|---|---|---|
|Photo|0, 0; 540×560|a frame of the lead against the Sheriff's HQ wall, from 2.6 m in front at chest height, field of view 30°. The lead holds a blank board, both arms at -1.1. Teo looks happy; Mags looks angry|
|Height marks|x 0 to 60|ink 35% ticks every 28 px, numbered 150 to 200 in 22|
|Board text|the board's place in the photo: 120, 330; 300×170|slate `#150f3d`; white text: `MARLIN COUNTY` 24 with 2 px spacing; the name italic 800 30; `No. 0005` 800 44, which is the build's day number|
|Panel|540, 0; 360×560|sand; `Booked` italic 900 56, pink over cyan, baseline 90; `Cost $1,825` 800 34, baseline 170; `10% of cash` 22 at 60%; `Weapons kept at the desk` 22; the weekday and time 22|
|Lawyer Larry's card|380×214, lands at 500, 330, turned 5°|mango, radius 12, ink text: `LAWYER LARRY` italic 900 36; `Hurt? Flirt with a lawsuit.` 22; `555-0144` 800 30. Once met: a pink round sticker r 44 reading `Half off`|

Motion: a white flash for 80 ms at 400 ms with the shutter sound, the card drops in over 300 ms, and Larry's card slides in from the right at 1,800 ms. `Walk out` is a DOM pill.

**Luggage tag** (district name) · design 360×120 · hangs from the top centre on a 60 px string (P 220×73 on a 44 px string)

|Part|Place|Look|
|---|---|---|
|Tag|360×120, radius 14, the two top corners cut by 20|sand `#fff1c9`; a 14 px band along the bottom in the district colour|
|Hole and string|hole centre 180, 14|an ink ring r 9 round a hole r 4; a 2 px sand string to the top of the screen|
|Text|centred|`Now entering` 23 at 60%, baseline 40; the district italic 900 38, baseline 76; the neighbourhood 23, baseline 100|

District colours: Tideline `#ff3fa4` · Meridian `#b8cfe0` · Palma Vieja `#ffb347` · The Paintworks `#b46bff` · Rustwater `#ffc300` · Northgate `#ff5a5a` · Mallard Greens `#3fb86a` · Runway Flats `#ffa02e` · Mudcat Glades `#3d6b4a` · The Islands `#1f2f5a` · Heron Marsh `#6a8f4e`.

Motion: drops 180 px in 350 ms and swings about the string's top by `14° × e^(-2.2t) × cos(6.9t)`. It is on screen for 3 s in all, then leaves upwards in 250 ms.

## 5. Sixty icons

Each is drawn with canvas paths on a 24-unit grid, 2-unit round strokes unless "filled", into one icon sheet (10×6 cells) in white and tinted when used. Map blips differ by outline as well as colour.

|#|id|Shapes|
|---|---|---|
|1|`dollar`|a filled pill; an S curve; one upright bar|
|2|`follower`|a head circle; a shoulders arc; a small plus|
|3|`viewers`|two arcs making an eye; a filled pupil|
|4|`heart`|two filled circles; a filled triangle under them|
|5|`vest`|a trapezium; a V notch; two strap bars|
|6|`clock`|a ring; two hands|
|7|`note`|a filled oval; a stem; a flag stroke|
|8|`siren`|a filled half circle; a base bar; two rays|
|9|`weather`|a cloud of three circles; three slanted drops|
|10|`chopper`|a body oval; a rotor line; a tail bar|
|11|`player`|a filled chevron|
|12|`other-lead`|a ring; a filled head and shoulders inside|
|13|`waypoint`|a filled teardrop; a hole|
|14|`mission`|a rectangle; a small square in its corner; two lines|
|15|`clothes`|a hanger triangle; a hook|
|16|`food`|a cup trapezium; a lid bar; a straw|
|17|`wrench`|a bar; an open jaw; a ring|
|18|`hook`|a fish-hook curve; an eye ring; a barb|
|19|`umbrella`|a filled half circle; a stem; a J handle|
|20|`carwash`|a car-roof arc; three drops over it|
|21|`house`|a square; a roof triangle; a door bar|
|22|`hospital`|a rounded square; a plus|
|23|`sheriff`|a shield outline; a filled dot|
|24|`marina`|a hull arc; a mast; a sail triangle|
|25|`race`|a pole; a flag of four squares|
|26|`taxi`|a car side; a roof box|
|27|`delivery`|a box; a tape line; a corner fold|
|28|`repo`|a tow arm; a hook; a wheel ring|
|29|`flamingo`|an S neck; a filled oval; one leg|
|30|`ramp`|a filled wedge; an arc with an arrow head|
|31|`postcard`|a rectangle; a stamp square; two lines|
|32|`gnome`|a filled cone; a face circle; a beard triangle|
|33|`mixtape`|a rounded rectangle; two rings|
|34|`local-man`|a speech bubble; an exclamation bar and dot|
|35|`gerald`|a head circle; a long beak wedge; a pouch arc|
|36|`drop`|a calendar square; a top bar; a number|
|37|`messages`|a rounded bubble; a tail; two lines|
|38|`map`|three folded panels; a dotted route|
|39|`camera`|a rounded box; a lens ring; a flash bump|
|40|`squawk`|a bird-head circle; an open beak of two triangles|
|41|`jobs`|a clipboard; a clip bar; two ticks|
|42|`garage`|a door square; three slats|
|43|`stats`|three bars of rising height|
|44|`settings`|two sliders; two knobs|
|45|`gas`|a tall pedal; three grip bars|
|46|`brake`|a wide pedal; one bar|
|47|`handbrake`|a lever; a grip; a base arc|
|48|`horn`|a filled cone; two sound arcs|
|49|`door`|a door rectangle; an arrow through it|
|50|`sprint`|a head dot; a leaning body; two leg strokes|
|51|`jump`|an up chevron; a ground line|
|52|`aim`|a ring; four ticks|
|53|`fire`|a dot; three rays|
|54|`switch`|two head circles; two curved arrows|
|55|`phone`|a rounded rectangle; a home bar|
|56|`fist`|a rounded square; four knuckle lines|
|57|`noodle`|one thick curved stroke; an end ring|
|58|`pistol`|a barrel bar; a grip bar; a trigger ring|
|59|`longgun`|a long barrel; a stock wedge; a grip (SMG and shotgun share it; the shotgun's barrel is doubled)|
|60|`flare`|a short fat barrel; a grip; a spark dot|

## 6. Touch controls (DOM)

Touch buttons stay in the DOM so they are never in a photo or a clip. Day 1's look: a circle with a 2 px white edge at 55% over ink 35%, a 28 px icon or a 12 px bold label. Pressed: pink at 60% with a white edge. The context button has a cyan edge; the fire button a pink one. Nothing is under 64 px. Places are from the P screen's edges, plus the safe-area insets.

|Mode|Button|Size|Place|
|---|---|---|---|
|Driving|steer left, steer right|72|left 150 and left 234, bottom 18 (beside the minimap). Tilt steering hides them|
||gas|84|right 16, bottom 18|
||brake|72|right 112, bottom 18|
||handbrake|64|right 116, bottom 102|
||horn (Mags: Bus Driver Voice)|64|right 26, bottom 114|
||get out|64|right 196, bottom 18|
|On foot|move stick|ring 120, knob 56|appears under the thumb anywhere in the left 45%, below the top row and off the minimap; rests at 228, 300 at 35%|
||jump|72|right 16, bottom 18|
||sprint|72|right 100, bottom 18|
||context (get in, talk, pick up)|72|right 22, bottom 102; pulses cyan when something is in reach|
||hit|64|right 106, bottom 102|
||aim|64|right 184, bottom 18|
|Aiming|fire|96|right 16, bottom 18|
||aim (on)|64|right 124, bottom 18|
||reload|64|right 196, bottom 18|
||three weapon slots|64|right 16, 88 and 160, bottom 122|
|Always|phone|64|right 14, top 138|
||switch lead (the other lead's face)|64|right 86, top 138|
||camera|64|right 158, top 138|

- Dragging anywhere else on the right 55% turns the camera, 0.25° a pixel.
- Tapping `minimap` opens the map; tapping `live` is the helicopter cam; swiping `radio` changes station. These are clear DOM hit areas over the canvas.

## New names

- HUD piece ids in section 2, icon ids in section 5, card part names in section 4.
- The stamp `Return to sender` for a failed mission, and the sticker `Half off` on Lawyer Larry's card.
- District tag colours in section 4.
