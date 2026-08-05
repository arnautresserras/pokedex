import { Celebrate, Tappable } from '../../motion'
import { pokemonTypes, typeCssVars } from '../../utils/playColors'
import { artUrl } from '../../utils/playAssets'
import { onPokemonTap } from '../../utils/onPokemonTap'
import styles from './TypeStage.module.css'

/**
 * The top half of "Quin color?" — `SilhouetteStage`'s sibling for the type-matching activity.
 * Same frame, same reveal grammar (name hidden as `?`, `Celebrate`, the light pool switching to
 * the Pokémon's own type colour), reusing `SilhouetteStage.module.css` because the layout is
 * identical down to the pixel.
 *
 * **The art is never a silhouette here.** This activity isn't about recognising a shape — it's
 * about recognising a colour, and the colour is the whole question, so hiding it would hide the
 * thing being asked about. Only the *name* stays behind the reveal, same as everywhere else in
 * Game.
 *
 * `FamilyGame` reuses this component as-is for its prompt: "show a Pokémon in full colour, name
 * hidden until revealed" is exactly what "who does this belong with?" needs too, so that
 * activity adds no stage of its own.
 */
export default function TypeStage({ pokemon, revealed, onNext }) {
  const [primaryType] = pokemonTypes(pokemon)

  return (
    <div
      className={styles.stage}
      style={revealed ? typeCssVars(primaryType) : undefined}
      data-revealed={revealed ? 'true' : undefined}
    >
      <p className={styles.name}>{revealed ? pokemon.name : '?'}</p>

      <Celebrate
        active={revealed}
        color="var(--color-primary)"
        className={styles.celebrate}
      >
        <Tappable
          className={styles.artTap}
          disabled={!revealed}
          pressScale={0.97}
          onTap={() => onPokemonTap(pokemon, { source: 'game-type-reveal', then: () => onNext() })}
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
