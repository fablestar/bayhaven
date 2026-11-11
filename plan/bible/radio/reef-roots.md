# Bible · radio · Reef Roots

Reef Roots plays dub: heavy slow bass, a chord on every offbeat, lots of empty space and echo. Auntie Dub hosts from a houseboat in the Keys and has never hurried in her life. Below: identity, voice, sound recipe, six songs, 20 lines, six idents and two segments.

Tier: C for everything in this file.

## Identity

| Field | Value |
|---|---|
| Id | `reefroots` |
| Frequency | 96.9 FM, dial position 6 of 12 |
| Slogan | "Slow down. The tide will wait." |
| Who listens | The Keys, houseboats, fishing boats, kayak hire, anyone on the Longspan at sunset |
| Starts in | Hermit, Minnow, Shrimper, Cormorant |
| Before it ships | Hermit, Minnow and Cormorant use Low Tide Lounge. Shrimper uses Swamp Country 94. |
| Shops that play it | The Pelican Keys: the shacks, the houseboat marina, the dock of The Stilt House (the bar keeps its own steel drums). The kayak hut in Heron Marsh. The shacks at the Jetty. |
| Studio | A houseboat in the marina on Hammock Key |

Start rule, the same on every station: a vehicle taken from traffic or the kerb is already tuned to its own station. The first Q or E press sets the lead's remembered station, and garage vehicles open on that.

## The host: Auntie Dub

She has run the station from the same houseboat since before the Longspan had a speed limit. People bring her fish. She plays them a record.

1. She never hurries. One thought to a line, then space.
2. Advice comes as a saying about tides, boats or cooking. It is always kind. She never swears. When people are shot she talks about who is left.
3. The last word or two of every line comes back as an echo. It is written once more in brackets.

Speech blip: sine plus triangle, 130 Hz, 120 ms per syllable, 3.5 syllables a second. The bracketed echo is the same blips again, twice, 375 ms apart, each 6 dB quieter through a 1.5 kHz low-pass. The ticker shows the bracketed words at 60% opacity.

## Sound recipe

| Part | Value |
|---|---|
| Tempo | 68 to 80 bpm |
| Scales | Natural minor, Dorian and major. Two chords a song. |
| From the `07` list | kick, snare, hats, guitar-like pluck, piano-like, brass stab |
| New: dub bass | Sine with 20% triangle through a 250 Hz low-pass, 15 ms attack, each note held until the next, sliding between notes in 40 ms. The loudest thing on the station. |
| New: skank | Guitar-like pluck and piano-like playing the chord together, 70 ms, high-passed at 400 Hz, on every offbeat |
| New: bubble | Square through a 1.2 kHz low-pass, 50 ms, chord notes on the 16ths either side of each skank, at −14 dB |
| New: rim | 900 Hz click, 15 ms. On this station the snare line is always the rim. |
| New: steel pan | Sines at a note and its octave with a short burst near four times the note, 400 ms decay, 5 Hz wobble |
| New: reed | Square plus saw through a 1 kHz band-pass, 40 ms attack, light vibrato |
| New: tape echo | A delay of a dotted 8th, 55% feedback, each repeat through a 1.8 kHz low-pass. A "throw" sends one hit fully into it. |
| One drop | Kick and rim together on beat 3, nothing on beat 1 |
| Steppers | Kick on every beat, rim on beat 3 |
| Rockers | Kick on beats 1 and 3, rim on 2 and 4 |

Mix notes: bass 0 dB, kick −3, rim −6, skank −8, lead −7. Nothing above 6 kHz except the hats. In a `dub` section everything stops but drums and bass; the skank returns one hit in four, each as a throw. Leave the gaps empty: the echo fills them.

## Reading the songbook

Canon Song format. Drum lines are 16 steps, one bar of 16ths: `x` hit, `.` rest. `swing 60%` puts every second step 60% of the way through its pair. Bass is one entry per step, counted from the current chord's root: `1` root, `3` the chord's own third, `5` fifth, other numbers on the major scale, `b` lowers a semitone. Lead is one entry per 8th note, two bars, in steps of the song's scale from its key note; `8` is the octave. Patterns loop under the whole chord loop.

