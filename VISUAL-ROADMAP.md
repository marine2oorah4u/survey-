# Getting closer to the reference

The target is an AI-generated visual concept, not a screenshot of an existing playable game or an asset pack. It contains details that have to be modeled, textured, placed, lit, and optimized. Exact pixel matching is not an appropriate acceptance test across moving viewpoints. A more powerful engine alone would not supply the missing art.

## What to change, in order

1. **Composition and terrain.** Establish a repeatable P1 comparison camera. Shape a foreground slope and valley, a winding gravel approach, mid-distance barn and fence, and several uneven wooded ridgelines. Current smooth sine-wave hills and evenly spread props lack this structure. Keep stations mutually visible. Add a distant lake only if it supports the composition rather than distracting from the core scene.
2. **Ground materials.** Replace the single repeated photo with licensed or authored grass/soil/gravel PBR sets (albedo, normal and roughness). Blend by slope, height, paths and hand-authored masks; break repetition with large-scale variation. Match texture scale in metres. Use detailed rocks with normal maps and plausible contact with the ground.
3. **Vegetation.** Use several grass and wildflower clumps, multiple tree species/shapes and clustered distribution with clearings. Close trees need believable 3D branches/trunks and good foliage shading. Use simplified meshes in mid-distance and impostors only far away. Add distance-based levels of detail and culling; adding more identical cards is not a substitute for variety.
4. **Light and atmosphere.** Tune a coherent warm sun, cool ambient sky, softer contact shadows and subtle aerial perspective. Match exposure before adding effects. Consider a suitable licensed environment map and modest ambient occlusion on capable devices. Avoid heavy bloom or blur that obscures survey targets.
5. **Hero props.** Replace the procedural total station and barn with carefully modeled GLB assets using physically based materials. The instrument needs bevels, believable lens glass, labels, textured plastics/metals and tripod hardware. This is after terrain, per the user's current priority. Blender could create these assets; no Blender or Unity source exists yet.
6. **Finish and performance.** Test fixed comparison views on desktop and phone, then adjust quality tiers. Target stable interaction on real devices (e.g. an aspirational 30 FPS phone / 60 FPS desktop), but measure rather than promise. Budget draw calls, texture memory and transparency overdraw; use instancing, compressed assets and levels of detail where they pay off.

## Acceptance checks

- From P1, the scene has a readable foreground/midground/background and natural rural composition.
- Ground does not resemble a giant repeated carpet; grass sits in varied patches with believable scale.
- Distant forest has varied canopy outlines instead of obvious repeated flat cutouts or blobs.
- No floating trees, bright white missing materials, opaque foliage rectangles or terrain seams.
- Survey markers remain readable and sight lines useful.
- Touch joystick + look work simultaneously; PC movement/aim and notebook still work.
- Capture comparable PC and portrait-phone screenshots and record device/FPS measurements.

## Tools and asset provenance

Actual tools so far: OpenAI Codex for JS/CSS/HTML; OpenAI image generation for concept, meadow, oak foliage and oak tree images; Three.js for rendering; Vite for preview; ChatGPT Sites for hosting. No paid game API, Unity, Unreal, external asset marketplace pack or server AI was used. Image-model identity was not recorded, so do not invent it.

Future work needs better authored/licensed 3D art, PBR materials, scene composition and device testing. Three.js can support a substantially better scene; migrating to Unity is optional and would require rebuilding rather than opening this as a Unity project. Check licensing and download size before bringing in third-party assets.
