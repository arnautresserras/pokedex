import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { useAllPokemon } from '../../../hooks/usePokemon'
import { Tappable } from '../../motion'
import { TypeGlyph } from '../../components'
import { getTypeRoom, roomMembers, cardPath } from '../../typeRooms'
import { typeCssVars } from '../../utils/playColors'
import { spriteUrl } from '../../utils/playAssets'
import { onPokemonTap } from '../../utils/onPokemonTap'
import styles from './TypeRoom.module.css'

/**
 * One type room: every Gen I Pokémon of that type, as a grid of sprites on the room's colour.
 *
 * The population is lopsided by design of the games, not of this screen — Verí has 33 members
 * and Fantasma has 3 — so the grid uses **fixed-width cells, centred**, rather than
 * `1fr` columns. Stretchy columns would blow the three ghosts up to a third of the screen
 * each, which reads as a different (broken) screen rather than as a small room. Fixed cells
 * mean a small room is simply a short one, and it looks deliberate.
 */
export default function TypeRoom() {
  const { type } = useParams()
  const roster = useAllPokemon()
  const navigate = useNavigate()

  const room = getTypeRoom(type)
  // A hand-typed or stale URL sends a child to a blank grid otherwise.
  if (!room) return <Navigate to="/play/explore" replace />

  const members = roomMembers(roster, type)

  const open = pokemon =>
    onPokemonTap(pokemon, {
      source: 'explore-grid',
      then: p => navigate(cardPath(type, p.id), { state: { dir: 'forward' } }),
    })

  return (
    <div className={styles.room} style={typeCssVars(type)}>
      {/* The header repeats the tile that was just tapped — same glyph, same colour, same
          word — so the child can see they landed where they aimed. */}
      <header className={styles.header}>
        <span className={styles.glyphBox}>
          <TypeGlyph type={type} />
        </span>
        <h1 className={styles.title}>{room.label}</h1>
      </header>

      <div className={styles.scroll}>
        <div className={styles.grid}>
          {members.map(pokemon => (
            <Tappable
              key={pokemon.id}
              className={styles.cell}
              onTap={() => open(pokemon)}
              aria-label={pokemon.name}
            >
              <img
                className={styles.sprite}
                src={spriteUrl(pokemon.id)}
                alt=""
                draggable="false"
              />
              <span className={styles.name}>{pokemon.name}</span>
            </Tappable>
          ))}
        </div>
      </div>
    </div>
  )
}
