# Add SEO basics and social-card metadata

**Status:** complete (2026-06-13) — all acceptance criteria met; archived

## Implementation notes (2026-06-13 audit)

Audited the live tree against the acceptance criteria and found one
criterion that was never actually delivered, plus confirmed the rest:

- **Sitemap regression — fixed.** `@astrojs/sitemap` was present in
  `package-lock.json` and `node_modules`, and a stale
  `dist/sitemap-index.xml` (1 Jun) existed, but the integration had
  never been committed to `astro.config.mjs` *or* listed in
  `package.json` dependencies. A clean build therefore produced **no**
  sitemap, while the committed `public/robots.txt` advertised
  `https://openaviation.solutions/sitemap-index.xml` — i.e. robots.txt
  pointed crawlers at a file the deployed site did not generate. Fixed
  by adding `@astrojs/sitemap` to `package.json` (`^3.7.2`, matching
  the lockfile) and `sitemap()` to the integrations array. A clean
  `make build` now logs `[@astrojs/sitemap] sitemap-index.xml created`
  and emits `sitemap-index.xml` + `sitemap-0.xml` (11 URLs; the 404 is
  correctly excluded).
- **Per-page OG + Twitter tags — verified.** Built pages carry
  per-page `og:title` / `og:description` from frontmatter (confirmed
  on `/about/`), site-wide `og:image` (1200×630) + dimensions,
  `og:type`, `twitter:card=summary_large_image`, and `twitter:image`.
- **Organization JSON-LD — verified.** Rendered site-wide from the
  shared `src/site-info.ts` constants module.
- **Branded 404 — verified.** `src/content/docs/404.mdx` builds to
  `dist/404.html` with the branded splash layout.
- **Prose lint** (`make check`) passes: 0 errors/warnings.

Minor observation, not actioned: Starlight emits `og:type=article`
site-wide, including the splash homepage where `website` is marginally
more correct. Per Q8 this task deliberately relies on Starlight
defaults; changing it would need a `Head.astro` override. Left as a
possible future tweak.

