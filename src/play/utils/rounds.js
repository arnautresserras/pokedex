import { GEN_I_TYPES, pokemonTypes } from './playColors'
import { pokemonTraits } from './traits'
import { evolutionStages } from './evolution'

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
 * after a reveal makes the game look broken rather than random. `recentIds` on the return value
 * is what `Game` folds into that list — every `build*Round` function returns one, so `Game`
 * never has to know which fields a particular round shape uses to identify "what was just
 * asked".
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

  return { answer, options: shuffled([answer, ...distractors]), recentIds: [answer.id] }
}

/**
 * One round of "Quin color?" — a Pokémon plus two distractor types, alongside its own primary
 * type. Same pool-and-exclude shape as `buildRound`, but the options are types rather than
 * Pokémon: this activity drills the type-to-colour link Explore's rooms already teach, not
 * silhouette recognition, so mixing it into Game gives the child a second way to play with the
 * thing she already gravitates to.
 */
export function buildTypeRound(roster, { recent = [] } = {}) {
  const excluded = new Set(recent)
  const pool = roster.filter(pokemon => !excluded.has(pokemon.id))
  const answer = shuffled(pool.length ? pool : roster)[0]
  const answerType = pokemonTypes(answer)[0]

  const distractors = shuffled(GEN_I_TYPES.filter(t => t !== answerType)).slice(0, OPTIONS - 1)

  return { answer, options: shuffled([answerType, ...distractors]), recentIds: [answer.id] }
}

/**
 * Groups the roster by family key, keeping only families with more than one Gen I member —
 * the shape both `buildFamilyRound` and `buildEvolutionRound` start from, since both need "a
 * chain with something to say about it" rather than any single Pokémon.
 */
function familiesWithMembers(roster) {
  const keys = familyKeys(roster)
  const byFamily = new Map()
  for (const pokemon of roster) {
    const key = keys.get(pokemon.id)
    if (!byFamily.has(key)) byFamily.set(key, [])
    byFamily.get(key).push(pokemon)
  }
  return [...byFamily.values()].filter(members => members.length > 1)
}

/**
 * One round of "Qui és de la família?" — a Pokémon (`prompt`) plus three options, one of which
 * (`answer`) shares its evolution family. The distractors reuse `buildRound`'s exact ladder and
 * `pickDistractors`: every rung requires `family: true`, so a distractor can never come from
 * the prompt's own family without any extra bookkeeping here.
 *
 * `prompt` and `answer` are deliberately two different members of the family rather than the
 * same Pokémon twice — the question is "who belongs with this one", and asking a child to pick
 * the picture already on screen wouldn't be a question at all.
 */
export function buildFamilyRound(roster, { recent = [] } = {}) {
  const excluded = new Set(recent)
  const families = familiesWithMembers(roster)

  const available = families.filter(members => !members.every(m => excluded.has(m.id)))
  const members = shuffled(available.length ? available : families)[0]
  const [prompt, answer] = shuffled(members).slice(0, 2)

  let distractors = []
  for (const rules of LADDER) {
    distractors = pickDistractors(roster, answer, rules)
    if (distractors.length === OPTIONS - 1) break
  }

  return {
    prompt,
    answer,
    options: shuffled([answer, ...distractors]),
    recentIds: [prompt.id, answer.id],
  }
}

/** Chains this short and this simple (no branch, Gen I only) — see `evolutionOrderChains`. */
const ORDER_MIN_STAGES = 2
const ORDER_MAX_STAGES = 3

/**
 * Every family whose chain is a plain, unbranched line of 2–3 Gen I stages — the shape
 * `buildEvolutionRound` needs. Eevee is the one branching chain in the cache and is excluded
 * here rather than handled: "put these in order" has one right answer only when there's one
 * chain, and a branch means more than one Pokémon could legitimately come next.
 */
function evolutionOrderChains(roster) {
  const chains = []
  for (const members of familiesWithMembers(roster)) {
    const stages = evolutionStages(roster, members[0])
    if (stages.length < ORDER_MIN_STAGES || stages.length > ORDER_MAX_STAGES) continue
    if (stages.some(stage => stage.length > 1)) continue
    chains.push(stages.map(stage => stage[0]))
  }
  return chains
}

/**
 * One round of "Ordena l'evolució" — a chain's stages, shuffled for display in `order`, with
 * the correct sequence kept separately in `sequence` for the component to check taps against.
 * `EvolutionOrderGame` owns all of the actual tap-by-tap state; this only has to hand it a fair
 * chain to work with.
 */
export function buildEvolutionRound(roster, { recent = [] } = {}) {
  const excluded = new Set(recent)
  const chains = evolutionOrderChains(roster)

  const available = chains.filter(sequence => !sequence.every(p => excluded.has(p.id)))
  const sequence = shuffled(available.length ? available : chains)[0]

  return {
    sequence,
    order: shuffled(sequence),
    recentIds: sequence.map(p => p.id),
  }
}

/** Pairs on the board — six is a full round without turning into a search. */
const MEMORY_PAIRS = 6

/**
 * One round of "Memory" — `MEMORY_PAIRS` Pokémon, each as two face-down cards, shuffled into
 * one grid. The skill here isn't identification (both cards of a pair are the same artwork) —
 * it's remembering *where* things are, so distinctness rules don't apply the way they do
 * elsewhere in this file: any six Pokémon make a fair board.
 */
export function buildMemoryRound(roster, { recent = [] } = {}) {
  const excluded = new Set(recent)
  const pool = shuffled(roster).filter(pokemon => !excluded.has(pokemon.id))
  const chosen = (pool.length >= MEMORY_PAIRS ? pool : shuffled(roster)).slice(0, MEMORY_PAIRS)

  const cards = shuffled(
    chosen.flatMap(pokemon => [
      { key: `${pokemon.id}-a`, pokemon },
      { key: `${pokemon.id}-b`, pokemon },
    ]),
  )

  return { cards, recentIds: chosen.map(p => p.id) }
}
