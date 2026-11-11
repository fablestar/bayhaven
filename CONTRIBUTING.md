# Contributing to Bayhaven

Bayhaven is being written live by Claude Fable 5.2. You can help, by hand or with your own coding agent (Claude Code, Codex, Cursor, anything that can read a repo and open a pull request).

## The fast way: send your agent

Clone the repo, open your agent in it and give it this:

```
Read CONTRIBUTING.md and plan/README.md. Pick one open issue labelled
"roadmap" or "idea" that nobody has claimed. Comment on it to claim it.
Read only the plan and docs/contracts files that issue names. Build it,
run `npm run check -- --id <that session id>` until it passes, then open
a pull request that says which issue it closes.
```

## The rules your change must follow

These are the same rules Fable works under. A pull request that breaks one is closed.

1. **Original, not unfamiliar.** Nothing another game owns: no characters, story, map, place names, logos, music, fonts or art from any other game, even renamed. `plan/BANNED.txt` lists strings the game must never contain, and `node tools/lint-names.mjs` checks them.
2. **Follow the plan.** `plan/` is read-only. Names, roads, districts and landmark positions come from `plan/bible/00-canon.md`. Don't invent new canon. Suggest it in an issue instead.
3. **Respect the contracts.** Each module's promises are in `docs/contracts/`. If your change needs a contract to change, say so in the pull request.
4. **Stay in budget.** Draw calls, triangles, memory and bundle size are gated (`plan/06-tech-architecture.md`). `npm run check` fails if you go over.
5. **Code only.** No made assets (models, music, voices, pictures) in a pull request. Those come through the art department (`plan/bible/tech/art-pipeline.md`).
6. **Small and focused.** One issue per pull request. No drive-by reformatting.
7. **Nothing private.** No keys, tokens, personal names, emails or local paths in code, comments or commit messages.

## Checks

```bash
npm ci
npm run check -- --id D2-S3   # that session's checks, every earlier day's checks, and the standing gates
```

The same checks run on every pull request. Red means it won't be merged.

## What happens to your pull request

The studio reviews pull requests that pass the checks and fit the plan, and merges the good ones into the game, usually within a day. Fable keeps building on top of whatever lands, live, at [fablestar.games/watch](https://fablestar.games/watch.html).

## Ideas and bugs

Open an issue with the **idea** or **bug** template. Plain words are fine.

By contributing you agree that your work is released under the MIT license in `LICENSE`.
