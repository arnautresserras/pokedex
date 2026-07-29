import { useNavigate, useParams, Navigate, useLocation } from 'react-router-dom'
import { useAllPokemon, usePokemon } from '../../../hooks/usePokemon'
import { Celebrate } from '../../motion'
import { PlayTypeBadge } from '../../components'
import { getTypeRoom, cardPath } from '../../typeRooms'
import { pokemonTypes, typeCssVars } from '../../utils/playColors'
import { artUrl } from '../../utils/playAssets'
import TraitMeters from './TraitMeters'
import EvolutionStrip from './EvolutionStrip'
import styles from './PokemonCard.module.css'

/**
 * One Pokémon, full screen. The end of every path through Explore and the thing the whole
 * mode exists to show, so it holds exactly four things and no vitals list:
 *
 *   the art, as big as the screen allows · the name, as text only · its type badges ·
 *   three "what it's like" meters · the evolution row
 *
 * **The name is displayed and never spoken** — that's the spec's line, and with the app silent
 * by design it's also the only option. It's set large because the parent reads it aloud and
 * because its shape is the thing a pre-reader will eventually recognise.
 *
 * The card takes its colour from the **Pokémon's own primary type**, not from the room it was
 * reached through and not from Explore's blue. Walking from Eevee to Vaporeon should turn the
 * screen from beige to blue; that colour change is most of what makes the evolution feel like
 * something happened.
 */
export default function PokemonCard() {
  const { type, id } = useParams()
  const roster = useAllPokemon()
  const pokemon = usePokemon(id)
  const navigate = useNavigate()
  const location = useLocation()

  // A stale or hand-typed id would otherwise render an empty card with broken art.
  if (!pokemon) {
    return <Navigate to={getTypeRoom(type) ? `/play/explore/${type}` : '/play/explore'} replace />
  }

  const types = pokemonTypes(pokemon)

  /**
   * Advancing along the chain **replaces** the history entry instead of pushing one. Three
   * taps through Caterpie → Metapod → Butterfree would otherwise bury the room three steps
   * down, and back is a child's escape hatch: it has to mean "out of this card", not "one
   * evolution ago".
   */
  const evolveTo = next =>
    navigate(cardPath(type, next.id), {
      replace: true,
      state: { dir: 'forward', evolved: true },
    })

  return (
    <div className={styles.card} style={typeCssVars(types[0])} data-type={types[0]}>
      <div className={styles.art}>
        {/* The arrival is celebrated only when it was reached by evolving. Firing this on
            every card open would spend the app's loudest signal on simply looking at things,
            and leave Game mode's reveal nothing louder to be. */}
        <Celebrate
          active={Boolean(location.state?.evolved)}
          color="var(--color-primary)"
          className={styles.celebrate}
        >
          <img
            className={styles.hero}
            src={artUrl(pokemon.id)}
            alt={pokemon.name}
            draggable="false"
          />
        </Celebrate>
      </div>

      <div className={styles.info}>
        <h1 className={styles.name}>{pokemon.name}</h1>

        <div className={styles.badges}>
          {types.map(t => (
            <PlayTypeBadge key={t} type={t} />
          ))}
        </div>

        <TraitMeters roster={roster} pokemon={pokemon} className={styles.traits} />

        <EvolutionStrip
          roster={roster}
          pokemon={pokemon}
          onSelect={evolveTo}
          className={styles.evolution}
        />
      </div>
    </div>
  )
}
