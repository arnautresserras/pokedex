export const EP009 = {
  id: 'ep009',
  code: 'EP009',
  protagonist: 'ash',
  start: 'school',
  scenes: {
    school: { backdrop: 'tech-school', next: 'giselle' },
    giselle: { backdrop: 'tech-school', next: 'cubone' },
    cubone: { type: 'encounter', backdrop: 'tech-school', pokemonId: 104, next: 'graveler' },
    graveler: { type: 'encounter', backdrop: 'tech-school', pokemonId: 75, next: 'battle' },
    battle: { backdrop: 'tech-school', next: 'ending' },
    ending: { type: 'ending', backdrop: 'route1-trail' },
  },
}
