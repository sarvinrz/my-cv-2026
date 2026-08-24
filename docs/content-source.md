# Content Source

All user-facing content is data-driven and intentionally conservative —
no invented metrics, dates, or business outcomes.

| Content            | File                | Notes                                                     |
| ------------------ | ------------------- | --------------------------------------------------------- |
| Name, role, links  | `lib/site.ts`       | **Update the TODO links (email, GitHub, LinkedIn, URL).** |
| Hero concepts      | `lib/site.ts`       |                                                           |
| Projects           | `lib/projects.ts`   | Six projects, equal visual weight.                        |
| Skills / ecosystem | `lib/skills.ts`     | Positions for the floating field live here too.           |
| Experience         | `lib/experience.ts` | No dates — add them only if you want them public.         |
| Highlights         | `lib/highlights.ts` | Problem / Approach / Technology / Outcome.                |

## Screenshots

Real screenshots provided by the owner, in `public/assets/`:

- `project-coreoffice.png` — CoreOffice ERP (employee evaluation module)
- `project-loan.png` — loan facilities landing page
- `project-monitoring.png` — Grafana Node Exporter dashboard
- `lego-avatar-reference.png` — visual source of truth for the 3D figure

The graph, workflow, and crypto projects use **clearly abstract** animated
compositions (SVG/CSS) — they are not presented as real screenshots. To
swap any of them for a real screenshot later, add `screenshot` +
`screenshotAlt` to the project in `lib/projects.ts` and switch its
`visual` kind in `sections/ProjectVisual.tsx`.

## Resume

`public/resume.pdf` is a placeholder — replace it with the real file.
