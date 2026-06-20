// One-shot script: render public/og-image.png (1200x630) from an inline SVG.
// Run via `node scripts/generate-og-image.mjs`. Re-run when the brand changes.
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

const FONT = "'Barlow', 'Helvetica Neue', Arial, sans-serif";

const logoSvg = await readFile(join(repoRoot, 'src/assets/logo-mark-dark.svg'), 'utf8');
const logoInner = logoSvg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1];

// Rendered pixel width of a string, measured with the same renderer and font
// the card uses. Lets the tagline be fitted to the wordmark width exactly
// rather than guessed, so it stays correct if the wording changes.
async function textWidth(text, fontSize, weight) {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="400">
		<text x="10" y="200" font-family="${FONT}" font-size="${fontSize}" font-weight="${weight}" fill="#fff">${text}</text>
	</svg>`;
	const { data, info } = await sharp(Buffer.from(svg)).raw().toBuffer({ resolveWithObject: true });
	let minX = info.width, maxX = 0;
	for (let y = 0; y < info.height; y++) {
		for (let x = 0; x < info.width; x++) {
			if (data[(y * info.width + x) * info.channels + 3] > 10) {
				if (x < minX) minX = x;
				if (x > maxX) maxX = x;
			}
		}
	}
	return maxX - minX + 1;
}

// ---- Card geometry (1200x630) -------------------------------------------
// The lockup mirrors the homepage hero: the circle mark on the left, the
// "Open Aviation" / "Solutions" wordmark stacked to its right with the top of
// the caps on the ring's top edge and the baseline of "Solutions" on the
// ring's bottom edge, then the tagline on a single line below the whole logo,
// sharing the ring's left edge and fitted to the wordmark's right edge.
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
const wordmarkRight = titleX + (await textWidth('Open Aviation', titleSize, 700));

// URL footer.
const urlBaseline = 585;
const urlSize = 24;

// Tagline: one line from the ring's left edge, sized so its right edge lands on
// the wordmark's right edge, and vertically centred between the logo and URL.
const tagline = 'Improving pilot safety with open training resources and open-source tooling.';
const taglineWidth = wordmarkRight - MARGIN_X;
const taglineSize = (titleSize * taglineWidth) / (await textWidth(tagline, titleSize, 400));
const taglineCapHeight = CAP_RATIO * taglineSize;
const bandCentre = (ringBottom + (urlBaseline - CAP_RATIO * urlSize)) / 2;
const taglineBaseline = bandCentre + taglineCapHeight / 2;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0d1117"/>
  <rect x="0" y="0" width="1200" height="6" fill="#1a5fb4"/>
  <g transform="translate(${markX.toFixed(2)}, ${markY.toFixed(2)}) scale(${markScale})">
    ${logoInner}
  </g>
  <g font-family="${FONT}">
    <text x="${titleX.toFixed(1)}" y="${titleBaseline1.toFixed(1)}" font-size="${titleSize}" font-weight="700" fill="#ffffff">Open Aviation</text>
    <text x="${titleX.toFixed(1)}" y="${titleBaseline2.toFixed(1)}" font-size="${titleSize}" font-weight="700" fill="#4a8be8">Solutions</text>
    <text x="${MARGIN_X}" y="${taglineBaseline.toFixed(1)}" font-size="${taglineSize.toFixed(2)}" font-weight="400" fill="#b0bccf">${tagline}</text>
  </g>
  <text x="${MARGIN_X}" y="${urlBaseline}" font-family="${FONT}"
        font-size="${urlSize}" font-weight="500" fill="#7a8599">
    openaviation.solutions
  </text>
</svg>`;

const outPath = join(repoRoot, 'public/og-image.png');
await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`Wrote ${outPath} (tagline ${taglineSize.toFixed(1)}px)`);
