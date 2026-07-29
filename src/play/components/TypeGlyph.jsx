import styles from './TypeGlyph.module.css'

/**
 * The pictogram for a type room — the same job `ModeGlyph` does for a mode, one level down.
 *
 * Rule, and it's the whole design: **draw the thing, not the concept.** A 4-year-old knows a
 * flame, a leaf, a snowflake and a ghost; nobody knows an abstract "normal" rune. Where a type
 * has no natural object the glyph borrows one a child already owns — a paw for Normal, a
 * bubbling flask for Verí, a spiral for Psíquic.
 *
 * Every glyph is one solid shape in `currentColor`, because the surface behind it is a
 * saturated gradient and a two-tone line drawing disappears at tile size. The silhouette has
 * to survive being 90px tall on the index *and* 20px tall inside a badge, so no strokes
 * thinner than ~6 units and no interior detail below ~8 units. The few shapes that need a hole
 * punched back to the surface — a ghost's eyes, a dragon's eye — read `--glyph-cut`, which the
 * consumer sets to whatever it's drawing on.
 *
 * It fills its box and is sized by its wrapper, so nothing here has to out-specify anything.
 *
 * Inline SVG for the same reason `ModeGlyph` is: no icon font, no remote request, nothing a
 * service worker can miss in airplane mode.
 */
export default function TypeGlyph({ type, className = '' }) {
  const Glyph = GLYPHS[type]
  if (!Glyph) return null
  return (
    <svg
      className={[styles.glyph, className].filter(Boolean).join(' ')}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <Glyph />
    </svg>
  )
}

/* Shapes are drawn on a 100×100 field with ~10 units of margin, so they optically match each
   other at the same rendered size regardless of how tall or wide the object is. */

/** Normal — a paw print. Animal, friendly, and belongs to no other type. */
const Normal = () => (
  <g fill="currentColor">
    <ellipse cx="50" cy="66" rx="24" ry="20" />
    <ellipse cx="26" cy="41" rx="10" ry="13" />
    <ellipse cx="42" cy="27" rx="10" ry="13.5" />
    <ellipse cx="58" cy="27" rx="10" ry="13.5" />
    <ellipse cx="74" cy="41" rx="10" ry="13" />
  </g>
)

/** Foc — a flame with an inner tongue punched out, so it reads as fire and not as a drop. */
const Fire = () => (
  <path
    fill="currentColor"
    fillRule="evenodd"
    d="M54 8c4 14-2 21-9 28-8 8-19 16-19 31a24 24 0 0 0 48 0c0-9-4-15-4-15s-1 7-7 9c3-16-3-31-9-38 3 9 1 14-3 17-5 4-9 0-8-8 1-9 6-17 11-24Z
       M50 58c5 5 8 9 8 15a8 8 0 0 1-16 0c0-6 3-10 8-15Z"
  />
)

/** Aigua — a single fat drop. The most unambiguous shape in the set; keep it plain. */
const Water = () => (
  <path
    fill="currentColor"
    d="M50 8C50 8 20 42 20 61a30 30 0 0 0 60 0C80 42 50 8 50 8Z"
  />
)

/** Planta — a leaf with a midrib, tilted so it isn't mistaken for the water drop. */
const Grass = () => (
  <g fill="currentColor">
    <path d="M85 12C48 12 22 27 22 55c0 9 3 17 8 22 14-20 27-30 43-37-13 10-24 21-34 39 6 3 12 4 18 4 20 0 30-19 30-40 0-16-2-27-2-31Z" />
    <path d="M14 90c6-14 13-25 21-34l7 6c-8 9-14 19-19 31Z" />
  </g>
)

/** Elèctric — a bolt. */
const Electric = () => (
  <path fill="currentColor" d="M60 6 22 56h22l-6 38 38-52H54Z" />
)

/** Gel — a six-armed snowflake with barbs, which is what makes it read as ice not as a star. */
const Ice = () => (
  <g
    stroke="currentColor"
    strokeWidth="7"
    strokeLinecap="round"
    fill="none"
    transform="translate(50 50)"
  >
    {[0, 60, 120].map(angle => (
      <g key={angle} transform={`rotate(${angle})`}>
        <path d="M0 -40V40" />
        <path d="M-11 -29 0 -40l11 11" />
        <path d="M-11 29 0 40l11 -11" />
        <path d="M-9 -12 0 -20l9 8" />
        <path d="M-9 12 0 20l9 -8" />
      </g>
    ))}
  </g>
)

/** Lluita — a boxing glove. A bare fist is a hand; a glove is unmistakably a fight. */
const Fighting = () => (
  <g fill="currentColor">
    <path d="M28 20h30c14 0 24 11 24 25v9c0 8-4 14-10 17H34c-8-4-14-13-14-24V32c0-7 4-12 8-12Z" />
    <rect x="28" y="76" width="48" height="16" rx="8" />
    <path d="M20 40c-6 1-10 6-10 12s4 11 10 12Z" />
  </g>
)

