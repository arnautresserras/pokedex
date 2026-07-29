import { useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAllPokemon } from '../../../hooks/usePokemon'
import { ModeScreen } from '../../components'
import { SceneTransition } from '../../motion'
import { buildRound } from '../../utils/rounds'
import SilhouetteStage from './SilhouetteStage'
import AnswerOptions from './AnswerOptions'
import styles from './Game.module.css'

/**
 * Game — "Endevina": who's that Pokémon?
 *
 * One screen, two states, and nothing else. A round is asked (silhouette + three options), then
 * revealed (colour + name + celebration), then the child taps on. There is **no score, no
 * streak, no timer and no fail state** — those are the plan's words and they're also why this
 * component is fifty lines: everything interesting is in the reveal (`SilhouetteStage`) and in
 * building a fair round (`utils/rounds.js`).
 *
 * A round is state, not a route, unlike Explore's three levels. A round is random, so a URL
 * pointing at one would either be a lie or would have to seed the randomness — and there's
 * nothing a parent would want to link to. `/play/game` is the whole mode.
 *
 * `picked` doubles as the phase: `null` is asking, an id is revealed. One value, so the two
 * halves of the screen can't disagree about which state they're in.
 */

/** How many recent answers are barred from coming up again — see `buildRound`. */
const RECENT = 12

export default function Game({ mode }) {
  const roster = useAllPokemon()
  const location = useLocation()

  const recentRef = useRef([])
  const [round, setRound] = useState(() => buildRound(roster))
  // Bumping this is what replays the entry transition, so a new round arrives as an event
  // rather than as the old one's pieces quietly changing.
  const [roundNo, setRoundNo] = useState(0)
  const [picked, setPicked] = useState(null)

  // The mode owns `/play/game/*` (every mode owns a subtree), but this one has no second level.
  // A stale or hand-typed deeper URL goes back to the game rather than living on in the address
  // bar as a path that isn't real.
  if (location.pathname.replace(/\/+$/, '') !== '/play/game') {
    return <Navigate to="/play/game" replace />
  }

  const advance = () => {
    // The answer just seen joins the recent list as we leave it, which keeps the ref out of
    // render entirely — it's only ever touched from a tap.
    const recent = [...recentRef.current, round.answer.id].slice(-RECENT)
    recentRef.current = recent
    setRound(buildRound(roster, { recent }))
    setRoundNo(n => n + 1)
    setPicked(null)
  }

  return (
    <ModeScreen mode={mode}>
      <SceneTransition sceneKey={roundNo} direction="forward" className={styles.game}>
        <SilhouetteStage
          pokemon={round.answer}
          revealed={picked != null}
          onNext={advance}
        />
        <AnswerOptions
          options={round.options}
          answerId={round.answer.id}
          picked={picked}
          onPick={pokemon => setPicked(pokemon.id)}
          className={styles.options}
        />
      </SceneTransition>
    </ModeScreen>
  )
}
