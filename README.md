# joq.dev

Clean Astro + React starter for the personal site and blog.

## Stack

- Astro + TypeScript for static pages and blog routing
- React components through `@astrojs/react`
- Cloudflare Pages for deployment
- Biome for linting and formatting
- Vitest + Testing Library for component tests
- Husky + lint-staged + Claude hooks from the agentic harness template

## Setup

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev         # Vite dev server
npm run build       # Astro type check + production build
npm run preview     # Preview the built dist output
npm test            # Component tests
npm run typecheck   # Astro + test TypeScript checks
npm run lint        # Biome lint + format check
npm run lint:fix    # Apply Biome fixes
npm run ci          # Strict Biome check for CI
```

## Cloudflare Pages

Use these settings in Cloudflare Pages:

- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `22.12.0` from `.node-version`

## Architecture Note

Astro is the default because this is a personal site with a blog. Pages are static by default, and React remains available for components that need React's model.

Sanity is intentionally not wired yet. The repo should stay barebones until the blog content model, post design, preview needs, and Studio location are clear.

The blog routes are:

- `/blog` for the post list
