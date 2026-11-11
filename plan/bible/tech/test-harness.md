# Bible · tech · Test harness

How `npm run check` works: the command line, how the browser is launched with and without a graphics card, what a check file looks like, the helper library, the named routes, how timing budgets are made fair on a slow machine, and the three small tools beside it (the name check, the placement check, the changelog builder). `06-tech-architecture.md` lists the standing gates; this file is how they are implemented.

Tier: A. Built in session D2-S2 and grown by every session after.

## 1. Command line

```
npm run check -- --id d4-s2            run that session's checks and the standing gates
npm run check -- --day 5               run every check for days 1 to 5 and the gates
npm run check -- --day 5 --fps         the same, plus real frame-rate measurement (needs a GPU)
npm run check -- --only D5.3,G4        run named checks only
npm run check -- --quality low         force a quality level (default: both low and high, one after the other)
npm run check -- --shots               save a 960 × 540 screenshot per spot to shots/
npm run check -- --keep                leave the preview server and browser open on failure
```

Exit code 0 when everything passed, 1 when any check failed, 2 when the harness itself broke (build failed, page never became ready).

## 2. What a run does

1. `npm run build` (gate G1). Read `dist/` sizes (gate G6).
2. `node tools/lint-names.mjs` (gate G5).
3. Start `vite preview` on a free port.
4. Launch Chromium with Playwright. One browser, one page per quality level.
5. Open `/?test=1&quality=<level>&seed=1&hour=14`. `test=1` turns off the title menu, hints and autosave and makes the clock controllable.
6. `await page.evaluate(() => window.__game.test.ready)` with a 30 s limit.
7. Calibrate (section 6).
8. Run the standing gates G2, G3, G4 on the named routes (section 5).
9. Run the check files asked for, in day order.
10. Write `dist/report.json` and print the result object. Close everything.

Browser flags:

