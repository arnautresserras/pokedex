import { useNavigate } from 'react-router-dom'
import { Tappable } from '../../motion'
import { EPISODE_LIST, episodePath } from '../../episodes'
import Backdrop from '../story/Backdrop'
import styles from './SeriesIndex.module.css'

/**
 * "Aventures"' front door — one tile per episode, in canon order (no shuffle: unlike Game's
 * activities, the order here is the whole point). Same "a picture of the place, not a title to
 * read" tile Story's `StoryPicker` and Explore's rooms already use: each tile previews the
 * episode's own opening backdrop, with its code as a small corner badge for a parent scanning
 * for a specific one.
 */
export default function SeriesIndex() {
  const navigate = useNavigate()

  return (
    <div className={styles.index}>
      <div className={styles.grid}>
        {EPISODE_LIST.map(episode => {
          const start = episode.scenes[episode.start]
          return (
            <Tappable
              key={episode.id}
              className={styles.tile}
              pressScale={0.975}
              onTap={() => navigate(episodePath(episode))}
              aria-label={episode.title}
            >
              <div className={styles.preview}>
                <Backdrop id={start?.backdrop} />
                <span className={styles.code}>{episode.code}</span>
              </div>
              <span className={styles.label}>{episode.title}</span>
            </Tappable>
          )
        })}
      </div>
    </div>
  )
}
