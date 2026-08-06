import { useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useAllPokemon } from '../../../hooks/usePokemon'
import { ACTIVITIES, ACTIVITY_KEYS } from './activities'
import styles from './Game.module.css'

/** How many recently-asked Pokémon are barred from coming up again, across every round here. */
const RECENT = 12

function pickKind() {
  return ACTIVITY_KEYS[Math.floor(Math.random() * ACTIVITY_KEYS.length)]
}

/** "mix" rolls a fresh activity every round; any other key stays pinned to it. */
function kindFor(activity) {
  return activity === 'mix' ? pickKind() : activity
}

function buildRoundFor(kind, roster, opts) {
  return ACTIVITIES[kind].build(roster, opts)
}

/**
 * One activity — or "mix", a fresh one every round — asked round after round. `GameIndex`'s tile
 * decided which, as the `:activity` route param rather than local state, so this screen is a
 * real link a parent could point the iPad at directly, the same bargain Explore's cards make.
 *
 * A round itself is still state, not a route: it's random, so a URL pointing at one specific
 * round would either be a lie or would have to seed the randomness, and there's nothing worth
 * linking to at that grain. `key={roundNo}` remounts the activity component fresh every round,
 * so none of them need to reset their own state (a pick, a flipped card, a collected sequence)
 * by hand.
 *
 * An unknown or malformed `:activity` (a stale link, a hand-typed URL) redirects to the index
 * rather than crashing on `ACTIVITIES[undefined]`.
 */
export default function GameRound() {
  const { activity } = useParams()
  const roster = useAllPokemon()
  const valid = activity === 'mix' || ACTIVITY_KEYS.includes(activity)

  const recentRef = useRef([])
  const [kind, setKind] = useState(() => (valid ? kindFor(activity) : null))
  const [round, setRound] = useState(() => (valid ? buildRoundFor(kind, roster) : null))
  const [roundNo, setRoundNo] = useState(0)

  if (!valid) return <Navigate to="/play/game" replace />

  const advance = () => {
    const recent = [...recentRef.current, ...(round.recentIds ?? [])].slice(-RECENT)
    recentRef.current = recent
    const nextKind = kindFor(activity)
    setKind(nextKind)
    setRound(buildRoundFor(nextKind, roster, { recent }))
    setRoundNo(n => n + 1)
  }

  const Activity = ACTIVITIES[kind].Component

  return (
    <div className={styles.game}>
      <Activity key={roundNo} round={round} onDone={advance} />
    </div>
  )
}
