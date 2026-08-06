import { Tappable } from '../../motion'
import styles from './Finish.module.css'

/**
 * The ending scene's tap targets. An episode has no `next` scene inside its own graph, so this
 * replaces `Continue` rather than reusing it — reusing it would put the exact same accent circle
 * and single chevron on screen that every mid-episode scene already uses to mean "keep going",
 * which is what made an ending read as just another scene. Two shapes, two colours, and (when
 * there's a next episode) two targets instead of one: a double chevron for the next episode,
 * a grid — the same picture `SeriesIndex` uses for itself — for going back to pick a different
 * one. The last episode has no next, so only the grid renders.
 */
export default function Finish({ hasNext, onNext, onEpisodes }) {
  return (
    <div className={styles.end}>
      {hasNext && (
        <Tappable
          className={styles.option}
          pressScale={0.94}
          onTap={onNext}
          aria-label="Següent episodi"
        >
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="30" fill="var(--color-accent)" />
            <path
              d="M14 19l14 13-14 13M31 19l14 13-14 13"
              fill="none"
              stroke="#f6f6f8"
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Tappable>
      )}

      <Tappable
        className={styles.option}
        pressScale={0.94}
        onTap={onEpisodes}
        aria-label="Tria un altre episodi"
      >
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="30" fill="var(--color-primary)" />
          <rect x="15" y="15" width="14" height="14" rx="3" fill="#f6f6f8" />
          <rect x="35" y="15" width="14" height="14" rx="3" fill="#f6f6f8" />
          <rect x="15" y="35" width="14" height="14" rx="3" fill="#f6f6f8" />
          <rect x="35" y="35" width="14" height="14" rx="3" fill="#f6f6f8" />
        </svg>
      </Tappable>
    </div>
  )
}
