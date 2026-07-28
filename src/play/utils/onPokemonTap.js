/**
 * The single call site for "a Pokémon was tapped", used by Explore, Story and Game alike.
 *
 * It looks like indirection with nothing in it, and today it is. The point is the spec's P2
 * note: if the parent ever records name clips in their own voice, that becomes a one-file
 * change here instead of a hunt through three modes. It costs nothing to put in now and
 * can't be retrofitted cheaply later.
 *
 * The app is silent by design — this function must never gain an audio call while that
 * holds. scripts/verify-play.js asserts it.
 */
export function onPokemonTap(pokemon, { source, then } = {}) {
  if (!pokemon) return

  if (import.meta.env.DEV) {
    console.debug(`[play] tap ${pokemon.id} ${pokemon.name}${source ? ` (${source})` : ''}`)
  }

  then?.(pokemon)
}
