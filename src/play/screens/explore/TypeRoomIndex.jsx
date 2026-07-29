import { useNavigate } from 'react-router-dom'
import { useAllPokemon } from '../../../hooks/usePokemon'
import { Tappable } from '../../motion'
import { TypeGlyph } from '../../components'
import { roomsWithMembers, roomPath } from '../../typeRooms'
import { typeCssVars } from '../../utils/playColors'
import { artUrl } from '../../utils/playAssets'
import styles from './TypeRoomIndex.module.css'

/**
 * The 15 type rooms — Explore's front door, and the screen the mode's pictogram on the home
 * tile is a miniature of. Getting from the tile to here should feel like the icon grew.
 *
 * Chosen over one 151-cell grid, which is a wall of near-identical pixels to a four-year-old.
 * Fifteen big colours are a choice a pre-reader can actually make, and "pick a colour" is the
 * one instruction that needs no instruction.
 *
 * Each tile is: the room's colour, its pictogram, its Catalan name, and the room's most
 * recognisable member as a **watermark silhouette** behind all of it. The silhouette is
 * deliberately backgrounded — the print book's type-name watermark, played the same way. A
 * tile whose subject was a bright Charizard would read as "Charizard" rather than "a room full
 * of fire ones", which is the whole point of the screen.
 */
export default function TypeRoomIndex() {
  const roster = useAllPokemon()
  const navigate = useNavigate()
  const rooms = roomsWithMembers(roster)

  return (
    <div className={styles.index}>
      <div className={styles.grid}>
        {rooms.map(room => (
          <Tappable
            key={room.type}
            className={styles.room}
            style={typeCssVars(room.type)}
            // Fifteen tiles on one screen are small enough that the default 0.94 press reads
            // as a flinch; big enough that they need more than the home tiles' 0.975.
            pressScale={0.955}
            onTap={() => navigate(roomPath(room.type), { state: { dir: 'forward' } })}
            aria-label={`${room.label} — ${room.members.length}`}
          >
            <img
              className={styles.watermark}
              src={artUrl(room.face)}
              alt=""
              draggable="false"
            />
            <span className={styles.glyphBox}>
              <TypeGlyph type={room.type} />
            </span>
            <span className={styles.label}>{room.label}</span>
          </Tappable>
        ))}
      </div>
    </div>
  )
}
