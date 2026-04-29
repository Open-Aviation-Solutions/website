# Add site analytics, and (separately) ads on learning-component pages

**Status:** proposal

## Purpose

Sibling to `0001-missing-business-website-info.md` and
`0002-seo-and-social-metadata.md`. Those tasks cover identity and
discoverability. This one covers two related-but-separable
follow-ups that both involve third-party scripts and both depend
on the privacy-policy update committed to in task 0001 Q3:

1. **Analytics across the whole site** — to know which pages are
   used, where visitors come from, and whether the components are
   actually being reached.
2. **Ads on the learning-component pages only** — a possible (not
   yet committed) revenue stream against the highest-cost pages to
   serve, deliberately scoped *off* the marketing/business surface
   (homepage, About, Contact, Privacy, Terms).

These are bundled into one task because the privacy-policy
preconditions, the consent question, and the script-loading
infrastructure overlap. They could split into two tasks at
implementation time if scope grows.

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
| Cloudflare Web Analytics | No | Low | Free | Requires Cloudflare in front of the site (currently GH Pages, no CF). |
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

If ads are also enabled (see Q6 onward), the ad network's cookies
will *force* a consent banner regardless of the analytics choice.
That's the dominant factor.

**Recommendation:** if Q1 picks a no-cookie analytics tool *and*
ads stay deferred, no banner is needed. If ads ship, a banner is
needed regardless of analytics. **Decision: contingent on Q1 + the
ads decision.**

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

## Discussion — ads on learning-component pages

### Q5. Scope — really only `/learning-components/*`?

The proposal is to keep ads off the homepage, About, Contact,
Privacy, Terms, and the learning-components *index*, and only show
ads on individual component pages (`/learning-components/four-forces/`,
`/learning-components/climb-performance/`, etc.).

Reasoning:

- Component pages are the highest-traffic, highest-utility pages
  for non-customers — a flight student running through a
  free interactive tool. They're also the most expensive to serve
  in compute terms (WebGL). If anything is going to carry ads, it's
  these.
- The marketing/business pages convert visitors into trust. Ads
  there cheapen the brand at the exact moment a school is
  evaluating the operation.
- The licensing promise on the homepage is "free forever" — that
  doesn't preclude ads, but the chosen ads should never appear on
  the page making that promise.

Implementation: a per-route check in a layout override, or a
`<slot name="ad">` wired only into the component-page wrappers.
The MDX pages that embed the components already share a structure
(import an `.astro` wrapper, render it) — easy to add a banner
slot above or below.

**Recommendation:** keep the scope tight as proposed. **Likely
agreed.**

### Q6. Network — AdSense vs. dev-friendly networks vs. direct

| Option | Fit | Notes |
|---|---|---|
| Google AdSense | High inventory, broad fill | Requires a privacy policy (covered by task 0001), a minimum-content review, cookie consent under GDPR, and brings the most cross-site tracking. Lowest CPM unless niche. |
| Carbon Ads | Tech/dev audience | Likely a poor audience match — flight students aren't Carbon's targeted segment. |
| EthicalAds | Open-source / docs-site audience | Better ethics story, but again audience match is iffy. |
| Direct sponsorships (e.g. flight schools, headset makers, logbook tools) | Best audience match; best brand fit | Requires sales effort the operation may not have time for early. |
| Affiliate links (Amazon, headset retailers) within the component-page copy | No script weight; no consent banner | Different shape from "ads"; could substitute or coexist. |

**Recommendation:** *don't ship a generic ad network as the first
move.* The audience-match argument and the brand-promise argument
both push toward direct sponsorships or curated affiliate links
once there's enough traffic to be interesting. AdSense is a
fallback if direct/affiliate doesn't materialise. **Decision
needed:** is the goal here revenue, or floor-checking that ads can
work at all? The first wants direct/affiliate; the second wants
AdSense.

### Q7. Performance budget

The component pages run WebGL via `three`. An ad script (especially
AdSense) runs hundreds of KB of JS, fetches creatives, and
schedules its own render work — all on the main thread that the
WebGL components are also using. Realistic outcomes:

