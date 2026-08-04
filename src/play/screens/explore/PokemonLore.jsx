import { useState } from 'react'
import { Tappable } from '../../motion'
import styles from './PokemonLore.module.css'

/**
 * The GameBoy flavor text, for the parent reading the card aloud — not the child, but it lives
 * in the card's own flow rather than behind a tap or a modal: it's material to read while the
 * card is already open, not a separate screen to go find.
 *
 * The cache carries one entry per game version (Red/Yellow/Gold/Silver, always all four), so
 * this pages through them rather than picking one — different wording per version is the whole
 * value of having more than a single description to read from.
 */
export default function PokemonLore({ flavorTexts, className = '' }) {
  const [index, setIndex] = useState(0)

  if (!flavorTexts?.length) return null

  const entry = flavorTexts[index]
  const prev = () => setIndex(i => (i - 1 + flavorTexts.length) % flavorTexts.length)
  const next = () => setIndex(i => (i + 1) % flavorTexts.length)

  return (
    <div className={[styles.lore, className].filter(Boolean).join(' ')}>
      <div className={styles.header}>
        <span className={styles.version}>{entry.version}</span>

        {flavorTexts.length > 1 && (
          <div className={styles.pager}>
            <Tappable className={styles.arrow} onTap={prev} aria-label="Descripció anterior">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path
                  d="M19 8l-8 8 8 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Tappable>

            <div className={styles.dots}>
              {flavorTexts.map((f, i) => (
                <span key={f.version} className={i === index ? styles.dotActive : styles.dot} />
              ))}
            </div>

            <Tappable className={styles.arrow} onTap={next} aria-label="Descripció següent">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path
                  d="M13 8l8 8-8 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Tappable>
          </div>
        )}
      </div>

      <p className={styles.text}>{entry.text}</p>
    </div>
  )
}
