// One-shot script: render public/og-image.png (1200x630) from an inline SVG.
// Run via `node scripts/generate-og-image.mjs`. Re-run when the brand changes.
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

const logoSvg = await readFile(join(repoRoot, 'src/assets/logo-mark-dark.svg'), 'utf8');
const logoInner = logoSvg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1];

// ---- Card geometry (1200x630) -------------------------------------------
// The lockup mirrors the homepage hero: the circle mark on the left, the
// "Open Aviation" / "Solutions" wordmark stacked to its right with the top of
// the caps on the ring's top edge and the baseline of "Solutions" on the
// ring's bottom edge, then the tagline below the whole logo sharing the ring's
// left edge.
const MARGIN_X = 90; // shared left edge: ring, tagline and URL all start here
const CAP_RATIO = 0.72; // Barlow bold cap-height as a fraction of font-size

// Logo mark source geometry (logo-mark-dark.svg, viewBox 0 0 175 175):
// the outer ring is cx/cy 87.5, r 85.5, so its visual bounds run 2..173.
const RING_MIN = 2; // left/top edge of the outer ring, in source units
const RING_DIAM = 171; // outer ring diameter, in source units

// Logo mark placement.
const markScale = 1.15;
const ringTop = 118; // ring's top edge on the canvas
const markX = MARGIN_X - markScale * RING_MIN; // puts ring left edge on MARGIN_X
const markY = ringTop - markScale * RING_MIN;
const ringDiam = markScale * RING_DIAM;
const ringBottom = ringTop + ringDiam;
const ringRight = MARGIN_X + ringDiam;

// Wordmark: caps top on the ring top, "Solutions" baseline on the ring bottom.
const titleSize = 112;
const titleX = ringRight + 46;
const titleBaseline1 = ringTop + CAP_RATIO * titleSize;
const titleBaseline2 = ringBottom;

// Tagline: below the whole logo, left edge on MARGIN_X.
const taglineSize = 34;
const taglineTop = ringBottom + 64; // cap top
const taglineBaseline1 = taglineTop + CAP_RATIO * taglineSize;
const taglineBaseline2 = taglineBaseline1 + 44;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0d1117"/>
  <rect x="0" y="0" width="1200" height="6" fill="#1a5fb4"/>
  <g transform="translate(${markX.toFixed(2)}, ${markY.toFixed(2)}) scale(${markScale})">
    ${logoInner}
  </g>
  <g font-family="'Barlow', 'Helvetica Neue', Arial, sans-serif">
    <text x="${titleX.toFixed(1)}" y="${titleBaseline1.toFixed(1)}" font-size="${titleSize}" font-weight="700" fill="#ffffff">Open Aviation</text>
    <text x="${titleX.toFixed(1)}" y="${titleBaseline2.toFixed(1)}" font-size="${titleSize}" font-weight="700" fill="#4a8be8">Solutions</text>
    <text x="${MARGIN_X}" y="${taglineBaseline1.toFixed(1)}" font-size="${taglineSize}" font-weight="400" fill="#b0bccf">Improving pilot safety with open training</text>
    <text x="${MARGIN_X}" y="${taglineBaseline2.toFixed(1)}" font-size="${taglineSize}" font-weight="400" fill="#b0bccf">resources and open-source tooling.</text>
  </g>
  <text x="${MARGIN_X}" y="585" font-family="'Barlow', 'Helvetica Neue', Arial, sans-serif"
        font-size="24" font-weight="500" fill="#7a8599">
    openaviation.solutions
  </text>
</svg>`;

const outPath = join(repoRoot, 'public/og-image.png');
await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`Wrote ${outPath}`);
