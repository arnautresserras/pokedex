import Backdrop from '../story/Backdrop'
import Narration from '../story/Narration'
import Cast from './Cast'
import styles from './EpisodeScene.module.css'

/**
 * One scene: the place, the words, and the one thing the child can do — "Aventures"' version
 * of `StoryScene`, same idea (a backdrop, a narration panel anchored bottom, one action slot,
 * a cast row that hides for an encounter the same way `Protagonist` does) but its own CSS
 * module: this mode's narration runs much longer than Story's, which inverts which row needs
 * the guaranteed space — see `EpisodeScene.module.css`'s header note.
 *
 * The other real difference from Story mode is `Cast` in place of `Protagonist`: an episode
 * scene can name more than one character standing there at once (Ash plus whoever the scene
 * calls for), where a story names exactly one protagonist.
 */
export default function EpisodeScene({ scene, kind, protagonist, cast, children }) {
  const isEncounter = kind === 'encounter'
  const castIds = [protagonist, ...(cast ?? [])].filter(Boolean)

  return (
    <div className={styles.scene}>
      <Backdrop id={scene.backdrop} />

      <div className={styles.layout} data-action={kind}>
        {!isEncounter && castIds.length > 0 && (
          <Cast ids={castIds} className={styles.protagonist} />
        )}
        <Narration lines={scene.narration} className={styles.narration} />
        <div className={styles.action}>{children}</div>
      </div>
    </div>
  )
}
