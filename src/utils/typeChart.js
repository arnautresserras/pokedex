// Gen I type chart (15 types, defensive perspective)
// Notable Gen I specifics:
//   Ghost → Psychic = 0× (programming bug — intended 2×)
//   Bug → Poison = 2× (changed in Gen II+)
//   Poison → Bug = 2× (changed in Gen II+)
const TYPE_DEFENSE = {
  normal:   { weak: ['fighting'],                                        immune: ['ghost'] },
  fire:     { weak: ['water', 'ground', 'rock'],                         resist: ['fire', 'grass', 'bug'] },
  water:    { weak: ['electric', 'grass'],                               resist: ['fire', 'water', 'ice'] },
  electric: { weak: ['ground'],                                          resist: ['electric', 'flying'] },
  grass:    { weak: ['fire', 'ice', 'poison', 'flying', 'bug'],          resist: ['water', 'electric', 'grass', 'ground'] },
  ice:      { weak: ['fire', 'fighting', 'rock'],                        resist: ['ice'] },
  fighting: { weak: ['flying', 'psychic'],                               resist: ['bug', 'rock'] },
  poison:   { weak: ['ground', 'psychic', 'bug'],                        resist: ['grass', 'fighting', 'poison'] },
  ground:   { weak: ['water', 'grass', 'ice'],                           resist: ['poison', 'rock'],              immune: ['electric'] },
  flying:   { weak: ['electric', 'ice', 'rock'],                         resist: ['grass', 'fighting', 'bug'],    immune: ['ground'] },
  psychic:  { weak: ['bug'],                                             resist: ['fighting', 'psychic'],          immune: ['ghost'] },
  bug:      { weak: ['fire', 'flying', 'rock'],                          resist: ['grass', 'fighting', 'ground'] },
  rock:     { weak: ['water', 'grass', 'fighting', 'ground'],            resist: ['normal', 'fire', 'poison', 'flying'] },
  ghost:    { weak: ['ghost'],                                           resist: ['poison'],                      immune: ['normal', 'fighting'] },
  dragon:   { weak: ['dragon'],                                          resist: ['fire', 'water', 'electric', 'grass'] },
}

export const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic',
  'bug', 'rock', 'ghost', 'dragon',
]

export function getTypeMultiplier(attackType, defendType) {
  return multiplierFor(attackType, defendType)
}

function multiplierFor(attackType, defendType) {
  const d = TYPE_DEFENSE[defendType] ?? {}
  if (d.immune?.includes(attackType)) return 0
  if (d.weak?.includes(attackType))   return 2
  if (d.resist?.includes(attackType)) return 0.5
  return 1
}

// Returns types that at least one of this Pokémon's attack types hits for 2×.
export function getOffensiveMatchups(types) {
  return ALL_TYPES.filter(def =>
    types.some(atk => multiplierFor(atk, def) >= 2)
  )
}

// Returns { weak, resist, immune } for a Pokémon with the given types array.
// weak and resist are [{ type, multiplier }], sorted so extreme values come first.
// immune is a plain string array.
export function getTypeMatchups(types) {
  const weak = [], resist = [], immune = []

  for (const atk of ALL_TYPES) {
    let m = 1
    for (const def of types) m *= multiplierFor(atk, def)
    if (m === 0)    immune.push(atk)
    else if (m >= 2) weak.push({ type: atk, multiplier: m })
    else if (m < 1)  resist.push({ type: atk, multiplier: m })
  }

  weak.sort((a, b) => b.multiplier - a.multiplier)
  resist.sort((a, b) => a.multiplier - b.multiplier)

  return { weak, resist, immune }
}
