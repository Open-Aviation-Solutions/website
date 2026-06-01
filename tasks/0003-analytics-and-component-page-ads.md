# Add site analytics

**Status:** proposal

## Purpose

Sibling to `0001-missing-business-website-info.md` and
`0002-seo-and-social-metadata.md`. Those tasks cover identity and
discoverability. This one adds analytics across the whole site — to
know which pages are used, where visitors come from, and whether
the components are actually being reached.

**Note:** ads on learning-component pages were originally bundled
here but are no longer being pursued. Individual component pages
are being replaced by an overview-only page (see task 0005).

## Dependencies

- **Hard:** task 0001 must have shipped a `/privacy/` page first.
  This task updates that page; it does not create it.
- Soft: task 0002's `Organization` JSON-LD and footer pieces don't
  block this task but should land first to keep the `<head>`
  changes ordered cleanly.

## Current state

- No analytics installed. Visitor counts and traffic sources are
  unknown.
- No ad scripts. No ad networks signed up for.
- No cookie banner, no consent management.
- The learning-component pages (`/learning-components/*`) load WebGL
  via `three` and the `@open-aviation-solutions/components` package
  — they are already the heaviest pages on the site. Any ad script
  competes with that workload on the main thread.
- Astro/Starlight's per-route layout seam is the natural place to
  scope "ads on this URL prefix only" (see Q5).

## Discussion — analytics

### Q1. Which analytics provider?

Trade-off axes: privacy story, cookie/consent burden, cost,
quality of data, ease of install on a static GitHub Pages site.

| Option | Cookies? | AU/EU consent burden | Cost | Notes |
|---|---|---|---|---|
| Google Analytics 4 | Yes | High — needs banner | Free | Best-known, worst privacy story; ad-tech adjacency. |
| Plausible (hosted) | No | Low | ~$9/mo | Privacy-friendly; aggregate only; one script tag. |
| Plausible (self-host) | No | Low | Server cost | More moving parts than this site otherwise has. |
| Umami (hosted or self) | No | Low | Free self-host / paid hosted | Similar to Plausible. |
| Cloudflare Web Analytics | No | Low | Free | JS beacon works on any site — no proxy/DNS changes needed. Also has a proxy-based mode if Cloudflare is in front. |
| Fathom | No | Low | ~$15/mo | Similar to Plausible. |
| Server-log only | n/a | None | Free | GH Pages doesn't expose access logs to the repo owner — not viable here. |

**Recommendation:** Plausible (hosted). It pairs cleanly with the
"transparency / open" ethos, avoids a cookie banner under both
Australian and EU norms, and the data is good enough for the
questions actually being asked ("are people finding the
components?"). One `<script>` tag in the site `<head>`. **Decision
needed.**

### Q2. Consent banner — needed?

Depends on Q1.

- A no-cookie analytics tool (Plausible / Umami / Cloudflare /
  Fathom) does not require a consent banner under GDPR, and AU
  guidance is at least as permissive.
- GA4 effectively requires a banner for any EU traffic and is
  increasingly expected even for AU-only sites.

Ads are no longer in scope, so the analytics choice is the only
factor.

**Recommendation:** pick a no-cookie analytics tool (see Q1) and
no banner is needed. **Decision: contingent on Q1.**

### Q3. What `<head>` seam to use?

Task 0002 covers Starlight's `head` config option. Same seam works
here — add the analytics script via `head` in `astro.config.mjs`.

**Recommendation:** site-wide `<script>` injected via the `head`
config. **Likely agreed.**

### Q4. Privacy-policy update

Whatever Q1 picks, the `/privacy/` page (created in task 0001) must
name the provider, link to its privacy policy, state what the site
does and doesn't see (e.g. "aggregate page-view counts; no IP
storage; no cross-site tracking"), and update the date. This update
is a **precondition** for the analytics script going live, not a
follow-up to it.

**Decision:** privacy update lands in the same PR as the analytics
script and gates the merge.

## Provisional acceptance criteria

- An analytics provider chosen per Q1 is wired into `<head>` via
  Starlight's `head` config in `astro.config.mjs`.
- `/privacy/` updated to name the provider, what's collected, and
  what isn't — landing in the same PR as the script.
- No consent banner needed (cookieless provider).
- Verified working on the deployed site (a test page view shows
  up in the provider dashboard).

## Out of scope

- Ads — no longer being pursued; individual component pages are
  being replaced by an overview-only page (task 0005).
- Newsletter signup / email capture (task 0001 Q9 already noted
  this is not in plan).
- Heatmaps / session-recording tools (Hotjar, FullStory, etc.).
  Different privacy posture; not part of this task.
