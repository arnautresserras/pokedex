import { registerSW } from 'virtual:pwa-register'

/**
 * Registers the service worker and, critically, checks for updates on every foreground —
 * not just once. `vite-plugin-pwa`'s auto-injected script (what this replaces) only calls
 * `register()` on load, and browsers throttle their own internal update check to roughly once
 * every 24 hours per registration. During a day of rapid iteration that's effectively "never",
 * which reads exactly like updates being broken rather than merely slow — the only fix that
 * worked was deleting and reinstalling the home-screen icon, which forces a brand new
 * registration and sidesteps the throttle entirely.
 *
 * `registration.update()` bypasses that throttle deliberately: it's an explicit request, not
 * the lazy background check the 24-hour rule governs. Calling it on `visibilitychange` and
 * `pageshow` means every time the app is opened or switched back to, it actually asks.
 *
 * This still doesn't skip waiting — `registerType: 'prompt'` and no `skipWaiting` mean a found
 * update sits until the old service worker's clients are gone, same contract as before. What
 * changes is that an update gets *found* promptly, so the next real relaunch (a force-quit, or
 * iOS reclaiming the process on its own) has something to actually activate.
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return

  registerSW({
    immediate: true,
    onRegisteredSW(_url, registration) {
      if (!registration) return

      const checkForUpdate = () => registration.update().catch(() => {})

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate()
      })
      window.addEventListener('pageshow', checkForUpdate)
    },
  })
}
