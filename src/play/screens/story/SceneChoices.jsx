import { Tappable } from '../../motion'
import ChoiceGlyph from './ChoiceGlyph'
import styles from './SceneChoices.module.css'

/**
 * The fork in the path, as two pictures.
 *
 * This is the only thing in Story mode the child operates, and the spec is unambiguous that it
 * has to work with no reading at all — so a choice is a picture of where it leads, full-bleed,
 * with the words demoted to a strip along the bottom. The label is for the parent, who reads it
 * as the offer ("sacsegem la branca o mirem sota les fulles?"); it's the same bargain the room
 * tiles and the answer options make, and as there, the picture is the affordance.
 *
 * **Both choices look identical in weight.** No primary, no ordering hint, nothing pre-selected
 * — the story has no wrong turns and the screen must not suggest one is the real one. Which
 * also means the tiles are fixed-size rather than stretched to fill: two choices are the common
 * case but a scene with one (a "keep going") must not become one enormous tile spanning the
 * screen, and a three-way fork must not squeeze into thirds.
 */
export default function SceneChoices({ choices = [], labels = {}, onChoose, className = '' }) {
  return (
    <div className={[styles.choices, className].filter(Boolean).join(' ')}>
      {/* Keyed by position: the list is fixed for the life of a scene, and two choices leading
          to the same scene is a legitimate shape a key on `next` would break. */}
      {choices.map((choice, i) => (
        <Tappable
          key={i}
          className={styles.choice}
          onTap={() => onChoose(choice)}
          aria-label={labels[choice.icon] ?? choice.icon}
        >
          <ChoiceGlyph icon={choice.icon} className={styles.picture} />
          {labels[choice.icon] && <span className={styles.label}>{labels[choice.icon]}</span>}
        </Tappable>
      ))}
    </div>
  )
}
