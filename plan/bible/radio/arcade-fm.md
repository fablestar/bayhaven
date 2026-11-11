# Bible · radio · Arcade FM

Arcade FM is chiptune: two square-wave voices, one triangle and one noise channel, and nothing else. It plays in arcades and in the Anchovy. Player Two hosts in short screen prompts while he waits for Player One to come back with change. Below: identity, voice, the four channels, six songs, 20 lines, six idents and two segments.

Tier: C for everything in this file.

## Identity

| Field | Value |
|---|---|
| Id | `arcade` |
| Frequency | 87.7 FM, dial position 1 of 12 |
| Slogan | "Press start." |
| Who listens | The crowd in Coral Arcade, kids on the pier, whoever owns an Anchovy |
| Starts in | Anchovy, Conch, Gnat |
| Before it ships | Anchovy and Gnat use Bassline FM. Conch uses Radio Palma. |
| Where else it plays | The Coral Arcade hall on Gullwing Pier and its old shopfront on the day 1 block, heard to 25 m from the door |

Start rule, the same on every station: a vehicle taken from traffic or the kerb is already tuned to its own station. The first Q or E press sets the lead's remembered station, and garage vehicles open on that.

## The host: Player Two

He is the second player. Player One went to get change and has not come back. Player Two is still holding the controller.

1. He talks like a screen: short prompts, present tense, eight words or fewer to a sentence.
2. He scores everything. Ordinary life has points, lives, levels and bonus stages. A death is "game over" for somebody, said flatly.
3. He is always waiting for Player One and is never bitter about it.

Speech blip: square wave, syllables alternating 520 and 390 Hz, 45 ms each, 8 a second, no filter. Every line starts with a rising three-note chirp: C6, E6, G6, 30 ms each.

## Sound recipe: four channels

Only square waves, triangle waves and noise. No saws, no sines, no filters on the tone channels, no reverb, no echo unit. At most four sounds at once, one per channel, as on an old sound chip.

| Channel | Plays | Recipe |
|---|---|---|
| Pulse A | The lead | Square wave. Width set per song: 50%, 25% or 12.5%. Starts at once. Volume drops in four steps over a note. Vibrato of 15 cents at 6 Hz after 150 ms. |
| Pulse B | `arp` or `echo` | Square at 25% width. `arp`: the current chord's root, third, fifth and octave in turn, one per 32nd note. `echo`: the lead again, one 8th later, at half volume. |
| Triangle | Bass and kick | Triangle wave at one fixed volume. A kick is the triangle falling from 180 to 50 Hz in 50 ms; the bass note carries on after it. |
| Noise | Snare and hats | White noise. Snare 80 ms. Hat 15 ms at half volume. |

| Part | Value |
|---|---|
| Tempo | 124 to 180 bpm |
| Scales | Major and natural minor |
| Drum feel | Straight. Kick on the beats, snare on 2 and 4, hats on 8ths or 16ths. A fill is a run of snares. |
| Jingle | Between songs: five lead notes, 1 3 5 8 5 of C major, 60 ms each |

Mix notes: mono. Pulses −6 dB, triangle −3, noise −8. Volume moves in 16 fixed steps, never smoothly. Heard from outside the arcade, the station runs through a 300 Hz to 3.4 kHz band-pass like any doorway.

## Reading the songbook

Canon Song format. Drum lines are 16 steps, one bar of 16ths: `x` hit, `.` rest. Bass is one entry per step, counted from the current chord's root: `1` root, `5` fifth, `8` octave. Lead is one entry per 8th note, two bars, in steps of the song's scale from its key note; `8` is the octave, `-` holds a note. Where a song says so, the lead's 7 is played a semitone higher over the last chord. The form uses A, B and C for sections. Patterns loop under the whole chord loop.

## Songbook

```
"Level One: Car Park" · Square Wave Pelican · 150 bpm · C major · chords C G Am F · 2 bars each · tier C
kick   x...x...x...x...        snare  ....x.......x...        hat  x.x.x.x.x.x.x.x.
bass   1.1.5.1.1.1.5.1.
lead   5 . 8 . 7 5 3 . | 5 . 6 . 5 3 1 .      pulse A at 50%; pulse B: arp
form   intro 4 · A 8 · B 8 · A 8 · B 8 · A 8 · out 2
```

```
"Boss Fight at the Buffet" · Out of Order Sign · 172 bpm · D minor · chords Dm Bb C A · 2 bars each · tier C
kick   x..x..x.x..x..x.        snare  ....x.......x...        hat  xxxxxxxxxxxxxxxx
bass   1.1.1.8.1.1.1.8.
lead   1 . 3 . 5 . 8 . | 7 . 5 . 4 3 2 .      pulse A at 12.5%; pulse B: echo; 7 a semitone higher over A
form   intro 2 · A 8 · B 8 · A 8 · C 8 · A 8 · out 2
```

```
"Water Level, Sorry" · Low Battery Lullaby · 124 bpm · F major · chords F Am Bb C · 2 bars each · tier C
kick   x.......x.......        snare  ....x.......x...        hat  ..x...x...x...x.
bass   1...5...8...5...
lead   3 - 5 - 8 - 7 - | 6 - 5 - 3 - - .      pulse A at 50% with a wide slow vibrato (40 cents, 4 Hz); pulse B: arp at one note per 16th
form   intro 4 · A 8 · B 8 · A 8 · out 4
```

