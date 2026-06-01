// One-shot script: render public/og-image.png (1200x630) from an inline SVG.
// Run via `node scripts/generate-og-image.mjs`. Re-run when the brand changes.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

const logoSvg = await readFile(join(repoRoot, 'src/assets/logo-mark-dark.svg'), 'utf8');
const logoInner = logoSvg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1];

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0d1117"/>
  <rect x="0" y="0" width="1200" height="6" fill="#1a5fb4"/>
  <g transform="translate(90, 175) scale(1.6)">
    ${logoInner}
  </g>
  <g font-family="'Barlow', 'Helvetica Neue', Arial, sans-serif" fill="#ffffff">
    <text x="430" y="255" font-size="86" font-weight="700">Open Aviation</text>
    <text x="430" y="345" font-size="86" font-weight="700" fill="#4a8be8">Solutions</text>
    <text x="430" y="420" font-size="32" font-weight="400" fill="#b0bccf">
      Improving pilot safety with open
    </text>
    <text x="430" y="460" font-size="32" font-weight="400" fill="#b0bccf">
      learning and training resources.
    </text>
  </g>
  <text x="90" y="585" font-family="'Barlow', 'Helvetica Neue', Arial, sans-serif"
        font-size="24" font-weight="500" fill="#7a8599">
    openaviation.solutions
  </text>
</svg>`;

const outPath = join(repoRoot, 'public/og-image.png');
await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`Wrote ${outPath}`);
