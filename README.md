# Field Survey — Willow Creek

A browser surveying and plotting practice game for Scouts. Set up a total station at P1,
sight the four remaining corners of a five-sided lot, record each angle and horizontal
distance, then turn those field notes into a boundary map and check your accuracy.

Start with [HANDOFF.md](HANDOFF.md) and [VISUAL-ROADMAP.md](VISUAL-ROADMAP.md).
Reference images are in `reference/`.

## Run locally

Node.js 22 or newer, then from this folder:

```sh
npm ci
npm start          # serves dist/ at http://localhost:8080
```

For a phone on the same Wi-Fi, use your computer's LAN IP and port 8080 (the dev server
below binds every interface; firewall rules may need to allow the port).

```sh
npm run dev -- --host 0.0.0.0    # Vite dev server with reload
python3 -m http.server 8080 --directory dist   # no Node required
```

Do not open `index.html` through `file://`; ES modules need an HTTP server. The playable
game is already authored in `dist`, so no build step exists — deploy `dist` to any static
host. Do not run a default Vite build into `dist`, because `dist` is the source directory.

## Tests

```sh
npm test         # survey math: bearings, distances, area, scoring
npm run test:play  # full headless playthrough in Chromium, writes screenshots/
```

The playthrough drives the real game: it sets up at P1, sights and records P2–P5 through
the instrument, plots every corner in the notebook, checks the survey, reloads the page to
prove the save persists, and fails on any console or page error. It runs on SwiftShader, so
it needs no GPU — but software rendering says nothing about how the scene looks or performs
on real hardware. Screenshots land in `screenshots/` (ignored by git).

Both suites run in CI on every push (`.github/workflows/ci.yml`).

## Playing

PC: WASD move, drag mouse to look, arrow keys fine aim, E or Space interact, M notebook.
Phone: left joystick move, drag scene to look, on-screen buttons interact. Help is under `?`.

Progress is saved in the browser's local storage, so a refresh keeps your field book. The
notebook has **Export field notes** (a CSV of every reading, plotted coordinate and error,
for printing or a counselor) and **Reset survey**. Plotting all four corners within the 1.5 m
practice tolerance closes the job out with a summary of score, average error, plotted area
against the true 2960 m², and your best score so far.

## Publishing

`.github/workflows/pages.yml` publishes `dist/` to GitHub Pages. It only runs when you start
it by hand: enable Settings → Pages → Source: GitHub Actions, then run the workflow from the
Actions tab. Nothing is published until you do. `.openai/hosting.json` belongs to the original
ChatGPT Site and is left intact.

## Technology

- HTML, CSS, JavaScript ES modules, Three.js 0.170.0 / WebGL.
- Three.js is bundled locally in `dist/three.module.js`; its MIT notice is `dist/THREE-LICENSE.txt`.
- Vite is only a development server. No Unity, Unreal, React, backend, database, accounts, or
  paid runtime API is required.
- Code was developed with OpenAI Codex in ChatGPT Work and continued with Claude Code. OpenAI
  image generation produced the visual concept and texture images; the exact image-model
  version was not recorded. AI is not called during gameplay. No API key is needed to run the game.
- Scenery, survey poles, and total station are procedurally constructed in JavaScript.
  Tree/ground images are generated raster assets, not imported professional 3D models.

## File map

- `dist/game.js`: scene, lighting, camera, labels, controls, surveying, notebook, plotting,
  saving, export and the closing summary.
- `dist/environment.js`: terrain mesh, road, vegetation, barn/fence/rocks, instrument model.
- `dist/terrain.js`: ground height function and the prism/eye heights, free of Three.js.
- `dist/survey-math.js`: coordinates, bearings, distances, area, perimeter and scoring.
- `dist/index.html`, `dist/style.css`: HUD, notebook, summary dialog and responsive layouts.
- `dist/*.webp`: runtime image assets.
- `tests/`: survey math tests, the headless playthrough, and the static server used by both.
- `reference/`: original visual target and screenshots.

No general license has been selected for the original game code. Retain third-party notices
and check licenses for any future downloaded assets.
