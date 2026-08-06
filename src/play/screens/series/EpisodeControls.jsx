import { Tappable } from '../../motion'
import styles from './EpisodeControls.module.css'

/**
 * Back one scene, start again, or pick a different episode — "Aventures"' version of Story's
 * `ParentControls`, copied rather than imported (see that component's note: it's Story-specific,
 * this is Series-specific) with `onStories` renamed to `onEpisodes`. Same deliberately-small,
 * always-mounted, never-shifts-position reasoning throughout.
 */
export default function EpisodeControls({ onBack, canBack, onRestart, onEpisodes }) {
  return (
    <div className={styles.controls}>
      <Tappable
        className={styles.control}
        disabled={!canBack}
        onTap={onBack}
        pressScale={0.88}
        aria-label="Escena anterior"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path
            d="M19 8l-8 8 8 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Tappable>

      <Tappable
        className={styles.control}
        onTap={onRestart}
        pressScale={0.88}
        aria-label="Torna a començar"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path
            d="M25 16a9 9 0 1 1-3.6-7.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M25 4v6h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Tappable>

      {onEpisodes && (
        <Tappable
          className={styles.control}
          onTap={onEpisodes}
          pressScale={0.88}
          aria-label="Tria un altre episodi"
        >
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <rect
              x="7"
              y="6"
              width="16"
              height="20"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path d="M11 12h8M11 17h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </Tappable>
      )}
    </div>
  )
}
