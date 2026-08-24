/**
 * Shared mutable interaction state for the hero portrait.
 *
 * ScrollTrigger writes `scrollProgress` (0 → 1 across the pinned hero).
 * Pointer drag writes `dragOffset` / `dragVelocity`.
 * Pointer position (even without drag) drives subtle card tilt.
 */
export const avatarState = {
  /** 0..1 progress through the pinned hero section. */
  scrollProgress: 0,
  /** Additional user-driven rotation in radians. */
  dragOffset: 0,
  /** Radians/second imparted by the last drag gesture. */
  dragVelocity: 0,
  isDragging: false,
  /** Normalised pointer position inside the canvas (−1..1). */
  pointerX: 0,
  pointerY: 0,
  /** True once the canvas has rendered its first frame. */
  ready: false,
};