## Songbook

```
"Slow Boat, Fast Tide" · Hammock Key Hi-Fi · 72 bpm · A minor · chords Am Dm · 2 bars each · swing 60% · tier C
kick   ........x.......        snare  ........x.......        hat  x.xxx.xxx.xxx.xx
skank  ..x...x...x...x.
bass   1..1..3.5.....3.
lead   5 . . . 3 . 1 . | . . 4 . 3 . . .      lead: reed
form   intro 4 · verse 8 · chorus 8 · verse 8 · chorus 8 · dub 8 · chorus 8 · out 4
```

```
"Houseboat Steppers" · The Causeway Echo Unit · 76 bpm · G minor · chords Gm Cm · 2 bars each · swing 60% · tier C
kick   x...x...x...x...        snare  ........x.......        hat  x.x.x.x.x.x.x.x.
skank  ..x...x...x...x.        bubble .x.x.x.x.x.x.x.x
bass   1.1...5.b7...5.1.
lead   1 . 3 . 4 . 5 . | 7 . 5 . 4 . 3 .      lead: brass stabs, three notes wide
form   intro 4 · verse 8 · chorus 8 · verse 8 · dub 16 · chorus 8 · out 4
```

```
"Mangrove Roots Run Deep" · The Brackish Brothers and Sisters · 70 bpm · D minor · chords Dm C · 2 bars each · swing 60% · tier C
kick   ........x.......        snare  ........x.......        hat  x.xxx.xxx.xxx.xx
skank  ..x...x...x...x.
bass   1.....5.1..3..5.
lead   8 . 7 . 5 . . . | 4 . 5 . 3 . . .      lead: steel pan
form   intro 4 · verse 8 · chorus 8 · verse 8 · chorus 8 · dub 8 · chorus 8 · out 4
```

```
"Pot on the Stove" · Low Flame Orchestra · 74 bpm · E minor (Dorian) · chords Em A · 2 bars each · swing 60% · tier C
kick   x.......x.......        snare  ....x.......x...        hat  x.xxx.xxx.xxx.xx
skank  ..x...x...x...x.
bass   1..1....5..6..5.
lead   5 . 6 5 . 3 . 1 | 2 . 3 . 1 . . .      lead: reed, doubled by brass stabs in the chorus
form   intro 4 · verse 8 · chorus 8 · verse 8 · chorus 8 · dub 8 · out 4
```

```
"Tide Table Dub" · Hammock Key Hi-Fi · 68 bpm · C major · chords C F · 2 bars each · swing 60% · tier C
kick   ........x.......        snare  ........x.......        hat  x.x.x.x.x.x.x.x.
skank  ..x...x...x...x.
bass   1...3.5...6.5...
lead   3 . . 5 . . 6 . | 5 . . 3 . . 1 .      lead: steel pan; every second phrase is a throw
form   intro 8 · dub 16 · verse 8 · dub 16 · out 8
```

```
"No Rush on the Longspan" · The Idle Speed Players · 80 bpm · F major · chords F Gm · 2 bars each · swing 60% · tier C
kick   x...x...x...x...        snare  ........x.......        hat  x.xxx.xxx.xxx.xx
skank  ..x...x...x...x.        bubble .x.x.x.x.x.x.x.x
bass   1.1.5...1.3.5...
lead   1 . 2 3 . 5 . 3 | 6 . 5 . 3 . 2 .      lead: reed and steel pan in turn, 4 bars each
form   intro 4 · verse 8 · chorus 8 · verse 8 · chorus 8 · dub 8 · chorus 8 · out 4
```

## Host lines

Loop: song, song, host line, ad, ident. Every fourth loop the host line is a segment script. A line is 180 characters or fewer. Each line starts with when it may play. `night` is 20:00 to 05:00, `dawn` 05:00 to 07:00, `hot` clear weather from 11:00 to 15:00, `storm` the 15:15 rain, `cut` just before the Sheriff's show takes the station at heat 4, `back` the first line after heat clears.

