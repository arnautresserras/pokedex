import { useNavigate } from 'react-router-dom'
import { Tappable } from '../../motion'
import { ACTIVITIES, ACTIVITY_KEYS, activityPath } from './activities'
import { ActivityIcon, MixIcon } from './ActivityIcon'
import styles from './GameIndex.module.css'

/**
 * Game's front door — one big tile per activity, plus "Barrejat" for a fresh one every round.
 * Same reasoning `TypeRoomIndex` and `StoryPicker` already settled on: a corner control a child
 * has to notice and open (`ActivityPicker`, now gone) stops scaling once there's more than a
 * couple of options, and it's a setting a parent operates *for* the child rather than a choice
 * the child makes herself. A picker screen turns "which game" into the same kind of tap Explore's
 * rooms already are.
 *
 * Unlike Explore's rooms, there's no natural colour to tell eight tiles apart by — Game has one
 * mode colour, not fifteen types — so every tile shares the same gradient and differs only by
 * icon and label. "Barrejat" comes first, same position every time, so its place is as learnable
 * as any of the labelled ones.
 */
export default function GameIndex() {
  const navigate = useNavigate()

  const go = key => navigate(activityPath(key), { state: { dir: 'forward' } })

  return (
    <div className={styles.index}>
      <div className={styles.grid}>
        <Tappable
          className={styles.tile}
          pressScale={0.965}
          onTap={() => go('mix')}
          aria-label="Barrejat"
        >
          <span className={styles.glyphBox}>
            <MixIcon />
          </span>
          <span className={styles.label}>Barrejat</span>
        </Tappable>

        {ACTIVITY_KEYS.map(key => (
          <Tappable
            key={key}
            className={styles.tile}
            pressScale={0.965}
            onTap={() => go(key)}
            aria-label={ACTIVITIES[key].label}
          >
            <span className={styles.glyphBox}>
              <ActivityIcon activityKey={key} />
            </span>
            <span className={styles.label}>{ACTIVITIES[key].label}</span>
          </Tappable>
        ))}
      </div>
    </div>
  )
}
