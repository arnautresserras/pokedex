export const bulbasaur = {
  id: 1,
  name: 'Bulbasaur',
  types: ['grass', 'poison'],
  category: 'Seed Pokémon',
  height: 7,   // decimetres
  weight: 69,  // hectograms
  ability: 'Overgrow',
  flavorTexts: [
    {
      text: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.',
      version: 'Red · Blue',
    },
    {
      text: 'It can go for days without eating a single morsel. In the bulb on its back, it stores energy.',
      version: 'Yellow',
    },
    {
      text: 'The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.',
      version: 'Gold',
    },
    {
      text: 'The seed on its back is filled with nutrients. The seed grows steadily larger as its body grows.',
      version: 'Silver',
    },
  ],
  moves: [
    { name: 'Vine Whip',     type: 'grass',  power: 35,  learnAt: 'Lv 13' },
    { name: 'Poison Powder', type: 'poison', power: null, learnAt: 'Lv 22' },
    { name: 'Razor Leaf',    type: 'grass',  power: 55,  learnAt: 'Lv 29' },
    { name: 'Sleep Powder',  type: 'grass',  power: null, learnAt: 'Lv 43' },
    { name: 'Solar Beam',    type: 'grass',  power: 120, learnAt: 'Lv 53' },
  ],
  // Training & breeding (from pokemon-species endpoint)
  captureRate: 45,
  baseExperience: 64,
  growthRate: 'Medium Slow',
  eggGroups: ['Monster', 'Grass'],
  genderRate: 1,   // eighths female; 1 = 87.5% ♂ / 12.5% ♀
  stats: [
    { name: 'hp',               value: 45 },
    { name: 'attack',           value: 49 },
    { name: 'defense',          value: 49 },
    { name: 'special-attack',   value: 65 },
    { name: 'special-defense',  value: 65 },
    { name: 'speed',            value: 45 },
  ],
  sprites: {
    frontDefault: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
  },
  evolutionChain: [
    { id: 1, name: 'Bulbasaur',  trigger: null },
    { id: 2, name: 'Ivysaur',   trigger: 'Lv 16' },
    { id: 3, name: 'Venusaur',  trigger: 'Lv 32' },
  ],
  locations: ['Pallet Town (starter)'],
}
