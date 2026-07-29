import { useLayoutEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PlayHome from './screens/PlayHome'
import MotionLab from './screens/MotionLab'
import ModePlaceholder from './screens/ModePlaceholder'
import Explore from './screens/explore/Explore'
import { MODES } from './modes'
import './play.css'

/**
 * The screen a mode is built out. A mode with no entry here still gets its route, its colour
 * and its shell — `ModePlaceholder` — so slices 4 and 5 are one line each and a tapped tile
 * never goes nowhere in the meantime.
 *
 * Every mode screen owns a subtree (`/play/<id>/*`), not a single path: Explore alone is
 * three levels deep, and its inner routing is its own business.
 */
const MODE_SCREENS = {
  explore: Explore,
}

/**
 * Shell for the whole play app. Mounted at /play/* and kept clear of the print components:
 * they share the data layer and nothing else.
 *
 * Its own job is device hardening — everything that has to happen at the document level for
 * an iPad running this from the home screen.
 */
export default function PlayApp() {
  // Layout effect, not effect: the print book's #root padding would otherwise paint for one
  // frame on every launch, which is very visible when the app opens from the home screen.
  useLayoutEffect(() => {
    const html = document.documentElement
    const previousMode = html.dataset.mode
    html.dataset.mode = 'play'

    // iOS Safari ignores `user-scalable=no`, so pinch-zoom has to be refused at the event
    // level. Without this a stray two-finger grab leaves the app zoomed with no way back.
    const blockGesture = e => e.preventDefault()
    const opts = { passive: false }
    document.addEventListener('gesturestart', blockGesture, opts)
    document.addEventListener('gesturechange', blockGesture, opts)
    document.addEventListener('gestureend', blockGesture, opts)

    // Double-tap-to-zoom slips past `touch-action: manipulation` in some iPadOS versions.
    const blockDoubleTap = e => e.preventDefault()
    document.addEventListener('dblclick', blockDoubleTap)

    return () => {
      if (previousMode) html.dataset.mode = previousMode
      else delete html.dataset.mode
      document.removeEventListener('gesturestart', blockGesture, opts)
      document.removeEventListener('gesturechange', blockGesture, opts)
      document.removeEventListener('gestureend', blockGesture, opts)
      document.removeEventListener('dblclick', blockDoubleTap)
    }
  }, [])

  return (
    <div className="play-root">
      <Routes>
        <Route index element={<PlayHome />} />
        {/* One route per mode, derived from the mode list so a mode's id, colour, pictogram
            and URL can't drift apart. A mode graduates out of ModePlaceholder by appearing in
            MODE_SCREENS — slices 4 and 5 are one entry each. */}
        {MODES.map(mode => {
          const Screen = MODE_SCREENS[mode.id] ?? ModePlaceholder
          return <Route key={mode.id} path={`${mode.id}/*`} element={<Screen mode={mode} />} />
        })}
        <Route path="motion" element={<MotionLab />} />
        {/* Anything unknown goes home rather than 404ing at a child who can't read the
            message. */}
        <Route path="*" element={<Navigate to="/play" replace />} />
      </Routes>
    </div>
  )
}
