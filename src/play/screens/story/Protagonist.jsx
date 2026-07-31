import { protagonistBackUrl } from '../../peopleSprites'
import { backSpriteUrl } from '../../utils/playAssets'
import styles from './Protagonist.module.css'

/**
 * The child's stand-in on the trail: a small back-view sprite, walking the same path the
 * narration is describing. Scenery, like `Backdrop` — no tap target, no name, nothing to read.
 *
 * A story names its protagonist (`story.protagonist`) as either a `peopleSprites` id — a
 * person, the common case — or `{ pokemon: <id> }`, when the story is led by a Pokémon instead
 * (Pikachu walking its own trail rather than a trainer). This component doesn't know or care
 * which character either shape resolves to, which is what keeps a second story free to cast a
 * different one. `StoryScene` only renders it for a narrated scene — the encounter's stage
 * belongs entirely to the Pokémon that's met there.
 */
export default function Protagonist({ id, className = '' }) {
  const src = typeof id === 'object' && id !== null ? backSpriteUrl(id.pokemon) : protagonistBackUrl(id)
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
