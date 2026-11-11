# Bible · radio · Bassline FM

Bassline FM is the club station: half-time bass songs with sliding 808s and rolling hats, and four-on-the-floor club songs. DJ Subtropic reads everything as a weather forecast. Below: identity, voice, sound recipe, six songs, 20 lines, six idents and two segments.

Tier: A for the station, songs 1 to 3, host lines 1 to 6 and idents 1 and 2. B for songs 4 to 6, host lines 7 to 20, idents 3 to 6 and both segments.

## Identity

| Field | Value |
|---|---|
| Id | `bassline` (the id in the save example) |
| Frequency | 101.9 FM, dial position 8 of 12 |
| Slogan | "Ninety-four percent bass." |
| Who listens | Clubbers, the queue outside Humidity, the Thursday race meet at the Tank Farm, Teo |
| Starts in | Sailfin, Cobia, Bonito, Snapper, Pinfish, Skimmer, Dragonfly. Teo's first station in a new game. |
| Also starts in, until their own stations ship | Anchovy, Gnat, Wahoo, Needlefish, Sandflea, Swordtail |
| Shops that play it | The Paintworks (Humidity, Container Row, Wet Paint Alley after dark). Tideline's Pier Quarter after 20:00. Car washes, until Glitterball 107 ships. |
| Ships | Day 4. The day 4 clip flips from Tideline 98 to this station as the neon comes on. Humidity's roof lights follow this station's kick. |

Start rule, the same on every station: a vehicle taken from traffic or the kerb is already tuned to its own station. The first Q or E press sets the lead's remembered station, and garage vehicles open on that.

## The host: DJ Subtropic

He read the weather on BHTV 6 until he started reading it over a beat. He still has the pointer.

1. Everything is a forecast. Bass comes in percent and hertz, drops are fronts, queues are pressure systems.
2. The number comes first, then the joke. Sentences run under ten words.
3. He never asks a crowd to make noise. He issues advisories. Gunfire and bodies get a percentage like any other weather.

Speech blip: sine, 98 Hz, with a copy one octave down at half volume, 80 ms per syllable, 5 syllables a second, one 60 ms echo.

## Sound recipe

| Part | Value |
|---|---|
| Tempo | 130 to 150 bpm |
| Scales | Natural minor and Phrygian |
| From the `07` list | kick, snare, clap, hats, 808 bass, saw bass, lead, pluck, bell |
| New: riser | White noise through a band-pass that sweeps from 400 Hz to 8 kHz over 2 bars, volume rising with it, cut on the downbeat |
| New: sub drop | Sine falling from 120 to 35 Hz over one bar, on the first bar of a drop |
| New: foghorn | Saws at 110 and 116.5 Hz through a 900 Hz low-pass, 300 ms, a ship's horn from the port |
| New: plate rattle | A 40 ms burst of noise through a 6 kHz band-pass, fired with every 808 note at −18 dB |
| Half feel | Kick sparse, the snare (with a clap on top) on beat 3 only, hats in 8ths with rolls. Used with the 808. |
| Club feel | Kick on every beat, snare and clap on 2 and 4, open hat on every offbeat. Used with the saw bass. |

Mix notes: the 808 is the loudest thing on the station at 0 dB, soft-clipped (tanh, drive 2.5), with a 500 ms decay. The kick sits at −2 dB and ducks the 808 by 6 dB for 60 ms. Everything under 150 Hz is mono. One-note leads sit at −10 dB with a 3 kHz low-pass. The master limiter may pump by up to 2 dB on drops; that is wanted here and nowhere else.

## Reading the songbook

Canon Song format. Drum lines are 16 steps, one bar of 16ths: `x` hit, `o` open hat, `r` two hits in one step, `.` rest. Bass is one entry per step, counted from the current chord's root: `1` root, `3` the chord's own third, `5` fifth, `8` octave, other numbers on the major scale, `b` lowers a semitone; `-` holds a note, `~` slides into the note from the one before over 90 ms. Lead is one entry per 8th note, two bars, in steps of the song's scale from its key note; `8` is the octave. Patterns loop under the whole chord loop.