1. any · This is Reef Roots. Auntie Dub on the houseboat. The tide is slow, so we go slow. (slow)
2. after-song · Let that one settle. A good pot is never stirred in a hurry. (hurry)
3. storm · Three-fifteen. Rain on the deck. The sky keeps its appointments. Do you? (do you)
4. any · The fastest boat still waits for the bridge. Ease off, child. (ease off)
5. cut · The Sheriff is borrowing the wire. Loud man, small boat. We wait. (wait)
6. back · The shooting has stopped. The tide takes the noise out. It does not bring anybody back. Eat something. (eat)
7. in The Islands · You are on the Longspan now. Five keys, one road. Nobody overtakes a sunset. (sunset)
8. night · Sirens on the mainland again. Somebody's mother is waiting up tonight. Leave a lamp on for her. (lamp on)
9. dawn · Morning on the water. The pelicans are up. They don't rush, and they still eat. (eat)
10. any · If you are hearing this in a fast car, the car is wrong. (wrong)
11. rain · Rain washes the deck for free. Say thank you. (thank you)
12. hurricane · Big wind coming. Tie everything twice. Then come inside and tie yourself to a chair. (chair)
13. any · They are selling towers by the beach. The sea was here first. The sea is patient. (patient)
14. Sunday · Sunday. Boat parade at four. Wave at every one. Small boats first. (first)
15. any · Low tide shows you what the water was hiding. Now and then, a car with the windows up. (windows up)
16. Wednesday · Cruise ship in port. Four thousand people in a hurry to relax. (relax)
17. after-ad · That was somebody selling something. Now here is something free. (free)
18. any · Bass is like an anchor. You don't see it. You would miss it. (miss it)
19. hot · Hot today. Find shade, find water, find somebody to share both. (both)
20. any · Whatever you ran from today, it will keep until tomorrow. Eat first. (eat first)

## Idents

Spoken over one bar of bass alone. The echo carries on into the next song.

1. Reef Roots. Slow down. The tide will wait. (wait)
2. Ninety-six point nine. Reef Roots. Bass you can stand on. (stand on)
3. Reef Roots, from the houseboat. (houseboat)
4. This is Reef Roots. No rush. (no rush)
5. Reef Roots. Low end, low tide. (low tide)
6. Reef Roots, with Auntie Dub. Eat first. (eat first)

## Segments

### Tide Table
She reads the day's tide and turns it into advice.

1. "Tide Table. High water at the lighthouse just after six. Low water at noon. So do your leaving early and your thinking at lunch. The sea has a schedule, and you are on it. (on it)"
2. "Tide Table. Low water at The Stilt House at four. You can see the legs it stands on. Everything looks different when you see what is holding it up. (holding it up)"
3. "Tide Table. Spring tide tonight. The water will come further up the road than you would like. Move the car now. Not after this song. Now. I will wait. (wait)"

### What's in the Pot
One recipe, said in one breath. It always ends with waiting.

1. "What's in the Pot. Rice, peas, thyme and whatever the boat brought. Lid on. Fire low. Don't lift the lid. I said don't. Twenty minutes. Then wait some more. (more)"
2. "What's in the Pot. Fish stew. One fish, two tomatoes, three limes, and a bottle of Lava Abuela if you are brave. One spoon of it if you are not. Stir once. Then wait. (wait)"
3. "What's in the Pot. Nothing. The pot is resting. A pot needs a day off, same as you. Have a mango. Sit down. (sit down)"

## New names

- Artists and their song titles, songbook only: Hammock Key Hi-Fi, The Causeway Echo Unit, The Brackish Brothers and Sisters, Low Flame Orchestra, The Idle Speed Players.
- Segments: Tide Table, What's in the Pot.
- Instruments and effects: dub bass, skank, bubble, rim, steel pan, reed, tape echo and the throw.
- Station id `reefroots` and frequency 96.9 FM. The houseboat studio on Hammock Key is new; the marina is canon.
