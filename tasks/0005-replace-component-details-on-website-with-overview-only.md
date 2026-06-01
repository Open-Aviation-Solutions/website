# Replace per-component pages on the website with a single overview

**Status:** proposal

## Purpose

The website currently treats the two open-source projects asymmetrically:

- **Open Aviation Briefings** → one overview page (`/open-aviation-briefings/`)
  that explains the project in non-technical terms and links out to the
  separate briefings site for the actual content.
- **Open Aviation Components** → an overview page plus one page per
  component (`/open-aviation-components/{aerofoil-dynamics,
  briefing-overview, climb-performance, four-forces, pitch-roll-yaw}/`),
  with the technical/embedding documentation living on a separate
  components docs site (`open-aviation-solutions.github.io/open-aviation-components/`).

The components split was originally a way to separate the non-technical
(on the website) from the technical (on the components docs site). In
practice it has caused two problems:

1. **Confusing for visitors.** Two URLs per component exist for what
   feels like one thing, and the help button inside each embedded
   component points at the *website* page, not the components site —
   sending people who want technical detail to the wrong place.
2. **Hard to maintain.** Every new component requires updating two
   sites: a non-technical page on the website *and* a technical page on
   the components site. Adding a component is a four-file change at
   minimum (component page, sidebar entry, screenshot link, wrapper),
   spread across two repositories.

The goal of this task is to make the components surface match the
briefings surface: a single overview page on the website with a small
number of highlighted components live-embedded, and one source of truth
per component on the components docs site (carrying the non-technical
explanation *and* the technical reference). The help button inside each
component then points at that single per-component page, which is where
visitors expect to land.

## Current state

### Website (`/home/michael/dev/open-aviation-solutions/website`)

```
src/content/docs/open-aviation-components/
├── _INSTRUCTIONS.md         # rules for non-technical content tone
├── index.mdx                # overview + per-component cards w/ screenshots
├── aerofoil-dynamics.mdx    # non-technical: why it helps + live demo
├── briefing-overview.mdx    # + ## Description / ## For instructors / ## For trainees
├── climb-performance.mdx    # + footer link to the components docs site
├── four-forces.mdx
└── pitch-roll-yaw.mdx
```

- `src/components/{AerofoilDynamics,BriefingOverview,ClimbPerformance,FourForces,PitchRollYaw}.astro`
  — Astro wrappers around the npm web components, imported by the MDX
  pages above.
- `astro.config.mjs` — the sidebar has a top-level "Open Aviation
  Components" group containing six entries (overview + five
  components).

### Components docs site (`/home/michael/dev/open-aviation-solutions/open-aviation-components/docs/`)

```
docs/content/
├── index.mdx                # short blurb + <ComponentList /> + install snippet
├── aerofoil-dynamics.mdx    # technical: <ComponentDescription /> +
├── briefing-overview.mdx    #   short prose + live demo +
├── climb-performance.mdx    #   ## Usage (embed snippet) + ## Attributes +
├── four-forces.mdx          #   ## Dependencies
└── pitch-roll-yaw.mdx
```

Each per-component page renders the live demo via a wrapper in
`docs/components/<Name>.astro` (these wrappers import `../../src/define`
directly to register the custom element, rather than going through the
published npm package).

### Components library (`/home/michael/dev/open-aviation-solutions/open-aviation-components/src/`)

- `src/config.ts` exports `HELP_BASE_URL =
  'https://openaviation.solutions/open-aviation-components'`. Every
  component appends `/<slug>/` to this URL when constructing the
  in-component "?" help button (`AerofoilDynamics`, `BriefingOverview`,
  `ClimbPerformance`, `FourForces`, `PitchRollYaw` all use the same
  pattern in their `index.ts`).
- Each component supports a `show-help` attribute that hides the help
  link when set to `"false"`.

## Discussion

### Q1. Which components get highlighted on the new overview page?

**Decision:** highlight **Four Forces** and **Climb Performance** on
the new overview page. Both are highlighted with a **screenshot only**
(no embedded live demo), each wrapped in a link to its page on the
components docs site:

- `https://open-aviation-solutions.github.io/open-aviation-components/four-forces/`
- `https://open-aviation-solutions.github.io/open-aviation-components/climb-performance/`

Screenshots use the existing hosted assets at
`https://open-aviation-solutions.github.io/open-aviation-components/screenshots/<slug>.png`
(same pattern the current `index.mdx` uses for its per-component
cards), so the website doesn't need to host its own copies.

This means the new overview page does **not** embed any components
live. That has knock-on consequences: see Q7 (no wrappers needed) and
Q8 (release sequencing is simpler).

