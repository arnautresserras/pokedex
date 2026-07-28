import { useReducedMotion } from './useReducedMotion'
import styles from './SceneTransition.module.css'

/**
 * Scene / card transition. Whenever the screen's *content* changes without the screen
 * itself changing — next story scene, next evolution stage, next game round — the new
 * content animates in so the change is legible as a change rather than a flicker.
 *
 * Enter-only by design: cross-fading an outgoing copy would double-render 151 grids and
 * hero images for no benefit a child would notice.
 *
 * `direction` picks the axis: 'forward' | 'back' | 'up' | 'none'.
 * Reduced motion swaps instantly — the content change is itself the signal here, so there
 * is nothing to substitute.
 */
export default function SceneTransition({
  sceneKey,
  direction = 'forward',
  className = '',
  children,
}) {
  const reduced = useReducedMotion()
  const classes = [styles.scene, styles[direction] ?? styles.forward, className]
    .filter(Boolean)
    .join(' ')

  if (reduced) {
    return (
      <div key={sceneKey} className={[styles.scene, className].filter(Boolean).join(' ')}>
        {children}
      </div>
    )
  }

  return (
    <div key={sceneKey} className={classes}>
      {children}
    </div>
  )
}
