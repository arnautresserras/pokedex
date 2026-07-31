#!/usr/bin/env node
/**
 * Vendor every image the play app needs into public/pkmn/, committed.
 *
 *   public/pkmn/art/{id}.webp     hero art,  512px WebP q82  (~40KB each)
 *   public/pkmn/sprite/{id}.png   front sprite, as-is        (~1.5KB each)
 *   public/pkmn/back/{id}.png     back sprite, as-is         (~1.5KB each)
 *
 * The play app is an offline PWA: hotlinking raw.githubusercontent.com would leave the
 * kids looking at broken images on spotty wifi, and nothing remote can be precached.
 * Shiny sprites stay remote — they are print-book only. Back sprites are vendored for a future
 * story that shows the player's own Pokémon from behind, alongside the human back sprites in
 * `public/people/gen3_back/`.
 *
 * Idempotent: existing files are skipped unless --force is passed.
 * Usage: node scripts/fetch-play-assets.js [--force]
 */

import { mkdir, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import cache from '../src/data/pokemon-cache.json' with { type: 'json' }

const ROOT = path.resolve(import.meta.dirname, '..')
const ART_DIR = path.join(ROOT, 'public', 'pkmn', 'art')
const SPRITE_DIR = path.join(ROOT, 'public', 'pkmn', 'sprite')
const BACK_DIR = path.join(ROOT, 'public', 'pkmn', 'back')
const BACK_SPRITE_URL = id => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`

const ART_SIZE = 512
const ART_QUALITY = 82
const FORCE = process.argv.includes('--force')
const DELAY_MS = 120

const sleep = ms => new Promise(r => setTimeout(r, ms))

const exists = async p => access(p).then(() => true, () => false)

async function download(url, attempt = 1) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return Buffer.from(await res.arrayBuffer())
  } catch (err) {
    if (attempt >= 4) throw err
    await sleep(500 * attempt)
    return download(url, attempt + 1)
  }
}

async function main() {
  await mkdir(ART_DIR, { recursive: true })
  await mkdir(SPRITE_DIR, { recursive: true })
  await mkdir(BACK_DIR, { recursive: true })

  let fetched = 0
  let skipped = 0
  const failures = []

  for (const pokemon of cache) {
    const { id, name, sprites } = pokemon
    const artPath = path.join(ART_DIR, `${id}.webp`)
    const spritePath = path.join(SPRITE_DIR, `${id}.png`)
    const backPath = path.join(BACK_DIR, `${id}.png`)

    const needArt = FORCE || !(await exists(artPath))
    const needSprite = FORCE || !(await exists(spritePath))
    const needBack = FORCE || !(await exists(backPath))

    if (!needArt && !needSprite && !needBack) {
      skipped++
      continue
    }

    try {
      if (needArt) {
        const raw = await download(sprites.officialArtwork)
        const webp = await sharp(raw)
          .resize(ART_SIZE, ART_SIZE, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: ART_QUALITY })
          .toBuffer()
        await writeFile(artPath, webp)
        await sleep(DELAY_MS)
      }
      if (needSprite) {
        await writeFile(spritePath, await download(sprites.frontDefault))
        await sleep(DELAY_MS)
      }
      if (needBack) {
        await writeFile(backPath, await download(BACK_SPRITE_URL(id)))
        await sleep(DELAY_MS)
      }
      fetched++
      process.stdout.write(`\r#${String(id).padStart(3, '0')} ${name.padEnd(12)} `)
    } catch (err) {
      failures.push({ id, name, message: err.message })
    }
  }

  process.stdout.write('\r')
  console.log(`fetched ${fetched}, skipped ${skipped}, failed ${failures.length}`)
  if (failures.length) {
    for (const f of failures) console.error(`  #${f.id} ${f.name}: ${f.message}`)
    process.exitCode = 1
  }
}

main()
