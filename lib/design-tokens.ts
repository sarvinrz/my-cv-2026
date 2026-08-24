/**
 * DESIGN SYSTEM — single source of truth
 * ======================================
 * Every colour, radius, spacing step and motion curve used anywhere in
 * this site is defined here (and mirrored as CSS custom properties in
 * app/globals.css). Nothing is hand-picked at the component level.
 *
 * The palette is sampled directly from the owner's two reference images:
 * the LEGO collectible render and the Museum of the Future photo.
 */

/* ------------------------------------------------------------------ */
/* 1. RAW PALETTE — sampled from the reference imagery                 */
/* ------------------------------------------------------------------ */

export const palette = {
  /** Light-blue overshirt */
  sky: "#8fbee8",
  skyLight: "#aed2f0",
  skyDeep: "#4a87c4",
  /** Navy tank top under the shirt */
  navy: "#1b2a47",
  /** Cream wide-leg trousers */
  cream: "#f0e8d8",
  creamDeep: "#ddd3be",
  /** Gold glasses frame + bangles */
  gold: "#c9a227",
  goldLight: "#e0c572",
  /** Caramel hair highlight */
  caramel: "#c9835b",
  caramelLight: "#dbb584",
  /** Dark brown hair */
  mocha: "#4a2e1c",
  mochaDeep: "#33200f",
  /** Skin */
  skin: "#f3c9a0",
  skinShade: "#ddaf84",
  /** Grass, from the Dubai photo */
  sage: "#7ba05b",
  /** Brushed-metal façade, from the Dubai photo */
  steel: "#8f9aa6",
  /** Neutrals */
  ink: "#1a1a1b",
  paper: "#fbfaf8",
} as const;

/* ------------------------------------------------------------------ */
/* 2. ACCENT ROTATION — used to colour-code cards & sections           */
/* ------------------------------------------------------------------ */

export type AccentName = "sky" | "gold" | "caramel" | "sage" | "steel" | "navy";

export const accents: Record<AccentName, { base: string; soft: string }> = {
  sky: { base: palette.sky, soft: "rgba(143, 190, 232, 0.14)" },
  gold: { base: palette.gold, soft: "rgba(201, 162, 39, 0.14)" },
  caramel: { base: palette.caramel, soft: "rgba(201, 131, 91, 0.14)" },
  sage: { base: palette.sage, soft: "rgba(123, 160, 91, 0.14)" },
  steel: { base: palette.steel, soft: "rgba(143, 154, 166, 0.16)" },
  navy: { base: "#5b7391", soft: "rgba(91, 115, 145, 0.16)" },
};

export const accentOrder: AccentName[] = ["sky", "gold", "caramel", "sage", "steel", "navy"];

/** Deterministic accent for an index — keeps colour rhythm consistent. */
export function accentFor(index: number): AccentName {
  return accentOrder[index % accentOrder.length];
}

/* ------------------------------------------------------------------ */
/* 3. SPACING — 4px base grid                                          */
/* ------------------------------------------------------------------ */

export const spacing = {
  /** 4px grid steps that components are allowed to use */
  scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160] as const,
  /** Vertical rhythm for a full-width section */
  sectionY: { mobile: 96, desktop: 128 },
  /** Horizontal page gutter */
  gutter: { mobile: 24, desktop: 40 },
  /** Gap between cards in a grid */
  cardGap: 16,
  /** Inner card padding */
  cardPadding: { mobile: 20, desktop: 24 },
} as const;

/* ------------------------------------------------------------------ */
/* 4. RADIUS                                                           */
/* ------------------------------------------------------------------ */

export const radius = {
  xs: 4,
  sm: 8,
  /** default for inputs, chips */
  md: 12,
  /** default for cards */
  lg: 20,
  /** feature panels, media frames */
  xl: 28,
  pill: 999,
} as const;

/* ------------------------------------------------------------------ */
/* 5. MOTION                                                           */
/* ------------------------------------------------------------------ */

/** Cubic-bézier tuples, in the shape Motion's `ease` prop expects. */
export type Bezier = [number, number, number, number];

/** General UI — decisive, no overshoot. */
export const easeOut: Bezier = [0.22, 1, 0.36, 1];
/** Entrances with a touch of life. */
export const easeSpring: Bezier = [0.34, 1.56, 0.64, 1];

export const motion = {
  duration: {
    /** hovers, toggles */
    fast: 0.18,
    /** entrances, most transitions */
    base: 0.32,
    /** reveals */
    slow: 0.64,
    /** hero / cinematic beats */
    cinematic: 1.0,
  },
  ease: {
    out: easeOut,
    spring: easeSpring,
    /** scrub-linked timelines */
    linear: "none" as const,
  },
  /** Stagger between siblings in a list reveal */
  stagger: 0.05,
} as const;

/* ------------------------------------------------------------------ */
/* 6. ELEVATION                                                        */
/* ------------------------------------------------------------------ */

export const elevation = {
  /** resting card */
  flat: "0 1px 2px rgba(16, 20, 28, 0.04)",
  /** hovered card */
  raised: "0 12px 32px -12px rgba(16, 20, 28, 0.24)",
  /** media frames, hero panel */
  floating: "0 32px 64px -24px rgba(16, 20, 28, 0.34)",
} as const;
