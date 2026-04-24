# Learning Components Documentation

The pages in this directory are written for **non-technical pilot instructors and learners** who want to explore and use the interactive learning components. Content should be accessible to someone with no programming knowledge.

- Explain what each component does and how to use it interactively
- Avoid implementation or integration details
- Focus on the aviation concepts the component illustrates

Technical instructions for embedding these components in your own site are on the component library's documentation site: https://open-aviation-solutions.github.io/open-aviation-components/

## Page structure

Each component page follows this order:
1. Frontmatter (`title`, `description`)
2. One-paragraph prose intro — what the component shows
3. Component import and embed (wrapper from `src/components/`)
4. Short explanation of the interactive controls
5. `## For instructors` — ground briefing use cases
6. `## For trainees` — self-study exercises
7. Footer link to the source docs at open-aviation-solutions.github.io/open-aviation-components/

## Index page

New components need:
- An entry in `index.mdx`: screenshot (floated right, 50% width) wrapped in a link, short description, "Explore X →" link
- A sidebar entry in `astro.config.mjs` under Learning components

Screenshots go in `src/assets/` named `{component-name}-screenshot.png`.

## Note on this file's name

Named `_INSTRUCTIONS.md` (not `INSTRUCTIONS.md`) because this directory is inside Astro's content collection — the underscore prefix tells Astro to ignore it. The `.claude/CLAUDE.md` symlink still loads it correctly.
