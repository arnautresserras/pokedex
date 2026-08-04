#!/usr/bin/env node
/**
 * Rasterizes a Tiled `.tmx` map into a flat PNG story backdrop.
 *
 * This is the other half of authoring a tileset scene: a `.tmx` is just text (a CSV grid of
 * tile IDs per layer, plus which atlas each ID range belongs to), so a scene can be authored —
 * by hand, by Claude from a description, or in the Tiled GUI — without ever touching a raster
 * editor. This script is what turns that text into the PNG `Backdrop.jsx`'s `image` shape
 * actually renders (see sceneUrl() in src/play/utils/playAssets.js).
 *
 * Usage: node scripts/compose-scene.js <input.tmx> <output-id>
 *   → writes public/scenes/<output-id>.png
 *
 * Tileset images referenced by a `.tmx` (via its `.tsx` files) are resolved relative to the
 * `.tsx` file's own directory — so a map's tilesets must live in assets/tilesets/, alongside
 * the atlases and TSX metadata vendored from the artist's original download.
 */

import { readFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}="([^"]*)"`))
  return m ? m[1] : undefined
}

async function parseTsx(tsxPath) {
  const xml = await readFile(tsxPath, 'utf8')
  const tilesetTag = xml.match(/<tileset\b[^>]*>/)[0]
  const imageTag = xml.match(/<image\b[^>]*\/?>/)[0]
  const columns = Number(attr(tilesetTag, 'columns'))
  const imageSource = attr(imageTag, 'source')
  const imagePath = path.resolve(path.dirname(tsxPath), imageSource)
  return { columns, imagePath }
}

async function parseTmx(tmxPath) {
  const xml = await readFile(tmxPath, 'utf8')
  const dir = path.dirname(tmxPath)

  const mapTag = xml.match(/<map\b[^>]*>/)[0]
  const width = Number(attr(mapTag, 'width'))
  const height = Number(attr(mapTag, 'height'))
  const tilewidth = Number(attr(mapTag, 'tilewidth'))
  const tileheight = Number(attr(mapTag, 'tileheight'))

  const tilesets = []
  for (const m of xml.matchAll(/<tileset\s+firstgid="(\d+)"\s+source="([^"]+)"\s*\/>/g)) {
    const firstgid = Number(m[1])
    const tsxPath = path.resolve(dir, m[2])
    const { columns, imagePath } = await parseTsx(tsxPath)
    tilesets.push({ firstgid, columns, imagePath })
  }
  // Highest firstgid first, so "which tileset owns this gid" is a simple first-match scan.
  tilesets.sort((a, b) => b.firstgid - a.firstgid)

  const layers = []
  for (const m of xml.matchAll(/<layer\b[^>]*name="([^"]+)"[^>]*>\s*<data encoding="csv">([\s\S]*?)<\/data>/g)) {
    const name = m[1]
    const data = m[2]
      .trim()
      .split(',')
      .map(s => Number(s.trim()))
      .filter(n => Number.isFinite(n))
    layers.push({ name, data })
  }

  return { width, height, tilewidth, tileheight, tilesets, layers }
}

function tilesetForGid(tilesets, gid) {
  return tilesets.find(t => gid >= t.firstgid)
}

async function composeScene(tmxPath, outputId) {
  const map = await parseTmx(tmxPath)
  const { width, height, tilewidth, tileheight, tilesets, layers } = map

  // Cache one extracted buffer per distinct (tileset, localId) — a scene reuses tiles heavily
  // (one "pine tree" tile appears dozens of times), so this avoids re-decoding the same crop.
  const tileCache = new Map()

  async function tileBuffer(gid) {
    if (gid === 0) return null // 0 = no tile, Tiled's convention for "empty"
    if (tileCache.has(gid)) return tileCache.get(gid)

    const tileset = tilesetForGid(tilesets, gid)
    if (!tileset) throw new Error(`gid ${gid} matches no known tileset`)
    const localId = gid - tileset.firstgid
    const col = localId % tileset.columns
    const row = Math.floor(localId / tileset.columns)

    const buf = await sharp(tileset.imagePath)
      .extract({ left: col * tilewidth, top: row * tileheight, width: tilewidth, height: tileheight })
      .png()
      .toBuffer()

    tileCache.set(gid, buf)
    return buf
  }

  const composites = []
  for (const layer of layers) {
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const gid = layer.data[row * width + col]
        if (!gid) continue
        const buf = await tileBuffer(gid)
        composites.push({ input: buf, left: col * tilewidth, top: row * tileheight })
      }
    }
  }

  const outDir = path.join(ROOT, 'public', 'scenes')
  await mkdir(outDir, { recursive: true })
  const outPath = path.join(outDir, `${outputId}.png`)

  await sharp({
    create: {
      width: width * tilewidth,
      height: height * tileheight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toFile(outPath)

  console.log(`compose-scene: wrote ${path.relative(ROOT, outPath)} (${width * tilewidth}x${height * tileheight}, ${composites.length} tiles)`)
}

const [, , tmxArg, outputIdArg] = process.argv
if (!tmxArg || !outputIdArg) {
  console.error('Usage: node scripts/compose-scene.js <input.tmx> <output-id>')
  process.exit(1)
}
await composeScene(path.resolve(ROOT, tmxArg), outputIdArg)
