# Resume this project

Checkpoint: 2026-09-20, after the v6 terrain update. This handoff adds documentation/reference files only; the live game remains v6.

## User goal and priority

Eddie wants an enjoyable browser surveying / plotting practice game for Scouts, with convincing rural 3D graphics and BOTH PC and phone controls. Current priority is terrain and scenery matching reference/target-visual-concept.png. Keep gameplay and controls working while improving scenery. Do not call the current graphics photorealistic or claim the target is met.

The latest screenshot, reference/current-mobile-v6.jpeg, shows textured ground and distant tree cards. The scene remains visibly synthetic: obvious repeated tree silhouettes, sparse uniform grass, smooth hills, simple props. Follow VISUAL-ROADMAP.md before adding more random geometry.

## Current playable state

Start at P1, set up instrument, aim at and record P2–P5, open notebook, plot the four measurements and assess accuracy. P1 is the origin of a five-sided boundary; four measured corners is intentional. The game is a radial survey exercise, not a complete professional traverse simulation. No save persistence exists; refresh resets progress.

Coordinates use x east, negative z north. P1=(0,0), P2=(0,-38), P3=(42,-54), P4=(65,-16), P5=(36,14). Bearings are clockwise from north; horizontal radial distances are used. Polygon area is 2960 square metres. Verify source before changing scoring tolerances. The current layout/scoring uses exact target values on lock, rather than simulated measurement error. No raycast-based sight obstruction is implemented.

Scouting context: inspired by Surveying merit badge fieldwork/plotting, but current official requirements still need verification against Scouting America's authoritative page. Do not claim this game by itself satisfies fieldwork or earns a badge. Do not invent a requirement quotation.

## Known issues and validation limits

- The preview browser could not create WebGL: its GPU was disabled. Node scene-construction checks passed, but they do not establish shader rendering correctness, appearance, mobile FPS, or complete gameplay functionality.
- The user has supplied real mobile screenshots. Test future changes on a WebGL-capable PC and phone before claiming visual success.
- Distant forest uses crossed photo cards; repeated silhouettes and cross angles can remain conspicuous. Close trees combine simple trunks and many foliage cards.
- Ground uses a repeated generated albedo image plus procedural color noise; no full PBR ground texture set.
- v3 once produced white ground due to missing newline before #define STANDARD when injecting GLSL. Preserve the newline between injected noise code and original fragment shader.
- v5 had ugly solid tree blobs and flat polygon leaves; v6 removed both. Do not reintroduce them.
- Marker labels now maintain approximately 54 CSS-pixel width; P1 hides nearby/in instrument mode. Verify on desktop and mobile.
- Phone portrait HUD was compacted and notebook text overlap corrected. Do not regress these layouts.
- The environment uses many instanced grass/tree cards, but near props still have many draw calls. No measured FPS budget has been established.

## Development and hosting

See README.md for portable local run commands. All runtime assets are local and dist can be hosted independently. The .openai/hosting.json file is optional outside ChatGPT Sites; leave it intact for continuing the existing Site.

Current live URL: https://field-survey-eddie.pararescueforlife.chatgpt.site
Site project: appgprj_6aafdea83810819194336964922c29ee
Last deployed gameplay commit: 7ad130266768e5aa031d45bc6072f735e5567b71
Existing repository: https://git.chatgpt-team.site/e6dba5a6-c20b-4159-801f-1c275c2dc463/appgprj_6aafdea83810819194336964922c29ee.git
This is a ChatGPT-managed repository, not GitHub. Access depends on the originating account/environment. No credential is included. The portable ZIP works independently of that repository. The included field-survey.bundle preserves Git history and can be cloned with `git clone field-survey.bundle field-survey`.

Inside ChatGPT Work, use Sites skills and refresh credentials through supported Sites tools. Preserve the existing owner-only audience. In a different chat/tool, upload the ZIP and ask it to read this file before editing. Regular chat may review source but might not have execution or publishing capabilities.

## Copy/paste resume prompt

Continue the attached Field Survey project. Read README.md, HANDOFF.md, and VISUAL-ROADMAP.md; inspect both reference images. Preserve mobile touch and PC keyboard/mouse controls. Focus first on terrain, vegetation, lighting, and composition approaching the original concept. The engine is Three.js; no AI runtime API or Unity project exists. Run the project in a WebGL-capable browser, compare consistent screenshots, and report what was actually tested. Do not claim the concept is already achieved. Keep the game portable and document changes.
