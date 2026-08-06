export const EP002 = {
  id: 'ep002',
  code: 'EP002',
  protagonist: 'ash',
  start: 'arrival',
  scenes: {
    arrival: { backdrop: 'pokemon-center', next: 'call' },
    call: { backdrop: 'pokemon-center', cast: ['oak'], next: 'teamrocket' },
    teamrocket: { backdrop: 'pokemon-center', cast: ['team-rocket'], next: 'evacuate' },
    evacuate: { backdrop: 'pokemon-center', cast: ['team-rocket'], next: 'rise' },
    rise: { backdrop: 'pokemon-center', next: 'thunder' },
    thunder: { type: 'encounter', backdrop: 'pokemon-center', pokemonId: 25, next: 'forest' },
    forest: { backdrop: 'forest-edge', next: 'forestEntry' },
    forestEntry: { backdrop: 'forest-edge', next: 'caterpie' },
    caterpie: { type: 'encounter', backdrop: 'leaf-floor', pokemonId: 10, next: 'ending' },
    ending: { type: 'ending', backdrop: 'leaf-floor' },
  },
}
