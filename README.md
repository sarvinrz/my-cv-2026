# mycv — Interactive Portfolio

Personal portfolio for **Sarvin Rezazadeh** — bilingual (EN / FA), dark/light theme, corner LEGO avatar, vertical project cards with horizontal image galleries.

## Run

```bash
npm install
npm run dev        # http://localhost:3000/en  or  /fa
```

## Locales

- English: `/en`
- Persian (RTL): `/fa`
- Toggle via **FA / EN** button in the header

## Theme

Dark / light toggle in the header (next-themes).

## Before deploying

1. Contact links are in `lib/site.ts`
2. Replace `public/resume-en.pdf` and `public/resume-fa.pdf` with real resumes
3. **IRANYekanX fonts**: drop `IRANYekanX-Regular.woff2`, `Medium`, `Bold` into `public/fonts/` (currently falls back to Vazirmatn from Google Fonts)
4. Swap gallery mockups in `public/assets/gallery/` with real screenshots or videos

## Stack

Next.js 16 · TypeScript · Tailwind v4 · next-intl · next-themes · GSAP · Lenis · Motion · Three.js / R3F