/** Verí — a flask with bubbles rising. Deliberately not a droplet: that's water's shape. */
const Poison = () => (
  <g fill="currentColor">
    <path d="M40 10h20v6h-4v20l20 34a12 12 0 0 1-10 18H34a12 12 0 0 1-10-18l20-34V16h-4Z" />
    <circle cx="43" cy="72" r="6" opacity="0.55" />
    <circle cx="60" cy="66" r="4.5" opacity="0.55" />
    <circle cx="54" cy="80" r="3.5" opacity="0.55" />
  </g>
)

/** Terra — a mound of earth with pebbles and a crack, seen from the side. */
const Ground = () => (
  <g fill="currentColor">
    <path d="M6 76c10 0 14-10 22-18s16-14 24-14 15 5 22 13 12 19 20 19v10H6Z" />
    <path d="M46 44v-9m0 -9v-8" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <circle cx="22" cy="86" r="5" />
    <circle cx="50" cy="88" r="6" />
    <circle cx="78" cy="86" r="5" />
  </g>
)

/** Volador — a wing. Feathers are cut in rather than drawn, so it holds up small. */
const Flying = () => (
  <path
    fill="currentColor"
    fillRule="evenodd"
    d="M8 30c26-6 52 2 70 20 8 8 14 18 16 28-12-4-20-10-27-17l-3 9c-6-6-10-11-14-17l-5 8c-6-7-10-13-14-20l-7 6C17 43 12 36 8 30Z"
  />
)

/** Psíquic — a spiral. The one abstract glyph, and the only shape that suggests "mind". */
const Psychic = () => (
  <path
    fill="none"
    stroke="currentColor"
    strokeWidth="9"
    strokeLinecap="round"
    d="M50 50a8 8 0 1 1 8 8 18 18 0 0 1-18-18 28 28 0 0 1 28-28 38 38 0 0 1 38 38"
    transform="translate(-6 -2)"
  />
)

/** Insecte — a beetle from above. Legs and antennae are what say "bug" rather than "seed". */
const Bug = () => (
  <g fill="currentColor">
    <ellipse cx="50" cy="58" rx="24" ry="30" />
    <circle cx="50" cy="24" r="13" />
    {/* The wing seam. A flat black wash rather than `--glyph-cut`, because it only has to
        darken whatever colour the body is, not match the surface behind it. */}
    <path d="M50 30v58" stroke="rgba(0,0,0,0.28)" strokeWidth="5" />
    <g stroke="currentColor" strokeWidth="7" strokeLinecap="round">
      <path d="M40 16 30 4M60 16 70 4" />
      <path d="M26 44 8 36M26 60 6 60M28 76 12 86" />
      <path d="M74 44 92 36M74 60 94 60M72 76 88 86" />
    </g>
  </g>
)

/** Roca — three stacked boulders. */
const Rock = () => (
  <g fill="currentColor">
    <path d="M50 8 74 26 66 46H34l-8-20Z" />
    <path d="M22 52 42 52 50 76 34 92 12 78 14 60Z" />
    <path d="M58 52h22l8 16-8 20-24-4-6-16Z" />
  </g>
)

/** Fantasma — a sheet ghost with a scalloped hem and two eyes. */
const Ghost = () => (
  <g fill="currentColor">
    <path d="M50 8a34 34 0 0 0-34 34v50l13-11 12 11 9-9 9 9 12-11 13 11V42A34 34 0 0 0 50 8Z" />
    <g fill="var(--glyph-cut, #16161a)">
      <ellipse cx="38" cy="42" rx="7" ry="9" />
      <ellipse cx="62" cy="42" rx="7" ry="9" />
    </g>
  </g>
)

/** Drac — a horned head in profile with a jaw. Reads as "the big scary one", which it is. */
const Dragon = () => (
  <g fill="currentColor">
    <path d="M18 34c0-13 11-24 25-24h10l14-8-2 12 16-6-8 14c8 4 13 12 13 22 0 8-4 15-10 19l6 25-24-14H43C29 74 18 62 18 48Z" />
    <g fill="var(--glyph-cut, #16161a)">
      <circle cx="40" cy="38" r="6" />
    </g>
    <path d="M18 56 6 74l20-4Z" />
  </g>
)

const GLYPHS = {
  normal: Normal,
  fire: Fire,
  water: Water,
  grass: Grass,
  electric: Electric,
  ice: Ice,
  fighting: Fighting,
  poison: Poison,
  ground: Ground,
  flying: Flying,
  psychic: Psychic,
  bug: Bug,
  rock: Rock,
  ghost: Ghost,
  dragon: Dragon,
}
