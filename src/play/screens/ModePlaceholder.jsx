import { ModeScreen, ModeGlyph } from '../components'
import styles from './ModePlaceholder.module.css'

/**
 * Temporary landing screen for a mode that hasn't been built yet — Explore (slice 3), Game
 * (slice 4), Story (slice 5) each replace it in turn.
 *
 * It exists because slice 2's second deliverable is a home affordance that's in the same
 * corner *inside every mode*, and that can't be built or checked on the iPad against three
 * routes that don't render. So each route renders the real `ModeScreen` shell — real colour,
 * real entry transition, real home button — with the mode's own pictogram as its content.
 *
 * Which also means a tapped tile always goes somewhere recognisable and always offers a way
 * back: for a child, a dead route and a dead app are the same thing.
 */
export default function ModePlaceholder({ mode }) {
  return (
    <ModeScreen mode={mode} className={styles.placeholder}>
      <span className={styles.glyphBox}>
        <ModeGlyph mode={mode.id} />
      </span>
      <h1 className={styles.title}>{mode.label}</h1>
      <p className={styles.note}>Aviat!</p>
    </ModeScreen>
  )
}
