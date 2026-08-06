export const EP008 = {
  id: 'ep008',
  code: 'EP008',
  protagonist: 'ash',
  start: 'gymAj',
  scenes: {
    gymAj: { backdrop: 'kanto-town', next: 'sandshrew' },
    sandshrew: { type: 'encounter', backdrop: 'kanto-town', pokemonId: 27, next: 'refusal' },
    refusal: { backdrop: 'kanto-town', next: 'training' },
    training: { backdrop: 'kanto-town', next: 'bond' },
    bond: { backdrop: 'kanto-town', next: 'teamrocket' },
    teamrocket: { backdrop: 'kanto-town', cast: ['team-rocket'], next: 'ending' },
    ending: { type: 'ending', backdrop: 'route1-trail' },
  },
}
