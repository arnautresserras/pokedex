#!/usr/bin/env node
/**
 * Vendor the 15 Gen I type pictograms from partywhale/pokemon-type-icons (MIT) into
 * `src/play/typeIcons.js`, committed — plus the upstream licence next to it.
 *
 * Upstream is a set of circular badges: a 256×256 disc in the type's colour with a white
 * symbol on it, and on a few icons one or two detail shapes in a near-disc shade (a ghost's
 * eyes, a water wave) which read as holes showing the disc through. This script keeps the
 * *symbol* and throws the disc away, because the play app already supplies the colour: a type
 * room is a full screen of `TYPE_COLORS`, so a second disc in the icon set's own slightly
 * different green would look like a bug. Which maps cleanly onto the existing glyph contract:
 *
 *   white shape        → currentColor      (the glyph)
 *   near-disc shape    → var(--glyph-cut)  (a hole back to whatever it's drawn on)
 *   the 128/128/128 disc → dropped
 *
 * Inlined as path data rather than shipped as 15 .svg files, so `TypeGlyph` stays one inline
 * SVG whose colour comes from CSS — an <img> can't inherit `currentColor` and couldn't punch a
 * hole. It also keeps the icons out of the service worker's reach entirely: they're in the
 * bundle, so there is nothing to miss in airplane mode.
 *
 * **The crop is computed, not hardcoded.** Dropping the disc leaves the symbols filling only
 * ~55–67% of the 256 box, so they'd render small in wrappers sized for the old glyphs. So the
 * script measures every symbol, takes the union, and emits one square viewBox centred on the
 * disc's centre. One shared crop rather than a per-icon one on purpose: the 15 symbols were
 * drawn as a set with deliberate relative sizes (fighting is smaller than dragon), and
 * normalising each to its own bounding box would throw that away. Computing it also means an
 * upstream redraw can't silently clip a glyph — re-run this and the crop follows.
 *
 * Types come from `TYPE_COLORS`, the same source `GEN_I_TYPES` uses, so this can't drift out of
 * step with the 15 rooms. Upstream also ships dark, fairy and steel; Gen I has none of them.
 *
 * Usage: node scripts/fetch-type-icons.js
 */

import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { TYPE_COLORS } from '../src/utils/typeColors.js'

const REPO = 'partywhale/pokemon-type-icons'
const REF = 'main'
const RAW = `https://raw.githubusercontent.com/${REPO}/${REF}`
const ROOT = path.resolve(import.meta.dirname, '..')
const OUT_JS = path.join(ROOT, 'src', 'play', 'typeIcons.js')
const OUT_LICENSE = path.join(ROOT, 'src', 'play', 'typeIcons.LICENSE.txt')

const TYPES = Object.keys(TYPE_COLORS)

/** The background disc every upstream icon opens with. */
const DISC = { cx: 128, cy: 128, r: 128 }
/** A channel floor for "this is the white symbol". Upstream uses #fff, except ice's #fbfdfd. */
const WHITE_FLOOR = 0xf0
/** How far a cut shape's colour may sit from the disc's before we refuse to guess. */
const MAX_CUT_DISTANCE = 48

async function download(url, attempt = 1) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.text()
  } catch (err) {
    if (attempt >= 3) throw new Error(`${url}: ${err.message}`)
    await new Promise(r => setTimeout(r, 400 * attempt))
    return download(url, attempt + 1)
  }
}

function parseHex(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map(c => c + c).join('') : h
  return [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16))
}

const isWhite = rgb => rgb.every(c => c >= WHITE_FLOOR)
const distance = (a, b) => Math.max(...a.map((c, i) => Math.abs(c - b[i])))

/**
 * `.cls-N → #rrggbb` from the icon's `<style>` block. Upstream is Illustrator output, so fills
 * live there rather than on the elements.
 */
