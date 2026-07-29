import { pokemonTraits } from '../../utils/traits'
import styles from './TraitMeters.module.css'

/**
 * The card's "what it's like" row: how big, how heavy, how fast.
 *
 * **No numbers and no bars**, per the spec — a pre-reader can't read "45.5 kg" and a filled
 * bar is a chart. What they can read is *counting*: five discrete pips, some lit, some not.
 * Snorlax lights five weights, Gastly lights one, and the comparison is the whole content of
 * the row. The levels are ranked against all 151 rather than scaled — see `utils/traits.js`,
 * where that decision and its reason live.
 *
 * Each trait has its own pip shape, so the three rows are told apart without reading their
 * labels: a stack of steps for height, a stone for weight, a chevron for speed. The Catalan
 * label is there for the parent.
 */
export default function TraitMeters({ roster, pokemon, className = '' }) {
  const traits = pokemonTraits(roster, pokemon)

  return (
    <div className={[styles.meters, className].filter(Boolean).join(' ')}>
      {traits.map(trait => (
        <div key={trait.id} className={styles.row}>
          <span className={styles.label}>{trait.label}</span>
          <span
            className={styles.pips}
            role="img"
            aria-label={`${trait.label} ${trait.level}/${trait.levels}`}
          >
            {Array.from({ length: trait.levels }, (_, i) => (
              <PipIcon
                key={i}
                trait={trait.id}
                lit={i < trait.level}
                // Pips grow left to right, so "how many" and "how big" say the same thing
                // twice — a four-year-old reads the ramp before they count the pips.
                scale={0.66 + (i / (trait.levels - 1)) * 0.34}
              />
            ))}
          </span>
        </div>
      ))}
    </div>
  )
}

function PipIcon({ trait, lit, scale }) {
  return (
    <svg
      className={[styles.pip, lit ? styles.lit : styles.unlit].join(' ')}
      viewBox="0 0 24 24"
      style={{ '--pip-scale': scale }}
      aria-hidden="true"
    >
      {PIPS[trait]}
    </svg>
  )
}

const PIPS = {
  /** A step — the pips form a staircase, which is "taller" without a word. */
  height: <rect x="6" y="2" width="12" height="20" rx="3" fill="currentColor" />,
  /** A stone: squat and bottom-heavy, so the row reads as weight before it's counted. */
  weight: (
    <path d="M5 20 3 12l5-8h8l5 8-2 8Z" fill="currentColor" />
  ),
  /** A chevron pointing the way the row is read. */
  speed: (
    <path
      d="M7 3 17 12 7 21"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
}
