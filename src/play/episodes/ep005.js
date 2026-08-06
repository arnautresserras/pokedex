export const EP005 = {
  id: 'ep005',
  code: 'EP005',
  protagonist: 'ash',
  start: 'arrival',
  scenes: {
    arrival: { backdrop: 'kanto-town', next: 'league' },
    league: { backdrop: 'kanto-town', next: 'gym1' },
    gym1: { type: 'encounter', backdrop: 'pewter-gym', pokemonId: 74, next: 'gym2' },
    gym2: { type: 'encounter', backdrop: 'pewter-gym', pokemonId: 95, next: 'training' },
    training: { backdrop: 'kanto-town', next: 'waterwheel' },
    waterwheel: { backdrop: 'kanto-town', next: 'rematch' },
    rematch: { type: 'encounter', backdrop: 'pewter-gym', pokemonId: 95, next: 'badge' },
    badge: { backdrop: 'pewter-gym', cast: ['brock'], next: 'brockJoins' },
    brockJoins: { backdrop: 'pewter-gym', cast: ['brock'], next: 'ending' },
    ending: { type: 'ending', backdrop: 'kanto-town' },
  },
}
