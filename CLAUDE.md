# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Source for [openaviation.solutions](https://openaviation.solutions) — a docs site for Australian flight training resources. Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build), deployed to GitHub Pages on push to `main`.

## Commands

```
npm install       # install deps
npm run dev       # dev server at localhost:4321
npm run build     # build to ./dist/
npm run preview   # preview the built site locally
```

There are no tests or linting scripts configured.

## Architecture

All content lives in `src/content/docs/` as `.mdx` files. Each file maps directly to a URL route — Starlight handles the layout, sidebar, and navigation automatically.

- `src/content/docs/index.mdx` — homepage (uses `template: splash`)
- `src/components/` — Astro wrapper components for learning tools (e.g. `FourForces.astro`)
- `src/content/docs/learning-components/` — one page per learning component, plus an index
- `src/assets/` — images referenced from MDX content (Astro optimises these at build time)
- `public/` — static files served verbatim (includes `CNAME` for the custom domain)

The sidebar is defined manually in `astro.config.mjs` — adding a new page requires adding an entry there too.

Learning components come from the `@open-aviation-solutions/components` npm package (web components / custom elements). `three` is a required peer dependency. Each component is wrapped in a small `.astro` file under `src/components/` which imports the package via a `<script>` tag (bundled client-side by Astro/Vite) and sets default attributes like `model-path` and `height`. MDX pages import these wrappers directly.

## Commit style

Do **not** add `Co-Authored-By` trailers. The developer is solely responsible for authorship of all commits, regardless of tooling used.

## Deployment

Pushes to `main` automatically build and deploy via `.github/workflows/deploy.yml` using `withastro/action` and `actions/deploy-pages`. The `public/CNAME` file and apex DNS settings pin the custom domain `openaviation.solutions`.
