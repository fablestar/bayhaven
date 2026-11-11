# Bible · art · Synth patches

Every instrument the radio plays, as numbers a session can type into `src/audio/synth.js`: the fifteen from the table in `07-art-and-audio.md`, eight more, and a handful of small percussion and beds. Then the mixer: bus levels in dB, what ducks under what, and a reverb and a delay built only from delay nodes. Station files in `bible/radio/` add their own variants; where one gives a number for its station, that number is used there.

Tier: A unless a row carries another tag.

## 1. How a voice is built

|Rule|Value|
|---|---|
|Note to frequency|`440 × 2^((n - 69) / 12)`|
|Velocity to gain|`level × (velocity / 127)^1.5`|
|Level|dB into the music bus before the fader. The kick at -6 dB is the reference; a station's mix notes are offsets from its kick|
|Envelope|A / D / S / R: attack ms, decay ms, sustain level 0 to 1, release ms. Ramps are exponential, ending at 0.001|
|Filter|a biquad low-pass unless named. "+ env n" adds n Hz at the envelope's peak|
|Detune|cents, on the oscillator's `detune`|
|Sends|dB into the reverb or the delay of section 6|
|Voices|a note is a few nodes made at its start time and stopped at its end. Music may hold half the voice cap: 12, 18 and 24 on `low`, `medium` and `high`. A drum is one voice|
|Timing|notes are scheduled 0.12 s ahead on the audio clock, every 25 ms|
|Shuffle|Swamp Country 94 plays the off eighth at 66% of the beat. Every other station is straight|

## 2. Drums

|Patch|Source|Pitch|Filter|Amp A/D|Level|Notes|
|---|---|---|---|---|---|---|
|`kick`|sine, through `tanh(1.5x)`|150 to 48 Hz in 90 ms|none|1 / 280|-6|a click: 2 ms of white noise through a 2,000 Hz high-pass at -18. Variants: `dembow` D 180; `club` ends at 44 Hz, D 400; `soft` 120 to 50 Hz, D 200, at -10|
|`snare`|a triangle body and white noise|body 185 to 140 Hz in 60 ms|noise: band-pass 1,800 Hz, Q 0.8, then high-pass 700 Hz|body 1 / 120; noise 1 / 180|body -12; noise -9|variant `brush`: noise only, low-pass 3,000 Hz, 5 / 90. Tideline 98's long tail is in its station file|
|`clap`|white noise|none|band-pass 1,200 Hz, Q 1.4|three bursts of 1 / 10, 12 ms apart, then 1 / 140|-10|reverb -10|
|`hat`|white noise|none|high-pass 7,000 Hz|1 / 45|-16|rapid hats: 32nd-note rolls with velocity rising 60 to 110|
|`open-hat`|white noise|none|high-pass 6,000 Hz|1 / 320|-17|a `hat` cuts it off|
|`tom`|sine|180 to 90 Hz in 160 ms; three starts: 180, 150, 120 Hz|none|1 / 220|-10|from Tideline 98's file|

## 3. The other ten from the table

|Patch|Oscillators|Pitch|Filter|Amp A/D/S/R|Level and sends|Notes|
|---|---|---|---|---|---|---|
|`bass-808`|sine, through `tanh(2.2x)`, then a 900 Hz low-pass|starts 12 semitones up, down in 25 ms; overlapping notes glide in 90 ms|as given|2 / 900 / 0 / 60|-5|one voice|
|`saw-bass`|two saws at ±6 cents; a square an octave down at 0.4|none|two low-passes in series, 180 Hz + env 1,400, Q 4; filter env 3 / 160|3 / 180 / 0.6 / 80|-9|one voice|
|`lead`|two saws at ±9 cents|glide 40 ms; vibrato 6 Hz, 12 cents, after 200 ms|2,200 Hz + env 1,800, Q 2.5; filter env 5 / 240|8 / 120 / 0.7 / 160|-11; delay -9; reverb -14|one-note variant for Bassline FM: a square, 1,600 Hz, no vibrato|
|`pad`|three saws at -11, 0 and +11 cents; one an octave up at 0.3|none|900 Hz + env 600, Q 0.8; filter attack 600|420 / 600 / 0.8 / 900|-15; reverb -8|chorus: two delays of 14 and 21 ms swept ±3 ms at 0.3 Hz, mixed in at 40%. The gated pad is in Tideline 98's file|
|`pluck`|a saw; a square at 0.5|none|600 Hz + env 3,200, Q 3; filter decay 90|1 / 160 / 0 / 60|-12; delay -8|the delay is a dotted eighth|
|`marimba`|sines at 1, 4 and 10 times the note: 0, -10 and -22 dB|none|none|1 / 260 (420 below C3); the upper two decay in 40 and 15 ms|-10; reverb -14|UI plucks use the first two sines only|
|`bell`|FM: a sine carrier; a modulator at 3.5 times the note, index 4 falling to 0.5 over 900 ms|none|none|1 / 1,400 / 0 / 300|-14; reverb -8| |
|`guitar`|the string loop of section 4: feedback 0.996, a start burst averaged once, 1.5 s long|none|3,800 Hz|gate; R 80|-11; reverb -12|a strum plays a chord's notes 18 ms apart|
|`banjo`|the string loop: feedback 0.990, a raw noise burst, 0.8 s long; half of it also through a band-pass at 2,400 Hz, Q 2, at +6 dB|starts 30 cents sharp, settles in 40 ms|none|gate; R 40|-10|rolls on 16ths|
|`brass`|four saws: 0, +7 and -7 cents, and one an octave up at 0.4|a scoop from 40 cents flat in 50 ms|500 Hz rising to 2,600, Q 1.2; filter env 40 / 180|25 / 140 / 0.6 / 120|-10; reverb -12|stabs are three-note chords|
|`piano`|FM: a sine carrier; a modulator at the note, index 1.8 falling to 0.3 over 500 ms; a second at 14 times the note, index 0.4, gone in 30 ms|none|3,500 Hz|2 / 1,600 / 0 / 220; decay × 0.6 above C5|-11; reverb -12|`soft` for Low Tide Lounge: indexes × 0.6, 1,800 Hz, a 4.5 Hz tremolo of 15%|

