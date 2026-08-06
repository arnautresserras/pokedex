#!/usr/bin/env node
/**
 * Cheap guards for the three failure classes that would break the play app *silently* for a
 * pre-reader who can't report a bug. Not a test runner — see docs/implemented/phase-1-plan.md.
 *
 *   1. a missing vendored image  → a blank cell the child just taps again
 *   2. a broken story graph      → a dead end mid-narration, or an encounter with nobody in it
 *   3. an audio API creeping in  → "silent by design" quietly violated months later
 *   4. a missing home-screen icon → the installed tile becomes a screenshot of a dark screen
 *
 * Usage: node scripts/verify-play.js
 */

import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import cache from '../src/data/pokemon-cache.json' with { type: 'json' }

const ROOT = path.resolve(import.meta.dirname, '..')
const failures = []
const warnings = []

const fail = msg => failures.push(msg)
const warn = msg => warnings.push(msg)
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

/**
 * The installed app's identity. `public/icons/` is generated output like `public/pkmn/`, so it
 * can go missing the same way — and when it does the build still succeeds: the manifest points at
 * a 404 and iOS falls back to a screenshot of whatever page was open. The apple-touch-icon link
 * gets its own check because iOS ignores the manifest's icons entirely, so losing that one line
 * breaks the tile while leaving the manifest looking perfectly correct.
 */
