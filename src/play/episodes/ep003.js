export const EP003 = {
  id: 'ep003',
  code: 'EP003',
  protagonist: 'ash',
  start: 'throw',
  scenes: {
    throw: { backdrop: 'leaf-floor', next: 'catch' },
    catch: { type: 'encounter', backdrop: 'leaf-floor', pokemonId: 10, next: 'bond' },
    bond: { backdrop: 'canopy', next: 'dream' },
    dream: { backdrop: 'canopy', cast: ['misty'], next: 'pidgeotto' },
    pidgeotto: { type: 'encounter', backdrop: 'sunlit-path', pokemonId: 17, next: 'teamrocket' },
    teamrocket: { backdrop: 'leaf-floor', cast: ['team-rocket'], next: 'battle' },
    battle: { backdrop: 'leaf-floor', cast: ['team-rocket'], next: 'evolve' },
    evolve: { type: 'encounter', backdrop: 'canopy', pokemonId: 11, next: 'ending' },
    ending: { type: 'ending', backdrop: 'leaf-floor' },
  },
}
