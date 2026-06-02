# Open Aviation Solutions website

Source for [openaviation.solutions](https://openaviation.solutions) — a docs site for Australian flight training resources. Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build), deployed to GitHub Pages on push to `main`.

## Commands

```
make install      # install deps
make dev          # dev server at localhost:4321
make build        # build to ./dist/
make preview      # preview the built site locally
make test         # run Playwright e2e tests (CI only — see memory)
make lint-prose   # spell- and style-check content with Vale
make check        # run all checks (currently lint-prose)
```

Prose linting uses [Vale](https://vale.sh) with the `en_AU` Hunspell dictionary
and a custom aviation vocabulary at `.vale/styles/config/vocabularies/Aviation/accept.txt`.
Add new domain terms (acronyms, aircraft types, proper names) there rather than
disabling rules. The same setup runs in CI on every push and PR.

## Architecture

All content lives in `src/content/docs/` as `.mdx` files. Each file maps directly to a URL route — Starlight handles the layout, sidebar, and navigation automatically.

- `src/content/docs/index.mdx` — homepage (uses `template: splash`)
- `src/components/` — Astro layout components (header, footer, hero, info cards)
- `src/content/docs/open-aviation-components.mdx` — overview of the interactive learning components; per-component documentation lives on the [components docs site](https://open-aviation-solutions.github.io/open-aviation-components/)
- `src/assets/` — images referenced from MDX content (Astro optimises these at build time)
- `public/` — static files served verbatim (includes `CNAME` for the custom domain)

The sidebar is defined manually in `astro.config.mjs` — adding a new page requires adding an entry there too.

The interactive learning components themselves are not embedded on this site. The website shows screenshots that link out to the [components docs site](https://open-aviation-solutions.github.io/open-aviation-components/), which carries both the non-technical guidance and the technical embedding reference for each component. This keeps the website free of the `@open-aviation-solutions/components` and `three` dependencies and avoids two sources of truth per component.

## Voice and transparency

This site represents a one-person operation. Use "I" rather than "we" when referring to the company or its work — transparency about the solo nature of the project is core to the ethos. "We" is fine when referring to the broader community of pilots or learners (e.g. "we all want safer skies").

Do not append Unicode arrows (→, ➜, etc.) to link text. Plain link text is sufficient; the underline already signals the link.

## Commit style

Do not add `Co-Authored-By` trailers. The developer is solely responsible for authorship of all commits, regardless of tooling used.

## Deployment

Pushes to `main` automatically build and deploy via `.github/workflows/deploy.yml` using `withastro/action` and `actions/deploy-pages`. The `public/CNAME` file and apex DNS settings pin the custom domain `openaviation.solutions`.
