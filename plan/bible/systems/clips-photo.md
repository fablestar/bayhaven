# Bible · systems · Clips and photo mode

Photo mode saves a still in a postcard frame. The clip recorder saves up to 20 seconds of play as a video file on the player's own device, by hand or by itself when something worth keeping happens. Both are built on one composite: the game canvas, then the HUD canvas, drawn onto a third canvas. The day badge is in every frame of both. Nothing is ever uploaded.

Tier: B for the clip recorder. Photo mode is A (day 6, D6-S2) and is specified here because it shares the composite.

## Purpose

Let a player walk away with the moment, with the day badge on it, in two taps.
Never cost a phone its frame rate, and never touch the network.

## Data

Owner: `src/systems/recorder.mod.js` (clips), `src/ui/phone/camera.js` (photo mode), `src/ui/hud.js` (the HUD canvas). The scripted daily clips in `src/content/clips/` are a different thing: they drive the game; this records it.

### Three canvases

| Canvas | Holds | Kind |
|---|---|---|
| `game` | the 3D view | WebGL |
| `hud` | the in-game HUD: cash, followers, heat lights, minimap, speed, the day badge, subtitles, and at heat 3 and above the LIVE pill and chat | 2D, layered over `game` |
| `rec` | the picture that is saved | 2D, off screen |

Menus, the phone and settings are ordinary page elements. They are never in a photo or a clip.

```js
// called right after renderer.render(), in the same frame callback, while the WebGL buffer is still valid
function composite(ctx, w, h, showHud) {
  ctx.drawImage(game, 0, 0, w, h);
  if (showHud) ctx.drawImage(hud, 0, 0, w, h);
  else drawBadge(ctx, w, h);             // the day badge is never left out
}
```

Because the copy happens in the same task as the render, `preserveDrawingBuffer` stays off. The badge reads `Bayhaven · Day N build`, bottom right, with text at least 3% of the frame's height and never under 14 px. Every texture in the game is generated, so the canvases stay clean and can always be read back.

## Photo mode (A)

Opened from the phone's Camera app. Time stops while you frame, unlike the rest of the phone, which runs the game at 30%.

### Free camera limits

| Limit | Value |
|---|---|
| Distance from the subject | 1.5 to 25 m |
| Height above the ground | 0.3 to 20 m |
| Pan off the subject | up to 10 m |
| Tilt | 80 degrees up or down |
| Roll | 30 degrees either way |
| Field of view | 20 to 100 degrees |
| Walls | the camera stays 0.7 m outside every building box |
| Subject | the lead, or the vehicle they are in |

Controls: drag or right stick to orbit, WASD or left stick to pan, wheel or triggers for field of view, Q and E to roll, H for the HUD, F for the next filter, Space or pad A to shoot.

### Filters

Each is one 3 by 4 colour matrix run once over the finished picture, not every frame.

| Filter | Recipe | Tier |
|---|---|---|
| Postcard (default) | saturation up 12%, a warm lift in the shadows | A |
| Sun-bleached | saturation down 20%, blacks lifted to 8% | A |
| Neon Night | contrast up 15%, shadows pulled toward `#150f3d`, highlights split pink and cyan | A |
| Golden Hour | a warm multiply and 8% more saturation; the reward for every postcard | B |

### The postcard frame

| | `high` | `low` | Portrait |
|---|---|---|---|
| Whole card | 1920 × 1280 | 1280 × 854 | 1080 × 1500 |
| Photo area | 1792 × 1008 at `(64, 64)` | 1194 × 672 at `(43, 43)` | 992 × 1240 at `(44, 44)` |
| Bottom band | 208 px | 139 px | 216 px |

- White card, corners rounded by 1.5% of the short side.
- Bottom left, in the wordmark's style: `Greetings from Bayhaven · Day N`.
- Bottom right: a stamp box with the district name and the game time.
- The view is drawn once at the photo-area size, at pixel ratio 1, then framed.
- Saved with `toBlob('image/png')` as `bayhaven-day-N-<district>-HHMM.png`. Always over 50 kB.

`photo:taken { x, z, district, targets }` lists the named things in frame. A target counts when its centre is inside the middle 60% of the frame, it is within 60 m, nothing blocks the ray to it, and it fills at least 4% of the frame's height. Mission `photo` steps, postcard spots and Gerald sightings all read this one list.

