# Contract · src/audio (lane: Sound)

All sound is made in code. There are no audio files.

| Name | Signature | Meaning |
|---|---|---|
| modules.audio | `start()` · `toggleMute()` · `ctx` (the AudioContext, null until the first input) · `bus(name) → node` · `duck(bus, dB, seconds, { attack, release, id })` · `unduck(id)` · `rms('music' or 'master')` · `muted` · `mixer` · `crash(speed)` · `clang()` · `clatter()` · `setHorn(on)` · `stats { gear, q, squeal, crashes, clangs, clatters, horn, shifts }` | The mixer and the car. Buses: `music` (-10 dB), `effects` (-6), `ambience` (-14), `voice` (-8), `ui` (-12), into a master with a limiter (compressor -3 dB, ratio 20, then tanh to 0.98). Connect a sound to `bus(name)`. A duck is a gain ramp; two at once use the deeper one; `seconds: Infinity` holds until `unduck(id)`. The engine, squeal, hits and horn are on `effects`; wind and surf on `ambience` |
| `engine.js` | `createMixer(settings)` · `createAudio(mixer)` · `BUSES` | The mixer and day 1's car sounds |
| `synth.js` | `createSynth(ac, out, { voiceCap, stereo }) → { play(patch, ev, time), setTempo(bpm), duck(group, dB, release, time), hush(), patches, stats { voices, played, stolen }, groups }` | 23 patches: `kick snare clap hat open-hat tom bass-808 saw-bass lead pad pluck marimba bell piano brass cowbell clave rim conga guiro riser sub-drop foghorn`. `ev`: `{ n or notes, v (0 to 127), d (seconds), variant, gate, slide, pan }`. A plate reverb and a tempo delay made of delay nodes. The oldest voice is stolen at the cap (half of `audioVoices`) |
| `music.js` | `createMusic(ac, synth) → { play(song, station, { at, hold }), release(), stop(), onEnd, beat, pulse, bpm, bar, section, steps }` · `compile(song)` · `parse(str)` · `chord(name)` · `SCALES` | The 16-step sequencer: scheduled 0.12 s ahead every 25 ms. `beat` is beats since the song began; `pulse` is 1 on a kick and fades in a third of a second. `hold` loops the intro until `release()` |
| `voice.js` | `speak(ac, out, text, voice, at, minSeconds) → { seconds, syllables, cancel() }` · `plan(text, voice)` · `syllables(word)` | Speech as blips, one per syllable. `voice`: `{ wave, hz, ms, rate, end, sub, echo, lp, vibrato }` |
| modules.radio | `on` · `station` (id) · `stations` · `song` · `line` · `section` · `next()` · `prev()` · `tune(id, remember)` · `skip()` · `beat` · `pulse` · `bpm` · `stats { songs, lines, hosts, ads, idents, switches }` | Plays in vehicles only. Loop per station: song, song, then over the next song's held intro a host line, an ad and the ident. Tuning in speaks the ident at once. Out of the car it is muffled (600 Hz, 12 dB and more) to 20 m, then off. Lights that follow the music read `beat` and `pulse` |
| a station, `src/content/radio/<id>.js` | `{ id, name, freq, dial, tier, slogan, host: { name, voice }, recipe, startsIn: [vehicle ids], firstFor, kit, duck, songs, lines, idents, ads: [ad ids] }` | Found by itself. `lines` are `'<when> · <text>'`; `when` is `any night day dawn storm rain after-song after-ad cut back` |
| a song | `{ title, artist, seed, bpm, key, scale, bars (per chord), div (2 when a step is an eighth), chords, kick snare hat clap tom clave bell conga stab fog sub (16-step strings), when: { line: rule }, bass, bassAhead, lead, oneNote, montuno, double, pad ('whole', 'gate8', 'gate16', a gate string, 'none'), padHalf, arp, kit, form: [[section, bars]] }` | Sections: `intro verse chorus drop montuno brass break build out`. A rule is section names, `last8` or `first:<section>`. The lead in the big sections alternates the written hook with a melody made from `seed` |
| the ad pool, `src/content/radio/ads.js` | `{ kind: 'ads', voices, ads: { id: { brand, voice, text } } }` | 12 of the bible's 48 |

Test API: `test.audio() → { running, time, muted, buses, rms { music, master }, duck { bus: dB }, limiter }` · `test.radio() → { on, station, song, line, section, bar, beat, pulse, steps, stats, voices, patches, remembered, stations: [{ id, name, freq, host, songs, lines, idents, ads, songInfo }] }`.

Events I emit: `audio:started`, `radio:station { id, name, freq, host }`, `radio:song { station, title, artist, bpm, seconds }`, `radio:line { station, kind: 'host' | 'ad' | 'ident', who, text, seconds }`, `radio:off`.

Events I listen to: `input:first` (start), `input:press` (`mute`, `radioNext`, `radioPrev`), `settings:changed` (`master music sfx voice`), `menu:opened` and `menu:closed` (every bus but UI to -60 dB), `vehicle:crash`, `prop:broken`, `vehicle:entered`, `vehicle:exited`.

State I read: `player.mode`, `player.vehicle`, `player.x z`, `clock.hour`, `weather.kind`, `chars.active`, `settings`. State I write: `chars.<lead>.radio` (the remembered station; core's save keeps it).

Keys: `0` mutes (this module listens for the key itself; `M` still mutes too until the map session takes it out of `input.js`). `Q` and `E` change station, and the d-pad's left and right (read from the gamepad here, since `input.js` has no press for them).

Stand-ins I left: none. Not yet matching the bible: `sfx(name, opts)` with its 40 ms rule and distance fall-off, `loop`; the Sheriff's show at heat 4 (so `cut` and `back` lines never play); segments; the phone low-pass; the browser speech setting; the `Voice` slider has no row in the settings menu (the mixer listens for `voice`).
