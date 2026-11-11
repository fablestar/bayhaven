# Bible · radio · Radio Palma

Radio Palma is Palma Vieja's station: four dembow songs and two salsa songs, loud enough for the whole street. El Capitán Memo talks as if every listener were leaning in his window. Below: identity, voice, sound recipe, six songs, 20 lines, six idents and two segments.

Tier: A for the station, songs 1 to 3, host lines 1 to 6 and idents 1 and 2. B for songs 4 to 6, host lines 7 to 20, idents 3 to 6, both segments and the doorway radios.

## Identity

| Field | Value |
|---|---|
| Id | `palma` |
| Frequency | 92.5 FM, dial position 4 of 12 |
| Slogan | "Más alto, vecino." (Louder, neighbour.) |
| Who listens | Kitchens, domino tables, the Mercado, lowrider crews, van drivers |
| Starts in | Flounder, Pompano, Possum, Fiddler, Pelican |
| Also starts in, until Arcade FM ships | Conch |
| Shops that play it | All of Palma Vieja (Ventanita Rosa, the Mercado, Lava Abuela, Flounder Works) and the food-truck yard in The Paintworks |
| Doorway radios | One sound emitter per block face in Palma Vieja, heard to 18 m, band-passed 300 Hz to 3.4 kHz |
| Ships | Day 4 |

Start rule, the same on every station: a vehicle taken from traffic or the kerb is already tuned to its own station. The first Q or E press sets the lead's remembered station, and garage vehicles open on that.

## The host: El Capitán Memo

Memo ran a fishing charter for thirty years. He does the show from a booth over the Mercado with the window open.

1. Every line is said to somebody: mi gente, vecino, abuela, table three.
2. Spanish comes one or two plain words at a time, and the English around it carries the meaning.
3. He measures the world in volume and food. He is never unkind; his targets are noise complaints, the association and the developer. When the street gets violent he saw nothing.

Speech blip: triangle, 165 Hz, 55 ms per syllable, 8 syllables a second, the last syllable rises 15%.

## Sound recipe

| Part | Value |
|---|---|
| Tempo | Dembow 92 to 104 bpm. Salsa 180 bpm. |
| Scales | Natural minor and Phrygian for dembow, major for salsa |
| From the `07` list | kick, snare, hats, 808 bass, marimba, bell, brass stab, piano-like |
| New: clave | 2.4 kHz sine, 25 ms decay |
| New: cowbell | Squares at 540 and 800 Hz through a 1 kHz band-pass. Accent rings 250 ms, plain hit 80 ms. |
| New: conga | Open tone: sine at 220 Hz, 180 ms. Slap: 15 ms noise burst through a 1.5 kHz band-pass. First hit of each pair is the slap. |
| New: güiro | Noise through a 4 kHz band-pass, chopped at 60 Hz. A hit before a rest is long (120 ms), others short (40 ms). |
| Dembow feel | Kick on every beat. Snare on steps 4, 7, 12 and 15, dry and 1 dB louder than the kick. This never changes. |
| Salsa feel | A step is an 8th note, so 16 steps are two bars and one clave. No backbeat. The snare line is a rim click and the hat line is the güiro. |

Mix notes: the 808 rings 400 ms and ducks 3 dB under each kick. Montuno piano is played in octaves, panned 20% left; cowbell 20% right. No reverb over 300 ms.

## Reading the songbook

Canon Song format. Drum lines are 16 steps: `x` hit, `X` accent (+3 dB), `.` rest. A step is a 16th note, unless the first line says `step 8th`. Bass is one entry per step, counted from the current chord's root: `1` root, `3` the chord's own third, `5` fifth, `8` octave, other numbers on the major scale, `b` lowers a semitone; `-` holds, a comma drops an entry one octave (`5,` is the fifth below). Lead is one entry per 8th note, two bars, in steps of the song's scale from its key note; `8` is the octave. A lead marked `montuno` is played from each chord instead: 1, 3, 5 and 8 are that chord's own root, third, fifth and octave.

## Songbook

