# Animation System

Every animation has a job. The mapping:

| Concern                              | Tool             |
| ------------------------------------ | ---------------- |
| Pinned hero, scrubbed 360° rotation  | GSAP ScrollTrigger |
| Horizontal projects showcase         | GSAP ScrollTrigger (pin + scrub + translateX) |
| About word reveal, WhatIBuild line   | GSAP ScrollTrigger (scrub) |
| Section entrances, chip hovers       | Motion (`whileInView`, `whileHover`) |
| Smooth scrolling                     | Lenis (via GSAP ticker) |
| Avatar rotation/damping/float        | R3F `useFrame` + `THREE.MathUtils.damp` |
| Sparkle reveal                       | R3F, scrubbed against hero progress |
| Marquees, BPMN dashes, graph pulses  | CSS keyframes |

## Pacing (section rhythm)

Hero — cinematic → About — typographic → What I Build — diagram →
Skills — floating ecosystem → Projects — horizontal story →
Experience — quiet timeline → Highlights — editorial cards →
Contact — minimal.

## Reduced motion

- `SmoothScroll` doesn't instantiate Lenis.
- Hero drops its 430vh pin (`motion-reduce:h-auto`) and the avatar renders
  statically (no float, no sparkles, fixed angle).
- GSAP work is gated behind `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
- CSS animations are killed globally in `globals.css`.
- All content remains visible and functional.

## Cleanup

- Every GSAP effect lives inside `gsap.matchMedia()` and is reverted on
  unmount (`mm.revert()`).
- Three.js materials/geometries created manually are disposed in
  `useEffect` cleanups; R3F disposes the rest on unmount.
