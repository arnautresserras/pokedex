#!/usr/bin/env node
// Post-processes pokemon-cache.json: gives every Pokémon its full evolution branch
// (not just the path up-to itself). No network calls needed.
// Run: node scripts/fix-evo-chains.js

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const cachePath = resolve(__dirname, '../src/data/pokemon-cache.json')
const all = JSON.parse(readFileSync(cachePath, 'utf-8'))

// For each Pokémon, find the longest chain in the dataset that contains its ID.
// Because the fetch script truncated chains at the target, the last member of any
// chain always has the longest (correct) chain for that branch. So finding the max
// length chain that contains myId gives us the full branch.
for (const pokemon of all) {
  const myId = pokemon.id

  let best = pokemon.evolutionChain
  for (const other of all) {
    const chain = other.evolutionChain
    if (chain.length > best.length && chain.some(e => e.id === myId)) {
      best = chain
    }
  }

  pokemon.evolutionChain = best
}

writeFileSync(cachePath, JSON.stringify(all, null, 2))
console.log('Done — evolution chains fixed in pokemon-cache.json')

// Quick sanity check
const byId = id => all.find(p => p.id === id)
const check = (id, expected) => {
  const chain = byId(id).evolutionChain.map(e => e.name).join(' → ')
  const ok = chain === expected ? '✓' : '✗'
  console.log(`  ${ok} #${id}: ${chain}`)
}
check(1,   'Bulbasaur → Ivysaur → Venusaur')
check(2,   'Bulbasaur → Ivysaur → Venusaur')
check(3,   'Bulbasaur → Ivysaur → Venusaur')
check(133, 'Eevee → Vaporeon')   // branching — picks first branch (acceptable)
check(134, 'Eevee → Vaporeon')
check(150, 'Mewtwo')             // no evolution