```
"Sube el Volumen, Vecino" · Los Ventiladores de Techo · 96 bpm · A minor · chords Am F G Em · 2 bars each · tier A
kick   x...x...x...x...        snare  ...x..x....x..x.        hat  x.x.x.x.x.x.x.x.
stab   x.....x.........        (brass, chorus only)
bass   1..1..1...5...8.
lead   5 . 5 6 5 . 3 . | 4 . 4 5 4 . 2 .      keys: marimba doubles the lead in the chorus
form   intro 4 · verse 8 · chorus 8 · verse 8 · chorus 8 · break 4 · chorus 8 · out 4
```

```
"Cafecito a las Tres" · Orquesta Paraguas Roto · 180 bpm · C major · chords Dm7 G7 Cmaj7 A7 · 1 bar each · step 8th · tier A
kick   x.......x.......        snare  x.x.xx.xx.xx.xx.        hat  x.xxx.xxx.xxx.xx
clave  ..x.x...x..x..x.        bell   X.xxX.xxX.xxX.xx        conga  ..x...xx..x...xx
bass   ...5..1....5..1.        (each `1` is the next chord's root, played early)
lead   1 . 3 5 . 8 . 5 | . 3 . 5 . 8 . 5      montuno on the piano-like voice; a brass stab answers in the last bar of every 8
form   intro 4 · verse 16 · montuno 16 · brass 8 · montuno 16 · out 4
```

```
"Calle Guayaba No Duerme" · La Nevera Rota · 100 bpm · E minor (Phrygian) · chords Em F G F · 2 bars each · tier A
kick   x...x...x...x...        snare  ...x..x....x..x.        hat  x.xxx.xxx.xxx.xx
bell   ..x...x...x...x.
bass   1..1..1..1..5,.1.
lead   1 . 2 1 . 7, 1 . | 3 . 2 1 . 2 1 .     keys: marimba holds the chord on beat 1
form   intro 8 · verse 8 · chorus 8 · verse 8 · chorus 8 · out 4
```

```
"Dominó a las Seis" · Conjunto Doble Nueve · 180 bpm · F major · chords Gm7 C7 Fmaj7 D7 · 1 bar each · step 8th · tier B
kick   x.......x.......        snare  x.xx.xx.x.x.xx.x        hat  x.xxx.xxx.xxx.xx
clave  x..x..x...x.x...        bell   X.x.X.xxX.x.X.xx        conga  ..x..xxx..x...xx
bass   1..5..1.1..5..1.        (same early `1`)
lead   5 . 8 5 . 3 . 5 | . 8 . 5 . 3 . 1      montuno; this song turns the clave round to 3-2
form   intro 4 · verse 16 · montuno 16 · brass 8 · montuno 16 · out 4
```

```
"Mi Carro Brinca" · Los Hidráulicos de El Bajo · 92 bpm · D minor · chords Dm Bb C Am · 2 bars each · tier B
kick   x...x...x...x...        snare  ...x..x....x..x.        hat  ..x...x...x...x.
bell   x.......x.......
bass   1-----1-5-----5-
lead   8 . . 7 . 5 . . | 6 . . 5 . 3 . .
form   intro 4 · verse 8 · chorus 8 · verse 8 · chorus 8 · break 4 · chorus 8 · out 4
```

```
"Tormenta de las Tres y Cuarto" · Grupo Pastelito · 104 bpm · B minor · chords Bm G A F#m · 2 bars each · tier B
kick   x...x...x...x...        snare  ...x..x....x..x.        hat  x.x.x.x.x.x.x.x.
stab   ........x..x..x.        (brass, chorus only)
bass   1..1..5..1..1..5
lead   5 5 . 3 5 . 8 . | 7 7 . 5 7 . 4 .      fx: a 2 second thunder roll (low-passed noise) on the first bar of each chorus
form   intro 4 · verse 8 · chorus 8 · verse 8 · chorus 8 · break 8 · chorus 8 · out 4
```

## Host lines

Loop: song, song, host line, ad, ident. Every fourth loop the host line is a segment script. A line is 180 characters or fewer. Each line starts with when it may play. `night` is 20:00 to 05:00, `dawn` 05:00 to 07:00, `hot` clear weather from 11:00 to 15:00, `storm` the 15:15 rain, `cut` just before the Sheriff's show takes the station at heat 4, `back` the first line after heat clears. Lines 1 to 6 are tier A, the rest B.

