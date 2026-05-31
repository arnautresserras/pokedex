export const squirtle = {
  id: 7,
  name: 'Squirtle',
  types: ['water'],
  category: 'Tiny Turtle Pokémon',
  height: 5,   // decimetres
  weight: 90,  // hectograms
  ability: 'Torrent',
  flavorTexts: [
    {
      text: 'After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.',
      version: 'Red · Blue',
    },
    {
      text: 'It shelters itself in its shell then strikes back with spouts of water at every opportunity.',
      version: 'Yellow',
    },
    {
      text: 'When it retracts its long neck into its shell, it squirts out water with vigorous force.',
      version: 'Gold',
    },
    {
      text: 'The shell is soft when it is born. It soon becomes so resilient, it can withstand rocket fire.',
      version: 'Silver',
    },
  ],
  moves: [
    { name: 'Bubble',     type: 'water',  power: 20,  learnAt: 'Lv 8'  },
    { name: 'Water Gun',  type: 'water',  power: 40,  learnAt: 'Lv 15' },
    { name: 'Bite',       type: 'normal', power: 60,  learnAt: 'Lv 22' },
    { name: 'Skull Bash', type: 'normal', power: 100, learnAt: 'Lv 31' },
    { name: 'Hydro Pump', type: 'water',  power: 120, learnAt: 'Lv 42' },
  ],
  captureRate: 45,
  baseExperience: 63,
  growthRate: 'Medium Slow',
  eggGroups: ['Monster', 'Water 1'],
  genderRate: 1,   // 87.5% ♂ / 12.5% ♀
  stats: [
    { name: 'hp',              value: 44 },
    { name: 'attack',          value: 48 },
    { name: 'defense',         value: 65 },
    { name: 'special-attack',  value: 50 },
    { name: 'special-defense', value: 64 },
    { name: 'speed',           value: 43 },
  ],
  sprites: {
    frontDefault: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
  },
  evolutionChain: [
    { id: 7,  name: 'Squirtle',  trigger: null    },
    { id: 8,  name: 'Wartortle', trigger: 'Lv 16' },
    { id: 9,  name: 'Blastoise', trigger: 'Lv 36' },
  ],
  locations: ['Pallet Town (starter)'],
}
