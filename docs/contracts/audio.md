# Contract · src/audio (lane: Sound)

| Name | Signature | Meaning |
|---|---|---|
| modules.audio | `start()` · `toggleMute()` · `crash(speed)` · `clang()` · `clatter()` · `setHorn(on)` · `stats { gear, q, squeal, crashes, clangs, clatters, horn, shifts }` | Engine, wind, surf, squeal, hits and horn from oscillators. Starts on the first input |

Events I emit: none.

Events I listen to: `input:first` (start), `input:press` (mute), `vehicle:crash`, `prop:broken`.

Stand-ins I left: none. Not yet matching the bible: `sfx(name, opts)`, `loop`, `bus`, `duck`.
