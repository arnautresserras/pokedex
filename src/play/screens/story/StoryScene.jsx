import Backdrop from './Backdrop'
import Narration from './Narration'
import styles from './StoryScene.module.css'

/**
 * One scene: the place, the words, and the one thing the child can do.
 *
 * Every scene has that shape — including the encounter, which is why this component takes its
 * action as a slot instead of branching on `scene.type`. A narrated scene puts choices in the
 * slot, an encounter puts the Pokémon in it, and the frame around them is identical: same
 * backdrop treatment, same narration panel in the same place, same corners. The parent reads
 * from the same spot on the glass for the whole story, which is most of what makes it feel
 * like one story rather than five screens.
 *
 * **The narration sits along the bottom, not the top.** Two reasons, both practical: the top
 * corners belong to the home button and the parent controls, and a panel up there would either
 * collide with them or push itself down into the middle of the picture; and an adult holding
 * an iPad reads from the lower half, which is also where their thumbs are. That leaves the
 * upper two thirds for the backdrop, so the scene the child is looking at is the biggest thing
 * on screen while the parent talks over it.
 */
export default function StoryScene({ scene, kind, children }) {
  return (
    <div className={styles.scene}>
      <Backdrop id={scene.backdrop} />

      <div className={styles.layout} data-action={kind}>
        <Narration lines={scene.narration} className={styles.narration} />
        <div className={styles.action}>{children}</div>
      </div>
    </div>
  )
}
