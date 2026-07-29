import { Tappable } from '../../motion'
import { spriteUrl } from '../../utils/playAssets'
import { evolutionStages } from '../../utils/evolution'
import { onPokemonTap } from '../../utils/onPokemonTap'
import styles from './EvolutionStrip.module.css'

/**
 * The evolution chain as a row of tappable sprites — the print book's chain diagram with the
 * levels, stones and friendship conditions stripped out, because none of that is readable and
 * none of it is the point. The point is "this one turns into that one, tap it and watch".
 *
 * Tapping a stage opens that Pokémon's card, which is what makes the row an *action* rather
 * than an illustration: the child drives the evolution instead of watching a diagram of it.
 * The current stage is marked and inert.
 *
 * `evolutionStages` has already dropped the non-Gen-I ends of the chain and flattened Eevee's
 * branch shape into a stage with three members — so the only thing left to decide here is
 * layout, and a branching stage simply stacks.
 */
export default function EvolutionStrip({ roster, pokemon, onSelect, className = '' }) {
  const stages = evolutionStages(roster, pokemon)
  if (!stages.length) return null

  return (
    <div className={[styles.strip, className].filter(Boolean).join(' ')}>
      {stages.map((stage, i) => (
        <div key={i} className={styles.step}>
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
          {/* A branch is a column, so Eevee's three outcomes read as three doors off the same
              room rather than as a chain three evolutions long. */}
          <div className={stage.length > 1 ? styles.branch : styles.single}>
            {stage.map(stagePokemon => {
              const current = stagePokemon.id === pokemon.id
              return (
                <Tappable
                  key={stagePokemon.id}
                  className={[styles.stage, current ? styles.current : '']
                    .filter(Boolean)
                    .join(' ')}
                  disabled={current}
                  onTap={() =>
                    onPokemonTap(stagePokemon, { source: 'explore-evolution', then: onSelect })
                  }
                  aria-label={stagePokemon.name}
                  aria-current={current ? 'true' : undefined}
                >
                  <img
                    className={styles.sprite}
                    src={spriteUrl(stagePokemon.id)}
                    alt=""
                    draggable="false"
                  />
                </Tappable>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
