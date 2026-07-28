import { TYPE_COLORS } from '../../utils/typeColors'

/**
 * Type colours for the play app, with the cache's post-Gen-I types resolved explicitly.
 *
 * The cache came from modern PokéAPI, so it carries two types that don't exist in Gen I and
 * aren't in TYPE_COLORS or typeChart.js:
 *
 *   fairy — Clefairy, Clefable (pure fairy), Jigglypuff, Wigglytuff, Mr Mime
 *   steel — Magnemite, Magneton
 *
 * The print book got away with a silent grey fallback; type rooms and type badges won't.
 * Since this is a Gen I book, the resolution is to *drop* the post-Gen-I types, which
 * reproduces the original typing exactly in every affected case: Clefairy → Normal,
 * Jigglypuff → Normal, Mr Mime → Psychic, Magnemite → Electric. One rule, no id table, and
 * it keeps the type-room index at the 15 Gen I types.
 */
const POST_GEN_I_TYPES = new Set(['fairy', 'steel'])

/** The 15 Gen I types, in Pokédex-chart order (the key order of TYPE_COLORS). */
export const GEN_I_TYPES = Object.keys(TYPE_COLORS)

/** Strip post-Gen-I types; never return an empty list. */
export function toGenITypes(types = []) {
  const kept = types.filter(t => !POST_GEN_I_TYPES.has(t))
  return kept.length ? kept : ['normal']
}

export function isGenIType(type) {
  return Object.hasOwn(TYPE_COLORS, type)
}

/**
 * Colours for a type, resolving post-Gen-I types instead of silently greying out.
 * Unknown types still fall back to normal, but that path is now unreachable for the cache.
 */
export function getPlayTypeColors(type) {
  const [resolved] = toGenITypes([type])
  return TYPE_COLORS[resolved] ?? TYPE_COLORS.normal
}

/** A cache record's Gen I types. */
export function pokemonTypes(pokemon) {
  return toGenITypes(pokemon?.types)
}

/** A cache record's primary-type colours — the accent for its card, grid cell and badge. */
export function pokemonColors(pokemon) {
  return getPlayTypeColors(pokemonTypes(pokemon)[0])
}

/**
 * The three CSS custom properties every play component reads. Same contract as the print
 * book's PokemonPage, so nothing hardcodes a type colour.
 */
export function typeCssVars(type) {
  const { primary, light, accent } = getPlayTypeColors(type)
  return {
    '--color-primary': primary,
    '--color-light': light,
    '--color-accent': accent,
  }
}
