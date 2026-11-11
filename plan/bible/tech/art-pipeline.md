# Bible · tech · The asset layer

The game is complete from code alone. This file adds an optional layer on top: made assets (models, songs, spoken lines, pictures) that arrive from an art department outside the sandbox and replace their code-made versions when present. It fixes the request format, the manifest, the budgets, the loader's contract and the checks. Sessions never download or generate assets themselves.

Tier: B (the layer is session B-00; assets arrive between sessions).

## 1. Principles

1. **Code first.** Every asset id has a code-made version registered as its fallback. A build with an empty manifest is the full game.
2. **Never wait.** The first frame, a chunk, a mission and a radio station never wait for a made asset. A made asset swaps in when it has loaded.
3. **`?assets=off`** gives exactly the code-made game. Every day's checks run both ways.
4. **Same look.** A made model is converted to the game's own flat-shaded, vertex-coloured form. It should look like a better-shaped version of the code-made one, not like a different game.
5. **Hero assets only.** Leads, named cast, the player's vehicle models, landmarks, songs, spoken lines, billboard and postcard pictures. Crowds, traffic at distance, ordinary buildings and props stay code-made, because they are instanced by the hundred.

## 2. Who does what

| Step | Who |
|---|---|
| Decide an asset is worth asking for, and write the request | A session |
| Make the file with generative models, shrink it, check it, add it to the manifest, commit it | The art department (the operator, outside the sandbox) |
| Load it, swap it in, fall back without it | The game (`assets` module) |

## 3. A request

One file per asset: `art/requests/<id>.json`. Committed like any other work.

```json
{
  "id": "veh-heron",
  "kind": "model:vehicle",
  "replaces": "vehicle:heron",
  "ask": "A two-door coupe with a wedge nose and a small rear spoiler. Low-poly toy style, big flat faces, no fine detail. Body one flat colour (it is tinted in the game), dark sills, dark glass. No lettering, no badges, generic shape.",
  "size": { "l": 4.46, "w": 1.92, "h": 1.40 },
  "budget": { "tris": 3000, "bytes": 200000 },
  "parts": ["body", "wheel_fl", "wheel_fr", "wheel_rl", "wheel_rr"],
  "views": "three-quarter front, side",
  "why": "The player's first car; it is in every clip.",
  "tier": "A", "asked": "d3-s3"
}
```

- `id` is lower-case with hyphens and a kind prefix: `veh-`, `chr-`, `lmk-`, `prop-`, `img-`, `song-`, `line-`, `sfx-`.
- `replaces` names the code-made thing it stands in for. A request with no fallback is invalid.
- `ask` describes shape and feel in plain words. It never names a real make, brand, person, artist, song, place or another game, and it passes the name check.
- A session may write at most five requests, and only for things its prompt built.

## 4. The manifest

`public/assets/manifest.json`, written only by the art department:

```json
{
  "v": 1,
  "assets": [
    { "id": "veh-heron", "kind": "model:vehicle", "replaces": "vehicle:heron", "file": "models/veh-heron.3f9a1c.glb",
      "bytes": 148220, "tris": 2760, "lod1": "models/veh-heron.lod1.9b22e0.glb", "tier": "A",
      "madeWith": "text to 3D, remeshed", "made": "2026-11-13" },
    { "id": "song-tideline98-01", "kind": "music", "replaces": "song:tideline98:0", "file": "music/song-tideline98-01.7c1d.ogg",
      "alt": "music/song-tideline98-01.7c1d.mp3", "seconds": 60, "loop": [0.0, 59.2], "bytes": 720000, "tier": "A" },
    { "id": "line-nina-004", "kind": "voice", "replaces": "line:tideline98:host:4", "file": "voice/line-nina-004.a41e.ogg", "seconds": 5.2, "bytes": 21000 }
  ]
}
```

File names carry a short hash so browsers can cache them for ever. Files live under `public/assets/models/`, `music/`, `voice/`, `sfx/`, `img/`.

## 5. Kinds and budgets

A file over budget is refused by the loader with a console message naming the asset, and its fallback stays.

| Kind | Format | Limits |
|---|---|---|
| `model:vehicle` | GLB | 3,000 triangles (LOD1 750) · 200 kB · one mesh for the body, four wheel nodes |
| `model:character` | GLB, skinned | 4,000 triangles · 600 kB with clips · humanoid skeleton · clips named `idle walk run jump sit drive wave tumble` |
| `model:landmark` | GLB | 12,000 triangles (LOD1 2,000) · 500 kB · footprint and height within 5% of the canon |
| `model:prop` | GLB | 800 triangles · 60 kB |
| `music` | Ogg Opus, with an MP3 beside it | 96 kbit/s · 30 to 90 s loop (120 s for the credits) · loop points given · about 1 MB |
| `voice` | Ogg Opus, with an MP3 beside it | 32 kbit/s mono · 12 s at most · about 4 kB a second |
| `sfx` | Ogg Opus | 3 s at most · 30 kB |
| `img:billboard` | WebP | 512 × 256 · 60 kB · no letters (the game draws the words) |
| `img:mural` | WebP | 512 × 512 · 80 kB |
| `img:postcard` | WebP | 768 × 512 · 120 kB |
| `img:keyart` | WebP | 1600 × 900 · 250 kB · title screen and daily posts only |
| `img:portrait` | WebP | 128 × 128 · 12 kB · dialogue portraits |

