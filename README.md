# perjansson.me — v4

Fourth iteration of my personal portfolio, redesigned with a restaurant-bistro
aesthetic inspired by [Restaurant E.Ekblom](https://eekblom.fi/en/etusivu-english/):
a dark, candle-lit palette, elegant serif typography, and projects presented
like courses on a menu card.

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

- **Typography**: Playfair Display (display serif) + Inter (body), self-hosted
  via Fontsource.
- **Palette**: deep green-black background `#12150f`, warm cream ink
  `#ede7da`, aged brass accent `#c2a878`.
- **Structure**: full-height statement hero → The Story (about) → The Menu
  (selected work as a menu card with dotted leaders) → The Cellar (tech) →
  Contact (set like an opening-hours table).
- Project pages open with a full-bleed image and present facts like a menu's
  fine print.
