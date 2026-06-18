# Resolve "Crawled — currently not indexed" in Google

**Status:** investigated — fix plan ready, owner actions pending

## Purpose

Follow-up to the now-complete `archived/0002-seo-and-social-metadata.md`.
That task delivered the *discoverability markup* (sitemap, robots, OG
tags, `Organization` JSON-LD). This task covers the next problem that
surfaced once the site was submitted to Google: the site is verified and
crawled in Search Console, but the homepage reports **"Crawled —
currently not indexed"** (observed 2026-06-18).

## What this status means

Google fetched the page, evaluated it, and *chose not to index it (yet)*.
It is not a crawl block or a markup error — it is Google deferring the
indexing decision. For a site smaller than ~1M pages this is almost
always about **crawl demand / site-quality signals**, not crawl budget or
a technical fault.

## Technical prerequisites — all verified PASS

Audited the live site on 2026-06-18; none of these is the cause:

| Check | Result |
|---|---|
| `robots.txt` allows crawling, points at sitemap | PASS — `Allow: /` + `Sitemap:` line |
| `sitemap-index.xml` / `sitemap-0.xml` reachable (HTTP 200) | PASS — 11 URLs listed |
| `<meta name="robots">` noindex present? | PASS — no noindex anywhere |
| Self-referencing canonical | PASS — `<link rel="canonical" href="https://openaviation.solutions/">` |
| Content server-rendered (not JS-only) | PASS — full HTML body in initial response |
| Open Graph / Twitter tags | PASS — title, description, image all present |
| `Organization` JSON-LD | PASS — emitted site-wide |

So the markup from task 0002 did its job. The blocker is external
signals, not tags.

## Most likely causes (in order)

1. **Site newness + near-zero authority.** The domain has essentially no
   inbound links and no history. Google routinely parks new sites in
   "Crawled — currently not indexed" for days-to-weeks while it decides
   whether the site is worth indexing. Time + signals resolve it.
2. **No inbound links.** Nothing on the web points at
   `openaviation.solutions`, so Google has no external signal that the
   page matters. This is the single highest-leverage lever available.
3. **Thin pages dilute site-level quality.** Two pages are very thin and
   read as placeholders: `open-aviation-software.mdx` (~82 words) and
   `vr-simulator-setups.mdx` (~79 words). Site-quality assessment is
   holistic — thin/placeholder pages drag the whole domain's perceived
   value down, which feeds back into the homepage indexing decision.
4. **Internal linking depth is shallow** (small site, mostly hub pages).
   Less critical here, but worth tightening.

## Plan to fix

Ordered by leverage. (1) and (2) are the ones that actually move the
needle; the rest are hygiene.

1. **Request indexing manually.** In Search Console → URL Inspection,
   enter `https://openaviation.solutions/` and click **Request
   Indexing**. Repeat for the key hub pages (`/about/`,
   `/open-aviation-components/`, `/open-aviation-briefings/`). This nudges
   Google to re-evaluate rather than waiting for the next organic crawl.
   *Manual step — owner action in Search Console.*

2. **Earn the first inbound links.** Both assets the owner mentioned are
   directly useful here:
   - **`liveandletlearn.net`** (personal site): add a real, contextual
     link to `openaviation.solutions` — e.g. an "About / projects" or
     "what I'm working on" mention. A link from an established,
     already-indexed domain is the strongest discovery+trust signal we
     can manufacture ourselves. Highest priority.
   - **LinkedIn company page** for openaviation.solutions: populate it,
     set the website field to `https://openaviation.solutions`, and make
     a first post linking to the site. LinkedIn links are `nofollow` so
     they pass little ranking weight, but they aid *discovery* and lend
     brand-consistency signals (the page becomes part of the entity
     Google associates with the domain, reinforcing the `Organization`
     JSON-LD). Worth doing, secondary to the liveandletlearn link.
   - Other low-cost options to consider over time: the GitHub org
     profile/README, and any flight-training community/forum where a link
     is genuinely on-topic (no spamming).

3. **Thicken the two placeholder pages** (`open-aviation-software.mdx`,
   `vr-simulator-setups.mdx`) so every indexed URL clearly earns its
   place, or temporarily drop them from the sitemap until they have
   substance. Removing thin pages from the index can *raise* the site's
   average quality signal. *Recommend: expand rather than remove, since
   both are real planned offerings.* (Possible separate content task.)

4. **Tighten internal linking** so the hub pages cross-reference each
   other in body copy, not just the sidebar — gives Google clearer
   contextual signals about each page.

5. **Minor head-tag polish** (cosmetic, does not affect indexing but
   worth a small follow-up):
   - Homepage `<title>` renders as `Open Aviation Solutions | Open
     Aviation Solutions` (page title duplicates site name). Starlight
     default; can be de-duplicated.
   - Homepage emits `og:type=article`; `website` is more correct for the
     landing page. Starlight default.

6. **Then wait and re-check.** After (1)–(2), give it 1–2 weeks and
   re-inspect in Search Console. Do not expect instant indexing; the
   correct success signal is the homepage (and hubs) moving to "Indexed."

## Acceptance criteria

- Manual "Request Indexing" submitted for homepage + key hubs.
- At least one genuine inbound link live from `liveandletlearn.net`.
- LinkedIn page published with website field set and a first post linking
  to the site.
- Homepage shows "Indexed" in Search Console on re-check (the real
  outcome — may lag the actions by 1–2 weeks).

## Out of scope

- Per-page OG images / generator (deferred from task 0002).
- Expanding the thin pages into full content (separate content task if
  pursued beyond a stub).
- Paid link-building or any link scheme — only genuine, on-topic links.