## 4. The string loop

Guitar, banjo and upright bass are a plucked-string delay loop. A `DelayNode` inside a feedback loop cannot be shorter than one render block (128 samples, 2.9 ms), which would cap the pitch at 344 Hz, so the loop is run in plain JavaScript once per note and kept as an `AudioBuffer`:

```js
const N = Math.round(sampleRate / freq);
for (let i = 0; i < N; i++) y[i] = Math.random() * 2 - 1;          // the pluck
for (let p = 0; p < passes; p++) for (let i = N - 1; i > 0; i--) y[i] = 0.5 * (y[i] + y[i - 1]);
for (let n = N + 1; n < length; n++) y[n] = feedback * 0.5 * (y[n - N] + y[n - N - 1]);
```

`passes` is 1 for the guitar, 0 for the banjo, 2 for the upright bass. Buffers are made the first time a note is needed, one per note per patch, and kept: about 60 notes, under 4 MB in all. The random numbers come from the song's seed, so everyone hears the same pluck.

## 5. Eight more, and the small things

|Patch|Tier|Oscillators|Pitch|Filter|Amp A/D/S/R|Level and sends|Notes|
|---|---|---|---|---|---|---|---|
|`steel-pan`|B|FM: a sine carrier; a modulator at twice the note, index 1.5 falling to 0.2 in 300 ms; a sine at 4 times the note at -14 dB, gone in 120 ms|starts 15 cents sharp, settles in 80 ms|none|2 / 700 / 0 / 200|-11; reverb -9|long notes are struck again on every 16th. The Stilt House plays it from the bar|
|`organ`|C|sines at 0.5, 1, 2, 3 and 4 times the note, levels 0.6, 1, 0.5, 0.25, 0.2|vibrato 6.2 Hz, 7 cents|none|4 / 0 / 1 / 40|-13|a 6.2 Hz tremolo of 12%; a key click, 3 ms of noise at -24 dB; offbeat chords last 90 ms|
|`square-lead`|C|a pulse wave from `createPeriodicWave`: 32 harmonics, harmonic n at `2 / (nπ) × sin(nπd)`, duty d of 0.5, 0.25 or 0.125|vibrato 6 Hz, 20 cents, after 120 ms|none|0 / 0 / 1 / 10|-14|a chord is played as its notes in turn, 20 ms each|
|`triangle-bass`|C|triangle|falls an octave in 60 ms when used as a tom|none|0 / 0 / 1 / 10|-9| |
|`chip-noise`|C|a 1 s buffer of white noise in which each value is held for 8 samples|playback rate: kick 0.1 falling to 0.02 in 80 ms; snare 0.5; hat 1.0|none|kick 0 / 90; snare 0 / 120; hat 0 / 30|-12|all of Arcade FM's drums|
|`upright-bass`|A|the string loop: feedback 0.9985, 1.2 s long; a sine at the note at -6 dB with amp 2 / 350|glide 60 ms|1,400 Hz|gate; R 90|-8|walks in quarter notes|
|`conga`|A|a sine at 220 Hz (high) or 180 Hz (low)|starts 30% sharp, settles in 20 ms|none|1 / 180|-12|a slap: white noise through a band-pass at 1,400 Hz, Q 2, 1 / 25, at -14|
|`cowbell`|A|squares at 562 and 845 Hz|none|band-pass 800 Hz, Q 2.5|falls to 40% in 15 ms, then D 220|-15|the bell patterns at 180 bpm|

