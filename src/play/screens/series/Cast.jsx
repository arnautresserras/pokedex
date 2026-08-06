import { characterUrl } from '../../animeCharacters'
import styles from './Cast.module.css'

/**
 * The human (and Team Rocket) cast standing alongside the narration — "Aventures"' equivalent
 * of Story mode's `Protagonist`, but often more than one figure at once (Ash plus whoever the
 * scene names). Scenery, like `Backdrop` and `Protagonist` — no tap target, no name to read.
 *
 * `ids` is always `[episode.protagonist, ...(scene.cast ?? [])]`, built by the caller — this
 * component just resolves each id through `characterUrl` and drops any that don't resolve
 * (never throws), same "unknown id costs atmosphere, not playability" contract every asset
 * lookup in the play app follows.
 */
export default function Cast({ ids = [], className = '' }) {
  const portraits = ids.map(id => ({ id, src: characterUrl(id) })).filter(p => p.src)
  if (!portraits.length) return null

  return (
    <div className={[styles.cast, className].filter(Boolean).join(' ')}>
      {portraits.map(p => (
        <img
          key={p.id}
          className={styles.portrait}
          src={p.src}
          alt=""
          draggable="false"
          aria-hidden="true"
        />
      ))}
    </div>
  )
}
