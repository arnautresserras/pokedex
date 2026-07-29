import { CATCH_LOCATIONS } from '../../data/catchLocations.js'

/**
 * Who a story can meet, and where.
 *
 * A story's terminal scene is a wild encounter, and the cast has to come from the real game
 * or the encounter is just a random Pokémon in a random place. `CATCH_LOCATIONS` is the only
 * real location data in the repo (the cache's own `locations` array is empty on all 151
 * records) — but it's keyed the wrong way round for this, id → routes, so it gets inverted
 * once here.
 *
 * `STORY_POOLS` is the other half: a story names a **place**, not a cast list. That's the
 * whole reason the encounter is data rather than a hand-picked array of ids — the forest's
 * residents are whoever Gen I says lives in the forest, and if a story ever visits a cave the
 * cast comes free.
 *
 * Explicit `.js` on the import, and no other imports at all: `scripts/verify-play.js` runs
 * this under plain Node to prove no story can end on an empty pool.
 */

/** Story place → the Gen I locations it stands for. Names must match `CATCH_LOCATIONS` exactly. */
export const STORY_POOLS = {
  // Viridian Forest and the route it opens onto — Caterpie, Metapod, Weedle, Kakuna and
  // Pikachu in the forest proper, plus Pidgey and Rattata out where the trees thin. Seven,
  // which is enough that a child can meet a new one several visits running.
  forest: ['Viridian Forest', 'Route 2'],
}

/** location → ids, built once. `CATCH_LOCATIONS` is a committed constant, so once is enough. */
let memoIndex = null

function byLocation() {
  if (memoIndex) return memoIndex

  const index = new Map()
  for (const [id, locations] of Object.entries(CATCH_LOCATIONS)) {
    for (const location of locations) {
      if (!index.has(location)) index.set(location, [])
      index.get(location).push(Number(id))
    }
  }
  memoIndex = index
  return index
}

/** The ids a pool resolves to, deduplicated — two routes can share a resident. */
export function poolIds(pool) {
  const ids = new Set()
  for (const location of STORY_POOLS[pool] ?? []) {
    for (const id of byLocation().get(location) ?? []) ids.add(id)
  }
  return [...ids].sort((a, b) => a - b)
}

/** The pool as cache records, in dex order. */
export function poolMembers(roster, pool) {
  const ids = new Set(poolIds(pool))
  return roster.filter(pokemon => ids.has(pokemon.id))
}

/**
 * One encounter. `recent` bars the last few met from coming up again — the same reasoning as
 * Game's recent list, and it matters more here: a pool of seven repeats constantly, and
 * meeting the same Caterpie twice in a row reads as the story being broken rather than as the
 * forest being small.
 */
export function pickEncounter(roster, pool, { recent = [] } = {}) {
  const members = poolMembers(roster, pool)
  if (!members.length) return null

  const excluded = new Set(recent)
  const fresh = members.filter(pokemon => !excluded.has(pokemon.id))
  const from = fresh.length ? fresh : members
  return from[Math.floor(Math.random() * from.length)]
}
