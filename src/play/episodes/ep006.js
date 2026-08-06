export const EP006 = {
  id: 'ep006',
  code: 'EP006',
  protagonist: 'ash',
  start: 'climb',
  scenes: {
    climb: { backdrop: 'mt-moon-cave', cast: ['brock'], next: 'zubat' },
    zubat: { type: 'encounter', backdrop: 'mt-moon-cave', pokemonId: 41, next: 'clefairy' },
    clefairy: { type: 'encounter', backdrop: 'mt-moon-cave', pokemonId: 35, next: 'teamrocket' },
    teamrocket: { backdrop: 'mt-moon-cave', cast: ['team-rocket'], next: 'stone' },
    stone: { backdrop: 'mt-moon-cave', next: 'evolve' },
    evolve: { type: 'encounter', backdrop: 'mt-moon-cave', pokemonId: 36, next: 'ending' },
    ending: { type: 'ending', backdrop: 'kanto-town' },
  },
}
