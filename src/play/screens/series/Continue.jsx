import { Tappable } from '../../motion'
import styles from './Continue.module.css'

/**
 * The one thing a child can do on a narration scene: tap to move on. Episodes have no choice to
 * make (canon doesn't branch), so this replaces `SceneChoices` — same "tap the coloured shape"
 * grammar as `Encounter`'s own art-tap and "another" arrow, just the primary action here rather
 * than a secondary one, so it's sized larger than Encounter's corner arrow.
 */
export default function Continue({ onTap }) {
  return (
    <Tappable
      className={styles.continue}
      pressScale={0.94}
      onTap={onTap}
      aria-label="Continua"
    >
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill="var(--color-accent)" />
        <path
          d="M24 18l16 14-16 14"
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
