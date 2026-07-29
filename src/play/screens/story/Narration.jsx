import styles from './Narration.module.css'

/**
 * The teleprompter. One P0 acceptance criterion in the whole slice is about typography — "the
 * narration text is comfortably readable at arm's length" — and this is it, which is why it's
 * its own component rather than a class on the scene: the narrated scenes and the encounter
 * both render it, and there must be exactly one set of numbers to tune on the device.
 *
 * The reader is an adult, standing or sitting with an iPad about 50cm away and a child on
 * their lap, glancing down mid-sentence and back up. That's a different problem from body
 * copy, and the CSS says how it's solved. What this component contributes is the chunking:
 * **one paragraph per array entry, never a joined blob**, so a parent's eye can find its place
 * again by block. It's the reason the content files author narration as a list.
 */
export default function Narration({ lines = [], className = '' }) {
  if (!lines.length) return null

  return (
    <div className={[styles.narration, className].filter(Boolean).join(' ')}>
      {lines.map((line, i) => (
        <p key={i} className={styles.line}>
          {line}
        </p>
      ))}
    </div>
  )
}