## Songbook

```
"Ninety-Four Percent" · Kid Condensation · 140 bpm · F minor · chords Fm Db · 4 bars each · tier A
kick   x.....x...x.....        snare  ........x.......        hat  x.x.x.xrx.x.x.rr
bass   1---..1-..~5--.~1-
lead   5 . . 5 . . 5 . | . 5 . . 5 . 5 .      lead: one note on the bell, an octave up for the last 4 bars of each verse
form   intro 4 · verse 16 · drop 8 · verse 16 · drop 8 · out 4
```

```
"Guest List Says No" · Low Pressure Lisa · 130 bpm · G minor · chords Gm Eb Bb F · 2 bars each · tier A
kick   x...x...x...x...        snare  ....x.......x...        hat  ..o...o...o...o.
bass   ..1...1...1...1.
lead   8 8 . 8 . 8 8 . | 8 8 . 8 . 7 8 .      lead: pluck; riser over the last 2 bars of each build
form   intro 8 · build 8 · drop 16 · break 8 · build 8 · drop 16 · out 8
```

```
"Sandbag Season" · Wet Bulb Collective · 150 bpm · D minor · chords Dm Bb · 4 bars each · tier A
kick   x..x..x...x.....        snare  ........x.......        hat  x..x..x.x..x..xr
bass   1--1--1-..~5--...
lead   8 . . 8 . . 7 . | 8 . . 8 . . 5 .      fx: foghorn on beat 1 of every 8th bar; sub drop on the first bar of each drop
form   intro 4 · verse 16 · drop 8 · verse 16 · drop 16 · out 4
```

```
"Valet Took the Bonito" · Heat Index Finger · 145 bpm · E minor (Phrygian) · chords Em F · 2 bars each · tier B
kick   x.....x..x......        snare  ........x.......        hat  x.xrx.x.xrx.x.rr
bass   1-....1-~5--...1-
lead   1 . 2 . 1 . . . | 1 . 2 . 3 . 2 .      lead: saw lead, 3 kHz low-pass, no vibrato
form   intro 4 · verse 16 · drop 8 · verse 16 · drop 8 · out 4
```

```
"Strobe Warning" · The Dew Point Twins · 134 bpm · A minor · chords Am F C G · 2 bars each · tier B
kick   x...x...x...x...        snare  ....x.......x...        hat  x.o.x.o.x.o.x.o.
stab   x..x..x...x..x..        (saw chord stab, 70 ms, drops only)
bass   1.11..1.1.11..1.
lead   5 . 5 . 5 5 . 5 | 5 . 5 . 5 5 . 8      lead: pluck; riser over the last 2 bars of each build
form   intro 8 · build 8 · drop 16 · break 8 · build 8 · drop 16 · out 8
```

```
"Sub in the Boot of a Snook" · Big Barometer · 142 bpm · C minor · chords Cm Ab · 4 bars each · tier B
kick   x......x..x.....        snare  ........x.......        hat  x.x.xrx.x.x.x.xr
bass   1-------..1-~3-~1-
lead   3 . . . 3 . . . | 3 . . 3 . . 5 .      fx: plate rattle at −12 dB instead of −18 on this song
form   intro 4 · verse 16 · drop 8 · verse 16 · drop 8 · out 4
```

## Host lines

Loop: song, song, host line, ad, ident. Every fourth loop the host line is a segment script. A line is 180 characters or fewer. Each line starts with when it may play. `night` is 20:00 to 05:00, `dawn` 05:00 to 07:00, `storm` the 15:15 rain, `cut` just before the Sheriff's show takes the station at heat 4, `back` the first line after heat clears. Lines 1 to 6 are tier A, the rest B.

