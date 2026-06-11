# Add real photography to the site

**Status:** proposed — investigation done, photos need to be taken/sourced

## Purpose

The site is functional and the information is improving, but it is
text-only apart from the logo mark and two externally hosted component
screenshots. Real photographs (no AI-generated imagery) would give the
site a human touch that matches its ethos: a one-person operation built
on real teaching practice. Authentic photos of actual flying, briefing
and simulator activity reinforce that better than stock imagery could.

## Current state

An audit of the theme found these image surfaces, in rough order of
visual impact:

| Surface | Where | Current state |
|---|---|---|
| Hero image | `src/components/Hero.astro` + `hero.image` frontmatter in `index.mdx` | **Unused.** The component already supports it — on desktop the hero reserves a 4fr right column (~25rem wide) that is currently empty. |
| Feature cards | `src/components/FeatureCard.astro` (4 cards on the homepage) | Text-only. No image support in the component yet. |
| Page-body images | Any `.mdx` in `src/content/docs/` via `astro:assets` | Only the two component screenshots on `open-aviation-components.mdx`, hosted on the components docs site. |
| Social card | `public/og-image.png` | Exists (task 0002); presumably logo/text based. Could be refreshed with a photo background once one exists. |

Notes from the audit:

- **Hero**: `Hero.astro` handles `image.file`, `image.dark`/`image.light`
  variants, or raw HTML — all standard Starlight frontmatter, zero code
  needed. It renders at 400×400 with `object-fit: contain`, so a square
  or near-square crop works best as-is; switching to a wider
  aspect/`cover` treatment is a small CSS change if a landscape photo
  works better.
- **Feature cards**: the cleanest approach is an optional `image` prop
  on `FeatureCard.astro` rendering a fixed-aspect (16:9) image at the
  top of the card, above the title. Avoid CSS *background* images
  behind the text — legibility suffers in both themes and the cards
  carry real copy.
- **Assets** belong in `src/assets/` (Astro optimises at build time and
  emits responsive formats), not `public/`.
- The site has dark and light themes; photos generally work in both,
  but check each candidate against both backgrounds (`#0d1117` /
  `#f0f0eb`).
- Every image needs genuine alt text — the site has an accessibility
  page and should live up to it.

## Recommended photos to create

All of these are photos the author can take during normal flying and
training activity — no stock or AI imagery needed:

1. **Hero (highest impact):** a GA training aircraft — on the apron in
   good light, or a wing-and-horizon shot from the cockpit. Something
   that says "real Australian flight training" at a glance. A
   dark/light pair is supported but a single photo that works on both
   themes is simpler.
2. **Briefings card / page:** a briefing in progress — whiteboard with
   a lesson diagram, or a laptop/screen showing a briefing slide in a
   briefing room. Alternatively a kneeboard with the in-flight notes
   clipped in, photographed in the cockpit (ties directly to the
   product).
3. **VR simulator card / page:** the actual consumer VR rig being
   documented — headset, controls, desk setup. This page is "coming
   soon", so a real photo of the real rig is both the card image and
   the future page's lead image.
4. **Components card:** the existing four-forces screenshot already
   works here (it is a screenshot of real software, not AI art) —
   reuse it rather than forcing a photo.
5. **Software card:** least photogenic; fine to leave text-only rather
   than use a generic "laptop with code" shot.
6. **About page:** a photo of the author — with the aircraft or in the
   cockpit. The site's voice is explicitly first-person and
   transparency about the solo operation is core to the ethos; a real
   face supports that more than anything else on this list.

## Implementation steps (once photos exist)

1. Add the hero photo to `src/assets/` and reference it via
   `hero.image` frontmatter in `index.mdx`; adjust `Hero.astro` sizing
   if a non-square crop is chosen.
2. Add an optional `image`/`imageAlt` prop to `FeatureCard.astro` and
   wire up the briefing and VR cards (components card can use the
   existing screenshot URL or a locally committed copy).
3. Add the about-page photo inline via `astro:assets` `<Image>`.
4. Optionally refresh `public/og-image.png` with the hero photo as a
   background (keep 1200×630).
5. Verify both themes, mobile layout (hero image stacks above the
   title below 50rem), and alt text on every image.

## Out of scope

- AI-generated imagery (explicitly excluded).
- Embedding the interactive components themselves (see task 0005 —
  screenshots only on this site).
- Per-page Starlight banners (text-only feature, not an image surface).
