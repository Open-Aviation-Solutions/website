# Integrate design system into website

**Status:** proposal

## Purpose

The design system (`../design-system`) defines brand tokens, hover states, border radii, shadows, transitions, icon guidance, and voice/tone rules that are not yet fully applied in the website's custom CSS and content. This task tracks the remaining integration work.

The dark/light logo variants are already implemented (done in the same commit that created this task).

## Already implemented

- Barlow font (400/500/600/700 weights) — currently via Google Fonts CDN; see item 5 for self-hosting
- GNOME Blue `#1a5fb4` as accent; `#4a8be8` high; `#0a2050` low
- Dark background `#0d1117`, nav `#090d16`, sidebar `#0c1526`
- Light background `#f0f0eb`, nav `#ffffff`, sidebar `#e8e8e2`
- Hairline border color CSS variables (`--sl-color-hairline`)
- Logo mark in header (`SiteTitle.astro`) and homepage hero (`Hero.astro`)
- Dark mark variant (`logo-mark-dark.svg`) shown in dark mode via `light:sl-hidden` / `dark:sl-hidden`

## Remaining work

### 1. Hover and press states

The design system specifies:

- **Links:** accent shifts to `#114478` on hover in light mode; `#4a8be8` (already the high-accent) or `#6aabff` in dark mode.
- **Buttons:** background darkens 8% on hover, ~12% on press. No scale transform.
- **Cards:** border-colour intensifies on hover; no box-shadow lift.

`custom.css` sets the accent variables but does not yet override Starlight's link hover or button interaction colours explicitly. Audit Starlight's generated CSS and add targeted overrides where the defaults differ.

### 2. Border radii

Design system values: `4px` (inputs, chips), `6px` (buttons), `8–10px` (cards). Starlight uses its own `--sl-border-radius` tokens. Override them in `custom.css`:

```css
:root {
  --sl-border-radius: 6px;   /* buttons */
}
```

Chips/tags and cards may need individual rules if Starlight's defaults don't match.

### 3. Card shadows

The design system specifies `0 1px 2px rgba(0,0,0,.06)` for resting cards; nothing larger except modal/overlay surfaces. Verify that any `<Card>` components in the docs render with this shadow (or none) rather than Starlight's default.

### 4. Transition timing

Hover states should use a `120ms` transition on `opacity`, `border-color`, or `color`. If Starlight already animates these, check its timing against the spec; override if the default is longer/bouncier.

```css
a, button { transition: color 120ms, background-color 120ms, border-color 120ms; }
```

### 5. Self-host Barlow

Currently loaded from Google Fonts CDN, which is a privacy concern (third-party request logged per visitor). The design system does not ship font files. Use the same approach as `../open-aviation-lessons`:

1. Add `@fontsource/barlow` to `dependencies` in `package.json` and run `npm install`.
2. Create a symlink: `public/fonts -> ../node_modules/@fontsource/barlow/files`
3. Replace the `@import url(...)` in `custom.css` with `@font-face` blocks pointing to `/fonts/barlow-latin-{weight}-normal.woff2` for weights 400, 500, 600, and 700.

See `../open-aviation-lessons/themes/open-aviation-solutions/style.css` for the `@font-face` pattern and `../open-aviation-lessons/public/fonts` for the symlink. This removes the render-blocking third-party network request entirely.

### 6. Lucide icon setup

The design system says: for icons beyond Starlight's internal set, use [Lucide](https://lucide.dev) line icons (1.5–2px stroke, square caps, no fills, 14–20px body / up to 28px nav). No emoji, no Unicode pictographs.

If/when new icons are needed, use the Lucide CDN or install `lucide` as a dev dependency rather than reaching for an alternative library or emoji.

Document the chosen approach here once decided (CDN vs. npm install).

### 7. Voice and tone audit

The design system specifies:

- **"I"** when speaking for the company or its work (solo operation); **"we"** only for the broader community of pilots/learners.
- Australian spelling throughout (organisation, optimise, colour).
- Sentence case headings; Title Case reserved for brand name and component proper names (Four Forces, Climb Performance).
- Headlines do not end in periods; body sentences do.
- Bold used for one key phrase per paragraph — never to shout.

Audit all `.mdx` content pages against these rules. Pay particular attention to headings (check for Title Case) and any "we" references that mean the company rather than the community.

### 8. Imagery guidance

Images in docs must be real screenshots of the components at 16:9 or close — no decorative stock photography, no gradient backgrounds in component docs. This is a process rule for future content, but verify existing pages comply.

## Out of scope

- The slide deck template (`../design-system/slides/`) — separate project surface.
- The UI kit HTML (`../design-system/ui_kits/website/`) — already a reference artefact; no code changes needed in the site.
- Redesigning the Starlight layout (sidebar, ToC) — the design system works with Starlight as-is.