1. any · Humidity's at ninety-four percent. So is this bassline.
2. any · Bassline FM, 101.9. I'm DJ Subtropic. Tonight's low is forty hertz.
3. storm · Three-fifteen. Precipitation: one hundred percent. Duration: forty minutes. Bass: unaffected.
4. after-song · That front has passed. Another is moving in from the east at one hundred and forty beats a minute.
5. cut · Advisory. The Sheriff is taking this frequency. Expect scattered gunfire and a seventy percent chance of a body.
6. back · All clear. Viewers at zero, pressure falling. We return you to your scheduled low end.
7. night · Tonight's outlook: dark, loud, with a ninety percent chance of a queue outside Humidity.
8. Friday · Friday advisory. Humidity is at capacity. That's the club. The air is also at capacity.
9. Thursday · Thursday. Race meet at the Tank Farm at eleven. Wind: whatever the cars make. Chance of a fireball: forty percent.
10. any · Feels like 104 out there. Feels like 140 in here. The second one is tempo.
11. in The Paintworks · You've entered The Paintworks. Visibility: strobe. Conditions: sticky floor.
12. rain · Rain's coming down in sixteenths. I checked. It's on the grid.
13. any · Advisory. If your mirrors are shaking, that's us. If your windows are shaking, that's a shotgun. Learn the difference.
14. hurricane · Category: who gives a shit. I have a generator, eleven records and no plans to leave the booth.
15. dawn · Sunrise at six. Dew point seventy-five. If you're still dancing, drink some water.
16. any · Pressure's dropping. So is the next one. Brace.
17. after-ad · That was a commercial front. Brief, full of shit, passing now.
18. any · UV index: extreme. Bass index: worse. Sunscreen won't help with the second one.
19. Saturday · Saturday. Yacht party at the club at nine. They've asked us to keep it down. Forecast says no.
20. any · Barometer's steady. Speakers aren't. Stay inside. Stay loud.

## Idents

Spoken dry over a sub drop. Idents 1 and 2 are tier A, the rest B.

1. Bassline FM. Ninety-four percent bass.
2. One-oh-one point nine. Bassline FM. Tonight's low: forty hertz.
3. Bassline FM. Loud, with a chance of louder.
4. You are in the warning area. Bassline FM.
5. Bassline FM. Conditions: sticky.
6. Bassline FM. The forecast is bass.

## Segments

### The Five-Night Forecast (tier B)
The week's nights, read as an outlook. Script 1 is the default; it follows the canon week.

1. "The five-night forecast. Thursday: engines at the Tank Farm, gusting to loud. Friday: Humidity full by ten. Saturday: yachts. Sunday: everything shuts early and the bass moves indoors. Monday: garbage trucks at dawn, keeping time."
2. "The five-night forecast. Tonight: warm. Tomorrow: warm, louder. After that the models disagree, but every one of them has a kick drum in it. Storm daily at three-fifteen. Plan your hair around it."
3. "The five-night forecast. A ridge of high pressure sits over The Paintworks until further notice. Expect queues, strobes and one man asking if you know who he is. Nobody does. Lows near forty hertz."

### Door Report (tier B)
Who and what did not get into Humidity tonight. Plays between 21:00 and 04:00. The people turned away are always people with power.

1. "Door report, Humidity. Admitted: four hundred and twelve. Turned away: one. Tripp Vandermeer, plus eleven, in boat shoes. He said it was his party. It was not his party."
2. "Door report, Humidity. Chad and Brad from Bellweather security tried the door in matching polo shirts. The door has a rule about twins in polo shirts. It's a new rule. It's a good rule."
3. "Door report, Humidity. Taken at the door: nine pistols, two shotguns, one flare gun, one lawn flamingo. Handed back at closing: eight pistols. Somebody is having a worse night than you."

## New names

- Artists and their song titles, songbook only: Kid Condensation, Low Pressure Lisa, Wet Bulb Collective, Heat Index Finger, The Dew Point Twins, Big Barometer.
- Segments: The Five-Night Forecast, Door Report.
- Instruments and effects: riser, sub drop, foghorn, plate rattle.
- Frequency 101.9 FM. DJ Subtropic's past at BHTV 6 is new backstory.
