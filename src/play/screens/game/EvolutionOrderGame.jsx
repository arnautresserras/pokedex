import { useState } from 'react'
import { Tappable, Celebrate } from '../../motion'
import { pokemonTypes, typeCssVars } from '../../utils/playColors'
import { artUrl } from '../../utils/playAssets'
import { onPokemonTap } from '../../utils/onPokemonTap'
import styles from './EvolutionOrderGame.module.css'

/**
 * "Ordena l'evolució" — put a chain's stages in order, by tapping.
 *
 * `round.sequence` is the correct order, `round.order` is the same Pokémon shuffled for
 * display. The slots row fills in left to right as the *next expected* stage gets tapped;
 * tapping anything else does nothing beyond `Tappable`'s own press feedback — same reasoning as
 * `AnswerOptions`' "no fail state" note, extended to a puzzle that has no single wrong answer to
 * mark, only "not yet". A tile that's already been placed is disabled rather than removed, so
 * the six-tile row never reflows mid-round.
 *
 * The payoff on finishing borrows the rest of Game's grammar: `Celebrate`, and the slots' light
 * pool taking the *last* stage's own type colour — the same "colour is the reward" trick
 * `SilhouetteStage` and `TypeStage` both use, just triggered by finishing the sequence instead
 * of a single tap.
 */
export default function EvolutionOrderGame({ round, onDone }) {
  const { sequence, order } = round
  const [collected, setCollected] = useState([])

  const done = collected.length === sequence.length
  const [finalType] = pokemonTypes(sequence[sequence.length - 1])

  const tap = pokemon => {
    if (done) return
    const expected = sequence[collected.length]
    if (pokemon.id === expected.id) {
      setCollected(c => [...c, pokemon.id])
    }
  }

  return (
    <>
      {/* A sibling of `.tiles` below, not a parent — same two-row split `Game.module.css`
          gives every other activity, so the "next" button (anchored to this element's own
          bottom-right) never has a tile sitting under it. */}
      <div
        className={styles.stage}
        style={done ? typeCssVars(finalType) : undefined}
        data-done={done ? 'true' : undefined}
      >
        <Celebrate active={done} color="var(--color-primary)" className={styles.celebrate}>
          <div className={styles.slots}>
            {sequence.map((pokemon, i) => {
              const filled = i < collected.length
              return (
                <div key={pokemon.id} className={styles.slotWrap}>
                  {i > 0 && (
                    <span className={styles.arrow} aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M6 4 16 12 6 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                  <div className={styles.slot} data-filled={filled ? 'true' : undefined}>
                    {filled ? (
                      <img
                        className={styles.slotArt}
                        src={artUrl(pokemon.id)}
                        alt=""
                        draggable="false"
                      />
                    ) : (
                      <span className={styles.slotNumber}>{i + 1}</span>
                    )}
                  </div>
                </div>
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

      <div className={styles.tiles}>
        {order.map(pokemon => {
          const placed = collected.includes(pokemon.id)
          return (
            <Tappable
              key={pokemon.id}
              className={[styles.tile, placed ? styles.placed : ''].filter(Boolean).join(' ')}
              disabled={placed || done}
              onTap={() => onPokemonTap(pokemon, { source: 'game-evolution-order', then: tap })}
              aria-label={pokemon.name}
            >
              <img className={styles.tileArt} src={artUrl(pokemon.id)} alt="" draggable="false" />
            </Tappable>
          )
        })}
      </div>
    </>
  )
}