|Small thing|Tier|Recipe|Level|
|---|---|---|---|
|`clave`|A|a sine at 2,500 Hz, 0.5 / 40|-13|
|`rim`|A|a sine at 1,700 Hz, 0.5 / 20, with a 2 ms noise click|-14|
|`guiro`|A|white noise through a band-pass at 3,200 Hz, Q 3, chopped at 45 Hz; long 10 / 160, short 5 / 60|-16|
|`shaker`|A|white noise through a high-pass at 5,000 Hz, 12 / 45; accents at -14 and -20|-14|
|`riser`|B|white noise through a band-pass sweeping 400 to 6,000 Hz, Q 2, over two bars, rising in level|-12|
|`sub-drop`|B|a sine falling 90 to 30 Hz over one beat|-6|
|`vinyl` bed|A|clicks: single samples through a band-pass at 3,000 Hz, Q 0.7, six a second at random, at -30. Hiss: pink noise at -42. Wobble: every oscillator on the station detuned ±4 cents at 0.4 Hz|as given|
|`waves` bed|A|the `waves` loop from `sfx.md`|-24|

Which station uses what:

|Station|Tier|Patches|
|---|---|---|
|Tideline 98|A|`kick`, `snare` (long tail), `hat`, `tom`, `saw-bass`, `lead`, `pad` (gated), `pluck`, `bell`|
|Radio Palma|A|`kick` (`dembow`), `snare`, `hat`, `bass-808`, `piano`, `brass`, `cowbell`, `clave`, `conga`, `guiro`|
|Bassline FM|A|`kick` (`club`), `clap`, `hat` (rapid), `open-hat`, `bass-808`, `lead` (one note), `riser`, `sub-drop`|
|Swamp Country 94|A|`kick`, `snare` (`brush`), `hat`, `upright-bass`, `banjo`, `guitar`|
|Low Tide Lounge|A|`kick` (`soft`), `rim`, `hat` at -22, `upright-bass`, `piano` (`soft`), `pad`, the `vinyl` and `waves` beds|
|The Grind 24/7|A|`kick`, `snare`, `clap`, `hat`, `tom`: drums only|
|Bayhaven Public Radio|A|talk; idents on `marimba` and `bell`|
|Postcard 66|C|`guitar` with a 5 Hz tremolo of 30% and reverb at -6, `organ`, `upright-bass`, `kick`, `snare`|
|The Crash|C|`lead` through `tanh(4x)` as a fuzz guitar, `saw-bass`, `kick`, `snare`, `hat`|
|Glitterball 107|C|`kick` on every beat, `clap`, `open-hat` on the offbeats, `saw-bass` in octaves, `pad` opened to 2,400 Hz as strings, `brass`, `piano`|
|Reef Roots|C|`kick`, `rim`, `organ` on the offbeats, `saw-bass` closed to 120 Hz, `steel-pan`, the dub echo|
|Arcade FM|C|two `square-lead`s, `triangle-bass`, `chip-noise`|

### From a song line to a patch

The song format in the canon names tracks, not patches. Each station maps them once:

|Track in a song|Plays|Note length|
|---|---|---|
|`kick`, `snare`, `hat`|the station's drum patches; `x` is velocity 100, `X` 127, `o` 70|one shot|
|`bass`|the station's bass (`saw-bass`, `bass-808` or `upright-bass`), scale degrees in octave 2|90% of a step; tied steps glide|
|`lead`|the station's lead (`lead`, `pluck`, `banjo`, `steel-pan` or `square-lead`), octave 4 and 5|80% of a step|
|`pad`|`pad`, `organ` or `piano`, the chord's root, third, fifth and seventh in octave 3|the whole bar, or gated on 8ths where the song says so|
|extra lines (`clave`, `bell`, `stab`, `tom`)|the patch of that name; `bell` is `cowbell` on Radio Palma, `stab` is `brass`|one shot|

A melody made from a song's seed is fixed the first time it is built and stored with the song, so every player hears the same notes.

## 6. The mixer

Buses, as `07` names them: master, then music, effects, ambience, voice and UI.

|Bus|Fader at default|Notes|
|---|---|---|
|master|0 dB|a limiter: `DynamicsCompressorNode` with threshold -3 dB, knee 0, ratio 20, attack 3 ms, release 250 ms; then a `tanh` curve scaled so full scale in gives 0.98 out. The mute key `0` takes master to silence in 50 ms|
|music|-10 dB|times the Music slider (0.8 in a new save)|
|effects|-6 dB|times the Effects slider|
|ambience|-14 dB|times the Effects slider|
|voice|-8 dB|times the Voice slider|
|UI|-12 dB|times the Effects slider|