**Link-preview verification — done.** After deploy, the live card was
confirmed via the Meta Sharing Debugger
(https://developers.facebook.com/tools/debug/): the brand image renders
and all OG/Twitter tags resolve correctly. The deployed apex was also
checked directly: `robots.txt` advertises the sitemap,
`sitemap-index.xml` returns 200 (11 URLs), and the homepage carries the
`canonical` link and the `Organization` JSON-LD. This closes the last
acceptance criterion.

## Post-deploy: search-engine submission (operational, not code)

The markup is sufficient for organic discovery, but the site should be
registered with Google so indexing is faster and observable:

- **Google Search Console** (https://search.google.com/search-console) —
  add a **Domain property** for `openaviation.solutions` (verified with a
  single DNS TXT record; covers apex + subdomains), then submit the
  sitemap `https://openaviation.solutions/sitemap-index.xml` under
  Sitemaps. Use URL Inspection → Request Indexing to nudge key pages.
- **Bing Webmaster Tools** (optional) — import from Search Console and
  submit the same sitemap; covers Bing + DuckDuckGo.
- **Validate structured data** (optional) — run the homepage through the
  Rich Results Test / schema.org validator to confirm the `Organization`
  block parses.

These are one-off account/DNS actions, so they live here as a checklist
rather than as code work.

## Out-of-scope follow-up: sub-site discoverability

The two sub-sites on the shared `open-aviation-solutions.github.io`
origin (briefings, components) now each emit their own sitemap and OG
card, but their sitemaps are not yet advertised by any origin-root
`robots.txt` (robots.txt is only honoured at the origin root, which no
deploy currently owns). That gap is tracked in
`../project-websites-root/tasks/0001-origin-root-landing-and-robots.md`,
not here.

## Purpose

Sibling to `0001-missing-business-website-info.md`. That task covers
the *business-identity* gaps (about, contact, privacy, terms,
footer). This one covers the *discoverability* gaps: the pieces a
search engine or a social platform expects to find on a public
site, separate from anything a human visitor would notice.

The site is meant to be discoverable by Australian flight
instructors, training organisations, and self-directed learners.
Right now a search-engine crawler or a Slack/Twitter/LinkedIn link
preview both fall back to whatever Starlight emits by default —
which is functional but not branded.

## Current state

`astro.config.mjs` configures Starlight's `title`, `description`,
and `site` URL. Nothing else affects `<head>` or the public crawl
surface. Specifically missing:

| Missing | What a default site loses without it |
|---|---|
| `robots.txt` | Crawlers fall back to defaults; no way to point at the sitemap. |
| `sitemap.xml` | Search engines have to discover URLs by following links only. |
| Open Graph image (`og:image`) | Social link previews use no image, or a generic favicon. |
| Open Graph / Twitter card metadata per page | Previews show only the page title; no description or image. |
| Per-page canonical URLs | Starlight handles this; verify it's emitting them. |
| Structured data (`Organization` JSON-LD) | Google "knowledge panel" / business-card surfaces have nothing to render. |
| Branded 404 page | Starlight's default 404 is unbranded; missing brand on the most-likely entry point for broken inbound links. |

## Discussion

### Q1. Sitemap — Astro plugin or Starlight built-in?

`@astrojs/sitemap` is the standard integration and is the path
Starlight's docs recommend. It generates `sitemap-index.xml` +
`sitemap-0.xml` at build, picks up the `site` already set in
`astro.config.mjs`.

**Recommendation:** add `@astrojs/sitemap` to the integrations
array. **Likely agreed.**

### Q2. `robots.txt` — static file or generated?

Static file under `public/robots.txt` is simpler than a generated
one and is enough for this site (single host, no environments to
differentiate). Should reference the sitemap URL.

**Recommendation:** static file in `public/`. **Likely agreed.**

### Q3. OG image — single site-wide image, or per-page?

A single site-wide OG image is the cheap path: one design pass,
applied to every page. Per-page OG images need either hand-authored
images or a build-time generator (e.g. `astro-og-canvas`,
`@vercel/og`). Per-page is nicer but is a meaningful design+
infra step.

**Recommendation:** start with a single site-wide OG image (1200×630,
SVG-rendered to PNG, brand mark + tagline). Move to per-page only if
social sharing becomes a meaningful traffic source. **Decision
needed:** does a brand image / mark suitable for the OG card already
exist, or does this task include a design pass?

### Q4. Twitter card — needed in addition to OG?

Twitter (X) reads OG tags as a fallback but has its own
`twitter:card`, `twitter:site`, `twitter:creator` tags. LinkedIn,
Slack, Discord, Facebook all read OG. Adding Twitter-specific tags
costs almost nothing.

**Recommendation:** include both. **Likely agreed. Decision
needed:** is there a Twitter/X handle to put in `twitter:site` /
`twitter:creator`, or omit those?

### Q5. Structured data (`Organization` JSON-LD)

A small `<script type="application/ld+json">` block describing the
business gives Google something to render in knowledge-panel /
sitelink contexts. With the ABN/registered-name details now
captured (see task 0001), the JSON-LD can include the legal name,
registered business name, URL, and contact email.

**Recommendation:** add an `Organization` JSON-LD block site-wide,
sourced from a single constants module so it stays in sync with the
footer. **Likely agreed.**

### Q6. Branded 404 page

Starlight ships a default 404. A custom `src/pages/404.astro` (or
`src/content/docs/404.mdx`) can match the site brand and offer
links back to the homepage / learning-components index.

**Recommendation:** include a small branded 404 in this task.
**Likely agreed.**

### Q7. Where does the OG image live?

`public/og-image.png` is the conventional path and survives without
Astro's image pipeline touching it. The OG tag in `<head>` then
points at `https://openaviation.solutions/og-image.png` (absolute
URL — social platforms require it).

**Recommendation:** static file at `public/og-image.png`. **Likely
agreed.**

### Q8. `<head>` injection seam in Starlight

Starlight allows custom `<head>` entries via the `head` config
option, and global head content via a `Head` component override.
Per-page tags (page-specific `og:title`, `og:description`) come
from frontmatter.

**Recommendation:** use the `head` config for site-wide tags
(twitter card type, og:image, og:type=website, JSON-LD), and rely
on Starlight's defaults for per-page `og:title` /
`og:description`. Verify Starlight is in fact emitting per-page OG
tags from frontmatter — if not, override `Head.astro`. **Decision
needed after a quick audit during implementation.**

### Q9. Analytics — explicitly out of scope here

Task 0001 Q3 commits to updating `/privacy/` *before* analytics
ships. Adding analytics is therefore neither this task nor task
0001 — it's a follow-up that depends on both.

## Provisional acceptance criteria

- `@astrojs/sitemap` integration added; `sitemap-index.xml`
  reachable on the deployed site.
- `public/robots.txt` exists and references the sitemap URL.
- A site-wide OG image exists at `public/og-image.png` (1200×630).
- `<head>` includes site-wide `og:image`, `og:type`,
  `twitter:card`, and an `Organization` JSON-LD block sourced from
  a shared constants module.
- Per-page `og:title` and `og:description` are verified to render
  correctly (from frontmatter).
- A branded 404 page replaces the Starlight default.
- Link previews verified on at least one platform (e.g. paste a URL
  into Slack or use a card debugger) before the task is closed.

## Out of scope

- Per-page OG images / generator (per Q3).
- Adding analytics (per Q9).
- Schema.org markup beyond `Organization` (e.g. `Course`,
  `LearningResource` per learning-component page) — possible future
  task once the component pages have stable shapes.
