#!/usr/bin/env node
/**
 * Authoring aid, not part of the shipped pipeline: renders a tileset atlas upscaled with a
 * grid and gid numbers overlaid, so tile IDs can be read off and transcribed into a new
 * `.tmx` by hand (or by Claude) — see compose-scene.js for what turns that data into a scene.
 *
 * Usage: node scripts/label-tileset.js <atlas.png> <firstgid> <columns> <out.png> [rowStart] [rowEnd]
 *   rowStart/rowEnd crop to a row range — most atlases are too tall to read labeled in one shot.
 */
import sharp from 'sharp'

const [, , imagePath, firstgid, columns, outPath, rowStartArg, rowEndArg] = process.argv
const FIRSTGID = Number(firstgid)
const COLUMNS = Number(columns)
const SCALE = 4
const TILE = 16

const fullMeta = await sharp(imagePath).metadata()
const totalRows = fullMeta.height / TILE
const rowStart = rowStartArg ? Number(rowStartArg) : 0
const rowEnd = rowEndArg ? Number(rowEndArg) : totalRows
const rows = rowEnd - rowStart

const cropped = await sharp(imagePath)
  .extract({ left: 0, top: rowStart * TILE, width: fullMeta.width, height: rows * TILE })
  .toBuffer()

const outW = fullMeta.width * SCALE
const outH = rows * TILE * SCALE

const upscaled = await sharp(cropped)
  .resize(outW, outH, { kernel: 'nearest' })
  .toBuffer()

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${outW}" height="${outH}">`
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < COLUMNS; c++) {
    const gid = FIRSTGID + (rowStart + r) * COLUMNS + c
    const x = c * TILE * SCALE
    const y = r * TILE * SCALE
    svg += `<rect x="${x}" y="${y}" width="${TILE * SCALE}" height="${TILE * SCALE}" fill="none" stroke="rgba(255,0,255,0.5)" stroke-width="1"/>`
    svg += `<text x="${x + 2}" y="${y + 10}" font-size="8" fill="magenta">${gid}</text>`
  }
}
svg += '</svg>'

await sharp(upscaled)
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .png()
  .toFile(outPath)

console.log(`wrote ${outPath}`)