### Q2. Where does the in-component help link point after the change?

Currently: `https://openaviation.solutions/open-aviation-components/<slug>/`.

After the change those URLs no longer exist. The replacement target is
the components docs site:
`https://open-aviation-solutions.github.io/open-aviation-components/<slug>/`.
The slug values (`aerofoil-dynamics`, `briefing-overview`, …) are
already identical on the components docs site, so the path suffix logic
in each component does not need to change — only the base URL.

**Decision:** update `HELP_BASE_URL` in
`open-aviation-components/src/config.ts` to point at the docs site, and
release a new component package version. The release order matters —
see Q8.

### Q3. Help button on the components docs site itself

Once the help URL points at the components docs site, components
embedded *on that site* would link back to the page they are already
on. The button stops being useful and is mildly confusing.

**Decision:** set `show-help="false"` on the live demos in each
per-component wrapper under
`open-aviation-components/docs/components/<Name>.astro`. The button
remains visible everywhere the components are embedded externally
(website overview, briefings slides, third-party sites).

### Q4. Merging the non-technical content into the components-site pages

Each website per-component page currently has, in order:
1. One or two paragraphs explaining *why* this tool helps a learner
2. The live demo
3. `## Description` — one-paragraph prose intro of what the component shows
4. Short explanation of the interactive controls
5. `## For instructors` — ground-briefing use cases
6. `## For trainees` — self-study exercises
7. Footer link out to the components docs site

Each components-docs per-component page currently has, in order:
1. `<ComponentDescription />` (renders the frontmatter `description`)
2. A short technical-flavoured paragraph (often mentioning physics,
   sync, etc.)
3. The live demo
4. `## Usage` — embed snippet
5. `## Attributes` table
6. `## Dependencies`

The merged page should put the **non-technical content first** so that
a visitor coming from the help button lands on something they can read,
with technical reference further down. Proposed order:

1. Frontmatter (`title`, `description`)
2. Non-technical "why this helps" paragraphs (from the website page)
3. The live demo with `show-help="false"` (per Q3)
4. `## Description` — what the tool shows + the controls (current
   website sections 3+4 combined, or kept as separate H2/H3)
5. `## For instructors`
6. `## For trainees`
7. `## Embedding this component` — current `## Usage`, renamed to make
   it clear this is the developer section
8. `## Attributes`
9. `## Dependencies`

The current `<ComponentDescription />` component on the docs site just
renders the frontmatter description as a `<p>` — it can stay or be
inlined; implementer's call.

### Q5. Website sidebar collapse

The sidebar's "Open Aviation Components" group (six entries) collapses
to a single entry, matching how Open Aviation Briefings and the other
top-level pages appear. The "About" group in `astro.config.mjs` already
shows the right pattern.

**Decision:** replace the grouped entry with a single
`{ label: 'Open Aviation Components', slug: 'open-aviation-components' }`.

### Q6. Stale URLs

After the change, six URLs that previously existed will 404:
`/open-aviation-components/{aerofoil-dynamics, briefing-overview,
climb-performance, four-forces, pitch-roll-yaw}/`.

These URLs are linked from:
- The current sidebar (removed by Q5)
- The current overview page (replaced by this task)
- Possibly external links / search results from before the change

GitHub Pages has no native server-side redirect mechanism on a project
domain. Options:

a) **Do nothing.** The branded 404 page added in task 0002 covers any
   broken inbound link with a clear path back to the homepage and a
   pointer to the overview page. This is the cheapest option and is
   acceptable for a low-traffic, recently-launched site.
b) **Static HTML redirect pages.** Drop a tiny `.html` file per stale
   path that issues a meta-refresh and a JS `location.replace` to the
   matching URL on the components docs site. More work and more files
   to maintain.

**Recommendation:** option (a). Re-evaluate if analytics (task 0003)
shows meaningful 404 traffic to these paths.

### Q7. Unused per-component wrappers and the components dependency

The website has five wrappers under `src/components/` (`FourForces.astro`,
`PitchRollYaw.astro`, etc.) that the per-component MDX pages import.
Because the new overview page uses screenshots-with-links rather than
live embeds (per Q1), **none** of these wrappers are still needed.

**Decision:** delete all five per-component wrappers via `git rm`.

This in turn means the website no longer imports
`@open-aviation-solutions/components` anywhere, so the npm dependency
can be removed from `package.json`. The `three` peer dependency that
exists solely because the components needed it can also be removed.
Verify by grepping the repo for any remaining imports before deleting.

### Q8. Order of operations (release sequencing)

