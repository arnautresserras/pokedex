import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ModeScreen, BackButton } from '../../components'
import { SceneTransition } from '../../motion'
import GameIndex from './GameIndex'
import GameRound from './GameRound'

/**
 * Game — "Endevina". Two levels, the same shape `Explore` already proved:
 *
 *   /play/game            GameIndex — one big tile per activity, plus "Barrejat"
 *   /play/game/:activity  GameRound — that activity, asked round after round
 *
 * Used to be one screen with a small corner control (`ActivityPicker`) that opened a tray over
 * whatever round was on screen. Eight activities made that tray too small a target and too
 * indirect a choice for a child who can already tap a big tile unaided — Explore and Story both
 * settled the same problem the same way, with a picker screen rather than a corner menu.
 * Switching activity now means going back a level, the same gesture Explore's rooms already
 * teach, rather than a setting a parent operates from the corner.
 *
 * This component owns the frame — one `ModeScreen`, one back button, one transition — exactly as
 * `Explore` does, and for the same reason: the transition has to be keyed on the path so it plays
 * on every step between the index and a round, while `ModeScreen`'s own transition is keyed on
 * the mode and plays once on entry, never again.
 *
 * A round is still state, not a route, once inside an activity: it's random, so a URL pointing
 * at one specific round would either be a lie or would have to seed the randomness — see
 * `GameRound` for that half of the contract.
 */
export default function Game({ mode }) {
  const location = useLocation()
  const navigate = useNavigate()

  const depth = location.pathname
    .replace(/^\/play\/game\/?/, '')
    .split('/')
    .filter(Boolean).length

  // Back always goes to the index, never `navigate(-1)` — a round reached by deep link would
  // otherwise walk out of the app entirely. `replace` keeps history from growing as a child
  // bounces between activities.
  const goBack = () => navigate('/play/game', { replace: true, state: { dir: 'back' } })

  return (
    <ModeScreen mode={mode} controls={depth > 0 ? <BackButton onTap={goBack} /> : null}>
      <SceneTransition sceneKey={location.pathname} direction={location.state?.dir ?? 'none'}>
        <Routes>
          <Route index element={<GameIndex />} />
          <Route path=":activity" element={<GameRound />} />
          {/* Anything deeper or malformed goes back to the index rather than a blank screen. */}
          <Route path="*" element={<Navigate to="/play/game" replace />} />
        </Routes>
      </SceneTransition>
    </ModeScreen>
  )
}
