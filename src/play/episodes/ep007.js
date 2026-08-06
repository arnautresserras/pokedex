export const EP007 = {
  id: 'ep007',
  code: 'EP007',
  protagonist: 'ash',
  start: 'arrival',
  scenes: {
    arrival: { backdrop: 'kanto-town', next: 'sisters' },
    sisters: { backdrop: 'cerulean-gym', next: 'excuse' },
    excuse: { backdrop: 'cerulean-gym', next: 'misty' },
    misty: { backdrop: 'cerulean-gym', cast: ['misty'], next: 'staryu' },
    staryu: { type: 'encounter', backdrop: 'cerulean-gym', pokemonId: 120, next: 'starmie' },
    starmie: { type: 'encounter', backdrop: 'cerulean-gym', pokemonId: 121, next: 'teamrocket' },
    teamrocket: { backdrop: 'cerulean-gym', cast: ['team-rocket'], next: 'badge' },
    badge: { backdrop: 'cerulean-gym', cast: ['misty'], next: 'ending' },
    ending: { type: 'ending', backdrop: 'kanto-town' },
  },
}
