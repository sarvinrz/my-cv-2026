# Design system

Source of truth: [`lib/design-tokens.ts`](../lib/design-tokens.ts), mirrored as
CSS custom properties in [`app/globals.css`](../app/globals.css).

Rule: **components choose token names, never raw values.** If a component
needs a colour it picks an `AccentName`; if it needs spacing it uses the
grid steps below. Any hex code or one-off `px` value in a component is a bug.

---

## 1. Colour

The palette is sampled from the two reference images (the LEGO collectible
render and the Museum of the Future photo) rather than invented, which is
why the 3D figure and the page never fight each other.

| Token | Hex | Sampled from |
| --- | --- | --- |
| `sky` | `#8fbee8` | light-blue overshirt |
| `skyLight` | `#aed2f0` | shirt highlight |
| `skyDeep` | `#4a87c4` | shirt in shadow |
| `navy` | `#1b2a47` | inner tank top |
| `cream` | `#f0e8d8` | wide-leg trousers |
| `gold` | `#c9a227` | glasses frame, bangles |
| `caramel` | `#c9835b` | hair highlight |
| `mocha` | `#4a2e1c` | hair base |
| `sage` | `#7ba05b` | grass bank behind the museum |
| `steel` | `#8f9aa6` | brushed-metal façade |

### Semantic layers

Both themes expose the same six names, so no component branches on theme:

`--background`, `--surface`, `--surface-elevated`, `--border`,
`--foreground`, `--muted`, plus `--accent` / `--accent-secondary`.

### Accent rotation

Cards are colour-coded by position, not by hand. `accentFor(index)` cycles
`sky → gold → caramel → sage → steel → navy`, and each section header picks
one accent that its cards then rotate around. This is what keeps the page
colourful without becoming arbitrary.

Every accent is used at two strengths only: `base` for text, rules and
dots, and `soft` (12–16% alpha) for chip and card washes.

---

## 2. Spacing — 4px grid

Allowed steps: `4 8 12 16 20 24 32 40 48 64 80 96 128 160`.

| Use | Value |
| --- | --- |
| Section vertical rhythm | 96px mobile / 128px desktop (`py-24 md:py-32`) |
| Page gutter | 24px mobile / 40px desktop (`px-6 md:px-10`) |
| Content max width | 1152px (`max-w-6xl`) |
| Card grid gap | 16px (`gap-4`) |
| Card inner padding | 20px mobile / 24px desktop (`p-5 md:p-6`) |
| Feature card padding | 28px desktop (`md:p-7`) |

---

## 3. Radius

| Token | Value | Used for |
| --- | --- | --- |
| `xs` | 4px | focus rings, tiny tags |
| `sm` | 8px | tool chips |
| `md` | 12px | buttons, inputs, nav links |
| `lg` | 20px | **all cards** |
| `xl` | 28px | media frames, the hero display case |
| pill | 999px | dots, indicators, avatars |

---

## 4. Typography

| Face | Role |
| --- | --- |
| **Sora** | display — headlines, stat figures, project titles |
| **Plus Jakarta Sans** | body — paragraphs, list items, UI labels |
| **JetBrains Mono** | technical — eyebrows, periods, tech chips, the degree readout |
| **IRANYekanX** → Vazirmatn fallback | all Persian text, replacing both Latin faces |

Fluid scale (`clamp`, so nothing needs breakpoint overrides):

| Token | Range | Role |
| --- | --- | --- |
| `text-mega` | 2.75 → 8rem | hero and contact statements |
| `text-display` | 2 → 4.25rem | section opening statements |
| `text-title` | 1.5 → 2.5rem | section headings |
| `text-lead` | 1.06 → 1.31rem | standfirst paragraphs |

`.eyebrow` is the one label recipe: mono, 11px, `0.18em` tracking,
uppercase — and it automatically drops uppercase plus tightens tracking
under `html[lang="fa"]`, because neither applies to Persian.

Hierarchy per section: eyebrow → display statement → lead → body → mono
metadata. Never two competing display sizes in one section.

---

## 5. Motion

| Token | Duration | Used for |
| --- | --- | --- |
| `fast` | 180ms | hovers, toggles, colour changes |
| `base` | 320ms | card lift, most transitions |
| `slow` | 640ms | scroll entrances |
| `cinematic` | 1000ms | hero beats |

Two curves only: `easeOut` `(0.22, 1, 0.36, 1)` for everything, and
`easeSpring` `(0.34, 1.56, 0.64, 1)` where a little overshoot helps.
Scrub-linked GSAP timelines always use `ease: "none"` — the scroll
position *is* the easing.

Stagger between siblings: 50ms. Entrance distance: 24px.

Ownership is split deliberately:

- **GSAP + ScrollTrigger** — anything tied to scroll position: the hero
  spin, the About word scrub, the Experience track fill.
- **Motion** — anything tied to entering the viewport once, and all
  component-level interaction.
- **CSS** — marquees, pulse rings, hover states, theme transitions.

Everything is wrapped in `gsap.matchMedia()` or Motion's own handling, and
`prefers-reduced-motion` collapses all durations in `globals.css`.

---

## 6. Elevation

Three levels, no others: `flat` (resting card), `raised` (hovered card),
`floating` (media frames and the hero display case). Borders are always a
1px hairline in `--border`; a hovered card mixes 42% of its accent into
that border rather than switching colour outright.

---

## 7. The card recipe

One recipe, in `.card` / `.card-interactive`:

1. `--radius-lg` corners, hairline border, `flat` elevation.
2. A radial accent wash from the leading top corner at 12% alpha — this is
   what stops a grid of cards reading as grey boxes.
3. A 2px accent bar on the leading edge, hidden until hover/focus-within.
4. On hover: lift 3px, `raised` elevation, accent-mixed border.

Components pass `accent`; they never touch any of the above.
RTL is handled with logical properties (`inset-inline-start`), so the wash
and bar flip automatically in Persian.