The change touches three deployables: the components library (npm
package), the components docs site (GitHub Pages), and the website
(GitHub Pages). Because the website no longer embeds components live
(per Q1), the website doesn't have to consume the new library release
— it's decoupled from the library bump entirely.

The remaining coupling is between the components library (help URL)
and the components docs site (target of the new help URL). Safer
sequence:

1. **Components docs site first.** Land the merged per-component pages
   (Q4) on the components docs site and deploy. The new URLs work and
   carry the non-technical content. Old help links from the published
   library still point at the website's per-component pages and
   continue to work — nothing breaks yet.
2. **Components library next.** Update `HELP_BASE_URL` in
   `src/config.ts` (Q2) and add `show-help="false"` to the docs-site
   wrappers (Q3). Cut a new npm release. Any third-party embed (and
   the briefings site, on its next routine bump) will then start
   pointing at the new components-site URLs — which already work
   because step 1 landed first.
3. **Website in parallel with or after step 2.** Replace the
   per-component pages with the single overview page, update the
   sidebar (Q5), delete the unused wrappers and the npm dependency
   (Q7). The website's deploy order relative to step 2 doesn't matter
   — the website doesn't import the library after this change.

If the website ships before step 1, inbound visitors clicking the help
button on a component embedded on a third-party site will still land
on a working page (the components docs site URLs already exist today;
only the *content* there gets richer in step 1). So in practice steps
1 and the website change can both happen first, with step 2 last; the
constraint is just that step 1 should happen before or with step 2.

## Acceptance criteria

### On the website

- `src/content/docs/open-aviation-components.mdx` exists as a single
  overview page that mirrors `open-aviation-briefings.mdx`:
  - Why the components exist + what they are
  - **Four Forces** and **Climb Performance** highlighted with
    screenshots only (no live embed), each wrapped in a link to its
    page on the components docs site (per Q1)
  - Prose summary of the rest of the library with a prominent link to
    the components docs site
  - Licensing/contributing pointer consistent with the briefings page
- `src/content/docs/open-aviation-components/` (directory) is removed.
  Pages inside, including `_INSTRUCTIONS.md` and the `.claude/CLAUDE.md`
  symlink, are deleted via `git rm`.
- `astro.config.mjs` sidebar: the "Open Aviation Components" grouped
  entry is replaced with a single `slug:
  'open-aviation-components'` entry, ordered alongside the briefings
  and software entries.
- All five per-component wrappers in `src/components/` are deleted
  (per Q7); no wrappers are needed because the overview uses
  screenshots-with-links rather than live embeds.
- `@open-aviation-solutions/components` and `three` are removed from
  `package.json` (per Q7) after grepping confirms no remaining
  imports.
- `make build` and `make check` pass; the new overview page renders
  the screenshots and their links correctly in `make dev`.

### On the components docs site (`open-aviation-components/docs/`)

- Each per-component page (`aerofoil-dynamics.mdx`,
  `briefing-overview.mdx`, `climb-performance.mdx`, `four-forces.mdx`,
  `pitch-roll-yaw.mdx`) carries the non-technical sections (per Q4) in
  front of the existing technical sections.
- The live-demo embed on each per-component page has
  `show-help="false"` (per Q3).
- The index page is reviewed for consistency with the new
  non-technical-first framing but does not need to be rewritten.

### In the components library (`open-aviation-components/src/`)

- `src/config.ts` `HELP_BASE_URL` points at
  `https://open-aviation-solutions.github.io/open-aviation-components`.
- A new npm version is released that contains the change.

### Cross-cutting

- The in-component `?` help button, on at least one component embedded
  external to the components docs site (e.g. inside a briefings slide
  deck, or a hand-rolled test page using the newly-released library
  build), opens the correct
  `open-aviation-solutions.github.io/open-aviation-components/<slug>/`
  page in a new tab.
- The deployment sequence in Q8 is followed (docs site lands before
  the library release) so no help button is ever left pointing at a
  404. The website change can ship in parallel because it no longer
  imports the library.

## Out of scope

- Server-side redirects from the old website URLs to the new
  components docs site URLs (per Q6 — branded 404 is good enough for
  now; revisit if analytics from task 0003 disagrees).
- Restyling or redesign of the components docs site beyond
  re-ordering content on the per-component pages. Visual polish is a
  separate task.
- Adding new components, removing existing components, or changing
  what the components themselves do. This task only changes
  documentation surface and the help-link target.
- Updating any embed of these components in the briefings repository
  — the briefings continue to work; their pinned components version
  will pick up the new help-link target on the next routine bump.
- Anything from task 0003 (analytics) or task 0004 (design system
  integration).
