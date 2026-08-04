/**
 * Vendored image paths. Nothing in the play app may hotlink a remote image: the app has to
 * work in airplane mode, and a service worker can only precache what we ship.
 *
 * Files come from `node scripts/fetch-play-assets.js`. BASE_URL keeps them resolving under
 * the GitHub Pages subpath.
 */
const BASE = import.meta.env.BASE_URL

/** Hero art — 512px WebP, transparent background. */
export function artUrl(id) {
  return `${BASE}pkmn/art/${id}.webp`
}

/** Front sprite — the small pixel sprite, for grids and evolution chains. */
export function spriteUrl(id) {
  return `${BASE}pkmn/sprite/${id}.png`
}

/** Back sprite — the small pixel sprite seen from behind, for a story told from the trail. */
export function backSpriteUrl(id) {
  return `${BASE}pkmn/back/${id}.png`
}

/** A story backdrop authored as a tilemap export, rather than drawn as an SVG shape. */
export function sceneUrl(id) {
  return `${BASE}scenes/${id}.png`
}