## The clip recorder (B)

### Sizes

| Quality | Landscape | Portrait | Video bit rate | 20 s is about |
|---|---|---|---|---|
| `high` | 1280 × 720 | 720 × 1280 | 5 Mbit/s | 12.5 MB |
| `medium` | 960 × 540 | 540 × 960 | 3.5 Mbit/s | 8.8 MB |
| `low` | 854 × 480 | 480 × 854 | 2.5 Mbit/s | 6.3 MB |

### Recording

```js
const stream = rec.captureStream(30);
try { const out = audioCtx.createMediaStreamDestination(); master.connect(out);
      stream.addTrack(out.stream.getAudioTracks()[0]); } catch (e) { /* video only */ }
const type = ['video/mp4;codecs=avc1', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
  .find(t => MediaRecorder.isTypeSupported(t));
const mr = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: bits });
mr.ondataavailable = e => parts.push(e.data);
mr.onstop = () => ring.add({ blob: new Blob(parts, { type }), kind, seconds, score });
mr.start(1000);
stopAt = now + Math.min(20, seconds);          // 20 s is the hard limit
```

While recording, each frame calls `composite(recCtx, w, h, true)`. At 60 frames a second only every second frame is copied. The HUD is always in a clip: the LIVE pill and the chat are the look. One-line hints are hidden while a clip records.

**By hand:** the R key, a record dot beside the day badge on touch, or the Camera app. Press again to stop. The red dot and its seconds ring are page elements, so the player sees them and the clip does not.

### Automatic highlights

| Kind | Begins when | Ends | Priority | Score |
|---|---|---|---|---|
| `heat` | heat reaches 3 from below | 15 s later, or 2 s after heat clears | 3 | peak viewers ÷ 1,000 |
| `bigair` | the car enters a Big Air ramp's run-up above 60 km/h, or any take-off | 3 s after landing | 2 | metres jumped |
| `drift` | a running drift passes 1,000 points | 2 s after it ends | 1 | score ÷ 100 |

- One recording at a time. A higher-priority trigger during a clip renames it and moves the end, never past 20 s in all.
- 30 s must pass between automatic clips.
- A clip under 3 s, or a jump with under 1.0 s of air, is thrown away.
- No trigger fires on a shooting or on anyone going down. Highlights are driving.
- There is no reaching back in time. The browser's recorder cannot do it, so each trigger is chosen to fire before the good part.
- On by default on `high` and `medium`. Off by default on `low`, where recording by hand still works. Settings has one switch, "Auto clips".

### The ring and saving

The last 3 clips are kept in memory on `high` and `medium`, 2 on `low`. When the ring is full the lowest score goes. A toast offers each new one for 5 s ("Clip ready: Big Air, 34 m. Save?") and the Camera app lists them all.

```js
const url = URL.createObjectURL(clip.blob);
link.href = url;  link.download = `bayhaven-day-${day}-${clip.kind}-${hhmm}.${ext}`;  link.click();
setTimeout(() => URL.revokeObjectURL(url), 10000);
```

That is the only way a clip leaves the game: a file, saved by the player, on their own device. The module makes no network calls. There is no share button, no gallery on a server and no copy in the save file. Clips in the ring are gone when the tab closes. The player shares the file with whatever they already use.

### Keeping the frame rate

| Guard | Rule |
|---|---|
| Budget | the two copies cost 2 ms or less per recorded frame on `low` |
| Slow | 95th-percentile frame time over 40 ms for 2 s while recording on `low`: the next clip records at 640 × 360 |
| Too slow | over 50 ms for 2 s: stop now and keep what there is. Toast: "Clip cut short to keep the game smooth." |
| Resolution | dynamic resolution carries on as usual. `rec` has a fixed size and the game canvas is scaled into it |
| Memory | the ring holds at most 37.5 MB on `high` and 12.6 MB on `low` |

### Browsers that cannot record

```js
canRecord = !!(window.MediaRecorder && rec.captureStream && type);
```

| What is missing | What the player gets |
|---|---|
| The recorder itself | no record dot. Settings reads "Clips are not available in this browser." Each automatic highlight saves a highlight photo instead: one composite frame at the peak (most viewers, the top of the jump, the best second of the drift) in the postcard frame, into the same ring. `clip:unsupported` fires once |
| Sound capture | video without sound, and the toast says so |
| The tab is hidden mid-clip | the clip ends there and is kept |
| The recorder throws | that clip is dropped, one toast, and automatic clips are off until reload |

