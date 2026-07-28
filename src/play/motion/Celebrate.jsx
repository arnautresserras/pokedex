import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'
import styles from './Celebrate.module.css'

const SPARKS = 8
const HOLD_REDUCED_MS = 900

/**
 * The "yes!" primitive — the whole reward for a correct guess in Game mode, and the payoff
 * of an evolution or an encounter elsewhere. With the iPad muted (the normal case) this
 * animation *is* the feedback, so it's deliberately loud: a scale pop on the content, an
 * expanding ring, and a ring of sparks.
 *
 * Reduced motion holds a static bright ring and colour wash for ~900ms instead of animating.
 * Skipping it entirely would leave the child with no signal at all.
 *
 * Flip `active` false → true to fire; `onDone` runs when the celebration finishes.
 */
export default function Celebrate({
  active = false,
  children,
  color = 'var(--play-ink)',
  className = '',
  onDone,
}) {
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  // Bumping the key restarts the CSS animations even if a second correct answer lands fast.
  const [runId, setRunId] = useState(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (!active) {
      setPlaying(false)
      return
    }
    setPlaying(true)
    setRunId(n => n + 1)

    const ms = reduced
      ? HOLD_REDUCED_MS
      : parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--motion-celebrate'),
        ) || 780
    const timer = setTimeout(() => {
      setPlaying(false)
      onDoneRef.current?.()
    }, ms)
    return () => clearTimeout(timer)
  }, [active, reduced])

  const classes = [
    styles.celebrate,
    playing ? styles.playing : '',
    reduced ? styles.reduced : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} style={{ '--celebrate-color': color }}>
      <div key={runId} className={styles.content}>
        {children}
      </div>
      {playing && (
        <div key={`fx-${runId}`} className={styles.fx} aria-hidden="true">
          <span className={styles.ring} />
          <span className={styles.ring2} />
          {!reduced &&
            Array.from({ length: SPARKS }, (_, i) => (
              <span
                key={i}
                className={styles.spark}
                style={{ '--angle': `${(360 / SPARKS) * i}deg` }}
              />
            ))}
        </div>
      )}
    </div>
  )
}
