import cache from '../data/pokemon-cache.json'

export function useAllPokemon() {
  return cache
}

export function usePokemon(id) {
  return cache.find(p => p.id === Number(id)) ?? null
}