```
"Bonus Stage: Mini-Golf" · Quarter on the Glass · 160 bpm · G major · chords G Em C D · 1 bar each · tier C
kick   x...x...x...x...        snare  ..x...x...x...x.        hat  x.x.x.x.x.x.x.x.
bass   1...5...1...5...
lead   8 . 5 8 . 5 6 7 | 8 . 7 6 5 . 3 .      pulse A at 25%; pulse B: arp
form   intro 2 · A 8 · A 8 · B 8 · A 8 · out 1
```

```
"Continue? (Nine, Eight, Seven)" · Cabinet Number Nine · 138 bpm · A minor · chords Am F G E · 2 bars each · tier C
kick   x.....x...x.....        snare  ....x.......x...        hat  x.x.x.x.x.x.x.x.
bass   1.....1.5...1...
lead   8 . . 7 . . 5 . | 6 . . 5 . . 3 .      pulse A at 25%; pulse B: echo; 7 a semitone higher over E
form   intro 4 · A 8 · B 8 · A 8 · B 8 · out 9 (one hat tick per bar, counting down, then silence)
```

```
"High Score, No Initials" · Square Wave Pelican · 180 bpm · E minor · chords Em C D B · 1 bar each · tier C
kick   x...x...x...x...        snare  ....x.......x...        hat  xxxxxxxxxxxxxxxx
bass   1.8.1.8.1.8.1.8.
lead   1 . 5 . 8 . 5 . | 7 . 5 . 3 . 5 .      pulse A at 12.5%; pulse B: arp; 7 a semitone higher over B
form   intro 2 · A 8 · B 8 · A 8 · B 8 · A 8 · out 2
```

## Host lines

Loop: song, song, host line, ad, ident. Every fourth loop the host line is a segment script. A line is 180 characters or fewer. Each line starts with when it may play. `night` is 20:00 to 05:00, `dawn` 05:00 to 07:00, `storm` the 15:15 rain, `cut` just before the Sheriff's show takes the station at heat 4, `back` the first line after heat clears. `after-drift`, `after-jump` and `after-crash` need a `drift:end`, `jump:landed` or `vehicle:crash` in the last 60 seconds and take `{score}` or `{distance}` from it. `{bestDrift}` is `stats.bestDrift`.

1. any · Player Two here. Player One went to get change. Please wait.
2. after-song · Stage clear. Bonus: none. Next stage loading.
3. storm · Three-fifteen. Water level. Everybody hates the water level.
4. any · Tip: press start. In life, also.
5. cut · Warning. Boss approaching. The boss has a TV show and live rounds. Radio paused.
6. back · Boss escaped. No damage taken. Radio resumes. Nice run.
7. after-drift · Drift combo: {score} points. No extra life. Sorry. Rules.
8. after-jump · Air time logged. {distance} metres. Landing: debatable.
9. after-crash · You hit something. Minus zero points. We don't keep that score.
10. any · High score today: {bestDrift}. Initials: blank. Enter yours.
11. night · Night level. Same map. Harder to see. More neon.
12. any · Player One has been gone a while. I kept his turn. It's fine.
13. dawn · New day. Lives restored. Quarters not restored.
14. hurricane · Final level weather. Save your game. Then save your lawn furniture.
15. any · Hint: the pelican is not an enemy. Do not jump on the pelican.
16. any · Insert quarter to continue. Kidding. It's radio. It's free.
17. after-ad · That was a cutscene. You can't skip those here.
18. any · Error. Shit happened. Retry? Yes. No. There is no No.
19. any · Reminder. Out there, nobody has extra lives. In here, also nobody. I checked.
20. any · Pause menu tip: breathe. Then unpause. That's the whole tip.

## Idents

Each ident follows the jingle.

1. Arcade FM. Press start.
2. Eighty-seven point seven. Arcade FM. Player Two is ready.
3. Arcade FM. Four channels. No waiting. Some waiting.
4. This is Arcade FM. High score: yours.
5. Arcade FM. Insert quarter. Or don't. We play anyway.
6. Arcade FM. Player One, come back.

## Segments

### High Score Table
Three scores, read like the screen after a game. `{bestDrift}`, `{distanceKm}` and `{peakViewers}` come from the save's `stats`.

1. "High score table. First place: G-E-R, one pelican, score unknown, lives unlimited. Second place: you. Best drift {bestDrift}. Third place: Player One. Zero. Still out."
2. "High score table. Distance driven: {distanceKm} kilometres. Peak audience: {peakViewers}. Initials: please enter. Three letters. Keep it clean. The machine tells your mum."
3. "High score table. Top score at Coral Arcade today: nine thousand nine hundred and ninety. It's always that. Nobody knows whose it is. The initials are three dashes."

### Cheat of the Day
A cheat for real life. It never does anything useful, except script 2, which teaches how heat is lost.

1. "Cheat of the day. Left, left, horn, wave at a pelican. Effect: the pelican ignores you. This is normal pelican behaviour. Cheat confirmed."
2. "Cheat of the day. Park. Engine off. Wait. Effect: the Sheriff's viewers leave. This one is real. I don't know why they left it in."
3. "Cheat of the day. Hold brake at a red light. Effect: nothing happens. Nobody chases you. Nobody gets shot. Rare ending. Few players have seen it."

## New names

- Artists and their song titles, songbook only: Square Wave Pelican, Out of Order Sign, Low Battery Lullaby, Quarter on the Glass, Cabinet Number Nine.
- Player One: the absent first player. Never heard, never seen.
- Segments: High Score Table, Cheat of the Day.
- Sounds: the four channels (Pulse A, Pulse B, Triangle, Noise), `arp`, `echo`, the jingle.
- Station id `arcade` and frequency 87.7 FM.
