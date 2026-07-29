/**
 * The card's "what it's like" row: how big, how heavy, how fast — as three 1-of-5 levels.
 *
 * **Ranked, not scaled.** Gen I's raw ranges are wildly skewed: weight runs 1hg (Gastly) to
 * 4600hg (Snorlax), and a linear scale puts 140 of the 151 in the bottom fifth — every
 * Pokémon a child taps would show the same one pip, which tells them nothing. Ranking each
 * value against all 151 instead means the five levels are five equal-sized groups, so the
 * meters actually distinguish the things a child would compare.
 *
 * This is also why there are no numbers on the card. "45.5 kg" is meaningless at four; "more
 * pips than the last one" is the entire idea, and it only works if the pips move.
 */

const LEVELS = 5

/** height and weight are cache units (decimetres / hectograms); speed is the base stat. */
export const TRAITS = [
  { id: 'height', label: 'Alçada', value: p => p.height },
  { id: 'weight', label: 'Pes', value: p => p.weight },
  { id: 'speed', label: 'Velocitat', value: p => statValue(p, 'speed') },
]

function statValue(pokemon, name) {
  return pokemon.stats?.find(s => s.name === name)?.value ?? 0
}

/**
 * Sorted value lists, one per trait, built once. Same single-entry memo as `membersByType`
 * and for the same reason: the roster is the committed cache and never changes identity.
 */
let memoRoster = null
let memoSorted = null

function sortedValues(roster) {
  if (roster === memoRoster) return memoSorted
  memoSorted = new Map(
    TRAITS.map(trait => [trait.id, roster.map(trait.value).sort((a, b) => a - b)]),
  )
  memoRoster = roster
  return memoSorted
}

/**
 * Where `value` falls among all 151, as 1–5. Ties share a level — the eleven Pokémon that
 * weigh exactly 300hg must not land in different groups depending on array order.
 */
function levelOf(value, sorted) {
  // Count of strictly-smaller values, so a run of equal values starts at the same rank.
  let low = 0
  let high = sorted.length
  while (low < high) {
    const mid = (low + high) >> 1
    if (sorted[mid] < value) low = mid + 1
    else high = mid
  }
  const rank = low / sorted.length
  return Math.min(LEVELS, Math.floor(rank * LEVELS) + 1)
}

/** `[{ id, label, level, levels }]` — everything `TraitMeters` needs and nothing else. */
export function pokemonTraits(roster, pokemon) {
  const sorted = sortedValues(roster)
  return TRAITS.map(trait => ({
    id: trait.id,
    label: trait.label,
    level: levelOf(trait.value(pokemon), sorted.get(trait.id)),
    levels: LEVELS,
  }))
}
