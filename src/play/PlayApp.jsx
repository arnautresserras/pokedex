import { useLayoutEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PlayHome from './screens/PlayHome'
import MotionLab from './screens/MotionLab'
import './play.css'

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
        <Route path="motion" element={<MotionLab />} />
        {/* Modes land here in slices 2–5. Anything unknown goes home rather than 404ing at a
            child who can't read the message. */}
        <Route path="*" element={<Navigate to="/play" replace />} />
      </Routes>
    </div>
  )
}
