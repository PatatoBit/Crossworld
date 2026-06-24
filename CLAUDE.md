# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Crossworld** is a desktop game: a rotatable **3D crossword** puzzle where words run along the X, Y, and Z axes and the player orbits the structure to read intersections. The theme is environmental sustainability / UN SDGs (see `documents/output.md`, the Thai project proposal — the canonical spec for game design, 7 continent levels, and planned Generative-AI puzzle generation). The codebase is currently an early MVP: rendering, hover-to-reveal clues, and camera/gizmo navigation exist; keyboard letter entry and win-checking do not yet.

Stack: **Tauri 2** (Rust shell) + **SvelteKit** (SPA, `ssr = false`) + **Svelte 5 runes** + **Threlte 8 / Three.js** for WebGL.

## Commands

```bash
npm run dev        # Vite dev server on http://localhost:1420 (browser-only, fast iteration)
npm run tauri dev  # full desktop app (Rust + webview); use to test as a real app
npm run build      # build SPA to ./build
npm run tauri build
npm run check      # svelte-check + tsc — THE typecheck/lint gate. Run after every change.
```

There is no test suite. `npm run check` is the only automated verification; it must report **0 errors** before considering a change done. A persistent warning on `Scene.svelte` (`state_referenced_locally` for the stable `game` prop) is benign and expected.

Note: `src-tauri/tauri.conf.json` invokes `pnpm dev`/`pnpm build` as its before-commands, but the project is otherwise driven with `npm`. The dev port **1420** is fixed (`strictPort`); Tauri will fail if it's taken.

## Architecture

### Puzzle data model — words are the source of truth
The central design decision (`src/lib/crossword/`): **never author cells directly.** You author `WordSpec`s (`answer` + `start` coord + `axis` + `clue`), and `buildPuzzle()` (`puzzle.ts`) expands them into a derived `Map<"x,y,z", Cell>`. Where two words cross, they share one `Cell`; if their letters disagree, `buildPuzzle` **throws at load time** rather than rendering an inconsistent grid. A `Cell.wordIds` array records every word through it (length > 1 ⇒ an intersection). This is also the shape a future AI generator would emit.

- `types.ts` — `WordSpec`, `Cell`, `Puzzle`, `Axis`.
- `puzzle.ts` — `buildPuzzle()`, `cellKey()`, `puzzleCenter()` (used to recenter the grid on the origin so controls pivot sensibly).
- `sample.ts` — the hand-authored demo puzzle (intersects across all 3 axes).
- `game.svelte.ts` — `CrosswordGame`, the reactive store (Svelte 5 `$state`/getters; **must** be a `.svelte.ts` file). Holds `entries` (player input, keyed by cellKey), `hoveredWordId`, and `showAnswers`. `displayLetter(key)` resolves what to render: player entry → else solution if revealed → else blank. `highlightedCells` / `hoveredWord` derive from the hovered cell's first word.

### Rendering flow
`+page.svelte` constructs one `CrosswordGame` and passes it to both `Scene.svelte` (inside `<Canvas>`) and `Hud.svelte` (HTML overlay outside the canvas). State flows one-way: the scene's pointer events mutate the store; the HUD reads it.

`Scene.svelte` renders, per cell, a translucent cube + a letter. Key Threlte specifics that are easy to get wrong:
- **Letters use `<Billboard><Text>`** so they always face the camera and stay upright as the puzzle rotates ("letters stay vertical").
- **Cube material sets `depthWrite={false}`** and the text has `renderOrder={1}`. Without this, the transparent cube faces occlude the letter sitting at the cube's center and nothing shows. This is the first thing to check if letters "disappear."
- **Camera uses `<TrackballControls>`, not `OrbitControls`** — deliberately, so rotation never locks at the poles (OrbitControls pins an up-vector; Trackball has none).
- **`<Gizmo>`** (from `@threlte/extras`, backed by `three-viewport-gizmo`) is the Blender-style corner orientation widget, wired to the same `controls` instance via `bind:ref`.

### Hover → clue
`interactivity()` enables raycasting; each cube's `onpointerenter`/`onpointerleave` calls `game.hoverCell(key)`, which highlights the whole word line (green) and surfaces its clue in the HUD.

## Gotchas

- **Threlte/Three subpaths often lack `.d.ts`.** Importing types from `three/examples/jsm/...` errors under `svelte-check`. Derive types from the Threlte component instead (e.g. the `controls` var is typed `ComponentProps<typeof TrackballControls>["ref"]`).
- Reactive game logic belongs in `*.svelte.ts` modules; runes don't work in plain `.ts`.
- SvelteKit runs as an SPA (`adapter-static`, `+layout.ts` sets `ssr = false`) because Tauri has no Node server. Don't add server-only SvelteKit features.
