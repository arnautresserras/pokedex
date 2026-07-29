import { useId } from 'react'
import { TYPE_ICONS, TYPE_ICON_VIEW_BOX } from '../typeIcons'
import styles from './TypeGlyph.module.css'

/**
 * The pictogram for a type room — the same job `ModeGlyph` does for a mode, one level down.
 *
 * The shapes are **the type icons from the modern games** (a vector recreation, MIT-licensed —
 * see `typeIcons.js` and its licence file), vendored by `scripts/fetch-type-icons.js`. They
 * replace a hand-drawn set whose rule was "draw the thing, not the concept": a flame, a leaf, a
 * paw. That rule was the right guess in the absence of anything better, but these are better,
 * and for a reason no drawing of ours could match — they're the shapes the child will meet
 * again on a card, a sticker, a screenshot or a lunchbox, so recognition transfers out of the
 * app instead of stopping at it.
 *
 * The trade is worth recording honestly: a few of them are *less* literal than what they
 * replace (Normal is a ring, Psíquic a swirl), so where the old set was guessable this one has
 * to be learned. Colour and the watermark silhouette carry the tile either way, which is what
 * makes that affordable — the same fallback Slice 3 relied on when the glyphs were ours.
 *
 * **Holes are masked, not painted.** Upstream draws its detail shapes — a ghost's eyes, a water
 * wave, the ring inside Normal — in a shade of the disc that gets thrown away here, so they
 * have to become holes. They're cut with an SVG mask rather than filled with the surface
 * colour, because the surfaces they sit on are *gradients*: a flat fill matched the old
 * two-eye cuts closely enough to pass, but Normal's hole is a third of the glyph and no single
 * colour is right across all of it. A masked hole shows whatever is actually behind it, so it
 * can't mismatch — which is why consumers no longer set `--glyph-cut`.
 *
 * It fills its box and is sized by its wrapper, so nothing here has to out-specify anything.
 *
 * Inline SVG for the same reason `ModeGlyph` is: no icon font, no remote request, nothing a
 * service worker can miss in airplane mode.
 */
/* The mask region, stated explicitly in user space. Left to default it would be the *object
   bounding box* of the group being masked, inset by SVG's -10%/120% rule — the one genuinely
   renderer-dependent corner of masking. Pinning it to the viewBox makes it unambiguous. */
const [VX, VY, VW, VH] = TYPE_ICON_VIEW_BOX.split(/\s+/).map(Number)

export default function TypeGlyph({ type, className = '' }) {
  // Two glyphs on one screen must not share a mask id, and the index renders fifteen. useId's
  // colons are legal in an id but awkward inside a url() reference, so they go.
  const maskId = `glyph-cut-${useId().replace(/:/g, '')}`

  const shapes = TYPE_ICONS[type]
  if (!shapes) return null

  const solid = shapes.filter(shape => !shape.cut)
  const masked = shapes.length > solid.length

  return (
    <svg
      className={[styles.glyph, className].filter(Boolean).join(' ')}
      viewBox={TYPE_ICON_VIEW_BOX}
      aria-hidden="true"
    >
      {/* White shows, black hides. Paint order is the generated order, so a cut lands on top of
          the shape it cuts into — exactly how upstream layered them with opaque fills. */}
      {masked && (
        <mask id={maskId} maskUnits="userSpaceOnUse" x={VX} y={VY} width={VW} height={VH}>
          {shapes.map((shape, i) => (
            <Shape key={i} shape={shape} fill={shape.cut ? '#000' : '#fff'} />
          ))}
        </mask>
      )}
      <g fill="currentColor" mask={masked ? `url(#${maskId})` : undefined}>
        {solid.map((shape, i) => (
          <Shape key={i} shape={shape} />
        ))}
      </g>
    </svg>
  )
}

/** A generated shape is either path data or a circle — nothing else survives the vendoring. */
function Shape({ shape, fill }) {
  if (shape.circle) {
    const [cx, cy, r] = shape.circle
    return <circle cx={cx} cy={cy} r={r} fill={fill} />
  }
  return <path d={shape.d} fill={fill} />
}