const ICONS = ['apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'maskable-512.png']

async function checkIcons() {
  for (const file of ICONS) {
    if (!(await exists(path.join(ROOT, 'public', 'icons', file)))) {
      fail(`missing public/icons/${file} — run node scripts/make-icons.js`)
    }
  }

  const indexHtml = await readFile(path.join(ROOT, 'index.html'), 'utf8')
  const href = indexHtml.match(/rel="apple-touch-icon"[^>]*href="([^"]+)"/)?.[1]
  if (!href) {
    fail('index.html has no apple-touch-icon link — iOS would use a screenshot as the home-screen icon')
  } else if (!(await exists(path.join(ROOT, 'public', href.replace(/^\//, ''))))) {
    fail(`index.html's apple-touch-icon points at a missing file: ${href}`)
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
  if (!(await exists(storyDir))) return // no stories yet — landed in slice 5

  const { STORIES } = await import(pathToFileURL(path.join(storyDir, 'index.js')).href)
  const { poolMembers } = await import(
    pathToFileURL(path.join(ROOT, 'src', 'play', 'utils', 'encounters.js')).href
  )

  for (const story of Object.values(STORIES ?? {})) {
    const scenes = story.scenes ?? {}
    if (!scenes[story.start ?? 'start']) fail(`story "${story.id}" has no start scene`)
    const reached = new Set([story.start])
    for (const [key, scene] of Object.entries(scenes)) {
      const where = `story "${story.id}" scene "${key}"`
      const narration = scene.narration ?? []
      if (!narration.some(line => line?.trim())) {
        fail(`${where} has no narration — the parent would have nothing to read`)
      }
      for (const choice of scene.choices ?? []) {
        if (!scenes[choice.next]) fail(`${where} choice → unknown scene "${choice.next}"`)
        else reached.add(choice.next)
        if (!choice.icon) fail(`${where} has a choice with no icon — children can't read labels`)
        if (!story.choiceLabels?.[choice.icon]) {
          fail(`${where} choice icon "${choice.icon}" has no label in ${story.lang}`)
        }
      }
      // An encounter's `next` is the doorway to its branch's own closing scene (see route1.js) —
      // same reachability contract as a choice's `next`, just not offered as a tap the child
      // makes themselves.
      if (scene.type === 'encounter' && scene.next) {
        if (!scenes[scene.next]) fail(`${where} next → unknown scene "${scene.next}"`)
        else reached.add(scene.next)
      }
      const terminal = !(scene.choices ?? []).length
      if (terminal && scene.type !== 'encounter' && scene.type !== 'ending') {
        fail(`${where} is a dead end but is not an encounter or an ending`)
      }
      /**
       * An encounter's pool is a place, and a place that resolves to nobody ends the story on
       * an empty stage — the exact "dead end mid-narration" this check exists for, just one
       * layer further in than a broken `next`. A typo in a route name is all it takes.
       */
      if (scene.type === 'encounter') {
        if (!scene.pool) fail(`${where} is an encounter with no pool`)
        else if (!poolMembers(cache, scene.pool).length) {
          fail(`${where} pool "${scene.pool}" resolves to nobody — check STORY_POOLS`)
        }
      }
    }
    for (const key of Object.keys(scenes)) {
      // An unreachable scene is authored prose nobody will ever hear — a content bug, not a
      // crash, and invisible without walking the graph.
      if (!reached.has(key)) fail(`story "${story.id}" scene "${key}" is unreachable`)
    }
  }
}

/**
 * `Backdrop.jsx`'s `BACKDROPS` and `animeCharacters.js`'s `CHARACTERS` can't be imported under
 * plain Node the way this script imports `episodes/index.js` itself — the former is JSX, the
 * latter reads `import.meta.env.BASE_URL` at module scope, both Vite-only. Their ids are read
 * back out of the source text instead, the same trick `checkFonts` already uses on `fonts.css`.
 */
async function loadBackdropIds() {
  const text = await readFile(
    path.join(ROOT, 'src', 'play', 'screens', 'story', 'Backdrop.jsx'),
    'utf8',
  )
  const block = text.match(/const BACKDROPS = \{([\s\S]*?)\n\}/)?.[1] ?? ''
  return new Set([...block.matchAll(/^ {2}(?:'([^']+)'|([\w-]+)):\s*\{/gm)].map(m => m[1] ?? m[2]))
}

async function loadCharacterIds() {
  const text = await readFile(path.join(ROOT, 'src', 'play', 'animeCharacters.js'), 'utf8')
  return new Set([...text.matchAll(/\{\s*id:\s*'([^']+)'/g)].map(m => m[1]))
}

/**
 * Same shape as `checkStories`, for `src/play/episodes/` — but episodes are linear (a `next`
 * chain, no `choices`) and an encounter names a fixed `pokemonId` (canon cast) rather than a
 * random `pool`, so the checks are simpler: no icon/label pair to validate, and "resolves to
 * nobody" means the dex id isn't in the cache rather than a `STORY_POOLS` typo.
 *
 * `backdrop`/`cast`/`protagonist` ids that don't resolve are warnings, not failures: both
 * `Backdrop` and `Cast` fall back gracefully at runtime (an unresolved id costs atmosphere, not
 * playability), and `checkStories` leaves the same tier of typo unchecked for its own `Backdrop`
 * ids — this only surfaces the mistake instead of leaving it silent.
 */
async function checkEpisodes() {
  const episodesDir = path.join(ROOT, 'src', 'play', 'episodes')
  if (!(await exists(episodesDir))) return

  const { EPISODES } = await import(pathToFileURL(path.join(episodesDir, 'index.js')).href)
  const cacheIds = new Set(cache.map(p => p.id))
  const backdropIds = await loadBackdropIds()
  const characterIds = await loadCharacterIds()

  for (const episode of Object.values(EPISODES ?? {})) {
    const scenes = episode.scenes ?? {}
    if (!scenes[episode.start]) fail(`episode "${episode.id}" has no start scene`)
    if (episode.protagonist && !characterIds.has(episode.protagonist)) {
      warn(`episode "${episode.id}" protagonist "${episode.protagonist}" doesn't resolve — that character won't render`)
    }
    const reached = new Set([episode.start])
    for (const [key, scene] of Object.entries(scenes)) {
      const where = `episode "${episode.id}" scene "${key}"`
      const narration = scene.narration ?? []
      if (!narration.some(line => line?.trim())) {
        fail(`${where} has no narration — the parent would have nothing to read`)
      }
      if (scene.backdrop && !backdropIds.has(scene.backdrop)) {
        warn(`${where} backdrop "${scene.backdrop}" doesn't resolve — falls back to "forest-edge"`)
      }
      for (const castId of scene.cast ?? []) {
        if (!characterIds.has(castId)) {
          warn(`${where} cast id "${castId}" doesn't resolve — that character won't render`)
        }
      }
      if (scene.next) {
        if (!scenes[scene.next]) fail(`${where} next → unknown scene "${scene.next}"`)
        else reached.add(scene.next)
      }
      const terminal = !scene.next
      if (terminal && scene.type !== 'ending') {
        fail(`${where} is a dead end but is not an ending`)
      }
      if (scene.type === 'encounter') {
        if (!scene.pokemonId) fail(`${where} is an encounter with no pokemonId`)
        else if (!cacheIds.has(scene.pokemonId)) {
          fail(`${where} pokemonId ${scene.pokemonId} doesn't resolve in the cache`)
        }
      }
    }
    for (const key of Object.keys(scenes)) {
      if (!reached.has(key)) fail(`episode "${episode.id}" scene "${key}" is unreachable`)
    }
  }
}

await checkAssets()
await checkFonts()
await checkIcons()
await checkSilence()
await checkStories()
await checkEpisodes()

if (warnings.length) {
  console.warn(`verify-play: ${warnings.length} warning(s) — atmosphere-only, doesn't fail the build\n`)
  for (const w of warnings) console.warn(`  ! ${w}`)
}

if (failures.length) {
  console.error(`verify-play: ${failures.length} problem(s)\n`)
  for (const f of failures) console.error(`  ✗ ${f}`)
  process.exit(1)
}
console.log('verify-play: assets, fonts, icons, silence, stories and episodes all check out')
