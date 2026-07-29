import { Tappable } from '../motion'
import styles from './BackButton.module.css'

/**
 * "Up one step" — the second half of Explore's navigation, and the counterpart to
 * `HomeButton`'s "all the way out".
 *
 * Explore is three levels deep (rooms → a room → a card) and `HomeButton` deliberately can't
 * be contextual: it's the fixed escape hatch and must mean exactly one thing forever. So the
 * step-back lives in the other corner — `ModeScreen`'s `controls` slot — at full tap-target
 * size, because unlike Story's parent controls this one is for the child and gets used on
 * every card.
 *
 * A chevron pointing back at the pokéball corner, so the two corners read as one row: "back a
 * bit" on the right, "back to the start" on the left.
 */
export default function BackButton({ onTap, className = '' }) {
  return (
    <Tappable
      className={[styles.back, className].filter(Boolean).join(' ')}
      onTap={onTap}
      aria-label="Enrere"
    >
      <svg className={styles.chevron} viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill="rgba(0,0,0,0.34)" />
        <path
          d="M38 16 22 32l16 16"
          fill="none"
          stroke="#f6f6f8"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Tappable>
  )
}