|What ducks|Under|By|Attack / hold / release|
|---|---|---|---|
|music|voice blips|6 dB|30 ms / the line plus 150 ms / 400 ms|
|music|the LIVE chat ping|3 dB|10 ms / 60 ms / 250 ms|
|music|a stinger|6 dB|20 ms / the stinger / 500 ms|
|music|an explosion|4 dB|5 ms / 600 ms / 600 ms|
|music|Bus Driver Voice|6 dB|10 ms / 900 ms / 400 ms|
|`pad` and bass on Bassline FM and Glitterball 107|each kick|5 dB|12 ms / none / 180 ms|
|`pad` on Tideline 98|each kick|4 dB|12 ms / none / 120 ms|
|ambience|being inside a vehicle|6 dB|300 ms each way|
|music|stepping out of the vehicle|a 600 Hz low-pass and 12 dB within 6 m of the car; silent past 20 m|300 ms|
|music|the Sheriff's show at heat 4 and up|20 dB, and a band-pass at 1,800 Hz, Q 1.5, like a small speaker|200 ms each way|
|music|the phone being open|a low-pass at 1,800 Hz|200 ms|
|every bus but UI|the pause card|to -60 dB|200 ms|

Ducks are gain ramps on the bus (`audio.duck(bus, dB, seconds)`), not compressors. Two ducks at once use the deeper one.

### Reverb from delay nodes only

Any loop made of a `DelayNode` must be at least 128 samples long (2.9 ms at 44.1 kHz). Every loop here is longer.

|Stage|Build|
|---|---|
|In|the sum of the sends, then a 12 ms pre-delay|
|Four combs, side by side|each: a delay whose output goes back to its input through a 4,200 Hz low-pass and a gain `g`. Delays 29.7, 37.1, 41.1 and 43.7 ms. For a decay time T, `g = 10^(-3 × delay / T)`|
|Sum|the four comb outputs × 0.25|
|Two all-passes, in series|delays 5.0 and 3.5 ms, g 0.7. Each: `sum = in + 0.7 × delayOut`; the delay's input is `sum`; `out = delayOut - 0.7 × sum`|
|Out|a wet gain into the bus|
|Stereo|on `medium` and `high`, a second set for the right channel with every comb delay × 1.021. On `low`, one set in mono: 7 delay nodes|

|Preset|T|Comb gains|Wet|Used for|
|---|---|---|---|---|
|`room`|0.5 s|0.663, 0.599, 0.567, 0.547|-14 dB|claps, UI|
|`plate`|1.2 s|0.843, 0.808, 0.789, 0.778|-12 dB|music|
|`street`|0.8 s|0.774, 0.726, 0.701, 0.686|-10 dB|gunshot and explosion tails on the effects bus|
|`hall`|2.4 s|0.918, 0.899, 0.888, 0.882|-10 dB|ship horns, thunder|
|`tunnel` (B)|1.6 s|0.880, 0.852, 0.837, 0.828|-8 dB|engine and horn under the expressway and in the Mangrove Tunnel|

The game runs two reverbs: one for music (`plate`) and one for effects (`street`, switched to `hall` or `tunnel` by place).

### Delay

|Delay|Build|
|---|---|
|Tempo delay|time `60 / bpm × 0.75` (a dotted eighth) or `× 0.5`. Two delay nodes of that time, the left feeding the right and the right feeding the left, each through a 2,800 Hz low-pass, a 300 Hz high-pass and a gain of 0.38, panned ±0.7. Wet -14 dB|
|Horn echo|one delay of 180 ms, feedback 0.35|
|Dub echo (C)|the tempo delay with feedback 0.62 through a band-pass at 900 Hz, Q 1; its send is opened only on single snare hits|
|Chorus|two delays of 14 and 21 ms with an oscillator at 0.3 Hz moving each by ±3 ms; no feedback|

## New names

- Patch ids: `kick`, `snare`, `clap`, `hat`, `open-hat`, `tom`, `bass-808`, `saw-bass`, `lead`, `pad`, `pluck`, `marimba`, `bell`, `guitar`, `banjo`, `brass`, `piano`, `steel-pan`, `organ`, `square-lead`, `triangle-bass`, `chip-noise`, `upright-bass`, `conga`, `cowbell`, `clave`, `rim`, `guiro`, `shaker`, `riser`, `sub-drop`, and the `vinyl` and `waves` beds.
- Variants: `dembow`, `club`, `soft`, `brush`. Reverb presets: `room`, `plate`, `street`, `hall`, `tunnel`.
- No new people, places or brands.
