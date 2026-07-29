import { pokemonTypes } from './playColors'
import { pokemonTraits } from './traits'

/**
 * One round of "Who's that Pokémon?" — an answer plus two distractors.
 *
 * The whole round is data, built by a pure function, because it's the only part of Game mode
 * with any logic in it at all. The plan is explicit that the logic is trivial and the reveal is
 * the feature; keeping the round here is what stops the screen from growing a state machine
 * around it.
 *
 * **The options are pictures, not names.** The player can't read, so a list of names isn't an
 * option — literally. So the round is a shape match: one black silhouette above, three
 * full-colour arts below, all four drawn from the *same* vendored artwork file, so the pose the
 * child is matching is the pose they're looking at. (A pixel sprite would be a different pose
 * of the same Pokémon, which turns an easy match into a trick question.)
 *
 * Which makes "visually distinct distractors" load-bearing rather than a nicety: if two of the
 * three options share a silhouette the round has no correct answer a child could defend. There
 * is no image analysis here, so distinctness is inferred from the three things in the cache
 * that track how a shape reads at a glance:
 *
 *   family — Caterpie and Metapod are the same drawing twice; nothing else comes close
 *   type   — the primary type is the colour the option is painted in
 *   height — the ranked band (see `traits.js`), a proxy for tall-vs-squat
 *
 * All three are required first; the ladder below relaxes them in order if a candidate can't be
 * found. `family` is last to go because it's the only one whose failure is actually ambiguous —
 * two Pokémon of the same type and height are still two different shapes.
 */

const OPTIONS = 3

/**
 * Strictness ladder, tried in order. The loosest tier needs three distinct families out of
 * 151 and can't fail, so `buildRound` always returns a full set of options.
 */
const LADDER = [
  { family: true, type: true, height: true },
  { family: true, type: true, height: false },
  { family: true, type: false, height: false },
]

/**
 * id → family key: the lowest id in its evolution chain, so every member of a family shares
 * one key. Same single-entry memo as `membersByType` and `pokemonTraits`, for the same reason —
 * the roster is the committed cache and never changes identity.
 *
 * Chain entries above 151 are kept deliberately: this is an identity, not a display list, and
 * Pichu's 172 loses the `min` to Pikachu's 25 anyway.
 */
let memoRoster = null
let memoFamilies = null

function familyKeys(roster) {
  if (roster === memoRoster) return memoFamilies

  const keys = new Map()
  for (const pokemon of roster) {
    const chain = Array.isArray(pokemon.evolutionChain) ? pokemon.evolutionChain : []
    const ids = chain
      .flatMap(entry => (entry?.branches ? entry.branches : [entry]))
      .map(entry => entry?.id)
      .filter(Number.isInteger)
    keys.set(pokemon.id, ids.length ? Math.min(...ids) : pokemon.id)
  }

  memoRoster = roster
  memoFamilies = keys
  return keys
}

function heightLevel(roster, pokemon) {
  return pokemonTraits(roster, pokemon).find(trait => trait.id === 'height')?.level ?? 0
}

function distinct(roster, a, b, rules) {
  if (a.id === b.id) return false
  if (rules.family && familyKeys(roster).get(a.id) === familyKeys(roster).get(b.id)) return false
  if (rules.type && pokemonTypes(a)[0] === pokemonTypes(b)[0]) return false
  if (rules.height && heightLevel(roster, a) === heightLevel(roster, b)) return false
  return true
}

function shuffled(list) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function pickDistractors(roster, answer, rules) {
  const chosen = []
  for (const candidate of shuffled(roster)) {
    if (chosen.length === OPTIONS - 1) break
    if (!distinct(roster, candidate, answer, rules)) continue
    if (!chosen.every(other => distinct(roster, candidate, other, rules))) continue
    chosen.push(candidate)
  }
  return chosen
}

/**
 * `{ answer, options }` — `options` is the answer plus two distractors, already shuffled, so
 * the screen renders them in order and never has to know which position is right.
 *
 * `recent` is the last few answers, excluded from being picked again: the pool is 151 deep, but
 * random with replacement repeats often enough that a child would notice, and a repeat right
 * after a reveal makes the game look broken rather than random.
 */
export function buildRound(roster, { recent = [] } = {}) {
  const excluded = new Set(recent)
  const pool = roster.filter(pokemon => !excluded.has(pokemon.id))
  const answer = shuffled(pool.length ? pool : roster)[0]

  let distractors = []
  for (const rules of LADDER) {
    distractors = pickDistractors(roster, answer, rules)
    if (distractors.length === OPTIONS - 1) break
  }

  return { answer, options: shuffled([answer, ...distractors]) }
}
