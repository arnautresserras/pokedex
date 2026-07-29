import { Tappable } from '../../motion'
import styles from './ParentControls.module.css'

/**
 * Back one scene, and start again. The two controls the spec asks for, in the corner it asks
 * for, at the size it asks for.
 *
 * **Deliberately small, and that is the entire access control.** They're used mid-narration by
 * an adult who is already holding the device, so anything slower than one tap — a confirmation
 * dialog, a long-press gate, a hidden gesture — is friction paid on every use to prevent a
 * problem whose worst case is "the story jumped a scene". A small target a parent hits on
 * purpose and a child's flat palm doesn't is the right trade, and it's why `--tap-min` exists
 * as an override on `Tappable` rather than these out-specifying the base class.
 *
 * They sit in `ModeScreen`'s `controls` slot — the corner opposite the home button, which the
 * shell owns and no mode may move. Explore puts a full-size back button there for the child;
 * Story putting small ones there is Story's choice, not the slot's.
 *
 * Back stays mounted and merely disabled on the first scene. Hiding it would shift restart
 * sideways between scenes, and a control that moves is a control a parent has to look at
 * instead of reaching for while reading.
 */
export default function ParentControls({ onBack, canBack, onRestart }) {
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
          {/* An open circle with an arrowhead — "again", without a word in it. */}
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
    </div>
  )
}
