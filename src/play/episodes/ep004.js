export const EP004 = {
  id: 'ep004',
  code: 'EP004',
  protagonist: 'ash',
  start: 'weedle',
  scenes: {
    weedle: { type: 'encounter', backdrop: 'leaf-floor', pokemonId: 13, next: 'samurai' },
    samurai: { backdrop: 'sunlit-path', next: 'standoff' },
    standoff: { backdrop: 'sunlit-path', next: 'stalemate' },
    stalemate: { backdrop: 'sunlit-path', next: 'buzz' },
    buzz: { backdrop: 'dark-thicket', next: 'swarm' },
    swarm: { type: 'encounter', backdrop: 'dark-thicket', pokemonId: 15, next: 'rescue' },
    rescue: { backdrop: 'dark-thicket', next: 'apology' },
    apology: { backdrop: 'dark-thicket', next: 'evolve' },
    evolve: { type: 'encounter', backdrop: 'canopy', pokemonId: 12, next: 'ending' },
    ending: { type: 'ending', backdrop: 'sunlit-path' },
  },
}