- First contentful paint: barely affected (ad slot can be lazy /
  below the fold).
- Component interactivity: noticeably degraded if the ad script
  blocks the main thread during component init.
- Battery on phones / Chromebooks (which is the actual student
  hardware): meaningful hit.

**Recommendation:** any ad implementation must lazy-load (defer
until the component is interactive) and live below the component
on the page, not above it. Treat the component's responsiveness as
the budget; if the ad measurably degrades it, drop the ad — the
page's purpose is the learning, not the ad. **Likely agreed.**

### Q8. Consent banner — definitely required if ads ship

AdSense and any general-purpose ad network drop cookies and run
cross-site tracking. That requires consent under GDPR, and it's
the conventional norm in AU even where the Privacy Act doesn't
strictly bind a small operator. If ads ship, a banner ships with
them.

**Decision deferred to the ads-go/no-go call.** If ads are
deferred (see Q6), no banner is needed.

### Q9. AdSense approval prerequisites

If Q6 lands on AdSense (now or later), AdSense's review wants:

- A privacy policy (covered by task 0001; needs an ads-specific
  paragraph added in this task).
- "Substantial original content" — the bar is informal but the
  current two component pages may not clear it. Better to wait
  until 4–6 component pages exist plus the briefing-materials
  body of work is started.
- A clear "About" / contact (covered by task 0001).

**Implication:** even if AdSense is the eventual choice, applying
*now* is premature. **Recommendation: revisit AdSense after the
content surface grows.**

### Q10. ACMA / advertising standards

Australian advertising self-regulation (AANA Code of Ethics, ACMA
oversight) puts obligations on the *advertiser*, not the publisher,
in most cases — but a publisher can be on the hook for ads
involving prohibited content, false claims, or targeting children.
For a flight-training audience served via a mainstream ad network,
the residual risk is low but not zero.

**Recommendation:** if/when ads ship, configure the network's
content-category filters to exclude gambling, alcohol, and adult
content; review served creatives periodically. **Likely agreed.**

### Q11. Adblock — detect, fallback, or ignore?

Adblock-detection scripts are user-hostile and arguably break
under EU/AU norms around dark patterns. Ignoring adblock is the
conventional choice for a content site that isn't ad-dependent.

**Recommendation:** ignore adblock. **Likely agreed.**

## Provisional acceptance criteria

(Subject to Q1 / Q6 decisions; this task may end up shipping in
two PRs — analytics first, ads later or never.)

**Analytics:**

- An analytics provider chosen per Q1 is wired into `<head>` via
  Starlight's `head` config in `astro.config.mjs`.
- `/privacy/` updated to name the provider, what's collected, and
  what isn't — landing in the same PR as the script.
- If a no-cookie provider is chosen, no consent banner is added.
- Verified working on the deployed site (a test page view shows
  up in the provider dashboard).

**Ads (only if proceeding past Q6):**

- Ads scoped to individual learning-component pages only —
  *not* the index, *not* any other route.
- Implementation lazy-loads the ad and places it below the
  interactive component (per Q7).
- Consent banner added (per Q8) covering both ads and any
  cookie-using analytics that may be in play.
- `/privacy/` updated again with the ad network details and
  cookie disclosure.
- Network category filters configured to exclude gambling /
  alcohol / adult (per Q10).
- A measurable performance check (Lighthouse score on the
  component pages before/after) confirms the ad hasn't
  meaningfully regressed component interactivity.

## Out of scope

- Direct sponsorship sales / affiliate program selection — those
  are sales/business decisions, not engineering tasks. Note them
  as the preferred long-term path (per Q6) and revisit
  separately.
- A full consent-management platform (CMP) with vendor lists —
  overkill until the ad network demands it.
- Newsletter signup / email capture (task 0001 Q9 already noted
  this is not in plan).
- Heatmaps / session-recording tools (Hotjar, FullStory, etc.).
  Different privacy posture; not part of this task.
