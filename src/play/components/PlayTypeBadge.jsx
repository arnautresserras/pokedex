import { getPlayTypeColors } from '../utils/playColors'
import { getTypeRoom } from '../typeRooms'
import TypeGlyph from './TypeGlyph'
import styles from './PlayTypeBadge.module.css'

/**
 * A type badge for the play app. Distinct from the print book's `TypeBadge` on purpose: this
 * one leads with the **pictogram**, because the badge's job here is to tell a non-reader which
 * room this Pokémon came from — and the room is a colour and a picture, not a word.
 *
 * The word rides along at the small end for the parent, same bargain as the mode labels and
 * the Pokémon's own name.
 *
 * Not tappable. On a card the badge is a statement, not a control — a child who taps it and
 * gets teleported into a different room has lost their place, and Explore's back button is
 * the only way out by design.
 */
export default function PlayTypeBadge({ type, className = '' }) {
  const room = getTypeRoom(type)
  if (!room) return null

  const { primary, accent } = getPlayTypeColors(type)

  // `--glyph-cut` is the badge fill, so a ghost's eyes punch through to the pill rather than
  // to whatever is behind it.
  const vars = { '--badge-primary': primary, '--badge-accent': accent, '--glyph-cut': primary }

  return (
    <span className={[styles.badge, className].filter(Boolean).join(' ')} style={vars}>
      <span className={styles.glyphBox}>
        <TypeGlyph type={type} />
      </span>
      <span className={styles.label}>{room.label}</span>
    </span>
  )
}
