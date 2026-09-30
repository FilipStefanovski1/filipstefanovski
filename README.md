# Filip Stefanovski, portfolio

Personal portfolio built with Next.js (App Router), TypeScript, React Three Fiber, Drei, Rapier and Motion. Designed for static deployment on Vercel.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint
```

## Where things live

| Path | What |
| --- | --- |
| `src/content/site.ts` | All copy, projects, supporting work and contact links. Edit this to update the site. |
| `src/components/badge/` | The hanging badge. `BadgeScene.tsx` (physics scene, tuning constants at the top), `artwork.ts` (front, back and strap artwork drawn to canvas), `geometry.ts` (card and sleeve dimensions), `StaticBadge.tsx` (HTML fallback for loading, reduced motion and no WebGL). |
| `src/components/visuals/` | Project compositions and the illustrative screens (synthetic data). |
| `src/app/work/[slug]/` | Case study pages, generated statically from `projects`. |
| `public/work/` | Screenshots of the public Q4 and Nordgate websites. |

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL used for metadata, sitemap and robots. Defaults to `https://filipstefanovski.vercel.app`. Set it to the real domain in Vercel. |

No secrets are used. There is no backend.

## The badge

- Real physics: a fixed anchor, three rope joints and a spherical joint to the card (Rapier).
- Dragging pulls the grabbed point with a damped spring, so the card tilts and twists naturally. Release keeps its momentum.
- Velocities are capped and a gentle yaw return turns the printed face back toward the viewer.
- The scene is lazy loaded. A matching static badge renders first and cross-fades out.
- Rendering and physics pause when the hero is offscreen or the tab is hidden, with a two-frame hold on resume.
- `prefers-reduced-motion` or missing WebGL keeps the static badge.
- On touch devices the page scrolls normally everywhere except while the badge is being dragged.

## Content notes

- Q4 Internal and SMCC screens are illustrative recreations with synthetic or placeholder content, and are labelled as such.
- Contact links are empty until verified ones are added to `site.contact` in `src/content/site.ts`.
