import { useState } from 'react'
import { Tappable, Celebrate } from '../../motion'
import { artUrl } from '../../utils/playAssets'
import { onPokemonTap } from '../../utils/onPokemonTap'
import styles from './JigsawGame.module.css'

/** Kept in sync with `buildJigsawRound`'s `JIGSAW_PIECES` — see the comment there. */
const COLS = 3
const ROWS = 2

/**
 * Which slice of `round.answer`'s art a piece shows, as a `background-position` /
 * `background-size` pair. `backgroundSize` is `100% × COLS` wide and `100% × ROWS` tall
 * *relative to the piece's own box*, so scaling the same source image up to `COLS × ROWS` times
 * a single cell always reproduces the full picture — the grid's actual pixel size never enters
 * the maths, only how many pieces it's cut into.
 */
function piecePosition(piece) {
  const col = piece % COLS
  const row = Math.floor(piece / COLS)
  return {
    backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
  }
}

/**
 * "Trenca-closques" — one Pokémon's hero art, sliced into a shuffled 3 × 2 grid; tap two pieces
 * to swap them until the picture is whole again.
 *
 * **No drag, only two taps.** Every other tap-based puzzle in Game already proves the pattern —
 * `EvolutionOrderGame`'s tap-to-place, `MemoryGame`'s tap-to-flip — so a swap needs nothing more
 * than "tap a piece to select it, tap a second to trade places". There's no illegal move and so
 * no fail state: any arrangement is a valid, reversible board, only some are the finished one.
 *
 * `round.pieces[slot]` is which original piece sits in slot `slot`; `order` is this component's
 * own copy, since swapping is the interaction and has to live in state. `done` — every slot
 * holding its own piece — drives the same reveal grammar as everywhere else in Game: the name
 * stays a `?` until then, and finishing triggers `Celebrate` exactly like a correct silhouette
 * guess or a completed evolution sequence.
 */
export default function JigsawGame({ round, onDone }) {
  const { answer, pieces } = round
  const [order, setOrder] = useState(pieces)
  const [selected, setSelected] = useState(null)

  const done = order.every((piece, slot) => piece === slot)

  const tap = slot => {
    if (done) return
    if (selected === null) {
      setSelected(slot)
      return
    }
    if (selected === slot) {
      setSelected(null)
      return
    }
    setOrder(current => {
      const next = [...current]
      ;[next[selected], next[slot]] = [next[slot], next[selected]]
      return next
    })
    setSelected(null)
  }

  return (
    <div className={styles.stage} data-done={done ? 'true' : undefined}>
      <p className={styles.name}>{done ? answer.name : '?'}</p>

      <Celebrate active={done} color="var(--color-primary)" className={styles.celebrate}>
        <div className={styles.grid}>
          {order.map((piece, slot) => (
            <Tappable
              key={slot}
              className={[styles.piece, selected === slot ? styles.selected : '']
                .filter(Boolean)
                .join(' ')}
              style={{
                backgroundImage: `url(${artUrl(answer.id)})`,
                ...piecePosition(piece),
              }}
              disabled={done}
              onTap={() => tap(slot)}
              aria-label="Peça"
            />
          ))}
        </div>
      </Celebrate>

      {done && (
        <Tappable
          className={styles.next}
          onTap={() => onPokemonTap(answer, { source: 'game-jigsaw', then: onDone })}
          aria-label="Següent"
        >
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
