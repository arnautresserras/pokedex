import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ModeScreen, BackButton } from '../../components'
import { SceneTransition } from '../../motion'
import TypeRoomIndex from './TypeRoomIndex'
import TypeRoom from './TypeRoom'
import PokemonCard from './PokemonCard'

/**
 * Explore — "pick a colour, then pick a face". Three levels:
 *
 *   /play/explore            the 15 type rooms
 *   /play/explore/:type      that room's grid
 *   /play/explore/:type/:id  one Pokémon's card
 *
 * **Real routes, not view state**, per the plan's closed routes-vs-state decision: a card is
 * linkable, so it can be jumped to during development and pointed at from the iPad without
 * five taps first. `:type` is the *room you came from*, not necessarily the Pokémon's own
 * type — an evolution tap can walk you from Eevee's Normal room to Vaporeon, and back should
 * return where the child started rather than to a room they never opened.
 *
 * This component owns the frame — one `ModeScreen`, one back button, one transition — and the
 * three screens own only their content. That split is what makes the motion right:
 * `ModeScreen`'s own transition is keyed on the mode, so it plays once on entry and never
 * again; the one here is keyed on the path and plays on every step inside. With no sound, that
 * slide is the only confirmation a child gets that their tap moved them somewhere.
 *
 * Direction travels in the navigation state rather than being inferred from path depth: it's
 * pure (no render-phase refs), a deep link with no state just fades in, and every call site
 * has to say out loud whether it's going deeper or coming back.
 */
export default function Explore({ mode }) {
  const location = useLocation()
  const navigate = useNavigate()

  const depth = location.pathname
    .replace(/^\/play\/explore\/?/, '')
    .split('/')
    .filter(Boolean).length

  // Back always goes one level up by path — never `navigate(-1)`, which would walk out of the
  // app entirely when a card was opened by deep link. `replace` keeps the history from growing
  // without bound as a child browses in and out of thirty cards.
  const goBack = () => {
    const parent = location.pathname.split('/').slice(0, -1).join('/')
    navigate(parent || '/play/explore', { replace: true, state: { dir: 'back' } })
  }

  return (
    <ModeScreen mode={mode} controls={depth > 0 ? <BackButton onTap={goBack} /> : null}>
      <SceneTransition
        sceneKey={location.pathname}
        direction={location.state?.dir ?? 'none'}
      >
        <Routes>
          <Route index element={<TypeRoomIndex />} />
          <Route path=":type" element={<TypeRoom />} />
          <Route path=":type/:id" element={<PokemonCard />} />
          {/* Anything deeper or malformed goes back to the rooms rather than showing a child
              a blank screen. */}
          <Route path="*" element={<Navigate to="/play/explore" replace />} />
        </Routes>
      </SceneTransition>
    </ModeScreen>
  )
}
