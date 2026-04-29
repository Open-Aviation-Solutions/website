# Add SEO basics and social-card metadata

**Status:** proposal

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