1. any · If you can hear this, turn it up. If your neighbour can hear this, you're welcome, neighbour.
2. any · Buenos días, buenas tardes, buenas noches. I don't know when you're listening, mi gente, so take all three.
3. storm · Las tres y cuarto. Here comes the rain, right on time. Bring in the laundry, abuela. I'll wait.
4. after-song · That one was for table three in Domino Park. Play the tile, Hector. We all know you have it.
5. cut · Oye, the Sheriff is borrowing the station. He does not say please. Stay close, mi gente, and stay low.
6. after-ad · That was an ad, familia. I read them fast so there's more time for the music.
7. back · We're back. Whoever that was on the Sheriff's show: I didn't see you. Nobody did. Palma Vieja has a very bad memory.
8. Tuesday · Martes. Domino league at six in the park. Bring a chair. Bring your own luck, because Hector isn't sharing his.
9. Saturday · Sábado. The farmers' market is in Domino Park from eight. Squeeze the mangos gently. They have feelings.
10. in Palma Vieja · You're in Palma Vieja now. Windows down. This music isn't for one car, it's for the whole street.
11. any · A neighbour phoned to say the radio is too loud. I asked which neighbour. Now two of them are dancing.
12. any · The association in Mallard Greens sent me a letter about volume. I can't hear it over the music.
13. hot · Qué calor. Ninety-three in the shade, and the shade is taken.
14. night · It's late, vecinos. I'll turn it down a little. There. Did you hear that? Me neither.
15. any · They want a tower where the trailer park is. Mira, a tower has no porch. Where the hell does the radio go?
16. rain · Rain on the tin roofs. That's free percussion, mi gente. I'm playing along.
17. dawn · The bakery on Calle Uno is open. I can smell the pastelitos from here. This next one is short. I have plans.
18. hurricane · Hurricane, mi gente. Tape the windows, fill the bathtub, check on your abuela. She already checked on you.
19. night · Gunshots on Calle Siete. Or fireworks. In this neighbourhood we say fireworks, vecino, and we go inside.
20. Friday · Viernes. If your car has hydraulics, El Bajo is waiting. If it doesn't, come anyway and clap.

## Idents

Spoken over the first bar of the next song's drums. Idents 1 and 2 are tier A, the rest B.

1. Radio Palma. Más alto, vecino.
2. Noventa y dos punto cinco. Ninety-two point five. Radio Palma, louder than your neighbour.
3. Radio Palma. From the Mercado to your kitchen.
4. This is Radio Palma. If the windows rattle, it's working.
5. Radio Palma. El Capitán is at the wheel. The boat is not moving.
6. Radio Palma, Palma Vieja. Turn it up, mi gente.

## Segments

### El Parte del Dominó (tier B)
The domino report: results from Domino Park, read like a sports bulletin. Plays after 18:00.

1. "El parte del dominó. Table one: Hector won. Table two: Hector won, he switched tables. Table three is under review because a pelican took the double six. More after the music."
2. "El parte del dominó. Abuela Carmen played four games tonight and lost none. She asks me to say she wasn't trying. Hector asks me to say nothing. Bueno. Nothing, Hector."
3. "El parte del dominó. Table two is closed tonight, out of respect. Don't ask who for. Rafa sent flowers and the tiles stay where they fell. Table one: Hector won. Carajo, he always wins."

### La Queja del Día (tier B)
The complaint of the day. Memo reads one noise complaint and answers it. The next song starts 3 dB louder for its first four bars.

1. "La queja del día. 'Dear Captain, your station can be heard from my model home in Mallard Greens.' Gracias, señor. That's the far side of the expressway. A new record. This one's for you."
2. "La queja del día. A lady on Calle Jazmín says my music makes her dog dance. Señora, that isn't a complaint, that's a review. Give the dog my regards."
3. "La queja del día. The Bellweather Group says our bass disturbs the sales centre. Mi gente, I looked for the bass knob. It only turns one way."

## New names

- Artists and their song titles, songbook only: Los Ventiladores de Techo, Orquesta Paraguas Roto, La Nevera Rota, Conjunto Doble Nueve, Los Hidráulicos de El Bajo, Grupo Pastelito.
- Segments: El Parte del Dominó, La Queja del Día.
- Instruments: clave, cowbell, conga, güiro.
