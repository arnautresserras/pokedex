import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages project subpath — must match the repo name exactly, and Pages paths are
// case-sensitive: the remote is arnautresserras/pokedex, so this is lowercase.
// Routing is hash-based, so this only affects asset URLs.
const BASE = '/pokedex/'

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      // 'prompt' with no prompt UI, on purpose. 'autoUpdate' reloads the page the moment a new
      // service worker takes over, and a reload mid-round reads as a crash to a 4-year-old — who
      // also can't be shown an "update available" button, since the app has no readable text by
      // design. Leaving `skipWaiting` off means a new version installs quietly and activates on
      // the next cold launch, which for a home-screen app is the next time it's opened. Nothing
      // to tap, nothing interrupted.
      registerType: 'prompt',
      injectRegister: 'script',
      manifest: {
        id: BASE,
        name: 'Pokédex Kanto',
        short_name: 'Pokédex',
        description: 'Els 151 Pokémon de Kanto — explora, contes i endevinalles.',
        lang: 'ca',
        start_url: `${BASE}#/play`,
        scope: BASE,
        display: 'standalone',
        // Both ways up. An iPad on a lap gets rotated and a locked orientation would just be a
        // screen that refuses to work.
        orientation: 'any',
        background_color: '#16161a',
        theme_color: '#16161a',
        icons: [
          { src: `${BASE}icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${BASE}icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
          {
            src: `${BASE}icons/maskable-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // webp and woff2 are the two the Workbox default misses, and they're the whole app:
        // 151 hero arts and the three self-hosted typefaces. Everything the play app touches is
        // precached, which is what makes airplane mode work.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        // Take control on the first load rather than only after a reload, so "open the page,
        // add to home screen, go offline" works without an extra refresh nobody would think to do.
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        // No runtimeCaching at all. Every play asset is vendored and precached, so a runtime
        // cache could only ever catch a *remote* request — which in play code is a bug the
        // vendoring rule exists to prevent, and in the print book is 151 hero arts we
        // deliberately don't want in a child's offline cache.
      },
    }),
  ],
})
