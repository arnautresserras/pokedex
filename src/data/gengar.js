export const gengar = {
  id: 94,
  name: 'Gengar',
  types: ['ghost', 'poison'],
  category: 'Shadow Pokémon',
  height: 15,   // decimetres
  weight: 405,  // hectograms
  ability: 'Levitate',
  flavorTexts: [
    {
      text: 'Under a full moon, this Pokémon likes to mimic the shadows of people and laugh at their fright.',
      version: 'Red · Blue',
    },
    {
      text: 'On the night of a full moon, if shadows move on their own and laugh, it must be GENGAR\'s doing.',
      version: 'Yellow',
    },
    {
      text: 'On a dark night, look at its shadow. If it is shaped like GENGAR, beware. It will try to curse you.',
      version: 'Gold',
    },
    {
      text: 'If you feel a sudden chill, it may be because a GENGAR appeared. It absorbs the heat from the area.',
      version: 'Crystal',
    },
  ],
  moves: [
    { name: 'Lick',        type: 'ghost',  power: 20,  learnAt: 'Lv 1'  },
    { name: 'Hypnosis',    type: 'psychic', power: null, learnAt: 'Lv 12' },
    { name: 'Night Shade', type: 'ghost',  power: null, learnAt: 'Lv 27' },
    { name: 'Confuse Ray', type: 'ghost',  power: null, learnAt: 'Lv 35' },
    { name: 'Dream Eater', type: 'psychic', power: 100, learnAt: 'Lv 50' },
  ],
  captureRate: 45,
  baseExperience: 190,
  growthRate: 'Medium Slow',
  eggGroups: ['Amorphous'],
  genderRate: 4,   // 50% ♂ / 50% ♀
  stats: [
    { name: 'hp',              value: 60  },
    { name: 'attack',          value: 65  },
    { name: 'defense',         value: 60  },
    { name: 'special-attack',  value: 130 },
    { name: 'special-defense', value: 75  },
    { name: 'speed',           value: 110 },
  ],
  sprites: {
    frontDefault: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
  },
  evolutionChain: [
    { id: 92, name: 'Gastly',  trigger: null    },
    { id: 93, name: 'Haunter', trigger: 'Lv 25' },
    { id: 94, name: 'Gengar',  trigger: 'Trade'  },
  ],
  locations: ['Evolve Haunter (Trade)'],
}
