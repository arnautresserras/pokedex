import { useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAllPokemon } from '../../../hooks/usePokemon'
import { ModeScreen } from '../../components'
import { SceneTransition } from '../../motion'
import { ACTIVITIES, ACTIVITY_KEYS } from './activities'
import ActivityPicker from './ActivityPicker'
import styles from './Game.module.css'

/**
 * Game — "Endevina": a handful of activities sharing one screen.
 *
 * A round is asked, then resolved, then the child taps on. There is **no score, no streak, no
 * timer and no fail state** — those are the plan's words, and they hold across every activity
 * `activities.js` lists, not just the original silhouette guess.
 *
 * **This component knows nothing about what an activity looks like.** `activities.js` is the one
 * place that maps a key to a round-builder and the component that plays it; `Game` only picks a
 * key, builds that key's round, and renders that key's component with `{ round, onDone }`. That's
 * what let three more activities (family, evolution order, memory) join the original two without
 * this file growing a branch per activity — see `activities.js` for the shared build contract.
 *
 * **`activity` is the parent's preference** (`ActivityPicker`, in `ModeScreen`'s free corner):
 * "mix" leaves `kind` random per round, and locking to one activity pins `kind` to it until the
 * tray is opened again. Picking mid-round rebuilds immediately with a fresh round of the newly
 * chosen kind, rather than leaving a stale one on screen — the abandoned round's Pokémon don't
 * join `recent`, since asking about them again right away wouldn't repeat anything a child saw
 * resolved.
 *
 * A round is state, not a route, unlike Explore's three levels — it's random, so a URL pointing
 * at one would either be a lie or would have to seed the randomness, and there's nothing a
 * parent would want to link to. `/play/game` is the whole mode.
 *
 * Each activity component is mounted fresh every round via `key={roundNo}` on the element, so
 * none of them need to reset their own internal state (a pick, a flipped card, a collected
 * sequence) when a new round arrives — remounting does that for free.
 */

/** How many recently-asked Pokémon are barred from coming up again, across every activity. */
const RECENT = 12

function pickKind() {
  return ACTIVITY_KEYS[Math.floor(Math.random() * ACTIVITY_KEYS.length)]
}

/** A locked activity pins `kind`; "mix" still rolls a fresh one. */
function kindFor(activity) {
  return activity === 'mix' ? pickKind() : activity
}

function buildRoundFor(kind, roster, opts) {
  return ACTIVITIES[kind].build(roster, opts)
}

export default function Game({ mode }) {
  const roster = useAllPokemon()
  const location = useLocation()

  const recentRef = useRef([])
  const [activity, setActivity] = useState('mix')
  const [kind, setKind] = useState(() => kindFor(activity))
  const [round, setRound] = useState(() => buildRoundFor(kind, roster))
  // Bumping this is what replays the entry transition and remounts the activity component, so
  // a new round arrives as an event rather than as the old one's pieces quietly changing.
  const [roundNo, setRoundNo] = useState(0)

  // The mode owns `/play/game/*` (every mode owns a subtree), but this one has no second level.
  // A stale or hand-typed deeper URL goes back to the game rather than living on in the address
  // bar as a path that isn't real.
  if (location.pathname.replace(/\/+$/, '') !== '/play/game') {
    return <Navigate to="/play/game" replace />
  }

  const advance = () => {
    // The answer(s) just seen join the recent list as we leave it, which keeps the ref out of
    // render entirely — it's only ever touched from a tap. Shared across every activity, so
    // switching kind between rounds still avoids repeating a Pokémon right after it was asked.
    const recent = [...recentRef.current, ...(round.recentIds ?? [])].slice(-RECENT)
    recentRef.current = recent
    const nextKind = kindFor(activity)
    setKind(nextKind)
    setRound(buildRoundFor(nextKind, roster, { recent }))
    setRoundNo(n => n + 1)
  }

  // The parent opening `ActivityPicker` mid-round: the open question wasn't answered, so its
  // Pokémon aren't barred from coming up again, but it also can't stay on screen once it no
  // longer matches the chosen activity.
  const changeActivity = next => {
    setActivity(next)
    const nextKind = kindFor(next)
    setKind(nextKind)
    setRound(buildRoundFor(nextKind, roster, { recent: recentRef.current }))
    setRoundNo(n => n + 1)
  }

  const Activity = ACTIVITIES[kind].Component

  return (
    <ModeScreen mode={mode} controls={<ActivityPicker activity={activity} onChange={changeActivity} />}>
      <SceneTransition sceneKey={roundNo} direction="forward" className={styles.game}>
        <Activity key={roundNo} round={round} onDone={advance} />
      </SceneTransition>
    </ModeScreen>
  )
}