function parseStyles(svg, type) {
  const block = svg.match(/<style>([\s\S]*?)<\/style>/)
  if (!block) throw new Error(`${type}: no <style> block — upstream format changed`)

  const fills = new Map()
  for (const [, cls, hex] of block[1].matchAll(/\.([\w-]+)\s*\{\s*fill:\s*(#[0-9a-fA-F]{3,6})\s*;?\s*\}/g)) {
    fills.set(cls, hex)
  }
  if (!fills.size) throw new Error(`${type}: no class fills parsed — upstream format changed`)
  return fills
}

/** Shapes in document order, which is paint order: the cuts have to stay on top of the glyph. */
function parseShapes(svg, type) {
  const shapes = []
  for (const [, tag, attrs] of svg.matchAll(/<(path|circle)\b([^>]*)\/?>/g)) {
    const cls = attrs.match(/class="([^"]+)"/)?.[1]
    if (!cls) throw new Error(`${type}: a <${tag}> has no class — upstream format changed`)

    if (tag === 'path') {
      const d = attrs.match(/\bd="([^"]+)"/)?.[1]
      if (!d) throw new Error(`${type}: a <path> has no d`)
      shapes.push({ kind: 'path', cls, d: d.replace(/\s+/g, ' ').trim() })
    } else {
      const num = name => Number(attrs.match(new RegExp(`\\b${name}="([\\d.-]+)"`))?.[1])
      shapes.push({ kind: 'circle', cls, cx: num('cx'), cy: num('cy'), r: num('r') })
    }
  }
  if (!shapes.length) throw new Error(`${type}: no shapes found`)
  return shapes
}

/* --- geometry -----------------------------------------------------------------------------
   A bounding box over path endpoints *and* bezier control points. That's a superset of the
   true box (a bezier lies inside its control hull), which is the safe direction to be wrong
   in: the crop can come out a shade generous, never tight enough to clip. */

const NUMBER = String.raw`-?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?`
const TOKENS = new RegExp(`[MmLlHhVvCcSsQqTtAaZz]|${NUMBER}`, 'g')

function growBox(box, x, y) {
  box.minX = Math.min(box.minX, x)
  box.maxX = Math.max(box.maxX, x)
  box.minY = Math.min(box.minY, y)
  box.maxY = Math.max(box.maxY, y)
}

function emptyBox() {
  return { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
}

function measurePath(d, box, type) {
  const tokens = d.match(TOKENS) ?? []
  let cmd = null
  let x = 0
  let y = 0
  let startX = 0
  let startY = 0
  let i = 0
  const num = () => Number(tokens[i++])

  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) cmd = tokens[i++]
    if (!cmd) throw new Error(`${type}: path data starts without a command`)

    const relative = cmd === cmd.toLowerCase()
    const ox = relative ? x : 0
    const oy = relative ? y : 0

    switch (cmd.toUpperCase()) {
      case 'M':
        x = ox + num()
        y = oy + num()
        startX = x
        startY = y
        growBox(box, x, y)
        // A repeated coordinate pair after a moveto is an implicit lineto, not another moveto.
        cmd = relative ? 'l' : 'L'
        break
      case 'L':
      case 'T':
        x = ox + num()
        y = oy + num()
        growBox(box, x, y)
        break
      case 'H':
        x = ox + num()
        growBox(box, x, y)
        break
      case 'V':
        y = oy + num()
        growBox(box, x, y)
        break
      case 'C': {
        const x1 = ox + num()
        const y1 = oy + num()
        const x2 = ox + num()
        const y2 = oy + num()
        x = ox + num()
        y = oy + num()
        growBox(box, x1, y1)
        growBox(box, x2, y2)
        growBox(box, x, y)
        break
      }
      case 'S':
      case 'Q': {
        const x2 = ox + num()
        const y2 = oy + num()
        x = ox + num()
        y = oy + num()
        growBox(box, x2, y2)
        growBox(box, x, y)
        break
      }
      case 'A': {
        num() // rx
        num() // ry
        num() // rotation
        num() // large-arc flag
        num() // sweep flag
        x = ox + num()
        y = oy + num()
        growBox(box, x, y)
        break
      }
      case 'Z':
        x = startX
        y = startY
        break
      default:
        throw new Error(`${type}: unsupported path command "${cmd}"`)
    }
  }
}

/** One icon, reduced to the shapes we keep. */
function extract(svg, type) {
  const fills = parseStyles(svg, type)
  const shapes = parseShapes(svg, type)

  const discs = shapes.filter(
    s => s.kind === 'circle' && s.cx === DISC.cx && s.cy === DISC.cy && s.r === DISC.r,
  )
  if (discs.length !== 1) {
    throw new Error(`${type}: expected exactly 1 background disc, found ${discs.length}`)
  }
  const discColor = parseHex(fills.get(discs[0].cls))

  const kept = []
  for (const shape of shapes) {
    if (shape === discs[0]) continue

    const hex = fills.get(shape.cls)
    if (!hex) throw new Error(`${type}: class "${shape.cls}" has no fill`)
    const rgb = parseHex(hex)

    if (isWhite(rgb)) {
      kept.push({ ...shape, cut: false })
      continue
    }
    // Not white, so it's meant to read as a hole showing the disc. Verify that's really what
    // it is: a genuinely different third colour would mean the set has changed and this
    // two-tone mapping no longer describes it.
    const away = distance(rgb, discColor)
    if (away > MAX_CUT_DISTANCE) {
      throw new Error(
        `${type}: shape fill ${hex} is neither white nor a shade of the disc ${fills.get(discs[0].cls)} (distance ${away})`,
      )
    }
    kept.push({ ...shape, cut: true })
  }

  if (!kept.some(s => !s.cut)) throw new Error(`${type}: no white symbol shape found`)
  return kept
}

