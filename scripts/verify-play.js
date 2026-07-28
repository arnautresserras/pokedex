#!/usr/bin/env node
/**
 * Cheap guards for the three failure classes that would break the play app *silently* for a
 * pre-reader who can't report a bug. Not a test runner — see docs/phase-1-plan.md.
 *
 *   1. a missing vendored image  → a blank cell the child just taps again
 *   2. a broken story link       → a dead end mid-narration (added with the story engine)
 *   3. an audio API creeping in  → "silent by design" quietly violated months later
 *
 * Usage: node scripts/verify-play.js
 */

import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import cache from '../src/data/pokemon-cache.json' with { type: 'json' }

const ROOT = path.resolve(import.meta.dirname, '..')
const failures = []

const fail = msg => failures.push(msg)
const exists = p => access(p).then(() => true, () => false)

async function checkAssets() {
  for (const { id, name } of cache) {
    for (const rel of [`public/pkmn/art/${id}.webp`, `public/pkmn/sprite/${id}.png`]) {
      if (!(await exists(path.join(ROOT, rel)))) fail(`missing asset for #${id} ${name}: ${rel}`)
    }
  }
}

async function checkFonts() {
  const cssPath = path.join(ROOT, 'src', 'fonts.css')
  if (!(await exists(cssPath))) {
    fail('src/fonts.css is missing — run node scripts/fetch-fonts.js')
    return
  }
  const css = await readFile(cssPath, 'utf8')
  for (const m of css.matchAll(/url\('\/fonts\/([^']+)'\)/g)) {
    if (!(await exists(path.join(ROOT, 'public', 'fonts', m[1])))) {
      fail(`fonts.css references a missing file: ${m[1]}`)
    }
  }
  const indexHtml = await readFile(path.join(ROOT, 'index.html'), 'utf8')
  if (indexHtml.includes('fonts.googleapis.com') || indexHtml.includes('fonts.gstatic.com')) {
    fail('index.html still loads fonts from the Google Fonts CDN — the app must work offline')
  }
}

/** Silent by design. Two lines of assertion for a constraint that is easy to erode. */
const BANNED = [
  /\bspeechSynthesis\b/,
  /\bSpeechSynthesisUtterance\b/,
  /\bAudioContext\b/,
  /\bwebkitAudioContext\b/,
  /\bnew\s+Audio\b/,
  /navigator\.vibrate/,
  /<audio[\s>]/,
]

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

async function checkSilence() {
  const playDir = path.join(ROOT, 'src', 'play')
  if (!(await exists(playDir))) {
    fail('src/play/ is missing')
    return
  }
  for await (const file of walk(playDir)) {
    if (!/\.(jsx?|css)$/.test(file)) continue
    const text = await readFile(file, 'utf8')
    for (const pattern of BANNED) {
      if (pattern.test(text)) {
        fail(`${path.relative(ROOT, file)} references ${pattern.source} — the app is silent by design`)
      }
    }
  }
}

async function checkStories() {
  const storyDir = path.join(ROOT, 'src', 'play', 'stories')
  if (!(await exists(storyDir))) return // no stories yet — lands in slice 5

  const { STORIES } = await import(pathToFileURL(path.join(storyDir, 'index.js')).href)
  for (const story of Object.values(STORIES ?? {})) {
    const scenes = story.scenes ?? {}
    if (!scenes[story.start ?? 'start']) fail(`story "${story.id}" has no start scene`)
    for (const [key, scene] of Object.entries(scenes)) {
      const where = `story "${story.id}" scene "${key}"`
      const narration = scene.narration ?? []
      if (scene.type !== 'encounter' && !narration.some(line => line?.trim())) {
        fail(`${where} has no narration`)
      }
      for (const choice of scene.choices ?? []) {
        if (!scenes[choice.next]) fail(`${where} choice → unknown scene "${choice.next}"`)
        if (!choice.icon) fail(`${where} has a choice with no icon — children can't read labels`)
      }
      const terminal = !(scene.choices ?? []).length
      if (terminal && scene.type !== 'encounter') {
        fail(`${where} is a dead end but is not an encounter`)
      }
    }
  }
}

await checkAssets()
await checkFonts()
await checkSilence()
await checkStories()

if (failures.length) {
  console.error(`verify-play: ${failures.length} problem(s)\n`)
  for (const f of failures) console.error(`  ✗ ${f}`)
  process.exit(1)
}
console.log('verify-play: assets, fonts, silence and stories all check out')
