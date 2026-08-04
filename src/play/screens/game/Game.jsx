import { useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAllPokemon } from '../../../hooks/usePokemon'
import { ModeScreen } from '../../components'
import { SceneTransition } from '../../motion'
import { pokemonTypes } from '../../utils/playColors'
import { buildRound, buildTypeRound } from '../../utils/rounds'
import SilhouetteStage from './SilhouetteStage'
import AnswerOptions from './AnswerOptions'
import TypeStage from './TypeStage'
import TypeOptions from './TypeOptions'
import styles from './Game.module.css'

/**
 * Game — "Endevina": two activities sharing one screen.
 *
 * A round is asked, then revealed (colour + name + celebration), then the child taps on. There
 * is **no score, no streak, no timer and no fail state** — those are the plan's words and
 * they're also why this component stays small: everything interesting is in the reveal
 * (`SilhouetteStage` / `TypeStage`) and in building a fair round (`utils/rounds.js`).
 *
 * **Two activities, picked at random each round, sharing the same reveal grammar:**
 *
 *   silhouette — "who's that Pokémon?" — a shape match against three Pokémon (`buildRound`)
 *   type       — "quin color?" — a colour match against three type tiles (`buildTypeRound`)
 *
 * They're mixed into one mode rather than split into a fourth home tile because they're the
 * same game played two ways — same reveal, same "no fail state", same silent-by-design rules —
 * and a child who's already found Game doesn't need a second doorway to find the other half of
 * it. `kind` is what tells the two apart; `activityFor` is the only place that has to know both
 * activities exist.
 *
 * A round is state, not a route, unlike Explore's three levels. A round is random, so a URL
 * pointing at one would either be a lie or would have to seed the randomness — and there's
 * nothing a parent would want to link to. `/play/game` is the whole mode.
 *
 * `picked` doubles as the phase: `null` is asking, a value is revealed. One value, so the two
 * halves of the screen can't disagree about which state they're in — it holds a Pokémon id for
 * a silhouette round and a type key for a type round, which is fine, since each round only ever
 * compares it against its own kind of option.
 */

/** How many recent answers are barred from coming up again — see `buildRound`. */
const RECENT = 12

function pickKind() {
  return Math.random() < 0.5 ? 'silhouette' : 'type'
}

function buildRoundFor(kind, roster, opts) {
  return kind === 'type' ? buildTypeRound(roster, opts) : buildRound(roster, opts)
}

export default function Game({ mode }) {
  const roster = useAllPokemon()
  const location = useLocation()

  const recentRef = useRef([])
  const [kind, setKind] = useState(() => pickKind())
  const [round, setRound] = useState(() => buildRoundFor(kind, roster))
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
    // render entirely — it's only ever touched from a tap. Shared across both activities, so
    // switching kind between rounds still avoids repeating the same Pokémon right after it.
    const recent = [...recentRef.current, round.answer.id].slice(-RECENT)
    recentRef.current = recent
    const nextKind = pickKind()
    setKind(nextKind)
    setRound(buildRoundFor(nextKind, roster, { recent }))
    setRoundNo(n => n + 1)
    setPicked(null)
  }

  const revealed = picked != null

  return (
    <ModeScreen mode={mode}>
      <SceneTransition sceneKey={roundNo} direction="forward" className={styles.game}>
        {kind === 'type' ? (
          <>
            <TypeStage pokemon={round.answer} revealed={revealed} onNext={advance} />
            <TypeOptions
              options={round.options}
              answerType={pokemonTypes(round.answer)[0]}
              picked={picked}
              onPick={type => setPicked(type)}
              className={styles.options}
            />
          </>
        ) : (
          <>
            <SilhouetteStage pokemon={round.answer} revealed={revealed} onNext={advance} />
            <AnswerOptions
              options={round.options}
              answerId={round.answer.id}
              picked={picked}
              onPick={pokemon => setPicked(pokemon.id)}
              className={styles.options}
            />
          </>
        )}
      </SceneTransition>
    </ModeScreen>
  )
}