function serialize(shapes) {
  const lines = shapes.map(shape => {
    const cut = shape.cut ? ', cut: true' : ''
    if (shape.kind === 'path') {
      if (shape.d.includes("'") || shape.d.includes('\\')) {
        throw new Error('path data contains a quote or backslash')
      }
      return `    { d: '${shape.d}'${cut} },`
    }
    return `    { circle: [${shape.cx}, ${shape.cy}, ${shape.r}]${cut} },`
  })
  return lines.join('\n')
}

async function main() {
  const icons = new Map()
  const union = emptyBox()

  for (const type of TYPES) {
    const svg = await download(`${RAW}/icons/${type}.svg`)
    const shapes = extract(svg, type)

    for (const shape of shapes) {
      if (shape.kind === 'path') measurePath(shape.d, union, type)
      else growBox(union, shape.cx - shape.r, shape.cy - shape.r),
        growBox(union, shape.cx + shape.r, shape.cy + shape.r)
    }

    icons.set(type, shapes)
    const cuts = shapes.filter(s => s.cut).length
    console.log(
      `  ${type.padEnd(9)} ${shapes.length - cuts} glyph shape(s)${cuts ? ` + ${cuts} cut` : ''}`,
    )
  }

  // One square crop, centred on the disc's centre so each symbol keeps the offset it was drawn
  // with, sized to the furthest thing any of the 15 reaches and rounded outward.
  const half = Math.ceil(
    Math.max(DISC.cx - union.minX, union.maxX - DISC.cx, DISC.cy - union.minY, union.maxY - DISC.cy),
  )
  const origin = DISC.cx - half
  const viewBox = `${origin} ${origin} ${half * 2} ${half * 2}`
  console.log(
    `\nmeasured union: x ${union.minX.toFixed(1)}…${union.maxX.toFixed(1)} ` +
      `y ${union.minY.toFixed(1)}…${union.maxY.toFixed(1)}  →  viewBox "${viewBox}"`,
  )

  const body = TYPES.map(type => `  ${type}: [\n${serialize(icons.get(type))}\n  ],`).join('\n')

  const file = `/**
 * GENERATED by scripts/fetch-type-icons.js — do not edit by hand.
 *
 * The 15 Gen I type pictograms, from https://github.com/${REPO} (MIT, see
 * typeIcons.LICENSE.txt) — a vector recreation of the type icons from the modern games.
 *
 * Upstream ships circular badges; the coloured disc is dropped here because the play app
 * supplies the colour itself. Each shape is drawn in \`currentColor\`, except the few marked
 * \`cut: true\` — detail shapes that upstream fills with a shade of the disc, so here they punch
 * back to \`--glyph-cut\`, whatever surface the glyph is sitting on. Document order is paint
 * order: cuts come after the shape they cut into.
 *
 * The viewBox is the measured union of all 15 symbols, so the disc's dead margin is cropped
 * away while the set keeps the relative sizes it was drawn with.
 */

export const TYPE_ICON_VIEW_BOX = '${viewBox}'

export const TYPE_ICONS = {
${body}
}
`

  await writeFile(OUT_JS, file, 'utf8')
  console.log(`wrote ${path.relative(ROOT, OUT_JS)} (${(file.length / 1024).toFixed(1)}KB)`)

  // MIT requires the notice to ship with the copies. It lives next to the generated module so
  // it can't be separated from the thing it covers.
  const license = await download(`${RAW}/LICENSE`)
  await writeFile(
    OUT_LICENSE,
    `The type pictograms in typeIcons.js are from https://github.com/${REPO}\n` +
      `(commit ref "${REF}"), used under the MIT licence reproduced below. The paths are\n` +
      `unmodified; the background disc of each icon is not included.\n\n${license}`,
    'utf8',
  )
  console.log(`wrote ${path.relative(ROOT, OUT_LICENSE)}`)
}

await main()
