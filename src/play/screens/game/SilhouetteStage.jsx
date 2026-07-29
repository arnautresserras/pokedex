import { Celebrate, Tappable } from '../../motion'
import { pokemonTypes, typeCssVars } from '../../utils/playColors'
import { artUrl } from '../../utils/playAssets'
import { onPokemonTap } from '../../utils/onPokemonTap'
import styles from './SilhouetteStage.module.css'

/**
 * The top half of Game mode: the question, and then the payoff.
 *
 * **This is the screen the whole slice is about.** With the iPad muted there is no chime, no
 * "that's right!", no voice — so the reveal has to be the loudest thing in the app, and it has
 * to be loud in four ways at once, because any one of them can be the one a given child reads:
 *
 *   1. the shape **fills with colour** — a black silhouette becoming a Pokémon is the event
 *   2. `Celebrate` pops it and throws a ring of sparks off it
 *   3. the light pool behind it changes from the mode's amber to **the Pokémon's own type
 *      colour** — the same beige-to-blue trick Explore's card uses for an evolution
 *   4. the `?` above it is replaced by the name, for the parent to read aloud
 *
 * Only (2) is animation. That's deliberate: under `prefers-reduced-motion` the colour fill, the
 * colour change and the name are all still there and all still instant, so the reveal still
 * *signals*, which is the plan's requirement — a reduced-motion variant that merely skipped the
 * animation would leave a child with no feedback at all.
 *
 * There is no timing to catch, either. Nothing auto-advances: the reveal stays until the child
 * taps on. Both the art and the arrow do that, because a 4-year-old handed a Pokémon that just
 * burst into colour taps the Pokémon.
 *
 * The type colour is injected **only once revealed** — while asking, the stage stays in the
 * mode's amber, or the light pool behind the silhouette would quietly announce the answer.
 */
export default function SilhouetteStage({ pokemon, revealed, onNext }) {
  const [primaryType] = pokemonTypes(pokemon)

  return (
    <div
      className={styles.stage}
      style={revealed ? typeCssVars(primaryType) : undefined}
      data-revealed={revealed ? 'true' : undefined}
    >
      {/* One row for both states, so the art doesn't jump when the name arrives. */}
      <p className={styles.name}>{revealed ? pokemon.name : '?'}</p>

      <Celebrate
        active={revealed}
        color="var(--color-primary)"
        className={styles.celebrate}
      >
        {/* Mounted with the same `src` in both states rather than swapped: the browser keeps
            the decoded image, and only the filter changes. Disabled while asking — tapping the
            silhouette must not skip the question. */}
        <Tappable
          className={styles.artTap}
          disabled={!revealed}
          pressScale={0.97}
          onTap={() => onPokemonTap(pokemon, { source: 'game-reveal', then: () => onNext() })}
          aria-label={revealed ? pokemon.name : undefined}
        >
          <img className={styles.art} src={artUrl(pokemon.id)} alt="" draggable="false" />
        </Tappable>
      </Celebrate>

      {revealed && (
        <Tappable className={styles.next} onTap={onNext} aria-label="Següent">
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
