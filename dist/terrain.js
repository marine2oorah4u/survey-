// Ground height in metres at a world position. Kept free of Three.js so tests and tools
// can place things on the surface without a WebGL context.
export function terrain(x,z){const d=Math.hypot(x-25,z+20);return .8*Math.sin(x*.032)*Math.cos(z*.042)+.3*Math.sin(z*.09+x*.035)+Math.max(0,d-85)*.027;}
// Prism target height and instrument eye height, both measured from the ground.
export const prismHeight=2.3,eyeHeight=1.75;
