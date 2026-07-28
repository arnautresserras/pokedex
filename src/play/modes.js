/**
 * The three play modes, as data.
 *
 * Home renders these as tiles, `PlayApp` derives its routes from them, and each mode screen
 * reads its own entry for colour — so a mode's identity (colour, pictogram, route, label)
 * lives in exactly one place. Adding a fourth mode later is an entry here plus a glyph.
 *
 * **Colour is the mode's name** for a child who can't read one: the tile, the entry
 * transition and everything inside the mode share a single hue, and the three hues are far
 * apart (blue / violet / amber) so they're told apart at a glance and across the room.
 * They deliberately sit outside `TYPE_COLORS` — a mode must never be mistaken for a type
 * room — but keep the same `primary` / `light` / `accent` shape so components read the same
 * three CSS custom properties the print book's cards do.
 *
 * Labels are Catalan, and they're a bonus rather than the affordance: the pictogram carries
 * the meaning (the P0 criterion is that a non-reader reaches all three unaided), and the word
 * is there for the parent and for a child who'll learn its shape — the same reasoning the
 * spec gives for showing Pokémon names as text.
 */

export const MODES = [
  {
    id: 'explore',
    label: 'Explora',
    colors: { primary: '#2F8FD8', light: '#DCEDFC', accent: '#124D84' },
  },
  {
    id: 'story',
    label: 'Contes',
    colors: { primary: '#7A5CD0', light: '#E7DFFB', accent: '#3A2680' },
  },
  {
    id: 'game',
    label: 'Endevina',
    colors: { primary: '#F2A03D', light: '#FFEDD2', accent: '#9C5406' },
  },
]

const BY_ID = new Map(MODES.map(mode => [mode.id, mode]))

export function getMode(id) {
  return BY_ID.get(id)
}

/** The mode's route. Its id is its path segment under /play — one source, no drift. */
export function modePath(mode) {
  return `/play/${mode.id}`
}

/** Same contract as the print book's type theming: components read only these three. */
export function modeCssVars(mode) {
  const { primary, light, accent } = (mode ?? MODES[0]).colors
  return {
    '--color-primary': primary,
    '--color-light': light,
    '--color-accent': accent,
  }
}