Download caps for one visit: **12 MB on `low`** (a "more detail" switch in settings raises it to 40 MB), **60 MB on `high`**. Music and voice count only when a station or a line is actually played.

## 6. Model rules

- 1 unit is 1 metre, `y` up, the model faces `+z`, wheels or feet rest on `y = 0`, the origin is at the centre of the footprint.
- **Vertex colours only.** No textures on models. The art department bakes any surface colour into `COLOR_0`. The loader reads `POSITION` and `COLOR_0`, recomputes flat normals, and builds the same 18-byte vertex the code-made meshes use, so a made model goes through the same materials and the same instancing.
- A vehicle body is one mesh in a neutral light grey where it should take the car's paint (the game multiplies by the paint colour), and fixed colours elsewhere. Wheels are separate nodes named `wheel_fl`, `wheel_fr`, `wheel_rl`, `wheel_rr`. Lights are empty nodes named `light_head_l`, `light_head_r`, `light_tail` that the game replaces with its own bright pieces.
- A landmark keeps its code-made collision shapes, places and night lights. Only what you see changes.
- The game uses three's own `GLTFLoader` from the `three` package. No new dependency, no extra decoder: files are plain quantised GLB.

## 7. Characters

- Made characters are skinned meshes with real clips. They are for the two leads and named cast only: at most 6 on screen on `low`, 12 on `high`.
- The crowd stays the six-box instanced people. A named character further than 60 m away is drawn as a box person in their colours.
- The game drives clips by name and blends over 0.15 s. A clip that is missing falls back to the box rig's pose maths applied to the same root.
- Faces stay the drawn dot-and-line faces on a quad, so expressions work the same on both kinds.

## 8. Sound

- **Music** is streamed, never decoded up front: an `<audio>` element per station routed into the music bus, only for the station that is tuned. If the made song is missing or still buffering, the sequenced song with the same index plays. `music.beat` keeps working from the manifest's tempo field when present.
- **Spoken lines** are looked up by line id. If the file is there it plays through the voice bus and the subtitle shows as always; if not, the blips play. Subtitles are never optional.
- **Effects** stay synthesised by default. A made effect replaces one only by name and only where it is clearly better (thunder, a crowd cheer).
- Loudness is set by the art department. The game does not normalise.

## 9. Pictures

Billboards, murals, postcards for result cards, dialogue portraits and the title's key art. A made billboard picture is the background; the game draws the sign's words over it from the sign list, so text is always ours and always passes the name check.

## 10. The loader's contract

```js
ctx.modules.assets = {
  has(id) → bool,                       // in the manifest and inside budget
  model(id) → Promise<model | null>,    // { geometry, wheels, lights, lod1 } in the game's own buffers
  character(id) → Promise<rig | null>,  // { mesh, mixer, clips }
  image(id) → Promise<Texture | null>,
  musicUrl(id) → string | null,
  voiceUrl(lineId) → string | null,
  register(replaces, fallback),         // every code-made thing that can be replaced registers itself
  stats() → { loaded, bytes, refused, pending },
  enabled                               // false with ?assets=off or when the manifest is missing
}
// events: asset:loaded { id }, asset:refused { id, reason }
```

- The manifest is fetched after the first frame. A missing or broken manifest means `enabled = false` and nothing else changes.
- Loading order: what the player is in or looking at, then what is nearest, then the rest, one request at a time on `low`, three on `high`.
- A swap happens when the thing is off screen or more than 60 m away, or at spawn. Never a visible pop on the player's own car mid-drive: it changes the next time they get in.

## 11. How a module uses it

```js
// vehicles: the code-made model is always built first
const built = buildHeron();                              // boxes, as ever
assets.register('vehicle:heron', built);
assets.model('veh-heron').then((made) => { if (made) models.heron.pending = made; });   // picked up at the next spawn
```

## 12. Writing a good request

Say: low-poly toy style · big flat faces · two or three flat colours from the district palette (give the hex values) · no fine detail · no lettering, numbers, badges or logos · generic shape · the real-world size in metres · the triangle budget. For a character: age, build, clothes as colour blocks, one prop, standing with arms slightly out. For a song: genre words, tempo, three instruments, the mood, "instrumental", the length. For a line: the exact text and "calm, dry, older woman" or the like. Never a real name of any kind.

## 13. Checks

| Check | Pass |
|---|---|
| AS.1 Off | With `?assets=off` every check for the day passes and `assets.enabled` is false |
| AS.2 Manifest | Every entry has a file that exists, a `replaces` that is registered, and sizes inside section 5's limits |
| AS.3 Fallback | Deleting any one asset file leaves the game running with its fallback and one `asset:refused` |
| AS.4 Budgets | With every asset loaded, gate G3 still passes at every spot |
| AS.5 Names | The name check passes over `art/requests/*.json` and the manifest |
| AS.6 Download | A 60 s drive on `low` downloads no more than 12 MB of assets |

## 14. Credits

The game's credits list code and assets separately: who wrote the code, and that models, music and voices were made by generative models from the studio's own requests. The manifest is the record.
