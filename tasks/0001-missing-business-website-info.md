# Add the standard business-website content the site is missing

**Status:** ready

## Purpose

The current site is a thin shell: a homepage with four "currently building"
cards, a learning-components index, and two component demo pages. It's
missing the conventional business-website surface area — the pages a
visitor (or a regulator, or a prospective client) expects to find on the
site of a real Australian business.

This task scopes *what* should exist before deciding *how* it lands.
The end goal is a site that can credibly represent Open Aviation
Solutions as a business: identifiable owner, traceable ABN, lawful
treatment of any personal info collected, and clear pointers to the
licences governing the open materials being offered.

Out of scope for this task: filling in the existing card bodies (e.g.
the "Open briefing and training materials" card has no link yet —
that's a content task, not a business-info gap).

## Current state

```
src/content/docs/
├── index.mdx                     # homepage (splash)
└── learning-components/
    ├── index.mdx
    ├── four-forces.mdx
    └── climb-performance.mdx
```

Site-wide chrome (`astro.config.mjs`):

- `social: [{ github }]` — single external link.
- `sidebar` — only "Learning components".
- No custom `Footer` component (Starlight default footer renders the
  edit link and "Last updated" only).
- No `<head>` extras beyond Starlight defaults.

Things a visitor cannot currently find on the site:

| Missing | Why it matters |
|---|---|
| About / who-runs-this page | Trust; transparency is a stated ethos. |
| Contact page (email, ABN) | Reachability; ABN display is conventional for AU businesses. |
| Privacy policy | Will be required once analytics/ads are added (see Q3). |
| Terms of use / website terms | Limits liability; sets expectations around the free-to-use materials. |
| Licensing page | The components LICENSE (MPL) lives in the GitHub repo and isn't linked or explained on the site. Linking directly to the MPL text is confusing for visitors not already familiar with open-source licensing. |
| Footer with the above + copyright + ABN | Conventional placement; one-click reachable from every page. |
| Accessibility statement | DDA 1992 / WCAG hygiene; honest disclosure of known gaps. |

## Business identity (resolved)

Per ABR lookup of ABN `96 917 566 113`
([abr.business.gov.au](https://abr.business.gov.au/ABN/View?abn=96917566113)):

- **Entity name (legal):** Nelson, Michael Andrew
- **Entity type:** Individual / Sole Trader
- **Registered business name:** Open Aviation Solutions (registered 2026-04-24)
- **ABN:** 96 917 566 113 (active from 2026-01-01)
- **GST:** not currently registered

This is the wording to use in the footer and `/contact/`. The ABN
should be shown in the conventional spaced format (`96 917 566 113`).

## Discussion

### Q1. ABN display — required, or just convention?

There is no general legal requirement to publish an ABN on a website.
Drivers are: tax invoices (must show ABN if/when issued); trust
signal for visitors; convention for AU businesses operating under a
registered business name.

**Decision:** display the ABN in the site footer and on the contact
page. ABN is `96 917 566 113`, ready to publish.

### Q2. Sole trader vs. registered business name vs. company

**Decision:** sole trader (Michael Andrew Nelson) trading as the
registered business name "Open Aviation Solutions". Footer copyright
line should read along the lines of:

> © 2026 Michael Nelson, trading as Open Aviation Solutions · ABN 96 917 566 113

Exact wording is a drafting decision for implementation, but the
three components (legal name, registered business name, ABN) all
need to appear together at least once.

### Q3. Privacy policy — required?

The site does not currently fall under the Privacy Act 1988
thresholds (turnover < $3M, no health/credit data, etc.), but:

- **Analytics is planned.** Once an analytics tool is added, the
  policy stops being optional in spirit even if the Act technically
  doesn't bind a sole trader of this size.
- **Ads are planned on the free component pages.** Third-party ad
  scripts add cookies, fingerprinting, and cross-site tracking — the
  same content is what GDPR/CCPA-style notices target.

**Decision:** publish a minimal honest privacy policy now. Cover:

- What the site itself collects today (GitHub Pages access logs;
  nothing else as of this task).
- That analytics will be added in future and the policy will be
  updated *before* it ships, naming the provider and what data it
  receives.
- That ads may appear on learning-component pages in future and the
  policy will be updated *before* they ship, naming the network and
  flagging that ad cookies are out of Open Aviation Solutions'
  direct control.
- A contact route for any privacy question (the email from Q8).

**Implication for downstream tasks:** updating `/privacy/` is a
hard precondition for the analytics task and for the
ads-on-components task — neither should ship without that update.
Worth flagging in those task files when they are written.

### Q4. Terms of use — separate page, or fold into licensing?

The two are distinct:

1. **Website terms of use** — governs use of the site itself
   ("provided as-is", "no warranty", links to third parties not
   endorsed, jurisdiction).
2. **Content/code licences** — governs reuse of the learning
   materials and software.

**Decision:** two topics, two new pages.

- **`/terms/`** — site terms-of-use page. New.
- **`/licensing/`** — licensing-overview page. New.

  Linking directly to the MPL text from the homepage is confusing
  for visitors who aren't already involved in open-source software:
  they land on a long legal document with no framing for *why* it
  matters or *what* "free forever" means in practice. The
  licensing page absorbs that framing.

  Page should cover, in plain language:
  - A short background on open-source licensing — what it is, why
    Open Aviation Solutions uses it, what "free forever, with a
    catch" actually means (improvements flow back to the
    community).
  - A note that licensing is **per repository**: each open-source
    repository under the Open Aviation Solutions GitHub
    organisation carries its own `LICENSE` file, and that file is
    the authoritative source for that body of work.
  - A list of currently-published repositories with the licence
    each uses and a link to the in-repo `LICENSE` file. As of this
    task, the only entry is:
    - `open-aviation-components` — Mozilla Public License 2.0
      (MPL-2.0). Link the licence name to the LICENSE file in the
      repo (e.g. `github.com/open-aviation-solutions/open-aviation-components/blob/main/LICENSE`).
  - A short plain-language summary of what MPL-2.0 means for a
    typical visitor (free to use, free to modify, modifications to
    MPL-licensed *files* must be shared back; non-MPL files in the
    same project are not affected). Include a clear "this summary
    is informational, the LICENSE file is authoritative" caveat.
  - A line acknowledging that the briefing materials, software
    libraries, and VR-rig work mentioned on the homepage haven't
    chosen licences yet, and the page will be updated as each
    body of work lands.

  The page must stay maintainable as more repositories are
  published — i.e. structured so that adding a new repo is
  appending one row/entry, not rewriting prose.

- **Homepage link target changes:** the "Reusable learning
  components" card's "Licensed to be free forever" phrase links to
  `/licensing/` (not the MPL file directly). The licensing page
  then links onward to the in-repo LICENSE.

- The other cards ("Open briefing training materials", "Open
  software libraries", VR rigs) describe work not yet shipped, and
  their licences haven't been chosen yet — leave their "free
  forever" phrasing un-linked for now and revisit when each body
  of work lands.

### Q5. Accessibility statement

**Decision:** include a short accessibility statement. Either a
dedicated `/accessibility/` page or an "Accessibility" section on
`/about/` — implementer's choice, lean toward the section on
`/about/` to keep the page count down. State what's been
considered, that the WebGL learning components have no equivalent
text alternative yet (known gap), and a contact route for
accessibility issues.

### Q6. Footer — build a custom one, or extend Starlight's defaults?

**Decision:** add `src/components/Footer.astro` and wire it via
`components.Footer` in `astro.config.mjs` (same pattern already
used for `SiteTitle` and `Hero`).

### Q7. Sidebar vs. footer for the new pages

**Decision:** keep About / Contact / Privacy / Terms out of the
left sidebar. Surface them via the footer only. The sidebar
remains focused on learning content.

### Q8. Contact mechanism — email link, form, or both?

**Decision:** start with a `mailto:` link only. Email address:
`openaviation.solutions@gmail.com`. Revisit a form if email
proves unworkable.

### Q9. Spam Act / CAN-SPAM — relevant?

No bulk email planned. No action this task.

### Q10. Open Graph / social cards / SEO basics

Tracked separately. See `tasks/0002-seo-and-social-metadata.md`.

## Acceptance criteria

- New pages exist and are reachable from a site-wide footer:
  - `/about/` — who runs Open Aviation Solutions, the ethos,
    accessibility statement section (per Q5).
  - `/contact/` — email (`openaviation.solutions@gmail.com`), legal
    name, registered business name, ABN.
  - `/privacy/` — minimal honest policy per Q3, including the
    update-before-shipping commitments for analytics and ads.
  - `/terms/` — website terms of use per Q4.
  - `/licensing/` — plain-language licensing overview per Q4,
    including the per-repository structure and the
    `open-aviation-components` MPL-2.0 entry linking to the
    in-repo LICENSE file.
- `src/components/Footer.astro` overrides Starlight's footer and
  shows: copyright line tying together legal name, registered
  business name, ABN, and current year; links to About, Contact,
  Privacy, Terms, Licensing; existing GitHub link.
- ABN appears in footer and on `/contact/` in the spaced format
  `96 917 566 113`.
- Homepage card "Reusable learning components" → the phrase
  "Licensed to be free forever" links to `/licensing/` (per Q4).
  Other cards' "free forever" phrasing is left un-linked for now.
- New pages do *not* appear in the left sidebar (per Q7).
- All new copy uses the project voice: "I" rather than "we" (per
  `INSTRUCTIONS.md`).

## Out of scope

- OG image, `robots.txt`, `sitemap.xml`, structured data, branded
  404 — tracked in `tasks/0002-seo-and-social-metadata.md`.
- Contact form with a backend (per Q8).
- Mailing list / newsletter infrastructure (per Q9).
- Filling in the other homepage cards (e.g. linking "Open briefing
  and training materials" to actual materials).
- Adding analytics or ads. Both require a `/privacy/` update *first*
  (per Q3) and are separate tasks.
