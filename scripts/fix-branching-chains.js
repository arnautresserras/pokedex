#!/usr/bin/env node
// Post-processes pokemon-cache.json: merges branching evolution chains.
// For Eevee (and any future branching Pokémon), replaces truncated per-branch
// chains with a single { branches: [...] } entry that lists all options.
// No network calls needed. Run AFTER fix-evo-chains.js.
// Run: node scripts/fix-branching-chains.js

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const cachePath = resolve(__dirname, '../src/data/pokemon-cache.json')
const all = JSON.parse(readFileSync(cachePath, 'utf-8'))

// Group linear chains by their root Pokémon's ID.
// Each entry: { pokemon, secondEntry }
const rootGroups = {}
for (const pokemon of all) {
  const chain = pokemon.evolutionChain
  if (chain.length < 2 || chain[1]?.branches) continue // skip singles and already-merged
  const rootId = chain[0].id
  if (!rootGroups[rootId]) rootGroups[rootId] = []
  rootGroups[rootId].push({ pokemon, second: chain[1] })
}

// Detect branch points: roots with multiple distinct second entries.
for (const [rootId, entries] of Object.entries(rootGroups)) {
  const uniqueIds = new Set(entries.map(e => e.second.id))
  if (uniqueIds.size <= 1) continue // linear chain, nothing to do

  const root = entries[0].pokemon.evolutionChain[0]
  const branches = [...uniqueIds]
    .sort((a, b) => a - b)
    .map(id => entries.find(e => e.second.id === id).second)

  const mergedChain = [root, { branches }]
  const involvedIds = new Set([parseInt(rootId), ...branches.map(b => b.id)])

  for (const pokemon of all) {
    if (involvedIds.has(pokemon.id)) {
      pokemon.evolutionChain = mergedChain
    }
  }

  const names = branches.map(b => b.name).join(', ')
  console.log(`Merged: #${rootId} ${root.name} → [${names}]`)
}

writeFileSync(cachePath, JSON.stringify(all, null, 2))
console.log('Done — branching chains merged in pokemon-cache.json')

// Sanity checks
const byId = id => all.find(p => p.id === id)
const describeChain = id => {
  const chain = byId(id).evolutionChain
  const parts = chain.map(entry => {
    if (entry.branches) return `[${entry.branches.map(b => b.name).join(' | ')}]`
    return entry.name
  })
  return parts.join(' → ')
}
console.log('  #001 Bulbasaur:', describeChain(1))
console.log('  #133 Eevee:    ', describeChain(133))
console.log('  #134 Vaporeon: ', describeChain(134))
console.log('  #135 Jolteon:  ', describeChain(135))
console.log('  #136 Flareon:  ', describeChain(136))
console.log('  #150 Mewtwo:   ', describeChain(150))
