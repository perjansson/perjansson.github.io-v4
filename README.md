# perjansson.me — v4

Fourth iteration of my personal portfolio, redesigned after the visual
language of [Restaurant E.Ekblom](https://eekblom.fi/en/etusivu-english/):
brutalist boxed panels, monospace typography, a circular scattered-letter
wordmark, hand-drawn line-art illustrations and menu-card lists — in the
restaurant's cream-and-ink palette, with an inverted dark theme a toggle
away.

Built as a static site with [Next.js 16](https://nextjs.org) (App Router,
static export) and content from [Contentful](https://www.contentful.com) — the
same content model and GraphQL queries as [v3](https://github.com/perjansson/perjansson.github.io-v3),
only the UI is new. Tested end-to-end with [Playwright](https://playwright.dev),
built with [GitHub Actions](https://github.com/features/actions) and deployed
on [Netlify](https://www.netlify.com).

## Workflow

Deliberately simple for now:

- **main** is the only long-lived branch and represents production
- Every push runs the CI workflow: install → build → Playwright e2e tests
- On **main**, if all tests pass, the pre-built site is deployed straight to
  Netlify production with `netlify-cli`
- Staging environments and pull-request previews can be added later if needed

Required GitHub Actions secrets:

| Secret | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CONTENTFUL_SPACE_ID` | Contentful space |
| `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN` | Contentful delivery token |
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token |
| `NETLIFY_SITE_ID` | Netlify site to deploy to |
| `GA_TRACKING_ID` | Google Analytics 4 measurement ID (optional — analytics are simply omitted without it) |

## Get started

### Configuration

Content is fetched at build time from Contentful:

```
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=...
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=...
```

If the variables are not set (e.g. local development without secrets), the
site builds with clearly-labeled sample fallback data so the design can always
be previewed.

### Promoted projects

The work page shows promoted projects under "Selected work". Add a **Boolean
field with id `promoted`** to the project content type in Contentful and tick
it on the projects to highlight — the site picks it up on the next build.
Until that field exists, a curated fallback list in `src/lib/workData.ts`
decides the selection.

### Local dev

```
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```
npm run build
```

Outputs a fully static site to `out/`, ready for Netlify (or any static host).

### E2E tests

```
npm run build
npm run test:e2e
```

Runs the Playwright suite (desktop + mobile Chrome) against the static build
in `out/`, serving it on port 4173 automatically.

## Design notes

- **Typography**: Space Mono throughout, self-hosted via Fontsource.
- **Palette**: two tones only — cream `#ece7dd` with near-black ink
  `#191919` by default (the restaurant's own scheme), inverted for the
  dark theme.
- **Structure**: every page sits in a thick-bordered frame with social icons
  and a burger menu above it and a footer strip (V3/V4 switcher + contact
  line) below it. The front page splits into the scattered-letter logo panel
  and a 2×2 grid of illustrated navigation cards; sub-pages (Story, Work,
  Craft, Contact, projects) use the recurring logo-left/content-right split.
- **Details**: black-bar section headers, inverted label chips, menu-style
  lists with right-aligned "prices" (years), and a cream slide-in navigation
  panel.
