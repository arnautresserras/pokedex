import { Celebrate, SceneTransition, Tappable } from '../../motion'
import { PlayTypeBadge } from '../../components'
import { pokemonTypes, typeCssVars } from '../../utils/playColors'
import { artUrl } from '../../utils/playAssets'
import { onPokemonTap } from '../../utils/onPokemonTap'
import styles from './Encounter.module.css'

/**
 * How every story ends: something lives here, and here it is.
 *
 * The last line of narration ends on a **colon** and this supplies the rest of the sentence —
 * the name is next to the art, big, for the parent to read as the punchline. That's the whole
 * reason the encounter isn't just a picture: a reveal a parent *performs* lands harder than one
 * that merely appears, and it costs nothing but a colon in the content file.
 *
 * The Pokémon is drawn from the scene's pool, which is a *place* (see `utils/encounters.js`),
 * so the forest's cast is whoever Gen I says lives in the forest. Seven residents, and the tap
 * on the art meets the next one — which is the mode's replay loop and the reason nothing here
 * ends the story: the child who has just met a Kakuna wants to know who else is under there,
 * and that's one tap, not a re-read. Going back to the beginning is the parent's control, in
 * the corner, because choosing to hear the story again is a parent's decision.
 *
 * Tap-the-art-to-advance is lifted deliberately from Game's reveal. Same grammar, same corner
 * for the arrow, same reason: a child handed a Pokémon taps the Pokémon, so the art has to be
 * the button and the arrow only has to exist for the child who doesn't try that.
 *
 * The stage carries the **Pokémon's** type colour, not the mode's violet — Explore's card and
 * Game's reveal both do this, and here it means the forest lights up green for a Caterpie and
 * yellow for a Pikachu. Unlike Game there's nothing to give away: the answer arrived with the
 * scene, so the colour is present from the first frame.
 */
export default function Encounter({ pokemon, onAnother, className = '' }) {
  const types = pokemonTypes(pokemon)

  return (
    <div
      className={[styles.encounter, className].filter(Boolean).join(' ')}
      style={typeCssVars(types[0])}
    >
      {/* Keyed on the Pokémon, so meeting another one remounts the subtree: the transition
          replays and `Celebrate` fires again. Without the key a re-roll would silently swap the
          image, which is the one thing an encounter must never look like. */}
      <SceneTransition sceneKey={pokemon.id} direction="up" className={styles.arrival}>
        <Celebrate active color="var(--color-primary)" className={styles.celebrate}>
          <Tappable
            className={styles.artTap}
            pressScale={0.97}
            onTap={() => onPokemonTap(pokemon, { source: 'story-encounter', then: onAnother })}
            aria-label={pokemon.name}
          >
            <img className={styles.art} src={artUrl(pokemon.id)} alt="" draggable="false" />
          </Tappable>
        </Celebrate>

        <div className={styles.identity}>
          <p className={styles.name}>{pokemon.name}</p>
          <div className={styles.badges}>
            {types.map(type => (
              <PlayTypeBadge key={type} type={type} />
            ))}
          </div>
        </div>
      </SceneTransition>

      <Tappable className={styles.another} onTap={onAnother} aria-label="Un altre">
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
    </div>
  )
}
