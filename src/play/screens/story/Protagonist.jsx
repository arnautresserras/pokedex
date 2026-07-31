import { protagonistBackUrl } from '../../peopleSprites'
import styles from './Protagonist.module.css'

/**
 * The child's stand-in on the trail: a small back-view sprite, walking the same path the
 * narration is describing. Scenery, like `Backdrop` — no tap target, no name, nothing to read.
 *
 * A story names its protagonist by id (`FOREST.protagonist`, into the vendored set in
 * `peopleSprites.js`); this component doesn't know or care which character that resolves to,
 * which is what keeps a second story free to cast a different one. `StoryScene` only renders it
 * for a narrated scene — the encounter's stage belongs entirely to the Pokémon.
 */
export default function Protagonist({ id, className = '' }) {
  const src = protagonistBackUrl(id)
  if (!src) return null

  return (
    <img
      className={[styles.protagonist, className].filter(Boolean).join(' ')}
      src={src}
      alt=""
      draggable="false"
      aria-hidden="true"
    />
  )
}
