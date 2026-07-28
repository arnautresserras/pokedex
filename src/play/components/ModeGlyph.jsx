import { artUrl } from '../utils/playAssets'
import { getPlayTypeColors } from '../utils/playColors'
import styles from './ModeGlyph.module.css'

/**
 * The pictogram for each mode. This is the whole navigation model for a non-reader, so each
 * glyph is a **preview of its destination** rather than a symbol to be decoded:
 *
 *   explore → the type-room index itself, six coloured rooms in miniature ("pick a colour")
 *   story   → an open book with a forest on the page — the object the parent holds and reads
 *   game    → an actual silhouette with a "?", which is literally the game screen
 *
 * Nothing here is an abstract icon a 4-year-old would have to be taught. Everything is inline
 * SVG or a vendored asset — no icon font, no remote request, nothing a service worker can
 * miss. Colours come from the mode's `--color-*` vars, so one component serves tile and
 * screen at any size.
 */

/** Six rooms, spread across the spectrum so the miniature reads as "lots of colours". */
const ROOM_TYPES = ['fire', 'water', 'grass', 'electric', 'psychic', 'ghost']

/** Pikachu — the most recognisable silhouette in the set, and the game's own staging. */
const GUESS_ID = 25

export default function ModeGlyph({ mode, className = '' }) {
  const classes = [styles.glyph, className].filter(Boolean).join(' ')

  switch (mode) {
    case 'explore':
      return <ExploreGlyph className={classes} />
    case 'story':
      return <StoryGlyph className={classes} />
    case 'game':
      return <GameGlyph className={classes} />
    default:
      return null
  }
}

/** The type-room index in miniature: 3 × 2 rooms, in real type colours. */
function ExploreGlyph({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      {ROOM_TYPES.map((type, i) => (
        <rect
          key={type}
          x={(i % 3) * 36}
          y={Math.floor(i / 3) * 36 + 14}
          width="28"
          height="28"
          rx="8"
          fill={getPlayTypeColors(type).primary}
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="2.5"
        />
      ))}
    </svg>
  )
}

/** An open book, with a forest growing out of the right-hand page. */
function StoryGlyph({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <g stroke="var(--color-accent)" strokeWidth="3.5" strokeLinejoin="round">
        <path d="M50 26C40 18 24 15 11 19v57c13-4 29-1 39 7z" fill="var(--play-ink)" />
        <path d="M50 26c10-8 26-11 39-7v57c-13-4-29-1-39 7z" fill="var(--play-ink)" />
      </g>
      {/* Lines of prose on the left page — the parent's half. */}
      <g stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" opacity="0.75">
        <path d="M20 40h22" />
        <path d="M20 52h22" />
        <path d="M20 64h14" />
      </g>
      {/* The forest on the right page — where the first story goes. */}
      <g fill="var(--color-primary)">
        <path d="M71 34 84 62H58z" />
        <rect x="67.5" y="60" width="7" height="12" rx="2" fill="var(--color-accent)" />
      </g>
    </svg>
  )
}

/** A silhouette and a question mark — the game screen, shrunk to an icon. */
function GameGlyph({ className }) {
  return (
    <span className={[className, styles.game].filter(Boolean).join(' ')}>
      <img className={styles.silhouette} src={artUrl(GUESS_ID)} alt="" draggable="false" />
      <span className={styles.question} aria-hidden="true">
        ?
      </span>
    </span>
  )
}
