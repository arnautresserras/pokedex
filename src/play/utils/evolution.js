/**
 * A cache record's evolution chain, reduced to what Explore can draw: a list of stages, each
 * stage a list of Pokémon (more than one only where the chain branches).
 *
 * Two shapes in the data have to be absorbed here rather than in the component:
 *
 *   1. **Chains reach past Gen I.** Pikachu's starts at Pichu (172), Snorlax's at Munchlax
 *      (446). This is a Gen I book, so anything above 151 is dropped — the same filter the
 *      print book applies.
 *   2. **Eevee (133) branches**, and is the only one that does. Its chain is stored as
 *      `[{...}, { branches: [...] }]`, so a stage is a *list*, not an entry, everywhere.
 *
 * A chain that comes out with fewer than two stages (Ditto; Snorlax once Munchlax is dropped)
 * returns empty: a lone sprite under the card would look like a control that does nothing.
 */

let memoRoster = null
let memoById = null

function byId(roster) {
  if (roster === memoRoster) return memoById
  memoById = new Map(roster.map(p => [p.id, p]))
  memoRoster = roster
  return memoById
}

export function evolutionStages(roster, pokemon) {
  const chain = pokemon?.evolutionChain
  if (!Array.isArray(chain)) return []

  const lookup = byId(roster)
  const resolve = entry => lookup.get(entry?.id) ?? null

  const stages = chain
    .map(entry => (entry?.branches ? entry.branches.map(resolve) : [resolve(entry)]))
    // Gen I filter and cache misses in one pass; a stage that empties out disappears.
    .map(stage => stage.filter(p => p && p.id <= 151))
    .filter(stage => stage.length)

  return stages.length > 1 ? stages : []
}