The scripted `?clip=day-N` playback never needs the recorder. Adding `&rec=1` on a browser that can record makes it record itself and offer the file when it ends.

## States

| State | Enters when | Does | Leaves when |
|---|---|---|---|
| Unsupported | `canRecord` is false | highlight photos only | never |
| Idle | supported, automatic clips off | waits for the record key | the key |
| Armed | automatic clips on | listens for the three triggers; the key also works | a trigger, or the key |
| Recording | a start | copies frames, counts seconds, moves the end for a higher trigger | the end time, 20 s, the key, a hidden tab, or the "too slow" guard |
| Finishing | `mr.stop()` | waits for the last data, builds the blob, scores it | the blob is ready, within 1 s |
| Ready | the clip is in the ring | the toast; listed in the Camera app | Save is pressed, or it is pushed out |
| Saving | Save | clicks the download link; `clip:saved` | back to Armed or Idle |

## Events

Emits: `photo:taken`, and the new `clip:started { kind, auto }`, `clip:ready { kind, seconds, bytes, score }`, `clip:saved { kind }`, `clip:dropped { reason }`, `clip:unsupported`.
Listens: `heat:changed`, `heat:cleared`, `drift:start`, `drift:end`, `jump:landed`, `game:pause`, `game:resume`, `quality:changed`.
State: `state.clips = { can, recording, seconds, ring }`, where each ring entry is `{ kind, seconds, bytes, score }`.

## Edge cases

- Pausing or opening the phone pauses the recorder (`mr.pause()`). The phone is never in a clip.
- Cutscenes can be recorded. Subtitles are on the HUD canvas, so they are in.
- Opening photo mode ends a recording first.
- A quality change or a turn between portrait and landscape mid-clip ends the clip and keeps it.
- With the HUD hidden in settings, clips still draw the badge through `drawBadge`.
- Reduce motion changes nothing here.
- If `toBlob` or the download is refused, the photo or clip stays in the ring and the toast says "Could not save. Try again from the Camera app."

## Low and high

| | `low` | `medium` | `high` |
|---|---|---|---|
| Clip size | 854 × 480 | 960 × 540 | 1280 × 720 |
| Ring | 2 | 3 | 3 |
| Automatic clips by default | off | on | on |
| Photo card | 1280 × 854 | 1920 × 1280 | 1920 × 1280 |
| Frames copied a second | 30 | 30 | 30 |

## Script checks

New test entries: `test.photo({ hud, filter })` returns `{ width, height, bytes, badge, targets }`; `test.clip.record(seconds)` returns `{ supported, seconds, bytes, mime, width, height }`; `test.clip.ring()`. The existing `test.clip.play()` still runs the scripted clips.

1. `test.photo({ hud: false })` returns a PNG over 50 kB, 1920 × 1280 on `high` and 1280 × 854 on `low`, with `badge` true.
2. In photo mode the camera cannot be pushed past 25 m from the subject, under 0.3 m, or inside a building box, and the game clock does not move while framing.
3. `test.clip.record(3)`: where supported, `bytes` is over 100,000, `seconds` is 3 ± 0.5, `mime` is one of the four and the size matches the table. Where not, `supported` is false, `clip:unsupported` has fired once and there are no console errors.
4. `test.clip.record(30)` stops by itself at 20 ± 0.5 s.
5. On `high`, `test.setHeat(3)` fires `clip:started` with kind `heat` and `auto` true within 0.5 s, and after three more triggers the ring holds 3 or fewer. On `low` with default settings no automatic clip begins.
6. Across a recording and a save the number of network requests does not change, and `test.stats().simMs` stays inside the budget plus 2 ms.

## New names

Filters Postcard, Sun-bleached, Neon Night, Golden Hour · clip kinds `heat`, `bigair`, `drift` · events `clip:started`, `clip:ready`, `clip:saved`, `clip:dropped`, `clip:unsupported` · state key `state.clips` · module `src/systems/recorder.mod.js` · setting "Auto clips" · URL flag `rec=1` · test entries `test.photo()`, `test.clip.record()`, `test.clip.ring()`.
