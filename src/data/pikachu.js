export const pikachu = {
  id: 25,
  name: 'Pikachu',
  types: ['electric'],
  category: 'Mouse Pokémon',
  height: 4,   // decimetres
  weight: 60,  // hectograms
  ability: 'Static',
  flavorTexts: [
    {
      text: 'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
      version: 'Red · Blue',
    },
    {
      text: 'It keeps its tail raised to monitor its surroundings. If you grab its tail, it will try to bite you.',
      version: 'Yellow',
    },
    {
      text: 'It raises its tail to check its surroundings. The tail is sometimes struck by lightning in that pose.',
      version: 'Gold',
    },
    {
      text: 'When it is angered, it immediately discharges the energy stored in the pouches in its cheeks.',
      version: 'Silver',
    },
  ],
  moves: [
    { name: 'Thunder Wave', type: 'electric', power: null, learnAt: 'Lv 9'  },
    { name: 'Quick Attack', type: 'normal',   power: 40,   learnAt: 'Lv 16' },
    { name: 'Swift',        type: 'normal',   power: 60,   learnAt: 'Lv 26' },
    { name: 'Agility',      type: 'psychic',  power: null, learnAt: 'Lv 33' },
    { name: 'Thunder',      type: 'electric', power: 120,  learnAt: 'Lv 41' },
  ],
  captureRate: 190,
  baseExperience: 112,
  growthRate: 'Medium Fast',
  eggGroups: ['Field', 'Fairy'],
  genderRate: 4,   // 50% ♂ / 50% ♀
  stats: [
    { name: 'hp',              value: 35 },
    { name: 'attack',          value: 55 },
    { name: 'defense',         value: 40 },
    { name: 'special-attack',  value: 50 },
    { name: 'special-defense', value: 50 },
    { name: 'speed',           value: 90 },
  ],
  sprites: {
    frontDefault: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  },
  evolutionChain: [
    { id: 25, name: 'Pikachu', trigger: null           },
    { id: 26, name: 'Raichu',  trigger: 'Thunder Stone' },
  ],
  locations: ['Viridian Forest', 'Power Plant'],
}
