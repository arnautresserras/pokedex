export const charmander = {
  id: 4,
  name: 'Charmander',
  types: ['fire'],
  category: 'Lizard Pokémon',
  height: 6,   // decimetres
  weight: 85,  // hectograms
  ability: 'Blaze',
  flavorTexts: [
    {
      text: 'Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.',
      version: 'Red · Blue',
    },
    {
      text: 'The flame at the tip of its tail makes a sound as it burns. You can only hear it in quiet places.',
      version: 'Yellow',
    },
    {
      text: 'If its tail flame ever goes out, CHARMANDER\'s life is over. As it tires, its tail flame grows smaller.',
      version: 'Silver',
    },
    {
      text: 'The flame burns hotter with strong feelings. The stronger its emotions, the more intensely it blazes.',
      version: 'Crystal',
    },
  ],
  moves: [
    { name: 'Ember',        type: 'fire',   power: 40,  learnAt: 'Lv 9'  },
    { name: 'Leer',         type: 'normal', power: null, learnAt: 'Lv 15' },
    { name: 'Slash',        type: 'normal', power: 70,  learnAt: 'Lv 30' },
    { name: 'Flamethrower', type: 'fire',   power: 95,  learnAt: 'Lv 38' },
    { name: 'Fire Spin',    type: 'fire',   power: 15,  learnAt: 'Lv 46' },
  ],
  captureRate: 45,
  baseExperience: 62,
  growthRate: 'Medium Slow',
  eggGroups: ['Monster', 'Dragon'],
  genderRate: 1,   // 87.5% ♂ / 12.5% ♀
  stats: [
    { name: 'hp',              value: 39 },
    { name: 'attack',          value: 52 },
    { name: 'defense',         value: 43 },
    { name: 'special-attack',  value: 60 },
    { name: 'special-defense', value: 50 },
    { name: 'speed',           value: 65 },
  ],
  sprites: {
    frontDefault: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
  },
  evolutionChain: [
    { id: 4, name: 'Charmander',  trigger: null     },
    { id: 5, name: 'Charmeleon',  trigger: 'Lv 16'  },
    { id: 6, name: 'Charizard',   trigger: 'Lv 36'  },
  ],
  locations: ['Pallet Town (starter)'],
}
