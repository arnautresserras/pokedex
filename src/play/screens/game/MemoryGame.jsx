import { useRef, useState } from 'react'
import { Tappable, Celebrate } from '../../motion'
import { artUrl } from '../../utils/playAssets'
import styles from './MemoryGame.module.css'

/** How long a mismatched pair stays face-up before flipping back — long enough to register. */
const RESOLVE_MS = 700

/**
 * "Memory" — flip two cards, find the match. `round.cards` is already a shuffled grid of
 * `{ key, pokemon }`, two cards per Pokémon (same artwork twice, since the skill here is
 * remembering *where* things are, not telling two Pokémon apart).
 *
 * Unlike every other activity in Game, there's a brief window where taps have to be ignored —
 * the pause after a second card flips, so a mismatch is visible before it flips back. `resolving`
 * is a ref rather than state because it only ever gates the tap handler and should never itself
 * trigger a render.
 *
 * Finished (`done`) is "every card matched", not a single reveal, so `Celebrate` wraps the whole
 * board rather than one Pokémon — the payoff is the completed grid, not any one card in it.
 */
export default function MemoryGame({ round, onDone }) {
  const { cards } = round
  const [faceUp, setFaceUp] = useState([])
  const [matched, setMatched] = useState(new Set())
  const resolving = useRef(false)

  const done = matched.size === cards.length

  const tap = card => {
    if (resolving.current || faceUp.includes(card.key) || matched.has(card.key)) return

    const next = [...faceUp, card.key]
    setFaceUp(next)
    if (next.length < 2) return

    resolving.current = true
    const [a, b] = next.map(key => cards.find(c => c.key === key))
    const isMatch = a.pokemon.id === b.pokemon.id

    setTimeout(() => {
      if (isMatch) setMatched(m => new Set([...m, a.key, b.key]))
      setFaceUp([])
      resolving.current = false
    }, RESOLVE_MS)
  }

  return (
    <div className={styles.stage} data-done={done ? 'true' : undefined}>
      <Celebrate active={done} color="var(--color-primary)" className={styles.celebrate}>
        <div className={styles.grid}>
          {cards.map(card => {
            const isMatched = matched.has(card.key)
            const isUp = isMatched || faceUp.includes(card.key)
            return (
              <Tappable
                key={card.key}
                className={styles.card}
                disabled={isUp}
                onTap={() => tap(card)}
                aria-label={isUp ? card.pokemon.name : 'Carta'}
              >
                <div className={[styles.inner, isUp ? styles.flipped : ''].join(' ')}>
                  <div className={styles.back} aria-hidden="true" />
                  <div className={styles.front}>
                    <img
                      className={styles.art}
                      src={artUrl(card.pokemon.id)}
                      alt=""
                      draggable="false"
                    />
                  </div>
                </div>
              </Tappable>
            )
          })}
        </div>
      </Celebrate>

      {done && (
        <Tappable className={styles.next} onTap={onDone} aria-label="Següent">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="30" fill="var(--color-accent)" />
            <path
              d="M26 16l16 16-16 16"
              fill="none"
              stroke="#f6f6f8"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Tappable>
      )}
    </div>
  )
}
