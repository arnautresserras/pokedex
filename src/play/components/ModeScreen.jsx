import { SceneTransition } from '../motion'
import { modeCssVars } from '../modes'
import HomeButton from './HomeButton'
import styles from './ModeScreen.module.css'

/**
 * The shell every mode renders inside — Explore, Story and Game all start here.
 *
 * It exists so the two things that have to be identical across modes are *structural* rather
 * than a convention three slices are trusted to follow:
 *
 *   1. **The home affordance is in one corner, always the same one.** Modes don't place it,
 *      can't move it, and can't forget it.
 *   2. **Entering a mode is animated.** With no sound, a tap that swaps the screen with no
 *      motion reads as a glitch; the tile press and this entry are the whole confirmation
 *      that the tap worked.
 *
 * It also injects the mode's `--color-*` vars, so a mode's own CSS never names its colour —
 * the same contract the print book's `PokemonPage` uses for types.
 *
 * `controls` is the opposite corner, deliberately left empty here: it's where Story's
 * back/restart go, small and out of a child's reach-of-habit, per the spec.
 */
export default function ModeScreen({ mode, controls, className = '', children }) {
  return (
    <div className={styles.screen} style={modeCssVars(mode)} data-mode={mode?.id}>
      <SceneTransition
        sceneKey={mode?.id}
        direction="up"
        className={[styles.body, className].filter(Boolean).join(' ')}
      >
        {children}
      </SceneTransition>
      <HomeButton className={styles.home} />
      {controls ? <div className={styles.controls}>{controls}</div> : null}
    </div>
  )
}
