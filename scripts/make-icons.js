#!/usr/bin/env node
/**
 * Render the home-screen / manifest icons from `public/pokeball.svg` into `public/icons/`,
 * committed like every other vendored asset.
 *
 * Three things about iOS make this more than a resize:
 *
 *   1. **iOS reads `apple-touch-icon`, not the manifest.** Without that one `<link>` the Add to
 *      Home Screen tile is a screenshot of the page, which for a dark play screen is an
 *      unrecognisable smudge. It is the only icon that actually matters for these users.
 *   2. **A transparent icon composites onto black.** `pokeball.svg` is a circle in a square box,
 *      so its corners are transparent and the ball's #16161a outline would sit on iOS's black —
 *      the stroke disappears and the ball looks like it has a bite taken out of it. So every
 *      icon is flattened onto an opaque background first. That background is `--play-bg`, the
 *      same colour as the manifest's `background_color`, so the tile, the launch screen and the
 *      app's first painted pixel are one continuous colour rather than three darks.
 *   3. **Maskable is a different crop, not a flag.** Android may mask the icon to a circle or a
 *      squircle, keeping only the central 80%. A full-bleed pokeball would lose its rim, so the
 *      maskable variant draws the ball smaller inside the same square. Hence two 512s.
 *
 * Usage: node scripts/make-icons.js
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SOURCE = path.join(ROOT, 'public', 'pokeball.svg')
const OUT_DIR = path.join(ROOT, 'public', 'icons')

/** `--play-bg` from src/play/play.css. Kept in step with the manifest's background_color. */
const BACKGROUND = '#16161a'

/** `ball` is the ball's diameter as a fraction of the tile. */
const ICONS = [
  { file: 'apple-touch-icon.png', size: 180, ball: 0.82 },
  { file: 'icon-192.png', size: 192, ball: 0.82 },
  { file: 'icon-512.png', size: 512, ball: 0.82 },
  // Inside the maskable safe zone — the central circle of 80% diameter — with room to spare.
  { file: 'maskable-512.png', size: 512, ball: 0.6 },
]

async function render(svg, { size, ball }) {
  const diameter = Math.round(size * ball)
  // Resizing an SVG input re-renders it at that scale rather than upscaling a raster, so the
  // 64-unit source stays crisp at 512.
  const drawn = await sharp(svg)
    .resize(diameter, diameter, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  return sharp({ create: { width: size, height: size, channels: 4, background: BACKGROUND } })
    .composite([{ input: drawn, gravity: 'center' }])
    .flatten({ background: BACKGROUND }) // drop alpha: iOS wants an opaque tile
    .png({ compressionLevel: 9 })
    .toBuffer()
}

const svg = await readFile(SOURCE)
await mkdir(OUT_DIR, { recursive: true })

for (const icon of ICONS) {
  const png = await render(svg, icon)
  await writeFile(path.join(OUT_DIR, icon.file), png)
  console.log(`  ${icon.file.padEnd(22)} ${icon.size}×${icon.size}  ${(png.length / 1024).toFixed(1)}KB`)
}

console.log(`\nwrote ${ICONS.length} icons to ${path.relative(ROOT, OUT_DIR)}`)
