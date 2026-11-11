# 07 · Art and audio direction

## The look in one sentence

**A postcard that moves:** flat-shaded low-poly shapes in sun-bleached pastels under a huge painted sky, with neon as the one loud colour, switching on as the sun goes down.

Day 1 already looks like this. The job is to keep that look as the city grows, not to find a new one.

## The postcard rule

Any frame should work as a postcard. Check a screenshot against these four:

1. **Sky is a third of the frame or more.** The default cameras look slightly up.
2. **Big simple shapes.** Buildings read as blocks of colour first, detail second.
3. **One accent.** Pastel everything, then one neon or one saturated object (the car, a sign, an umbrella).
4. **Light has a direction.** Long shadows at golden hour, pools of lamp light at night. Never flat noon grey.

## Palette

The base colours are day 1's own constants, kept as they are.

| Role | Colours |
|---|---|
| Pastel walls | `#ff9eb5` `#8fe3cf` `#ffc98f` `#9fd2ff` `#fff1c9` `#c9a8ff` `#ff8f7a` `#7fd6e8` `#f7f3ea` |
| Neon | pink `#ff3fa4` · cyan `#29e6ff` · violet `#b46bff` · orange `#ffa02e` · mint `#5dff9b` · red `#ff5a5a` |
| Towers | `#d9b8c4` `#b8cfe0` `#e6d3b8` `#c4b8e0` `#b8e0d3` `#e0e0e6` `#e8c0b0` |
| Trim, roofs, glass | `#fdf6ea` · `#6f6a78` · `#2e4a6b` · roof tile `#c8643c` |
| Road, sand | asphalt `#3b3946` · sand `#f2ddb0` · wet sand `#e2c998` |
| UI ink and accents | ink `#150f3d` · pink `#ff4fa8` · cyan `#29e6ff` · sand `#fff1c9` · mango `#ffa02e` |

Each district shifts the base so you can tell where you are from one screenshot:

| District | Walls | Accent | Night light |
|---|---|---|---|
| Tideline | the full pastel set | neon pink and cyan | neon, warm lamps |
| Meridian | cool whites, pale blue glass `#b8cfe0` `#e0e0e6` | one coral tower `#ff8f7a` | window grids, white street light |
| Palma Vieja | hot: mango `#ffb347`, turquoise `#2ec4b6`, rose `#ff6f91`, lime `#b5e48c` | hand-painted signs | strings of warm bulbs |
| The Paintworks | brick `#a8553a`, metal `#7d8590`, covered in murals of every colour | violet and mint | moving club lights |
| Rustwater | rust `#b5532f`, safety yellow `#ffc300`, container red `#b23a2e`, blue `#2e5e8c`, green `#3e7a4a` | hazard stripes | sodium orange `#ff9a3c` |
| Northgate | beige `#e8dcc4`, sun-faded signs | tall red and yellow pole signs | cold white car-park light |
| Mallard Greens | four approved colours: cream `#f5ecd7`, sage `#b7c9a8`, dove `#c9cdd4`, blush `#f0d0c8` | lawn green `#3fb86a` | porch lights, all the same |
| Runway Flats | concrete `#c8ccd2`, terminal glass | runway lights blue and amber | landing lights |
| Mudcat Glades | greens `#3d6b4a` `#6a8f4e`, weathered wood `#8a6f55`, tea-brown water `#5a4a32` | fireflies `#d8ff7a` | almost none: moon and fireflies |
| The Islands | white `#ffffff`, hedge green, sea-grape; shacks in beach-towel stripes | yacht-club navy | lanterns, the lighthouse beam |

## Light