| Mode | Flags |
|---|---|
| Budget mode (no GPU, inside the sandbox) | `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist --autoplay-policy=no-user-gesture-required --mute-audio` (day 1's flags plus audio) |
| Frame-rate mode (`--fps`) | Headed or new-headless Chromium with the real GPU: `--ignore-gpu-blocklist --enable-gpu-rasterization --autoplay-policy=no-user-gesture-required`, and the harness refuses to run if the renderer string contains `SwiftShader` or `llvmpipe` |

`PLAYWRIGHT_BROWSERS_PATH` is `/studio/.pw` inside the sandbox, as on day 1.

## 3. A check file

`tools/checks/<session-id>.mjs` exports an array. Ids match the roadmap (`D4.5`).

```js
export default [
  {
    id: 'D2.1', name: 'Slide', quality: ['low'],
    async run(t) {
      await t.spawn('heron', { x: -160, z: 37, heading: 90 });
      await t.input([{ t: 0, hold: ['gas'] }, { t: 3, hold: ['gas', 'left', 'handbrake'] }, { t: 4.5, hold: [] }]);
      const peak = await t.peak(() => window.__game.test.player().slip, 5);     // highest value over 5 s
      t.expect(peak, '>=', 0.35, 'peak slip angle');
      t.expect(await t.eval(() => window.__game.modules.fx.count('skid')), '>', 0, 'skid segments');
      t.expect((await t.player()).speed * 3.6, '>=', 30, 'speed after the slide');
    },
  },
];
```

A check never sleeps blind: it waits for a condition with a time limit (`t.until`), so it is fast when the game is fast and fails with a clear message when the condition never comes.

## 4. The helper library (`t`)

| Helper | Does |
|---|---|
| `t.eval(fn, arg)` | Runs a function in the page |
| `t.stats()` / `t.player()` / `t.errors()` | The matching test API calls |
| `t.teleport(x, z, heading)` | Teleports and waits for `chunks.ensure` |
| `t.spawn(model, at)` | Spawns a vehicle with the player in it |
| `t.input(script)` | Plays an input timeline through `input.inject` and resolves when it ends |
| `t.drive(routeName)` | Drives a named route with the built-in route follower (section 5) |
| `t.until(fn, seconds, label)` | Polls every 100 ms until `fn` is truthy; fails with `label` on time-out |
| `t.peak(fn, seconds)` / `t.series(fn, seconds, hz)` | Highest value, or all samples, over a time |
| `t.event(name, seconds)` | Resolves with the payload of the next event of that name |
| `t.expect(value, op, bound, label)` | Records pass or fail with the numbers; ops are `>=` `<=` `>` `<` `==` `between` |
| `t.setHour(h)` / `t.setWeather(k)` / `t.setHeat(n)` | Test API shortcuts |
| `t.shot(name)` | Saves a 960 × 540 screenshot |
| `t.rects()` | `hud.layout()`, for the overlap check |
| `t.audioRms(bus, seconds)` | Root mean square of a bus through an `AnalyserNode` |
| `t.fresh()` | Reloads the page with clean storage |

The test API (`window.__game.test`) is in `06-tech-architecture.md`. Each lane adds its own calls when it ships a feature and lists them in its `docs/contracts/` file.

## 5. Named routes and spots

Gates use fixed places so numbers can be compared from day to day.

| Name | What | Exists from |
|---|---|---|
| `spot:beach` | `(0, 37)` facing east | day 1 |
| `spot:downtown` | `(52, -700)` facing north | day 4 |
| `spot:port` | `(2800, -400)` facing east | day 4 |
| `spot:expressway` | `(700, -1480)` on the deck, facing west | day 6 |
| `spot:swamp` | `(-400, -3000)` facing west | day 8 |
| `route:beach-60` | 60 s east along Heron Walk Drive from `(-1400, 37)` | day 2 |
| `route:boulevard-90` | 90 s: Heron Walk Drive, north up Coral Boulevard, east along Commerce Way to the port | day 4 |
| `route:deck-30` | 30 s west along the expressway at 110 km/h | day 6 |
| `route:tour-12` | Twelve teleports, one per district and two extra, 20 s of driving at each | day 8 |
| `route:soak-10` | Ten minutes round `tour-12` twice with heat raised and cleared once | day 8 |

A spot or route that does not exist yet in a build is skipped and reported as skipped, not passed.

**The route follower** is a small autopilot inside the test API, not the traffic AI: it asks `nav.route` for the polyline and steers the player's vehicle along it with a look-ahead of 12 m, braking for corners. It exists so that checks drive like a player would, through real streaming and real collisions.

## 6. Making time budgets fair

The sandbox machine is slow and has no graphics card, so wall-clock budgets would fail there for no fault of the game. Two things fix that.

- **Counts are exact everywhere.** Draw calls, triangles, entity counts, bundle size and heap do not depend on the machine. They are compared to the budgets as written.
- **Milliseconds are scaled.** Before the gates, the harness runs a fixed JavaScript workload in the page (a tight loop over a typed array that takes 5.0 ms on the reference laptop) twenty times and takes the median `m`. The factor is `k = max(1, m / 5)`. Every millisecond budget (`simMs`, `chunkMs`, the hitch limit) is multiplied by `k` in budget mode. `k` is printed in the report. In frame-rate mode `k` is ignored and real limits apply.
- **Frame rate is only ever measured with a real GPU.** `--fps` records `requestAnimationFrame` intervals for 20 s after a 5 s warm-up on `route:beach-60` (and `route:boulevard-90` from day 4), at 1920 × 1080 and at 844 × 390 with device scale 1.5 and `Emulation.setCPUThrottlingRate` at 4. It reports the median and the 5th percentile. Gate G8 passes when the 5th percentile is 55 or more on the first and 30 or more on the second.

## 7. Output

```json
{
  "id": "d5-s1", "day": 5, "mode": "budget", "k": 2.4, "seconds": 212,
  "pass": false,
  "gates": { "G1": "pass", "G2": "pass", "G3": "pass", "G4": "pass", "G5": "pass", "G6": "fail", "G7": "pass", "G8": "skipped" },
  "checks": [
    { "id": "D5.1", "name": "Response", "pass": true, "values": { "cruisers": 1, "seconds": 6.2 } },
    { "id": "D5.4", "name": "Stunts add viewers", "pass": false, "message": "viewers 1840 -> 1840, expected a rise", "shot": "shots/D5.4.png" }
  ],
  "spots": [ { "name": "beach", "quality": "low", "calls": 81, "tris": 151000, "simMs": 3.9, "chunkMs": 2.1, "heapMB": 96 } ]
}
```

A failing check always says the number it got and the number it wanted. A session reads this object, not screenshots, to decide what to fix. `--shots` saves a picture only for checks that failed.

## 8. Fixtures

- `tools/fixtures/saves/v1.json`, `v2.json` and so on: one real save exported from each build that changed the save format. Day 9's save check loads each one.
- `tools/fixtures/inputs/`: input timelines that are reused (a clean lap of the block, a drift, a ram).
- No pictures are compared. Looks are judged by a person from the day's clip and the four screenshots a session is allowed.

## 9. The name check (`tools/lint-names.mjs`)

- Reads `plan/BANNED.txt`: one case-insensitive regular expression per line; `#` starts a comment; `allow: <regex> -- <reason>` exempts matches of a narrower pattern.
- Scans `src/**/*.{js,css,html}` and `index.html`. `plan/` is not scanned.
- For each hit prints `file:line: pattern: the matched text` and exits 1.
- It scans strings and comments alike. A banned word is not allowed in a variable name either; pick another name.
- `--report` prints the count of string literals longer than three characters by folder, so a person can skim every piece of text the game can show.

## 10. The placement check (`tools/checks/placement.mjs`)

Loads every content file in the tier being built and resolves every seed position with `map.snap`. Fails when a seed cannot be snapped, when two finds of the same kind are closer than 15 m, when a race checkpoint is not on a road, when a mission marker is on water for a step that is on foot, or when a shop has no door on a sidewalk. Prints the offending ids with their seeds and the nearest valid spot, so the fix is a copy and paste.

## 11. The changelog builder (`tools/changelog.mjs`)

Runs before `vite build`. Reads `changelog/*.md`, groups them by the day in their name (`d4-s2.md` is day 4), and writes `CHANGELOG.md` with one section per day, newest first: the day's headline (from the S1 note's title), then each note's "Shipped" and "Not shipped" lists. It also writes `src/core/build.js` with `{ day, commit, sessions }`, where `day` is the highest day number found. That is where the day badge and the daily drop get the day from.

## 12. Clips in the harness

`t.eval(() => window.__game.test.clip.play('day-5'))` runs the day's scripted clip to the end and resolves. The check for a clip passes when it resolves within its length plus 3 s with zero errors and the day badge visible in `hud.layout()`. Recording the clip to a video file is done by a person or a script on a machine with a GPU: open `/?clip=day-5`, record the tab. The game is the same either way.
