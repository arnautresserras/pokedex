export const mewtwo = {
  id: 150,
  name: 'Mewtwo',
  types: ['psychic'],
  category: 'Genetic Pokémon',
  height: 20,    // decimetres
  weight: 1220,  // hectograms
  ability: 'Pressure',
  flavorTexts: [
    {
      text: 'It was created by a scientist after years of horrific gene splicing and DNA engineering experiments.',
      version: 'Red · Blue',
    },
    {
      text: 'Its DNA is almost the same as MEW\'s. However, its size and disposition are vastly different.',
      version: 'Yellow',
    },
    {
      text: 'Because its battle abilities were raised to the ultimate level, it thinks only of defeating its foes.',
      version: 'Silver',
    },
    {
      text: 'A Pokémon created by recombining MEW\'s genes. It\'s said to have the most savage heart among all Pokémon.',
      version: 'FireRed',
    },
  ],
  moves: [
    { name: 'Psybeam',   type: 'psychic', power: 65,  learnAt: 'Lv 63' },
    { name: 'Barrier',   type: 'psychic', power: null, learnAt: 'Lv 73' },
    { name: 'Swift',     type: 'normal',  power: 60,  learnAt: 'Lv 83' },
    { name: 'Amnesia',   type: 'psychic', power: null, learnAt: 'Lv 93' },
    { name: 'Psychic',   type: 'psychic', power: 90,  learnAt: 'Lv 98' },
  ],
  captureRate: 3,
  baseExperience: 340,
  growthRate: 'Slow',
  eggGroups: ['Undiscovered'],
  genderRate: -1,   // genderless
  stats: [
    { name: 'hp',              value: 106 },
    { name: 'attack',          value: 110 },
    { name: 'defense',         value: 90  },
    { name: 'special-attack',  value: 154 },
    { name: 'special-defense', value: 90  },
    { name: 'speed',           value: 130 },
  ],
  sprites: {
    frontDefault: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
  },
  evolutionChain: [
    { id: 150, name: 'Mewtwo', trigger: null },
  ],
  locations: ['Cerulean Cave (post-game)'],
}