One clock drives it all (day 1's `sky.js`). The colour keys already exist for night, dawn, day, golden hour, sunset and dusk. Additions:

- **Golden hour is the home key.** New games start at 17:30. Clips are shot between 17:30 and 20:30 or at night.
- **Night is blue and readable**, never black. Hemisphere light stays near 0.95 (day 1's value). Neon, windows and lamp pools do the rest.
- **Shadows:** a soft dark blob under every vehicle and person on all devices. On `high`, one sun shadow map near the player, strongest at golden hour.
- **Weather grades the same keys:** storm pulls saturation down 30% and adds a blue-grey; hurricane adds green to the sky and flicker to district lights; after rain, everything is 10% more saturated for five in-game minutes.

## Post-processing

`high` quality only. Phones keep day 1's additive glow sprites, which already sell the neon.

| Effect | Setting |
|---|---|
| Bloom | half resolution, threshold so only neon, lights and the sun bloom, strength 0.6, more in rain |
| Vignette | 12% at the corners |
| Colour grade | a gentle S-curve and a warm lift in shadows at golden hour |
| Speed | field of view widens with speed (day 1); no motion blur |
| Wet roads | roads darken, and each light gets a stretched additive streak below it. No real reflections. |

## Buildings

Each district has a **kit**: 4–6 building recipes built from `MeshBuilder` boxes, with rules for height, colour, roof and street level.

- **Street level carries the detail** (shop fronts, awnings, doors, signs) because that is what you see from a car. Upper floors are a window pattern.
- **Windows** are small quads in LOD0 (day 1's way) and a texture in LOD1. About 30% are lit at night, in warm, cyan and pink (day 1's mix).
- **Signs** come from the sign atlas: text drawn on a canvas in a heavy italic system font with a neon border (day 1's way). Names come from the approved list in `05-content.md`.
- **Murals** (Palma Vieja, The Paintworks) are generated on a canvas from a seed: big shapes, birds, fish, waves, suns, hands, in the district palette.
- **Landmarks** are hand-written files. Each must have a silhouette you can recognise from 1 km: the Spire is a twisting taper with a light at the top; the pier is the wheel; the port is the four cranes; Big Earl is Big Earl.

## People

Boxy toy people, 1.8 m tall, with heads slightly too big (one fifth of the height). Six boxes: head, torso, two arms, two legs.

- **Faces** are drawn on a canvas: two dots and a line, six expressions (neutral, happy, shocked, angry, filming-squint, dizzy).
- **Variety** from skin tone (eight), hair (box shapes and colours), shirt pattern, hat or bag, and height ±8%.
- **Mags and Teo** have unique silhouettes: her visor and ponytail, his chest-mounted phone and bleached hair. You can tell which one you are from behind at 20 m.
- **Animation** is maths: swing, bob, lean. A person filming holds one arm up and turns to track you.
- No realistic humans, no real likenesses.

## Vehicles

Chunky, slightly toy-like, 300–600 triangles. Two-tone paint with a stripe (day 1's coupe sets the style). Wheels turn and steer, the body leans and squats. Headlights, brake lights and indicators are separate bright pieces. Police vehicles are white and teal with a pink stripe and a light bar that alternates pink and cyan: our own livery, not black-and-white.

## The HUD

**It looks like a livestream overlay.** That is the game's signature and it is nobody else's layout. It is drawn on one 2D canvas over the game canvas, not in the page's own elements, so photos and recorded clips include it. Menus, the phone and settings are ordinary page elements.

Landscape (desktop and phone held sideways):

```
┌────────────────────────────────────────────────────────────────────┐
│ $18,250   12.8K followers                    ● LIVE 51,204   17:42 │
│                                              ┌──────────────────┐  │
│                                              │ chat: grandma??? │  │
│                                              │ chat: THE PIER   │  │
│                                              │ chat: not again  │  │
│                                              └──────────────────┘  │
│                                                                    │
│ ┌────────┐                                                         │
│ │minimap │   ◉ ◉ ◉ ○ ○   heat                 Tideline 98 ♪        │
│ │        │                                                         │
│ └────────┘   86 km/h  ·  Heron              Bayhaven · Day 5 build │
└────────────────────────────────────────────────────────────────────┘
```

- **Top left:** cash and followers, in two pills.
- **Top right:** the clock, and the LIVE pill with viewers when heat is 3 or more. Below it, the chat (three to five lines, fading).
- **Bottom left:** the minimap, a rounded rectangle. To its right, heat as **five siren lights** (round, alternating pink and cyan when lit). Below, speed and vehicle name.
- **Bottom right:** the radio pill when it changes, and always the day badge.
- **Centre:** nothing, except a one-line hint or prompt near the bottom when needed.
- Portrait phones stack the same pieces: status across the top, minimap top left under it, controls at the bottom, chat hidden unless live.

**Type:** system fonts only. Numbers and labels in `"Trebuchet MS", "Segoe UI", system-ui` (day 1's stack), heavy italic for big words. No font files are shipped and no other game's typeface is imitated.

**Shapes:** pills and rounded rectangles in ink `#150f3d` at 55% opacity with white text, pink for anything live or dangerous, cyan for anything you can press.

**Screens that must look like ours and nobody else's:**

- **Result card:** a postcard with a stamp (`05-content.md`).
- **Knocked out:** the screen tilts and drains of colour, then a hospital wristband slides in with the bill.
- **Booked:** a mugshot board held by your character, with the booking number being the day number, then Lawyer Larry's card.
- **District name:** a luggage tag that swings in from the top.
- **Never:** a full-width banner with a verdict word, a star row, a weapon wheel, or a circular minimap.

## The wordmark and title screen

- **Wordmark:** the word *Bayhaven* in our own letterforms, built from rounded rectangles and quarter circles in code: thick monoline strokes, a slight forward slant, the `y` descender becoming a wave line under the word. Pink with a cyan offset shadow. It is drawn on a canvas once and used on the title, the result card and the rooftop sign.
- **Title screen:** not a menu over black. The real city at 18:40, the camera drifting along the beach towards the pier, traffic and people running. The wordmark, then `Continue`, `New game`, `Time machine`, `Settings`, `Credits`. The first frame appears at once; the menu fades in over it.
- **Time machine:** links to every earlier day's build (`../day-1/` and so on) with its headline. The day 1 to day 9 jump is one click from the title.
- **Credits:** "Every line of code in this game was written by one AI in nine days," then each day's headline and commit count, then the tools (three.js, Vite), then, if any made assets shipped, a line saying that models, music and voices were made by generative models from the studio's own requests, then Gerald.

## Sound

Everything is synthesised with the Web Audio API. No audio files.

### Mix

Buses: master → music, effects, ambience, voice, UI. Music ducks 6 dB under voice blips and 3 dB under the LIVE chat ping. A soft limiter on the master. Sound starts on the first tap or key (browsers require it). Day 1's mute key moves from `M` to `0` on day 4, when `M` becomes the map.

### Effects

| Sound | Recipe |
|---|---|
| Engines | day 1's two oscillators through a low-pass, plus a third for a sub on big engines. Pitch from speed within a gear, drops on gear change (four gears). Each class has its own waveform mix and range: scooter buzzes, bus rumbles, golf cart whines. |
| Tyres | band-passed noise; volume from slip angle, pitch from speed |
| Impacts | a noise burst and a 60 Hz thump scaled by impact speed; glass is high noise with a quick decay |
| Horns | two detuned square waves; each class has its own interval. Mags's ability is the same horn, an octave down, with a short echo. |
| Sirens | a sine sweeping 600–1,200 Hz at heat 1–2; a faster two-tone at 3 and above |
| Helicopter | noise chopped at the blade rate, low-passed, louder when overhead |
| Weapons | noise burst plus a pitched click; the shotgun adds a low boom; the noodle goes "bop" (a sine dropping from 300 to 150 Hz) |
| Explosion | long low-passed noise, a sub drop, a crackle of falling debris |
| Footsteps | filtered clicks by surface: sand soft, road sharp, boardwalk hollow |
| UI | soft marimba-like plucks (a sine with a fast decay), pitched in the current station's key |

### Ambience

A bed per district, cross-faded as you move, made from noise and simple chirps: waves and gulls (Tideline), a low city hum and crossing beeps (Meridian), cicadas and frogs (Glades), ship horns and clanks (Rustwater), sprinklers and a leaf blower (Mallard Greens), jets (Runway Flats). Rain, wind and thunder sit on top. Thunder arrives after the flash by distance.

### Music

A 16-step sequencer (`src/audio/music.js`) plays patterns on a small set of synthesised instruments (`src/audio/synth.js`):

| Instrument | Made from |
|---|---|
| Kick, snare, clap, hats | sine drops and filtered noise |
| 808 bass | a sine with pitch glide and soft clipping |
| Saw bass, lead, pad | detuned saws through a low-pass with an envelope |
| Pluck, marimba, bell | short envelopes, FM for the bell |
| Guitar-like pluck, banjo | a plucked-string delay loop |
| Brass stab, piano-like | stacked saws / FM |

A **song** is a tempo, a key and scale, a chord loop, and four to six patterns arranged as intro, verse, chorus, break. Melodies are generated from the song's seed inside the scale and then fixed, so everyone hears the same song.

| Station | Recipe |
|---|---|
| Tideline 98 | 96–118 bpm, major and Dorian, gated pads, arpeggios, a snare with a long tail |
| Radio Palma | dembow kick and snare at 92–104; salsa-style piano figures and bell patterns at 180 |
| Bassline FM | 130–150 bpm, 808 slides, rapid hats, one-note leads |
| Swamp Country 94 | shuffle at 100–124, banjo and guitar plucks, a walking bass |
| Low Tide Lounge | 70–84 bpm, seventh chords on a soft piano-like voice, vinyl-style noise, waves |
| The Grind 24/7 | 140 bpm drums only, under Kiki's lines |

**Stingers** (two bars each, original): mission complete (a rising pluck figure ending on the postcard stamp thud), heat up (a siren-like bend), knocked out (a descending slide), new district (three marimba notes in the district's key).

### Voices

No recorded actors. Each line is shown as a subtitle and "spoken" as a run of short pitched blips, one per syllable, at the character's pitch (Mags 180 Hz, Teo 260 Hz, the Sheriff 120 Hz with a little radio crackle, Kiki 340 Hz with vibrato). Radio hosts do the same over their music. A setting, off by default, lets the browser's built-in speech voice read radio lines aloud.

## Going deeper

`bible/art/` turns this file into numbers: `kits.md` (standard dimensions and twelve building recipes), `characters.md` (the rig, faces, every pose as maths), `vehicles-modelling.md`, `ui-kit.md` (every HUD and menu piece in pixels, sixty icons), `vfx.md` (forty effects), `sfx.md` (a hundred sound recipes), `synth-patches.md` and `light.md` (the sky hour by hour). Five more radio stations for after release are in `bible/radio/`.

## Made assets

When the art department is on, a few things can be made rather than coded: the two leads and named cast as rigged low-poly models, hero vehicles, landmarks, real songs for the stations, hosts and mission lines spoken in synthetic stock voices, and pictures for billboards, murals and postcards. They follow this file's look: flat faces, the same palettes, no lettering in pictures. Every one has its code-made version underneath, and Arcade FM stays sequenced for ever. The rules are in `bible/tech/art-pipeline.md`.
