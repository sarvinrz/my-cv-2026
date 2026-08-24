# Architecture

## Stack

- **Next.js (App Router) + TypeScript** — single-page portfolio, statically prerendered.
- **Tailwind CSS v4** — design tokens declared in `app/globals.css` via `@theme`.
- **GSAP + ScrollTrigger** — scroll storytelling (pinned hero, horizontal projects, word reveals).
- **Lenis** — smooth scrolling, driven by GSAP's ticker so both share one clock.
- **Motion** (`motion/react`) — component-level entrances and micro-interactions.
- **Three.js + React Three Fiber + drei** — the LEGO avatar, loaded dynamically (`ssr: false`).

## Layout

```
app/          layout (fonts, SEO), page, favicon, OG image
components/
  navigation/ Nav
  providers/  SmoothScroll (Lenis + GSAP ticker)
  three/      AvatarCanvas (drag), AvatarScene (Canvas), LegoFigure,
              SparkleBurst, avatarState (shared interaction state)
  ui/         Cursor, SectionHeading, BrowserFrame
sections/     Hero, About, WhatIBuild, Skills, Projects, ProjectVisual,
              Experience, Highlights, Contact
hooks/        useReducedMotion, useMediaQuery
lib/          site config, gsap setup, typed content data
docs/         this folder
```

## Data-driven content

All copy that repeats (projects, skills, experience, highlights) lives in
typed structures in `lib/`. Components render from data — changing content
never requires touching JSX.

## The avatar interaction model

`components/three/avatarState.ts` is a shared mutable object:

- The hero's ScrollTrigger writes `scrollProgress` (0–1 over 430vh).
- Pointer/touch drag on the canvas wrapper writes `dragOffset` + `dragVelocity`.
- The scene's `useFrame` damps the group rotation toward
  `scrollProgress * 2π + dragOffset` and slowly decays the drag offset back
  to zero — so manual rotation always reconciles with the scroll state
  without snapping.

## Replacing the procedural figure with the original asset

`LegoFigure.tsx` is procedural (built from rounded boxes to match the
reference render). When the original `.glb` exists:

1. Drop it in `public/assets/avatar.glb`.
2. In `LegoFigure.tsx`, replace the returned group with
   `useGLTF("/assets/avatar.glb")` + `<primitive object={scene} />`.
3. Nothing else changes — the rig, drag, sparkles, and scroll rotation all
   operate on the parent group.
