import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages project subpath — must match the repo name exactly, and Pages paths are
  // case-sensitive: the remote is arnautresserras/pokedex, so this is lowercase.
  // Routing is hash-based, so this only affects asset URLs.
  base: '/pokedex/',
  plugins: [react()],
})
