# Open Aviation Solutions — website

Source for <https://openaviation.solutions>. Static site built with
[Astro](https://astro.build) and the [Starlight](https://starlight.astro.build) theme,
deployed to GitHub Pages.

## Commands

| Command           | Action                                  |
| :---------------- | :-------------------------------------- |
| `npm install`     | Install dependencies                    |
| `npm run dev`     | Run the dev server at `localhost:4321`  |
| `npm run build`   | Build to `./dist/`                      |
| `npm run preview` | Preview the built site locally          |

## Project layout

```
.
├── public/               # Static assets served at the site root (includes CNAME)
├── src/
│   ├── assets/           # Images referenced from content
│   └── content/docs/     # Markdown / MDX pages — one file per route
├── astro.config.mjs
└── .github/workflows/    # GitHub Actions deploy to Pages
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the site with
`withastro/action` and publishes via `actions/deploy-pages`. The `public/CNAME` file
pins the custom domain; apex DNS + *Enforce HTTPS* are configured in the repo's Pages
settings.
