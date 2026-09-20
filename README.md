# Field Survey — portable game project

Start with HANDOFF.md and VISUAL-ROADMAP.md. Reference images are in reference/.

## Run locally

Install Node.js with npm, then run from this folder:

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

Open the local address printed by Vite. For a phone on the same Wi-Fi, use your computer's LAN IP and the printed port. Firewall rules may need to allow that port. Do not open index.html through file://; ES modules need an HTTP server.

Alternatively, with Python installed:

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. The playable game is already authored in dist; no compilation is required. Deploy the contents of dist to any static web host. Do not run a default Vite build into dist because dist is the source directory here.

## Technology

- HTML, CSS, JavaScript ES modules, Three.js 0.170.0 / WebGL.
- Three.js is bundled locally in dist/three.module.js; its MIT notice is dist/THREE-LICENSE.txt.
- Vite is only a development server. No Unity, Unreal, React, backend, database, accounts, or paid runtime API is required.
- Code was developed with OpenAI Codex in ChatGPT Work. OpenAI image generation produced the visual concept and texture images; the exact image-model version was not recorded. AI is not called during gameplay. No API key is needed to run the game.
- Scenery, survey poles, and total station are procedurally constructed in JavaScript. Tree/ground images are generated raster assets, not imported professional 3D models.

## Controls

PC: WASD move, drag mouse to look, arrow keys fine aim, E or Space interact, M notebook. Phone: left joystick move, drag scene to look, on-screen buttons interact. Help is available with ?.

## File map

- dist/environment.js: terrain, road, vegetation, barn/fence/rocks, instrument model.
- dist/game.js: scene, lighting, camera, labels, controls, surveying, notebook and plotting interaction.
- dist/survey-math.js: coordinates, bearings, distances and area.
- dist/index.html and dist/style.css: HUD, notebook and responsive layouts.
- dist/*.webp: runtime image assets.
- reference/: original visual target and latest user screenshot.

No general license has been selected for the original game code. Retain third-party notices and check licenses for any future downloaded assets.
