export const EP010 = {
  id: 'ep010',
  code: 'EP010',
  protagonist: 'ash',
  start: 'oddish',
  scenes: {
    oddish: { type: 'encounter', backdrop: 'hidden-glade', pokemonId: 43, next: 'bulbasaur' },
    bulbasaur: { type: 'encounter', backdrop: 'hidden-glade', pokemonId: 1, next: 'bridge' },
    bridge: { backdrop: 'hidden-glade', cast: ['brock'], next: 'village' },
    village: { backdrop: 'hidden-glade', next: 'sanctuary' },
    sanctuary: { backdrop: 'hidden-glade', next: 'teamrocket' },
    teamrocket: { backdrop: 'hidden-glade', cast: ['team-rocket'], next: 'join' },
    join: { type: 'encounter', backdrop: 'hidden-glade', pokemonId: 1, next: 'ending' },
    ending: { type: 'ending', backdrop: 'route1-trail' },
  },
}
